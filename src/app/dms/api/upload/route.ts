import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'
import { getUserContext } from '@/lib/auth/get-user-context'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { db: { schema: 'dms' } }
)

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

const EXTRACTION_PROMPT = `Analyze this document completely. Extract and return as JSON:
{
  "document_type": "type of document (e.g., Invoice, Contract, Receipt, ID, Certificate, etc.)",
  "summary": "one-line summary of what this document is",
  "metadata": {}
}
Return ONLY valid JSON, no other text.`

export async function POST(request: NextRequest) {
  try {
    // Get user context for tenant and user info
    const ctx = await getUserContext()
    if (!ctx) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Data = buffer.toString('base64')
    const mimeType = file.type || 'application/octet-stream'
    const isPdf = mimeType === 'application/pdf'

    // Extract with Claude
    let extracted = { document_type: 'Document', summary: file.name, metadata: {} }

    if (process.env.ANTHROPIC_API_KEY) {
      try {
        const contentBlock = isPdf
          ? {
              type: 'document' as const,
              source: {
                type: 'base64' as const,
                media_type: 'application/pdf' as const,
                data: base64Data,
              },
            }
          : {
              type: 'image' as const,
              source: {
                type: 'base64' as const,
                media_type: mimeType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
                data: base64Data,
              },
            }

        const response = await anthropic.messages.create({
          model: 'claude-3-5-haiku-20241022',
          max_tokens: 1024,
          messages: [
            {
              role: 'user',
              content: [contentBlock, { type: 'text', text: EXTRACTION_PROMPT }],
            },
          ],
        })

        const textBlock = response.content.find((block) => block.type === 'text')
        if (textBlock && textBlock.type === 'text') {
          let jsonText = textBlock.text
          const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/)
          if (jsonMatch) jsonText = jsonMatch[1]
          extracted = JSON.parse(jsonText.trim())
        }
      } catch (e) {
        console.error('Claude extraction failed:', e)
      }
    }

    // Upload to Storage with tenant prefix for organization
    const storagePath = `${ctx.tenantId}/${Date.now()}-${file.name}`
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(storagePath, buffer, { contentType: mimeType })

    if (uploadError) {
      throw new Error(`Storage upload failed: ${uploadError.message}`)
    }

    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(storagePath)

    // Save to database with tenant and user
    const { data: docData, error: dbError } = await supabase
      .from('documents')
      .insert({
        tenant_id: ctx.tenantId,
        user_id: ctx.userId,
        file_url: urlData.publicUrl,
        file_name: file.name,
        document_type: extracted.document_type,
        summary: extracted.summary,
        extracted_data: extracted,
      })
      .select()
      .single()

    if (dbError) {
      throw new Error(`Database insert failed: ${dbError.message}`)
    }

    return NextResponse.json(docData)
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    )
  }
}
