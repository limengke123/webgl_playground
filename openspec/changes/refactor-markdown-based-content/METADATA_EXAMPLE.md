# 文件元数据使用示例

本文档展示了如何在 Markdown 文件中使用 Front Matter 定义元数据，以及转换脚本如何自动提取文件系统元数据。

## Front Matter 语法

在 Markdown 文件顶部使用 YAML Front Matter 定义元数据：

```yaml
---
title: "第零章：从零开始创建 WebGL 项目"
description: "手把手教你创建 canvas 元素，获取 WebGL 上下文，搭建第一个 WebGL 项目"
created: "2024-01-15"
modified: "2024-01-20"
order: 0
---
```

## 完整的章节文件示例

```markdown
---
title: "第零章：从零开始创建 WebGL 项目"
description: "手把手教你创建 canvas 元素，获取 WebGL 上下文"
created: "2024-01-15"
modified: "2024-01-20"
order: 0
---

# 第零章：从零开始创建 WebGL 项目

这里是章节内容...

## 准备工作

学习 WebGL 之前，我们需要先了解如何创建一个基本的 WebGL 项目...
```

## 元数据字段说明

### 必需字段
- **title**: 章节标题（字符串）
- **order**: 章节顺序（数字，用于排序）

### 可选字段
- **description**: 章节描述（字符串，用于首页展示）
- **created**: 创建日期（ISO 日期字符串，如 "2024-01-15"）
- **modified**: 修改日期（ISO 日期字符串，如 "2024-01-20"）
- **author**: 作者（字符串，可选）
- **tags**: 标签（数组，可选）

## 文件系统元数据（自动提取）

转换脚本会自动从文件系统获取以下元数据：

- **birthtime**: 文件创建时间（Date 对象）
- **mtime**: 文件最后修改时间（Date 对象）
- **size**: 文件大小（字节数）

**优先级规则**：
- 如果 Front Matter 中定义了 `created` 或 `modified`，使用 Front Matter 的值
- 如果 Front Matter 中没有定义，使用文件系统的 `birthtime` 和 `mtime`

## 生成的组件代码示例

转换后的 React 组件会包含元数据常量：

```tsx
// 自动生成的元数据
export const metadata = {
  title: "第零章：从零开始创建 WebGL 项目",
  description: "手把手教你创建 canvas 元素，获取 WebGL 上下文",
  created: new Date('2024-01-15'),
  modified: new Date('2024-01-20'),
  order: 0,
  size: 12345, // 从文件系统获取
}

export default function Chapter0() {
  return (
    <div className="w-full">
      <h1 className="text-4xl mb-8 text-primary border-b-2 border-dark-border dark:border-dark-border border-light-border pb-4">
        {metadata.title}
      </h1>
      
      {/* 章节内容 */}
      
      {/* 元数据显示 */}
      <footer className="mt-12 pt-6 border-t border-dark-border dark:border-dark-border border-light-border">
        <p className="text-sm text-dark-text-muted dark:text-dark-text-muted text-light-text-muted">
          最后更新：{metadata.modified.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </footer>
    </div>
  )
}
```

## 在页面中使用元数据

### 显示最后更新日期

```tsx
<footer className="mt-12 text-sm text-gray-500">
  最后更新：{metadata.modified.toLocaleDateString('zh-CN')}
</footer>
```

### 显示创建日期

```tsx
<p className="text-sm text-gray-500">
  创建于：{metadata.created.toLocaleDateString('zh-CN')}
</p>
```

### 格式化日期（中文）

```tsx
const formatDate = (date: Date) => {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 使用
<p>最后更新：{formatDate(metadata.modified)}</p>
// 输出：最后更新：2024年1月20日
```

### 相对时间（可选）

```tsx
const getRelativeTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  if (days < 30) return `${Math.floor(days / 7)}周前`
  return date.toLocaleDateString('zh-CN')
}

// 使用
<p>最后更新：{getRelativeTime(metadata.modified)}</p>
```

## 在首页章节列表中使用元数据

```tsx
// Home.tsx
import { metadata as chapter0Metadata } from './pages/chapters/Chapter0'
import { metadata as chapter1Metadata } from './pages/chapters/Chapter1'
// ...

const chapters = [
  {
    id: 0,
    title: chapter0Metadata.title,
    description: chapter0Metadata.description,
    modified: chapter0Metadata.modified,
    path: '/chapter/0'
  },
  // ...
]

// 显示最后更新日期
{chapters.map(chapter => (
  <div key={chapter.id}>
    <h2>{chapter.title}</h2>
    <p>最后更新：{chapter.modified.toLocaleDateString('zh-CN')}</p>
  </div>
))}
```

## 日期格式说明

### Front Matter 中的日期格式

支持以下格式：
- ISO 日期：`"2024-01-15"`
- ISO 日期时间：`"2024-01-15T10:30:00"`
- 完整日期时间：`"2024-01-15T10:30:00Z"`

### 转换后的 Date 对象

所有日期都会被转换为 JavaScript `Date` 对象，可以在组件中直接使用：

```tsx
metadata.created instanceof Date // true
metadata.modified instanceof Date // true
```

## 注意事项

1. **日期格式**：Front Matter 中的日期应使用 ISO 8601 格式
2. **时区**：文件系统的日期使用本地时区，Front Matter 日期如果没有时区信息则使用本地时区
3. **修改时间**：文件系统的 `mtime` 会在文件保存时自动更新，无需手动维护
4. **版本控制**：如果使用 Git，文件的创建时间可能不准确（取决于 Git 历史），建议在 Front Matter 中明确指定

