import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTopOnRouteChange() {
  const { pathname } = useLocation()

  useEffect(() => {
    // 路由变化时滚动到顶部
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant', // 使用 instant 而不是 smooth，让切换更快速
    })
  }, [pathname])

  return null
}

