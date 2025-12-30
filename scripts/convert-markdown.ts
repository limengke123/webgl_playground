#!/usr/bin/env ts-node

/**
 * Markdown 转 React 组件转换脚本
 * 
 * 功能：
 * 1. 读取 content/chapters/ 目录下的 Markdown 文件
 * 2. 解析 Front Matter 和文件元数据
 * 3. 转换 Markdown 为 React 组件
 * 4. 生成 TypeScript 文件到 src/pages/chapters/
 */

import { readFileSync, writeFileSync, statSync, readdirSync, existsSync, mkdirSync } from 'fs'
import { join, dirname, basename, extname } from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import { visit } from 'unist-util-visit'
import type { Root, Node } from 'mdast'
import { convertASTToJSX } from './markdown-to-jsx'
import { preprocessMarkdown } from './custom-components'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

interface ChapterMetadata {
  title: string
  description: string
  order: number
  path: string
  created?: Date
  modified?: Date
  size?: number
  keywords?: string[]
  [key: string]: any
}

interface FileMetadata {
  created: Date
  modified: Date
  size: number
}

/**
 * 获取文件系统元数据
 */
function getFileMetadata(filePath: string): FileMetadata {
  const stats = statSync(filePath)
  return {
    created: stats.birthtime,
    modified: stats.mtime,
    size: stats.size
  }
}

/**
 * 解析 Markdown 文件，提取 Front Matter 和内容
 */
function parseMarkdownFile(filePath: string): { frontMatter: any, content: string, fileMetadata: FileMetadata } {
  const fileContent = readFileSync(filePath, 'utf-8')
  const fileMetadata = getFileMetadata(filePath)
  const { data: frontMatter, content } = matter(fileContent)
  
  return { frontMatter, content, fileMetadata }
}

/**
 * 将日期字符串转换为 Date 对象
 */
function parseDate(date: string | Date | undefined, fallback: Date): Date {
  if (!date) return fallback
  if (date instanceof Date) return date
  return new Date(date)
}

/**
 * 合并 Front Matter 和文件系统元数据
 */
function mergeMetadata(frontMatter: any, fileMetadata: FileMetadata): ChapterMetadata {
  return {
    ...frontMatter,
    created: parseDate(frontMatter.created, fileMetadata.created),
    modified: parseDate(frontMatter.modified, fileMetadata.modified),
    size: fileMetadata.size
  }
}

/**
 * 转换 Markdown 内容为 React 组件代码
 */
function convertMarkdownToReact(markdown: string, metadata: ChapterMetadata): string {
  // 预处理：提取自定义组件
  const { processedContent, codeBlocks, flipCards } = preprocessMarkdown(markdown)
  
  // 使用 remark 解析 Markdown
  const processor = remark()
    .use(remarkFrontmatter)
    .use(remarkGfm)
  
  const ast = processor.parse(processedContent)
  
  // 转换 AST 为 JSX
  let jsxContent = ''
  try {
    jsxContent = convertASTToJSX(ast, codeBlocks, flipCards)
    if (!jsxContent || jsxContent.trim() === '') {
      console.warn('警告: Markdown 内容转换结果为空')
      jsxContent = '      {/* Markdown 内容为空或转换失败 */}'
    }
  } catch (error) {
    console.error('转换 Markdown 时出错:', error)
    if (error instanceof Error) {
      console.error('错误堆栈:', error.stack)
    }
    jsxContent = `      {/* 转换错误: ${error} */}`
  }
  
  const componentName = `Chapter${metadata.order}`
  
  return `import WebGLCanvas from '../../components/WebGLCanvas'
import CodeBlock from '../../components/CodeBlock'
import FlipCard from '../../components/FlipCard'
import ChapterNavigation from '../../components/ChapterNavigation'

// 自动生成的元数据
export const metadata = {
  title: ${JSON.stringify(metadata.title)},
  description: ${JSON.stringify(metadata.description)},
  order: ${metadata.order},
  path: ${JSON.stringify(metadata.path)},
  created: new Date(${JSON.stringify(metadata.created.toISOString())}),
  modified: new Date(${JSON.stringify(metadata.modified.toISOString())}),
  size: ${metadata.size},
  keywords: ${JSON.stringify(metadata.keywords || [])}
}

export default function ${componentName}() {
  return (
    <div className="w-full">
      <h1 className="text-4xl mb-8 text-primary border-b-2 border-dark-border dark:border-dark-border border-light-border pb-4">
        {metadata.title}
      </h1>
      
${jsxContent}
      
      <footer className="mt-12 pt-6 border-t border-dark-border dark:border-dark-border border-light-border">
        <p className="text-sm text-dark-text-muted dark:text-dark-text-muted text-light-text-muted">
          最后更新：{metadata.modified.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </footer>
      
      <ChapterNavigation />
    </div>
  )
}
`
}

/**
 * 转换单个章节文件
 */
function convertChapterFile(mdPath: string, outputDir: string): ChapterMetadata | null {
  try {
    console.log(`转换文件: ${mdPath}`)
    
    const { frontMatter, content, fileMetadata } = parseMarkdownFile(mdPath)
    const metadata = mergeMetadata(frontMatter, fileMetadata)
    
    // 确保必要的字段存在
    if (!metadata.title || metadata.order === undefined) {
      console.warn(`警告: ${mdPath} 缺少必要的 Front Matter (title 或 order)`)
      return null
    }
    
    // 生成 React 组件代码
    const componentCode = convertMarkdownToReact(content, metadata)
    
    // 确保输出目录存在
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true })
    }
    
    // 写入生成的文件
    const outputPath = join(outputDir, `Chapter${metadata.order}.tsx`)
    writeFileSync(outputPath, componentCode, 'utf-8')
    
    console.log(`✓ 生成: ${outputPath}`)
    
    return metadata
  } catch (error) {
    console.error(`错误: 转换 ${mdPath} 时出错:`, error)
    return null
  }
}

/**
 * 转换所有章节文件
 */
function convertAllChapters(): ChapterMetadata[] {
  const chaptersDir = join(projectRoot, 'content', 'chapters')
  const outputDir = join(projectRoot, 'src', 'pages', 'chapters')
  
  if (!existsSync(chaptersDir)) {
    console.log(`目录不存在: ${chaptersDir}`)
    return []
  }
  
  const files = readdirSync(chaptersDir)
    .filter(file => file.endsWith('.md'))
    .map(file => join(chaptersDir, file))
  
  const chapters: ChapterMetadata[] = []
  
  for (const file of files) {
    const metadata = convertChapterFile(file, outputDir)
    if (metadata) {
      chapters.push(metadata)
    }
  }
  
  // 按 order 排序
  chapters.sort((a, b) => a.order - b.order)
  
  return chapters
}

/**
 * 主函数
 */
function main() {
  console.log('开始转换 Markdown 文件...\n')
  
  const chapters = convertAllChapters()
  
  console.log(`\n转换完成！共转换 ${chapters.length} 个章节。`)
  
  // 注意：章节列表和搜索索引的生成已移到独立的 generate-index.ts 脚本
  // 在 package.json 中通过 && 连接两个命令，确保先转换再生成索引
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { convertAllChapters, convertChapterFile }

