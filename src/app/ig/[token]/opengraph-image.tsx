import { createServiceSupabaseClient } from '@/lib/supabase/server'
import { createOgWeddingImageResponse, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-wedding-image'

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
    title: soireeTitle(w?.template_id, w?.wedding_day_text),
    brideName: w?.bride_name ?? '',
    groomName: w?.groom_name ?? '',
    date: w
      ? new Date(w.event_date).toLocaleDateString('fr-FR', {
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
