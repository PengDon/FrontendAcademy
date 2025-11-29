# Nuxt.js 状态管理

## 目录

- [简介](#简介)
- [Nuxt 3 中的状态管理](#nuxt-3-中的状态管理)
- [使用 useState Composable](#使用-usestate-composable)
- [Pinia 状态管理](#pinia-状态管理)
- [跨组件状态共享](#跨组件状态共享)
- [服务端渲染中的状态](#服务端渲染中的状态)
- [最佳实践](#最佳实践)

## 简介

状态管理是现代前端应用开发中的重要概念，特别是在复杂应用中，有效地管理组件之间的共享状态至关重要。Nuxt.js 提供了多种状态管理方案，从简单的内置解决方案到功能强大的外部库。

### 为什么需要状态管理？

1. **组件间数据共享** - 多个组件需要访问相同的数据
2. **数据一致性** - 确保应用中数据的一致性
3. **状态持久化** - 在页面刷新或路由切换时保持状态
4. **复杂业务逻辑** - 管理复杂的业务逻辑和数据流

## Nuxt 3 中的状态管理

Nuxt 3 提供了几种状态管理选项：

1. **useState** - Nuxt 内置的轻量级状态管理
2. **Pinia** - Vue 官方推荐的状态管理库
3. **Vuex** - Vue 2/3 的传统状态管理库（逐渐被淘汰）

## 使用 useState Composable

`useState` 是 Nuxt 3 提供的一个轻量级状态管理解决方案，它是 `ref()` 的 SSR 友好替代品。

### 基本用法

```typescript
// composables/useCounter.ts
export const useCounter = () => {
  const counter = useState('counter', () => 0)
  
  const increment = () => {
    counter.value++
  }
  
  const decrement = () => {
    counter.value--
  }
  
  const reset = () => {
    counter.value = 0
  }
  
  return {
    counter: readonly(counter),
    increment,
    decrement,
    reset
  }
}
```

在组件中使用：

```vue
<script setup>
const { counter, increment, decrement } = useCounter()
</script>

<template>
  <div>
    <h1>计数器: {{ counter }}</h1>
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
  </div>
</template>
```

### useState 参数详解

```typescript
useState<T>(init?: () => T): Ref<T>
useState<T>(key: string, init?: () => T): Ref<T>
```

- **key** - 状态的唯一标识符（可选）
- **init** - 初始化函数（可选）

### 共享状态示例

```typescript
// composables/useUser.ts
export const useUser = () => {
  const user = useState('user', () => ({
    id: null,
    name: '',
    email: '',
    isLoggedIn: false
  }))
  
  const login = async (credentials) => {
    try {
      const response = await $fetch('/api/login', {
        method: 'POST',
        body: credentials
      })
      
      user.value = {
        ...response.user,
        isLoggedIn: true
      }
      
      return { success: true }
    } catch (error) {
      return { success: false, error }
    }
  }
  
  const logout = async () => {
    await $fetch('/api/logout', { method: 'POST' })
    user.value = {
      id: null,
      name: '',
      email: '',
      isLoggedIn: false
    }
  }
  
  return {
    user: readonly(user),
    login,
    logout
  }
}
```

## Pinia 状态管理

Pinia 是 Vue 官方推荐的状态管理库，它比 Vuex 更简单、更直观。

### 安装和配置

```bash
npm install pinia @pinia/nuxt
```

在 `nuxt.config.ts` 中配置：

```typescript
export default defineNuxtConfig({
  modules: ['@pinia/nuxt'],
  
  pinia: {
    autoImports: [
      'defineStore',
      'acceptHMRUpdate'
    ]
  }
})
```

### 创建 Store

```typescript
// stores/user.ts
export const useUserStore = defineStore('user', {
  state: () => ({
    id: null as number | null,
    name: '',
    email: '',
    isLoggedIn: false
  }),
  
  getters: {
    fullName: (state) => state.name,
    isAuthenticated: (state) => state.isLoggedIn
  },
  
  actions: {
    async login(credentials) {
      try {
        const response = await $fetch('/api/login', {
          method: 'POST',
          body: credentials
        })
        
        this.$patch({
          ...response.user,
          isLoggedIn: true
        })
        
        return { success: true }
      } catch (error) {
        return { success: false, error }
      }
    },
    
    logout() {
      this.$patch({
        id: null,
        name: '',
        email: '',
        isLoggedIn: false
      })
    }
  },
  
  persist: {
    storage: persistedState.localStorage
  }
})
```

### 在组件中使用 Pinia

```vue
<script setup>
const userStore = useUserStore()

const handleLogin = async () => {
  const result = await userStore.login({
    email: 'user@example.com',
    password: 'password'
  })
  
  if (result.success) {
    console.log('登录成功')
  }
}
</script>

<template>
  <div>
    <div v-if="userStore.isAuthenticated">
      <p>欢迎, {{ userStore.name }}!</p>
      <button @click="userStore.logout">退出</button>
    </div>
    
    <div v-else>
      <button @click="handleLogin">登录</button>
    </div>
  </div>
</template>
```

### Store 热更新

为了支持开发时的热更新：

```typescript
// stores/user.ts
import { acceptHMRUpdate } from 'pinia'

// ... store 定义

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
```

## 跨组件状态共享

### 使用 useState 实现跨组件状态

```typescript
// composables/useCart.ts
export const useCart = () => {
  const cart = useState('cart', () => ({
    items: [],
    total: 0
  }))
  
  const addItem = (product) => {
    const existingItem = cart.value.items.find(item => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity++
    } else {
      cart.value.items.push({
        ...product,
        quantity: 1
      })
    }
    
    updateTotal()
  }
  
  const removeItem = (productId) => {
    cart.value.items = cart.value.items.filter(item => item.id !== productId)
    updateTotal()
  }
  
  const updateTotal = () => {
    cart.value.total = cart.value.items.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    )
  }
  
  return {
    cart: readonly(cart),
    addItem,
    removeItem
  }
}
```

### 使用 Pinia 实现跨组件状态

```typescript
// stores/cart.ts
export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    total: 0
  }),
  
  getters: {
    itemCount: (state) => state.items.reduce((count, item) => count + item.quantity, 0)
  },
  
  actions: {
    addItem(product) {
      const existingItem = this.items.find(item => item.id === product.id)
      
      if (existingItem) {
        existingItem.quantity++
      } else {
        this.items.push({
          ...product,
          quantity: 1
        })
      }
      
      this.updateTotal()
    },
    
    removeItem(productId) {
      this.items = this.items.filter(item => item.id !== productId)
      this.updateTotal()
    },
    
    updateTotal() {
      this.total = this.items.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
      )
    }
  }
})
```

## 服务端渲染中的状态

在 SSR 应用中，状态管理需要特别注意服务端和客户端的一致性。

### 状态水合(Hydration)

Nuxt 会自动处理状态的水合过程：

```typescript
// 这个状态会在服务端初始化，并在客户端恢复
const counter = useState('counter', () => {
  // 在服务端和客户端都会执行
  return Math.floor(Math.random() * 100)
})
```

### 避免状态冲突

```typescript
// 为每个请求创建独立的状态
export const useRequestCounter = () => {
  const nuxtApp = useNuxtApp()
  const key = `request-counter-${nuxtApp._requestId}`
  return useState(key, () => 0)
}
```

### 服务端专用状态

```typescript
// 只在服务端使用的状态
export const useServerData = () => {
  if (process.server) {
    return useState('server-data', () => {
      // 只在服务端执行的逻辑
      return fetchServerData()
    })
  }
}
```

## 最佳实践

### 1. 合理选择状态管理方案

- **简单应用** - 使用 `useState`
- **中大型应用** - 使用 `Pinia`
- **需要复杂逻辑** - 使用 `Pinia` 配合 `actions`

### 2. 状态命名规范

```typescript
// 使用有意义的键名
useState('user-profile', () => ({})
useState('shopping-cart-items', () => [])
useState('navigation-history', () => [])
```

### 3. 状态持久化

```typescript
// 使用 cookie 持久化用户偏好
const userPreferences = useState('user-preferences', () => {
  if (process.client) {
    const saved = localStorage.getItem('preferences')
    return saved ? JSON.parse(saved) : { theme: 'light' }
  }
  return { theme: 'light' }
})

watch(userPreferences, (newValue) => {
  if (process.client) {
    localStorage.setItem('preferences', JSON.stringify(newValue))
  }
}, { deep: true })
```

### 4. 状态清理

```typescript
// 在适当的时候清理状态
export const useTemporaryData = () => {
  const data = useState('temp-data', () => null)
  
  // 在组件卸载时清理
  onUnmounted(() => {
    data.value = null
  })
  
  return data
}
```

### 5. 类型安全

```typescript
// 定义状态类型
interface UserState {
  id: number | null
  name: string
  email: string
  isLoggedIn: boolean
}

export const useUser = () => {
  const user = useState<UserState>('user', () => ({
    id: null,
    name: '',
    email: '',
    isLoggedIn: false
  }))
  
  return {
    user: readonly(user)
  }
}
```

通过掌握这些状态管理的概念和技巧，您可以在 Nuxt.js 应用中有效地管理复杂的状态逻辑，构建出更加健壮和可维护的应用程序。