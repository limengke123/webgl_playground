# WebGL 学习教程

这是一个交互式的 WebGL 学习项目，帮助你从零开始学习 WebGL 和图形学基础。

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

## 开发

```bash
pnpm install
pnpm dev
```

## 构建

```bash
pnpm build
```

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

