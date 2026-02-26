import { describe, it, expect, beforeEach } from 'vitest'
import { useAppStore } from '../store/useAppStore'

const mockWord = {
  id: 'test-1',
  word: 'Example',
  phonetic: '/ɪɡˈzæmpəl/',
  translation: '例子，示例',
  definition: 'A thing characteristic of its kind',
  examples: ['This is an example sentence.'],
  addedAt: '10:00 AM',
  reviewCount: 0,
  inVocabulary: false,
}

describe('AppStore', () => {
  beforeEach(() => {
    const store = useAppStore.getState()
    // Reset to initial state
    useAppStore.setState({
      vocabulary: [],
      searchHistory: store.searchHistory.map(w => ({ ...w, inVocabulary: w.inVocabulary })),
      userStats: { todayLearned: 24, dailyGoal: 50, totalWords: 156, streak: 7 },
    })
  })

  describe('初始状态', () => {
    it('应有默认的用户统计数据', () => {
      const { userStats } = useAppStore.getState()
      expect(userStats.todayLearned).toBe(24)
      expect(userStats.dailyGoal).toBe(50)
      expect(userStats.totalWords).toBe(156)
      expect(userStats.streak).toBe(7)
    })

    it('应有预设的查词历史', () => {
      const { searchHistory } = useAppStore.getState()
      expect(searchHistory.length).toBe(3)
      expect(searchHistory[0].word).toBe('Component')
    })

    it('生词本初始为空', () => {
      const { vocabulary } = useAppStore.getState()
      expect(vocabulary).toHaveLength(0)
    })
  })

  describe('addToHistory', () => {
    it('应将单词添加到历史记录首位', () => {
      const { addToHistory } = useAppStore.getState()
      addToHistory(mockWord)
      const { searchHistory } = useAppStore.getState()
      expect(searchHistory[0].word).toBe('Example')
    })

    it('历史记录最多保留 20 条', () => {
      const { addToHistory } = useAppStore.getState()
      for (let i = 0; i < 25; i++) {
        addToHistory({ ...mockWord, id: `word-${i}`, word: `Word${i}` })
      }
      const { searchHistory } = useAppStore.getState()
      expect(searchHistory.length).toBeLessThanOrEqual(21)
    })
  })

  describe('addToVocabulary', () => {
    it('应将单词添加到生词本', () => {
      const { addToVocabulary } = useAppStore.getState()
      addToVocabulary(mockWord)
      const { vocabulary } = useAppStore.getState()
      expect(vocabulary).toHaveLength(1)
      expect(vocabulary[0].word).toBe('Example')
      expect(vocabulary[0].inVocabulary).toBe(true)
    })

    it('应同步更新历史记录中对应单词的 inVocabulary 标志', () => {
      const { addToHistory, addToVocabulary } = useAppStore.getState()
      addToHistory(mockWord)
      addToVocabulary(mockWord)
      const { searchHistory } = useAppStore.getState()
      const found = searchHistory.find(w => w.id === 'test-1')
      expect(found?.inVocabulary).toBe(true)
    })
  })

  describe('removeFromVocabulary', () => {
    it('应从生词本移除单词', () => {
      const { addToVocabulary, removeFromVocabulary } = useAppStore.getState()
      addToVocabulary(mockWord)
      removeFromVocabulary('test-1')
      const { vocabulary } = useAppStore.getState()
      expect(vocabulary).toHaveLength(0)
    })

    it('应同步更新历史记录中的 inVocabulary 为 false', () => {
      const { addToHistory, addToVocabulary, removeFromVocabulary } = useAppStore.getState()
      addToHistory(mockWord)
      addToVocabulary(mockWord)
      removeFromVocabulary('test-1')
      const { searchHistory } = useAppStore.getState()
      const found = searchHistory.find(w => w.id === 'test-1')
      expect(found?.inVocabulary).toBe(false)
    })
  })

  describe('clearHistory', () => {
    it('应清空查词历史', () => {
      const { clearHistory } = useAppStore.getState()
      clearHistory()
      const { searchHistory } = useAppStore.getState()
      expect(searchHistory).toHaveLength(0)
    })
  })

  describe('updateStats', () => {
    it('应部分更新用户统计', () => {
      const { updateStats } = useAppStore.getState()
      updateStats({ dailyGoal: 100 })
      const { userStats } = useAppStore.getState()
      expect(userStats.dailyGoal).toBe(100)
      expect(userStats.todayLearned).toBe(24) // 其他字段不变
    })
  })

  describe('incrementTodayLearned', () => {
    it('应将今日已学 +1', () => {
      const { incrementTodayLearned } = useAppStore.getState()
      incrementTodayLearned()
      const { userStats } = useAppStore.getState()
      expect(userStats.todayLearned).toBe(25)
    })
  })

  describe('setCurrentTab', () => {
    it('应设置当前 Tab', () => {
      const { setCurrentTab } = useAppStore.getState()
      setCurrentTab('vocabulary')
      const { currentTab } = useAppStore.getState()
      expect(currentTab).toBe('vocabulary')
    })
  })

  describe('setSearchQuery', () => {
    it('应设置搜索关键词', () => {
      const { setSearchQuery } = useAppStore.getState()
      setSearchQuery('hello')
      const { searchQuery } = useAppStore.getState()
      expect(searchQuery).toBe('hello')
    })
  })
})
