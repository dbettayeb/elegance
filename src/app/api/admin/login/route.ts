import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  if (!password || password !== process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.json(
      { error: 'Mot de passe incorrect.' },
      { status: 401 }
    )
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set('admin_session', process.env.ADMIN_SESSION_SECRET!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8 heures
    path: '/',
  })

  return response
}