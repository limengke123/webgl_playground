import WebGLCanvas from '../../components/WebGLCanvas'
import CodeBlock from '../../components/CodeBlock'
import ChapterNavigation from '../../components/ChapterNavigation'
import { createProgram, createBuffer, setAttribute, Matrix, createIndexBuffer } from '../../utils/webgl'

export default function Chapter6() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl mb-8 text-primary border-b-2 border-dark-border dark:border-dark-border border-light-border pb-4">第六章：光照</h1>
      
      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">什么是光照？</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          光照是 3D 图形学中模拟光线与物体表面交互的过程。通过光照，我们可以让 3D 场景看起来更加真实。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          基本的光照模型包括三种光照类型：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">环境光（Ambient Light）</strong>：模拟间接光照，给所有物体一个基础亮度</li>
          <li><strong className="text-primary font-semibold">漫反射光（Diffuse Light）</strong>：模拟光线从表面反射，取决于光线方向和表面法线</li>
          <li><strong className="text-primary font-semibold">镜面反射光（Specular Light）</strong>：模拟高光反射，产生亮点</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">法线（Normal）</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          法线是垂直于表面的向量，用于计算光照。每个顶点都需要一个法线向量。
        </p>
        
        <CodeBlock title="法线向量" code={`// 顶点的法线向量（归一化）
attribute vec3 a_normal;

// 在顶点着色器中，需要将法线从模型空间转换到视图空间
uniform mat4 u_normalMatrix;  // 法线矩阵（通常是模型视图矩阵的逆矩阵的转置）

varying vec3 v_normal;

void main() {
  v_normal = normalize((u_normalMatrix * vec4(a_normal, 0.0)).xyz);
}`} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">环境光（Ambient Light）</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          环境光是最简单的光照类型，给所有物体一个统一的亮度，不依赖于光线方向或视角。
        </p>
        
        <CodeBlock title="环境光计算" code={`precision mediump float;

uniform vec3 u_ambientColor;  // 环境光颜色
uniform vec3 u_materialColor; // 材质颜色

void main() {
  vec3 ambient = u_ambientColor * u_materialColor;
  gl_FragColor = vec4(ambient, 1.0);
}`} />
        
        <WebGLCanvas width={400} height={400} onInit={(gl: WebGLRenderingContext, canvas: HTMLCanvasElement) => {
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
        }} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">漫反射光（Diffuse Light）</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          漫反射光模拟光线从表面均匀反射。光照强度取决于光线方向与表面法线的夹角。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          使用兰伯特（Lambert）定律计算：<strong className="text-primary font-semibold">I = max(0, dot(N, L))</strong>
        </p>
        
        <CodeBlock title="漫反射光计算" code={`precision mediump float;

uniform vec3 u_lightDirection;  // 光线方向（归一化）
uniform vec3 u_lightColor;      // 光线颜色
uniform vec3 u_materialColor;   // 材质颜色
varying vec3 v_normal;          // 法线向量（从顶点着色器传递）

void main() {
  vec3 normal = normalize(v_normal);
  vec3 lightDir = normalize(-u_lightDirection);  // 注意：方向取反
  
  float diff = max(dot(normal, lightDir), 0.0);
  vec3 diffuse = diff * u_lightColor * u_materialColor;
  
  gl_FragColor = vec4(diffuse, 1.0);
}`} />
        
        <WebGLCanvas width={400} height={400} onInit={(gl: WebGLRenderingContext, canvas: HTMLCanvasElement) => {
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
        }} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">Phong 光照模型</h2>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          Phong 光照模型结合了环境光、漫反射光和镜面反射光，是最常用的光照模型之一。
          Phong 模型能够产生真实感的光照效果，包括高光反射。
        </p>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          Phong 光照模型的三个组成部分：
        </p>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">环境光（Ambient）</strong>：模拟间接光照，给所有表面一个基础亮度</li>
          <li><strong className="text-primary font-semibold">漫反射光（Diffuse）</strong>：使用兰伯特定律，取决于光线方向与表面法线的夹角</li>
          <li><strong className="text-primary font-semibold">镜面反射光（Specular）</strong>：模拟高光反射，取决于视角和反射方向</li>
        </ul>
        
        <CodeBlock title="Phong 光照模型完整代码" code={`precision mediump float;

uniform vec3 u_ambientColor;      // 环境光颜色和强度
uniform vec3 u_lightDirection;    // 光线方向（归一化）
uniform vec3 u_lightColor;        // 光线颜色
uniform vec3 u_viewPosition;      // 相机位置（世界空间）
uniform vec3 u_materialColor;     // 材质颜色
uniform float u_shininess;         // 高光指数（越大，高光越小越亮）

varying vec3 v_normal;            // 法线向量（视图空间）
varying vec3 v_position;           // 顶点位置（视图空间）

void main() {
  // 归一化法线
  vec3 normal = normalize(v_normal);
  
  // 计算光线方向（注意：方向取反）
  vec3 lightDir = normalize(-u_lightDirection);
  
  // ========== 1. 环境光 ==========
  vec3 ambient = u_ambientColor * u_materialColor;
  
  // ========== 2. 漫反射光 ==========
  // 使用兰伯特定律：I = max(0, dot(N, L))
  float diff = max(dot(normal, lightDir), 0.0);
  vec3 diffuse = diff * u_lightColor * u_materialColor;
  
  // ========== 3. 镜面反射光 ==========
  // 计算视图方向
  vec3 viewDir = normalize(-v_position);
  
  // 计算反射方向
  vec3 reflectDir = reflect(-lightDir, normal);
  
  // 计算高光强度：I = pow(max(0, dot(V, R)), shininess)
  float spec = pow(max(dot(viewDir, reflectDir), 0.0), u_shininess);
  vec3 specular = spec * u_lightColor;
  
  // ========== 组合所有光照 ==========
  vec3 result = ambient + diffuse + specular;
  gl_FragColor = vec4(result, 1.0);
}`} />
        
        <h3 className="text-2xl my-8 text-dark-text dark:text-dark-text text-light-text">完整的 Phong 光照示例</h3>
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          下面是一个完整的 Phong 光照示例，展示旋转的立方体：
        </p>
        
        <WebGLCanvas width={400} height={400} onInit={(gl: WebGLRenderingContext, canvas: HTMLCanvasElement) => {
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
        }} />
        
        <p className="text-dark-text dark:text-dark-text text-light-text-muted leading-relaxed mb-4">
          注意观察立方体表面的高光效果。高光的位置会随着立方体的旋转而改变，这是因为高光取决于视角和光线方向。
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl my-10 text-dark-text dark:text-dark-text text-light-text">关键概念总结</h2>
        <ul className="text-dark-text dark:text-dark-text text-light-text-muted leading-loose pl-8 mb-5">
          <li><strong className="text-primary font-semibold">环境光</strong>：基础亮度，不依赖方向</li>
          <li><strong className="text-primary font-semibold">漫反射光</strong>：取决于光线方向与法线的夹角</li>
          <li><strong className="text-primary font-semibold">镜面反射光</strong>：产生高光效果</li>
          <li><strong className="text-primary font-semibold">法线</strong>：垂直于表面的向量</li>
          <li><strong className="text-primary font-semibold">Phong 光照模型</strong>：结合三种光照类型</li>
        </ul>
      </section>
      
      <ChapterNavigation />
    </div>
  )
}
