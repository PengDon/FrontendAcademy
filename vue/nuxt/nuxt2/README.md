# Nuxt.js 2.x 框架

## Nuxt.js 简介

Nuxt.js 是一个基于 Vue.js 的服务端渲染应用框架，它提供了许多开箱即用的功能，使开发者能够更快速地构建同构应用。

## 目录

- [Nuxt.js 简介](#nuxtjs-简介)
- [核心特性](#核心特性)
- [安装与环境配置](#安装与环境配置)
- [目录结构](#目录结构)
- [核心概念](#核心概念)
  - [路由系统](#路由系统)
  - [数据获取](#数据获取)
  - [布局](#布局)
  - [中间件](#中间件)
  - [插件](#插件)
  - [状态管理](#状态管理)
- [配置文件](#配置文件)
- [开发与部署](#开发与部署)
- [版本对比](#版本对比)

## 核心特性

- **服务端渲染 (SSR)**：提高首屏加载速度和 SEO
- **静态站点生成 (SSG)**：预渲染页面，部署到任何静态服务器
- **自动代码分割**：优化页面加载性能
- **路由系统**：基于文件系统的路由
- **Vuex 集成**：状态管理
- **中间件支持**：全局、布局和页面级中间件
- **热模块替换**：开发时的实时预览
- **ESLint 集成**：代码质量检查

## 安装与环境配置

### 创建新的 Nuxt.js 项目

```bash
# 使用 npx 创建新项目
npx create-nuxt-app my-nuxt-app

# 按照提示选择配置选项
# - 选择服务器框架：Express、Koa、Hapi 或 None
# - 选择 UI 框架：Bootstrap、Vuetify、Bulma 等
# - 选择测试框架：Jest、AVA 等
# - 选择 ESLint 配置
# - 选择 Prettier 配置
# - 选择 Axios：用于 HTTP 请求
# - 选择 PWA 支持
# - 选择 TypeScript 支持
# - 选择分析工具
```

### 手动安装

```bash
# 安装 Nuxt.js
npm install nuxt

# 或使用 yarn
yarn add nuxt
```

在 `package.json` 中添加脚本：

```json
{
  "scripts": {
    "dev": "nuxt",
    "build": "nuxt build",
    "start": "nuxt start",
    "generate": "nuxt generate"
  }
}
```

## 目录结构

Nuxt.js 遵循约定优于配置的原则，有一套标准的目录结构：

```
my-nuxt-app/
├── assets/          # 未编译的资源文件（样式、图片等）
├── components/      # Vue 组件
├── layouts/         # 布局组件
├── middleware/      # 中间件
├── pages/           # 页面组件（自动生成路由）
├── plugins/         # 插件
├── static/          # 静态文件（直接映射到根路径）
├── store/           # Vuex 状态管理
├── nuxt.config.js   # Nuxt 配置文件
└── package.json     # 项目依赖
```

## 核心概念

### 路由系统

Nuxt.js 基于文件系统的路由：

```
pages/
├── index.vue        # 根路径 /
├── about.vue        # /about
├── users/
│   ├── index.vue    # /users
│   └── _id.vue      # /users/:id
└── _.vue            # 匹配所有未定义路由
```

#### 基本路由

- `pages/index.vue` → `/`
- `pages/about.vue` → `/about`
- `pages/users/index.vue` → `/users`
- `pages/users/_id.vue` → `/users/:id`（动态路由）

#### 嵌套路由

创建与目录同名的 Vue 文件：

```
pages/
├── users/
│   ├── _id.vue
│   └── index.vue
└── users.vue
```

`pages/users.vue` 内容：

```vue
<template>
  <div>
    <h1>用户列表</h1>
    <NuxtChild />
  </div>
</template>
```

#### 动态路由

使用下划线前缀命名文件：

- `pages/users/_id.vue` → `/users/:id`

在组件中访问动态参数：

```vue
<script>
export default {
  async asyncData({ params }) {
    // params.id 可访问路由参数
    return {
      userId: params.id
    }
  }
}
</script>
```

### 页面组件

页面组件位于 `pages/` 目录，可以包含以下特殊函数和属性：

#### asyncData

在组件实例化之前获取数据，用于服务端渲染：

```vue
<script>
export default {
  async asyncData({ app, store, route, params, query, env, isDev, isServer, isClient, redirect, error }) {
    // 异步获取数据
    const { data } = await app.$axios.get('/api/posts')
    
    // 返回的数据会合并到组件的 data 中
    return {
      posts: data
    }
  }
}
</script>
```

#### fetch

用于在组件实例化后获取数据，可以在客户端和服务端运行：

```vue
<script>
export default {
  data() {
    return {
      posts: []
    }
  },
  async fetch() {
    // this 可访问组件实例
    this.posts = await this.$axios.$get('/api/posts')
  }
}
</script>
```

#### head

配置页面的元信息：

```vue
<script>
export default {
  head() {
    return {
      title: '页面标题',
      meta: [
        { hid: 'description', name: 'description', content: '页面描述' }
      ]
    }
  }
}
</script>
```

### 布局

使用 Vuex 进行状态管理：

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
  async incrementAsync({ commit }) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    commit('increment')
  }
}
```

在组件中使用：

```vue
<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState(['counter'])
  },
  methods: {
    ...mapActions(['incrementAsync'])
  }
}
</script>
```

#### 默认布局

`layouts/default.vue`：

```vue
<template>
  <div class="layout">
    <header>
      <!-- 头部内容 -->
    </header>
    <main>
      <Nuxt />
    </main>
    <footer>
      <!-- 底部内容 -->
    </footer>
  </div>
</template>
```

#### 自定义布局

创建 `layouts/custom.vue`，然后在页面中指定使用：

```vue
<script>
export default {
  layout: 'custom'
}
</script>
```

### 中间件

中间件在页面渲染前执行：

```javascript
// middleware/auth.js
export default function ({ store, redirect }) {
  if (!store.state.authenticated) {
    return redirect('/login')
  }
}
```

在页面中使用：

```vue
<script>
export default {
  middleware: 'auth'
}
</script>
```

#### 定义中间件

`middleware/auth.js`：

```javascript
export default function({ store, redirect }) {
  // 检查用户是否已登录
  if (!store.state.user) {
    return redirect('/login')
  }
}
```

#### 使用中间件

在页面中使用：

```vue
<script>
export default {
  middleware: 'auth'
}
</script>
```

在全局配置中使用：

```javascript
// nuxt.config.js
export default {
  router: {
    middleware: 'auth'
  }
}
```

### 插件

插件在 Vue 应用实例化前运行：

```javascript
// plugins/my-plugin.js
export default ({ app }, inject) => {
  inject('myFunction', () => {
    console.log('这是我的插件函数')
  })
}
```

在 nuxt.config.js 中注册：

```javascript
export default {
  plugins: ['~/plugins/my-plugin.js']
}
```

#### 定义插件

`plugins/axios.js`：

```javascript
export default function({ $axios, store }) {
  // 添加请求拦截器
  $axios.onRequest(config => {
    // 可以在这里添加 token 等认证信息
    if (store.state.token) {
      config.headers.common['Authorization'] = `Bearer ${store.state.token}`
    }
    return config
  })
  
  // 添加响应拦截器
  $axios.onError(error => {
    // 处理错误
    return Promise.reject(error)
  })
}
```

#### 注册插件

```javascript
// nuxt.config.js
export default {
  plugins: [
    '~/plugins/axios.js'
  ]
}
```

### 状态管理

#### 基本用法

`store/index.js`：

```javascript
export const state = () => ({
  user: null,
  token: null
})

export const mutations = {
  setUser(state, user) {
    state.user = user
  },
  setToken(state, token) {
    state.token = token
  },
  logout(state) {
    state.user = null
    state.token = null
  }
}

export const actions = {
  async login({ commit }, credentials) {
    const { data } = await this.$axios.post('/api/login', credentials)
    commit('setToken', data.token)
    commit('setUser', data.user)
  },
  logout({ commit }) {
    commit('logout')
  }
}

export const getters = {
  isAuthenticated: state => !!state.token,
  user: state => state.user
}
```

#### 模块

`store/user.js`：

```javascript
export const state = () => ({
  profile: null,
  posts: []
})

export const mutations = {
  setProfile(state, profile) {
    state.profile = profile
  },
  setPosts(state, posts) {
    state.posts = posts
  }
}

export const actions = {
  async fetchProfile({ commit }, userId) {
    const { data } = await this.$axios.get(`/api/users/${userId}`)
    commit('setProfile', data)
  }
}
```

## 配置文件

`nuxt.config.js` 是 Nuxt.js 的主要配置文件：

```javascript
export default {
  // 应用基本配置
  head: {
    title: '我的 Nuxt.js 应用',
    htmlAttrs: {
      lang: 'zh-CN'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js 应用描述' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // CSS 配置
  css: [
    '@/assets/css/main.css'
  ],

  // 插件配置
  plugins: [
    '@/plugins/axios.js'
  ],

  // 加载器配置
  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/stylelint-module'
  ],

  // 模块配置
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth'
  ],

  // Axios 配置
  axios: {
    baseURL: 'https://api.example.com'
  },

  // 构建配置
  build: {
    extend(config, ctx) {
      // 自定义构建配置
    }
  },

  // 服务器配置
  server: {
    port: 3000,
    host: '0.0.0.0'
  }
}
```

## 配置文件

```javascript
export default {
  // 应用基本配置
  head: {
    title: '我的 Nuxt.js 应用',
    htmlAttrs: {
      lang: 'zh-CN'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js 应用描述' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // CSS 配置
  css: [
    '@/assets/css/main.css'
  ],

  // 插件配置
  plugins: [
    '@/plugins/axios.js'
  ],

  // 加载器配置
  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/stylelint-module'
  ],

  // 模块配置
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth'
  ],

  // Axios 配置
  axios: {
    baseURL: 'https://api.example.com'
  },

  // 构建配置
  build: {
    extend(config, ctx) {
      // 自定义构建配置
    }
  },

  // 服务器配置
  server: {
    port: 3000,
    host: '0.0.0.0'
  }
}
```

## 开发与部署

### 服务端渲染部署

```bash
# 构建应用
npm run build

# 启动应用
npm start
```

### 静态站点生成

```bash
# 生成静态站点
npm run generate
```

## 版本对比

有关 Nuxt 2 与其他版本的详细对比，请参阅 [版本对比文档](./comparison.md)。

通过这些文档，您可以全面了解 Nuxt.js 2.x 的特性和使用方法，并了解它与其他版本的差异。