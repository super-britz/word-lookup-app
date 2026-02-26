import { SearchBar } from './SearchBar'
import { useToast } from './Toast'
import { LogoIcon, MenuIcon } from './icons'

interface HeaderProps {
  title: string
  subtitle: string
  onSearch?: (query: string) => void
}

export function Header({
  title,
  subtitle,
  onSearch
}: HeaderProps) {
  const { showToast } = useToast()

  return (
    <div
      className="backdrop-blur-sm bg-[rgba(246,246,248,0.8)] content-stretch flex flex-col gap-4 items-start pb-2 pt-6 px-4 shrink-0 sticky top-0 w-full z-[3]"
      data-name="Header - Top App Bar"
    >
      <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
        <div className="content-stretch flex gap-3 items-center relative shrink-0">
          <div className="bg-primary content-stretch flex items-center justify-center overflow-clip relative rounded-full shadow-primary shrink-0 size-10">
            <LogoIcon className="text-white" size={20} />
          </div>

          <div className="content-stretch flex flex-col items-start relative shrink-0">
            <h1 className="font-bold text-slate-900 text-xl tracking-tight whitespace-nowrap leading-7">
              {title}
            </h1>
            <p className="text-slate-500 text-xs whitespace-nowrap leading-4">
              {subtitle}
            </p>
          </div>
        </div>

        <button
          onClick={() => showToast('菜单功能开发中', 'info')}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <MenuIcon className="text-slate-700" size={20} />
        </button>
      </div>

      <SearchBar onSearch={onSearch} />
    </div>
  )
}
