import { useEffect, useRef } from 'react'
import WebGLCanvas from '../../components/WebGLCanvas'
import CodeBlock from '../../components/CodeBlock'
import ChapterNavigation from '../../components/ChapterNavigation'
import { createProgram, createBuffer, setAttribute, Matrix } from '../../utils/webgl'

export default function Chapter8() {
  return (
    <div className="w-full">
      <h1 className="text-4xl mb-8 text-primary border-b-2 border-dark-border dark:border-dark-border border-light-border pb-4">第八章：交互与动画</h1>
      
      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">动画循环</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          在 WebGL 中创建动画，我们需要使用 <code className="bg-dark-bg dark:bg-dark-bg px-1 py-0.5 rounded">requestAnimationFrame</code> 来创建渲染循环。
          这比使用 <code className="bg-dark-bg dark:bg-dark-bg px-1 py-0.5 rounded">setInterval</code> 更好，因为它会与浏览器的刷新率同步，提供更流畅的动画。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">requestAnimationFrame 的优势</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>与浏览器刷新率同步（通常 60 FPS）</li>
          <li>当标签页不可见时自动暂停，节省资源</li>
          <li>浏览器可以优化渲染时机</li>
          <li>避免过度渲染（不会在不可见时渲染）</li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">基础动画循环</h3>
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
render();

// ========== 更完善的版本 ==========
let animationId = null;
let isRunning = false;

function startAnimation() {
  if (isRunning) return;
  isRunning = true;
  
  function render() {
    if (!isRunning) return;
    
    // 更新和渲染
    update();
    draw();
    
    // 请求下一帧
    animationId = requestAnimationFrame(render);
  }
  
  render();
}

function stopAnimation() {
  isRunning = false;
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}

// 使用示例
startAnimation();
// 稍后停止
// stopAnimation();`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">性能监控</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          监控帧率和性能：
        </p>
        <CodeBlock title="性能监控" code={`let frameCount = 0;
let lastTime = performance.now();
let fps = 0;

function render() {
  frameCount++;
  const currentTime = performance.now();
  
  // 每秒更新一次 FPS
  if (currentTime >= lastTime + 1000) {
    fps = frameCount;
    frameCount = 0;
    lastTime = currentTime;
    console.log('FPS:', fps);
  }
  
  // 渲染场景
  draw();
  
  requestAnimationFrame(render);
}

// 更详细的性能监控
class PerformanceMonitor {
  constructor() {
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fps = 0;
    this.frameTime = 0;
    this.frameTimes = [];
  }
  
  update() {
    const currentTime = performance.now();
    this.frameTime = currentTime - this.lastTime;
    this.frameTimes.push(this.frameTime);
    
    // 保持最近 60 帧的数据
    if (this.frameTimes.length > 60) {
      this.frameTimes.shift();
    }
    
    this.frameCount++;
    
    if (currentTime >= this.lastTime + 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastTime = currentTime;
      
      // 计算平均帧时间
      const avgFrameTime = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
      
      console.log('FPS:', this.fps);
      console.log('平均帧时间:', avgFrameTime.toFixed(2), 'ms');
    }
  }
  
  getStats() {
    return {
      fps: this.fps,
      frameTime: this.frameTime,
      avgFrameTime: this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length
    };
  }
}

const perfMonitor = new PerformanceMonitor();

function render() {
  perfMonitor.update();
  draw();
  requestAnimationFrame(render);
}`} language="javascript" />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">基于时间的动画</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          使用时间而不是帧数来控制动画，可以确保动画速度在不同设备上保持一致。
          这对于创建可预测和一致的动画效果至关重要。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">为什么使用基于时间的动画？</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>不同设备的帧率不同（60 FPS、120 FPS、30 FPS 等）</li>
          <li>基于帧数的动画会在不同设备上速度不同</li>
          <li>基于时间的动画在所有设备上速度一致</li>
          <li>可以处理帧率波动（掉帧时动画不会变慢）</li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">基础实现</h3>
        <CodeBlock title="基于时间的动画" code={`let lastTime = 0;

function render(currentTime) {
  // currentTime 是毫秒，转换为秒
  const timeInSeconds = currentTime * 0.001;
  
  // 计算时间差（Delta Time）
  const deltaTime = timeInSeconds - lastTime;
  lastTime = timeInSeconds;
  
  // 使用时间更新动画
  const angle = timeInSeconds * Math.PI;  // 每秒旋转 180 度
  
  // 或者使用 deltaTime（更灵活）
  // angle += deltaTime * Math.PI;  // 每秒旋转 180 度
  
  // 渲染...
  draw();
  
  requestAnimationFrame(render);
}

requestAnimationFrame(render);

// ========== 更完善的版本 ==========
class TimeBasedAnimation {
  constructor() {
    this.startTime = performance.now();
    this.lastTime = 0;
    this.deltaTime = 0;
    this.totalTime = 0;
    this.paused = false;
    this.pauseTime = 0;
  }
  
  update() {
    const currentTime = performance.now();
    
    if (this.paused) {
      this.pauseTime += currentTime - this.lastTime;
      this.lastTime = currentTime;
      return;
    }
    
    // 计算总时间（排除暂停时间）
    this.totalTime = (currentTime - this.startTime - this.pauseTime) * 0.001;
    
    // 计算时间差
    this.deltaTime = (currentTime - this.lastTime) * 0.001;
    this.lastTime = currentTime;
    
    // 限制 deltaTime（防止长时间暂停后的大跳跃）
    if (this.deltaTime > 0.1) {
      this.deltaTime = 0.1;  // 最大 100ms
    }
  }
  
  pause() {
    this.paused = true;
  }
  
  resume() {
    this.paused = false;
    this.lastTime = performance.now();
  }
  
  reset() {
    this.startTime = performance.now();
    this.lastTime = 0;
    this.deltaTime = 0;
    this.totalTime = 0;
    this.pauseTime = 0;
  }
  
  getTime() {
    return this.totalTime;
  }
  
  getDeltaTime() {
    return this.deltaTime;
  }
}

const timeAnim = new TimeBasedAnimation();

function render() {
  timeAnim.update();
  
  // 使用总时间
  const angle = timeAnim.getTime() * Math.PI;
  
  // 或使用时间差
  // angle += timeAnim.getDeltaTime() * Math.PI;
  
  draw();
  requestAnimationFrame(render);
}`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">时间缩放和暂停</h3>
        <CodeBlock title="时间缩放" code={`class TimeController {
  constructor() {
    this.timeScale = 1.0;  // 时间缩放（1.0 = 正常，2.0 = 2倍速，0.5 = 0.5倍速）
    this.paused = false;
    this.startTime = performance.now();
    this.pauseStartTime = 0;
    this.totalPauseTime = 0;
  }
  
  update() {
    if (this.paused) {
      if (this.pauseStartTime === 0) {
        this.pauseStartTime = performance.now();
      }
      return;
    }
    
    if (this.pauseStartTime !== 0) {
      this.totalPauseTime += performance.now() - this.pauseStartTime;
      this.pauseStartTime = 0;
    }
    
    const currentTime = (performance.now() - this.startTime - this.totalPauseTime) * 0.001;
    return currentTime * this.timeScale;
  }
  
  setTimeScale(scale) {
    this.timeScale = scale;
  }
  
  pause() {
    this.paused = true;
  }
  
  resume() {
    this.paused = false;
  }
  
  reset() {
    this.startTime = performance.now();
    this.totalPauseTime = 0;
    this.pauseStartTime = 0;
  }
}

const timeController = new TimeController();

function render() {
  const time = timeController.update();
  
  // 使用缩放后的时间
  const angle = time * Math.PI;
  
  draw();
  requestAnimationFrame(render);
}

// 使用示例
timeController.setTimeScale(0.5);  // 慢动作
timeController.setTimeScale(2.0);  // 快进
timeController.pause();             // 暂停
timeController.resume();            // 恢复`} language="javascript" />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">鼠标交互</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          通过监听鼠标事件，我们可以实现交互式控制，比如旋转相机、移动物体、缩放等。
          鼠标交互是 3D 应用中最常见的交互方式之一。
        </p>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">基础鼠标拖拽</h3>
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
});

canvas.addEventListener('mouseleave', () => {
  isDragging = false;  // 鼠标离开画布时停止拖拽
});`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">鼠标滚轮缩放</h3>
        <CodeBlock title="鼠标滚轮缩放" code={`let zoom = 1.0;
const zoomSpeed = 0.1;
const minZoom = 0.1;
const maxZoom = 10.0;

canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  
  // 计算缩放增量
  const delta = e.deltaY > 0 ? -zoomSpeed : zoomSpeed;
  zoom = Math.max(minZoom, Math.min(maxZoom, zoom + delta));
  
  // 更新相机距离或缩放
  cameraDistance = zoom;
  
  // 或者更新投影矩阵的视野
  // fov = Math.max(10, Math.min(90, fov + delta * 10));
});

// 更平滑的缩放
let targetZoom = 1.0;
let currentZoom = 1.0;

canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  const delta = e.deltaY > 0 ? -zoomSpeed : zoomSpeed;
  targetZoom = Math.max(minZoom, Math.min(maxZoom, targetZoom + delta));
});

function update() {
  // 平滑过渡到目标缩放
  currentZoom += (targetZoom - currentZoom) * 0.1;
  cameraDistance = currentZoom;
}`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">鼠标坐标转换</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          将鼠标坐标转换为 WebGL 坐标系统：
        </p>
        <CodeBlock title="坐标转换" code={`// 将鼠标坐标转换为 WebGL 坐标（-1 到 1）
function mouseToWebGL(mouseX, mouseY, canvas) {
  const rect = canvas.getBoundingClientRect();
  
  // 获取鼠标在画布中的位置
  const x = mouseX - rect.left;
  const y = mouseY - rect.top;
  
  // 转换为 WebGL 坐标（-1 到 1）
  const webglX = (x / rect.width) * 2 - 1;
  const webglY = 1 - (y / rect.height) * 2;  // Y 轴翻转
  
  return { x: webglX, y: webglY };
}

// 使用示例
canvas.addEventListener('mousemove', (e) => {
  const webglPos = mouseToWebGL(e.clientX, e.clientY, canvas);
  console.log('WebGL 坐标:', webglPos.x, webglPos.y);
});

// 将 WebGL 坐标转换为世界坐标（需要投影矩阵和视图矩阵）
function webGLToWorld(webglX, webglY, projectionMatrix, viewMatrix) {
  // 创建齐次坐标
  const clipPos = [webglX, webglY, -1, 1];
  
  // 逆投影变换
  const invProjection = Matrix.inverse(projectionMatrix);
  const viewPos = Matrix.multiplyVector(invProjection, clipPos);
  
  // 逆视图变换
  const invView = Matrix.inverse(viewMatrix);
  const worldPos = Matrix.multiplyVector(invView, viewPos);
  
  return worldPos;
}`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">轨道控制器（Orbit Controls）</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          实现一个完整的轨道控制器，支持旋转、缩放和平移：
        </p>
        <CodeBlock title="轨道控制器" code={`class OrbitControls {
  constructor(canvas, camera) {
    this.canvas = canvas;
    this.camera = camera;
    
    // 旋转角度
    this.rotationX = 0;
    this.rotationY = 0;
    
    // 相机距离
    this.distance = 5;
    this.targetDistance = 5;
    
    // 鼠标状态
    this.isDragging = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    
    // 旋转速度
    this.rotationSpeed = 0.01;
    
    // 缩放速度
    this.zoomSpeed = 0.1;
    this.minDistance = 1;
    this.maxDistance = 20;
    
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    // 鼠标按下
    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
    });
    
    // 鼠标移动
    this.canvas.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        const deltaX = e.clientX - this.lastMouseX;
        const deltaY = e.clientY - this.lastMouseY;
        
        this.rotationY += deltaX * this.rotationSpeed;
        this.rotationX += deltaY * this.rotationSpeed;
        
        // 限制 X 轴旋转（避免翻转）
        this.rotationX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.rotationX));
        
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
      }
    });
    
    // 鼠标释放
    this.canvas.addEventListener('mouseup', () => {
      this.isDragging = false;
    });
    
    this.canvas.addEventListener('mouseleave', () => {
      this.isDragging = false;
    });
    
    // 滚轮缩放
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -this.zoomSpeed : this.zoomSpeed;
      this.targetDistance = Math.max(
        this.minDistance,
        Math.min(this.maxDistance, this.targetDistance + delta)
      );
    });
  }
  
  update() {
    // 平滑缩放
    this.distance += (this.targetDistance - this.distance) * 0.1;
    
    // 计算相机位置（球坐标系）
    const x = Math.sin(this.rotationX) * Math.cos(this.rotationY) * this.distance;
    const y = Math.cos(this.rotationX) * this.distance;
    const z = Math.sin(this.rotationX) * Math.sin(this.rotationY) * this.distance;
    
    // 更新相机
    this.camera.position = [x, y, z];
    this.camera.lookAt([0, 0, 0]);
  }
}

// 使用示例
const controls = new OrbitControls(canvas, camera);

function render() {
  controls.update();
  draw();
  requestAnimationFrame(render);
}`} language="javascript" />
        
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
          键盘事件可以用于控制相机移动、切换模式、触发动作等。
          键盘控制是游戏和交互式应用中的重要组成部分。
        </p>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">基础键盘控制</h3>
        <CodeBlock title="键盘控制示例" code={`const keys = {};

window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
  // 防止默认行为（如空格键滚动页面）
  if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    e.preventDefault();
  }
});

window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

function updateCamera() {
  const speed = 0.1;
  
  if (keys['w'] || keys['W'] || keys['ArrowUp']) {
    cameraZ -= speed;  // 向前移动
  }
  if (keys['s'] || keys['S'] || keys['ArrowDown']) {
    cameraZ += speed;  // 向后移动
  }
  if (keys['a'] || keys['A'] || keys['ArrowLeft']) {
    cameraX -= speed;  // 向左移动
  }
  if (keys['d'] || keys['D'] || keys['ArrowRight']) {
    cameraX += speed;  // 向右移动
  }
  if (keys['q'] || keys['Q']) {
    cameraY += speed;  // 向上移动
  }
  if (keys['e'] || keys['E']) {
    cameraY -= speed;  // 向下移动
  }
}`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">基于时间的键盘控制</h3>
        <CodeBlock title="基于时间的键盘控制" code={`class KeyboardController {
  constructor() {
    this.keys = {};
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
      this.keys[e.code] = true;  // 也使用 keyCode
      
      // 防止默认行为
      if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
    });
    
    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
      this.keys[e.code] = false;
    });
    
    // 窗口失去焦点时清除所有按键状态
    window.addEventListener('blur', () => {
      this.keys = {};
    });
  }
  
  isPressed(key) {
    return this.keys[key.toLowerCase()] === true || this.keys[key] === true;
  }
  
  // 获取移动向量（WASD）
  getMovementVector(deltaTime) {
    const speed = 5.0;  // 单位/秒
    const moveSpeed = speed * deltaTime;
    
    let x = 0, y = 0, z = 0;
    
    if (this.isPressed('w') || this.isPressed('ArrowUp')) z -= moveSpeed;
    if (this.isPressed('s') || this.isPressed('ArrowDown')) z += moveSpeed;
    if (this.isPressed('a') || this.isPressed('ArrowLeft')) x -= moveSpeed;
    if (this.isPressed('d') || this.isPressed('ArrowRight')) x += moveSpeed;
    if (this.isPressed('q')) y += moveSpeed;
    if (this.isPressed('e')) y -= moveSpeed;
    
    return [x, y, z];
  }
}

const keyboard = new KeyboardController();

function render(currentTime) {
  const deltaTime = (currentTime - lastTime) * 0.001;
  lastTime = currentTime;
  
  // 获取移动向量
  const movement = keyboard.getMovementVector(deltaTime);
  camera.position[0] += movement[0];
  camera.position[1] += movement[1];
  camera.position[2] += movement[2];
  
  draw();
  requestAnimationFrame(render);
}`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">第一人称相机控制</h3>
        <CodeBlock title="第一人称相机控制" code={`class FirstPersonCamera {
  constructor(canvas) {
    this.canvas = canvas;
    this.position = [0, 0, 5];
    this.rotationX = 0;  // 俯仰角（Pitch）
    this.rotationY = 0;  // 偏航角（Yaw）
    
    this.keys = {};
    this.mouseSensitivity = 0.002;
    this.moveSpeed = 5.0;
    
    this.setupControls();
  }
  
  setupControls() {
    // 键盘控制
    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
    });
    
    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });
    
    // 鼠标控制视角
    let isMouseDown = false;
    let lastMouseX = 0;
    let lastMouseY = 0;
    
    this.canvas.addEventListener('mousedown', (e) => {
      isMouseDown = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      this.canvas.requestPointerLock();  // 锁定鼠标指针
    });
    
    this.canvas.addEventListener('mousemove', (e) => {
      if (isMouseDown || document.pointerLockElement === this.canvas) {
        const deltaX = e.movementX || e.clientX - lastMouseX;
        const deltaY = e.movementY || e.clientY - lastMouseY;
        
        this.rotationY -= deltaX * this.mouseSensitivity;
        this.rotationX -= deltaY * this.mouseSensitivity;
        
        // 限制俯仰角
        this.rotationX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.rotationX));
        
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
      }
    });
    
    document.addEventListener('pointerlockchange', () => {
      if (document.pointerLockElement !== this.canvas) {
        isMouseDown = false;
      }
    });
  }
  
  update(deltaTime) {
    // 计算移动方向（基于旋转）
    const forward = [
      Math.sin(this.rotationY),
      0,
      Math.cos(this.rotationY)
    ];
    
    const right = [
      Math.cos(this.rotationY),
      0,
      -Math.sin(this.rotationY)
    ];
    
    const moveSpeed = this.moveSpeed * deltaTime;
    const move = [0, 0, 0];
    
    if (this.keys['w']) {
      move[0] += forward[0] * moveSpeed;
      move[2] += forward[2] * moveSpeed;
    }
    if (this.keys['s']) {
      move[0] -= forward[0] * moveSpeed;
      move[2] -= forward[2] * moveSpeed;
    }
    if (this.keys['a']) {
      move[0] -= right[0] * moveSpeed;
      move[2] -= right[2] * moveSpeed;
    }
    if (this.keys['d']) {
      move[0] += right[0] * moveSpeed;
      move[2] += right[2] * moveSpeed;
    }
    if (this.keys['q']) {
      move[1] += moveSpeed;
    }
    if (this.keys['e']) {
      move[1] -= moveSpeed;
    }
    
    this.position[0] += move[0];
    this.position[1] += move[1];
    this.position[2] += move[2];
  }
  
  getViewMatrix() {
    // 计算相机方向
    const cosX = Math.cos(this.rotationX);
    const sinX = Math.sin(this.rotationX);
    const cosY = Math.cos(this.rotationY);
    const sinY = Math.sin(this.rotationY);
    
    const forward = [
      sinY * cosX,
      -sinX,
      cosY * cosX
    ];
    
    const target = [
      this.position[0] + forward[0],
      this.position[1] + forward[1],
      this.position[2] + forward[2]
    ];
    
    return Matrix.lookAt(
      this.position[0], this.position[1], this.position[2],
      target[0], target[1], target[2],
      0, 1, 0
    );
  }
}

const camera = new FirstPersonCamera(canvas);

function render(currentTime) {
  const deltaTime = (currentTime - lastTime) * 0.001;
  lastTime = currentTime;
  
  camera.update(deltaTime);
  const viewMatrix = camera.getViewMatrix();
  
  draw();
  requestAnimationFrame(render);
}`} language="javascript" />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">触摸支持</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          为了支持移动设备，我们需要处理触摸事件。
          触摸事件与鼠标事件类似，但有一些重要的区别需要注意。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">触摸事件的特点</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>支持多点触摸（Multi-touch）</li>
          <li>触摸事件包括 touchstart、touchmove、touchend、touchcancel</li>
          <li>需要调用 preventDefault() 防止默认行为（如滚动、缩放）</li>
          <li>触摸坐标在 touches 数组中</li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">基础触摸控制</h3>
        <CodeBlock title="触摸事件处理" code={`let touchStartX = 0;
let touchStartY = 0;
let isTouching = false;

canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
  isTouching = true;
});

canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  if (!isTouching) return;
  
  const touch = e.touches[0];
  const deltaX = touch.clientX - touchStartX;
  const deltaY = touch.clientY - touchStartY;
  
  // 更新旋转角度
  rotationY += deltaX * 0.01;
  rotationX += deltaY * 0.01;
  
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
});

canvas.addEventListener('touchend', (e) => {
  e.preventDefault();
  isTouching = false;
});

canvas.addEventListener('touchcancel', (e) => {
  e.preventDefault();
  isTouching = false;  // 触摸被取消（如来电）
});`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">多点触摸支持</h3>
        <CodeBlock title="多点触摸（缩放和旋转）" code={`class TouchController {
  constructor(canvas) {
    this.canvas = canvas;
    this.touches = new Map();
    this.rotationX = 0;
    this.rotationY = 0;
    this.scale = 1.0;
    this.lastDistance = 0;
    
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        this.touches.set(touch.identifier, {
          x: touch.clientX,
          y: touch.clientY,
          startX: touch.clientX,
          startY: touch.clientY
        });
      }
      
      // 两个触摸点时，计算初始距离
      if (this.touches.size === 2) {
        this.lastDistance = this.getDistance();
      }
    });
    
    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      
      // 更新触摸点位置
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        const touchData = this.touches.get(touch.identifier);
        if (touchData) {
          touchData.x = touch.clientX;
          touchData.y = touch.clientY;
        }
      }
      
      if (this.touches.size === 1) {
        // 单点触摸：旋转
        const touch = Array.from(this.touches.values())[0];
        const deltaX = touch.x - touch.startX;
        const deltaY = touch.y - touch.startY;
        
        this.rotationY += deltaX * 0.01;
        this.rotationX += deltaY * 0.01;
        
        touch.startX = touch.x;
        touch.startY = touch.y;
      } else if (this.touches.size === 2) {
        // 两点触摸：缩放和旋转
        const touches = Array.from(this.touches.values());
        const distance = this.getDistance();
        
        // 缩放
        if (this.lastDistance > 0) {
          const scaleFactor = distance / this.lastDistance;
          this.scale *= scaleFactor;
          this.scale = Math.max(0.5, Math.min(3.0, this.scale));  // 限制缩放范围
        }
        this.lastDistance = distance;
        
        // 旋转（可选）
        // const angle = this.getAngle();
        // this.rotationY += angle * 0.01;
      }
    });
    
    this.canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      
      // 移除结束的触摸点
      for (let i = 0; i < e.changedTouches.length; i++) {
        this.touches.delete(e.changedTouches[i].identifier);
      }
      
      if (this.touches.size < 2) {
        this.lastDistance = 0;
      }
    });
    
    this.canvas.addEventListener('touchcancel', (e) => {
      e.preventDefault();
      this.touches.clear();
      this.lastDistance = 0;
    });
  }
  
  getDistance() {
    const touches = Array.from(this.touches.values());
    if (touches.length < 2) return 0;
    
    const dx = touches[1].x - touches[0].x;
    const dy = touches[1].y - touches[0].y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  getAngle() {
    const touches = Array.from(this.touches.values());
    if (touches.length < 2) return 0;
    
    const dx = touches[1].x - touches[0].x;
    const dy = touches[1].y - touches[0].y;
    return Math.atan2(dy, dx);
  }
}

const touchController = new TouchController(canvas);

function render() {
  // 使用触摸控制器的值
  const rotation = Matrix.multiply(
    Matrix.rotationX(touchController.rotationX),
    Matrix.rotationY(touchController.rotationY)
  );
  const scale = Matrix.scaling(touchController.scale, touchController.scale, touchController.scale);
  
  draw();
  requestAnimationFrame(render);
}`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">统一输入处理</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          创建一个统一的输入处理器，同时支持鼠标和触摸：
        </p>
        <CodeBlock title="统一输入处理器" code={`class InputController {
  constructor(canvas) {
    this.canvas = canvas;
    this.rotationX = 0;
    this.rotationY = 0;
    this.scale = 1.0;
    
    // 鼠标状态
    this.mouseX = 0;
    this.mouseY = 0;
    this.isMouseDown = false;
    
    // 触摸状态
    this.touches = new Map();
    this.lastTouchDistance = 0;
    
    this.setupMouseEvents();
    this.setupTouchEvents();
  }
  
  setupMouseEvents() {
    this.canvas.addEventListener('mousedown', (e) => {
      this.isMouseDown = true;
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });
    
    this.canvas.addEventListener('mousemove', (e) => {
      if (this.isMouseDown) {
        const deltaX = e.clientX - this.mouseX;
        const deltaY = e.clientY - this.mouseY;
        
        this.rotationY += deltaX * 0.01;
        this.rotationX += deltaY * 0.01;
        
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
      }
    });
    
    this.canvas.addEventListener('mouseup', () => {
      this.isMouseDown = false;
    });
    
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      this.scale = Math.max(0.5, Math.min(3.0, this.scale + delta));
    });
  }
  
  setupTouchEvents() {
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        this.touches.set(touch.identifier, {
          x: touch.clientX,
          y: touch.clientY,
          startX: touch.clientX,
          startY: touch.clientY
        });
      }
      if (this.touches.size === 2) {
        this.lastTouchDistance = this.getTouchDistance();
      }
    });
    
    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        const touchData = this.touches.get(touch.identifier);
        if (touchData) {
          touchData.x = touch.clientX;
          touchData.y = touch.clientY;
        }
      }
      
      if (this.touches.size === 1) {
        const touch = Array.from(this.touches.values())[0];
        const deltaX = touch.x - touch.startX;
        const deltaY = touch.y - touch.startY;
        this.rotationY += deltaX * 0.01;
        this.rotationX += deltaY * 0.01;
        touch.startX = touch.x;
        touch.startY = touch.y;
      } else if (this.touches.size === 2) {
        const distance = this.getTouchDistance();
        if (this.lastTouchDistance > 0) {
          const scaleFactor = distance / this.lastTouchDistance;
          this.scale *= scaleFactor;
          this.scale = Math.max(0.5, Math.min(3.0, this.scale));
        }
        this.lastTouchDistance = distance;
      }
    });
    
    this.canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        this.touches.delete(e.changedTouches[i].identifier);
      }
      if (this.touches.size < 2) {
        this.lastTouchDistance = 0;
      }
    });
    
    this.canvas.addEventListener('touchcancel', (e) => {
      e.preventDefault();
      this.touches.clear();
      this.lastTouchDistance = 0;
    });
  }
  
  getTouchDistance() {
    const touches = Array.from(this.touches.values());
    if (touches.length < 2) return 0;
    const dx = touches[1].x - touches[0].x;
    const dy = touches[1].y - touches[0].y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

const inputController = new InputController(canvas);`} language="javascript" />
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
    this.onComplete = null;
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
      if (this.onComplete) {
        this.onComplete();
      }
      return this.end;
    }
    
    const eased = this.easing(progress);
    return this.start + (this.end - this.start) * eased;
  }
  
  stop() {
    this.isRunning = false;
  }
  
  reset() {
    this.startTime = null;
    this.isRunning = false;
  }
}

// 使用示例
const anim = new Animation(0, 100, 1000, easeInOut);
anim.onComplete = () => {
  console.log('动画完成');
};
anim.start();

function render() {
  const value = anim.update();
  // 使用 value 更新对象位置
  requestAnimationFrame(render);
}

// ========== 更完善的动画系统 ==========
class AnimationSystem {
  constructor() {
    this.animations = [];
  }
  
  add(animation) {
    this.animations.push(animation);
    return animation;
  }
  
  remove(animation) {
    const index = this.animations.indexOf(animation);
    if (index > -1) {
      this.animations.splice(index, 1);
    }
  }
  
  update() {
    for (let i = this.animations.length - 1; i >= 0; i--) {
      const anim = this.animations[i];
      anim.update();
      
      if (!anim.isRunning) {
        this.animations.splice(i, 1);
      }
    }
  }
  
  clear() {
    this.animations = [];
  }
}

const animationSystem = new AnimationSystem();

// 创建动画
const anim1 = animationSystem.add(new Animation(0, 100, 1000, easeInOut));
anim1.start();

function render() {
  animationSystem.update();
  draw();
  requestAnimationFrame(render);
}`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">向量插值</h3>
        <CodeBlock title="向量插值" code={`// 2D 向量插值
function lerpVec2(start, end, t) {
  return [
    start[0] + (end[0] - start[0]) * t,
    start[1] + (end[1] - start[1]) * t
  ];
}

// 3D 向量插值
function lerpVec3(start, end, t) {
  return [
    start[0] + (end[0] - start[0]) * t,
    start[1] + (end[1] - start[1]) * t,
    start[2] + (end[2] - start[2]) * t
  ];
}

// 四元数插值（用于旋转）
function slerp(q1, q2, t) {
  // 简化的四元数球面线性插值
  const dot = q1[0] * q2[0] + q1[1] * q2[1] + q1[2] * q2[2] + q1[3] * q2[3];
  
  if (dot < 0) {
    q2 = [-q2[0], -q2[1], -q2[2], -q2[3]];
  }
  
  const theta = Math.acos(Math.abs(dot));
  const sinTheta = Math.sin(theta);
  
  if (sinTheta < 0.001) {
    // 角度很小，使用线性插值
    return lerpVec4(q1, q2, t);
  }
  
  const w1 = Math.sin((1 - t) * theta) / sinTheta;
  const w2 = Math.sin(t * theta) / sinTheta;
  
  return [
    q1[0] * w1 + q2[0] * w2,
    q1[1] * w1 + q2[1] * w2,
    q1[2] * w1 + q2[2] * w2,
    q1[3] * w1 + q2[3] * w2
  ];
}

// 矩阵插值（复杂，通常不推荐）
// 更好的方法是插值位置、旋转、缩放，然后重新构建矩阵`} language="javascript" />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">关键概念总结</h2>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">requestAnimationFrame</strong>：
            <ul className="mt-2 pl-6">
              <li>创建动画循环的最佳方式</li>
              <li>与浏览器刷新率同步</li>
              <li>标签页不可见时自动暂停</li>
              <li>性能监控：跟踪 FPS 和帧时间</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">基于时间的动画</strong>：
            <ul className="mt-2 pl-6">
              <li>使用时间而不是帧数控制动画</li>
              <li>确保动画速度在不同设备上一致</li>
              <li>处理帧率波动和掉帧</li>
              <li>支持时间缩放和暂停功能</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">鼠标交互</strong>：
            <ul className="mt-2 pl-6">
              <li>拖拽旋转：mousedown、mousemove、mouseup</li>
              <li>滚轮缩放：wheel 事件</li>
              <li>坐标转换：鼠标坐标转 WebGL 坐标</li>
              <li>轨道控制器：完整的相机控制系统</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">键盘控制</strong>：
            <ul className="mt-2 pl-6">
              <li>按键状态管理：keydown、keyup 事件</li>
              <li>基于时间的移动：使用 deltaTime</li>
              <li>第一人称相机：WASD 移动 + 鼠标视角</li>
              <li>防止默认行为：preventDefault()</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">触摸支持</strong>：
            <ul className="mt-2 pl-6">
              <li>基础触摸：touchstart、touchmove、touchend</li>
              <li>多点触摸：缩放和旋转</li>
              <li>统一输入处理：同时支持鼠标和触摸</li>
              <li>防止默认行为：preventDefault()</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">动画插值与缓动函数</strong>：
            <ul className="mt-2 pl-6">
              <li>线性插值（lerp）：基础插值函数</li>
              <li>平滑步进（smoothstep）：平滑过渡</li>
              <li>缓动函数：easeIn、easeOut、easeInOut、elastic、bounce</li>
              <li>动画状态管理：Animation 类和 AnimationSystem</li>
              <li>向量插值：2D、3D 向量和四元数插值</li>
            </ul>
          </li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">最佳实践总结</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>始终使用 requestAnimationFrame 创建动画循环</li>
          <li>使用基于时间的动画，而不是基于帧数的动画</li>
          <li>监控性能：跟踪 FPS 和帧时间</li>
          <li>统一输入处理：同时支持鼠标和触摸</li>
          <li>使用缓动函数让动画更自然</li>
          <li>合理管理动画状态，避免内存泄漏</li>
          <li>处理边界情况：鼠标离开、触摸取消等</li>
        </ul>
      </section>
      
      <ChapterNavigation />
    </div>
  )
}

