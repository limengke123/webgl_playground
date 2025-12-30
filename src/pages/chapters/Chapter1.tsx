import WebGLCanvas from '../../components/WebGLCanvas'
import CodeBlock from '../../components/CodeBlock'
import FlipCard from '../../components/FlipCard'
import ChapterNavigation from '../../components/ChapterNavigation'

// 自动生成的元数据
export const metadata = {
  title: "第一章：WebGL 基础",
  description: "学习 WebGL 的基本概念，绘制第一个三角形，了解着色器的工作原理",
  order: 1,
  path: "/chapter/1",
  created: new Date("2025-12-30T09:47:35.007Z"),
  modified: new Date("2025-12-30T09:48:10.730Z"),
  size: 16113,
  keywords: ["webgl基础","三角形","着色器","shader","顶点着色器","片段着色器","渲染管线","缓冲区","buffer","attribute","uniform","varying","坐标系统","绘制模式"]
}

export default function Chapter1() {
  return (
    <div className="w-full">
      <h1 className="text-4xl mb-8 text-primary border-b-2 border-dark-border dark:border-dark-border border-light-border pb-4">
        {metadata.title}
      </h1>
      
<section className="mb-12">
  <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">什么是 WebGL？</h2>
  <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
    WebGL（Web Graphics Library）是一个 JavaScript API，用于在浏览器中渲染交互式 2D 和 3D 图形。WebGL2 基于 OpenGL ES 3.0，允许你直接使用 GPU 进行图形渲染。WebGL 不需要插件，在现代浏览器中都有原生支持。
  </p>
  <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
    WebGL 的核心优势：
  </p>
  <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">硬件加速</strong>：利用 GPU 的并行处理能力，性能远超 Canvas 2D
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">跨平台</strong>：在所有现代浏览器和移动设备上都能运行
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">强大的渲染能力</strong>：支持复杂的 3D 场景、光照、阴影等高级效果
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">可编程性</strong>：通过着色器完全控制渲染流程
    </li>
  </ul>
  <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
    WebGL 的核心概念包括：
  </p>
  <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">着色器（Shaders）</strong>：运行在 GPU 上的小程序，用于处理顶点和像素
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">缓冲区（Buffers）</strong>：存储顶点数据、颜色等信息的 GPU 内存
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">纹理（Textures）</strong>：用于存储图像数据
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">渲染管线（Pipeline）</strong>：从顶点数据到最终像素的渲染流程
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">上下文（Context）</strong>：WebGL 的渲染上下文，包含所有状态和函数
    </li>
  </ul>
</section>

<section className="mb-12">
  <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">WebGL 渲染管线</h2>
  <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
    WebGL 渲染管线是将 3D 场景转换为 2D 图像的过程。理解渲染管线对于掌握 WebGL 至关重要。
  </p>
  <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
    WebGL 渲染管线的主要阶段：
  </p>
  <ol className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5 list-decimal">
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">顶点数据输入</strong>：将顶点位置、颜色、纹理坐标等数据上传到 GPU 缓冲区
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">顶点着色器（Vertex Shader）</strong>：
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">图元装配（Primitive Assembly）</strong>：
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">光栅化（Rasterization）</strong>：
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">片段着色器（Fragment Shader）</strong>：
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">片段测试和混合</strong>：
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">帧缓冲区</strong>：最终图像写入帧缓冲区，显示在屏幕上
    </li>
  </ol>
  <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
    <strong className="text-primary font-semibold">重要提示</strong>：在 WebGL 中，我们主要控制顶点着色器和片段着色器，其他阶段由 GPU 自动处理。
  </p>
</section>

<section className="mb-12">
  <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">第一个三角形</h2>
  <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
    让我们从最简单的例子开始：绘制一个三角形。这是 WebGL 的&quot;Hello World&quot;。
  </p>
  <FlipCard
    width={400}
    height={400}
    onInit={(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement) => {
      const vertexShaderSource = `attribute vec2 a_position;
      
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }`
      
            const fragmentShaderSource = `
      precision mediump float;
      
      uniform vec4 u_color;
      
      void main() {
        gl_FragColor = u_color;
      }
      `
            
            const program = createProgram(gl, vertexShaderSource, fragmentShaderSource)
            const positions = [0, 0.5, -0.5, -0.5, 0.5, -0.5]
            const positionBuffer = createBuffer(gl, positions)
            const colorLocation = gl.getUniformLocation(program, 'u_color')
            
            gl.viewport(0, 0, canvas.width, canvas.height)
            gl.clearColor(0.1, 0.1, 0.1, 1.0)
            
            gl.clear(gl.COLOR_BUFFER_BIT)
            gl.useProgram(program)
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
            setAttribute(gl, program, 'a_position', 2)
            gl.uniform4f(colorLocation, 0.2, 0.6, 1.0, 1.0)
            gl.drawArrays(gl.TRIANGLES, 0, 3)
    }}
    codeBlocks={[
    { title: "顶点着色器", code: `attribute vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}`, language: "glsl" },
    { title: "片段着色器", code: `precision mediump float;

uniform vec4 u_color;

void main() {
  gl_FragColor = u_color;
}`, language: "glsl" }
    ]}
  />
  <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">代码解析</h3>
  <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">顶点着色器</strong>：接收顶点位置（a_position），设置 gl_Position
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">片段着色器</strong>：设置每个像素的颜色（gl_FragColor）
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">attribute</strong>：每个顶点不同的数据（如位置、颜色、纹理坐标）
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">uniform</strong>：所有顶点共享的数据（如颜色、变换矩阵）
    </li>
  </ul>
  <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">Attribute 和 Uniform 的区别</h3>
  <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
    理解 <code className="px-1 py-0.5 bg-dark-surface dark:bg-dark-surface bg-light-surface rounded text-sm">attribute</code> 和 <code className="px-1 py-0.5 bg-dark-surface dark:bg-dark-surface bg-light-surface rounded text-sm">uniform</code> 的区别是掌握 WebGL 的关键。它们是着色器中两种不同的输入变量类型。
  </p>
  <h4 className="text-xl my-6 text-dark-text dark:text-dark-text text-light-text">Attribute（属性变量）</h4>
  <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
    <strong className="text-primary font-semibold">定义</strong>：<code className="px-1 py-0.5 bg-dark-surface dark:bg-dark-surface bg-light-surface rounded text-sm">attribute</code> 是顶点着色器的输入变量，用于接收每个顶点不同的数据。
  </p>
  <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
    <strong className="text-primary font-semibold">特点</strong>：
  </p>
  <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">每个顶点都有不同的值</strong>：例如，3个顶点就有3个不同的位置值
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">只能在顶点着色器中使用</strong>：片段着色器无法直接访问 attribute
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">从缓冲区读取</strong>：数据存储在 GPU 缓冲区中，通过 <code className="px-1 py-0.5 bg-dark-surface dark:bg-dark-surface bg-light-surface rounded text-sm">gl.vertexAttribPointer()</code> 设置
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">执行频率</strong>：顶点着色器对每个顶点执行一次，所以每个顶点都会读取不同的 attribute 值
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">常见用途</strong>：顶点位置、顶点颜色、纹理坐标、法向量等
    </li>
  </ul>
  <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
    <strong className="text-primary font-semibold">示例</strong>：
  </p>
  <CodeBlock title="Attribute 示例" language="glsl" code={`// 顶点着色器
attribute vec2 a_position;  // 每个顶点有不同的位置
attribute vec3 a_color;      // 每个顶点有不同的颜色

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}

// JavaScript 代码
// 为每个顶点设置不同的位置
const positions = [
  0.0,  0.5,   // 顶点1的位置
  -0.5, -0.5,  // 顶点2的位置
  0.5,  -0.5   // 顶点3的位置
]
// 每个顶点都会读取对应的位置值`} />
  <h4 className="text-xl my-6 text-dark-text dark:text-dark-text text-light-text">Uniform（统一变量）</h4>
  <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
    <strong className="text-primary font-semibold">定义</strong>：<code className="px-1 py-0.5 bg-dark-surface dark:bg-dark-surface bg-light-surface rounded text-sm">uniform</code> 是所有顶点或片段共享的常量，在一次绘制调用中保持不变。
  </p>
  <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
    <strong className="text-primary font-semibold">特点</strong>：
  </p>
  <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">所有顶点/片段共享同一个值</strong>：在一次绘制调用中，uniform 的值对所有顶点和片段都相同
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">可以在顶点和片段着色器中使用</strong>：两个着色器都可以访问 uniform
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">通过 JavaScript 设置</strong>：使用 <code className="px-1 py-0.5 bg-dark-surface dark:bg-dark-surface bg-light-surface rounded text-sm">gl.uniform*()</code> 函数设置值
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">执行频率</strong>：虽然着色器对每个顶点/片段执行，但 uniform 的值在整个绘制过程中保持不变
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">可以随时修改</strong>：在每次绘制前可以改变 uniform 的值，但一次绘制中保持不变
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">常见用途</strong>：变换矩阵、时间、全局颜色、光照参数等
    </li>
  </ul>
  <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
    <strong className="text-primary font-semibold">示例</strong>：
  </p>
  <CodeBlock title="Uniform 示例" language="glsl" code={`// 片段着色器
precision mediump float;
uniform vec4 u_color;  // 所有片段共享同一个颜色

void main() {
  gl_FragColor = u_color;  // 所有像素都是同一个颜色
}

// JavaScript 代码
const colorLocation = gl.getUniformLocation(program, 'u_color')
gl.uniform4f(colorLocation, 0.2, 0.6, 1.0, 1.0)  // 设置一次，所有片段都使用这个颜色`} />
  <h4 className="text-xl my-6 text-dark-text dark:text-dark-text text-light-text">对比总结</h4>
  <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">precision mediump float 的意义</h3>
  <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
    在片段着色器中，你经常会看到第一行是 <code className="px-1 py-0.5 bg-dark-surface dark:bg-dark-surface bg-light-surface rounded text-sm">precision mediump float;</code>，这是 GLSL 的精度限定符声明。
  </p>
  <h4 className="text-xl my-6 text-dark-text dark:text-dark-text text-light-text">为什么需要精度声明？</h4>
  <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
    在 WebGL2（GLSL ES 3.00）中，虽然片段着色器中的 float 默认精度是 highp，但显式声明精度仍然是一个好习惯。使用 <code className="px-1 py-0.5 bg-dark-surface dark:bg-dark-surface bg-light-surface rounded text-sm">precision mediump float;</code> 可以在性能和精度之间取得平衡，适合大多数应用场景。
  </p>
  <h4 className="text-xl my-6 text-dark-text dark:text-dark-text text-light-text">精度级别</h4>
  <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
    GLSL 提供了三种精度级别：
  </p>
  <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">highp</strong>：高精度
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">mediump</strong>：中等精度（推荐）
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">lowp</strong>：低精度
    </li>
  </ul>
  <h4 className="text-xl my-6 text-dark-text dark:text-dark-text text-light-text">为什么使用 mediump？</h4>
  <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
    <code className="px-1 py-0.5 bg-dark-surface dark:bg-dark-surface bg-light-surface rounded text-sm">precision mediump float;</code> 是最常用的选择，原因如下：
  </p>
  <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">精度足够</strong>：16 位精度对于大多数颜色和纹理计算已经足够
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">性能良好</strong>：比 highp 快，比 lowp 精度高，是性能和精度的最佳平衡
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">兼容性好</strong>：所有支持 WebGL 的设备都支持 mediump
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">标准做法</strong>：这是 WebGL 开发中的标准实践
    </li>
  </ul>
  <h4 className="text-xl my-6 text-dark-text dark:text-dark-text text-light-text">使用示例</h4>
  <CodeBlock title="精度声明示例" language="glsl" code={`// ✅ 正确：声明了精度
precision mediump float;

uniform vec4 u_color;

void main() {
  gl_FragColor = u_color;
}

// ❌ 错误：没有声明精度
uniform vec4 u_color;

void main() {
  gl_FragColor = u_color;  // 编译错误：float 类型未定义精度
}

// 也可以为特定变量指定精度
precision mediump float;

highp float complexCalculation;  // 这个变量使用高精度
mediump vec3 color;              // 这个变量使用中等精度
lowp float simpleValue;          // 这个变量使用低精度`} />
  <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
    <strong className="text-primary font-semibold">重要提示</strong>：
  </p>
  <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
    <li className="flex items-center gap-2">
      顶点着色器不需要声明精度，因为顶点着色器中的 <code className="px-1 py-0.5 bg-dark-surface dark:bg-dark-surface bg-light-surface rounded text-sm">float</code> 默认是 <code className="px-1 py-0.5 bg-dark-surface dark:bg-dark-surface bg-light-surface rounded text-sm">highp</code>
    </li>
    <li className="flex items-center gap-2">
      片段着色器必须声明精度，否则无法使用 <code className="px-1 py-0.5 bg-dark-surface dark:bg-dark-surface bg-light-surface rounded text-sm">float</code> 类型
    </li>
    <li className="flex items-center gap-2">
      如果没有特殊需求，始终使用 <code className="px-1 py-0.5 bg-dark-surface dark:bg-dark-surface bg-light-surface rounded text-sm">precision mediump float;</code> 是最安全的选择
    </li>
    <li className="flex items-center gap-2">
      精度声明应该放在片段着色器的最开始，在任何变量声明之前
    </li>
  </ul>
</section>

<section className="mb-12">
  <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">彩色三角形</h2>
  <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
    现在让我们为每个顶点添加不同的颜色，看看 WebGL 如何插值颜色。
  </p>
  <FlipCard
    width={400}
    height={400}
    onInit={(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement) => {
      const vertexShader = `
              attribute vec2 a_position;
              attribute vec3 a_color;
              varying vec3 v_color;
              
              void main() {
                gl_Position = vec4(a_position, 0.0, 1.0);
                v_color = a_color;
              }
            `
            
            const fragmentShader = `
              precision mediump float;
              varying vec3 v_color;
              
              void main() {
                gl_FragColor = vec4(v_color, 1.0);
              }
            `
            
            const program = createProgram(gl, vertexShader, fragmentShader)
            
            const positions = [0, 0.5, -0.5, -0.5, 0.5, -0.5]
            const colors = [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]
            
            const positionBuffer = createBuffer(gl, positions)
            const colorBuffer = createBuffer(gl, colors)
            
            gl.viewport(0, 0, canvas.width, canvas.height)
            gl.clearColor(0.1, 0.1, 0.1, 1.0)
            
            gl.clear(gl.COLOR_BUFFER_BIT)
            gl.useProgram(program)
            
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
            setAttribute(gl, program, 'a_position', 2)
            
            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
            setAttribute(gl, program, 'a_color', 3)
            
            gl.drawArrays(gl.TRIANGLES, 0, 3)
    }}
    codeBlocks={[
    { title: "顶点着色器", code: `attribute vec2 a_position;
attribute vec3 a_color;
varying vec3 v_color;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_color = a_color;
}`, language: "glsl" },
    { title: "片段着色器", code: `precision mediump float;
varying vec3 v_color;

void main() {
  gl_FragColor = vec4(v_color, 1.0);
}`, language: "glsl" },
    { title: "JavaScript 代码", code: `// 顶点位置（3个顶点）
const positions = [0, 0.5, -0.5, -0.5, 0.5, -0.5]

// 顶点颜色（RGB，每个顶点一个颜色）
// 红色、绿色、蓝色
const colors = [
  1.0, 0.0, 0.0,  // 顶点1：红色
  0.0, 1.0, 0.0,  // 顶点2：绿色
  0.0, 0.0, 1.0   // 顶点3：蓝色
]

// 创建缓冲区
const positionBuffer = createBuffer(gl, positions)
const colorBuffer = createBuffer(gl, colors)

// 设置顶点位置属性
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
setAttribute(gl, program, 'a_position', 2)

// 设置顶点颜色属性
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
setAttribute(gl, program, 'a_color', 3)

// 绘制
gl.drawArrays(gl.TRIANGLES, 0, 3)`, language: "javascript" }
    ]}
  />
  <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
    注意观察三角形内部的颜色是如何平滑过渡的。这是因为 WebGL 在光栅化阶段会对顶点颜色进行插值。
  </p>
  <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">varying</strong>：从顶点着色器传递到片段着色器的变量，会被自动插值
    </li>
    <li className="flex items-center gap-2">
      每个顶点的颜色不同，WebGL 会在三角形内部进行线性插值
    </li>
    <li className="flex items-center gap-2">
      顶点着色器中的 <code className="px-1 py-0.5 bg-dark-surface dark:bg-dark-surface bg-light-surface rounded text-sm">v_color = a_color</code> 将每个顶点的颜色传递给片段着色器
    </li>
    <li className="flex items-center gap-2">
      片段着色器接收到的 <code className="px-1 py-0.5 bg-dark-surface dark:bg-dark-surface bg-light-surface rounded text-sm">v_color</code> 是经过插值后的颜色值
    </li>
  </ul>
</section>

<section className="mb-12">
  <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">WebGL 坐标系统</h2>
  <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
    WebGL 使用归一化设备坐标（NDC，Normalized Device Coordinates），坐标范围从 -1 到 1：
  </p>
  <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">X 轴</strong>：-1（左）到 1（右）
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">Y 轴</strong>：-1（下）到 1（上）
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">Z 轴</strong>：-1（近）到 1（远）
    </li>
  </ul>
  <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
    <strong className="text-primary font-semibold">重要提示</strong>：
  </p>
  <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
    <li className="flex items-center gap-2">
      Y 轴向上为正，这与屏幕坐标系统（Y 轴向下）不同
    </li>
    <li className="flex items-center gap-2">
      坐标 (0, 0) 位于画布中心
    </li>
    <li className="flex items-center gap-2">
      超出 [-1, 1] 范围的顶点会被裁剪掉
    </li>
    <li className="flex items-center gap-2">
      在后续章节中，我们会学习如何使用矩阵变换来将任意坐标转换到 NDC 空间
    </li>
  </ul>
</section>

<section className="mb-12">
  <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">WebGL 绘制模式</h2>
  <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
    WebGL 支持多种绘制模式，通过 <code className="px-1 py-0.5 bg-dark-surface dark:bg-dark-surface bg-light-surface rounded text-sm">gl.drawArrays</code> 的第一个参数指定：
  </p>
  <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">gl.POINTS</strong>：绘制独立的点
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">gl.LINES</strong>：每两个顶点绘制一条线段
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">gl.LINE_STRIP</strong>：连接所有顶点形成连续线段
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">gl.LINE_LOOP</strong>：类似 LINE_STRIP，但首尾相连
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">gl.TRIANGLES</strong>：每三个顶点绘制一个三角形
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">gl.TRIANGLE_STRIP</strong>：共享边的三角形带
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">gl.TRIANGLE_FAN</strong>：从第一个顶点出发的三角形扇
    </li>
  </ul>
  <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
    选择合适的模式可以优化性能并简化代码。
  </p>
</section>

<section className="mb-12">
  <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">WebGL 基本步骤</h2>
  <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
    创建一个 WebGL 程序通常遵循以下步骤：
  </p>
  <ol className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5 list-decimal">
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">获取 WebGL 上下文</strong>：<code className="px-1 py-0.5 bg-dark-surface dark:bg-dark-surface bg-light-surface rounded text-sm">canvas.getContext(&#39;webgl&#39;)</code>
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">创建着色器程序</strong>：编写顶点着色器和片段着色器源代码，编译并链接
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">准备顶点数据</strong>：定义顶点位置、颜色、纹理坐标等
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">创建缓冲区</strong>：将顶点数据上传到 GPU
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">设置视口</strong>：<code className="px-1 py-0.5 bg-dark-surface dark:bg-dark-surface bg-light-surface rounded text-sm">gl.viewport(0, 0, width, height)</code>
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">清除画布</strong>：<code className="px-1 py-0.5 bg-dark-surface dark:bg-dark-surface bg-light-surface rounded text-sm">gl.clear(gl.COLOR_BUFFER_BIT)</code>
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">使用着色器程序</strong>：<code className="px-1 py-0.5 bg-dark-surface dark:bg-dark-surface bg-light-surface rounded text-sm">gl.useProgram(program)</code>
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">绑定缓冲区</strong>：<code className="px-1 py-0.5 bg-dark-surface dark:bg-dark-surface bg-light-surface rounded text-sm">gl.bindBuffer(gl.ARRAY_BUFFER, buffer)</code>
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">设置属性指针</strong>：告诉 WebGL 如何读取顶点数据
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">设置统一变量</strong>：<code className="px-1 py-0.5 bg-dark-surface dark:bg-dark-surface bg-light-surface rounded text-sm">gl.uniform*()</code>
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">绘制</strong>：<code className="px-1 py-0.5 bg-dark-surface dark:bg-dark-surface bg-light-surface rounded text-sm">gl.drawArrays()</code> 或 <code className="px-1 py-0.5 bg-dark-surface dark:bg-dark-surface bg-light-surface rounded text-sm">gl.drawElements()</code>
    </li>
  </ol>
</section>

<section className="mb-12">
  <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">关键概念总结</h2>
  <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">着色器程序</strong>：顶点着色器 + 片段着色器，运行在 GPU 上
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">缓冲区（Buffer）</strong>：存储顶点数据、颜色等信息的 GPU 内存
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">属性（Attribute）</strong>：每个顶点不同的数据（如位置、颜色、纹理坐标）
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">统一变量（Uniform）</strong>：所有顶点/片段共享的数据（如颜色、变换矩阵、时间）
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">变量（Varying）</strong>：从顶点着色器传递到片段着色器，会被自动插值
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">gl.drawArrays</strong>：绘制图元（点、线、三角形），使用连续顶点
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">gl.drawElements</strong>：使用索引缓冲区绘制，可以共享顶点
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">索引缓冲区</strong>：定义顶点的连接方式，减少重复顶点
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">归一化设备坐标（NDC）</strong>：WebGL 的坐标系统，范围 [-1, 1]
    </li>
    <li className="flex items-center gap-2">
      <strong className="text-primary font-semibold">渲染管线</strong>：从顶点数据到最终像素的完整流程
    </li>
  </ul>
  <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
    掌握了这些基础概念后，我们就可以开始学习更高级的主题，如变换、光照和纹理。
  </p>
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
