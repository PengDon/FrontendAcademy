# JavaScript 运算符详解

运算符是 JavaScript 中用于操作数据值的符号。它们可以执行各种操作，如算术运算、比较、逻辑操作等。

## 1. 运算符概述

JavaScript 中的运算符可以分为以下几类：
- 算术运算符
- 赋值运算符
- 比较运算符
- 逻辑运算符
- 一元运算符
- 位运算符
- 条件（三元）运算符
- 逗号运算符
- 类型运算符
- 字符串运算符

## 2. 算术运算符

算术运算符用于执行数学运算。

```javascript
// 基本算术运算符
let a = 10;
let b = 5;

console.log(a + b); // 15 (加法)
console.log(a - b); // 5 (减法)
console.log(a * b); // 50 (乘法)
console.log(a / b); // 2 (除法)
console.log(a % b); // 0 (取模/余数)

// 自增自减运算符
let c = 10;
console.log(c++); // 10 (先使用后自增)
console.log(++c); // 12 (先自增后使用)

console.log(c--); // 12 (先使用后自减)
console.log(--c); // 10 (先自减后使用)

// 幂运算符 (ES6+)
console.log(2 ** 3); // 8 (等同于 Math.pow(2, 3))
```

## 3. 赋值运算符

赋值运算符用于给变量赋值。

```javascript
// 基本赋值
let x = 10;

// 复合赋值
x += 5; // 等同于 x = x + 5
x -= 3; // 等同于 x = x - 3
x *= 2; // 等同于 x = x * 2
x /= 4; // 等同于 x = x / 4
x %= 3; // 等同于 x = x % 3

// 幂赋值
x **= 2; // 等同于 x = x ** 2

// 位运算符赋值 (将在后面讲解)
x <<= 1; // 等同于 x = x << 1
x >>= 1; // 等同于 x = x >> 1
x >>>= 1; // 等同于 x = x >>> 1
x &= 3; // 等同于 x = x & 3
x |= 1; // 等同于 x = x | 1
x ^= 2; // 等同于 x = x ^ 2
```

## 4. 比较运算符

比较运算符用于比较两个值，返回布尔值。

```javascript
let a = 10;
let b = "10";
let c = 20;

// 相等性比较
console.log(a == b); // true (仅比较值，不比较类型)
console.log(a === b); // false (严格比较，值和类型都必须相同)
console.log(a != b); // false (不相等)
console.log(a !== b); // true (严格不相等)

// 关系比较
console.log(a > c); // false (大于)
console.log(a < c); // true (小于)
console.log(a >= b); // true (大于等于)
console.log(a <= c); // true (小于等于)

// 字符串比较
console.log('apple' > 'banana'); // false (字典顺序比较)
```

## 5. 逻辑运算符

逻辑运算符用于连接布尔表达式。

```javascript
let x = 5;
let y = 10;

// 逻辑与 (AND)
console.log(x < 10 && y > 5); // true

// 逻辑或 (OR)
console.log(x > 10 || y > 5); // true

// 逻辑非 (NOT)
console.log(!(x > y)); // true

// 短路求值
console.log(false && console.log('这不会被执行'));
console.log(true || console.log('这也不会被执行'));
```

## 6. 一元运算符

一元运算符只对一个操作数进行操作。

```javascript
// 类型转换
console.log(+"10"); // 10 (转为数字)
console.log(+true); // 1
console.log(+false); // 0
console.log(+null); // 0
console.log(+undefined); // NaN

// 正负号
let num = 5;
console.log(-num); // -5
console.log(+num); // 5

// typeof 运算符
console.log(typeof 10); // "number"
console.log(typeof "hello"); // "string"
console.log(typeof true); // "boolean"

// delete 运算符
let obj = { name: "John" };
delete obj.name;
console.log(obj.name); // undefined

// void 运算符
void 0; // undefined
```

## 7. 位运算符

位运算符对数值的二进制位进行操作。

```javascript
let a = 5; // 二进制: 0101
let b = 3; // 二进制: 0011

// 按位与 (&)
console.log(a & b); // 1 (二进制: 0001)

// 按位或 (|)
console.log(a | b); // 7 (二进制: 0111)

// 按位异或 (^)
console.log(a ^ b); // 6 (二进制: 0110)

// 按位非 (~)
console.log(~a); // -6 (二进制: 1010，补码表示)

// 左移 (<<)
console.log(a << 1); // 10 (二进制: 1010)

// 有符号右移 (>>)
console.log(a >> 1); // 2 (二进制: 0010)

// 无符号右移 (>>>)
console.log(a >>> 1); // 2 (二进制: 0010)
```

## 8. 条件（三元）运算符

条件运算符是 JavaScript 中唯一的三元运算符。

```javascript
let age = 18;
let canVote = age >= 18 ? "可以投票" : "不可以投票";
console.log(canVote); // "可以投票"

// 嵌套三元运算符
let score = 85;
let grade = score >= 90 ? "A" :
            score >= 80 ? "B" :
            score >= 70 ? "C" :
            score >= 60 ? "D" : "F";
console.log(grade); // "B"
```

## 9. 逗号运算符

逗号运算符用于执行多个表达式，并返回最后一个表达式的值。

```javascript
let a, b;
let c = (a = 1, b = 2, a + b);
console.log(c); // 3

// 在 for 循环中使用
for (let i = 0, j = 10; i < j; i++, j--) {
  console.log(i, j);
}
```

## 10. 类型运算符

### 10.1 instanceof

`instanceof` 运算符用于检测构造函数的 prototype 是否出现在对象的原型链上。

```javascript
console.log([] instanceof Array); // true
console.log({} instanceof Object); // true
console.log(function() {} instanceof Function); // true
```

### 10.2 typeof

`typeof` 运算符用于检测变量的类型，前面已经介绍过。

## 11. 字符串运算符

### 11.1 字符串拼接

`+` 运算符可以用于拼接字符串。

```javascript
let firstName = "John";
let lastName = "Doe";
let fullName = firstName + " " + lastName;
console.log(fullName); // "John Doe"

// 与其他类型拼接
console.log("The answer is: " + 42); // "The answer is: 42"
console.log("Value: " + true); // "Value: true"
```

### 11.2 模板字符串

ES6+ 引入了模板字符串，提供了更强大的字符串拼接方式。

```javascript
let name = "John";
let age = 30;
let message = `My name is ${name} and I am ${age} years old.`;
console.log(message); // "My name is John and I am 30 years old."

// 多行字符串
let multiLine = `This is a
multi-line string.`;

// 表达式嵌入
let a = 5;
let b = 10;
console.log(`The sum of ${a} and ${b} is ${a + b}.`);
```

## 12. 运算符优先级

运算符优先级决定了表达式中运算的执行顺序。优先级高的运算符先执行。

| 优先级 | 运算符类型               | 运算符                        |
|-------|------------------------|-----------------------------|
| 1     | 括号                   | ()                          |
| 2     | 成员访问、函数调用        | . [] ()                     |
| 3     | 一元运算符               | ++ -- ! ~ + - typeof void delete |
| 4     | 幂运算符                | **                          |
| 5     | 乘法、除法、取模         | * / %                       |
| 6     | 加法、减法              | + -                         |
| 7     | 位左移、位右移、无符号右移 | << >> >>>                   |
| 8     | 关系运算符               | < <= > >=                   |
| 9     | 相等性运算符             | == != === !==               |
| 10    | 按位与                  | &                           |
| 11    | 按位异或                 | ^                           |
| 12    | 按位或                  | |                           |
| 13    | 逻辑与                  | &&                          |
| 14    | 逻辑或                  | ||                          |
| 15    | 条件运算符               | ? :                         |
| 16    | 赋值运算符               | = += -= *= /= %= **= <<= >>= >>>= &= ^= |= |
| 17    | 逗号运算符               | ,                           |

```javascript
// 示例：优先级影响执行顺序
let result = 10 + 5 * 3;
console.log(result); // 25 (乘法优先级高于加法)

result = (10 + 5) * 3;
console.log(result); // 45 (括号改变优先级)
```

## 13. 学习重点

1. 理解各种运算符的功能和使用场景
2. 掌握运算符的优先级，避免因优先级导致的错误
3. 学会使用严格相等运算符（===）进行比较
4. 理解逻辑运算符的短路求值特性
5. 熟练使用 ES6+ 引入的新运算符（如 **、模板字符串）

## 14. 练习

1. 写出以下代码的输出结果：
   ```javascript
   let a = 5;
   let b = 10;
   console.log(a++ + ++b);
   ```

2. 解释 == 和 === 运算符的区别

3. 什么是短路求值？举例说明

4. 写出以下代码的输出结果：
   ```javascript
   console.log("5" + 5);
   console.log("5" - 5);
   ```

5. 如何使用模板字符串拼接多行字符串？

## 15. 参考资料

- [MDN Web Docs: JavaScript 运算符](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators)
- [JavaScript.info: 运算符](https://javascript.info/operators)
