import { TagButton } from './TagButton'

interface Tag {
  id: string
  label: string
  iconType: 'frontend' | 'daily' | 'movies'
  active?: boolean
}

interface TagSectionProps {
  title: string
  tags: Tag[]
  onViewAll?: () => void
  onTagClick?: (tagId: string) => void
}

export function TagSection({ title, tags, onViewAll, onTagClick }: TagSectionProps) {
  return (
    <div className="content-stretch flex flex-col gap-3 items-start relative shrink-0 w-full">
      <div className="content-stretch flex items-center justify-between px-4 relative shrink-0 w-full">
        <h2 className="font-semibold text-slate-500 text-sm tracking-wider uppercase leading-5">
          {title}
        </h2>
        <button
          onClick={onViewAll}
          className="font-medium text-primary text-xs hover:underline leading-4"
        >
          查看全部
        </button>
      </div>

      <div className="content-stretch flex gap-2 items-start overflow-hidden pb-2 px-4 relative shrink-0 w-full">
        {tags.map((tag) => (
          <TagButton
            key={tag.id}
            label={tag.label}
            iconType={tag.iconType}
            active={tag.active}
            onClick={() => onTagClick?.(tag.id)}
          />
        ))}
      </div>
    </div>
  )
}
