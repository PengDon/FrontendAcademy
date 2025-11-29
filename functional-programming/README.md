# 函数式编程

本目录包含函数式编程的学习资料，帮助开发者理解和应用函数式编程范式，提高代码的可读性、可维护性和可测试性。

## 📚 介绍

函数式编程是一种声明式编程范式，强调使用纯函数、避免共享状态、可变数据和副作用。在前端开发中，函数式编程思想已经被广泛应用，特别是在现代JavaScript框架如React、Vue 3等中。

## 📁 目录结构

```
functional-programming/
├── concepts/           # 核心概念
│   ├── pure-functions/ # 纯函数
│   ├── immutability/   # 不可变性
│   ├── higher-order-functions/ # 高阶函数
│   ├── recursion/      # 递归
│   └── composition/    # 函数组合
├── patterns/           # 函数式模式
│   ├── monad/          # Monad模式
│   ├── functor/        # Functor模式
│   └── combinator/     # 组合子模式
├── libraries/          # 函数式库
│   ├── ramda/          # Ramda库
│   ├── lodash-fp/      # Lodash FP
│   └── rxjs/           # RxJS响应式编程
└── examples/           # 实例应用
    ├── data-processing/ # 数据处理
    ├── state-management/ # 状态管理
    └── ui-rendering/   # UI渲染
```

## 📚 学习路径

### 基础阶段

1. **函数式编程基础**
   - 纯函数的定义与特性
   - 不可变性原则
   - 声明式 vs 命令式编程

2. **JavaScript函数式特性**
   - 函数作为一等公民
   - 高阶函数
   - 闭包与作用域
   - 箭头函数

### 进阶阶段

1. **核心函数式概念**
   - 函数组合（Composition）
   - 柯里化（Currying）
   - 偏函数应用（Partial Application）
   - 递归与尾递归优化

2. **数据转换函数**
   - map、filter、reduce
   - flatMap、reduceRight
   - find、some、every
   - sort、reverse

### 高级阶段

1. **函数式设计模式**
   - Functor、Applicative、Monad
   - Either、Maybe、IO等函子
   - 状态管理模式

2. **响应式编程**
   - 观察者模式与响应式流
   - 事件处理的函数式方法
   - 异步操作的函数式处理

## 🎯 核心概念

### 纯函数

纯函数是函数式编程的基础，具有以下特性：
- 对于相同的输入，总是返回相同的输出
- 不产生副作用
- 不依赖外部状态

```javascript
// 纯函数示例
function add(a, b) {
  return a + b;
}

// 非纯函数示例
let counter = 0;
function increment() {
  return ++counter;
}
```

### 不可变性

不可变性指数据一旦创建就不能被修改，任何修改操作都会返回新的数据副本。

```javascript
// 使用Object.assign创建对象副本
const user = { name: 'Alice', age: 30 };
const updatedUser = Object.assign({}, user, { age: 31 });

// 使用展开运算符
const anotherUser = { ...user, age: 32 };

// 数组操作
const numbers = [1, 2, 3];
const newNumbers = [...numbers, 4]; // [1, 2, 3, 4]
const mappedNumbers = numbers.map(n => n * 2); // [2, 4, 6]
```

### 高阶函数

高阶函数是接受一个或多个函数作为参数，或者返回一个函数的函数。

```javascript
// 接受函数作为参数
function withLogging(fn) {
  return function(...args) {
    console.log('Arguments:', args);
    const result = fn(...args);
    console.log('Result:', result);
    return result;
  };
}

// 返回函数
function createMultiplier(multiplier) {
  return function(x) {
    return x * multiplier;
  };
}
const double = createMultiplier(2);
double(5); // 10
```

### 函数组合

函数组合是将多个函数组合成一个新函数的过程。

```javascript
function compose(f, g) {
  return function(x) {
    return f(g(x));
  };
}

function toUpperCase(str) {
  return str.toUpperCase();
}

function exclaim(str) {
  return str + '!';
}

const shout = compose(exclaim, toUpperCase);
shout('hello'); // 'HELLO!'
```

### 柯里化

柯里化是将接受多个参数的函数转换为一系列接受单个参数的函数的过程。

```javascript
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function(...moreArgs) {
      return curried.apply(this, args.concat(moreArgs));
    };
  };
}

function add(a, b, c) {
  return a + b + c;
}

const curriedAdd = curry(add);
curriedAdd(1)(2)(3); // 6
curriedAdd(1, 2)(3); // 6
```

## 💻 前端应用场景

### React中的函数式编程

- **函数组件**：使用函数而非类来定义组件
- **React Hooks**：以函数式方式管理状态和副作用
- **状态不可变性**：在更新状态时创建新的数据副本
- **高阶组件（HOC）**：函数式组件增强模式

```jsx
// 函数组件
function UserProfile({ user }) {
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

// 高阶组件
function withAuthentication(Component) {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Component {...props} /> : <LoginPage />;
  };
}
```

### Vue 3中的函数式编程

- **Composition API**：函数式状态管理和逻辑复用
- **响应式系统**：使用ref和reactive创建不可变引用
- **组合函数**：可重用的逻辑块

```javascript
// 组合函数示例
function useCounter(initialValue = 0) {
  const count = ref(initialValue);
  
  function increment() {
    count.value++;
  }
  
  function decrement() {
    count.value--;
  }
  
  return {
    count,
    increment,
    decrement
  };
}
```

### 状态管理

- **Redux**：基于函数式编程思想的状态管理
- **Immer**：简化不可变状态更新
- **状态转换纯函数**：使用纯函数进行状态更新

```javascript
// Redux reducer示例
function counterReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
}
```

### 数据处理

- **数据流转换**：使用map、filter、reduce等函数处理数据
- **数据验证**：函数式方式进行表单验证
- **API响应处理**：链式数据转换

```javascript
// 数据处理示例
function processUserData(users) {
  return users
    .filter(user => user.age >= 18)
    .map(user => ({
      ...user,
      fullName: `${user.firstName} ${user.lastName}`,
      isAdult: true
    }))
    .sort((a, b) => a.lastName.localeCompare(b.lastName));
}
```

## 💡 学习建议

1. **从基础开始**：先理解纯函数、不可变性和高阶函数等基础概念
2. **实践优先**：通过JavaScript实现各种函数式编程概念
3. **使用函数式库**：尝试使用Ramda、lodash-fp等函数式编程库
4. **重构练习**：将现有代码重构为更具函数式特性的形式
5. **循序渐进**：不要试图一次性重构整个代码库，逐步引入函数式编程思想

## 🔍 学习资源

- 《JavaScript函数式编程》
- 《函数式编程思维》
- [Professor Frisby's Mostly Adequate Guide to Functional Programming](https://mostly-adequate.gitbook.io/mostly-adequate-guide/)
- [Functional-Light JavaScript](https://github.com/getify/Functional-Light-JS)

## 🔗 相关链接

- [Ramda官方文档](https://ramdajs.com/)
- [Lodash FP](https://lodash.com/)
- [RxJS官方文档](https://rxjs.dev/)