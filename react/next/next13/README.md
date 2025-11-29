# Next.js 13 框架

## Next.js 13 简介

Next.js 13 是 React 生态系统中的一个重要里程碑版本，引入了全新的 App Router、React Server Components、Turbopack 构建工具等革命性特性。这些改进大大提升了开发体验和应用性能。

## 核心特性

- **App Router**：全新的基于文件系统的路由器，支持嵌套布局、服务端组件等
- **React Server Components**：在服务器上运行 React 组件，减少客户端 JavaScript 大小
- **Turbopack**：用 Rust 编写的全新构建工具，比 Webpack 快 700 倍
- **改进的数据获取**：使用 fetch API 和 React 的 Suspense 进行数据获取
- **流式渲染和 Suspense**：支持 React 的 Suspense 组件和流式 SSR
- **内置优化**：自动图像优化、字体优化和脚本优化

## 目录

- [Next.js 13 简介](#nextjs-13-简介)
- [核心特性](#核心特性)
- [安装与环境配置](#安装与环境配置)
- [项目结构](#项目结构)
- [App Router](#app-router)
- [服务端组件](#服务端组件)
- [数据获取](#数据获取)
- [样式](#样式)
- [图像优化](#图像优化)
- [中间件](#中间件)
- [部署](#部署)
- [版本对比](#版本对比)

## 安装与环境配置

### 创建新的 Next.js 13 项目

```bash
# 使用 create-next-app 创建新项目
npx create-next-app@latest my-next13-app

# 进入项目目录
cd my-next13-app
```

### 手动安装

```bash
# 初始化项目
npm init -y

# 安装 Next.js 13
npm install next@13 react@18 react-dom@18

# 安装 TypeScript (可选)
npm install -D typescript @types/react @types/node
```

在 `package.json` 中添加脚本：

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

## 项目结构

### Pages Router (传统方式)

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

### App Router (推荐方式)

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

## App Router

Next.js 13 引入了全新的 App Router，它基于文件系统并支持高级的 React 模式：

### 基本路由

```
app/
├── page.js          # /
├── about/
│   └── page.js      # /about
└── products/
    ├── page.js      # /products
    └── [id]/
        └── page.js  # /products/:id
```

### 嵌套路由和布局

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

// app/products/layout.js
export default function ProductsLayout({ children }) {
  return (
    <div>
      <nav>Products Navigation</nav>
      {children}
    </div>
  )
}
```

## 服务端组件

Next.js 13 默认支持 React Server Components：

```javascript
// app/product/[id]/page.js
// 这是一个服务端组件
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

客户端组件需要显式声明：

```javascript
// app/components/AddToCart.js
'use client'

import { useState } from 'react'

export default function AddToCart({ productId }) {
  const [count, setCount] = useState(0)
  
  const addToCart = () => {
    // 添加到购物车逻辑
    setCount(count + 1)
  }
  
  return (
    <button onClick={addToCart}>
      Add to Cart ({count})
    </button>
  )
}
```

## 数据获取

Next.js 13 简化了数据获取方式：

```javascript
// app/product/[id]/page.js
async function getProduct(id) {
  // 自动处理缓存和重新验证
  const res = await fetch(`https://api.example.com/products/${id}`, {
    next: { revalidate: 3600 } // 每小时重新验证
  })
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

## 样式

### CSS 模块

```css
/* app/components/Button.module.css */
.button {
  background-color: #0070f3;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
}
```

```javascript
// app/components/Button.js
import styles from './Button.module.css'

export default function Button({ children }) {
  return (
    <button className={styles.button}>
      {children}
    </button>
  )
}
```

### 全局样式

```css
/* app/globals.css */
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
}
```

```javascript
// app/layout.js
import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

## 图像优化

使用 Next.js 内置的 Image 组件：

```javascript
// app/page.js
import Image from 'next/image'

export default function HomePage() {
  return (
    <Image
      src="/images/profile.jpg"
      alt="Profile"
      width={400}
      height={400}
      priority // 立即加载重要图片
    />
  )
}
```

## 中间件

中间件在请求完成之前执行：

```javascript
// middleware.js
import { NextResponse } from 'next/server'

export function middleware(request) {
  // 检查认证状态
  const isAuthenticated = checkAuth(request)
  
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
}
```

## 部署

### Vercel 部署

Next.js 与 Vercel 深度集成，部署非常简单：

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

## 版本对比

有关 Next.js 13 与其他版本的详细对比，请参阅 [版本对比文档](./comparison.md)。

通过这些文档，您可以全面了解 Next.js 13 的特性和使用方法，并了解它与其他版本的差异。