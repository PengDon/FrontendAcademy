# HTML5 多媒体

## 介绍

HTML5为Web带来了丰富的多媒体功能，使开发者能够轻松地在网页中嵌入音频、视频、动画和交互式图形。这些多媒体功能不仅增强了用户体验，还减少了对第三方插件（如Flash）的依赖。

## 音频元素 (Audio)

HTML5的`<audio>`元素允许在网页中嵌入音频内容。

### 基本语法

```html
<audio controls>
  <source src="audio.mp3" type="audio/mpeg">
  <source src="audio.ogg" type="audio/ogg">
  您的浏览器不支持音频元素。
</audio>
```

### 主要属性

| 属性 | 描述 |
|------|------|
| `controls` | 显示浏览器默认的音频控制界面 |
| `autoplay` | 页面加载后自动播放音频 |
| `loop` | 循环播放音频 |
| `muted` | 默认静音 |
| `preload` | 预加载设置（`auto`、`metadata`、`none`） |
| `src` | 音频文件的URL（不使用`<source>`元素时） |

### 示例：自定义音频播放器

```html
<div class="audio-player">
  <audio id="myAudio">
    <source src="audio.mp3" type="audio/mpeg">
    您的浏览器不支持音频元素。
 </audio>
  <button id="playBtn">播放</button>
  <button id="pauseBtn">暂停</button>
  <button id="stopBtn">停止</button>
  <input type="range" id="volume" min="0" max="1" step="0.1" value="1">
  <span id="currentTime">0:00</span> / <span id="duration">0:00</span>
</div>

<script>
const audio = document.getElementById('myAudio');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const stopBtn = document.getElementById('stopBtn');
const volume = document.getElementById('volume');
const currentTime = document.getElementById('currentTime');
const duration = document.getElementById('duration');

// 播放按钮
playBtn.addEventListener('click', () => {
  audio.play();
});

// 暂停按钮
pauseBtn.addEventListener('click', () => {
  audio.pause();
});

// 停止按钮
stopBtn.addEventListener('click', () => {
  audio.pause();
  audio.currentTime = 0;
});

// 音量控制
volume.addEventListener('input', () => {
  audio.volume = volume.value;
});

// 更新当前时间
audio.addEventListener('timeupdate', () => {
  currentTime.textContent = formatTime(audio.currentTime);
});

// 更新总时长
audio.addEventListener('loadedmetadata', () => {
  duration.textContent = formatTime(audio.duration);
});

// 格式化时间
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
</script>
```

## 视频元素 (Video)

HTML5的`<video>`元素允许在网页中嵌入视频内容。

### 基本语法

```html
<video controls width="640" height="360">
  <source src="video.mp4" type="video/mp4">
  <source src="video.webm" type="video/webm">
  您的浏览器不支持视频元素。
</video>
```

### 主要属性

| 属性 | 描述 |
|------|------|
| `controls` | 显示浏览器默认的视频控制界面 |
| `autoplay` | 页面加载后自动播放视频 |
| `loop` | 循环播放视频 |
| `muted` | 默认静音 |
| `preload` | 预加载设置（`auto`、`metadata`、`none`） |
| `src` | 视频文件的URL（不使用`<source>`元素时） |
| `width` | 视频宽度 |
| `height` | 视频高度 |
| `poster` | 视频播放前显示的封面图片 |
| `playsinline` | 在移动设备上内联播放视频（而非全屏） |

### 示例：自定义视频播放器

```html
<div class="video-player">
  <video id="myVideo" poster="poster.jpg" width="640" height="360">
    <source src="video.mp4" type="video/mp4">
    您的浏览器不支持视频元素。
  </video>
  <div class="controls">
    <button id="playPauseBtn">播放</button>
    <button id="stopBtn">停止</button>
    <input type="range" id="seekBar" min="0" max="100" value="0">
    <span id="currentTime">0:00</span> / <span id="duration">0:00</span>
    <button id="muteBtn">静音</button>
    <input type="range" id="volumeBar" min="0" max="1" step="0.1" value="1">
    <button id="fullscreenBtn">全屏</button>
  </div>
</div>

<script>
const video = document.getElementById('myVideo');
const playPauseBtn = document.getElementById('playPauseBtn');
const stopBtn = document.getElementById('stopBtn');
const seekBar = document.getElementById('seekBar');
const currentTime = document.getElementById('currentTime');
const duration = document.getElementById('duration');
const muteBtn = document.getElementById('muteBtn');
const volumeBar = document.getElementById('volumeBar');
const fullscreenBtn = document.getElementById('fullscreenBtn');

// 播放/暂停按钮
playPauseBtn.addEventListener('click', () => {
  if (video.paused) {
    video.play();
    playPauseBtn.textContent = '暂停';
  } else {
    video.pause();
    playPauseBtn.textContent = '播放';
  }
});

// 停止按钮
stopBtn.addEventListener('click', () => {
  video.pause();
  video.currentTime = 0;
  playPauseBtn.textContent = '播放';
  seekBar.value = 0;
});

// 进度条
video.addEventListener('timeupdate', () => {
  const value = (100 / video.duration) * video.currentTime;
  seekBar.value = value;
  currentTime.textContent = formatTime(video.currentTime);
});

// 拖动进度条
seekBar.addEventListener('input', () => {
  const time = video.duration * (seekBar.value / 100);
  video.currentTime = time;
});

// 更新总时长
video.addEventListener('loadedmetadata', () => {
  duration.textContent = formatTime(video.duration);
  seekBar.max = 100;
});

// 静音按钮
muteBtn.addEventListener('click', () => {
  if (video.muted) {
    video.muted = false;
    muteBtn.textContent = '静音';
    volumeBar.value = video.volume;
  } else {
    video.muted = true;
    muteBtn.textContent = '取消静音';
    volumeBar.value = 0;
  }
});

// 音量控制
volumeBar.addEventListener('input', () => {
  video.volume = volumeBar.value;
  video.muted = volumeBar.value === 0;
  muteBtn.textContent = video.muted ? '取消静音' : '静音';
});

// 全屏按钮
fullscreenBtn.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    video.requestFullscreen().catch(err => {
      console.log(`Error attempting to enable full-screen mode: ${err.message}`);
    });
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
});

// 格式化时间
function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
</script>
```

## Canvas 元素

Canvas元素允许通过JavaScript绘制图形、动画和图像。

### 基本语法

```html
<canvas id="myCanvas" width="400" height="300"></canvas>

<script>
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// 绘制矩形
ctx.fillStyle = 'red';
ctx.fillRect(50, 50, 150, 100);

// 绘制圆形
ctx.fillStyle = 'blue';
ctx.beginPath();
ctx.arc(300, 150, 50, 0, Math.PI * 2);
ctx.fill();

// 绘制文本
ctx.fillStyle = 'black';
ctx.font = '20px Arial';
ctx.fillText('Hello Canvas!', 50, 250);
</script>
```

### Canvas 2D API

Canvas 2D API提供了丰富的绘制功能：

#### 绘制形状

```javascript
// 绘制矩形
ctx.fillRect(x, y, width, height);  // 填充矩形
ctx.strokeRect(x, y, width, height);  // 描边矩形
ctx.clearRect(x, y, width, height);  // 清除矩形区域

// 绘制路径
ctx.beginPath();  // 开始新路径
ctx.moveTo(x, y);  // 移动到起点
ctx.lineTo(x, y);  // 绘制直线
ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);  // 绘制圆弧
ctx.arcTo(x1, y1, x2, y2, radius);  // 绘制圆弧
ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);  // 贝塞尔曲线
ctx.quadraticCurveTo(cpx, cpy, x, y);  // 二次贝塞尔曲线
ctx.rect(x, y, width, height);  // 矩形路径
ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise);  // 椭圆
ctx.closePath();  // 闭合路径

// 填充和描边
ctx.fill();  // 填充路径
ctx.stroke();  // 描边路径
```

#### 设置样式

```javascript
// 填充样式
ctx.fillStyle = color | gradient | pattern;

// 描边样式
ctx.strokeStyle = color | gradient | pattern;
ctx.lineWidth = width;
ctx.lineCap = 'butt' | 'round' | 'square';
ctx.lineJoin = 'miter' | 'round' | 'bevel';
ctx.miterLimit = limit;
ctx.lineDashOffset = offset;
ctx.setLineDash([dashLength, gapLength]);

// 文本样式
ctx.font = 'font-size font-family';
ctx.textAlign = 'start' | 'end' | 'left' | 'right' | 'center';
ctx.textBaseline = 'top' | 'hanging' | 'middle' | 'alphabetic' | 'ideographic' | 'bottom';
ctx.direction = 'ltr' | 'rtl' | 'inherit';
```

#### 变换

```javascript
// 平移
ctx.translate(x, y);

// 旋转
ctx.rotate(angle);

// 缩放
ctx.scale(x, y);

// 变换矩阵
ctx.transform(a, b, c, d, e, f);
ctx.setTransform(a, b, c, d, e, f);
ctx.resetTransform();
```

#### 动画

```javascript
function draw() {
  // 清除画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 绘制动画帧
  // ...
  
  // 请求下一帧
  requestAnimationFrame(draw);
}

// 开始动画
draw();
```

### 示例：Canvas 动画

```html
<canvas id="animationCanvas" width="400" height="300"></canvas>

<script>
const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');

// 小球对象
const ball = {
  x: 50,
  y: 50,
  radius: 20,
  dx: 2,
  dy: 2,
  color: 'red'
};

// 绘制小球
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();
}

// 移动小球
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
  
  // 边界检测
  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    ball.dx = -ball.dx;
    ball.color = getRandomColor();
  }
  
  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.dy = -ball.dy;
    ball.color = getRandomColor();
  }
}

// 获取随机颜色
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// 动画循环
function animate() {
  // 清除画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 绘制小球
  drawBall();
  
  // 移动小球
  moveBall();
  
  // 请求下一帧
  requestAnimationFrame(animate);
}

// 开始动画
animate();
</script>
```

## SVG (Scalable Vector Graphics)

SVG是一种基于XML的矢量图形格式，可以在网页中直接使用。

### 基本语法

```html
<!-- 直接嵌入SVG -->
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <!-- 绘制圆形 -->
  <circle cx="100" cy="100" r="80" fill="red" stroke="black" stroke-width="2" />
  
  <!-- 绘制文本 -->
  <text x="100" y="115" font-family="Arial" font-size="24" fill="white" text-anchor="middle">Hello SVG!</text>
</svg>

<!-- 外部SVG -->
<img src="image.svg" alt="SVG图像">
```

### 主要SVG元素

| 元素 | 描述 |
|------|------|
| `circle` | 圆形 |
| `rect` | 矩形 |
| `ellipse` | 椭圆 |
| `line` | 直线 |
| `polyline` | 折线 |
| `polygon` | 多边形 |
| `path` | 路径 |
| `text` | 文本 |
| `g` | 分组 |
| `defs` | 定义可重用元素 |
| `use` | 引用已定义的元素 |
| `animate` | 动画 |
| `animateTransform` | 变换动画 |
| `linearGradient` | 线性渐变 |
| `radialGradient` | 径向渐变 |
| `pattern` | 图案 |

### SVG 动画

```html
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <!-- 旋转的矩形 -->
  <rect x="50" y="50" width="100" height="100" fill="blue">
    <animateTransform
      attributeName="transform"
      type="rotate"
      from="0 100 100"
      to="360 100 100"
      dur="5s"
      repeatCount="indefinite"
    />
  </rect>
  
  <!-- 弹跳的圆形 -->
  <circle cx="100" cy="50" r="20" fill="red">
    <animate
      attributeName="cy"
      values="50; 150; 50"
      dur="2s"
      repeatCount="indefinite"
      ease="ease-in-out"
    />
  </circle>
</svg>
```

## WebGL

WebGL（Web Graphics Library）是一种基于OpenGL ES的Web标准，用于在浏览器中渲染2D和3D图形。

### 基本语法

```html
<canvas id="webglCanvas" width="400" height="300"></canvas>

<script>
const canvas = document.getElementById('webglCanvas');
const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

if (!gl) {
  alert('您的浏览器不支持WebGL');
}

// 顶点着色器源码
const vertexShaderSource = `
  attribute vec4 a_position;
  void main() {
    gl_Position = a_position;
    gl_PointSize = 10.0;
  }
`;

// 片段着色器源码
const fragmentShaderSource = `
  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
`;

// 创建着色器
function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('着色器编译错误:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  
  return shader;
}

// 创建程序
function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('程序链接错误:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  
  return program;
}

// 初始化着色器程序
const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
const program = createProgram(gl, vertexShader, fragmentShader);

// 设置顶点数据
const positions = [
  0.0, 0.5, 0.0,
  -0.5, -0.5, 0.0,
  0.5, -0.5, 0.0
];

// 创建缓冲区
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

// 获取属性位置
const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');

// 启用属性
ogl.enableVertexAttribArray(positionAttributeLocation);

// 设置属性
ogl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

// 使用程序
gl.useProgram(program);

// 清除画布
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

// 绘制
gl.drawArrays(gl.TRIANGLES, 0, 3);
</script>
```

## 多媒体事件处理

### 音频事件

```javascript
const audio = document.querySelector('audio');

audio.addEventListener('loadedmetadata', () => {
  console.log('音频元数据已加载');
});

audio.addEventListener('play', () => {
  console.log('音频开始播放');
});

audio.addEventListener('pause', () => {
  console.log('音频已暂停');
});

audio.addEventListener('ended', () => {
  console.log('音频播放结束');
});

audio.addEventListener('timeupdate', () => {
  console.log('播放时间更新:', audio.currentTime);
});

audio.addEventListener('volumechange', () => {
  console.log('音量已改变:', audio.volume);
});

audio.addEventListener('error', (e) => {
  console.error('音频错误:', e);
});
```

### 视频事件

```javascript
const video = document.querySelector('video');

video.addEventListener('loadedmetadata', () => {
  console.log('视频元数据已加载');
});

video.addEventListener('play', () => {
  console.log('视频开始播放');
});

video.addEventListener('pause', () => {
  console.log('视频已暂停');
});

video.addEventListener('ended', () => {
  console.log('视频播放结束');
});

video.addEventListener('timeupdate', () => {
  console.log('播放时间更新:', video.currentTime);
});

video.addEventListener('volumechange', () => {
  console.log('音量已改变:', video.volume);
});

video.addEventListener('error', (e) => {
  console.error('视频错误:', e);
});

video.addEventListener('waiting', () => {
  console.log('视频正在缓冲');
});

video.addEventListener('playing', () => {
  console.log('视频正在播放');
});

video.addEventListener('seeked', () => {
  console.log('视频跳转完成');
});

video.addEventListener('seeking', () => {
  console.log('视频正在跳转');
});
```

## 多媒体可访问性

### 音频和视频可访问性

```html
<!-- 视频带字幕 -->
<video controls>
  <source src="video.mp4" type="video/mp4">
  <track kind="subtitles" src="subtitles.vtt" srclang="zh" label="中文">
  <track kind="captions" src="captions.vtt" srclang="zh" label="中文（含音效描述）">
  <track kind="descriptions" src="descriptions.vtt" srclang="zh" label="视频描述">
  <track kind="chapters" src="chapters.vtt" srclang="zh" label="章节">
  您的浏览器不支持视频元素。
</video>

<!-- 音频带转录 -->
<audio controls>
  <source src="audio.mp3" type="audio/mpeg">
  您的浏览器不支持音频元素。
</audio>
<p>音频转录：这是一段音频的文字转录内容...</p>
```

### Canvas可访问性

```html
<canvas id="chart" aria-label="销售图表" role="img"></canvas>
<p aria-hidden="true">销售图表显示2023年销售额增长了20%。</p>
```

## 最佳实践

### 音频和视频

1. **提供多种格式**：为了兼容不同的浏览器，提供多种媒体格式（如MP4、WebM、OGG等）
2. **使用适当的编解码器**：选择广泛支持的编解码器
3. **优化文件大小**：压缩媒体文件以提高加载速度
4. **设置预加载策略**：根据实际需要设置preload属性
5. **提供替代内容**：为不支持媒体元素的浏览器提供替代内容
6. **添加控件**：始终提供播放控件，除非有特殊需求
7. **考虑移动设备**：使用playsinline属性确保在移动设备上正常播放
8. **提供字幕和转录**：为听力障碍用户提供字幕和转录

### Canvas

1. **设置合适的画布尺寸**：根据实际需要设置canvas的width和height属性
2. **使用requestAnimationFrame**：对于动画，使用requestAnimationFrame而不是setTimeout或setInterval
3. **优化绘制操作**：减少绘制操作次数，合并相似的绘制操作
4. **使用离屏Canvas**：对于复杂的绘制，使用离屏Canvas进行预渲染
5. **提供替代内容**：为不支持Canvas的浏览器提供替代内容
6. **考虑可访问性**：为Canvas添加适当的ARIA属性和替代文本

### SVG

1. **使用viewBox**：使用viewBox属性确保SVG可以正确缩放
2. **优化SVG代码**：删除不必要的代码和属性
3. **使用适当的元素**：根据需要选择合适的SVG元素
4. **考虑性能**：对于复杂的SVG，考虑使用Canvas或WebGL
5. **提供替代内容**：为不支持SVG的浏览器提供替代内容

## 练习

1. **音频播放器**：创建一个自定义音频播放器，包含播放/暂停、停止、音量控制和进度条功能

2. **视频播放器**：创建一个自定义视频播放器，包含播放/暂停、停止、全屏、音量控制和进度条功能

3. **Canvas绘图应用**：创建一个简单的绘图应用，允许用户绘制不同颜色和大小的图形

4. **Canvas动画**：创建一个Canvas动画，如粒子系统或游戏角色动画

5. **SVG图形**：使用SVG创建一个复杂的图形，如公司标志或信息图表

6. **SVG动画**：使用SVG创建一个动画效果，如旋转、缩放或颜色变化

7. **WebGL基础**：使用WebGL绘制一个简单的3D模型

8. **多媒体合成**：将音频、视频、Canvas和SVG结合起来，创建一个交互式多媒体页面

## 参考资料

- [MDN Web Docs - 音频和视频API](https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_media_elements)
- [MDN Web Docs - Canvas API](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API)
- [MDN Web Docs - SVG](https://developer.mozilla.org/zh-CN/docs/Web/SVG)
- [MDN Web Docs - WebGL](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API)
- [HTML5 Rocks - HTML5 Audio and Video](https://www.html5rocks.com/en/tutorials/audio/video/)
- [HTML5 Rocks - Canvas Tutorial](https://www.html5rocks.com/en/tutorials/canvas/intro/)
- [SVG Tutorial](https://www.w3schools.com/graphics/svg_intro.asp)
- [WebGL Fundamentals](https://webglfundamentals.org/)
