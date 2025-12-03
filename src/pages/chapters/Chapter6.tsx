import WebGLCanvas from '../../components/WebGLCanvas'
import CodeBlock from '../../components/CodeBlock'
import ChapterNavigation from '../../components/ChapterNavigation'
import { createProgram, createBuffer, setAttribute } from '../../utils/webgl'

export default function Chapter6() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl mb-8 text-primary border-b-2 border-dark-border pb-4">第六章：性能优化</h1>
      
      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text">性能优化的重要性</h2>
        <p className="text-dark-text-muted leading-relaxed mb-4">
          WebGL 性能优化对于创建流畅的交互式应用至关重要。主要优化方向：
        </p>
        <ul className="text-dark-text-muted leading-loose pl-8 mb-5">
          <li>减少绘制调用（Draw Calls）</li>
          <li>减少状态切换</li>
          <li>优化着色器代码</li>
          <li>合理使用缓冲区</li>
          <li>纹理优化</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text">1. 减少绘制调用</h2>
        <p className="text-dark-text-muted leading-relaxed mb-4">
          每次调用 <code>gl.drawArrays</code> 或 <code>gl.drawElements</code> 都有开销。
          尽量合并多个物体到一次绘制调用中。
        </p>
        
        <h3 className="text-2xl my-8 text-dark-text">方法：批处理（Batching）</h3>
        <ul className="text-dark-text-muted leading-loose pl-8 mb-5">
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
        <h2 className="text-3xl my-10 text-dark-text">2. 减少状态切换</h2>
        <p className="text-dark-text-muted leading-relaxed mb-4">
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
        <h2 className="text-3xl my-10 text-dark-text">3. 着色器优化</h2>
        <h3 className="text-2xl my-8 text-dark-text">避免不必要的计算</h3>
        <ul className="text-dark-text-muted leading-loose pl-8 mb-5">
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
        <h2 className="text-3xl my-10 text-dark-text">4. 缓冲区优化</h2>
        <h3 className="text-2xl my-8 text-dark-text">使用正确的使用模式</h3>
        <ul className="text-dark-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">gl.STATIC_DRAW</strong>：数据不会改变</li>
          <li><strong className="text-primary font-semibold">gl.DYNAMIC_DRAW</strong>：数据偶尔改变</li>
          <li><strong className="text-primary font-semibold">gl.STREAM_DRAW</strong>：数据每帧都改变</li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text">避免频繁上传数据</h3>
        <p className="text-dark-text-muted leading-relaxed mb-4">
          如果数据不变，只上传一次。如果数据改变，考虑使用多个缓冲区交替使用。
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text">5. 纹理优化</h2>
        <ul className="text-dark-text-muted leading-loose pl-8 mb-5">
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
        <h2 className="text-3xl my-10 text-dark-text">6. 视锥剔除（Frustum Culling）</h2>
        <p className="text-dark-text-muted leading-relaxed mb-4">
          不绘制屏幕外的物体，减少不必要的绘制调用。
        </p>
        <ul className="text-dark-text-muted leading-loose pl-8 mb-5">
          <li>计算物体的包围盒</li>
          <li>检查是否在视锥内</li>
          <li>只绘制可见的物体</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text">7. 细节层次（LOD）</h2>
        <p className="text-dark-text-muted leading-relaxed mb-4">
          根据距离使用不同精度的模型：
        </p>
        <ul className="text-dark-text-muted leading-loose pl-8 mb-5">
          <li>近距离：高精度模型</li>
          <li>远距离：低精度模型</li>
          <li>减少顶点数量，提升性能</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text">8. 使用 WebGL 扩展</h2>
        <p className="text-dark-text-muted leading-relaxed mb-4">
          利用 WebGL 扩展提升性能：
        </p>
        <ul className="text-dark-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">ANGLE_instanced_arrays</strong>：实例化渲染</li>
          <li><strong className="text-primary font-semibold">OES_element_index_uint</strong>：支持更大的索引</li>
          <li><strong className="text-primary font-semibold">WEBGL_draw_buffers</strong>：多渲染目标</li>
        </ul>
        
        <CodeBlock title="检查扩展" code={`// 检查扩展是否可用
const ext = gl.getExtension('ANGLE_instanced_arrays');
if (ext) {
  // 使用扩展功能
  ext.drawArraysInstancedANGLE(gl.TRIANGLES, 0, 3, instanceCount);
}`} language="javascript" />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text">9. 性能分析工具</h2>
        <ul className="text-dark-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">Chrome DevTools</strong>：Performance 面板</li>
          <li><strong className="text-primary font-semibold">WebGL Inspector</strong>：Chrome 扩展</li>
          <li><strong className="text-primary font-semibold">自定义计时</strong>：使用 <code>performance.now()</code></li>
        </ul>
        
        <CodeBlock title="性能测量" code={`const startTime = performance.now();

// 渲染代码
gl.drawArrays(gl.TRIANGLES, 0, count);

const endTime = performance.now();
const renderTime = endTime - startTime;
console.log(\`渲染时间: \${renderTime}ms\`);`} language="javascript" />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text">10. 内存管理</h2>
        <p className="text-dark-text-muted leading-relaxed mb-4">
          及时释放不需要的资源：
        </p>
        <ul className="text-dark-text-muted leading-loose pl-8 mb-5">
          <li>删除不需要的缓冲区：<code>gl.deleteBuffer(buffer)</code></li>
          <li>删除不需要的纹理：<code>gl.deleteTexture(texture)</code></li>
          <li>删除不需要的程序：<code>gl.deleteProgram(program)</code></li>
          <li>删除不需要的着色器：<code>gl.deleteShader(shader)</code></li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text">优化检查清单</h2>
        <ul className="text-dark-text-muted leading-loose pl-8 mb-5">
          <li>✓ 减少绘制调用次数</li>
          <li>✓ 按状态分组绘制</li>
          <li>✓ 优化着色器代码</li>
          <li>✓ 使用正确的缓冲区使用模式</li>
          <li>✓ 优化纹理大小和格式</li>
          <li>✓ 实现视锥剔除</li>
          <li>✓ 使用 LOD 系统</li>
          <li>✓ 利用 WebGL 扩展</li>
          <li>✓ 及时释放资源</li>
          <li>✓ 使用性能分析工具</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text">性能优化示例</h2>
        <p className="text-dark-text-muted leading-relaxed mb-4">
          下面是一个优化后的渲染循环示例：
        </p>
        
        <CodeBlock title="优化的渲染循环" code={`function render(scene) {
  // 1. 按状态分组
  const batches = groupByState(scene.objects);
  
  // 2. 视锥剔除
  const visibleObjects = frustumCull(scene.objects, camera);
  
  // 3. 清除缓冲区
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  // 4. 按批次绘制
  for (const batch of batches) {
    gl.useProgram(batch.program);
    gl.bindTexture(gl.TEXTURE_2D, batch.texture);
    
    for (const obj of batch.objects) {
      if (visibleObjects.has(obj)) {
        gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);
        setAttributes(gl, batch.program, obj.attributes);
        gl.drawElements(gl.TRIANGLES, obj.indexCount, gl.UNSIGNED_SHORT, 0);
      }
    }
  }
}`} language="javascript" />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text">关键概念总结</h2>
        <ul className="text-dark-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">批处理</strong>：合并绘制调用</li>
          <li><strong className="text-primary font-semibold">状态管理</strong>：减少状态切换</li>
          <li><strong className="text-primary font-semibold">着色器优化</strong>：在顶点着色器中计算</li>
          <li><strong className="text-primary font-semibold">缓冲区优化</strong>：使用正确的使用模式</li>
          <li><strong className="text-primary font-semibold">纹理优化</strong>：合适的尺寸和格式</li>
          <li><strong className="text-primary font-semibold">视锥剔除</strong>：不绘制不可见物体</li>
          <li><strong className="text-primary font-semibold">LOD</strong>：根据距离使用不同精度</li>
          <li><strong className="text-primary font-semibold">内存管理</strong>：及时释放资源</li>
        </ul>
      </section>
      
      <ChapterNavigation />
    </div>
  )
}

