import { Link, useLocation } from 'react-router-dom'
import { chaptersMetadata } from '../utils/chaptersMetadata'

export default function ChapterNavigation() {
  const location = useLocation()
  const currentPath = location.pathname

  // 查找当前章节索引
  const currentIndex = chaptersMetadata.findIndex(ch => ch.path === currentPath)
  
  const prevChapter = currentIndex > 0 ? chaptersMetadata[currentIndex - 1] : null
  const nextChapter = currentIndex < chaptersMetadata.length - 1 ? chaptersMetadata[currentIndex + 1] : null

  // 如果不是章节页面，不显示导航
  if (currentIndex === -1) return null

  return (
    <div className="flex justify-between items-center gap-4 mt-12 pt-8 border-t border-dark-border dark:border-dark-border border-light-border relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
      {prevChapter ? (
        <Link
          to={prevChapter.path}
          className="tech-card flex items-center gap-3 px-6 py-4 no-underline text-dark-text-muted dark:text-dark-text-muted text-light-text-muted flex-1 max-w-[48%] group"
        >
          <svg className="w-5 h-5 flex-shrink-0 text-primary group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <div className="flex flex-col min-w-0">
            <span className="text-xs text-dark-text-muted dark:text-dark-text-muted text-light-text-muted mb-1">上一章</span>
            <span className="font-medium truncate bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary transition-all">
              {prevChapter.id}. {prevChapter.title}
            </span>
          </div>
        </Link>
      ) : (
        <div className="flex-1"></div>
      )}
      
      {nextChapter ? (
        <Link
          to={nextChapter.path}
          className="tech-card flex items-center gap-3 px-6 py-4 no-underline text-dark-text-muted dark:text-dark-text-muted text-light-text-muted flex-1 max-w-[48%] ml-auto group"
        >
          <div className="flex flex-col text-right min-w-0 flex-1">
            <span className="text-xs text-dark-text-muted dark:text-dark-text-muted text-light-text-muted mb-1">下一章</span>
            <span className="font-medium truncate bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary transition-all">
              {nextChapter.id}. {nextChapter.title}
            </span>
          </div>
          <svg className="w-5 h-5 flex-shrink-0 text-primary group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ) : (
        <div className="flex-1"></div>
      )}
    </div>
  )
}

