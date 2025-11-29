# Nuxt.js 路由系统详解

## 目录

- [文件系统路由](#文件系统路由)
- [页面组件](#页面组件)
- [动态路由](#动态路由)
- [嵌套路由](#嵌套路由)
- [导航和路由中间件](#导航和路由中间件)
- [路由元数据](#路由元数据)
- [自定义路由配置](#自定义路由配置)

## 文件系统路由

Nuxt.js 最强大的特性之一是它的文件系统路由系统。无需手动配置路由，Nuxt.js 会根据 `pages/` 目录中的文件结构自动生成路由。

### 基础路由

最基本的路由映射关系如下：

```bash
pages/
├── index.vue         # 根路径: /
├── about.vue         # 路径: /about
└── contact.vue       # 路径: /contact
```

### 忽略路由文件

以 `-` 或 `_` 开头的文件会被忽略：

```bash
pages/
├── index.vue         # 根路径: /
├── _ignored.vue      # 被忽略
└── -temporary.vue    # 被忽略
```

### 路由组件

每个页面组件都应该有一个默认导出：

```vue
<!-- pages/about.vue -->
<template>
  <div>
    <h1>关于我们</h1>
    <p>这是关于我们的页面。</p>
  </div>
</template>

<script setup>
// 页面元数据
definePageMeta({
  title: '关于我们'
})
</script>
```

## 页面组件

Nuxt.js 页面组件是一些特殊的 Vue 组件，它们可以使用一些额外的功能。

### 页面元数据

使用 `definePageMeta` 定义页面元数据：

```vue
<script setup>
definePageMeta({
  // 页面标题
  title: '首页',
  
  // 使用的布局
  layout: 'default',
  
  // 中间件
  middleware: ['auth'],
  
  // 是否保持活跃状态
  keepalive: true,
  
  // 自定义元数据
  customProperty: 'value'
})
</script>
```

### 页面键值

当使用 `<NuxtPage>` 组件时，可以通过 `key` 属性控制页面切换时的行为：

```vue
<script setup>
definePageMeta({
  key: route => route.fullPath
})
</script>
```

## 动态路由

动态路由允许创建匹配动态参数的路由。

### 单个参数

使用方括号 `[]` 定义动态参数：

```bash
pages/
└── users/
    └── [id].vue      # 匹配 /users/1, /users/abc 等
```

在组件中访问参数：

```vue
<!-- pages/users/[id].vue -->
<script setup>
const route = useRoute()
const userId = route.params.id
</script>

<template>
  <div>
    <h1>用户 ID: {{ userId }}</h1>
  </div>
</template>
```

### 多个参数

可以定义多个参数：

```bash
pages/
└── [category]/
    └── [id].vue      # 匹配 /products/1, /articles/abc 等
```

访问多个参数：

```vue
<script setup>
const route = useRoute()
const category = route.params.category
const id = route.params.id
</script>
```

### 可选参数

使用双方括号 `[[]]` 定义可选参数：

```bash
pages/
└── users/
    └── [[id]].vue    # 匹配 /users 和 /users/1
```

处理可选参数：

```vue
<script setup>
const route = useRoute()
const userId = route.params.id || 'default'
</script>
```

### 捕获所有参数

使用 `[...slug].vue` 捕获所有后续参数：

```bash
pages/
└── [...slug].vue     # 匹配 /anything, /anything/else/too
```

处理捕获的参数：

```vue
<script setup>
const route = useRoute()
const slug = route.params.slug // 数组形式
</script>
```

## 嵌套路由

Nuxt.js 支持嵌套路由，允许创建复杂的路由层次结构。

### 基本嵌套路由

通过创建同名的 Vue 文件和目录来实现嵌套路由：

```bash
pages/
├── parent/
│   ├── index.vue     # /parent
│   └── child.vue     # /parent/child
└── parent.vue        # 父路由组件
```

父组件必须包含 `<NuxtPage />` 来渲染子路由：

```vue
<!-- pages/parent.vue -->
<template>
  <div>
    <h1>父页面</h1>
    <NuxtPage /> <!-- 子路由将在这里渲染 -->
  </div>
</template>
```

### 嵌套命名视图

可以创建更复杂的嵌套路由结构：

```bash
pages/
├── dashboard/
│   ├── index.vue           # /dashboard
│   ├── profile.vue         # /dashboard/profile
│   ├── settings/
│   │   ├── index.vue       # /dashboard/settings
│   │   └── security.vue    # /dashboard/settings/security
│   └── analytics.vue       # /dashboard/analytics
└── dashboard.vue           # Dashboard 布局组件
```

## 导航和路由中间件

### 编程式导航

使用 `useRouter` 进行编程式导航：

```vue
<script setup>
const router = useRouter()

function navigateToAbout() {
  router.push('/about')
}

function goBack() {
  router.back()
}

function replaceRoute() {
  router.replace('/new-page')
}
</script>
```

### 路由中间件

路由中间件是在导航到特定路由之前执行的函数。

#### 全局中间件

创建 `middleware/auth.global.js`:

```javascript
export default defineNuxtRouteMiddleware((to, from) => {
  // 检查用户是否已认证
  const user = useUser()
  
  if (!user.isAuthenticated) {
    return navigateTo('/login')
  }
})
```

#### 命名中间件

创建 `middleware/guest.js`:

```javascript
export default defineNuxtRouteMiddleware((to, from) => {
  const user = useUser()
  
  if (user.isAuthenticated) {
    return navigateTo('/dashboard')
  }
})
```

在页面中使用：

```vue
<script setup>
definePageMeta({
  middleware: ['guest']
})
</script>
```

### 中间件执行顺序

1. 全局中间件
2. 布局中间件
3. 页面中间件

## 路由元数据

路由元数据允许为每个路由存储自定义信息。

### 定义元数据

```vue
<script setup>
definePageMeta({
  title: '产品详情',
  description: '查看产品的详细信息',
  requiresAuth: true,
  transition: {
    name: 'slide',
    mode: 'out-in'
  }
})
</script>
```

### 访问元数据

```vue
<script setup>
const route = useRoute()
console.log(route.meta.title)
</script>
```

### 全局元数据处理器

在插件中处理路由元数据：

```javascript
// plugins/meta.js
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:beforeMount', () => {
    const router = useRouter()
    
    router.beforeEach((to, from) => {
      // 处理页面标题
      if (to.meta.title) {
        document.title = to.meta.title
      }
    })
  })
})
```

## 自定义路由配置

虽然 Nuxt.js 提供了强大的文件系统路由，但在某些情况下可能需要自定义路由配置。

### 扩展路由

在 `nuxt.config.ts` 中扩展路由：

```typescript
export default defineNuxtConfig({
  hooks: {
    'pages:extend': (pages) => {
      // 添加自定义路由
      pages.push({
        name: 'custom',
        path: '/custom',
        file: '~/pages/custom.vue'
      })
    }
  }
})
```

### 禁用文件系统路由

完全禁用文件系统路由并手动定义路由：

```typescript
export default defineNuxtConfig({
  pages: false,
  
  hooks: {
    'pages:extend': (pages) => {
      // 手动定义所有路由
      pages.push({
        name: 'home',
        path: '/',
        file: '~/app.vue'
      })
    }
  }
})
```

### 路由验证

在页面组件中添加路由参数验证：

```vue
<script setup>
definePageMeta({
  validate: async (route) => {
    // 验证参数
    const id = route.params.id
    
    // 检查 ID 是否有效
    const isValid = await checkUserId(id)
    
    if (!isValid) {
      return createError({ 
        statusCode: 404, 
        statusMessage: '用户不存在' 
      })
    }
    
    return true
  }
})
</script>
```

通过掌握这些路由系统的核心概念和高级功能，您可以构建出复杂且功能强大的 Nuxt.js 应用程序。