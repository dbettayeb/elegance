'use client'
import { useState } from 'react'
import { GuestMessage } from '@/lib/types'

export default function MessageCard({
  message,
  weddingId,
}: {
  message: GuestMessage
  weddingId: string
  coupleToken: string
}) {
  const [approved, setApproved] = useState(message.approved)
  const [loading,  setLoading]  = useState(false)

  async function toggle() {
    setLoading(true)
    const res = await fetch('/api/guestbook/approve', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message_id: message.id,
        wedding_id: weddingId,
        approved:   !approved,
      }),
    })
    if (res.ok) setApproved(!approved)
    setLoading(false)
  }

  return (
    <div style={{
      borderLeft: `3px solid ${approved ? '#C9A84C' : '#ddd'}`,
      padding: '16px 20px',
      background: approved ? '#FAF7F0' : '#f9f9f9',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: '16px',
      opacity: loading ? 0.6 : 1,
      transition: 'opacity 0.2s',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <strong style={{ fontSize: '0.82rem', color: '#2C2416' }}>
            {message.author_name}
          </strong>
          <span style={{ fontSize: '0.65rem', color: '#9B8A6E' }}>
            {new Date(message.created_at).toLocaleDateString('fr-TN', {
              day: 'numeric', month: 'short',
              hour: '2-digit', minute: '2-digit',
            })}
          </span>
          {!approved && (
            <span style={{
              fontSize: '0.58rem', background: '#fff3cd',
              color: '#856404', padding: '2px 8px', borderRadius: '10px',
            }}>
              En attente
            </span>
          )}
        </div>
        <p style={{
          fontFamily: 'Georgia, serif',
          fontSize: '0.95rem',
          fontStyle: 'italic',
          color: '#6B5A3E',
          lineHeight: 1.6,
        }}>
          "{message.message}"
        </p>
      </div>
      <button
        onClick={toggle}
        disabled={loading}
        style={{
          padding: '8px 16px',
          background: approved ? 'transparent' : '#C9A84C',
          color: approved ? '#c0392b' : '#fff',
          border: approved ? '1px solid #c0392b' : 'none',
          fontSize: '0.6rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          cursor: loading ? 'not-allowed' : 'pointer',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          transition: 'all 0.2s',
        }}
      >
        {loading ? '...' : approved ? 'Masquer' : '✓ Approuver'}
      </button>
    </div>
  )
}