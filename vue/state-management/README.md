# Vue 状态管理

## Vuex (Vue 2/3)

### 基本概念

Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。

### 核心概念

1. **State**：存储应用的状态
2. **Getters**：从 state 中派生出的状态，类似于计算属性
3. **Mutations**：唯一可以修改 state 的方法，必须是同步函数
4. **Actions**：可以包含异步操作，通过提交 mutations 来修改 state
5. **Modules**：将 store 分割成模块，每个模块拥有自己的 state、mutations、actions、getters

### 基本使用

```javascript
// 创建 store
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0,
    todos: [
      { id: 1, text: '学习 Vue', done: true },
      { id: 2, text: '学习 Vuex', done: false }
    ]
  },
  
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    },
    doneTodosCount: (state, getters) => {
      return getters.doneTodos.length
    },
    getTodoById: state => id => {
      return state.todos.find(todo => todo.id === id)
    }
  },
  
  mutations: {
    increment(state) {
      state.count++
    },
    incrementBy(state, n) {
      state.count += n
    },
    addTodo(state, todo) {
      state.todos.push(todo)
    },
    toggleTodo(state, id) {
      const todo = state.todos.find(todo => todo.id === id)
      if (todo) {
        todo.done = !todo.done
      }
    }
  },
  
  actions: {
    incrementAsync({ commit }) {
      setTimeout(() => {
        commit('increment')
      }, 1000)
    },
    async fetchTodos({ commit }) {
      try {
        const response = await fetch('/api/todos')
        const todos = await response.json()
        commit('setTodos', todos)
      } catch (error) {
        console.error('获取待办列表失败:', error)
      }
    }
  }
})
```

### 在组件中使用 Vuex

```vue
<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Done todos: {{ doneTodosCount }}</p>
    <button @click="increment">增加</button>
    <button @click="incrementBy(10)">增加 10</button>
    <button @click="incrementAsync">异步增加</button>
    <button @click="fetchTodos">获取待办列表</button>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  computed: {
    // 直接使用 this.$store.state.count
    // 或使用 mapState 辅助函数
    ...mapState(['count']),
    ...mapGetters(['doneTodosCount'])
  },
  methods: {
    // 直接使用 this.$store.commit('increment')
    // 或使用 mapMutations 辅助函数
    ...mapMutations(['increment', 'incrementBy']),
    
    // 直接使用 this.$store.dispatch('incrementAsync')
    // 或使用 mapActions 辅助函数
    ...mapActions(['incrementAsync', 'fetchTodos'])
  }
}
</script>
```

### 模块化 Store

```javascript
// store/modules/user.js
const state = {
  user: null,
  isLoggedIn: false
}

const getters = {
  currentUser: state => state.user,
  isLoggedIn: state => state.isLoggedIn
}

const mutations = {
  setUser(state, user) {
    state.user = user
    state.isLoggedIn = !!user
  },
  logout(state) {
    state.user = null
    state.isLoggedIn = false
  }
}

const actions = {
  async login({ commit }, credentials) {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      })
      const user = await response.json()
      commit('setUser', user)
      return user
    } catch (error) {
      console.error('登录失败:', error)
      throw error
    }
  },
  logout({ commit }) {
    commit('logout')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

// store/modules/products.js
const state = {
  products: [],
  loading: false
}

// ... 其他模块定义

export default {
  namespaced: true,
  state,
  // ...
}

// store/index.js
import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import products from './modules/products'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    products
  },
  // 根级别的 state, getters, mutations, actions
  state: {
    appName: 'My Application'
  }
})
```

### 在组件中使用模块化 Store

```vue
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  computed: {
    // 根级别的 state
    appName() {
      return this.$store.state.appName
    },
    
    // 使用命名空间模块
    ...mapState('user', ['user', 'isLoggedIn']),
    ...mapGetters('products', ['featuredProducts'])
  },
  methods: {
    // 使用命名空间模块的 mutations
    ...mapMutations('user', ['logout']),
    
    // 使用命名空间模块的 actions
    ...mapActions('products', ['fetchProducts']),
    
    // 直接访问命名空间模块
    async loginUser(credentials) {
      try {
        await this.$store.dispatch('user/login', credentials)
      } catch (error) {
        // 处理错误
      }
    }
  }
}
</script>
```

## Pinia (Vue 3)

### 基本概念

Pinia 是 Vue 3 的官方状态管理库，它提供了更简单的 API、更好的 TypeScript 支持，并且移除了 mutations，所有的状态更新都可以在 actions 中处理。

### 核心概念

1. **Store**：状态容器，包含状态、getters、actions
2. **State**：存储应用的状态
3. **Getters**：从 state 中派生出的状态
4. **Actions**：可以包含异步操作，直接修改状态

### 基本使用

```javascript
// store/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  // 状态定义
  state: () => ({
    count: 0,
    todos: [
      { id: 1, text: '学习 Vue', done: true },
      { id: 2, text: '学习 Pinia', done: false }
    ]
  }),
  
  // 计算属性
  getters: {
    doneTodos: (state) => {
      return state.todos.filter(todo => todo.done)
    },
    doneTodosCount: (state, getters) => {
      return getters.doneTodos.length
    },
    getTodoById: (state) => (id) => {
      return state.todos.find(todo => todo.id === id)
    }
  },
  
  // 方法，可以是异步的
  actions: {
    increment() {
      this.count++
    },
    incrementBy(n) {
      this.count += n
    },
    addTodo(todo) {
      this.todos.push(todo)
    },
    toggleTodo(id) {
      const todo = this.todos.find(todo => todo.id === id)
      if (todo) {
        todo.done = !todo.done
      }
    },
    async fetchTodos() {
      try {
        const response = await fetch('/api/todos')
        const todos = await response.json()
        this.todos = todos
        return todos
      } catch (error) {
        console.error('获取待办列表失败:', error)
        throw error
      }
    }
  }
})
```

### 在组件中使用 Pinia

```vue
<template>
  <div>
    <p>Count: {{ counter.count }}</p>
    <p>Done todos: {{ counter.doneTodosCount }}</p>
    <button @click="counter.increment">增加</button>
    <button @click="counter.incrementBy(10)">增加 10</button>
    <button @click="addCustomTodo">添加自定义待办项</button>
    <button @click="counter.fetchTodos">获取待办列表</button>
  </div>
</template>

<script setup>
import { useCounterStore } from '../store/counter'

// 创建 store 实例
const counter = useCounterStore()

// 自定义方法
function addCustomTodo() {
  counter.addTodo({
    id: Date.now(),
    text: '新的待办项',
    done: false
  })
}
</script>

<!-- Options API 方式 -->
<script>
import { useCounterStore } from '../store/counter'

export default {
  computed: {
    counter() {
      return useCounterStore()
    }
  },
  methods: {
    addCustomTodo() {
      this.counter.addTodo({
        id: Date.now(),
        text: '新的待办项',
        done: false
      })
    }
  }
}
</script>
```

### Pinia Store 组合式 API 语法

```javascript
// store/todos.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTodoStore = defineStore('todos', () => {
  // 状态
  const todos = ref([])
  const loading = ref(false)
  
  // Getters
  const doneTodos = computed(() => {
    return todos.value.filter(todo => todo.done)
  })
  
  const pendingTodos = computed(() => {
    return todos.value.filter(todo => !todo.done)
  })
  
  // Actions
  function addTodo(text) {
    todos.value.push({
      id: Date.now(),
      text,
      done: false
    })
  }
  
  function toggleTodo(id) {
    const todo = todos.value.find(todo => todo.id === id)
    if (todo) {
      todo.done = !todo.done
    }
  }
  
  async function fetchTodos() {
    loading.value = true
    try {
      const response = await fetch('/api/todos')
      const data = await response.json()
      todos.value = data
    } catch (error) {
      console.error('获取待办列表失败:', error)
    } finally {
      loading.value = false
    }
  }
  
  return {
    // 状态
    todos,
    loading,
    // Getters
    doneTodos,
    pendingTodos,
    // Actions
    addTodo,
    toggleTodo,
    fetchTodos
  }
})
```

### Pinia 插件

```javascript
// 创建 Pinia 实例
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/auth'

const pinia = createPinia()

// 添加持久化插件
pinia.use(({ store }) => {
  // 从 localStorage 加载状态
  const persistedState = localStorage.getItem(`__pinia__${store.$id}`)
  if (persistedState) {
    try {
      store.$patch(JSON.parse(persistedState))
    } catch (error) {
      console.error('Failed to parse persisted state', error)
    }
  }
  
  // 监听状态变化并保存到 localStorage
  store.$subscribe((mutation, state) => {
    localStorage.setItem(`__pinia__${store.$id}`, JSON.stringify(state))
  })
})

// 添加日志插件
pinia.use(({ store }) => {
  const initialState = JSON.parse(JSON.stringify(store.$state))
  
  console.log(`[${store.$id}] 初始化状态:`, initialState)
  
  store.$subscribe((mutation, state) => {
    console.log(`[${store.$id}] 状态变更:`, mutation, state)
  })
})

export default pinia
```

## 常见问题与答案

### 1. Vuex 和 Pinia 的区别？
**答案：**
- Pinia 移除了 mutations，所有的状态更新都在 actions 中处理
- Pinia 更好地支持 TypeScript
- Pinia 提供了更简单的 API，不需要嵌套模块
- Pinia 支持组合式 API 语法
- Pinia 是 Vue 3 的官方推荐状态管理库

### 2. 什么时候需要使用状态管理？
**答案：** 当应用变得复杂，多个组件需要共享状态、组件间通信变得困难，或者状态逻辑变得复杂时，就应该考虑使用状态管理。

### 3. 如何在 Vuex 中处理异步操作？
**答案：** 在 Vuex 中，所有异步操作都应该放在 actions 中，然后通过提交 mutations 来修改状态。

### 4. 如何实现 Vuex/Pinia 的持久化？
**答案：** 可以通过以下方式实现：
- 使用插件（如 vuex-persist、pinia-plugin-persistedstate）
- 手动实现（监听状态变化，保存到 localStorage 或 sessionStorage）
- 服务器端持久化（保存到数据库）

### 5. Vuex 中的严格模式是什么？
**答案：** 严格模式下，无论何时发生了状态变更且不是由 mutation 函数引起的，将会抛出错误。这能保证所有的状态变更都可被调试工具跟踪。

```javascript
const store = new Vuex.Store({
  // ...
  strict: process.env.NODE_ENV !== 'production'
})
```

### 6. 如何在组件卸载时取消异步操作？
**答案：**
- 使用 AbortController 取消 fetch 请求
- 使用取消令牌（如 axios 的 CancelToken）
- 在组件卸载时设置标志位，忽略异步操作的结果

### 7. Pinia 中的 store 实例化机制是什么？
**答案：** Pinia 中的 store 是单例模式。第一次调用 `useStore()` 时创建实例，后续调用返回同一个实例。