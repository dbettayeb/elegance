// src/lib/types.ts
export type TemplateId =
  | 'blanc_dore'
  | 'nuit_etoilee'
  | 'jardin_andalou'
  | 'minimaliste'
  | 'rose_poudre'
  | 'marbre_noir'
  | 'bismillah'
  | 'al_asala'
  | 'al_qamar'

export type Pack = 'essentiel' | 'prestige' | 'haute_couture'

export type WeddingStatus = 'active' | 'archived' | 'suspended'

export interface ProgramItem {
  time: string
  event: string
  venue?: string
}

export interface Wedding {
  id: string
  slug: string
  access_token: string
  couple_token: string
  couple_email: string

  bride_name: string
  groom_name: string
  bride_name_ar?: string
  groom_name_ar?: string

  event_date: string
  venue_name: string
  venue_address?: string
  gps_google?: string
  gps_apple?: string

  template_id: TemplateId
  intro_text?: string
  custom_message?: string
  music_url?: string

  /** Nom de la Google Font à appliquer sur tout le template. NULL = polices natives. */
  custom_font?: string

  /** Programme de la soirée. Toujours un tableau (peut être vide). */
  program: ProgramItem[]

  pack: Pack
  show_rsvp: boolean
  show_guestbook: boolean
  moderation_on: boolean

  status: WeddingStatus
  created_at: string
}

export interface RsvpResponse {
  id: string
  wedding_id: string
  guest_name: string
  guest_email?: string
  attending: boolean
  num_guests: number
  message?: string
  dietary_restrictions?: string
  created_at: string
}

export interface GuestbookMessage {
  id: string
  wedding_id: string
  author_name: string
  message: string
  approved: boolean
  created_at: string
}