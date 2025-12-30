import WebGLCanvas from '../../components/WebGLCanvas'
import CodeBlock from '../../components/CodeBlock'
import FlipCard from '../../components/FlipCard'
import ChapterNavigation from '../../components/ChapterNavigation'

// 自动生成的元数据
export const metadata = {
  title: "第零章：从零开始创建 WebGL 项目",
  description: "手把手教你创建 canvas 元素，获取 WebGL 上下文，搭建第一个 WebGL 项目",
  order: 0,
  path: "/chapter/0",
  created: new Date("2025-12-30T09:24:43.422Z"),
  modified: new Date("2025-12-30T09:36:24.558Z"),
  size: 3015,
  keywords: ["创建项目","canvas","上下文","初始化"]
}

export default function Chapter0() {
  return (
    <div className="w-full">
      <h1 className="text-4xl mb-8 text-primary border-b-2 border-dark-border dark:border-dark-border border-light-border pb-4">
        {metadata.title}
      </h1>
      
<section className="mb-12">
  <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">准备工作</h2>
  <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
    在学习 WebGL 之前，我们需要先了解如何创建一个基本的 WebGL 项目。本章将手把手教你如何从零开始搭建一个 WebGL 项目。
  </p>
  <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
    你需要准备：
  </p>
  <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">现代浏览器</strong>：Chrome、Firefox、Safari、Edge 等（支持 WebGL）
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">代码编辑器</strong>：VS Code、WebStorm 等
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">本地服务器</strong>：可以使用 VS Code 的 Live Server 插件，或者 Node.js 的 http-server
    </li>
  </ul>
  <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
    <strong className="text-primary font-semibold">重要提示</strong>：WebGL 需要通过 HTTP 协议访问，不能直接打开 HTML 文件（file:// 协议）。必须使用本地服务器运行项目。
  </p>
</section>

<section className="mb-12">
  <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">第一步：创建 HTML 文件</h2>
  <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
    首先，创建一个基本的 HTML 文件。这是所有 WebGL 项目的起点。
  </p>
  <CodeBlock title="index.html" language="html" code={`<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WebGL 项目</title>
</head>
<body>
  <canvas id="glCanvas" width="800" height="600"></canvas>
</body>
</html>`} />
  <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
    关键点：
  </p>
  <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
    <li className="flex items-center gap-2">
      <code className="px-1 py-0.5 bg-dark-surface dark:bg-dark-surface bg-light-surface rounded text-sm">&lt;canvas&gt;</code> 元素是 WebGL 的渲染目标
    </li>
    <li className="flex items-center gap-2">
      <code className="px-1 py-0.5 bg-dark-surface dark:bg-dark-surface bg-light-surface rounded text-sm">id</code> 属性用于在 JavaScript 中获取 canvas 元素
    </li>
    <li className="flex items-center gap-2">
      <code className="px-1 py-0.5 bg-dark-surface dark:bg-dark-surface bg-light-surface rounded text-sm">width</code> 和 <code className="px-1 py-0.5 bg-dark-surface dark:bg-dark-surface bg-light-surface rounded text-sm">height</code> 属性设置画布尺寸（像素）
    </li>
    <li className="flex items-center gap-2">
      注意：不要使用 CSS 来设置 canvas 尺寸，这会导致渲染问题
    </li>
  </ul>
</section>

<section className="mb-12">
  <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">实际示例</h2>
  <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
    下面是一个可以运行的示例。这个示例展示了如何创建 canvas 并获取 WebGL 上下文，然后清除画布显示背景色。
  </p>
  <FlipCard
    width={400}
    height={300}
    onInit={(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement) => {
      // 设置视口
            gl.viewport(0, 0, canvas.width, canvas.height)
            
            // 设置清除颜色为深蓝色
            gl.clearColor(0.1, 0.2, 0.3, 1.0)
            
            // 清除画布
            gl.clear(gl.COLOR_BUFFER_BIT)
            
            // 在控制台输出 WebGL2 信息
            console.log('WebGL 版本:', gl.getParameter(gl.VERSION))
            console.log('着色器语言版本:', gl.getParameter(gl.SHADING_LANGUAGE_VERSION))
            console.log('渲染器:', gl.getParameter(gl.RENDERER))
            console.log('供应商:', gl.getParameter(gl.VENDOR))
    }}
    codeBlocks={[
    { title: "JavaScript 代码", code: `// 设置视口
    gl.viewport(0, 0, canvas.width, canvas.height)
    
    // 设置清除颜色为深蓝色
    gl.clearColor(0.1, 0.2, 0.3, 1.0)
    
    // 清除画布
    gl.clear(gl.COLOR_BUFFER_BIT)
    
    // 在控制台输出 WebGL2 信息
    console.log('WebGL 版本:', gl.getParameter(gl.VERSION))
    console.log('着色器语言版本:', gl.getParameter(gl.SHADING_LANGUAGE_VERSION))
    console.log('渲染器:', gl.getParameter(gl.RENDERER))
    console.log('供应商:', gl.getParameter(gl.VENDOR))`, language: "javascript" }
    ]}
  />
</section>
      
      <footer className="mt-12 pt-6 border-t border-dark-border dark:border-dark-border border-light-border">
        <p className="text-sm text-dark-text-muted dark:text-dark-text-muted text-light-text-muted">
          最后更新：{metadata.modified.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </footer>
      
      <ChapterNavigation />
    </div>
  )
}
