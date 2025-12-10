# JavaScript 函数详解

函数是 JavaScript 中的核心概念之一，它允许我们封装可重用的代码块。理解函数的工作原理和使用方法是掌握 JavaScript 的关键。

## 1. 函数的定义

JavaScript 中有几种定义函数的方式：

### 1.1 函数声明

函数声明是最传统的定义函数的方式。

```javascript
function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet("John")); // "Hello, John!"
```

### 1.2 函数表达式

函数表达式是将函数赋值给变量的方式。

```javascript
let greet = function(name) {
  return "Hello, " + name + "!";
};

console.log(greet("John")); // "Hello, John!"
```

### 1.3 箭头函数 (ES6+)

箭头函数是 ES6 引入的一种更简洁的函数定义方式。

```javascript
// 基本语法
let greet = (name) => {
  return "Hello, " + name + "!";
};

// 当只有一个参数时，可以省略括号
let greet = name => {
  return "Hello, " + name + "!";
};

// 当只有一条 return 语句时，可以省略大括号和 return 关键字
let greet = name => "Hello, " + name + "!";

console.log(greet("John")); // "Hello, John!"
```

### 1.4 函数构造函数

使用 Function 构造函数创建函数（不推荐，因为性能较差且难以调试）。

```javascript
let greet = new Function("name", "return 'Hello, ' + name + '!'");
console.log(greet("John")); // "Hello, John!"
```

## 2. 函数的参数

### 2.1 参数的传递

JavaScript 中函数参数是按值传递的（对于引用类型，传递的是引用的副本）。

```javascript
// 基本类型参数
function changeValue(x) {
  x = 10;
  console.log(x); // 10
}

let num = 5;
changeValue(num);
console.log(num); // 5 (原始值未改变)

// 引用类型参数
function changeObject(obj) {
  obj.name = "Jane";
  console.log(obj.name); // "Jane"
}

let person = { name: "John" };
changeObject(person);
console.log(person.name); // "Jane" (对象属性已改变)
```

### 2.2 默认参数 (ES6+)

ES6 允许为函数参数设置默认值。

```javascript
function greet(name = "World") {
  return "Hello, " + name + "!";
}

console.log(greet("John")); // "Hello, John!"
console.log(greet()); // "Hello, World!"

// 默认参数可以是表达式
function calculateTotal(price, tax = price * 0.1) {
  return price + tax;
}

console.log(calculateTotal(100)); // 110
```

### 2.3 剩余参数 (ES6+)

剩余参数允许函数接受任意数量的参数。

```javascript
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

console.log(sum(1, 2, 3)); // 6
console.log(sum(1, 2, 3, 4, 5)); // 15

// 剩余参数必须是最后一个参数
function greet(firstName, lastName, ...nicknames) {
  console.log(`Hello, ${firstName} ${lastName}!`);
  console.log("Nicknames:", nicknames);
}

greet("John", "Doe", "Johnny", "JD");
// Hello, John Doe!
// Nicknames: ["Johnny", "JD"]
```

### 2.4 arguments 对象

arguments 是函数内部的一个类数组对象，包含了所有传递给函数的参数。

```javascript
function sum() {
  let total = 0;
  for (let i = 0; i < arguments.length; i++) {
    total += arguments[i];
  }
  return total;
}

console.log(sum(1, 2, 3)); // 6
```

注意：箭头函数没有自己的 arguments 对象。

## 3. 函数的返回值

函数可以使用 return 语句返回一个值。

```javascript
function add(a, b) {
  return a + b;
}

let result = add(5, 3);
console.log(result); // 8

// 没有 return 语句的函数返回 undefined
function greet() {
  console.log("Hello!");
}

let result = greet();
console.log(result); // undefined

// return 语句后面的代码不会执行
function multiply(a, b) {
  return a * b;
  console.log("这行代码不会执行");
}
```

## 4. 函数作用域

### 4.1 全局作用域

在函数外部定义的变量具有全局作用域，可以在任何地方访问。

```javascript
let globalVar = "I'm global";

function test() {
  console.log(globalVar); // 可以访问全局变量
}

test(); // "I'm global"
```

### 4.2 函数作用域

在函数内部定义的变量具有函数作用域，只能在函数内部访问。

```javascript
function test() {
  let localVar = "I'm local";
  console.log(localVar); // "I'm local"
}

test();
console.log(localVar); // 错误：localVar is not defined
```

### 4.3 块级作用域 (ES6+)

使用 let 和 const 关键字定义的变量具有块级作用域，只能在定义它们的块（如 if、for、while 等）内部访问。

```javascript
if (true) {
  let blockVar = "I'm block-scoped";
  const constVar = "I'm also block-scoped";
  var varVar = "I'm not block-scoped";
}

console.log(blockVar); // 错误：blockVar is not defined
console.log(constVar); // 错误：constVar is not defined
console.log(varVar); // "I'm not block-scoped" (var 声明的变量没有块级作用域)
```

## 5. 闭包

闭包是指有权访问另一个函数作用域中变量的函数。

```javascript
function createCounter() {
  let count = 0;
  
  return function() {
    count++;
    return count;
  };
}

let counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
```

闭包的应用场景：
- 数据封装和私有变量
- 函数工厂
- 延迟执行

## 6. 立即执行函数表达式 (IIFE)

IIFE 是一种定义后立即执行的函数表达式。

```javascript
(function() {
  console.log("This function executes immediately!");
})();

// 带参数的 IIFE
(function(name) {
  console.log("Hello, " + name + "!");
})("John");

// 箭头函数形式的 IIFE
(() => {
  console.log("Arrow function IIFE");
})();
```

IIFE 的主要用途：
- 创建私有作用域，避免污染全局命名空间
- 早期的模块化解决方案

## 7. 函数的 this 关键字

this 关键字在函数内部引用当前执行上下文。

### 7.1 全局上下文

在全局上下文中，this 指向全局对象（浏览器中是 window，Node.js 中是 global）。

```javascript
console.log(this); // 全局对象
```

### 7.2 函数上下文

在普通函数中，this 的值取决于函数的调用方式。

```javascript
function greet() {
  console.log("Hello, " + this.name + "!");
}

let person = {
  name: "John",
  greet: greet
};

// 直接调用：this 指向全局对象
person.greet(); // "Hello, John!"

// 对象方法调用：this 指向调用对象
greet(); // "Hello, undefined!" (在浏览器中)
```

### 7.3 箭头函数的 this

箭头函数没有自己的 this，它继承外层作用域的 this。

```javascript
let person = {
  name: "John",
  greet: function() {
    // 普通函数的 this 指向 person 对象
    let arrowGreet = () => {
      // 箭头函数继承外层作用域的 this
      console.log("Hello, " + this.name + "!");
    };
    arrowGreet();
  }
};

person.greet(); // "Hello, John!"
```

### 7.4 改变 this 的指向

JavaScript 提供了几种改变函数 this 指向的方法：call、apply 和 bind。

```javascript
function greet(greeting) {
  console.log(greeting + ", " + this.name + "!");
}

let person = {
  name: "John"
};

// call 方法：直接传递参数
greet.call(person, "Hello"); // "Hello, John!"

// apply 方法：参数以数组形式传递
greet.apply(person, ["Hello"]); // "Hello, John!"

// bind 方法：创建一个新函数，this 指向绑定的对象
let greetJohn = greet.bind(person);
greetJohn("Hello"); // "Hello, John!"
```

## 8. 高阶函数

高阶函数是指接受函数作为参数或返回函数的函数。

```javascript
// 接受函数作为参数
function applyOperation(a, b, operation) {
  return operation(a, b);
}

function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

console.log(applyOperation(5, 3, add)); // 8
console.log(applyOperation(5, 3, multiply)); // 15

// 返回函数
function createMultiplier(factor) {
  return function(number) {
    return number * factor;
  };
}

let double = createMultiplier(2);
let triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
```

## 9. 递归函数

递归函数是指调用自身的函数。

```javascript
// 计算阶乘
function factorial(n) {
  if (n === 0 || n === 1) {
    return 1;
  }
  return n * factorial(n - 1);
}

console.log(factorial(5)); // 120

// 计算斐波那契数列
function fibonacci(n) {
  if (n <= 1) {
    return n;
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(6)); // 8
```

## 10. 函数的性质

### 10.1 函数是一等公民

在 JavaScript 中，函数是一等公民，这意味着：
- 函数可以作为参数传递
- 函数可以作为返回值
- 函数可以赋值给变量
- 函数可以拥有属性和方法

```javascript
function greet() {
  console.log("Hello!");
}

// 函数可以拥有属性
greet.version = "1.0";
console.log(greet.version); // "1.0"
```

### 10.2 函数的 length 属性

函数的 length 属性表示函数期望接收的参数数量。

```javascript
function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet.length); // 1

function sum(a, b, c) {
  return a + b + c;
}

console.log(sum.length); // 3
```

## 11. 学习重点

1. 掌握各种函数定义方式（函数声明、函数表达式、箭头函数）的语法和使用场景
2. 理解函数参数的传递方式（值传递 vs 引用传递）
3. 学会使用默认参数、剩余参数等 ES6+ 特性
4. 理解函数作用域、块级作用域和闭包的概念
5. 掌握 this 关键字的工作原理和改变 this 指向的方法
6. 理解高阶函数和递归函数的概念和应用

## 12. 练习

1. 写出一个使用箭头函数计算两个数之和的函数
2. 解释函数声明和函数表达式的区别
3. 什么是闭包？举一个实际应用的例子
4. 解释箭头函数和普通函数中 this 的区别
5. 写出一个使用递归计算斐波那契数列的函数

## 13. 参考资料

- [MDN Web Docs: 函数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)
- [JavaScript.info: 函数](https://javascript.info/function-basics)
- [JavaScript.info: 箭头函数](https://javascript.info/arrow-functions-basics)
- [JavaScript.info: 闭包](https://javascript.info/closure)
