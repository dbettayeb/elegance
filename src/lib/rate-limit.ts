import { createServiceSupabaseClient } from '@/lib/supabase/server'

const LIMITS = {
  rsvp:      { max: 3, windowMinutes: 60 },
  guestbook: { max: 5, windowMinutes: 60 },
}

type Action = keyof typeof LIMITS

export async function checkRateLimit(
  action: Action,
  identifier: string
): Promise<{ allowed: boolean }> {
  const supabase = createServiceSupabaseClient()
  const key = `${action}:${identifier}`
  const limit = LIMITS[action]
  const now = new Date()

  try {
    const { data } = await supabase
      .from('rate_limits')
      .select('count, window_end')
      .eq('key', key)
      .single()

    // Pas d'entrée ou fenêtre expirée → reset
    if (!data || new Date(data.window_end) < now) {
      const window_end = new Date(
        now.getTime() + limit.windowMinutes * 60_000
      ).toISOString()

      await supabase
        .from('rate_limits')
        .upsert({ key, count: 1, window_end })

      return { allowed: true }
    }

    // Limite atteinte
    if (data.count >= limit.max) {
      return { allowed: false }
    }

    // Incrémenter
    await supabase
      .from('rate_limits')
      .update({ count: data.count + 1 })
      .eq('key', key)

    return { allowed: true }

  } catch {
    // En cas d'erreur technique, on laisse passer
    // (mieux qu'un faux positif bloquant un vrai invité)
    return { allowed: true }
  }
}