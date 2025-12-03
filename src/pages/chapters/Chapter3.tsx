import { useEffect, useRef } from 'react'
import WebGLCanvas from '../../components/WebGLCanvas'
import CodeBlock from '../../components/CodeBlock'
import ChapterNavigation from '../../components/ChapterNavigation'
import { createProgram, createBuffer, setAttribute, Matrix } from '../../utils/webgl'

export default function Chapter3() {
  const rotationRef = useRef(0)

  useEffect(() => {
    const interval = setInterval(() => {
      rotationRef.current += 0.01
    }, 16)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl mb-8 text-primary border-b-2 border-dark-border dark:border-dark-border border-light-border pb-4">第三章：3D 数学基础</h1>
      
      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">向量（Vector）</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          向量是图形学的基础，表示方向和大小。在 3D 空间中，向量通常用三个分量 (x, y, z) 表示。
        </p>
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">向量的基本运算</h3>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">加法</strong>：v1 + v2 = (x1+x2, y1+y2, z1+z2)</li>
          <li><strong className="text-primary font-semibold">减法</strong>：v1 - v2 = (x1-x2, y1-y2, z1-z2)</li>
          <li><strong className="text-primary font-semibold">标量乘法</strong>：s * v = (s*x, s*y, s*z)</li>
          <li><strong className="text-primary font-semibold">点积</strong>：v1 · v2 = x1*x2 + y1*y2 + z1*z2（结果是一个标量）</li>
          <li><strong className="text-primary font-semibold">叉积</strong>：v1 × v2（结果是一个向量，垂直于两个输入向量）</li>
          <li><strong className="text-primary font-semibold">长度</strong>：|v| = √(x² + y² + z²)</li>
          <li><strong className="text-primary font-semibold">归一化</strong>：v' = v / |v|（长度为 1 的单位向量）</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">矩阵（Matrix）</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          矩阵用于表示变换（平移、旋转、缩放）。WebGL 使用 4x4 矩阵来表示 3D 变换。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          矩阵的每一行代表一个坐标轴的方向，最后一列代表平移。
        </p>
        
        <CodeBlock title="单位矩阵（不进行任何变换）" code={`[
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1
]`} language="javascript" />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">平移（Translation）</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          平移矩阵用于移动物体。平移矩阵的形式：
        </p>
        
        <CodeBlock title="平移矩阵" code={`[
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  tx, ty, tz, 1  // 平移量
]`} language="javascript" />
        
        <WebGLCanvas width={400} height={400} onInit={(gl, canvas) => {
          const vertexShader = `
            attribute vec2 a_position;
            uniform mat4 u_matrix;
            
            void main() {
              gl_Position = u_matrix * vec4(a_position, 0.0, 1.0);
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
          const positions = [0, 0.3, -0.3, -0.3, 0.3, -0.3]
          const positionBuffer = createBuffer(gl, positions)
          
          const matrixLocation = gl.getUniformLocation(program, 'u_matrix')
          const colorLocation = gl.getUniformLocation(program, 'u_color')
          
          gl.viewport(0, 0, canvas.width, canvas.height)
          gl.clearColor(0.1, 0.1, 0.1, 1.0)
          
          let time = 0
          const render = () => {
            time += 0.01
            const tx = Math.sin(time) * 0.3
            const translation = Matrix.translation(tx, 0, 0)
            
            gl.clear(gl.COLOR_BUFFER_BIT)
            gl.useProgram(program)
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
            setAttribute(gl, program, 'a_position', 2)
            
            gl.uniformMatrix4fv(matrixLocation, false, translation)
            gl.uniform4f(colorLocation, 0.2, 0.6, 1.0, 1.0)
            gl.drawArrays(gl.TRIANGLES, 0, 3)
            
            requestAnimationFrame(render)
          }
          render()
        }} />
        
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">上面的示例展示了三角形在 X 轴上的平移动画。</p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">旋转（Rotation）</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          旋转矩阵用于绕轴旋转物体。绕 Z 轴旋转的矩阵：
        </p>
        
        <CodeBlock title="绕 Z 轴旋转矩阵" code={`[
  cos(θ), sin(θ), 0, 0,
  -sin(θ), cos(θ), 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1
]`} language="javascript" />
        
        <WebGLCanvas width={400} height={400} onInit={(gl, canvas) => {
          const vertexShader = `
            attribute vec2 a_position;
            uniform mat4 u_matrix;
            
            void main() {
              gl_Position = u_matrix * vec4(a_position, 0.0, 1.0);
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
          const positions = [0, 0.3, -0.3, -0.3, 0.3, -0.3]
          const positionBuffer = createBuffer(gl, positions)
          
          const matrixLocation = gl.getUniformLocation(program, 'u_matrix')
          const colorLocation = gl.getUniformLocation(program, 'u_color')
          
          gl.viewport(0, 0, canvas.width, canvas.height)
          gl.clearColor(0.1, 0.1, 0.1, 1.0)
          
          let angle = 0
          const render = () => {
            angle += 0.02
            const rotation = Matrix.rotationZ(angle)
            
            gl.clear(gl.COLOR_BUFFER_BIT)
            gl.useProgram(program)
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
            setAttribute(gl, program, 'a_position', 2)
            
            gl.uniformMatrix4fv(matrixLocation, false, rotation)
            gl.uniform4f(colorLocation, 0.2, 0.6, 1.0, 1.0)
            gl.drawArrays(gl.TRIANGLES, 0, 3)
            
            requestAnimationFrame(render)
          }
          render()
        }} />
        
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">上面的示例展示了三角形绕 Z 轴的旋转动画。</p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">缩放（Scaling）</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          缩放矩阵用于改变物体的大小。缩放矩阵的形式：
        </p>
        
        <CodeBlock title="缩放矩阵" code={`[
  sx, 0, 0, 0,
  0, sy, 0, 0,
  0, 0, sz, 0,
  0, 0, 0, 1
]`} language="javascript" />
        
        <WebGLCanvas width={400} height={400} onInit={(gl, canvas) => {
          const vertexShader = `
            attribute vec2 a_position;
            uniform mat4 u_matrix;
            
            void main() {
              gl_Position = u_matrix * vec4(a_position, 0.0, 1.0);
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
          const positions = [0, 0.3, -0.3, -0.3, 0.3, -0.3]
          const positionBuffer = createBuffer(gl, positions)
          
          const matrixLocation = gl.getUniformLocation(program, 'u_matrix')
          const colorLocation = gl.getUniformLocation(program, 'u_color')
          
          gl.viewport(0, 0, canvas.width, canvas.height)
          gl.clearColor(0.1, 0.1, 0.1, 1.0)
          
          let time = 0
          const render = () => {
            time += 0.02
            const scale = 0.5 + Math.sin(time) * 0.3
            const scaling = Matrix.scaling(scale, scale, 1)
            
            gl.clear(gl.COLOR_BUFFER_BIT)
            gl.useProgram(program)
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
            setAttribute(gl, program, 'a_position', 2)
            
            gl.uniformMatrix4fv(matrixLocation, false, scaling)
            gl.uniform4f(colorLocation, 0.2, 0.6, 1.0, 1.0)
            gl.drawArrays(gl.TRIANGLES, 0, 3)
            
            requestAnimationFrame(render)
          }
          render()
        }} />
        
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">上面的示例展示了三角形的缩放动画。</p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">组合变换</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          多个变换可以通过矩阵乘法组合。注意：矩阵乘法的顺序很重要！
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          通常的顺序是：<strong className="text-primary font-semibold">缩放 → 旋转 → 平移</strong>
        </p>
        
        <CodeBlock title="组合变换示例" code={`// 先缩放，再旋转，最后平移
const scale = Matrix.scaling(0.5, 0.5, 1)
const rotate = Matrix.rotationZ(angle)
const translate = Matrix.translation(0.2, 0, 0)

// 注意：矩阵乘法从右到左应用
// 先应用 scale，再应用 rotate，最后应用 translate
const matrix = Matrix.multiply(translate, Matrix.multiply(rotate, scale))`} language="javascript" />
        
        <WebGLCanvas width={400} height={400} onInit={(gl, canvas) => {
          const vertexShader = `
            attribute vec2 a_position;
            uniform mat4 u_matrix;
            
            void main() {
              gl_Position = u_matrix * vec4(a_position, 0.0, 1.0);
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
          const positions = [0, 0.3, -0.3, -0.3, 0.3, -0.3]
          const positionBuffer = createBuffer(gl, positions)
          
          const matrixLocation = gl.getUniformLocation(program, 'u_matrix')
          const colorLocation = gl.getUniformLocation(program, 'u_color')
          
          gl.viewport(0, 0, canvas.width, canvas.height)
          gl.clearColor(0.1, 0.1, 0.1, 1.0)
          
          let angle = 0
          const render = () => {
            angle += 0.02
            const scale = Matrix.scaling(0.5, 0.5, 1)
            const rotate = Matrix.rotationZ(angle)
            const translate = Matrix.translation(0.2, 0, 0)
            const matrix = Matrix.multiply(translate, Matrix.multiply(rotate, scale))
            
            gl.clear(gl.COLOR_BUFFER_BIT)
            gl.useProgram(program)
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
            setAttribute(gl, program, 'a_position', 2)
            
            gl.uniformMatrix4fv(matrixLocation, false, matrix)
            gl.uniform4f(colorLocation, 0.2, 0.6, 1.0, 1.0)
            gl.drawArrays(gl.TRIANGLES, 0, 3)
            
            requestAnimationFrame(render)
          }
          render()
        }} />
        
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">上面的示例展示了同时进行缩放、旋转和平移的组合变换。</p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">坐标系统</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          在 3D 图形学中，顶点需要经过多个坐标系统的转换才能最终显示在屏幕上：
        </p>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">1. 模型空间（Model Space）</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          物体自身的坐标系，通常以物体中心为原点。模型矩阵（Model Matrix）将顶点从模型空间转换到世界空间。
        </p>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">2. 世界空间（World Space）</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          场景中所有物体的统一坐标系。视图矩阵（View Matrix）将顶点从世界空间转换到视图空间。
        </p>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">3. 视图空间（View Space / Camera Space）</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          以相机为原点的坐标系。投影矩阵（Projection Matrix）将顶点从视图空间转换到裁剪空间。
        </p>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">4. 裁剪空间（Clip Space）</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          经过投影变换后的坐标，范围在 -1 到 1 之间。WebGL 会自动进行透视除法和视口变换。
        </p>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">5. 屏幕空间（Screen Space）</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          最终显示在屏幕上的像素坐标。
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">MVP 矩阵</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          MVP 是 Model-View-Projection 的缩写，表示三个矩阵的组合：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">M（Model Matrix）</strong>：模型矩阵，将顶点从模型空间转换到世界空间</li>
          <li><strong className="text-primary font-semibold">V（View Matrix）</strong>：视图矩阵，将顶点从世界空间转换到视图空间</li>
          <li><strong className="text-primary font-semibold">P（Projection Matrix）</strong>：投影矩阵，将顶点从视图空间转换到裁剪空间</li>
        </ul>
        
        <CodeBlock title="MVP 矩阵组合" code={`// 在顶点着色器中
attribute vec3 a_position;
uniform mat4 u_modelMatrix;      // 模型矩阵
uniform mat4 u_viewMatrix;       // 视图矩阵
uniform mat4 u_projectionMatrix; // 投影矩阵

void main() {
  // 组合 MVP 矩阵：P * V * M
  mat4 mvp = u_projectionMatrix * u_viewMatrix * u_modelMatrix;
  gl_Position = mvp * vec4(a_position, 1.0);
}

// 或者分别传递三个矩阵
void main() {
  vec4 worldPos = u_modelMatrix * vec4(a_position, 1.0);
  vec4 viewPos = u_viewMatrix * worldPos;
  gl_Position = u_projectionMatrix * viewPos;
}`} />
        
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          注意：矩阵乘法的顺序是从右到左应用的。先应用模型矩阵，再应用视图矩阵，最后应用投影矩阵。
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">关键概念总结</h2>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">向量</strong>：表示方向和大小</li>
          <li><strong className="text-primary font-semibold">矩阵</strong>：表示变换（平移、旋转、缩放）</li>
          <li><strong className="text-primary font-semibold">矩阵乘法</strong>：组合多个变换，顺序很重要</li>
          <li><strong className="text-primary font-semibold">坐标系统</strong>：模型空间 → 世界空间 → 视图空间 → 裁剪空间 → 屏幕空间</li>
          <li><strong className="text-primary font-semibold">MVP 矩阵</strong>：Model-View-Projection，完整的变换流程</li>
        </ul>
      </section>
      
      <ChapterNavigation />
    </div>
  )
}
