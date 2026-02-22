import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { TOOLS } from '../../lib/tools'
import { findRelevantDocs } from '../../lib/search'
import { getUserContext } from '@/lib/auth/get-user-context'
import { extractOpenRouterText, getFreeModel, openRouterChat } from '@/lib/openrouter'

const MODEL = getFreeModel(process.env.OPENROUTER_DMS_MODEL, 'qwen/qwen3-coder:free')

type DmsDoc = {
  id: string
  document_type: string | null
  summary: string | null
  extracted_data: unknown
  section_id: string | null
  sections: { name: string | null }[] | null
}

export async function POST(request: NextRequest) {
  try {
    // Get user context for tenant
    const ctx = await getUserContext()
    if (!ctx) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { db: { schema: 'dms' } }
    )

    const { message } = await request.json()

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message required' }), {
        status: 400,
      })
    }

    // Filter documents by tenant
    const { data: docsData } = await supabase
      .from('documents')
      .select('id, document_type, summary, extracted_data, section_id, sections(name)')
      .eq('tenant_id', ctx.tenantId)
      .order('created_at', { ascending: false })
    const docs: any[] = (docsData ?? []).map(d => ({
      ...d,
      sections: Array.isArray(d.sections) ? d.sections[0] : d.sections
    }))

    const relevantDocs = findRelevantDocs(message, docs || [], 2)

    const docContext = docs
      .map((d) => {
        const section = d.sections?.name || 'Uncategorized'
        return `${section}: ${d.document_type} (ID: ${d.id})${d.summary ? ` - ${d.summary}` : ''}`
      })
      .join('\n')

    const sectionGroups = docs.reduce<Record<string, number>>((acc, doc) => {
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
              (d: DmsDoc) =>
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

    const response = await openRouterChat({
      model: MODEL,
      max_tokens: 2048,
      temperature: 0.2,
      tools: TOOLS,
      tool_choice: 'auto',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
    })

    // Execute tool with tenant context
    const tenantId = ctx.tenantId
    async function executeTool(name: string, input: Record<string, unknown>): Promise<string> {
      const { data, error } = await supabase.rpc(name, {
        ...input,
        p_tenant_id: tenantId
      })

      if (error) {
        console.error(`Tool ${name} error:`, error)
        throw new Error(`Failed to execute ${name}: ${error.message}`)
      }

      return data?.[0]?.message || 'Action completed'
    }

    const choice = response?.choices?.[0]
    const toolCall = choice?.message?.tool_calls?.[0]

    if (toolCall?.function?.name) {
      let input: Record<string, unknown> = {}
      try {
        input = toolCall.function.arguments
          ? JSON.parse(toolCall.function.arguments)
          : {}
      } catch {
        input = {}
      }

      const toolResult = await executeTool(toolCall.function.name, input)
      return new Response(
        JSON.stringify({ message: toolResult }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }

    const assistantText = extractOpenRouterText(choice?.message?.content)

    return new Response(
      JSON.stringify({
        message: assistantText || "I'm here to help with your documents!",
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
