'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ProgramEditor, { ProgramItem } from '@/components/admin/ProgramEditor'

const EMPTY = {
  bride_name: '',
  groom_name: '',
  couple_email: '',
  event_date: '',
  event_time: '19:00',
  venue_name: '',
  venue_address: '',
  gps_google: '',
  gps_apple: '',
  template_id: 'blanc_dore',
  pack: 'essentiel',
  intro_text: 'Vous êtes cordialement invités au mariage de',
  custom_message: '',
  show_guestbook: true,
  moderation_on: true,
}

export default function NewWedding() {
  const [form, setForm] = useState(EMPTY)
  const [program, setProgram] = useState<ProgramItem[]>([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ inviteUrl: string; coupleUrl: string; coupleToken: string } | null>(null)
  const [error, setError] = useState('')
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
      body: JSON.stringify({ ...form, program }),
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
      <>
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Mariage créé avec succès</h1>
            <p className="admin-page-subtitle">
              Voici les liens à partager. Copiez-les avant de quitter cette page.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '720px' }}>
          {[
            { label: 'Lien invités', sub: 'À envoyer via WhatsApp aux invités', value: result.inviteUrl },
            { label: 'Lien portail mariés', sub: 'À donner aux mariés pour suivre les confirmations', value: result.coupleUrl },
            { label: 'Code d\'accès portail mariés', sub: 'Saisi par les mariés sur leur portail', value: result.coupleToken },
          ].map(item => (
            <LinkCard key={item.label} {...item} />
          ))}
        </div>

        <div style={{ marginTop: '24px', display: 'flex', gap: '10px' }}>
          <Link href="/admin" className="admin-btn">
            Retour au tableau de bord
          </Link>
          <button
            onClick={() => { setResult(null); setForm(EMPTY); setProgram([]) }}
            className="admin-btn admin-btn-secondary"
          >
            Créer un autre mariage
          </button>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Nouveau mariage</h1>
          <p className="admin-page-subtitle">
            Remplissez les informations pour générer une invitation
          </p>
        </div>
        <Link href="/admin" className="admin-btn admin-btn-secondary">
          ← Retour
        </Link>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: '780px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* SECTION : Mariés */}
        <Section title="Les mariés" description="Informations sur le couple">
          <Row>
            <Field label="Prénom de la mariée" required>
              <input className="admin-input" value={form.bride_name}
                onChange={e => set('bride_name', e.target.value)} required />
            </Field>
            <Field label="Prénom du marié" required>
              <input className="admin-input" value={form.groom_name}
                onChange={e => set('groom_name', e.target.value)} required />
            </Field>
          </Row>
          <Field label="Email des mariés" required>
            <input className="admin-input" type="email" value={form.couple_email}
              onChange={e => set('couple_email', e.target.value)} required />
          </Field>
        </Section>

        {/* SECTION : Date & lieu */}
        <Section title="Date & lieu" description="Quand et où l'événement aura lieu">
          <Row>
            <Field label="Date de l'événement" required>
              <input className="admin-input" type="date" value={form.event_date}
                onChange={e => set('event_date', e.target.value)} required />
            </Field>
            <Field label="Heure" required>
              <input className="admin-input" type="time" value={form.event_time}
                onChange={e => set('event_time', e.target.value)} required />
            </Field>
          </Row>
          <Field label="Nom du lieu" required>
            <input className="admin-input" value={form.venue_name}
              onChange={e => set('venue_name', e.target.value)}
              placeholder="Ex: Dar El Jeld" required />
          </Field>
          <Field label="Adresse complète">
            <input className="admin-input" value={form.venue_address}
              onChange={e => set('venue_address', e.target.value)}
              placeholder="Ex: 5 Rue Dar El Jeld, Tunis 1006" />
          </Field>
          <Row>
            <Field label="Lien Google Maps" help="Optionnel — bouton de navigation">
              <input className="admin-input" value={form.gps_google}
                onChange={e => set('gps_google', e.target.value)}
                placeholder="https://maps.google.com/..." />
            </Field>
            <Field label="Lien Apple Maps" help="Optionnel — bouton de navigation">
              <input className="admin-input" value={form.gps_apple}
                onChange={e => set('gps_apple', e.target.value)}
                placeholder="https://maps.apple.com/..." />
            </Field>
          </Row>
        </Section>

        {/* SECTION : Texte */}
        <Section title="Textes de l'invitation" description="Personnalisez les messages affichés">
          <Field
            label="Message d'introduction"
            help="Phrase d'accroche en haut de l'invitation. Modifiable selon le ton souhaité."
          >
            <input className="admin-input" value={form.intro_text}
              onChange={e => set('intro_text', e.target.value)}
              placeholder="Vous êtes cordialement invités au mariage de" />
          </Field>
          <Field
            label="Message personnalisé"
            help="Texte plus long sous les noms (citation, mot des mariés, verset...)"
          >
            <textarea className="admin-textarea" rows={3} value={form.custom_message}
              onChange={e => set('custom_message', e.target.value)}
              placeholder="Ex: Avec joie et émotion, nous vous invitons à partager ce moment unique..." />
          </Field>
        </Section>

        {/* SECTION : Programme dynamique */}
        <Section
          title="Programme de la soirée"
          description="Les différentes étapes affichées sur l'invitation. Ordre et contenu modifiables."
        >
          <ProgramEditor initial={program} onChange={setProgram} />
        </Section>

        {/* SECTION : Template & pack */}
        <Section title="Template & pack" description="Apparence visuelle et formule choisie">
          <Row>
            <Field label="Template">
              <select className="admin-select" value={form.template_id}
                onChange={e => set('template_id', e.target.value)}>
                <option value="blanc_dore">Blanc & Doré</option>
                <option value="nuit_etoilee">Nuit Étoilée</option>
                <option value="jardin_andalou">Jardin Andalou</option>
                <option value="minimaliste">Minimaliste Parisien</option>
                <option value="rose_poudre">Rose Poudré</option>
                <option value="marbre_noir">Marbre Noir</option>
              </select>
            </Field>
            <Field label="Pack">
              <select className="admin-select" value={form.pack}
                onChange={e => set('pack', e.target.value)}>
                <option value="essentiel">Essentiel (180 DT)</option>
                <option value="prestige">Prestige (350 DT)</option>
                <option value="haute_couture">Haute Couture (550 DT)</option>
              </select>
            </Field>
          </Row>
          <div style={{ marginTop: '8px' }}>
            <Link href="/admin/templates" style={{
              fontSize: '0.82rem',
              color: 'var(--admin-accent)',
              textDecoration: 'none',
            }}>
              → Voir le catalogue complet des templates
            </Link>
          </div>
        </Section>

        {/* SECTION : Options */}
        <Section title="Options" description="Paramètres de l'invitation">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Toggle
              label="Activer le livre d'or"
              help="Les invités peuvent laisser des messages"
              checked={form.show_guestbook}
              onChange={v => set('show_guestbook', v)}
            />
            <Toggle
              label="Modération des messages"
              help="Les messages sont validés par les mariés avant publication"
              checked={form.moderation_on}
              onChange={v => set('moderation_on', v)}
            />
          </div>
        </Section>

        {error && (
          <div style={{
            padding: '12px 14px',
            background: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: 'var(--admin-radius)',
            color: '#991b1b',
            fontSize: '0.88rem',
          }}>
            {error}
          </div>
        )}

        <div style={{
          display: 'flex',
          gap: '10px',
          paddingTop: '8px',
          borderTop: '1px solid var(--admin-border)',
          marginTop: '8px',
        }}>
          <button type="submit" disabled={loading} className="admin-btn">
            {loading ? 'Création en cours...' : 'Créer l\'invitation'}
          </button>
          <Link href="/admin" className="admin-btn admin-btn-secondary">
            Annuler
          </Link>
        </div>
      </form>
    </>
  )
}

// ── Sous-composants ──
function Section({ title, description, children }: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="admin-card">
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>{title}</h2>
        {description && (
          <p style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)', margin: '4px 0 0' }}>
            {description}
          </p>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {children}
      </div>
    </div>
  )
}

function Field({ label, required, help, children }: {
  label: string
  required?: boolean
  help?: string
  children: React.ReactNode
}) {
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <label className="admin-label">
        {label}
        {required && <span style={{ color: 'var(--admin-danger)', marginLeft: '3px' }}>*</span>}
      </label>
      {children}
      {help && <div className="admin-help">{help}</div>}
    </div>
  )
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      {children}
    </div>
  )
}

function Toggle({ label, help, checked, onChange }: {
  label: string
  help?: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
      cursor: 'pointer',
      padding: '10px',
      border: '1px solid var(--admin-border)',
      borderRadius: 'var(--admin-radius)',
      background: '#fafafa',
    }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        style={{ marginTop: '2px', accentColor: 'var(--admin-accent)' }}
      />
      <div>
        <div style={{ fontSize: '0.88rem', fontWeight: 500 }}>{label}</div>
        {help && (
          <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)', marginTop: '2px' }}>
            {help}
          </div>
        )}
      </div>
    </label>
  )
}

function LinkCard({ label, sub, value }: { label: string; sub: string; value: string }) {
  return (
    <div className="admin-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
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
          onClick={() => navigator.clipboard.writeText(value)}
          className="admin-btn admin-btn-secondary"
          style={{ padding: '7px 14px', fontSize: '0.82rem' }}
        >
          Copier
        </button>
      </div>
    </div>
  )
}