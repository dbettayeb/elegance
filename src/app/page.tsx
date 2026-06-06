import Link from 'next/link'
import { TEMPLATES_META } from '@/lib/templates-meta'
import { PACKS } from '@/lib/packs'
import PublicShell from '@/components/public/PublicShell'

export const metadata = {
  title: 'Élégance Digitale · Invitations de mariage digitales haut de gamme',
  description: 'Designs élégants, RSVP en ligne, livre d\'or modéré. Créez une invitation de mariage digitale unique en quelques minutes.',
}

export default function LandingPage() {
  const featured = ['blanc_dore', 'nuit_etoilee', 'bismillah', 'rose_poudre']
  const featuredTemplates = TEMPLATES_META.filter(t => featured.includes(t.id))

  return (
    <PublicShell>
      <style>{CSS}</style>

      <section className="lp-hero">
        <div className="lp-hero-inner">
          <p className="lp-hero-pre">— Élégance Digitale —</p>
          <h1 className="lp-hero-title">
            L'invitation de mariage,<br />
            <span className="lp-hero-italic">réinventée.</span>
          </h1>
          <p className="lp-hero-sub">
            Des designs sur mesure, des confirmations en temps réel,
            un lien unique à partager. Tout ce qu'il faut pour faire
            entrer vos invités dans votre histoire.
          </p>
          <div className="lp-hero-ctas">
            <Link href="/templates" className="lp-btn-primary">Voir les designs</Link>
            <Link href="/commander" className="lp-btn-ghost">Commander →</Link>
          </div>
          <div className="lp-hero-divider"></div>
          <p className="lp-hero-mini">9 designs · Français & arabe · Livraison sous 48h</p>
        </div>
      </section>

      <section className="lp-values">
        <div className="lp-section-inner">
          <div className="lp-values-grid">
            {[
              { num: '01', title: 'Designs uniques', desc: 'Neuf univers pensés par des designers, du minimaliste parisien au zellige andalou.' },
              { num: '02', title: 'RSVP en direct', desc: 'Vos invités confirment en un clic. Vous suivez tout depuis votre espace mariés.' },
              { num: '03', title: 'Livre d\'or modéré', desc: 'Recevez les vœux de vos proches. Vous validez ce qui s\'affiche publiquement.' },
            ].map(v => (
              <div key={v.num} className="lp-value">
                <div className="lp-value-num">{v.num}</div>
                <h3 className="lp-value-title">{v.title}</h3>
                <p className="lp-value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-templates">
        <div className="lp-section-inner">
          <p className="lp-label">Notre catalogue</p>
          <h2 className="lp-h2">Neuf univers, une signature.</h2>
          <p className="lp-section-sub">
            Chaque design a sa personnalité. Trouvez celui qui ressemble à votre histoire.
          </p>

          <div className="lp-tpl-grid">
            {featuredTemplates.map(t => (
              <Link key={t.id} href={`/templates/${t.id}`} className="lp-tpl-card">
                <div className="lp-tpl-visual" style={{ background: t.palette[0] }}>
                  <div className="lp-tpl-name-display" style={{ color: t.palette[2] || t.palette[1] }}>
                    <span>{t.name}</span>
                    <div className="lp-tpl-line" style={{ background: t.palette[2] || t.palette[1] }} />
                    <small>Aperçu</small>
                  </div>
                  <div className="lp-tpl-palette">
                    {t.palette.map((c, i) => (
                      <div key={i} className="lp-tpl-swatch" style={{ background: c }} />
                    ))}
                  </div>
                </div>
                <div className="lp-tpl-meta">
                  <div className="lp-tpl-meta-name">{t.name}</div>
                  <div className="lp-tpl-meta-desc">{t.description.split('.')[0]}.</div>
                </div>
              </Link>
            ))}
          </div>

          <div className="lp-center">
            <Link href="/templates" className="lp-btn-ghost">Voir les 9 designs →</Link>
          </div>
        </div>
      </section>

      <section className="lp-process">
        <div className="lp-section-inner">
          <p className="lp-label">Comment ça marche</p>
          <h2 className="lp-h2">Quatre étapes, quelques jours.</h2>

          <div className="lp-steps">
            {[
              { num: '1', title: 'Choisissez', desc: 'Le design qui vous plaît et le pack adapté à vos besoins.' },
              { num: '2', title: 'Commandez', desc: 'Remplissez le formulaire avec les informations de votre mariage.' },
              { num: '3', title: 'Validez', desc: 'Nous vous envoyons un aperçu personnalisé sous 48h.' },
              { num: '4', title: 'Partagez', desc: 'Recevez votre lien unique à partager à vos invités.' },
            ].map(s => (
              <div key={s.num} className="lp-step">
                <div className="lp-step-num">{s.num}</div>
                <h4 className="lp-step-title">{s.title}</h4>
                <p className="lp-step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="packs" className="lp-packs">
        <div className="lp-section-inner">
          <p className="lp-label">Nos formules</p>
          <h2 className="lp-h2">Trois packs, une seule promesse.</h2>
          <p className="lp-section-sub">Une expérience soignée, du brief à la livraison.</p>

          <div className="lp-packs-grid">
            {PACKS.map(p => (
              <div key={p.id} className={`lp-pack-card${p.highlight ? ' lp-pack-highlight' : ''}`}>
                {p.highlight && <div className="lp-pack-badge">Populaire</div>}
                <h3 className="lp-pack-name">{p.name}</h3>
                <p className="lp-pack-tagline">{p.tagline}</p>
                <div className="lp-pack-price">
                  <span className="lp-pack-num">{p.price}</span>
                  <span className="lp-pack-currency">{p.currency}</span>
                </div>
                <ul className="lp-pack-features">
                  {p.features.map((f, i) => (
                    <li key={i}>
                      <span className="lp-check">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/commander?pack=${p.id}`}
                  className={p.highlight ? 'lp-btn-primary' : 'lp-btn-outline'}
                >
                  Choisir {p.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-final-cta">
        <div className="lp-final-inner">
          <p className="lp-label" style={{ color: 'var(--pub-gold)' }}>Prêt(e) ?</p>
          <h2 className="lp-h2" style={{ color: '#fff' }}>Votre invitation vous attend.</h2>
          <p className="lp-section-sub" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Commencez par choisir un design. Le reste se fait avec nous.
          </p>
          <div className="lp-hero-ctas" style={{ justifyContent: 'center', marginTop: '32px' }}>
            <Link href="/templates" className="lp-btn-primary lp-btn-inverted">Voir les designs</Link>
            <Link href="/commander" className="lp-btn-ghost lp-btn-ghost-inverted">Commander →</Link>
          </div>
        </div>
      </section>
    </PublicShell>
  )
}

const CSS = `
  .lp-section-inner { max-width: 1180px; margin: 0 auto; padding: 0 28px; }
  .lp-label {
    font-size: 0.7rem; letter-spacing: 0.45em; text-transform: uppercase;
    color: var(--pub-gold); font-weight: 500; margin-bottom: 16px;
  }
  .lp-h2 {
    font-family: Georgia, serif; font-size: clamp(1.8rem, 4vw, 2.6rem);
    font-weight: 300; line-height: 1.2; margin-bottom: 14px;
  }
  .lp-section-sub {
    font-family: Georgia, serif; font-size: 1.05rem; font-style: italic;
    color: var(--pub-text-muted); max-width: 540px;
    margin: 0 auto 56px; line-height: 1.7;
  }
  .lp-center { text-align: center; margin-top: 48px; }

  .lp-hero {
    min-height: 78vh; padding: 80px 28px;
    display: flex; align-items: center; justify-content: center; text-align: center;
    background:
      radial-gradient(ellipse 60% 40% at 50% 30%, rgba(184,152,90,0.08) 0%, transparent 70%),
      #fff;
  }
  .lp-hero-inner { max-width: 720px; }
  .lp-hero-pre {
    font-size: 0.72rem; letter-spacing: 0.5em; text-transform: uppercase;
    color: var(--pub-gold); margin-bottom: 28px; font-weight: 500;
  }
  .lp-hero-title {
    font-family: Georgia, serif; font-size: clamp(2.6rem, 6vw, 4.4rem);
    font-weight: 200; line-height: 1.05; color: var(--pub-text);
    margin-bottom: 28px; letter-spacing: -0.01em;
  }
  .lp-hero-italic { font-style: italic; color: var(--pub-gold-dark); }
  .lp-hero-sub {
    font-family: Georgia, serif; font-size: 1.1rem; font-style: italic;
    color: var(--pub-text-muted); max-width: 540px;
    margin: 0 auto 40px; line-height: 1.7;
  }
  .lp-hero-ctas {
    display: flex; gap: 12px; justify-content: center;
    flex-wrap: wrap; margin-bottom: 40px;
  }
  .lp-hero-divider {
    width: 40px; height: 1px; background: var(--pub-gold); margin: 0 auto 16px;
  }
  .lp-hero-mini {
    font-size: 0.72rem; letter-spacing: 0.25em; text-transform: uppercase;
    color: var(--pub-text-subtle);
  }

  .lp-btn-primary, .lp-btn-outline, .lp-btn-ghost {
    display: inline-block; padding: 14px 32px;
    font-size: 0.75rem; letter-spacing: 0.3em;
    text-transform: uppercase; font-weight: 500;
    text-decoration: none; transition: all 0.2s;
    cursor: pointer; border: none; font-family: inherit;
  }
  .lp-btn-primary { background: var(--pub-text); color: #fff; }
  .lp-btn-primary:hover { opacity: 0.85; }
  .lp-btn-inverted { background: #fff; color: var(--pub-text); }
  .lp-btn-outline {
    background: transparent; color: var(--pub-text);
    border: 1px solid var(--pub-text);
  }
  .lp-btn-outline:hover { background: var(--pub-text); color: #fff; }
  .lp-btn-ghost {
    background: transparent; color: var(--pub-text);
    border: none; padding: 14px 16px;
  }
  .lp-btn-ghost:hover { color: var(--pub-gold-dark); }
  .lp-btn-ghost-inverted { color: #fff; }
  .lp-btn-ghost-inverted:hover { color: var(--pub-gold); }

  .lp-values { padding: 96px 0; border-top: 1px solid var(--pub-border); border-bottom: 1px solid var(--pub-border); }
  .lp-values-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 48px;
  }
  .lp-value-num {
    font-family: Georgia, serif; font-size: 0.85rem;
    color: var(--pub-gold); margin-bottom: 14px; letter-spacing: 0.1em;
  }
  .lp-value-title {
    font-family: Georgia, serif; font-size: 1.4rem;
    font-weight: 400; color: var(--pub-text); margin-bottom: 12px;
  }
  .lp-value-desc { color: var(--pub-text-muted); line-height: 1.7; font-size: 0.95rem; }

  .lp-templates { padding: 96px 0; text-align: center; }
  .lp-tpl-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 28px; margin-top: 24px; text-align: left;
  }
  .lp-tpl-card {
    display: flex; flex-direction: column; text-decoration: none;
    color: inherit; transition: transform 0.3s;
  }
  .lp-tpl-card:hover { transform: translateY(-4px); }
  .lp-tpl-visual {
    aspect-ratio: 3 / 4; position: relative;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden; transition: box-shadow 0.3s;
  }
  .lp-tpl-card:hover .lp-tpl-visual { box-shadow: 0 16px 40px rgba(0,0,0,0.08); }
  .lp-tpl-name-display { text-align: center; padding: 0 24px; }
  .lp-tpl-name-display span {
    font-family: Georgia, serif; font-size: 1.5rem;
    font-weight: 300; display: block;
  }
  .lp-tpl-line { width: 32px; height: 1px; margin: 10px auto; opacity: 0.6; }
  .lp-tpl-name-display small {
    font-size: 0.55rem; letter-spacing: 0.3em;
    text-transform: uppercase; opacity: 0.7;
  }
  .lp-tpl-palette { position: absolute; bottom: 12px; left: 12px; display: flex; gap: 4px; }
  .lp-tpl-swatch {
    width: 14px; height: 14px; border-radius: 50%;
    border: 1px solid rgba(0,0,0,0.06);
  }
  .lp-tpl-meta { padding: 16px 4px; }
  .lp-tpl-meta-name { font-family: Georgia, serif; font-size: 1.1rem; margin-bottom: 4px; }
  .lp-tpl-meta-desc { font-size: 0.85rem; color: var(--pub-text-muted); line-height: 1.5; }

  .lp-process { padding: 96px 0; background: var(--pub-bg-alt); text-align: center; }
  .lp-steps {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 36px; margin-top: 56px; text-align: center;
  }
  .lp-step-num {
    width: 48px; height: 48px; border: 1px solid var(--pub-gold);
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    margin: 0 auto 18px; font-family: Georgia, serif;
    font-size: 1.2rem; color: var(--pub-gold-dark);
  }
  .lp-step-title { font-family: Georgia, serif; font-size: 1.15rem; font-weight: 400; margin-bottom: 8px; }
  .lp-step-desc { font-size: 0.88rem; color: var(--pub-text-muted); line-height: 1.6; }

  .lp-packs { padding: 96px 0; text-align: center; }
  .lp-packs-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px; margin-top: 24px; text-align: left;
  }
  .lp-pack-card {
    background: #fff; border: 1px solid var(--pub-border);
    padding: 36px 28px; position: relative;
    display: flex; flex-direction: column; transition: border-color 0.2s;
  }
  .lp-pack-card:hover { border-color: var(--pub-text); }
  .lp-pack-highlight { border-color: var(--pub-text); background: #fafafa; }
  .lp-pack-badge {
    position: absolute; top: -10px; left: 50%; transform: translateX(-50%);
    padding: 4px 14px; background: var(--pub-text); color: #fff;
    font-size: 0.62rem; letter-spacing: 0.25em; text-transform: uppercase;
  }
  .lp-pack-name { font-family: Georgia, serif; font-size: 1.5rem; font-weight: 400; margin-bottom: 6px; }
  .lp-pack-tagline { font-size: 0.82rem; color: var(--pub-text-muted); font-style: italic; margin-bottom: 24px; }
  .lp-pack-price {
    display: flex; align-items: baseline; gap: 8px;
    margin-bottom: 28px; padding-bottom: 24px;
    border-bottom: 1px solid var(--pub-border);
  }
  .lp-pack-num { font-family: Georgia, serif; font-size: 3rem; font-weight: 300; line-height: 1; }
  .lp-pack-currency { font-size: 0.85rem; letter-spacing: 0.15em; color: var(--pub-text-muted); }
  .lp-pack-features { list-style: none; flex: 1; margin-bottom: 28px; }
  .lp-pack-features li {
    padding: 8px 0; font-size: 0.88rem; color: var(--pub-text);
    display: flex; gap: 10px; align-items: flex-start;
  }
  .lp-check { color: var(--pub-gold); flex-shrink: 0; }

  .lp-final-cta { background: var(--pub-text); padding: 120px 28px; text-align: center; }
  .lp-final-inner { max-width: 720px; margin: 0 auto; }

  @media (max-width: 640px) {
    .lp-hero { padding: 64px 24px; }
    .lp-values, .lp-templates, .lp-process, .lp-packs { padding: 72px 0; }
    .lp-final-cta { padding: 80px 24px; }
    .lp-section-inner { padding: 0 20px; }
  }
`