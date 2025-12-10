# WebGL 缓冲区

本目录包含 WebGL 缓冲区的相关知识和示例代码，帮助你理解和使用 WebGL 中的缓冲区对象。

## 内容概述

- **缓冲区类型**：顶点缓冲区、索引缓冲区等
- **缓冲区创建**：创建和配置缓冲区对象
- **数据填充**：将数据写入缓冲区
- **缓冲区绑定**：将缓冲区绑定到特定目标
- **动态缓冲区**：动态更新缓冲区数据

## 学习重点

1. 理解缓冲区在 WebGL 中的作用
2. 掌握不同类型缓冲区的使用场景
3. 学习缓冲区数据的组织和优化
4. 理解缓冲区与顶点属性的关系

## 示例代码

### 1. 创建和使用顶点缓冲区

```javascript
// 创建顶点缓冲区
function createVertexBuffer(gl, data) {
  const buffer = gl.createBuffer();
  if (!buffer) {
    throw new Error('Failed to create buffer');
  }
  
  // 绑定到 ARRAY_BUFFER 目标
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  
  // 将数据写入缓冲区
  // gl.STATIC_DRAW 表示数据不会频繁更改
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  
  return buffer;
}

// 定义顶点数据（位置和颜色）
const vertexData = [
  // 位置          颜色
  0.0,  0.5,    1.0, 0.0, 0.0,  // 顶点 1 - 红色
 -0.5, -0.5,    0.0, 1.0, 0.0,  // 顶点 2 - 绿色
  0.5, -0.5,    0.0, 0.0, 1.0   // 顶点 3 - 蓝色
];

// 创建顶点缓冲区
const vertexBuffer = createVertexBuffer(gl, vertexData);

// 设置顶点属性
function setupVertexAttributes(gl, program, buffer) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  
  // 位置属性
  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
  const positionSize = 2;       // 每个位置有2个分量
  const colorSize = 3;          // 每个颜色有3个分量
  const stride = (positionSize + colorSize) * Float32Array.BYTES_PER_ELEMENT;
  
  // 启用位置属性
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(
    positionAttributeLocation,
    positionSize,
    gl.FLOAT,
    false,
    stride,
    0  // 位置数据的偏移量
  );
  
  // 颜色属性
  const colorAttributeLocation = gl.getAttribLocation(program, 'a_color');
  gl.enableVertexAttribArray(colorAttributeLocation);
  gl.vertexAttribPointer(
    colorAttributeLocation,
    colorSize,
    gl.FLOAT,
    false,
    stride,
    positionSize * Float32Array.BYTES_PER_ELEMENT  // 颜色数据的偏移量
  );
}
```

### 2. 使用索引缓冲区

```javascript
// 创建索引缓冲区
function createIndexBuffer(gl, indices) {
  const buffer = gl.createBuffer();
  if (!buffer) {
    throw new Error('Failed to create index buffer');
  }
  
  // 绑定到 ELEMENT_ARRAY_BUFFER 目标
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  
  // 将索引数据写入缓冲区
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  
  return buffer;
}

// 定义顶点位置
const positions = [
  -0.5, -0.5,  // 顶点 0
   0.5, -0.5,  // 顶点 1
  -0.5,  0.5,  // 顶点 2
   0.5,  0.5   // 顶点 3
];

// 定义索引数据（绘制两个三角形）
const indices = [
  0, 1, 2,  // 第一个三角形
  1, 3, 2   // 第二个三角形
];

// 创建索引缓冲区
const indexBuffer = createIndexBuffer(gl, indices);

// 使用索引缓冲区绘制
function drawWithIndices(gl, count) {
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);
}
```

### 3. 动态更新缓冲区

```javascript
// 创建动态缓冲区
function createDynamicBuffer(gl, initialData) {
  const buffer = gl.createBuffer();
  if (!buffer) {
    throw new Error('Failed to create dynamic buffer');
  }
  
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  
  // 使用 DYNAMIC_DRAW 表示数据会频繁更改
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(initialData), gl.DYNAMIC_DRAW);
  
  return buffer;
}

// 更新缓冲区部分数据
function updateBufferSubData(gl, buffer, data, offset = 0) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  
  // 更新缓冲区的一部分数据
  // offset 表示从缓冲区的哪个字节位置开始更新
  gl.bufferSubData(gl.ARRAY_BUFFER, offset, new Float32Array(data));
}

// 重新填充整个缓冲区
function refillBuffer(gl, buffer, data) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  
  // 使用 bufferData 重新填充整个缓冲区
  // 这会重新分配缓冲区内存
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.DYNAMIC_DRAW);
}
```

## 缓冲区类型

WebGL 支持多种缓冲区类型，每种类型用于不同的目的：

| 类型 | 常量 | 描述 |
|------|------|------|
| 顶点缓冲区 | gl.ARRAY_BUFFER | 存储顶点数据，如位置、颜色、法线等 |
| 索引缓冲区 | gl.ELEMENT_ARRAY_BUFFER | 存储顶点索引，用于索引绘制 |
| 像素打包缓冲区 | gl.PIXEL_PACK_BUFFER | 存储从帧缓冲读取的像素数据 |
| 像素解包缓冲区 | gl.PIXEL_UNPACK_BUFFER | 存储要写入纹理的像素数据 |

## 缓冲区数据优化

### 数据对齐

确保缓冲区数据对齐到4字节边界，这是 WebGL 的要求：

```javascript
// 错误：每个顶点的字节数不是4的倍数
const badData = [
  // 位置(2) + 颜色(3) = 5个分量 = 20字节（没问题）
  0.0, 0.5, 1.0, 0.0, 0.0,
  -0.5, -0.5, 0.0, 1.0, 0.0,
  0.5, -0.5, 0.0, 0.0, 1.0
];

// 正确：添加填充使每个顶点的字节数是4的倍数
const goodData = [
  // 位置(2) + 颜色(3) + 填充(1) = 6个分量 = 24字节
  0.0, 0.5, 1.0, 0.0, 0.0, 0.0,
  -0.5, -0.5, 0.0, 1.0, 0.0, 0.0,
  0.5, -0.5, 0.0, 0.0, 1.0, 0.0
];
```

### 数据组织

将相关数据组织在一起可以提高缓存利用率：

```javascript
// 按属性组织数据（可能导致缓存未命中）
const attributeOrganized = {
  positions: [0.0, 0.5, -0.5, -0.5, 0.5, -0.5],
  colors: [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]
};

// 按顶点组织数据（更好的缓存利用率）
const vertexOrganized = [
  0.0, 0.5, 1.0, 0.0, 0.0,  // 顶点 1
 -0.5, -0.5, 0.0, 1.0, 0.0,  // 顶点 2
  0.5, -0.5, 0.0, 0.0, 1.0   // 顶点 3
];
```

## 学习资源

- [WebGL Fundamentals - Buffers](https://webglfundamentals.org/webgl/lessons/webgl-data-in-buffers.html)
- [WebGL - Buffer Objects](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Adding_2D_content_to_a_WebGL_context#creating_the_buffer)
- [WebGL Programming Guide - Chapter 3](https://sites.google.com/site/webglbook/chapter-3)
