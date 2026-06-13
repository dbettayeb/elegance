import { NextRequest, NextResponse } from 'next/server'
import { createServiceSupabaseClient } from '@/lib/supabase/server'

function checkAdmin(req: NextRequest) {
  return req.cookies.get('admin_session')?.value === process.env.ADMIN_SESSION_SECRET
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'Non autorisé.' }, { status: 403 })

  const { id } = await params
  const supabase = createServiceSupabaseClient()

  const { error } = await supabase
    .from('guest_invitations')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
