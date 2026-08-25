import { marked } from 'marked'
import { Poem } from '~/types'

export default function PoemCard({ name, content }: Poem) {
  return (
    <article className="bg-poem-card border border-poem-border rounded-lg p-6 tablet:p-8 mb-6 break-inside-avoid">
      <h2 className="text-xl tablet:text-2xl text-poem-accent mb-4">{name}</h2>
      <div
        className="prose text-[0.95rem]"
        dangerouslySetInnerHTML={{
          __html: marked(content || '', { breaks: true }) as string,
        }}
      />
    </article>
  )
}
