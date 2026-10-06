'use client'

import { useEffect, useRef, useState } from 'react'

export function startInvitationMusic() {
  if (typeof document === 'undefined') return
  const audio = document.querySelector<HTMLAudioElement>('[data-invitation-music]')
  if (!audio || !audio.paused) return
  audio.play().catch(() => {})
}

export default function InvitationMusic({
  musicUrl,
  active,
  accentColor,
  playLabel,
  pauseLabel,
}: {
  musicUrl?: string | null
  active: boolean
  accentColor: string
  playLabel: string
  pauseLabel: string
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !musicUrl || !active) return

    let armed = true
    const start = (event?: Event) => {
      if (!armed) return
      const target = event?.target
      if (target instanceof Element && target.closest('.invitation-music')) return
      audio.play().then(() => {
        armed = false
        detach()
      }).catch(() => {})
    }
    const events = ['pointerdown', 'keydown', 'touchstart', 'scroll'] as const
    const detach = () => events.forEach(name => window.removeEventListener(name, start))

    start()
    events.forEach(name => window.addEventListener(name, start, { passive: true }))
    return () => { armed = false; detach() }
  }, [active, musicUrl])

  if (!musicUrl) return null

  function toggleMusic() {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    } else {
      audio.pause()
      setPlaying(false)
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        data-invitation-music
        loop
        preload="auto"
        src={musicUrl}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setPlaying(false)}
      />
      <button
        type="button"
        className={`invitation-music${active ? '' : ' invitation-music-hidden'}`}
        style={{ borderColor: accentColor, color: accentColor }}
        onClick={toggleMusic}
        aria-label={playing ? pauseLabel : playLabel}
        aria-pressed={playing}
      >
        {playing ? (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        )}
      </button>
      <style>{CSS}</style>
    </>
  )
}

const CSS = `
  .invitation-music {
    position: fixed;
    bottom: 20px;
    left: 20px;
    z-index: 9999;
    display: flex;
    width: 54px;
    height: 54px;
    align-items: center;
    justify-content: center;
    border: 1px solid;
    border-radius: 50%;
    background: rgba(18, 18, 18, 0.9);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
    cursor: pointer;
    opacity: 1;
    transition: opacity 0.25s ease, transform 0.25s ease;
  }
  .invitation-music:hover { transform: scale(1.06); }
  .invitation-music-hidden { opacity: 0; visibility: hidden; pointer-events: none; }
  .invitation-music svg { width: 20px; height: 20px; fill: currentColor; }
  @media (max-width: 640px) {
    .invitation-music { width: 46px; height: 46px; bottom: 14px; left: 14px; }
    .invitation-music svg { width: 17px; height: 17px; }
  }
`