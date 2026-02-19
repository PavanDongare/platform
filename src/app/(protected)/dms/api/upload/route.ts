import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getUserContext } from '@/lib/auth/get-user-context'
import { extractOpenRouterText, getFreeModel, openRouterChat } from '@/lib/openrouter'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { db: { schema: 'dms' } }
)

const MODEL = getFreeModel(process.env.OPENROUTER_DMS_MODEL, 'openrouter/free')

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

    // Extract with OpenRouter free model
    let extracted = { document_type: 'Document', summary: file.name, metadata: {} }

    if (process.env.OPENROUTER_API_KEY) {
      try {
        const multimodalContent = isPdf
          ? [
              {
                type: 'text',
                text: `${EXTRACTION_PROMPT}\n\nFile name: ${file.name}\nMime type: ${mimeType}\nNote: PDF content may not be directly parseable by this model; infer what you can from metadata.`,
              },
            ]
          : [
              { type: 'text', text: EXTRACTION_PROMPT },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType};base64,${base64Data}`,
                },
              },
            ]

        const response = await openRouterChat({
          model: MODEL,
          max_tokens: 1024,
          temperature: 0.1,
          messages: [
            {
              role: 'user',
              content: multimodalContent,
            },
          ],
        })

        const text = extractOpenRouterText(response?.choices?.[0]?.message?.content)

        if (text) {
          let jsonText = text
          const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/)
          if (jsonMatch) jsonText = jsonMatch[1]
          extracted = JSON.parse(jsonText.trim())
        }
      } catch (e) {
        console.error('OpenRouter extraction failed:', e)
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
