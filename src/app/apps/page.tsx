import { createClient } from '@/lib/supabase/server'
import { apps } from '@/lib/apps-data'
import { AppCard } from '@/components/app-card'

export default async function AppsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-white text-zinc-900 pt-20">
      <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24 py-12">
        <p className="text-zinc-400 text-xs uppercase tracking-widest mb-12">Applications</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app) => (
            <AppCard key={app.name} app={app} isLoggedIn={!!user} />
          ))}
        </div>
      </div>
    </div>
  )
}
