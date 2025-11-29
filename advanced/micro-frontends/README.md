# 微前端架构

## 介绍

微前端（Micro Frontends）是一种架构风格，它将前端应用程序分解为更小、更简单的应用，这些应用可以由独立的团队开发和部署，然后组合成一个完整的用户界面。微前端的核心理念是将大型单体应用拆分为多个小型前端应用，每个应用负责特定的业务功能或领域。

## 核心特征

### 1. 技术栈无关性

不同的微前端应用可以使用不同的技术栈（如React、Vue、Angular等），团队可以根据自己的专长选择合适的技术。

### 2. 独立开发和部署

每个微前端应用都可以独立开发、测试、部署和扩展，团队之间可以并行工作，提高开发效率。

### 3. 独立运行时

每个微前端应用都应该有自己的运行时环境，避免全局状态共享和冲突。

### 4. 统一的用户体验

尽管由多个独立应用组成，但整体应该提供一致的用户体验，包括导航、样式和交互模式。

### 5. 增量升级

可以逐个升级微前端应用，而不需要一次性重构整个系统，降低了升级风险。

## 架构模式

### 1. 路由分发模式

通过路由将不同的URL路径映射到不同的微前端应用。

**优点**：实现简单，各应用完全独立
**缺点**：用户体验可能不连续，应用之间的跳转更像是页面刷新

```javascript
// 主应用路由配置示例
const router = createRouter({
  routes: [
    {
      path: '/home',
      component: () => import('./apps/home/App.vue')
    },
    {
      path: '/dashboard',
      component: () => import('./apps/dashboard/App.vue')
    }
  ]
})
```

### 2. 构建时集成模式

在构建时将微前端应用打包到主应用中。

**优点**：运行时性能好，集成度高
**缺点**：部署耦合，需要重新构建整个应用

```javascript
// webpack配置示例
module.exports = {
  entry: {
    main: './src/main.js',
    'app-header': './src/apps/header/index.js',
    'app-sidebar': './src/apps/sidebar/index.js'
  },
  // 其他配置...
}
```

### 3. 运行时集成模式

在运行时动态加载和挂载微前端应用。

**优点**：部署解耦，可以独立发布
**缺点**：实现复杂度较高

### 4. Web Components模式

使用Web Components标准来封装微前端应用，通过自定义元素进行集成。

**优点**：技术栈无关，原生支持
**缺点**：浏览器兼容性问题，复杂状态管理困难

```javascript
// Web Components示例
class MicroApp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  
  connectedCallback() {
    // 加载微应用内容
    this.shadowRoot.innerHTML = '<div>微应用内容</div>';
  }
}

customElements.define('micro-app', MicroApp);
```

## 实现方案

### 1. Single-SPA

Single-SPA是一个JavaScript框架，用于前端应用的组合，可以在同一页面上加载多个框架而不刷新页面。

**安装**：
```bash
npm install single-spa
```

**主应用配置**：
```javascript
import { registerApplication, start } from 'single-spa';

// 注册微应用
registerApplication(
  'vue-app',
  () => import('@org/vue-app'),
  location => location.pathname.startsWith('/vue')
);

registerApplication(
  'react-app',
  () => import('@org/react-app'),
  location => location.pathname.startsWith('/react')
);

// 启动应用
start();
```

**微应用配置**：
```javascript
// Vue微应用入口
import Vue from 'vue';
import singleSpaVue from 'single-spa-vue';
import App from './App.vue';

const vueLifecycles = singleSpaVue({
  Vue,
  appOptions: {
    render: h => h(App)
  }
});

export const bootstrap = vueLifecycles.bootstrap;
export const mount = vueLifecycles.mount;
export const unmount = vueLifecycles.unmount;
```

### 2. Qiankun

Qiankun是基于Single-SPA的微前端实现，提供了更加完善的功能，包括JS沙箱、样式隔离、预加载等。

**安装**：
```bash
npm install qiankun
```

**主应用配置**：
```javascript
import { registerMicroApps, start } from 'qiankun';

registerMicroApps([
  {
    name: 'vue-app',
    entry: '//localhost:8081',
    container: '#app-container',
    activeRule: '/vue'
  },
  {
    name: 'react-app',
    entry: '//localhost:8082',
    container: '#app-container',
    activeRule: '/react'
  }
]);

// 启动应用
start({
  sandbox: {
    experimentalStyleIsolation: true
  }
});
```

**微应用配置**：
```javascript
// Vue微应用main.js
import Vue from 'vue';
import App from './App.vue';

let instance = null;

function render(props = {}) {
  const { container } = props;
  instance = new Vue({
    render: h => h(App)
  }).$mount(container ? container.querySelector('#app') : '#app');
}

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

// 导出生命周期函数
export async function bootstrap() {
  console.log('vue app bootstraped');
}

export async function mount(props) {
  console.log('props from main framework', props);
  render(props);
}

export async function unmount() {
  instance.$destroy();
  instance = null;
}
```

### 3. Module Federation

Webpack 5的Module Federation允许在运行时动态加载其他应用的代码，是实现微前端的强大工具。

**Webpack配置（主应用）**：
```javascript
// webpack.config.js
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      remotes: {
        'vue-app': 'vueApp@http://localhost:8081/remoteEntry.js',
        'react-app': 'reactApp@http://localhost:8082/remoteEntry.js'
      },
      shared: ['vue', 'react']
    })
  ]
};
```

**Webpack配置（微应用）**：
```javascript
// vue-app webpack.config.js
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'vueApp',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App.vue',
        './Button': './src/components/Button.vue'
      },
      shared: ['vue']
    })
  ]
};
```

**使用微应用组件**：
```javascript
// 主应用中使用
import React, { lazy, Suspense } from 'react';

const VueApp = lazy(() => import('vue-app/App'));
const ReactApp = lazy(() => import('react-app/App'));

function App() {
  return (
    <div>
      <h1>主应用</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <VueApp />
        <ReactApp />
      </Suspense>
    </div>
  );
}
```

## 状态管理

### 1. 全局状态管理

在微前端架构中，全局状态管理是一个挑战。以下是几种常见的解决方案：

#### 基于发布-订阅模式

使用事件总线或发布-订阅模式在微应用之间共享状态。

```javascript
// 全局事件总线
class EventBus {
  constructor() {
    this.events = {};
  }
  
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }
  
  emit(event, data) {
    if (!this.events[event]) return;
    this.events[event].forEach(callback => callback(data));
  }
  
  off(event, callback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }
}

// 在window对象上挂载
window.eventBus = new EventBus();

// 微应用中使用
window.eventBus.on('userLoggedIn', userData => {
  console.log('用户登录', userData);
});

window.eventBus.emit('userLoggedIn', { id: 1, name: '用户' });
```

#### 使用共享内存

通过共享内存（如localStorage、sessionStorage）在微应用之间共享状态。

```javascript
// 设置共享状态
function setSharedState(key, value) {
  try {
    localStorage.setItem(`shared_${key}`, JSON.stringify(value));
  } catch (error) {
    console.error('设置共享状态失败:', error);
  }
}

// 获取共享状态
function getSharedState(key) {
  try {
    const value = localStorage.getItem(`shared_${key}`);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('获取共享状态失败:', error);
    return null;
  }
}

// 监听存储事件
window.addEventListener('storage', event => {
  if (event.key.startsWith('shared_')) {
    const key = event.key.replace('shared_', '');
    const newValue = event.newValue ? JSON.parse(event.newValue) : null;
    console.log(`共享状态 ${key} 已更新:`, newValue);
    // 触发自定义事件
    window.dispatchEvent(new CustomEvent(`sharedStateChanged_${key}`, { detail: newValue }));
  }
});
```

### 2. 应用间通信

#### 基于props传递

在微应用挂载时，通过props传递数据和通信方法。

```javascript
// 主应用
registerMicroApps([
  {
    name: 'app1',
    entry: '//localhost:8081',
    container: '#app-container',
    activeRule: '/app1',
    props: {
      userInfo: { id: 1, name: '用户' },
      onLogin: (userData) => {
        console.log('用户登录:', userData);
      },
      eventBus: window.eventBus
    }
  }
]);

// 微应用接收props
async function mount(props) {
  const { userInfo, onLogin, eventBus } = props;
  // 使用props
}
```

## 样式隔离

微前端架构中的样式隔离是一个重要问题，以下是几种常见的解决方案：

### 1. CSS Modules

使用CSS Modules可以确保样式的局部性，避免全局样式污染。

```css
/* component.module.css */
.container {
  padding: 20px;
  background-color: #f0f0f0;
}
```

```javascript
import styles from './component.module.css';

element.className = styles.container;
```

### 2. CSS-in-JS

使用CSS-in-JS技术，可以将样式与组件逻辑紧密结合，并提供自动的样式隔离。

```javascript
// 使用styled-components
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  background-color: #f0f0f0;
`;

function MyComponent() {
  return <Container>组件内容</Container>;
}
```

### 3. Shadow DOM

使用Web Components的Shadow DOM特性可以创建真正的样式隔离环境。

```javascript
class IsolatedComponent extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    
    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
      .container {
        padding: 20px;
        background-color: #f0f0f0;
      }
    `;
    
    // 创建内容
    const container = document.createElement('div');
    container.className = 'container';
    container.textContent = '隔离的组件内容';
    
    // 添加到shadow DOM
    shadow.appendChild(style);
    shadow.appendChild(container);
  }
}

customElements.define('isolated-component', IsolatedComponent);
```

### 4. 命名空间或CSS变量

通过命名空间或CSS变量来组织样式，减少冲突的可能性。

```css
/* 使用命名空间 */
.my-app-header {
  background-color: #333;
  color: #fff;
}

.my-app-button {
  padding: 8px 16px;
  background-color: #007bff;
}

/* 使用CSS变量 */
:root {
  --my-app-primary-color: #007bff;
  --my-app-secondary-color: #6c757d;
}

.my-app-button {
  background-color: var(--my-app-primary-color);
  color: white;
}
```

## 路由管理

在微前端架构中，路由管理需要协调主应用和微应用之间的路由关系。

### 1. 主应用负责整体路由

主应用管理顶层路由，微应用负责内部路由。

```javascript
// 主应用路由
const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/app1/*', // 使用通配符
    component: App1Container
  },
  {
    path: '/app2/*',
    component: App2Container
  }
];

// 微应用内部路由（Vue示例）
const app1Routes = [
  {
    path: '/',
    component: App1Home
  },
  {
    path: '/about',
    component: App1About
  }
];
```

### 2. 路由同步

确保主应用和微应用的路由状态保持同步。

```javascript
// 主应用中监听路由变化
router.beforeEach((to, from, next) => {
  // 通知微应用路由变化
  window.eventBus.emit('routeChanged', { to, from });
  next();
});

// 微应用中监听路由变化
window.eventBus.on('routeChanged', ({ to, from }) => {
  // 根据主应用路由更新微应用内部路由
  const appBasePath = '/app1';
  if (to.path.startsWith(appBasePath)) {
    const relativePath = to.path.replace(appBasePath, '');
    appRouter.push(relativePath || '/');
  }
});
```

## 构建与部署

### 1. 独立构建与部署

每个微应用都有自己的构建和部署流程，可以独立发布。

**CI/CD配置示例**：
```yaml
# .gitlab-ci.yml
stages:
  - build
  - test
  - deploy

build:
  stage: build
  script:
    - npm install
    - npm run build
  artifacts:
    paths:
      - dist/

test:
  stage: test
  script:
    - npm install
    - npm test

deploy:
  stage: deploy
  script:
    - aws s3 sync dist/ s3://my-bucket/app1/ --delete
    - aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths '/app1/*'
  only:
    - main
```

### 2. 静态资源处理

微前端应用的静态资源需要正确处理，以确保能够正确加载。

```javascript
// webpack配置
export default {
  publicPath: 'auto', // webpack 5 支持自动公共路径
  // 或者使用环境变量
  // publicPath: process.env.PUBLIC_PATH || '/'
};
```

### 3. 部署架构

常见的部署架构包括：

- **独立域名**：每个微应用使用独立的域名
- **子域名**：每个微应用使用子域名
- **路径前缀**：所有微应用共享一个域名，使用不同的路径前缀

## 性能优化

### 1. 懒加载

只在需要时加载微应用，减少初始加载时间。

```javascript
// 主应用中懒加载微应用
const App1Component = () => import('./App1Component.vue');

const routes = [
  {
    path: '/app1',
    component: App1Component
  }
];
```

### 2. 预加载

在适当时机预加载即将使用的微应用，提升用户体验。

```javascript
// 预加载微应用资源
function preloadApp(appName) {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = `/apps/${appName}/remoteEntry.js`;
  link.as = 'script';
  document.head.appendChild(link);
}

// 在主应用空闲时预加载
window.addEventListener('load', () => {
  setTimeout(() => {
    preloadApp('dashboard');
  }, 2000);
});
```

### 3. 资源共享

共享公共依赖，减少重复加载。

```javascript
// webpack ModuleFederation配置
new ModuleFederationPlugin({
  shared: {
    vue: {
      singleton: true,
      requiredVersion: '^3.0.0'
    },
    'vue-router': {
      singleton: true,
      requiredVersion: '^4.0.0'
    },
    axios: {
      singleton: true,
      requiredVersion: '^0.21.0'
    }
  }
});
```

## 安全考虑

### 1. 跨域安全

确保微应用之间的通信符合跨域安全策略。

```javascript
// 服务器CORS配置示例（Express）
const express = require('express');
const cors = require('cors');
const app = express();

// 允许特定源
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:8081']
}));
```

### 2. 沙箱隔离

使用沙箱技术隔离微应用的执行环境，防止恶意代码影响主应用。

```javascript
// Qiankun的沙箱配置
start({
  sandbox: {
    strictStyleIsolation: true, // 严格的样式隔离
    experimentalStyleIsolation: true // 实验性样式隔离
  }
});
```

### 3. 资源白名单

只加载可信的微应用资源。

```javascript
// 主应用中验证微应用来源
const trustedApps = {
  'app1': 'https://trusted-domain.com/app1',
  'app2': 'https://trusted-domain.com/app2'
};

function validateAppSource(appName, url) {
  return trustedApps[appName] === url;
}

// 在注册微应用前验证
if (validateAppSource('app1', 'https://trusted-domain.com/app1')) {
  registerApplication(/* ... */);
}
```

## 测试策略

### 1. 单元测试

对微应用内部组件进行单元测试。

```javascript
// 使用Jest测试Vue组件
describe('MyComponent', () => {
  it('should render correctly', () => {
    const wrapper = shallowMount(MyComponent);
    expect(wrapper.text()).toContain('Hello');
  });
});
```

### 2. 集成测试

测试微应用之间的交互和集成。

```javascript
// Cypress集成测试示例
describe('微应用集成', () => {
  it('should navigate between micro apps', () => {
    cy.visit('/');
    cy.contains('App 1').click();
    cy.url().should('include', '/app1');
    cy.contains('App 1 Home Page').should('exist');
  });
});
```

### 3. 端到端测试

测试整个应用的用户流程。

## 常见问题

### 1. 微前端应用之间如何共享用户状态？

**解决方案**：
- 使用OAuth 2.0或JWT进行身份验证
- 将用户信息存储在共享Cookie或localStorage中
- 使用发布-订阅模式在应用间同步用户状态

### 2. 如何处理微应用之间的依赖冲突？

**解决方案**：
- 使用Webpack Module Federation的shared配置共享公共依赖
- 为依赖设置singleton: true确保全局只有一个实例
- 使用不同的版本号或别名来隔离冲突的依赖

### 3. 如何实现微前端应用的动态加载？

**解决方案**：
- 使用动态import()语法动态加载微应用
- 使用Qiankun等框架的预加载功能
- 实现资源预缓存策略，提升加载速度

### 4. 如何保证微前端应用的性能？

**解决方案**：
- 实现微应用的懒加载和预加载
- 共享公共依赖，避免重复加载
- 优化微应用的包体积，使用代码分割
- 实现资源缓存策略

### 5. 如何处理微前端应用的路由嵌套？

**解决方案**：
- 主应用使用通配符路由匹配微应用路径
- 微应用使用相对路径进行内部路由导航
- 实现路由同步机制，确保主应用和微应用的路由状态一致

## 最佳实践

### 1. 团队组织

- 按业务领域组织团队，每个团队负责特定的微前端应用
- 建立共享的设计系统和组件库
- 制定明确的API契约和接口规范

### 2. 技术选择

- 选择成熟稳定的微前端框架
- 考虑团队的技术栈和经验
- 评估性能和可维护性要求

### 3. 监控和可观测性

- 实现统一的日志记录和错误跟踪
- 使用APM工具监控微前端应用的性能
- 建立完善的监控告警机制

### 4. 渐进式采用

- 从简单的功能开始，逐步迁移到微前端架构
- 保持现有系统稳定，避免大规模重构
- 制定明确的迁移计划和回滚策略

### 5. 文档和治理

- 建立完善的文档，包括架构设计、API规范、开发指南等
- 实施代码审查和质量控制
- 定期进行架构评审和优化