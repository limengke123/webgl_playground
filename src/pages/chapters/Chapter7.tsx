import { useEffect } from 'react'
import WebGLCanvas from '../../components/WebGLCanvas'
import CodeBlock from '../../components/CodeBlock'
import ChapterNavigation from '../../components/ChapterNavigation'
import { createProgram, createBuffer, setAttribute, createTexture } from '../../utils/webgl'

export default function Chapter4() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl mb-8 text-primary border-b-2 border-dark-border dark:border-dark-border border-light-border pb-4">第七章：材质与纹理</h1>
      
      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">什么是材质？</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          材质定义了物体表面的视觉属性，包括：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">颜色</strong>：基础颜色</li>
          <li><strong className="text-primary font-semibold">纹理</strong>：表面图案</li>
          <li><strong className="text-primary font-semibold">光照属性</strong>：环境光、漫反射、镜面反射</li>
          <li><strong className="text-primary font-semibold">透明度</strong>：Alpha 通道</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">纹理基础</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          纹理是 2D 图像，可以映射到 3D 物体的表面。纹理坐标（UV 坐标）范围从 0 到 1。
        </p>
        
        <CodeBlock title="纹理坐标示例" code={`// 纹理坐标 (u, v)
// (0,0) 左下角
// (1,0) 右下角
// (1,1) 右上角
// (0,1) 左上角

const texCoords = [
  0.0, 0.0,  // 左下
  1.0, 0.0,  // 右下
  1.0, 1.0,  // 右上
  0.0, 1.0   // 左上
]`} language="javascript" />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">创建纹理</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          在 WebGL 中创建纹理的步骤：
        </p>
        <ol className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>创建纹理对象</li>
          <li>绑定纹理</li>
          <li>设置纹理参数（过滤、包装）</li>
          <li>上传图像数据</li>
          <li>在着色器中采样纹理</li>
        </ol>
        
        <CodeBlock title="创建纹理代码" code={`function createTexture(gl, image) {
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  
  // 设置纹理参数
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  
  // 上传图像数据
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
  
  return texture
}`} language="javascript" />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">纹理过滤</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          纹理过滤决定如何采样纹理：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">gl.NEAREST</strong>：最近邻采样，像素化效果</li>
          <li><strong className="text-primary font-semibold">gl.LINEAR</strong>：线性插值，平滑效果</li>
          <li><strong className="text-primary font-semibold">gl.NEAREST_MIPMAP_NEAREST</strong>：使用最近的 mipmap</li>
          <li><strong className="text-primary font-semibold">gl.LINEAR_MIPMAP_LINEAR</strong>：三线性过滤（最平滑）</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">纹理包装</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          纹理包装决定超出 [0,1] 范围的纹理坐标如何处理：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">gl.REPEAT</strong>：重复纹理</li>
          <li><strong className="text-primary font-semibold">gl.CLAMP_TO_EDGE</strong>：夹紧到边缘</li>
          <li><strong className="text-primary font-semibold">gl.MIRRORED_REPEAT</strong>：镜像重复</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">程序化纹理</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          使用着色器代码生成纹理，而不是加载图像：
        </p>
        
        <WebGLCanvas width={400} height={400} onInit={(gl, canvas) => {
          const vertexShader = `
            attribute vec2 a_position;
            attribute vec2 a_texCoord;
            varying vec2 v_texCoord;
            
            void main() {
              gl_Position = vec4(a_position, 0.0, 1.0);
              v_texCoord = a_texCoord;
            }
          `
          
          const fragmentShader = `
            precision mediump float;
            varying vec2 v_texCoord;
            uniform float u_time;
            
            void main() {
              vec2 uv = v_texCoord * 10.0;
              float pattern = sin(uv.x + u_time) * sin(uv.y + u_time);
              gl_FragColor = vec4(pattern * 0.5 + 0.5, pattern * 0.3 + 0.5, 1.0, 1.0);
            }
          `
          
          const program = createProgram(gl, vertexShader, fragmentShader)
          
          const positions = [
            -1, -1,
            1, -1,
            1, 1,
            -1, 1
          ]
          
          const texCoords = [
            0, 0,
            1, 0,
            1, 1,
            0, 1
          ]
          
          const indices = [0, 1, 2, 0, 2, 3]
          
          const positionBuffer = createBuffer(gl, positions)
          const texCoordBuffer = createBuffer(gl, texCoords)
          const indexBuffer = gl.createBuffer()
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
          gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)
          
          const timeLocation = gl.getUniformLocation(program, 'u_time')
          
          gl.viewport(0, 0, canvas.width, canvas.height)
          gl.clearColor(0.1, 0.1, 0.1, 1.0)
          
          let time = 0
          const render = () => {
            time += 0.02
            gl.clear(gl.COLOR_BUFFER_BIT)
            gl.useProgram(program)
            
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
            setAttribute(gl, program, 'a_position', 2)
            
            gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
            setAttribute(gl, program, 'a_texCoord', 2)
            
            gl.uniform1f(timeLocation, time)
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
            
            requestAnimationFrame(render)
          }
          render()
        }} />
        
        <CodeBlock title="程序化纹理片段着色器" code={`precision mediump float;
varying vec2 v_texCoord;
uniform float u_time;

void main() {
  vec2 uv = v_texCoord * 10.0;
  float pattern = sin(uv.x + u_time) * sin(uv.y + u_time);
  gl_FragColor = vec4(pattern * 0.5 + 0.5, pattern * 0.3 + 0.5, 1.0, 1.0);
}`} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">多纹理</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          可以同时使用多个纹理，实现复杂的效果：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>基础颜色纹理</li>
          <li>法线贴图（Normal Map）</li>
          <li>粗糙度贴图</li>
          <li>环境光遮蔽贴图（AO Map）</li>
        </ul>
        
        <CodeBlock title="多纹理示例" code={`// 绑定多个纹理单元
gl.activeTexture(gl.TEXTURE0)
gl.bindTexture(gl.TEXTURE_2D, texture1)
gl.uniform1i(gl.getUniformLocation(program, 'u_texture1'), 0)

gl.activeTexture(gl.TEXTURE1)
gl.bindTexture(gl.TEXTURE_2D, texture2)
gl.uniform1i(gl.getUniformLocation(program, 'u_texture2'), 1)

// 在片段着色器中采样
uniform sampler2D u_texture1;
uniform sampler2D u_texture2;
varying vec2 v_texCoord;

void main() {
  vec4 color1 = texture2D(u_texture1, v_texCoord);
  vec4 color2 = texture2D(u_texture2, v_texCoord);
  gl_FragColor = color1 * color2;
}`} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">立方体贴图（Cubemap）</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          立方体贴图用于环境映射、天空盒等效果：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>6 个面的纹理</li>
          <li>使用 3D 方向向量采样</li>
          <li>常用于反射和天空盒</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">关键概念总结</h2>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">纹理坐标</strong>：UV 坐标范围 [0,1]</li>
          <li><strong className="text-primary font-semibold">纹理过滤</strong>：NEAREST 或 LINEAR</li>
          <li><strong className="text-primary font-semibold">纹理包装</strong>：REPEAT 或 CLAMP_TO_EDGE</li>
          <li><strong className="text-primary font-semibold">Mipmap</strong>：多级纹理，提升远距离渲染质量</li>
          <li><strong className="text-primary font-semibold">程序化纹理</strong>：用代码生成纹理</li>
          <li><strong className="text-primary font-semibold">多纹理</strong>：同时使用多个纹理单元</li>
        </ul>
      </section>
      
      <ChapterNavigation />
    </div>
  )
}

