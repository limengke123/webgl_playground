import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { search, SearchItem } from '../utils/searchIndex'

export default function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  // 处理搜索
  useEffect(() => {
    if (query.trim()) {
      const searchResults = search(query)
      setResults(searchResults)
      setSelectedIndex(0)
      setIsOpen(true)
    } else {
      setResults([])
      setIsOpen(false)
    }
  }, [query])

  // 点击外部关闭搜索结果
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isOpen])

  // 键盘快捷键 Cmd/Ctrl + K 打开搜索
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        // 如果焦点在输入框或可编辑元素上，不拦截（让用户正常编辑）
        const activeElement = document.activeElement
        const isInputFocused = 
          activeElement?.tagName === 'INPUT' ||
          activeElement?.tagName === 'TEXTAREA' ||
          activeElement?.getAttribute('contenteditable') === 'true'
        
        // 如果焦点在搜索输入框本身，不拦截
        if (activeElement === inputRef.current) {
          return
        }
        
        // 如果焦点在其他输入框，也不拦截（让浏览器默认行为处理）
        if (isInputFocused && activeElement !== inputRef.current) {
          return
        }
        
        e.preventDefault()
        inputRef.current?.focus()
        // 如果有查询内容，打开搜索结果
        if (query.trim()) {
          setIsOpen(true)
        }
        // 如果没有查询内容，选中输入框中的所有文本，方便用户直接输入
        else {
          setTimeout(() => {
            inputRef.current?.select()
          }, 0)
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [query])

  // 键盘导航
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0))
        break
      case 'Enter':
        e.preventDefault()
        if (results[selectedIndex]) {
          handleSelectResult(results[selectedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        inputRef.current?.blur()
        break
    }
  }

  // 选择搜索结果
  const handleSelectResult = (item: SearchItem) => {
    // 如果有关键词，通过 hash 传递搜索参数
    const searchQuery = query.trim()
    const path = searchQuery 
      ? `${item.path}#search=${encodeURIComponent(searchQuery)}`
      : item.path
    
    navigate(path)
    setQuery('')
    setIsOpen(false)
    inputRef.current?.blur()
  }

  // 获取类型图标
  const getTypeIcon = (type: SearchItem['type']) => {
    switch (type) {
      case 'home':
        return '🏠'
      case 'playground':
        return '🎮'
      case 'chapter':
        return '📖'
      default:
        return '📄'
    }
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      {/* 搜索输入框 */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder="搜索页面..."
          className="w-full px-4 py-2 pl-10 bg-dark-surface dark:bg-dark-surface bg-light-surface border border-dark-border dark:border-dark-border border-light-border rounded-lg text-dark-text dark:text-dark-text text-light-text placeholder-dark-text-muted dark:placeholder-dark-text-muted placeholder-light-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-text-muted dark:text-dark-text-muted text-light-text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {query && (
          <button
            onClick={() => {
              setQuery('')
              setIsOpen(false)
              inputRef.current?.focus()
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-text-muted dark:text-dark-text-muted text-light-text-muted hover:text-dark-text dark:hover:text-dark-text hover:text-light-text transition-colors"
            aria-label="清除搜索"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* 搜索结果下拉列表 */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-dark-surface dark:bg-dark-surface bg-light-surface border border-dark-border dark:border-dark-border border-light-border rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">
          {results.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleSelectResult(item)}
              className={`w-full px-4 py-3 text-left hover:bg-dark-bg dark:hover:bg-dark-bg hover:bg-light-surface transition-colors border-b border-dark-border dark:border-dark-border border-light-border last:border-b-0 ${
                index === selectedIndex
                  ? 'bg-gradient-to-r from-primary/10 to-transparent border-l-4 border-l-primary'
                  : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0 mt-0.5">{getTypeIcon(item.type)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-dark-text dark:text-dark-text text-light-text truncate">
                      {item.title}
                    </span>
                    {item.type === 'chapter' && (
                      <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded flex-shrink-0">
                        章节
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-dark-text-muted dark:text-dark-text-muted text-light-text-muted line-clamp-2">
                    {item.description}
                  </p>
                  {item.keywords.some(k => query.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(query.toLowerCase())) && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.keywords
                        .filter(k => k.toLowerCase().includes(query.toLowerCase()) || query.toLowerCase().includes(k.toLowerCase()))
                        .slice(0, 3)
                        .map((keyword, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded"
                          >
                            {keyword}
                          </span>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* 无结果提示 */}
      {isOpen && query.trim() && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-dark-surface dark:bg-dark-surface bg-light-surface border border-dark-border dark:border-dark-border border-light-border rounded-lg shadow-xl p-4 z-50">
          <p className="text-center text-dark-text-muted dark:text-dark-text-muted text-light-text-muted">
            未找到相关页面
          </p>
        </div>
      )}
    </div>
  )
}

