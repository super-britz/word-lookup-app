import { HistoryItem, HistoryItemData } from './HistoryItem'

interface HistoryListProps {
  items: HistoryItemData[]
  onClear?: () => void
  onItemClick?: (id: string) => void
  onAddToVocabulary?: (id: string) => void
}

export function HistoryList({ items, onClear, onItemClick, onAddToVocabulary }: HistoryListProps) {
  return (
    <div className="content-stretch flex flex-col gap-4 items-start relative shrink-0 w-full">
      <div className="content-stretch flex items-center justify-between px-4 relative shrink-0 w-full">
        <h2 className="font-bold text-slate-900 text-lg leading-7">
          查词历史
        </h2>

        <button
          onClick={onClear}
          className="flex gap-1 items-center text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg className="w-4 h-5" fill="none" viewBox="0 0 16 20">
            <path
              d="M3 5h10M6.5 8v6M9.5 8v6M4 5l1 9a2 2 0 002 2h2a2 2 0 002-2l1-9M7 5V3a1 1 0 011-1h0a1 1 0 011 1v2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-sm leading-5">清空</span>
        </button>
      </div>

      <div className="content-stretch flex flex-col gap-1 items-start px-4 relative shrink-0 w-full">
        {items.map((item) => (
          <HistoryItem
            key={item.id}
            data={item}
            onClick={() => onItemClick?.(item.id)}
            onAddToVocabulary={() => onAddToVocabulary?.(item.id)}
          />
        ))}
      </div>
    </div>
  )
}
