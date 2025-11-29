# 链表 (Linked List) 基础知识

## 链表的基本概念

链表是一种线性数据结构，其中的每个元素都是一个独立的节点，节点之间通过指针或引用连接起来。与数组不同，链表中的元素在内存中不必是连续的，这使得链表在插入和删除操作上具有优势。

链表的基本组成部分：
- **节点(Node)**：链表中的基本元素，包含数据域和指针域
  - 数据域(Data)：存储节点的值
  - 指针域(Pointer/Reference)：存储指向下一个节点的指针或引用
- **头节点(Head)**：链表的第一个节点
- **尾节点(Tail)**：链表的最后一个节点，其指针域通常指向null

## 链表的类型

### 1. 单链表 (Singly Linked List)

每个节点只有一个指针，指向下一个节点。

**特点**：
- 只能从头到尾遍历，不能反向遍历
- 插入和删除操作效率高（不需要移动元素）
- 不能随机访问元素

**图示**：
```
Head -> [Data | Next] -> [Data | Next] -> ... -> [Data | null]
```

**代码实现**：

```javascript
// 单链表节点类
class ListNode {
  constructor(value) {
    this.value = value; // 数据域
    this.next = null; // 指针域，指向下一个节点
  }
}

// 单链表类
class SinglyLinkedList {
  constructor() {
    this.head = null; // 头节点
    this.tail = null; // 尾节点
    this.length = 0; // 链表长度
  }
  
  // 添加节点到链表末尾
  append(value) {
    const newNode = new ListNode(value);
    
    if (!this.head) {
      // 链表为空，新节点既是头节点也是尾节点
      this.head = newNode;
      this.tail = newNode;
    } else {
      // 链表不为空，将新节点添加到尾节点后面
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
      // 链表为空，新节点既是头节点也是尾节点
      this.head = newNode;
      this.tail = newNode;
    } else {
      // 链表不为空，将新节点添加到头部
      newNode.next = this.head;
      this.head = newNode;
    }
    
    this.length++;
    return this;
  }
  
  // 在指定位置插入节点
  insert(index, value) {
    // 检查索引是否有效
    if (index < 0 || index > this.length) {
      return false;
    }
    
    // 在头部插入
    if (index === 0) {
      return !!this.prepend(value);
    }
    
    // 在尾部插入
    if (index === this.length) {
      return !!this.append(value);
    }
    
    // 在中间插入
    const newNode = new ListNode(value);
    const prevNode = this.get(index - 1); // 获取前一个节点
    
    newNode.next = prevNode.next;
    prevNode.next = newNode;
    
    this.length++;
    return true;
  }
  
  // 获取指定位置的节点
  get(index) {
    // 检查索引是否有效
    if (index < 0 || index >= this.length) {
      return null;
    }
    
    let currentNode = this.head;
    let currentIndex = 0;
    
    while (currentIndex < index) {
      currentNode = currentNode.next;
      currentIndex++;
    }
    
    return currentNode;
  }
  
  // 更新指定位置节点的值
  set(index, value) {
    const node = this.get(index);
    
    if (node) {
      node.value = value;
      return true;
    }
    
    return false;
  }
  
  // 删除指定位置的节点
  remove(index) {
    // 检查索引是否有效
    if (index < 0 || index >= this.length) {
      return null;
    }
    
    let removedNode;
    
    // 删除头节点
    if (index === 0) {
      removedNode = this.head;
      this.head = this.head.next;
      
      if (this.length === 1) {
        // 如果只有一个节点，删除后尾节点也需要更新
        this.tail = null;
      }
    } else {
      // 删除非头节点
      const prevNode = this.get(index - 1);
      removedNode = prevNode.next;
      
      prevNode.next = removedNode.next;
      
      // 如果删除的是尾节点，更新尾节点
      if (index === this.length - 1) {
        this.tail = prevNode;
      }
    }
    
    this.length--;
    removedNode.next = null; // 断开连接
    return removedNode.value;
  }
  
  // 删除头节点
  shift() {
    return this.remove(0);
  }
  
  // 删除尾节点
  pop() {
    return this.remove(this.length - 1);
  }
  
  // 查找指定值的节点索引
  indexOf(value) {
    let currentNode = this.head;
    let index = 0;
    
    while (currentNode) {
      if (currentNode.value === value) {
        return index;
      }
      
      currentNode = currentNode.next;
      index++;
    }
    
    return -1; // 未找到
  }
  
  // 检查链表是否包含指定值
  contains(value) {
    return this.indexOf(value) !== -1;
  }
  
  // 反转链表
  reverse() {
    // 交换头节点和尾节点
    let temp = this.head;
    this.head = this.tail;
    this.tail = temp;
    
    let current = this.tail;
    let next = null;
    let prev = null;
    
    while (current) {
      next = current.next; // 保存下一个节点
      current.next = prev; // 反转指针
      prev = current; // 移动prev指针
      current = next; // 移动current指针
    }
    
    return this;
  }
  
  // 将链表转换为数组
  toArray() {
    const array = [];
    let currentNode = this.head;
    
    while (currentNode) {
      array.push(currentNode.value);
      currentNode = currentNode.next;
    }
    
    return array;
  }
  
  // 打印链表
  print() {
    console.log(this.toArray());
  }
}

// 示例
const list = new SinglyLinkedList();
list.append(10);
list.append(20);
list.prepend(5);
list.insert(2, 15);
list.print(); // [5, 10, 15, 20]
list.reverse();
list.print(); // [20, 15, 10, 5]
console.log(list.get(1).value); // 15
console.log(list.remove(2)); // 10
list.print(); // [20, 15, 5]
```

### 2. 双向链表 (Doubly Linked List)

每个节点有两个指针，分别指向前一个节点和后一个节点。

**特点**：
- 可以双向遍历
- 查找前驱节点的效率高
- 需要更多的内存空间

**图示**：
```
null <- [Prev | Data | Next] <-> [Prev | Data | Next] <-> ... <-> [Prev | Data | null]
```

**代码实现**：

```javascript
// 双向链表节点类
class DoublyListNode {
  constructor(value) {
    this.value = value; // 数据域
    this.prev = null; // 前驱指针
    this.next = null; // 后继指针
  }
}

// 双向链表类
class DoublyLinkedList {
  constructor() {
    this.head = null; // 头节点
    this.tail = null; // 尾节点
    this.length = 0; // 链表长度
  }
  
  // 添加节点到链表末尾
  append(value) {
    const newNode = new DoublyListNode(value);
    
    if (!this.head) {
      // 链表为空，新节点既是头节点也是尾节点
      this.head = newNode;
      this.tail = newNode;
    } else {
      // 链表不为空，将新节点添加到尾节点后面
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
      // 链表为空，新节点既是头节点也是尾节点
      this.head = newNode;
      this.tail = newNode;
    } else {
      // 链表不为空，将新节点添加到头部
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }
    
    this.length++;
    return this;
  }
  
  // 在指定位置插入节点
  insert(index, value) {
    // 检查索引是否有效
    if (index < 0 || index > this.length) {
      return false;
    }
    
    // 在头部插入
    if (index === 0) {
      return !!this.prepend(value);
    }
    
    // 在尾部插入
    if (index === this.length) {
      return !!this.append(value);
    }
    
    // 在中间插入
    const newNode = new DoublyListNode(value);
    let currentNode;
    
    // 优化：从离目标索引更近的一端开始遍历
    if (index < this.length / 2) {
      // 从头开始遍历
      currentNode = this.head;
      for (let i = 0; i < index; i++) {
        currentNode = currentNode.next;
      }
    } else {
      // 从尾开始遍历
      currentNode = this.tail;
      for (let i = this.length - 1; i > index; i--) {
        currentNode = currentNode.prev;
      }
    }
    
    // 插入节点
    const prevNode = currentNode.prev;
    prevNode.next = newNode;
    newNode.prev = prevNode;
    newNode.next = currentNode;
    currentNode.prev = newNode;
    
    this.length++;
    return true;
  }
  
  // 获取指定位置的节点
  get(index) {
    // 检查索引是否有效
    if (index < 0 || index >= this.length) {
      return null;
    }
    
    let currentNode;
    
    // 优化：从离目标索引更近的一端开始遍历
    if (index < this.length / 2) {
      // 从头开始遍历
      currentNode = this.head;
      for (let i = 0; i < index; i++) {
        currentNode = currentNode.next;
      }
    } else {
      // 从尾开始遍历
      currentNode = this.tail;
      for (let i = this.length - 1; i > index; i--) {
        currentNode = currentNode.prev;
      }
    }
    
    return currentNode;
  }
  
  // 更新指定位置节点的值
  set(index, value) {
    const node = this.get(index);
    
    if (node) {
      node.value = value;
      return true;
    }
    
    return false;
  }
  
  // 删除指定位置的节点
  remove(index) {
    // 检查索引是否有效
    if (index < 0 || index >= this.length) {
      return null;
    }
    
    let removedNode;
    
    // 删除头节点
    if (index === 0) {
      removedNode = this.head;
      this.head = this.head.next;
      
      if (this.head) {
        this.head.prev = null;
      } else {
        // 如果只有一个节点，删除后尾节点也需要更新
        this.tail = null;
      }
    }
    // 删除尾节点
    else if (index === this.length - 1) {
      removedNode = this.tail;
      this.tail = this.tail.prev;
      
      if (this.tail) {
        this.tail.next = null;
      } else {
        this.head = null;
      }
    }
    // 删除中间节点
    else {
      removedNode = this.get(index);
      removedNode.prev.next = removedNode.next;
      removedNode.next.prev = removedNode.prev;
    }
    
    this.length--;
    removedNode.prev = null;
    removedNode.next = null;
    return removedNode.value;
  }
  
  // 删除头节点
  shift() {
    return this.remove(0);
  }
  
  // 删除尾节点
  pop() {
    return this.remove(this.length - 1);
  }
  
  // 反转链表
  reverse() {
    let current = this.head;
    let temp = null;
    
    // 遍历链表，交换每个节点的prev和next指针
    while (current) {
      // 交换prev和next
      temp = current.prev;
      current.prev = current.next;
      current.next = temp;
      
      // 移动到下一个节点（现在是prev指针）
      current = current.prev;
    }
    
    // 交换头节点和尾节点
    temp = this.head;
    this.head = this.tail;
    this.tail = temp;
    
    return this;
  }
  
  // 将链表转换为数组
  toArray() {
    const array = [];
    let currentNode = this.head;
    
    while (currentNode) {
      array.push(currentNode.value);
      currentNode = currentNode.next;
    }
    
    return array;
  }
  
  // 打印链表
  print() {
    console.log(this.toArray());
  }
}

// 示例
const dll = new DoublyLinkedList();
dll.append(10);
dll.append(20);
dll.prepend(5);
dll.insert(2, 15);
dll.print(); // [5, 10, 15, 20]
dll.reverse();
dll.print(); // [20, 15, 10, 5]
console.log(dll.get(1).value); // 15
console.log(dll.remove(2)); // 10
dll.print(); // [20, 15, 5]
```

### 3. 循环链表 (Circular Linked List)

链表的最后一个节点指向第一个节点，形成一个环。

**特点**：
- 没有明确的头和尾
- 可以从任意节点开始遍历整个链表
- 常用于实现环形缓冲区、约瑟夫环等

**单循环链表图示**：
```
     +---------------------+
     |                     |
     v                     |
[Data | Next] -> [Data | Next] -> ... -> [Data | Next] 
```

**双循环链表图示**：
```
     +-----------------------------------------------------+
     |                                                     |
     v                                                     |
null <- [Prev | Data | Next] <-> [Prev | Data | Next] <-> ... 
     ^                                                     |
     |                                                     |
     +-----------------------------------------------------+
```

**单循环链表代码实现**：

```javascript
// 单循环链表类
class CircularLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }
  
  // 添加节点到链表末尾
  append(value) {
    const newNode = new ListNode(value);
    
    if (!this.head) {
      // 链表为空，新节点指向自身
      this.head = newNode;
      this.tail = newNode;
      newNode.next = this.head; // 形成环
    } else {
      // 链表不为空，新节点添加到尾部，并指向头部
      newNode.next = this.head; // 指向头部
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
      // 链表为空，新节点指向自身
      this.head = newNode;
      this.tail = newNode;
      newNode.next = this.head;
    } else {
      // 链表不为空，新节点添加到头部
      newNode.next = this.head;
      this.head = newNode;
      this.tail.next = this.head; // 更新尾部指向新的头部
    }
    
    this.length++;
    return this;
  }
  
  // 其他方法类似单链表，但需要注意循环的处理
  // ...
  
  // 将链表转换为数组（为了避免无限循环，限制遍历次数）
  toArray() {
    const array = [];
    if (!this.head) return array;
    
    let currentNode = this.head;
    let count = 0;
    
    while (count < this.length) {
      array.push(currentNode.value);
      currentNode = currentNode.next;
      count++;
    }
    
    return array;
  }
  
  // 打印链表
  print() {
    console.log(this.toArray());
  }
}

// 示例
const cll = new CircularLinkedList();
cll.append(10);
cll.append(20);
cll.append(30);
cll.print(); // [10, 20, 30]
```

## 链表与数组的比较

| 操作 | 数组 | 链表 |
|------|------|------|
| 随机访问 | O(1) | O(n) |
| 头部插入/删除 | O(n) | O(1) |
| 尾部插入/删除 | O(1) | O(1) |
| 中间插入/删除 | O(n) | O(1)（已找到位置） |
| 内存分配 | 连续空间 | 分散空间，额外存储指针 |
| 遍历 | O(n) | O(n) |

## 链表的应用场景

### 1. 实现其他数据结构

链表是实现许多高级数据结构的基础，如：
- 栈 (Stack)
- 队列 (Queue)
- 哈希表的冲突处理（链地址法）
- 图的邻接表表示

### 2. 频繁的插入和删除操作

当需要频繁地在数据结构中插入和删除元素时，链表是一个很好的选择，因为这些操作的时间复杂度为 O(1)。

### 3. 动态内存分配

链表不需要预先分配固定大小的内存，可以根据需要动态增长，适合元素数量不确定的场景。

### 4. 实现LRU缓存

```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map(); // 用于O(1)查找
    
    // 创建双向链表的头尾哨兵节点
    this.head = { key: null, value: null };
    this.tail = { key: null, value: null };
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }
  
  // 将节点移到链表头部（最近使用）
  moveToHead(node) {
    this.removeNode(node);
    this.addToHead(node);
  }
  
  // 从链表中移除节点
  removeNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }
  
  // 将节点添加到链表头部
  addToHead(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }
  
  // 移除链表尾部节点（最久未使用）
  removeTail() {
    const tailNode = this.tail.prev;
    this.removeNode(tailNode);
    return tailNode;
  }
  
  // 获取缓存值
  get(key) {
    if (this.cache.has(key)) {
      const node = this.cache.get(key);
      // 将访问的节点移到链表头部
      this.moveToHead(node);
      return node.value;
    }
    return -1;
  }
  
  // 设置缓存值
  put(key, value) {
    if (this.cache.has(key)) {
      // 更新已存在的节点
      const node = this.cache.get(key);
      node.value = value;
      this.moveToHead(node);
    } else {
      // 创建新节点
      const newNode = { key, value };
      this.cache.set(key, newNode);
      this.addToHead(newNode);
      
      // 如果超出容量，移除最久未使用的节点
      if (this.cache.size > this.capacity) {
        const tailNode = this.removeTail();
        this.cache.delete(tailNode.key);
      }
    }
  }
}
```

### 5. 多项式表示

链表可以有效地表示多项式，每个节点存储系数和指数。

### 6. 内存管理

操作系统中的内存分配器通常使用链表来管理空闲内存块。

## 链表的常见算法问题

### 1. 反转链表

**问题**：将单链表反转。

**解题思路**：使用三个指针（prev、current、next）遍历链表，逐个反转指针。

```javascript
function reverseLinkedList(head) {
  let prev = null;
  let current = head;
  
  while (current) {
    const next = current.next; // 保存下一个节点
    current.next = prev; // 反转指针
    prev = current; // 移动prev指针
    current = next; // 移动current指针
  }
  
  return prev; // 新的头节点
}
```

### 2. 检测链表中的环

**问题**：判断链表中是否存在环。

**解题思路**：使用快慢指针（Floyd's Cycle-Finding Algorithm）。

```javascript
function hasCycle(head) {
  if (!head || !head.next) return false;
  
  let slow = head;
  let fast = head;
  
  while (fast && fast.next) {
    slow = slow.next; // 慢指针每次移动一步
    fast = fast.next.next; // 快指针每次移动两步
    
    if (slow === fast) {
      // 快慢指针相遇，存在环
      return true;
    }
  }
  
  return false; // 快指针到达链表尾部，不存在环
}
```

### 3. 找到链表的中间节点

**问题**：找到链表的中间节点。

**解题思路**：使用快慢指针，快指针每次移动两步，慢指针每次移动一步，当快指针到达尾部时，慢指针指向中间节点。

```javascript
function findMiddleNode(head) {
  if (!head) return null;
  
  let slow = head;
  let fast = head;
  
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  
  return slow; // 慢指针指向中间节点
}
```

### 4. 删除链表中的倒数第N个节点

**问题**：删除链表中的倒数第N个节点。

**解题思路**：使用快慢指针，快指针先走N步，然后快慢指针一起走，当快指针到达尾部时，慢指针指向要删除节点的前一个节点。

```javascript
function removeNthFromEnd(head, n) {
  // 创建哨兵节点，简化边界情况处理
  const dummy = new ListNode(0);
  dummy.next = head;
  
  let fast = dummy;
  let slow = dummy;
  
  // 快指针先走n+1步
  for (let i = 0; i <= n; i++) {
    fast = fast.next;
  }
  
  // 快慢指针一起走，直到快指针到达尾部
  while (fast) {
    slow = slow.next;
    fast = fast.next;
  }
  
  // 慢指针指向要删除节点的前一个节点
  slow.next = slow.next.next;
  
  return dummy.next;
}
```

### 5. 合并两个有序链表

**问题**：合并两个升序链表，返回合并后的有序链表。

**解题思路**：使用迭代或递归方法，比较两个链表的节点值，逐个合并。

```javascript
// 迭代方法
function mergeTwoLists(l1, l2) {
  const dummy = new ListNode(0);
  let tail = dummy;
  
  while (l1 && l2) {
    if (l1.value <= l2.value) {
      tail.next = l1;
      l1 = l1.next;
    } else {
      tail.next = l2;
      l2 = l2.next;
    }
    tail = tail.next;
  }
  
  // 连接剩余部分
  tail.next = l1 || l2;
  
  return dummy.next;
}

// 递归方法
function mergeTwoListsRecursive(l1, l2) {
  if (!l1) return l2;
  if (!l2) return l1;
  
  if (l1.value <= l2.value) {
    l1.next = mergeTwoListsRecursive(l1.next, l2);
    return l1;
  } else {
    l2.next = mergeTwoListsRecursive(l1, l2.next);
    return l2;
  }
}
```

### 6. 相交链表

**问题**：找到两个链表的相交节点。

**解题思路**：使用双指针，分别从两个链表头部开始遍历，当一个指针到达链表尾部时，将其重定向到另一个链表的头部，直到两个指针相遇。

```javascript
function getIntersectionNode(headA, headB) {
  if (!headA || !headB) return null;
  
  let pA = headA;
  let pB = headB;
  
  // 当pA和pB不相等时继续遍历
  while (pA !== pB) {
    // 如果pA到达链表A的尾部，则将其重定向到链表B的头部
    // 否则，pA继续向后移动
    pA = pA ? pA.next : headB;
    
    // 同理处理pB
    pB = pB ? pB.next : headA;
  }
  
  // pA和pB要么同时为null（没有交点），要么同时指向相交节点
  return pA;
}
```

## 总结

链表是一种灵活的线性数据结构，它通过节点和指针在内存中组织数据。与数组相比，链表在插入和删除操作上具有优势，但在随机访问上性能较差。

链表的主要类型包括：
- 单链表：每个节点只有一个指向下一个节点的指针
- 双向链表：每个节点有两个指针，分别指向前一个和后一个节点
- 循环链表：链表的最后一个节点指向第一个节点，形成一个环

链表在计算机科学中有广泛的应用，包括实现其他数据结构（如栈、队列、哈希表）、LRU缓存、内存管理等。理解链表的基本概念和常见操作，对于解决算法问题和优化程序性能都非常重要。

在实际编程中，我们需要根据具体问题的特点，选择合适的数据结构。如果需要频繁地插入和删除元素，链表可能是一个好选择；如果需要频繁地随机访问元素，数组可能更适合。