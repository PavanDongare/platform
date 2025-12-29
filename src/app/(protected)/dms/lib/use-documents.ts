'use client'

import { useEffect, useState, useCallback } from 'react'
import { getSupabase } from '@/lib/supabase'
import { useTenant } from '@/lib/auth/tenant-context'
import type { Document } from '../types'

export function useDocuments() {
  const { tenantId } = useTenant()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDocuments = useCallback(async () => {
    setLoading(true)
    const supabase = getSupabase('dms')

    const { data, error } = await supabase
      .from('documents')
      .select('id, file_url, file_name, document_type, section_id, sections(name), summary, user_id, created_at')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setDocuments((data as unknown as Document[]) || [])
    }
    setLoading(false)
  }, [tenantId])

  const deleteDocument = async (id: string) => {
    const supabase = getSupabase('dms')
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id)
      .eq('tenant_id', tenantId)

    if (error) {
      throw new Error(error.message)
    }

    await fetchDocuments()
  }

  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  return { documents, loading, error, refetch: fetchDocuments, deleteDocument }
}
