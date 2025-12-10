# WebGL 模型

本目录包含 WebGL 模型加载和使用的相关知识和示例代码，帮助你理解如何在 WebGL 中加载和渲染3D模型。

## 内容概述

- **模型格式**：常见的3D模型格式介绍
- **OBJ 模型加载**：加载和解析 OBJ 模型文件
- **JSON 模型加载**：加载和解析 JSON 格式的模型
- **模型动画**：简单的模型动画实现
- **模型优化**：模型的优化和简化

## 学习重点

1. 理解常见的3D模型格式
2. 掌握 OBJ 模型的加载和解析方法
3. 学习 JSON 模型的加载和使用
4. 理解模型数据的组织和使用方式

## 示例代码

### 1. OBJ 模型加载器

```javascript
// OBJ 模型加载器
class OBJLoader {
  constructor(gl) {
    this.gl = gl;
  }
  
  // 加载 OBJ 模型
  async loadModel(url) {
    try {
      const response = await fetch(url);
      const text = await response.text();
      return this.parseOBJ(text);
    } catch (error) {
      console.error('Failed to load OBJ model:', error);
      throw error;
    }
  }
  
  // 解析 OBJ 文本
  parseOBJ(text) {
    const vertices = [];
    const normals = [];
    const texcoords = [];
    const indices = [];
    
    // 用于存储解析后的顶点数据
    const resultVertices = [];
    const resultNormals = [];
    const resultTexcoords = [];
    
    // 按行分割文本
    const lines = text.split('\n');
    
    for (const line of lines) {
      // 去除行首行尾空格
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith('#')) {
        continue; // 跳过空行和注释
      }
      
      const parts = trimmedLine.split(/\s+/);
      const type = parts[0];
      
      switch (type) {
        case 'v': // 顶点
          vertices.push(
            parseFloat(parts[1]),
            parseFloat(parts[2]),
            parseFloat(parts[3])
          );
          break;
        
        case 'vn': // 法线
          normals.push(
            parseFloat(parts[1]),
            parseFloat(parts[2]),
            parseFloat(parts[3])
          );
          break;
        
        case 'vt': // 纹理坐标
          texcoords.push(
            parseFloat(parts[1]),
            parseFloat(parts[2])
          );
          break;
        
        case 'f': // 面
          this.parseFace(parts, vertices, normals, texcoords, resultVertices, resultNormals, resultTexcoords, indices);
          break;
      }
    }
    
    return {
      vertices: resultVertices,
      normals: resultNormals,
      texcoords: resultTexcoords,
      indices: indices
    };
  }
  
  // 解析面
  parseFace(parts, vertices, normals, texcoords, resultVertices, resultNormals, resultTexcoords, indices) {
    // 移除 'f' 类型
    parts.shift();
    
    // 将面拆分为三角形
    for (let i = 2; i < parts.length; i++) {
      // 解析三个顶点
      this.parseVertex(parts[0], vertices, normals, texcoords, resultVertices, resultNormals, resultTexcoords, indices);
      this.parseVertex(parts[i - 1], vertices, normals, texcoords, resultVertices, resultNormals, resultTexcoords, indices);
      this.parseVertex(parts[i], vertices, normals, texcoords, resultVertices, resultNormals, resultTexcoords, indices);
    }
  }
  
  // 解析单个顶点
  parseVertex(vertexString, vertices, normals, texcoords, resultVertices, resultNormals, resultTexcoords, indices) {
    // 顶点格式：位置索引/纹理索引/法线索引
    const indicesParts = vertexString.split('/');
    const posIndex = parseInt(indicesParts[0]) - 1;
    const texIndex = indicesParts[1] ? parseInt(indicesParts[1]) - 1 : -1;
    const normIndex = indicesParts[2] ? parseInt(indicesParts[2]) - 1 : -1;
    
    // 添加顶点位置
    resultVertices.push(
      vertices[posIndex * 3],
      vertices[posIndex * 3 + 1],
      vertices[posIndex * 3 + 2]
    );
    
    // 添加纹理坐标（如果有）
    if (texIndex !== -1 && texcoords.length > 0) {
      resultTexcoords.push(
        texcoords[texIndex * 2],
        texcoords[texIndex * 2 + 1]
      );
    }
    
    // 添加法线（如果有）
    if (normIndex !== -1 && normals.length > 0) {
      resultNormals.push(
        normals[normIndex * 3],
        normals[normIndex * 3 + 1],
        normals[normIndex * 3 + 2]
      );
    }
    
    // 添加索引
    indices.push(indices.length);
  }
  
  // 创建模型缓冲区
  createModelBuffers(modelData) {
    const gl = this.gl;
    
    // 创建顶点缓冲区
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(modelData.vertices), gl.STATIC_DRAW);
    
    // 创建法线缓冲区（如果有）
    let normalBuffer = null;
    if (modelData.normals.length > 0) {
      normalBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(modelData.normals), gl.STATIC_DRAW);
    }
    
    // 创建纹理坐标缓冲区（如果有）
    let texcoordBuffer = null;
    if (modelData.texcoords.length > 0) {
      texcoordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(modelData.texcoords), gl.STATIC_DRAW);
    }
    
    // 创建索引缓冲区
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(modelData.indices), gl.STATIC_DRAW);
    
    return {
      vertexBuffer,
      normalBuffer,
      texcoordBuffer,
      indexBuffer,
      indexCount: modelData.indices.length
    };
  }
}

// 使用 OBJ 加载器
async function loadAndRenderOBJ() {
  const loader = new OBJLoader(gl);
  
  try {
    // 加载模型
    const modelData = await loader.loadModel('models/cube.obj');
    
    // 创建缓冲区
    const buffers = loader.createModelBuffers(modelData);
    
    // 设置缓冲区和属性
    setupModelBuffers(buffers);
    
    // 渲染模型
    renderModel(buffers.indexCount);
  } catch (error) {
    console.error('Failed to load and render OBJ model:', error);
  }
}
```

### 2. JSON 模型加载

```javascript
// JSON 模型加载器
async function loadJSONModel(url) {
  try {
    const response = await fetch(url);
    const modelData = await response.json();
    return modelData;
  } catch (error) {
    console.error('Failed to load JSON model:', error);
    throw error;
  }
}

// 创建 JSON 模型缓冲区
function createJSONModelBuffers(gl, modelData) {
  // 创建顶点缓冲区
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(modelData.vertices), gl.STATIC_DRAW);
  
  // 创建法线缓冲区（如果有）
  let normalBuffer = null;
  if (modelData.normals) {
    normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(modelData.normals), gl.STATIC_DRAW);
  }
  
  // 创建纹理坐标缓冲区（如果有）
  let texcoordBuffer = null;
  if (modelData.texcoords) {
    texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(modelData.texcoords), gl.STATIC_DRAW);
  }
  
  // 创建索引缓冲区（如果有）
  let indexBuffer = null;
  let indexCount = 0;
  if (modelData.indices) {
    indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(modelData.indices), gl.STATIC_DRAW);
    indexCount = modelData.indices.length;
  } else {
    indexCount = modelData.vertices.length / 3;
  }
  
  return {
    vertexBuffer,
    normalBuffer,
    texcoordBuffer,
    indexBuffer,
    indexCount
  };
}
```

### 3. 渲染加载的模型

```javascript
// 设置模型缓冲区和属性
function setupModelBuffers(buffers) {
  const gl = this.gl;
  const program = this.program;
  
  // 设置顶点位置
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertexBuffer);
  const positionLocation = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
  
  // 设置法线（如果有）
  if (buffers.normalBuffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normalBuffer);
    const normalLocation = gl.getAttribLocation(program, 'a_normal');
    gl.enableVertexAttribArray(normalLocation);
    gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);
  }
  
  // 设置纹理坐标（如果有）
  if (buffers.texcoordBuffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.texcoordBuffer);
    const texcoordLocation = gl.getAttribLocation(program, 'a_texcoord');
    gl.enableVertexAttribArray(texcoordLocation);
    gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);
  }
}

// 渲染模型
function renderModel(indexCount) {
  const gl = this.gl;
  
  if (indexCount > 0) {
    // 使用索引绘制
    gl.drawElements(gl.TRIANGLES, indexCount, gl.UNSIGNED_SHORT, 0);
  } else {
    // 不使用索引绘制
    gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
  }
}
```

## 常见模型格式

| 格式 | 扩展名 | 特点 |
|------|--------|------|
| OBJ | .obj | 简单文本格式，支持顶点、法线、纹理坐标 |
| FBX | .fbx | 二进制格式，支持动画、材质等复杂数据 |
| COLLADA | .dae | XML 格式，支持复杂场景和动画 |
| glTF | .gltf, .glb | Web 友好格式，支持高效加载和渲染 |
| JSON | .json | 自定义 JSON 格式，适合简单模型 |

## 模型优化建议

1. **减少顶点数量**：使用模型简化工具减少顶点数量
2. **使用索引**：通过索引重用顶点，减少内存占用
3. **合并模型**：将多个小模型合并为一个，减少绘制调用
4. **使用 LOD**：根据距离使用不同细节的模型
5. **压缩纹理**：使用压缩纹理格式减少内存占用

## 学习资源

- [Wavefront .OBJ File Format](http://paulbourke.net/dataformats/obj/)
- [WebGL Fundamentals - Models](https://webglfundamentals.org/webgl/lessons/webgl-models.html)
- [Three.js OBJLoader](https://threejs.org/docs/index.html#examples/en/loaders/OBJLoader)
- [glTF - GL Transmission Format](https://www.khronos.org/gltf/)
