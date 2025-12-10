# JavaScript 基础知识目录内容规划

## 1. fundamentals/ - JavaScript 基础语法

**核心概念**：
- 变量声明（var、let、const）
- 数据类型简介
- 运算符基本使用
- 控制流基础
- 函数基础

**学习重点**：
- 理解不同变量声明方式的作用域和提升特性
- 掌握基本数据类型和引用数据类型的区别
- 学会使用基本的运算符和控制流语句

**示例代码**：
```javascript
// 变量声明示例
let message = "Hello, World!";
const PI = 3.14;
var counter = 0;

// 基本控制流
if (counter > 0) {
  console.log("Counter is positive");
} else {
  console.log("Counter is zero or negative");
}
```

## 2. data-types/ - 数据类型详解

**核心概念**：
- 原始数据类型（Number、String、Boolean、Undefined、Null、Symbol、BigInt）
- 引用数据类型（Object、Array、Function）
- 类型转换（显式转换、隐式转换）
- 类型检测（typeof、instanceof、Object.prototype.toString）

**学习重点**：
- 掌握每种数据类型的特性和使用场景
- 理解原始类型和引用类型的内存分配差异
- 学会正确进行类型转换和检测

**示例代码**：
```javascript
// 原始数据类型
let num = 42;            // Number
let str = "JavaScript";  // String
let bool = true;         // Boolean
let sym = Symbol("id");  // Symbol
let big = BigInt(9007199254740991n); // BigInt

// 引用数据类型
let obj = { name: "John" }; // Object
let arr = [1, 2, 3];        // Array
let func = () => {};        // Function

// 类型检测
console.log(typeof num);       // "number"
console.log(Array.isArray(arr)); // true
```

## 3. operators/ - 运算符

**核心概念**：
- 算术运算符
- 赋值运算符
- 比较运算符
- 逻辑运算符
- 三元运算符
- 位运算符
- typeof 运算符
- instanceof 运算符

**学习重点**：
- 掌握各种运算符的优先级
- 理解比较运算符（== vs ===）的区别
- 学会使用逻辑运算符进行条件判断

**示例代码**：
```javascript
// 算术运算符
let sum = 5 + 3;
let diff = 5 - 3;
let product = 5 * 3;
let quotient = 5 / 3;

// 比较运算符
console.log(5 == "5");  // true (宽松相等)
console.log(5 === "5"); // false (严格相等)

// 逻辑运算符
console.log(true && false); // false
console.log(true || false); // true

// 三元运算符
let result = (x > 10) ? "大于10" : "小于等于10";
```

## 4. control-flow/ - 控制流

**核心概念**：
- if-else 语句
- switch 语句
- for 循环
- while 循环
- do-while 循环
- for...of 循环（ES6+）
- for...in 循环
- break 和 continue 语句

**学习重点**：
- 学会使用不同的控制流语句处理各种逻辑场景
- 理解各种循环的适用场景
- 掌握循环控制语句的使用

**示例代码**：
```javascript
// if-else 语句
if (x > 10) {
  console.log("x is greater than 10");
} else if (x < 10) {
  console.log("x is less than 10");
} else {
  console.log("x is equal to 10");
}

// for 循环
for (let i = 0; i < 5; i++) {
  console.log(i);
}

// for...of 循环
for (const num of numbers) {
  console.log(num);
}

// switch 语句
switch (day) {
  case 'Monday':
    console.log('First day of the week');
    break;
  case 'Friday':
    console.log('Last day of the work week');
    break;
  default:
    console.log('Some other day');
}
```

## 5. functions/ - 函数

**核心概念**：
- 函数声明 vs 函数表达式
- 箭头函数（ES6+）
- 函数参数（默认参数、剩余参数、解构参数）
- 函数作用域和闭包
- this 关键字
- 高阶函数

**学习重点**：
- 理解不同函数定义方式的区别
- 掌握函数参数的各种特性
- 理解闭包和 this 的工作原理

**示例代码**：
```javascript
// 函数声明
function greet(name) {
  return `Hello, ${name}!`;
}

// 函数表达式
const greet = function(name) {
  return `Hello, ${name}!`;
};

// 箭头函数
const greet = name => `Hello, ${name}!`;

// 默认参数
function greet(name = 'Guest') {
  return `Hello, ${name}!`;
}

// 剩余参数
function sum(...numbers) {
  return numbers.reduce((acc, num) => acc + num, 0);
}
```

## 6. objects/ - 对象

**核心概念**：
- 对象字面量
- 对象属性访问
- 对象方法
- 构造函数
- 原型和原型链
- 类（ES6+）
- 继承

**学习重点**：
- 掌握对象的创建和属性访问方式
- 理解原型和原型链的工作原理
- 学会使用类和继承

**示例代码**：
```javascript
// 对象字面量
const person = {
  name: 'John',
  age: 30,
  greet() {
    return `Hello, ${this.name}!`;
  }
};

// 构造函数
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.greet = function() {
  return `Hello, ${this.name}!`;
};

// ES6 类
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    return `Hello, ${this.name}!`;
  }
}
```

## 7. arrays/ - 数组

**核心概念**：
- 数组创建方式
- 数组元素访问
- 数组遍历方法（forEach, map, filter, reduce 等）
- 数组操作方法（push, pop, shift, unshift, slice, splice 等）
- 数组排序和搜索
- 数组迭代器（ES6+）

**学习重点**：
- 掌握各种数组方法的使用场景
- 学会使用数组遍历和转换方法
- 理解数组操作的性能影响

**示例代码**：
```javascript
// 数组创建
const numbers = [1, 2, 3, 4, 5];

// 数组遍历
numbers.forEach(num => console.log(num));

// 数组转换
const doubled = numbers.map(num => num * 2);
const evenNumbers = numbers.filter(num => num % 2 === 0);

// 数组聚合
const sum = numbers.reduce((acc, num) => acc + num, 0);

// 数组操作
numbers.push(6); // 添加到末尾
numbers.pop();   // 移除末尾元素
const sliced = numbers.slice(1, 3); // 切片
```

## 8. es6+/ - ES6+ 特性

**核心概念**：
- 解构赋值
- 模板字符串
- 扩展运算符
- 剩余参数
- 箭头函数
- 类
- 模块（import/export）
- 集合（Set, Map, WeakSet, WeakMap）
- 迭代器和生成器
- Promise
- async/await

**学习重点**：
- 掌握ES6+的核心特性
- 学会使用新特性提高代码效率
- 理解新特性的工作原理

**示例代码**：
```javascript
// 解构赋值
const { name, age } = person;
const [first, second] = numbers;

// 模板字符串
const greeting = `Hello, ${name}! You are ${age} years old.`;

// 扩展运算符
const newNumbers = [...numbers, 6, 7, 8];
const newPerson = { ...person, city: 'New York' };

// 箭头函数
const multiply = (a, b) => a * b;

// 集合
const set = new Set([1, 2, 3, 3, 4]); // 自动去重
const map = new Map([['name', 'John'], ['age', 30]]);
```

## 9. async-patterns/ - 异步编程模式

**核心概念**：
- 同步 vs 异步
- 回调函数
- Promise
- async/await
- 事件循环
- 宏任务和微任务

**学习重点**：
- 理解异步编程的基本概念
- 掌握不同异步编程模式的使用
- 理解事件循环的工作原理

**示例代码**：
```javascript
// 回调函数
function fetchData(callback) {
  setTimeout(() => {
    const data = { name: 'John' };
    callback(null, data);
  }, 1000);
}

// Promise
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ name: 'John' });
    }, 1000);
  });
}

// async/await
async function fetchData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ name: 'John' });
    }, 1000);
  });
}

async function main() {
  try {
    const data = await fetchData();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
```

## 10. dom/ - DOM 操作

**核心概念**：
- DOM 结构和节点类型
- 元素选择方法（getElementById, querySelector 等）
- 元素属性操作
- 元素内容操作
- 元素样式操作
- DOM 遍历和导航
- DOM 操作性能

**学习重点**：
- 掌握各种 DOM 选择器的使用
- 学会操作 DOM 元素的属性、内容和样式
- 理解 DOM 操作的性能影响

**示例代码**：
```javascript
// 元素选择
const element = document.getElementById('myElement');
const elements = document.querySelectorAll('.myClass');

// 属性操作
element.setAttribute('class', 'newClass');
const className = element.getAttribute('class');

// 内容操作
element.textContent = 'New content';
element.innerHTML = '<strong>Bold content</strong>';

// 样式操作
element.style.color = 'red';
element.style.fontSize = '16px';
```

## 11. events/ - 事件处理

**核心概念**：
- 事件类型（鼠标事件、键盘事件、表单事件等）
- 事件监听器（addEventListener）
- 事件对象
- 事件冒泡和捕获
- 事件委托
- 事件触发

**学习重点**：
- 掌握不同类型事件的使用
- 学会使用事件监听器处理事件
- 理解事件冒泡和捕获机制
- 掌握事件委托的实现

**示例代码**：
```javascript
// 事件监听器
const button = document.getElementById('myButton');
button.addEventListener('click', (event) => {
  console.log('Button clicked:', event.target);
});

// 事件冒泡和捕获
button.addEventListener('click', handleClick, { capture: true });

// 事件委托
const list = document.getElementById('myList');
list.addEventListener('click', (event) => {
  if (event.target.tagName === 'LI') {
    console.log('List item clicked:', event.target.textContent);
  }
});
```

## 12. modules/ - 模块化

**核心概念**：
- 模块化的概念和优势
- CommonJS 模块（Node.js）
- ES 模块（import/export）
- 模块导出和导入方式
- 模块加载机制

**学习重点**：
- 理解模块化的概念和优势
- 掌握 ES 模块的导出和导入方式
- 了解不同模块系统的差异

**示例代码**：
```javascript
// 模块导出
// circle.js
export const PI = 3.14;

export function calculateArea(radius) {
  return PI * radius * radius;
}

export default class Circle {
  constructor(radius) {
    this.radius = radius;
  }
  
  get area() {
    return calculateArea(this.radius);
  }
}

// 模块导入
// main.js
import Circle, { PI, calculateArea } from './circle.js';

const circle = new Circle(5);
console.log(circle.area); // 78.5
```

## 13. error-handling/ - 错误处理

**核心概念**：
- 错误类型（SyntaxError, ReferenceError, TypeError 等）
- try-catch-finally 语句
- throw 语句
- 错误对象
- 自定义错误
- 异步错误处理

**学习重点**：
- 了解常见的错误类型
- 学会使用 try-catch-finally 处理错误
- 掌握异步错误处理的方法

**示例代码**：
```javascript
// try-catch-finally
try {
  // 可能会抛出错误的代码
  const result = riskyOperation();
} catch (error) {
  // 处理错误
  console.error('An error occurred:', error.message);
} finally {
  // 无论是否发生错误都会执行的代码
  console.log('Operation completed.');
}

// 自定义错误
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

// 抛出错误
function validateInput(input) {
  if (!input) {
    throw new ValidationError('Input is required');
  }
}
```

## 14. performance/ - 性能优化

**核心概念**：
- JavaScript 性能瓶颈
- 代码优化技巧
- DOM 操作优化
- 事件处理优化
- 内存管理
- 性能测试工具

**学习重点**：
- 理解常见的性能瓶颈
- 掌握基本的性能优化技巧
- 学会使用性能测试工具

**示例代码**：
```javascript
// 防抖
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// 节流
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

// DOM 操作优化
function updateElements(elements, newText) {
  // 创建文档片段
  const fragment = document.createDocumentFragment();
  
  elements.forEach(element => {
    const newElement = document.createElement('div');
    newElement.textContent = newText;
    fragment.appendChild(newElement);
  });
  
  // 一次性添加到 DOM
  document.body.appendChild(fragment);
}
```

## 15. debugging/ - 调试技巧

**核心概念**：
- 浏览器开发者工具
- console 方法（log, warn, error, table 等）
- 断点调试
- 调试器语句（debugger）
- 性能分析
- 内存分析

**学习重点**：
- 掌握浏览器开发者工具的使用
- 学会使用各种 console 方法进行调试
- 理解断点调试的流程
- 学会使用性能和内存分析工具

**示例代码**：
```javascript
// console 方法
console.log('Regular log');
console.warn('Warning message');
console.error('Error message');
console.table([{ name: 'John', age: 30 }, { name: 'Jane', age: 25 }]);

// 性能测量
console.time('Operation');
// 执行操作
console.timeEnd('Operation');

// 调试器语句
debugger;

// 条件断点
for (let i = 0; i < 10; i++) {
  // 在开发者工具中设置条件：i === 5
  console.log(i);
}
```

## 学习路径建议

1. **基础阶段**：fundamentals → data-types → operators → control-flow
2. **核心阶段**：functions → objects → arrays
3. **进阶阶段**：es6+ → async-patterns → modules
4. **应用阶段**：dom → events → error-handling
5. **优化阶段**：performance → debugging

## 学习资源

1. **MDN Web Docs**：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript
2. **JavaScript.info**：https://zh.javascript.info/
3. **ECMAScript 规范**：https://tc39.es/ecma262/
4. **你不知道的 JavaScript**（书籍）
5. **JavaScript 高级程序设计**（书籍）
