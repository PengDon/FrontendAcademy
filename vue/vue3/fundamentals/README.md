# Vue 3 基础入门

## Vue 简介

Vue (发音为 /vjuː/，类似 **view**) 是一款用于构建用户界面的 JavaScript 框架。Vue 3 是 Vue 的最新主要版本，带来了许多新特性和性能改进，包括 Composition API、Teleport、Fragments 等。

## 安装与环境配置

### CDN 引入

```html
<!-- 开发环境版本，包含了有帮助的命令行警告 -->
<script src="https://unpkg.com/vue@next/dist/vue.global.js"></script>

<!-- 生产环境版本，优化了尺寸和速度 -->
<script src="https://unpkg.com/vue@next"></script>
```

### NPM 安装

```bash
# 安装 Vue 3
npm install vue@next
```

### 创建项目

使用 Vite 创建 Vue 3 项目：

```bash
# NPM
npm create vite@latest my-vue3-app -- --template vue

# Yarn
# yarn create vite my-vue3-app --template vue

# PNPM
# pnpm create vite my-vue3-app --template vue
```

## 创建 Vue 应用实例

Vue 3 中，使用 `createApp` 函数创建应用实例：

```javascript
import { createApp } from 'vue'
import App from './App.vue'

// 创建应用实例
const app = createApp(App)

// 挂载应用
app.mount('#app')
```

### 应用配置

```javascript
const app = createApp({
  data() {
    return {
      message: 'Hello Vue 3!'
    }
  }
})

// 全局属性
app.config.globalProperties.$appName = 'My App'

// 错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('Error:', err, info)
}

// 挂载应用
app.mount('#app')
```

## 模板语法

### 文本插值

```html
<div>{{ message }}</div>
```

### 原始 HTML

```html
<div v-html="rawHtml"></div>
```

### 表达式

```html
<div>
  {{ number + 1 }}
  {{ ok ? 'YES' : 'NO' }}
  {{ message.split('').reverse().join('') }}
</div>
```

### 指令

```html
<p v-if="seen">现在你看到我了</p>
<button @click="toggleSeen">切换显示</button>
```

### 动态绑定

```html
<a :href="url" :class="{ active: isActive }" :style="{ fontSize: size + 'px' }">链接</a>
```

## 响应式系统

Vue 3 使用了新的响应式系统，基于 Proxy：

### ref()

创建一个响应式的 ref 对象，用于包装基本类型：

```javascript
import { ref } from 'vue'

const count = ref(0)
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```

### reactive()

创建一个响应式的对象，用于包装对象类型：

```javascript
import { reactive } from 'vue'

const state = reactive({
  count: 0,
  message: 'Hello Vue 3'
})

console.log(state.count) // 0
state.count++
console.log(state.count) // 1
```

### computed()

创建一个计算属性：

```javascript
import { ref, computed } from 'vue'

const count = ref(0)
const doubleCount = computed(() => count.value * 2)

console.log(doubleCount.value) // 0
count.value = 1
console.log(doubleCount.value) // 2
```

### watch()

创建一个侦听器：

```javascript
import { ref, watch } from 'vue'

const count = ref(0)

watch(count, (newValue, oldValue) => {
  console.log(`Count changed from ${oldValue} to ${newValue}`)
})

count.value = 1 // 触发回调
```

### watchEffect()

创建一个自动跟踪依赖的副作用函数：

```javascript
import { ref, watchEffect } from 'vue'

const count = ref(0)

watchEffect(() => {
  console.log(`Count is: ${count.value}`)
})

count.value = 1 // 触发副作用
```

## 生命周期

Vue 3 的生命周期钩子与 Vue 2 类似：

### 选项式 API 中的生命周期

```javascript
export default {
  beforeCreate() {
    console.log('beforeCreate')
  },
  created() {
    console.log('created')
  },
  beforeMount() {
    console.log('beforeMount')
  },
  mounted() {
    console.log('mounted')
  },
  beforeUpdate() {
    console.log('beforeUpdate')
  },
  updated() {
    console.log('updated')
  },
  beforeUnmount() {
    console.log('beforeUnmount')
  },
  unmounted() {
    console.log('unmounted')
  }
}
```

### Composition API 中的生命周期

```javascript
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted
} from 'vue'

export default {
  setup() {
    onBeforeMount(() => {
      console.log('beforeMount')
    })
    
    onMounted(() => {
      console.log('mounted')
    })
    
    onBeforeUpdate(() => {
      console.log('beforeUpdate')
    })
    
    onUpdated(() => {
      console.log('updated')
    })
    
    onBeforeUnmount(() => {
      console.log('beforeUnmount')
    })
    
    onUnmounted(() => {
      console.log('unmounted')
    })
  }
}
```

## 组件基础

### 定义组件

```vue
<!-- HelloWorld.vue -->
<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.hello {
  color: #42b983;
}
</style>
```

### 使用组件

```vue
<template>
  <div id="app">
    <HelloWorld msg="Hello Vue 3!" />
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>
```

### 使用 Composition API

```vue
<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}
</script>
```

## 新特性

### 片段 (Fragments)

Vue 3 支持组件返回多个根节点：

```vue
<template>
  <header>Header</header>
  <main>Main Content</main>
  <footer>Footer</footer>
</template>
```

### Teleport

Teleport 提供了一种方式，允许我们将组件的一部分模板渲染到组件的 DOM 层次结构之外的 DOM 节点中：

```vue
<template>
  <div>
    <button @click="show = true">打开模态框</button>
    
    <Teleport to="body">
      <div v-if="show" class="modal">
        <div class="modal-content">
          <h3>模态框标题</h3>
          <p>模态框内容</p>
          <button @click="show = false">关闭</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const show = ref(false)
</script>
```

### Suspense

Suspense 是一个内置组件，用于在组件树中协调异步依赖的加载状态：

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>

<script>
import { defineAsyncComponent } from 'vue'

// 异步组件
const AsyncComponent = defineAsyncComponent(() => 
  import('./AsyncComponent.vue')
)

export default {
  components: {
    AsyncComponent
  }
}
</script>
```

## 最佳实践

1. **响应式数据**
   - 使用 `ref` 处理基本类型数据
   - 使用 `reactive` 处理对象类型数据
   - 使用 `computed` 处理派生数据

2. **组件设计**
   - 遵循单一职责原则
   - 合理使用 props 和 events 进行组件通信
   - 对于复杂组件，考虑使用 Composition API 组织代码

3. **性能优化**
   - 使用 `v-once` 和 `v-memo` 减少不必要的渲染
   - 合理使用 `keep-alive` 缓存组件实例
   - 对于大型列表，使用虚拟滚动

4. **代码组织**
   - 使用单文件组件（.vue 文件）
   - 合理使用 TypeScript
   - 遵循一致的代码风格

## 参考资源

- [Vue 3 官方文档](https://v3.cn.vuejs.org/)
- [Vue 3 迁移指南](https://v3.cn.vuejs.org/guide/migration/introduction.html)
- [Vite 文档](https://cn.vitejs.dev/)