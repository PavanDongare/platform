'use client'

import { AppSidebar } from '@/components/app-sidebar'

interface LayoutWrapperProps {
  children: React.ReactNode
  email?: string | null
}

export function LayoutWrapper({ children, email }: LayoutWrapperProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar email={email} />
      <main className="flex-1 overflow-auto pt-14 md:pt-0">
        {children}
      </main>
    </div>
  )
}
