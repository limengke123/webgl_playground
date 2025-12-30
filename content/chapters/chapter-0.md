---
title: "第零章：从零开始创建 WebGL 项目"
description: "手把手教你创建 canvas 元素，获取 WebGL 上下文，搭建第一个 WebGL 项目"
order: 0
path: "/chapter/0"
keywords:
  - "创建项目"
  - "canvas"
  - "上下文"
  - "初始化"
---

# 第零章：从零开始创建 WebGL 项目

## 准备工作

在学习 WebGL 之前，我们需要先了解如何创建一个基本的 WebGL 项目。本章将手把手教你如何从零开始搭建一个 WebGL 项目。

你需要准备：

- **现代浏览器**：Chrome、Firefox、Safari、Edge 等（支持 WebGL）
- **代码编辑器**：VS Code、WebStorm 等
- **本地服务器**：可以使用 VS Code 的 Live Server 插件，或者 Node.js 的 http-server

**重要提示**：WebGL 需要通过 HTTP 协议访问，不能直接打开 HTML 文件（file:// 协议）。必须使用本地服务器运行项目。

## 第一步：创建 HTML 文件

首先，创建一个基本的 HTML 文件。这是所有 WebGL 项目的起点。

<CodeBlock title="index.html" language="html">
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WebGL 项目</title>
</head>
<body>
  <canvas id="glCanvas" width="800" height="600"></canvas>
</body>
</html>
</CodeBlock>

关键点：

- `<canvas>` 元素是 WebGL 的渲染目标
- `id` 属性用于在 JavaScript 中获取 canvas 元素
- `width` 和 `height` 属性设置画布尺寸（像素）
- 注意：不要使用 CSS 来设置 canvas 尺寸，这会导致渲染问题

## 实际示例

下面是一个可以运行的示例。这个示例展示了如何创建 canvas 并获取 WebGL 上下文，然后清除画布显示背景色。

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

