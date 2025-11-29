# ES6+ 新特性

## 目录

- [简介](#简介)
- [let 和 const](#let-和-const)
- [箭头函数](#箭头函数)
- [模板字符串](#模板字符串)
- [解构赋值](#解构赋值)
- [展开运算符](#展开运算符)
- [默认参数](#默认参数)
- [剩余参数](#剩余参数)
- [类和继承](#类和继承)
- [模块](#模块)
- [Promise](#promise)
- [async/await](#asyncawait)
- [数组新方法](#数组新方法)
- [对象新特性](#对象新特性)
- [Map 和 Set](#map-和-set)
- [Symbol](#symbol)
- [Proxy 和 Reflect](#proxy-和-reflect)
- [生成器](#生成器)
- [迭代器](#迭代器)
- [装饰器](#装饰器)

## 简介

ES6（ECMAScript 2015）是 JavaScript 的第六个主要版本，引入了许多新特性和语法改进，使 JavaScript 更强大、更易于维护。随后的版本（ES7/ES2016、ES8/ES2017、ES9/ES2018 等）继续扩展了语言功能，这些版本通常被统称为 ES6+。

## let 和 const

ES6 引入了 `let` 和 `const` 关键字，用于声明变量，替代 `var`。

```javascript
// 使用 let 声明变量（可变）
let count = 0;
count = 1; // 允许

// 使用 const 声明常量（不可变）
const PI = 3.14159;
// PI = 3.14; // 不允许，会抛出错误

// 块级作用域（var 是函数作用域）
if (true) {
  let blockVar = 'block scope';
  const blockConst = 'also block scope';
  var functionVar = 'function scope';
}
console.log(blockVar); // 抛出错误，blockVar 只在块内可见
console.log(functionVar); // 正常输出 'function scope'
```

## 箭头函数

箭头函数提供了更简洁的函数语法，并改变了 `this` 的绑定行为。

```javascript
// 基本语法
const add = (a, b) => a + b;

// 多行函数体需要使用花括号和 return
const multiply = (a, b) => {
  return a * b;
};

// 单个参数可以省略括号
const square = x => x * x;

// 无参数需要使用括号
const greet = () => 'Hello!';

// this 的行为与普通函数不同
const person = {
  name: 'John',
  age: 30,
  // 箭头函数中的 this 继承自父作用域
  greet: function() {
    const sayHello = () => {
      console.log(`Hello, my name is ${this.name}`);
    };
    sayHello();
  }
};
person.greet(); // 输出: Hello, my name is John
```

## 模板字符串

模板字符串使用反引号（\`），允许在字符串中嵌入表达式。

```javascript
const name = 'Alice';
const age = 25;

// 基本用法
const greeting = `Hello, my name is ${name}`;
console.log(greeting); // 输出: Hello, my name is Alice

// 多行字符串
const multiLine = `
  This is a
  multi-line
  string
`;

// 表达式
const result = `1 + 1 = ${1 + 1}`;
console.log(result); // 输出: 1 + 1 = 2

// 标签模板
function highlight(strings, ...values) {
  let result = '';
  strings.forEach((str, i) => {
    result += str;
    if (i < values.length) {
      result += `<span style="color: red">${values[i]}</span>`;
    }
  });
  return result;
}

const message = highlight`My name is ${name} and I am ${age} years old.`;
// 输出: My name is <span style="color: red">Alice</span> and I am <span style="color: red">25</span> years old.
```

## 解构赋值

解构赋值允许从数组或对象中提取值，并赋值给变量。

### 数组解构

```javascript
const [a, b] = [1, 2];
console.log(a); // 1
console.log(b); // 2

// 跳过某些元素
const [c, , d] = [3, 4, 5];
console.log(c); // 3
console.log(d); // 5

// 剩余元素
const [e, ...f] = [6, 7, 8];
console.log(e); // 6
console.log(f); // [7, 8]

// 默认值
const [g, h = 10] = [9];
console.log(g); // 9
console.log(h); // 10
```

### 对象解构

```javascript
const person = { name: 'Bob', age: 35, city: 'New York' };

// 基本用法
const { name, age } = person;
console.log(name); // Bob
console.log(age); // 35

// 重命名属性
const { city: location } = person;
console.log(location); // New York

// 默认值
const { country = 'Unknown' } = person;
console.log(country); // Unknown

// 嵌套对象解构
const user = {
  id: 1,
  profile: {
    firstName: 'Jane',
    lastName: 'Doe'
  }
};
const { profile: { firstName, lastName } } = user;
console.log(firstName); // Jane
console.log(lastName); // Doe
```

## 展开运算符

展开运算符（`...`）允许将数组或对象展开为单独的元素。

### 数组展开

```javascript
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

// 合并数组
const merged = [...arr1, ...arr2];
console.log(merged); // [1, 2, 3, 4, 5, 6]

// 创建数组副本
const copy = [...arr1];
console.log(copy); // [1, 2, 3]

// 将数组作为参数传递给函数
function sum(a, b, c) {
  return a + b + c;
}
console.log(sum(...arr1)); // 6
```

### 对象展开

```javascript
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };

// 合并对象
const mergedObj = { ...obj1, ...obj2 };
console.log(mergedObj); // { a: 1, b: 2, c: 3, d: 4 }

// 属性冲突（后一个对象的属性会覆盖前一个）
const obj3 = { a: 5, e: 6 };
const conflict = { ...obj1, ...obj3 };
console.log(conflict); // { a: 5, b: 2, e: 6 }

// 创建对象副本
const objCopy = { ...obj1 };
console.log(objCopy); // { a: 1, b: 2 }
```

## 默认参数

函数可以定义默认参数值。

```javascript
function greet(name = 'Guest', message = 'Hello') {
  return `${message}, ${name}!`;
}

console.log(greet()); // Hello, Guest!
console.log(greet('Alice')); // Hello, Alice!
console.log(greet('Bob', 'Hi')); // Hi, Bob!

// 默认参数也可以是表达式
function calculateDiscount(price, discount = price * 0.1) {
  return price - discount;
}

console.log(calculateDiscount(100)); // 90
console.log(calculateDiscount(100, 20)); // 80
```

## 剩余参数

剩余参数（`...`）允许将多个参数收集到一个数组中。

```javascript
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

console.log(sum(1, 2, 3)); // 6
console.log(sum(1, 2, 3, 4, 5)); // 15

// 与其他参数结合使用
function logUser(name, ...hobbies) {
  console.log(`${name}'s hobbies: ${hobbies.join(', ')}`);
}

logUser('Charlie', 'reading', 'coding', 'gaming');
// 输出: Charlie's hobbies: reading, coding, gaming
```

## 类和继承

ES6 引入了类的概念，使面向对象编程更直观。

### 基本类定义

```javascript
class Person {
  // 构造函数
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  // 实例方法
  greet() {
    return `Hello, my name is ${this.name}.`;
  }
  
  // 静态方法
  static isAdult(age) {
    return age >= 18;
  }
}

// 创建实例
const person1 = new Person('David', 28);
console.log(person1.greet()); // Hello, my name is David.
console.log(Person.isAdult(person1.age)); // true
```

### 继承

```javascript
class Employee extends Person {
  constructor(name, age, jobTitle) {
    // 调用父类构造函数
    super(name, age);
    this.jobTitle = jobTitle;
  }
  
  // 重写父类方法
  greet() {
    // 调用父类方法
    return `${super.greet()} I am a ${this.jobTitle}.`;
  }
  
  // 新方法
  work() {
    return `${this.name} is working...`;
  }
}

const employee = new Employee('Emma', 32, 'Developer');
console.log(employee.greet()); // Hello, my name is Emma. I am a Developer.
console.log(employee.work()); // Emma is working...
```

### 类的属性

```javascript
class Circle {
  // 公共字段（ES2022）
  static pi = 3.14159;
  radius;
  
  constructor(radius) {
    this.radius = radius;
  }
  
  // 访问器（getter）
  get area() {
    return Circle.pi * this.radius * this.radius;
  }
  
  // 设置器（setter）
  set diameter(diameter) {
    this.radius = diameter / 2;
  }
  
  get diameter() {
    return this.radius * 2;
  }
}

const circle = new Circle(5);
console.log(circle.area); // 78.53975
console.log(circle.diameter); // 10
circle.diameter = 14;
console.log(circle.radius); // 7
```

## 模块

ES6 引入了模块系统，允许将代码分割成独立的文件。

### 导出

```javascript
// math.js

// 命名导出
export const PI = 3.14159;

export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

// 默认导出
const multiply = (a, b) => a * b;
export default multiply;
```

### 导入

```javascript
// app.js

// 导入默认导出
import multiply from './math.js';

// 导入命名导出
import { add, subtract, PI } from './math.js';

// 重命名导入
import { add as sum } from './math.js';

// 导入所有命名导出
import * as MathUtils from './math.js';

console.log(add(5, 3)); // 8
console.log(subtract(10, 4)); // 6
console.log(multiply(2, 6)); // 12
console.log(PI); // 3.14159
console.log(sum(1, 9)); // 10
console.log(MathUtils.add(7, 8)); // 15
```

## Promise

Promise 是一种处理异步操作的对象，避免回调地狱。

### 基本用法

```javascript
const promise = new Promise((resolve, reject) => {
  // 异步操作
  setTimeout(() => {
    const success = true;
    if (success) {
      resolve('操作成功');
    } else {
      reject(new Error('操作失败'));
    }
  }, 1000);
});

// 处理 Promise
promise
  .then(result => {
    console.log(result); // 操作成功
  })
  .catch(error => {
    console.error(error); // Error: 操作失败
  })
  .finally(() => {
    console.log('无论成功失败都会执行');
  });
```

### Promise 链式调用

```javascript
function firstStep() {
  return new Promise(resolve => {
    setTimeout(() => resolve('第一步完成'), 1000);
  });
}

function secondStep(data) {
  return new Promise(resolve => {
    setTimeout(() => resolve(`${data} -> 第二步完成`), 1000);
  });
}

function thirdStep(data) {
  return new Promise(resolve => {
    setTimeout(() => resolve(`${data} -> 第三步完成`), 1000);
  });
}

firstStep()
  .then(secondStep)
  .then(thirdStep)
  .then(result => {
    console.log(result); // 第一步完成 -> 第二步完成 -> 第三步完成
  });
```

### Promise 辅助方法

```javascript
// Promise.all - 所有操作都成功才成功，一个失败就失败
const promise1 = Promise.resolve(1);
const promise2 = Promise.resolve(2);
const promise3 = Promise.reject('错误');

Promise.all([promise1, promise2])
  .then(results => {
    console.log(results); // [1, 2]
  });

Promise.all([promise1, promise3])
  .catch(error => {
    console.error(error); // 错误
  });

// Promise.race - 返回第一个完成的 Promise
const fastPromise = new Promise(resolve => {
  setTimeout(() => resolve('快的完成了'), 500);
});

const slowPromise = new Promise(resolve => {
  setTimeout(() => resolve('慢的完成了'), 1500);
});

Promise.race([fastPromise, slowPromise])
  .then(result => {
    console.log(result); // 快的完成了
  });

// Promise.allSettled - 返回所有 Promise 的结果，无论成功失败
Promise.allSettled([promise1, promise3])
  .then(results => {
    console.log(results);
    /* [
      { status: 'fulfilled', value: 1 },
      { status: 'rejected', reason: '错误' }
    ] */
  });

// Promise.any - 返回第一个成功的 Promise，如果所有都失败则抛出异常
const failPromise1 = Promise.reject('失败1');
const failPromise2 = Promise.reject('失败2');
const successPromise = Promise.resolve('成功了');

Promise.any([failPromise1, successPromise])
  .then(result => {
    console.log(result); // 成功了
  });
```

## async/await

`async/await` 提供了一种更简洁的方式来处理 Promise。

### 基本用法

```javascript
// 定义异步函数
async function fetchData() {
  // await 等待 Promise 完成
  const response = await fetch('https://api.example.com/data');
  const data = await response.json();
  return data;
}

// 使用异步函数
fetchData()
  .then(data => console.log(data))
  .catch(error => console.error(error));

// 在异步函数中使用 try/catch 处理错误
async function getData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('获取数据失败:', error);
  }
}
```

### 并行执行

```javascript
async function fetchAllData() {
  // 同时开始所有请求
  const promise1 = fetch('https://api.example.com/endpoint1').then(res => res.json());
  const promise2 = fetch('https://api.example.com/endpoint2').then(res => res.json());
  const promise3 = fetch('https://api.example.com/endpoint3').then(res => res.json());
  
  // 等待所有请求完成
  const [data1, data2, data3] = await Promise.all([promise1, promise2, promise3]);
  
  return { data1, data2, data3 };
}
```

## 数组新方法

### 遍历方法

```javascript
const numbers = [1, 2, 3, 4, 5];

// forEach - 遍历数组
numbers.forEach((num, index) => {
  console.log(`第${index + 1}个元素: ${num}`);
});

// map - 创建新数组
const doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// filter - 过滤元素
const evenNumbers = numbers.filter(num => num % 2 === 0);
console.log(evenNumbers); // [2, 4]

// reduce - 累加计算
const sum = numbers.reduce((total, num) => total + num, 0);
console.log(sum); // 15

// find - 查找第一个匹配元素
const firstEven = numbers.find(num => num % 2 === 0);
console.log(firstEven); // 2

// findIndex - 查找第一个匹配元素的索引
const firstEvenIndex = numbers.findIndex(num => num % 2 === 0);
console.log(firstEvenIndex); // 1

// some - 检查是否至少有一个元素匹配
const hasEven = numbers.some(num => num % 2 === 0);
console.log(hasEven); // true

// every - 检查是否所有元素都匹配
const allPositive = numbers.every(num => num > 0);
console.log(allPositive); // true
```

### 其他数组方法

```javascript
// includes - 检查数组是否包含某个元素
const array = [1, 2, 3, 4, 5];
console.log(array.includes(3)); // true
console.log(array.includes(6)); // false

// flat - 扁平化数组
const nestedArray = [1, [2, [3, [4]]]];
console.log(nestedArray.flat()); // [1, 2, [3, [4]]]
console.log(nestedArray.flat(2)); // [1, 2, 3, [4]]
console.log(nestedArray.flat(Infinity)); // [1, 2, 3, 4]

// flatMap - 先 map 后 flat
const phrases = ['hello world', 'javascript is fun'];
const words = phrases.flatMap(phrase => phrase.split(' '));
console.log(words); // ['hello', 'world', 'javascript', 'is', 'fun']

// from - 从类数组或可迭代对象创建数组
const nodeList = document.querySelectorAll('div');
const divArray = Array.from(nodeList);

// of - 创建数组
const arr = Array.of(1, 2, 3);
console.log(arr); // [1, 2, 3]

// fill - 填充数组
const filledArray = new Array(5).fill(0);
console.log(filledArray); // [0, 0, 0, 0, 0]
```

## 对象新特性

### 对象字面量增强

```javascript
// 简写属性名
const name = 'Tom';
const age = 30;
const person = { name, age };
console.log(person); // { name: 'Tom', age: 30 }

// 简写方法名
const calculator = {
  add(a, b) {
    return a + b;
  },
  subtract(a, b) {
    return a - b;
  }
};

// 计算属性名
const propertyName = 'greeting';
const obj = {
  [propertyName]: 'Hello',
  [`${propertyName}Message`]: 'How are you?'
};
console.log(obj); // { greeting: 'Hello', greetingMessage: 'How are you?' }
```

### 对象方法

```javascript
const obj1 = { a: 1, b: 2 };
const obj2 = { b: 3, c: 4 };

// Object.assign - 复制对象属性
const merged = Object.assign({}, obj1, obj2);
console.log(merged); // { a: 1, b: 3, c: 4 }

// Object.keys - 获取对象的键
const keys = Object.keys(obj1);
console.log(keys); // ['a', 'b']

// Object.values - 获取对象的值
const values = Object.values(obj1);
console.log(values); // [1, 2]

// Object.entries - 获取对象的键值对
const entries = Object.entries(obj1);
console.log(entries); // [['a', 1], ['b', 2]]

// Object.fromEntries - 从键值对创建对象
const newObj = Object.fromEntries([['x', 10], ['y', 20]]);
console.log(newObj); // { x: 10, y: 20 }

// Object.freeze - 冻结对象（不能修改、添加、删除属性）
const frozen = Object.freeze({ value: 1 });
frozen.value = 2; // 不生效
console.log(frozen.value); // 1

// Object.seal - 密封对象（可以修改现有属性，但不能添加或删除属性）
const sealed = Object.seal({ value: 1 });
sealed.value = 2; // 生效
sealed.newProp = 3; // 不生效
console.log(sealed); // { value: 2 }
```

## Map 和 Set

### Map

Map 是一种键值对集合，键可以是任何类型。

```javascript
// 创建 Map
const map = new Map();

// 添加元素
map.set('key1', 'value1');
map.set(42, 'the answer');
map.set(true, 'boolean value');
const objKey = { name: 'object key' };
map.set(objKey, 'object value');

// 获取元素
console.log(map.get('key1')); // value1
console.log(map.get(objKey)); // object value

// 检查键是否存在
console.log(map.has('key1')); // true

// 删除元素
map.delete('key1');

// 获取大小
console.log(map.size); // 3

// 遍历
map.forEach((value, key) => {
  console.log(`${key}: ${value}`);
});

// 转换为数组
const mapArray = Array.from(map);
console.log(mapArray);
/* [
  [42, 'the answer'],
  [true, 'boolean value'],
  [{ name: 'object key' }, 'object value']
] */
```

### Set

Set 是一种不允许重复元素的集合。

```javascript
// 创建 Set
const set = new Set();

// 添加元素
set.add('item1');
set.add('item2');
set.add('item1'); // 重复，不会被添加

// 从数组创建
const arraySet = new Set([1, 2, 3, 3, 4]);
console.log(arraySet); // Set { 1, 2, 3, 4 }

// 检查元素是否存在
console.log(set.has('item1')); // true

// 删除元素
set.delete('item1');

// 获取大小
console.log(set.size); // 1

// 清空
set.clear();

// 遍历
const numberSet = new Set([1, 2, 3]);
numberSet.forEach(num => {
  console.log(num);
});

// 转换为数组
const setArray = Array.from(numberSet);
console.log(setArray); // [1, 2, 3]

// 使用 Set 去重
const duplicates = [1, 2, 2, 3, 4, 4, 5];
const unique = [...new Set(duplicates)];
console.log(unique); // [1, 2, 3, 4, 5]
```

## Symbol

Symbol 是一种新的原始数据类型，表示唯一的标识符。

```javascript
// 创建 Symbol
const symbol1 = Symbol();
const symbol2 = Symbol('description');
const symbol3 = Symbol('description');

console.log(symbol1 === symbol2); // false
console.log(symbol2 === symbol3); // false

// 使用 Symbol 作为对象属性
const obj = {
  [symbol1]: 'value1',
  [symbol2]: 'value2'
};

console.log(obj[symbol1]); // value1
console.log(Object.keys(obj)); // [] - Symbol 属性不会出现在常规的对象遍历中
console.log(Object.getOwnPropertySymbols(obj)); // [Symbol(), Symbol(description)]

// Symbol.for - 创建共享的 Symbol
const globalSymbol1 = Symbol.for('shared');
const globalSymbol2 = Symbol.for('shared');
console.log(globalSymbol1 === globalSymbol2); // true

// Symbol.keyFor - 获取共享 Symbol 的键
console.log(Symbol.keyFor(globalSymbol1)); // 'shared'
console.log(Symbol.keyFor(symbol1)); // undefined - 非共享 Symbol
```

## Proxy 和 Reflect

### Proxy

Proxy 允许拦截和自定义对象的基本操作。

```javascript
const target = {
  name: 'John',
  age: 30
};

const handler = {
  // 拦截属性读取
  get(target, property) {
    console.log(`访问属性: ${String(property)}`);
    return property in target ? target[property] : '属性不存在';
  },
  
  // 拦截属性设置
  set(target, property, value) {
    console.log(`设置属性: ${String(property)} = ${value}`);
    if (property === 'age' && typeof value !== 'number') {
      throw new Error('年龄必须是数字');
    }
    target[property] = value;
    return true;
  },
  
  // 拦截属性删除
  deleteProperty(target, property) {
    console.log(`删除属性: ${String(property)}`);
    if (property === 'name') {
      throw new Error('无法删除 name 属性');
    }
    delete target[property];
    return true;
  }
};

const proxy = new Proxy(target, handler);

console.log(proxy.name); // 访问属性: name // John
console.log(proxy.email); // 访问属性: email // 属性不存在

proxy.age = 31; // 设置属性: age = 31
// proxy.age = 'thirty'; // 抛出错误: 年龄必须是数字

// delete proxy.name; // 抛出错误: 无法删除 name 属性
```

### Reflect

Reflect 提供了一组用于操作对象的静态方法，这些方法与 Proxy 的处理器方法相对应。

```javascript
const obj = {
  name: 'Jane',
  age: 25
};

// 使用 Reflect 获取属性
console.log(Reflect.get(obj, 'name')); // Jane

// 使用 Reflect 设置属性
Reflect.set(obj, 'age', 26);
console.log(obj.age); // 26

// 使用 Reflect 检查属性是否存在
console.log(Reflect.has(obj, 'email')); // false

// 使用 Reflect 删除属性
Reflect.deleteProperty(obj, 'age');
console.log(obj.age); // undefined

// 使用 Reflect 调用函数
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}
const result = Reflect.apply(greet, obj, ['Hello', '!']);
console.log(result); // Hello, Jane!

// 使用 Reflect 构造对象
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}

const person = Reflect.construct(Person, ['Alice', 30]);
console.log(person); // Person { name: 'Alice', age: 30 }
```

## 生成器

生成器是一种特殊类型的函数，它可以暂停执行并稍后恢复，用于创建迭代器。

### 基本用法

```javascript
// 定义生成器函数
function* generatorFunction() {
  yield 1;
  yield 2;
  yield 3;
  return 4;
}

// 创建生成器对象
const generator = generatorFunction();

// 调用 next() 方法获取下一个值
console.log(generator.next()); // { value: 1, done: false }
console.log(generator.next()); // { value: 2, done: false }
console.log(generator.next()); // { value: 3, done: false }
console.log(generator.next()); // { value: 4, done: true }
console.log(generator.next()); // { value: undefined, done: true }
```

### 传递参数

```javascript
function* counter() {
  let count = 0;
  while (true) {
    const reset = yield count;
    if (reset) {
      count = 0;
    } else {
      count++;
    }
  }
}

const gen = counter();
console.log(gen.next()); // { value: 0, done: false }
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next(true)); // { value: 0, done: false } // 重置计数器
console.log(gen.next()); // { value: 1, done: false }
```

### 生成器委托

```javascript
function* firstGenerator() {
  yield 'a';
  yield 'b';
}

function* secondGenerator() {
  yield 'c';
  yield 'd';
}

function* combinedGenerator() {
  yield* firstGenerator();
  yield* secondGenerator();
  yield 'e';
}

const combined = combinedGenerator();

for (const value of combined) {
  console.log(value);
}
// 输出: a, b, c, d, e
```

## 迭代器

迭代器是一种接口，它定义了一个序列，并且可能在序列结束时返回一个值。

### 自定义迭代器

```javascript
const customIterator = {
  items: [1, 2, 3, 4, 5],
  index: 0,
  
  // Symbol.iterator 方法返回迭代器对象
  [Symbol.iterator]() {
    return {
      items: this.items,
      index: this.index,
      
      // next 方法返回下一个值
      next() {
        if (this.index < this.items.length) {
          return {
            value: this.items[this.index++],
            done: false
          };
        } else {
          return {
            value: undefined,
            done: true
          };
        }
      }
    };
  }
};

// 使用 for...of 循环
for (const item of customIterator) {
  console.log(item);
}
// 输出: 1, 2, 3, 4, 5
```

## 装饰器

装饰器是一种特殊类型的声明，可以附加到类声明、方法、访问器、属性或参数上。装饰器使用 `@decorator` 语法，目前处于提案阶段（Stage 3），需要 Babel 或 TypeScript 支持。

### 类装饰器

```javascript
function sealed(constructor) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class Person {
  constructor(name) {
    this.name = name;
  }
}

// 尝试添加新方法（会失败）
Person.prototype.greet = function() { return 'Hello'; };
const person = new Person('John');
console.log(typeof person.greet); // undefined
```

### 方法装饰器

```javascript
function log(target, propertyKey, descriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args) {
    console.log(`调用 ${propertyKey} 方法，参数: ${args.join(', ')}`);
    const result = originalMethod.apply(this, args);
    console.log(`方法 ${propertyKey} 返回: ${result}`);
    return result;
  };
  
  return descriptor;
}

class Calculator {
  @log
  add(a, b) {
    return a + b;
  }
}

const calc = new Calculator();
calc.add(5, 3); // 输出调用和返回信息
```

### 属性装饰器

```javascript
function readonly(target, propertyKey) {
  Object.defineProperty(target, propertyKey, {
    writable: false
  });
}

class Example {
  @readonly
  static PI = 3.14159;
}

Example.PI = 3; // 不会生效
console.log(Example.PI); // 3.14159
```

### 参数装饰器

```javascript
function validate(target, propertyKey, parameterIndex) {
  console.log(`验证参数 ${parameterIndex} 在 ${propertyKey} 方法中`);
}

class UserService {
  createUser(@validate name, @validate age) {
    return { name, age };
  }
}

const service = new UserService();
service.createUser('Bob', 30);
```

## 总结

ES6+ 引入了许多强大的新特性和语法改进，使 JavaScript 更现代、更强大、更易于维护。这些特性包括更好的变量声明（let/const）、更简洁的语法（箭头函数、模板字符串）、更好的对象和数组操作方法、模块化支持、异步编程改进（Promise、async/await）以及新的数据结构（Map、Set、Symbol）等。

掌握这些 ES6+ 特性对于现代 JavaScript 开发至关重要，它们可以帮助你编写更清晰、更高效、更可维护的代码。