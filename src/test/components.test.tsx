import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { StatsCard } from '../components/StatsCard'
import { TagButton } from '../components/TagButton'
import { BottomNav } from '../components/BottomNav'

function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter>{ui}</BrowserRouter>)
}

describe('StatsCard 组件', () => {
  it('应正确渲染标题和数值', () => {
    render(<StatsCard title="今日已学单词" current={24} total={50} />)
    expect(screen.getByText('今日已学单词')).toBeInTheDocument()
    expect(screen.getByText('24')).toBeInTheDocument()
    expect(screen.getByText('/ 50')).toBeInTheDocument()
  })

  it('应显示剩余单词数', () => {
    render(<StatsCard title="今日已学单词" current={24} total={50} />)
    expect(screen.getByText('距离达成今日目标还剩 26 个单词')).toBeInTheDocument()
  })

  it('应正确计算进度条宽度', () => {
    const { container } = render(<StatsCard title="测试" current={25} total={100} />)
    const progressBar = container.querySelector('[style*="width: 25%"]')
    expect(progressBar).toBeInTheDocument()
  })
})

describe('TagButton 组件', () => {
  it('应渲染标签文字', () => {
    render(<TagButton label="前端求职" iconType="frontend" />)
    expect(screen.getByText('前端求职')).toBeInTheDocument()
  })

  it('激活状态应有不同样式', () => {
    const { container } = render(<TagButton label="前端求职" iconType="frontend" active />)
    const button = container.querySelector('button')
    expect(button?.className).toContain('bg-primary')
  })

  it('非激活状态应有边框样式', () => {
    const { container } = render(<TagButton label="前端求职" iconType="frontend" active={false} />)
    const button = container.querySelector('button')
    expect(button?.className).toContain('bg-white')
  })

  it('点击应触发 onClick 回调', () => {
    const onClick = vi.fn()
    render(<TagButton label="前端求职" iconType="frontend" onClick={onClick} />)
    fireEvent.click(screen.getByText('前端求职'))
    expect(onClick).toHaveBeenCalledOnce()
  })
})

describe('BottomNav 组件', () => {
  const navItems = [
    { id: 'home', label: '首页', active: true },
    { id: 'vocabulary', label: '生词本' },
    { id: 'review', label: '复习' },
    { id: 'settings', label: '设置' },
  ]

  it('应渲染所有导航项', () => {
    renderWithRouter(<BottomNav items={navItems} />)
    expect(screen.getByText('首页')).toBeInTheDocument()
    expect(screen.getByText('生词本')).toBeInTheDocument()
    expect(screen.getByText('复习')).toBeInTheDocument()
    expect(screen.getByText('设置')).toBeInTheDocument()
  })

  it('点击导航项应触发 onNavigate', () => {
    const onNavigate = vi.fn()
    renderWithRouter(<BottomNav items={navItems} onNavigate={onNavigate} />)
    fireEvent.click(screen.getByText('生词本'))
    expect(onNavigate).toHaveBeenCalledWith('vocabulary')
  })

  it('激活项应有高亮样式', () => {
    renderWithRouter(<BottomNav items={navItems} />)
    const homeLabel = screen.getByText('首页')
    expect(homeLabel.className).toContain('text-primary')
  })
})
