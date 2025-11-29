# Nuxt.js 3.x 框架

## Nuxt.js 3 简介

Nuxt.js 3 是基于 Vue 3 的新一代全栈框架，提供了从前端到后端的完整解决方案。它在 Nuxt.js 2 的基础上进行了全面重构，引入了 Vue 3 的最新特性，并提供了更快的开发体验和更好的性能。

## 目录

- [Nuxt.js 3 简介](#nuxtjs-3-简介)
- [核心特性](#核心特性)
- [安装与环境配置](#安装与环境配置)
- [新的目录结构](#新的目录结构)
- [核心概念](#核心概念)
- [路由系统](#路由系统)
- [数据获取](#数据获取)
- [服务器功能](#服务器功能)
- [状态管理](#状态管理)
- [布局](#布局)
- [配置文件](#配置文件)
- [开发与部署](#开发与部署)
- [版本对比](#版本对比)

## 核心特性

- **Vue 3 集成**：完全支持 Vue 3 的组合式 API、Teleport、Suspense 等新特性
- **Vite 构建工具**：更快的开发服务器启动时间和热模块替换
- **自动导入**：自动导入组件、组合式函数和工具函数
- **Nitro 引擎**：新一代服务端渲染引擎，支持多种部署模式
- **TypeScript 优先**：更好的类型支持
- **Layers 架构**：支持代码共享和模块化开发
- **新的服务器功能**：API 路由、中间件、服务端事件
- **优化的构建大小**：更小的 bundle 体积
- **现代浏览器兼容性**：针对现代浏览器优化的代码

## 安装与环境配置

### 创建新的 Nuxt.js 3 项目

```bash
# 使用 npx 创建新项目
npx nuxi init my-nuxt3-app

# 进入项目目录
cd my-nuxt3-app

# 安装依赖
npm install
# 或使用 yarn
yarn install
```

### 手动安装

```bash
# 手动初始化项目
mkdir my-nuxt3-app
cd my-nuxt3-app
npm init -y

# 安装 Nuxt.js 3
npm install nuxt
# 或使用 yarn
yarn add nuxt
```

在 `package.json` 中添加脚本：

```json
{
  "private": true,
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "start": "nuxt preview",
    "generate": "nuxt generate"
  },
  "devDependencies": {
    "nuxt": "^3.0.0"
  }
}
```

## 新的目录结构

Nuxt 3 采用了更清晰的目录结构：

```
my-nuxt3-app/
├── .nuxt/          # 开发时的构建目录
├── app/            # 应用目录（Nuxt 3 新增）
│   ├── components/ # 组件目录
│   ├── composables/ # 组合式函数（Nuxt 3 新增）
│   ├── pages/      # 页面组件（路由）
│   ├── layouts/    # 页面布局
│   └── plugins/    # Vue 插件
├── public/         # 静态资源（直接复制）
├── server/         # 服务端目录（Nuxt 3 新增）
│   ├── api/        # API 路由
│   ├── middleware/ # 服务端中间件
│   └── routes/     # 服务端路由
├── nuxt.config.ts  # Nuxt.js 配置文件（TypeScript）
├── package.json    # 项目依赖
└── tsconfig.json   # TypeScript 配置
```

## 核心概念

### 应用结构

Nuxt.js 3 引入了新的 `app/` 目录，用于组织应用的核心代码：

#### app/components/

放置 Vue 组件，Nuxt 3 会自动导入这些组件，无需手动注册：

```vue
<!-- app/components/HelloWorld.vue -->
<template>
  <div>Hello {{ name }}!</div>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string
}>()
</script>
```

在页面中直接使用，无需导入：

```vue
<!-- app/pages/index.vue -->
<template>
  <div>
    <h1>首页</h1>
    <HelloWorld name="Nuxt 3" />
  </div>
</template>
```

#### app/composables/

放置可复用的组合式函数，Nuxt 3 会自动导入这些函数：

```typescript
// app/composables/useCounter.ts
export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  const increment = () => count.value++
  const decrement = () => count.value--
  
  return {
    count,
    increment,
    decrement
  }
}
```

在组件中直接使用，无需导入：

```vue
<script setup lang="ts">
const { count, increment, decrement } = useCounter()
</script>
```

#### app/pages/

定义页面组件，Nuxt 3 会根据文件结构自动生成路由：

```
app/pages/
├── index.vue          # /
├── about.vue          # /about
└── users/
    ├── index.vue      # /users
    └── [id].vue       # /users/:id（动态路由）
```

### 路由系统

Nuxt 3 的路由系统基于 Vue Router 4，支持以下特性：

#### 动态路由

使用中括号语法定义动态路由：

```vue
<!-- app/pages/users/[id].vue -->
<template>
  <div>
    <h1>用户详情</h1>
    <p>用户 ID: {{ route.params.id }}</p>
  </div>
</template>

<script setup lang="ts">
// 自动导入的路由对象
const route = useRoute()
</script>
```

#### 嵌套路由

创建与目录同名的 Vue 文件，并使用 `<NuxtPage />` 组件：

```vue
<!-- app/pages/users.vue -->
<template>
  <div>
    <h1>用户管理</h1>
    <NuxtPage />
  </div>
</template>
```

#### 导航

使用 `<NuxtLink>` 组件进行路由导航：

```vue
<template>
  <nav>
    <NuxtLink to="/">首页</NuxtLink>
    <NuxtLink to="/about">关于我们</NuxtLink>
    <NuxtLink to="/users/1">用户 1</NuxtLink>
  </nav>
</template>
```

### 数据获取

Nuxt 3 提供了多种数据获取方法：

#### useFetch

自动处理请求状态、错误和响应：

```vue
<script setup lang="ts">
const { data, pending, error, refresh } = await useFetch('/api/users')
</script>

<template>
  <div>
    <div v-if="pending">加载中...</div>
    <div v-else-if="error">错误: {{ error.message }}</div>
    <div v-else-if="data">
      <ul>
        <li v-for="user in data" :key="user.id">{{ user.name }}</li>
      </ul>
    </div>
    <button @click="refresh">刷新</button>
  </div>
</template>
```

#### useAsyncData

更灵活的数据获取方法：

```vue
<script setup lang="ts">
const { data, pending, error, refresh } = await useAsyncData(
  'users', // 缓存键
  async () => {
    const response = await $fetch('/api/users')
    return response
  },
  {
    // 配置选项
    watch: [], // 监听的响应式变量
    lazy: false, // 是否延迟加载
    immediate: true, // 是否立即执行
    transform: (data) => data // 数据转换函数
  }
)
</script>
```

#### $fetch

封装的 fetch API，支持自动代理：

```vue
<script setup lang="ts">
const response = await $fetch('/api/users', {
  method: 'GET',
  params: { page: 1 },
  headers: {
    'Content-Type': 'application/json'
  }
})
</script>
```

### 服务器功能

Nuxt 3 提供了内置的服务器功能，位于 `server/` 目录：

#### API 路由

在 `server/api/` 目录下定义 API 路由：

```typescript
// server/api/users.ts
export default defineEventHandler(async (event) => {
  // 访问查询参数
  const query = getQuery(event)
  
  // 模拟数据
  const users = [
    { id: 1, name: '张三' },
    { id: 2, name: '李四' }
  ]
  
  return users
})
```

可以通过 `/api/users` 访问此 API。

#### 服务端中间件

在 `server/middleware/` 目录下定义中间件：

```typescript
// server/middleware/auth.ts
export default defineEventHandler((event) => {
  // 获取请求头
  const token = getHeader(event, 'Authorization')
  
  // 验证 token
  if (!token) {
    setResponseStatus(event, 401)
    return { error: 'Unauthorized' }
  }
  
  // 继续处理请求
})
```

#### 服务端路由

在 `server/routes/` 目录下定义服务端路由：

```typescript
// server/routes/hello.ts
export default defineEventHandler((event) => {
  return {
    message: 'Hello from server route'
  }
})
```

可以通过 `/hello` 访问此路由。

### 状态管理

Nuxt 3 推荐使用 Pinia 作为状态管理库：

#### 安装 Pinia

```bash
npm install pinia @pinia/nuxt
# 或使用 yarn
yarn add pinia @pinia/nuxt
```

#### 配置 Pinia

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt'
  ]
})
```

#### 使用 Pinia

```typescript
// app/stores/user.ts
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  // 状态
  const user = ref(null)
  const token = ref(null)
  
  // 操作
  function setUser(newUser) {
    user.value = newUser
  }
  
  function setToken(newToken) {
    token.value = newToken
  }
  
  function logout() {
    user.value = null
    token.value = null
  }
  
  // 计算属性
  const isLoggedIn = computed(() => !!token.value)
  
  return {
    user,
    token,
    setUser,
    setToken,
    logout,
    isLoggedIn
  }
})
```

在组件中使用：

```vue
<script setup lang="ts">
const userStore = useUserStore()

// 访问状态
console.log(userStore.user)

// 调用操作
userStore.setUser({ name: '张三' })
</script>
```

### 布局

在 `app/layouts/` 目录下定义布局组件：

#### 默认布局

```vue
<!-- app/layouts/default.vue -->
<template>
  <div class="app-layout">
    <header>
      <nav>
        <NuxtLink to="/">首页</NuxtLink>
        <NuxtLink to="/about">关于</NuxtLink>
      </nav>
    </header>
    <main>
      <NuxtPage />
    </main>
    <footer>
      <p>© 2023 我的网站</p>
    </footer>
  </div>
</template>
```

#### 自定义布局

```vue
<!-- app/layouts/auth.vue -->
<template>
  <div class="auth-layout">
    <NuxtPage />
  </div>
</template>
```

在页面中使用自定义布局：

```vue
<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})
</script>
```

## 配置文件

`nuxt.config.ts` 是 Nuxt.js 3 的主要配置文件：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  // 应用配置
  app: {
    head: {
      title: '我的 Nuxt 3 应用',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'description', content: 'Nuxt 3 应用描述' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  // 构建配置
  build: {
    // 构建选项
  },

  // CSS 配置
  css: [
    '@/assets/css/main.css'
  ],

  // 模块配置
  modules: [
    '@pinia/nuxt'
  ],

  // 运行时配置
  runtimeConfig: {
    // 服务端可用的私有配置
    apiSecret: '123',
    // 客户端和服务端都可用的公共配置
    public: {
      apiBase: '/api'
    }
  },

  // Nitro 配置
  nitro: {
    // 部署配置
    preset: 'vercel'
  }
})
```

## 开发与部署

### 开发模式

```bash
npm run dev
# 或
yarn dev
```

应用将在 http://localhost:3000 启动。

### 构建应用

```bash
npm run build
# 或
yarn build
```

### 预览生产构建

```bash
npm run start
# 或
yarn start
```

### 生成静态站点

```bash
npm run generate
# 或
yarn generate
```

这将生成静态 HTML 文件在 `dist/` 目录，可以部署到任何静态服务器。

## 部署选项

Nuxt 3 支持多种部署模式：

### 静态站点

使用 `nuxt generate` 命令生成静态站点，然后部署到：
- Netlify
- Vercel
- GitHub Pages
- 任何静态文件服务器

### 服务器渲染

使用 `nuxt build` 命令构建应用，然后部署到支持 Node.js 的平台：
- Vercel
- Netlify Functions
- AWS Lambda
- DigitalOcean App Platform
- 任何支持 Node.js 的服务器

### Edge 渲染

Nuxt 3 支持部署到边缘网络：
- Cloudflare Workers
- Vercel Edge Functions

## 性能优化

1. **组件懒加载**：使用 `defineAsyncComponent` 延迟加载组件
2. **图片优化**：使用 `<NuxtImg>` 组件自动优化图片
3. **路由预加载**：使用 `<NuxtLink>` 的 `prefetch` 属性
4. **代码分割**：Nuxt 3 自动进行代码分割
5. **静态站点生成**：对静态内容使用 SSG
6. **缓存策略**：利用 Nitro 的缓存功能

## 最佳实践

1. **组合式 API**：使用 Vue 3 的组合式 API 构建组件
2. **类型安全**：利用 TypeScript 进行类型检查
3. **自动导入**：充分利用 Nuxt 3 的自动导入功能
4. **服务器功能**：使用内置的服务器功能处理 API 请求
5. **状态管理**：使用 Pinia 进行状态管理
6. **测试**：为组件和功能编写测试

## 参考资源

- [Nuxt 3 官方文档](https://v3.nuxtjs.org/)
- [Vue 3 官方文档](https://vuejs.org/)
- [Pinia 守方文档](https://pinia.vuejs.org/)
- [Nuxt 3 GitHub 仓库](https://github.com/nuxt/nuxt)

## 版本对比

有关 Nuxt 3 与其他版本的详细对比，请参阅 [版本对比文档](./comparison.md)。

通过这些文档，您可以全面了解 Nuxt.js 3.x 的特性和使用方法，并了解它与其他版本的差异。