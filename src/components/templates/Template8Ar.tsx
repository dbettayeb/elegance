import BismillahStyle from './BismillahStyle'
import { Wedding } from '@/lib/types'

export default function Template8Ar({ wedding }: { wedding: Wedding }) {
  return (
    <BismillahStyle
      wedding={wedding}
      bgKey="assets/template8/deco8.png"
      decoKey="assets/template8/deco8.png"
    />
  )
}
