// 自动生成，请勿手动编辑
export interface ChapterMetadata {
  id: number
  title: string
  description: string
  path: string
  order: number
  created: Date
  modified: Date
  size: number
  keywords?: string[]
}

export const chaptersMetadata: ChapterMetadata[] = [
  {
    id: 0,
    title: "第零章：从零开始创建 WebGL 项目",
    description: "手把手教你创建 canvas 元素，获取 WebGL 上下文，搭建第一个 WebGL 项目",
    path: "/chapter/0",
    order: 0,
    created: new Date("2025-12-30T09:24:43.422Z"),
    modified: new Date("2025-12-30T09:36:24.558Z"),
    size: 3015,
    keywords: ["创建项目","canvas","上下文","初始化"]
  },
  {
    id: 1,
    title: "第一章：WebGL 基础",
    description: "学习 WebGL 的基本概念，绘制第一个三角形，了解着色器的工作原理",
    path: "/chapter/1",
    order: 1,
    created: new Date("2025-12-30T09:47:35.007Z"),
    modified: new Date("2025-12-30T09:48:10.730Z"),
    size: 16113,
    keywords: ["webgl基础","三角形","着色器","shader","顶点着色器","片段着色器","渲染管线","缓冲区","buffer","attribute","uniform","varying","坐标系统","绘制模式"]
  }
]
