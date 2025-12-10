# JavaScript 流程控制

流程控制语句用于控制 JavaScript 代码的执行顺序。它们允许我们根据条件执行不同的代码块，或者重复执行代码块。

## 1. 条件语句

条件语句用于根据不同的条件执行不同的代码块。

### 1.1 if 语句

if 语句用于在条件为真时执行代码块。

```javascript
let age = 18;

if (age >= 18) {
  console.log("你已经成年了");
}
```

### 1.2 if...else 语句

if...else 语句用于在条件为真时执行一个代码块，为假时执行另一个代码块。

```javascript
let age = 15;

if (age >= 18) {
  console.log("你已经成年了");
} else {
  console.log("你还未成年");
}
```

### 1.3 if...else if...else 语句

if...else if...else 语句用于根据多个条件执行不同的代码块。

```javascript
let score = 85;

if (score >= 90) {
  console.log("成绩优秀");
} else if (score >= 80) {
  console.log("成绩良好");
} else if (score >= 60) {
  console.log("成绩及格");
} else {
  console.log("成绩不及格");
}
```

### 1.4 嵌套 if 语句

可以在一个 if 语句中嵌套另一个 if 语句。

```javascript
let age = 20;
let hasId = true;

if (age >= 18) {
  if (hasId) {
    console.log("可以进入");
  } else {
    console.log("需要身份证");
  }
} else {
  console.log("年龄不足");
}
```

## 2. switch 语句

switch 语句用于根据不同的情况执行不同的代码块，是 if...else if...else 语句的一种替代方案。

```javascript
let day = 3;
let dayName;

switch (day) {
  case 1:
    dayName = "星期一";
    break;
  case 2:
    dayName = "星期二";
    break;
  case 3:
    dayName = "星期三";
    break;
  case 4:
    dayName = "星期四";
    break;
  case 5:
    dayName = "星期五";
    break;
  case 6:
    dayName = "星期六";
    break;
  case 7:
    dayName = "星期日";
    break;
  default:
    dayName = "无效的日期";
}

console.log(dayName); // 星期三
```

### 2.1 注意事项

- **break 语句**：在每个 case 后面添加 break 语句，以防止代码继续执行到下一个 case。
- **default 语句**：当没有匹配的 case 时，执行 default 语句。
- **严格相等**：switch 语句使用严格相等（===）进行比较。

```javascript
// 注意：switch 使用严格相等比较
let x = "5";

switch (x) {
  case 5:
    console.log("x 是数字 5");
    break;
  case "5":
    console.log("x 是字符串 '5'");
    break;
  default:
    console.log("x 不是 5");
}
// 输出: x 是字符串 '5'
```

## 3. 循环语句

循环语句用于重复执行代码块。

### 3.1 for 循环

for 循环是最常用的循环语句，用于已知循环次数的情况。

```javascript
// for (初始化; 条件; 递增/递减) {
//   要执行的代码块
// }

for (let i = 0; i < 5; i++) {
  console.log("当前数字: " + i);
}

// 遍历数组
let fruits = ["苹果", "香蕉", "橙子"];
for (let i = 0; i < fruits.length; i++) {
  console.log(fruits[i]);
}
```

### 3.2 for...in 循环

for...in 循环用于遍历对象的可枚举属性。

```javascript
let person = {
  name: "John",
  age: 30,
  city: "New York"
};

for (let property in person) {
  console.log(property + ": " + person[property]);
}

// 注意：for...in 也可以遍历数组，但不推荐
// 因为它会遍历数组的所有可枚举属性，包括原型链上的属性
let numbers = [1, 2, 3];
for (let index in numbers) {
  console.log(index + ": " + numbers[index]);
}
```

### 3.3 for...of 循环 (ES6+)

for...of 循环用于遍历可迭代对象（如数组、字符串、Map、Set 等）的值。

```javascript
// 遍历数组
let fruits = ["苹果", "香蕉", "橙子"];
for (let fruit of fruits) {
  console.log(fruit);
}

// 遍历字符串
let str = "Hello";
for (let char of str) {
  console.log(char);
}

// 遍历 Map
let map = new Map();
map.set("name", "John");
map.set("age", 30);
for (let [key, value] of map) {
  console.log(key + ": " + value);
}

// 遍历 Set
let set = new Set([1, 2, 3]);
for (let value of set) {
  console.log(value);
}
```

### 3.4 while 循环

while 循环在条件为真时重复执行代码块。

```javascript
let i = 0;
while (i < 5) {
  console.log("当前数字: " + i);
  i++;
}

// 注意：确保循环条件最终会变为 false，否则会导致无限循环
// 无限循环示例（不要运行！）
// while (true) {
//   console.log("无限循环");
// }
```

### 3.5 do...while 循环

do...while 循环与 while 循环类似，但它会先执行一次代码块，然后再检查条件。

```javascript
let i = 0;

do {
  console.log("当前数字: " + i);
  i++;
} while (i < 5);

// 即使条件初始为 false，代码块也会执行一次
let j = 5;

do {
  console.log("当前数字: " + j);
  j++;
} while (j < 5);
```

## 4. 跳转语句

跳转语句用于改变代码的执行顺序。

### 4.1 break 语句

break 语句用于终止循环或 switch 语句。

```javascript
// 终止 for 循环
for (let i = 0; i < 10; i++) {
  if (i === 5) {
    break;
  }
  console.log(i);
}

// 终止 while 循环
let j = 0;
while (j < 10) {
  if (j === 5) {
    break;
  }
  console.log(j);
  j++;
}
```

### 4.2 continue 语句

continue 语句用于跳过当前循环的剩余部分，直接开始下一次循环。

```javascript
// 跳过奇数
for (let i = 0; i < 10; i++) {
  if (i % 2 !== 0) {
    continue;
  }
  console.log(i); // 只输出偶数
}

// 跳过年龄小于 18 的用户
let users = [
  { name: "John", age: 25 },
  { name: "Jane", age: 17 },
  { name: "Mike", age: 30 }
];

for (let user of users) {
  if (user.age < 18) {
    continue;
  }
  console.log(user.name + " 已经成年");
}
```

### 4.3 label 语句

label 语句用于为代码块添加标签，然后可以使用 break 或 continue 语句跳转到该标签。

```javascript
outerLoop: for (let i = 0; i < 3; i++) {
  innerLoop: for (let j = 0; j < 3; j++) {
    if (i === 1 && j === 1) {
      break outerLoop; // 跳出外层循环
    }
    console.log(`i: ${i}, j: ${j}`);
  }
}
```

## 5. 错误处理

错误处理语句用于捕获和处理代码执行过程中的错误。

### 5.1 try...catch 语句

try...catch 语句用于捕获和处理 try 块中发生的错误。

```javascript
try {
  // 可能会抛出错误的代码
  let result = 10 / 0;
  console.log(result);
} catch (error) {
  // 处理错误
  console.log("发生了错误: " + error.message);
}
```

### 5.2 try...catch...finally 语句

try...catch...finally 语句中的 finally 块无论是否发生错误都会执行。

```javascript
try {
  let result = 10 / 0;
  console.log(result);
} catch (error) {
  console.log("发生了错误: " + error.message);
} finally {
  console.log("这个代码块无论如何都会执行");
}
```

### 5.3 throw 语句

throw 语句用于手动抛出错误。

```javascript
function divide(a, b) {
  if (b === 0) {
    throw new Error("除数不能为零");
  }
  return a / b;
}

try {
  let result = divide(10, 0);
  console.log(result);
} catch (error) {
  console.log("捕获到错误: " + error.message);
}
```

## 6. 学习重点

1. 掌握各种条件语句（if、if...else、if...else if...else、switch）的使用场景和语法
2. 理解并熟练使用各种循环语句（for、for...in、for...of、while、do...while）
3. 学会使用跳转语句（break、continue）控制循环的执行
4. 理解错误处理机制（try...catch、throw）
5. 注意避免常见的循环错误（如无限循环）

## 7. 练习

1. 编写一个程序，检查一个数是否为偶数
2. 使用 switch 语句将月份数字转换为月份名称
3. 使用 for 循环计算 1 到 100 的和
4. 使用 while 循环输出 10 的阶乘
5. 编写一个程序，使用 try...catch 语句捕获数组访问越界错误

## 8. 参考资料

- [MDN Web Docs: JavaScript 语句和声明](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements)
- [JavaScript.info: 条件分支](https://javascript.info/ifelse)
- [JavaScript.info: 循环](https://javascript.info/while-for)
- [JavaScript.info: 错误处理](https://javascript.info/try-catch)
