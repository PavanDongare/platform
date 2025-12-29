import { MetaflowNav } from './components/metaflow-nav'

export default function MetaflowLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full flex flex-col">
      <MetaflowNav />
      <div className="flex-1">{children}</div>
    </div>
  )
}
