import { NextRequest, NextResponse } from 'next/server'
import { createServiceSupabaseClient } from '@/lib/supabase/server'
import { buildIcs, icsFileName } from '@/lib/calendar'
import { Wedding } from '@/lib/types'

// Served as a real file download rather than a client-side blob: iOS and
// Android hand a text/calendar response straight to the calendar app.
export async function GET(req: NextRequest) {
  const weddingId = req.nextUrl.searchParams.get('wedding_id')
  if (!weddingId) {
    return NextResponse.json({ error: 'wedding_id manquant.' }, { status: 400 })
  }

  const supabase = createServiceSupabaseClient()
  const { data, error } = await supabase
    .from('weddings')
    .select('id, slug, bride_name, groom_name, event_date, venue_name, venue_address, parties, show_celebrations, status')
    .eq('id', weddingId)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Mariage introuvable.' }, { status: 404 })
  }

  // Don't hand out details for invitations that are no longer live.
  if (data.status === 'suspended' || data.status === 'archived') {
    return NextResponse.json({ error: 'Invitation expirée.' }, { status: 410 })
  }

  const ics = buildIcs(data as Wedding)

  return new NextResponse(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${icsFileName(data as Wedding)}"`,
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
