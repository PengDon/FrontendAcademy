# JavaScript 数组详解

数组是 JavaScript 中用于存储多个值的有序集合。数组是一种特殊的对象，具有很多内置方法，使得操作数据变得非常方便。

## 1. 数组的创建

### 1.1 数组字面量

最常用的创建数组的方式。

```javascript
// 创建空数组
let emptyArray = [];

// 创建包含元素的数组
let numbers = [1, 2, 3, 4, 5];
let fruits = ["苹果", "香蕉", "橙子"];
let mixed = [1, "苹果", true, null, undefined];
```

### 1.2 Array 构造函数

使用 Array 构造函数创建数组。

```javascript
// 创建空数组
let emptyArray = new Array();

// 创建指定长度的数组
let arrayWithLength = new Array(5); // [empty × 5]

// 创建包含元素的数组
let numbers = new Array(1, 2, 3, 4, 5);
let fruits = new Array("苹果", "香蕉", "橙子");
```

### 1.3 Array.of() 方法 (ES6+)

创建包含任意数量参数的数组。

```javascript
let numbers = Array.of(1, 2, 3, 4, 5);
let singleElement = Array.of(1); // [1] (与 new Array(1) 不同，后者创建长度为 1 的空数组)
```

### 1.4 Array.from() 方法 (ES6+)

从类数组对象或可迭代对象创建数组。

```javascript
// 从字符串创建数组
let chars = Array.from("Hello"); // ["H", "e", "l", "l", "o"]

// 从 Set 创建数组
let set = new Set([1, 2, 3, 3]);
let uniqueNumbers = Array.from(set); // [1, 2, 3]

// 从 Map 创建数组
let map = new Map([["a", 1], ["b", 2]]);
let mapArray = Array.from(map); // [["a", 1], ["b", 2]]

// 使用映射函数
let doubled = Array.from([1, 2, 3], x => x * 2); // [2, 4, 6]
```

## 2. 数组的访问和修改

### 2.1 访问数组元素

使用索引访问数组元素，索引从 0 开始。

```javascript
let fruits = ["苹果", "香蕉", "橙子"];

console.log(fruits[0]); // "苹果"
console.log(fruits[1]); // "香蕉"
console.log(fruits[2]); // "橙子"
console.log(fruits[3]); // undefined (访问超出数组长度的索引)
```

### 2.2 修改数组元素

```javascript
let fruits = ["苹果", "香蕉", "橙子"];

fruits[1] = "葡萄"; // 修改索引为 1 的元素
console.log(fruits); // ["苹果", "葡萄", "橙子"]

fruits[3] = "草莓"; // 添加新元素
console.log(fruits); // ["苹果", "葡萄", "橙子", "草莓"]
```

### 2.3 数组长度

使用 length 属性获取或设置数组的长度。

```javascript
let fruits = ["苹果", "香蕉", "橙子"];

console.log(fruits.length); // 3

// 设置数组长度
fruits.length = 2;
console.log(fruits); // ["苹果", "香蕉"] (截断数组)

fruits.length = 5;
console.log(fruits); // ["苹果", "香蕉", empty × 3] (扩展数组)
```

## 3. 数组的基本操作

### 3.1 添加元素

```javascript
let fruits = ["苹果", "香蕉"];

// 在数组末尾添加元素
fruits.push("橙子");
console.log(fruits); // ["苹果", "香蕉", "橙子"]

// 在数组开头添加元素
fruits.unshift("草莓");
console.log(fruits); // ["草莓", "苹果", "香蕉", "橙子"]

// 在指定位置添加元素 (splice 方法)
fruits.splice(2, 0, "葡萄");
console.log(fruits); // ["草莓", "苹果", "葡萄", "香蕉", "橙子"]
```

### 3.2 删除元素

```javascript
let fruits = ["草莓", "苹果", "葡萄", "香蕉", "橙子"];

// 删除数组末尾的元素
let lastFruit = fruits.pop();
console.log(fruits); // ["草莓", "苹果", "葡萄", "香蕉"]
console.log(lastFruit); // "橙子"

// 删除数组开头的元素
let firstFruit = fruits.shift();
console.log(fruits); // ["苹果", "葡萄", "香蕉"]
console.log(firstFruit); // "草莓"

// 删除指定位置的元素 (splice 方法)
let removedFruits = fruits.splice(1, 2);
console.log(fruits); // ["苹果"]
console.log(removedFruits); // ["葡萄", "香蕉"]
```

### 3.3 查找元素

```javascript
let fruits = ["苹果", "香蕉", "橙子", "香蕉"];

// 查找元素的索引
console.log(fruits.indexOf("香蕉")); // 1 (返回第一个匹配的索引)
console.log(fruits.lastIndexOf("香蕉")); // 3 (返回最后一个匹配的索引)
console.log(fruits.indexOf("草莓")); // -1 (未找到)

// 检查元素是否存在 (ES6+)
console.log(fruits.includes("橙子")); // true
console.log(fruits.includes("草莓")); // false

// 查找满足条件的元素 (ES6+)
let numbers = [1, 2, 3, 4, 5];
let even = numbers.find(num => num % 2 === 0);
console.log(even); // 2

// 查找满足条件的元素的索引 (ES6+)
let evenIndex = numbers.findIndex(num => num % 2 === 0);
console.log(evenIndex); // 1
```

### 3.4 切片和连接

```javascript
let numbers = [1, 2, 3, 4, 5];

// 切片 (slice 方法)：返回数组的一部分，不会修改原数组
let slice1 = numbers.slice(1, 4); // 从索引 1 开始，到索引 4 结束（不包括索引 4）
console.log(slice1); // [2, 3, 4]

let slice2 = numbers.slice(2); // 从索引 2 开始到数组末尾
console.log(slice2); // [3, 4, 5]

let slice3 = numbers.slice(-3); // 从倒数第 3 个元素开始到数组末尾
console.log(slice3); // [3, 4, 5]

// 连接 (concat 方法)：连接两个或多个数组，不会修改原数组
let fruits1 = ["苹果", "香蕉"];
let fruits2 = ["橙子", "葡萄"];
let allFruits = fruits1.concat(fruits2);
console.log(allFruits); // ["苹果", "香蕉", "橙子", "葡萄"]
```

## 4. 数组的迭代方法

### 4.1 forEach()

对数组中的每个元素执行一次回调函数。

```javascript
let numbers = [1, 2, 3, 4, 5];

numbers.forEach((num, index, array) => {
  console.log(`索引 ${index} 的值是 ${num}`);
});

// 输出:
// 索引 0 的值是 1
// 索引 1 的值是 2
// 索引 2 的值是 3
// 索引 3 的值是 4
// 索引 4 的值是 5
```

### 4.2 map()

创建一个新数组，其结果是原数组中的每个元素调用回调函数后的返回值。

```javascript
let numbers = [1, 2, 3, 4, 5];

// 计算每个元素的平方
let squares = numbers.map(num => num * num);
console.log(squares); // [1, 4, 9, 16, 25]

// 转换数组元素类型
let strings = ["1", "2", "3"];
let numbers = strings.map(str => parseInt(str));
console.log(numbers); // [1, 2, 3]
```

### 4.3 filter()

创建一个新数组，包含原数组中所有通过回调函数测试的元素。

```javascript
let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// 过滤偶数
let evenNumbers = numbers.filter(num => num % 2 === 0);
console.log(evenNumbers); // [2, 4, 6, 8, 10]

// 过滤大于 5 的数
let greaterThanFive = numbers.filter(num => num > 5);
console.log(greaterThanFive); // [6, 7, 8, 9, 10]
```

### 4.4 reduce()

对数组中的所有元素执行一个回调函数，将其结果汇总为单个值。

```javascript
let numbers = [1, 2, 3, 4, 5];

// 计算数组元素的和
let sum = numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
console.log(sum); // 15

// 计算数组元素的乘积
let product = numbers.reduce((accumulator, currentValue) => accumulator * currentValue, 1);
console.log(product); // 120

// 找出数组中的最大值
let max = numbers.reduce((max, currentValue) => currentValue > max ? currentValue : max, numbers[0]);
console.log(max); // 5
```

### 4.5 reduceRight()

与 reduce() 类似，但从数组的末尾开始计算。

```javascript
let numbers = [1, 2, 3, 4, 5];

// 计算数组元素的和（从右到左）
let sum = numbers.reduceRight((accumulator, currentValue) => accumulator + currentValue, 0);
console.log(sum); // 15
```

### 4.6 every()

检查数组中的所有元素是否都通过了回调函数的测试。

```javascript
let numbers = [2, 4, 6, 8, 10];

// 检查是否所有元素都是偶数
let allEven = numbers.every(num => num % 2 === 0);
console.log(allEven); // true

let mixedNumbers = [2, 4, 5, 8, 10];
let allEvenMixed = mixedNumbers.every(num => num % 2 === 0);
console.log(allEvenMixed); // false
```

### 4.7 some()

检查数组中是否至少有一个元素通过了回调函数的测试。

```javascript
let numbers = [1, 3, 5, 7, 9];

// 检查是否有偶数
let hasEven = numbers.some(num => num % 2 === 0);
console.log(hasEven); // false

let mixedNumbers = [1, 3, 5, 8, 9];
let hasEvenMixed = mixedNumbers.some(num => num % 2 === 0);
console.log(hasEvenMixed); // true
```

### 4.8 for...of 循环 (ES6+)

遍历数组的元素。

```javascript
let fruits = ["苹果", "香蕉", "橙子"];

for (let fruit of fruits) {
  console.log(fruit);
}

// 输出:
// 苹果
// 香蕉
// 橙子
```

## 5. 数组的排序和反转

```javascript
let numbers = [3, 1, 4, 1, 5, 9, 2, 6];

// 反转数组（修改原数组）
numbers.reverse();
console.log(numbers); // [6, 2, 9, 5, 1, 4, 1, 3]

// 排序（修改原数组）
numbers.sort(); // 默认按字符串排序
console.log(numbers); // [1, 1, 2, 3, 4, 5, 6, 9]

// 按数字大小排序
numbers = [3, 1, 4, 1, 5, 9, 2, 6];
numbers.sort((a, b) => a - b); // 升序
console.log(numbers); // [1, 1, 2, 3, 4, 5, 6, 9]

numbers.sort((a, b) => b - a); // 降序
console.log(numbers); // [9, 6, 5, 4, 3, 2, 1, 1]

// 按对象属性排序
let persons = [
  { name: "John", age: 30 },
  { name: "Jane", age: 25 },
  { name: "Mike", age: 35 }
];

persons.sort((a, b) => a.age - b.age); // 按年龄升序
console.log(persons);
```

## 6. 数组的转换方法

### 6.1 join()

将数组中的所有元素连接成一个字符串。

```javascript
let fruits = ["苹果", "香蕉", "橙子"];

console.log(fruits.join()); // "苹果,香蕉,橙子"
console.log(fruits.join(", ")); // "苹果, 香蕉, 橙子"
console.log(fruits.join("-")); // "苹果-香蕉-橙子"
console.log(fruits.join("")); // "苹果香蕉橙子"
```

### 6.2 toString()

将数组转换为字符串。

```javascript
let fruits = ["苹果", "香蕉", "橙子"];
console.log(fruits.toString()); // "苹果,香蕉,橙子"
```

### 6.3 toLocaleString()

将数组转换为本地化的字符串。

```javascript
let numbers = [1234, 5678, 9012];
console.log(numbers.toLocaleString()); // "1,234,5,678,9,012" (根据本地设置可能不同)

let dates = [new Date(2023, 0, 1), new Date(2023, 1, 1)];
console.log(dates.toLocaleString()); // "2023/1/1 00:00:00,2023/2/1 00:00:00" (根据本地设置可能不同)
```

## 7. 数组的高级方法

### 7.1 flat() (ES10+)

将嵌套数组扁平化为指定深度的数组。

```javascript
let nestedArray = [1, [2, [3, [4]]]];

// 默认扁平化一层
let flat1 = nestedArray.flat();
console.log(flat1); // [1, 2, [3, [4]]]

// 扁平化指定层数
let flat2 = nestedArray.flat(2);
console.log(flat2); // [1, 2, 3, [4]]

// 扁平化所有层
let flatInfinity = nestedArray.flat(Infinity);
console.log(flatInfinity); // [1, 2, 3, 4]
```

### 7.2 flatMap() (ES10+)

先对数组中的每个元素执行 map()，然后将结果扁平化为一层。

```javascript
let numbers = [1, 2, 3];

// 等价于 numbers.map(num => [num * 2]).flat()
let doubled = numbers.flatMap(num => [num * 2]);
console.log(doubled); // [2, 4, 6]

// 更复杂的例子
let sentences = ["Hello world", "I love JavaScript"];
let words = sentences.flatMap(sentence => sentence.split(" "));
console.log(words); // ["Hello", "world", "I", "love", "JavaScript"]
```

### 7.3 fill() (ES6+)

用一个固定值填充数组中的所有元素。

```javascript
// 填充整个数组
let array = [1, 2, 3, 4, 5];
array.fill(0);
console.log(array); // [0, 0, 0, 0, 0]

// 填充指定范围
let array2 = [1, 2, 3, 4, 5];
array2.fill(0, 1, 4); // 从索引 1 开始，到索引 4 结束（不包括索引 4）
console.log(array2); // [1, 0, 0, 0, 5]
```

### 7.4 copyWithin() (ES6+)

将数组中的一部分元素复制到同一数组的另一位置。

```javascript
let array = [1, 2, 3, 4, 5];

// 将索引 0 开始的元素复制到索引 2 开始的位置，复制 2 个元素
array.copyWithin(2, 0, 2);
console.log(array); // [1, 2, 1, 2, 5]

// 将索引 -2 开始的元素复制到索引 0 开始的位置
let array2 = [1, 2, 3, 4, 5];
array2.copyWithin(0, -2);
console.log(array2); // [4, 5, 3, 4, 5]
```

## 8. 数组的遍历器方法

### 8.1 keys()

返回数组索引的遍历器。

```javascript
let fruits = ["苹果", "香蕉", "橙子"];

for (let index of fruits.keys()) {
  console.log(index); // 0, 1, 2
}
```

### 8.2 values() (ES6+)

返回数组值的遍历器。

```javascript
let fruits = ["苹果", "香蕉", "橙子"];

for (let value of fruits.values()) {
  console.log(value); // "苹果", "香蕉", "橙子"
}
```

### 8.3 entries()

返回数组键值对的遍历器。

```javascript
let fruits = ["苹果", "香蕉", "橙子"];

for (let [index, value] of fruits.entries()) {
  console.log(index, value); // 0 "苹果", 1 "香蕉", 2 "橙子"
}
```

## 9. 学习重点

1. 掌握各种数组创建方式的语法和使用场景
2. 理解并熟练使用数组的基本操作（添加、删除、查找、切片等）
3. 掌握数组的迭代方法（forEach、map、filter、reduce 等）的使用
4. 理解并熟练使用数组的高级方法（flat、flatMap、fill 等）
5. 学会使用数组的排序和转换方法
6. 注意数组方法对原数组的影响（修改原数组 vs 返回新数组）

## 10. 练习

1. 写出一个数组，包含 1 到 10 的数字，然后使用 map() 方法将每个数字翻倍
2. 使用 filter() 方法从数组 [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] 中筛选出奇数
3. 使用 reduce() 方法计算数组 [2, 4, 6, 8, 10] 的和
4. 写出一个嵌套数组，然后使用 flat() 方法将其扁平化为一维数组
5. 解释 map() 和 flatMap() 方法的区别

## 11. 参考资料

- [MDN Web Docs: 数组](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [JavaScript.info: 数组](https://javascript.info/array)
- [JavaScript.info: 数组方法](https://javascript.info/array-methods)
