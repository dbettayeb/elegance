import type { CSSProperties } from 'react'

export default function CouplePhotoReveal({
  photoUrl,
  fadeSeconds = 4,
  active,
  desktopWidth = '100vw',
}: {
  photoUrl?: string | null
  fadeSeconds?: number
  active: boolean
  desktopWidth?: string
}) {
  const src = photoUrl?.trim()
  if (!src) return null

  const duration = Number.isFinite(fadeSeconds)
    ? Math.min(15, Math.max(1, Math.round(fadeSeconds)))
    : 4

  return (
    <>
      <style>{CSS}</style>
      <div
        className={`couple-photo-reveal${active ? ' couple-photo-reveal-active' : ''}`}
        style={{
          animationDuration: `${duration}s`,
          '--couple-reveal-width': desktopWidth,
        } as CSSProperties}
        aria-hidden="true"
      >
        <img src={src} alt="" />
      </div>
    </>
  )
}

const CSS = `
  .couple-photo-reveal {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    height: 100dvh;
    z-index: 10000;
    overflow: hidden;
    background: #f8f4eb;
    pointer-events: none;
    opacity: 0;
    visibility: hidden;
  }
  .couple-photo-reveal-active {
    visibility: visible;
    animation-name: couple-photo-reveal-fade;
    animation-timing-function: ease-in-out;
    animation-fill-mode: forwards;
  }
  .couple-photo-reveal img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  @media (min-width: 769px) {
    .couple-photo-reveal {
      inset-inline: auto;
      left: 50%;
      width: min(var(--couple-reveal-width), 100vw);
      height: 100vh;
      transform: translateX(-50%);
    }
  }
  @keyframes couple-photo-reveal-fade {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  @media (prefers-reduced-motion: reduce) {
    .couple-photo-reveal { animation-duration: 1ms !important; }
  }
`