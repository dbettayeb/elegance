export interface Wedding {
  id: string
  slug: string
  access_token: string
  couple_token: string
  couple_email: string
  couple_phone?: string
  bride_name: string
  groom_name: string
  bride_name_ar?: string
  groom_name_ar?: string
  bride_family_ar?: string
  groom_family_ar?: string
  bride_family_prefix_ar?: string
  groom_family_prefix_ar?: string
  families_intro_ar?: string
  event_date: string
  venue_name: string
  venue_address?: string
  gps_google?: string
  gps_apple?: string
  template_id:
  | 'blanc_dore' | 'nuit_etoilee' | 'jardin_andalou'
  | 'minimaliste' | 'rose_poudre' | 'marbre_noir'
  | 'bismillah' | 'al_asala' | 'al_qamar'
  | 'sceau_royal'| 'cristal_champagne'
  | 'chateau_pivoines' | 'coeur_dore' | 'viktor_paula'
  | 'alexa_richard' | 'al_nour'
  music_url?: string
  background_image?: string
  decoration_image?: string
  custom_font?: string
  intro_text?: string
  custom_message?: string
  program: ProgramItem[]
  pack: 'essentiel' | 'prestige' | 'haute_couture'
  show_rsvp: boolean
  show_guestbook: boolean
  show_countdown: boolean
  moderation_on: boolean
  bismillah_palette?: 'or_classique' | 'emeraude' | 'bordeaux' | 'marine_dore' | 'rose_cuivre' | 'noir_elegant'
  guest_invite_enabled?: boolean
  guest_invite_prefix_ar?: string
  guest_invite_suffix_ar?: string
  status: 'active' | 'archived' | 'suspended' | 'lead'
  expires_at?: string
  created_at: string
}

export interface ProgramItem {
  time: string
  event: string
  venue?: string
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

export interface GuestInvitation {
  id: string
  wedding_id: string
  guest_name_ar: string
  prefix_ar?: string
  suffix_ar?: string
  token: string
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