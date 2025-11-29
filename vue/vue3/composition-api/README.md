# Vue 3 Composition API

## 什么是 Composition API？

Composition API 是 Vue 3 中引入的一组 API，它提供了一种更灵活的方式来组织组件逻辑。与传统的 Options API 不同，Composition API 允许我们基于逻辑关注点而不是选项类型来组织代码。

## 为什么使用 Composition API？

### 更好的逻辑复用

Composition API 使我们能够更轻松地提取和重用组件逻辑：

```javascript
// 可复用的组合式函数
export function useCounter() {
  const count = ref(0)
  const increment = () => count.value++
  
  return { count, increment }
}
```

### 更好的类型推导

Composition API 与 TypeScript 配合得更好，提供了更完善的类型推导：

```typescript
function useCounter(initialValue: number) {
  const count = ref(initialValue)
  const increment = () => count.value++
  
  return { count, increment }
}
```

### 更灵活的代码组织

对于逻辑复杂的组件，Composition API 允许我们根据功能将相关代码组织在一起：

```javascript
// 根据功能分组
function useUserManagement() {
  // 用户相关逻辑
}

function useProductData() {
  // 产品相关逻辑
}
```

## setup() 函数

Composition API 的核心是 `setup()` 函数，它是在组件实例创建之前执行的：

```vue
<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    // 响应式状态
    const count = ref(0)
    
    // 方法
    const increment = () => {
      count.value++
    }
    
    // 返回值会暴露给模板和其他选项
    return {
      count,
      increment
    }
  }
}
</script>
```

### 使用 `<script setup>` 语法糖

Vue 3.2+ 提供了 `<script setup>` 语法糖，使 Composition API 的使用更加简洁：

```vue
<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 直接声明的状态和方法会自动暴露给模板
const count = ref(0)

function increment() {
  count.value++
}
</script>
```

## 响应式 API

### ref()

创建一个响应式的 ref 对象：

```javascript
import { ref } from 'vue'

const count = ref(0)
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```

### reactive()

创建一个响应式的对象：

```javascript
import { reactive } from 'vue'

const state = reactive({
  count: 0,
  name: 'Vue 3'
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

侦听一个或多个响应式数据的变化：

```javascript
import { ref, watch } from 'vue'

const count = ref(0)

watch(count, (newValue, oldValue) => {
  console.log(`Count changed from ${oldValue} to ${newValue}`)
})

count.value = 1 // 触发 watch 回调
```

### watchEffect()

自动收集依赖的侦听器：

```javascript
import { ref, watchEffect } from 'vue'

const count = ref(0)

const stop = watchEffect(() => {
  console.log(`Count is: ${count.value}`)
})

count.value = 1 // 触发回调

// 停止侦听
stop()
```

## 生命周期钩子

在 Composition API 中，生命周期钩子是通过导入的函数来使用的：

```javascript
import {
  onMounted,
  onUpdated,
  onUnmounted,
  onBeforeMount,
  onBeforeUpdate,
  onBeforeUnmount
} from 'vue'

setup() {
  onMounted(() => {
    console.log('Component mounted')
  })
  
  onUpdated(() => {
    console.log('Component updated')
  })
  
  onUnmounted(() => {
    console.log('Component unmounted')
  })
}
```

## 组件通信 API

### defineProps()

在 `<script setup>` 中定义组件的 props：

```vue
<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    default: 0
  }
})

console.log(props.title)
</script>
```

### defineEmits()

在 `<script setup>` 中定义组件的事件：

```vue
<script setup>
const emit = defineEmits(['update:count', 'submit'])

function increment() {
  emit('update:count', 1)
}

function handleSubmit() {
  emit('submit', { data: 'form data' })
}
</script>
```

### defineExpose()

在 `<script setup>` 中暴露公共属性和方法：

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}

// 暴露给父组件使用
defineExpose({
  count,
  increment
})
</script>
```

## 组合式函数示例

### 示例 1: 计时器

```javascript
// useTimer.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useTimer(initialTime = 0) {
  const time = ref(initialTime)
  let intervalId = null
  
  const start = () => {
    if (!intervalId) {
      intervalId = setInterval(() => {
        time.value++
      }, 1000)
    }
  }
  
  const pause = () => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }
  
  const reset = () => {
    pause()
    time.value = initialTime
  }
  
  onUnmounted(() => {
    pause()
  })
  
  return {
    time,
    start,
    pause,
    reset
  }
}
```

### 示例 2: 表单处理

```javascript
// useForm.js
import { reactive, computed } from 'vue'

export function useForm(initialValues = {}, validateFn = null) {
  const form = reactive({ ...initialValues })
  const errors = reactive({})
  const touched = reactive({})
  
  const isValid = computed(() => {
    // 验证逻辑
    if (validateFn) {
      const validationErrors = validateFn(form)
      Object.assign(errors, validationErrors)
      return Object.keys(validationErrors).length === 0
    }
    return true
  })
  
  const handleChange = (field, value) => {
    form[field] = value
    touched[field] = true
    
    // 实时验证
    if (validateFn) {
      const fieldError = validateFn({ ...form, [field]: value })[field]
      if (!fieldError) {
        delete errors[field]
      } else {
        errors[field] = fieldError
      }
    }
  }
  
  const handleBlur = (field) => {
    touched[field] = true
  }
  
  const reset = () => {
    Object.keys(form).forEach(key => {
      form[key] = initialValues[key] || ''
    })
    
    Object.keys(errors).forEach(key => {
      delete errors[key]
    })
    
    Object.keys(touched).forEach(key => {
      delete touched[key]
    })
  }
  
  return {
    form,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    reset
  }
}
```

## 最佳实践

1. **提取组合式函数**
   - 将相关的逻辑提取到独立的组合式函数中
   - 遵循单一职责原则，一个组合式函数只负责一个功能

2. **命名约定**
   - 组合式函数命名以 `use` 开头（如 `useCounter`、`useFetch`）
   - 清晰描述函数的用途

3. **返回值**
   - 返回的响应式数据保持其响应性
   - 避免返回整个响应式对象，而是返回需要的特定属性

4. **清理副作用**
   - 在组件卸载时清理定时器、事件监听器等
   - 使用 `onUnmounted` 钩子进行清理

5. **类型安全**
   - 使用 TypeScript 为组合式函数添加类型定义
   - 提供清晰的参数和返回值类型

## 与 Options API 的比较

### Options API

```javascript
export default {
  data() {
    return {
      count: 0
    }
  },
  computed: {
    doubleCount() {
      return this.count * 2
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

### Composition API

```javascript
import { ref, computed, onMounted } from 'vue'

export default {
  setup() {
    const count = ref(0)
    
    const doubleCount = computed(() => count.value * 2)
    
    const increment = () => {
      count.value++
    }
    
    onMounted(() => {
      console.log('Component mounted')
    })
    
    return {
      count,
      doubleCount,
      increment
    }
  }
}
```

### Composition API with `<script setup>`

```javascript
import { ref, computed, onMounted } from 'vue'

const count = ref(0)

const doubleCount = computed(() => count.value * 2)

function increment() {
  count.value++
}

onMounted(() => {
  console.log('Component mounted')
})
```

## 参考资源

- [Vue 3 Composition API 文档](https://v3.cn.vuejs.org/guide/composition-api-introduction.html)
- [Vue 3 响应式系统](https://v3.cn.vuejs.org/guide/reactivity-fundamentals.html)
- [组合式 API 最佳实践](https://v3.cn.vuejs.org/guide/composition-api-best-practices.html)