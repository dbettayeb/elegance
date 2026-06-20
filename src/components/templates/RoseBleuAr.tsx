import BismillahStyle from './BismillahStyle'
import { Wedding } from '@/lib/types'

export default function RoseBleuAr({ wedding }: { wedding: Wedding }) {
  return (
    <BismillahStyle
      wedding={wedding}
      bgKey="assets/template5/back5.png"
      decoKey="assets/template5/back5.png"
    />
  )
}
