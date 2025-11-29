# 哈希表 (Hash Table) 基础知识

## 哈希表的基本概念

哈希表是一种非常高效的数据结构，它通过哈希函数将键（Key）映射到值（Value），从而实现常数时间复杂度的查找、插入和删除操作。哈希表在计算机科学中有着广泛的应用，包括数据库索引、缓存、关联数组等。

哈希表的核心组成部分：
- **哈希函数**：将任意长度的输入转换为固定长度的输出（哈希值）
- **桶数组**：存储键值对的数组，每个数组元素称为一个桶
- **碰撞处理机制**：解决不同键映射到同一个桶的冲突问题

## 哈希函数

### 哈希函数的特性

一个好的哈希函数应该具备以下特性：
1. **确定性**：相同的输入总是产生相同的输出
2. **高效性**：计算哈希值的过程应该快速
3. **均匀分布**：将键均匀地分布在哈希表中，减少碰撞
4. **雪崩效应**：输入的微小变化会导致输出的显著变化

### 常见的哈希函数实现方式

#### 1. 直接定址法

直接使用键值作为哈希值。

```javascript
function directAddressHash(key) {
  return key;
}
```

#### 2. 除留余数法

将键值除以一个质数，取余数作为哈希值。

```javascript
function divisionHash(key, tableSize) {
  return key % tableSize;
}
```

#### 3. 平方取中法

将键值平方，然后取中间的几位作为哈希值。

```javascript
function midSquareHash(key, tableSize) {
  const squared = key * key;
  const str = squared.toString();
  const mid = Math.floor(str.length / 2);
  // 取中间的几位，转换为数字
  const midDigits = parseInt(str.substring(Math.max(0, mid - 2), mid + 2));
  return midDigits % tableSize;
}
```

#### 4. 折叠法

将键值分割成几个部分，然后将这些部分相加得到哈希值。

```javascript
function foldingHash(key, tableSize) {
  const str = key.toString();
  let hash = 0;
  
  // 将键值分割成每3位一组
  for (let i = 0; i < str.length; i += 3) {
    const chunk = parseInt(str.substring(i, i + 3)) || 0;
    hash += chunk;
  }
  
  return hash % tableSize;
}
```

#### 5. 字符串哈希函数

针对字符串的哈希函数。

```javascript
function stringHash(str, tableSize) {
  let hash = 0;
  
  for (let i = 0; i < str.length; i++) {
    // 使用霍纳法则计算多项式哈希
    hash = (hash * 31 + str.charCodeAt(i)) % tableSize;
  }
  
  return hash;
}
```

## 碰撞处理

即使使用最好的哈希函数，也无法完全避免两个不同的键映射到同一个桶的情况，这就是哈希冲突（Collision）。有多种方法可以处理哈希冲突。

### 1. 链地址法（Chaining）

将同一个哈希值的所有键值对存储在一个链表中。

**优点**：
- 简单易实现
- 不需要重新哈希
- 负载因子可以大于1

**缺点**：
- 需要额外的内存来存储链表节点
- 如果链表很长，查找时间会退化到 O(n)

**链地址法哈希表实现**：

```javascript
class HashTableChaining {
  constructor(size = 16) {
    this.size = size;
    this.buckets = Array(size).fill().map(() => []);
  }
  
  // 哈希函数
  hash(key) {
    let hashValue = 0;
    const stringKey = String(key);
    
    for (let i = 0; i < stringKey.length; i++) {
      hashValue = (hashValue * 31 + stringKey.charCodeAt(i)) % this.size;
    }
    
    return hashValue;
  }
  
  // 插入或更新键值对
  set(key, value) {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    
    // 检查是否已存在该键
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        // 更新值
        bucket[i][1] = value;
        return;
      }
    }
    
    // 添加新的键值对
    bucket.push([key, value]);
  }
  
  // 获取值
  get(key) {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    
    // 查找键
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        return bucket[i][1];
      }
    }
    
    return undefined; // 键不存在
  }
  
  // 删除键值对
  delete(key) {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    
    // 查找并删除键值对
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket.splice(i, 1);
        return true; // 删除成功
      }
    }
    
    return false; // 键不存在
  }
  
  // 检查键是否存在
  has(key) {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        return true;
      }
    }
    
    return false;
  }
  
  // 获取所有键
  keys() {
    const allKeys = [];
    
    for (const bucket of this.buckets) {
      for (const [key, value] of bucket) {
        allKeys.push(key);
      }
    }
    
    return allKeys;
  }
  
  // 获取所有值
  values() {
    const allValues = [];
    
    for (const bucket of this.buckets) {
      for (const [key, value] of bucket) {
        allValues.push(value);
      }
    }
    
    return allValues;
  }
  
  // 获取所有键值对
  entries() {
    const allEntries = [];
    
    for (const bucket of this.buckets) {
      for (const entry of bucket) {
        allEntries.push(entry);
      }
    }
    
    return allEntries;
  }
  
  // 清空哈希表
  clear() {
    this.buckets = Array(this.size).fill().map(() => []);
  }
  
  // 获取哈希表的大小
  getSize() {
    let count = 0;
    
    for (const bucket of this.buckets) {
      count += bucket.length;
    }
    
    return count;
  }
  
  // 获取负载因子
  getLoadFactor() {
    return this.getSize() / this.size;
  }
}

// 示例
const hashTable = new HashTableChaining();
hashTable.set('name', 'John');
hashTable.set('age', 30);
hashTable.set('city', 'New York');
console.log(hashTable.get('name')); // 'John'
console.log(hashTable.has('age')); // true
hashTable.delete('city');
console.log(hashTable.get('city')); // undefined
console.log(hashTable.keys()); // ['name', 'age']
console.log(hashTable.values()); // ['John', 30]
```

### 2. 开放寻址法（Open Addressing）

当发生冲突时，寻找哈希表中的其他位置来存储键值对。

#### 2.1 线性探测（Linear Probing）

如果当前位置已被占用，则依次检查下一个位置。

**优点**：
- 不需要额外的内存
- 数据局部性好

**缺点**：
- 容易产生聚集（Clustering）
- 负载因子应小于0.7

**线性探测哈希表实现**：

```javascript
class HashTableLinearProbing {
  constructor(size = 16) {
    this.size = size;
    this.keys = new Array(size);
    this.values = new Array(size);
    this.count = 0;
  }
  
  // 哈希函数
  hash(key) {
    let hashValue = 0;
    const stringKey = String(key);
    
    for (let i = 0; i < stringKey.length; i++) {
      hashValue = (hashValue * 31 + stringKey.charCodeAt(i)) % this.size;
    }
    
    return hashValue;
  }
  
  // 线性探测下一个位置
  probe(index) {
    return (index + 1) % this.size;
  }
  
  // 插入或更新键值对
  set(key, value) {
    // 检查负载因子，如果过高则扩容
    if (this.count >= this.size * 0.7) {
      this.resize();
    }
    
    let index = this.hash(key);
    
    // 线性探测，寻找可用位置或更新已存在的键
    while (this.keys[index] !== undefined) {
      if (this.keys[index] === key) {
        // 更新值
        this.values[index] = value;
        return;
      }
      index = this.probe(index);
    }
    
    // 插入新的键值对
    this.keys[index] = key;
    this.values[index] = value;
    this.count++;
  }
  
  // 获取值
  get(key) {
    let index = this.hash(key);
    let originalIndex = index;
    
    // 线性探测，寻找键
    while (this.keys[index] !== undefined) {
      if (this.keys[index] === key) {
        return this.values[index];
      }
      
      index = this.probe(index);
      
      // 如果回到原点，说明键不存在
      if (index === originalIndex) {
        return undefined;
      }
    }
    
    return undefined; // 键不存在
  }
  
  // 删除键值对（惰性删除）
  delete(key) {
    let index = this.hash(key);
    let originalIndex = index;
    
    // 线性探测，寻找键
    while (this.keys[index] !== undefined) {
      if (this.keys[index] === key) {
        // 标记为删除（惰性删除）
        this.keys[index] = null; // 可以使用一个特殊标记
        this.values[index] = undefined;
        this.count--;
        return true; // 删除成功
      }
      
      index = this.probe(index);
      
      // 如果回到原点，说明键不存在
      if (index === originalIndex) {
        return false;
      }
    }
    
    return false; // 键不存在
  }
  
  // 检查键是否存在
  has(key) {
    let index = this.hash(key);
    let originalIndex = index;
    
    // 线性探测，寻找键
    while (this.keys[index] !== undefined) {
      if (this.keys[index] === key) {
        return true;
      }
      
      index = this.probe(index);
      
      // 如果回到原点，说明键不存在
      if (index === originalIndex) {
        return false;
      }
    }
    
    return false;
  }
  
  // 调整哈希表大小
  resize() {
    const oldKeys = this.keys;
    const oldValues = this.values;
    const oldSize = this.size;
    
    // 扩大为原来的两倍
    this.size *= 2;
    this.keys = new Array(this.size);
    this.values = new Array(this.size);
    this.count = 0;
    
    // 重新插入所有非空键值对
    for (let i = 0; i < oldSize; i++) {
      if (oldKeys[i] !== undefined && oldKeys[i] !== null) {
        this.set(oldKeys[i], oldValues[i]);
      }
    }
  }
  
  // 获取所有键
  keys() {
    const allKeys = [];
    
    for (let i = 0; i < this.size; i++) {
      if (this.keys[i] !== undefined && this.keys[i] !== null) {
        allKeys.push(this.keys[i]);
      }
    }
    
    return allKeys;
  }
  
  // 获取所有值
  values() {
    const allValues = [];
    
    for (let i = 0; i < this.size; i++) {
      if (this.keys[i] !== undefined && this.keys[i] !== null) {
        allValues.push(this.values[i]);
      }
    }
    
    return allValues;
  }
  
  // 获取哈希表的大小
  getSize() {
    return this.count;
  }
  
  // 获取负载因子
  getLoadFactor() {
    return this.count / this.size;
  }
}

// 示例
const hashTable2 = new HashTableLinearProbing();
hashTable2.set('name', 'John');
hashTable2.set('age', 30);
hashTable2.set('city', 'New York');
console.log(hashTable2.get('name')); // 'John'
console.log(hashTable2.has('age')); // true
hashTable2.delete('city');
console.log(hashTable2.get('city')); // undefined
console.log(hashTable2.keys()); // ['name', 'age']
```

#### 2.2 二次探测（Quadratic Probing）

如果当前位置已被占用，则使用二次函数计算下一个位置。

**优点**：
- 减少了线性探测中的聚集问题

**缺点**：
- 仍可能产生二次聚集
- 需要确保表大小是质数

**二次探测哈希表实现**：

```javascript
class HashTableQuadraticProbing {
  constructor(size = 17) { // 使用质数大小
    this.size = size;
    this.keys = new Array(size);
    this.values = new Array(size);
    this.count = 0;
  }
  
  // 哈希函数
  hash(key) {
    let hashValue = 0;
    const stringKey = String(key);
    
    for (let i = 0; i < stringKey.length; i++) {
      hashValue = (hashValue * 31 + stringKey.charCodeAt(i)) % this.size;
    }
    
    return hashValue;
  }
  
  // 二次探测下一个位置
  probe(index, attempt) {
    return (index + attempt * attempt) % this.size;
  }
  
  // 插入或更新键值对
  set(key, value) {
    // 检查负载因子，如果过高则扩容
    if (this.count >= this.size * 0.5) { // 二次探测的负载因子应更低
      this.resize();
    }
    
    let attempt = 0;
    let index = this.hash(key);
    
    // 二次探测，寻找可用位置或更新已存在的键
    while (this.keys[index] !== undefined) {
      if (this.keys[index] === key) {
        // 更新值
        this.values[index] = value;
        return;
      }
      attempt++;
      index = this.probe(this.hash(key), attempt);
    }
    
    // 插入新的键值对
    this.keys[index] = key;
    this.values[index] = value;
    this.count++;
  }
  
  // 获取值
  get(key) {
    let attempt = 0;
    let index = this.hash(key);
    
    // 二次探测，寻找键
    while (this.keys[index] !== undefined) {
      if (this.keys[index] === key) {
        return this.values[index];
      }
      
      attempt++;
      index = this.probe(this.hash(key), attempt);
      
      // 如果尝试次数过多，可能发生无限循环，这里设置一个上限
      if (attempt > this.size) {
        return undefined;
      }
    }
    
    return undefined; // 键不存在
  }
  
  // 其他方法类似线性探测，这里省略...
}
```

#### 2.3 双重哈希（Double Hashing）

使用第二个哈希函数来计算探测步长。

**优点**：
- 减少聚集问题
- 探测序列更加分散

**缺点**：
- 需要设计第二个哈希函数
- 实现复杂度较高

**双重哈希哈希表实现**：

```javascript
class HashTableDoubleHashing {
  constructor(size = 16) {
    this.size = size;
    this.keys = new Array(size);
    this.values = new Array(size);
    this.count = 0;
  }
  
  // 主哈希函数
  hash1(key) {
    let hashValue = 0;
    const stringKey = String(key);
    
    for (let i = 0; i < stringKey.length; i++) {
      hashValue = (hashValue * 31 + stringKey.charCodeAt(i)) % this.size;
    }
    
    return hashValue;
  }
  
  // 次哈希函数（用于计算步长）
  hash2(key) {
    const stringKey = String(key);
    let hashValue = 0;
    
    for (let i = 0; i < stringKey.length; i++) {
      hashValue = (hashValue * 17 + stringKey.charCodeAt(i)) % (this.size - 1);
    }
    
    return hashValue + 1; // 确保步长不为0
  }
  
  // 双重哈希探测
  probe(index, key, attempt) {
    return (index + attempt * this.hash2(key)) % this.size;
  }
  
  // 插入或更新键值对
  set(key, value) {
    // 检查负载因子
    if (this.count >= this.size * 0.7) {
      this.resize();
    }
    
    let attempt = 0;
    let index = this.hash1(key);
    
    // 双重哈希探测
    while (this.keys[index] !== undefined) {
      if (this.keys[index] === key) {
        this.values[index] = value;
        return;
      }
      attempt++;
      index = this.probe(this.hash1(key), key, attempt);
    }
    
    this.keys[index] = key;
    this.values[index] = value;
    this.count++;
  }
  
  // 获取值
  get(key) {
    let attempt = 0;
    let index = this.hash1(key);
    
    // 双重哈希探测
    while (this.keys[index] !== undefined) {
      if (this.keys[index] === key) {
        return this.values[index];
      }
      
      attempt++;
      index = this.probe(this.hash1(key), key, attempt);
      
      if (attempt > this.size) {
        return undefined;
      }
    }
    
    return undefined;
  }
  
  // 其他方法类似，这里省略...
}
```

## 哈希表的性能分析

### 时间复杂度

在理想情况下（无冲突）：
- 查找：O(1)
- 插入：O(1)
- 删除：O(1)

在最坏情况下（所有键都映射到同一个桶）：
- 链地址法：O(n)
- 开放寻址法：O(n)

### 负载因子

负载因子（Load Factor）定义为哈希表中存储的键值对数量与桶数组大小的比值。

- 对于链地址法，负载因子可以大于1
- 对于开放寻址法，负载因子应小于0.7（线性探测）或0.5（二次探测）

较高的负载因子会增加冲突的可能性，从而降低哈希表的性能。

### 扩容（Rehashing）

当哈希表的负载因子过高时，需要进行扩容操作：
1. 创建一个更大的桶数组
2. 重新计算所有键的哈希值，并将它们插入新的桶数组中

扩容的时间复杂度是 O(n)，但由于扩容操作不是频繁发生的，平均下来每次操作的时间复杂度仍然接近 O(1)。

## 哈希表的应用

### 1. 数据索引和查询

哈希表可以快速定位数据，常用于数据库索引和缓存系统。

### 2. 缓存

哈希表的快速查询特性使其成为实现缓存的理想数据结构。

```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map(); // 使用JavaScript的Map，保持插入顺序
  }
  
  get(key) {
    if (!this.cache.has(key)) {
      return -1;
    }
    
    // 将访问的元素移到末尾（最近使用）
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    
    return value;
  }
  
  put(key, value) {
    // 如果键已存在，先删除
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } 
    // 如果缓存已满，删除最久未使用的元素（Map的第一个元素）
    else if (this.cache.size >= this.capacity) {
      this.cache.delete(this.cache.keys().next().value);
    }
    
    // 将新元素添加到末尾
    this.cache.set(key, value);
  }
}
```

### 3. 查找重复元素

使用哈希表可以高效地查找数组中的重复元素。

```javascript
function findDuplicates(nums) {
  const seen = new Set();
  const duplicates = new Set();
  
  for (const num of nums) {
    if (seen.has(num)) {
      duplicates.add(num);
    } else {
      seen.add(num);
    }
  }
  
  return Array.from(duplicates);
}

// 示例
const nums = [1, 2, 3, 4, 2, 5, 6, 3];
console.log(findDuplicates(nums)); // [2, 3]
```

### 4. 两数之和问题

使用哈希表可以在 O(n) 时间内解决两数之和问题。

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
  
  return []; // 如果没有找到解
}

// 示例
const nums = [2, 7, 11, 15];
const target = 9;
console.log(twoSum(nums, target)); // [0, 1]
```

### 5. 最长无重复子串

使用哈希表可以在 O(n) 时间内找出最长无重复字符的子串。

```javascript
function lengthOfLongestSubstring(s) {
  const charMap = new Map();
  let maxLength = 0;
  let left = 0;
  
  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    
    // 如果字符已存在且在当前窗口内
    if (charMap.has(char) && charMap.get(char) >= left) {
      // 更新左边界到重复字符的下一个位置
      left = charMap.get(char) + 1;
    }
    
    // 更新字符的最新位置
    charMap.set(char, right);
    
    // 计算窗口长度
    maxLength = Math.max(maxLength, right - left + 1);
  }
  
  return maxLength;
}

// 示例
const s = "abcabcbb";
console.log(lengthOfLongestSubstring(s)); // 3 ("abc")
```

## 哈希表的优化

### 1. 选择合适的哈希函数

一个好的哈希函数可以减少冲突，提高哈希表的性能。对于不同类型的键，可能需要不同的哈希函数。

### 2. 动态调整大小

根据负载因子动态调整哈希表的大小，可以平衡时间效率和空间效率。

### 3. 使用质数作为表的大小

使用质数作为表的大小可以减少冲突，特别是在使用除留余数法和二次探测时。

### 4. 预分配足够的空间

如果知道大致的数据规模，可以预分配足够的空间，减少扩容操作的次数。

### 5. 缓存友好的设计

设计哈希表时考虑数据局部性，可以提高缓存命中率，从而提升性能。

## JavaScript中的哈希表实现

JavaScript中内置了几种哈希表相关的数据结构：

### 1. Object

JavaScript的Object是最基本的哈希表实现，但它有一些限制：
- 键只能是字符串或Symbol
- 会继承原型链上的属性
- 没有提供直接遍历键值对的方法

```javascript
const obj = {};
obj.name = 'John';
obj.age = 30;
console.log(obj['name']); // 'John'
console.log('age' in obj); // true
```

### 2. Map

ES6引入的Map是更现代的哈希表实现：
- 可以使用任何类型作为键
- 保持插入顺序
- 提供了专门的遍历方法
- 没有原型链继承问题

```javascript
const map = new Map();
map.set('name', 'John');
map.set(1, 'one');
map.set({ key: 'value' }, 'object key');
console.log(map.get('name')); // 'John'
console.log(map.has(1)); // true

// 遍历
for (const [key, value] of map) {
  console.log(key, value);
}
```

### 3. Set

Set是一种特殊的哈希表，它只存储键而不存储值：
- 自动去重
- 保持插入顺序
- 提供了专门的集合操作方法

```javascript
const set = new Set([1, 2, 3, 3, 4]);
console.log(set.size); // 4
set.add(5);
set.delete(2);
console.log(set.has(3)); // true

// 遍历
for (const item of set) {
  console.log(item); // 1, 3, 4, 5
}
```

## 总结

哈希表是一种高效的数据结构，它通过哈希函数将键映射到值，实现了常数时间复杂度的查找、插入和删除操作。选择合适的哈希函数和碰撞处理方法对于构建高效的哈希表至关重要。

在实际应用中，我们需要根据具体需求选择适当的哈希表实现，并注意优化哈希表的性能。JavaScript提供了Object、Map和Set等内置数据结构，这些结构在大多数情况下已经足够高效，可以直接使用。

哈希表的核心优势在于其快速的查找能力，这使得它成为许多算法和数据结构的基础，如缓存、关联数组、集合等。理解哈希表的工作原理和实现细节，对于编写高效的代码和解决复杂的问题都非常重要。