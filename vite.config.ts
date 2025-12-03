import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages 部署时，如果仓库名不是 username.github.io，需要设置 base
// 例如：如果仓库名是 webgl_playground，则 base 应该是 '/webgl_playground/'
// 如果是自定义域名或 username.github.io，则 base 应该是 '/'
// 
// 注意：如果仓库名是 username.github.io，GitHub Pages 会部署到根路径，base 应该是 '/'
// 否则，base 应该是 '/repository-name/'
function getBase(): string {
  // 在 GitHub Actions 中，GITHUB_REPOSITORY 环境变量可用
  if (process.env.GITHUB_REPOSITORY) {
    const repoName = process.env.GITHUB_REPOSITORY.split('/')[1]
    // 如果仓库名是 username.github.io，使用根路径
    if (repoName.includes('.github.io')) {
      return '/'
    }
    // 否则使用仓库名作为 base path
    return `/${repoName}/`
  }
  // 本地开发时，默认使用根路径
  return '/'
}

export default defineConfig({
  base: getBase(),
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})

