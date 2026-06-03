import { createServiceSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = createServiceSupabaseClient()

  const { data: weddings } = await supabase
    .from('weddings')
    .select('id, slug, bride_name, groom_name, event_date, status, pack, access_token')
    .order('created_at', { ascending: false })

  const all = weddings ?? []

  return (
    <main style={{ minHeight: '100vh', background: '#FAF7F0', fontFamily: 'Montserrat, sans-serif' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1108, #2C2416)',
        padding: '32px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '16px',
      }}>
        <div>
          <h1 style={{
            fontFamily: 'Georgia, serif', fontSize: '1.5rem',
            fontWeight: 300, color: '#FAF7F0',
          }}>
            ⬡ Administration
          </h1>
          <p style={{ fontSize: '0.6rem', letterSpacing: '0.25em', color: '#9B8A6E', marginTop: '4px' }}>
            {all.length} mariage{all.length > 1 ? 's' : ''} enregistré{all.length > 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/admin/new" style={{
          padding: '12px 24px',
          background: 'linear-gradient(135deg, #8B6914, #C9A84C)',
          color: '#fff', textDecoration: 'none',
          fontSize: '0.62rem', letterSpacing: '0.25em',
          textTransform: 'uppercase',
        }}>
          + Nouveau mariage
        </Link>
      </div>

      {/* Liste */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 20px' }}>
        {all.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px 24px',
            color: '#9B8A6E', fontStyle: 'italic', fontFamily: 'Georgia, serif',
          }}>
            Aucun mariage enregistré. Créez le premier !
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {all.map(w => {
              const date = new Date(w.event_date).toLocaleDateString('fr-TN', {
                day: 'numeric', month: 'long', year: 'numeric',
              })
              const inviteUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/i/${w.slug}?t=${w.access_token}`

              return (
                <div key={w.id} style={{
                  background: '#fff',
                  border: '1px solid rgba(201,168,76,0.2)',
                  borderLeft: `4px solid ${w.status === 'active' ? '#C9A84C' : '#ccc'}`,
                  padding: '20px 24px',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
                }}>
                  <div>
                    <div style={{
                      fontFamily: 'Georgia, serif', fontSize: '1.1rem',
                      color: '#2C2416', marginBottom: '4px',
                    }}>
                      {w.bride_name} & {w.groom_name}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#9B8A6E', letterSpacing: '0.1em' }}>
                      {date} · Pack {w.pack}
                    </div>
                    <div style={{ fontSize: '0.6rem', color: '#C9A84C', marginTop: '4px', wordBreak: 'break-all' }}>
                      {inviteUrl}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      padding: '4px 12px', borderRadius: '20px', fontSize: '0.58rem',
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      background: w.status === 'active' ? '#d4edda' : '#f8d7da',
                      color: w.status === 'active' ? '#155724' : '#721c24',
                    }}>
                      {w.status}
                    </span>
                    <Link href={`/couple/${w.slug}`} style={btnStyle('#6B5A3E')}>
                      Portail mariés
                    </Link>
                    <Link href={`/admin/${w.id}`} style={btnStyle('#8B6914')}>
                      Gérer
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

function btnStyle(color: string): React.CSSProperties {
  return {
    padding: '8px 16px',
    background: 'transparent',
    border: `1px solid ${color}`,
    color, textDecoration: 'none',
    fontSize: '0.58rem', letterSpacing: '0.15em',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  }
}