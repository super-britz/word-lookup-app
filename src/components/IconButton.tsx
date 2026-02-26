interface IconButtonProps {
  iconSrc: string
  onClick?: () => void
}

export function IconButton({ iconSrc, onClick }: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      className="content-stretch flex flex-col items-center justify-center px-2 py-1.5 relative rounded-full shrink-0 hover:bg-slate-100 transition-colors"
    >
      <div className="-scale-y-100 flex-none">
        <div className="h-7 relative w-6">
          <img alt="Icon" className="block max-w-none size-full" src={iconSrc} />
        </div>
      </div>
    </button>
  )
}
