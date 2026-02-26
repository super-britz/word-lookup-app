import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { BottomNav } from '../components/BottomNav'
import { useToast } from '../components/Toast'
import { BookOpen, Download, Search, Trash2, Clock } from 'lucide-react'

const avatarColors = [
  'bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500',
  'bg-rose-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-teal-500',
]

function getAvatarColor(word: string) {
  const index = word.charCodeAt(0) % avatarColors.length
  return avatarColors[index]
}

export default function VocabularyPage() {
  const navigate = useNavigate()
  const { vocabulary, searchHistory, removeFromVocabulary } = useAppStore()
  const { showToast } = useToast()

  // Get words marked as in vocabulary
  const vocabWords = vocabulary.length > 0
    ? vocabulary
    : searchHistory.filter((w) => w.inVocabulary)

  const reviewedCount = vocabWords.filter((w) => w.reviewCount > 0).length

  const navItems = [
    { id: 'home', label: '首页' },
    { id: 'vocabulary', label: '生词本', active: true },
    { id: 'review', label: '复习' },
    { id: 'settings', label: '设置' },
  ]

  return (
    <div className="flex items-center justify-center size-full">
      <div className="bg-background content-stretch flex flex-col h-[1200px] isolate items-start max-w-[375px] overflow-clip relative shadow-container shrink-0 w-full">
        {/* Header */}
        <div className="backdrop-blur-sm bg-[rgba(246,246,248,0.8)] content-stretch flex flex-col gap-4 items-start pb-4 pt-6 px-4 shrink-0 sticky top-0 w-full z-[3]">
          <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-bold text-slate-900 text-xl tracking-tight leading-7">
                  生词本
                </h1>
                <p className="text-slate-500 text-xs leading-4 mt-0.5">
                  共 <span className="font-semibold text-primary">{vocabWords.length}</span> 个单词
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => showToast('搜索功能开发中', 'info')}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-100 hover:border-slate-200 transition-colors"
              >
                <Search className="w-4 h-4 text-slate-500" />
              </button>
              <button
                onClick={() => showToast('导出功能开发中', 'info')}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-100 hover:border-slate-200 transition-colors"
              >
                <Download className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          {vocabWords.length > 0 && (
            <div className="flex gap-2 w-full">
              <div className="flex-1 bg-white border border-slate-100 rounded-2xl px-3 py-2.5 text-center">
                <p className="text-lg font-bold text-slate-900">{vocabWords.length}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">总词数</p>
              </div>
              <div className="flex-1 bg-white border border-slate-100 rounded-2xl px-3 py-2.5 text-center">
                <p className="text-lg font-bold text-emerald-500">{reviewedCount}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">已复习</p>
              </div>
              <div className="flex-1 bg-white border border-slate-100 rounded-2xl px-3 py-2.5 text-center">
                <p className="text-lg font-bold text-amber-500">{vocabWords.length - reviewedCount}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">待复习</p>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto pb-32 pt-4 w-full">
          {vocabWords.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
              <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-5">
                <BookOpen className="w-10 h-10 text-primary/40" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">生词本为空</h3>
              <p className="text-slate-400 text-sm mb-8 leading-6">
                在查词时点击"加入生词本"<br />即可收藏单词到这里
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-primary text-white px-6 py-2.5 rounded-full font-medium shadow-primary-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                去查词
              </button>
            </div>
          ) : (
            <div className="px-4 space-y-2.5">
              {vocabWords.map((word) => (
                <div
                  key={word.id}
                  className="bg-white border border-slate-100 rounded-2xl p-4 hover:border-slate-200 hover:shadow-sm transition-all overflow-hidden relative"
                >
                  {/* Left accent bar */}
                  <div className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full ${getAvatarColor(word.word)}`} />

                  <div className="flex items-start gap-3 pl-2">
                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-xl ${getAvatarColor(word.word)} flex items-center justify-center shrink-0 shadow-sm`}>
                      <span className="text-white font-bold text-sm">
                        {word.word.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    {/* Word Info */}
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => navigate(`/word/${word.id}`)}
                    >
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-bold text-slate-900 text-[15px] truncate">{word.word}</h3>
                        {word.reviewCount > 0 && (
                          <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full shrink-0">
                            {word.reviewCount}次
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-xs font-mono mb-1">{word.phonetic}</p>
                      <p className="text-slate-600 text-sm truncate">{word.translation}</p>
                      <div className="flex items-center gap-1 mt-1.5">
                        <Clock className="w-3 h-3 text-slate-300" />
                        <span className="text-[10px] text-slate-300">{word.addedAt}</span>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => {
                        removeFromVocabulary(word.id)
                        showToast('已从生词本移除', 'success')
                      }}
                      className="p-2 hover:bg-rose-50 rounded-xl transition-colors shrink-0 group"
                    >
                      <Trash2 className="w-4 h-4 text-slate-300 group-hover:text-rose-400 transition-colors" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <BottomNav items={navItems} onNavigate={(id) => navigate(`/${id === 'home' ? '' : id}`)} />
      </div>
    </div>
  )
}
