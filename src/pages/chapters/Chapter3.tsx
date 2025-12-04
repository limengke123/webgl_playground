import { useEffect, useRef } from 'react'
import WebGLCanvas from '../../components/WebGLCanvas'
import CodeBlock from '../../components/CodeBlock'
import ChapterNavigation from '../../components/ChapterNavigation'
import { createProgram, createBuffer, Matrix } from '../../utils/webgl'

export default function Chapter3() {
  const rotationRef = useRef(0)

  useEffect(() => {
    const interval = setInterval(() => {
      rotationRef.current += 0.01
    }, 16)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full">
      <h1 className="text-4xl mb-8 text-primary border-b-2 border-dark-border dark:border-dark-border border-light-border pb-4">第三章：3D 数学基础</h1>
      
      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">向量（Vector）</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          向量是图形学的基础，表示方向和大小。在 3D 空间中，向量通常用三个分量 (x, y, z) 表示。
          向量既可以表示位置（从原点到某点的位移），也可以表示方向（不关心起点，只关心方向）。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">向量的数学表示</strong>：
          在数学上，向量可以表示为 <code className="bg-dark-bg dark:bg-dark-bg px-1 py-0.5 rounded">v = (x, y, z)</code> 或列向量形式。
          向量的每个分量表示在对应坐标轴上的投影长度。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">位置向量 vs 方向向量</strong>：
          <ul className="mt-2 pl-6">
            <li><strong>位置向量</strong>：表示空间中一个点的位置，通常相对于原点 (0, 0, 0)</li>
            <li><strong>方向向量</strong>：表示一个方向，不依赖于起点位置。方向向量通常会被归一化（长度为 1）</li>
          </ul>
        </p>
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">向量的基本运算</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          向量运算在图形学中无处不在。理解这些运算的几何意义和实际应用非常重要。
        </p>
        
        <h4 className="text-xl my-6 text-dark-text dark:text-dark-text text-light-text">1. 向量加法</h4>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">数学公式</strong>：v1 + v2 = (x1+x2, y1+y2, z1+z2)
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">几何意义</strong>：向量加法表示两个位移的组合。在图形学中，常用于：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>平移物体：新位置 = 原位置 + 位移向量</li>
          <li>组合多个位移：先移动 v1，再移动 v2，总位移 = v1 + v2</li>
          <li>计算合力：多个力的合成</li>
        </ul>
        
        <h4 className="text-xl my-6 text-dark-text dark:text-dark-text text-light-text">2. 向量减法</h4>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">数学公式</strong>：v1 - v2 = (x1-x2, y1-y2, z1-z2)
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">几何意义</strong>：从点 v2 指向点 v1 的向量。在图形学中，常用于：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>计算两点间的向量：direction = pointB - pointA</li>
          <li>计算相对位置：relativePos = objectPos - cameraPos</li>
          <li>计算边向量：edge = vertex1 - vertex0（用于计算法线）</li>
        </ul>
        
        <h4 className="text-xl my-6 text-dark-text dark:text-dark-text text-light-text">3. 标量乘法</h4>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">数学公式</strong>：s * v = (s*x, s*y, s*z)
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">几何意义</strong>：改变向量的长度，方向不变（s &gt; 0）或反向（s &lt; 0）。在图形学中，常用于：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>缩放向量长度：scaled = normalize(v) * length</li>
          <li>调整速度：velocity = direction * speed</li>
          <li>插值计算：result = v1 + t * (v2 - v1)，其中 t 是插值因子</li>
        </ul>
        
        <h4 className="text-xl my-6 text-dark-text dark:text-dark-text text-light-text">4. 点积（Dot Product）</h4>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">数学公式</strong>：v1 · v2 = x1*x2 + y1*y2 + z1*z2（结果是一个标量）
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">几何意义</strong>：点积等于两个向量长度的乘积乘以它们夹角的余弦值：
          <code className="bg-dark-bg dark:bg-dark-bg px-1 py-0.5 rounded">v1 · v2 = |v1| * |v2| * cos(θ)</code>
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">重要性质</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>如果两个向量垂直，点积为 0：v1 · v2 = 0 当且仅当 v1 ⊥ v2</li>
          <li>如果两个向量同向，点积为正；反向则为负</li>
          <li>点积满足交换律：v1 · v2 = v2 · v1</li>
          <li>点积满足分配律：v1 · (v2 + v3) = v1 · v2 + v1 · v3</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">实际应用</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong>计算夹角</strong>：cos(θ) = dot(v1, v2) / (|v1| * |v2|)，用于判断两个方向是否接近</li>
          <li><strong>计算投影</strong>：向量 v1 在 v2 方向上的投影长度 = dot(v1, normalize(v2))</li>
          <li><strong>光照计算</strong>：使用兰伯特定律，光照强度 = max(0, dot(normalize(normal), normalize(-lightDir)))</li>
          <li><strong>背面剔除</strong>：判断三角形是否面向相机，dot(normal, viewDir) &gt; 0 表示正面</li>
          <li><strong>碰撞检测</strong>：判断点是否在平面的一侧，dot(point - planePoint, planeNormal)</li>
        </ul>
        
        <h4 className="text-xl my-6 text-dark-text dark:text-dark-text text-light-text">5. 叉积（Cross Product）</h4>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">数学公式</strong>：v1 × v2 = (y1*z2 - z1*y2, z1*x2 - x1*z2, x1*y2 - y1*x2)
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">几何意义</strong>：结果向量垂直于两个输入向量，方向由右手定则确定。
          结果向量的长度等于两个向量构成的平行四边形的面积：|v1 × v2| = |v1| * |v2| * sin(θ)
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">重要性质</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>叉积不满足交换律：v1 × v2 = -(v2 × v1)</li>
          <li>如果两个向量平行，叉积为零向量</li>
          <li>叉积满足分配律：v1 × (v2 + v3) = v1 × v2 + v1 × v3</li>
          <li>叉积与点积的关系：(v1 × v2) · v3 = v1 · (v2 × v3)（标量三重积）</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">实际应用</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong>计算法线向量</strong>：normal = normalize(cross(edge1, edge2))，用于光照和背面剔除</li>
          <li><strong>确定三角形朝向</strong>：通过叉积判断三角形是正面还是背面（用于背面剔除）</li>
          <li><strong>构建正交坐标系</strong>：给定 forward 向量，计算 right = normalize(cross(forward, up))，up = normalize(cross(right, forward))</li>
          <li><strong>计算面积</strong>：三角形面积 = 0.5 * |cross(edge1, edge2)|</li>
          <li><strong>旋转向量</strong>：绕轴旋转向量（需要配合其他方法）</li>
        </ul>
        
        <h4 className="text-xl my-6 text-dark-text dark:text-dark-text text-light-text">6. 向量长度（模长）</h4>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">数学公式</strong>：|v| = √(x² + y² + z²)
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">几何意义</strong>：向量从原点到终点的距离（欧几里得距离）。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">实际应用</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>计算两点间的距离：distance = |pointB - pointA|</li>
          <li>归一化向量：normalized = v / |v|</li>
          <li>比较向量大小：判断哪个向量更长</li>
          <li>碰撞检测：判断物体是否在范围内，|position - center| &lt; radius</li>
        </ul>
        
        <h4 className="text-xl my-6 text-dark-text dark:text-dark-text text-light-text">7. 向量归一化</h4>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">数学公式</strong>：v' = v / |v|（长度为 1 的单位向量）
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">几何意义</strong>：保持方向不变，将长度缩放到 1。
          归一化后的向量只包含方向信息，不包含大小信息。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">注意事项</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>零向量（0, 0, 0）不能归一化，会导致除以零错误</li>
          <li>归一化是很多计算的基础，如光照计算、方向计算等</li>
          <li>在 GLSL 中使用 <code className="bg-dark-bg dark:bg-dark-bg px-1 py-0.5 rounded">normalize(v)</code> 函数</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">实际应用</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>表示方向：direction = normalize(target - source)</li>
          <li>法线向量：normal = normalize(cross(edge1, edge2))</li>
          <li>光照计算：lightDir = normalize(lightPos - vertexPos)</li>
          <li>相机朝向：forward = normalize(lookAt - eyePos)</li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">向量运算的实际应用</h3>
        <CodeBlock title="计算两点间的距离" code={`// JavaScript 中计算距离
function distance(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dz = p2.z - p1.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// GLSL 中使用内置函数
float dist = distance(pointA, pointB);`} />
        
        <CodeBlock title="计算方向向量" code={`// 从点 A 指向点 B 的方向向量
vec3 direction = normalize(pointB - pointA);

// 用于相机看向目标
vec3 forward = normalize(target - cameraPosition);
vec3 right = normalize(cross(forward, up));
vec3 up = normalize(cross(right, forward));`} />
        
        <CodeBlock title="使用点积计算角度" code={`// 计算两个向量的夹角
vec3 v1 = normalize(vec3(1, 0, 0));
vec3 v2 = normalize(vec3(0, 1, 0));
float cosAngle = dot(v1, v2);  // 结果为 0，表示垂直

// 计算光照强度（兰伯特定律）
float lightIntensity = max(0.0, dot(normalize(normal), normalize(-lightDirection)));`} />
        
        <CodeBlock title="使用叉积计算法线" code={`// 计算三角形的法线向量
vec3 v0 = vertex0;
vec3 v1 = vertex1;
vec3 v2 = vertex2;

vec3 edge1 = v1 - v0;
vec3 edge2 = v2 - v0;
vec3 normal = normalize(cross(edge1, edge2));`} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">矩阵（Matrix）</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          矩阵是图形学中表示变换的核心工具。WebGL 使用 4x4 矩阵来表示 3D 变换。
          4x4 矩阵可以统一表示所有常见的 3D 变换（平移、旋转、缩放、投影），并且可以通过矩阵乘法组合多个变换。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">为什么使用 4x4 矩阵？</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>3x3 矩阵可以表示旋转和缩放，但无法表示平移（平移需要加法，不是线性变换）</li>
          <li>使用齐次坐标（homogeneous coordinates），将 3D 点扩展为 (x, y, z, w)，可以用矩阵乘法统一表示所有变换</li>
          <li>4x4 矩阵可以表示投影变换（透视投影和正交投影）</li>
          <li>矩阵乘法满足结合律，可以高效地组合多个变换</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">矩阵结构详解</strong>：
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          4x4 矩阵在内存中通常按列主序（column-major）存储，这是 WebGL 的标准格式：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong>前 3x3 部分（左上角）</strong>：表示旋转和缩放变换
            <ul className="mt-2 pl-6">
              <li>对角线元素：缩放因子</li>
              <li>非对角线元素：旋转信息</li>
            </ul>
          </li>
          <li><strong>第 4 列的前 3 个元素（m[12], m[13], m[14]）</strong>：表示平移量 (tx, ty, tz)</li>
          <li><strong>第 4 行（m[3], m[7], m[11], m[15]）</strong>：通常为 [0, 0, 0, 1]，用于齐次坐标的 w 分量</li>
          <li><strong>m[15]</strong>：通常为 1，表示齐次坐标的缩放因子</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">矩阵的内存布局</strong>：
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          在 JavaScript 中，矩阵通常存储为一维数组，按列主序排列：
        </p>
        <CodeBlock title="矩阵内存布局" code={`// 4x4 矩阵按列主序存储
// 矩阵形式：
// [m0  m4  m8  m12]
// [m1  m5  m9  m13]
// [m2  m6  m10 m14]
// [m3  m7  m11 m15]
//
// 数组索引：
// [0   4   8   12]
// [1   5   9   13]
// [2   6   10  14]
// [3   7   11  15]

const matrix = [
  m0, m1, m2, m3,    // 第 1 列
  m4, m5, m6, m7,    // 第 2 列
  m8, m9, m10, m11,  // 第 3 列
  m12, m13, m14, m15 // 第 4 列
]

// 访问元素：matrix[col * 4 + row]
// 例如：matrix[0] = m0, matrix[4] = m4, matrix[12] = m12`} language="javascript" />
        
        <CodeBlock title="单位矩阵（不进行任何变换）" code={`[
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1
]`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">矩阵乘法</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          矩阵乘法用于组合多个变换。这是图形学中最重要和最常用的操作之一。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">矩阵乘法的规则</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong>不满足交换律</strong>：A * B ≠ B * A（顺序非常重要！）</li>
          <li><strong>满足结合律</strong>：(A * B) * C = A * (B * C)</li>
          <li><strong>从右到左应用</strong>：M = A * B * C 表示先应用 C，再应用 B，最后应用 A</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">为什么顺序很重要？</strong>：
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          变换的顺序会影响最终结果。例如：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong>先旋转后平移</strong>：物体先绕原点旋转，然后平移。物体会在旋转后的位置平移。</li>
          <li><strong>先平移后旋转</strong>：物体先平移，然后绕原点旋转。物体会绕原点旋转，而不是绕自身中心旋转。</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">标准变换顺序</strong>：
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          在图形学中，通常使用以下顺序：<strong className="text-primary font-semibold">缩放 → 旋转 → 平移</strong>（SRT）
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>先缩放：确保旋转和缩放都是相对于物体中心的</li>
          <li>再旋转：绕物体中心旋转</li>
          <li>最后平移：将物体移动到最终位置</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">矩阵乘法的数学原理</strong>：
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          对于 4x4 矩阵 A 和 B，结果矩阵 C = A * B 的元素计算为：
          <code className="bg-dark-bg dark:bg-dark-bg px-1 py-0.5 rounded">C[i][j] = Σ(A[i][k] * B[k][j])</code>，其中 k 从 0 到 3。
        </p>
        
        <CodeBlock title="矩阵乘法示例" code={`// 组合变换：先缩放，再旋转，最后平移
const scale = Matrix.scaling(0.5, 0.5, 1);
const rotate = Matrix.rotationZ(Math.PI / 4);
const translate = Matrix.translation(0.2, 0, 0);

// 注意：从右到左应用
const combined = Matrix.multiply(
  translate,
  Matrix.multiply(rotate, scale)
);

// 在着色器中应用
gl_Position = u_matrix * vec4(a_position, 1.0);`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">矩阵的逆和转置</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          在某些情况下需要计算矩阵的逆或转置。理解这些操作对于高级图形编程非常重要。
        </p>
        
        <h4 className="text-xl my-6 text-dark-text dark:text-dark-text text-light-text">逆矩阵（Inverse Matrix）</h4>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">定义</strong>：
          矩阵 M 的逆矩阵 M⁻¹ 满足：M * M⁻¹ = M⁻¹ * M = I（单位矩阵）
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">几何意义</strong>：
          逆矩阵表示"撤销"原始变换。如果矩阵 M 将点从空间 A 变换到空间 B，
          那么 M⁻¹ 将点从空间 B 变换回空间 A。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">实际应用</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong>将点从世界空间转换回模型空间</strong>：
            <code className="bg-dark-bg dark:bg-dark-bg px-1 py-0.5 rounded">modelSpacePos = inverse(modelMatrix) * worldSpacePos</code>
          </li>
          <li><strong>计算法线矩阵</strong>：法线矩阵 = transpose(inverse(modelMatrix))</li>
          <li><strong>撤销变换</strong>：如果需要撤销某个变换，可以使用逆矩阵</li>
          <li><strong>计算相对变换</strong>：如果知道 A 到 B 的变换，可以计算 B 到 A 的变换</li>
        </ul>
        <CodeBlock title="逆矩阵的应用示例" code={`// 计算逆矩阵（需要使用矩阵库，如 gl-matrix）
import { mat4, invert } from 'gl-matrix';

const modelMatrix = mat4.create();
// ... 设置 modelMatrix

const inverseModelMatrix = mat4.create();
mat4.invert(inverseModelMatrix, modelMatrix);

// 应用：将世界空间的点转换回模型空间
const worldPos = [5, 0, 0];
const modelPos = vec3.transformMat4([], worldPos, inverseModelMatrix);

// 注意：不是所有矩阵都有逆矩阵
// 如果矩阵的行列式为 0（奇异矩阵），则没有逆矩阵
// 例如：缩放矩阵如果某个分量为 0，则没有逆矩阵`} language="javascript" />
        
        <h4 className="text-xl my-6 text-dark-text dark:text-dark-text text-light-text">转置矩阵（Transpose Matrix）</h4>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">定义</strong>：
          矩阵 M 的转置矩阵 Mᵀ 是将 M 的行和列互换得到的矩阵。
          即：Mᵀ[i][j] = M[j][i]
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">几何意义</strong>：
          转置矩阵在某些情况下可以简化计算，特别是在处理法线向量时。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">实际应用</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong>法线变换</strong>：法线矩阵 = transpose(inverse(modelMatrix))
            <ul className="mt-2 pl-6">
              <li>法线向量不能直接用模型矩阵变换（如果模型矩阵包含非均匀缩放）</li>
              <li>必须使用法线矩阵来正确变换法线向量</li>
            </ul>
          </li>
          <li><strong>矩阵存储格式转换</strong>：在列主序和行主序之间转换</li>
          <li><strong>某些数学运算</strong>：转置可以简化某些矩阵运算</li>
        </ul>
        <CodeBlock title="法线矩阵的计算和使用" code={`// 计算法线矩阵
const modelMatrix = mat4.create();
// ... 设置 modelMatrix

const normalMatrix = mat3.create();
mat3.normalFromMat4(normalMatrix, modelMatrix);
// 或者手动计算：
// const inverseModel = mat4.create();
// mat4.invert(inverseModel, modelMatrix);
// const normalMatrix = mat3.fromMat4(mat3.create(), inverseModel);
// mat3.transpose(normalMatrix, normalMatrix);

// 在顶点着色器中变换法线
attribute vec3 a_normal;
uniform mat3 u_normalMatrix;  // 法线矩阵（3x3）

void main() {
  // 正确变换法线
  vec3 normal = normalize(u_normalMatrix * a_normal);
  
  // 错误做法（如果模型矩阵包含非均匀缩放）：
  // vec3 normal = normalize((u_modelMatrix * vec4(a_normal, 0.0)).xyz);
}`} language="javascript" />
        
        <h4 className="text-xl my-6 text-dark-text dark:text-dark-text text-light-text">为什么法线需要特殊处理？</h4>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">问题</strong>：
          如果模型矩阵包含非均匀缩放（例如 x 方向缩放 2 倍，y 方向缩放 1 倍），
          直接使用模型矩阵变换法线会导致法线方向错误。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">原因</strong>：
          法线向量必须保持与表面的垂直关系。如果表面被非均匀缩放，
          法线也需要相应调整以保持垂直。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">解决方案</strong>：
          使用法线矩阵 = transpose(inverse(modelMatrix))。
          这个公式保证了法线在变换后仍然垂直于表面。
        </p>
        <CodeBlock title="法线变换的数学原理" code={`// 假设表面有两个切向量 u 和 v
// 法线 n 满足：n · u = 0 且 n · v = 0

// 如果使用矩阵 M 变换表面，切向量变为 M*u 和 M*v
// 法线需要变为 n'，使得 n' · (M*u) = 0 且 n' · (M*v) = 0

// 通过数学推导，可以得到：
// n' = (M⁻¹)ᵀ * n
// 即：法线矩阵 = transpose(inverse(M))

// 在代码中：
const normalMatrix = transpose(inverse(modelMatrix));
const transformedNormal = normalMatrix * normal;`} language="javascript" />
        
        <h4 className="text-xl my-6 text-dark-text dark:text-dark-text text-light-text">矩阵运算的性能考虑</h4>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">逆矩阵计算</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>计算逆矩阵是昂贵的操作（O(n³) 复杂度）</li>
          <li>应该避免每帧都计算逆矩阵</li>
          <li>如果模型矩阵不变，可以预计算逆矩阵</li>
          <li>对于某些特殊矩阵（如正交矩阵），逆矩阵等于转置矩阵，计算更快</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">转置矩阵计算</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>转置矩阵计算相对简单（O(n²) 复杂度）</li>
          <li>如果矩阵不变，可以预计算转置矩阵</li>
        </ul>
        <CodeBlock title="性能优化示例" code={`// 不好的做法：每帧都计算
function render() {
  const normalMatrix = transpose(inverse(modelMatrix));
  gl.uniformMatrix3fv(normalMatrixLocation, false, normalMatrix);
  // ... 渲染
}

// 好的做法：只在模型矩阵改变时计算
let cachedNormalMatrix = null;
let cachedModelMatrix = null;

function updateModelMatrix(newModelMatrix) {
  if (cachedModelMatrix !== newModelMatrix) {
    cachedModelMatrix = newModelMatrix;
    cachedNormalMatrix = transpose(inverse(newModelMatrix));
  }
}

function render() {
  gl.uniformMatrix3fv(normalMatrixLocation, false, cachedNormalMatrix);
  // ... 渲染
}`} language="javascript" />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">平移（Translation）</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          平移矩阵用于移动物体。平移矩阵的形式：
        </p>
        
        <CodeBlock title="平移矩阵" code={`[
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  tx, ty, tz, 1  // 平移量
]`} language="javascript" />
        
        <WebGLCanvas width={400} height={400} onInit={(gl: WebGLRenderingContext, canvas: HTMLCanvasElement) => {
          const vertexShader = `attribute vec2 a_position;
uniform mat4 u_matrix;

void main() {
  gl_Position = u_matrix * vec4(a_position, 0.0, 1.0);
}`
          
          const fragmentShader = `precision mediump float;
uniform vec4 u_color;

void main() {
  gl_FragColor = u_color;
}`
          
          const program = createProgram(gl, vertexShader, fragmentShader)
          const positions = [0, 0.3, -0.3, -0.3, 0.3, -0.3]
          const positionBuffer = createBuffer(gl, positions)
          
          const matrixLocation = gl.getUniformLocation(program, 'u_matrix')
          const colorLocation = gl.getUniformLocation(program, 'u_color')
          const positionLocation = gl.getAttribLocation(program, 'a_position')
          
          if (positionLocation === -1) {
            console.error('属性 a_position 未找到')
            return
          }
          
          gl.viewport(0, 0, canvas.width, canvas.height)
          gl.clearColor(0.1, 0.1, 0.1, 1.0)
          
          let time = 0
          const render = () => {
            time += 0.01
            const tx = Math.sin(time) * 0.3
            const translation = Matrix.translation(tx, 0, 0)
            
            gl.clear(gl.COLOR_BUFFER_BIT)
            gl.useProgram(program)
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
            gl.enableVertexAttribArray(positionLocation)
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
            
            gl.uniformMatrix4fv(matrixLocation, false, translation)
            gl.uniform4f(colorLocation, 0.2, 0.6, 1.0, 1.0)
            gl.drawArrays(gl.TRIANGLES, 0, 3)
            
            requestAnimationFrame(render)
          }
          render()
        }} />
        
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">上面的示例展示了三角形在 X 轴上的平移动画。</p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">旋转（Rotation）</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          旋转是 3D 图形学中最复杂的变换之一。旋转矩阵用于绕轴旋转物体。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">旋转的基本概念</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>旋转需要指定旋转轴（axis）和旋转角度（angle）</li>
          <li>旋转角度通常用弧度表示：角度 = 弧度 * 180 / π</li>
          <li>旋转方向遵循右手定则：右手四指指向旋转方向，拇指指向旋转轴正方向</li>
          <li>绕坐标轴的旋转是最简单的旋转，也是最常用的</li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">绕坐标轴旋转</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          绕 X、Y、Z 轴的旋转是最基本的旋转操作。每个旋转矩阵保持对应轴不变。
        </p>
        
        <h4 className="text-xl my-6 text-dark-text dark:text-dark-text text-light-text">绕 X 轴旋转</h4>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          绕 X 轴旋转时，X 坐标不变，Y 和 Z 坐标在 YZ 平面内旋转。
        </p>
        <CodeBlock title="绕 X 轴旋转矩阵" code={`[
  1, 0, 0, 0,
  0, cos(θ), sin(θ), 0,
  0, -sin(θ), cos(θ), 0,
  0, 0, 0, 1
]`} language="javascript" />
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">应用场景</strong>：物体前后翻转（pitch），如飞机的俯仰运动。
        </p>
        
        <h4 className="text-xl my-6 text-dark-text dark:text-dark-text text-light-text">绕 Y 轴旋转</h4>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          绕 Y 轴旋转时，Y 坐标不变，X 和 Z 坐标在 XZ 平面内旋转。
        </p>
        <CodeBlock title="绕 Y 轴旋转矩阵" code={`[
  cos(θ), 0, -sin(θ), 0,
  0, 1, 0, 0,
  sin(θ), 0, cos(θ), 0,
  0, 0, 0, 1
]`} language="javascript" />
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">应用场景</strong>：物体左右旋转（yaw），如角色的左右转向。
        </p>
        
        <h4 className="text-xl my-6 text-dark-text dark:text-dark-text text-light-text">绕 Z 轴旋转</h4>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          绕 Z 轴旋转时，Z 坐标不变，X 和 Y 坐标在 XY 平面内旋转（2D 旋转）。
        </p>
        <CodeBlock title="绕 Z 轴旋转矩阵" code={`[
  cos(θ), sin(θ), 0, 0,
  -sin(θ), cos(θ), 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1
]`} language="javascript" />
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">应用场景</strong>：物体绕垂直轴旋转（roll），如 2D 精灵的旋转、UI 元素的旋转。
        </p>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">组合旋转（欧拉角）</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          要绕多个轴旋转，可以组合多个旋转矩阵。常用的组合方式有：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong>XYZ 顺序</strong>：先绕 X 轴，再绕 Y 轴，最后绕 Z 轴</li>
          <li><strong>ZYX 顺序</strong>：先绕 Z 轴，再绕 Y 轴，最后绕 X 轴（常用于相机控制）</li>
          <li><strong>YXZ 顺序</strong>：先绕 Y 轴，再绕 X 轴，最后绕 Z 轴</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">注意</strong>：旋转顺序不同，结果也不同！这是因为矩阵乘法不满足交换律。
        </p>
        <CodeBlock title="组合旋转示例（XYZ 顺序）" code={`// 欧拉角：pitch (X), yaw (Y), roll (Z)
const pitch = Math.PI / 6;  // 30 度
const yaw = Math.PI / 4;     // 45 度
const roll = Math.PI / 3;    // 60 度

// 组合旋转：先 X，再 Y，最后 Z
const rotX = Matrix.rotationX(pitch);
const rotY = Matrix.rotationY(yaw);
const rotZ = Matrix.rotationZ(roll);

// 注意：从右到左应用
const rotation = Matrix.multiply(rotZ, Matrix.multiply(rotY, rotX));

// 在着色器中应用
gl_Position = u_matrix * vec4(a_position, 1.0);`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">万向锁（Gimbal Lock）问题</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">什么是万向锁？</strong>：
          当使用欧拉角表示旋转时，在某些特定角度下，两个旋转轴会重合，导致失去一个自由度。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">如何避免万向锁？</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>使用四元数（Quaternion）表示旋转，可以避免万向锁问题</li>
          <li>限制旋转角度范围，避免达到万向锁的角度</li>
          <li>使用轴角表示法（Axis-Angle）</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">实际应用</strong>：
          在游戏开发中，相机控制通常使用欧拉角（简单直观），但会限制 pitch 角度范围（如 -90° 到 90°）来避免万向锁。
        </p>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">绕任意轴旋转</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          除了绕坐标轴旋转，还可以绕任意轴旋转。这需要使用罗德里格斯旋转公式（Rodrigues' rotation formula）。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">罗德里格斯公式</strong>：
          给定旋转轴 n（单位向量）和旋转角度 θ，旋转矩阵为：
        </p>
        <CodeBlock title="绕任意轴旋转（罗德里格斯公式）" code={`// 给定旋转轴 axis（单位向量）和角度 angle
function rotationAroundAxis(axis, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const t = 1 - c;
  
  const x = axis[0];
  const y = axis[1];
  const z = axis[2];
  
  return [
    t * x * x + c,      t * x * y - s * z,  t * x * z + s * y,  0,
    t * x * y + s * z,  t * y * y + c,      t * y * z - s * x,  0,
    t * x * z - s * y,  t * y * z + s * x,  t * z * z + c,      0,
    0,                  0,                  0,                  1
  ];
}

// 使用示例
const axis = normalize([1, 1, 1]);  // 归一化旋转轴
const angle = Math.PI / 4;           // 45 度
const rotation = rotationAroundAxis(axis, angle);`} language="javascript" />
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">应用场景</strong>：
          物体绕自身某个轴旋转（如门绕门轴旋转）、实现平滑的旋转动画等。
        </p>
        
        <WebGLCanvas width={400} height={400} onInit={(gl: WebGLRenderingContext, canvas: HTMLCanvasElement) => {
          const vertexShader = `attribute vec2 a_position;
uniform mat4 u_matrix;

void main() {
  gl_Position = u_matrix * vec4(a_position, 0.0, 1.0);
}`
          
          const fragmentShader = `precision mediump float;
uniform vec4 u_color;

void main() {
  gl_FragColor = u_color;
}`
          
          const program = createProgram(gl, vertexShader, fragmentShader)
          const positions = [0, 0.3, -0.3, -0.3, 0.3, -0.3]
          const positionBuffer = createBuffer(gl, positions)
          
          const matrixLocation = gl.getUniformLocation(program, 'u_matrix')
          const colorLocation = gl.getUniformLocation(program, 'u_color')
          const positionLocation = gl.getAttribLocation(program, 'a_position')
          
          if (positionLocation === -1) {
            console.error('属性 a_position 未找到')
            return
          }
          
          gl.viewport(0, 0, canvas.width, canvas.height)
          gl.clearColor(0.1, 0.1, 0.1, 1.0)
          
          let angle = 0
          const render = () => {
            angle += 0.02
            const rotation = Matrix.rotationZ(angle)
            
            gl.clear(gl.COLOR_BUFFER_BIT)
            gl.useProgram(program)
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
            gl.enableVertexAttribArray(positionLocation)
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
            
            gl.uniformMatrix4fv(matrixLocation, false, rotation)
            gl.uniform4f(colorLocation, 0.2, 0.6, 1.0, 1.0)
            gl.drawArrays(gl.TRIANGLES, 0, 3)
            
            requestAnimationFrame(render)
          }
          render()
        }} />
        
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">上面的示例展示了三角形绕 Z 轴的旋转动画。</p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">缩放（Scaling）</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          缩放矩阵用于改变物体的大小。缩放矩阵的形式：
        </p>
        
        <CodeBlock title="缩放矩阵" code={`[
  sx, 0, 0, 0,
  0, sy, 0, 0,
  0, 0, sz, 0,
  0, 0, 0, 1
]`} language="javascript" />
        
        <WebGLCanvas width={400} height={400} onInit={(gl: WebGLRenderingContext, canvas: HTMLCanvasElement) => {
          const vertexShader = `attribute vec2 a_position;
uniform mat4 u_matrix;

void main() {
  gl_Position = u_matrix * vec4(a_position, 0.0, 1.0);
}`
          
          const fragmentShader = `precision mediump float;
uniform vec4 u_color;

void main() {
  gl_FragColor = u_color;
}`
          
          const program = createProgram(gl, vertexShader, fragmentShader)
          const positions = [0, 0.3, -0.3, -0.3, 0.3, -0.3]
          const positionBuffer = createBuffer(gl, positions)
          
          const matrixLocation = gl.getUniformLocation(program, 'u_matrix')
          const colorLocation = gl.getUniformLocation(program, 'u_color')
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
            const scale = 0.5 + Math.sin(time) * 0.3
            const scaling = Matrix.scaling(scale, scale, 1)
            
            gl.clear(gl.COLOR_BUFFER_BIT)
            gl.useProgram(program)
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
            gl.enableVertexAttribArray(positionLocation)
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
            
            gl.uniformMatrix4fv(matrixLocation, false, scaling)
            gl.uniform4f(colorLocation, 0.2, 0.6, 1.0, 1.0)
            gl.drawArrays(gl.TRIANGLES, 0, 3)
            
            requestAnimationFrame(render)
          }
          render()
        }} />
        
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">上面的示例展示了三角形的缩放动画。</p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">组合变换</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          多个变换可以通过矩阵乘法组合。注意：矩阵乘法的顺序很重要！
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          通常的顺序是：<strong className="text-primary font-semibold">缩放 → 旋转 → 平移</strong>
        </p>
        
        <CodeBlock title="组合变换示例" code={`// 先缩放，再旋转，最后平移
const scale = Matrix.scaling(0.5, 0.5, 1)
const rotate = Matrix.rotationZ(angle)
const translate = Matrix.translation(0.2, 0, 0)

// 注意：矩阵乘法从右到左应用
// 先应用 scale，再应用 rotate，最后应用 translate
const matrix = Matrix.multiply(translate, Matrix.multiply(rotate, scale))`} language="javascript" />
        
        <WebGLCanvas width={400} height={400} onInit={(gl: WebGLRenderingContext, canvas: HTMLCanvasElement) => {
          const vertexShader = `attribute vec2 a_position;
uniform mat4 u_matrix;

void main() {
  gl_Position = u_matrix * vec4(a_position, 0.0, 1.0);
}`
          
          const fragmentShader = `precision mediump float;
uniform vec4 u_color;

void main() {
  gl_FragColor = u_color;
}`
          
          const program = createProgram(gl, vertexShader, fragmentShader)
          const positions = [0, 0.3, -0.3, -0.3, 0.3, -0.3]
          const positionBuffer = createBuffer(gl, positions)
          
          const matrixLocation = gl.getUniformLocation(program, 'u_matrix')
          const colorLocation = gl.getUniformLocation(program, 'u_color')
          const positionLocation = gl.getAttribLocation(program, 'a_position')
          
          if (positionLocation === -1) {
            console.error('属性 a_position 未找到')
            return
          }
          
          gl.viewport(0, 0, canvas.width, canvas.height)
          gl.clearColor(0.1, 0.1, 0.1, 1.0)
          
          let angle = 0
          const render = () => {
            angle += 0.02
            const scale = Matrix.scaling(0.5, 0.5, 1)
            const rotate = Matrix.rotationZ(angle)
            const translate = Matrix.translation(0.2, 0, 0)
            const matrix = Matrix.multiply(translate, Matrix.multiply(rotate, scale))
            
            gl.clear(gl.COLOR_BUFFER_BIT)
            gl.useProgram(program)
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
            gl.enableVertexAttribArray(positionLocation)
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
            
            gl.uniformMatrix4fv(matrixLocation, false, matrix)
            gl.uniform4f(colorLocation, 0.2, 0.6, 1.0, 1.0)
            gl.drawArrays(gl.TRIANGLES, 0, 3)
            
            requestAnimationFrame(render)
          }
          render()
        }} />
        
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">上面的示例展示了同时进行缩放、旋转和平移的组合变换。</p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">坐标系统</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          在 3D 图形学中，顶点需要经过多个坐标系统的转换才能最终显示在屏幕上。
          理解这些坐标系统及其转换关系是掌握 3D 图形学的关键。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">为什么需要多个坐标系统？</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>每个坐标系统都有其特定的用途和优势</li>
          <li>分离关注点：模型定义、场景布局、相机控制、投影计算</li>
          <li>便于复用：同一个模型可以在不同位置、不同角度使用</li>
          <li>简化计算：在不同空间中进行相应的计算更简单</li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">1. 模型空间（Model Space / Object Space）</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">定义</strong>：物体自身的坐标系，通常以物体中心或某个特定点为原点。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">特点</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>模型的所有顶点坐标都是相对于模型原点的</li>
          <li>模型可以在模型空间中任意缩放、旋转，而不影响其他物体</li>
          <li>模型数据（如顶点位置、法线、纹理坐标）通常存储在这个空间中</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">模型矩阵（Model Matrix）</strong>：
          将顶点从模型空间转换到世界空间。通常包含缩放、旋转、平移变换。
        </p>
        <CodeBlock title="模型矩阵示例" code={`// 创建一个立方体，中心在原点，边长为 1
const cubeVertices = [
  -0.5, -0.5, -0.5,  // 左下前
   0.5, -0.5, -0.5,  // 右下前
  // ... 其他顶点
];

// 模型矩阵：将立方体放大 2 倍，旋转 45 度，平移到 (5, 0, 0)
const scale = Matrix.scaling(2, 2, 2);
const rotate = Matrix.rotationY(Math.PI / 4);
const translate = Matrix.translation(5, 0, 0);
const modelMatrix = Matrix.multiply(translate, Matrix.multiply(rotate, scale));`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">2. 世界空间（World Space）</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">定义</strong>：场景中所有物体的统一坐标系，通常以场景原点为原点。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">特点</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>所有物体都在同一个坐标系中，可以计算它们之间的相对位置和距离</li>
          <li>光照计算、碰撞检测等通常在世界空间中进行</li>
          <li>场景中的每个物体都有自己的模型矩阵</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">视图矩阵（View Matrix）</strong>：
          将顶点从世界空间转换到视图空间（相机空间）。视图矩阵实际上是相机变换的逆矩阵。
        </p>
        <CodeBlock title="视图矩阵示例（lookAt）" code={`// 设置相机位置和朝向
const eye = [0, 5, 10];        // 相机位置
const center = [0, 0, 0];      // 看向的点
const up = [0, 1, 0];          // 上方向

// 创建视图矩阵
const viewMatrix = Matrix.lookAt(
  eye[0], eye[1], eye[2],
  center[0], center[1], center[2],
  up[0], up[1], up[2]
);

// 视图矩阵实际上是将世界空间变换到相机空间
// 相机空间：相机在原点，看向 -Z 方向，Y 轴向上`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">3. 视图空间（View Space / Camera Space / Eye Space）</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">定义</strong>：以相机为原点的坐标系，相机看向 -Z 方向，Y 轴向上。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">特点</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>相机始终在原点 (0, 0, 0)</li>
          <li>相机看向 -Z 方向（右手坐标系）</li>
          <li>Y 轴指向"上"方向</li>
          <li>在这个空间中，深度测试和裁剪计算更简单</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">投影矩阵（Projection Matrix）</strong>：
          将顶点从视图空间转换到裁剪空间。有两种投影方式：透视投影和正交投影。
        </p>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">4. 裁剪空间（Clip Space）</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">定义</strong>：经过投影变换后的坐标，范围在 -1 到 1 之间（对于可见的顶点）。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">特点</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>坐标范围：x, y, z 都在 [-1, 1] 范围内（对于可见顶点）</li>
          <li>超出范围的顶点会被裁剪掉（clipping）</li>
          <li>这是顶点着色器输出的坐标空间（gl_Position）</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">透视除法（Perspective Division）</strong>：
          WebGL 会自动将裁剪空间坐标除以 w 分量，得到归一化设备坐标（NDC）。
        </p>
        <CodeBlock title="透视除法" code={`// 在顶点着色器中
gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * vec4(a_position, 1.0);

// WebGL 自动执行：
// NDC.x = gl_Position.x / gl_Position.w
// NDC.y = gl_Position.y / gl_Position.w
// NDC.z = gl_Position.z / gl_Position.w

// 对于透视投影，w 分量通常不等于 1，这会产生透视效果
// 对于正交投影，w 分量等于 1，不会产生透视效果`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">5. 归一化设备坐标（NDC - Normalized Device Coordinates）</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">定义</strong>：经过透视除法后的坐标，范围在 [-1, 1]。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">特点</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>坐标范围：x, y, z 都在 [-1, 1]</li>
          <li>(-1, -1) 对应屏幕左下角，(1, 1) 对应屏幕右上角</li>
          <li>这是视口变换的输入</li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">6. 屏幕空间（Screen Space / Window Coordinates）</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">定义</strong>：最终显示在屏幕上的像素坐标。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">特点</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>X 坐标范围：[0, canvas.width]</li>
          <li>Y 坐标范围：[0, canvas.height]（注意：Y 轴可能向下）</li>
          <li>这是片段着色器中 gl_FragCoord 的坐标空间</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">视口变换（Viewport Transform）</strong>：
          WebGL 通过 gl.viewport() 设置视口，自动将 NDC 坐标映射到屏幕坐标。
        </p>
        <CodeBlock title="视口设置" code={`// 设置视口：将 NDC 坐标映射到屏幕坐标
gl.viewport(0, 0, canvas.width, canvas.height);

// 变换公式（WebGL 自动执行）：
// screenX = (NDC.x + 1) * canvas.width / 2
// screenY = (1 - NDC.y) * canvas.height / 2  // 注意 Y 轴翻转
// screenZ = (NDC.z + 1) / 2  // 深度值映射到 [0, 1]`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">坐标变换流程总结</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          完整的坐标变换流程：
        </p>
        <CodeBlock title="坐标变换流程" code={`// 1. 模型空间 → 世界空间
vec4 worldPos = u_modelMatrix * vec4(a_position, 1.0);

// 2. 世界空间 → 视图空间
vec4 viewPos = u_viewMatrix * worldPos;

// 3. 视图空间 → 裁剪空间
vec4 clipPos = u_projectionMatrix * viewPos;

// 4. 裁剪空间 → NDC（WebGL 自动执行透视除法）
// NDC = clipPos.xyz / clipPos.w

// 5. NDC → 屏幕空间（WebGL 自动执行视口变换）
// screenPos = viewportTransform(NDC)

// 在顶点着色器中，通常直接计算：
gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * vec4(a_position, 1.0);`} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">MVP 矩阵</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          MVP 是 Model-View-Projection 的缩写，表示三个矩阵的组合。
          这是 3D 图形学中最核心的概念之一，几乎所有的 3D 渲染都会用到 MVP 矩阵。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">MVP 矩阵的三个组成部分</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">M（Model Matrix）</strong>：模型矩阵，将顶点从模型空间转换到世界空间
            <ul className="mt-2 pl-6">
              <li>包含物体的位置、旋转、缩放信息</li>
              <li>每个物体都有自己的模型矩阵</li>
              <li>通常在 CPU 端计算，每帧更新（如果物体在移动）</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">V（View Matrix）</strong>：视图矩阵，将顶点从世界空间转换到视图空间
            <ul className="mt-2 pl-6">
              <li>表示相机的位置和朝向</li>
              <li>场景中的所有物体共享同一个视图矩阵</li>
              <li>通常在 CPU 端计算，每帧更新（如果相机在移动）</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">P（Projection Matrix）</strong>：投影矩阵，将顶点从视图空间转换到裁剪空间
            <ul className="mt-2 pl-6">
              <li>定义相机的视野（FOV）、宽高比、近远平面</li>
              <li>场景中的所有物体共享同一个投影矩阵</li>
              <li>通常在窗口大小改变时更新</li>
            </ul>
          </li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">MVP 矩阵的组合方式</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">方式 1：在 CPU 端组合（推荐）</strong>：
          在 JavaScript 中组合 MVP 矩阵，然后作为单个 uniform 传递给着色器。
          这种方式性能更好，因为减少了 GPU 的矩阵乘法计算。
        </p>
        <CodeBlock title="在 CPU 端组合 MVP 矩阵" code={`// JavaScript 端
function updateMVP(modelMatrix, viewMatrix, projectionMatrix) {
  // 组合顺序：P * V * M（从右到左应用）
  const mvp = Matrix.multiply(
    projectionMatrix,
    Matrix.multiply(viewMatrix, modelMatrix)
  );
  return mvp;
}

// 传递给着色器
gl.uniformMatrix4fv(mvpLocation, false, mvp);

// 顶点着色器（简单）
attribute vec3 a_position;
uniform mat4 u_mvpMatrix;

void main() {
  gl_Position = u_mvpMatrix * vec4(a_position, 1.0);
}`} language="javascript" />
        
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">方式 2：在 GPU 端组合</strong>：
          分别传递三个矩阵，在着色器中组合。这种方式更灵活，可以在着色器中使用中间结果。
        </p>
        <CodeBlock title="在 GPU 端组合 MVP 矩阵" code={`// JavaScript 端：分别传递三个矩阵
gl.uniformMatrix4fv(modelLocation, false, modelMatrix);
gl.uniformMatrix4fv(viewLocation, false, viewMatrix);
gl.uniformMatrix4fv(projectionLocation, false, projectionMatrix);

// 顶点着色器：在 GPU 中组合
attribute vec3 a_position;
uniform mat4 u_modelMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_projectionMatrix;

void main() {
  // 方式 A：直接组合
  mat4 mvp = u_projectionMatrix * u_viewMatrix * u_modelMatrix;
  gl_Position = mvp * vec4(a_position, 1.0);
  
  // 方式 B：分步计算（可以保存中间结果用于其他计算）
  vec4 worldPos = u_modelMatrix * vec4(a_position, 1.0);
  vec4 viewPos = u_viewMatrix * worldPos;
  gl_Position = u_projectionMatrix * viewPos;
  
  // 注意：worldPos 和 viewPos 可以用于光照计算等
}`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">投影矩阵详解</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          投影矩阵有两种类型：透视投影和正交投影。
        </p>
        
        <h4 className="text-xl my-6 text-dark-text dark:text-dark-text text-light-text">透视投影（Perspective Projection）</h4>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">特点</strong>：
          模拟人眼的视觉效果，远处的物体看起来更小（透视效果）。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">参数</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong>fieldOfView（FOV）</strong>：视野角度（通常用弧度表示），如 45° = π/4</li>
          <li><strong>aspect</strong>：宽高比 = canvas.width / canvas.height</li>
          <li><strong>near</strong>：近裁剪平面距离（必须 &gt; 0）</li>
          <li><strong>far</strong>：远裁剪平面距离（必须 &gt; near）</li>
        </ul>
        <CodeBlock title="创建透视投影矩阵" code={`// 创建透视投影矩阵
const fov = Math.PI / 4;  // 45 度
const aspect = canvas.width / canvas.height;
const near = 0.1;
const far = 100.0;

const projectionMatrix = Matrix.perspective(fov, aspect, near, far);

// 在着色器中使用
gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * vec4(a_position, 1.0);`} language="javascript" />
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">应用场景</strong>：
          大多数 3D 游戏和应用程序使用透视投影，因为它更符合人眼的视觉习惯。
        </p>
        
        <h4 className="text-xl my-6 text-dark-text dark:text-dark-text text-light-text">正交投影（Orthographic Projection）</h4>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">特点</strong>：
          没有透视效果，所有物体无论距离远近都保持相同大小。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">参数</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong>left, right</strong>：左右边界</li>
          <li><strong>bottom, top</strong>：上下边界</li>
          <li><strong>near, far</strong>：近远裁剪平面</li>
        </ul>
        <CodeBlock title="创建正交投影矩阵" code={`// 创建正交投影矩阵
const left = -10;
const right = 10;
const bottom = -10;
const top = 10;
const near = 0.1;
const far = 100.0;

const projectionMatrix = Matrix.ortho(left, right, bottom, top, near, far);

// 在着色器中使用
gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * vec4(a_position, 1.0);`} language="javascript" />
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">应用场景</strong>：
          2D 游戏、UI 元素、CAD 软件、等距视图游戏等。
        </p>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">视图矩阵详解（lookAt）</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          lookAt 函数是最常用的创建视图矩阵的方法。它需要三个参数：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong>eye</strong>：相机位置（在世界空间中的坐标）</li>
          <li><strong>center</strong>：相机看向的点（目标点）</li>
          <li><strong>up</strong>：上方向向量（通常为 [0, 1, 0]）</li>
        </ul>
        <CodeBlock title="创建视图矩阵（lookAt）" code={`// 创建视图矩阵
const eye = [0, 5, 10];        // 相机位置
const center = [0, 0, 0];      // 看向原点
const up = [0, 1, 0];          // Y 轴向上

const viewMatrix = Matrix.lookAt(
  eye[0], eye[1], eye[2],
  center[0], center[1], center[2],
  up[0], up[1], up[2]
);

// lookAt 函数的实现原理：
// 1. 计算 forward = normalize(center - eye)
// 2. 计算 right = normalize(cross(forward, up))
// 3. 计算 up = normalize(cross(right, forward))
// 4. 构建视图矩阵（实际上是相机变换的逆矩阵）`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">MVP 矩阵的优化技巧</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">1. 预计算 MVP 矩阵</strong>：
          如果模型矩阵和视图矩阵不变，可以在 CPU 端预计算 MVP 矩阵。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">2. 分离静态和动态部分</strong>：
          如果只有模型矩阵变化，可以预计算 P * V，然后只更新 M 部分。
        </p>
        <CodeBlock title="优化示例" code={`// 预计算 P * V（如果视图和投影不变）
const viewProjection = Matrix.multiply(projectionMatrix, viewMatrix);

// 每帧只更新模型矩阵
function render() {
  const modelMatrix = calculateModelMatrix();
  const mvp = Matrix.multiply(viewProjection, modelMatrix);
  gl.uniformMatrix4fv(mvpLocation, false, mvp);
  // ... 渲染
}`} language="javascript" />
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">3. 使用矩阵库</strong>：
          使用成熟的矩阵库（如 gl-matrix）可以提高性能和代码可读性。
        </p>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">常见问题和调试技巧</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">问题 1：物体不显示</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>检查物体是否在相机的视野范围内</li>
          <li>检查近远裁剪平面设置是否合理</li>
          <li>检查物体是否被其他物体遮挡</li>
          <li>检查深度测试是否启用</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">问题 2：物体显示错误</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>检查矩阵乘法的顺序是否正确</li>
          <li>检查矩阵是否按列主序存储</li>
          <li>检查坐标系统是否一致（左手/右手）</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">调试技巧</strong>：
        </p>
        <CodeBlock title="调试 MVP 矩阵" code={`// 1. 打印矩阵值
console.log('Model Matrix:', modelMatrix);
console.log('View Matrix:', viewMatrix);
console.log('Projection Matrix:', projectionMatrix);

// 2. 可视化坐标系统
// 在着色器中输出世界坐标作为颜色
vec4 worldPos = u_modelMatrix * vec4(a_position, 1.0);
gl_FragColor = vec4(worldPos.xyz * 0.5 + 0.5, 1.0);

// 3. 检查裁剪空间坐标
// 如果 gl_Position 的 x, y, z 超出 [-1, 1]，物体会被裁剪
if (any(greaterThan(abs(gl_Position.xyz), vec3(1.0)))) {
  // 物体可能被裁剪
}`} language="javascript" />
        
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">重要提示</strong>：
          矩阵乘法的顺序是从右到左应用的。先应用模型矩阵，再应用视图矩阵，最后应用投影矩阵。
          即：<code className="bg-dark-bg dark:bg-dark-bg px-1 py-0.5 rounded">MVP = P * V * M</code>
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">实际应用场景</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          下面介绍一些实际应用场景，帮助你更好地理解 3D 数学在图形学中的应用。
        </p>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">场景 1：相机控制系统</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          在游戏中，相机通常需要跟随玩家、可以旋转、可以缩放。这需要使用视图矩阵和投影矩阵。
        </p>
        <CodeBlock title="第一人称相机控制" code={`// 第一人称相机：使用欧拉角控制
let cameraYaw = 0;    // 左右旋转（绕 Y 轴）
let cameraPitch = 0;  // 上下旋转（绕 X 轴）
let cameraPos = [0, 1.6, 0];  // 相机位置（眼睛高度）

function updateCamera(mouseDeltaX, mouseDeltaY) {
  // 更新旋转角度
  cameraYaw += mouseDeltaX * 0.01;
  cameraPitch += mouseDeltaY * 0.01;
  
  // 限制 pitch 角度，避免万向锁
  cameraPitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraPitch));
  
  // 计算相机朝向
  const forward = [
    Math.sin(cameraYaw) * Math.cos(cameraPitch),
    Math.sin(cameraPitch),
    -Math.cos(cameraYaw) * Math.cos(cameraPitch)
  ];
  
  // 计算目标点
  const target = [
    cameraPos[0] + forward[0],
    cameraPos[1] + forward[1],
    cameraPos[2] + forward[2]
  ];
  
  // 创建视图矩阵
  const viewMatrix = Matrix.lookAt(
    cameraPos[0], cameraPos[1], cameraPos[2],
    target[0], target[1], target[2],
    0, 1, 0
  );
  
  return viewMatrix;
}`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">场景 2：物体动画</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          物体可能需要旋转、缩放、平移等动画效果。这需要使用模型矩阵。
        </p>
        <CodeBlock title="旋转的立方体" code={`// 创建一个旋转的立方体
function updateCubeAnimation(time) {
  // 计算旋转角度
  const rotationY = time * 0.001;  // 绕 Y 轴旋转
  const rotationX = time * 0.0005;   // 绕 X 轴旋转
  
  // 创建旋转矩阵
  const rotY = Matrix.rotationY(rotationY);
  const rotX = Matrix.rotationX(rotationX);
  const rotation = Matrix.multiply(rotY, rotX);
  
  // 可以添加缩放和平移
  const scale = Matrix.scaling(1, 1, 1);
  const translate = Matrix.translation(0, 0, 0);
  
  // 组合变换：先缩放，再旋转，最后平移
  const modelMatrix = Matrix.multiply(
    translate,
    Matrix.multiply(rotation, scale)
  );
  
  return modelMatrix;
}`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">场景 3：光照计算</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          光照计算需要将法线向量和光线方向转换到同一空间（通常是视图空间或世界空间）。
        </p>
        <CodeBlock title="在着色器中计算光照" code={`// 顶点着色器
attribute vec3 a_position;
attribute vec3 a_normal;
uniform mat4 u_modelMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_projectionMatrix;
uniform mat3 u_normalMatrix;  // 法线矩阵

varying vec3 v_normal;
varying vec3 v_position;

void main() {
  // 变换顶点位置
  vec4 worldPos = u_modelMatrix * vec4(a_position, 1.0);
  vec4 viewPos = u_viewMatrix * worldPos;
  gl_Position = u_projectionMatrix * viewPos;
  
  // 变换法线（使用法线矩阵）
  v_normal = normalize(u_normalMatrix * a_normal);
  v_position = viewPos.xyz;
}

// 片段着色器
precision mediump float;
varying vec3 v_normal;
varying vec3 v_position;
uniform vec3 u_lightPosition;  // 在视图空间中的光源位置

void main() {
  // 计算光线方向
  vec3 lightDir = normalize(u_lightPosition - v_position);
  
  // 计算光照强度（兰伯特定律）
  float intensity = max(dot(v_normal, lightDir), 0.0);
  
  // 应用光照
  vec3 color = vec3(1.0, 0.5, 0.2) * intensity;
  gl_FragColor = vec4(color, 1.0);
}`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">场景 4：碰撞检测</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          碰撞检测通常在世界空间中进行，需要计算物体之间的相对位置和距离。
        </p>
        <CodeBlock title="简单的球体碰撞检测" code={`// 计算两点间的距离
function distance(p1, p2) {
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  const dz = p2[2] - p1[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// 球体碰撞检测
function checkSphereCollision(sphere1, sphere2) {
  const dist = distance(sphere1.position, sphere2.position);
  const minDist = sphere1.radius + sphere2.radius;
  return dist < minDist;
}

// 使用示例
const player = { position: [0, 0, 0], radius: 0.5 };
const obstacle = { position: [2, 0, 0], radius: 1.0 };

if (checkSphereCollision(player, obstacle)) {
  console.log('碰撞！');
}`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">场景 5：UI 元素定位</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          在 3D 场景中显示 UI 元素（如血条、名字标签）需要使用正交投影和特殊的变换。
        </p>
        <CodeBlock title="3D 世界中的 UI 元素" code={`// 创建一个始终面向相机的 UI 元素（Billboard）
function createBillboardMatrix(worldPosition, cameraPosition) {
  // 计算朝向相机的方向
  const forward = normalize([
    cameraPosition[0] - worldPosition[0],
    cameraPosition[1] - worldPosition[1],
    cameraPosition[2] - worldPosition[2]
  ]);
  
  // 计算右向量（假设上方向为 [0, 1, 0]）
  const up = [0, 1, 0];
  const right = normalize(cross(forward, up));
  const correctedUp = normalize(cross(right, forward));
  
  // 构建旋转矩阵（使 UI 元素面向相机）
  const rotation = [
    right[0], correctedUp[0], -forward[0], 0,
    right[1], correctedUp[1], -forward[1], 0,
    right[2], correctedUp[2], -forward[2], 0,
    0, 0, 0, 1
  ];
  
  // 添加平移
  const translate = Matrix.translation(
    worldPosition[0],
    worldPosition[1],
    worldPosition[2]
  );
  
  return Matrix.multiply(translate, rotation);
}`} language="javascript" />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">最佳实践和常见错误</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          下面列出一些最佳实践和常见错误，帮助你避免常见问题。
        </p>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">最佳实践</h3>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">使用矩阵库</strong>：
            使用成熟的矩阵库（如 gl-matrix）可以避免很多错误，提高性能。
          </li>
          <li><strong className="text-primary font-semibold">预计算不变的部分</strong>：
            如果某些矩阵不变（如投影矩阵），应该预计算并缓存。
          </li>
          <li><strong className="text-primary font-semibold">统一坐标系统</strong>：
            在整个项目中统一使用左手或右手坐标系，避免混淆。
          </li>
          <li><strong className="text-primary font-semibold">使用法线矩阵</strong>：
            变换法线时一定要使用法线矩阵，而不是模型矩阵。
          </li>
          <li><strong className="text-primary font-semibold">检查矩阵有效性</strong>：
            在使用矩阵前检查其有效性（如行列式不为 0）。
          </li>
          <li><strong className="text-primary font-semibold">使用有意义的变量名</strong>：
            使用清晰的变量名（如 modelMatrix、viewMatrix）而不是 m1、m2。
          </li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">常见错误</h3>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">矩阵乘法顺序错误</strong>：
            记住矩阵乘法是从右到左应用的，顺序很重要！
            <CodeBlock title="错误示例" code={`// 错误：顺序错误
const mvp = Matrix.multiply(modelMatrix, Matrix.multiply(viewMatrix, projectionMatrix));

// 正确：P * V * M
const mvp = Matrix.multiply(projectionMatrix, Matrix.multiply(viewMatrix, modelMatrix));`} language="javascript" />
          </li>
          <li><strong className="text-primary font-semibold">忘记归一化向量</strong>：
            在使用向量进行点积或叉积计算前，应该归一化向量。
            <CodeBlock title="错误示例" code={`// 错误：未归一化
float intensity = dot(normal, lightDir);

// 正确：归一化后再计算
float intensity = dot(normalize(normal), normalize(lightDir));`} />
          </li>
          <li><strong className="text-primary font-semibold">使用模型矩阵变换法线</strong>：
            如果模型矩阵包含非均匀缩放，直接使用模型矩阵变换法线会导致错误。
            <CodeBlock title="错误示例" code={`// 错误：直接使用模型矩阵
vec3 normal = (u_modelMatrix * vec4(a_normal, 0.0)).xyz;

// 正确：使用法线矩阵
vec3 normal = normalize(u_normalMatrix * a_normal);`} />
          </li>
          <li><strong className="text-primary font-semibold">矩阵存储格式错误</strong>：
            WebGL 使用列主序存储矩阵，确保矩阵按正确格式存储。
          </li>
          <li><strong className="text-primary font-semibold">角度单位混淆</strong>：
            注意区分角度和弧度，JavaScript 的 Math.sin/cos 使用弧度。
            <CodeBlock title="错误示例" code={`// 错误：使用角度
const rotation = Matrix.rotationZ(45);

// 正确：使用弧度
const rotation = Matrix.rotationZ(Math.PI / 4);
// 或
const rotation = Matrix.rotationZ(45 * Math.PI / 180);`} language="javascript" />
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">关键概念总结</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          本章介绍了 3D 图形学的数学基础，以下是关键概念的总结：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">向量</strong>：
            <ul className="mt-2 pl-6">
              <li>表示方向和大小，是图形学的基础</li>
              <li>基本运算：加法、减法、标量乘法、点积、叉积</li>
              <li>点积用于计算角度、投影、光照</li>
              <li>叉积用于计算法线、构建坐标系</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">矩阵</strong>：
            <ul className="mt-2 pl-6">
              <li>用于表示变换（平移、旋转、缩放、投影）</li>
              <li>4x4 矩阵可以统一表示所有 3D 变换</li>
              <li>矩阵乘法用于组合多个变换，顺序很重要</li>
              <li>矩阵按列主序存储（WebGL 标准）</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">基本变换</strong>：
            <ul className="mt-2 pl-6">
              <li>平移：移动物体位置</li>
              <li>旋转：绕轴旋转物体（X、Y、Z 轴或任意轴）</li>
              <li>缩放：改变物体大小（均匀或非均匀）</li>
              <li>标准顺序：缩放 → 旋转 → 平移（SRT）</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">坐标系统</strong>：
            <ul className="mt-2 pl-6">
              <li>模型空间：物体自身的坐标系</li>
              <li>世界空间：场景的统一坐标系</li>
              <li>视图空间：以相机为原点的坐标系</li>
              <li>裁剪空间：投影后的坐标，范围 [-1, 1]</li>
              <li>屏幕空间：最终的像素坐标</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">MVP 矩阵</strong>：
            <ul className="mt-2 pl-6">
              <li>Model Matrix：模型空间 → 世界空间</li>
              <li>View Matrix：世界空间 → 视图空间</li>
              <li>Projection Matrix：视图空间 → 裁剪空间</li>
              <li>组合顺序：P * V * M（从右到左应用）</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">高级概念</strong>：
            <ul className="mt-2 pl-6">
              <li>逆矩阵：撤销变换</li>
              <li>转置矩阵：用于法线变换</li>
              <li>法线矩阵：transpose(inverse(modelMatrix))</li>
              <li>欧拉角：使用三个角度表示旋转（可能遇到万向锁）</li>
            </ul>
          </li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">学习建议</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>多动手实践，通过代码理解概念</li>
          <li>使用可视化工具观察变换效果</li>
          <li>理解每个变换的几何意义，而不只是记住公式</li>
          <li>注意矩阵乘法的顺序和坐标系统的一致性</li>
          <li>遇到问题时，先检查矩阵乘法的顺序和向量是否归一化</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          掌握这些数学基础后，你就可以开始创建复杂的 3D 场景和效果了！
        </p>
      </section>
      
      <ChapterNavigation />
    </div>
  )
}

