import BismillahStyle from './BismillahStyle'
import { Wedding } from '@/lib/types'

export default function ToileBleueAr({ wedding }: { wedding: Wedding }) {
  return (
    <BismillahStyle
      wedding={wedding}
      bgKey="assets/template1/deco1.png"
      decoKey="assets/template1/deco1.png"
    />
  )
}
