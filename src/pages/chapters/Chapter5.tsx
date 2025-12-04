import { useEffect, useRef } from 'react'
import WebGLCanvas from '../../components/WebGLCanvas'
import CodeBlock from '../../components/CodeBlock'
import ChapterNavigation from '../../components/ChapterNavigation'
import { createProgram, createBuffer, Matrix, createIndexBuffer } from '../../utils/webgl'

export default function Chapter5() {
  return (
    <div className="w-full">
      <h1 className="text-4xl mb-8 text-primary border-b-2 border-dark-border dark:border-dark-border border-light-border pb-4">第五章：相机与投影</h1>
      
      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">什么是相机？</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          在 3D 图形学中，相机（Camera）定义了观察场景的视角，就像现实世界中的摄像机一样。
          相机决定了我们从哪个角度、以什么方式观察 3D 场景。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">相机的核心作用</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>定义观察者的位置和朝向</li>
          <li>将 3D 场景转换为 2D 图像</li>
          <li>控制视野范围和投影方式</li>
          <li>决定哪些物体可见（视锥体裁剪）</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">相机的关键属性</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">位置（Position/Eye）</strong>：
            <ul className="mt-2 pl-6">
              <li>相机在世界空间中的位置，通常用 (x, y, z) 表示</li>
              <li>这是观察者的眼睛位置</li>
              <li>示例：相机在 (0, 0, 5) 表示相机在 Z 轴正方向 5 个单位处</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">目标（Target/Center）</strong>：
            <ul className="mt-2 pl-6">
              <li>相机看向的点，通常用 (x, y, z) 表示</li>
              <li>定义了相机的朝向</li>
              <li>示例：看向 (0, 0, 0) 表示相机看向原点</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">上方向（Up Vector）</strong>：
            <ul className="mt-2 pl-6">
              <li>定义相机的"上"方向，通常为 (0, 1, 0)</li>
              <li>用于确定相机的旋转（避免相机倒置）</li>
              <li>必须与相机朝向不平行</li>
            </ul>
          </li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">相机的坐标系</strong>：
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          在视图空间（相机空间）中：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>相机位于原点 (0, 0, 0)</li>
          <li>相机看向 -Z 方向（右手坐标系）</li>
          <li>Y 轴指向"上"方向</li>
          <li>X 轴指向"右"方向</li>
        </ul>
        <CodeBlock title="相机坐标系示意图" code={`// 视图空间（相机空间）坐标系
// 
//        Y (上)
//        |
//        |
//        +---- X (右)
//       /
//      /
//     Z (前，但相机看向 -Z)
//
// 在视图空间中：
// - 相机在原点 (0, 0, 0)
// - 相机看向 -Z 方向
// - Y 轴向上
// - X 轴向右

// 从世界空间到视图空间的变换由视图矩阵完成`} language="javascript" />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">视图矩阵（View Matrix）</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          视图矩阵（View Matrix）将顶点从世界空间转换到视图空间（相机空间）。
          视图矩阵实际上是相机变换的逆矩阵，它将世界坐标系变换到相机坐标系。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">视图矩阵的作用</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>将世界坐标系的原点移动到相机位置</li>
          <li>旋转坐标系，使相机看向 -Z 方向</li>
          <li>调整坐标轴方向，使 Y 轴向上</li>
          <li>结果是：在视图空间中，相机始终在原点，看向 -Z 方向</li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">lookAt 函数</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <code>lookAt</code> 函数是最常用的创建视图矩阵的方法。
          它根据相机位置、目标点和上方向向量计算视图矩阵。
        </p>
        <CodeBlock title="创建视图矩阵" code={`// lookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ)
// eye: 相机位置（在世界空间中）
// center: 相机看向的点（在世界空间中）
// up: 上方向向量（在世界空间中，通常为 (0, 1, 0)）

const viewMatrix = Matrix.lookAt(
  0, 0, 5,    // 相机位置 (0, 0, 5)
  0, 0, 0,    // 看向原点
  0, 1, 0     // 上方向 (0, 1, 0)
);

// 使用示例
const cameraPos = [0, 5, 10];
const targetPos = [0, 0, 0];
const upVector = [0, 1, 0];

const viewMatrix = Matrix.lookAt(
  cameraPos[0], cameraPos[1], cameraPos[2],
  targetPos[0], targetPos[1], targetPos[2],
  upVector[0], upVector[1], upVector[2]
);`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">lookAt 函数的数学原理</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <code>lookAt</code> 函数的实现原理：
        </p>
        <ol className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong>计算前方向量（Forward）</strong>：
            <code className="bg-dark-bg dark:bg-dark-bg px-1 py-0.5 rounded">forward = normalize(center - eye)</code>
            <ul className="mt-2 pl-6">
              <li>从相机位置指向目标点的向量</li>
              <li>归一化后得到单位向量</li>
            </ul>
          </li>
          <li><strong>计算右方向量（Right）</strong>：
            <code className="bg-dark-bg dark:bg-dark-bg px-1 py-0.5 rounded">right = normalize(cross(forward, up))</code>
            <ul className="mt-2 pl-6">
              <li>使用叉积计算垂直于 forward 和 up 的向量</li>
              <li>归一化后得到单位向量</li>
            </ul>
          </li>
          <li><strong>重新计算上方向量（Up）</strong>：
            <code className="bg-dark-bg dark:bg-dark-bg px-1 py-0.5 rounded">up = normalize(cross(right, forward))</code>
            <ul className="mt-2 pl-6">
              <li>确保三个向量互相垂直（正交）</li>
              <li>形成右手坐标系</li>
            </ul>
          </li>
          <li><strong>构建视图矩阵</strong>：
            <ul className="mt-2 pl-6">
              <li>前 3x3 部分：right、up、-forward（注意 forward 取负）</li>
              <li>第 4 列：相机位置的负值（平移的逆变换）</li>
            </ul>
          </li>
        </ol>
        <CodeBlock title="lookAt 函数的实现原理" code={`// lookAt 函数的实现原理（伪代码）
function lookAt(eye, center, up) {
  // 1. 计算前方向量
  let forward = normalize(center - eye);
  
  // 2. 计算右方向量
  let right = normalize(cross(forward, up));
  
  // 3. 重新计算上方向量（确保正交）
  let up = normalize(cross(right, forward));
  
  // 4. 构建视图矩阵
  // 视图矩阵 = 旋转矩阵的转置 * 平移矩阵的逆
  return [
    right.x,    up.x,    -forward.x,  0,
    right.y,    up.y,    -forward.y,  0,
    right.z,    up.z,    -forward.z,  0,
    -dot(right, eye),  -dot(up, eye),  dot(forward, eye),  1
  ];
}

// 注意：
// - forward 取负是因为相机看向 -Z 方向
// - 平移部分取负是因为这是逆变换`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">视图矩阵的性质</h3>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">正交矩阵</strong>：视图矩阵的前 3x3 部分是正交矩阵（行向量和列向量都是单位向量且互相垂直）</li>
          <li><strong className="text-primary font-semibold">逆矩阵等于转置</strong>：对于正交矩阵，逆矩阵等于转置矩阵</li>
          <li><strong className="text-primary font-semibold">行列式为 1</strong>：视图矩阵的行列式为 1（保持体积不变）</li>
          <li><strong className="text-primary font-semibold">不改变向量长度</strong>：视图矩阵不改变向量的长度和角度</li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">常见视图矩阵设置</h3>
        <CodeBlock title="常见视图矩阵设置" code={`// 1. 相机在原点上方，看向原点
const viewMatrix1 = Matrix.lookAt(
  0, 5, 0,    // 相机在上方
  0, 0, 0,    // 看向原点
  0, 1, 0     // 上方向
);

// 2. 相机在 Z 轴正方向，看向原点
const viewMatrix2 = Matrix.lookAt(
  0, 0, 5,    // 相机在 Z 轴正方向
  0, 0, 0,    // 看向原点
  0, 1, 0     // 上方向
);

// 3. 相机在斜上方，看向原点
const viewMatrix3 = Matrix.lookAt(
  3, 3, 3,    // 相机在斜上方
  0, 0, 0,    // 看向原点
  0, 1, 0     // 上方向
);

// 4. 相机跟随目标移动
const targetPos = [5, 0, 0];
const cameraOffset = [0, 2, 5];
const cameraPos = [
  targetPos[0] + cameraOffset[0],
  targetPos[1] + cameraOffset[1],
  targetPos[2] + cameraOffset[2]
];
const viewMatrix4 = Matrix.lookAt(
  cameraPos[0], cameraPos[1], cameraPos[2],
  targetPos[0], targetPos[1], targetPos[2],
  0, 1, 0
);`} language="javascript" />
        
        <WebGLCanvas width={400} height={400} onInit={(gl: WebGLRenderingContext, canvas: HTMLCanvasElement) => {
          const vertexShader = `attribute vec3 a_position;
uniform mat4 u_viewMatrix;
uniform mat4 u_projectionMatrix;

void main() {
  gl_Position = u_projectionMatrix * u_viewMatrix * vec4(a_position, 1.0);
}`
          
          const fragmentShader = `precision mediump float;
uniform vec4 u_color;

void main() {
  gl_FragColor = u_color;
}`
          
          const program = createProgram(gl, vertexShader, fragmentShader)
          
          // 创建一个立方体的顶点（简化版，只显示前面）
          const positions = [
            -0.5, -0.5, -0.5,
             0.5, -0.5, -0.5,
             0.5,  0.5, -0.5,
            -0.5,  0.5, -0.5,
          ]
          
          const indices = [0, 1, 2, 0, 2, 3]
          
          const positionBuffer = createBuffer(gl, positions)
          const indexBuffer = createIndexBuffer(gl, indices)
          
          const viewMatrixLocation = gl.getUniformLocation(program, 'u_viewMatrix')
          const projectionMatrixLocation = gl.getUniformLocation(program, 'u_projectionMatrix')
          const colorLocation = gl.getUniformLocation(program, 'u_color')
          const positionLocation = gl.getAttribLocation(program, 'a_position')
          
          if (positionLocation === -1) {
            console.error('属性 a_position 未找到')
            return
          }
          
          gl.viewport(0, 0, canvas.width, canvas.height)
          gl.enable(gl.DEPTH_TEST)
          gl.clearColor(0.1, 0.1, 0.1, 1.0)
          
          const aspect = canvas.width / canvas.height
          const projectionMatrix = Matrix.perspective(Math.PI / 4, aspect, 0.1, 100)
          
          let time = 0
          const render = () => {
            time += 0.01
            // 相机绕 Y 轴旋转
            const radius = 3
            const eyeX = Math.sin(time) * radius
            const eyeZ = Math.cos(time) * radius
            const viewMatrix = Matrix.lookAt(eyeX, 1, eyeZ, 0, 0, 0, 0, 1, 0)
            
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
            gl.useProgram(program)
            
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
            gl.enableVertexAttribArray(positionLocation)
            gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0)
            
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
            
            gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix)
            gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix)
            gl.uniform4f(colorLocation, 0.2, 0.6, 1.0, 1.0)
            
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
            requestAnimationFrame(render)
          }
          render()
        }} />
        
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          上面的示例展示了相机绕场景旋转的效果。注意观察视角的变化。
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">投影矩阵（Projection Matrix）</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          投影矩阵将 3D 场景投影到 2D 屏幕上。有两种主要的投影方式：
        </p>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">1. 透视投影（Perspective Projection）</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          透视投影模拟人眼的视觉效果，远处的物体看起来更小。这是最常用的投影方式，用于创建真实的 3D 视觉效果。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">透视投影的特点</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>远处的物体看起来更小（透视效果）</li>
          <li>平行线在远处会汇聚（消失点）</li>
          <li>更符合人眼的视觉习惯</li>
          <li>产生深度感</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">透视投影的参数</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">fov（Field of View）</strong>：视野角度
            <ul className="mt-2 pl-6">
              <li>通常用弧度表示，如 Math.PI / 4（45度）</li>
              <li>较大的 fov = 更宽的视野（鱼眼效果）</li>
              <li>较小的 fov = 更窄的视野（望远镜效果）</li>
              <li>常见值：30°（窄）、45°（正常）、60°（宽）、90°（超宽）</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">aspect</strong>：宽高比
            <ul className="mt-2 pl-6">
              <li>aspect = canvas.width / canvas.height</li>
              <li>必须匹配 canvas 的实际宽高比</li>
              <li>不匹配会导致图像拉伸变形</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">near</strong>：近裁剪平面距离
            <ul className="mt-2 pl-6">
              <li>距离相机最近的可视距离</li>
              <li>必须 &gt; 0</li>
              <li>太小的值可能导致精度问题（Z-fighting）</li>
              <li>常见值：0.1、0.01</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">far</strong>：远裁剪平面距离
            <ul className="mt-2 pl-6">
              <li>距离相机最远的可视距离</li>
              <li>必须 &gt; near</li>
              <li>太大的值可能导致精度问题</li>
              <li>常见值：100、1000、10000</li>
            </ul>
          </li>
        </ul>
        
        <CodeBlock title="透视投影矩阵" code={`// perspective(fov, aspect, near, far)
// fov: 视野角度（弧度）
// aspect: 宽高比（width / height）
// near: 近裁剪平面距离（必须 &gt; 0）
// far: 远裁剪平面距离（必须 &gt; near）

// 基本用法
const fov = Math.PI / 4;  // 45度
const aspect = canvas.width / canvas.height;
const near = 0.1;
const far = 100.0;

const projectionMatrix = Matrix.perspective(fov, aspect, near, far);

// 不同视野角度的效果
const narrowFOV = Matrix.perspective(Math.PI / 6, aspect, near, far);    // 30度（窄）
const normalFOV = Matrix.perspective(Math.PI / 4, aspect, near, far);     // 45度（正常）
const wideFOV = Matrix.perspective(Math.PI / 3, aspect, near, far);       // 60度（宽）
const ultraWideFOV = Matrix.perspective(Math.PI / 2, aspect, near, far);  // 90度（超宽）

// 注意：当窗口大小改变时，需要更新 aspect
function onResize(canvas) {
  const aspect = canvas.width / canvas.height;
  const projectionMatrix = Matrix.perspective(Math.PI / 4, aspect, 0.1, 100);
  // 更新 uniform...
}`} language="javascript" />
        
        <h4 className="text-xl my-6 text-dark-text dark:text-dark-text text-light-text">视锥体（Frustum）</h4>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          透视投影创建一个视锥体（Frustum），这是一个截头金字塔形状的空间。
          只有在这个空间内的物体才会被渲染。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">视锥体的结构</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong>近裁剪平面</strong>：距离相机 near 的平面（较小的矩形）</li>
          <li><strong>远裁剪平面</strong>：距离相机 far 的平面（较大的矩形）</li>
          <li><strong>视锥体</strong>：两个平面之间的空间</li>
          <li><strong>视野角度</strong>：决定视锥体的宽度</li>
        </ul>
        <CodeBlock title="视锥体示意图" code={`// 视锥体（Frustum）结构
//
//        远裁剪平面（far）
//        ┌─────────────┐
//       /               \\
//      /                 \\
//     /       视锥体       \\
//    /                     \\
//   /                       \\
//  └─────────────────────────┘
//  近裁剪平面（near）
//
// 只有在这个空间内的物体会被渲染
// 超出视锥体的物体会被裁剪掉`} language="javascript" />
        
        <h4 className="text-xl my-6 text-dark-text dark:text-dark-text text-light-text">透视投影的数学原理</h4>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          透视投影矩阵将视锥体内的 3D 点投影到近裁剪平面上，然后映射到 NDC 坐标（-1 到 1）。
        </p>
        <CodeBlock title="透视投影矩阵的数学公式" code={`// 透视投影矩阵的推导
// 
// 给定：fov（视野角度）、aspect（宽高比）、near、far
//
// 1. 计算近裁剪平面的高度和宽度
//    height = 2 * near * tan(fov / 2)
//    width = height * aspect
//
// 2. 构建投影矩阵
//    [f/aspect  0       0                   0        ]
//    [0          f       0                   0        ]
//    [0          0      (near+far)/(near-far)  -1    ]
//    [0          0      2*near*far/(near-far)  0     ]
//
//    其中 f = 1 / tan(fov / 2)
//
// 3. 透视除法
//    投影后，w 分量不等于 1，需要进行透视除法：
//    NDC.x = clipPos.x / clipPos.w
//    NDC.y = clipPos.y / clipPos.w
//    NDC.z = clipPos.z / clipPos.w
//
//    这产生了透视效果：远处的物体被"压缩"了`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">2. 正交投影（Orthographic Projection）</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          正交投影保持物体的实际大小，不受距离影响。平行线保持平行，不会汇聚。
          常用于 2D 渲染、技术图纸、等距视图等场景。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">正交投影的特点</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>物体大小不受距离影响（远处的物体和近处的物体看起来一样大）</li>
          <li>平行线保持平行（不会汇聚）</li>
          <li>没有透视效果</li>
          <li>适合 2D 游戏、UI、技术图纸</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">正交投影的参数</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">left, right</strong>：左右边界
            <ul className="mt-2 pl-6">
              <li>定义可见区域的左右边界</li>
              <li>right &gt; left</li>
              <li>示例：left = -10, right = 10 表示可见区域宽度为 20</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">bottom, top</strong>：上下边界
            <ul className="mt-2 pl-6">
              <li>定义可见区域的上下边界</li>
              <li>top &gt; bottom</li>
              <li>示例：bottom = -10, top = 10 表示可见区域高度为 20</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">near, far</strong>：近远裁剪平面
            <ul className="mt-2 pl-6">
              <li>定义深度范围</li>
              <li>far &gt; near</li>
              <li>注意：near 和 far 可以是负数</li>
            </ul>
          </li>
        </ul>
        
        <CodeBlock title="正交投影矩阵" code={`// ortho(left, right, bottom, top, near, far)

// 基本用法：对称的正交投影
const size = 10;
const projectionMatrix = Matrix.ortho(
  -size, size,    // left, right
  -size, size,    // bottom, top
  0.1, 100.0      // near, far
);

// 非对称的正交投影
const projectionMatrix2 = Matrix.ortho(
  -5, 15,         // left, right（不对称）
  -10, 10,        // bottom, top
  0.1, 100.0      // near, far
);

// 匹配 canvas 宽高比的正交投影
function createOrthoProjection(canvas, size) {
  const aspect = canvas.width / canvas.height;
  const left = -size * aspect;
  const right = size * aspect;
  const bottom = -size;
  const top = size;
  
  return Matrix.ortho(left, right, bottom, top, 0.1, 100.0);
}

// 2D 渲染常用的正交投影
function create2DProjection(canvas) {
  // 使用像素坐标
  return Matrix.ortho(
    0, canvas.width,      // left, right
    canvas.height, 0,     // bottom, top（注意：Y 轴向下）
    -1, 1                 // near, far（2D 不需要深度）
  );
}`} language="javascript" />
        
        <h4 className="text-xl my-6 text-dark-text dark:text-dark-text text-light-text">正交投影的视锥体</h4>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          正交投影创建一个矩形盒子（Box），而不是截头金字塔。
        </p>
        <CodeBlock title="正交投影视锥体" code={`// 正交投影的视锥体（实际上是一个矩形盒子）
//
//  远裁剪平面（far）
//  ┌─────────────┐
//  │             │
//  │             │
//  │   视锥体    │
//  │             │
//  │             │
//  └─────────────┘
//  近裁剪平面（near）
//
// 注意：近裁剪平面和远裁剪平面大小相同
// 没有透视效果`} language="javascript" />
        
        <h4 className="text-xl my-6 text-dark-text dark:text-dark-text text-light-text">正交投影的数学原理</h4>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          正交投影矩阵将矩形盒子内的 3D 点直接映射到 NDC 坐标，不进行透视除法。
        </p>
        <CodeBlock title="正交投影矩阵的数学公式" code={`// 正交投影矩阵的推导
//
// 给定：left, right, bottom, top, near, far
//
// 正交投影矩阵：
//    [2/(right-left)  0                0                  -(right+left)/(right-left)  ]
//    [0               2/(top-bottom)  0                  -(top+bottom)/(top-bottom)]
//    [0               0                -2/(far-near)      -(far+near)/(far-near)     ]
//    [0               0               0                  1                            ]
//
// 注意：
// - 没有透视除法（w 分量始终为 1）
// - 直接线性映射到 NDC 坐标
// - 不产生透视效果`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">透视投影 vs 正交投影对比</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          下面展示了两种投影方式的区别：
        </p>
        
        <WebGLCanvas width={400} height={400} onInit={(gl: WebGLRenderingContext, canvas: HTMLCanvasElement) => {
          const vertexShader = `attribute vec3 a_position;
uniform mat4 u_modelMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_projectionMatrix;

void main() {
  mat4 mvp = u_projectionMatrix * u_viewMatrix * u_modelMatrix;
  gl_Position = mvp * vec4(a_position, 1.0);
}`
          
          const fragmentShader = `precision mediump float;
uniform vec4 u_color;

void main() {
  gl_FragColor = u_color;
}`
          
          const program = createProgram(gl, vertexShader, fragmentShader)
          
          // 创建多个立方体（前后排列）
          const positions: number[] = []
          const indices: number[] = []
          const colors: number[] = []
          
          // 生成 3 个立方体，沿 Z 轴排列
          for (let i = 0; i < 3; i++) {
            const z = i * -1.5
            const base = i * 24
            
            // 立方体顶点
            const cubePositions = [
              -0.3, -0.3, z + 0.3,  0.3, -0.3, z + 0.3,  0.3,  0.3, z + 0.3,  -0.3,  0.3, z + 0.3,
              -0.3, -0.3, z - 0.3,  -0.3,  0.3, z - 0.3,  0.3,  0.3, z - 0.3,  0.3, -0.3, z - 0.3,
              -0.3,  0.3, z - 0.3,  -0.3,  0.3, z + 0.3,  0.3,  0.3, z + 0.3,  0.3,  0.3, z - 0.3,
              -0.3, -0.3, z - 0.3,  0.3, -0.3, z - 0.3,  0.3, -0.3, z + 0.3,  -0.3, -0.3, z + 0.3,
               0.3, -0.3, z - 0.3,  0.3,  0.3, z - 0.3,  0.3,  0.3, z + 0.3,  0.3, -0.3, z + 0.3,
              -0.3, -0.3, z - 0.3,  -0.3, -0.3, z + 0.3,  -0.3,  0.3, z + 0.3,  -0.3,  0.3, z - 0.3,
            ]
            
            positions.push(...cubePositions)
            
            // 立方体索引
            const cubeIndices = [
              base + 0, base + 1, base + 2, base + 0, base + 2, base + 3,
              base + 4, base + 5, base + 6, base + 4, base + 6, base + 7,
              base + 8, base + 9, base + 10, base + 8, base + 10, base + 11,
              base + 12, base + 13, base + 14, base + 12, base + 14, base + 15,
              base + 16, base + 17, base + 18, base + 16, base + 18, base + 19,
              base + 20, base + 21, base + 22, base + 20, base + 22, base + 23,
            ]
            
            indices.push(...cubeIndices)
          }
          
          const positionBuffer = createBuffer(gl, positions)
          const indexBuffer = createIndexBuffer(gl, indices)
          
          const modelMatrixLocation = gl.getUniformLocation(program, 'u_modelMatrix')
          const viewMatrixLocation = gl.getUniformLocation(program, 'u_viewMatrix')
          const projectionMatrixLocation = gl.getUniformLocation(program, 'u_projectionMatrix')
          const colorLocation = gl.getUniformLocation(program, 'u_color')
          const positionLocation = gl.getAttribLocation(program, 'a_position')
          
          if (positionLocation === -1) {
            console.error('属性 a_position 未找到')
            return
          }
          
          gl.viewport(0, 0, canvas.width, canvas.height)
          gl.enable(gl.DEPTH_TEST)
          gl.clearColor(0.1, 0.1, 0.1, 1.0)
          
          const aspect = canvas.width / canvas.height
          const viewMatrix = Matrix.lookAt(0, 0, 3, 0, 0, 0, 0, 1, 0)
          const modelMatrix = Matrix.identity()
          
          let time = 0
          const render = () => {
            time += 0.01
            
            // 切换投影模式
            const usePerspective = (Math.sin(time) + 1) / 2 > 0.5
            const projectionMatrix = usePerspective
              ? Matrix.perspective(Math.PI / 4, aspect, 0.1, 100)
              : Matrix.ortho(-2, 2, -2, 2, 0.1, 100)
            
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
            gl.useProgram(program)
            
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
            gl.enableVertexAttribArray(positionLocation)
            gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0)
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
            
            gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix)
            gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix)
            gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix)
            
            // 绘制三个立方体，使用不同颜色
            const cubeColors = [
              [1.0, 0.2, 0.2, 1.0],  // 红色（最近）
              [0.2, 1.0, 0.2, 1.0],  // 绿色（中间）
              [0.2, 0.2, 1.0, 1.0]   // 蓝色（最远）
            ]
            
            for (let i = 0; i < 3; i++) {
              gl.uniform4f(colorLocation, cubeColors[i][0], cubeColors[i][1], cubeColors[i][2], cubeColors[i][3])
              gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, i * 36 * 2)
            }
            
            requestAnimationFrame(render)
          }
          render()
        }} />
        
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          注意观察：在透视投影中，远处的立方体看起来更小；在正交投影中，所有立方体保持相同大小。
        </p>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">选择投影方式</h3>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">使用透视投影</strong>：
            <ul className="mt-2 pl-6">
              <li>3D 游戏和可视化</li>
              <li>需要真实感的场景</li>
              <li>模拟人眼视觉效果</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">使用正交投影</strong>：
            <ul className="mt-2 pl-6">
              <li>2D 游戏和 UI</li>
              <li>技术图纸和 CAD</li>
              <li>等距视图（Isometric View）</li>
            </ul>
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">完整的 MVP 示例</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          下面是一个完整的示例，展示如何使用模型矩阵、视图矩阵和投影矩阵：
        </p>
        
        <WebGLCanvas width={400} height={400} onInit={(gl: WebGLRenderingContext, canvas: HTMLCanvasElement) => {
          const vertexShader = `attribute vec3 a_position;
uniform mat4 u_modelMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_projectionMatrix;

void main() {
  mat4 mvp = u_projectionMatrix * u_viewMatrix * u_modelMatrix;
  gl_Position = mvp * vec4(a_position, 1.0);
}`
          
          const fragmentShader = `precision mediump float;
uniform vec4 u_color;

void main() {
  gl_FragColor = u_color;
}`
          
          const program = createProgram(gl, vertexShader, fragmentShader)
          
          // 立方体顶点
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
            -0.5, -0.5, -0.5,  -0.5, -0.5,  0.5,  -0.5,  0.5,  0.5,  -0.5,  0.5, -0.5,
          ]
          
          const indices = [
            0,  1,  2,   0,  2,  3,    // 前面
            4,  5,  6,   4,  6,  7,    // 后面
            8,  9,  10,  8,  10, 11,   // 上面
            12, 13, 14,  12, 14, 15,   // 下面
            16, 17, 18,  16, 18, 19,   // 右面
            20, 21, 22,  20, 22, 23,   // 左面
          ]
          
          const positionBuffer = createBuffer(gl, positions)
          const indexBuffer = createIndexBuffer(gl, indices)
          
          const modelMatrixLocation = gl.getUniformLocation(program, 'u_modelMatrix')
          const viewMatrixLocation = gl.getUniformLocation(program, 'u_viewMatrix')
          const projectionMatrixLocation = gl.getUniformLocation(program, 'u_projectionMatrix')
          const colorLocation = gl.getUniformLocation(program, 'u_color')
          const positionLocation = gl.getAttribLocation(program, 'a_position')
          
          if (positionLocation === -1) {
            console.error('属性 a_position 未找到')
            return
          }
          
          gl.viewport(0, 0, canvas.width, canvas.height)
          gl.enable(gl.DEPTH_TEST)
          gl.clearColor(0.1, 0.1, 0.1, 1.0)
          
          const aspect = canvas.width / canvas.height
          const projectionMatrix = Matrix.perspective(Math.PI / 4, aspect, 0.1, 100)
          const viewMatrix = Matrix.lookAt(0, 0, 3, 0, 0, 0, 0, 1, 0)
          
          let angle = 0
          const render = () => {
            angle += 0.02
            
            // 模型矩阵：旋转立方体
            const modelMatrix = Matrix.rotationY(angle)
            
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
            gl.useProgram(program)
            
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
            gl.enableVertexAttribArray(positionLocation)
            gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0)
            
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
            
            gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix)
            gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix)
            gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix)
            gl.uniform4f(colorLocation, 0.2, 0.6, 1.0, 1.0)
            
            gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0)
            requestAnimationFrame(render)
          }
          render()
        }} />
        
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          这个示例展示了完整的 MVP 矩阵变换：立方体绕 Y 轴旋转（模型矩阵），相机固定观察（视图矩阵），使用透视投影（投影矩阵）。
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">相机控制</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          在实际应用中，我们通常需要控制相机的位置和方向。不同的应用场景需要不同的相机控制方式。
          理解这些相机类型对于创建交互式 3D 应用非常重要。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">常见的相机控制方式</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">轨道相机（Orbit Camera）</strong>：
            <ul className="mt-2 pl-6">
              <li>相机围绕目标点旋转</li>
              <li>常用于 3D 模型查看器、产品展示</li>
              <li>用户可以通过鼠标拖动旋转相机</li>
              <li>通过滚轮缩放（改变距离）</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">第一人称相机（FPS Camera）</strong>：
            <ul className="mt-2 pl-6">
              <li>相机可以自由移动和旋转</li>
              <li>常用于第一人称游戏、虚拟漫游</li>
              <li>使用 WASD 移动，鼠标旋转视角</li>
              <li>模拟人眼的移动方式</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">固定相机</strong>：
            <ul className="mt-2 pl-6">
              <li>相机位置和方向固定</li>
              <li>常用于固定视角的场景、过场动画</li>
              <li>最简单的相机类型</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">跟随相机（Follow Camera）</strong>：
            <ul className="mt-2 pl-6">
              <li>相机跟随目标物体移动</li>
              <li>常用于第三人称游戏、车辆跟随</li>
              <li>相机保持相对位置和角度</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">第三人称相机（Third-Person Camera）</strong>：
            <ul className="mt-2 pl-6">
              <li>相机跟随角色，但保持一定距离和角度</li>
              <li>常用于第三人称游戏</li>
              <li>可以处理障碍物遮挡</li>
            </ul>
          </li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">1. 轨道相机（Orbit Camera）</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          轨道相机使用球坐标系，相机围绕目标点旋转。非常适合查看 3D 模型。
        </p>
        
        <CodeBlock title="轨道相机实现" code={`class OrbitCamera {
  constructor(targetX, targetY, targetZ) {
    this.target = { x: targetX, y: targetY, z: targetZ };
    this.radius = 5.0;      // 距离目标的距离
    this.theta = 0.0;        // 水平角度（绕 Y 轴）
    this.phi = Math.PI / 4;  // 垂直角度（从上方看）
  }
  
  // 更新相机位置
  update() {
    // 球坐标系转笛卡尔坐标系
    const x = this.radius * Math.sin(this.phi) * Math.cos(this.theta);
    const y = this.radius * Math.cos(this.phi);
    const z = this.radius * Math.sin(this.phi) * Math.sin(this.theta);
    
    const eyeX = this.target.x + x;
    const eyeY = this.target.y + y;
    const eyeZ = this.target.z + z;
    
    return Matrix.lookAt(
      eyeX, eyeY, eyeZ,
      this.target.x, this.target.y, this.target.z,
      0, 1, 0
    );
  }
  
  // 旋转相机
  rotate(deltaTheta, deltaPhi) {
    this.theta += deltaTheta;
    this.phi = Math.max(0.1, Math.min(Math.PI - 0.1, this.phi + deltaPhi));
  }
  
  // 缩放（改变距离）
  zoom(delta) {
    this.radius = Math.max(1.0, Math.min(20.0, this.radius + delta));
  }
}

// 使用示例
const camera = new OrbitCamera(0, 0, 0);
camera.rotate(0.01, 0);  // 水平旋转
const viewMatrix = camera.update();`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">2. 第一人称相机（FPS Camera）</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          第一人称相机可以自由移动和旋转，常用于第一人称游戏、虚拟漫游等场景。
          这种相机模拟人眼的移动方式，可以自由地在场景中移动。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">第一人称相机的特点</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>相机位置可以自由移动</li>
          <li>视角可以自由旋转（yaw 和 pitch）</li>
          <li>通常限制 pitch 角度范围，避免万向锁</li>
          <li>移动方向相对于相机朝向</li>
        </ul>
        
        <CodeBlock title="第一人称相机实现" code={`class FPSCamera {
  constructor(x, y, z) {
    this.position = { x, y, z };
    this.yaw = 0;      // 左右旋转（绕 Y 轴，弧度）
    this.pitch = 0;    // 上下旋转（绕 X 轴，弧度）
    this.speed = 0.1;  // 移动速度
    this.rotationSpeed = 0.01;  // 旋转速度
  }
  
  // 更新视图矩阵
  update() {
    // 计算前方向量（基于 yaw 和 pitch）
    const forwardX = Math.sin(this.yaw) * Math.cos(this.pitch);
    const forwardY = -Math.sin(this.pitch);
    const forwardZ = -Math.cos(this.yaw) * Math.cos(this.pitch);
    
    // 计算目标点（相机位置 + 前方向量）
    const targetX = this.position.x + forwardX;
    const targetY = this.position.y + forwardY;
    const targetZ = this.position.z + forwardZ;
    
    return Matrix.lookAt(
      this.position.x, this.position.y, this.position.z,
      targetX, targetY, targetZ,
      0, 1, 0
    );
  }
  
  // 移动（相对于相机朝向）
  move(forward, right, up) {
    // 计算前方向量（只考虑 yaw，不考虑 pitch）
    const forwardX = Math.sin(this.yaw);
    const forwardZ = -Math.cos(this.yaw);
    
    // 计算右方向量（前方向量绕 Y 轴旋转 90 度）
    const rightX = Math.cos(this.yaw);
    const rightZ = Math.sin(this.yaw);
    
    // 移动
    this.position.x += forwardX * forward * this.speed + rightX * right * this.speed;
    this.position.y += up * this.speed;
    this.position.z += forwardZ * forward * this.speed + rightZ * right * this.speed;
  }
  
  // 旋转
  rotate(deltaYaw, deltaPitch) {
    this.yaw += deltaYaw * this.rotationSpeed;
    // 限制 pitch 角度，避免万向锁
    this.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.pitch + deltaPitch * this.rotationSpeed));
  }
  
  // 设置位置
  setPosition(x, y, z) {
    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
  }
  
  // 获取前方向量
  getForward() {
    return {
      x: Math.sin(this.yaw) * Math.cos(this.pitch),
      y: -Math.sin(this.pitch),
      z: -Math.cos(this.yaw) * Math.cos(this.pitch)
    };
  }
}

// 使用示例
const camera = new FPSCamera(0, 0, 5);

// 键盘控制
document.addEventListener('keydown', (e) => {
  switch(e.key) {
    case 'w': camera.move(1, 0, 0); break;   // 向前
    case 's': camera.move(-1, 0, 0); break;  // 向后
    case 'a': camera.move(0, -1, 0); break;  // 向左
    case 'd': camera.move(0, 1, 0); break;   // 向右
    case ' ': camera.move(0, 0, 1); break;   // 向上
  }
});

// 鼠标控制
let lastMouseX = 0;
let lastMouseY = 0;
document.addEventListener('mousemove', (e) => {
  const deltaX = e.clientX - lastMouseX;
  const deltaY = e.clientY - lastMouseY;
  camera.rotate(deltaX, deltaY);
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
});

// 更新视图矩阵
const viewMatrix = camera.update();`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">3. 跟随相机（Follow Camera）</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          跟随相机跟随目标物体移动，常用于第三人称游戏、车辆跟随等场景。
        </p>
        <CodeBlock title="跟随相机实现" code={`class FollowCamera {
  constructor(target) {
    this.target = target;  // 目标对象 { x, y, z }
    this.offset = { x: 0, y: 2, z: 5 };  // 相对偏移
    this.rotation = { yaw: 0, pitch: Math.PI / 6 };  // 相机角度
  }
  
  // 更新视图矩阵
  update() {
    // 计算相机位置（目标位置 + 偏移）
    const eyeX = this.target.x + this.offset.x;
    const eyeY = this.target.y + this.offset.y;
    const eyeZ = this.target.z + this.offset.z;
    
    // 相机看向目标
    return Matrix.lookAt(
      eyeX, eyeY, eyeZ,
      this.target.x, this.target.y, this.target.z,
      0, 1, 0
    );
  }
  
  // 平滑跟随（使用插值）
  smoothFollow(target, smoothing = 0.1) {
    this.target.x += (target.x - this.target.x) * smoothing;
    this.target.y += (target.y - this.target.y) * smoothing;
    this.target.z += (target.z - this.target.z) * smoothing;
  }
  
  // 设置偏移
  setOffset(x, y, z) {
    this.offset.x = x;
    this.offset.y = y;
    this.offset.z = z;
  }
}

// 使用示例
const player = { x: 0, y: 0, z: 0 };
const camera = new FollowCamera(player);

// 玩家移动
player.x += 0.1;

// 相机跟随
camera.smoothFollow(player, 0.1);
const viewMatrix = camera.update();`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">4. 第三人称相机（Third-Person Camera）</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          第三人称相机是跟随相机的增强版本，可以处理障碍物遮挡、平滑插值等。
        </p>
        <CodeBlock title="第三人称相机实现" code={`class ThirdPersonCamera {
  constructor(target) {
    this.target = target;
    this.distance = 5.0;      // 距离目标的距离
    this.height = 2.0;        // 相机高度偏移
    this.angle = 0.0;         // 绕目标旋转的角度
    this.pitch = Math.PI / 6; // 俯仰角
    this.smoothness = 0.1;    // 平滑系数
    this.currentPosition = { x: 0, y: 0, z: 0 };
  }
  
  update() {
    // 计算目标相机位置（球坐标系）
    const targetX = this.target.x + this.distance * Math.sin(this.angle) * Math.cos(this.pitch);
    const targetY = this.target.y + this.height + this.distance * Math.sin(this.pitch);
    const targetZ = this.target.z + this.distance * Math.cos(this.angle) * Math.cos(this.pitch);
    
    // 平滑插值到目标位置
    this.currentPosition.x += (targetX - this.currentPosition.x) * this.smoothness;
    this.currentPosition.y += (targetY - this.currentPosition.y) * this.smoothness;
    this.currentPosition.z += (targetZ - this.currentPosition.z) * this.smoothness;
    
    // 相机看向目标（稍微向上）
    const lookAtY = this.target.y + this.height * 0.5;
    
    return Matrix.lookAt(
      this.currentPosition.x, this.currentPosition.y, this.currentPosition.z,
      this.target.x, lookAtY, this.target.z,
      0, 1, 0
    );
  }
  
  // 旋转相机（绕目标）
  rotate(deltaAngle) {
    this.angle += deltaAngle;
  }
  
  // 调整距离
  zoom(delta) {
    this.distance = Math.max(2.0, Math.min(10.0, this.distance + delta));
  }
  
  // 调整俯仰角
  adjustPitch(delta) {
    this.pitch = Math.max(0.1, Math.min(Math.PI / 2 - 0.1, this.pitch + delta));
  }
}

// 使用示例
const player = { x: 0, y: 0, z: 0 };
const camera = new ThirdPersonCamera(player);

// 鼠标控制
canvas.addEventListener('mousemove', (e) => {
  camera.rotate(e.movementX * 0.01);
  camera.adjustPitch(-e.movementY * 0.01);
});

// 滚轮缩放
canvas.addEventListener('wheel', (e) => {
  camera.zoom(e.deltaY * 0.01);
});

const viewMatrix = camera.update();`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">5. 相机平滑插值</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          在实际应用中，相机的移动和旋转应该平滑过渡，而不是突然跳跃。
          可以使用插值函数实现平滑的相机动画。
        </p>
        <CodeBlock title="相机平滑插值" code={`class SmoothCamera {
  constructor() {
    this.targetPosition = { x: 0, y: 0, z: 0 };
    this.currentPosition = { x: 0, y: 0, z: 0 };
    this.targetRotation = { yaw: 0, pitch: 0 };
    this.currentRotation = { yaw: 0, pitch: 0 };
    this.smoothness = 0.1;  // 平滑系数（0-1，越小越平滑）
  }
  
  // 设置目标位置
  setTargetPosition(x, y, z) {
    this.targetPosition.x = x;
    this.targetPosition.y = y;
    this.targetPosition.z = z;
  }
  
  // 设置目标旋转
  setTargetRotation(yaw, pitch) {
    this.targetRotation.yaw = yaw;
    this.targetRotation.pitch = pitch;
  }
  
  // 更新（每帧调用）
  update() {
    // 位置插值
    this.currentPosition.x += (this.targetPosition.x - this.currentPosition.x) * this.smoothness;
    this.currentPosition.y += (this.targetPosition.y - this.currentPosition.y) * this.smoothness;
    this.currentPosition.z += (this.targetPosition.z - this.currentPosition.z) * this.smoothness;
    
    // 旋转插值（处理角度环绕）
    let deltaYaw = this.targetRotation.yaw - this.currentRotation.yaw;
    if (deltaYaw > Math.PI) deltaYaw -= Math.PI * 2;
    if (deltaYaw < -Math.PI) deltaYaw += Math.PI * 2;
    
    this.currentRotation.yaw += deltaYaw * this.smoothness;
    this.currentRotation.pitch += (this.targetRotation.pitch - this.currentRotation.pitch) * this.smoothness;
    
    // 计算视图矩阵
    const forwardX = Math.sin(this.currentRotation.yaw) * Math.cos(this.currentRotation.pitch);
    const forwardY = -Math.sin(this.currentRotation.pitch);
    const forwardZ = -Math.cos(this.currentRotation.yaw) * Math.cos(this.pitch);
    
    const targetX = this.currentPosition.x + forwardX;
    const targetY = this.currentPosition.y + forwardY;
    const targetZ = this.currentPosition.z + forwardZ;
    
    return Matrix.lookAt(
      this.currentPosition.x, this.currentPosition.y, this.currentPosition.z,
      targetX, targetY, targetZ,
      0, 1, 0
    );
  }
}

// 使用示例
const camera = new SmoothCamera();

// 设置目标位置（相机会平滑移动到目标位置）
camera.setTargetPosition(10, 5, 10);
camera.setTargetRotation(Math.PI / 4, Math.PI / 6);

// 每帧更新
function animate() {
  const viewMatrix = camera.update();
  // ... 渲染
  requestAnimationFrame(animate);
}`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">6. 交互式轨道相机示例</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          下面是一个可以用鼠标控制的轨道相机示例：
        </p>
        
        <WebGLCanvas width={400} height={400} onInit={(gl: WebGLRenderingContext, canvas: HTMLCanvasElement) => {
          const vertexShader = `attribute vec3 a_position;
uniform mat4 u_mvpMatrix;

void main() {
  gl_Position = u_mvpMatrix * vec4(a_position, 1.0);
}`
          
          const fragmentShader = `precision mediump float;
uniform vec4 u_color;

void main() {
  gl_FragColor = u_color;
}`
          
          const program = createProgram(gl, vertexShader, fragmentShader)
          
          // 立方体顶点
          const positions = [
            -0.5, -0.5,  0.5,  0.5, -0.5,  0.5,  0.5,  0.5,  0.5,  -0.5,  0.5,  0.5,
            -0.5, -0.5, -0.5,  -0.5,  0.5, -0.5,  0.5,  0.5, -0.5,  0.5, -0.5, -0.5,
            -0.5,  0.5, -0.5,  -0.5,  0.5,  0.5,  0.5,  0.5,  0.5,  0.5,  0.5, -0.5,
            -0.5, -0.5, -0.5,  0.5, -0.5, -0.5,  0.5, -0.5,  0.5,  -0.5, -0.5,  0.5,
             0.5, -0.5, -0.5,  0.5,  0.5, -0.5,  0.5,  0.5,  0.5,  0.5, -0.5,  0.5,
            -0.5, -0.5, -0.5,  -0.5, -0.5,  0.5,  -0.5,  0.5,  0.5,  -0.5,  0.5, -0.5,
          ]
          
          const indices = [
            0,  1,  2,   0,  2,  3,   4,  5,  6,   4,  6,  7,
            8,  9,  10,  8,  10, 11,  12, 13, 14,  12, 14, 15,
            16, 17, 18,  16, 18, 19,  20, 21, 22,  20, 22, 23,
          ]
          
          const positionBuffer = createBuffer(gl, positions)
          const indexBuffer = createIndexBuffer(gl, indices)
          
          const mvpMatrixLocation = gl.getUniformLocation(program, 'u_mvpMatrix')
          const colorLocation = gl.getUniformLocation(program, 'u_color')
          const positionLocation = gl.getAttribLocation(program, 'a_position')
          
          if (positionLocation === -1) {
            console.error('属性 a_position 未找到')
            return
          }
          
          gl.viewport(0, 0, canvas.width, canvas.height)
          gl.enable(gl.DEPTH_TEST)
          gl.clearColor(0.1, 0.1, 0.1, 1.0)
          
          const aspect = canvas.width / canvas.height
          const projectionMatrix = Matrix.perspective(Math.PI / 4, aspect, 0.1, 100)
          
          // 轨道相机参数
          let radius = 3
          let theta = 0
          let phi = Math.PI / 4
          let isDragging = false
          let lastX = 0
          let lastY = 0
          
          // 鼠标事件
          canvas.addEventListener('mousedown', (e) => {
            isDragging = true
            lastX = e.clientX
            lastY = e.clientY
          })
          
          canvas.addEventListener('mousemove', (e) => {
            if (isDragging) {
              const deltaX = e.clientX - lastX
              const deltaY = e.clientY - lastY
              
              theta += deltaX * 0.01
              phi = Math.max(0.1, Math.min(Math.PI - 0.1, phi + deltaY * 0.01))
              
              lastX = e.clientX
              lastY = e.clientY
            }
          })
          
          canvas.addEventListener('mouseup', () => {
            isDragging = false
          })
          
          canvas.addEventListener('wheel', (e) => {
            e.preventDefault()
            radius += e.deltaY * 0.01
            radius = Math.max(1, Math.min(10, radius))
          })
          
          const render = () => {
            // 计算相机位置
            const eyeX = radius * Math.sin(phi) * Math.cos(theta)
            const eyeY = radius * Math.cos(phi)
            const eyeZ = radius * Math.sin(phi) * Math.sin(theta)
            
            const viewMatrix = Matrix.lookAt(eyeX, eyeY, eyeZ, 0, 0, 0, 0, 1, 0)
            const modelMatrix = Matrix.identity()
            const mvpMatrix = Matrix.multiply(projectionMatrix, Matrix.multiply(viewMatrix, modelMatrix))
            
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
            gl.useProgram(program)
            
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
            gl.enableVertexAttribArray(positionLocation)
            gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0)
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
            
            gl.uniformMatrix4fv(mvpMatrixLocation, false, mvpMatrix)
            gl.uniform4f(colorLocation, 0.2, 0.6, 1.0, 1.0)
            
            gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0)
            requestAnimationFrame(render)
          }
          render()
        }} />
        
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          尝试用鼠标拖动来旋转相机，用滚轮来缩放。这是轨道相机的典型交互方式。
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">视锥体裁剪（Frustum Culling）</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          视锥体裁剪是一种优化技术，用于剔除不在相机视野内的物体，提高渲染性能。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">什么是视锥体裁剪？</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>视锥体是相机可见的空间范围（透视投影是截头金字塔，正交投影是矩形盒子）</li>
          <li>只有在这个空间内的物体会被渲染</li>
          <li>视锥体裁剪在 CPU 端进行，避免渲染不可见的物体</li>
          <li>可以大大提高性能，特别是在大型场景中</li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">简单的视锥体裁剪</h3>
        <CodeBlock title="视锥体裁剪实现" code={`// 简单的视锥体裁剪（使用包围球）
function isInFrustum(boundingSphere, viewMatrix, projectionMatrix) {
  // 将包围球中心转换到视图空间
  const center = boundingSphere.center;
  const radius = boundingSphere.radius;
  
  // 简化的视锥体检查（检查是否在近远平面之间）
  // 实际应用中需要检查所有6个平面
  
  // 计算 MVP 矩阵
  const mvp = Matrix.multiply(projectionMatrix, viewMatrix);
  
  // 将中心点转换到裁剪空间
  const clipPos = transformPoint(mvp, center);
  
  // 检查是否在裁剪空间内（简化版）
  // 实际应该检查所有6个平面
  const inFrustum = 
    clipPos.x >= -clipPos.w && clipPos.x <= clipPos.w &&
    clipPos.y >= -clipPos.w && clipPos.y <= clipPos.w &&
    clipPos.z >= -clipPos.w && clipPos.z <= clipPos.w;
  
  return inFrustum;
}

// 使用示例
const objects = [
  { mesh: mesh1, boundingSphere: { center: [0, 0, 0], radius: 1.0 } },
  { mesh: mesh2, boundingSphere: { center: [10, 0, 0], radius: 1.0 } },
  // ...
];

// 只渲染在视锥体内的物体
objects.forEach(obj => {
  if (isInFrustum(obj.boundingSphere, viewMatrix, projectionMatrix)) {
    renderObject(obj.mesh);
  }
});`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">视锥体平面</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          完整的视锥体裁剪需要检查 6 个平面：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>近裁剪平面（Near Plane）</li>
          <li>远裁剪平面（Far Plane）</li>
          <li>左平面（Left Plane）</li>
          <li>右平面（Right Plane）</li>
          <li>上平面（Top Plane）</li>
          <li>下平面（Bottom Plane）</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          物体必须在这 6 个平面的同一侧（或内部）才可见。
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">相机优化技巧</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          下面介绍一些相机优化的技巧，可以提高性能和用户体验。
        </p>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">1. 预计算投影矩阵</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          投影矩阵通常只在窗口大小改变时更新，可以预计算并缓存。
        </p>
        <CodeBlock title="预计算投影矩阵" code={`class Camera {
  constructor(canvas) {
    this.canvas = canvas;
    this.aspect = canvas.width / canvas.height;
    this.fov = Math.PI / 4;
    this.near = 0.1;
    this.far = 100.0;
    
    // 预计算投影矩阵
    this.projectionMatrix = Matrix.perspective(this.fov, this.aspect, this.near, this.far);
  }
  
  // 窗口大小改变时更新
  onResize() {
    this.aspect = this.canvas.width / this.canvas.height;
    this.projectionMatrix = Matrix.perspective(this.fov, this.aspect, this.near, this.far);
  }
}

// 使用示例
const camera = new Camera(canvas);
window.addEventListener('resize', () => {
  camera.onResize();
});`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">2. 组合 MVP 矩阵</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          如果模型矩阵不变，可以预计算 View * Projection，然后只更新 Model 部分。
        </p>
        <CodeBlock title="优化 MVP 矩阵计算" code={`// 不好的做法：每帧都计算完整的 MVP
function render() {
  const mvp = Matrix.multiply(
    projectionMatrix,
    Matrix.multiply(viewMatrix, modelMatrix)
  );
  gl.uniformMatrix4fv(mvpLocation, false, mvp);
}

// 好的做法：预计算 View * Projection
const viewProjection = Matrix.multiply(projectionMatrix, viewMatrix);

function render() {
  // 只更新模型矩阵部分
  const mvp = Matrix.multiply(viewProjection, modelMatrix);
  gl.uniformMatrix4fv(mvpLocation, false, mvp);
}

// 更好的做法：如果模型矩阵不变，可以预计算完整的 MVP
const mvp = Matrix.multiply(viewProjection, modelMatrix);
gl.uniformMatrix4fv(mvpLocation, false, mvp);`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">3. 相机平滑移动</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          使用插值函数实现平滑的相机移动，避免突然跳跃。
        </p>
        <CodeBlock title="相机平滑移动" code={`// 使用缓动函数实现平滑移动
function lerp(start, end, t) {
  return start + (end - start) * t;
}

function smoothCameraMove(camera, targetPosition, smoothness = 0.1) {
  camera.position.x = lerp(camera.position.x, targetPosition.x, smoothness);
  camera.position.y = lerp(camera.position.y, targetPosition.y, smoothness);
  camera.position.z = lerp(camera.position.z, targetPosition.z, smoothness);
}

// 使用示例
const camera = { position: { x: 0, y: 0, z: 5 } };
const targetPos = { x: 10, y: 5, z: 10 };

function animate() {
  smoothCameraMove(camera, targetPos, 0.1);
  const viewMatrix = Matrix.lookAt(
    camera.position.x, camera.position.y, camera.position.z,
    0, 0, 0, 0, 1, 0
  );
  // ... 渲染
  requestAnimationFrame(animate);
}`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">4. 相机边界限制</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          限制相机的移动范围，防止相机移动到场景外或穿过物体。
        </p>
        <CodeBlock title="相机边界限制" code={`class BoundedCamera {
  constructor() {
    this.position = { x: 0, y: 0, z: 5 };
    this.bounds = {
      minX: -10, maxX: 10,
      minY: 0, maxY: 20,
      minZ: -10, maxZ: 10
    };
  }
  
  setPosition(x, y, z) {
    // 限制在边界内
    this.position.x = Math.max(this.bounds.minX, Math.min(this.bounds.maxX, x));
    this.position.y = Math.max(this.bounds.minY, Math.min(this.bounds.maxY, y));
    this.position.z = Math.max(this.bounds.minZ, Math.min(this.bounds.maxZ, z));
  }
  
  move(deltaX, deltaY, deltaZ) {
    this.setPosition(
      this.position.x + deltaX,
      this.position.y + deltaY,
      this.position.z + deltaZ
    );
  }
}`} language="javascript" />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">常见问题和调试</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          下面列出一些常见问题和调试技巧。
        </p>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">常见问题</h3>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">物体不显示</strong>：
            <ul className="mt-2 pl-6">
              <li>检查物体是否在视锥体内</li>
              <li>检查近远裁剪平面设置是否合理</li>
              <li>检查相机位置和朝向是否正确</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">物体显示错误</strong>：
            <ul className="mt-2 pl-6">
              <li>检查视图矩阵和投影矩阵的顺序</li>
              <li>检查宽高比是否正确</li>
              <li>检查坐标系统是否一致</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">相机移动不流畅</strong>：
            <ul className="mt-2 pl-6">
              <li>使用插值函数实现平滑移动</li>
              <li>检查帧率是否稳定</li>
              <li>避免在每帧创建新矩阵</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">图像拉伸变形</strong>：
            <ul className="mt-2 pl-6">
              <li>检查宽高比是否匹配 canvas 的实际宽高比</li>
              <li>窗口大小改变时更新投影矩阵</li>
            </ul>
          </li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">调试技巧</h3>
        <CodeBlock title="相机调试技巧" code={`// 1. 可视化相机位置和朝向
function debugCamera(camera) {
  console.log('相机位置:', camera.position);
  console.log('相机朝向:', camera.getForward());
  console.log('视图矩阵:', camera.viewMatrix);
}

// 2. 可视化视锥体（在编辑器中）
function drawFrustum(gl, viewMatrix, projectionMatrix) {
  // 绘制视锥体的边线
  // 这可以帮助理解相机的视野范围
}

// 3. 检查物体是否在视锥体内
function checkObjectInFrustum(object, viewMatrix, projectionMatrix) {
  const mvp = Matrix.multiply(projectionMatrix, viewMatrix);
  const clipPos = transformPoint(mvp, object.position);
  
  const inFrustum = 
    Math.abs(clipPos.x) <= clipPos.w &&
    Math.abs(clipPos.y) <= clipPos.w &&
    Math.abs(clipPos.z) <= clipPos.w;
  
  console.log('物体', object.name, '在视锥体内:', inFrustum);
  return inFrustum;
}

// 4. 打印相机信息
function printCameraInfo(camera) {
  console.log('=== 相机信息 ===');
  console.log('位置:', camera.position);
  console.log('目标:', camera.target);
  console.log('距离:', camera.distance);
  console.log('角度:', camera.angle);
  console.log('俯仰角:', camera.pitch);
}`} language="javascript" />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">关键概念总结</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          本章介绍了相机和投影的核心概念，以下是关键内容的总结：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">相机</strong>：
            <ul className="mt-2 pl-6">
              <li>定义观察场景的视角</li>
              <li>包含位置、目标、上方向三个关键属性</li>
              <li>在视图空间中，相机位于原点，看向 -Z 方向</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">视图矩阵（View Matrix）</strong>：
            <ul className="mt-2 pl-6">
              <li>将顶点从世界空间转换到视图空间</li>
              <li>使用 lookAt 函数创建</li>
              <li>是相机变换的逆矩阵</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">投影矩阵（Projection Matrix）</strong>：
            <ul className="mt-2 pl-6">
              <li>将 3D 场景投影到 2D 屏幕</li>
              <li>透视投影：模拟人眼效果，远处物体更小</li>
              <li>正交投影：保持物体实际大小</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">透视投影</strong>：
            <ul className="mt-2 pl-6">
              <li>参数：fov（视野角度）、aspect（宽高比）、near、far</li>
              <li>创建截头金字塔形状的视锥体</li>
              <li>产生透视效果和深度感</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">正交投影</strong>：
            <ul className="mt-2 pl-6">
              <li>参数：left、right、bottom、top、near、far</li>
              <li>创建矩形盒子形状的视锥体</li>
              <li>适合 2D 渲染和技术图纸</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">相机控制</strong>：
            <ul className="mt-2 pl-6">
              <li>轨道相机：围绕目标点旋转</li>
              <li>第一人称相机：自由移动和旋转</li>
              <li>跟随相机：跟随目标物体</li>
              <li>第三人称相机：跟随但保持距离</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">视锥体裁剪</strong>：
            <ul className="mt-2 pl-6">
              <li>剔除不在相机视野内的物体</li>
              <li>提高渲染性能</li>
              <li>需要检查 6 个平面</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">优化技巧</strong>：
            <ul className="mt-2 pl-6">
              <li>预计算投影矩阵</li>
              <li>组合 MVP 矩阵减少计算</li>
              <li>使用平滑插值</li>
              <li>限制相机边界</li>
            </ul>
          </li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">学习建议</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>多实践不同的相机控制方式</li>
          <li>理解视图矩阵和投影矩阵的数学原理</li>
          <li>注意宽高比的匹配，避免图像变形</li>
          <li>使用平滑插值实现流畅的相机移动</li>
          <li>根据应用场景选择合适的投影方式</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          掌握相机和投影后，你就可以创建各种视角的 3D 场景了！
        </p>
      </section>
      
      <ChapterNavigation />
    </div>
  )
}
