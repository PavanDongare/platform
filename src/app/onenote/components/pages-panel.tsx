'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useNotesStore } from '../lib/notes-store'
import { Pencil } from 'lucide-react'

export function PagesPanel() {
  const {
    pages,
    currentPageId,
    currentSectionId,
    setCurrentPage,
    createPage,
    isLoadingPages,
    updatePageTitle
  } = useNotesStore()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const handleCreatePage = async () => {
    if (!currentSectionId) return
    try {
      const page = await createPage(currentSectionId)
      setEditingId(page.id)
      setEditingTitle('')
    } catch (error) {
      console.error('Failed to create page:', error)
    }
  }

  const handleStartEdit = (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingId(id)
    setEditingTitle(title)
  }

  const handleSaveEdit = async (id: string) => {
    if (editingTitle.trim() && editingTitle !== pages.find(p => p.id === id)?.title) {
      try {
        await updatePageTitle(id, editingTitle.trim())
      } catch (error) {
        console.error('Failed to update page title:', error)
      }
    }
    setEditingId(null)
    setEditingTitle('')
  }

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') handleSaveEdit(id)
    else if (e.key === 'Escape') {
      setEditingId(null)
      setEditingTitle('')
    }
  }

  if (!currentSectionId) {
    return (
      <div className="flex flex-col h-full border-l bg-muted/10">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Pages</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-4">
            <div className="mb-2 text-4xl">📄</div>
            <p className="text-sm text-muted-foreground">Select a section to view pages</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full border-l bg-muted/10">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Pages</h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {isLoadingPages ? (
            <div className="p-4 text-sm text-muted-foreground text-center">Loading...</div>
          ) : pages.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground text-center">
              <div className="mb-2 text-4xl">📄</div>
              <p>No pages yet</p>
            </div>
          ) : (
            pages.map((page) => (
              <div
                key={page.id}
                className={`w-full p-3 mb-2 rounded-lg transition-colors group ${
                  currentPageId === page.id
                    ? 'bg-primary/10 border-2 border-primary/20'
                    : 'hover:bg-muted border-2 border-transparent'
                }`}
                onMouseEnter={() => setHoveredId(page.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg flex-shrink-0">📄</span>

                  {editingId === page.id ? (
                    <Input
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onBlur={() => handleSaveEdit(page.id)}
                      onKeyDown={(e) => handleKeyDown(e, page.id)}
                      className="h-7 text-sm font-medium"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <>
                      <span
                        className="font-medium text-sm truncate flex-1 cursor-pointer"
                        onClick={() => setCurrentPage(page.id)}
                      >
                        {page.title || <span className="text-muted-foreground italic">Unnamed</span>}
                      </span>
                      {hoveredId === page.id && (
                        <button
                          onClick={(e) => handleStartEdit(page.id, page.title, e)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-primary/10 rounded flex-shrink-0"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <Button onClick={handleCreatePage} variant="outline" className="w-full">
          + New Page
        </Button>
      </div>
    </div>
  )
}
