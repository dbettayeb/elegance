import { ImageResponse } from 'next/og'
import { createServiceSupabaseClient } from '@/lib/supabase/server'

export const size = { width: 1200, height: 630 }
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

  const w = invite?.weddings as { bride_name: string; groom_name: string; event_date: string } | null

  const brideName = w?.bride_name ?? ''
  const groomName = w?.groom_name ?? ''
  const date = w
    ? new Date(w.event_date).toLocaleDateString('fr-FR', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : ''

  const combinedLength = brideName.length + groomName.length
  const nameFontSize = combinedLength > 30 ? 58 : combinedLength > 22 ? 68 : 80

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#0a0a0a',
        }}
      >
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 6,
          background: '#C9A84C', display: 'flex',
        }} />

        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 120px',
        }}>
          <div style={{
            fontSize: 13, letterSpacing: 8, color: '#C9A84C',
            marginBottom: 56, display: 'flex',
          }}>
            ÉLÉGANCE DIGITALE
          </div>

          <div style={{
            fontSize: nameFontSize, fontWeight: 300, color: '#FFFFFF',
            textAlign: 'center', lineHeight: 1.15, marginBottom: 36,
            display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
          }}>
            {brideName} & {groomName}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 }}>
            <div style={{ width: 80, height: 1, background: 'rgba(201,168,76,0.4)', display: 'flex' }} />
            <div style={{ fontSize: 18, color: '#C9A84C', display: 'flex' }}>✦</div>
            <div style={{ width: 80, height: 1, background: 'rgba(201,168,76,0.4)', display: 'flex' }} />
          </div>

          <div style={{
            fontSize: 20, letterSpacing: 5, color: '#888888', display: 'flex',
          }}>
            {date.toUpperCase()}
          </div>
        </div>

        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 6,
          background: '#C9A84C', display: 'flex',
        }} />
      </div>
    ),
    { ...size }
  )
}
