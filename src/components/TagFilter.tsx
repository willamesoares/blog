type TagFilterProps = {
  tags: string[]
  selectedTags: string[]
  onToggle: (tag: string) => void
  onClear: () => void
}

export default function TagFilter({ tags, selectedTags, onToggle, onClear }: TagFilterProps) {
  if (!tags.length) return null

  return (
    <nav aria-label="Filter posts by tag" className="flex flex-wrap gap-2 py-2 mb-2">
      {tags.map((tag) => {
        const isSelected = selectedTags.includes(tag)
        return (
          <button
            key={tag}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onToggle(tag)}
            className={[
              'text-[0.75rem] rounded-full px-2.5 py-1 font-medium transition-colors',
              isSelected
                ? 'bg-brand text-white'
                : 'bg-brand-soft text-brand hover:opacity-80',
            ].join(' ')}
          >
            {tag}
          </button>
        )
      })}
      {selectedTags.length ? (
        <button
          type="button"
          onClick={onClear}
          className="text-[0.75rem] rounded-full px-2.5 py-1 font-medium transition-colors border border-border text-text-muted hover:text-text hover:border-text-muted"
        >
          Clear
        </button>
      ) : null}
    </nav>
  )
}
