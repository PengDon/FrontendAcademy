# Nuxt.js 完全指南

Nuxt.js 是一个基于 Vue.js 的渐进式框架，用于构建现代的、高性能的 Web 应用。它提供了服务端渲染、静态站点生成、自动路由生成等强大功能，极大地简化了 Vue 应用的开发流程。

## 目录

- [Nuxt.js 简介](#nuxtjs-简介)
  - [什么是 Nuxt.js](#什么是-nuxtjs)
  - [Nuxt.js 的主要特性](#nuxtjs-的主要特性)
  - [与纯 Vue.js 的区别](#与纯-vuejs-的区别)
- [快速开始](#快速开始)
  - [安装](#安装)
  - [创建项目](#创建项目)
  - [项目结构](#项目结构)
  - [运行项目](#运行项目)
- [核心概念](#核心概念)
  - [约定优于配置](#约定优于配置)
  - [目录结构](#目录结构-1)
  - [配置文件](#配置文件)
  - [生命周期](#生命周期)
- [路由系统](#路由系统)
  - [基本路由](#基本路由)
  - [动态路由](#动态路由)
  - [嵌套路由](#嵌套路由)
  - [路由参数校验](#路由参数校验)
  - [命名视图](#命名视图)
  - [编程式导航](#编程式导航)
  - [中间件](#中间件)
- [页面组件](#页面组件)
  - [基础页面组件](#基础页面组件)
  - [页面布局](#页面布局)
  - [异步数据获取](#异步数据获取)
  - [头部配置](#头部配置)
  - [页面过渡效果](#页面过渡效果)
  - [滚动行为](#滚动行为)
- [视图组件](#视图组件)
  - [布局组件](#布局组件)
  - [组件](#组件-1)
  - [插件](#插件-1)
  - [指令](#指令)
  - [过滤器](#过滤器)
- [数据获取](#数据获取)
  - [asyncData](#asyncdata)
  - [fetch](#fetch)
  - [Vuex 状态管理](#vuex-状态管理)
  - [API 调用模式](#api-调用模式)
- [服务端渲染 (SSR)](#服务端渲染-ssr)
  - [什么是 SSR](#什么是-ssr)
  - [SSR 的优势](#ssr-的优势)
  - [SSR 工作原理](#ssr-工作原理)
  - [SSR 与 CSR](#ssr-与-csr)
  - [静态站点生成 (SSG)](#静态站点生成-ssg)
- [模块化与可扩展性](#模块化与可扩展性)
  - [模块系统](#模块系统)
  - [常用模块](#常用模块)
  - [自定义模块](#自定义模块)
- [部署与性能优化](#部署与性能优化)
  - [构建与部署](#构建与部署)
  - [性能优化技巧](#性能优化技巧)
  - [CDN 集成](#cdn-集成)
- [测试](#测试)
  - [单元测试](#单元测试)
  - [端到端测试](#端到端测试)
- [生态系统](#生态系统)
  - [官方工具](#官方工具)
  - [社区资源](#社区资源)
- [Nuxt.js 3](#nuxtjs-3)
  - [新特性](#新特性)
  - [从 Nuxt 2 迁移](#从-nuxt-2-迁移)
- [Nuxt.js 4](#nuxtjs-4)
  - [核心改进](#核心改进)
  - [主要特性](#主要特性)
  - [从 Nuxt 3 迁移](#从-nuxt-3-迁移)
- [补充资源](#补充资源)
- [常见问题与解决方案](#常见问题与解决方案)

## Nuxt.js 简介

### 什么是 Nuxt.js

Nuxt.js 是一个基于 Vue.js 的通用应用框架，它可以帮助开发者构建服务端渲染 (SSR) 应用、静态站点 (SSG)，以及单页应用 (SPA)。

### Nuxt.js 的主要特性

- **服务端渲染 (SSR)**：改善 SEO 和首屏加载性能
- **静态站点生成 (SSG)**：预渲染页面，提供静态网站体验
- **自动路由生成**：基于文件系统的路由
- **代码分割**：自动分割 JavaScript 代码
- **热重载**：开发时的热模块替换
- **强大的插件系统**：易于扩展
- **支持 PWA**：渐进式 Web 应用支持
- **Vuex 集成**：状态管理
- **ESLint 集成**：代码质量检查
- **多环境配置**：开发、测试、生产环境配置

### 与纯 Vue.js 的区别

| 特性 | Vue.js | Nuxt.js |
|------|--------|---------|
| 路由 | 需要手动配置 Vue Router | 基于文件系统自动生成 |
| 服务端渲染 | 需要额外配置 | 内置支持 |
| 静态站点生成 | 需要额外工具 | 内置支持 |
| 代码分割 | 需要手动配置 | 自动处理 |
| 项目结构 | 自由 | 约定式结构 |
| 开发体验 | 良好 | 更优，提供更多开发工具 |

## 快速开始

### 安装

确保已安装 Node.js 环境（推荐 12.x 或更高版本）：

```bash
node -v
npm -v
```

### 创建项目

使用 npx 创建 Nuxt.js 项目：

```bash
npx create-nuxt-app my-nuxt-app
```

按照提示选择配置：

- 项目名称
- 项目描述
- 作者
- 语言 (JavaScript/TypeScript)
- 包管理器 (npm/yarn/pnpm)
- UI 框架 (Element UI/BootstrapVue/Tailwind CSS 等)
- 服务端框架 (None/Express/Koa/Hapi/Fastify)
- Nuxt.js 模块 (PWA/Content 等)
- linting 工具 (ESLint/Prettier)
- 测试框架 (None/Jest/Ava)
- 渲染模式 (Universal SSR/Static Generated)

### 项目结构

创建完成后，Nuxt.js 会生成以下基本项目结构：

```
my-nuxt-app/
├── .nuxt/               # Nuxt.js 生成的文件（不要手动修改）
├── assets/              # 静态资源（SCSS、LESS、图片等）
├── components/          # Vue 组件
├── layouts/             # 布局组件
├── middleware/          # 中间件
├── pages/               # 页面组件（自动生成路由）
├── plugins/             # 插件
├── static/              # 静态文件（不会被 webpack 处理）
├── store/               # Vuex 状态管理
├── nuxt.config.js       # Nuxt.js 配置
├── package.json         # 项目依赖
└── README.md            # 项目说明
```

### 运行项目

进入项目目录并启动开发服务器：

```bash
cd my-nuxt-app
npm run dev
```

打开浏览器访问 http://localhost:3000

## 核心概念

### 约定优于配置

Nuxt.js 遵循"约定优于配置"的原则，通过特定目录结构和命名约定来自动配置许多功能，减少手动配置工作。

### 目录结构

以下是 Nuxt.js 项目的核心目录说明：

- **assets/**：存放未经处理的静态资源（SASS、LESS、JavaScript、图片等）
- **components/**：存放可复用的 Vue 组件
- **layouts/**：存放应用布局组件
- **middleware/**：存放全局或页面级中间件
- **pages/**：存放页面组件，Nuxt.js 会根据文件结构自动生成路由
- **plugins/**：存放 Vue 插件
- **static/**：存放静态文件，这些文件不会被 webpack 处理
- **store/**：存放 Vuex 状态管理模块

### 配置文件

Nuxt.js 使用 `nuxt.config.js` 作为配置文件：

```javascript
// nuxt.config.js
export default {
  // 应用基本配置
  head: {
    title: 'My Nuxt App',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'My Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  
  // CSS 配置
  css: [
    '~/assets/main.scss'
  ],
  
  // 插件配置
  plugins: [
    '~/plugins/vue-awesome.js'
  ],
  
  // 构建配置
  build: {
    extend(config, ctx) {
      // 自定义 webpack 配置
    }
  },
  
  // 模块配置
  modules: [
    '@nuxtjs/axios'
  ],
  
  // 服务器配置
  server: {
    port: 8000,
    host: '0.0.0.0'
  }
}
```

### 生命周期

Nuxt.js 应用有两个主要的执行上下文：服务器端和客户端。它扩展了 Vue.js 的生命周期，提供了一些额外的钩子函数。

**服务器端生命周期**：

1. **nuxtServerInit**：Vuex 存储初始化
2. **middleware**：全局、布局、页面中间件
3. **validate**：路由参数验证
4. **asyncData**：组件数据获取
5. **fetch**：组件数据获取（替代 asyncData）

**客户端生命周期**：

1. **beforeCreate**：组件创建前
2. **created**：组件创建后
3. **beforeMount**：组件挂载前
4. **mounted**：组件挂载后
5. **beforeUpdate**：组件更新前
6. **updated**：组件更新后
7. **beforeDestroy**：组件销毁前
8. **destroyed**：组件销毁后

## 路由系统

### 基本路由

Nuxt.js 会根据 `pages/` 目录的文件结构自动生成路由配置。

例如，以下目录结构：

```
pages/
├── index.vue
├── about.vue
└── users/
    ├── index.vue
    └── detail.vue
```

会自动生成以下路由配置：

```javascript
[
  {
    path: '/',
    component: 'pages/index.vue'
  },
  {
    path: '/about',
    component: 'pages/about.vue'
  },
  {
    path: '/users',
    component: 'pages/users/index.vue'
  },
  {
    path: '/users/detail',
    component: 'pages/users/detail.vue'
  }
]
```

### 动态路由

在文件名前添加下划线可以创建动态路由：

```
pages/
├── users/
    └── _id.vue
```

会生成以下路由配置：

```javascript
[
  {
    path: '/users/:id',
    component: 'pages/users/_id.vue'
  }
]
```

在组件中可以通过 `this.$route.params.id` 或在 `asyncData` 中通过 `params.id` 访问参数：

```vue
<template>
  <div>
    <h1>User: {{ user.name }}</h1>
  </div>
</template>

<script>
export default {
  asyncData({ params }) {
    // 从 API 获取用户数据
    return { user: { id: params.id, name: `User ${params.id}` } }
  }
}
</script>
```

### 嵌套路由

创建与目录同名的 Vue 文件和 `_slug.vue` 文件可以实现嵌套路由：

```
pages/
├── users/
    ├── _id.vue
    └── index.vue
└── users.vue
```

`users.vue` 中需要包含 `<nuxt-child />` 组件：

```vue
<template>
  <div>
    <h1>Users</h1>
    <nuxt-child />
  </div>
</template>
```

这样，访问 `/users` 时显示 `users/index.vue` 的内容，访问 `/users/123` 时显示 `users/_id.vue` 的内容。

### 路由参数校验

可以在页面组件中定义 `validate` 方法来验证路由参数：

```vue
<script>
export default {
  validate({ params }) {
    // 必须是数字
    return /^\d+$/.test(params.id)
  }
}
</script>
```

如果验证失败，Nuxt.js 会自动加载 404 页面。

### 命名视图

Nuxt.js 支持命名视图，可以在同一路由中显示多个视图：

```vue
<template>
  <nuxt name="sidebar" />
  <nuxt name="content" />
</template>
```

### 编程式导航

使用 `this.$router` 进行编程式导航：

```javascript
// 导航到指定路径
this.$router.push('/about')

// 带参数的导航
this.$router.push({
  path: '/users',
  query: { page: 1 }
})

// 带参数的命名路由
this.$router.push({
  name: 'users-id',
  params: { id: 123 }
})

// 后退
this.$router.back()

// 前进
this.$router.forward()
```

### 中间件

中间件允许你在页面渲染前执行自定义逻辑：

1. **全局中间件**：在 `nuxt.config.js` 中配置

```javascript
// nuxt.config.js
export default {
  router: {
    middleware: 'auth'
  }
}
```

2. **布局中间件**：在布局组件中定义

```vue
<script>
export default {
  middleware: 'auth'
}
</script>
```

3. **页面中间件**：在页面组件中定义

```vue
<script>
export default {
  middleware: 'auth'
}
</script>
```

中间件文件示例：

```javascript
// middleware/auth.js
export default function ({ store, redirect }) {
  // 检查用户是否已登录
  if (!store.state.auth.loggedIn) {
    return redirect('/login')
  }
}
```

## 页面组件

### 基础页面组件

页面组件是 Nuxt.js 应用的核心，位于 `pages/` 目录下。

```vue
<template>
  <div>
    <h1>About Page</h1>
    <p>This is the about page content.</p>
  </div>
</template>

<script>
export default {
  // 组件名称
  name: 'AboutPage',
  
  // 组件数据
  data() {
    return {
      message: 'Hello from Nuxt.js'
    }
  }
}
</script>

<style>
h1 {
  color: #333;
}
</style>
```

### 页面布局

Nuxt.js 使用布局来定义页面的结构。默认布局位于 `layouts/default.vue`：

```vue
<template>
  <div>
    <header>
      <nuxt-link to="/">Home</nuxt-link>
      <nuxt-link to="/about">About</nuxt-link>
    </header>
    
    <main>
      <nuxt />
    </main>
    
    <footer>
      © 2023 My Nuxt App
    </footer>
  </div>
</template>
```

在页面组件中可以指定使用的布局：

```vue
<script>
export default {
  layout: 'custom'
}
</script>
```

### 异步数据获取

Nuxt.js 提供了 `asyncData` 方法来在组件渲染前获取数据：

```vue
<template>
  <div>
    <h1>{{ title }}</h1>
    <ul>
      <li v-for="post in posts" :key="post.id">{{ post.title }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  async asyncData({ $axios }) {
    // 使用 $axios 获取数据
    const { data } = await $axios.get('https://api.example.com/posts')
    return {
      posts: data,
      title: 'Posts List'
    }
  }
}
</script>
```

**注意**：`asyncData` 在服务端或静态生成期间执行，它不能访问组件实例（即 `this`）。

### 头部配置

可以在页面组件中配置 `head` 选项来设置页面的 meta 信息：

```vue
<script>
export default {
  head() {
    return {
      title: 'About Us',
      meta: [
        { hid: 'description', name: 'description', content: 'About our company' }
      ]
    }
  }
}
</script>
```

使用 `hid` 属性可以避免重复的 meta 标签。

### 页面过渡效果

可以为页面设置过渡效果：

```vue
<script>
export default {
  transition: 'fade'
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
```

也可以在 `nuxt.config.js` 中全局配置：

```javascript
export default {
  transition: {
    name: 'fade',
    mode: 'out-in'
  }
}
```

### 滚动行为

可以在 `nuxt.config.js` 中配置路由滚动行为：

```javascript
export default {
  router: {
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      } else {
        return { x: 0, y: 0 }
      }
    }
  }
}
```

## 视图组件

### 布局组件

布局组件定义应用的基本结构，位于 `layouts/` 目录下：

```vue
<template>
  <div class="layout">
    <header>
      <!-- 头部内容 -->
    </header>
    
    <main>
      <!-- 渲染页面内容 -->
      <nuxt />
    </main>
    
    <footer>
      <!-- 底部内容 -->
    </footer>
  </div>
</template>

<script>
export default {
  // 布局名称
  name: 'DefaultLayout'
}
</script>
```

### 组件

可复用组件存放在 `components/` 目录下：

``vue
<!-- components/Button.vue -->
<template>
  <button class="btn" :class="variant" @click="$emit('click')">
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    variant: {
      type: String,
      default: 'default'
    }
  }
}
</script>

<style scoped>
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.default {
  background-color: #007bff;
  color: white;
}
</style>
```

### 插件

插件用于扩展 Vue.js 功能，存放在 `plugins/` 目录下：

```javascript
// plugins/vue-toast.js
import Vue from 'vue'
import VueToast from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-default.css'

Vue.use(VueToast)
```

在 `nuxt.config.js` 中注册插件：

```javascript
export default {
  plugins: ['~/plugins/vue-toast.js']
}
```

### 指令

自定义指令可以放在 `plugins/` 目录下：

```javascript
// plugins/directives.js
import Vue from 'vue'

// 注册自定义指令
Vue.directive('focus', {
  inserted(el) {
    el.focus()
  }
})
```

### 过滤器

在 Nuxt.js 中，可以在 `plugins/` 目录下定义全局过滤器：

```javascript
// plugins/filters.js
import Vue from 'vue'

Vue.filter('uppercase', value => {
  return value.toUpperCase()
})

Vue.filter('truncate', (value, length = 100) => {
  if (value.length <= length) return value
  return value.substring(0, length) + '...'
})
```

## 数据获取

### asyncData

`asyncData` 方法在组件渲染前获取数据，可以在服务端或客户端执行：

```vue
<script>
export default {
  async asyncData({ params, $axios }) {
    const { data } = await $axios.get(`https://api.example.com/posts/${params.id}`)
    return { post: data }
  }
}
</script>
```

### fetch

`fetch` 方法用于填充 Vuex 存储或组件数据：

```vue
<script>
export default {
  async fetch({ store, params }) {
    await store.dispatch('posts/loadPost', params.id)
  },
  computed: {
    post() {
      return this.$store.state.posts.currentPost
    }
  }
}
</script>
```

### Vuex 状态管理

Nuxt.js 内置了 Vuex 集成，在 `store/` 目录下创建模块：

```javascript
// store/index.js
export const state = () => ({
  counter: 0
})

export const mutations = {
  increment(state) {
    state.counter++
  }
}

export const actions = {
  async nuxtServerInit({ commit }, { req }) {
    // 在服务端初始化时执行
  }
}
```

### API 调用模式

使用 `@nuxtjs/axios` 模块进行 API 调用：

```javascript
// nuxt.config.js
export default {
  modules: [
    '@nuxtjs/axios'
  ],
  axios: {
    baseURL: 'https://api.example.com'
  }
}
```

在组件中使用：

```vue
<script>
export default {
  async asyncData({ $axios }) {
    const { data } = await $axios.get('/posts')
    return { posts: data }
  }
}
</script>
```

## 服务端渲染 (SSR)

### 什么是 SSR

服务端渲染 (Server-Side Rendering) 是指在服务器端生成 HTML，然后将完整的页面发送到客户端。

### SSR 的优势

- **更好的 SEO**：搜索引擎可以更容易地爬取内容
- **更快的首屏加载**：用户不需要等待 JavaScript 完全加载和执行
- **更好的用户体验**：减少白屏时间
- **支持不启用 JavaScript 的浏览器**：虽然现在很少见，但仍有用户关闭 JavaScript

### SSR 工作原理

1. 用户访问页面
2. 服务器接收请求
3. 服务器执行 Nuxt.js 应用，获取数据
4. 服务器渲染 HTML
5. 将完整的 HTML 发送到客户端
6. 客户端接管页面，变为交互式应用

### SSR 与 CSR

| 特性 | 服务端渲染 (SSR) | 客户端渲染 (CSR) |
|------|------------------|------------------|
| 初始加载 | 较慢（服务器渲染） | 较快（只下载 JavaScript） |
| 内容显示 | 立即显示内容 | 需等待 JavaScript 执行 |
| SEO | 良好 | 较差（需要额外配置） |
| 服务器负载 | 较高 | 较低 |
| 开发复杂度 | 较高 | 较低 |

### 静态站点生成 (SSG)

Nuxt.js 支持静态站点生成，预渲染所有页面为静态 HTML 文件：

```bash
npm run generate
```

生成的文件位于 `dist/` 目录，可以部署到任何静态文件服务器。

## 模块化与可扩展性

### 模块系统

Nuxt.js 的模块系统允许你扩展和定制应用功能。模块可以修改默认配置、添加新功能或集成第三方库。

### 常用模块

- **@nuxtjs/axios**：Axios 集成
- **@nuxtjs/pwa**：PWA 支持
- **@nuxtjs/vuetify**：Vuetify UI 框架集成
- **@nuxtjs/strapi**：Strapi CMS 集成
- **@nuxtjs/auth**：认证支持
- **@nuxtjs/i18n**：国际化支持
- **@nuxtjs/robots**：robots.txt 生成
- **@nuxtjs/sitemap**：站点地图生成

### 自定义模块

可以创建自定义模块来扩展 Nuxt.js 功能：

```javascript
// modules/custom-module.js
module.exports = function (moduleOptions) {
  // 合并默认选项和用户选项
  const options = {
    ...this.options['custom-module'],
    ...moduleOptions
  }
  
  // 添加插件
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    options
  })
}

// 模块元数据
module.exports.meta = require('./package.json')
```

注册自定义模块：

```javascript
// nuxt.config.js
export default {
  modules: [
    // 使用相对路径
    './modules/custom-module',
    
    // 带选项
    ['./modules/custom-module', {
      option1: 'value1'
    }]
  ]
}
```

## 部署与性能优化

### 构建与部署

**服务端渲染模式**：

```bash
# 构建应用
npm run build

# 启动应用
npm start
```

**静态站点模式**：

```bash
# 生成静态文件
npm run generate

# 将 dist/ 目录部署到静态文件服务器
```

### 性能优化技巧

1. **组件懒加载**：

```vue
<script>
export default {
  components: {
    HeavyComponent: () => import('~/components/HeavyComponent.vue')
  }
}
</script>
```

2. **图片优化**：
   - 使用适当的图片格式
   - 压缩图片
   - 懒加载图片

3. **减少包体积**：
   - 避免不必要的依赖
   - 按需加载第三方库

4. **缓存策略**：
   - 利用浏览器缓存
   - 使用 CDN 缓存

5. **优化渲染性能**：
   - 使用 `v-once` 和 `v-memo`
   - 避免不必要的重渲染
   - 使用虚拟滚动处理长列表

### CDN 集成

配置 CDN 以提高静态资源加载速度：

```javascript
// nuxt.config.js
export default {
  build: {
    publicPath: 'https://cdn.example.com'
  }
}
```

## 测试

### 单元测试

Nuxt.js 项目可以使用 Jest 进行单元测试：

```bash
# 运行测试
npm run test
```

测试文件示例：

```javascript
// test/Logo.spec.js
import { mount } from '@vue/test-utils'
import Logo from '@/components/Logo.vue'

describe('Logo.vue', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(Logo)
    expect(wrapper.vm).toBeTruthy()
  })
})
```

### 端到端测试

可以使用 Cypress 进行端到端测试：

```bash
# 运行 Cypress
npm run test:e2e
```

测试文件示例：

```
// cypress/integration/home.spec.js
describe('Home Page', () => {
  it('should display home page', () => {
    cy.visit('/')
    cy.contains('Welcome to Nuxt.js')
  })
})
```

## 生态系统

### 官方工具

- **Nuxt CLI**：创建和管理 Nuxt.js 项目
- **Nuxt DevTools**：浏览器开发工具扩展
- **Nuxt Content**：基于文件的内容管理系统

### 社区资源

- **Nuxt.js 官方文档**：https://nuxtjs.org/
- **Nuxt.js 社区**：https://nuxtjs.org/community/
- **Nuxt.js 模块目录**：https://modules.nuxtjs.org/
- **Nuxt.js GitHub 仓库**：https://github.com/nuxt/nuxt.js

## Nuxt.js 3

### 新特性

- **Nitro 引擎**：基于 Vite 的新一代构建工具
- **Composition API**：完全支持 Vue 3 的组合式 API
- **自动导入**：自动导入 Vue 组件和辅助函数
- **文件系统路由增强**：支持嵌套路由、路由中间件等
- **类型安全**：更好的 TypeScript 支持
- **构建优化**：更小的包体积和更快的构建速度
- **服务端引擎优化**：支持更多部署平台

### 从 Nuxt 2 迁移

Nuxt.js 3 提供了从 Nuxt 2 迁移的指南：

1. 检查依赖兼容性
2. 更新配置文件
3. 迁移组件和布局
4. 迁移数据获取方法
5. 更新 Vuex 到 Pinia（推荐）或兼容的 Vuex 版本

## Nuxt.js 4

### 核心改进

Nuxt.js 4 是 Nuxt.js 的最新版本，于2025年7月发布。它在 Nuxt.js 3 的基础上进行了全面升级，引入了多项核心改进：

- **增强的 Nitro 引擎**：提供更快的渲染速度和更好的性能优化
- **智能类型系统**：自动生成类型声明，提升开发体验和代码质量
- **响应式数据层**：统一的数据管理和智能缓存策略
- **模块化架构优化**：更灵活、更可扩展的架构设计
- **新的 Composable API**：优化的组合式函数，简化开发流程

### 主要特性

- **自动批处理**：智能合并状态更新，减少不必要的渲染
- **智能路由系统**：增强的路由检测和预加载策略
- **改进的服务器功能**：更强大、更灵活的服务器 API
- **优化的构建系统**：更小的 bundle 体积和更快的构建速度
- **智能组件检测**：增强的组件自动导入功能

### 从 Nuxt 3 迁移

从 Nuxt 3 迁移到 Nuxt 4 相对简单，主要步骤包括：

1. 使用官方提供的升级命令：`npx nuxi@latest upgrade --force`
2. 安装推荐的模块，如图标模块：`npx nuxi module add icon`
3. 更新配置文件，启用新的优化选项
4. 适配新的 API 优化和自动批处理功能

## 补充资源

为了更好地学习和掌握 Nuxt.js，我们还提供了以下专题文档：

- [结构优化方案](./STRUCTURE_OPTIMIZATION.md) - 详细介绍 Nuxt.js 知识体系的组织结构
- [核心概念详解](./core-concepts.md) - 深入解析 Nuxt.js 的核心概念和工作机制
- [最佳实践指南](./best-practices.md) - 提供项目开发中的最佳实践和经验总结
- [性能优化指南](./performance.md) - 详细说明如何优化 Nuxt.js 应用的性能
- [第三方库集成](./integrations.md) - 指导如何将常用第三方库集成到 Nuxt.js 项目中
- [面试重点内容](./interview.md) - 整理 Nuxt.js 相关的面试高频问题和答案

这些文档将帮助您更全面地理解和掌握 Nuxt.js 的各个方面，无论是初学者还是有经验的开发者都能从中受益。

## 常见问题与解决方案

### 1. 服务端和客户端环境差异

**问题**：在服务端渲染时无法访问浏览器 API

**解决方案**：
- 使用 `process.client` 检查是否在客户端
- 在 `mounted` 钩子中访问浏览器 API

```
if (process.client) {
  // 访问浏览器 API
  window.scrollTo(0, 0)
}
```

### 2. 路由参数变化时数据不更新

**问题**：在动态路由中，路由参数变化时数据不重新获取

**解决方案**：
- 使用 `watch` 监听路由参数变化
- 使用 `beforeRouteUpdate` 导航守卫

```
export default {
  watch: {
    '$route.params.id'() {
      // 重新获取数据
      this.$nuxt.refresh()
    }
  }
}
```

### 3. 样式未应用

**问题**：组件样式未正确应用

**解决方案**：
- 确保样式文件在 `nuxt.config.js` 中正确配置
- 检查 CSS 类名是否正确
- 使用 `scoped` 样式时注意选择器优先级

### 4. 内存泄漏

**问题**：长时间运行的 Nuxt.js 应用出现内存泄漏

**解决方案**：
- 清理定时器和事件监听器
- 避免不必要的全局状态
- 使用适当的组件生命周期钩子

```
export default {
  mounted() {
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    handleResize() {
      // 处理窗口大小变化
    }
  }
}
```

### 5. 构建错误

**问题**：构建过程中出现错误

**解决方案**：
- 检查依赖版本兼容性
- 检查 TypeScript 类型错误
- 检查 webpack 配置
- 检查组件和模板语法错误

## 总结

Nuxt.js 是一个功能强大、易于使用的框架，为 Vue.js 应用提供了服务端渲染、静态站点生成等高级功能。它通过约定优于配置的原则，大幅简化了应用开发流程，提高了开发效率。

本指南涵盖了 Nuxt.js 的核心概念、路由系统、组件开发、数据获取、部署优化等各个方面，希望能够帮助你更好地理解和使用 Nuxt.js 构建现代化的 Web 应用。

通过掌握 Nuxt.js，你将能够构建出性能优异、SEO 友好的 Web 应用，为用户提供更好的体验。