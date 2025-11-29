# Nuxt.js 博客应用示例

## 目录

- [项目概述](#项目概述)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [核心功能实现](#核心功能实现)
- [数据获取](#数据获取)
- [路由设计](#路由设计)
- [UI 组件](#ui-组件)
- [SEO 优化](#seo-优化)
- [部署](#部署)

## 项目概述

本示例演示如何使用 Nuxt.js 构建一个功能完整的博客应用。该博客应用包含文章列表、文章详情、分类、标签、搜索等功能，展示了 Nuxt.js 在实际项目中的应用。

### 功能特性

1. **首页** - 展示最新文章列表
2. **文章详情页** - 显示文章内容和评论
3. **分类页面** - 按分类浏览文章
4. **标签页面** - 按标签筛选文章
5. **搜索功能** - 全文搜索文章
6. **RSS 订阅** - 提供 RSS 订阅功能
7. **SEO 优化** - 针对搜索引擎优化
8. **响应式设计** - 适配各种设备屏幕

## 技术栈

- **Nuxt.js 3** - Vue.js 框架
- **Tailwind CSS** - CSS 框架
- **Markdown** - 文章内容格式
- **Content Module** - 内容管理
- **Pinia** - 状态管理
- **TypeScript** - 类型检查

## 项目结构

```
blog-app/
├── app/
│   ├── components/
│   │   ├── BlogPostCard.vue
│   │   ├── CategoryList.vue
│   │   ├── TagList.vue
│   │   ├── SearchBar.vue
│   │   └── Header.vue
│   ├── composables/
│   │   └── useBlog.ts
│   ├── layouts/
│   │   └── default.vue
│   ├── pages/
│   │   ├── index.vue
│   │   ├── blog/
│   │   │   ├── index.vue
│   │   │   └── [slug].vue
│   │   ├── categories/
│   │   │   ├── index.vue
│   │   │   └── [category].vue
│   │   ├── tags/
│   │   │   ├── index.vue
│   │   │   └── [tag].vue
│   │   └── search.vue
│   ├── app.vue
├── assets/
│   └── css/
│       └── tailwind.css
├── content/
│   └── blog/
│       ├── first-post.md
│       ├── second-post.md
│       └── third-post.md
├── server/
│   ├── api/
│   │   └── search.ts
│   └── routes/
│       └── rss.xml.ts
├── nuxt.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 核心功能实现

### 1. 内容管理

使用 Nuxt Content 模块管理博客文章。

安装模块：

```bash
npm install @nuxt/content
```

配置 `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: ['@nuxt/content'],
  
  content: {
    // https://content.nuxtjs.org/api/configuration
    highlight: {
      theme: 'github-dark'
    }
  }
})
```

### 2. 文章内容格式

创建 Markdown 格式的文章：

```markdown
---
title: '我的第一篇博客文章'
description: '这是我的第一篇博客文章的简短描述'
date: '2023-01-01'
category: '教程'
tags: ['Nuxt', 'Vue', 'JavaScript']
author: '张三'
---

# 欢迎来到我的博客

这是我的第一篇博客文章。

## 二级标题

这里是一些内容...

### 三级标题

更多内容...
```

### 3. 首页实现

```vue
<!-- app/pages/index.vue -->
<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-8 text-center">我的博客</h1>
    
    <div class="mb-8">
      <SearchBar />
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <BlogPostCard 
        v-for="post in posts" 
        :key="post._path"
        :post="post"
      />
    </div>
    
    <div class="mt-8 flex justify-center">
      <button 
        v-if="hasMore"
        @click="loadMore"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        加载更多
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: posts, pending } = await useAsyncData('posts', () => {
  return queryContent('/blog')
    .sort({ date: -1 })
    .limit(6)
    .find()
})

const hasMore = ref(true)

async function loadMore() {
  // 实现加载更多逻辑
}
</script>
```

### 4. 文章详情页

```vue
<!-- app/pages/blog/[slug].vue -->
<template>
  <article v-if="post" class="max-w-3xl mx-auto px-4 py-8">
    <header class="mb-8">
      <h1 class="text-3xl font-bold mb-4">{{ post.title }}</h1>
      
      <div class="flex items-center text-gray-600 mb-4">
        <span>{{ formatDate(post.date) }}</span>
        <span class="mx-2">•</span>
        <span>{{ post.author }}</span>
      </div>
      
      <div class="flex flex-wrap gap-2 mb-4">
        <NuxtLink 
          v-for="tag in post.tags"
          :key="tag"
          :to="`/tags/${tag}`"
          class="px-2 py-1 bg-gray-200 rounded text-sm"
        >
          {{ tag }}
        </NuxtLink>
      </div>
    </header>
    
    <div class="prose max-w-none">
      <ContentDoc />
    </div>
    
    <footer class="mt-8 pt-8 border-t">
      <div class="flex justify-between">
        <NuxtLink 
          v-if="prev"
          :to="prev._path"
          class="text-blue-500 hover:underline"
        >
          ← {{ prev.title }}
        </NuxtLink>
        
        <NuxtLink 
          v-if="next"
          :to="next._path"
          class="text-blue-500 hover:underline"
        >
          {{ next.title }} →
        </NuxtLink>
      </div>
    </footer>
  </article>
</template>

<script setup lang="ts">
const { path } = useRoute()

const { data: post } = await useAsyncData(`post-${path}`, () => {
  return queryContent(path).findOne()
})

const { data: surround } = await useAsyncData(`surround-${path}`, () => {
  return queryContent('/blog')
    .sort({ date: -1 })
    .only(['_path', 'title', 'date'])
    .findSurround(path)
})

const [prev, next] = surround.value || []

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('zh-CN')
}
</script>
```

## 数据获取

### 1. 使用 Content Query

```typescript
// composables/useBlog.ts
export function useBlog() {
  // 获取所有文章
  const getPosts = async (limit = 10) => {
    return queryContent('/blog')
      .sort({ date: -1 })
      .limit(limit)
      .find()
  }
  
  // 根据分类获取文章
  const getPostsByCategory = async (category: string) => {
    return queryContent('/blog')
      .where({ category })
      .sort({ date: -1 })
      .find()
  }
  
  // 根据标签获取文章
  const getPostsByTag = async (tag: string) => {
    return queryContent('/blog')
      .where({ tags: { $contains: tag } })
      .sort({ date: -1 })
      .find()
  }
  
  // 获取所有分类
  const getCategories = async () => {
    return queryContent('/blog')
      .only(['category'])
      .find()
      .then(posts => {
        const categories = [...new Set(posts.map(post => post.category))]
        return categories
      })
  }
  
  // 获取所有标签
  const getTags = async () => {
    return queryContent('/blog')
      .only(['tags'])
      .find()
      .then(posts => {
        const tags = [...new Set(posts.flatMap(post => post.tags))]
        return tags
      })
  }
  
  return {
    getPosts,
    getPostsByCategory,
    getPostsByTag,
    getCategories,
    getTags
  }
}
```

### 2. 搜索功能

```typescript
// server/api/search.ts
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const searchTerm = query.q as string
  
  if (!searchTerm) {
    return []
  }
  
  const results = await queryContent('/blog')
    .where({
      $or: [
        { title: { $icontains: searchTerm } },
        { description: { $icontains: searchTerm } },
        { body: { $icontains: searchTerm } }
      ]
    })
    .sort({ date: -1 })
    .find()
  
  return results
})
```

前端搜索组件：

```vue
<!-- app/components/SearchBar.vue -->
<template>
  <div class="relative">
    <input
      v-model="searchTerm"
      type="text"
      placeholder="搜索文章..."
      class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      @input="debouncedSearch"
    >
    
    <div 
      v-if="results.length > 0 && searchTerm" 
      class="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg"
    >
      <NuxtLink
        v-for="result in results"
        :key="result._path"
        :to="result._path"
        class="block px-4 py-2 hover:bg-gray-100"
        @click="clearSearch"
      >
        {{ result.title }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const searchTerm = ref('')
const results = ref([])

const debouncedSearch = useDebounceFn(async () => {
  if (searchTerm.value.length > 2) {
    const response = await $fetch('/api/search', {
      query: { q: searchTerm.value }
    })
    results.value = response
  } else {
    results.value = []
  }
}, 300)

function clearSearch() {
  searchTerm.value = ''
  results.value = []
}
</script>
```

## 路由设计

### 1. 动态路由

```bash
pages/
├── blog/
│   ├── index.vue          # /blog - 博客列表
│   └── [slug].vue         # /blog/my-first-post - 文章详情
├── categories/
│   ├── index.vue          # /categories - 所有分类
│   └── [category].vue     # /categories/tutorial - 特定分类
└── tags/
    ├── index.vue          # /tags - 所有标签
    └── [tag].vue          # /tags/nuxt - 特定标签
```

### 2. 分类页面

```vue
<!-- app/pages/categories/[category].vue -->
<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">分类: {{ category }}</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <BlogPostCard 
        v-for="post in posts" 
        :key="post._path"
        :post="post"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const category = route.params.category

const { data: posts } = await useAsyncData(`category-${category}`, () => {
  return queryContent('/blog')
    .where({ category })
    .sort({ date: -1 })
    .find()
})
</script>
```

## UI 组件

### 1. 文章卡片组件

```vue
<!-- app/components/BlogPostCard.vue -->
<template>
  <article class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    <div class="p-6">
      <NuxtLink :to="post._path" class="block mb-2">
        <h2 class="text-xl font-semibold hover:text-blue-600">{{ post.title }}</h2>
      </NuxtLink>
      
      <p class="text-gray-600 text-sm mb-4">{{ post.description }}</p>
      
      <div class="flex items-center text-gray-500 text-sm">
        <span>{{ formatDate(post.date) }}</span>
        <span class="mx-2">•</span>
        <span>{{ post.category }}</span>
      </div>
      
      <div class="flex flex-wrap gap-1 mt-3">
        <span 
          v-for="tag in post.tags"
          :key="tag"
          class="px-2 py-1 bg-gray-100 text-xs rounded"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps({
  post: {
    type: Object,
    required: true
  }
})

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('zh-CN')
}
</script>
```

### 2. 头部组件

```vue
<!-- app/components/Header.vue -->
<template>
  <header class="bg-white shadow-sm">
    <div class="max-w-6xl mx-auto px-4 py-4">
      <div class="flex justify-between items-center">
        <NuxtLink to="/" class="text-2xl font-bold text-blue-600">
          我的博客
        </NuxtLink>
        
        <nav class="hidden md:block">
          <ul class="flex space-x-6">
            <li><NuxtLink to="/" class="hover:text-blue-600">首页</NuxtLink></li>
            <li><NuxtLink to="/blog" class="hover:text-blue-600">博客</NuxtLink></li>
            <li><NuxtLink to="/categories" class="hover:text-blue-600">分类</NuxtLink></li>
            <li><NuxtLink to="/tags" class="hover:text-blue-600">标签</NuxtLink></li>
          </ul>
        </nav>
        
        <SearchBar class="hidden md:block" />
      </div>
    </div>
  </header>
</template>
```

## SEO 优化

### 1. 页面元数据

```vue
<!-- app/pages/blog/[slug].vue -->
<script setup lang="ts">
const { data: post } = await useAsyncData(`post-${path}`, () => {
  return queryContent(path).findOne()
})

useHead({
  title: post.value?.title,
  meta: [
    { name: 'description', content: post.value?.description },
    { property: 'og:title', content: post.value?.title },
    { property: 'og:description', content: post.value?.description },
    { property: 'og:type', content: 'article' },
    { property: 'article:published_time', content: post.value?.date },
    { property: 'article:tag', content: post.value?.tags.join(', ') }
  ]
})
</script>
```

### 2. RSS 订阅

```typescript
// server/routes/rss.xml.ts
import { serverQueryContent } from '#content/server'

export default defineEventHandler(async (event) => {
  const feed = {
    title: '我的博客',
    description: '一个关于前端开发的博客',
    link: 'https://myblog.com',
    language: 'zh-CN',
    items: [] as any[]
  }

  const posts = await serverQueryContent(event, '/blog')
    .sort({ date: -1 })
    .limit(20)
    .find()

  feed.items = posts.map((post) => ({
    title: post.title,
    description: post.description,
    link: `https://myblog.com${post._path}`,
    pubDate: new Date(post.date).toUTCString()
  }))

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${feed.title}</title>
    <description>${feed.description}</description>
    <link>${feed.link}</link>
    <language>${feed.language}</language>
    ${feed.items.map(item => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <description><![CDATA[${item.description}]]></description>
      <link>${item.link}</link>
      <guid>${item.link}</guid>
      <pubDate>${item.pubDate}</pubDate>
    </item>
    `).join('')}
  </channel>
</rss>`

  event.node.res.setHeader('content-type', 'application/xml')
  return rss
})
```

## 部署

### 1. 静态部署

```bash
# 生成静态站点
npm run generate

# 预览
npm run preview
```

### 2. 服务端部署

```bash
# 构建应用
npm run build

# 启动服务
npm run start
```

### 3. 部署到 Vercel

创建 `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "nuxt.config.ts",
      "use": "@nuxtjs/vercel-builder",
      "config": {
        "serverFiles": ["server-middleware/**"]
      }
    }
  ]
}
```

通过这个完整的博客应用示例，您可以了解到如何使用 Nuxt.js 构建一个功能齐全的实际项目，包括内容管理、数据获取、路由设计、UI 组件开发、SEO 优化和部署等方面的最佳实践。