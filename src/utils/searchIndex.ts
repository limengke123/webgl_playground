// 搜索索引：包含所有页面的元数据
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
    title: '首页',
    description: 'WebGL 学习教程首页，浏览所有章节',
    path: '/',
    keywords: ['首页', '主页', 'home', '教程', 'webgl'],
    type: 'home'
  },
  {
    id: 'playground',
    title: 'Playground',
    description: 'WebGL 交互式代码编辑器，在线编写和运行 WebGL 代码',
    path: '/playground',
    keywords: ['playground', '编辑器', '代码', '在线', '运行', '交互'],
    type: 'playground'
  },
  {
    id: 'chapter-0',
    title: '从零开始创建项目',
    description: '手把手教你创建 canvas 元素，获取 WebGL 上下文，搭建第一个 WebGL 项目',
    path: '/chapter/0',
    keywords: ['创建项目', 'canvas', '上下文', '初始化', '项目搭建', 'getContext', '基础', '开始', '入门', '第一个', '项目结构', 'html', 'setup', '创建', '搭建', '项目', 'canvas元素', 'webgl上下文', 'context', 'gl', '创建canvas', '获取上下文'],
    type: 'chapter'
  },
  {
    id: 'chapter-1',
    title: 'WebGL 基础',
    description: '学习 WebGL 的基本概念，绘制第一个三角形，了解着色器的工作原理',
    path: '/chapter/1',
    keywords: ['webgl基础', '三角形', '着色器', 'shader', '顶点着色器', '片段着色器', '渲染管线', '缓冲区', 'buffer', 'attribute', 'uniform', 'varying', '坐标系统', '绘制模式', 'webgl', '基础', '入门', '第一个三角形', '绘制', '顶点', '片段', 'vertex', 'fragment', 'gl_position', 'gl_fragcolor', '坐标', 'ndc', '归一化设备坐标', '绘制', 'draw', 'drawArrays', 'drawElements', '图元', 'primitive', '点', '线', '三角形', 'points', 'lines', 'triangles', '矩形', '圆形', '星形', '形状'],
    type: 'chapter'
  },
  {
    id: 'chapter-2',
    title: 'GLSL 语法基础',
    description: '掌握 GLSL 着色器语言的基础语法，数据类型、变量限定符和常用函数',
    path: '/chapter/2',
    keywords: ['glsl', '语法', '数据类型', '变量', '限定符', '函数', 'vec2', 'vec3', 'vec4', 'mat4', 'precision', '着色器语言', 'shading language', '语法基础', '数据类型', 'float', 'int', 'bool', '向量', '矩阵', 'mat2', 'mat3', 'sampler2D', 'samplerCube', '变量限定符', 'attribute', 'uniform', 'varying', 'const', '精度', 'highp', 'mediump', 'lowp', '函数', '内置函数', '数学函数', '向量函数', '矩阵函数', '纹理函数'],
    type: 'chapter'
  },
  {
    id: 'chapter-3',
    title: '3D 数学基础',
    description: '掌握向量、矩阵变换（平移、旋转、缩放）和 MVP 矩阵的完整流程',
    path: '/chapter/3',
    keywords: ['3d数学', '向量', '矩阵', '变换', '平移', '旋转', '缩放', 'mvp', 'model', 'view', 'projection', '矩阵乘法', '数学基础', '向量', 'vector', '点积', 'dot product', '叉积', 'cross product', '向量长度', '归一化', 'normalize', '矩阵', 'matrix', '矩阵乘法', '矩阵转置', '矩阵逆', '变换', 'transformation', '平移', 'translation', '旋转', 'rotation', '缩放', 'scale', '组合变换', 'mvp', 'model matrix', 'view matrix', 'projection matrix', '模型矩阵', '视图矩阵', '投影矩阵', '齐次坐标', 'homogeneous coordinates'],
    type: 'chapter'
  },
  {
    id: 'chapter-4',
    title: '渲染管线',
    description: '深入理解 WebGL 渲染管线，顶点处理、图元装配、光栅化等',
    path: '/chapter/4',
    keywords: ['渲染管线', 'pipeline', '顶点处理', '图元装配', '光栅化', 'rasterization', '裁剪', 'clipping', '渲染', 'rendering', '管线', 'pipeline', '顶点着色器', 'vertex shader', '片段着色器', 'fragment shader', '图元装配', 'primitive assembly', '光栅化', 'rasterization', '片段', 'fragment', '插值', 'interpolation', '裁剪', 'clipping', '视锥体', 'frustum', '深度测试', 'depth test', '模板测试', 'stencil test', '混合', 'blending', '帧缓冲区', 'framebuffer'],
    type: 'chapter'
  },
  {
    id: 'chapter-5',
    title: '相机与投影',
    description: '学习视图矩阵、投影矩阵（透视和正交），理解完整的 MVP 变换',
    path: '/chapter/5',
    keywords: ['相机', '投影', '视图矩阵', '投影矩阵', '透视投影', '正交投影', 'camera', 'perspective', 'orthographic', '相机', 'camera', '视图', 'view', '投影', 'projection', '透视投影', 'perspective projection', '正交投影', 'orthographic projection', '视野', 'fov', 'field of view', '近平面', 'near plane', '远平面', 'far plane', '宽高比', 'aspect ratio', 'lookAt', '视图矩阵', 'view matrix', '投影矩阵', 'projection matrix', 'mvp变换', 'mvp transformation'],
    type: 'chapter'
  },
  {
    id: 'chapter-6',
    title: '光照',
    description: '掌握环境光、漫反射光和镜面反射光，实现 Phong 光照模型',
    path: '/chapter/6',
    keywords: ['光照', 'lighting', '环境光', '漫反射', '镜面反射', 'phong', '法向量', 'normal', '光照模型', '光照', 'lighting', '光源', 'light source', '环境光', 'ambient light', '漫反射', 'diffuse reflection', '镜面反射', 'specular reflection', 'phong', 'phong模型', 'phong lighting', '法向量', 'normal', 'normal vector', '法线', '光照计算', 'light calculation', '材质', 'material', '环境光系数', '漫反射系数', '镜面反射系数', '高光', 'specular highlight', '光照强度', 'light intensity'],
    type: 'chapter'
  },
  {
    id: 'chapter-7',
    title: '材质与纹理',
    description: '学习如何创建和使用材质，加载和应用纹理贴图',
    path: '/chapter/7',
    keywords: ['材质', '纹理', 'texture', '贴图', '材质属性', '纹理坐标', 'uv', 'sampler2D', '材质', 'material', '纹理', 'texture', '贴图', 'mapping', '纹理坐标', 'texture coordinates', 'uv坐标', 'uv coordinates', '纹理采样', 'texture sampling', 'sampler2D', '纹理单元', 'texture unit', '纹理绑定', 'texture binding', '纹理过滤', 'texture filtering', 'minification', 'magnification', '纹理包装', 'texture wrapping', 'repeat', 'clamp', 'mirror', '多纹理', 'multiple textures', '纹理数组', 'texture array'],
    type: 'chapter'
  },
  {
    id: 'chapter-8',
    title: '交互与动画',
    description: '实现鼠标、键盘交互控制，创建流畅的动画效果',
    path: '/chapter/8',
    keywords: ['交互', '动画', 'interaction', 'animation', '鼠标', '键盘', '事件', 'requestAnimationFrame', '交互', 'interaction', '动画', 'animation', '鼠标', 'mouse', '键盘', 'keyboard', '事件', 'event', '事件监听', 'event listener', '鼠标点击', 'mouse click', '鼠标移动', 'mouse move', '键盘输入', 'keyboard input', 'requestAnimationFrame', '动画循环', 'animation loop', '帧率', 'fps', '帧', 'frame', '时间', 'time', 'delta time', '平滑动画', 'smooth animation', '旋转', 'rotation', '平移', 'translation', '缩放', 'scaling'],
    type: 'chapter'
  },
  {
    id: 'chapter-9',
    title: '性能优化',
    description: '学习 WebGL 性能优化技巧，提升渲染效率',
    path: '/chapter/9',
    keywords: ['性能优化', 'optimization', '性能', '效率', '优化技巧', '帧率', 'fps', '性能', 'performance', '优化', 'optimization', '效率', 'efficiency', '帧率', 'fps', 'frames per second', '优化技巧', 'optimization techniques', '渲染优化', 'rendering optimization', '批处理', 'batching', '实例化', 'instancing', '减少绘制调用', 'reduce draw calls', '纹理优化', 'texture optimization', '缓冲区优化', 'buffer optimization', '着色器优化', 'shader optimization'],
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

