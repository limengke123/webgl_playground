import { useEffect, useRef } from 'react'
import WebGLCanvas from '../../components/WebGLCanvas'
import CodeBlock from '../../components/CodeBlock'
import ChapterNavigation from '../../components/ChapterNavigation'
import { createProgram, createBuffer, setAttribute, Matrix, createIndexBuffer } from '../../utils/webgl'

export default function Chapter5() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl mb-8 text-primary border-b-2 border-dark-border dark:border-dark-border border-light-border pb-4">第五章：相机与投影</h1>
      
      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">什么是相机？</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          在 3D 图形学中，相机定义了观察场景的视角。相机有三个关键属性：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">位置（Position）</strong>：相机在世界空间中的位置</li>
          <li><strong className="text-primary font-semibold">目标（Target）</strong>：相机看向的点</li>
          <li><strong className="text-primary font-semibold">上方向（Up）</strong>：定义相机的上方向（通常是 (0, 1, 0)）</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">视图矩阵（View Matrix）</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          视图矩阵将顶点从世界空间转换到视图空间（相机空间）。可以使用 <code>lookAt</code> 函数创建视图矩阵。
        </p>
        
        <CodeBlock title="创建视图矩阵" code={`// lookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ)
// eye: 相机位置
// center: 相机看向的点
// up: 上方向向量

const viewMatrix = Matrix.lookAt(
  0, 0, 5,    // 相机位置 (0, 0, 5)
  0, 0, 0,    // 看向原点
  0, 1, 0     // 上方向 (0, 1, 0)
);`} language="javascript" />
        
        <WebGLCanvas width={400} height={400} onInit={(gl, canvas) => {
          const vertexShader = `
            attribute vec3 a_position;
            uniform mat4 u_viewMatrix;
            uniform mat4 u_projectionMatrix;
            
            void main() {
              gl_Position = u_projectionMatrix * u_viewMatrix * vec4(a_position, 1.0);
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
          
          // 创建一个立方体的顶点（简化版，只显示前面）
          const positions = [
            -0.5, -0.5, -0.5,
             0.5, -0.5, -0.5,
             0.5,  0.5, -0.5,
            -0.5,  0.5, -0.5,
          ]
          
          const indices = [0, 1, 2, 0, 2, 3]
          
          const positionBuffer = createBuffer(gl, positions)
          const indexBuffer = createIndexBuffer(gl, indices)
          
          const viewMatrixLocation = gl.getUniformLocation(program, 'u_viewMatrix')
          const projectionMatrixLocation = gl.getUniformLocation(program, 'u_projectionMatrix')
          const colorLocation = gl.getUniformLocation(program, 'u_color')
          
          gl.viewport(0, 0, canvas.width, canvas.height)
          gl.enable(gl.DEPTH_TEST)
          gl.clearColor(0.1, 0.1, 0.1, 1.0)
          
          const aspect = canvas.width / canvas.height
          const projectionMatrix = Matrix.perspective(Math.PI / 4, aspect, 0.1, 100)
          
          let time = 0
          const render = () => {
            time += 0.01
            // 相机绕 Y 轴旋转
            const radius = 3
            const eyeX = Math.sin(time) * radius
            const eyeZ = Math.cos(time) * radius
            const viewMatrix = Matrix.lookAt(eyeX, 1, eyeZ, 0, 0, 0, 0, 1, 0)
            
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
            gl.useProgram(program)
            
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
            setAttribute(gl, program, 'a_position', 3)
            
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
            
            gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix)
            gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix)
            gl.uniform4f(colorLocation, 0.2, 0.6, 1.0, 1.0)
            
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
            requestAnimationFrame(render)
          }
          render()
        }} />
        
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          上面的示例展示了相机绕场景旋转的效果。注意观察视角的变化。
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">投影矩阵（Projection Matrix）</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          投影矩阵将 3D 场景投影到 2D 屏幕上。有两种主要的投影方式：
        </p>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">1. 透视投影（Perspective Projection）</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          透视投影模拟人眼的视觉效果，远处的物体看起来更小。这是最常用的投影方式。
        </p>
        
        <CodeBlock title="透视投影矩阵" code={`// perspective(fov, aspect, near, far)
// fov: 视野角度（弧度）
// aspect: 宽高比（width / height）
// near: 近裁剪平面距离
// far: 远裁剪平面距离

const fov = Math.PI / 4;  // 45度
const aspect = canvas.width / canvas.height;
const near = 0.1;
const far = 100.0;

const projectionMatrix = Matrix.perspective(fov, aspect, near, far);`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">2. 正交投影（Orthographic Projection）</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          正交投影保持物体的实际大小，不受距离影响。常用于 2D 渲染或技术图纸。
        </p>
        
        <CodeBlock title="正交投影矩阵" code={`// ortho(left, right, bottom, top, near, far)

const left = -2;
const right = 2;
const bottom = -2;
const top = 2;
const near = 0.1;
const far = 100.0;

const projectionMatrix = Matrix.ortho(left, right, bottom, top, near, far);`} language="javascript" />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">完整的 MVP 示例</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          下面是一个完整的示例，展示如何使用模型矩阵、视图矩阵和投影矩阵：
        </p>
        
        <WebGLCanvas width={400} height={400} onInit={(gl, canvas) => {
          const vertexShader = `
            attribute vec3 a_position;
            uniform mat4 u_modelMatrix;
            uniform mat4 u_viewMatrix;
            uniform mat4 u_projectionMatrix;
            
            void main() {
              mat4 mvp = u_projectionMatrix * u_viewMatrix * u_modelMatrix;
              gl_Position = mvp * vec4(a_position, 1.0);
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
          
          // 立方体顶点
          const positions = [
            // 前面
            -0.5, -0.5,  0.5,  0.5, -0.5,  0.5,  0.5,  0.5,  0.5,  -0.5,  0.5,  0.5,
            // 后面
            -0.5, -0.5, -0.5,  -0.5,  0.5, -0.5,  0.5,  0.5, -0.5,  0.5, -0.5, -0.5,
            // 上面
            -0.5,  0.5, -0.5,  -0.5,  0.5,  0.5,  0.5,  0.5,  0.5,  0.5,  0.5, -0.5,
            // 下面
            -0.5, -0.5, -0.5,  0.5, -0.5, -0.5,  0.5, -0.5,  0.5,  -0.5, -0.5,  0.5,
            // 右面
             0.5, -0.5, -0.5,  0.5,  0.5, -0.5,  0.5,  0.5,  0.5,  0.5, -0.5,  0.5,
            // 左面
            -0.5, -0.5, -0.5,  -0.5, -0.5,  0.5,  -0.5,  0.5,  0.5,  -0.5,  0.5, -0.5,
          ]
          
          const indices = [
            0,  1,  2,   0,  2,  3,    // 前面
            4,  5,  6,   4,  6,  7,    // 后面
            8,  9,  10,  8,  10, 11,   // 上面
            12, 13, 14,  12, 14, 15,   // 下面
            16, 17, 18,  16, 18, 19,   // 右面
            20, 21, 22,  20, 22, 23,   // 左面
          ]
          
          const positionBuffer = createBuffer(gl, positions)
          const indexBuffer = createIndexBuffer(gl, indices)
          
          const modelMatrixLocation = gl.getUniformLocation(program, 'u_modelMatrix')
          const viewMatrixLocation = gl.getUniformLocation(program, 'u_viewMatrix')
          const projectionMatrixLocation = gl.getUniformLocation(program, 'u_projectionMatrix')
          const colorLocation = gl.getUniformLocation(program, 'u_color')
          
          gl.viewport(0, 0, canvas.width, canvas.height)
          gl.enable(gl.DEPTH_TEST)
          gl.clearColor(0.1, 0.1, 0.1, 1.0)
          
          const aspect = canvas.width / canvas.height
          const projectionMatrix = Matrix.perspective(Math.PI / 4, aspect, 0.1, 100)
          const viewMatrix = Matrix.lookAt(0, 0, 3, 0, 0, 0, 0, 1, 0)
          
          let angle = 0
          const render = () => {
            angle += 0.02
            
            // 模型矩阵：旋转立方体
            const modelMatrix = Matrix.rotationY(angle)
            
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
            gl.useProgram(program)
            
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
            setAttribute(gl, program, 'a_position', 3)
            
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
            
            gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix)
            gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix)
            gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix)
            gl.uniform4f(colorLocation, 0.2, 0.6, 1.0, 1.0)
            
            gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0)
            requestAnimationFrame(render)
          }
          render()
        }} />
        
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          这个示例展示了完整的 MVP 矩阵变换：立方体绕 Y 轴旋转（模型矩阵），相机固定观察（视图矩阵），使用透视投影（投影矩阵）。
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">相机控制</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          在实际应用中，我们通常需要控制相机的位置和方向。常见的相机控制方式：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">轨道相机（Orbit Camera）</strong>：相机围绕目标点旋转</li>
          <li><strong className="text-primary font-semibold">第一人称相机（FPS Camera）</strong>：相机可以自由移动和旋转</li>
          <li><strong className="text-primary font-semibold">固定相机</strong>：相机位置和方向固定</li>
        </ul>
        
        <CodeBlock title="轨道相机示例" code={`// 使用球坐标系控制相机
function updateOrbitCamera(radius, theta, phi) {
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  
  const eyeX = x;
  const eyeY = y;
  const eyeZ = z;
  const centerX = 0;
  const centerY = 0;
  const centerZ = 0;
  
  return Matrix.lookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, 0, 1, 0);
}`} language="javascript" />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">关键概念总结</h2>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">视图矩阵</strong>：将顶点从世界空间转换到视图空间</li>
          <li><strong className="text-primary font-semibold">投影矩阵</strong>：将 3D 场景投影到 2D 屏幕</li>
          <li><strong className="text-primary font-semibold">透视投影</strong>：模拟人眼效果，远处物体更小</li>
          <li><strong className="text-primary font-semibold">正交投影</strong>：保持物体实际大小</li>
          <li><strong className="text-primary font-semibold">MVP 矩阵</strong>：Model-View-Projection 的完整变换流程</li>
          <li><strong className="text-primary font-semibold">相机控制</strong>：轨道相机、第一人称相机等</li>
        </ul>
      </section>
      
      <ChapterNavigation />
    </div>
  )
}
