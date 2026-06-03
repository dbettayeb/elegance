'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/admin')
    } else {
      setError('Mot de passe incorrect.')
      setLoading(false)
    }
  }

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1108 0%, #2C2416 100%)',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '380px', textAlign: 'center' }}>
        <div style={{ color: '#C9A84C', fontSize: '2rem', marginBottom: '20px' }}>⬡</div>
        <h1 style={{
          fontFamily: 'Georgia, serif', fontSize: '1.6rem',
          fontWeight: 300, color: '#FAF7F0', marginBottom: '6px',
        }}>
          Administration
        </h1>
        <p style={{
          fontSize: '0.6rem', letterSpacing: '0.3em',
          color: '#9B8A6E', textTransform: 'uppercase', marginBottom: '40px',
        }}>
          Élégance Digitale™
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Mot de passe"
            required
            style={{
              padding: '15px 20px',
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(201,168,76,0.4)',
              color: '#FAF7F0', fontFamily: 'Georgia, serif',
              fontSize: '1rem', outline: 'none',
              textAlign: 'center', borderRadius: '1px',
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
              padding: '15px',
              background: 'linear-gradient(135deg, #8B6914, #C9A84C)',
              color: '#fff', border: 'none',
              fontSize: '0.62rem', letterSpacing: '0.3em',
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Vérification...' : 'Accéder'}
          </button>
        </form>
      </div>
    </main>
  )
}