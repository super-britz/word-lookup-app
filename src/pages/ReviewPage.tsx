import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { BottomNav } from '../components/BottomNav'

export default function ReviewPage() {
  const navigate = useNavigate()
  const { vocabulary, searchHistory } = useAppStore()

  const reviewWords = [...vocabulary, ...searchHistory.filter((w) => w.inVocabulary)]

  const navItems = [
    { id: 'home', label: '首页' },
    { id: 'vocabulary', label: '生词本' },
    { id: 'review', label: '复习', active: true },
    { id: 'settings', label: '设置' },
  ]

  return (
    <div className="flex items-center justify-center size-full">
      <div className="bg-background content-stretch flex flex-col h-[1200px] isolate items-start max-w-[375px] overflow-clip relative shadow-container shrink-0 w-full">
        {/* Sticky Header */}
        <div className="backdrop-blur-sm bg-[rgba(246,246,248,0.8)] content-stretch flex flex-col gap-4 items-start pb-2 pt-6 px-4 shrink-0 sticky top-0 w-full z-[3]">
          <div>
            <h1 className="font-bold text-slate-900 text-xl tracking-tight leading-7">
              复习计划
            </h1>
            <p className="text-slate-500 text-xs leading-4 mt-1">
              坚持复习，巩固记忆
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto pb-32 pt-6 w-full">
          <div className="px-4 space-y-6">
            {/* Today's Review */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-slate-500 text-sm tracking-wider uppercase">
                  今日复习
                </h2>
                <span className="text-primary text-xs font-medium">20 个单词</span>
              </div>

              <div
                onClick={() => reviewWords.length > 0 && navigate(`/word/${reviewWords[0].id}`)}
                className="bg-gradient-to-br from-primary to-blue-600 rounded-3xl p-6 shadow-card-lg cursor-pointer hover:shadow-xl transition-all"
              >
                <div className="flex items-center justify-between text-white mb-4">
                  <div>
                    <p className="opacity-80 text-sm mb-1">今日进度</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">12</span>
                      <span className="text-sm opacity-80">/ 20</span>
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-xl">
                    <span className="text-sm font-medium">60%</span>
                  </div>
                </div>

                <div className="bg-white/20 h-2 rounded-full mb-4">
                  <div className="bg-white h-2 rounded-full w-[60%]" />
                </div>

                <button className="w-full bg-white text-primary py-3 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all">
                  继续复习
                </button>
              </div>
            </div>

            {/* Review History */}
            <div>
              <h2 className="font-semibold text-slate-500 text-sm tracking-wider uppercase mb-3">
                复习记录
              </h2>

              <div className="space-y-2">
                {[
                  { date: '今天', count: 12, total: 20, status: 'in-progress' },
                  { date: '昨天', count: 25, total: 25, status: 'completed' },
                  { date: '2天前', count: 18, total: 20, status: 'partial' },
                  { date: '3天前', count: 30, total: 30, status: 'completed' },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          item.status === 'completed'
                            ? 'bg-green-100'
                            : item.status === 'in-progress'
                            ? 'bg-blue-100'
                            : 'bg-yellow-100'
                        }`}
                      >
                        <span className="text-lg">
                          {item.status === 'completed' ? '✓' : item.status === 'in-progress' ? '⏳' : '📝'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{item.date}</p>
                        <p className="text-slate-500 text-sm">
                          {item.count} / {item.total} 单词
                        </p>
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : item.status === 'in-progress'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {item.status === 'completed'
                        ? '已完成'
                        : item.status === 'in-progress'
                        ? '进行中'
                        : '部分完成'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">7</div>
                <div className="text-slate-500 text-xs">连续天数</div>
              </div>
              <div className="bg-white rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">156</div>
                <div className="text-slate-500 text-xs">总单词数</div>
              </div>
              <div className="bg-white rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">89%</div>
                <div className="text-slate-500 text-xs">掌握率</div>
              </div>
            </div>
          </div>
        </div>

        <BottomNav items={navItems} onNavigate={(id) => navigate(`/${id === 'home' ? '' : id}`)} />
      </div>
    </div>
  )
}
