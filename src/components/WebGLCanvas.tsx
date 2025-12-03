import { useEffect, useRef } from 'react'

export default function WebGLCanvas({ width = 800, height = 600, onInit }) {
  const canvasRef = useRef(null)
  const glRef = useRef(null)
  const cleanupRef = useRef(null)

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
    <div className="my-5 flex justify-center rounded-lg p-5 relative group" style={{
      background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.8), rgba(21, 21, 32, 0.8))',
      border: '1px solid rgba(74, 158, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(74, 158, 255, 0.1)',
    }}>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="block max-w-full h-auto relative z-10 rounded"
        style={{
          boxShadow: '0 0 20px rgba(74, 158, 255, 0.1)',
        }}
      />
    </div>
  )
}

