import { useState } from 'react'
import { useToast } from './Toast'
import { SearchIcon, MicIcon } from './icons'

interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
}

export function SearchBar({
  placeholder = "搜索单词，探索词源...",
  onSearch
}: SearchBarProps) {
  const [value, setValue] = useState('')
  const { showToast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) {
      onSearch?.(value.trim())
    }
  }

  const handleVoiceSearch = () => {
    showToast('语音搜索功能开发中', 'info')
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 content-stretch flex h-14 items-center px-4 py-px relative rounded-3xl shadow-card shrink-0 w-full">
      <SearchIcon className="text-slate-400 shrink-0" size={20} />

      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="flex-1 min-w-0 px-3 py-2 text-base text-slate-900 placeholder:text-slate-400 bg-transparent border-none outline-none"
      />

      <button
        type="button"
        onClick={handleVoiceSearch}
        className="shrink-0 hover:opacity-80 transition-opacity"
      >
        <MicIcon className="text-slate-400" size={20} />
      </button>
    </form>
  )
}
