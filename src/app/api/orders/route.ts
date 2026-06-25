import { NextRequest, NextResponse } from 'next/server'
import { createServiceSupabaseClient } from '@/lib/supabase/server'
import { generateAccessToken } from '@/lib/tokens'
import { sanitizeName, sanitizeText, sanitizePhone } from '@/lib/sanitize'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      template_id,
      bride_name, groom_name,
      bride_name_ar, groom_name_ar,
      couple_email, couple_phone,
      event_date,
      venue_name,
      custom_message,
      options,
    } = body

    if (!template_id || !bride_name || !groom_name || !couple_email || !couple_phone || !event_date) {
      return NextResponse.json({ error: 'Champs obligatoires manquants.' }, { status: 400 })
    }

    const selectedOptions: string[] = Array.isArray(options) ? options : []
    const show_countdown = selectedOptions.includes('countdown')
    const show_rsvp      = selectedOptions.includes('rsvp')
    const show_guestbook = selectedOptions.includes('guestbook')

    // Derive a pack value for backward compatibility with the schema
    const pack = selectedOptions.includes('personalised_invites')
      ? 'haute_couture'
      : selectedOptions.some(o => ['rsvp', 'guestbook'].includes(o))
        ? 'prestige'
        : 'essentiel'

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
        show_countdown,
        show_rsvp,
        show_guestbook,
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
            <p><strong>Design :</strong> ${template_id}</p>
            <p><strong>Options :</strong> ${selectedOptions.join(', ') || 'aucune'}</p>
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

    // Confirmation email au client (best effort)
    try {
      if (process.env.RESEND_API_KEY) {
        const { Resend } = await import('resend')
        const resend = new Resend(process.env.RESEND_API_KEY)
        const from = process.env.RESEND_FROM_EMAIL ?? 'no-reply@elegance-digitale.com'
        await resend.emails.send({
          from,
          to: couple_email,
          replyTo: process.env.ADMIN_NOTIFY_EMAIL ?? from,
          subject: `Votre demande a bien été reçue — ${reference}`,
          html: buildOrderConfirmationEmail({ bride_name, groom_name, reference, template_id, options: selectedOptions, event_date }),
        })
      }
    } catch (e) {
      console.warn('[ORDER] Client confirmation email failed:', e)
    }

    return NextResponse.json({ success: true, reference })

  } catch (err) {
    console.error('[ORDER]', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}

function buildOrderConfirmationEmail({ bride_name, groom_name, reference, template_id, options, event_date }: {
  bride_name: string; groom_name: string; reference: string
  template_id: string; options: string[]; event_date: string
}) {
  const optionLabels: Record<string, string> = {
    countdown:            'Compte à rebours',
    program:              'Programme',
    rsvp:                 'RSVP',
    guestbook:            'Livre d\'or',
    personalised_invites: 'Invitations personnalisées',
  }
  const optionsList = options
    .filter(o => optionLabels[o])
    .map(o => optionLabels[o])
    .join(', ') || 'Aucune option payante'

  return `<!DOCTYPE html><html lang="fr"><body style="margin:0;padding:0;background:#fafafa;font-family:Georgia,serif">
<div style="max-width:560px;margin:40px auto;background:#fff;border:1px solid #e8e8e8">
  <div style="padding:32px 36px;border-bottom:1px solid #f0f0f0;text-align:center">
    <p style="margin:0;font-size:0.7rem;letter-spacing:0.45em;text-transform:uppercase;color:#B8985A;font-family:'Helvetica Neue',sans-serif">Élégance Digitale</p>
  </div>
  <div style="padding:40px 36px">
    <h1 style="margin:0 0 8px;font-weight:300;font-size:1.7rem;line-height:1.2">Merci, ${bride_name} &amp; ${groom_name}&nbsp;!</h1>
    <p style="margin:0 0 32px;color:#666;font-style:italic;font-size:1rem;line-height:1.6">
      Votre demande a bien été reçue. Nous vous contacterons dans les <strong>24h</strong> pour valider les détails et démarrer votre invitation.
    </p>
    <div style="background:#fafafa;border:1px solid #eee;padding:24px;margin-bottom:32px;font-family:'Helvetica Neue',sans-serif;font-size:0.88rem">
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:6px 0;color:#888;width:140px">Référence</td><td style="padding:6px 0;font-weight:600;letter-spacing:0.05em">${reference}</td></tr>
        <tr><td style="padding:6px 0;color:#888">Design</td><td style="padding:6px 0">${template_id.replace(/_/g, ' ')}</td></tr>
        <tr><td style="padding:6px 0;color:#888">Options</td><td style="padding:6px 0">${optionsList}</td></tr>
        ${event_date ? `<tr><td style="padding:6px 0;color:#888">Date du mariage</td><td style="padding:6px 0">${event_date}</td></tr>` : ''}
      </table>
    </div>
    <p style="margin:0 0 8px;color:#555;font-size:0.9rem;line-height:1.7">Pour toute question, répondez simplement à cet email — nous sommes là.</p>
    <p style="margin:0;color:#555;font-size:0.9rem;line-height:1.7;font-style:italic">L'équipe Élégance Digitale</p>
  </div>
  <div style="padding:20px 36px;border-top:1px solid #f0f0f0;text-align:center">
    <p style="margin:0;font-size:0.72rem;color:#bbb;font-family:'Helvetica Neue',sans-serif;letter-spacing:0.15em;text-transform:uppercase">
      © ${new Date().getFullYear()} Élégance Digitale
    </p>
  </div>
</div>
</body></html>`
}