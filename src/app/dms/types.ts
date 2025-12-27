export interface Section {
  id: string
  name: string
  display_name?: string
  color?: string
  icon?: string
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Document {
  id: string
  file_url: string
  file_name: string
  document_type: string | null
  section_id: string | null
  sections?: { name: string } | null
  summary: string | null
  uploaded_by: string | null
  created_at: string
}
