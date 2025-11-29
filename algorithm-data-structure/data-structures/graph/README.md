# 图数据结构 (Graph) 基础知识

## 图的基本概念

图(Graph)是一种非线性的数据结构，由顶点(Vertex)和边(Edge)组成。它是一种强大的数据结构，可以用来表示对象之间的多对多关系。

图的基本组成部分：
- **顶点(Vertex)**：图中的节点，通常用V表示顶点集合
- **边(Edge)**：连接两个顶点的线，通常用E表示边集合

## 图的分类

### 1. 按边的方向性

- **无向图**：边没有方向，两个顶点之间可以互相到达
- **有向图**：边有方向，只能从一个顶点指向另一个顶点
- **混合图**：同时包含有向边和无向边

### 2. 按边的权值

- **无权图**：边没有权值
- **加权图**：边上有表示某种意义的数值（如距离、成本等）

### 3. 按连通性

- **连通图**：无向图中任意两个顶点都可以通过一条路径连接
- **强连通图**：有向图中任意两个顶点都可以互相到达
- **弱连通图**：有向图忽略边的方向后变为连通图

### 4. 其他特殊图

- **完全图**：任意两个顶点之间都有一条边
- **稀疏图**：边的数量远少于完全图的图
- **密集图**：边的数量接近完全图的图
- **树**：无环的连通图
- **森林**：由多棵不相连的树组成的图
- **二分图**：顶点可以分成两组，所有边都连接不同组的顶点

## 图的表示方法

### 1. 邻接矩阵 (Adjacency Matrix)

使用一个二维数组来表示图，数组的元素 `matrix[i][j]` 表示顶点 i 到顶点 j 的边的信息。

- 对于无权图，`matrix[i][j] = 1` 表示存在边，`matrix[i][j] = 0` 表示不存在边
- 对于加权图，`matrix[i][j]` 存储边的权值

**优点**：
- 检查两个顶点之间是否有边的操作时间复杂度为 O(1)
- 适合稠密图

**缺点**：
- 空间复杂度为 O(V²)，其中 V 是顶点数量
- 遍历一个顶点的所有邻接点需要 O(V) 时间

**代码实现**：

```javascript
class GraphAdjacencyMatrix {
  constructor(size) {
    this.size = size;
    this.matrix = Array(size).fill().map(() => Array(size).fill(0));
  }
  
  // 添加边（无向图）
  addEdge(vertex1, vertex2, weight = 1) {
    this.matrix[vertex1][vertex2] = weight;
    this.matrix[vertex2][vertex1] = weight;
  }
  
  // 添加有向边
  addDirectedEdge(vertex1, vertex2, weight = 1) {
    this.matrix[vertex1][vertex2] = weight;
  }
  
  // 移除边（无向图）
  removeEdge(vertex1, vertex2) {
    this.matrix[vertex1][vertex2] = 0;
    this.matrix[vertex2][vertex1] = 0;
  }
  
  // 移除有向边
  removeDirectedEdge(vertex1, vertex2) {
    this.matrix[vertex1][vertex2] = 0;
  }
  
  // 检查是否存在边
  hasEdge(vertex1, vertex2) {
    return this.matrix[vertex1][vertex2] !== 0;
  }
  
  // 获取边的权值
  getWeight(vertex1, vertex2) {
    return this.matrix[vertex1][vertex2];
  }
  
  // 获取一个顶点的所有邻接点
  getNeighbors(vertex) {
    const neighbors = [];
    for (let i = 0; i < this.size; i++) {
      if (this.matrix[vertex][i] !== 0) {
        neighbors.push(i);
      }
    }
    return neighbors;
  }
}

// 示例
const graph = new GraphAdjacencyMatrix(5);
graph.addEdge(0, 1);
graph.addEdge(0, 2);
graph.addEdge(1, 3);
graph.addEdge(2, 4);
console.log(graph.getNeighbors(0)); // [1, 2]
```

### 2. 邻接表 (Adjacency List)

使用一个数组或对象，其中每个顶点对应一个列表，列表中存储与该顶点相邻的所有顶点。

**优点**：
- 空间复杂度为 O(V + E)，其中 V 是顶点数量，E 是边的数量
- 遍历一个顶点的所有邻接点需要 O(E/V) 时间（平均情况下）
- 适合稀疏图

**缺点**：
- 检查两个顶点之间是否有边的操作时间复杂度为 O(E/V)（平均情况下）

**代码实现**：

```javascript
class GraphAdjacencyList {
  constructor() {
    this.adjList = new Map();
  }
  
  // 添加顶点
  addVertex(vertex) {
    if (!this.adjList.has(vertex)) {
      this.adjList.set(vertex, []);
    }
  }
  
  // 添加边（无向图）
  addEdge(vertex1, vertex2, weight = 1) {
    // 确保两个顶点都存在
    this.addVertex(vertex1);
    this.addVertex(vertex2);
    
    // 添加边
    this.adjList.get(vertex1).push({ vertex: vertex2, weight });
    this.adjList.get(vertex2).push({ vertex: vertex1, weight });
  }
  
  // 添加有向边
  addDirectedEdge(vertex1, vertex2, weight = 1) {
    this.addVertex(vertex1);
    this.addVertex(vertex2);
    
    this.adjList.get(vertex1).push({ vertex: vertex2, weight });
  }
  
  // 移除边（无向图）
  removeEdge(vertex1, vertex2) {
    if (this.adjList.has(vertex1)) {
      this.adjList.set(vertex1, 
        this.adjList.get(vertex1).filter(item => item.vertex !== vertex2)
      );
    }
    
    if (this.adjList.has(vertex2)) {
      this.adjList.set(vertex2, 
        this.adjList.get(vertex2).filter(item => item.vertex !== vertex1)
      );
    }
  }
  
  // 移除有向边
  removeDirectedEdge(vertex1, vertex2) {
    if (this.adjList.has(vertex1)) {
      this.adjList.set(vertex1, 
        this.adjList.get(vertex1).filter(item => item.vertex !== vertex2)
      );
    }
  }
  
  // 移除顶点
  removeVertex(vertex) {
    // 先移除所有指向该顶点的边
    for (const [v] of this.adjList) {
      this.removeDirectedEdge(v, vertex);
    }
    
    // 移除该顶点
    this.adjList.delete(vertex);
  }
  
  // 检查是否存在边
  hasEdge(vertex1, vertex2) {
    if (!this.adjList.has(vertex1)) return false;
    return this.adjList.get(vertex1).some(item => item.vertex === vertex2);
  }
  
  // 获取边的权值
  getWeight(vertex1, vertex2) {
    if (!this.adjList.has(vertex1)) return 0;
    const edge = this.adjList.get(vertex1).find(item => item.vertex === vertex2);
    return edge ? edge.weight : 0;
  }
  
  // 获取一个顶点的所有邻接点
  getNeighbors(vertex) {
    if (!this.adjList.has(vertex)) return [];
    return this.adjList.get(vertex).map(item => item.vertex);
  }
  
  // 获取图中所有顶点
  getVertices() {
    return Array.from(this.adjList.keys());
  }
  
  // 获取图中所有边
  getEdges() {
    const edges = [];
    for (const [vertex, neighbors] of this.adjList) {
      for (const { vertex: neighbor, weight } of neighbors) {
        edges.push({ source: vertex, target: neighbor, weight });
      }
    }
    return edges;
  }
}

// 示例
const graph2 = new GraphAdjacencyList();
graph2.addVertex('A');
graph2.addVertex('B');
graph2.addVertex('C');
graph2.addVertex('D');
graph2.addEdge('A', 'B');
graph2.addEdge('A', 'C');
graph2.addEdge('B', 'D');
console.log(graph2.getNeighbors('A')); // ['B', 'C']
console.log(graph2.getVertices()); // ['A', 'B', 'C', 'D']
```

### 3. 关联矩阵 (Incidence Matrix)

使用一个二维数组，其中行表示顶点，列表示边。

- 对于无向图，`matrix[i][j] = 1` 表示顶点 i 是边 j 的一个端点
- 对于有向图，`matrix[i][j] = 1` 表示顶点 i 是边 j 的起点，`matrix[i][j] = -1` 表示顶点 i 是边 j 的终点

## 图的遍历算法

### 1. 深度优先搜索 (DFS)

**算法思想**：从起始顶点出发，尽可能深地沿着一条路径前进，直到无法继续为止，然后回溯到上一个顶点，探索其他路径。

**实现方式**：递归或使用栈

**代码实现**：

```javascript
// 递归实现DFS
function dfs(graph, startVertex, visited = new Set()) {
  // 标记当前顶点为已访问
  visited.add(startVertex);
  console.log('访问顶点:', startVertex);
  
  // 访问所有未访问的邻接点
  const neighbors = graph.getNeighbors(startVertex);
  for (const neighbor of neighbors) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited);
    }
  }
  
  return visited;
}

// 迭代实现DFS
function dfsIterative(graph, startVertex) {
  const stack = [startVertex];
  const visited = new Set();
  
  while (stack.length > 0) {
    const vertex = stack.pop();
    
    if (!visited.has(vertex)) {
      visited.add(vertex);
      console.log('访问顶点:', vertex);
      
      // 将邻接点压入栈中（注意顺序，以保持与递归版本相似的访问顺序）
      const neighbors = graph.getNeighbors(vertex);
      for (let i = neighbors.length - 1; i >= 0; i--) {
        const neighbor = neighbors[i];
        if (!visited.has(neighbor)) {
          stack.push(neighbor);
        }
      }
    }
  }
  
  return visited;
}
```

### 2. 广度优先搜索 (BFS)

**算法思想**：从起始顶点出发，先访问其所有邻接点，然后再访问这些邻接点的邻接点，逐层扩展搜索范围。

**实现方式**：使用队列

**代码实现**：

```javascript
function bfs(graph, startVertex) {
  const queue = [startVertex];
  const visited = new Set([startVertex]);
  
  while (queue.length > 0) {
    const vertex = queue.shift();
    console.log('访问顶点:', vertex);
    
    // 访问所有未访问的邻接点
    const neighbors = graph.getNeighbors(vertex);
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  
  return visited;
}
```

## 图的常见算法

### 1. 最短路径算法

#### 1.1 Dijkstra 算法

**适用场景**：寻找加权图中从一个顶点到其他所有顶点的最短路径（边权不能为负）

**算法思想**：
1. 维护一个距离数组，记录从起始顶点到每个顶点的最短距离
2. 每次从未访问的顶点中选择距离最小的顶点，标记为已访问
3. 更新从该顶点出发到其所有未访问邻接点的距离
4. 重复步骤2和3，直到所有顶点都被访问

**代码实现**：

```javascript
function dijkstra(graph, startVertex) {
  const vertices = graph.getVertices();
  const distances = {};
  const visited = {};
  
  // 初始化距离，起点为0，其他为无穷大
  for (const vertex of vertices) {
    distances[vertex] = vertex === startVertex ? 0 : Infinity;
    visited[vertex] = false;
  }
  
  for (let i = 0; i < vertices.length; i++) {
    // 找到当前距离最小的未访问顶点
    let minDistance = Infinity;
    let minVertex = null;
    
    for (const vertex of vertices) {
      if (!visited[vertex] && distances[vertex] < minDistance) {
        minDistance = distances[vertex];
        minVertex = vertex;
      }
    }
    
    // 如果所有未访问顶点都不可达，退出循环
    if (minVertex === null) break;
    
    // 标记该顶点为已访问
    visited[minVertex] = true;
    
    // 更新从该顶点出发到其邻接点的距离
    const neighbors = graph.getNeighbors(minVertex);
    for (const neighbor of neighbors) {
      const weight = graph.getWeight(minVertex, neighbor);
      const newDistance = distances[minVertex] + weight;
      
      if (newDistance < distances[neighbor]) {
        distances[neighbor] = newDistance;
      }
    }
  }
  
  return distances;
}
```

#### 1.2 Floyd-Warshall 算法

**适用场景**：寻找加权图中所有顶点对之间的最短路径

**算法思想**：使用动态规划，逐步考虑以每个顶点作为中间顶点，更新任意两点之间的最短路径

**时间复杂度**：O(V³)，其中 V 是顶点数量

**代码实现**（基于邻接矩阵）：

```javascript
function floydWarshall(matrix) {
  const n = matrix.length;
  // 创建距离矩阵的副本
  const dist = matrix.map(row => [...row]);
  
  // 初始化：如果顶点i到顶点j没有直接边，设置为Infinity
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j && dist[i][j] === 0) {
        dist[i][j] = Infinity;
      }
    }
  }
  
  // 考虑以每个顶点k作为中间顶点
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        // 如果通过顶点k的路径更短，则更新
        if (dist[i][k] !== Infinity && dist[k][j] !== Infinity && 
            dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
  }
  
  return dist;
}
```

### 2. 最小生成树算法

#### 2.1 Kruskal 算法

**适用场景**：寻找加权无向图的最小生成树

**算法思想**：
1. 将所有边按权值从小到大排序
2. 依次选择边，如果加入该边不会形成环，则将其加入最小生成树
3. 直到选择了V-1条边（V是顶点数量）

**代码实现**：

```javascript
// 并查集（用于检测环）
class UnionFind {
  constructor(vertices) {
    this.parent = {};
    for (const vertex of vertices) {
      this.parent[vertex] = vertex;
    }
  }
  
  find(vertex) {
    if (this.parent[vertex] !== vertex) {
      this.parent[vertex] = this.find(this.parent[vertex]); // 路径压缩
    }
    return this.parent[vertex];
  }
  
  union(vertex1, vertex2) {
    const root1 = this.find(vertex1);
    const root2 = this.find(vertex2);
    
    if (root1 !== root2) {
      this.parent[root2] = root1;
      return true; // 合并成功
    }
    
    return false; // 已经在同一个集合中，合并失败
  }
}

function kruskal(graph) {
  const vertices = graph.getVertices();
  const edges = graph.getEdges();
  const mst = []; // 最小生成树的边
  const uf = new UnionFind(vertices);
  
  // 按边的权值从小到大排序
  edges.sort((a, b) => a.weight - b.weight);
  
  // 依次选择边
  for (const edge of edges) {
    // 如果加入该边不会形成环
    if (uf.union(edge.source, edge.target)) {
      mst.push(edge);
      
      // 如果已经选择了V-1条边，结束
      if (mst.length === vertices.length - 1) {
        break;
      }
    }
  }
  
  return mst;
}
```

#### 2.2 Prim 算法

**适用场景**：寻找加权无向图的最小生成树

**算法思想**：
1. 从任意一个顶点开始，初始化解集
2. 每次从未加入解集的顶点中选择与解集距离最小的顶点，将其加入解集
3. 更新解集到未加入顶点的距离
4. 重复步骤2和3，直到所有顶点都被加入解集

**代码实现**：

```javascript
function prim(graph, startVertex) {
  const vertices = graph.getVertices();
  const mst = []; // 最小生成树的边
  const visited = new Set();
  const distances = {};
  const parent = {};
  
  // 初始化距离和父节点
  for (const vertex of vertices) {
    distances[vertex] = Infinity;
    parent[vertex] = null;
  }
  distances[startVertex] = 0;
  
  for (let i = 0; i < vertices.length; i++) {
    // 找到当前距离最小的未访问顶点
    let minDistance = Infinity;
    let minVertex = null;
    
    for (const vertex of vertices) {
      if (!visited.has(vertex) && distances[vertex] < minDistance) {
        minDistance = distances[vertex];
        minVertex = vertex;
      }
    }
    
    if (minVertex === null) break;
    
    // 标记该顶点为已访问
    visited.add(minVertex);
    
    // 如果不是起始顶点，添加到MST
    if (parent[minVertex] !== null) {
      mst.push({
        source: parent[minVertex],
        target: minVertex,
        weight: minDistance
      });
    }
    
    // 更新距离
    const neighbors = graph.getNeighbors(minVertex);
    for (const neighbor of neighbors) {
      const weight = graph.getWeight(minVertex, neighbor);
      if (!visited.has(neighbor) && weight < distances[neighbor]) {
        distances[neighbor] = weight;
        parent[neighbor] = minVertex;
      }
    }
  }
  
  return mst;
}
```

### 3. 拓扑排序算法

**适用场景**：对有向无环图(DAG)的顶点进行排序，使得对于每条有向边(u,v)，顶点u在排序结果中都出现在顶点v之前。

#### 3.1 Kahn 算法（基于入度）

**算法思想**：
1. 计算所有顶点的入度
2. 将所有入度为0的顶点加入队列
3. 从队列中取出顶点，将其加入结果序列，并将其所有邻接点的入度减1
4. 如果减1后邻接点的入度变为0，则将其加入队列
5. 重复步骤3和4，直到队列为空

**代码实现**：

```javascript
function topologicalSortKahn(graph) {
  const vertices = graph.getVertices();
  const inDegree = {};
  const result = [];
  const queue = [];
  
  // 初始化入度
  for (const vertex of vertices) {
    inDegree[vertex] = 0;
  }
  
  // 计算所有顶点的入度
  for (const vertex of vertices) {
    const neighbors = graph.getNeighbors(vertex);
    for (const neighbor of neighbors) {
      inDegree[neighbor]++;
    }
  }
  
  // 将所有入度为0的顶点加入队列
  for (const vertex of vertices) {
    if (inDegree[vertex] === 0) {
      queue.push(vertex);
    }
  }
  
  // 执行拓扑排序
  while (queue.length > 0) {
    const current = queue.shift();
    result.push(current);
    
    // 将所有邻接点的入度减1
    const neighbors = graph.getNeighbors(current);
    for (const neighbor of neighbors) {
      inDegree[neighbor]--;
      // 如果入度变为0，加入队列
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    }
  }
  
  // 检查是否存在环
  if (result.length !== vertices.length) {
    console.log('图中存在环，无法进行拓扑排序');
    return null;
  }
  
  return result;
}
```

#### 3.2 深度优先搜索（DFS）实现

**算法思想**：
1. 对每个未访问的顶点进行DFS
2. 在DFS回溯时，将顶点加入结果序列
3. 最后反转结果序列

**代码实现**：

```javascript
function topologicalSortDFS(graph) {
  const vertices = graph.getVertices();
  const visited = new Set();
  const recursionStack = new Set(); // 用于检测环
  const result = [];
  
  function dfs(vertex) {
    // 如果正在当前递归栈中访问该顶点，说明存在环
    if (recursionStack.has(vertex)) {
      console.log('图中存在环，无法进行拓扑排序');
      return false;
    }
    
    // 如果已经访问过该顶点，直接返回
    if (visited.has(vertex)) {
      return true;
    }
    
    // 标记为正在访问
    recursionStack.add(vertex);
    
    // 访问所有邻接点
    const neighbors = graph.getNeighbors(vertex);
    for (const neighbor of neighbors) {
      if (!dfs(neighbor)) {
        return false;
      }
    }
    
    // 标记为已访问，从递归栈中移除
    recursionStack.delete(vertex);
    visited.add(vertex);
    
    // 将顶点加入结果（回溯时）
    result.push(vertex);
    
    return true;
  }
  
  // 对每个未访问的顶点进行DFS
  for (const vertex of vertices) {
    if (!visited.has(vertex)) {
      if (!dfs(vertex)) {
        return null;
      }
    }
  }
  
  // 反转结果，得到正确的拓扑排序
  return result.reverse();
}
```

## 图的实际应用

1. **社交网络分析**：用户之间的关系可以用图表示，用于分析社群结构、推荐朋友等
2. **路由算法**：网络中的路由器和连接可以用图表示，用于寻找最短路径
3. **地图导航**：城市和道路可以用图表示，用于路径规划
4. **依赖关系**：软件包之间的依赖关系可以用有向无环图表示
5. **编译器优化**：程序的控制流和数据流可以用图表示
6. **搜索引擎**：网页之间的链接可以用图表示（PageRank算法）
7. **推荐系统**：用户和物品之间的交互可以用二分图表示
8. **游戏开发**：游戏中的地图和关卡可以用图表示，用于寻路算法

## 总结

图是一种强大的数据结构，能够有效地表示对象之间的复杂关系。在实际应用中，我们需要根据具体问题选择合适的图表示方法和算法。

选择图表示方法时，需要考虑：
- 图的稀疏程度
- 常用的操作类型（查找边、遍历邻接点等）
- 内存限制

选择图算法时，需要考虑：
- 问题类型（路径查找、连通性、最小生成树等）
- 图的特性（有向/无向、加权/无权、是否有环等）
- 性能要求

通过深入理解图的概念和各种图算法，我们可以更有效地解决各种复杂的问题。