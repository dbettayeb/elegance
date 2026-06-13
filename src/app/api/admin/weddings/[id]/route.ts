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

      // Récupérer slug+token pour invalider le cache après changement
      const { data: wedding } = await supabase
        .from('weddings')
        .select('slug, access_token')
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
      bismillah_palette,
    } = body

    const VALID_PALETTES = ['or_classique', 'emeraude', 'bordeaux', 'marine_dore', 'rose_cuivre']

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

    const datetime = event_time ? `${event_date}T${event_time}:00` : event_date

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
        bismillah_palette: VALID_PALETTES.includes(bismillah_palette) ? bismillah_palette : 'or_classique',
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