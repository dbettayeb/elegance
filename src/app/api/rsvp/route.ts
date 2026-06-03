import { NextRequest, NextResponse } from 'next/server'
import { createServiceSupabaseClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/rate-limit'
import { sanitizeName, sanitizePhone, sanitizeText } from '@/lib/sanitize'
import { hashIP } from '@/lib/tokens'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { wedding_id, name, phone, status, guests, note } = body

    // Validation
    if (!wedding_id || !name || !status) {
      return NextResponse.json(
        { error: 'Champs manquants.' },
        { status: 400 }
      )
    }

    const validStatuses = ['present', 'absent', 'maybe']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Statut invalide.' },
        { status: 400 }
      )
    }

    // Rate limiting
    const ip = req.headers.get('x-forwarded-for')
      ?.split(',')[0].trim() ?? 'unknown'
    const ipHash = hashIP(ip)
    const { allowed } = await checkRateLimit(
      'rsvp',
      `${ipHash}:${wedding_id}`
    )

    if (!allowed) {
      return NextResponse.json(
        { error: 'Trop de tentatives. Réessayez dans 1 heure.' },
        { status: 429 }
      )
    }

    const supabase = createServiceSupabaseClient()

    // Vérifier que le mariage est actif
    const { data: wedding } = await supabase
      .from('weddings')
      .select('id')
      .eq('id', wedding_id)
      .eq('status', 'active')
      .single()

    if (!wedding) {
      return NextResponse.json(
        { error: 'Invitation introuvable.' },
        { status: 404 }
      )
    }

    // Insertion
    const { error } = await supabase.from('rsvps').insert({
      wedding_id,
      name:    sanitizeName(name),
      phone:   phone ? sanitizePhone(phone) : null,
      status,
      guests:  Math.min(Math.max(0, parseInt(guests) || 0), 20),
      note:    note ? sanitizeText(note, 300) : null,
      ip_hash: ipHash,
    })

    if (error) throw error

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('[RSVP]', err)
    return NextResponse.json(
      { error: 'Erreur serveur.' },
      { status: 500 }
    )
  }
}