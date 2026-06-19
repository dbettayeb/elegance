'use client'
import { useState, useEffect } from 'react'

interface Props {
  onOpen: () => void
  bgColor?: string
}

function buildCSS(bgColor: string) { return `
  #opening-screen {
    position: fixed;
    inset: 0;
    background: ${bgColor};
    z-index: 9999;
    overflow: hidden;
    transition: opacity 0.6s ease, visibility 0.6s ease;
  }
  #opening-screen.os-hidden {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }
  .opening-stage {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 1200px;
    height: 850px;
    cursor: pointer;
    --os-scale: 1;
    transform: translate(-50%, -50%) scale(var(--os-scale));
    transform-origin: center center;
  }
  .poly {
    position: absolute;
    pointer-events: none;
    transition: transform 2.5s ease, opacity 0.5s ease;
  }
  .poly-left  { top: -13px; left: 98px;  width: 467px; height: auto; z-index: 1; }
  .poly-right { top: -13px; left: 635px; width: 467px; height: auto; z-index: 1; }
  .poly-bot   { top: 271px; left: 95px;  width: 1011px; height: auto; z-index: 1; }
  .poly-top   { top: -6px;  left: 94px;  width: 1012px; height: auto; z-index: 2; }
  .opening-stage.os-animating .poly-left  { transform: translateX(-560px); opacity: 0; }
  .opening-stage.os-animating .poly-right { transform: translateX(560px);  opacity: 0; }
  .opening-stage.os-animating .poly-top   { transform: translateY(-430px); }
  .opening-stage.os-animating .poly-bot   { transform: translateY(566px); }
  .dove-btn {
    position: absolute;
    top: 318px; left: 515px;
    width: 170px; height: 170px;
    cursor: pointer;
    border: none; background: none; padding: 0;
    z-index: 3;
    transition: transform 1.5s ease, opacity 1.5s ease;
  }
  .dove-btn img { width: 100%; height: 100%; object-fit: contain; display: block; }
  .opening-stage.os-seal-out .dove-btn,
  .opening-stage.os-animating .dove-btn { transform: scale(1.22); opacity: 0; }
  .click-hint {
    position: absolute;
    top: 540px; left: 470px;
    width: 260px;
    text-align: center;
    color: #c9a96e;
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 20px;
    font-weight: 400;
    pointer-events: none;
    z-index: 1;
    transition: opacity 1.5s ease;
    white-space: nowrap;
  }
  .opening-stage.os-seal-out .click-hint,
  .opening-stage.os-animating .click-hint {
    opacity: 0;
    transition: opacity 0.3s ease;
  }
` }

export default function OpeningScreen({ onOpen, bgColor = '#100c08' }: Props) {
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0)

  useEffect(() => {
    function scaleOpening() {
      const stage = document.querySelector<HTMLElement>('.opening-stage')
      if (!stage) return
      const scale = (window.innerWidth >= 1200 && window.innerHeight >= 850)
        ? 1
        : Math.min(window.innerHeight / 580, window.innerWidth / 440, 1.5)
      stage.style.setProperty('--os-scale', scale.toFixed(4))
    }
    scaleOpening()
    window.addEventListener('resize', scaleOpening)
    return () => window.removeEventListener('resize', scaleOpening)
  }, [])

  function startSequence() {
    if (phase !== 0) return
    setPhase(1)
    setTimeout(() => setPhase(2), 1000)
    setTimeout(() => setPhase(3), 3500)
    setTimeout(() => onOpen(), 4100)
  }

  const stageClass = [
    'opening-stage',
    phase >= 1 ? 'os-seal-out' : '',
    phase >= 2 ? 'os-animating' : '',
  ].filter(Boolean).join(' ')

  return (
    <div id="opening-screen" className={phase >= 3 ? 'os-hidden' : ''}>
      <style>{buildCSS(bgColor)}</style>
      <div
        className={stageClass}
        onClick={startSequence}
        role="button"
        tabIndex={0}
        aria-label="Ouvrir l'invitation"
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') startSequence() }}
      >
        <img className="poly poly-left"  src="/assets/polygons/polygon-left.png"   alt="" />
        <img className="poly poly-right" src="/assets/polygons/polygon-right.png"  alt="" />
        <img className="poly poly-top"   src="/assets/polygons/polygon-top.png"    alt="" />
        <img className="poly poly-bot"   src="/assets/polygons/polygon-bottom.png" alt="" />
        <button className="dove-btn" tabIndex={-1} aria-hidden="true">
          <img src="/assets/dove/dove-open.webp" alt="" />
        </button>
        <span className="click-hint">Cliquez pour ouvrir</span>
      </div>
    </div>
  )
}
