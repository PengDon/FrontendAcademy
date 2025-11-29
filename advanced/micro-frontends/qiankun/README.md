# Qiankun 微前端框架基础知识

## Qiankun 简介

Qiankun 是一个基于 Single-SPA 的微前端框架，由蚂蚁集团开源。它提供了一套完整的微前端解决方案，支持多种前端框架（React、Vue、Angular等）的无缝集成，实现了应用间的路由分发、状态管理、样式隔离、全局通信等核心功能。

### 核心特点

- **简单易用**：提供开箱即用的微前端解决方案，配置简单
- **框架无关**：支持任何前端框架，包括 Vue、React、Angular、jQuery 等
- **HTML Entry**：采用 HTML 作为微应用的入口，自动解析并加载资源
- **样式隔离**：内置样式隔离机制，避免样式冲突
- **运行时沙箱**：JavaScript 运行时沙箱，提供执行环境隔离
- **资源预加载**：支持微应用资源预加载，提升用户体验
- **动态注册**：支持动态注册微应用，灵活控制微应用的加载
- **完整生态**：提供丰富的周边工具和最佳实践

### 适用场景

- **大型企业级应用**：将大型单体应用拆分为多个微应用
- **多团队协作**：不同团队独立开发、部署和维护不同的微应用
- **技术栈多元化**：在同一个系统中使用不同的前端框架
- **遗留系统改造**：逐步将遗留系统迁移到新的架构
- **渐进式升级**：允许系统渐进式地升级和重构

## 快速入门

### 安装 Qiankun

```bash
# 安装 qiankun
npm install qiankun -S
```

### 创建主应用

#### 1. 主应用入口文件配置

```javascript
// main.js
import { registerMicroApps, start } from 'qiankun';

// 注册微应用
registerMicroApps([
  {
    name: 'vue-app', // 微应用名称
    entry: '//localhost:8081', // 微应用入口
    container: '#subapp-container', // 微应用容器
    activeRule: '/vue', // 激活规则
    props: { // 向微应用传递数据
      user: { name: 'admin' }
    }
  },
  {
    name: 'react-app',
    entry: '//localhost:8082',
    container: '#subapp-container',
    activeRule: '/react',
  },
]);

// 启动 qiankun
start({
  prefetch: true, // 开启预加载
  sandbox: {
    strictStyleIsolation: true, // 开启严格的样式隔离
  },
});
```

#### 2. 主应用 HTML 结构

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>主应用</title>
</head>
<body>
  <div id="app">
    <h1>主应用</h1>
    <nav>
      <a href="#/vue">Vue 微应用</a>
      <a href="#/react">React 微应用</a>
    </nav>
    <div id="subapp-container"></div>
  </div>
  <script src="/dist/main.js"></script>
</body>
</html>
```

### 创建微应用

#### Vue 微应用配置

```javascript
// src/main.js
import Vue from 'vue';
import App from './App.vue';
import router from './router';

Vue.config.productionTip = false;

// 定义渲染函数
let instance = null;
function render(props = {}) {
  const { container } = props;
  instance = new Vue({
    router,
    render: (h) => h(App),
  }).$mount(container ? container.querySelector('#app') : '#app');
}

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

// 暴露 qiankun 生命周期钩子
export async function bootstrap() {
  console.log('[vue-app] bootstraped');
}

export async function mount(props) {
  console.log('[vue-app] props from main framework', props);
  render(props);
}

export async function unmount() {
  instance.$destroy();
  instance.$el.innerHTML = '';
  instance = null;
}
```

配置 `vue.config.js`：

```javascript
// vue.config.js
module.exports = {
  devServer: {
    port: 8081,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  configureWebpack: {
    output: {
      library: 'vue-app',
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_vue-app`,
    },
  },
};
```

#### React 微应用配置

```javascript
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

function render(props) {
  const { container } = props;
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    container ? container.querySelector('#root') : document.querySelector('#root')
  );
}

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  render({});
}

// 暴露 qiankun 生命周期钩子
export async function bootstrap() {
  console.log('[react-app] bootstraped');
}

export async function mount(props) {
  console.log('[react-app] props from main framework', props);
  render(props);
}

export async function unmount(props) {
  const { container } = props;
  ReactDOM.unmountComponentAtNode(container ? container.querySelector('#root') : document.querySelector('#root'));
}
```

配置 `webpack.config.js`：

```javascript
// webpack.config.js
module.exports = {
  // ...
  output: {
    library: 'react-app',
    libraryTarget: 'umd',
    jsonpFunction: `webpackJsonp_react-app`,
  },
  devServer: {
    port: 8082,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
};
```

## 核心概念

### 1. 微应用注册

通过 `registerMicroApps` API 注册微应用，每个微应用需要配置名称、入口、容器和激活规则。

### 2. 生命周期

Qiankun 为微应用提供了三个核心生命周期钩子：

- **bootstrap**：微应用初始化阶段，只会在微应用第一次加载时调用一次
- **mount**：微应用挂载阶段，每次进入微应用时调用
- **unmount**：微应用卸载阶段，每次离开微应用时调用

### 3. 沙箱机制

Qiankun 提供了两种沙箱模式：

- **LegacySandbox**：默认模式，通过 Proxy 和快照实现
- **ProxySandbox**：现代浏览器模式，基于 Proxy 实现，性能更好
- **SnapshotSandbox**：兼容模式，适用于不支持 Proxy 的浏览器

### 4. 样式隔离

Qiankun 提供了两种样式隔离策略：

- **严格隔离**：使用 Shadow DOM 或样式前缀
- **宽松隔离**：通过动态修改样式作用域实现

### 5. 通信机制

Qiankun 支持多种通信方式：

- **props 传递**：通过 mount 生命周期钩子传递数据
- **全局事件总线**：使用 EventBus 进行通信
- **基于 props 的通信**：利用 `initGlobalState` API 实现

## 高级配置

### 1. 全局状态管理

使用 `initGlobalState` API 实现全局状态管理：

```javascript
// 主应用中
import { initGlobalState, MicroAppStateActions } from 'qiankun';

// 初始化 state
const initialState = { count: 0 };
const actions = initGlobalState(initialState);

// 监听状态变化
actions.onGlobalStateChange((state, prev) => {
  console.log('Changed from main app:', state, prev);
});

// 修改状态
actions.setGlobalState({ count: 1 });

// 在微应用中
// 从 props 中获取通信方法
function mount(props) {
  const { onGlobalStateChange, setGlobalState } = props;
  
  // 监听状态变化
  onGlobalStateChange((state, prev) => {
    console.log('Changed from micro app:', state, prev);
  });
  
  // 修改状态
  setGlobalState({ count: 2 });
}
```

### 2. 预加载配置

配置微应用的预加载策略：

```javascript
start({
  // 预加载所有微应用
  prefetch: true,
  
  // 只预加载处于 activeRule 匹配的微应用
  prefetch: 'all',
  
  // 自定义预加载规则
  prefetch: (apps) => {
    // 返回需要预加载的微应用
    return apps.filter(app => app.name.includes('common'));
  },
});
```

### 3. 沙箱配置

配置沙箱模式和样式隔离：

```javascript
start({
  // 配置沙箱模式
  sandbox: {
    // 开启严格样式隔离
    strictStyleIsolation: true,
    
    // 使用实验性的影子 DOM 样式隔离
    experimentalStyleIsolation: true,
    
    // 排除某些全局变量不被沙箱拦截
    excludeAssetFilter: assetUrl => {
      return assetUrl.includes('ignore');
    },
  },
});
```

### 4. 动态注册微应用

动态注册和卸载微应用：

```javascript
import { registerMicroApps, unregisterMicroApps, loadMicroApp } from 'qiankun';

// 动态注册微应用
registerMicroApps([
  {
    name: 'dynamic-app',
    entry: '//localhost:8083',
    container: '#subapp-container',
    activeRule: '/dynamic',
  },
]);

// 卸载微应用
unregisterMicroApps(['dynamic-app']);

// 手动加载微应用
const microApp = loadMicroApp({
  name: 'manual-app',
  entry: '//localhost:8084',
  container: '#manual-container',
});

// 卸载手动加载的微应用
microApp.unmount();
```

## 路由配置

### 1. 主应用路由

使用 Vue Router 作为主应用路由：

```javascript
// src/router/index.js
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
  },
  // 微应用路由，由 qiankun 接管
  // { path: '/vue/*', ... }
  // { path: '/react/*', ... }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
```

### 2. 微应用路由

Vue 微应用路由配置：

```javascript
// src/router/index.js
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  // 注意这里的 base 配置
  base: window.__POWERED_BY_QIANKUN__ ? '/vue' : process.env.BASE_URL,
  routes,
});

export default router;
```

## 性能优化

### 1. 资源预加载

配置预加载策略，提升用户体验：

```javascript
start({
  // 预加载策略
  prefetch: (apps) => {
    // 只预加载特定微应用
    return apps.filter(app => app.name === 'common-app');
  },
});
```

### 2. 延迟加载

使用 `lazyLoadMicroApp` 实现延迟加载：

```javascript
import { loadMicroApp } from 'qiankun';

// 按需加载微应用
function loadOnDemand() {
  const microApp = loadMicroApp({
    name: 'lazy-app',
    entry: '//localhost:8085',
    container: '#lazy-container',
  });
}

// 在需要时调用
loadOnDemand();
```

### 3. 优化样式隔离

选择合适的样式隔离策略：

```javascript
start({
  sandbox: {
    // 对于性能敏感的应用，可以关闭严格样式隔离
    strictStyleIsolation: false,
    
    // 使用实验性的影子 DOM 隔离，性能更好
    experimentalStyleIsolation: true,
  },
});
```

### 4. 减少全局通信

尽量减少主应用和微应用之间的通信，使用局部状态管理：

```javascript
// 微应用内部使用自身的状态管理
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // 局部状态
  },
  mutations: {},
  actions: {},
});
```

## 常见问题与解决方案

### 1. 微应用加载失败

**问题**：微应用无法正常加载或出现白屏。

**解决方案**：
- 检查微应用的入口 URL 是否可访问
- 确保微应用正确导出了生命周期钩子
- 检查跨域配置是否正确

```javascript
// 微应用的 devServer 配置
headers: {
  'Access-Control-Allow-Origin': '*',
}
```

### 2. 样式冲突

**问题**：微应用之间的样式相互影响。

**解决方案**：
- 开启严格的样式隔离
- 使用 CSS Modules 或 BEM 命名规范
- 为每个微应用添加唯一的样式前缀

```javascript
start({
  sandbox: {
    strictStyleIsolation: true,
  },
});
```

### 3. 路由问题

**问题**：微应用路由与主应用路由冲突。

**解决方案**：
- 微应用路由使用相对路径
- 正确配置微应用的 base 路径
- 避免使用相同的路由路径

```javascript
// 微应用路由配置
base: window.__POWERED_BY_QIANKUN__ ? '/vue' : process.env.BASE_URL,
```

### 4. 全局变量污染

**问题**：微应用修改了全局变量，影响其他应用。

**解决方案**：
- 开启沙箱机制
- 避免在微应用中修改全局变量
- 使用局部变量或模块作用域

```javascript
start({
  sandbox: {
    experimentalStyleIsolation: true,
  },
});
```

### 5. 构建配置错误

**问题**：微应用构建后的代码无法被 Qiankun 正确加载。

**解决方案**：
- 确保输出格式为 umd
- 配置正确的 library 和 libraryTarget
- 确保资源路径正确

```javascript
// webpack 配置
output: {
  library: 'app-name',
  libraryTarget: 'umd',
  jsonpFunction: `webpackJsonp_app-name`,
}
```

## 最佳实践

### 1. 应用拆分策略

- **按业务域拆分**：基于业务功能模块划分微应用
- **按访问权限拆分**：将不同权限的功能划分为不同的微应用
- **按技术栈拆分**：将使用不同技术栈的模块划分为不同的微应用

### 2. 数据通信原则

- **单向数据流**：尽量保持数据的单向流动
- **最小通信原则**：减少主应用和微应用之间的通信
- **统一通信规范**：制定统一的通信接口和协议

### 3. 样式管理策略

- **命名空间隔离**：为每个微应用添加唯一的命名空间
- **CSS Modules**：使用 CSS Modules 进行样式隔离
- **主题变量共享**：通过主应用提供统一的主题变量

### 4. 开发与部署流程

- **独立开发环境**：每个微应用拥有独立的开发环境
- **统一的构建规范**：制定统一的构建和打包规范
- **自动化部署**：实施 CI/CD 自动化部署流程
- **版本管理**：使用语义化版本管理微应用

### 5. 性能监控

- **加载性能监控**：监控微应用的加载时间
- **运行性能监控**：监控微应用的运行时性能
- **错误监控**：收集和分析微应用的运行时错误

## 与其他微前端方案比较

| 方案 | 优势 | 劣势 |
|------|------|------|
| Qiankun | 开箱即用，完善的沙箱机制，丰富的文档 | 对微应用有一定的侵入性，需要修改入口文件 |
| Single-SPA | 轻量级，框架无关，简单灵活 | 需要手动处理很多细节，如样式隔离、路由等 |
| Module Federation | Webpack原生支持，代码级共享 | 需要Webpack 5+，配置相对复杂 |
| iframe | 完全隔离，实现简单 | 性能开销大，通信复杂，UI不一致 |
| EMP | 基于Module Federation，提供更高级的功能 | 生态相对较小，学习成本较高 |

## 学习资源

### 官方文档

- [Qiankun 官方文档](https://qiankun.umijs.org/zh/)
- [Qiankun GitHub 仓库](https://github.com/umijs/qiankun)

### 示例项目

- [Qiankun 官方示例](https://github.com/umijs/qiankun/tree/master/examples)
- [微前端最佳实践示例](https://github.com/umijs/qiankun/blob/master/examples/official-demo.md)

### 视频教程

- [微前端架构与 Qiankun 实战](https://www.bilibili.com/video/BV17a411i7vY/)
- [Qiankun 微前端框架深入讲解](https://www.bilibili.com/video/BV1J54y1X7U9/)

## 总结

Qiankun 作为一个成熟的微前端框架，为构建大型前端应用提供了完整的解决方案。通过合理使用 Qiankun，我们可以将复杂的单体应用拆分为多个可独立开发和部署的微应用，提高开发效率和系统可维护性。

在实际项目中，我们需要根据项目的具体需求和团队的技术栈，选择合适的微前端方案，并遵循最佳实践，确保系统的性能和稳定性。

随着微前端技术的不断发展，Qiankun 也在持续演进，为开发者提供更好的开发体验和更多的功能支持。通过不断学习和实践，我们可以更好地利用这一技术，构建出高质量的现代前端应用。

---

希望这份 Qiankun 微前端框架基础知识文档能够帮助你快速理解和应用这一强大的微前端技术。在实际项目中，你可能会遇到各种挑战，但通过掌握核心概念和最佳实践，你将能够成功构建出可扩展、可维护的微前端应用。