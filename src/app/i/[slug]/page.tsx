// src/app/i/[slug]/page.tsx
import { redirect, notFound } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ t?: string }>
}

// Redirection des anciens liens /i/[slug]?t=xxx vers /i/[slug]/[token]
// pour préserver les invitations déjà envoyées via WhatsApp
export default async function LegacyInvitationRedirect({
  params,
  searchParams,
}: Props) {
  const { slug } = await params
  const { t: token } = await searchParams

  if (!token) notFound()

  redirect(`/i/${slug}/${token}`)
}