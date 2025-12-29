'use client'

import { useState } from 'react'
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
  Home,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const apps = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Documents', href: '/dms', icon: FileText },
  { name: 'Notes', href: '/onenote', icon: StickyNote },
  { name: 'Metaflow', href: '/metaflow', icon: GitBranch },
]

interface AppSidebarProps {
  email?: string | null
}

export function AppSidebar({ email }: AppSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'h-screen bg-zinc-950 text-zinc-100 border-r border-zinc-800 flex flex-col transition-all duration-200',
        isCollapsed ? 'w-14' : 'w-56'
      )}
    >
      {/* Header with collapse toggle */}
      <div className="h-12 flex items-center justify-between px-3 border-b border-zinc-800">
        {!isCollapsed && (
          <span className="text-sm font-medium text-zinc-400">Platform</span>
        )}
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
      </div>

      {/* Apps navigation */}
      <nav className="flex-1 py-2">
        {apps.map((app) => {
          const isActive = app.href === '/'
            ? pathname === '/'
            : pathname.startsWith(app.href)
          return (
            <Link
              key={app.href}
              href={app.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 mx-2 rounded text-sm transition-colors',
                isActive
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              )}
            >
              <app.icon className="w-4 h-4 flex-shrink-0" />
              {!isCollapsed && <span>{app.name}</span>}
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
                isCollapsed ? 'justify-center' : ''
              )}
            >
              <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-zinc-400" />
              </div>
              {!isCollapsed && (
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
                  isCollapsed ? 'justify-center' : ''
                )}
              >
                <LogOut className="w-4 h-4 flex-shrink-0" />
                {!isCollapsed && <span>Logout</span>}
              </button>
            </form>
          </>
        ) : (
          <Link
            href="/auth/login"
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors',
              isCollapsed ? 'justify-center' : ''
            )}
          >
            <LogIn className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span>Sign In</span>}
          </Link>
        )}
      </div>
    </aside>
  )
}
