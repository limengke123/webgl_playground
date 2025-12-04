import WebGLCanvas from '../../components/WebGLCanvas'
import CodeBlock from '../../components/CodeBlock'
import ChapterNavigation from '../../components/ChapterNavigation'

export default function Chapter0() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl mb-8 text-primary border-b-2 border-dark-border dark:border-dark-border border-light-border pb-4">第零章：从零开始创建 WebGL 项目</h1>
      
      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">准备工作</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          在学习 WebGL 之前，我们需要先了解如何创建一个基本的 WebGL 项目。本章将手把手教你如何从零开始搭建一个 WebGL 项目。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          你需要准备：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">现代浏览器</strong>：Chrome、Firefox、Safari、Edge 等（支持 WebGL）</li>
          <li><strong className="text-primary font-semibold">代码编辑器</strong>：VS Code、WebStorm 等</li>
          <li><strong className="text-primary font-semibold">本地服务器</strong>：可以使用 VS Code 的 Live Server 插件，或者 Node.js 的 http-server</li>
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
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: Arial, sans-serif;
      background-color: #1a1a2e;
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    canvas {
      border: 1px solid #4a9eff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }
  </style>
</head>
<body>
  <h1>我的第一个 WebGL 项目</h1>
  <canvas id="glCanvas" width="800" height="600"></canvas>
  <script src="main.js"></script>
</body>
</html>`} />
        
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          关键点：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">&lt;canvas&gt;</strong> 元素是 WebGL 的渲染目标</li>
          <li><strong className="text-primary font-semibold">id</strong> 属性用于在 JavaScript 中获取 canvas 元素</li>
          <li><strong className="text-primary font-semibold">width</strong> 和 <strong className="text-primary font-semibold">height</strong> 属性设置画布尺寸（像素）</li>
          <li>注意：不要使用 CSS 来设置 canvas 尺寸，这会导致渲染问题</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">第二步：创建 Canvas 元素（JavaScript 方式）</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          除了在 HTML 中直接创建 canvas，我们也可以在 JavaScript 中动态创建。这种方式更灵活，适合动态应用。
        </p>
        
        <CodeBlock title="使用 JavaScript 创建 Canvas" language="javascript" code={`// 方法1：使用 document.createElement
const canvas = document.createElement('canvas')
canvas.width = 800
canvas.height = 600
canvas.id = 'glCanvas'

// 添加到页面中
document.body.appendChild(canvas)

// 方法2：使用 querySelector 获取已存在的 canvas
const canvas = document.querySelector('#glCanvas')

// 方法3：使用 getElementById
const canvas = document.getElementById('glCanvas')`} />
        
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">重要提示</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>确保在 DOM 加载完成后再获取 canvas 元素（使用 <code>DOMContentLoaded</code> 事件或将脚本放在 body 末尾）</li>
          <li>canvas 的宽高应该通过属性设置，而不是 CSS</li>
          <li>CSS 设置的宽高只会影响显示大小，不会改变实际渲染分辨率</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">第三步：获取 WebGL 上下文</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          获取 WebGL 上下文是使用 WebGL 的关键步骤。上下文（Context）是 WebGL 的"接口"，所有 WebGL 操作都通过它来完成。
        </p>
        
        <CodeBlock title="获取 WebGL 上下文" language="javascript" code={`// 获取 canvas 元素
const canvas = document.getElementById('glCanvas')

// 获取 WebGL 上下文
const gl = canvas.getContext('webgl')

// 如果浏览器不支持 'webgl'，尝试 'experimental-webgl'（旧版浏览器）
// const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')

// 检查是否成功获取上下文
if (!gl) {
  alert('您的浏览器不支持 WebGL！')
  // 或者显示错误信息
  console.error('无法创建 WebGL 上下文')
}`} />
        
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">getContext()</strong> 方法说明：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">参数</strong>：<code>'webgl'</code> 或 <code>'webgl2'</code>（WebGL 2.0）</li>
          <li><strong className="text-primary font-semibold">返回值</strong>：WebGLRenderingContext 对象，如果失败则返回 <code>null</code></li>
          <li><strong className="text-primary font-semibold">兼容性</strong>：旧版浏览器可能需要使用 <code>'experimental-webgl'</code></li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">完整的初始化代码</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          下面是一个完整的 WebGL 初始化示例，包含错误处理和基本设置。
        </p>
        
        <CodeBlock title="main.js - 完整的初始化代码" language="javascript" code={`// 等待 DOM 加载完成
window.addEventListener('DOMContentLoaded', () => {
  // 1. 获取 canvas 元素
  const canvas = document.getElementById('glCanvas')
  
  if (!canvas) {
    console.error('找不到 canvas 元素！')
    return
  }
  
  // 2. 获取 WebGL 上下文
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
  
  // 3. 检查是否成功获取上下文
  if (!gl) {
    alert('您的浏览器不支持 WebGL！请使用现代浏览器（Chrome、Firefox、Safari、Edge）')
    return
  }
  
  // 4. 设置视口（Viewport）
  // 视口定义了 WebGL 渲染区域的大小和位置
  gl.viewport(0, 0, canvas.width, canvas.height)
  
  // 5. 设置清除颜色（背景色）
  // 参数：R, G, B, A（范围 0.0 到 1.0）
  gl.clearColor(0.1, 0.1, 0.1, 1.0) // 深灰色背景
  
  // 6. 清除画布
  // COLOR_BUFFER_BIT 表示清除颜色缓冲区
  gl.clear(gl.COLOR_BUFFER_BIT)
  
  // 现在 WebGL 已经初始化完成！
  console.log('WebGL 初始化成功！')
  console.log('WebGL 版本:', gl.getParameter(gl.VERSION))
  console.log('着色器语言版本:', gl.getParameter(gl.SHADING_LANGUAGE_VERSION))
  console.log('最大纹理尺寸:', gl.getParameter(gl.MAX_TEXTURE_SIZE))
})`} />
        
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          代码解析：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">gl.viewport()</strong>：设置视口，告诉 WebGL 渲染区域的大小</li>
          <li><strong className="text-primary font-semibold">gl.clearColor()</strong>：设置清除颜色（背景色），使用 RGBA 格式</li>
          <li><strong className="text-primary font-semibold">gl.clear()</strong>：清除画布，使用之前设置的清除颜色</li>
          <li><strong className="text-primary font-semibold">gl.getParameter()</strong>：获取 WebGL 上下文的信息</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">错误处理最佳实践</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          良好的错误处理可以让你的代码更健壮，也更容易调试。下面是一个改进的初始化函数。
        </p>
        
        <CodeBlock title="带错误处理的初始化函数" language="javascript" code={`/**
 * 初始化 WebGL 上下文
 * @param {HTMLCanvasElement} canvas - Canvas 元素
 * @returns {WebGLRenderingContext|null} WebGL 上下文，失败返回 null
 */
function initWebGL(canvas) {
  // 检查 canvas 元素是否存在
  if (!canvas) {
    console.error('Canvas 元素不存在')
    return null
  }
  
  // 尝试获取 WebGL 上下文
  let gl = null
  try {
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
  } catch (e) {
    console.error('创建 WebGL 上下文时出错:', e)
    return null
  }
  
  // 检查是否成功获取上下文
  if (!gl) {
    console.error('无法创建 WebGL 上下文。可能的原因：')
    console.error('1. 浏览器不支持 WebGL')
    console.error('2. GPU 驱动过旧')
    console.error('3. WebGL 被禁用')
    
    // 显示用户友好的错误信息
    const errorDiv = document.createElement('div')
    errorDiv.style.cssText = \`
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #ff4444;
      color: white;
      padding: 20px;
      border-radius: 8px;
      z-index: 10000;
    \`
    errorDiv.innerHTML = \`
      <h2>WebGL 不可用</h2>
      <p>您的浏览器或设备不支持 WebGL。</p>
      <p>请尝试：</p>
      <ul>
        <li>更新浏览器到最新版本</li>
        <li>更新 GPU 驱动程序</li>
        <li>检查浏览器设置中是否禁用了 WebGL</li>
      </ul>
    \`
    document.body.appendChild(errorDiv)
    
    return null
  }
  
  // 设置视口
  gl.viewport(0, 0, canvas.width, canvas.height)
  
  // 设置清除颜色
  gl.clearColor(0.1, 0.1, 0.1, 1.0)
  
  // 清除画布
  gl.clear(gl.COLOR_BUFFER_BIT)
  
  console.log('WebGL 初始化成功！')
  return gl
}

// 使用示例
window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('glCanvas')
  const gl = initWebGL(canvas)
  
  if (gl) {
    // WebGL 初始化成功，可以开始绘制了
    console.log('可以开始使用 WebGL 了！')
  }
})`} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">实际示例</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          下面是一个可以运行的示例。这个示例展示了如何创建 canvas 并获取 WebGL 上下文，然后清除画布显示背景色。
        </p>
        
        <WebGLCanvas width={400} height={300} onInit={(gl: WebGLRenderingContext, canvas: HTMLCanvasElement) => {
          // 设置视口
          gl.viewport(0, 0, canvas.width, canvas.height)
          
          // 设置清除颜色为深蓝色
          gl.clearColor(0.1, 0.2, 0.3, 1.0)
          
          // 清除画布
          gl.clear(gl.COLOR_BUFFER_BIT)
          
          // 在控制台输出 WebGL 信息
          console.log('WebGL 版本:', gl.getParameter(gl.VERSION))
          console.log('着色器语言版本:', gl.getParameter(gl.SHADING_LANGUAGE_VERSION))
          console.log('渲染器:', gl.getParameter(gl.RENDERER))
          console.log('供应商:', gl.getParameter(gl.VENDOR))
        }} />
        
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          上面的示例展示了最基本的 WebGL 初始化。虽然还没有绘制任何图形，但你已经成功创建了 WebGL 上下文并设置了背景色。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          打开浏览器的开发者工具（F12），在控制台中可以看到 WebGL 的版本信息。
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">WebGL 上下文属性</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          在获取 WebGL 上下文时，可以传入一个配置对象来设置上下文属性。
        </p>
        
        <CodeBlock title="WebGL 上下文配置选项" language="javascript" code={`const canvas = document.getElementById('glCanvas')

// 获取 WebGL 上下文时可以传入配置选项
const gl = canvas.getContext('webgl', {
  // alpha: 是否使用透明背景，默认 false
  alpha: false,
  
  // depth: 是否启用深度缓冲区，默认 true
  depth: true,
  
  // stencil: 是否启用模板缓冲区，默认 false
  stencil: false,
  
  // antialias: 是否启用抗锯齿，默认 true
  antialias: true,
  
  // premultipliedAlpha: 是否预乘 alpha，默认 true
  premultipliedAlpha: true,
  
  // preserveDrawingBuffer: 是否保留绘制缓冲区，默认 false
  // 如果为 true，canvas 的内容不会被清除，可以用于截图等
  preserveDrawingBuffer: false,
  
  // failIfMajorPerformanceCaveat: 如果性能较差是否失败，默认 false
  failIfMajorPerformanceCaveat: false,
  
  // powerPreference: 性能偏好
  // 'default': 默认
  // 'high-performance': 高性能（可能更耗电）
  // 'low-power': 低功耗
  powerPreference: 'default'
})

// 常用配置示例
const gl = canvas.getContext('webgl', {
  alpha: false,           // 不透明背景
  depth: true,            // 启用深度测试
  antialias: true,        // 启用抗锯齿
  preserveDrawingBuffer: false  // 不保留绘制缓冲区（性能更好）
})`} />
        
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          配置说明：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">alpha</strong>：如果设置为 <code>true</code>，canvas 背景可以是透明的</li>
          <li><strong className="text-primary font-semibold">antialias</strong>：抗锯齿可以让图形边缘更平滑，但会消耗更多性能</li>
          <li><strong className="text-primary font-semibold">preserveDrawingBuffer</strong>：如果需要在绘制后读取像素或截图，设置为 <code>true</code></li>
          <li><strong className="text-primary font-semibold">powerPreference</strong>：移动设备上可以控制功耗</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">检查 WebGL 支持</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          在尝试使用 WebGL 之前，可以先检查浏览器是否支持 WebGL。
        </p>
        
        <CodeBlock title="检查 WebGL 支持" language="javascript" code={`/**
 * 检查浏览器是否支持 WebGL
 * @returns {boolean} 是否支持 WebGL
 */
function isWebGLSupported() {
  try {
    // 创建一个临时的 canvas 元素
    const canvas = document.createElement('canvas')
    
    // 尝试获取 WebGL 上下文
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    
    // 如果成功获取上下文，说明支持 WebGL
    return !!gl
  } catch (e) {
    return false
  }
}

// 使用示例
if (isWebGLSupported()) {
  console.log('浏览器支持 WebGL！')
  // 继续初始化 WebGL
} else {
  console.error('浏览器不支持 WebGL')
  // 显示错误信息或使用替代方案
}

// 或者更详细的检查
function getWebGLInfo() {
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
  
  if (!gl) {
    return null
  }
  
  return {
    version: gl.getParameter(gl.VERSION),
    shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
    vendor: gl.getParameter(gl.VENDOR),
    renderer: gl.getParameter(gl.RENDERER),
    maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
    maxVertexAttribs: gl.getParameter(gl.MAX_VERTEX_ATTRIBS),
    maxViewportDims: gl.getParameter(gl.MAX_VIEWPORT_DIMS)
  }
}

// 使用示例
const info = getWebGLInfo()
if (info) {
  console.log('WebGL 信息:', info)
} else {
  console.error('无法获取 WebGL 信息')
}`} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">项目结构建议</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          对于初学者，建议使用以下简单的项目结构：
        </p>
        
        <CodeBlock title="项目结构" language="plaintext" code={`webgl-project/
├── index.html          # HTML 文件
├── main.js            # 主 JavaScript 文件
├── shaders/           # 着色器文件（可选）
│   ├── vertex.glsl    # 顶点着色器
│   └── fragment.glsl  # 片段着色器
└── README.md          # 项目说明`} />
        
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          对于更复杂的项目，可以使用现代前端工具：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">Vite</strong>：快速的构建工具，支持热更新</li>
          <li><strong className="text-primary font-semibold">Webpack</strong>：功能强大的模块打包器</li>
          <li><strong className="text-primary font-semibold">TypeScript</strong>：提供类型安全</li>
          <li><strong className="text-primary font-semibold">React/Vue</strong>：如果需要构建交互式应用</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">总结</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          本章我们学习了如何从零开始创建一个 WebGL 项目：
        </p>
        <ol className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">创建 HTML 文件</strong>：包含 canvas 元素</li>
          <li><strong className="text-primary font-semibold">获取 canvas 元素</strong>：通过 DOM API 获取</li>
          <li><strong className="text-primary font-semibold">获取 WebGL 上下文</strong>：使用 <code>getContext('webgl')</code></li>
          <li><strong className="text-primary font-semibold">错误处理</strong>：检查上下文是否成功创建</li>
          <li><strong className="text-primary font-semibold">基本设置</strong>：设置视口和清除颜色</li>
        </ol>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          现在你已经掌握了 WebGL 项目的基础设置。在下一章中，我们将学习 WebGL 的核心概念，并绘制第一个三角形！
        </p>
      </section>
      
      <ChapterNavigation />
    </div>
  )
}

