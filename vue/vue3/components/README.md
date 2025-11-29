# Vue 3 组件开发

## 组件基础

在 Vue 3 中，组件系统依然是核心概念，但是提供了更现代和灵活的开发方式，特别是引入了 Composition API，使组件逻辑的组织更加灵活和可复用。

## 组件定义方式

### 使用 Options API

```javascript
// 传统的 Options API 方式
export default {
  name: 'MyComponent',
  props: {
    message: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      this.count++
    }
  },
  mounted() {
    console.log('Component mounted')
  }
}
```

### 使用 Composition API (推荐)

Vue 3 引入了 Composition API，提供了更灵活的组件逻辑组织方式：

```vue
<template>
  <div class="my-component">
    <h2>{{ message }}</h2>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 定义 props
const props = defineProps({
  message: {
    type: String,
    default: ''
  }
})

// 定义响应式数据
const count = ref(0)

// 定义方法
function increment() {
  count.value++
}

// 生命周期钩子
onMounted(() => {
  console.log('Component mounted')
})
</script>

<style scoped>
.my-component {
  padding: 20px;
  border: 1px solid #ddd;
}
</style>
```

## 组件通信

### Props 传递

```vue
<!-- 父组件 -->
<template>
  <child-component :title="pageTitle" :user="currentUser" />
</template>

<script setup>
import { ref, reactive } from 'vue'
import ChildComponent from './ChildComponent.vue'

const pageTitle = ref('Welcome')
const currentUser = reactive({
  name: 'John Doe',
  role: 'Admin'
})
</script>
```

```vue
<!-- 子组件 ChildComponent.vue -->
<template>
  <div>
    <h1>{{ title }}</h1>
    <p>User: {{ user.name }}</p>
  </div>
</template>

<script setup>
// 使用 defineProps 定义 props
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  user: {
    type: Object,
    default: () => ({})
  }
})
</script>
```

### 事件传递

```vue
<!-- 子组件 ChildComponent.vue -->
<template>
  <button @click="handleClick">触发事件</button>
</template>

<script setup>
// 使用 defineEmits 定义事件
const emit = defineEmits(['custom-event', 'update:count'])

function handleClick() {
  // 触发事件并传递数据
  emit('custom-event', { data: 'some data' })
  emit('update:count', 1)
}
</script>
```

```vue
<!-- 父组件 -->
<template>
  <child-component 
    @custom-event="handleCustomEvent" 
    @update:count="count += $event"
  />
  <p>Count: {{ count }}</p>
</template>

<script setup>
import { ref } from 'vue'
import ChildComponent from './ChildComponent.vue'

const count = ref(0)

function handleCustomEvent(data) {
  console.log('Custom event received:', data)
}
</script>
```

### v-model 双向绑定

```vue
<!-- 子组件 CustomInput.vue -->
<template>
  <input 
    type="text" 
    :value="modelValue" 
    @input="updateValue($event.target.value)" 
  />
</template>

<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

function updateValue(value) {
  emit('update:modelValue', value)
}
</script>
```

```vue
<!-- 父组件 -->
<template>
  <custom-input v-model="message" />
  <p>Message: {{ message }}</p>
</template>

<script setup>
import { ref } from 'vue'
import CustomInput from './CustomInput.vue'

const message = ref('')
</script>
```

### 插槽 (Slots)

```vue
<!-- 子组件 Card.vue -->
<template>
  <div class="card">
    <div class="card-header">
      <slot name="header">默认标题</slot>
    </div>
    <div class="card-body">
      <slot>默认内容</slot>
    </div>
    <div class="card-footer">
      <slot name="footer">默认页脚</slot>
    </div>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}
.card-header,
.card-body,
.card-footer {
  padding: 16px;
}
.card-header {
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
}
.card-footer {
  background-color: #f5f5f5;
  border-top: 1px solid #ddd;
}
</style>
```

```vue
<!-- 父组件 -->
<template>
  <card>
    <template #header>
      <h2>自定义标题</h2>
    </template>
    <p>这是卡片的内容</p>
    <template #footer>
      <button>确认</button>
      <button>取消</button>
    </template>
  </card>
</template>

<script setup>
import Card from './Card.vue'
</script>
```

## 组件生命周期

Vue 3 的生命周期钩子与 Vue 2 类似，但在 Composition API 中有一些差异：

```javascript
import {
  onMounted,
  onUpdated,
  onUnmounted,
  onBeforeMount,
  onBeforeUpdate,
  onBeforeUnmount,
  onErrorCaptured,
  onRenderTracked,
  onRenderTriggered
} from 'vue'

// 在组件中使用
setup() {
  onMounted(() => {
    console.log('组件已挂载')
  })
  
  onUpdated(() => {
    console.log('组件已更新')
  })
  
  onUnmounted(() => {
    console.log('组件已卸载')
  })
  
  onBeforeMount(() => {
    console.log('组件挂载前')
  })
  
  onBeforeUpdate(() => {
    console.log('组件更新前')
  })
  
  onBeforeUnmount(() => {
    console.log('组件卸载前')
  })
  
  onErrorCaptured((err, instance, info) => {
    console.log('捕获到错误:', err)
    return false // 阻止错误继续向上传播
  })
  
  // 仅开发环境使用
  onRenderTracked((event) => {
    console.log('渲染跟踪:', event)
  })
  
  // 仅开发环境使用
  onRenderTriggered((event) => {
    console.log('渲染触发:', event)
  })
}
```

## 组合式函数 (Composition Functions)

Vue 3 的一个强大特性是可以创建可重用的组合式函数：

```javascript
// useCounter.js
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  function increment() {
    count.value++
  }
  
  function decrement() {
    count.value--
  }
  
  function reset() {
    count.value = initialValue
  }
  
  const isPositive = computed(() => count.value > 0)
  
  return {
    count,
    increment,
    decrement,
    reset,
    isPositive
  }
}
```

```vue
<!-- 在组件中使用 -->
<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Is Positive: {{ isPositive }}</p>
    <button @click="increment">Increment</button>
    <button @click="decrement">Decrement</button>
    <button @click="reset">Reset</button>
  </div>
</template>

<script setup>
import { useCounter } from './composables/useCounter'

// 使用组合式函数
const { count, increment, decrement, reset, isPositive } = useCounter(5)
</script>
```

## 动态组件

```vue
<template>
  <div>
    <button @click="currentComponent = 'ComponentA'">Component A</button>
    <button @click="currentComponent = 'ComponentB'">Component B</button>
    
    <component :is="currentComponent" />
    
    <!-- 带 keep-alive 的动态组件 -->
    <keep-alive include="ComponentA">
      <component :is="currentComponent" />
    </keep-alive>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ComponentA from './ComponentA.vue'
import ComponentB from './ComponentB.vue'

const currentComponent = ref('ComponentA')
</script>
```

## 组件库开发规范

### 目录结构

```
components/
  component-name/
    __test__/       # 测试文件
      component.spec.ts
    src/            # 组件源码
      index.vue
    styles/         # 样式文件
      index.less
    index.ts        # 组件入口文件
```

### 组件入口模板

```ts
// index.ts
import { App } from 'vue'
import Component from './src/index.vue'
import './styles/index.less'

// 定义组件的 install 方法
export const ComponentPlugin = {
  install(app: App) {
    app.component('BaseComponent', Component)
  }
}

// 导出组件
export { Component }

// 导出类型
export * from './src/types'
```

## 测试规范

1. 单元测试覆盖率 ≥ 90%
2. 测试文件放在 __test__ 目录下
3. 使用 Vitest 进行测试
4. 测试用例应覆盖：
   - 组件渲染
   - Props 传递
   - 事件触发
   - 插槽内容

## 最佳实践

1. **组件拆分**
   - 遵循单一职责原则，一个组件只做一件事
   - 组件大小适中，过大的组件考虑拆分为多个子组件
   - 使用组合式 API 将逻辑拆分为可重用的组合式函数

2. **性能优化**
   - 使用 `v-memo` 缓存模板节点
   - 合理使用 `computed` 和 `watch`
   - 使用 `defineAsyncComponent` 进行组件懒加载
   - 为大列表使用虚拟滚动

3. **代码组织**
   - 使用 `<script setup>` 语法糖
   - 合理使用 TypeScript 类型
   - 组件命名遵循 PascalCase

4. **可维护性**
   - 添加适当的注释
   - 遵循一致的代码风格
   - 使用 ESLint 和 Prettier 保证代码质量

## 参考资源

- [Vue 3 官方文档](https://v3.cn.vuejs.org/)
- [Vue 3 Composition API](https://v3.cn.vuejs.org/guide/composition-api-introduction.html)
- [Vue 3 组件基础](https://v3.cn.vuejs.org/guide/component-basics.html)