import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Word {
  id: string
  word: string
  phonetic: string
  translation: string
  definition: string
  etymology?: string
  examples: string[]
  addedAt: string
  reviewCount: number
  lastReviewed?: string
  inVocabulary: boolean
}

export interface WordList {
  id: string
  name: string
  icon: string
  words: Word[]
}

export interface UserStats {
  todayLearned: number
  dailyGoal: number
  totalWords: number
  streak: number
}

interface AppState {
  // User data
  userStats: UserStats

  // Words
  searchHistory: Word[]
  vocabulary: Word[]
  wordLists: WordList[]

  // UI state
  currentTab: string
  searchQuery: string

  // Actions
  addToHistory: (word: Word) => void
  addToVocabulary: (word: Word) => void
  removeFromVocabulary: (wordId: string) => void
  clearHistory: () => void
  updateStats: (stats: Partial<UserStats>) => void
  setCurrentTab: (tab: string) => void
  setSearchQuery: (query: string) => void
  incrementTodayLearned: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      userStats: {
        todayLearned: 24,
        dailyGoal: 50,
        totalWords: 156,
        streak: 7,
      },

      searchHistory: [
        {
          id: '1',
          word: 'Component',
          phonetic: '/kəmˈpoʊnənt/',
          translation: '组件，构成要素',
          definition: 'A part or element of a larger whole',
          examples: ['React components are reusable'],
          addedAt: '10:45 AM',
          reviewCount: 0,
          inVocabulary: false,
        },
        {
          id: '2',
          word: 'Asynchronous',
          phonetic: '/eɪˈsɪŋkrənəs/',
          translation: '异步的',
          definition: 'Not occurring at the same time',
          examples: ['Async functions in JavaScript'],
          addedAt: '昨天',
          reviewCount: 0,
          inVocabulary: true,
        },
        {
          id: '3',
          word: 'Hydration',
          phonetic: '/haɪˈdreɪʃn/',
          translation: '水合作用，激活',
          definition: 'The process of attaching event listeners to DOM',
          examples: ['Next.js hydration process'],
          addedAt: '昨天',
          reviewCount: 1,
          inVocabulary: true,
        },
      ],

      vocabulary: [],

      wordLists: [
        {
          id: 'frontend',
          name: '前端求职',
          icon: 'frontend',
          words: [],
        },
        {
          id: 'daily',
          name: '日常交流',
          icon: 'daily',
          words: [],
        },
        {
          id: 'movies',
          name: '影视美剧',
          icon: 'movies',
          words: [],
        },
      ],

      currentTab: 'home',
      searchQuery: '',

      // Actions
      addToHistory: (word) =>
        set((state) => ({
          searchHistory: [word, ...state.searchHistory.slice(0, 19)],
        })),

      addToVocabulary: (word) =>
        set((state) => ({
          vocabulary: [{ ...word, inVocabulary: true }, ...state.vocabulary],
          searchHistory: state.searchHistory.map((w) =>
            w.id === word.id ? { ...w, inVocabulary: true } : w
          ),
        })),

      removeFromVocabulary: (wordId) =>
        set((state) => ({
          vocabulary: state.vocabulary.filter((w) => w.id !== wordId),
          searchHistory: state.searchHistory.map((w) =>
            w.id === wordId ? { ...w, inVocabulary: false } : w
          ),
        })),

      clearHistory: () => set({ searchHistory: [] }),

      updateStats: (stats) =>
        set((state) => ({
          userStats: { ...state.userStats, ...stats },
        })),

      setCurrentTab: (tab) => set({ currentTab: tab }),

      setSearchQuery: (query) => set({ searchQuery: query }),

      incrementTodayLearned: () =>
        set((state) => ({
          userStats: {
            ...state.userStats,
            todayLearned: state.userStats.todayLearned + 1,
          },
        })),
    }),
    {
      name: 'word-app-storage',
    }
  )
)
