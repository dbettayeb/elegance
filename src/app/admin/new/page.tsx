'use client'

import { useState, useEffect } from 'react'
import { buildEndDate } from '@/lib/event-time'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ProgramEditor, { ProgramItem  } from '@/components/admin/ProgramEditor'
import PartiesEditor, { Party } from '@/components/admin/PartiesEditor'
import FontPicker from '@/components/admin/fontpicker'
import DressCodeEditor from '@/components/admin/DressCodeEditor'
import { TEMPLATES_META } from '@/lib/templates-meta'
import { AR_TYPOGRAPHY_THEMES } from '@/lib/typography-themes'
import { BISMILLAH_PALETTES, BISMILLAH_BACKGROUNDS, BISMILLAH_DECORATIONS, getArStylePalettes } from '@/lib/bismillah-palettes'
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
    event_end_time: '',
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
    custom_font_size: 100,
    max_guests: null as number | null,
    ar_font_theme: 'classic' as string,
    show_rsvp: true,
    show_guestbook: true,
    guestbook_private: false,
    show_countdown: true,
    show_program: true,
    show_celebrations: true,
    moderation_on: true,
    bismillah_palette: 'or_classique',
    background_image: 'bg-texture.jpg',
    decoration_image: 'decoration.png',
    template_variant: 'or_classique',
    guest_invite_enabled: false,
    couple_photo: '',
    intro_video_url: '',
    wedding_day_text: '',
    show_dress_code: false,
    dress_code_women: '',
    dress_code_men: '',
    venue_photo: '',
  })

  const VP_DEFAULT_PROGRAM: ProgramItem[] = [
    { time: '16:00', event: 'Wedding Ceremony' },
    { time: '17:00', event: 'Cocktail Hour' },
    { time: '19:00', event: 'Dinner' },
    { time: '20:00', event: 'Party' },
  ]

  const [program, setProgram] = useState<ProgramItem []>([])
  const [parties, setParties] = useState<Party[]>([])
  const [dressImages, setDressImages] = useState<string[]>([])
  const [dressColors, setDressColors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (form.template_id === 'viktor_paula' && program.length === 0) {
      setProgram(VP_DEFAULT_PROGRAM)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.template_id])

  function set(key: string, value: string | boolean | number | null) {
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

    // La bascule au lendemain se décide en heure locale, seul endroit où
    // « 2h du matin » veut dire quelque chose : une fin antérieure au début
    // est forcément le lendemain.
    const event_end_date = buildEndDate(form.event_date, form.event_time, form.event_end_time)

    const res = await fetch('/api/admin/weddings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, event_date: utcDate, event_time: utcTime, event_end_date, program, parties, dress_code_colors: dressColors, dress_code_images: dressImages.filter(Boolean) }),
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
  localStorage.setItem('__preview_wedding', JSON.stringify({ ...form, program, parties, dress_code_colors: dressColors, dress_code_images: dressImages.filter(Boolean) }))
  window.open('/preview', '_blank', 'noopener,noreferrer')
}

  const currentTemplate = TEMPLATES_META.find(t => t.id === form.template_id)
  const fontLanguage: 'fr' | 'ar' = currentTemplate?.language === 'ar' ? 'ar' : 'fr'
  // Les deux versions de Soirée partagent les mêmes réglages propres au template.
  const isSoiree = form.template_id === 'soiree_ar' || form.template_id === 'soiree_fr'
  const isArStyle = ['toile_bleue_ar', 'jardin_rose_ar', 'floral_arch_ar', 'roses_ivoire_ar', 'rose_bleu_ar', 'template_7_ar', 'template_8_ar', 'soiree_ar'].includes(form.template_id)

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
          {(form.template_id === 'bismillah' || form.template_id === 'al_nour' || isArStyle) && !isSoiree && (
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
          {(form.template_id === 'bismillah' || form.template_id === 'al_nour' || isArStyle) && (
            <Field label="Thème typographique arabe" help="Police utilisée pour tous les titres, prénoms, date et corps de texte de l'invitation.">
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', paddingTop: '4px' }}>
                {AR_TYPOGRAPHY_THEMES.map(theme => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => set('ar_font_theme', theme.id)}
                    style={{
                      padding: '10px 14px', border: '2px solid',
                      borderColor: form.ar_font_theme === theme.id ? 'var(--admin-accent)' : 'var(--admin-border)',
                      borderRadius: 'var(--admin-radius)',
                      background: form.ar_font_theme === theme.id ? '#fdf6e3' : '#fff',
                      cursor: 'pointer', transition: 'all .2s',
                      display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px',
                    }}
                  >
                    <span style={{ fontSize: '1.1rem', fontFamily: theme.display, direction: 'rtl' }}>بِسْمِ ٱللَّٰهِ</span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--admin-text-muted)', fontWeight: 500 }}>{theme.label}</span>
                  </button>
                ))}
              </div>
            </Field>
          )}
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
                  <div style={{ display: 'flex', gap: '8px' }}>
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
                  <div style={{ display: 'flex', gap: '8px' }}>
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
          {(isArStyle || isSoiree) && (
            <Field label="Palette de couleurs">
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', paddingTop: '4px' }}>
                {getArStylePalettes(form.template_id).map(p => (
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
          )}

          {form.template_id === 'carte_simple' && (
            <>
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
            <Field label="Heure de début" required>
              <input className="admin-input" type="time" value={form.event_time}
                onChange={e => set('event_time', e.target.value)} required />
            </Field>
            <Field label="Heure de fin" help="Optionnel. Une fin antérieure au début est comprise comme le lendemain : 19h → 02h.">
              <input className="admin-input" type="time" value={form.event_end_time}
                onChange={e => set('event_end_time', e.target.value)} />
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
          <Field label="Message d'introduction" help={form.template_id === 'viktor_paula' ? 'Titre de la section "Dear Friends". Ex : Dear Friends and Family,' : 'Phrase d\'accroche en haut de l\'invitation.'}>
            <input className="admin-input" value={form.intro_text}
              onChange={e => set('intro_text', e.target.value)}
              placeholder={form.template_id === 'viktor_paula' ? 'Dear Friends and Family,' : ''} />
          </Field>
          <Field label="Message / bénédiction finale" help="Affiché en bas de l'invitation. Cliquer sur un texte prédéfini pour l'insérer.">
            {(form.template_id === 'bismillah' || form.template_id === 'al_nour' || isArStyle) && (
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

        <Section title="Fêtes additionnelles">
          <PartiesEditor initial={parties} onChange={setParties} />
        </Section>

        <Section title="Template & pack">
          <Row>
            <Field label="Template d'invitation" required>
              <select className="admin-select" value={form.template_id}
                onChange={e => {
                  const tid = e.target.value
                  set('template_id', tid)
                  set('custom_font', null)
                  if (['toile_bleue_ar','jardin_rose_ar','floral_arch_ar','roses_ivoire_ar','rose_bleu_ar','soiree_ar','soiree_fr'].includes(tid)) {
                    set('bismillah_palette', getArStylePalettes(tid)[0].id)
                  }
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
        </Section>

        <Section title="Police personnalisée">
          <FontPicker
            value={form.custom_font}
            onChange={font => set('custom_font', font)}
            language={fontLanguage}
          />
          <Field
            label={isSoiree
              ? 'Taille du titre de la soirée'
              : 'Taille pour les noms de famille (noms de famille arabes uniquement)'}
            help={isSoiree
              ? 'Ajuste la taille du titre affiché sur la vidéo, et du même titre repris en bas de l\'invitation.'
              : 'Ajuste la taille des textes de famille (ex: عائلة السيد). S\'applique uniquement aux blocs « Familles » — les prénoms des mariés conservent leur taille originale.'}
          >
            <select
              className="admin-input"
              value={form.custom_font_size}
              onChange={e => set('custom_font_size', parseInt(e.target.value, 10))}
            >
              <option value={80}>Très petit (80%)</option>
              <option value={90}>Petit (90%)</option>
              <option value={100}>Normal (100%)</option>
              <option value={110}>Légèrement plus grand (110%)</option>
              <option value={120}>Plus grand (120%)</option>
              <option value={130}>Très grand (130%)</option>
              <option value={140}>Extra grand (140%)</option>
            </select>
          </Field>
        </Section>

        {isSoiree && (
          <Section title="Soir&eacute;e — m&eacute;dias">
            <Field label="Titre de la soirée" help='Texte affiché en grand sur la vidéo, au-dessus de la date. Ex : ليلة الحناء. Par défaut "ليلة العمر".'>
              <input className="admin-input" value={form.wedding_day_text}
                onChange={e => set('wedding_day_text', e.target.value)}
                placeholder="ليلة العمر" dir="rtl" />
            </Field>
            {form.template_id === 'soiree_fr' && (
            <Field
              label="Police du titre si écrit en arabe"
              help="S'applique seulement quand le titre ci-dessus contient de l'arabe : les polices latines du template n'ont pas ces lettres. Sans ce choix, le navigateur retomberait sur une police système au hasard.">
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', paddingTop: '4px' }}>
                {AR_TYPOGRAPHY_THEMES.map(th => (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => set('ar_font_theme', th.id)}
                    style={{
                      padding: '10px 14px', border: '2px solid',
                      borderColor: form.ar_font_theme === th.id ? 'var(--admin-accent)' : 'var(--admin-border)',
                      borderRadius: 'var(--admin-radius)',
                      background: form.ar_font_theme === th.id ? '#fdf6e3' : '#fff',
                      cursor: 'pointer', transition: 'all .2s',
                      display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px',
                    }}
                  >
                    <span style={{ fontSize: '1.1rem', fontFamily: th.display, direction: 'rtl' }}>ليلة العمر</span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--admin-text-muted)', fontWeight: 500 }}>{th.label}</span>
                  </button>
                ))}
              </div>
            </Field>
            )}
            <Field label="Vidéo du héros" help="URL d'une vidéo MP4. Elle occupe tout le haut de l'invitation, en fond du titre et de la date. Laissez vide pour un fond dégradé.">
              <input className="admin-input" type="url" value={form.intro_video_url}
                onChange={e => set('intro_video_url', e.target.value)}
                placeholder="https://..." />
            </Field>
          </Section>
        )}


        {isSoiree && (
          <Section title="Soir&eacute;e &mdash; dress code">
            <Toggle label="Afficher la section dress code"
              help="Indique aux invités la tenue attendue, avec une consigne distincte pour les femmes et pour les hommes."
              checked={form.show_dress_code} onChange={v => set('show_dress_code', v)} />
            {form.show_dress_code && (
              <>
                <Field label="Pour les femmes" help="Ex : robe longue, teintes pastel. Laissez vide pour ne rien afficher.">
                  <input className="admin-input" value={form.dress_code_women}
                    onChange={e => set('dress_code_women', e.target.value)}
                    placeholder="Robe longue, teintes pastel" />
                </Field>
                <Field label="Pour les hommes" help="Ex : costume sombre, cravate. Laissez vide pour ne rien afficher.">
                  <input className="admin-input" value={form.dress_code_men}
                    onChange={e => set('dress_code_men', e.target.value)}
                    placeholder="Costume sombre" />
                </Field>
                <DressCodeEditor
                  colors={dressColors} onColorsChange={setDressColors}
                  images={dressImages} onImagesChange={setDressImages} />
              </>
            )}
          </Section>
        )}

        {form.template_id === 'viktor_paula' && (
          <Section title="Viktor &amp; Paula — médias">
            <Field label="Texte du titre principal" help='Texte affiché en haut du héros. Par défaut "Wedding Day".'>
              <input className="admin-input" value={form.wedding_day_text}
                onChange={e => set('wedding_day_text', e.target.value)}
                placeholder="Wedding Day" />
            </Field>
            <Field label="Photo du lieu (location)" help="URL d'une image JPG/PNG du lieu de réception. Laissez vide pour ne pas afficher de photo.">
              <input className="admin-input" type="url" value={form.venue_photo}
                onChange={e => set('venue_photo', e.target.value)}
                placeholder="https://..." />
            </Field>
            <Field label="Photo du couple (fermeture)" help="URL d'une image JPG/PNG. Affichée en bas de l'invitation. Laissez vide pour n'afficher que le texte.">
              <input className="admin-input" type="url" value={form.couple_photo}
                onChange={e => set('couple_photo', e.target.value)}
                placeholder="https://..." />
            </Field>
            <Field label="Vidéo d'introduction" help="URL d'une vidéo MP4. Se joue après l'ouverture de l'enveloppe avant d'afficher l'invitation.">
              <input className="admin-input" type="url" value={form.intro_video_url}
                onChange={e => set('intro_video_url', e.target.value)}
                placeholder="https://..." />
            </Field>
          </Section>
        )}

        <Section title="Options">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Toggle label="Afficher le compte à rebours"
              help="Section compte à rebours jusqu'au jour J"
              checked={form.show_countdown} onChange={v => set('show_countdown', v)} />
            <Toggle label="Afficher le programme de la soirée"
              help="Section « Programme » / Schedule of Events de l'invitation"
              checked={form.show_program} onChange={v => set('show_program', v)} />
            <Toggle label="Afficher les fêtes / célébrations"
              help="Affiche le bloc « Our Celebrations » avec toutes les fêtes additionnelles et la réception principale"
              checked={form.show_celebrations} onChange={v => set('show_celebrations', v)} />
            <Toggle label="Confirmation de présence (RSVP)"
              help="Permet aux invités de confirmer leur présence"
              checked={form.show_rsvp} onChange={v => set('show_rsvp', v)} />
            {form.show_rsvp && (
              <div style={{ padding: '10px', border: '1px solid var(--admin-border)',
                borderRadius: 'var(--admin-radius)', background: '#fafafa',
                display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.max_guests === null}
                    onChange={e => set('max_guests', e.target.checked ? null : 2)}
                    style={{ accentColor: 'var(--admin-accent)' }}
                  />
                  <span style={{ fontSize: '0.88rem', fontWeight: 500 }}>Accompagnants illimités</span>
                </label>
                {form.max_guests !== null && (
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)' }}>
                      Maximum par invité
                    </span>
                    <input
                      className="admin-input"
                      type="number"
                      min={0}
                      max={20}
                      value={form.max_guests}
                      onChange={e => set('max_guests', Math.min(20, Math.max(0, parseInt(e.target.value, 10) || 0)))}
                      style={{ width: '90px' }}
                    />
                  </label>
                )}
              </div>
            )}
            <Toggle label="Activer le livre d'or"
              help="Les invités peuvent laisser des messages"
              checked={form.show_guestbook} onChange={v => set('show_guestbook', v)} />
            {form.show_guestbook && (
              <Toggle
                label="Livre d'or privé"
                help="Les messages restent uniquement visibles dans le portail des mariés — les invités peuvent écrire mais ne voient pas les autres messages."
                checked={form.guestbook_private}
                onChange={v => {
                  set('guestbook_private', v)
                  if (v) set('moderation_on', false)
                }}
              />
            )}
            {!form.guestbook_private ? (
              <Toggle label="Modération des messages"
                help="Les messages sont validés par les mariés avant publication"
                checked={form.moderation_on} onChange={v => set('moderation_on', v)} />
            ) : (
              <div style={{ padding: '10px 12px', background: '#f5f5f5', border: '1px solid var(--admin-border)',
                borderRadius: 'var(--admin-radius)', fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                Modération désactivée — inutile en mode livre d'or privé.
              </div>
            )}
            <Toggle label="Activer les invitations personnalisées"
              help="Permet de générer un lien unique par invité avec son nom affiché sur l'invitation"
              checked={form.guest_invite_enabled} onChange={v => set('guest_invite_enabled', v)} />
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
