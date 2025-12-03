import WebGLCanvas from '../../components/WebGLCanvas'
import CodeBlock from '../../components/CodeBlock'
import ChapterNavigation from '../../components/ChapterNavigation'
import { createProgram, createBuffer, setAttribute } from '../../utils/webgl'

export default function Chapter2() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl mb-8 text-primary border-b-2 border-dark-border dark:border-dark-border border-light-border pb-4">第二章：GLSL 语法基础</h1>
      
      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">什么是 GLSL？</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          GLSL（OpenGL Shading Language）是用于编写着色器的语言。它类似于 C 语言，但针对 GPU 进行了优化。
          在 WebGL 中，我们使用 GLSL 编写顶点着色器和片段着色器。
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">数据类型</h2>
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">标量类型</h3>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">float</strong>：32 位浮点数（如：1.0, 3.14）</li>
          <li><strong className="text-primary font-semibold">int</strong>：整数（如：1, 42）</li>
          <li><strong className="text-primary font-semibold">bool</strong>：布尔值（true 或 false）</li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">向量类型</h3>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">vec2</strong>：2 个浮点数 (x, y)</li>
          <li><strong className="text-primary font-semibold">vec3</strong>：3 个浮点数 (x, y, z 或 r, g, b)</li>
          <li><strong className="text-primary font-semibold">vec4</strong>：4 个浮点数 (x, y, z, w 或 r, g, b, a)</li>
          <li><strong className="text-primary font-semibold">ivec2/ivec3/ivec4</strong>：整数向量</li>
          <li><strong className="text-primary font-semibold">bvec2/bvec3/bvec4</strong>：布尔向量</li>
        </ul>
        
        <CodeBlock title="向量操作示例" code={`vec3 v1 = vec3(1.0, 2.0, 3.0);
vec3 v2 = vec3(4.0, 5.0, 6.0);

// 分量访问
float x = v1.x;
float y = v1.y;
float z = v1.z;

// 或使用颜色命名
float r = v1.r;
float g = v1.g;
float b = v1.b;

// 向量运算
vec3 sum = v1 + v2;           // 加法
vec3 scaled = v1 * 2.0;       // 标量乘法
float dot = dot(v1, v2);      // 点积
vec3 cross = cross(v1, v2);   // 叉积
float len = length(v1);       // 长度
vec3 normalized = normalize(v1); // 归一化`} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">矩阵类型</h2>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">mat2</strong>：2x2 矩阵</li>
          <li><strong className="text-primary font-semibold">mat3</strong>：3x3 矩阵</li>
          <li><strong className="text-primary font-semibold">mat4</strong>：4x4 矩阵（最常用）</li>
        </ul>
        
        <CodeBlock title="矩阵操作示例" code={`mat4 m1 = mat4(1.0);  // 单位矩阵
mat4 m2 = mat4(
  1.0, 0.0, 0.0, 0.0,
  0.0, 1.0, 0.0, 0.0,
  0.0, 0.0, 1.0, 0.0,
  0.0, 0.0, 0.0, 1.0
);

// 矩阵乘法
vec4 v = vec4(1.0, 2.0, 3.0, 1.0);
vec4 result = m1 * v;

// 矩阵相乘
mat4 m3 = m1 * m2;`} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">变量限定符</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          在 GLSL 中，变量需要使用限定符来指定其用途：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">attribute</strong>：顶点属性，每个顶点不同（只能在顶点着色器中使用）</li>
          <li><strong className="text-primary font-semibold">uniform</strong>：统一变量，所有顶点/片段相同</li>
          <li><strong className="text-primary font-semibold">varying</strong>：从顶点着色器传递到片段着色器，会被自动插值</li>
          <li><strong className="text-primary font-semibold">const</strong>：常量</li>
        </ul>
        
        <CodeBlock title="变量限定符示例" code={`// 顶点着色器
attribute vec3 a_position;      // 顶点位置
attribute vec2 a_texCoord;       // 纹理坐标
uniform mat4 u_matrix;          // 变换矩阵
varying vec2 v_texCoord;         // 传递给片段着色器

void main() {
  gl_Position = u_matrix * vec4(a_position, 1.0);
  v_texCoord = a_texCoord;
}

// 片段着色器
precision mediump float;
varying vec2 v_texCoord;         // 接收插值后的纹理坐标
uniform sampler2D u_texture;     // 纹理采样器

void main() {
  gl_FragColor = texture2D(u_texture, v_texCoord);
}`} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">内置变量</h2>
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">顶点着色器</h3>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">gl_Position</strong>：顶点的裁剪空间坐标（必须设置）</li>
          <li><strong className="text-primary font-semibold">gl_PointSize</strong>：点的大小（可选，用于 gl.POINTS）</li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">片段着色器</h3>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">gl_FragColor</strong>：片段的颜色（必须设置）</li>
          <li><strong className="text-primary font-semibold">gl_FragCoord</strong>：片段的窗口坐标（只读）</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">常用函数</h2>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">sin, cos, tan</strong>：三角函数</li>
          <li><strong className="text-primary font-semibold">abs, floor, ceil, round</strong>：数学函数</li>
          <li><strong className="text-primary font-semibold">min, max, clamp</strong>：范围限制</li>
          <li><strong className="text-primary font-semibold">mix</strong>：线性插值 mix(a, b, t) = a * (1-t) + b * t</li>
          <li><strong className="text-primary font-semibold">smoothstep</strong>：平滑步进函数</li>
          <li><strong className="text-primary font-semibold">texture2D</strong>：采样 2D 纹理</li>
          <li><strong className="text-primary font-semibold">length, distance, normalize</strong>：向量运算</li>
          <li><strong className="text-primary font-semibold">dot, cross</strong>：点积和叉积</li>
        </ul>
        
        <CodeBlock title="函数示例" code={`// 线性插值
float t = 0.5;
float result = mix(0.0, 1.0, t);  // 结果 = 0.5

// 平滑步进（在 edge0 和 edge1 之间平滑过渡）
float smooth = smoothstep(0.0, 1.0, t);

// 范围限制
float clamped = clamp(value, 0.0, 1.0);

// 向量长度
float len = length(vec2(3.0, 4.0));  // 结果 = 5.0

// 归一化向量
vec3 dir = normalize(vec3(1.0, 2.0, 3.0));

// 点积（用于计算角度、投影等）
float dp = dot(vec3(1.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0));  // 结果 = 0.0（垂直）`} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">精度限定符</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          在片段着色器中，必须指定浮点数的精度：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">highp</strong>：高精度（32 位）</li>
          <li><strong className="text-primary font-semibold">mediump</strong>：中等精度（16 位，推荐）</li>
          <li><strong className="text-primary font-semibold">lowp</strong>：低精度（8 位）</li>
        </ul>
        
        <CodeBlock title="精度声明" code={`precision mediump float;  // 片段着色器必须声明精度

void main() {
  float value = 1.0;  // 使用 mediump 精度
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}`} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">交互式示例</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          下面是一个使用 GLSL 函数创建动画效果的示例：
        </p>
        
        <WebGLCanvas width={400} height={400} onInit={(gl, canvas) => {
          const vertexShader = `
            attribute vec2 a_position;
            uniform float u_time;
            
            void main() {
              vec2 pos = a_position;
              pos.x += sin(u_time + pos.y * 2.0) * 0.1;
              gl_Position = vec4(pos, 0.0, 1.0);
            }
          `
          
          const fragmentShader = `
            precision mediump float;
            uniform float u_time;
            uniform vec2 u_resolution;
            
            void main() {
              vec2 uv = gl_FragCoord.xy / u_resolution;
              vec3 color = vec3(
                sin(uv.x * 10.0 + u_time),
                cos(uv.y * 10.0 + u_time),
                sin((uv.x + uv.y) * 5.0 + u_time)
              );
              gl_FragColor = vec4(color * 0.5 + 0.5, 1.0);
            }
          `
          
          const program = createProgram(gl, vertexShader, fragmentShader)
          const positions = [-0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5]
          const indices = [0, 1, 2, 0, 2, 3]
          
          const positionBuffer = createBuffer(gl, positions)
          const indexBuffer = gl.createBuffer()
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
          gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)
          
          const timeLocation = gl.getUniformLocation(program, 'u_time')
          const resolutionLocation = gl.getUniformLocation(program, 'u_resolution')
          
          gl.viewport(0, 0, canvas.width, canvas.height)
          gl.clearColor(0.1, 0.1, 0.1, 1.0)
          
          let time = 0
          const render = () => {
            time += 0.02
            gl.clear(gl.COLOR_BUFFER_BIT)
            gl.useProgram(program)
            
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
            setAttribute(gl, program, 'a_position', 2)
            
            gl.uniform1f(timeLocation, time)
            gl.uniform2f(resolutionLocation, canvas.width, canvas.height)
            
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
            requestAnimationFrame(render)
          }
          render()
        }} />
        
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          这个示例展示了使用 uniform 变量和时间来创建动画效果。注意观察：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>顶点着色器中使用 <code>sin</code> 函数改变顶点位置</li>
          <li>片段着色器中使用 <code>sin</code> 和 <code>cos</code> 函数创建颜色动画</li>
          <li><code>gl_FragCoord</code> 用于获取片段在屏幕上的坐标</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">关键概念总结</h2>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">数据类型</strong>：float, vec, mat</li>
          <li><strong className="text-primary font-semibold">变量限定符</strong>：attribute（顶点属性）、uniform（统一变量）、varying（传递变量）</li>
          <li><strong className="text-primary font-semibold">内置变量</strong>：gl_Position（顶点位置）、gl_FragColor（片段颜色）</li>
          <li><strong className="text-primary font-semibold">常用函数</strong>：数学函数、向量运算、纹理采样</li>
          <li><strong className="text-primary font-semibold">精度限定符</strong>：片段着色器必须声明精度</li>
        </ul>
      </section>
      
      <ChapterNavigation />
    </div>
  )
}
