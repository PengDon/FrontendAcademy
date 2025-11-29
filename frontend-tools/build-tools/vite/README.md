# Vite 构建工具详解

## 基本介绍

**Vite** 是一种新型前端构建工具，能够显著提升前端开发体验。它基于浏览器原生 ES 模块系统，通过按需编译实现极速的开发服务器启动和热模块替换。

### 核心特性
- **极速开发服务器**：毫秒级的冷启动
- **即时热模块替换**：HMR (Hot Module Replacement) 非常快速
- **按需编译**：开发时无需打包整个应用
- **优化的构建输出**：生产环境使用 Rollup 进行打包优化
- **开箱即用**：内置对 TypeScript、JSX、CSS 等的支持
- **插件 API**：基于 Rollup 插件 API 扩展

### 安装
```bash
# 创建新项目
npm create vite@latest my-project -- --template vue
# 或
npm create vite@latest my-project -- --template react

# 已有项目添加 Vite
npm install --save-dev vite
```

## 项目结构
```
my-project/
├── index.html         # 项目入口 HTML
├── package.json
├── vite.config.js     # Vite 配置文件
├── public/            # 静态资源目录
└── src/
    ├── main.js        # JavaScript 入口
    ├── style.css
    └── ...
```

## 基础配置示例

### 最小配置 (vite.config.js)
```javascript
export default {
  // 配置选项
}
```

### 常用配置选项
```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  }
})
```

## 核心概念

### 开发服务器
Vite 开发服务器利用浏览器原生 ES 模块能力，无需打包，直接请求所需模块。对于非 ES 模块（如 CommonJS）或需要转换的文件，Vite 会在浏览器请求时进行即时编译。

### 生产构建
生产环境下，Vite 使用 Rollup 进行打包，应用最佳实践进行代码分割和优化。

### 模块热替换 (HMR)
Vite 的 HMR 实现非常高效，当文件修改时，只会更新修改的模块，而不是整个应用。

## 样式处理

### CSS
Vite 原生支持 CSS，无需配置额外的 loader：
```javascript
// 直接导入 CSS
import './style.css'
```

### CSS 预处理器
```bash
# 安装所需预处理器
npm install --save-dev sass
```

无需配置，直接使用：
```javascript
import './style.scss'
```

### CSS Modules
```css
/* style.module.css */
.button {
  color: blue;
}
```

```javascript
import styles from './style.module.css'

document.querySelector('.button').className = styles.button
```

## 静态资源处理

### 导入资源
```javascript
import imageUrl from './image.png'
import svgUrl, { ReactComponent as SvgIcon } from './icon.svg'
```

### 公共资源
放在 `public` 目录下的文件会被原样复制到输出目录的根目录。

## 构建优化

### 代码分割
```javascript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
          ui: ['element-plus']
        }
      }
    }
  }
})
```

### 懒加载
```javascript
// 动态导入
const UserProfile = () => import('./UserProfile.vue')
```

## 插件系统

### 常用插件
```bash
# Vue 支持
npm install --save-dev @vitejs/plugin-vue

# React 支持
npm install --save-dev @vitejs/plugin-react

# TypeScript 路径别名
npm install --save-dev vite-tsconfig-paths
```

### 自定义插件
```javascript
export default defineConfig({
  plugins: [
    {
      name: 'my-plugin',
      transform(code, id) {
        if (id.endsWith('.js')) {
          return code.replace(/console\.log\(.+\)/g, '')
        }
      }
    }
  ]
})
```

## 面试重点

### 1. Vite 与 Webpack 的区别
- **开发服务器原理**：
  - Vite：利用浏览器原生 ES 模块，按需编译，无需打包
  - Webpack：先打包所有模块，再提供服务
- **性能**：Vite 在开发环境启动速度和 HMR 明显快于 Webpack
- **生产构建**：Vite 使用 Rollup，Webpack 使用自有打包器
- **配置复杂度**：Vite 配置更简单，Webpack 配置更复杂但更灵活

### 2. Vite 为什么快
- **按需编译**：只编译浏览器请求的模块
- **缓存机制**：HTTP 缓存未修改的模块，文件系统缓存已编译的模块
- **依赖预构建**：使用 esbuild 将 CommonJS/UMD 模块转换为 ESM
- **esbuild 加速**：使用 Go 编写的 esbuild 进行依赖预构建

### 3. 依赖预构建
- **原因**：
  1. 兼容性：处理 CommonJS/UMD 模块
  2. 性能：将分散的模块合并，减少 HTTP 请求
- **实现**：使用 esbuild 进行极速预构建

### 4. 浏览器兼容性
- Vite 开发服务器使用 ES 模块，需要现代浏览器
- 生产构建可配置浏览器兼容性目标

### 5. 最佳实践
- 使用 Vite 官方插件（如 @vitejs/plugin-vue）
- 合理配置路径别名，简化导入
- 生产环境启用 sourcemap 便于调试
- 利用代码分割优化加载性能

## 完整配置示例

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/pl/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@assets': path.resolve(__dirname, 'src/assets')
    }
  },
  server: {
    port: 3000,
    open: true,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    hmr: {
      overlay: false
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'static',
    minify: 'terser',
    sourcemap: false,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          element: ['element-plus'],
          charts: ['echarts']
        },
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    },
    postcss: {
      plugins: [
        require('autoprefixer')
      ]
    }
  }
})
```

## 框架集成

### Vue 集成
Vite 提供了官方的 Vue 插件，完美支持 Vue 单文件组件：
```javascript
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()]
})
```

### React 集成
```javascript
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()]
})
```

### TypeScript 集成
Vite 原生支持 TypeScript，无需额外配置即可使用。