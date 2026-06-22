import { notFound } from 'next/navigation'
import Link from 'next/link'
import { TEMPLATES } from '@/lib/templates'
import PublicShell from '@/components/public/PublicShell'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const template = TEMPLATES.find(t => t.id === id)
  if (!template) return { title: 'Design introuvable' }
  return {
    title: `${template.name} · Élégance Digitale`,
    description: template.description,
  }
}

export default async function PublicTemplatePreview({ params }: Props) {
  const { id } = await params
  const template = TEMPLATES.find(t => t.id === id)
  if (!template) notFound()

  return (
    <PublicShell>
      <style>{CSS}</style>

      <div className="ptp-bar">
        <div className="ptp-bar-inner">
          <Link href="/templates" className="ptp-back">← Tous les designs</Link>
          <div className="ptp-info">
            <span className="ptp-info-name">{template.name}</span>
            <span className="ptp-info-tag">Aperçu démo</span>
          </div>
          <Link href={`/commander?template=${template.id}`} className="ptp-cta">
            Choisir ce design →
          </Link>
        </div>
      </div>

      {/*
        The template renders inside an iframe so that position:fixed elements
        (opening screen, decorations) are relative to the iframe's own viewport —
        fully separated from the ptp-bar above. No CSS hacks required.
      */}
      <iframe
        src={`/templates/${template.id}/embed`}
        title={`Aperçu ${template.name}`}
        allow="autoplay"
        className="ptp-iframe"
      />
    </PublicShell>
  )
}

const CSS = `
  /* Constrain the whole shell to the viewport so the iframe fills exactly the remaining height */
  .pub-shell { height: 100vh !important; overflow: hidden !important; }
  .pub-header { display: none !important; }
  .pub-footer { display: none !important; }
  main { height: 100% !important; display: flex !important; flex-direction: column !important; }

  .ptp-bar {
    flex-shrink: 0;
    background: rgba(255,255,255,0.96);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--pub-border);
    z-index: 10;
  }
  .ptp-bar-inner {
    max-width: 1180px; margin: 0 auto; padding: 14px 28px;
    display: flex; align-items: center; justify-content: space-between; gap: 16px;
  }
  .ptp-back { color: var(--pub-text-muted); text-decoration: none; font-size: 0.82rem; }
  .ptp-back:hover { color: var(--pub-text); }
  .ptp-info { display: flex; align-items: center; gap: 12px; }
  .ptp-info-name { font-family: Georgia, serif; font-size: 1rem; }
  .ptp-info-tag {
    padding: 3px 9px; background: rgba(184,152,90,0.15);
    color: var(--pub-gold-dark); font-size: 0.66rem;
    letter-spacing: 0.2em; text-transform: uppercase; border-radius: 2px;
  }
  .ptp-cta {
    padding: 9px 20px; background: var(--pub-text); color: #fff;
    text-decoration: none; font-size: 0.72rem;
    letter-spacing: 0.2em; text-transform: uppercase;
    font-weight: 500; white-space: nowrap; transition: opacity 0.2s;
  }
  .ptp-cta:hover { opacity: 0.85; }

  /* iframe grows to fill all remaining height below the bar */
  .ptp-iframe {
    display: block;
    border: none;
    width: 100%;
    flex: 1;
    min-height: 0;
  }

  @media (max-width: 720px) {
    .ptp-info { display: none; }
    .ptp-bar-inner { padding: 12px 18px; }
    .ptp-cta { padding: 7px 14px; font-size: 0.66rem; }
  }
`
