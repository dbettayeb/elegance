export interface Wedding {
  id: string
  slug: string
  access_token: string
  couple_token: string
  couple_email: string
  bride_name: string
  groom_name: string
  event_date: string
  venue_name: string
  venue_address?: string
  gps_google?: string
  gps_apple?: string
  template_id: 'blanc_dore' | 'nuit_etoilee' | 'jardin_andalou' | 'minimaliste' | 'rose_poudre' | 'marbre_noir'
  music_url?: string
  intro_text?: string
  custom_message?: string
  program: ProgramItem[]
  pack: 'essentiel' | 'prestige' | 'haute_couture'
  show_guestbook: boolean
  moderation_on: boolean
  status: 'active' | 'archived' | 'suspended'
  expires_at?: string
  created_at: string
}

export interface ProgramItem {
  time: string    // "19:00"
  event: string   // "Katb El Kteb"
  venue?: string  // "Dar El Jeld"
}

export interface RSVP {
  id: string
  wedding_id: string
  name: string
  phone?: string
  status: 'present' | 'absent' | 'maybe'
  guests: number
  note?: string
  created_at: string
}

export interface GuestMessage {
  id: string
  wedding_id: string
  author_name: string
  message: string
  photo_url?: string
  approved: boolean
  created_at: string
}