'use client'
import { useState } from 'react'
import { GuestMessage } from '@/lib/types'
import type { CoupleTheme } from '@/lib/couple-themes'

export default function MessageCard({
  message,
  weddingId,
  theme,
}: {
  message: GuestMessage
  weddingId: string
  coupleToken: string
  theme: CoupleTheme
}) {
  const [approved, setApproved] = useState(message.approved)
  const [loading, setLoading] = useState(false)

  async function toggle() {
    setLoading(true)
    const res = await fetch('/api/guestbook/approve', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message_id: message.id,
        wedding_id: weddingId,
        approved: !approved,
      }),
    })
    if (res.ok) setApproved(!approved)
    setLoading(false)
  }

  return (
    <div style={{
      borderLeft: `3px solid ${approved ? theme.accent : theme.borderStrong}`,
      borderRadius: theme.radius,
      padding: '16px 20px',
      background: theme.cardBg,
      boxShadow: theme.cardShadow,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: '16px',
      opacity: loading ? 0.6 : 1,
      transition: 'opacity 0.2s',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '6px',
          flexWrap: 'wrap',
        }}>
          <strong style={{
            fontSize: '0.85rem',
            color: theme.textPrimary,
            fontFamily: theme.bodyFont,
          }}>
            {message.author_name}
          </strong>
          <span style={{
            fontSize: '0.7rem',
            color: theme.textMuted,
          }}>
            {new Date(message.created_at).toLocaleDateString('fr-TN', {
              day: 'numeric', month: 'short',
              hour: '2-digit', minute: '2-digit',
            })}
          </span>
          {!approved && (
            <span style={{
              fontSize: '0.62rem',
              background: 'rgba(202, 138, 4, 0.15)',
              color: '#854d0e',
              padding: '2px 9px',
              borderRadius: '20px',
              fontWeight: 500,
            }}>
              En attente
            </span>
          )}
        </div>
        <p style={{
          fontFamily: theme.headingFont,
          fontSize: '0.98rem',
          fontStyle: 'italic',
          color: theme.textSecondary,
          lineHeight: 1.6,
          margin: 0,
        }}>
          "{message.message}"
        </p>
      </div>

      <button
        onClick={toggle}
        disabled={loading}
        style={{
          padding: '7px 14px',
          background: approved ? 'transparent' : theme.accent,
          color: approved ? theme.danger : (theme.pageBg === '#FFFFFF' ? '#fff' : theme.cardBg),
          border: approved ? `1px solid ${theme.danger}` : 'none',
          borderRadius: theme.radius === '0px' ? '4px' : theme.radius,
          fontSize: '0.65rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          cursor: loading ? 'not-allowed' : 'pointer',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          transition: 'all 0.2s',
          fontFamily: theme.bodyFont,
          fontWeight: 500,
        }}
      >
        {loading ? '...' : approved ? 'Masquer' : '✓ Approuver'}
      </button>
    </div>
  )
}