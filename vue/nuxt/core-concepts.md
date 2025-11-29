# Nuxt.js 核心概念详解

## 目录

- [约定优于配置](#约定优于配置)
- [自动路由系统](#自动路由系统)
- [服务端渲染(SSR)](#服务端渲染ssr)
- [静态站点生成(SSG)](#静态站点生成ssg)
- [数据获取策略](#数据获取策略)
- [生命周期](#生命周期)
- [中间件系统](#中间件系统)
- [插件系统](#插件系统)

## 约定优于配置

Nuxt.js 的核心理念之一是"约定优于配置"(Convention over Configuration)。这意味着框架通过一套明确的约定来减少开发者的配置负担，让开发者能够专注于业务逻辑而不是基础设施设置。

### 目录结构约定

Nuxt.js 通过特定的目录结构来自动配置应用的不同部分：

```
app/
├── pages/        # 页面组件，自动生成路由
├── layouts/      # 布局组件
├── components/   # Vue 组件
├── composables/  # 组合式函数
├── plugins/      # 插件
└── app.vue       # 根应用组件
```

这种约定带来的好处：
1. **降低学习成本** - 开发者只需学习一次就能应用于所有 Nuxt 项目
2. **提高开发效率** - 减少了大量的配置工作
3. **增强团队协作** - 统一的项目结构便于团队成员理解和维护

### 文件命名约定

Nuxt.js 使用文件名来确定路由路径和组件行为：

```bash
# 页面路由映射示例
pages/
├── index.vue         → /
├── about.vue         → /about
├── posts/
│   ├── index.vue     → /posts
│   └── [id].vue      → /posts/:id
└── users/
    └── [id]/
        └── index.vue → /users/:id
```

## 自动路由系统

Nuxt.js 最强大的特性之一就是自动路由生成系统。它基于文件系统的结构自动生成 Vue Router 配置。

### 基础路由

```bash
# 文件结构
pages/
├── index.vue
├── about.vue
└── contact.vue
```

这将自动生成以下路由：

```javascript
[
  { path: '/', component: 'pages/index.vue' },
  { path: '/about', component: 'pages/about.vue' },
  { path: '/contact', component: 'pages/contact.vue' }
]
```

### 动态路由

使用方括号 `[]` 来定义动态路由参数：

```bash
# 文件结构
pages/
└── users/
    ├── index.vue      # /users
    └── [id].vue       # /users/:id
```

在组件中访问路由参数：

```vue
<script setup>
const route = useRoute()
// 访问 /users/123 时，route.params.id 为 '123'
const userId = route.params.id
</script>
```

### 嵌套路由

通过创建同名的 Vue 文件和目录来实现嵌套路由：

```bash
# 文件结构
pages/
├── parent/
│   ├── index.vue     # 父路由组件
│   └── child.vue     # 子路由组件
└── parent.vue        # 父路由页面
```

这将生成嵌套路由：

```javascript
[
  {
    path: '/parent',
    component: 'pages/parent.vue',
    children: [
      {
        path: '',
        component: 'pages/parent/index.vue'
      },
      {
        path: 'child',
        component: 'pages/parent/child.vue'
      }
    ]
  }
]
```

### 路由元信息

可以通过页面组件的 `definePageMeta` 宏来定义路由元信息：

```vue
<script setup>
definePageMeta({
  middleware: 'auth',
  layout: 'admin',
  keepalive: true
})
</script>
```

## 服务端渲染(SSR)

服务端渲染(Server-Side Rendering, SSR)是 Nuxt.js 的核心特性之一，它可以显著改善首屏加载时间和 SEO。

### SSR 工作原理

1. 用户请求页面
2. 服务端执行 Vue 组件，生成 HTML
3. 将渲染好的 HTML 发送给客户端
4. 客户端"激活"(hydrate) HTML，使其具有交互性

### SSR 优势

1. **更好的 SEO** - 搜索引擎可以直接抓取完整的 HTML 内容
2. **更快的首屏加载** - 用户立即看到内容而非空白页面
3. **更好的社交分享体验** - 社交媒体可以正确预览页面内容

### SSR 注意事项

```vue
<script setup>
// ❌ 避免在 setup 或顶层作用域直接访问浏览器 API
// const width = window.innerWidth // 这会在服务端报错

// ✅ 使用 onMounted 生命周期钩子
onMounted(() => {
  const width = window.innerWidth
})

// ✅ 或者使用 process.client 检查
if (process.client) {
  const width = window.innerWidth
}

// ✅ 或者使用 useMounted 组合式函数
const isMounted = useMounted()
</script>
```

## 静态站点生成(SSG)

静态站点生成(Static Site Generation, SSG)允许你在构建时预渲染页面为静态 HTML 文件。

### SSG 优势

1. **极致的性能** - 静态文件可以被 CDN 缓存
2. **更高的安全性** - 没有服务端运行时
3. **更低的成本** - 可以部署到任何静态文件服务器

### 配置 SSG

在 `nuxt.config.ts` 中配置：

```typescript
export default defineNuxtConfig({
  // 为所有页面启用 SSG
  ssr: true,
  
  // 预渲染特定路由
  nitro: {
    prerender: {
      routes: ['/about', '/posts/1', '/posts/2']
    }
  }
})
```

### 动态路由预渲染

对于动态路由，可以使用 `crawlLinks` 自动发现链接：

```typescript
export default defineNuxtConfig({
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/']
    }
  }
})
```

## 数据获取策略

Nuxt.js 提供了多种数据获取方法，每种都有其适用场景。

### useAsyncData

最通用的数据获取方法，适用于页面和组件：

```vue
<script setup>
const { data, pending, error, refresh } = await useAsyncData(
  'products',
  () => $fetch('/api/products')
)

// 或者使用快捷方式
const { data: products } = await useFetch('/api/products')
</script>
```

### useLazyAsyncData

延迟加载版本，在数据加载期间不阻塞页面导航：

```vue
<script setup>
const { data, pending } = useLazyAsyncData('products', () => $fetch('/api/products'))

// 页面会立即显示，同时加载数据
</script>
```

### serverPrefetch

在服务端预获取数据（仅在 SSR 模式下有效）：

```vue
<script setup>
const { data } = await useAsyncData('products', () => $fetch('/api/products'), {
  server: true, // 默认为 true
  lazy: false   // 默认为 false
})
</script>
```

## 生命周期

Nuxt.js 扩展了 Vue 的生命周期，增加了服务端和客户端特定的钩子。

### Nuxt 应用生命周期

```typescript
// plugins/my-plugin.ts
export default defineNuxtPlugin(async (nuxtApp) => {
  // 1. Nuxt 应用初始化
  nuxtApp.hook('app:created', () => {
    console.log('应用已创建')
  })
  
  // 2. 插件安装完毕
  nuxtApp.hook('app:beforeMount', () => {
    console.log('应用即将挂载')
  })
  
  // 3. 应用挂载完毕
  nuxtApp.hook('app:mounted', () => {
    console.log('应用已挂载')
  })
})
```

### 页面生命周期

```vue
<script setup>
// 服务端和客户端都会执行
const route = useRoute()
console.log('设置路由:', route.path)

// 仅在客户端执行
onMounted(() => {
  console.log('组件已挂载到 DOM')
})

// 页面组件卸载时执行
onUnmounted(() => {
  console.log('组件已卸载')
})

// 页面导航前执行
definePageMeta({
  middleware: [
    function (to, from) {
      console.log('导航到:', to.path)
    }
  ]
})
</script>
```

## 中间件系统

中间件是在页面渲染前执行的函数，常用于权限验证、路由守卫等。

### 全局中间件

创建 `middleware/auth.global.ts`:

```typescript
export default defineNuxtRouteMiddleware((to, from) => {
  const user = useUser()
  
  // 如果用户未登录且访问受保护页面
  if (!user.isLoggedIn && to.path.startsWith('/dashboard')) {
    return navigateTo('/login')
  }
})
```

### 命名中间件

创建 `middleware/auth.ts`:

```typescript
export default defineNuxtRouteMiddleware((to, from) => {
  const user = useUser()
  
  if (!user.isLoggedIn) {
    return navigateTo('/login')
  }
})
```

在页面中使用：

```vue
<script setup>
definePageMeta({
  middleware: 'auth'
})
</script>
```

### 中间件执行顺序

1. `nuxt.config.ts` 中定义的全局中间件
2. 匹配布局中的中间件
3. 匹配页面中的中间件

## 插件系统

插件用于在应用启动时注册库、组件或其他功能。

### 创建插件

创建 `plugins/my-plugin.ts`:

```typescript
export default defineNuxtPlugin((nuxtApp) => {
  // 注册提供者
  return {
    provide: {
      hello: (msg: string) => `Hello ${msg}!`
    }
  }
})
```

在组件中使用：

```vue
<script setup>
const { $hello } = useNuxtApp()
console.log($hello('World')) // 输出: Hello World!
</script>
```

### 插件加载顺序

通过文件名前缀控制插件加载顺序：

```bash
plugins/
├── 01.my-plugin.ts  # 首先加载
├── 02.other.ts      # 然后加载
└── base.ts          # 最后加载
```

通过这些核心概念的深入理解，你可以更好地利用 Nuxt.js 构建高性能的 Vue.js 应用。