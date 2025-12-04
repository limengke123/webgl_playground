import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useEffect, useState } from 'react'

export default function CodeBlock({ title, code, language = 'glsl' }) {
  const [isDark, setIsDark] = useState(false)
  const [copied, setCopied] = useState(false)

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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  // 映射语言名称（Prism.js 支持的语言）
  const languageMap = {
    glsl: 'glsl', // GLSL 可能需要注册，如果没有则使用 c 或 cpp
    javascript: 'javascript',
    js: 'javascript',
    typescript: 'typescript',
    ts: 'typescript',
    html: 'markup',
    css: 'css',
    json: 'json',
    c: 'c',
    cpp: 'cpp',
  }

  // 如果 GLSL 不支持，尝试使用 C 或 C++ 语法高亮
  let mappedLanguage = languageMap[language] || language
  if (mappedLanguage === 'glsl') {
    // 尝试使用 cpp 作为后备（GLSL 语法类似 C++）
    mappedLanguage = 'cpp'
  }

  // 自定义样式，提高对比度和可读性
  const customDarkStyle = {
    ...vscDarkPlus,
    'code[class*="language-"]': {
      ...vscDarkPlus['code[class*="language-"]'],
      color: '#e0e0e0',
      background: 'transparent',
    },
    'pre[class*="language-"]': {
      ...vscDarkPlus['pre[class*="language-"]'],
      background: 'transparent',
    },
    '.token.comment': {
      color: '#6a9955',
    },
    '.token.string': {
      color: '#ce9178',
    },
    '.token.keyword': {
      color: '#569cd6',
    },
    '.token.function': {
      color: '#dcdcaa',
    },
    '.token.number': {
      color: '#b5cea8',
    },
  }

  const customLightStyle = {
    ...oneLight,
    'code[class*="language-"]': {
      ...oneLight['code[class*="language-"]'],
      color: '#1f2937',
      background: 'transparent',
    },
    'pre[class*="language-"]': {
      ...oneLight['pre[class*="language-"]'],
      background: 'transparent',
    },
    '.token.comment': {
      color: '#6a737d',
    },
    '.token.string': {
      color: '#032f62',
    },
    '.token.keyword': {
      color: '#d73a49',
    },
    '.token.function': {
      color: '#6f42c1',
    },
    '.token.number': {
      color: '#005cc5',
    },
  }

  return (
    <div className="my-6 rounded-lg overflow-hidden relative group" style={{
      backgroundColor: isDark ? 'rgba(21, 21, 32, 0.6)' : 'rgba(248, 249, 250, 0.8)',
      border: `1px solid ${isDark ? 'rgba(74, 158, 255, 0.15)' : 'rgba(74, 158, 255, 0.12)'}`,
      boxShadow: isDark 
        ? '0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.03)' 
        : '0 2px 8px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
    }}>
      {title && (
        <div className="px-4 py-2.5 border-b text-sm font-medium flex items-center justify-between gap-2 relative" style={{
          borderColor: isDark ? 'rgba(74, 158, 255, 0.15)' : 'rgba(74, 158, 255, 0.12)',
          backgroundColor: isDark ? 'rgba(21, 21, 32, 0.4)' : 'rgba(248, 249, 250, 0.6)',
        }}>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <span style={{
              color: isDark ? '#a0a0b0' : '#6b7280',
            }}>{title}</span>
          </div>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded hover:bg-dark-bg dark:hover:bg-dark-bg hover:bg-light-surface transition-all text-dark-text-muted dark:text-dark-text-muted text-light-text-muted hover:text-primary dark:hover:text-primary"
            aria-label={copied ? '已复制' : '复制代码'}
            title={copied ? '已复制' : '复制代码'}
          >
            {copied ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        </div>
      )}
      {!title && (
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-1.5 rounded hover:bg-dark-bg dark:hover:bg-dark-bg hover:bg-light-surface transition-all text-dark-text-muted dark:text-dark-text-muted text-light-text-muted hover:text-primary dark:hover:text-primary z-10 opacity-0 group-hover:opacity-100"
          aria-label={copied ? '已复制' : '复制代码'}
          title={copied ? '已复制' : '复制代码'}
        >
          {copied ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      )}
      <div className="overflow-x-auto relative">
        <SyntaxHighlighter
          language={mappedLanguage}
          style={isDark ? customDarkStyle : customLightStyle}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: 'transparent',
            fontSize: '0.9rem',
            lineHeight: '1.7',
            color: isDark ? '#e0e0e0' : '#1f2937',
          }}
          showLineNumbers={code.split('\n').length > 5}
          lineNumberStyle={{
            minWidth: '3em',
            paddingRight: '1em',
            color: isDark ? 'rgba(160, 160, 176, 0.5)' : 'rgba(107, 114, 128, 0.5)',
            userSelect: 'none',
            borderRight: isDark ? '1px solid rgba(74, 158, 255, 0.08)' : '1px solid rgba(74, 158, 255, 0.1)',
            marginRight: '1em',
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}

