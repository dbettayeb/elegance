'use client'
import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function CoupleLogin() {
  const [token, setToken]   = useState('')
  const [error, setError]   = useState('')
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
      background: 'linear-gradient(135deg, #2C2416 0%, #3d2e18 100%)',
      padding: '24px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center',
      }}>
        <div style={{ color: '#C9A84C', fontSize: '2rem', marginBottom: '24px' }}>✦</div>
        <h1 style={{
          fontFamily: 'Georgia, serif',
          fontSize: '1.8rem',
          fontWeight: 300,
          color: '#FAF7F0',
          marginBottom: '8px',
        }}>
          Portail des mariés
        </h1>
        <p style={{
          fontSize: '0.75rem',
          letterSpacing: '0.2em',
          color: '#9B8A6E',
          textTransform: 'uppercase',
          marginBottom: '40px',
        }}>
          Élégance Digitale™
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="text"
            value={token}
            onChange={e => setToken(e.target.value)}
            placeholder="Votre code d'accès"
            required
            style={{
              padding: '16px 20px',
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(201,168,76,0.4)',
              color: '#FAF7F0',
              fontFamily: 'Georgia, serif',
              fontSize: '1rem',
              outline: 'none',
              textAlign: 'center',
              letterSpacing: '0.3em',
              borderRadius: '1px',
            }}
          />
          {error && (
            <p style={{ color: '#e88', fontSize: '0.8rem', fontStyle: 'italic' }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '16px',
              background: 'linear-gradient(135deg, #8B6914, #C9A84C)',
              color: '#fff',
              border: 'none',
              fontSize: '0.65rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Vérification...' : 'Accéder à mon espace'}
          </button>
        </form>
      </div>
    </main>
  )
}