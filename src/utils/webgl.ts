type Mat4 = number[]

/**
 * 创建并初始化 WebGL2 上下文
 */
export function initWebGL(canvas: HTMLCanvasElement): WebGL2RenderingContext {
  const gl = canvas.getContext('webgl2')
  
  if (!gl) {
    throw new Error('无法创建 WebGL2 上下文。请确保浏览器支持 WebGL2。')
  }
  
  return gl
}

/**
 * 创建着色器
 */
export function createShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  if (!gl) {
    throw new Error('WebGL 上下文无效')
  }
  
  if (!source || typeof source !== 'string') {
    throw new Error('着色器源代码无效')
  }
  
  const shader = gl.createShader(type)
  if (!shader) {
    throw new Error('无法创建着色器对象')
  }
  
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const error = gl.getShaderInfoLog(shader) || '未知错误'
    gl.deleteShader(shader)
    throw new Error(`着色器编译错误: ${error}\n着色器源代码:\n${source}`)
  }
  
  return shader
}

/**
 * 创建着色器程序
 */
export function createProgram(
  gl: WebGL2RenderingContext,
  vertexShaderSource: string,
  fragmentShaderSource: string
): WebGLProgram {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
  
  const program = gl.createProgram()
  if (!program) {
    throw new Error('无法创建着色器程序')
  }
  
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const error = gl.getProgramInfoLog(program)
    gl.deleteProgram(program)
    gl.deleteShader(vertexShader)
    gl.deleteShader(fragmentShader)
    throw new Error(`程序链接错误: ${error}`)
  }
  
  return program
}

/**
 * 创建缓冲区
 */
export function createBuffer(
  gl: WebGL2RenderingContext,
  data: number[],
  usage: number = gl.STATIC_DRAW
): WebGLBuffer | null {
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), usage)
  return buffer
}

/**
 * 创建索引缓冲区
 */
export function createIndexBuffer(
  gl: WebGL2RenderingContext,
  data: number[],
  usage: number = gl.STATIC_DRAW
): WebGLBuffer | null {
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), usage)
  return buffer
}

/**
 * 检查 WebGL2 上下文是否丢失
 */
function isContextLost(gl: WebGL2RenderingContext): boolean {
  return gl.isContextLost()
}

/**
 * 设置属性指针
 */
export function setAttribute(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  name: string,
  size: number,
  type: number = gl.FLOAT,
  normalized: boolean = false,
  stride: number = 0,
  offset: number = 0
): void {
  // 检查上下文是否丢失
  if (isContextLost(gl)) {
    console.warn(`WebGL 上下文已丢失，无法设置属性 ${name}`)
    return
  }
  
  // 检查程序是否有效
  try {
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const error = gl.getProgramInfoLog(program)
      console.error(`着色器程序链接失败: ${error || '未知错误'}`)
      return
    }
  } catch (e) {
    // 如果上下文已丢失，getProgramParameter 会抛出错误
    console.warn(`WebGL 上下文可能已丢失，无法检查程序状态`)
    return
  }
  
  const location = gl.getAttribLocation(program, name)
  if (location === -1) {
    // 检查属性是否在着色器中声明但未使用（被优化掉了）
    console.warn(`属性 ${name} 未找到。可能的原因：`)
    console.warn(`1. 着色器中没有声明此属性`)
    console.warn(`2. 属性已声明但未使用，被编译器优化掉了`)
    console.warn(`3. 着色器程序链接失败`)
    return
  }
  
  try {
    gl.enableVertexAttribArray(location)
    gl.vertexAttribPointer(location, size, type, normalized, stride, offset)
  } catch (e) {
    console.warn(`设置属性 ${name} 时出错: ${e}`)
  }
}

/**
 * 创建纹理
 */
export function createTexture(gl: WebGL2RenderingContext, image: TexImageSource): WebGLTexture | null {
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
  gl.generateMipmap(gl.TEXTURE_2D)
  return texture
}

/**
 * 矩阵工具函数
 */
export const Matrix = {
  // 创建单位矩阵
  identity(): Mat4 {
    return [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]
  },
  
  // 平移矩阵
  translation(tx: number, ty: number, tz: number): Mat4 {
    return [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      tx, ty, tz, 1
    ]
  },
  
  // 缩放矩阵
  scaling(sx: number, sy: number, sz: number): Mat4 {
    return [
      sx, 0, 0, 0,
      0, sy, 0, 0,
      0, 0, sz, 0,
      0, 0, 0, 1
    ]
  },
  
  // 绕 X 轴旋转
  rotationX(angleInRadians: number): Mat4 {
    const c = Math.cos(angleInRadians)
    const s = Math.sin(angleInRadians)
    return [
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1
    ]
  },
  
  // 绕 Y 轴旋转
  rotationY(angleInRadians: number): Mat4 {
    const c = Math.cos(angleInRadians)
    const s = Math.sin(angleInRadians)
    return [
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1
    ]
  },
  
  // 绕 Z 轴旋转
  rotationZ(angleInRadians: number): Mat4 {
    const c = Math.cos(angleInRadians)
    const s = Math.sin(angleInRadians)
    return [
      c, s, 0, 0,
      -s, c, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]
  },
  
  // 透视投影矩阵
  perspective(fieldOfViewInRadians: number, aspect: number, near: number, far: number): Mat4 {
    const f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians)
    const rangeInv = 1.0 / (near - far)
    
    return [
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (near + far) * rangeInv, -1,
      0, 0, near * far * rangeInv * 2, 0
    ]
  },
  
  // 正交投影矩阵
  ortho(left: number, right: number, bottom: number, top: number, near: number, far: number): Mat4 {
    const lr = 1 / (left - right)
    const bt = 1 / (bottom - top)
    const nf = 1 / (near - far)
    
    return [
      -2 * lr, 0, 0, 0,
      0, -2 * bt, 0, 0,
      0, 0, 2 * nf, 0,
      (left + right) * lr, (top + bottom) * bt, (far + near) * nf, 1
    ]
  },
  
  // 视图矩阵（lookAt）
  lookAt(eyeX: number, eyeY: number, eyeZ: number, 
         centerX: number, centerY: number, centerZ: number,
         upX: number, upY: number, upZ: number): Mat4 {
    let fx = centerX - eyeX
    let fy = centerY - eyeY
    let fz = centerZ - eyeZ
    
    // 归一化 f
    const len = Math.sqrt(fx * fx + fy * fy + fz * fz)
    if (len > 0.00001) {
      fx /= len
      fy /= len
      fz /= len
    }
    
    // 计算 s = f × up
    let sx = fy * upZ - fz * upY
    let sy = fz * upX - fx * upZ
    let sz = fx * upY - fy * upX
    
    // 归一化 s
    const slen = Math.sqrt(sx * sx + sy * sy + sz * sz)
    if (slen > 0.00001) {
      sx /= slen
      sy /= slen
      sz /= slen
    }
    
    // 计算 u = s × f
    const ux = sy * fz - sz * fy
    const uy = sz * fx - sx * fz
    const uz = sx * fy - sy * fx
    
    return [
      sx, ux, -fx, 0,
      sy, uy, -fy, 0,
      sz, uz, -fz, 0,
      -(sx * eyeX + sy * eyeY + sz * eyeZ),
      -(ux * eyeX + uy * eyeY + uz * eyeZ),
      fx * eyeX + fy * eyeY + fz * eyeZ,
      1
    ]
  },
  
  // 矩阵相乘
  multiply(a: Mat4, b: Mat4): Mat4 {
    const a00 = a[0 * 4 + 0]
    const a01 = a[0 * 4 + 1]
    const a02 = a[0 * 4 + 2]
    const a03 = a[0 * 4 + 3]
    const a10 = a[1 * 4 + 0]
    const a11 = a[1 * 4 + 1]
    const a12 = a[1 * 4 + 2]
    const a13 = a[1 * 4 + 3]
    const a20 = a[2 * 4 + 0]
    const a21 = a[2 * 4 + 1]
    const a22 = a[2 * 4 + 2]
    const a23 = a[2 * 4 + 3]
    const a30 = a[3 * 4 + 0]
    const a31 = a[3 * 4 + 1]
    const a32 = a[3 * 4 + 2]
    const a33 = a[3 * 4 + 3]
    const b00 = b[0 * 4 + 0]
    const b01 = b[0 * 4 + 1]
    const b02 = b[0 * 4 + 2]
    const b03 = b[0 * 4 + 3]
    const b10 = b[1 * 4 + 0]
    const b11 = b[1 * 4 + 1]
    const b12 = b[1 * 4 + 2]
    const b13 = b[1 * 4 + 3]
    const b20 = b[2 * 4 + 0]
    const b21 = b[2 * 4 + 1]
    const b22 = b[2 * 4 + 2]
    const b23 = b[2 * 4 + 3]
    const b30 = b[3 * 4 + 0]
    const b31 = b[3 * 4 + 1]
    const b32 = b[3 * 4 + 2]
    const b33 = b[3 * 4 + 3]
    
    return [
      b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
      b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
      b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
      b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
      b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
      b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
      b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
      b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
      b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
      b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
      b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
      b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
      b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
      b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
      b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
      b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
    ]
  }
}

