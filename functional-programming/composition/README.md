# 函数组合（Composition）

## 基本概念

函数组合是函数式编程中的核心概念，它允许我们将多个简单函数组合成一个更复杂的函数。函数组合的思想来自数学中的函数复合：(f ∘ g)(x) = f(g(x))

## 函数组合的实现

### 基本组合函数

```javascript
// 基本的二元组合函数
function compose(f, g) {
    return function(x) {
        return f(g(x));
    };
}

// 更通用的组合函数 - 从右到左执行
function compose(...fns) {
    return function(initialValue) {
        return fns.reduceRight(function(prevValue, fn) {
            return fn(prevValue);
        }, initialValue);
    };
}

// 管道函数 - 从左到右执行
function pipe(...fns) {
    return function(initialValue) {
        return fns.reduce(function(prevValue, fn) {
            return fn(prevValue);
        }, initialValue);
    };
}
```

### 使用示例

```javascript
// 定义一些简单函数
function toUpperCase(str) {
    return str.toUpperCase();
}

function exclaim(str) {
    return `${str}!`;
}

function repeat(str) {
    return `${str} ${str}`;
}

// 使用组合函数
const shout = compose(repeat, exclaim, toUpperCase);
console.log(shout('hello')); // 'HELLO! HELLO!'

// 使用管道函数
const processString = pipe(toUpperCase, exclaim, repeat);
console.log(processString('hello')); // 'HELLO! HELLO!'
```

## 实际应用案例

### 1. 数据转换管道

```javascript
// 用户数据处理管道
function getUserData(userId) {
    return { id: userId, name: 'John', age: 30, email: 'john@example.com' };
}

function formatUser(user) {
    return {
        ...user,
        displayName: `${user.name} (${user.age})`,
        email: user.email.toLowerCase()
    };
}

function validateUser(user) {
    const errors = [];
    if (!user.name) errors.push('Name is required');
    if (!user.email) errors.push('Email is required');
    
    return {
        ...user,
        isValid: errors.length === 0,
        errors
    };
}

function logUser(user) {
    console.log('Processed user:', user);
    return user;
}

// 创建用户处理管道
const processUser = pipe(getUserData, formatUser, validateUser, logUser);

// 使用管道
const user = processUser(123);
```

### 2. React 中的函数组合

```javascript
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// 高阶组件组合
function withLoading(WrappedComponent) {
    return function WithLoading(props) {
        if (props.isLoading) {
            return <div>Loading...</div>;
        }
        return <WrappedComponent {...props} />;
    };
}

function withErrorHandling(WrappedComponent) {
    return function WithErrorHandling(props) {
        if (props.error) {
            return <div>Error: {props.error}</div>;
        }
        return <WrappedComponent {...props} />;
    };
}

// 组合多个高阶组件
const enhance = compose(
    connect(state => ({ user: state.user })),
    withRouter,
    withLoading,
    withErrorHandling
);

// 应用到目标组件
const UserProfile = ({ user }) => (
    <div>
        <h1>{user.name}</h1>
        <p>{user.email}</p>
    </div>
);

export default enhance(UserProfile);
```

### 3. Redux 中间件组合

```javascript
import { createStore, applyMiddleware, compose } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

// 自定义中间件
const crashReporter = store => next => action => {
    try {
        return next(action);
    } catch (error) {
        console.error('Caught an exception!', error);
        return next(action);
    }
};

// 组合中间件
const middleware = [thunk, crashReporter];

if (process.env.NODE_ENV === 'development') {
    middleware.push(logger);
}

// 创建 store
const store = createStore(
    rootReducer,
    compose(applyMiddleware(...middleware))
);
```

## Point-free 编程风格

Point-free 编程（也称为无点编程）是一种函数式编程风格，它避免了显式引用其参数。函数组合是实现 Point-free 风格的关键。

```javascript
// 非 Point-free 风格
function sum(a, b) {
    return a + b;
}

function double(x) {
    return x * 2;
}

function calculate(a, b) {
    return double(sum(a, b));
}

// Point-free 风格
const calculatePointFree = compose(double, sum);
```

## 结合函子（Functor）的组合

```javascript
// 简单的 Maybe 函子
class Maybe {
    constructor(value) {
        this.value = value;
    }
    
    static of(value) {
        return new Maybe(value);
    }
    
    map(fn) {
        return this.value === null || this.value === undefined
            ? Maybe.of(null)
            : Maybe.of(fn(this.value));
    }
    
    join() {
        return this.value instanceof Maybe ? this.value : this;
    }
    
    chain(fn) {
        return this.map(fn).join();
    }
}

// 定义一些处理函数
function getUserName(user) {
    return user && user.name ? user.name : null;
}

function greet(name) {
    return name ? `Hello, ${name}!` : 'Hello, stranger!';
}

function exclaim(message) {
    return message + ' How are you?';
}

// 使用函子进行组合
const user = { id: 1, name: 'John' };
const result = Maybe.of(user)
    .map(getUserName)
    .map(greet)
    .map(exclaim)
    .value;

console.log(result); // 'Hello, John! How are you?'
```

## 工具库

### 使用 Ramda.js 进行函数组合

```javascript
import R from 'ramda';

// 定义一些函数
const add = R.add;
const multiply = R.multiply;
const subtract = R.subtract;

// 创建组合函数
const calculate = R.compose(
    subtract(R.__, 10), // 使用占位符
    multiply(2),
    add(R.__, 5)
);

console.log(calculate(3)); // (3 + 5) * 2 - 10 = 6

// 使用管道
const calculateWithPipe = R.pipe(
    add(R.__, 5),
    multiply(2),
    subtract(R.__, 10)
);

console.log(calculateWithPipe(3)); // 6
```

## 常见问题与答案

### 1. 函数组合与管道的区别是什么？
**答案：** 函数组合（compose）是从右到左执行函数，而管道（pipe）是从左到右执行函数。两者本质上是相同的，只是执行顺序不同。选择哪个主要取决于代码的可读性和思维方式。

### 2. 如何调试组合函数？
**答案：** 可以添加日志函数到组合链中：
```javascript
function log(value) {
    console.log(value);
    return value;
}

const process = compose(finalStep, log, middleStep, log, firstStep);
```

### 3. Point-free 编程的优点和缺点？
**答案：**
- 优点：代码更简洁，更专注于函数之间的关系而非参数
- 缺点：可能使代码更难理解，特别是对于不熟悉函数式编程的开发者

### 4. 函数组合在大型应用中的性能考虑？
**答案：**
- 避免不必要的中间值创建
- 考虑使用记忆化（memoization）缓存重复计算
- 对于热点路径，可能需要权衡函数组合的简洁性和直接实现的性能