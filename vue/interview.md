# Vue.js 面试重点内容

## 目录

- [Vue 2 vs Vue 3](#vue-2-vs-vue-3)
- [核心概念](#核心概念)
- [响应式原理](#响应式原理)
- [组件通信](#组件通信)
- [生命周期](#生命周期)
- [Vue Router](#vue-router)
- [状态管理](#状态管理)
- [性能优化](#性能优化)
- [常见问题解答](#常见问题解答)

## Vue 2 vs Vue 3

### 主要区别

| 特性 | Vue 2 | Vue 3 |
|------|-------|-------|
| 响应式系统 | Object.defineProperty | Proxy |
| Composition API | 不支持 | 原生支持 |
| Multiple root nodes | 不支持 | 支持 |
| Teleport | 不支持 | 原生支持 |
| Suspense | 不支持 | 原生支持 |
| Fragments | 不支持 | 原生支持 |
| TypeScript | 支持有限 | 一流支持 |
| 打包体积 | 较大 | 更小 |
| 性能 | 较快 | 更快 |

### 迁移考虑

1. **API 变化** - 组合式 API 与选项式 API
2. **生命周期钩子** - 名称变更
3. **Slots 语法** - 新的 v-slot 语法
4. **过滤器** - 移除了过滤器功能

## 核心概念

### 什么是 Vue.js？

Vue.js 是一套用于构建用户界面的渐进式 JavaScript 框架。它采用自底向上增量开发的设计，核心库只关注视图层，易于学习且易于与其他库或现有项目整合。

### Vue 的核心特性

1. **响应式数据绑定** - 数据驱动视图
2. **组件化开发** - 可复用的组件系统
3. **虚拟 DOM** - 高效的 DOM 更新
4. **指令系统** - 扩展 HTML 特性
5. **过渡动画** - 内置过渡效果支持

### MVVM 模式

Vue 采用了 MVVM（Model-View-ViewModel）模式：

- **Model** - 数据层
- **View** - 视图层
- **ViewModel** - 连接 Model 和 View 的桥梁

## 响应式原理

### Vue 2 响应式原理

Vue 2 使用 Object.defineProperty 来劫持对象属性的 getter 和 setter：

```javascript
// 简化版实现
function defineReactive(obj, key, val) {
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      console.log('读取数据')
      return val
    },
    set(newVal) {
      if (newVal === val) return
      console.log('设置数据')
      val = newVal
    }
  })
}
```

**限制**：
1. 无法检测对象属性的添加或删除
2. 无法检测数组索引的变更

### Vue 3 响应式原理

Vue 3 使用 Proxy 来实现响应式：

```javascript
// 简化版实现
function reactive(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      console.log('读取数据')
      return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
      console.log('设置数据')
      return Reflect.set(target, key, value, receiver)
    }
  })
}
```

**优势**：
1. 可以检测对象属性的添加或删除
2. 可以监听数组索引的变化
3. 性能更好

### 响应式 API

#### Vue 2 选项式 API

```javascript
export default {
  data() {
    return {
      message: 'Hello Vue!',
      count: 0
    }
  },
  methods: {
    increment() {
      this.count++
    }
  }
}
```

#### Vue 3 组合式 API

```javascript
import { ref, reactive } from 'vue'

export default {
  setup() {
    const message = ref('Hello Vue!')
    const count = ref(0)
    
    const state = reactive({
      message: 'Hello Vue!',
      count: 0
    })
    
    const increment = () => {
      count.value++
      // 或者
      state.count++
    }
    
    return {
      message,
      count,
      state,
      increment
    }
  }
}
```

## 组件通信

### 父子组件通信

#### Props (父传子)

```javascript
// 父组件
<ChildComponent :message="parentMessage" />

// 子组件
export default {
  props: ['message'],
  // 或者带验证
  props: {
    message: {
      type: String,
      required: true,
      default: ''
    }
  }
}
```

#### Events (子传父)

```javascript
// 子组件
export default {
  methods: {
    sendMessage() {
      this.$emit('child-event', '来自子组件的消息')
    }
  }
}

// 父组件
<ChildComponent @child-event="handleChildEvent" />
```

### 跨级组件通信

#### Provide/Inject

```javascript
// 祖先组件
export default {
  provide() {
    return {
      theme: 'dark',
      user: this.currentUser
    }
  }
}

// 后代组件
export default {
  inject: ['theme', 'user']
  // 或者带默认值
  inject: {
    theme: {
      default: 'light'
    }
  }
}
```

### 兄弟组件通信

#### Event Bus

```javascript
// Vue 2
// eventBus.js
import Vue from 'vue'
export default new Vue()

// 组件 A
import eventBus from './eventBus'
eventBus.$emit('message', 'Hello!')

// 组件 B
import eventBus from './eventBus'
eventBus.$on('message', (data) => {
  console.log(data)
})
```

#### Vuex/Pinia

```javascript
// 使用 Pinia (Vue 3)
import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    message: 'Hello!'
  }),
  actions: {
    updateMessage(newMessage) {
      this.message = newMessage
    }
  }
})
```

## 生命周期

### Vue 2 生命周期

```javascript
export default {
  beforeCreate() {
    // 实例初始化之后，数据观测和事件配置之前
  },
  created() {
    // 实例创建完成，可以访问 data、methods 等
  },
  beforeMount() {
    // 挂载开始之前被调用
  },
  mounted() {
    // 实例挂载到 DOM 上
  },
  beforeUpdate() {
    // 数据更新时调用
  },
  updated() {
    // 数据更改导致的虚拟 DOM 重新渲染和打补丁之后调用
  },
  beforeDestroy() {
    // 实例销毁之前调用
  },
  destroyed() {
    // 实例销毁后调用
  }
}
```

### Vue 3 生命周期

```javascript
import { onMounted, onUpdated, onUnmounted } from 'vue'

export default {
  setup() {
    onBeforeMount(() => {
      // 挂载开始之前被调用
    })
    
    onMounted(() => {
      // 实例挂载到 DOM 上
    })
    
    onBeforeUpdate(() => {
      // 数据更新时调用
    })
    
    onUpdated(() => {
      // 数据更改导致的虚拟 DOM 重新渲染和打补丁之后调用
    })
    
    onBeforeUnmount(() => {
      // 实例销毁之前调用
    })
    
    onUnmounted(() => {
      // 实例销毁后调用
    })
  }
}
```

## Vue Router

### 路由模式

1. **Hash 模式** - 使用 URL hash 来模拟完整的 URL
2. **History 模式** - 利用 history.pushState() API
3. **Abstract 模式** - 不依赖浏览器环境

### 导航守卫

#### 全局前置守卫

```javascript
router.beforeEach((to, from, next) => {
  // 验证权限
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next('/login')
  } else {
    next()
  }
})
```

#### 组件内守卫

```javascript
export default {
  beforeRouteEnter(to, from, next) {
    // 进入路由前调用
    next()
  },
  beforeRouteUpdate(to, from, next) {
    // 路由参数变化时调用
    next()
  },
  beforeRouteLeave(to, from, next) {
    // 离开路由前调用
    next()
  }
}
```

### 动态路由

```javascript
const routes = [
  {
    path: '/user/:id',
    component: User,
    props: true
  }
]

// 获取路由参数
export default {
  props: ['id'],
  // 或者
  computed: {
    userId() {
      return this.$route.params.id
    }
  }
}
```

## 状态管理

### Vuex (Vue 2/3)

```javascript
// store/index.js
import { createStore } from 'vuex'

export default createStore({
  state: {
    count: 0
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
  },
  getters: {
    doubleCount: state => state.count * 2
  }
})
```

### Pinia (Vue 3 推荐)

```javascript
// stores/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0
  }),
  actions: {
    increment() {
      this.count++
    }
  },
  getters: {
    doubleCount: (state) => state.count * 2
  }
})
```

## 性能优化

### 1. 组件优化

#### 使用 Functional Components

```javascript
// Vue 2
Vue.component('my-component', {
  functional: true,
  render(h, { props, children }) {
    return h('div', props.message)
  }
})

// Vue 3
const MyComponent = () => {
  return h('div', 'Hello')
}
```

#### 使用 Keep-alive 缓存组件

```vue
<keep-alive>
  <component :is="currentComponent"></component>
</keep-alive>

<!-- 有条件缓存 -->
<keep-alive include="ComponentA,ComponentB">
  <component :is="currentComponent"></component>
</keep-alive>
```

### 2. 数据优化

#### 使用 Object.freeze() 防止响应式转换

```javascript
export default {
  data() {
    return {
      // 不需要响应式的大量数据
      largeDataset: Object.freeze(largeArray)
    }
  }
}
```

#### 使用 v-show 和 v-if 正确切换

```vue
<!-- 频繁切换使用 v-show -->
<div v-show="isVisible">经常切换的内容</div>

<!-- 条件很少改变使用 v-if -->
<div v-if="isAdmin">管理员内容</div>
```

### 3. 列表优化

#### 使用 key 属性

```vue
<!-- 好的做法 -->
<li v-for="item in items" :key="item.id">
  {{ item.name }}
</li>

<!-- 避免使用 index 作为 key -->
<li v-for="(item, index) in items" :key="index">
  {{ item.name }}
</li>
```

#### 使用虚拟滚动处理长列表

```vue
<template>
  <RecycleScroller
    class="scroller"
    :items="list"
    :item-size="32"
    key-field="id"
    v-slot="{ item }"
  >
    <div class="user">
      {{ item.name }}
    </div>
  </RecycleScroller>
</template>
```

### 4. 图片优化

#### 使用懒加载

```vue
<!-- Vue 3 -->
<img v-lazy="imageSrc" />

<!-- 或者使用原生 -->
<img :data-src="imageSrc" class="lazy" />
```

## 常见问题解答

### Q: Vue 3 的 Composition API 相比 Options API 有什么优势？

A: Composition API 的优势包括：
1. **更好的逻辑复用** - 可以轻松抽取和组合逻辑功能
2. **更好的类型推导** - 对 TypeScript 更友好
3. **更灵活的代码组织** - 可以按逻辑关注点组织代码
4. **更好的代码压缩** - 函数式风格更容易被压缩

### Q: Vue 的双向绑定是如何实现的？

A: Vue 的双向绑定通过"数据劫持"结合"发布-订阅模式"实现：
1. 通过 Object.defineProperty() 或 Proxy 劫持数据的 getter 和 setter
2. 在 getter 中收集依赖，在 setter 中触发更新
3. 使用观察者模式通知视图更新

### Q: Vue 组件的 data 为什么必须是一个函数？

A: 组件可能有多个实例，如果 data 是一个对象，那么所有实例将共享同一个数据对象，导致数据污染。使用函数每次返回一个新的对象实例，确保每个组件实例都有独立的数据空间。

### Q: nextTick 的原理是什么？

A: nextTick 的原理是：
1. 将回调函数放入微任务队列或宏任务队列
2. 在下次 DOM 更新循环结束之后执行回调
3. 优先使用 Promise.then，其次是 MutationObserver，然后是 setImmediate，最后是 setTimeout

### Q: Vue 3 的性能为什么比 Vue 2 好？

A: Vue 3 的性能提升主要体现在：
1. **响应式系统优化** - 使用 Proxy 替代 Object.defineProperty
2. **编译优化** - 更高效的模板编译器
3. **打包体积减小** - 更好的 Tree-shaking 支持
4. **虚拟 DOM 重写** - 更高效的 diff 算法

### Q: Vue 和 React 的主要区别？

A: Vue 和 React 的主要区别包括：
1. **模板语法** - Vue 使用模板语法，React 使用 JSX
2. **数据流** - Vue 是双向数据绑定，React 是单向数据流
3. **状态管理** - Vue 有 Vuex/Pinia，React 有 Redux/MobX/context
4. **学习曲线** - Vue 相对更平缓，React 需要学习更多概念

通过掌握这些面试重点内容，你将能够在面试中展现出对 Vue.js 的深入理解，并能够回答大部分相关技术问题。