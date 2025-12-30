---
title: "第二章：GLSL 语法基础"
description: "掌握 GLSL 着色器语言的基础语法，数据类型、变量限定符和常用函数"
order: 2
path: "/chapter/2"
keywords:
  - "glsl"
  - "语法"
  - "数据类型"
  - "变量"
  - "限定符"
  - "函数"
  - "vec2"
  - "vec3"
  - "vec4"
  - "mat4"
  - "precision"
  - "着色器语言"
---

<h1 className="text-4xl mb-8 text-primary border-b-2 border-dark-border dark:border-dark-border border-light-border pb-4">
{metadata.title}
</h1>`} /&amp;gt;
&amp;lt;CodeBlock title=&amp;quot;const 示例&amp;quot; language=&amp;quot;glsl&amp;quot; code={`// 定义常量
const float PI = 3.14159265359;
const vec3 RED = vec3(1.0, 0.0, 0.0);
const int MAX_LIGHTS = 4;void main() {
// 使用常量
float angle = PI * 2.0;
vec3 color = RED;// const 值不能修改
// PI = 3.14;  // 错误！
}`} /&amp;gt;
&amp;lt;CodeBlock language=&amp;quot;text&amp;quot; code={`### 变量命名约定<CodeBlock title="" language="text">
\
</CodeBlock>
&lt;CodeBlock title=&quot;更多函数示例&quot; language=&quot;glsl&quot; code={\`// 符号函数
float s = sign(-5.0);   // -1.0
float s2 = sign(10.0);  // 1.0
float s3 = sign(0.0);   // 0.0// 取整函数
float f1 = floor(3.7);   // 3.0
float f2 = ceil(3.2);   // 4.0
float f3 = round(3.5);  // 4.0
float f4 = round(3.4);  // 3.0// 小数部分
float frac = fract(3.7);  // 0.7
float frac2 = fract(-3.7); // 0.3（注意：fract 总是返回正数）// 取模
float m = mod(7.0, 3.0);   // 1.0
float m2 = mod(8.5, 3.0);  // 2.5// 步进函数
float step1 = step(0.5, 0.3);  // 0.0（0.3 &lt; 0.5）
float step2 = step(0.5, 0.7);  // 1.0（0.7 &gt;= 0.5）// 平滑步进
float smooth = smoothstep(0.0, 1.0, 0.5);  // 0.5（在中间）
float smooth2 = smoothstep(0.0, 1.0, 0.0); // 0.0（在起点）
float smooth3 = smoothstep(0.0, 1.0, 1.0); // 1.0（在终点）// 反射和折射
vec3 incident = normalize(vec3(1.0, -1.0, 0.0));
vec3 normal = normalize(vec3(0.0, 1.0, 0.0));
vec3 reflected = reflect(incident, normal);
vec3 refracted = refract(incident, normal, 1.0 / 1.5);  // 折射率 1.5\`} /&gt;
&lt;CodeBlock title=&quot;函数示例&quot; language=&quot;glsl&quot; code={\`// 线性插值
float t = 0.5;
float result = mix(0.0, 1.0, t);  // 结果 = 0.5// 平滑步进（在 edge0 和 edge1 之间平滑过渡）
float smooth = smoothstep(0.0, 1.0, t);// 范围限制
float clamped = clamp(value, 0.0, 1.0);// 向量长度
float len = length(vec2(3.0, 4.0));  // 结果 = 5.0// 归一化向量
vec3 dir = normalize(vec3(1.0, 2.0, 3.0));// 点积（用于计算角度、投影等）
float dp = dot(vec3(1.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0));  // 结果 = 0.0（垂直）// 反射向量（用于光照）
vec3 reflected = reflect(lightDir, normal);// 距离计算
float dist = distance(pointA, pointB);// 小数部分（用于创建重复图案）
float fractional = fract(uv * 10.0);\`} /&gt;
&lt;CodeBlock language=&quot;text&quot; code={\`### 实际应用示例<CodeBlock title="" language="text">
下面是一些实际应用场景：\`} />
`} /&gt;
&amp;lt;CodeBlock title=&amp;quot;使用 smoothstep 创建渐变效果&amp;quot; language=&amp;quot;glsl&amp;quot; code={`precision mediump float;
varying vec2 v_texCoord;void main() {
// 创建从中心向外的径向渐变
float dist = distance(v_texCoord, vec2(0.5));
float gradient = smoothstep(0.5, 0.0, dist);
gl_FragColor = vec4(gradient, gradient, gradient, 1.0);
}`} /&amp;gt;
&amp;lt;CodeBlock title=&amp;quot;使用 fract 创建重复图案&amp;quot; language=&amp;quot;glsl&amp;quot; code={`precision mediump float;
varying vec2 v_texCoord;
uniform float u_time;void main() {
// 创建棋盘格图案
vec2 grid = fract(v_texCoord * 10.0);
float checker = step(0.5, grid.x) * step(0.5, grid.y) +
(1.0 - step(0.5, grid.x)) * (1.0 - step(0.5, grid.y));
gl_FragColor = vec4(checker, checker, checker, 1.0);
}`} /&amp;gt;
&amp;lt;CodeBlock title=&amp;quot;使用 dot 计算光照强度&amp;quot; language=&amp;quot;glsl&amp;quot; code={`precision mediump float;
varying vec3 v_normal;
uniform vec3 u_lightDirection;void main() {
vec3 normal = normalize(v_normal);
vec3 lightDir = normalize(-u_lightDirection);// 使用点积计算光照强度（兰伯特定律）
float intensity = max(dot(normal, lightDir), 0.0);
gl_FragColor = vec4(intensity, intensity, intensity, 1.0);
}`} /&amp;gt;
&amp;lt;CodeBlock language=&amp;quot;text&amp;quot; code={`## 控制流语句<CodeBlock title="" language="text">
GLSL 支持常见的控制流语句，但需要注意性能影响，特别是在片段着色器中。### 条件语句\
</CodeBlock>
`} /&gt;
&amp;lt;CodeBlock title=&amp;quot;if/else 语句&amp;quot; language=&amp;quot;glsl&amp;quot; code={`// 基本 if 语句
if (value &gt; 0.5) {
color = vec3(1.0, 0.0, 0.0);  // 红色
} else {
color = vec3(0.0, 0.0, 1.0);  // 蓝色
}// if-else if-else
if (value &lt; 0.33) {
color = vec3(1.0, 0.0, 0.0);
} else if (value &lt; 0.66) {
color = vec3(0.0, 1.0, 0.0);
} else {
color = vec3(0.0, 0.0, 1.0);
}// 三元运算符（更高效）
color = value &gt; 0.5 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 0.0, 1.0);// 注意：在片段着色器中，if/else 可能导致性能问题
// 尽量使用 step() 或 mix() 函数代替`} /&amp;gt;
&amp;lt;CodeBlock language=&amp;quot;text&amp;quot; code={`### 循环语句`} /&amp;gt;
&amp;lt;CodeBlock title=&amp;quot;for/while 循环&amp;quot; language=&amp;quot;glsl&amp;quot; code={`// for 循环
for (int i = 0; i &lt; 10; i++) {
// 循环体
value += float(i);
}// while 循环
int i = 0;
while (i &lt; 10) {
value += float(i);
i++;
}// 注意：
// 1. 循环次数必须在编译时确定（不能使用变量）
// 2. 循环次数不能太大（通常 &lt; 100）
// 3. 在片段着色器中，循环会影响性能// 错误示例：
// int count = 10;
// for (int i = 0; i &lt; count; i++) {  // 错误！count 不是常量
// }// 正确示例：
const int COUNT = 10;
for (int i = 0; i &lt; COUNT; i++) {  // 正确！COUNT 是常量
}`} /&amp;gt;
&amp;lt;CodeBlock language=&amp;quot;text&amp;quot; code={`### switch 语句`} /&amp;gt;
&amp;lt;CodeBlock title=&amp;quot;switch 语句&amp;quot; language=&amp;quot;glsl&amp;quot; code={`int mode = 2;switch (mode) {
case 0:
color = vec3(1.0, 0.0, 0.0);  // 红色
break;
case 1:
color = vec3(0.0, 1.0, 0.0);  // 绿色
break;
case 2:
color = vec3(0.0, 0.0, 1.0);  // 蓝色
break;
default:
color = vec3(1.0, 1.0, 1.0);   // 白色
break;
}// 注意：switch 只能用于整数类型（int）`} /&amp;gt;
&amp;lt;CodeBlock language=&amp;quot;text&amp;quot; code={`## 数组和结构体<CodeBlock title="" language="text">
GLSL 支持数组和结构体，但有一些限制需要注意。### 数组\
</CodeBlock>
`} /&gt;
&amp;lt;CodeBlock title=&amp;quot;数组示例&amp;quot; language=&amp;quot;glsl&amp;quot; code={`// 声明数组
float values[10];              // 10 个浮点数
vec3 positions[4];             // 4 个 vec3
int indices[6];                // 6 个整数// 初始化数组
float values[3] = float[3](1.0, 2.0, 3.0);// 访问数组元素
float first = values[0];
values[1] = 5.0;// 注意：
// 1. 数组大小必须在编译时确定（不能使用变量）
// 2. 在 WebGL2（GLSL ES 3.00）中，可以使用变量索引（但有限制）
// 3. 数组不能动态分配// 错误示例：
// int size = 10;
// float values[size];  // 错误！size 不是常量// 正确示例：
const int SIZE = 10;
float values[SIZE];  // 正确！// 在 WebGL2 中，可以使用变量索引（但有限制）`} /&amp;gt;
&amp;lt;CodeBlock language=&amp;quot;text&amp;quot; code={`### 结构体`} /&amp;gt;
&amp;lt;CodeBlock title=&amp;quot;结构体示例&amp;quot; language=&amp;quot;glsl&amp;quot; code={`// 定义结构体
struct Light {
vec3 position;
vec3 color;
float intensity;
};// 声明结构体变量
Light light;// 初始化结构体
light = Light(
vec3(0.0, 5.0, 0.0),  // position
vec3(1.0, 1.0, 1.0),  // color
1.0                    // intensity
);// 访问结构体成员
vec3 pos = light.position;
vec3 col = light.color;
float intensity = light.intensity;// 修改结构体成员
light.intensity = 2.0;// 结构体可以作为函数参数和返回值
Light createLight(vec3 pos, vec3 col, float intensity) {
return Light(pos, col, intensity);
}Light myLight = createLight(vec3(0.0), vec3(1.0), 1.0);// 结构体可以作为 uniform
uniform Light u_light;// 注意：结构体不能包含数组（在某些版本中）`} /&amp;gt;
&amp;lt;CodeBlock language=&amp;quot;text&amp;quot; code={`## 精度限定符<CodeBlock title="" language="text">
\
</CodeBlock>
&lt;CodeBlock title=&quot;精度声明和使用&quot; language=&quot;glsl&quot; code={\`// 片段着色器必须声明默认精度
precision mediump float;  // 推荐使用 mediumpvoid main() {
// 使用默认精度（mediump）
float value = 1.0;// 显式指定精度
highp float precise = 1.0;    // 高精度
mediump float normal = 1.0;   // 中等精度
lowp float fast = 1.0;        // 低精度// 向量和矩阵也使用精度
mediump vec3 color = vec3(1.0, 0.0, 0.0);
lowp vec4 rgba = vec4(1.0, 1.0, 1.0, 1.0);  // 颜色值可以用 lowpgl_FragColor = vec4(color, 1.0);
}// 顶点着色器不需要声明精度（默认使用 highp）
// 但可以显式声明
precision highp float;attribute vec3 a_position;  // 默认 highpvoid main() {
gl_Position = vec4(a_position, 1.0);
}\`} /&gt;
&lt;CodeBlock language=&quot;text&quot; code={\`
**精度选择建议**：<CodeBlock language="text" code={\`
- 大多数情况下使用 \\\`mediump\\\`（推荐）
- 颜色值可以使用 \\\`lowp\\\`（性能更好）
- 复杂计算或需要高精度时使用 \\\`highp\\\`
- 移动设备上，使用较低的精度可以提高性能## 交互式示例### 示例 1：使用三角函数创建动画下面是一个使用 GLSL 函数创建动画效果的示例：<FlipCard
width={400}
height={400}
onInit={(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement) => {
const vertexShader = \\\`attribute vec2 a_position;\\`} />uniform mediump float u_time;void main() {\`} />
vec2 pos = a_position;
pos.x += sin(u_time + pos.y * 2.0) * 0.1;
gl_Position = vec4(pos, 0.0, 1.0);
}\`&lt;CodeBlock language=&quot;text&quot; code={\`const fragmentShader = \\`precision mediump float;\`} /&gt;<CodeBlock title="" language="text">
uniform float u_time;`} />
uniform vec2 u_resolution;<CodeBlock title="" language="text">
void main() {
</CodeBlock>
vec2 uv = gl_FragCoord.xy / u_resolution;
vec3 color = vec3(
sin(uv.x * 10.0 + u_time),
cos(uv.y * 10.0 + u_time),
sin((uv.x + uv.y) * 5.0 + u_time)
);
gl_FragColor = vec4(color * 0.5 + 0.5, 1.0);
}`&amp;lt;CodeBlock language=&amp;quot;text&amp;quot; code={`const program = createProgram(gl, vertexShader, fragmentShader)
const positions = [-0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5]
const indices = [0, 1, 2, 0, 2, 3]<CodeBlock  language="text" code={`{
time += 0.02
gl.clear(gl.COLOR_BUFFER_BIT)
gl.useProgram(program)
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
gl.enableVertexAttribArray(positionLocation)
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
gl.uniform1f(timeLocation, time)
gl.uniform2f(resolutionLocation, canvas.width, canvas.height)
gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
requestAnimationFrame(render)
}
render()
}}
codeBlocks={[
{ title: '顶点着色器', code: \\\`attribute vec2 a_position;\\`} />uniform mediump float u_time;\`} />
<CodeBlock title="" language="text">
const positionBuffer = createBuffer(gl, positions)`} />
const indexBuffer = gl.createBuffer()
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)<CodeBlock title="" language="text">
const timeLocation = gl.getUniformLocation(program, &#39;u_time&#39;)
</CodeBlock>
const resolutionLocation = gl.getUniformLocation(program, &#39;u_resolution&#39;)
const positionLocation = gl.getAttribLocation(program, &#39;a_position&#39;)<CodeBlock title="" language="text">
gl.viewport(0, 0, canvas.width, canvas.height)
</CodeBlock>
gl.clearColor(0.1, 0.1, 0.1, 1.0)<CodeBlock title="" language="text">
let time = 0
</CodeBlock>
const render = () =&gt; {
time += 0.02
gl.clear(gl.COLOR_BUFFER_BIT)
gl.useProgram(program)<CodeBlock title="" language="text">
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
</CodeBlock>
gl.enableVertexAttribArray(positionLocation)
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)<CodeBlock title="" language="text">
gl.uniform1f(timeLocation, time)
</CodeBlock>
gl.uniform2f(resolutionLocation, canvas.width, canvas.height)<CodeBlock title="" language="text">
gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
</CodeBlock>
requestAnimationFrame(render)
}
render()`, language: &amp;#39;javascript&amp;#39; }
]}
/&amp;gt;&amp;lt;CodeBlock language=&amp;quot;text&amp;quot; code={`### 示例 2：使用 smoothstep 创建渐变<CodeBlock  language="text" code={`{
const vertexShader = \\\`attribute vec2 a_position;\\`} />attribute vec2 a_texCoord;\`} />
varying vec2 v_texCoord;<CodeBlock title="" language="text">
void main() {`} />
gl_Position = vec4(a_position, 0.0, 1.0);
v_texCoord = a_texCoord;
}`&amp;lt;CodeBlock language=&amp;quot;text&amp;quot; code={`const fragmentShader = `precision mediump float;`} /&gt;<CodeBlock title="" language="text">
varying vec2 v_texCoord;
</CodeBlock>
uniform float u_time;<CodeBlock title="" language="text">
void main() {
</CodeBlock>
vec2 center = vec2(0.5);
float dist = distance(v_texCoord, center);
float gradient = smoothstep(0.7, 0.0, dist);
float angle = atan(v_texCoord.y - 0.5, v_texCoord.x - 0.5) + u_time;
float pattern = sin(angle * 5.0) * 0.3 + 0.7;
vec3 color = vec3(gradient * pattern, gradient * 0.5, gradient);
gl_FragColor = vec4(color, 1.0);
}`&amp;lt;CodeBlock language=&amp;quot;text&amp;quot; code={`const program = createProgram(gl, vertexShader, fragmentShader)
const positions = [-1, -1, 1, -1, 1, 1, -1, 1]
const texCoords = [0, 0, 1, 0, 1, 1, 0, 1]
const indices = [0, 1, 2, 0, 2, 3]<CodeBlock  language="text" code={`{
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
}}
codeBlocks={[
{ title: '顶点着色器', code: \\\`attribute vec2 a_position;\\`} />attribute vec2 a_texCoord;\`} />
varying vec2 v_texCoord;<CodeBlock title="" language="text">
const positionBuffer = createBuffer(gl, positions)`} />
const texCoordBuffer = createBuffer(gl, texCoords)
const indexBuffer = gl.createBuffer()
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)<CodeBlock title="" language="text">
const timeLocation = gl.getUniformLocation(program, &#39;u_time&#39;)
</CodeBlock>
const positionLocation = gl.getAttribLocation(program, &#39;a_position&#39;)
const texCoordLocation = gl.getAttribLocation(program, &#39;a_texCoord&#39;)<CodeBlock title="" language="text">
gl.viewport(0, 0, canvas.width, canvas.height)
</CodeBlock>
gl.clearColor(0.1, 0.1, 0.1, 1.0)<CodeBlock title="" language="text">
let time = 0
</CodeBlock>
const render = () =&gt; {
time += 0.02
gl.clear(gl.COLOR_BUFFER_BIT)
gl.useProgram(program)<CodeBlock title="" language="text">
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
</CodeBlock>
gl.enableVertexAttribArray(positionLocation)
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)<CodeBlock title="" language="text">
gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
</CodeBlock>
gl.enableVertexAttribArray(texCoordLocation)
gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0)<CodeBlock title="" language="text">
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
</CodeBlock>
gl.uniform1f(timeLocation, time)<CodeBlock title="" language="text">
gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
</CodeBlock>
requestAnimationFrame(render)
}
render()`, language: &amp;#39;javascript&amp;#39; }
]}
/&amp;gt;&amp;lt;CodeBlock language=&amp;quot;text&amp;quot; code={`### 示例 3：使用 fract 创建重复图案<CodeBlock  language="text" code={`{
const vertexShader = \\\`attribute vec2 a_position;\\`} />attribute vec2 a_texCoord;\`} />
varying vec2 v_texCoord;<CodeBlock title="" language="text">
void main() {`} />
gl_Position = vec4(a_position, 0.0, 1.0);
v_texCoord = a_texCoord;
}`&amp;lt;CodeBlock language=&amp;quot;text&amp;quot; code={`const fragmentShader = `precision mediump float;`} /&gt;<CodeBlock title="" language="text">
varying vec2 v_texCoord;
</CodeBlock>
uniform float u_time;<CodeBlock title="" language="text">
void main() {
</CodeBlock>
vec2 grid = fract(v_texCoord * 10.0);
float checker = step(0.5, grid.x) * step(0.5, grid.y) +
(1.0 - step(0.5, grid.x)) * (1.0 - step(0.5, grid.y));
float pulse = sin(u_time * 2.0) * 0.3 + 0.7;
vec3 color = vec3(checker * pulse, checker * 0.5, checker);
gl_FragColor = vec4(color, 1.0);
}`&amp;lt;CodeBlock language=&amp;quot;text&amp;quot; code={`const program = createProgram(gl, vertexShader, fragmentShader)
const positions = [-1, -1, 1, -1, 1, 1, -1, 1]
const texCoords = [0, 0, 1, 0, 1, 1, 0, 1]
const indices = [0, 1, 2, 0, 2, 3]<CodeBlock  language="text" code={`{
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
}}
codeBlocks={[
{ title: '顶点着色器', code: \\\`attribute vec2 a_position;\\`} />attribute vec2 a_texCoord;\`} />
varying vec2 v_texCoord;<CodeBlock title="" language="text">
const positionBuffer = createBuffer(gl, positions)`} />
const texCoordBuffer = createBuffer(gl, texCoords)
const indexBuffer = gl.createBuffer()
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)<CodeBlock title="" language="text">
const timeLocation = gl.getUniformLocation(program, &#39;u_time&#39;)
</CodeBlock>
const positionLocation = gl.getAttribLocation(program, &#39;a_position&#39;)
const texCoordLocation = gl.getAttribLocation(program, &#39;a_texCoord&#39;)<CodeBlock title="" language="text">
gl.viewport(0, 0, canvas.width, canvas.height)
</CodeBlock>
gl.clearColor(0.1, 0.1, 0.1, 1.0)<CodeBlock title="" language="text">
let time = 0
</CodeBlock>
const render = () =&gt; {
time += 0.02
gl.clear(gl.COLOR_BUFFER_BIT)
gl.useProgram(program)<CodeBlock title="" language="text">
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
</CodeBlock>
gl.enableVertexAttribArray(positionLocation)
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)<CodeBlock title="" language="text">
gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
</CodeBlock>
gl.enableVertexAttribArray(texCoordLocation)
gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0)<CodeBlock title="" language="text">
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
</CodeBlock>
gl.uniform1f(timeLocation, time)<CodeBlock title="" language="text">
gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
</CodeBlock>
requestAnimationFrame(render)
}
render()`, language: &amp;#39;javascript&amp;#39; }
]}
/&amp;gt;&amp;lt;CodeBlock language=&amp;quot;text&amp;quot; code={`这些示例展示了 GLSL 函数的实际应用：<CodeBlock title="" language="text">
\
</CodeBlock>
&lt;CodeBlock title=&quot;调试技巧&quot; language=&quot;glsl&quot; code={\`// 在片段着色器中添加调试输出
void main() {
vec3 color = calculateColor();// 可视化法线（用于调试）
// gl_FragColor = vec4(normalize(v_normal) * 0.5 + 0.5, 1.0);// 可视化 UV 坐标（用于调试）
// gl_FragColor = vec4(v_texCoord, 0.0, 1.0);gl_FragColor = vec4(color, 1.0);
}\`} /&gt;
&lt;CodeBlock language=&quot;text&quot; code={\`## 关键概念总结- **数据类型**：float（标量）、vec2/vec3/vec4（向量）、mat2/mat3/mat4（矩阵）
- **变量限定符**：attribute（顶点属性）、uniform（统一变量）、varying（传递变量）
- **内置变量**：gl_Position（顶点位置）、gl_FragColor（片段颜色）、gl_FragCoord（片段坐标）
- **数学函数**：sin/cos、pow/sqrt、abs/floor/ceil 等
- **向量运算**：length、distance、normalize、dot、cross
- **插值函数**：mix（线性插值）、smoothstep（平滑步进）
- **范围限制**：clamp、min、max
- **精度限定符**：highp、mediump、lowp（片段着色器必须声明）
- **分量访问**：可以使用 .xyzw、.rgba、.stpq 访问向量分量
- **向量构造**：可以使用 swizzle 操作重新排列分量<CodeBlock title="" language="text">
掌握 GLSL 语法是编写高效 WebGL 程序的基础。多练习使用这些函数，你会发现它们非常强大。`} />
`} /&amp;gt;&lt;CodeBlock language=&quot;text&quot; code={`
`} /&gt;