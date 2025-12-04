import WebGLCanvas from '../../components/WebGLCanvas'
import CodeBlock from '../../components/CodeBlock'
import ChapterNavigation from '../../components/ChapterNavigation'
import { createProgram, createBuffer, setAttribute, Matrix, createIndexBuffer } from '../../utils/webgl'

export default function Chapter7() {
  return (
    <div className="w-full">
      <h1 className="text-4xl mb-8 text-primary border-b-2 border-dark-border dark:border-dark-border border-light-border pb-4">第七章：高级渲染技术</h1>
      
      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">透明度与混合</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          透明度是创建玻璃、水、烟雾等效果的关键技术。在 WebGL 中，我们需要启用混合（Blending）来实现透明度效果。
        </p>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">启用混合</h3>
        <CodeBlock title="启用混合" code={`// 启用混合
gl.enable(gl.BLEND);

// 设置混合函数
// src = 源颜色（新绘制的片段）
// dst = 目标颜色（已存在的颜色）
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

// 常见的混合模式：
// gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);  // 标准透明度
// gl.blendFunc(gl.ONE, gl.ONE);                        // 加法混合
// gl.blendFunc(gl.DST_COLOR, gl.ZERO);                 // 乘法混合`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">透明度示例</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          下面展示了透明度的效果：
        </p>
        
        <WebGLCanvas width={400} height={400} onInit={(gl: WebGLRenderingContext, canvas: HTMLCanvasElement) => {
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
        }} />
        
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">重要提示</strong>：绘制透明物体时，需要从后往前绘制，才能得到正确的混合效果。
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">深度测试</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          深度测试（Depth Test）用于确定哪些片段应该被绘制，哪些应该被丢弃。这对于正确渲染 3D 场景至关重要。
        </p>
        
        <CodeBlock title="深度测试设置" code={`// 启用深度测试
gl.enable(gl.DEPTH_TEST);

// 设置深度测试函数
gl.depthFunc(gl.LESS);  // 默认：只绘制更近的片段

// 其他选项：
// gl.LEQUAL: 小于等于
// gl.GREATER: 大于
// gl.GEQUAL: 大于等于
// gl.EQUAL: 等于
// gl.NOTEQUAL: 不等于
// gl.ALWAYS: 总是通过
// gl.NEVER: 永远不通过

// 清除深度缓冲区
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">深度写入控制</h3>
        <CodeBlock title="控制深度写入" code={`// 禁用深度写入（用于透明物体）
gl.depthMask(false);

// 启用深度写入（默认）
gl.depthMask(true);

// 示例：绘制透明物体
gl.depthMask(false);  // 不写入深度
gl.enable(gl.BLEND);
// 绘制透明物体...
gl.depthMask(true);  // 恢复深度写入`} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">面剔除（Face Culling）</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          面剔除用于优化性能，不绘制不可见的背面。这对于封闭的 3D 模型特别有效。
        </p>
        
        <CodeBlock title="面剔除设置" code={`// 启用面剔除
gl.enable(gl.CULL_FACE);

// 设置剔除哪一面
gl.cullFace(gl.BACK);   // 默认：剔除背面
// gl.cullFace(gl.FRONT); // 剔除正面
// gl.cullFace(gl.FRONT_AND_BACK); // 剔除两面（不推荐）

// 设置顶点顺序（用于判断正面/背面）
gl.frontFace(gl.CCW);  // 默认：逆时针为正面
// gl.frontFace(gl.CW);  // 顺时针为正面`} />
        
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">提示</strong>：确保你的顶点顺序正确，否则面剔除可能产生错误的结果。
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">帧缓冲区（Framebuffer）</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          帧缓冲区允许我们将场景渲染到纹理中，而不是直接渲染到屏幕。这对于后处理效果、阴影、反射等非常重要。
        </p>
        
        <CodeBlock title="创建帧缓冲区" code={`// 创建帧缓冲区
const framebuffer = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

// 创建纹理作为颜色附件
const texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

// 将纹理附加到帧缓冲区
gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

// 创建深度缓冲区（可选）
const depthBuffer = gl.createRenderbuffer();
gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

// 检查帧缓冲区是否完整
if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
  console.error('帧缓冲区不完整');
}

// 渲染到帧缓冲区
gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
gl.viewport(0, 0, width, height);
// ... 渲染场景 ...

// 切换回默认帧缓冲区（屏幕）
gl.bindFramebuffer(gl.FRAMEBUFFER, null);
gl.viewport(0, 0, canvas.width, canvas.height);
// ... 使用纹理进行后处理 ...`} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">后处理效果</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          后处理是在场景渲染完成后对图像进行的处理。常见的后处理效果包括：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">模糊（Blur）</strong>：高斯模糊、运动模糊</li>
          <li><strong className="text-primary font-semibold">色调映射（Tone Mapping）</strong>：调整亮度和对比度</li>
          <li><strong className="text-primary font-semibold">边缘检测</strong>：Sobel、Canny 算子</li>
          <li><strong className="text-primary font-semibold">颜色调整</strong>：饱和度、色相、对比度</li>
          <li><strong className="text-primary font-semibold">Bloom</strong>：发光效果</li>
        </ul>
        
        <CodeBlock title="简单的后处理示例" code={`// 1. 渲染场景到纹理
gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
renderScene();

// 2. 切换到屏幕
gl.bindFramebuffer(gl.FRAMEBUFFER, null);

// 3. 使用后处理着色器渲染全屏四边形
gl.useProgram(postProcessProgram);
gl.bindTexture(gl.TEXTURE_2D, renderedTexture);
gl.drawArrays(gl.TRIANGLES, 0, 6);

// 后处理片段着色器示例（灰度效果）
precision mediump float;
uniform sampler2D u_texture;
varying vec2 v_texCoord;

void main() {
  vec4 color = texture2D(u_texture, v_texCoord);
  float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
  gl_FragColor = vec4(gray, gray, gray, color.a);
}`} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">渲染状态管理</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          在复杂的场景中，合理管理渲染状态非常重要：
        </p>
        
        <CodeBlock title="渲染状态管理最佳实践" code={`// 1. 按状态分组绘制
// 先绘制所有不透明的物体
gl.enable(gl.DEPTH_TEST);
gl.disable(gl.BLEND);
gl.depthMask(true);
renderOpaqueObjects();

// 然后绘制透明物体
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
gl.depthMask(false);  // 透明物体不写入深度
renderTransparentObjects();
gl.depthMask(true);

// 2. 减少状态切换
// 不好的做法：频繁切换状态
for (let obj of objects) {
  gl.useProgram(obj.program);
  gl.bindTexture(gl.TEXTURE_2D, obj.texture);
  render(obj);
}

// 好的做法：按状态分组
const grouped = groupByState(objects);
for (let group of grouped) {
  gl.useProgram(group.program);
  gl.bindTexture(gl.TEXTURE_2D, group.texture);
  for (let obj of group.objects) {
    render(obj);
  }
}`} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">关键概念总结</h2>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">透明度与混合</strong>：使用 gl.BLEND 实现透明效果</li>
          <li><strong className="text-primary font-semibold">深度测试</strong>：确定片段的可见性</li>
          <li><strong className="text-primary font-semibold">面剔除</strong>：优化性能，不绘制不可见面</li>
          <li><strong className="text-primary font-semibold">帧缓冲区</strong>：渲染到纹理，用于后处理</li>
          <li><strong className="text-primary font-semibold">后处理</strong>：对渲染结果进行图像处理</li>
          <li><strong className="text-primary font-semibold">渲染状态管理</strong>：合理组织绘制顺序，减少状态切换</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          掌握这些高级渲染技术，可以创建更加真实和美观的 3D 场景。
        </p>
      </section>
      
      <ChapterNavigation />
    </div>
  )
}
