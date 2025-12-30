#!/usr/bin/env tsx

/**
 * 章节迁移辅助脚本
 * 
 * 功能：从现有的 React 组件文件中提取内容，转换为 Markdown 格式
 * 
 * 使用方法：
 * pnpm migrate-chapter <chapter-id>
 * 例如：pnpm migrate-chapter 2
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
  // 尝试从函数名提取
  const funcMatch = content.match(/export default function Chapter(\d+)\(\)/)
  if (funcMatch) {
    return `第${funcMatch[1]}章`
  }
  return ''
}

/**
 * 提取章节描述（从第一个段落）
 */
function extractDescription(content: string): string {
  const match = content.match(/<p[^>]*>([^<]+)<\/p>/)
  if (match) {
    return match[1].trim().substring(0, 100)
  }
  return ''
}

/**
 * 转换 JSX 为 Markdown
 */
function convertJSXToMarkdown(content: string): string {
  let markdown = content
  
  // 移除导入语句
  markdown = markdown.replace(/import[^;]+;\n/g, '')
  
  // 移除函数声明和返回
  markdown = markdown.replace(/export default function Chapter\d+\(\)\s*{\s*return\s*\(/g, '')
  markdown = markdown.replace(/^\s*\)\s*}\s*$/m, '')
  
  // 转换 h1 标题（移除，因为会在 Front Matter 中）
  markdown = markdown.replace(/<h1[^>]*>([^<]+)<\/h1>/g, '')
  
  // 转换 h2 标题
  markdown = markdown.replace(/<h2[^>]*>([^<]+)<\/h2>/g, '## $1')
  
  // 转换 h3 标题
  markdown = markdown.replace(/<h3[^>]*>([^<]+)<\/h3>/g, '### $1')
  
  // 转换 h4 标题
  markdown = markdown.replace(/<h4[^>]*>([^<]+)<\/h4>/g, '#### $1')
  
  // 转换段落
  markdown = markdown.replace(/<p[^>]*>([^<]+)<\/p>/g, '$1\n')
  
  // 转换 strong 标签
  markdown = markdown.replace(/<strong[^>]*>([^<]+)<\/strong>/g, '**$1**')
  
  // 转换 code 标签
  markdown = markdown.replace(/<code[^>]*>([^<]+)<\/code>/g, '`$1`')
  
  // 转换列表项
  markdown = markdown.replace(/<li[^>]*>([^<]+)<\/li>/g, '- $1')
  
  // 转换 CodeBlock 组件
  markdown = markdown.replace(
    /<CodeBlock\s+title="([^"]+)"\s+code=\{`([^`]+)`\s*\}\s*\/>/gs,
    '<CodeBlock title="$1" language="glsl">\n$2\n</CodeBlock>'
  )
  
  // 转换 FlipCard 组件
  // 匹配 <FlipCard ...>...</FlipCard>，提取属性、onInit 和 codeBlocks
  markdown = markdown.replace(
    /<FlipCard\s+([^>]*)>([\s\S]*?)<\/FlipCard>/g,
    (match, attrs, innerContent) => {
      // 提取 width 和 height
      const widthMatch = attrs.match(/width=\{(\d+)\}/)
      const heightMatch = attrs.match(/height=\{(\d+)\}/)
      const width = widthMatch ? widthMatch[1] : '400'
      const height = heightMatch ? heightMatch[1] : '400'
      
      // 提取 onInit 函数体
      const onInitMatch = innerContent.match(/onInit=\{\([^)]+\)\s*=>\s*\{([\s\S]*?)\}\s*\}/)
      let onInitCode = ''
      if (onInitMatch) {
        onInitCode = onInitMatch[1].trim()
      }
      
      // 提取 codeBlocks 数组
      const codeBlocksMatch = innerContent.match(/codeBlocks=\{\[([\s\S]*?)\]\}/)
      const codeBlocks: string[] = []
      if (codeBlocksMatch) {
        // 简单提取 codeBlocks 内容（需要手动完善）
        const codeBlocksContent = codeBlocksMatch[1]
        // 匹配每个 codeBlock 对象
        const codeBlockRegex = /\{\s*title:\s*['"]([^'"]+)['"],\s*code:\s*`([^`]+)`/g
        let cbMatch
        while ((cbMatch = codeBlockRegex.exec(codeBlocksContent)) !== null) {
          codeBlocks.push(`  <codeBlock title="${cbMatch[1]}" language="glsl">\n${cbMatch[2]}\n  </codeBlock>`)
        }
      }
      
      // 构建 Markdown 格式的 FlipCard
      let flipCardMarkdown = `<FlipCard width={${width}} height={${height}}>\n`
      if (onInitCode) {
        flipCardMarkdown += `  <onInit>\n    {(gl, canvas) => {\n${onInitCode.split('\n').map(line => '      ' + line).join('\n')}\n    }}\n  </onInit>\n`
      }
      if (codeBlocks.length > 0) {
        flipCardMarkdown += codeBlocks.join('\n') + '\n'
      }
      flipCardMarkdown += '</FlipCard>'
      
      return flipCardMarkdown
    }
  )
  
  // 移除 section 标签
  markdown = markdown.replace(/<section[^>]*>/g, '')
  markdown = markdown.replace(/<\/section>/g, '')
  
  // 移除 div 标签
  markdown = markdown.replace(/<div[^>]*>/g, '')
  markdown = markdown.replace(/<\/div>/g, '')
  
  // 移除 className 等属性
  markdown = markdown.replace(/\s+className="[^"]*"/g, '')
  
  // 清理多余空行
  markdown = markdown.replace(/\n{3,}/g, '\n\n')
  
  return markdown.trim()
}

/**
 * 主函数
 */
function main() {
  const chapterId = process.argv[2]
  
  if (!chapterId) {
    console.error('❌ 请提供章节 ID')
    console.log('使用方法: pnpm migrate-chapter <chapter-id>')
    console.log('例如: pnpm migrate-chapter 2')
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
  
  // 提取内容部分（移除导入和函数声明）
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
  - "glsl"
  - "语法"
  - "着色器"
---

`
  
  const fullMarkdown = frontMatter + markdownContent
  
  // 写入文件
  writeFileSync(outputPath, fullMarkdown, 'utf-8')
  
  console.log(`✅ 已生成 Markdown 文件: chapter-${chapterId}.md`)
  console.log(`\n⚠️  注意：`)
  console.log(`   1. FlipCard 组件需要手动转换`)
  console.log(`   2. 请检查并完善 Front Matter 中的 keywords`)
  console.log(`   3. 请验证转换后的内容是否正确`)
  console.log(`\n📝 下一步：运行 pnpm convert 进行转换`)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

