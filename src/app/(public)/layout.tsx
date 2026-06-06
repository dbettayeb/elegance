import Link from 'next/link'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pub-shell">
      <style>{CSS}</style>

      <header className="pub-header">
        <div className="pub-header-inner">
          <Link href="/" className="pub-brand">
            <span className="pub-brand-mark">ED</span>
            <span className="pub-brand-name">Élégance Digitale</span>
          </Link>
          <nav className="pub-nav">
            <Link href="/templates" className="pub-nav-link">Designs</Link>
            <Link href="/#packs" className="pub-nav-link">Tarifs</Link>
            <Link href="/commander" className="pub-cta-mini">Commander</Link>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="pub-footer">
        <div className="pub-footer-inner">
          <div className="pub-footer-brand">
            <span className="pub-brand-mark">ED</span>
            <span>Élégance Digitale</span>
          </div>
          <p className="pub-footer-tagline">
            Invitations digitales de mariage haut de gamme · Tunisie
          </p>
          <div className="pub-footer-links">
            <Link href="/templates">Designs</Link>
            <Link href="/#packs">Tarifs</Link>
            <Link href="/commander">Commander</Link>
          </div>
          <p className="pub-footer-credit">
            © {new Date().getFullYear()} Élégance Digitale. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  )
}

const CSS = `
  :root {
    --pub-bg: #ffffff;
    --pub-bg-alt: #fafafa;
    --pub-text: #0a0a0a;
    --pub-text-muted: #6b6b6b;
    --pub-text-subtle: #a3a3a3;
    --pub-gold: #B8985A;
    --pub-gold-dark: #8C7042;
    --pub-border: #ececec;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    font-weight: 300;
    background: var(--pub-bg);
    color: var(--pub-text);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  .pub-shell { min-height: 100vh; display: flex; flex-direction: column; }
  main { flex: 1; }

  .pub-header {
    position: sticky; top: 0; z-index: 100;
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--pub-border);
  }
  .pub-header-inner {
    max-width: 1180px; margin: 0 auto; padding: 18px 28px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .pub-brand {
    display: flex; align-items: center; gap: 12px;
    text-decoration: none; color: var(--pub-text);
  }
  .pub-brand-mark {
    width: 32px; height: 32px;
    background: var(--pub-text); color: #fff;
    border-radius: 4px;
    display: flex; align-items: center; justify-content: center;
    font-weight: 600; font-size: 0.78rem; letter-spacing: 0.08em;
  }
  .pub-brand-name {
    font-family: Georgia, serif; font-size: 1.05rem;
    font-weight: 400; letter-spacing: 0.02em;
  }
  .pub-nav { display: flex; align-items: center; gap: 28px; }
  .pub-nav-link {
    color: var(--pub-text); text-decoration: none;
    font-size: 0.85rem; font-weight: 400; letter-spacing: 0.02em;
    transition: color 0.2s;
  }
  .pub-nav-link:hover { color: var(--pub-gold-dark); }
  .pub-cta-mini {
    padding: 9px 20px; background: var(--pub-text); color: #fff;
    text-decoration: none;
    font-size: 0.78rem; letter-spacing: 0.18em;
    text-transform: uppercase; font-weight: 500;
    transition: opacity 0.2s;
  }
  .pub-cta-mini:hover { opacity: 0.85; }

  .pub-footer {
    border-top: 1px solid var(--pub-border);
    padding: 64px 28px 32px; margin-top: 80px;
    background: var(--pub-bg-alt);
  }
  .pub-footer-inner { max-width: 1180px; margin: 0 auto; text-align: center; }
  .pub-footer-brand {
    display: inline-flex; align-items: center; gap: 12px;
    font-family: Georgia, serif; font-size: 1.1rem; margin-bottom: 12px;
  }
  .pub-footer-tagline {
    font-size: 0.9rem; color: var(--pub-text-muted);
    font-style: italic; margin-bottom: 28px;
  }
  .pub-footer-links {
    display: flex; justify-content: center; gap: 32px;
    margin-bottom: 36px; flex-wrap: wrap;
  }
  .pub-footer-links a {
    color: var(--pub-text); text-decoration: none;
    font-size: 0.82rem; letter-spacing: 0.05em;
  }
  .pub-footer-links a:hover { color: var(--pub-gold-dark); }
  .pub-footer-credit {
    font-size: 0.7rem; letter-spacing: 0.18em;
    text-transform: uppercase; color: var(--pub-text-subtle);
  }

  @media (max-width: 640px) {
    .pub-header-inner { padding: 14px 18px; }
    .pub-nav { gap: 16px; }
    .pub-nav-link { display: none; }
    .pub-cta-mini { padding: 7px 14px; font-size: 0.7rem; }
    .pub-footer { padding: 48px 20px 24px; margin-top: 48px; }
    .pub-footer-links { gap: 18px; }
  }
`