# Pinia 状态管理

## Pinia 简介

Pinia 是 Vue 的新一代状态管理库，是 Vuex 的替代品。它是 Vue 官方推荐的状态管理解决方案，提供了更简单的 API、更好的 TypeScript 支持以及更灵活的组合式风格。

## 为什么使用 Pinia？

- **更简单的 API**：Pinia 减少了很多模板代码，API 设计更加简洁明了
- **更好的 TypeScript 支持**：Pinia 的 API 是为 TypeScript 设计的，提供了完整的类型推断
- **更小的体积**：相比 Vuex，Pinia 的体积更小
- **去除了 mutations**：在 Pinia 中，可以直接在 actions 中修改 state
- **支持多个 store**：可以创建多个 store，并且它们之间可以相互使用
- **更好的开发体验**：支持 Vue DevTools，提供了更友好的开发体验

## 安装 Pinia

### NPM 安装

```bash
# 安装 Pinia
npm install pinia
```

## 基本使用

### 创建 Pinia 实例

```javascript
// main.js 或 main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')
```

### 定义 Store

```javascript
// stores/counter.js 或 stores/counter.ts
import { defineStore } from 'pinia'

// 定义一个名为 counter 的 store
export const useCounterStore = defineStore('counter', {
  // 状态
  state: () => ({
    count: 0,
    name: 'Pinia'
  }),
  
  // 计算属性（类似于 Vue 组件中的 computed）
  getters: {
    doubleCount: (state) => state.count * 2,
    // 可以访问其他 getters
    doubleCountPlusOne(): number {
      return this.doubleCount + 1
    }
  },
  
  // 方法（类似于 Vue 组件中的 methods）
  actions: {
    increment() {
      this.count++
    },
    incrementBy(amount) {
      this.count += amount
    },
    // 支持异步操作
    async fetchCount() {
      // 模拟 API 请求
      const response = await new Promise(resolve => {
        setTimeout(() => {
          resolve({ count: 10 })
        }, 1000)
      })
      
      this.count = response.count
    }
  }
})
```

### 使用 Store

```vue
<template>
  <div>
    <p>Count: {{ counter.count }}</p>
    <p>Double Count: {{ counter.doubleCount }}</p>
    <button @click="counter.increment">Increment</button>
    <button @click="counter.incrementBy(10)">Increment by 10</button>
    <button @click="counter.fetchCount">Fetch Count</button>
  </div>
</template>

<script setup>
import { useCounterStore } from './stores/counter'

// 创建 store 实例
const counter = useCounterStore()
</script>
```

## Store 的核心概念

### State

State 是 store 的核心，定义了 store 的响应式数据：

```javascript
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    user: {
      name: 'Alice',
      age: 25
    },
    items: []
  })
})
```

修改 State：

```javascript
const counter = useCounterStore()

// 直接修改
counter.count++

// 一次性修改多个属性
counter.$patch({
  count: 10,
  name: 'New Name'
})

// 使用函数修改复杂对象
counter.$patch((state) => {
  state.items.push({ id: 1, name: 'Item 1' })
  state.count++
})

// 重置 state
counter.$reset()
```

### Getters

Getters 允许我们定义基于 state 的计算属性：

```javascript
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    users: [
      { id: 1, name: 'Alice', age: 25 },
      { id: 2, name: 'Bob', age: 30 }
    ]
  }),
  getters: {
    doubleCount: (state) => state.count * 2,
    // 接收参数的 getter
    getUserById: (state) => (id) => {
      return state.users.find(user => user.id === id)
    },
    // 访问其他 store 的 getter
    getOtherStoreData(state) {
      const otherStore = useOtherStore()
      return state.count + otherStore.value
    }
  }
})
```

### Actions

Actions 用于定义可以修改 state 的方法，支持异步操作：

```javascript
export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    loading: false,
    error: null
  }),
  actions: {
    async fetchUsers() {
      this.loading = true
      this.error = null
      
      try {
        const response = await fetch('/api/users')
        if (!response.ok) throw new Error('Failed to fetch users')
        
        this.users = await response.json()
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
    addUser(user) {
      this.users.push(user)
    },
    updateUser(id, data) {
      const index = this.users.findIndex(user => user.id === id)
      if (index !== -1) {
        this.users[index] = { ...this.users[index], ...data }
      }
    },
    deleteUser(id) {
      this.users = this.users.filter(user => user.id !== id)
    }
  }
})
```

## Store 组合

在 Pinia 中，Store 可以相互组合使用：

```javascript
// stores/user.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null
  }),
  actions: {
    setUser(user) {
      this.user = user
    }
  }
})

// stores/cart.js
import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: []
  }),
  actions: {
    addToCart(product) {
      const userStore = useUserStore()
      
      if (!userStore.user) {
        throw new Error('User not logged in')
      }
      
      this.items.push({
        ...product,
        addedBy: userStore.user.id
      })
    }
  }
})
```

## 使用 Composition API 风格

Pinia 还支持使用 Composition API 风格来定义 store：

```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  // state
  const count = ref(0)
  const name = ref('Pinia')
  
  // getters
  const doubleCount = computed(() => count.value * 2)
  
  // actions
  function increment() {
    count.value++
  }
  
  function incrementBy(amount) {
    count.value += amount
  }
  
  async function fetchCount() {
    // 模拟 API 请求
    const response = await new Promise(resolve => {
      setTimeout(() => {
        resolve({ count: 10 })
      }, 1000)
    })
    
    count.value = response.count
  }
  
  return {
    // state
    count,
    name,
    // getters
    doubleCount,
    // actions
    increment,
    incrementBy,
    fetchCount
  }
})
```

## 插件系统

Pinia 支持插件系统，可以扩展 store 的功能：

```javascript
// main.js
import { createPinia } from 'pinia'

const pinia = createPinia()

// 添加一个插件
pinia.use(({ store }) => {
  // 为 store 添加一个 $reset 方法（如果使用 Composition API 风格定义 store）
  if (!store.$reset) {
    store.$reset = function() {
      const initialState = store.$state
      Object.assign(store, initialState)
    }
  }
  
  // 添加一个自定义属性
  store.$customProp = 'custom value'
})
```

## 持久化存储

可以使用插件来实现状态的持久化：

```javascript
// piniaPersistPlugin.js
import { PiniaPluginContext } from 'pinia'

export function piniaPersistPlugin({ store }: PiniaPluginContext) {
  // 尝试从 localStorage 加载状态
  const savedState = localStorage.getItem(`pinia_${store.$id}`)
  if (savedState) {
    store.$patch(JSON.parse(savedState))
  }
  
  // 监听状态变化，保存到 localStorage
  store.$subscribe((_, state) => {
    localStorage.setItem(`pinia_${store.$id}`, JSON.stringify(state))
  })
}

// 在 main.js 中使用
import { createPinia } from 'pinia'
import { piniaPersistPlugin } from './piniaPersistPlugin'

const pinia = createPinia()
pinia.use(piniaPersistPlugin)
```

## 测试 Store

使用 Vitest 或 Jest 测试 Pinia store：

```javascript
// stores/counter.spec.js
import { createPinia, setActivePinia } from 'pinia'
import { useCounterStore } from './counter'

describe('Counter Store', () => {
  beforeEach(() => {
    // 创建一个新的 pinia 实例，确保测试之间相互独立
    setActivePinia(createPinia())
  })
  
  it('should initialize with correct state', () => {
    const store = useCounterStore()
    expect(store.count).toBe(0)
    expect(store.name).toBe('Pinia')
  })
  
  it('increment should increase count by 1', () => {
    const store = useCounterStore()
    store.increment()
    expect(store.count).toBe(1)
  })
  
  it('incrementBy should increase count by given amount', () => {
    const store = useCounterStore()
    store.incrementBy(5)
    expect(store.count).toBe(5)
  })
  
  it('doubleCount getter should return count multiplied by 2', () => {
    const store = useCounterStore()
    store.count = 3
    expect(store.doubleCount).toBe(6)
  })
})
```

## 最佳实践

1. **Store 组织**
   - 按照功能模块划分 store
   - 使用单一职责原则，一个 store 负责一个功能域

2. **状态设计**
   - 保持状态扁平化，避免深层嵌套
   - 合理设计状态结构，便于查询和更新

3. **性能优化**
   - 避免在 getters 中进行复杂计算
   - 对于大型列表，考虑使用分页或虚拟滚动

4. **类型安全**
   - 使用 TypeScript 为 store 添加类型定义
   - 为 state、getters 和 actions 添加明确的类型

5. **异步操作**
   - 所有异步操作都放在 actions 中
   - 处理异步操作的 loading 和 error 状态

## 与 Vuex 的比较

### Vuex

```javascript
// Vuex store
const store = new Vuex.Store({
  state: {
    count: 0
  },
  getters: {
    doubleCount: state => state.count * 2
  },
  mutations: {
    increment(state) {
      state.count++
    }
  },
  actions: {
    incrementAsync({ commit }) {
      setTimeout(() => {
        commit('increment')
      }, 1000)
    }
  }
})
```

### Pinia

```javascript
// Pinia store
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  getters: {
    doubleCount: state => state.count * 2
  },
  actions: {
    increment() {
      this.count++
    },
    incrementAsync() {
      setTimeout(() => {
        this.count++
      }, 1000)
    }
  }
})
```

## 参考资源

- [Pinia 官方文档](https://pinia.vuejs.org/)
- [Vue 官方推荐的状态管理方案](https://v3.cn.vuejs.org/guide/state-management.html)
- [Pinia vs Vuex 对比](https://pinia.vuejs.org/introduction.html#comparison-with-vuex-3-x-4-x)