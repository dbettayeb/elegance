import { notFound } from 'next/navigation'
import { createServiceSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'

interface Props {
  params: Promise<{ slug: string }>
}

export const dynamic = 'force-dynamic'

export default async function ArchivedWeddingPage({ params }: Props) {
  const { slug } = await params
  const supabase = createServiceSupabaseClient()

  const { data: wedding } = await supabase
    .from('weddings')
    .select('bride_name, groom_name, event_date, venue_name, status')
    .eq('slug', slug)
    .single()

  // Si le mariage n'existe pas, page générique
  if (!wedding) {
    return <GenericExpired />
  }

  // Si le mariage n'est pas archivé, on n'a rien à faire ici
  // (normalement le routing redirige déjà, mais sécurité)
  if (wedding.status !== 'archived') {
    notFound()
  }

  // Récupérer quelques messages approuvés du livre d'or pour témoigner
  const { data: messages } = await supabase
    .from('guestbook')
    .select('author_name, message')
    .eq('wedding_id', (await supabase.from('weddings').select('id').eq('slug', slug).single()).data?.id)
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .limit(3)

  // Récupérer le nombre de présents
  const { data: weddingId } = await supabase
    .from('weddings')
    .select('id')
    .eq('slug', slug)
    .single()

  let presentCount = 0
  if (weddingId) {
    const { data: rsvps } = await supabase
      .from('rsvps')
      .select('guests')
      .eq('wedding_id', weddingId.id)
      .eq('status', 'present')
    presentCount = (rsvps ?? []).reduce((acc, r) => acc + (r.guests || 0) + 1, 0)
  }

  const eventDate = new Date(wedding.event_date)
  const dateStr = eventDate.toLocaleDateString('fr-TN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  // Calcul du temps écoulé depuis le mariage
  const monthsAgo = Math.floor((Date.now() - eventDate.getTime()) / (30 * 24 * 60 * 60 * 1000))
  let timeAgo = ''
  if (monthsAgo < 1) timeAgo = 'récemment'
  else if (monthsAgo < 12) timeAgo = `il y a ${monthsAgo} mois`
  else {
    const years = Math.floor(monthsAgo / 12)
    timeAgo = years === 1 ? 'il y a un an' : `il y a ${years} ans`
  }

  const approvedMessages = messages ?? []

  return (
    <>
      <style>{CSS}</style>

      <main className="ar-shell">
        {/* Particules décoratives */}
        <div className="ar-particles">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="ar-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${4 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        <div className="ar-content">
          {/* Ornement supérieur */}
          <div className="ar-orn-top">
            <svg viewBox="0 0 80 30" preserveAspectRatio="none">
              <path d="M0 15 Q20 5 40 15 T80 15" fill="none" stroke="#B8985A" strokeWidth="0.8" opacity="0.6"/>
              <circle cx="40" cy="15" r="3" fill="#B8985A" opacity="0.9"/>
              <circle cx="40" cy="15" r="6" fill="none" stroke="#B8985A" strokeWidth="0.4" opacity="0.4"/>
            </svg>
          </div>

          <p className="ar-label">Souvenirs précieux</p>

          {/* Noms des mariés */}
          <h1 className="ar-names">
            <span className="ar-name">{wedding.bride_name}</span>
            <span className="ar-amp">&</span>
            <span className="ar-name">{wedding.groom_name}</span>
          </h1>

          {/* Date */}
          <div className="ar-date-wrap">
            <div className="ar-date-line"></div>
            <p className="ar-date">{dateStr}</p>
            <div className="ar-date-line"></div>
          </div>

          {/* Message principal */}
          <p className="ar-message">
            Cette belle journée appartient désormais
            <br />
            aux souvenirs précieux du cœur.
          </p>

          {/* Stats commémoratives */}
          <div className="ar-stats">
            {wedding.venue_name && (
              <div className="ar-stat">
                <div className="ar-stat-icon">✦</div>
                <div className="ar-stat-label">Célébré à</div>
                <div className="ar-stat-value">{wedding.venue_name}</div>
              </div>
            )}
            {presentCount > 0 && (
              <div className="ar-stat">
                <div className="ar-stat-icon">♡</div>
                <div className="ar-stat-label">Invités présents</div>
                <div className="ar-stat-value">{presentCount}</div>
              </div>
            )}
            <div className="ar-stat">
              <div className="ar-stat-icon">⌛</div>
              <div className="ar-stat-label">Marié{wedding.bride_name && 's'}</div>
              <div className="ar-stat-value">{timeAgo}</div>
            </div>
          </div>

          {/* Témoignages du livre d'or */}
          {approvedMessages.length > 0 && (
            <div className="ar-testimonials">
              <p className="ar-testimonials-title">Mots des invités</p>
              <div className="ar-msgs">
                {approvedMessages.map((msg, i) => (
                  <div key={i} className="ar-msg">
                    <div className="ar-msg-quote">"</div>
                    <p className="ar-msg-text">{msg.message}</p>
                    <p className="ar-msg-author">— {msg.author_name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Citation finale */}
          <div className="ar-quote">
            <p>
              « L'amour ne se voit pas avec les yeux,
              <br />mais avec l'âme. »
            </p>
          </div>

          {/* Ornement inférieur */}
          <div className="ar-orn-bottom">
            <svg viewBox="0 0 80 30" preserveAspectRatio="none">
              <path d="M0 15 Q20 25 40 15 T80 15" fill="none" stroke="#B8985A" strokeWidth="0.8" opacity="0.6"/>
              <circle cx="40" cy="15" r="3" fill="#B8985A" opacity="0.9"/>
              <circle cx="40" cy="15" r="6" fill="none" stroke="#B8985A" strokeWidth="0.4" opacity="0.4"/>
            </svg>
          </div>

          {/* Footer Élégance Digitale */}
          <div className="ar-footer">
            <p className="ar-footer-text">
              Cette invitation a été créée avec
            </p>
            <div className="ar-footer-brand">Élégance Digitale</div>
            <p className="ar-footer-tagline">
              Invitations digitales de mariage haut de gamme
            </p>
            <Link href="/" className="ar-footer-link">
              Découvrir nos créations →
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}

// ─── Fallback générique si le mariage n'existe pas ───
function GenericExpired() {
  return (
    <>
      <style>{CSS}</style>
      <main className="ar-shell">
        <div className="ar-content" style={{ paddingTop: '120px' }}>
          <p className="ar-label">Invitation introuvable</p>
          <h1 className="ar-names" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
            ✦
          </h1>
          <p className="ar-message">
            Cette invitation n'existe pas ou n'est plus disponible.
          </p>
          <div className="ar-footer">
            <Link href="/" className="ar-footer-link">
              Élégance Digitale →
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}

const CSS = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

  body {
    font-family: 'Montserrat', -apple-system, sans-serif;
    margin: 0;
  }

  .ar-shell {
    min-height: 100vh;
    background:
      radial-gradient(ellipse at 20% 30%, rgba(184, 152, 90, 0.08) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 70%, rgba(184, 152, 90, 0.06) 0%, transparent 50%),
      linear-gradient(180deg, #fcfaf5 0%, #f5efe2 100%);
    position: relative;
    overflow: hidden;
    padding: 60px 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Particules animées */
  .ar-particles {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }
  .ar-particle {
    position: absolute;
    width: 3px;
    height: 3px;
    background: #B8985A;
    border-radius: 50%;
    opacity: 0.3;
    animation: arFloat 6s ease-in-out infinite;
    box-shadow: 0 0 4px rgba(184, 152, 90, 0.4);
  }
  @keyframes arFloat {
    0%, 100% { transform: translateY(0) scale(1); opacity: 0.2; }
    50% { transform: translateY(-20px) scale(1.3); opacity: 0.6; }
  }

  /* Contenu central */
  .ar-content {
    position: relative;
    z-index: 1;
    max-width: 620px;
    width: 100%;
    text-align: center;
    animation: arFadeIn 1.5s ease-out;
  }

  @keyframes arFadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: none; }
  }

  /* Ornements */
  .ar-orn-top, .ar-orn-bottom {
    width: 200px;
    height: 30px;
    margin: 0 auto 32px;
  }
  .ar-orn-top svg, .ar-orn-bottom svg {
    width: 100%;
    height: 100%;
  }
  .ar-orn-bottom {
    margin: 48px auto 32px;
  }

  /* Label */
  .ar-label {
    font-size: 0.65rem;
    letter-spacing: 0.5em;
    text-transform: uppercase;
    color: #B8985A;
    margin-bottom: 24px;
    font-weight: 500;
  }

  /* Noms */
  .ar-names {
    font-family: 'Great Vibes', Georgia, serif;
    font-size: clamp(3rem, 9vw, 5.5rem);
    font-weight: 400;
    color: #3D2E18;
    line-height: 1;
    margin: 0 0 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
  .ar-name {
    display: block;
  }
  .ar-amp {
    color: #B8985A;
    font-size: clamp(1.8rem, 5vw, 3rem);
    line-height: 0.9;
  }

  /* Date avec lignes décoratives */
  .ar-date-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-bottom: 32px;
  }
  .ar-date-line {
    flex: 1;
    max-width: 60px;
    height: 1px;
    background: linear-gradient(90deg, transparent, #B8985A, transparent);
  }
  .ar-date {
    font-family: Georgia, serif;
    font-size: 0.95rem;
    font-style: italic;
    color: #6B5A3E;
    text-transform: capitalize;
    letter-spacing: 0.05em;
  }

  /* Message principal */
  .ar-message {
    font-family: Georgia, serif;
    font-size: clamp(1.1rem, 2.5vw, 1.4rem);
    font-style: italic;
    color: #4A3E2A;
    line-height: 1.8;
    margin-bottom: 48px;
  }

  /* Stats */
  .ar-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 20px;
    margin-bottom: 48px;
    padding: 28px 20px;
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(184, 152, 90, 0.2);
    border-radius: 2px;
    position: relative;
  }
  .ar-stats::before, .ar-stats::after {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    border: 1px solid #B8985A;
  }
  .ar-stats::before {
    top: -1px; left: -1px;
    border-right: none;
    border-bottom: none;
  }
  .ar-stats::after {
    bottom: -1px; right: -1px;
    border-left: none;
    border-top: none;
  }
  .ar-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }
  .ar-stat-icon {
    color: #B8985A;
    font-size: 1.2rem;
    margin-bottom: 4px;
  }
  .ar-stat-label {
    font-size: 0.6rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: #9B8A6E;
    font-weight: 500;
  }
  .ar-stat-value {
    font-family: Georgia, serif;
    font-size: 1.05rem;
    color: #3D2E18;
    font-weight: 400;
  }

  /* Témoignages */
  .ar-testimonials {
    margin-bottom: 32px;
    padding: 0 8px;
  }
  .ar-testimonials-title {
    font-size: 0.62rem;
    letter-spacing: 0.45em;
    text-transform: uppercase;
    color: #B8985A;
    margin-bottom: 24px;
    font-weight: 500;
  }
  .ar-msgs {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  .ar-msg {
    background: rgba(255, 255, 255, 0.6);
    border-left: 2px solid #B8985A;
    padding: 16px 20px;
    text-align: left;
    position: relative;
  }
  .ar-msg-quote {
    position: absolute;
    top: -8px;
    left: 12px;
    font-family: Georgia, serif;
    font-size: 2.5rem;
    color: #B8985A;
    line-height: 1;
    opacity: 0.5;
  }
  .ar-msg-text {
    font-family: Georgia, serif;
    font-size: 0.95rem;
    font-style: italic;
    color: #4A3E2A;
    line-height: 1.6;
    margin-bottom: 6px;
  }
  .ar-msg-author {
    font-size: 0.7rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #B8985A;
    font-weight: 500;
  }

  /* Citation */
  .ar-quote {
    margin: 0 0 32px;
  }
  .ar-quote p {
    font-family: 'Great Vibes', Georgia, serif;
    font-size: clamp(1.2rem, 3vw, 1.6rem);
    color: #6B5A3E;
    line-height: 1.4;
    font-style: italic;
  }

  /* Footer */
  .ar-footer {
    margin-top: 48px;
    padding-top: 32px;
    border-top: 1px solid rgba(184, 152, 90, 0.2);
  }
  .ar-footer-text {
    font-size: 0.72rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #9B8A6E;
    margin-bottom: 6px;
  }
  .ar-footer-brand {
    font-family: Georgia, serif;
    font-size: 1.4rem;
    font-weight: 300;
    color: #3D2E18;
    margin-bottom: 6px;
    letter-spacing: 0.02em;
  }
  .ar-footer-tagline {
    font-size: 0.75rem;
    font-style: italic;
    color: #9B8A6E;
    margin-bottom: 16px;
  }
  .ar-footer-link {
    display: inline-block;
    padding: 8px 24px;
    color: #B8985A;
    text-decoration: none;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    font-weight: 500;
    border: 1px solid #B8985A;
    border-radius: 2px;
    transition: all 0.3s;
  }
  .ar-footer-link:hover {
    background: #B8985A;
    color: #fff;
  }

  @media (max-width: 480px) {
    .ar-stats {
      grid-template-columns: 1fr;
      gap: 16px;
    }
    .ar-date-wrap {
      flex-direction: column;
      gap: 8px;
    }
    .ar-date-line {
      max-width: 80px;
    }
  }
`