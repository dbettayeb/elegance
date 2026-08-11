import { createServiceSupabaseClient } from '@/lib/supabase/server'
import { createOgWeddingImageResponse, OG_SIZE } from '@/lib/og-wedding-image'

export const size = OG_SIZE
export const contentType = 'image/png'
export const revalidate = 3600

export default async function OgImage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params

  const supabase = createServiceSupabaseClient()
  const { data: invite } = await supabase
    .from('guest_invitations')
    .select('weddings(bride_name, groom_name, event_date)')
    .eq('token', token)
    .single()

  const w = invite?.weddings as unknown as { bride_name: string; groom_name: string; event_date: string } | null

  return createOgWeddingImageResponse({
    brideName: w?.bride_name ?? '',
    groomName: w?.groom_name ?? '',
    date: w
      ? new Date(w.event_date).toLocaleDateString('fr-FR', {
          day: 'numeric', month: 'long', year: 'numeric',
        })
      : '',
  })
}
