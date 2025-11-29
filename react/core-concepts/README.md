# React 核心概念

## 组件基础

React 组件是构建用户界面的基本单元。在 React 中，我们可以使用函数组件或类组件来定义 UI。

### 函数组件

```jsx
// 基本函数组件
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// 使用箭头函数
const Welcome = (props) => {
  return <h1>Hello, {props.name}</h1>;
};

// 内联返回（无花括号和return关键字）
const Welcome = (props) => <h1>Hello, {props.name}</h1>;
```

### 类组件

```jsx
import React, { Component } from 'react';

class Welcome extends Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

### 使用组件

```jsx
function App() {
  return (
    <div>

## 虚拟DOM与Fiber架构实现原理

### 虚拟DOM基础概念

虚拟DOM是React的核心机制之一，它是对真实DOM的一种轻量级JavaScript对象表示。React通过维护虚拟DOM树，实现了高效的UI更新机制。

#### 虚拟DOM的本质

```javascript
// 虚拟DOM节点的简化结构
const vnode = {
  type: 'div', // 元素类型或组件
  props: {
    className: 'container',
    children: [
      { type: 'span', props: { children: 'Hello World' } }
    ]
  }
};
```

#### React中的虚拟DOM实现

在React中，虚拟DOM节点被称为`ReactElement`，其核心实现如下：

```javascript
function createElement(type, config, ...children) {
  // 创建props对象
  const props = {};
  
  // 处理config中的属性
  for (const key in config) {
    if (config.hasOwnProperty(key) && key !== 'key' && key !== 'ref') {
      props[key] = config[key];
    }
  }
  
  // 处理子元素
  props.children = children;
  
  // 返回虚拟DOM对象
  return {
    $$typeof: Symbol.for('react.element'),
    type,
    key: config && config.key,
    ref: config && config.ref,
    props
  };
}
```

### React的Diff算法

React的Diff算法是虚拟DOM高效更新的关键，它采用了三个核心策略来优化更新过程：

#### 1. 层级比较策略

React仅对同一层级的节点进行比较，这避免了递归遍历整棵树，将时间复杂度从O(n³)降至O(n)。

```javascript
function updateDOMTree(oldTree, newTree) {
  // 只在同一层级进行比较
  if (oldTree.type !== newTree.type) {
    // 替换整个子树
    replaceNode(oldTree, newTree);
  } else {
    // 更新当前节点的属性
    updateNodeAttributes(oldTree, newTree);
    // 递归更新子节点
    reconcileChildren(oldTree.props.children, newTree.props.children);
  }
}
```

#### 2. Key属性比较策略

Key属性是React识别节点身份的重要标识，通过合理设置key值，可以避免不必要的节点重排。

```javascript
function reconcileChildren(oldChildren, newChildren) {
  const oldChildMap = {};
  
  // 构建旧子节点的映射表
  oldChildren.forEach((child, index) => {
    if (child.key) {
      oldChildMap[child.key] = { child, index };
    }
  });
  
  // 遍历新子节点进行比较
  newChildren.forEach((newChild, newIndex) => {
    if (newChild.key && oldChildMap[newChild.key]) {
      // 找到可复用的节点
      const { child: oldChild, index: oldIndex } = oldChildMap[newChild.key];
      // 移动节点位置
      if (oldIndex !== newIndex) {
        moveNode(oldChild, newIndex);
      }
      // 更新节点属性
      updateNode(oldChild, newChild);
    } else {
      // 创建新节点
      createNewNode(newChild, newIndex);
    }
  });
  
  // 清理不再使用的节点
  // ...
}
```

#### 3. 类型比较策略

当节点类型发生变化时，React会认为这是一个全新的DOM结构，直接创建新的DOM树并替换旧的。

### Fiber架构实现原理

Fiber架构是React 16引入的重大架构改进，它的核心目标是实现增量渲染，使React应用能够更好地响应用户交互。

#### Fiber节点的数据结构

```javascript
function FiberNode(tag, pendingProps, key, mode) {
  // 静态数据
  this.tag = tag;           // 组件类型标记
  this.key = key;           // key属性
  this.elementType = null;  // 元素类型
  this.type = null;         // 实际组件类型
  this.stateNode = null;    // 对应的真实DOM节点或组件实例
  
  // Fiber树结构
  this.return = null;       // 父节点
  this.child = null;        // 第一个子节点
  this.sibling = null;      // 下一个兄弟节点
  this.index = 0;           // 在兄弟节点中的索引
  
  // 性能追踪
  this.ref = null;          // ref引用
  
  // 工作单元状态
  this.pendingProps = pendingProps;  // 待处理的属性
  this.memoizedProps = null;         // 上一次渲染的属性
  this.updateQueue = null;           // 状态更新队列
  this.memoizedState = null;         // 上一次渲染的状态
  this.dependencies = null;          // 依赖项
  
  // 副作用相关
  this.mode = mode;                  // 模式（严格模式等）
  this.flags = NoFlags;              // 副作用标记
  this.subtreeFlags = NoFlags;       // 子树副作用标记
  this.deletions = null;             // 待删除的节点列表
  
  // 优先级调度
  this.lanes = NoLanes;              // 优先级车道
  this.childLanes = NoLanes;         // 子节点优先级车道
  
  // 版本
  this.alternate = null;             // 备用节点（用于双缓冲）
}
```

#### Fiber树的构建与更新

Fiber架构通过两个阶段完成渲染过程：

1. **协调阶段（Reconciliation）**：
   - 构建WorkInProgress树
   - 标记需要更新的节点（flags）
   - 这个阶段是可中断的

2. **提交阶段（Commit）**：
   - 将WorkInProgress树标记的变更应用到真实DOM
   - 执行生命周期钩子
   - 这个阶段是不可中断的

```javascript
function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    // 执行单个Fiber节点的工作
    workInProgress = performUnitOfWork(workInProgress);
  }
}

function performUnitOfWork(unitOfWork) {
  // 1. 执行当前Fiber的工作
  const next = beginWork(unitOfWork);
  
  // 2. 如果没有子节点，进入完成阶段
  if (next === null) {
    completeUnitOfWork(unitOfWork);
  } else {
    // 3. 有子节点，继续处理子节点
    workInProgress = next;
  }
}
```

#### 优先级调度机制

Fiber架构通过优先级机制确保高优先级任务（如用户交互）能够优先执行：

```javascript
// 优先级定义（从高到低）
const lanes = {
  NoLanes: 0,
  SyncLane: /* 1 */ 0b00000000000000000000000000000001,
  SyncBatchedLane: /* 2 */ 0b00000000000000000000000000000010,
  InputContinuousLane1: /* 4 */ 0b00000000000000000000000000000100,
  // ... 更多优先级
};

// 分配任务优先级
function requestUpdateLane(fiber) {
  // 根据不同情况分配不同优先级
  if (isSync(fiber)) {
    return SyncLane;
  } else if (isInputPending()) {
    return InputContinuousLane1;
  } else {
    // 返回较低优先级
    return DefaultLane;
  }
}
```

#### Fiber架构的性能优化

1. **时间切片（Time Slicing）**：
   - 将渲染工作分成多个小片段
   - 每个片段执行完后检查是否有更高优先级任务
   - 使用`requestIdleCallback`或自定义调度器实现

2. **优先级调度（Priority Scheduling）**：
   - 为不同类型的更新分配不同优先级
   - 高优先级任务可以中断低优先级任务
   - 保证用户交互的流畅性

3. **Suspense支持**：
   - Fiber架构为Suspense提供了基础
   - 允许组件在数据加载期间显示fallback内容

### 实际应用与性能优化建议

#### 合理使用Key属性

```jsx
// 推荐：使用稳定的ID作为key
{items.map(item => (
  <Item key={item.id} data={item} />
))}

// 不推荐：使用索引作为key（当项目顺序变化时）
{items.map((item, index) => (
  <Item key={index} data={item} />
))}
```

#### 避免不必要的渲染

```jsx
// 使用React.memo避免不必要的渲染
const MemoizedComponent = React.memo(function MyComponent(props) {
  /* 只有当props发生变化时才会重新渲染 */
  return <div>{props.name}</div>;
});

// 自定义比较函数
const MemoizedComponent = React.memo(function MyComponent(props) {
  return <div>{props.name}</div>;
}, (prevProps, nextProps) => {
  // 返回true表示不需要重新渲染
  return prevProps.name === nextProps.name;
});
```

#### 使用useMemo和useCallback优化性能

```jsx
// 使用useMemo缓存计算结果
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]); // 依赖项数组

// 使用useCallback缓存函数引用
const handleClick = useCallback(() => {
  console.log('Clicked', id);
}, [id]); // 依赖项数组
```

#### 虚拟列表优化长列表渲染

对于大量数据的列表渲染，应该使用虚拟滚动技术：

```jsx
import { FixedSizeList } from 'react-window';

function VirtualList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {items[index].name}
    </div>
  );

  return (
    <FixedSizeList
      height={500}
      itemCount={items.length}
      itemSize={35}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
```

## 条件渲染      <Welcome name="Sara" />
      <Welcome name="Cahal" />
      <Welcome name="Edite" />
    </div>
  );
}
```

## JSX 语法

JSX 是一种 JavaScript 的语法扩展，看起来像模板语言，但它具有 JavaScript 的全部功能。

### 基本语法

```jsx
const element = <h1>Hello, world!</h1>;

// 嵌入表达式
const name = 'Josh Perez';
const element = <h1>Hello, {name}</h1>;

// 使用 JavaScript 表达式
const element = <h1>{formatName(user)}</h1>;

// JSX 也是一个表达式
function getGreeting(user) {
  if (user) {
    return <h1>Hello, {formatName(user)}!</h1>;
  }
  return <h1>Hello, Stranger.</h1>;
}
```

### JSX 属性

```jsx
// 使用引号指定字符串字面量作为属性
const element = <div tabIndex="0"></div>;

// 使用大括号嵌入 JavaScript 表达式作为属性
const element = <img src={user.avatarUrl}></img>;

// 注意：JSX 里的 class 变成了 className，for 变成了 htmlFor
const element = <div className="container"></div>;
const element = <label htmlFor="input">Name:</label>;
```

### JSX 嵌套

```jsx
// JSX 标签可以嵌套
const element = (
  <div>
    <h1>Hello!</h1>
    <h2>Good to see you here.</h2>
  </div>
);
```

## Props

Props 是 React 组件的输入，它们从父组件传递给子组件。在函数组件中，props 是作为参数接收的；在类组件中，props 可以通过 `this.props` 访问。

### 基本用法

```jsx
function Greeting(props) {
  return (
    <div>
      <h1>Hello, {props.name}</h1>
      <p>Age: {props.age}</p>
      <p>Address: {props.address.street}, {props.address.city}</p>
    </div>
  );
}

function App() {
  return (
    <div>
      <Greeting 
        name="Alice" 
        age={25} 
        address={{ street: '123 Main St', city: 'New York' }} 
      />
    </div>
  );
}
```

### Props 类型检查

使用 PropTypes 进行类型检查：

```jsx
import PropTypes from 'prop-types';

function Greeting(props) {
  return <h1>Hello, {props.name}</h1>;
}

Greeting.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number,
  address: PropTypes.shape({
    street: PropTypes.string,
    city: PropTypes.string
  }),
  callback: PropTypes.func,
  items: PropTypes.arrayOf(PropTypes.string)
};

// 默认 props
Greeting.defaultProps = {
  name: 'Guest',
  age: 0
};
```

## State

State 允许 React 组件在响应用户操作、网络响应或其他事件时动态更新输出。

### 函数组件中的 State (Hooks)

```jsx
import React, { useState } from 'react';

function Counter() {
  // 声明一个新的 state 变量，我们将其称为 "count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

### 类组件中的 State

```jsx
import React, { Component } from 'react';

class Counter extends Component {
  constructor(props) {
    super(props);
    // 初始化 state
    this.state = {
      count: 0
    };
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
```

### 状态更新

```jsx
// 函数式更新（当新 state 依赖于旧 state 时）
// 函数组件
setCount(prevCount => prevCount + 1);

// 类组件
this.setState(prevState => ({
  count: prevState.count + 1
}));

// 异步更新
// 函数组件中自然支持异步更新
useEffect(() => {
  // 组件挂载后更新状态
  setCount(1);
}, []);

// 类组件中使用 setState 的回调函数
this.setState({ count: 1 }, () => {
  // 状态更新后的操作
  console.log('New count:', this.state.count);
});
```

## 组件生命周期实现机制详解

组件生命周期是React应用中管理组件状态和行为的关键机制。本节将深入剖析React组件生命周期的内部实现原理，包括类组件和函数组件的生命周期对比。

### 生命周期的核心概念

生命周期代表组件从创建到销毁的完整过程，包括以下几个关键阶段：

1. **挂载（Mounting）**：组件被创建并插入到DOM中
2. **更新（Updating）**：组件因属性或状态变化而重新渲染
3. **卸载（Unmounting）**：组件从DOM中移除
4. **错误处理（Error Handling）**：组件渲染过程中发生错误时的处理机制

### 类组件生命周期的实现原理

#### 生命周期方法的注册机制

在React内部，类组件的生命周期方法是通过原型链继承和特定的调用时机来实现的：

```javascript
// React内部组件类的简化实现
function Component(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}

// 生命周期方法通过原型添加
Component.prototype.componentWillMount = function() {}
Component.prototype.componentDidMount = function() {}
Component.prototype.componentWillReceiveProps = function(nextProps, nextContext) {}
Component.prototype.shouldComponentUpdate = function(nextProps, nextState, nextContext) {
  return true;
}
Component.prototype.componentWillUpdate = function(nextProps, nextState, nextContext) {}
Component.prototype.componentDidUpdate = function(prevProps, prevState, snapshot) {}
Component.prototype.componentWillUnmount = function() {}
Component.prototype.getDerivedStateFromProps = function(props, state) {}
Component.prototype.getSnapshotBeforeUpdate = function(prevProps, prevState) {}
Component.prototype.componentDidCatch = function(error, errorInfo) {}
```

#### 生命周期方法的调用时机

React在组件的不同阶段会调用不同的生命周期方法。这些调用是在React的调和（Reconciliation）和提交（Commit）阶段完成的：

```javascript
// React内部调用生命周期方法的简化逻辑
function mountClassComponent(fiber) {
  // 1. 实例化组件
  const instance = new fiber.type(fiber.props, fiber.context);
  
  // 2. 初始化状态和上下文
  instance.props = fiber.props;
  instance.context = fiber.context;
  
  // 3. 调用constructor（如果有）
  // constructor已经在实例化时调用
  
  // 4. 调用getDerivedStateFromProps（如果有）
  if (fiber.type.getDerivedStateFromProps) {
    const nextState = fiber.type.getDerivedStateFromProps(fiber.props, instance.state);
    if (nextState !== null) {
      instance.state = nextState;
    }
  }
  
  // 5. 调用componentWillMount（React 17已废弃）
  if (typeof instance.componentWillMount === 'function') {
    instance.componentWillMount();
  }
  
  // 6. 保存实例到Fiber节点
  fiber.stateNode = instance;
  
  // 7. 渲染组件
  const nextChildren = instance.render();
  
  // 8. 标记需要执行componentDidMount
  if (typeof instance.componentDidMount === 'function') {
    fiber.flags |= PlacementAndUpdate;
    // 将componentDidMount添加到commit阶段的回调队列
    instance.__didMount = true;
  }
  
  return nextChildren;
}

function updateClassComponent(fiber, current, workInProgress, renderExpirationTime) {
  // 获取组件实例
  const instance = workInProgress.stateNode;
  
  // 检查是否需要更新
  if (shouldUpdateComponent(current, workInProgress)) {
    // 调用生命周期方法
    
    // 1. 调用getDerivedStateFromProps（如果有）
    if (typeof workInProgress.type.getDerivedStateFromProps === 'function') {
      const nextState = workInProgress.type.getDerivedStateFromProps(
        workInProgress.props,
        instance.state
      );
      if (nextState !== null) {
        instance.state = nextState;
      }
    }
    
    // 2. 调用componentWillReceiveProps（React 17已废弃）
    if (typeof instance.componentWillReceiveProps === 'function') {
      instance.componentWillReceiveProps(workInProgress.props, workInProgress.context);
    }
    
    // 3. 调用shouldComponentUpdate（如果有）
    let shouldUpdate = true;
    if (typeof instance.shouldComponentUpdate === 'function') {
      shouldUpdate = instance.shouldComponentUpdate(
        workInProgress.props,
        instance.state,
        workInProgress.context
      );
    }
    
    if (!shouldUpdate) {
      // 跳过更新
      return null;
    }
    
    // 4. 调用componentWillUpdate（React 17已废弃）
    if (typeof instance.componentWillUpdate === 'function') {
      instance.componentWillUpdate(workInProgress.props, instance.state, workInProgress.context);
    }
    
    // 5. 标记需要执行componentDidUpdate
    if (typeof instance.componentDidUpdate === 'function') {
      fiber.flags |= Update;
      // 保存旧的props和state用于componentDidUpdate
      instance.__prevProps = current.props;
      instance.__prevState = current.state;
    }
  }
  
  // 6. 渲染组件
  const nextChildren = instance.render();
  return nextChildren;
}

function unmountClassComponent(fiber) {
  const instance = fiber.stateNode;
  
  // 调用componentWillUnmount（如果有）
  if (typeof instance.componentWillUnmount === 'function') {
    instance.componentWillUnmount();
  }
}

// Commit阶段执行componentDidMount和componentDidUpdate
function commitLifeCycles(finishedRoot, current, finishedWork) {
  switch (finishedWork.tag) {
    case ClassComponent: {
      const instance = finishedWork.stateNode;
      
      // 判断是挂载还是更新
      if (finishedWork.flags & Placement) {
        // 执行componentDidMount
        if (instance.__didMount) {
          instance.componentDidMount();
          delete instance.__didMount;
        }
      } else if (finishedWork.flags & Update) {
        // 执行componentDidUpdate
        if (instance.__prevProps !== undefined && typeof instance.componentDidUpdate === 'function') {
          const prevProps = instance.__prevProps;
          const prevState = instance.__prevState;
          delete instance.__prevProps;
          delete instance.__prevState;
          instance.componentDidUpdate(prevProps, prevState, null);
        }
      }
      break;
    }
    // 其他组件类型...
  }
}
```

### 函数组件生命周期的实现原理（基于Hooks）

函数组件通过React Hooks实现生命周期功能，特别是`useEffect`、`useLayoutEffect`等Hook。

#### Hooks与生命周期的映射关系

```javascript
// 基于Hooks的生命周期模拟
function useComponentDidMount(callback) {
  // 空依赖数组确保只在挂载时执行一次
  useEffect(() => {
    callback();
  }, []);
}

function useComponentDidUpdate(callback, deps) {
  // 标记是否为首次渲染
  const isMounted = useRef(false);
  
  useEffect(() => {
    if (isMounted.current) {
      // 非首次渲染，调用callback
      callback();
    } else {
      // 首次渲染，标记为已挂载
      isMounted.current = true;
    }
  }, deps); // 依赖项变化时执行
}

function useComponentWillUnmount(callback) {
  // 返回清理函数，在组件卸载时执行
  useEffect(() => {
    return callback;
  }, []);
}

// 完整的生命周期Hook封装
function useLifecycle({ 
  onMount, 
  onUpdate, 
  onUnmount,
  onUpdateDeps = []
}) {
  // 挂载时执行
  useComponentDidMount(onMount);
  
  // 更新时执行
  useComponentDidUpdate(onUpdate, onUpdateDeps);
  
  // 卸载时执行
  useComponentWillUnmount(onUnmount);
}
```

#### useEffect的生命周期机制

`useEffect` Hook是函数组件生命周期的核心，它在内部使用Fiber架构的副作用系统来实现：

```javascript
// useEffect的内部工作机制（简化版）
function mountEffect(create, deps) {
  // 创建Hook节点
  const hook = mountWorkInProgressHook();
  
  // 记录依赖
  const nextDeps = deps === undefined ? null : deps;
  
  // 标记组件有副作用
  currentlyRenderingFiber.flags |= PassiveEffect;
  
  // 创建副作用对象
  hook.memoizedState = pushEffect(
    HookHasEffect | HookPassive,
    create,
    undefined, // 初始清理函数为undefined
    nextDeps
  );
}

function updateEffect(create, deps) {
  // 获取当前Hook
  const hook = updateWorkInProgressHook();
  
  // 获取新的依赖
  const nextDeps = deps === undefined ? null : deps;
  
  // 获取上一次的副作用
  let destroy = undefined;
  
  if (hook.memoizedState !== undefined) {
    // 存在上一次的副作用
    const prevEffect = hook.memoizedState;
    destroy = prevEffect.destroy;
    
    // 检查依赖是否变化
    if (nextDeps !== null) {
      const prevDeps = prevEffect.deps;
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        // 依赖未变化，复用之前的效果
        pushEffect(
          HookPassive,
          create,
          destroy,
          nextDeps
        );
        return;
      }
    }
  }
  
  // 依赖变化或首次渲染，标记需要执行新的效果
  currentlyRenderingFiber.flags |= PassiveEffect;
  
  // 更新副作用
  hook.memoizedState = pushEffect(
    HookHasEffect | HookPassive,
    create,
    destroy,
    nextDeps
  );
}
```

### 生命周期执行顺序详解

#### 类组件完整生命周期顺序

1. **挂载阶段**：
   - `constructor(props)`
   - `static getDerivedStateFromProps(props, state)`（React 16.3+）
   - `componentWillMount()`（已废弃）
   - `render()`
   - **DOM更新**
   - `componentDidMount()`

2. **更新阶段**（由props变化触发）：
   - `static getDerivedStateFromProps(props, state)`
   - `componentWillReceiveProps(nextProps)`（已废弃）
   - `shouldComponentUpdate(nextProps, nextState)`
   - `componentWillUpdate(nextProps, nextState)`（已废弃）
   - `render()`
   - `getSnapshotBeforeUpdate(prevProps, prevState)`（React 16.3+）
   - **DOM更新**
   - `componentDidUpdate(prevProps, prevState, snapshot)`

3. **更新阶段**（由state变化触发）：
   - `shouldComponentUpdate(nextProps, nextState)`
   - `componentWillUpdate(nextProps, nextState)`（已废弃）
   - `render()`
   - `getSnapshotBeforeUpdate(prevProps, prevState)`（React 16.3+）
   - **DOM更新**
   - `componentDidUpdate(prevProps, prevState, snapshot)`

4. **卸载阶段**：
   - `componentWillUnmount()`

5. **错误处理**（React 16+）：
   - `static getDerivedStateFromError(error)`
   - `componentDidCatch(error, errorInfo)`

#### 函数组件生命周期顺序（基于Hooks）

1. **挂载阶段**：
   - 执行组件函数（相当于render）
   - **DOM更新**
   - 异步执行`useEffect`的回调函数

2. **更新阶段**：
   - 执行组件函数（相当于render）
   - **DOM更新**
   - 同步执行`useLayoutEffect`的清理函数（如果依赖变化）
   - 同步执行`useLayoutEffect`的回调函数（如果依赖变化）
   - 异步执行`useEffect`的清理函数（如果依赖变化）
   - 异步执行`useEffect`的回调函数（如果依赖变化）

3. **卸载阶段**：
   - 同步执行所有`useEffect`和`useLayoutEffect`的清理函数

### 类组件与函数组件生命周期对比

| 生命周期阶段 | 类组件 | 函数组件（Hooks） |
|------------|-------|-----------------|
| 初始化 | constructor | useState的初始值/useRef初始化 |
| 挂载前 | getDerivedStateFromProps/componentWillMount | 组件函数体 |
| 挂载后 | componentDidMount | useEffect(..., []) |
| 更新前（props变化） | getDerivedStateFromProps/componentWillReceiveProps | 组件函数体 |
| 更新前（状态变化） | shouldComponentUpdate/componentWillUpdate | 组件函数体 |
| 更新后 | componentDidUpdate | useEffect(..., deps) |
| 卸载前 | componentWillUnmount | useEffect的返回函数 |
| 错误处理 | getDerivedStateFromError/componentDidCatch | Error Boundary组件（类组件） |

#### 执行顺序示例

```jsx
// 类组件生命周期示例
class LifecycleDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
    console.log('1. constructor');
  }
  
  static getDerivedStateFromProps(props, state) {
    console.log('2. getDerivedStateFromProps');
    return null;
  }
  
  componentDidMount() {
    console.log('4. componentDidMount');
    setTimeout(() => this.setState({ count: 1 }), 1000);
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    console.log('shouldComponentUpdate');
    return true;
  }
  
  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log('getSnapshotBeforeUpdate');
    return null;
  }
  
  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('componentDidUpdate');
  }
  
  componentWillUnmount() {
    console.log('componentWillUnmount');
  }
  
  render() {
    console.log('3. render');
    return <div>Count: {this.state.count}</div>;
  }
}

// 函数组件生命周期示例（使用Hooks）
function HooksLifecycleDemo() {
  const [count, setCount] = useState(() => {
    console.log('useState initializer');
    return 0;
  });
  
  console.log('Component function body (render)');
  
  useEffect(() => {
    console.log('useEffect (componentDidMount)');
    
    // 设置定时器模拟更新
    const timer = setTimeout(() => {
      setCount(1);
    }, 1000);
    
    // 清理函数（componentWillUnmount）
    return () => {
      console.log('useEffect cleanup (componentWillUnmount)');
      clearTimeout(timer);
    };
  }, []);
  
  useEffect(() => {
    console.log('useEffect with count dependency (componentDidUpdate)');
  }, [count]);
  
  return <div>Count: {count}</div>;
}
```

### 高级生命周期应用技巧

#### 1. 使用getDerivedStateFromProps进行props派生状态

```jsx
class UserProfile extends React.Component {
  state = {
    user: null,
    isLoading: true
  };
  
  static getDerivedStateFromProps(props, state) {
    // 当userId变化时，重置状态并开始加载
    if (props.userId !== state.lastUserId) {
      return {
        lastUserId: props.userId,
        isLoading: true,
        user: null
      };
    }
    return null; // 没有变化，不需要更新状态
  }
  
  componentDidUpdate(prevProps, prevState) {
    // 如果userId变化且处于加载状态，获取用户数据
    if (prevProps.userId !== this.props.userId && this.state.isLoading) {
      this.fetchUser(this.props.userId);
    }
  }
  
  componentDidMount() {
    this.fetchUser(this.props.userId);
  }
  
  fetchUser = async (userId) => {
    try {
      const user = await api.getUser(userId);
      this.setState({ user, isLoading: false });
    } catch (error) {
      this.setState({ isLoading: false });
    }
  };
  
  render() {
    const { user, isLoading } = this.state;
    if (isLoading) return <div>Loading...</div>;
    return <div>User: {user?.name}</div>;
  }
}
```

#### 2. 使用getSnapshotBeforeUpdate捕获DOM变化

```jsx
class ScrollingList extends React.Component {
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
  }
  
  getSnapshotBeforeUpdate(prevProps, prevState) {
    // 检查列表长度是否变化，可能导致滚动位置变化
    if (prevProps.messages.length < this.props.messages.length) {
      const list = this.listRef.current;
      // 返回列表底部相对于顶部的位置
      return list.scrollHeight - list.scrollTop;
    }
    return null;
  }
  
  componentDidUpdate(prevProps, prevState, snapshot) {
    // 如果有snapshot，说明列表增加了新项，需要调整滚动位置
    if (snapshot !== null) {
      const list = this.listRef.current;
      // 保持用户的滚动位置，使新消息出现在底部
      list.scrollTop = list.scrollHeight - snapshot;
    }
  }
  
  render() {
    return (
      <div ref={this.listRef} style={{ height: '200px', overflow: 'auto' }}>
        {this.props.messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
    );
  }
}
```

#### 3. 使用自定义Hook封装生命周期逻辑

```jsx
// 带防抖功能的数据获取Hook
function useDebouncedFetch(url, delay, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // 设置防抖定时器
    const timer = setTimeout(() => {
      let isMounted = true;
      
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await fetch(url);
          const json = await response.json();
          // 检查组件是否仍然挂载
          if (isMounted) {
            setData(json);
            setError(null);
          }
        } catch (err) {
          if (isMounted) {
            setError(err);
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };
      
      fetchData();
      
      // 清理函数，取消定时器并标记组件已卸载
      return () => {
        clearTimeout(timer);
        isMounted = false;
      };
    }, delay);
    
    return () => clearTimeout(timer);
  }, [url, delay, ...dependencies]);
  
  return { data, loading, error };
}

// 使用示例
function SearchResults({ query }) {
  const url = `https://api.example.com/search?q=${query}`;
  const { data, loading, error } = useDebouncedFetch(url, 500, [query]);
  
  if (loading) return <div>Searching...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <ul>
      {data?.results.map((result) => (
        <li key={result.id}>{result.title}</li>
      ))}
    </ul>
  );
}
```

### 生命周期性能优化策略

#### 类组件性能优化

1. **实现shouldComponentUpdate**

```jsx
shouldComponentUpdate(nextProps, nextState) {
  // 只有在必要时才重新渲染
  if (this.props.id !== nextProps.id) {
    return true;
  }
  if (this.state.isExpanded !== nextState.isExpanded) {
    return true;
  }
  return false;
}
```

2. **使用PureComponent**

```jsx
// PureComponent实现了浅比较的shouldComponentUpdate
class PureComponent extends React.PureComponent {
  render() {
    return <div>{this.props.value}</div>;
  }
}
```

#### 函数组件性能优化

1. **使用React.memo**

```jsx
const MemoizedComponent = React.memo(function MyComponent(props) {
  /* 只有当props发生变化时才会重新渲染 */
  return <div>{props.value}</div>;
});

// 自定义比较函数
const MemoizedComponent = React.memo(
  function MyComponent(props) {
    return <div>{props.value}</div>;
  },
  (prevProps, nextProps) => {
    // 返回true表示不需要重新渲染
    return prevProps.value === nextProps.value;
  }
);
```

2. **使用useMemo缓存计算结果**

```jsx
function ExpensiveComponent({ a, b }) {
  // 只有当a或b变化时才重新计算
  const result = useMemo(() => {
    console.log('Computing expensive result');
    // 模拟昂贵的计算
    return a + b;
  }, [a, b]);
  
  return <div>Result: {result}</div>;
}
```

3. **使用useCallback缓存事件处理函数**

```jsx
function ButtonList({ items, onItemClick }) {
  // 缓存事件处理函数，避免子组件不必要的重渲染
  const handleClick = useCallback((id) => {
    onItemClick(id);
  }, [onItemClick]);
  
  return (
    <ul>
      {items.map((item) => (
        <Button key={item.id} onClick={() => handleClick(item.id)} />
      ))}
    </ul>
  );
}
```

### 常见问题与解决方案

#### 1. 避免在componentDidUpdate中创建无限循环

```jsx
// 错误示例
componentDidUpdate() {
  // 无条件调用setState会导致无限循环
  this.setState({ counter: this.state.counter + 1 });
}

// 正确示例
componentDidUpdate(prevProps) {
  // 只在特定条件下更新状态
  if (prevProps.id !== this.props.id) {
    this.setState({ counter: 0 });
  }
}
```

#### 2. 避免在render中创建不稳定的函数引用

```jsx
// 错误示例：每次渲染都会创建新的handleClick函数
function MyComponent() {
  const handleClick = () => {
    console.log('Clicked');
  };
  
  // ComponentX每次都会重新渲染，因为props发生了变化
  return <ComponentX onClick={handleClick} />;
}

// 正确示例：使用useCallback缓存函数引用
function MyComponent() {
  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []); // 空依赖数组，函数引用保持稳定
  
  return <ComponentX onClick={handleClick} />;
}
```

#### 3. 避免在useEffect中遗漏依赖项

```jsx
// 错误示例：在useEffect中使用了count但没有添加到依赖数组
function Counter() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    // 使用了count但没有在依赖数组中声明
    setMessage(`Count is ${count}`);
  }, []); // 应该添加count到依赖数组
  
  return (
    <div>
      <p>{message}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

// 正确示例：包含所有使用的变量在依赖数组中
useEffect(() => {
  setMessage(`Count is ${count}`);
}, [count]);
```

### 总结

React组件生命周期是管理组件状态和行为的核心机制。通过深入理解其实现原理，我们可以更好地利用生命周期来构建高性能、可维护的React应用。

- **类组件**通过预定义的生命周期方法实现组件的各个阶段
- **函数组件**通过Hooks（特别是useEffect）实现类似的生命周期功能
- 合理使用生命周期方法可以优化应用性能，避免常见陷阱
- 不同React版本中生命周期方法有所变化，应注意使用最新的推荐方法

无论使用类组件还是函数组件，理解生命周期的工作原理都能帮助我们更好地掌握React的组件模型，编写出更高效、更可预测的应用。

### 函数组件 (Hooks)

```jsx
import React, { useState, useEffect } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);

  // 组件挂载和更新时执行
  useEffect(() => {
    console.log('Component mounted or updated');
    
    // 设置定时器
    const interval = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds + 1);
    }, 1000);
    
    // 清理函数（相当于 componentWillUnmount）
    return () => {
      console.log('Component will unmount');
      clearInterval(interval);
    };
  }, []); // 空依赖数组表示只在挂载和卸载时执行

  return (
    <div>
      Seconds: {seconds}
    </div>
  );
}

## React Hooks实现原理详解

### Hooks的内部工作机制

React Hooks是React 16.8引入的新特性，它允许你在不编写类组件的情况下使用状态和其他React特性。Hooks的实现基于几个核心概念：

1. **Hooks调用栈**：React通过一个链表来存储组件内的所有Hooks调用
2. **状态保存**：状态通过`Hook`对象保存在链表中
3. **依赖追踪**：副作用Hooks通过依赖数组来决定何时重新执行

#### Hooks的核心数据结构

```javascript
// Hook节点的简化结构
function Hook() {
  this.memoizedState = null; // 当前状态值
  this.baseState = null;     // 初始状态值
  this.baseQueue = null;     // 更新队列
  this.queue = null;         // 待处理更新队列
  this.next = null;          // 指向下一个Hook
}

// Hooks链表的全局引用
let currentlyRenderingFiber = null;
let workInProgressHook = null;
let firstWorkInProgressHook = null;
```

#### Hooks调用顺序的重要性

React依赖于Hooks的调用顺序来正确关联状态和更新。这就是为什么Hooks必须在组件的顶层调用，不能在条件、循环或嵌套函数中调用。

```javascript
// 正确的Hooks使用方式
function Counter() {
  // 顶层调用，每次渲染都以相同顺序执行
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  
  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);
  
  // ...
}

// 错误的Hooks使用方式
function Counter({ shouldShow }) {
  // 不要在条件语句中调用Hooks
  if (shouldShow) {
    const [count, setCount] = useState(0); // 可能导致状态错乱
  }
  
  // ...
}
```

### useState的实现原理

`useState`是最常用的Hook，它允许函数组件使用状态。让我们深入了解它的内部实现：

#### useState的核心实现

```javascript
function useState(initialState) {
  // 获取当前组件的Fiber和Hook链表
  const fiber = currentlyRenderingFiber;
  const hook = updateWorkInProgressHook();
  
  // 首次渲染时初始化状态
  if (hook.baseState === undefined) {
    hook.baseState = typeof initialState === 'function' 
      ? initialState() 
      : initialState;
    hook.memoizedState = hook.baseState;
    hook.queue = {
      pending: null,
      dispatch: null,
      lastRenderedReducer: basicStateReducer
    };
  }
  
  // 创建dispatch函数
  const queue = hook.queue;
  const dispatch = queue.dispatch || 
    (queue.dispatch = dispatchAction.bind(null, fiber, queue));
  
  // 处理状态更新队列
  if (hook.baseQueue !== null) {
    const first = hook.baseQueue.next;
    let newState = hook.baseState;
    
    // 遍历所有更新
    let update = first;
    do {
      const action = update.action;
      newState = basicStateReducer(newState, action);
      update = update.next;
    } while (update !== first);
    
    // 更新状态
    hook.memoizedState = newState;
    hook.baseState = newState;
    hook.baseQueue = null;
  }
  
  return [hook.memoizedState, dispatch];
}

// 基本状态更新函数
function basicStateReducer(state, action) {
  return typeof action === 'function' ? action(state) : action;
}

// 更新操作的分发函数
function dispatchAction(fiber, queue, action) {
  // 创建更新对象
  const update = {
    action,
    next: null
  };
  
  // 将更新添加到队列
  if (queue.pending === null) {
    // 第一个更新，形成一个环
    update.next = update;
  } else {
    update.next = queue.pending.next;
    queue.pending.next = update;
  }
  queue.pending = update;
  
  // 标记组件需要重新渲染
  scheduleWork(fiber, SyncLane);
}
```

#### useState的工作流程

1. **首次渲染**：
   - 创建新的Hook节点
   - 初始化状态值
   - 创建dispatch函数
   - 返回[state, dispatch]数组

2. **状态更新**：
   - 调用dispatch函数
   - 创建更新对象并添加到队列
   - 标记组件需要重新渲染
   - 重新渲染时，从更新队列中计算新状态

### useEffect的实现原理

`useEffect`允许你在函数组件中执行副作用操作。它的实现比useState更复杂，因为它需要追踪依赖并在合适的时机执行清理函数。

#### useEffect的核心实现

```javascript
function useEffect(create, deps) {
  // 获取当前Hook
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  
  let destroy = undefined;
  
  // 重新渲染时，如果依赖发生变化，执行之前的清理函数
  if (hook.memoizedState !== null) {
    const prevEffect = hook.memoizedState;
    destroy = prevEffect.destroy;
    
    if (nextDeps !== null) {
      const prevDeps = prevEffect.deps;
      // 检查依赖是否变化
      if (!areHookInputsEqual(nextDeps, prevDeps)) {
        // 依赖变化，标记需要重新执行副作用
        hook.memoizedState = {
          create,
          destroy,
          deps: nextDeps
        };
      } else {
        // 依赖未变化，复用之前的效果
        hook.memoizedState = prevEffect;
        return;
      }
    } else {
      // 无依赖数组，每次渲染都执行
      hook.memoizedState = {
        create,
        destroy,
        deps: null
      };
    }
  } else {
    // 首次渲染
    hook.memoizedState = {
      create,
      destroy,
      deps: nextDeps
    };
  }
  
  // 将副作用添加到组件的副作用队列
  currentlyRenderingFiber.effectTag |= UpdateEffect | PassiveEffect;
  
  // 将Effect对象添加到Fiber的副作用链表中
  schedulePassiveEffect(hook.memoizedState);
}

// 比较依赖数组是否相等
function areHookInputsEqual(nextDeps, prevDeps) {
  if (prevDeps === null) {
    return false;
  }
  
  // 浅比较每个依赖项
  for (let i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
    if (Object.is(nextDeps[i], prevDeps[i])) {
      continue;
    }
    return false;
  }
  
  return prevDeps.length === nextDeps.length;
}

// 执行副作用
function commitPassiveEffects(finishedWork) {
  // 获取副作用链表
  const pendingPassiveEffects = finishedWork.updateQueue?.pendingPassiveEffects;
  
  if (pendingPassiveEffects) {
    // 执行所有清理函数
    pendingPassiveEffects.unmount.forEach(effect => {
      const destroy = effect.destroy;
      if (destroy) {
        destroy();
      }
    });
    
    // 执行所有创建函数并保存清理函数
    pendingPassiveEffects.update.forEach(effect => {
      const create = effect.create;
      effect.destroy = create();
    });
    
    // 清空副作用队列
    finishedWork.updateQueue.pendingPassiveEffects = null;
  }
}
```

#### useEffect的执行时机

1. **组件挂载后**：在渲染完成并提交到DOM后，异步执行副作用
2. **组件更新后**：
   - 如果依赖发生变化，先执行上次的清理函数
   - 然后异步执行新的副作用
3. **组件卸载前**：同步执行清理函数

### useReducer的实现原理

`useReducer`是useState的替代方案，特别适合状态逻辑较复杂或需要多个子值的情况。

```javascript
function useReducer(reducer, initialArg, init) {
  // 获取当前Hook
  const hook = updateWorkInProgressHook();
  
  // 首次渲染时初始化状态
  if (hook.baseState === undefined) {
    const initialState = init !== undefined ? init(initialArg) : initialArg;
    hook.baseState = initialState;
    hook.memoizedState = initialState;
    hook.queue = {
      pending: null,
      dispatch: null,
      lastRenderedReducer: reducer
    };
  }
  
  // 创建dispatch函数
  const queue = hook.queue;
  const dispatch = queue.dispatch || 
    (queue.dispatch = dispatchReducerAction.bind(null, currentlyRenderingFiber, queue));
  
  // 处理状态更新队列
  if (hook.baseQueue !== null) {
    const first = hook.baseQueue.next;
    let newState = hook.baseState;
    
    // 遍历所有更新
    let update = first;
    do {
      const action = update.action;
      newState = reducer(newState, action);
      update = update.next;
    } while (update !== first);
    
    // 更新状态
    hook.memoizedState = newState;
    hook.baseState = newState;
    hook.baseQueue = null;
  }
  
  return [hook.memoizedState, dispatch];
}
```

### useContext的实现原理

`useContext`允许组件订阅React的Context而不必引入Provider组件。

```javascript
function useContext(Context, unmaskedValue) {
  // 获取当前Hook
  const hook = updateWorkInProgressHook();
  
  // 首次渲染时
  if (hook.memoizedState === undefined) {
    // 订阅Context
    hook.memoizedState = readContext(Context);
    
    // 在Fiber上标记Context依赖
    const contextItem = {
      context: Context,
      next: null
    };
    
    // 将Context依赖添加到Fiber的依赖链表中
    if (currentlyRenderingFiber.dependencies === null) {
      currentlyRenderingFiber.dependencies = {
        lanes: NoLanes,
        firstContext: contextItem
      };
    } else {
      contextItem.next = currentlyRenderingFiber.dependencies.firstContext;
      currentlyRenderingFiber.dependencies.firstContext = contextItem;
    }
  }
  
  return hook.memoizedState;
}

// 读取Context的值
function readContext(Context) {
  // 获取Context的当前值
  return Context._currentValue;
}
```

### useMemo和useCallback的实现原理

这两个Hook都是为了性能优化而设计的，它们可以缓存计算结果或函数引用。

#### useMemo的实现

```javascript
function useMemo(create, deps) {
  // 获取当前Hook
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  
  // 首次渲染或依赖变化时重新计算
  if (hook.memoizedState === undefined) {
    const nextValue = create();
    hook.memoizedState = [nextValue, nextDeps];
    return nextValue;
  }
  
  // 检查依赖是否变化
  const prevState = hook.memoizedState;
  const prevDeps = prevState[1];
  
  if (nextDeps === null || !areHookInputsEqual(nextDeps, prevDeps)) {
    const nextValue = create();
    hook.memoizedState = [nextValue, nextDeps];
    return nextValue;
  }
  
  // 依赖未变化，返回缓存的值
  return prevState[0];
}
```

#### useCallback的实现

```javascript
function useCallback(callback, deps) {
  // useCallback实际上是useMemo的特例
  return useMemo(() => callback, deps);
}
```

### Hooks的高级应用

#### 自定义Hooks

自定义Hooks让你能够复用状态逻辑，它们本质上是一个函数，内部可以调用其他Hooks。

```javascript
// 自定义Hook示例：useLocalStorage
function useLocalStorage(key, initialValue) {
  // 使用useState初始化状态
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // 从localStorage获取值
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });
  
  // 创建更新函数
  const setValue = value => {
    try {
      // 允许值为函数，与useState行为一致
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      // 保存状态
      setStoredValue(valueToStore);
      
      // 更新localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };
  
  return [storedValue, setValue];
}
```

#### 性能优化技巧

1. **合理使用依赖数组**：
   - 确保依赖数组包含所有在副作用中使用的变量
   - 对于复杂对象，可以使用useMemo缓存

2. **使用useCallback优化事件处理函数**：
   - 避免在每次渲染时创建新的函数引用
   - 减少子组件的不必要重新渲染

3. **使用useMemo优化计算密集型操作**：
   - 缓存昂贵计算的结果
   - 只在必要时重新计算

4. **使用React.memo包装组件**：
   - 避免相同props的不必要重新渲染
   - 与useCallback和useMemo配合使用效果更佳

### Hooks与类组件的对比

| 特性 | Hooks | 类组件 |
|------|-------|--------|
| 状态管理 | useState/useReducer | this.state/this.setState |
| 生命周期 | useEffect/useLayoutEffect | componentDidMount等生命周期方法 |
| 逻辑复用 | 自定义Hooks | 高阶组件/渲染属性 |
| 代码组织 | 按功能组织逻辑 | 按生命周期分组 |
| 类型推导 | 更容易进行TypeScript类型推导 | 需要额外的类型声明 |
| 状态隔离 | 天然隔离 | 依赖this上下文 |

### 常见问题与最佳实践

#### 1. 闭包陷阱

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  
  // 错误：定时器捕获了旧的count值
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log(count); // 总是显示0，不是当前的count值
    }, 1000);
    return () => clearTimeout(timer);
  }, []); // 空依赖数组导致闭包陷阱
  
  // 正确：将count添加到依赖数组
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log(count); // 正确显示当前的count值
    }, 1000);
    return () => clearTimeout(timer);
  }, [count]); // 添加count到依赖数组
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

#### 2. 使用函数式更新避免闭包问题

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      // 函数式更新，不依赖当前闭包中的count值
      setCount(prevCount => prevCount + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []); // 现在可以使用空依赖数组了
  
  return <div>Count: {count}</div>;
}
```

#### 3. 自定义Hook与性能优化

```jsx
// 优化后的自定义Hook
function useWindowSize() {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });
  
  // 使用useCallback缓存处理函数
  const handleResize = useCallback(() => {
    setSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, []);
  
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]); // 依赖稳定的函数引用
  
  return size;
}
```

### 总结

React Hooks通过巧妙的链表结构和调用顺序设计，为函数组件提供了强大的状态管理和副作用处理能力。了解Hooks的内部实现原理，有助于我们写出更高效、更可维护的React代码。

- **核心机制**：基于链表存储Hook状态，依赖调用顺序保持状态一致性
- **状态管理**：通过update队列实现高效的状态更新
- **副作用处理**：依赖追踪和异步执行机制
- **性能优化**：记忆化、依赖比较和按需渲染

掌握Hooks的实现原理，不仅能帮助我们避开常见陷阱，还能让我们更好地理解React的设计理念和工作方式。
```

### 类组件

```jsx
import React, { Component } from 'react';

class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seconds: 0
    };
  }

  // 组件挂载后执行
  componentDidMount() {
    console.log('Component mounted');
    this.interval = setInterval(() => {
      this.setState({ seconds: this.state.seconds + 1 });
    }, 1000);
  }

  // 组件更新后执行
  componentDidUpdate(prevProps, prevState) {
    // 注意：要避免在 componentDidUpdate 中无条件调用 setState
    if (prevState.seconds !== this.state.seconds && this.state.seconds % 10 === 0) {
      console.log(`Seconds reached ${this.state.seconds}`);
    }
  }

  // 组件卸载前执行
  componentWillUnmount() {
    console.log('Component will unmount');
    clearInterval(this.interval);
  }

  // 检查是否需要更新组件
  shouldComponentUpdate(nextProps, nextState) {
    // 可以在此处添加自定义逻辑来决定是否更新
    return true; // 默认返回 true，表示允许更新
  }

  render() {
    return (
      <div>
        Seconds: {this.state.seconds}
      </div>
    );
  }
}
```

## 事件处理

```jsx
// 基本事件处理
function ActionLink() {
  function handleClick(e) {
    e.preventDefault(); // 阻止默认行为
    console.log('The link was clicked.');
  }

  return (
    <a href="#" onClick={handleClick}>
      Click me
    </a>
  );
}

// 传递参数
function GreetingList({ names }) {
  const handleClick = (name) => {
    console.log(`Greeting clicked: ${name}`);
  };

  return (
    <ul>
      {names.map((name) => (
        <li key={name} onClick={() => handleClick(name)}>
          {name}
        </li>
      ))}
    </ul>
  );
}

// 类组件中的事件处理
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isToggleOn: true };

    // 方法绑定，确保在回调中使用 'this' 时指向组件实例
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState((state) => ({
      isToggleOn: !state.isToggleOn
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}
```

## 条件渲染

```jsx
// 元素变量
function Greeting({ isLoggedIn }) {
  let greeting;

  if (isLoggedIn) {
    greeting = <UserGreeting />;
  } else {
    greeting = <GuestGreeting />;
  }

  return <div>{greeting}</div>;
}

// 与运算符 &&
function Mailbox({ unreadMessages }) {
  return (
    <div>
      <h1>Hello!</h1>
      {unreadMessages.length > 0 && (
        <h2>You have {unreadMessages.length} unread messages.</h2>
      )}
    </div>
  );
}

// 三目运算符
function Greeting({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? <UserGreeting /> : <GuestGreeting />}
    </div>
  );
}
```

## 列表和键

```jsx
function NumberList({ numbers }) {
  return (
    <ul>
      {numbers.map((number) => (
        <li key={number.toString()}>
          {number}
        </li>
      ))}
    </ul>
  );
}

function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          {todo.text}
        </li>
      ))}
    </ul>
  );
}

// 提取列表项到单独的组件
function ListItem({ item }) {
  return <li>{item.text}</li>;
}

function NumberList({ numbers }) {
  return (
    <ul>
      {numbers.map((number, index) => (
        // 当没有稳定的 ID 时可以使用索引，但不推荐用于可能重新排序的列表
        <ListItem key={index} item={{ text: number }} />
      ))}
    </ul>
  );
}
```

## 表单处理

```jsx
// 受控组件
function NameForm() {
  const [value, setValue] = useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleSubmit = (event) => {
    alert('A name was submitted: ' + value);
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" value={value} onChange={handleChange} />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}

// 处理多个输入
function Reservation() {
  const [inputs, setInputs] = useState({
    username: '',
    email: '',
    age: ''
  });

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(prevInputs => ({
      ...prevInputs,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(inputs);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input 
          type="text" 
          name="username" 
          value={inputs.username} 
          onChange={handleChange} 
        />
      </label>
      <label>
        Email:
        <input 
          type="email" 
          name="email" 
          value={inputs.email} 
          onChange={handleChange} 
        />
      </label>
      <label>
        Age:
        <input 
          type="number" 
          name="age" 
          value={inputs.age} 
          onChange={handleChange} 
        />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}
```

## React状态管理原理详解

状态管理是React应用开发中的核心概念之一。React提供了多种状态管理方案，从组件内部状态到全局状态管理。本节将深入剖析React状态管理的实现原理，包括Context API和状态提升机制。

### 1. React状态管理的核心概念

#### 1.1 状态与数据流

在React中，状态管理遵循以下核心原则：

- **单向数据流**：数据从父组件流向子组件，通过props传递
- **组件封装**：每个组件管理自己的内部状态
- **可预测性**：状态更新会导致组件重新渲染

#### 1.2 状态管理的层次

React状态管理可以分为三个主要层次：

1. **组件内部状态**：使用useState或this.state管理
2. **组件树共享状态**：通过props传递或状态提升
3. **全局状态**：使用Context API或第三方库（如Redux、MobX）

### 2. 组件内部状态管理实现原理

#### 2.1 useState Hook的状态管理机制

`useState`是函数组件中最基本的状态管理Hook，它在内部使用Fiber架构和Hook链表来存储和更新状态。

```javascript
// useState的内部工作原理（简化版）
function useState(initialState) {
  // 获取当前Fiber节点和Hook
  const fiber = currentlyRenderingFiber;
  const hook = updateWorkInProgressHook();
  
  // 首次渲染时初始化状态
  if (hook.memoizedState === undefined) {
    hook.memoizedState = typeof initialState === 'function' 
      ? initialState() 
      : initialState;
    
    // 初始化更新队列
    hook.queue = {
      pending: null,
      dispatch: null,
      lastRenderedReducer: basicStateReducer,
      lastRenderedState: hook.memoizedState
    };
  }
  
  // 创建dispatch函数
  const queue = hook.queue;
  const dispatch = queue.dispatch || (queue.dispatch = dispatchAction.bind(null, fiber, queue));
  
  // 处理待处理的更新
  if (hook.queue.pending !== null) {
    const first = hook.queue.pending.next;
    let newState = hook.memoizedState;
    let update = first;
    
    // 处理队列中的所有更新
    do {
      const action = update.action;
      newState = basicStateReducer(newState, action);
      update = update.next;
    } while (update !== first);
    
    // 更新状态
    hook.memoizedState = newState;
    hook.queue.pending = null;
  }
  
  return [hook.memoizedState, dispatch];
}

// 基本状态更新函数
function basicStateReducer(state, action) {
  // 如果action是函数，调用它并传入当前状态
  return typeof action === 'function' ? action(state) : action;
}

// 状态更新分发函数
function dispatchAction(fiber, queue, action) {
  // 创建更新对象
  const update = {
    action,
    next: null
  };
  
  // 将更新添加到循环链表
  if (queue.pending === null) {
    // 首次更新，形成循环链表
    update.next = update;
  } else {
    update.next = queue.pending.next;
    queue.pending.next = update;
  }
  
  // 指向最后一个更新
  queue.pending = update;
  
  // 调度组件重新渲染
  scheduleWork(fiber, SyncLane);
}
```

#### 2.2 类组件状态管理机制

类组件通过`this.state`和`this.setState`来管理状态：

```javascript
// React类组件状态更新的简化实现
class Component {
  constructor(props, context, updater) {
    this.props = props;
    this.context = context;
    this.updater = updater || ReactNoopUpdateQueue;
    this.state = null;
  }
  
  setState(partialState, callback) {
    // 创建更新对象
    const update = {
      partialState,
      callback
    };
    
    // 使用updater进行状态更新
    this.updater.enqueueSetState(this, update);
  }
}

// updater的简化实现
const ReactNoopUpdateQueue = {
  enqueueSetState(inst, payload) {
    // 获取当前状态
    const currentState = inst.state || {};
    
    // 合并新状态
    const nextState = typeof payload === 'function'
      ? payload(currentState, inst.props)
      : payload;
    
    // 更新状态
    inst.state = { ...currentState, ...nextState };
    
    // 触发重新渲染
    scheduleWork(inst, SyncLane);
  }
};
```

### 3. Context API实现原理

Context API是React提供的跨组件层级共享状态的机制，避免了props drilling（属性钻取）问题。

#### 3.1 Context的创建与使用

```jsx
// Context的基本使用
const ThemeContext = React.createContext('light');

// Provider组件
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <ThemedButton />
    </ThemeContext.Provider>
  );
}

// 使用Context的组件
function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <button theme={theme}>I am styled by theme context!</button>;
}
```

#### 3.2 Context的内部实现

Context在React内部是通过Fiber树中的特殊标记和订阅机制实现的：

```javascript
// React.createContext的简化实现
function createContext(defaultValue, calculateChangedBits) {
  // 创建Context对象
  const context = {
    $$typeof: REACT_CONTEXT_TYPE,
    _calculateChangedBits: calculateChangedBits,
    _currentValue: defaultValue,
    _currentValue2: defaultValue,
    _threadCount: 0,
    Provider: null,
    Consumer: null
  };
  
  // 创建Provider组件
  context.Provider = {
    $$typeof: REACT_PROVIDER_TYPE,
    _context: context
  };
  
  // 创建Consumer组件
  context.Consumer = context;
  
  return context;
}

// Provider组件的实现原理
function mountProviderComponent(fiber) {
  // 获取Provider的props和context
  const providerType = fiber.type;
  const context = providerType._context;
  const newProps = fiber.memoizedProps;
  
  // 获取Provider的value
  const newValue = newProps.value;
  
  // 更新context的值
  context._currentValue = newValue;
  
  // 标记所有消费此context的组件需要重新渲染
  const subscribers = context._subscribers;
  if (subscribers !== null) {
    subscribers.forEach(subscriber => {
      // 标记需要重新渲染
      subscriber.flags |= Update;
      scheduleWork(subscriber, SyncLane);
    });
  }
  
  // 渲染子组件
  return newProps.children;
}

// useContext Hook的实现原理
function useContext(context) {
  // 获取当前Fiber
  const fiber = currentlyRenderingFiber;
  
  // 创建Hook
  const hook = updateWorkInProgressHook();
  
  // 订阅context变化
  subscribeToContext(fiber, context);
  
  // 返回context的当前值
  return context._currentValue;
}

// 订阅context变化
function subscribeToContext(fiber, context) {
  // 创建订阅
  const subscription = {
    fiber,
    next: null
  };
  
  // 将订阅添加到context的订阅列表
  if (!context._subscribers) {
    context._subscribers = new Set();
  }
  context._subscribers.add(subscription);
  
  // 在组件卸载时清理订阅
  fiber.dependencies = fiber.dependencies || { firstContext: null };
  fiber.dependencies.firstContext = subscription;
}
```

#### 3.3 Context的优化机制

Context API通过以下机制实现高效的状态管理：

1. **选择性更新**：只有订阅了Context的组件才会在Context值变化时重新渲染
2. **引用相等性比较**：默认情况下，Context通过引用相等性比较决定是否更新
3. **calculateChangedBits优化**：可以自定义比较函数，更精细地控制更新

```javascript
// 使用calculateChangedBits优化Context更新
const ThemeContext = React.createContext(
  { color: 'blue', background: 'white' },
  (prevValue, nextValue) => {
    // 仅当颜色变化时返回非零值，表示需要更新
    return prevValue.color !== nextValue.color ? 1 : 0;
  }
);

// 在组件中使用useContextSelector（React 18+支持）
function useContextSelector(context, selector) {
  const value = useContext(context);
  const [selectedValue, setSelectedValue] = useState(() => selector(value));
  
  useEffect(() => {
    const newValue = selector(value);
    if (!Object.is(newValue, selectedValue)) {
      setSelectedValue(newValue);
    }
  }, [selector, value, selectedValue]);
  
  return selectedValue;
}
```

### 4. 状态提升机制

状态提升是React中一种重要的状态管理模式，它将共享状态移至最近的公共祖先组件中。

#### 4.1 状态提升的实现原理

状态提升的核心思想是通过props传递状态和状态更新函数：

```jsx
// 状态提升示例
function Calculator() {
  // 提升的状态
  const [temperature, setTemperature] = useState('');
  const [temperatureType, setTemperatureType] = useState('celsius');
  
  // 状态转换函数
  const handleCelsiusChange = (value) => {
    setTemperature(value);
    setTemperatureType('celsius');
  };
  
  const handleFahrenheitChange = (value) => {
    setTemperature(value);
    setTemperatureType('fahrenheit');
  };
  
  // 温度转换逻辑
  const toCelsius = (fahrenheit) => {
    return ((fahrenheit - 32) * 5) / 9;
  };
  
  const toFahrenheit = (celsius) => {
    return (celsius * 9) / 5 + 32;
  };
  
  // 计算结果
  const tryConvert = (temperature, convert) => {
    const input = parseFloat(temperature);
    if (Number.isNaN(input)) {
      return '';
    }
    const output = convert(input);
    const rounded = Math.round(output * 1000) / 1000;
    return rounded.toString();
  };
  
  const celsius = temperatureType === 'fahrenheit' 
    ? tryConvert(temperature, toCelsius) 
    : temperature;
  
  const fahrenheit = temperatureType === 'celsius' 
    ? tryConvert(temperature, toFahrenheit) 
    : temperature;
  
  return (
    <div>
      <TemperatureInput
        scale="celsius"
        value={celsius}
        onChange={handleCelsiusChange}
      />
      <TemperatureInput
        scale="fahrenheit"
        value={fahrenheit}
        onChange={handleFahrenheitChange}
      />
    </div>
  );
}

// 子组件
function TemperatureInput({ scale, value, onChange }) {
  const handleChange = (e) => {
    onChange(e.target.value);
  };
  
  return (
    <div>
      <input
        type="number"
        value={value}
        onChange={handleChange}
      />
      {scale === 'celsius' ? '°C' : '°F'}
    </div>
  );
}
```

#### 4.2 状态提升的数据流分析

状态提升形成了清晰的单向数据流：

1. 状态存储在祖先组件中
2. 状态和更新函数通过props传递给子组件
3. 子组件调用更新函数触发状态更新
4. 状态更新导致祖先组件重新渲染
5. 新的状态通过props传递给所有子组件

### 5. 状态管理最佳实践

#### 5.1 状态设计原则

1. **最小化状态**：只存储UI渲染所需的最小状态集
2. **避免冗余状态**：可以从其他状态派生的数据不应单独存储
3. **状态位置**：将状态放在需要使用它的所有组件的最近公共祖先中
4. **状态隔离**：相关的状态应放在一起，不相关的状态应分开

```jsx
// 良好的状态设计
function TodoList() {
  // 最小化状态：只存储原始待办事项列表
  const [todos, setTodos] = useState([]);
  
  // 派生数据：从原始状态计算，不单独存储
  const completedCount = todos.filter(todo => todo.completed).length;
  const remainingCount = todos.length - completedCount;
  
  return (
    <div>
      <TodoForm onAddTodo={addTodo} />
      <TodoListHeader 
        completedCount={completedCount}
        remainingCount={remainingCount}
      />
      <TodoItems todos={todos} onToggleTodo={toggleTodo} />
    </div>
  );
}
```

#### 5.2 Context API使用优化

1. **拆分Context**：将不常变化的值和频繁变化的值放在不同的Context中
2. **使用useMemo优化Provider的值**：避免不必要的子组件重新渲染
3. **使用ContextSelector**：只订阅Context中需要的部分

```jsx
// Context使用优化
function ThemeProvider({ children }) {
  // 拆分不常变化的主题配置
  const themeConfig = useMemo(() => ({
    colors: {
      primary: '#2196F3',
      secondary: '#FFC107',
      background: '#FFFFFF',
      text: '#333333'
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32
    }
  }), []);
  
  // 频繁变化的主题模式
  const [themeMode, setThemeMode] = useState('light');
  
  // 合并主题配置
  const theme = useMemo(() => ({
    ...themeConfig,
    mode: themeMode,
    // 基于模式的动态样式
    isDark: themeMode === 'dark',
    toggleMode: () => setThemeMode(prev => prev === 'light' ? 'dark' : 'light')
  }), [themeConfig, themeMode]);
  
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

// 使用ContextSelector优化消费组件
function ThemedButton() {
  // 只订阅需要的部分
  const buttonStyle = useContextSelector(ThemeContext, theme => ({
    backgroundColor: theme.colors.primary,
    color: theme.colors.text,
    padding: `${theme.spacing.sm}px ${theme.spacing.md}px`
  }));
  
  const toggleMode = useContextSelector(ThemeContext, theme => theme.toggleMode);
  
  return <button style={buttonStyle} onClick={toggleMode}>Toggle Theme</button>;
}
```

#### 5.3 避免常见的状态管理陷阱

1. **避免在render中创建新对象**：这会导致不必要的子组件重新渲染
2. **避免过度使用Context**：小型应用可以使用状态提升，不需要全局Context
3. **避免Context层级过深**：多个Context嵌套会增加复杂度
4. **避免同步副作用**：状态更新不应直接产生副作用，应使用useEffect

```jsx
// 避免常见陷阱
function UserProfile() {
  const [user, setUser] = useState(null);
  
  // 正确：在useEffect中加载数据
  useEffect(() => {
    fetchUserData().then(data => setUser(data));
  }, []);
  
  // 正确：使用useMemo缓存对象
  const userInfo = useMemo(() => ({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'guest'
  }), [user]);
  
  // 避免：在render中直接创建函数
  // const handleClick = () => { /* ... */ };
  
  // 正确：使用useCallback缓存函数
  const handleClick = useCallback(() => {
    // 处理点击事件
  }, []);
  
  return <ProfileCard userInfo={userInfo} onClick={handleClick} />;
}
```

### 6. 高级状态管理模式

#### 6.1 自定义Hook实现状态逻辑复用

自定义Hook是React中复用状态逻辑的强大机制：

```jsx
// 自定义Hook实现表单状态管理
function useForm(initialValues = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 处理输入变化
  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
    // 标记字段为已触摸
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  }, []);
  
  // 处理表单提交
  const handleSubmit = useCallback(async (onSubmit) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values]);
  
  // 验证函数
  const validate = useCallback((validationSchema) => {
    const newErrors = {};
    
    Object.keys(validationSchema).forEach(field => {
      const value = values[field];
      const rules = validationSchema[field];
      
      if (rules.required && !value) {
        newErrors[field] = rules.message || 'This field is required';
      }
      
      if (rules.pattern && value && !rules.pattern.test(value)) {
        newErrors[field] = rules.message || 'Invalid format';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values]);
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleSubmit,
    validate,
    setFieldValue: (name, value) => setValues(prev => ({ ...prev, [name]: value }))
  };
}

// 使用自定义Hook
function LoginForm() {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    validate
  } = useForm({
    email: '',
    password: ''
  });
  
  const validationSchema = {
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Invalid email format'
    },
    password: {
      required: true,
      message: 'Password is required'
    }
  };
  
  const onSubmit = async () => {
    if (validate(validationSchema)) {
      // 处理登录逻辑
      console.log('Login with:', values);
    }
  };
  
  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(onSubmit); }}>
      <div>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
        />
        {touched.email && errors.email && <span>{errors.email}</span>}
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
        />
        {touched.password && errors.password && <span>{errors.password}</span>}
      </div>
      <button type="submit">Login</button>
    </form>
  );
}
```

#### 6.2 Context与useReducer结合实现状态管理

将Context API与useReducer结合可以创建强大的状态管理解决方案：

```jsx
// 创建Context和Reducer
const initialState = {
  todos: [],
  loading: false,
  error: null
};

function todoReducer(state, action) {
  switch (action.type) {
    case 'FETCH_TODOS_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_TODOS_SUCCESS':
      return { ...state, loading: false, todos: action.payload };
    case 'FETCH_TODOS_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_TODO':
      return { ...state, todos: [...state.todos, action.payload] };
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      };
    default:
      return state;
  }
}

// 创建Context
const TodoContext = React.createContext();

// 创建Provider组件
function TodoProvider({ children }) {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  
  // 异步操作
  const fetchTodos = useCallback(async () => {
    dispatch({ type: 'FETCH_TODOS_START' });
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos');
      const data = await response.json();
      dispatch({ type: 'FETCH_TODOS_SUCCESS', payload: data.slice(0, 10) });
    } catch (error) {
      dispatch({ type: 'FETCH_TODOS_ERROR', payload: error.message });
    }
  }, []);
  
  // 添加待办事项
  const addTodo = useCallback((todo) => {
    dispatch({ 
      type: 'ADD_TODO', 
      payload: { ...todo, id: Date.now(), completed: false } 
    });
  }, []);
  
  // 切换待办事项状态
  const toggleTodo = useCallback((id) => {
    dispatch({ type: 'TOGGLE_TODO', payload: id });
  }, []);
  
  // 删除待办事项
  const deleteTodo = useCallback((id) => {
    dispatch({ type: 'DELETE_TODO', payload: id });
  }, []);
  
  // 合并状态和操作函数
  const value = useMemo(() => ({
    ...state,
    fetchTodos,
    addTodo,
    toggleTodo,
    deleteTodo
  }), [state, fetchTodos, addTodo, toggleTodo, deleteTodo]);
  
  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
}

// 自定义Hook方便使用Context
function useTodos() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
}

// 使用示例
function TodoList() {
  const { todos, loading, error, fetchTodos } = useTodos();
  
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <TodoItem todo={todo} />
        </li>
      ))}
    </ul>
  );
}

function TodoItem({ todo }) {
  const { toggleTodo, deleteTodo } = useTodos();
  
  return (
    <div>
      <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
        {todo.title}
      </span>
      <button onClick={() => toggleTodo(todo.id)}>Toggle</button>
      <button onClick={() => deleteTodo(todo.id)}>Delete</button>
    </div>
  );
}
```

### 7. 总结

React状态管理是构建可维护应用的关键。通过深入理解React内置的状态管理机制，我们可以更好地设计和实现应用状态：

- **组件内部状态**：使用useState或this.state管理组件特定的状态
- **状态提升**：将共享状态移至公共祖先组件，通过props传递
- **Context API**：提供跨组件层级的状态共享机制，避免props drilling
- **自定义Hook**：实现状态逻辑的复用，提高代码的可维护性
- **Context + useReducer**：创建强大的本地状态管理解决方案

选择合适的状态管理方案取决于应用的复杂度和团队的偏好。无论采用哪种方案，都应该遵循React的单向数据流原则，保持状态的可预测性和可追溯性。

## React 16/17/18版本核心功能实现的区别和优化对比

React作为前端生态中最流行的UI库之一，经历了多个重要版本的迭代。从React 16到React 18，核心架构和实现原理发生了显著变化，带来了性能优化和新特性。本节将深入对比各版本的核心功能实现差异。

### 1. React 16：Fiber架构与错误边界

React 16于2017年9月发布，引入了全新的Fiber架构，这是React历史上最重要的架构变更之一。

#### 1.1 Fiber架构的核心实现

```javascript
// Fiber节点的核心数据结构
function FiberNode(tag, pendingProps, key, mode) {
  // 实例数据
  this.tag = tag;                 // Fiber类型（函数组件、类组件、原生组件等）
  this.key = key;                 // React元素的key属性
  this.elementType = null;        // 元素类型
  this.type = null;               // 组件类型或HTML标签名
  this.stateNode = null;          // 对应的真实DOM节点或组件实例
  
  // Fiber树结构
  this.return = null;             // 父Fiber节点
  this.child = null;              // 第一个子Fiber节点
  this.sibling = null;            // 下一个兄弟Fiber节点
  this.index = 0;                 // 在父节点children数组中的索引
  
  // 协调相关
  this.pendingProps = pendingProps; // 待处理的props
  this.memoizedProps = null;       // 上一次渲染的props
  this.updateQueue = null;         // 更新队列
  this.memoizedState = null;       // 上一次渲染的状态
  this.dependencies = null;        // 依赖项
  
  // 调度优先级
  this.mode = mode;                // Fiber模式
  this.effectTag = NoEffect;       // 副作用标记
  this.nextEffect = null;          // 下一个有副作用的Fiber
  this.firstEffect = null;         // 第一个有副作用的Fiber
  this.lastEffect = null;          // 最后一个有副作用的Fiber
  
  // 优先级调度
  this.lanes = NoLanes;            // 更新的优先级
  this.childLanes = NoLanes;       // 子节点的优先级
  
  // 工作循环相关
  this.alternate = null;           // 双缓冲Fiber树
  
  // 位置信息（用于调试）
  this.pendingWorkPriority = NoPriority;
}
```

#### 1.2 主要特性和实现原理

1. **Fiber树结构**：采用链表树结构，支持工作拆分和暂停
2. **协调算法重写**：基于Fiber的Diff算法，支持增量更新
3. **错误边界**：通过`componentDidCatch`和静态`getDerivedStateFromError`方法捕获子组件树中的JavaScript错误
4. **Portals**：允许将子节点渲染到存在于父组件DOM层次结构之外的DOM节点中

```jsx
// 错误边界组件实现
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 更新state使下一次渲染显示降级UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 记录错误信息
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Portals实现原理
function createPortal(children, containerInfo) {
  const key = typeof children === 'string' || typeof children === 'number' 
    ? children 
    : children.key;
  
  return {
    $$typeof: REACT_PORTAL_TYPE,
    key: key == null ? null : '' + key,
    containerInfo: containerInfo,
    children: children,
  };
}
```

### 2. React 17：新的JSX转换与事件委托重构

React 17于2020年10月发布，虽然没有引入重大的新功能，但进行了关键的基础设施改进，为React 18的功能奠定了基础。

#### 2.1 新的JSX转换实现

React 17引入了新的JSX转换，不再需要在每个使用JSX的文件中导入React：

```javascript
// React 17之前的JSX转换
function App() {
  return React.createElement('div', null, 'Hello World');
}

// React 17的JSX转换（无需导入React）
import { jsx as _jsx } from 'react/jsx-runtime';

function App() {
  return _jsx('div', { children: 'Hello World' });
}
```

新的JSX转换使用`react/jsx-runtime`和`react/jsx-dev-runtime`包，这些包导出了处理JSX转换的函数：

```javascript
// react/jsx-runtime的简化实现
function jsx(type, props, key) {
  return {
    $$typeof: REACT_ELEMENT_TYPE,
    type: type,
    key: key,
    ref: null,
    props: props,
    _owner: null,
  };
}

export { jsx };
```

#### 2.2 事件委托系统重构

React 17对事件委托系统进行了重构，将事件处理从`document`移动到渲染根节点，使得多个React版本可以共存：

```javascript
// React 17之前的事件委托（挂载到document）
if (typeof document !== 'undefined') {
  document.addEventListener('click', handleClick, false);
}

// React 17的事件委托（挂载到渲染根节点）
function listenToNativeEvent(rootContainerElement) {
  rootContainerElement.addEventListener('click', handleClick, false);
}
```

#### 2.3 其他重要变更

1. **合成事件池移除**：不再重用事件对象，简化了事件系统
2. **生命周期警告更新**：对不安全的生命周期方法提供更明确的警告
3. **渐进式迁移支持**：允许应用逐步升级React版本

### 3. React 18：并发渲染与自动批处理

React 18于2022年3月发布，引入了并发渲染机制，这是自Fiber架构以来最重要的架构更新。

#### 3.1 并发渲染的实现原理

React 18的并发渲染建立在Fiber架构之上，但增加了新的调度机制和优先级模型：

```javascript
// React 18的优先级模型（基于Lane模型）
const NoLanes = 0;
const NoLane = 0;
const SyncLane = 1;
const SyncBatchedLane = 2;
const InputContinuousHydrationLane = 4;
const InputContinuousLane = 8;
const DefaultHydrationLane = 16;
const DefaultLane = 32;
const TransitionHydrationLane = 64;
const TransitionLane1 = 128;
const TransitionLane2 = 256;
const TransitionLane3 = 512;
const TransitionLane4 = 1024;
const TransitionLane5 = 2048;
const TransitionLane6 = 4096;
const TransitionLane7 = 8192;
const TransitionLane8 = 16384;
const TransitionLane9 = 32768;
const TransitionLane10 = 65536;
const TransitionLane11 = 131072;
const TransitionLane12 = 262144;
const RetryLane1 = 524288;
const RetryLane2 = 1048576;
const RetryLane3 = 2097152;
const RetryLane4 = 4194304;
const RetryLane5 = 8388608;
const OffscreenLane = 16777216;
const IdleHydrationLane = 33554432;
const IdleLane = 67108864;
const NonIdleLanes = SyncLane | SyncBatchedLane | InputContinuousLane | \
  DefaultLane | TransitionLane1 | TransitionLane2 | TransitionLane3 | \
  TransitionLane4 | TransitionLane5 | TransitionLane6 | TransitionLane7 | \
  TransitionLane8 | TransitionLane9 | TransitionLane10 | TransitionLane11 | \
  TransitionLane12 | RetryLane1 | RetryLane2 | RetryLane3 | RetryLane4 | \
  RetryLane5 | OffscreenLane;
```

#### 3.2 并发特性的核心API

React 18引入了新的API来支持并发特性：

```javascript
// createRoot API
function createRoot(container, options) {
  const root = createContainer(container, ConcurrentRoot, null, options);
  return {
    render(children) {
      const rootContainerElement = container;
      unbatchedUpdates(() => {
        updateContainer(children, root, null, null);
      });
    },
    unmount() {
      unmountContainerAtNode(container);
    },
  };
}

// 自动批处理实现
function batchedUpdates(fn, a) {
  const prevExecutionContext = executionContext;
  executionContext |= BatchedContext;
  try {
    return fn(a);
  } finally {
    executionContext = prevExecutionContext;
    if (executionContext === NoContext) {
      // 只有当所有批处理上下文都退出时才执行更新
      flushSyncCallbackQueue();
    }
  }
}

// startTransition API
function startTransition(scope) {
  const prevTransition = ReactCurrentBatchConfig.transition;
  ReactCurrentBatchConfig.transition = 1;
  try {
    scope();
  } finally {
    ReactCurrentBatchConfig.transition = prevTransition;
  }
}

function useTransition() {
  const [isPending, setPending] = useState(false);
  
  const start = useCallback((scope) => {
    setPending(true);
    startTransition(() => {
      try {
        scope();
      } finally {
        setPending(false);
      }
    });
  }, []);
  
  return [isPending, start];
}
```

#### 3.3 自动批处理的实现原理

React 18的自动批处理在更多场景下批处理状态更新，减少渲染次数：

```javascript
// React 17批处理（只在React事件处理器中批处理）
function handleClick() {
  // 这两个更新会被批处理
  setCount(c => c + 1);
  setFlag(f => !f);
}

// React 17在Promise回调中不会批处理
fetchData().then(() => {
  // 这两个更新不会被批处理，会导致两次渲染
  setCount(c => c + 1);
  setFlag(f => !f);
});

// React 18的自动批处理（在任何地方都批处理）
fetchData().then(() => {
  // 在React 18中，这两个更新会被自动批处理，只导致一次渲染
  setCount(c => c + 1);
  setFlag(f => !f);
});
```

### 4. 版本间核心架构对比

#### 4.1 渲染架构演进

| 特性 | React 16 | React 17 | React 18 |
|------|---------|---------|----------|
| **架构基础** | Fiber架构 | 增强的Fiber架构 | 并发Fiber架构 |
| **渲染模式** | 同步渲染 | 同步渲染 | 并发渲染 |
| **优先级模型** | 基本优先级 | 改进的优先级 | Lane模型优先级 |
| **批处理能力** | 有限批处理 | 有限批处理 | 自动批处理 |
| **调度机制** | requestIdleCallback | requestIdleCallback+requestAnimationFrame | Scheduler库 |

#### 4.2 主要优化对比

1. **React 16优化**：
   - Fiber架构支持增量更新
   - 减少主线程阻塞时间
   - 提供错误边界机制

2. **React 17优化**：
   - 事件委托系统重构
   - 移除事件池，简化事件系统
   - 新的JSX转换减少包大小

3. **React 18优化**：
   - 并发渲染提高响应性
   - 自动批处理减少渲染次数
   - Transitions分离紧急和非紧急更新
   - Suspense服务端渲染改进

```javascript
// React 18并发渲染示例
function App() {
  const [isPending, startTransition] = useTransition();
  const [count, setCount] = useState(0);
  const [filterText, setFilterText] = useState('');
  
  // 紧急更新：用户输入立即反映在UI上
  const handleChange = (e) => {
    setFilterText(e.target.value);
  };
  
  // 非紧急更新：用Transition包装，允许用户输入不被阻塞
  const handleSearch = (e) => {
    e.preventDefault();
    startTransition(() => {
      // 这里的状态更新被标记为非紧急
      // 不会阻塞UI响应
    });
  };
  
  return (
    <div>
      <form onSubmit={handleSearch}>
        <input 
          value={filterText} 
          onChange={handleChange}
          placeholder="Search..."
        />
        <button type="submit">Search</button>
      </form>
      {isPending && <p>Loading...</p>}
      <Results filter={filterText} />
    </div>
  );
}
```

### 5. 性能优化策略演进

#### 5.1 版本间性能优化对比

1. **React 16性能优化**：
   - 使用`React.memo`避免不必要的函数组件重渲染
   - 使用`PureComponent`和`shouldComponentUpdate`优化类组件
   - 使用`key`属性帮助React识别列表项变化

2. **React 17性能优化**：
   - 新的JSX转换减少运行时体积
   - 事件委托重构提高多版本共存场景下的性能

3. **React 18性能优化**：
   - 并发渲染自动优化长任务
   - 自动批处理减少渲染次数
   - Transitions允许优先处理重要更新
   - Suspense支持代码分割和数据预加载

```javascript
// React 18中的Suspense和代码分割
const LazyComponent = React.lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}

// 使用useTransition优化搜索体验
function SearchComponent() {
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    
    // 将搜索逻辑标记为非紧急更新
    startTransition(() => {
      // 执行耗时的搜索操作
      performSearch(e.target.value).then(data => {
        setResults(data);
      });
    });
  };
  
  return (
    <div>
      <input value={query} onChange={handleQueryChange} />
      {isPending && <div>Searching...</div>}
      <ResultsList results={results} />
    </div>
  );
}
```

### 6. 迁移与升级建议

#### 6.1 从React 16到React 18的迁移路径

1. **首先升级到React 17**：
   - 修复废弃API的使用
   - 解决不安全生命周期方法的警告
   - 测试组件在React 17下的行为

2. **然后升级到React 18**：
   - 使用`createRoot`替代`ReactDOM.render`
   - 利用并发特性优化用户体验
   - 调整依赖于批处理行为的代码

```javascript
// React 16/17的渲染方式
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));

// React 18的渲染方式
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```

#### 6.2 利用新版本特性的最佳实践

1. **React 17最佳实践**：
   - 使用新的JSX转换
   - 利用更安全的事件委托机制

2. **React 18最佳实践**：
   - 使用`startTransition`区分紧急和非紧急更新
   - 利用自动批处理减少不必要的渲染
   - 使用`useDeferredValue`延迟非关键渲染
   - 探索Suspense的高级用法

```javascript
// 使用useDeferredValue延迟非关键UI更新
function SearchComponent() {
  const [query, setQuery] = useState('');
  // 延迟的查询值，不会立即更新，允许输入保持响应
  const deferredQuery = useDeferredValue(query);
  
  // 只有当deferredQuery变化时才重新计算过滤结果
  const filteredItems = useMemo(() => {
    return filterItems(items, deferredQuery);
  }, [items, deferredQuery]);
  
  return (
    <div>
      <input 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
        placeholder="Search..."
      />
      <ResultsList items={filteredItems} />
      {query !== deferredQuery && <div>Updating search results...</div>}
    </div>
  );
}
```

### 7. 总结

React 16、17和18版本的演进展示了React团队对性能优化和用户体验的持续关注：

- **React 16**：引入Fiber架构，为后续性能优化奠定基础
- **React 17**：重构基础设施，改进JSX转换和事件系统，为并发特性铺路
- **React 18**：实现并发渲染，引入自动批处理和Transitions，显著提升应用响应性

随着这些版本的迭代，React的渲染性能和开发体验不断提升。开发者应该根据项目需求和复杂度，选择合适的React版本，并利用新版本的特性来优化应用性能和用户体验。

## 常见问题与答案

### 1. React 中的虚拟 DOM 是什么？
**答案：** 
虚拟 DOM 是 React 用来表示真实 DOM 的 JavaScript 对象。React 通过比较新旧虚拟 DOM 树的差异，然后只对实际变化的部分进行 DOM 操作，从而提高性能。这使得 React 应用能够高效地处理 UI 更新，即使在复杂的界面上。

### 2. React 组件生命周期的主要阶段有哪些？
**答案：** 
在类组件中，生命周期分为三个主要阶段：
1. **挂载阶段**：组件被创建并插入到 DOM 中，涉及 `constructor`、`render`、`componentDidMount`
2. **更新阶段**：组件的 props 或 state 发生变化，涉及 `shouldComponentUpdate`、`render`、`componentDidUpdate`
3. **卸载阶段**：组件从 DOM 中移除，涉及 `componentWillUnmount`

在函数组件中，这些生命周期概念通过 Hooks（如 `useEffect`）来实现。

### 3. React 中的状态和属性有什么区别？
**答案：** 
- **Props (属性)**：从父组件传递给子组件的数据，是只读的，子组件不能修改 props
- **State (状态)**：组件内部的数据，可以通过 `setState` 或 `useState` 的 setter 函数进行更新

Props 是组件间通信的方式，而 State 是组件内部状态管理的方式。

### 4. 什么是受控组件和非受控组件？
**答案：** 
- **受控组件**：表单元素的值由 React 的 state 控制，每次值的变化都会触发一个事件处理器来更新 state
- **非受控组件**：表单元素的值由 DOM 自身管理，可以通过 `ref` 来访问 DOM 元素获取值

受控组件更符合 React 的单向数据流，但对于简单的表单，非受控组件可能更方便。

### 5. 为什么在 React 中使用 keys？
**答案：** 
Keys 帮助 React 识别哪些项目被更改、添加或删除，以便正确地更新 DOM。Keys 应该是唯一的，通常使用数据的 ID 作为 key。使用索引作为 key 是最后的选择，特别是当列表项目可能会重新排序时。

### 6. React 中的合成事件是什么？
**答案：** 
React 合成事件是 React 自己实现的事件系统，它对不同浏览器的原生事件进行了封装，提供了跨浏览器的一致接口。合成事件与原生事件有相同的接口，但它们不是原生事件的引用。