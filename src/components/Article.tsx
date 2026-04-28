import { marked } from 'marked'
import { Post } from '~/types'
import calculateReadTime from '~/utils/calculateReadTime'
import { getLongFormattedDate } from '~/utils/date'
import Tag from './Tag'

export default function Article(article: Post) {
  return (
    <article className="my-4">
      {article.coverImage ? (
        <img
          src={article.coverImage.url}
          alt="post cover"
          className="rounded-md border border-border w-full"
        />
      ) : null}
      {article.coverImageCredits ? (
        <small
          className="text-text-muted text-[0.75rem] leading-6 block mt-2"
          dangerouslySetInnerHTML={{
            __html: marked(article.coverImageCredits) as string,
          }}
        />
      ) : null}
      <h2 className="text-3xl tablet:text-4xl mt-6 mb-3">{article.title}</h2>
      {article.date ? (
        <div className="text-text-muted text-[0.95rem]">
          {getLongFormattedDate(article.date)} &bull;{' '}
          {calculateReadTime(article.content)} min read
        </div>
      ) : null}
      {article.tags?.length ? (
        <div className="pt-3 pb-2 flex gap-1.5 flex-wrap">
          {article.tags.map((tag) => (
            <Tag key={tag.name} {...tag} />
          ))}
        </div>
      ) : null}
      <div
        className="prose mt-6"
        dangerouslySetInnerHTML={{ __html: marked(article.content || '') as string }}
      />
    </article>
  )
}
