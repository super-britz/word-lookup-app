import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useToast } from '../components/Toast'

export default function ImportPage() {
  const navigate = useNavigate()
  const [importText, setImportText] = useState('')
  const { showToast } = useToast()

  const handleImport = () => {
    const words = importText.split('\n').filter(line => line.trim())
    if (words.length === 0) {
      showToast('请输入要导入的单词', 'warning')
      return
    }
    showToast(`准备导入 ${words.length} 个单词（功能开发中）`, 'info')
    // TODO: Implement import logic
  }

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
          <h1 className="font-bold text-slate-900 text-lg">导入单词</h1>
          <div className="w-10" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 w-full">
          <div className="space-y-6">
            {/* Import Methods */}
            <div>
              <h2 className="font-semibold text-slate-700 text-sm mb-3">选择导入方式</h2>
              <div className="grid grid-cols-2 gap-3">
                <button className="bg-white border-2 border-primary rounded-2xl p-4 text-center hover:bg-primary/5 transition-colors">
                  <div className="text-3xl mb-2">📝</div>
                  <div className="font-medium text-slate-900 text-sm">粘贴文本</div>
                </button>
                <button
                  onClick={() => showToast('文件上传功能开发中', 'info')}
                  className="bg-white border border-slate-200 rounded-2xl p-4 text-center hover:border-primary transition-colors"
                >
                  <div className="text-3xl mb-2">📄</div>
                  <div className="font-medium text-slate-900 text-sm">上传文件</div>
                </button>
              </div>
            </div>

            {/* Text Input */}
            <div>
              <h2 className="font-semibold text-slate-700 text-sm mb-3">输入单词列表</h2>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="每行一个单词，例如：&#10;component&#10;asynchronous&#10;hydration"
                className="w-full h-64 p-4 border border-slate-200 rounded-2xl resize-none focus:outline-none focus:border-primary transition-colors"
              />
              <p className="text-slate-500 text-sm mt-2">
                {importText.split('\n').filter(line => line.trim()).length} 个单词
              </p>
            </div>

            {/* Format Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <h3 className="font-semibold text-blue-900 text-sm mb-2 flex items-center gap-2">
                <span>ℹ️</span>
                <span>支持的格式</span>
              </h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• 每行一个单词</li>
                <li>• 支持中英文对照（用逗号分隔）</li>
                <li>• 支持带音标的格式</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => navigate(-1)}
                className="flex-1 bg-white border border-slate-200 py-3 rounded-2xl font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleImport}
                disabled={!importText.trim()}
                className="flex-1 bg-primary text-white py-3 rounded-2xl font-medium shadow-primary-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                导入
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
