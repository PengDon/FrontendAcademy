# WebGL 纹理

本目录包含 WebGL 纹理映射的相关知识和示例代码，帮助你理解如何在 WebGL 中使用纹理。

## 内容概述

- **纹理基础**：纹理的基本概念和作用
- **纹理创建**：创建和配置纹理对象
- **纹理坐标**：纹理坐标系统和映射
- **纹理过滤**：放大和缩小过滤模式
- **纹理包裹**：纹理的重复和边界处理
- **纹理加载**：从图像加载纹理数据

## 学习重点

1. 理解纹理映射的基本原理
2. 掌握纹理创建和配置的方法
3. 学习纹理坐标的设置和映射
4. 理解纹理过滤和包裹模式的作用
5. 掌握从图像加载纹理的技巧

## 示例代码

### 1. 创建和配置纹理

```javascript
// 创建纹理
function createTexture(gl) {
  const texture = gl.createTexture();
  if (!texture) {
    throw new Error('Failed to create texture');
  }
  
  // 绑定纹理
  gl.bindTexture(gl.TEXTURE_2D, texture);
  
  // 设置默认纹理数据（1x1 像素，红色）
  const pixel = new Uint8Array([255, 0, 0, 255]); // RGBA
  gl.texImage2D(
    gl.TEXTURE_2D,    // 纹理类型
    0,                // 纹理级别
    gl.RGBA,          // 内部格式
    1,                // 宽度
    1,                // 高度
    0,                // 边框
    gl.RGBA,          // 源格式
    gl.UNSIGNED_BYTE, // 源类型
    pixel             // 数据源
  );
  
  // 设置纹理过滤
  // 放大过滤：使用线性插值
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  
  // 缩小过滤：使用线性插值结合 mipmap
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  
  // 设置纹理包裹模式
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  
  return texture;
}

// 创建并配置纹理
const texture = createTexture(gl);
```

### 2. 加载图像纹理

```javascript
// 加载图像并创建纹理
function loadImageTexture(gl, imageUrl) {
  const texture = createTexture(gl);
  
  const image = new Image();
  image.onload = () => {
    // 绑定纹理
    gl.bindTexture(gl.TEXTURE_2D, texture);
    
    // 将图像数据上传到纹理
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      image
    );
    
    // 生成 mipmap
    gl.generateMipmap(gl.TEXTURE_2D);
    
    // 纹理加载完成后触发绘制
    draw();
  };
  
  image.onerror = () => {
    console.error('Failed to load image:', imageUrl);
  };
  
  // 开始加载图像
  image.crossOrigin = 'anonymous'; // 允许跨域加载
  image.src = imageUrl;
  
  return texture;
}

// 加载纹理图像
const texture = loadImageTexture(gl, 'textures/brick.jpg');
```

### 3. 纹理坐标和映射

```javascript
// 定义顶点数据（位置和纹理坐标）
const vertexData = [
  // 位置          纹理坐标
  -0.5, -0.5,    0.0, 0.0,  // 左下角
   0.5, -0.5,    1.0, 0.0,  // 右下角
  -0.5,  0.5,    0.0, 1.0,  // 左上角
   0.5,  0.5,    1.0, 1.0   // 右上角
];

// 创建顶点缓冲区
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

// 设置纹理坐标属性
const texcoordAttributeLocation = gl.getAttribLocation(program, 'a_texcoord');
const texcoordSize = 2; // 每个纹理坐标有2个分量
const stride = (2 + 2) * Float32Array.BYTES_PER_ELEMENT; // 位置(2) + 纹理坐标(2)
const texcoordOffset = 2 * Float32Array.BYTES_PER_ELEMENT; // 纹理坐标的偏移量
gl.enableVertexAttribArray(texcoordAttributeLocation);
gl.vertexAttribPointer(
  texcoordAttributeLocation,
  texcoordSize,
  gl.FLOAT,
  false,
  stride,
  texcoordOffset
);

// 顶点着色器
const vertexShaderSource = `
  attribute vec2 a_position;
  attribute vec2 a_texcoord;
  
  varying vec2 v_texcoord;
  
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texcoord = a_texcoord;
  }
`;

// 片元着色器
const fragmentShaderSource = `
  precision mediump float;
  
  varying vec2 v_texcoord;
  uniform sampler2D u_texture;
  
  void main() {
    gl_FragColor = texture2D(u_texture, v_texcoord);
  }
`;
```

### 4. 纹理单元和多纹理

```javascript
// 使用多个纹理
function setupMultiTextures(gl, program, texture1, texture2) {
  // 设置第一个纹理单元
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture1);
  
  // 设置第二个纹理单元
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, texture2);
  
  // 获取 uniform 位置
  const texture1Location = gl.getUniformLocation(program, 'u_texture1');
  const texture2Location = gl.getUniformLocation(program, 'u_texture2');
  
  // 将纹理单元传递给着色器
  gl.uniform1i(texture1Location, 0); // 纹理单元 0
  gl.uniform1i(texture2Location, 1); // 纹理单元 1
}

// 多纹理片元着色器
const fragmentShaderSource = `
  precision mediump float;
  
  varying vec2 v_texcoord;
  uniform sampler2D u_texture1;
  uniform sampler2D u_texture2;
  
  void main() {
    vec4 color1 = texture2D(u_texture1, v_texcoord);
    vec4 color2 = texture2D(u_texture2, v_texcoord);
    
    // 混合两个纹理
    gl_FragColor = mix(color1, color2, 0.5);
  }
`;
```

### 5. 纹理过滤和包裹模式

```javascript
// 设置纹理过滤模式
function setTextureFiltering(gl, texture, magFilter, minFilter) {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
}

// 设置纹理包裹模式
function setTextureWrapping(gl, texture, wrapS, wrapT) {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
}

// 示例：使用重复包裹模式
setTextureWrapping(gl, texture, gl.REPEAT, gl.REPEAT);

// 示例：使用最近邻过滤
setTextureFiltering(gl, texture, gl.NEAREST, gl.NEAREST_MIPMAP_NEAREST);
```

## 纹理坐标系统

WebGL 使用的纹理坐标系是：
- **S轴**：水平方向，范围从 0.0 到 1.0（左到右）
- **T轴**：垂直方向，范围从 0.0 到 1.0（下到上）

![纹理坐标系统](https://webglfundamentals.org/webgl/lessons/resources/texture-coordinates-diagram.svg)

## 常见纹理格式

| 格式 | 描述 | 通道数 |
|------|------|--------|
| gl.RGB | 红、绿、蓝 | 3 |
| gl.RGBA | 红、绿、蓝、透明度 | 4 |
| gl.LUMINANCE | 亮度 | 1 |
| gl.LUMINANCE_ALPHA | 亮度和透明度 | 2 |

## 纹理过滤模式

### 放大过滤（MAG_FILTER）
- `gl.NEAREST`：最近邻过滤，性能好但质量低
- `gl.LINEAR`：线性插值，质量好但性能略低

### 缩小过滤（MIN_FILTER）
- `gl.NEAREST`：最近邻过滤
- `gl.LINEAR`：线性插值
- `gl.NEAREST_MIPMAP_NEAREST`：最近邻 mipmap
- `gl.LINEAR_MIPMAP_NEAREST`：线性插值 mipmap
- `gl.NEAREST_MIPMAP_LINEAR`：最近邻 mipmap 之间线性插值
- `gl.LINEAR_MIPMAP_LINEAR`：三线性插值（最佳质量）

## 纹理包裹模式

- `gl.CLAMP_TO_EDGE`：边缘像素延伸
- `gl.REPEAT`：纹理重复
- `gl.MIRRORED_REPEAT`：纹理镜像重复

## 学习资源

- [WebGL Fundamentals - Textures](https://webglfundamentals.org/webgl/lessons/webgl-textures.html)
- [WebGL Programming Guide - Chapter 8](https://sites.google.com/site/webglbook/chapter-8)
- [MDN - WebGL Texture](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL)
