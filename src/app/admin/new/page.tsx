'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const EMPTY = {
  bride_name: '', groom_name: '', couple_email: '',
  event_date: '', event_time: '19:00',
  venue_name: '', venue_address: '',
  gps_google: '', gps_apple: '',
  template_id: 'blanc_dore', pack: 'essentiel',
  custom_message: '',
  show_guestbook: true, moderation_on: true,
}

export default function NewWedding() {
  const [form,    setForm]    = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ inviteUrl: string; coupleUrl: string; coupleToken: string } | null>(null)
  const [error,   setError]   = useState('')
  const router = useRouter()

  function set(key: string, value: string | boolean) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/weddings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()
    if (res.ok) {
      setResult(data)
    } else {
      setError(data.error ?? 'Erreur serveur.')
    }
    setLoading(false)
  }

  if (result) {
    return (
      <main style={pageStyle}>
        <div style={{ maxWidth: '560px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ color: '#C9A84C', fontSize: '2.5rem', marginBottom: '16px' }}>✓</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 300, color: '#FAF7F0', marginBottom: '32px' }}>
            Mariage créé avec succès
          </h2>
          {[
            { label: 'Lien invités (à envoyer via WhatsApp)', url: result.inviteUrl },
            { label: 'Lien portail mariés (à donner aux mariés)', url: result.coupleUrl },
            { label: 'Code d\'accès portail mariés', url: result.coupleToken },
          ].map(item => (
            <div key={item.label} style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(201,168,76,0.3)',
              padding: '20px', marginBottom: '16px', textAlign: 'left',
            }}>
              <p style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: '#C9A84C', marginBottom: '8px', textTransform: 'uppercase' }}>
                {item.label}
              </p>
              <p style={{ fontSize: '0.8rem', color: '#FAF7F0', wordBreak: 'break-all', lineHeight: 1.6 }}>
                {item.url}
              </p>
              <button
                onClick={() => navigator.clipboard.writeText(item.url)}
                style={{ marginTop: '10px', padding: '6px 16px', background: 'transparent', border: '1px solid #C9A84C', color: '#C9A84C', fontSize: '0.58rem', letterSpacing: '0.15em', cursor: 'pointer' }}
              >
                Copier
              </button>
            </div>
          ))}
          <button
            onClick={() => router.push('/admin')}
            style={{ marginTop: '16px', padding: '12px 32px', background: 'linear-gradient(135deg,#8B6914,#C9A84C)', color: '#fff', border: 'none', fontSize: '0.62rem', letterSpacing: '0.25em', cursor: 'pointer' }}
          >
            Retour au dashboard
          </button>
        </div>
      </main>
    )
  }

  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 300, color: '#FAF7F0', marginBottom: '32px', fontSize: '1.6rem' }}>
          ← Nouveau mariage
        </h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Noms */}
          <div style={row}>
            <Field label="Prénom de la mariée *" value={form.bride_name} onChange={v => set('bride_name', v)} required />
            <Field label="Prénom du marié *"    value={form.groom_name} onChange={v => set('groom_name', v)} required />
          </div>

          <Field label="Email des mariés *" value={form.couple_email} onChange={v => set('couple_email', v)} type="email" required />

          {/* Date */}
          <div style={row}>
            <Field label="Date de l'événement *" value={form.event_date} onChange={v => set('event_date', v)} type="date" required />
            <Field label="Heure *"               value={form.event_time} onChange={v => set('event_time', v)} type="time" required />
          </div>

          {/* Lieu */}
          <Field label="Nom du lieu *"    value={form.venue_name}    onChange={v => set('venue_name', v)}    required />
          <Field label="Adresse du lieu"  value={form.venue_address} onChange={v => set('venue_address', v)} />
          <Field label="Lien Google Maps" value={form.gps_google}    onChange={v => set('gps_google', v)}    placeholder="https://maps.google.com/..." />
          <Field label="Lien Apple Maps"  value={form.gps_apple}     onChange={v => set('gps_apple', v)}     placeholder="https://maps.apple.com/..." />

          {/* Options */}
          <div style={row}>
            <Select label="Template" value={form.template_id} onChange={v => set('template_id', v)}
              options={[
                { value: 'blanc_dore', label: 'Blanc & Doré' },
                { value: 'or_noir',    label: 'Or & Noir' },
                { value: 'minimal',    label: 'Minimal' },
              ]}
            />
            <Select label="Pack" value={form.pack} onChange={v => set('pack', v)}
              options={[
                { value: 'essentiel',     label: 'Essentiel (180 DT)' },
                { value: 'prestige',      label: 'Prestige (350 DT)' },
                { value: 'haute_couture', label: 'Haute Couture (550 DT)' },
              ]}
            />
          </div>

          {/* Message perso */}
          <div>
            <label style={labelStyle}>Message personnalisé</label>
            <textarea
              value={form.custom_message}
              onChange={e => set('custom_message', e.target.value)}
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
              placeholder="Texte d'introduction affiché sur l'invitation..."
            />
          </div>

          {/* Toggles */}
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <Toggle label="Livre d'or activé"  checked={form.show_guestbook} onChange={v => set('show_guestbook', v)} />
            <Toggle label="Modération activée" checked={form.moderation_on}  onChange={v => set('moderation_on', v)} />
          </div>

          {error && <p style={{ color: '#e88', fontSize: '0.8rem' }}>{error}</p>}

          <button
            type="submit" disabled={loading}
            style={{
              padding: '16px', background: 'linear-gradient(135deg,#8B6914,#C9A84C)',
              color: '#fff', border: 'none', fontSize: '0.65rem',
              letterSpacing: '0.3em', textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Création en cours...' : 'Créer l\'invitation'}
          </button>
        </form>
      </div>
    </main>
  )
}

// ── Sous-composants ──
function Field({ label, value, onChange, type = 'text', required = false, placeholder = '' }: {
  label: string; value: string; onChange: (v: string) => void
  type?: string; required?: boolean; placeholder?: string
}) {
  return (
    <div style={{ flex: 1 }}>
      <label style={labelStyle}>{label}</label>
      <input
        type={type} value={value} required={required}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        style={inputStyle}
      />
    </div>
  )
}

function Select({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div style={{ flex: 1 }}>
      <label style={labelStyle}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} style={inputStyle}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

function Toggle({ label, checked, onChange }: {
  label: string; checked: boolean; onChange: (v: boolean) => void
}) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}
        style={{ width: '16px', height: '16px', accentColor: '#C9A84C' }} />
      <span style={{ fontSize: '0.72rem', color: '#E8D49E', letterSpacing: '0.1em' }}>{label}</span>
    </label>
  )
}

const pageStyle: React.CSSProperties = {
  minHeight: '100vh', background: 'linear-gradient(135deg, #1a1108, #2C2416)',
  padding: '40px 24px', fontFamily: 'Montserrat, sans-serif',
}
const row: React.CSSProperties = { display: 'flex', gap: '16px', flexWrap: 'wrap' }
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.58rem', letterSpacing: '0.2em',
  textTransform: 'uppercase', color: '#9B8A6E', marginBottom: '8px',
}
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '13px 16px',
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(201,168,76,0.3)',
  color: '#FAF7F0', fontFamily: 'Georgia, serif',
  fontSize: '0.95rem', outline: 'none', borderRadius: '1px',
}