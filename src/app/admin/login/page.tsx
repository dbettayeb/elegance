'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
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
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#fafafa',
      padding: '24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '380px',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: '#171717',
            color: '#fff',
            borderRadius: '8px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 600,
            fontSize: '1.1rem',
            letterSpacing: '0.05em',
            marginBottom: '16px',
          }}>
            ED
          </div>
          <h1 style={{
            fontSize: '1.4rem',
            fontWeight: 600,
            color: '#171717',
            marginBottom: '4px',
            margin: 0,
          }}>
            Administration
          </h1>
          <p style={{
            fontSize: '0.85rem',
            color: '#737373',
            margin: '4px 0 0',
          }}>
            Élégance Digitale
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            background: '#fff',
            border: '1px solid #e5e5e5',
            borderRadius: '8px',
            padding: '28px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <label style={{
            display: 'block',
            fontSize: '0.82rem',
            fontWeight: 500,
            color: '#171717',
            marginBottom: '6px',
          }}>
            Mot de passe
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Saisissez votre mot de passe"
            required
            autoFocus
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: '0.95rem',
              border: '1px solid #d4d4d4',
              borderRadius: '6px',
              outline: 'none',
              fontFamily: 'inherit',
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
              marginTop: '12px',
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
              marginTop: '16px',
              padding: '10px',
              background: '#171717',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.9rem',
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              transition: 'opacity 0.15s',
              fontFamily: 'inherit',
            }}
          >
            {loading ? 'Vérification...' : 'Se connecter'}
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          marginTop: '20px',
          fontSize: '0.78rem',
          color: '#a3a3a3',
        }}>
          Accès réservé · © Élégance Digitale
        </p>
      </div>
    </main>
  )
}