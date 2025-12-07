import { useEffect, useRef, useState } from 'react'

interface WebGLCanvasProps {
  width?: number
  height?: number
  onInit?: (gl: WebGL2RenderingContext, canvas: HTMLCanvasElement) => void
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

    // 确保 canvas 的尺寸正确设置
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height
    }

    // 如果已经有上下文，先清理
    if (cleanupRef.current) {
      cleanupRef.current()
      cleanupRef.current = null
    }

    let gl: WebGL2RenderingContext | null = null
    try {
      // 获取 WebGL2 上下文
      gl = canvas.getContext('webgl2', {
        antialias: true,
        preserveDrawingBuffer: false,
      })
    } catch (e) {
      console.error('创建 WebGL2 上下文时出错:', e)
      return
    }

    if (!gl) {
      console.error('无法创建 WebGL2 上下文。请确保浏览器支持 WebGL2。')
      return
    }

    glRef.current = gl

    if (onInit) {
      try {
        // 确保视口设置正确
        gl.viewport(0, 0, canvas.width, canvas.height)
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
  }, [onInit, width, height])

  return (
    <div 
      className="my-6 flex justify-center rounded-lg p-4 relative bg-dark-surface dark:bg-dark-surface bg-light-surface border border-dark-border dark:border-dark-border border-light-border shadow-lg"
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="block relative z-10 rounded"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          maxWidth: '100%',
          backgroundColor: '#000000',
          boxShadow: isDark 
            ? '0 2px 4px rgba(0, 0, 0, 0.5)' 
            : '0 2px 4px rgba(0, 0, 0, 0.2)',
        }}
      />
    </div>
  )
}

