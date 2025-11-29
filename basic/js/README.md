# JavaScript 基础知识

JavaScript 是一门广泛应用于网页交互的脚本语言，同时也是全栈开发的核心语言之一。本文档涵盖 JavaScript 的核心概念和常见用法。

## 基础语法

### 变量声明

```javascript
// var (函数作用域，存在变量提升)
var a = 10;

// let (块级作用域，无变量提升)
let b = 20;

// const (块级作用域，常量，不可重新赋值)
const c = 30;
```

### 数据类型

```javascript
// 原始类型
let num = 10;           // 数字
let str = 'hello';      // 字符串
let bool = true;        // 布尔值
let undef = undefined;  // undefined
let n = null;           // null
let sym = Symbol('id'); // Symbol
let big = BigInt(9007199254740991n); // BigInt

// 引用类型
let arr = [1, 2, 3];     // 数组
let obj = { name: 'John' }; // 对象
let func = function() {}; // 函数
```

### 运算符

```javascript
// 算术运算符
let sum = 5 + 3;
let diff = 5 - 3;
let product = 5 * 3;
let quotient = 5 / 3;
let remainder = 5 % 3;

// 赋值运算符
let x = 10;
x += 5;

// 比较运算符
console.log(5 > 3);  // true
console.log(5 == '5'); // true (宽松相等)
console.log(5 === '5'); // false (严格相等)

// 逻辑运算符
console.log(true && false); // false
console.log(true || false); // true
console.log(!true); // false
```

## 函数

### 函数声明

```javascript
function greet(name) {
  return `Hello, ${name}!`;
}
```

### 函数表达式

```javascript
const greet = function(name) {
  return `Hello, ${name}!`;
};
```

### 箭头函数

```javascript
const greet = (name) => {
  return `Hello, ${name}!`;
};

// 简化形式
const greet = name => `Hello, ${name}!`;
```

### 函数参数

```javascript
// 默认参数
function greet(name = 'Guest') {
  return `Hello, ${name}!`;
}

// 剩余参数
function sum(...numbers) {
  return numbers.reduce((acc, num) => acc + num, 0);
}

// 解构参数
function greet({ name, age }) {
  return `Hello, ${name}! You are ${age} years old.`;
}
```

## 对象

### 对象字面量

```javascript
const person = {
  name: 'John',
  age: 30,
  greet: function() {
    return `Hello, ${this.name}!`;
  }
};

// 方法简写
const person = {
  name: 'John',
  age: 30,
  greet() {
    return `Hello, ${this.name}!`;
  }
};
```

### 对象属性访问

```javascript
// 点表示法
console.log(person.name);

// 方括号表示法
console.log(person['name']);

// 动态属性
const prop = 'name';
console.log(person[prop]);
```

### 构造函数

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.greet = function() {
  return `Hello, ${this.name}!`;
};

const person = new Person('John', 30);
```

### 类

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    return `Hello, ${this.name}!`;
  }
}

const person = new Person('John', 30);
```

## 数组

### 数组创建

```javascript
const arr1 = [1, 2, 3];
const arr2 = new Array(1, 2, 3);
const arr3 = Array.of(1, 2, 3);
```

### 数组方法

```javascript
const numbers = [1, 2, 3, 4, 5];

// 遍历方法
numbers.forEach(num => console.log(num));
const doubled = numbers.map(num => num * 2);
const evenNumbers = numbers.filter(num => num % 2 === 0);
const sum = numbers.reduce((acc, num) => acc + num, 0);

// 查找方法
const found = numbers.find(num => num > 3);
const index = numbers.findIndex(num => num > 3);

// 数组操作
numbers.push(6); // 添加到末尾
numbers.pop(); // 移除末尾元素
numbers.unshift(0); // 添加到开头
numbers.shift(); // 移除开头元素
const sliced = numbers.slice(1, 3); // 切片
const spliced = numbers.splice(1, 1, 99); // 替换

// 数组排序
numbers.sort((a, b) => a - b); // 升序排序

// 数组连接
const newArray = numbers.concat([6, 7, 8]);
```

## 控制流

### 条件语句

```javascript
// if-else 语句
if (x > 10) {
  console.log('x is greater than 10');
} else if (x < 10) {
  console.log('x is less than 10');
} else {
  console.log('x is equal to 10');
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

### 循环

```javascript
// for 循环
for (let i = 0; i < 5; i++) {
  console.log(i);
}

// for...of 循环 (ES6+)
for (const num of numbers) {
  console.log(num);
}

// for...in 循环 (遍历对象属性)
for (const key in person) {
  console.log(`${key}: ${person[key]}`);
}

// while 循环
let i = 0;
while (i < 5) {
  console.log(i);
  i++;
}

// do...while 循环
let j = 0;
do {
  console.log(j);
  j++;
} while (j < 5);
```

## 异步编程

### 回调函数

```javascript
function fetchData(callback) {
  setTimeout(() => {
    const data = { name: 'John' };
    callback(null, data);
  }, 1000);
}

fetchData((error, data) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log(data);
});
```

### Promise

```javascript
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = { name: 'John' };
      // resolve(data);
      // 或者 reject(new Error('Failed to fetch data'));
      resolve(data);
    }, 1000);
  });
}

fetchData()
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

### async/await

```javascript
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

main();
```

## ES6+ 特性

### 解构赋值

```javascript
// 对象解构
const { name, age } = person;

// 数组解构
const [first, second] = numbers;

// 默认值
const { name = 'Guest' } = person;

// 重命名
const { name: fullName } = person;
```

### 模板字符串

```javascript
const greeting = `Hello, ${name}! You are ${age} years old.`;
```

### 扩展运算符

```javascript
// 数组扩展
const newNumbers = [...numbers, 6, 7, 8];

// 对象扩展
const newPerson = { ...person, city: 'New York' };
```

### 集合

```javascript
// Set
const set = new Set([1, 2, 3, 3, 4]); // 自动去重
set.add(5);
set.has(3); // true
set.delete(3);
set.size; // 4

// Map
const map = new Map();
map.set('name', 'John');
map.get('name'); // 'John'
map.has('name'); // true
map.delete('name');
map.size; // 0
```

### 迭代器和生成器

```javascript
// 生成器函数
function* generateNumbers() {
  yield 1;
  yield 2;
  yield 3;
}

const iterator = generateNumbers();
console.log(iterator.next().value); // 1
console.log(iterator.next().value); // 2
console.log(iterator.next().value); // 3
```

## 模块化

### ES 模块

```javascript
// 导出
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

// 导入
import Circle, { PI, calculateArea } from './circle.js';
```

## 错误处理

```javascript
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
```

## 常见设计模式

### 单例模式

```javascript
const Singleton = (function() {
  let instance;
  
  function createInstance() {
    return { id: Math.random() };
  }
  
  return {
    getInstance: function() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();
```

### 工厂模式

```javascript
function createPerson(name, type) {
  if (type === 'student') {
    return { name, type, study: () => console.log('Studying...') };
  } else if (type === 'teacher') {
    return { name, type, teach: () => console.log('Teaching...') };
  }
}
```

## 性能优化技巧

1. **避免不必要的 DOM 操作**：使用文档片段和虚拟 DOM
2. **使用事件委托**：减少事件监听器数量
3. **避免闭包过度使用**：可能导致内存泄漏
4. **使用防抖和节流**：优化高频事件处理
5. **懒加载资源**：延迟加载非关键资源

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
```

## 调试技巧

1. **使用 console.log()**：基础调试方法
2. **使用断点**：在浏览器开发工具中设置断点
3. **使用 debugger 语句**：代码中直接添加断点
4. **使用 console.table()**：以表格形式显示数据
5. **使用 console.time()/console.timeEnd()**：测量代码执行时间

```javascript
console.time('Operation');
// 执行操作
console.timeEnd('Operation');

console.table([{ name: 'John', age: 30 }, { name: 'Jane', age: 25 }]);

// 在关键位置添加 debugger 语句
debugger;
```

## 最佳实践

1. **使用严格模式**：`'use strict';`
2. **避免使用全局变量**：使用模块或闭包
3. **使用 const 和 let，避免 var**：减少作用域问题
4. **使用 === 而不是 ==**：避免类型转换问题
5. **遵循一致的命名约定**：驼峰命名法
6. **使用 JSDoc 注释**：提高代码可读性
7. **保持函数简洁**：单一职责原则
8. **使用 ES6+ 特性**：提高代码简洁性和可读性

```javascript
/**
 * 计算两个数字的和
 * @param {number} a - 第一个数字
 * @param {number} b - 第二个数字
 * @returns {number} 两个数字的和
 */
function add(a, b) {
  return a + b;
}
```

---

以上是 JavaScript 基础知识的概览，涵盖了从基础语法到高级特性的核心内容。JavaScript 是一门不断发展的语言，建议定期关注最新的 ECMAScript 规范更新。