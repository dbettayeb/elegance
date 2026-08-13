/**
 * Textes du template Soirée, en arabe et en français.
 *
 * Les deux versions sont un seul composant : dupliquer ses 780 lignes
 * garantirait qu'elles divergent dès la première retouche, et c'est
 * précisément ce qu'on veut éviter sur un template encore en évolution.
 *
 * Les libellés des formulaires (« Nom complet », « Présence »…) sont déjà en
 * français dans la version arabe — les invités remplissent en latin — et ne
 * sont donc pas traduits ici.
 */
export interface SoireeStrings {
  dir: 'rtl' | 'ltr'
  lang: string
  /** Locale de formatage de la date et de l'heure. */
  locale: string
  heroTitleDefault: string
  hint: string
  openAria: string
  countdownLabel: string
  countdownTitle: string
  units: readonly [string, string, string, string]
  celebrationsLabel: string
  programLabel: string
  programTitle: string
  venueLabel: string
  dressTitle: string
  /** Phrase de l'aperçu partagé, sans mention de mariage. */
  shareDescription: string
  /** Invite du champ libre du RSVP. */
  notePlaceholder: string
  /** Invite du champ du livre d'or. */
  messagePlaceholder: string
  dressWomen: string
  dressMen: string
  rsvpLabel: string
  /** Titre sur deux lignes : une entrée par ligne, sans balise. */
  rsvpTitle: readonly string[]
  rsvpSuccess: string
  guestbookLabel: string
  guestbookTitle: readonly string[]
  musicPlay: string
  musicPause: string
  /** Ornement encadrant les boutons d'envoi. */
  ornament: string
  /** Mot reliant l'heure de début à l'heure de fin. */
  until: string
}

export const SOIREE_AR: SoireeStrings = {
  dir: 'rtl',
  lang: 'ar',
  // ar-TN donne les mois en arabe avec des chiffres occidentaux, ce qu'utilisent
  // les invitations tunisiennes.
  locale: 'ar-TN',
  heroTitleDefault: 'ليلة العمر',
  hint: 'اضغط للفتح',
  openAria: 'افتح الدعوة',
  countdownLabel: 'العد التنازلي',
  countdownTitle: 'يقترب اليوم الموعود',
  units: ['يوم', 'ساعة', 'دقيقة', 'ثانية'],
  celebrationsLabel: 'الاحتفالات',
  programLabel: 'برنامج الحفل',
  programTitle: 'ترتيب الأحداث',
  venueLabel: 'مكان الحفل',
  dressTitle: 'قواعد اللباس',
  shareDescription: 'يسعدنا دعوتكم لمشاركتنا هذه الليلة.',
  notePlaceholder: 'كلمة إن أحببتم...',
  messagePlaceholder: 'تهانيكم بهذه المناسبة...',
  dressWomen: 'للنساء',
  dressMen: 'للرجال',
  rsvpLabel: 'تأكيد الحضور',
  rsvpTitle: ['هل ستشرفوننا', 'بحضوركم؟'],
  rsvpSuccess: 'جزاكم الله خيراً • Merci pour votre réponse ۞',
  guestbookLabel: 'دفتر التهاني',
  guestbookTitle: ['تهانيكم', 'ودعواتكم'],
  musicPlay: 'تشغيل الموسيقى',
  musicPause: 'إيقاف الموسيقى',
  ornament: '۞',
  until: 'إلى',
}

export const SOIREE_FR: SoireeStrings = {
  dir: 'ltr',
  lang: 'fr',
  locale: 'fr-FR',
  heroTitleDefault: 'Notre soirée',
  hint: 'Cliquez pour ouvrir',
  openAria: "Ouvrir l'invitation",
  countdownLabel: 'Compte à rebours',
  countdownTitle: 'Le grand jour approche',
  units: ['jours', 'heures', 'minutes', 'secondes'],
  celebrationsLabel: 'Célébrations',
  programLabel: 'Programme',
  programTitle: 'Déroulé de la soirée',
  venueLabel: 'Lieu de la fête',
  dressTitle: 'Dress code',
  // Une soirée de henné ou de fiançailles n'a pas de « mariés » : l'invite
  // reste ouverte plutôt que de nommer des rôles qui n'existent pas ce soir-là.
  shareDescription: 'Vous êtes cordialement invités à partager cette soirée avec nous.',
  notePlaceholder: 'Un mot, si vous le souhaitez...',
  messagePlaceholder: 'Vos vœux pour cette soirée...',
  dressWomen: 'Pour les dames',
  dressMen: 'Pour les messieurs',
  rsvpLabel: 'Confirmation de présence',
  rsvpTitle: ['Nous ferez-vous', "l'honneur d'être là ?"],
  rsvpSuccess: 'Merci pour votre réponse ✦',
  guestbookLabel: "Livre d'or",
  guestbookTitle: ['Vos vœux', 'et vos messages'],
  musicPlay: 'Lancer la musique',
  musicPause: 'Couper la musique',
  ornament: '✦',
  until: "jusqu'à",
}

/**
 * Typographie de la version française. La version arabe laisse le marié choisir
 * parmi les thèmes calligraphiques ; en latin ces polices n'existent pas, d'où
 * un couple fixe au même esprit — une antique élancée pour les titres, une
 * linéale discrète pour le texte courant.
 */
export const SOIREE_FR_THEME: { display: string; body: string; googleFonts: string } = {
  display: `'Cormorant Garamond', Georgia, serif`,
  body: `'Jost', 'Helvetica Neue', sans-serif`,
  googleFonts: 'Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300&family=Jost:wght@300;400;500',
}
