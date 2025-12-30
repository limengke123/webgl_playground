# Markdown 转换系统文档

本文档介绍如何使用 Markdown 转换系统来管理网站内容。

## 概述

本项目使用基于 Markdown 的内容管理系统，所有章节内容都存储在 Markdown 文件中，通过构建脚本自动转换为 React 组件。

## 目录结构

```
content/
  ├── chapters/          # 章节 Markdown 文件
  │   ├── chapter-0.md
  │   ├── chapter-1.md
  │   └── ...
  ├── config.yaml        # 网站配置文件
  └── home.md            # 首页内容（可选）

src/
  ├── pages/
  │   └── chapters/      # 自动生成的章节组件
  │       ├── Chapter0.tsx
  │       ├── Chapter1.tsx
  │       └── ...
  └── utils/
      ├── chaptersMetadata.ts  # 自动生成的章节元数据
      ├── searchIndex.ts       # 自动生成的搜索索引
      └── siteConfig.ts        # 自动生成的网站配置
```

## 使用指南

### 创建新章节

1. 在 `content/chapters/` 目录下创建新的 Markdown 文件，命名为 `chapter-{id}.md`（例如 `chapter-2.md`）

2. 在文件开头添加 Front Matter（YAML 格式）：

```yaml
---
title: "章节标题"
description: "章节描述"
order: 2
path: "/chapter/2"
keywords:
  - "关键词1"
  - "关键词2"
---
```

3. 编写 Markdown 内容，支持以下自定义组件：

#### CodeBlock 组件

```markdown
<CodeBlock title="文件名" language="javascript">
// 代码内容
const x = 1;
</CodeBlock>
```

#### FlipCard 组件

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

4. 运行转换脚本：

```bash
pnpm convert
```

### 编辑现有章节

1. 直接编辑 `content/chapters/chapter-{id}.md` 文件
2. 运行 `pnpm convert` 重新生成组件
3. 或在开发模式下使用 `pnpm dev:convert` 自动监听文件变化

### 配置网站

编辑 `content/config.yaml` 文件来配置网站信息和首页内容。

## 构建流程

### 开发模式

```bash
# 启动开发服务器
pnpm dev

# 在另一个终端启动 Markdown 监听（可选）
pnpm dev:convert
```

### 生产构建

```bash
# 构建会自动运行转换脚本
pnpm build
```

构建流程：
1. `prebuild` 钩子自动运行 `pnpm convert`
2. 转换所有 Markdown 文件为 React 组件
3. 生成章节元数据和搜索索引
4. 运行 Vite 构建

## 脚本说明

- `pnpm convert`: 转换所有 Markdown 文件并生成索引
- `pnpm generate-index`: 仅生成章节列表和搜索索引
- `pnpm dev:convert`: 监听 Markdown 文件变化并自动转换

## 注意事项

1. **文件命名**：章节文件必须命名为 `chapter-{id}.md`，其中 `{id}` 是章节编号
2. **Front Matter**：每个章节文件必须包含完整的 Front Matter
3. **路径一致性**：Front Matter 中的 `path` 必须与文件编号一致（`/chapter/{id}`）
4. **自动生成文件**：`src/pages/chapters/` 和 `src/utils/` 下的生成文件不要手动编辑

## 故障排除

### 转换失败

- 检查 Markdown 文件语法是否正确
- 检查 Front Matter 格式是否正确
- 查看控制台错误信息

### 组件不显示

- 确保已运行 `pnpm convert`
- 检查生成的文件是否存在
- 检查路由配置是否正确

### 搜索索引不更新

- 运行 `pnpm generate-index` 重新生成索引
- 检查 `content/config.yaml` 配置是否正确

