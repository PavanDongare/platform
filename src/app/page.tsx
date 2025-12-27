import Link from 'next/link'
import { FileText, PenTool, Network } from 'lucide-react'

const apps = [
  { name: 'Documents', icon: FileText, href: '/dms' },
  { name: 'Notes', icon: PenTool, href: '/onenote' },
  { name: 'Metaflow', icon: Network, href: '/metaflow' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      <div className="grid grid-cols-3 gap-10 sm:gap-14">
        {apps.map((app) => (
          <Link
            key={app.name}
            href={app.href}
            className="group flex flex-col items-center gap-3"
          >
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center
                         bg-muted border border-border
                         group-hover:bg-accent group-hover:scale-110
                         transition-all duration-200"
            >
              <app.icon className="w-12 h-12 text-foreground" strokeWidth={1.5} />
            </div>
            <span className="text-sm font-medium text-foreground/80">{app.name}</span>
          </Link>
        ))}
      </div>

      <p className="absolute bottom-8 text-xs text-muted-foreground">Platform</p>
    </div>
  )
}
