import { NextRequest, NextResponse } from 'next/server'
import { createServiceSupabaseClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/rate-limit'
import { sanitizeName, sanitizeText } from '@/lib/sanitize'
import { hashIP } from '@/lib/tokens'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { wedding_id, author_name, message } = body

    if (!wedding_id || !author_name || !message) {
      return NextResponse.json(
        { error: 'Champs manquants.' },
        { status: 400 }
      )
    }

    // Rate limiting
    const ip = req.headers.get('x-forwarded-for')
      ?.split(',')[0].trim() ?? 'unknown'
    const ipHash = hashIP(ip)
    const { allowed } = await checkRateLimit(
      'guestbook',
      `${ipHash}:${wedding_id}`
    )

    if (!allowed) {
      return NextResponse.json(
        { error: 'Limite atteinte. Réessayez dans 1 heure.' },
        { status: 429 }
      )
    }

    const supabase = createServiceSupabaseClient()

    // Vérifier que le mariage est actif
    const { data: wedding } = await supabase
      .from('weddings')
      .select('id, show_guestbook, moderation_on')
      .eq('id', wedding_id)
      .eq('status', 'active')
      .single()

    if (!wedding) {
      return NextResponse.json(
        { error: 'Invitation introuvable.' },
        { status: 404 }
      )
    }

    if (!wedding.show_guestbook) {
      return NextResponse.json(
        { error: 'Le livre d\'or est désactivé.' },
        { status: 403 }
      )
    }

    const { error } = await supabase.from('guestbook').insert({
      wedding_id,
      author_name: sanitizeName(author_name),
      message:     sanitizeText(message, 500),
      // Si modération désactivée → approuvé directement
      approved:    !wedding.moderation_on,
      ip_hash:     ipHash,
    })

    if (error) throw error

    return NextResponse.json({
      success: true,
      pending: wedding.moderation_on,
    })

  } catch (err) {
    console.error('[GUESTBOOK]', err)
    return NextResponse.json(
      { error: 'Erreur serveur.' },
      { status: 500 }
    )
  }
}