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
      guest_invite_enabled, guest_invite_prefix_ar, guest_invite_suffix_ar,
    } = body

    const VALID_PALETTES = ['or_classique', 'emeraude', 'bordeaux', 'marine_dore', 'rose_cuivre', 'noir_elegant']

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
    const datetime     = event_time ? `${event_date}T${event_time}:00` : event_date

    const { data: wedding, error } = await supabase
      .from('weddings')
      .insert({
        slug, access_token, couple_token, couple_email,
        bride_name, groom_name,
        bride_name_ar:   bride_name_ar   || null,
        groom_name_ar:   groom_name_ar   || null,
        bride_family_ar:        bride_family_ar        || null,
        groom_family_ar:        groom_family_ar        || null,
        bride_family_prefix_ar: bride_family_prefix_ar || null,
        groom_family_prefix_ar: groom_family_prefix_ar || null,
        families_intro_ar:      families_intro_ar      || null,
        event_date: datetime,
        venue_name,
        venue_address:  venue_address  || null,
        gps_google:     gps_google     || null,
        gps_apple:      gps_apple      || null,
        template_id,    pack,
        intro_text:     intro_text     || 'Vous êtes cordialement invités au mariage de',
        custom_message: custom_message || null,
        music_url:      music_url      || null,
        custom_font:    custom_font    || null,
        show_rsvp:       show_rsvp       ?? true,
        show_guestbook,
        show_countdown:  show_countdown  ?? true,
        moderation_on,
        bismillah_palette: VALID_PALETTES.includes(bismillah_palette) ? bismillah_palette : 'or_classique',
        background_image:  background_image  || 'bg-texture.jpg',
        decoration_image:  decoration_image  || 'decoration.png',
        guest_invite_enabled:    guest_invite_enabled    ?? false,
        guest_invite_prefix_ar:  guest_invite_prefix_ar  || null,
        guest_invite_suffix_ar:  guest_invite_suffix_ar  || null,
        program: Array.isArray(program) ? program : [],
      })
      .select('id, slug, access_token, couple_token')
      .single()

    if (error) {
      console.error('[CREATE WEDDING] Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    revalidatePath('/admin')

    const base = process.env.NEXT_PUBLIC_BASE_URL
    return NextResponse.json({
      success:     true,
      id:          wedding.id,
      slug:        wedding.slug,
      inviteUrl:   `${base}/i/${wedding.slug}/${wedding.access_token}`,
      coupleUrl:   `${base}/couple/${wedding.slug}/login`,
      coupleToken: wedding.couple_token,
    })

  } catch (err) {
    console.error('[CREATE WEDDING]', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}