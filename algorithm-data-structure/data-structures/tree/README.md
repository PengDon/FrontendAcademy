# 树 (Tree) 数据结构基础知识

## 树的基本概念

树是一种非线性的层次化数据结构，它由节点组成，没有环的存在。树是图的一种特殊形式，但树中任意两个节点之间有且只有一条路径。

树的基本术语：
- **节点(Node)**：树中的基本元素，包含数据和指向子节点的指针
- **根节点(Root)**：树的顶层节点，没有父节点
- **父节点(Parent Node)**：一个节点的直接上层节点
- **子节点(Child Node)**：一个节点的直接下层节点
- **叶子节点(Leaf Node)**：没有子节点的节点
- **内部节点(Internal Node)**：至少有一个子节点的节点
- **边(Edge)**：连接两个节点的线
- **路径(Path)**：从一个节点到另一个节点经过的边的序列
- **高度(Height)**：从节点到最远叶子节点的边的数量
- **深度(Depth)**：从根节点到该节点的边的数量
- **层(Level)**：节点的深度加1
- **子树(Subtree)**：一个节点及其所有后代节点组成的树
- **度(Degree)**：一个节点的子节点数量
- **森林(Forest)**：多棵不相交的树的集合

## 树的类型

### 1. 二叉树 (Binary Tree)

每个节点最多有两个子节点的树，分别称为左子节点和右子节点。

**二叉树的基本性质**：
- 第i层最多有2^(i-1)个节点（i≥1）
- 高度为h的二叉树最多有2^h - 1个节点（h≥1）
- 对于任何二叉树，叶子节点数为n0，度为2的节点数为n2，则n0 = n2 + 1

**二叉树的分类**：

#### 1.1 满二叉树 (Full Binary Tree)

每个节点要么有0个要么有2个子节点的二叉树。

```
       1
      / \
     2   3
    / \ / \
   4  5 6  7
```

#### 1.2 完全二叉树 (Complete Binary Tree)

除了最后一层外，其他层的节点数都达到最大，且最后一层的节点都靠左排列的二叉树。

```
       1
      / \
     2   3
    / \ /
   4  5 6
```

#### 1.3 平衡二叉树 (Balanced Binary Tree)

任意节点的左右子树高度差不超过1的二叉树。

```
       1
      / \
     2   3
    /
   4
```

#### 1.4 二叉搜索树 (Binary Search Tree, BST)

对于任意节点，其左子树中所有节点的值小于该节点的值，右子树中所有节点的值大于该节点的值。

```
       4
      / \
     2   6
    / \ / \
   1  3 5  7
```

### 2. 多路搜索树 (Multi-way Search Tree)

每个节点可以有多个子节点的搜索树。

#### 2.1 2-3树

每个节点可以有1或2个键，2或3个子节点的多路搜索树。

#### 2.2 B树

一种自平衡的多路搜索树，常用于数据库和文件系统。

#### 2.3 B+树

B树的一种变体，所有叶子节点在同一层，且叶子节点通过链表连接。

### 3. 堆 (Heap)

一种特殊的完全二叉树，分为最大堆和最小堆。

#### 3.1 最大堆 (Max Heap)

每个节点的值都大于或等于其子节点的值的完全二叉树。

```
       7
      / \
     5   6
    / \ / \
   3  2 1  4
```

#### 3.2 最小堆 (Min Heap)

每个节点的值都小于或等于其子节点的值的完全二叉树。

```
       1
      / \
     2   3
    / \ / \
   4  5 6  7
```

### 4. 红黑树 (Red-Black Tree)

一种自平衡的二叉搜索树，每个节点都有一个颜色属性（红色或黑色），通过颜色约束来保持树的平衡。

### 5. AVL树

一种严格平衡的二叉搜索树，任意节点的左右子树高度差不超过1。

## 二叉树的实现

### 1. 二叉树的节点定义

```javascript
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}
```

### 2. 二叉树的基本操作

```javascript
class BinaryTree {
  constructor() {
    this.root = null;
  }
  
  // 插入节点（层次遍历插入）
  insert(value) {
    const newNode = new TreeNode(value);
    
    if (!this.root) {
      this.root = newNode;
      return this;
    }
    
    // 使用队列进行层次遍历，找到第一个没有满子节点的节点
    const queue = [this.root];
    
    while (queue.length > 0) {
      const current = queue.shift();
      
      // 如果左子节点为空，插入到左子节点
      if (!current.left) {
        current.left = newNode;
        return this;
      }
      
      // 如果右子节点为空，插入到右子节点
      if (!current.right) {
        current.right = newNode;
        return this;
      }
      
      // 如果左右子节点都不为空，将它们加入队列
      queue.push(current.left);
      queue.push(current.right);
    }
  }
  
  // 查找节点
  find(value) {
    if (!this.root) return null;
    
    const queue = [this.root];
    
    while (queue.length > 0) {
      const current = queue.shift();
      
      if (current.value === value) {
        return current;
      }
      
      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
    }
    
    return null;
  }
  
  // 删除节点（比较复杂，这里简化处理，用最后一个节点替换要删除的节点）
  delete(value) {
    if (!this.root) return false;
    
    // 查找要删除的节点和它的父节点
    let targetNode = null;
    let parentNode = null;
    const queue = [this.root];
    
    while (queue.length > 0 && !targetNode) {
      const current = queue.shift();
      
      if (current.left && current.left.value === value) {
        targetNode = current.left;
        parentNode = current;
      } else if (current.right && current.right.value === value) {
        targetNode = current.right;
        parentNode = current;
      }
      
      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
    }
    
    if (!targetNode) return false; // 未找到要删除的节点
    
    // 查找最后一个节点（层次遍历的最后一个节点）
    let lastNode = null;
    let lastNodeParent = null;
    const queue2 = [this.root];
    
    while (queue2.length > 0) {
      lastNode = queue2.shift();
      
      if (lastNode.left) {
        lastNodeParent = lastNode;
        queue2.push(lastNode.left);
      }
      
      if (lastNode.right) {
        lastNodeParent = lastNode;
        queue2.push(lastNode.right);
      }
    }
    
    // 用最后一个节点的值替换要删除的节点的值
    targetNode.value = lastNode.value;
    
    // 删除最后一个节点
    if (lastNodeParent) {
      if (lastNodeParent.left === lastNode) {
        lastNodeParent.left = null;
      } else {
        lastNodeParent.right = null;
      }
    } else {
      // 如果最后一个节点是根节点，说明树只有一个节点
      this.root = null;
    }
    
    return true;
  }
}
```

## 二叉树的遍历

### 1. 深度优先遍历 (Depth-First Traversal)

#### 1.1 前序遍历 (Preorder Traversal)

顺序：根节点 -> 左子树 -> 右子树

```javascript
// 递归实现
function preorderTraversal(root) {
  const result = [];
  
  function traverse(node) {
    if (!node) return;
    
    result.push(node.value); // 访问根节点
    traverse(node.left); // 遍历左子树
    traverse(node.right); // 遍历右子树
  }
  
  traverse(root);
  return result;
}

// 迭代实现
function preorderTraversalIterative(root) {
  if (!root) return [];
  
  const result = [];
  const stack = [root];
  
  while (stack.length > 0) {
    const node = stack.pop();
    result.push(node.value); // 访问根节点
    
    // 注意：先压入右子节点，再压入左子节点，这样弹出顺序就是先左后右
    if (node.right) stack.push(node.right);
    if (node.left) stack.push(node.left);
  }
  
  return result;
}
```

#### 1.2 中序遍历 (Inorder Traversal)

顺序：左子树 -> 根节点 -> 右子树

```javascript
// 递归实现
function inorderTraversal(root) {
  const result = [];
  
  function traverse(node) {
    if (!node) return;
    
    traverse(node.left); // 遍历左子树
    result.push(node.value); // 访问根节点
    traverse(node.right); // 遍历右子树
  }
  
  traverse(root);
  return result;
}

// 迭代实现
function inorderTraversalIterative(root) {
  if (!root) return [];
  
  const result = [];
  const stack = [];
  let current = root;
  
  while (current || stack.length > 0) {
    // 一直向左遍历，将所有左子节点压入栈中
    while (current) {
      stack.push(current);
      current = current.left;
    }
    
    // 弹出栈顶节点，访问它
    current = stack.pop();
    result.push(current.value);
    
    // 转向右子树
    current = current.right;
  }
  
  return result;
}
```

#### 1.3 后序遍历 (Postorder Traversal)

顺序：左子树 -> 右子树 -> 根节点

```javascript
// 递归实现
function postorderTraversal(root) {
  const result = [];
  
  function traverse(node) {
    if (!node) return;
    
    traverse(node.left); // 遍历左子树
    traverse(node.right); // 遍历右子树
    result.push(node.value); // 访问根节点
  }
  
  traverse(root);
  return result;
}

// 迭代实现
function postorderTraversalIterative(root) {
  if (!root) return [];
  
  const result = [];
  const stack = [root];
  const visited = new Set();
  
  while (stack.length > 0) {
    const node = stack[stack.length - 1]; // 查看栈顶元素但不移除
    
    // 如果节点是叶子节点或者其子节点已经被访问过
    if ((!node.left && !node.right) || visited.has(node)) {
      stack.pop();
      result.push(node.value);
    } else {
      // 先将右子节点压入栈，再将左子节点压入栈
      if (node.right) stack.push(node.right);
      if (node.left) stack.push(node.left);
      visited.add(node);
    }
  }
  
  return result;
}
```

### 2. 广度优先遍历 (Breadth-First Traversal) / 层次遍历

按照树的层次，从上到下、从左到右遍历节点。

```javascript
function levelOrderTraversal(root) {
  if (!root) return [];
  
  const result = [];
  const queue = [root];
  
  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel = [];
    
    // 处理当前层的所有节点
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      currentLevel.push(node.value);
      
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    
    result.push(currentLevel);
  }
  
  return result;
}
```

## 二叉搜索树 (BST) 的实现

### 1. 基本操作

```javascript
class BinarySearchTree {
  constructor() {
    this.root = null;
  }
  
  // 插入节点
  insert(value) {
    const newNode = new TreeNode(value);
    
    if (!this.root) {
      this.root = newNode;
      return this;
    }
    
    function insertNode(node, newNode) {
      if (newNode.value < node.value) {
        // 插入到左子树
        if (!node.left) {
          node.left = newNode;
        } else {
          insertNode(node.left, newNode);
        }
      } else {
        // 插入到右子树
        if (!node.right) {
          node.right = newNode;
        } else {
          insertNode(node.right, newNode);
        }
      }
    }
    
    insertNode(this.root, newNode);
    return this;
  }
  
  // 查找节点
  find(value) {
    function findNode(node, value) {
      if (!node) return null;
      
      if (value === node.value) {
        return node;
      } else if (value < node.value) {
        return findNode(node.left, value);
      } else {
        return findNode(node.right, value);
      }
    }
    
    return findNode(this.root, value);
  }
  
  // 查找最小值
  findMin(node = this.root) {
    if (!node) return null;
    
    let current = node;
    while (current.left) {
      current = current.left;
    }
    
    return current;
  }
  
  // 查找最大值
  findMax(node = this.root) {
    if (!node) return null;
    
    let current = node;
    while (current.right) {
      current = current.right;
    }
    
    return current;
  }
  
  // 删除节点
  delete(value) {
    function deleteNode(node, value) {
      if (!node) return null;
      
      // 查找要删除的节点
      if (value < node.value) {
        node.left = deleteNode(node.left, value);
      } else if (value > node.value) {
        node.right = deleteNode(node.right, value);
      } else {
        // 找到要删除的节点
        
        // 情况1：叶子节点
        if (!node.left && !node.right) {
          return null;
        }
        
        // 情况2：只有一个子节点
        else if (!node.left) {
          return node.right;
        }
        else if (!node.right) {
          return node.left;
        }
        
        // 情况3：有两个子节点
        // 找到右子树中的最小值
        const minNode = findMin(node.right);
        // 用最小值替换当前节点的值
        node.value = minNode.value;
        // 删除右子树中的最小值节点
        node.right = deleteNode(node.right, minNode.value);
      }
      
      return node;
    }
    
    this.root = deleteNode(this.root, value);
    return this;
  }
  
  // 检查树是否为空
  isEmpty() {
    return this.root === null;
  }
  
  // 获取树的高度
  getHeight(node = this.root) {
    if (!node) return 0;
    
    const leftHeight = this.getHeight(node.left);
    const rightHeight = this.getHeight(node.right);
    
    return Math.max(leftHeight, rightHeight) + 1;
  }
  
  // 检查树是否为有效的二叉搜索树
  isValidBST(node = this.root, min = -Infinity, max = Infinity) {
    if (!node) return true;
    
    // 检查当前节点的值是否在有效范围内
    if (node.value <= min || node.value >= max) {
      return false;
    }
    
    // 递归检查左子树和右子树
    return this.isValidBST(node.left, min, node.value) && 
           this.isValidBST(node.right, node.value, max);
  }
}

// 示例
const bst = new BinarySearchTree();
bst.insert(50);
bst.insert(30);
bst.insert(70);
bst.insert(20);
bst.insert(40);
bst.insert(60);
bst.insert(80);

console.log(preorderTraversal(bst.root)); // [50, 30, 20, 40, 70, 60, 80]
console.log(inorderTraversal(bst.root)); // [20, 30, 40, 50, 60, 70, 80]
console.log(postorderTraversal(bst.root)); // [20, 40, 30, 60, 80, 70, 50]
console.log(levelOrderTraversal(bst.root)); // [[50], [30, 70], [20, 40, 60, 80]]

console.log(bst.find(40).value); // 40
console.log(bst.findMin().value); // 20
console.log(bst.findMax().value); // 80

console.log(bst.getHeight()); // 3
console.log(bst.isValidBST()); // true

bst.delete(30);
console.log(inorderTraversal(bst.root)); // [20, 40, 50, 60, 70, 80]
```

## 堆 (Heap) 的实现

### 1. 最小堆实现

```javascript
class MinHeap {
  constructor() {
    this.heap = []; // 用数组表示堆
  }
  
  // 获取父节点索引
  getParentIndex(index) {
    return Math.floor((index - 1) / 2);
  }
  
  // 获取左子节点索引
  getLeftChildIndex(index) {
    return 2 * index + 1;
  }
  
  // 获取右子节点索引
  getRightChildIndex(index) {
    return 2 * index + 2;
  }
  
  // 交换两个节点的值
  swap(index1, index2) {
    [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
  }
  
  // 向上调整（用于插入）
  siftUp(index) {
    let currentIndex = index;
    let parentIndex = this.getParentIndex(currentIndex);
    
    // 如果当前节点小于父节点，则交换并继续向上调整
    while (currentIndex > 0 && this.heap[currentIndex] < this.heap[parentIndex]) {
      this.swap(currentIndex, parentIndex);
      currentIndex = parentIndex;
      parentIndex = this.getParentIndex(currentIndex);
    }
  }
  
  // 向下调整（用于删除堆顶和构建堆）
  siftDown(index) {
    let currentIndex = index;
    let leftChildIndex = this.getLeftChildIndex(currentIndex);
    let rightChildIndex = this.getRightChildIndex(currentIndex);
    let smallestIndex = currentIndex;
    
    // 找到当前节点、左子节点和右子节点中的最小值
    if (leftChildIndex < this.heap.length && this.heap[leftChildIndex] < this.heap[smallestIndex]) {
      smallestIndex = leftChildIndex;
    }
    
    if (rightChildIndex < this.heap.length && this.heap[rightChildIndex] < this.heap[smallestIndex]) {
      smallestIndex = rightChildIndex;
    }
    
    // 如果最小值不是当前节点，则交换并继续向下调整
    if (smallestIndex !== currentIndex) {
      this.swap(currentIndex, smallestIndex);
      this.siftDown(smallestIndex);
    }
  }
  
  // 插入元素
  insert(value) {
    this.heap.push(value); // 添加到堆的末尾
    this.siftUp(this.heap.length - 1); // 向上调整
    return this;
  }
  
  // 获取并删除堆顶元素（最小值）
  extractMin() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();
    
    const min = this.heap[0]; // 保存堆顶元素
    this.heap[0] = this.heap.pop(); // 用最后一个元素替换堆顶
    this.siftDown(0); // 向下调整
    
    return min;
  }
  
  // 获取堆顶元素但不删除
  peek() {
    return this.heap.length > 0 ? this.heap[0] : null;
  }
  
  // 获取堆的大小
  size() {
    return this.heap.length;
  }
  
  // 检查堆是否为空
  isEmpty() {
    return this.heap.length === 0;
  }
  
  // 从数组构建堆
  buildHeap(array) {
    this.heap = [...array];
    
    // 从最后一个非叶子节点开始，逐个向下调整
    const startIndex = this.getParentIndex(this.heap.length - 1);
    for (let i = startIndex; i >= 0; i--) {
      this.siftDown(i);
    }
    
    return this;
  }
}

// 示例
const minHeap = new MinHeap();
minHeap.insert(5);
minHeap.insert(3);
minHeap.insert(8);
minHeap.insert(1);
minHeap.insert(10);
console.log(minHeap.heap); // [1, 3, 8, 5, 10]
console.log(minHeap.extractMin()); // 1
console.log(minHeap.heap); // [3, 5, 8, 10]
console.log(minHeap.peek()); // 3

const arrayHeap = new MinHeap();
arrayHeap.buildHeap([4, 1, 3, 2, 16, 9, 10, 14, 8, 7]);
console.log(arrayHeap.heap); // [1, 2, 3, 4, 7, 9, 10, 14, 8, 16]
```

### 2. 最大堆实现

```javascript
class MaxHeap {
  constructor() {
    this.heap = [];
  }
  
  // 获取父节点索引
  getParentIndex(index) {
    return Math.floor((index - 1) / 2);
  }
  
  // 获取左子节点索引
  getLeftChildIndex(index) {
    return 2 * index + 1;
  }
  
  // 获取右子节点索引
  getRightChildIndex(index) {
    return 2 * index + 2;
  }
  
  // 交换两个节点的值
  swap(index1, index2) {
    [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
  }
  
  // 向上调整
  siftUp(index) {
    let currentIndex = index;
    let parentIndex = this.getParentIndex(currentIndex);
    
    while (currentIndex > 0 && this.heap[currentIndex] > this.heap[parentIndex]) {
      this.swap(currentIndex, parentIndex);
      currentIndex = parentIndex;
      parentIndex = this.getParentIndex(currentIndex);
    }
  }
  
  // 向下调整
  siftDown(index) {
    let currentIndex = index;
    let leftChildIndex = this.getLeftChildIndex(currentIndex);
    let rightChildIndex = this.getRightChildIndex(currentIndex);
    let largestIndex = currentIndex;
    
    if (leftChildIndex < this.heap.length && this.heap[leftChildIndex] > this.heap[largestIndex]) {
      largestIndex = leftChildIndex;
    }
    
    if (rightChildIndex < this.heap.length && this.heap[rightChildIndex] > this.heap[largestIndex]) {
      largestIndex = rightChildIndex;
    }
    
    if (largestIndex !== currentIndex) {
      this.swap(currentIndex, largestIndex);
      this.siftDown(largestIndex);
    }
  }
  
  // 插入元素
  insert(value) {
    this.heap.push(value);
    this.siftUp(this.heap.length - 1);
    return this;
  }
  
  // 获取并删除堆顶元素（最大值）
  extractMax() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();
    
    const max = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.siftDown(0);
    
    return max;
  }
  
  // 获取堆顶元素但不删除
  peek() {
    return this.heap.length > 0 ? this.heap[0] : null;
  }
  
  // 获取堆的大小
  size() {
    return this.heap.length;
  }
  
  // 检查堆是否为空
  isEmpty() {
    return this.heap.length === 0;
  }
  
  // 从数组构建堆
  buildHeap(array) {
    this.heap = [...array];
    
    const startIndex = this.getParentIndex(this.heap.length - 1);
    for (let i = startIndex; i >= 0; i--) {
      this.siftDown(i);
    }
    
    return this;
  }
}

// 示例
const maxHeap = new MaxHeap();
maxHeap.insert(5);
maxHeap.insert(3);
maxHeap.insert(8);
maxHeap.insert(1);
maxHeap.insert(10);
console.log(maxHeap.heap); // [10, 5, 8, 1, 3]
console.log(maxHeap.extractMax()); // 10
console.log(maxHeap.heap); // [8, 5, 3, 1]
```

## 树的应用场景

### 1. 数据库索引

B树和B+树常用于数据库索引，能够高效地支持范围查询和排序操作。

### 2. 优先队列

堆常用于实现优先队列，优先队列在操作系统的任务调度、图算法等场景中有广泛应用。

### 3. 表达式求值

二叉树可以用来表示算术表达式，便于计算和转换。

```
      +
     / \
    *   5
   / \
  2   3
```

表示表达式：(2 * 3) + 5

### 4. 文件系统

文件系统通常使用树结构来组织文件和目录。

### 5. 决策树

决策树是一种用于分类和预测的机器学习算法，基于树的结构进行决策。

### 6. 路由算法

树用于网络路由算法中的最短路径查找。

## 树的常见算法问题

### 1. 计算树的高度

```javascript
function maxDepth(root) {
  if (!root) return 0;
  
  const leftDepth = maxDepth(root.left);
  const rightDepth = maxDepth(root.right);
  
  return Math.max(leftDepth, rightDepth) + 1;
}
```

### 2. 判断两棵树是否相同

```javascript
function isSameTree(p, q) {
  // 如果两棵树都为空，则它们相同
  if (!p && !q) return true;
  
  // 如果只有一棵树为空，则它们不同
  if (!p || !q) return false;
  
  // 检查当前节点的值是否相同
  if (p.value !== q.value) return false;
  
  // 递归检查左右子树
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}
```

### 3. 判断树是否为对称二叉树

```javascript
function isSymmetric(root) {
  if (!root) return true;
  
  function isMirror(left, right) {
    // 如果两个节点都为空，则它们互为镜像
    if (!left && !right) return true;
    
    // 如果只有一个节点为空，则它们不互为镜像
    if (!left || !right) return false;
    
    // 检查当前节点的值是否相同，并且左节点的左子树与右节点的右子树互为镜像，左节点的右子树与右节点的左子树互为镜像
    return (left.value === right.value) && 
           isMirror(left.left, right.right) && 
           isMirror(left.right, right.left);
  }
  
  return isMirror(root.left, root.right);
}
```

### 4. 路径总和

```javascript
function hasPathSum(root, targetSum) {
  if (!root) return false;
  
  // 如果是叶子节点，检查是否等于目标和
  if (!root.left && !root.right) {
    return root.value === targetSum;
  }
  
  // 递归检查左右子树
  const remainingSum = targetSum - root.value;
  return hasPathSum(root.left, remainingSum) || hasPathSum(root.right, remainingSum);
}
```

### 5. 二叉树的最大路径和

```javascript
function maxPathSum(root) {
  let maxSum = -Infinity;
  
  function maxPathSumHelper(node) {
    if (!node) return 0;
    
    // 递归计算左右子树的最大路径和（如果为负，则取0，相当于不选该子树）
    const leftSum = Math.max(0, maxPathSumHelper(node.left));
    const rightSum = Math.max(0, maxPathSumHelper(node.right));
    
    // 更新全局最大路径和（当前节点的值 + 左右子树的最大路径和）
    maxSum = Math.max(maxSum, node.value + leftSum + rightSum);
    
    // 返回从当前节点开始的最大路径和（只能选择左子树或右子树中的一个）
    return node.value + Math.max(leftSum, rightSum);
  }
  
  maxPathSumHelper(root);
  return maxSum;
}
```

### 6. 从前序与中序遍历序列构造二叉树

```javascript
function buildTree(preorder, inorder) {
  // 构建中序遍历值到索引的映射，便于快速查找根节点的位置
  const inorderMap = new Map();
  for (let i = 0; i < inorder.length; i++) {
    inorderMap.set(inorder[i], i);
  }
  
  function build(preStart, preEnd, inStart, inEnd) {
    if (preStart > preEnd || inStart > inEnd) return null;
    
    // 前序遍历的第一个元素是根节点
    const rootValue = preorder[preStart];
    const root = new TreeNode(rootValue);
    
    // 找到根节点在中序遍历中的位置
    const rootIndex = inorderMap.get(rootValue);
    
    // 计算左子树的节点数量
    const leftSize = rootIndex - inStart;
    
    // 递归构建左子树和右子树
    root.left = build(preStart + 1, preStart + leftSize, inStart, rootIndex - 1);
    root.right = build(preStart + leftSize + 1, preEnd, rootIndex + 1, inEnd);
    
    return root;
  }
  
  return build(0, preorder.length - 1, 0, inorder.length - 1);
}
```

## 总结

树是一种重要的非线性数据结构，它在计算机科学中有广泛的应用。树的主要类型包括二叉树、多路搜索树、堆、红黑树等，每种类型的树都有其特定的应用场景和优势。

二叉树是最基本的树结构，它的遍历算法（前序、中序、后序、层次）是解决树相关问题的基础。二叉搜索树是一种特殊的二叉树，它支持高效的查找、插入和删除操作。堆是一种特殊的完全二叉树，常用于实现优先队列。

理解树的基本概念、实现方式和常见算法，对于解决复杂的计算机科学问题和优化程序性能都非常重要。在实际编程中，我们需要根据具体问题的需求，选择合适的树结构和算法。