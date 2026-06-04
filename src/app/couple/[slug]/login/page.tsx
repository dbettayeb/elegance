'use client'
import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function CoupleLogin() {
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { slug } = useParams<{ slug: string }>()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/couple/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, token }),
    })

    if (res.ok) {
      router.push(`/couple/${slug}`)
    } else {
      const data = await res.json()
      setError(data.error ?? 'Code invalide.')
      setLoading(false)
    }
  }

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#fafafa',
      padding: '24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            color: '#fff',
            borderRadius: '12px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            marginBottom: '16px',
          }}>
            ✦
          </div>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 600,
            color: '#171717',
            margin: '0 0 6px',
          }}>
            Espace des mariés
          </h1>
          <p style={{
            fontSize: '0.9rem',
            color: '#737373',
            margin: 0,
            lineHeight: 1.5,
          }}>
            Suivez en temps réel les confirmations<br />et messages de vos invités.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            background: '#fff',
            border: '1px solid #e5e5e5',
            borderRadius: '12px',
            padding: '28px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <label style={{
            display: 'block',
            fontSize: '0.85rem',
            fontWeight: 500,
            color: '#171717',
            marginBottom: '6px',
          }}>
            Votre code d'accès
          </label>
          <p style={{
            fontSize: '0.78rem',
            color: '#737373',
            marginBottom: '10px',
            margin: '0 0 10px',
          }}>
            Le code unique qui vous a été communiqué par Élégance Digitale.
          </p>
          <input
            type="text"
            value={token}
            onChange={e => setToken(e.target.value)}
            placeholder="exemple : a3k9p2x7"
            required
            autoFocus
            autoComplete="off"
            style={{
              width: '100%',
              padding: '12px 14px',
              fontSize: '1rem',
              border: '1px solid #d4d4d4',
              borderRadius: '8px',
              outline: 'none',
              fontFamily: 'ui-monospace, monospace',
              letterSpacing: '0.1em',
              textAlign: 'center',
              transition: 'border-color 0.15s, box-shadow 0.15s',
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = '#2563eb'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = '#d4d4d4'
              e.currentTarget.style.boxShadow = 'none'
            }}
          />

          {error && (
            <div style={{
              marginTop: '14px',
              padding: '10px 12px',
              background: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '6px',
              fontSize: '0.85rem',
              color: '#991b1b',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              marginTop: '18px',
              padding: '12px',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.92rem',
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              transition: 'opacity 0.15s',
              fontFamily: 'inherit',
            }}
          >
            {loading ? 'Vérification...' : 'Accéder à mon espace'}
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          marginTop: '20px',
          fontSize: '0.8rem',
          color: '#a3a3a3',
        }}>
          Vous avez perdu votre code ?{' '}
          <a href="mailto:contact@elegance-digitale.com" style={{ color: '#2563eb', textDecoration: 'none' }}>
            Contactez-nous
          </a>
        </p>
      </div>
    </main>
  )
}