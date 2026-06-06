// src/app/i/[slug]/[token]/page.tsx
import { notFound, redirect } from 'next/navigation'
import { createServiceSupabaseClient } from '@/lib/supabase/server'
import { Wedding } from '@/lib/types'
import { getTemplate } from '@/lib/templates'

// ✅ Cache CDN 1h — 10 000 visites = ~10 requêtes Supabase
// Pour invalider manuellement après une modification admin, on utilise revalidatePath
export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string; token: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug, token } = await params

  const supabase = createServiceSupabaseClient()
  const { data } = await supabase
    .from('weddings')
    .select('bride_name, groom_name, event_date')
    .eq('slug', slug)
    .eq('access_token', token)
    .single()

  if (!data) return { title: 'Invitation' }

  const date = new Date(data.event_date).toLocaleDateString('fr-TN', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return {
    title: `${data.bride_name} & ${data.groom_name} · ${date}`,
    description: `Vous êtes cordialement invités au mariage de ${data.bride_name} et ${data.groom_name}.`,
  }
}

export default async function InvitationPage({ params }: Props) {
  const { slug, token } = await params

  const supabase = createServiceSupabaseClient()
  const { data: wedding, error } = await supabase
    .from('weddings')
    .select('*')
    .eq('slug', slug)
    .eq('access_token', token)
    .single()

  if (error || !wedding) notFound()

  // Si archivé → page commémorative spécifique
  if (wedding.status === 'archived') {
    redirect(`/expired/${slug}`)
  }

  // Si suspendu → page expirée générique sans détails
  if (wedding.status === 'suspended') {
    redirect('/expired')
  }

  const template = getTemplate(wedding.template_id)
  const Component = template.component

  return <Component wedding={wedding as Wedding} />
}