import WebGLCanvas from '../../components/WebGLCanvas'
import CodeBlock from '../../components/CodeBlock'
import ChapterNavigation from '../../components/ChapterNavigation'
import { createProgram, createBuffer, setAttribute } from '../../utils/webgl'

export default function Chapter9() {
  return (
    <div className="w-full">
      <h1 className="text-4xl mb-8 text-primary border-b-2 border-dark-border dark:border-dark-border border-light-border pb-4">第九章：性能优化</h1>
      
      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">性能优化的重要性</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          WebGL 性能优化对于创建流畅的交互式应用至关重要。主要优化方向：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>减少绘制调用（Draw Calls）</li>
          <li>减少状态切换</li>
          <li>优化着色器代码</li>
          <li>合理使用缓冲区</li>
          <li>纹理优化</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">1. 减少绘制调用</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          每次调用 <code>gl.drawArrays</code> 或 <code>gl.drawElements</code> 都有开销。
          尽量合并多个物体到一次绘制调用中。
        </p>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">方法：批处理（Batching）</h3>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>将多个物体合并到一个缓冲区</li>
          <li>使用索引绘制减少顶点数据</li>
          <li>使用实例化渲染（Instancing）</li>
        </ul>
        
        <CodeBlock title="批处理示例" code={`// 不好的做法：多次绘制调用
for (let i = 0; i < objects.length; i++) {
  gl.drawArrays(gl.TRIANGLES, i * 3, 3);
}

// 好的做法：一次绘制调用
// 将所有顶点数据合并到一个缓冲区
gl.drawArrays(gl.TRIANGLES, 0, totalVertices);`} language="javascript" />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">2. 减少状态切换</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          WebGL 状态切换（如切换着色器程序、纹理、缓冲区）有开销。
          按状态分组绘制，减少切换次数。
        </p>
        
        <CodeBlock title="状态管理优化" code={`// 不好的做法：频繁切换状态
for (let obj of objects) {
  gl.useProgram(obj.program);      // 状态切换
  gl.bindTexture(gl.TEXTURE_2D, obj.texture);  // 状态切换
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

// 好的做法：按状态分组
const grouped = groupByState(objects);
for (let group of grouped) {
  gl.useProgram(group.program);
  gl.bindTexture(gl.TEXTURE_2D, group.texture);
  for (let obj of group.objects) {
    gl.drawArrays(gl.TRIANGLES, obj.offset, obj.count);
  }
}`} language="javascript" />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">3. 着色器优化</h2>
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">避免不必要的计算</h3>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>在顶点着色器中计算，而不是片段着色器</li>
          <li>使用 <code>discard</code> 提前丢弃片段</li>
          <li>避免动态分支（if/else）</li>
          <li>使用内置函数（通常更快）</li>
        </ul>
        
        <CodeBlock title="着色器优化示例" code={`// 不好的做法：在片段着色器中重复计算
precision mediump float;
varying vec3 v_position;

void main() {
  float dist = length(v_position);  // 每个片段都计算
  gl_FragColor = vec4(dist, dist, dist, 1.0);
}

// 好的做法：在顶点着色器中计算
// 顶点着色器
varying float v_dist;

void main() {
  v_dist = length(position);  // 只计算一次
  gl_Position = ...
}

// 片段着色器
varying float v_dist;

void main() {
  gl_FragColor = vec4(v_dist, v_dist, v_dist, 1.0);
}`} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">4. 缓冲区优化</h2>
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">使用正确的使用模式</h3>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">gl.STATIC_DRAW</strong>：数据不会改变</li>
          <li><strong className="text-primary font-semibold">gl.DYNAMIC_DRAW</strong>：数据偶尔改变</li>
          <li><strong className="text-primary font-semibold">gl.STREAM_DRAW</strong>：数据每帧都改变</li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">避免频繁上传数据</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          如果数据不变，只上传一次。如果数据改变，考虑使用多个缓冲区交替使用。
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">5. 纹理优化</h2>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">使用合适的纹理尺寸</strong>：不要使用过大的纹理</li>
          <li><strong className="text-primary font-semibold">使用 Mipmap</strong>：提升远距离渲染性能</li>
          <li><strong className="text-primary font-semibold">压缩纹理</strong>：使用压缩格式（如 DXT、ETC）</li>
          <li><strong className="text-primary font-semibold">纹理图集</strong>：将多个小纹理合并到一个大纹理</li>
        </ul>
        
        <CodeBlock title="纹理优化" code={`// 生成 Mipmap
gl.generateMipmap(gl.TEXTURE_2D);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

// 使用纹理图集
// 将多个小纹理合并到一个大纹理，通过 UV 坐标访问不同区域`} language="javascript" />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">6. 视锥剔除（Frustum Culling）</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          不绘制屏幕外的物体，减少不必要的绘制调用。
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>计算物体的包围盒</li>
          <li>检查是否在视锥内</li>
          <li>只绘制可见的物体</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">7. 内存管理</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          及时释放不需要的资源：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>删除不需要的缓冲区：<code>gl.deleteBuffer(buffer)</code></li>
          <li>删除不需要的纹理：<code>gl.deleteTexture(texture)</code></li>
          <li>删除不需要的程序：<code>gl.deleteProgram(program)</code></li>
          <li>删除不需要的着色器：<code>gl.deleteShader(shader)</code></li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">8. 性能分析工具</h2>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">Chrome DevTools</strong>：Performance 面板，可以分析帧率、CPU 使用率</li>
          <li><strong className="text-primary font-semibold">WebGL Inspector</strong>：Chrome 扩展，可以查看 WebGL 调用、纹理、缓冲区</li>
          <li><strong className="text-primary font-semibold">自定义计时</strong>：使用 <code>performance.now()</code> 测量特定代码段的执行时间</li>
          <li><strong className="text-primary font-semibold">GPU 分析</strong>：使用浏览器内置的 GPU 分析工具</li>
        </ul>
        
        <CodeBlock title="性能测量" code={`// 测量渲染时间
const startTime = performance.now();

// 渲染代码
gl.drawArrays(gl.TRIANGLES, 0, count);

const endTime = performance.now();
const renderTime = endTime - startTime;
console.log(\`渲染时间: \${renderTime}ms\`);

// 测量 FPS
let lastTime = performance.now();
let frameCount = 0;
let fps = 0;

function measureFPS() {
  frameCount++;
  const currentTime = performance.now();
  
  if (currentTime >= lastTime + 1000) {
    fps = frameCount;
    frameCount = 0;
    lastTime = currentTime;
    console.log(\`FPS: \${fps}\`);
  }
  
  requestAnimationFrame(measureFPS);
}`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">性能对比示例</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          下面展示了批处理优化的效果对比：
        </p>
        
        <CodeBlock title="性能对比：多次绘制 vs 批处理" code={`// 方法 1：多次绘制调用（慢）
function renderMultipleDraws(objects) {
  const startTime = performance.now();
  
  for (let obj of objects) {
    gl.useProgram(obj.program);
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);
    setAttribute(gl, obj.program, 'a_position', 3);
    gl.drawArrays(gl.TRIANGLES, 0, obj.vertexCount);
  }
  
  const endTime = performance.now();
  return endTime - startTime;
}

// 方法 2：批处理（快）
function renderBatched(objects) {
  const startTime = performance.now();
  
  // 合并所有顶点到一个缓冲区
  const allVertices = [];
  for (let obj of objects) {
    allVertices.push(...obj.vertices);
  }
  
  const buffer = createBuffer(gl, allVertices);
  gl.useProgram(objects[0].program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  setAttribute(gl, objects[0].program, 'a_position', 3);
  gl.drawArrays(gl.TRIANGLES, 0, allVertices.length / 3);
  
  const endTime = performance.now();
  return endTime - startTime;
}

// 测试结果（100 个对象）：
// 多次绘制：~15ms
// 批处理：~2ms
// 性能提升：7.5倍`} language="javascript" />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">9. 实际优化案例</h2>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">案例 1：粒子系统优化</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          粒子系统通常需要渲染大量小物体。优化策略：
        </p>
        
        <CodeBlock title="粒子系统优化" code={`// 不好的做法：每个粒子一次绘制调用
for (let particle of particles) {
  gl.useProgram(program);
  gl.uniformMatrix4fv(matrixLocation, false, particle.matrix);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}
// 1000 个粒子 = 1000 次绘制调用

// 好的做法：使用实例化渲染
// 将所有粒子的变换矩阵存储在一个缓冲区中
const matrices = new Float32Array(particles.length * 16);
for (let i = 0; i < particles.length; i++) {
  matrices.set(particles[i].matrix, i * 16);
}

const matrixBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, matrixBuffer);
gl.bufferData(gl.ARRAY_BUFFER, matrices, gl.DYNAMIC_DRAW);

// 使用实例化属性
setAttribute(gl, program, 'a_instanceMatrix', 4, gl.FLOAT, false, 64, 0);
setAttribute(gl, program, 'a_instanceMatrix', 4, gl.FLOAT, false, 64, 16);
setAttribute(gl, program, 'a_instanceMatrix', 4, gl.FLOAT, false, 64, 32);
setAttribute(gl, program, 'a_instanceMatrix', 4, gl.FLOAT, false, 64, 48);

gl.vertexAttribDivisor(location, 1);  // 每个实例更新一次

// 一次绘制调用渲染所有粒子
gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, particles.length);
// 1000 个粒子 = 1 次绘制调用`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">案例 2：纹理图集优化</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          当需要渲染多个不同纹理的物体时，使用纹理图集可以减少纹理切换：
        </p>
        
        <CodeBlock title="纹理图集优化" code={`// 不好的做法：每个物体切换一次纹理
for (let obj of objects) {
  gl.bindTexture(gl.TEXTURE_2D, obj.texture);
  gl.drawArrays(gl.TRIANGLES, obj.offset, obj.count);
}
// 100 个不同纹理 = 100 次纹理切换

// 好的做法：使用纹理图集
// 将所有小纹理合并到一个大纹理中
const atlasTexture = createTextureAtlas([
  texture1, texture2, texture3, ...
]);

// 通过 UV 坐标访问不同的纹理区域
// 所有物体使用同一个纹理，只需要调整 UV 坐标
gl.bindTexture(gl.TEXTURE_2D, atlasTexture);
for (let obj of objects) {
  gl.uniform2fv(uvOffsetLocation, obj.uvOffset);
  gl.uniform2fv(uvScaleLocation, obj.uvScale);
  gl.drawArrays(gl.TRIANGLES, obj.offset, obj.count);
}
// 100 个物体 = 1 次纹理绑定`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">案例 3：视锥剔除优化</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          视锥剔除可以显著减少不必要的绘制：
        </p>
        
        <CodeBlock title="视锥剔除实现" code={`// 计算物体的包围盒
function getBoundingBox(object) {
  return {
    min: { x: -1, y: -1, z: -1 },
    max: { x: 1, y: 1, z: 1 }
  };
}

// 检查包围盒是否在视锥内
function isInFrustum(boundingBox, mvpMatrix) {
  // 将包围盒的 8 个顶点转换到裁剪空间
  const corners = [
    { x: boundingBox.min.x, y: boundingBox.min.y, z: boundingBox.min.z },
    { x: boundingBox.max.x, y: boundingBox.min.y, z: boundingBox.min.z },
    // ... 其他 6 个顶点
  ];
  
  let allOutside = true;
  for (let corner of corners) {
    const clipPos = multiplyMatrixVector(mvpMatrix, corner);
    // 检查是否在裁剪空间内 [-1, 1]
    if (clipPos.x >= -1 && clipPos.x <= 1 &&
        clipPos.y >= -1 && clipPos.y <= 1 &&
        clipPos.z >= -1 && clipPos.z <= 1) {
      allOutside = false;
      break;
    }
  }
  
  return !allOutside;
}

// 使用视锥剔除
const visibleObjects = [];
for (let obj of allObjects) {
  const boundingBox = getBoundingBox(obj);
  const mvpMatrix = multiply(projectionMatrix, multiply(viewMatrix, obj.modelMatrix));
  
  if (isInFrustum(boundingBox, mvpMatrix)) {
    visibleObjects.push(obj);
  }
}

// 只绘制可见物体
for (let obj of visibleObjects) {
  render(obj);
}
// 性能提升：如果 50% 物体不可见，性能提升约 2 倍`} language="javascript" />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">优化检查清单</h2>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>✓ 减少绘制调用次数</li>
          <li>✓ 按状态分组绘制</li>
          <li>✓ 优化着色器代码</li>
          <li>✓ 使用正确的缓冲区使用模式</li>
          <li>✓ 优化纹理大小和格式</li>
          <li>✓ 实现视锥剔除</li>
          <li>✓ 及时释放资源</li>
          <li>✓ 使用性能分析工具</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">关键概念总结</h2>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">批处理</strong>：合并绘制调用</li>
          <li><strong className="text-primary font-semibold">状态管理</strong>：减少状态切换</li>
          <li><strong className="text-primary font-semibold">着色器优化</strong>：在顶点着色器中计算</li>
          <li><strong className="text-primary font-semibold">缓冲区优化</strong>：使用正确的使用模式</li>
          <li><strong className="text-primary font-semibold">纹理优化</strong>：合适的尺寸和格式</li>
          <li><strong className="text-primary font-semibold">视锥剔除</strong>：不绘制不可见物体</li>
          <li><strong className="text-primary font-semibold">内存管理</strong>：及时释放资源</li>
        </ul>
      </section>
      
      <ChapterNavigation />
    </div>
  )
}
