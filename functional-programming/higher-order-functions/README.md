# 高阶函数（Higher-Order Functions）

## 基本概念

高阶函数是指至少满足下列条件之一的函数：
1. 接受一个或多个函数作为输入
2. 返回一个函数作为输出

在JavaScript中，函数是一等公民，这使得高阶函数成为可能。

## 常见高阶函数

### 1. 数组方法

```javascript
// map - 对数组中的每个元素应用函数，返回新数组
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// filter - 根据条件筛选数组元素，返回新数组
const evenNumbers = numbers.filter(num => num % 2 === 0);
console.log(evenNumbers); // [2, 4]

// reduce - 将数组元素累积计算为单个值
const sum = numbers.reduce((acc, num) => acc + num, 0);
console.log(sum); // 15

// forEach - 遍历数组元素，不返回值
numbers.forEach(num => console.log(num));

// sort - 排序数组元素
const sorted = numbers.sort((a, b) => b - a);
console.log(sorted); // [5, 4, 3, 2, 1]

// find - 查找第一个满足条件的元素
const firstEven = numbers.find(num => num % 2 === 0);
console.log(firstEven); // 2

// some - 检查是否至少有一个元素满足条件
const hasEven = numbers.some(num => num % 2 === 0);
console.log(hasEven); // true

// every - 检查是否所有元素都满足条件
const allPositive = numbers.every(num => num > 0);
console.log(allPositive); // true
```

### 2. 自定义高阶函数

```javascript
// 接受函数作为参数
function repeat(n, fn) {
    for (let i = 0; i < n; i++) {
        fn(i);
    }
}

repeat(3, i => console.log(`Iteration ${i}`));

// 返回函数
function makeMultiplier(multiplier) {
    return function(number) {
        return number * multiplier;
    };
}

const double = makeMultiplier(2);
const triple = makeMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15

// 函数柯里化
function curryAdd(a) {
    return function(b) {
        return function(c) {
            return a + b + c;
        };
    };
}

console.log(curryAdd(1)(2)(3)); // 6
```

## 函数组合

函数组合是将多个函数组合成一个新函数的过程。

```javascript
// 基本的函数组合
function compose(f, g) {
    return function(x) {
        return f(g(x));
    };
}

function double(x) { return x * 2; }
function increment(x) { return x + 1; }

const doubleThenIncrement = compose(increment, double);
const incrementThenDouble = compose(double, increment);

console.log(doubleThenIncrement(3)); // 7 (3*2+1)
console.log(incrementThenDouble(3)); // 8 (3+1)*2

// 多函数组合
function composeMultiple(...fns) {
    return function(x) {
        return fns.reduceRight((acc, fn) => fn(acc), x);
    };
}

function square(x) { return x * x; }

const processNumber = composeMultiple(increment, square, double);
// 执行顺序: double -> square -> increment
console.log(processNumber(3)); // 37 ((3*2)^2)+1
```

## 实际应用案例

### 1. 数据转换管道

```javascript
const users = [
    { id: 1, name: 'John', age: 30, isActive: true },
    { id: 2, name: 'Jane', age: 25, isActive: false },
    { id: 3, name: 'Bob', age: 35, isActive: true }
];

// 构建数据转换管道
const activeUsers = users
    .filter(user => user.isActive)
    .map(user => ({ id: user.id, name: user.name, age: user.age }))
    .sort((a, b) => a.age - b.age);

console.log(activeUsers);
// [ { id: 1, name: 'John', age: 30 }, { id: 3, name: 'Bob', age: 35 } ]
```

### 2. 事件处理增强

```javascript
// 防抖函数
function debounce(fn, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
}

// 节流函数
function throttle(fn, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            fn.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 使用示例
const handleResize = debounce(() => {
    console.log('Window resized');
}, 300);

window.addEventListener('resize', handleResize);
```

### 3. 函数式状态管理

```javascript
// 创建一个简单的状态管理器
function createStore(initialState) {
    let state = initialState;
    const listeners = [];
    
    return {
        getState: () => state,
        
        setState: (newState) => {
            state = { ...state, ...newState };
            listeners.forEach(listener => listener(state));
        },
        
        subscribe: (listener) => {
            listeners.push(listener);
            return () => {
                const index = listeners.indexOf(listener);
                if (index > -1) {
                    listeners.splice(index, 1);
                }
            };
        }
    };
}

// 使用
const store = createStore({ count: 0 });

store.subscribe(state => {
    console.log('New state:', state);
});

store.setState({ count: 1 });
store.setState({ count: 2 });
```

## 优缺点分析

### 优点

1. **代码复用**：高阶函数可以封装通用逻辑，便于复用
2. **代码简洁**：函数式编程风格通常使代码更简洁、可读性更好
3. **易于测试**：纯函数不依赖外部状态，更容易测试
4. **组合性强**：可以通过组合简单函数来构建复杂功能
5. **声明式编程**：关注做什么而不是怎么做

### 缺点

1. **性能开销**：频繁的函数调用可能导致性能问题
2. **学习曲线**：对于初学者来说，理解函数式概念可能需要一定时间
3. **调试复杂**：多层函数组合可能使调试变得困难
4. **内存使用**：返回新对象而不是修改原对象可能增加内存使用

## 常见问题与答案

### 1. 什么是纯函数？
**答案：** 纯函数是指对于相同的输入，总是返回相同的输出，并且没有副作用（不修改外部状态，不进行I/O操作等）。

### 2. 如何优化高阶函数的性能？
**答案：**
- 使用记忆化技术缓存计算结果
- 避免在循环中创建新函数
- 对于大型数据，考虑使用惰性求值
- 在适当的情况下使用原生方法，它们通常经过优化

### 3. 高阶函数在前端框架中的应用？
**答案：**
- React的高阶组件(HOCs)和自定义Hooks
- Redux的中间件模式
- Vue的组合式API中的各种函数
- RxJS等响应式编程库的操作符