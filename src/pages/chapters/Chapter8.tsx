import { useEffect, useRef } from 'react'
import WebGLCanvas from '../../components/WebGLCanvas'
import CodeBlock from '../../components/CodeBlock'
import ChapterNavigation from '../../components/ChapterNavigation'
import { createProgram, createBuffer, setAttribute, Matrix } from '../../utils/webgl'

export default function Chapter8() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl mb-8 text-primary border-b-2 border-dark-border dark:border-dark-border border-light-border pb-4">第八章：交互与动画</h1>
      
      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">动画循环</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          在 WebGL 中创建动画，我们需要使用 <code>requestAnimationFrame</code> 来创建渲染循环。
          这比使用 <code>setInterval</code> 更好，因为它会与浏览器的刷新率同步。
        </p>
        
        <CodeBlock title="动画循环示例" code={`function render() {
  // 更新动画状态
  time += 0.02;
  angle += 0.01;
  
  // 清除画布
  gl.clear(gl.COLOR_BUFFER_BIT);
  
  // 更新变换矩阵
  const rotation = Matrix.rotationZ(angle);
  
  // 绘制场景
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  
  // 请求下一帧
  requestAnimationFrame(render);
}

// 启动动画循环
render();`} language="javascript" />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">基于时间的动画</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          使用时间而不是帧数来控制动画，可以确保动画速度在不同设备上保持一致。
        </p>
        
        <CodeBlock title="基于时间的动画" code={`let lastTime = 0;

function render(currentTime) {
  // 转换为秒
  const timeInSeconds = currentTime * 0.001;
  
  // 计算时间差
  const deltaTime = timeInSeconds - lastTime;
  lastTime = timeInSeconds;
  
  // 使用时间更新动画
  const angle = timeInSeconds * Math.PI;  // 每秒旋转 180 度
  
  // 渲染...
  
  requestAnimationFrame(render);
}

requestAnimationFrame(render);`} language="javascript" />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">鼠标交互</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          通过监听鼠标事件，我们可以实现交互式控制，比如旋转相机、移动物体等。
        </p>
        
        <CodeBlock title="鼠标控制示例" code={`let mouseX = 0;
let mouseY = 0;
let isDragging = false;

canvas.addEventListener('mousedown', (e) => {
  isDragging = true;
  mouseX = e.clientX;
  mouseY = e.clientY;
});

canvas.addEventListener('mousemove', (e) => {
  if (isDragging) {
    const deltaX = e.clientX - mouseX;
    const deltaY = e.clientY - mouseY;
    
    // 更新旋转角度
    rotationY += deltaX * 0.01;
    rotationX += deltaY * 0.01;
    
    mouseX = e.clientX;
    mouseY = e.clientY;
  }
});

canvas.addEventListener('mouseup', () => {
  isDragging = false;
});`} language="javascript" />
        
        <WebGLCanvas width={400} height={400} onInit={(gl: WebGLRenderingContext, canvas: HTMLCanvasElement) => {
          const vertexShader = `attribute vec2 a_position;
uniform mat4 u_matrix;

void main() {
  gl_Position = u_matrix * vec4(a_position, 0.0, 1.0);
}`
          
          const fragmentShader = `precision mediump float;
uniform vec4 u_color;

void main() {
  gl_FragColor = u_color;
}`
          
          const program = createProgram(gl, vertexShader, fragmentShader)
          const positions = [0, 0.3, -0.3, -0.3, 0.3, -0.3]
          const positionBuffer = createBuffer(gl, positions)
          
          const matrixLocation = gl.getUniformLocation(program, 'u_matrix')
          const colorLocation = gl.getUniformLocation(program, 'u_color')
          const positionLocation = gl.getAttribLocation(program, 'a_position')
          
          if (positionLocation === -1) {
            console.error('属性 a_position 未找到')
            return
          }
          
          gl.viewport(0, 0, canvas.width, canvas.height)
          gl.clearColor(0.1, 0.1, 0.1, 1.0)
          
          let angle = 0
          let mouseX = 0
          let mouseY = 0
          let isDragging = false
          
          canvas.addEventListener('mousedown', (e) => {
            isDragging = true
            const rect = canvas.getBoundingClientRect()
            mouseX = e.clientX - rect.left
            mouseY = e.clientY - rect.top
          })
          
          canvas.addEventListener('mousemove', (e) => {
            if (isDragging) {
              const rect = canvas.getBoundingClientRect()
              const newX = e.clientX - rect.left
              const newY = e.clientY - rect.top
              angle += (newX - mouseX) * 0.01
              mouseX = newX
              mouseY = newY
            }
          })
          
          canvas.addEventListener('mouseup', () => {
            isDragging = false
          })
          
          canvas.addEventListener('mouseleave', () => {
            isDragging = false
          })
          
          const render = () => {
            const rotation = Matrix.rotationZ(angle)
            
            gl.clear(gl.COLOR_BUFFER_BIT)
            gl.useProgram(program)
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
            gl.enableVertexAttribArray(positionLocation)
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
            
            gl.uniformMatrix4fv(matrixLocation, false, rotation)
            gl.uniform4f(colorLocation, 0.2, 0.6, 1.0, 1.0)
            gl.drawArrays(gl.TRIANGLES, 0, 3)
            
            requestAnimationFrame(render)
          }
          render()
        }} />
        
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          尝试用鼠标拖动上面的三角形来旋转它。
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">键盘控制</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          键盘事件可以用于控制相机移动、切换模式等。
        </p>
        
        <CodeBlock title="键盘控制示例" code={`const keys = {};

window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

function updateCamera() {
  if (keys['w'] || keys['W']) {
    cameraZ -= 0.1;  // 向前移动
  }
  if (keys['s'] || keys['S']) {
    cameraZ += 0.1;  // 向后移动
  }
  if (keys['a'] || keys['A']) {
    cameraX -= 0.1;  // 向左移动
  }
  if (keys['d'] || keys['D']) {
    cameraX += 0.1;  // 向右移动
  }
}`} language="javascript" />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">触摸支持</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          为了支持移动设备，我们需要处理触摸事件。
        </p>
        
        <CodeBlock title="触摸事件处理" code={`let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
});

canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  const deltaX = touch.clientX - touchStartX;
  const deltaY = touch.clientY - touchStartY;
  
  // 更新旋转角度
  rotationY += deltaX * 0.01;
  rotationX += deltaY * 0.01;
  
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
});`} language="javascript" />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">动画插值与缓动函数</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          使用插值和缓动函数可以让动画更加平滑自然。不同的缓动函数会产生不同的动画效果。
        </p>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">基础插值函数</h3>
        <CodeBlock title="插值函数" code={`// 线性插值（Linear Interpolation）
function lerp(start, end, t) {
  return start + (end - start) * t;
}

// 平滑步进（Smoothstep）
function smoothstep(edge0, edge1, x) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3.0 - 2.0 * t);
}

// 使用示例
let targetAngle = 0;
let currentAngle = 0;

function update() {
  // 平滑过渡到目标角度
  currentAngle = lerp(currentAngle, targetAngle, 0.1);
}`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">缓动函数（Easing Functions）</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          缓动函数控制动画的速度曲线，让动画看起来更自然：
        </p>
        
        <CodeBlock title="常用缓动函数" code={`// Ease In（慢进快出）
function easeIn(t) {
  return t * t;
}

// Ease Out（快进慢出）
function easeOut(t) {
  return t * (2 - t);
}

// Ease In Out（慢进慢出）
function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// 弹性缓动（Elastic）
function elastic(t) {
  return Math.pow(2, -10 * t) * Math.sin((t - 0.075) * (2 * Math.PI) / 0.3) + 1;
}

// 反弹缓动（Bounce）
function bounce(t) {
  if (t < 1 / 2.75) {
    return 7.5625 * t * t;
  } else if (t < 2 / 2.75) {
    return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
  } else if (t < 2.5 / 2.75) {
    return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
  } else {
    return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
  }
}

// 使用示例
function animate(start, end, duration, easing) {
  const startTime = performance.now();
  
  function update() {
    const elapsed = performance.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easing(progress);
    const current = lerp(start, end, eased);
    
    // 更新对象位置
    object.position = current;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  update();
}`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">缓动动画示例</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          下面是一个使用不同缓动函数的动画示例：
        </p>
        
        <WebGLCanvas width={400} height={400} onInit={(gl: WebGLRenderingContext, canvas: HTMLCanvasElement) => {
          const vertexShader = `attribute vec2 a_position;
uniform mat4 u_matrix;

void main() {
  gl_Position = u_matrix * vec4(a_position, 0.0, 1.0);
}`
          
          const fragmentShader = `precision mediump float;
uniform vec4 u_color;

void main() {
  gl_FragColor = u_color;
}`
          
          const program = createProgram(gl, vertexShader, fragmentShader)
          const positions = [0, 0.1, -0.1, -0.1, 0.1, -0.1]
          const positionBuffer = createBuffer(gl, positions)
          
          const matrixLocation = gl.getUniformLocation(program, 'u_matrix')
          const colorLocation = gl.getUniformLocation(program, 'u_color')
          const positionLocation = gl.getAttribLocation(program, 'a_position')
          
          if (positionLocation === -1) {
            console.error('属性 a_position 未找到')
            return
          }
          
          gl.viewport(0, 0, canvas.width, canvas.height)
          gl.clearColor(0.1, 0.1, 0.1, 1.0)
          
          // 缓动函数
          const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
          
          let time = 0
          const render = () => {
            time += 0.02
            const t = (Math.sin(time) + 1) / 2 // 0 到 1 之间循环
            const eased = easeInOut(t)
            
            // 使用缓动值控制位置
            const x = (eased - 0.5) * 0.6
            const translation = Matrix.translation(x, 0, 0)
            
            gl.clear(gl.COLOR_BUFFER_BIT)
            gl.useProgram(program)
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
            gl.enableVertexAttribArray(positionLocation)
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
            
            gl.uniformMatrix4fv(matrixLocation, false, translation)
            gl.uniform4f(colorLocation, 0.2, 0.6, 1.0, 1.0)
            gl.drawArrays(gl.TRIANGLES, 0, 3)
            
            requestAnimationFrame(render)
          }
          render()
        }} />
        
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          上面的示例使用了 easeInOut 缓动函数，注意观察三角形移动的速度变化：开始时加速，中间匀速，结束时减速。
        </p>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">动画状态管理</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          在实际应用中，我们需要管理动画状态：
        </p>
        
        <CodeBlock title="动画状态管理" code={`class Animation {
  constructor(start, end, duration, easing) {
    this.start = start;
    this.end = end;
    this.duration = duration;
    this.easing = easing;
    this.startTime = null;
    this.isRunning = false;
  }
  
  start() {
    this.startTime = performance.now();
    this.isRunning = true;
  }
  
  update() {
    if (!this.isRunning) return this.start;
    
    const elapsed = performance.now() - this.startTime;
    const progress = Math.min(elapsed / this.duration, 1);
    
    if (progress >= 1) {
      this.isRunning = false;
      return this.end;
    }
    
    const eased = this.easing(progress);
    return this.start + (this.end - this.start) * eased;
  }
  
  stop() {
    this.isRunning = false;
  }
}

// 使用示例
const anim = new Animation(0, 100, 1000, easeInOut);
anim.start();

function render() {
  const value = anim.update();
  // 使用 value 更新对象位置
  requestAnimationFrame(render);
}`} language="javascript" />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">关键概念总结</h2>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">requestAnimationFrame</strong>：创建动画循环的最佳方式</li>
          <li><strong className="text-primary font-semibold">基于时间的动画</strong>：确保动画速度一致</li>
          <li><strong className="text-primary font-semibold">鼠标交互</strong>：实现拖拽、旋转等操作</li>
          <li><strong className="text-primary font-semibold">键盘控制</strong>：实现移动、切换等功能</li>
          <li><strong className="text-primary font-semibold">触摸支持</strong>：支持移动设备</li>
          <li><strong className="text-primary font-semibold">动画插值</strong>：让动画更平滑</li>
        </ul>
      </section>
      
      <ChapterNavigation />
    </div>
  )
}

