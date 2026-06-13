import { NextRequest, NextResponse } from 'next/server'
import { createServiceSupabaseClient } from '@/lib/supabase/server'
import { generateAccessToken } from '@/lib/tokens'

function checkAdmin(req: NextRequest) {
  return req.cookies.get('admin_session')?.value === process.env.ADMIN_SESSION_SECRET
}

export async function GET(req: NextRequest) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'Non autorisé.' }, { status: 403 })

  const wedding_id = req.nextUrl.searchParams.get('wedding_id')
  if (!wedding_id) return NextResponse.json({ error: 'wedding_id requis.' }, { status: 400 })

  const supabase = createServiceSupabaseClient()
  const { data, error } = await supabase
    .from('guest_invitations')
    .select('*')
    .eq('wedding_id', wedding_id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ invitations: data })
}

export async function POST(req: NextRequest) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'Non autorisé.' }, { status: 403 })

  const { wedding_id, guest_name_ar, prefix_ar, suffix_ar } = await req.json()
  if (!wedding_id || !guest_name_ar?.trim()) {
    return NextResponse.json({ error: 'Champs manquants.' }, { status: 400 })
  }

  const supabase = createServiceSupabaseClient()
  const token = generateAccessToken(10)

  const { data, error } = await supabase
    .from('guest_invitations')
    .insert({ wedding_id, guest_name_ar: guest_name_ar.trim(), prefix_ar: prefix_ar || null, suffix_ar: suffix_ar || null, token })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ invitation: data })
}
