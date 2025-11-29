# React 面试重点内容

## 目录

- [React 核心概念](#react-核心概念)
- [组件和 JSX](#组件和-jsx)
- [状态管理](#状态管理)
- [生命周期和 Hooks](#生命周期和-hooks)
- [React Router](#react-router)
- [性能优化](#性能优化)
- [Redux 状态管理](#redux-状态管理)
- [常见问题解答](#常见问题解答)

## React 核心概念

### 什么是 React？

React 是由 Facebook 开发的一个用于构建用户界面的 JavaScript 库。它采用组件化的开发模式，使得构建复杂的用户界面变得更加简单和可维护。

### React 的核心特性

1. **组件化** - 将 UI 拆分成独立可复用的组件
2. **虚拟 DOM** - 提高 DOM 操作性能
3. **单向数据流** - 数据从父组件流向子组件
4. **声明式编程** - 描述 UI 应该是什么样的，而不是如何实现
5. **JSX** - JavaScript 的语法扩展，用于描述 UI

### React 的优势

1. **高性能** - 虚拟 DOM 和高效的 diff 算法
2. **组件化** - 提高代码复用性和可维护性
3. **丰富的生态系统** - 大量的第三方库和工具
4. **活跃的社区** - 持续的更新和支持
5. **学习曲线平缓** - 相对容易上手

## 组件和 JSX

### 组件类型

#### 函数组件

```jsx
// React 16.8 之前的函数组件（无状态组件）
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>
}

// React 16.8 之后的函数组件（使用 Hooks）
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  )
}
```

#### 类组件

```jsx
import { Component } from 'react'

class Counter extends Component {
  constructor(props) {
    super(props)
    this.state = { count: 0 }
  }
  
  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    )
  }
}
```

### JSX 语法

#### 基本语法

```jsx
const element = <h1>Hello, world!</h1>

const name = 'Josh Perez'
const element = <h1>Hello, {name}</h1>

function formatName(user) {
  return user.firstName + ' ' + user.lastName
}

const user = {
  firstName: 'Harper',
  lastName: 'Perez'
}

const element = (
  <h1>
    Hello, {formatName(user)}!
  </h1>
)
```

#### 条件渲染

```jsx
// 使用 if 语句
function Greeting(props) {
  const isLoggedIn = props.isLoggedIn
  if (isLoggedIn) {
    return <UserGreeting />
  }
  return <GuestGreeting />
}

// 使用逻辑 && 操作符
function Mailbox(props) {
  const unreadMessages = props.unreadMessages
  return (
    <div>
      <h1>Hello!</h1>
      {unreadMessages.length > 0 &&
        <h2>
          You have {unreadMessages.length} unread messages.
        </h2>
      }
    </div>
  )
}

// 使用三元运算符
function LoginButton(props) {
  const isLoggedIn = props.isLoggedIn
  return (
    <div>
      {isLoggedIn ? (
        <button onClick={props.onLogout}>Logout</button>
      ) : (
        <button onClick={props.onLogin}>Login</button>
      )}
    </div>
  )
}
```

#### 列表渲染

```jsx
const numbers = [1, 2, 3, 4, 5]
const listItems = numbers.map((number) =>
  <li key={number.toString()}>
    {number}
  </li>
)

// 在组件中使用
function NumberList(props) {
  const numbers = props.numbers
  const listItems = numbers.map((number) =>
    <li key={number.toString()}>
      {number}
    </li>
  )
  return (
    <ul>{listItems}</ul>
  )
}
```

## 状态管理

### State 和 Props

#### State（状态）

State 是组件内部的数据，可以通过 setState 来更新：

```jsx
class Clock extends Component {
  constructor(props) {
    super(props)
    this.state = { date: new Date() }
  }
  
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    )
  }
  
  tick() {
    this.setState({
      date: new Date()
    })
  }
  
  render() {
    return (
      <div>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    )
  }
}
```

#### Props（属性）

Props 是从父组件传递给子组件的数据：

```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>
}

function App() {
  return (
    <div>
      <Welcome name="Sara" />
      <Welcome name="Cahal" />
      <Welcome name="Edite" />
    </div>
  )
}
```

### 状态提升

当多个组件需要共享相同的状态时，可以将状态提升到最近的共同父组件中：

```jsx
function TemperatureInput(props) {
  const handleChange = (e) => {
    props.onTemperatureChange(e.target.value)
  }
  
  return (
    <fieldset>
      <legend>Enter temperature in {props.scale}:</legend>
      <input value={props.temperature}
             onChange={handleChange} />
    </fieldset>
  )
}

class Calculator extends Component {
  constructor(props) {
    super(props)
    this.state = { temperature: '', scale: 'c' }
  }
  
  handleCelsiusChange = (temperature) => {
    this.setState({ scale: 'c', temperature })
  }
  
  handleFahrenheitChange = (temperature) => {
    this.setState({ scale: 'f', temperature })
  }
  
  render() {
    const scale = this.state.scale
    const temperature = this.state.temperature
    const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature
    const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature
    
    return (
      <div>
        <TemperatureInput
          scale="c"
          temperature={celsius}
          onTemperatureChange={this.handleCelsiusChange} />
        <TemperatureInput
          scale="f"
          temperature={fahrenheit}
          onTemperatureChange={this.handleFahrenheitChange} />
        <BoilingVerdict
          celsius={parseFloat(celsius)} />
      </div>
    )
  }
}
```

## 生命周期和 Hooks

### 类组件生命周期

#### 挂载阶段

```jsx
class MyComponent extends Component {
  constructor(props) {
    super(props)
    // 初始化 state
    this.state = { count: 0 }
    console.log('1. constructor')
  }
  
  static getDerivedStateFromProps(props, state) {
    console.log('2. getDerivedStateFromProps')
    return null
  }
  
  componentDidMount() {
    console.log('4. componentDidMount')
    // 发起网络请求、设置定时器等
  }
  
  render() {
    console.log('3. render')
    return <div>Count: {this.state.count}</div>
  }
}
```

#### 更新阶段

```jsx
class MyComponent extends Component {
  static getDerivedStateFromProps(props, state) {
    console.log('1. getDerivedStateFromProps')
    return null
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    console.log('2. shouldComponentUpdate')
    return true // 返回 true 允许更新
  }
  
  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log('4. getSnapshotBeforeUpdate')
    return null
  }
  
  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('5. componentDidUpdate')
  }
  
  render() {
    console.log('3. render')
    return <div>Count: {this.state.count}</div>
  }
}
```

#### 卸载阶段

```jsx
class MyComponent extends Component {
  componentWillUnmount() {
    console.log('componentWillUnmount')
    // 清理定时器、取消网络请求、清理订阅等
  }
  
  render() {
    return <div>My Component</div>
  }
}
```

### Hooks

#### useState

```jsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  )
}
```

#### useEffect

```jsx
import { useState, useEffect } from 'react'

function Example() {
  const [count, setCount] = useState(0)
  
  // 相当于 componentDidMount 和 componentDidUpdate
  useEffect(() => {
    document.title = `You clicked ${count} times`
  })
  
  // 相当于 componentDidMount（只执行一次）
  useEffect(() => {
    console.log('只执行一次')
  }, []) // 空依赖数组
  
  // 相当于 componentDidUpdate（依赖 count 变化）
  useEffect(() => {
    console.log('count 变化了')
  }, [count]) // 依赖数组
  
  // 相当于 componentWillUnmount
  useEffect(() => {
    return () => {
      console.log('清理函数')
    }
  })
  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  )
}
```

#### useContext

```jsx
import { createContext, useContext } from 'react'

const ThemeContext = createContext('light')

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  )
}

function Toolbar() {
  return (
    <div>
      <ThemedButton />
    </div>
  )
}

function ThemedButton() {
  const theme = useContext(ThemeContext)
  return <button className={theme}>Themed Button</button>
}
```

#### useReducer

```jsx
import { useReducer } from 'react'

const initialState = { count: 0 }

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 }
    case 'decrement':
      return { count: state.count - 1 }
    default:
      throw new Error()
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'increment' })}>
        +
      </button>
      <button onClick={() => dispatch({ type: 'decrement' })}>
        -
      </button>
    </>
  )
}
```

## React Router

### 基本路由

```jsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/users">Users</Link></li>
          </ul>
        </nav>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </div>
    </Router>
  )
}
```

### 动态路由

```jsx
import { useParams } from 'react-router-dom'

function User() {
  const { id } = useParams()
  return <h2>User ID: {id}</h2>
}

// 在路由配置中
<Route path="/user/:id" element={<User />} />
```

### 编程式导航

```jsx
import { useNavigate } from 'react-router-dom'

function MyComponent() {
  const navigate = useNavigate()
  
  const handleClick = () => {
    navigate('/home')
    // 或者
    navigate(-1) // 返回上一页
  }
  
  return <button onClick={handleClick}>Go Home</button>
}
```

### 嵌套路由

```jsx
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="dashboard" element={<Dashboard />}>
            <Route index element={<DashboardHome />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}

function Layout() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/dashboard">Dashboard</Link>
      </nav>
      
      <Outlet /> {/* 子路由渲染位置 */}
    </div>
  )
}
```

## 性能优化

### 1. React.memo

```jsx
import { memo } from 'react'

const MyComponent = memo(function MyComponent(props) {
  /* 使用 props 渲染 */
  return <div>{props.name}</div>
})

// 自定义比较函数
const MyComponent = memo(function MyComponent(props) {
  return <div>{props.name}</div>
}, (prevProps, nextProps) => {
  return prevProps.name === nextProps.name
})
```

### 2. useMemo

```jsx
import { useMemo } from 'react'

function MyComponent({ items, searchText }) {
  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.name.toLowerCase().includes(searchText.toLowerCase())
    )
  }, [items, searchText])
  
  return (
    <ul>
      {filteredItems.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  )
}
```

### 3. useCallback

```jsx
import { useCallback, useState } from 'react'

function Parent() {
  const [count, setCount] = useState(0)
  
  const handleClick = useCallback(() => {
    setCount(count + 1)
  }, [count])
  
  return (
    <div>
      <Child onClick={handleClick} />
      <p>Count: {count}</p>
    </div>
  )
}

const Child = memo(({ onClick }) => {
  console.log('Child rendered')
  return <button onClick={onClick}>Click me</button>
})
```

### 4. 懒加载组件

```jsx
import { lazy, Suspense } from 'react'

const OtherComponent = lazy(() => import('./OtherComponent'))

function MyComponent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OtherComponent />
    </Suspense>
  )
}
```

### 5. 虚拟滚动

```jsx
import { FixedSizeList as List } from 'react-window'

function VirtualizedList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {items[index]}
    </div>
  )
  
  return (
    <List
      height={600}
      itemCount={items.length}
      itemSize={35}
      width="100%"
    >
      {Row}
    </List>
  )
}
```

## Redux 状态管理

### Redux 基本概念

```jsx
// actions.js
export const INCREMENT = 'INCREMENT'
export const DECREMENT = 'DECREMENT'

export const increment = () => ({
  type: INCREMENT
})

export const decrement = () => ({
  type: DECREMENT
})

// reducer.js
import { INCREMENT, DECREMENT } from './actions'

const initialState = {
  count: 0
}

export const counterReducer = (state = initialState, action) => {
  switch (action.type) {
    case INCREMENT:
      return {
        ...state,
        count: state.count + 1
      }
    case DECREMENT:
      return {
        ...state,
        count: state.count - 1
      }
    default:
      return state
  }
}

// store.js
import { createStore } from 'redux'
import { counterReducer } from './reducer'

export const store = createStore(counterReducer)

// App.js
import { Provider } from 'react-redux'
import { store } from './store'

function App() {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  )
}

// Counter.js
import { useSelector, useDispatch } from 'react-redux'
import { increment, decrement } from './actions'

function Counter() {
  const count = useSelector(state => state.count)
  const dispatch = useDispatch()
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch(increment())}>
        Increment
      </button>
      <button onClick={() => dispatch(decrement())}>
        Decrement
      </button>
    </div>
  )
}
```

### Redux Toolkit

```jsx
import { createSlice, configureStore } from '@reduxjs/toolkit'

const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    count: 0
  },
  reducers: {
    increment: (state) => {
      state.count += 1
    },
    decrement: (state) => {
      state.count -= 1
    },
    incrementByAmount: (state, action) => {
      state.count += action.payload
    }
  }
})

export const { increment, decrement, incrementByAmount } = counterSlice.actions

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer
  }
})

// 在组件中使用
import { useSelector, useDispatch } from 'react-redux'
import { increment, decrement } from './counterSlice'

function Counter() {
  const count = useSelector(state => state.counter.count)
  const dispatch = useDispatch()
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch(increment())}>
        Increment
      </button>
      <button onClick={() => dispatch(decrement())}>
        Decrement
      </button>
    </div>
  )
}
```

## 常见问题解答

### Q: React 中的虚拟 DOM 是什么？

A: 虚拟 DOM 是 React 创建的一个轻量级的 JavaScript 对象，它是真实 DOM 的表示。当状态发生变化时，React 会创建一个新的虚拟 DOM 树，然后与旧的虚拟 DOM 树进行比较（diff 算法），找出最小的变更集合，最后批量更新真实 DOM，从而提高性能。

### Q: React 中的 key 属性有什么作用？

A: key 属性帮助 React 识别哪些元素发生了变化、被添加或被删除。它是 React Diff 算法的重要依据，正确的 key 可以提高渲染性能，避免不必要的 DOM 操作。

### Q: 类组件和函数组件的区别？

A: 主要区别包括：
1. **语法** - 类组件需要继承 React.Component，函数组件是普通函数
2. **状态管理** - 类组件使用 this.state，函数组件使用 useState Hook
3. **生命周期** - 类组件有完整的生命周期方法，函数组件使用 useEffect Hook
4. **性能** - 函数组件通常性能更好
5. **this 指向** - 类组件需要注意 this 指向问题，函数组件不需要

### Q: useEffect 和类组件生命周期的对应关系？

A: useEffect 可以模拟类组件的多个生命周期：
1. `useEffect(() => {}, [])` - 相当于 componentDidMount
2. `useEffect(() => {})` - 相当于 componentDidMount + componentDidUpdate
3. `useEffect(() => { return () => {} }, [])` - 相当于 componentWillUnmount
4. 通过依赖数组控制更新时机

### Q: React 中的 Context 是什么？什么时候使用？

A: Context 提供了一种在组件树中传递数据的方式，而不需要手动将 props 一层层传递下去。适用于：
1. 主题（如深色/浅色模式）
2. 用户信息
3. 语言设置
4. 全局状态

### Q: React 中的 refs 是什么？如何使用？

A: refs 提供了一种访问 DOM 节点或在 render 方法中创建的 React 元素的方式。使用方法：
```jsx
import { useRef } from 'react'

function MyComponent() {
  const inputRef = useRef(null)
  
  const focusInput = () => {
    inputRef.current.focus()
  }
  
  return (
    <div>
      <input ref={inputRef} />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  )
}
```

### Q: React 中的合成事件是什么？

A: React 的合成事件是对浏览器原生事件的跨浏览器封装。它具有以下特点：
1. **兼容性** - 抹平浏览器差异
2. **性能** - 事件委托机制，减少内存消耗
3. **API 一致性** - 提供统一的事件接口

### Q: React 18 的新特性有哪些？

A: React 18 的主要新特性包括：
1. **自动批处理** - 自动批处理多个状态更新
2. **并发渲染** - 改进的渲染机制
3. **Suspense 改进** - 更好的加载状态处理
4. **新的 Root API** - createRoot 替代 ReactDOM.render
5. **Hooks 改进** - useId, useSyncExternalStore 等新 Hooks

通过掌握这些面试重点内容，你将能够在面试中展现出对 React 的深入理解，并能够回答大部分相关技术问题。