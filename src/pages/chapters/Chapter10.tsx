import FlipCard from '../../components/FlipCard'
import CodeBlock from '../../components/CodeBlock'
import ChapterNavigation from '../../components/ChapterNavigation'
import { createProgram, createBuffer, setAttribute, Matrix } from '../../utils/webgl'

export default function Chapter10() {
  return (
    <div className="w-full">
      <h1 className="text-4xl mb-8 text-primary border-b-2 border-dark-border dark:border-dark-border border-light-border pb-4">第十章：高级渲染技术</h1>
      
      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">透明度与混合</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          透明度（Transparency）是高级渲染技术中的重要概念。通过混合（Blending），我们可以实现玻璃、水、半透明物体等效果。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">Alpha 通道</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>RGBA 颜色中的 A（Alpha）通道控制不透明度</li>
          <li>Alpha = 0：完全透明</li>
          <li>Alpha = 1：完全不透明</li>
          <li>Alpha 在 0 到 1 之间：半透明</li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">启用混合</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          要使用透明度，需要启用混合功能：
        </p>
        <CodeBlock title="启用混合" code={`// 启用混合
gl.enable(gl.BLEND);

// 设置混合函数（标准透明度）
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
// 结果 = srcColor × srcAlpha + dstColor × (1 - srcAlpha)

// 可选：设置混合方程
gl.blendEquation(gl.FUNC_ADD);  // 默认值：相加`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">混合函数</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">混合公式</strong>：
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <code className="bg-dark-bg dark:bg-dark-bg px-1 py-0.5 rounded">result = srcFactor × srcColor + dstFactor × dstColor</code>
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong>srcColor</strong>：源颜色（新绘制的片段颜色）</li>
          <li><strong>dstColor</strong>：目标颜色（已存在的颜色）</li>
          <li><strong>srcFactor</strong>：源因子</li>
          <li><strong>dstFactor</strong>：目标因子</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">常用的混合因子</strong>：
        </p>
        <CodeBlock title="混合因子选项" code={`// 标准透明度（最常用）
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
// result = srcColor × srcAlpha + dstColor × (1 - srcAlpha)

// 加法混合（用于发光效果）
gl.blendFunc(gl.ONE, gl.ONE);
// result = srcColor + dstColor

// 乘法混合
gl.blendFunc(gl.DST_COLOR, gl.ZERO);
// result = srcColor × dstColor

// 减法混合
gl.blendEquation(gl.FUNC_SUBTRACT);
gl.blendFunc(gl.ONE, gl.ONE);
// result = dstColor - srcColor`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">绘制顺序的重要性</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          绘制透明物体时，绘制顺序非常重要。通常需要：
        </p>
        <ol className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>先绘制不透明物体（启用深度测试）</li>
          <li>按从远到近的顺序绘制透明物体（禁用深度写入，但启用深度测试）</li>
        </ol>
        <CodeBlock title="透明物体绘制顺序" code={`// 1. 绘制不透明物体
gl.enable(gl.DEPTH_TEST);
gl.depthMask(true);  // 启用深度写入
gl.disable(gl.BLEND);
// ... 绘制不透明物体 ...

// 2. 绘制透明物体（从远到近）
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
gl.depthMask(false);  // 禁用深度写入（但仍进行深度测试）
// ... 按距离排序后绘制透明物体 ...`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">透明度示例</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          下面的示例展示了透明立方体的效果：
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
            
            // 立方体顶点数据
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
              -0.5, -0.5, -0.5,  -0.5, -0.5,  0.5,  -0.5,  0.5,  0.5,  -0.5,  0.5, -0.5
            ]
            
            const indices = [
              0,  1,  2,   0,  2,  3,    // 前面
              4,  5,  6,   4,  6,  7,    // 后面
              8,  9,  10,  8,  10, 11,   // 上面
              12, 13, 14,  12, 14, 15,   // 下面
              16, 17, 18,  16, 18, 19,   // 右面
              20, 21, 22,  20, 22, 23    // 左面
            ]
            
            const positionBuffer = createBuffer(gl, positions)
            const indexBuffer = gl.createBuffer()
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)
            
            gl.viewport(0, 0, canvas.width, canvas.height)
            gl.enable(gl.DEPTH_TEST)
            gl.enable(gl.BLEND)
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
            gl.clearColor(0.1, 0.1, 0.1, 1.0)
            
            const aspect = canvas.width / canvas.height
            const projectionMatrix = Matrix.perspective(Math.PI / 4, aspect, 0.1, 100)
            const viewMatrix = Matrix.lookAt(2, 2, 2, 0, 0, 0, 0, 1, 0)
            const modelMatrix = Matrix.identity()
            const mvpMatrix = Matrix.multiply(projectionMatrix, Matrix.multiply(viewMatrix, modelMatrix))
            
            const mvpMatrixLocation = gl.getUniformLocation(program, 'u_mvpMatrix')
            const colorLocation = gl.getUniformLocation(program, 'u_color')
            
            const render = () => {
              gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
              gl.useProgram(program)
              
              gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
              setAttribute(gl, program, 'a_position', 3)
              gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
              
              gl.uniformMatrix4fv(mvpMatrixLocation, false, mvpMatrix)
              
              // 绘制三个透明立方体，使用不同颜色和透明度
              const cubes = [
                { color: [1.0, 0.0, 0.0, 0.5], offset: [-0.6, 0, 0] },  // 红色，半透明
                { color: [0.0, 1.0, 0.0, 0.5], offset: [0, 0, 0] },      // 绿色，半透明
                { color: [0.0, 0.0, 1.0, 0.5], offset: [0.6, 0, 0] }     // 蓝色，半透明
              ]
              
              // 按从远到近的顺序绘制（这里简化处理）
              cubes.forEach(cube => {
                const translation = Matrix.translation(cube.offset[0], cube.offset[1], cube.offset[2])
                const model = Matrix.multiply(modelMatrix, translation)
                const mvp = Matrix.multiply(projectionMatrix, Matrix.multiply(viewMatrix, model))
                gl.uniformMatrix4fv(mvpMatrixLocation, false, mvp)
                gl.uniform4f(colorLocation, cube.color[0], cube.color[1], cube.color[2], cube.color[3])
                gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0)
              })
            }
            render()
          }}
          codeBlocks={[
            { title: '顶点着色器', code: `attribute vec3 a_position;
uniform mat4 u_mvpMatrix;

void main() {
  gl_Position = u_mvpMatrix * vec4(a_position, 1.0);
}` },
            { title: '片段着色器', code: `precision mediump float;
uniform vec4 u_color;  // RGBA，包含 Alpha 通道

void main() {
  gl_FragColor = u_color;
}` },
            { title: 'JavaScript 代码', code: `// 启用深度测试和混合
gl.enable(gl.DEPTH_TEST);
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

// 设置颜色（包含 Alpha 通道）
gl.uniform4f(colorLocation, 1.0, 0.0, 0.0, 0.5);  // 红色，50% 透明度

// 绘制透明物体
gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0)

// 注意：绘制顺序很重要！
// 应该按从远到近的顺序绘制透明物体`, language: 'javascript' }
          ]}
        />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">深度测试</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          深度测试（Depth Test）用于确保近处的物体遮挡远处的物体，是 3D 渲染的基础功能。
        </p>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">深度测试的工作原理</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          深度测试比较新片段的深度值与深度缓冲区中的值：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>如果新片段更近（深度值更小），则通过测试并更新深度缓冲区</li>
          <li>如果新片段更远（深度值更大），则被丢弃</li>
          <li>用于确保近处的物体遮挡远处的物体</li>
        </ul>
        <CodeBlock title="启用深度测试" code={`// 启用深度测试
gl.enable(gl.DEPTH_TEST);

// 设置深度测试函数
gl.depthFunc(gl.LESS);  // 默认值：只绘制更近的片段

// 其他深度测试函数：
// gl.LEQUAL：小于等于（gl_LESS 的变体）
// gl.GREATER：只绘制更远的片段
// gl.GEQUAL：大于等于
// gl.EQUAL：只绘制相同深度的片段
// gl.NOTEQUAL：只绘制不同深度的片段
// gl.ALWAYS：总是通过（相当于禁用深度测试）
// gl.NEVER：永远不通过（不绘制任何东西）

// 清除深度缓冲区
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

// 设置清除深度值
gl.clearDepth(1.0);  // 默认值，表示最远`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">深度写入控制</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          可以控制是否写入深度缓冲区：
        </p>
        <CodeBlock title="深度写入控制" code={`// 启用深度写入（默认）
gl.depthMask(true);

// 禁用深度写入（但仍进行深度测试）
gl.depthMask(false);

// 应用场景：
// 1. 绘制透明物体时，通常禁用深度写入
//    这样可以避免透明物体之间的相互遮挡问题
// 2. 绘制某些特殊效果时，可能需要禁用深度写入`} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">面剔除</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          面剔除（Face Culling）是一种优化技术，可以丢弃不可见的面，减少渲染负担。
        </p>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">面剔除的工作原理</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          面剔除基于顶点的缠绕顺序（Winding Order）：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong>顺时针（CW）</strong>：顶点按顺时针顺序排列</li>
          <li><strong>逆时针（CCW）</strong>：顶点按逆时针顺序排列</li>
          <li>默认情况下，逆时针的面被认为是正面（Front Face）</li>
        </ul>
        <CodeBlock title="启用面剔除" code={`// 启用面剔除
gl.enable(gl.CULL_FACE);

// 设置剔除哪一面
gl.cullFace(gl.BACK);   // 默认值：剔除背面
// gl.cullFace(gl.FRONT);  // 剔除正面
// gl.cullFace(gl.FRONT_AND_BACK);  // 剔除两面（不绘制任何东西）

// 设置正面方向
gl.frontFace(gl.CCW);   // 默认值：逆时针为正面
// gl.frontFace(gl.CW);   // 顺时针为正面`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">顶点顺序的重要性</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          顶点的顺序决定了面的朝向：
        </p>
        <CodeBlock title="顶点顺序示例" code={`// 逆时针顺序（默认正面）
const positions = [
  -0.5, -0.5,  // v0
   0.5, -0.5,  // v1
   0.5,  0.5   // v2
]
// 从相机视角看，如果顶点按逆时针排列，则为正面

// 顺时针顺序（背面）
const positionsBack = [
  -0.5, -0.5,  // v0
   0.5,  0.5,  // v2
   0.5, -0.5   // v1
]
// 从相机视角看，如果顶点按顺时针排列，则为背面`} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">帧缓冲区</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          帧缓冲区（Framebuffer）存储渲染结果。默认情况下，WebGL 渲染到默认帧缓冲区（屏幕），但也可以渲染到自定义的帧缓冲区（纹理）。
        </p>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">帧缓冲区的组成</h3>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong>颜色缓冲区</strong>：存储颜色信息（RGBA）</li>
          <li><strong>深度缓冲区</strong>：存储深度信息（Z 值）</li>
          <li><strong>模板缓冲区</strong>：存储模板信息（可选）</li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">创建自定义帧缓冲区</h3>
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

// 创建渲染缓冲区作为深度附件
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
// ... 绘制场景 ...

// 切换回默认帧缓冲区（屏幕）
gl.bindFramebuffer(gl.FRAMEBUFFER, null);
gl.viewport(0, 0, canvas.width, canvas.height);
// ... 使用纹理绘制到屏幕 ...`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">帧缓冲区的应用</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          帧缓冲区常用于：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong>后处理效果</strong>：先渲染到纹理，然后对纹理进行后处理（模糊、色调映射等）</li>
          <li><strong>阴影贴图</strong>：从光源视角渲染场景，生成阴影贴图</li>
          <li><strong>反射</strong>：渲染反射贴图</li>
          <li><strong>离屏渲染</strong>：渲染到纹理，然后用于其他用途</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">后处理</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          后处理（Post-processing）是在渲染完成后对图像进行的处理，可以实现各种视觉效果。
        </p>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">后处理的基本流程</h3>
        <ol className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>渲染场景到帧缓冲区的纹理</li>
          <li>使用全屏四边形和片段着色器对纹理进行处理</li>
          <li>将处理后的结果绘制到屏幕</li>
        </ol>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">常见的后处理效果</h3>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong>模糊（Blur）</strong>：高斯模糊、运动模糊</li>
          <li><strong>色调映射（Tone Mapping）</strong>：HDR 到 LDR 的转换</li>
          <li><strong>颜色调整</strong>：亮度、对比度、饱和度</li>
          <li><strong>边缘检测</strong>：轮廓线效果</li>
          <li><strong>景深（Depth of Field）</strong>：模拟相机焦点效果</li>
          <li><strong>泛光（Bloom）</strong>：发光效果</li>
        </ul>
        <CodeBlock title="简单的后处理示例" code={`// 1. 渲染场景到帧缓冲区
gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
gl.viewport(0, 0, width, height);
// ... 绘制场景 ...

// 2. 切换到默认帧缓冲区
gl.bindFramebuffer(gl.FRAMEBUFFER, null);
gl.viewport(0, 0, canvas.width, canvas.height);

// 3. 使用全屏四边形绘制纹理
const postProcessProgram = createProgram(gl, postProcessVertexShader, postProcessFragmentShader);
gl.useProgram(postProcessProgram);

// 全屏四边形顶点
const quadPositions = [
  -1, -1,  1, -1,  1,  1,  -1,  1
];
const quadIndices = [0, 1, 2, 0, 2, 3];

// 设置纹理坐标
const quadTexCoords = [
  0, 0,  1, 0,  1, 1,  0, 1
];

// 绑定纹理
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.uniform1i(gl.getUniformLocation(postProcessProgram, 'u_texture'), 0);

// 绘制全屏四边形
gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);`} language="javascript" />
        
        <CodeBlock title="后处理片段着色器示例（灰度效果）" code={`precision mediump float;
uniform sampler2D u_texture;
varying vec2 v_texCoord;

void main() {
  vec4 color = texture2D(u_texture, v_texCoord);
  
  // 转换为灰度
  float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
  gl_FragColor = vec4(gray, gray, gray, color.a);
}`} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">渲染状态管理</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          合理管理渲染状态可以提高性能并避免错误。WebGL 是一个状态机，状态改变会影响后续的绘制调用。
        </p>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">常见的渲染状态</h3>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong>深度测试</strong>：gl.enable(gl.DEPTH_TEST) / gl.disable(gl.DEPTH_TEST)</li>
          <li><strong>混合</strong>：gl.enable(gl.BLEND) / gl.disable(gl.BLEND)</li>
          <li><strong>面剔除</strong>：gl.enable(gl.CULL_FACE) / gl.disable(gl.CULL_FACE)</li>
          <li><strong>裁剪测试</strong>：gl.enable(gl.SCISSOR_TEST) / gl.disable(gl.SCISSOR_TEST)</li>
          <li><strong>模板测试</strong>：gl.enable(gl.STENCIL_TEST) / gl.disable(gl.STENCIL_TEST)</li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">状态管理的最佳实践</h3>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong>按需设置状态</strong>：只在需要时改变状态，避免不必要的状态切换</li>
          <li><strong>批量绘制</strong>：将使用相同状态的物体分组，一起绘制</li>
          <li><strong>状态缓存</strong>：记录当前状态，避免重复设置</li>
          <li><strong>清理状态</strong>：在绘制完成后，恢复到默认状态（可选）</li>
        </ul>
        <CodeBlock title="状态管理示例" code={`class RenderState {
  constructor(gl) {
    this.gl = gl;
    this.depthTest = false;
    this.blend = false;
    this.cullFace = false;
  }
  
  enableDepthTest() {
    if (!this.depthTest) {
      this.gl.enable(this.gl.DEPTH_TEST);
      this.depthTest = true;
    }
  }
  
  disableDepthTest() {
    if (this.depthTest) {
      this.gl.disable(this.gl.DEPTH_TEST);
      this.depthTest = false;
    }
  }
  
  enableBlend() {
    if (!this.blend) {
      this.gl.enable(this.gl.BLEND);
      this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
      this.blend = true;
    }
  }
  
  disableBlend() {
    if (this.blend) {
      this.gl.disable(this.gl.BLEND);
      this.blend = false;
    }
  }
}

// 使用示例
const renderState = new RenderState(gl);

// 绘制不透明物体
renderState.enableDepthTest();
renderState.disableBlend();
// ... 绘制不透明物体 ...

// 绘制透明物体
renderState.enableDepthTest();
renderState.enableBlend();
gl.depthMask(false);
// ... 绘制透明物体 ...`} language="javascript" />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">关键概念总结</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          本章介绍了 WebGL 高级渲染技术的核心概念：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">透明度与混合</strong>：
            <ul className="mt-2 pl-6">
              <li>使用 Alpha 通道控制不透明度</li>
              <li>通过混合函数实现透明效果</li>
              <li>绘制顺序对透明物体很重要</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">深度测试</strong>：
            <ul className="mt-2 pl-6">
              <li>确保近处物体遮挡远处物体</li>
              <li>可以控制深度写入</li>
              <li>支持多种深度测试函数</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">面剔除</strong>：
            <ul className="mt-2 pl-6">
              <li>基于顶点缠绕顺序剔除不可见面</li>
              <li>可以减少渲染负担</li>
              <li>需要正确设置顶点顺序</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">帧缓冲区</strong>：
            <ul className="mt-2 pl-6">
              <li>可以渲染到纹理</li>
              <li>用于后处理、阴影、反射等效果</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">后处理</strong>：
            <ul className="mt-2 pl-6">
              <li>在渲染完成后对图像进行处理</li>
              <li>可以实现各种视觉效果</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">渲染状态管理</strong>：
            <ul className="mt-2 pl-6">
              <li>合理管理状态可以提高性能</li>
              <li>避免不必要的状态切换</li>
            </ul>
          </li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">学习建议</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>理解透明度和混合的工作原理</li>
          <li>掌握深度测试和面剔除的使用</li>
          <li>了解帧缓冲区和后处理的应用</li>
          <li>学会合理管理渲染状态</li>
        </ul>
      </section>
      
      <ChapterNavigation />
    </div>
  )
}

