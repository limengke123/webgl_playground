import { useState, useRef, useEffect } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { autocompletion } from '@codemirror/autocomplete'
import { createProgram, createBuffer, setAttribute, Matrix, createIndexBuffer } from '../utils/webgl'

const defaultCode = `// WebGL Playground
// 在这里编写你的 WebGL 代码

// 顶点着色器
const vertexShader = \`
  attribute vec2 a_position;
  uniform mediump float u_time;
  
  void main() {
    vec2 pos = a_position;
    pos.x += sin(u_time + pos.y * 2.0) * 0.1;
    gl_Position = vec4(pos, 0.0, 1.0);
  }
\`

// 片段着色器
const fragmentShader = \`
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
\`

// 初始化函数
function init(gl, canvas) {
  // 创建着色器程序
  const program = createProgram(gl, vertexShader, fragmentShader)
  
  // 创建顶点数据
  const positions = [-0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5]
  const indices = [0, 1, 2, 0, 2, 3]
  
  const positionBuffer = createBuffer(gl, positions)
  const indexBuffer = createIndexBuffer(gl, indices)
  
  const timeLocation = gl.getUniformLocation(program, 'u_time')
  const resolutionLocation = gl.getUniformLocation(program, 'u_resolution')
  
  gl.viewport(0, 0, canvas.width, canvas.height)
  gl.clearColor(0.1, 0.1, 0.1, 1.0)
  
  let time = 0
  function render() {
    time += 0.02
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.useProgram(program)
    
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    setAttribute(gl, program, 'a_position', 2)
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    
    gl.uniform1f(timeLocation, time)
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height)
    
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
    requestAnimationFrame(render)
  }
  render()
}`

const templates = [
  {
    name: '动画示例',
    code: defaultCode
  },
  {
    name: '基础三角形',
    code: `// 基础三角形
const vertexShader = \`
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
\`

const fragmentShader = \`
  precision mediump float;
  uniform vec4 u_color;
  void main() {
    gl_FragColor = u_color;
  }
\`

function init(gl, canvas) {
  const program = createProgram(gl, vertexShader, fragmentShader)
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
}`
  },
  {
    name: '旋转三角形',
    code: `// 旋转三角形
const vertexShader = \`
  attribute vec2 a_position;
  uniform mat4 u_matrix;
  void main() {
    gl_Position = u_matrix * vec4(a_position, 0.0, 1.0);
  }
\`

const fragmentShader = \`
  precision mediump float;
  uniform vec4 u_color;
  void main() {
    gl_FragColor = u_color;
  }
\`

function init(gl, canvas) {
  const program = createProgram(gl, vertexShader, fragmentShader)
  const positions = [0, 0.3, -0.3, -0.3, 0.3, -0.3]
  const positionBuffer = createBuffer(gl, positions)
  const matrixLocation = gl.getUniformLocation(program, 'u_matrix')
  const colorLocation = gl.getUniformLocation(program, 'u_color')
  
  gl.viewport(0, 0, canvas.width, canvas.height)
  gl.clearColor(0.1, 0.1, 0.1, 1.0)
  
  let angle = 0
  function render() {
    angle += 0.02
    const rotation = Matrix.rotationZ(angle)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.useProgram(program)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    setAttribute(gl, program, 'a_position', 2)
    gl.uniformMatrix4fv(matrixLocation, false, rotation)
    gl.uniform4f(colorLocation, 0.2, 0.6, 1.0, 1.0)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
    requestAnimationFrame(render)
  }
  render()
}`
  },
  {
    name: '彩色渐变',
    code: `// 彩色渐变
const vertexShader = \`
  attribute vec2 a_position;
  attribute vec3 a_color;
  varying vec3 v_color;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_color = a_color;
  }
\`

const fragmentShader = \`
  precision mediump float;
  varying vec3 v_color;
  void main() {
    gl_FragColor = vec4(v_color, 1.0);
  }
\`

function init(gl, canvas) {
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
}`
  }
]

// WebGL API 自动补全提示
const webglCompletions = [
  // WebGL 上下文方法
  { label: 'gl.clear', type: 'function', info: '清除指定的缓冲区' },
  { label: 'gl.clearColor', type: 'function', info: '设置清除颜色' },
  { label: 'gl.viewport', type: 'function', info: '设置视口' },
  { label: 'gl.useProgram', type: 'function', info: '使用着色器程序' },
  { label: 'gl.drawArrays', type: 'function', info: '绘制图元' },
  { label: 'gl.drawElements', type: 'function', info: '使用索引绘制图元' },
  { label: 'gl.getUniformLocation', type: 'function', info: '获取 uniform 变量位置' },
  { label: 'gl.getAttribLocation', type: 'function', info: '获取 attribute 变量位置' },
  { label: 'gl.uniform1f', type: 'function', info: '设置 float uniform' },
  { label: 'gl.uniform2f', type: 'function', info: '设置 vec2 uniform' },
  { label: 'gl.uniform3f', type: 'function', info: '设置 vec3 uniform' },
  { label: 'gl.uniform4f', type: 'function', info: '设置 vec4 uniform' },
  { label: 'gl.uniformMatrix4fv', type: 'function', info: '设置 mat4 uniform' },
  { label: 'gl.createBuffer', type: 'function', info: '创建缓冲区' },
  { label: 'gl.bindBuffer', type: 'function', info: '绑定缓冲区' },
  { label: 'gl.bufferData', type: 'function', info: '上传缓冲区数据' },
  { label: 'gl.enableVertexAttribArray', type: 'function', info: '启用顶点属性数组' },
  { label: 'gl.vertexAttribPointer', type: 'function', info: '设置顶点属性指针' },
  
  // 工具函数
  { label: 'createProgram', type: 'function', info: '创建着色器程序' },
  { label: 'createBuffer', type: 'function', info: '创建并上传缓冲区数据' },
  { label: 'createIndexBuffer', type: 'function', info: '创建索引缓冲区' },
  { label: 'setAttribute', type: 'function', info: '设置顶点属性' },
  { label: 'Matrix', type: 'object', info: '矩阵工具对象' },
  { label: 'Matrix.translation', type: 'function', info: '创建平移矩阵' },
  { label: 'Matrix.rotationX', type: 'function', info: '创建绕 X 轴旋转矩阵' },
  { label: 'Matrix.rotationY', type: 'function', info: '创建绕 Y 轴旋转矩阵' },
  { label: 'Matrix.rotationZ', type: 'function', info: '创建绕 Z 轴旋转矩阵' },
  { label: 'Matrix.scaling', type: 'function', info: '创建缩放矩阵' },
  { label: 'Matrix.multiply', type: 'function', info: '矩阵相乘' },
  { label: 'Matrix.perspective', type: 'function', info: '创建透视投影矩阵' },
  { label: 'Matrix.ortho', type: 'function', info: '创建正交投影矩阵' },
  { label: 'Matrix.lookAt', type: 'function', info: '创建视图矩阵' },
  
  // 常用变量
  { label: 'gl', type: 'variable', info: 'WebGL 上下文' },
  { label: 'canvas', type: 'variable', info: 'Canvas 元素' },
  { label: 'requestAnimationFrame', type: 'function', info: '请求动画帧' },
]

// 自定义自动补全
const webglAutocomplete = autocompletion({
  override: [
    (context) => {
      const word = context.matchBefore(/\w*/)
      if (!word) return null
      if (word.from === word.to && !context.explicit) return null
      
      return {
        from: word.from,
        options: webglCompletions.map(item => ({
          label: item.label,
          type: item.type,
          info: item.info,
        })),
      }
    },
  ],
})

export default function Playground() {
  const [code, setCode] = useState(defaultCode)
  const [error, setError] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [canvasKey, setCanvasKey] = useState(0) // 用于强制重新创建 canvas
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const glRef = useRef<WebGLRenderingContext | null>(null)
  const cleanupRef = useRef<(() => void) | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    // 检查当前主题
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    checkTheme()
    
    // 监听主题变化
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    
    return () => observer.disconnect()
  }, [])

  const animationFrames = useRef<number[]>([])

  const stopAnimation = () => {
    animationFrames.current.forEach(id => {
      try {
        cancelAnimationFrame(id)
      } catch (e) {
        // 忽略已取消的动画帧错误
      }
    })
    animationFrames.current = []
    if (animationFrameRef.current) {
      try {
        cancelAnimationFrame(animationFrameRef.current)
      } catch (e) {
        // 忽略已取消的动画帧错误
      }
      animationFrameRef.current = null
    }
  }

  const cleanup = () => {
    stopAnimation()
    // 清理用户代码设置的清理函数
    if (cleanupRef.current) {
      try {
        cleanupRef.current()
      } catch (e) {
        // 忽略清理错误
      }
      cleanupRef.current = null
    }
    // 清理 WebGL 上下文
    if (glRef.current) {
      // 重置 WebGL 状态
      const gl = glRef.current
      try {
        // 取消所有绑定
        gl.bindBuffer(gl.ARRAY_BUFFER, null)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
        gl.bindTexture(gl.TEXTURE_2D, null)
        gl.useProgram(null)
      } catch (e) {
        // 忽略错误
      }
      glRef.current = null
    }
  }

  // 执行代码的内部函数
  const executeCode = (codeToRun: string) => {
    cleanup()
    setError('')
    setIsRunning(true)

    const canvas = canvasRef.current
    if (!canvas) {
      setError('Canvas 未找到')
      setIsRunning(false)
      return
    }

    // 获取或创建 WebGL 上下文
    let gl: WebGLRenderingContext | null = null
    try {
      // 先尝试获取现有上下文
      gl = canvas.getContext('webgl', {
        antialias: true,
        preserveDrawingBuffer: false,
      }) as WebGLRenderingContext
      
      if (!gl) {
        gl = canvas.getContext('experimental-webgl') as WebGLRenderingContext
      }
      
      if (!gl) {
        setError('无法创建 WebGL 上下文')
        setIsRunning(false)
        return
      }
    } catch (e) {
      setError(`创建 WebGL 上下文失败: ${e instanceof Error ? e.message : String(e)}`)
      setIsRunning(false)
      return
    }

    // 清理之前的上下文状态
    if (glRef.current && glRef.current !== gl) {
      try {
        glRef.current.bindBuffer(glRef.current.ARRAY_BUFFER, null)
        glRef.current.bindBuffer(glRef.current.ELEMENT_ARRAY_BUFFER, null)
        glRef.current.useProgram(null)
      } catch (e) {
        // 忽略错误
      }
    }

    glRef.current = gl

    // 保存原始的 requestAnimationFrame，在 try 块外定义以确保 catch 块可以访问
    const originalRAF = window.requestAnimationFrame

    try {
      // 创建一个标志来跟踪上下文是否仍然有效
      let isContextValid = true
      
      // 检查上下文是否丢失的辅助函数
      const checkContextLost = (): boolean => {
        if (!isContextValid) return true
        try {
          // WebGL 2.0 有 isContextLost 方法
          if ('isContextLost' in gl && typeof (gl as any).isContextLost === 'function') {
            if ((gl as any).isContextLost()) {
              isContextValid = false
              return true
            }
          } else {
            // WebGL 1.0 需要通过尝试操作来检测
            gl.getParameter(gl.VERSION)
          }
          return false
        } catch (e) {
          isContextValid = false
          return true
        }
      }
      
      // 包装 setAttribute 以检查上下文状态（静默失败，避免重复警告）
      const safeSetAttribute = (...args: Parameters<typeof setAttribute>) => {
        if (!isContextValid || checkContextLost()) {
          // 静默失败，不打印警告（上下文丢失时会有其他警告）
          return
        }
        try {
          setAttribute(...args)
        } catch (e) {
          // 静默失败
        }
      }
      
      // 创建执行环境，注入工具函数
      const utils = { 
        createProgram, 
        createBuffer, 
        setAttribute: safeSetAttribute, 
        Matrix, 
        createIndexBuffer 
      }
      
      // 包装 requestAnimationFrame 以便追踪和清理
      const rafIds: number[] = []
      let rafActive = true
      let contextLostWarned = false
      
      window.requestAnimationFrame = function(callback: FrameRequestCallback): number {
        if (!rafActive) {
          return -1
        }
        // 在调度前检查上下文状态
        if (checkContextLost()) {
          if (!contextLostWarned) {
            console.warn('WebGL 上下文已丢失，停止渲染循环')
            contextLostWarned = true
          }
          rafActive = false
          return -1
        }
        
        const id = originalRAF.call(window, (...args) => {
          const index = rafIds.indexOf(id)
          if (index > -1) rafIds.splice(index, 1)
          
          // 在回调执行前再次检查上下文状态
          if (!isContextValid || checkContextLost()) {
            if (!contextLostWarned) {
              console.warn('WebGL 上下文已丢失，停止渲染循环')
              contextLostWarned = true
            }
            rafActive = false
            return
          }
          
          // 执行回调
          try {
            callback(...args)
          } catch (e) {
            // 如果回调执行出错，检查是否是上下文丢失导致的
            if (checkContextLost()) {
              if (!contextLostWarned) {
                console.warn('WebGL 上下文已丢失，停止渲染循环')
                contextLostWarned = true
              }
              rafActive = false
            } else {
              // 其他错误，重新抛出
              throw e
            }
          }
        })
        rafIds.push(id)
        return id
      }
      
      // 使用 Function 构造函数创建执行环境
      const executeFunction = new Function(
        'gl', 'canvas', 'createProgram', 'createBuffer', 'setAttribute', 'Matrix', 'createIndexBuffer',
        `
        ${codeToRun}
        if (typeof init === 'function') {
          init(gl, canvas);
        } else {
          throw new Error('代码中必须包含 init(gl, canvas) 函数');
        }
        `
      )

      // 执行代码
      executeFunction(
        gl, 
        canvas, 
        utils.createProgram, 
        utils.createBuffer, 
        utils.setAttribute, 
        utils.Matrix, 
        utils.createIndexBuffer
      )
      
      // 恢复原始的 requestAnimationFrame
      window.requestAnimationFrame = originalRAF
      
      // 更新清理函数以停止所有动画帧
      const originalCleanup = cleanupRef.current
      cleanupRef.current = () => {
        rafActive = false
        if (originalCleanup) {
          try {
            originalCleanup()
          } catch (e) {
            // 忽略清理错误
          }
        }
        rafIds.forEach(id => {
          try {
            cancelAnimationFrame(id)
          } catch (e) {
            // 忽略已取消的动画帧错误
          }
        })
        rafIds.length = 0
      }
      
      // 设置清理函数（清理动画帧）
      cleanupRef.current = () => {
        rafIds.forEach(id => {
          try {
            cancelAnimationFrame(id)
          } catch (e) {
            // 忽略已取消的动画帧错误
          }
        })
        rafIds.length = 0
      }
      
      // 将 rafIds 添加到全局追踪列表
      animationFrames.current.push(...rafIds)
      
      setIsRunning(false)
    } catch (err) {
      // 恢复原始的 requestAnimationFrame
      if (window.requestAnimationFrame !== originalRAF) {
        window.requestAnimationFrame = originalRAF
      }
      setError(err instanceof Error ? err.message : '代码执行出错')
      console.error('执行错误:', err)
      setIsRunning(false)
    }
  }

  const runCode = () => {
    executeCode(code)
  }

  // 默认自动运行代码
  useEffect(() => {
    // 延迟一下，确保 canvas 已经渲染
    const timer = setTimeout(() => {
      if (canvasRef.current) {
        executeCode(defaultCode)
      }
    }, 300)
    
    return () => {
      clearTimeout(timer)
      cleanup()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 当 canvas key 变化时，等待 canvas 重新创建后运行当前代码
  useEffect(() => {
    if (canvasKey > 0 && code) {
      const timer = setTimeout(() => {
        if (canvasRef.current) {
          // 确保清理完成后再执行
          cleanup()
          executeCode(code)
        }
      }, 200)
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasKey])

  const loadTemplate = (templateCode: string) => {
    // 先清理所有资源
    cleanup()
    // 更新代码
    setCode(templateCode)
    setError('')
    // 强制重新创建 canvas（通过改变 key）
    // useEffect 会监听 canvasKey 变化并自动运行代码
    setCanvasKey(prev => prev + 1)
  }

  return (
    <div className="max-w-7xl">
      <h1 className="text-4xl mb-8 text-primary border-b-2 border-dark-border dark:border-dark-border border-light-border pb-4">
        WebGL Playground
      </h1>
      
      <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-6">
        在这里你可以直接编写和运行 WebGL 代码，无需准备开发环境。代码会自动执行并显示结果。
      </p>

      {/* 模板选择 */}
      <div className="mb-6">
        <h2 className="text-xl mb-3 text-dark-text dark:text-dark-text text-light-text">代码模板</h2>
        <div className="flex flex-wrap gap-3">
          {templates.map((template, index) => (
            <button
              key={index}
              onClick={() => loadTemplate(template.code)}
              className="px-4 py-2 rounded-lg border border-dark-border dark:border-dark-border border-light-border bg-dark-surface dark:bg-dark-surface bg-light-surface text-dark-text dark:text-dark-text text-light-text hover:border-primary hover:text-primary transition-all"
            >
              {template.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* 代码编辑器 */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-3 h-[42px]">
            <h2 className="text-xl text-dark-text dark:text-dark-text text-light-text">代码编辑器</h2>
            <button
              onClick={runCode}
              disabled={isRunning}
              className="relative px-4 py-2 bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-white rounded-lg text-sm font-medium shadow-lg hover:shadow-xl hover:shadow-primary/50 hover:scale-105 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg disabled:hover:scale-100 transition-all duration-300 flex items-center gap-1.5 group overflow-hidden"
            >
              {/* 背景光效 */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
              
              {/* 图标 */}
              {isRunning ? (
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : (
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              
              {/* 文字 */}
              <span className="relative z-10">{isRunning ? '运行中...' : '运行代码'}</span>
            </button>
          </div>
          <div 
            className="rounded-lg border border-dark-border dark:border-dark-border border-light-border" 
            style={{ 
              height: '600px',
              backgroundColor: isDark ? 'rgba(21, 21, 32, 0.6)' : 'rgba(248, 249, 250, 0.8)',
              position: 'relative',
              overflow: 'auto',
            }}
          >
            <CodeMirror
              value={code}
              height="600px"
              extensions={[
                javascript({ jsx: false }),
                webglAutocomplete,
              ]}
              theme={isDark ? oneDark : undefined}
              onChange={(value) => setCode(value)}
              basicSetup={{
                lineNumbers: true,
                foldGutter: true,
                dropCursor: false,
                allowMultipleSelections: false,
                indentOnInput: true,
                bracketMatching: true,
                closeBrackets: true,
                autocompletion: true,
                highlightSelectionMatches: true,
                defaultKeymap: true,
                searchKeymap: true,
                historyKeymap: true,
              }}
            />
          </div>
        </div>

        {/* 预览区域 */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-3 h-[42px]">
            <h2 className="text-xl text-dark-text dark:text-dark-text text-light-text">预览</h2>
            <div className="w-[100px]"></div>
          </div>
          <div className="rounded-lg border border-dark-border dark:border-dark-border border-light-border bg-dark-surface dark:bg-dark-surface bg-light-surface p-4 flex items-center justify-center" style={{ height: '600px' }}>
            <canvas
              key={canvasKey}
              ref={canvasRef}
              width={600}
              height={600}
              className="max-w-full h-auto rounded"
            />
          </div>
        </div>
      </div>

      {/* 错误显示 */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
          <h3 className="text-lg font-semibold text-red-500 mb-2">错误</h3>
          <pre className="text-sm text-red-400 whitespace-pre-wrap font-mono">{error}</pre>
        </div>
      )}

      {/* 使用说明 */}
      <div className="mt-8 p-6 rounded-lg border border-dark-border dark:border-dark-border border-light-border bg-dark-surface dark:bg-dark-surface bg-light-surface">
        <h2 className="text-2xl mb-4 text-dark-text dark:text-dark-text text-light-text">使用说明</h2>
        <ul className="text-dark-text-muted dark:text-dark-text-muted text-light-text-muted leading-relaxed space-y-2">
          <li>• 在代码编辑器中编写你的 WebGL 代码</li>
          <li>• 代码必须包含一个 <code className="bg-dark-bg dark:bg-dark-bg bg-light-bg px-2 py-1 rounded">init(gl, canvas)</code> 函数</li>
          <li>• 可以使用以下工具函数：<code className="bg-dark-bg dark:bg-dark-bg bg-light-bg px-2 py-1 rounded">createProgram</code>, <code className="bg-dark-bg dark:bg-dark-bg bg-light-bg px-2 py-1 rounded">createBuffer</code>, <code className="bg-dark-bg dark:bg-dark-bg bg-light-bg px-2 py-1 rounded">setAttribute</code>, <code className="bg-dark-bg dark:bg-dark-bg bg-light-bg px-2 py-1 rounded">Matrix</code>, <code className="bg-dark-bg dark:bg-dark-bg bg-light-bg px-2 py-1 rounded">createIndexBuffer</code></li>
          <li>• <strong className="text-primary">代码提示</strong>：输入代码时会自动显示提示，按 <code className="bg-dark-bg dark:bg-dark-bg bg-light-bg px-2 py-1 rounded">Ctrl+Space</code> 或 <code className="bg-dark-bg dark:bg-dark-bg bg-light-bg px-2 py-1 rounded">Tab</code> 选择</li>
          <li>• <strong className="text-primary">语法高亮</strong>：编辑器会自动高亮 JavaScript 和 GLSL 代码</li>
          <li>• 点击"运行代码"按钮执行代码</li>
          <li>• 可以使用预设模板快速开始</li>
        </ul>
      </div>

      {/* 工具函数说明 */}
      <div className="mt-6 rounded-lg border border-dark-border dark:border-dark-border border-light-border bg-dark-surface dark:bg-dark-surface bg-light-surface overflow-hidden">
        <details className="group">
          <summary className="px-4 py-3 cursor-pointer select-none flex items-center justify-between hover:bg-dark-bg dark:hover:bg-dark-bg hover:bg-light-surface transition-colors">
            <h2 className="text-lg font-medium text-dark-text dark:text-dark-text text-light-text">📚 可用工具函数 API 文档</h2>
            <svg className="w-5 h-5 text-dark-text-muted dark:text-dark-text-muted text-light-text-muted group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="px-4 py-4 border-t border-dark-border dark:border-dark-border border-light-border">
            <div className="space-y-6 text-sm">
              {/* createProgram */}
              <div>
                <h3 className="text-base font-semibold text-primary mb-2">createProgram(gl, vertexShaderSource, fragmentShaderSource)</h3>
                <p className="text-dark-text-muted dark:text-dark-text-muted text-light-text-muted mb-2">
                  创建并链接 WebGL 着色器程序。
                </p>
                <div className="bg-dark-bg dark:bg-dark-bg bg-light-bg p-3 rounded text-xs font-mono mb-2">
                  <div className="text-dark-text-muted dark:text-dark-text-muted text-light-text-muted">参数：</div>
                  <div className="ml-4 mt-1">gl: WebGLRenderingContext - WebGL 上下文</div>
                  <div className="ml-4">vertexShaderSource: string - 顶点着色器源代码</div>
                  <div className="ml-4">fragmentShaderSource: string - 片段着色器源代码</div>
                  <div className="text-dark-text-muted dark:text-dark-text-muted text-light-text-muted mt-2">返回：WebGLProgram</div>
                </div>
                <div className="text-dark-text-muted dark:text-dark-text-muted text-light-text-muted text-xs">
                  示例：<code className="bg-dark-bg dark:bg-dark-bg px-1 py-0.5 rounded">const program = createProgram(gl, vertexShader, fragmentShader)</code>
                </div>
              </div>

              {/* createBuffer */}
              <div>
                <h3 className="text-base font-semibold text-primary mb-2">createBuffer(gl, data, usage?)</h3>
                <p className="text-dark-text-muted dark:text-dark-text-muted text-light-text-muted mb-2">
                  创建顶点缓冲区（ARRAY_BUFFER）。
                </p>
                <div className="bg-dark-bg dark:bg-dark-bg bg-light-bg p-3 rounded text-xs font-mono mb-2">
                  <div className="text-dark-text-muted dark:text-dark-text-muted text-light-text-muted">参数：</div>
                  <div className="ml-4 mt-1">gl: WebGLRenderingContext - WebGL 上下文</div>
                  <div className="ml-4">data: number[] - 顶点数据数组</div>
                  <div className="ml-4">usage?: number - 使用方式（默认：gl.STATIC_DRAW）</div>
                  <div className="text-dark-text-muted dark:text-dark-text-muted text-light-text-muted mt-2">返回：WebGLBuffer | null</div>
                </div>
                <div className="text-dark-text-muted dark:text-dark-text-muted text-light-text-muted text-xs">
                  示例：<code className="bg-dark-bg dark:bg-dark-bg px-1 py-0.5 rounded">const buffer = createBuffer(gl, [-0.5, -0.5, 0.5, -0.5, 0.5, 0.5])</code>
                </div>
              </div>

              {/* createIndexBuffer */}
              <div>
                <h3 className="text-base font-semibold text-primary mb-2">createIndexBuffer(gl, data, usage?)</h3>
                <p className="text-dark-text-muted dark:text-dark-text-muted text-light-text-muted mb-2">
                  创建索引缓冲区（ELEMENT_ARRAY_BUFFER）。
                </p>
                <div className="bg-dark-bg dark:bg-dark-bg bg-light-bg p-3 rounded text-xs font-mono mb-2">
                  <div className="text-dark-text-muted dark:text-dark-text-muted text-light-text-muted">参数：</div>
                  <div className="ml-4 mt-1">gl: WebGLRenderingContext - WebGL 上下文</div>
                  <div className="ml-4">data: number[] - 索引数据数组</div>
                  <div className="ml-4">usage?: number - 使用方式（默认：gl.STATIC_DRAW）</div>
                  <div className="text-dark-text-muted dark:text-dark-text-muted text-light-text-muted mt-2">返回：WebGLBuffer | null</div>
                </div>
                <div className="text-dark-text-muted dark:text-dark-text-muted text-light-text-muted text-xs">
                  示例：<code className="bg-dark-bg dark:bg-dark-bg px-1 py-0.5 rounded">const indexBuffer = createIndexBuffer(gl, [0, 1, 2, 0, 2, 3])</code>
                </div>
              </div>

              {/* setAttribute */}
              <div>
                <h3 className="text-base font-semibold text-primary mb-2">setAttribute(gl, program, name, size, type?, normalized?, stride?, offset?)</h3>
                <p className="text-dark-text-muted dark:text-dark-text-muted text-light-text-muted mb-2">
                  设置顶点属性指针，启用并配置顶点属性。
                </p>
                <div className="bg-dark-bg dark:bg-dark-bg bg-light-bg p-3 rounded text-xs font-mono mb-2">
                  <div className="text-dark-text-muted dark:text-dark-text-muted text-light-text-muted">参数：</div>
                  <div className="ml-4 mt-1">gl: WebGLRenderingContext - WebGL 上下文</div>
                  <div className="ml-4">program: WebGLProgram - 着色器程序</div>
                  <div className="ml-4">name: string - 属性名称</div>
                  <div className="ml-4">size: number - 每个顶点的分量数（1-4）</div>
                  <div className="ml-4">type?: number - 数据类型（默认：gl.FLOAT）</div>
                  <div className="ml-4">normalized?: boolean - 是否归一化（默认：false）</div>
                  <div className="ml-4">stride?: number - 步长（默认：0）</div>
                  <div className="ml-4">offset?: number - 偏移量（默认：0）</div>
                  <div className="text-dark-text-muted dark:text-dark-text-muted text-light-text-muted mt-2">返回：void</div>
                </div>
                <div className="text-dark-text-muted dark:text-dark-text-muted text-light-text-muted text-xs">
                  示例：<code className="bg-dark-bg dark:bg-dark-bg px-1 py-0.5 rounded">setAttribute(gl, program, 'a_position', 2)</code>
                </div>
              </div>

              {/* Matrix */}
              <div>
                <h3 className="text-base font-semibold text-primary mb-2">Matrix - 矩阵工具对象</h3>
                <p className="text-dark-text-muted dark:text-dark-text-muted text-light-text-muted mb-3">
                  提供常用的 4x4 矩阵运算函数，返回的矩阵是列主序的 16 元素数组。
                </p>
                
                <div className="space-y-3">
                  <div>
                    <div className="font-semibold text-dark-text dark:text-dark-text text-light-text mb-1">Matrix.identity()</div>
                    <div className="text-dark-text-muted dark:text-dark-text-muted text-light-text-muted text-xs mb-1">创建单位矩阵</div>
                    <code className="bg-dark-bg dark:bg-dark-bg px-1 py-0.5 rounded text-xs">const m = Matrix.identity()</code>
                  </div>

                  <div>
                    <div className="font-semibold text-dark-text dark:text-dark-text text-light-text mb-1">Matrix.translation(tx, ty, tz)</div>
                    <div className="text-dark-text-muted dark:text-dark-text-muted text-light-text-muted text-xs mb-1">创建平移矩阵</div>
                    <code className="bg-dark-bg dark:bg-dark-bg px-1 py-0.5 rounded text-xs">const m = Matrix.translation(1, 2, 3)</code>
                  </div>

                  <div>
                    <div className="font-semibold text-dark-text dark:text-dark-text text-light-text mb-1">Matrix.scaling(sx, sy, sz)</div>
                    <div className="text-dark-text-muted dark:text-dark-text-muted text-light-text-muted text-xs mb-1">创建缩放矩阵</div>
                    <code className="bg-dark-bg dark:bg-dark-bg px-1 py-0.5 rounded text-xs">const m = Matrix.scaling(2, 2, 2)</code>
                  </div>

                  <div>
                    <div className="font-semibold text-dark-text dark:text-dark-text text-light-text mb-1">Matrix.rotationX(angleInRadians)</div>
                    <div className="text-dark-text-muted dark:text-dark-text-muted text-light-text-muted text-xs mb-1">创建绕 X 轴旋转矩阵（角度为弧度）</div>
                    <code className="bg-dark-bg dark:bg-dark-bg px-1 py-0.5 rounded text-xs">const m = Matrix.rotationX(Math.PI / 4)</code>
                  </div>

                  <div>
                    <div className="font-semibold text-dark-text dark:text-dark-text text-light-text mb-1">Matrix.rotationY(angleInRadians)</div>
                    <div className="text-dark-text-muted dark:text-dark-text-muted text-light-text-muted text-xs mb-1">创建绕 Y 轴旋转矩阵（角度为弧度）</div>
                    <code className="bg-dark-bg dark:bg-dark-bg px-1 py-0.5 rounded text-xs">const m = Matrix.rotationY(Math.PI / 4)</code>
                  </div>

                  <div>
                    <div className="font-semibold text-dark-text dark:text-dark-text text-light-text mb-1">Matrix.rotationZ(angleInRadians)</div>
                    <div className="text-dark-text-muted dark:text-dark-text-muted text-light-text-muted text-xs mb-1">创建绕 Z 轴旋转矩阵（角度为弧度）</div>
                    <code className="bg-dark-bg dark:bg-dark-bg px-1 py-0.5 rounded text-xs">const m = Matrix.rotationZ(Math.PI / 4)</code>
                  </div>

                  <div>
                    <div className="font-semibold text-dark-text dark:text-dark-text text-light-text mb-1">Matrix.perspective(fov, aspect, near, far)</div>
                    <div className="text-dark-text-muted dark:text-dark-text-muted text-light-text-muted text-xs mb-1">创建透视投影矩阵（fov 为弧度）</div>
                    <code className="bg-dark-bg dark:bg-dark-bg px-1 py-0.5 rounded text-xs">const m = Matrix.perspective(Math.PI / 4, canvas.width / canvas.height, 0.1, 100)</code>
                  </div>

                  <div>
                    <div className="font-semibold text-dark-text dark:text-dark-text text-light-text mb-1">Matrix.ortho(left, right, bottom, top, near, far)</div>
                    <div className="text-dark-text-muted dark:text-dark-text-muted text-light-text-muted text-xs mb-1">创建正交投影矩阵</div>
                    <code className="bg-dark-bg dark:bg-dark-bg px-1 py-0.5 rounded text-xs">const m = Matrix.ortho(-1, 1, -1, 1, 0.1, 100)</code>
                  </div>

                  <div>
                    <div className="font-semibold text-dark-text dark:text-dark-text text-light-text mb-1">Matrix.lookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ)</div>
                    <div className="text-dark-text-muted dark:text-dark-text-muted text-light-text-muted text-xs mb-1">创建视图矩阵（相机位置、目标点、上方向）</div>
                    <code className="bg-dark-bg dark:bg-dark-bg px-1 py-0.5 rounded text-xs">const m = Matrix.lookAt(0, 0, 5, 0, 0, 0, 0, 1, 0)</code>
                  </div>

                  <div>
                    <div className="font-semibold text-dark-text dark:text-dark-text text-light-text mb-1">Matrix.multiply(a, b)</div>
                    <div className="text-dark-text-muted dark:text-dark-text-muted text-light-text-muted text-xs mb-1">矩阵相乘（返回 a × b，注意顺序：先应用 b，再应用 a）</div>
                    <code className="bg-dark-bg dark:bg-dark-bg px-1 py-0.5 rounded text-xs">const mvp = Matrix.multiply(projection, Matrix.multiply(view, model))</code>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-dark-bg dark:bg-dark-bg bg-light-bg rounded text-xs">
                  <div className="text-primary font-semibold mb-1">💡 使用提示：</div>
                  <ul className="list-disc list-inside space-y-1 text-dark-text-muted dark:text-dark-text-muted text-light-text-muted">
                    <li>矩阵是列主序的，可以直接传递给 WebGL 的 uniformMatrix4fv</li>
                    <li>矩阵相乘的顺序很重要：Matrix.multiply(a, b) 表示先应用 b，再应用 a</li>
                    <li>MVP 矩阵通常的顺序：MVP = multiply(projection, multiply(view, model))</li>
                    <li>角度使用弧度制，可以使用 Math.PI / 180 * degrees 转换</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </details>
      </div>
    </div>
  )
}

