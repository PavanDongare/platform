'use client'

import { usePathname } from 'next/navigation'
import { AppSidebar } from '@/components/app-sidebar'

interface LayoutWrapperProps {
  children: React.ReactNode
  email?: string | null
}

// Routes that show portfolio layout (no sidebar)
const portfolioRoutes = ['/', '/about', '/apps']

export function LayoutWrapper({ children, email }: LayoutWrapperProps) {
  const pathname = usePathname()
  const isPortfolioRoute = portfolioRoutes.includes(pathname)

  // Portfolio pages: clean layout, no sidebar
  if (isPortfolioRoute) {
    return (
      <main className="min-h-screen">
        {children}
      </main>
    )
  }

  // App pages: sidebar + platform layout
  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar email={email} />
      <main className="flex-1 overflow-auto pt-14 md:pt-0">
        {children}
      </main>
    </div>
  )
}
