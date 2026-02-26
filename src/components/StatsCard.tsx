import { ChartIcon } from './icons'

interface StatsCardProps {
  title: string
  current: number
  total: number
}

export function StatsCard({ title, current, total }: StatsCardProps) {
  const percentage = (current / total) * 100

  return (
    <div className="w-full px-4 shrink-0">
    <div
      className="h-[150px] overflow-clip relative rounded-2xl shadow-card-lg w-full"
      style={{
        backgroundImage: "linear-gradient(160.17deg, rgb(36, 99, 235) 0%, rgb(37, 99, 235) 100%)"
      }}
    >
      <div className="absolute content-stretch flex items-start justify-between left-5 right-5 top-5">
        <div className="content-stretch flex flex-col gap-1 items-start relative shrink-0">
          <p className="text-white text-sm opacity-80 leading-5">
            {title}
          </p>

          <div className="h-9 leading-0 relative shrink-0 text-white w-full">
            <span className="font-bold text-3xl leading-9">{current} </span>
            <span className="text-sm opacity-80 leading-5">/ {total}</span>
          </div>
        </div>

        <button className="backdrop-blur-sm bg-white/20 px-2 py-1.5 rounded-2xl hover:bg-white/30 transition-colors">
          <ChartIcon className="text-white" size={20} />
        </button>
      </div>

      <div className="absolute bg-white/20 h-1.5 left-5 right-5 rounded-full top-24">
        <div
          className="absolute bg-white inset-y-0 left-0 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="absolute left-5 right-5 top-[114px] text-white text-xs opacity-80 leading-4">
        距离达成今日目标还剩 {total - current} 个单词
      </p>
    </div>
    </div>
  )
}
