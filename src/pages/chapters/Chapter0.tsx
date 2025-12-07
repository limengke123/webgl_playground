import WebGLCanvas from '../../components/WebGLCanvas'
import CodeBlock from '../../components/CodeBlock'
import ChapterNavigation from '../../components/ChapterNavigation'

export default function Chapter0() {
  return (
    <div className="w-full">
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
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">获取 WebGL2 上下文</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          WebGL2 是现代 WebGL 的标准版本，提供了更多高级功能和更好的性能。本教程使用 WebGL2。
        </p>
        <CodeBlock title="获取 WebGL2 上下文" language="javascript" code={`// 获取 canvas 元素
const canvas = document.getElementById('glCanvas')

// 获取 WebGL2 上下文
const gl = canvas.getContext('webgl2')

// 检查是否成功获取上下文
if (!gl) {
  alert('您的浏览器不支持 WebGL2！请使用现代浏览器（Chrome 56+, Firefox 51+, Safari 15.2+, Edge 79+）')
  console.error('无法创建 WebGL2 上下文')
} else {
  // 检查 WebGL 版本
  const version = gl.getParameter(gl.VERSION)
  console.log('WebGL 版本:', version) // 输出: "WebGL 2.0"
}`} />
        
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">getContext()</strong> 方法说明：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">参数</strong>：
            <ul className="mt-2 pl-6">
              <li><code>'webgl2'</code>：获取 WebGL2 上下文（返回 WebGL2RenderingContext）</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">返回值</strong>：WebGL2RenderingContext 对象，如果失败则返回 <code>null</code></li>
          <li><strong className="text-primary font-semibold">兼容性</strong>：
            <ul className="mt-2 pl-6">
              <li>WebGL2：现代浏览器都支持（Chrome 56+, Firefox 51+, Safari 15.2+, Edge 79+）</li>
              <li>如果浏览器不支持 WebGL2，会返回 null，需要提示用户更新浏览器</li>
            </ul>
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">完整的初始化代码</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          下面是一个完整的 WebGL2 初始化示例，包含错误处理和基本设置。
        </p>
        
        <CodeBlock title="main.js - 完整的初始化代码（WebGL2）" language="javascript" code={`// 等待 DOM 加载完成
window.addEventListener('DOMContentLoaded', () => {
  // 1. 获取 canvas 元素
  const canvas = document.getElementById('glCanvas')
  
  if (!canvas) {
    console.error('找不到 canvas 元素！')
    return
  }
  
  // 2. 获取 WebGL2 上下文
  const gl = canvas.getContext('webgl2')
  
  // 3. 检查是否成功获取上下文
  if (!gl) {
    alert('您的浏览器不支持 WebGL2！请使用现代浏览器（Chrome 56+, Firefox 51+, Safari 15.2+, Edge 79+）')
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
  
  // 现在 WebGL2 已经初始化完成！
  console.log('WebGL2 初始化成功！')
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
 * 初始化 WebGL2 上下文
 * @param {HTMLCanvasElement} canvas - Canvas 元素
 * @returns {WebGL2RenderingContext|null} WebGL2 上下文，失败返回 null
 */
function initWebGL(canvas) {
  // 检查 canvas 元素是否存在
  if (!canvas) {
    console.error('Canvas 元素不存在')
    return null
  }
  
  // 尝试获取 WebGL2 上下文
  let gl = null
  try {
    gl = canvas.getContext('webgl2')
  } catch (e) {
    console.error('创建 WebGL2 上下文时出错:', e)
    return null
  }
  
  // 检查是否成功获取上下文
  if (!gl) {
    console.error('无法创建 WebGL2 上下文。可能的原因：')
    console.error('1. 浏览器不支持 WebGL2')
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
      <h2>WebGL2 不可用</h2>
      <p>您的浏览器或设备不支持 WebGL2。</p>
      <p>请尝试：</p>
      <ul>
        <li>更新浏览器到最新版本（Chrome 56+, Firefox 51+, Safari 15.2+, Edge 79+）</li>
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
  
  console.log('WebGL2 初始化成功！')
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
        
        <WebGLCanvas width={400} height={300} onInit={(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement) => {
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
        }} />
        
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          上面的示例展示了最基本的 WebGL2 初始化。虽然还没有绘制任何图形，但你已经成功创建了 WebGL2 上下文并设置了背景色。
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

// 获取 WebGL2 上下文时可以传入配置选项
const gl = canvas.getContext('webgl2', {
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
const gl = canvas.getContext('webgl2', {
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
 * 检查浏览器是否支持 WebGL2
 * @returns {boolean} 是否支持 WebGL2
 */
function isWebGL2Supported() {
  try {
    // 创建一个临时的 canvas 元素
    const canvas = document.createElement('canvas')
    
    // 尝试获取 WebGL2 上下文
    const gl = canvas.getContext('webgl2')
    
    // 如果成功获取上下文，说明支持 WebGL2
    return !!gl
  } catch (e) {
    return false
  }
}

// 使用示例
if (isWebGL2Supported()) {
  console.log('浏览器支持 WebGL2！')
  // 继续初始化 WebGL2
} else {
  console.error('浏览器不支持 WebGL2')
  // 显示错误信息或使用替代方案
}

// 或者更详细的检查
function getWebGL2Info() {
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl2')
  
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
const info = getWebGL2Info()
if (info) {
  console.log('WebGL2 信息:', info)
} else {
  console.error('无法获取 WebGL2 信息')
}`} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">WebGL 项目结构</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          一个典型的 WebGL 项目包含以下核心组件。理解项目结构有助于更好地组织代码。
        </p>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">基础项目结构</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          对于初学者，建议使用以下简单的项目结构：
        </p>
        
        <CodeBlock title="基础项目结构" language="plaintext" code={`webgl-project/
├── index.html          # HTML 文件（入口文件）
├── main.js            # 主 JavaScript 文件（WebGL 逻辑）
├── shaders/           # 着色器文件目录
│   ├── vertex.glsl    # 顶点着色器
│   └── fragment.glsl  # 片段着色器
├── textures/          # 纹理资源目录（可选）
│   └── texture.jpg
├── utils/             # 工具函数目录（可选）
│   └── webgl.js       # WebGL 辅助函数
└── README.md          # 项目说明`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">现代项目结构（使用构建工具）</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          对于更复杂的项目，推荐使用现代前端工具。这些工具提供了更好的开发体验和性能优化：
        </p>
        
        <CodeBlock title="使用 Vite + TypeScript 的项目结构" language="plaintext" code={`webgl-project/
├── index.html              # HTML 入口文件
├── package.json            # 项目配置和依赖
├── vite.config.ts          # Vite 配置文件
├── tsconfig.json           # TypeScript 配置
├── src/
│   ├── main.ts             # 主入口文件
│   ├── App.tsx             # 应用组件（如果使用 React）
│   ├── components/         # 组件目录
│   │   └── WebGLCanvas.tsx
│   ├── shaders/            # 着色器文件
│   │   ├── vertex.glsl
│   │   └── fragment.glsl
│   ├── utils/              # 工具函数
│   │   └── webgl.ts
│   └── types/              # TypeScript 类型定义
│       └── webgl.d.ts
├── public/                 # 静态资源
│   └── textures/
└── README.md`} />
        
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">推荐的现代工具</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">Vite</strong>：
            <ul className="mt-2 pl-6">
              <li>快速的构建工具，支持热更新（HMR）</li>
              <li>开箱即用的 TypeScript 支持</li>
              <li>支持导入 GLSL 文件作为字符串</li>
              <li>非常适合 WebGL 项目</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">Webpack</strong>：
            <ul className="mt-2 pl-6">
              <li>功能强大的模块打包器</li>
              <li>需要配置 loader 来处理 GLSL 文件</li>
              <li>适合大型项目</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">TypeScript</strong>：
            <ul className="mt-2 pl-6">
              <li>提供类型安全，减少错误</li>
              <li>更好的 IDE 支持</li>
              <li>适合大型项目</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">React/Vue</strong>：
            <ul className="mt-2 pl-6">
              <li>如果需要构建交互式 UI</li>
              <li>可以封装 WebGL 组件</li>
              <li>便于管理状态和交互</li>
            </ul>
          </li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">WebGL 项目的核心组件</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          一个完整的 WebGL 项目通常包含以下核心组件：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">Canvas 元素</strong>：WebGL 的渲染目标</li>
          <li><strong className="text-primary font-semibold">WebGL 上下文</strong>：所有 WebGL API 的入口</li>
          <li><strong className="text-primary font-semibold">着色器程序</strong>：顶点着色器和片段着色器</li>
          <li><strong className="text-primary font-semibold">缓冲区</strong>：存储顶点数据、索引数据等</li>
          <li><strong className="text-primary font-semibold">纹理</strong>：图像数据（可选）</li>
          <li><strong className="text-primary font-semibold">渲染循环</strong>：使用 requestAnimationFrame 实现动画</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">如何使用 WebGL 项目</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          理解 WebGL 项目的使用流程对于开发非常重要。下面介绍典型的 WebGL 项目开发流程。
        </p>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">开发流程</h3>
        <ol className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">初始化</strong>：
            <ul className="mt-2 pl-6">
              <li>创建或获取 Canvas 元素</li>
              <li>获取 WebGL 上下文</li>
              <li>设置视口和清除颜色</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">准备数据</strong>：
            <ul className="mt-2 pl-6">
              <li>定义顶点数据（位置、颜色、纹理坐标等）</li>
              <li>创建缓冲区并上传数据到 GPU</li>
              <li>加载纹理（如果需要）</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">创建着色器</strong>：
            <ul className="mt-2 pl-6">
              <li>编写或加载顶点着色器代码</li>
              <li>编写或加载片段着色器代码</li>
              <li>编译着色器并创建着色器程序</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">设置渲染状态</strong>：
            <ul className="mt-2 pl-6">
              <li>启用/禁用深度测试、混合等</li>
              <li>设置 uniform 变量（变换矩阵、颜色等）</li>
              <li>绑定纹理和缓冲区</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">渲染</strong>：
            <ul className="mt-2 pl-6">
              <li>清除画布</li>
              <li>使用着色器程序</li>
              <li>绘制图元（三角形、线条等）</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">动画循环</strong>：
            <ul className="mt-2 pl-6">
              <li>使用 requestAnimationFrame 创建动画循环</li>
              <li>在每帧更新数据（位置、旋转等）</li>
              <li>重新渲染</li>
            </ul>
          </li>
        </ol>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">典型的 WebGL 应用结构</h3>
        <CodeBlock title="典型的 WebGL 应用结构" language="javascript" code={`// main.js - 典型的 WebGL 应用结构

// 1. 初始化
function init() {
  const canvas = document.getElementById('glCanvas');
  const gl = canvas.getContext('webgl2');
  
  if (!gl) {
    console.error('WebGL2 不可用');
    return;
  }
  
  // 设置视口
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.1, 0.1, 0.1, 1.0);
  
  return { gl, canvas };
}

// 2. 加载着色器
async function loadShaders() {
  const vertexShaderSource = await loadShaderFile('shaders/vertex.glsl');
  const fragmentShaderSource = await loadShaderFile('shaders/fragment.glsl');
  
  return { vertexShaderSource, fragmentShaderSource };
}

// 3. 创建着色器程序
function createShaderProgram(gl, vertexSource, fragmentSource) {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('着色器程序链接失败:', gl.getProgramInfoLog(program));
    return null;
  }
  
  return program;
}

// 4. 准备数据
function setupBuffers(gl) {
  // 顶点位置
  const positions = [
    -0.5, -0.5,
     0.5, -0.5,
     0.5,  0.5,
    -0.5,  0.5
  ];
  
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  
  return { positionBuffer };
}

// 5. 渲染函数
function render(gl, program, buffers) {
  gl.clear(gl.COLOR_BUFFER_BIT);
  
  gl.useProgram(program);
  
  // 设置顶点属性
  const positionLocation = gl.getAttribLocation(program, 'a_position');
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionBuffer);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  
  // 绘制
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

// 6. 主函数
async function main() {
  const { gl, canvas } = init();
  if (!gl) return;
  
  const { vertexShaderSource, fragmentShaderSource } = await loadShaders();
  const program = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource);
  if (!program) return;
  
  const buffers = setupBuffers(gl);
  
  // 渲染循环
  function animate() {
    render(gl, program, buffers);
    requestAnimationFrame(animate);
  }
  
  animate();
}

// 启动应用
main();`} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">GLSL 文件的引用和使用</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          GLSL（OpenGL Shading Language）着色器代码需要以字符串形式传递给 WebGL。
          有多种方式可以引用和使用 GLSL 文件，选择合适的方式可以提高开发效率。
        </p>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">方法一：直接在 JavaScript 中定义（最简单）</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          对于简单的项目或学习用途，可以直接在 JavaScript 中将 GLSL 代码定义为字符串。
        </p>
        <CodeBlock title="直接在 JavaScript 中定义 GLSL" language="javascript" code={`// main.js

// 顶点着色器代码
const vertexShaderSource = \`
attribute vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
\`;

// 片段着色器代码
const fragmentShaderSource = \`
precision mediump float;

void main() {
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // 红色
}
\`;

// 使用着色器
function createShaderProgram(gl, vertexSource, fragmentSource) {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  // ... 创建程序
}

// 优点：
// - 简单直接，不需要额外配置
// - 适合学习和简单项目
// - 不需要构建工具

// 缺点：
// - 代码可读性差（字符串中缺少语法高亮）
// - 难以维护（特别是长代码）
// - 不支持代码复用`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">方法二：使用模板字符串和外部文件（推荐用于简单项目）</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          将 GLSL 代码保存在独立的 .glsl 文件中，然后使用 fetch 或 import 加载。
        </p>
        <CodeBlock title="使用 fetch 加载 GLSL 文件" language="javascript" code={`// shaders/vertex.glsl
attribute vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}

// shaders/fragment.glsl
precision mediump float;

void main() {
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}

// main.js - 使用 fetch 加载
async function loadShaderFile(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(\`无法加载着色器文件: \${url}\`);
    }
    return await response.text();
  } catch (error) {
    console.error('加载着色器文件失败:', error);
    throw error;
  }
}

// 使用示例
async function init() {
  const vertexShaderSource = await loadShaderFile('shaders/vertex.glsl');
  const fragmentShaderSource = await loadShaderFile('shaders/fragment.glsl');
  
  // 创建着色器程序
  const program = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource);
}

// 优点：
// - GLSL 代码有语法高亮（在编辑器中）
// - 代码分离，易于维护
// - 可以复用着色器代码

// 缺点：
// - 需要 HTTP 服务器（不能直接打开文件）
// - 需要处理异步加载`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">方法三：使用 Vite 导入（推荐用于现代项目）</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          如果使用 Vite 作为构建工具，可以配置 GLSL 文件导入。Vite 支持通过插件将 GLSL 文件作为字符串导入。
        </p>
        <CodeBlock title="配置 Vite 支持 GLSL 导入" language="javascript" code={`// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  assetsInclude: ['**/*.glsl'],  // 将 .glsl 文件视为资源
});

// 或者使用插件（推荐）
// npm install vite-plugin-glsl
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  plugins: [glsl()],
});

// main.js 或 main.ts - 直接导入 GLSL 文件
import vertexShaderSource from './shaders/vertex.glsl?raw';
import fragmentShaderSource from './shaders/fragment.glsl?raw';

// 或者使用默认导入
import vertexShaderSource from './shaders/vertex.glsl';
import fragmentShaderSource from './shaders/fragment.glsl';

// 使用着色器
const program = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource);

// 优点：
// - 类型安全（如果使用 TypeScript）
// - 语法高亮和代码提示
// - 构建时处理，性能好
// - 支持热更新（HMR）

// 缺点：
// - 需要配置构建工具
// - 需要安装插件`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">方法四：使用 Webpack loader（适用于 Webpack 项目）</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          如果使用 Webpack，可以配置 loader 来处理 GLSL 文件。
        </p>
        <CodeBlock title="配置 Webpack GLSL Loader" language="javascript" code={`// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\\.glsl$/,
        use: 'raw-loader'  // 或 'glsl-loader'
      }
    ]
  }
};

// 安装 loader
// npm install --save-dev raw-loader

// main.js - 导入 GLSL 文件
import vertexShaderSource from './shaders/vertex.glsl';
import fragmentShaderSource from './shaders/fragment.glsl';

// 使用着色器
const program = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource);`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">方法五：使用 TypeScript 和类型定义</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          如果使用 TypeScript，可以添加类型定义文件来获得更好的类型支持。
        </p>
        <CodeBlock title="TypeScript 类型定义" language="typescript" code={`// types/glsl.d.ts - 声明 GLSL 模块类型
declare module '*.glsl' {
  const content: string;
  export default content;
}

declare module '*.vert' {
  const content: string;
  export default content;
}

declare module '*.frag' {
  const content: string;
  export default content;
}

// main.ts - 使用类型安全的导入
import vertexShaderSource from './shaders/vertex.glsl';
import fragmentShaderSource from './shaders/fragment.glsl';

// TypeScript 现在知道这些是字符串类型
function createShaderProgram(
  gl: WebGL2RenderingContext,
  vertexSource: string,
  fragmentSource: string
): WebGLProgram {
  // ...
}

const program = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource);`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">方法六：使用 script 标签（不推荐）</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          也可以使用 script 标签加载 GLSL 代码，但这种方式不推荐，因为难以维护。
        </p>
        <CodeBlock title="使用 script 标签（不推荐）" language="html" code={`<!-- index.html -->
<script type="x-shader/x-vertex" id="vertex-shader">
attribute vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
</script>

<script type="x-shader/x-fragment" id="fragment-shader">
precision mediump float;

void main() {
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
</script>

<!-- main.js -->
const vertexShaderSource = document.getElementById('vertex-shader').textContent;
const fragmentShaderSource = document.getElementById('fragment-shader').textContent;`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">推荐方案总结</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">根据项目类型选择</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">学习/简单项目</strong>：
            <ul className="mt-2 pl-6">
              <li>直接在 JavaScript 中定义（方法一）</li>
              <li>或使用 fetch 加载（方法二）</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">现代项目（Vite）</strong>：
            <ul className="mt-2 pl-6">
              <li>使用 Vite 导入（方法三）</li>
              <li>配合 TypeScript 使用（方法五）</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">Webpack 项目</strong>：
            <ul className="mt-2 pl-6">
              <li>使用 Webpack loader（方法四）</li>
            </ul>
          </li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">实际示例：完整的着色器加载函数</h3>
        <CodeBlock title="完整的着色器加载和编译函数" language="javascript" code={`/**
 * 加载着色器文件
 * @param {string} url - 着色器文件路径
 * @returns {Promise<string>} 着色器源代码
 */
async function loadShaderFile(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(\`HTTP 错误! 状态: \${response.status}\`);
    }
    return await response.text();
  } catch (error) {
    console.error(\`加载着色器文件失败: \${url}\`, error);
    throw error;
  }
}

/**
 * 编译着色器
 * @param {WebGL2RenderingContext} gl - WebGL2 上下文
 * @param {number} type - 着色器类型（gl.VERTEX_SHADER 或 gl.FRAGMENT_SHADER）
 * @param {string} source - 着色器源代码
 * @returns {WebGLShader} 编译后的着色器
 */
function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const error = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(\`着色器编译错误: \${error}\`);
  }
  
  return shader;
}

/**
 * 创建着色器程序
 * @param {WebGL2RenderingContext} gl - WebGL2 上下文
 * @param {string} vertexSource - 顶点着色器源代码
 * @param {string} fragmentSource - 片段着色器源代码
 * @returns {WebGLProgram} 着色器程序
 */
function createShaderProgram(gl, vertexSource, fragmentSource) {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const error = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    throw new Error(\`着色器程序链接错误: \${error}\`);
  }
  
  // 清理（着色器已附加到程序，可以删除）
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  
  return program;
}

/**
 * 从文件加载并创建着色器程序
 * @param {WebGL2RenderingContext} gl - WebGL2 上下文
 * @param {string} vertexUrl - 顶点着色器文件路径
 * @param {string} fragmentUrl - 片段着色器文件路径
 * @returns {Promise<WebGLProgram>} 着色器程序
 */
async function loadShaderProgram(gl, vertexUrl, fragmentUrl) {
  const [vertexSource, fragmentSource] = await Promise.all([
    loadShaderFile(vertexUrl),
    loadShaderFile(fragmentUrl)
  ]);
  
  return createShaderProgram(gl, vertexSource, fragmentSource);
}

// 使用示例
async function init() {
  const canvas = document.getElementById('glCanvas');
  const gl = canvas.getContext('webgl2');
  
  if (!gl) {
    console.error('WebGL2 不可用');
    return;
  }
  
  // 加载着色器程序
  const program = await loadShaderProgram(
    gl,
    'shaders/vertex.glsl',
    'shaders/fragment.glsl'
  );
  
  // 使用程序进行渲染
  gl.useProgram(program);
  // ...
}`} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">总结</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          本章我们学习了如何从零开始创建一个 WebGL 项目，包括项目结构、使用方法和 GLSL 文件的引用：
        </p>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">核心知识点</h3>
        <ol className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">创建 HTML 文件</strong>：包含 canvas 元素</li>
          <li><strong className="text-primary font-semibold">获取 canvas 元素</strong>：通过 DOM API 获取</li>
          <li><strong className="text-primary font-semibold">获取 WebGL2 上下文</strong>：使用 <code>getContext('webgl2')</code></li>
          <li><strong className="text-primary font-semibold">错误处理</strong>：检查上下文是否成功创建</li>
          <li><strong className="text-primary font-semibold">基本设置</strong>：设置视口和清除颜色</li>
          <li><strong className="text-primary font-semibold">项目结构</strong>：组织代码和资源文件</li>
          <li><strong className="text-primary font-semibold">GLSL 文件引用</strong>：多种方式加载和使用着色器代码</li>
        </ol>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">WebGL 项目的特点</h3>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">需要 HTTP 服务器</strong>：不能直接打开 HTML 文件</li>
          <li><strong className="text-primary font-semibold">核心组件</strong>：Canvas、WebGL 上下文、着色器、缓冲区</li>
          <li><strong className="text-primary font-semibold">渲染流程</strong>：初始化 → 准备数据 → 创建着色器 → 渲染 → 动画循环</li>
          <li><strong className="text-primary font-semibold">GLSL 代码</strong>：以字符串形式传递给 WebGL API</li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">GLSL 文件引用方式选择</h3>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">学习/简单项目</strong>：直接在 JavaScript 中定义，或使用 fetch 加载</li>
          <li><strong className="text-primary font-semibold">Vite 项目</strong>：使用 import 导入，配合 TypeScript 使用</li>
          <li><strong className="text-primary font-semibold">Webpack 项目</strong>：配置 loader 处理 GLSL 文件</li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">下一步</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          现在你已经掌握了 WebGL 项目的基础设置和 GLSL 文件的使用方法。在下一章中，我们将学习：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>WebGL 的核心概念（顶点、片段、着色器等）</li>
          <li>如何编写顶点着色器和片段着色器</li>
          <li>如何创建和使用缓冲区</li>
          <li>绘制第一个三角形！</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          准备好开始你的 WebGL 之旅了吗？让我们继续学习！
        </p>
      </section>
      
      <ChapterNavigation />
    </div>
  )
}

