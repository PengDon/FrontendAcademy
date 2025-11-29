# Nuxt.js 最佳实践指南

## 目录结构最佳实践

### 通用项目结构

一个良好的 Nuxt 项目应该遵循清晰的目录结构：

```
my-nuxt-app/
├── app/                    # 应用源码
│   ├── components/         # 可复用组件
│   ├── composables/        # 组合式函数
│   ├── layouts/            # 布局组件
│   ├── pages/              # 页面组件
│   ├── plugins/            # 插件
│   └── app.vue             # 根应用组件
├── assets/                 # 未编译的资源文件
│   ├── css/                # 样式文件
│   └── images/             # 图片资源
├── public/                 # 静态资源文件
├── server/                 # 服务端代码
│   ├── api/                # API 路由
│   └── middleware/         # 服务端中间件
├── composables/            # 全局组合式函数
├── components/             # 全局组件
├── layouts/                # 全局布局
├── pages/                  # 全局页面
├── utils/                  # 工具函数
├── types/                  # TypeScript 类型定义
├── modules/                # 自定义模块
├── nuxt.config.ts          # Nuxt 配置文件
└── package.json            # 项目依赖
```

### 大型项目结构优化

对于大型项目，建议按功能模块划分：

```
my-nuxt-app/
├── app/
│   ├── modules/            # 功能模块
│   │   ├── user/           # 用户模块
│   │   │   ├── components/
│   │   │   ├── composables/
│   │   │   ├── pages/
│   │   │   └── types/
│   │   ├── product/        # 产品模块
│   │   └── order/          # 订单模块
│   ├── components/
│   ├── composables/
│   ├── layouts/
│   └── app.vue
├── ...
```

## 性能优化最佳实践

### 1. 代码分割优化

合理使用动态导入来分割代码：

```javascript
// 在页面中按需加载组件
export default {
  components: {
    HeavyComponent: () => import('~/components/HeavyComponent.vue')
  }
}
```

### 2. 图片优化

使用 Nuxt Image 模块优化图片：

```vue
<template>
  <NuxtImg
    src="/image.png"
    sizes="sm:100vw md:50vw lg:400px"
    provider="cloudinary"
  />
</template>
```

### 3. 预加载策略

合理配置预加载策略：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  experimental: {
    payloadExtraction: true,
    inlineSSRStyles: false
  },
  nitro: {
    prerender: {
      crawlLinks: true
    }
  }
})
```

### 4. 缓存策略

使用适当的缓存策略：

```typescript
// server/api/data.ts
export default defineEventHandler({
  onRequest: [
    // 设置缓存头
    setHeader('Cache-Control', 'public, max-age=3600')
  ],
  async handler(event) {
    // API 逻辑
  }
})
```

## 数据获取最佳实践

### 1. 合理选择数据获取方法

```typescript
// 对于页面级数据获取，使用 useAsyncData
const { data: products } = await useAsyncData('products', () => $fetch('/api/products'))

// 对于组件级数据获取，使用 useFetch
const { data: user } = await useFetch('/api/user')

// 对于不需要服务端渲染的数据，使用 useLazyAsyncData
const { data: notifications } = useLazyAsyncData('notifications', () => $fetch('/api/notifications'))
```

### 2. 错误处理

始终处理数据获取的错误情况：

```typescript
const { data, error } = await useAsyncData('products', () => $fetch('/api/products'))

if (error.value) {
  // 处理错误
  console.error('获取产品数据失败:', error.value)
}
```

### 3. 数据缓存

合理使用缓存避免重复请求：

```typescript
// 使用相同的 key 可以共享数据
const { data: user } = await useAsyncData('user', () => $fetch('/api/user'))
```

## 安全最佳实践

### 1. 环境变量安全

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    // 服务端可用，客户端不可用
    secretKey: process.env.SECRET_KEY,
    public: {
      // 客户端和服务端都可用
      baseURL: process.env.BASE_URL
    }
  }
})
```

### 2. 输入验证

始终验证用户输入：

```typescript
// server/api/user/[id].ts
export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  
  // 验证参数
  if (!id || !/^\d+$/.test(id)) {
    throw createError({
      statusCode: 400,
      message: '无效的用户ID'
    })
  }
  
  // 处理业务逻辑
})
```

### 3. CSP 配置

配置内容安全策略：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  security: {
    headers: {
      contentSecurityPolicy: {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'unsafe-inline'"],
        'style-src': ["'self'", "'unsafe-inline'"]
      }
    }
  }
})
```

## SEO 最佳实践

### 1. 元标签管理

```vue
<script setup>
useHead({
  title: '页面标题',
  meta: [
    { name: 'description', content: '页面描述' },
    { property: 'og:title', content: '页面标题' },
    { property: 'og:description', content: '页面描述' }
  ]
})
</script>
```

### 2. 结构化数据

```vue
<script setup>
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: '文章标题'
      })
    }
  ]
})
</script>
```

## 测试最佳实践

### 1. 单元测试

```typescript
// composables/useCounter.test.ts
import { useCounter } from './useCounter'

describe('useCounter', () => {
  it('应该正确增加计数', () => {
    const { count, increment } = useCounter()
    increment()
    expect(count.value).toBe(1)
  })
})
```

### 2. 组件测试

```typescript
// components/MyButton.test.ts
import { mount } from '@vue/test-utils'
import MyButton from './MyButton.vue'

describe('MyButton', () => {
  it('应该正确渲染按钮文本', () => {
    const wrapper = mount(MyButton, {
      props: {
        text: '点击我'
      }
    })
    expect(wrapper.text()).toContain('点击我')
  })
})
```

## 部署最佳实践

### 1. 静态部署

```bash
# 生成静态站点
npm run generate

# 预览静态站点
npm run preview
```

### 2. 服务端部署

```bash
# 构建应用
npm run build

# 启动服务
npm run start
```

### 3. Docker 部署

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
```

## 维护最佳实践

### 1. 版本管理

使用语义化版本管理：

```json
{
  "name": "my-nuxt-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "generate": "nuxt generate",
    "preview": "nuxt preview"
  }
}
```

### 2. 依赖更新

定期更新依赖：

```bash
# 检查过时的依赖
npm outdated

# 更新依赖
npm update
```

### 3. 代码质量

使用 ESLint 和 Prettier 保证代码质量：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  typescript: {
    strict: true
  },
  eslint: {
    lintOnStart: true
  }
})
```

## 常见问题解决方案

### 1. hydration 错误

确保服务端和客户端渲染的内容一致：

```vue
<template>
  <!-- 避免在服务端和客户端渲染不同的内容 -->
  <div v-if="typeof window !== 'undefined'">客户端内容</div>
</template>
```

### 2. 内存泄漏

及时清理事件监听器和定时器：

```typescript
// composables/useTimer.ts
export function useTimer() {
  let timer: NodeJS.Timeout | null = null
  
  onUnmounted(() => {
    if (timer) {
      clearInterval(timer)
    }
  })
  
  // 其他逻辑
}
```

通过遵循这些最佳实践，你可以构建出高性能、安全、易于维护的 Nuxt.js 应用。