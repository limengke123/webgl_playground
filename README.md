# WebGL 学习教程

这是一个交互式的 WebGL 学习项目，帮助你从零开始学习 WebGL 和图形学基础。

> 💡 **项目说明**：本项目由 [Cursor](https://cursor.sh/) AI 代码编辑器生成和开发。

## 功能特性

- 📚 由浅入深的教程内容
- 🎮 交互式 WebGL 示例
- 📖 图形学基础（向量、矩阵）
- 🎨 渲染管线、材质、纹理
- ⚡ 性能优化技巧
- 🔧 GLSL 语法和 WebGL API

## 技术栈

- React 18
- Vite
- WebGL
- Tailwind CSS
- React Router
- Markdown 内容管理系统（基于 remark）

## 内容管理

本项目使用基于 Markdown 的内容管理系统：

- 📝 所有章节内容存储在 `content/chapters/` 目录下的 Markdown 文件中
- 🔄 构建时自动将 Markdown 转换为 React 组件
- ⚙️ 网站配置和首页内容通过 `content/config.yaml` 管理
- 🔍 自动生成章节列表和搜索索引

### 快速开始

1. **创建新章节**：在 `content/chapters/` 目录下创建 `chapter-{id}.md` 文件
2. **编辑内容**：使用 Markdown 语法编写内容，支持自定义组件（CodeBlock、FlipCard 等）
3. **转换**：运行 `pnpm convert` 将 Markdown 转换为 React 组件
4. **开发**：使用 `pnpm dev:convert` 监听文件变化并自动转换

详细使用说明请查看 [Markdown 转换系统文档](./docs/MARKDOWN_CONVERSION.md)

## 开发

```bash
pnpm install
pnpm dev
```

## 构建

```bash
pnpm build
```

构建流程：
1. 自动运行 Markdown 转换脚本（`prebuild` 钩子）
2. 将 Markdown 文件转换为 React 组件
3. 生成章节元数据和搜索索引
4. 运行 Vite 构建

构建后的静态文件在 `dist` 目录中。

## 部署

项目已配置 GitHub Actions 自动部署到 GitHub Pages。

### 自动部署

当你推送代码到 `main` 分支时，GitHub Actions 会自动：
1. 安装依赖
2. 构建项目
3. 部署到 GitHub Pages

### 设置步骤

1. 在 GitHub 仓库设置中启用 GitHub Pages：
   - 进入 `Settings` → `Pages`
   - 在 `Source` 中选择 `GitHub Actions`

2. 推送代码到 `main` 分支

3. 等待部署完成，访问：`https://<username>.github.io/<repository-name>/`

详细部署说明请查看 [DEPLOY.md](./DEPLOY.md)

