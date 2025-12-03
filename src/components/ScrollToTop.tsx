import { useEffect, useState } from 'react'

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  if (!isVisible) return null

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-[100] p-4 rounded-full shadow-lg transition-all hover:scale-110 relative overflow-hidden group"
      style={{
        background: 'linear-gradient(135deg, rgba(74, 158, 255, 0.9), rgba(138, 43, 226, 0.9))',
        boxShadow: '0 8px 32px rgba(74, 158, 255, 0.4), 0 0 20px rgba(74, 158, 255, 0.2)',
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
      }}
      aria-label="回到顶部"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></div>
      <svg className="w-6 h-6 relative z-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  )
}

