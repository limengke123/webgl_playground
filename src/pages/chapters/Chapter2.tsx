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
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          GLSL 提供了丰富的内置函数，这些函数在 GPU 上高度优化，应该优先使用。
        </p>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">数学函数</h3>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">sin, cos, tan</strong>：三角函数（参数为弧度）</li>
          <li><strong className="text-primary font-semibold">asin, acos, atan</strong>：反三角函数</li>
          <li><strong className="text-primary font-semibold">pow, exp, log</strong>：幂函数、指数、对数</li>
          <li><strong className="text-primary font-semibold">sqrt</strong>：平方根</li>
          <li><strong className="text-primary font-semibold">abs</strong>：绝对值</li>
          <li><strong className="text-primary font-semibold">floor, ceil, round</strong>：向下取整、向上取整、四舍五入</li>
          <li><strong className="text-primary font-semibold">fract</strong>：返回小数部分</li>
          <li><strong className="text-primary font-semibold">mod</strong>：取模运算</li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">向量运算函数</h3>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">length(v)</strong>：向量长度 |v| = √(x² + y² + z²)</li>
          <li><strong className="text-primary font-semibold">distance(a, b)</strong>：两点之间的距离</li>
          <li><strong className="text-primary font-semibold">normalize(v)</strong>：归一化向量，返回长度为 1 的单位向量</li>
          <li><strong className="text-primary font-semibold">dot(a, b)</strong>：点积，返回标量，用于计算角度、投影</li>
          <li><strong className="text-primary font-semibold">cross(a, b)</strong>：叉积，返回垂直于两个向量的向量</li>
          <li><strong className="text-primary font-semibold">reflect(I, N)</strong>：反射向量，用于光照计算</li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">插值和步进函数</h3>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">mix(a, b, t)</strong>：线性插值，返回 a * (1-t) + b * t</li>
          <li><strong className="text-primary font-semibold">smoothstep(edge0, edge1, x)</strong>：平滑步进，在 edge0 和 edge1 之间平滑过渡</li>
            <li><strong className="text-primary font-semibold">step(edge, x)</strong>：步进函数，x &lt; edge 返回 0，否则返回 1</li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">范围限制函数</h3>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">clamp(x, min, max)</strong>：将 x 限制在 [min, max] 范围内</li>
          <li><strong className="text-primary font-semibold">min(a, b)</strong>：返回较小值</li>
          <li><strong className="text-primary font-semibold">max(a, b)</strong>：返回较大值</li>
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
float dp = dot(vec3(1.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0));  // 结果 = 0.0（垂直）

// 反射向量（用于光照）
vec3 reflected = reflect(lightDir, normal);

// 距离计算
float dist = distance(pointA, pointB);

// 小数部分（用于创建重复图案）
float fractional = fract(uv * 10.0);`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">实际应用示例</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          下面是一些实际应用场景：
        </p>
        
        <CodeBlock title="使用 smoothstep 创建渐变效果" code={`precision mediump float;
varying vec2 v_texCoord;

void main() {
  // 创建从中心向外的径向渐变
  float dist = distance(v_texCoord, vec2(0.5));
  float gradient = smoothstep(0.5, 0.0, dist);
  gl_FragColor = vec4(gradient, gradient, gradient, 1.0);
}`} />
        
        <CodeBlock title="使用 fract 创建重复图案" code={`precision mediump float;
varying vec2 v_texCoord;
uniform float u_time;

void main() {
  // 创建棋盘格图案
  vec2 grid = fract(v_texCoord * 10.0);
  float checker = step(0.5, grid.x) * step(0.5, grid.y) + 
                  (1.0 - step(0.5, grid.x)) * (1.0 - step(0.5, grid.y));
  gl_FragColor = vec4(checker, checker, checker, 1.0);
}`} />
        
        <CodeBlock title="使用 dot 计算光照强度" code={`precision mediump float;
varying vec3 v_normal;
uniform vec3 u_lightDirection;

void main() {
  vec3 normal = normalize(v_normal);
  vec3 lightDir = normalize(-u_lightDirection);
  
  // 使用点积计算光照强度（兰伯特定律）
  float intensity = max(dot(normal, lightDir), 0.0);
  gl_FragColor = vec4(intensity, intensity, intensity, 1.0);
}`} />
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
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">示例 1：使用三角函数创建动画</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          下面是一个使用 GLSL 函数创建动画效果的示例：
        </p>
        
        <WebGLCanvas width={400} height={400} onInit={(gl, canvas) => {
          const vertexShader = `attribute vec2 a_position;
uniform mediump float u_time;

void main() {
  vec2 pos = a_position;
  pos.x += sin(u_time + pos.y * 2.0) * 0.1;
  gl_Position = vec4(pos, 0.0, 1.0);
}`
          
          const fragmentShader = `precision mediump float;
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
}`
          
          const program = createProgram(gl, vertexShader, fragmentShader)
          const positions = [-0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5]
          const indices = [0, 1, 2, 0, 2, 3]
          
          const positionBuffer = createBuffer(gl, positions)
          const indexBuffer = gl.createBuffer()
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
          gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)
          
          const timeLocation = gl.getUniformLocation(program, 'u_time')
          const resolutionLocation = gl.getUniformLocation(program, 'u_resolution')
          const positionLocation = gl.getAttribLocation(program, 'a_position')
          
          if (positionLocation === -1) {
            console.error('属性 a_position 未找到')
            return
          }
          
          gl.viewport(0, 0, canvas.width, canvas.height)
          gl.clearColor(0.1, 0.1, 0.1, 1.0)
          
          let time = 0
          const render = () => {
            time += 0.02
            gl.clear(gl.COLOR_BUFFER_BIT)
            gl.useProgram(program)
            
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
            gl.enableVertexAttribArray(positionLocation)
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
            
            gl.uniform1f(timeLocation, time)
            gl.uniform2f(resolutionLocation, canvas.width, canvas.height)
            
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
            requestAnimationFrame(render)
          }
          render()
        }} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">示例 2：使用 smoothstep 创建渐变</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          使用 smoothstep 函数创建平滑的径向渐变效果：
        </p>
        
        <WebGLCanvas width={400} height={400} onInit={(gl, canvas) => {
          const vertexShader = `attribute vec2 a_position;
attribute vec2 a_texCoord;
varying vec2 v_texCoord;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_texCoord = a_texCoord;
}`
          
          const fragmentShader = `precision mediump float;
varying vec2 v_texCoord;
uniform float u_time;

void main() {
  vec2 center = vec2(0.5);
  float dist = distance(v_texCoord, center);
  float gradient = smoothstep(0.7, 0.0, dist);
  float angle = atan(v_texCoord.y - 0.5, v_texCoord.x - 0.5) + u_time;
  float pattern = sin(angle * 5.0) * 0.3 + 0.7;
  vec3 color = vec3(gradient * pattern, gradient * 0.5, gradient);
  gl_FragColor = vec4(color, 1.0);
}`
          
          const program = createProgram(gl, vertexShader, fragmentShader)
          const positions = [-1, -1, 1, -1, 1, 1, -1, 1]
          const texCoords = [0, 0, 1, 0, 1, 1, 0, 1]
          const indices = [0, 1, 2, 0, 2, 3]
          
          const positionBuffer = createBuffer(gl, positions)
          const texCoordBuffer = createBuffer(gl, texCoords)
          const indexBuffer = gl.createBuffer()
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
          gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)
          
          const timeLocation = gl.getUniformLocation(program, 'u_time')
          const positionLocation = gl.getAttribLocation(program, 'a_position')
          const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord')
          
          if (positionLocation === -1 || texCoordLocation === -1) {
            console.error('属性未找到')
            return
          }
          
          gl.viewport(0, 0, canvas.width, canvas.height)
          gl.clearColor(0.1, 0.1, 0.1, 1.0)
          
          let time = 0
          const render = () => {
            time += 0.02
            gl.clear(gl.COLOR_BUFFER_BIT)
            gl.useProgram(program)
            
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
            gl.enableVertexAttribArray(positionLocation)
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
            
            gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
            gl.enableVertexAttribArray(texCoordLocation)
            gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0)
            
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
            gl.uniform1f(timeLocation, time)
            
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
            requestAnimationFrame(render)
          }
          render()
        }} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">示例 3：使用 fract 创建重复图案</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          使用 fract 函数创建棋盘格和其他重复图案：
        </p>
        
        <WebGLCanvas width={400} height={400} onInit={(gl, canvas) => {
          const vertexShader = `attribute vec2 a_position;
attribute vec2 a_texCoord;
varying vec2 v_texCoord;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_texCoord = a_texCoord;
}`
          
          const fragmentShader = `precision mediump float;
varying vec2 v_texCoord;
uniform float u_time;

void main() {
  vec2 grid = fract(v_texCoord * 10.0);
  float checker = step(0.5, grid.x) * step(0.5, grid.y) + 
                 (1.0 - step(0.5, grid.x)) * (1.0 - step(0.5, grid.y));
  float pulse = sin(u_time * 2.0) * 0.3 + 0.7;
  vec3 color = vec3(checker * pulse, checker * 0.5, checker);
  gl_FragColor = vec4(color, 1.0);
}`
          
          const program = createProgram(gl, vertexShader, fragmentShader)
          const positions = [-1, -1, 1, -1, 1, 1, -1, 1]
          const texCoords = [0, 0, 1, 0, 1, 1, 0, 1]
          const indices = [0, 1, 2, 0, 2, 3]
          
          const positionBuffer = createBuffer(gl, positions)
          const texCoordBuffer = createBuffer(gl, texCoords)
          const indexBuffer = gl.createBuffer()
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
          gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)
          
          const timeLocation = gl.getUniformLocation(program, 'u_time')
          const positionLocation = gl.getAttribLocation(program, 'a_position')
          const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord')
          
          if (positionLocation === -1 || texCoordLocation === -1) {
            console.error('属性未找到')
            return
          }
          
          gl.viewport(0, 0, canvas.width, canvas.height)
          gl.clearColor(0.1, 0.1, 0.1, 1.0)
          
          let time = 0
          const render = () => {
            time += 0.02
            gl.clear(gl.COLOR_BUFFER_BIT)
            gl.useProgram(program)
            
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
            gl.enableVertexAttribArray(positionLocation)
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
            
            gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
            gl.enableVertexAttribArray(texCoordLocation)
            gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0)
            
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
            gl.uniform1f(timeLocation, time)
            
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
            requestAnimationFrame(render)
          }
          render()
        }} />
        
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          这些示例展示了 GLSL 函数的实际应用：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">三角函数</strong>：创建周期性动画和波形效果</li>
          <li><strong className="text-primary font-semibold">smoothstep</strong>：创建平滑的渐变和过渡效果</li>
          <li><strong className="text-primary font-semibold">fract</strong>：创建重复图案和纹理</li>
          <li><strong className="text-primary font-semibold">distance</strong>：计算距离，用于径向效果</li>
          <li><strong className="text-primary font-semibold">step</strong>：创建硬边缘和图案</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">GLSL 编程技巧</h2>
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">性能优化建议</h3>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">优先使用内置函数</strong>：内置函数在 GPU 上高度优化</li>
          <li><strong className="text-primary font-semibold">避免动态分支</strong>：if/else 在片段着色器中性能较差，尽量使用 step、mix 等函数</li>
          <li><strong className="text-primary font-semibold">在顶点着色器中计算</strong>：如果可能，将计算移到顶点着色器，减少片段着色器负担</li>
          <li><strong className="text-primary font-semibold">使用合适的精度</strong>：mediump 通常足够，避免不必要的 highp</li>
          <li><strong className="text-primary font-semibold">避免重复计算</strong>：将重复使用的值存储在变量中</li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">常见错误和调试</h3>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">忘记声明精度</strong>：片段着色器必须声明浮点数精度</li>
          <li><strong className="text-primary font-semibold">变量未使用</strong>：未使用的 varying 变量可能导致编译错误</li>
          <li><strong className="text-primary font-semibold">类型不匹配</strong>：注意 vec 和 float 之间的类型转换</li>
          <li><strong className="text-primary font-semibold">数组索引越界</strong>：GLSL 数组索引必须在编译时确定</li>
          <li><strong className="text-primary font-semibold">使用 gl.getShaderInfoLog()</strong>：检查着色器编译错误</li>
        </ul>
        
        <CodeBlock title="调试技巧" code={`// 在片段着色器中添加调试输出
void main() {
  vec3 color = calculateColor();
  
  // 可视化法线（用于调试）
  // gl_FragColor = vec4(normalize(v_normal) * 0.5 + 0.5, 1.0);
  
  // 可视化 UV 坐标（用于调试）
  // gl_FragColor = vec4(v_texCoord, 0.0, 1.0);
  
  gl_FragColor = vec4(color, 1.0);
}`} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">关键概念总结</h2>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">数据类型</strong>：float（标量）、vec2/vec3/vec4（向量）、mat2/mat3/mat4（矩阵）</li>
          <li><strong className="text-primary font-semibold">变量限定符</strong>：attribute（顶点属性）、uniform（统一变量）、varying（传递变量）</li>
          <li><strong className="text-primary font-semibold">内置变量</strong>：gl_Position（顶点位置）、gl_FragColor（片段颜色）、gl_FragCoord（片段坐标）</li>
          <li><strong className="text-primary font-semibold">数学函数</strong>：sin/cos、pow/sqrt、abs/floor/ceil 等</li>
          <li><strong className="text-primary font-semibold">向量运算</strong>：length、distance、normalize、dot、cross</li>
          <li><strong className="text-primary font-semibold">插值函数</strong>：mix（线性插值）、smoothstep（平滑步进）</li>
          <li><strong className="text-primary font-semibold">范围限制</strong>：clamp、min、max</li>
          <li><strong className="text-primary font-semibold">精度限定符</strong>：highp、mediump、lowp（片段着色器必须声明）</li>
          <li><strong className="text-primary font-semibold">分量访问</strong>：可以使用 .xyzw、.rgba、.stpq 访问向量分量</li>
          <li><strong className="text-primary font-semibold">向量构造</strong>：可以使用 swizzle 操作重新排列分量</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          掌握 GLSL 语法是编写高效 WebGL 程序的基础。多练习使用这些函数，你会发现它们非常强大。
        </p>
      </section>
      
      <ChapterNavigation />
    </div>
  )
}
