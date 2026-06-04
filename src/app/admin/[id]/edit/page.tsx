import { notFound } from 'next/navigation'
import { createServiceSupabaseClient } from '@/lib/supabase/server'
import EditWeddingForm from './EditWeddingForm'
import { Wedding } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function EditWeddingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createServiceSupabaseClient()

  const { data: wedding } = await supabase
    .from('weddings')
    .select('*')
    .eq('id', id)
    .single()

  if (!wedding) notFound()

  return <EditWeddingForm wedding={wedding as Wedding} />
}