export interface VersePreset {
  key: string
  label: string
  verse: string
  ref_bs: string
  ref_an: string
}

export interface IntroPreset {
  key: string
  label: string
  text: string
}

export const VERSE_PRESETS: VersePreset[] = [
  {
    key: 'roum_21',
    label: 'سورة الروم، الآية ٢١',
    verse: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
    ref_bs: '﴿ سورة الروم - الآية ٢١ ﴾',
    ref_an: '[ الروم: ٢١ ]',
  },
  {
    key: 'furqan_74',
    label: 'سورة الفرقان، الآية ٧٤',
    verse: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا',
    ref_bs: '﴿ سورة الفرقان - الآية ٧٤ ﴾',
    ref_an: '[ الفرقان: ٧٤ ]',
  },
  {
    key: 'araf_189',
    label: 'سورة الأعراف، الآية ١٨٩',
    verse: 'هُوَ الَّذِي خَلَقَكُم مِّن نَّفْسٍ وَاحِدَةٍ وَجَعَلَ مِنْهَا زَوْجَهَا لِيَسْكُنَ إِلَيْهَا',
    ref_bs: '﴿ سورة الأعراف - الآية ١٨٩ ﴾',
    ref_an: '[ الأعراف: ١٨٩ ]',
  },
  {
    key: 'nisa_1',
    label: 'سورة النساء، الآية ١',
    verse: 'يَا أَيُّهَا النَّاسُ اتَّقُوا رَبَّكُمُ الَّذِي خَلَقَكُم مِّن نَّفْسٍ وَاحِدَةٍ وَخَلَقَ مِنْهَا زَوْجَهَا وَبَثَّ مِنْهُمَا رِجَالًا كَثِيرًا وَنِسَاءً',
    ref_bs: '﴿ سورة النساء - الآية ١ ﴾',
    ref_an: '[ النساء: ١ ]',
  },
]

export function getVersePreset(key?: string | null): VersePreset {
  return VERSE_PRESETS.find(p => p.key === key) ?? VERSE_PRESETS[0]
}

export const INTRO_PRESETS: IntroPreset[] = [
  { key: 'share_joy',    label: 'إن السرور إذا تشارك...',         text: 'إن السرور إذا تشارك ضوعفت بسماته\nبكل حب وود تتشرف' },
  { key: 'joy_invite',  label: 'بكل فرح وبهجة تدعوكم...',        text: 'بكل فرح وبهجة تدعوكم عائلتا العروس والعريس' },
  { key: 'quran',       label: 'حفل القرآن الكريم والزفاف',       text: 'يسعد بدعوتكم إلى حفل القرآن الكريم والزفاف' },
  { key: 'honor',       label: 'يتشرف والدا العروس والعريس...',   text: 'يتشرف والدا العروس والعريس بدعوتكم إلى حفل الزفاف' },
]
