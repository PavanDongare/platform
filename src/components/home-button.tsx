import Link from 'next/link'
import { Home } from 'lucide-react'

export function HomeButton() {
  return (
    <Link
      href="/"
      className="fixed bottom-6 left-6 z-50 p-3 bg-background/80 backdrop-blur-sm border rounded-full shadow-lg hover:bg-accent transition-all hover:scale-110"
    >
      <Home className="w-5 h-5" />
    </Link>
  )
}
