import { NextRequest, NextResponse } from 'next/server'
import { createServiceSupabaseClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { message_id, wedding_id, approved } = body

    if (!message_id || !wedding_id || approved === undefined) {
      return NextResponse.json({ error: 'Champs manquants.' }, { status: 400 })
    }

    const supabase = createServiceSupabaseClient()

    // Récupérer le slug depuis le wedding_id
    const { data: wedding } = await supabase
      .from('weddings')
      .select('slug, couple_token')
      .eq('id', wedding_id)
      .single()

    if (!wedding) {
      return NextResponse.json({ error: 'Introuvable.' }, { status: 404 })
    }

// Vérifier admin OU cookie couple
    const adminOk  = req.cookies.get('admin_session')?.value === process.env.ADMIN_SESSION_SECRET
    const coupleOk = req.cookies.get(`couple_${wedding.slug}`)?.value === wedding.couple_token

    if (!adminOk && !coupleOk) {
      return NextResponse.json({ error: 'Non autorisé.' }, { status: 403 })
    }

    const { error } = await supabase
      .from('guestbook')
      .update({ approved })
      .eq('id', message_id)
      .eq('wedding_id', wedding_id)

    if (error) throw error

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('[APPROVE]', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}