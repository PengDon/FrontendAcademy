# Next.js 12 框架

## Next.js 12 简介

Next.js 12 是 React 应用开发的重要版本，它在性能、开发体验和功能方面都有显著提升。该版本引入了 Rust 编译器、SWC 编译器替代 Babel、以及对 React 18 的支持等重要特性。

## 核心特性

- **Rust 编译器**：使用 SWC 替代 Babel，编译速度提升 3 倍
- **React 18 支持**：支持 React 18 的新特性，如自动批处理、新的 root API 等
- **中间件 (Middleware)**：在请求完成之前执行代码，支持重写、重定向、修改响应头等
- **React Server Components**：实验性支持 React Server Components
- **URL Imports**：实验性支持从 URL 导入 ESM 模块
- **Bot-aware ISR Fallback**：增量静态再生的改进

## 目录

- [Next.js 12 简介](#nextjs-12-简介)
- [核心特性](#核心特性)
- [安装与环境配置](#安装与环境配置)
- [项目结构](#项目结构)
- [路由系统](#路由系统)
- [数据获取](#数据获取)
- [中间件](#中间件)
- [样式](#样式)
- [图像优化](#图像优化)
- [部署](#部署)
- [版本对比](#版本对比)

## 安装与环境配置

### 创建新的 Next.js 12 项目

```bash
# 使用 create-next-app 创建新项目
npx create-next-app@12 my-next12-app

# 进入项目目录
cd my-next12-app
```

### 手动安装

```bash
# 初始化项目
npm init -y

# 安装 Next.js 12
npm install next@12 react@17 react-dom@17

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

## 路由系统

Next.js 12 使用基于文件系统的路由：

```
pages/
├── index.js          # 根路径 /
├── about.js          # /about
├── products/
│   ├── index.js      # /products
│   └── [id].js       # /products/:id
└── [...slug].js      # 捕获所有路由
```

## 数据获取

Next.js 12 提供了多种数据获取方法：

### getServerSideProps

服务端渲染：

```javascript
export async function getServerSideProps(context) {
  const res = await fetch('https://api.example.com/data')
  const data = await res.json()
  
  return {
    props: {
      data
    }
  }
}

export default function Page({ data }) {
  return <div>{data.title}</div>
}
```

### getStaticProps

静态生成：

```javascript
export async function getStaticProps() {
  const res = await fetch('https://api.example.com/data')
  const data = await res.json()
  
  return {
    props: {
      data
    }
  }
}

export default function Page({ data }) {
  return <div>{data.title}</div>
}
```

### getStaticPaths

与动态路由配合使用：

```javascript
export async function getStaticPaths() {
  const res = await fetch('https://api.example.com/posts')
  const posts = await res.json()
  
  const paths = posts.map((post) => ({
    params: { id: post.id }
  }))
  
  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const res = await fetch(`https://api.example.com/posts/${params.id}`)
  const post = await res.json()
  
  return {
    props: {
      post
    }
  }
}

export default function Post({ post }) {
  return <div>{post.title}</div>
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

## 样式

### CSS Modules

```css
/* styles/Button.module.css */
.button {
  background-color: #0070f3;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
}
```

```javascript
// components/Button.js
import styles from '../styles/Button.module.css'

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
/* styles/globals.css */
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
}
```

```javascript
// pages/_app.js
import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```

## 图像优化

使用 Next.js 内置的 Image 组件：

```javascript
import Image from 'next/image'

export default function MyImage() {
  return (
    <Image
      src="/images/profile.jpg"
      alt="Profile"
      width={400}
      height={400}
    />
  )
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

有关 Next.js 12 与其他版本的详细对比，请参阅 [版本对比文档](./comparison.md)。

通过这些文档，您可以全面了解 Next.js 12 的特性和使用方法，并了解它与其他版本的差异。