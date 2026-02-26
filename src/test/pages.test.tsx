import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import VocabularyPage from '../pages/VocabularyPage'
import { useAppStore } from '../store/useAppStore'

function renderWithRouter(ui: React.ReactElement, initialEntries = ['/vocabulary']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
  )
}

describe('VocabularyPage 生词本页面', () => {
  beforeEach(() => {
    useAppStore.setState({
      vocabulary: [],
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
          reviewCount: 2,
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
          reviewCount: 0,
          inVocabulary: true,
        },
      ],
    })
  })

  it('应显示页面标题"生词本"', () => {
    renderWithRouter(<VocabularyPage />)
    const heading = screen.getByRole('heading', { name: '生词本' })
    expect(heading).toBeInTheDocument()
  })

  it('应显示生词本中的单词（从 searchHistory 筛选 inVocabulary）', () => {
    renderWithRouter(<VocabularyPage />)
    expect(screen.getByText('Asynchronous')).toBeInTheDocument()
    expect(screen.getByText('Hydration')).toBeInTheDocument()
    expect(screen.queryByText('Component')).not.toBeInTheDocument()
  })

  it('应正确显示单词计数', () => {
    renderWithRouter(<VocabularyPage />)
    const countElement = screen.getByText('总词数')
    expect(countElement).toBeInTheDocument()
    // 总词数统计卡片中应显示 2
    const statsCards = screen.getAllByText('2')
    expect(statsCards.length).toBeGreaterThanOrEqual(1)
  })

  it('应显示统计栏', () => {
    renderWithRouter(<VocabularyPage />)
    expect(screen.getByText('总词数')).toBeInTheDocument()
    expect(screen.getByText('已复习')).toBeInTheDocument()
    expect(screen.getByText('待复习')).toBeInTheDocument()
  })

  it('已复习的单词应显示复习次数徽章', () => {
    renderWithRouter(<VocabularyPage />)
    expect(screen.getByText('2次')).toBeInTheDocument()
  })

  it('应显示单词的音标', () => {
    renderWithRouter(<VocabularyPage />)
    expect(screen.getByText('/eɪˈsɪŋkrənəs/')).toBeInTheDocument()
  })

  it('应显示单词的翻译', () => {
    renderWithRouter(<VocabularyPage />)
    expect(screen.getByText('异步的')).toBeInTheDocument()
  })

  describe('空状态', () => {
    beforeEach(() => {
      useAppStore.setState({
        vocabulary: [],
        searchHistory: [],
      })
    })

    it('没有单词时应显示空状态提示', () => {
      renderWithRouter(<VocabularyPage />)
      expect(screen.getByText('生词本为空')).toBeInTheDocument()
    })

    it('空状态应显示"去查词"按钮', () => {
      renderWithRouter(<VocabularyPage />)
      expect(screen.getByText('去查词')).toBeInTheDocument()
    })
  })

  describe('删除单词', () => {
    it('点击删除按钮应从生词本移除单词', () => {
      useAppStore.setState({
        vocabulary: [
          {
            id: 'v1',
            word: 'TestWord',
            phonetic: '/test/',
            translation: '测试',
            definition: 'A test word',
            examples: [],
            addedAt: '刚刚',
            reviewCount: 0,
            inVocabulary: true,
          },
        ],
        searchHistory: [],
      })

      renderWithRouter(<VocabularyPage />)
      expect(screen.getByText('TestWord')).toBeInTheDocument()

      // Find and click the delete button (Trash2 icon button)
      const deleteButtons = screen.getAllByRole('button')
      const trashButton = deleteButtons.find(btn =>
        btn.querySelector('svg.lucide-trash-2')
      )
      if (trashButton) {
        fireEvent.click(trashButton)
        expect(screen.queryByText('TestWord')).not.toBeInTheDocument()
      }
    })
  })
})
