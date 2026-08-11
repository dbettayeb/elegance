import { notFound, redirect } from 'next/navigation'
import { createServiceSupabaseClient } from '@/lib/supabase/server'
import Bismillah from '@/components/templates/Bismillah'
import GuestDedicationOverlay from '@/components/common/GuestDedicationOverlay'
import { Wedding } from '@/lib/types'
import { getTemplate } from '@/lib/templates'

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const supabase = createServiceSupabaseClient()
  const { data: invite } = await supabase
    .from('guest_invitations')
    .select('guest_name_ar, weddings(bride_name, groom_name, event_date)')
    .eq('token', token)
    .single()

  if (!invite) return { title: 'Invitation' }
  const w = invite.weddings as unknown as { bride_name: string; groom_name: string; event_date: string } | null

  const date = w?.event_date
    ? new Date(w.event_date).toLocaleDateString('fr-TN', { day: 'numeric', month: 'long', year: 'numeric' })
    : ''
  const title = `${w?.bride_name ?? ''} & ${w?.groom_name ?? ''} · ${date}`
  const description = `Vous êtes cordialement invités au mariage de ${w?.bride_name ?? ''} et ${w?.groom_name ?? ''}.`
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? ''

  const imageUrl = `${base}/ig/${token}/opengraph-image`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${base}/ig/${token}`,
      type: 'website',
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}

export default async function GuestInvitationPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const supabase = createServiceSupabaseClient()

  const { data: invite } = await supabase
    .from('guest_invitations')
    .select('guest_name_ar, prefix_ar, suffix_ar, wedding_id')
    .eq('token', token)
    .single()

  if (!invite) notFound()

  const { data: wedding } = await supabase
    .from('weddings')
    .select('*')
    .eq('id', invite.wedding_id)
    .single()

  if (!wedding) notFound()
  if (wedding.status === 'suspended') redirect('/expired')
  if (wedding.status === 'archived') redirect(`/expired/${wedding.slug}`)

  if (wedding.template_id === 'bismillah') {
    return (
      <Bismillah
        wedding={wedding as Wedding}
        guestNameAr={invite.guest_name_ar}
        guestPrefixAr={invite.prefix_ar ?? undefined}
        guestSuffixAr={invite.suffix_ar ?? undefined}
      />
    )
  }

  const Template = getTemplate(wedding.template_id).component
  const prefix = invite.prefix_ar ?? ''
  const name   = invite.guest_name_ar ?? ''
  const suffix = invite.suffix_ar ?? ''
  const dedication = [prefix, name, suffix].filter(Boolean).join(' ')

  return (
    <>
      <GuestDedicationOverlay dedication={dedication} />
      <Template wedding={wedding as Wedding} />
    </>
  )
}
