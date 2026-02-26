import { useNavigate, useParams } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { BottomNav } from '../components/BottomNav'
import { useState } from 'react'

export default function WordDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { searchHistory, vocabulary } = useAppStore()
  const [showAnswer, setShowAnswer] = useState(false)

  // Find word from history or vocabulary
  const word = [...searchHistory, ...vocabulary].find((w) => w.id === id)

  if (!word) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-slate-500">单词未找到</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-primary hover:underline"
          >
            返回首页
          </button>
        </div>
      </div>
    )
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
          <h1 className="font-bold text-slate-900 text-lg">学习卡片</h1>
          <div className="w-10" />
        </div>

        {/* Learning Card */}
        <div className="flex-1 flex items-center justify-center px-6 w-full pb-32">
          <div className="w-full">
            <div
              className={`bg-white rounded-3xl p-8 shadow-card-lg transition-all duration-500 ${
                showAnswer ? 'min-h-[400px]' : 'min-h-[300px]'
              }`}
            >
              {/* Front */}
              <div className="text-center mb-8">
                <div className="inline-block bg-primary-lighter px-4 py-1.5 rounded-full mb-4">
                  <span className="text-primary text-sm font-medium">
                    复习 #{word.reviewCount + 1}
                  </span>
                </div>
                <h2 className="font-bold text-4xl text-slate-900 mb-3">{word.word}</h2>
                <p className="text-slate-500 text-lg">{word.phonetic}</p>
              </div>

              {/* Back */}
              {showAnswer && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="border-t border-slate-200 pt-4">
                    <p className="text-slate-900 text-lg font-medium mb-2">{word.translation}</p>
                    <p className="text-slate-600">{word.definition}</p>
                  </div>

                  {word.examples && word.examples.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-slate-700 text-sm mb-2">例句</h3>
                      <p className="text-slate-600 text-sm italic">{word.examples[0]}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Action Button */}
              <div className="mt-8">
                {!showAnswer ? (
                  <button
                    onClick={() => setShowAnswer(true)}
                    className="w-full bg-primary text-white py-3 rounded-2xl font-medium shadow-primary-sm hover:bg-primary/90 transition-colors"
                  >
                    显示答案
                  </button>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => navigate('/review')}
                      className="bg-red-50 text-red-600 py-3 rounded-xl font-medium hover:bg-red-100 transition-colors"
                    >
                      不会
                    </button>
                    <button
                      onClick={() => navigate('/review')}
                      className="bg-yellow-50 text-yellow-600 py-3 rounded-xl font-medium hover:bg-yellow-100 transition-colors"
                    >
                      模糊
                    </button>
                    <button
                      onClick={() => navigate('/review')}
                      className="bg-green-50 text-green-600 py-3 rounded-xl font-medium hover:bg-green-100 transition-colors"
                    >
                      掌握
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Progress */}
            <div className="mt-4 text-center">
              <p className="text-slate-500 text-sm">
                今日复习: 12 / 20
              </p>
            </div>
          </div>
        </div>

        <BottomNav items={navItems} onNavigate={(id) => navigate(`/${id === 'home' ? '' : id}`)} />
      </div>
    </div>
  )
}
