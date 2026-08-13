import { createServiceSupabaseClient } from '@/lib/supabase/server'
import { createOgWeddingImageResponse, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-wedding-image'

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
    title: soireeTitle(data?.template_id, data?.wedding_day_text),
    brideName: data?.bride_name ?? '',
    groomName: data?.groom_name ?? '',
    date: data
      ? new Date(data.event_date).toLocaleDateString('fr-FR', {
          day: 'numeric', month: 'long', year: 'numeric',
        })
      : '',
  })
}

/**
 * Titre de la soirée, sur les seuls templates concernés.
 *
 * Ailleurs on garde les prénoms : c'est bien un mariage. Soirée couvre un
 * henné, des fiançailles, une réception — annoncer « invitation au mariage
 * de » y serait faux, et le couple n'y est pas toujours nommé.
 */
function soireeTitle(templateId?: string | null, weddingDayText?: string | null) {
  if (templateId !== 'soiree_ar' && templateId !== 'soiree_fr') return undefined
  const fallback = templateId === 'soiree_fr' ? 'Notre soirée' : 'ليلة العمر'
  return weddingDayText?.trim() || fallback
}
