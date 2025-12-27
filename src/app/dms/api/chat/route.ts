import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'
import { TOOLS } from '../../tools'
import { findRelevantDocs } from '../../search'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { db: { schema: 'dms' } }
)

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

async function executeTool(name: string, input: any): Promise<string> {
  const { data, error } = await supabase.rpc(name, input)

  if (error) {
    console.error(`Tool ${name} error:`, error)
    throw new Error(`Failed to execute ${name}: ${error.message}`)
  }

  return data?.[0]?.message || 'Action completed'
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message required' }), {
        status: 400,
      })
    }

    const { data: docs } = await supabase
      .from('documents')
      .select('id, document_type, summary, extracted_data, section_id, sections(name)')
      .order('created_at', { ascending: false })

    const relevantDocs = findRelevantDocs(message, docs || [], 2)

    const docContext = docs
      ?.map((d: any) => {
        const section = d.sections?.name || 'Uncategorized'
        return `${section}: ${d.document_type} (ID: ${d.id})${d.summary ? ` - ${d.summary}` : ''}`
      })
      .join('\n')

    const sectionGroups = docs?.reduce((acc: any, doc: any) => {
      const section = doc.sections?.name || 'Uncategorized'
      acc[section] = (acc[section] || 0) + 1
      return acc
    }, {})

    const sectionSummary = Object.entries(sectionGroups || {})
      .map(([name, count]) => `${name} (${count} docs)`)
      .join(', ')

    const relevantContext =
      relevantDocs.length > 0
        ? `\nRelevant document details:\n${relevantDocs
            .map(
              (d: any) =>
                `- ${d.document_type}: ${JSON.stringify(d.extracted_data, null, 2)}`
            )
            .join('\n')}`
        : ''

    const systemPrompt = `You are a document assistant. Be helpful, concise, and friendly.

Current status: ${sectionSummary || 'No documents'}

When user asks to move/merge/delete documents:
1. Identify the specific document IDs from the context
2. Use the appropriate tool (update_section or delete_documents)
3. Confirm the action with the user

Available documents:
${docContext || 'No documents uploaded yet'}${relevantContext}`

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 2048,
      system: systemPrompt,
      tools: TOOLS,
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
    })

    if (response.stop_reason === 'tool_use') {
      const toolUseBlock = response.content.find(
        (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use'
      )

      if (toolUseBlock) {
        const toolResult = await executeTool(toolUseBlock.name, toolUseBlock.input)
        return new Response(
          JSON.stringify({ message: toolResult }),
          { headers: { 'Content-Type': 'application/json' } }
        )
      }
    }

    const textBlock = response.content.find(
      (block): block is Anthropic.TextBlock => block.type === 'text'
    )

    return new Response(
      JSON.stringify({
        message: textBlock?.text || "I'm here to help with your documents!",
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Chat error:', error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Chat failed',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
