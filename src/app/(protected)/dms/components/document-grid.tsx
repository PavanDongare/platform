'use client'

import { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Trash2, FileText, ExternalLink, ChevronDown } from 'lucide-react'
import type { Document } from '../types'

interface DocumentGridProps {
  documents: Document[]
  onDelete: (id: string) => void
}

export function DocumentGrid({ documents, onDelete }: DocumentGridProps) {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

  const groupedDocs = useMemo(() => {
    const groups: Record<string, Document[]> = {}

    for (const doc of documents) {
      const section = doc.sections?.name || 'Uncategorized'
      if (!groups[section]) groups[section] = []
      groups[section].push(doc)
    }

    const sortedKeys = Object.keys(groups).sort((a, b) => {
      if (a === 'Uncategorized') return 1
      if (b === 'Uncategorized') return -1
      return a.localeCompare(b)
    })

    return sortedKeys.map((section) => ({ section, docs: groups[section] }))
  }, [documents])

  const isSectionOpen = (section: string) => openSections[section] !== false

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !isSectionOpen(section) }))
  }

  const handleDelete = (e: React.MouseEvent, doc: Document) => {
    e.stopPropagation()
    if (confirm(`Delete "${doc.file_name}"?`)) {
      onDelete(doc.id)
    }
  }

  const isImage = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')
  }

  const isPdf = (fileName: string) => fileName.toLowerCase().endsWith('.pdf')

  if (documents.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No documents yet. Upload your first document.
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {groupedDocs.map(({ section, docs }) => (
          <Collapsible
            key={section}
            open={isSectionOpen(section)}
            onOpenChange={() => toggleSection(section)}
          >
            <CollapsibleTrigger className="flex items-center gap-2 w-full text-left py-2 hover:bg-muted rounded-lg px-2 -mx-2">
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform ${
                  isSectionOpen(section) ? '' : '-rotate-90'
                }`}
              />
              <span className="font-semibold">{section}</span>
              <span className="text-sm text-muted-foreground">
                ({docs.length} {docs.length === 1 ? 'doc' : 'docs'})
              </span>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-3">
                {docs.map((doc) => (
                  <Card
                    key={doc.id}
                    className="group relative overflow-hidden cursor-pointer hover:ring-2 hover:ring-muted-foreground/20 transition-all"
                    onClick={() => setSelectedDoc(doc)}
                  >
                    <button
                      onClick={(e) => handleDelete(e, doc)}
                      className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-background/80 hover:bg-destructive/10 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <div className="aspect-[4/3] bg-muted overflow-hidden">
                      {isImage(doc.file_name) ? (
                        <img
                          src={doc.file_url}
                          alt={doc.file_name}
                          className="w-full h-full object-cover"
                        />
                      ) : isPdf(doc.file_name) ? (
                        <iframe
                          src={`${doc.file_url}#toolbar=0&navpanes=0&scrollbar=0`}
                          className="w-full h-full pointer-events-none"
                          title={doc.file_name}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileText className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    <div className="p-3 space-y-1">
                      <h3 className="font-medium text-sm truncate" title={doc.document_type || doc.file_name}>
                        {doc.document_type || doc.file_name}
                      </h3>
                      {doc.summary && (
                        <p className="text-xs text-muted-foreground line-clamp-2" title={doc.summary}>
                          {doc.summary}
                        </p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>

      <Dialog open={!!selectedDoc} onOpenChange={() => setSelectedDoc(null)}>
        <DialogContent className="max-w-[95vw] w-full h-[95vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0 pb-2 border-b">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <DialogTitle className="truncate text-lg">
                  {selectedDoc?.document_type || selectedDoc?.file_name}
                </DialogTitle>
                {selectedDoc?.sections?.name && (
                  <p className="text-sm text-muted-foreground">{selectedDoc.sections.name}</p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(selectedDoc?.file_url, '_blank')}
                className="flex-shrink-0"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open
              </Button>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-auto bg-muted rounded-lg min-h-0">
            {selectedDoc && isImage(selectedDoc.file_name) ? (
              <img
                src={selectedDoc.file_url}
                alt={selectedDoc.file_name}
                className="w-full h-auto"
              />
            ) : selectedDoc && isPdf(selectedDoc.file_name) ? (
              <iframe
                src={selectedDoc.file_url}
                className="w-full h-full min-h-[80vh]"
                title={selectedDoc.file_name}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <FileText className="h-24 w-24 text-muted-foreground" />
              </div>
            )}
          </div>

          {selectedDoc?.summary && (
            <p className="text-sm text-muted-foreground pt-3 border-t flex-shrink-0">
              {selectedDoc.summary}
            </p>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
