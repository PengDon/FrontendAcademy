# WebGL 示例

本目录包含 WebGL 的综合应用示例，帮助你理解如何将前面学到的知识应用到实际项目中。

## 内容概述

- **基础示例**：WebGL 基础功能的简单示例
- **3D 场景示例**：完整的 3D 场景实现
- **粒子系统示例**：粒子效果的实现
- **后处理示例**：后处理效果的实现
- **交互示例**：用户交互的实现
- **高级示例**：复杂 WebGL 技术的应用

## 学习重点

1. 理解完整 WebGL 应用的结构
2. 学习如何组织和管理 WebGL 资源
3. 掌握复杂场景的渲染技术
4. 了解高级 WebGL 功能的应用

## 示例代码

### 1. 基础示例：彩色三角形

```javascript
// WebGL 彩色三角形示例
function initColorfulTriangle() {
  // 获取 canvas 元素
  const canvas = document.getElementById('colorful-triangle-canvas');
  const gl = canvas.getContext('webgl');
  
  if (!gl) {
    console.error('WebGL not supported');
    return;
  }
  
  // 设置视口
  gl.viewport(0, 0, canvas.width, canvas.height);
  
  // 顶点着色器源
  const vertexShaderSource = `
    attribute vec2 a_position;
    attribute vec3 a_color;
    varying vec3 v_color;
    
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
      v_color = a_color;
    }
  `;
  
  // 片元着色器源
  const fragmentShaderSource = `
    precision mediump float;
    varying vec3 v_color;
    
    void main() {
      gl_FragColor = vec4(v_color, 1.0);
    }
  `;
  
  // 创建着色器程序
  function createShaderProgram(gl, vertexSource, fragmentSource) {
    // 创建顶点着色器
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexSource);
    gl.compileShader(vertexShader);
    
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error('Vertex shader error:', gl.getShaderInfoLog(vertexShader));
      return null;
    }
    
    // 创建片元着色器
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentSource);
    gl.compileShader(fragmentShader);
    
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.error('Fragment shader error:', gl.getShaderInfoLog(fragmentShader));
      return null;
    }
    
    // 创建程序
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      return null;
    }
    
    return program;
  }
  
  // 创建着色器程序
  const program = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource);
  
  if (!program) {
    return;
  }
  
  // 顶点数据（位置和颜色）
  const vertices = new Float32Array([
    // 位置          // 颜色
    -0.5, -0.5,      1.0, 0.0, 0.0,  // 左下角 红色
     0.5, -0.5,      0.0, 1.0, 0.0,  // 右下角 绿色
     0.0,  0.5,      0.0, 0.0, 1.0   // 顶部 蓝色
  ]);
  
  // 创建缓冲区
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  
  // 设置属性
  function setupAttributes(gl, program, buffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    
    // 位置属性
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 20, 0);
    
    // 颜色属性
    const colorLocation = gl.getAttribLocation(program, 'a_color');
    gl.enableVertexAttribArray(colorLocation);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 20, 8);
  }
  
  // 设置属性
  setupAttributes(gl, program, vertexBuffer);
  
  // 渲染函数
  function render(gl, program) {
    // 清空画布
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    // 使用程序
    gl.useProgram(program);
    
    // 绘制三角形
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  
  // 渲染
  render(gl, program);
}

// 页面加载完成后初始化
window.addEventListener('load', initColorfulTriangle);
```

### 2. 3D 场景示例：旋转立方体

```javascript
// WebGL 旋转立方体示例
class RotatingCubeExample {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.gl = this.canvas.getContext('webgl');
    
    if (!this.gl) {
      console.error('WebGL not supported');
      return;
    }
    
    // 初始化设置
    this.setupCanvas();
    this.createProgram();
    this.createBuffers();
    this.setupAttributes();
    this.setupUniforms();
    
    // 动画状态
    this.rotation = 0;
    
    // 开始动画
    this.animate();
  }
  
  setupCanvas() {
    // 设置画布大小
    this.canvas.width = this.canvas.clientWidth * window.devicePixelRatio;
    this.canvas.height = this.canvas.clientHeight * window.devicePixelRatio;
    this.canvas.style.width = `${this.canvas.clientWidth}px`;
    this.canvas.style.height = `${this.canvas.clientHeight}px`;
    
    // 设置视口
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }
  
  createProgram() {
    // 顶点着色器源
    const vertexShaderSource = `
      attribute vec3 a_position;
      attribute vec3 a_normal;
      uniform mat4 u_modelMatrix;
      uniform mat4 u_viewMatrix;
      uniform mat4 u_projectionMatrix;
      uniform mat3 u_normalMatrix;
      uniform vec3 u_lightDirection;
      varying vec3 v_color;
      
      void main() {
        // 计算位置
        vec4 position = u_modelMatrix * vec4(a_position, 1.0);
        vec4 viewPosition = u_viewMatrix * position;
        gl_Position = u_projectionMatrix * viewPosition;
        
        // 计算光照
        vec3 normal = normalize(u_normalMatrix * a_normal);
        float diffuse = max(dot(normal, u_lightDirection), 0.0);
        
        // 设置颜色
        v_color = vec3(0.8, 0.2, 0.2) * (diffuse + 0.2);
      }
    `;
    
    // 片元着色器源
    const fragmentShaderSource = `
      precision mediump float;
      varying vec3 v_color;
      
      void main() {
        gl_FragColor = vec4(v_color, 1.0);
      }
    `;
    
    // 创建着色器
    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    // 创建程序
    this.program = this.gl.createProgram();
    this.gl.attachShader(this.program, vertexShader);
    this.gl.attachShader(this.program, fragmentShader);
    this.gl.linkProgram(this.program);
    
    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      console.error('Program linking error:', this.gl.getProgramInfoLog(this.program));
      return;
    }
    
    // 删除着色器（不再需要）
    this.gl.deleteShader(vertexShader);
    this.gl.deleteShader(fragmentShader);
  }
  
  createShader(type, source) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Shader error:', this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }
    
    return shader;
  }
  
  createBuffers() {
    // 立方体顶点数据（位置和法线）
    const vertices = new Float32Array([
      // 前
      -0.5, -0.5,  0.5,  0.0,  0.0,  1.0,
       0.5, -0.5,  0.5,  0.0,  0.0,  1.0,
       0.5,  0.5,  0.5,  0.0,  0.0,  1.0,
      -0.5,  0.5,  0.5,  0.0,  0.0,  1.0,
      // 后
      -0.5, -0.5, -0.5,  0.0,  0.0, -1.0,
      -0.5,  0.5, -0.5,  0.0,  0.0, -1.0,
       0.5,  0.5, -0.5,  0.0,  0.0, -1.0,
       0.5, -0.5, -0.5,  0.0,  0.0, -1.0,
      // 上
      -0.5,  0.5, -0.5,  0.0,  1.0,  0.0,
      -0.5,  0.5,  0.5,  0.0,  1.0,  0.0,
       0.5,  0.5,  0.5,  0.0,  1.0,  0.0,
       0.5,  0.5, -0.5,  0.0,  1.0,  0.0,
      // 下
      -0.5, -0.5, -0.5,  0.0, -1.0,  0.0,
       0.5, -0.5, -0.5,  0.0, -1.0,  0.0,
       0.5, -0.5,  0.5,  0.0, -1.0,  0.0,
      -0.5, -0.5,  0.5,  0.0, -1.0,  0.0,
      // 右
       0.5, -0.5, -0.5,  1.0,  0.0,  0.0,
       0.5,  0.5, -0.5,  1.0,  0.0,  0.0,
       0.5,  0.5,  0.5,  1.0,  0.0,  0.0,
       0.5, -0.5,  0.5,  1.0,  0.0,  0.0,
      // 左
      -0.5, -0.5, -0.5, -1.0,  0.0,  0.0,
      -0.5, -0.5,  0.5, -1.0,  0.0,  0.0,
      -0.5,  0.5,  0.5, -1.0,  0.0,  0.0,
      -0.5,  0.5, -0.5, -1.0,  0.0,  0.0
    ]);
    
    // 索引数据
    const indices = new Uint16Array([
      // 前
      0,  1,  2,
      0,  2,  3,
      // 后
      4,  5,  6,
      4,  6,  7,
      // 上
      8,  9,  10,
      8,  10, 11,
      // 下
      12, 13, 14,
      12, 14, 15,
      // 右
      16, 17, 18,
      16, 18, 19,
      // 左
      20, 21, 22,
      20, 22, 23
    ]);
    
    // 创建顶点缓冲区
    this.vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
    
    // 创建索引缓冲区
    this.indexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, indices, this.gl.STATIC_DRAW);
    
    this.indexCount = indices.length;
  }
  
  setupAttributes() {
    // 使用程序
    this.gl.useProgram(this.program);
    
    // 绑定顶点缓冲区
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    
    // 设置位置属性
    const positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
    this.gl.enableVertexAttribArray(positionLocation);
    this.gl.vertexAttribPointer(positionLocation, 3, this.gl.FLOAT, false, 24, 0);
    
    // 设置法线属性
    const normalLocation = this.gl.getAttribLocation(this.program, 'a_normal');
    this.gl.enableVertexAttribArray(normalLocation);
    this.gl.vertexAttribPointer(normalLocation, 3, this.gl.FLOAT, false, 24, 12);
  }
  
  setupUniforms() {
    // 获取 uniform 位置
    this.modelMatrixLocation = this.gl.getUniformLocation(this.program, 'u_modelMatrix');
    this.viewMatrixLocation = this.gl.getUniformLocation(this.program, 'u_viewMatrix');
    this.projectionMatrixLocation = this.gl.getUniformLocation(this.program, 'u_projectionMatrix');
    this.normalMatrixLocation = this.gl.getUniformLocation(this.program, 'u_normalMatrix');
    this.lightDirectionLocation = this.gl.getUniformLocation(this.program, 'u_lightDirection');
    
    // 设置视图矩阵
    this.viewMatrix = this.createViewMatrix();
    this.gl.uniformMatrix4fv(this.viewMatrixLocation, false, this.viewMatrix);
    
    // 设置投影矩阵
    this.projectionMatrix = this.createProjectionMatrix();
    this.gl.uniformMatrix4fv(this.projectionMatrixLocation, false, this.projectionMatrix);
    
    // 设置光照方向
    const lightDirection = [-1.0, -1.0, -1.0];
    const normalizedLightDirection = this.normalizeVector(lightDirection);
    this.gl.uniform3fv(this.lightDirectionLocation, normalizedLightDirection);
  }
  
  createViewMatrix() {
    // 创建视图矩阵：相机在 (0, 0, 3) 看向原点
    const matrix = new Float32Array(16);
    
    // 单位矩阵
    for (let i = 0; i < 16; i++) {
      matrix[i] = i % 5 === 0 ? 1 : 0;
    }
    
    // 平移相机到 (0, 0, -3)
    matrix[14] = -3.0;
    
    return matrix;
  }
  
  createProjectionMatrix() {
    // 创建透视投影矩阵
    const aspect = this.canvas.width / this.canvas.height;
    const fov = Math.PI / 4; // 45 度
    const near = 0.1;
    const far = 100.0;
    
    const f = 1.0 / Math.tan(fov / 2);
    const rangeInv = 1.0 / (near - far);
    
    const matrix = new Float32Array([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (near + far) * rangeInv, near * far * rangeInv * 2,
      0, 0, -1, 0
    ]);
    
    return matrix;
  }
  
  normalizeVector(vector) {
    const length = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1] + vector[2] * vector[2]);
    return [vector[0] / length, vector[1] / length, vector[2] / length];
  }
  
  createModelMatrix() {
    // 创建模型矩阵：旋转立方体
    const matrix = new Float32Array(16);
    
    // 单位矩阵
    for (let i = 0; i < 16; i++) {
      matrix[i] = i % 5 === 0 ? 1 : 0;
    }
    
    // 计算旋转角度
    const rotationX = this.rotation * 0.7;
    const rotationY = this.rotation;
    
    // 旋转矩阵 X
    const cosX = Math.cos(rotationX);
    const sinX = Math.sin(rotationX);
    const rotationXMatrix = new Float32Array([
      1, 0, 0, 0,
      0, cosX, -sinX, 0,
      0, sinX, cosX, 0,
      0, 0, 0, 1
    ]);
    
    // 旋转矩阵 Y
    const cosY = Math.cos(rotationY);
    const sinY = Math.sin(rotationY);
    const rotationYMatrix = new Float32Array([
      cosY, 0, sinY, 0,
      0, 1, 0, 0,
      -sinY, 0, cosY, 0,
      0, 0, 0, 1
    ]);
    
    // 组合旋转矩阵
    return this.multiplyMatrices(rotationYMatrix, rotationXMatrix);
  }
  
  multiplyMatrices(a, b) {
    const result = new Float32Array(16);
    
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let sum = 0;
        for (let k = 0; k < 4; k++) {
          sum += a[i * 4 + k] * b[k * 4 + j];
        }
        result[i * 4 + j] = sum;
      }
    }
    
    return result;
  }
  
  getNormalMatrix(modelMatrix) {
    // 计算法线矩阵（模型矩阵的逆转置矩阵）
    const normalMatrix = new Float32Array(9);
    
    // 计算模型矩阵的逆矩阵（简化版，仅适用于旋转和缩放）
    const determinant = modelMatrix[0] * (modelMatrix[5] * modelMatrix[10] - modelMatrix[6] * modelMatrix[9]) - 
                       modelMatrix[1] * (modelMatrix[4] * modelMatrix[10] - modelMatrix[6] * modelMatrix[8]) + 
                       modelMatrix[2] * (modelMatrix[4] * modelMatrix[9] - modelMatrix[5] * modelMatrix[8]);
    
    const inverseDeterminant = 1.0 / determinant;
    
    // 计算逆矩阵的转置
    normalMatrix[0] = (modelMatrix[5] * modelMatrix[10] - modelMatrix[6] * modelMatrix[9]) * inverseDeterminant;
    normalMatrix[1] = (modelMatrix[2] * modelMatrix[9] - modelMatrix[1] * modelMatrix[10]) * inverseDeterminant;
    normalMatrix[2] = (modelMatrix[1] * modelMatrix[6] - modelMatrix[2] * modelMatrix[5]) * inverseDeterminant;
    normalMatrix[3] = (modelMatrix[6] * modelMatrix[8] - modelMatrix[4] * modelMatrix[10]) * inverseDeterminant;
    normalMatrix[4] = (modelMatrix[0] * modelMatrix[10] - modelMatrix[2] * modelMatrix[8]) * inverseDeterminant;
    normalMatrix[5] = (modelMatrix[2] * modelMatrix[4] - modelMatrix[0] * modelMatrix[6]) * inverseDeterminant;
    normalMatrix[6] = (modelMatrix[4] * modelMatrix[9] - modelMatrix[5] * modelMatrix[8]) * inverseDeterminant;
    normalMatrix[7] = (modelMatrix[1] * modelMatrix[8] - modelMatrix[0] * modelMatrix[9]) * inverseDeterminant;
    normalMatrix[8] = (modelMatrix[0] * modelMatrix[5] - modelMatrix[1] * modelMatrix[4]) * inverseDeterminant;
    
    return normalMatrix;
  }
  
  render() {
    // 清空画布
    this.gl.clearColor(0.1, 0.1, 0.1, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    
    // 启用深度测试
    this.gl.enable(this.gl.DEPTH_TEST);
    
    // 使用程序
    this.gl.useProgram(this.program);
    
    // 绑定索引缓冲区
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    
    // 更新模型矩阵
    this.rotation += 0.01;
    const modelMatrix = this.createModelMatrix();
    this.gl.uniformMatrix4fv(this.modelMatrixLocation, false, modelMatrix);
    
    // 更新法线矩阵
    const normalMatrix = this.getNormalMatrix(modelMatrix);
    this.gl.uniformMatrix3fv(this.normalMatrixLocation, false, normalMatrix);
    
    // 绘制立方体
    this.gl.drawElements(this.gl.TRIANGLES, this.indexCount, this.gl.UNSIGNED_SHORT, 0);
  }
  
  animate() {
    this.render();
    requestAnimationFrame(() => this.animate());
  }
}

// 页面加载完成后初始化
window.addEventListener('load', () => {
  new RotatingCubeExample('rotating-cube-canvas');
});
```

### 3. 粒子系统示例：烟花效果

```javascript
// WebGL 烟花粒子系统示例
class FireworksParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.gl = this.canvas.getContext('webgl');
    
    if (!this.gl) {
      console.error('WebGL not supported');
      return;
    }
    
    // 初始化设置
    this.setupCanvas();
    this.createProgram();
    this.setupParticles();
    this.setupBuffers();
    this.setupAttributes();
    this.setupUniforms();
    
    // 动画状态
    this.time = 0;
    this.particleSystems = [];
    
    // 开始动画
    this.animate();
    
    // 定期发射烟花
    setInterval(() => this.emitFirework(), 1500);
  }
  
  setupCanvas() {
    // 设置画布大小
    this.canvas.width = this.canvas.clientWidth * window.devicePixelRatio;
    this.canvas.height = this.canvas.clientHeight * window.devicePixelRatio;
    this.canvas.style.width = `${this.canvas.clientWidth}px`;
    this.canvas.style.height = `${this.canvas.clientHeight}px`;
    
    // 设置视口
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }
  
  createProgram() {
    // 顶点着色器源
    const vertexShaderSource = `
      attribute vec2 a_position;
      attribute vec4 a_color;
      attribute vec2 a_velocity;
      attribute float a_lifetime;
      attribute float a_maxLifetime;
      
      uniform float u_time;
      uniform float u_aspectRatio;
      
      varying vec4 v_color;
      
      void main() {
        // 计算粒子当前位置
        vec2 position = a_position;
        
        // 计算已存在时间
        float elapsedTime = u_time - a_lifetime;
        
        // 应用重力和速度
        position += a_velocity * elapsedTime;
        position.y -= 0.5 * 0.2 * elapsedTime * elapsedTime; // 重力
        
        // 应用宽高比
        position.x /= u_aspectRatio;
        
        // 设置位置
        gl_Position = vec4(position, 0.0, 1.0);
        
        // 计算透明度衰减
        float alpha = 1.0 - (elapsedTime / a_maxLifetime);
        
        // 设置点大小
        gl_PointSize = 3.0;
        
        // 设置颜色
        v_color = vec4(a_color.rgb, a_color.a * alpha);
      }
    `;
    
    // 片元着色器源
    const fragmentShaderSource = `
      precision mediump float;
      
      varying vec4 v_color;
      
      void main() {
        // 点精灵效果
        vec2 center = gl_PointCoord - vec2(0.5);
        float distance = length(center);
        
        if (distance > 0.5) {
          discard;
        }
        
        // 应用圆形渐变
        float alpha = 1.0 - distance * 2.0;
        
        // 设置最终颜色
        gl_FragColor = vec4(v_color.rgb, v_color.a * alpha);
      }
    `;
    
    // 创建着色器
    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    // 创建程序
    this.program = this.gl.createProgram();
    this.gl.attachShader(this.program, vertexShader);
    this.gl.attachShader(this.program, fragmentShader);
    this.gl.linkProgram(this.program);
    
    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      console.error('Program linking error:', this.gl.getProgramInfoLog(this.program));
      return;
    }
    
    // 删除着色器
    this.gl.deleteShader(vertexShader);
    this.gl.deleteShader(fragmentShader);
  }
  
  createShader(type, source) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Shader error:', this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }
    
    return shader;
  }
  
  setupParticles() {
    // 最大粒子数
    this.maxParticles = 5000;
    
    // 粒子数据
    this.particles = new Float32Array(this.maxParticles * 9); // 位置(2) + 颜色(4) + 速度(2) + 生命周期(1) + 最大生命周期(1)
    this.particleCount = 0;
  }
  
  setupBuffers() {
    // 创建顶点缓冲区
    this.vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.particles, this.gl.DYNAMIC_DRAW);
  }
  
  setupAttributes() {
    // 使用程序
    this.gl.useProgram(this.program);
    
    // 绑定顶点缓冲区
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    
    // 设置位置属性
    const positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
    this.gl.enableVertexAttribArray(positionLocation);
    this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 36, 0);
    
    // 设置颜色属性
    const colorLocation = this.gl.getAttribLocation(this.program, 'a_color');
    this.gl.enableVertexAttribArray(colorLocation);
    this.gl.vertexAttribPointer(colorLocation, 4, this.gl.FLOAT, false, 36, 8);
    
    // 设置速度属性
    const velocityLocation = this.gl.getAttribLocation(this.program, 'a_velocity');
    this.gl.enableVertexAttribArray(velocityLocation);
    this.gl.vertexAttribPointer(velocityLocation, 2, this.gl.FLOAT, false, 36, 24);
    
    // 设置生命周期属性
    const lifetimeLocation = this.gl.getAttribLocation(this.program, 'a_lifetime');
    this.gl.enableVertexAttribArray(lifetimeLocation);
    this.gl.vertexAttribPointer(lifetimeLocation, 1, this.gl.FLOAT, false, 36, 32);
    
    // 设置最大生命周期属性
    const maxLifetimeLocation = this.gl.getAttribLocation(this.program, 'a_maxLifetime');
    this.gl.enableVertexAttribArray(maxLifetimeLocation);
    this.gl.vertexAttribPointer(maxLifetimeLocation, 1, this.gl.FLOAT, false, 36, 36);
  }
  
  setupUniforms() {
    // 获取 uniform 位置
    this.timeLocation = this.gl.getUniformLocation(this.program, 'u_time');
    this.aspectRatioLocation = this.gl.getUniformLocation(this.program, 'u_aspectRatio');
    
    // 设置宽高比
    const aspectRatio = this.canvas.width / this.canvas.height;
    this.gl.uniform1f(this.aspectRatioLocation, aspectRatio);
  }
  
  addParticle(x, y, color, velocityX, velocityY, lifetime, maxLifetime) {
    // 如果超过最大粒子数，不添加新粒子
    if (this.particleCount >= this.maxParticles) {
      return;
    }
    
    const index = this.particleCount * 9;
    
    // 设置位置
    this.particles[index] = x;
    this.particles[index + 1] = y;
    
    // 设置颜色
    this.particles[index + 2] = color.r;
    this.particles[index + 3] = color.g;
    this.particles[index + 4] = color.b;
    this.particles[index + 5] = color.a;
    
    // 设置速度
    this.particles[index + 6] = velocityX;
    this.particles[index + 7] = velocityY;
    
    // 设置生命周期
    this.particles[index + 8] = lifetime;
    this.particles[index + 9] = maxLifetime;
    
    this.particleCount++;
  }
  
  emitFirework() {
    // 随机位置
    const x = (Math.random() - 0.5) * 2.0;
    const y = -1.0;
    
    // 随机颜色
    const color = {
      r: Math.random(),
      g: Math.random(),
      b: Math.random(),
      a: 1.0
    };
    
    // 随机速度
    const velocityX = (Math.random() - 0.5) * 0.5;
    const velocityY = Math.random() * 1.5 + 1.0;
    
    // 生命周期
    const lifetime = this.time;
    const maxLifetime = 1.0 + Math.random() * 2.0;
    
    // 添加烟花粒子
    this.addParticle(x, y, color, velocityX, velocityY, lifetime, maxLifetime);
    
    // 记录烟花系统，用于爆炸效果
    this.particleSystems.push({
      position: { x, y },
      color,
      explodeTime: lifetime + maxLifetime * 0.5,
      exploded: false
    });
  }
  
  explodeFirework(system) {
    // 爆炸粒子数量
    const particleCount = 100;
    
    for (let i = 0; i < particleCount; i++) {
      // 随机角度
      const angle = Math.random() * Math.PI * 2;
      
      // 随机速度
      const speed = Math.random() * 0.5 + 0.2;
      const velocityX = Math.cos(angle) * speed;
      const velocityY = Math.sin(angle) * speed;
      
      // 添加爆炸粒子
      this.addParticle(
        system.position.x,
        system.position.y,
        system.color,
        velocityX,
        velocityY,
        this.time,
        1.0 + Math.random() * 2.0
      );
    }
    
    // 标记为已爆炸
    system.exploded = true;
  }
  
  updateParticles() {
    // 检查烟花系统是否需要爆炸
    for (const system of this.particleSystems) {
      if (!system.exploded && this.time >= system.explodeTime) {
        this.explodeFirework(system);
      }
    }
    
    // 清理已爆炸的烟花系统
    this.particleSystems = this.particleSystems.filter(system => !system.exploded || this.time < system.explodeTime + 2.0);
    
    // 清理死亡粒子
    let newIndex = 0;
    
    for (let i = 0; i < this.particleCount; i++) {
      const index = i * 9;
      const lifetime = this.particles[index + 8];
      const maxLifetime = this.particles[index + 9];
      
      // 如果粒子还活着，保留它
      if (this.time - lifetime < maxLifetime) {
        for (let j = 0; j < 9; j++) {
          this.particles[newIndex * 9 + j] = this.particles[index + j];
        }
        newIndex++;
      }
    }
    
    // 更新粒子计数
    this.particleCount = newIndex;
    
    // 更新缓冲区
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, this.particles);
  }
  
  render() {
    // 清空画布
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    
    // 启用混合
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    
    // 使用程序
    this.gl.useProgram(this.program);
    
    // 更新时间 uniform
    this.gl.uniform1f(this.timeLocation, this.time);
    
    // 绘制粒子
    this.gl.drawArrays(this.gl.POINTS, 0, this.particleCount);
  }
  
  animate() {
    // 更新时间
    this.time += 0.016; // 假设 60fps
    
    // 更新粒子
    this.updateParticles();
    
    // 渲染
    this.render();
    
    // 请求下一帧
    requestAnimationFrame(() => this.animate());
  }
}

// 页面加载完成后初始化
window.addEventListener('load', () => {
  new FireworksParticleSystem('fireworks-canvas');
});
```

## 学习资源

- [WebGL Fundamentals](https://webglfundamentals.org/)
- [Three.js Documentation](https://threejs.org/docs/)
- [WebGL 2.0 Specification](https://www.khronos.org/registry/webgl/specs/latest/2.0/)
- [GLSL ES Specification](https://www.khronos.org/registry/OpenGL/specs/es/3.0/GLSL_ES_Specification_3.00.pdf)
- [Shadertoy](https://www.shadertoy.com/) - WebGL 着色器展示平台
- [WebGL Insights](https://webglinsights.com/) - WebGL 高级技术书籍

## 项目结构建议

一个完整的 WebGL 项目通常包含以下结构：

```
webgl-project/
├── src/
│   ├── core/
│   │   ├── WebGLContext.js    # WebGL 上下文管理
│   │   ├── Program.js         # 着色器程序管理
│   │   ├── Buffer.js          # 缓冲区管理
│   │   ├── Texture.js         # 纹理管理
│   │   └── Scene.js           # 场景管理
│   ├── renderers/
│   │   └── Renderer.js        # 渲染器
│   ├── geometries/
│   │   ├── Geometry.js        # 几何体基类
│   │   └── CubeGeometry.js    # 立方体几何体
│   ├── materials/
│   │   ├── Material.js        # 材质基类
│   │   └── PhongMaterial.js   # Phong 材质
│   ├── objects/
│   │   ├── Object3D.js        # 3D 对象基类
│   │   └── Mesh.js            # 网格对象
│   ├── cameras/
│   │   ├── Camera.js          # 相机基类
│   │   └── PerspectiveCamera.js # 透视相机
│   ├── lights/
│   │   ├── Light.js           # 光源基类
│   │   └── DirectionalLight.js # 平行光
│   ├── utils/
│   │   ├── Matrix.js          # 矩阵工具
│   │   ├── Vector.js          # 向量工具
│   │   └── Loader.js          # 资源加载器
│   └── main.js                # 主程序
├── shaders/
│   ├── basic.vert             # 基础顶点着色器
│   └── basic.frag             # 基础片元着色器
├── textures/                  # 纹理文件
├── models/                    # 模型文件
├── index.html                 # 页面入口
└── style.css                  # 样式文件
```

这种结构可以帮助你更好地组织和管理 WebGL 资源，提高代码的可维护性和可扩展性。
