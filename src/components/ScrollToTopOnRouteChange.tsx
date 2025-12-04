import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTopOnRouteChange() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    // 如果 URL 中包含搜索参数，不滚动到顶部（让搜索高亮功能处理滚动）
    const hasSearchParam = hash.includes('search=')
    
    if (!hasSearchParam) {
      // 路由变化时滚动到顶部
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant', // 使用 instant 而不是 smooth，让切换更快速
      })
    }
  }, [pathname, hash])

  return null
}

