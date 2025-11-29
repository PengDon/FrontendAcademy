# 递归函数（Recursion）

## 基本概念

递归是一种解决问题的方法，其中函数通过调用自身来解决问题。递归函数通常包含两个部分：

1. **基线条件（Base Case）**：确定何时停止递归，防止无限递归
2. **递归步骤（Recursive Step）**：函数调用自身，但问题规模减小

递归是函数式编程的重要特性，它允许我们以声明式的方式解决复杂问题，避免了显式的循环结构。

## 递归的基本结构

一个标准的递归函数结构如下：

```javascript
function recursiveFunction(parameters) {
  // 基线条件：停止递归的条件
  if (baseCaseCondition) {
    return baseCaseValue;
  }
  
  // 递归步骤：调用自身，但问题规模减小
  return recursiveFunction(modifiedParameters);
}
```

## 常见递归示例

### 1. 阶乘计算

阶乘是递归的经典例子。n的阶乘（记作n!）是1到n的所有整数的乘积。

```javascript
function factorial(n) {
  // 基线条件：0! = 1
  if (n === 0) {
    return 1;
  }
  
  // 递归步骤：n! = n * (n-1)!
  return n * factorial(n - 1);
}

console.log(factorial(5)); // 120 = 5 * 4 * 3 * 2 * 1 * 1
```

### 2. 斐波那契数列

斐波那契数列定义为：F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2)（n > 1）

```javascript
function fibonacci(n) {
  // 基线条件：F(0) = 0, F(1) = 1
  if (n <= 1) {
    return n;
  }
  
  // 递归步骤：F(n) = F(n-1) + F(n-2)
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55
```

### 3. 数组求和

```javascript
function sumArray(arr, index = 0) {
  // 基线条件：到达数组末尾
  if (index >= arr.length) {
    return 0;
  }
  
  // 递归步骤：当前元素 + 剩余元素的和
  return arr[index] + sumArray(arr, index + 1);
}

console.log(sumArray([1, 2, 3, 4, 5])); // 15
```

### 4. 字符串反转

```javascript
function reverseString(str) {
  // 基线条件：空字符串或只有一个字符
  if (str.length <= 1) {
    return str;
  }
  
  // 递归步骤：最后一个字符 + 剩余部分反转
  return str[str.length - 1] + reverseString(str.slice(0, -1));
}

console.log(reverseString('hello')); // 'olleh'
```

### 5. 计算最大公约数（GCD）

使用欧几里得算法计算两个数的最大公约数：

```javascript
function gcd(a, b) {
  // 基线条件：当b为0时，a即为最大公约数
  if (b === 0) {
    return a;
  }
  
  // 递归步骤：gcd(a, b) = gcd(b, a % b)
  return gcd(b, a % b);
}

console.log(gcd(48, 18)); // 6
```

## 尾递归优化

在标准递归中，函数在递归调用返回后还需要执行操作（如乘法或加法）。这会导致调用栈不断增长，可能引起栈溢出错误。尾递归是一种特殊形式的递归，其中递归调用是函数的最后一个操作。

### 尾递归优化的阶乘函数

```javascript
function factorialTail(n, accumulator = 1) {
  // 基线条件
  if (n === 0) {
    return accumulator;
  }
  
  // 尾递归调用：将中间结果作为参数传递
  return factorialTail(n - 1, n * accumulator);
}

console.log(factorialTail(5)); // 120
```

### 尾递归优化的斐波那契函数

```javascript
function fibonacciTail(n, a = 0, b = 1) {
  // 基线条件
  if (n === 0) {
    return a;
  }
  
  // 尾递归调用
  return fibonacciTail(n - 1, b, a + b);
}

console.log(fibonacciTail(10)); // 55
```

> 注意：虽然ES6规范中提到了尾调用优化，但并不是所有JavaScript引擎都实现了这一优化。在没有尾调用优化的环境中，即使使用了尾递归形式，仍可能遇到栈溢出问题。

## 记忆化递归

对于具有重复计算的递归问题，可以使用记忆化技术来缓存已计算的结果，避免重复计算。

### 记忆化的斐波那契函数

```javascript
function memoize(fn) {
  const cache = {};
  return function(...args) {
    const key = JSON.stringify(args);
    if (key in cache) {
      return cache[key];
    }
    const result = fn(...args);
    cache[key] = result;
    return result;
  };
}

const memoizedFibonacci = memoize(function(n) {
  if (n <= 1) return n;
  return memoizedFibonacci(n - 1) + memoizedFibonacci(n - 2);
});

console.log(memoizedFibonacci(40)); // 快速计算较大的斐波那契数
```

## 递归与循环的对比

### 递归的优点

1. **代码更简洁、更易读**：对于某些问题，递归实现更接近问题的数学定义
2. **更易于实现**：对于树、图等递归数据结构，递归实现更自然
3. **不需要维护循环变量**：避免了循环中的状态管理

### 递归的缺点

1. **可能导致栈溢出**：对于深度递归，可能超出调用栈的限制
2. **效率较低**：重复计算和函数调用开销
3. **调试困难**：递归调用栈可能很复杂

### 何时使用递归

- **问题具有自相似性质**：如树遍历、分治算法等
- **数据结构是递归的**：如树、链表等
- **代码清晰度比性能更重要**：递归通常使代码更简洁

## 高级递归模式

### 1. 分治法（Divide and Conquer）

分治法将问题分解为更小的子问题，解决子问题，然后合并结果。

```javascript
// 快速排序 - 分治法的典型应用
function quickSort(arr) {
  // 基线条件
  if (arr.length <= 1) {
    return arr;
  }
  
  // 选择基准元素
  const pivot = arr[Math.floor(arr.length / 2)];
  
  // 分解：将数组分为小于、等于、大于基准的三部分
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);
  
  // 递归解决子问题并合并结果
  return [...quickSort(left), ...middle, ...quickSort(right)];
}

console.log(quickSort([3, 1, 4, 1, 5, 9, 2, 6])); // [1, 1, 2, 3, 4, 5, 6, 9]
```

### 2. 回溯法（Backtracking）

回溯法通过尝试分步解决问题，当发现当前步骤不满足条件时，回退并尝试其他可能。

```javascript
// 八皇后问题 - 回溯法的典型应用
function solveNQueens(n) {
  const solutions = [];
  const board = Array(n).fill().map(() => Array(n).fill('.'));
  
  function isSafe(row, col) {
    // 检查列
    for (let i = 0; i < row; i++) {
      if (board[i][col] === 'Q') return false;
    }
    
    // 检查左上对角线
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === 'Q') return false;
    }
    
    // 检查右上对角线
    for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
      if (board[i][j] === 'Q') return false;
    }
    
    return true;
  }
  
  function backtrack(row) {
    // 基线条件：所有皇后都放置好了
    if (row === n) {
      solutions.push(board.map(row => row.join('')));
      return;
    }
    
    // 尝试在当前行的每一列放置皇后
    for (let col = 0; col < n; col++) {
      if (isSafe(row, col)) {
        // 放置皇后
        board[row][col] = 'Q';
        
        // 递归到下一行
        backtrack(row + 1);
        
        // 回溯：移除皇后
        board[row][col] = '.';
      }
    }
  }
  
  backtrack(0);
  return solutions;
}

console.log(solveNQueens(4)); // 返回8皇后问题的所有解决方案
```

### 3. 动态规划（Dynamic Programming）的递归实现

动态规划可以通过递归+记忆化来实现，避免重复计算。

```javascript
// 最长公共子序列问题
function longestCommonSubsequence(text1, text2) {
  // 创建缓存
  const memo = new Map();
  
  function lcs(i, j) {
    // 基线条件：任一字符串到达末尾
    if (i === text1.length || j === text2.length) {
      return 0;
    }
    
    // 检查缓存
    const key = `${i},${j}`;
    if (memo.has(key)) {
      return memo.get(key);
    }
    
    let result;
    if (text1[i] === text2[j]) {
      // 字符匹配，计入结果
      result = 1 + lcs(i + 1, j + 1);
    } else {
      // 字符不匹配，尝试两种可能性
      result = Math.max(lcs(i + 1, j), lcs(i, j + 1));
    }
    
    // 缓存结果
    memo.set(key, result);
    return result;
  }
  
  return lcs(0, 0);
}

console.log(longestCommonSubsequence('abcde', 'ace')); // 3
```

## 递归在函数式编程中的应用

### 递归替代循环

在函数式编程中，通常使用递归来替代for和while循环，保持代码的声明式风格。

```javascript
// 函数式的forEach实现
function forEach(arr, fn, index = 0) {
  if (index >= arr.length) return;
  fn(arr[index], index, arr);
  return forEach(arr, fn, index + 1);
}

// 函数式的map实现
function map(arr, fn, index = 0, result = []) {
  if (index >= arr.length) return result;
  result.push(fn(arr[index], index, arr));
  return map(arr, fn, index + 1, result);
}

// 函数式的filter实现
function filter(arr, fn, index = 0, result = []) {
  if (index >= arr.length) return result;
  if (fn(arr[index], index, arr)) {
    result.push(arr[index]);
  }
  return filter(arr, fn, index + 1, result);
}

// 函数式的reduce实现
function reduce(arr, fn, accumulator, index = 0) {
  if (index >= arr.length) return accumulator;
  const newAccumulator = fn(accumulator, arr[index], index, arr);
  return reduce(arr, fn, newAccumulator, index + 1);
}
```

### 递归处理嵌套数据结构

递归非常适合处理嵌套的数据结构，如树、嵌套对象等。

```javascript
// 递归遍历嵌套对象
function traverseNestedObject(obj, fn, path = '') {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newPath = path ? `${path}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        // 递归处理嵌套对象
        traverseNestedObject(obj[key], fn, newPath);
      } else {
        // 应用函数到叶子节点
        fn(obj[key], newPath);
      }
    }
  }
}

// 示例
const nestedData = {
  user: {
    name: 'John',
    contact: {
      email: 'john@example.com',
      phone: '123-456-7890'
    },
    preferences: {
      theme: 'dark',
      notifications: true
    }
  }
};

// 收集所有叶子节点的值
const values = [];
traverseNestedObject(nestedData, (value, path) => {
  values.push({ path, value });
});

console.log(values);
```

### 树结构的递归操作

```javascript
// 二叉树节点类
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

// 前序遍历（根-左-右）
function preorderTraversal(root, result = []) {
  if (!root) return result;
  
  // 访问根节点
  result.push(root.value);
  
  // 递归遍历左子树
  preorderTraversal(root.left, result);
  
  // 递归遍历右子树
  preorderTraversal(root.right, result);
  
  return result;
}

// 中序遍历（左-根-右）
function inorderTraversal(root, result = []) {
  if (!root) return result;
  
  // 递归遍历左子树
  inorderTraversal(root.left, result);
  
  // 访问根节点
  result.push(root.value);
  
  // 递归遍历右子树
  inorderTraversal(root.right, result);
  
  return result;
}

// 后序遍历（左-右-根）
function postorderTraversal(root, result = []) {
  if (!root) return result;
  
  // 递归遍历左子树
  postorderTraversal(root.left, result);
  
  // 递归遍历右子树
  postorderTraversal(root.right, result);
  
  // 访问根节点
  result.push(root.value);
  
  return result;
}
```

## 递归的性能考虑

### 1. 避免重复计算

使用记忆化或动态规划来避免重复计算。

### 2. 防止栈溢出

- 使用尾递归形式
- 对于深度递归，考虑迭代替代
- 设置适当的递归终止条件

### 3. 优化递归调用

- 减少递归调用的次数
- 优化参数传递，避免不必要的复制
- 使用闭包缓存中间结果

## 递归的调试技巧

### 1. 添加日志

在递归函数中添加日志，打印递归的深度、参数和返回值。

```javascript
function debugFactorial(n, depth = 0) {
  const indent = '  '.repeat(depth);
  console.log(`${indent}factorial(${n}) called`);
  
  if (n === 0) {
    console.log(`${indent}factorial(${n}) returns 1`);
    return 1;
  }
  
  const result = n * debugFactorial(n - 1, depth + 1);
  console.log(`${indent}factorial(${n}) returns ${result}`);
  return result;
}
```

### 2. 限制递归深度

添加递归深度限制，防止无限递归。

```javascript
function safeRecursiveFunction(n, maxDepth = 1000, currentDepth = 0) {
  if (currentDepth >= maxDepth) {
    throw new Error('Maximum recursion depth exceeded');
  }
  
  if (n === 0) return 1;
  return n * safeRecursiveFunction(n - 1, maxDepth, currentDepth + 1);
}
```

### 3. 可视化调用栈

使用浏览器的开发者工具或Node.js的调试器来可视化递归调用栈。

## 总结

递归是一种强大的编程技术，它允许我们以简洁、声明式的方式解决复杂问题。在函数式编程中，递归是替代循环的主要方法。

递归的关键要素：

1. **基线条件**：确定何时停止递归
2. **递归步骤**：确保问题规模逐渐减小
3. **优化技术**：
   - 尾递归优化
   - 记忆化
   - 动态规划

递归在以下场景特别有用：

- 分治算法
- 回溯问题
- 树和图的遍历
- 嵌套数据结构的处理
- 数学归纳法问题

通过合理使用递归，我们可以编写出更优雅、更易于理解和维护的代码。