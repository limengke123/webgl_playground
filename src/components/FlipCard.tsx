import { useState, useEffect } from 'react'
import WebGLCanvas from './WebGLCanvas'
import CodeBlock from './CodeBlock'

interface FlipCardProps {
  width?: number
  height?: number
  onInit?: (gl: WebGL2RenderingContext, canvas: HTMLCanvasElement) => void
  codeBlocks: Array<{
    title: string
    code: string
    language?: string
  }>
  defaultSide?: 'demo' | 'code'
}

export default function FlipCard({ 
  width = 400, 
  height = 400, 
  onInit,
  codeBlocks,
  defaultSide = 'demo'
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(defaultSide === 'code')
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    checkTheme()
    
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    
    return () => observer.disconnect()
  }, [])

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  // WebGLCanvas外层有padding: p-4 (16px上下各16px，总共32px)
  // 所以容器总高度是 height + 32px
  const containerHeight = height + 32

  return (
    <div className="my-6 relative" style={{ height: `${containerHeight}px`, minHeight: `${containerHeight}px` }}>
      {/* Demo 面 */}
      <div 
        className="absolute inset-0 w-full"
        style={{
          opacity: isFlipped ? 0 : 1,
          pointerEvents: isFlipped ? 'none' : 'auto',
          transition: 'opacity 0.2s ease',
        }}
      >
        <div className="relative" style={{ height: `${containerHeight}px` }}>
          <WebGLCanvas width={width} height={height} onInit={onInit} />
          <button
            onClick={handleFlip}
            className="absolute top-4 right-4 z-20 p-2 rounded-lg transition-all duration-200 flex items-center justify-center cursor-pointer"
            style={{
              backgroundColor: isDark 
                ? 'rgba(74, 158, 255, 0.2)' 
                : 'rgba(74, 158, 255, 0.15)',
              border: `1px solid ${isDark ? 'rgba(74, 158, 255, 0.4)' : 'rgba(74, 158, 255, 0.3)'}`,
              color: isDark ? '#a0d5ff' : '#4a9eff',
              boxShadow: isDark
                ? '0 2px 8px rgba(74, 158, 255, 0.2)'
                : '0 2px 8px rgba(74, 158, 255, 0.15)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDark 
                ? 'rgba(74, 158, 255, 0.3)' 
                : 'rgba(74, 158, 255, 0.25)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isDark 
                ? 'rgba(74, 158, 255, 0.2)' 
                : 'rgba(74, 158, 255, 0.15)'
            }}
            title="查看代码"
            aria-label="查看代码"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </button>
        </div>
      </div>

      {/* 代码面 */}
      <div 
        className="absolute inset-0 w-full overflow-y-auto rounded-lg"
        style={{
          opacity: isFlipped ? 1 : 0,
          pointerEvents: isFlipped ? 'auto' : 'none',
          transition: 'opacity 0.2s ease',
          height: `${containerHeight}px`,
          minHeight: `${containerHeight}px`,
          backgroundColor: isDark ? 'rgba(21, 21, 32, 0.95)' : 'rgba(248, 249, 250, 0.95)',
          border: `1px solid ${isDark ? 'rgba(74, 158, 255, 0.2)' : 'rgba(74, 158, 255, 0.15)'}`,
          boxShadow: isDark 
            ? '0 2px 4px rgba(0, 0, 0, 0.5)' 
            : '0 2px 4px rgba(0, 0, 0, 0.2)',
        }}
      >
        <div className="relative p-4" style={{ minHeight: `${containerHeight}px` }}>
          <button
            onClick={handleFlip}
            className="absolute top-4 right-4 z-20 p-2 rounded-lg transition-all duration-200 flex items-center justify-center cursor-pointer"
            style={{
              backgroundColor: isDark 
                ? 'rgba(74, 158, 255, 0.2)' 
                : 'rgba(74, 158, 255, 0.15)',
              border: `1px solid ${isDark ? 'rgba(74, 158, 255, 0.4)' : 'rgba(74, 158, 255, 0.3)'}`,
              color: isDark ? '#a0d5ff' : '#4a9eff',
              boxShadow: isDark
                ? '0 2px 8px rgba(74, 158, 255, 0.2)'
                : '0 2px 8px rgba(74, 158, 255, 0.15)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDark 
                ? 'rgba(74, 158, 255, 0.3)' 
                : 'rgba(74, 158, 255, 0.25)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isDark 
                ? 'rgba(74, 158, 255, 0.2)' 
                : 'rgba(74, 158, 255, 0.15)'
            }}
            title="查看效果"
            aria-label="查看效果"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <div className="space-y-4">
            {codeBlocks.map((block, index) => (
              <CodeBlock 
                key={index}
                title={block.title}
                code={block.code}
                language={block.language}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

