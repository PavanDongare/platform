'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { useDocuments } from './lib/use-documents'
import { DocumentGrid } from './components/document-grid'
import { Chat } from './components/chat'
import { Plus, Loader2, Upload } from 'lucide-react'

export default function DMSPage() {
  const { documents, loading, refetch, deleteDocument } = useDocuments()
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragCounter = useRef(0)

  const uploadFiles = useCallback(async (files: File[]) => {
    if (files.length === 0) return

    setUploading(true)
    setUploadStatus('Uploading...')

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp']

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        setUploadStatus(`Skipped: ${file.name} (unsupported type)`)
        await new Promise((r) => setTimeout(r, 1000))
        continue
      }

      try {
        setUploadStatus(`Processing ${file.name}...`)

        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch('/dms/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!res.ok) {
          const error = await res.json()
          throw new Error(error.error || 'Upload failed')
        }
      } catch (error) {
        console.error('Upload error:', error)
        setUploadStatus(`Failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
        await new Promise((r) => setTimeout(r, 2000))
      }
    }

    setUploading(false)
    setUploadStatus(null)
    refetch()
  }, [refetch])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    await uploadFiles(Array.from(files))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current++
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current--
    if (dragCounter.current === 0) {
      setIsDragging(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    dragCounter.current = 0

    const files = Array.from(e.dataTransfer.files)
    await uploadFiles(files)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteDocument(id)
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col bg-background relative"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="absolute inset-0 z-50 bg-primary/20 backdrop-blur-sm flex items-center justify-center pointer-events-none">
          <div className="bg-background rounded-md border p-8 flex flex-col items-center gap-4">
            <Upload className="h-16 w-16 text-primary" />
            <p className="text-xl font-semibold">Drop files to upload</p>
            <p className="text-sm text-muted-foreground">PDF, JPG, PNG, GIF, WebP</p>
          </div>
        </div>
      )}

      <header className="bg-background border-b flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Documents</h1>
          <div className="flex items-center gap-2">
            {uploadStatus && (
              <span className="text-sm text-muted-foreground">{uploadStatus}</span>
            )}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Add Doc
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <DocumentGrid documents={documents} onDelete={handleDelete} />
          )}
        </div>
      </main>

      <Chat onActionComplete={refetch} />
    </div>
  )
}
