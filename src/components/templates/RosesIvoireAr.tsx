import BismillahStyle from './BismillahStyle'
import { Wedding } from '@/lib/types'

export default function RosesIvoireAr({ wedding }: { wedding: Wedding }) {
  return (
    <BismillahStyle
      wedding={wedding}
      bgKey="assets/template4/deco4.png"
      decoKey="assets/template4/deco4.png"
    />
  )
}
