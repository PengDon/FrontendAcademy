# React Hooks 详解

## 什么是 React Hooks?

React Hooks 是 React 16.8 版本引入的新特性，允许你在不编写 class 的情况下使用 state 以及其他的 React 特性。Hooks 使你能够在函数组件中使用状态和其他 React 特性，而不必编写类组件。

## 基本 Hooks

### useState

`useState` 是最基本的 Hook，用于在函数组件中添加状态。

```jsx
import React, { useState } from 'react';

function Counter() {
  // 声明一个新的 state 变量，我们将其称为 "count"
  // useState 返回一个数组，第一个元素是当前状态值，第二个是更新状态的函数
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

**使用多个 state 变量**

```jsx
function UserProfile() {
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [todos, setTodos] = useState([]);
  
  // 组件逻辑
  
  return (
    <div>
      {/* 组件内容 */}
    </div>
  );
}
```

**函数式更新**

当新的状态依赖于旧状态时，应使用函数式更新，以避免异步更新可能导致的问题。

```jsx
// 错误做法 - 可能导致状态更新不正确
setCount(count + 1); // 多次调用可能不会累加

// 正确做法 - 使用函数式更新
setCount(prevCount => prevCount + 1); // 确保每次都基于最新状态
```

**复杂状态更新**

对于对象或数组等复杂状态，需要确保在更新时保留其他属性不变。

```jsx
// 更新对象
setUser(prevUser => ({
  ...prevUser,
  name: 'New Name'
}));

// 更新数组
setTodos(prevTodos => [...prevTodos, newTodo]); // 添加项
setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id)); // 删除项
setTodos(prevTodos => prevTodos.map(todo => 
  todo.id === id ? { ...todo, completed: !todo.completed } : todo
)); // 更新项
```

### useEffect

`useEffect` Hook 使你能够在函数组件中执行副作用操作，相当于类组件中的 `componentDidMount`、`componentDidUpdate` 和 `componentWillUnmount` 的组合。

```jsx
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // 相当于 componentDidMount 和 componentDidUpdate
  useEffect(() => {
    // 使用浏览器 API 更新文档标题
    document.title = `You clicked ${count} times`;
  });

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

**清除副作用**

当组件卸载或在重新运行副作用之前，可能需要清除上一个副作用。

```jsx
function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // 设置定时器
    const interval = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds + 1);
    }, 1000);

    // 清除函数（componentWillUnmount）
    return () => {
      clearInterval(interval);
    };
  }, []); // 空依赖数组，只在组件挂载和卸载时执行

  return (
    <div>
      Seconds: {seconds}
    </div>
  );
}
```

**依赖项数组**

`useEffect` 的第二个参数是一个依赖项数组，决定了何时重新执行副作用。

```jsx
// 1. 无依赖项数组：每次渲染后都执行
useEffect(() => {
  document.title = `You clicked ${count} times`;
});

// 2. 空依赖项数组：只在组件挂载时执行一次
useEffect(() => {
  console.log('Component mounted');
  return () => {
    console.log('Component will unmount');
  };
}, []);

// 3. 包含依赖项：当依赖项发生变化时执行
useEffect(() => {
  fetchData(id);
}, [id]); // 仅在 id 变化时重新获取数据

// 4. 多个依赖项
useEffect(() => {
  console.log(`User ${name} with role ${role} loaded`);
}, [name, role]); // 当 name 或 role 变化时执行
```

### useContext

`useContext` Hook 使你能够订阅 React 的 Context，在函数组件中访问上下文值，而不必通过组件树的每一层手动传递 props。

```jsx
import React, { useContext } from 'react';

// 创建 Context
const ThemeContext = React.createContext('light');

function ThemeProvider({ children }) {
  return (
    <ThemeContext.Provider value="dark">
      {children}
    </ThemeContext.Provider>
  );
}

function ThemedButton() {
  // 使用 useContext 访问上下文值
  const theme = useContext(ThemeContext);
  
  return (
    <button style={{ background: theme === 'dark' ? '#333' : '#fff', color: theme === 'dark' ? '#fff' : '#333' }}>
      I am styled by theme context!
    </button>
  );
}

function App() {
  return (
    <ThemeProvider>
      <div>
        <ThemedButton />
      </div>
    </ThemeProvider>
  );
}
```

## 额外的 Hooks

### useReducer

`useReducer` 是 `useState` 的替代方案，更适合处理复杂的状态逻辑，尤其是当状态逻辑涉及多个子值，或者下一个状态依赖于之前的状态。

```jsx
import React, { useReducer } from 'react';

// 定义 reducer 函数
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    default:
      throw new Error();
  }
}

function Counter() {
  // useReducer 接收 reducer 函数和初始状态，返回当前状态和 dispatch 函数
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
}
```

**复杂状态管理示例**

```jsx
function todosReducer(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, {
          id: Date.now(),
          text: action.payload,
          completed: false
        }]
      };
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
        )
      };
    case 'REMOVE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      };
    default:
      return state;
  }
}

function TodoList() {
  const [state, dispatch] = useReducer(todosReducer, { todos: [] });
  const [inputText, setInputText] = useState('');

  const handleAddTodo = () => {
    if (inputText.trim()) {
      dispatch({ type: 'ADD_TODO', payload: inputText });
      setInputText('');
    }
  };

  return (
    <div>
      <div>
        <input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Add a todo"
        />
        <button onClick={handleAddTodo}>Add</button>
      </div>
      <ul>
        {state.todos.map(todo => (
          <li key={todo.id}>
            <span
              style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
              onClick={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
            >
              {todo.text}
            </span>
            <button onClick={() => dispatch({ type: 'REMOVE_TODO', payload: todo.id })}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### useCallback

`useCallback` Hook 允许你在重新渲染之间缓存函数实例，避免不必要的子组件重新渲染。

```jsx
import React, { useState, useCallback } from 'react';

function Parent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  // 使用 useCallback 缓存函数
  const handleClick = useCallback(() => {
    setCount(count + 1);
  }, [count]); // 依赖于 count

  // 正确的函数式更新方式，依赖项可以为空数组
  const handleClickImproved = useCallback(() => {
    setCount(prevCount => prevCount + 1);
  }, []); // 不依赖于 count，因为使用了函数式更新

  return (
    <div>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Child onClick={handleClickImproved} />
      <p>Count: {count}</p>
    </div>
  );
}

// 假设 Child 组件使用了 React.memo
const Child = React.memo(({ onClick }) => {
  console.log('Child component rendered');
  return <button onClick={onClick}>Increment Count</button>;
});
```

### useMemo

`useMemo` Hook 允许你在重新渲染之间缓存计算结果，避免昂贵的重新计算。

```jsx
import React, { useState, useMemo } from 'react';

function Calculator() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(1);

  // 昂贵的计算
  const expensiveCalculation = useMemo(() => {
    console.log('Performing expensive calculation...');
    // 模拟耗时操作
    let result = 0;
    for (let i = 0; i < 100000000; i++) {
      result += a * b;
    }
    return result;
  }, [a, b]); // 只有当 a 或 b 改变时，才重新计算

  return (
    <div>
      <input
        type="number"
        value={a}
        onChange={(e) => setA(parseInt(e.target.value) || 0)}
      />
      <input
        type="number"
        value={b}
        onChange={(e) => setB(parseInt(e.target.value) || 0)}
      />
      <p>Result: {expensiveCalculation}</p>
    </div>
  );
}
```

### useRef

`useRef` Hook 创建一个可变的 ref 对象，在组件的整个生命周期中保持不变。它可以用于：

1. 访问 DOM 元素
2. 在组件重新渲染之间保存任意值

```jsx
import React, { useRef, useEffect } from 'react';

function TextInputWithFocusButton() {
  // 创建一个 ref 对象，用于引用 input 元素
  const inputRef = useRef(null);

  // 聚焦到 input 元素
  const focusInput = () => {
    inputRef.current.focus();
  };

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>Focus the input</button>
    </div>
  );
}

// 使用 useRef 保存前一个状态值
function CounterWithPreviousValue() {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef();

  useEffect(() => {
    prevCountRef.current = count;
  }, [count]); // 当 count 变化时，更新 ref 的 current 值

  const prevCount = prevCountRef.current;

  return (
    <div>
      <p>Current count: {count}</p>
      <p>Previous count: {prevCount}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### useImperativeHandle

`useImperativeHandle` Hook 允许你自定义从父组件通过 ref 访问子组件的实例值。

```jsx
import React, { useRef, useImperativeHandle, forwardRef } from 'react';

// 使用 forwardRef 将 ref 转发给子组件
const CustomInput = forwardRef((props, ref) => {
  const inputRef = useRef(null);

  // 自定义通过 ref 暴露给父组件的方法
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
      console.log('Custom focus logic');
    },
    select: () => {
      inputRef.current.select();
    }
  }));

  return <input ref={inputRef} {...props} />;
});

function ParentComponent() {
  const customInputRef = useRef(null);

  const handleClick = () => {
    // 调用子组件暴露的 focus 方法
    customInputRef.current.focus();
  };

  return (
    <div>
      <CustomInput ref={customInputRef} />
      <button onClick={handleClick}>Focus Input</button>
    </div>
  );
}
```

### useLayoutEffect

`useLayoutEffect` Hook 与 `useEffect` 非常相似，但它会在所有 DOM 变更之后同步调用。它通常用于需要测量 DOM 元素或在浏览器绘制之前进行 DOM 操作的情况。

```jsx
import React, { useRef, useState, useLayoutEffect } from 'react';

function MeasureExample() {
  const [width, setWidth] = useState(0);
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (ref.current) {
      // 在浏览器绘制之前获取元素宽度
      setWidth(ref.current.offsetWidth);
    }
  }, []); // 仅在组件挂载时执行

  return (
    <div>
      <div ref={ref}>Measure me</div>
      <p>Width: {width}px</p>
    </div>
  );
}
```

### useDebugValue

`useDebugValue` Hook 可以用于在 React DevTools 中显示自定义 Hook 的标签。

```jsx
import React, { useState, useEffect, useDebugValue } from 'react';

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ... 逻辑 ...

  // 在 DevTools 中显示标签
  useDebugValue(isOnline ? 'Online' : 'Offline');

  return isOnline;
}

// 带格式化函数的 useDebugValue
function useTimer(initialTime = 0) {
  const [time, setTime] = useState(initialTime);

  // ... 计时器逻辑 ...

  // 使用格式化函数，只在需要显示时计算
  useDebugValue(time, time => `Time: ${time}s`);

  return time;
}
```

## 自定义 Hooks

自定义 Hooks 允许你在不同组件之间重用状态逻辑，而不必共享 UI。

### 创建自定义 Hook

```jsx
import React, { useState, useEffect } from 'react';

// 自定义 Hook - 订阅在线状态
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    // 模拟订阅
    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    
    // 清理订阅
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  }, [friendID]);

  return isOnline;
}

// 在组件中使用自定义 Hook
function FriendListItem({ friend }) {
  const isOnline = useFriendStatus(friend.id);

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {friend.name}
    </li>
  );
}
```

### 实用自定义 Hook 示例

#### useLocalStorage

```jsx
function useLocalStorage(key, initialValue) {
  // 获取初始值，如果本地存储中有值则使用本地存储的值
  const readValue = () => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState(readValue);

  // 更新本地存储和状态
  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
```

#### useFetch

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}
```

#### useDebounce

```jsx
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // 设置定时器
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 清理函数
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // 仅在 value 或 delay 变化时重新执行

  return debouncedValue;
}
```

## 常见问题与答案

### 1. Hooks 的规则有哪些？
**答案：** 
- **只在最顶层使用 Hook**：不要在循环、条件或嵌套函数中调用 Hook
- **只在 React 函数组件或自定义 Hook 中使用 Hook**：不要在普通 JavaScript 函数中调用 Hook
- **使用 ESLint 插件**：React 提供了 ESLint 插件 `eslint-plugin-react-hooks` 来自动检查这些规则

### 2. useState 和 useReducer 的区别是什么？
**答案：** 
- `useState` 适合简单的状态管理，状态逻辑相对直接
- `useReducer` 适合复杂的状态逻辑，特别是当状态逻辑涉及多个子值，或者下一个状态依赖于之前的状态
- `useReducer` 在组件树较深时，可以通过 dispatch 函数传递，避免 props drilling

### 3. useEffect 依赖数组的最佳实践是什么？
**答案：** 
- 始终包含 useEffect 中使用的所有变量（包括 props、state 和函数）在依赖数组中
- 使用函数式更新避免依赖外部变量
- 对于函数依赖，使用 useCallback 或定义在 useEffect 内部
- 空依赖数组 `[]` 表示只在组件挂载和卸载时执行

### 4. useMemo 和 useCallback 的区别是什么？
**答案：** 
- `useMemo` 用于缓存计算结果（值）
- `useCallback` 用于缓存函数实例
- 两者都用于性能优化，避免不必要的重新计算或重新渲染

### 5. 何时使用 useRef？
**答案：** 
- 需要直接访问 DOM 元素时
- 需要在组件重新渲染之间保存值，且该值的变化不应触发重新渲染时
- 需要在 useEffect 中保存之前的状态值时

### 6. 如何使用 Hooks 优化组件性能？
**答案：** 
- 使用 `React.memo` 防止不必要的函数组件重新渲染
- 使用 `useCallback` 缓存事件处理函数和回调函数
- 使用 `useMemo` 缓存计算结果和子组件属性
- 正确设置 useEffect 的依赖项，避免不必要的副作用执行
- 避免在渲染过程中创建新对象、数组或函数，除非必要

### 7. 自定义 Hook 的优势是什么？
**答案：** 
- 逻辑复用：可以在多个组件之间重用状态逻辑
- 关注点分离：将相关的 Hooks 逻辑组织到一个函数中
- 更好的测试：自定义 Hook 可以独立测试
- 代码清晰：使组件代码更简洁，专注于 UI 渲染

### 8. useEffect 和 useLayoutEffect 的区别是什么？
**答案：** 
- `useEffect` 在浏览器渲染后异步执行
- `useLayoutEffect` 在所有 DOM 变更之后同步执行，在浏览器绘制之前
- `useLayoutEffect` 主要用于需要在浏览器绘制前读取或修改 DOM 的场景，如测量 DOM 元素尺寸
- 大多数情况下，`useEffect` 是更好的选择，因为它不会阻塞浏览器渲染

### 9. 如何在自定义 Hook 中使用 context？
**答案：** 
```jsx
import { useContext } from 'react';

const ThemeContext = React.createContext();

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
```

### 10. 如何在 Hooks 中处理异步操作？
**答案：** 
- 在 useEffect 中使用 async/await（需要在 useEffect 内部定义异步函数）
```jsx
useEffect(() => {
  const fetchData = async () => {
    const response = await fetch('https://api.example.com');
    const data = await response.json();
    setData(data);
  };
  fetchData();
}, []);
```
- 使用自定义 Hook 封装异步逻辑，如前面提到的 `useFetch` 示例