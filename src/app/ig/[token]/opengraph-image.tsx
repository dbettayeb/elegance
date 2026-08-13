import { createServiceSupabaseClient } from '@/lib/supabase/server'
import { createOgWeddingImageResponse, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-wedding-image'
import { buildShareCopy } from '@/lib/share-copy'

export const runtime = 'nodejs'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const revalidate = 3600

export default async function OgImage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params

  const supabase = createServiceSupabaseClient()
  const { data: invite } = await supabase
    .from('guest_invitations')
    .select('weddings(bride_name, groom_name, event_date, template_id, wedding_day_text)')
    .eq('token', token)
    .single()

  const w = invite?.weddings as unknown as { bride_name: string; groom_name: string; event_date: string; template_id: string; wedding_day_text: string | null } | null

  return createOgWeddingImageResponse({
    title: buildShareCopy({
      templateId: w?.template_id,
      weddingDayText: w?.wedding_day_text,
      brideName: '', groomName: '', date: '',
    }).imageTitle,
    brideName: w?.bride_name ?? '',
    groomName: w?.groom_name ?? '',
    date: w
      ? new Date(w.event_date).toLocaleDateString('fr-FR', {
          day: 'numeric', month: 'long', year: 'numeric',
        })
      : '',
  })
}

