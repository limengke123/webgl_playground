// 自动生成，请勿手动编辑
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
    title: "首页",
    description: "WebGL 学习教程首页，浏览所有章节",
    path: '/',
    keywords: ["首页","主页","home","教程","webgl","学习","图形学"],
    type: 'home'
  },
  {
    id: 'playground',
    title: "Playground",
    description: "WebGL 交互式代码编辑器，在线编写和运行 WebGL 代码",
    path: '/playground',
    keywords: ["playground","编辑器","代码","在线","运行","交互","实验","测试"],
    type: 'playground'
  },
  {
    id: 'chapter-0',
    title: "第零章：从零开始创建 WebGL 项目",
    description: "手把手教你创建 canvas 元素，获取 WebGL 上下文，搭建第一个 WebGL 项目",
    path: "/chapter/0",
    keywords: ["创建项目","canvas","上下文","初始化"],
    type: 'chapter'
  },
  {
    id: 'chapter-1',
    title: "第一章：WebGL 基础",
    description: "学习 WebGL 的基本概念，绘制第一个三角形，了解着色器的工作原理",
    path: "/chapter/1",
    keywords: ["webgl基础","三角形","着色器","shader","顶点着色器","片段着色器","渲染管线","缓冲区","buffer","attribute","uniform","varying","坐标系统","绘制模式"],
    type: 'chapter'
  }
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
  const parts = trimmed.split(/\s+/)
  
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
