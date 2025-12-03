# GitHub Pages 部署指南

本项目已配置 GitHub Actions 自动部署到 GitHub Pages。

## 设置步骤

### 1. 启用 GitHub Pages

1. 进入你的 GitHub 仓库
2. 点击 `Settings` → `Pages`
3. 在 `Source` 部分，选择 `GitHub Actions`
4. 保存设置

### 2. 推送代码

当你推送代码到 `main` 分支时，GitHub Actions 会自动：
- 安装依赖（使用 pnpm）
- 构建项目
- 部署到 GitHub Pages

### 3. 访问网站

部署完成后，你的网站将可以通过以下地址访问：
- `https://<username>.github.io/<repository-name>/`

例如：`https://yourusername.github.io/webgl_playground/`

## 手动触发部署

你也可以在 GitHub 仓库的 `Actions` 标签页中手动触发部署：
1. 进入 `Actions` 标签页
2. 选择 `Deploy to GitHub Pages` workflow
3. 点击 `Run workflow`

## 注意事项

- 确保仓库名称与 Vite 配置中的 base path 匹配
- 如果更改了仓库名称，需要更新 `vite.config.js` 中的 base 配置
- 首次部署可能需要几分钟时间
- 部署状态可以在 `Actions` 标签页中查看

## 本地测试 GitHub Pages 路径

如果你想在本地测试 GitHub Pages 的路径，可以：

```bash
# 设置 base path（替换为你的仓库名）
pnpm build --base=/your-repo-name/

# 预览构建结果
pnpm preview
```

