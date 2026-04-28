import { Link } from 'react-router-dom'
import { Post, Tag as TagProps } from '~/types'
import { GAEventAction, GAEventCategory } from '~/types/ga-events.type'
import calculateReadTime from '~/utils/calculateReadTime'
import { getLongFormattedDate } from '~/utils/date'
import * as gtag from '~/utils/gtags'
import Tag from './Tag'

export default function PostItem(props: Post) {
  const isNonTechPost = props.tags.some(
    (tag) => tag.name.toLowerCase() === 'off-topic'
  )

  const handlePostLinkClick = () => {
    gtag.event({
      action: GAEventAction.PostClick,
      category: isNonTechPost ? GAEventCategory.NonTech : GAEventCategory.Tech,
      label: props.slug,
      value: props.tags.map((tag) => tag.name).join(','),
    })
  }

  return (
    <div>
      <h3 className="text-2xl tablet:text-[1.7rem] mb-[0.8rem]">
        <Link
          to={`/posts/${props.slug}`}
          onClick={handlePostLinkClick}
          className="text-brand visited:text-purple-700 no-underline"
        >
          {props.title}
        </Link>
      </h3>
      <div className="flex items-center gap-2 flex-wrap text-[1.1rem]">
        <small className="font-bold">
          {getLongFormattedDate(props.date)} &bull;{' '}
          {calculateReadTime(props.content)} min read
        </small>
        {props.tags?.length ? (
          <div className="inline-flex gap-2">
            {props.tags.map((tag: TagProps) => (
              <Tag key={tag.name} {...tag} />
            ))}
          </div>
        ) : null}
      </div>
      <p className="mt-2 text-[1.1rem]">{props.description}</p>
    </div>
  )
}
