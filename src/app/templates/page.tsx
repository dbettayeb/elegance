import Link from 'next/link'
import { TEMPLATES_META } from '@/lib/templates-meta'
import PublicShell from '@/components/public/PublicShell'

export const metadata = {
  title: 'Designs · Élégance Digitale',
  description: 'Neuf designs d\'invitations de mariage digitales : classique, oriental, minimaliste, glamour.',
}

export default function PublicTemplatesPage() {
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

      <section className="tpl-grid-section">
        <div className="tpl-grid-inner">
          <div className="tpl-grid">
            {TEMPLATES_META.map(t => (
              <Link key={t.id} href={`/templates/${t.id}`} className="tpl-card">
                <div className="tpl-visual" style={{ background: t.palette[0] }}>

                  {/* Live mini-render of the real template */}
                  <iframe
                    src={`/templates/${t.id}/embed`}
                    className="tpl-mini-frame"
                    loading="lazy"
                    tabIndex={-1}
                    aria-hidden="true"
                    scrolling="no"
                  />

                  {/* Hover overlay */}
                  <div className="tpl-hover-overlay">
                    <span className="tpl-hover-cta">Voir l'aperçu →</span>
                  </div>

                  {/* Badges */}
                  <div className="tpl-badges">
                    {t.language === 'ar' && <span className="tpl-badge tpl-badge-ar">عربي</span>}
                    {t.type === 'dynamique' && <span className="tpl-badge tpl-badge-dyn">▶ Vidéo</span>}
                  </div>

                  {/* Color palette */}
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
  .tpl-header { text-align: center; padding: 80px 28px 64px; max-width: 680px; margin: 0 auto; }
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

  /* ── Visual area ── */
  .tpl-visual {
    aspect-ratio: 3 / 4;
    position: relative;
    overflow: hidden;
    display: flex; align-items: center; justify-content: center;
  }
  .tpl-card:hover .tpl-visual { box-shadow: 0 24px 56px rgba(0,0,0,0.14); }

  /* Preview screenshot */
  /* Live template mini-render */
  .tpl-mini-frame {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    border: none; display: block;
    pointer-events: none;
  }

  /* Hover overlay */
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

  /* Badges */
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

  /* Palette swatches */
  .tpl-palette {
    position: absolute; bottom: 12px; left: 12px; z-index: 6;
    display: flex; gap: 4px;
  }
  .tpl-swatch {
    width: 14px; height: 14px; border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.4);
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }

  /* ── Meta section ── */
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
    .tpl-grid { grid-template-columns: repeat(2, 1fr); gap: 18px; }
    .tpl-grid-section { padding: 0 16px 64px; }
    .tpl-meta-desc { display: none; }
    .tpl-meta { padding: 10px 2px 0; }
    .tpl-meta-name { font-size: 0.95rem; }
  }
`
