import { NextRequest, NextResponse } from 'next/server'
import { createServiceSupabaseClient } from '@/lib/supabase/server'
import { generateAccessToken } from '@/lib/tokens'
import { revalidatePath } from 'next/cache'

export async function POST(req: NextRequest) {
  const adminSession = req.cookies.get('admin_session')?.value

  if (!adminSession || adminSession !== process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const {
      bride_name, groom_name, couple_email,
      event_date, event_time,
      venue_name, venue_address,
      gps_google, gps_apple,
      template_id, pack,
      intro_text, custom_message,
      program,
      show_guestbook, moderation_on,
    } = body

    if (!bride_name || !groom_name || !couple_email || !event_date || !venue_name) {
      return NextResponse.json({ error: 'Champs obligatoires manquants.' }, { status: 400 })
    }

    const baseSlug = `${bride_name}-${groom_name}`
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    const supabase = createServiceSupabaseClient()

    const { data: existing } = await supabase
      .from('weddings')
      .select('id')
      .eq('slug', baseSlug)
      .single()

    const slug         = existing ? `${baseSlug}-${Date.now().toString().slice(-4)}` : baseSlug
    const access_token = generateAccessToken(8)
    const couple_token = generateAccessToken(8)
    const datetime     = `${event_date}T${event_time}:00`

    const { data: wedding, error } = await supabase
      .from('weddings')
      .insert({
        slug, access_token, couple_token, couple_email,
        bride_name, groom_name,
        event_date: datetime,
        venue_name,
        venue_address:  venue_address  || null,
        gps_google:     gps_google     || null,
        gps_apple:      gps_apple      || null,
        template_id,    pack,
        intro_text:     intro_text     || 'Vous êtes cordialement invités au mariage de',
        custom_message: custom_message || null,
        show_guestbook, moderation_on,
        program: Array.isArray(program) ? program : [],
      })
      .select('slug, access_token, couple_token')
      .single()

    if (error) {
      console.error('[CREATE WEDDING] Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Invalider le cache du dashboard pour voir le nouveau mariage immédiatement
    revalidatePath('/admin')

    const base = process.env.NEXT_PUBLIC_BASE_URL
    return NextResponse.json({
      success:     true,
      inviteUrl:   `${base}/i/${wedding.slug}?t=${wedding.access_token}`,
      coupleUrl:   `${base}/couple/${wedding.slug}/login`,
      coupleToken: wedding.couple_token,
    })

  } catch (err) {
    console.error('[CREATE WEDDING]', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}