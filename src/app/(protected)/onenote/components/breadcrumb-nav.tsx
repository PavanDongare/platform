'use client'

import { ChevronRight } from 'lucide-react'
import { useNotesStore } from '../lib/notes-store'

export function BreadcrumbNav() {
  const {
    notebooks,
    currentNotebookId,
    sections,
    currentSectionId,
    pages,
    currentPageId,
  } = useNotesStore()

  const notebook = notebooks.find((n) => n.id === currentNotebookId)
  const section = sections.find((s) => s.id === currentSectionId)
  const page = pages.find((p) => p.id === currentPageId)

  const notebookLabel = notebook?.title || 'Untitled Notebook'
  const sectionLabel = section?.title || 'Untitled Section'
  const pageLabel = page?.title || 'Untitled Page'

  return (
    <div className="h-11 bg-zinc-900 border-b border-zinc-800 flex items-center justify-center w-full">
      <nav className="flex items-center gap-6">
        <span
          className="font-bold text-base tracking-tight text-white truncate max-w-[280px]"
          title={notebookLabel}
        >
          {notebookLabel}
        </span>

        <ChevronRight className="h-5 w-5 text-zinc-400 flex-shrink-0" strokeWidth={3} />

        <span
          className="font-bold text-base tracking-tight text-zinc-200 truncate max-w-[280px]"
          title={sectionLabel}
        >
          {sectionLabel}
        </span>

        <ChevronRight className="h-5 w-5 text-zinc-400 flex-shrink-0" strokeWidth={3} />

        <span
          className="font-bold text-base tracking-tight text-zinc-400 truncate max-w-[280px]"
          title={pageLabel}
        >
          {pageLabel}
        </span>
      </nav>
    </div>
  )
}
