import { useEffect } from 'react'
import { create } from 'zustand'

interface ToastState {
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  visible: boolean
  showToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void
  hideToast: () => void
}

export const useToast = create<ToastState>((set) => ({
  message: '',
  type: 'info',
  visible: false,
  showToast: (message, type = 'info') => {
    set({ message, type, visible: true })
    setTimeout(() => set({ visible: false }), 3000)
  },
  hideToast: () => set({ visible: false }),
}))

export function Toast() {
  const { message, type, visible, hideToast } = useToast()

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(hideToast, 3000)
      return () => clearTimeout(timer)
    }
  }, [visible, hideToast])

  if (!visible) return null

  const bgColors = {
    info: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  }

  const icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  }

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-slideDown">
      <div
        className={`${bgColors[type]} text-white px-6 py-3 rounded-2xl shadow-lg flex items-center gap-3 min-w-[280px] max-w-[90vw]`}
      >
        <span className="text-xl">{icons[type]}</span>
        <p className="text-sm font-medium flex-1">{message}</p>
        <button
          onClick={hideToast}
          className="text-white/80 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
