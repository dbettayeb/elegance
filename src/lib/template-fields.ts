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
  /** true → afficher le bloc familles arabes (familles_intro, prefix, name) */
  arabicFamilies?: boolean
  /** true → afficher les boutons préréglages (Hadith, Bénédiction, إن السرور) */
  arabicBlessingPresets?: boolean
}

export interface BlessingPreset { label: string; value: string }

export const ARABIC_FAMILIES_INTRO_PRESETS: BlessingPreset[] = [
  { label: '١', value: 'إِنَّ السُّرُورَ إِذَا تَشَارَكْنَاهُ تَضَاعَفَتْ بَسَمَاتُهُ،\nوَبِكُلِّ حُبٍّ وَوُدٍّ تَتَشَرَّفُ' },
  { label: '٢', value: 'لِأَنَّ الفَرَحَ يَزْدَادُ بَهْجَةً بِمُشَارَكَةِ الأَحِبَّةِ،\nفَإِنَّهُ يَسُرُّ وَيُشَرِّفُ' },
  { label: '٣', value: 'إِنَّ أَجْمَلَ اللَّحَظَاتِ هِيَ الَّتِي نَتَقَاسَمُهَا مَعَ مَنْ نُحِبُّ،\nلِذَا تَتَشَرَّفُ' },
  { label: '٤', value: 'بِمُشَارَكَتِكُمْ يَكْتَمِلُ الفَرَحُ وَتَزْدَادُ البَهْجَةُ،\nوَبِكُلِّ مَوَدَّةٍ تَتَشَرَّفُ' },
  { label: '٥', value: 'إِنَّ لِلْفَرَحِ مَعْنًى أَجْمَلَ حِينَ نَتَقَاسَمُهُ مَعَ الأَهْلِ وَالأَحِبَّةِ،\nوَعَلَيْهِ تَتَشَرَّفُ' },
  { label: '٦', value: 'إِيمَانًا مِنَّا بِأَنَّ الفَرَحَ يَكْتَمِلُ بِحُضُورِكُمْ،\nتَتَشَرَّفُ بِدَعْوَتِكُمْ لِمُشَارَكَةِ أَفْرَاحِهِمَا' },
]

export const ARABIC_BLESSING_PRESETS: BlessingPreset[] = [
  { label: 'Hadith mariage', value: 'بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ' },
  { label: 'Bénédiction',    value: 'وَلَكُمُ العَاقِبَةُ فِي الأَفْرَاحِ وَالمَسَرَّاتِ' },
  { label: '١', value: 'بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ،\nوَأَتَمَّ عَلَيْكُمَا بِالسَّعَادَةِ وَالْهَنَاءِ' },
  { label: '٢', value: 'بَارَكَ اللَّهُ لَكُمَا وَأَلْفَ بَيْنَ قُلُوبِكُمَا،\nوَجَعَلَ أَيَّامَكُمَا مَحَبَّةً وَرَحْمَةً وَسُرُورًا' },
  { label: '٣', value: 'بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ فِيكُمَا وَعَلَيْكُمَا،\nوَجَمَعَ بَيْنَكُمَا عَلَى مَوَدَّةٍ وَرَحْمَةٍ دَائِمَةٍ' },
  { label: '٤', value: 'وَجَعَلَ اللَّهُ زَوَاجَكُمَا مَبَارَكًا،\nوَرَزَقَكُمَا السَّكِينَةَ وَالْمَوَدَّةَ وَالرَّحْمَةَ' },
  { label: '٥', value: 'بَارَكَ اللَّهُ لَكُمَا فِي حَيَاتِكُمَا،\nوَجَعَلَ بَيْنَكُمَا مَوَدَّةً وَرَحْمَةً وَدَوَامَ السَّعَادَةِ' },
  { label: '٦', value: 'لَكُمَا كُلُّ السَّعَادَةِ وَالْبَهْجَةِ فِي حَيَاتِكُمَا،\nوَلَكُمُ أَجْمَلُ الأَيَّامِ وَأَطْيَبُ الأَقْدَارِ' },
]

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
  bismillah: {
    customMessage: ARABIC_BLESSING,
    arabicFamilies: true,
    arabicBlessingPresets: true,
  },
  al_nour: {
    introText: {
      label: 'Texte d\'introduction (FR)',
      placeholder: 'Avec la bénédiction de…',
    },
    customMessage: { ...ARABIC_BLESSING, rows: 2 },
    arabicFamilies: true,
    arabicBlessingPresets: true,
  },

  // ─── Statiques arabes (BismillahStyle) ───
  template_7_ar:   { customMessage: ARABIC_BLESSING, arabicFamilies: true, arabicBlessingPresets: true },
  template_8_ar:   { customMessage: ARABIC_BLESSING, arabicFamilies: true, arabicBlessingPresets: true },
  toile_bleue_ar:  { customMessage: ARABIC_BLESSING, arabicFamilies: true, arabicBlessingPresets: true },
  jardin_rose_ar:  { customMessage: ARABIC_BLESSING, arabicFamilies: true, arabicBlessingPresets: true },
  floral_arch_ar:  { customMessage: ARABIC_BLESSING, arabicFamilies: true, arabicBlessingPresets: true },
  roses_ivoire_ar: { customMessage: ARABIC_BLESSING, arabicFamilies: true, arabicBlessingPresets: true },
  rose_bleu_ar:    { customMessage: ARABIC_BLESSING, arabicFamilies: true, arabicBlessingPresets: true },
}

export function getTemplateFields(id: string): TemplateFieldsSchema {
  return TEMPLATE_FIELDS[id] ?? {}
}
