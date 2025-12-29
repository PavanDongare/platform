'use client'

import { useEffect } from 'react'
import { useTenant } from '@/lib/auth/tenant-context'
import { useNotesStore } from './lib/notes-store'
import { NotebooksPanel } from './components/notebooks-panel'
import { SectionsTabs } from './components/sections-tabs'
import { PagesPanel } from './components/pages-panel'
import { PageEditor } from './components/page-editor'
import { BreadcrumbNav } from './components/breadcrumb-nav'

export default function OneNotePage() {
  const { tenantId, userId } = useTenant()
  const { setContext, initialize } = useNotesStore()

  useEffect(() => {
    setContext(tenantId, userId)
    initialize()
  }, [tenantId, userId, setContext, initialize])

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <BreadcrumbNav />
      <SectionsTabs />

      <div className="flex-1 grid grid-cols-[250px_1fr_250px] overflow-hidden">
        <NotebooksPanel />
        <PageEditor />
        <PagesPanel />
      </div>
    </div>
  )
}
