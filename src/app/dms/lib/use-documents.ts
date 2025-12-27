'use client'

import { useEffect, useState } from 'react'
import { getSupabase } from '@/lib/supabase'
import type { Document } from '../types'

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDocuments = async () => {
    setLoading(true)
    const supabase = getSupabase('dms')

    const { data, error } = await supabase
      .from('documents')
      .select('id, file_url, file_name, document_type, section_id, sections(name), summary, uploaded_by, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setDocuments((data as unknown as Document[]) || [])
    }
    setLoading(false)
  }

  const deleteDocument = async (id: string) => {
    const supabase = getSupabase('dms')
    const { error } = await supabase.from('documents').delete().eq('id', id)

    if (error) {
      throw new Error(error.message)
    }

    await fetchDocuments()
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  return { documents, loading, error, refetch: fetchDocuments, deleteDocument }
}
