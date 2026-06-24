import { notFound } from 'next/navigation'
import { TEMPLATES } from '@/lib/templates'
import PublicShell from '@/components/public/PublicShell'
import TemplatePreviewClient from '@/components/public/TemplatePreviewClient'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const template = TEMPLATES.find(t => t.id === id)
  if (!template) return { title: 'Design introuvable' }
  return {
    title: `${template.name} · Élégance Digitale`,
    description: template.description,
  }
}

export default async function PublicTemplatePreview({ params }: Props) {
  const { id } = await params
  const template = TEMPLATES.find(t => t.id === id)
  if (!template) notFound()

  return (
    <PublicShell>
      <style>{CSS}</style>
      <TemplatePreviewClient templateId={template.id} templateName={template.name} />
    </PublicShell>
  )
}

const CSS = `
  /* Constrain the whole shell to the viewport so the iframe fills exactly the remaining height */
  .pub-shell { height: 100vh !important; overflow: hidden !important; }
  .pub-header { display: none !important; }
  .pub-footer { display: none !important; }
  main { height: 100% !important; display: flex !important; flex-direction: column !important; }
`
