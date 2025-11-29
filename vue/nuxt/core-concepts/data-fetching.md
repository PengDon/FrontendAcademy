# Nuxt.js 数据获取

## 目录

- [简介](#简介)
- [useAsyncData](#useasyncdata)
- [useFetch](#usefetch)
- [服务端与客户端数据获取](#服务端与客户端数据获取)
- [错误处理](#错误处理)
- [缓存策略](#缓存策略)
- [最佳实践](#最佳实践)

## 简介

Nuxt.js 提供了强大的数据获取机制，支持服务端渲染(SSR)和静态站点生成(SSG)场景下的数据获取。这些机制确保了应用在服务端和客户端都能正确获取和处理数据。

### 数据获取方法

Nuxt.js 提供了以下几种主要的数据获取方法：

1. **useAsyncData** - 通用的异步数据获取方法
2. **useFetch** - 基于 URL 的数据获取快捷方式
3. **useState** - 简单的状态管理
4. **server-side APIs** - 服务端 API 路由

## useAsyncData

`useAsyncData` 是 Nuxt.js 中最通用的数据获取方法，它可以在组件 setup 或插件中使用。

### 基本用法

```vue
<script setup>
const { data, pending, error, refresh } = await useAsyncData('products', () => {
  return $fetch('/api/products')
})
</script>

<template>
  <div>
    <div v-if="pending">加载中...</div>
    <div v-else-if="error">错误: {{ error.message }}</div>
    <div v-else>
      <ul>
        <li v-for="product in data" :key="product.id">
          {{ product.name }}
        </li>
      </ul>
    </div>
  </div>
</template>
```

### 参数详解

```typescript
useAsyncData(
  key: string,           // 数据的唯一标识符
  handler: () => Promise<T>, // 返回 Promise 的数据获取函数
  options?: AsyncDataOptions  // 可选配置
)
```

### 配置选项

```typescript
const { data } = await useAsyncData('products', () => {
  return $fetch('/api/products')
}, {
  server: true,        // 是否在服务端获取数据（默认: true）
  lazy: false,         // 是否延迟加载（默认: false）
  default: () => [],   // 默认值
  transform: (data) => data, // 数据转换函数
  pick: ['name', 'price'],   // 选择特定字段
  watch: [someRef],    // 监听变化重新获取
  immediate: true      // 是否立即执行（默认: true）
})
```

### 条件性数据获取

```typescript
<script setup>
const route = useRoute()
const categoryId = computed(() => route.query.category)

const { data } = await useAsyncData(
  'products',
  () => $fetch('/api/products', {
    query: { category: categoryId.value }
  }),
  {
    watch: [categoryId] // 当 categoryId 变化时重新获取
  }
)
</script>
```

## useFetch

`useFetch` 是 `useAsyncData` 的便捷封装，专门用于基于 URL 的数据获取。

### 基本用法

```vue
<script setup>
// 简单用法
const { data: products } = await useFetch('/api/products')

// 带参数
const { data: product } = await useFetch(`/api/products/${id}`)

// 带查询参数
const { data: searchResults } = await useFetch('/api/search', {
  query: { q: 'nuxt' }
})
</script>
```

### HTTP 方法和选项

```typescript
// POST 请求
const { data } = await useFetch('/api/products', {
  method: 'POST',
  body: { name: '新产品', price: 99.99 }
})

// 带请求头
const { data } = await useFetch('/api/protected', {
  headers: {
    Authorization: 'Bearer ' + token
  }
})

// 自定义 fetch 选项
const { data } = await useFetch('/api/data', {
  timeout: 5000,
  retry: 3
})
```

### 响应处理

```typescript
const { data, error, status } = await useFetch('/api/data')

if (error.value) {
  console.error('请求失败:', error.value)
} else if (status.value === 200) {
  console.log('数据获取成功:', data.value)
}
```

## 服务端与客户端数据获取

### 服务端数据获取

默认情况下，Nuxt.js 会在服务端获取数据：

```typescript
// 这个请求会在服务端执行
const { data } = await useAsyncData('products', () => {
  return $fetch('/api/products')
})
```

### 客户端数据获取

有时我们需要只在客户端获取数据：

```typescript
// 只在客户端获取数据
const { data } = await useAsyncData('user-preferences', () => {
  if (process.client) {
    return localStorage.getItem('preferences')
  }
  return null
}, {
  server: false // 禁用服务端获取
})
```

### 延迟加载

对于不影响首屏渲染的数据，可以使用延迟加载：

```typescript
// 延迟加载，不阻塞页面渲染
const { data } = useLazyAsyncData('analytics', () => {
  return $fetch('/api/analytics')
})

// 或者使用 useLazyFetch
const { data } = useLazyFetch('/api/recommendations')
```

## 错误处理

### 基本错误处理

```vue
<script setup>
const { data, error, pending } = await useFetch('/api/products')
</script>

<template>
  <div>
    <div v-if="pending">加载中...</div>
    <div v-else-if="error">
      <h2>出错了</h2>
      <p>状态码: {{ error.statusCode }}</p>
      <p>错误信息: {{ error.message }}</p>
      <button @click="refresh">重试</button>
    </div>
    <div v-else>
      <!-- 渲染数据 -->
    </div>
  </div>
</template>
```

### 自定义错误处理

```typescript
const { data, error } = await useAsyncData('products', async () => {
  try {
    const response = await $fetch('/api/products')
    return response
  } catch (err) {
    // 自定义错误处理
    console.error('获取产品失败:', err)
    
    // 返回默认值
    return []
  }
})
```

### 全局错误处理

```typescript
// plugins/error-handler.ts
export default defineNuxtPlugin(() => {
  const handleAsyncError = (error: any) => {
    // 全局错误处理逻辑
    console.error('全局错误处理:', error)
  }
  
  return {
    provide: {
      handleAsyncError
    }
  }
})
```

## 缓存策略

### 内置缓存

Nuxt.js 会自动缓存相同 key 的数据获取：

```typescript
// 第一次调用会发起请求
const { data: products1 } = await useFetch('/api/products')

// 同一个组件中第二次调用会使用缓存
const { data: products2 } = await useFetch('/api/products')
```

### 手动缓存控制

```typescript
// 禁用缓存
const { data } = await useFetch('/api/products', {
  key: 'products-' + Date.now() // 使用唯一 key 禁用缓存
})

// 设置缓存时间
const { data } = await useAsyncData('products', () => {
  return $fetch('/api/products')
}, {
  maxAge: 60000 // 缓存 1 分钟
})
```

### HTTP 缓存头

在服务端 API 中设置缓存头：

```typescript
// server/api/products.ts
export default defineEventHandler((event) => {
  // 设置缓存头
  setHeader(event, 'Cache-Control', 'public, max-age=3600')
  
  return [
    { id: 1, name: '产品1' },
    { id: 2, name: '产品2' }
  ]
})
```

## 最佳实践

### 1. 合理使用 key

```typescript
// 好的做法：使用描述性的 key
const { data } = await useFetch('/api/users/123', {
  key: 'user-123'
})

// 避免：使用随机 key 破坏缓存
const { data } = await useFetch('/api/users/123', {
  key: 'user-' + Math.random()
})
```

### 2. 数据预取

在页面元数据中预取数据：

```vue
<script setup>
definePageMeta({
  // 预取数据以提高性能
  prefetch: ['products', 'categories']
})

const { data: products } = await useFetch('/api/products')
const { data: categories } = await useFetch('/api/categories')
</script>
```

### 3. 错误边界

创建错误边界组件：

```vue
<!-- components/DataFetcher.vue -->
<script setup>
const props = defineProps({
  url: String
})

const { data, error, pending, refresh } = await useFetch(props.url)
</script>

<template>
  <div>
    <slot 
      v-if="!pending && !error" 
      :data="data" 
      :refresh="refresh"
    />
    
    <div v-else-if="pending" class="loading">
      <slot name="loading">加载中...</slot>
    </div>
    
    <div v-else-if="error" class="error">
      <slot name="error" :error="error" :retry="refresh">
        错误: {{ error.message }}
        <button @click="refresh">重试</button>
      </slot>
    </div>
  </div>
</template>
```

### 4. 类型安全

```typescript
// 定义 API 响应类型
interface Product {
  id: number
  name: string
  price: number
}

// 使用泛型确保类型安全
const { data } = await useFetch<Product[]>('/api/products')
// data.value 的类型是 Product[] | null
```

### 5. 组合式函数封装

```typescript
// composables/useProducts.ts
export const useProducts = (filters: Ref<{ category?: string }>) => {
  return useAsyncData(
    'products',
    () => $fetch('/api/products', {
      query: {
        category: filters.value.category
      }
    }),
    {
      watch: [filters]
    }
  )
}
```

通过掌握这些数据获取的概念和技巧，您可以在 Nuxt.js 应用中高效地处理各种数据获取场景，确保应用在服务端渲染和客户端渲染中都能正常工作。