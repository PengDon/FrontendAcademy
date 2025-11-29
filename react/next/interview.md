# Next.js 面试重点内容

## 目录

- [核心概念](#核心概念)
- [SSR vs SSG vs CSR](#ssr-vs-ssg-vs-csr)
- [数据获取方法](#数据获取方法)
- [路由系统](#路由系统)
- [性能优化](#性能优化)
- [部署策略](#部署策略)
- [App Router vs Pages Router](#app-router-vs-pages-router)
- [常见问题解答](#常见问题解答)

## 核心概念

### 什么是 Next.js？

Next.js 是一个基于 React 的全栈框架，它为现代 Web 应用提供了服务端渲染、静态站点生成、API 路由等功能。它解决了 React 应用开发中的许多常见挑战，如性能优化、SEO 友好性和开发体验等。

### Next.js 的主要特性

1. **服务端渲染 (SSR)** - 在服务器端渲染页面，提高首屏加载性能和 SEO
2. **静态站点生成 (SSG)** - 在构建时生成静态 HTML 文件，提供极致的加载性能
3. **增量静态再生 (ISR)** - 结合静态生成和动态内容更新的优点
4. **基于文件的路由** - 通过文件系统自动生成路由
5. **API 路由** - 在同一代码库中创建 API 端点
6. **自动代码分割** - 按需加载代码，优化性能
7. **图像优化** - 自动优化图像，提升加载速度

### Next.js 与 React 的区别

| 特性 | React | Next.js |
|------|-------|---------|
| 路由 | 需要手动配置 | 基于文件系统自动生成 |
| 服务端渲染 | 需要额外配置 | 内置支持 |
| 静态生成 | 需要额外工具 | 内置支持 |
| 代码分割 | 需要手动配置 | 自动处理 |
| SEO | 需要额外处理 | 内置优化 |
| API 路由 | 需要单独后端 | 内置支持 |

## SSR vs SSG vs CSR

### 服务端渲染 (SSR)

**工作原理**：
1. 用户请求页面
2. 服务端执行 React 组件，生成 HTML
3. 将渲染好的 HTML 发送给客户端
4. 客户端"激活" HTML，使其具有交互性

**优点**：
- 更好的 SEO
- 更快的首屏加载
- 更好的社交分享体验

**缺点**：
- 服务端压力较大
- TTFB(Time To First Byte)可能较长

**使用场景**：
- 需要 SEO 的页面
- 数据频繁更新的页面
- 社交媒体分享重要的页面

### 静态站点生成 (SSG)

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

**使用场景**：
- 博客、文档网站
- 内容不频繁变化的网站
- 对性能要求极高的场景

### 客户端渲染 (CSR)

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

**使用场景**：
- 仪表板和管理界面
- 用户认证后的页面
- 实时数据应用

## 数据获取方法

### Next.js 12 及之前版本

1. **getServerSideProps** - 服务端渲染时获取数据
2. **getStaticProps** - 构建时获取静态数据
3. **getStaticPaths** - 与动态路由配合使用
4. **客户端 fetch** - 在组件中使用 useEffect 或事件处理函数获取数据

### Next.js 13 及之后版本 (App Router)

1. **服务端组件中的 async/await** - 在服务端组件中直接使用 async/await
2. **客户端组件中的 useEffect** - 在客户端组件中使用 useEffect 获取数据
3. **React Query/SWR** - 使用数据获取库管理缓存和状态

### 数据获取策略选择

```javascript
// 服务端渲染 - 适用于需要 SEO 和实时数据的页面
export async function getServerSideProps() {
  const data = await fetch('https://api.example.com/data')
  return {
    props: {
      data: await data.json()
    }
  }
}

// 静态生成 - 适用于内容不频繁变化的页面
export async function getStaticProps() {
  const data = await fetch('https://api.example.com/data')
  return {
    props: {
      data: await data.json()
    },
    revalidate: 60 // 每分钟重新验证一次
  }
}

// 增量静态再生 - 结合了 SSG 和 SSR 的优点
export async function getStaticProps() {
  const data = await fetch('https://api.example.com/data')
  return {
    props: {
      data: await data.json()
    },
    revalidate: 60
  }
}
```

## 路由系统

### Pages Router

基于文件系统的路由：

```bash
pages/
├── index.js         # /
├── about.js         # /about
├── products/
│   ├── index.js     # /products
│   └── [id].js      # /products/:id
└── [...slug].js     # 捕获所有路由
```

### App Router

更灵活的路由系统：

```bash
app/
├── page.js          # /
├── about/
│   └── page.js      # /about
├── products/
│   ├── page.js      # /products
│   └── [id]/
│       └── page.js  # /products/:id
└── (marketing)/
    └── page.js      # 组织目的的路由组
```

### 动态路由参数

```javascript
// pages/products/[id].js
export async function getServerSideProps({ params }) {
  const { id } = params
  // 使用 id 获取产品数据
}

// app/products/[id]/page.js
export default function Product({ params }) {
  const { id } = params
  // 使用 id 获取产品数据
}
```

### 编程式导航

```javascript
import { useRouter } from 'next/router' // Pages Router
import { useRouter } from 'next/navigation' // App Router

function MyComponent() {
  const router = useRouter()
  
  const handleClick = () => {
    router.push('/about')
  }
  
  return <button onClick={handleClick}>Go to About</button>
}
```

## 性能优化

### 关键优化策略

1. **图像优化** - 使用 next/image 组件
2. **代码分割** - 自动代码分割和动态导入
3. **缓存策略** - 合理使用 ISR 和缓存头
4. **懒加载** - 组件和图像的懒加载
5. **预加载** - 链接预加载和数据预获取

### 图像优化

```javascript
import Image from 'next/image'

export default function MyImage() {
  return (
    <Image
      src="/images/profile.jpg"
      alt="Profile"
      width={400}
      height={400}
      priority // 重要图像立即加载
    />
  )
}
```

### 代码分割

```javascript
// 动态导入组件
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('../components/HeavyComponent'))

export default function MyPage() {
  return (
    <div>
      <HeavyComponent />
    </div>
  )
}
```

### 缓存策略

```javascript
// 使用 ISR 缓存数据
export async function getStaticProps() {
  const data = await fetch('https://api.example.com/data')
  return {
    props: {
      data: await data.json()
    },
    revalidate: 60 // 每分钟重新验证
  }
}
```

## 部署策略

### Vercel 部署

Next.js 与 Vercel 深度集成：

```bash
# 安装 Vercel CLI
npm install -g vercel

# 部署项目
vercel
```

### 自定义部署

```bash
# 构建项目
npm run build

# 启动服务
npm start
```

### 静态导出

```javascript
// next.config.js
module.exports = {
  output: 'export'
}
```

```bash
# 导出静态文件
npm run build
```

## App Router vs Pages Router

### 主要区别

| 牟能 | Pages Router | App Router |
|------|--------------|------------|
| 路由系统 | 基于 pages 目录 | 基于 app 目录 |
| 布局系统 | _app.js 和 _document.js | 嵌套布局 |
| 服务端组件 | 不支持 | 原生支持 |
| 数据获取 | getServerSideProps 等 | async/await |
| 加载状态 | 自定义 | 内置 Suspense |
| 错误处理 | _error.js | error.js |
| 加载状态 | 无内置支持 | loading.js |

### 迁移考虑

1. **渐进式迁移** - 可以同时使用两种路由系统
2. **学习成本** - 团队需要学习新的概念
3. **生态系统支持** - 第三方库可能需要更新

## 常见问题解答

### Q: Next.js 支持哪些渲染模式？

A: Next.js 支持多种渲染模式：
1. **静态生成 (SSG)** - 构建时生成静态页面
2. **服务端渲染 (SSR)** - 请求时服务端渲染
3. **增量静态再生 (ISR)** - 结合 SSG 和 SSR
4. **客户端渲染 (CSR)** - 完全客户端渲染

### Q: 如何处理服务端和客户端环境差异？

A: 使用以下方法：
```javascript
// 检查是否在客户端
if (typeof window !== 'undefined') {
  // 客户端代码
}

// 使用 useEffect 确保在客户端执行
useEffect(() => {
  // 客户端代码
}, [])
```

### Q: 如何优化 Next.js 应用的 SEO？

A: 优化策略包括：
1. 使用服务端渲染或静态生成
2. 合理设置 meta 标签
3. 实现结构化数据
4. 生成站点地图
5. 配置 robots.txt

### Q: Next.js 如何处理状态管理？

A: Next.js 支持多种状态管理方案：
1. **React Context** - 内置状态管理
2. **Redux** - 流行的状态管理库
3. **Zustand** - 轻量级状态管理
4. **Recoil** - Facebook 的状态管理库

### Q: Next.js 13 与 Next.js 12 的主要区别？

A: 主要区别包括：
1. **App Router** - 全新的路由系统
2. **React Server Components** - 服务端组件支持
3. **Turbopack** - 新的构建工具
4. **数据获取** - 简化的数据获取方式
5. **样式** - 改进的样式支持

通过掌握这些面试重点内容，你将能够在面试中展现出对 Next.js 的深入理解，并能够回答大部分相关技术问题。