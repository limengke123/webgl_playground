/**
 * 自定义组件语法解析器
 * 
 * 处理 Markdown 中的自定义组件语法：
 * - <CodeBlock title="..." language="...">code</CodeBlock>
 * - <FlipCard width={400}><onInit>...</onInit><codeBlock>...</codeBlock></FlipCard>
 * - <WebGLCanvas>...</WebGLCanvas>
 */

interface CodeBlockMatch {
  fullMatch: string
  title?: string
  language?: string
  code: string
}

interface CodeBlockTag {
  fullMatch: string
  title?: string
  language?: string
  code: string
}

interface FlipCardMatch {
  fullMatch: string
  width?: number
  height?: number
  onInit?: string
  codeBlocks: CodeBlockTag[]
}

/**
 * 解析属性字符串
 * 例如: title="index.html" language="html" width={400}
 */
function parseAttributes(attrString: string): Record<string, string | number> {
  const attrs: Record<string, string | number> = {}
  
  // 匹配 key="value" 或 key={value}
  const attrRegex = /(\w+)=(?:"([^"]*)"|{([^}]*)}|(\d+))/g
  let match
  
  while ((match = attrRegex.exec(attrString)) !== null) {
    const key = match[1]
    const value = match[2] || match[3] || match[4]
    
    // 如果是数字，转换为数字类型
    if (/^\d+$/.test(value)) {
      attrs[key] = parseInt(value, 10)
    } else {
      attrs[key] = value
    }
  }
  
  return attrs
}

/**
 * 提取 CodeBlock 组件
 */
function extractCodeBlocks(content: string): { content: string, codeBlocks: CodeBlockMatch[] } {
  const codeBlocks: CodeBlockMatch[] = []
  const codeBlockRegex = /<CodeBlock\s+([^>]*)>([\s\S]*?)<\/CodeBlock>/g
  
  let match
  let lastIndex = 0
  const parts: string[] = []
  
  while ((match = codeBlockRegex.exec(content)) !== null) {
    // 添加匹配前的文本
    parts.push(content.substring(lastIndex, match.index))
    
    const attrs = parseAttributes(match[1])
    const code = match[2].trim()
    
    codeBlocks.push({
      fullMatch: match[0],
      title: attrs.title as string,
      language: (attrs.language as string) || 'text',
      code
    })
    
    // 添加占位符（使用代码块格式，确保被解析为代码块节点）
    // 使用特殊的语言标识符，然后在代码内容中放置占位符
    parts.push(`\n\`\`\`placeholder\nCODEBLOCK_PLACEHOLDER_${codeBlocks.length - 1}\n\`\`\`\n`)
    
    lastIndex = match.index + match[0].length
  }
  
  // 添加剩余文本
  parts.push(content.substring(lastIndex))
  
  return {
    content: parts.join(''),
    codeBlocks
  }
}

/**
 * 提取 FlipCard 组件
 */
function extractFlipCards(content: string): { content: string, flipCards: FlipCardMatch[] } {
  const flipCards: FlipCardMatch[] = []
  
  // 匹配 <FlipCard ...>...</FlipCard>
  const flipCardRegex = /<FlipCard\s+([^>]*)>([\s\S]*?)<\/FlipCard>/g
  
  let match
  let lastIndex = 0
  const parts: string[] = []
  
  while ((match = flipCardRegex.exec(content)) !== null) {
    // 添加匹配前的文本
    parts.push(content.substring(lastIndex, match.index))
    
    const attrs = parseAttributes(match[1])
    const innerContent = match[2]
    
    // 提取 onInit
    const onInitMatch = innerContent.match(/<onInit>([\s\S]*?)<\/onInit>/)
    const onInit = onInitMatch ? onInitMatch[1].trim() : undefined
    
    // 提取 codeBlock 标签
    const codeBlockRegex = /<codeBlock\s+([^>]*)>([\s\S]*?)<\/codeBlock>/g
    const codeBlocks: CodeBlockTag[] = []
    let codeBlockMatch
    
    while ((codeBlockMatch = codeBlockRegex.exec(innerContent)) !== null) {
      const codeBlockAttrs = parseAttributes(codeBlockMatch[1])
      codeBlocks.push({
        fullMatch: codeBlockMatch[0],
        title: codeBlockAttrs.title as string,
        language: (codeBlockAttrs.language as string) || 'text',
        code: codeBlockMatch[2].trim()
      })
    }
    
    flipCards.push({
      fullMatch: match[0],
      width: attrs.width as number,
      height: attrs.height as number,
      onInit,
      codeBlocks
    })
    
    // 添加占位符（使用代码块格式）
    parts.push(`\n\`\`\`placeholder\nFLIPCARD_PLACEHOLDER_${flipCards.length - 1}\n\`\`\`\n`)
    
    lastIndex = match.index + match[0].length
  }
  
  // 添加剩余文本
  parts.push(content.substring(lastIndex))
  
  return {
    content: parts.join(''),
    flipCards
  }
}

/**
 * 预处理 Markdown 内容，提取自定义组件
 */
export function preprocessMarkdown(content: string): {
  processedContent: string
  codeBlocks: CodeBlockMatch[]
  flipCards: FlipCardMatch[]
} {
  // 先提取 FlipCard（因为它可能包含 CodeBlock）
  const { content: afterFlipCards, flipCards } = extractFlipCards(content)
  
  // 再提取独立的 CodeBlock
  const { content: processedContent, codeBlocks } = extractCodeBlocks(afterFlipCards)
  
  return {
    processedContent,
    codeBlocks,
    flipCards
  }
}

/**
 * 将 CodeBlock 转换为 JSX
 */
export function convertCodeBlockToJSX(codeBlock: CodeBlockMatch, indent: string = ''): string {
  const title = codeBlock.title ? `title="${codeBlock.title}"` : ''
  const language = codeBlock.language || 'text'
  const code = codeBlock.code.replace(/`/g, '\\`').replace(/\${/g, '\\${')
  
  return `${indent}<CodeBlock ${title} language="${language}" code={\`${code}\`} />`
}

/**
 * 将 FlipCard 转换为 JSX
 */
export function convertFlipCardToJSX(flipCard: FlipCardMatch, indent: string = ''): string {
  const width = flipCard.width || 400
  const height = flipCard.height || 400
  
  // 转换 onInit 函数
  let onInitCode = ''
  if (flipCard.onInit) {
    // 清理和格式化 onInit 代码
    let cleanedOnInit = flipCard.onInit.trim()
    
    // 如果 onInit 内容已经是箭头函数格式 {(gl, canvas) => {...}}，提取函数体
    const arrowFunctionMatch = cleanedOnInit.match(/^\s*\{\s*\(([^)]+)\)\s*=>\s*\{([\s\S]*)\}\s*\}/)
    if (arrowFunctionMatch) {
      // 提取函数体
      const functionBody = arrowFunctionMatch[2].trim()
      cleanedOnInit = functionBody
    }
    
    // 格式化代码，保持原有缩进
    const lines = cleanedOnInit.split('\n')
    const formattedLines = lines.map((line, index) => {
      if (index === 0) return line
      // 保持原有缩进，但确保至少有一个缩进
      return line
    }).join('\n' + indent + '    ')
    
    // 直接使用模板字符串生成代码，不需要转义反引号
    // 因为我们在生成 JSX 代码字符串，反引号应该保持原样
    onInitCode = `onInit={(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement) => {\n${indent}    ${formattedLines}\n${indent}  }}`
  }
  
  // 转换 codeBlocks 数组
  const codeBlocksArray = flipCard.codeBlocks.map(cb => {
    const code = cb.code.replace(/`/g, '\\`').replace(/\${/g, '\\${')
    return `    { title: ${JSON.stringify(cb.title || '')}, code: \`${code}\`, language: ${JSON.stringify(cb.language || 'text')} }`
  }).join(',\n')
  
  const codeBlocksProp = `codeBlocks={[\n${codeBlocksArray}\n${indent}  ]}`
  
  const props = [
    `width={${width}}`,
    `height={${height}}`,
    onInitCode,
    codeBlocksProp
  ].filter(Boolean).join('\n' + indent + '  ')
  
  return `${indent}<FlipCard\n${indent}  ${props}\n${indent}/>`
}

