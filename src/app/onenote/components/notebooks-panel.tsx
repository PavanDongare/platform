'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useNotesStore } from '../lib/notes-store'
import { updateNotebook } from '../lib/queries/notebooks'
import { Pencil, Trash2 } from 'lucide-react'

export function NotebooksPanel() {
  const {
    notebooks,
    currentNotebookId,
    setCurrentNotebook,
    createNotebook,
    deleteNotebook,
    loadNotebooks,
    isLoadingNotebooks
  } = useNotesStore()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [notebookToDelete, setNotebookToDelete] = useState<{ id: string; title: string } | null>(null)

  const handleCreateNotebook = async () => {
    try {
      const notebook = await createNotebook()
      setEditingId(notebook.id)
      setEditingTitle('')
    } catch (error) {
      console.error('Failed to create notebook:', error)
    }
  }

  const handleStartEdit = (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingId(id)
    setEditingTitle(title)
  }

  const handleSaveEdit = async (id: string) => {
    if (editingTitle.trim() && editingTitle !== notebooks.find(n => n.id === id)?.title) {
      try {
        await updateNotebook(id, { title: editingTitle.trim() })
        await loadNotebooks()
      } catch (error) {
        console.error('Failed to update notebook:', error)
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

  const handleDeleteClick = (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setNotebookToDelete({ id, title })
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (notebookToDelete) {
      try {
        await deleteNotebook(notebookToDelete.id)
        setDeleteDialogOpen(false)
        setNotebookToDelete(null)
      } catch (error) {
        console.error('Failed to delete notebook:', error)
      }
    }
  }

  return (
    <div className="flex flex-col h-full border-r bg-muted/10">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          Notebooks
        </h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {isLoadingNotebooks ? (
            <div className="p-4 text-sm text-muted-foreground text-center">Loading...</div>
          ) : notebooks.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground text-center">
              <div className="mb-2 text-4xl">📓</div>
              <p>No notebooks yet</p>
            </div>
          ) : (
            notebooks.map((notebook) => (
              <div
                key={notebook.id}
                className={`w-full p-3 mb-2 rounded-lg transition-colors flex items-center gap-3 group ${
                  currentNotebookId === notebook.id
                    ? 'bg-primary/10 border-2 border-primary/20'
                    : 'hover:bg-muted border-2 border-transparent'
                }`}
                onMouseEnter={() => setHoveredId(notebook.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div
                  className="w-4 h-4 rounded flex-shrink-0"
                  style={{ backgroundColor: notebook.color }}
                />

                {editingId === notebook.id ? (
                  <Input
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onBlur={() => handleSaveEdit(notebook.id)}
                    onKeyDown={(e) => handleKeyDown(e, notebook.id)}
                    className="h-7 text-sm font-medium"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <>
                    <span
                      className="font-medium text-sm truncate flex-1 cursor-pointer"
                      onClick={() => setCurrentNotebook(notebook.id)}
                    >
                      {notebook.title || <span className="text-muted-foreground italic">Unnamed</span>}
                    </span>
                    {hoveredId === notebook.id && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => handleStartEdit(notebook.id, notebook.title, e)}
                          className="p-1 hover:bg-primary/10 rounded"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteClick(notebook.id, notebook.title, e)}
                          className="p-1 hover:bg-destructive/10 rounded"
                        >
                          <Trash2 className="w-3 h-3 text-destructive" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <Button onClick={handleCreateNotebook} variant="outline" className="w-full">
          + New Notebook
        </Button>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Notebook</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{notebookToDelete?.title}"?
              This will also delete all sections and pages within.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
