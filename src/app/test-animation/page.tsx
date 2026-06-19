'use client'
import { useState } from 'react'
import EnveloppeFlorale from '@/components/animations-ouverture/EnveloppeFlorale'

export default function TestAnimationPage() {
  const [opened, setOpened] = useState(false)

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: '#f5e8d8',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Cormorant Garamond', Georgia, serif",
    }}>
      {!opened ? (
        <EnveloppeFlorale
          onOpen={() => setOpened(true)}
          bgColor="#f5e8d8"
        />
      ) : (
        <div style={{ textAlign: 'center', color: '#5a4030' }}>
          <p style={{ fontSize: '1.5rem', letterSpacing: '0.1em', marginBottom: 24 }}>
            ✦ Animation terminée ✦
          </p>
          <button
            onClick={() => setOpened(false)}
            style={{
              padding: '10px 28px',
              background: 'transparent',
              border: '1px solid #b8946a',
              color: '#8a6a4a',
              fontFamily: 'inherit',
              fontSize: '0.85rem',
              letterSpacing: '0.18em',
              cursor: 'pointer',
            }}
          >
            Rejouer
          </button>
        </div>
      )}
    </div>
  )
}
