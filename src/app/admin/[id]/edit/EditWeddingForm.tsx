'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ProgramEditor, { ProgramItem } from '@/components/admin/ProgramEditor'
import { Wedding } from '@/lib/types'
import { TEMPLATES_META } from '@/lib/templates-meta'

export default function EditWeddingForm({ wedding }: { wedding: Wedding }) {
  const router = useRouter()

  // Date/heure depuis event_date
  const eventDate = new Date(wedding.event_date)
  const dateStr = eventDate.toISOString().split('T')[0]
  const timeStr = eventDate.toTimeString().slice(0, 5)

  const [form, setForm] = useState({
    bride_name: wedding.bride_name,
    groom_name: wedding.groom_name,
    bride_name_ar: wedding.bride_name_ar ?? '',
    groom_name_ar: wedding.groom_name_ar ?? '',
    couple_email: wedding.couple_email,
    event_date: dateStr,
    event_time: timeStr,
    venue_name: wedding.venue_name,
    venue_address: wedding.venue_address ?? '',
    gps_google: wedding.gps_google ?? '',
    gps_apple: wedding.gps_apple ?? '',
    template_id: wedding.template_id,
    pack: wedding.pack,
    intro_text: wedding.intro_text ?? 'Vous êtes cordialement invités au mariage de',
    custom_message: wedding.custom_message ?? '',
    music_url: wedding.music_url ?? '',
    show_rsvp: wedding.show_rsvp ?? true,
    show_guestbook: wedding.show_guestbook,
    moderation_on: wedding.moderation_on,
  })
  const [program, setProgram] = useState<ProgramItem[]>(
    (wedding.program ?? []) as ProgramItem[]
  )
  const [loading, setLoading] = useState(false)
  const [savedAt, setSavedAt] = useState<Date | null>(null)
  const [error, setError] = useState('')

  function set(key: string, value: string | boolean) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch(`/api/admin/weddings/${wedding.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, program }),
    })

    const data = await res.json()
    if (res.ok) {
      setSavedAt(new Date())
      setTimeout(() => router.push(`/admin/${wedding.id}`), 800)
    } else {
      setError(data.error ?? 'Erreur serveur.')
    }
    setLoading(false)
  }

  const templatesFR = TEMPLATES_META.filter(t => t.language !== 'ar')
  const templatesAR = TEMPLATES_META.filter(t => t.language === 'ar')

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Modifier le mariage</h1>
          <p className="admin-page-subtitle">
            {wedding.bride_name} & {wedding.groom_name} ·{' '}
            <code style={{
              fontSize: '0.78rem',
              background: '#f5f5f5',
              padding: '1px 6px',
              borderRadius: '3px',
            }}>
              /{wedding.slug}
            </code>
          </p>
        </div>
        <Link href={`/admin/${wedding.id}`} className="admin-btn admin-btn-secondary">
          ← Retour au mariage
        </Link>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: '780px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        <div style={{
          padding: '12px 14px',
          background: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: 'var(--admin-radius)',
          fontSize: '0.82rem',
          color: '#92400e',
        }}>
          <strong>ℹ Note :</strong> L'identifiant unique <code style={{ background: '#fef3c7', padding: '1px 5px', borderRadius: '3px' }}>{wedding.slug}</code> ne peut pas être modifié pour préserver les liens déjà envoyés. Pour générer de nouveaux liens, utilisez l'action "Régénérer les liens" depuis la page du mariage.
        </div>

        <Section title="Les mariés">
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
          <Row>
            <Field label="Prénom de la mariée en arabe" help="Utilisé dans les templates arabes uniquement">
              <input
                className="admin-input"
                value={form.bride_name_ar}
                onChange={e => set('bride_name_ar', e.target.value)}
                placeholder="ex : سارة"
                dir="rtl"
                style={{ fontFamily: "'Amiri', serif" }}
              />
            </Field>
            <Field label="Prénom du marié en arabe" help="Utilisé dans les templates arabes uniquement">
              <input
                className="admin-input"
                value={form.groom_name_ar}
                onChange={e => set('groom_name_ar', e.target.value)}
                placeholder="ex : مهدي"
                dir="rtl"
                style={{ fontFamily: "'Amiri', serif" }}
              />
            </Field>
          </Row>
          <Field label="Email des mariés" required>
            <input className="admin-input" type="email" value={form.couple_email}
              onChange={e => set('couple_email', e.target.value)} required />
          </Field>
        </Section>

        <Section title="Date & lieu">
          <Row>
            <Field label="Date" required>
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
              onChange={e => set('venue_name', e.target.value)} required />
          </Field>
          <Field label="Adresse complète">
            <input className="admin-input" value={form.venue_address}
              onChange={e => set('venue_address', e.target.value)} />
          </Field>
          <Row>
            <Field label="Lien Google Maps">
              <input className="admin-input" value={form.gps_google}
                onChange={e => set('gps_google', e.target.value)}
                placeholder="https://maps.google.com/..." />
            </Field>
            <Field label="Lien Apple Maps">
              <input className="admin-input" value={form.gps_apple}
                onChange={e => set('gps_apple', e.target.value)}
                placeholder="https://maps.apple.com/..." />
            </Field>
          </Row>
        </Section>

        <Section title="Textes de l'invitation">
          <Field label="Message d'introduction" help="Phrase d'accroche en haut de l'invitation.">
            <input className="admin-input" value={form.intro_text}
              onChange={e => set('intro_text', e.target.value)} />
          </Field>
          <Field label="Message personnalisé" help="Texte plus long sous les noms.">
            <textarea className="admin-textarea" rows={3} value={form.custom_message}
              onChange={e => set('custom_message', e.target.value)} />
          </Field>
          <Field label="URL musique de fond" help="MP3 hébergé en ligne (optionnel)">
            <input className="admin-input" type="url" value={form.music_url}
              onChange={e => set('music_url', e.target.value)}
              placeholder="https://..." />
          </Field>
        </Section>

        <Section title="Programme de la soirée">
          <ProgramEditor initial={program} onChange={setProgram} />
        </Section>

        <Section title="Template & pack">
          <Row>
            <Field label="Template">
              <select className="admin-select" value={form.template_id}
                onChange={e => set('template_id', e.target.value)}>
                <optgroup label="🇫🇷 Templates français">
                  {templatesFR.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} — {t.description.split('.')[0]}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="🇹🇳 Templates arabes / maghrébins">
                  {templatesAR.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} — {t.description.split('.')[0]}
                    </option>
                  ))}
                </optgroup>
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
        </Section>

        <Section title="Options">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Toggle
              label="Confirmation de présence (RSVP)"
              help="Permet aux invités de confirmer leur présence"
              checked={form.show_rsvp}
              onChange={v => set('show_rsvp', v)}
            />
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

        {savedAt && (
          <div style={{
            padding: '12px 14px',
            background: '#dcfce7',
            border: '1px solid #bbf7d0',
            borderRadius: 'var(--admin-radius)',
            color: '#166534',
            fontSize: '0.88rem',
          }}>
            ✓ Modifications enregistrées. Redirection en cours...
          </div>
        )}

        <div style={{
          display: 'flex',
          gap: '10px',
          paddingTop: '8px',
          borderTop: '1px solid var(--admin-border)',
          marginTop: '8px',
          position: 'sticky',
          bottom: 0,
          background: 'var(--admin-bg)',
          padding: '16px 0',
        }}>
          <button type="submit" disabled={loading} className="admin-btn">
            {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
          <Link href={`/admin/${wedding.id}`} className="admin-btn admin-btn-secondary">
            Annuler
          </Link>
        </div>
      </form>
    </>
  )
}

// ── Sous-composants ──
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="admin-card">
      <h2 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 16px' }}>{title}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>{children}</div>
    </div>
  )
}

function Field({ label, required, help, children }: {
  label: string; required?: boolean; help?: string; children: React.ReactNode
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
  return <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>{children}</div>
}

function Toggle({ label, help, checked, onChange }: {
  label: string; help?: string; checked: boolean; onChange: (v: boolean) => void
}) {
  return (
    <label style={{
      display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer',
      padding: '10px', border: '1px solid var(--admin-border)',
      borderRadius: 'var(--admin-radius)', background: '#fafafa',
    }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}
        style={{ marginTop: '2px', accentColor: 'var(--admin-accent)' }} />
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