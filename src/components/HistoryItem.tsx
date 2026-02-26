import { WordIcon, PlusIcon } from './icons'

export interface HistoryItemData {
  id: string
  word: string
  phonetic: string
  translation: string
  time: string
}

interface HistoryItemProps {
  data: HistoryItemData
  onClick?: () => void
  onAddToVocabulary?: () => void
}

export function HistoryItem({ data, onClick, onAddToVocabulary }: HistoryItemProps) {
  return (
    <div
      className="bg-white border border-slate-100 content-stretch flex gap-4 items-center p-4 relative rounded-3xl shrink-0 w-full hover:border-slate-200 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="bg-primary-lighter relative rounded-full shrink-0 size-12 flex items-center justify-center">
        <WordIcon className="text-primary" size={20} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <h3 className="font-bold text-slate-900 text-base leading-6">
            {data.word}
          </h3>
          <span className="text-slate-400 text-xs leading-[15px]">
            {data.time}
          </span>
        </div>
        <p className="text-slate-500 text-sm leading-5">
          {data.phonetic} • {data.translation}
        </p>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation()
          onAddToVocabulary?.()
        }}
        className="shrink-0 hover:opacity-70 transition-opacity p-1 hover:bg-slate-100 rounded-full"
      >
        <PlusIcon className="text-primary" size={20} />
      </button>
    </div>
  )
}
