import { marked } from 'marked'
import { Post } from '~/types'
import calculateReadTime from '~/utils/calculateReadTime'
import { getLongFormattedDate } from '~/utils/date'
import Tag from './Tag'

export default function Article(article: Post) {
  return (
    <article className="my-4">
      {article.coverImage ? (
        <img src={article.coverImage.url} alt="post cover" />
      ) : null}
      {article.coverImageCredits ? (
        <small
          className="text-gray-500 text-[0.7rem] leading-6 block"
          dangerouslySetInnerHTML={{
            __html: marked(article.coverImageCredits) as string,
          }}
        />
      ) : null}
      <h2>{article.title}</h2>
      {article.date ? (
        <span className="font-bold text-[1.1rem]">
          {getLongFormattedDate(article.date)} &bull;{' '}
          {calculateReadTime(article.content)} min read
        </span>
      ) : null}
      {article.tags?.length ? (
        <div className="pt-2 pb-4 flex gap-2">
          {article.tags.map((tag) => (
            <Tag key={tag.name} {...tag} />
          ))}
        </div>
      ) : null}
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: marked(article.content || '') as string }}
      />
    </article>
  )
}
