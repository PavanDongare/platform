import { NextRequest, NextResponse } from 'next/server'
import { appendFile } from 'fs/promises'
import { getUserContext } from '@/lib/auth/get-user-context'
import { extractOpenRouterText, openRouterChat } from '@/lib/openrouter'

const MODEL = process.env.OPENROUTER_INTERVIEW_MODEL || 'moonshotai/kimi-k2.5'

const SYSTEM_PROMPT = `You are a live interview gap-finder.

Input: rolling conversation snippets between interviewer and candidate.
Goal: propose new points the speaker has NOT covered yet.
Output: short missed-angle bullets the candidate can immediately talk about.

Rules:
- Return bullet points only (plain text).
- You may return an empty response if there are no genuinely new points.
- Each bullet must be a short phrase (2-7 words).
- No full sentences. No punctuation-heavy text.
- No coaching/meta phrases (avoid things like "start with", "be concise", "explain clearly").
- Prefer concrete technical/business concepts, tradeoffs, metrics, architecture options, risks, and examples.
- Include multiple alternative angles/options.
- Prioritize novelty: suggest what is missing, not what was already said.
- Treat semantic rewording as repetition (do not paraphrase existing bullets).
- Only include high-signal additions: new mechanism, new risk, new metric, new tradeoff, or new alternative.
- If candidate bullets are weak/obvious/redundant, return empty output.
- Avoid repeating prior concepts unless truly new context requires it.`

interface Utterance {
  text: string
  hint?: string
}

interface ConceptRequestBody {
  text?: string
  history?: Utterance[]
  previousConcepts?: string[]
}

interface ConceptResponseBody {
  concepts: string[]
  source?: 'model' | 'fallback'
  debug?: {
    requestId: string
    reason?: string
    model: string
    rawPreview?: string
  }
}

const DEBUG_LOG_FILE = '/tmp/interview-guide-debug.log'

async function writeDebugLog(event: string, data: Record<string, unknown>) {
  const line = JSON.stringify({ ts: new Date().toISOString(), event, ...data }) + '\n'
  try {
    await appendFile(DEBUG_LOG_FILE, line, 'utf8')
  } catch {
    // Ignore logging failures.
  }
}

function normalizeConcepts(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  const stopPhrases = [
    'start with',
    'be concise',
    'explain clearly',
    'direct answer',
    'structured response',
    'key takeaway',
    'conversation snippets',
  ]

  const out: string[] = []
  const seen = new Set<string>()
  for (const item of value) {
    const text = `${item ?? ''}`
      .replace(/[.;:!?]+$/g, '')
      .replace(/\s+/g, ' ')
      .trim()
    if (!text) continue
    const words = text.split(' ').filter(Boolean)
    if (words.length < 2 || words.length > 7) continue
    const key = text.toLowerCase()
    if (seen.has(key)) continue
    if (stopPhrases.some((phrase) => key.includes(phrase))) continue
    seen.add(key)
    out.push(text)
    if (out.length >= 10) break
  }
  return out
}

function parseFallbackConcepts(text: string): string[] {
  return normalizeConcepts(
    text
    .split('\n')
    .map((line) => line.replace(/^[-*•\d.)\s]+/, '').trim())
    .filter(Boolean)
    .slice(0, 12)
  )
}

export async function POST(request: NextRequest) {
  try {
    const requestId = `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`
    const ctx = await getUserContext()
    if (!ctx) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await request.json()) as ConceptRequestBody
    const text = (body.text || '').trim()
    const history = Array.isArray(body.history) ? body.history : []
    const previousConcepts = Array.isArray(body.previousConcepts) ? normalizeConcepts(body.previousConcepts).slice(-20) : []

    if (!text) {
      return NextResponse.json<ConceptResponseBody>({ concepts: [] })
    }

    const contextMessages = history
      .slice(-8)
      .map((u) => u.text)
      .filter(Boolean)
      .join('\n')

    const priorConceptsBlock = previousConcepts.length
      ? `Already covered / already suggested:\n${previousConcepts.map((c) => `- ${c}`).join('\n')}`
      : ''

    const userMessage = [
      contextMessages ? `Conversation so far:\n${contextMessages}` : '',
      `Latest spoken snippet:\n"${text}"`,
      priorConceptsBlock,
      'Return only new angles that appear missing from the discussion so far.',
      'Do not paraphrase already covered bullets. Return only uniquely additive points.',
    ]
      .filter(Boolean)
      .join('\n\n')

    let concepts: string[] = []
    let source: 'model' | 'fallback' = 'model'
    let debugReason = 'ok'
    let rawPreview = ''

    const startLog = {
      requestId,
      model: MODEL,
      textLen: text.length,
      historyCount: history.length,
      previousConceptsCount: previousConcepts.length,
    }
    console.info('[interview-guide] request start', startLog)
    void writeDebugLog('request_start', startLog)

    try {
      const baseMessages = [
        { role: 'system' as const, content: SYSTEM_PROMPT },
        { role: 'user' as const, content: userMessage },
      ]

      const response = await openRouterChat({
        model: MODEL,
        max_tokens: 220,
        temperature: 0.2,
        messages: baseMessages,
      })

      let textResponse = extractOpenRouterText(response?.choices?.[0]?.message?.content).trim()

      // Retry once if model returns empty text.
      if (!textResponse) {
        const retry = await openRouterChat({
          model: MODEL,
          max_tokens: 140,
          temperature: 0,
          messages: [
            ...baseMessages,
            {
              role: 'user',
              content: 'Return only new bullets. If nothing new, return empty output.',
            },
          ],
        })
        textResponse = extractOpenRouterText(retry?.choices?.[0]?.message?.content).trim()
        debugReason = textResponse ? 'retry_non_empty_model_text' : 'empty_model_text_after_retry'
      }

      rawPreview = textResponse.slice(0, 240)
      if (textResponse) {
        concepts = parseFallbackConcepts(textResponse)
        if (concepts.length === 0) debugReason = 'line_parse_filtered_or_empty'
      } else {
        if (debugReason === 'ok') debugReason = 'empty_model_text'
      }
    } catch (err) {
      console.error('[interview-guide] openrouter error', { requestId, err })
      void writeDebugLog('openrouter_error', {
        requestId,
        error: err instanceof Error ? err.message : String(err),
      })
      concepts = []
      source = 'fallback'
      debugReason = 'openrouter_error'
    }

    if (concepts.length === 0) {
      if (debugReason === 'ok') debugReason = 'no_novel_points'
    }

    const doneLog = {
      requestId,
      source,
      conceptsCount: concepts.length,
      reason: debugReason,
    }
    console.info('[interview-guide] request done', doneLog)
    void writeDebugLog('request_done', {
      ...doneLog,
      rawPreview,
    })

    return NextResponse.json<ConceptResponseBody>({
      concepts,
      source,
      debug: {
        requestId,
        reason: debugReason,
        model: MODEL,
        rawPreview,
      },
    })
  } catch (error) {
    console.error('Interview concept route error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Concept generation failed' },
      { status: 500 }
    )
  }
}
