import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import Layout from './components/Layout'
import ScrollToTop from './components/ScrollToTop'
import ScrollToTopOnRouteChange from './components/ScrollToTopOnRouteChange'
import Home from './pages/Home'
import Chapter1 from './pages/chapters/Chapter1'
import Chapter2 from './pages/chapters/Chapter2'
import Chapter3 from './pages/chapters/Chapter3'
import Chapter4 from './pages/chapters/Chapter4'
import Chapter5 from './pages/chapters/Chapter5'
import Chapter6 from './pages/chapters/Chapter6'
import Chapter7 from './pages/chapters/Chapter7'
import Chapter8 from './pages/chapters/Chapter8'
import Chapter9 from './pages/chapters/Chapter9'

// 获取 base path，用于 GitHub Pages 部署
// 如果是在 GitHub Pages 上，base 会是 /repo-name/，basename 应该是 /repo-name
// 本地开发时，basename 是 undefined（使用默认的 /）
function getBasename(): string | undefined {
  // 从 import.meta.env.BASE_URL 获取（Vite 会自动设置）
  const base = import.meta.env.BASE_URL
  // 移除末尾的斜杠，React Router 的 basename 不需要
  return base === '/' ? undefined : base.slice(0, -1)
}

function App() {
  return (
    <ThemeProvider>
      <Router 
        basename={getBasename()}
        future={{
          v7_startTransition: true,
        }}
      >
        <ScrollToTopOnRouteChange />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chapter/1" element={<Chapter1 />} />
            <Route path="/chapter/2" element={<Chapter2 />} />
            <Route path="/chapter/3" element={<Chapter3 />} />
            <Route path="/chapter/4" element={<Chapter4 />} />
            <Route path="/chapter/5" element={<Chapter5 />} />
            <Route path="/chapter/6" element={<Chapter6 />} />
            <Route path="/chapter/7" element={<Chapter7 />} />
            <Route path="/chapter/8" element={<Chapter8 />} />
            <Route path="/chapter/9" element={<Chapter9 />} />
          </Routes>
        </Layout>
        <ScrollToTop />
      </Router>
    </ThemeProvider>
  )
}

export default App

