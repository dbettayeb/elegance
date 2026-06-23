/**
 * Décrit, pour chaque template, les champs texte personnalisables
 * supplémentaires (au-delà des prénoms / date / lieu communs à tous).
 *
 * Le panneau de personnalisation de l'aperçu lit ce schéma pour
 * n'afficher que les champs qui existent réellement dans le template
 * sélectionné.
 */

export interface FieldDef {
  label: string
  placeholder: string
  help?: string
  rows?: number   // > 0 → <textarea>, sinon <input>
}

export interface TemplateFieldsSchema {
  introText?:      FieldDef
  customMessage?:  FieldDef
  weddingDayText?: FieldDef
  /** true → ne pas afficher le champ intro_text générique dans le panneau */
  hideIntroText?:  boolean
}

const ARABIC_BLESSING: FieldDef = {
  label: 'Bénédiction (arabe)',
  placeholder: '« بَارَكَ اللَّهُ لَكُمَا… »',
  help: 'Verset ou bénédiction affichée sur la carte',
  rows: 3,
}

export const TEMPLATE_FIELDS: Record<string, TemplateFieldsSchema> = {
  // ─── Dynamiques ───
  coeur_dore: {
    introText: {
      label: 'Phrase au-dessus des prénoms',
      placeholder: 'Vous êtes cordialement invités au mariage de',
    },
    customMessage: {
      label: 'Message personnel (sous la date)',
      placeholder: 'Un mot pour vos invités…',
      rows: 3,
    },
  },
  alexa_richard: {
    hideIntroText: true,
    weddingDayText: {
      label: 'Accroche du héro',
      placeholder: 'are getting married!',
    },
    introText: {
      label: 'Titre de la section lettre',
      placeholder: 'Dear friends and family,',
    },
    customMessage: {
      label: 'Paragraphe de la lettre',
      placeholder: `As we get ready to say "I do," we feel grateful for the wonderful people in our lives.\n\nYour support means the world to us, and we would be honored to have you with us as we begin our life together.`,
      rows: 5,
    },
  },
  viktor_paula: {
    hideIntroText: true,
    weddingDayText: {
      label: 'Titre du hero (vidéo)',
      placeholder: 'Wedding Day',
    },
    introText: {
      label: 'Titre de la section lettre',
      placeholder: 'Dear Friends and Family,',
    },
    customMessage: {
      label: 'Paragraphe de la lettre',
      placeholder: `As we get ready to say "I do," we feel grateful for the wonderful people in our lives. Your support means the world to us, and we would be honored to have you with us as we begin our life together.`,
      rows: 5,
    },
  },

  // ─── Statiques FR ───
  bismillah:    { customMessage: ARABIC_BLESSING },
  al_nour: {
    introText: {
      label: 'Texte d\'introduction (FR)',
      placeholder: 'Avec la bénédiction de…',
    },
    customMessage: { ...ARABIC_BLESSING, rows: 2 },
  },

  // ─── Statiques arabes (BismillahStyle) ───
  template_7_ar:   { customMessage: ARABIC_BLESSING },
  template_8_ar:   { customMessage: ARABIC_BLESSING },
  toile_bleue_ar:  { customMessage: ARABIC_BLESSING },
  jardin_rose_ar:  { customMessage: ARABIC_BLESSING },
  floral_arch_ar:  { customMessage: ARABIC_BLESSING },
  roses_ivoire_ar: { customMessage: ARABIC_BLESSING },
  rose_bleu_ar:    { customMessage: ARABIC_BLESSING },
}

export function getTemplateFields(id: string): TemplateFieldsSchema {
  return TEMPLATE_FIELDS[id] ?? {}
}
