'use client'
import { useState, useEffect } from 'react'
import { Wedding } from '@/lib/types'

export function useInvitationLogic(wedding: Wedding) {
  const isPreview = wedding.id === 'preview'

  const [opened, setOpened] = useState(false)
  const [visible, setVisible] = useState(false)
  const [countdown, setCountdown] = useState({ d: '000', h: '00', m: '00', s: '00' })
  const [rsvpStatus, setRsvpStatus] = useState<'idle' | 'loading' | 'done'>('idle')
  const [rsvpChoice, setRsvpChoice] = useState<'present' | 'absent' | 'maybe'>('present')
  const [gbStatus, setGbStatus] = useState<'idle' | 'loading' | 'done'>('idle')
  const [gbPending, setGbPending] = useState(false)
  const [messages, setMessages] = useState<{ id: string; author_name: string; message: string; created_at: string }[]>([])

  function openEnvelope() {
    setOpened(true)
    setTimeout(() => setVisible(true), 100)
  }

  // Countdown
  useEffect(() => {
    function tick() {
      const diff = new Date(wedding.event_date).getTime() - Date.now()
      if (diff <= 0) return
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setCountdown({
        d: String(d).padStart(3, '0'),
        h: String(h).padStart(2, '0'),
        m: String(m).padStart(2, '0'),
        s: String(s).padStart(2, '0'),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [wedding.event_date])

  // Load approved messages
  useEffect(() => {
    if (!visible || !wedding.show_guestbook) return
    if (isPreview) {
      // Données fictives pour la preview
      setMessages([
        {
          id: 'preview-1',
          author_name: 'Famille Ben Salah',
          message: 'Tous nos vœux de bonheur pour ce magnifique jour. Que votre vie commune soit remplie d\'amour et de joie.',
          created_at: new Date().toISOString(),
        },
        {
          id: 'preview-2',
          author_name: 'Sami & Leila',
          message: 'Quelle belle aventure commence ! Nous sommes si heureux pour vous deux.',
          created_at: new Date().toISOString(),
        },
        {
          id: 'preview-3',
          author_name: 'Karim',
          message: 'Félicitations aux mariés ! Hâte de partager ce moment avec vous.',
          created_at: new Date().toISOString(),
        },
      ])
      return
    }
    fetch(`/api/guestbook/list?wedding_id=${wedding.id}`)
      .then(r => r.json())
      .then(d => { if (d.messages) setMessages(d.messages) })
      .catch(() => {})
  }, [visible, wedding.id, wedding.show_guestbook, isPreview])

  async function submitRSVP(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (isPreview) {
      // En preview, simuler le succès sans appel API
      setRsvpStatus('loading')
      setTimeout(() => setRsvpStatus('done'), 600)
      return
    }
    setRsvpStatus('loading')
    const fd = new FormData(e.currentTarget)
    const res = await fetch('/api/rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wedding_id: wedding.id,
        name: fd.get('name'),
        phone: fd.get('phone'),
        status: rsvpChoice,
        guests: fd.get('guests'),
        note: fd.get('note'),
      }),
    })
    setRsvpStatus(res.ok ? 'done' : 'idle')
  }

  async function submitMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (isPreview) {
      setGbStatus('loading')
      setTimeout(() => {
        setGbStatus('done')
        setGbPending(wedding.moderation_on)
        ;(e.target as HTMLFormElement).reset()
      }, 600)
      return
    }
    setGbStatus('loading')
    const fd = new FormData(e.currentTarget)
    const res = await fetch('/api/guestbook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wedding_id: wedding.id,
        author_name: fd.get('author_name'),
        message: fd.get('message'),
      }),
    })
    const data = await res.json()
    if (res.ok) {
      setGbStatus('done')
      setGbPending(data.pending)
      ;(e.target as HTMLFormElement).reset()
    } else {
      setGbStatus('idle')
    }
  }

  const eventDate = new Date(wedding.event_date)

  return {
    opened, visible, openEnvelope,
    countdown,
    rsvpStatus, rsvpChoice, setRsvpChoice, submitRSVP,
    gbStatus, gbPending, messages, submitMessage,
    eventDate,
    introText: wedding.intro_text || 'Vous êtes cordialement invités au mariage de',
  }
}