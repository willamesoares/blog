import { useEffect, useRef } from 'react'
import { ScriptConfig } from '~/types/script-config.type'

export default function CommentSection() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const script = document.createElement('script')
    const config: ScriptConfig = {
      src: 'https://utteranc.es/client.js',
      repo: 'willamesoares/blog',
      theme: 'github-light',
      label: 'blog post comments',
      async: true,
      'issue-term': 'title',
      crossOrigin: 'anonymous',
    }

    Object.entries(config).forEach(([key, value]) => {
      script.setAttribute(key, String(value))
    })

    rootRef.current?.appendChild(script)
  }, [])

  return (
    <section className="mt-16 pt-8 border-t border-border">
      <h3 className="text-xl mb-4">Comments</h3>
      <div
        ref={rootRef}
        className="[&_.utterances]:max-w-full"
      />
    </section>
  )
}
