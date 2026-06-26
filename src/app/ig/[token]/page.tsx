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
    .select('guest_name_ar, weddings(bride_name, groom_name)')
    .eq('token', token)
    .single()

  if (!invite) return { title: 'Invitation' }
  const w = invite.weddings as unknown as { bride_name: string; groom_name: string } | null
  return {
    title: `Invitation — ${w?.bride_name ?? ''} & ${w?.groom_name ?? ''}`,
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
