// Nuxt 4 API 路由示例
import { defineEventHandler } from 'h3'

// 定义事件处理器
export default defineEventHandler((event) => {
  // 获取查询参数
  const query = getQuery(event)
  
  // 返回响应数据
  return {
    message: 'Hello from Nuxt 4 API!',
    timestamp: new Date().toISOString(),
    version: '4.0.0',
    query: query,
    // Nuxt 4 新特性：响应式数据层支持
    dataLayer: {
      enabled: true,
      optimized: true
    }
  }
})
