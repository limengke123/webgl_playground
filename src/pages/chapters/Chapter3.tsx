import WebGLCanvas from '../../components/WebGLCanvas'
import CodeBlock from '../../components/CodeBlock'
import ChapterNavigation from '../../components/ChapterNavigation'
import { createProgram, createBuffer, setAttribute, createIndexBuffer } from '../../utils/webgl'

export default function Chapter3() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl mb-8 text-primary border-b-2 border-dark-border dark:border-dark-border border-light-border pb-4">第三章：渲染管线</h1>
      
      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">什么是渲染管线？</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          渲染管线是 GPU 将 3D 场景转换为 2D 图像的过程。WebGL 的渲染管线包括以下阶段：
        </p>
        <ol className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">顶点着色器（Vertex Shader）</strong></li>
          <li><strong className="text-primary font-semibold">图元装配（Primitive Assembly）</strong></li>
          <li><strong className="text-primary font-semibold">光栅化（Rasterization）</strong></li>
          <li><strong className="text-primary font-semibold">片段着色器（Fragment Shader）</strong></li>
          <li><strong className="text-primary font-semibold">逐片段操作（Per-Fragment Operations）</strong></li>
        </ol>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">1. 顶点着色器阶段</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          顶点着色器对每个顶点执行一次，主要任务：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>接收顶点属性（位置、颜色、纹理坐标等）</li>
          <li>应用模型-视图-投影变换</li>
          <li>计算顶点的最终位置（gl_Position）</li>
          <li>准备传递给片段着色器的数据（varying 变量）</li>
        </ul>
        
        <CodeBlock title="顶点着色器示例" code={`attribute vec3 a_position;
attribute vec3 a_color;
uniform mat4 u_modelViewProjection;

varying vec3 v_color;

void main() {
  gl_Position = u_modelViewProjection * vec4(a_position, 1.0);
  v_color = a_color;
}`} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">2. 图元装配</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          将顶点组合成图元（点、线、三角形）。WebGL 支持以下图元类型：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">gl.POINTS</strong>：点</li>
          <li><strong className="text-primary font-semibold">gl.LINES</strong>：线段</li>
          <li><strong className="text-primary font-semibold">gl.LINE_STRIP</strong>：连续线段</li>
          <li><strong className="text-primary font-semibold">gl.LINE_LOOP</strong>：闭合线段</li>
          <li><strong className="text-primary font-semibold">gl.TRIANGLES</strong>：三角形</li>
          <li><strong className="text-primary font-semibold">gl.TRIANGLE_STRIP</strong>：三角形带</li>
          <li><strong className="text-primary font-semibold">gl.TRIANGLE_FAN</strong>：三角形扇</li>
        </ul>
        
        <WebGLCanvas width={400} height={400} onInit={(gl, canvas) => {
          const vertexShader = `
            attribute vec2 a_position;
            void main() {
              gl_Position = vec4(a_position, 0.0, 1.0);
            }
          `
          const fragmentShader = `
            precision mediump float;
            uniform vec4 u_color;
            void main() {
              gl_FragColor = u_color;
            }
          `
          const program = createProgram(gl, vertexShader, fragmentShader)
          
          // 绘制多个图元类型
          const positions = [
            -0.8, 0.8,  0.8, 0.8,  // 点
            -0.6, 0.5,  0.6, 0.5,  // 线
            -0.4, 0.0,  0.4, 0.0,  // 线
            -0.2, -0.3, 0.2, -0.3, // 线
            0.0, -0.6,  0.0, -0.8   // 线
          ]
          
          const positionBuffer = createBuffer(gl, positions)
          const colorLocation = gl.getUniformLocation(program, 'u_color')
          
          gl.viewport(0, 0, canvas.width, canvas.height)
          gl.clearColor(0.1, 0.1, 0.1, 1.0)
          gl.clear(gl.COLOR_BUFFER_BIT)
          
          gl.useProgram(program)
          gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
          setAttribute(gl, program, 'a_position', 2)
          
          // 绘制点
          gl.uniform4f(colorLocation, 1.0, 0.0, 0.0, 1.0)
          gl.drawArrays(gl.POINTS, 0, 2)
          
          // 绘制线
          gl.uniform4f(colorLocation, 0.0, 1.0, 0.0, 1.0)
          gl.drawArrays(gl.LINES, 2, 4)
          
          // 绘制线带
          gl.uniform4f(colorLocation, 0.0, 0.0, 1.0, 1.0)
          gl.drawArrays(gl.LINE_STRIP, 6, 4)
        }} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">3. 光栅化</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          光栅化将图元转换为片段（Fragment）。片段是潜在的像素，包含：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>屏幕坐标（x, y）</li>
          <li>深度值（z）</li>
          <li>从顶点着色器插值得到的 varying 变量</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          WebGL 会对三角形内部的 varying 变量进行线性插值。
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">4. 片段着色器阶段</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          片段着色器对每个片段执行一次，决定最终的颜色：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>接收插值后的 varying 变量</li>
          <li>采样纹理</li>
          <li>计算光照</li>
          <li>设置 gl_FragColor</li>
        </ul>
        
        <CodeBlock title="片段着色器示例" code={`precision mediump float;
varying vec3 v_color;
uniform sampler2D u_texture;
varying vec2 v_texCoord;

void main() {
  vec4 texColor = texture2D(u_texture, v_texCoord);
  gl_FragColor = vec4(v_color, 1.0) * texColor;
}`} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">5. 逐片段操作</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          在写入帧缓冲区之前进行的操作：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">裁剪测试</strong>：丢弃屏幕外的片段</li>
          <li><strong className="text-primary font-semibold">深度测试</strong>：使用深度缓冲区决定是否绘制</li>
          <li><strong className="text-primary font-semibold">模板测试</strong>：使用模板缓冲区</li>
          <li><strong className="text-primary font-semibold">混合</strong>：将新颜色与已有颜色混合</li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">深度测试示例</h3>
        <WebGLCanvas width={400} height={400} onInit={(gl, canvas) => {
          const vertexShader = `
            attribute vec3 a_position;
            uniform mat4 u_matrix;
            void main() {
              gl_Position = u_matrix * vec4(a_position, 1.0);
            }
          `
          const fragmentShader = `
            precision mediump float;
            uniform vec4 u_color;
            void main() {
              gl_FragColor = u_color;
            }
          `
          const program = createProgram(gl, vertexShader, fragmentShader)
          
          // 两个重叠的三角形
          const positions = [
            // 后面的三角形（蓝色）
            -0.3, -0.3, -0.5,
            0.3, -0.3, -0.5,
            0.0, 0.3, -0.5,
            // 前面的三角形（红色）
            -0.2, -0.4, 0.0,
            0.2, -0.4, 0.0,
            0.0, 0.2, 0.0,
          ]
          
          const positionBuffer = createBuffer(gl, positions)
          const colorLocation = gl.getUniformLocation(program, 'u_color')
          
          gl.viewport(0, 0, canvas.width, canvas.height)
          gl.enable(gl.DEPTH_TEST)
          gl.clearColor(0.1, 0.1, 0.1, 1.0)
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
          
          gl.useProgram(program)
          gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
          setAttribute(gl, program, 'a_position', 3)
          
          // 绘制后面的三角形
          gl.uniform4f(colorLocation, 0.0, 0.0, 1.0, 1.0)
          gl.drawArrays(gl.TRIANGLES, 0, 3)
          
          // 绘制前面的三角形
          gl.uniform4f(colorLocation, 1.0, 0.0, 0.0, 1.0)
          gl.drawArrays(gl.TRIANGLES, 3, 3)
        }} />
        
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">注意：需要启用深度测试（gl.enable(gl.DEPTH_TEST)）才能正确显示前后关系。</p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">索引绘制</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          使用索引缓冲区可以重用顶点，减少内存使用：
        </p>
        
        <WebGLCanvas width={400} height={400} onInit={(gl, canvas) => {
          const vertexShader = `
            attribute vec2 a_position;
            void main() {
              gl_Position = vec4(a_position, 0.0, 1.0);
            }
          `
          const fragmentShader = `
            precision mediump float;
            uniform vec4 u_color;
            void main() {
              gl_FragColor = u_color;
            }
          `
          const program = createProgram(gl, vertexShader, fragmentShader)
          
          // 4个顶点定义2个三角形（正方形）
          const positions = [
            -0.5, -0.5,
            0.5, -0.5,
            0.5, 0.5,
            -0.5, 0.5,
          ]
          
          // 索引：使用4个顶点绘制2个三角形
          const indices = [
            0, 1, 2,  // 第一个三角形
            0, 2, 3   // 第二个三角形
          ]
          
          const positionBuffer = createBuffer(gl, positions)
          const indexBuffer = createIndexBuffer(gl, indices)
          const colorLocation = gl.getUniformLocation(program, 'u_color')
          
          gl.viewport(0, 0, canvas.width, canvas.height)
          gl.clearColor(0.1, 0.1, 0.1, 1.0)
          gl.clear(gl.COLOR_BUFFER_BIT)
          
          gl.useProgram(program)
          gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
          setAttribute(gl, program, 'a_position', 2)
          
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
          gl.uniform4f(colorLocation, 0.2, 0.6, 1.0, 1.0)
          gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
        }} />
        
        <CodeBlock title="索引绘制代码" code={`// 顶点数据
const positions = [-0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5]

// 索引数据
const indices = [0, 1, 2, 0, 2, 3]

// 创建索引缓冲区
const indexBuffer = gl.createBuffer()
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)

// 使用索引绘制
gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)`} language="javascript" />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">渲染管线总结</h2>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">顶点着色器</strong>：处理每个顶点</li>
          <li><strong className="text-primary font-semibold">图元装配</strong>：组合顶点成图元</li>
          <li><strong className="text-primary font-semibold">光栅化</strong>：图元转片段，插值 varying 变量</li>
          <li><strong className="text-primary font-semibold">片段着色器</strong>：处理每个片段，决定颜色</li>
          <li><strong className="text-primary font-semibold">逐片段操作</strong>：深度测试、混合等</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          理解渲染管线对于优化 WebGL 性能非常重要。每个阶段都有其特定的优化技巧。
        </p>
      </section>
      
      <ChapterNavigation />
    </div>
  )
}

