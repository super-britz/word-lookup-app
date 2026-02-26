import { HomeIcon, BookOpenIcon, RotateCcwIcon, SettingsIcon } from './icons'

interface NavItem {
  id: string
  label: string
  active?: boolean
}

interface BottomNavProps {
  items: NavItem[]
  onNavigate?: (itemId: string) => void
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  home: HomeIcon,
  vocabulary: BookOpenIcon,
  review: RotateCcwIcon,
  settings: SettingsIcon,
}

export function BottomNav({ items, onNavigate }: BottomNavProps) {
  return (
    <div className="absolute backdrop-blur-md bg-white/80 border-slate-200 border-solid border-t bottom-0 content-stretch flex flex-col gap-5 items-center left-0 pb-6 pt-3 px-6 right-0 z-[2]">
      <div className="relative shrink-0 w-full flex items-center justify-between">
        {items.map((item) => {
          const Icon = iconMap[item.id]
          return (
            <button
              key={item.id}
              onClick={() => onNavigate?.(item.id)}
              className="content-stretch flex flex-col gap-0.5 items-center relative shrink-0 hover:opacity-80 transition-opacity"
            >
              {Icon && (
                <Icon
                  className={item.active ? 'text-primary' : 'text-slate-400'}
                />
              )}
              <span
                className={`text-xs leading-[15px] ${
                  item.active
                    ? 'font-semibold text-primary'
                    : 'font-medium text-slate-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </div>

      <div className="bg-slate-300 h-1 opacity-40 rounded-full shrink-0 w-32" />
    </div>
  )
}
