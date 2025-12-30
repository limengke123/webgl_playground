/**
 * Markdown AST 到 JSX 转换器
 * 
 * 将 remark AST 转换为 JSX 代码字符串
 */

import type { Root, Node, Heading, Paragraph, List, ListItem, Text, Strong, Code, CodeBlock, Blockquote, Link, Image } from 'mdast'
import { preprocessMarkdown, convertCodeBlockToJSX, convertFlipCardToJSX, type CodeBlockMatch, type FlipCardMatch } from './custom-components'

/**
 * 转义 JSX 中的特殊字符
 */
function escapeJSX(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * 转换文本节点
 */
function convertText(node: Text, indent: string = ''): string {
  return escapeJSX(node.value)
}

/**
 * 转换强调节点
 */
function convertStrong(node: Strong, indent: string = ''): string {
  const children = node.children.map(child => {
    if (child.type === 'text') {
      return convertText(child, indent)
    }
    return ''
  }).join('')
  
  return `<strong className="text-primary font-semibold">${children}</strong>`
}

/**
 * 转换行内代码
 */
function convertInlineCode(node: Code, indent: string = ''): string {
  return `<code className="px-1 py-0.5 bg-dark-surface dark:bg-dark-surface bg-light-surface rounded text-sm">${escapeJSX(node.value)}</code>`
}

/**
 * 转换链接
 */
function convertLink(node: Link, indent: string = ''): string {
  const children = node.children.map(child => {
    if (child.type === 'text') {
      return convertText(child, indent)
    }
    return ''
  }).join('')
  
  return `<a href="${node.url}" className="text-primary hover:underline">${children}</a>`
}

/**
 * 转换段落
 */
function convertParagraph(node: Paragraph, indent: string = ''): string {
  const children = node.children.map(child => {
    switch (child.type) {
      case 'text':
        return convertText(child, indent + '  ')
      case 'strong':
        return convertStrong(child, indent + '  ')
      case 'inlineCode':
        return convertInlineCode(child, indent + '  ')
      case 'link':
        return convertLink(child, indent + '  ')
      default:
        return ''
    }
  }).join('')
  
  return `${indent}<p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">\n${indent}  ${children}\n${indent}</p>`
}

/**
 * 转换标题
 */
function convertHeading(node: Heading, indent: string = ''): string {
  const level = node.depth
  const children = node.children.map(child => {
    if (child.type === 'text') {
      return convertText(child, indent + '  ')
    }
    return ''
  }).join('')
  
  let className = ''
  let tag = ''
  
  if (level === 1) {
    tag = 'h1'
    className = 'text-4xl mb-8 text-primary border-b-2 border-dark-border dark:border-dark-border border-light-border pb-4'
  } else if (level === 2) {
    tag = 'h2'
    className = 'text-3xl my-10 text-dark-text dark:text-dark-text text-light-text'
  } else if (level === 3) {
    tag = 'h3'
    className = 'text-2xl my-8 text-dark-text dark:text-dark-text text-light-text'
  } else if (level === 4) {
    tag = 'h4'
    className = 'text-xl my-6 text-dark-text dark:text-dark-text text-light-text'
  } else {
    tag = `h${level}`
    className = 'text-lg my-4 text-dark-text dark:text-dark-text text-light-text'
  }
  
  return `${indent}<${tag} className="${className}">${children}</${tag}>`
}

/**
 * 转换列表项
 */
function convertListItem(node: ListItem, indent: string = ''): string {
  // 列表项可能包含段落或其他内联内容
  const children = node.children.map(child => {
    if (child.type === 'paragraph') {
      // 段落内的内容（文本、强调等）
      const paraChildren = (child as Paragraph).children.map(c => {
        switch (c.type) {
          case 'text':
            return convertText(c, indent + '    ')
          case 'strong':
            return convertStrong(c, indent + '    ')
          case 'inlineCode':
            return convertInlineCode(c, indent + '    ')
          case 'link':
            return convertLink(c, indent + '    ')
          default:
            return ''
        }
      }).join('')
      
      return paraChildren
    }
    return ''
  }).join('')
  
  return `${indent}  <li className="flex items-center gap-2">\n${indent}    ${children}\n${indent}  </li>`
}

/**
 * 转换列表
 */
function convertList(node: List, indent: string = ''): string {
  const children = node.children.map(child => {
    if (child.type === 'listItem') {
      return convertListItem(child, indent)
    }
    return ''
  }).join('\n')
  
  const className = node.ordered 
    ? 'text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5 list-decimal'
    : 'text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5'
  
  return `${indent}<${node.ordered ? 'ol' : 'ul'} className="${className}">\n${children}\n${indent}</${node.ordered ? 'ol' : 'ul'}>`
}

/**
 * 转换代码块
 * 检查是否是自定义组件的占位符
 */
function convertCodeBlock(
  node: CodeBlock, 
  indent: string = '',
  codeBlocks?: CodeBlockMatch[],
  flipCards?: FlipCardMatch[]
): string {
  const code = node.value.trim()
  const language = node.lang || ''
  
  // 检查是否是占位符代码块（语言为 placeholder）
  if (language === 'placeholder') {
    // 检查是否是 CodeBlock 占位符
    const codeBlockMatch = code.match(/^CODEBLOCK_PLACEHOLDER_(\d+)$/)
    if (codeBlockMatch && codeBlocks) {
      const index = parseInt(codeBlockMatch[1], 10)
      if (codeBlocks[index]) {
        return convertCodeBlockToJSX(codeBlocks[index], indent)
      }
    }
    
    // 检查是否是 FlipCard 占位符
    const flipCardMatch = code.match(/^FLIPCARD_PLACEHOLDER_(\d+)$/)
    if (flipCardMatch && flipCards) {
      const index = parseInt(flipCardMatch[1], 10)
      if (flipCards[index]) {
        return convertFlipCardToJSX(flipCards[index], indent)
      }
    }
  }
  
  // 标准 Markdown 代码块
  const escapedCode = code.replace(/`/g, '\\`').replace(/\${/g, '\\${')
  const finalLanguage = language && language !== 'placeholder' ? language : 'text'
  
  return `${indent}<CodeBlock language="${finalLanguage}" code={\`${escapedCode}\`} />`
}

/**
 * 转换引用块
 */
function convertBlockquote(node: Blockquote, indent: string = ''): string {
  const children = node.children.map(child => {
    if (child.type === 'paragraph') {
      return convertParagraph(child, indent + '  ')
    }
    return ''
  }).join('\n')
  
  return `${indent}<blockquote className="border-l-4 border-primary pl-4 py-2 my-4 italic">\n${children}\n${indent}</blockquote>`
}

/**
 * 转换 section（将连续的段落、列表等包裹在 section 中）
 */
function convertSection(
  nodes: Node[], 
  indent: string = '',
  codeBlocks?: CodeBlockMatch[],
  flipCards?: FlipCardMatch[]
): string {
  const children = nodes.map(node => {
    switch (node.type) {
      case 'heading':
        return convertHeading(node as Heading, indent + '  ')
      case 'paragraph':
        return convertParagraph(node as Paragraph, indent + '  ')
      case 'list':
        return convertList(node as List, indent + '  ')
      case 'code':
        return convertCodeBlock(node as CodeBlock, indent + '  ', codeBlocks, flipCards)
      case 'blockquote':
        return convertBlockquote(node as Blockquote, indent + '  ')
      default:
        return ''
    }
  }).filter(Boolean).join('\n')
  
  if (!children) return ''
  
  return `${indent}<section className="mb-12">\n${children}\n${indent}</section>`
}

/**
 * 将 Markdown AST 转换为 JSX 代码字符串
 */
export function convertASTToJSX(
  ast: Root,
  codeBlocks?: CodeBlockMatch[],
  flipCards?: FlipCardMatch[]
): string {
  const sections: Node[][] = []
  let currentSection: Node[] = []
  
  // 跳过第一个 h1 标题（因为组件中已经有了）
  const childrenToProcess = ast.children.filter((node, index) => {
    if (index === 0 && node.type === 'heading' && (node as Heading).depth === 1) {
      return false // 跳过第一个 h1
    }
    return true
  })
  
  // 将 AST 节点分组为 sections
  for (const node of childrenToProcess) {
    if (node.type === 'heading' && (node as Heading).depth === 2) {
      // 遇到二级标题，开始新的 section
      if (currentSection.length > 0) {
        sections.push(currentSection)
      }
      currentSection = [node]
    } else {
      currentSection.push(node)
    }
  }
  
  // 添加最后一个 section
  if (currentSection.length > 0) {
    sections.push(currentSection)
  }
  
  // 转换每个 section
  const jsxSections = sections.map(section => 
    convertSection(section, '', codeBlocks, flipCards)
  ).filter(Boolean)
  
  return jsxSections.join('\n\n')
}

