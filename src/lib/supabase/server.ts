import { createClient } from '@supabase/supabase-js'

// Service role : accès complet, uniquement côté serveur
// Ne jamais importer ce fichier dans un composant client ('use client')
export function createServiceSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}