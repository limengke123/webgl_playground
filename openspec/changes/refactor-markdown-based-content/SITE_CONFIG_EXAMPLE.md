# 网站配置和首页内容示例

本文档展示了如何配置网站内容和首页，实现完全动态化的内容管理。

## 网站配置文件 (`content/config.yaml`)

```yaml
site:
  title: "WebGL 学习教程"
  description: "从零开始学习 WebGL，通过交互式示例深入理解图形学基础"
  subtitle: "从零开始学习 WebGL，通过交互式示例深入理解图形学基础"
  language: "zh-CN"

home:
  heroTitle: "WebGL 学习教程"
  heroDescription: "从零开始学习 WebGL，通过交互式示例深入理解图形学基础"
  playgroundButtonText: "进入 Playground"
  aboutTitle: "关于本教程"
  aboutDescription: |
    这是一个交互式的 WebGL 学习平台，旨在帮助你从零开始掌握 WebGL 和图形学基础。
    每个章节都包含详细的理论讲解和可交互的代码示例，让你在实践中学习。
  learningPointsTitle: "你将学到："
  learningPoints:
    - "WebGL 基础概念和 API"
    - "GLSL 着色器语言语法"
    - "3D 数学（向量、矩阵、MVP 变换）"
    - "渲染管线深入理解"
    - "相机控制和投影矩阵"
    - "光照模型（环境光、漫反射、镜面反射）"
    - "材质、纹理和贴图"
    - "交互控制和动画循环"
    - "性能优化最佳实践"

search:
  home:
    title: "首页"
    description: "WebGL 学习教程首页，浏览所有章节"
    keywords:
      - "首页"
      - "主页"
      - "home"
      - "教程"
      - "webgl"
  playground:
    title: "Playground"
    description: "WebGL 交互式代码编辑器，在线编写和运行 WebGL 代码"
    keywords:
      - "playground"
      - "编辑器"
      - "代码"
      - "在线"
      - "运行"
      - "交互"
```

## 首页内容文件 (`content/home.md`)

首页内容可以使用 Markdown 格式，也可以从配置文件中读取。推荐使用配置文件，因为首页主要是结构化数据。

如果首页有大量文本内容，可以使用 Markdown：

```markdown
---
type: home
---

# WebGL 学习教程

从零开始学习 WebGL，通过交互式示例深入理解图形学基础

[进入 Playground](/playground) →

## 关于本教程

这是一个交互式的 WebGL 学习平台，旨在帮助你从零开始掌握 WebGL 和图形学基础。
每个章节都包含详细的理论讲解和可交互的代码示例，让你在实践中学习。

### 你将学到：

- WebGL 基础概念和 API
- GLSL 着色器语言语法
- 3D 数学（向量、矩阵、MVP 变换）
- 渲染管线深入理解
- 相机控制和投影矩阵
- 光照模型（环境光、漫反射、镜面反射）
- 材质、纹理和贴图
- 交互控制和动画循环
- 性能优化最佳实践
```

## 章节 Front Matter 示例

每个章节的 Markdown 文件需要包含完整的 Front Matter：

```yaml
---
title: "第零章：从零开始创建 WebGL 项目"
description: "手把手教你创建 canvas 元素，获取 WebGL 上下文，搭建第一个 WebGL 项目"
order: 0
path: "/chapter/0"
created: "2024-01-15"
modified: "2024-01-20"
keywords:
  - "创建项目"
  - "canvas"
  - "上下文"
  - "初始化"
  - "项目搭建"
  - "getContext"
  - "基础"
  - "开始"
  - "入门"
---
```

## 生成的章节元数据文件 (`src/utils/chaptersMetadata.ts`)

转换脚本会自动生成：

```typescript
// 自动生成，请勿手动编辑
export interface ChapterMetadata {
  id: number
  title: string
  description: string
  path: string
  order: number
  created: Date
  modified: Date
  keywords?: string[]
}

export const chaptersMetadata: ChapterMetadata[] = [
  {
    id: 0,
    title: "第零章：从零开始创建 WebGL 项目",
    description: "手把手教你创建 canvas 元素，获取 WebGL 上下文，搭建第一个 WebGL 项目",
    path: "/chapter/0",
    order: 0,
    created: new Date('2024-01-15'),
    modified: new Date('2024-01-20'),
    keywords: ["创建项目", "canvas", "上下文", ...]
  },
  {
    id: 1,
    title: "第一章：WebGL 基础",
    description: "学习 WebGL 的基本概念，绘制第一个三角形，了解着色器的工作原理",
    path: "/chapter/1",
    order: 1,
    created: new Date('2024-01-16'),
    modified: new Date('2024-01-21'),
    keywords: ["webgl基础", "三角形", "着色器", ...]
  },
  // ...
]
```

## 生成的搜索索引文件 (`src/utils/searchIndex.ts`)

转换脚本会自动生成：

```typescript
// 自动生成，请勿手动编辑
import { chaptersMetadata } from './chaptersMetadata'
import siteConfig from '../../content/config.yaml'

export interface SearchItem {
  id: string
  title: string
  description: string
  path: string
  keywords: string[]
  type: 'home' | 'chapter' | 'playground'
}

export const searchIndex: SearchItem[] = [
  {
    id: 'home',
    title: siteConfig.search.home.title,
    description: siteConfig.search.home.description,
    path: '/',
    keywords: siteConfig.search.home.keywords,
    type: 'home'
  },
  {
    id: 'playground',
    title: siteConfig.search.playground.title,
    description: siteConfig.search.playground.description,
    path: '/playground',
    keywords: siteConfig.search.playground.keywords,
    type: 'playground'
  },
  ...chaptersMetadata.map(chapter => ({
    id: `chapter-${chapter.id}`,
    title: chapter.title,
    description: chapter.description,
    path: chapter.path,
    keywords: chapter.keywords || [],
    type: 'chapter' as const
  }))
]

// 搜索函数保持不变
export function search(query: string): SearchItem[] {
  // ... 搜索逻辑
}
```

## Home.tsx 使用示例

更新后的 Home.tsx 会动态导入章节列表：

```tsx
import { Link } from 'react-router-dom'
import { chaptersMetadata } from '../utils/chaptersMetadata'
import siteConfig from '../../content/config.yaml'

export default function Home() {
  return (
    <div className="w-full relative z-10">
      <div className="text-center py-15 border-b border-dark-border dark:border-dark-border border-light-border mb-10 relative">
        <h1 className="text-5xl mb-5 relative">
          <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
            {siteConfig.home.heroTitle}
          </span>
        </h1>
        <p className="text-xl text-dark-text-muted dark:text-dark-text-muted text-light-text-muted relative mb-6">
          {siteConfig.home.heroDescription}
        </p>
        <Link 
          to="/playground" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-purple-500 text-white rounded-lg hover:from-primary/90 hover:to-purple-500/90 transition-all font-medium shadow-lg hover:shadow-xl relative z-10"
        >
          <span>🎮</span>
          <span>{siteConfig.home.playgroundButtonText}</span>
          <span>→</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-15">
        {chaptersMetadata.map(chapter => (
          <Link 
            key={chapter.id} 
            to={chapter.path} 
            className="tech-card p-8 no-underline text-inherit relative overflow-hidden group"
          >
            <div className="absolute top-5 right-5 text-5xl font-bold opacity-20 group-hover:opacity-30 transition-opacity">
              <span className="bg-gradient-to-br from-primary to-purple-500 bg-clip-text text-transparent">
                {chapter.id}
              </span>
            </div>
            <h2 className="text-2xl mb-4 relative z-10">
              <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                {chapter.title}
              </span>
            </h2>
            <p className="text-dark-text-muted dark:text-dark-text-muted text-light-text-muted mb-5 leading-relaxed relative z-10">
              {chapter.description}
            </p>
            <div className="text-primary font-medium relative z-10 flex items-center gap-2 group-hover:gap-3 transition-all">
              开始学习 
              <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="tech-card p-10 relative overflow-hidden">
        <h2 className="text-3xl mb-5 relative">
          <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            {siteConfig.home.aboutTitle}
          </span>
        </h2>
        <p className="text-dark-text-muted dark:text-dark-text-muted text-light-text-muted leading-relaxed mb-5">
          {siteConfig.home.aboutDescription}
        </p>
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">
          {siteConfig.home.learningPointsTitle}
        </h3>
        <ul className="text-dark-text-muted dark:text-dark-text-muted text-light-text-muted leading-loose pl-8 space-y-2">
          {siteConfig.home.learningPoints.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="text-primary">▹</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
```

## 添加新章节的流程

1. **创建 Markdown 文件**：`content/chapters/chapter-11.md`
2. **添加 Front Matter**：
   ```yaml
   ---
   title: "第十一章：新章节标题"
   description: "章节描述"
   order: 11
   path: "/chapter/11"
   keywords: ["关键词1", "关键词2"]
   ---
   ```
3. **运行转换脚本**：`pnpm dev:convert` 或 `pnpm build`
4. **自动更新**：
   - 章节列表自动包含新章节
   - 搜索索引自动更新
   - 路由自动可用（如果使用动态路由）

## 优势

1. **无需修改代码**：添加新章节只需创建 Markdown 文件
2. **内容集中管理**：所有内容都在 `content/` 目录
3. **自动同步**：章节列表、搜索索引自动生成
4. **易于维护**：修改标题、描述只需编辑 Front Matter
5. **版本控制友好**：Markdown 文件易于版本控制和协作

