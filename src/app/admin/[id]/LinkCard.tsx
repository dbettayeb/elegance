'use client'
import { useState } from 'react'

export default function LinkCard({ label, sub, value }: {
  label: string
  sub: string
  value: string
}) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="admin-card">
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '12px',
        flexWrap: 'wrap',
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: '2px' }}>
            {label}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)', marginBottom: '8px' }}>
            {sub}
          </div>
          <div style={{
            fontFamily: 'ui-monospace, monospace',
            fontSize: '0.82rem',
            background: '#f5f5f5',
            padding: '8px 10px',
            borderRadius: '4px',
            wordBreak: 'break-all',
          }}>
            {value}
          </div>
        </div>
        <button
          onClick={copy}
          className="admin-btn admin-btn-secondary"
          style={{ padding: '7px 14px', fontSize: '0.82rem', minWidth: '90px' }}
        >
          {copied ? '✓ Copié' : 'Copier'}
        </button>
      </div>
    </div>
  )
}