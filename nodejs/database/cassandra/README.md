# Cassandra 与 Node.js 集成

## 1. Cassandra 基础概念

Apache Cassandra是一个高度可扩展的分布式NoSQL数据库，专为处理大量数据而设计，具有高可用性、无单点故障和线性可扩展性特点。它最初由Facebook开发，用于处理大量的社交网络数据，后来开源并成为Apache项目。

### 1.1 Cassandra 的主要特性

- **分布式架构**：数据分布在多个节点上，无单点故障
- **高可用性**：即使部分节点故障，系统仍能正常运行
- **线性可扩展性**：随着节点数量增加，性能线性提升
- **弹性伸缩**：可以方便地添加或移除节点
- **多数据中心支持**：原生支持跨数据中心复制
- **列式存储**：基于列族的数据模型，适合宽表查询
- **灵活的数据模型**：支持结构化、半结构化和非结构化数据
- **强大的写性能**：针对写密集型应用进行了优化

### 1.2 Cassandra 的应用场景

- **社交媒体**：存储用户信息、帖子、评论等
- **物联网**：处理传感器数据流和设备信息
- **电商**：产品目录、用户行为分析、推荐系统
- **日志和时间序列数据**：服务器日志、应用性能监控
- **实时分析**：大规模数据的实时查询和分析
- **金融服务**：交易数据、账户信息、风险分析

## 2. Node.js 中使用 Cassandra

### 2.1 安装依赖

```bash
npm install cassandra-driver
```

### 2.2 基本连接配置

```javascript
const cassandra = require('cassandra-driver');

// 连接配置
const client = new cassandra.Client({
  contactPoints: ['127.0.0.1:9042'], // Cassandra 节点列表
  localDataCenter: 'datacenter1', // 本地数据中心
  keyspace: 'mykeyspace', // 默认的键空间
  credentials: {
    username: 'cassandra',
    password: 'cassandra'
  },
  socketOptions: {
    connectTimeout: 5000 // 连接超时设置（毫秒）
  },
  pooling: {
    coreConnectionsPerHost: {
      [cassandra.types.distance.local]: 2,  // 本地节点连接数
      [cassandra.types.distance.remote]: 1  // 远程节点连接数
    }
  },
  queryOptions: {
    consistency: cassandra.types.consistencies.localQuorum // 默认一致性级别
  }
});

// 连接到 Cassandra
async function connectToCassandra() {
  try {
    await client.connect();
    console.log('已成功连接到 Cassandra 集群');
    
    // 检查连接状态
    const connectedHosts = client.hosts.values().map(h => h.address);
    console.log('已连接的节点:', connectedHosts);
  } catch (error) {
    console.error('连接 Cassandra 失败:', error);
    process.exit(1);
  }
}

// 断开连接
async function disconnectFromCassandra() {
  try {
    await client.shutdown();
    console.log('已断开与 Cassandra 的连接');
  } catch (error) {
    console.error('断开连接时出错:', error);
  }
}

// 执行示例
async function runExample() {
  await connectToCassandra();
  try {
    // 执行查询或其他操作
    console.log('Cassandra 客户端已准备就绪');
  } finally {
    // await disconnectFromCassandra(); // 生产环境中通常保持连接
  }
}

runExample().catch(console.error);
```

## 3. 数据定义与管理

### 3.1 创建键空间 (Keyspace)

```javascript
async function createKeyspace() {
  const query = `
    CREATE KEYSPACE IF NOT EXISTS mykeyspace
    WITH replication = {
      'class': 'SimpleStrategy',
      'replication_factor': 1
    }
    AND durable_writes = true;
  `;
  
  try {
    await client.execute(query);
    console.log('键空间 mykeyspace 创建成功');
  } catch (error) {
    console.error('创建键空间失败:', error);
  }
}

// 列出所有键空间
async function listKeyspaces() {
  try {
    const result = await client.execute('DESCRIBE KEYSPACES');
    console.log('所有键空间:', result.rows);
  } catch (error) {
    console.error('列出键空间失败:', error);
  }
}
```

### 3.2 创建表 (Table)

```javascript
async function createTables() {
  // 切换到要使用的键空间
  await client.execute('USE mykeyspace');
  
  // 创建用户表
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      user_id uuid PRIMARY KEY,
      username text,
      email text,
      created_at timestamp,
      last_login timestamp,
      profile map<text, text>,
      tags set<text>
    );
  `;
  
  // 创建产品表
  const createProductsTable = `
    CREATE TABLE IF NOT EXISTS products (
      product_id uuid,
      category text,
      name text,
      price decimal,
      description text,
      features list<text>,
      inventory int,
      created_at timestamp,
      PRIMARY KEY (category, product_id)
    );
  `;
  
  // 创建订单表（使用复合主键）
  const createOrdersTable = `
    CREATE TABLE IF NOT EXISTS orders (
      order_id uuid,
      user_id uuid,
      order_date timestamp,
      status text,
      total decimal,
      items list<frozen<map<text, text>>>,
      PRIMARY KEY ((user_id), order_date, order_id)
    ) WITH CLUSTERING ORDER BY (order_date DESC);
  `;
  
  try {
    await client.execute(createUsersTable);
    console.log('用户表创建成功');
    
    await client.execute(createProductsTable);
    console.log('产品表创建成功');
    
    await client.execute(createOrdersTable);
    console.log('订单表创建成功');
  } catch (error) {
    console.error('创建表失败:', error);
  }
}

// 列出所有表
async function listTables() {
  try {
    const result = await client.execute('DESCRIBE TABLES');
    console.log('所有表:', result.rows);
  } catch (error) {
    console.error('列出表失败:', error);
  }
}

// 查看表结构
async function describeTable(tableName) {
  try {
    const result = await client.execute(`DESCRIBE TABLE ${tableName}`);
    console.log(`${tableName} 表结构:`, result.rows);
  } catch (error) {
    console.error(`查看 ${tableName} 表结构失败:`, error);
  }
}
```

### 3.3 索引和物化视图

```javascript
async function createIndexesAndViews() {
  // 创建二级索引
  const createEmailIndex = `
    CREATE INDEX IF NOT EXISTS idx_users_email 
    ON users (email);
  `;
  
  const createProductNameIndex = `
    CREATE INDEX IF NOT EXISTS idx_products_name 
    ON products (name);
  `;
  
  // 创建物化视图
  const createOrderByStatusView = `
    CREATE MATERIALIZED VIEW IF NOT EXISTS orders_by_status AS
    SELECT order_id, user_id, order_date, status, total
    FROM orders
    WHERE status IS NOT NULL AND order_id IS NOT NULL AND user_id IS NOT NULL AND order_date IS NOT NULL
    PRIMARY KEY (status, order_date, user_id, order_id)
    WITH CLUSTERING ORDER BY (order_date DESC);
  `;
  
  try {
    await client.execute(createEmailIndex);
    console.log('用户邮箱索引创建成功');
    
    await client.execute(createProductNameIndex);
    console.log('产品名称索引创建成功');
    
    await client.execute(createOrderByStatusView);
    console.log('按状态排序的订单物化视图创建成功');
  } catch (error) {
    console.error('创建索引或物化视图失败:', error);
  }
}
```

## 4. 数据操作 (CRUD)

### 4.1 插入数据 (INSERT)

```javascript
async function insertData() {
  const { v4: uuidv4 } = require('uuid');
  
  // 插入用户数据
  const insertUserQuery = `
    INSERT INTO users (user_id, username, email, created_at, profile, tags)
    VALUES (?, ?, ?, ?, ?, ?)
    IF NOT EXISTS;
  `;
  
  const userId = uuidv4();
  const userParams = [
    userId,
    'johndoe',
    'john.doe@example.com',
    new Date(),
    { 'first_name': 'John', 'last_name': 'Doe', 'country': 'USA' },
    ['premium', 'verified']
  ];
  
  // 插入产品数据
  const insertProductQuery = `
    INSERT INTO products (product_id, category, name, price, description, features, inventory)
    VALUES (?, ?, ?, ?, ?, ?, ?);
  `;
  
  const productId = uuidv4();
  const productParams = [
    productId,
    'electronics',
    'Smartphone X',
    new cassandra.types.Decimal(699.99),
    'Latest smartphone with advanced features',
    ['5G', '128GB Storage', '24MP Camera'],
    150
  ];
  
  // 插入订单数据
  const insertOrderQuery = `
    INSERT INTO orders (order_id, user_id, order_date, status, total, items)
    VALUES (?, ?, ?, ?, ?, ?);
  `;
  
  const orderId = uuidv4();
  const orderItems = [
    { 'product_id': productId.toString(), 'quantity': '1', 'price': '699.99' }
  ];
  
  const orderParams = [
    orderId,
    userId,
    new Date(),
    'pending',
    new cassandra.types.Decimal(699.99),
    orderItems
  ];
  
  try {
    const userResult = await client.execute(insertUserQuery, userParams, { prepare: true });
    console.log('用户插入成功:', userResult);
    
    const productResult = await client.execute(insertProductQuery, productParams, { prepare: true });
    console.log('产品插入成功:', productResult);
    
    const orderResult = await client.execute(insertOrderQuery, orderParams, { prepare: true });
    console.log('订单插入成功:', orderResult);
  } catch (error) {
    console.error('插入数据失败:', error);
  }
}
```

### 4.2 查询数据 (SELECT)

```javascript
async function queryData() {
  // 查询单个用户
  const getUserQuery = 'SELECT * FROM users WHERE user_id = ?';
  const userId = '123e4567-e89b-12d3-a456-426614174000'; // 替换为实际的用户ID
  
  // 查询所有用户
  const getAllUsersQuery = 'SELECT * FROM users LIMIT 10';
  
  // 使用二级索引查询
  const getUsersByEmailQuery = 'SELECT * FROM users WHERE email = ?';
  const email = 'john.doe@example.com';
  
  // 查询产品类别
  const getProductsByCategoryQuery = 'SELECT * FROM products WHERE category = ? ORDER BY product_id';
  const category = 'electronics';
  
  // 查询用户的订单（按时间倒序）
  const getUserOrdersQuery = 'SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC LIMIT 5';
  
  try {
    // 查询单个用户
    const userResult = await client.execute(getUserQuery, [userId], { prepare: true });
    console.log('用户数据:', userResult.rows[0]);
    
    // 查询所有用户
    const allUsersResult = await client.execute(getAllUsersQuery);
    console.log('所有用户:', allUsersResult.rows);
    
    // 使用二级索引查询
    const emailResult = await client.execute(getUsersByEmailQuery, [email], { prepare: true });
    console.log('按邮箱查询结果:', emailResult.rows);
    
    // 查询产品类别
    const productsResult = await client.execute(getProductsByCategoryQuery, [category], { prepare: true });
    console.log('电子产品列表:', productsResult.rows);
    
    // 查询用户订单
    const ordersResult = await client.execute(getUserOrdersQuery, [userId], { prepare: true });
    console.log('用户订单:', ordersResult.rows);
  } catch (error) {
    console.error('查询数据失败:', error);
  }
}
```

### 4.3 更新数据 (UPDATE)

```javascript
async function updateData() {
  // 更新用户信息
  const updateUserQuery = `
    UPDATE users 
    SET last_login = ?, profile['last_name'] = ?
    WHERE user_id = ?;
  `;
  
  const userId = '123e4567-e89b-12d3-a456-426614174000'; // 替换为实际的用户ID
  const updateUserParams = [
    new Date(),
    'Smith', // 更新姓氏
    userId
  ];
  
  // 更新产品库存
  const updateInventoryQuery = `
    UPDATE products
    SET inventory = inventory - ?
    WHERE category = ? AND product_id = ?
    IF inventory >= ?;
  `;
  
  const productId = '123e4567-e89b-12d3-a456-426614174001'; // 替换为实际的产品ID
  const quantityToReduce = 5;
  const updateInventoryParams = [
    quantityToReduce,
    'electronics',
    productId,
    quantityToReduce // 检查库存是否足够
  ];
  
  // 更新订单状态
  const updateOrderStatusQuery = `
    UPDATE orders
    SET status = ?
    WHERE user_id = ? AND order_date = ? AND order_id = ?;
  `;
  
  const orderId = '123e4567-e89b-12d3-a456-426614174002'; // 替换为实际的订单ID
  const orderDate = new Date('2023-01-01T10:00:00.000Z'); // 替换为实际的订单日期
  const updateOrderParams = [
    'shipped',
    userId,
    orderDate,
    orderId
  ];
  
  try {
    const userUpdateResult = await client.execute(updateUserQuery, updateUserParams, { prepare: true });
    console.log('用户更新成功:', userUpdateResult);
    
    const inventoryUpdateResult = await client.execute(updateInventoryQuery, updateInventoryParams, { prepare: true });
    if (inventoryUpdateResult.rows[0]['[applied]']) {
      console.log('库存更新成功');
    } else {
      console.log('库存不足，更新失败');
    }
    
    const orderUpdateResult = await client.execute(updateOrderStatusQuery, updateOrderParams, { prepare: true });
    console.log('订单状态更新成功:', orderUpdateResult);
  } catch (error) {
    console.error('更新数据失败:', error);
  }
}
```

### 4.4 删除数据 (DELETE)

```javascript
async function deleteData() {
  // 删除用户
  const deleteUserQuery = 'DELETE FROM users WHERE user_id = ?';
  const userId = '123e4567-e89b-12d3-a456-426614174000'; // 替换为实际的用户ID
  
  // 删除特定字段
  const deleteUserFieldQuery = 'DELETE profile FROM users WHERE user_id = ?';
  
  // 删除产品
  const deleteProductQuery = 'DELETE FROM products WHERE category = ? AND product_id = ?';
  const productId = '123e4567-e89b-12d3-a456-426614174001'; // 替换为实际的产品ID
  const productParams = ['electronics', productId];
  
  // 删除订单
  const deleteOrderQuery = 'DELETE FROM orders WHERE user_id = ? AND order_date = ? AND order_id = ?';
  const orderId = '123e4567-e89b-12d3-a456-426614174002'; // 替换为实际的订单ID
  const orderDate = new Date('2023-01-01T10:00:00.000Z'); // 替换为实际的订单日期
  const orderParams = [userId, orderDate, orderId];
  
  try {
    // 只删除特定字段
    await client.execute(deleteUserFieldQuery, [userId], { prepare: true });
    console.log('用户配置文件已删除');
    
    // 删除产品
    await client.execute(deleteProductQuery, productParams, { prepare: true });
    console.log('产品已删除');
    
    // 删除订单
    await client.execute(deleteOrderQuery, orderParams, { prepare: true });
    console.log('订单已删除');
    
    // 删除整个用户
    // await client.execute(deleteUserQuery, [userId], { prepare: true });
    // console.log('用户已删除');
  } catch (error) {
    console.error('删除数据失败:', error);
  }
}
```

## 5. 高级功能

### 5.1 批处理 (Batch)

```javascript
async function batchOperations() {
  const { v4: uuidv4 } = require('uuid');
  
  // 准备批处理语句
  const queries = [
    {
      query: 'INSERT INTO users (user_id, username, email, created_at) VALUES (?, ?, ?, ?)',
      params: [uuidv4(), 'janedoe', 'jane.doe@example.com', new Date()]
    },
    {
      query: 'INSERT INTO users (user_id, username, email, created_at) VALUES (?, ?, ?, ?)',
      params: [uuidv4(), 'bobsmith', 'bob.smith@example.com', new Date()]
    },
    {
      query: 'UPDATE products SET inventory = inventory + ? WHERE category = ? AND product_id = ?',
      params: [10, 'electronics', '123e4567-e89b-12d3-a456-426614174001']
    }
  ];
  
  try {
    // 执行未记录的批处理（默认）
    await client.batch(queries, { prepare: true });
    console.log('批处理执行成功');
    
    // 执行已记录的批处理（用于关键操作）
    // 注意：已记录的批处理会写入提交日志，适合需要原子性的跨分区操作
    const loggedQueries = [
      {
        query: 'INSERT INTO users (user_id, username, email, created_at) VALUES (?, ?, ?, ?)',
        params: [uuidv4(), 'alicejones', 'alice.jones@example.com', new Date()]
      }
    ];
    
    await client.batch(loggedQueries, { prepare: true, logged: true });
    console.log('已记录的批处理执行成功');
  } catch (error) {
    console.error('批处理执行失败:', error);
  }
}
```

### 5.2 分页查询

```javascript
async function paginatedQuery() {
  const pageSize = 5;
  let pageState = null;
  let allResults = [];
  
  try {
    // 分页查询循环
    do {
      const result = await client.execute(
        'SELECT * FROM users',
        [],
        {
          prepare: true,
          fetchSize: pageSize,
          pageState: pageState
        }
      );
      
      // 处理当前页结果
      const pageResults = result.rows;
      console.log(`获取到 ${pageResults.length} 条结果`);
      allResults = [...allResults, ...pageResults];
      
      // 更新分页状态
      pageState = result.pageState;
    } while (pageState !== null);
    
    console.log(`总结果数: ${allResults.length}`);
  } catch (error) {
    console.error('分页查询失败:', error);
  }
}
```

### 5.3 自定义类型 (User-Defined Types)

```javascript
async function userDefinedTypes() {
  // 创建自定义类型
  const createAddressTypeQuery = `
    CREATE TYPE IF NOT EXISTS address (
      street text,
      city text,
      state text,
      zip_code text,
      country text
    );
  `;
  
  // 更新用户表以使用自定义类型
  const alterUserTableQuery = `
    ALTER TABLE users
    ADD shipping_address frozen<address>,
    ADD billing_address frozen<address>;
  `;
  
  // 插入使用自定义类型的数据
  const updateUserWithAddressQuery = `
    UPDATE users
    SET shipping_address = ?
    WHERE user_id = ?;
  `;
  
  try {
    await client.execute(createAddressTypeQuery);
    console.log('地址自定义类型创建成功');
    
    await client.execute(alterUserTableQuery);
    console.log('用户表已更新，添加了地址字段');
    
    // 创建地址对象
    const address = {
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zip_code: '94105',
      country: 'USA'
    };
    
    const userId = '123e4567-e89b-12d3-a456-426614174000'; // 替换为实际的用户ID
    await client.execute(updateUserWithAddressQuery, [address, userId], { prepare: true });
    console.log('用户地址更新成功');
  } catch (error) {
    console.error('自定义类型操作失败:', error);
  }
}
```

### 5.4 异步查询和流处理

```javascript
async function streamQueries() {
  // 使用流处理大量数据
  const query = 'SELECT * FROM products';
  const options = { prepare: true, fetchSize: 500 };
  
  // 创建流对象
  const stream = client.stream(query, [], options);
  
  let count = 0;
  
  // 处理每一行数据
  stream.on('readable', () => {
    let row;
    while ((row = stream.read()) !== null) {
      // 处理每一行数据
      console.log(`处理产品: ${row.name}`);
      count++;
      
      // 可以添加处理逻辑，例如数据转换、聚合等
    }
  });
  
  // 处理结束事件
  stream.on('end', () => {
    console.log(`流处理完成，共处理 ${count} 条记录`);
  });
  
  // 处理错误事件
  stream.on('error', (err) => {
    console.error('流处理错误:', err);
  });
  
  // 处理超时事件
  stream.on('timeout', () => {
    console.error('流处理超时');
    stream.end(); // 关闭流
  });
}
```

## 6. 性能优化

### 6.1 查询优化

```javascript
// 查询优化最佳实践示例
async function queryOptimization() {
  // 1. 始终使用预准备语句
  const preparedQuery = 'SELECT * FROM users WHERE user_id = ?';
  const result = await client.execute(preparedQuery, [userId], { prepare: true });
  
  // 2. 选择需要的列而不是使用 SELECT *
  const optimizedQuery = 'SELECT user_id, username, email FROM users WHERE user_id = ?';
  
  // 3. 调整 fetchSize 以优化大型结果集的性能
  const largeResultQuery = {
    query: 'SELECT * FROM products',
    options: { prepare: true, fetchSize: 1000 }
  };
  
  // 4. 使用适当的一致性级别
  // 读操作可以使用较低的一致性级别提高性能
  const lowConsistencyQuery = {
    query: 'SELECT * FROM products WHERE category = ?',
    params: ['electronics'],
    options: {
      prepare: true,
      consistency: cassandra.types.consistencies.one // 仅需要一个节点响应
    }
  };
  
  // 5. 避免全表扫描和范围查询（除非必要）
  // 全表扫描: SELECT * FROM users; // 避免这种操作
  
  // 6. 利用分区键和聚类键进行高效查询
  // 查询设计应该基于表的主键结构
}
```

### 6.2 连接池优化

```javascript
function optimizedConnectionPool() {
  const client = new cassandra.Client({
    contactPoints: ['127.0.0.1:9042', '127.0.0.1:9043', '127.0.0.1:9044'],
    localDataCenter: 'datacenter1',
    
    // 优化连接池配置
    pooling: {
      // 针对本地和远程节点的连接池大小
      coreConnectionsPerHost: {
        [cassandra.types.distance.local]: 8,   // 增加本地节点连接数
        [cassandra.types.distance.remote]: 2   // 减少远程节点连接数
      },
      maxRequestsPerConnection: 1024,          // 每个连接的最大请求数
      newConnectionThreshold: 800              // 创建新连接的阈值
    },
    
    // 套接字选项
    socketOptions: {
      connectTimeout: 10000,                   // 连接超时（毫秒）
      readTimeout: 30000,                      // 读取超时（毫秒）
      keepAlive: true                          // 保持连接活跃
    },
    
    // 重试策略
    policies: {
      retry: new cassandra.policies.retry.RetryPolicy({
        // 配置不同错误类型的重试策略
        readTimeout: 3,                        // 读超时重试次数
        writeTimeout: 3,                       // 写超时重试次数
        unavailable: 3                         // 不可用错误重试次数
      })
    }
  });
  
  return client;
}
```

### 6.3 数据建模优化

```javascript
// 数据建模最佳实践示例
// 注意：这只是示例代码注释，实际实现需要根据业务需求设计

/*

// 1. 根据查询模式设计表，而非规范化设计

// 反例：过度规范化
CREATE TABLE users (
  user_id uuid PRIMARY KEY,
  username text,
  email text
);

CREATE TABLE user_profiles (
  user_id uuid PRIMARY KEY,
  bio text,
  avatar_url text
);

// 正例：针对查询模式设计表
CREATE TABLE users_by_username (
  username text PRIMARY KEY,
  user_id uuid,
  email text,
  bio text,
  avatar_url text
);

CREATE TABLE users_by_email (
  email text PRIMARY KEY,
  user_id uuid,
  username text,
  bio text,
  avatar_url text
);

// 2. 适当的数据类型选择
// 使用 text 而非 varchar
// 使用 timestamp 存储日期
// 使用 uuid 作为唯一标识符

// 3. 复合主键设计
// 分区键决定数据分布在哪个节点
// 聚类键决定分区内的数据排序
CREATE TABLE user_orders (
  user_id uuid,
  order_date timestamp,
  order_id uuid,
  total decimal,
  status text,
  PRIMARY KEY ((user_id), order_date, order_id)
) WITH CLUSTERING ORDER BY (order_date DESC);

// 4. 避免宽行设计
// 限制每行的数据量和列数

*/
```

## 7. 监控和故障排查

### 7.1 监控查询

```javascript
async function monitoringQueries() {
  // 获取集群状态
  const clusterStatusQuery = `
    SELECT peer, data_center, rack, tokens, status FROM system.peers
    UNION
    SELECT '127.0.0.1' as peer, data_center, rack, tokens, 'up' as status FROM system.local;
  `;
  
  // 获取表统计信息
  const tableStatsQuery = `
    SELECT keyspace_name, table_name, count FROM system.size_estimates
    WHERE keyspace_name = 'mykeyspace';
  `;
  
  // 获取慢查询日志
  const slowQueriesQuery = `
    SELECT * FROM system_traces.sessions
    WHERE duration > 10000
    ORDER BY start_time DESC
    LIMIT 10;
  `;
  
  try {
    // 集群状态
    const clusterResult = await client.execute(clusterStatusQuery);
    console.log('集群节点状态:', clusterResult.rows);
    
    // 表统计信息
    const statsResult = await client.execute(tableStatsQuery);
    console.log('表大小估计:', statsResult.rows);
    
    // 慢查询
    try {
      const slowResult = await client.execute(slowQueriesQuery);
      console.log('慢查询日志:', slowResult.rows);
    } catch (e) {
      console.log('无法获取慢查询日志（需要启用追踪）:', e.message);
    }
  } catch (error) {
    console.error('执行监控查询失败:', error);
  }
}
```

### 7.2 错误处理

```javascript
// 统一错误处理示例
async function errorHandlingExample() {
  try {
    const result = await client.execute('SELECT * FROM non_existent_table');
  } catch (error) {
    // 根据错误类型处理
    if (error.name === 'ResponseError') {
      if (error.code === 8704) { // 未准备好语句
        console.error('查询错误：未准备好的语句');
      } else if (error.code === 2200) { // 无效查询
        console.error('查询错误：无效的查询语法或表不存在');
      } else if (error.code === 2300) { // 不可用异常
        console.error('查询错误：节点或数据中心不可用');
      } else {
        console.error('查询错误：', error.message, error.code);
      }
    } else if (error.name === 'OperationTimedOutError') {
      console.error('操作超时，请检查网络连接或集群负载');
    } else if (error.name === 'NoHostAvailableError') {
      console.error('没有可用的主机，请检查集群状态');
    } else {
      console.error('未分类的错误：', error);
    }
    
    // 实现重试逻辑
    // 记录错误日志
    // 触发告警等
  }
}

// 重试工具函数
async function executeWithRetry(query, params, options = {}, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await client.execute(query, params, options);
    } catch (error) {
      lastError = error;
      
      // 只对特定错误进行重试
      if (error.name === 'OperationTimedOutError' || 
          error.name === 'NoHostAvailableError' ||
          (error.name === 'ResponseError' && error.code === 2300)) {
        console.log(`查询失败，${attempt + 1}/${maxRetries}次重试，错误: ${error.message}`);
        // 指数退避策略
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      } else {
        // 其他错误不再重试
        break;
      }
    }
  }
  
  throw lastError;
}
```

### 7.3 性能分析

```javascript
// 启用查询跟踪并分析性能
async function traceQuery() {
  // 启用查询跟踪
  await client.execute('TRACE ON');
  
  try {
    // 执行要跟踪的查询
    await client.execute('SELECT * FROM users LIMIT 10', [], { prepare: true });
    
    // 获取最近的跟踪会话
    const sessionQuery = `
      SELECT session_id FROM system_traces.sessions
      ORDER BY start_time DESC LIMIT 1
    `;
    
    const sessionResult = await client.execute(sessionQuery);
    const sessionId = sessionResult.rows[0].session_id;
    
    // 获取跟踪事件
    const eventsQuery = `
      SELECT event_id, activity, source, source_elapsed, client
      FROM system_traces.events
      WHERE session_id = ?
      ORDER BY event_id
    `;
    
    const eventsResult = await client.execute(eventsQuery, [sessionId], { prepare: true });
    
    console.log('查询跟踪事件:');
    eventsResult.rows.forEach(event => {
      console.log(`${event.activity} (${event.source_elapsed}μs)`);
    });
    
  } finally {
    // 关闭查询跟踪
    await client.execute('TRACE OFF');
  }
}
```

## 8. 安全最佳实践

### 8.1 认证和授权

```javascript
// 安全连接配置示例
function secureConnection() {
  const client = new cassandra.Client({
    contactPoints: ['cassandra-server1:9042', 'cassandra-server2:9042'],
    localDataCenter: 'datacenter1',
    
    // 认证信息
    credentials: {
      username: process.env.CASSANDRA_USER,
      password: process.env.CASSANDRA_PASSWORD
    },
    
    // SSL/TLS 配置
    sslOptions: {
      ca: [fs.readFileSync('/path/to/ca-cert.pem')],
      cert: fs.readFileSync('/path/to/client-cert.pem'),
      key: fs.readFileSync('/path/to/client-key.pem')
    }
  });
  
  return client;
}

// 使用环境变量存储敏感信息
function loadCredentials() {
  if (!process.env.CASSANDRA_USER || !process.env.CASSANDRA_PASSWORD) {
    throw new Error('缺少 Cassandra 认证信息');
  }
  
  return {
    username: process.env.CASSANDRA_USER,
    password: process.env.CASSANDRA_PASSWORD
  };
}
```

### 8.2 数据加密

```javascript
// 客户端数据加密示例
const crypto = require('crypto');

class DataEncryptor {
  constructor(secretKey, algorithm = 'aes-256-cbc') {
    this.secretKey = Buffer.from(secretKey, 'hex');
    this.algorithm = algorithm;
    this.ivLength = 16; // AES-256-CBC 的 IV 长度
  }
  
  encrypt(text) {
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipheriv(this.algorithm, this.secretKey, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }
  
  decrypt(text) {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(this.algorithm, this.secretKey, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
}

// 使用加密存储敏感数据
async function secureDataStorage() {
  // 从环境变量获取密钥
  const secretKey = process.env.ENCRYPTION_KEY;
  if (!secretKey || secretKey.length !== 64) { // AES-256 需要 64 字符的十六进制密钥
    throw new Error('无效的加密密钥');
  }
  
  const encryptor = new DataEncryptor(secretKey);
  
  // 加密敏感数据
  const sensitiveData = {
    creditCard: '4111-1111-1111-1111',
    cvv: '123'
  };
  
  const encryptedData = encryptor.encrypt(JSON.stringify(sensitiveData));
  
  // 存储加密后的数据
  const insertQuery = `
    UPDATE users
    SET payment_info = ?
    WHERE user_id = ?;
  `;
  
  const userId = '123e4567-e89b-12d3-a456-426614174000'; // 替换为实际的用户ID
  
  try {
    await client.execute(insertQuery, [encryptedData, userId], { prepare: true });
    console.log('敏感数据已加密并存储');
    
    // 读取并解密数据
    const selectQuery = 'SELECT payment_info FROM users WHERE user_id = ?';
    const result = await client.execute(selectQuery, [userId], { prepare: true });
    
    if (result.rows.length > 0 && result.rows[0].payment_info) {
      const storedEncryptedData = result.rows[0].payment_info;
      const decryptedData = JSON.parse(encryptor.decrypt(storedEncryptedData));
      console.log('解密后的数据:', decryptedData);
    }
  } catch (error) {
    console.error('加密数据操作失败:', error);
  }
}
```

## 9. 常见问题与解决方案

### 9.1 连接问题

**问题**：连接超时或无法连接到 Cassandra 集群

**解决方案**：

```javascript
function troubleshootConnection() {
  const client = new cassandra.Client({
    contactPoints: ['127.0.0.1:9042'],
    localDataCenter: 'datacenter1',
    socketOptions: {
      connectTimeout: 15000, // 增加连接超时时间
      readTimeout: 30000    // 增加读取超时时间
    },
    policies: {
      reconnection: new cassandra.policies.reconnection.ExponentialReconnectionPolicy(1000, 60000),
      retry: new cassandra.policies.retry.RetryPolicy({
        readTimeout: 3,
        writeTimeout: 3
      })
    }
  });
  
  // 详细的连接事件处理
  client.on('connection', (err) => {
    if (err) {
      console.error('连接错误:', err);
    } else {
      console.log('建立了新连接');
    }
  });
  
  client.on('log', (level, className, message, furtherInfo) => {
    // 记录详细日志用于调试
    console.log(`${level} - ${className}: ${message}`);
    if (furtherInfo) {
      console.log(furtherInfo);
    }
  });
  
  // 检查连接参数
  console.log('Contact Points:', client.options.contactPoints);
  console.log('Local Data Center:', client.options.localDataCenter);
  
  return client;
}

// 测试连接的辅助函数
async function testConnection() {
  try {
    await client.connect();
    console.log('连接测试成功');
    
    // 获取集群信息
    const hostCount = client.hosts.values().length;
    console.log(`发现 ${hostCount} 个 Cassandra 节点`);
    
    return true;
  } catch (error) {
    console.error('连接测试失败:', error);
    
    // 检查常见错误
    if (error.name === 'NoHostAvailableError') {
      console.error('检查：\n1. Cassandra 服务是否运行\n2. 防火墙是否允许 9042 端口\n3. contactPoints 是否正确\n4. 数据中心名称是否正确');
    }
    
    return false;
  }
}
```

### 9.2 查询性能问题

**问题**：查询速度慢或超时

**解决方案**：

```javascript
async function optimizeSlowQueries() {
  // 1. 检查并优化数据模型
  console.log('检查数据模型是否适合查询模式');
  
  // 2. 使用 EXPLAIN 分析查询执行计划
  const explainQuery = 'EXPLAIN SELECT * FROM users WHERE email = ?';
  const explainResult = await client.execute(explainQuery, ['john.doe@example.com']);
  console.log('查询执行计划:', explainResult.rows);
  
  // 3. 检查二级索引使用情况
  console.log('避免在高基数列上使用二级索引');
  
  // 4. 优化批量大小
  const batchSize = 100; // 根据实际情况调整
  console.log(`优化的批量大小: ${batchSize}`);
  
  // 5. 增加 fetchSize 处理大结果集
  const fetchSize = 1000; // 增加取数大小
  
  // 6. 监控慢查询
  console.log('启用慢查询日志监控');
  
  // 7. 调整一致性级别
  const consistencyLevel = cassandra.types.consistencies.localOne;
  console.log(`使用较低的一致性级别: ${consistencyLevel}`);
}
```

### 9.3 内存管理问题

**问题**：Node.js 应用内存使用过高或内存泄漏

**解决方案**：

```javascript
// 内存管理最佳实践
function memoryManagementBestPractices() {
  // 1. 使用流处理大数据集
  function processLargeDataset() {
    const stream = client.stream('SELECT * FROM large_table', [], {
      prepare: true,
      fetchSize: 1000
    });
    
    let count = 0;
    
    stream.on('readable', () => {
      let row;
      while ((row = stream.read()) !== null) {
        // 处理单行数据后释放引用
        processRow(row);
        count++;
        
        // 定期触发垃圾回收
        if (count % 10000 === 0) {
          console.log(`已处理 ${count} 行`);
          // 注意：在生产环境中不要手动调用垃圾回收
          // global.gc(); // 需要 --expose-gc 标志运行 Node.js
        }
      }
    });
    
    stream.on('end', () => {
      console.log(`处理完成，共 ${count} 行`);
    });
  }
  
  // 2. 限制并发查询数量
  const { RateLimiter } = require('limiter');
  const queryLimiter = new RateLimiter({ tokensPerInterval: 100, interval: 'second' });
  
  async function executeRateLimitedQuery(query, params, options) {
    await queryLimiter.removeTokens(1);
    return client.execute(query, params, options);
  }
  
  // 3. 正确关闭不再使用的连接
  async function cleanupResources() {
    // 在应用关闭时
    process.on('SIGINT', async () => {
      console.log('正在关闭 Cassandra 连接...');
      await client.shutdown();
      console.log('连接已关闭，应用退出');
      process.exit(0);
    });
  }
  
  return {
    processLargeDataset,
    executeRateLimitedQuery,
    cleanupResources
  };
}
```

## 10. 参考资源

- [Cassandra 官方文档](https://cassandra.apache.org/doc/latest/)
- [Node.js Cassandra Driver 文档](https://docs.datastax.com/en/developer/nodejs-driver/latest/)
- [DataStax Node.js 驱动 GitHub](https://github.com/datastax/nodejs-driver)
- [Cassandra 数据建模最佳实践](https://cassandra.apache.org/doc/latest/cassandra/data_modeling/data_modeling_rules.html)
- [Cassandra 查询语言参考](https://cassandra.apache.org/doc/latest/cql/)
- [Cassandra 性能调优指南](https://cassandra.apache.org/doc/latest/cassandra/operations/performance.html)
- [Cassandra 安全配置指南](https://cassandra.apache.org/doc/latest/cassandra/operating/security.html)
- [Cassandra 监控最佳实践](https://cassandra.apache.org/doc/latest/cassandra/operating/metrics.html)