import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function CodeBlock({ title, code, language = 'glsl' }) {
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

  return (
    <div className="my-6 rounded-lg overflow-hidden relative group" style={{
      background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.95), rgba(21, 21, 32, 0.95))',
      border: '1px solid rgba(74, 158, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(74, 158, 255, 0.1)',
    }}>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      {title && (
        <div className="px-4 py-2.5 border-b border-dark-border text-sm font-medium flex items-center gap-2 relative" style={{
          background: 'linear-gradient(135deg, rgba(21, 21, 32, 0.9), rgba(26, 26, 40, 0.9))',
          borderBottom: '1px solid rgba(74, 158, 255, 0.2)',
        }}>
          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <span className="bg-gradient-to-r from-gray-400 to-gray-300 bg-clip-text text-transparent">{title}</span>
        </div>
      )}
      <div className="overflow-x-auto relative">
        <SyntaxHighlighter
          language={mappedLanguage}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: 'transparent',
            fontSize: '0.875rem',
            lineHeight: '1.6',
          }}
          showLineNumbers={code.split('\n').length > 5}
          lineNumberStyle={{
            minWidth: '3em',
            paddingRight: '1em',
            color: 'rgba(110, 118, 129, 0.6)',
            userSelect: 'none',
            borderRight: '1px solid rgba(74, 158, 255, 0.1)',
            marginRight: '1em',
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}

