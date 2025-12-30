'use client'

import { useEffect } from 'react'
import { useTenant } from '@/lib/auth/tenant-context'
import { useNotesStore } from './lib/notes-store'
import { NotebooksPanel } from './components/notebooks-panel'
import { SectionsTabs } from './components/sections-tabs'
import { PagesPanel } from './components/pages-panel'
import { PageEditor } from './components/page-editor'
import { BreadcrumbNav } from './components/breadcrumb-nav'
import { DesktopRecommended } from '@/components/desktop-recommended'

export default function OneNotePage() {
  const { tenantId, userId } = useTenant()
  const { setContext, initialize } = useNotesStore()

  useEffect(() => {
    setContext(tenantId, userId)
    initialize()
  }, [tenantId, userId, setContext, initialize])

  return (
    <DesktopRecommended featureName="Notes canvas">
      <div className="h-full flex flex-col overflow-hidden">
        <BreadcrumbNav />
        <SectionsTabs />

        <div className="flex-1 grid grid-cols-[250px_1fr_250px] overflow-hidden">
          <NotebooksPanel />
          <PageEditor />
          <PagesPanel />
        </div>
      </div>
    </DesktopRecommended>
  )
}
