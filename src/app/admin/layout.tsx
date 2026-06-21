import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')?.value

  if (!session || session !== process.env.ADMIN_SESSION_SECRET) {
    redirect('/admin/login')
  }

  return (
    <div className="admin-shell">
      <style>{ADMIN_CSS}</style>

      {/* Mobile top bar */}
      <div className="admin-mobile-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="admin-brand-logo" style={{ width: 30, height: 30, fontSize: '0.75rem' }}>ED</div>
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Admin</span>
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <Link href="/admin" className="admin-mobile-link">Dashboard</Link>
          <Link href="/admin/new" className="admin-mobile-link">+ Nouveau</Link>
          <form action="/api/admin/logout" method="POST" style={{ margin: 0 }}>
            <button type="submit" className="admin-mobile-link admin-mobile-link-muted">Déco.</button>
          </form>
        </div>
      </div>

      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-logo">ED</div>
          <div>
            <div className="admin-brand-title">Élégance Digitale</div>
            <div className="admin-brand-sub">Administration</div>
          </div>
        </div>

        <nav className="admin-nav">
          <Link href="/admin" className="admin-nav-item">
            <span className="admin-nav-icon">⬚</span>
            Tableau de bord
          </Link>
          <Link href="/admin/new" className="admin-nav-item">
            <span className="admin-nav-icon">+</span>
            Nouveau mariage
          </Link>
          <Link href="/admin/templates" className="admin-nav-item">
            <span className="admin-nav-icon">▦</span>
            Catalogue templates
          </Link>
        </nav>

        <div className="admin-sidebar-footer">
          <form action="/api/admin/logout" method="POST">
            <button type="submit" className="admin-logout">
              Déconnexion
            </button>
          </form>
        </div>
      </aside>

      <main className="admin-main">{children}</main>
    </div>
  )
}

const ADMIN_CSS = `
  :root {
    --admin-bg: #fafafa;
    --admin-surface: #ffffff;
    --admin-border: #e5e5e5;
    --admin-border-strong: #d4d4d4;
    --admin-text: #171717;
    --admin-text-muted: #737373;
    --admin-text-subtle: #a3a3a3;
    --admin-accent: #2563eb;
    --admin-accent-hover: #1d4ed8;
    --admin-success: #16a34a;
    --admin-warning: #ca8a04;
    --admin-danger: #dc2626;
    --admin-radius: 6px;
  }

  .admin-shell {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 240px 1fr;
    background: var(--admin-bg);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: var(--admin-text);
  }

  .admin-sidebar {
    background: var(--admin-surface);
    border-right: 1px solid var(--admin-border);
    display: flex;
    flex-direction: column;
    padding: 20px 0;
  }

  .admin-brand {
    padding: 0 20px 24px;
    border-bottom: 1px solid var(--admin-border);
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }

  .admin-brand-logo {
    width: 36px;
    height: 36px;
    background: var(--admin-text);
    color: white;
    border-radius: var(--admin-radius);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.85rem;
    letter-spacing: 0.05em;
  }

  .admin-brand-title {
    font-size: 0.88rem;
    font-weight: 600;
  }

  .admin-brand-sub {
    font-size: 0.72rem;
    color: var(--admin-text-muted);
    margin-top: 2px;
  }

  .admin-nav {
    display: flex;
    flex-direction: column;
    padding: 0 12px;
    gap: 2px;
    flex: 1;
  }

  .admin-nav-item {
    padding: 9px 12px;
    text-decoration: none;
    color: var(--admin-text);
    border-radius: var(--admin-radius);
    font-size: 0.88rem;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: background 0.15s;
  }

  .admin-nav-item:hover {
    background: #f5f5f5;
  }

  .admin-nav-item.active {
    background: #f0f0f0;
    font-weight: 500;
  }

  .admin-nav-icon {
    width: 18px;
    text-align: center;
    color: var(--admin-text-muted);
    font-size: 0.9rem;
  }

  .admin-sidebar-footer {
    padding: 16px 20px 0;
    border-top: 1px solid var(--admin-border);
  }

  .admin-logout {
    width: 100%;
    padding: 8px 12px;
    background: transparent;
    border: 1px solid var(--admin-border);
    border-radius: var(--admin-radius);
    color: var(--admin-text-muted);
    font-size: 0.82rem;
    cursor: pointer;
    transition: all 0.15s;
  }

  .admin-logout:hover {
    background: #f5f5f5;
    color: var(--admin-text);
  }

  .admin-main {
    padding: 32px 40px;
    overflow-y: auto;
  }

  /* Shared admin components */
  .admin-page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--admin-border);
  }

  .admin-page-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
  }

  .admin-page-subtitle {
    font-size: 0.85rem;
    color: var(--admin-text-muted);
    margin-top: 4px;
  }

  .admin-btn {
    padding: 9px 16px;
    background: var(--admin-text);
    color: white;
    border: none;
    border-radius: var(--admin-radius);
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: opacity 0.15s;
  }

  .admin-btn:hover { opacity: 0.85; }
  .admin-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .admin-btn-secondary {
    background: var(--admin-surface);
    color: var(--admin-text);
    border: 1px solid var(--admin-border-strong);
  }

  .admin-btn-secondary:hover {
    background: #f5f5f5;
    opacity: 1;
  }

  .admin-btn-danger {
    background: var(--admin-danger);
  }

  .admin-card {
    background: var(--admin-surface);
    border: 1px solid var(--admin-border);
    border-radius: var(--admin-radius);
    padding: 20px;
  }

  .admin-input,
  .admin-textarea,
  .admin-select {
    width: 100%;
    padding: 9px 12px;
    border: 1px solid var(--admin-border-strong);
    border-radius: var(--admin-radius);
    font-size: 0.9rem;
    background: var(--admin-surface);
    color: var(--admin-text);
    font-family: inherit;
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  .admin-input:focus,
  .admin-textarea:focus,
  .admin-select:focus {
    outline: none;
    border-color: var(--admin-accent);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  .admin-label {
    display: block;
    font-size: 0.82rem;
    font-weight: 500;
    margin-bottom: 6px;
    color: var(--admin-text);
  }

  .admin-help {
    font-size: 0.78rem;
    color: var(--admin-text-muted);
    margin-top: 4px;
  }

  .admin-table {
    width: 100%;
    border-collapse: collapse;
    background: var(--admin-surface);
    border: 1px solid var(--admin-border);
    border-radius: var(--admin-radius);
    overflow: hidden;
  }

  .admin-table th {
    text-align: left;
    padding: 10px 14px;
    background: #fafafa;
    border-bottom: 1px solid var(--admin-border);
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--admin-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .admin-table td {
    padding: 12px 14px;
    border-bottom: 1px solid var(--admin-border);
    font-size: 0.88rem;
  }

  .admin-table tr:last-child td {
    border-bottom: none;
  }

  .admin-table tr:hover {
    background: #fafafa;
  }

  .admin-badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.72rem;
    font-weight: 500;
  }

  .admin-badge-success {
    background: #dcfce7;
    color: #166534;
  }

  .admin-badge-warning {
    background: #fef3c7;
    color: #854d0e;
  }

  .admin-badge-danger {
    background: #fee2e2;
    color: #991b1b;
  }

  .admin-badge-neutral {
    background: #f3f4f6;
    color: #374151;
  }

  .admin-mobile-bar {
    display: none;
    background: var(--admin-surface);
    border-bottom: 1px solid var(--admin-border);
    padding: 10px 16px;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .admin-mobile-link {
    padding: 6px 10px;
    font-size: 0.78rem;
    font-weight: 500;
    color: var(--admin-text);
    text-decoration: none;
    background: #f5f5f5;
    border: 1px solid var(--admin-border);
    border-radius: var(--admin-radius);
    cursor: pointer;
    font-family: inherit;
  }

  .admin-mobile-link-muted {
    color: var(--admin-text-muted);
    background: transparent;
  }

  @media (max-width: 768px) {
    .admin-shell {
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr;
    }
    .admin-mobile-bar {
      display: flex;
    }
    .admin-sidebar {
      display: none;
    }
    .admin-main {
      padding: 16px;
    }
    .admin-page-header {
      flex-wrap: wrap;
      gap: 10px;
    }
    .admin-table th,
    .admin-table td {
      padding: 10px 10px;
      font-size: 0.82rem;
    }
  }
`