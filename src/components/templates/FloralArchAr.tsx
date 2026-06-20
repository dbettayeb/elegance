import BismillahStyle from './BismillahStyle'
import { Wedding } from '@/lib/types'

export default function FloralArchAr({ wedding }: { wedding: Wedding }) {
  return (
    <BismillahStyle
      wedding={wedding}
      bgKey="assets/template3/deco3.png"
      decoKey="assets/template3/deco3.png"
    />
  )
}
