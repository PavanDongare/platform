'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signout } from '@/app/auth/actions'
import {
  PanelLeftClose,
  PanelLeft,
  FileText,
  StickyNote,
  GitBranch,
  LogOut,
  LogIn,
  User,
  Briefcase,
  LayoutGrid,
  Menu,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { createClient } from '@/lib/supabase/client'

const apps = [
  { name: 'Portfolio', href: '/', icon: Briefcase },
  { name: 'Apps', href: '/apps', icon: LayoutGrid },
  { name: 'Documents', href: '/dms', icon: FileText },
  { name: 'Notes', href: '/onenote', icon: StickyNote },
  { name: 'Metaflow', href: '/metaflow', icon: GitBranch },
]

export function AppSidebar() {
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    createClient().auth.getUser().then(({ data: { user } }) => {
      setEmail(user?.email ?? null)
    })
  }, [])
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const pathname = usePathname()
  const isMobile = useIsMobile()

  const SidebarContent = ({ showLabels = true }: { showLabels?: boolean }) => (
    <>
      {/* Header */}
      <div className="h-12 flex items-center justify-between px-3 border-b border-zinc-800">
        {showLabels && (
          <span className="text-sm font-medium text-zinc-400">Platform</span>
        )}
        {!isMobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 hover:bg-zinc-800 rounded transition-colors"
          >
            {isCollapsed ? (
              <PanelLeft className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Apps navigation */}
      <nav className="flex-1 py-2">
        {apps.map((app) => {
          const isActive =
            app.href === '/' ? pathname === '/' : pathname.startsWith(app.href)
          return (
            <Link
              key={app.href}
              href={app.href}
              onClick={() => isMobile && setIsSheetOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2 mx-2 rounded text-sm transition-colors',
                isActive
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              )}
            >
              <app.icon className="w-4 h-4 flex-shrink-0" />
              {showLabels && <span>{app.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Profile section */}
      <div className="border-t border-zinc-800 p-2">
        {email ? (
          <>
            <div
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded',
                !showLabels ? 'justify-center' : ''
              )}
            >
              <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-zinc-400" />
              </div>
              {showLabels && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-zinc-400 truncate">{email}</p>
                </div>
              )}
            </div>

            <form action={signout}>
              <button
                type="submit"
                className={cn(
                  'flex items-center gap-3 px-3 py-2 mx-0 w-full rounded text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors',
                  !showLabels ? 'justify-center' : ''
                )}
              >
                <LogOut className="w-4 h-4 flex-shrink-0" />
                {showLabels && <span>Logout</span>}
              </button>
            </form>
          </>
        ) : (
          <Link
            href="/auth/login"
            onClick={() => isMobile && setIsSheetOpen(false)}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors',
              !showLabels ? 'justify-center' : ''
            )}
          >
            <LogIn className="w-4 h-4 flex-shrink-0" />
            {showLabels && <span>Sign In</span>}
          </Link>
        )}
      </div>
    </>
  )

  // Mobile: hamburger + sheet drawer
  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setIsSheetOpen(true)}
          className="fixed top-3 left-3 z-50 p-2 bg-zinc-950 text-zinc-100 rounded-md border border-zinc-800 hover:bg-zinc-800 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent
            side="left"
            className="w-56 p-0 bg-zinc-950 text-zinc-100 border-zinc-800"
          >
            <SheetTitle className="sr-only">Navigation menu</SheetTitle>
            <SidebarContent showLabels />
          </SheetContent>
        </Sheet>
      </>
    )
  }

  // Desktop: standard sidebar
  return (
    <aside
      className={cn(
        'h-screen bg-zinc-950 text-zinc-100 border-r border-zinc-800 flex flex-col transition-all duration-200',
        isCollapsed ? 'w-14' : 'w-56'
      )}
    >
      <SidebarContent showLabels={!isCollapsed} />
    </aside>
  )
}
