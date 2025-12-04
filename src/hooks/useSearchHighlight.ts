import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { searchAndHighlight, clearAllHighlights } from '../utils/searchHighlight'

/**
 * Hook: 处理URL中的搜索参数，自动搜索并高亮页面内容
 */
export function useSearchHighlight() {
  const location = useLocation()
  const cleanupRef = useRef<(() => void) | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const autoClearTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // 清理之前的定时器
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    // 清理自动清除定时器
    if (autoClearTimerRef.current) {
      clearTimeout(autoClearTimerRef.current)
      autoClearTimerRef.current = null
    }

    // 清理之前的高亮
    if (cleanupRef.current) {
      cleanupRef.current()
      cleanupRef.current = null
    }
    
    // 总是先清理所有高亮，避免残留
    clearAllHighlights()

    // 从URL hash中获取搜索关键词
    // 格式: #search=关键词
    const hash = location.hash
    const searchMatch = hash.match(/search=([^&]+)/)
    
    if (searchMatch) {
      const query = decodeURIComponent(searchMatch[1])
      
      // 等待页面内容加载完成
      // 使用双重延迟确保 DOM 已完全渲染
      timerRef.current = setTimeout(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            cleanupRef.current = searchAndHighlight(query, true)
            
            // 设置自动清除定时器：5秒后自动清除高亮
            autoClearTimerRef.current = setTimeout(() => {
              if (cleanupRef.current) {
                cleanupRef.current()
                cleanupRef.current = null
              }
              clearAllHighlights()
              autoClearTimerRef.current = null
            }, 5000) // 5秒后自动清除
          })
        })
      }, 300)
    }

    return () => {
      // 清理定时器
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
      // 清理自动清除定时器
      if (autoClearTimerRef.current) {
        clearTimeout(autoClearTimerRef.current)
        autoClearTimerRef.current = null
      }
      // 清理高亮
      if (cleanupRef.current) {
        cleanupRef.current()
        cleanupRef.current = null
      }
      // 确保清理所有高亮
      clearAllHighlights()
    }
  }, [location.pathname, location.hash])

  // 监听滚动事件，滚动时清除高亮
  useEffect(() => {
    function handleScroll() {
      if (cleanupRef.current) {
        cleanupRef.current()
        cleanupRef.current = null
      }
      if (autoClearTimerRef.current) {
        clearTimeout(autoClearTimerRef.current)
        autoClearTimerRef.current = null
      }
      clearAllHighlights()
    }

    // 延迟添加滚动监听，避免频繁触发
    const scrollTimer = setTimeout(() => {
      window.addEventListener('scroll', handleScroll, { passive: true })
    }, 1000)

    return () => {
      clearTimeout(scrollTimer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [location.pathname, location.hash])

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
      if (autoClearTimerRef.current) {
        clearTimeout(autoClearTimerRef.current)
        autoClearTimerRef.current = null
      }
      if (cleanupRef.current) {
        cleanupRef.current()
        cleanupRef.current = null
      }
      // 清理所有高亮
      clearAllHighlights()
    }
  }, [])
}

