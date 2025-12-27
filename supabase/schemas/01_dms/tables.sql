-- DMS Schema
-- Document Management System tables

-- Create schema
CREATE SCHEMA IF NOT EXISTS dms;

-- Grant access to Supabase roles
GRANT USAGE ON SCHEMA dms TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA dms TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA dms GRANT ALL ON TABLES TO anon, authenticated, service_role;

-- Sections table for organizing documents
CREATE TABLE dms.sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT,
  color TEXT,
  icon TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents table
CREATE TABLE dms.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  document_type TEXT,
  summary TEXT,
  extracted_data JSONB,
  uploaded_by TEXT,
  section_id UUID REFERENCES dms.sections(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Memory files table (stores Documents_index and other context)
CREATE TABLE dms.memory_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT UNIQUE NOT NULL,
  content TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_dms_sections_sort_order ON dms.sections(sort_order);
CREATE INDEX idx_dms_sections_name ON dms.sections(name);
CREATE INDEX idx_dms_documents_created_at ON dms.documents(created_at DESC);
CREATE INDEX idx_dms_documents_document_type ON dms.documents(document_type);
CREATE INDEX idx_dms_documents_section_id ON dms.documents(section_id);

-- Seed Documents_index
INSERT INTO dms.memory_files (filename, content) VALUES ('Documents_index.md', '');

-- RPC Functions

-- Delete documents by IDs
CREATE OR REPLACE FUNCTION dms.delete_documents(doc_ids uuid[])
RETURNS TABLE(success boolean, message text) AS $$
DECLARE
  v_deleted_count int;
BEGIN
  DELETE FROM dms.documents WHERE id = ANY(doc_ids);
  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  RETURN QUERY SELECT true, 'Deleted ' || v_deleted_count || ' document(s)';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Move documents to a section
CREATE OR REPLACE FUNCTION dms.update_section(doc_ids uuid[], new_section_name text)
RETURNS TABLE(success boolean, message text) AS $$
DECLARE
  v_section_id uuid;
  v_updated_count int;
BEGIN
  SELECT id INTO v_section_id FROM dms.sections WHERE name = new_section_name LIMIT 1;

  IF v_section_id IS NULL THEN
    INSERT INTO dms.sections (name, sort_order)
    VALUES (new_section_name, (SELECT COALESCE(MAX(sort_order), -1) + 1 FROM dms.sections))
    RETURNING dms.sections.id INTO v_section_id;
  END IF;

  UPDATE dms.documents SET section_id = v_section_id WHERE id = ANY(doc_ids);
  GET DIAGNOSTICS v_updated_count = ROW_COUNT;

  RETURN QUERY SELECT true, 'Moved ' || v_updated_count || ' document(s) to section: ' || new_section_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
