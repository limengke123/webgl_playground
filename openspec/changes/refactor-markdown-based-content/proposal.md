# Change: 重构为基于 Markdown 的内容管理系统

## Why

当前项目将所有章节内容直接写在 React 组件中（如 `Chapter0.tsx`, `Chapter1.tsx` 等），导致以下问题：

1. **内容与代码耦合**：文章内容与 React 组件代码混在一起，难以维护和更新
2. **编辑体验差**：需要编辑 TypeScript/JSX 文件才能修改内容，对非开发者不友好
3. **内容管理困难**：无法利用 Markdown 的生态工具（编辑器、预览、版本控制等）
4. **扩展性差**：添加新章节需要创建新的 React 组件文件，流程繁琐

通过引入轻量化的 Markdown 转换工具，可以实现：
- 内容与代码分离，只需管理 Markdown 文件
- 更好的编辑体验，支持 Markdown 编辑器
- 更灵活的内容管理，便于版本控制和协作
- 更易于扩展，添加新章节只需添加新的 Markdown 文件

## What Changes

- **新增 Markdown 转换脚本**：创建一个轻量化的构建工具，将 Markdown 文件转换为 React 组件
- **内容分离**：
  - 将所有章节内容从 React 组件中提取出来，保存为独立的 Markdown 文件
  - 将首页内容提取到 Markdown 文件
  - 将网站配置（标题、描述等）提取到配置文件
- **目录结构重组**：创建 `content/` 目录存放所有 Markdown 文章和配置，与组件代码分离
- **动态章节列表**：章节列表从 Markdown 文件的 Front Matter 自动生成，无需手动维护
- **动态搜索索引**：搜索索引从 Markdown 元数据自动生成
- **构建流程更新**：更新构建脚本，在构建时自动转换 Markdown 文件并生成索引
- **组件保留**：保留现有的 React 组件（CodeBlock、FlipCard、WebGLCanvas 等），但改为从 Markdown 渲染

**BREAKING**: 
- 章节文件结构将发生变化，现有的 `src/pages/chapters/Chapter*.tsx` 文件将被重构或替换
- `src/pages/Home.tsx` 中的硬编码章节列表将被动态生成
- `src/utils/searchIndex.ts` 将被自动生成

## Impact

- **受影响的功能**：
  - 所有章节页面（Chapter0-Chapter10）
  - 首页（Home.tsx）- 章节列表将动态生成
  - 搜索索引（searchIndex.ts）- 将自动生成
  - 网站配置（标题、描述等）
- **受影响的代码**：
  - `src/pages/chapters/*.tsx` - 需要重构
  - `src/pages/Home.tsx` - 章节列表改为动态导入
  - `src/utils/searchIndex.ts` - 改为自动生成
  - `index.html` - 标题可能改为动态
  - `src/App.tsx` - 路由可能需要调整
  - 构建流程 - 需要添加 Markdown 转换步骤
- **新增依赖**：
  - Markdown 解析库（如 `remark`、`remark-react`、`remark-frontmatter`）
  - YAML 解析库（如 `js-yaml` 或 `gray-matter`）
- **新增工具**：Markdown 转换脚本（Node.js 脚本）
- **新增功能**：
  - 文件元数据提取和显示（创建日期、修改日期等）
  - 章节列表自动生成
  - 搜索索引自动生成
  - 网站配置管理
- **质量保证**：
  - 内容一致性验证机制
  - 原始组件与生成组件的对比工具
  - 确保生成的页面与原始页面完全一致

