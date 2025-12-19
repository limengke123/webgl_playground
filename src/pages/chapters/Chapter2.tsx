import WebGLCanvas from '../../components/WebGLCanvas'
import CodeBlock from '../../components/CodeBlock'
import FlipCard from '../../components/FlipCard'
import ChapterNavigation from '../../components/ChapterNavigation'
import { createProgram, createBuffer, setAttribute } from '../../utils/webgl'

export default function Chapter2() {
  return (
    <div className="w-full">
      <h1 className="text-4xl mb-8 text-primary border-b-2 border-dark-border dark:border-dark-border border-light-border pb-4">第二章：GLSL 语法基础</h1>
      
      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">什么是 GLSL？</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          GLSL（OpenGL Shading Language）是用于编写着色器的语言。它类似于 C 语言，但针对 GPU 进行了优化。
          在 WebGL 中，我们使用 GLSL 编写顶点着色器和片段着色器。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">GLSL 的特点</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">GPU 优化</strong>：
            <ul className="mt-2 pl-6">
              <li>专门为 GPU 并行计算设计</li>
              <li>内置函数在 GPU 上高度优化</li>
              <li>支持向量和矩阵运算</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">类 C 语法</strong>：
            <ul className="mt-2 pl-6">
              <li>如果你熟悉 C/C++，学习 GLSL 会很容易</li>
              <li>支持变量、函数、控制流等常见编程概念</li>
              <li>但有一些限制（如不能使用指针、递归等）</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">两种着色器</strong>：
            <ul className="mt-2 pl-6">
              <li><strong>顶点着色器</strong>：处理每个顶点，计算顶点位置</li>
              <li><strong>片段着色器</strong>：处理每个片段（像素），计算最终颜色</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">编译时检查</strong>：
            <ul className="mt-2 pl-6">
              <li>着色器代码在运行时编译</li>
              <li>编译错误会在运行时报告</li>
              <li>需要检查编译状态和错误日志</li>
            </ul>
          </li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">GLSL 版本</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong>WebGL2</strong>：使用 GLSL ES 3.00（基于 OpenGL ES 3.0）</li>
          <li>本教程使用 GLSL ES 3.00（WebGL2）</li>
          <li>GLSL ES 3.00 提供了更多功能，如统一缓冲区对象（UBO）、更多纹理格式等</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">为什么需要 GLSL？</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>GPU 是并行处理器，可以同时处理成千上万个顶点或片段</li>
          <li>GLSL 让我们可以编写在 GPU 上运行的代码</li>
          <li>这大大提高了图形渲染的性能</li>
          <li>让我们可以实现复杂的视觉效果（光照、阴影、后处理等）</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">数据类型</h2>
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">标量类型</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          标量类型表示单个值，是最基础的数据类型。
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">float</strong>：32 位浮点数
            <ul className="mt-2 pl-6">
              <li>用于表示小数，如：1.0, 3.14, 0.5</li>
              <li>注意：浮点数必须包含小数点，如 1.0 而不是 1</li>
              <li>可以指定精度：highp、mediump、lowp</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">int</strong>：整数
            <ul className="mt-2 pl-6">
              <li>用于表示整数，如：1, 42, -10</li>
              <li>不能包含小数点</li>
              <li>常用于循环计数、数组索引等</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">bool</strong>：布尔值
            <ul className="mt-2 pl-6">
              <li>只有两个值：true 或 false</li>
              <li>用于条件判断</li>
              <li>注意：GLSL 中不能直接将数字转换为布尔值</li>
            </ul>
          </li>
        </ul>
        <CodeBlock title="标量类型示例" code={`// 浮点数
float pi = 3.14159;
float half = 0.5;
float negative = -1.0;

// 整数
int count = 10;
int index = 0;
int negativeInt = -5;

// 布尔值
bool isVisible = true;
bool isSelected = false;

// 类型转换
float f = float(10);      // int 转 float
int i = int(3.14);       // float 转 int（会截断）
bool b = bool(1);         // 错误！GLSL 不支持数字到布尔值的转换

// 精度限定符（仅用于 float）
highp float precise = 1.0;
mediump float normal = 1.0;
lowp float fast = 1.0;`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">向量类型</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          向量是 GLSL 中最重要的数据类型之一，用于表示位置、方向、颜色等。
          GLSL 提供了强大的向量操作，包括分量访问、swizzle 操作等。
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">vec2</strong>：2 个浮点数 (x, y)
            <ul className="mt-2 pl-6">
              <li>常用于 2D 坐标、纹理坐标</li>
              <li>示例：vec2 position = vec2(1.0, 2.0);</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">vec3</strong>：3 个浮点数 (x, y, z 或 r, g, b)
            <ul className="mt-2 pl-6">
              <li>常用于 3D 坐标、颜色（RGB）、法线向量</li>
              <li>示例：vec3 position = vec3(1.0, 2.0, 3.0);</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">vec4</strong>：4 个浮点数 (x, y, z, w 或 r, g, b, a)
            <ul className="mt-2 pl-6">
              <li>常用于齐次坐标、颜色（RGBA）</li>
              <li>示例：vec4 color = vec4(1.0, 0.0, 0.0, 1.0);</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">ivec2/ivec3/ivec4</strong>：整数向量
            <ul className="mt-2 pl-6">
              <li>用于整数坐标、索引等</li>
              <li>示例：ivec2 gridPos = ivec2(10, 20);</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">bvec2/bvec3/bvec4</strong>：布尔向量
            <ul className="mt-2 pl-6">
              <li>用于布尔值组合</li>
              <li>示例：bvec2 flags = bvec2(true, false);</li>
            </ul>
          </li>
        </ul>
        
        <h4 className="text-xl my-6 text-dark-text dark:text-dark-text text-light-text">向量构造</h4>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          GLSL 提供了多种方式构造向量：
        </p>
        <CodeBlock title="向量构造示例" code={`// 方式1：逐个指定分量
vec3 v1 = vec3(1.0, 2.0, 3.0);

// 方式2：使用单个值（所有分量相同）
vec3 v2 = vec3(1.0);  // (1.0, 1.0, 1.0)

// 方式3：从其他向量构造
vec2 v2d = vec2(1.0, 2.0);
vec3 v3d = vec3(v2d, 3.0);  // (1.0, 2.0, 3.0)

// 方式4：从标量构造
vec4 v4 = vec4(1.0, 2.0, 3.0, 4.0);
vec3 v3 = vec3(v4);  // 取前3个分量 (1.0, 2.0, 3.0)

// 方式5：混合使用
vec4 color = vec4(vec3(1.0, 0.0, 0.0), 1.0);  // 红色，alpha=1.0`} />
        
        <h4 className="text-xl my-6 text-dark-text dark:text-dark-text text-light-text">分量访问</h4>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          GLSL 提供了多种方式访问向量分量：
        </p>
        <CodeBlock title="分量访问示例" code={`vec4 v = vec4(1.0, 2.0, 3.0, 4.0);

// 方式1：使用位置命名（xyzw）
float x = v.x;  // 1.0
float y = v.y;  // 2.0
float z = v.z;  // 3.0
float w = v.w;  // 4.0

// 方式2：使用颜色命名（rgba）
float r = v.r;  // 1.0
float g = v.g;  // 2.0
float b = v.b;  // 3.0
float a = v.a;  // 4.0

// 方式3：使用纹理坐标命名（stpq）
float s = v.s;  // 1.0
float t = v.t;  // 2.0
float p = v.p;  // 3.0
float q = v.q;  // 4.0

// 注意：不能混用不同的命名方式
// float x = v.r;  // 错误！不能混用`} />
        
        <h4 className="text-xl my-6 text-dark-text dark:text-dark-text text-light-text">Swizzle 操作</h4>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          Swizzle 是 GLSL 的强大特性，可以重新排列、复制或组合向量分量。
        </p>
        <CodeBlock title="Swizzle 操作示例" code={`vec4 v = vec4(1.0, 2.0, 3.0, 4.0);

// 重新排列分量
vec2 xy = v.xy;        // (1.0, 2.0)
vec2 yx = v.yx;        // (2.0, 1.0) - 交换 x 和 y
vec3 xyz = v.xyz;      // (1.0, 2.0, 3.0)
vec4 wzyx = v.wzyx;    // (4.0, 3.0, 2.0, 1.0) - 反转顺序

// 复制分量
vec3 xxx = v.xxx;      // (1.0, 1.0, 1.0)
vec4 yyyy = v.yyyy;    // (2.0, 2.0, 2.0, 2.0)

// 组合不同分量
vec3 xyz = v.xyz;      // (1.0, 2.0, 3.0)
vec2 zw = v.zw;        // (3.0, 4.0)
vec4 xyzw = v.xyzw;    // (1.0, 2.0, 3.0, 4.0)

// 实际应用
vec3 position = vec3(1.0, 2.0, 3.0);
vec2 texCoord = position.xy;        // 取 xy 作为纹理坐标
float height = position.z;          // 取 z 作为高度

vec4 color = vec4(1.0, 0.5, 0.0, 1.0);
vec3 rgb = color.rgb;               // 取 RGB，忽略 alpha
float alpha = color.a;              // 取 alpha

// 修改分量
vec4 v = vec4(1.0, 2.0, 3.0, 4.0);
v.xy = vec2(10.0, 20.0);            // v 现在是 (10.0, 20.0, 3.0, 4.0)
v.xz = vec2(100.0, 300.0);          // v 现在是 (100.0, 20.0, 300.0, 4.0)
v.yzw = vec3(200.0, 300.0, 400.0);  // v 现在是 (100.0, 200.0, 300.0, 400.0)`} />
        
        <h4 className="text-xl my-6 text-dark-text dark:text-dark-text text-light-text">向量运算</h4>
        <CodeBlock title="向量运算示例" code={`vec3 v1 = vec3(1.0, 2.0, 3.0);
vec3 v2 = vec3(4.0, 5.0, 6.0);

// 加法：分量相加
vec3 sum = v1 + v2;              // (5.0, 7.0, 9.0)

// 减法：分量相减
vec3 diff = v2 - v1;             // (3.0, 3.0, 3.0)

// 标量乘法：每个分量乘以标量
vec3 scaled = v1 * 2.0;          // (2.0, 4.0, 6.0)
vec3 scaled2 = 2.0 * v1;         // 同上

// 分量乘法：对应分量相乘
vec3 multiplied = v1 * v2;      // (4.0, 10.0, 18.0)

// 点积：返回标量
float dotProduct = dot(v1, v2);  // 1*4 + 2*5 + 3*6 = 32.0

// 叉积：返回向量（仅 vec3）
vec3 crossProduct = cross(v1, v2);  // 垂直于 v1 和 v2 的向量

// 长度
float len = length(v1);          // √(1² + 2² + 3²) = √14 ≈ 3.74

// 归一化：返回单位向量
vec3 normalized = normalize(v1); // v1 / length(v1)

// 距离
float dist = distance(v1, v2);   // length(v2 - v1)

// 反射（用于光照）
vec3 incident = normalize(vec3(1.0, -1.0, 0.0));
vec3 normal = normalize(vec3(0.0, 1.0, 0.0));
vec3 reflected = reflect(incident, normal);`} />
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
          在 GLSL 中，变量需要使用限定符来指定其用途和数据流向。
          理解这些限定符对于编写正确的着色器非常重要。
        </p>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">attribute（顶点属性）</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">用途</strong>：顶点属性，每个顶点都有不同的值。
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">只能在顶点着色器中使用</strong>：片段着色器不能使用 attribute</li>
          <li><strong className="text-primary font-semibold">每个顶点不同</strong>：每个顶点都有自己的一组属性值</li>
          <li><strong className="text-primary font-semibold">只读</strong>：在着色器中不能修改 attribute 的值</li>
          <li><strong className="text-primary font-semibold">常见用途</strong>：
            <ul className="mt-2 pl-6">
              <li>顶点位置（a_position）</li>
              <li>顶点颜色（a_color）</li>
              <li>纹理坐标（a_texCoord）</li>
              <li>法线向量（a_normal）</li>
            </ul>
          </li>
        </ul>
        <CodeBlock title="attribute 示例" code={`// 顶点着色器
attribute vec3 a_position;    // 顶点位置（从缓冲区读取）
attribute vec2 a_texCoord;    // 纹理坐标（从缓冲区读取）
attribute vec3 a_normal;      // 法线向量（从缓冲区读取）

void main() {
  // 使用 attribute 计算顶点位置
  gl_Position = u_matrix * vec4(a_position, 1.0);
  
  // 将 attribute 传递给片段着色器（通过 varying）
  v_texCoord = a_texCoord;
  v_normal = a_normal;
}

// JavaScript 端设置 attribute
const positionLocation = gl.getAttribLocation(program, 'a_position');
gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">uniform（统一变量）</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">用途</strong>：统一变量，所有顶点或片段共享相同的值。
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">所有顶点/片段相同</strong>：在一次绘制调用中，uniform 的值不变</li>
          <li><strong className="text-primary font-semibold">只读</strong>：在着色器中不能修改 uniform 的值</li>
          <li><strong className="text-primary font-semibold">可以在两个着色器中使用</strong>：顶点着色器和片段着色器都可以使用 uniform</li>
          <li><strong className="text-primary font-semibold">常见用途</strong>：
            <ul className="mt-2 pl-6">
              <li>变换矩阵（u_matrix, u_modelMatrix, u_viewMatrix）</li>
              <li>颜色（u_color）</li>
              <li>时间（u_time）</li>
              <li>分辨率（u_resolution）</li>
              <li>纹理采样器（u_texture）</li>
              <li>光照参数（u_lightPosition, u_lightColor）</li>
            </ul>
          </li>
        </ul>
        <CodeBlock title="uniform 示例" code={`// 顶点着色器
uniform mat4 u_matrix;        // 变换矩阵（所有顶点共享）
uniform float u_time;         // 时间（用于动画）

void main() {
  // 使用 uniform 变换顶点位置
  gl_Position = u_matrix * vec4(a_position, 1.0);
}

// 片段着色器
precision mediump float;
uniform vec3 u_color;         // 颜色（所有片段共享）
uniform sampler2D u_texture;  // 纹理采样器
uniform float u_time;         // 时间（用于动画）

void main() {
  // 使用 uniform 计算颜色
  gl_FragColor = vec4(u_color, 1.0);
}

// JavaScript 端设置 uniform
const matrixLocation = gl.getUniformLocation(program, 'u_matrix');
gl.uniformMatrix4fv(matrixLocation, false, matrix);

const colorLocation = gl.getUniformLocation(program, 'u_color');
gl.uniform3f(colorLocation, 1.0, 0.0, 0.0);  // 红色

const timeLocation = gl.getUniformLocation(program, 'u_time');
gl.uniform1f(timeLocation, Date.now() / 1000.0);`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">varying（传递变量）</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">用途</strong>：从顶点着色器传递数据到片段着色器，数据会被自动插值。
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">自动插值</strong>：在光栅化过程中，varying 值会在三角形内部进行线性插值</li>
          <li><strong className="text-primary font-semibold">必须在两个着色器中声明</strong>：顶点着色器输出，片段着色器输入</li>
          <li><strong className="text-primary font-semibold">名称必须匹配</strong>：两个着色器中的 varying 变量名必须完全相同</li>
          <li><strong className="text-primary font-semibold">常见用途</strong>：
            <ul className="mt-2 pl-6">
              <li>纹理坐标（v_texCoord）</li>
              <li>颜色（v_color）</li>
              <li>法线向量（v_normal）</li>
              <li>世界坐标（v_worldPos）</li>
            </ul>
          </li>
        </ul>
        <CodeBlock title="varying 示例" code={`// 顶点着色器
attribute vec3 a_position;
attribute vec2 a_texCoord;
attribute vec3 a_normal;

uniform mat4 u_matrix;

varying vec2 v_texCoord;      // 输出到片段着色器
varying vec3 v_normal;        // 输出到片段着色器

void main() {
  gl_Position = u_matrix * vec4(a_position, 1.0);
  
  // 设置 varying 值（会被插值）
  v_texCoord = a_texCoord;
  v_normal = a_normal;
}

// 片段着色器
precision mediump float;

varying vec2 v_texCoord;      // 接收插值后的纹理坐标
varying vec3 v_normal;        // 接收插值后的法线

uniform sampler2D u_texture;

void main() {
  // 使用插值后的 varying 值
  vec4 color = texture2D(u_texture, v_texCoord);
  vec3 normal = normalize(v_normal);
  
  gl_FragColor = color;
}

// 注意：
// 1. varying 变量名必须在两个着色器中完全匹配
// 2. 类型也必须匹配
// 3. 插值是自动的，不需要手动计算`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">const（常量）</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">用途</strong>：常量，值在编译时确定，不能修改。
        </p>
        <CodeBlock title="const 示例" code={`// 定义常量
const float PI = 3.14159265359;
const vec3 RED = vec3(1.0, 0.0, 0.0);
const int MAX_LIGHTS = 4;

void main() {
  // 使用常量
  float angle = PI * 2.0;
  vec3 color = RED;
  
  // const 值不能修改
  // PI = 3.14;  // 错误！
}`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">变量命名约定</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          虽然 GLSL 没有强制要求，但遵循命名约定可以让代码更易读：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">attribute</strong>：通常以 <code>a_</code> 开头，如 <code>a_position</code></li>
          <li><strong className="text-primary font-semibold">uniform</strong>：通常以 <code>u_</code> 开头，如 <code>u_matrix</code></li>
          <li><strong className="text-primary font-semibold">varying</strong>：通常以 <code>v_</code> 开头，如 <code>v_texCoord</code></li>
          <li><strong className="text-primary font-semibold">常量</strong>：通常使用大写，如 <code>PI</code></li>
        </ul>
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
          <li><strong className="text-primary font-semibold">clamp(x, min, max)</strong>：将 x 限制在 [min, max] 范围内
            <ul className="mt-2 pl-6">
              <li>等价于：min(max(x, min), max)</li>
              <li>常用于将值限制在有效范围内</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">min(a, b)</strong>：返回较小值
            <ul className="mt-2 pl-6">
              <li>可以用于多个值：min(a, min(b, c))</li>
              <li>支持向量：min(vec3(1,2,3), vec3(0,5,1)) = vec3(0,2,1)</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">max(a, b)</strong>：返回较大值
            <ul className="mt-2 pl-6">
              <li>可以用于多个值：max(a, max(b, c))</li>
              <li>支持向量：max(vec3(1,2,3), vec3(0,5,1)) = vec3(1,5,3)</li>
            </ul>
          </li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">纹理采样函数</h3>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">texture2D(sampler, coord)</strong>：采样 2D 纹理
            <ul className="mt-2 pl-6">
              <li>sampler：纹理采样器（sampler2D）</li>
              <li>coord：纹理坐标（vec2，范围 [0,1]）</li>
              <li>返回：vec4（RGBA 颜色）</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">textureCube(sampler, coord)</strong>：采样立方体贴图
            <ul className="mt-2 pl-6">
              <li>sampler：立方体贴图采样器（samplerCube）</li>
              <li>coord：3D 方向向量（vec3）</li>
              <li>返回：vec4（RGBA 颜色）</li>
            </ul>
          </li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">几何函数</h3>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">length(v)</strong>：向量长度</li>
          <li><strong className="text-primary font-semibold">distance(a, b)</strong>：两点间距离</li>
          <li><strong className="text-primary font-semibold">normalize(v)</strong>：归一化向量</li>
          <li><strong className="text-primary font-semibold">dot(a, b)</strong>：点积</li>
          <li><strong className="text-primary font-semibold">cross(a, b)</strong>：叉积（仅 vec3）</li>
          <li><strong className="text-primary font-semibold">reflect(I, N)</strong>：反射向量</li>
          <li><strong className="text-primary font-semibold">refract(I, N, ratio)</strong>：折射向量</li>
          <li><strong className="text-primary font-semibold">faceforward(N, I, Nref)</strong>：翻转法线方向</li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">其他有用函数</h3>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">sign(x)</strong>：符号函数（x &gt; 0 返回 1，x &lt; 0 返回 -1，x = 0 返回 0）</li>
          <li><strong className="text-primary font-semibold">abs(x)</strong>：绝对值</li>
          <li><strong className="text-primary font-semibold">floor(x)</strong>：向下取整</li>
          <li><strong className="text-primary font-semibold">ceil(x)</strong>：向上取整</li>
          <li><strong className="text-primary font-semibold">round(x)</strong>：四舍五入</li>
          <li><strong className="text-primary font-semibold">fract(x)</strong>：返回小数部分（x - floor(x)）</li>
          <li><strong className="text-primary font-semibold">mod(x, y)</strong>：取模运算</li>
          <li><strong className="text-primary font-semibold">smoothstep(edge0, edge1, x)</strong>：平滑步进函数</li>
          <li><strong className="text-primary font-semibold">step(edge, x)</strong>：步进函数（x &lt; edge 返回 0，否则返回 1）</li>
        </ul>
        
        <CodeBlock title="更多函数示例" code={`// 符号函数
float s = sign(-5.0);   // -1.0
float s2 = sign(10.0);  // 1.0
float s3 = sign(0.0);   // 0.0

// 取整函数
float f1 = floor(3.7);   // 3.0
float f2 = ceil(3.2);   // 4.0
float f3 = round(3.5);  // 4.0
float f4 = round(3.4);  // 3.0

// 小数部分
float frac = fract(3.7);  // 0.7
float frac2 = fract(-3.7); // 0.3（注意：fract 总是返回正数）

// 取模
float m = mod(7.0, 3.0);   // 1.0
float m2 = mod(8.5, 3.0);  // 2.5

// 步进函数
float step1 = step(0.5, 0.3);  // 0.0（0.3 < 0.5）
float step2 = step(0.5, 0.7);  // 1.0（0.7 >= 0.5）

// 平滑步进
float smooth = smoothstep(0.0, 1.0, 0.5);  // 0.5（在中间）
float smooth2 = smoothstep(0.0, 1.0, 0.0); // 0.0（在起点）
float smooth3 = smoothstep(0.0, 1.0, 1.0); // 1.0（在终点）

// 反射和折射
vec3 incident = normalize(vec3(1.0, -1.0, 0.0));
vec3 normal = normalize(vec3(0.0, 1.0, 0.0));
vec3 reflected = reflect(incident, normal);
vec3 refracted = refract(incident, normal, 1.0 / 1.5);  // 折射率 1.5`} />
        
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
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">控制流语句</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          GLSL 支持常见的控制流语句，但需要注意性能影响，特别是在片段着色器中。
        </p>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">条件语句</h3>
        <CodeBlock title="if/else 语句" code={`// 基本 if 语句
if (value > 0.5) {
  color = vec3(1.0, 0.0, 0.0);  // 红色
} else {
  color = vec3(0.0, 0.0, 1.0);  // 蓝色
}

// if-else if-else
if (value < 0.33) {
  color = vec3(1.0, 0.0, 0.0);
} else if (value < 0.66) {
  color = vec3(0.0, 1.0, 0.0);
} else {
  color = vec3(0.0, 0.0, 1.0);
}

// 三元运算符（更高效）
color = value > 0.5 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 0.0, 1.0);

// 注意：在片段着色器中，if/else 可能导致性能问题
// 尽量使用 step() 或 mix() 函数代替`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">循环语句</h3>
        <CodeBlock title="for/while 循环" code={`// for 循环
for (int i = 0; i < 10; i++) {
  // 循环体
  value += float(i);
}

// while 循环
int i = 0;
while (i < 10) {
  value += float(i);
  i++;
}

// 注意：
// 1. 循环次数必须在编译时确定（不能使用变量）
// 2. 循环次数不能太大（通常 &lt; 100）
// 3. 在片段着色器中，循环会影响性能

// 错误示例：
// int count = 10;
// for (int i = 0; i < count; i++) {  // 错误！count 不是常量
// }

// 正确示例：
const int COUNT = 10;
for (int i = 0; i < COUNT; i++) {  // 正确！COUNT 是常量
}`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">switch 语句</h3>
        <CodeBlock title="switch 语句" code={`int mode = 2;

switch (mode) {
  case 0:
    color = vec3(1.0, 0.0, 0.0);  // 红色
    break;
  case 1:
    color = vec3(0.0, 1.0, 0.0);  // 绿色
    break;
  case 2:
    color = vec3(0.0, 0.0, 1.0);  // 蓝色
    break;
  default:
    color = vec3(1.0, 1.0, 1.0);   // 白色
    break;
}

// 注意：switch 只能用于整数类型（int）`} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">数组和结构体</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          GLSL 支持数组和结构体，但有一些限制需要注意。
        </p>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">数组</h3>
        <CodeBlock title="数组示例" code={`// 声明数组
float values[10];              // 10 个浮点数
vec3 positions[4];             // 4 个 vec3
int indices[6];                // 6 个整数

// 初始化数组
float values[3] = float[3](1.0, 2.0, 3.0);

// 访问数组元素
float first = values[0];
values[1] = 5.0;

// 注意：
// 1. 数组大小必须在编译时确定（不能使用变量）
// 2. 在 WebGL2（GLSL ES 3.00）中，可以使用变量索引（但有限制）
// 3. 数组不能动态分配

// 错误示例：
// int size = 10;
// float values[size];  // 错误！size 不是常量

// 正确示例：
const int SIZE = 10;
float values[SIZE];  // 正确！

// 在 WebGL2 中，可以使用变量索引（但有限制）`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">结构体</h3>
        <CodeBlock title="结构体示例" code={`// 定义结构体
struct Light {
  vec3 position;
  vec3 color;
  float intensity;
};

// 声明结构体变量
Light light;

// 初始化结构体
light = Light(
  vec3(0.0, 5.0, 0.0),  // position
  vec3(1.0, 1.0, 1.0),  // color
  1.0                    // intensity
);

// 访问结构体成员
vec3 pos = light.position;
vec3 col = light.color;
float intensity = light.intensity;

// 修改结构体成员
light.intensity = 2.0;

// 结构体可以作为函数参数和返回值
Light createLight(vec3 pos, vec3 col, float intensity) {
  return Light(pos, col, intensity);
}

Light myLight = createLight(vec3(0.0), vec3(1.0), 1.0);

// 结构体可以作为 uniform
uniform Light u_light;

// 注意：结构体不能包含数组（在某些版本中）`} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">精度限定符</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          在片段着色器中，必须指定浮点数的精度。精度影响数值范围和性能。
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">highp</strong>：高精度（32 位）
            <ul className="mt-2 pl-6">
              <li>范围：约 -3.4×10³⁸ 到 3.4×10³⁸</li>
              <li>精度：约 7 位有效数字</li>
              <li>性能：最慢，但精度最高</li>
              <li>用途：需要高精度的计算（如复杂的光照计算）</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">mediump</strong>：中等精度（16 位，推荐）
            <ul className="mt-2 pl-6">
              <li>范围：约 -65504 到 65504</li>
              <li>精度：约 3 位有效数字</li>
              <li>性能：平衡性能和精度</li>
              <li>用途：大多数情况下推荐使用</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">lowp</strong>：低精度（8 位）
            <ul className="mt-2 pl-6">
              <li>范围：约 -2 到 2</li>
              <li>精度：约 1 位有效数字</li>
              <li>性能：最快，但精度最低</li>
              <li>用途：颜色值（0.0 到 1.0）</li>
            </ul>
          </li>
        </ul>
        
        <CodeBlock title="精度声明和使用" code={`// 片段着色器必须声明默认精度
precision mediump float;  // 推荐使用 mediump

void main() {
  // 使用默认精度（mediump）
  float value = 1.0;
  
  // 显式指定精度
  highp float precise = 1.0;    // 高精度
  mediump float normal = 1.0;   // 中等精度
  lowp float fast = 1.0;        // 低精度
  
  // 向量和矩阵也使用精度
  mediump vec3 color = vec3(1.0, 0.0, 0.0);
  lowp vec4 rgba = vec4(1.0, 1.0, 1.0, 1.0);  // 颜色值可以用 lowp
  
  gl_FragColor = vec4(color, 1.0);
}

// 顶点着色器不需要声明精度（默认使用 highp）
// 但可以显式声明
precision highp float;

attribute vec3 a_position;  // 默认 highp

void main() {
  gl_Position = vec4(a_position, 1.0);
}`} />
        
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">精度选择建议</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>大多数情况下使用 <code>mediump</code>（推荐）</li>
          <li>颜色值可以使用 <code>lowp</code>（性能更好）</li>
          <li>复杂计算或需要高精度时使用 <code>highp</code></li>
          <li>移动设备上，使用较低的精度可以提高性能</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">交互式示例</h2>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">示例 1：使用三角函数创建动画</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          下面是一个使用 GLSL 函数创建动画效果的示例：
        </p>
        
        <FlipCard 
          width={400} 
          height={400} 
          onInit={(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement) => {
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
          }}
          codeBlocks={[
            { title: '顶点着色器', code: `attribute vec2 a_position;
uniform mediump float u_time;

void main() {
  vec2 pos = a_position;
  pos.x += sin(u_time + pos.y * 2.0) * 0.1;
  gl_Position = vec4(pos, 0.0, 1.0);
}` },
            { title: '片段着色器', code: `precision mediump float;
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
}` },
            { title: 'JavaScript 代码', code: `const program = createProgram(gl, vertexShader, fragmentShader)
const positions = [-0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5]
const indices = [0, 1, 2, 0, 2, 3]

const positionBuffer = createBuffer(gl, positions)
const indexBuffer = gl.createBuffer()
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)

const timeLocation = gl.getUniformLocation(program, 'u_time')
const resolutionLocation = gl.getUniformLocation(program, 'u_resolution')
const positionLocation = gl.getAttribLocation(program, 'a_position')

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
render()`, language: 'javascript' }
          ]}
        />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">示例 2：使用 smoothstep 创建渐变</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          使用 smoothstep 函数创建平滑的径向渐变效果：
        </p>
        
        <FlipCard 
          width={400} 
          height={400} 
          onInit={(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement) => {
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
          }}
          codeBlocks={[
            { title: '顶点着色器', code: `attribute vec2 a_position;
attribute vec2 a_texCoord;
varying vec2 v_texCoord;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_texCoord = a_texCoord;
}` },
            { title: '片段着色器', code: `precision mediump float;
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
}` },
            { title: 'JavaScript 代码', code: `const program = createProgram(gl, vertexShader, fragmentShader)
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
render()`, language: 'javascript' }
          ]}
        />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">示例 3：使用 fract 创建重复图案</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          使用 fract 函数创建棋盘格和其他重复图案：
        </p>
        
        <FlipCard 
          width={400} 
          height={400} 
          onInit={(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement) => {
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
          }}
          codeBlocks={[
            { title: '顶点着色器', code: `attribute vec2 a_position;
attribute vec2 a_texCoord;
varying vec2 v_texCoord;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_texCoord = a_texCoord;
}` },
            { title: '片段着色器', code: `precision mediump float;
varying vec2 v_texCoord;
uniform float u_time;

void main() {
  vec2 grid = fract(v_texCoord * 10.0);
  float checker = step(0.5, grid.x) * step(0.5, grid.y) + 
                 (1.0 - step(0.5, grid.x)) * (1.0 - step(0.5, grid.y));
  float pulse = sin(u_time * 2.0) * 0.3 + 0.7;
  vec3 color = vec3(checker * pulse, checker * 0.5, checker);
  gl_FragColor = vec4(color, 1.0);
}` },
            { title: 'JavaScript 代码', code: `const program = createProgram(gl, vertexShader, fragmentShader)
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
render()`, language: 'javascript' }
          ]}
        />
        
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
