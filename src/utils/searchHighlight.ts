// 搜索高亮和滚动工具函数

export interface SearchMatch {
  element: HTMLElement
  text: string
  index: number
}

/**
 * 检查元素是否在代码块中（不应该高亮代码块中的内容）
 */
function isInCodeBlock(element: HTMLElement): boolean {
  let current: HTMLElement | null = element
  while (current) {
    if (
      current.tagName === 'CODE' ||
      current.tagName === 'PRE' ||
      current.classList.contains('cm-editor') ||
      current.classList.contains('cm-content') ||
      current.closest('pre') ||
      current.closest('code')
    ) {
      return true
    }
    current = current.parentElement
  }
  return false
}

/**
 * 在页面中搜索文本并返回匹配的元素
 */
export function findTextMatches(query: string): SearchMatch[] {
  if (!query.trim()) return []

  const matches: SearchMatch[] = []
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        // 跳过代码块中的文本节点
        const parent = node.parentElement
        if (parent && isInCodeBlock(parent)) {
          return NodeFilter.FILTER_REJECT
        }
        return NodeFilter.FILTER_ACCEPT
      }
    }
  )

  const lowerQuery = query.toLowerCase()
  let index = 0
  const seenElements = new Set<HTMLElement>()

  let node
  while ((node = walker.nextNode())) {
    const text = node.textContent || ''
    const lowerText = text.toLowerCase()

    if (lowerText.includes(lowerQuery)) {
      // 找到包含搜索关键词的文本节点
      const parent = node.parentElement
      if (parent && !isInCodeBlock(parent) && !seenElements.has(parent)) {
        seenElements.add(parent)
        matches.push({
          element: parent,
          text: text.trim(),
          index: index++
        })
      }
    }
  }

  return matches
}

/**
 * 高亮显示匹配的文本
 */
export function highlightMatches(query: string, matches: SearchMatch[]): () => void {
  if (!query.trim() || matches.length === 0) {
    return () => {}
  }

  const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi')

  matches.forEach(match => {
    const element = match.element
    
    // 跳过已经处理过的元素
    if (globalHighlightMap.has(element)) {
      return
    }
    
    // 保存原始HTML到全局map
    globalHighlightMap.set(element, element.innerHTML)

    // 获取元素的文本内容
    const text = element.textContent || ''
    
    // 如果文本包含搜索关键词，进行高亮
    if (text.toLowerCase().includes(query.toLowerCase())) {
      // 创建一个文档片段来安全地处理文本节点
      const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null
      )
      
      const textNodes: Text[] = []
      let textNode
      while ((textNode = walker.nextNode() as Text)) {
        textNodes.push(textNode)
      }
      
      // 从后往前处理，避免索引问题
      textNodes.reverse().forEach(textNode => {
        const nodeText = textNode.textContent || ''
        if (nodeText.toLowerCase().includes(query.toLowerCase())) {
          const parent = textNode.parentNode
          if (!parent) return
          
          // 创建高亮后的HTML
          const highlightedHTML = nodeText.replace(regex, '<mark class="search-highlight">$1</mark>')
          
          // 创建临时容器
          const tempSpan = document.createElement('span')
          tempSpan.innerHTML = highlightedHTML
          
          // 替换文本节点
          const fragment = document.createDocumentFragment()
          while (tempSpan.firstChild) {
            fragment.appendChild(tempSpan.firstChild)
          }
          parent.replaceChild(fragment, textNode)
        }
      })
    }
  })

  // 返回清理函数
  return () => {
    globalHighlightMap.forEach((html, element) => {
      // 检查元素是否还在DOM中
      if (document.body.contains(element)) {
        element.innerHTML = html
      }
    })
    globalHighlightMap.clear()
  }
}

/**
 * 滚动到第一个匹配的元素
 */
export function scrollToFirstMatch(matches: SearchMatch[], offset: number = 100): void {
  if (matches.length === 0) return

  const firstMatch = matches[0].element
  
  // 确保元素可见
  firstMatch.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'nearest'
  })

  // 添加一个短暂的闪烁效果
  firstMatch.style.transition = 'background-color 0.3s ease'
  firstMatch.style.backgroundColor = 'rgba(var(--primary-rgb, 59, 130, 246), 0.2)'
  
  setTimeout(() => {
    firstMatch.style.backgroundColor = ''
    setTimeout(() => {
      firstMatch.style.transition = ''
    }, 300)
  }, 2000)
}

// 全局存储所有高亮元素的原始HTML，用于清理
const globalHighlightMap = new Map<HTMLElement, string>()

/**
 * 清理所有高亮
 */
export function clearAllHighlights(): void {
  globalHighlightMap.forEach((html, element) => {
    // 检查元素是否还在DOM中
    if (document.body.contains(element)) {
      element.innerHTML = html
    }
  })
  globalHighlightMap.clear()
}

/**
 * 在页面中搜索并高亮显示匹配的内容
 */
export function searchAndHighlight(query: string, scrollToMatch: boolean = true): () => void {
  // 先清理之前的高亮
  clearAllHighlights()
  
  const matches = findTextMatches(query)
  
  if (matches.length === 0) {
    // 如果没有找到匹配，滚动到顶部
    if (scrollToMatch) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    return () => {}
  }

  const cleanup = highlightMatches(query, matches)

  if (scrollToMatch) {
    // 等待DOM更新后再滚动
    setTimeout(() => {
      scrollToFirstMatch(matches)
    }, 100)
  }

  return cleanup
}

