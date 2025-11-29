# WebGL 学习指南

## 什么是 WebGL？

WebGL (Web Graphics Library) 是一种 JavaScript API，它允许在任何兼容的网页浏览器中渲染交互式 2D 和 3D 图形，无需使用插件。WebGL 基于 OpenGL ES，直接在网页中利用 GPU 进行硬件加速渲染。

## WebGL 基础

### 1. 获取 WebGL 上下文

```javascript
// 获取 canvas 元素
const canvas = document.getElementById('myCanvas');

// 获取 WebGL 上下文
const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

if (!gl) {
  alert('您的浏览器不支持 WebGL');
  return;
}
```

### 2. 设置视口

```javascript
// 设置视口大小为 canvas 的实际大小
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
```

### 3. 清空画布

```javascript
// 设置清空颜色
gl.clearColor(0.0, 0.0, 0.0, 1.0);

// 清空颜色缓冲区和深度缓冲区
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
```

## 着色器程序

WebGL 使用着色器程序来处理图形渲染，包括顶点着色器和片元着色器。

### 1. 顶点着色器 (Vertex Shader)

顶点着色器负责处理顶点数据，确定顶点在屏幕上的位置。

```javascript
const vertexShaderSource = `
  attribute vec4 a_position;  // 顶点位置属性
  
  void main() {
    gl_Position = a_position;  // 设置顶点位置
  }
`;
```

### 2. 片元着色器 (Fragment Shader)

片元着色器负责计算每个像素的颜色。

```javascript
const fragmentShaderSource = `
  precision mediump float;  // 设置浮点数精度
  
  uniform vec4 u_color;  // 颜色 uniforms
  
  void main() {
    gl_FragColor = u_color;  // 设置像素颜色
  }
`;
```

### 3. 创建和编译着色器

```javascript
// 创建着色器函数
function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('着色器编译失败:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  
  return shader;
}

// 创建顶点着色器和片元着色器
const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
```

### 4. 创建和链接着色器程序

```javascript
// 创建着色器程序
function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('着色器程序链接失败:', gl.getProgramInfoLog(program));
    return null;
  }
  
  return program;
}

// 创建程序
const program = createProgram(gl, vertexShader, fragmentShader);

// 使用程序
gl.useProgram(program);
```

## 缓冲区对象

缓冲区对象用于存储顶点数据。

### 1. 创建和绑定缓冲区

```javascript
// 创建缓冲区
const positionBuffer = gl.createBuffer();

// 绑定缓冲区到 ARRAY_BUFFER 目标
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// 顶点数据（一个三角形）
const positions = [
  0, 0.5,  // 顶点 1
  -0.5, -0.5,  // 顶点 2
  0.5, -0.5   // 顶点 3
];

// 将数据写入缓冲区
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
```

### 2. 设置顶点属性

```javascript
// 获取属性位置
const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');

// 启用顶点属性
gl.enableVertexAttribArray(positionAttributeLocation);

// 设置顶点属性配置
gl.vertexAttribPointer(
  positionAttributeLocation,  // 属性位置
  2,  // 每个顶点的分量数（x, y）
  gl.FLOAT,  // 数据类型
  false,  // 不需要归一化
  0,  // 步长
  0   // 偏移量
);
```

## 绘制

### 1. 绘制图元

```javascript
// 设置 uniform 变量（颜色）
const colorUniformLocation = gl.getUniformLocation(program, 'u_color');
gl.uniform4f(colorUniformLocation, 0.0, 1.0, 0.0, 1.0);  // 绿色

// 绘制三角形
gl.drawArrays(gl.TRIANGLES, 0, 3);  // 3个顶点
```

### 2. 绘制模式

WebGL 支持多种绘制模式：
- `gl.POINTS` - 绘制点
- `gl.LINES` - 绘制线段
- `gl.LINE_STRIP` - 绘制连续线段
- `gl.LINE_LOOP` - 绘制闭合线段环
- `gl.TRIANGLES` - 绘制三角形
- `gl.TRIANGLE_STRIP` - 绘制连续三角形
- `gl.TRIANGLE_FAN` - 绘制扇形三角形

## 矩阵变换

### 1. 矩阵基础知识

在 WebGL 中，我们通常使用 4x4 矩阵进行变换。

```javascript
// 单位矩阵
const identityMatrix = [
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1
];

// 缩放矩阵
function scaleMatrix(x, y, z) {
  return [
    x, 0, 0, 0,
    0, y, 0, 0,
    0, 0, z, 0,
    0, 0, 0, 1
  ];
}

// 平移矩阵
function translationMatrix(x, y, z) {
  return [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    x, y, z, 1
  ];
}
```

### 2. 矩阵乘法

```javascript
function multiplyMatrices(a, b) {
  const result = new Array(16);
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      result[i * 4 + j] = 
        a[i * 4 + 0] * b[0 * 4 + j] +
        a[i * 4 + 1] * b[1 * 4 + j] +
        a[i * 4 + 2] * b[2 * 4 + j] +
        a[i * 4 + 3] * b[3 * 4 + j];
    }
  }
  return result;
}
```

### 3. 在着色器中使用矩阵

```javascript
// 更新顶点着色器
const vertexShaderSource = `
  attribute vec4 a_position;
  uniform mat4 u_matrix;  // 变换矩阵
  
  void main() {
    gl_Position = u_matrix * a_position;
  }
`;

// 设置矩阵 uniform
const matrixUniformLocation = gl.getUniformLocation(program, 'u_matrix');
const matrix = multiplyMatrices(scaleMatrix(0.5, 0.5, 1), translationMatrix(0.2, 0, 0));
gl.uniformMatrix4fv(matrixUniformLocation, false, matrix);
```

## 纹理

### 1. 创建和加载纹理

```javascript
// 创建纹理对象
const texture = gl.createTexture();

// 绑定纹理
gl.bindTexture(gl.TEXTURE_2D, texture);

// 设置默认纹理数据（直到加载完成）
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));

// 加载图像
const image = new Image();
image.src = 'texture.jpg';
image.onload = function() {
  // 绑定纹理
gl.bindTexture(gl.TEXTURE_2D, texture);
  
  // 设置纹理参数
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  
  // 上传纹理数据
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  
  // 绘制调用将使用新纹理
};
```

### 2. 在着色器中使用纹理

```javascript
// 更新顶点着色器，添加纹理坐标
const vertexShaderSource = `
  attribute vec4 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;
  
  void main() {
    gl_Position = a_position;
    v_texCoord = a_texCoord;
  }
`;

// 更新片元着色器，添加纹理采样
const fragmentShaderSource = `
  precision mediump float;
  varying vec2 v_texCoord;
  uniform sampler2D u_texture;
  
  void main() {
    gl_FragColor = texture2D(u_texture, v_texCoord);
  }
`;
```

## 高级特性

### 1. 深度测试

```javascript
// 启用深度测试
gl.enable(gl.DEPTH_TEST);

// 设置深度测试函数
gl.depthFunc(gl.LEQUAL);

// 清空深度缓冲区
gl.clear(gl.DEPTH_BUFFER_BIT);
```

### 2. 面剔除

```javascript
// 启用面剔除
gl.enable(gl.CULL_FACE);

// 设置要剔除的面
gl.cullFace(gl.BACK);  // 剔除背面

// 设置正面为逆时针
gl.frontFace(gl.CCW);
```

### 3. 混合

```javascript
// 启用混合
gl.enable(gl.BLEND);

// 设置混合函数
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
```

## 性能优化

1. **减少绘制调用**：合并几何体，使用实例化渲染
2. **使用 VAO (Vertex Array Object)**：保存顶点配置，避免重复设置
3. **纹理压缩**：使用压缩纹理格式
4. **避免实时计算**：预先计算可复用的数据
5. **使用 WebGL 2.0**：利用更多现代 GPU 特性
6. **使用帧缓冲区对象 (FBO)**：实现高级特效

## WebGL 2.0 新特性

1. **3D 纹理**：支持真正的 3D 纹理
2. **实例化渲染**：原生支持 gl.drawArraysInstanced 和 gl.drawElementsInstanced
3. **变换反馈**：GPU 到 GPU 的数据传输
4. **多渲染目标**：一次渲染到多个颜色附件
5. **统一缓冲区对象**：高效传递大块数据给着色器
6. **整数纹理**：支持整数像素格式

## 调试工具

1. **WebGL Inspector**：Chrome 扩展，用于检查和调试 WebGL 应用
2. **Chrome DevTools**：性能面板和 WebGL 调试工具
3. **Firefox WebGL 性能工具**：内置的性能监控
4. **WebGL Insights**：更深入的性能分析

## 常见问题解答

**Q: WebGL 支持哪些浏览器？**
A: 现代浏览器（Chrome、Firefox、Safari、Edge）都支持 WebGL 1.0，较新的浏览器也支持 WebGL 2.0。

**Q: 为什么我的 WebGL 程序性能很差？**
A: 可能的原因包括：过多的绘制调用、复杂的着色器、未经优化的几何体、未使用纹理压缩等。

**Q: 如何处理不同设备的性能差异？**
A: 实现 LOD (Level of Detail)、检测设备性能并调整渲染质量。

**Q: 如何处理高分辨率显示设备？**
A: 使用 devicePixelRatio 调整 canvas 大小，确保在高 DPI 屏幕上显示清晰。

**Q: 为什么我的着色器编译失败？**
A: 检查着色器语法错误、变量命名是否一致、是否使用了不支持的特性。

## 学习资源

- [WebGL Fundamentals](https://webglfundamentals.org/)
- [MDN WebGL 教程](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial)
- [WebGL 规范](https://www.khronos.org/registry/webgl/specs/latest/)
- [WebGL 2.0 规范](https://www.khronos.org/registry/webgl/specs/latest/2.0/)
- [WebGL Insights](https://webglinsights.github.io/)

## 最佳实践

1. **使用请求动画帧**：`requestAnimationFrame` 用于流畅的动画
2. **错误处理**：检查所有 WebGL 操作的返回值
3. **资源管理**：适时释放不再使用的纹理、缓冲区和着色器程序
4. **响应式设计**：根据窗口大小调整 canvas
5. **渐进增强**：为不支持 WebGL 的浏览器提供替代方案
6. **使用着色器语言扩展**：如 GLSLify 或 Shader Park