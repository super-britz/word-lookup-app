# 查词应用 - Word Lookup App

一个基于 Figma 设计稿生成的现代化词典查词应用。

![Preview](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=flat-square&logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-5.1.4-646CFF?style=flat-square&logo=vite)

## ✨ 特性

- 🎨 **精美UI设计** - 基于 Figma 设计稿1:1还原
- 📱 **移动端优先** - 完美适配移动设备
- ⚡ **极速构建** - 使用 Vite 构建工具
- 🎯 **TypeScript** - 类型安全，开发体验更好
- 🎨 **Tailwind CSS** - 原子化CSS，快速开发
- 🔍 **智能搜索** - 支持语音输入
- 📚 **词单推荐** - 分类词汇学习
- 📊 **学习统计** - 实时跟踪学习进度
- 📖 **查词历史** - 轻松回顾已查单词

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

应用将在 http://localhost:3000 启动

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 📁 项目结构

```
word-lookup-app/
├── src/
│   ├── assets/          # 静态资源
│   │   └── images.ts    # 图片资源配置
│   ├── components/      # React组件
│   │   ├── Header.tsx         # 头部导航
│   │   ├── SearchBar.tsx      # 搜索框
│   │   ├── TagSection.tsx     # 标签区域
│   │   ├── TagButton.tsx      # 标签按钮
│   │   ├── StatsCard.tsx      # 统计卡片
│   │   ├── HistoryList.tsx    # 历史列表
│   │   ├── HistoryItem.tsx    # 历史项
│   │   ├── BottomNav.tsx      # 底部导航
│   │   └── IconButton.tsx     # 图标按钮
│   ├── pages/           # 页面组件
│   │   └── HomePage.tsx # 首页
│   ├── App.tsx          # 应用入口
│   ├── main.tsx         # React入口
│   └── index.css        # 全局样式
├── index.html           # HTML模板
├── package.json         # 依赖配置
├── tsconfig.json        # TypeScript配置
├── tailwind.config.js   # Tailwind配置
├── vite.config.ts       # Vite配置
└── README.md           # 项目说明
```

## 🎨 技术栈

- **框架**: React 18.3.1
- **语言**: TypeScript 5.3.3
- **构建工具**: Vite 5.1.4
- **样式**: Tailwind CSS 3.4.1
- **路由**: React Router 6.22.0

## 🎯 核心功能

### 页面功能

1. **首页** (`/`)
   - 智能搜索框（支持回车搜索）
   - 推荐词单标签切换
   - 实时学习进度统计
   - 查词历史记录
   - 一键加入生词本

2. **搜索结果页** (`/search`)
   - 显示单词详细信息（音标、释义、定义、词源）
   - 例句展示
   - 快速加入生词本
   - 进入详细学习模式

3. **单词详情页** (`/word/:id`)
   - 学习卡片模式
   - 显示/隐藏答案
   - 记忆程度自评（不会/模糊/掌握）
   - 复习次数统计

4. **生词本** (`/vocabulary`)
   - 查看所有收藏的单词
   - 复习次数追踪
   - 一键移除单词
   - 空状态引导

5. **复习页面** (`/review`)
   - 今日复习进度
   - 复习记录历史
   - 学习统计数据（连续天数、总单词数、掌握率）
   - 快速开始复习

6. **设置页面** (`/settings`)
   - 用户信息展示
   - 每日学习目标设置
   - 发音选项配置
   - 数据导入/导出
   - 清空历史记录

7. **欢迎页** (`/welcome`)
   - 新用户引导
   - 功能介绍（三步引导）
   - 可跳过

8. **单词导入** (`/import`)
   - 文本粘贴导入
   - 文件上传（开发中）
   - 格式说明

### 组件设计

所有组件都是独立、可复用的模块：

- **Header**: 应用头部，显示标题和菜单
- **SearchBar**: 搜索框，支持回车搜索
- **TagSection**: 词单标签区域
- **StatsCard**: 学习统计卡片，显示进度
- **HistoryList**: 查词历史列表
- **HistoryItem**: 单个历史记录项
- **BottomNav**: 底部导航栏
- **IconButton**: 图标按钮组件

### 状态管理

使用 Zustand 进行全局状态管理：

- 用户学习统计（今日学习、目标、总单词数、连续天数）
- 查词历史记录
- 生词本数据
- 词单列表
- 持久化存储（localStorage）

## 📝 开发说明

### 自定义主题

在 `tailwind.config.js` 中修改主题配置：

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: '#2463eb',
        // ...
      }
    }
  }
}
```

### 添加新页面

1. 在 `src/pages/` 创建新页面组件
2. 在 `src/App.tsx` 中添加路由

```typescript
<Route path="/new-page" element={<NewPage />} />
```

### 图片资源

图片资源存储在 `src/assets/images.ts` 中，可以直接引用：

```typescript
import { images } from '@/assets/images'
```

## 🚀 部署到生产环境

### 部署到 AWS EC2

详细部署指南请查看：[AWS 部署完整指南](./docs/AWS_DEPLOYMENT_GUIDE.md)

#### 快速部署步骤

**1. 在 EC2 上配置环境**
```bash
# SSH 连接到 EC2
ssh -i ~/path/to/key.pem ubuntu@your-ec2-ip

# 运行服务器配置脚本
wget https://raw.githubusercontent.com/your-repo/server-setup.sh
bash server-setup.sh
```

**2. 从本地部署**
```bash
# 设置环境变量并运行部署脚本
EC2_IP=54.123.45.67 KEY_PATH=~/Downloads/word-app-key.pem ./deploy.sh
```

#### 部署方式对比

| 方式 | 优点 | 适用场景 |
|------|------|---------|
| **静态托管** | 简单、便宜 | 小型项目 |
| **EC2** | 灵活、可控 | 中大型项目 |
| **Vercel/Netlify** | 零配置、自动化 | 快速上线 |

### 其他部署选项

#### Vercel（推荐新手）
```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

#### Netlify
```bash
# 安装 Netlify CLI
npm i -g netlify-cli

# 部署
netlify deploy --prod
```

#### Docker 部署
```bash
# 构建镜像
docker build -t word-lookup-app .

# 运行容器
docker run -p 80:80 word-lookup-app
```

## 📄 License

MIT

## 👨‍💻 开发者

由 Claude Code 基于 Figma 设计稿自动生成
