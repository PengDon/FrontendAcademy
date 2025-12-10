# JavaScript 数据类型详解

JavaScript 是一种动态类型语言，这意味着变量可以在运行时存储不同类型的值。理解 JavaScript 的数据类型是掌握这门语言的基础。

## 1. 数据类型概述

JavaScript 中的数据类型分为两大类：
- **原始数据类型**（Primitive Types）：直接存储数据值
- **引用数据类型**（Reference Types）：存储指向数据的引用

## 2. 原始数据类型

### 2.1 Number（数字）

Number 类型用于表示整数和浮点数。

```javascript
// 整数
let integer = 42;

// 浮点数
let float = 3.14;

// 特殊数值
let infinity = Infinity;
let negativeInfinity = -Infinity;
let notANumber = NaN; // Not a Number

// 检查是否为有效数字
console.log(isNaN(notANumber)); // true
console.log(isFinite(infinity)); // false
```

### 2.2 String（字符串）

String 类型用于表示文本数据。

```javascript
// 字符串字面量
let singleQuote = 'Hello';
let doubleQuote = "World";

// 模板字符串（ES6+）
let templateString = `Hello, ${doubleQuote}!`;

// 字符串属性和方法
console.log(templateString.length); // 12
console.log(templateString.toUpperCase()); // "HELLO, WORLD!"
console.log(templateString.includes('World')); // true
```

### 2.3 Boolean（布尔值）

Boolean 类型用于表示逻辑真或假。

```javascript
let isActive = true;
let isCompleted = false;

// 布尔值转换
console.log(Boolean(0)); // false
console.log(Boolean('')); // false
console.log(Boolean(null)); // false
console.log(Boolean(undefined)); // false
console.log(Boolean(NaN)); // false
console.log(Boolean(1)); // true
console.log(Boolean('hello')); // true
```

### 2.4 Undefined（未定义）

Undefined 类型表示一个未被赋值的变量。

```javascript
let x;
console.log(x); // undefined

// 函数没有返回值时也会返回 undefined
function noReturn() {}
console.log(noReturn()); // undefined
```

### 2.5 Null（空值）

Null 类型表示一个空值或不存在的对象。

```javascript
let emptyValue = null;
console.log(typeof emptyValue); // "object" (这是一个历史遗留的 bug)

// 通常用于显式表示"无值"
let user = null; // 表示没有用户
```

### 2.6 Symbol（符号）

Symbol 类型（ES6+）用于创建唯一标识符。

```javascript
// 创建 Symbol
let id = Symbol();
let namedId = Symbol('id');

// Symbol 是唯一的
let id1 = Symbol('id');
let id2 = Symbol('id');
console.log(id1 === id2); // false

// 作为对象属性
let obj = {
  [id]: 'unique value'
};
```

### 2.7 BigInt（大整数）

BigInt 类型（ES2020+）用于表示任意精度的整数。

```javascript
// 创建 BigInt
let bigNum = 123456789012345678901234567890n;
let anotherBigNum = BigInt(123);

// 运算
console.log(bigNum + 1n); // 123456789012345678901234567891n
console.log(bigNum * 2n); // 246913578024691357802469135780n
```

## 3. 引用数据类型

### 3.1 Object（对象）

Object 类型是 JavaScript 中所有引用类型的基类。

```javascript
// 对象字面量
let person = {
  name: 'John',
  age: 30,
  greet: function() {
    return `Hello, ${this.name}!`;
  }
};

// 访问属性
console.log(person.name); // "John"
console.log(person['age']); // 30

// 调用方法
console.log(person.greet()); // "Hello, John!"
```

### 3.2 Array（数组）

Array 类型用于存储有序的数据集合。

```javascript
// 数组字面量
let numbers = [1, 2, 3, 4, 5];

// 访问元素
console.log(numbers[0]); // 1
console.log(numbers.length); // 5

// 数组方法
numbers.push(6); // 添加到末尾
numbers.pop(); // 移除末尾元素
numbers.unshift(0); // 添加到开头
```

### 3.3 Function（函数）

Function 类型用于定义可执行的代码块。

```javascript
// 函数声明
function add(a, b) {
  return a + b;
}

// 函数表达式
let multiply = function(a, b) {
  return a * b;
};

// 箭头函数（ES6+）
let divide = (a, b) => a / b;
```

## 4. 类型转换

JavaScript 经常会在需要时自动转换数据类型，这称为隐式转换。

### 4.1 隐式转换

```javascript
// 字符串 + 数字 = 字符串
console.log('5' + 5); // "55"

// 数字 - 字符串 = 数字（如果字符串可以转换为数字）
console.log(10 - '5'); // 5

// 布尔值转换为数字
console.log(true + 1); // 2
console.log(false + 1); // 1
```

### 4.2 显式转换

```javascript
// 转换为字符串
let num = 42;
let str = String(num); // "42"
let str2 = num.toString(); // "42"

// 转换为数字
let strNum = "123";
let num1 = Number(strNum); // 123
let num2 = parseInt(strNum); // 123
let num3 = parseFloat("3.14"); // 3.14

// 转换为布尔值
let truthy = Boolean('hello'); // true
let falsy = Boolean(''); // false
```

## 5. 类型检测

### 5.1 typeof 运算符

`typeof` 运算符用于检测变量的类型。

```javascript
console.log(typeof 42); // "number"
console.log(typeof "hello"); // "string"
console.log(typeof true); // "boolean"
console.log(typeof undefined); // "undefined"
console.log(typeof null); // "object" (历史遗留问题)
console.log(typeof {}); // "object"
console.log(typeof []); // "object"
console.log(typeof function() {}); // "function"
console.log(typeof Symbol()); // "symbol"
console.log(typeof 123n); // "bigint"
```

### 5.2 instanceof 运算符

`instanceof` 运算符用于检测构造函数的 prototype 是否出现在对象的原型链上。

```javascript
console.log([] instanceof Array); // true
console.log({} instanceof Object); // true
console.log(function() {} instanceof Function); // true
```

### 5.3 Object.prototype.toString 方法

这是检测对象类型的最可靠方法。

```javascript
function getType(value) {
  return Object.prototype.toString.call(value).slice(8, -1);
}

console.log(getType(42)); // "Number"
console.log(getType("hello")); // "String"
console.log(getType([])); // "Array"
console.log(getType({})); // "Object"
console.log(getType(null)); // "Null"
console.log(getType(undefined)); // "Undefined"
```

## 6. 原始类型 vs 引用类型

### 6.1 内存分配

- **原始类型**：直接存储在栈内存中
- **引用类型**：值存储在堆内存中，引用（地址）存储在栈内存中

### 6.2 赋值行为

```javascript
// 原始类型赋值：复制值
let a = 10;
let b = a;
console.log(b); // 10
b = 20;
console.log(a); // 10 (a 不受影响)

// 引用类型赋值：复制引用
let obj1 = { value: 10 };
let obj2 = obj1;
console.log(obj2.value); // 10
obj2.value = 20;
console.log(obj1.value); // 20 (obj1 受到影响)
```

### 6.3 比较行为

```javascript
// 原始类型比较：比较值
console.log(10 === 10); // true
console.log("hello" === "hello"); // true

// 引用类型比较：比较引用（地址）
console.log({} === {}); // false
console.log([] === []); // false

let obj1 = { value: 10 };
let obj2 = obj1;
console.log(obj1 === obj2); // true
```

## 7. 学习重点

1. 理解原始类型和引用类型的区别
2. 掌握各种数据类型的特性和使用场景
3. 学会正确进行类型转换和检测
4. 注意 JavaScript 中的特殊值（如 NaN、Infinity、null、undefined）

## 8. 练习

1. 写出 JavaScript 中的 7 种原始数据类型
2. 解释原始类型和引用类型的区别
3. 如何正确检测数组类型？
4. 什么是 NaN？如何检测一个值是否为 NaN？
5. 解释以下代码的输出结果：
   ```javascript
   let a = { value: 10 };
   let b = a;
   b.value = 20;
   console.log(a.value);
   ```

## 9. 参考资料

- [MDN Web Docs: JavaScript data types and data structures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures)
- [JavaScript.info: Data types](https://javascript.info/types)
