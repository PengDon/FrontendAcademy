# 搜索算法 (Searching) 基础知识

## 搜索算法简介

搜索算法是计算机科学中最基本、最常用的算法之一，它用于在数据集合中查找特定元素。根据数据结构和问题特性的不同，我们可以选择不同的搜索策略。

搜索算法主要分为两大类：
- **顺序搜索**：按顺序遍历数据集合，直到找到目标元素或遍历完整个集合
- **区间搜索**：利用数据集合的特性（如有序性）来加速搜索过程

## 基本搜索算法

### 1. 线性搜索 (Linear Search)

**算法描述**：从数据集合的一端开始，逐个检查每个元素，直到找到目标元素或遍历完整个集合。

**适用场景**：适用于任何数据集合，特别是小规模或无序的数据集合。

**时间复杂度**：
- 平均情况：O(n)
- 最坏情况：O(n)
- 最好情况：O(1)

**代码实现**：

```javascript
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i; // 返回目标元素的索引
    }
  }
  return -1; // 未找到目标元素
}

// 示例
const numbers = [5, 3, 8, 4, 2, 7, 1, 10];
console.log(linearSearch(numbers, 7)); // 5
console.log(linearSearch(numbers, 6)); // -1
```

### 2. 二分搜索 (Binary Search)

**算法描述**：在有序数组中，通过不断将搜索区间一分为二，逐步缩小搜索范围，直到找到目标元素或确定目标元素不存在。

**适用场景**：适用于已排序的数组。

**时间复杂度**：
- 平均情况：O(log n)
- 最坏情况：O(log n)
- 最好情况：O(1)

**代码实现**：

```javascript
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    // 计算中间索引（避免整数溢出的写法）
    const mid = left + Math.floor((right - left) / 2);
    
    if (arr[mid] === target) {
      return mid; // 找到目标元素
    } else if (arr[mid] < target) {
      left = mid + 1; // 目标在右半部分
    } else {
      right = mid - 1; // 目标在左半部分
    }
  }
  
  return -1; // 未找到目标元素
}

// 递归版本
function binarySearchRecursive(arr, target, left = 0, right = arr.length - 1) {
  if (left > right) {
    return -1;
  }
  
  const mid = left + Math.floor((right - left) / 2);
  
  if (arr[mid] === target) {
    return mid;
  } else if (arr[mid] < target) {
    return binarySearchRecursive(arr, target, mid + 1, right);
  } else {
    return binarySearchRecursive(arr, target, left, mid - 1);
  }
}

// 示例
const sortedNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log(binarySearch(sortedNumbers, 7)); // 6
console.log(binarySearchRecursive(sortedNumbers, 11)); // -1
```

### 3. 插值搜索 (Interpolation Search)

**算法描述**：二分搜索的改进版，根据目标值与搜索区间边界值的比较，估算目标值可能的位置，而不是简单地取中间位置。

**适用场景**：适用于均匀分布的有序数组。

**时间复杂度**：
- 平均情况：O(log log n)
- 最坏情况：O(n)
- 最好情况：O(1)

**代码实现**：

```javascript
function interpolationSearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  // 确保目标值在数组范围内且数组是递增的
  while (left <= right && target >= arr[left] && target <= arr[right]) {
    if (left === right) {
      return arr[left] === target ? left : -1;
    }
    
    // 插值公式计算探测位置
    // 假设数据均匀分布，估算目标值的位置
    const pos = left + Math.floor(
      ((target - arr[left]) * (right - left)) / (arr[right] - arr[left])
    );
    
    if (arr[pos] === target) {
      return pos;
    } else if (arr[pos] < target) {
      left = pos + 1;
    } else {
      right = pos - 1;
    }
  }
  
  return -1;
}

// 示例
console.log(interpolationSearch(sortedNumbers, 7)); // 6
console.log(interpolationSearch(sortedNumbers, 11)); // -1
```

## 高级搜索算法

### 1. 深度优先搜索 (DFS)

**算法描述**：从起始节点开始，尽可能深地沿着树或图的分支探索，直到无法继续为止，然后回溯到上一个节点，探索其他分支。

**适用场景**：
- 图的遍历
- 树的遍历（前序、中序、后序）
- 迷宫求解
- 拓扑排序

**时间复杂度**：
- 图：O(V + E)，其中V是顶点数，E是边数
- 树：O(V)，其中V是节点数

**代码实现**（图的DFS）：

```javascript
// 递归实现DFS
function dfs(graph, start, visited = new Set()) {
  // 标记当前节点为已访问
  visited.add(start);
  console.log('访问节点:', start);
  
  // 访问所有未访问的邻居节点
  for (const neighbor of graph[start]) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited);
    }
  }
  
  return visited;
}

// 迭代实现DFS
function dfsIterative(graph, start) {
  const stack = [start];
  const visited = new Set();
  
  while (stack.length > 0) {
    const node = stack.pop();
    
    if (!visited.has(node)) {
      visited.add(node);
      console.log('访问节点:', node);
      
      // 将邻居节点加入栈中
      // 注意：为了保持与递归版本相似的访问顺序，我们逆序加入邻居
      for (let i = graph[node].length - 1; i >= 0; i--) {
        const neighbor = graph[node][i];
        if (!visited.has(neighbor)) {
          stack.push(neighbor);
        }
      }
    }
  }
  
  return visited;
}

// 示例（无向图）
const graph = {
  'A': ['B', 'C'],
  'B': ['A', 'D', 'E'],
  'C': ['A', 'F'],
  'D': ['B'],
  'E': ['B', 'F'],
  'F': ['C', 'E']
};

console.log('递归DFS结果:');
dfs(graph, 'A');

console.log('\n迭代DFS结果:');
dfsIterative(graph, 'A');
```

### 2. 广度优先搜索 (BFS)

**算法描述**：从起始节点开始，先访问其所有相邻节点，然后再依次访问这些相邻节点的相邻节点，逐层扩展搜索范围。

**适用场景**：
- 图的遍历
- 树的层序遍历
- 寻找最短路径（无权图）
- 网络爬虫

**时间复杂度**：
- 图：O(V + E)，其中V是顶点数，E是边数
- 树：O(V)，其中V是节点数

**代码实现**（图的BFS）：

```javascript
function bfs(graph, start) {
  const queue = [start];
  const visited = new Set([start]);
  
  while (queue.length > 0) {
    const node = queue.shift();
    console.log('访问节点:', node);
    
    // 访问所有未访问的邻居节点
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  
  return visited;
}

// 使用上面定义的graph示例
console.log('BFS结果:');
bfs(graph, 'A');
```

### 3. A* 搜索算法

**算法描述**：一种启发式搜索算法，结合了BFS的优势和启发式函数来指导搜索方向，常用于寻找最短路径。

**适用场景**：
- 寻路算法（如游戏中的角色移动）
- 地图导航
- 路径规划

**核心思想**：
- 评估函数 f(n) = g(n) + h(n)
- g(n)：从起始节点到节点n的实际路径成本
- h(n)：从节点n到目标节点的估计成本（启发式函数）

**代码实现**（简化版A*搜索）：

```javascript
// 简化的A*搜索算法实现
function aStarSearch(graph, start, goal, heuristic) {
  // 开放列表：待探索的节点
  const openList = [{ node: start, g: 0, h: heuristic(start, goal), f: 0 }];
  // 关闭列表：已探索的节点
  const closedList = new Set();
  // 记录每个节点的前驱，用于重建路径
  const cameFrom = new Map();
  // 记录到每个节点的实际成本
  const gScore = new Map([[start, 0]]);
  
  while (openList.length > 0) {
    // 找出f值最小的节点
    openList.sort((a, b) => a.f - b.f);
    const current = openList.shift();
    
    // 到达目标
    if (current.node === goal) {
      // 重建路径
      return reconstructPath(cameFrom, current.node);
    }
    
    closedList.add(current.node);
    
    // 检查所有邻居
    for (const [neighbor, cost] of Object.entries(graph[current.node])) {
      if (closedList.has(neighbor)) continue;
      
      // 计算从起点经过当前节点到邻居节点的成本
      const tentativeGScore = gScore.get(current.node) + cost;
      
      // 如果找到更优的路径或邻居节点尚未访问
      if (!gScore.has(neighbor) || tentativeGScore < gScore.get(neighbor)) {
        // 记录此路径
        cameFrom.set(neighbor, current.node);
        gScore.set(neighbor, tentativeGScore);
        
        const fScore = tentativeGScore + heuristic(neighbor, goal);
        
        // 将邻居节点添加到开放列表
        openList.push({ node: neighbor, g: tentativeGScore, h: heuristic(neighbor, goal), f: fScore });
      }
    }
  }
  
  // 无法到达目标
  return null;
}

// 重建路径
function reconstructPath(cameFrom, current) {
  const path = [current];
  while (cameFrom.has(current)) {
    current = cameFrom.get(current);
    path.unshift(current);
  }
  return path;
}

// 简单的曼哈顿距离启发式函数
function manhattanDistance(a, b) {
  // 假设节点名称格式为"x,y"
  const [ax, ay] = a.split(',').map(Number);
  const [bx, by] = b.split(',').map(Number);
  return Math.abs(ax - bx) + Math.abs(ay - by);
}

// 示例（网格图）
const gridGraph = {
  '0,0': { '0,1': 1, '1,0': 1 },
  '0,1': { '0,0': 1, '0,2': 1, '1,1': 1 },
  '0,2': { '0,1': 1, '1,2': 1 },
  '1,0': { '0,0': 1, '1,1': 1, '2,0': 1 },
  '1,1': { '0,1': 1, '1,0': 1, '1,2': 1, '2,1': 1 },
  '1,2': { '0,2': 1, '1,1': 1, '2,2': 1 },
  '2,0': { '1,0': 1, '2,1': 1 },
  '2,1': { '1,1': 1, '2,0': 1, '2,2': 1 },
  '2,2': { '1,2': 1, '2,1': 1 }
};

const path = aStarSearch(gridGraph, '0,0', '2,2', manhattanDistance);
console.log('A*搜索找到的路径:', path);
```

## 搜索算法的应用场景

| 搜索算法 | 主要应用场景 | 优势 | 劣势 |
|---------|------------|------|------|
| 线性搜索 | 小规模、无序数据集 | 实现简单，适用于任何数据结构 | 效率低，O(n)时间复杂度 |
| 二分搜索 | 有序数组 | 高效，O(log n)时间复杂度 | 要求数据有序 |
| 插值搜索 | 均匀分布的有序数组 | 在理想情况下比二分搜索更快 | 依赖数据分布均匀性 |
| DFS | 树/图遍历、回溯问题 | 内存使用低，可找到所有解 | 不一定找到最短路径 |
| BFS | 最短路径、层序遍历 | 可找到最短路径（无权图） | 空间复杂度较高 |
| A*搜索 | 寻路、路径规划 | 高效找到最短路径 | 启发式函数设计复杂 |

## 搜索算法的优化策略

### 1. 数据预处理

- **排序**：对于需要多次搜索的场景，先对数据排序可以使用二分搜索等更高效的算法
- **索引**：建立哈希表、二叉搜索树等索引结构加速查找
- **压缩**：对大型数据集进行压缩存储，提高搜索效率

### 2. 启发式方法

- 使用启发式函数指导搜索方向，如A*算法中的h(n)
- 利用领域知识优化搜索策略

### 3. 并行化

- 利用多线程或分布式系统并行搜索不同的子空间
- 适用于大规模数据集的搜索问题

## 总结

搜索算法是计算机科学中的基础算法，选择合适的搜索算法对于解决特定问题至关重要。不同的搜索算法适用于不同的场景，需要根据数据规模、数据结构特性和问题要求进行选择。

在实际应用中，我们常常需要结合多种搜索策略，并根据具体场景进行优化。随着数据规模的不断增长，高效的搜索算法和数据结构设计变得越来越重要。