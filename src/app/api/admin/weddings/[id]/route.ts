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

    // Régénérer les tokens
    if (body._action === 'regenerate_tokens') {
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

      const base = process.env.NEXT_PUBLIC_BASE_URL
      return NextResponse.json({
        success: true,
        inviteUrl: `${base}/i/${data.slug}?t=${data.access_token}`,
        coupleUrl: `${base}/couple/${data.slug}/login`,
        coupleToken: data.couple_token,
      })
    }

    // Changer le statut
    if (body._action === 'change_status') {
      const validStatuses = ['active', 'archived', 'suspended']
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json({ error: 'Statut invalide.' }, { status: 400 })
      }

      const { error } = await supabase
        .from('weddings')
        .update({ status: body.status })
        .eq('id', id)

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })

      revalidatePath(`/admin/${id}`)
      revalidatePath('/admin')
      return NextResponse.json({ success: true })
    }

    // Édition standard
    const {
      bride_name, groom_name,
      bride_name_ar, groom_name_ar,
      couple_email,
      event_date, event_time,
      venue_name, venue_address,
      gps_google, gps_apple,
      template_id, pack,
      intro_text, custom_message, music_url,
      custom_font,
      program,
      show_rsvp, show_guestbook, moderation_on,
    } = body

    if (!bride_name || !groom_name || !couple_email || !event_date || !venue_name) {
      return NextResponse.json({ error: 'Champs obligatoires manquants.' }, { status: 400 })
    }

    const datetime = event_time ? `${event_date}T${event_time}:00` : event_date

    const { error } = await supabase
      .from('weddings')
      .update({
        bride_name, groom_name,
        bride_name_ar:  bride_name_ar  || null,
        groom_name_ar:  groom_name_ar  || null,
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
        show_rsvp:      show_rsvp ?? true,
        show_guestbook, moderation_on,
        program: Array.isArray(program) ? program : [],
      })
      .eq('id', id)

    if (error) {
      console.error('[UPDATE WEDDING] Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    revalidatePath(`/admin/${id}`)
    revalidatePath('/admin')
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
    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('[DELETE WEDDING]', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}