import { NextRequest, NextResponse } from 'next/server'
import { createServiceSupabaseClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const weddingId = req.nextUrl.searchParams.get('wedding_id')
  if (!weddingId) {
    return NextResponse.json({ error: 'wedding_id manquant.' }, { status: 400 })
  }

  const supabase = createServiceSupabaseClient()
  const { data, error } = await supabase
    .from('guestbook')
    .select('id, author_name, message, created_at')
    .eq('wedding_id', weddingId)
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }

  return NextResponse.json({ messages: data })
}