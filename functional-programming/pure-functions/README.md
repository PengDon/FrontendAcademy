# 纯函数（Pure Functions）

## 基本概念

纯函数是函数式编程的核心概念之一，它指的是满足以下两个条件的函数：

1. **相同的输入总是产生相同的输出**
2. **不产生副作用（Side Effects）**

### 相同的输入总是产生相同的输出

对于纯函数来说，只要输入参数不变，无论调用多少次，都会返回完全相同的结果。这是因为纯函数的计算完全依赖于输入参数，而不依赖于外部状态。

### 不产生副作用

副作用是指函数执行过程中对外部环境产生的影响，例如：

- 修改全局变量
- 修改函数参数
- 进行I/O操作（文件读写、网络请求等）
- 抛出异常
- 调用系统API

## 纯函数的特性

### 1. 引用透明性（Referential Transparency）

纯函数具有引用透明性，这意味着可以用函数的返回值替换函数调用，而不会改变程序的行为。

```javascript
// 引用透明性示例
function square(x) {
  return x * x;
}

// 下面两种写法在程序中是等价的
const result1 = square(5) + square(5);
const result2 = 25 + 25;
```

### 2. 可缓存性（Memoization）

由于纯函数对于相同的输入总是产生相同的输出，我们可以缓存函数调用的结果，以避免重复计算。

### 3. 可测试性（Testability）

纯函数的测试非常简单，因为不需要考虑外部环境和状态，只需要验证输入和输出的关系是否正确即可。

### 4. 并行执行（Parallelization）

纯函数不会修改共享状态，因此可以安全地并行执行，不需要考虑竞态条件。

## 纯函数示例

### 纯函数的例子

```javascript
// 纯函数：计算两个数的和
function add(a, b) {
  return a + b;
}

// 纯函数：计算数组的长度
function getLength(arr) {
  return arr.length;
}

// 纯函数：判断字符串是否为空
function isEmpty(str) {
  return typeof str === 'string' && str.trim().length === 0;
}

// 纯函数：数组映射
function map(arr, fn) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    result.push(fn(arr[i], i, arr));
  }
  return result;
}
```

### 非纯函数的例子

```javascript
// 非纯函数：使用全局变量
let counter = 0;
function increment() {
  return ++counter;
}

// 非纯函数：修改函数参数
function appendToArray(arr, item) {
  arr.push(item); // 修改了输入参数
  return arr;
}

// 非纯函数：进行I/O操作
function logMessage(message) {
  console.log(message); // 控制台输出是副作用
  return message;
}

// 非纯函数：具有随机行为
function getRandomNumber() {
  return Math.random(); // 每次调用返回不同的结果
}
```

## 纯函数的应用场景

### 数据转换

纯函数非常适合用于数据转换操作，因为它们不会修改原始数据，而是返回新的数据。

```javascript
// 数据转换示例
function formatUser(user) {
  return {
    id: user.id,
    name: user.name.toUpperCase(),
    email: user.email.toLowerCase(),
    displayName: `${user.name} (${user.id})`,
    // 不会修改原始的user对象
  };
}

// 对象深拷贝（纯函数版本）
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item));
  }
  
  const clonedObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = deepClone(obj[key]);
    }
  }
  
  return clonedObj;
}
```

### 状态管理

在状态管理中使用纯函数可以确保状态更新的可预测性。

```javascript
// Redux风格的纯函数reducer
function counterReducer(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    case 'RESET':
      return 0;
    default:
      return state;
  }
}

// 复杂状态更新
function updateUserProfile(state, userId, updates) {
  return {
    ...state,
    users: state.users.map(user => 
      user.id === userId 
        ? { ...user, ...updates }
        : user
    )
  };
}
```

### 函数式编程组合

纯函数易于组合，因为它们的行为是可预测的。

```javascript
// 函数组合示例
function compose(...fns) {
  return function(initialValue) {
    return fns.reduceRight((value, fn) => fn(value), initialValue);
  };
}

// 定义几个纯函数
function toUpperCase(str) {
  return str.toUpperCase();
}

function exclaim(str) {
  return `${str}!`;
}

function repeat(str) {
  return `${str} ${str}`;
}

// 组合函数
const shout = compose(repeat, exclaim, toUpperCase);
console.log(shout('hello')); // 'HELLO! HELLO!'
```

## 避免副作用的技巧

### 1. 不可变数据（Immutability）

使用不可变数据结构，避免直接修改原始数据。

```javascript
// 避免数组修改
function addItemToCart(cart, item) {
  // 不要这样做: cart.push(item);
  return [...cart, item]; // 返回新数组
}

// 避免对象修改
function updateUser(user, updates) {
  // 不要这样做: Object.assign(user, updates);
  return { ...user, ...updates }; // 返回新对象
}
```

### 2. 函数参数验证

在函数内部验证参数，避免因参数错误导致的异常。

```javascript
function calculateTotal(prices) {
  if (!Array.isArray(prices)) {
    return 0; // 返回默认值而不是抛出异常
  }
  return prices.reduce((total, price) => {
    // 确保价格是有效的数字
    if (typeof price !== 'number' || isNaN(price) || price < 0) {
      return total;
    }
    return total + price;
  }, 0);
}
```

### 3. 分离纯逻辑和副作用

将纯计算逻辑与副作用操作分开，使代码更容易测试和维护。

```javascript
// 纯计算函数
function calculateDiscount(price, discountRate) {
  return price * (1 - discountRate);
}

// 带有副作用的函数
function applyDiscountAndNotify(user, productId, discountRate) {
  // 1. 获取数据
  const product = fetchProduct(productId); // 副作用
  
  // 2. 纯计算
  const discountedPrice = calculateDiscount(product.price, discountRate);
  
  // 3. 执行副作用
  updateProductPrice(productId, discountedPrice); // 副作用
  notifyUser(user, 'discount-applied', { productId, discountedPrice }); // 副作用
  
  return discountedPrice;
}
```

## 纯函数与性能

### 1. 记忆化（Memoization）

由于纯函数的结果只依赖于输入，我们可以缓存计算结果以提高性能。

```javascript
function memoize(fn) {
  const cache = {};
  return function(...args) {
    const key = JSON.stringify(args);
    if (key in cache) {
      return cache[key];
    }
    const result = fn(...args);
    cache[key] = result;
    return result;
  };
}

// 计算斐波那契数列的纯函数
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// 创建记忆化版本
const memoFibonacci = memoize(n => {
  if (n <= 1) return n;
  return memoFibonacci(n - 1) + memoFibonacci(n - 2);
});
```

### 2. 惰性求值（Lazy Evaluation）

纯函数可以延迟到需要结果时才执行计算。

```javascript
// 惰性求值示例
function lazyValue(fn) {
  let value;
  let computed = false;
  return function() {
    if (!computed) {
      value = fn();
      computed = true;
    }
    return value;
  };
}

// 创建惰性计算的值
const expensiveOperation = lazyValue(() => {
  console.log('Performing expensive operation...');
  // 模拟耗时计算
  return 42;
});

// 只有在首次调用时才执行计算
console.log(expensiveOperation()); // 输出: Performing expensive operation... 42
console.log(expensiveOperation()); // 输出: 42 (使用缓存的值)
```

## 纯函数的局限性

虽然纯函数有很多优点，但在实际开发中，我们不可能只用纯函数编写所有代码，因为：

1. **I/O操作是必须的**：应用程序需要与外部世界交互（读取用户输入、发送网络请求、写入数据库等）。

2. **性能考虑**：对于某些操作，直接修改数据可能比创建新副本更高效。

3. **JavaScript的限制**：JavaScript不是一门纯粹的函数式编程语言，其API设计并不总是鼓励纯函数风格。

### 解决方法：函数式核，命令式壳

一个常见的模式是将应用程序分为两部分：

- **函数式核（Functional Core）**：包含所有纯计算逻辑
- **命令式壳（Imperative Shell）**：处理I/O和副作用

```javascript
// 函数式核
function processUserData(users, filterFn, sortFn) {
  return users
    .filter(filterFn)
    .sort(sortFn)
    .map(user => ({
      id: user.id,
      name: user.name,
      displayName: `${user.name} (${user.age})`
    }));
}

// 命令式壳
async function updateUserList() {
  try {
    // 副作用：获取数据
    const users = await fetchUsers();
    
    // 纯函数处理
    const processedUsers = processUserData(
      users,
      user => user.active === true,
      (a, b) => a.name.localeCompare(b.name)
    );
    
    // 副作用：更新UI
    renderUserList(processedUsers);
    
    // 副作用：记录日志
    logOperation('User list updated');
  } catch (error) {
    // 副作用：错误处理
    handleError(error);
  }
}
```

## 总结

纯函数是函数式编程的基石，它具有以下特点：

- **确定性**：相同输入总是产生相同输出
- **无副作用**：不修改外部状态
- **引用透明**：函数调用可以被其返回值替代
- **易于测试**：不需要模拟外部依赖
- **易于组合**：可以构建更复杂的函数
- **易于优化**：可以应用记忆化、惰性求值等技术

在实际开发中，我们应该尽可能地编写纯函数，但同时也要认识到其局限性，合理地处理副作用。函数式编程的核心思想不是完全消除副作用，而是将副作用隔离和控制，使代码更加健壮、可维护和可测试。