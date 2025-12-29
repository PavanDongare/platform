import Link from 'next/link'
import { FileText, PenTool, Network, LucideIcon, LogOut, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { loginAsDemo, signout } from './auth/actions'
import { Button } from '@/components/ui/button'

const apps: {
  name: string
  tagline: string
  icon: LucideIcon
  href: string
  features: string[]
}[] = [
  {
    name: 'Documents',
    tagline: 'Smart document management',
    icon: FileText,
    href: '/dms',
    features: [
      'Claude-powered metadata extraction',
      'Conversational search with tool use',
      'Auto-classification into sections',
    ],
  },
  {
    name: 'Notes',
    tagline: 'Flexible note-taking',
    icon: PenTool,
    href: '/onenote',
    features: [
      'Notebooks → Sections → Pages hierarchy',
      'Infinite canvas editor (tldraw)',
      'Zustand-powered state management',
    ],
  },
  {
    name: 'Metaflow',
    tagline: 'Low-code data platform',
    icon: Network,
    href: '/metaflow',
    features: [
      'Visual ontology graph (ReactFlow)',
      'Runtime-defined schemas via JSONB',
      'Declarative actions & workflows',
    ],
  },
]

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      {/* User bar */}
      <div className="absolute top-4 right-4 flex items-center gap-3">
        {user ? (
          <>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span>{user.email}</span>
            </div>
            <form action={signout}>
              <Button variant="outline" size="sm" type="submit">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </form>
          </>
        ) : (
          <>
            <Link href="/auth/login">
              <Button variant="outline" size="sm">Sign In</Button>
            </Link>
            <form action={async () => {
              'use server'
              await loginAsDemo()
            }}>
              <Button size="sm" type="submit">
                Try Demo
              </Button>
            </form>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
        {apps.map((app) => (
          <div
            key={app.name}
            className="group border border-border p-6 flex flex-col gap-4 hover:border-foreground transition-colors"
          >
            <Link href={app.href} className="flex items-center gap-3">
              <app.icon className="w-8 h-8 text-foreground" strokeWidth={1.5} />
              <div>
                <h2 className="font-semibold text-foreground">{app.name}</h2>
                <p className="text-sm text-muted-foreground">{app.tagline}</p>
              </div>
            </Link>
            <ul className="text-sm text-muted-foreground space-y-1">
              {app.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
            {!user && (
              <form action={async () => {
                'use server'
                await loginAsDemo(app.href)
              }}>
                <Button variant="outline" size="sm" type="submit" className="w-full">
                  Try Demo →
                </Button>
              </form>
            )}
            {user && (
              <Link href={app.href}>
                <Button variant="outline" size="sm" className="w-full">
                  Open →
                </Button>
              </Link>
            )}
          </div>
        ))}
      </div>

      <p className="absolute bottom-8 text-xs text-muted-foreground">Platform</p>
    </div>
  )
}
