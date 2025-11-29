# 动态规划 (Dynamic Programming) 基础知识

## 动态规划简介

动态规划是一种将复杂问题分解为相对简单的子问题，先求解子问题，然后从这些子问题的解得到原问题解的方法。它特别适用于具有**重叠子问题**和**最优子结构**特性的问题。

动态规划的核心思想是：
1. **分解问题**：将原问题分解为多个相似的子问题
2. **存储子问题解**：通过表格等方式保存已解决的子问题答案，避免重复计算
3. **自底向上求解**：从最小的子问题开始，逐步解决更大的子问题，最终得到原问题的解

## 动态规划的基本要素

### 1. 重叠子问题

当递归算法反复求解相同的子问题时，就会出现重叠子问题。动态规划通过存储子问题的解来避免这种重复计算。

### 2. 最优子结构

如果一个问题的最优解可以由其子问题的最优解有效地构造出来，则称该问题具有最优子结构。

### 3. 状态转移方程

描述问题状态和子问题状态之间关系的数学表达式，是动态规划的核心。

## 动态规划的解题步骤

1. **定义状态**：确定如何表示子问题的状态
2. **确定状态转移方程**：找出状态之间的转移关系
3. **设置初始条件**：确定最简单子问题的解
4. **计算顺序**：决定如何填充状态表格
5. **构造最优解**：根据计算结果构造问题的最优解

## 经典问题解析

### 1. 斐波那契数列

**问题描述**：计算斐波那契数列的第n项。

**解题思路**：
- 状态定义：`dp[n]` 表示第n个斐波那契数
- 状态转移方程：`dp[n] = dp[n-1] + dp[n-2]`
- 初始条件：`dp[0] = 0, dp[1] = 1`

**代码实现**：

```javascript
function fibonacci(n) {
  if (n <= 1) return n;
  
  // 初始化dp数组
  const dp = new Array(n + 1);
  dp[0] = 0;
  dp[1] = 1;
  
  // 填充dp数组
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  
  return dp[n];
}

// 空间优化版本
function fibonacciOptimized(n) {
  if (n <= 1) return n;
  
  let prev = 0;
  let curr = 1;
  let next;
  
  for (let i = 2; i <= n; i++) {
    next = prev + curr;
    prev = curr;
    curr = next;
  }
  
  return curr;
}

// 示例
console.log(fibonacci(10)); // 55
console.log(fibonacciOptimized(10)); // 55
```

### 2. 爬楼梯问题

**问题描述**：假设你正在爬楼梯，需要n阶才能到达楼顶。每次你可以爬1或2个台阶。有多少种不同的方法可以爬到楼顶？

**解题思路**：
- 状态定义：`dp[i]` 表示爬到第i阶楼梯的方法数
- 状态转移方程：`dp[i] = dp[i-1] + dp[i-2]`
- 初始条件：`dp[1] = 1, dp[2] = 2`

**代码实现**：

```javascript
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

// 空间优化版本
function climbStairsOptimized(n) {
  if (n <= 2) return n;
  
  let prev1 = 1;
  let prev2 = 2;
  let current;
  
  for (let i = 3; i <= n; i++) {
    current = prev1 + prev2;
    prev1 = prev2;
    prev2 = current;
  }
  
  return prev2;
}

// 示例
console.log(climbStairs(3)); // 3
console.log(climbStairs(4)); // 5
console.log(climbStairsOptimized(5)); // 8
```

### 3. 最大子数组和

**问题描述**：给定一个整数数组 nums，找到一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。

**解题思路**：
- 状态定义：`dp[i]` 表示以第i个元素结尾的最大子数组和
- 状态转移方程：`dp[i] = Math.max(dp[i-1] + nums[i], nums[i])`
- 初始条件：`dp[0] = nums[0]`

**代码实现**：

```javascript
function maxSubArray(nums) {
  if (nums.length === 0) return 0;
  
  const dp = new Array(nums.length);
  dp[0] = nums[0];
  let maxSum = dp[0];
  
  for (let i = 1; i < nums.length; i++) {
    // 要么加入前面的子数组，要么自己单独开始
    dp[i] = Math.max(dp[i - 1] + nums[i], nums[i]);
    maxSum = Math.max(maxSum, dp[i]);
  }
  
  return maxSum;
}

// 空间优化版本
function maxSubArrayOptimized(nums) {
  if (nums.length === 0) return 0;
  
  let currentSum = nums[0];
  let maxSum = nums[0];
  
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(currentSum + nums[i], nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  
  return maxSum;
}

// 示例
const nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
console.log(maxSubArray(nums)); // 6 ([4, -1, 2, 1])
console.log(maxSubArrayOptimized(nums)); // 6
```

### 4. 最长公共子序列

**问题描述**：给定两个字符串 text1 和 text2，返回这两个字符串的最长公共子序列的长度。

**解题思路**：
- 状态定义：`dp[i][j]` 表示 text1 的前i个字符与 text2 的前j个字符的最长公共子序列长度
- 状态转移方程：
  - 如果 text1[i-1] === text2[j-1]，则 `dp[i][j] = dp[i-1][j-1] + 1`
  - 否则 `dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1])`
- 初始条件：`dp[i][0] = 0, dp[0][j] = 0`

**代码实现**：

```javascript
function longestCommonSubsequence(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  
  // 创建dp表格，初始值为0
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        // 找到公共字符，长度+1
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        // 选择长度较大的那个
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  
  return dp[m][n];
}

// 示例
console.log(longestCommonSubsequence("abcde", "ace")); // 3
console.log(longestCommonSubsequence("abc", "abc")); // 3
console.log(longestCommonSubsequence("abc", "def")); // 0
```

### 5. 背包问题

#### 5.1 0-1背包问题

**问题描述**：给定n个物品，每个物品有特定的重量和价值，以及一个容量为W的背包。每个物品只能选择放或不放，求在不超过背包容量的前提下，能获得的最大价值。

**解题思路**：
- 状态定义：`dp[i][w]` 表示考虑前i个物品，背包容量为w时能获得的最大价值
- 状态转移方程：
  - 不放入第i个物品：`dp[i][w] = dp[i-1][w]`
  - 放入第i个物品（如果能放入）：`dp[i][w] = dp[i-1][w-weight[i]] + value[i]`
  - 取两者最大值：`dp[i][w] = Math.max(dp[i-1][w], dp[i-1][w-weight[i]] + value[i])`
- 初始条件：`dp[0][w] = 0, dp[i][0] = 0`

**代码实现**：

```javascript
function knapsack01(weights, values, capacity) {
  const n = weights.length;
  
  // 创建dp表格
  const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));
  
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      // 如果当前物品重量超过背包剩余容量，不放入
      if (weights[i - 1] > w) {
        dp[i][w] = dp[i - 1][w];
      } else {
        // 比较放与不放的价值，取较大值
        dp[i][w] = Math.max(
          dp[i - 1][w],
          dp[i - 1][w - weights[i - 1]] + values[i - 1]
        );
      }
    }
  }
  
  return dp[n][capacity];
}

// 空间优化版本（一维数组）
function knapsack01Optimized(weights, values, capacity) {
  const n = weights.length;
  
  // 使用一维数组，从后向前遍历避免重复使用
  const dp = Array(capacity + 1).fill(0);
  
  for (let i = 0; i < n; i++) {
    for (let w = capacity; w >= weights[i]; w--) {
      dp[w] = Math.max(
        dp[w],
        dp[w - weights[i]] + values[i]
      );
    }
  }
  
  return dp[capacity];
}

// 示例
const weights = [1, 3, 4, 5];
const values = [1, 4, 5, 7];
const capacity = 7;
console.log(knapsack01(weights, values, capacity)); // 9
console.log(knapsack01Optimized(weights, values, capacity)); // 9
```

#### 5.2 完全背包问题

**问题描述**：与0-1背包问题类似，但每个物品可以选择多次。

**解题思路**：
- 状态定义：与0-1背包相同
- 状态转移方程：与0-1背包基本相同，但遍历顺序不同
- 一维数组实现时，从前向后遍历允许物品被多次选择

**代码实现**：

```javascript
function knapsackComplete(weights, values, capacity) {
  const n = weights.length;
  const dp = Array(capacity + 1).fill(0);
  
  for (let i = 0; i < n; i++) {
    // 注意这里是从前向后遍历，允许重复选择
    for (let w = weights[i]; w <= capacity; w++) {
      dp[w] = Math.max(
        dp[w],
        dp[w - weights[i]] + values[i]
      );
    }
  }
  
  return dp[capacity];
}

// 示例
console.log(knapsackComplete(weights, values, capacity)); // 10 (选择两个重量为3的物品，价值8+其他)
```

## 动态规划的优化技巧

### 1. 空间优化

许多动态规划问题可以通过减少状态数组的维度来优化空间复杂度。常见的优化方式：

- **一维数组优化**：对于只依赖前一状态的DP问题，可以将二维数组压缩为一维
- **滚动数组**：使用两个一维数组交替更新，减少空间使用

### 2. 状态转移优化

通过数学推导或观察问题特性，优化状态转移方程，减少计算量。

### 3. 预处理

在某些情况下，预处理输入数据可以简化动态规划过程。

## 动态规划与其他算法的对比

| 算法类型 | 特点 | 适用场景 | 时间复杂度 |
|---------|------|----------|----------|
| 动态规划 | 自底向上，存储子问题解 | 有重叠子问题的优化问题 | 通常为多项式时间 |
| 贪心算法 | 自顶向下，局部最优选择 | 满足贪心选择性质的问题 | 通常为线性或对数时间 |
| 分治法 | 递归求解，不存储子问题解 | 子问题独立的问题 | 通常为多项式或指数时间 |
| 回溯法 | 穷举搜索，通过剪枝优化 | 组合优化问题 | 通常为指数时间 |

## 总结

动态规划是一种强大的算法设计范式，通过将复杂问题分解为子问题并存储子问题的解，避免了重复计算，大大提高了解决问题的效率。

学习和掌握动态规划需要理解：
1. 如何识别适合动态规划的问题（重叠子问题和最优子结构）
2. 如何定义状态和状态转移方程
3. 如何设置初始条件和填充DP表格
4. 如何优化空间复杂度

通过大量练习经典的动态规划问题，并理解其中的思路和模式，可以帮助我们更好地应用动态规划解决实际问题。