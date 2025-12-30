---
title: "第一章：WebGL 基础"
description: "学习 WebGL 的基本概念，绘制第一个三角形，了解着色器的工作原理"
order: 1
path: "/chapter/1"
keywords:
  - "webgl基础"
  - "三角形"
  - "着色器"
  - "shader"
  - "顶点着色器"
  - "片段着色器"
  - "渲染管线"
  - "缓冲区"
  - "buffer"
  - "attribute"
  - "uniform"
  - "varying"
  - "坐标系统"
  - "绘制模式"
---

## 什么是 WebGL？

WebGL（Web Graphics Library）是一个 JavaScript API，用于在浏览器中渲染交互式 2D 和 3D 图形。WebGL2 基于 OpenGL ES 3.0，允许你直接使用 GPU 进行图形渲染。WebGL 不需要插件，在现代浏览器中都有原生支持。

WebGL 的核心优势：

- **硬件加速**：利用 GPU 的并行处理能力，性能远超 Canvas 2D
- **跨平台**：在所有现代浏览器和移动设备上都能运行
- **强大的渲染能力**：支持复杂的 3D 场景、光照、阴影等高级效果
- **可编程性**：通过着色器完全控制渲染流程

WebGL 的核心概念包括：

- **着色器（Shaders）**：运行在 GPU 上的小程序，用于处理顶点和像素
- **缓冲区（Buffers）**：存储顶点数据、颜色等信息的 GPU 内存
- **纹理（Textures）**：用于存储图像数据
- **渲染管线（Pipeline）**：从顶点数据到最终像素的渲染流程
- **上下文（Context）**：WebGL 的渲染上下文，包含所有状态和函数

## WebGL 渲染管线

WebGL 渲染管线是将 3D 场景转换为 2D 图像的过程。理解渲染管线对于掌握 WebGL 至关重要。

WebGL 渲染管线的主要阶段：

1. **顶点数据输入**：将顶点位置、颜色、纹理坐标等数据上传到 GPU 缓冲区
2. **顶点着色器（Vertex Shader）**：
   - 对每个顶点执行一次
   - 进行坐标变换（模型、视图、投影变换）
   - 计算顶点颜色、纹理坐标等属性
   - 输出裁剪空间坐标（gl_Position）
3. **图元装配（Primitive Assembly）**：
   - 将顶点组装成图元（点、线、三角形）
   - 进行裁剪（Clipping）：移除视锥外的部分
   - 进行透视除法：将齐次坐标转换为归一化设备坐标
4. **光栅化（Rasterization）**：
   - 将图元转换为片段（Fragment，即像素候选）
   - 对顶点属性进行插值（如颜色、纹理坐标）
   - 确定哪些像素被图元覆盖
5. **片段着色器（Fragment Shader）**：
   - 对每个片段执行一次
   - 计算最终颜色（gl_FragColor）
   - 可以进行纹理采样、光照计算等
6. **片段测试和混合**：
   - 深度测试（Depth Test）：决定片段是否可见
   - 模板测试（Stencil Test）：用于特殊效果
   - 混合（Blending）：将新颜色与已有颜色混合
7. **帧缓冲区**：最终图像写入帧缓冲区，显示在屏幕上

**重要提示**：在 WebGL 中，我们主要控制顶点着色器和片段着色器，其他阶段由 GPU 自动处理。

## 第一个三角形

让我们从最简单的例子开始：绘制一个三角形。这是 WebGL 的"Hello World"。

<FlipCard width={400} height={400}>
  <onInit>
    {(gl, canvas) => {
      const vertexShaderSource = `attribute vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}`

      const fragmentShaderSource = `
precision mediump float;

uniform vec4 u_color;

void main() {
  gl_FragColor = u_color;
}
`
      
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
  </onInit>
  <codeBlock title="顶点着色器" language="glsl">
attribute vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
  </codeBlock>
  <codeBlock title="片段着色器" language="glsl">
precision mediump float;

uniform vec4 u_color;

void main() {
  gl_FragColor = u_color;
}
  </codeBlock>
</FlipCard>

### 代码解析

- **顶点着色器**：接收顶点位置（a_position），设置 gl_Position
- **片段着色器**：设置每个像素的颜色（gl_FragColor）
- **attribute**：每个顶点不同的数据（如位置、颜色、纹理坐标）
- **uniform**：所有顶点共享的数据（如颜色、变换矩阵）

### Attribute 和 Uniform 的区别

理解 `attribute` 和 `uniform` 的区别是掌握 WebGL 的关键。它们是着色器中两种不同的输入变量类型。

#### Attribute（属性变量）

**定义**：`attribute` 是顶点着色器的输入变量，用于接收每个顶点不同的数据。

**特点**：

- **每个顶点都有不同的值**：例如，3个顶点就有3个不同的位置值
- **只能在顶点着色器中使用**：片段着色器无法直接访问 attribute
- **从缓冲区读取**：数据存储在 GPU 缓冲区中，通过 `gl.vertexAttribPointer()` 设置
- **执行频率**：顶点着色器对每个顶点执行一次，所以每个顶点都会读取不同的 attribute 值
- **常见用途**：顶点位置、顶点颜色、纹理坐标、法向量等

**示例**：

<CodeBlock title="Attribute 示例" language="glsl">
// 顶点着色器
attribute vec2 a_position;  // 每个顶点有不同的位置
attribute vec3 a_color;      // 每个顶点有不同的颜色

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}

// JavaScript 代码
// 为每个顶点设置不同的位置
const positions = [
  0.0,  0.5,   // 顶点1的位置
  -0.5, -0.5,  // 顶点2的位置
  0.5,  -0.5   // 顶点3的位置
]
// 每个顶点都会读取对应的位置值
</CodeBlock>

#### Uniform（统一变量）

**定义**：`uniform` 是所有顶点或片段共享的常量，在一次绘制调用中保持不变。

**特点**：

- **所有顶点/片段共享同一个值**：在一次绘制调用中，uniform 的值对所有顶点和片段都相同
- **可以在顶点和片段着色器中使用**：两个着色器都可以访问 uniform
- **通过 JavaScript 设置**：使用 `gl.uniform*()` 函数设置值
- **执行频率**：虽然着色器对每个顶点/片段执行，但 uniform 的值在整个绘制过程中保持不变
- **可以随时修改**：在每次绘制前可以改变 uniform 的值，但一次绘制中保持不变
- **常见用途**：变换矩阵、时间、全局颜色、光照参数等

**示例**：

<CodeBlock title="Uniform 示例" language="glsl">
// 片段着色器
precision mediump float;
uniform vec4 u_color;  // 所有片段共享同一个颜色

void main() {
  gl_FragColor = u_color;  // 所有像素都是同一个颜色
}

// JavaScript 代码
const colorLocation = gl.getUniformLocation(program, 'u_color')
gl.uniform4f(colorLocation, 0.2, 0.6, 1.0, 1.0)  // 设置一次，所有片段都使用这个颜色
</CodeBlock>

#### 对比总结

| 特性 | Attribute | Uniform |
|------|-----------|---------|
| 值的变化 | 每个顶点不同 | 所有顶点/片段相同 |
| 使用位置 | 仅顶点着色器 | 顶点和片段着色器 |
| 数据来源 | GPU 缓冲区 | JavaScript 直接设置 |
| 设置方式 | gl.vertexAttribPointer() | gl.uniform*() |
| 典型用途 | 位置、颜色、纹理坐标 | 变换矩阵、时间、全局参数 |

### precision mediump float 的意义

在片段着色器中，你经常会看到第一行是 `precision mediump float;`，这是 GLSL 的精度限定符声明。

#### 为什么需要精度声明？

在 WebGL2（GLSL ES 3.00）中，虽然片段着色器中的 float 默认精度是 highp，但显式声明精度仍然是一个好习惯。使用 `precision mediump float;` 可以在性能和精度之间取得平衡，适合大多数应用场景。

#### 精度级别

GLSL 提供了三种精度级别：

- **highp**：高精度
  - 精度：至少 32 位浮点数
  - 范围：-2^62 到 2^62
  - 用途：需要高精度的计算（如复杂的光照计算）
  - 性能：较慢，消耗更多资源
  - 兼容性：某些设备可能不支持
- **mediump**：中等精度（推荐）
  - 精度：至少 16 位浮点数
  - 范围：-2^14 到 2^14
  - 用途：大多数颜色和纹理计算
  - 性能：平衡性能和精度
  - 兼容性：所有设备都支持
- **lowp**：低精度
  - 精度：至少 10 位浮点数
  - 范围：-2 到 2
  - 用途：简单的颜色计算，不需要高精度
  - 性能：最快，消耗资源最少
  - 兼容性：所有设备都支持

#### 为什么使用 mediump？

`precision mediump float;` 是最常用的选择，原因如下：

- **精度足够**：16 位精度对于大多数颜色和纹理计算已经足够
- **性能良好**：比 highp 快，比 lowp 精度高，是性能和精度的最佳平衡
- **兼容性好**：所有支持 WebGL 的设备都支持 mediump
- **标准做法**：这是 WebGL 开发中的标准实践

#### 使用示例

<CodeBlock title="精度声明示例" language="glsl">
// ✅ 正确：声明了精度
precision mediump float;

uniform vec4 u_color;

void main() {
  gl_FragColor = u_color;
}

// ❌ 错误：没有声明精度
uniform vec4 u_color;

void main() {
  gl_FragColor = u_color;  // 编译错误：float 类型未定义精度
}

// 也可以为特定变量指定精度
precision mediump float;

highp float complexCalculation;  // 这个变量使用高精度
mediump vec3 color;              // 这个变量使用中等精度
lowp float simpleValue;          // 这个变量使用低精度
</CodeBlock>

**重要提示**：

- 顶点着色器不需要声明精度，因为顶点着色器中的 `float` 默认是 `highp`
- 片段着色器必须声明精度，否则无法使用 `float` 类型
- 如果没有特殊需求，始终使用 `precision mediump float;` 是最安全的选择
- 精度声明应该放在片段着色器的最开始，在任何变量声明之前

## 彩色三角形

现在让我们为每个顶点添加不同的颜色，看看 WebGL 如何插值颜色。

<FlipCard width={400} height={400}>
  <onInit>
    {(gl, canvas) => {
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
      
      const positions = [0, 0.5, -0.5, -0.5, 0.5, -0.5]
      const colors = [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]
      
      const positionBuffer = createBuffer(gl, positions)
      const colorBuffer = createBuffer(gl, colors)
      
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.clearColor(0.1, 0.1, 0.1, 1.0)
      
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.useProgram(program)
      
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      setAttribute(gl, program, 'a_position', 2)
      
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
      setAttribute(gl, program, 'a_color', 3)
      
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }}
  </onInit>
  <codeBlock title="顶点着色器" language="glsl">
attribute vec2 a_position;
attribute vec3 a_color;
varying vec3 v_color;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_color = a_color;
}
  </codeBlock>
  <codeBlock title="片段着色器" language="glsl">
precision mediump float;
varying vec3 v_color;

void main() {
  gl_FragColor = vec4(v_color, 1.0);
}
  </codeBlock>
  <codeBlock title="JavaScript 代码" language="javascript">
// 顶点位置（3个顶点）
const positions = [0, 0.5, -0.5, -0.5, 0.5, -0.5]

// 顶点颜色（RGB，每个顶点一个颜色）
// 红色、绿色、蓝色
const colors = [
  1.0, 0.0, 0.0,  // 顶点1：红色
  0.0, 1.0, 0.0,  // 顶点2：绿色
  0.0, 0.0, 1.0   // 顶点3：蓝色
]

// 创建缓冲区
const positionBuffer = createBuffer(gl, positions)
const colorBuffer = createBuffer(gl, colors)

// 设置顶点位置属性
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
setAttribute(gl, program, 'a_position', 2)

// 设置顶点颜色属性
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
setAttribute(gl, program, 'a_color', 3)

// 绘制
gl.drawArrays(gl.TRIANGLES, 0, 3)
  </codeBlock>
</FlipCard>

注意观察三角形内部的颜色是如何平滑过渡的。这是因为 WebGL 在光栅化阶段会对顶点颜色进行插值。

- **varying**：从顶点着色器传递到片段着色器的变量，会被自动插值
- 每个顶点的颜色不同，WebGL 会在三角形内部进行线性插值
- 顶点着色器中的 `v_color = a_color` 将每个顶点的颜色传递给片段着色器
- 片段着色器接收到的 `v_color` 是经过插值后的颜色值

## WebGL 坐标系统

WebGL 使用归一化设备坐标（NDC，Normalized Device Coordinates），坐标范围从 -1 到 1：

- **X 轴**：-1（左）到 1（右）
- **Y 轴**：-1（下）到 1（上）
- **Z 轴**：-1（近）到 1（远）

**重要提示**：

- Y 轴向上为正，这与屏幕坐标系统（Y 轴向下）不同
- 坐标 (0, 0) 位于画布中心
- 超出 [-1, 1] 范围的顶点会被裁剪掉
- 在后续章节中，我们会学习如何使用矩阵变换来将任意坐标转换到 NDC 空间

## WebGL 绘制模式

WebGL 支持多种绘制模式，通过 `gl.drawArrays` 的第一个参数指定：

- **gl.POINTS**：绘制独立的点
- **gl.LINES**：每两个顶点绘制一条线段
- **gl.LINE_STRIP**：连接所有顶点形成连续线段
- **gl.LINE_LOOP**：类似 LINE_STRIP，但首尾相连
- **gl.TRIANGLES**：每三个顶点绘制一个三角形
- **gl.TRIANGLE_STRIP**：共享边的三角形带
- **gl.TRIANGLE_FAN**：从第一个顶点出发的三角形扇

选择合适的模式可以优化性能并简化代码。

## WebGL 基本步骤

创建一个 WebGL 程序通常遵循以下步骤：

1. **获取 WebGL 上下文**：`canvas.getContext('webgl')`
2. **创建着色器程序**：编写顶点着色器和片段着色器源代码，编译并链接
3. **准备顶点数据**：定义顶点位置、颜色、纹理坐标等
4. **创建缓冲区**：将顶点数据上传到 GPU
5. **设置视口**：`gl.viewport(0, 0, width, height)`
6. **清除画布**：`gl.clear(gl.COLOR_BUFFER_BIT)`
7. **使用着色器程序**：`gl.useProgram(program)`
8. **绑定缓冲区**：`gl.bindBuffer(gl.ARRAY_BUFFER, buffer)`
9. **设置属性指针**：告诉 WebGL 如何读取顶点数据
10. **设置统一变量**：`gl.uniform*()`
11. **绘制**：`gl.drawArrays()` 或 `gl.drawElements()`

## 关键概念总结

- **着色器程序**：顶点着色器 + 片段着色器，运行在 GPU 上
- **缓冲区（Buffer）**：存储顶点数据、颜色等信息的 GPU 内存
- **属性（Attribute）**：每个顶点不同的数据（如位置、颜色、纹理坐标）
- **统一变量（Uniform）**：所有顶点/片段共享的数据（如颜色、变换矩阵、时间）
- **变量（Varying）**：从顶点着色器传递到片段着色器，会被自动插值
- **gl.drawArrays**：绘制图元（点、线、三角形），使用连续顶点
- **gl.drawElements**：使用索引缓冲区绘制，可以共享顶点
- **索引缓冲区**：定义顶点的连接方式，减少重复顶点
- **归一化设备坐标（NDC）**：WebGL 的坐标系统，范围 [-1, 1]
- **渲染管线**：从顶点数据到最终像素的完整流程

掌握了这些基础概念后，我们就可以开始学习更高级的主题，如变换、光照和纹理。

