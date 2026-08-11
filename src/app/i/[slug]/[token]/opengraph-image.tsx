import { createServiceSupabaseClient } from '@/lib/supabase/server'
import { createOgWeddingImageResponse, OG_SIZE } from '@/lib/og-wedding-image'

export const runtime = 'nodejs'
export const size = OG_SIZE
export const contentType = 'image/png'
export const revalidate = 3600

export default async function OgImage({ params }: { params: Promise<{ slug: string; token: string }> }) {
  const { slug, token } = await params

  const supabase = createServiceSupabaseClient()
  const { data } = await supabase
    .from('weddings')
    .select('bride_name, groom_name, event_date')
    .eq('slug', slug)
    .eq('access_token', token)
    .single()

  return createOgWeddingImageResponse({
    brideName: data?.bride_name ?? '',
    groomName: data?.groom_name ?? '',
    date: data
      ? new Date(data.event_date).toLocaleDateString('fr-FR', {
          day: 'numeric', month: 'long', year: 'numeric',
        })
      : '',
  })
}
