import { NextRequest, NextResponse } from 'next/server'
import { createServiceSupabaseClient } from '@/lib/supabase/server'
import { generateAccessToken } from '@/lib/tokens'
import { revalidatePath } from 'next/cache'

function checkAdmin(req: NextRequest): boolean {
  const session = req.cookies.get('admin_session')?.value
  return session === process.env.ADMIN_SESSION_SECRET
}

// ─────────── PATCH ───────────
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 403 })
  }

  const { id } = await params

  try {
    const body = await req.json()
    const supabase = createServiceSupabaseClient()

    // ─── Régénérer les tokens ───
    if (body._action === 'regenerate_tokens') {
      // ⚠️ Récupérer l'ancien token AVANT update pour invalider son cache
      const { data: previous } = await supabase
        .from('weddings')
        .select('slug, access_token')
        .eq('id', id)
        .single()

      const access_token = generateAccessToken(8)
      const couple_token = generateAccessToken(8)

      const { data, error } = await supabase
        .from('weddings')
        .update({ access_token, couple_token })
        .eq('id', id)
        .select('slug, access_token, couple_token')
        .single()

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })

      revalidatePath(`/admin/${id}`)
      revalidatePath('/admin')

      // Invalider l'ancien lien (qui doit désormais retourner 404)
      if (previous) {
        revalidatePath(`/i/${previous.slug}/${previous.access_token}`)
      }
      // Invalider le nouveau lien (au cas où quelqu'un l'aurait déjà ouvert avant l'update)
      revalidatePath(`/i/${data.slug}/${data.access_token}`)

      const base = process.env.NEXT_PUBLIC_BASE_URL
      return NextResponse.json({
        success: true,
        inviteUrl: `${base}/i/${data.slug}/${data.access_token}`,
        coupleUrl: `${base}/couple/${data.slug}/login`,
        coupleToken: data.couple_token,
      })
    }

    // ─── Changer le statut ───
    if (body._action === 'change_status') {
      const validStatuses = ['active', 'archived', 'suspended']
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json({ error: 'Statut invalide.' }, { status: 400 })
      }

      // Récupérer slug+token+email pour invalider le cache et envoyer email
      const { data: wedding } = await supabase
        .from('weddings')
        .select('slug, access_token, couple_token, couple_email, bride_name, groom_name')
        .eq('id', id)
        .single()

      const { error } = await supabase
        .from('weddings')
        .update({ status: body.status })
        .eq('id', id)

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })

      revalidatePath(`/admin/${id}`)
      revalidatePath('/admin')

      // ⚠️ CRITIQUE : un suspended/archived doit prendre effet immédiatement,
      // sinon les invités voient l'invitation pendant encore 1h via le cache CDN
      if (wedding) {
        revalidatePath(`/i/${wedding.slug}/${wedding.access_token}`)
      }

      // Email de livraison au couple quand l'invitation est activée
      if (body.status === 'active' && wedding?.couple_email) {
        try {
          if (process.env.RESEND_API_KEY) {
            const { Resend } = await import('resend')
            const resend = new Resend(process.env.RESEND_API_KEY)
            const base = process.env.NEXT_PUBLIC_BASE_URL ?? ''
            const from = process.env.RESEND_FROM_EMAIL ?? 'no-reply@elegance-digitale.com'
            await resend.emails.send({
              from,
              to: wedding.couple_email,
              replyTo: process.env.ADMIN_NOTIFY_EMAIL ?? from,
              subject: `Votre invitation est prête — ${wedding.bride_name} & ${wedding.groom_name}`,
              html: buildActivationEmail({
                bride_name:   wedding.bride_name,
                groom_name:   wedding.groom_name,
                invite_url:   `${base}/i/${wedding.slug}/${wedding.access_token}`,
                couple_url:   `${base}/couple/${wedding.slug}/login`,
                couple_token: wedding.couple_token,
              }),
            })
          }
        } catch (e) {
          console.warn('[ACTIVATE] Email failed:', e)
        }
      }

      return NextResponse.json({ success: true })
    }

    // ─── Édition standard ───
    const {
      bride_name, groom_name,
      bride_name_ar, groom_name_ar,
      bride_family_ar, groom_family_ar,
      bride_family_prefix_ar, groom_family_prefix_ar,
      families_intro_ar,
      couple_email,
      event_date, event_time,
      venue_name, venue_address,
      gps_google, gps_apple,
      template_id, pack,
      intro_text, custom_message, music_url,
      custom_font,
      program,
      show_rsvp, show_guestbook, show_countdown, moderation_on,
      bismillah_palette, background_image, decoration_image,
      template_variant,
      guest_invite_enabled, guest_invite_prefix_ar, guest_invite_suffix_ar,
      couple_photo, intro_video_url,
      wedding_day_text, venue_photo,
      parties, show_celebrations,
    } = body

    if (!bride_name || !groom_name || !couple_email || !event_date || !venue_name) {
      return NextResponse.json({ error: 'Champs obligatoires manquants.' }, { status: 400 })
    }

    // Récupérer slug+token AVANT update pour invalider le cache
    const { data: existingWedding } = await supabase
      .from('weddings')
      .select('slug, access_token')
      .eq('id', id)
      .single()

    if (!existingWedding) {
      return NextResponse.json({ error: 'Mariage introuvable.' }, { status: 404 })
    }

    const datetime = event_time ? `${event_date}T${event_time}:00Z` : event_date

    const { error } = await supabase
      .from('weddings')
      .update({
        bride_name, groom_name,
        bride_name_ar:   bride_name_ar   || null,
        groom_name_ar:   groom_name_ar   || null,
        bride_family_ar:        bride_family_ar        || null,
        groom_family_ar:        groom_family_ar        || null,
        bride_family_prefix_ar: bride_family_prefix_ar || null,
        groom_family_prefix_ar: groom_family_prefix_ar || null,
        families_intro_ar:      families_intro_ar      || null,
        couple_email,
        event_date: datetime,
        venue_name,
        venue_address:  venue_address  || null,
        gps_google:     gps_google     || null,
        gps_apple:      gps_apple      || null,
        template_id, pack,
        intro_text:     intro_text     || 'Vous êtes cordialement invités au mariage de',
        custom_message: custom_message || null,
        music_url:      music_url      || null,
        custom_font:    custom_font    || null,
        show_rsvp:      show_rsvp      ?? true,
        show_guestbook,
        show_countdown: show_countdown ?? true,
        moderation_on,
        bismillah_palette: bismillah_palette || 'or_classique',
        background_image:  background_image  || 'bg-texture.jpg',
        decoration_image:  decoration_image  || 'decoration.png',
        template_variant:  template_variant  || null,
        guest_invite_enabled:    guest_invite_enabled    ?? false,
        guest_invite_prefix_ar:  guest_invite_prefix_ar  || null,
        guest_invite_suffix_ar:  guest_invite_suffix_ar  || null,
        couple_photo:      couple_photo      || null,
        intro_video_url:   intro_video_url   || null,
        wedding_day_text:  wedding_day_text  || null,
        venue_photo:       venue_photo       || null,
        parties: Array.isArray(parties) ? parties : [],
        show_celebrations: show_celebrations ?? true,
        program: Array.isArray(program) ? program : [],
      })
      .eq('id', id)

    if (error) {
      console.error('[UPDATE WEDDING] Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    revalidatePath(`/admin/${id}`)
    revalidatePath('/admin')
    revalidatePath(`/i/${existingWedding.slug}/${existingWedding.access_token}`)

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('[UPDATE WEDDING]', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}

// ─────────── DELETE ───────────
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 403 })
  }

  const { id } = await params

  try {
    const supabase = createServiceSupabaseClient()

    // ⚠️ Récupérer slug+token AVANT suppression pour purger le cache
    const { data: wedding } = await supabase
      .from('weddings')
      .select('slug, access_token')
      .eq('id', id)
      .single()

    await supabase.from('rsvps').delete().eq('wedding_id', id)
    await supabase.from('guestbook').delete().eq('wedding_id', id)

    const { error } = await supabase
      .from('weddings')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('[DELETE WEDDING] Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    revalidatePath('/admin')

    // Invalider le cache CDN : l'invitation doit désormais retourner 404
    if (wedding) {
      revalidatePath(`/i/${wedding.slug}/${wedding.access_token}`)
    }

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('[DELETE WEDDING]', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}

function buildActivationEmail({ bride_name, groom_name, invite_url, couple_url, couple_token }: {
  bride_name: string; groom_name: string
  invite_url: string; couple_url: string; couple_token: string
}) {
  return `<!DOCTYPE html><html lang="fr"><body style="margin:0;padding:0;background:#fafafa;font-family:Georgia,serif">
<div style="max-width:560px;margin:40px auto;background:#fff;border:1px solid #e8e8e8">
  <div style="padding:32px 36px;border-bottom:1px solid #f0f0f0;text-align:center">
    <p style="margin:0;font-size:0.7rem;letter-spacing:0.45em;text-transform:uppercase;color:#B8985A;font-family:'Helvetica Neue',sans-serif">Élégance Digitale</p>
  </div>
  <div style="padding:40px 36px">
    <h1 style="margin:0 0 8px;font-weight:300;font-size:1.7rem;line-height:1.2">Votre invitation est prête&nbsp;!</h1>
    <p style="margin:0 0 32px;color:#666;font-style:italic;font-size:1rem;line-height:1.6">
      Félicitations, ${bride_name} &amp; ${groom_name}. Votre invitation de mariage est maintenant active et prête à être partagée avec vos invités.
    </p>

    <div style="margin-bottom:24px">
      <p style="margin:0 0 10px;font-family:'Helvetica Neue',sans-serif;font-size:0.78rem;letter-spacing:0.2em;text-transform:uppercase;color:#888">Lien à partager avec vos invités</p>
      <a href="${invite_url}" style="display:block;padding:16px 20px;background:#0a0a0a;color:#fff;text-decoration:none;font-family:'Helvetica Neue',sans-serif;font-size:0.82rem;letter-spacing:0.08em;word-break:break-all">
        ${invite_url}
      </a>
    </div>

    <div style="background:#fafafa;border:1px solid #eee;padding:24px;margin-bottom:32px;font-family:'Helvetica Neue',sans-serif;font-size:0.88rem">
      <p style="margin:0 0 12px;font-weight:600;font-size:0.78rem;letter-spacing:0.2em;text-transform:uppercase;color:#555">Votre espace mariés</p>
      <p style="margin:0 0 6px;color:#666">URL : <a href="${couple_url}" style="color:#0a0a0a">${couple_url}</a></p>
      <p style="margin:0;color:#666">Code d'accès : <strong style="letter-spacing:0.12em">${couple_token}</strong></p>
      <p style="margin:12px 0 0;color:#999;font-size:0.8rem;line-height:1.5">Depuis votre espace, suivez les confirmations de présence et gérez le livre d'or.</p>
    </div>

    <p style="margin:0 0 8px;color:#555;font-size:0.9rem;line-height:1.7">Pour toute modification ou question, répondez à cet email.</p>
    <p style="margin:0;color:#555;font-size:0.9rem;line-height:1.7;font-style:italic">Toute l'équipe vous souhaite un merveilleux mariage. ✨</p>
  </div>
  <div style="padding:20px 36px;border-top:1px solid #f0f0f0;text-align:center">
    <p style="margin:0;font-size:0.72rem;color:#bbb;font-family:'Helvetica Neue',sans-serif;letter-spacing:0.15em;text-transform:uppercase">
      © ${new Date().getFullYear()} Élégance Digitale
    </p>
  </div>
</div>
</body></html>`
}