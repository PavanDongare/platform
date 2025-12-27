'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useNotesStore } from '../lib/notes-store'
import { updateSection } from '../lib/queries/sections'
import { cn } from '@/lib/utils'
import { Pencil } from 'lucide-react'

export function SectionsTabs() {
  const {
    sections,
    currentSectionId,
    currentNotebookId,
    setCurrentSection,
    createSection,
    loadSections,
    isLoadingSections
  } = useNotesStore()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const handleCreateSection = async () => {
    if (!currentNotebookId) return
    try {
      const section = await createSection(currentNotebookId)
      setEditingId(section.id)
      setEditingTitle('')
    } catch (error) {
      console.error('Failed to create section:', error)
    }
  }

  const handleStartEdit = (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingId(id)
    setEditingTitle(title)
  }

  const handleSaveEdit = async (id: string) => {
    if (editingTitle.trim() && editingTitle !== sections.find(s => s.id === id)?.title) {
      try {
        await updateSection(id, { title: editingTitle.trim() })
        if (currentNotebookId) await loadSections(currentNotebookId)
      } catch (error) {
        console.error('Failed to update section:', error)
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

  if (!currentNotebookId) {
    return (
      <div className="h-12 border-b flex items-center justify-center bg-muted/5">
        <p className="text-sm text-muted-foreground">Select a notebook to view sections</p>
      </div>
    )
  }

  return (
    <div className="h-12 border-b flex items-center bg-muted/5">
      <ScrollArea className="flex-1">
        <div className="flex items-center gap-2 px-4 h-12">
          {isLoadingSections ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : sections.length === 0 ? (
            <div className="text-sm text-muted-foreground">No sections yet</div>
          ) : (
            sections.map((section) => (
              <div
                key={section.id}
                className={cn(
                  'px-4 py-2 rounded-t-lg border-b-2 transition-all whitespace-nowrap group flex items-center gap-2',
                  currentSectionId === section.id
                    ? 'bg-background border-primary font-medium'
                    : 'border-transparent hover:bg-muted/50'
                )}
                style={{
                  borderTopColor: currentSectionId === section.id ? section.color : undefined
                }}
                onMouseEnter={() => setHoveredId(section.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {editingId === section.id ? (
                  <Input
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onBlur={() => handleSaveEdit(section.id)}
                    onKeyDown={(e) => handleKeyDown(e, section.id)}
                    className="h-6 text-sm font-medium w-32"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <>
                    <span
                      className="cursor-pointer"
                      onClick={() => setCurrentSection(section.id)}
                    >
                      {section.title || <span className="text-muted-foreground italic">Unnamed</span>}
                    </span>
                    {hoveredId === section.id && (
                      <button
                        onClick={(e) => handleStartEdit(section.id, section.title, e)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-primary/10 rounded"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                    )}
                  </>
                )}
              </div>
            ))
          )}

          <Button onClick={handleCreateSection} variant="ghost" size="sm" className="ml-2 h-8 w-8 p-0">
            +
          </Button>
        </div>
      </ScrollArea>
    </div>
  )
}
