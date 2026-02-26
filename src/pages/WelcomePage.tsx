import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function WelcomePage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      icon: '📚',
      title: '探索词源的奥秘',
      description: '深入了解每个单词背后的故事，让学习更有趣',
    },
    {
      icon: '🎯',
      title: '科学记忆方法',
      description: '使用间隔重复算法，帮助你高效记忆单词',
    },
    {
      icon: '📈',
      title: '追踪学习进度',
      description: '可视化你的学习成果，保持学习动力',
    },
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="flex items-center justify-center size-full bg-gradient-to-br from-primary to-blue-600">
      <div className="content-stretch flex flex-col h-[1200px] isolate items-start max-w-[375px] overflow-clip relative shrink-0 w-full">
        <div className="flex-1 flex flex-col items-center justify-center px-8 w-full">
          {/* Step Content */}
          <div className="text-center mb-12">
            <div className="text-8xl mb-8 animate-bounce">{steps[currentStep].icon}</div>
            <h1 className="font-bold text-white text-3xl mb-4 leading-tight">
              {steps[currentStep].title}
            </h1>
            <p className="text-white/80 text-lg leading-relaxed">
              {steps[currentStep].description}
            </p>
          </div>

          {/* Step Indicators */}
          <div className="flex gap-2 mb-12">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-8 bg-white'
                    : 'w-2 bg-white/40'
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="w-full max-w-xs space-y-3">
            <button
              onClick={handleNext}
              className="w-full bg-white text-primary py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
            >
              {currentStep < steps.length - 1 ? '下一步' : '开始使用'}
            </button>
            {currentStep < steps.length - 1 && (
              <button
                onClick={() => navigate('/')}
                className="w-full text-white py-3 rounded-2xl font-medium hover:bg-white/10 transition-colors"
              >
                跳过
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
