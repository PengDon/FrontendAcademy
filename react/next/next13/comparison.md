# Next.js 13 与其他版本的对比

## 目录

- [Next.js 13 vs Next.js 12](#nextjs-13-vs-nextjs-12)
- [Next.js 13 vs Next.js 14](#nextjs-13-vs-nextjs-14)
- [迁移建议](#迁移建议)

## Next.js 13 vs Next.js 12

### 核心架构差异

| 特性 | Next.js 12 | Next.js 13 |
|------|------------|------------|
| 默认路由系统 | Pages Router | App Router (可选) |
| React 版本 | React 17/18 | React 18+ |
| 构建工具 | Webpack 5 | Turbopack (实验性) |
| 服务端组件 | 不支持 | 支持 (App Router) |
| 流式渲染 | 有限支持 | 原生支持 |
| 数据获取 | getServerSideProps, getStaticProps | async/await, fetch |

### 目录结构

**Next.js 12:**
```
my-next12-app/
├── pages/
│   ├── api/
│   ├── _app.js
│   ├── _document.js
│   └── index.js
├── public/
├── styles/
├── next.config.js
└── package.json
```

**Next.js 13 (Pages Router):**
```
my-next13-app/
├── pages/
│   ├── api/
│   ├── _app.js
│   ├── _document.js
│   └── index.js
├── public/
├── styles/
├── next.config.js
└── package.json
```

**Next.js 13 (App Router):**
```
my-next13-app/
├── app/
│   ├── api/
│   ├── components/
│   ├── layout.js
│   ├── page.js
│   └── globals.css
├── public/
├── next.config.js
└── package.json
```

### 数据获取方式

**Next.js 12:**
```javascript
// pages/product/[id].js
export async function getServerSideProps(context) {
  const { id } = context.params
  const res = await fetch(`https://api.example.com/products/${id}`)
  const product = await res.json()
  
  return {
    props: {
      product
    }
  }
}

export default function Product({ product }) {
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </div>
  )
}
```

**Next.js 13 (Pages Router):**
```javascript
// pages/product/[id].js
// 与 Next.js 12 相同
```

**Next.js 13 (App Router):**
```javascript
// app/product/[id]/page.js
async function getProduct(id) {
  const res = await fetch(`https://api.example.com/products/${id}`)
  return res.json()
}

export default async function Product({ params }) {
  const product = await getProduct(params.id)
  
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </div>
  )
}
```

### 组件模型

**Next.js 12:**
```javascript
// pages/index.js
import Head from 'next/head'

export default function Home() {
  return (
    <div>
      <Head>
        <title>My App</title>
      </Head>
      <main>
        <h1>Hello World</h1>
      </main>
    </div>
  )
}
```

**Next.js 13 (App Router):**
```javascript
// app/layout.js
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>Navigation</header>
        <main>{children}</main>
        <footer>Footer</footer>
      </body>
    </html>
  )
}

// app/page.js
export default function Home() {
  return (
    <main>
      <h1>Hello World</h1>
    </main>
  )
}
```

## Next.js 13 vs Next.js 14

### 核心改进

Next.js 14 在 Next.js 13 的基础上进行了以下改进：

1. **TurboPack 稳定性提升**
   - 更快的构建速度
   - 更好的开发体验
   - 改进的缓存机制

2. **部分预渲染 (PPR)**
   - 静态部分立即显示
   - 动态部分流式加载
   - 更好的用户体验

3. **函数组件优化**
   - 更好的服务端组件支持
   - 改进的客户端组件水合
   - 更小的包体积

### 配置差异

**Next.js 13:**
```javascript
// next.config.js
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true
  }
}

module.exports = nextConfig
```

**Next.js 14:**
```javascript
// next.config.js
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // 部分预渲染配置
  experimental: {
    ppr: true
  }
}

module.exports = nextConfig
```

### 新特性支持

| 特性 | Next.js 12 | Next.js 13 | Next.js 14 |
|------|------------|------------|------------|
| React 18 | ✅ | ✅ | ✅ |
| App Router | ❌ | ✅ | ✅ |
| Server Components | ❌ | ✅ | ✅✅ |
| 流式渲染 | 有限 | ✅ | ✅✅ |
| Turbopack | ❌ | 实验性 | 稳定版 |
| 部分预渲染 | ❌ | ❌ | ✅ |

## 迁移建议

### 从 Next.js 12 迁移到 Next.js 13

1. **准备工作**
   - 确保团队熟悉 React Server Components
   - 评估现有应用的复杂度
   - 制定迁移计划

2. **逐步迁移**
   - 升级到 Next.js 13 但继续使用 Pages Router
   - 逐步将页面迁移到 App Router
   - 更新数据获取方式

3. **测试验证**
   - 功能测试确保业务逻辑正确
   - 性能测试验证优化效果
   - SEO 测试确保搜索引擎友好

### 从 Next.js 13 升级到 Next.js 14

1. **准备工作**
   - 检查依赖兼容性
   - 备份项目代码
   - 查看官方迁移指南

2. **升级步骤**
   ```bash
   # 更新 Next.js 版本
   npm install next@latest react@latest react-dom@latest
   ```

3. **配置更新**
   - 更新 next.config.js 配置
   - 利用新特性优化应用
   - 测试所有功能

通过了解这些版本之间的差异，您可以更好地选择适合您项目需求的 Next.js 版本，并制定相应的迁移策略。