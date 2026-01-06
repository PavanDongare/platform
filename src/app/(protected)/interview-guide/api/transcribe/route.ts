import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import { writeFile, readFile, unlink, mkdir } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'
import Anthropic from '@anthropic-ai/sdk'
import { getUserContext } from '@/lib/auth/get-user-context'

const execAsync = promisify(exec)

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

// Load prompt from file (cached)
let cachedPrompt: string | null = null
async function getSystemPrompt(): Promise<string> {
  if (cachedPrompt) return cachedPrompt
  try {
    const promptPath = join(process.cwd(), 'src/app/(protected)/interview-guide/prompt.md')
    cachedPrompt = await readFile(promptPath, 'utf-8')
    return cachedPrompt
  } catch {
    return 'You are an interview assistant. Provide concise, helpful hints for answering interview questions.'
  }
}

// Question detection patterns
const QUESTION_PATTERNS = [
  /\?$/,
  /^(what|how|why|when|where|who|can you|could you|would you|tell me|describe|explain|walk me through)/i,
]

const FOLLOWUP_PATTERNS = [
  /^(and|also|what about|how about|okay|so)/i,
]

interface Utterance {
  text: string
  isQuestion: boolean
  hint?: string
}

function isQuestion(text: string, hasHistory: boolean): boolean {
  const trimmed = text.trim()

  // Direct question patterns
  for (const pattern of QUESTION_PATTERNS) {
    if (pattern.test(trimmed)) return true
  }

  // Follow-up patterns (only if we have history)
  if (hasHistory) {
    for (const pattern of FOLLOWUP_PATTERNS) {
      if (pattern.test(trimmed)) return true
    }
  }

  return false
}

export async function POST(request: NextRequest) {
  const tempFiles: string[] = []

  try {
    // Auth check
    const ctx = await getUserContext()
    if (!ctx) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const audioBlob = formData.get('audio') as Blob
    const historyJson = formData.get('history') as string

    if (!audioBlob) {
      return NextResponse.json({ error: 'No audio provided' }, { status: 400 })
    }

    const history: Utterance[] = historyJson ? JSON.parse(historyJson) : []

    // Save audio to temp file
    const tempDir = join(tmpdir(), 'interview-guide')
    await mkdir(tempDir, { recursive: true })

    const timestamp = Date.now()
    const audioPath = join(tempDir, `audio-${timestamp}.webm`)
    const outputPath = join(tempDir, `audio-${timestamp}`)

    const buffer = Buffer.from(await audioBlob.arrayBuffer())
    await writeFile(audioPath, buffer)
    tempFiles.push(audioPath)

    // Run Whisper
    const whisperCmd = `python3 -m whisper "${audioPath}" --model base --language en --output_format txt --output_dir "${tempDir}"`

    try {
      await execAsync(whisperCmd, { timeout: 30000 })
    } catch (err) {
      console.error('Whisper error:', err)
      return NextResponse.json({ error: 'Transcription failed' }, { status: 500 })
    }

    // Read transcription
    const txtPath = `${outputPath}.txt`
    tempFiles.push(txtPath)

    let text = ''
    try {
      text = (await readFile(txtPath, 'utf-8')).trim()
    } catch {
      // No transcription output (silence or error)
      return NextResponse.json({ text: '', isQuestion: false })
    }

    if (!text) {
      return NextResponse.json({ text: '', isQuestion: false })
    }

    // Check if it's a question
    const questionDetected = isQuestion(text, history.length > 0)

    let hint: string | undefined

    if (questionDetected) {
      // Build conversation context for Claude
      const systemPrompt = await getSystemPrompt()

      const contextMessages = history.slice(-10).map(u =>
        `${u.isQuestion ? 'Interviewer' : 'Candidate'}: ${u.text}`
      ).join('\n')

      const userMessage = contextMessages
        ? `Previous conversation:\n${contextMessages}\n\nNew question from interviewer: ${text}\n\nProvide a concise hint (2-3 bullet points) for answering this question.`
        : `Interview question: ${text}\n\nProvide a concise hint (2-3 bullet points) for answering this question.`

      try {
        const response = await anthropic.messages.create({
          model: 'claude-sonnet-4-5-20250929',
          max_tokens: 512,
          system: systemPrompt,
          messages: [{ role: 'user', content: userMessage }],
        })

        const textBlock = response.content.find(b => b.type === 'text')
        hint = textBlock?.type === 'text' ? textBlock.text : undefined
      } catch (err) {
        console.error('Claude API error:', err)
        // Continue without hint
      }
    }

    return NextResponse.json({
      text,
      isQuestion: questionDetected,
      hint,
    })

  } catch (error) {
    console.error('Transcribe error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Transcription failed' },
      { status: 500 }
    )
  } finally {
    // Cleanup temp files
    for (const file of tempFiles) {
      try {
        await unlink(file)
      } catch {
        // Ignore cleanup errors
      }
    }
  }
}
