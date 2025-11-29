# 数据结构（Data Structures）

## 目录

- [数据结构（Data Structures）](#数据结构data-structures)
  - [目录](#目录)
  - [什么是数据结构？](#什么是数据结构)
  - [为什么数据结构很重要？](#为什么数据结构很重要)
  - [基本数据类型 vs 复合数据结构](#基本数据类型-vs-复合数据结构)
    - [基本数据类型](#基本数据类型)
    - [复合数据结构](#复合数据结构)
  - [常见的数据结构](#常见的数据结构)
    - [数组（Array）](#数组array)
      - [JavaScript中的数组实现](#javascript中的数组实现)
      - [TypeScript中的数组实现](#typescript中的数组实现)
    - [链表（Linked List）](#链表linked-list)
      - [单链表（Singly Linked List）](#单链表singly-linked-list)
      - [双链表（Doubly Linked List）](#双链表doubly-linked-list)
    - [栈（Stack）](#栈stack)
      - [基于数组的栈实现](#基于数组的栈实现)
      - [基于链表的栈实现](#基于链表的栈实现)
    - [队列（Queue）](#队列queue)
      - [基于数组的队列实现](#基于数组的队列实现)
      - [基于链表的队列实现](#基于链表的队列实现)
    - [哈希表（Hash Table）](#哈希表hash-table)
      - [JavaScript中的哈希表实现](#javascript中的哈希表实现)
      - [TypeScript中的哈希表实现](#typescript中的哈希表实现)
    - [树（Tree）](#树tree)
      - [二叉树（Binary Tree）](#二叉树binary-tree)
      - [二叉搜索树（Binary Search Tree）](#二叉搜索树binary-search-tree)
      - [平衡二叉搜索树 - AVL树](#平衡二叉搜索树---avl树)
      - [平衡二叉搜索树 - 红黑树](#平衡二叉搜索树---红黑树)
      - [树遍历](#树遍历)
    - [堆（Heap）](#堆heap)
      - [最小堆（Min Heap）](#最小堆min-heap)
      - [最大堆（Max Heap）](#最大堆max-heap)
    - [图（Graph）](#图graph)
      - [邻接矩阵表示法](#邻接矩阵表示法)
      - [邻接表表示法](#邻接表表示法)
  - [数据结构选择指南](#数据结构选择指南)
    - [根据操作类型选择](#根据操作类型选择)
    - [根据数据量选择](#根据数据量选择)
    - [根据内存限制选择](#根据内存限制选择)
  - [数据结构应用场景](#数据结构应用场景)
    - [数组](#数组)
    - [链表](#链表)
    - [栈](#栈)
    - [队列](#队列)
    - [哈希表](#哈希表)
    - [树](#树)
    - [堆](#堆)
    - [图](#图)
  - [高级数据结构](#高级数据结构)
    - [跳表（Skip List）](#跳表skip-list)
    - [并查集（Union-Find）](#并查集union-find)
    - [Trie树（前缀树）](#trie树前缀树)
    - [线段树（Segment Tree）](#线段树segment-tree)
    - [树状数组（Binary Indexed Tree / Fenwick Tree）](#树状数组binary-indexed-tree--fenwick-tree)
  - [数据结构的时间和空间复杂度](#数据结构的时间和空间复杂度)
  - [数据结构在JavaScript中的实现](#数据结构在javascript中的实现)
  - [数据结构在TypeScript中的实现](#数据结构在typescript中的实现)
  - [总结](#总结)

## 什么是数据结构？

**数据结构**是组织和存储数据的方式，它允许高效地访问和修改数据。在计算机科学中，选择适当的数据结构对于设计高效算法至关重要。

数据结构是算法的基础，算法需要借助特定的数据结构来实现。不同的数据结构在不同的场景下有各自的优势和劣势。

## 为什么数据结构很重要？

1. **效率**：选择正确的数据结构可以显著提高程序的运行效率。
2. **可扩展性**：良好的数据结构设计使程序更容易扩展和维护。
3. **性能优化**：合适的数据结构能够减少内存使用和提高处理速度。
4. **问题解决**：许多问题的解决方案依赖于特定的数据结构。

## 基本数据类型 vs 复合数据结构

### 基本数据类型

基本数据类型是编程语言内置的最基础的数据表示形式：

- **数字**：整数、浮点数
- **字符**：单个字符
- **布尔值**：true 或 false
- **空值**：表示不存在的值

### 复合数据结构

复合数据结构是由基本数据类型组合而成的数据结构：

- **数组**：相同类型元素的集合
- **对象/结构体**：不同类型元素的集合
- **集合**：不允许重复元素的无序集合
- **映射**：键值对的集合

## 常见的数据结构

### 数组（Array）

**数组**是最基本的数据结构之一，它是一组相同类型元素的集合，通过索引访问。

**特点**：
- 固定大小（静态数组）或动态调整大小（动态数组）
- 元素在内存中是连续存储的
- 随机访问时间复杂度为 O(1)
- 插入和删除元素的时间复杂度为 O(n)（需要移动元素）

#### JavaScript中的数组实现

```javascript
// 创建数组
const array = [1, 2, 3, 4, 5];

// 访问元素
console.log(array[0]); // 1

// 添加元素
array.push(6); // 末尾添加，O(1)
array.unshift(0); // 开头添加，O(n)
array.splice(2, 0, 1.5); // 指定位置添加，O(n)

// 删除元素
array.pop(); // 末尾删除，O(1)
array.shift(); // 开头删除，O(n)
array.splice(2, 1); // 指定位置删除，O(n)

// 遍历数组
for (let i = 0; i < array.length; i++) {
  console.log(array[i]);
}

// 使用forEach
array.forEach(element => console.log(element));
```

#### TypeScript中的数组实现

```typescript
// 定义类型化数组
const numbers: number[] = [1, 2, 3, 4, 5];
const strings: string[] = ['a', 'b', 'c'];

// 泛型语法
const booleans: Array<boolean> = [true, false, true];

// 二维数组
const matrix: number[][] = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

// 操作与JavaScript相同
numbers.push(6);
console.log(numbers[0]); // 1
```

### 链表（Linked List）

**链表**是一种线性数据结构，它由节点组成，每个节点包含数据和指向下一个节点的指针（单链表）或同时包含指向上一个和下一个节点的指针（双链表）。

**特点**：
- 元素在内存中不一定是连续存储的
- 访问元素需要遍历，时间复杂度为 O(n)
- 插入和删除元素的时间复杂度为 O(1)（如果知道位置）
- 不需要预先确定大小，可以动态增长

#### 单链表（Singly Linked List）

```javascript
// 定义节点类
class ListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

// 定义单链表类
class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  // 添加节点到链表末尾
  append(value) {
    const newNode = new ListNode(value);
    
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
    
    this.length++;
    return this;
  }

  // 添加节点到链表开头
  prepend(value) {
    const newNode = new ListNode(value);
    
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head = newNode;
    }
    
    this.length++;
    return this;
  }

  // 遍历链表
  traverse() {
    const values = [];
    let current = this.head;
    
    while (current) {
      values.push(current.value);
      current = current.next;
    }
    
    return values;
  }

  // 查找节点
  find(value) {
    let current = this.head;
    
    while (current) {
      if (current.value === value) {
        return current;
      }
      current = current.next;
    }
    
    return null;
  }

  // 删除节点
  remove(value) {
    if (!this.head) return null;
    
    let removedNode = null;
    
    // 如果是头节点
    if (this.head.value === value) {
      removedNode = this.head;
      this.head = this.head.next;
      
      if (!this.head) {
        this.tail = null;
      }
    } else {
      let current = this.head;
      
      while (current.next && current.next.value !== value) {
        current = current.next;
      }
      
      if (current.next) {
        removedNode = current.next;
        current.next = current.next.next;
        
        if (!current.next) {
          this.tail = current;
        }
      }
    }
    
    if (removedNode) {
      this.length--;
    }
    
    return removedNode;
  }
}

// 示例
const list = new LinkedList();
list.append(1);
list.append(2);
list.prepend(0);
console.log(list.traverse()); // [0, 1, 2]
list.remove(1);
console.log(list.traverse()); // [0, 2]
```

#### 双链表（Doubly Linked List）

```javascript
// 定义双链表节点类
class DoublyListNode {
  constructor(value) {
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

// 定义双链表类
class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  // 添加节点到链表末尾
  append(value) {
    const newNode = new DoublyListNode(value);
    
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail.next = newNode;
      this.tail = newNode;
    }
    
    this.length++;
    return this;
  }

  // 添加节点到链表开头
  prepend(value) {
    const newNode = new DoublyListNode(value);
    
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }
    
    this.length++;
    return this;
  }

  // 正向遍历
  traverseForward() {
    const values = [];
    let current = this.head;
    
    while (current) {
      values.push(current.value);
      current = current.next;
    }
    
    return values;
  }

  // 反向遍历
  traverseBackward() {
    const values = [];
    let current = this.tail;
    
    while (current) {
      values.push(current.value);
      current = current.prev;
    }
    
    return values;
  }

  // 删除节点
  remove(value) {
    if (!this.head) return null;
    
    let removedNode = null;
    let current = this.head;
    
    while (current) {
      if (current.value === value) {
        removedNode = current;
        
        // 如果是唯一节点
        if (this.length === 1) {
          this.head = null;
          this.tail = null;
        } 
        // 如果是头节点
        else if (current === this.head) {
          this.head = current.next;
          this.head.prev = null;
        }
        // 如果是尾节点
        else if (current === this.tail) {
          this.tail = current.prev;
          this.tail.next = null;
        }
        // 如果是中间节点
        else {
          current.prev.next = current.next;
          current.next.prev = current.prev;
        }
        
        this.length--;
        break;
      }
      
      current = current.next;
    }
    
    return removedNode;
  }
}

// 示例
const doublyList = new DoublyLinkedList();
doublyList.append(1);
doublyList.append(2);
doublyList.prepend(0);
console.log(doublyList.traverseForward()); // [0, 1, 2]
console.log(doublyList.traverseBackward()); // [2, 1, 0]
doublyList.remove(1);
console.log(doublyList.traverseForward()); // [0, 2]
```

### 栈（Stack）

**栈**是一种后进先出（LIFO, Last-In-First-Out）的数据结构，只能在一端（栈顶）进行插入和删除操作。

**特点**：
- 后进先出
- 可以用数组或链表实现
- 入栈（push）和出栈（pop）操作的时间复杂度为 O(1)

**应用场景**：
- 函数调用和递归
- 表达式求值
- 括号匹配
- 浏览器的前进后退功能

#### 基于数组的栈实现

```javascript
class Stack {
  constructor() {
    this.items = [];
  }

  // 添加元素到栈顶
  push(element) {
    this.items.push(element);
  }

  // 移除并返回栈顶元素
  pop() {
    if (this.isEmpty()) return null;
    return this.items.pop();
  }

  // 返回栈顶元素但不移除
  peek() {
    if (this.isEmpty()) return null;
    return this.items[this.items.length - 1];
  }

  // 检查栈是否为空
  isEmpty() {
    return this.items.length === 0;
  }

  // 返回栈中元素数量
  size() {
    return this.items.length;
  }

  // 清空栈
  clear() {
    this.items = [];
  }

  // 打印栈内容
  print() {
    console.log(this.items.toString());
  }
}

// 示例
const stack = new Stack();
stack.push(1);
stack.push(2);
stack.push(3);
console.log(stack.peek()); // 3
console.log(stack.pop()); // 3
console.log(stack.size()); // 2
stack.print(); // 1,2
```

#### 基于链表的栈实现

```javascript
// 可以使用上面定义的单链表
class StackLinkedList {
  constructor() {
    this.list = new LinkedList();
  }

  // 添加元素到栈顶（链表头部）
  push(element) {
    this.list.prepend(element);
  }

  // 移除并返回栈顶元素（链表头部）
  pop() {
    if (this.isEmpty()) return null;
    
    const topElement = this.list.head.value;
    this.list.remove(topElement);
    return topElement;
  }

  // 返回栈顶元素但不移除
  peek() {
    if (this.isEmpty()) return null;
    return this.list.head.value;
  }

  // 检查栈是否为空
  isEmpty() {
    return this.list.length === 0;
  }

  // 返回栈中元素数量
  size() {
    return this.list.length;
  }

  // 清空栈
  clear() {
    this.list = new LinkedList();
  }

  // 打印栈内容
  print() {
    console.log(this.list.traverse());
  }
}

// 示例
const stackLL = new StackLinkedList();
stackLL.push(1);
stackLL.push(2);
stackLL.push(3);
console.log(stackLL.peek()); // 3
console.log(stackLL.pop()); // 3
console.log(stackLL.size()); // 2
stackLL.print(); // [1, 2]
```

### 队列（Queue）

**队列**是一种先进先出（FIFO, First-In-First-Out）的数据结构，只能在一端（队尾）插入元素，在另一端（队头）删除元素。

**特点**：
- 先进先出
- 可以用数组或链表实现
- 入队（enqueue）和出队（dequeue）操作的时间复杂度为 O(1)

**应用场景**：
- 任务调度
- 打印队列
- 网络请求排队
- 广度优先搜索（BFS）

#### 基于数组的队列实现

```javascript
class Queue {
  constructor() {
    this.items = [];
  }

  // 添加元素到队尾
  enqueue(element) {
    this.items.push(element);
  }

  // 移除并返回队头元素
  dequeue() {
    if (this.isEmpty()) return null;
    return this.items.shift();
  }

  // 返回队头元素但不移除
  front() {
    if (this.isEmpty()) return null;
    return this.items[0];
  }

  // 检查队列是否为空
  isEmpty() {
    return this.items.length === 0;
  }

  // 返回队列中元素数量
  size() {
    return this.items.length;
  }

  // 清空队列
  clear() {
    this.items = [];
  }

  // 打印队列内容
  print() {
    console.log(this.items.toString());
  }
}

// 示例
const queue = new Queue();
queue.enqueue(1);
queue.enqueue(2);
queue.enqueue(3);
console.log(queue.front()); // 1
console.log(queue.dequeue()); // 1
console.log(queue.size()); // 2
queue.print(); // 2,3
```

#### 基于链表的队列实现

```javascript
// 可以使用上面定义的单链表
class QueueLinkedList {
  constructor() {
    this.list = new LinkedList();
  }

  // 添加元素到队尾（链表尾部）
  enqueue(element) {
    this.list.append(element);
  }

  // 移除并返回队头元素（链表头部）
  dequeue() {
    if (this.isEmpty()) return null;
    
    const frontElement = this.list.head.value;
    this.list.remove(frontElement);
    return frontElement;
  }

  // 返回队头元素但不移除
  front() {
    if (this.isEmpty()) return null;
    return this.list.head.value;
  }

  // 检查队列是否为空
  isEmpty() {
    return this.list.length === 0;
  }

  // 返回队列中元素数量
  size() {
    return this.list.length;
  }

  // 清空队列
  clear() {
    this.list = new LinkedList();
  }

  // 打印队列内容
  print() {
    console.log(this.list.traverse());
  }
}

// 示例
const queueLL = new QueueLinkedList();
queueLL.enqueue(1);
queueLL.enqueue(2);
queueLL.enqueue(3);
console.log(queueLL.front()); // 1
console.log(queueLL.dequeue()); // 1
console.log(queueLL.size()); // 2
queueLL.print(); // [2, 3]
```

### 哈希表（Hash Table）

**哈希表**是一种通过哈希函数将键映射到值的数据结构，它支持快速查找、插入和删除操作。

**特点**：
- 键值对存储
- 平均查找、插入和删除操作的时间复杂度为 O(1)
- 可能出现哈希冲突

**哈希冲突解决方法**：
- 链地址法（Separate Chaining）
- 开放地址法（Open Addressing）
- 再哈希法（Rehashing）

#### JavaScript中的哈希表实现

在JavaScript中，对象（Object）和Map都是哈希表的实现。

```javascript
// 使用Object作为哈希表
const hashTable = {};

// 添加键值对
hashTable['name'] = 'John';
hashTable['age'] = 30;
hashTable['job'] = 'Developer';

// 访问值
console.log(hashTable['name']); // John

// 检查键是否存在
console.log('name' in hashTable); // true

// 删除键值对
delete hashTable['age'];

// 遍历
for (const key in hashTable) {
  console.log(`${key}: ${hashTable[key]}`);
}

// 使用Map作为哈希表
const map = new Map();

// 添加键值对
map.set('name', 'John');
map.set('age', 30);
map.set('job', 'Developer');

// 访问值
console.log(map.get('name')); // John

// 检查键是否存在
console.log(map.has('name')); // true

// 删除键值对
map.delete('age');

// 遍历
map.forEach((value, key) => {
  console.log(`${key}: ${value}`);
});

// 获取所有键
console.log([...map.keys()]); // ['name', 'job']

// 获取所有值
console.log([...map.values()]); // ['John', 'Developer']

// 获取所有键值对
console.log([...map.entries()]); // [['name', 'John'], ['job', 'Developer']]
```

#### TypeScript中的哈希表实现

```typescript
// 使用Map
const userMap: Map<string, any> = new Map();
userMap.set('id', 1);
userMap.set('name', 'John');
userMap.set('active', true);

// 访问值
const userName: string = userMap.get('name');

// 使用对象字面量，类型安全
interface User {
  id: number;
  name: string;
  age?: number; // 可选属性
}

const user: User = {
  id: 1,
  name: 'John'
};

// 也可以使用Record类型
const config: Record<string, string | number | boolean> = {
  debug: true,
  timeout: 3000,
  mode: 'development'
};
```

### 树（Tree）

**树**是一种非线性数据结构，它由节点组成，每个节点可以有多个子节点。树的顶部节点称为根节点，没有子节点的节点称为叶子节点。

**特点**：
- 层次结构
- 没有环
- 每个节点（除了根节点）只有一个父节点

**应用场景**：
- 文件系统
- 组织结构图
- 决策树
- DOM结构

#### 二叉树（Binary Tree）

**二叉树**是每个节点最多有两个子节点（左子节点和右子节点）的树。

```javascript
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinaryTree {
  constructor() {
    this.root = null;
  }

  // 插入节点（层次遍历法）
  insert(value) {
    const newNode = new TreeNode(value);
    
    if (!this.root) {
      this.root = newNode;
      return;
    }
    
    const queue = [this.root];
    
    while (queue.length > 0) {
      const current = queue.shift();
      
      if (!current.left) {
        current.left = newNode;
        return;
      }
      
      if (!current.right) {
        current.right = newNode;
        return;
      }
      
      queue.push(current.left);
      queue.push(current.right);
    }
  }
}

// 示例
const tree = new BinaryTree();
tree.insert(1);
tree.insert(2);
tree.insert(3);
tree.insert(4);
tree.insert(5);
```

#### 二叉搜索树（Binary Search Tree）

**二叉搜索树**是一种特殊的二叉树，它满足以下性质：
- 左子树的所有节点值小于根节点值
- 右子树的所有节点值大于根节点值
- 左右子树也分别是二叉搜索树

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
    
    let current = this.root;
    while (true) {
      if (value === current.value) return undefined; // 不允许重复值
      
      if (value < current.value) {
        if (!current.left) {
          current.left = newNode;
          return this;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          return this;
        }
        current = current.right;
      }
    }
  }

  // 查找节点
  find(value) {
    if (!this.root) return false;
    
    let current = this.root;
    let found = false;
    
    while (current && !found) {
      if (value < current.value) {
        current = current.left;
      } else if (value > current.value) {
        current = current.right;
      } else {
        found = true;
      }
    }
    
    if (!found) return false;
    return current;
  }

  // 移除节点
  remove(value) {
    this.root = this._removeNode(this.root, value);
  }
  
  _removeNode(node, value) {
    if (!node) return null;
    
    if (value < node.value) {
      node.left = this._removeNode(node.left, value);
      return node;
    } else if (value > node.value) {
      node.right = this._removeNode(node.right, value);
      return node;
    } else {
      // 节点找到，开始删除
      
      // 1. 叶节点
      if (!node.left && !node.right) {
        return null;
      }
      
      // 2. 只有一个子节点
      if (!node.left) {
        return node.right;
      }
      if (!node.right) {
        return node.left;
      }
      
      // 3. 有两个子节点
      let tempNode = this._findMinNode(node.right);
      node.value = tempNode.value;
      node.right = this._removeNode(node.right, tempNode.value);
      return node;
    }
  }
  
  _findMinNode(node) {
    let current = node;
    while (current.left !== null) {
      current = current.left;
    }
    return current;
  }
}

// 示例
const bst = new BinarySearchTree();
bst.insert(10);
bst.insert(5);
bst.insert(15);
bst.insert(3);
bst.insert(7);
bst.insert(12);
bst.insert(18);
console.log(bst.find(7)); // 返回值为7的节点
```

#### 平衡二叉搜索树 - AVL树

**AVL树**是一种自平衡的二叉搜索树，它的左右子树高度差不超过1。当插入或删除节点时，会通过旋转操作保持树的平衡。

```javascript
class AVLNode extends TreeNode {
  constructor(value) {
    super(value);
    this.height = 1;
  }
}

class AVLTree {
  constructor() {
    this.root = null;
  }

  // 获取节点高度
  _height(node) {
    if (!node) return 0;
    return node.height;
  }

  // 计算平衡因子
  _getBalanceFactor(node) {
    if (!node) return 0;
    return this._height(node.left) - this._height(node.right);
  }

  // 更新节点高度
  _updateHeight(node) {
    node.height = 1 + Math.max(this._height(node.left), this._height(node.right));
  }

  // 右旋转
  _rightRotate(y) {
    const x = y.left;
    const T3 = x.right;
    
    // 执行旋转
    x.right = y;
    y.left = T3;
    
    // 更新高度
    this._updateHeight(y);
    this._updateHeight(x);
    
    return x;
  }

  // 左旋转
  _leftRotate(x) {
    const y = x.right;
    const T2 = y.left;
    
    // 执行旋转
    y.left = x;
    x.right = T2;
    
    // 更新高度
    this._updateHeight(x);
    this._updateHeight(y);
    
    return y;
  }

  // 插入节点
  insert(value) {
    this.root = this._insertNode(this.root, value);
  }
  
  _insertNode(node, value) {
    // 执行标准BST插入
    if (!node) return new AVLNode(value);
    
    if (value < node.value) {
      node.left = this._insertNode(node.left, value);
    } else if (value > node.value) {
      node.right = this._insertNode(node.right, value);
    } else {
      // 不允许重复值
      return node;
    }
    
    // 更新当前节点的高度
    this._updateHeight(node);
    
    // 获取平衡因子
    const balanceFactor = this._getBalanceFactor(node);
    
    // 如果节点不平衡，则进行旋转
    
    // 左左情况 - 右旋转
    if (balanceFactor > 1 && value < node.left.value) {
      return this._rightRotate(node);
    }
    
    // 右右情况 - 左旋转
    if (balanceFactor < -1 && value > node.right.value) {
      return this._leftRotate(node);
    }
    
    // 左右情况 - 先左旋后右旋
    if (balanceFactor > 1 && value > node.left.value) {
      node.left = this._leftRotate(node.left);
      return this._rightRotate(node);
    }
    
    // 右左情况 - 先右旋后左旋
    if (balanceFactor < -1 && value < node.right.value) {
      node.right = this._rightRotate(node.right);
      return this._leftRotate(node);
    }
    
    return node;
  }
}

// 示例
const avl = new AVLTree();
avl.insert(10);
avl.insert(5);
avl.insert(15);
avl.insert(3);
avl.insert(7);
avl.insert(12);
avl.insert(18);
avl.insert(2);
```

#### 平衡二叉搜索树 - 红黑树

**红黑树**是一种自平衡的二叉搜索树，每个节点都有一个颜色属性（红色或黑色），并满足以下性质：
1. 节点是红色或黑色
2. 根节点是黑色
3. 所有叶子节点（NIL）是黑色
4. 如果一个节点是红色，则其两个子节点都是黑色
5. 对每个节点，从该节点到其所有后代叶子节点的简单路径上，均包含相同数目的黑色节点

```javascript
class RedBlackNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.parent = null;
    this.color = 'RED'; // 默认为红色
  }
}

class RedBlackTree {
  constructor() {
    this.root = null;
    this.NIL = new RedBlackNode(null); // 哨兵节点
    this.NIL.color = 'BLACK';
  }

  // 插入节点
  insert(value) {
    const newNode = new RedBlackNode(value);
    newNode.left = this.NIL;
    newNode.right = this.NIL;
    
    // 标准BST插入
    let y = null;
    let x = this.root;
    
    while (x !== null && x !== this.NIL) {
      y = x;
      if (newNode.value < x.value) {
        x = x.left;
      } else {
        x = x.right;
      }
    }
    
    newNode.parent = y;
    
    if (y === null) {
      this.root = newNode; // 树为空
    } else if (newNode.value < y.value) {
      y.left = newNode;
    } else {
      y.right = newNode;
    }
    
    // 新节点是根节点
    if (newNode.parent === null) {
      newNode.color = 'BLACK';
      return;
    }
    
    // 父节点是根节点
    if (newNode.parent.parent === null) {
      return;
    }
    
    // 修复红黑树属性
    this._fixInsert(newNode);
  }
  
  // 插入后修复
  _fixInsert(k) {
    let u;
    
    while (k.parent.color === 'RED') {
      if (k.parent === k.parent.parent.right) {
        u = k.parent.parent.left; // 叔叔节点
        
        if (u.color === 'RED') {
          // 情况1：叔叔是红色
          u.color = 'BLACK';
          k.parent.color = 'BLACK';
          k.parent.parent.color = 'RED';
          k = k.parent.parent;
        } else {
          if (k === k.parent.left) {
            // 情况2：叔叔是黑色，且k是左孩子
            k = k.parent;
            this._rightRotate(k);
          }
          // 情况3：叔叔是黑色，且k是右孩子
          k.parent.color = 'BLACK';
          k.parent.parent.color = 'RED';
          this._leftRotate(k.parent.parent);
        }
      } else {
        u = k.parent.parent.right; // 叔叔节点
        
        if (u.color === 'RED') {
          // 情况1：叔叔是红色
          u.color = 'BLACK';
          k.parent.color = 'BLACK';
          k.parent.parent.color = 'RED';
          k = k.parent.parent;
        } else {
          if (k === k.parent.right) {
            // 情况2：叔叔是黑色，且k是右孩子
            k = k.parent;
            this._leftRotate(k);
          }
          // 情况3：叔叔是黑色，且k是左孩子
          k.parent.color = 'BLACK';
          k.parent.parent.color = 'RED';
          this._rightRotate(k.parent.parent);
        }
      }
      
      if (k === this.root) {
        break;
      }
    }
    
    this.root.color = 'BLACK';
  }
  
  // 左旋转
  _leftRotate(x) {
    const y = x.right;
    x.right = y.left;
    
    if (y.left !== this.NIL) {
      y.left.parent = x;
    }
    
    y.parent = x.parent;
    
    if (x.parent === null) {
      this.root = y;
    } else if (x === x.parent.left) {
      x.parent.left = y;
    } else {
      x.parent.right = y;
    }
    
    y.left = x;
    x.parent = y;
  }
  
  // 右旋转
  _rightRotate(x) {
    const y = x.left;
    x.left = y.right;
    
    if (y.right !== this.NIL) {
      y.right.parent = x;
    }
    
    y.parent = x.parent;
    
    if (x.parent === null) {
      this.root = y;
    } else if (x === x.parent.right) {
      x.parent.right = y;
    } else {
      x.parent.left = y;
    }
    
    y.right = x;
    x.parent = y;
  }
}

// 示例
const rbt = new RedBlackTree();
rbt.insert(10);
rbt.insert(5);
rbt.insert(15);
rbt.insert(3);
rbt.insert(7);
rbt.insert(12);
rbt.insert(18);
```

#### 树遍历

树遍历是访问树中所有节点的过程。常见的树遍历方法有：

1. **前序遍历（Pre-order Traversal）**：根 -> 左 -> 右
2. **中序遍历（In-order Traversal）**：左 -> 根 -> 右
3. **后序遍历（Post-order Traversal）**：左 -> 右 -> 根
4. **层次遍历（Level-order Traversal）**：逐层从左到右访问

```javascript
// 前序遍历
function preOrderTraversal(node, result = []) {
  if (node && node !== null) {
    result.push(node.value); // 访问根节点
    preOrderTraversal(node.left, result); // 遍历左子树
    preOrderTraversal(node.right, result); // 遍历右子树
  }
  return result;
}

// 中序遍历
function inOrderTraversal(node, result = []) {
  if (node && node !== null) {
    inOrderTraversal(node.left, result); // 遍历左子树
    result.push(node.value); // 访问根节点
    inOrderTraversal(node.right, result); // 遍历右子树
  }
  return result;
}

// 后序遍历
function postOrderTraversal(node, result = []) {
  if (node && node !== null) {
    postOrderTraversal(node.left, result); // 遍历左子树
    postOrderTraversal(node.right, result); // 遍历右子树
    result.push(node.value); // 访问根节点
  }
  return result;
}

// 层次遍历
function levelOrderTraversal(root) {
  if (!root) return [];
  
  const result = [];
  const queue = [root];
  
  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel = [];
    
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

// 示例：使用上面创建的二叉搜索树
console.log('前序遍历:', preOrderTraversal(bst.root));
console.log('中序遍历:', inOrderTraversal(bst.root)); // 中序遍历BST得到排序数组
console.log('后序遍历:', postOrderTraversal(bst.root));
console.log('层次遍历:', levelOrderTraversal(bst.root));
```

### 堆（Heap）

**堆**是一种特殊的完全二叉树，它满足堆属性：
- 最大堆：每个节点的值都大于或等于其子节点的值
- 最小堆：每个节点的值都小于或等于其子节点的值

**特点**：
- 通常用数组实现
- 插入和删除操作的时间复杂度为 O(log n)
- 获取最大/最小值的时间复杂度为 O(1)

**应用场景**：
- 优先队列
- 堆排序
- 图算法（如Dijkstra算法）

#### 最小堆（Min Heap）

```javascript
class MinHeap {
  constructor() {
    this.heap = [];
  }

  // 获取父节点索引
  _getParentIndex(i) { return Math.floor((i - 1) / 2); }
  
  // 获取左子节点索引
  _getLeftChildIndex(i) { return 2 * i + 1; }
  
  // 获取右子节点索引
  _getRightChildIndex(i) { return 2 * i + 2; }

  // 交换节点
  _swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  // 向上调整（插入时）
  _siftUp(index) {
    let parentIndex = this._getParentIndex(index);
    
    // 如果当前节点小于父节点，交换位置并继续向上调整
    if (index > 0 && this.heap[index] < this.heap[parentIndex]) {
      this._swap(index, parentIndex);
      this._siftUp(parentIndex);
    }
  }

  // 向下调整（删除时）
  _siftDown(index) {
    let smallest = index;
    const left = this._getLeftChildIndex(index);
    const right = this._getRightChildIndex(index);
    const size = this.heap.length;
    
    // 如果左子节点小于当前节点，更新最小值索引
    if (left < size && this.heap[left] < this.heap[smallest]) {
      smallest = left;
    }
    
    // 如果右子节点小于当前最小节点，更新最小值索引
    if (right < size && this.heap[right] < this.heap[smallest]) {
      smallest = right;
    }
    
    // 如果最小值不是当前节点，交换位置并继续向下调整
    if (smallest !== index) {
      this._swap(index, smallest);
      this._siftDown(smallest);
    }
  }

  // 插入元素
  insert(value) {
    this.heap.push(value);
    this._siftUp(this.heap.length - 1);
    return this;
  }

  // 获取并删除最小值（根节点）
  extractMin() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();
    
    const min = this.heap[0];
    // 将最后一个元素放到根位置
    this.heap[0] = this.heap.pop();
    // 向下调整
    this._siftDown(0);
    
    return min;
  }

  // 获取最小值但不移除
  peek() {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  // 获取堆大小
  size() {
    return this.heap.length;
  }

  // 检查堆是否为空
  isEmpty() {
    return this.heap.length === 0;
  }

  // 构建堆（从数组）
  buildHeap(array) {
    this.heap = [...array];
    // 从最后一个非叶子节点开始向下调整
    for (let i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) {
      this._siftDown(i);
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
```

#### 最大堆（Max Heap）

```javascript
class MaxHeap {
  constructor() {
    this.heap = [];
  }

  // 获取父节点索引
  _getParentIndex(i) { return Math.floor((i - 1) / 2); }
  
  // 获取左子节点索引
  _getLeftChildIndex(i) { return 2 * i + 1; }
  
  // 获取右子节点索引
  _getRightChildIndex(i) { return 2 * i + 2; }

  // 交换节点
  _swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  // 向上调整（插入时）
  _siftUp(index) {
    let parentIndex = this._getParentIndex(index);
    
    // 如果当前节点大于父节点，交换位置并继续向上调整
    if (index > 0 && this.heap[index] > this.heap[parentIndex]) {
      this._swap(index, parentIndex);
      this._siftUp(parentIndex);
    }
  }

  // 向下调整（删除时）
  _siftDown(index) {
    let largest = index;
    const left = this._getLeftChildIndex(index);
    const right = this._getRightChildIndex(index);
    const size = this.heap.length;
    
    // 如果左子节点大于当前节点，更新最大值索引
    if (left < size && this.heap[left] > this.heap[largest]) {
      largest = left;
    }
    
    // 如果右子节点大于当前最大节点，更新最大值索引
    if (right < size && this.heap[right] > this.heap[largest]) {
      largest = right;
    }
    
    // 如果最大值不是当前节点，交换位置并继续向下调整
    if (largest !== index) {
      this._swap(index, largest);
      this._siftDown(largest);
    }
  }

  // 插入元素
  insert(value) {
    this.heap.push(value);
    this._siftUp(this.heap.length - 1);
    return this;
  }

  // 获取并删除最大值（根节点）
  extractMax() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();
    
    const max = this.heap[0];
    // 将最后一个元素放到根位置
    this.heap[0] = this.heap.pop();
    // 向下调整
    this._siftDown(0);
    
    return max;
  }

  // 获取最大值但不移除
  peek() {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  // 获取堆大小
  size() {
    return this.heap.length;
  }

  // 检查堆是否为空
  isEmpty() {
    return this.heap.length === 0;
  }

  // 构建堆（从数组）
  buildHeap(array) {
    this.heap = [...array];
    // 从最后一个非叶子节点开始向下调整
    for (let i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) {
      this._siftDown(i);
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

### 图（Graph）

**图**是由节点（顶点）和边组成的非线性数据结构，用于表示对象之间的关系。

**特点**：
- 节点表示对象
- 边表示对象之间的关系
- 可以是有向的或无向的
- 可以有权重或无权重

**应用场景**：
- 社交网络
- 路线规划
- 网络拓扑
- 依赖关系分析

#### 邻接矩阵表示法

邻接矩阵是一个二维数组，其中matrix[i][j]表示从顶点i到顶点j的边是否存在。

```javascript
class GraphMatrix {
  constructor(size) {
    this.size = size;
    this.matrix = Array(size)
      .fill(null)
      .map(() => Array(size).fill(0));
  }

  // 添加边（无向图）
  addEdge(v1, v2, weight = 1) {
    if (v1 >= 0 && v1 < this.size && v2 >= 0 && v2 < this.size) {
      this.matrix[v1][v2] = weight;
      this.matrix[v2][v1] = weight; // 无向图，双向都有边
    }
  }

  // 添加有向边
  addDirectedEdge(v1, v2, weight = 1) {
    if (v1 >= 0 && v1 < this.size && v2 >= 0 && v2 < this.size) {
      this.matrix[v1][v2] = weight;
    }
  }

  // 移除边
  removeEdge(v1, v2) {
    if (v1 >= 0 && v1 < this.size && v2 >= 0 && v2 < this.size) {
      this.matrix[v1][v2] = 0;
      this.matrix[v2][v1] = 0; // 无向图
    }
  }

  // 移除有向边
  removeDirectedEdge(v1, v2) {
    if (v1 >= 0 && v1 < this.size && v2 >= 0 && v2 < this.size) {
      this.matrix[v1][v2] = 0;
    }
  }

  // 检查是否有边
  hasEdge(v1, v2) {
    return this.matrix[v1][v2] !== 0;
  }

  // 获取顶点的邻接顶点
  getNeighbors(v) {
    const neighbors = [];
    for (let i = 0; i < this.size; i++) {
      if (this.matrix[v][i] !== 0) {
        neighbors.push(i);
      }
    }
    return neighbors;
  }

  // 打印邻接矩阵
  printMatrix() {
    for (let i = 0; i < this.size; i++) {
      console.log(this.matrix[i].join(' '));
    }
  }
}

// 示例
const graphMatrix = new GraphMatrix(5);
graphMatrix.addEdge(0, 1);
graphMatrix.addEdge(0, 2);
graphMatrix.addEdge(1, 3);
graphMatrix.addEdge(2, 4);
graphMatrix.printMatrix();
// 输出：
// 0 1 1 0 0
// 1 0 0 1 0
// 1 0 0 0 1
// 0 1 0 0 0
// 0 0 1 0 0
```

#### 邻接表表示法

邻接表是一种更空间高效的表示方法，每个顶点都有一个列表，包含与之相连的所有顶点。

```javascript
class GraphAdjacencyList {
  constructor() {
    this.adjacencyList = new Map();
  }

  // 添加顶点
  addVertex(vertex) {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
    }
  }

  // 添加边（无向图）
  addEdge(v1, v2, weight = 1) {
    // 确保顶点存在
    if (!this.adjacencyList.has(v1)) this.addVertex(v1);
    if (!this.adjacencyList.has(v2)) this.addVertex(v2);
    
    // 添加边
    this.adjacencyList.get(v1).push({ node: v2, weight });
    this.adjacencyList.get(v2).push({ node: v1, weight }); // 无向图，双向都有边
  }

  // 添加有向边
  addDirectedEdge(v1, v2, weight = 1) {
    // 确保顶点存在
    if (!this.adjacencyList.has(v1)) this.addVertex(v1);
    if (!this.adjacencyList.has(v2)) this.addVertex(v2);
    
    // 添加有向边
    this.adjacencyList.get(v1).push({ node: v2, weight });
  }

  // 移除边
  removeEdge(v1, v2) {
    if (this.adjacencyList.has(v1)) {
      this.adjacencyList.set(
        v1,
        this.adjacencyList.get(v1).filter(edge => edge.node !== v2)
      );
    }
    
    if (this.adjacencyList.has(v2)) {
      this.adjacencyList.set(
        v2,
        this.adjacencyList.get(v2).filter(edge => edge.node !== v1)
      );
    }
  }

  // 移除有向边
  removeDirectedEdge(v1, v2) {
    if (this.adjacencyList.has(v1)) {
      this.adjacencyList.set(
        v1,
        this.adjacencyList.get(v1).filter(edge => edge.node !== v2)
      );
    }
  }

  // 移除顶点
  removeVertex(vertex) {
    if (!this.adjacencyList.has(vertex)) return;
    
    // 移除所有指向该顶点的边
    for (const v of this.adjacencyList.keys()) {
      this.removeEdge(v, vertex);
    }
    
    // 移除顶点本身
    this.adjacencyList.delete(vertex);
  }

  // 获取顶点的邻接顶点
  getNeighbors(vertex) {
    return this.adjacencyList.get(vertex) || [];
  }

  // 深度优先搜索（DFS）- 递归
  dfsRecursive(start) {
    const result = [];
    const visited = {};
    const adjacencyList = this.adjacencyList;
    
    function dfs(vertex) {
      if (!vertex) return;
      visited[vertex] = true;
      result.push(vertex);
      
      adjacencyList.get(vertex).forEach(neighbor => {
        if (!visited[neighbor.node]) {
          return dfs(neighbor.node);
        }
      });
    }
    
    dfs(start);
    return result;
  }

  // 深度优先搜索（DFS）- 迭代
  dfsIterative(start) {
    const stack = [start];
    const result = [];
    const visited = {};
    let currentVertex;
    
    visited[start] = true;
    
    while (stack.length) {
      currentVertex = stack.pop();
      result.push(currentVertex);
      
      this.adjacencyList.get(currentVertex).forEach(neighbor => {
        if (!visited[neighbor.node]) {
          visited[neighbor.node] = true;
          stack.push(neighbor.node);
        }
      });
    }
    
    return result;
  }

  // 广度优先搜索（BFS）
  bfs(start) {
    const queue = [start];
    const result = [];
    const visited = {};
    let currentVertex;
    
    visited[start] = true;
    
    while (queue.length) {
      currentVertex = queue.shift();
      result.push(currentVertex);
      
      this.adjacencyList.get(currentVertex).forEach(neighbor => {
        if (!visited[neighbor.node]) {
          visited[neighbor.node] = true;
          queue.push(neighbor.node);
        }
      });
    }
    
    return result;
  }

  // 打印邻接表
  print() {
    for (const [vertex, edges] of this.adjacencyList.entries()) {
      console.log(`${vertex} -> ${edges.map(edge => edge.node).join(', ')}`);
    }
  }
}

// 示例
const graph = new GraphAdjacencyList();
graph.addVertex('A');
graph.addVertex('B');
graph.addVertex('C');
graph.addVertex('D');
graph.addVertex('E');
graph.addVertex('F');

graph.addEdge('A', 'B');
graph.addEdge('A', 'C');
graph.addEdge('B', 'D');
graph.addEdge('C', 'E');
graph.addEdge('D', 'E');
graph.addEdge('D', 'F');
graph.addEdge('E', 'F');

graph.print();
// 输出：
// A -> B, C
// B -> A, D
// C -> A, E
// D -> B, E, F
// E -> C, D, F
// F -> D, E

console.log('DFS Recursive:', graph.dfsRecursive('A'));
console.log('DFS Iterative:', graph.dfsIterative('A'));
console.log('BFS:', graph.bfs('A'));
```

## 数据结构选择指南

选择合适的数据结构对于解决问题至关重要。以下是一些选择数据结构的指导原则：

### 根据操作类型选择

- **频繁访问元素**：数组（O(1)随机访问）
- **频繁插入/删除元素**：链表（O(1)插入/删除）、树
- **频繁搜索元素**：哈希表（O(1)平均查找）、二叉搜索树（O(log n)查找）
- **需要保持元素顺序**：数组、链表、栈、队列
- **需要元素唯一性**：集合（Set）、哈希表
- **需要键值对映射**：哈希表（Map）

### 根据数据量选择

- **数据量小**：简单数据结构如数组、链表即可
- **数据量大**：需要更高效的数据结构，如平衡二叉树、哈希表
- **数据量巨大**：可能需要分布式数据结构或外部存储

### 根据内存限制选择

- **内存有限**：需要紧凑的数据结构，如数组、紧凑存储的树
- **内存充足**：可以使用更方便但占用更多内存的数据结构

## 数据结构应用场景

### 数组
- 简单列表存储
- 图像像素表示
- 数值计算
- 实现其他数据结构（栈、队列等）

### 链表
- 动态内存分配
- 实现其他数据结构（栈、队列等）
- 音乐播放器的播放列表
- 浏览器的前进后退功能

### 栈
- 函数调用管理
- 表达式求值和转换
- 括号匹配
- 撤销/重做操作

### 队列
- 任务调度
- 打印队列
- 网络请求处理
- 广度优先搜索（BFS）

### 哈希表
- 数据库索引
- 缓存系统
- 唯一性校验
- 关联数据存储

### 树
- 文件系统
- 数据库索引（B树、B+树）
- 决策树
- XML/HTML DOM结构

### 堆
- 优先队列
- 堆排序
- 图算法（如Dijkstra算法）
- 事件驱动系统

### 图
- 社交网络
- 路线规划
- 网络拓扑
- 依赖关系分析
- 搜索算法