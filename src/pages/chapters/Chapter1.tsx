import WebGLCanvas from '../../components/WebGLCanvas'
import CodeBlock from '../../components/CodeBlock'
import ChapterNavigation from '../../components/ChapterNavigation'
import { createProgram, createBuffer, setAttribute } from '../../utils/webgl'

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

export default function Chapter1() {
  return (
    <div className="w-full">
      <h1 className="text-4xl mb-8 text-primary border-b-2 border-dark-border dark:border-dark-border border-light-border pb-4">第一章：WebGL 基础</h1>
      
      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">什么是 WebGL？</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          WebGL（Web Graphics Library）是一个 JavaScript API，用于在浏览器中渲染交互式 2D 和 3D 图形。
          WebGL2 基于 OpenGL ES 3.0，允许你直接使用 GPU 进行图形渲染。WebGL 不需要插件，在现代浏览器中都有原生支持。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          WebGL 的核心优势：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">硬件加速</strong>：利用 GPU 的并行处理能力，性能远超 Canvas 2D</li>
          <li><strong className="text-primary font-semibold">跨平台</strong>：在所有现代浏览器和移动设备上都能运行</li>
          <li><strong className="text-primary font-semibold">强大的渲染能力</strong>：支持复杂的 3D 场景、光照、阴影等高级效果</li>
          <li><strong className="text-primary font-semibold">可编程性</strong>：通过着色器完全控制渲染流程</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          WebGL 的核心概念包括：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">着色器（Shaders）</strong>：运行在 GPU 上的小程序，用于处理顶点和像素</li>
          <li><strong className="text-primary font-semibold">缓冲区（Buffers）</strong>：存储顶点数据、颜色等信息的 GPU 内存</li>
          <li><strong className="text-primary font-semibold">纹理（Textures）</strong>：用于存储图像数据</li>
          <li><strong className="text-primary font-semibold">渲染管线（Pipeline）</strong>：从顶点数据到最终像素的渲染流程</li>
          <li><strong className="text-primary font-semibold">上下文（Context）</strong>：WebGL 的渲染上下文，包含所有状态和函数</li>
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
        <ol className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">顶点数据输入</strong>：将顶点位置、颜色、纹理坐标等数据上传到 GPU 缓冲区</li>
          <li><strong className="text-primary font-semibold">顶点着色器（Vertex Shader）</strong>：
            <ul className="mt-2 pl-6">
              <li>对每个顶点执行一次</li>
              <li>进行坐标变换（模型、视图、投影变换）</li>
              <li>计算顶点颜色、纹理坐标等属性</li>
              <li>输出裁剪空间坐标（gl_Position）</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">图元装配（Primitive Assembly）</strong>：
            <ul className="mt-2 pl-6">
              <li>将顶点组装成图元（点、线、三角形）</li>
              <li>进行裁剪（Clipping）：移除视锥外的部分</li>
              <li>进行透视除法：将齐次坐标转换为归一化设备坐标</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">光栅化（Rasterization）</strong>：
            <ul className="mt-2 pl-6">
              <li>将图元转换为片段（Fragment，即像素候选）</li>
              <li>对顶点属性进行插值（如颜色、纹理坐标）</li>
              <li>确定哪些像素被图元覆盖</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">片段着色器（Fragment Shader）</strong>：
            <ul className="mt-2 pl-6">
              <li>对每个片段执行一次</li>
              <li>计算最终颜色（gl_FragColor）</li>
              <li>可以进行纹理采样、光照计算等</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">片段测试和混合</strong>：
            <ul className="mt-2 pl-6">
              <li>深度测试（Depth Test）：决定片段是否可见</li>
              <li>模板测试（Stencil Test）：用于特殊效果</li>
              <li>混合（Blending）：将新颜色与已有颜色混合</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">帧缓冲区</strong>：最终图像写入帧缓冲区，显示在屏幕上</li>
        </ol>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">重要提示</strong>：在 WebGL 中，我们主要控制顶点着色器和片段着色器，其他阶段由 GPU 自动处理。
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">第一个三角形</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          让我们从最简单的例子开始：绘制一个三角形。这是 WebGL 的"Hello World"。
        </p>
        
        <WebGLCanvas width={400} height={400} onInit={(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement) => {
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
        }} />
        
        <CodeBlock title="顶点着色器" code={vertexShaderSource} />
        <CodeBlock title="片段着色器" code={fragmentShaderSource} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">代码解析</h3>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">顶点着色器</strong>：接收顶点位置（a_position），设置 gl_Position</li>
          <li><strong className="text-primary font-semibold">片段着色器</strong>：设置每个像素的颜色（gl_FragColor）</li>
          <li><strong className="text-primary font-semibold">attribute</strong>：每个顶点不同的数据（如位置、颜色）</li>
          <li><strong className="text-primary font-semibold">uniform</strong>：所有顶点共享的数据（如颜色、变换矩阵）</li>
        </ul>

        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">Attribute 和 Uniform 的区别</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          理解 <code>attribute</code> 和 <code>uniform</code> 的区别是掌握 WebGL 的关键。它们是着色器中两种不同的输入变量类型。
        </p>
        
        <h4 className="text-xl my-6 text-dark-text dark:text-dark-text text-light-text">Attribute（属性变量）</h4>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">定义</strong>：<code>attribute</code> 是顶点着色器的输入变量，用于接收每个顶点不同的数据。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">特点</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong>每个顶点都有不同的值</strong>：例如，3个顶点就有3个不同的位置值</li>
          <li><strong>只能在顶点着色器中使用</strong>：片段着色器无法直接访问 attribute</li>
          <li><strong>从缓冲区读取</strong>：数据存储在 GPU 缓冲区中，通过 <code>gl.vertexAttribPointer()</code> 设置</li>
          <li><strong>执行频率</strong>：顶点着色器对每个顶点执行一次，所以每个顶点都会读取不同的 attribute 值</li>
          <li><strong>常见用途</strong>：顶点位置、顶点颜色、纹理坐标、法向量等</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">示例</strong>：
        </p>
        <CodeBlock title="Attribute 示例" code={`// 顶点着色器
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
          <strong className="text-primary font-semibold">定义</strong>：<code>uniform</code> 是所有顶点或片段共享的常量，在一次绘制调用中保持不变。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">特点</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong>所有顶点/片段共享同一个值</strong>：在一次绘制调用中，uniform 的值对所有顶点和片段都相同</li>
          <li><strong>可以在顶点和片段着色器中使用</strong>：两个着色器都可以访问 uniform</li>
          <li><strong>通过 JavaScript 设置</strong>：使用 <code>gl.uniform*()</code> 函数设置值</li>
          <li><strong>执行频率</strong>：虽然着色器对每个顶点/片段执行，但 uniform 的值在整个绘制过程中保持不变</li>
          <li><strong>可以随时修改</strong>：在每次绘制前可以改变 uniform 的值，但一次绘制中保持不变</li>
          <li><strong>常见用途</strong>：变换矩阵、时间、全局颜色、光照参数等</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">示例</strong>：
        </p>
        <CodeBlock title="Uniform 示例" code={`// 片段着色器
precision mediump float;
uniform vec4 u_color;  // 所有片段共享同一个颜色

void main() {
  gl_FragColor = u_color;  // 所有像素都是同一个颜色
}

// JavaScript 代码
const colorLocation = gl.getUniformLocation(program, 'u_color')
gl.uniform4f(colorLocation, 0.2, 0.6, 1.0, 1.0)  // 设置一次，所有片段都使用这个颜色`} />

        <h4 className="text-xl my-6 text-dark-text dark:text-dark-text text-light-text">对比总结</h4>
        <div className="overflow-x-auto mb-5">
          <table className="w-full border-collapse border border-dark-border dark:border-dark-border border-light-border">
            <thead>
              <tr className="bg-dark-surface dark:bg-dark-surface bg-light-surface">
                <th className="border border-dark-border dark:border-dark-border border-light-border px-4 py-2 text-left text-dark-text dark:text-dark-text text-light-text">特性</th>
                <th className="border border-dark-border dark:border-dark-border border-light-border px-4 py-2 text-left text-dark-text dark:text-dark-text text-light-text">Attribute</th>
                <th className="border border-dark-border dark:border-dark-border border-light-border px-4 py-2 text-left text-dark-text dark:text-dark-text text-light-text">Uniform</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-dark-border dark:border-dark-border border-light-border px-4 py-2 text-dark-text-muted dark:text-dark-text-muted text-light-text-muted">值的变化</td>
                <td className="border border-dark-border dark:border-dark-border border-light-border px-4 py-2 text-dark-text-muted dark:text-dark-text-muted text-light-text-muted">每个顶点不同</td>
                <td className="border border-dark-border dark:border-dark-border border-light-border px-4 py-2 text-dark-text-muted dark:text-dark-text-muted text-light-text-muted">所有顶点/片段相同</td>
              </tr>
              <tr>
                <td className="border border-dark-border dark:border-dark-border border-light-border px-4 py-2 text-dark-text-muted dark:text-dark-text-muted text-light-text-muted">使用位置</td>
                <td className="border border-dark-border dark:border-dark-border border-light-border px-4 py-2 text-dark-text-muted dark:text-dark-text-muted text-light-text-muted">仅顶点着色器</td>
                <td className="border border-dark-border dark:border-dark-border border-light-border px-4 py-2 text-dark-text-muted dark:text-dark-text-muted text-light-text-muted">顶点和片段着色器</td>
              </tr>
              <tr>
                <td className="border border-dark-border dark:border-dark-border border-light-border px-4 py-2 text-dark-text-muted dark:text-dark-text-muted text-light-text-muted">数据来源</td>
                <td className="border border-dark-border dark:border-dark-border border-light-border px-4 py-2 text-dark-text-muted dark:text-dark-text-muted text-light-text-muted">GPU 缓冲区</td>
                <td className="border border-dark-border dark:border-dark-border border-light-border px-4 py-2 text-dark-text-muted dark:text-dark-text-muted text-light-text-muted">JavaScript 直接设置</td>
              </tr>
              <tr>
                <td className="border border-dark-border dark:border-dark-border border-light-border px-4 py-2 text-dark-text-muted dark:text-dark-text-muted text-light-text-muted">设置方式</td>
                <td className="border border-dark-border dark:border-dark-border border-light-border px-4 py-2 text-dark-text-muted dark:text-dark-text-muted text-light-text-muted">gl.vertexAttribPointer()</td>
                <td className="border border-dark-border dark:border-dark-border border-light-border px-4 py-2 text-dark-text-muted dark:text-dark-text-muted text-light-text-muted">gl.uniform*()</td>
              </tr>
              <tr>
                <td className="border border-dark-border dark:border-dark-border border-light-border px-4 py-2 text-dark-text-muted dark:text-dark-text-muted text-light-text-muted">典型用途</td>
                <td className="border border-dark-border dark:border-dark-border border-light-border px-4 py-2 text-dark-text-muted dark:text-dark-text-muted text-light-text-muted">位置、颜色、纹理坐标</td>
                <td className="border border-dark-border dark:border-dark-border border-light-border px-4 py-2 text-dark-text-muted dark:text-dark-text-muted text-light-text-muted">变换矩阵、时间、全局参数</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">precision mediump float 的意义</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          在片段着色器中，你经常会看到第一行是 <code>precision mediump float;</code>，这是 GLSL 的精度限定符声明。
        </p>
        
        <h4 className="text-xl my-6 text-dark-text dark:text-dark-text text-light-text">为什么需要精度声明？</h4>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          在 WebGL2（GLSL ES 3.00）中，虽然片段着色器中的 float 默认精度是 highp，但显式声明精度仍然是一个好习惯。使用 <code>precision mediump float;</code> 可以在性能和精度之间取得平衡，适合大多数应用场景。
        </p>
        
        <h4 className="text-xl my-6 text-dark-text dark:text-dark-text text-light-text">精度级别</h4>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          GLSL 提供了三种精度级别：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">highp</strong>：高精度
            <ul className="mt-2 pl-6">
              <li>精度：至少 32 位浮点数</li>
              <li>范围：-2^62 到 2^62</li>
              <li>用途：需要高精度的计算（如复杂的光照计算）</li>
              <li>性能：较慢，消耗更多资源</li>
              <li>兼容性：某些设备可能不支持</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">mediump</strong>：中等精度（推荐）
            <ul className="mt-2 pl-6">
              <li>精度：至少 16 位浮点数</li>
              <li>范围：-2^14 到 2^14</li>
              <li>用途：大多数颜色和纹理计算</li>
              <li>性能：平衡性能和精度</li>
              <li>兼容性：所有设备都支持</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">lowp</strong>：低精度
            <ul className="mt-2 pl-6">
              <li>精度：至少 10 位浮点数</li>
              <li>范围：-2 到 2</li>
              <li>用途：简单的颜色计算，不需要高精度</li>
              <li>性能：最快，消耗资源最少</li>
              <li>兼容性：所有设备都支持</li>
            </ul>
          </li>
        </ul>

        <h4 className="text-xl my-6 text-dark-text dark:text-dark-text text-light-text">为什么使用 mediump？</h4>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <code>precision mediump float;</code> 是最常用的选择，原因如下：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">精度足够</strong>：16 位精度对于大多数颜色和纹理计算已经足够</li>
          <li><strong className="text-primary font-semibold">性能良好</strong>：比 highp 快，比 lowp 精度高，是性能和精度的最佳平衡</li>
          <li><strong className="text-primary font-semibold">兼容性好</strong>：所有支持 WebGL 的设备都支持 mediump</li>
          <li><strong className="text-primary font-semibold">标准做法</strong>：这是 WebGL 开发中的标准实践</li>
        </ul>

        <h4 className="text-xl my-6 text-dark-text dark:text-dark-text text-light-text">使用示例</h4>
        <CodeBlock title="精度声明示例" code={`// ✅ 正确：声明了精度
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
          <li>顶点着色器不需要声明精度，因为顶点着色器中的 <code>float</code> 默认是 <code>highp</code></li>
          <li>片段着色器必须声明精度，否则无法使用 <code>float</code> 类型</li>
          <li>如果没有特殊需求，始终使用 <code>precision mediump float;</code> 是最安全的选择</li>
          <li>精度声明应该放在片段着色器的最开始，在任何变量声明之前</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">彩色三角形</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          现在让我们为每个顶点添加不同的颜色，看看 WebGL 如何插值颜色。
        </p>
        
        <WebGLCanvas width={400} height={400} onInit={(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement) => {
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
        }} />
        
        <CodeBlock title="顶点着色器" code={`attribute vec2 a_position;
attribute vec3 a_color;
varying vec3 v_color;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_color = a_color;
}`} />
        
        <CodeBlock title="片段着色器" code={`precision mediump float;
varying vec3 v_color;

void main() {
  gl_FragColor = vec4(v_color, 1.0);
}`} />
        
        <CodeBlock title="JavaScript 代码" code={`// 顶点位置（3个顶点）
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
gl.drawArrays(gl.TRIANGLES, 0, 3)`} />
        
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          注意观察三角形内部的颜色是如何平滑过渡的。这是因为 WebGL 在光栅化阶段会对顶点颜色进行插值。
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">varying</strong>：从顶点着色器传递到片段着色器的变量，会被自动插值</li>
          <li>每个顶点的颜色不同，WebGL 会在三角形内部进行线性插值</li>
          <li>顶点着色器中的 <code>v_color = a_color</code> 将每个顶点的颜色传递给片段着色器</li>
          <li>片段着色器接收到的 <code>v_color</code> 是经过插值后的颜色值</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">绘制不同形状</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          WebGL 可以绘制各种形状。让我们看看如何绘制矩形、圆形等常见形状。
        </p>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">绘制矩形</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          矩形由两个三角形组成。我们可以使用索引缓冲区来避免重复顶点。
        </p>
        
        <WebGLCanvas width={400} height={400} onInit={(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement) => {
          const vertexShader = `
            attribute vec2 a_position;
            uniform vec4 u_color;
            varying vec4 v_color;
            
            void main() {
              gl_Position = vec4(a_position, 0.0, 1.0);
              v_color = u_color;
            }
          `
          
          const fragmentShader = `
            precision mediump float;
            varying vec4 v_color;
            
            void main() {
              gl_FragColor = v_color;
            }
          `
          
          const program = createProgram(gl, vertexShader, fragmentShader)
          
          // 矩形的四个顶点
          const positions = [
            -0.5, -0.5,  // 左下
             0.5, -0.5,  // 右下
             0.5,  0.5,  // 右上
            -0.5,  0.5   // 左上
          ]
          
          // 索引：定义两个三角形
          const indices = [0, 1, 2, 0, 2, 3]
          
          const positionBuffer = createBuffer(gl, positions)
          const indexBuffer = gl.createBuffer()
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
          gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)
          
          const colorLocation = gl.getUniformLocation(program, 'u_color')
          
          gl.viewport(0, 0, canvas.width, canvas.height)
          gl.clearColor(0.1, 0.1, 0.1, 1.0)
          
          gl.clear(gl.COLOR_BUFFER_BIT)
          gl.useProgram(program)
          gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
          setAttribute(gl, program, 'a_position', 2)
          gl.uniform4f(colorLocation, 0.2, 0.6, 1.0, 1.0)
          gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
        }} />
        
        <CodeBlock title="使用索引缓冲区绘制矩形" code={`// 顶点数据（4个顶点）
const positions = [
  -0.5, -0.5,  // 左下
   0.5, -0.5,  // 右下
   0.5,  0.5,  // 右上
  -0.5,  0.5   // 左上
]

// 索引数据（定义两个三角形）
const indices = [
  0, 1, 2,  // 第一个三角形：左下、右下、右上
  0, 2, 3   // 第二个三角形：左下、右上、左上
]

// 创建索引缓冲区
const indexBuffer = gl.createBuffer()
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)

// 使用 gl.drawElements 绘制
gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">绘制圆形</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          圆形可以通过将圆周分成多个三角形来近似。三角形越多，圆形越平滑。
        </p>
        
        <WebGLCanvas width={400} height={400} onInit={(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement) => {
          const vertexShader = `
            attribute vec2 a_position;
            uniform vec4 u_color;
            varying vec4 v_color;
            
            void main() {
              gl_Position = vec4(a_position, 0.0, 1.0);
              v_color = u_color;
            }
          `
          
          const fragmentShader = `
            precision mediump float;
            varying vec4 v_color;
            
            void main() {
              gl_FragColor = v_color;
            }
          `
          
          const program = createProgram(gl, vertexShader, fragmentShader)
          
          // 生成圆形顶点（32个三角形）
          const segments = 32
          const positions: number[] = [0, 0] // 中心点
          const indices: number[] = []
          
          for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2
            positions.push(Math.cos(angle) * 0.5, Math.sin(angle) * 0.5)
          }
          
          // 生成索引
          for (let i = 1; i <= segments; i++) {
            indices.push(0, i, i + 1)
          }
          indices.push(0, segments + 1, 1) // 闭合圆形
          
          const positionBuffer = createBuffer(gl, positions)
          const indexBuffer = gl.createBuffer()
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
          gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)
          
          const colorLocation = gl.getUniformLocation(program, 'u_color')
          
          gl.viewport(0, 0, canvas.width, canvas.height)
          gl.clearColor(0.1, 0.1, 0.1, 1.0)
          
          gl.clear(gl.COLOR_BUFFER_BIT)
          gl.useProgram(program)
          gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
          setAttribute(gl, program, 'a_position', 2)
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
          gl.uniform4f(colorLocation, 0.2, 0.6, 1.0, 1.0)
          gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0)
        }} />
        
        <CodeBlock title="生成圆形顶点" code={`// 生成圆形顶点
function createCircleVertices(segments: number, radius: number) {
  const positions: number[] = [0, 0] // 中心点
  const indices: number[] = []
  
  // 生成圆周上的点
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2
    positions.push(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius
    )
  }
  
  // 生成三角形索引
  for (let i = 1; i <= segments; i++) {
    indices.push(0, i, i + 1)
  }
  indices.push(0, segments + 1, 1) // 闭合
  
  return { positions, indices }
}`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">绘制星形</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          星形是另一个有趣的例子，展示了如何通过数学计算生成复杂形状。
        </p>
        
        <WebGLCanvas width={400} height={400} onInit={(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement) => {
          const vertexShader = `
            attribute vec2 a_position;
            uniform vec4 u_color;
            varying vec4 v_color;
            
            void main() {
              gl_Position = vec4(a_position, 0.0, 1.0);
              v_color = u_color;
            }
          `
          
          const fragmentShader = `
            precision mediump float;
            varying vec4 v_color;
            
            void main() {
              gl_FragColor = v_color;
            }
          `
          
          const program = createProgram(gl, vertexShader, fragmentShader)
          
          // 生成五角星顶点
          const points = 5
          const outerRadius = 0.5
          const innerRadius = 0.25
          const positions: number[] = [0, 0] // 中心点（索引0）
          const indices: number[] = []
          
          // 生成外顶点和内顶点，交替排列
          for (let i = 0; i < points * 2; i++) {
            // 角度：从 -90度开始，每个顶点间隔 360/(points*2) 度
            const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2
            // 外顶点和内顶点交替
            const radius = i % 2 === 0 ? outerRadius : innerRadius
            positions.push(
              Math.cos(angle) * radius,
              Math.sin(angle) * radius
            )
          }
          
          // 生成三角形索引：从中心点出发，连接相邻的两个顶点
          // 索引0是中心点，索引1-10是外顶点和内顶点
          for (let i = 1; i < points * 2; i++) {
            indices.push(0, i, i + 1)
          }
          // 闭合最后一个三角形：连接最后一个顶点和第一个顶点
          indices.push(0, points * 2, 1)
          
          const positionBuffer = createBuffer(gl, positions)
          const indexBuffer = gl.createBuffer()
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
          gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)
          
          const colorLocation = gl.getUniformLocation(program, 'u_color')
          
          gl.viewport(0, 0, canvas.width, canvas.height)
          gl.clearColor(0.1, 0.1, 0.1, 1.0)
          
          gl.clear(gl.COLOR_BUFFER_BIT)
          gl.useProgram(program)
          gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
          setAttribute(gl, program, 'a_position', 2)
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
          gl.uniform4f(colorLocation, 1.0, 0.8, 0.2, 1.0)
          gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0)
        }} />
        
        <CodeBlock title="生成五角星顶点" code={`// 生成五角星顶点
const points = 5
const outerRadius = 0.5  // 外半径
const innerRadius = 0.25 // 内半径
const positions = [0, 0]  // 中心点（索引0）
const indices = []

// 生成外顶点和内顶点，交替排列
for (let i = 0; i < points * 2; i++) {
  // 角度：从 -90度开始，每个顶点间隔 360/(points*2) 度
  const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2
  // 外顶点和内顶点交替
  const radius = i % 2 === 0 ? outerRadius : innerRadius
  positions.push(
    Math.cos(angle) * radius,
    Math.sin(angle) * radius
  )
}

// 生成三角形索引：从中心点出发，连接相邻的两个顶点
// 索引0是中心点，索引1-10是外顶点和内顶点
for (let i = 1; i < points * 2; i++) {
  indices.push(0, i, i + 1)
}
// 闭合最后一个三角形：连接最后一个顶点和第一个顶点
indices.push(0, points * 2, 1)

// 创建索引缓冲区
const indexBuffer = gl.createBuffer()
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)

// 使用 gl.drawElements 绘制
gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0)`} />
        
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          这些示例展示了 WebGL 的基本绘制能力。通过组合多个三角形，我们可以创建任意复杂的形状。
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">WebGL 坐标系统</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          WebGL 使用归一化设备坐标（NDC，Normalized Device Coordinates），坐标范围从 -1 到 1：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">X 轴</strong>：-1（左）到 1（右）</li>
          <li><strong className="text-primary font-semibold">Y 轴</strong>：-1（下）到 1（上）</li>
          <li><strong className="text-primary font-semibold">Z 轴</strong>：-1（近）到 1（远）</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">重要提示</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>Y 轴向上为正，这与屏幕坐标系统（Y 轴向下）不同</li>
          <li>坐标 (0, 0) 位于画布中心</li>
          <li>超出 [-1, 1] 范围的顶点会被裁剪掉</li>
          <li>在后续章节中，我们会学习如何使用矩阵变换来将任意坐标转换到 NDC 空间</li>
        </ul>
        
        <WebGLCanvas width={400} height={400} onInit={(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement) => {
          const vertexShader = `
            attribute vec2 a_position;
            uniform vec4 u_color;
            varying vec4 v_color;
            
            void main() {
              gl_Position = vec4(a_position, 0.0, 1.0);
              v_color = u_color;
            }
          `
          
          const fragmentShader = `
            precision mediump float;
            varying vec4 v_color;
            
            void main() {
              gl_FragColor = v_color;
            }
          `
          
          const program = createProgram(gl, vertexShader, fragmentShader)
          
          // 绘制坐标轴
          const positions = [
            // X 轴（红色）
            -1, 0, 1, 0,
            // Y 轴（绿色）
            0, -1, 0, 1,
            // 原点标记
            -0.02, -0.02, 0.02, -0.02, 0.02, 0.02, -0.02, 0.02
          ]
          
          const positionBuffer = createBuffer(gl, positions)
          const colorLocation = gl.getUniformLocation(program, 'u_color')
          
          gl.viewport(0, 0, canvas.width, canvas.height)
          gl.clearColor(0.1, 0.1, 0.1, 1.0)
          
          gl.clear(gl.COLOR_BUFFER_BIT)
          gl.useProgram(program)
          gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
          setAttribute(gl, program, 'a_position', 2)
          
          // 绘制 X 轴
          gl.uniform4f(colorLocation, 1.0, 0.0, 0.0, 1.0)
          gl.drawArrays(gl.LINES, 0, 2)
          
          // 绘制 Y 轴
          gl.uniform4f(colorLocation, 0.0, 1.0, 0.0, 1.0)
          gl.drawArrays(gl.LINES, 2, 2)
          
          // 绘制原点
          gl.uniform4f(colorLocation, 1.0, 1.0, 1.0, 1.0)
          gl.drawArrays(gl.TRIANGLE_FAN, 4, 4)
        }} />
        
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          上面的示例展示了 WebGL 的坐标系统。红色线是 X 轴，绿色线是 Y 轴，白色方块标记原点。
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">WebGL 绘制模式</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          WebGL 支持多种绘制模式，通过 <code>gl.drawArrays</code> 的第一个参数指定：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">gl.POINTS</strong>：绘制独立的点</li>
          <li><strong className="text-primary font-semibold">gl.LINES</strong>：每两个顶点绘制一条线段</li>
          <li><strong className="text-primary font-semibold">gl.LINE_STRIP</strong>：连接所有顶点形成连续线段</li>
          <li><strong className="text-primary font-semibold">gl.LINE_LOOP</strong>：类似 LINE_STRIP，但首尾相连</li>
          <li><strong className="text-primary font-semibold">gl.TRIANGLES</strong>：每三个顶点绘制一个三角形</li>
          <li><strong className="text-primary font-semibold">gl.TRIANGLE_STRIP</strong>：共享边的三角形带</li>
          <li><strong className="text-primary font-semibold">gl.TRIANGLE_FAN</strong>：从第一个顶点出发的三角形扇</li>
        </ul>
        
        <WebGLCanvas width={400} height={400} onInit={(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement) => {
          const vertexShader = `
            attribute vec2 a_position;
            uniform vec4 u_color;
            varying vec4 v_color;
            
            void main() {
              gl_Position = vec4(a_position, 0.0, 1.0);
              v_color = u_color;
            }
          `
          
          const fragmentShader = `
            precision mediump float;
            varying vec4 v_color;
            
            void main() {
              gl_FragColor = v_color;
            }
          `
          
          const program = createProgram(gl, vertexShader, fragmentShader)
          
          // 示例顶点
          const positions = [
            -0.8, 0.5, -0.4, 0.5, 0, 0.5, 0.4, 0.5, 0.8, 0.5,
            -0.8, 0, -0.4, 0, 0, 0, 0.4, 0, 0.8, 0,
            -0.8, -0.5, -0.4, -0.5, 0, -0.5, 0.4, -0.5, 0.8, -0.5
          ]
          
          const positionBuffer = createBuffer(gl, positions)
          const colorLocation = gl.getUniformLocation(program, 'u_color')
          
          gl.viewport(0, 0, canvas.width, canvas.height)
          gl.clearColor(0.1, 0.1, 0.1, 1.0)
          gl.clear(gl.COLOR_BUFFER_BIT)
          gl.useProgram(program)
          gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
          setAttribute(gl, program, 'a_position', 2)
          
          // 绘制不同模式
          const modes = [
            { mode: gl.POINTS, color: [1, 0, 0, 1], y: 0.5, label: 'POINTS' },
            { mode: gl.LINES, color: [0, 1, 0, 1], y: 0, label: 'LINES' },
            { mode: gl.TRIANGLES, color: [0, 0.5, 1, 1], y: -0.5, label: 'TRIANGLES' }
          ]
          
          modes.forEach(({ mode, color, y }) => {
            const offset = y === 0.5 ? 0 : y === 0 ? 5 : 10
            gl.uniform4f(colorLocation, color[0], color[1], color[2], color[3])
            gl.drawArrays(mode, offset, 5)
          })
        }} />
        
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          上面的示例展示了三种不同的绘制模式。选择合适的模式可以优化性能并简化代码。
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">WebGL 基本步骤</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          创建一个 WebGL 程序通常遵循以下步骤：
        </p>
        <ol className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">获取 WebGL 上下文</strong>：<code>canvas.getContext('webgl')</code></li>
          <li><strong className="text-primary font-semibold">创建着色器程序</strong>：编写顶点着色器和片段着色器源代码，编译并链接</li>
          <li><strong className="text-primary font-semibold">准备顶点数据</strong>：定义顶点位置、颜色、纹理坐标等</li>
          <li><strong className="text-primary font-semibold">创建缓冲区</strong>：将顶点数据上传到 GPU</li>
          <li><strong className="text-primary font-semibold">设置视口</strong>：<code>gl.viewport(0, 0, width, height)</code></li>
          <li><strong className="text-primary font-semibold">清除画布</strong>：<code>gl.clear(gl.COLOR_BUFFER_BIT)</code></li>
          <li><strong className="text-primary font-semibold">使用着色器程序</strong>：<code>gl.useProgram(program)</code></li>
          <li><strong className="text-primary font-semibold">绑定缓冲区</strong>：<code>gl.bindBuffer(gl.ARRAY_BUFFER, buffer)</code></li>
          <li><strong className="text-primary font-semibold">设置属性指针</strong>：告诉 WebGL 如何读取顶点数据</li>
          <li><strong className="text-primary font-semibold">设置统一变量</strong>：<code>gl.uniform*()</code></li>
          <li><strong className="text-primary font-semibold">绘制</strong>：<code>gl.drawArrays()</code> 或 <code>gl.drawElements()</code></li>
        </ol>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">关键概念总结</h2>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">着色器程序</strong>：顶点着色器 + 片段着色器，运行在 GPU 上</li>
          <li><strong className="text-primary font-semibold">缓冲区（Buffer）</strong>：存储顶点数据、颜色等信息的 GPU 内存</li>
          <li><strong className="text-primary font-semibold">属性（Attribute）</strong>：每个顶点不同的数据（如位置、颜色、纹理坐标）</li>
          <li><strong className="text-primary font-semibold">统一变量（Uniform）</strong>：所有顶点/片段共享的数据（如颜色、变换矩阵、时间）</li>
          <li><strong className="text-primary font-semibold">变量（Varying）</strong>：从顶点着色器传递到片段着色器，会被自动插值</li>
          <li><strong className="text-primary font-semibold">gl.drawArrays</strong>：绘制图元（点、线、三角形），使用连续顶点</li>
          <li><strong className="text-primary font-semibold">gl.drawElements</strong>：使用索引缓冲区绘制，可以共享顶点</li>
          <li><strong className="text-primary font-semibold">索引缓冲区</strong>：定义顶点的连接方式，减少重复顶点</li>
          <li><strong className="text-primary font-semibold">归一化设备坐标（NDC）</strong>：WebGL 的坐标系统，范围 [-1, 1]</li>
          <li><strong className="text-primary font-semibold">渲染管线</strong>：从顶点数据到最终像素的完整流程</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          掌握了这些基础概念后，我们就可以开始学习更高级的主题，如变换、光照和纹理。
        </p>
      </section>
      
      <ChapterNavigation />
    </div>
  )
}

