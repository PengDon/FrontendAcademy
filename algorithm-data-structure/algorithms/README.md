# 算法基础

## 什么是算法

算法是解决问题的精确步骤的有限集合。一个好的算法应该具备以下特性：

- **输入**：有零个或多个输入
- **输出**：至少有一个输出
- **确定性**：每一步都明确定义，不会产生歧义
- **有限性**：算法在有限步骤后必须终止
- **有效性**：每一步都可以在有限时间内完成

## 算法分析

### 时间复杂度

时间复杂度描述了算法运行时间与输入规模之间的关系，通常使用大O符号（Big O notation）表示：

- **O(1)**：常数时间复杂度
- **O(log n)**：对数时间复杂度
- **O(n)**：线性时间复杂度
- **O(n log n)**：线性对数时间复杂度
- **O(n²)**：平方时间复杂度
- **O(2ⁿ)**：指数时间复杂度
- **O(n!)**：阶乘时间复杂度

### 空间复杂度

空间复杂度描述了算法所需内存空间与输入规模之间的关系。

## 算法分类

### 1. 排序算法

#### 冒泡排序 (Bubble Sort)

冒泡排序是一种简单的排序算法，它重复地走访过要排序的数列，一次比较两个元素，如果它们的顺序错误就把它们交换过来。

```javascript
function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // 交换元素
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

// 示例
const array = [64, 34, 25, 12, 22, 11, 90];
console.log(bubbleSort(array)); // [11, 12, 22, 25, 34, 64, 90]
```

#### 选择排序 (Selection Sort)

选择排序是一种简单直观的排序算法。它的工作原理是每一次从待排序的数据元素中选出最小（或最大）的一个元素，存放在序列的起始位置，然后再从剩余的未排序元素中寻找到最小（大）元素，然后放到已排序的序列的末尾。

```javascript
function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    // 交换元素
    [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
  }
  return arr;
}

// 示例
const array = [64, 34, 25, 12, 22, 11, 90];
console.log(selectionSort(array)); // [11, 12, 22, 25, 34, 64, 90]
```

#### 插入排序 (Insertion Sort)

插入排序是一种简单直观的排序算法。它的工作原理是通过构建有序序列，对于未排序数据，在已排序序列中从后向前扫描，找到相应位置并插入。

```javascript
function insertionSort(arr) {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    
    // 将比key大的元素向右移动
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}

// 示例
const array = [64, 34, 25, 12, 22, 11, 90];
console.log(insertionSort(array)); // [11, 12, 22, 25, 34, 64, 90]
```

#### 归并排序 (Merge Sort)

归并排序是建立在归并操作上的一种有效的排序算法。该算法是采用分治法（Divide and Conquer）的一个非常典型的应用。

```javascript
function mergeSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }
  
  // 分割数组
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  // 合并两个有序数组
  return merge(left, right);
}

function merge(left, right) {
  let result = [];
  let leftIndex = 0;
  let rightIndex = 0;
  
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }
  
  // 合并剩余元素
  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

// 示例
const array = [64, 34, 25, 12, 22, 11, 90];
console.log(mergeSort(array)); // [11, 12, 22, 25, 34, 64, 90]
```

#### 快速排序 (Quick Sort)

快速排序是对冒泡排序的一种改进。它的基本思想是：通过一趟排序将要排序的数据分割成独立的两部分，其中一部分的所有数据都比另外一部分的所有数据都要小，然后再按此方法对这两部分数据分别进行快速排序。

```javascript
function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }
  
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = [];
  const middle = [];
  const right = [];
  
  for (let element of arr) {
    if (element < pivot) {
      left.push(element);
    } else if (element > pivot) {
      right.push(element);
    } else {
      middle.push(element);
    }
  }
  
  return quickSort(left).concat(middle).concat(quickSort(right));
}

// 示例
const array = [64, 34, 25, 12, 22, 11, 90];
console.log(quickSort(array)); // [11, 12, 22, 25, 34, 64, 90]
```

#### 堆排序 (Heap Sort)

堆排序是指利用堆这种数据结构所设计的一种排序算法。堆是一个近似完全二叉树的结构，并同时满足堆的性质：即子节点的键值或索引总是小于（或者大于）它的父节点。

```javascript
function heapSort(arr) {
  let n = arr.length;
  
  // 构建最大堆
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  
  // 一个个从堆顶取出元素
  for (let i = n - 1; i > 0; i--) {
    // 将当前堆顶（最大值）移到数组末尾
    [arr[0], arr[i]] = [arr[i], arr[0]];
    
    // 对剩余的堆进行调整
    heapify(arr, i, 0);
  }
  
  return arr;
}

function heapify(arr, n, i) {
  let largest = i; // 初始化largest为根节点
  let left = 2 * i + 1; // 左子节点
  let right = 2 * i + 2; // 右子节点
  
  // 如果左子节点大于根节点
  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }
  
  // 如果右子节点大于目前的最大值
  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }
  
  // 如果最大值不是根节点
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    
    // 递归地堆化被影响的子树
    heapify(arr, n, largest);
  }
}

// 示例
const array = [64, 34, 25, 12, 22, 11, 90];
console.log(heapSort(array)); // [11, 12, 22, 25, 34, 64, 90]
```

### 2. 搜索算法

#### 线性搜索 (Linear Search)

线性搜索是一种最简单的搜索算法，它从数组的一端开始，逐个检查每个元素，直到找到目标值或遍历完整个数组。

```javascript
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i; // 返回目标元素的索引
    }
  }
  return -1; // 目标元素不存在
}

// 示例
const array = [64, 34, 25, 12, 22, 11, 90];
console.log(linearSearch(array, 25)); // 2
console.log(linearSearch(array, 100)); // -1
```

#### 二分搜索 (Binary Search)

二分搜索要求数组必须是有序的。它通过将目标值与数组中间元素比较，如果相等则返回索引；如果目标值小于中间元素，则在左半部分继续搜索；如果目标值大于中间元素，则在右半部分继续搜索。

```javascript
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid; // 找到目标
    } else if (arr[mid] < target) {
      left = mid + 1; // 搜索右半部分
    } else {
      right = mid - 1; // 搜索左半部分
    }
  }
  
  return -1; // 未找到目标
}

// 示例
const sortedArray = [11, 12, 22, 25, 34, 64, 90];
console.log(binarySearch(sortedArray, 25)); // 3
console.log(binarySearch(sortedArray, 100)); // -1
```

#### 深度优先搜索 (DFS)

深度优先搜索是一种用于遍历或搜索树或图的算法。沿着树的深度遍历树的节点，尽可能深的搜索树的分支。当节点v的所在边都己被探寻过，搜索将回溯到发现节点v的那条边的起始节点。

```javascript
// 树节点类
class TreeNode {
  constructor(value) {
    this.value = value;
    this.children = [];
  }
  
  addChild(node) {
    this.children.push(node);
    return this;
  }
}

// 深度优先搜索 - 递归实现
function dfsRecursive(node, target) {
  if (!node) return null;
  
  console.log(`访问节点: ${node.value}`);
  
  if (node.value === target) {
    return node;
  }
  
  for (let child of node.children) {
    const result = dfsRecursive(child, target);
    if (result) {
      return result;
    }
  }
  
  return null;
}

// 深度优先搜索 - 迭代实现
function dfsIterative(root, target) {
  if (!root) return null;
  
  const stack = [root];
  
  while (stack.length > 0) {
    const node = stack.pop();
    console.log(`访问节点: ${node.value}`);
    
    if (node.value === target) {
      return node;
    }
    
    // 注意：为了保持顺序，将子节点逆序入栈
    for (let i = node.children.length - 1; i >= 0; i--) {
      stack.push(node.children[i]);
    }
  }
  
  return null;
}

// 示例
const root = new TreeNode(1);
const node2 = new TreeNode(2);
const node3 = new TreeNode(3);
const node4 = new TreeNode(4);
const node5 = new TreeNode(5);
const node6 = new TreeNode(6);

root.addChild(node2).addChild(node3);
node2.addChild(node4).addChild(node5);
node3.addChild(node6);

console.log('递归DFS:');
const result1 = dfsRecursive(root, 5);
console.log(`找到节点: ${result1 ? result1.value : null}`);

console.log('\n迭代DFS:');
const result2 = dfsIterative(root, 6);
console.log(`找到节点: ${result2 ? result2.value : null}`);
```

#### 广度优先搜索 (BFS)

广度优先搜索是一种图形搜索算法。它从根节点开始，沿着树的宽度遍历树的节点。如果所有节点均被访问，则算法中止。

```javascript
// 广度优先搜索 - 迭代实现
function bfs(root, target) {
  if (!root) return null;
  
  const queue = [root];
  
  while (queue.length > 0) {
    const node = queue.shift();
    console.log(`访问节点: ${node.value}`);
    
    if (node.value === target) {
      return node;
    }
    
    // 将所有子节点入队
    for (let child of node.children) {
      queue.push(child);
    }
  }
  
  return null;
}

// 示例 - 使用上面定义的树
console.log('BFS:');
const result = bfs(root, 5);
console.log(`找到节点: ${result ? result.value : null}`);
```

### 3. 动态规划

#### 斐波那契数列 (Fibonacci Sequence)

斐波那契数列是指从 0 和 1 开始，后面的每一项都是前面两项的和。

```javascript
// 递归实现 - 时间复杂度 O(2^n)
function fibonacciRecursive(n) {
  if (n <= 1) return n;
  return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2);
}

// 动态规划实现 - 时间复杂度 O(n)
function fibonacciDP(n) {
  if (n <= 1) return n;
  
  const dp = new Array(n + 1);
  dp[0] = 0;
  dp[1] = 1;
  
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  
  return dp[n];
}

// 优化空间复杂度的动态规划 - O(1) 空间
function fibonacciOptimized(n) {
  if (n <= 1) return n;
  
  let a = 0, b = 1, c;
  
  for (let i = 2; i <= n; i++) {
    c = a + b;
    a = b;
    b = c;
  }
  
  return b;
}

// 示例
console.log(fibonacciRecursive(10)); // 55
console.log(fibonacciDP(10)); // 55
console.log(fibonacciOptimized(10)); // 55
```

#### 爬楼梯问题 (Climbing Stairs)

假设你正在爬楼梯。需要 n 阶你才能到达楼顶。每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶？

```javascript
// 动态规划实现
function climbStairs(n) {
  if (n <= 2) return n;
  
  const dp = new Array(n + 1);
  dp[1] = 1;
  dp[2] = 2;
  
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  
  return dp[n];
}

// 优化空间复杂度的实现
function climbStairsOptimized(n) {
  if (n <= 2) return n;
  
  let a = 1, b = 2, c;
  
  for (let i = 3; i <= n; i++) {
    c = a + b;
    a = b;
    b = c;
  }
  
  return b;
}

// 示例
console.log(climbStairs(3)); // 3
console.log(climbStairs(4)); // 5
console.log(climbStairsOptimized(5)); // 8
```

#### 最长公共子序列 (LCS)

最长公共子序列问题是寻找两个字符串共有的最长子序列（可以不连续）的长度。

```javascript
function longestCommonSubsequence(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  
  // 创建DP表格
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  
  return dp[m][n];
}

// 示例
console.log(longestCommonSubsequence('abcde', 'ace')); // 3
console.log(longestCommonSubsequence('abc', 'abc')); // 3
console.log(longestCommonSubsequence('abc', 'def')); // 0
```

#### 背包问题 (Knapsack Problem)

有一个背包，容量为 C。现在有 n 种物品，每种物品有且只有一个，每种物品的重量为 w[i]，价值为 v[i]。要求在不超过背包容量的前提下，使得背包中物品的总价值最大。

```javascript
function knapsack(capacity, weights, values) {
  const n = weights.length;
  
  // 创建DP表格
  // dp[i][w] 表示考虑前i个物品，背包容量为w时的最大价值
  const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));
  
  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        // 可以选择当前物品
        dp[i][w] = Math.max(
          dp[i - 1][w],
          dp[i - 1][w - weights[i - 1]] + values[i - 1]
        );
      } else {
        // 不能选择当前物品
        dp[i][w] = dp[i - 1][w];
      }
    }
  }
  
  return dp[n][capacity];
}

// 优化空间复杂度的实现 - 使用一维数组
function knapsackOptimized(capacity, weights, values) {
  const n = weights.length;
  
  // dp[w] 表示背包容量为w时的最大价值
  const dp = Array(capacity + 1).fill(0);
  
  for (let i = 0; i < n; i++) {
    // 注意：这里需要从后往前遍历，避免重复计算
    for (let w = capacity; w >= weights[i]; w--) {
      dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
    }
  }
  
  return dp[capacity];
}

// 示例
const capacity = 10;
const weights = [2, 3, 4, 5];
const values = [3, 4, 5, 6];

console.log(knapsack(capacity, weights, values)); // 13
console.log(knapsackOptimized(capacity, weights, values)); // 13
```

### 4. 贪心算法

#### 活动选择问题 (Activity Selection Problem)

给定一组活动，每个活动有开始时间和结束时间，在不重叠的情况下，选择最多的活动。

```javascript
function activitySelection(activities) {
  // 按结束时间排序
  activities.sort((a, b) => a.end - b.end);
  
  const selectedActivities = [activities[0]];
  let lastEnd = activities[0].end;
  
  for (let i = 1; i < activities.length; i++) {
    const currentActivity = activities[i];
    
    // 如果当前活动的开始时间大于等于上一个选定活动的结束时间
    if (currentActivity.start >= lastEnd) {
      selectedActivities.push(currentActivity);
      lastEnd = currentActivity.end;
    }
  }
  
  return selectedActivities;
}

// 示例
const activities = [
  { start: 1, end: 3, name: '活动1' },
  { start: 2, end: 4, name: '活动2' },
  { start: 3, end: 5, name: '活动3' },
  { start: 0, end: 6, name: '活动4' },
  { start: 5, end: 7, name: '活动5' },
  { start: 8, end: 9, name: '活动6' },
  { start: 5, end: 9, name: '活动7' }
];

const selected = activitySelection(activities);
console.log('选择的活动:');
selected.forEach(activity => {
  console.log(`${activity.name}: [${activity.start}, ${activity.end}]`);
});
// 输出: 活动1, 活动3, 活动6
```

#### 霍夫曼编码 (Huffman Coding)

霍夫曼编码是一种可变长度编码方案，用于无损数据压缩。它根据字符出现的频率分配不同长度的编码，频率越高的字符编码长度越短。

```javascript
// 霍夫曼树节点类
class HuffmanNode {
  constructor(char, freq) {
    this.char = char;
    this.freq = freq;
    this.left = null;
    this.right = null;
  }
}

// 优先队列（最小堆）实现
class MinHeap {
  constructor() {
    this.heap = [];
  }
  
  insert(node) {
    this.heap.push(node);
    this.bubbleUp(this.heap.length - 1);
  }
  
  extractMin() {
    if (this.heap.length === 1) {
      return this.heap.pop();
    }
    
    const min = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.sinkDown(0);
    
    return min;
  }
  
  size() {
    return this.heap.length;
  }
  
  bubbleUp(index) {
    const parent = Math.floor((index - 1) / 2);
    
    if (parent >= 0 && this.heap[parent].freq > this.heap[index].freq) {
      [this.heap[parent], this.heap[index]] = [this.heap[index], this.heap[parent]];
      this.bubbleUp(parent);
    }
  }
  
  sinkDown(index) {
    const left = 2 * index + 1;
    const right = 2 * index + 2;
    let smallest = index;
    
    if (left < this.heap.length && this.heap[left].freq < this.heap[smallest].freq) {
      smallest = left;
    }
    
    if (right < this.heap.length && this.heap[right].freq < this.heap[smallest].freq) {
      smallest = right;
    }
    
    if (smallest !== index) {
      [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
      this.sinkDown(smallest);
    }
  }
}

function huffmanCoding(text) {
  // 计算字符频率
  const freqMap = new Map();
  for (let char of text) {
    freqMap.set(char, (freqMap.get(char) || 0) + 1);
  }
  
  // 创建最小堆
  const minHeap = new MinHeap();
  for (let [char, freq] of freqMap) {
    minHeap.insert(new HuffmanNode(char, freq));
  }
  
  // 构建霍夫曼树
  while (minHeap.size() > 1) {
    const left = minHeap.extractMin();
    const right = minHeap.extractMin();
    
    // 创建父节点，频率为子节点频率之和
    const internalNode = new HuffmanNode(null, left.freq + right.freq);
    internalNode.left = left;
    internalNode.right = right;
    
    minHeap.insert(internalNode);
  }
  
  // 生成霍夫曼编码
  const root = minHeap.extractMin();
  const codes = new Map();
  
  function generateCodes(node, currentCode) {
    if (node === null) return;
    
    // 如果是叶子节点，记录编码
    if (node.char !== null) {
      codes.set(node.char, currentCode);
    }
    
    generateCodes(node.left, currentCode + '0');
    generateCodes(node.right, currentCode + '1');
  }
  
  generateCodes(root, '');
  
  // 编码文本
  let encodedText = '';
  for (let char of text) {
    encodedText += codes.get(char);
  }
  
  return {
    codes,
    encodedText
  };
}

// 示例
const text = 'hello world';
const result = huffmanCoding(text);
console.log('字符编码:');
result.codes.forEach((code, char) => {
  console.log(`'${char}': ${code}`);
});
console.log('\n编码后的文本:', result.encodedText);
```

### 5. 分治算法

#### 归并排序 (Merge Sort)

归并排序是分治算法的一个典型应用，前面已经介绍过。

#### 快速排序 (Quick Sort)

快速排序也是分治算法的一个典型应用，前面已经介绍过。

#### 二分搜索 (Binary Search)

二分搜索也是分治算法的一个应用，前面已经介绍过。

#### 最大子数组和 (Maximum Subarray Sum)

给定一个整数数组，找出一个具有最大和的连续子数组，并返回其最大和。

```javascript
// 分治算法实现
function maxSubArrayDivideAndConquer(nums) {
  if (nums.length === 1) {
    return nums[0];
  }
  
  const mid = Math.floor(nums.length / 2);
  
  // 递归计算左半部分的最大子数组和
  const leftMax = maxSubArrayDivideAndConquer(nums.slice(0, mid));
  
  // 递归计算右半部分的最大子数组和
  const rightMax = maxSubArrayDivideAndConquer(nums.slice(mid));
  
  // 计算跨越中点的最大子数组和
  const crossMax = maxCrossingSum(nums, mid);
  
  // 返回三者中的最大值
  return Math.max(leftMax, rightMax, crossMax);
}

function maxCrossingSum(nums, mid) {
  // 计算左半部分的最大和（从mid向左）
  let leftSum = Number.NEGATIVE_INFINITY;
  let sum = 0;
  for (let i = mid; i >= 0; i--) {
    sum += nums[i];
    leftSum = Math.max(leftSum, sum);
  }
  
  // 计算右半部分的最大和（从mid向右）
  let rightSum = Number.NEGATIVE_INFINITY;
  sum = 0;
  for (let i = mid + 1; i < nums.length; i++) {
    sum += nums[i];
    rightSum = Math.max(rightSum, sum);
  }
  
  // 返回跨越中点的最大和
  return leftSum + rightSum;
}

// 动态规划实现
function maxSubArrayDP(nums) {
  let currentSum = nums[0];
  let maxSum = nums[0];
  
  for (let i = 1; i < nums.length; i++) {
    // 对于当前元素，选择加入之前的子数组或开始一个新的子数组
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    // 更新最大和
    maxSum = Math.max(maxSum, currentSum);
  }
  
  return maxSum;
}

// 示例
const nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
console.log(maxSubArrayDivideAndConquer(nums)); // 6 ([4, -1, 2, 1])
console.log(maxSubArrayDP(nums)); // 6
```

## 算法设计技巧

1. **使用适当的数据结构**：根据问题特性选择合适的数据结构，如哈希表、栈、队列、堆等。

2. **采用合适的算法范式**：根据问题特性选择合适的算法范式，如分治法、动态规划、贪心算法等。

3. **优化时间和空间复杂度**：在实现算法时，尽量优化时间和空间复杂度，权衡两者之间的关系。

4. **注意边界条件**：处理好边界条件，如空数组、单元素数组等情况。

5. **测试和调试**：对算法进行充分的测试和调试，确保其正确性和性能。

## 常见算法问题

### 1. 两数之和 (Two Sum)

给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出和为目标值的那两个整数，并返回他们的数组下标。

```javascript
function twoSum(nums, target) {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    
    map.set(nums[i], i);
  }
  
  return [];
}

// 示例
const nums = [2, 7, 11, 15];
const target = 9;
console.log(twoSum(nums, target)); // [0, 1]
```

### 2. 反转链表 (Reverse Linked List)

反转一个单链表。

```javascript
// 链表节点类
class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

// 迭代实现
function reverseListIterative(head) {
  let prev = null;
  let current = head;
  
  while (current !== null) {
    const nextTemp = current.next;
    current.next = prev;
    prev = current;
    current = nextTemp;
  }
  
  return prev;
}

// 递归实现
function reverseListRecursive(head) {
  if (head === null || head.next === null) {
    return head;
  }
  
  const newHead = reverseListRecursive(head.next);
  head.next.next = head;
  head.next = null;
  
  return newHead;
}

// 示例
const head = new ListNode(1);
head.next = new ListNode(2);
head.next.next = new ListNode(3);
head.next.next.next = new ListNode(4);
head.next.next.next.next = new ListNode(5);

function printList(node) {
  const values = [];
  while (node !== null) {
    values.push(node.val);
    node = node.next;
  }
  console.log(values.join(' -> '));
}

console.log('原始链表:');
printList(head);

const reversed = reverseListIterative(head);
console.log('反转后的链表:');
printList(reversed);
```

### 3. 有效括号 (Valid Parentheses)

给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串，判断字符串是否有效。

```javascript
function isValid(s) {
  const stack = [];
  const bracketMap = {
    '(': ')',
    '{': '}',
    '[': ']'
  };
  
  for (let char of s) {
    if (bracketMap[char]) {
      // 如果是左括号，入栈
      stack.push(char);
    } else {
      // 如果是右括号，检查是否匹配
      const last = stack.pop();
      if (bracketMap[last] !== char) {
        return false;
      }
    }
  }
  
  // 最后检查栈是否为空
  return stack.length === 0;
}

// 示例
console.log(isValid('()')); // true
console.log(isValid('()[]{}')); // true
console.log(isValid('(]')); // false
console.log(isValid('([)]')); // false
console.log(isValid('{[]}')); // true
```

### 4. 合并两个有序链表 (Merge Two Sorted Lists)

将两个升序链表合并为一个新的升序链表并返回。

```javascript
// 链表节点类 - 使用上面定义的 ListNode

function mergeTwoLists(l1, l2) {
  // 创建哑节点作为结果链表的头部
  const dummy = new ListNode(-1);
  let current = dummy;
  
  while (l1 !== null && l2 !== null) {
    if (l1.val <= l2.val) {
      current.next = l1;
      l1 = l1.next;
    } else {
      current.next = l2;
      l2 = l2.next;
    }
    current = current.next;
  }
  
  // 连接剩余部分
  current.next = l1 !== null ? l1 : l2;
  
  return dummy.next;
}

// 递归实现
function mergeTwoListsRecursive(l1, l2) {
  if (l1 === null) return l2;
  if (l2 === null) return l1;
  
  if (l1.val <= l2.val) {
    l1.next = mergeTwoListsRecursive(l1.next, l2);
    return l1;
  } else {
    l2.next = mergeTwoListsRecursive(l1, l2.next);
    return l2;
  }
}

// 示例
const l1 = new ListNode(1);
l1.next = new ListNode(2);
l1.next.next = new ListNode(4);

const l2 = new ListNode(1);
l2.next = new ListNode(3);
l2.next.next = new ListNode(4);

const merged = mergeTwoLists(l1, l2);
console.log('合并后的链表:');
printList(merged);
```

### 5. 最大子数组和 (Maximum Subarray)

给定一个整数数组 nums ，找到一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。

```javascript
// 动态规划实现 - Kadane算法
function maxSubArray(nums) {
  let currentSum = nums[0];
  let maxSum = nums[0];
  
  for (let i = 1; i < nums.length; i++) {
    // 对于当前元素，选择加入之前的子数组或开始一个新的子数组
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    // 更新最大和
    maxSum = Math.max(maxSum, currentSum);
  }
  
  return maxSum;
}

// 示例
const nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
console.log(maxSubArray(nums)); // 6 ([4, -1, 2, 1])
```

### 6. 爬楼梯 (Climbing Stairs)

假设你正在爬楼梯。需要 n 阶你才能到达楼顶。每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶？

```javascript
// 动态规划实现
function climbStairs(n) {
  if (n <= 2) return n;
  
  const dp = new Array(n + 1);
  dp[1] = 1;
  dp[2] = 2;
  
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  
  return dp[n];
}

// 示例
console.log(climbStairs(2)); // 2
console.log(climbStairs(3)); // 3
console.log(climbStairs(4)); // 5
```

### 7. 买卖股票的最佳时机 (Best Time to Buy and Sell Stock)

给定一个数组 prices ，它的第 i 个元素 prices[i] 表示一支给定股票第 i 天的价格。
你只能选择某一天买入这只股票，并选择在未来的某一个不同的日子卖出该股票。设计一个算法来计算你所能获取的最大利润。

```javascript
function maxProfit(prices) {
  if (prices.length <= 1) return 0;
  
  let minPrice = prices[0];
  let maxProfit = 0;
  
  for (let i = 1; i < prices.length; i++) {
    // 更新最低价格
    minPrice = Math.min(minPrice, prices[i]);
    // 更新最大利润
    maxProfit = Math.max(maxProfit, prices[i] - minPrice);
  }
  
  return maxProfit;
}

// 示例
const prices = [7, 1, 5, 3, 6, 4];
console.log(maxProfit(prices)); // 5 (在第2天以1买入，第5天以6卖出)
```

### 8. 二叉树的最大深度 (Maximum Depth of Binary Tree)

给定一个二叉树，找出其最大深度。

```javascript
// 二叉树节点类
class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

// 递归实现
function maxDepth(root) {
  if (root === null) return 0;
  
  const leftDepth = maxDepth(root.left);
  const rightDepth = maxDepth(root.right);
  
  return Math.max(leftDepth, rightDepth) + 1;
}

// 迭代实现（BFS）
function maxDepthIterative(root) {
  if (root === null) return 0;
  
  const queue = [root];
  let depth = 0;
  
  while (queue.length > 0) {
    const levelSize = queue.length;
    
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    
    depth++;
  }
  
  return depth;
}

// 示例
const root = new TreeNode(3);
root.left = new TreeNode(9);
root.right = new TreeNode(20);
root.right.left = new TreeNode(15);
root.right.right = new TreeNode(7);

console.log(maxDepth(root)); // 3
console.log(maxDepthIterative(root)); // 3
```

### 9. 路径总和 (Path Sum)

给定一个二叉树和一个目标和，判断该树中是否存在根节点到叶子节点的路径，这条路径上所有节点值相加等于目标和。

```javascript
// 递归实现
function hasPathSum(root, targetSum) {
  if (root === null) return false;
  
  // 如果是叶子节点，检查剩余和是否等于当前节点值
  if (root.left === null && root.right === null) {
    return targetSum === root.val;
  }
  
  // 递归检查左子树和右子树
  const remainingSum = targetSum - root.val;
  return hasPathSum(root.left, remainingSum) || hasPathSum(root.right, remainingSum);
}

// 迭代实现（DFS）
function hasPathSumIterative(root, targetSum) {
  if (root === null) return false;
  
  const stack = [{ node: root, currentSum: root.val }];
  
  while (stack.length > 0) {
    const { node, currentSum } = stack.pop();
    
    // 检查是否是叶子节点
    if (node.left === null && node.right === null) {
      if (currentSum === targetSum) {
        return true;
      }
    }
    
    // 将子节点入栈
    if (node.right) {
      stack.push({ node: node.right, currentSum: currentSum + node.right.val });
    }
    if (node.left) {
      stack.push({ node: node.left, currentSum: currentSum + node.left.val });
    }
  }
  
  return false;
}

// 示例
const root = new TreeNode(5);
root.left = new TreeNode(4);
root.right = new TreeNode(8);
root.left.left = new TreeNode(11);
root.left.left.left = new TreeNode(7);
root.left.left.right = new TreeNode(2);
root.right.left = new TreeNode(13);
root.right.right = new TreeNode(4);
root.right.right.right = new TreeNode(1);

console.log(hasPathSum(root, 22)); // true (5->4->11->2)
console.log(hasPathSumIterative(root, 22)); // true
```

### 10. 全排列 (Permutations)

给定一个不含重复数字的数组 nums ，返回其所有可能的全排列。

```javascript
function permute(nums) {
  const result = [];
  
  // 回溯函数
  function backtrack(currentPerm, remaining) {
    // 如果没有剩余数字，将当前排列加入结果
    if (remaining.length === 0) {
      result.push([...currentPerm]);
      return;
    }
    
    // 尝试将每个剩余数字加入当前排列
    for (let i = 0; i < remaining.length; i++) {
      // 选择当前数字
      currentPerm.push(remaining[i]);
      
      // 递归处理剩余数字
      const newRemaining = remaining.filter((_, index) => index !== i);
      backtrack(currentPerm, newRemaining);
      
      // 回溯
      currentPerm.pop();
    }
  }
  
  backtrack([], nums);
  return result;
}

// 示例
const nums = [1, 2, 3];
console.log(permute(nums));
// 输出: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
```

## 算法优化技巧

### 1. 空间优化

在实现算法时，可以尝试减少额外空间的使用：

- 使用原地算法（如原地排序）
- 使用一维数组代替二维数组（如背包问题的空间优化）
- 复用变量，避免不必要的临时变量

### 2. 时间优化

- 使用更高效的算法（如二分查找代替线性查找）
- 使用合适的数据结构（如哈希表提高查找效率）
- 避免重复计算（如动态规划的记忆化）
- 使用并行处理（如多线程、GPU加速等）

### 3. 代码优化

- 减少函数调用开销
- 避免不必要的循环
- 使用更高效的操作符和语法
- 优化递归实现，避免栈溢出

## 算法复杂度比较

| 算法类型 | 最佳时间复杂度 | 平均时间复杂度 | 最坏时间复杂度 | 空间复杂度 | 稳定性 |
|---------|--------------|--------------|--------------|-----------|--------|
| 冒泡排序 | O(n) | O(n²) | O(n²) | O(1) | 稳定 |
| 选择排序 | O(n²) | O(n²) | O(n²) | O(1) | 不稳定 |
| 插入排序 | O(n) | O(n²) | O(n²) | O(1) | 稳定 |
| 归并排序 | O(n log n) | O(n log n) | O(n log n) | O(n) | 稳定 |
| 快速排序 | O(n log n) | O(n log n) | O(n²) | O(log n) | 不稳定 |
| 堆排序   | O(n log n) | O(n log n) | O(n log n) | O(1) | 不稳定 |
| 线性搜索 | O(1) | O(n) | O(n) | O(1) | - |
| 二分搜索 | O(1) | O(log n) | O(log n) | O(1) | - |

## 算法学习资源

1. **书籍**：
   - 《算法导论》
   - 《编程珠玑》
   - 《算法竞赛入门经典》
   - 《JavaScript 数据结构与算法》

2. **在线平台**：
   - LeetCode
   - HackerRank
   - Codeforces
   - TopCoder

3. **开源项目**：
   - 各种语言的算法库和实现
   - GitHub上的算法集合项目

4. **视频教程**：
   - 麻省理工学院的算法公开课
   - Coursera、edX上的算法课程
   - B站上的算法讲解视频

## 总结

算法是计算机科学的基础，掌握常见算法和数据结构对于提高编程能力和解决复杂问题至关重要。通过学习和实践不同类型的算法，我们可以更好地理解问题本质，选择合适的解决方案，并优化程序性能。

在实际开发中，我们应该根据问题的具体情况，选择合适的算法，并在时间复杂度和空间复杂度之间进行权衡，以实现高效、可靠的程序。