#!/usr/bin/env tsx

/**
 * 改进的章节迁移脚本
 * 
 * 从 React 组件中提取内容，转换为 Markdown 格式
 * 更准确地处理 FlipCard 和 CodeBlock 组件
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

/**
 * 提取章节标题
 */
function extractTitle(content: string): string {
  const match = content.match(/<h1[^>]*>([^<]+)<\/h1>/)
  if (match) {
    return match[1].trim()
  }
  return ''
}

/**
 * 提取章节描述
 */
function extractDescription(content: string): string {
  // 从第一个段落提取
  const match = content.match(/<p[^>]*>([^<]+)<\/p>/)
  if (match) {
    return match[1].trim().substring(0, 150)
  }
  return ''
}

/**
 * 提取关键词（从章节标题推断）
 */
function extractKeywords(title: string): string[] {
  const keywords: string[] = []
  
  // 从标题提取关键词
  if (title.includes('GLSL')) keywords.push('glsl', '语法', '着色器')
  if (title.includes('3D')) keywords.push('3d', '数学', '向量', '矩阵')
  if (title.includes('渲染')) keywords.push('渲染', '管线')
  if (title.includes('相机')) keywords.push('相机', '投影', 'mvp')
  if (title.includes('光照')) keywords.push('光照', 'lighting')
  if (title.includes('材质')) keywords.push('材质', '纹理', 'texture')
  if (title.includes('交互')) keywords.push('交互', '动画', 'animation')
  if (title.includes('性能')) keywords.push('性能', '优化', 'optimization')
  if (title.includes('高级')) keywords.push('高级', '渲染技术')
  
  return keywords.length > 0 ? keywords : ['webgl']
}

/**
 * 转换 JSX 内容为 Markdown
 */
function convertJSXToMarkdown(content: string): string {
  let markdown = content
  
  // 1. 先提取 FlipCard 组件（最复杂，需要先处理）
  const flipCards: Array<{ placeholder: string, markdown: string }> = []
  const flipCardRegex = /<FlipCard\s+([^>]*)>([\s\S]*?)<\/FlipCard>/g
  let flipCardMatch
  let flipCardIndex = 0
  
  while ((flipCardMatch = flipCardRegex.exec(content)) !== null) {
    const attrs = flipCardMatch[1]
    const innerContent = flipCardMatch[2]
    
    // 提取 width 和 height
    const widthMatch = attrs.match(/width=\{(\d+)\}/)
    const heightMatch = attrs.match(/height=\{(\d+)\}/)
    const width = widthMatch ? widthMatch[1] : '400'
    const height = heightMatch ? heightMatch[1] : '400'
    
    // 提取 onInit
    const onInitMatch = innerContent.match(/onInit=\{\([^)]+\)\s*=>\s*\{([\s\S]*?)\}\s*\}/)
    let onInitCode = ''
    if (onInitMatch) {
      onInitCode = onInitMatch[1].trim()
    }
    
    // 提取 codeBlocks
    const codeBlocksMatch = innerContent.match(/codeBlocks=\{\[([\s\S]*?)\]\}/)
    const codeBlocks: Array<{ title: string, code: string, language?: string }> = []
    
    if (codeBlocksMatch) {
      const codeBlocksContent = codeBlocksMatch[1]
      // 匹配每个 codeBlock 对象
      const codeBlockRegex = /\{\s*title:\s*['"]([^'"]+)['"],\s*code:\s*`([^`]+)`(?:\s*,\s*language:\s*['"]([^'"]+)['"])?\s*\}/g
      let cbMatch
      while ((cbMatch = codeBlockRegex.exec(codeBlocksContent)) !== null) {
        codeBlocks.push({
          title: cbMatch[1],
          code: cbMatch[2],
          language: cbMatch[3] || 'glsl'
        })
      }
    }
    
    // 构建 Markdown 格式的 FlipCard
    let flipCardMarkdown = `<FlipCard width={${width}} height={${height}}>\n`
    if (onInitCode) {
      // 清理 onInit 代码中的模板字符串标记
      let cleanedOnInit = onInitCode
        .replace(/const\s+vertexShader\s*=\s*`/g, 'const vertexShader = `')
        .replace(/const\s+fragmentShader\s*=\s*`/g, 'const fragmentShader = `')
      
      flipCardMarkdown += `  <onInit>\n    {(gl, canvas) => {\n${cleanedOnInit.split('\n').map(line => '      ' + line).join('\n')}\n    }}\n  </onInit>\n`
    }
    if (codeBlocks.length > 0) {
      codeBlocks.forEach(cb => {
        flipCardMarkdown += `  <codeBlock title="${cb.title}" language="${cb.language || 'glsl'}">\n${cb.code.split('\n').map(line => '    ' + line).join('\n')}\n  </codeBlock>\n`
      })
    }
    flipCardMarkdown += '</FlipCard>'
    
    const placeholder = `FLIPCARD_PLACEHOLDER_${flipCardIndex}`
    flipCards.push({ placeholder, markdown: flipCardMarkdown })
    markdown = markdown.replace(flipCardMatch[0], placeholder)
    flipCardIndex++
  }
  
  // 2. 提取 CodeBlock 组件
  const codeBlocks: Array<{ placeholder: string, markdown: string }> = []
  const codeBlockRegex = /<CodeBlock\s+([^>]*?)\s*\/>/g
  let codeBlockMatch
  let codeBlockIndex = 0
  
  while ((codeBlockMatch = codeBlockRegex.exec(markdown)) !== null) {
    const attrs = codeBlockMatch[1]
    const titleMatch = attrs.match(/title=["']([^"']+)["']/)
    const codeMatch = attrs.match(/code=\{`([^`]+)`\}/)
    const languageMatch = attrs.match(/language=["']([^"']+)["']/)
    
    if (codeMatch) {
      const title = titleMatch ? titleMatch[1] : ''
      const code = codeMatch[1]
      const language = languageMatch ? languageMatch[1] : 'glsl'
      
      const codeBlockMarkdown = `<CodeBlock title="${title}" language="${language}">\n${code}\n</CodeBlock>`
      const placeholder = `CODEBLOCK_PLACEHOLDER_${codeBlockIndex}`
      codeBlocks.push({ placeholder, markdown: codeBlockMarkdown })
      markdown = markdown.replace(codeBlockMatch[0], placeholder)
      codeBlockIndex++
    }
  }
  
  // 3. 转换基础 HTML 标签
  markdown = markdown.replace(/<h2[^>]*>([^<]+)<\/h2>/g, '## $1')
  markdown = markdown.replace(/<h3[^>]*>([^<]+)<\/h3>/g, '### $1')
  markdown = markdown.replace(/<h4[^>]*>([^<]+)<\/h4>/g, '#### $1')
  
  // 转换段落（需要处理嵌套的 strong 和 code）
  markdown = markdown.replace(/<p[^>]*>([\s\S]*?)<\/p>/g, (match, content) => {
    let text = content
    text = text.replace(/<strong[^>]*>([^<]+)<\/strong>/g, '**$1**')
    text = text.replace(/<code[^>]*>([^<]+)<\/code>/g, '`$1`')
    return text.trim() + '\n\n'
  })
  
  // 转换列表
  markdown = markdown.replace(/<ul[^>]*>/g, '')
  markdown = markdown.replace(/<\/ul>/g, '')
  markdown = markdown.replace(/<ol[^>]*>/g, '')
  markdown = markdown.replace(/<\/ol>/g, '')
  markdown = markdown.replace(/<li[^>]*>([\s\S]*?)<\/li>/g, (match, content) => {
    let text = content.trim()
    text = text.replace(/<strong[^>]*>([^<]+)<\/strong>/g, '**$1**')
    text = text.replace(/<code[^>]*>([^<]+)<\/code>/g, '`$1`')
    // 处理嵌套列表
    if (text.includes('<ul>') || text.includes('<ol>')) {
      text = text.replace(/<ul[^>]*>/g, '\n')
      text = text.replace(/<\/ul>/g, '')
      text = text.replace(/<ol[^>]*>/g, '\n')
      text = text.replace(/<\/ol>/g, '')
      text = text.replace(/<li[^>]*>([\s\S]*?)<\/li>/g, '  - $1\n')
    }
    return '- ' + text + '\n'
  })
  
  // 移除其他 HTML 标签
  markdown = markdown.replace(/<section[^>]*>/g, '')
  markdown = markdown.replace(/<\/section>/g, '\n')
  markdown = markdown.replace(/<div[^>]*>/g, '')
  markdown = markdown.replace(/<\/div>/g, '')
  markdown = markdown.replace(/<footer[^>]*>[\s\S]*?<\/footer>/g, '')
  markdown = markdown.replace(/<ChapterNavigation\s*\/>/g, '')
  
  // 恢复占位符
  codeBlocks.forEach(({ placeholder, markdown: cbMarkdown }) => {
    markdown = markdown.replace(placeholder, cbMarkdown)
  })
  
  flipCards.forEach(({ placeholder, markdown: fcMarkdown }) => {
    markdown = markdown.replace(placeholder, fcMarkdown)
  })
  
  // 清理多余空行
  markdown = markdown.replace(/\n{3,}/g, '\n\n')
  markdown = markdown.replace(/^\s+|\s+$/gm, '') // 清理行首行尾空白
  
  return markdown.trim()
}

/**
 * 主函数
 */
function main() {
  const chapterId = process.argv[2]
  
  if (!chapterId) {
    console.error('❌ 请提供章节 ID')
    console.log('使用方法: pnpm migrate-chapter-v2 <chapter-id>')
    console.log('例如: pnpm migrate-chapter-v2 2')
    process.exit(1)
  }
  
  const chapterPath = join(projectRoot, 'src', 'pages', 'chapters', `Chapter${chapterId}.tsx`)
  const outputPath = join(projectRoot, 'content', 'chapters', `chapter-${chapterId}.md`)
  
  if (!existsSync(chapterPath)) {
    console.error(`❌ 文件不存在: ${chapterPath}`)
    process.exit(1)
  }
  
  console.log(`📖 读取章节文件: Chapter${chapterId}.tsx`)
  const content = readFileSync(chapterPath, 'utf-8')
  
  const title = extractTitle(content)
  const description = extractDescription(content)
  const keywords = extractKeywords(title)
  
  // 提取内容部分
  const contentStart = content.indexOf('<div className="w-full">')
  const contentEnd = content.lastIndexOf('</div>')
  
  if (contentStart === -1 || contentEnd === -1) {
    console.error('❌ 无法找到内容部分')
    process.exit(1)
  }
  
  const jsxContent = content.substring(contentStart, contentEnd)
  let markdownContent = convertJSXToMarkdown(jsxContent)
  
  // 生成 Front Matter
  const frontMatter = `---
title: "${title}"
description: "${description}"
order: ${chapterId}
path: "/chapter/${chapterId}"
keywords:
${keywords.map(k => `  - "${k}"`).join('\n')}
---

`
  
  const fullMarkdown = frontMatter + markdownContent
  
  // 写入文件
  writeFileSync(outputPath, fullMarkdown, 'utf-8')
  
  console.log(`✅ 已生成 Markdown 文件: chapter-${chapterId}.md`)
  console.log(`\n📝 下一步：运行 pnpm convert 进行转换`)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

