import WebGLCanvas from '../../components/WebGLCanvas'
import CodeBlock from '../../components/CodeBlock'
import FlipCard from '../../components/FlipCard'
import ChapterNavigation from '../../components/ChapterNavigation'
import { createProgram, createBuffer, setAttribute, Matrix, createIndexBuffer } from '../../utils/webgl'

export default function Chapter7() {
  return (
    <div className="w-full">
      <h1 className="text-4xl mb-8 text-primary border-b-2 border-dark-border dark:border-dark-border border-light-border pb-4">第七章：高级渲染技术</h1>
      
      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">透明度与混合</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          透明度（Transparency）是创建玻璃、水、烟雾、火焰等效果的关键技术。
          在 WebGL 中，我们需要启用混合（Blending）来实现透明度效果。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">什么是混合？</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>混合是将新绘制的片段颜色与已存在的颜色进行组合的过程</li>
          <li>源颜色（Source）：新绘制的片段颜色</li>
          <li>目标颜色（Destination）：已存在的颜色（帧缓冲区中的颜色）</li>
          <li>混合函数决定如何组合这两种颜色</li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">混合函数</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          混合函数使用公式：<code className="bg-dark-bg dark:bg-dark-bg px-1 py-0.5 rounded">result = srcFactor × srcColor + dstFactor × dstColor</code>
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">混合因子（Blend Factors）</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong>gl.ZERO</strong>：0.0</li>
          <li><strong>gl.ONE</strong>：1.0</li>
          <li><strong>gl.SRC_COLOR</strong>：源颜色的 RGB 值</li>
          <li><strong>gl.ONE_MINUS_SRC_COLOR</strong>：1.0 - 源颜色的 RGB 值</li>
          <li><strong>gl.DST_COLOR</strong>：目标颜色的 RGB 值</li>
          <li><strong>gl.ONE_MINUS_DST_COLOR</strong>：1.0 - 目标颜色的 RGB 值</li>
          <li><strong>gl.SRC_ALPHA</strong>：源颜色的 Alpha 值</li>
          <li><strong>gl.ONE_MINUS_SRC_ALPHA</strong>：1.0 - 源颜色的 Alpha 值</li>
          <li><strong>gl.DST_ALPHA</strong>：目标颜色的 Alpha 值</li>
          <li><strong>gl.ONE_MINUS_DST_ALPHA</strong>：1.0 - 目标颜色的 Alpha 值</li>
        </ul>
        
        <CodeBlock title="启用混合" code={`// 启用混合
gl.enable(gl.BLEND);

// 设置混合函数
// blendFunc(srcFactor, dstFactor)
// result = srcFactor × srcColor + dstFactor × dstColor
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

// 常见的混合模式：
// 1. 标准透明度（最常用）
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
// 结果 = srcColor × srcAlpha + dstColor × (1 - srcAlpha)
// 适用于：玻璃、水、半透明物体

// 2. 加法混合（Additive Blending）
gl.blendFunc(gl.ONE, gl.ONE);
// 结果 = srcColor + dstColor
// 适用于：发光效果、火焰、粒子效果

// 3. 乘法混合（Multiplicative Blending）
gl.blendFunc(gl.DST_COLOR, gl.ZERO);
// 结果 = srcColor × dstColor
// 适用于：阴影、暗化效果

// 4. 减法混合（Subtractive Blending，需要 WebGL 2.0）
gl.blendEquation(gl.FUNC_SUBTRACT);
gl.blendFunc(gl.ONE, gl.ONE);
// 结果 = dstColor - srcColor
// 适用于：特殊效果

// 5. 预乘 Alpha（Premultiplied Alpha）
gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
// 适用于：预乘 Alpha 的纹理`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">混合方程</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          WebGL 还支持不同的混合方程（Blend Equation）：
        </p>
        <CodeBlock title="混合方程" code={`// 设置混合方程（默认是加法）
gl.blendEquation(gl.FUNC_ADD);  // result = srcFactor × src + dstFactor × dst

// WebGL 2.0 支持：
gl.blendEquation(gl.FUNC_SUBTRACT);  // result = srcFactor × src - dstFactor × dst
gl.blendEquation(gl.FUNC_REVERSE_SUBTRACT);  // result = dstFactor × dst - srcFactor × src

// 分别设置 RGB 和 Alpha 的混合方程（WebGL 2.0）
gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);

// 分别设置 RGB 和 Alpha 的混合因子（WebGL 2.0）
gl.blendFuncSeparate(
  gl.SRC_ALPHA,           // RGB 源因子
  gl.ONE_MINUS_SRC_ALPHA, // RGB 目标因子
  gl.ONE,                 // Alpha 源因子
  gl.ONE_MINUS_SRC_ALPHA  // Alpha 目标因子
);`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">绘制顺序的重要性</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          绘制透明物体时，顺序非常重要：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">从后往前绘制</strong>：
            <ul className="mt-2 pl-6">
              <li>先绘制远处的透明物体</li>
              <li>再绘制近处的透明物体</li>
              <li>确保正确的混合效果</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">分离不透明和透明物体</strong>：
            <ul className="mt-2 pl-6">
              <li>先绘制所有不透明物体（启用深度测试和深度写入）</li>
              <li>再绘制透明物体（启用混合，禁用深度写入）</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">按深度排序</strong>：
            <ul className="mt-2 pl-6">
              <li>对透明物体按深度排序</li>
              <li>从远到近绘制</li>
            </ul>
          </li>
        </ul>
        <CodeBlock title="正确的绘制顺序" code={`// 1. 绘制不透明物体
gl.enable(gl.DEPTH_TEST);
gl.depthMask(true);  // 启用深度写入
gl.disable(gl.BLEND);
renderOpaqueObjects();

// 2. 对透明物体按深度排序
const transparentObjects = getTransparentObjects();
transparentObjects.sort((a, b) => {
  const distA = distance(camera.position, a.position);
  const distB = distance(camera.position, b.position);
  return distB - distA;  // 从远到近排序
});

// 3. 绘制透明物体（从后往前）
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
gl.depthMask(false);  // 禁用深度写入（透明物体不写入深度）
for (const obj of transparentObjects) {
  renderObject(obj);
}
gl.depthMask(true);  // 恢复深度写入`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">透明度示例</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          下面展示了透明度的效果：
        </p>
        
        <FlipCard 
          width={400} 
          height={400} 
          onInit={(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement) => {
            const vertexShader = `
              attribute vec3 a_position;
              uniform mat4 u_mvpMatrix;
              
              void main() {
                gl_Position = u_mvpMatrix * vec4(a_position, 1.0);
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
            
            // 创建多个重叠的透明矩形
            const positions: number[] = []
            const indices: number[] = []
            const colors = [
              [1.0, 0.0, 0.0, 0.5],  // 红色，50% 透明度
              [0.0, 1.0, 0.0, 0.5],  // 绿色，50% 透明度
              [0.0, 0.0, 1.0, 0.5],  // 蓝色，50% 透明度
            ]
            
            for (let i = 0; i < 3; i++) {
              const offset = i * 0.3 - 0.3
              const rectPositions = [
                -0.3 + offset, -0.3, 0,  0.3 + offset, -0.3, 0,
                 0.3 + offset,  0.3, 0, -0.3 + offset,  0.3, 0,
              ]
              positions.push(...rectPositions)
              
              const base = i * 4
              indices.push(base, base + 1, base + 2, base, base + 2, base + 3)
            }
            
            const positionBuffer = createBuffer(gl, positions)
            const indexBuffer = createIndexBuffer(gl, indices)
            
            const mvpMatrixLocation = gl.getUniformLocation(program, 'u_mvpMatrix')
            const colorLocation = gl.getUniformLocation(program, 'u_color')
            
            gl.viewport(0, 0, canvas.width, canvas.height)
            gl.enable(gl.DEPTH_TEST)
            gl.enable(gl.BLEND)
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
            gl.clearColor(0.1, 0.1, 0.1, 1.0)
            
            const aspect = canvas.width / canvas.height
            const projectionMatrix = Matrix.perspective(Math.PI / 4, aspect, 0.1, 100)
            const viewMatrix = Matrix.lookAt(0, 0, 2, 0, 0, 0, 0, 1, 0)
            const modelMatrix = Matrix.identity()
            const mvpMatrix = Matrix.multiply(projectionMatrix, Matrix.multiply(viewMatrix, modelMatrix))
            
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
            gl.useProgram(program)
            
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
            setAttribute(gl, program, 'a_position', 3)
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
            
            gl.uniformMatrix4fv(mvpMatrixLocation, false, mvpMatrix)
            
            // 从后往前绘制（重要！）
            for (let i = 2; i >= 0; i--) {
              gl.uniform4f(colorLocation, colors[i][0], colors[i][1], colors[i][2], colors[i][3])
              gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, i * 6 * 2)
            }
          }}
          codeBlocks={[
            { title: '顶点着色器', code: `attribute vec3 a_position;
uniform mat4 u_mvpMatrix;

void main() {
  gl_Position = u_mvpMatrix * vec4(a_position, 1.0);
}` },
            { title: '片段着色器', code: `precision mediump float;
uniform vec4 u_color;

void main() {
  gl_FragColor = u_color;
}` },
            { title: 'JavaScript 代码', code: `const program = createProgram(gl, vertexShader, fragmentShader)

// 创建多个重叠的透明矩形
const positions = []
const indices = []
const colors = [
  [1.0, 0.0, 0.0, 0.5],  // 红色，50% 透明度
  [0.0, 1.0, 0.0, 0.5],  // 绿色，50% 透明度
  [0.0, 0.0, 1.0, 0.5],  // 蓝色，50% 透明度
]

for (let i = 0; i < 3; i++) {
  const offset = i * 0.3 - 0.3
  const rectPositions = [
    -0.3 + offset, -0.3, 0,  0.3 + offset, -0.3, 0,
     0.3 + offset,  0.3, 0, -0.3 + offset,  0.3, 0,
  ]
  positions.push(...rectPositions)
  
  const base = i * 4
  indices.push(base, base + 1, base + 2, base, base + 2, base + 3)
}

const positionBuffer = createBuffer(gl, positions)
const indexBuffer = createIndexBuffer(gl, indices)

gl.viewport(0, 0, canvas.width, canvas.height)
gl.enable(gl.DEPTH_TEST)
gl.enable(gl.BLEND)
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
gl.clearColor(0.1, 0.1, 0.1, 1.0)

const aspect = canvas.width / canvas.height
const projectionMatrix = Matrix.perspective(Math.PI / 4, aspect, 0.1, 100)
const viewMatrix = Matrix.lookAt(0, 0, 2, 0, 0, 0, 0, 1, 0)
const modelMatrix = Matrix.identity()
const mvpMatrix = Matrix.multiply(projectionMatrix, Matrix.multiply(viewMatrix, modelMatrix))

gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
gl.useProgram(program)

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
setAttribute(gl, program, 'a_position', 3)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)

gl.uniformMatrix4fv(mvpMatrixLocation, false, mvpMatrix)

// 从后往前绘制（重要！）
for (let i = 2; i >= 0; i--) {
  gl.uniform4f(colorLocation, colors[i][0], colors[i][1], colors[i][2], colors[i][3])
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, i * 6 * 2)
}`, language: 'javascript' }
          ]}
        />
        
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">重要提示</strong>：绘制透明物体时，需要从后往前绘制，才能得到正确的混合效果。
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">深度测试</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          深度测试（Depth Test）用于确定哪些片段应该被绘制，哪些应该被丢弃。
          这对于正确渲染 3D 场景至关重要，确保近处的物体遮挡远处的物体。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">深度缓冲区（Depth Buffer）</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>深度缓冲区存储每个片段的深度值（Z 值）</li>
          <li>深度值范围通常是 0.0（近平面）到 1.0（远平面）</li>
          <li>在片段着色器执行后，深度测试会检查新片段的深度值</li>
          <li>如果新片段更近（深度值更小），则通过测试并更新深度缓冲区</li>
          <li>如果新片段更远（深度值更大），则被丢弃</li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">深度测试函数</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          深度测试函数决定片段何时通过深度测试：
        </p>
        <CodeBlock title="深度测试设置" code={`// 启用深度测试
gl.enable(gl.DEPTH_TEST);

// 设置深度测试函数
gl.depthFunc(gl.LESS);  // 默认：只绘制更近的片段（深度值更小）

// 深度测试函数选项：
// gl.LESS: 新片段深度 < 已有深度 → 通过（默认，最常用）
// gl.LEQUAL: 新片段深度 <= 已有深度 → 通过
// gl.GREATER: 新片段深度 > 已有深度 → 通过
// gl.GEQUAL: 新片段深度 >= 已有深度 → 通过
// gl.EQUAL: 新片段深度 == 已有深度 → 通过（用于特殊效果）
// gl.NOTEQUAL: 新片段深度 != 已有深度 → 通过
// gl.ALWAYS: 总是通过（相当于禁用深度测试）
// gl.NEVER: 永远不通过

// 清除深度缓冲区（每帧开始时）
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

// 设置深度清除值（默认 1.0，表示最远）
gl.clearDepth(1.0);

// 清除深度缓冲区到指定值
gl.clear(gl.DEPTH_BUFFER_BIT);`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">深度写入控制</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          深度写入控制是否将片段的深度值写入深度缓冲区：
        </p>
        <CodeBlock title="控制深度写入" code={`// 禁用深度写入（用于透明物体）
gl.depthMask(false);

// 启用深度写入（默认）
gl.depthMask(true);

// 示例：绘制透明物体
gl.depthMask(false);  // 不写入深度（透明物体不遮挡后面的物体）
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
// 绘制透明物体...
gl.depthMask(true);  // 恢复深度写入

// 为什么透明物体要禁用深度写入？
// 1. 透明物体应该能看到后面的物体
// 2. 如果写入深度，后面的透明物体会被前面的透明物体遮挡
// 3. 禁用深度写入后，透明物体按绘制顺序混合`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">深度精度和范围</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          深度值的精度和范围设置：
        </p>
        <CodeBlock title="深度精度设置" code={`// 设置深度范围（WebGL 2.0）
// depthRange(near, far) - 将深度值映射到 [near, far] 范围
gl.depthRange(0.0, 1.0);  // 默认：[0.0, 1.0]

// 示例：反转深度范围（用于某些特殊效果）
gl.depthRange(1.0, 0.0);

// 设置深度清除值
gl.clearDepth(1.0);  // 默认：1.0（最远）

// 获取深度缓冲区精度（只读）
const depthBits = gl.getParameter(gl.DEPTH_BITS);
// 通常是 16、24 或 32 位

// 检查是否支持深度纹理（WebGL 2.0）
const supportsDepthTexture = gl.getExtension('WEBGL_depth_texture');`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">深度测试的常见问题</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">Z-Fighting（深度冲突）</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>当两个表面非常接近时，由于深度精度限制，会出现闪烁</li>
          <li><strong className="text-primary font-semibold">解决方法</strong>：
            <ul className="mt-2 pl-6">
              <li>增加近平面和远平面的距离比</li>
              <li>使用更高的深度精度（24 位或 32 位）</li>
              <li>稍微偏移其中一个表面的深度值</li>
              <li>使用多边形偏移（Polygon Offset）</li>
            </ul>
          </li>
        </ul>
        <CodeBlock title="多边形偏移（解决 Z-Fighting）" code={`// 启用多边形偏移
gl.enable(gl.POLYGON_OFFSET_FILL);

// 设置偏移量
// polygonOffset(factor, units)
// 深度偏移 = factor × maxSlope + units × constant
gl.polygonOffset(1.0, 1.0);

// 绘制需要偏移的物体
renderObject();

// 禁用多边形偏移
gl.disable(gl.POLYGON_OFFSET_FILL);

// 示例：绘制线框时避免 Z-Fighting
gl.enable(gl.POLYGON_OFFSET_FILL);
gl.polygonOffset(1.0, 1.0);
renderSolid();  // 绘制实体

gl.disable(gl.POLYGON_OFFSET_FILL);
renderWireframe();  // 绘制线框`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">深度测试的性能优化</h3>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">早深度测试（Early Z-Test）</strong>：
            <ul className="mt-2 pl-6">
              <li>现代 GPU 会在片段着色器执行前进行深度测试</li>
              <li>如果片段会被遮挡，就不执行片段着色器</li>
              <li>避免在片段着色器中修改 gl_FragDepth（会禁用早深度测试）</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">合理设置近远平面</strong>：
            <ul className="mt-2 pl-6">
              <li>近平面不要太近（避免精度问题）</li>
              <li>远平面不要太远（避免精度损失）</li>
              <li>尽量缩小近远平面的距离比</li>
            </ul>
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">面剔除（Face Culling）</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          面剔除（Face Culling）用于优化性能，不绘制不可见的背面。
          这对于封闭的 3D 模型特别有效，可以减少约 50% 的渲染工作量。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">什么是正面和背面？</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>正面（Front Face）：面向相机的面</li>
          <li>背面（Back Face）：背向相机的面</li>
          <li>通过顶点顺序判断：逆时针（CCW）或顺时针（CW）</li>
          <li>对于封闭模型，背面通常不可见，可以安全剔除</li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">面剔除设置</h3>
        <CodeBlock title="面剔除设置" code={`// 启用面剔除
gl.enable(gl.CULL_FACE);

// 设置剔除哪一面
gl.cullFace(gl.BACK);   // 默认：剔除背面（最常用）
// gl.cullFace(gl.FRONT); // 剔除正面（用于特殊效果）
// gl.cullFace(gl.FRONT_AND_BACK); // 剔除两面（不推荐，什么都看不到）

// 设置顶点顺序（用于判断正面/背面）
gl.frontFace(gl.CCW);  // 默认：逆时针为正面（最常用）
// gl.frontFace(gl.CW);  // 顺时针为正面

// 完整示例
gl.enable(gl.CULL_FACE);
gl.cullFace(gl.BACK);
gl.frontFace(gl.CCW);
// 现在只会绘制逆时针顺序的三角形（正面）`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">顶点顺序的重要性</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          顶点顺序决定了面的朝向：
        </p>
        <CodeBlock title="顶点顺序示例" code={`// 正确的顶点顺序（逆时针，从正面看）
// 矩形（从正面看是逆时针）
const positions = [
  // 第一个三角形
  -0.5, -0.5, 0,  // v0
   0.5, -0.5, 0,  // v1
   0.5,  0.5, 0,  // v2
  
  // 第二个三角形
  -0.5, -0.5, 0,  // v0
   0.5,  0.5, 0,  // v2
  -0.5,  0.5, 0,  // v3
];

// 从正面看（Z 轴正方向），顶点顺序是逆时针（CCW）
// 从背面看（Z 轴负方向），顶点顺序是顺时针（CW）

// 如果顶点顺序错误，面会被错误地剔除
// 解决方法：
// 1. 修正顶点顺序
// 2. 或者改变 frontFace 设置（gl.CW）`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">面剔除的应用场景</h3>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">封闭模型</strong>：
            <ul className="mt-2 pl-6">
              <li>立方体、球体、复杂 3D 模型</li>
              <li>背面永远不可见，可以安全剔除</li>
              <li>性能提升约 50%</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">开放模型</strong>：
            <ul className="mt-2 pl-6">
              <li>平面、单面物体（如广告牌）</li>
              <li>可能需要禁用面剔除</li>
              <li>或者只剔除正面（gl.cullFace(gl.FRONT)）</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">双面材质</strong>：
            <ul className="mt-2 pl-6">
              <li>某些材质需要看到两面（如布料、纸张）</li>
              <li>禁用面剔除（gl.disable(gl.CULL_FACE)）</li>
            </ul>
          </li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">面剔除的调试</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          如果模型看起来不完整，可能是面剔除的问题：
        </p>
        <CodeBlock title="调试面剔除" code={`// 1. 禁用面剔除，检查模型是否完整
gl.disable(gl.CULL_FACE);
renderModel();
// 如果模型完整，说明是面剔除的问题

// 2. 尝试改变 frontFace
gl.enable(gl.CULL_FACE);
gl.frontFace(gl.CW);  // 改为顺时针
renderModel();

// 3. 尝试改变 cullFace
gl.cullFace(gl.FRONT);  // 剔除正面而不是背面
renderModel();

// 4. 可视化法线检查面的朝向
// 在片段着色器中：
varying vec3 v_normal;
void main() {
  vec3 color = v_normal * 0.5 + 0.5;  // 可视化法线
  gl_FragColor = vec4(color, 1.0);
}

// 5. 检查顶点顺序
// 确保从正面看，顶点是逆时针顺序（CCW）`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">性能考虑</h3>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">性能提升</strong>：
            <ul className="mt-2 pl-6">
              <li>对于封闭模型，面剔除可以减少约 50% 的渲染工作量</li>
              <li>减少顶点处理、片段着色器执行</li>
              <li>减少深度测试和混合计算</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">最佳实践</strong>：
            <ul className="mt-2 pl-6">
              <li>对于封闭模型，始终启用面剔除</li>
              <li>确保顶点顺序正确（从正面看是逆时针）</li>
              <li>对于开放模型，根据具体情况决定是否启用</li>
            </ul>
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">帧缓冲区（Framebuffer）</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          帧缓冲区（Framebuffer）允许我们将场景渲染到纹理中，而不是直接渲染到屏幕。
          这对于后处理效果、阴影、反射、渲染到纹理等非常重要。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">帧缓冲区的组成</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong>颜色附件（Color Attachment）</strong>：存储颜色信息（通常是纹理）</li>
          <li><strong>深度附件（Depth Attachment）</strong>：存储深度信息（纹理或渲染缓冲区）</li>
          <li><strong>模板附件（Stencil Attachment）</strong>：存储模板信息（可选）</li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">创建帧缓冲区</h3>
        <CodeBlock title="创建帧缓冲区" code={`// 创建帧缓冲区
const framebuffer = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

// ========== 1. 创建颜色附件（纹理）==========
const texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.texImage2D(
  gl.TEXTURE_2D,
  0,                    // mipmap 级别
  gl.RGBA,              // 内部格式
  width,                // 宽度
  height,               // 高度
  0,                    // 边框
  gl.RGBA,              // 格式
  gl.UNSIGNED_BYTE,     // 类型
  null                  // 数据（null 表示分配内存但不初始化）
);

// 设置纹理参数
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

// 将纹理附加到帧缓冲区
gl.framebufferTexture2D(
  gl.FRAMEBUFFER,           // 目标
  gl.COLOR_ATTACHMENT0,     // 附件点
  gl.TEXTURE_2D,            // 纹理目标
  texture,                  // 纹理对象
  0                         // mipmap 级别
);

// ========== 2. 创建深度缓冲区（方法 1：使用渲染缓冲区）==========
const depthBuffer = gl.createRenderbuffer();
gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
gl.renderbufferStorage(
  gl.RENDERBUFFER,
  gl.DEPTH_COMPONENT16,     // 深度格式（16 位）
  width,
  height
);
gl.framebufferRenderbuffer(
  gl.FRAMEBUFFER,
  gl.DEPTH_ATTACHMENT,
  gl.RENDERBUFFER,
  depthBuffer
);

// ========== 3. 创建深度缓冲区（方法 2：使用深度纹理，WebGL 2.0）==========
// 需要扩展：WEBGL_depth_texture
const depthTexture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, depthTexture);
gl.texImage2D(
  gl.TEXTURE_2D,
  0,
  gl.DEPTH_COMPONENT,       // 深度格式
  width,
  height,
  0,
  gl.DEPTH_COMPONENT,
  gl.UNSIGNED_SHORT,
  null
);
gl.framebufferTexture2D(
  gl.FRAMEBUFFER,
  gl.DEPTH_ATTACHMENT,
  gl.TEXTURE_2D,
  depthTexture,
  0
);

// ========== 4. 检查帧缓冲区是否完整 ==========
const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
if (status !== gl.FRAMEBUFFER_COMPLETE) {
  switch (status) {
    case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
      console.error('帧缓冲区附件不完整');
      break;
    case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
      console.error('帧缓冲区尺寸不一致');
      break;
    case gl.FRAMEBUFFER_UNSUPPORTED:
      console.error('帧缓冲区格式不支持');
      break;
    default:
      console.error('帧缓冲区不完整');
  }
}

// ========== 5. 使用帧缓冲区 ==========
// 渲染到帧缓冲区
gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
gl.viewport(0, 0, width, height);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
// ... 渲染场景 ...

// 切换回默认帧缓冲区（屏幕）
gl.bindFramebuffer(gl.FRAMEBUFFER, null);
gl.viewport(0, 0, canvas.width, canvas.height);
// ... 使用纹理进行后处理 ...`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">多渲染目标（MRT）</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          WebGL 2.0 支持多渲染目标（Multiple Render Targets），可以同时渲染到多个纹理：
        </p>
        <CodeBlock title="多渲染目标（WebGL 2.0）" code={`// WebGL 2.0 支持多个颜色附件
const framebuffer = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

// 创建多个颜色纹理
const colorTexture0 = createTexture(width, height, gl.RGBA);
const colorTexture1 = createTexture(width, height, gl.RGBA);
const normalTexture = createTexture(width, height, gl.RGBA);

// 附加到不同的颜色附件点
gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, colorTexture0, 0);
gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, colorTexture1, 0);
gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT2, gl.TEXTURE_2D, normalTexture, 0);

// 指定要绘制到的附件
const drawBuffers = [
  gl.COLOR_ATTACHMENT0,
  gl.COLOR_ATTACHMENT1,
  gl.COLOR_ATTACHMENT2
];
gl.drawBuffers(drawBuffers);

// 在片段着色器中输出到多个目标
// #version 300 es
// layout(location = 0) out vec4 fragColor;
// layout(location = 1) out vec4 fragColor1;
// layout(location = 2) out vec4 fragNormal;
// 
// void main() {
//   fragColor = vec4(1.0, 0.0, 0.0, 1.0);   // 输出到 COLOR_ATTACHMENT0
//   fragColor1 = vec4(0.0, 1.0, 0.0, 1.0);  // 输出到 COLOR_ATTACHMENT1
//   fragNormal = vec4(normal, 1.0);         // 输出到 COLOR_ATTACHMENT2
// }`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">帧缓冲区的应用场景</h3>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">后处理效果</strong>：
            <ul className="mt-2 pl-6">
              <li>模糊、色调映射、边缘检测等</li>
              <li>先渲染场景到纹理，再对纹理进行处理</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">阴影映射（Shadow Mapping）</strong>：
            <ul className="mt-2 pl-6">
              <li>从光源视角渲染场景到深度纹理</li>
              <li>使用深度纹理判断阴影</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">反射和折射</strong>：
            <ul className="mt-2 pl-6">
              <li>渲染反射场景到纹理</li>
              <li>在物体表面使用反射纹理</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">渲染到纹理</strong>：
            <ul className="mt-2 pl-6">
              <li>动态生成纹理</li>
              <li>用于 UI、小地图等</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">延迟渲染（Deferred Rendering）</strong>：
            <ul className="mt-2 pl-6">
              <li>先渲染几何信息到多个纹理（G-Buffer）</li>
              <li>再在光照阶段使用这些信息</li>
            </ul>
          </li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">帧缓冲区的性能优化</h3>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">合理设置尺寸</strong>：
            <ul className="mt-2 pl-6">
              <li>不需要全分辨率时，使用较小的尺寸</li>
              <li>例如：后处理可以使用一半分辨率</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">复用帧缓冲区</strong>：
            <ul className="mt-2 pl-6">
              <li>创建一次，多次使用</li>
              <li>避免频繁创建和销毁</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">使用渲染缓冲区</strong>：
            <ul className="mt-2 pl-6">
              <li>如果不需要读取深度值，使用渲染缓冲区而不是纹理</li>
              <li>渲染缓冲区性能更好</li>
            </ul>
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">后处理效果</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          后处理（Post-Processing）是在场景渲染完成后对图像进行的处理。
          后处理可以大大增强视觉效果，创建电影级的画面质量。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">后处理的基本流程</strong>：
        </p>
        <ol className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>渲染场景到帧缓冲区的纹理</li>
          <li>切换到默认帧缓冲区（屏幕）</li>
          <li>使用后处理着色器渲染全屏四边形</li>
          <li>对纹理进行图像处理</li>
        </ol>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">创建全屏四边形</h3>
        <CodeBlock title="全屏四边形" code={`// 创建全屏四边形的顶点数据
const quadPositions = [
  -1, -1,  // 左下
   1, -1,  // 右下
  -1,  1,  // 左上
   1,  1,  // 右上
];

const quadTexCoords = [
  0, 0,  // 左下
  1, 0,  // 右下
  0, 1,  // 左上
  1, 1,  // 右上
];

const quadIndices = [0, 1, 2, 1, 3, 2];

// 顶点着色器（全屏四边形）
attribute vec2 a_position;
attribute vec2 a_texCoord;
varying vec2 v_texCoord;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_texCoord = a_texCoord;
}

// 片段着色器（后处理）
precision mediump float;
uniform sampler2D u_texture;
varying vec2 v_texCoord;

void main() {
  vec4 color = texture2D(u_texture, v_texCoord);
  gl_FragColor = color;
}`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">常见的后处理效果</h3>
        
        <h4 className="text-xl my-6 text-dark-text dark:text-dark-text text-light-text">1. 灰度效果</h4>
        <CodeBlock title="灰度效果" code={`precision mediump float;
uniform sampler2D u_texture;
varying vec2 v_texCoord;

void main() {
  vec4 color = texture2D(u_texture, v_texCoord);
  // 使用亮度公式转换为灰度
  float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
  gl_FragColor = vec4(gray, gray, gray, color.a);
}`} />
        
        <h4 className="text-xl my-6 text-dark-text dark:text-dark-text text-light-text">2. 高斯模糊</h4>
        <CodeBlock title="高斯模糊" code={`precision mediump float;
uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_blurRadius;
varying vec2 v_texCoord;

void main() {
  vec4 color = vec4(0.0);
  float total = 0.0;
  
  // 高斯模糊核（5x5）
  float weights[25] = float[](
    0.003765, 0.015019, 0.023792, 0.015019, 0.003765,
    0.015019, 0.059912, 0.094907, 0.059912, 0.015019,
    0.023792, 0.094907, 0.150342, 0.094907, 0.023792,
    0.015019, 0.059912, 0.094907, 0.059912, 0.015019,
    0.003765, 0.015019, 0.023792, 0.015019, 0.003765
  );
  
  vec2 texelSize = 1.0 / u_resolution;
  
  for (int y = -2; y <= 2; y++) {
    for (int x = -2; x <= 2; x++) {
      vec2 offset = vec2(float(x), float(y)) * texelSize * u_blurRadius;
      float weight = weights[(y + 2) * 5 + (x + 2)];
      color += texture2D(u_texture, v_texCoord + offset) * weight;
      total += weight;
    }
  }
  
  gl_FragColor = color / total;
}

// 更高效的方法：分离式高斯模糊（两次一维模糊）
// 先水平模糊，再垂直模糊`} />
        
        <h4 className="text-xl my-6 text-dark-text dark:text-dark-text text-light-text">3. 边缘检测（Sobel）</h4>
        <CodeBlock title="Sobel 边缘检测" code={`precision mediump float;
uniform sampler2D u_texture;
uniform vec2 u_resolution;
varying vec2 v_texCoord;

void main() {
  vec2 texelSize = 1.0 / u_resolution;
  
  // Sobel 算子
  float topLeft = dot(texture2D(u_texture, v_texCoord + vec2(-texelSize.x, -texelSize.y)).rgb, vec3(0.299, 0.587, 0.114));
  float top = dot(texture2D(u_texture, v_texCoord + vec2(0.0, -texelSize.y)).rgb, vec3(0.299, 0.587, 0.114));
  float topRight = dot(texture2D(u_texture, v_texCoord + vec2(texelSize.x, -texelSize.y)).rgb, vec3(0.299, 0.587, 0.114));
  float left = dot(texture2D(u_texture, v_texCoord + vec2(-texelSize.x, 0.0)).rgb, vec3(0.299, 0.587, 0.114));
  float center = dot(texture2D(u_texture, v_texCoord).rgb, vec3(0.299, 0.587, 0.114));
  float right = dot(texture2D(u_texture, v_texCoord + vec2(texelSize.x, 0.0)).rgb, vec3(0.299, 0.587, 0.114));
  float bottomLeft = dot(texture2D(u_texture, v_texCoord + vec2(-texelSize.x, texelSize.y)).rgb, vec3(0.299, 0.587, 0.114));
  float bottom = dot(texture2D(u_texture, v_texCoord + vec2(0.0, texelSize.y)).rgb, vec3(0.299, 0.587, 0.114));
  float bottomRight = dot(texture2D(u_texture, v_texCoord + vec2(texelSize.x, texelSize.y)).rgb, vec3(0.299, 0.587, 0.114));
  
  // Sobel X 和 Y
  float sobelX = -topLeft - 2.0 * top - topRight + bottomLeft + 2.0 * bottom + bottomRight;
  float sobelY = -topLeft - 2.0 * left - bottomLeft + topRight + 2.0 * right + bottomRight;
  
  float edge = sqrt(sobelX * sobelX + sobelY * sobelY);
  gl_FragColor = vec4(edge, edge, edge, 1.0);
}`} />
        
        <h4 className="text-xl my-6 text-dark-text dark:text-dark-text text-light-text">4. 色调映射和颜色调整</h4>
        <CodeBlock title="色调映射和颜色调整" code={`precision mediump float;
uniform sampler2D u_texture;
uniform float u_brightness;    // 亮度（-1 到 1）
uniform float u_contrast;      // 对比度（-1 到 1）
uniform float u_saturation;    // 饱和度（0 到 2）
uniform float u_exposure;      // 曝光（0.1 到 5.0）
varying vec2 v_texCoord;

void main() {
  vec4 color = texture2D(u_texture, v_texCoord);
  
  // 曝光调整
  color.rgb *= u_exposure;
  
  // 亮度调整
  color.rgb += u_brightness;
  
  // 对比度调整
  color.rgb = (color.rgb - 0.5) * (1.0 + u_contrast) + 0.5;
  
  // 饱和度调整
  float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
  color.rgb = mix(vec3(gray), color.rgb, u_saturation);
  
  // 色调映射（Reinhard）
  color.rgb = color.rgb / (1.0 + color.rgb);
  
  gl_FragColor = color;
}`} />
        
        <h4 className="text-xl my-6 text-dark-text dark:text-dark-text text-light-text">5. Bloom 效果</h4>
        <CodeBlock title="Bloom 效果" code={`// Bloom 效果需要多个步骤：
// 1. 提取亮部
// 2. 模糊亮部
// 3. 与原始图像混合

// 步骤 1：提取亮部
precision mediump float;
uniform sampler2D u_texture;
uniform float u_threshold;  // 亮度阈值
varying vec2 v_texCoord;

void main() {
  vec4 color = texture2D(u_texture, v_texCoord);
  float brightness = dot(color.rgb, vec3(0.299, 0.587, 0.114));
  
  if (brightness > u_threshold) {
    gl_FragColor = color;
  } else {
    gl_FragColor = vec4(0.0);
  }
}

// 步骤 2：模糊亮部（使用高斯模糊）

// 步骤 3：混合
precision mediump float;
uniform sampler2D u_original;
uniform sampler2D u_bloom;
uniform float u_bloomIntensity;
varying vec2 v_texCoord;

void main() {
  vec4 original = texture2D(u_original, v_texCoord);
  vec4 bloom = texture2D(u_bloom, v_texCoord);
  
  // 加法混合
  gl_FragColor = original + bloom * u_bloomIntensity;
}`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">后处理链</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          多个后处理效果可以串联使用：
        </p>
        <CodeBlock title="后处理链" code={`// 后处理链示例
function renderWithPostProcessing() {
  // 1. 渲染场景到第一个帧缓冲区
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer1);
  renderScene();
  
  // 2. 应用第一个后处理效果（如提取亮部）
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer2);
  applyPostProcess(postProcessProgram1, texture1);
  
  // 3. 应用第二个后处理效果（如模糊）
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer1);
  applyPostProcess(postProcessProgram2, texture2);
  
  // 4. 应用第三个后处理效果（如混合）
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  applyPostProcess(postProcessProgram3, texture1, texture2);
}

// 通用后处理函数
function applyPostProcess(program, ...textures) {
  gl.useProgram(program);
  
  // 绑定纹理
  textures.forEach((texture, index) => {
    gl.activeTexture(gl.TEXTURE0 + index);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(gl.getUniformLocation(program, 'u_texture' + index), index);
  });
  
  // 渲染全屏四边形
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">后处理的性能优化</h3>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">降低分辨率</strong>：
            <ul className="mt-2 pl-6">
              <li>后处理不需要全分辨率</li>
              <li>可以使用一半或四分之一分辨率</li>
              <li>性能提升显著，视觉差异不大</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">分离式模糊</strong>：
            <ul className="mt-2 pl-6">
              <li>将二维模糊分离为两次一维模糊</li>
              <li>性能提升约 2 倍</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">减少采样次数</strong>：
            <ul className="mt-2 pl-6">
              <li>使用较小的采样核</li>
              <li>使用下采样和上采样</li>
            </ul>
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">渲染状态管理</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          在复杂的场景中，合理管理渲染状态非常重要。
          良好的状态管理可以显著提升性能，减少状态切换的开销。
        </p>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">渲染状态分类</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          WebGL 的渲染状态包括：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">深度测试</strong>：gl.enable(gl.DEPTH_TEST)、gl.depthFunc()、gl.depthMask()</li>
          <li><strong className="text-primary font-semibold">混合</strong>：gl.enable(gl.BLEND)、gl.blendFunc()、gl.blendEquation()</li>
          <li><strong className="text-primary font-semibold">面剔除</strong>：gl.enable(gl.CULL_FACE)、gl.cullFace()、gl.frontFace()</li>
          <li><strong className="text-primary font-semibold">着色器程序</strong>：gl.useProgram()</li>
          <li><strong className="text-primary font-semibold">纹理</strong>：gl.bindTexture()、gl.activeTexture()</li>
          <li><strong className="text-primary font-semibold">缓冲区</strong>：gl.bindBuffer()、gl.bindFramebuffer()</li>
          <li><strong className="text-primary font-semibold">视口</strong>：gl.viewport()</li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">按状态分组绘制</h3>
        <CodeBlock title="渲染状态管理最佳实践" code={`// ========== 1. 按状态分组绘制 ==========
// 先绘制所有不透明的物体
gl.enable(gl.DEPTH_TEST);
gl.depthFunc(gl.LESS);
gl.depthMask(true);      // 启用深度写入
gl.disable(gl.BLEND);
gl.enable(gl.CULL_FACE);
gl.cullFace(gl.BACK);
renderOpaqueObjects();

// 然后绘制透明物体
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
gl.depthMask(false);     // 禁用深度写入（透明物体不写入深度）
gl.disable(gl.CULL_FACE); // 透明物体可能需要双面渲染
renderTransparentObjects();
gl.depthMask(true);      // 恢复深度写入

// ========== 2. 减少状态切换 ==========
// 不好的做法：频繁切换状态
for (let obj of objects) {
  gl.useProgram(obj.program);
  gl.bindTexture(gl.TEXTURE_2D, obj.texture);
  gl.uniformMatrix4fv(mvpLocation, false, obj.mvpMatrix);
  render(obj);
}

// 好的做法：按状态分组
const grouped = groupByState(objects);
for (let group of grouped) {
  // 设置一次状态
  gl.useProgram(group.program);
  gl.bindTexture(gl.TEXTURE_2D, group.texture);
  
  // 绘制所有使用相同状态的物体
  for (let obj of group.objects) {
    gl.uniformMatrix4fv(mvpLocation, false, obj.mvpMatrix);
    render(obj);
  }
}

// ========== 3. 状态分组函数示例 ==========
function groupByState(objects) {
  const groups = new Map();
  
  for (const obj of objects) {
    const key = obj.program.id + '_' + obj.texture.id;
    if (!groups.has(key)) {
      groups.set(key, {
        program: obj.program,
        texture: obj.texture,
        objects: []
      });
    }
    groups.get(key).objects.push(obj);
  }
  
  return Array.from(groups.values());
}

// ========== 4. 渲染顺序优化 ==========
function renderScene() {
  // 1. 不透明物体（启用深度测试）
  gl.enable(gl.DEPTH_TEST);
  gl.depthMask(true);
  gl.disable(gl.BLEND);
  renderOpaqueObjects();
  
  // 2. 透明物体（按深度排序，从后往前）
  const transparentObjects = getTransparentObjects();
  transparentObjects.sort((a, b) => {
    return distance(camera, b) - distance(camera, a);
  });
  
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.depthMask(false);
  for (const obj of transparentObjects) {
    renderObject(obj);
  }
  gl.depthMask(true);
  
  // 3. UI 元素（禁用深度测试）
  gl.disable(gl.DEPTH_TEST);
  renderUI();
}`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">状态缓存和查询</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          避免不必要的状态设置：
        </p>
        <CodeBlock title="状态缓存" code={`// 状态缓存类
class StateCache {
  constructor(gl) {
    this.gl = gl;
    this.currentProgram = null;
    this.currentTexture = null;
    this.depthTestEnabled = false;
    this.blendEnabled = false;
    // ... 其他状态
  }
  
  useProgram(program) {
    if (this.currentProgram !== program) {
      this.gl.useProgram(program);
      this.currentProgram = program;
    }
  }
  
  bindTexture(target, texture) {
    if (this.currentTexture !== texture) {
      this.gl.bindTexture(target, texture);
      this.currentTexture = texture;
    }
  }
  
  enable(cap) {
    if (cap === gl.DEPTH_TEST && !this.depthTestEnabled) {
      this.gl.enable(cap);
      this.depthTestEnabled = true;
    } else if (cap === gl.BLEND && !this.blendEnabled) {
      this.gl.enable(cap);
      this.blendEnabled = true;
    }
  }
  
  disable(cap) {
    if (cap === gl.DEPTH_TEST && this.depthTestEnabled) {
      this.gl.disable(cap);
      this.depthTestEnabled = false;
    } else if (cap === gl.BLEND && this.blendEnabled) {
      this.gl.disable(cap);
      this.blendEnabled = false;
    }
  }
}

// 使用状态缓存
const stateCache = new StateCache(gl);
stateCache.useProgram(program);  // 只在状态改变时调用 gl.useProgram
stateCache.bindTexture(gl.TEXTURE_2D, texture);`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">性能优化建议</h3>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">减少状态切换</strong>：
            <ul className="mt-2 pl-6">
              <li>按状态分组绘制物体</li>
              <li>使用状态缓存避免重复设置</li>
              <li>批量绘制相同状态的物体</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">合理的绘制顺序</strong>：
            <ul className="mt-2 pl-6">
              <li>先绘制不透明物体</li>
              <li>再绘制透明物体（按深度排序）</li>
              <li>最后绘制 UI 元素</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">减少 Draw Call</strong>：
            <ul className="mt-2 pl-6">
              <li>合并相同材质的物体</li>
              <li>使用实例化渲染（Instancing）</li>
              <li>使用纹理图集（Texture Atlas）</li>
            </ul>
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">关键概念总结</h2>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">透明度与混合</strong>：
            <ul className="mt-2 pl-6">
              <li>使用 gl.BLEND 实现透明效果</li>
              <li>混合公式：result = srcFactor × srcColor + dstFactor × dstColor</li>
              <li>标准透明度：gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)</li>
              <li>绘制顺序：从后往前绘制透明物体</li>
              <li>透明物体应禁用深度写入（gl.depthMask(false)）</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">深度测试</strong>：
            <ul className="mt-2 pl-6">
              <li>确定片段的可见性，确保近处物体遮挡远处物体</li>
              <li>深度测试函数：gl.depthFunc(gl.LESS)（默认）</li>
              <li>深度写入控制：gl.depthMask(true/false)</li>
              <li>Z-Fighting 问题：使用多边形偏移解决</li>
              <li>性能优化：合理设置近远平面距离比</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">面剔除</strong>：
            <ul className="mt-2 pl-6">
              <li>优化性能，不绘制不可见的背面</li>
              <li>对于封闭模型，可以减少约 50% 的渲染工作量</li>
              <li>设置：gl.cullFace(gl.BACK)、gl.frontFace(gl.CCW)</li>
              <li>确保顶点顺序正确（从正面看是逆时针）</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">帧缓冲区</strong>：
            <ul className="mt-2 pl-6">
              <li>渲染到纹理，用于后处理、阴影、反射等</li>
              <li>组成：颜色附件、深度附件、模板附件</li>
              <li>WebGL 2.0 支持多渲染目标（MRT）</li>
              <li>应用场景：后处理、阴影映射、延迟渲染等</li>
              <li>性能优化：合理设置尺寸，复用帧缓冲区</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">后处理</strong>：
            <ul className="mt-2 pl-6">
              <li>对渲染结果进行图像处理</li>
              <li>常见效果：模糊、色调映射、边缘检测、Bloom 等</li>
              <li>流程：渲染场景到纹理 → 切换到屏幕 → 后处理着色器</li>
              <li>多个效果可以串联使用（后处理链）</li>
              <li>性能优化：降低分辨率、分离式模糊、减少采样次数</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">渲染状态管理</strong>：
            <ul className="mt-2 pl-6">
              <li>合理组织绘制顺序，减少状态切换</li>
              <li>按状态分组绘制：先不透明，再透明，最后 UI</li>
              <li>使用状态缓存避免重复设置</li>
              <li>减少 Draw Call：合并相同材质的物体</li>
              <li>性能优化：批量绘制、实例化渲染、纹理图集</li>
            </ul>
          </li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          掌握这些高级渲染技术，可以创建更加真实和美观的 3D 场景。
          合理使用这些技术，既能提升视觉效果，又能优化性能。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">最佳实践总结</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>始终启用深度测试和面剔除（对于封闭模型）</li>
          <li>透明物体从后往前绘制，禁用深度写入</li>
          <li>按状态分组绘制，减少状态切换</li>
          <li>后处理使用较低分辨率，性能提升显著</li>
          <li>使用帧缓冲区实现复杂效果（阴影、反射等）</li>
          <li>合理管理渲染状态，提升整体性能</li>
        </ul>
      </section>
      
      <ChapterNavigation />
    </div>
  )
}
