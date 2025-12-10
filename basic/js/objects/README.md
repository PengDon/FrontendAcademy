# JavaScript 对象详解

JavaScript 是一种基于对象的语言，几乎所有东西都是对象。理解对象是掌握 JavaScript 的核心。

## 1. 对象概述

对象是键值对的集合，其中键是字符串（或 Symbol），值可以是任何数据类型（包括其他对象）。

```javascript
let person = {
  name: "John",
  age: 30,
  city: "New York",
  greet: function() {
    return "Hello, " + this.name + "!";
  }
};
```

## 2. 对象的创建

### 2.1 对象字面量

最常用的创建对象的方式。

```javascript
let emptyObject = {};

let person = {
  name: "John",
  age: 30
};
```

### 2.2 Object 构造函数

使用 Object 构造函数创建对象。

```javascript
let person = new Object();
person.name = "John";
person.age = 30;
```

### 2.3 Object.create() 方法

使用现有对象作为原型创建新对象。

```javascript
let personPrototype = {
  greet: function() {
    return "Hello, " + this.name + "!";
  }
};

let person = Object.create(personPrototype);
person.name = "John";
person.age = 30;

console.log(person.greet()); // "Hello, John!"
```

### 2.4 构造函数

使用自定义构造函数创建对象。

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.greet = function() {
    return "Hello, " + this.name + "!";
  };
}

let person = new Person("John", 30);
console.log(person.greet()); // "Hello, John!"
```

### 2.5 类 (ES6+)

ES6 引入了类的语法糖，基于原型继承。

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  greet() {
    return "Hello, " + this.name + "!";
  }
}

let person = new Person("John", 30);
console.log(person.greet()); // "Hello, John!"
```

## 3. 对象属性的访问

### 3.1 点表示法

```javascript
let person = {
  name: "John",
  age: 30
};

console.log(person.name); // "John"
console.log(person.age); // 30
```

### 3.2 方括号表示法

```javascript
let person = {
  name: "John",
  age: 30
};

console.log(person["name"]); // "John"
console.log(person["age"]); // 30

// 可以使用变量作为属性名
let propName = "name";
console.log(person[propName]); // "John"

// 可以使用包含特殊字符的属性名
let obj = {
  "first name": "John"
};
console.log(obj["first name"]); // "John"
```

## 4. 对象属性的修改

### 4.1 添加新属性

```javascript
let person = {
  name: "John"
};

// 添加新属性
person.age = 30;
person["city"] = "New York";

console.log(person); // { name: "John", age: 30, city: "New York" }
```

### 4.2 修改现有属性

```javascript
let person = {
  name: "John",
  age: 30
};

// 修改现有属性
person.age = 31;
person["name"] = "Jane";

console.log(person); // { name: "Jane", age: 31 }
```

### 4.3 删除属性

使用 delete 操作符删除对象的属性。

```javascript
let person = {
  name: "John",
  age: 30,
  city: "New York"
};

delete person.age;
console.log(person); // { name: "John", city: "New York" }
```

## 5. 对象属性的特性

每个对象属性都有四个特性：
- value: 属性的值
- writable: 是否可以修改属性的值
- enumerable: 是否可以通过 for...in 循环或 Object.keys() 遍历
- configurable: 是否可以删除属性或修改属性的特性

### 5.1 Object.defineProperty()

用于定义或修改对象的属性特性。

```javascript
let person = {};

Object.defineProperty(person, "name", {
  value: "John",
  writable: false,
  enumerable: true,
  configurable: true
});

console.log(person.name); // "John"
person.name = "Jane"; // 严格模式下会报错，非严格模式下会静默失败
console.log(person.name); // 仍然是 "John"
```

### 5.2 Object.defineProperties()

用于同时定义或修改多个属性。

```javascript
let person = {};

Object.defineProperties(person, {
  name: {
    value: "John",
    writable: true
  },
  age: {
    value: 30,
    writable: false
  }
});

console.log(person.name); // "John"
console.log(person.age); // 30
```

### 5.3 Object.getOwnPropertyDescriptor()

获取属性的特性描述。

```javascript
let person = {
  name: "John",
  age: 30
};

let descriptor = Object.getOwnPropertyDescriptor(person, "name");
console.log(descriptor);
// {
//   value: "John",
//   writable: true,
//   enumerable: true,
//   configurable: true
// }
```

## 6. 对象的方法

### 6.1 Object.keys()

返回对象自身可枚举属性的数组。

```javascript
let person = {
  name: "John",
  age: 30,
  city: "New York"
};

let keys = Object.keys(person);
console.log(keys); // ["name", "age", "city"]
```

### 6.2 Object.values() (ES8+)

返回对象自身可枚举属性值的数组。

```javascript
let person = {
  name: "John",
  age: 30,
  city: "New York"
};

let values = Object.values(person);
console.log(values); // ["John", 30, "New York"]
```

### 6.3 Object.entries() (ES8+)

返回对象自身可枚举属性的键值对数组。

```javascript
let person = {
  name: "John",
  age: 30,
  city: "New York"
};

let entries = Object.entries(person);
console.log(entries); // [["name", "John"], ["age", 30], ["city", "New York"]]
```

### 6.4 Object.assign()

将所有可枚举属性从一个或多个源对象复制到目标对象。

```javascript
let target = {
  a: 1
};

let source1 = {
  b: 2
};

let source2 = {
  c: 3
};

let result = Object.assign(target, source1, source2);
console.log(result); // { a: 1, b: 2, c: 3 }
console.log(target === result); // true (返回的是目标对象)
```

### 6.5 Object.freeze()

冻结对象，防止添加、删除或修改属性。

```javascript
let person = {
  name: "John",
  age: 30
};

Object.freeze(person);

person.age = 31; // 严格模式下会报错
person.city = "New York"; // 严格模式下会报错
delete person.name; // 严格模式下会报错

console.log(person); // 仍然是 { name: "John", age: 30 }
console.log(Object.isFrozen(person)); // true
```

### 6.6 Object.seal()

密封对象，防止添加或删除属性，但可以修改现有属性。

```javascript
let person = {
  name: "John",
  age: 30
};

Object.seal(person);

person.age = 31; // 可以修改
person.city = "New York"; // 严格模式下会报错
delete person.name; // 严格模式下会报错

console.log(person); // { name: "John", age: 31 }
console.log(Object.isSealed(person)); // true
```

## 7. 对象的比较

对象是引用类型，比较的是引用（内存地址）。

```javascript
let obj1 = {
  name: "John"
};

let obj2 = {
  name: "John"
};

let obj3 = obj1;

console.log(obj1 === obj2); // false (引用不同)
console.log(obj1 === obj3); // true (引用相同)
console.log(obj1 == obj2); // false (仍然比较引用)

// 深度比较对象的值
function deepEqual(obj1, obj2) {
  if (obj1 === obj2) return true;
  
  if (obj1 == null || typeof obj1 != "object" ||
      obj2 == null || typeof obj2 != "object") return false;
  
  let keys1 = Object.keys(obj1);
  let keys2 = Object.keys(obj2);
  
  if (keys1.length != keys2.length) return false;
  
  for (let key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) return false;
  }
  
  return true;
}

console.log(deepEqual(obj1, obj2)); // true
```

## 8. 原型和继承

### 8.1 原型链

每个 JavaScript 对象都有一个原型对象，对象从原型继承属性和方法。

```javascript
let person = {
  name: "John",
  age: 30
};

// 获取对象的原型
console.log(Object.getPrototypeOf(person)); // Object.prototype
console.log(person.__proto__); // Object.prototype (不推荐使用)

// 检查对象是否有某个属性（包括继承的）
console.log('name' in person); // true
console.log('toString' in person); // true (继承自 Object.prototype)

// 检查对象是否有某个自身属性
console.log(person.hasOwnProperty('name')); // true
console.log(person.hasOwnProperty('toString')); // false
```

### 8.2 构造函数的原型

构造函数有一个 prototype 属性，指向实例对象的原型。

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}

// 在构造函数的原型上添加方法
Person.prototype.greet = function() {
  return "Hello, " + this.name + "!";
};

let person1 = new Person("John", 30);
let person2 = new Person("Jane", 25);

console.log(person1.greet()); // "Hello, John!"
console.log(person2.greet()); // "Hello, Jane!"
console.log(person1.__proto__ === Person.prototype); // true
```

### 8.3 继承

JavaScript 使用原型链实现继承。

```javascript
// 父类
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function() {
  return "Hello, " + this.name + "!";
};

// 子类
function Student(name, major) {
  // 调用父类构造函数
  Person.call(this, name);
  this.major = major;
}

// 设置原型链
Student.prototype = Object.create(Person.prototype);

// 修复 constructor 属性
Student.prototype.constructor = Student;

// 添加子类特有的方法
Student.prototype.study = function() {
  return this.name + " is studying " + this.major + ".";
};

let student = new Student("John", "Computer Science");
console.log(student.greet()); // "Hello, John!" (继承自 Person)
console.log(student.study()); // "John is studying Computer Science." (子类特有)
```

## 9. 对象的解构赋值 (ES6+)

解构赋值允许从对象中提取属性并赋值给变量。

```javascript
let person = {
  name: "John",
  age: 30,
  city: "New York"
};

// 基本解构
let { name, age } = person;
console.log(name); // "John"
console.log(age); // 30

// 重命名变量
let { name: fullName, city: homeCity } = person;
console.log(fullName); // "John"
console.log(homeCity); // "New York"

// 默认值
let { country = "USA" } = person;
console.log(country); // "USA"

// 嵌套解构
let obj = {
  user: {
    name: "John",
    address: {
      city: "New York"
    }
  }
};

let { user: { name, address: { city } } } = obj;
console.log(name); // "John"
console.log(city); // "New York"
```

## 10. 计算属性名 (ES6+)

可以使用表达式作为对象的属性名。

```javascript
let propName = "name";
let obj = {
  [propName]: "John",
  [`${propName}_length`]: "John".length
};

console.log(obj); // { name: "John", name_length: 4 }
```

## 11. 对象的扩展运算符 (ES8+)

可以使用扩展运算符复制对象或合并对象。

```javascript
// 复制对象
let person = {
  name: "John",
  age: 30
};

let personCopy = { ...person };
console.log(personCopy); // { name: "John", age: 30 }

// 合并对象
let obj1 = {
  a: 1,
  b: 2
};

let obj2 = {
  b: 3,
  c: 4
};

let merged = { ...obj1, ...obj2 };
console.log(merged); // { a: 1, b: 3, c: 4 } (后面的对象覆盖前面的同名属性)
```

## 12. 学习重点

1. 掌握各种对象创建方式（对象字面量、构造函数、类等）的语法和使用场景
2. 理解对象属性的特性（value、writable、enumerable、configurable）
3. 掌握对象的常用方法（Object.keys()、Object.values()、Object.assign() 等）
4. 理解原型和原型链的概念
5. 掌握 JavaScript 的继承机制
6. 学会使用 ES6+ 中与对象相关的新特性（解构赋值、计算属性名、扩展运算符等）

## 13. 练习

1. 创建一个包含姓名、年龄和城市属性的对象
2. 为该对象添加一个方法，返回完整的个人信息
3. 使用 Object.defineProperty() 定义一个只读属性
4. 解释对象的原型链是什么
5. 如何深拷贝一个对象？

## 14. 参考资料

- [MDN Web Docs: 对象](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects)
- [JavaScript.info: 对象](https://javascript.info/object-basics)
- [JavaScript.info: 原型继承](https://javascript.info/prototype-inheritance)
- [JavaScript.info: 类](https://javascript.info/classes)
