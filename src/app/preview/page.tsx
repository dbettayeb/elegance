'use client'

import { useState, useEffect } from 'react'
import { getTemplate } from '@/lib/templates'
import { Wedding } from '@/lib/types'

/**
 * Page de prévisualisation. Lit les données du formulaire stockées dans sessionStorage
 * sous la clé `__preview_wedding` puis rend le template correspondant.
 *
 * Cette page est utilisée par l'admin avant d'enregistrer une invitation, pour montrer
 * le rendu au client en temps réel.
 */
export default function PreviewPage() {
  const [wedding, setWedding] = useState<Wedding | null>(null)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    try {
      const raw = localStorage.getItem('__preview_wedding')
      if (!raw) {
        setError("Aucune donnée de prévisualisation trouvée. Reviens sur le formulaire de création et clique sur « Prévisualiser ».")
        return
      }

      const parsed = JSON.parse(raw)

      // Construit une date ISO à partir de event_date + event_time
      const buildDate = (): string => {
        if (parsed.event_date && parsed.event_time) {
          return `${parsed.event_date}T${parsed.event_time}:00`
        }
        if (parsed.event_date) {
          return `${parsed.event_date}T19:00:00`
        }
        // Fallback : 90 jours dans le futur
        return new Date(Date.now() + 90 * 86400000).toISOString()
      }

      const mock: Wedding = {
        id: 'preview',
        slug: 'preview',
        access_token: 'preview',
        couple_token: 'preview',
        couple_email: parsed.couple_email || 'preview@example.com',

        bride_name: parsed.bride_name || 'Mariée',
        groom_name: parsed.groom_name || 'Marié',
        bride_name_ar: parsed.bride_name_ar || undefined,
        groom_name_ar: parsed.groom_name_ar || undefined,
        bride_family_ar:        parsed.bride_family_ar        || undefined,
        groom_family_ar:        parsed.groom_family_ar        || undefined,
        bride_family_prefix_ar: parsed.bride_family_prefix_ar || undefined,
        groom_family_prefix_ar: parsed.groom_family_prefix_ar || undefined,
        families_intro_ar:      parsed.families_intro_ar      || undefined,

        event_date: buildDate(),
        venue_name: parsed.venue_name || 'Lieu de réception',
        venue_address: parsed.venue_address || undefined,
        gps_google: parsed.gps_google || undefined,
        gps_apple: parsed.gps_apple || undefined,

        template_id: (parsed.template_id || 'blanc_dore') as Wedding['template_id'],
        intro_text: parsed.intro_text || 'Vous êtes cordialement invités au mariage de',
        custom_message: parsed.custom_message || undefined,
        music_url: parsed.music_url || undefined,
        custom_font: parsed.custom_font || undefined,

        program: parsed.program || [],
        parties: parsed.parties || [],
        show_celebrations: parsed.show_celebrations ?? true,

        wedding_day_text: parsed.wedding_day_text || undefined,
        venue_photo:      parsed.venue_photo      || undefined,
        couple_photo:     parsed.couple_photo     || undefined,
        intro_video_url:  parsed.intro_video_url  || undefined,

        pack: (parsed.pack || 'essentiel') as Wedding['pack'],
        show_rsvp:       parsed.show_rsvp       ?? true,
        show_guestbook:  parsed.show_guestbook  ?? true,
        show_countdown:  parsed.show_countdown  ?? true,
        moderation_on:   parsed.moderation_on   ?? true,
        bismillah_palette: parsed.bismillah_palette || undefined,
        background_image:  parsed.background_image  || 'bg-texture.jpg',
        decoration_image:  parsed.decoration_image  || 'decoration.png',
        guest_invite_enabled:   parsed.guest_invite_enabled   ?? false,
        guest_invite_prefix_ar: parsed.guest_invite_prefix_ar || undefined,
        guest_invite_suffix_ar: parsed.guest_invite_suffix_ar || undefined,

        status: 'active',
        created_at: new Date().toISOString(),
      }

      setWedding(mock)
    } catch (e) {
      console.error(e)
      setError('Erreur lors de la lecture des données de prévisualisation.')
    }
  }, [])

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        textAlign: 'center',
        fontFamily: 'system-ui, sans-serif',
      }}>
        <div style={{ maxWidth: '480px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>👁</div>
          <h1 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>Prévisualisation indisponible</h1>
          <p style={{ color: '#666', lineHeight: 1.5 }}>{error}</p>
        </div>
      </div>
    )
  }

  if (!wedding) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
        color: '#666',
      }}>
        Chargement…
      </div>
    )
  }

  const template = getTemplate(wedding.template_id)
  const TemplateComponent = template.component

  return (
    <>
      {/* Bannière de prévisualisation */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.96)',
        color: '#fff',
        padding: '10px 20px',
        textAlign: 'center',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '0.82rem',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        backdropFilter: 'blur(8px)',
      }}>
        👁 Prévisualisation — Données du formulaire de création (non enregistrées)
      </div>

      {/* Spacer pour la bannière fixe */}
      <div style={{ height: '40px' }} />

      <TemplateComponent wedding={wedding} />
    </>
  )
}