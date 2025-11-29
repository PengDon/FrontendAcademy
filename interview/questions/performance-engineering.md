# 性能优化和工程化面试题

## 前端性能优化

### 1. 请列举前端性能优化的主要策略。

**答案：**

**1. 资源加载优化**
- **压缩和合并**：压缩 CSS、JavaScript、HTML 文件，减少文件大小
- **图片优化**：
  - 选择合适的图片格式（JPEG、PNG、WebP、AVIF）
  - 响应式图片（`srcset`、`sizes` 属性）
  - 图片懒加载
  - 使用 CDN 分发图片
- **字体优化**：
  - 使用字体子集
  - 字体预加载（`preload`）
  - 选择合适的字体格式（WOFF2、WOFF）
- **资源预加载**：
  - 预连接（`preconnect`）
  - 预获取（`prefetch`）
  - 预加载（`preload`）
  - 预渲染（`prerender`）

**2. 渲染性能优化**
- **减少重绘和重排**：
  - 批量 DOM 操作
  - 使用文档片段（DocumentFragment）
  - 避免频繁读取布局信息
  - 使用 CSS transform 和 opacity 进行动画
- **CSS 优化**：
  - 避免使用昂贵的选择器
  - 减少 CSS 规则数量
  - 内联关键 CSS
  - 使用 CSS 动画而非 JavaScript 动画
- **JavaScript 优化**：
  - 避免阻塞渲染的 JavaScript
  - 使用 `async` 和 `defer` 属性
  - 减少主线程工作
  - 使用 Web Workers 处理计算密集型任务

**3. 缓存策略**
- **HTTP 缓存**：
  - 强缓存（Expires、Cache-Control）
  - 协商缓存（Last-Modified/If-Modified-Since、ETag/If-None-Match）
- **Service Worker 缓存**：离线缓存和资源预缓存
- **本地存储**：localStorage、sessionStorage、IndexedDB

**4. 网络优化**
- **使用 CDN**：内容分发网络，减少延迟
- **HTTP/2/3**：利用多路复用、服务器推送等特性
- **减少请求数量**：合并请求，使用 Sprites
- **Gzip/Brotli 压缩**：服务器端压缩传输内容

**5. 代码优化**
- **代码分割**：按需加载代码
- **Tree Shaking**：移除未使用的代码
- **懒加载**：延迟加载非关键资源
- **减少第三方依赖**：评估和移除不必要的库

**6. 用户体验优化**
- **骨架屏**：快速显示页面结构
- **渐进式加载**：先加载核心内容
- **虚拟滚动**：处理长列表
- **预取关键资源**：预测用户行为并预加载

### 2. 什么是重排（Reflow）和重绘（Repaint）？如何避免？

**答案：**

**重排（Reflow）：**
- **定义**：当 DOM 的几何属性发生变化时，浏览器需要重新计算元素的几何属性和布局
- **触发条件**：
  - 添加、删除、更新 DOM 元素
  - 修改元素的位置、大小、边距、填充
  - 改变窗口大小
  - 滚动页面
  - 读取某些布局属性（如 offsetWidth、offsetHeight、scrollTop 等）
- **性能影响**：重排是昂贵的操作，会导致浏览器重新构建渲染树

**重绘（Repaint）：**
- **定义**：当元素的外观（如颜色、背景）发生变化，但不影响布局时触发
- **触发条件**：
  - 修改元素的颜色、背景色
  - 修改元素的可见性（visibility）
  - 修改元素的轮廓（outline）
- **性能影响**：比重排轻，但仍会消耗资源

**避免重排和重绘的策略：**

**1. 批量 DOM 操作**
- 使用文档片段（DocumentFragment）
- 离线修改 DOM（先隐藏，修改后再显示）
- 使用 cloneNode 克隆元素进行修改后替换

```javascript
// 避免频繁重排
const fragment = document.createDocumentFragment()
for (let i = 0; i < 100; i++) {
  const div = document.createElement('div')
  div.textContent = `Item ${i}`
  fragment.appendChild(div)
}
document.body.appendChild(fragment)
```

**2. 避免频繁读取布局属性**
- 缓存布局计算结果
- 避免在循环中读取布局属性

```javascript
// 避免频繁读取布局属性
const div = document.getElementById('myDiv')
const width = div.offsetWidth // 只读取一次并缓存
for (let i = 0; i < 100; i++) {
  // 使用缓存的 width，而不是每次都读取
  div.style.left = `${width * i}px`
}
```

**3. 使用 CSS 变换和透明度进行动画**
- transform 和 opacity 的变化不会触发重排，只触发重绘
- 利用 GPU 加速

```css
/* 高效的动画 */
.element {
  transition: transform 0.3s, opacity 0.3s;
}
.element:hover {
  transform: translateX(10px);
  opacity: 0.8;
}
```

**4. 使用 CSS 类进行批量样式修改**
- 避免直接修改元素样式
- 使用预定义的 CSS 类

```javascript
// 避免
el.style.width = '100px'
el.style.height = '100px'
el.style.color = 'red'

// 推荐
el.className = 'active' // 一次性应用多个样式
```

**5. 使用绝对定位脱离文档流**
- 对于需要频繁动画的元素，使用绝对定位
- 减少对其他元素的布局影响

### 3. 浏览器的缓存机制有哪些？如何配置？

**答案：**

**浏览器缓存机制分为：**

**1. 强缓存**
- **特点**：直接从缓存读取，不发送请求到服务器
- **控制方式**：HTTP 响应头
  - **Expires**：设置缓存过期时间（绝对时间）
  - **Cache-Control**：缓存控制指令（相对时间）

**Cache-Control 常用指令：**
- `max-age`：缓存有效时间（秒）
- `public`：可以被任何缓存（浏览器、代理服务器）缓存
- `private`：只能被浏览器缓存，不能被代理服务器缓存
- `no-cache`：不使用强缓存，需要协商缓存
- `no-store`：完全不使用缓存
- `must-revalidate`：缓存过期后必须验证

**示例：**
```
Cache-Control: public, max-age=31536000
```

**2. 协商缓存**
- **特点**：发送请求到服务器，由服务器决定是否使用缓存
- **控制方式**：
  - **Last-Modified / If-Modified-Since**：基于修改时间
  - **ETag / If-None-Match**：基于内容校验值

**Last-Modified 流程：**
1. 服务器返回资源时，添加 Last-Modified 头（资源最后修改时间）
2. 浏览器下次请求时，添加 If-Modified-Since 头（上次获取的 Last-Modified 值）
3. 服务器比较时间，如未修改返回 304，已修改返回新资源

**ETag 流程：**
1. 服务器返回资源时，添加 ETag 头（资源唯一标识符，通常是内容哈希）
2. 浏览器下次请求时，添加 If-None-Match 头（上次获取的 ETag 值）
3. 服务器比较 ETag，如未变化返回 304，已变化返回新资源

**3. 缓存策略配置建议：**

**静态资源（JS、CSS、图片等）：**
- 使用强缓存（Cache-Control: max-age=31536000）
- 配合文件指纹（hash）实现版本控制
- 示例：`Cache-Control: public, max-age=31536000`

**HTML 文件：**
- 使用协商缓存（Cache-Control: no-cache）
- 确保可以及时更新
- 示例：`Cache-Control: no-cache`

**API 响应：**
- 根据数据更新频率设置合适的缓存策略
- 对于频繁变化的数据，使用较短的缓存时间
- 对于相对稳定的数据，使用较长的缓存时间

**4. Service Worker 缓存：**
- 提供更细粒度的缓存控制
- 支持离线访问
- 可以拦截和处理网络请求

```javascript
// Service Worker 缓存示例
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('v1').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/app.js'
      ])
    })
  )
})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request)
    })
  )
})
```

### 4. 如何优化首屏加载性能？

**答案：**

**1. 减少关键渲染路径长度**
- **内联关键 CSS**：将首屏所需的 CSS 直接内联到 HTML 中
- **异步加载非关键 JavaScript**：使用 `async` 或 `defer` 属性
- **优化 CSS 和 JS 的加载顺序**：CSS 放在 `<head>` 中，JS 放在 `<body>` 底部

```html
<!-- 内联关键 CSS --><style>
  .header, .hero {
    /* 首屏关键样式 */
  }
</style>

<!-- 异步加载非关键 JS --><script async src="non-critical.js"></script>
<script defer src="deferred.js"></script>
```

**2. 资源优化**
- **压缩文件**：使用 Gzip/Brotli 压缩文本资源
- **图片优化**：使用适当的格式、尺寸和压缩率
- **字体优化**：使用字体子集，减少字体文件大小
- **移除未使用的代码**：Tree Shaking

**3. 代码分割和懒加载**
- **路由级代码分割**：根据路由拆分代码
- **组件级懒加载**：延迟加载非首屏组件
- **图片懒加载**：只加载视口内的图片

```javascript
// React 路由级代码分割
const About = React.lazy(() => import('./About'))

// Vue 路由级代码分割
const router = new VueRouter({
  routes: [
    {
      path: '/about',
      component: () => import('./About.vue')
    }
  ]
})
```

**4. 预加载和预连接**
- **预连接**：提前建立连接
- **预加载**：加载关键资源
- **预获取**：预加载可能需要的资源

```html
<!-- 预连接 --><link rel="preconnect" href="https://api.example.com">

<!-- 预加载关键资源 --><link rel="preload" href="critical.js" as="script">
<link rel="preload" href="critical.css" as="style">

<!-- 预获取下一页资源 --><link rel="prefetch" href="next-page.js">
```

**5. 服务端渲染（SSR）和静态站点生成（SSG）**
- **SSR**：在服务器生成 HTML，减少客户端渲染时间
- **SSG**：预生成静态 HTML 文件，提供最快的加载速度

**6. 使用 CDN**
- 内容分发网络，将资源分发到离用户更近的服务器
- 减少网络延迟，提高加载速度

**7. 骨架屏和渐进式加载**
- **骨架屏**：快速显示页面结构，提升用户感知性能
- **渐进式加载**：先加载核心内容，再加载非核心内容

**8. 性能预算和监控**
- **设置性能预算**：限制资源大小和加载时间
- **性能监控**：使用 Lighthouse、Web Vitals 等工具监控性能

**关键性能指标：**
- **LCP (Largest Contentful Paint)**：最大内容绘制时间，理想值 < 2.5s
- **FID (First Input Delay)**：首次输入延迟，理想值 < 100ms
- **CLS (Cumulative Layout Shift)**：累积布局偏移，理想值 < 0.1
- **FCP (First Contentful Paint)**：首次内容绘制时间
- **TTI (Time to Interactive)**：可交互时间

### 5. 什么是 Web Workers？如何使用？

**答案：**

**Web Workers 定义：**
Web Workers 是 JavaScript 的一种机制，允许在后台线程中运行脚本，不阻塞主线程。

**主要类型：**
- **Dedicated Workers**：专用 Worker，仅与创建它的主线程通信
- **Shared Workers**：共享 Worker，可以与多个线程通信
- **Service Workers**：特殊类型的 Worker，用于网络代理、缓存等

**使用场景：**
- 计算密集型任务
- 数据分析和处理
- 图像和视频处理
- 后台数据同步
- 复杂算法计算

**Dedicated Workers 使用方法：**

**1. 创建 Worker 文件（worker.js）**
```javascript
// worker.js
self.addEventListener('message', function(e) {
  const data = e.data;
  // 执行耗时操作
  const result = performHeavyCalculation(data);
  // 发送结果回主线程
  self.postMessage(result);
}, false);

function performHeavyCalculation(data) {
  // 复杂计算
  let result = 0;
  for (let i = 0; i < data.count; i++) {
    result += Math.sqrt(i * data.multiplier);
  }
  return result;
}
```

**2. 在主线程中使用 Worker**
```javascript
// 主线程代码
if (window.Worker) {
  // 创建 Worker
  const myWorker = new Worker('worker.js');
  
  // 发送数据到 Worker
  myWorker.postMessage({ count: 1000000, multiplier: 2 });
  
  // 接收 Worker 返回的结果
  myWorker.addEventListener('message', function(e) {
    console.log('Result from worker:', e.data);
    // 处理结果
  }, false);
  
  // 错误处理
  myWorker.addEventListener('error', function(error) {
    console.error('Worker error:', error);
  }, false);
  
  // 终止 Worker（在不需要时）
  // myWorker.terminate();
}
```

**注意事项：**
- Worker 运行在独立的全局上下文中（`DedicatedWorkerGlobalScope`）
- Worker 不能直接访问 DOM
- Worker 可以使用大部分 JavaScript API，但有一些限制
- Worker 和主线程之间通过消息传递通信，数据是复制的，不是共享的
- 使用结构化克隆算法复制数据，某些类型（如函数、DOM 节点）不能复制
- Worker 中可以使用 `XMLHttpRequest` 或 `fetch` 进行网络请求

**Shared Workers 使用方法：**
```javascript
// 主线程
if (window.SharedWorker) {
  const sharedWorker = new SharedWorker('shared-worker.js');
  
  sharedWorker.port.addEventListener('message', function(e) {
    console.log('Message from shared worker:', e.data);
  });
  
  sharedWorker.port.start(); // 启动端口
  sharedWorker.port.postMessage('Hello from page 1');
}

// shared-worker.js
const connections = [];

self.addEventListener('connect', function(e) {
  const port = e.ports[0];
  connections.push(port);
  
  port.addEventListener('message', function(e) {
    // 广播消息给所有连接
    for (let i = 0; i < connections.length; i++) {
      connections[i].postMessage(e.data);
    }
  });
  
  port.start();
});
```

### 6. 什么是懒加载（Lazy Loading）？如何实现？

**答案：**

**懒加载定义：**
懒加载是一种延迟加载资源的技术，只在需要时才加载资源，而不是在页面初始加载时全部加载。

**主要目的：**
- 减少初始加载时间
- 降低带宽使用
- 减少服务器负载
- 改善用户体验

**实现方式：**

**1. 图片懒加载**

**原生实现（Intersection Observer API）：**
```javascript
// 图片懒加载
const images = document.querySelectorAll('.lazy-image');

const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.add('loaded');
      imageObserver.unobserve(img);
    }
  });
});

images.forEach(img => imageObserver.observe(img));
```

**HTML 使用：**
```html
<img class="lazy-image" data-src="image.jpg" src="placeholder.jpg" alt="Lazy loaded image">
```

**2. 组件懒加载**

**React 组件懒加载：**
```javascript
import React, { Suspense, lazy } from 'react';

// 懒加载组件
const LazyComponent = lazy(() => import('./LazyComponent'));

function App() {
  return (
    <div>
      <h1>Main Content</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <LazyComponent />
      </Suspense>
    </div>
  );
}
```

**Vue 组件懒加载：**
```javascript
// 路由级懒加载
const router = new VueRouter({
  routes: [
    {
      path: '/heavy-component',
      component: () => import('./HeavyComponent.vue')
    }
  ]
})

// 组件级懒加载
export default {
  components: {
    HeavyComponent: () => import('./HeavyComponent.vue')
  }
}
```

**3. 资源懒加载**

**动态导入 JavaScript：**
```javascript
// 按需加载 JavaScript 模块
async function loadFeature() {
  const module = await import('./feature.js');
  module.initialize();
}

// 在需要时调用
button.addEventListener('click', loadFeature);
```

**动态加载 CSS：**
```javascript
// 动态加载 CSS
function loadCSS(url) {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    link.onload = resolve;
    link.onerror = reject;
    document.head.appendChild(link);
  });
}

// 使用
loadCSS('styles.css').then(() => {
  console.log('CSS loaded');
});
```

**4. 无限滚动实现（列表懒加载）：**
```javascript
const listContainer = document.getElementById('list-container');
let page = 1;
let loading = false;

function loadMoreItems() {
  if (loading) return;
  loading = true;
  
  // 模拟加载数据
  fetch(`/api/items?page=${page}`)
    .then(response => response.json())
    .then(data => {
      data.items.forEach(item => {
        const listItem = document.createElement('div');
        listItem.textContent = item.name;
        listContainer.appendChild(listItem);
      });
      page++;
      loading = false;
    });
}

// 使用 Intersection Observer 监测滚动到底部
const observer = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !loading) {
    loadMoreItems();
  }
});

// 创建一个观察目标元素放在列表底部
const sentinel = document.createElement('div');
listContainer.appendChild(sentinel);
observer.observe(sentinel);
```

**懒加载最佳实践：**
- 对图片、视频等媒体资源使用懒加载
- 对非关键的 JavaScript 和 CSS 使用懒加载
- 使用 Intersection Observer API 代替滚动事件监听（性能更好）
- 设置适当的预加载距离（提前加载即将进入视口的资源）
- 为懒加载资源提供占位符，避免布局偏移

## 前端工程化

### 7. 请解释前端工程化的概念和主要内容。

**答案：**

**前端工程化概念：**
前端工程化是将软件工程的方法和实践应用于前端开发，旨在提高开发效率、代码质量和可维护性，解决前端开发中的复杂问题。

**主要内容：**

**1. 构建工具**
- **功能**：代码编译、打包、压缩、优化等
- **代表工具**：Webpack、Vite、Rollup、Parcel
- **核心功能**：
  - 模块打包
  - 代码分割
  - 资源优化
  - 热模块替换（HMR）

**2. 包管理工具**
- **功能**：管理第三方依赖、版本控制、依赖解析
- **代表工具**：npm、Yarn、pnpm
- **核心功能**：
  - 依赖安装与更新
  - 版本锁定
  - 脚本管理
  - 私有包管理

**3. 代码规范**
- **功能**：统一代码风格、提高代码质量
- **代表工具**：ESLint、Prettier、Stylelint
- **配置方式**：
  - 项目级配置文件（.eslintrc、.prettierrc 等）
  - 共享配置（如 eslint-config-airbnb）
  - 编辑器集成

**4. 自动化测试**
- **功能**：验证代码功能、提高代码质量
- **测试类型**：
  - 单元测试（Jest、Vitest）
  - 集成测试（Cypress、Puppeteer）
  - E2E 测试（Playwright）
  - 组件测试（Storybook）

**5. 持续集成/持续部署（CI/CD）**
- **功能**：自动化构建、测试、部署流程
- **代表工具**：Jenkins、GitHub Actions、GitLab CI、CircleCI
- **核心流程**：
  - 代码提交触发构建
  - 自动运行测试
  - 自动部署到测试/生产环境

**6. 开发服务器与代理**
- **功能**：本地开发环境、API 代理、热更新
- **代表工具**：webpack-dev-server、Vite、http-proxy-middleware
- **核心功能**：
  - 静态文件服务
  - API 请求代理
  - 热模块替换
  - 模拟数据

**7. 模块化与组件化**
- **模块化**：将代码拆分为独立的模块，便于维护和复用
  - ES Modules、CommonJS
  - 按需加载、Tree Shaking
- **组件化**：将 UI 拆分为独立的组件，提高复用性
  - 组件设计规范
  - 组件库开发
  - 组件文档

**8. 状态管理与数据流**
- **功能**：管理应用状态、处理数据流
- **代表工具**：Redux、Vuex、MobX、Zustand、Pinia
- **核心概念**：
  - 单向数据流
  - 状态分离
  - 可预测性

**9. 文档化**
- **功能**：项目文档、API 文档、组件文档
- **代表工具**：JSDoc、Storybook、VuePress、Docusaurus
- **内容包括**：
  - 项目架构
  - 开发规范
  - API 说明
  - 组件示例

**10. 监控与性能优化**
- **功能**：监控应用性能、用户体验、错误日志
- **代表工具**：Sentry、New Relic、Google Analytics、Lighthouse
- **监控指标**：
  - 页面加载速度
  - 错误率
  - 用户行为
  - 性能指标（Web Vitals）

**前端工程化的好处：**
- 提高开发效率和团队协作
- 保证代码质量和一致性
- 简化复杂的构建和部署流程
- 提升用户体验和应用性能
- 便于代码维护和功能扩展

### 8. Webpack 的核心概念和工作原理是什么？

**答案：**

**Webpack 核心概念：**

**1. 入口（Entry）**
- 定义 Webpack 构建的起点
- 可以是单入口或多入口
- 默认入口：`./src/index.js`

```javascript
// webpack.config.js
module.exports = {
  entry: './src/index.js' // 单入口
  // 或多入口
  // entry: {
  //   main: './src/index.js',
  //   vendor: './src/vendor.js'
  // }
}
```

**2. 输出（Output）**
- 定义构建结果的输出位置和命名规则
- 控制如何向硬盘写入编译后的文件

```javascript
module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'), // 输出目录
    filename: '[name].[hash].js', // 输出文件名
    publicPath: '/' // 公共路径
  }
}
```

**3. 加载器（Loader）**
- 处理非 JavaScript 文件（如 CSS、图片、字体等）
- 将这些文件转换为有效的模块

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'] // 从右到左执行
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: ['file-loader']
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  }
}
```

**4. 插件（Plugin）**
- 执行范围更广的任务（如打包优化、资源管理、环境变量注入等）
- 扩展 Webpack 的功能

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new MiniCssExtractPlugin({ filename: '[name].[hash].css' })
  ]
}
```

**5. 模式（Mode）**
- 设置构建模式：development、production、none
- 启用相应模式下的优化

```javascript
module.exports = {
  mode: 'production' // 或 'development'
}
```

**6. 解析（Resolve）**
- 配置模块如何解析
- 设置别名、扩展名等

```javascript
module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
}
```

**7. 模块（Module）**
- Webpack 中的模块可以是任何文件（不仅仅是 JavaScript）
- 支持多种模块系统：ES Modules、CommonJS、AMD 等

**8. 优化（Optimization）**
- 配置代码优化策略
- 如代码分割、Tree Shaking、最小化等

```javascript
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all' // 代码分割
    },
    minimize: true // 代码最小化
  }
}
```

**Webpack 工作原理：**

**1. 初始化阶段**
- 读取配置文件，合并命令行参数
- 创建 Compiler 对象
- 注册和应用插件

**2. 编译阶段**
- 从入口文件开始，递归解析所有模块依赖
- 对每个模块应用相应的 Loader 进行转换
- 生成抽象语法树（AST）并进行分析
- 应用 Plugin 进行额外处理

**3. 输出阶段**
- 将编译后的模块组合成 Chunk
- 将 Chunk 转换为最终的文件
- 输出到指定的目录

**核心流程：**
1. **依赖解析**：从入口文件开始，解析所有模块依赖关系，构建依赖图
2. **模块转换**：对每个模块应用 Loader 进行转换处理
3. **代码生成**：将处理后的模块合并成输出文件
4. **优化**：应用各种优化策略（代码分割、Tree Shaking 等）

**Webpack 与其他构建工具的比较：**
- **Webpack**：功能全面，插件生态丰富，适合复杂项目
- **Vite**：基于 ES Modules，开发环境启动快，热更新迅速
- **Rollup**：更适合库的打包，Tree Shaking 效果更好
- **Parcel**：零配置，适合快速原型开发

### 9. 如何配置 ESLint 和 Prettier？它们的区别是什么？

**答案：**

**ESLint 和 Prettier 的区别：**

**ESLint：**
- **主要功能**：代码质量检查，识别并修复代码问题
- **检查内容**：语法错误、未使用变量、潜在错误、最佳实践等
- **可配置性**：高度可配置，支持自定义规则
- **自动修复**：可以自动修复部分问题

**Prettier：**
- **主要功能**：代码格式化，统一代码风格
- **格式化内容**：缩进、换行、引号、分号等格式问题
- **零配置**：默认配置已经很好用，配置项较少
- **自动格式化**：专注于自动格式化，不关心代码质量

**配置步骤：**

**1. 安装依赖**
```bash
npm install --save-dev eslint prettier eslint-config-prettier eslint-plugin-prettier
```

**2. 配置 ESLint**

**创建 .eslintrc.js 文件：**
```javascript
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    'prettier' // 使用 eslint-config-prettier 禁用与 Prettier 冲突的规则
  ],
  plugins: ['prettier'], // 使用 eslint-plugin-prettier
  rules: {
    'prettier/prettier': 'error', // 将 Prettier 错误作为 ESLint 错误
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  },
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  }
}
```

**3. 配置 Prettier**

**创建 .prettierrc.js 文件：**
```javascript
module.exports = {
  semi: true, // 使用分号
  trailingComma: 'es5', // 对象和数组末尾逗号
  singleQuote: true, // 使用单引号
  printWidth: 80, // 每行最大长度
  tabWidth: 2, // 缩进空格数
  bracketSpacing: true, // 对象括号间空格
  arrowParens: 'avoid' // 箭头函数单参数不使用括号
}
```

**4. 创建忽略文件**

**创建 .eslintignore 文件：**
```
node_modules
build
dist
```

**创建 .prettierignore 文件：**
```
node_modules
build
dist
```

**5. 在 package.json 中添加脚本**
```json
{
  "scripts": {
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix",
    "format": "prettier --write ."
  }
}
```

**6. 编辑器集成**
- **VS Code**：安装 ESLint 和 Prettier 插件
- **配置 settings.json**：
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

**集成 React/Vue 项目的额外配置：**

**React 项目：**
```bash
npm install --save-dev eslint-plugin-react @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  plugins: ['react', '@typescript-eslint', 'prettier'],
  settings: {
    react: {
      version: 'detect'
    }
  }
}
```

**Vue 项目：**
```bash
npm install --save-dev eslint-plugin-vue @vue/eslint-config-typescript
```

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'plugin:vue/vue3-recommended',
    '@vue/typescript/recommended',
    'prettier'
  ],
  plugins: ['vue', 'prettier']
}
```

**最佳实践：**
- 使用 ESLint 检查代码质量
- 使用 Prettier 统一代码风格
- 集成到 CI/CD 流程中，确保代码质量
- 在提交前自动运行检查（使用 husky + lint-staged）

### 10. 什么是 CI/CD？如何配置 GitHub Actions？

**答案：**

**CI/CD 概念：**

**CI（持续集成，Continuous Integration）：**
- 频繁地将代码集成到共享仓库
- 每次集成都自动运行构建和测试
- 快速发现和解决问题
- 确保团队开发的代码可以正常集成

**CD（持续部署/交付，Continuous Deployment/Delivery）：**
- **持续交付**：自动将代码部署到测试环境，手动批准后部署到生产环境
- **持续部署**：自动将通过测试的代码部署到生产环境
- 减少人工操作，提高部署效率和质量

**GitHub Actions 配置步骤：**

**1. 创建工作流文件**
在项目根目录下创建 `.github/workflows` 目录，并添加 YAML 配置文件。

**基本结构：**
```yaml
name: CI/CD Pipeline

on:  # 触发条件
  push:  # 推送代码时触发
    branches: [ main, master ]
  pull_request:  # 发起 PR 时触发
    branches: [ main, master ]

jobs:  # 定义任务
  build-and-test:  # 构建和测试任务
    runs-on: ubuntu-latest  # 运行环境
    steps:  # 步骤
      - uses: actions/checkout@v3  # 检出代码
      - name: Setup Node.js  # 设置 Node.js 环境
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'npm'
      - name: Install dependencies  # 安装依赖
        run: npm ci
      - name: Run lint  # 运行代码检查
        run: npm run lint
      - name: Run tests  # 运行测试
        run: npm test
      - name: Build  # 构建项目
        run: npm run build
```

**2. 添加部署步骤**

**部署到 GitHub Pages 示例：**
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist  # 构建输出目录
```

**部署到服务器示例（使用 SSH）：**
```yaml
name: Deploy to Server

on:
  push:
    branches: [ production ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Server
        uses: easingthemes/ssh-deploy@v2.1.5
        env:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          ARGS: '-rltgoDzvO --delete'
          SOURCE: 'dist/'
          REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
          REMOTE_USER: ${{ secrets.REMOTE_USER }}
          TARGET: '/var/www/html/'
```

**3. 设置环境变量和密钥**
- 在 GitHub 仓库中，前往 Settings > Secrets and variables > Actions
- 添加必要的密钥，如：
  - `SSH_PRIVATE_KEY`：服务器 SSH 私钥
  - `REMOTE_HOST`：服务器地址
  - `REMOTE_USER`：服务器用户名

**4. 配置缓存**
```yaml
- name: Cache node modules
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

**5. 多环境部署示例**
```yaml
name: Multi-Environment Deployment

on:
  push:
    branches:
      - develop
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      build_id: ${{ steps.set-output.outputs.build_id }}
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Set build ID
        id: set-output
        run: echo "::set-output name=build_id::$(date +%s)"

  deploy-staging:
    needs: build
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Staging
        run: echo "Deploying build ${{ needs.build.outputs.build_id }} to staging"

  deploy-production:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Production
        run: echo "Deploying build ${{ needs.build.outputs.build_id }} to production"
```

**GitHub Actions 关键概念：**

**1. Workflow（工作流）**
- 定义在 YAML 文件中
- 由一个或多个作业组成
- 可以按计划运行或由事件触发

**2. Event（事件）**
- 触发工作流的事件
- 如 push、pull_request、schedule 等

**3. Job（作业）**
- 在同一运行器上执行的一组步骤
- 默认并行执行，可以设置依赖关系

**4. Step（步骤）**
- 单个任务，可以运行命令或使用动作
- 按顺序执行

**5. Action（动作）**
- 可重用的任务单元
- 可以是官方动作或社区贡献的动作

**6. Runner（运行器）**
- 执行工作流的服务器
- GitHub 托管或自托管

**CI/CD 的优势：**
- 自动化构建、测试、部署流程
- 减少人为错误
- 快速发现和修复问题
- 提高开发效率和代码质量
- 支持团队协作和持续交付

### 11. 什么是模块化？CommonJS、AMD、UMD 和 ES Modules 有什么区别？

**答案：**

**模块化概念：**
模块化是将一个大的程序拆分成互相依赖的小文件，然后再将它们组合起来的机制。它有助于代码组织、复用和维护。

**主要模块化规范：**

**1. CommonJS**
- **适用环境**：主要用于 Node.js 环境
- **加载方式**：同步加载
- **语法**：
  - `require()`：导入模块
  - `module.exports` 或 `exports`：导出模块
- **特点**：
  - 模块加载是同步的
  - 运行时加载
  - 缓存模块结果
  - 每个模块都有自己的作用域

```javascript
// 导出
module.exports = {
  add: function(a, b) {
    return a + b;
  },
  name: 'CommonJS'
};

// 或
exports.add = function(a, b) {
  return a + b;
};

// 导入
const math = require('./math.js');
console.log(math.add(1, 2)); // 3
```

**2. AMD (Asynchronous Module Definition)**
- **适用环境**：主要用于浏览器环境
- **加载方式**：异步加载
- **代表库**：RequireJS
- **语法**：
  - `define()`：定义模块
  - `require()`：加载模块
- **特点**：
  - 支持异步加载
  - 适合浏览器环境
  - 支持依赖前置

```javascript
// 定义模块
define(['dependency1', 'dependency2'], function(dep1, dep2) {
  return {
    doSomething: function() {
      return dep1.method() + dep2.method();
    }
  };
});

// 加载模块
require(['module1', 'module2'], function(module1, module2) {
  module1.doSomething();
});
```

**3. UMD (Universal Module Definition)**
- **适用环境**：通用模块定义，兼容各种环境
- **特点**：
  - 同时支持 CommonJS、AMD 和全局变量
  - 可以在浏览器和 Node.js 中使用
  - 适合库的开发

```javascript
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // 全局变量
    root.myModule = factory(root.jQuery);
  }
}(typeof self !== 'undefined' ? self : this, function($) {
  // 模块代码
  return {
    init: function() {
      // 初始化代码
    }
  };
}));
```

**4. ES Modules (ESM)**
- **适用环境**：现代浏览器和 Node.js (ES6+) 环境
- **加载方式**：静态加载（编译时），也支持动态导入
- **语法**：
  - `import`：导入模块
  - `export`：导出模块
- **特点**：
  - 静态分析，支持 Tree Shaking
  - 异步加载
  - 支持命名导出和默认导出
  - 原生支持，不需要额外的构建工具

```javascript
// 导出
// 命名导出
export const add = (a, b) => a + b;
export const name = 'ES Modules';

// 默认导出
export default {
  add,
  name
};

// 导入
// 命名导入
import { add, name } from './math.js';

// 默认导入
import math from './math.js';

// 动态导入
import('./math.js').then(module => {
  console.log(module.add(1, 2));
});
```

**主要区别对比：**

| 特性 | CommonJS | AMD | UMD | ES Modules |
|------|----------|-----|-----|------------|
| 环境 | Node.js | 浏览器 | 通用 | 现代浏览器/Node.js |
| 加载方式 | 同步 | 异步 | 根据环境 | 静态(编译时)，动态导入 |
| 依赖解析 | 运行时 | 运行时 | 运行时 | 编译时 |
| Tree Shaking | 不支持 | 不支持 | 不支持 | 支持 |
| 原生支持 | Node.js | 需库支持 | 需构建 | 现代浏览器/Node.js 14+ |

**实际应用建议：**
- **现代 Web 开发**：优先使用 ES Modules
- **Node.js 开发**：可以使用 CommonJS 或 ES Modules (Node.js 14+)
- **库开发**：考虑使用 UMD 以支持多种环境
- **旧浏览器兼容**：使用 Babel 等工具将 ES Modules 转换为兼容的格式

### 12. 如何使用 Git Hooks 进行代码质量控制？

**答案：**

**Git Hooks 概念：**
Git Hooks 是 Git 仓库中的脚本，在特定的 Git 事件（如提交、推送、合并等）触发时自动执行。它们可以用于代码质量控制、自动化测试、代码格式化等。

**配置步骤：**

**1. 使用 husky 管理 Git Hooks**

**安装依赖：**
```bash
# 安装 husky 和 lint-staged
npm install --save-dev husky lint-staged
```

**初始化 husky：**
```bash
# Husky v7+
npx husky install

# 添加 prepare 脚本（自动启用 hooks）
npm set-script prepare "husky install"
```

**2. 配置 lint-staged**
lint-staged 用于在 Git 暂存文件上运行 linters，只检查修改的文件。

**在 package.json 中添加配置：**
```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{css,scss,less}": [
      "stylelint --fix",
      "prettier --write"
    ],
    "*.{json,md,yml}": [
      "prettier --write"
    ]
  }
}
```

**3. 添加 pre-commit 钩子**
在提交前运行 lint-staged，检查和修复代码。

```bash
npx husky add .husky/pre-commit "npx lint-staged"
```

**pre-commit 钩子内容示例：**
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
```

**4. 添加 commit-msg 钩子**
检查提交信息是否符合规范（如 Angular 提交规范）。

**安装 commitlint：**
```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional
```

**创建 commitlint 配置文件（.commitlintrc.js）：**
```javascript
module.exports = {
  extends: ['@commitlint/config-conventional']
}
```

**添加 commit-msg 钩子：**
```bash
npx husky add .husky/commit-msg "npx --no-install commitlint --edit $1"
```

**5. 添加 pre-push 钩子**
在推送前运行测试，确保代码通过所有测试。

```bash
npx husky add .husky/pre-push "npm test"
```

**pre-push 钩子内容示例：**
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm test
```

**6. 自定义其他钩子**

**pre-rebase 钩子（变基前执行）：**
```bash
npx husky add .husky/pre-rebase "echo 'Running pre-rebase checks'"
```

**post-merge 钩子（合并后执行）：**
```bash
npx husky add .husky/post-merge "npm install"
```

**7. 在 CI/CD 中使用**
确保在 CI/CD 流程中也运行相同的检查，防止绕过本地 hooks。

**GitHub Actions 示例：**
```yaml
name: Lint and Test

on: [push, pull_request]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Run lint
        run: npm run lint
      - name: Run tests
        run: npm test
```

**常见的 Git Hooks 使用场景：**

**1. 代码质量控制**
- 运行 ESLint/TSLint 检查代码质量
- 运行 Prettier 格式化代码
- 检查代码规范和最佳实践

**2. 测试自动化**
- 运行单元测试
- 运行代码覆盖率检查
- 运行集成测试

**3. 提交信息规范**
- 强制使用规范的提交信息格式
- 检查提交信息长度和内容
- 根据提交信息自动生成变更日志

**4. 构建和部署准备**
- 检查构建是否成功
- 检查依赖是否正确安装
- 清理和准备构建环境

**5. 安全检查**
- 检查敏感信息泄露（如 API 密钥）
- 检查依赖包中的安全漏洞
- 运行安全扫描工具

**Git Hooks 最佳实践：**
- 保持钩子执行快速，避免过长等待
- 提供清晰的错误信息和修复建议
- 在团队内统一配置，确保一致性
- 定期更新钩子以适应项目需求变化
- 确保 CI/CD 流程与本地钩子检查保持一致

### 13. 什么是 Tree Shaking？它是如何工作的？

**答案：**

**Tree Shaking 定义：**
Tree Shaking（摇树优化）是一种代码优化技术，用于移除 JavaScript 中未使用的代码，减小打包后的文件体积。

**Tree Shaking 工作原理：**

**1. 静态分析**
- Tree Shaking 基于 ES Modules 的静态导入/导出语法
- 打包工具（如 Webpack、Rollup）在编译时分析模块之间的依赖关系
- 识别哪些代码被使用，哪些代码未被使用

**2. 工作条件**
- 必须使用 ES Modules（`import`/`export` 语法）
- 代码必须是静态的，不能有动态的导入/导出
- 模块必须是纯的（没有副作用）
- 打包工具配置正确（如 Webpack 需要设置 `mode: 'production'`）

**3. 具体实现步骤**

**第一步：标记未使用的导出**
```javascript
// math.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export const multiply = (a, b) => a * b;

// 使用时只导入了 add
import { add } from './math.js';
console.log(add(1, 2));
// subtract 和 multiply 未被使用，会被 Tree Shaking
```

**第二步：消除未使用的代码**
- 在生产环境下，打包工具会移除未使用的导出
- 合并和优化使用的代码
- 生成更小的打包文件

**影响 Tree Shaking 的因素：**

**1. 副作用（Side Effects）**
- 函数内部修改外部变量或状态
- 全局副作用（如修改全局对象）
- 模块导入时执行的代码

**如何声明无副作用：**
```json
// package.json
{
  "sideEffects": false // 声明整个包没有副作用
  // 或指定有副作用的文件
  // "sideEffects": ["*.css", "./src/polyfills.js"]
}
```

**2. 动态导入**
- 动态导入（`import()`）的模块不会被 Tree Shaking
- 因为无法在编译时确定导入的内容

**3. CommonJS 模块**
- CommonJS 模块（`require`/`module.exports`）不支持 Tree Shaking
- 因为是运行时加载，无法在编译时静态分析

**4. 对象解构**
- 直接从对象中解构的属性可能不会被正确识别
- 推荐使用命名导入

```javascript
// 推荐
import { add } from './math.js';

// 不推荐
import * as math from './math.js';
const { add } = math; // 可能不会被 Tree Shaking
```

**Webpack 中启用 Tree Shaking：**

**1. 基本配置**
```javascript
// webpack.config.js
module.exports = {
  mode: 'production', // 生产模式自动启用 Tree Shaking
  optimization: {
    usedExports: true, // 标记未使用的导出
    minimize: true, // 启用代码压缩
    concatenateModules: true // 合并模块
  }
};
```

**2. 处理有副作用的代码**
```javascript
// 标记有副作用的代码
/*#__PURE__*/ someFunction(); // 告诉 Webpack 这是一个纯函数调用

// 或在 package.json 中配置
{
  "sideEffects": ["*.css", "./src/polyfills.js"]
}
```

**Tree Shaking 最佳实践：**
- 使用 ES Modules 语法
- 避免不必要的默认导出（优先使用命名导出）
- 合理配置 `sideEffects`
- 避免全局副作用
- 使用生产模式构建
- 选择合适的打包工具（Rollup 的 Tree Shaking 效果通常更好）

**验证 Tree Shaking 是否生效：**
- 使用 Webpack Bundle Analyzer 分析打包结果
- 检查未使用的代码是否被移除
- 比较启用前后的打包体积

```bash
npm install --save-dev webpack-bundle-analyzer

# 在 package.json 中添加脚本
"scripts": {
  "analyze": "webpack --profile --json > stats.json && webpack-bundle-analyzer stats.json"
}
```

### 14. 如何构建和维护一个组件库？

**答案：**

**组件库构建步骤：**

**1. 技术选型**
- **基础框架**：Vue、React、Angular 等
- **构建工具**：Rollup、Webpack、Vite 等
- **样式解决方案**：CSS Modules、styled-components、Sass/Less 等
- **测试框架**：Jest、Vitest、Cypress 等
- **文档工具**：Storybook、VuePress、Docusaurus 等

**2. 项目结构设计**
```
my-component-lib/
├── src/                  # 源码目录
│   ├── components/       # 组件目录
│   │   ├── Button/       # 组件（每个组件一个目录）
│   │   │   ├── src/      # 组件源码
│   │   │   ├── styles/   # 组件样式
│   │   │   └── index.ts  # 组件导出
│   │   └── index.ts      # 组件统一导出
│   ├── utils/            # 工具函数
│   ├── hooks/            # 自定义 Hooks
│   ├── styles/           # 全局样式
│   └── index.ts          # 库入口文件
├── stories/              # Storybook 文档
├── __tests__/            # 测试文件
├── rollup.config.js      # Rollup 配置
├── tsconfig.json         # TypeScript 配置
└── package.json          # 项目配置
```

**3. 组件开发规范**
- **命名规范**：组件名称使用大驼峰（如 `Button`），文件名称与组件名保持一致
- **Props 设计**：合理设计组件属性，提供默认值，添加类型定义
- **事件设计**：使用明确的事件名称，遵循框架约定
- **样式设计**：支持主题定制，提供变量覆盖机制
- **文档规范**：每个组件必须有详细的文档和使用示例

**4. 构建配置**

**Rollup 配置示例：**
```javascript
// rollup.config.js
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true
    },
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'MyComponentLib',
      sourcemap: true
    }
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript(),
    postcss({
      extract: true,
      minimize: true
    }),
    terser()
  ],
  external: ['react', 'react-dom'] // 声明外部依赖
};
```

**5. 文档编写**

**使用 Storybook 示例：**
```javascript
// stories/Button.stories.js
import React from 'react';
import { Button } from '../src';

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'danger']
      }
    }
  }
};

const Template = args => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  variant: 'primary',
  label: 'Primary Button'
};

export const Secondary = Template.bind({});
Secondary.args = {
  variant: 'secondary',
  label: 'Secondary Button'
};
```

**6. 测试编写**

**Jest 测试示例：**
```javascript
// __tests__/Button.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../src';

describe('Button Component', () => {
  test('renders correctly with label', () => {
    render(<Button label="Test Button" />);
    const buttonElement = screen.getByText(/Test Button/i);
    expect(buttonElement).toBeInTheDocument();
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button label="Click Me" onClick={handleClick} />);
    const buttonElement = screen.getByText(/Click Me/i);
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('renders with correct variant class', () => {
    render(<Button label="Primary" variant="primary" />);
    const buttonElement = screen.getByText(/Primary/i);
    expect(buttonElement).toHaveClass('button-primary');
  });
});
```

**7. 版本管理和发布**
- 使用 Semantic Versioning（语义化版本）
- 版本格式：`major.minor.patch`
- 遵循 CHANGELOG 记录版本变更
- 自动化发布流程

**发布脚本示例：**
```bash
#!/bin/bash

# 构建项目
npm run build

# 运行测试
npm test

# 生成文档
npm run docs:build

# 发布到 npm
npm publish --access public
```

**组件库维护策略：**

**1. 持续集成和部署**
- 配置 CI/CD 流水线（GitHub Actions、GitLab CI 等）
- 自动运行测试、构建和发布
- 维护测试覆盖率要求（通常 ≥ 90%）

**2. 版本管理**
- **主版本（Major）**：不兼容的 API 变更
- **次版本（Minor）**：向后兼容的功能添加
- **修订版本（Patch）**：向后兼容的问题修复
- 维护多个版本分支，提供长期支持（LTS）

**3. 社区反馈和迭代**
- 收集用户反馈和功能请求
- 定期规划和发布更新
- 及时响应和修复 bug
- 维护 Issue 和 Pull Request

**4. 性能优化**
- 组件懒加载
- 按需导入
- 减少包体积
- 优化渲染性能

**5. 文档维护**
- 保持文档更新与代码同步
- 提供详细的使用示例
- 包含 API 参考、最佳实践和迁移指南
- 支持搜索和导航功能

**6. 兼容性维护**
- 支持主流浏览器
- 兼容不同版本的基础框架
- 处理浏览器特性差异
- 提供降级方案

**组件库最佳实践：**
- **设计系统先行**：建立统一的设计规范和设计语言
- **原子化组件**：从基础组件开始，逐步构建复杂组件
- **可访问性**：确保组件符合 WCAG 标准，支持键盘导航
- **主题定制**：支持全局主题和组件级别的样式覆盖
- **国际化**：支持多语言和区域设置
- **类型安全**：提供完整的 TypeScript 类型定义
- **示例丰富**：提供各种使用场景的示例代码

**发布和推广：**
- 在 npm、GitHub 等平台发布
- 在技术社区分享和推广
- 提供在线演示和文档网站
- 收集用户反馈并持续改进
- 考虑开源贡献和社区维护

通过以上步骤和策略，可以构建一个高质量、易用、可维护的组件库，为团队或社区提供一致的 UI 解决方案。