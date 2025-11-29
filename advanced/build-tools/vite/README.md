# Vite 基础知识

## Vite 简介

Vite 是一个由 Vue.js 作者尤雨溪创建的现代化前端构建工具。它利用浏览器的 ES 模块支持，提供极快的开发服务器启动速度和模块热更新能力。

### 核心特点

- **极速开发服务器**：利用原生 ES 模块，避免了打包过程，启动速度极快
- **即时热模块替换**：利用 ES 模块和原生 ESM 模块图，实现无等待的热更新
- **优化的构建输出**：使用 Rollup 进行生产构建，提供最佳的构建结果
- **优化的开发体验**：支持 TypeScript、JSX、CSS 预处理器等开箱即用
- **插件化架构**：丰富的插件生态系统，便于扩展功能
- **多框架支持**：不仅支持 Vue，还支持 React、Svelte 等框架

### 与传统构建工具的对比

| 特性 | Vite | Webpack |
|------|------|---------|
| 开发服务器启动时间 | 毫秒级 | 秒级 |
| 热更新速度 | 即时 | 较慢 |
| 构建策略 | 开发环境不打包，生产环境基于 Rollup | 全部环境都打包 |
| 按需编译 | 支持 | 需要配置 |
| 模块预构建 | 智能预构建第三方依赖 | 全部打包 |

## 快速入门

### 环境要求

- Node.js 版本 >= 18.0.0
- npm, yarn 或 pnpm

### 创建新项目

```bash
# 使用 npm
npm create vite@latest my-vite-app -- --template vue

# 使用 yarn
yarn create vite my-vite-app --template vue

# 使用 pnpm
pnpm create vite my-vite-app --template vue
```

支持的模板包括：
- vue
- vue-ts
- react
- react-ts
- svelte
- svelte-ts
- vanilla
- vanilla-ts

### 安装依赖并启动开发服务器

```bash
cd my-vite-app
npm install
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 核心概念

### 1. 开发服务器

Vite 的开发服务器利用浏览器的原生 ES 模块支持，实现了极速的启动时间和模块热更新。

#### 工作原理

1. 当浏览器请求一个 `.js` 文件时，Vite 会拦截请求并进行必要的转换
2. 对于第三方依赖，Vite 会进行智能预构建，将 ESM 不兼容的模块转换为兼容格式
3. 对于项目源码，Vite 会按需编译，只在浏览器请求时才进行转换

#### 配置开发服务器

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    hmr: {
      overlay: false // 禁用热更新错误覆盖层
    }
  }
})
```

### 2. 生产构建

Vite 使用 Rollup 作为生产构建工具，提供最佳的构建结果。

#### 构建配置

```javascript
// vite.config.js
export default defineConfig({
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router'],
          'ui-lib': ['element-plus']
        }
      }
    }
  }
})
```

#### 多页面构建

```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about/index.html')
      }
    }
  }
})
```

### 3. 模块热替换 (HMR)

Vite 的模块热替换功能非常强大，支持多种框架和文件类型。

#### 自定义 HMR

```javascript
// src/main.js
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.mount('#app')

// 自定义 HMR 处理
if (import.meta.hot) {
  import.meta.hot.accept('./App.vue', (newApp) => {
    // 替换根组件
    app.unmount()
    app.mount('#app')
  })
}
```

### 4. CSS 处理

Vite 对 CSS 有很好的支持，包括 CSS Modules、预处理器等。

#### CSS 预处理器

```bash
# 安装 Sass
npm install -D sass

# 安装 Less
npm install -D less

# 安装 Stylus
npm install -D stylus
```

使用示例：

```vue
<style scoped lang="scss">
$primary-color: #42b983;

.button {
  background-color: $primary-color;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
}
</style>
```

#### CSS Modules

```vue
<style module>
.button {
  background-color: #42b983;
  color: white;
}
</style>

<script setup>
import { useCssModule } from 'vue'

const styles = useCssModule()
</script>

<template>
  <button :class="styles.button">CSS Modules Button</button>
</template>
```

## 插件系统

### 1. 官方插件

- **@vitejs/plugin-vue**：Vue 3 单文件组件支持
- **@vitejs/plugin-vue-jsx**：Vue 3 JSX 支持
- **@vitejs/plugin-react**：React 支持
- **@vitejs/plugin-legacy**：生成传统浏览器兼容性代码

### 2. 使用插件

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ]
})
```

### 3. 自定义插件

```javascript
// my-plugin.js
function myPlugin(options = {}) {
  return {
    name: 'my-plugin',
    transform(code, id) {
      if (id.includes('target-file.js')) {
        return code.replace('console.log', 'console.warn')
      }
      return code
    },
    resolveId(source) {
      if (source === 'virtual-module') {
        return 'virtual-module-id'
      }
      return null
    },
    load(id) {
      if (id === 'virtual-module-id') {
        return 'export const message = "Hello from virtual module!"'
      }
      return null
    }
  }
}

// vite.config.js
import { defineConfig } from 'vite'
import myPlugin from './my-plugin'

export default defineConfig({
  plugins: [myPlugin()]
})
```

## 高级配置

### 1. 别名设置

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'components': resolve(__dirname, 'src/components'),
      'utils': resolve(__dirname, 'src/utils')
    }
  }
})
```

### 2. 环境变量

Vite 支持 `.env`、`.env.local`、`.env.development`、`.env.production` 等环境变量文件。

```env
# .env.development
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=My App Dev
```

在代码中使用：

```javascript
console.log(import.meta.env.VITE_API_BASE_URL)
console.log(import.meta.env.VITE_APP_NAME)
```

### 3. 优化依赖

```javascript
// vite.config.js
export default defineConfig({
  optimizeDeps: {
    include: ['vue', 'vue-router', 'axios'],
    exclude: ['some-heavy-library']
  }
})
```

### 4. 静态资源处理

```javascript
// vite.config.js
export default defineConfig({
  assetsInclude: ['**/*.gltf', '**/*.glb'],
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  }
})
```

## 与框架集成

### Vue 3

```bash
npm create vite@latest my-vue-app -- --template vue
```

### React

```bash
npm create vite@latest my-react-app -- --template react
```

### Svelte

```bash
npm create vite@latest my-svelte-app -- --template svelte
```

### TypeScript 支持

Vite 对 TypeScript 有很好的支持，无需额外配置即可使用。

```bash
npm create vite@latest my-ts-app -- --template vue-ts
```

## 性能优化技巧

### 1. 代码分割

```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vue') || id.includes('vue-router')) {
              return 'vue-vendor'
            }
            if (id.includes('element-plus')) {
              return 'element-plus'
            }
            return 'vendor'
          }
        }
      }
    }
  }
})
```

### 2. 按需引入

使用动态导入实现按需加载：

```javascript
// 路由懒加载
const Home = () => import('@/views/Home.vue')
const About = () => import('@/views/About.vue')

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About }
]
```

### 3. 图片优化

使用 `vite-plugin-image-optimizer` 插件优化图片：

```bash
npm install -D vite-plugin-image-optimizer
```

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import ImageOptimizer from 'vite-plugin-image-optimizer'

export default defineConfig({
  plugins: [
    ImageOptimizer({
      png: {
        quality: 80
      },
      jpeg: {
        quality: 80
      },
      webp: {
        quality: 80
      }
    })
  ]
})
```

## 常见问题与解决方案

### 1. 跨域问题

配置代理：

```javascript
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

### 2. 依赖预构建错误

清除 `node_modules/.vite` 目录并重新运行：

```bash
rm -rf node_modules/.vite
npm run dev
```

### 3. 生产构建错误

检查 Rollup 配置是否正确，特别是代码分割和外部依赖配置。

### 4. 浏览器兼容性问题

使用 legacy 插件：

```javascript
// vite.config.js
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    })
  ]
})
```

## 与其他工具的集成

### Vitest

Vite 官方推荐的测试框架，与 Vite 配置无缝集成。

```bash
npm install -D vitest
```

```javascript
// vite.config.js
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom'
  }
})
```

### Storybook

```bash
npx sb init --builder @storybook/builder-vite
```

### ESLint

```bash
npm install -D eslint eslint-plugin-vue @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

```javascript
// eslint.config.js
import eslintPluginVue from 'eslint-plugin-vue'
import typescriptEslint from '@typescript-eslint/eslint-plugin'

export default [
  ...eslintPluginVue.configs['flat/recommended'],
  {
    plugins: {
      '@typescript-eslint': typescriptEslint
    },
    rules: {
      'vue/multi-word-component-names': 'off'
    }
  }
]
```

## 部署与持续集成

### GitHub Actions

```yaml
# .github/workflows/build.yml
name: Build and Deploy

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Build
        run: npm run build
      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: dist
```

### 部署到 Vercel

Vercel 对 Vite 有原生支持，只需连接 GitHub 仓库即可自动部署。

### 部署到 Netlify

Netlify 同样支持 Vite 应用的自动部署，配置简单。

## 学习资源

### 官方文档

- [Vite 官方文档](https://vitejs.dev/guide/)
- [Vite GitHub 仓库](https://github.com/vitejs/vite)

### 教程与示例

- [Vite 入门教程](https://vitejs.dev/guide/)
- [Vite 插件开发指南](https://vitejs.dev/guide/api-plugin.html)
- [Vite 配置参考](https://vitejs.dev/config/)

### 视频教程

- [Vite 官方视频教程](https://www.youtube.com/watch?v=KCrXgy8qtjM)
- [Vue Mastery Vite 课程](https://www.vuemastery.com/courses/vite-with-vue/)

## 总结

Vite 作为新一代前端构建工具，以其极速的开发体验和优化的构建输出，正在成为前端开发的重要工具。它不仅适用于中小型项目，也能很好地支持大型企业应用的开发。通过本指南的学习，你已经掌握了 Vite 的基本用法和高级配置，可以开始在你的项目中使用 Vite 了。

记住，Vite 的生态系统还在不断发展，定期查看官方文档和社区更新，可以帮助你更好地利用 Vite 的最新特性和最佳实践。

---

希望这份 Vite 基础知识文档能够帮助你快速上手 Vite 并在项目中充分发挥其优势。通过实践和探索，你将能够更深入地理解和应用 Vite，提高你的前端开发效率。