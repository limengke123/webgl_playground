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
  uniform float u_time;
  
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

  const stopAnimation = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
  }

  const cleanup = () => {
    stopAnimation()
    if (cleanupRef.current) {
      try {
        cleanupRef.current()
      } catch (e) {
        console.error('清理错误:', e)
      }
      cleanupRef.current = null
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

    let gl: WebGLRenderingContext | null = null
    try {
      gl = canvas.getContext('webgl') as WebGLRenderingContext || 
           canvas.getContext('experimental-webgl') as WebGLRenderingContext
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

    glRef.current = gl

    try {
      // 创建执行环境，注入工具函数
      const utils = { createProgram, createBuffer, setAttribute, Matrix, createIndexBuffer }
      
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
      
      cleanupRef.current = cleanup
      setIsRunning(false)
    } catch (err) {
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
      executeCode(defaultCode)
    }, 200)
    
    return () => {
      clearTimeout(timer)
      cleanup()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadTemplate = (templateCode: string) => {
    setCode(templateCode)
    setError('')
    // 延迟一下确保代码已更新，然后自动运行
    setTimeout(() => {
      executeCode(templateCode)
    }, 150)
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
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl text-dark-text dark:text-dark-text text-light-text">代码编辑器</h2>
            <button
              onClick={runCode}
              disabled={isRunning}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
            >
              {isRunning ? '运行中...' : '运行代码'}
            </button>
          </div>
          <div 
            className="flex-1 rounded-lg border border-dark-border dark:border-dark-border border-light-border overflow-hidden" 
            style={{ 
              minHeight: '500px',
              backgroundColor: isDark ? 'rgba(21, 21, 32, 0.6)' : 'rgba(248, 249, 250, 0.8)',
            }}
          >
            <CodeMirror
              value={code}
              height="500px"
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
          <h2 className="text-xl mb-3 text-dark-text dark:text-dark-text text-light-text">预览</h2>
          <div className="flex-1 rounded-lg border border-dark-border dark:border-dark-border border-light-border bg-dark-surface dark:bg-dark-surface bg-light-surface p-4 flex items-center justify-center" style={{ minHeight: '500px' }}>
            <canvas
              ref={canvasRef}
              width={600}
              height={500}
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
    </div>
  )
}

