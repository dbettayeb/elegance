'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  weddingId: string
  slug: string
  status: string
  coupleNames: string
}

export default function WeddingActions({ weddingId, slug, status, coupleNames }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [newTokens, setNewTokens] = useState<{ inviteUrl: string; coupleUrl: string; coupleToken: string } | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [confirmRegen, setConfirmRegen] = useState(false)
  const [confirmStatus, setConfirmStatus] = useState<string | null>(null)

  async function changeStatus(newStatus: string) {
    setLoading('status')
    setError('')
    const res = await fetch(`/api/admin/weddings/${weddingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _action: 'change_status', status: newStatus }),
    })
    if (res.ok) {
      router.refresh()
      setConfirmStatus(null)
    } else {
      const data = await res.json()
      setError(data.error ?? 'Erreur.')
    }
    setLoading(null)
  }

  async function regenerateTokens() {
    setLoading('regen')
    setError('')
    const res = await fetch(`/api/admin/weddings/${weddingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _action: 'regenerate_tokens' }),
    })
    const data = await res.json()
    if (res.ok) {
      setNewTokens(data)
      setConfirmRegen(false)
      router.refresh()
    } else {
      setError(data.error ?? 'Erreur.')
    }
    setLoading(null)
  }

  async function deleteWedding() {
    setLoading('delete')
    setError('')
    const res = await fetch(`/api/admin/weddings/${weddingId}`, {
      method: 'DELETE',
    })
    if (res.ok) {
      router.push('/admin')
    } else {
      const data = await res.json()
      setError(data.error ?? 'Erreur.')
      setLoading(null)
    }
  }

  return (
    <div className="admin-card">
      {/* Tokens régénérés */}
      {newTokens && (
        <div style={{
          padding: '14px',
          background: '#dcfce7',
          border: '1px solid #bbf7d0',
          borderRadius: 'var(--admin-radius)',
          marginBottom: '16px',
        }}>
          <div style={{ fontWeight: 600, color: '#166534', marginBottom: '10px' }}>
            ✓ Nouveaux liens générés. Les anciens ne fonctionnent plus.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
            <div><strong>Lien invités :</strong> <code style={tokenStyle}>{newTokens.inviteUrl}</code></div>
            <div><strong>Lien mariés :</strong> <code style={tokenStyle}>{newTokens.coupleUrl}</code></div>
            <div><strong>Code accès :</strong> <code style={tokenStyle}>{newTokens.coupleToken}</code></div>
          </div>
          <button
            onClick={() => setNewTokens(null)}
            className="admin-btn admin-btn-secondary"
            style={{ marginTop: '12px', padding: '5px 12px', fontSize: '0.8rem' }}
          >
            OK
          </button>
        </div>
      )}

      {error && (
        <div style={{
          padding: '10px 12px',
          background: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: 'var(--admin-radius)',
          color: '#991b1b',
          fontSize: '0.85rem',
          marginBottom: '12px',
        }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>

        {/* ── Bloc Statut ── */}
        <ActionBlock
          title="Statut"
          description="Activer, archiver ou suspendre le mariage."
        >
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { val: 'active', label: 'Actif', accent: '#16a34a' },
              { val: 'archived', label: 'Archivé', accent: '#737373' },
              { val: 'suspended', label: 'Suspendu', accent: '#dc2626' },
            ].map(s => (
              <button
                key={s.val}
                onClick={() => setConfirmStatus(s.val)}
                disabled={status === s.val || loading === 'status'}
                style={{
                  padding: '6px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  background: status === s.val ? s.accent : 'transparent',
                  color: status === s.val ? '#fff' : s.accent,
                  border: `1px solid ${s.accent}`,
                  borderRadius: 'var(--admin-radius)',
                  cursor: status === s.val ? 'default' : 'pointer',
                  opacity: status === s.val ? 1 : 0.85,
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </ActionBlock>

        {/* ── Bloc Régénération ── */}
        <ActionBlock
          title="Régénérer les liens"
          description="Si un lien a fuité, créez de nouveaux tokens. Les anciens cesseront immédiatement de fonctionner."
        >
          <button
            onClick={() => setConfirmRegen(true)}
            disabled={loading === 'regen'}
            className="admin-btn admin-btn-secondary"
            style={{ fontSize: '0.82rem' }}
          >
            {loading === 'regen' ? 'Génération...' : 'Régénérer'}
          </button>
        </ActionBlock>

        {/* ── Bloc Suppression ── */}
        <ActionBlock
          title="Supprimer définitivement"
          description="Cette action est irréversible. Toutes les données seront perdues."
          danger
        >
          <button
            onClick={() => setConfirmDelete(true)}
            disabled={loading === 'delete'}
            className="admin-btn admin-btn-danger"
            style={{ fontSize: '0.82rem' }}
          >
            Supprimer
          </button>
        </ActionBlock>
      </div>

      {/* ── Modales de confirmation ── */}
      {confirmStatus && (
        <ConfirmModal
          title={`Changer le statut en "${confirmStatus}" ?`}
          message={
            confirmStatus === 'archived'
              ? "Le mariage sera archivé. Les invités verront une page 'événement terminé'."
              : confirmStatus === 'suspended'
              ? "Le mariage sera suspendu. Les invités ne pourront plus accéder à l'invitation."
              : "Le mariage redeviendra actif et accessible aux invités."
          }
          onConfirm={() => changeStatus(confirmStatus)}
          onCancel={() => setConfirmStatus(null)}
          loading={loading === 'status'}
        />
      )}

      {confirmRegen && (
        <ConfirmModal
          title="Régénérer les liens d'accès ?"
          message="Les liens actuellement partagés ne fonctionneront plus. Vous devrez renvoyer les nouveaux liens aux invités et aux mariés."
          onConfirm={regenerateTokens}
          onCancel={() => setConfirmRegen(false)}
          loading={loading === 'regen'}
          danger
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          title={`Supprimer le mariage "${coupleNames}" ?`}
          message="Cette action est irréversible. Toutes les confirmations et messages seront perdus définitivement."
          confirmLabel="Oui, supprimer définitivement"
          onConfirm={deleteWedding}
          onCancel={() => setConfirmDelete(false)}
          loading={loading === 'delete'}
          danger
        />
      )}
    </div>
  )
}

// ── Sous-composants ──
function ActionBlock({ title, description, danger, children }: {
  title: string; description: string; danger?: boolean; children: React.ReactNode
}) {
  return (
    <div style={{
      padding: '14px',
      background: danger ? '#fef2f2' : '#fafafa',
      border: `1px solid ${danger ? '#fecaca' : 'var(--admin-border)'}`,
      borderRadius: 'var(--admin-radius)',
    }}>
      <div style={{
        fontSize: '0.85rem',
        fontWeight: 600,
        color: danger ? '#991b1b' : 'var(--admin-text)',
        marginBottom: '4px',
      }}>
        {title}
      </div>
      <div style={{
        fontSize: '0.78rem',
        color: 'var(--admin-text-muted)',
        marginBottom: '12px',
        lineHeight: 1.5,
      }}>
        {description}
      </div>
      {children}
    </div>
  )
}

function ConfirmModal({ title, message, confirmLabel, onConfirm, onCancel, loading, danger }: {
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
  danger?: boolean
}) {
  return (
    <div
      onClick={onCancel}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: '8px',
          padding: '24px',
          maxWidth: '420px',
          width: '100%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
      >
        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, margin: '0 0 10px' }}>
          {title}
        </h3>
        <p style={{
          fontSize: '0.88rem',
          color: 'var(--admin-text-muted)',
          margin: '0 0 20px',
          lineHeight: 1.6,
        }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            disabled={loading}
            className="admin-btn admin-btn-secondary"
            style={{ fontSize: '0.82rem' }}
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={danger ? 'admin-btn admin-btn-danger' : 'admin-btn'}
            style={{ fontSize: '0.82rem' }}
          >
            {loading ? 'En cours...' : (confirmLabel ?? 'Confirmer')}
          </button>
        </div>
      </div>
    </div>
  )
}

const tokenStyle: React.CSSProperties = {
  background: 'rgba(22,101,52,0.1)',
  padding: '2px 6px',
  borderRadius: '3px',
  fontSize: '0.75rem',
  wordBreak: 'break-all',
}