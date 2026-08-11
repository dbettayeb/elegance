import { ImageResponse } from 'next/og'
import { createServiceSupabaseClient } from '@/lib/supabase/server'
import { buildOgWeddingImage } from '@/lib/og-wedding-image'

export const size = { width: 1200, height: 630 }
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

  const brideName = data?.bride_name ?? ''
  const groomName = data?.groom_name ?? ''
  const date = data
    ? new Date(data.event_date).toLocaleDateString('fr-FR', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : ''

  return new ImageResponse(
    buildOgWeddingImage({ brideName, groomName, date }),
    { ...size }
  )
}
