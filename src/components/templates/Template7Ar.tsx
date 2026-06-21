import BismillahStyle from './BismillahStyle'
import { Wedding } from '@/lib/types'

export default function Template7Ar({ wedding }: { wedding: Wedding }) {
  return (
    <BismillahStyle
      wedding={wedding}
      bgKey="assets/template7/deco7.png"
      decoKey="assets/template7/deco7.png"
    />
  )
}
