# 内容一致性验证指南

本文档说明如何确保通过脚本生成的页面内容与原始 React 组件完全一致。

## 验证目标

确保生成的页面在以下方面与原始页面完全一致：

1. **视觉外观**：布局、样式、视觉效果完全相同
2. **内容结构**：HTML 结构、元素层次完全相同
3. **文本内容**：所有文本内容逐字符一致
4. **功能行为**：所有交互功能工作方式完全相同
5. **组件属性**：所有组件属性、类名、样式完全一致

## 验证方法

### 1. 结构对比

对比生成的 JSX 结构与原始组件的 JSX 结构：

```typescript
// scripts/validate-consistency.ts
import { readFileSync } from 'fs'
import { parse } from '@babel/parser'
import { compareAST } from './ast-comparer'

function validateStructure(originalPath: string, generatedPath: string) {
  const original = readFileSync(originalPath, 'utf-8')
  const generated = readFileSync(generatedPath, 'utf-8')
  
  const originalAST = parse(original, { plugins: ['jsx', 'typescript'] })
  const generatedAST = parse(generated, { plugins: ['jsx', 'typescript'] })
  
  const differences = compareAST(originalAST, generatedAST)
  
  if (differences.length > 0) {
    console.error('结构不一致:', differences)
    return false
  }
  
  return true
}
```

### 2. 内容对比

逐字符对比文本内容：

```typescript
function validateContent(originalPath: string, generatedPath: string) {
  const original = readFileSync(originalPath, 'utf-8')
  const generated = readFileSync(generatedPath, 'utf-8')
  
  // 提取文本内容（去除 JSX 语法，只保留文本）
  const originalText = extractTextContent(original)
  const generatedText = extractTextContent(generated)
  
  if (originalText !== generatedText) {
    console.error('文本内容不一致')
    console.error('差异:', findDifferences(originalText, generatedText))
    return false
  }
  
  return true
}
```

### 3. 组件属性对比

对比所有组件的属性：

```typescript
function validateComponentProps(originalPath: string, generatedPath: string) {
  const originalComponents = extractComponents(originalPath)
  const generatedComponents = extractComponents(generatedPath)
  
  for (const [name, originalProps] of Object.entries(originalComponents)) {
    const generatedProps = generatedComponents[name]
    
    if (!generatedProps) {
      console.error(`组件 ${name} 在生成文件中不存在`)
      return false
    }
    
    if (!deepEqual(originalProps, generatedProps)) {
      console.error(`组件 ${name} 属性不一致`)
      console.error('原始:', originalProps)
      console.error('生成:', generatedProps)
      return false
    }
  }
  
  return true
}
```

### 4. 渲染结果对比

使用 React 测试工具对比渲染结果：

```typescript
import { render } from '@testing-library/react'
import { screen } from '@testing-library/react'

function validateRendering(OriginalComponent: any, GeneratedComponent: any) {
  const { container: originalContainer } = render(<OriginalComponent />)
  const { container: generatedContainer } = render(<GeneratedComponent />)
  
  // 对比 DOM 结构
  const originalHTML = originalContainer.innerHTML
  const generatedHTML = generatedContainer.innerHTML
  
  if (originalHTML !== generatedHTML) {
    console.error('渲染结果不一致')
    return false
  }
  
  return true
}
```

### 5. 功能测试

测试所有交互功能：

```typescript
import { fireEvent } from '@testing-library/react'

function validateFunctionality(GeneratedComponent: any) {
  const { container } = render(<GeneratedComponent />)
  
  // 测试 CodeBlock 复制功能
  const copyButtons = container.querySelectorAll('[aria-label="复制代码"]')
  copyButtons.forEach(button => {
    fireEvent.click(button)
    // 验证剪贴板内容
  })
  
  // 测试 FlipCard 翻转功能
  const flipButtons = container.querySelectorAll('[aria-label="查看代码"]')
  flipButtons.forEach(button => {
    fireEvent.click(button)
    // 验证翻转效果
  })
  
  // 测试 WebGL 渲染
  const canvases = container.querySelectorAll('canvas')
  canvases.forEach(canvas => {
    // 验证 WebGL 上下文创建
    const gl = canvas.getContext('webgl2')
    expect(gl).not.toBeNull()
  })
  
  return true
}
```

## 验证流程

### 阶段 1：单个章节验证

1. 选择一个章节（如 Chapter0）
2. 手动提取内容到 Markdown
3. 运行转换脚本生成组件
4. 运行验证工具对比原始组件和生成组件
5. 修复所有不一致之处
6. 重复直到完全一致

### 阶段 2：批量验证

1. 转换所有章节
2. 运行批量验证脚本
3. 生成差异报告
4. 逐个修复问题
5. 重新验证直到全部通过

### 阶段 3：功能验证

1. 启动开发服务器
2. 手动测试所有页面
3. 测试所有交互功能
4. 测试 WebGL 渲染
5. 记录所有问题并修复

### 阶段 4：视觉验证

1. 使用截图工具对比原始页面和生成页面
2. 对比不同屏幕尺寸下的布局
3. 对比不同主题下的显示效果
4. 确保视觉效果完全一致

## 验证检查清单

### 内容检查
- [ ] 所有文本内容完全一致（逐字符）
- [ ] 所有代码块内容完全一致（包括空白字符）
- [ ] 所有标题层级正确
- [ ] 所有列表格式正确
- [ ] 所有链接路径正确

### 结构检查
- [ ] HTML 结构完全一致
- [ ] 所有元素嵌套关系正确
- [ ] 所有 CSS 类名完全一致
- [ ] 所有组件属性完全一致
- [ ] 所有事件处理器正确绑定

### 功能检查
- [ ] CodeBlock 复制功能正常
- [ ] FlipCard 翻转功能正常
- [ ] WebGL 渲染正常
- [ ] ChapterNavigation 导航正常
- [ ] 主题切换功能正常
- [ ] 响应式布局正常

### 视觉检查
- [ ] 页面布局完全一致
- [ ] 所有样式效果一致
- [ ] 所有动画效果一致
- [ ] 所有交互反馈一致

## 自动化验证脚本

创建 `scripts/validate-consistency.ts`：

```typescript
#!/usr/bin/env ts-node

import { validateStructure } from './validators/structure'
import { validateContent } from './validators/content'
import { validateComponentProps } from './validators/components'
import { validateRendering } from './validators/rendering'

const chapters = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

async function validateAll() {
  let allPassed = true
  
  for (const chapterId of chapters) {
    console.log(`验证 Chapter${chapterId}...`)
    
    const originalPath = `src/pages/chapters/Chapter${chapterId}.tsx`
    const generatedPath = `src/pages/chapters/Chapter${chapterId}.tsx` // 临时生成路径
    
    const structureOk = validateStructure(originalPath, generatedPath)
    const contentOk = validateContent(originalPath, generatedPath)
    const propsOk = validateComponentProps(originalPath, generatedPath)
    
    if (!structureOk || !contentOk || !propsOk) {
      console.error(`Chapter${chapterId} 验证失败`)
      allPassed = false
    } else {
      console.log(`Chapter${chapterId} 验证通过`)
    }
  }
  
  if (allPassed) {
    console.log('所有章节验证通过！')
    process.exit(0)
  } else {
    console.error('部分章节验证失败，请检查差异')
    process.exit(1)
  }
}

validateAll()
```

## 集成到构建流程

在 `package.json` 中添加验证脚本：

```json
{
  "scripts": {
    "validate": "ts-node scripts/validate-consistency.ts",
    "convert:validate": "pnpm convert && pnpm validate",
    "build:validate": "pnpm convert:validate && pnpm build"
  }
}
```

## 注意事项

1. **空白字符**：代码块中的空白字符必须完全保留
2. **转义字符**：所有转义字符必须正确处理
3. **特殊字符**：HTML 实体、Unicode 字符等必须正确处理
4. **组件顺序**：组件在页面中的顺序必须一致
5. **默认值**：组件默认属性值必须正确处理

## 问题排查

如果发现不一致：

1. **检查 Markdown 源文件**：确保内容提取正确
2. **检查转换脚本**：确保转换逻辑正确
3. **检查组件生成**：确保生成的 JSX 结构正确
4. **检查属性处理**：确保所有属性都正确转换
5. **检查文本处理**：确保文本内容没有丢失或改变

