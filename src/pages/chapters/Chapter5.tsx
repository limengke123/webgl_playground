import WebGLCanvas from '../../components/WebGLCanvas'
import CodeBlock from '../../components/CodeBlock'
import ChapterNavigation from '../../components/ChapterNavigation'
import { createProgram, createBuffer, setAttribute } from '../../utils/webgl'

export default function Chapter5() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl mb-8 text-primary border-b-2 border-dark-border pb-4">第五章：GLSL 语法与 WebGL API</h1>
      
      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text">GLSL 基础</h2>
        <p className="text-dark-text-muted leading-relaxed mb-4">
          GLSL（OpenGL Shading Language）是用于编写着色器的语言。它类似于 C 语言，但针对 GPU 进行了优化。
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text">数据类型</h2>
        <h3 className="text-2xl my-8 text-dark-text">标量类型</h3>
        <ul className="text-dark-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">float</strong>：32 位浮点数</li>
          <li><strong className="text-primary font-semibold">int</strong>：整数</li>
          <li><strong className="text-primary font-semibold">bool</strong>：布尔值</li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text">向量类型</h3>
        <ul className="text-dark-text-muted leading-loose pl-8 mb-5">
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
vec3 sum = v1 + v2;
vec3 scaled = v1 * 2.0;
float dot = dot(v1, v2);
vec3 cross = cross(v1, v2);
float len = length(v1);
vec3 normalized = normalize(v1);`} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text">矩阵类型</h2>
        <ul className="text-dark-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">mat2</strong>：2x2 矩阵</li>
          <li><strong className="text-primary font-semibold">mat3</strong>：3x3 矩阵</li>
          <li><strong className="text-primary font-semibold">mat4</strong>：4x4 矩阵</li>
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
        <h2 className="text-3xl my-10 text-dark-text">变量限定符</h2>
        <ul className="text-dark-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">attribute</strong>：顶点属性，每个顶点不同</li>
          <li><strong className="text-primary font-semibold">uniform</strong>：统一变量，所有顶点/片段相同</li>
          <li><strong className="text-primary font-semibold">varying</strong>：从顶点着色器传递到片段着色器</li>
          <li><strong className="text-primary font-semibold">const</strong>：常量</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text">内置变量</h2>
        <h3 className="text-2xl my-8 text-dark-text">顶点着色器</h3>
        <ul className="text-dark-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">gl_Position</strong>：顶点的裁剪空间坐标（必须设置）</li>
          <li><strong className="text-primary font-semibold">gl_PointSize</strong>：点的大小（可选）</li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text">片段着色器</h3>
        <ul className="text-dark-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">gl_FragColor</strong>：片段的颜色（必须设置）</li>
          <li><strong className="text-primary font-semibold">gl_FragCoord</strong>：片段的窗口坐标</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text">常用函数</h2>
        <ul className="text-dark-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">sin, cos, tan</strong>：三角函数</li>
          <li><strong className="text-primary font-semibold">abs, floor, ceil, round</strong>：数学函数</li>
          <li><strong className="text-primary font-semibold">min, max, clamp</strong>：范围限制</li>
          <li><strong className="text-primary font-semibold">mix</strong>：线性插值</li>
          <li><strong className="text-primary font-semibold">smoothstep</strong>：平滑步进</li>
          <li><strong className="text-primary font-semibold">texture2D</strong>：采样 2D 纹理</li>
          <li><strong className="text-primary font-semibold">length, distance, normalize</strong>：向量运算</li>
        </ul>
        
        <CodeBlock title="函数示例" code={`// 线性插值
float t = 0.5;
float result = mix(0.0, 1.0, t);  // 结果 = 0.5

// 平滑步进
float smooth = smoothstep(0.0, 1.0, t);

// 范围限制
float clamped = clamp(value, 0.0, 1.0);

// 向量长度
float len = length(vec2(3.0, 4.0));  // 结果 = 5.0`} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text">WebGL API 核心方法</h2>
        <h3 className="text-2xl my-8 text-dark-text">上下文和初始化</h3>
        <CodeBlock title="初始化 WebGL" code={`const canvas = document.getElementById('canvas');
const gl = canvas.getContext('webgl');

// 设置视口
gl.viewport(0, 0, canvas.width, canvas.height);

// 设置清除颜色
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text">着色器操作</h3>
        <CodeBlock title="创建着色器程序" code={`// 创建着色器
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);

// 检查编译错误
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
  console.error(gl.getShaderInfoLog(vertexShader));
}

// 创建程序
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

// 使用程序
gl.useProgram(program);`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text">缓冲区操作</h3>
        <CodeBlock title="缓冲区操作" code={`// 创建缓冲区
const buffer = gl.createBuffer();

// 绑定缓冲区
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

// 上传数据
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

// 设置属性指针
const location = gl.getAttribLocation(program, 'a_position');
gl.enableVertexAttribArray(location);
gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text">绘制</h3>
        <CodeBlock title="绘制图元" code={`// 绘制数组
gl.drawArrays(gl.TRIANGLES, 0, 3);

// 使用索引绘制
gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);`} language="javascript" />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text">Uniform 变量</h2>
        <p className="text-dark-text-muted leading-relaxed mb-4">
          设置 uniform 变量的方法：
        </p>
        
        <CodeBlock title="设置 Uniform" code={`// 获取 uniform 位置
const location = gl.getUniformLocation(program, 'u_color');

// 设置不同类型的 uniform
gl.uniform1f(location, 1.0);           // float
gl.uniform2f(location, 1.0, 2.0);     // vec2
gl.uniform3f(location, 1.0, 2.0, 3.0); // vec3
gl.uniform4f(location, 1.0, 2.0, 3.0, 1.0); // vec4
gl.uniform1i(location, 0);             // int/sampler2D
gl.uniformMatrix4fv(location, false, matrix); // mat4`} language="javascript" />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text">纹理 API</h2>
        <CodeBlock title="纹理操作" code={`// 创建纹理
const texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);

// 设置纹理参数
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

// 上传图像数据
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

// 绑定到纹理单元
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.uniform1i(gl.getUniformLocation(program, 'u_texture'), 0);`} language="javascript" />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text">状态管理</h2>
        <CodeBlock title="WebGL 状态" code={`// 启用/禁用功能
gl.enable(gl.DEPTH_TEST);
gl.disable(gl.BLEND);

// 深度测试函数
gl.depthFunc(gl.LESS);

// 混合函数
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

// 清除缓冲区
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

// 设置清除颜色
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clearDepth(1.0);`} language="javascript" />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text">错误检查</h2>
        <CodeBlock title="错误处理" code={`// 检查 WebGL 错误
const error = gl.getError();
if (error !== gl.NO_ERROR) {
  console.error('WebGL Error:', error);
}

// 检查着色器编译
if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
  console.error(gl.getShaderInfoLog(shader));
}

// 检查程序链接
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  console.error(gl.getProgramInfoLog(program));
}`} language="javascript" />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text">交互式示例</h2>
        <WebGLCanvas width={400} height={400} onInit={(gl, canvas) => {
          const vertexShader = `
            precision mediump float;
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
        
        <p className="text-dark-text-muted leading-relaxed mb-4">这个示例展示了使用 uniform 变量和时间来创建动画效果。</p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text">关键概念总结</h2>
        <ul className="text-dark-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">GLSL 数据类型</strong>：float, vec, mat</li>
          <li><strong className="text-primary font-semibold">变量限定符</strong>：attribute, uniform, varying</li>
          <li><strong className="text-primary font-semibold">内置变量</strong>：gl_Position, gl_FragColor</li>
          <li><strong className="text-primary font-semibold">WebGL API</strong>：创建、绑定、绘制</li>
          <li><strong className="text-primary font-semibold">状态管理</strong>：启用/禁用功能，设置参数</li>
          <li><strong className="text-primary font-semibold">错误检查</strong>：getError, getShaderInfoLog</li>
        </ul>
      </section>
      
      <ChapterNavigation />
    </div>
  )
}

