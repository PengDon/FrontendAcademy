# WebGL 着色器

本目录包含 WebGL 着色器的相关知识和示例代码，帮助你理解和使用着色器。

## 内容概述

- **顶点着色器**：处理顶点数据
- **片元着色器**：处理像素颜色
- **着色器程序**：链接顶点和片元着色器
- **属性和 uniform**：向着色器传递数据
- **Varying 变量**：在着色器之间传递数据

## 学习重点

1. 理解顶点着色器和片元着色器的作用
2. 掌握 GLSL ES 语言的基本语法
3. 学习如何向着色器传递数据
4. 理解着色器之间的数据流动

## 示例代码

### 1. 基础着色器程序

```javascript
// 顶点着色器源码
const vertexShaderSource = `
  attribute vec2 a_position;  // 顶点位置属性
  attribute vec3 a_color;     // 顶点颜色属性
  
  varying vec3 v_color;       // 传递给片元着色器的颜色
  
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);  // 设置顶点位置
    v_color = a_color;                        // 传递颜色
  }
`;

// 片元着色器源码
const fragmentShaderSource = `
  precision mediump float;  // 设置浮点数精度
  
  varying vec3 v_color;     // 从顶点着色器接收的颜色
  
  void main() {
    gl_FragColor = vec4(v_color, 1.0);  // 设置像素颜色
  }
`;

// 创建和编译着色器的函数见 basics 目录
```

### 2. 使用 Uniform 的着色器

```javascript
// 顶点着色器源码
const vertexShaderSource = `
  attribute vec2 a_position;
  uniform mat3 u_matrix;    // 变换矩阵
  
  void main() {
    // 使用矩阵变换顶点位置
    gl_Position = vec4(u_matrix * vec3(a_position, 1.0), 1.0);
  }
`;

// 片元着色器源码
const fragmentShaderSource = `
  precision mediump float;
  uniform vec4 u_color;     // 统一颜色
  
  void main() {
    gl_FragColor = u_color;
  }
`;
```

### 3. 使用纹理的着色器

```javascript
// 顶点着色器源码
const vertexShaderSource = `
  attribute vec2 a_position;
  attribute vec2 a_texcoord;
  
  varying vec2 v_texcoord;
  
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texcoord = a_texcoord;
  }
`;

// 片元着色器源码
const fragmentShaderSource = `
  precision mediump float;
  
  varying vec2 v_texcoord;
  uniform sampler2D u_texture;
  
  void main() {
    gl_FragColor = texture2D(u_texture, v_texcoord);
  }
`;
```

## GLSL ES 基础语法

### 数据类型

- **基本类型**：`float`, `int`, `bool`
- **向量类型**：`vec2`, `vec3`, `vec4`, `ivec2`, `ivec3`, `ivec4`, `bvec2`, `bvec3`, `bvec4`
- **矩阵类型**：`mat2`, `mat3`, `mat4`
- **采样器类型**：`sampler2D`, `samplerCube`

### 变量修饰符

- **attribute**：从 JavaScript 传递给顶点着色器的顶点数据
- **uniform**：从 JavaScript 传递给着色器的全局数据
- **varying**：在顶点着色器和片元着色器之间传递数据
- **const**：常量

### 内建变量

- **顶点着色器**：`gl_Position`, `gl_PointSize`
- **片元着色器**：`gl_FragColor`, `gl_FragCoord`, `gl_FrontFacing`, `gl_PointCoord`

## 着色器编译和链接

### 编译着色器

```javascript
function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  
  // 检查编译状态
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
  
  // 编译失败，打印错误信息
  console.error('Shader compilation failed:', gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return null;
}
```

### 链接着色器程序

```javascript
function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  
  // 检查链接状态
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
  
  // 链接失败，打印错误信息
  console.error('Program link failed:', gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  return null;
}
```

## 向着色器传递数据

### 设置属性数据

```javascript
// 获取属性位置
const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');

// 启用属性
 gl.enableVertexAttribArray(positionAttributeLocation);

// 绑定缓冲区
 gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// 设置属性配置
const size = 2;           // 每个顶点2个分量
const type = gl.FLOAT;    // 数据类型
const normalize = false;  // 不需要归一化
const stride = 0;         // 步长为0，紧密排列
const offset = 0;         // 从缓冲区起始位置开始
 gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
```

### 设置 Uniform 数据

```javascript
// 设置浮点数
const floatUniformLocation = gl.getUniformLocation(program, 'u_float');
 gl.uniform1f(floatUniformLocation, 1.5);

// 设置向量
const vec4UniformLocation = gl.getUniformLocation(program, 'u_color');
 gl.uniform4f(vec4UniformLocation, 1.0, 0.0, 0.0, 1.0);

// 设置矩阵
const matrixUniformLocation = gl.getUniformLocation(program, 'u_matrix');
 gl.uniformMatrix3fv(matrixUniformLocation, false, matrixData);
```

## 学习资源

- [GLSL ES 规范](https://www.khronos.org/registry/OpenGL/specs/es/2.0/GLSL_ES_Specification_1.00.pdf)
- [WebGL Fundamentals - Shaders](https://webglfundamentals.org/webgl/lessons/webgl-shaders-and-glsl.html)
- [The Book of Shaders](https://thebookofshaders.com/)
