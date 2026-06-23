'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { TEMPLATES_META } from '@/lib/templates-meta'
import { getTemplateFields } from '@/lib/template-fields'

interface Props {
  templateId: string
  templateName: string
}

interface Fields {
  bride_name: string;       groom_name: string
  bride_name_ar: string;    groom_name_ar: string
  event_date: string;       event_time: string
  venue_name: string;       venue_address: string
  intro_text: string
  custom_message: string
  wedding_day_text: string
  gps_google: string;       gps_apple: string
}

interface ProgramItem { time: string; event: string; venue: string }

interface Options {
  show_countdown:       boolean
  show_rsvp:            boolean
  show_guestbook:       boolean
  moderation_on:        boolean
  show_program:         boolean
  guest_invite_enabled: boolean
}

const EMPTY_FIELDS: Fields = {
  bride_name: '',       groom_name: '',
  bride_name_ar: '',    groom_name_ar: '',
  event_date: '',       event_time: '',
  venue_name: '',       venue_address: '',
  intro_text: '',
  custom_message: '',
  wedding_day_text: '',
  gps_google: '',       gps_apple: '',
}

const DEFAULT_PROGRAM: ProgramItem[] = [
  { time: '17:00', event: 'Cérémonie',          venue: '' },
  { time: '19:00', event: 'Cocktail de bienvenue', venue: '' },
  { time: '20:30', event: 'Dîner de gala',      venue: '' },
  { time: '23:00', event: 'Ouverture du bal',   venue: '' },
]

const DEFAULT_OPTIONS: Options = {
  show_countdown:       true,
  show_rsvp:            true,
  show_guestbook:       true,
  moderation_on:        true,
  show_program:         true,
  guest_invite_enabled: false,
}

function buildSrc(id: string, f: Fields, program: ProgramItem[], opts: Options) {
  const p = new URLSearchParams({ mode: 'card' })
  if (f.bride_name)        p.set('bride',            f.bride_name)
  if (f.groom_name)        p.set('groom',            f.groom_name)
  if (f.bride_name_ar)     p.set('bride_ar',         f.bride_name_ar)
  if (f.groom_name_ar)     p.set('groom_ar',         f.groom_name_ar)
  if (f.event_date)        p.set('date',             f.event_date)
  if (f.event_time)        p.set('time',             f.event_time)
  if (f.venue_name)        p.set('venue',            f.venue_name)
  if (f.venue_address)     p.set('venue_address',    f.venue_address)
  p.set('intro',                                      f.intro_text)
  if (f.custom_message)    p.set('custom_message',   f.custom_message)
  if (f.wedding_day_text)  p.set('wedding_day_text', f.wedding_day_text)
  if (f.gps_google)        p.set('maps_google',      f.gps_google)
  if (f.gps_apple)         p.set('maps_apple',       f.gps_apple)
  p.set('program',              encodeURIComponent(JSON.stringify(program)))
  p.set('show_program',         opts.show_program         ? '1' : '0')
  p.set('show_countdown',       opts.show_countdown       ? '1' : '0')
  p.set('show_rsvp',            opts.show_rsvp            ? '1' : '0')
  p.set('show_guestbook',       opts.show_guestbook       ? '1' : '0')
  p.set('moderation_on',        opts.moderation_on        ? '1' : '0')
  p.set('guest_invite_enabled', opts.guest_invite_enabled ? '1' : '0')
  return `/templates/${id}/embed?${p.toString()}`
}

export default function TemplatePreviewClient({ templateId, templateName }: Props) {
  const router   = useRouter()
  const isArabic = TEMPLATES_META.find(t => t.id === templateId)?.language === 'ar'
  const schema   = getTemplateFields(templateId)

  const [fields,    setFields]    = useState<Fields>(EMPTY_FIELDS)
  const [program,   setProgram]   = useState<ProgramItem[]>(DEFAULT_PROGRAM)
  const [options,   setOptions]   = useState<Options>(DEFAULT_OPTIONS)
  const [panelOpen, setPanelOpen] = useState(true)
  const [iframeSrc, setIframeSrc] = useState(() => buildSrc(templateId, EMPTY_FIELDS, DEFAULT_PROGRAM, DEFAULT_OPTIONS))
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  function upd<K extends keyof Fields>(key: K, val: string) {
    setFields(f => ({ ...f, [key]: val }))
  }
  function updOpt<K extends keyof Options>(key: K, val: boolean) {
    setOptions(o => ({ ...o, [key]: val }))
  }
  function updProg(i: number, key: keyof ProgramItem, val: string) {
    setProgram(p => p.map((row, idx) => idx === i ? { ...row, [key]: val } : row))
  }
  function addProg() {
    setProgram(p => [...p, { time: '', event: '', venue: '' }])
  }
  function removeProg(i: number) {
    setProgram(p => p.filter((_, idx) => idx !== i))
  }

  useEffect(() => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setIframeSrc(buildSrc(templateId, fields, program, options))
    }, 450)
    return () => clearTimeout(timerRef.current)
  }, [fields, program, options, templateId])

  function handleChoose() {
    const p = new URLSearchParams({ template: templateId })
    if (fields.bride_name)    p.set('bride',    fields.bride_name)
    if (fields.groom_name)    p.set('groom',    fields.groom_name)
    if (fields.bride_name_ar) p.set('bride_ar', fields.bride_name_ar)
    if (fields.groom_name_ar) p.set('groom_ar', fields.groom_name_ar)
    if (fields.venue_name)    p.set('venue',    fields.venue_name)
    if (fields.event_date)    p.set('date',     fields.event_date)
    router.push(`/commander?${p.toString()}`)
  }

  return (
    <>
      <style>{CSS}</style>

      {/* ── BARRE ── */}
      <div className="ptp-bar">
        <Link href="/templates" className="ptp-back">← Tous les designs</Link>
        <span className="ptp-name">{templateName}</span>
        <div className="ptp-bar-right">
          <button className="ptp-toggle-btn" onClick={() => setPanelOpen(o => !o)}>
            {panelOpen ? '⛶ Plein écran' : '✏ Modifier'}
          </button>
          <button onClick={handleChoose} className="ptp-cta">Choisir ce design →</button>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className={`ptp-body${panelOpen ? '' : ' ptp-body--full'}`}>

        <div className="ptp-preview">
          <iframe key={iframeSrc} src={iframeSrc} title={`Aperçu ${templateName}`}
            allow="autoplay" className="ptp-iframe" />
          {!panelOpen && (
            <button className="ptp-float-btn" onClick={() => setPanelOpen(true)}>✏ Modifier</button>
          )}
        </div>

        {panelOpen && (
          <div className="ptp-panel">
            <div className="ptp-panel-inner">

              {/* Prénoms */}
              <Group title="Les prénoms">
                <Field label="Prénom de la mariée">
                  <input value={fields.bride_name} onChange={e => upd('bride_name', e.target.value)} placeholder="Yasmine" />
                </Field>
                <Field label="Prénom du marié">
                  <input value={fields.groom_name} onChange={e => upd('groom_name', e.target.value)} placeholder="Mehdi" />
                </Field>
                {isArabic && <>
                  <Field label="اسم العروس">
                    <input dir="rtl" value={fields.bride_name_ar} onChange={e => upd('bride_name_ar', e.target.value)} placeholder="ياسمين" />
                  </Field>
                  <Field label="اسم العريس">
                    <input dir="rtl" value={fields.groom_name_ar} onChange={e => upd('groom_name_ar', e.target.value)} placeholder="مهدي" />
                  </Field>
                </>}
              </Group>

              {/* Date, heure & lieu */}
              <Group title="Date, heure & lieu">
                <div className="ptp-row">
                  <Field label="Date">
                    <input type="date" value={fields.event_date} onChange={e => upd('event_date', e.target.value)} />
                  </Field>
                  <Field label="Heure">
                    <input type="time" value={fields.event_time} onChange={e => upd('event_time', e.target.value)} />
                  </Field>
                </div>
                <Field label="Nom du lieu">
                  <input value={fields.venue_name} onChange={e => upd('venue_name', e.target.value)} placeholder="Dar El Jeld" />
                </Field>
                <Field label="Adresse complète">
                  <input value={fields.venue_address} onChange={e => upd('venue_address', e.target.value)} placeholder="5 Rue Dar El Jeld, Tunis" />
                </Field>
                <Field label="Google Maps" help="Collez le lien de partage">
                  <input value={fields.gps_google} onChange={e => upd('gps_google', e.target.value)} placeholder="https://maps.google.com/…" />
                </Field>
                <Field label="Apple Maps">
                  <input value={fields.gps_apple} onChange={e => upd('gps_apple', e.target.value)} placeholder="https://maps.apple.com/…" />
                </Field>
              </Group>

              {/* Texte d'introduction (universel sauf arabes et templates avec champ personnalisé) */}
              {!isArabic && !schema.hideIntroText && (
                <Group title="Texte d'accueil">
                  <Field label="Phrase d'introduction">
                    <textarea rows={2} value={fields.intro_text}
                      onChange={e => upd('intro_text', e.target.value)}
                      placeholder="Vous êtes cordialement invités au mariage de" />
                  </Field>
                </Group>
              )}

              {/* Textes spécifiques au template (weddingDayText, introText, customMessage) */}
              {(schema.weddingDayText || schema.introText || schema.customMessage) && (
                <Group title="Textes du template">
                  {schema.weddingDayText && (
                    <Field label={schema.weddingDayText.label} help={schema.weddingDayText.help}>
                      <input value={fields.wedding_day_text}
                        onChange={e => upd('wedding_day_text', e.target.value)}
                        placeholder={schema.weddingDayText.placeholder} />
                    </Field>
                  )}
                  {schema.introText && (
                    <Field label={schema.introText.label} help={schema.introText.help}>
                      {schema.introText.rows && schema.introText.rows > 1
                        ? <textarea rows={schema.introText.rows} value={fields.intro_text}
                            onChange={e => upd('intro_text', e.target.value)}
                            placeholder={schema.introText.placeholder} />
                        : <input value={fields.intro_text}
                            onChange={e => upd('intro_text', e.target.value)}
                            placeholder={schema.introText.placeholder} />}
                    </Field>
                  )}
                  {schema.customMessage && (
                    <Field label={schema.customMessage.label} help={schema.customMessage.help}>
                      <textarea rows={schema.customMessage.rows ?? 3}
                        dir={isArabic ? 'rtl' : 'ltr'}
                        value={fields.custom_message}
                        onChange={e => upd('custom_message', e.target.value)}
                        placeholder={schema.customMessage.placeholder} />
                    </Field>
                  )}
                </Group>
              )}

              {/* Programme */}
              <Group title="Programme de la soirée">
                <label className="ptp-toggle">
                  <input type="checkbox" checked={options.show_program}
                    onChange={e => updOpt('show_program', e.target.checked)} />
                  <span>Afficher le programme dans l'invitation</span>
                </label>
                {options.show_program && <>
                  {program.map((item, i) => (
                    <div key={i} className="ptp-prog-row">
                      <input className="ptp-prog-time" type="time" value={item.time}
                        onChange={e => updProg(i, 'time', e.target.value)} />
                      <input className="ptp-prog-event" value={item.event}
                        onChange={e => updProg(i, 'event', e.target.value)}
                        placeholder="Cérémonie" />
                      <input className="ptp-prog-venue" value={item.venue}
                        onChange={e => updProg(i, 'venue', e.target.value)}
                        placeholder="Lieu (optionnel)" />
                      <button className="ptp-prog-del" onClick={() => removeProg(i)} title="Supprimer">✕</button>
                    </div>
                  ))}
                  <button className="ptp-prog-add" onClick={addProg}>+ Ajouter un moment</button>
                </>}
              </Group>

              {/* Options */}
              <Group title="Options de l'invitation">
                {([
                  ['show_countdown',       'Compte à rebours'],
                  ['show_rsvp',            'Formulaire RSVP'],
                  ['show_guestbook',       'Livre d\'or'],
                  ['moderation_on',        'Modération des messages'],
                  ['guest_invite_enabled', 'Invitations personnalisées (un lien par invité)'],
                ] as [keyof Options, string][]).map(([key, label]) => (
                  <label key={key} className="ptp-toggle">
                    <input type="checkbox" checked={options[key]}
                      onChange={e => updOpt(key, e.target.checked)} />
                    <span>{label}</span>
                  </label>
                ))}
              </Group>

              <button onClick={handleChoose} className="ptp-panel-cta">
                Choisir ce design →
              </button>

            </div>
          </div>
        )}
      </div>
    </>
  )
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="ptp-group">
      <div className="ptp-group-title">{title}</div>
      {children}
    </div>
  )
}

function Field({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
  return (
    <div className="ptp-field">
      <label>{label}</label>
      {children}
      {help && <p className="ptp-help">{help}</p>}
    </div>
  )
}

const CSS = `
  /* ── Bar ── */
  .ptp-bar {
    flex-shrink: 0; display: flex; align-items: center; gap: 16px;
    padding: 12px 24px;
    background: rgba(255,255,255,0.97); backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--pub-border); z-index: 10;
  }
  .ptp-back { color: var(--pub-text-muted); text-decoration: none; font-size: 0.8rem; white-space: nowrap; }
  .ptp-back:hover { color: var(--pub-text); }
  .ptp-name { font-family: Georgia, serif; font-size: 0.95rem; flex: 1; }
  .ptp-bar-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }

  .ptp-toggle-btn {
    padding: 7px 14px; background: transparent; color: var(--pub-text);
    border: 1px solid var(--pub-border); font-size: 0.7rem;
    letter-spacing: 0.1em; text-transform: uppercase;
    cursor: pointer; font-family: inherit; white-space: nowrap; transition: all 0.2s;
  }
  .ptp-toggle-btn:hover { border-color: var(--pub-text); }
  .ptp-cta {
    padding: 8px 18px; background: var(--pub-text); color: #fff; border: none;
    font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase;
    font-weight: 500; cursor: pointer; font-family: inherit; white-space: nowrap;
    transition: opacity 0.2s;
  }
  .ptp-cta:hover { opacity: 0.85; }

  /* ── Body ── */
  .ptp-body { flex: 1; display: flex; flex-direction: row; min-height: 0; overflow: hidden; }

  /* ── Preview ── */
  .ptp-preview { flex: 1; position: relative; min-width: 0; }
  .ptp-iframe  { display: block; border: none; width: 100%; height: 100%; }
  .ptp-float-btn {
    position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%);
    padding: 10px 24px; background: rgba(20,20,20,0.82); color: #fff;
    border: none; border-radius: 30px; font-size: 0.78rem;
    letter-spacing: 0.1em; cursor: pointer; font-family: inherit;
    backdrop-filter: blur(6px); transition: opacity 0.2s; white-space: nowrap;
  }
  .ptp-float-btn:hover { opacity: 0.85; }

  /* ── Panel ── */
  .ptp-panel {
    width: 360px; flex-shrink: 0;
    border-left: 1px solid var(--pub-border);
    background: #fafafa; overflow-y: auto;
  }
  .ptp-panel-inner { padding: 22px 18px 48px; display: flex; flex-direction: column; gap: 26px; }

  .ptp-group { display: flex; flex-direction: column; gap: 12px; }
  .ptp-group-title {
    font-size: 0.6rem; letter-spacing: 0.38em; text-transform: uppercase;
    color: var(--pub-gold-dark); padding-bottom: 8px;
    border-bottom: 1px solid var(--pub-border);
  }
  .ptp-field { display: flex; flex-direction: column; gap: 4px; }
  .ptp-field label { font-size: 0.7rem; letter-spacing: 0.05em; color: var(--pub-text-muted); }
  .ptp-field input, .ptp-field textarea {
    padding: 8px 0; background: transparent; border: none;
    border-bottom: 1px solid var(--pub-border);
    font-family: Georgia, serif; font-size: 0.9rem;
    color: var(--pub-text); outline: none; width: 100%;
    transition: border-color 0.2s; resize: vertical;
  }
  .ptp-field input:focus, .ptp-field textarea:focus { border-bottom-color: var(--pub-text); }
  .ptp-field input[type="date"],
  .ptp-field input[type="time"] { font-family: inherit; font-size: 0.85rem; }
  .ptp-help { font-size: 0.67rem; color: var(--pub-text-subtle); font-style: italic; margin: 0; }
  .ptp-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

  /* Programme */
  .ptp-prog-row {
    display: grid; gap: 6px;
    grid-template-columns: 72px 1fr 1fr 24px;
    align-items: end;
  }
  .ptp-prog-row input {
    padding: 6px 0; background: transparent; border: none;
    border-bottom: 1px solid var(--pub-border);
    font-family: inherit; font-size: 0.82rem;
    color: var(--pub-text); outline: none; width: 100%;
    transition: border-color 0.2s;
  }
  .ptp-prog-row input:focus { border-bottom-color: var(--pub-text); }
  .ptp-prog-del {
    background: none; border: none; color: var(--pub-text-muted);
    font-size: 0.75rem; cursor: pointer; padding: 4px;
    transition: color 0.15s; line-height: 1;
  }
  .ptp-prog-del:hover { color: #c00; }
  .ptp-prog-add {
    background: none; border: 1px dashed var(--pub-border);
    color: var(--pub-text-muted); font-size: 0.72rem;
    padding: 7px; cursor: pointer; font-family: inherit;
    transition: all 0.2s; letter-spacing: 0.05em;
  }
  .ptp-prog-add:hover { border-color: var(--pub-text-muted); color: var(--pub-text); }

  /* Options */
  .ptp-toggle {
    display: flex; align-items: center; gap: 10px;
    cursor: pointer; font-size: 0.85rem; color: var(--pub-text);
    padding: 6px 0; user-select: none;
  }
  .ptp-toggle input[type="checkbox"] { width: 15px; height: 15px; cursor: pointer; accent-color: var(--pub-text); flex-shrink: 0; }

  /* CTA panel */
  .ptp-panel-cta {
    width: 100%; padding: 13px; margin-top: 6px;
    background: var(--pub-text); color: #fff; border: none;
    font-size: 0.72rem; letter-spacing: 0.25em; text-transform: uppercase;
    font-weight: 500; cursor: pointer; font-family: inherit; transition: opacity 0.2s;
  }
  .ptp-panel-cta:hover { opacity: 0.85; }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .ptp-bar { padding: 10px 16px; }
    .ptp-name { display: none; }
    .ptp-toggle-btn { font-size: 0.65rem; padding: 6px 10px; }
    .ptp-cta { font-size: 0.65rem; padding: 7px 12px; }
    .ptp-body { flex-direction: column; }
    .ptp-preview { flex: 1; min-height: 0; }
    .ptp-panel {
      width: 100%; border-left: none;
      border-top: 1px solid var(--pub-border);
      max-height: 55vh; flex-shrink: 0;
    }
    .ptp-prog-row { grid-template-columns: 65px 1fr 24px; }
    .ptp-prog-venue { display: none; }
  }
`
