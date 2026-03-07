import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { BottomNav } from '../components/BottomNav'
import { useToast } from '../components/Toast'
import { trpc } from '../lib/trpc'
import { toWord } from '../lib/word'
import type { Word } from '../store/useAppStore'

export default function SearchResultPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const { addToHistory, addToVocabulary, incrementTodayLearned } = useAppStore()
  const { showToast } = useToast()
  const [result, setResult] = useState<Word | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let cancelled = false

    const runLookup = async () => {
      if (!query.trim()) {
        setErrorMessage('请输入要查询的单词')
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setErrorMessage('')

      try {
        const response = await trpc.word.lookup.query({ query: query.trim() })
        if (!cancelled) {
          setResult(toWord(response))
        }
      } catch (error) {
        if (!cancelled) {
          console.error(error)
          setErrorMessage('Cloudflare Worker 查询失败，请检查 api.liangsheng.life 是否可访问')
          setResult(null)
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    runLookup()

    return () => {
      cancelled = true
    }
  }, [query])

  const handleAddToVocabulary = () => {
    if (!result) {
      return
    }

    addToVocabulary(result)
    addToHistory(result)
    incrementTodayLearned()
    showToast('已加入生词本！', 'success')
  }

  const navItems = [
    { id: 'home', label: '首页' },
    { id: 'vocabulary', label: '生词本' },
    { id: 'review', label: '复习' },
    { id: 'settings', label: '设置' },
  ]

  return (
    <div className="flex items-center justify-center size-full">
      <div className="bg-background content-stretch flex flex-col h-[1200px] isolate items-start max-w-[375px] overflow-clip relative shadow-container shrink-0 w-full">
        {/* Header */}
        <div className="backdrop-blur-sm bg-white/80 border-b border-slate-200 content-stretch flex items-center justify-between px-4 py-3 shrink-0 w-full z-10">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="font-bold text-slate-900 text-lg">查词结果</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto pb-32 w-full">
          <div className="p-6 space-y-6">
            {isLoading && (
              <div className="bg-white rounded-3xl p-6 shadow-card">
                <p className="text-slate-500 text-sm mb-2">正在通过 Cloudflare Worker 查询：</p>
                <p className="text-slate-900 font-semibold text-xl">{query}</p>
              </div>
            )}

            {!isLoading && errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-3xl p-6 shadow-card">
                <h2 className="font-semibold text-red-700 mb-2">查询失败</h2>
                <p className="text-red-600 text-sm">{errorMessage}</p>
              </div>
            )}

            {/* Word Card */}
            {result && (
              <>
                <div className="bg-white rounded-3xl p-6 shadow-card">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="font-bold text-3xl text-slate-900 mb-2">{result.word}</h2>
                      <p className="text-slate-500 text-sm">{result.phonetic}</p>
                    </div>
                    <button
                      onClick={handleAddToVocabulary}
                      className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium shadow-primary-sm hover:bg-primary/90 transition-colors"
                    >
                      加入生词本
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-slate-700 text-sm mb-1">释义</h3>
                      <p className="text-slate-900">{result.translation}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-700 text-sm mb-1">定义</h3>
                      <p className="text-slate-600">{result.definition}</p>
                    </div>

                    {result.etymology && (
                      <div>
                        <h3 className="font-semibold text-slate-700 text-sm mb-1">词源</h3>
                        <p className="text-slate-600 italic">{result.etymology}</p>
                      </div>
                    )}

                    <div>
                      <h3 className="font-semibold text-slate-700 text-sm mb-2">例句</h3>
                      <ul className="space-y-2">
                        {result.examples.map((example, index) => (
                          <li key={index} className="text-slate-600 text-sm pl-4 border-l-2 border-primary/30">
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => navigate(`/word/${result.id}`)}
                    className="bg-white border border-slate-200 rounded-2xl p-4 text-center hover:border-primary transition-colors"
                  >
                    <div className="text-2xl mb-1">📖</div>
                    <div className="font-medium text-slate-900 text-sm">详细学习</div>
                  </button>
                  <button
                    onClick={() => showToast('发音功能开发中', 'info')}
                    className="bg-white border border-slate-200 rounded-2xl p-4 text-center hover:border-primary transition-colors"
                  >
                    <div className="text-2xl mb-1">🔊</div>
                    <div className="font-medium text-slate-900 text-sm">发音</div>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <BottomNav items={navItems} onNavigate={(id) => navigate(`/${id === 'home' ? '' : id}`)} />
      </div>
    </div>
  )
}
