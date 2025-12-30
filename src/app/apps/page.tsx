import { createClient } from '@/lib/supabase/server'
import { apps } from '@/lib/apps-data'
import { AppCard } from '@/components/app-card'

export default async function AppsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
        {apps.map((app) => (
          <AppCard key={app.name} app={app} isLoggedIn={!!user} />
        ))}
      </div>
    </div>
  )
}
