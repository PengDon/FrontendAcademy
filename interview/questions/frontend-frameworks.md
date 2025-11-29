# 前端框架（Vue/React）面试题

## Vue 核心概念

### 1. Vue 双向数据绑定的原理是什么？

**答案：**
Vue 的双向数据绑定基于**数据劫持**和**发布-订阅模式**实现。

**核心原理：**
1. **数据劫持**：使用 `Object.defineProperty()` 拦截对象属性的 `getter` 和 `setter`
2. **依赖收集**：在 `getter` 中收集依赖，在 `setter` 中通知更新
3. **响应式系统**：当数据发生变化时，自动更新视图

**具体实现：**
- 创建 `Observer` 对象，递归遍历数据对象，将所有属性转换为 getter/setter
- 创建 `Dep`（依赖收集器），负责收集和通知依赖
- 创建 `Watcher`，作为连接视图和数据的桥梁
- 编译模板，生成更新函数，绑定 Watcher

**Vue 3 的改进：**
- 使用 `Proxy` 替代 `Object.defineProperty`
- 支持数组索引和对象属性的新增
- 性能更好，内存占用更小

```javascript
// Vue 2 简化实现示例
function defineReactive(data, key, value) {
  // 递归处理嵌套对象
  if (typeof value === 'object') {
    new Observer(value);
  }
  
  const dep = new Dep();
  
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get() {
      // 依赖收集
      if (Dep.target) {
        dep.addSub(Dep.target);
      }
      return value;
    },
    set(newValue) {
      if (value === newValue) return;
      value = newValue;
      // 通知更新
      dep.notify();
    }
  });
}
```

### 2. Vue 组件间通信方式有哪些？

**答案：**

**1. Props/Events（父子组件通信）**
```vue
<!-- 父组件 -->
<template>
  <ChildComponent :message="parentMsg" @update="handleUpdate" />
</template>

<script>
export default {
  data() {
    return {
      parentMsg: 'Hello from parent'
    }
  },
  methods: {
    handleUpdate(data) {
      console.log('Received from child:', data);
    }
  }
}
</script>

<!-- 子组件 -->
<template>
  <div>{{ message }}</div>
  <button @click="sendUpdate">Send Update</button>
</template>

<script>
export default {
  props: ['message'],
  methods: {
    sendUpdate() {
      this.$emit('update', 'Hello from child');
    }
  }
}
</script>
```

**2. $parent/$children（直接父子组件访问）**
```javascript
// 子组件访问父组件
this.$parent.someMethod();

// 父组件访问子组件（通过 ref）
<ChildComponent ref="childRef" />
this.$refs.childRef.someMethod();
```

**3. Provide/Inject（跨层级组件通信）**
```vue
<!-- 父组件 -->
export default {
  provide() {
    return {
      theme: 'dark',
      changeTheme: this.changeTheme
    }
  },
  methods: {
    changeTheme(newTheme) {
      // 实现主题切换
    }
  }
}

<!-- 子组件（无论层级多深） -->
export default {
  inject: ['theme', 'changeTheme']
}
```

**4. Vuex（全局状态管理）**
```javascript
// store/index.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
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

// 组件中使用
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapState(['count']),
    ...mapGetters(['doubleCount'])
  },
  methods: {
    ...mapMutations(['increment']),
    ...mapActions(['incrementAsync'])
  }
}
```

**5. EventBus（事件总线）**
```javascript
// 创建事件总线
// main.js
Vue.prototype.$bus = new Vue()

// 发送事件
this.$bus.$emit('eventName', data)

// 监听事件
this.$bus.$on('eventName', data => {
  console.log('Received data:', data)
})

// 移除事件监听
this.$bus.$off('eventName')
```

**6. localStorage/sessionStorage（跨页面通信）**
```javascript
// 存储数据
localStorage.setItem('sharedData', JSON.stringify(data))

// 监听存储事件
window.addEventListener('storage', (e) => {
  if (e.key === 'sharedData') {
    const newData = JSON.parse(e.newValue)
    // 处理数据更新
  }
})
```

### 3. Vue 生命周期钩子函数有哪些？分别在什么阶段执行？

**答案：**

**组件生命周期分为 8 个阶段：**

**1. 创建阶段**
- **beforeCreate**：实例初始化后，数据观测和事件配置之前调用
  - 特点：无法访问 data、methods 等
  - 用途：可以进行一些简单的初始化操作

- **created**：实例创建完成，已完成数据观测、属性和方法的运算，事件回调的配置
  - 特点：可以访问 data、methods，但 DOM 尚未生成
  - 用途：常用于数据获取、初始化操作

**2. 挂载阶段**
- **beforeMount**：模板编译/挂载之前
  - 特点：$el 属性已存在，但尚未挂载到 DOM
  - 用途：可以修改模板数据

- **mounted**：实例挂载完成
  - 特点：DOM 已生成，可以进行 DOM 操作
  - 用途：常用于 DOM 操作、第三方库初始化

**3. 更新阶段**
- **beforeUpdate**：数据更新前
  - 特点：数据已更新，但 DOM 尚未更新
  - 用途：可以访问更新前的数据和 DOM

- **updated**：数据更新后
  - 特点：DOM 已更新
  - 用途：可以执行依赖 DOM 的操作

**4. 销毁阶段**
- **beforeDestroy**：实例销毁前
  - 特点：实例仍然完全可用
  - 用途：清除定时器、移除事件监听器

- **destroyed**：实例销毁后
  - 特点：所有指令解绑，事件监听器移除，子实例销毁
  - 用途：最后的清理工作

**Vue 3 新增生命周期钩子：**
- **setup**：组件初始化前执行，替代 beforeCreate 和 created
- **onBeforeMount**：替代 beforeMount
- **onMounted**：替代 mounted
- **onBeforeUpdate**：替代 beforeUpdate
- **onUpdated**：替代 updated
- **onBeforeUnmount**：替代 beforeDestroy
- **onUnmounted**：替代 destroyed
- **onErrorCaptured**：捕获子组件错误
- **onRenderTracked**：跟踪渲染依赖
- **onRenderTriggered**：触发渲染的调试钩子

### 4. Vue 中的 computed 和 watch 有什么区别？

**答案：**

**computed（计算属性）：**
- **定义**：计算属性，基于响应式依赖进行缓存的计算值
- **特点**：
  - 有缓存，只有依赖数据变化时才重新计算
  - 必须有返回值
  - 适合复杂逻辑计算
  - 不能直接修改，需要设置 setter
- **使用场景**：数据需要经过处理后展示，如格式化、过滤、计算等

```javascript
computed: {
  // 只读计算属性
  fullName() {
    return this.firstName + ' ' + this.lastName
  },
  
  // 可写计算属性
  fullName: {
    get() {
      return this.firstName + ' ' + this.lastName
    },
    set(value) {
      const names = value.split(' ')
      this.firstName = names[0]
      this.lastName = names[1]
    }
  }
}
```

**watch（侦听器）：**
- **定义**：侦听数据变化并执行回调函数
- **特点**：
  - 没有缓存，数据变化就会触发
  - 可以执行异步操作
  - 可以监听多个数据
  - 支持深度监听
- **使用场景**：需要在数据变化时执行异步或开销较大的操作

```javascript
watch: {
  // 基本用法
  firstName(newVal, oldVal) {
    console.log(newVal, oldVal)
  },
  
  // 深度监听
  userInfo: {
    handler(newVal, oldVal) {
      console.log(newVal, oldVal)
    },
    deep: true,
    immediate: true // 立即执行一次
  },
  
  // 监听对象的某个属性
  'userInfo.name'(newVal, oldVal) {
    console.log(newVal, oldVal)
  }
}
```

**选择建议：**
- 当需要基于现有数据计算出新数据时，使用 computed
- 当需要在数据变化时执行异步操作或副作用时，使用 watch

### 5. Vue 中的 nextTick 有什么作用？

**答案：**
`nextTick` 用于在下次 DOM 更新循环结束后执行回调函数。

**原理：**
Vue 使用异步队列来处理 DOM 更新，当数据变化时，Vue 不会立即更新 DOM，而是将更新放入队列中，等待下一个事件循环执行。`nextTick` 就是在这个队列执行完成后触发回调。

**使用场景：**
1. 修改数据后，需要立即获取更新后的 DOM
2. 在组件挂载后，需要操作 DOM
3. 处理第三方库与 Vue 的交互

```javascript
// 基本用法
this.message = 'Hello'
this.$nextTick(() => {
  // DOM 已更新
  const el = this.$el.querySelector('.message')
  console.log(el.textContent) // 'Hello'
})

// Promise 形式（Vue 2.1.0+）
async updateMessage() {
  this.message = 'Hello'
  await this.$nextTick()
  // DOM 已更新
  const el = this.$el.querySelector('.message')
  console.log(el.textContent) // 'Hello'
}
```

## React 核心概念

### 6. React 的虚拟 DOM（Virtual DOM）原理是什么？

**答案：**
虚拟 DOM 是 React 实现高效 UI 更新的核心机制，是对真实 DOM 的轻量级 JavaScript 表示。

**工作原理：**
1. **首次渲染**：React 将组件渲染为虚拟 DOM 树
2. **数据更新**：状态变化时，生成新的虚拟 DOM 树
3. **Diff 算法**：比较新旧虚拟 DOM 树的差异
4. **最小化更新**：只将差异部分应用到真实 DOM

**Diff 算法优化策略：**
- **层级比较**：只比较同一层级的节点
- **类型比较**：如果节点类型改变，直接替换整个子树
- **key 属性**：用于标识节点，帮助 React 识别列表项的移动

**虚拟 DOM 的优势：**
- 减少 DOM 操作，提高性能
- 支持跨平台渲染（React Native）
- 简化开发，专注于状态管理

```javascript
// 虚拟 DOM 的简化表示
const virtualDOM = {
  type: 'div',
  props: {
    className: 'container',
    children: [
      {
        type: 'h1',
        props: {
          children: 'Hello World'
        }
      },
      {
        type: 'button',
        props: {
          onClick: handleClick,
          children: 'Click Me'
        }
      }
    ]
  }
}
```

### 7. React 组件生命周期有哪些阶段？

**答案：**
React 组件生命周期分为挂载、更新、卸载三个阶段。

**类组件生命周期：**

**1. 挂载阶段**
- **constructor(props)**：构造函数，初始化 state 和绑定方法
- **static getDerivedStateFromProps(props, state)**：根据 props 更新 state
- **render()**：渲染组件
- **componentDidMount()**：组件挂载完成
  - 用途：获取数据、订阅事件、操作 DOM

**2. 更新阶段**
- **static getDerivedStateFromProps(props, state)**：根据 props 更新 state
- **shouldComponentUpdate(nextProps, nextState)**：决定是否重新渲染
  - 返回 false 可阻止渲染，优化性能
- **render()**：渲染组件
- **getSnapshotBeforeUpdate(prevProps, prevState)**：在 DOM 更新前获取快照
- **componentDidUpdate(prevProps, prevState, snapshot)**：组件更新完成
  - 用途：操作更新后的 DOM，发起网络请求

**3. 卸载阶段**
- **componentWillUnmount()**：组件卸载前
  - 用途：清理副作用，如取消订阅、清除定时器

**4. 错误处理**
- **static getDerivedStateFromError(error)**：捕获子组件错误并更新 state
- **componentDidCatch(error, info)**：捕获子组件错误并记录错误信息

**函数组件生命周期（使用 Hooks）：**
- **useState**：状态管理
- **useEffect**：副作用管理，相当于 componentDidMount, componentDidUpdate, componentWillUnmount 的组合
- **useLayoutEffect**：同步执行副作用，在 DOM 更新前执行
- **useErrorBoundary**：错误边界

```javascript
// useEffect 模拟生命周期
useEffect(() => {
  // componentDidMount 和 componentDidUpdate
  console.log('Component mounted or updated')
  
  return () => {
    // componentWillUnmount
    console.log('Component will unmount')
  }
}, [dependency]) // 依赖项数组
```

### 8. React 中的状态管理方式有哪些？

**答案：**

**1. 组件内部状态（useState/this.state）**
```javascript
// 函数组件（Hooks）
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}

// 类组件
class CounterClass extends React.Component {
  constructor(props) {
    super(props)
    this.state = { count: 0 }
  }
  
  increment = () => {
    this.setState({ count: this.state.count + 1 })
  }
  
  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.increment}>Increment</button>
      </div>
    )
  }
}
```

**2. Context API**
```javascript
// 创建 Context
const ThemeContext = React.createContext()

// Provider 组件
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }
  
  const value = {
    theme,
    toggleTheme
  }
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// 消费者组件（使用 useContext）
function ThemedButton() {
  const { theme, toggleTheme } = useContext(ThemeContext)
  
  return (
    <button 
      onClick={toggleTheme}
      style={{ background: theme === 'light' ? '#fff' : '#333', color: theme === 'light' ? '#333' : '#fff' }}
    >
      Toggle Theme
    </button>
  )
}
```

**3. Redux**
```javascript
// 1. 定义 Action
const INCREMENT = 'INCREMENT'
const DECREMENT = 'DECREMENT'

// 2. 创建 Action Creators
export const increment = () => ({ type: INCREMENT })
export const decrement = () => ({ type: DECREMENT })

// 3. 定义 Reducer
const initialState = { count: 0 }

function counterReducer(state = initialState, action) {
  switch (action.type) {
    case INCREMENT:
      return { count: state.count + 1 }
    case DECREMENT:
      return { count: state.count - 1 }
    default:
      return state
  }
}

// 4. 创建 Store
import { createStore } from 'redux'
const store = createStore(counterReducer)

// 5. 在组件中使用（使用 react-redux）
import { useSelector, useDispatch } from 'react-redux'

function Counter() {
  const count = useSelector(state => state.count)
  const dispatch = useDispatch()
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
    </div>
  )
}
```

**4. MobX**
```javascript
import { observable, action, makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react'

// 1. 创建 Store
class CounterStore {
  count = 0
  
  constructor() {
    makeAutoObservable(this)
  }
  
  increment = () => {
    this.count++
  }
  
  decrement = () => {
    this.count--
  }
}

const counterStore = new CounterStore()

// 2. 在组件中使用
const Counter = observer(() => {
  return (
    <div>
      <p>Count: {counterStore.count}</p>
      <button onClick={counterStore.increment}>Increment</button>
      <button onClick={counterStore.decrement}>Decrement</button>
    </div>
  )
})
```

**5. Recoil**
```javascript
import { atom, useRecoilState, RecoilRoot } from 'recoil'

// 1. 定义 Atom
const countState = atom({
  key: 'countState',
  default: 0
})

// 2. 在组件中使用
function Counter() {
  const [count, setCount] = useRecoilState(countState)
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
    </div>
  )
}

// 3. 根组件包裹
function App() {
  return (
    <RecoilRoot>
      <Counter />
    </RecoilRoot>
  )
}
```

### 9. React Hooks 有哪些？分别有什么作用？

**答案：**

**1. useState**
- **作用**：在函数组件中添加状态
- **用法**：`const [state, setState] = useState(initialState)`
- **参数**：初始状态值
- **返回值**：状态值和更新函数

```javascript
const [count, setCount] = useState(0)
setCount(prevCount => prevCount + 1) // 函数式更新
```

**2. useEffect**
- **作用**：处理副作用，相当于类组件的生命周期方法
- **用法**：`useEffect(effect, dependencies)`
- **参数**：
  - effect：副作用函数
  - dependencies：依赖项数组
- **清理**：在 effect 中返回清理函数

```javascript
useEffect(() => {
  // 副作用
  const timer = setTimeout(() => {}, 1000)
  
  // 清理函数
  return () => clearTimeout(timer)
}, [dependency])
```

**3. useContext**
- **作用**：访问 Context 中的值
- **用法**：`const value = useContext(Context)`
- **参数**：Context 对象
- **返回值**：Context 中的当前值

```javascript
const theme = useContext(ThemeContext)
```

**4. useReducer**
- **作用**：复杂状态逻辑管理
- **用法**：`const [state, dispatch] = useReducer(reducer, initialState)`
- **参数**：reducer 函数和初始状态
- **返回值**：当前状态和 dispatch 函数

```javascript
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 }
    default:
      throw new Error()
  }
}

const [state, dispatch] = useReducer(reducer, { count: 0 })
```

**5. useMemo**
- **作用**：记忆计算结果，避免不必要的重计算
- **用法**：`const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b])`
- **参数**：计算函数和依赖项数组
- **返回值**：记忆的计算结果

```javascript
const expensiveValue = useMemo(() => {
  return heavyComputation(a, b)
}, [a, b])
```

**6. useCallback**
- **作用**：记忆函数，避免不必要的函数重建
- **用法**：`const memoizedCallback = useCallback(() => { doSomething(a, b); }, [a, b])`
- **参数**：回调函数和依赖项数组
- **返回值**：记忆的回调函数

```javascript
const handleClick = useCallback(() => {
  console.log(a, b)
}, [a, b])
```

**7. useRef**
- **作用**：获取 DOM 引用或存储可变值
- **用法**：`const ref = useRef(initialValue)`
- **参数**：初始值
- **返回值**：带有 current 属性的对象

```javascript
const inputRef = useRef(null)

function focusInput() {
  inputRef.current.focus()
}
```

**8. useImperativeHandle**
- **作用**：自定义暴露给父组件的实例值
- **用法**：`useImperativeHandle(ref, createHandle, [deps])`
- **参数**：ref、创建处理函数、依赖项数组

```javascript
useImperativeHandle(ref, () => ({
  focus: () => {
    inputRef.current.focus()
  }
}))
```

**9. useLayoutEffect**
- **作用**：同步执行副作用，在 DOM 更新前执行
- **用法**：与 useEffect 相同，但执行时机不同

```javascript
useLayoutEffect(() => {
  // 在 DOM 更新前执行
}, [])
```

**10. useDebugValue**
- **作用**：在 React DevTools 中显示自定义 Hook 的标签
- **用法**：`useDebugValue(value, formatter)`

```javascript
useDebugValue(isOnline ? 'Online' : 'Offline')
```

### 10. React 中如何优化性能？

**答案：**

**1. 避免不必要的渲染**
- **使用 React.memo**：记忆组件，避免不必要的重新渲染
```javascript
const MemoizedComponent = React.memo(function MyComponent(props) {
  // 只有当 props 改变时才会重新渲染
})
```

- **使用 useMemo 和 useCallback**：记忆计算结果和函数
```javascript
const expensiveValue = useMemo(() => computeExpensiveValue(a, b), [a, b])
const handleClick = useCallback(() => { /* 处理 */ }, [dependencies])
```

- **实现 shouldComponentUpdate**：在类组件中手动控制渲染
```javascript
shouldComponentUpdate(nextProps, nextState) {
  // 只有当某些属性或状态变化时才重新渲染
  return nextProps.someProp !== this.props.someProp
}
```

**2. 虚拟列表/虚拟滚动**
- 使用 react-window 或 react-virtualized 处理长列表
- 只渲染可见区域的内容，提高性能

**3. 代码分割和懒加载**
- 使用 React.lazy 和 Suspense 实现组件懒加载
```javascript
const LazyComponent = React.lazy(() => import('./LazyComponent'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  )
}
```

**4. 避免内联函数和对象**
- 将函数和对象定义在组件外部或使用 useCallback/useMemo

```javascript
// 避免
function Component() {
  return <ChildComponent onClick={() => console.log('clicked')} style={{ color: 'red' }} />
}

// 推荐
const handleClick = () => console.log('clicked')
const style = { color: 'red' }

function Component() {
  return <ChildComponent onClick={handleClick} style={style} />
}
```

**5. 优化状态管理**
- 避免状态提升过高
- 使用不可变数据结构
- 选择合适的状态管理库

**6. 减少 DOM 操作**
- 使用虚拟化技术
- 避免频繁修改样式
- 使用 CSS transitions 代替 JavaScript 动画

**7. 其他优化**
- 使用生产版本构建
- 优化网络请求（缓存、防抖、节流）
- 使用 webpack bundle analyzer 分析和优化打包结果
- 避免不必要的第三方库

## 框架对比与选择

### 11. Vue 和 React 的主要区别是什么？

**答案：**

**1. 设计理念**
- **Vue**：渐进式框架，易于上手，提供完整的解决方案
- **React**：专注于视图层，更灵活，需要更多的第三方库

**2. 模板语法**
- **Vue**：使用模板语法（类 HTML）
```vue
<template>
  <div>{{ message }}</div>
</template>
```

- **React**：使用 JSX（JavaScript XML）
```jsx
function Component() {
  return <div>{message}</div>
}
```

**3. 状态管理**
- **Vue**：
  - 内置响应式系统
  - 提供 Vuex/Pinia 作为状态管理库
  - 双向数据绑定（v-model）

- **React**：
  - 单向数据流
  - 提供 Context API
  - 常用 Redux/MobX/Recoil 等第三方状态管理

**4. 组件化**
- **Vue**：
  - 单文件组件（.vue）
  - Options API 和 Composition API
  - 更直观的组件生命周期

- **React**：
  - 函数组件和类组件
  - Hooks API
  - 更灵活的组合方式

**5. 性能优化**
- **Vue**：
  - 自动依赖追踪
  - 更细粒度的组件更新
  - 基于依赖的重新渲染

- **React**：
  - 需要手动优化（React.memo, useMemo, useCallback）
  - 虚拟 DOM Diff 算法
  - 时间切片（Concurrent Mode）

**6. 生态系统**
- **Vue**：
  - Vue Router 路由
  - Vuex/Pinia 状态管理
  - Vue CLI/Vite 构建工具
  - 官方维护的全家桶

- **React**：
  - React Router 路由
  - Redux/MobX 状态管理
  - Create React App, Next.js, Gatsby 等构建工具
  - 更丰富的第三方库

**7. 学习曲线**
- **Vue**：较低，对新手友好
- **React**：稍高，需要理解 JSX 和函数式编程概念

### 12. 如何选择合适的前端框架？

**答案：**
选择前端框架需要考虑多个因素，包括项目需求、团队经验、性能要求等。

**考虑因素：**

**1. 项目复杂度**
- 简单项目：Vue 可能更适合，上手快
- 复杂项目：两个框架都可以，但 React 的灵活性可能更有优势

**2. 团队经验**
- 如果团队熟悉 JavaScript，React 可能更容易上手
- 如果团队熟悉 HTML/CSS，Vue 的模板语法可能更直观

**3. 性能要求**
- 大型应用：React 的虚拟 DOM 和性能优化工具更有优势
- 中小型应用：两个框架性能差异不大

**4. 生态系统需求**
- 需要完整解决方案：Vue 官方全家桶
- 需要高度定制：React 更灵活

**5. 长期维护**
- 两个框架都有活跃的社区和长期支持
- 考虑公司技术栈和未来发展方向

**6. 特殊需求**
- 移动端开发：
  - Vue: Vue Native
  - React: React Native（更成熟）
- 服务端渲染：
  - Vue: Nuxt.js
  - React: Next.js（功能更丰富）

**7. 个人偏好**
- 模板 vs JSX
- 命令式 vs 声明式
- 约定优于配置 vs 灵活配置

**最终建议：**
- 小型项目、快速原型：Vue
- 大型应用、复杂状态管理：React
- 移动端原生应用：React Native
- 企业级应用：根据团队技术栈和项目需求决定

### 13. Vue 3 的 Composition API 和 Options API 有什么区别？

**答案：**

**Options API（选项式 API）：**
- **结构**：按照 data、methods、computed、watch 等选项组织代码
- **特点**：
  - 直观易懂，适合新手
  - 组件逻辑分散在不同选项中
  - 代码复用需要通过 mixins、extends 等方式
  - 类型推导不够友好

```javascript
export default {
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
  computed: {
    doubleCount() {
      return this.count * 2
    }
  },
  watch: {
    count(newVal) {
      console.log(newVal)
    }
  }
}
```

**Composition API（组合式 API）：**
- **结构**：使用 setup 函数，按功能逻辑组织代码
- **特点**：
  - 更好的代码组织和复用
  - 更好的 TypeScript 支持
  - 更灵活的逻辑组合
  - 更高效的代码压缩
  - 按需导入，减小打包体积

```javascript
import { ref, computed, watch } from 'vue'

export default {
  setup() {
    const count = ref(0)
    
    const increment = () => {
      count.value++
    }
    
    const doubleCount = computed(() => count.value * 2)
    
    watch(count, (newVal) => {
      console.log(newVal)
    })
    
    return {
      count,
      increment,
      doubleCount
    }
  }
}
```

**选择建议：**
- 小型组件：Options API 简单直观
- 复杂组件：Composition API 更易于维护
- 逻辑复用需求强的项目：Composition API 的组合函数更灵活
- TypeScript 项目：Composition API 类型支持更好

### 14. React 中的虚拟 DOM 和 Vue 中的虚拟 DOM 有什么区别？

**答案：**

**React 虚拟 DOM：**
- 使用 JSX 构建虚拟 DOM
- Diff 算法基于"先序深度优先遍历"
- 需要手动优化渲染（React.memo, useMemo）
- 更新是"全量更新"，然后通过 Diff 找出最小变化
- 使用 keys 帮助识别元素移动
- 支持时间切片（Concurrent Mode）

**Vue 虚拟 DOM：**
- 使用模板编译成渲染函数构建虚拟 DOM
- Diff 算法也是基于深度优先遍历，但有优化
- 基于响应式系统自动优化，精确追踪依赖
- 组件级别的精确更新，不需要额外标记
- 编译器可以进行更多静态分析优化
- 提供 v-once, v-memo 等指令进一步优化

**主要区别：**

**1. 更新触发方式**
- **React**：组件状态变化时，整个组件重新渲染，生成新的虚拟 DOM 树
- **Vue**：基于依赖追踪，只更新受影响的组件和节点

**2. 优化策略**
- **React**：开发者需要手动使用优化 API
- **Vue**：自动优化，编译器和运行时协同工作

**3. 静态分析**
- **React**：JSX 更灵活，但编译时优化较少
- **Vue**：模板语法允许编译器进行更多静态分析优化

**4. 渲染性能**
- 小型应用：两者性能差异不大
- 大型应用：Vue 的自动优化可能更容易获得良好性能
- React 的时间切片在处理复杂渲染时可能更有优势

### 15. 如何实现 Vue 和 React 的服务端渲染（SSR）？

**答案：**

**Vue SSR 实现：**

**1. 使用 Nuxt.js（推荐）**
- Nuxt.js 是 Vue 的服务端渲染框架，提供开箱即用的 SSR 功能

**安装：**
```bash
npx create-nuxt-app my-project
```

**页面组件：**
```vue
<!-- pages/index.vue -->
export default {
  asyncData({ $axios }) {
    // 服务端获取数据
    return $axios.$get('/api/posts').then(posts => ({
      posts
    }))
  },
  data() {
    return {
      // 客户端数据
    }
  }
}
```

**2. 手动实现 Vue SSR**
- 使用 `@vue/server-renderer` 和 Node.js 框架（如 Express）

**React SSR 实现：**

**1. 使用 Next.js（推荐）**
- Next.js 是 React 的服务端渲染框架

**安装：**
```bash
npx create-next-app@latest
```

**页面组件：**
```jsx
// pages/index.js

export async function getServerSideProps() {
  // 服务端获取数据
  const res = await fetch('https://api.example.com/data')
  const data = await res.json()
  
  return {
    props: { data }
  }
}

export default function Home({ data }) {
  return <div>{JSON.stringify(data)}</div>
}
```

**2. 手动实现 React SSR**
- 使用 `react-dom/server` 和 Node.js 框架

```javascript
// server.js
import React from 'react'
import { renderToString } from 'react-dom/server'
import express from 'express'
import App from './App'

const app = express()

app.get('*', (req, res) => {
  const html = renderToString(<App />)
  
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>React SSR</title>
      </head>
      <body>
        <div id="root">${html}</div>
        <script src="/client.js"></script>
      </body>
    </html>
  `)
})

app.listen(3000)
```

**SSR 的优势：**
- 更好的 SEO（搜索引擎优化）
- 更快的首次内容加载
- 更好的用户体验，尤其是在网络条件较差时
- 支持社交媒体预览

**SSR 的挑战：**
- 服务器资源消耗更大
- 需要处理服务端和客户端数据同步
- 某些浏览器 API 在服务端不可用
- 开发和调试更复杂
