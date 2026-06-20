'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ProgramEditor, { ProgramItem  } from '@/components/admin/ProgramEditor'
import FontPicker from '@/components/admin/fontpicker'
import { TEMPLATES_META } from '@/lib/templates-meta'
import { BISMILLAH_PALETTES, BISMILLAH_BACKGROUNDS, BISMILLAH_DECORATIONS } from '@/lib/bismillah-palettes'
import { IVOIRE_PALETTES } from '@/lib/ivoire-palettes'

export default function NewWeddingPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    bride_name: '',
    groom_name: '',
    bride_name_ar: '',
    groom_name_ar: '',
    bride_family_ar: '',
    groom_family_ar: '',
    bride_family_prefix_ar: '',
    groom_family_prefix_ar: '',
    families_intro_ar: '',
    couple_email: '',
    event_date: '',
    event_time: '19:00',
    venue_name: '',
    venue_address: '',
    gps_google: '',
    gps_apple: '',
    template_id: 'coeur_dore',
    pack: 'essentiel',
    intro_text: 'Vous êtes cordialement invités au mariage de',
    custom_message: '',
    music_url: '',
    custom_font: '' as string | null,
    show_rsvp: true,
    show_guestbook: true,
    show_countdown: true,
    moderation_on: true,
    bismillah_palette: 'or_classique',
    background_image: 'bg-texture.jpg',
    decoration_image: 'decoration.png',
    template_variant: 'or_classique',
    guest_invite_enabled: false,
  })

  const [program, setProgram] = useState<ProgramItem []>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set(key: string, value: string | boolean | null) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Convertir heure locale → UTC pour éviter la dérive de timezone
    const localDt = new Date(`${form.event_date}T${form.event_time || '00:00'}:00`)
    const utcDate = localDt.toISOString().split('T')[0]
    const utcTime = localDt.toISOString().split('T')[1].slice(0, 5)

    const res = await fetch('/api/admin/weddings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, event_date: utcDate, event_time: utcTime, program }),
    })

    const data = await res.json()
    if (res.ok) {
      router.push(`/admin/${data.id}`)
    } else {
      setError(data.error ?? 'Erreur serveur.')
      setLoading(false)
    }
  }

  function handlePreview() {
  localStorage.setItem('__preview_wedding', JSON.stringify({ ...form, program }))
  window.open('/preview', '_blank', 'noopener,noreferrer')
}

  const currentTemplate = TEMPLATES_META.find(t => t.id === form.template_id)
  const fontLanguage: 'fr' | 'ar' = currentTemplate?.language === 'ar' ? 'ar' : 'fr'

  const templatesDynamiques = TEMPLATES_META.filter(t => t.type === 'dynamique')
  const templatesStatiques  = TEMPLATES_META.filter(t => t.type === 'statique')

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Créer un mariage</h1>
          <p className="admin-page-subtitle">Renseigne les informations du couple et configure leur invitation.</p>
        </div>
        <Link href="/admin" className="admin-btn admin-btn-secondary">← Retour</Link>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: '780px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

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
            <Field label="Prénom de la mariée en arabe" help="Optionnel — utilisé dans les templates arabes">
              <input className="admin-input" value={form.bride_name_ar}
                onChange={e => set('bride_name_ar', e.target.value)}
                placeholder="ex : سارة" dir="rtl"
                style={{ fontFamily: "'Amiri', serif" }} />
            </Field>
            <Field label="Prénom du marié en arabe" help="Optionnel — utilisé dans les templates arabes">
              <input className="admin-input" value={form.groom_name_ar}
                onChange={e => set('groom_name_ar', e.target.value)}
                placeholder="ex : مهدي" dir="rtl"
                style={{ fontFamily: "'Amiri', serif" }} />
            </Field>
          </Row>
          {(form.template_id === 'bismillah' || form.template_id === 'al_nour') && (
            <>
              <div style={{ padding: '10px 12px', background: '#fffbeb', border: '1px solid #fde68a',
                borderRadius: 'var(--admin-radius)', fontSize: '0.82rem', color: '#92400e' }}>
                Renseignez les familles pour afficher le bloc familial en tête d'invitation (tradition maghrébine). Le préfixe est libre — laissez vide pour le mot par défaut.
              </div>
              <Field label="Phrase d'introduction (arabe)" help="Optionnel — affichée au-dessus des familles. Utilisez Entrée pour les retours à la ligne.">
                <textarea className="admin-textarea" rows={2}
                  value={form.families_intro_ar}
                  onChange={e => set('families_intro_ar', e.target.value)}
                  placeholder={"ان السرور إذا تشارك ضوعفت بسماته\nبكل حب وود تتشرف"}
                  dir="rtl" style={{ fontFamily: "'Amiri', serif" }} />
              </Field>
              <Row>
                <Field label="Préfixe famille du marié" help="ex : عائلة الحاج, عائلة, عائلة المرحوم...">
                  <input className="admin-input" value={form.groom_family_prefix_ar}
                    onChange={e => set('groom_family_prefix_ar', e.target.value)}
                    placeholder="عائلة الحاج" dir="rtl"
                    style={{ fontFamily: "'Amiri', serif" }} />
                </Field>
                <Field label="Préfixe famille de la mariée" help="ex : عائلة الحاج, عائلة, عائلة المرحوم...">
                  <input className="admin-input" value={form.bride_family_prefix_ar}
                    onChange={e => set('bride_family_prefix_ar', e.target.value)}
                    placeholder="عائلة المرحوم الحاج" dir="rtl"
                    style={{ fontFamily: "'Amiri', serif" }} />
                </Field>
              </Row>
              <Row>
                <Field label="Nom famille du marié (arabe)">
                  <input className="admin-input" value={form.groom_family_ar}
                    onChange={e => set('groom_family_ar', e.target.value)}
                    placeholder="محمد سمير الدسوقي" dir="rtl"
                    style={{ fontFamily: "'Amiri', serif" }} />
                </Field>
                <Field label="Nom famille de la mariée (arabe)">
                  <input className="admin-input" value={form.bride_family_ar}
                    onChange={e => set('bride_family_ar', e.target.value)}
                    placeholder="منذر سعيد شديد" dir="rtl"
                    style={{ fontFamily: "'Amiri', serif" }} />
                </Field>
              </Row>
            </>
          )}

          <Field label="Email des mariés" required help="Servira pour la connexion au portail couple.">
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
          <Field label="Message / bénédiction finale" help="Affiché en bas de l'invitation. Cliquer sur un texte prédéfini pour l'insérer.">
            {(form.template_id === 'bismillah' || form.template_id === 'al_nour') && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                {[
                  { label: 'Hadith mariage', value: 'بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ' },
                  { label: 'Bénédiction', value: 'وَلَكُمُ العَاقِبَةُ فِي الأَفْرَاحِ وَالمَسَرَّاتِ' },
                  { label: 'إن السرور', value: 'إن السرور إذا تشارك ضوعفت بسماته\nبكل حب وود تتشرف' },
                ].map(opt => (
                  <button key={opt.label} type="button"
                    onClick={() => set('custom_message', opt.value)}
                    style={{ padding: '4px 10px', fontSize: '.75rem', background: '#f0f0f0', border: '1px solid #d4d4d4', borderRadius: 4, cursor: 'pointer', fontFamily: 'inherit' }}>
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
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
            <Field label="Template d'invitation" required>
              <select className="admin-select" value={form.template_id}
                onChange={e => {
                  set('template_id', e.target.value)
                  set('custom_font', null)
                }}>
                <optgroup label="✨ Dynamiques">
                  {templatesDynamiques.map(t => (
                    <option key={t.id} value={t.id}>{t.name} — {t.description.split('.')[0]}</option>
                  ))}
                </optgroup>
                <optgroup label="🖼 Statiques">
                  {templatesStatiques.map(t => (
                    <option key={t.id} value={t.id}>{t.name} — {t.description.split('.')[0]}</option>
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

          {(form.template_id === 'bismillah' || form.template_id === 'al_nour') && (
            <>
              <Field label="Palette de couleurs">
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', paddingTop: '4px' }}>
                  {BISMILLAH_PALETTES.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      title={p.name}
                      onClick={() => set('bismillah_palette', p.id)}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        gap: '6px', padding: '8px 10px', border: '2px solid',
                        borderColor: form.bismillah_palette === p.id ? p.accent : 'var(--admin-border)',
                        borderRadius: 'var(--admin-radius)', background: form.bismillah_palette === p.id ? p.accentSoft : '#fff',
                        cursor: 'pointer', transition: 'all .2s',
                        transform: form.bismillah_palette === p.id ? 'scale(1.05)' : 'scale(1)',
                      }}
                    >
                      <div style={{ display: 'flex', gap: '3px' }}>
                        {p.preview.map((c, i) => (
                          <div key={i} style={{ width: 14, height: 14, borderRadius: '50%', background: c, border: '1px solid rgba(0,0,0,0.1)' }} />
                        ))}
                      </div>
                      <span style={{ fontSize: '0.68rem', fontWeight: 500, color: 'var(--admin-text-muted)', whiteSpace: 'nowrap' }}>
                        {p.name}
                      </span>
                    </button>
                  ))}
                </div>
              </Field>
              <Row>
                <Field label="Texture de fond">
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {BISMILLAH_BACKGROUNDS.map(bg => (
                      <button key={bg.id} type="button" title={bg.name}
                        onClick={() => set('background_image', bg.id)}
                        style={{
                          border: '2px solid',
                          borderColor: form.background_image === bg.id ? 'var(--admin-accent)' : 'var(--admin-border)',
                          borderRadius: 'var(--admin-radius)', padding: '3px',
                          background: 'none', cursor: 'pointer', transition: 'all .2s',
                          transform: form.background_image === bg.id ? 'scale(1.05)' : 'scale(1)',
                        }}
                      >
                        <img src={`/${bg.id}`} alt={bg.name} style={{ width: 48, height: 80, objectFit: 'cover', borderRadius: '3px', display: 'block' }} />
                        <div style={{ fontSize: '0.62rem', marginTop: '4px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>{bg.name}</div>
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="Cadre décoratif">
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {BISMILLAH_DECORATIONS.map(dec => (
                      <button key={dec.id} type="button" title={dec.name}
                        onClick={() => set('decoration_image', dec.id)}
                        style={{
                          border: '2px solid',
                          borderColor: form.decoration_image === dec.id ? 'var(--admin-accent)' : 'var(--admin-border)',
                          borderRadius: 'var(--admin-radius)', padding: '3px',
                          background: 'none', cursor: 'pointer', transition: 'all .2s',
                          transform: form.decoration_image === dec.id ? 'scale(1.05)' : 'scale(1)',
                        }}
                      >
                        <img src={`/${dec.id}`} alt={dec.name} style={{ width: 48, height: 80, objectFit: 'cover', borderRadius: '3px', display: 'block' }} />
                        <div style={{ fontSize: '0.62rem', marginTop: '4px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>{dec.name}</div>
                      </button>
                    ))}
                  </div>
                </Field>
              </Row>
            </>
          )}

          {form.template_id === 'carte_simple' && (
            <Field label="Palette de couleurs">
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', paddingTop: '4px' }}>
                {IVOIRE_PALETTES.map(p => (
                  <button key={p.id} type="button" title={p.name}
                    onClick={() => set('template_variant', p.id)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      gap: '6px', padding: '8px 10px', border: '2px solid',
                      borderColor: form.template_variant === p.id ? p.accent : 'var(--admin-border)',
                      borderRadius: 'var(--admin-radius)',
                      background: form.template_variant === p.id ? p.accentSoft : '#fff',
                      cursor: 'pointer', transition: 'all .2s',
                      transform: form.template_variant === p.id ? 'scale(1.05)' : 'scale(1)',
                    }}>
                    <div style={{ display: 'flex', gap: '3px' }}>
                      {p.preview.map((c, i) => (
                        <div key={i} style={{ width: 14, height: 14, borderRadius: '50%', background: c, border: '1px solid rgba(0,0,0,0.1)' }} />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 500, color: 'var(--admin-text-muted)', whiteSpace: 'nowrap' }}>
                      {p.name}
                    </span>
                  </button>
                ))}
              </div>
            </Field>
          )}
        </Section>

        <Section title="Police personnalisée">
          <FontPicker
            value={form.custom_font}
            onChange={font => set('custom_font', font)}
            language={fontLanguage}
          />
        </Section>

        <Section title="Options">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Toggle label="Afficher le compte à rebours"
              help="Section compte à rebours jusqu'au jour J"
              checked={form.show_countdown} onChange={v => set('show_countdown', v)} />
            <Toggle label="Confirmation de présence (RSVP)"
              help="Permet aux invités de confirmer leur présence"
              checked={form.show_rsvp} onChange={v => set('show_rsvp', v)} />
            <Toggle label="Activer le livre d'or"
              help="Les invités peuvent laisser des messages"
              checked={form.show_guestbook} onChange={v => set('show_guestbook', v)} />
            <Toggle label="Modération des messages"
              help="Les messages sont validés par les mariés avant publication"
              checked={form.moderation_on} onChange={v => set('moderation_on', v)} />
            {(form.template_id === 'bismillah' || form.template_id === 'al_nour') && (
              <Toggle label="Activer les invitations personnalisées"
                help="Permet de générer un lien unique par invité avec son nom affiché sur l'enveloppe"
                checked={form.guest_invite_enabled} onChange={v => set('guest_invite_enabled', v)} />
            )}
          </div>
        </Section>

        {error && (
          <div style={{ padding: '12px 14px', background: '#fee2e2',
            border: '1px solid #fecaca', borderRadius: 'var(--admin-radius)',
            color: '#991b1b', fontSize: '0.88rem' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', paddingTop: '8px',
          borderTop: '1px solid var(--admin-border)', marginTop: '8px',
          position: 'sticky', bottom: 0, background: 'var(--admin-bg)',
          padding: '16px 0', flexWrap: 'wrap' }}>
          <button type="submit" disabled={loading} className="admin-btn">
            {loading ? 'Création...' : 'Créer le mariage'}
          </button>
          <button type="button" onClick={handlePreview}
            className="admin-btn admin-btn-secondary"
            disabled={!form.bride_name && !form.groom_name}
            title={!form.bride_name && !form.groom_name ? 'Renseigne au moins un nom pour prévisualiser' : 'Prévisualiser dans un nouvel onglet'}>
            👁 Prévisualiser
          </button>
          <Link href="/admin" className="admin-btn admin-btn-secondary">Annuler</Link>
        </div>
      </form>
    </>
  )
}

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
    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px',
      cursor: 'pointer', padding: '10px', border: '1px solid var(--admin-border)',
      borderRadius: 'var(--admin-radius)', background: '#fafafa' }}>
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
