import { notFound, redirect } from 'next/navigation'
import { createServiceSupabaseClient } from '@/lib/supabase/server'
import Bismillah from '@/components/templates/Bismillah'
import { Wedding } from '@/lib/types'
import { getTemplate, TEMPLATES_META } from '@/lib/templates'

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

  const isAr = TEMPLATES_META.find(t => t.id === wedding.template_id)?.language === 'ar'

  if (isAr) {
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
      {dedication && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          padding: '10px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '6px',
          fontSize: '0.85rem',
          fontFamily: 'Georgia, "Times New Roman", serif',
          color: '#2a2a2a',
          letterSpacing: '0.04em',
        }}>
          <span style={{ opacity: 0.5, fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Invitation personnalisée ·
          </span>
          <span style={{ fontStyle: 'italic' }}>{dedication}</span>
        </div>
      )}
      <div style={{ paddingTop: dedication ? '42px' : undefined }}>
        <Template wedding={wedding as Wedding} />
      </div>
    </>
  )
}
