import { NextRequest, NextResponse } from 'next/server'
import { createServiceSupabaseClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { slug, token } = await req.json()

    if (!slug || !token) {
      return NextResponse.json(
        { error: 'Champs manquants.' },
        { status: 400 }
      )
    }

    const supabase = createServiceSupabaseClient()
    const { data: wedding } = await supabase
      .from('weddings')
      .select('id, couple_token')
      .eq('slug', slug)
      .single()

    // Réponse identique si mariage inexistant ou token incorrect
    // (évite de révéler l'existence du mariage)
    if (!wedding || wedding.couple_token !== token) {
      return NextResponse.json(
        { error: 'Code d\'accès invalide.' },
        { status: 401 }
      )
    }

    // Poser le cookie de session couple
    const response = NextResponse.json({ success: true })
    response.cookies.set(`couple_${slug}`, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 jours
      path: '/',
    })

    return response

  } catch (err) {
    console.error('[COUPLE LOGIN]', err)
    return NextResponse.json(
      { error: 'Erreur serveur.' },
      { status: 500 }
    )
  }
}