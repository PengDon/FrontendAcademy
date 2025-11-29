// Nuxt.js 4 配置文件

// 导入类型定义
import type { NuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  // 应用基本配置
  app: {
    // 应用名称
    name: 'My Nuxt 4 App',
    // 应用版本
    version: '1.0.0',
    // 页面标题配置
    head: {
      title: 'Nuxt 4 Application',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'Nuxt 4 Application' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    },
    // 智能路由配置 (Nuxt 4 新特性)
    routes: {
      // 智能路由优化
      smartDetection: true,
      // 预加载策略
      preloadStrategy: 'smart'
    }
  },

  // TypeScript 配置
  typescript: {
    // 智能类型系统 (Nuxt 4 新特性)
    smartTypeGeneration: true,
    // 严格模式
    strict: true,
    // 类型检查
    typeCheck: true,
    // 生成类型声明文件
    shim: true
  },

  // Nitro 引擎配置 (Nuxt 4 升级)
  nitro: {
    // 启用增强的 Nitro 引擎
    engine: 'enhanced',
    // 响应式数据层配置
    dataLayer: {
      enabled: true,
      cacheStrategy: 'smart'
    },
    // 自动批处理优化
    autoBatching: true,
    // 部署目标
    preset: 'node-server'
  },

  // 模块配置
  modules: [
    // Nuxt 4 新增模块
    '@nuxt/icon',
    '@nuxt/forms',
    '@nuxt/performance'
  ],

  // 别名配置
  alias: {
    '@': './',
    '~': './'
  },

  // 样式配置
  css: [
    // 全局样式文件
    '@/assets/css/main.css'
  ],

  // 开发服务器配置
  devServer: {
    port: 3000,
    host: 'localhost',
    // 热模块替换优化 (Nuxt 4 新特性)
    hmr: {
      optimized: true
    }
  },

  // 组件自动导入
  components: {
    // 启用自动导入
    global: true,
    // 智能组件检测 (Nuxt 4 新特性)
    smartDetection: true,
    // 组件目录
    dirs: [
      '~/app/components',
      '~/components'
    ]
  },

  // 构建配置
  build: {
    // 启用优化
    optimize: true,
    // 构建缓存
    cache: true,
    // 构建优化配置
    optimization: {
      // 代码分割优化
      splitChunks: {
        strategy: 'smart'
      }
    }
  },

  // 运行时配置
  runtimeConfig: {
    // 服务器端配置
    server: {
      apiSecret: process.env.API_SECRET
    },
    // 客户端配置
    public: {
      apiBase: process.env.API_BASE || '/api'
    }
  }
})
