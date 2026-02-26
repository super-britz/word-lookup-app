import {
  Home,
  BookOpen,
  RotateCcw,
  Settings,
  Search,
  Mic,
  Menu,
  BookMarked,
  MessageSquare,
  Film,
  BarChart3,
  Plus,
  Sparkles,
} from 'lucide-react'

interface IconProps {
  className?: string
  size?: number
}

// 导航图标
export const HomeIcon = ({ className, size = 24 }: IconProps) => (
  <Home className={className} size={size} />
)

export const BookOpenIcon = ({ className, size = 24 }: IconProps) => (
  <BookOpen className={className} size={size} />
)

export const RotateCcwIcon = ({ className, size = 24 }: IconProps) => (
  <RotateCcw className={className} size={size} />
)

export const SettingsIcon = ({ className, size = 24 }: IconProps) => (
  <Settings className={className} size={size} />
)

// 功能图标
export const SearchIcon = ({ className, size = 24 }: IconProps) => (
  <Search className={className} size={size} />
)

export const MicIcon = ({ className, size = 24 }: IconProps) => (
  <Mic className={className} size={size} />
)

export const MenuIcon = ({ className, size = 24 }: IconProps) => (
  <Menu className={className} size={size} />
)

// 词单图标
export const BookMarkedIcon = ({ className, size = 18 }: IconProps) => (
  <BookMarked className={className} size={size} />
)

export const MessageSquareIcon = ({ className, size = 18 }: IconProps) => (
  <MessageSquare className={className} size={size} />
)

export const FilmIcon = ({ className, size = 18 }: IconProps) => (
  <Film className={className} size={size} />
)

// 其他图标
export const ChartIcon = ({ className, size = 24 }: IconProps) => (
  <BarChart3 className={className} size={size} />
)

export const PlusIcon = ({ className, size = 24 }: IconProps) => (
  <Plus className={className} size={size} />
)

export const LogoIcon = ({ className, size = 24 }: IconProps) => (
  <Sparkles className={className} size={size} />
)

// 词汇图标
export const WordIcon = ({ className, size = 24 }: IconProps) => (
  <BookOpen className={className} size={size} />
)
