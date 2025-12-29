import Link from 'next/link'
import { FileText, PenTool, Network, LucideIcon } from 'lucide-react'

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

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
        {apps.map((app) => (
          <Link
            key={app.name}
            href={app.href}
            className="group border border-border p-6 flex flex-col gap-4
                       hover:border-foreground transition-colors"
          >
            <div className="flex items-center gap-3">
              <app.icon className="w-8 h-8 text-foreground" strokeWidth={1.5} />
              <div>
                <h2 className="font-semibold text-foreground">{app.name}</h2>
                <p className="text-sm text-muted-foreground">{app.tagline}</p>
              </div>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1">
              {app.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
          </Link>
        ))}
      </div>

      <p className="absolute bottom-8 text-xs text-muted-foreground">Platform</p>
    </div>
  )
}
