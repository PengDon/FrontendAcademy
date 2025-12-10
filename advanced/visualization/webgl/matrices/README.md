# WebGL 矩阵变换

本目录包含 WebGL 中的矩阵变换知识和示例代码，帮助你理解如何在 WebGL 中实现平移、旋转、缩放等变换效果。

## 内容概述

- **矩阵基础**：矩阵的定义和基本运算
- **变换矩阵**：平移、旋转、缩放矩阵
- **矩阵组合**：复合变换的实现
- **坐标系变换**：模型、视图、投影矩阵
- **MVP矩阵**：模型视图投影矩阵的组合

## 学习重点

1. 理解矩阵在图形变换中的作用
2. 掌握基础变换矩阵的构造方法
3. 学习矩阵组合的顺序和原理
4. 理解 MVP 矩阵的概念和应用

## 示例代码

### 1. 矩阵基础操作

```javascript
// 矩阵工具函数

// 创建单位矩阵
function createIdentityMatrix() {
  return [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ];
}

// 矩阵乘法
function multiplyMatrices(a, b) {
  const result = [];
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

// 创建平移矩阵
function createTranslationMatrix(x, y, z) {
  return [
    1, 0, 0, x,
    0, 1, 0, y,
    0, 0, 1, z,
    0, 0, 0, 1
  ];
}

// 创建缩放矩阵
function createScalingMatrix(x, y, z) {
  return [
    x, 0, 0, 0,
    0, y, 0, 0,
    0, 0, z, 0,
    0, 0, 0, 1
  ];
}

// 创建旋转矩阵（绕Z轴）
function createRotationMatrixZ(angleInRadians) {
  const cos = Math.cos(angleInRadians);
  const sin = Math.sin(angleInRadians);
  
  return [
    cos, -sin, 0, 0,
    sin,  cos, 0, 0,
    0,    0,   1, 0,
    0,    0,   0, 1
  ];
}
```

### 2. 复合变换

```javascript
// 创建复合变换矩阵
function createTransformationMatrix(translation, rotationZ, scale) {
  // 注意变换顺序：缩放 -> 旋转 -> 平移
  const scaleMatrix = createScalingMatrix(scale.x, scale.y, scale.z);
  const rotationMatrix = createRotationMatrixZ(rotationZ);
  const translationMatrix = createTranslationMatrix(translation.x, translation.y, translation.z);
  
  // 组合矩阵
  // 注意乘法顺序：先应用的变换放在右侧
  let modelMatrix = multiplyMatrices(rotationMatrix, scaleMatrix);
  modelMatrix = multiplyMatrices(translationMatrix, modelMatrix);
  
  return modelMatrix;
}

// 使用复合变换
const translation = { x: 0.5, y: -0.2, z: 0 };
const rotationZ = Math.PI / 4; // 45度
const scale = { x: 0.8, y: 0.8, z: 1.0 };

const modelMatrix = createTransformationMatrix(translation, rotationZ, scale);

// 将矩阵传递给着色器
const modelMatrixLocation = gl.getUniformLocation(program, 'u_modelMatrix');
gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);
```

### 3. MVP 矩阵

```javascript
// 创建视图矩阵（模拟相机）
function createViewMatrix(cameraPosition, targetPosition, upVector) {
  // 计算相机方向
  const cameraDirection = normalize(
    subtractVectors(cameraPosition, targetPosition)
  );
  
  // 计算右侧向量
  const rightVector = normalize(
    crossVectors(upVector, cameraDirection)
  );
  
  // 计算上向量
  const up = normalize(
    crossVectors(cameraDirection, rightVector)
  );
  
  // 创建视图矩阵
  return [
    rightVector.x, up.x, cameraDirection.x, 0,
    rightVector.y, up.y, cameraDirection.y, 0,
    rightVector.z, up.z, cameraDirection.z, 0,
    -\dotVectors(rightVector, cameraPosition), 
    -\dotVectors(up, cameraPosition), 
    -\dotVectors(cameraDirection, cameraPosition), 
    1
  ];
}

// 创建正交投影矩阵
function createOrthographicMatrix(left, right, bottom, top, near, far) {
  const width = right - left;
  const height = top - bottom;
  const depth = far - near;
  
  return [
    2 / width, 0, 0, -(right + left) / width,
    0, 2 / height, 0, -(top + bottom) / height,
    0, 0, -2 / depth, -(far + near) / depth,
    0, 0, 0, 1
  ];
}

// 创建透视投影矩阵
function createPerspectiveMatrix(fieldOfViewInRadians, aspect, near, far) {
  const f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
  const rangeInv = 1.0 / (near - far);
  
  return [
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (near + far) * rangeInv, -1,
    0, 0, near * far * rangeInv * 2, 0
  ];
}

// 创建 MVP 矩阵
function createMVPMatrix(modelMatrix, viewMatrix, projectionMatrix) {
  let mvpMatrix = multiplyMatrices(viewMatrix, modelMatrix);
  mvpMatrix = multiplyMatrices(projectionMatrix, mvpMatrix);
  return mvpMatrix;
}
```

### 4. 使用矩阵进行变换

```javascript
// 顶点着色器中使用 MVP 矩阵
const vertexShaderSource = `
  attribute vec4 a_position;
  uniform mat4 u_mvpMatrix;
  
  void main() {
    gl_Position = u_mvpMatrix * a_position;
  }
`;

// 在 JavaScript 中设置 MVP 矩阵
function setupMVP(gl, program) {
  // 创建模型矩阵
  const modelMatrix = createIdentityMatrix();
  
  // 创建视图矩阵
  const cameraPosition = { x: 0, y: 0, z: 5 };
  const targetPosition = { x: 0, y: 0, z: 0 };
  const upVector = { x: 0, y: 1, z: 0 };
  const viewMatrix = createViewMatrix(cameraPosition, targetPosition, upVector);
  
  // 创建投影矩阵
  const fieldOfView = Math.PI * 0.5; // 90度
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const near = 0.1;
  const far = 100.0;
  const projectionMatrix = createPerspectiveMatrix(fieldOfView, aspect, near, far);
  
  // 创建 MVP 矩阵
  const mvpMatrix = createMVPMatrix(modelMatrix, viewMatrix, projectionMatrix);
  
  // 将 MVP 矩阵传递给着色器
  const mvpMatrixLocation = gl.getUniformLocation(program, 'u_mvpMatrix');
  gl.uniformMatrix4fv(mvpMatrixLocation, false, mvpMatrix);
}
```

## 向量工具函数

```javascript
// 向量工具函数

// 向量减法
function subtractVectors(a, b) {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
    z: a.z - b.z
  };
}

// 向量点积
function dotVectors(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

// 向量叉积
function crossVectors(a, b) {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x
  };
}

// 向量归一化
function normalize(vector) {
  const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
  return {
    x: vector.x / length,
    y: vector.y / length,
    z: vector.z / length
  };
}
```

## 变换顺序的重要性

在 WebGL 中，矩阵乘法的顺序非常重要。变换的应用顺序是从右到左的：

```javascript
// 先缩放，再旋转，最后平移
const modelMatrix = translationMatrix * rotationMatrix * scalingMatrix;

// 对应的变换顺序是：缩放 -> 旋转 -> 平移
```

不同的变换顺序会产生不同的结果，需要根据具体需求选择合适的顺序。

## 学习资源

- [WebGL Fundamentals - Matrices](https://webglfundamentals.org/webgl/lessons/webgl-2d-matrices.html)
- [Matrix Transformations](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_model_view_projection)
- [Learn WebGL - Matrices](http://learnwebgl.brown37.net/08_projections/projections_matrix_basics.html)
