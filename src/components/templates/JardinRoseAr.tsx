import BismillahStyle from './BismillahStyle'
import { Wedding } from '@/lib/types'

export default function JardinRoseAr({ wedding }: { wedding: Wedding }) {
  return (
    <BismillahStyle
      wedding={wedding}
      bgKey="assets/template2/back2.png"
      decoKey="assets/template2/deco2.png"
    />
  )
}
