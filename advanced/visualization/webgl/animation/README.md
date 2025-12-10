# WebGL 动画

本目录包含 WebGL 动画实现的相关知识和示例代码，帮助你理解如何在 WebGL 中创建各种动画效果。

## 内容概述

- **基础动画**：使用 requestAnimationFrame 实现动画循环
- **属性动画**：对象属性的平滑过渡
- **矩阵动画**：使用矩阵变换实现动画
- **骨骼动画**：基于骨骼的角色动画
- **着色器动画**：在着色器中实现动画效果

## 学习重点

1. 理解 WebGL 动画的基本原理
2. 掌握 requestAnimationFrame 的使用
3. 学习矩阵变换动画的实现
4. 了解着色器动画的优势和实现方法

## 示例代码

### 1. 基础动画循环

```javascript
// WebGL 基础动画循环
function initAnimation() {
  // 初始化 WebGL 上下文和资源
  const canvas = document.getElementById('canvas');
  const gl = canvas.getContext('webgl');
  
  if (!gl) {
    console.error('WebGL not supported');
    return;
  }
  
  // 设置视口
  gl.viewport(0, 0, canvas.width, canvas.height);
  
  // 创建着色器程序
  const program = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource);
  
  // 创建顶点数据和缓冲区
  const { vertexBuffer, indexBuffer, indexCount } = createBuffers(gl);
  
  // 动画状态
  const animationState = {
    time: 0,
    rotation: 0,
    position: { x: 0, y: 0, z: 0 }
  };
  
  // 动画配置
  const animationConfig = {
    rotationSpeed: 0.01,
    positionSpeed: 0.01
  };
  
  // 渲染循环
  function animate() {
    // 更新动画状态
    updateAnimationState(animationState, animationConfig);
    
    // 渲染场景
    renderScene(gl, program, { vertexBuffer, indexBuffer, indexCount }, animationState);
    
    // 请求下一帧
    requestAnimationFrame(animate);
  }
  
  // 开始动画
  animate();
}

// 更新动画状态
function updateAnimationState(state, config) {
  // 更新时间
  state.time += 0.016; // 假设 60fps
  
  // 更新旋转
  state.rotation += config.rotationSpeed;
  
  // 更新位置（正弦波运动）
  state.position.x = Math.sin(state.time) * 0.5;
  state.position.y = Math.cos(state.time) * 0.5;
}

// 创建着色器程序
function createShaderProgram(gl, vertexSource, fragmentSource) {
  // 创建顶点着色器
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  
  // 创建片元着色器
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  
  // 创建程序并链接着色器
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Failed to link shader program:', gl.getProgramInfoLog(program));
    return null;
  }
  
  return program;
}

// 创建着色器
function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Failed to compile shader:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  
  return shader;
}

// 创建缓冲区
function createBuffers(gl) {
  // 顶点数据
  const vertices = [
    // 位置
    -0.5, -0.5, 0.0,
     0.5, -0.5, 0.0,
    -0.5,  0.5, 0.0,
     0.5,  0.5, 0.0
  ];
  
  // 索引数据
  const indices = [
    0, 1, 2,
    1, 3, 2
  ];
  
  // 创建顶点缓冲区
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  
  // 创建索引缓冲区
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  
  return {
    vertexBuffer,
    indexBuffer,
    indexCount: indices.length
  };
}

// 渲染场景
function renderScene(gl, program, buffers, animationState) {
  // 清空画布
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  // 使用着色器程序
  gl.useProgram(program);
  
  // 设置顶点位置属性
  const positionLocation = gl.getAttribLocation(program, 'a_position');
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertexBuffer);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
  
  // 创建模型变换矩阵
  const modelMatrix = createModelMatrix(animationState);
  
  // 创建视图矩阵
  const viewMatrix = createViewMatrix();
  
  // 创建投影矩阵
  const projectionMatrix = createProjectionMatrix(gl.canvas);
  
  // 计算 MVP 矩阵
  const mvpMatrix = multiplyMatrices(projectionMatrix, multiplyMatrices(viewMatrix, modelMatrix));
  
  // 设置 MVP 矩阵 uniform
  const mvpLocation = gl.getUniformLocation(program, 'u_mvpMatrix');
  gl.uniformMatrix4fv(mvpLocation, false, mvpMatrix);
  
  // 绘制
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indexBuffer);
  gl.drawElements(gl.TRIANGLES, buffers.indexCount, gl.UNSIGNED_SHORT, 0);
}

// 创建模型变换矩阵
function createModelMatrix(state) {
  // 初始化单位矩阵
  const matrix = new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]);
  
  // 平移
  translateMatrix(matrix, state.position.x, state.position.y, state.position.z);
  
  // 旋转
  rotateYMatrix(matrix, state.rotation);
  
  return matrix;
}

// 平移矩阵
function translateMatrix(matrix, x, y, z) {
  // 矩阵乘法：当前矩阵 * 平移矩阵
  const translationMatrix = new Float32Array([
    1, 0, 0, x,
    0, 1, 0, y,
    0, 0, 1, z,
    0, 0, 0, 1
  ]);
  
  multiplyMatricesInPlace(matrix, translationMatrix);
}

// Y 轴旋转矩阵
function rotateYMatrix(matrix, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  
  const rotationMatrix = new Float32Array([
    cos, 0, sin, 0,
    0, 1, 0, 0,
    -sin, 0, cos, 0,
    0, 0, 0, 1
  ]);
  
  multiplyMatricesInPlace(matrix, rotationMatrix);
}

// 创建视图矩阵
function createViewMatrix() {
  // 简单的视图矩阵，相机位于 (0, 0, 2) 看向原点
  const matrix = new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, -2,
    0, 0, 0, 1
  ]);
  
  return matrix;
}

// 创建投影矩阵
function createProjectionMatrix(canvas) {
  const aspect = canvas.width / canvas.height;
  const fov = Math.PI / 3; // 60 度
  const near = 0.1;
  const far = 100;
  
  const f = 1.0 / Math.tan(fov / 2);
  const rangeInv = 1.0 / (near - far);
  
  // 透视投影矩阵
  const matrix = new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (near + far) * rangeInv, near * far * rangeInv * 2,
    0, 0, -1, 0
  ]);
  
  return matrix;
}

// 矩阵乘法
function multiplyMatrices(a, b) {
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

// 矩阵乘法（原地修改）
function multiplyMatricesInPlace(dest, src) {
  const temp = new Float32Array(dest);
  
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      let sum = 0;
      for (let k = 0; k < 4; k++) {
        sum += temp[i * 4 + k] * src[k * 4 + j];
      }
      dest[i * 4 + j] = sum;
    }
  }
}

// 顶点着色器
const vertexShaderSource = `
attribute vec4 a_position;
uniform mat4 u_mvpMatrix;

void main() {
  gl_Position = u_mvpMatrix * a_position;
}
`;

// 片元着色器
const fragmentShaderSource = `
precision mediump float;

void main() {
  gl_FragColor = vec4(1.0, 0.5, 0.2, 1.0);
}
`;

// 初始化动画
initAnimation();
```

### 2. 着色器动画

```javascript
// 顶点着色器（带动画）
const animatedVertexShader = `
attribute vec4 a_position;
attribute vec2 a_texcoord;
uniform mat4 u_mvpMatrix;
uniform float u_time;

varying vec2 v_texcoord;
varying vec3 v_position;

void main() {
  // 添加顶点动画（波浪效果）
  vec4 animatedPosition = a_position;
  animatedPosition.y += sin(a_position.x * 10.0 + u_time) * 0.1;
  animatedPosition.x += cos(a_position.y * 10.0 + u_time) * 0.05;
  
  // 设置位置
  gl_Position = u_mvpMatrix * animatedPosition;
  
  // 传递变化的位置到片元着色器
  v_position = animatedPosition.xyz;
  
  // 传递纹理坐标
  v_texcoord = a_texcoord;
}
`;

// 片元着色器（带动画）
const animatedFragmentShader = `
precision mediump float;

uniform sampler2D u_texture;
uniform float u_time;
varying vec2 v_texcoord;
varying vec3 v_position;

void main() {
  // 动画纹理坐标（滚动效果）
  vec2 animatedTexcoord = v_texcoord;
  animatedTexcoord.x += u_time * 0.1;
  animatedTexcoord.y += sin(u_time) * 0.05;
  
  // 采样纹理
  vec4 textureColor = texture2D(u_texture, animatedTexcoord);
  
  // 添加颜色动画（基于时间和位置）
  vec3 animatedColor = textureColor.rgb;
  animatedColor.r += sin(u_time + v_position.x * 10.0) * 0.1;
  animatedColor.g += cos(u_time + v_position.y * 10.0) * 0.1;
  
  // 应用脉冲效果
  float pulse = sin(u_time * 5.0) * 0.1 + 0.9;
  animatedColor *= pulse;
  
  // 设置最终颜色
  gl_FragColor = vec4(animatedColor, textureColor.a);
}
`;

// 更新着色器动画的时间 uniform
function updateShaderAnimationTime(gl, program, time) {
  const timeLocation = gl.getUniformLocation(program, 'u_time');
  if (timeLocation) {
    gl.uniform1f(timeLocation, time);
  }
}
```

### 3. 骨骼动画基础

```javascript
// 骨骼动画状态
const skeletonAnimationState = {
  time: 0,
  bones: [
    // 根骨骼
    { 
      name: 'root',
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 }
    },
    // 手臂骨骼
    { 
      name: 'arm',
      position: { x: 0.5, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 }
    }
  ]
};

// 更新骨骼动画
function updateSkeletonAnimation(state) {
  state.time += 0.016;
  
  // 更新根骨骼
  state.bones[0].rotation.y = Math.sin(state.time) * 0.1;
  
  // 更新手臂骨骼（摆动效果）
  state.bones[1].rotation.x = Math.sin(state.time * 2) * 0.5;
}

// 计算骨骼变换矩阵
function calculateBoneMatrix(bone) {
  const matrix = new Float32Array(16);
  
  // 设置单位矩阵
  for (let i = 0; i < 16; i++) {
    matrix[i] = i % 5 === 0 ? 1 : 0;
  }
  
  // 平移
  translateMatrix(matrix, bone.position.x, bone.position.y, bone.position.z);
  
  // 旋转
  rotateXMatrix(matrix, bone.rotation.x);
  rotateYMatrix(matrix, bone.rotation.y);
  rotateZMatrix(matrix, bone.rotation.z);
  
  return matrix;
}

// 顶点着色器（支持骨骼动画）
const skeletonVertexShader = `
attribute vec4 a_position;
attribute vec4 a_boneIndices;
attribute vec4 a_boneWeights;
uniform mat4 u_mvpMatrix;
uniform mat4 u_boneMatrices[16];

void main() {
  // 骨骼变换
  vec4 position = vec4(0.0);
  
  // 应用每个骨骼的变换和权重
  for (int i = 0; i < 4; i++) {
    int boneIndex = int(a_boneIndices[i]);
    float boneWeight = a_boneWeights[i];
    
    if (boneWeight > 0.0) {
      position += u_boneMatrices[boneIndex] * a_position * boneWeight;
    }
  }
  
  // 设置最终位置
  gl_Position = u_mvpMatrix * position;
}
`;
```

## 动画性能优化

1. **减少绘制调用**：合并几何体，使用实例化渲染
2. **避免不必要的计算**：将静态计算移出渲染循环
3. **使用矩阵库**：使用优化的矩阵运算库（如 glMatrix）
4. **减少状态切换**：在渲染循环中按材质和状态分组绘制
5. **使用 requestAnimationFrame**：避免使用 setTimeout/setInterval
6. **考虑使用 Web Workers**：将复杂计算移到后台线程

## 动画技术选择

| 动画类型 | 优势 | 劣势 | 适用场景 |
|----------|------|------|----------|
| JavaScript 动画 | 灵活，易于实现 | 可能性能较低 | 简单动画，状态驱动动画 |
| 着色器动画 | 高性能，并行处理 | 调试复杂，灵活性较低 | 复杂的顶点动画，大量粒子动画 |
| 骨骼动画 | 自然的角色动画 | 实现复杂 | 角色模型动画，生物动画 |
| 纹理动画 | 简单高效 | 效果有限 | 火焰、水流等简单效果 |

## 学习资源

- [MDN - requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
- [WebGL Fundamentals - Animation](https://webglfundamentals.org/webgl/lessons/webgl-animation.html)
- [glMatrix - 高性能矩阵运算库](http://glmatrix.net/)
- [Three.js Animation System](https://threejs.org/docs/index.html#manual/en/introduction/Animation-system)
- [Khronos WebGL Animation Extension](https://www.khronos.org/registry/webgl/extensions/EXT_shader_texture_lod/)
