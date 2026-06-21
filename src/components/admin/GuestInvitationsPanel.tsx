'use client'

import { useState } from 'react'
import { GuestInvitation } from '@/lib/types'

export default function GuestInvitationsPanel({
  weddingId,
  initialInvitations,
  baseUrl,
  isArabic = false,
}: {
  weddingId: string
  initialInvitations: GuestInvitation[]
  baseUrl: string
  isArabic?: boolean
}) {
  const [invitations, setInvitations] = useState(initialInvitations)
  const [guestName, setGuestName] = useState('')
  const [prefix, setPrefix] = useState(isArabic ? 'إلى السيد' : 'Chers')
  const [suffix, setSuffix] = useState(isArabic ? 'و حرمه' : '')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [error, setError] = useState('')

  async function create() {
    const name = guestName.trim()
    if (!name) return
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/guest-invitations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wedding_id: weddingId,
        guest_name_ar: name,
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
    const res = await fetch(`/api/admin/guest-invitations/${id}`, { method: 'DELETE' })
    if (res.ok) setInvitations(prev => prev.filter(i => i.id !== id))
  }

  function copyLink(token: string) {
    navigator.clipboard.writeText(`${baseUrl}/ig/${token}`)
    setCopied(token)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Formulaire de création */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 140px' }}>
            <label className="admin-label">Avant le nom</label>
            <input
              className="admin-input"
              value={prefix}
              onChange={e => setPrefix(e.target.value)}
              dir={isArabic ? 'rtl' : 'ltr'}
              style={isArabic ? { fontFamily: "'Amiri', serif" } : {}}
            />
          </div>
          <div style={{ flex: '2 1 200px' }}>
            <label className="admin-label">Nom de l'invité</label>
            <input
              className="admin-input"
              value={guestName}
              onChange={e => setGuestName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') create() }}
              placeholder={isArabic ? 'ضياء الحق بالطيب' : 'Jean & Marie Dupont'}
              dir={isArabic ? 'rtl' : 'ltr'}
              style={isArabic ? { fontFamily: "'Amiri', serif", fontSize: '1rem' } : {}}
            />
          </div>
          <div style={{ flex: '1 1 140px' }}>
            <label className="admin-label">Après le nom</label>
            <input
              className="admin-input"
              value={suffix}
              onChange={e => setSuffix(e.target.value)}
              dir={isArabic ? 'rtl' : 'ltr'}
              style={isArabic ? { fontFamily: "'Amiri', serif" } : {}}
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch', flexWrap: 'wrap' }}>
          <div
            style={{
              flex: '1 1 200px', padding: '8px 12px', background: '#FAF7F0',
              border: '1px solid var(--admin-border)', borderRadius: 'var(--admin-radius)',
              fontFamily: isArabic ? "'Amiri', serif" : 'inherit',
              fontSize: isArabic ? '1rem' : '0.9rem',
              direction: isArabic ? 'rtl' : 'ltr',
              color: '#5C4A14',
              textAlign: isArabic ? 'right' : 'left',
            }}
          >
            {isArabic
              ? `${prefix || 'إلى السيد'} ${guestName || '…'} ${suffix || 'و حرمه'}`
              : [prefix, guestName || '…', suffix].filter(Boolean).join(' ')}
          </div>
          <button
            className="admin-btn"
            onClick={create}
            disabled={loading || !guestName.trim()}
            style={{ whiteSpace: 'nowrap', flex: '0 0 auto' }}
          >
            {loading ? '…' : '+ Créer le lien'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ fontSize: '0.82rem', color: 'var(--admin-danger)' }}>{error}</div>
      )}

      {/* Liste des invitations */}
      {invitations.length === 0 ? (
        <div style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', padding: '12px 0' }}>
          Aucune invitation personnalisée créée.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {invitations.map(inv => (
            <div
              key={inv.id}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap',
                padding: '10px 12px',
                border: '1px solid var(--admin-border)',
                borderRadius: 'var(--admin-radius)',
                background: '#fafafa',
              }}
            >
              <span style={{
                flex: '1 1 160px',
                fontFamily: isArabic ? "'Amiri', serif" : 'inherit',
                fontSize: isArabic ? '1rem' : '0.88rem',
                direction: isArabic ? 'rtl' : 'ltr',
                textAlign: isArabic ? 'right' : 'left',
              }}>
                {isArabic
                  ? `${inv.prefix_ar || 'إلى السيد'} ${inv.guest_name_ar} ${inv.suffix_ar || 'و حرمه'}`
                  : [inv.prefix_ar, inv.guest_name_ar, inv.suffix_ar].filter(Boolean).join(' ')}
              </span>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flex: '0 0 auto' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', whiteSpace: 'nowrap' }}>
                  {new Date(inv.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                </span>
                <button
                  onClick={() => copyLink(inv.token)}
                  className="admin-btn admin-btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '5px 10px', whiteSpace: 'nowrap' }}
                >
                  {copied === inv.token ? '✓ Copié' : 'Copier le lien'}
                </button>
                <button
                  onClick={() => del(inv.id)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--admin-danger)', fontSize: '1rem', padding: '4px',
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
