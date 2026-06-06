import { NextRequest, NextResponse } from 'next/server'
import { createServiceSupabaseClient } from '@/lib/supabase/server'
import { generateAccessToken } from '@/lib/tokens'
import { sanitizeName, sanitizeText, sanitizePhone } from '@/lib/sanitize'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      template_id, pack,
      bride_name, groom_name,
      bride_name_ar, groom_name_ar,
      couple_email, couple_phone,
      event_date,
      venue_name,
      custom_message,
    } = body

    if (!template_id || !pack || !bride_name || !groom_name || !couple_email || !couple_phone || !event_date) {
      return NextResponse.json({ error: 'Champs obligatoires manquants.' }, { status: 400 })
    }

    const supabase = createServiceSupabaseClient()

    const baseSlug = `${bride_name}-${groom_name}`
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    const slug = `${baseSlug}-${Date.now().toString().slice(-5)}`
    const access_token = generateAccessToken(8)
    const couple_token = generateAccessToken(8)
    const datetime = `${event_date}T19:00:00`

    const { data: wedding, error } = await supabase
      .from('weddings')
      .insert({
        slug,
        access_token,
        couple_token,
        status: 'lead',
        couple_email: sanitizeText(couple_email, 120),
        couple_phone: sanitizePhone(couple_phone),
        bride_name: sanitizeName(bride_name),
        groom_name: sanitizeName(groom_name),
        bride_name_ar: bride_name_ar ? sanitizeName(bride_name_ar) : null,
        groom_name_ar: groom_name_ar ? sanitizeName(groom_name_ar) : null,
        event_date: datetime,
        venue_name: venue_name ? sanitizeText(venue_name, 120) : 'À confirmer',
        template_id,
        pack,
        intro_text: 'Vous êtes cordialement invités au mariage de',
        custom_message: custom_message ? sanitizeText(custom_message, 500) : null,
        show_rsvp: true,
        show_guestbook: true,
        moderation_on: true,
        program: [],
      })
      .select('id, slug')
      .single()

    if (error) {
      console.error('[ORDER]', error)
      return NextResponse.json({ error: 'Impossible d\'enregistrer la demande.' }, { status: 500 })
    }

    const reference = `ED-${wedding.id.slice(0, 8).toUpperCase()}`

    // Notification email admin (best effort)
    try {
      if (process.env.RESEND_API_KEY && process.env.ADMIN_NOTIFY_EMAIL) {
        const { Resend } = await import('resend')
        const resend = new Resend(process.env.RESEND_API_KEY)
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL ?? 'no-reply@elegance-digitale.com',
          to: process.env.ADMIN_NOTIFY_EMAIL,
          subject: `🎉 Nouvelle demande : ${bride_name} & ${groom_name}`,
          html: `
            <h2>Nouvelle demande d'invitation</h2>
            <p><strong>Référence :</strong> ${reference}</p>
            <p><strong>Couple :</strong> ${bride_name} & ${groom_name}</p>
            <p><strong>Email :</strong> ${couple_email}</p>
            <p><strong>Téléphone :</strong> ${couple_phone}</p>
            <p><strong>Date :</strong> ${event_date}</p>
            <p><strong>Design :</strong> ${template_id} · Pack ${pack}</p>
            ${venue_name ? `<p><strong>Lieu :</strong> ${venue_name}</p>` : ''}
            ${custom_message ? `<p><strong>Message :</strong><br>${custom_message}</p>` : ''}
            <hr>
            <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/${wedding.id}">Voir dans l'admin →</a></p>
          `,
        })
      }
    } catch (e) {
      console.warn('[ORDER] Email notification failed:', e)
    }

    return NextResponse.json({ success: true, reference })

  } catch (err) {
    console.error('[ORDER]', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}