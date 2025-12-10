# WebGL 性能优化

本目录包含 WebGL 性能优化的相关知识和示例代码，帮助你理解如何优化 WebGL 应用的性能。

## 内容概述

- **性能监控**：如何监控和分析 WebGL 应用的性能
- **渲染优化**：减少绘制调用和状态切换
- **几何体优化**：减少顶点数量和内存占用
- **着色器优化**：优化着色器代码和减少计算量
- **纹理优化**：使用压缩纹理和合理的纹理尺寸
- **内存管理**：避免内存泄漏和优化内存使用

## 学习重点

1. 理解 WebGL 性能瓶颈
2. 掌握性能监控工具的使用
3. 学习渲染优化技术
4. 了解着色器和纹理优化方法

## 示例代码

### 1. 性能监控

```javascript
// WebGL 性能监控
class WebGLPerformanceMonitor {
  constructor(gl) {
    this.gl = gl;
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fps = 0;
    this.frameTimes = [];
    this.maxFrameTimes = 100;
    
    // 创建查询对象（用于测量GPU时间）
    this.query = gl.createQuery();
    this.gpuTimeAvailable = gl.getExtension('EXT_disjoint_timer_query');
  }
  
  // 开始监控一帧
  startFrame() {
    this.frameStartTime = performance.now();
    
    // 开始GPU时间查询
    if (this.gpuTimeAvailable) {
      this.gl.beginQuery(this.gpuTimeAvailable.TIME_ELAPSED_EXT, this.query);
    }
  }
  
  // 结束监控一帧
  endFrame() {
    this.frameEndTime = performance.now();
    
    // 结束GPU时间查询
    if (this.gpuTimeAvailable) {
      this.gl.endQuery(this.gpuTimeAvailable.TIME_ELAPSED_EXT);
    }
    
    // 计算帧时间
    const frameTime = this.frameEndTime - this.frameStartTime;
    this.frameTimes.push(frameTime);
    
    // 保持固定数量的帧时间样本
    if (this.frameTimes.length > this.maxFrameTimes) {
      this.frameTimes.shift();
    }
    
    // 更新FPS
    this.updateFPS();
  }
  
  // 更新FPS
  updateFPS() {
    this.frameCount++;
    const currentTime = performance.now();
    const elapsedTime = currentTime - this.lastTime;
    
    if (elapsedTime >= 1000) { // 每秒更新一次
      this.fps = Math.round((this.frameCount * 1000) / elapsedTime);
      this.frameCount = 0;
      this.lastTime = currentTime;
    }
  }
  
  // 获取平均帧时间
  getAverageFrameTime() {
    if (this.frameTimes.length === 0) return 0;
    const sum = this.frameTimes.reduce((a, b) => a + b, 0);
    return sum / this.frameTimes.length;
  }
  
  // 获取FPS
  getFPS() {
    return this.fps;
  }
  
  // 获取GPU时间（如果可用）
  async getGPUTime() {
    if (!this.gpuTimeAvailable) return null;
    
    // 等待查询结果可用
    while (!this.gl.getQueryParameter(this.query, this.gl.QUERY_RESULT_AVAILABLE)) {
      await new Promise(resolve => requestAnimationFrame(resolve));
    }
    
    // 获取GPU时间（纳秒）
    const gpuTime = this.gl.getQueryParameter(this.query, this.gl.QUERY_RESULT);
    
    // 转换为毫秒
    return gpuTime / 1000000;
  }
  
  // 重置监控
  reset() {
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fps = 0;
    this.frameTimes = [];
  }
}

// 使用性能监控器
function setupPerformanceMonitoring(gl) {
  const monitor = new WebGLPerformanceMonitor(gl);
  
  // 渲染循环
  function render() {
    // 开始监控
    monitor.startFrame();
    
    // 渲染场景
    renderScene();
    
    // 结束监控
    monitor.endFrame();
    
    // 更新UI显示
    updatePerformanceDisplay(monitor);
    
    requestAnimationFrame(render);
  }
  
  // 更新性能显示
  function updatePerformanceDisplay(monitor) {
    document.getElementById('fps').textContent = `FPS: ${monitor.getFPS()}`;
    document.getElementById('frameTime').textContent = `Frame Time: ${monitor.getAverageFrameTime().toFixed(2)}ms`;
    
    // 获取GPU时间（异步）
    monitor.getGPUTime().then(gpuTime => {
      if (gpuTime !== null) {
        document.getElementById('gpuTime').textContent = `GPU Time: ${gpuTime.toFixed(2)}ms`;
      }
    });
  }
  
  render();
}
```

### 2. 渲染优化（减少绘制调用）

```javascript
// 合并几何体以减少绘制调用
function mergeGeometries(geometries) {
  // 存储合并后的顶点数据
  const mergedVertices = [];
  const mergedNormals = [];
  const mergedTexcoords = [];
  const mergedIndices = [];
  
  let vertexOffset = 0;
  
  // 遍历所有几何体
  geometries.forEach(geometry => {
    // 合并顶点数据
    if (geometry.vertices) {
      mergedVertices.push(...geometry.vertices);
    }
    
    if (geometry.normals) {
      mergedNormals.push(...geometry.normals);
    }
    
    if (geometry.texcoords) {
      mergedTexcoords.push(...geometry.texcoords);
    }
    
    // 合并索引数据（需要调整索引偏移）
    if (geometry.indices) {
      const adjustedIndices = geometry.indices.map(index => index + vertexOffset);
      mergedIndices.push(...adjustedIndices);
    }
    
    // 更新顶点偏移
    vertexOffset += geometry.vertices.length / 3;
  });
  
  return {
    vertices: mergedVertices,
    normals: mergedNormals,
    texcoords: mergedTexcoords,
    indices: mergedIndices
  };
}

// 使用实例化渲染减少绘制调用
function setupInstancedRendering(gl, program) {
  // 创建实例数据（每个实例的位置和颜色）
  const instanceCount = 1000;
  const instanceData = new Float32Array(instanceCount * 6); // 位置(x,y,z) + 颜色(r,g,b)
  
  // 填充实例数据
  for (let i = 0; i < instanceCount; i++) {
    // 随机位置
    instanceData[i * 6 + 0] = (Math.random() - 0.5) * 10;
    instanceData[i * 6 + 1] = (Math.random() - 0.5) * 10;
    instanceData[i * 6 + 2] = (Math.random() - 0.5) * 10;
    
    // 随机颜色
    instanceData[i * 6 + 3] = Math.random();
    instanceData[i * 6 + 4] = Math.random();
    instanceData[i * 6 + 5] = Math.random();
  }
  
  // 创建实例缓冲区
  const instanceBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, instanceData, gl.STATIC_DRAW);
  
  // 设置实例属性（位置）
  const instancePositionLocation = gl.getAttribLocation(program, 'a_instancePosition');
  gl.enableVertexAttribArray(instancePositionLocation);
  gl.vertexAttribPointer(instancePositionLocation, 3, gl.FLOAT, false, 24, 0);
  gl.vertexAttribDivisor(instancePositionLocation, 1); // 每个实例更新一次
  
  // 设置实例属性（颜色）
  const instanceColorLocation = gl.getAttribLocation(program, 'a_instanceColor');
  gl.enableVertexAttribArray(instanceColorLocation);
  gl.vertexAttribPointer(instanceColorLocation, 3, gl.FLOAT, false, 24, 12);
  gl.vertexAttribDivisor(instanceColorLocation, 1); // 每个实例更新一次
  
  return {
    instanceBuffer,
    instanceCount
  };
}

// 使用实例化渲染绘制
function renderInstanced(gl, program, buffers, instanceCount) {
  // 使用着色器程序
  gl.useProgram(program);
  
  // 设置顶点缓冲区
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertexBuffer);
  gl.enableVertexAttribArray(gl.getAttribLocation(program, 'a_position'));
  gl.vertexAttribPointer(gl.getAttribLocation(program, 'a_position'), 3, gl.FLOAT, false, 0, 0);
  
  // 使用实例化绘制
  gl.drawArraysInstanced(gl.TRIANGLES, 0, 3, instanceCount);
  
  // 或者使用索引实例化绘制
  // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indexBuffer);
  // gl.drawElementsInstanced(gl.TRIANGLES, buffers.indexCount, gl.UNSIGNED_SHORT, 0, instanceCount);
}
```

### 3. 着色器优化

```javascript
// 优化前的片元着色器
const unoptimizedFragmentShader = `
precision mediump float;

uniform sampler2D u_texture;
varying vec2 v_texcoord;
varying vec3 v_normal;
varying vec3 v_lightDirection;

void main() {
  // 计算光照
  vec3 normal = normalize(v_normal);
  float diffuse = max(dot(normal, v_lightDirection), 0.0);
  
  // 采样纹理
  vec4 textureColor = texture2D(u_texture, v_texcoord);
  
  // 计算最终颜色
  vec3 finalColor = textureColor.rgb * diffuse;
  
  // 设置输出颜色
  gl_FragColor = vec4(finalColor, textureColor.a);
}
`;

// 优化后的片元着色器
const optimizedFragmentShader = `
precision mediump float;

// 使用高精度采样器（如果可用）
#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif

uniform sampler2D u_texture;
varying vec2 v_texcoord;
varying vec3 v_normal;
varying vec3 v_lightDirection;

// 预计算的光照参数
const vec3 lightColor = vec3(1.0, 1.0, 1.0);
const float ambient = 0.2;

void main() {
  // 计算光照（使用快速归一化）
  vec3 normal = normalize(v_normal);
  float diffuse = max(dot(normal, v_lightDirection), 0.0);
  
  // 计算最终光照强度（合并计算）
  float lightIntensity = ambient + diffuse * (1.0 - ambient);
  
  // 使用低精度纹理采样（如果可用）
  vec4 textureColor = texture2D(u_texture, v_texcoord);
  
  // 合并颜色计算（避免多次向量运算）
  gl_FragColor = vec4(textureColor.rgb * lightIntensity * lightColor, textureColor.a);
}
`;

// 着色器编译优化
function createOptimizedShaderProgram(gl, vertexSource, fragmentSource) {
  // 创建顶点着色器
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  
  // 创建片元着色器
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  
  // 创建程序
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  
  // 优化：设置打包属性
  const vertexAttribs = [
    { name: 'a_position', size: 3, type: gl.FLOAT },
    { name: 'a_normal', size: 3, type: gl.FLOAT },
    { name: 'a_texcoord', size: 2, type: gl.FLOAT }
  ];
  
  // 绑定属性位置
  vertexAttribs.forEach((attrib, index) => {
    gl.bindAttribLocation(program, index, attrib.name);
  });
  
  // 链接程序
  gl.linkProgram(program);
  
  // 检查链接错误
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Shader program linking error:', gl.getProgramInfoLog(program));
    return null;
  }
  
  // 优化：删除着色器对象（不再需要）
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  
  return program;
}
```

### 4. 纹理优化

```javascript
// 纹理优化
class TextureOptimizer {
  constructor(gl) {
    this.gl = gl;
    
    // 检查可用的纹理压缩格式
    this.availableCompressions = {
      etc1: gl.getExtension('WEBGL_compressed_texture_etc1'),
      etc2: gl.getExtension('WEBGL_compressed_texture_etc'),
      astc: gl.getExtension('WEBGL_compressed_texture_astc'),
      s3tc: gl.getExtension('WEBGL_compressed_texture_s3tc') || 
            gl.getExtension('MOZ_WEBGL_compressed_texture_s3tc') || 
            gl.getExtension('WEBKIT_WEBGL_compressed_texture_s3tc'),
      pvrtc: gl.getExtension('WEBGL_compressed_texture_pvrtc')
    };
  }
  
  // 创建优化的纹理
  createOptimizedTexture(image, options = {}) {
    const gl = this.gl;
    
    // 创建纹理
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    
    // 设置默认纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    
    // 根据使用场景选择过滤方式
    if (options.minFilter === 'linear') {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    } else if (options.minFilter === 'mipmap') {
      // 使用MIP映射（适用于3D场景）
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      
      // 生成MIP映射
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      // 默认使用最近邻过滤（最快）
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    }
    
    // 上传纹理数据
    if (image instanceof ImageData) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, image.width, image.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, image.data);
    } else {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    }
    
    return texture;
  }
  
  // 加载压缩纹理
  async loadCompressedTexture(url, format) {
    const gl = this.gl;
    
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const texture = gl.createTexture();
      
      gl.bindTexture(gl.TEXTURE_2D, texture);
      
      // 设置纹理参数
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      
      // 上传压缩纹理数据
      const width = 512; // 压缩纹理的宽度
      const height = 512; // 压缩纹理的高度
      
      if (this.availableCompressions.s3tc && format === 'dxt1') {
        gl.compressedTexImage2D(gl.TEXTURE_2D, 0, this.availableCompressions.s3tc.COMPRESSED_RGB_S3TC_DXT1_EXT, width, height, 0, new Uint8Array(arrayBuffer));
      } else if (this.availableCompressions.etc1 && format === 'etc1') {
        gl.compressedTexImage2D(gl.TEXTURE_2D, 0, this.availableCompressions.etc1.COMPRESSED_RGB_ETC1_WEBGL, width, height, 0, new Uint8Array(arrayBuffer));
      } else {
        console.warn('Compression format not supported:', format);
        // 回退到未压缩纹理
        // ...
      }
      
      return texture;
    } catch (error) {
      console.error('Failed to load compressed texture:', error);
      throw error;
    }
  }
  
  // 预加载纹理
  preloadTextures(textureUrls) {
    return Promise.all(textureUrls.map(url => {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.onload = () => {
          const texture = this.createOptimizedTexture(image);
          resolve({ url, texture, image });
        };
        image.onerror = () => reject(new Error(`Failed to load texture: ${url}`));
        image.src = url;
      });
    }));
  }
}
```

### 4. 内存管理

```javascript
// WebGL 资源管理器
class WebGLResourceManager {
  constructor(gl) {
    this.gl = gl;
    this.resources = {
      buffers: [],
      textures: [],
      shaders: [],
      programs: [],
      framebuffers: [],
      renderbuffers: [],
      vertexArrays: []
    };
    
    // 检查VAO支持
    this.vaoAvailable = gl.getExtension('OES_vertex_array_object');
  }
  
  // 创建并跟踪缓冲区
  createBuffer() {
    const buffer = this.gl.createBuffer();
    this.resources.buffers.push(buffer);
    return buffer;
  }
  
  // 创建并跟踪纹理
  createTexture() {
    const texture = this.gl.createTexture();
    this.resources.textures.push(texture);
    return texture;
  }
  
  // 创建并跟踪着色器
  createShader(type, source) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    this.resources.shaders.push(shader);
    return shader;
  }
  
  // 创建并跟踪程序
  createProgram() {
    const program = this.gl.createProgram();
    this.resources.programs.push(program);
    return program;
  }
  
  // 删除单个资源
  deleteBuffer(buffer) {
    this.gl.deleteBuffer(buffer);
    this.resources.buffers = this.resources.buffers.filter(b => b !== buffer);
  }
  
  deleteTexture(texture) {
    this.gl.deleteTexture(texture);
    this.resources.textures = this.resources.textures.filter(t => t !== texture);
  }
  
  deleteShader(shader) {
    this.gl.deleteShader(shader);
    this.resources.shaders = this.resources.shaders.filter(s => s !== shader);
  }
  
  deleteProgram(program) {
    this.gl.deleteProgram(program);
    this.resources.programs = this.resources.programs.filter(p => p !== program);
  }
  
  // 删除所有资源
  deleteAll() {
    // 删除缓冲区
    this.resources.buffers.forEach(buffer => this.gl.deleteBuffer(buffer));
    this.resources.buffers = [];
    
    // 删除纹理
    this.resources.textures.forEach(texture => this.gl.deleteTexture(texture));
    this.resources.textures = [];
    
    // 删除着色器
    this.resources.shaders.forEach(shader => this.gl.deleteShader(shader));
    this.resources.shaders = [];
    
    // 删除程序
    this.resources.programs.forEach(program => this.gl.deleteProgram(program));
    this.resources.programs = [];
    
    // 删除帧缓冲区
    this.resources.framebuffers.forEach(framebuffer => this.gl.deleteFramebuffer(framebuffer));
    this.resources.framebuffers = [];
    
    // 删除渲染缓冲区
    this.resources.renderbuffers.forEach(renderbuffer => this.gl.deleteRenderbuffer(renderbuffer));
    this.resources.renderbuffers = [];
    
    // 删除顶点数组
    if (this.vaoAvailable) {
      this.resources.vertexArrays.forEach(vao => this.vaoAvailable.deleteVertexArrayOES(vao));
      this.resources.vertexArrays = [];
    }
  }
  
  // 获取资源统计信息
  getResourceStats() {
    return {
      buffers: this.resources.buffers.length,
      textures: this.resources.textures.length,
      shaders: this.resources.shaders.length,
      programs: this.resources.programs.length,
      framebuffers: this.resources.framebuffers.length,
      renderbuffers: this.resources.renderbuffers.length,
      vertexArrays: this.resources.vertexArrays.length
    };
  }
}
```

## 性能优化最佳实践

1. **减少绘制调用**：合并几何体，使用实例化渲染
2. **减少状态切换**：按材质和状态分组绘制
3. **使用VAO**：使用顶点数组对象减少属性设置调用
4. **优化着色器**：减少计算量，避免分支和循环
5. **使用纹理压缩**：减少内存占用和带宽消耗
6. **合理使用MIP映射**：提高渲染质量和性能
7. **使用适当的精度**：在着色器中使用适当的精度（lowp/mediump/highp）
8. **避免过度绘制**：使用深度测试和剔除
9. **优化几何体**：减少顶点数量，使用索引
10. **使用异步加载**：避免阻塞主线程
11. **释放不再使用的资源**：避免内存泄漏
12. **使用性能分析工具**：定期检查性能瓶颈

## 性能分析工具

- **Chrome DevTools**：WebGL性能面板和GPU分析器
- **Firefox Performance Tool**：性能分析和内存监控
- **WebGL Inspector**：详细的WebGL命令分析
- **RenderDoc**：专业的图形调试工具
- **Three.js Performance Monitor**：内置的性能监控器

## 学习资源

- [WebGL Performance Tips](https://www.khronos.org/webgl/wiki/WebGL_Performance)
- [Optimizing WebGL Applications](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)
- [WebGL Fundamentals - Performance](https://webglfundamentals.org/webgl/lessons/webgl-performance.html)
- [Google WebGL Performance Guide](https://developers.google.com/web/fundamentals/performance/rendering/webgl-performance)
- [Mozilla WebGL Performance Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)
