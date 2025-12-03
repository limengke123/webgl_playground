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
            setAttribute(gl, program, 'a_position', 2)
            
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
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">动画插值</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          使用插值函数可以让动画更加平滑自然。
        </p>
        
        <CodeBlock title="插值函数" code={`// 线性插值
function lerp(start, end, t) {
  return start + (end - start) * t;
}

// 平滑步进
function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
  return t * t * (3.0 - 2.0 * t);
}

// 使用示例
let targetAngle = 0;
let currentAngle = 0;

function update() {
  // 平滑过渡到目标角度
  currentAngle = lerp(currentAngle, targetAngle, 0.1);
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

