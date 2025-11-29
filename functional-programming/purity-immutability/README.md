# 纯函数与不可变性（Purity & Immutability）

## 纯函数（Pure Functions）

### 基本概念

纯函数是指满足以下两个条件的函数：
1. **相同的输入总是产生相同的输出**
2. **没有副作用**（不修改外部状态，不进行I/O操作等）

### 纯函数示例

```javascript
// 纯函数示例
function add(a, b) {
    return a + b;
}

function multiply(a, b) {
    return a * b;
}

function formatName(firstName, lastName) {
    return `${firstName} ${lastName}`;
}
```

### 非纯函数示例

```javascript
// 非纯函数 - 修改外部变量
let counter = 0;
function increment() {
    return ++counter;
}

// 非纯函数 - 读取外部可变状态
function getCurrentTime() {
    return new Date().toISOString();
}

// 非纯函数 - 直接修改输入参数
function updateUser(user, data) {
    user.name = data.name;
    user.email = data.email;
    return user;
}

// 非纯函数 - 进行I/O操作
function logMessage(message) {
    console.log(message);
    return message;
}
```

## 不可变性（Immutability）

### 基本概念

不可变性是指数据一旦创建，就不能被修改。在函数式编程中，我们不是修改原始数据，而是创建并返回新的数据副本。

### 实现不可变性的方法

```javascript
// 1. 对象浅拷贝
function updateUser(user, data) {
    return {
        ...user,
        ...data
    };
}

// 2. 嵌套对象深拷贝
function deepUpdateUser(user, data) {
    return {
        ...user,
        contact: {
            ...user.contact,
            ...data.contact
        },
        settings: {
            ...user.settings,
            ...data.settings
        }
    };
}

// 3. 数组不可变操作
const numbers = [1, 2, 3, 4, 5];

// 添加元素
const newNumbers = [...numbers, 6]; // [1, 2, 3, 4, 5, 6]

// 删除元素
const filteredNumbers = numbers.filter(num => num !== 3); // [1, 2, 4, 5]

// 更新元素
const updatedNumbers = numbers.map(num => num === 3 ? 10 : num); // [1, 2, 10, 4, 5]

// 在指定位置添加元素
const insertedNumbers = [...numbers.slice(0, 2), 2.5, ...numbers.slice(2)]; // [1, 2, 2.5, 3, 4, 5]
```

### 使用不可变库

```javascript
// 使用 Immer 库
import produce from 'immer';

const user = {
    name: 'John',
    address: {
        city: 'New York',
        zip: '10001'
    }
};

const updatedUser = produce(user, draft => {
    draft.address.city = 'Boston';
});

console.log(user.address.city); // 'New York'
console.log(updatedUser.address.city); // 'Boston'

// 使用 Immutable.js
import { Map, List } from 'immutable';

const map = Map({ a: 1, b: 2 });
const newMap = map.set('a', 10);

console.log(map.get('a')); // 1
console.log(newMap.get('a')); // 10
```

## 实际应用案例

### 1. 状态管理

```javascript
// 不可变状态更新
function reducer(state, action) {
    switch (action.type) {
        case 'ADD_ITEM':
            return {
                ...state,
                items: [...state.items, action.payload]
            };
        
        case 'REMOVE_ITEM':
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload)
            };
        
        case 'UPDATE_ITEM':
            return {
                ...state,
                items: state.items.map(item => 
                    item.id === action.payload.id 
                        ? { ...item, ...action.payload.data }
                        : item
                )
            };
        
        default:
            return state;
    }
}
```

### 2. React 组件优化

```javascript
import React, { useState, useCallback } from 'react';

function TodoList() {
    const [todos, setTodos] = useState([]);
    
    // 使用不可变方式添加待办项
    const addTodo = useCallback((text) => {
        setTodos(prevTodos => [...prevTodos, { id: Date.now(), text, completed: false }]);
    }, []);
    
    // 使用不可变方式切换待办项状态
    const toggleTodo = useCallback((id) => {
        setTodos(prevTodos => 
            prevTodos.map(todo => 
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    }, []);
    
    // 使用不可变方式删除待办项
    const deleteTodo = useCallback((id) => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    }, []);
    
    return (
        <div>
            <TodoForm onAdd={addTodo} />
            <ul>
                {todos.map(todo => (
                    <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggle={toggleTodo}
                        onDelete={deleteTodo}
                    />
                ))}
            </ul>
        </div>
    );
}
```

## 优缺点分析

### 纯函数优点

1. **可测试性**：相同输入总是产生相同输出，易于编写单元测试
2. **可缓存性**：可以缓存计算结果，提高性能
3. **可并行执行**：没有副作用，适合并行计算
4. **代码可预测性**：更容易理解和维护

### 不可变性优点

1. **可追踪的状态变化**：每次状态更新都产生新对象，便于追踪变化
2. **避免意外副作用**：防止代码意外修改共享数据
3. **组件性能优化**：便于React等框架进行虚拟DOM比较
4. **时间旅行调试**：支持状态历史回溯

### 缺点

1. **性能开销**：频繁创建新对象可能导致内存使用增加和GC压力
2. **实现复杂性**：对于复杂数据结构，实现不可变更新可能比较繁琐
3. **学习曲线**：需要改变传统的命令式编程思维方式

## 常见问题与答案

### 1. 如何平衡不可变性和性能？
**答案：**
- 使用结构共享技术（如Immutable.js、Immer）只复制必要的部分
- 避免在热点路径上进行深拷贝
- 对于大型数据集，考虑使用惰性求值或虚拟滚动

### 2. 纯函数在前端中有什么限制？
**答案：** 前端应用通常需要与DOM交互、处理用户输入和API调用，这些操作都有副作用。我们可以将应用分为纯函数核心逻辑和有副作用的外层接口。

### 3. 什么是结构共享？
**答案：** 结构共享是指当更新不可变数据时，只创建发生变化的部分的新副本，而重用未变化部分的引用。这可以显著提高性能和减少内存使用。

### 4. 不可变性与React的关系？
**答案：** React使用虚拟DOM比较来决定是否重新渲染组件。如果props或state是不可变的，React可以通过简单的引用相等性检查来确定是否需要更新，从而优化性能。React的useState和Redux等状态管理库都鼓励使用不可变数据。