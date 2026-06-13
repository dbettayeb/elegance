import { NextRequest, NextResponse } from 'next/server'
import { createServiceSupabaseClient } from '@/lib/supabase/server'

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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { slug } = await req.json().catch(() => ({}))
  if (!slug) return NextResponse.json({ error: 'slug requis.' }, { status: 400 })
  if (!await checkCouple(req, slug)) return NextResponse.json({ error: 'Non autorisé.' }, { status: 403 })

  const { id } = await params
  const supabase = createServiceSupabaseClient()
  const { error } = await supabase.from('guest_invitations').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
