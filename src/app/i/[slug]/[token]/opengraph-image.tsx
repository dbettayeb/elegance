import { createServiceSupabaseClient } from '@/lib/supabase/server'
import { createOgWeddingImageResponse, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-wedding-image'
import { buildShareCopy } from '@/lib/share-copy'

export const runtime = 'nodejs'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const revalidate = 3600

export default async function OgImage({ params }: { params: Promise<{ slug: string; token: string }> }) {
  const { slug, token } = await params

  const supabase = createServiceSupabaseClient()
  const { data } = await supabase
    .from('weddings')
    .select('bride_name, groom_name, event_date, template_id, wedding_day_text')
    .eq('slug', slug)
    .eq('access_token', token)
    .single()

  return createOgWeddingImageResponse({
    title: buildShareCopy({
      templateId: data?.template_id,
      weddingDayText: data?.wedding_day_text,
      brideName: '', groomName: '', date: '',
    }).imageTitle,
    brideName: data?.bride_name ?? '',
    groomName: data?.groom_name ?? '',
    date: data
      ? new Date(data.event_date).toLocaleDateString('fr-FR', {
          day: 'numeric', month: 'long', year: 'numeric',
        })
      : '',
  })
}

