import { Suspense } from 'react'
import OrderForm from '@/components/public/OrderForm'

export const metadata = {
  title: 'Commander · Élégance Digitale',
  description: 'Commandez votre invitation digitale de mariage en quelques minutes.',
}

export default function CommanderPage() {
  return (
    <>
      <style>{`
        .cmd-header {
          text-align: center; padding: 64px 28px 32px;
          max-width: 680px; margin: 0 auto;
        }
        .cmd-label {
          font-size: 0.7rem; letter-spacing: 0.45em;
          text-transform: uppercase; color: var(--pub-gold);
          font-weight: 500; margin-bottom: 14px;
        }
        .cmd-title {
          font-family: Georgia, serif; font-size: clamp(1.8rem, 4.5vw, 2.6rem);
          font-weight: 300; margin-bottom: 14px;
        }
        .cmd-sub {
          font-family: Georgia, serif; font-size: 1.05rem;
          font-style: italic; color: var(--pub-text-muted);
        }
      `}</style>

      <section className="cmd-header">
        <p className="cmd-label">Votre demande</p>
        <h1 className="cmd-title">Commençons par votre design.</h1>
        <p className="cmd-sub">Trois étapes simples. On s'occupe du reste.</p>
      </section>

      <Suspense fallback={<div style={{ textAlign: 'center', padding: '40px' }}>Chargement…</div>}>
        <OrderForm />
      </Suspense>
    </>
  )
}