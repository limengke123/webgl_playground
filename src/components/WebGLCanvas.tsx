import { useEffect, useRef, useState } from 'react'

interface WebGLCanvasProps {
  width?: number
  height?: number
  onInit?: (gl: WebGLRenderingContext, canvas: HTMLCanvasElement) => void
}

export default function WebGLCanvas({ width = 800, height = 600, onInit }: WebGLCanvasProps) {
  const canvasRef = useRef(null)
  const glRef = useRef(null)
  const cleanupRef = useRef(null)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // 检查当前主题
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    checkTheme()
    
    // 监听主题变化
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // 如果已经有上下文，先清理
    if (cleanupRef.current) {
      cleanupRef.current()
      cleanupRef.current = null
    }

    let gl = null
    try {
      // 尝试获取 WebGL 上下文
      gl = canvas.getContext('webgl', {
        // 可选：添加一些上下文属性
        antialias: true,
        preserveDrawingBuffer: false,
      }) || canvas.getContext('experimental-webgl')
    } catch (e) {
      console.error('创建 WebGL 上下文时出错:', e)
      return
    }

    if (!gl) {
      console.error('无法创建 WebGL 上下文。请确保浏览器支持 WebGL。')
      return
    }

    glRef.current = gl

    if (onInit) {
      try {
        onInit(gl, canvas)
      } catch (error) {
        console.error('WebGL 初始化错误:', error)
        console.error('错误详情:', error.message)
        if (error.stack) {
          console.error('错误堆栈:', error.stack)
        }
      }
    }

    // 设置清理函数
    cleanupRef.current = () => {
      glRef.current = null
    }

    return () => {
      // 执行清理
      if (cleanupRef.current) {
        cleanupRef.current()
        cleanupRef.current = null
      }
    }
  }, [onInit])

  return (
    <div 
      className="my-6 flex justify-center rounded-lg p-4 relative" 
      style={{
        backgroundColor: isDark ? 'rgba(21, 21, 32, 0.6)' : 'rgba(248, 249, 250, 0.8)',
        border: `1px solid ${isDark ? 'rgba(74, 158, 255, 0.15)' : 'rgba(74, 158, 255, 0.12)'}`,
        boxShadow: isDark 
          ? '0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.03)' 
          : '0 2px 8px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
      }}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="block max-w-full h-auto relative z-10 rounded"
        style={{
          boxShadow: isDark 
            ? '0 2px 4px rgba(0, 0, 0, 0.3)' 
            : '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      />
    </div>
  )
}

