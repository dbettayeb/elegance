import Link from 'next/link'
import { TEMPLATES_META } from '@/lib/templates-meta'

export const metadata = {
  title: 'Designs · Élégance Digitale',
  description: 'Neuf designs d\'invitations de mariage digitales : classique, oriental, minimaliste, glamour.',
}

export default function PublicTemplatesPage() {
  return (
    <>
      <style>{CSS}</style>

      <section className="tpl-header">
        <p className="tpl-label">Notre catalogue</p>
        <h1 className="tpl-title">Neuf designs, une signature.</h1>
        <p className="tpl-sub">
          Chaque design est pensé pour évoquer une émotion. Cliquez pour voir un aperçu réel.
        </p>
      </section>

      <section className="tpl-grid-section">
        <div className="tpl-grid-inner">
          <div className="tpl-grid">
            {TEMPLATES_META.map(t => (
              <Link key={t.id} href={`/templates/${t.id}`} className="tpl-card">
                <div className="tpl-visual" style={{ background: t.palette[0] }}>
                  <div className="tpl-name-display" style={{ color: t.palette[2] || t.palette[1] }}>
                    <span>{t.name}</span>
                    <div className="tpl-line" style={{ background: t.palette[2] || t.palette[1] }} />
                    <small>Aperçu</small>
                  </div>
                  <div className="tpl-palette">
                    {t.palette.map((c, i) => (
                      <div key={i} className="tpl-swatch" style={{ background: c }} />
                    ))}
                  </div>
                  {t.language === 'ar' && <span className="tpl-badge">عربي</span>}
                </div>
                <div className="tpl-meta">
                  <div className="tpl-meta-name">{t.name}</div>
                  <div className="tpl-meta-desc">{t.description.split('.')[0]}.</div>
                  <div className="tpl-meta-tags">
                    {t.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="tpl-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
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
    display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 32px;
  }
  .tpl-card {
    text-decoration: none; color: inherit;
    display: flex; flex-direction: column; transition: transform 0.3s;
  }
  .tpl-card:hover { transform: translateY(-4px); }
  .tpl-visual {
    aspect-ratio: 3 / 4; position: relative;
    display: flex; align-items: center; justify-content: center;
    transition: box-shadow 0.3s;
  }
  .tpl-card:hover .tpl-visual { box-shadow: 0 20px 50px rgba(0,0,0,0.1); }
  .tpl-name-display { text-align: center; padding: 0 24px; }
  .tpl-name-display span {
    font-family: Georgia, serif; font-size: 1.7rem; font-weight: 300; display: block;
  }
  .tpl-line { width: 40px; height: 1px; margin: 12px auto; opacity: 0.6; }
  .tpl-name-display small {
    font-size: 0.55rem; letter-spacing: 0.3em;
    text-transform: uppercase; opacity: 0.7;
  }
  .tpl-palette { position: absolute; bottom: 14px; left: 14px; display: flex; gap: 4px; }
  .tpl-swatch {
    width: 16px; height: 16px; border-radius: 50%;
    border: 1px solid rgba(0,0,0,0.06);
  }
  .tpl-badge {
    position: absolute; top: 14px; right: 14px;
    padding: 4px 10px; background: rgba(0,0,0,0.75); color: #fff;
    font-size: 0.68rem; letter-spacing: 0.1em;
    border-radius: 2px; font-family: 'Amiri', serif;
  }
  .tpl-meta { padding: 20px 4px 0; }
  .tpl-meta-name { font-family: Georgia, serif; font-size: 1.2rem; margin-bottom: 6px; }
  .tpl-meta-desc { font-size: 0.88rem; color: var(--pub-text-muted); line-height: 1.5; margin-bottom: 12px; }
  .tpl-meta-tags { display: flex; gap: 6px; flex-wrap: wrap; }
  .tpl-tag {
    font-size: 0.66rem; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--pub-text-subtle); border: 1px solid var(--pub-border);
    padding: 2px 8px; border-radius: 2px;
  }
`