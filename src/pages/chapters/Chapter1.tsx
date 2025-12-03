import WebGLCanvas from '../../components/WebGLCanvas'
import CodeBlock from '../../components/CodeBlock'
import ChapterNavigation from '../../components/ChapterNavigation'
import { createProgram, createBuffer, setAttribute } from '../../utils/webgl'

const vertexShaderSource = `
attribute vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const fragmentShaderSource = `
precision mediump float;

uniform vec4 u_color;

void main() {
  gl_FragColor = u_color;
}
`

export default function Chapter1() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl mb-8 text-primary border-b-2 border-dark-border pb-4">第一章：WebGL 基础</h1>
      
      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text">什么是 WebGL？</h2>
        <p className="text-dark-text-muted leading-relaxed mb-4">
          WebGL（Web Graphics Library）是一个 JavaScript API，用于在浏览器中渲染交互式 2D 和 3D 图形。
          它基于 OpenGL ES 2.0，允许你直接使用 GPU 进行图形渲染。
        </p>
        <p className="text-dark-text-muted leading-relaxed mb-4">
          WebGL 的核心概念包括：
        </p>
        <ul className="text-dark-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">着色器（Shaders）</strong>：运行在 GPU 上的小程序，用于处理顶点和像素</li>
          <li><strong className="text-primary font-semibold">缓冲区（Buffers）</strong>：存储顶点数据、颜色等信息的 GPU 内存</li>
          <li><strong className="text-primary font-semibold">纹理（Textures）</strong>：用于存储图像数据</li>
          <li><strong className="text-primary font-semibold">渲染管线（Pipeline）</strong>：从顶点数据到最终像素的渲染流程</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text">第一个三角形</h2>
        <p className="text-dark-text-muted leading-relaxed mb-4">
          让我们从最简单的例子开始：绘制一个三角形。这是 WebGL 的"Hello World"。
        </p>
        
        <WebGLCanvas width={400} height={400} onInit={(gl, canvas) => {
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
        
        <h3 className="text-2xl my-8 text-dark-text">代码解析</h3>
        <ul className="text-dark-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">顶点着色器</strong>：接收顶点位置（a_position），设置 gl_Position</li>
          <li><strong className="text-primary font-semibold">片段着色器</strong>：设置每个像素的颜色（gl_FragColor）</li>
          <li><strong className="text-primary font-semibold">attribute</strong>：每个顶点不同的数据（如位置、颜色）</li>
          <li><strong className="text-primary font-semibold">uniform</strong>：所有顶点共享的数据（如颜色、变换矩阵）</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text">彩色三角形</h2>
        <p className="text-dark-text-muted leading-relaxed mb-4">
          现在让我们为每个顶点添加不同的颜色，看看 WebGL 如何插值颜色。
        </p>
        
        <WebGLCanvas width={400} height={400} onInit={(gl, canvas) => {
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
        
        <p className="text-dark-text-muted leading-relaxed mb-4">
          注意观察三角形内部的颜色是如何平滑过渡的。这是因为 WebGL 在光栅化阶段会对顶点颜色进行插值。
        </p>
        <ul className="text-dark-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">varying</strong>：从顶点着色器传递到片段着色器的变量，会被自动插值</li>
          <li>每个顶点的颜色不同，WebGL 会在三角形内部进行线性插值</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text">WebGL 坐标系统</h2>
        <p className="text-dark-text-muted leading-relaxed mb-4">
          WebGL 使用归一化设备坐标（NDC），坐标范围从 -1 到 1：
        </p>
        <ul className="text-dark-text-muted leading-loose pl-8 mb-5">
          <li>X 轴：-1（左）到 1（右）</li>
          <li>Y 轴：-1（下）到 1（上）</li>
          <li>Z 轴：-1（近）到 1（远）</li>
        </ul>
        <p className="text-dark-text-muted leading-relaxed mb-4">
          注意：Y 轴向上为正，这与屏幕坐标系统不同。
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text">关键概念总结</h2>
        <ul className="text-dark-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">着色器程序</strong>：顶点着色器 + 片段着色器</li>
          <li><strong className="text-primary font-semibold">缓冲区</strong>：存储顶点数据</li>
          <li><strong className="text-primary font-semibold">属性（Attribute）</strong>：每个顶点不同的数据</li>
          <li><strong className="text-primary font-semibold">统一变量（Uniform）</strong>：所有顶点共享的数据</li>
          <li><strong className="text-primary font-semibold">变量（Varying）</strong>：从顶点着色器传递到片段着色器</li>
          <li><strong className="text-primary font-semibold">gl.drawArrays</strong>：绘制图元（点、线、三角形）</li>
        </ul>
      </section>
      
      <ChapterNavigation />
    </div>
  )
}

