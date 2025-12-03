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
        
        <WebGLCanvas width={400} height={400} onInit={(gl, canvas) => {
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
        
        <WebGLCanvas width={400} height={400} onInit={(gl, canvas) => {
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
        </p>
        
        <CodeBlock title="Phong 光照模型" code={`precision mediump float;

uniform vec3 u_ambientColor;
uniform vec3 u_lightDirection;
uniform vec3 u_lightColor;
uniform vec3 u_viewPosition;  // 相机位置
uniform vec3 u_materialColor;
uniform float u_shininess;    // 高光指数

varying vec3 v_normal;
varying vec3 v_position;      // 顶点位置（视图空间）

void main() {
  vec3 normal = normalize(v_normal);
  vec3 lightDir = normalize(-u_lightDirection);
  
  // 环境光
  vec3 ambient = u_ambientColor * u_materialColor;
  
  // 漫反射光
  float diff = max(dot(normal, lightDir), 0.0);
  vec3 diffuse = diff * u_lightColor * u_materialColor;
  
  // 镜面反射光
  vec3 viewDir = normalize(-v_position);  // 视图方向
  vec3 reflectDir = reflect(-lightDir, normal);
  float spec = pow(max(dot(viewDir, reflectDir), 0.0), u_shininess);
  vec3 specular = spec * u_lightColor;
  
  vec3 result = ambient + diffuse + specular;
  gl_FragColor = vec4(result, 1.0);
}`} />
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
