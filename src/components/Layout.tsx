import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import Search from './Search'
import { useSearchHighlight } from '../hooks/useSearchHighlight'

const chapters = [
  { id: 0, title: '从零开始创建项目', path: '/chapter/0' },
  { id: 1, title: 'WebGL 基础', path: '/chapter/1' },
  { id: 2, title: 'GLSL 语法基础', path: '/chapter/2' },
  { id: 3, title: '3D 数学基础', path: '/chapter/3' },
  { id: 4, title: '渲染管线', path: '/chapter/4' },
  { id: 5, title: '相机与投影', path: '/chapter/5' },
  { id: 6, title: '光照', path: '/chapter/6' },
  { id: 7, title: '材质与纹理', path: '/chapter/7' },
  { id: 8, title: '交互与动画', path: '/chapter/8' },
  { id: 9, title: '性能优化', path: '/chapter/9' },
]

export default function Layout({ children }) {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
  // 处理搜索高亮
  useSearchHighlight()

  return (
    <div className="flex min-h-screen">
      <aside 
        className="bg-dark-surface dark:bg-dark-surface bg-light-surface border-r border-dark-border dark:border-dark-border border-light-border flex flex-col fixed top-0 left-0 h-screen w-[280px] z-40 transition-transform duration-500 ease-in-out"
        style={{
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500"></div>
        <div className="p-5 border-b border-dark-border dark:border-dark-border border-light-border flex items-center justify-between relative">
          <Link to="/" className="no-underline text-dark-text dark:text-dark-text text-light-text flex-1">
            <h1 className="text-2xl font-semibold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              WebGL 教程
            </h1>
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-dark-bg dark:hover:bg-dark-bg hover:bg-light-surface rounded transition-all text-dark-text-muted dark:text-dark-text-muted text-light-text-muted hover:text-primary dark:hover:text-primary"
            aria-label={sidebarOpen ? '收起侧边栏' : '展开侧边栏'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>
        <div className="p-5 border-b border-dark-border dark:border-dark-border border-light-border">
          <Search />
        </div>
        <nav className="py-5 overflow-y-auto flex-1">
          <Link 
            to="/" 
            className={`block px-5 py-3 text-dark-text-muted dark:text-dark-text-muted text-light-text-muted no-underline transition-all border-l-[3px] relative group ${
              location.pathname === '/' 
                ? 'bg-gradient-to-r from-primary/10 to-transparent text-primary border-l-primary' 
                : 'border-transparent hover:bg-dark-bg dark:hover:bg-dark-bg hover:bg-light-surface hover:text-dark-text dark:hover:text-dark-text hover:text-light-text hover:border-primary/50'
            }`}
          >
            {location.pathname === '/' && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-purple-500"></div>
            )}
            <span className="relative z-10">首页</span>
          </Link>
          <Link 
            to="/playground" 
            className={`block px-5 py-3 text-dark-text-muted dark:text-dark-text-muted text-light-text-muted no-underline transition-all border-l-[3px] relative group ${
              location.pathname === '/playground' 
                ? 'bg-gradient-to-r from-primary/10 to-transparent text-primary border-l-primary' 
                : 'border-transparent hover:bg-dark-bg dark:hover:bg-dark-bg hover:bg-light-surface hover:text-dark-text dark:hover:text-dark-text hover:text-light-text hover:border-primary/50'
            }`}
          >
            {location.pathname === '/playground' && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-purple-500"></div>
            )}
            <span className="relative z-10">🎮 Playground</span>
          </Link>
          {chapters.map(chapter => (
            <Link
              key={chapter.id}
              to={chapter.path}
              className={`block px-5 py-3 text-dark-text-muted dark:text-dark-text-muted text-light-text-muted no-underline transition-all border-l-[3px] relative group ${
                location.pathname === chapter.path 
                  ? 'bg-gradient-to-r from-primary/10 to-transparent text-primary border-l-primary' 
                  : 'border-transparent hover:bg-dark-bg dark:hover:bg-dark-bg hover:bg-light-surface hover:text-dark-text dark:hover:text-dark-text hover:text-light-text hover:border-primary/50'
              }`}
            >
              {location.pathname === chapter.path && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-purple-500"></div>
              )}
              <span className="relative z-10">{chapter.id}. {chapter.title}</span>
            </Link>
          ))}
        </nav>
        
        {/* 底部操作按钮 */}
        <div className="px-5 py-2 border-t border-dark-border/50 dark:border-dark-border/50 border-light-border/50 flex items-center justify-between gap-3 bg-dark-surface/50 dark:bg-dark-surface/50 bg-light-surface/50 backdrop-blur-sm">
          <ThemeToggle />
          <a
            href="https://github.com/limengke123/webgl_playground"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-dark-bg dark:hover:bg-dark-bg hover:bg-light-surface rounded transition-all text-dark-text-muted dark:text-dark-text-muted text-light-text-muted hover:text-dark-text dark:hover:text-dark-text hover:text-light-text hover:text-primary dark:hover:text-primary"
            aria-label="查看 GitHub 项目"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </aside>
      
      {/* 侧边栏收起时的展开按钮 */}
      <button
        onClick={() => setSidebarOpen(true)}
        className={`fixed left-4 top-4 z-50 p-3 bg-dark-surface dark:bg-dark-surface bg-light-surface border border-dark-border dark:border-dark-border border-light-border rounded-lg hover:bg-dark-bg dark:hover:bg-dark-bg hover:bg-light-surface transition-all text-dark-text-muted dark:text-dark-text-muted text-light-text-muted hover:text-dark-text dark:hover:text-dark-text hover:text-light-text shadow-lg ${
          sidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        aria-label="展开侧边栏"
        style={{
          transition: 'opacity 0.3s ease-in-out',
        }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      <main 
        className="flex-1 p-6 md:p-10 transition-all duration-500 ease-in-out w-full relative"
        style={{
          marginLeft: sidebarOpen ? '280px' : '0',
          maxWidth: sidebarOpen ? 'calc(100% - 280px)' : '100%',
        }}
      >
        <div className="max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  )
}

