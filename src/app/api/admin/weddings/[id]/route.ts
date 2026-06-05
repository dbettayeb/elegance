// src/app/api/admin/weddings/[id]/route.ts
// GET / PATCH / DELETE pour un mariage spécifique
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { randomBytes } from 'crypto'

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('weddings').select('*').eq('id', id).single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json({ wedding: data })
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()
  const body = await req.json()

  // Action spéciale : régénérer les tokens
  if (body.action === 'regenerate_tokens') {
    const { data, error } = await supabase
      .from('weddings')
      .update({
        access_token: randomBytes(16).toString('hex'),
        couple_token: randomBytes(16).toString('hex'),
      })
      .eq('id', id)
      .select('*').single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ wedding: data })
  }

  // Action spéciale : changer le statut
  if (body.action === 'change_status') {
    const { data, error } = await supabase
      .from('weddings')
      .update({ status: body.status })
      .eq('id', id)
      .select('*').single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ wedding: data })
  }

  // Update standard du form d'édition
  const {
    bride_name, groom_name, bride_name_ar, groom_name_ar, couple_email,
    event_date, event_time,
    venue_name, venue_address, gps_google, gps_apple,
    template_id, pack, intro_text, custom_message, music_url,
    custom_font, program,
    show_rsvp, show_guestbook, moderation_on,
  } = body

  // Si event_date + event_time fournis séparément, recompose un ISO
  let event_date_iso = event_date
  if (event_date && event_time && !event_date.includes('T')) {
    event_date_iso = `${event_date}T${event_time}:00`
  }

  const update: Record<string, unknown> = {}
  if (bride_name !== undefined) update.bride_name = bride_name
  if (groom_name !== undefined) update.groom_name = groom_name
  if (bride_name_ar !== undefined) update.bride_name_ar = bride_name_ar || null
  if (groom_name_ar !== undefined) update.groom_name_ar = groom_name_ar || null
  if (couple_email !== undefined) update.couple_email = couple_email
  if (event_date_iso !== undefined) update.event_date = event_date_iso
  if (venue_name !== undefined) update.venue_name = venue_name
  if (venue_address !== undefined) update.venue_address = venue_address || null
  if (gps_google !== undefined) update.gps_google = gps_google || null
  if (gps_apple !== undefined) update.gps_apple = gps_apple || null
  if (template_id !== undefined) update.template_id = template_id
  if (pack !== undefined) update.pack = pack
  if (intro_text !== undefined) update.intro_text = intro_text || null
  if (custom_message !== undefined) update.custom_message = custom_message || null
  if (music_url !== undefined) update.music_url = music_url || null
  if (custom_font !== undefined) update.custom_font = custom_font || null
  if (program !== undefined) update.program = program
  if (show_rsvp !== undefined) update.show_rsvp = show_rsvp
  if (show_guestbook !== undefined) update.show_guestbook = show_guestbook
  if (moderation_on !== undefined) update.moderation_on = moderation_on

  const { data, error } = await supabase
    .from('weddings').update(update).eq('id', id).select('*').single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ wedding: data })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.from('weddings').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}