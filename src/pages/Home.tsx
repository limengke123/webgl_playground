import { Link } from 'react-router-dom'

const chapters = [
  {
    id: 0,
    title: '从零开始创建项目',
    description: '手把手教你创建 canvas 元素，获取 WebGL 上下文，搭建第一个 WebGL 项目',
    path: '/chapter/0'
  },
  {
    id: 1,
    title: 'WebGL 基础',
    description: '学习 WebGL 的基本概念，绘制第一个三角形，了解着色器的工作原理',
    path: '/chapter/1'
  },
  {
    id: 2,
    title: 'GLSL 语法基础',
    description: '掌握 GLSL 着色器语言的基础语法，数据类型、变量限定符和常用函数',
    path: '/chapter/2'
  },
  {
    id: 3,
    title: '3D 数学基础',
    description: '掌握向量、矩阵变换（平移、旋转、缩放）和 MVP 矩阵的完整流程',
    path: '/chapter/3'
  },
  {
    id: 4,
    title: '渲染管线',
    description: '深入理解 WebGL 渲染管线，顶点处理、图元装配、光栅化等',
    path: '/chapter/4'
  },
  {
    id: 5,
    title: '相机与投影',
    description: '学习视图矩阵、投影矩阵（透视和正交），理解完整的 MVP 变换',
    path: '/chapter/5'
  },
  {
    id: 6,
    title: '光照',
    description: '掌握环境光、漫反射光和镜面反射光，实现 Phong 光照模型',
    path: '/chapter/6'
  },
  {
    id: 7,
    title: '材质与纹理',
    description: '学习如何创建和使用材质，加载和应用纹理贴图',
    path: '/chapter/7'
  },
  {
    id: 8,
    title: '交互与动画',
    description: '实现鼠标、键盘交互控制，创建流畅的动画效果',
    path: '/chapter/8'
  },
  {
    id: 9,
    title: '性能优化',
    description: '学习 WebGL 性能优化技巧，提升渲染效率',
    path: '/chapter/9'
  },
]

export default function Home() {
  return (
    <div className="max-w-4xl relative z-10">
      <div className="text-center py-15 border-b border-dark-border dark:border-dark-border border-light-border mb-10 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent blur-3xl"></div>
        <h1 className="text-5xl mb-5 relative">
          <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
            WebGL 学习教程
          </span>
        </h1>
        <p className="text-xl text-dark-text-muted dark:text-dark-text-muted text-light-text-muted relative mb-6">
          从零开始学习 WebGL，通过交互式示例深入理解图形学基础
        </p>
        <Link 
          to="/playground" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-purple-500 text-white rounded-lg hover:from-primary/90 hover:to-purple-500/90 transition-all font-medium shadow-lg hover:shadow-xl relative z-10"
        >
          <span>🎮</span>
          <span>进入 Playground</span>
          <span>→</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-15">
        {chapters.map(chapter => (
          <Link 
            key={chapter.id} 
            to={chapter.path} 
            className="tech-card p-8 no-underline text-inherit relative overflow-hidden group"
          >
            <div className="absolute top-5 right-5 text-5xl font-bold opacity-20 group-hover:opacity-30 transition-opacity">
              <span className="bg-gradient-to-br from-primary to-purple-500 bg-clip-text text-transparent">
                {chapter.id}
              </span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:via-primary/10 group-hover:to-purple-500/5 transition-all duration-500"></div>
            <h2 className="text-2xl mb-4 relative z-10">
              <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                {chapter.title}
              </span>
            </h2>
            <p className="text-dark-text-muted dark:text-dark-text-muted text-light-text-muted mb-5 leading-relaxed relative z-10">{chapter.description}</p>
            <div className="text-primary font-medium relative z-10 flex items-center gap-2 group-hover:gap-3 transition-all">
              开始学习 
              <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="tech-card p-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500"></div>
        <h2 className="text-3xl mb-5 relative">
          <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            关于本教程
          </span>
        </h2>
        <p className="text-dark-text-muted dark:text-dark-text-muted text-light-text-muted leading-relaxed mb-5">
          这是一个交互式的 WebGL 学习平台，旨在帮助你从零开始掌握 WebGL 和图形学基础。
          每个章节都包含详细的理论讲解和可交互的代码示例，让你在实践中学习。
        </p>
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">你将学到：</h3>
        <ul className="text-dark-text-muted dark:text-dark-text-muted text-light-text-muted leading-loose pl-8 space-y-2">
          {[
            'WebGL 基础概念和 API',
            'GLSL 着色器语言语法',
            '3D 数学（向量、矩阵、MVP 变换）',
            '渲染管线深入理解',
            '相机控制和投影矩阵',
            '光照模型（环境光、漫反射、镜面反射）',
            '材质、纹理和贴图',
            '交互控制和动画循环',
            '性能优化最佳实践'
          ].map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="text-primary">▹</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

