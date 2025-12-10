# WebGL 基础

本目录包含 WebGL 的基础概念和核心组件，帮助你理解 WebGL 的工作原理和基本使用方法。

## 内容概述

- **WebGL 上下文**：获取和设置 WebGL 上下文
- **视口设置**：定义渲染区域
- **清空画布**：设置背景颜色和清空缓冲区
- **基础绘制流程**：从准备数据到渲染的完整流程

## 学习重点

1. 理解 WebGL 的基本工作原理
2. 掌握 WebGL 上下文的获取和配置
3. 学习基础的绘制流程
4. 理解 WebGL 的坐标系和缓冲区

## 示例代码

```javascript
// WebGL 基础绘制示例
// 绘制一个简单的三角形

// 获取 canvas 元素
const canvas = document.getElementById('myCanvas');

// 获取 WebGL 上下文
const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

if (!gl) {
  alert('您的浏览器不支持 WebGL');
  throw new Error('WebGL not supported');
}

// 设置 canvas 尺寸以匹配显示分辨率
function resizeCanvas() {
  const displayWidth = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;

  // 只有在尺寸变化时才更新
  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    // 设置 canvas 的实际绘制尺寸
    canvas.width = displayWidth;
    canvas.height = displayHeight;

    // 更新 WebGL 视口
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  }
}

// 调用尺寸调整函数
resizeCanvas();

// 定义顶点着色器源码
const vertexShaderSource = `
  attribute vec2 a_position;  // 顶点位置属性
  
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);  // 设置顶点位置
  }
`;

// 定义片元着色器源码
const fragmentShaderSource = `
  precision mediump float;  // 设置浮点数精度
  
  uniform vec4 u_color;  // 颜色 uniform
  
  void main() {
    gl_FragColor = u_color;  // 设置像素颜色
  }
`;

// 创建和编译着色器
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

// 创建着色器程序
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

// 创建顶点着色器和片元着色器
const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

if (!vertexShader || !fragmentShader) {
  throw new Error('Failed to create shaders');
}

// 创建着色器程序
const program = createProgram(gl, vertexShader, fragmentShader);

if (!program) {
  throw new Error('Failed to create program');
}

// 使用着色器程序
gl.useProgram(program);

// 创建并填充缓冲区
function createBuffer(gl, data) {
  const buffer = gl.createBuffer();
  if (!buffer) {
    throw new Error('Failed to create buffer');
  }
  
  // 绑定缓冲区
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  
  // 将数据写入缓冲区
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  
  return buffer;
}

// 定义三角形顶点数据（2D坐标）
const positions = [
  0.0,  0.5,  // 顶点 1
 -0.5, -0.5,  // 顶点 2
  0.5, -0.5   // 顶点 3
];

// 创建顶点缓冲区
const positionBuffer = createBuffer(gl, positions);

// 设置顶点属性
function setupVertexAttribute(gl, program, buffer, attributeName, numComponents) {
  // 获取属性位置
  const attributeLocation = gl.getAttribLocation(program, attributeName);
  if (attributeLocation === -1) {
    throw new Error(`Attribute ${attributeName} not found in program`);
  }
  
  // 绑定缓冲区
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  
  // 设置顶点属性配置
  gl.vertexAttribPointer(
    attributeLocation,  // 属性位置
    numComponents,      // 每个顶点的分量数
    gl.FLOAT,           // 数据类型
    false,              // 是否归一化
    0,                  // 步长
    0                   // 偏移量
  );
  
  // 启用顶点属性
  gl.enableVertexAttribArray(attributeLocation);
}

// 设置位置属性
setupVertexAttribute(gl, program, positionBuffer, 'a_position', 2);

// 设置 uniform 变量
function setUniform4f(gl, program, uniformName, v0, v1, v2, v3) {
  const uniformLocation = gl.getUniformLocation(program, uniformName);
  if (uniformLocation === null) {
    throw new Error(`Uniform ${uniformName} not found in program`);
  }
  gl.uniform4f(uniformLocation, v0, v1, v2, v3);
}

// 绘制函数
function draw() {
  // 调整 canvas 尺寸
  resizeCanvas();
  
  // 清空画布（颜色缓冲区）
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // 黑色背景
  gl.clear(gl.COLOR_BUFFER_BIT);
  
  // 设置三角形颜色为红色
  setUniform4f(gl, program, 'u_color', 1.0, 0.0, 0.0, 1.0);
  
  // 绘制三角形
  const primitiveType = gl.TRIANGLES;
  const offset = 0;
  const count = 3;  // 3 个顶点
  gl.drawArrays(primitiveType, offset, count);
}

// 绘制三角形
draw();

// 窗口大小调整事件监听
window.addEventListener('resize', draw);
```

## 核心概念解释

### WebGL 上下文

WebGL 上下文是与 GPU 交互的接口，通过 `canvas.getContext('webgl')` 获取。它提供了所有 WebGL API 方法。

### 视口

视口定义了 WebGL 在 canvas 上的渲染区域，通过 `gl.viewport(x, y, width, height)` 设置。

### 缓冲区

缓冲区用于存储顶点数据，WebGL 从缓冲区读取数据进行渲染。

### 着色器

WebGL 使用着色器程序处理图形渲染，包括顶点着色器和片元着色器。

### 绘制流程

1. 获取 WebGL 上下文
2. 创建和编译着色器
3. 创建着色器程序
4. 创建和填充缓冲区
5. 设置顶点属性
6. 设置 uniform 变量
7. 执行绘制命令

## 学习资源

- [WebGL 官方文档](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)
- [WebGL Fundamentals](https://webglfundamentals.org/)
- [WebGL 编程指南](https://sites.google.com/site/webglbook/)
