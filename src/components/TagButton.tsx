import { BookMarkedIcon, MessageSquareIcon, FilmIcon } from './icons'

interface TagButtonProps {
  label: string
  iconType: 'frontend' | 'daily' | 'movies'
  active?: boolean
  onClick?: () => void
}

const iconMap = {
  frontend: BookMarkedIcon,
  daily: MessageSquareIcon,
  movies: FilmIcon,
}

export function TagButton({ label, iconType, active = false, onClick }: TagButtonProps) {
  const Icon = iconMap[iconType]

  return (
    <button
      onClick={onClick}
      className={`
        content-stretch flex gap-1.5 h-10 items-center justify-center overflow-clip px-3.5 relative rounded-full shrink-0 transition-colors border
        ${active
          ? 'bg-primary border-transparent shadow-[0px_4px_6px_-1px_rgba(36,99,235,0.2),0px_2px_4px_-2px_rgba(36,99,235,0.2)] text-white'
          : 'bg-white border-slate-200 text-[#334155] hover:border-primary hover:text-primary'
        }
      `}
    >
      <Icon className={active ? 'text-white' : 'text-slate-600'} />
      <span className="font-medium text-sm leading-5 whitespace-nowrap">
        {label}
      </span>
    </button>
  )
}
