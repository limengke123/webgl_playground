import { useEffect } from 'react'
import WebGLCanvas from '../../components/WebGLCanvas'
import CodeBlock from '../../components/CodeBlock'
import ChapterNavigation from '../../components/ChapterNavigation'
import { createProgram, createBuffer, setAttribute, createTexture } from '../../utils/webgl'

export default function Chapter4() {
  return (
    <div className="w-full">
      <h1 className="text-4xl mb-8 text-primary border-b-2 border-dark-border dark:border-dark-border border-light-border pb-4">第四章：材质与纹理</h1>
      
      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">什么是材质？</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          材质（Material）定义了物体表面的视觉属性，决定了物体在渲染时的外观。
          材质系统是 3D 图形学中非常重要的概念，它连接了几何形状和视觉效果。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">材质的组成</strong>：
          一个完整的材质系统通常包含以下属性：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">基础颜色（Albedo/Diffuse）</strong>：
            <ul className="mt-2 pl-6">
              <li>物体表面的基础颜色，通常使用纹理贴图或纯色</li>
              <li>在物理渲染（PBR）中，这应该是去除光照后的真实颜色</li>
              <li>通常使用 RGB 或 RGBA 格式</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">纹理贴图（Texture Maps）</strong>：
            <ul className="mt-2 pl-6">
              <li>漫反射贴图（Diffuse Map）：基础颜色纹理</li>
              <li>法线贴图（Normal Map）：表面细节的法线信息</li>
              <li>粗糙度贴图（Roughness Map）：表面粗糙程度</li>
              <li>金属度贴图（Metallic Map）：金属属性</li>
              <li>环境光遮蔽贴图（AO Map）：阴影细节</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">光照属性</strong>：
            <ul className="mt-2 pl-6">
              <li>环境光系数（Ambient）：物体在无光照情况下的颜色</li>
              <li>漫反射系数（Diffuse）：物体对漫反射光的响应</li>
              <li>镜面反射系数（Specular）：物体对镜面反射光的响应</li>
              <li>高光强度（Shininess）：镜面反射的锐利程度</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">透明度（Transparency）</strong>：
            <ul className="mt-2 pl-6">
              <li>Alpha 通道：控制物体的不透明度（0 = 完全透明，1 = 完全不透明）</li>
              <li>用于实现玻璃、水、半透明物体等效果</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">自发光（Emissive）</strong>：
            <ul className="mt-2 pl-6">
              <li>物体自身发出的光，不受光照影响</li>
              <li>用于实现发光物体，如灯泡、屏幕等</li>
            </ul>
          </li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">材质系统的重要性</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>材质决定了物体的视觉外观，是区分不同物体的关键</li>
          <li>好的材质系统可以大大提升渲染质量</li>
          <li>材质可以复用，提高开发效率</li>
          <li>材质参数可以动态调整，实现动画效果</li>
        </ul>
        <CodeBlock title="材质数据结构示例" code={`// 简单的材质结构
class Material {
  constructor() {
    this.diffuseColor = [1.0, 1.0, 1.0];  // RGB 基础颜色
    this.diffuseTexture = null;            // 漫反射纹理
    this.normalTexture = null;             // 法线纹理
    this.specular = 0.5;                   // 镜面反射强度
    this.shininess = 32.0;                 // 高光锐度
    this.alpha = 1.0;                      // 透明度
    this.emissive = [0.0, 0.0, 0.0];      // 自发光颜色
  }
}

// 使用示例
const woodMaterial = new Material();
woodMaterial.diffuseTexture = loadTexture('wood.jpg');
woodMaterial.specular = 0.3;
woodMaterial.shininess = 16.0;

const metalMaterial = new Material();
metalMaterial.diffuseColor = [0.8, 0.8, 0.9];
metalMaterial.specular = 0.9;
metalMaterial.shininess = 128.0;`} language="javascript" />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">纹理基础</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          纹理（Texture）是 2D 图像，可以映射到 3D 物体的表面，为物体添加细节和真实感。
          纹理是图形学中最重要的技术之一，它让我们可以用相对简单的几何体创建复杂的视觉效果。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">什么是纹理？</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>纹理本质上是一个 2D 图像（通常是位图）</li>
          <li>纹理被映射到 3D 物体的表面上</li>
          <li>每个顶点都有对应的纹理坐标（UV 坐标），指定纹理上的哪个位置</li>
          <li>片段着色器使用插值后的纹理坐标来采样纹理颜色</li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">纹理坐标（UV 坐标）</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          纹理坐标（Texture Coordinates），也称为 UV 坐标，用于指定纹理图像上的位置。
          U 和 V 分别对应纹理的水平和垂直方向，范围通常从 0 到 1。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">UV 坐标系统</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong>U 轴</strong>：水平方向，从左到右（0 → 1）</li>
          <li><strong>V 轴</strong>：垂直方向，从下到上（0 → 1）</li>
          <li><strong>原点 (0, 0)</strong>：通常位于纹理的左下角（注意：有些系统使用左上角）</li>
          <li><strong>范围 [0, 1]</strong>：标准范围，超出此范围的行为由纹理包装模式决定</li>
        </ul>
        <CodeBlock title="纹理坐标示例" code={`// 纹理坐标 (u, v) 的布局
// 注意：WebGL 中 (0,0) 在左下角
//
// (0,1) -------- (1,1)
//   |               |
//   |    纹理图像    |
//   |               |
// (0,0) -------- (1,0)

// 一个矩形的纹理坐标
const texCoords = [
  0.0, 0.0,  // 左下角顶点
  1.0, 0.0,  // 右下角顶点
  1.0, 1.0,  // 右上角顶点
  0.0, 1.0   // 左上角顶点
]

// 在顶点数据中，纹理坐标通常与位置一起存储
const vertices = [
  // 位置 (x, y, z)    纹理坐标 (u, v)
  -0.5, -0.5, 0.0,    0.0, 0.0,
   0.5, -0.5, 0.0,    1.0, 0.0,
   0.5,  0.5, 0.0,    1.0, 1.0,
  -0.5,  0.5, 0.0,    0.0, 1.0
]`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">UV 映射</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          UV 映射是将 3D 模型的顶点映射到 2D 纹理图像上的过程。
          这是一个重要的建模步骤，决定了纹理如何应用到模型上。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">UV 映射的挑战</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong>展开 3D 表面</strong>：需要将 3D 表面"展开"到 2D 平面上</li>
          <li><strong>避免重叠</strong>：确保不同的 3D 区域映射到纹理的不同部分</li>
          <li><strong>最小化扭曲</strong>：尽量保持纹理的比例和形状</li>
          <li><strong>有效利用空间</strong>：最大化利用纹理空间，减少浪费</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">常见的 UV 映射技术</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong>平面映射</strong>：将模型投影到一个平面上（适合平面物体）</li>
          <li><strong>圆柱映射</strong>：将模型包裹在圆柱上（适合圆柱形物体）</li>
          <li><strong>球面映射</strong>：将模型包裹在球面上（适合球形物体）</li>
          <li><strong>手动展开</strong>：在 3D 建模软件中手动编辑 UV（最灵活，最耗时）</li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">纹理坐标的插值</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          在光栅化过程中，纹理坐标会在三角形内部进行插值。
          这意味着每个片段都会得到插值后的纹理坐标，用于采样纹理。
        </p>
        <CodeBlock title="纹理坐标插值示例" code={`// 顶点着色器：传递纹理坐标
attribute vec2 a_texCoord;
varying vec2 v_texCoord;

void main() {
  gl_Position = u_matrix * vec4(a_position, 1.0);
  v_texCoord = a_texCoord;  // 传递给片段着色器
}

// 片段着色器：接收插值后的纹理坐标
precision mediump float;
varying vec2 v_texCoord;  // 已经过插值的纹理坐标
uniform sampler2D u_texture;

void main() {
  // 使用插值后的纹理坐标采样纹理
  gl_FragColor = texture2D(u_texture, v_texCoord);
}

// 插值过程（WebGL 自动完成）：
// 1. 顶点着色器输出每个顶点的纹理坐标
// 2. 光栅化时，在三角形内部进行线性插值
// 3. 每个片段得到对应的插值后的纹理坐标
// 4. 片段着色器使用这个坐标采样纹理`} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">创建纹理</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          在 WebGL 中创建和使用纹理需要遵循特定的步骤。
          理解这些步骤对于正确使用纹理非常重要。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">创建纹理的完整流程</strong>：
        </p>
        <ol className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong>创建纹理对象</strong>：使用 gl.createTexture() 创建纹理对象</li>
          <li><strong>绑定纹理</strong>：使用 gl.bindTexture() 绑定到纹理单元</li>
          <li><strong>设置纹理参数</strong>：设置过滤模式、包装模式等参数</li>
          <li><strong>上传图像数据</strong>：使用 gl.texImage2D() 上传图像数据到 GPU</li>
          <li><strong>生成 Mipmap（可选）</strong>：使用 gl.generateMipmap() 生成多级纹理</li>
          <li><strong>在着色器中采样</strong>：使用 texture2D() 函数采样纹理</li>
        </ol>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">从图像创建纹理</h3>
        <CodeBlock title="完整的纹理创建函数" code={`// 从图像创建纹理（异步加载）
function loadTexture(gl, url) {
  return new Promise((resolve, reject) => {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    
    // 创建临时图像（1x1 像素，紫色）
    // 在图像加载完成前显示这个临时图像
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([255, 0, 255, 255])  // 紫色
    );
    
    const image = new Image();
    image.crossOrigin = 'anonymous';  // 允许跨域加载
    
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      
      // 设置纹理参数
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      
      // 上传图像数据
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,                    // mipmap 级别（0 = 基础级别）
        gl.RGBA,              // 内部格式
        gl.RGBA,              // 源格式
        gl.UNSIGNED_BYTE,     // 数据类型
        image                 // 图像数据
      );
      
      // 生成 Mipmap（可选，但推荐）
      gl.generateMipmap(gl.TEXTURE_2D);
      
      resolve(texture);
    };
    
    image.onerror = () => {
      reject(new Error(\`无法加载纹理: \${url}\`));
    };
    
    image.src = url;
  });
}

// 使用示例
loadTexture(gl, 'texture.jpg')
  .then(texture => {
    console.log('纹理加载成功');
    // 使用纹理进行渲染
  })
  .catch(error => {
    console.error('纹理加载失败:', error);
  });`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">从 Canvas 创建纹理</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          除了从图像文件加载纹理，还可以从 Canvas 元素创建纹理。
          这对于程序化生成纹理或动态更新纹理非常有用。
        </p>
        <CodeBlock title="从 Canvas 创建纹理" code={`// 从 Canvas 创建纹理
function createTextureFromCanvas(gl, canvas) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  
  // 设置纹理参数
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  
  // 上传 Canvas 数据
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
  
  return texture;
}

// 示例：创建程序化纹理
const canvas = document.createElement('canvas');
canvas.width = 256;
canvas.height = 256;
const ctx = canvas.getContext('2d');

// 绘制渐变
const gradient = ctx.createLinearGradient(0, 0, 256, 256);
gradient.addColorStop(0, 'red');
gradient.addColorStop(1, 'blue');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 256, 256);

// 创建纹理
const texture = createTextureFromCanvas(gl, canvas);`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">从像素数据创建纹理</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          也可以直接从像素数据（TypedArray）创建纹理。
          这对于动态生成纹理或处理图像数据非常有用。
        </p>
        <CodeBlock title="从像素数据创建纹理" code={`// 从像素数据创建纹理
function createTextureFromData(gl, width, height, data) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  
  // 设置纹理参数
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  
  // 上传像素数据
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    width,
    height,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    data  // Uint8Array，格式为 RGBA
  );
  
  return texture;
}

// 示例：创建棋盘格纹理
function createCheckerboardTexture(gl, size = 256) {
  const pixels = new Uint8Array(size * size * 4);
  const tileSize = size / 8;
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const tileX = Math.floor(x / tileSize);
      const tileY = Math.floor(y / tileSize);
      const isWhite = (tileX + tileY) % 2 === 0;
      
      const index = (y * size + x) * 4;
      const color = isWhite ? 255 : 0;
      pixels[index] = color;     // R
      pixels[index + 1] = color; // G
      pixels[index + 2] = color; // B
      pixels[index + 3] = 255;    // A
    }
  }
  
  return createTextureFromData(gl, size, size, pixels);
}`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">纹理格式和限制</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">支持的纹理格式</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong>RGBA</strong>：红、绿、蓝、Alpha（最常用）</li>
          <li><strong>RGB</strong>：红、绿、蓝（无 Alpha）</li>
          <li><strong>LUMINANCE</strong>：灰度图像</li>
          <li><strong>LUMINANCE_ALPHA</strong>：灰度 + Alpha</li>
          <li><strong>ALPHA</strong>：仅 Alpha 通道</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">纹理尺寸限制</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>WebGL 要求纹理尺寸必须是 2 的幂（1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048...）</li>
          <li>最大纹理尺寸可以通过 <code className="bg-dark-bg dark:bg-dark-bg px-1 py-0.5 rounded">gl.getParameter(gl.MAX_TEXTURE_SIZE)</code> 查询</li>
          <li>如果图像不是 2 的幂，需要调整大小或使用非 2 的幂纹理（功能受限）</li>
        </ul>
        <CodeBlock title="检查纹理尺寸限制" code={`// 检查最大纹理尺寸
const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
console.log('最大纹理尺寸:', maxTextureSize);  // 通常是 2048 或 4096

// 检查纹理是否是 2 的幂
function isPowerOfTwo(value) {
  return (value & (value - 1)) === 0;
}

// 调整图像大小到 2 的幂
function resizeToPowerOfTwo(image) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // 计算最接近的 2 的幂
  const width = Math.pow(2, Math.ceil(Math.log2(image.width)));
  const height = Math.pow(2, Math.ceil(Math.log2(image.height)));
  
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, 0, 0, width, height);
  
  return canvas;
}`} language="javascript" />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">纹理过滤</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          纹理过滤（Texture Filtering）决定当纹理被放大或缩小时如何采样纹理像素。
          选择合适的过滤模式对于获得良好的视觉效果非常重要。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">为什么需要纹理过滤？</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>当纹理被放大时，一个纹理像素可能覆盖多个屏幕像素（需要插值）</li>
          <li>当纹理被缩小时，多个纹理像素可能映射到一个屏幕像素（需要平均）</li>
          <li>过滤可以避免锯齿和闪烁，提供平滑的视觉效果</li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">放大过滤（MAG_FILTER）</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          当纹理被放大时（纹理像素小于屏幕像素），使用 MAG_FILTER。
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">gl.NEAREST</strong>：
            <ul className="mt-2 pl-6">
              <li>选择最近的纹理像素，不做插值</li>
              <li>产生像素化的效果（马赛克）</li>
              <li>性能最好，但质量较低</li>
              <li>适用于像素艺术风格的游戏</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">gl.LINEAR</strong>：
            <ul className="mt-2 pl-6">
              <li>在最近的 4 个纹理像素之间进行双线性插值</li>
              <li>产生平滑的效果</li>
              <li>性能稍差，但质量更好</li>
              <li>大多数情况下推荐使用</li>
            </ul>
          </li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">缩小过滤（MIN_FILTER）</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          当纹理被缩小时（纹理像素大于屏幕像素），使用 MIN_FILTER。
          缩小过滤可以使用 Mipmap 来提升质量。
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">gl.NEAREST</strong>：选择最近的纹理像素</li>
          <li><strong className="text-primary font-semibold">gl.LINEAR</strong>：双线性插值</li>
          <li><strong className="text-primary font-semibold">gl.NEAREST_MIPMAP_NEAREST</strong>：选择最近的 mipmap 级别，然后使用最近邻采样</li>
          <li><strong className="text-primary font-semibold">gl.LINEAR_MIPMAP_NEAREST</strong>：选择最近的 mipmap 级别，然后使用线性插值</li>
          <li><strong className="text-primary font-semibold">gl.NEAREST_MIPMAP_LINEAR</strong>：在两个 mipmap 级别之间插值，然后使用最近邻采样</li>
          <li><strong className="text-primary font-semibold">gl.LINEAR_MIPMAP_LINEAR</strong>：三线性过滤（最平滑，推荐）</li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">Mipmap（多级纹理）</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          Mipmap 是纹理的预计算缩小版本序列。
          每个 mipmap 级别都是前一级别的一半大小，形成一个金字塔结构。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">Mipmap 的结构</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>级别 0：原始纹理（例如 512x512）</li>
          <li>级别 1：256x256</li>
          <li>级别 2：128x128</li>
          <li>级别 3：64x64</li>
          <li>级别 4：32x32</li>
          <li>... 直到 1x1</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">Mipmap 的优势</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong>提升远距离渲染质量</strong>：当纹理被缩小时，使用较小的 mipmap 级别可以避免闪烁和锯齿</li>
          <li><strong>提高性能</strong>：使用较小的 mipmap 级别意味着更少的纹理数据需要采样</li>
          <li><strong>减少内存带宽</strong>：较小的 mipmap 级别占用更少的内存带宽</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">Mipmap 的代价</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>额外的内存占用（约增加 33%）</li>
          <li>需要预计算时间（但通常可以忽略）</li>
        </ul>
        <CodeBlock title="生成和使用 Mipmap" code={`// 创建纹理并生成 Mipmap
function createTextureWithMipmap(gl, image) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  
  // 上传基础级别（级别 0）
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  
  // 生成 Mipmap（WebGL 自动生成所有级别）
  gl.generateMipmap(gl.TEXTURE_2D);
  
  // 设置过滤模式（使用 Mipmap）
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  
  return texture;
}

// 手动创建 Mipmap（如果需要更多控制）
function createMipmapManually(gl, texture, width, height) {
  let level = 0;
  let currentWidth = width;
  let currentHeight = height;
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  while (currentWidth > 1 && currentHeight > 1) {
    level++;
    currentWidth = Math.max(1, currentWidth / 2);
    currentHeight = Math.max(1, currentHeight / 2);
    
    canvas.width = currentWidth;
    canvas.height = currentHeight;
    
    // 绘制缩小后的图像
    ctx.drawImage(image, 0, 0, currentWidth, currentHeight);
    
    // 上传到对应的 mipmap 级别
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      canvas
    );
  }
}`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">过滤模式的选择</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">推荐配置</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong>高质量</strong>：
            <ul className="mt-2 pl-6">
              <li>MIN_FILTER: gl.LINEAR_MIPMAP_LINEAR（三线性过滤）</li>
              <li>MAG_FILTER: gl.LINEAR（双线性插值）</li>
              <li>需要生成 Mipmap</li>
            </ul>
          </li>
          <li><strong>平衡</strong>：
            <ul className="mt-2 pl-6">
              <li>MIN_FILTER: gl.LINEAR_MIPMAP_NEAREST</li>
              <li>MAG_FILTER: gl.LINEAR</li>
              <li>需要生成 Mipmap</li>
            </ul>
          </li>
          <li><strong>性能优先</strong>：
            <ul className="mt-2 pl-6">
              <li>MIN_FILTER: gl.NEAREST</li>
              <li>MAG_FILTER: gl.NEAREST</li>
              <li>不需要 Mipmap</li>
            </ul>
          </li>
          <li><strong>像素艺术</strong>：
            <ul className="mt-2 pl-6">
              <li>MIN_FILTER: gl.NEAREST</li>
              <li>MAG_FILTER: gl.NEAREST</li>
              <li>保持像素化的风格</li>
            </ul>
          </li>
        </ul>
        <CodeBlock title="设置纹理过滤" code={`// 设置纹理过滤参数
function setTextureFiltering(gl, texture, minFilter, magFilter) {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
}

// 使用示例
// 高质量配置
setTextureFiltering(gl, texture, gl.LINEAR_MIPMAP_LINEAR, gl.LINEAR);

// 性能优先配置
setTextureFiltering(gl, texture, gl.NEAREST, gl.NEAREST);

// 像素艺术配置
setTextureFiltering(gl, texture, gl.NEAREST, gl.NEAREST);`} language="javascript" />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">纹理包装</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          纹理包装决定超出 [0,1] 范围的纹理坐标如何处理。这对于创建无缝重复的纹理或处理边界情况很重要。
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">gl.REPEAT</strong>：重复纹理，创建平铺效果</li>
          <li><strong className="text-primary font-semibold">gl.CLAMP_TO_EDGE</strong>：夹紧到边缘，使用边缘像素填充</li>
          <li><strong className="text-primary font-semibold">gl.MIRRORED_REPEAT</strong>：镜像重复，创建对称的平铺效果</li>
        </ul>
        
        <CodeBlock title="设置纹理包装模式" code={`// 设置 S 方向（水平）的包装模式
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);

// 设置 T 方向（垂直）的包装模式
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

// 示例：创建无缝平铺的纹理
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

// 在着色器中使用超出 [0,1] 的纹理坐标
vec2 repeatedUV = v_texCoord * 5.0;  // 重复 5 次
vec4 color = texture2D(u_texture, repeatedUV);`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">纹理包装示例</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          下面展示了不同包装模式的效果：
        </p>
        
        <WebGLCanvas width={400} height={400} onInit={(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement) => {
          const vertexShader = `attribute vec2 a_position;
attribute vec2 a_texCoord;
varying vec2 v_texCoord;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_texCoord = a_texCoord;
}`
          
          const fragmentShader = `precision mediump float;
varying vec2 v_texCoord;
uniform float u_wrapMode;

void main() {
  vec2 uv = v_texCoord * 3.0;
  vec2 wrappedUV;
  if (u_wrapMode < 0.33) {
    wrappedUV = fract(uv);
  } else if (u_wrapMode < 0.66) {
    wrappedUV = clamp(uv, 0.0, 1.0);
  } else {
    vec2 f = fract(uv);
    vec2 m = mod(floor(uv), 2.0);
    wrappedUV = mix(f, 1.0 - f, m);
  }
  vec2 grid = floor(wrappedUV * 4.0);
  float checker = mod(grid.x + grid.y, 2.0);
  vec3 color = vec3(checker * 0.8 + 0.2);
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
          
          const wrapModeLocation = gl.getUniformLocation(program, 'u_wrapMode')
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
            time += 0.01
            const wrapMode = (Math.sin(time) + 1) / 2
            
            gl.clear(gl.COLOR_BUFFER_BIT)
            gl.useProgram(program)
            
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
            gl.enableVertexAttribArray(positionLocation)
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
            
            gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
            gl.enableVertexAttribArray(texCoordLocation)
            gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0)
            
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
            gl.uniform1f(wrapModeLocation, wrapMode)
            
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
            requestAnimationFrame(render)
          }
          render()
        }} />
        
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          上面的示例展示了不同包装模式的效果。注意观察纹理在边界处的处理方式。
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">程序化纹理</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          程序化纹理使用着色器代码生成纹理，而不是加载图像。这种方法有很多优势：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">无内存占用</strong>：不需要存储图像数据</li>
          <li><strong className="text-primary font-semibold">无限分辨率</strong>：可以任意缩放而不失真</li>
          <li><strong className="text-primary font-semibold">可参数化</strong>：可以通过 uniform 变量动态调整</li>
          <li><strong className="text-primary font-semibold">可动画化</strong>：可以随时间变化</li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">示例 1：基础波形纹理</h3>
        <WebGLCanvas width={400} height={400} onInit={(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement) => {
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
  vec2 uv = v_texCoord * 10.0;
  float pattern = sin(uv.x + u_time) * sin(uv.y + u_time);
  gl_FragColor = vec4(pattern * 0.5 + 0.5, pattern * 0.3 + 0.5, 1.0, 1.0);
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
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">示例 2：噪声纹理</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          使用噪声函数创建自然纹理：
        </p>
        
        <WebGLCanvas width={400} height={400} onInit={(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement) => {
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

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
  vec2 uv = v_texCoord * 8.0;
  float n = noise(uv + u_time * 0.5);
  vec3 color = vec3(n * 0.5 + 0.5);
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
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">示例 3：径向渐变纹理</h3>
        <WebGLCanvas width={400} height={400} onInit={(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement) => {
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
  vec2 dir = v_texCoord - center;
  float angle = atan(dir.y, dir.x) + u_time;
  float pattern = sin(angle * 8.0) * 0.3 + 0.7;
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
        
        <CodeBlock title="程序化纹理技巧" code={`// 1. 使用 fract 创建重复图案
vec2 repeatedUV = fract(v_texCoord * 5.0);

// 2. 使用 distance 创建径向效果
float dist = distance(v_texCoord, vec2(0.5));

// 3. 使用噪声函数创建自然纹理
float n = noise(v_texCoord * 10.0);

// 4. 组合多个函数创建复杂效果
float pattern1 = sin(uv.x * 10.0);
float pattern2 = cos(uv.y * 10.0);
float combined = pattern1 * pattern2;

// 5. 使用 smoothstep 创建平滑过渡
float gradient = smoothstep(0.0, 1.0, dist);`} />
        
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          程序化纹理非常强大，可以创建各种效果，从简单的图案到复杂的自然纹理。通过组合不同的数学函数，你可以创造出无限的可能性。
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">多纹理</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          WebGL 支持同时使用多个纹理，这让我们可以实现复杂的材质效果。
          通过组合不同的纹理贴图，可以创建非常真实和详细的表面效果。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">纹理单元（Texture Units）</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>WebGL 有多个纹理单元（通常是 8 个或更多）</li>
          <li>每个纹理单元可以绑定一个纹理</li>
          <li>使用 gl.activeTexture() 选择当前活动的纹理单元</li>
          <li>纹理单元编号从 gl.TEXTURE0 开始</li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">常见的纹理贴图类型</h3>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">漫反射贴图（Diffuse/Albedo Map）</strong>：
            <ul className="mt-2 pl-6">
              <li>物体的基础颜色</li>
              <li>最常用的纹理贴图</li>
              <li>通常使用 RGB 或 RGBA 格式</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">法线贴图（Normal Map）</strong>：
            <ul className="mt-2 pl-6">
              <li>存储表面的法线信息</li>
              <li>用于添加表面细节，而不增加几何复杂度</li>
              <li>通常使用 RGB 格式（每个通道存储法线的一个分量）</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">粗糙度贴图（Roughness Map）</strong>：
            <ul className="mt-2 pl-6">
              <li>控制表面的粗糙程度</li>
              <li>用于物理渲染（PBR）</li>
              <li>通常使用单通道（灰度）格式</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">金属度贴图（Metallic Map）</strong>：
            <ul className="mt-2 pl-6">
              <li>控制表面的金属属性</li>
              <li>用于物理渲染（PBR）</li>
              <li>通常使用单通道（灰度）格式</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">环境光遮蔽贴图（AO Map）</strong>：
            <ul className="mt-2 pl-6">
              <li>存储环境光遮蔽信息</li>
              <li>用于添加阴影细节</li>
              <li>通常使用单通道（灰度）格式</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">高光贴图（Specular Map）</strong>：
            <ul className="mt-2 pl-6">
              <li>控制镜面反射的强度和颜色</li>
              <li>用于传统光照模型</li>
              <li>通常使用 RGB 格式</li>
            </ul>
          </li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">多纹理的使用</h3>
        <CodeBlock title="多纹理示例" code={`// JavaScript 端：绑定多个纹理
function bindTextures(gl, program, textures) {
  // 绑定漫反射纹理到纹理单元 0
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, textures.diffuse);
  gl.uniform1i(gl.getUniformLocation(program, 'u_diffuseTexture'), 0);
  
  // 绑定法线纹理到纹理单元 1
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, textures.normal);
  gl.uniform1i(gl.getUniformLocation(program, 'u_normalTexture'), 1);
  
  // 绑定粗糙度纹理到纹理单元 2
  gl.activeTexture(gl.TEXTURE2);
  gl.bindTexture(gl.TEXTURE_2D, textures.roughness);
  gl.uniform1i(gl.getUniformLocation(program, 'u_roughnessTexture'), 2);
}

// 片段着色器：采样多个纹理
precision mediump float;
uniform sampler2D u_diffuseTexture;
uniform sampler2D u_normalTexture;
uniform sampler2D u_roughnessTexture;
varying vec2 v_texCoord;

void main() {
  // 采样各个纹理
  vec4 diffuseColor = texture2D(u_diffuseTexture, v_texCoord);
  vec3 normal = texture2D(u_normalTexture, v_texCoord).rgb * 2.0 - 1.0;  // 从 [0,1] 转换到 [-1,1]
  float roughness = texture2D(u_roughnessTexture, v_texCoord).r;
  
  // 组合使用
  // ... 光照计算 ...
  
  gl_FragColor = vec4(diffuseColor.rgb, diffuseColor.a);
}`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">纹理组合技巧</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">混合模式</strong>：
          可以使用不同的混合模式组合多个纹理。
        </p>
        <CodeBlock title="纹理混合示例" code={`// 片段着色器中的纹理混合
precision mediump float;
uniform sampler2D u_texture1;
uniform sampler2D u_texture2;
uniform float u_blendFactor;  // 混合因子 [0, 1]
varying vec2 v_texCoord;

void main() {
  vec4 color1 = texture2D(u_texture1, v_texCoord);
  vec4 color2 = texture2D(u_texture2, v_texCoord);
  
  // 线性混合
  vec4 blended = mix(color1, color2, u_blendFactor);
  
  // 乘法混合（用于细节纹理）
  // vec4 blended = color1 * color2;
  
  // 加法混合（用于发光效果）
  // vec4 blended = color1 + color2;
  
  // 叠加混合
  // vec4 blended = color1 + color2 - color1 * color2;
  
  gl_FragColor = blended;
}`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">纹理打包</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          为了减少纹理单元的使用，可以将多个纹理打包到一个纹理中。
          例如，可以将粗糙度和金属度打包到 RG 通道中。
        </p>
        <CodeBlock title="纹理打包示例" code={`// 将粗糙度和金属度打包到一个纹理
// R 通道：粗糙度
// G 通道：金属度
// B 通道：未使用
// A 通道：未使用

precision mediump float;
uniform sampler2D u_roughnessMetallicTexture;
varying vec2 v_texCoord;

void main() {
  vec4 packed = texture2D(u_roughnessMetallicTexture, v_texCoord);
  float roughness = packed.r;
  float metallic = packed.g;
  
  // 使用粗糙度和金属度进行 PBR 计算
  // ...
}`} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">立方体贴图（Cubemap）</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          立方体贴图（Cubemap）是一种特殊的纹理类型，由 6 个 2D 纹理组成，形成一个立方体的 6 个面。
          立方体贴图广泛应用于环境映射、天空盒、反射等效果。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">立方体贴图的结构</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong>正面（+X）</strong>：右面</li>
          <li><strong>背面（-X）</strong>：左面</li>
          <li><strong>顶面（+Y）</strong>：上面</li>
          <li><strong>底面（-Y）</strong>：下面</li>
          <li><strong>前面（+Z）</strong>：前面</li>
          <li><strong>后面（-Z）</strong>：后面</li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">创建立方体贴图</h3>
        <CodeBlock title="创建立方体贴图" code={`// 创建立方体贴图
function createCubemap(gl, images) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
  
  // 立方体贴图的 6 个面
  const faces = [
    gl.TEXTURE_CUBE_MAP_POSITIVE_X,  // 右面 (+X)
    gl.TEXTURE_CUBE_MAP_NEGATIVE_X,  // 左面 (-X)
    gl.TEXTURE_CUBE_MAP_POSITIVE_Y,  // 上面 (+Y)
    gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,  // 下面 (-Y)
    gl.TEXTURE_CUBE_MAP_POSITIVE_Z,  // 前面 (+Z)
    gl.TEXTURE_CUBE_MAP_NEGATIVE_Z   // 后面 (-Z)
  ];
  
  // 上传每个面的纹理数据
  for (let i = 0; i < 6; i++) {
    gl.texImage2D(
      faces[i],
      0,                    // mipmap 级别
      gl.RGBA,              // 内部格式
      gl.RGBA,              // 源格式
      gl.UNSIGNED_BYTE,     // 数据类型
      images[i]             // 图像数据
    );
  }
  
  // 设置纹理参数
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  
  return texture;
}

// 使用示例
const cubemapImages = [
  'right.jpg',   // +X
  'left.jpg',    // -X
  'top.jpg',     // +Y
  'bottom.jpg',  // -Y
  'front.jpg',   // +Z
  'back.jpg'     // -Z
];

Promise.all(cubemapImages.map(url => loadImage(url)))
  .then(images => {
    const cubemap = createCubemap(gl, images);
    // 使用立方体贴图
  });`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">采样立方体贴图</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          立方体贴图使用 3D 方向向量进行采样，而不是 2D 纹理坐标。
          WebGL 会根据方向向量自动选择对应的面并进行采样。
        </p>
        <CodeBlock title="在着色器中采样立方体贴图" code={`// 顶点着色器
attribute vec3 a_position;
attribute vec3 a_normal;
uniform mat4 u_modelMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_projectionMatrix;
uniform vec3 u_cameraPosition;

varying vec3 v_worldPosition;
varying vec3 v_normal;
varying vec3 v_viewDirection;

void main() {
  vec4 worldPos = u_modelMatrix * vec4(a_position, 1.0);
  v_worldPosition = worldPos.xyz;
  v_normal = mat3(u_modelMatrix) * a_normal;
  v_viewDirection = normalize(u_cameraPosition - worldPos.xyz);
  
  gl_Position = u_projectionMatrix * u_viewMatrix * worldPos;
}

// 片段着色器
precision mediump float;
uniform samplerCube u_cubemap;
varying vec3 v_worldPosition;
varying vec3 v_normal;
varying vec3 v_viewDirection;

void main() {
  // 计算反射方向
  vec3 normal = normalize(v_normal);
  vec3 viewDir = normalize(v_viewDirection);
  vec3 reflectDir = reflect(-viewDir, normal);
  
  // 采样立方体贴图
  vec4 color = textureCube(u_cubemap, reflectDir);
  
  gl_FragColor = color;
}`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">应用场景</h3>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">天空盒（Skybox）</strong>：
            <ul className="mt-2 pl-6">
              <li>渲染远处的环境（天空、云彩、山脉等）</li>
              <li>通常使用一个大的立方体，相机位于中心</li>
              <li>使用视图方向（而不是反射方向）采样</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">环境映射（Environment Mapping）</strong>：
            <ul className="mt-2 pl-6">
              <li>模拟物体表面的反射</li>
              <li>使用反射方向采样立方体贴图</li>
              <li>可以创建镜面反射效果</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">折射（Refraction）</strong>：
            <ul className="mt-2 pl-6">
              <li>模拟透明物体的折射效果</li>
              <li>使用折射方向采样立方体贴图</li>
              <li>需要计算折射向量</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">IBL（Image-Based Lighting）</strong>：
            <ul className="mt-2 pl-6">
              <li>基于图像的光照</li>
              <li>使用立方体贴图存储环境光照信息</li>
              <li>用于物理渲染（PBR）</li>
            </ul>
          </li>
        </ul>
        <CodeBlock title="天空盒示例" code={`// 天空盒片段着色器
precision mediump float;
uniform samplerCube u_skybox;
varying vec3 v_viewDirection;  // 视图方向（从顶点到相机）

void main() {
  // 天空盒使用视图方向采样（注意：方向是从顶点指向相机的）
  vec3 dir = normalize(v_viewDirection);
  vec4 color = textureCube(u_skybox, dir);
  gl_FragColor = color;
}

// 反射示例
precision mediump float;
uniform samplerCube u_cubemap;
varying vec3 v_normal;
varying vec3 v_viewDirection;

void main() {
  vec3 normal = normalize(v_normal);
  vec3 viewDir = normalize(v_viewDirection);
  
  // 计算反射方向
  vec3 reflectDir = reflect(-viewDir, normal);
  
  // 采样立方体贴图
  vec4 color = textureCube(u_cubemap, reflectDir);
  gl_FragColor = color;
}

// 折射示例
precision mediump float;
uniform samplerCube u_cubemap;
uniform float u_refractiveIndex;  // 折射率
varying vec3 v_normal;
varying vec3 v_viewDirection;

void main() {
  vec3 normal = normalize(v_normal);
  vec3 viewDir = normalize(v_viewDirection);
  
  // 计算折射方向
  float ratio = 1.0 / u_refractiveIndex;
  vec3 refractDir = refract(-viewDir, normal, ratio);
  
  // 采样立方体贴图
  vec4 color = textureCube(u_cubemap, refractDir);
  gl_FragColor = color;
}`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">立方体贴图的注意事项</h3>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>立方体贴图的 6 个面必须具有相同的尺寸</li>
          <li>每个面的尺寸必须是 2 的幂</li>
          <li>立方体贴图支持 Mipmap（WebGL2 中支持）</li>
          <li>采样方向向量不需要归一化（WebGL 会自动处理）</li>
          <li>立方体贴图的内存占用是单个 2D 纹理的 6 倍</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">纹理优化技巧</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          纹理优化对于提升性能和减少内存占用非常重要。
          下面介绍一些常用的优化技巧。
        </p>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">纹理压缩</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          WebGL 支持多种压缩纹理格式，可以大大减少内存占用和带宽使用。
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">DXT/BC 格式</strong>：桌面 GPU 常用（WebGL 2.0 支持）</li>
          <li><strong className="text-primary font-semibold">ETC1/ETC2</strong>：移动设备常用</li>
          <li><strong className="text-primary font-semibold">PVRTC</strong>：PowerVR GPU 专用</li>
          <li><strong className="text-primary font-semibold">ASTC</strong>：现代移动 GPU 支持</li>
        </ul>
        <CodeBlock title="检查压缩纹理支持" code={`// 检查支持的压缩纹理格式
const extensions = [
  'WEBGL_compressed_texture_s3tc',      // DXT
  'WEBGL_compressed_texture_etc1',      // ETC1
  'WEBGL_compressed_texture_pvrtc',    // PVRTC
  'WEBGL_compressed_texture_astc'       // ASTC
];

const supportedFormats = [];
extensions.forEach(ext => {
  if (gl.getExtension(ext)) {
    supportedFormats.push(ext);
  }
});

console.log('支持的压缩格式:', supportedFormats);`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">纹理图集（Texture Atlas）</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          将多个小纹理打包到一个大纹理中，可以减少纹理切换，提高性能。
        </p>
        <CodeBlock title="纹理图集示例" code={`// 纹理图集：将多个小纹理打包到一个大纹理中
// 优点：
// 1. 减少纹理切换（Draw Call）
// 2. 减少内存碎片
// 3. 提高批处理效率

// 计算纹理图集中的 UV 坐标
function getAtlasUV(atlasWidth, atlasHeight, tileX, tileY, tileWidth, tileHeight) {
  const u = tileX / atlasWidth;
  const v = tileY / atlasHeight;
  const uSize = tileWidth / atlasWidth;
  const vSize = tileHeight / atlasHeight;
  
  return {
    u: u,
    v: v,
    uSize: uSize,
    vSize: vSize
  };
}

// 在着色器中使用
// 顶点着色器
attribute vec2 a_texCoord;
varying vec2 v_texCoord;

void main() {
  // 将局部 UV 坐标转换为图集 UV 坐标
  vec2 atlasUV = vec2(
    u_atlasU + a_texCoord.x * u_atlasUSize,
    u_atlasV + a_texCoord.y * u_atlasVSize
  );
  v_texCoord = atlasUV;
  // ...
}`} language="javascript" />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">纹理流式加载</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          对于大型场景，可以使用纹理流式加载，根据需要动态加载和卸载纹理。
        </p>
        <CodeBlock title="纹理管理示例" code={`// 简单的纹理管理器
class TextureManager {
  constructor(gl) {
    this.gl = gl;
    this.textures = new Map();
    this.loadingPromises = new Map();
  }
  
  async loadTexture(url) {
    // 如果已经加载，直接返回
    if (this.textures.has(url)) {
      return this.textures.get(url);
    }
    
    // 如果正在加载，返回 Promise
    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url);
    }
    
    // 开始加载
    const promise = this.loadTextureInternal(url);
    this.loadingPromises.set(url, promise);
    
    const texture = await promise;
    this.textures.set(url, texture);
    this.loadingPromises.delete(url);
    
    return texture;
  }
  
  async loadTextureInternal(url) {
    const image = await this.loadImage(url);
    return this.createTexture(image);
  }
  
  unloadTexture(url) {
    if (this.textures.has(url)) {
      const texture = this.textures.get(url);
      this.gl.deleteTexture(texture);
      this.textures.delete(url);
    }
  }
  
  // ... 其他方法
}`} language="javascript" />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">常见问题和调试</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          下面列出一些常见问题和调试技巧。
        </p>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">常见问题</h3>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">纹理显示为黑色或紫色</strong>：
            <ul className="mt-2 pl-6">
              <li>检查纹理是否成功加载</li>
              <li>检查纹理坐标是否正确</li>
              <li>检查纹理单元绑定是否正确</li>
              <li>检查 uniform 变量是否正确设置</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">纹理显示错误</strong>：
            <ul className="mt-2 pl-6">
              <li>检查 UV 坐标是否翻转（V 轴可能上下颠倒）</li>
              <li>检查纹理尺寸是否是 2 的幂</li>
              <li>检查纹理格式是否匹配</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">纹理模糊</strong>：
            <ul className="mt-2 pl-6">
              <li>检查过滤模式设置</li>
              <li>检查是否生成了 Mipmap</li>
              <li>检查纹理分辨率是否足够</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">性能问题</strong>：
            <ul className="mt-2 pl-6">
              <li>检查纹理尺寸是否过大</li>
              <li>检查是否使用了过多的纹理</li>
              <li>检查纹理切换次数（Draw Call）</li>
            </ul>
          </li>
        </ul>
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">调试技巧</h3>
        <CodeBlock title="纹理调试技巧" code={`// 1. 可视化纹理坐标
// 在片段着色器中
gl_FragColor = vec4(v_texCoord, 0.0, 1.0);
// R 通道显示 U，G 通道显示 V

// 2. 检查纹理是否加载
function checkTexture(gl, texture) {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  const width = gl.getTexParameter(gl.TEXTURE_2D, gl.TEXTURE_WIDTH);
  const height = gl.getTexParameter(gl.TEXTURE_2D, gl.TEXTURE_HEIGHT);
  console.log('纹理尺寸:', width, 'x', height);
  
  if (width === 0 || height === 0) {
    console.error('纹理未正确加载！');
  }
}

// 3. 检查纹理单元绑定
function checkTextureBinding(gl, unit) {
  gl.activeTexture(gl.TEXTURE0 + unit);
  const texture = gl.getParameter(gl.TEXTURE_BINDING_2D);
  console.log(\`纹理单元 \${unit} 绑定的纹理:\`, texture);
}

// 4. 导出纹理数据（用于调试）
function readTextureData(gl, texture, width, height) {
  const framebuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture,
    0
  );
  
  const pixels = new Uint8Array(width * height * 4);
  gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  
  gl.deleteFramebuffer(framebuffer);
  return pixels;
}`} language="javascript" />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">关键概念总结</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          本章介绍了材质和纹理的核心概念，以下是关键内容的总结：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">材质（Material）</strong>：
            <ul className="mt-2 pl-6">
              <li>定义物体表面的视觉属性</li>
              <li>包括颜色、纹理、光照属性、透明度等</li>
              <li>材质系统连接几何形状和视觉效果</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">纹理坐标（UV 坐标）</strong>：
            <ul className="mt-2 pl-6">
              <li>范围 [0, 1]，指定纹理上的位置</li>
              <li>U 轴：水平方向，V 轴：垂直方向</li>
              <li>在光栅化过程中会被插值</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">纹理过滤</strong>：
            <ul className="mt-2 pl-6">
              <li>NEAREST：最近邻采样，像素化效果</li>
              <li>LINEAR：线性插值，平滑效果</li>
              <li>Mipmap：多级纹理，提升远距离渲染质量</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">纹理包装</strong>：
            <ul className="mt-2 pl-6">
              <li>REPEAT：重复纹理</li>
              <li>CLAMP_TO_EDGE：夹紧到边缘</li>
              <li>MIRRORED_REPEAT：镜像重复</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">程序化纹理</strong>：
            <ul className="mt-2 pl-6">
              <li>使用着色器代码生成纹理</li>
              <li>无内存占用，无限分辨率</li>
              <li>可参数化和动画化</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">多纹理</strong>：
            <ul className="mt-2 pl-6">
              <li>同时使用多个纹理单元</li>
              <li>可以组合不同的纹理贴图（漫反射、法线、粗糙度等）</li>
              <li>实现复杂的材质效果</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">立方体贴图（Cubemap）</strong>：
            <ul className="mt-2 pl-6">
              <li>由 6 个 2D 纹理组成</li>
              <li>使用 3D 方向向量采样</li>
              <li>用于天空盒、环境映射、反射等</li>
            </ul>
          </li>
          <li><strong className="text-primary font-semibold">纹理优化</strong>：
            <ul className="mt-2 pl-6">
              <li>纹理压缩：减少内存占用</li>
              <li>纹理图集：减少纹理切换</li>
              <li>纹理流式加载：动态加载和卸载</li>
            </ul>
          </li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          <strong className="text-primary font-semibold">学习建议</strong>：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li>多实践，尝试不同的纹理参数设置</li>
          <li>理解纹理坐标的插值过程</li>
          <li>学习使用程序化纹理创建各种效果</li>
          <li>掌握多纹理的使用，创建复杂的材质</li>
          <li>注意纹理优化，提升性能</li>
        </ul>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          掌握材质和纹理后，你就可以创建更加真实和丰富的 3D 场景了！
        </p>
      </section>
      
      <ChapterNavigation />
    </div>
  )
}

