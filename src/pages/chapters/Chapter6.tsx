import WebGLCanvas from '../../components/WebGLCanvas'
import CodeBlock from '../../components/CodeBlock'
import FlipCard from '../../components/FlipCard'
import ChapterNavigation from '../../components/ChapterNavigation'
import { createProgram, createBuffer, setAttribute, Matrix, createIndexBuffer } from '../../utils/webgl'

export default function Chapter6() {
  return (
    <div className="w-full">
      <h1 className="text-4xl mb-8 text-primary border-b-2 border-dark-border dark:border-dark-border border-light-border pb-4">第六章：光照</h1>
      
      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">什么是光照？</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          光照（Lighting）是 3D 图形学中模拟光线与物体表面交互的过程。
          通过光照，我们可以让 3D 场景看起来更加真实，增加深度感和立体感。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">为什么需要光照？</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong>增加真实感</strong>：没有光照的物体看起来是平的，没有立体感</li>
          <li><strong>表现形状</strong>：光照帮助我们理解物体的形状和表面方向</li>
          <li><strong>创建氛围</strong>：不同的光照可以创建不同的氛围和情绪</li>
          <li><strong>突出重要元素</strong>：通过光照可以引导观众的注意力</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">基本的光照模型</strong>：
          基本的光照模型包括三种光照类型，它们组合起来可以产生真实的光照效果：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">环境光（Ambient Light）</strong>：
            <ul className="mt-2 pl-6">
              <li>模拟间接光照（光线在环境中多次反射）</li>
              <li>给所有物体一个基础亮度</li>
              <li>不依赖于光线方向或视角</li>
              <li>防止完全黑暗的区域</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">漫反射光（Diffuse Light）</strong>：
            <ul className="mt-2 pl-6">
              <li>模拟光线从表面均匀反射</li>
              <li>取决于光线方向与表面法线的夹角</li>
              <li>使用兰伯特定律（Lambert's Law）计算</li>
              <li>产生平滑的渐变效果</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">镜面反射光（Specular Light）</strong>：
            <ul className="mt-2 pl-6">
              <li>模拟高光反射（如金属、玻璃表面的亮点）</li>
              <li>取决于视角和反射方向</li>
              <li>产生明亮的高光点</li>
              <li>让表面看起来有光泽</li>
            </ul>
          </li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">光照计算的位置</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong>顶点着色器</strong>：可以计算每个顶点的光照（Gouraud 着色）</li>
          <li><strong>片段着色器</strong>：可以计算每个片段的光照（Phong 着色，更平滑）</li>
          <li><strong>推荐</strong>：在片段着色器中计算光照，效果更好</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">法线（Normal）</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          法线（Normal）是垂直于表面的向量，用于计算光照。
          法线是光照计算的基础，它决定了光线如何与表面交互。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">法线的作用</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>定义表面的方向（哪个方向是"上"）</li>
          <li>用于计算光线与表面的夹角</li>
          <li>用于计算反射方向</li>
          <li>用于背面剔除（判断三角形是否面向相机）</li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">计算法线</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          对于三角形，可以通过两条边的叉积计算法线。
        </p>
        <CodeBlock title="计算三角形法线" code={`// JavaScript 端：计算三角形法线
function calculateTriangleNormal(v0, v1, v2) {
  // 计算两条边向量
  const edge1 = [
    v1[0] - v0[0],
    v1[1] - v0[1],
    v1[2] - v0[2]
  ];
  
  const edge2 = [
    v2[0] - v0[0],
    v2[1] - v0[1],
    v2[2] - v0[2]
  ];
  
  // 计算叉积
  const normal = [
    edge1[1] * edge2[2] - edge1[2] * edge2[1],
    edge1[2] * edge2[0] - edge1[0] * edge2[2],
    edge1[0] * edge2[1] - edge1[1] * edge2[0]
  ];
  
  // 归一化
  const length = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1] + normal[2] * normal[2]);
  return [
    normal[0] / length,
    normal[1] / length,
    normal[2] / length
  ];
}

// 使用示例
const triangle = [
  [0, 0, 0],    // v0
  [1, 0, 0],    // v1
  [0, 1, 0]     // v2
];

const normal = calculateTriangleNormal(triangle[0], triangle[1], triangle[2]);
// 结果：normal = [0, 0, 1]（指向 Z 轴正方向）`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">顶点法线</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          对于每个顶点，通常需要计算其法线。如果顶点属于多个三角形，可以平均这些三角形的法线。
        </p>
        <CodeBlock title="计算顶点法线" code={`// 计算顶点法线（平均相邻三角形的法线）
function calculateVertexNormals(vertices, indices) {
  const normals = new Array(vertices.length / 3).fill(0).map(() => [0, 0, 0]);
  
  // 遍历所有三角形
  for (let i = 0; i < indices.length; i += 3) {
    const i0 = indices[i] * 3;
    const i1 = indices[i + 1] * 3;
    const i2 = indices[i + 2] * 3;
    
    const v0 = [vertices[i0], vertices[i0 + 1], vertices[i0 + 2]];
    const v1 = [vertices[i1], vertices[i1 + 1], vertices[i1 + 2]];
    const v2 = [vertices[i2], vertices[i2 + 1], vertices[i2 + 2]];
    
    // 计算三角形法线
    const triangleNormal = calculateTriangleNormal(v0, v1, v2);
    
    // 累加到顶点法线
    normals[indices[i]][0] += triangleNormal[0];
    normals[indices[i]][1] += triangleNormal[1];
    normals[indices[i]][2] += triangleNormal[2];
    
    normals[indices[i + 1]][0] += triangleNormal[0];
    normals[indices[i + 1]][1] += triangleNormal[1];
    normals[indices[i + 1]][2] += triangleNormal[2];
    
    normals[indices[i + 2]][0] += triangleNormal[0];
    normals[indices[i + 2]][1] += triangleNormal[1];
    normals[indices[i + 2]][2] += triangleNormal[2];
  }
  
  // 归一化所有顶点法线
  const normalizedNormals = [];
  for (let i = 0; i < normals.length; i++) {
    const n = normals[i];
    const length = Math.sqrt(n[0] * n[0] + n[1] * n[1] + n[2] * n[2]);
    if (length > 0.00001) {
      normalizedNormals.push(n[0] / length, n[1] / length, n[2] / length);
    } else {
      normalizedNormals.push(0, 1, 0);  // 默认法线
    }
  }
  
  return normalizedNormals;
}`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">法线变换</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          法线向量不能直接用模型矩阵变换。如果模型矩阵包含非均匀缩放，需要使用法线矩阵。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">为什么需要法线矩阵？</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>法线必须保持与表面的垂直关系</li>
          <li>如果模型矩阵包含非均匀缩放，直接变换法线会导致法线方向错误</li>
          <li>法线矩阵 = transpose(inverse(modelMatrix))</li>
          <li>如果模型矩阵只包含旋转和平移（没有缩放），可以直接使用模型矩阵</li>
        </ul>
        <CodeBlock title="法线变换" code={`// 顶点着色器：法线变换
attribute vec3 a_position;
attribute vec3 a_normal;

uniform mat4 u_modelMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_projectionMatrix;
uniform mat3 u_normalMatrix;  // 法线矩阵（3x3）

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

// JavaScript 端：计算法线矩阵
function calculateNormalMatrix(modelMatrix, viewMatrix) {
  // 计算模型视图矩阵
  const modelViewMatrix = multiplyMatrices(viewMatrix, modelMatrix);
  
  // 提取 3x3 部分
  const m = modelViewMatrix;
  const m3x3 = [
    m[0], m[1], m[2],
    m[4], m[5], m[6],
    m[8], m[9], m[10]
  ];
  
  // 计算逆矩阵（简化：假设是正交矩阵，逆矩阵等于转置）
  // 对于正交矩阵：inverse = transpose
  const normalMatrix = [
    m3x3[0], m3x3[3], m3x3[6],
    m3x3[1], m3x3[4], m3x3[7],
    m3x3[2], m3x3[5], m3x3[8]
  ];
  
  return normalMatrix;
}

// 注意：如果模型矩阵包含非均匀缩放，需要使用完整的逆矩阵计算`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">法线可视化</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          在调试时，可以可视化法线向量来检查法线是否正确。
        </p>
        <CodeBlock title="法线可视化" code={`// 在片段着色器中可视化法线
precision mediump float;
varying vec3 v_normal;

void main() {
  // 将法线从 [-1, 1] 映射到 [0, 1] 用于显示
  vec3 color = v_normal * 0.5 + 0.5;
  gl_FragColor = vec4(color, 1.0);
}

// 或者只显示法线的某个分量
void main() {
  // 只显示 Y 分量（绿色）
  gl_FragColor = vec4(0.0, v_normal.y * 0.5 + 0.5, 0.0, 1.0);
}`} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">环境光（Ambient Light）</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          环境光（Ambient Light）是最简单的光照类型，模拟间接光照（光线在环境中多次反射）。
          环境光给所有物体一个统一的亮度，不依赖于光线方向或视角。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">环境光的特点</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>所有表面接收相同强度的环境光</li>
          <li>不依赖于光线方向</li>
          <li>不依赖于视角</li>
          <li>防止完全黑暗的区域（即使没有直接光照）</li>
          <li>模拟间接光照（光线在环境中多次反射）</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">环境光的计算</strong>：
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          环境光强度 = 环境光颜色 × 材质颜色
        </p>
        <CodeBlock title="环境光计算" code={`precision mediump float;

uniform vec3 u_ambientColor;  // 环境光颜色和强度（如：vec3(0.2, 0.2, 0.2)）
uniform vec3 u_materialColor; // 材质颜色（如：vec3(1.0, 0.5, 0.0)）

void main() {
  // 环境光 = 环境光颜色 × 材质颜色
  vec3 ambient = u_ambientColor * u_materialColor;
  gl_FragColor = vec4(ambient, 1.0);
}

// 环境光强度通常较小（0.1 - 0.3）
// 太大会让场景看起来"平"，失去立体感
// 太小会让阴影区域完全黑暗`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">环境光的使用建议</h3>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">强度设置</strong>：
            <ul className="mt-2 pl-6">
              <li>通常设置为 0.1 到 0.3</li>
              <li>太大会让场景看起来"平"（失去立体感）</li>
              <li>太小会让阴影区域完全黑暗</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">颜色设置</strong>：
            <ul className="mt-2 pl-6">
              <li>通常使用白色或略微偏冷/暖的颜色</li>
              <li>可以模拟环境氛围（如：室内偏暖，室外偏冷）</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">与其他光照组合</strong>：
            <ul className="mt-2 pl-6">
              <li>环境光通常与其他光照类型组合使用</li>
              <li>单独使用环境光会让场景看起来很平</li>
            </ul>
          </li>
        </ul>
        
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
              uniform vec3 u_ambientColor;
              uniform vec3 u_materialColor;
              
              void main() {
                vec3 ambient = u_ambientColor * u_materialColor;
                gl_FragColor = vec4(ambient, 1.0);
              }
            `
            
            const program = createProgram(gl, vertexShader, fragmentShader)
            
            const positions = [
              -0.5, -0.5, 0,  0.5, -0.5, 0,  0.5, 0.5, 0,  -0.5, 0.5, 0,
            ]
            const indices = [0, 1, 2, 0, 2, 3]
            
            const positionBuffer = createBuffer(gl, positions)
            const indexBuffer = createIndexBuffer(gl, indices)
            
            const mvpMatrixLocation = gl.getUniformLocation(program, 'u_mvpMatrix')
            const ambientColorLocation = gl.getUniformLocation(program, 'u_ambientColor')
            const materialColorLocation = gl.getUniformLocation(program, 'u_materialColor')
            
            gl.viewport(0, 0, canvas.width, canvas.height)
            gl.enable(gl.DEPTH_TEST)
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
            gl.uniform3f(ambientColorLocation, 0.3, 0.3, 0.3)
            gl.uniform3f(materialColorLocation, 0.2, 0.6, 1.0)
            
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
          }}
          codeBlocks={[
            { title: '顶点着色器', code: `attribute vec3 a_position;
uniform mat4 u_mvpMatrix;

void main() {
  gl_Position = u_mvpMatrix * vec4(a_position, 1.0);
}` },
            { title: '片段着色器', code: `precision mediump float;
uniform vec3 u_ambientColor;
uniform vec3 u_materialColor;

void main() {
  vec3 ambient = u_ambientColor * u_materialColor;
  gl_FragColor = vec4(ambient, 1.0);
}` },
            { title: 'JavaScript 代码', code: `const program = createProgram(gl, vertexShader, fragmentShader)

const positions = [-0.5, -0.5, 0,  0.5, -0.5, 0,  0.5, 0.5, 0,  -0.5, 0.5, 0]
const indices = [0, 1, 2, 0, 2, 3]

const positionBuffer = createBuffer(gl, positions)
const indexBuffer = createIndexBuffer(gl, indices)

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
gl.uniform3f(ambientColorLocation, 0.3, 0.3, 0.3)
gl.uniform3f(materialColorLocation, 0.2, 0.6, 1.0)

gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)`, language: 'javascript' }
          ]}
        />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">漫反射光（Diffuse Light）</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          漫反射光（Diffuse Light）模拟光线从表面均匀反射。
          这是最常见的光照类型，让物体表面产生平滑的渐变效果。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">漫反射的特点</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>光线从表面均匀反射到所有方向</li>
          <li>光照强度取决于光线方向与表面法线的夹角</li>
          <li>表面朝向光源的部分更亮，背向光源的部分更暗</li>
          <li>产生平滑的渐变效果</li>
          <li>不依赖于视角（从任何角度看都一样）</li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">兰伯特定律（Lambert's Law）</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          漫反射光使用兰伯特定律计算。兰伯特定律描述了理想漫反射表面的光照强度。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">数学公式</strong>：
          <code className="bg-dark-bg dark:bg-dark-bg px-1 py-0.5 rounded">I = max(0, dot(N, L))</code>
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong>I</strong>：光照强度（0 到 1）</li>
          <li><strong>N</strong>：表面法线向量（归一化）</li>
          <li><strong>L</strong>：光线方向向量（归一化，从表面指向光源）</li>
          <li><strong>dot(N, L)</strong>：点积，等于 cos(θ)，其中 θ 是法线与光线方向的夹角</li>
          <li><strong>max(0, ...)</strong>：确保强度不为负（背面不受光照）</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">几何意义</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>当表面正对光源时（N 和 L 平行），dot(N, L) = 1，光照最强</li>
          <li>当表面垂直于光源时（N 和 L 垂直），dot(N, L) = 0，无光照</li>
          <li>当表面背对光源时（N 和 L 反向），dot(N, L) &lt; 0，被 max(0, ...) 限制为 0</li>
        </ul>
        
        <CodeBlock title="漫反射光计算" code={`precision mediump float;

uniform vec3 u_lightDirection;  // 光线方向（归一化，从表面指向光源）
uniform vec3 u_lightColor;      // 光线颜色和强度
uniform vec3 u_materialColor;   // 材质颜色
varying vec3 v_normal;          // 法线向量（从顶点着色器传递，已归一化）

void main() {
  // 归一化法线（确保是单位向量）
  vec3 normal = normalize(v_normal);
  
  // 计算光线方向（注意：方向取反，因为 u_lightDirection 是从光源指向表面）
  // 我们需要从表面指向光源的方向
  vec3 lightDir = normalize(-u_lightDirection);
  
  // 使用兰伯特定律计算光照强度
  // dot(normal, lightDir) = cos(θ)，其中 θ 是法线与光线方向的夹角
  float diff = max(dot(normal, lightDir), 0.0);
  
  // 漫反射光 = 光照强度 × 光线颜色 × 材质颜色
  vec3 diffuse = diff * u_lightColor * u_materialColor;
  
  gl_FragColor = vec4(diffuse, 1.0);
}

// 注意：
// - 法线和光线方向都必须归一化
// - 使用 max(0.0, ...) 确保强度不为负
// - 光线方向的定义：从表面指向光源（与 u_lightDirection 相反）`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">方向光源 vs 点光源</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          光源有两种主要类型：方向光源和点光源。
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">方向光源（Directional Light）</strong>：
            <ul className="mt-2 pl-6">
              <li>光线方向在所有位置都相同（如太阳光）</li>
              <li>使用方向向量表示</li>
              <li>计算简单，性能好</li>
              <li>适合模拟远距离光源（如太阳）</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">点光源（Point Light）</strong>：
            <ul className="mt-2 pl-6">
              <li>光线从光源位置发出，方向随位置变化</li>
              <li>使用光源位置和衰减函数</li>
              <li>计算稍复杂，但更真实</li>
              <li>适合模拟近距离光源（如灯泡）</li>
            </ul>
          </li>
        </ul>
        <CodeBlock title="方向光源 vs 点光源" code={`// 方向光源（Directional Light）
// 光线方向在所有位置都相同
uniform vec3 u_lightDirection;  // 光线方向（归一化）

void main() {
  vec3 lightDir = normalize(-u_lightDirection);  // 从表面指向光源
  float diff = max(dot(normal, lightDir), 0.0);
  // ...
}

// 点光源（Point Light）
// 光线方向从光源位置指向表面
uniform vec3 u_lightPosition;   // 光源位置（世界空间）
varying vec3 v_worldPosition;   // 表面位置（世界空间）

void main() {
  // 计算从表面指向光源的方向
  vec3 lightDir = normalize(u_lightPosition - v_worldPosition);
  
  // 计算距离（用于衰减）
  float distance = length(u_lightPosition - v_worldPosition);
  
  // 计算衰减（可选）
  float attenuation = 1.0 / (1.0 + 0.09 * distance + 0.032 * distance * distance);
  
  float diff = max(dot(normal, lightDir), 0.0);
  vec3 diffuse = diff * u_lightColor * u_materialColor * attenuation;
  // ...
}`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">漫反射光的视觉效果</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          漫反射光产生的视觉效果：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>表面朝向光源的部分更亮</li>
          <li>表面背向光源的部分更暗（可能完全黑暗）</li>
          <li>产生平滑的渐变效果</li>
          <li>帮助理解物体的形状和表面方向</li>
          <li>让物体看起来有立体感</li>
        </ul>
        
        <FlipCard 
          width={400} 
          height={400} 
          onInit={(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement) => {
            const vertexShader = `
              attribute vec3 a_position;
              attribute vec3 a_normal;
              uniform mat4 u_mvpMatrix;
              uniform mat4 u_normalMatrix;
              varying vec3 v_normal;
              
              void main() {
                gl_Position = u_mvpMatrix * vec4(a_position, 1.0);
                v_normal = normalize((u_normalMatrix * vec4(a_normal, 0.0)).xyz);
              }
            `
            
            const fragmentShader = `
              precision mediump float;
              uniform vec3 u_lightDirection;
              uniform vec3 u_lightColor;
              uniform vec3 u_materialColor;
              varying vec3 v_normal;
              
              void main() {
                vec3 normal = normalize(v_normal);
                vec3 lightDir = normalize(-u_lightDirection);
                
                float diff = max(dot(normal, lightDir), 0.0);
                vec3 diffuse = diff * u_lightColor * u_materialColor;
                
                gl_FragColor = vec4(diffuse, 1.0);
              }
            `
            
            const program = createProgram(gl, vertexShader, fragmentShader)
            
            // 立方体顶点和法线
            const positions = [
              -0.5, -0.5,  0.5,  0.5, -0.5,  0.5,  0.5,  0.5,  0.5,  -0.5,  0.5,  0.5,
              -0.5, -0.5, -0.5,  -0.5,  0.5, -0.5,  0.5,  0.5, -0.5,  0.5, -0.5, -0.5,
              -0.5,  0.5, -0.5,  -0.5,  0.5,  0.5,  0.5,  0.5,  0.5,  0.5,  0.5, -0.5,
              -0.5, -0.5, -0.5,  0.5, -0.5, -0.5,  0.5, -0.5,  0.5,  -0.5, -0.5,  0.5,
               0.5, -0.5, -0.5,  0.5,  0.5, -0.5,  0.5,  0.5,  0.5,  0.5, -0.5,  0.5,
              -0.5, -0.5, -0.5,  -0.5, -0.5,  0.5,  -0.5,  0.5,  0.5,  -0.5,  0.5, -0.5,
            ]
            
            const normals = [
              0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1,
              0, 0, -1,  0, 0, -1,  0, 0, -1,  0, 0, -1,
              0, 1, 0,  0, 1, 0,  0, 1, 0,  0, 1, 0,
              0, -1, 0,  0, -1, 0,  0, -1, 0,  0, -1, 0,
              1, 0, 0,  1, 0, 0,  1, 0, 0,  1, 0, 0,
              -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0,
            ]
            
            const indices = [
              0,  1,  2,   0,  2,  3,   4,  5,  6,   4,  6,  7,
              8,  9,  10,  8,  10, 11,  12, 13, 14,  12, 14, 15,
              16, 17, 18,  16, 18, 19,  20, 21, 22,  20, 22, 23,
            ]
            
            const positionBuffer = createBuffer(gl, positions)
            const normalBuffer = createBuffer(gl, normals)
            const indexBuffer = createIndexBuffer(gl, indices)
            
            const mvpMatrixLocation = gl.getUniformLocation(program, 'u_mvpMatrix')
            const normalMatrixLocation = gl.getUniformLocation(program, 'u_normalMatrix')
            const lightDirectionLocation = gl.getUniformLocation(program, 'u_lightDirection')
            const lightColorLocation = gl.getUniformLocation(program, 'u_lightColor')
            const materialColorLocation = gl.getUniformLocation(program, 'u_materialColor')
            
            gl.viewport(0, 0, canvas.width, canvas.height)
            gl.enable(gl.DEPTH_TEST)
            gl.clearColor(0.1, 0.1, 0.1, 1.0)
            
            const aspect = canvas.width / canvas.height
            const projectionMatrix = Matrix.perspective(Math.PI / 4, aspect, 0.1, 100)
            const viewMatrix = Matrix.lookAt(2, 2, 2, 0, 0, 0, 0, 1, 0)
            const modelMatrix = Matrix.identity()
            const mvpMatrix = Matrix.multiply(projectionMatrix, Matrix.multiply(viewMatrix, modelMatrix))
            const normalMatrix = viewMatrix  // 简化：假设模型矩阵是单位矩阵
            
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
            gl.useProgram(program)
            
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
            setAttribute(gl, program, 'a_position', 3)
            
            gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
            setAttribute(gl, program, 'a_normal', 3)
            
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
            
            gl.uniformMatrix4fv(mvpMatrixLocation, false, mvpMatrix)
            gl.uniformMatrix4fv(normalMatrixLocation, false, normalMatrix)
            gl.uniform3f(lightDirectionLocation, 1, 1, 1)
            gl.uniform3f(lightColorLocation, 1, 1, 1)
            gl.uniform3f(materialColorLocation, 0.2, 0.6, 1.0)
            
            gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0)
          }}
          codeBlocks={[
            { title: '顶点着色器', code: `attribute vec3 a_position;
attribute vec3 a_normal;
uniform mat4 u_mvpMatrix;
uniform mat4 u_normalMatrix;
varying vec3 v_normal;

void main() {
  gl_Position = u_mvpMatrix * vec4(a_position, 1.0);
  v_normal = normalize((u_normalMatrix * vec4(a_normal, 0.0)).xyz);
}` },
            { title: '片段着色器', code: `precision mediump float;
uniform vec3 u_lightDirection;
uniform vec3 u_lightColor;
uniform vec3 u_materialColor;
varying vec3 v_normal;

void main() {
  vec3 normal = normalize(v_normal);
  vec3 lightDir = normalize(-u_lightDirection);
  
  float diff = max(dot(normal, lightDir), 0.0);
  vec3 diffuse = diff * u_lightColor * u_materialColor;
  
  gl_FragColor = vec4(diffuse, 1.0);
}` },
            { title: 'JavaScript 代码', code: `const program = createProgram(gl, vertexShader, fragmentShader)

// 立方体顶点和法线
const positions = [/* 立方体顶点数据 */]
const normals = [/* 立方体法线数据 */]
const indices = [/* 立方体索引数据 */]

const positionBuffer = createBuffer(gl, positions)
const normalBuffer = createBuffer(gl, normals)
const indexBuffer = createIndexBuffer(gl, indices)

const aspect = canvas.width / canvas.height
const projectionMatrix = Matrix.perspective(Math.PI / 4, aspect, 0.1, 100)
const viewMatrix = Matrix.lookAt(2, 2, 2, 0, 0, 0, 0, 1, 0)
const modelMatrix = Matrix.identity()
const mvpMatrix = Matrix.multiply(projectionMatrix, Matrix.multiply(viewMatrix, modelMatrix))
const normalMatrix = viewMatrix

gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
gl.useProgram(program)

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
setAttribute(gl, program, 'a_position', 3)

gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
setAttribute(gl, program, 'a_normal', 3)

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)

gl.uniformMatrix4fv(mvpMatrixLocation, false, mvpMatrix)
gl.uniformMatrix4fv(normalMatrixLocation, false, normalMatrix)
gl.uniform3f(lightDirectionLocation, 1, 1, 1)
gl.uniform3f(lightColorLocation, 1, 1, 1)
gl.uniform3f(materialColorLocation, 0.2, 0.6, 1.0)

gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0)`, language: 'javascript' }
          ]}
        />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">镜面反射光（Specular Light）</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          镜面反射光（Specular Light）模拟高光反射，产生明亮的高光点。
          镜面反射让表面看起来有光泽，如金属、玻璃、塑料等材质。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">镜面反射的特点</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>产生明亮的高光点</li>
          <li>取决于视角和反射方向</li>
          <li>让表面看起来有光泽</li>
          <li>高光位置会随着视角改变而移动</li>
          <li>使用高光指数（Shininess）控制高光的大小和锐度</li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">Phong 镜面反射模型</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          Phong 镜面反射模型使用反射方向和视角方向计算高光强度。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">数学公式</strong>：
          <code className="bg-dark-bg dark:bg-dark-bg px-1 py-0.5 rounded">I = pow(max(0, dot(V, R)), shininess)</code>
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong>I</strong>：高光强度（0 到 1）</li>
          <li><strong>V</strong>：视角方向向量（从表面指向相机，归一化）</li>
          <li><strong>R</strong>：反射方向向量（光线反射后的方向，归一化）</li>
          <li><strong>shininess</strong>：高光指数（越大，高光越小越亮）</li>
          <li><strong>dot(V, R)</strong>：视角方向与反射方向的点积</li>
        </ul>
        <CodeBlock title="镜面反射光计算（Phong 模型）" code={`precision mediump float;

uniform vec3 u_lightDirection;  // 光线方向
uniform vec3 u_lightColor;       // 光线颜色
uniform vec3 u_viewPosition;     // 相机位置（世界空间）
uniform float u_shininess;       // 高光指数（通常 1-256）
varying vec3 v_normal;           // 法线向量
varying vec3 v_position;         // 表面位置（视图空间或世界空间）

void main() {
  vec3 normal = normalize(v_normal);
  vec3 lightDir = normalize(-u_lightDirection);
  
  // 计算反射方向
  vec3 reflectDir = reflect(-lightDir, normal);
  
  // 计算视角方向（从表面指向相机）
  vec3 viewDir = normalize(u_viewPosition - v_position);
  
  // 计算高光强度
  float spec = pow(max(dot(viewDir, reflectDir), 0.0), u_shininess);
  
  // 镜面反射光 = 高光强度 × 光线颜色
  vec3 specular = spec * u_lightColor;
  
  gl_FragColor = vec4(specular, 1.0);
}

// 高光指数（shininess）的影响：
// - 小值（如 8）：大而柔和的高光
// - 中等值（如 32）：中等大小的高光
// - 大值（如 128）：小而锐利的高光（如金属）`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">Blinn-Phong 镜面反射模型</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          Blinn-Phong 是 Phong 模型的改进版本，使用半角向量（Half Vector）代替反射向量，计算更高效。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">数学公式</strong>：
          <code className="bg-dark-bg dark:bg-dark-bg px-1 py-0.5 rounded">I = pow(max(0, dot(N, H)), shininess)</code>
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong>H</strong>：半角向量（Half Vector）= normalize(L + V)</li>
          <li><strong>N</strong>：法线向量</li>
          <li><strong>L</strong>：光线方向</li>
          <li><strong>V</strong>：视角方向</li>
        </ul>
        <CodeBlock title="Blinn-Phong 镜面反射" code={`precision mediump float;

uniform vec3 u_lightDirection;
uniform vec3 u_viewPosition;
uniform float u_shininess;
varying vec3 v_normal;
varying vec3 v_position;

void main() {
  vec3 normal = normalize(v_normal);
  vec3 lightDir = normalize(-u_lightDirection);
  vec3 viewDir = normalize(u_viewPosition - v_position);
  
  // 计算半角向量（Blinn-Phong 的关键）
  vec3 halfDir = normalize(lightDir + viewDir);
  
  // 计算高光强度（使用半角向量）
  float spec = pow(max(dot(normal, halfDir), 0.0), u_shininess);
  
  vec3 specular = spec * u_lightColor;
  gl_FragColor = vec4(specular, 1.0);
}

// Blinn-Phong vs Phong：
// - Blinn-Phong 计算更快（不需要 reflect 函数）
// - Blinn-Phong 的高光稍微不同，但通常更真实
// - 大多数现代引擎使用 Blinn-Phong`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">高光指数（Shininess）</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          高光指数控制高光的大小和锐度：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">小值（1-16）</strong>：大而柔和的高光，适合粗糙表面（如纸张、布料）</li>
          <li><strong className="text-primary font-semibold">中等值（32-64）</strong>：中等大小的高光，适合大多数材质（如塑料、木材）</li>
          <li><strong className="text-primary font-semibold">大值（128-256）</strong>：小而锐利的高光，适合光滑表面（如金属、玻璃）</li>
        </ul>
        <CodeBlock title="不同高光指数的效果" code={`// 不同材质的高光指数参考值
const materialShininess = {
  plastic: 32.0,      // 塑料
  metal: 128.0,       // 金属
  glass: 256.0,       // 玻璃
  wood: 8.0,          // 木材
  fabric: 4.0,        // 布料
  rubber: 16.0        // 橡胶
};

// 在着色器中使用
uniform float u_shininess;
float spec = pow(max(dot(normal, halfDir), 0.0), u_shininess);`} language="javascript" />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">Phong 光照模型</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          Phong 光照模型结合了环境光、漫反射光和镜面反射光，是最常用的光照模型之一。
          Phong 模型能够产生真实感的光照效果，包括高光反射。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">Phong 光照模型的三个组成部分</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">环境光（Ambient）</strong>：
            <ul className="mt-2 pl-6">
              <li>模拟间接光照，给所有表面一个基础亮度</li>
              <li>不依赖于光线方向或视角</li>
              <li>防止完全黑暗的区域</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">漫反射光（Diffuse）</strong>：
            <ul className="mt-2 pl-6">
              <li>使用兰伯特定律，取决于光线方向与表面法线的夹角</li>
              <li>产生平滑的渐变效果</li>
              <li>不依赖于视角</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">镜面反射光（Specular）</strong>：
            <ul className="mt-2 pl-6">
              <li>模拟高光反射，取决于视角和反射方向</li>
              <li>产生明亮的高光点</li>
              <li>让表面看起来有光泽</li>
            </ul>
          </li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">Phong 光照公式</strong>：
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          最终颜色 = 环境光 + 漫反射光 + 镜面反射光
        </p>
        
        <CodeBlock title="Phong 光照模型完整代码" code={`precision mediump float;

// ========== Uniform 变量 ==========
uniform vec3 u_ambientColor;      // 环境光颜色和强度（如：vec3(0.2, 0.2, 0.2)）
uniform vec3 u_lightDirection;    // 光线方向（归一化，从光源指向表面）
uniform vec3 u_lightColor;        // 光线颜色和强度（如：vec3(1.0, 1.0, 1.0)）
uniform vec3 u_viewPosition;      // 相机位置（世界空间）
uniform vec3 u_materialColor;     // 材质颜色（如：vec3(0.2, 0.6, 1.0)）
uniform float u_shininess;         // 高光指数（越大，高光越小越亮，通常 1-256）

// ========== Varying 变量 ==========
varying vec3 v_normal;            // 法线向量（视图空间或世界空间，已归一化）
varying vec3 v_position;           // 顶点位置（视图空间或世界空间）

void main() {
  // ========== 1. 准备向量 ==========
  // 归一化法线（确保是单位向量）
  vec3 normal = normalize(v_normal);
  
  // 计算光线方向（从表面指向光源）
  // 注意：u_lightDirection 是从光源指向表面，所以需要取反
  vec3 lightDir = normalize(-u_lightDirection);
  
  // ========== 2. 环境光 ==========
  // 环境光 = 环境光颜色 × 材质颜色
  vec3 ambient = u_ambientColor * u_materialColor;
  
  // ========== 3. 漫反射光 ==========
  // 使用兰伯特定律：I = max(0, dot(N, L))
  // dot(normal, lightDir) = cos(θ)，其中 θ 是法线与光线方向的夹角
  float diff = max(dot(normal, lightDir), 0.0);
  
  // 漫反射光 = 光照强度 × 光线颜色 × 材质颜色
  vec3 diffuse = diff * u_lightColor * u_materialColor;
  
  // ========== 4. 镜面反射光（Phong 模型）==========
  // 计算视图方向（从表面指向相机）
  vec3 viewDir = normalize(u_viewPosition - v_position);
  
  // 计算反射方向（光线反射后的方向）
  vec3 reflectDir = reflect(-lightDir, normal);
  
  // 计算高光强度：I = pow(max(0, dot(V, R)), shininess)
  // dot(viewDir, reflectDir) 越大，视角越接近反射方向，高光越强
  float spec = pow(max(dot(viewDir, reflectDir), 0.0), u_shininess);
  
  // 镜面反射光 = 高光强度 × 光线颜色
  vec3 specular = spec * u_lightColor;
  
  // ========== 5. 组合所有光照 ==========
  // 最终颜色 = 环境光 + 漫反射光 + 镜面反射光
  vec3 result = ambient + diffuse + specular;
  
  // 确保颜色值在有效范围内（可选，但推荐）
  result = clamp(result, 0.0, 1.0);
  
  gl_FragColor = vec4(result, 1.0);
}

// ========== Blinn-Phong 版本（推荐）==========
// Blinn-Phong 使用半角向量，计算更高效
void main() {
  vec3 normal = normalize(v_normal);
  vec3 lightDir = normalize(-u_lightDirection);
  vec3 viewDir = normalize(u_viewPosition - v_position);
  
  // 环境光
  vec3 ambient = u_ambientColor * u_materialColor;
  
  // 漫反射光
  float diff = max(dot(normal, lightDir), 0.0);
  vec3 diffuse = diff * u_lightColor * u_materialColor;
  
  // 镜面反射光（Blinn-Phong）
  vec3 halfDir = normalize(lightDir + viewDir);  // 半角向量
  float spec = pow(max(dot(normal, halfDir), 0.0), u_shininess);
  vec3 specular = spec * u_lightColor;
  
  vec3 result = ambient + diffuse + specular;
  gl_FragColor = vec4(result, 1.0);
}`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">完整的 Phong 光照示例</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          下面是一个完整的 Phong 光照示例，展示旋转的立方体：
        </p>
        
        <FlipCard 
          width={400} 
          height={400} 
          onInit={(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement) => {
            const vertexShader = `attribute vec3 a_position;
attribute vec3 a_normal;
uniform mat4 u_modelMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_projectionMatrix;
uniform mat4 u_normalMatrix;
varying vec3 v_normal;
varying vec3 v_position;

void main() {
  vec4 worldPos = u_modelMatrix * vec4(a_position, 1.0);
  vec4 viewPos = u_viewMatrix * worldPos;
  gl_Position = u_projectionMatrix * viewPos;
  v_normal = normalize((u_normalMatrix * vec4(a_normal, 0.0)).xyz);
  v_position = viewPos.xyz;
}`
            
            const fragmentShader = `precision mediump float;
uniform vec3 u_ambientColor;
uniform vec3 u_lightDirection;
uniform vec3 u_lightColor;
uniform vec3 u_materialColor;
uniform float u_shininess;
varying vec3 v_normal;
varying vec3 v_position;

void main() {
  vec3 normal = normalize(v_normal);
  vec3 lightDir = normalize(-u_lightDirection);
  vec3 ambient = u_ambientColor * u_materialColor;
  float diff = max(dot(normal, lightDir), 0.0);
  vec3 diffuse = diff * u_lightColor * u_materialColor;
  vec3 viewDir = normalize(-v_position);
  vec3 reflectDir = reflect(-lightDir, normal);
  float spec = pow(max(dot(viewDir, reflectDir), 0.0), u_shininess);
  vec3 specular = spec * u_lightColor;
  vec3 result = ambient + diffuse + specular;
  gl_FragColor = vec4(result, 1.0);
}`
            
            const program = createProgram(gl, vertexShader, fragmentShader)
            
            // 立方体顶点和法线
            const positions = [
              -0.5, -0.5,  0.5,  0.5, -0.5,  0.5,  0.5,  0.5,  0.5,  -0.5,  0.5,  0.5,
              -0.5, -0.5, -0.5,  -0.5,  0.5, -0.5,  0.5,  0.5, -0.5,  0.5, -0.5, -0.5,
              -0.5,  0.5, -0.5,  -0.5,  0.5,  0.5,  0.5,  0.5,  0.5,  0.5,  0.5, -0.5,
              -0.5, -0.5, -0.5,  0.5, -0.5, -0.5,  0.5, -0.5,  0.5,  -0.5, -0.5,  0.5,
               0.5, -0.5, -0.5,  0.5,  0.5, -0.5,  0.5,  0.5,  0.5,  0.5, -0.5,  0.5,
              -0.5, -0.5, -0.5,  -0.5, -0.5,  0.5,  -0.5,  0.5,  0.5,  -0.5,  0.5, -0.5,
            ]
            
            const normals = [
              0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1,
              0, 0, -1,  0, 0, -1,  0, 0, -1,  0, 0, -1,
              0, 1, 0,  0, 1, 0,  0, 1, 0,  0, 1, 0,
              0, -1, 0,  0, -1, 0,  0, -1, 0,  0, -1, 0,
              1, 0, 0,  1, 0, 0,  1, 0, 0,  1, 0, 0,
              -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0,
            ]
            
            const indices = [
              0,  1,  2,   0,  2,  3,   4,  5,  6,   4,  6,  7,
              8,  9,  10,  8,  10, 11,  12, 13, 14,  12, 14, 15,
              16, 17, 18,  16, 18, 19,  20, 21, 22,  20, 22, 23,
            ]
            
            const positionBuffer = createBuffer(gl, positions)
            const normalBuffer = createBuffer(gl, normals)
            const indexBuffer = createIndexBuffer(gl, indices)
            
            const modelMatrixLocation = gl.getUniformLocation(program, 'u_modelMatrix')
            const viewMatrixLocation = gl.getUniformLocation(program, 'u_viewMatrix')
            const projectionMatrixLocation = gl.getUniformLocation(program, 'u_projectionMatrix')
            const normalMatrixLocation = gl.getUniformLocation(program, 'u_normalMatrix')
            const ambientColorLocation = gl.getUniformLocation(program, 'u_ambientColor')
            const lightDirectionLocation = gl.getUniformLocation(program, 'u_lightDirection')
            const lightColorLocation = gl.getUniformLocation(program, 'u_lightColor')
            const materialColorLocation = gl.getUniformLocation(program, 'u_materialColor')
            const shininessLocation = gl.getUniformLocation(program, 'u_shininess')
            
            const positionLocation = gl.getAttribLocation(program, 'a_position')
            const normalLocation = gl.getAttribLocation(program, 'a_normal')
            
            if (positionLocation === -1 || normalLocation === -1) {
              console.error('属性未找到')
              return
            }
            
            gl.viewport(0, 0, canvas.width, canvas.height)
            gl.enable(gl.DEPTH_TEST)
            gl.clearColor(0.1, 0.1, 0.1, 1.0)
            
            const aspect = canvas.width / canvas.height
            const projectionMatrix = Matrix.perspective(Math.PI / 4, aspect, 0.1, 100)
            const viewMatrix = Matrix.lookAt(2, 2, 2, 0, 0, 0, 0, 1, 0)
            
            let angle = 0
            const render = () => {
              angle += 0.02
              
              // 模型矩阵：旋转立方体
              const modelMatrix = Matrix.multiply(
                Matrix.rotationY(angle),
                Matrix.rotationX(angle * 0.5)
              )
              
              // 法线矩阵（简化：假设没有缩放）
              const normalMatrix = viewMatrix
              
              gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
              gl.useProgram(program)
              
              gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
              gl.enableVertexAttribArray(positionLocation)
              gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0)
              
              gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
              gl.enableVertexAttribArray(normalLocation)
              gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0)
              
              gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
              
              gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix)
              gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix)
              gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix)
              gl.uniformMatrix4fv(normalMatrixLocation, false, normalMatrix)
              
              gl.uniform3f(ambientColorLocation, 0.2, 0.2, 0.2)
              gl.uniform3f(lightDirectionLocation, 1, 1, 1)
              gl.uniform3f(lightColorLocation, 1, 1, 1)
              gl.uniform3f(materialColorLocation, 0.2, 0.6, 1.0)
              gl.uniform1f(shininessLocation, 32.0)
              
              gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0)
              requestAnimationFrame(render)
            }
            render()
          }}
          codeBlocks={[
            { title: '顶点着色器', code: `attribute vec3 a_position;
attribute vec3 a_normal;
uniform mat4 u_modelMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_projectionMatrix;
uniform mat4 u_normalMatrix;
varying vec3 v_normal;
varying vec3 v_position;

void main() {
  vec4 worldPos = u_modelMatrix * vec4(a_position, 1.0);
  vec4 viewPos = u_viewMatrix * worldPos;
  gl_Position = u_projectionMatrix * viewPos;
  v_normal = normalize((u_normalMatrix * vec4(a_normal, 0.0)).xyz);
  v_position = viewPos.xyz;
}` },
            { title: '片段着色器', code: `precision mediump float;
uniform vec3 u_ambientColor;
uniform vec3 u_lightDirection;
uniform vec3 u_lightColor;
uniform vec3 u_materialColor;
uniform float u_shininess;
varying vec3 v_normal;
varying vec3 v_position;

void main() {
  vec3 normal = normalize(v_normal);
  vec3 lightDir = normalize(-u_lightDirection);
  vec3 ambient = u_ambientColor * u_materialColor;
  float diff = max(dot(normal, lightDir), 0.0);
  vec3 diffuse = diff * u_lightColor * u_materialColor;
  vec3 viewDir = normalize(-v_position);
  vec3 reflectDir = reflect(-lightDir, normal);
  float spec = pow(max(dot(viewDir, reflectDir), 0.0), u_shininess);
  vec3 specular = spec * u_lightColor;
  vec3 result = ambient + diffuse + specular;
  gl_FragColor = vec4(result, 1.0);
}` },
            { title: 'JavaScript 代码', code: `const program = createProgram(gl, vertexShader, fragmentShader)

// 立方体顶点和法线
const positions = [/* 立方体顶点数据 */]
const normals = [/* 立方体法线数据 */]
const indices = [/* 立方体索引数据 */]

const positionBuffer = createBuffer(gl, positions)
const normalBuffer = createBuffer(gl, normals)
const indexBuffer = createIndexBuffer(gl, indices)

const aspect = canvas.width / canvas.height
const projectionMatrix = Matrix.perspective(Math.PI / 4, aspect, 0.1, 100)
const viewMatrix = Matrix.lookAt(2, 2, 2, 0, 0, 0, 0, 1, 0)

let angle = 0
const render = () => {
  angle += 0.02
  
  const modelMatrix = Matrix.multiply(
    Matrix.rotationY(angle),
    Matrix.rotationX(angle * 0.5)
  )
  const normalMatrix = viewMatrix
  
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.useProgram(program)
  
  // 设置缓冲区和uniform
  gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix)
  gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix)
  gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix)
  gl.uniformMatrix4fv(normalMatrixLocation, false, normalMatrix)
  
  gl.uniform3f(ambientColorLocation, 0.2, 0.2, 0.2)
  gl.uniform3f(lightDirectionLocation, 1, 1, 1)
  gl.uniform3f(lightColorLocation, 1, 1, 1)
  gl.uniform3f(materialColorLocation, 0.2, 0.6, 1.0)
  gl.uniform1f(shininessLocation, 32.0)
  
  gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0)
  requestAnimationFrame(render)
}
render()`, language: 'javascript' }
          ]}
        />
        
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          注意观察立方体表面的高光效果。高光的位置会随着立方体的旋转而改变，这是因为高光取决于视角和光线方向。
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">多光源支持</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          在实际应用中，场景通常有多个光源。我们需要在着色器中支持多光源计算。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">实现方式</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>使用数组存储多个光源的属性</li>
          <li>在循环中计算每个光源的贡献</li>
          <li>累加所有光源的光照结果</li>
          <li>注意性能：每个光源都会增加计算量</li>
        </ul>
        <CodeBlock title="多光源 Phong 光照" code={`precision mediump float;

#define MAX_LIGHTS 4  // 最大光源数量

struct Light {
  vec3 direction;     // 光线方向
  vec3 color;         // 光线颜色
  float intensity;    // 光线强度
};

uniform Light u_lights[MAX_LIGHTS];  // 光源数组
uniform int u_lightCount;            // 实际光源数量
uniform vec3 u_ambientColor;
uniform vec3 u_materialColor;
uniform vec3 u_viewPosition;
uniform float u_shininess;

varying vec3 v_normal;
varying vec3 v_position;

void main() {
  vec3 normal = normalize(v_normal);
  vec3 viewDir = normalize(u_viewPosition - v_position);
  
  // 环境光（只计算一次）
  vec3 ambient = u_ambientColor * u_materialColor;
  
  // 初始化漫反射和镜面反射
  vec3 diffuse = vec3(0.0);
  vec3 specular = vec3(0.0);
  
  // 遍历所有光源
  for (int i = 0; i < MAX_LIGHTS; i++) {
    if (i >= u_lightCount) break;  // 只处理实际存在的光源
    
    vec3 lightDir = normalize(-u_lights[i].direction);
    
    // 漫反射光
    float diff = max(dot(normal, lightDir), 0.0);
    diffuse += diff * u_lights[i].color * u_lights[i].intensity * u_materialColor;
    
    // 镜面反射光（Blinn-Phong）
    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(normal, halfDir), 0.0), u_shininess);
    specular += spec * u_lights[i].color * u_lights[i].intensity;
  }
  
  // 组合所有光照
  vec3 result = ambient + diffuse + specular;
  gl_FragColor = vec4(result, 1.0);
}

// JavaScript 端：设置多光源
const lights = [
  { direction: [1, 1, 1], color: [1, 1, 1], intensity: 1.0 },
  { direction: [-1, 0.5, 0.5], color: [0.8, 0.8, 1.0], intensity: 0.5 },
];

// 设置光源数组
for (let i = 0; i < lights.length; i++) {
  gl.uniform3f(gl.getUniformLocation(program, 'u_lights[' + i + '].direction'), ...lights[i].direction);
  gl.uniform3f(gl.getUniformLocation(program, 'u_lights[' + i + '].color'), ...lights[i].color);
  gl.uniform1f(gl.getUniformLocation(program, 'u_lights[' + i + '].intensity'), lights[i].intensity);
}

gl.uniform1i(gl.getUniformLocation(program, 'u_lightCount'), lights.length);`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">性能优化建议</h3>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">限制光源数量</strong>：
            <ul className="mt-2 pl-6">
              <li>通常限制为 2-4 个光源</li>
              <li>使用最重要的光源（主光源 + 辅助光源）</li>
              <li>考虑使用光照贴图（Lightmap）代替动态光源</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">使用 Blinn-Phong</strong>：
            <ul className="mt-2 pl-6">
              <li>Blinn-Phong 比 Phong 计算更快</li>
              <li>效果相似，但性能更好</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">在顶点着色器中计算</strong>：
            <ul className="mt-2 pl-6">
              <li>如果性能是瓶颈，可以在顶点着色器中计算光照</li>
              <li>效果稍差（Gouraud 着色），但性能更好</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">使用光照贴图</strong>：
            <ul className="mt-2 pl-6">
              <li>对于静态场景，可以预计算光照并存储为纹理</li>
              <li>性能最好，但需要预处理</li>
            </ul>
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">点光源和衰减</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          点光源（Point Light）从特定位置发出光线，光线强度随距离衰减。
        </p>
        <CodeBlock title="点光源实现" code={`precision mediump float;

struct PointLight {
  vec3 position;      // 光源位置（世界空间）
  vec3 color;          // 光线颜色
  float intensity;     // 光线强度
  float constant;      // 常数衰减项
  float linear;        // 线性衰减项
  float quadratic;     // 二次衰减项
};

uniform PointLight u_pointLight;
uniform vec3 u_viewPosition;
uniform vec3 u_materialColor;
uniform float u_shininess;

varying vec3 v_normal;
varying vec3 v_worldPosition;  // 顶点位置（世界空间）

void main() {
  vec3 normal = normalize(v_normal);
  
  // 计算从表面指向光源的方向
  vec3 lightDir = normalize(u_pointLight.position - v_worldPosition);
  
  // 计算距离
  float distance = length(u_pointLight.position - v_worldPosition);
  
  // 计算衰减
  // attenuation = 1.0 / (constant + linear * distance + quadratic * distance^2)
  float attenuation = 1.0 / (
    u_pointLight.constant +
    u_pointLight.linear * distance +
    u_pointLight.quadratic * distance * distance
  );
  
  // 环境光（不受衰减影响）
  vec3 ambient = vec3(0.1) * u_materialColor;
  
  // 漫反射光（受衰减影响）
  float diff = max(dot(normal, lightDir), 0.0);
  vec3 diffuse = diff * u_pointLight.color * u_pointLight.intensity * u_materialColor * attenuation;
  
  // 镜面反射光（受衰减影响）
  vec3 viewDir = normalize(u_viewPosition - v_worldPosition);
  vec3 halfDir = normalize(lightDir + viewDir);
  float spec = pow(max(dot(normal, halfDir), 0.0), u_shininess);
  vec3 specular = spec * u_pointLight.color * u_pointLight.intensity * attenuation;
  
  vec3 result = ambient + diffuse + specular;
  gl_FragColor = vec4(result, 1.0);
}

// 衰减参数参考值（根据距离设置）
// 距离 7：constant=1.0, linear=0.7, quadratic=1.8
// 距离 13：constant=1.0, linear=0.35, quadratic=0.44
// 距离 20：constant=1.0, linear=0.22, quadratic=0.20
// 距离 32：constant=1.0, linear=0.14, quadratic=0.07
// 距离 50：constant=1.0, linear=0.09, quadratic=0.032
// 距离 65：constant=1.0, linear=0.07, quadratic=0.017
// 距离 100：constant=1.0, linear=0.045, quadratic=0.0075
// 距离 160：constant=1.0, linear=0.027, quadratic=0.0028
// 距离 200：constant=1.0, linear=0.022, quadratic=0.0019
// 距离 325：constant=1.0, linear=0.014, quadratic=0.0007
// 距离 600：constant=1.0, linear=0.007, quadratic=0.0002
// 距离 3250：constant=1.0, linear=0.0014, quadratic=0.000007`} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">常见问题和调试</h2>
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">问题 1：物体完全黑暗</h3>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">可能原因</strong>：
            <ul className="mt-2 pl-6">
              <li>法线方向错误（可能是背面）</li>
              <li>光线方向错误（应该是从表面指向光源）</li>
              <li>环境光强度太小</li>
              <li>材质颜色太暗</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">解决方法</strong>：
            <ul className="mt-2 pl-6">
              <li>检查法线是否正确归一化</li>
              <li>检查光线方向是否正确（可能需要取反）</li>
              <li>增加环境光强度</li>
              <li>可视化法线向量检查方向</li>
            </ul>
          </li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">问题 2：高光位置不对</h3>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">可能原因</strong>：
            <ul className="mt-2 pl-6">
              <li>视角方向计算错误</li>
              <li>反射方向计算错误</li>
              <li>法线矩阵错误</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">解决方法</strong>：
            <ul className="mt-2 pl-6">
              <li>确保视角方向是从表面指向相机</li>
              <li>检查反射方向计算（使用 reflect 函数）</li>
              <li>检查法线矩阵是否正确</li>
            </ul>
          </li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">问题 3：光照效果不连续</h3>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">可能原因</strong>：
            <ul className="mt-2 pl-6">
              <li>法线没有正确插值</li>
              <li>在顶点着色器中计算光照（应该在线段着色器中）</li>
              <li>法线没有归一化</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">解决方法</strong>：
            <ul className="mt-2 pl-6">
              <li>确保法线在片段着色器中归一化</li>
              <li>在片段着色器中计算光照（Phong 着色）</li>
              <li>检查法线是否正确传递到片段着色器</li>
            </ul>
          </li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">调试技巧</h3>
        <CodeBlock title="光照调试技巧" code={`// 1. 可视化法线
void main() {
  vec3 normal = normalize(v_normal);
  // 将法线从 [-1, 1] 映射到 [0, 1]
  vec3 color = normal * 0.5 + 0.5;
  gl_FragColor = vec4(color, 1.0);
}

// 2. 只显示环境光
void main() {
  vec3 ambient = u_ambientColor * u_materialColor;
  gl_FragColor = vec4(ambient, 1.0);
}

// 3. 只显示漫反射光
void main() {
  vec3 normal = normalize(v_normal);
  vec3 lightDir = normalize(-u_lightDirection);
  float diff = max(dot(normal, lightDir), 0.0);
  vec3 diffuse = diff * u_lightColor * u_materialColor;
  gl_FragColor = vec4(diffuse, 1.0);
}

// 4. 只显示镜面反射光
void main() {
  vec3 normal = normalize(v_normal);
  vec3 lightDir = normalize(-u_lightDirection);
  vec3 viewDir = normalize(u_viewPosition - v_position);
  vec3 halfDir = normalize(lightDir + viewDir);
  float spec = pow(max(dot(normal, halfDir), 0.0), u_shininess);
  vec3 specular = spec * u_lightColor;
  gl_FragColor = vec4(specular, 1.0);
}

// 5. 检查点积值
void main() {
  vec3 normal = normalize(v_normal);
  vec3 lightDir = normalize(-u_lightDirection);
  float dotProduct = dot(normal, lightDir);
  // 将点积值映射到颜色（-1 到 1 映射到 0 到 1）
  float color = dotProduct * 0.5 + 0.5;
  gl_FragColor = vec4(color, color, color, 1.0);
}`} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">关键概念总结</h2>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">环境光（Ambient Light）</strong>：
            <ul className="mt-2 pl-6">
              <li>模拟间接光照，给所有表面基础亮度</li>
              <li>不依赖于光线方向或视角</li>
              <li>计算公式：ambient = ambientColor × materialColor</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">漫反射光（Diffuse Light）</strong>：
            <ul className="mt-2 pl-6">
              <li>使用兰伯特定律：I = max(0, dot(N, L))</li>
              <li>取决于光线方向与法线的夹角</li>
              <li>产生平滑的渐变效果</li>
              <li>不依赖于视角</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">镜面反射光（Specular Light）</strong>：
            <ul className="mt-2 pl-6">
              <li>Phong 模型：I = pow(max(0, dot(V, R)), shininess)</li>
              <li>Blinn-Phong 模型：I = pow(max(0, dot(N, H)), shininess)（推荐）</li>
              <li>产生高光效果，让表面有光泽</li>
              <li>取决于视角和反射方向</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">法线（Normal）</strong>：
            <ul className="mt-2 pl-6">
              <li>垂直于表面的向量</li>
              <li>必须归一化</li>
              <li>需要使用法线矩阵变换（如果模型矩阵包含非均匀缩放）</li>
              <li>可以通过三角形边的叉积计算</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">Phong 光照模型</strong>：
            <ul className="mt-2 pl-6">
              <li>结合环境光、漫反射光和镜面反射光</li>
              <li>最终颜色 = 环境光 + 漫反射光 + 镜面反射光</li>
              <li>是最常用的光照模型之一</li>
              <li>推荐使用 Blinn-Phong 版本（性能更好）</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">光源类型</strong>：
            <ul className="mt-2 pl-6">
              <li>方向光源（Directional Light）：光线方向固定，适合远距离光源</li>
              <li>点光源（Point Light）：从位置发出，有衰减，适合近距离光源</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">性能优化</strong>：
            <ul className="mt-2 pl-6">
              <li>限制光源数量（通常 2-4 个）</li>
              <li>使用 Blinn-Phong 代替 Phong</li>
              <li>在片段着色器中计算光照（Phong 着色）</li>
              <li>考虑使用光照贴图（静态场景）</li>
            </ul>
          </li>
        </ul>
      </section>
      
      <ChapterNavigation />
    </div>
  )
}
