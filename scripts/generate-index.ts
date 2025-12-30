#!/usr/bin/env tsx

/**
 * 生成章节列表和搜索索引
 * 
 * 功能：
 * 1. 读取所有章节的元数据
 * 2. 生成 chaptersMetadata.ts
 * 3. 生成 searchIndex.ts
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import matter from 'gray-matter'
import { statSync } from 'fs'
import yaml from 'js-yaml'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

interface ChapterMetadata {
  id: number
  title: string
  description: string
  path: string
  order: number
  created: Date
  modified: Date
  size: number
  keywords?: string[]
}

interface SiteConfig {
  site?: {
    title?: string
    description?: string
  }
  search?: {
    home?: {
      title?: string
      description?: string
      keywords?: string[]
    }
    playground?: {
      title?: string
      description?: string
      keywords?: string[]
    }
  }
}

/**
 * 读取章节元数据
 */
function readChaptersMetadata(): ChapterMetadata[] {
  const chaptersDir = join(projectRoot, 'content', 'chapters')
  
  if (!existsSync(chaptersDir)) {
    return []
  }
  
  const files = readdirSync(chaptersDir)
    .filter(file => file.endsWith('.md'))
    .map(file => join(chaptersDir, file))
  
  const chapters: ChapterMetadata[] = []
  
  for (const file of files) {
    try {
      const content = readFileSync(file, 'utf-8')
      const { data: frontMatter } = matter(content)
      const stats = statSync(file)
      
      // 从文件名提取 id（chapter-0.md -> 0）
      const filename = file.split('/').pop() || ''
      const idMatch = filename.match(/chapter-(\d+)\.md/)
      const id = idMatch ? parseInt(idMatch[1], 10) : frontMatter.order || 0
      
      if (frontMatter.title && frontMatter.order !== undefined) {
        chapters.push({
          id,
          title: frontMatter.title,
          description: frontMatter.description || '',
          path: frontMatter.path || `/chapter/${id}`,
          order: frontMatter.order,
          created: frontMatter.created ? new Date(frontMatter.created) : stats.birthtime,
          modified: frontMatter.modified ? new Date(frontMatter.modified) : stats.mtime,
          size: stats.size,
          keywords: frontMatter.keywords || []
        })
      }
    } catch (error) {
      console.error(`读取章节文件失败: ${file}`, error)
    }
  }
  
  // 按 order 排序
  chapters.sort((a, b) => a.order - b.order)
  
  return chapters
}

/**
 * 读取网站配置
 */
function readSiteConfig(): SiteConfig {
  const configPath = join(projectRoot, 'content', 'config.yaml')
  
  if (!existsSync(configPath)) {
    return {}
  }
  
  try {
    const content = readFileSync(configPath, 'utf-8')
    return yaml.load(content) as SiteConfig
  } catch (error) {
    console.error('读取网站配置失败:', error)
    return {}
  }
}

/**
 * 生成章节元数据文件
 */
function generateChaptersMetadata(chapters: ChapterMetadata[]): string {
  const chaptersCode = chapters.map(chapter => {
    return `  {
    id: ${chapter.id},
    title: ${JSON.stringify(chapter.title)},
    description: ${JSON.stringify(chapter.description)},
    path: ${JSON.stringify(chapter.path)},
    order: ${chapter.order},
    created: new Date(${JSON.stringify(chapter.created.toISOString())}),
    modified: new Date(${JSON.stringify(chapter.modified.toISOString())}),
    size: ${chapter.size},
    keywords: ${JSON.stringify(chapter.keywords || [])}
  }`
  }).join(',\n')
  
  return `// 自动生成，请勿手动编辑
export interface ChapterMetadata {
  id: number
  title: string
  description: string
  path: string
  order: number
  created: Date
  modified: Date
  size: number
  keywords?: string[]
}

export const chaptersMetadata: ChapterMetadata[] = [
${chaptersCode}
]
`
}

/**
 * 生成网站配置文件
 */
function generateSiteConfig(config: SiteConfig): string {
  const homeConfig = config.home || {}
  const siteConfig = config.site || {}
  
  return `// 自动生成，请勿手动编辑
// 此文件从 content/config.yaml 自动生成

export interface SiteConfig {
  site?: {
    title?: string
    description?: string
  }
  home?: {
    heroTitle?: string
    heroDescription?: string
    playgroundButtonText?: string
    aboutTitle?: string
    aboutDescription?: string
    learningPointsTitle?: string
    learningPoints?: string[]
  }
  search?: {
    home?: {
      title?: string
      description?: string
      keywords?: string[]
    }
    playground?: {
      title?: string
      description?: string
      keywords?: string[]
    }
  }
}

export const siteConfig: SiteConfig = ${JSON.stringify(config, null, 2)}

export default siteConfig
`
}

/**
 * 生成搜索索引文件
 */
function generateSearchIndex(chapters: ChapterMetadata[], config: SiteConfig): string {
  const searchItems: string[] = []
  
  // 添加首页
  const homeConfig = config.search?.home || {}
  searchItems.push(`  {
    id: 'home',
    title: ${JSON.stringify(homeConfig.title || '首页')},
    description: ${JSON.stringify(homeConfig.description || 'WebGL 学习教程首页，浏览所有章节')},
    path: '/',
    keywords: ${JSON.stringify(homeConfig.keywords || ['首页', '主页', 'home', '教程', 'webgl'])},
    type: 'home'
  }`)
  
  // 添加 Playground
  const playgroundConfig = config.search?.playground || {}
  searchItems.push(`  {
    id: 'playground',
    title: ${JSON.stringify(playgroundConfig.title || 'Playground')},
    description: ${JSON.stringify(playgroundConfig.description || 'WebGL 交互式代码编辑器，在线编写和运行 WebGL 代码')},
    path: '/playground',
    keywords: ${JSON.stringify(playgroundConfig.keywords || ['playground', '编辑器', '代码', '在线', '运行', '交互'])},
    type: 'playground'
  }`)
  
  // 添加章节
  chapters.forEach(chapter => {
    searchItems.push(`  {
    id: 'chapter-${chapter.id}',
    title: ${JSON.stringify(chapter.title)},
    description: ${JSON.stringify(chapter.description)},
    path: ${JSON.stringify(chapter.path)},
    keywords: ${JSON.stringify(chapter.keywords || [])},
    type: 'chapter'
  }`)
  })
  
  return `// 自动生成，请勿手动编辑
export interface SearchItem {
  id: string
  title: string
  description: string
  path: string
  keywords: string[]
  type: 'home' | 'chapter' | 'playground'
}

export const searchIndex: SearchItem[] = [
${searchItems.join(',\n')}
]

/**
 * 分词函数：将查询字符串拆分为多个关键词
 */
function tokenize(query: string): string[] {
  const trimmed = query.trim()
  if (!trimmed) return []
  
  // 支持中英文混合分词
  // 中文按字符分割，英文按单词分割
  const tokens: string[] = []
  
  // 先按空格分割
  const parts = trimmed.split(/\\s+/)
  
  parts.forEach(part => {
    if (!part) return
    
    // 如果是纯英文，按单词分割
    if (/^[a-zA-Z0-9]+$/.test(part)) {
      tokens.push(part.toLowerCase())
    } 
    // 如果是中文，按字符分割（但保留完整词）
    else {
      // 先添加完整词
      tokens.push(part.toLowerCase())
      // 如果长度大于1，也添加单个字符（用于部分匹配）
      if (part.length > 1) {
        for (let i = 0; i < part.length; i++) {
          const char = part[i].toLowerCase()
          if (char.trim() && !tokens.includes(char)) {
            tokens.push(char)
          }
        }
      }
    }
  })
  
  return tokens
}

/**
 * 计算两个字符串的相似度（简单的包含匹配）
 */
function calculateSimilarity(text: string, query: string): number {
  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()
  
  // 完全匹配
  if (lowerText === lowerQuery) return 1.0
  // 开头匹配
  if (lowerText.startsWith(lowerQuery)) return 0.8
  // 包含匹配
  if (lowerText.includes(lowerQuery)) return 0.6
  // 分词匹配
  const tokens = tokenize(query)
  let matchCount = 0
  tokens.forEach(token => {
    if (lowerText.includes(token)) {
      matchCount++
    }
  })
  if (matchCount > 0) {
    return 0.3 * (matchCount / tokens.length)
  }
  
  return 0
}

// 搜索函数
export function search(query: string): SearchItem[] {
  if (!query.trim()) {
    return []
  }

  const lowerQuery = query.toLowerCase().trim()
  const queryTokens = tokenize(query)
  const results: Array<{ item: SearchItem; score: number }> = []

  searchIndex.forEach(item => {
    let score = 0

    // 标题匹配（权重最高）
    const titleSimilarity = calculateSimilarity(item.title, query)
    if (titleSimilarity === 1.0) {
      score += 100
    } else if (titleSimilarity >= 0.8) {
      score += 80
    } else if (titleSimilarity >= 0.6) {
      score += 50
    } else if (titleSimilarity > 0) {
      score += 30 * titleSimilarity
    }

    // 描述匹配
    const descSimilarity = calculateSimilarity(item.description, query)
    if (descSimilarity > 0) {
      score += 20 * descSimilarity
    }

    // 关键词匹配（逐个检查）
    item.keywords.forEach(keyword => {
      const keywordLower = keyword.toLowerCase()
      
      // 完全匹配
      if (keywordLower === lowerQuery) {
        score += 40
      }
      // 关键词包含查询
      else if (keywordLower.includes(lowerQuery)) {
        score += 25
      }
      // 查询包含关键词
      else if (lowerQuery.includes(keywordLower)) {
        score += 20
      }
      // 分词匹配
      else {
        queryTokens.forEach(token => {
          if (keywordLower.includes(token) || token.includes(keywordLower)) {
            score += 10
          }
        })
      }
    })

    // 路径匹配
    if (item.path.toLowerCase().includes(lowerQuery)) {
      score += 5
    }

    // 如果所有分词都能在标题、描述或关键词中找到，额外加分
    if (queryTokens.length > 1) {
      let allTokensMatch = true
      queryTokens.forEach(token => {
        const found = 
          item.title.toLowerCase().includes(token) ||
          item.description.toLowerCase().includes(token) ||
          item.keywords.some(k => k.toLowerCase().includes(token))
        if (!found) {
          allTokensMatch = false
        }
      })
      if (allTokensMatch) {
        score += 15
      }
    }

    if (score > 0) {
      results.push({ item, score })
    }
  })

  // 按分数排序，分数高的在前
  results.sort((a, b) => b.score - a.score)

  return results.map(r => r.item)
}
`
}

/**
 * 主函数
 */
function main() {
  console.log('开始生成章节列表和搜索索引...\n')
  
  // 读取章节元数据
  const chapters = readChaptersMetadata()
  console.log(`读取到 ${chapters.length} 个章节`)
  
  // 读取网站配置
  const config = readSiteConfig()
  
  // 生成章节元数据文件
  const chaptersMetadataCode = generateChaptersMetadata(chapters)
  const chaptersMetadataPath = join(projectRoot, 'src', 'utils', 'chaptersMetadata.ts')
  writeFileSync(chaptersMetadataPath, chaptersMetadataCode, 'utf-8')
  console.log(`✓ 生成: ${chaptersMetadataPath}`)
  
  // 生成搜索索引文件
  const searchIndexCode = generateSearchIndex(chapters, config)
  const searchIndexPath = join(projectRoot, 'src', 'utils', 'searchIndex.ts')
  writeFileSync(searchIndexPath, searchIndexCode, 'utf-8')
  console.log(`✓ 生成: ${searchIndexPath}`)
  
  // 生成网站配置文件
  const siteConfigCode = generateSiteConfig(config)
  const siteConfigPath = join(projectRoot, 'src', 'utils', 'siteConfig.ts')
  writeFileSync(siteConfigPath, siteConfigCode, 'utf-8')
  console.log(`✓ 生成: ${siteConfigPath}`)
  
  console.log(`\n生成完成！`)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { readChaptersMetadata, generateChaptersMetadata, generateSearchIndex }

