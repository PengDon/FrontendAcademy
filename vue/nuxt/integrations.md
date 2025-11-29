# Nuxt.js 第三方库集成指南

## 目录

- [Tailwind CSS 集成](#tailwind-css-集成)
- [TypeScript 支持](#typescript-支持)
- [国际化 (i18n)](#国际化-i18n)
- [PWA 支持](#pwa-支持)
- [内容管理系统集成](#内容管理系统集成)
- [UI 库集成](#ui-库集成)

## Tailwind CSS 集成

### 安装

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 配置

创建 `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,vue,ts}",
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

在 `nuxt.config.ts` 中配置:

```typescript
export default defineNuxtConfig({
  css: ['~/assets/css/tailwind.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})
```

创建 `assets/css/tailwind.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 使用

```vue
<template>
  <div class="bg-red-500 text-white p-4 rounded-lg">
    Hello Tailwind!
  </div>
</template>
```

## TypeScript 支持

Nuxt 4 默认支持 TypeScript。创建 `tsconfig.json`:

```json
{
  "extends": "./.nuxt/tsconfig.json"
}
```

### 类型安全的配置

```typescript
// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  typescript: {
    strict: true,
    shim: false
  }
})
```

### 组件类型定义

```vue
<!-- components/MyComponent.vue -->
<script setup lang="ts">
interface Props {
  title: string
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  count: 0
})

const emit = defineEmits<{
  (e: 'change', value: number): void
}>()
</script>
```

### 组合式函数类型

```typescript
// composables/useCounter.ts
export function useCounter(initialValue = 0) {
  const count = ref<number>(initialValue)
  
  function increment() {
    count.value++
  }
  
  return {
    count: readonly(count),
    increment
  }
}
```

## 国际化 (i18n)

### 安装

```bash
npm install @nuxtjs/i18n
```

### 配置

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n'],
  
  i18n: {
    locales: [
      {
        code: 'en',
        name: 'English',
        file: 'en-US.json'
      },
      {
        code: 'zh',
        name: '中文',
        file: 'zh-CN.json'
      }
    ],
    lazy: true,
    langDir: 'lang/',
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  }
})
```

### 语言文件

创建 `lang/en-US.json`:

```json
{
  "welcome": "Welcome",
  "hello": "Hello {name}!"
}
```

创建 `lang/zh-CN.json`:

```json
{
  "welcome": "欢迎",
  "hello": "你好 {name}！"
}
```

### 使用

```vue
<script setup>
const { t, locale } = useI18n()

function switchLanguage() {
  locale.value = locale.value === 'en' ? 'zh' : 'en'
}
</script>

<template>
  <div>
    <h1>{{ t('welcome') }}</h1>
    <p>{{ t('hello', { name: 'World' }) }}</p>
    <button @click="switchLanguage">
      {{ locale === 'en' ? '中文' : 'English' }}
    </button>
  </div>
</template>
```

## PWA 支持

### 安装

```bash
npm install @vite-pwa/nuxt
```

### 配置

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@vite-pwa/nuxt'],
  
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'My Nuxt App',
      short_name: 'NuxtApp',
      description: 'My awesome Nuxt.js app',
      theme_color: '#ffffff',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}']
    },
    devOptions: {
      enabled: true,
      type: 'module'
    }
  }
})
```

### 自定义 Service Worker

创建 `service-worker/sw.ts`:

```typescript
/// <reference lib="webworker" />
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'

declare let self: ServiceWorkerGlobalScope

// 自动注入预缓存清单
precacheAndRoute(self.__WB_MANIFEST)

// 清理过期缓存
cleanupOutdatedCaches()

// 使用 App Shell 模式
registerRoute(
  new NavigationRoute(
    createHandlerBoundToURL('/'),
    { allowlist: [/^\/$/] }
  )
)

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
```

## 内容管理系统集成

### Strapi 集成

```typescript
// composables/useStrapi.ts
export function useStrapi() {
  const config = useRuntimeConfig()
  const baseURL = config.public.strapiURL
  
  async function getEntries(contentType: string) {
    const { data } = await useFetch(`${baseURL}/api/${contentType}`, {
      params: {
        populate: '*'
      }
    })
    return data
  }
  
  async function getEntry(contentType: string, id: number) {
    const { data } = await useFetch(`${baseURL}/api/${contentType}/${id}`, {
      params: {
        populate: '*'
      }
    })
    return data
  }
  
  return {
    getEntries,
    getEntry
  }
}
```

在 `nuxt.config.ts` 中配置:

```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      strapiURL: process.env.STRAPI_URL || 'http://localhost:1337'
    }
  }
})
```

## UI 库集成

### Element Plus 集成

```bash
npm install element-plus
```

创建插件 `plugins/element-plus.ts`:

```typescript
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(ElementPlus)
})
```

### Vuetify 集成

```bash
npm install vuetify@next
```

创建插件 `plugins/vuetify.ts`:

```typescript
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
  })

  nuxtApp.vueApp.use(vuetify)
})
```

在 `nuxt.config.ts` 中配置:

```typescript
export default defineNuxtConfig({
  css: ['vuetify/lib/styles/main.sass'],
  build: {
    transpile: ['vuetify'],
  },
  vite: {
    define: {
      __VUE_OPTIONS_API__: false,
    },
  },
})
```

通过以上指南，你可以轻松地将各种第三方库集成到你的 Nuxt.js 项目中。