import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

function getSupabaseUrl(): string {
  // Server-side: use env variable
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_SUPABASE_URL!
  }

  // Client-side: detect based on hostname
  const hostname = window.location.hostname

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://127.0.0.1:54321'
  }

  // Production: use api subdomain with same protocol
  return `${window.location.protocol}//api.${hostname}`
}

export function getSupabase(schema: string = 'public'): SupabaseClient {
  return createClient(getSupabaseUrl(), supabaseKey, {
    db: { schema }
  })
}
