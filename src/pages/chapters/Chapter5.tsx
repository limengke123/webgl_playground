import { useEffect, useRef } from 'react'
import WebGLCanvas from '../../components/WebGLCanvas'
import CodeBlock from '../../components/CodeBlock'
import ChapterNavigation from '../../components/ChapterNavigation'
import { createProgram, createBuffer, Matrix, createIndexBuffer } from '../../utils/webgl'

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
        
        <WebGLCanvas width={400} height={400} onInit={(gl: WebGLRenderingContext, canvas: HTMLCanvasElement) => {
          const vertexShader = `attribute vec3 a_position;
uniform mat4 u_viewMatrix;
uniform mat4 u_projectionMatrix;

void main() {
  gl_Position = u_projectionMatrix * u_viewMatrix * vec4(a_position, 1.0);
}`
          
          const fragmentShader = `precision mediump float;
uniform vec4 u_color;

void main() {
  gl_FragColor = u_color;
}`
          
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
          const positionLocation = gl.getAttribLocation(program, 'a_position')
          
          if (positionLocation === -1) {
            console.error('属性 a_position 未找到')
            return
          }
          
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
            gl.enableVertexAttribArray(positionLocation)
            gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0)
            
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
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">透视投影 vs 正交投影对比</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          下面展示了两种投影方式的区别：
        </p>
        
        <WebGLCanvas width={400} height={400} onInit={(gl: WebGLRenderingContext, canvas: HTMLCanvasElement) => {
          const vertexShader = `attribute vec3 a_position;
uniform mat4 u_modelMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_projectionMatrix;

void main() {
  mat4 mvp = u_projectionMatrix * u_viewMatrix * u_modelMatrix;
  gl_Position = mvp * vec4(a_position, 1.0);
}`
          
          const fragmentShader = `precision mediump float;
uniform vec4 u_color;

void main() {
  gl_FragColor = u_color;
}`
          
          const program = createProgram(gl, vertexShader, fragmentShader)
          
          // 创建多个立方体（前后排列）
          const positions: number[] = []
          const indices: number[] = []
          const colors: number[] = []
          
          // 生成 3 个立方体，沿 Z 轴排列
          for (let i = 0; i < 3; i++) {
            const z = i * -1.5
            const base = i * 24
            
            // 立方体顶点
            const cubePositions = [
              -0.3, -0.3, z + 0.3,  0.3, -0.3, z + 0.3,  0.3,  0.3, z + 0.3,  -0.3,  0.3, z + 0.3,
              -0.3, -0.3, z - 0.3,  -0.3,  0.3, z - 0.3,  0.3,  0.3, z - 0.3,  0.3, -0.3, z - 0.3,
              -0.3,  0.3, z - 0.3,  -0.3,  0.3, z + 0.3,  0.3,  0.3, z + 0.3,  0.3,  0.3, z - 0.3,
              -0.3, -0.3, z - 0.3,  0.3, -0.3, z - 0.3,  0.3, -0.3, z + 0.3,  -0.3, -0.3, z + 0.3,
               0.3, -0.3, z - 0.3,  0.3,  0.3, z - 0.3,  0.3,  0.3, z + 0.3,  0.3, -0.3, z + 0.3,
              -0.3, -0.3, z - 0.3,  -0.3, -0.3, z + 0.3,  -0.3,  0.3, z + 0.3,  -0.3,  0.3, z - 0.3,
            ]
            
            positions.push(...cubePositions)
            
            // 立方体索引
            const cubeIndices = [
              base + 0, base + 1, base + 2, base + 0, base + 2, base + 3,
              base + 4, base + 5, base + 6, base + 4, base + 6, base + 7,
              base + 8, base + 9, base + 10, base + 8, base + 10, base + 11,
              base + 12, base + 13, base + 14, base + 12, base + 14, base + 15,
              base + 16, base + 17, base + 18, base + 16, base + 18, base + 19,
              base + 20, base + 21, base + 22, base + 20, base + 22, base + 23,
            ]
            
            indices.push(...cubeIndices)
          }
          
          const positionBuffer = createBuffer(gl, positions)
          const indexBuffer = createIndexBuffer(gl, indices)
          
          const modelMatrixLocation = gl.getUniformLocation(program, 'u_modelMatrix')
          const viewMatrixLocation = gl.getUniformLocation(program, 'u_viewMatrix')
          const projectionMatrixLocation = gl.getUniformLocation(program, 'u_projectionMatrix')
          const colorLocation = gl.getUniformLocation(program, 'u_color')
          const positionLocation = gl.getAttribLocation(program, 'a_position')
          
          if (positionLocation === -1) {
            console.error('属性 a_position 未找到')
            return
          }
          
          gl.viewport(0, 0, canvas.width, canvas.height)
          gl.enable(gl.DEPTH_TEST)
          gl.clearColor(0.1, 0.1, 0.1, 1.0)
          
          const aspect = canvas.width / canvas.height
          const viewMatrix = Matrix.lookAt(0, 0, 3, 0, 0, 0, 0, 1, 0)
          const modelMatrix = Matrix.identity()
          
          let time = 0
          const render = () => {
            time += 0.01
            
            // 切换投影模式
            const usePerspective = (Math.sin(time) + 1) / 2 > 0.5
            const projectionMatrix = usePerspective
              ? Matrix.perspective(Math.PI / 4, aspect, 0.1, 100)
              : Matrix.ortho(-2, 2, -2, 2, 0.1, 100)
            
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
            gl.useProgram(program)
            
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
            gl.enableVertexAttribArray(positionLocation)
            gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0)
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
            
            gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix)
            gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix)
            gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix)
            
            // 绘制三个立方体，使用不同颜色
            const cubeColors = [
              [1.0, 0.2, 0.2, 1.0],  // 红色（最近）
              [0.2, 1.0, 0.2, 1.0],  // 绿色（中间）
              [0.2, 0.2, 1.0, 1.0]   // 蓝色（最远）
            ]
            
            for (let i = 0; i < 3; i++) {
              gl.uniform4f(colorLocation, cubeColors[i][0], cubeColors[i][1], cubeColors[i][2], cubeColors[i][3])
              gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, i * 36 * 2)
            }
            
            requestAnimationFrame(render)
          }
          render()
        }} />
        
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          注意观察：在透视投影中，远处的立方体看起来更小；在正交投影中，所有立方体保持相同大小。
        </p>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">选择投影方式</h3>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">使用透视投影</strong>：
            <ul className="mt-2 pl-6">
              <li>3D 游戏和可视化</li>
              <li>需要真实感的场景</li>
              <li>模拟人眼视觉效果</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">使用正交投影</strong>：
            <ul className="mt-2 pl-6">
              <li>2D 游戏和 UI</li>
              <li>技术图纸和 CAD</li>
              <li>等距视图（Isometric View）</li>
            </ul>
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">完整的 MVP 示例</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          下面是一个完整的示例，展示如何使用模型矩阵、视图矩阵和投影矩阵：
        </p>
        
        <WebGLCanvas width={400} height={400} onInit={(gl: WebGLRenderingContext, canvas: HTMLCanvasElement) => {
          const vertexShader = `attribute vec3 a_position;
uniform mat4 u_modelMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_projectionMatrix;

void main() {
  mat4 mvp = u_projectionMatrix * u_viewMatrix * u_modelMatrix;
  gl_Position = mvp * vec4(a_position, 1.0);
}`
          
          const fragmentShader = `precision mediump float;
uniform vec4 u_color;

void main() {
  gl_FragColor = u_color;
}`
          
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
          const positionLocation = gl.getAttribLocation(program, 'a_position')
          
          if (positionLocation === -1) {
            console.error('属性 a_position 未找到')
            return
          }
          
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
            gl.enableVertexAttribArray(positionLocation)
            gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0)
            
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
          <li><strong className="text-primary font-semibold">轨道相机（Orbit Camera）</strong>：相机围绕目标点旋转，常用于 3D 查看器</li>
          <li><strong className="text-primary font-semibold">第一人称相机（FPS Camera）</strong>：相机可以自由移动和旋转，常用于游戏</li>
          <li><strong className="text-primary font-semibold">固定相机</strong>：相机位置和方向固定，常用于固定视角的场景</li>
          <li><strong className="text-primary font-semibold">跟随相机（Follow Camera）</strong>：相机跟随目标物体移动</li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">1. 轨道相机（Orbit Camera）</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          轨道相机使用球坐标系，相机围绕目标点旋转。非常适合查看 3D 模型。
        </p>
        
        <CodeBlock title="轨道相机实现" code={`class OrbitCamera {
  constructor(targetX, targetY, targetZ) {
    this.target = { x: targetX, y: targetY, z: targetZ };
    this.radius = 5.0;      // 距离目标的距离
    this.theta = 0.0;        // 水平角度（绕 Y 轴）
    this.phi = Math.PI / 4;  // 垂直角度（从上方看）
  }
  
  // 更新相机位置
  update() {
    // 球坐标系转笛卡尔坐标系
    const x = this.radius * Math.sin(this.phi) * Math.cos(this.theta);
    const y = this.radius * Math.cos(this.phi);
    const z = this.radius * Math.sin(this.phi) * Math.sin(this.theta);
    
    const eyeX = this.target.x + x;
    const eyeY = this.target.y + y;
    const eyeZ = this.target.z + z;
    
    return Matrix.lookAt(
      eyeX, eyeY, eyeZ,
      this.target.x, this.target.y, this.target.z,
      0, 1, 0
    );
  }
  
  // 旋转相机
  rotate(deltaTheta, deltaPhi) {
    this.theta += deltaTheta;
    this.phi = Math.max(0.1, Math.min(Math.PI - 0.1, this.phi + deltaPhi));
  }
  
  // 缩放（改变距离）
  zoom(delta) {
    this.radius = Math.max(1.0, Math.min(20.0, this.radius + delta));
  }
}

// 使用示例
const camera = new OrbitCamera(0, 0, 0);
camera.rotate(0.01, 0);  // 水平旋转
const viewMatrix = camera.update();`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">2. 第一人称相机（FPS Camera）</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          第一人称相机可以自由移动和旋转，常用于第一人称游戏。
        </p>
        
        <CodeBlock title="第一人称相机实现" code={`class FPSCamera {
  constructor(x, y, z) {
    this.position = { x, y, z };
    this.yaw = 0;      // 左右旋转（绕 Y 轴）
    this.pitch = 0;    // 上下旋转（绕 X 轴）
  }
  
  // 更新视图矩阵
  update() {
    // 计算前方向量
    const forwardX = Math.sin(this.yaw) * Math.cos(this.pitch);
    const forwardY = -Math.sin(this.pitch);
    const forwardZ = -Math.cos(this.yaw) * Math.cos(this.pitch);
    
    const targetX = this.position.x + forwardX;
    const targetY = this.position.y + forwardY;
    const targetZ = this.position.z + forwardZ;
    
    return Matrix.lookAt(
      this.position.x, this.position.y, this.position.z,
      targetX, targetY, targetZ,
      0, 1, 0
    );
  }
  
  // 移动
  move(forward, right, up) {
    const forwardX = Math.sin(this.yaw);
    const forwardZ = -Math.cos(this.yaw);
    const rightX = Math.cos(this.yaw);
    const rightZ = Math.sin(this.yaw);
    
    this.position.x += forwardX * forward + rightX * right;
    this.position.y += up;
    this.position.z += forwardZ * forward + rightZ * right;
  }
  
  // 旋转
  rotate(deltaYaw, deltaPitch) {
    this.yaw += deltaYaw;
    this.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.pitch + deltaPitch));
  }
}

// 使用示例
const camera = new FPSCamera(0, 0, 5);
camera.rotate(0.01, 0);  // 旋转
camera.move(0.1, 0, 0);  // 向前移动
const viewMatrix = camera.update();`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">3. 交互式轨道相机示例</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          下面是一个可以用鼠标控制的轨道相机示例：
        </p>
        
        <WebGLCanvas width={400} height={400} onInit={(gl: WebGLRenderingContext, canvas: HTMLCanvasElement) => {
          const vertexShader = `attribute vec3 a_position;
uniform mat4 u_mvpMatrix;

void main() {
  gl_Position = u_mvpMatrix * vec4(a_position, 1.0);
}`
          
          const fragmentShader = `precision mediump float;
uniform vec4 u_color;

void main() {
  gl_FragColor = u_color;
}`
          
          const program = createProgram(gl, vertexShader, fragmentShader)
          
          // 立方体顶点
          const positions = [
            -0.5, -0.5,  0.5,  0.5, -0.5,  0.5,  0.5,  0.5,  0.5,  -0.5,  0.5,  0.5,
            -0.5, -0.5, -0.5,  -0.5,  0.5, -0.5,  0.5,  0.5, -0.5,  0.5, -0.5, -0.5,
            -0.5,  0.5, -0.5,  -0.5,  0.5,  0.5,  0.5,  0.5,  0.5,  0.5,  0.5, -0.5,
            -0.5, -0.5, -0.5,  0.5, -0.5, -0.5,  0.5, -0.5,  0.5,  -0.5, -0.5,  0.5,
             0.5, -0.5, -0.5,  0.5,  0.5, -0.5,  0.5,  0.5,  0.5,  0.5, -0.5,  0.5,
            -0.5, -0.5, -0.5,  -0.5, -0.5,  0.5,  -0.5,  0.5,  0.5,  -0.5,  0.5, -0.5,
          ]
          
          const indices = [
            0,  1,  2,   0,  2,  3,   4,  5,  6,   4,  6,  7,
            8,  9,  10,  8,  10, 11,  12, 13, 14,  12, 14, 15,
            16, 17, 18,  16, 18, 19,  20, 21, 22,  20, 22, 23,
          ]
          
          const positionBuffer = createBuffer(gl, positions)
          const indexBuffer = createIndexBuffer(gl, indices)
          
          const mvpMatrixLocation = gl.getUniformLocation(program, 'u_mvpMatrix')
          const colorLocation = gl.getUniformLocation(program, 'u_color')
          const positionLocation = gl.getAttribLocation(program, 'a_position')
          
          if (positionLocation === -1) {
            console.error('属性 a_position 未找到')
            return
          }
          
          gl.viewport(0, 0, canvas.width, canvas.height)
          gl.enable(gl.DEPTH_TEST)
          gl.clearColor(0.1, 0.1, 0.1, 1.0)
          
          const aspect = canvas.width / canvas.height
          const projectionMatrix = Matrix.perspective(Math.PI / 4, aspect, 0.1, 100)
          
          // 轨道相机参数
          let radius = 3
          let theta = 0
          let phi = Math.PI / 4
          let isDragging = false
          let lastX = 0
          let lastY = 0
          
          // 鼠标事件
          canvas.addEventListener('mousedown', (e) => {
            isDragging = true
            lastX = e.clientX
            lastY = e.clientY
          })
          
          canvas.addEventListener('mousemove', (e) => {
            if (isDragging) {
              const deltaX = e.clientX - lastX
              const deltaY = e.clientY - lastY
              
              theta += deltaX * 0.01
              phi = Math.max(0.1, Math.min(Math.PI - 0.1, phi + deltaY * 0.01))
              
              lastX = e.clientX
              lastY = e.clientY
            }
          })
          
          canvas.addEventListener('mouseup', () => {
            isDragging = false
          })
          
          canvas.addEventListener('wheel', (e) => {
            e.preventDefault()
            radius += e.deltaY * 0.01
            radius = Math.max(1, Math.min(10, radius))
          })
          
          const render = () => {
            // 计算相机位置
            const eyeX = radius * Math.sin(phi) * Math.cos(theta)
            const eyeY = radius * Math.cos(phi)
            const eyeZ = radius * Math.sin(phi) * Math.sin(theta)
            
            const viewMatrix = Matrix.lookAt(eyeX, eyeY, eyeZ, 0, 0, 0, 0, 1, 0)
            const modelMatrix = Matrix.identity()
            const mvpMatrix = Matrix.multiply(projectionMatrix, Matrix.multiply(viewMatrix, modelMatrix))
            
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
            gl.useProgram(program)
            
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
            gl.enableVertexAttribArray(positionLocation)
            gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0)
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
            
            gl.uniformMatrix4fv(mvpMatrixLocation, false, mvpMatrix)
            gl.uniform4f(colorLocation, 0.2, 0.6, 1.0, 1.0)
            
            gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0)
            requestAnimationFrame(render)
          }
          render()
        }} />
        
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          尝试用鼠标拖动来旋转相机，用滚轮来缩放。这是轨道相机的典型交互方式。
        </p>
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
