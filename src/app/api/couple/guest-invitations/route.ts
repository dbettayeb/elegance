import { NextRequest, NextResponse } from 'next/server'
import { createServiceSupabaseClient } from '@/lib/supabase/server'
import { generateAccessToken } from '@/lib/tokens'

async function checkCouple(req: NextRequest, slug: string): Promise<boolean> {
  const cookie = req.cookies.get(`couple_${slug}`)?.value
  if (!cookie) return false
  const supabase = createServiceSupabaseClient()
  const { data } = await supabase
    .from('weddings')
    .select('couple_token')
    .eq('slug', slug)
    .single()
  return data?.couple_token === cookie
}

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  const wedding_id = req.nextUrl.searchParams.get('wedding_id')
  if (!slug || !wedding_id) return NextResponse.json({ error: 'Paramètres manquants.' }, { status: 400 })
  if (!await checkCouple(req, slug)) return NextResponse.json({ error: 'Non autorisé.' }, { status: 403 })

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
  const { slug, wedding_id, guest_name_ar, prefix_ar, suffix_ar } = await req.json()
  if (!slug || !wedding_id || !guest_name_ar?.trim()) {
    return NextResponse.json({ error: 'Champs manquants.' }, { status: 400 })
  }
  if (!await checkCouple(req, slug)) return NextResponse.json({ error: 'Non autorisé.' }, { status: 403 })

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
