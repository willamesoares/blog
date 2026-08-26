import { useEffect } from 'react'
import { Playlist } from '~/types'

type PlaylistPreviewModalProps = {
  playlist: Playlist
  onClose: () => void
}

export default function PlaylistPreviewModal({
  playlist,
  onClose,
}: PlaylistPreviewModalProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={playlist.name}
        className="bg-surface rounded-lg w-full max-w-sm p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-medium text-text truncate pr-4">
            {playlist.name}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="shrink-0 text-text-muted hover:text-text transition-colors text-xl leading-none cursor-pointer"
          >
            &times;
          </button>
        </div>
        <iframe
          src={`https://open.spotify.com/embed/playlist/${playlist.id}?utm_source=generator`}
          width="100%"
          height="352"
          style={{ borderRadius: '0.5rem' }}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
        <a
          href={playlist.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-sm text-brand hover:text-brand-hover transition-colors"
        >
          Open in Spotify ↗
        </a>
      </div>
    </div>
  )
}
