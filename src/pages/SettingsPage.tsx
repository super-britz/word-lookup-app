import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { BottomNav } from '../components/BottomNav'
import { useToast } from '../components/Toast'

export default function SettingsPage() {
  const navigate = useNavigate()
  const { userStats, updateStats, clearHistory } = useAppStore()
  const { showToast } = useToast()

  const navItems = [
    { id: 'home', label: '首页' },
    { id: 'vocabulary', label: '生词本' },
    { id: 'review', label: '复习' },
    { id: 'settings', label: '设置', active: true },
  ]

  return (
    <div className="flex items-center justify-center size-full">
      <div className="bg-background content-stretch flex flex-col h-[1200px] isolate items-start max-w-[375px] overflow-clip relative shadow-container shrink-0 w-full">
        {/* Header */}
        <div className="backdrop-blur-sm bg-[rgba(246,246,248,0.8)] content-stretch flex flex-col gap-4 items-start pb-2 pt-6 px-4 shrink-0 sticky top-0 w-full z-[3]">
          <h1 className="font-bold text-slate-900 text-xl tracking-tight leading-7">
            设置
          </h1>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto pb-32 pt-6 w-full">
          <div className="px-4 space-y-6">
            {/* User Profile */}
            <div className="bg-white rounded-3xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
                  梁
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-lg">梁胜</h2>
                  <p className="text-slate-500 text-sm">906443185online@gmail.com</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100">
                <div className="text-center">
                  <div className="font-bold text-slate-900 text-lg">{userStats.streak}</div>
                  <div className="text-slate-500 text-xs">连续天数</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-slate-900 text-lg">{userStats.totalWords}</div>
                  <div className="text-slate-500 text-xs">总单词数</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-slate-900 text-lg">{userStats.todayLearned}</div>
                  <div className="text-slate-500 text-xs">今日学习</div>
                </div>
              </div>
            </div>

            {/* Learning Settings */}
            <div>
              <h2 className="font-semibold text-slate-500 text-sm tracking-wider uppercase mb-3 px-2">
                学习设置
              </h2>
              <div className="bg-white rounded-3xl overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">每日学习目标</p>
                    <p className="text-slate-500 text-sm">当前: {userStats.dailyGoal} 个单词</p>
                  </div>
                  <input
                    type="number"
                    value={userStats.dailyGoal}
                    onChange={(e) => updateStats({ dailyGoal: parseInt(e.target.value) || 50 })}
                    className="w-16 px-2 py-1 border border-slate-200 rounded-lg text-center"
                  />
                </div>
                <button
                  onClick={() => showToast('发音设置功能开发中', 'info')}
                  className="w-full p-4 border-b border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="text-left">
                    <p className="font-medium text-slate-900">发音</p>
                    <p className="text-slate-500 text-sm">美式发音</p>
                  </div>
                  <div className="w-12 h-6 bg-primary rounded-full relative">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </div>
                </button>
                <button
                  onClick={() => showToast('自动播放功能开发中', 'info')}
                  className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="text-left">
                    <p className="font-medium text-slate-900">自动播放发音</p>
                    <p className="text-slate-500 text-sm">查词时自动播放</p>
                  </div>
                  <div className="w-12 h-6 bg-slate-200 rounded-full relative">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </div>
                </button>
              </div>
            </div>

            {/* Data Management */}
            <div>
              <h2 className="font-semibold text-slate-500 text-sm tracking-wider uppercase mb-3 px-2">
                数据管理
              </h2>
              <div className="bg-white rounded-3xl overflow-hidden">
                <button
                  onClick={() => navigate('/import')}
                  className="w-full p-4 border-b border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">📥</span>
                    </div>
                    <p className="font-medium text-slate-900">导入单词</p>
                  </div>
                  <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button
                  onClick={() => showToast('数据导出功能开发中', 'info')}
                  className="w-full p-4 border-b border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">📤</span>
                    </div>
                    <p className="font-medium text-slate-900">导出数据</p>
                  </div>
                  <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    if (confirm('确定要清空所有查词历史吗？')) {
                      clearHistory()
                      showToast('历史记录已清空', 'success')
                    }
                  }}
                  className="w-full p-4 flex items-center justify-between hover:bg-red-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">🗑️</span>
                    </div>
                    <p className="font-medium text-red-600">清空历史记录</p>
                  </div>
                </button>
              </div>
            </div>

            {/* About */}
            <div>
              <h2 className="font-semibold text-slate-500 text-sm tracking-wider uppercase mb-3 px-2">
                关于
              </h2>
              <div className="bg-white rounded-3xl overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                  <p className="font-medium text-slate-900 mb-1">版本信息</p>
                  <p className="text-slate-500 text-sm">v1.0.0</p>
                </div>
                <button
                  onClick={() => showToast('使用帮助功能开发中', 'info')}
                  className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <p className="font-medium text-slate-900">使用帮助</p>
                  <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <BottomNav items={navItems} onNavigate={(id) => navigate(`/${id === 'home' ? '' : id}`)} />
      </div>
    </div>
  )
}
