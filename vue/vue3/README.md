# Vue 3 完全指南

Vue 3 是 Vue.js 的下一代主要版本，带来了许多激动人心的新特性和性能改进。本指南将详细介绍 Vue 3 的核心功能、API 变更以及最佳实践。

## Vue 3 的主要亮点

- **性能提升**：渲染速度更快，内存占用更小
- **组合式 API**：提供更灵活的组件逻辑组织方式
- **更好的 TypeScript 支持**：全面拥抱 TypeScript
- **更小的打包体积**：Tree-shaking 支持更好
- **Fragment、Teleport、Suspense 等新特性**
- **重写的虚拟 DOM 实现**
- **响应式系统优化**：使用 Proxy 替代 Object.defineProperty

## 创建 Vue 3 项目

### 使用 Vite (推荐)

```bash
# NPM
npm create vite@latest my-vue3-app -- --template vue

# Yarn
yarn create vite my-vue3-app --template vue

# PNPM
pnpm create vite my-vue3-app --template vue
```

### 使用 Vue CLI

```bash
npm install -g @vue/cli
vue create my-vue3-app
# 选择 Vue 3 preset
```

## 项目结构

一个典型的 Vue 3 项目结构如下：

```
my-vue3-app/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   ├── components/
│   ├── views/
│   ├── App.vue
│   ├── main.ts
│   ├── router/
│   │   └── index.ts
│   └── store/
│       └── index.ts
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 入口文件配置

### main.ts

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/main.css'

const app = createApp(App)

// 使用插件
app.use(router)
app.use(store)

// 全局组件注册
app.component('GlobalComponent', GlobalComponent)

// 全局指令注册
app.directive('focus', {
  mounted(el) {
    el.focus()
  }
})

// 全局属性
app.config.globalProperties.$appName = 'My Vue 3 App'

// 挂载应用
app.mount('#app')
```

## 组合式 API 详解

### setup() 函数

`setup()` 函数是组合式 API 的入口点，在组件创建之前执行。

```vue
<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Double: {{ doubleCount }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'

export default defineComponent({
  name: 'Counter',
  setup() {
    // 响应式状态
    const count = ref(0)
    
    // 计算属性
    const doubleCount = computed(() => count.value * 2)
    
    // 方法
    const increment = () => {
      count.value++
    }
    
    // 生命周期钩子
    onMounted(() => {
      console.log('Component mounted')
    })
    
    // 返回给模板使用的内容
    return {
      count,
      doubleCount,
      increment
    }
  }
})
</script>
```

### 脚本设置 (Script Setup)

Vue 3.2+ 引入的 `<script setup>` 是更简洁的语法糖：

```vue
<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Double: {{ doubleCount }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 响应式状态
const count = ref(0)

// 计算属性
const doubleCount = computed(() => count.value * 2)

// 方法
const increment = () => {
  count.value++
}

// 生命周期钩子
onMounted(() => {
  console.log('Component mounted')
})
</script>
```

## 响应式 API

### ref()

创建一个响应式的引用类型数据。

```typescript
import { ref } from 'vue'

// 基本类型
const count = ref(0)
count.value++ // 访问或修改需要使用 .value

// 对象类型
const user = ref({
  name: 'John',
  age: 30
})
user.value.age = 31 // 修改嵌套属性
```

### reactive()

创建一个响应式的对象或数组。

```typescript
import { reactive } from 'vue'

// 创建响应式对象
const state = reactive({
  count: 0,
  user: {
    name: 'John',
    age: 30
  },
  items: ['item1', 'item2']
})

// 直接修改属性
state.count++
state.user.age = 31
state.items.push('item3')
```

### toRefs()

将响应式对象转换为普通对象，其中每个属性都是一个 ref。

```typescript
import { reactive, toRefs } from 'vue'

const state = reactive({
  count: 0,
  message: 'Hello'
})

// 将 reactive 对象转换为 ref 对象集合
const refs = toRefs(state)
// refs.count 和 refs.message 都是 ref

// 解构使用
const { count, message } = toRefs(state)

// 在组合式函数中返回
setup() {
  const state = reactive({
    count: 0,
    message: 'Hello'
  })
  
  return { ...toRefs(state) }
}
```

### computed()

创建一个计算属性。

```typescript
import { ref, computed } from 'vue'

const count = ref(0)

// 只读计算属性
const doubleCount = computed(() => count.value * 2)

// 可写计算属性
const fullName = computed({
  get: () => `${firstName.value} ${lastName.value}`,
  set: (value) => {
    const [first, last] = value.split(' ')
    firstName.value = first
    lastName.value = last
  }
})
```

### watch()

监听响应式数据的变化。

```typescript
import { ref, watch } from 'vue'

const count = ref(0)

// 基本监听
watch(count, (newValue, oldValue) => {
  console.log(`Count changed from ${oldValue} to ${newValue}`)
})

// 监听多个源
watch([count, message], ([newCount, newMessage], [oldCount, oldMessage]) => {
  console.log('Multiple sources changed')
})

// 深度监听
watch(
  () => state.user,
  (newUser, oldUser) => {
    console.log('User changed')
  },
  { deep: true }
)

// 立即执行
watch(
  count,
  (newValue) => {
    console.log(`Count is now ${newValue}`)
  },
  { immediate: true }
)
```

### watchEffect()

自动收集依赖的副作用函数。

```typescript
import { ref, watchEffect } from 'vue'

const count = ref(0)

// 副作用会在组件挂载时执行，并在依赖变化时重新执行
const stop = watchEffect(() => {
  console.log(`Count is: ${count.value}`)
})

// 手动停止监听
// stop()
```

## 生命周期钩子

在组合式 API 中，生命周期钩子函数是从 vue 导入的函数：

```typescript
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onErrorCaptured,
  onRenderTracked,
  onRenderTriggered
} from 'vue'

export default {
  setup() {
    onBeforeMount(() => {
      console.log('Before mount')
    })
    
    onMounted(() => {
      console.log('Mounted')
    })
    
    onBeforeUpdate(() => {
      console.log('Before update')
    })
    
    onUpdated(() => {
      console.log('Updated')
    })
    
    onBeforeUnmount(() => {
      console.log('Before unmount')
    })
    
    onUnmounted(() => {
      console.log('Unmounted')
    })
    
    onErrorCaptured((err, instance, info) => {
      console.log('Error captured:', err)
      return false // 阻止错误继续传播
    })
    
    // 仅开发环境有效
    onRenderTracked((event) => {
      console.log('Render tracked:', event)
    })
    
    onRenderTriggered((event) => {
      console.log('Render triggered:', event)
    })
  }
}
```

## 模板引用

使用 ref 获取对模板元素或组件实例的引用：

```vue
<template>
  <div>
    <input ref="inputRef" type="text" />
    <my-component ref="componentRef" />
    <button @click="focusInput">Focus Input</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MyComponent from './MyComponent.vue'

// 创建引用
const inputRef = ref(null)
const componentRef = ref(null)

onMounted(() => {
  // 访问 DOM 元素
  console.log(inputRef.value)
  
  // 访问组件实例
  console.log(componentRef.value)
})

const focusInput = () => {
  // 使用引用执行操作
  inputRef.value.focus()
}
</script>
```

## 新组件：Fragment

Vue 3 允许组件有多个根节点：

```vue
<template>
  <header>Header</header>
  <main>Main Content</main>
  <footer>Footer</footer>
</template>

<script setup>
// 无需额外配置
</script>
```

## 新组件：Teleport

Teleport 允许将组件的内容渲染到 DOM 树中的其他位置：

```vue
<template>
  <div>
    <button @click="showModal = true">Open Modal</button>
    
    <Teleport to="body">
      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <h2>Modal Title</h2>
          <p>Modal content</p>
          <button @click="showModal = false">Close</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showModal = ref(false)
</script>

<style>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 4px;
}
</style>
```

## 新组件：Suspense

Suspense 是一个实验性特性，用于处理异步组件加载：

```vue
<template>
  <div>
    <Suspense>
      <template #default>
        <AsyncComponent />
      </template>
      <template #fallback>
        <div>Loading...</div>
      </template>
    </Suspense>
  </div>
</template>

<script setup>
// 动态导入异步组件
const AsyncComponent = () => import('./AsyncComponent.vue')
</script>
```

## 异步组件

Vue 3 对异步组件的定义进行了改进：

```typescript
import { defineAsyncComponent } from 'vue'

// 基本用法
const AsyncComponent = defineAsyncComponent(() => import('./MyComponent.vue'))

// 带选项的异步组件
const AsyncComponentWithOptions = defineAsyncComponent({
  loader: () => import('./MyComponent.vue'),
  loadingComponent: LoadingComponent,
  errorComponent: ErrorComponent,
  delay: 200, // 延迟显示加载组件的时间（毫秒）
  timeout: 3000, // 加载超时时间（毫秒）
  suspensible: true, // 是否可挂起
  onError(error, retry, fail, attempts) {
    if (error.message.match(/fetch/) && attempts <= 3) {
      // 重试
      retry()
    } else {
      // 失败
      fail()
    }
  }
})
```

## 自定义指令

在 Vue 3 中定义自定义指令：

```typescript
// 全局指令
app.directive('focus', {
  // 指令生命周期钩子
  created(el, binding, vnode, prevVnode) {
    // 指令创建时调用
  },
  beforeMount(el, binding, vnode, prevVnode) {
    // 挂载前调用
  },
  mounted(el, binding, vnode, prevVnode) {
    // 挂载后调用
    el.focus()
  },
  beforeUpdate(el, binding, vnode, prevVnode) {
    // 更新前调用
  },
  updated(el, binding, vnode, prevVnode) {
    // 更新后调用
  },
  beforeUnmount(el, binding, vnode, prevVnode) {
    // 卸载前调用
  },
  unmounted(el, binding, vnode, prevVnode) {
    // 卸载后调用
  }
})

// 局部指令
const app = {
  directives: {
    focus: {
      mounted(el) {
        el.focus()
      }
    }
  }
}

// 函数式指令（仅关心 mounted 和 updated）
app.directive('color', (el, binding) => {
  el.style.color = binding.value
})
```

## 插件开发

创建和使用 Vue 3 插件：

```typescript
// 插件定义
const myPlugin = {
  install(app, options) {
    // 添加全局属性
    app.config.globalProperties.$myProperty = options.defaultValue
    
    // 添加全局方法
    app.config.globalProperties.$myMethod = function() {
      return 'Hello from plugin'
    }
    
    // 注册全局组件
    app.component('MyGlobalComponent', MyGlobalComponent)
    
    // 注册全局指令
    app.directive('my-directive', myDirective)
    
    // 提供依赖注入
    app.provide('myPlugin', {
      version: '1.0.0',
      doSomething: () => {}
    })
  }
}

// 使用插件
app.use(myPlugin, {
  defaultValue: 'default'
})
```

## 组合式函数

创建可复用的逻辑：

```typescript
// useCounter.js
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  const doubleCount = computed(() => count.value * 2)
  
  function increment() {
    count.value++
  }
  
  function decrement() {
    count.value--
  }
  
  function reset() {
    count.value = initialValue
  }
  
  return {
    count,
    doubleCount,
    increment,
    decrement,
    reset
  }
}

// 在组件中使用
<script setup>
import { useCounter } from './useCounter'

const { count, doubleCount, increment, decrement } = useCounter(10)
</script>
```

## 路由配置 (Vue Router 4)

Vue 3 推荐使用 Vue Router 4：

```typescript
// router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/user/:id',
    name: 'user',
    component: () => import('../views/UserView.vue'),
    props: true
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
```

## 状态管理 (Pinia)

Vue 3 推荐使用 Pinia 作为状态管理库：

```typescript
// store/counter.ts
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    name: 'Vue 3'
  }),
  getters: {
    doubleCount: (state) => state.count * 2,
    // 带参数的 getter
    getCountWithPrefix: (state) => (prefix: string) => `${prefix}${state.count}`
  },
  actions: {
    increment() {
      this.count++
    },
    decrement() {
      this.count--
    },
    // 异步 action
    async fetchCount() {
      const response = await fetch('/api/count')
      const data = await response.json()
      this.count = data.count
    }
  }
})

// 在组件中使用
<script setup>
import { useCounterStore } from '../store/counter'

const counterStore = useCounterStore()

// 访问状态
console.log(counterStore.count)

// 调用 action
counterStore.increment()

// 访问 getter
console.log(counterStore.doubleCount)
</script>
```

## 响应式原理

Vue 3 使用 Proxy 实现响应式系统，相比 Vue 2 的 Object.defineProperty 有以下优势：

1. **可以监听数组索引和长度的变化**
2. **可以监听对象属性的添加和删除**
3. **无需深度遍历即可监听嵌套对象**
4. **性能更好**

## 性能优化技巧

### 1. 使用 shallowRef 和 shallowReactive

对于深层嵌套对象，如果只关心顶层属性变化：

```typescript
import { shallowRef, shallowReactive } from 'vue'

// 只有引用变化会触发更新
const shallowCount = shallowRef({ count: 0 })
shallowCount.value.count++ // 不会触发更新
shallowCount.value = { count: 1 } // 会触发更新

// 只有顶层属性变化会触发更新
const shallowState = shallowReactive({
  user: { name: 'John' }, // 嵌套对象不是响应式的
  count: 0 // 顶层属性是响应式的
})
```

### 2. 使用 markRaw 和 toRaw

对于不需要响应式的数据：

```typescript
import { markRaw, reactive, toRaw } from 'vue'

// 标记为非响应式
const nonReactive = markRaw({
  complexData: '这部分不需要响应式'
})

// 获取响应式对象的原始对象
const reactiveObject = reactive({ count: 0 })
const original = toRaw(reactiveObject) // 修改 original 不会触发更新
```

### 3. 使用 v-once 和 v-memo

```vue
<template>
  <!-- 只渲染一次 -->
  <div v-once>{{ staticData }}</div>
  
  <!-- 只在依赖变化时更新 -->
  <div v-memo="[valueA, valueB]">
    复杂内容，只在 valueA 或 valueB 变化时重新渲染
  </div>
</template>
```

### 4. 使用 keep-alive

缓存组件实例，避免重复创建和销毁：

```vue
<template>
  <keep-alive :include="['ComponentA', 'ComponentB']">
    <component :is="currentComponent" />
  </keep-alive>
</template>
```

## TypeScript 支持

Vue 3 提供了完善的 TypeScript 支持：

```typescript
// 定义组件 Props
export default defineComponent({
  props: {
    name: {
      type: String as PropType<string>,
      required: true
    },
    age: {
      type: Number,
      default: 18,
      validator: (value: number) => value >= 0
    }
  },
  emits: ['update', 'delete'],
  setup(props, { emit }) {
    // props 和 emit 都有类型提示
    emit('update', props.age + 1)
  }
})

// 更简洁的方式 (script setup)
<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  name: string
  age?: number
}>()

const emit = defineEmits<{
  (e: 'update', value: number): void
  (e: 'delete'): void
}>()
</script>
```

## 迁移指南：从 Vue 2 到 Vue 3

### 主要变更

1. **破坏性变更**：
   - 全局 API 改为应用实例方法
   - 异步组件需要使用 `defineAsyncComponent`
   - 过滤器被移除
   - v-model 指令语法变更
   - 事件 API 变更 ($on, $off, $once 被移除)

2. **升级步骤**：
   - 安装最新版 Vue 和相关依赖
   - 更新全局 API 调用方式
   - 检查并更新组件生命周期钩子
   - 迁移过滤器到方法或计算属性
   - 更新 v-model 使用方式
   - 移除对废弃 API 的使用

### 升级工具

Vue 官方提供了迁移构建版本和自动迁移工具：

```bash
# 安装迁移构建版本
npm install vue@^3.0.0

# 使用 Vue CLI 进行自动迁移
vue add vue-next

# 或使用 eslint-plugin-vue 检测
npm install --save-dev eslint-plugin-vue@next
```

## 最佳实践

1. **组件设计**：
   - 单一职责原则
   - 合理划分组件粒度
   - 使用组合式 API 提取可复用逻辑

2. **性能优化**：
   - 避免不必要的响应式转换
   - 使用虚拟滚动处理大数据列表
   - 合理使用缓存策略
   - 避免在模板中执行复杂计算

3. **代码组织**：
   - 使用组合式 API 按功能组织代码
   - 创建自定义组合式函数
   - 合理使用 TypeScript 类型

4. **测试策略**：
   - 单元测试组件和组合式函数
   - 使用 Vue Test Utils 3.x 进行测试
   - 考虑使用 Cypress 进行端到端测试

## 常用工具和插件

- **开发工具**：
  - Vite: 极速开发服务器
  - Vue DevTools: 浏览器调试工具
  - Volar: VS Code 插件，提供更好的 Vue 3 支持

- **生态系统**：
  - Vue Router 4: 路由管理
  - Pinia: 状态管理
  - VueUse: 实用组合式函数集合
  - Vue I18n: 国际化支持
  - Element Plus: UI 组件库
  - Naive UI: 高质量 UI 组件库

## 总结

Vue 3 带来了许多激动人心的新特性和性能改进，特别是组合式 API 提供了更灵活的组件逻辑组织方式。通过本指南，您应该已经掌握了 Vue 3 的核心概念和最佳实践。随着 Vue 生态系统的不断发展，Vue 3 将继续为前端开发提供更强大、更高效的工具。