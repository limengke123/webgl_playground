import WebGLCanvas from '../../components/WebGLCanvas'
import CodeBlock from '../../components/CodeBlock'
import FlipCard from '../../components/FlipCard'
import ChapterNavigation from '../../components/ChapterNavigation'
import { createProgram, createBuffer, setAttribute } from '../../utils/webgl'

const vertexShaderSource = `
  attribute vec2 a_position;
  
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`

const fragmentShaderSource = `
  precision mediump float;
  uniform vec4 u_color;
  
  void main() {
    gl_FragColor = u_color;
  }
`

export default function Chapter4() {
  return (
    <div className="w-full">
      <h1 className="text-4xl mb-8 text-primary border-b-2 border-dark-border dark:border-dark-border border-light-border pb-4">第四章：渲染管线</h1>
      
      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">WebGL 渲染管线概述</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          WebGL 渲染管线是将 3D 场景转换为 2D 图像的过程。理解渲染管线对于掌握 WebGL 至关重要。
          渲染管线是一个固定的流程，每个阶段都有特定的职责。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">渲染管线的主要阶段</strong>：
        </p>
        <ol className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">顶点数据输入</strong>：将顶点位置、颜色、纹理坐标等数据上传到 GPU 缓冲区</li>
          <li><strong className="text-primary font-semibold">顶点着色器（Vertex Shader）</strong>：
            <ul className="mt-2 pl-6">
              <li>对每个顶点执行一次</li>
              <li>进行坐标变换（模型、视图、投影变换）</li>
              <li>计算顶点颜色、纹理坐标等属性</li>
              <li>输出裁剪空间坐标（gl_Position）</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">图元装配（Primitive Assembly）</strong>：
            <ul className="mt-2 pl-6">
              <li>将顶点组装成图元（点、线、三角形）</li>
              <li>进行裁剪（Clipping）：移除视锥外的部分</li>
              <li>进行透视除法：将齐次坐标转换为归一化设备坐标</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">光栅化（Rasterization）</strong>：
            <ul className="mt-2 pl-6">
              <li>将图元转换为片段（Fragment，即像素候选）</li>
              <li>对顶点属性进行插值（如颜色、纹理坐标）</li>
              <li>确定哪些像素被图元覆盖</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">片段着色器（Fragment Shader）</strong>：
            <ul className="mt-2 pl-6">
              <li>对每个片段执行一次</li>
              <li>计算最终颜色（gl_FragColor）</li>
              <li>可以进行纹理采样、光照计算等</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">片段测试和混合</strong>：
            <ul className="mt-2 pl-6">
              <li>深度测试（Depth Test）：决定片段是否可见</li>
              <li>模板测试（Stencil Test）：用于特殊效果</li>
              <li>混合（Blending）：将新颜色与已有颜色混合</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">帧缓冲区</strong>：最终图像写入帧缓冲区，显示在屏幕上</li>
        </ol>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">重要提示</strong>：在 WebGL 中，我们主要控制顶点着色器和片段着色器，其他阶段由 GPU 自动处理。
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">顶点着色器阶段</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          顶点着色器是渲染管线的第一个可编程阶段。它对每个顶点执行一次，负责将顶点从模型空间转换到裁剪空间。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">顶点着色器的主要职责</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong>坐标变换</strong>：将顶点从模型空间转换到裁剪空间（通过 MVP 矩阵）</li>
          <li><strong>属性计算</strong>：计算顶点的颜色、纹理坐标、法向量等属性</li>
          <li><strong>输出 gl_Position</strong>：必须设置 gl_Position，这是顶点在裁剪空间中的位置</li>
        </ul>
        <CodeBlock title="简单的顶点着色器示例" code={vertexShaderSource} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">坐标空间转换</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          顶点在渲染管线中会经过多个坐标空间的转换：
        </p>
        <ol className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">模型空间（Model Space）</strong>：
            <ul className="mt-2 pl-6">
              <li>顶点在模型自身的坐标系中的位置</li>
              <li>例如：立方体的顶点可能是 (-0.5, -0.5, -0.5) 到 (0.5, 0.5, 0.5)</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">世界空间（World Space）</strong>：
            <ul className="mt-2 pl-6">
              <li>通过模型矩阵（Model Matrix）转换</li>
              <li>将模型放置到场景中的位置</li>
              <li>可以包含平移、旋转、缩放</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">视图空间（View Space / Eye Space）</strong>：
            <ul className="mt-2 pl-6">
              <li>通过视图矩阵（View Matrix）转换</li>
              <li>以相机为原点的坐标系</li>
              <li>相机看向 -Z 方向</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">裁剪空间（Clip Space）</strong>：
            <ul className="mt-2 pl-6">
              <li>通过投影矩阵（Projection Matrix）转换</li>
              <li>范围从 -1 到 1（X、Y、Z 轴）</li>
              <li>超出此范围的顶点会被裁剪</li>
            </ul>
          </li>
        </ol>
        <CodeBlock title="坐标空间转换示例" code={`// 顶点着色器中的坐标转换
attribute vec3 a_position;  // 模型空间坐标

uniform mat4 u_modelMatrix;      // 模型矩阵
uniform mat4 u_viewMatrix;       // 视图矩阵
uniform mat4 u_projectionMatrix; // 投影矩阵

void main() {
  // 1. 模型空间 → 世界空间
  vec4 worldPos = u_modelMatrix * vec4(a_position, 1.0);
  
  // 2. 世界空间 → 视图空间
  vec4 viewPos = u_viewMatrix * worldPos;
  
  // 3. 视图空间 → 裁剪空间
  gl_Position = u_projectionMatrix * viewPos;
  
  // 或者使用 MVP 矩阵（更高效）
  // mat4 mvpMatrix = u_projectionMatrix * u_viewMatrix * u_modelMatrix;
  // gl_Position = mvpMatrix * vec4(a_position, 1.0);
}`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">顶点着色器的输入和输出</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">输入（Input）</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong>attribute</strong>：每个顶点不同的数据（位置、颜色、纹理坐标、法向量等）</li>
          <li><strong>uniform</strong>：所有顶点共享的数据（变换矩阵、时间、全局参数等）</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">输出（Output）</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong>gl_Position</strong>：必须设置，顶点在裁剪空间中的位置（vec4）</li>
          <li><strong>gl_PointSize</strong>：可选，点图元的大小（仅当绘制 gl.POINTS 时有效）</li>
          <li><strong>varying</strong>：传递给片段着色器的数据（会被自动插值）</li>
        </ul>
        <CodeBlock title="顶点着色器输入输出示例" code={`// 顶点着色器
attribute vec3 a_position;    // 输入：顶点位置（每个顶点不同）
attribute vec2 a_texCoord;      // 输入：纹理坐标（每个顶点不同）
attribute vec3 a_normal;       // 输入：法向量（每个顶点不同）

uniform mat4 u_mvpMatrix;      // 输入：MVP 矩阵（所有顶点共享）
uniform mat4 u_normalMatrix;   // 输入：法线矩阵（所有顶点共享）

varying vec2 v_texCoord;       // 输出：纹理坐标（传递给片段着色器）
varying vec3 v_normal;         // 输出：法向量（传递给片段着色器）

void main() {
  // 必须设置 gl_Position
  gl_Position = u_mvpMatrix * vec4(a_position, 1.0);
  
  // 设置 varying 变量（会被插值）
  v_texCoord = a_texCoord;
  v_normal = normalize((u_normalMatrix * vec4(a_normal, 0.0)).xyz);
}`} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">图元装配和裁剪</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          图元装配阶段将顶点组装成图元（点、线、三角形），并进行裁剪和透视除法。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">图元类型</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong>gl.POINTS</strong>：点图元，每个顶点是一个独立的点</li>
          <li><strong>gl.LINES</strong>：线段图元，每两个顶点组成一条线段</li>
          <li><strong>gl.LINE_STRIP</strong>：连续线段，顶点依次连接</li>
          <li><strong>gl.LINE_LOOP</strong>：闭合线段，最后一个顶点连接到第一个顶点</li>
          <li><strong>gl.TRIANGLES</strong>：三角形图元，每三个顶点组成一个三角形</li>
          <li><strong>gl.TRIANGLE_STRIP</strong>：三角形带，共享边的连续三角形</li>
          <li><strong>gl.TRIANGLE_FAN</strong>：三角形扇，所有三角形共享第一个顶点</li>
        </ul>
        <CodeBlock title="图元类型示例" code={`// gl.TRIANGLES：每三个顶点组成一个三角形
const positions = [
  // 第一个三角形
  -0.5, -0.5,  0.5, -0.5,  0.5,  0.5,
  // 第二个三角形
  -0.5, -0.5,  0.5,  0.5, -0.5,  0.5
]
gl.drawArrays(gl.TRIANGLES, 0, 6)  // 绘制 2 个三角形

// gl.TRIANGLE_STRIP：共享边的连续三角形
// 顶点：v0, v1, v2, v3, v4
// 三角形1：v0, v1, v2
// 三角形2：v1, v2, v3（共享 v1-v2 边）
// 三角形3：v2, v3, v4（共享 v2-v3 边）
const stripPositions = [
  -0.5, -0.5,  0.0, -0.5,  -0.5, 0.0,  0.0, 0.0,  0.5, 0.0
]
gl.drawArrays(gl.TRIANGLE_STRIP, 0, 5)  // 绘制 3 个三角形

// gl.TRIANGLE_FAN：所有三角形共享第一个顶点
// 顶点：v0, v1, v2, v3, v4
// 三角形1：v0, v1, v2
// 三角形2：v0, v2, v3（共享 v0）
// 三角形3：v0, v3, v4（共享 v0）
const fanPositions = [
  0.0, 0.0,   // v0（中心点）
  -0.5, -0.5, 0.5, -0.5,  0.5, 0.5,  -0.5, 0.5  // v1, v2, v3, v4
]
gl.drawArrays(gl.TRIANGLE_FAN, 0, 5)  // 绘制 3 个三角形`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">裁剪（Clipping）</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          裁剪空间是一个立方体，范围从 -1 到 1（X、Y、Z 轴）。超出裁剪空间的图元会被裁剪掉。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">裁剪规则</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>如果图元完全在裁剪空间内，则保留</li>
          <li>如果图元完全在裁剪空间外，则丢弃</li>
          <li>如果图元部分在裁剪空间内，则会被分割，只保留内部的部分</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">裁剪空间的定义</strong>：
        </p>
        <CodeBlock title="裁剪空间" code={`// 裁剪空间的边界
// X 轴：-1（左）到 1（右）
// Y 轴：-1（下）到 1（上）
// Z 轴：-1（近）到 1（远）

// 顶点着色器输出的 gl_Position 必须在裁剪空间内
// 如果 gl_Position.w = 1.0（正交投影），则：
//   -1 <= gl_Position.x <= 1
//   -1 <= gl_Position.y <= 1
//   -1 <= gl_Position.z <= 1

// 如果 gl_Position.w != 1.0（透视投影），则：
//   -gl_Position.w <= gl_Position.x <= gl_Position.w
//   -gl_Position.w <= gl_Position.y <= gl_Position.w
//   -gl_Position.w <= gl_Position.z <= gl_Position.w`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">透视除法</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          透视除法将齐次坐标转换为归一化设备坐标（NDC）。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">透视除法的过程</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>输入：齐次坐标 (x, y, z, w)</li>
          <li>输出：归一化设备坐标 (x/w, y/w, z/w)</li>
          <li>结果坐标范围：X 和 Y 从 -1 到 1，Z 从 -1 到 1（或 0 到 1，取决于深度范围设置）</li>
        </ul>
        <CodeBlock title="透视除法示例" code={`// 顶点着色器输出（裁剪空间）
gl_Position = vec4(2.0, 2.0, -2.0, 2.0);  // (x, y, z, w)

// 透视除法后（归一化设备坐标）
// NDC = (2.0/2.0, 2.0/2.0, -2.0/2.0) = (1.0, 1.0, -1.0)

// 如果 w = 1.0（正交投影），则：
// gl_Position = vec4(0.5, 0.5, -0.5, 1.0)
// NDC = (0.5/1.0, 0.5/1.0, -0.5/1.0) = (0.5, 0.5, -0.5)

// 如果 w != 1.0（透视投影），w 值会影响透视效果
// gl_Position = vec4(1.0, 1.0, -1.0, 2.0)
// NDC = (1.0/2.0, 1.0/2.0, -1.0/2.0) = (0.5, 0.5, -0.5)`} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">光栅化</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          光栅化是将图元转换为片段（Fragment）的过程。片段是像素的候选，包含了位置、颜色、深度等信息。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">光栅化的过程</strong>：
        </p>
        <ol className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong>确定覆盖的像素</strong>：计算图元覆盖了哪些屏幕像素</li>
          <li><strong>属性插值</strong>：对顶点属性（如颜色、纹理坐标）进行线性插值</li>
          <li><strong>生成片段</strong>：为每个被覆盖的像素生成一个片段</li>
        </ol>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">属性插值</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          在三角形内部，顶点属性会被线性插值。例如，如果三角形的三个顶点颜色分别是红色、绿色、蓝色，
          那么三角形内部的每个片段都会得到插值后的颜色。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">插值原理</strong>：
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          对于三角形内的任意一点 P，可以使用重心坐标（Barycentric Coordinates）来表示：
        </p>
        <CodeBlock title="重心坐标插值" code={`// 重心坐标：P = α·A + β·B + γ·C
// 其中 α + β + γ = 1，且 α, β, γ >= 0
// A, B, C 是三角形的三个顶点

// 属性插值公式：
// value(P) = α·value(A) + β·value(B) + γ·value(C)

// 例如，颜色插值：
// color(P) = α·color(A) + β·color(B) + γ·color(C)

// WebGL 会自动计算重心坐标并进行插值
// 我们只需要在顶点着色器中设置 varying 变量即可`} />
        <CodeBlock title="属性插值示例" code={`// 顶点着色器输出颜色
varying vec4 v_color;

void main() {
  gl_Position = u_mvpMatrix * vec4(a_position, 1.0);
  v_color = a_color;  // 传递给片段着色器
}

// 片段着色器接收插值后的颜色
precision mediump float;
varying vec4 v_color;  // 已经过插值的颜色

void main() {
  gl_FragColor = v_color;  // 使用插值后的颜色
}`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">属性插值演示</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          下面的示例展示了颜色插值的效果：
        </p>
        
        <FlipCard 
          width={400} 
          height={400} 
          onInit={(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement) => {
            const vertexShader = `
              attribute vec2 a_position;
              attribute vec3 a_color;
              varying vec3 v_color;
              
              void main() {
                gl_Position = vec4(a_position, 0.0, 1.0);
                v_color = a_color;
              }
            `
            
            const fragmentShader = `
              precision mediump float;
              varying vec3 v_color;
              
              void main() {
                gl_FragColor = vec4(v_color, 1.0);
              }
            `
            
            const program = createProgram(gl, vertexShader, fragmentShader)
            
            // 三个顶点，每个顶点有不同的颜色
            const positions = [
              0, 0.5,      // 顶点1：顶部（红色）
              -0.5, -0.5,  // 顶点2：左下（绿色）
              0.5, -0.5    // 顶点3：右下（蓝色）
            ]
            
            const colors = [
              1.0, 0.0, 0.0,  // 红色
              0.0, 1.0, 0.0,  // 绿色
              0.0, 0.0, 1.0   // 蓝色
            ]
            
            const positionBuffer = createBuffer(gl, positions)
            const colorBuffer = createBuffer(gl, colors)
            
            gl.viewport(0, 0, canvas.width, canvas.height)
            gl.clearColor(0.1, 0.1, 0.1, 1.0)
            
            gl.clear(gl.COLOR_BUFFER_BIT)
            gl.useProgram(program)
            
            const positionLocation = gl.getAttribLocation(program, 'a_position')
            const colorLocation = gl.getAttribLocation(program, 'a_color')
            
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
            gl.enableVertexAttribArray(positionLocation)
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
            
            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
            gl.enableVertexAttribArray(colorLocation)
            gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0)
            
            gl.drawArrays(gl.TRIANGLES, 0, 3)
          }}
          codeBlocks={[
            { title: '顶点着色器', code: `attribute vec2 a_position;
attribute vec3 a_color;
varying vec3 v_color;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_color = a_color;  // 传递给片段着色器
}` },
            { title: '片段着色器', code: `precision mediump float;
varying vec3 v_color;  // 已经过插值的颜色

void main() {
  gl_FragColor = vec4(v_color, 1.0);
}` },
            { title: 'JavaScript 代码', code: `const program = createProgram(gl, vertexShader, fragmentShader)

// 三个顶点，每个顶点有不同的颜色
const positions = [
  0, 0.5,      // 顶点1：顶部（红色）
  -0.5, -0.5,  // 顶点2：左下（绿色）
  0.5, -0.5    // 顶点3：右下（蓝色）
]

const colors = [
  1.0, 0.0, 0.0,  // 红色
  0.0, 1.0, 0.0,  // 绿色
  0.0, 0.0, 1.0   // 蓝色
]

const positionBuffer = createBuffer(gl, positions)
const colorBuffer = createBuffer(gl, colors)

gl.viewport(0, 0, canvas.width, canvas.height)
gl.clearColor(0.1, 0.1, 0.1, 1.0)

gl.clear(gl.COLOR_BUFFER_BIT)
gl.useProgram(program)

// 设置位置属性
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
gl.enableVertexAttribArray(positionLocation)
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

// 设置颜色属性
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
gl.enableVertexAttribArray(colorLocation)
gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0)

gl.drawArrays(gl.TRIANGLES, 0, 3)
// 注意：三角形内部的颜色会被自动插值`, language: 'javascript' }
          ]}
        />
        
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          观察上面的三角形，可以看到颜色从顶部的红色平滑过渡到左下角的绿色和右下角的蓝色。
          这就是属性插值的效果。
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">片段着色器阶段</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          片段着色器是渲染管线的第二个可编程阶段。它对每个片段执行一次，负责计算最终的颜色。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">片段着色器的主要职责</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong>计算颜色</strong>：根据纹理、光照、材质等计算最终颜色</li>
          <li><strong>输出 gl_FragColor</strong>：必须设置 gl_FragColor，这是片段的最终颜色</li>
          <li><strong>可选：修改深度</strong>：可以通过 gl_FragDepth 修改片段的深度值（会影响性能）</li>
        </ul>
        <CodeBlock title="简单的片段着色器示例" code={fragmentShaderSource} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">片段测试</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          片段测试决定哪些片段应该被绘制，哪些应该被丢弃。主要包括深度测试、模板测试和裁剪测试。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">深度测试（Depth Test）</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>比较新片段的深度值与深度缓冲区中的值</li>
          <li>如果新片段更近（深度值更小），则通过测试并更新深度缓冲区</li>
          <li>如果新片段更远（深度值更大），则被丢弃</li>
          <li>用于确保近处的物体遮挡远处的物体</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">模板测试（Stencil Test）</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>使用模板缓冲区进行测试</li>
          <li>可以用于实现特殊效果，如阴影、轮廓、镜像等</li>
          <li>在 WebGL 中较少使用</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">裁剪测试（Scissor Test）</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>限制绘制区域到指定的矩形区域</li>
          <li>使用 gl.scissor() 设置裁剪区域</li>
          <li>可以用于优化性能或实现特殊效果</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">混合</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          混合是将新绘制的片段颜色与已存在的颜色进行组合的过程。这对于实现透明效果非常重要。
        </p>
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
        <CodeBlock title="启用混合" code={`// 启用混合
gl.enable(gl.BLEND);

// 设置混合函数（标准透明度）
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
// 结果 = srcColor × srcAlpha + dstColor × (1 - srcAlpha)`} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">帧缓冲区</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          帧缓冲区存储渲染结果。默认情况下，WebGL 渲染到默认帧缓冲区（屏幕），但也可以渲染到自定义的帧缓冲区（纹理）。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">帧缓冲区的组成</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong>颜色缓冲区</strong>：存储颜色信息（RGBA）</li>
          <li><strong>深度缓冲区</strong>：存储深度信息（Z 值）</li>
          <li><strong>模板缓冲区</strong>：存储模板信息（可选）</li>
        </ul>
        <CodeBlock title="清除帧缓冲区" code={`// 清除颜色缓冲区
gl.clear(gl.COLOR_BUFFER_BIT);

// 清除深度缓冲区
gl.clear(gl.DEPTH_BUFFER_BIT);

// 清除颜色和深度缓冲区
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

// 设置清除颜色
gl.clearColor(0.1, 0.1, 0.1, 1.0);  // RGBA

// 设置清除深度值
gl.clearDepth(1.0);  // 默认值，表示最远`} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">渲染管线示例</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          下面是一个完整的示例，展示了渲染管线的各个阶段：
        </p>
        
        <FlipCard 
          width={400} 
          height={400} 
          onInit={(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement) => {
            const program = createProgram(gl, vertexShaderSource, fragmentShaderSource)
            const positions = [0, 0.5, -0.5, -0.5, 0.5, -0.5]
            const positionBuffer = createBuffer(gl, positions)
            const colorLocation = gl.getUniformLocation(program, 'u_color')
            
            gl.viewport(0, 0, canvas.width, canvas.height)
            gl.clearColor(0.1, 0.1, 0.1, 1.0)
            
            gl.clear(gl.COLOR_BUFFER_BIT)
            gl.useProgram(program)
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
            setAttribute(gl, program, 'a_position', 2)
            gl.uniform4f(colorLocation, 0.2, 0.6, 1.0, 1.0)
            gl.drawArrays(gl.TRIANGLES, 0, 3)
          }}
          codeBlocks={[
            { title: '顶点着色器', code: vertexShaderSource },
            { title: '片段着色器', code: fragmentShaderSource },
            { title: 'JavaScript 代码', code: `const program = createProgram(gl, vertexShaderSource, fragmentShaderSource)

// 1. 顶点数据输入：创建缓冲区并上传顶点数据
const positions = [0, 0.5, -0.5, -0.5, 0.5, -0.5]
const positionBuffer = createBuffer(gl, positions)

// 2. 设置视口和清除颜色
gl.viewport(0, 0, canvas.width, canvas.height)
gl.clearColor(0.1, 0.1, 0.1, 1.0)

// 3. 清除帧缓冲区
gl.clear(gl.COLOR_BUFFER_BIT)

// 4. 使用着色器程序
gl.useProgram(program)

// 5. 绑定缓冲区并设置顶点属性
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
setAttribute(gl, program, 'a_position', 2)

// 6. 设置 uniform 变量
const colorLocation = gl.getUniformLocation(program, 'u_color')
gl.uniform4f(colorLocation, 0.2, 0.6, 1.0, 1.0)

// 7. 绘制（触发渲染管线）
gl.drawArrays(gl.TRIANGLES, 0, 3)
// 渲染管线流程：
// - 顶点着色器处理每个顶点
// - 图元装配和裁剪
// - 光栅化
// - 片段着色器处理每个片段
// - 片段测试和混合
// - 写入帧缓冲区`, language: 'javascript' }
          ]}
        />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">关键概念总结</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          本章介绍了 WebGL 渲染管线的核心概念：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">渲染管线是固定的流程</strong>：
            <ul className="mt-2 pl-6">
              <li>顶点数据输入 → 顶点着色器 → 图元装配 → 光栅化 → 片段着色器 → 片段测试 → 帧缓冲区</li>
              <li>我们主要控制顶点着色器和片段着色器</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">顶点着色器</strong>：
            <ul className="mt-2 pl-6">
              <li>对每个顶点执行一次</li>
              <li>进行坐标变换和属性计算</li>
              <li>必须输出 gl_Position</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">片段着色器</strong>：
            <ul className="mt-2 pl-6">
              <li>对每个片段执行一次</li>
              <li>计算最终颜色</li>
              <li>必须输出 gl_FragColor</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">属性插值</strong>：
            <ul className="mt-2 pl-6">
              <li>在光栅化过程中，顶点属性会被线性插值</li>
              <li>片段着色器接收的是插值后的属性值</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">片段测试</strong>：
            <ul className="mt-2 pl-6">
              <li>深度测试：确保近处物体遮挡远处物体</li>
              <li>模板测试：用于特殊效果</li>
              <li>裁剪测试：限制绘制区域</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">混合</strong>：
            <ul className="mt-2 pl-6">
              <li>将新颜色与已有颜色组合</li>
              <li>用于实现透明效果</li>
            </ul>
          </li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">学习建议</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>理解渲染管线的每个阶段的作用</li>
          <li>掌握顶点着色器和片段着色器的编写</li>
          <li>理解属性插值的过程</li>
          <li>了解片段测试和混合的作用</li>
        </ul>
      </section>
      
      <ChapterNavigation />
    </div>
  )
}
