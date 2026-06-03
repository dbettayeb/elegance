import { notFound, redirect } from 'next/navigation'
import { createServiceSupabaseClient } from '@/lib/supabase/server'
import { Wedding } from '@/lib/types'
import { getTemplate } from '@/lib/templates'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ t?: string }>
}

export async function generateMetadata({ params, searchParams }: Props) {
  const { slug } = await params
  const { t: token } = await searchParams
  if (!token) return { title: 'Invitation' }

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

export default async function InvitationPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { t: token } = await searchParams

  if (!token) notFound()

  const supabase = createServiceSupabaseClient()
  const { data: wedding, error } = await supabase
    .from('weddings')
    .select('*')
    .eq('slug', slug)
    .eq('access_token', token)
    .single()

  if (error || !wedding) notFound()
  if (wedding.status === 'archived') redirect('/expired')

  const template = getTemplate(wedding.template_id)
  const Component = template.component

  return <Component wedding={wedding as Wedding} />
}