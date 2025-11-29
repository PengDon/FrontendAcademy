# 数组（Array）知识点

## 基本概念

数组是一种线性数据结构，它将相同类型的元素存储在连续的内存位置。在JavaScript中，数组可以存储不同类型的元素，并且长度是动态可变的。

## JavaScript 数组操作

### 创建数组
```javascript
// 字面量方式
const arr1 = [1, 2, 3, 4, 5];

// 构造函数方式
const arr2 = new Array(5); // 创建长度为5的空数组
const arr3 = new Array(1, 2, 3); // 创建包含元素1,2,3的数组

// 使用Array.of
const arr4 = Array.of(1, 2, 3);

// 使用Array.from
const arr5 = Array.from({ length: 5 }, (_, i) => i * 2); // [0, 2, 4, 6, 8]
```

### 基本操作

**添加元素：**
```javascript
// 在末尾添加
arr.push(6); // 返回新长度

// 在开头添加
arr.unshift(0); // 返回新长度

// 在指定位置添加
arr.splice(2, 0, 'a'); // 在索引2处添加'a'
```

**删除元素：**
```javascript
// 删除末尾元素
arr.pop(); // 返回被删除的元素

// 删除开头元素
arr.shift(); // 返回被删除的元素

// 删除指定位置的元素
arr.splice(2, 1); // 从索引2开始删除1个元素
```

**查找元素：**
```javascript
// 查找索引
arr.indexOf(3); // 返回第一次出现的索引，不存在返回-1
arr.lastIndexOf(3); // 返回最后一次出现的索引

// 查找元素
arr.includes(3); // 返回布尔值
arr.find(item => item > 3); // 返回第一个满足条件的元素
arr.findIndex(item => item > 3); // 返回第一个满足条件的元素的索引
```

**遍历数组：**
```javascript
// for循环
for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
}

// forEach
arr.forEach((item, index) => {
    console.log(item, index);
});

// map - 返回新数组
const doubled = arr.map(item => item * 2);

// filter - 返回满足条件的新数组
const evens = arr.filter(item => item % 2 === 0);

// reduce - 累积计算
const sum = arr.reduce((acc, item) => acc + item, 0);
```

## 常见算法

### 二分查找
```javascript
function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;
}
```

### 数组排序（冒泡排序）
```javascript
function bubbleSort(arr) {
    const len = arr.length;
    
    for (let i = 0; i < len - 1; i++) {
        let swapped = false;
        
        for (let j = 0; j < len - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                // 交换元素
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
            }
        }
        
        // 如果没有交换，说明已经有序
        if (!swapped) break;
    }
    
    return arr;
}
```

## 常见问题与答案

### 1. 数组和链表的区别是什么？
**答案：**
- **数组**：元素存储在连续的内存空间，随机访问效率高（O(1)），但插入和删除操作效率低（O(n)）
- **链表**：元素通过指针连接，随机访问效率低（O(n)），但插入和删除操作效率高（O(1)）

### 2. 如何判断一个变量是否为数组？
**答案：**
```javascript
// 方法1
Array.isArray(arr);

// 方法2
arr instanceof Array;

// 方法3
Object.prototype.toString.call(arr) === '[object Array]';
```

### 3. 如何实现数组去重？
**答案：**
```javascript
// 方法1：使用Set
const unique = [...new Set(arr)];

// 方法2：使用filter和indexOf
const unique = arr.filter((item, index) => arr.indexOf(item) === index);

// 方法3：使用reduce
const unique = arr.reduce((acc, item) => {
    if (!acc.includes(item)) {
        acc.push(item);
    }
    return acc;
}, []);
```

### 4. 数组的方法会改变原数组吗？
**答案：**
- **会改变原数组**：push, pop, shift, unshift, splice, sort, reverse
- **不会改变原数组**：map, filter, slice, concat, join, indexOf, includes

## 性能优化

1. **避免频繁修改数组长度**：提前确定数组大小
2. **使用适当的方法**：根据需求选择合适的数组方法
3. **批量操作**：使用Array.from或map代替多次push
4. **避免在循环中使用delete**：delete会在数组中留下空洞
5. **使用TypedArray**：对于数值类型的数据，可以使用TypedArray提高性能