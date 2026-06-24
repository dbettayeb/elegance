'use client'

import { useEffect } from 'react'

export default function EditModeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Inject edit-mode visual hints
    const style = document.createElement('style')
    style.textContent = `
      [data-ef] {
        cursor: text; outline: none; min-width: 1ch;
        border-radius: 2px; transition: background 0.15s, box-shadow 0.15s;
      }
      [data-ef]:hover { box-shadow: 0 1px 0 rgba(184,152,90,0.5); }
      [data-ef]:focus { background: rgba(184,152,90,0.08); box-shadow: 0 2px 0 rgba(184,152,90,0.8); }
    `
    document.head.appendChild(style)

    // Floating hint — disappears after 3 s
    const hint = document.createElement('div')
    hint.textContent = '✏ Cliquez sur les prénoms pour les modifier'
    hint.style.cssText = [
      'position:fixed', 'bottom:24px', 'left:50%', 'transform:translateX(-50%)',
      'background:rgba(20,20,20,0.78)', 'color:#fff', 'padding:9px 20px',
      'border-radius:30px', 'font-size:13px', 'font-family:sans-serif',
      'letter-spacing:0.02em', 'z-index:9999', 'pointer-events:none',
      'transition:opacity 0.6s', 'opacity:1',
    ].join(';')
    document.body.appendChild(hint)
    const fadeTimer = setTimeout(() => { hint.style.opacity = '0' }, 2400)
    const removeTimer = setTimeout(() => hint.remove(), 3000)

    // Activate contenteditable on all [data-ef] elements
    const els = document.querySelectorAll<HTMLElement>('[data-ef]')
    els.forEach(el => {
      const field = el.dataset.ef!
      el.contentEditable = 'true'
      el.spellcheck = false
      el.setAttribute('autocorrect', 'off')
      el.setAttribute('autocomplete', 'off')
      el.dataset.efOriginal = el.textContent ?? ''

      const emit = () =>
        window.parent.postMessage(
          { type: 'EF_CHANGE', field, value: el.textContent?.trim() ?? '' },
          '*',
        )

      el.addEventListener('input', emit)

      el.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter') { e.preventDefault(); el.blur() }
        if (e.key === 'Escape') {
          el.textContent = el.dataset.efOriginal ?? ''
          el.blur()
        }
      })

      // Plain-text paste only
      el.addEventListener('paste', (e: ClipboardEvent) => {
        e.preventDefault()
        const text = e.clipboardData?.getData('text/plain') ?? ''
        document.execCommand('insertText', false, text)
      })
    })

    return () => {
      style.remove()
      clearTimeout(fadeTimer)
      clearTimeout(removeTimer)
      hint.remove()
    }
  }, [])

  return <>{children}</>
}
