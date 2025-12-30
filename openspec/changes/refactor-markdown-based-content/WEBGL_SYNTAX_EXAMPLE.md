# WebGL 代码在 Markdown 中的使用示例

本文档展示了如何在 Markdown 文件中使用 WebGL 相关的组件，特别是 `FlipCard` 组件。

## FlipCard 组件语法

`FlipCard` 组件用于展示可交互的 WebGL 示例，用户可以在 WebGL 渲染效果和代码之间切换。

### 基本语法

```markdown
<FlipCard width={400} height={300}>
  <onInit>
    {(gl, canvas) => {
      // WebGL 初始化代码
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.clearColor(0.1, 0.2, 0.3, 1.0)
      gl.clear(gl.COLOR_BUFFER_BIT)
    }}
  </onInit>
  <codeBlock title="JavaScript 代码" language="javascript">
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clearColor(0.1, 0.2, 0.3, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)
  </codeBlock>
</FlipCard>
```

### 多个代码块

```markdown
<FlipCard width={400} height={300}>
  <onInit>
    {(gl, canvas) => {
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.clearColor(0.1, 0.2, 0.3, 1.0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      
      console.log('WebGL 版本:', gl.getParameter(gl.VERSION))
    }}
  </onInit>
  <codeBlock title="JavaScript 代码" language="javascript">
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clearColor(0.1, 0.2, 0.3, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)
  </codeBlock>
  <codeBlock title="控制台输出" language="text">
    WebGL 版本: WebGL 2.0
  </codeBlock>
</FlipCard>
```

### 复杂 WebGL 示例

```markdown
<FlipCard width={400} height={300}>
  <onInit>
    {(gl, canvas) => {
      // 设置视口
      gl.viewport(0, 0, canvas.width, canvas.height)
      
      // 设置清除颜色为深蓝色
      gl.clearColor(0.1, 0.2, 0.3, 1.0)
      
      // 清除画布
      gl.clear(gl.COLOR_BUFFER_BIT)
      
      // 在控制台输出 WebGL2 信息
      console.log('WebGL 版本:', gl.getParameter(gl.VERSION))
      console.log('着色器语言版本:', gl.getParameter(gl.SHADING_LANGUAGE_VERSION))
      console.log('渲染器:', gl.getParameter(gl.RENDERER))
      console.log('供应商:', gl.getParameter(gl.VENDOR))
    }}
  </onInit>
  <codeBlock title="JavaScript 代码" language="javascript">
    // 设置视口
    gl.viewport(0, 0, canvas.width, canvas.height)
    
    // 设置清除颜色为深蓝色
    gl.clearColor(0.1, 0.2, 0.3, 1.0)
    
    // 清除画布
    gl.clear(gl.COLOR_BUFFER_BIT)
    
    // 在控制台输出 WebGL2 信息
    console.log('WebGL 版本:', gl.getParameter(gl.VERSION))
    console.log('着色器语言版本:', gl.getParameter(gl.SHADING_LANGUAGE_VERSION))
    console.log('渲染器:', gl.getParameter(gl.RENDERER))
    console.log('供应商:', gl.getParameter(gl.VENDOR))
  </codeBlock>
</FlipCard>
```

## 转换后的效果

上述 Markdown 代码会被转换为以下 React 组件代码：

```tsx
<FlipCard 
  width={400} 
  height={300}
  onInit={(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement) => {
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clearColor(0.1, 0.2, 0.3, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)
  }}
  codeBlocks={[
    { 
      title: "JavaScript 代码", 
      code: "gl.viewport(0, 0, canvas.width, canvas.height)\ngl.clearColor(0.1, 0.2, 0.3, 1.0)\ngl.clear(gl.COLOR_BUFFER_BIT)",
      language: "javascript"
    }
  ]}
/>
```

## 注意事项

1. **函数参数类型**：转换脚本会自动为 `onInit` 函数添加类型注解 `(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement)`
2. **代码格式**：`<onInit>` 标签内的代码必须是有效的 JavaScript/TypeScript 代码
3. **代码块顺序**：多个 `<codeBlock>` 标签会按照出现的顺序转换为数组
4. **WebGL 上下文**：`onInit` 函数会在 WebGL 上下文创建后立即执行，此时可以安全地调用所有 WebGL API

## 其他组件

### CodeBlock 组件

```markdown
<CodeBlock title="index.html" language="html">
<!DOCTYPE html>
<html>
  <body>Hello World</body>
</html>
</CodeBlock>
```

### WebGLCanvas 组件（独立使用）

```markdown
<WebGLCanvas width={400} height={300}>
  <onInit>
    {(gl, canvas) => {
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.clearColor(1.0, 0.0, 0.0, 1.0)
      gl.clear(gl.COLOR_BUFFER_BIT)
    }}
  </onInit>
</WebGLCanvas>
```

