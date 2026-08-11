'use client'
import { useMemo, useState } from 'react'
import { Wedding } from '@/lib/types'
import { buildIcs, buildGoogleCalendarUrl, icsFileName } from '@/lib/calendar'

/**
 * "Add to my calendar" for the RSVP section.
 *
 * Colours are deliberately inherited (currentColor) so the button sits well in
 * every template, light or dark, without each one needing its own rule.
 */
export default function AddToCalendar({ wedding }: { wedding: Wedding }) {
  const [open, setOpen] = useState(false)

  // Preview and catalog rows never hit the database, so the .ics is built in
  // the browser instead of through the API route.
  const isPreview = wedding.id === 'preview' || wedding.id === 'catalog'

  const icsHref = useMemo(() => {
    if (!isPreview) return `/api/calendar?wedding_id=${encodeURIComponent(wedding.id)}`
    return `data:text/calendar;charset=utf-8,${encodeURIComponent(buildIcs(wedding))}`
  }, [wedding, isPreview])

  const googleHref = useMemo(() => buildGoogleCalendarUrl(wedding), [wedding])

  return (
    <div className="adc-wrap">
      <style>{CSS}</style>

      <button type="button" className="adc-trigger" onClick={() => setOpen(v => !v)}>
        <svg className="adc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4M16 3v4" />
        </svg>
        Ajouter à mon calendrier
      </button>

      {open && (
        <div className="adc-options">
          <a className="adc-option" href={icsHref} download={icsFileName(wedding)}>
            Apple / Outlook
          </a>
          <a className="adc-option" href={googleHref} target="_blank" rel="noopener noreferrer">
            Google Agenda
          </a>
        </div>
      )}
    </div>
  )
}

const CSS = `
.adc-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 22px;
}
.adc-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 11px 22px;
  background: transparent;
  border: 1px solid currentColor;
  border-radius: 2px;
  color: inherit;
  font: inherit;
  font-size: 12px;
  letter-spacing: 1.6px;
  text-transform: uppercase;
  opacity: 0.75;
  cursor: pointer;
  transition: opacity 0.25s ease;
}
.adc-trigger:hover { opacity: 1; }
.adc-icon {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}
.adc-options {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}
.adc-option {
  padding: 9px 18px;
  border: 1px solid currentColor;
  border-radius: 2px;
  color: inherit;
  font-size: 11px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  text-decoration: none;
  opacity: 0.6;
  transition: opacity 0.25s ease;
}
.adc-option:hover { opacity: 1; }
`
