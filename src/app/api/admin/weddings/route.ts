// src/app/api/admin/weddings/route.ts
// POST : créer un mariage  /  GET : lister les mariages
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { randomBytes } from 'crypto'

function genToken(): string {
  return randomBytes(16).toString('hex')
}

function genSlug(brideName: string, groomName: string): string {
  const clean = (s: string) =>
    s.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  const suffix = randomBytes(2).toString('hex')
  return `${clean(brideName)}-${clean(groomName)}-${suffix}`
}

export async function GET() {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('weddings')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ weddings: data })
}

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const body = await req.json()

  const {
    bride_name, groom_name, bride_name_ar, groom_name_ar, couple_email,
    event_date, venue_name, venue_address, gps_google, gps_apple,
    template_id, pack, intro_text, custom_message, music_url,
    custom_font, program,
    show_rsvp, show_guestbook, moderation_on,
  } = body

  if (!bride_name || !groom_name || !couple_email || !event_date || !venue_name || !template_id) {
    return NextResponse.json({ error: 'Champs requis manquants.' }, { status: 400 })
  }

  const slug = genSlug(bride_name, groom_name)
  const access_token = genToken()
  const couple_token = genToken()

  const { data, error } = await supabase
    .from('weddings')
    .insert({
      slug,
      access_token,
      couple_token,
      couple_email,
      bride_name,
      groom_name,
      bride_name_ar: bride_name_ar || null,
      groom_name_ar: groom_name_ar || null,
      event_date,
      venue_name,
      venue_address: venue_address || null,
      gps_google: gps_google || null,
      gps_apple: gps_apple || null,
      template_id,
      pack: pack ?? 'essentiel',
      intro_text: intro_text || null,
      custom_message: custom_message || null,
      music_url: music_url || null,
      custom_font: custom_font || null,
      program: program ?? [],
      show_rsvp: show_rsvp ?? true,
      show_guestbook: show_guestbook ?? true,
      moderation_on: moderation_on ?? true,
      status: 'active',
    })
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ wedding: data })
}