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

const SYSTEM_PROMPT = `You are helping a candidate in a live interview. You hear the conversation between interviewer and candidate.

Your job: Give the candidate strong bullet points to help them respond.

Rules:
- Bullets only. No explanations, no fluff.
- At most 1 short title if needed, but prefer bullets alone.
- Be direct and info-dense.
- Give breadth of points they can pick from.`

interface Utterance {
  text: string
  hint?: string
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
      return NextResponse.json({ text: '', hint: null })
    }

    if (!text) {
      return NextResponse.json({ text: '', hint: null })
    }

    // Build conversation context for Claude
    const contextMessages = history.slice(-10).map(u => u.text).join('\n')

    const userMessage = contextMessages
      ? `Conversation so far:\n${contextMessages}\n\nLatest: "${text}"`
      : `Interviewer: "${text}"`

    let hint: string | undefined

    try {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 300,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      })

      const textBlock = response.content.find(b => b.type === 'text')
      hint = textBlock?.type === 'text' ? textBlock.text : undefined
    } catch (err) {
      console.error('Claude API error:', err)
    }

    return NextResponse.json({ text, hint })

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
