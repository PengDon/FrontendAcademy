# 排序算法知识点

## 常见排序算法

### 1. 冒泡排序（Bubble Sort）

**原理**：相邻元素两两比较，大的元素往后移。

```javascript
function bubbleSort(arr) {
    const len = arr.length;
    for (let i = 0; i < len - 1; i++) {
        let swapped = false;
        for (let j = 0; j < len - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
            }
        }
        if (!swapped) break;
    }
    return arr;
}
```

**时间复杂度**：
- 最佳：O(n)（已排序）
- 平均：O(n²)
- 最坏：O(n²)

**空间复杂度**：O(1)

### 2. 选择排序（Selection Sort）

**原理**：每次从未排序部分选择最小元素，放到已排序部分的末尾。

```javascript
function selectionSort(arr) {
    const len = arr.length;
    for (let i = 0; i < len - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < len; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
    return arr;
}
```

**时间复杂度**：
- 最佳：O(n²)
- 平均：O(n²)
- 最坏：O(n²)

**空间复杂度**：O(1)

### 3. 插入排序（Insertion Sort）

**原理**：将未排序元素插入到已排序部分的正确位置。

```javascript
function insertionSort(arr) {
    const len = arr.length;
    for (let i = 1; i < len; i++) {
        let current = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > current) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = current;
    }
    return arr;
}
```

**时间复杂度**：
- 最佳：O(n)（已排序）
- 平均：O(n²)
- 最坏：O(n²)

**空间复杂度**：O(1)

### 4. 归并排序（Merge Sort）

**原理**：分治法，将数组分成两半，分别排序后合并。

```javascript
function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
    
    return merge(left, right);
}

function merge(left, right) {
    let result = [];
    let i = 0, j = 0;
    
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result.push(left[i++]);
        } else {
            result.push(right[j++]);
        }
    }
    
    return result.concat(left.slice(i)).concat(right.slice(j));
}
```

**时间复杂度**：
- 最佳：O(n log n)
- 平均：O(n log n)
- 最坏：O(n log n)

**空间复杂度**：O(n)

### 5. 快速排序（Quick Sort）

**原理**：选择一个基准元素，将数组分为小于基准和大于基准的两部分，递归排序。

```javascript
function quickSort(arr, left = 0, right = arr.length - 1) {
    if (left < right) {
        const pivotIndex = partition(arr, left, right);
        quickSort(arr, left, pivotIndex - 1);
        quickSort(arr, pivotIndex + 1, right);
    }
    return arr;
}

function partition(arr, left, right) {
    const pivot = arr[right];
    let i = left - 1;
    
    for (let j = left; j < right; j++) {
        if (arr[j] <= pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    
    [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
    return i + 1;
}
```

**时间复杂度**：
- 最佳：O(n log n)
- 平均：O(n log n)
- 最坏：O(n²)（已排序或倒序）

**空间复杂度**：O(log n)

### 6. 堆排序（Heap Sort）

**原理**：利用堆数据结构进行排序。

```javascript
function heapSort(arr) {
    let len = arr.length;
    
    // 构建最大堆
    for (let i = Math.floor(len / 2) - 1; i >= 0; i--) {
        heapify(arr, len, i);
    }
    
    // 一个个取出堆顶元素
    for (let i = len - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]]; // 交换堆顶和最后一个元素
        heapify(arr, i, 0); // 重新堆化
    }
    
    return arr;
}

function heapify(arr, len, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    if (left < len && arr[left] > arr[largest]) {
        largest = left;
    }
    
    if (right < len && arr[right] > arr[largest]) {
        largest = right;
    }
    
    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        heapify(arr, len, largest);
    }
}
```

**时间复杂度**：
- 最佳：O(n log n)
- 平均：O(n log n)
- 最坏：O(n log n)

**空间复杂度**：O(1)

## 排序算法比较

| 排序算法 | 时间复杂度（平均） | 时间复杂度（最坏） | 空间复杂度 | 稳定性 |
|---------|-------------------|-------------------|-----------|--------|
| 冒泡排序 | O(n²)              | O(n²)              | O(1)      | 稳定   |
| 选择排序 | O(n²)              | O(n²)              | O(1)      | 不稳定 |
| 插入排序 | O(n²)              | O(n²)              | O(1)      | 稳定   |
| 归并排序 | O(n log n)         | O(n log n)         | O(n)      | 稳定   |
| 快速排序 | O(n log n)         | O(n²)              | O(log n)  | 不稳定 |
| 堆排序   | O(n log n)         | O(n log n)         | O(1)      | 不稳定 |

## 常见问题与答案

### 1. 什么是排序算法的稳定性？
**答案：** 稳定性是指排序后，相等元素的相对位置是否保持不变。如果保持不变，则为稳定排序；否则为不稳定排序。

### 2. 什么时候选择插入排序而不是快速排序？
**答案：** 当数据量较小或基本有序时，插入排序的性能可能比快速排序更好，因为插入排序的常数因子较小。

### 3. 如何优化快速排序？
**答案：**
- 选择合适的基准元素（如三数取中）
- 对于小数据量使用插入排序
- 处理重复元素（三路快排）
- 避免递归栈溢出（使用迭代或限制递归深度）

### 4. 为什么归并排序在外部排序中更常用？
**答案：** 归并排序需要额外的空间，但它的时间复杂度稳定，可以有效处理大数据量，适合外部排序。