# Nuxt.js 性能优化最佳实践

## 目录

- [构建优化](#构建优化)
- [运行时优化](#运行时优化)
- [图片优化](#图片优化)
- [缓存策略](#缓存策略)
- [服务端优化](#服务端优化)
- [监控与分析](#监控与分析)
- [综合优化清单](#综合优化清单)

## 构建优化

### 1. 代码分割优化

合理配置代码分割策略：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  build: {
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          // 分离第三方库
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10
          },
          // 分离常用组件
          common: {
            minChunks: 2,
            chunks: 'all',
            priority: 5
          }
        }
      }
    }
  }
})
```

### 2. Tree Shaking

确保只打包使用的代码：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  build: {
    analyze: true // 分析打包结果
  }
})
```

运行分析命令：

```bash
npx nuxt build --analyze
```

### 3. 压缩和最小化

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  vite: {
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, // 移除 console
          drop_debugger: true // 移除 debugger
        }
      }
    }
  }
})
```

### 4. 预加载关键资源

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        {
          rel: 'preload',
          as: 'font',
          type: 'font/woff2',
          crossorigin: ''
        },
        {
          rel: 'prefetch',
          as: 'image',
          href: '/hero-image.jpg'
        }
      ]
    }
  }
})
```

## 运行时优化

### 1. 组件懒加载

```vue
<script setup>
// 懒加载重型组件
const HeavyComponent = defineAsyncComponent(() => 
  import('~/components/HeavyComponent.vue')
)
</script>

<template>
  <HeavyComponent v-if="showHeavyComponent" />
</template>
```

### 2. 虚拟滚动

对于长列表，使用虚拟滚动：

```vue
<script setup>
import { VirtualList } from 'vue3-virtual-scroll-list'

const items = ref(Array.from({ length: 10000 }, (_, i) => ({ id: i, name: `Item ${i}` })))
</script>

<template>
  <VirtualList 
    :data-key="'id'"
    :data-sources="items"
    :data-component="ItemComponent"
    :keeps="30"
    :estimate-size="100"
  />
</template>
```

### 3. 防抖和节流

```typescript
// composables/useDebounce.ts
export function useDebounce(fn: Function, delay = 300) {
  let timeoutId: NodeJS.Timeout
  
  return (...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

// composables/useThrottle.ts
export function useThrottle(fn: Function, delay = 300) {
  let lastExecTime = 0
  
  return (...args: any[]) => {
    const now = Date.now()
    
    if (now - lastExecTime >= delay) {
      fn(...args)
      lastExecTime = now
    }
  }
}
```

### 4. 计算属性缓存

```vue
<script setup>
const products = ref([
  { id: 1, name: '产品1', category: '电子', price: 100 },
  { id: 2, name: '产品2', category: '服装', price: 50 }
])

// 使用 computed 缓存计算结果
const expensiveProducts = computed(() => {
  return products.value.filter(product => product.price > 80)
})

// 使用缓存避免重复计算
const productStats = computed(() => {
  const stats = {
    total: products.value.length,
    averagePrice: 0,
    categories: [] as string[]
  }
  
  const totalPrice = products.value.reduce((sum, product) => sum + product.price, 0)
  stats.averagePrice = totalPrice / stats.total
  
  stats.categories = [...new Set(products.value.map(p => p.category))]
  
  return stats
})
</script>
```

## 图片优化

### 1. 使用 Nuxt Image 模块

```bash
npm install @nuxt/image
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxt/image']
})
```

```vue
<template>
  <NuxtImg
    src="/images/product.jpg"
    placeholder
    sizes="sm:100vw md:50vw lg:400px"
    provider="cloudinary"
  />
</template>
```

### 2. 响应式图片

```vue
<script setup>
const breakpoints = useBreakpoints()
const imageSizes = computed(() => {
  if (breakpoints.isSmaller('md')) return '100vw'
  if (breakpoints.isSmaller('lg')) return '50vw'
  return '33vw'
})
</script>

<template>
  <NuxtImg
    src="/images/banner.jpg"
    :sizes="imageSizes"
  />
</template>
```

### 3. 图片懒加载

```vue
<template>
  <NuxtImg
    src="/images/large-image.jpg"
    loading="lazy"
    placeholder
  />
</template>
```

## 缓存策略

### 1. HTTP 缓存头

```typescript
// server/api/data.get.ts
export default defineCachedEventHandler(async (event) => {
  // 数据将在 1 小时内缓存
  setHeader(event, 'Cache-Control', 'public, max-age=3600')
  
  return {
    data: await fetchData(),
    timestamp: new Date().toISOString()
  }
}, {
  maxAge: 60 * 60 // 1小时
})
```

### 2. 组件级缓存

```vue
<script setup>
const { data } = await useAsyncData('expensive-operation', () => {
  return expensiveOperation()
}, {
  maxAge: 300000 // 缓存 5 分钟
})
</script>
```

### 3. 页面缓存

```vue
<script setup>
definePageMeta({
  keepalive: true // 缓存页面实例
})
</script>
```

### 4. CDN 缓存

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    // 启用公共资产压缩
    compressPublicAssets: true
  }
})
```

## 服务端优化

### 1. 数据库查询优化

```typescript
// server/api/users.get.ts
export default defineEventHandler(async (event) => {
  // 使用分页避免一次性加载过多数据
  const page = parseInt(getQuery(event).page as string) || 1
  const limit = 20
  
  const users = await prisma.users.findMany({
    skip: (page - 1) * limit,
    take: limit,
    // 只选择需要的字段
    select: {
      id: true,
      name: true,
      email: true
    }
  })
  
  return users
})
```

### 2. 服务端缓存

```typescript
// server/utils/cache.ts
const cache = new Map()

export function getCachedData<T>(key: string, fallback: () => Promise<T>, ttl = 60000): Promise<T> {
  const cached = cache.get(key)
  
  if (cached && Date.now() - cached.timestamp < ttl) {
    return Promise.resolve(cached.data)
  }
  
  return fallback().then(data => {
    cache.set(key, {
      data,
      timestamp: Date.now()
    })
    return data
  })
}
```

### 3. 服务端渲染优化

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  experimental: {
    payloadExtraction: true, // 提取页面负载
    inlineSSRStyles: false   // 内联SSR样式（禁用以减小HTML大小）
  },
  nitro: {
    compressPublicAssets: true // 压缩公共资产
  }
})
```

## 监控与分析

### 1. 性能监控

```typescript
// plugins/performance.client.ts
export default defineNuxtPlugin(() => {
  if ('performance' in window) {
    window.addEventListener('load', () => {
      // 首次内容绘制时间
      const fcp = performance.getEntriesByName('first-contentful-paint')[0]
      
      // 最大内容绘制时间
      const lcp = performance.getEntriesByName('largest-contentful-paint')[0]
      
      // 累积布局偏移
      const cls = performance.getEntriesByType('layout-shift')
      
      console.log('FCP:', fcp.startTime)
      console.log('LCP:', lcp.startTime)
      console.log('CLS:', cls)
    })
  }
})
```

### 2. 使用 Lighthouse 分析

```bash
# 安装 Lighthouse
npm install -g lighthouse

# 分析网站性能
lighthouse http://localhost:3000 --view
```

### 3. Bundle 分析

```bash
# 生成构建报告
npx nuxt build --analyze
```

## 综合优化清单

### 开发阶段

- [ ] 使用 `nuxt dev --profile` 启用性能分析
- [ ] 定期检查构建产物大小
- [ ] 使用 Webpack Bundle Analyzer 分析依赖
- [ ] 启用 Tree Shaking
- [ ] 优化图片资源

### 构建阶段

- [ ] 启用代码压缩和最小化
- [ ] 配置合理的代码分割策略
- [ ] 启用预加载关键资源
- [ ] 优化 CSS 和 JavaScript

### 部署阶段

- [ ] 启用 Gzip/Brotli 压缩
- [ ] 使用 CDN 加速静态资源
- [ ] 实施合适的缓存策略
- [ ] 监控关键性能指标

### 运行时

- [ ] 实施组件懒加载
- [ ] 使用虚拟滚动处理长列表
- [ ] 实施防抖和节流
- [ ] 合理使用计算属性缓存

### 持续优化

- [ ] 定期审查性能瓶颈
- [ ] 关注 Core Web Vitals 指标
- [ ] 优化 Largest Contentful Paint (LCP)
- [ ] 减少 First Input Delay (FID)
- [ ] 改善 Cumulative Layout Shift (CLS)

通过实施这些性能优化最佳实践，可以显著提升 Nuxt.js 应用的性能，为用户提供更好的体验。