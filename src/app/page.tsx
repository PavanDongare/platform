'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { Suspense } from 'react'

const apps = [
  { id: 'dms', name: 'DMS', icon: '📁', path: '/dms' },
  { id: 'onenote', name: 'OneNote', icon: '📝', path: '/onenote' },
]

function ShellContent() {
  const searchParams = useSearchParams()
  const activeApp = searchParams.get('app')

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/30 p-4 flex flex-col">
        <h1 className="text-xl font-bold mb-6">Platform</h1>
        <nav className="space-y-2 flex-1">
          {apps.map((app) => (
            <div
              key={app.id}
              className={`flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors ${
                activeApp === app.id ? 'bg-muted' : ''
              }`}
            >
              <Link
                href={`?app=${app.id}`}
                className="flex items-center gap-3 flex-1"
              >
                <span className="text-2xl">{app.icon}</span>
                <span className="font-medium">{app.name}</span>
              </Link>
              <Link
                href={app.path}
                target="_blank"
                className="p-1.5 hover:bg-background rounded opacity-60 hover:opacity-100 transition-opacity"
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </nav>
        <div className="text-xs text-muted-foreground pt-4 border-t">
          pavandongare.com
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 overflow-hidden">
        {activeApp ? (
          <iframe
            src={`/${activeApp}`}
            className="w-full h-full border-0"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <p className="text-lg mb-2">Select an app from the sidebar</p>
              <p className="text-sm">or click the arrow to open in a new tab</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    }>
      <ShellContent />
    </Suspense>
  )
}
