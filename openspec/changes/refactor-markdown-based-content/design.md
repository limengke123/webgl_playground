# Design: Markdown 转换系统设计

## Context

当前项目使用 React + TypeScript + Vite，所有章节内容直接写在 React 组件中。需要重构为基于 Markdown 的内容管理系统，同时保持现有的交互式组件功能（CodeBlock、FlipCard、WebGLCanvas 等）。

## Goals / Non-Goals

### Goals
- 实现轻量化的 Markdown 转换工具，类似 Hexo 但更简单
- 支持 Markdown 中的自定义组件（CodeBlock、FlipCard、WebGLCanvas）
- 保持现有功能和用户体验不变
- 内容与代码完全分离，便于维护

### Non-Goals
- 不需要完整的静态站点生成器功能（如 Hexo、Jekyll）
- 不需要复杂的主题系统
- 不需要多语言支持
- 不需要复杂的插件系统

## Decisions

### Decision 1: Markdown 转换方案
**选择**：使用 Node.js 脚本 + Markdown 解析库（如 `marked` 或 `remark`），在构建时转换为 React 组件

**理由**：
- 轻量化，不需要引入复杂的静态站点生成器
- 与现有 Vite 构建流程集成简单
- 可以自定义扩展语法，支持 React 组件

**替代方案**：
- 使用 Vite 插件在运行时转换：会增加运行时开销，不推荐
- 使用完整的静态站点生成器（如 Hexo）：过于复杂，不符合轻量化要求

### Decision 2: Markdown 扩展语法
**选择**：使用类似 JSX 的语法来嵌入 React 组件，支持嵌套和复杂属性

**基础组件语法**：
```markdown
<CodeBlock title="index.html" language="html">
<html>...</html>
</CodeBlock>
```

**FlipCard 组件语法（支持 WebGL 代码）**：
由于 FlipCard 需要 `onInit` 函数和 `codeBlocks` 数组，使用嵌套语法：

```markdown
<FlipCard width={400} height={300}>
  <onInit>
    {(gl, canvas) => {
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.clearColor(0.1, 0.2, 0.3, 1.0)
      gl.clear(gl.COLOR_BUFFER_BIT)
    }}
  </onInit>
  <codeBlock title="JavaScript 代码" language="javascript">
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clearColor(0.1, 0.2, 0.3, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)
  </codeBlock>
</FlipCard>
```

**理由**：
- 语法清晰，易于理解
- 与 React 组件使用方式一致
- 可以支持嵌套和复杂属性
- 函数代码可以直接写在 `<onInit>` 标签内，转换脚本会将其转换为实际的函数

### Decision 3: 目录结构
**选择**：
```
content/
  config.yaml              # 网站配置（标题、描述等）
  home.md                  # 首页内容
  chapters/
    chapter-0.md
    chapter-1.md
    ...
src/
  pages/
    Home.tsx               # 修改为动态导入章节列表
    chapters/
      Chapter0.tsx         # 自动生成
      Chapter1.tsx         # 自动生成
      ...
  utils/
    searchIndex.ts         # 自动生成
    chaptersMetadata.ts     # 自动生成（章节元数据）
scripts/
  convert-markdown.js      # 转换脚本
  generate-index.js        # 生成索引脚本
```

**理由**：
- 内容与代码分离清晰
- 保持现有的路由结构不变
- 生成的文件可以放在 `.gitignore` 中，只保留 Markdown 源文件
- 网站配置集中管理
- 章节列表和搜索索引自动生成，无需手动维护

### Decision 4: 转换时机
**选择**：在构建时转换（`pnpm build` 前），同时支持开发时的 watch 模式

**理由**：
- 构建产物不包含 Markdown 文件，减少打包体积
- 开发时可以实时预览，体验更好
- 与 Vite 的构建流程兼容

**实现方式**：
- 添加 `pnpm dev:convert` 命令，watch 模式转换
- 在 `pnpm build` 前自动运行转换脚本
- 或者使用 Vite 插件在构建时自动转换

### Decision 5: Markdown 解析库选择
**选择**：使用 `remark` + `remark-react` 或 `marked` + `DOMPurify` + 自定义渲染器

**推荐 `remark`**：
- 基于 AST，更灵活
- 插件生态丰富
- 可以自定义组件渲染

**备选 `marked`**：
- 更简单直接
- 性能更好
- 但扩展性稍差

## Risks / Trade-offs

### Risk 1: 自定义语法解析复杂度
**风险**：解析自定义组件语法可能复杂，需要处理嵌套、转义等情况

**缓解**：
- 使用成熟的 Markdown 解析库作为基础
- 分阶段实现，先支持简单场景
- 提供清晰的文档和示例

### Risk 2: 构建时间增加
**风险**：Markdown 转换会增加构建时间

**缓解**：
- 转换脚本应该足够快（< 1秒）
- 使用缓存机制，只转换变更的文件
- 开发时使用 watch 模式，增量转换

### Risk 3: 类型安全
**风险**：生成的 React 组件可能缺少类型检查

**缓解**：
- 生成的组件使用标准的 React 类型
- 在转换脚本中验证 Markdown 结构
- 提供 TypeScript 类型定义

## Migration Plan

### Phase 1: 创建转换工具
1. 安装依赖（`remark`、`remark-react` 等）
2. 创建转换脚本框架
3. 实现基本的 Markdown → React 组件转换
4. 支持自定义组件语法

### Phase 2: 迁移现有内容
1. 手动将 `Chapter0.tsx` 的内容提取为 `chapter-0.md`
2. 测试转换脚本是否正确生成组件
3. 逐个迁移其他章节
4. 验证所有功能正常

### Phase 3: 更新构建流程
1. 集成转换脚本到构建流程
2. 更新开发脚本，支持 watch 模式
3. 更新文档和 README

### Phase 4: 清理
1. 删除旧的章节组件文件（或移动到备份目录）
2. 更新路由配置（如果需要）
3. 验证部署流程

### Rollback Plan
- 保留旧的章节组件文件作为备份
- 可以通过切换路由配置快速回滚
- Git 历史记录可以恢复

## WebGL 代码渲染方案

### FlipCard 组件的特殊处理

FlipCard 组件需要两个特殊属性：
1. **onInit 函数**：WebGL 初始化代码，接收 `(gl, canvas) => void`
2. **codeBlocks 数组**：代码块数组，用于显示代码

**Markdown 语法设计**：
```markdown
<FlipCard width={400} height={300}>
  <onInit>
    {(gl, canvas) => {
      // WebGL 初始化代码
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.clearColor(0.1, 0.2, 0.3, 1.0)
      gl.clear(gl.COLOR_BUFFER_BIT)
    }}
  </onInit>
  <codeBlock title="JavaScript 代码" language="javascript">
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clearColor(0.1, 0.2, 0.3, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)
  </codeBlock>
</FlipCard>
```

**转换处理**：
1. 解析 `<onInit>` 标签内的代码，提取函数体
2. 将函数体包装为箭头函数：`(gl, canvas) => { ... }`
3. 解析 `<codeBlock>` 标签，转换为 `codeBlocks` 数组项
4. 生成 React 组件代码：
   ```tsx
   <FlipCard 
     width={400} 
     height={300}
     onInit={(gl, canvas) => {
       gl.viewport(0, 0, canvas.width, canvas.height)
       gl.clearColor(0.1, 0.2, 0.3, 1.0)
       gl.clear(gl.COLOR_BUFFER_BIT)
     }}
     codeBlocks={[
       { 
         title: "JavaScript 代码", 
         code: "gl.viewport(0, 0, canvas.width, canvas.height)\n...",
         language: "javascript"
       }
     ]}
   />
   ```

**注意事项**：
- `<onInit>` 内的代码必须是有效的 JavaScript/TypeScript 代码
- 函数参数 `gl` 和 `canvas` 的类型会在转换时自动添加类型注解
- 支持多个 `<codeBlock>` 标签，会转换为数组
- 转换脚本需要验证函数语法的正确性

## 文件元数据处理方案

### 元数据来源

1. **文件系统元数据**（自动获取）：
   - 创建时间：`fs.statSync().birthtime`
   - 修改时间：`fs.statSync().mtime`
   - 文件大小：`fs.statSync().size`

2. **Front Matter**（手动定义，优先级更高）：
   ```yaml
   ---
   title: "章节标题"
   description: "章节描述"
   created: "2024-01-15"
   modified: "2024-01-20"
   order: 0
   ---
   ```

### 元数据在页面中的使用

1. **章节页面**：
   - 在页面顶部或底部显示"最后更新：2024-01-20"
   - 显示创建日期（可选）

2. **章节列表**（首页）：
   - 显示每个章节的最后更新日期
   - 可以按更新时间排序

3. **生成的组件代码**：
   ```tsx
   // 自动生成的元数据常量
   const chapterMetadata = {
     created: new Date('2024-01-15'),
     modified: new Date('2024-01-20'),
     size: 12345, // bytes
   }
   
   export default function Chapter0() {
     return (
       <div className="w-full">
         {/* 页面内容 */}
         <footer className="mt-12 text-sm text-gray-500">
           最后更新：{chapterMetadata.modified.toLocaleDateString('zh-CN')}
         </footer>
       </div>
     )
   }
   ```

### 元数据传递方式

**方案 A**：作为常量导出，组件内部使用
```tsx
export const metadata = {
  created: new Date('2024-01-15'),
  modified: new Date('2024-01-20'),
}

export default function Chapter0() {
  return <div>...</div>
}
```

**方案 B**：作为组件 props 传入（如果使用统一的布局组件）
```tsx
export default function Chapter0() {
  return <ChapterLayout metadata={metadata}>...</ChapterLayout>
}
```

**选择方案 A**：更灵活，组件可以直接访问元数据

### Decision 7: 网站配置和首页内容管理
**选择**：使用配置文件和 Markdown 文件管理网站内容

**网站配置** (`content/config.yaml`):
```yaml
site:
  title: "WebGL 学习教程"
  description: "从零开始学习 WebGL，通过交互式示例深入理解图形学基础"
  subtitle: "从零开始学习 WebGL，通过交互式示例深入理解图形学基础"
  
home:
  heroTitle: "WebGL 学习教程"
  heroDescription: "从零开始学习 WebGL，通过交互式示例深入理解图形学基础"
  aboutTitle: "关于本教程"
  aboutDescription: "这是一个交互式的 WebGL 学习平台..."
  learningPoints:
    - "WebGL 基础概念和 API"
    - "GLSL 着色器语言语法"
    - ...
```

**首页内容** (`content/home.md`):
```markdown
---
type: home
---

# WebGL 学习教程

从零开始学习 WebGL，通过交互式示例深入理解图形学基础

## 关于本教程

这是一个交互式的 WebGL 学习平台...
```

**章节列表生成**：
- 转换脚本扫描 `content/chapters/` 目录
- 读取每个 Markdown 文件的 Front Matter
- 按 `order` 字段排序
- 生成 `src/utils/chaptersMetadata.ts` 文件
- Home.tsx 导入并使用这个文件

**搜索索引生成**：
- 转换脚本读取所有章节的 Front Matter
- 读取网站配置
- 生成 `src/utils/searchIndex.ts` 文件
- 包含所有页面的元数据和关键词

### Decision 8: 章节列表动态生成
**选择**：从 Markdown Front Matter 自动生成章节列表

**流程**：
1. 转换脚本扫描 `content/chapters/*.md`
2. 提取每个文件的 Front Matter（title, description, order, path）
3. 按 `order` 排序
4. 生成 TypeScript 文件：
   ```ts
   // src/utils/chaptersMetadata.ts (自动生成)
   export const chaptersMetadata = [
     {
       id: 0,
       title: "从零开始创建项目",
       description: "手把手教你创建 canvas 元素...",
       path: "/chapter/0",
       order: 0,
       // ... 其他元数据
     },
     // ...
   ]
   ```
5. Home.tsx 导入并使用：
   ```tsx
   import { chaptersMetadata } from '../utils/chaptersMetadata'
   ```

**优势**：
- 添加新章节只需创建新的 Markdown 文件
- 修改章节信息只需编辑 Front Matter
- 无需手动维护章节列表

## 内容一致性保证

### 验证策略

为确保生成的页面与原始页面完全一致，需要实施以下验证措施：

1. **结构对比**：
   - 对比生成的 JSX 结构与原始组件的 JSX 结构
   - 确保所有元素、属性、类名完全一致

2. **内容对比**：
   - 逐字符对比文本内容
   - 确保代码块内容完全一致（包括空白字符）
   - 确保所有 Markdown 内容正确转换为 JSX

3. **功能测试**：
   - 测试所有交互式组件（CodeBlock、FlipCard、WebGLCanvas）
   - 验证 WebGL 代码能够正确渲染和执行
   - 验证所有事件处理器正常工作

4. **视觉对比**：
   - 使用截图对比工具验证视觉效果
   - 或使用 DOM 结构对比验证布局

### 转换规则严格性

转换脚本必须遵循以下严格规则：

1. **保留所有空白字符**（在代码块中）
2. **保留所有 CSS 类名**（完全一致）
3. **保留所有组件属性**（包括默认值）
4. **保留所有嵌套结构**（完全一致）
5. **保留所有文本格式**（包括换行、缩进等）

### 迁移验证流程

1. **阶段 1：单个章节验证**
   - 转换一个章节（如 Chapter0）
   - 对比原始组件和生成组件
   - 修复所有不一致之处
   - 确认完全一致后再继续

2. **阶段 2：批量验证**
   - 转换所有章节
   - 逐个对比验证
   - 记录所有差异
   - 修复所有问题

3. **阶段 3：功能验证**
   - 测试所有交互功能
   - 测试 WebGL 渲染
   - 测试导航功能

4. **阶段 4：最终确认**
   - 视觉对比（截图）
   - 性能测试
   - 用户验收测试

## Open Questions

1. **开发时的热更新**？
   - 如何确保修改 Markdown 后，页面能够热更新
   - 方案：使用 watch 模式 + Vite HMR，转换脚本检测到变化后重新生成组件和索引
   - 注意：文件修改时间会在文件保存时自动更新
   - 注意：修改章节 Front Matter 后需要重新生成索引

2. **内容一致性验证工具**？
   - 是否需要自动化工具来对比原始组件和生成组件
   - 方案：创建对比脚本，在转换后自动运行验证
   - 可以集成到构建流程中，确保每次转换都通过验证

