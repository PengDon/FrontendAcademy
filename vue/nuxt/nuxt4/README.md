# Nuxt.js 4.x 框架

## Nuxt.js 4 简介

Nuxt.js 4 是基于 Vue 3 的下一代全栈框架，于2025年7月正式发布。它在 Nuxt.js 3 的基础上进行了全面升级，引入了增强的 Nitro 引擎、智能类型系统、响应式数据层等核心改进，为开发者提供更高效、更强大的开发体验。

## 核心特性

### 1. 增强的 Nitro 引擎
- **优化的服务器渲染**：更快的首屏加载速度
- **自动批处理**：智能合并状态更新，减少不必要的渲染
- **改进的构建优化**：更小的 bundle 体积和更快的构建速度
- **多平台部署支持**：支持 Vercel、Netlify、Cloudflare Pages 等多种部署环境

### 2. 智能类型系统
- **自动类型生成**：为组件、路由和API自动生成类型声明
- **类型安全的配置**：配置文件中的类型检查和自动补全
- **改进的TypeScript集成**：更好的开发体验和更少的运行时错误

### 3. 响应式数据层
- **统一的数据管理**：简化状态管理流程
- **智能缓存策略**：自动优化数据获取和缓存
- **数据预加载**：基于用户行为的智能数据预加载

### 4. 模块化架构优化
- **增强的模块系统**：更灵活的模块加载和配置
- **层架构改进**：更好的代码共享和复用
- **插件系统升级**：简化插件开发和集成

### 5. 新的 Composable API
- **优化的组合式函数**：更简洁、更高效的代码编写
- **自动导入增强**：更智能的组件和函数自动导入
- **生命周期钩子优化**：更细粒度的控制和更好的性能

## 目录

- [Nuxt.js 4 简介](#nuxtjs-4-简介)
- [核心特性](#核心特性)
- [安装与环境配置](#安装与环境配置)
- [目录结构](#目录结构)
- [核心概念详解](#核心概念详解)
- [高级特性](#高级特性)
- [迁移指南](#迁移指南)
- [最佳实践](#最佳实践)
- [版本对比](#版本对比)

## 安装与环境配置

### 创建新的 Nuxt.js 4 项目

```bash
# 使用 npx 创建新项目
npx nuxi@latest init my-nuxt4-app

# 进入项目目录
cd my-nuxt4-app

# 安装依赖
npm install
# 或使用 yarn
yarn install
```

### 从 Nuxt 3 迁移到 Nuxt 4

```bash
# 升级到 Nuxt 4
npx nuxi@latest upgrade --force

# 安装推荐的图标模块
npx nuxi module add icon
```

### 手动安装

```bash
# 手动初始化项目
mkdir my-nuxt4-app
cd my-nuxt4-app
npm init -y

# 安装 Nuxt.js 4
npm install nuxt@latest
# 或使用 yarn
yarn add nuxt@latest
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
    "nuxt": "^4.0.0"
  }
}
```

## 目录结构

Nuxt.js 4 在 Nuxt 3 的基础上进一步优化了目录结构，增强了模块化和可扩展性：

```
my-nuxt4-app/
├── .nuxt/           # 开发时的构建目录
├── app/             # 应用目录
│   ├── components/  # 组件目录
│   ├── composables/ # 组合式函数
│   ├── pages/       # 页面组件（路由）
│   ├── layouts/     # 页面布局
│   ├── plugins/     # Vue 插件
│   └── server/      # 应用级服务器功能
├── public/          # 静态资源（直接复制）
├── server/          # 服务端目录
│   ├── api/         # API 路由
│   ├── middleware/  # 服务端中间件
│   └── routes/      # 服务端路由
├── utils/           # 工具函数（Nuxt 4 推荐）
├── types/           # 类型定义（Nuxt 4 推荐）
├── nuxt.config.ts   # Nuxt.js 配置文件
├── package.json     # 项目依赖
└── tsconfig.json    # TypeScript 配置
```

## 核心概念详解

### 1. 智能路由系统

Nuxt 4 增强了路由系统，提供了更智能的路由检测和优化：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    routes: {
      // 启用智能路由检测
      smartDetection: true,
      // 智能预加载策略
      preloadStrategy: 'smart'
    }
  }
})
```

路由优先级规则：
1. 静态路由优先于动态路由
2. 嵌套路由遵循目录结构
3. `_slug.vue` 匹配动态参数
4. `[...slug].vue` 匹配捕获所有参数

### 2. 增强的 Nitro 引擎实现

Nuxt 4 的 Nitro 引擎经过全面升级，提供了更好的性能和灵活性：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    // 使用增强引擎
    engine: 'enhanced',
    // 响应式数据层
    dataLayer: {
      enabled: true,
      cacheStrategy: 'smart'
    },
    // 自动批处理
    autoBatching: true
  }
})
```

Nitro 引擎的核心优化：
- 自动代码分割优化
- 智能缓存管理
- 响应式数据更新
- 多平台部署支持

### 3. 智能类型系统

Nuxt 4 引入了智能类型生成，大幅提升了开发体验：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  typescript: {
    // 启用智能类型生成
    smartTypeGeneration: true,
    // 严格模式
    strict: true
  }
})
```

智能类型系统特性：
- 组件 props 和 emits 的自动类型生成
- API 响应类型推断
- 路由参数类型安全
- 配置文件的类型检查

### 4. 响应式数据层

Nuxt 4 引入了统一的响应式数据层，简化状态管理：

```typescript
// composables/useDataStore.ts
export const useDataStore = defineStore('data', () => {
  const items = ref([])
  const loading = ref(false)
  
  async function fetchItems() {
    loading.value = true
    // 使用自动批处理和智能缓存
    const response = await useFetch('/api/items')
    items.value = response.data.value
    loading.value = false
  }
  
  return {
    items,
    loading,
    fetchItems
  }
})
```

响应式数据层特性：
- 统一的数据获取 API
- 智能缓存策略
- 自动批处理更新
- 响应式状态管理

### 5. 新的 Composable API

Nuxt 4 提供了优化的组合式 API，简化开发：

```typescript
// composables/useCounter.ts
export function useCounter(initial = 0) {
  const count = ref(initial)
  
  // 使用优化的 watchEffect
  watchEffect(() => {
    console.log(`Count updated: ${count.value}`)
  })
  
  function increment() {
    count.value++
  }
  
  function decrement() {
    count.value--
  }
  
  return {
    count,
    increment,
    decrement
  }
}
```

常用的组合式函数：
- `useFetch` - 优化的数据获取
- `useRoute` - 路由访问和监听
- `useNuxtApp` - Nuxt 应用实例
- `useHead` - 动态管理页面头部

## 高级特性

### 1. 自动批处理优化

Nuxt 4 的自动批处理功能可以智能合并状态更新，减少渲染次数：

```typescript
// 在组件中
const { data: user } = await useFetch('/api/user')
const { data: posts } = await useFetch('/api/posts')

// Nuxt 4 会自动批处理这两个状态更新
```

### 2. 智能组件检测

Nuxt 4 增强了组件自动导入功能：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  components: {
    global: true,
    smartDetection: true,
    dirs: [
      '~/app/components',
      '~/components'
    ]
  }
})
```

### 3. 增强的服务器功能

Nuxt 4 提供了更强大的服务器功能：

```typescript
// server/api/hello.ts
import { defineEventHandler } from 'h3'

export default defineEventHandler((event) => {
  // 使用增强的事件处理
  const query = getQuery(event)
  
  return {
    message: 'Hello from Nuxt 4 API!',
    timestamp: new Date().toISOString()
  }
})
```

### 4. 性能优化策略

Nuxt 4 的性能优化策略：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  build: {
    optimize: true,
    optimization: {
      splitChunks: {
        strategy: 'smart'
      }
    }
  },
  devServer: {
    hmr: {
      optimized: true
    }
  }
})
```

## 迁移指南

### 从 Nuxt 3 迁移到 Nuxt 4

1. **更新依赖**：
   ```bash
   npx nuxi@latest upgrade --force
   ```

2. **更新配置文件**：
   - 配置文件格式保持兼容
   - 添加新的优化配置选项

3. **更新 API 调用**：
   - 适配新的组合式 API 优化
   - 使用自动批处理功能

4. **更新服务器路由**：
   - 确保符合增强的服务器功能要求

## 最佳实践

### 1. 项目结构优化
- 按功能模块组织代码
- 合理使用 composables 目录
- 使用 utils 和 types 目录管理工具函数和类型定义

### 2. 性能优化
- 启用自动批处理
- 使用智能缓存策略
- 合理配置路由预加载

### 3. 开发效率提升
- 利用智能类型系统
- 使用自动组件导入
- 采用新的 Composable API

## 常见问题

### Q: Nuxt 4 支持 Vue 2 吗？
A: 不，Nuxt 4 仅支持 Vue 3，因为它充分利用了 Vue 3 的组合式 API 和其他新特性。

### Q: 如何启用响应式数据层？
A: 在 nuxt.config.ts 中配置 nitro.dataLayer.enabled = true 即可启用。

### Q: 智能类型生成如何工作？
A: 智能类型生成会分析你的组件、API 和配置，自动生成对应的 TypeScript 类型声明。

### Q: 自动批处理有什么优势？
A: 自动批处理可以智能合并多个状态更新，减少不必要的渲染，提高应用性能。

### Q: 从 Nuxt 2 迁移到 Nuxt 4 需要注意什么？
A: 建议先迁移到 Nuxt 3，然后再迁移到 Nuxt 4，因为 Nuxt 4 在 Nuxt 3 的基础上进行了改进。

## 版本对比

有关 Nuxt 4 与其他版本的详细对比，请参阅 [版本对比文档](./comparison.md)。

通过这些文档，您可以全面了解 Nuxt.js 4.x 的特性和使用方法，并了解它与其他版本的差异。