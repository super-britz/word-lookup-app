import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { TagSection } from '../components/TagSection'
import { StatsCard } from '../components/StatsCard'
import { HistoryList } from '../components/HistoryList'
import { BottomNav } from '../components/BottomNav'
import { useAppStore } from '../store/useAppStore'
import { useToast } from '../components/Toast'

export default function HomePage() {
  const navigate = useNavigate()
  const [activeTag, setActiveTag] = useState('frontend')
  const { userStats, searchHistory, clearHistory, addToVocabulary } = useAppStore()
  const { showToast } = useToast()

  // Sample data
  const tags = [
    { id: 'frontend', label: '前端求职', iconType: 'frontend' as const, active: activeTag === 'frontend' },
    { id: 'daily', label: '日常交流', iconType: 'daily' as const, active: activeTag === 'daily' },
    { id: 'movies', label: '影视美剧', iconType: 'movies' as const, active: activeTag === 'movies' },
  ]

  const historyItems = searchHistory.map(word => ({
    ...word,
    time: word.addedAt
  }))

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const navItems = [
    { id: 'home', label: '首页', active: true },
    { id: 'vocabulary', label: '生词本' },
    { id: 'review', label: '复习' },
    { id: 'settings', label: '设置' },
  ]

  return (
    <div className="flex items-center justify-center size-full">
      <div className="bg-background content-stretch flex flex-col h-[1200px] isolate items-start max-w-[375px] overflow-clip relative shadow-container shrink-0 w-full">
        <Header
          title="查词首页"
          subtitle="探索词源的奥秘"
          onSearch={handleSearch}
        />

        <div className="content-stretch flex flex-1 flex-col gap-8 items-center min-h-0 overflow-auto pb-[120px] pt-6 relative w-full z-[1]">
          <TagSection
            title="推荐词单"
            tags={tags}
            onTagClick={setActiveTag}
            onViewAll={() => showToast('词单功能开发中，敬请期待！', 'info')}
          />

          <StatsCard
            title="今日已学单词"
            current={userStats.todayLearned}
            total={userStats.dailyGoal}
          />

          <HistoryList
            items={historyItems}
            onClear={() => {
              if (confirm('确定要清空所有查词历史吗？')) {
                clearHistory()
                showToast('历史记录已清空', 'success')
              }
            }}
            onItemClick={(id) => navigate(`/word/${id}`)}
            onAddToVocabulary={(id) => {
              const word = searchHistory.find((w) => w.id === id)
              if (word) {
                addToVocabulary(word)
                showToast('已加入生词本！', 'success')
              }
            }}
          />
        </div>

        <BottomNav
          items={navItems}
          onNavigate={(id) => navigate(`/${id === 'home' ? '' : id}`)}
        />
      </div>
    </div>
  )
}
