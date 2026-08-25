import { Link } from 'react-router-dom'
import { Post, Tag as TagProps } from '~/types'
import { GAEventAction, GAEventCategory } from '~/types/ga-events.type'
import calculateReadTime from '~/utils/calculateReadTime'
import { getLongFormattedDate } from '~/utils/date'
import * as gtag from '~/utils/gtags'
import Tag from './Tag'

export default function PostItem(props: Post) {
  const handlePostLinkClick = () => {
    gtag.event({
      action: GAEventAction.PostClick,
      category: GAEventCategory.Post,
      label: props.slug,
      value: props.tags.map((tag) => tag.name).join(','),
    })
  }

  return (
    <article>
      <h3 className="text-xl tablet:text-2xl mb-2 leading-snug">
        <Link
          to={`/post/${props.slug}`}
          onClick={handlePostLinkClick}
          className="text-text hover:text-brand transition-colors no-underline"
        >
          {props.title}
        </Link>
      </h3>
      <div className="flex items-center gap-2 flex-wrap text-[0.9rem] text-text-muted">
        <small>
          {getLongFormattedDate(props.date)} &bull;{' '}
          {calculateReadTime(props.content)} min read
        </small>
        {props.tags?.length ? (
          <div className="inline-flex gap-1.5">
            {props.tags.map((tag: TagProps) => (
              <Tag key={tag.name} {...tag} />
            ))}
          </div>
        ) : null}
      </div>
      <p className="mt-2 text-[1rem] text-text-muted">{props.description}</p>
    </article>
  )
}
