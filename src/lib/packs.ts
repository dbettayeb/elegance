export interface Pack {
  id: 'essentiel' | 'prestige' | 'haute_couture'
  name: string
  price: number
  currency: string
  tagline: string
  features: string[]
  highlight?: boolean
}

export const PACKS: Pack[] = [
  {
    id: 'essentiel',
    name: 'Essentiel',
    price: 180,
    currency: 'DT',
    tagline: 'Pour démarrer simplement',
    features: [
      'Choix parmi 9 designs',
      'RSVP en ligne illimité',
      'Livre d\'or modéré',
      'Compte à rebours',
      'Lien Google + Apple Maps',
      'Lien unique partageable',
      'Hébergement 12 mois',
    ],
  },
  {
    id: 'prestige',
    name: 'Prestige',
    price: 350,
    currency: 'DT',
    tagline: 'Le choix le plus populaire',
    highlight: true,
    features: [
      'Tout du pack Essentiel',
      'Personnalisation avancée (textes, polices)',
      'Programme détaillé de la soirée',
      'Musique d\'ambiance',
      'Portail mariés (suivi des confirmations)',
      'Modération sur mesure',
      'Hébergement 24 mois',
      'Support prioritaire',
    ],
  },
  {
    id: 'haute_couture',
    name: 'Haute Couture',
    price: 550,
    currency: 'DT',
    tagline: 'L\'expérience la plus aboutie',
    features: [
      'Tout du pack Prestige',
      'Design personnalisé sur mesure',
      'Photos et illustrations dédiées',
      'Animations et effets premium',
      'Sous-domaine personnalisé',
      'Modifications illimitées',
      'Hébergement à vie',
      'Accompagnement dédié',
    ],
  },
]

export function getPack(id: string): Pack {
  return PACKS.find(p => p.id === id) ?? PACKS[0]
}