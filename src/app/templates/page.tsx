import Link from 'next/link'
import { TEMPLATES_META } from '@/lib/templates-meta'
import PublicShell from '@/components/public/PublicShell'

export const metadata = {
  title: 'Designs · Élégance Digitale',
  description: 'Vingt designs d\'invitations de mariage digitales : vidéo animée, classique, oriental, floral, arabe.',
}

type Filter = 'tous' | 'video' | 'fr' | 'ar'

const FILTER_TABS: { id: Filter; label: string }[] = [
  { id: 'tous',  label: 'Tous' },
  { id: 'video', label: '▶ Vidéo' },
  { id: 'fr',    label: 'Français' },
  { id: 'ar',    label: 'عربي' },
]

function filterTemplates(all: typeof TEMPLATES_META, f: Filter) {
  if (f === 'video') return all.filter(t => t.type === 'dynamique')
  if (f === 'fr')    return all.filter(t => t.language !== 'ar' && t.type !== 'dynamique')
  if (f === 'ar')    return all.filter(t => t.language === 'ar')
  return all
}

export default async function PublicTemplatesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const sp    = await searchParams
  const filter = (sp.filter || 'tous') as Filter
  const shown = filterTemplates(TEMPLATES_META, filter)

  const counts: Record<Filter, number> = {
    tous:  TEMPLATES_META.length,
    video: filterTemplates(TEMPLATES_META, 'video').length,
    fr:    filterTemplates(TEMPLATES_META, 'fr').length,
    ar:    filterTemplates(TEMPLATES_META, 'ar').length,
  }

  return (
    <PublicShell>
      <style>{CSS}</style>

      <section className="tpl-header">
        <p className="tpl-label">Notre catalogue</p>
        <h1 className="tpl-title">Choisissez votre design.</h1>
        <p className="tpl-sub">
          Chaque design est pensé pour évoquer une émotion. Cliquez pour voir un aperçu interactif complet.
        </p>
      </section>

      <div className="tpl-filters">
        <div className="tpl-filters-inner">
          {FILTER_TABS.map(tab => (
            <Link
              key={tab.id}
              href={tab.id === 'tous' ? '/templates' : `/templates?filter=${tab.id}`}
              className={`tpl-tab${filter === tab.id ? ' tpl-tab-active' : ''}`}
            >
              {tab.label}
              <span className="tpl-tab-count">{counts[tab.id]}</span>
            </Link>
          ))}
        </div>
      </div>

      <section className="tpl-grid-section">
        <div className="tpl-grid-inner">
          <div className="tpl-grid">
            {shown.map(t => (
              <Link key={t.id} href={`/templates/${t.id}`} className="tpl-card">
                <div className="tpl-visual" style={{ background: t.palette[0] }}>
                  <iframe
                    src={`/templates/${t.id}/embed?mode=card`}
                    className="tpl-mini-frame"
                    loading="lazy"
                    tabIndex={-1}
                    aria-hidden="true"
                    scrolling="no"
                  />
                  <div className="tpl-hover-overlay">
                    <span className="tpl-hover-cta">Voir l'aperçu →</span>
                  </div>
                  <div className="tpl-badges">
                    {t.language === 'ar' && <span className="tpl-badge tpl-badge-ar">عربي</span>}
                    {t.type === 'dynamique' && <span className="tpl-badge tpl-badge-dyn">▶ Vidéo</span>}
                  </div>
                  <div className="tpl-palette">
                    {t.palette.slice(0, 4).map((c, i) => (
                      <div key={i} className="tpl-swatch" style={{ background: c }} />
                    ))}
                  </div>
                </div>
                <div className="tpl-meta">
                  <div className="tpl-meta-name">{t.name}</div>
                  <div className="tpl-meta-desc">{t.description.split('.')[0]}.</div>
                  <div className="tpl-meta-tags">
                    {t.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="tpl-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PublicShell>
  )
}

const CSS = `
  .tpl-header { text-align: center; padding: 80px 28px 48px; max-width: 680px; margin: 0 auto; }
  .tpl-label {
    font-size: 0.7rem; letter-spacing: 0.45em; text-transform: uppercase;
    color: var(--pub-gold); font-weight: 500; margin-bottom: 14px;
  }
  .tpl-title {
    font-family: Georgia, serif; font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 300; line-height: 1.2; margin-bottom: 16px;
  }
  .tpl-sub {
    font-family: Georgia, serif; font-style: italic;
    font-size: 1.05rem; color: var(--pub-text-muted);
  }

  /* ── Filter tabs ── */
  .tpl-filters {
    border-bottom: 1px solid var(--pub-border);
    margin-bottom: 48px;
  }
  .tpl-filters-inner {
    max-width: 1180px; margin: 0 auto; padding: 0 28px;
    display: flex; gap: 0; overflow-x: auto;
  }
  .tpl-tab {
    display: flex; align-items: center; gap: 7px;
    padding: 16px 22px;
    font-size: 0.82rem; letter-spacing: 0.08em;
    text-decoration: none; color: var(--pub-text-muted);
    border-bottom: 2px solid transparent;
    white-space: nowrap; transition: color 0.2s, border-color 0.2s;
    flex-shrink: 0;
  }
  .tpl-tab:hover { color: var(--pub-text); }
  .tpl-tab-active { color: var(--pub-text); border-bottom-color: var(--pub-text); }
  .tpl-tab-count {
    background: var(--pub-border); color: var(--pub-text-subtle);
    font-size: 0.68rem; padding: 2px 7px; border-radius: 20px;
    letter-spacing: 0;
  }
  .tpl-tab-active .tpl-tab-count { background: var(--pub-text); color: #fff; }

  /* ── Grid ── */
  .tpl-grid-section { padding: 0 28px 96px; }
  .tpl-grid-inner { max-width: 1180px; margin: 0 auto; }
  .tpl-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 36px;
  }

  /* ── Card ── */
  .tpl-card {
    text-decoration: none; color: inherit;
    display: flex; flex-direction: column;
    transition: transform 0.3s;
  }
  .tpl-card:hover { transform: translateY(-6px); }

  .tpl-visual {
    aspect-ratio: 3 / 4;
    position: relative;
    overflow: hidden;
    display: flex; align-items: center; justify-content: center;
    container-type: inline-size;
  }
  .tpl-card:hover .tpl-visual { box-shadow: 0 24px 56px rgba(0,0,0,0.14); }

  /* Iframe rendu en taille fixe (390px = mobile standard), puis réduit via container queries */
  .tpl-mini-frame {
    position: absolute;
    top: 0; left: 0;
    width: 390px;
    height: 520px;
    transform-origin: top left;
    transform: scale(0.67);
    border: none; display: block;
    pointer-events: none;
  }
  @container (max-width: 180px) {
    .tpl-mini-frame { transform: scale(0.41); }
  }
  @container (min-width: 181px) and (max-width: 220px) {
    .tpl-mini-frame { transform: scale(0.54); }
  }
  @container (min-width: 221px) and (max-width: 260px) {
    .tpl-mini-frame { transform: scale(0.62); }
  }
  @container (min-width: 261px) and (max-width: 310px) {
    .tpl-mini-frame { transform: scale(0.72); }
  }
  @container (min-width: 311px) and (max-width: 370px) {
    .tpl-mini-frame { transform: scale(0.85); }
  }
  @container (min-width: 371px) {
    .tpl-mini-frame { transform: scale(0.97); }
  }

  .tpl-hover-overlay {
    position: absolute; inset: 0; z-index: 5;
    background: rgba(10,10,10,0.45);
    display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: opacity 0.3s;
  }
  .tpl-card:hover .tpl-hover-overlay { opacity: 1; }
  .tpl-hover-cta {
    color: #fff;
    font-size: 0.75rem; letter-spacing: 0.22em; text-transform: uppercase;
    border: 1px solid rgba(255,255,255,0.85);
    padding: 11px 22px;
    backdrop-filter: blur(4px);
    background: rgba(255,255,255,0.08);
    transition: background 0.2s;
  }
  .tpl-card:hover .tpl-hover-cta { background: rgba(255,255,255,0.15); }

  .tpl-badges {
    position: absolute; top: 12px; right: 12px; z-index: 6;
    display: flex; flex-direction: column; align-items: flex-end; gap: 5px;
  }
  .tpl-badge {
    padding: 3px 9px; font-size: 0.65rem; border-radius: 2px;
  }
  .tpl-badge-ar {
    background: rgba(0,0,0,0.7); color: #fff;
    font-family: 'Amiri', serif; letter-spacing: 0.05em;
  }
  .tpl-badge-dyn {
    background: rgba(184,152,90,0.92); color: #fff; letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .tpl-palette {
    position: absolute; bottom: 12px; left: 12px; z-index: 6;
    display: flex; gap: 4px;
  }
  .tpl-swatch {
    width: 14px; height: 14px; border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.4);
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }

  /* ── Meta ── */
  .tpl-meta { padding: 18px 2px 0; }
  .tpl-meta-name {
    font-family: Georgia, serif; font-size: 1.15rem;
    margin-bottom: 5px;
  }
  .tpl-meta-desc {
    font-size: 0.85rem; color: var(--pub-text-muted);
    line-height: 1.5; margin-bottom: 10px;
  }
  .tpl-meta-tags { display: flex; gap: 5px; flex-wrap: wrap; }
  .tpl-tag {
    font-size: 0.63rem; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--pub-text-subtle); border: 1px solid var(--pub-border);
    padding: 2px 7px; border-radius: 2px;
  }

  @media (max-width: 640px) {
    .tpl-header { padding: 60px 20px 36px; }
    .tpl-filters-inner { padding: 0 16px; }
    .tpl-tab { padding: 14px 14px; font-size: 0.78rem; }
    .tpl-grid { grid-template-columns: repeat(2, 1fr); gap: 18px; }
    .tpl-grid-section { padding: 0 16px 64px; }
    .tpl-meta-desc { display: none; }
    .tpl-meta-tags { display: none; }
    .tpl-meta { padding: 10px 2px 0; }
    .tpl-meta-name { font-size: 0.95rem; }
  }
`
