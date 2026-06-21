'use client'

import { useState } from 'react'
import { GuestInvitation } from '@/lib/types'

export default function GuestInvitationsPanel({
  weddingId,
  slug,
  initialInvitations,
  baseUrl,
  accentColor,
}: {
  weddingId: string
  slug: string
  initialInvitations: GuestInvitation[]
  baseUrl: string
  accentColor: string
}) {
  const [invitations, setInvitations] = useState(initialInvitations)
  const [guestName, setGuestName] = useState('')
  const [prefix, setPrefix] = useState('إلى السيد')
  const [suffix, setSuffix] = useState('و حرمه')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [error, setError] = useState('')

  const inputStyle = {
    width: '100%', padding: '9px 12px',
    border: '1px solid #d4d4d4',
    borderRadius: '6px', background: '#ffffff',
    color: '#171717', fontFamily: "'Amiri', serif", fontSize: '0.95rem',
    outline: 'none', boxSizing: 'border-box' as const,
  }

  async function create() {
    const name = guestName.trim()
    if (!name) return
    setLoading(true)
    setError('')
    const res = await fetch('/api/couple/guest-invitations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug, wedding_id: weddingId, guest_name_ar: name,
        prefix_ar: prefix.trim() || null,
        suffix_ar: suffix.trim() || null,
      }),
    })
    const data = await res.json()
    if (res.ok) {
      setInvitations(prev => [data.invitation, ...prev])
      setGuestName('')
    } else {
      setError(data.error ?? 'Erreur')
    }
    setLoading(false)
  }

  async function del(id: string) {
    const res = await fetch(`/api/couple/guest-invitations/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    })
    if (res.ok) setInvitations(prev => prev.filter(i => i.id !== id))
  }

  function copyLink(token: string) {
    navigator.clipboard.writeText(`${baseUrl}/ig/${token}`)
    setCopied(token)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 120px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, marginBottom: '6px', color: '#171717' }}>
              Après le nom
            </label>
            <input value={suffix} onChange={e => setSuffix(e.target.value)} dir="rtl" style={inputStyle} />
          </div>
          <div style={{ flex: '2 1 180px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, marginBottom: '6px', color: '#171717' }}>
              Nom de l'invité (arabe)
            </label>
            <input
              value={guestName}
              onChange={e => setGuestName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') create() }}
              placeholder="ضياء الحق بالطيب"
              dir="rtl"
              style={inputStyle}
            />
          </div>
          <div style={{ flex: '1 1 120px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, marginBottom: '6px', color: '#171717' }}>
              Avant le nom
            </label>
            <input value={prefix} onChange={e => setPrefix(e.target.value)} dir="rtl" style={inputStyle} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch', flexWrap: 'wrap' }}>
          <div style={{
            flex: '1 1 180px', padding: '8px 12px',
            background: '#FAF7F0',
            border: '1px solid #e5e5e5',
            borderRadius: '6px',
            fontFamily: "'Amiri', serif", fontSize: '0.95rem',
            direction: 'rtl', textAlign: 'right', color: '#5C4A14',
          }}>
            {prefix || 'إلى السيد'} {guestName || '…'} {suffix || 'و حرمه'}
          </div>
          <button
            onClick={create}
            disabled={loading || !guestName.trim()}
            style={{
              flex: '0 0 auto', padding: '9px 16px', background: '#171717', color: '#fff',
              border: 'none', borderRadius: '6px', cursor: 'pointer',
              fontSize: '0.85rem', fontWeight: 500, whiteSpace: 'nowrap',
              opacity: loading || !guestName.trim() ? 0.5 : 1,
            }}
          >
            {loading ? '…' : '+ Créer le lien'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ fontSize: '0.8rem', color: '#f87171' }}>{error}</div>
      )}

      {invitations.length === 0 ? (
        <div style={{ fontSize: '0.85rem', color: '#737373', padding: '12px 0' }}>
          Aucune invitation personnalisée.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {invitations.map(inv => (
            <div
              key={inv.id}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap',
                padding: '10px 12px',
                border: '1px solid #e5e5e5',
                borderRadius: '6px',
                background: '#fafafa',
              }}
            >
              <span style={{
                flex: '1 1 160px', fontFamily: "'Amiri', serif", fontSize: '1rem',
                direction: 'rtl', textAlign: 'right',
              }}>
                {inv.prefix_ar || 'إلى السيد'} {inv.guest_name_ar} {inv.suffix_ar || 'و حرمه'}
              </span>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flex: '0 0 auto' }}>
                <span style={{ fontSize: '0.7rem', opacity: 0.5, whiteSpace: 'nowrap' }}>
                  {new Date(inv.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                </span>
                <button
                  onClick={() => copyLink(inv.token)}
                  style={{
                    padding: '5px 10px', fontSize: '0.75rem',
                    background: copied === inv.token ? '#dcfce7' : '#ffffff',
                    color: copied === inv.token ? '#166534' : '#404040',
                    border: '1px solid #d4d4d4',
                    borderRadius: '6px', cursor: 'pointer', whiteSpace: 'nowrap',
                  }}
                >
                  {copied === inv.token ? '✓ Copié' : 'Copier le lien'}
                </button>
                <button
                  onClick={() => del(inv.id)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#dc2626', fontSize: '1rem', padding: '4px',
                  }}
                  title="Supprimer"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
