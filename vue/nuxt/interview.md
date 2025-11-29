# Nuxt.js 面试重点内容

## 目录

- [核心概念](#核心概念)
- [SSR vs SSG vs SPA](#ssr-vs-ssg-vs-spa)
- [生命周期](#生命周期)
- [数据获取](#数据获取)
- [路由系统](#路由系统)
- [性能优化](#性能优化)
- [部署策略](#部署策略)
- [常见问题解答](#常见问题解答)

## 核心概念

### 什么是 Nuxt.js？

Nuxt.js 是一个基于 Vue.js 的通用应用框架，它简化了 Vue 应用的开发流程，提供了以下核心功能：

1. **自动路由生成** - 基于文件系统的路由
2. **服务端渲染(SSR)** - 改善 SEO 和首屏加载性能
3. **静态站点生成(SSG)** - 预渲染页面为静态文件
4. **代码分割** - 自动分割 JavaScript 代码
5. **强大的插件系统** - 易于扩展

### Nuxt.js 与 Vue.js 的区别

| 特性 | Vue.js | Nuxt.js |
|------|--------|---------|
| 路由 | 需要手动配置 Vue Router | 基于文件系统自动生成 |
| 服务端渲染 | 需要额外配置 | 内置支持 |
| 静态站点生成 | 需要额外工具 | 内置支持 |
| 代码分割 | 需要手动配置 | 自动处理 |
| 项目结构 | 自由 | 约定式结构 |

### Nuxt.js 的核心特性

1. **约定优于配置** - 通过特定目录结构自动配置
2. **自动代码分割** - 按路由分割代码，按需加载
3. **服务端渲染** - 改善 SEO 和首屏性能
4. **静态站点生成** - 构建时预渲染页面
5. **强大的开发体验** - 热重载、错误提示等

## SSR vs SSG vs SPA

### 服务端渲染(SSR)

**工作原理**：
1. 用户请求页面
2. 服务端执行 Vue 组件，生成 HTML
3. 将渲染好的 HTML 发送给客户端
4. 客户端"激活" HTML，使其具有交互性

**优点**：
- 更好的 SEO
- 更快的首屏加载
- 更好的社交分享体验

**缺点**：
- 服务端压力较大
- TTFB(Time To First Byte)可能较长

### 静态站点生成(SSG)

**工作原理**：
1. 在构建时预渲染页面为静态 HTML 文件
2. 部署静态文件到 CDN
3. 用户直接访问静态文件

**优点**：
- 极致的性能
- 更高的安全性
- 更低的成本

**缺点**：
- 数据实时性差
- 构建时间随页面数量增长

### 单页应用(SPA)

**工作原理**：
1. 用户请求初始页面
2. 加载 JavaScript 包
3. 客户端渲染页面内容

**优点**：
- 更好的交互体验
- 更简单的部署
- 更少的服务端压力

**缺点**：
- SEO 困难
- 首屏加载慢
- 白屏问题

## 生命周期

### Nuxt 应用生命周期

1. **Nuxt 初始化**
   - 创建 Nuxt 实例
   - 注册插件
   - 设置中间件

2. **Vue 应用生命周期**
   - `app:created` - 应用创建
   - `app:beforeMount` - 应用挂载前
   - `app:mounted` - 应用挂载后

3. **页面生命周期**
   - `navigate:before` - 导航前
   - `navigate:after` - 导航后

### 页面组件生命周期

```vue
<script setup>
// 1. setup阶段 - 组件创建时执行
console.log('setup')

// 2. 服务端和客户端都会执行
onBeforeMount(() => {
  console.log('before mount')
})

// 3. 仅在客户端执行
onMounted(() => {
  console.log('mounted')
})

// 4. 页面卸载时执行
onUnmounted(() => {
  console.log('unmounted')
})
</script>
```

### 中间件执行顺序

1. 全局中间件
2. 布局中间件
3. 页面中间件

## 数据获取

### useAsyncData vs useFetch

**相同点**：
- 都用于异步数据获取
- 都支持服务端渲染
- 都有缓存机制

**不同点**：
- `useFetch` 是 `useAsyncData` 的快捷方式
- `useFetch` 自动推断 URL 作为 key
- `useAsyncData` 更灵活，可以自定义 key

```typescript
// useFetch 的简写形式
const { data } = await useFetch('/api/products')

// 等价于
const { data } = await useAsyncData(
  '/api/products',
  () => $fetch('/api/products')
)
```

### 数据获取策略选择

1. **useAsyncData** - 通用数据获取方法
2. **useLazyAsyncData** - 延迟加载，不阻塞导航
3. **useFetch** - URL 请求的快捷方式
4. **useLazyFetch** - 延迟加载的 URL 请求

### 错误处理

```typescript
const { data, error, pending } = await useAsyncData('products', () => {
  return $fetch('/api/products')
})

if (error.value) {
  // 处理错误
  console.error('获取数据失败:', error.value)
}
```

## 路由系统

### 自动路由生成

Nuxt.js 通过文件系统自动生成路由：

```bash
# 文件结构
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

### 动态路由参数

```vue
<script setup>
const route = useRoute()
// 访问 /posts/123 时
console.log(route.params.id) // '123'
</script>
```

### 路由中间件

```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const user = useUser()
  
  if (!user.isLoggedIn && to.path.startsWith('/dashboard')) {
    return navigateTo('/login')
  }
})
```

### 编程式导航

```vue
<script setup>
const router = useRouter()

function goToAbout() {
  router.push('/about')
}

function goBack() {
  router.back()
}
</script>
```

## 性能优化

### 关键优化策略

1. **代码分割** - 按路由分割代码
2. **懒加载组件** - 动态导入重型组件
3. **图片优化** - 使用 Nuxt Image 模块
4. **HTTP 缓存** - 合理设置缓存头
5. **预加载资源** - 预加载关键资源

### 性能指标监控

```typescript
// 监控关键性能指标
window.addEventListener('load', () => {
  // 首次内容绘制时间
  const fcp = performance.getEntriesByName('first-contentful-paint')[0]
  
  // 最大内容绘制时间
  const lcp = performance.getEntriesByName('largest-contentful-paint')[0]
  
  // 累积布局偏移
  const cls = performance.getEntriesByType('layout-shift')
})
```

## 部署策略

### 静态部署

```bash
# 生成静态站点
npm run generate

# 预览静态站点
npm run preview
```

适用于：
- 博客、文档网站
- 内容不频繁变化的网站
- 对性能要求极高的场景

### 服务端部署

```bash
# 构建应用
npm run build

# 启动服务
npm run start
```

适用于：
- 需要实时数据的应用
- 用户生成内容较多的网站
- 需要复杂服务端逻辑的场景

### Edge 部署

使用 Nitro 部署到边缘网络：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    preset: 'cloudflare' // 或 'vercel-edge', 'netlify-edge'
  }
})
```

## 常见问题解答

### Q: Nuxt.js 支持哪些渲染模式？

A: Nuxt.js 支持三种渲染模式：
1. **universal** - 服务端渲染(SSR)
2. **spa** - 单页应用
3. **static** - 静态站点生成(SSG)

### Q: 如何处理服务端和客户端环境差异？

A: 使用以下方法：
```typescript
// 检查是否在客户端
if (process.client) {
  // 客户端代码
}

// 检查是否在服务端
if (process.server) {
  // 服务端代码
}

// 使用 onMounted 确保在客户端执行
onMounted(() => {
  // 客户端代码
})
```

### Q: 如何优化 Nuxt.js 应用的 SEO？

A: 优化策略包括：
1. 使用服务端渲染或静态生成
2. 合理设置 meta 标签
3. 实现结构化数据
4. 生成站点地图
5. 配置 robots.txt

### Q: Nuxt.js 如何处理状态管理？

A: Nuxt.js 支持多种状态管理方案：
1. **Pinia** - 官方推荐的状态管理库
2. **Vuex** - Vue 2/3 的状态管理
3. **Composables** - 使用组合式 API 管理状态
4. **useState** - Nuxt 内置的状态管理

### Q: Nuxt.js 3 与 Nuxt.js 2 的主要区别？

A: 主要区别包括：
1. **Vue 3** - 基于 Vue 3 和 Composition API
2. **Nitro Engine** - 新的服务端引擎
3. **TypeScript** - 更好的 TypeScript 支持
4. **性能提升** - 更快的构建和运行时性能
5. **模块系统** - 改进的模块系统

通过掌握这些面试重点内容，你将能够在面试中展现出对 Nuxt.js 的深入理解，并能够回答大部分相关技术问题。