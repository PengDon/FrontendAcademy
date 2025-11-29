# JavaScript 面试题

## 基础概念

### 1. JavaScript 的数据类型有哪些？

**答案：**
JavaScript 有 8 种数据类型：

**原始类型（Primitive Types）：**
- **Number**：数字，包括整数和浮点数
- **String**：字符串
- **Boolean**：布尔值，true 或 false
- **Undefined**：未定义
- **Null**：空值
- **Symbol**：ES6 新增，表示唯一标识符
- **BigInt**：ES10 新增，用于表示大整数

**引用类型（Reference Types）：**
- **Object**：对象，包括普通对象、数组、函数等

**区别：**
- 原始类型存储在栈内存中，值不可变
- 引用类型存储在堆内存中，栈中保存引用地址
- 引用类型可以添加属性和方法，原始类型不能

### 2. null 和 undefined 的区别是什么？

**答案：**

**null：**
- 表示"无"，一个空对象指针
- 主动赋值，表示变量已初始化但值为空
- `typeof null` 返回 `"object"`（历史遗留 bug）
- 转换为数值是 0

**undefined：**
- 表示"未定义"，变量声明但未赋值
- 函数参数未提供时为 undefined
- 对象属性不存在时返回 undefined
- 函数没有返回值时默认返回 undefined
- `typeof undefined` 返回 `"undefined"`
- 转换为数值是 NaN

```javascript
let a; // undefined
let b = null; // null

console.log(a == b); // true
console.log(a === b); // false
```

### 3. 什么是闭包（Closure）？

**答案：**
闭包是指有权访问另一个函数作用域中变量的函数。

**特点：**
- 可以访问其词法作用域之外的变量
- 即使外部函数已经返回，闭包仍然可以访问外部函数的变量
- 闭包会保持对外部变量的引用，不会被垃圾回收

**示例：**
```javascript
function createCounter() {
  let count = 0; // 被闭包引用的变量
  
  return {
    increment: function() {
      count++;
      return count;
    },
    getCount: function() {
      return count;
    }
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount()); // 2
```

**应用场景：**
- 数据私有化和封装
- 函数工厂
- 模块化开发
- 防抖和节流函数

### 4. 请解释 JavaScript 的原型链（Prototype Chain）

**答案：**
原型链是 JavaScript 实现继承的机制，每个对象都有一个 `__proto__` 属性指向其构造函数的原型对象。

**关键概念：**
- 每个函数都有一个 `prototype` 属性
- 每个对象都有一个 `__proto__` 属性
- 当访问对象的属性或方法时，如果对象本身没有，会沿着原型链向上查找
- 原型链的终点是 `Object.prototype.__proto__`，值为 `null`

**示例：**
```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.sayHello = function() {
  return `Hello, I'm ${this.name}`;
};

const john = new Person('John');
console.log(john.sayHello()); // "Hello, I'm John"

// 原型链关系
console.log(john.__proto__ === Person.prototype); // true
console.log(Person.prototype.__proto__ === Object.prototype); // true
console.log(Object.prototype.__proto__); // null
```

### 5. this 关键字在不同场景下的指向是什么？

**答案：**
`this` 的指向取决于函数的调用方式，而非定义方式。

**常见场景：**

1. **全局环境中：**
   - 浏览器：`this` 指向 `window`
   - Node.js：`this` 指向 `global`

2. **函数直接调用：**
   - 非严格模式：`this` 指向 `window`/`global`
   - 严格模式：`this` 指向 `undefined`

3. **作为对象方法调用：**
   - `this` 指向调用该方法的对象

4. **使用 new 关键字调用构造函数：**
   - `this` 指向新创建的对象

5. **使用 call/apply/bind 方法：**
   - `this` 指向传入的第一个参数

6. **箭头函数：**
   - `this` 继承自外层作用域的 `this`，不会绑定自己的 `this`

**示例：**
```javascript
// 1. 对象方法
const obj = {
  name: 'Object',
  greet: function() {
    console.log(this.name);
  }
};
obj.greet(); // "Object"

// 2. 构造函数
function Person(name) {
  this.name = name;
}
const person = new Person('John');
console.log(person.name); // "John"

// 3. call/apply/bind
function sayHello() {
  console.log(`Hello, ${this.name}`);
}
sayHello.call({ name: 'Alice' }); // "Hello, Alice"

// 4. 箭头函数
const arrowFunc = () => {
  console.log(this); // 继承外层作用域的 this
};
```

## 进阶概念

### 6. 什么是异步编程？JavaScript 中如何处理异步操作？

**答案：**
异步编程是指程序执行时不会阻塞后续代码的执行，而是在操作完成后通过回调、Promise 等方式处理结果。

**JavaScript 处理异步的方式：**

1. **回调函数（Callbacks）**
```javascript
setTimeout(() => {
  console.log('异步操作完成');
}, 1000);
```

2. **Promise**
```javascript
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('异步操作成功');
    // 或 reject(new Error('异步操作失败'));
  }, 1000);
});

promise
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

3. **async/await**
```javascript
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}
```

4. **事件监听**
```javascript
document.addEventListener('click', () => {
  console.log('点击事件发生');
});
```

### 7. Promise 的三种状态是什么？如何工作？

**答案：**
Promise 有三种状态：

1. **pending（进行中）**：初始状态，既未完成也未失败
2. **fulfilled（已成功）**：操作成功完成
3. **rejected（已失败）**：操作失败

**特点：**
- 状态一旦改变，就不会再变
- 从 pending 变为 fulfilled
- 从 pending 变为 rejected

**Promise 链式调用：**
```javascript
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => processData(data))
  .catch(error => console.error('Error:', error))
  .finally(() => console.log('操作完成'));
```

**Promise 静态方法：**
- `Promise.all()`：全部成功才成功，有一个失败就失败
- `Promise.race()`：最快完成的结果决定最终状态
- `Promise.allSettled()`：所有操作完成，无论成功失败
- `Promise.any()`：只要有一个成功就成功
- `Promise.resolve()`：返回已成功的 Promise
- `Promise.reject()`：返回已失败的 Promise

### 8. 什么是防抖（Debounce）和节流（Throttle）？有什么区别？

**答案：**

**防抖（Debounce）：**
在事件触发 n 秒后才执行函数，如果 n 秒内又触发了事件，则重新计时。

**应用场景：**
- 搜索框输入
- 窗口调整大小
- 滚动事件

**实现：**
```javascript
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
```

**节流（Throttle）：**
在一段时间内，只能触发一次函数。

**应用场景：**
- 高频点击事件
- 滚动加载更多
- 拖拽事件

**实现：**
```javascript
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
```

**区别：**
- 防抖是延迟执行，多次触发合并为一次
- 节流是限制执行频率，一定时间内只执行一次

### 9. 请解释 JavaScript 的事件循环（Event Loop）

**答案：**
事件循环是 JavaScript 处理异步操作的核心机制，负责协调执行栈、回调队列和微任务队列。

**执行顺序：**
1. 执行同步代码（执行栈）
2. 执行所有微任务（Microtasks）
3. 渲染页面（如果需要）
4. 执行宏任务（Macrotasks）
5. 重复步骤 2-4

**微任务（Microtasks）：**
- Promise 的 then/catch/finally 回调
- MutationObserver 回调
- process.nextTick（Node.js）
- queueMicrotask

**宏任务（Macrotasks）：**
- setTimeout
- setInterval
- setImmediate（Node.js）
- requestAnimationFrame
- I/O 操作
- UI 渲染

**示例：**
```javascript
console.log('1'); // 同步

setTimeout(() => {
  console.log('2'); // 宏任务
}, 0);

Promise.resolve().then(() => {
  console.log('3'); // 微任务
});

console.log('4'); // 同步

// 输出顺序：1, 4, 3, 2
```

### 10. 什么是深浅拷贝？如何实现？

**答案：**

**浅拷贝：**
只复制对象的第一层属性，如果属性值是引用类型，只复制引用地址。

**实现方法：**
```javascript
// 方法1：Object.assign()
const obj1 = { a: 1, b: { c: 2 } };
const copy1 = Object.assign({}, obj1);

// 方法2：展开运算符
const copy2 = { ...obj1 };

// 方法3：Array.prototype.slice()/Array.prototype.concat()
const arr = [1, [2, 3]];
const arrCopy = arr.slice();
```

**深拷贝：**
复制对象的所有层级，引用类型会创建新的副本。

**实现方法：**
```javascript
// 方法1：JSON.parse(JSON.stringify())
const deepCopy1 = JSON.parse(JSON.stringify(obj));
// 注意：不支持函数、Symbol、undefined、循环引用等

// 方法2：递归实现
function deepClone(obj, hash = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (hash.has(obj)) return hash.get(obj); // 处理循环引用
  
  let cloneObj = Array.isArray(obj) ? [] : {};
  hash.set(obj, cloneObj);
  
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloneObj[key] = deepClone(obj[key], hash);
    }
  }
  
  return cloneObj;
}

// 方法3：使用第三方库（如 lodash 的 _.cloneDeep）
```

## ES6+ 特性

### 11. ES6 新增了哪些重要特性？

**答案：**

**1. 箭头函数**
```javascript
const sum = (a, b) => a + b;
```

**2. 模板字符串**
```javascript
const name = 'John';
const greeting = `Hello, ${name}!`;
```

**3. 解构赋值**
```javascript
const { name, age } = person;
const [a, b] = array;
```

**4. 展开运算符**
```javascript
const arr1 = [1, 2];
const arr2 = [3, 4];
const combined = [...arr1, ...arr2];
```

**5. 类（Class）**
```javascript
class Person {
  constructor(name) {
    this.name = name;
  }
  
  sayHello() {
    return `Hello, I'm ${this.name}`;
  }
}
```

**6. 模块系统（import/export）**
```javascript
// 导出
export const utils = {};
export default function() {};

// 导入
import { utils } from './utils';
import defaultExport from './module';
```

**7. Promise**
```javascript
const promise = new Promise((resolve, reject) => {
  // 异步操作
});
```

**8. let/const**
```javascript
let variable = 'mutable';
const constant = 'immutable';
```

**9. Set/Map 数据结构**
```javascript
const set = new Set([1, 2, 3]);
const map = new Map([['key', 'value']]);
```

**10. 默认参数**
```javascript
function greet(name = 'Guest') {
  return `Hello, ${name}!`;
}
```

**11. 剩余参数**
```javascript
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}
```

### 12. let、const 和 var 的区别是什么？

**答案：**

**var：**
- 函数作用域
- 变量提升（可以在声明前使用）
- 可以重复声明
- 全局声明会挂载到 window 对象上

**let：**
- 块级作用域
- 不存在变量提升（存在暂时性死区）
- 不可以重复声明
- 全局声明不会挂载到 window 对象上

**const：**
- 块级作用域
- 不存在变量提升
- 不可以重复声明
- 声明时必须赋值
- 不能重新赋值，但对象的属性可以修改

**示例：**
```javascript
// var 变量提升
console.log(a); // undefined
var a = 1;

// let 暂时性死区
console.log(b); // ReferenceError
let b = 2;

// const 不能重新赋值
const c = 3;
c = 4; // TypeError

// const 对象属性可以修改
const obj = { d: 5 };
obj.d = 6; // 可以
```

### 13. 箭头函数和普通函数的区别是什么？

**答案：**

**箭头函数：**
- 不绑定自己的 `this`，继承外层作用域的 `this`
- 不能用作构造函数，不能使用 `new`
- 没有 `arguments` 对象（可以使用剩余参数）
- 不可以使用 `yield` 关键字（不能作为生成器函数）
- 语法更简洁

**普通函数：**
- `this` 指向取决于调用方式
- 可以用作构造函数
- 有 `arguments` 对象
- 可以使用 `yield` 关键字

**示例：**
```javascript
// this 指向
const obj = {
  name: 'Object',
  regular: function() {
    console.log(this.name); // 'Object'
  },
  arrow: () => {
    console.log(this.name); // 取决于外层作用域
  }
};

// 不能用作构造函数
const ArrowFunc = () => {};
const instance = new ArrowFunc(); // TypeError

// arguments 对象
function regularFunc() {
  console.log(arguments); // 存在
}

const arrowFunc = () => {
  console.log(arguments); // ReferenceError
};
```

### 14. 什么是迭代器（Iterator）和生成器（Generator）？

**答案：**

**迭代器（Iterator）：**
迭代器是一个对象，提供了一个 `next()` 方法，每次调用返回 `{value, done}` 的结构。

**实现迭代器：**
```javascript
const iterable = {
  [Symbol.iterator]() {
    let step = 0;
    return {
      next() {
        step++;
        if (step <= 5) {
          return { value: step, done: false };
        } else {
          return { value: undefined, done: true };
        }
      }
    };
  }
};

for (const item of iterable) {
  console.log(item); // 1, 2, 3, 4, 5
}
```

**生成器（Generator）：**
生成器是一种特殊的函数，可以暂停执行并在需要时恢复。

**使用生成器：**
```javascript
function* generatorFunc() {
  yield 1;
  yield 2;
  yield 3;
  return 4;
}

const generator = generatorFunc();
console.log(generator.next()); // { value: 1, done: false }
console.log(generator.next()); // { value: 2, done: false }
console.log(generator.next()); // { value: 3, done: false }
console.log(generator.next()); // { value: 4, done: true }
```

**应用场景：**
- 处理大数组或数据流
- 异步操作的顺序执行
- 状态机实现

### 15. 什么是 Proxy 和 Reflect？

**答案：**

**Proxy：**
Proxy 用于创建一个对象的代理，拦截并自定义对象的操作。

**基本用法：**
```javascript
const target = { name: 'John', age: 30 };
const handler = {
  get: function(target, prop, receiver) {
    console.log(`Getting ${prop}`);
    return Reflect.get(target, prop, receiver);
  },
  set: function(target, prop, value, receiver) {
    console.log(`Setting ${prop} to ${value}`);
    return Reflect.set(target, prop, value, receiver);
  }
};

const proxy = new Proxy(target, handler);
console.log(proxy.name); // 输出 "Getting name" 和 "John"
proxy.age = 31; // 输出 "Setting age to 31"
```

**常用陷阱（Traps）：**
- `get`：拦截属性访问
- `set`：拦截属性设置
- `has`：拦截 `in` 操作符
- `deleteProperty`：拦截 `delete` 操作
- `apply`：拦截函数调用
- `construct`：拦截 `new` 操作符

**Reflect：**
Reflect 是一个内置对象，提供了与 Proxy 陷阱对应的方法，用于执行默认行为。

**主要用途：**
- 与 Proxy 配合使用，实现默认行为
- 提供更友好的 API（如 `Reflect.has` 替代 `in` 操作符）
- 方法返回布尔值表示操作是否成功

## 高级应用

### 16. 如何实现继承？

**答案：**

**1. 原型链继承**
```javascript
function Parent() {
  this.name = 'Parent';
}

Parent.prototype.sayName = function() {
  console.log(this.name);
};

function Child() {}
Child.prototype = new Parent();
Child.prototype.constructor = Child;

const child = new Child();
child.sayName(); // "Parent"
```

**2. 构造函数继承**
```javascript
function Parent(name) {
  this.name = name;
  this.colors = ['red', 'blue'];
}

function Child(name) {
  Parent.call(this, name);
}

const child1 = new Child('Child1');
const child2 = new Child('Child2');
child1.colors.push('green');
console.log(child1.colors); // ['red', 'blue', 'green']
console.log(child2.colors); // ['red', 'blue']
```

**3. 组合继承**
```javascript
function Parent(name) {
  this.name = name;
  this.colors = ['red', 'blue'];
}

Parent.prototype.sayName = function() {
  console.log(this.name);
};

function Child(name, age) {
  Parent.call(this, name); // 第二次调用 Parent
  this.age = age;
}

Child.prototype = new Parent(); // 第一次调用 Parent
Child.prototype.constructor = Child;
Child.prototype.sayAge = function() {
  console.log(this.age);
};
```

**4. ES6 Class 继承**
```javascript
class Parent {
  constructor(name) {
    this.name = name;
  }
  
  sayName() {
    console.log(this.name);
  }
}

class Child extends Parent {
  constructor(name, age) {
    super(name); // 调用父类构造函数
    this.age = age;
  }
  
  sayAge() {
    console.log(this.age);
  }
}
```

### 17. 什么是设计模式？请举例说明几个常用的设计模式。

**答案：**
设计模式是解决软件设计中常见问题的可复用方案。

**常用设计模式：**

**1. 单例模式（Singleton）**
确保一个类只有一个实例，并提供全局访问点。

```javascript
class Singleton {
  constructor() {
    if (Singleton.instance) {
      return Singleton.instance;
    }
    this.data = 'Singleton instance';
    Singleton.instance = this;
  }
}

const instance1 = new Singleton();
const instance2 = new Singleton();
console.log(instance1 === instance2); // true
```

**2. 工厂模式（Factory）**
创建对象的接口，让子类决定实例化的类。

```javascript
class ProductA {
  operation() { return 'Product A operation'; }
}

class ProductB {
  operation() { return 'Product B operation'; }
}

class Factory {
  createProduct(type) {
    switch(type) {
      case 'A': return new ProductA();
      case 'B': return new ProductB();
      default: throw new Error('Unknown product type');
    }
  }
}
```

**3. 观察者模式（Observer）**
定义对象间的一种一对多依赖关系，当一个对象状态改变时，所有依赖它的对象都会收到通知。

```javascript
class Subject {
  constructor() {
    this.observers = [];
  }
  
  addObserver(observer) {
    this.observers.push(observer);
  }
  
  notify(data) {
    this.observers.forEach(observer => observer.update(data));
  }
}

class Observer {
  update(data) {
    console.log('Data updated:', data);
  }
}
```

**4. 策略模式（Strategy）**
定义一系列算法，把它们封装起来，并使它们可以互相替换。

```javascript
const strategies = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => a / b
};

function calculate(strategy, a, b) {
  return strategies[strategy](a, b);
}
```

**5. 代理模式（Proxy）**
为其他对象提供一种代理以控制对这个对象的访问。

```javascript
class RealSubject {
  request() {
    return 'RealSubject request';
  }
}

class ProxySubject {
  constructor() {
    this.realSubject = new RealSubject();
  }
  
  request() {
    // 前置处理
    console.log('Proxy preprocessing');
    const result = this.realSubject.request();
    // 后置处理
    console.log('Proxy postprocessing');
    return result;
  }
}
```

### 18. 如何实现函数柯里化（Currying）？

**答案：**
函数柯里化是将接受多个参数的函数转换为接受单一参数的函数序列。

**基本实现：**
```javascript
function curry(fn) {
  const arity = fn.length;
  
  return function curried(...args) {
    if (args.length >= arity) {
      return fn.apply(this, args);
    }
    
    return function(...moreArgs) {
      return curried.apply(this, [...args, ...moreArgs]);
    };
  };
}

// 示例
const add = (a, b, c) => a + b + c;
const curriedAdd = curry(add);

console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6
console.log(curriedAdd(1)(2, 3)); // 6
console.log(curriedAdd(1, 2, 3)); // 6
```

**应用场景：**
- 参数复用
- 延迟执行
- 函数组合

**实际应用示例：**
```javascript
// 日志函数柯里化
const log = level => message => console[level](`[${level.toUpperCase()}] ${message}`);

const info = log('info');
const error = log('error');
const debug = log('debug');

info('Application started');
error('Something went wrong');
debug('Debug information');
```

## 性能优化

### 19. JavaScript 性能优化技巧有哪些？

**答案：**

**1. 变量和数据结构优化**
- 使用 `const` 和 `let` 代替 `var`
- 避免创建不必要的全局变量
- 使用合适的数据结构（如 Map 代替对象存储键值对）

**2. DOM 操作优化**
- 减少直接 DOM 操作
- 使用文档片段（DocumentFragment）批量操作
- 使用事件委托减少事件监听器
- 避免在循环中修改样式

**3. 循环优化**
- 减少循环内的计算
- 使用 `for...of` 或 `forEach` 代替传统 for 循环（视情况而定）
- 缓存数组长度

```javascript
// 优化前
for (let i = 0; i < array.length; i++) {
  // 每次循环都计算 array.length
}

// 优化后
const length = array.length;
for (let i = 0; i < length; i++) {
  // 只计算一次长度
}
```

**4. 内存管理**
- 及时清除定时器和事件监听器
- 避免循环引用
- 使用 WeakMap/WeakSet 处理弱引用
- 适当使用闭包，避免内存泄漏

**5. 异步操作优化**
- 使用 Promise.all 并行处理多个异步操作
- 使用 async/await 简化异步代码
- 避免阻塞主线程

**6. 代码组织优化**
- 模块化开发
- 代码分割和懒加载
- 使用 tree-shaking 移除未使用的代码

### 20. 如何处理 JavaScript 内存泄漏？

**答案：**
内存泄漏是指程序中已分配的内存由于某种原因未能释放或无法释放。

**常见的内存泄漏原因：**

**1. 意外的全局变量**
```javascript
// 没有使用 var/let/const 声明
function createGlobal() {
  globalVar = 'This is a global variable';
}
```

**2. 定时器和事件监听器未清除**
```javascript
function setup() {
  const element = document.getElementById('element');
  
  // 未清除的定时器
  setInterval(() => {
    // 操作
  }, 1000);
  
  // 未清除的事件监听器
  element.addEventListener('click', handleClick);
}
```

**3. 闭包引用未释放**
```javascript
function outer() {
  const largeData = new Array(1000000).fill('data');
  
  return function inner() {
    console.log('Inner function');
    // 即使不使用 largeData，闭包仍然会引用它
  };
}

const closure = outer();
```

**4. DOM 引用未清理**
```javascript
function createElement() {
  const element = document.getElementById('element');
  const data = { element: element };
  
  // 元素被移除后，data 对象仍然引用它
  document.body.removeChild(element);
}
```

**预防和解决方法：**
- 使用严格模式（strict mode）避免意外的全局变量
- 及时清除定时器（clearInterval/clearTimeout）
- 移除不再使用的事件监听器（removeEventListener）
- 避免不必要的闭包引用
- 使用 WeakMap/WeakSet 存储 DOM 引用
- 使用 Chrome DevTools 的 Memory 面板检测内存泄漏
- 定期检查和清理未使用的对象引用
