import { Playlist } from '~/types'

type PlaylistCardProps = Playlist & {
  onSelect: (playlist: Playlist) => void
}

export default function PlaylistCard({ onSelect, ...playlist }: PlaylistCardProps) {
  const { name, description, image, trackCount } = playlist

  return (
    <button
      type="button"
      onClick={() => onSelect(playlist)}
      className="group block w-full text-left p-0 cursor-pointer"
    >
      <div className="aspect-square rounded-md overflow-hidden border border-border bg-code-bg">
        {image ? (
          <img
            src={image}
            alt=""
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        ) : null}
      </div>
      <h3 className="mt-2 text-sm tablet:text-base font-medium text-text group-hover:text-brand transition-colors truncate">
        {name}
      </h3>
      <p className="text-[0.8rem] text-text-muted">
        {trackCount} {trackCount === 1 ? 'track' : 'tracks'}
      </p>
      {description ? (
        <p className="text-[0.8rem] text-text-muted line-clamp-2 mt-0.5">
          {description}
        </p>
      ) : null}
    </button>
  )
}
