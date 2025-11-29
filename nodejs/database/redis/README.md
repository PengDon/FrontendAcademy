# Redis 与 Node.js 集成

## 1. Redis 基础概念

Redis（Remote Dictionary Server）是一个开源的内存数据结构存储系统，可用作数据库、缓存和消息中间件。Redis 支持多种数据结构，如字符串（strings）、哈希（hashes）、列表（lists）、集合（sets）、有序集合（sorted sets）等，并且提供了丰富的原子操作。

### 1.1 Redis 的主要特性

- **内存数据库**：数据存储在内存中，访问速度极快（亚毫秒级）
- **持久化**：支持 RDB 和 AOF 两种持久化方式
- **多种数据结构**：支持字符串、哈希、列表、集合、有序集合等
- **原子操作**：所有操作都是原子的，保证数据一致性
- **发布/订阅**：支持消息传递模式
- **Lua 脚本**：支持在服务器端执行 Lua 脚本
- **事务**：支持简单的事务操作
- **集群**：支持高可用和横向扩展

### 1.2 Redis 的应用场景

- **缓存**：热点数据缓存，减轻数据库压力
- **会话存储**：管理用户会话信息
- **实时排行榜**：利用有序集合实现实时排名
- **计数器**：页面访问统计、点赞数量等
- **消息队列**：使用列表作为简单的消息队列
- **分布式锁**：实现分布式系统中的锁机制
- **地理位置服务**：使用 GEO 数据类型存储地理位置信息

## 2. Node.js 中使用 Redis

### 2.1 安装依赖

```bash
# 基本的 Redis 客户端
npm install redis

# 或者使用 ioredis（更现代的 Redis 客户端）
npm install ioredis
```

### 2.2 使用 redis 包（v4+ Promise 风格）

```javascript
const redis = require('redis');

async function connectRedis() {
  // 创建 Redis 客户端
  const client = redis.createClient({
    url: 'redis://localhost:6379',
    // 可选配置
    socket: {
      reconnectStrategy: (retries) => {
        // 自定义重连策略
        return Math.min(retries * 100, 3000);
      },
      connectTimeout: 5000
    },
    // 密码认证
    password: process.env.REDIS_PASSWORD,
    // 选择数据库
    database: 0
  });

  // 监听连接事件
  client.on('connect', () => {
    console.log('Redis 连接中...');
  });

  client.on('ready', () => {
    console.log('Redis 已准备好');
  });

  client.on('error', (err) => {
    console.error('Redis 错误:', err);
  });

  client.on('end', () => {
    console.log('Redis 连接已关闭');
  });

  // 连接到 Redis
  await client.connect();
  
  return client;
}

async function redisExample() {
  const client = await connectRedis();

  try {
    // 字符串操作
    await client.set('name', 'Redis');
    const name = await client.get('name');
    console.log('获取字符串值:', name);

    // 设置带过期时间的键
    await client.set('temp_key', '临时值', { EX: 10 }); // 10秒后过期

    // 删除键
    await client.del('temp_key');
    
  } catch (error) {
    console.error('Redis 操作失败:', error);
  } finally {
    // 关闭连接
    await client.quit();
  }
}

redisExample().catch(console.error);
```

### 2.3 使用 ioredis 包

```javascript
const Redis = require('ioredis');

async function connectIORedis() {
  // 创建 Redis 客户端
  const redis = new Redis({
    port: 6379, // Redis 端口
    host: 'localhost', // Redis 主机
    family: 4, // IPv4 or IPv6
    password: process.env.REDIS_PASSWORD,
    db: 0,
    // 连接超时设置
    connectTimeout: 5000,
    // 重连策略
    retryStrategy: (times) => {
      // 最大重试次数
      if (times > 5) {
        return null;
      }
      // 指数退避
      return Math.min(times * 1000, 5000);
    }
  });

  // 事件监听
  redis.on('connect', () => {
    console.log('ioredis 连接成功');
  });

  redis.on('error', (err) => {
    console.error('ioredis 错误:', err);
  });

  redis.on('close', () => {
    console.log('ioredis 连接已关闭');
  });

  redis.on('reconnecting', (info) => {
    console.log('ioredis 正在重连:', info);
  });

  return redis;
}

async function ioredisExample() {
  const redis = await connectIORedis();

  try {
    // 基本操作
    await redis.set('greeting', 'Hello Redis');
    const greeting = await redis.get('greeting');
    console.log('ioredis 获取值:', greeting);

    // 批量操作
    const result = await redis.multi()
      .set('key1', 'value1')
      .set('key2', 'value2')
      .get('key1')
      .del('key2')
      .exec();
    
    console.log('批量操作结果:', result);
    
  } catch (error) {
    console.error('ioredis 操作失败:', error);
  } finally {
    // 关闭连接
    await redis.quit();
  }
}

ioredisExample().catch(console.error);
```

## 3. Redis 数据结构操作

### 3.1 字符串（Strings）

```javascript
async function stringOperations(redis) {
  // 设置字符串
  await redis.set('name', 'Redis');
  
  // 获取字符串
  const name = await redis.get('name');
  console.log('名称:', name);
  
  // 设置带过期时间的字符串
  await redis.set('temp', '临时数据', 'EX', 10); // 10秒过期
  await redis.set('temp2', '临时数据', 'PX', 5000); // 5毫秒过期
  
  // 如果不存在才设置
  const result = await redis.set('name', 'New Redis', 'NX');
  console.log('如果不存在才设置:', result); // 返回 null，因为 name 已存在
  
  // 如果存在才设置
  const result2 = await redis.set('name', 'Updated Redis', 'XX');
  console.log('如果存在才设置:', result2); // 设置成功
  
  // 增加数字
  await redis.set('counter', 5);
  const incremented = await redis.incr('counter');
  console.log('递增后的值:', incremented); // 6
  
  // 增加指定值
  const added = await redis.incrby('counter', 10);
  console.log('增加10后的值:', added); // 16
  
  // 减少数字
  const decremented = await redis.decr('counter');
  console.log('递减后的值:', decremented); // 15
  
  // 获取多个值
  const values = await redis.mget('name', 'counter');
  console.log('多个值:', values);
}
```

### 3.2 哈希（Hashes）

```javascript
async function hashOperations(redis) {
  // 设置哈希字段
  await redis.hset('user:1', {
    'name': '张三',
    'email': 'zhangsan@example.com',
    'age': 25
  });
  
  // 获取单个字段
  const name = await redis.hget('user:1', 'name');
  console.log('用户名:', name);
  
  // 获取所有字段和值
  const user = await redis.hgetall('user:1');
  console.log('用户信息:', user);
  
  // 获取所有字段名
  const fields = await redis.hkeys('user:1');
  console.log('所有字段名:', fields);
  
  // 获取所有值
  const values = await redis.hvals('user:1');
  console.log('所有值:', values);
  
  // 检查字段是否存在
  const exists = await redis.hexists('user:1', 'name');
  console.log('name 字段存在:', exists); // 1 表示存在，0 表示不存在
  
  // 增加字段数值
  await redis.hincrby('user:1', 'age', 1);
  const updatedAge = await redis.hget('user:1', 'age');
  console.log('更新后的年龄:', updatedAge); // 26
  
  // 删除字段
  await redis.hdel('user:1', 'email');
  const hasEmail = await redis.hexists('user:1', 'email');
  console.log('email 字段存在:', hasEmail); // 0 表示不存在
}
```

### 3.3 列表（Lists）

```javascript
async function listOperations(redis) {
  // 从左侧推入元素
  await redis.lpush('tasks', 'task1', 'task2', 'task3');
  
  // 从右侧推入元素
  await redis.rpush('tasks', 'task4', 'task5');
  
  // 获取列表长度
  const length = await redis.llen('tasks');
  console.log('任务列表长度:', length);
  
  // 获取列表元素
  const allTasks = await redis.lrange('tasks', 0, -1);
  console.log('所有任务:', allTasks);
  
  // 获取单个元素
  const firstTask = await redis.lindex('tasks', 0);
  console.log('第一个任务:', firstTask);
  
  // 从左侧弹出元素
  const leftPop = await redis.lpop('tasks');
  console.log('左侧弹出:', leftPop);
  
  // 从右侧弹出元素
  const rightPop = await redis.rpop('tasks');
  console.log('右侧弹出:', rightPop);
  
  // 修改指定索引的元素
  await redis.lset('tasks', 1, 'updated-task');
  
  // 移除指定值的元素
  await redis.lpush('numbers', 1, 2, 3, 2, 1);
  await redis.lrem('numbers', 1, '2'); // 移除一个值为 2 的元素
  
  // 阻塞弹出（用于消息队列）
  // const task = await redis.brpop('tasks', 5); // 最多阻塞 5 秒
}
```

### 3.4 集合（Sets）

```javascript
async function setOperations(redis) {
  // 添加元素到集合
  await redis.sadd('users', 'user1', 'user2', 'user3');
  
  // 检查元素是否存在
  const exists = await redis.sismember('users', 'user1');
  console.log('user1 存在:', exists); // 1 表示存在，0 表示不存在
  
  // 获取集合中的所有元素
  const allUsers = await redis.smembers('users');
  console.log('所有用户:', allUsers);
  
  // 获取集合的大小
  const size = await redis.scard('users');
  console.log('用户数量:', size);
  
  // 从集合中移除元素
  await redis.srem('users', 'user2');
  
  // 随机获取元素
  const randomUser = await redis.srandmember('users');
  console.log('随机用户:', randomUser);
  
  // 随机移除并返回元素
  const poppedUser = await redis.spop('users');
  console.log('弹出的用户:', poppedUser);
  
  // 集合操作
  await redis.sadd('set1', 'a', 'b', 'c');
  await redis.sadd('set2', 'b', 'c', 'd');
  
  // 交集
  const intersection = await redis.sinter('set1', 'set2');
  console.log('交集:', intersection); // ['b', 'c']
  
  // 并集
  const union = await redis.sunion('set1', 'set2');
  console.log('并集:', union); // ['a', 'b', 'c', 'd']
  
  // 差集
  const difference = await redis.sdiff('set1', 'set2');
  console.log('差集:', difference); // ['a']
}
```

### 3.5 有序集合（Sorted Sets）

```javascript
async function sortedSetOperations(redis) {
  // 添加元素到有序集合
  await redis.zadd('scores', { score: 95, value: 'user1' });
  await redis.zadd('scores', { score: 87, value: 'user2' });
  await redis.zadd('scores', { score: 92, value: 'user3' });
  
  // 获取有序集合的大小
  const size = await redis.zcard('scores');
  console.log('分数数量:', size);
  
  // 根据索引范围获取元素（升序）
  const ascScores = await redis.zrange('scores', 0, -1);
  console.log('分数排名（升序）:', ascScores);
  
  // 获取元素及其分数
  const withScores = await redis.zrange('scores', 0, -1, 'WITHSCORES');
  console.log('带分数的排名:', withScores);
  
  // 根据索引范围获取元素（降序）
  const descScores = await redis.zrevrange('scores', 0, -1);
  console.log('分数排名（降序）:', descScores);
  
  // 获取元素的分数
  const userScore = await redis.zscore('scores', 'user1');
  console.log('user1 的分数:', userScore);
  
  // 获取元素的排名（升序，从 0 开始）
  const rank = await redis.zrank('scores', 'user2');
  console.log('user2 的排名:', rank + 1); // +1 因为排名从 0 开始
  
  // 增加元素的分数
  await redis.zincrby('scores', 5, 'user2');
  const updatedScore = await redis.zscore('scores', 'user2');
  console.log('user2 更新后的分数:', updatedScore);
  
  // 根据分数范围获取元素
  const rangeByScore = await redis.zrangebyscore('scores', 90, 100);
  console.log('90-100分的用户:', rangeByScore);
  
  // 移除元素
  await redis.zrem('scores', 'user1');
}
```

## 4. Redis 高级功能

### 4.1 发布/订阅模式

```javascript
async function pubsubExample() {
  const { createClient } = require('redis');
  
  // 创建发布者客户端
  const publisher = createClient();
  await publisher.connect();
  
  // 创建订阅者客户端
  const subscriber = createClient();
  await subscriber.connect();
  
  // 订阅频道
  await subscriber.subscribe('notifications', (message) => {
    console.log('收到通知:', message);
  });
  
  // 发布消息
  await publisher.publish('notifications', JSON.stringify({
    type: 'new_user',
    data: { id: 1, name: '新用户' },
    timestamp: Date.now()
  }));
  
  // 等待消息被接收
  setTimeout(async () => {
    // 清理
    await subscriber.unsubscribe('notifications');
    await publisher.quit();
    await subscriber.quit();
  }, 1000);
}

// 使用 ioredis 的发布/订阅
async function ioredisPubsubExample() {
  const Redis = require('ioredis');
  
  const publisher = new Redis();
  const subscriber = new Redis();
  
  // 订阅频道
  subscriber.subscribe('chat', (err, count) => {
    if (err) {
      console.error('订阅失败:', err);
      return;
    }
    console.log(`已订阅 ${count} 个频道`);
  });
  
  // 监听消息
  subscriber.on('message', (channel, message) => {
    console.log(`频道 ${channel}: ${message}`);
  });
  
  // 发布消息
  await publisher.publish('chat', 'Hello Redis 发布/订阅!');
  
  // 清理
  setTimeout(() => {
    publisher.quit();
    subscriber.quit();
  }, 1000);
}
```

### 4.2 事务处理

```javascript
async function transactionExample(redis) {
  // 开始事务
  const transaction = redis.multi();
  
  // 添加事务操作
  transaction.set('key1', 'value1');
  transaction.set('key2', 'value2');
  transaction.get('key1');
  transaction.del('key2');
  
  // 执行事务
  const results = await transaction.exec();
  console.log('事务执行结果:', results);
}

// 乐观锁（使用 WATCH）
async function optimisticLockExample(redis) {
  // 模拟余额转账
  const sender = 'account:1';
  const receiver = 'account:2';
  const amount = 100;
  
  // 初始化账户
  await redis.set(sender, 1000);
  await redis.set(receiver, 500);
  
  // 开始事务
  try {
    // 监视发送者账户
    await redis.watch(sender);
    
    // 获取当前余额
    const senderBalance = parseInt(await redis.get(sender));
    
    // 检查余额是否足够
    if (senderBalance < amount) {
      console.log('余额不足');
      await redis.unwatch();
      return;
    }
    
    // 开始事务
    const transaction = redis.multi();
    
    // 减少发送者余额
    transaction.decrby(sender, amount);
    
    // 增加接收者余额
    transaction.incrby(receiver, amount);
    
    // 执行事务
    const results = await transaction.exec();
    
    if (results === null) {
      console.log('事务失败，数据已被修改');
    } else {
      console.log('转账成功');
      const newSenderBalance = await redis.get(sender);
      const newReceiverBalance = await redis.get(receiver);
      console.log(`发送者余额: ${newSenderBalance}, 接收者余额: ${newReceiverBalance}`);
    }
  } catch (error) {
    console.error('乐观锁错误:', error);
    await redis.unwatch();
  }
}
```

### 4.3 Lua 脚本

```javascript
async function luaScriptExample(redis) {
  // 定义 Lua 脚本：检查余额并转账
  const transferScript = `
    local sender = KEYS[1]
    local receiver = KEYS[2]
    local amount = tonumber(ARGV[1])
    
    local senderBalance = tonumber(redis.call('get', sender) or '0')
    
    if senderBalance < amount then
      return 0 -- 余额不足
    end
    
    redis.call('decrby', sender, amount)
    redis.call('incrby', receiver, amount)
    
    return 1 -- 转账成功
  `;
  
  // 初始化账户
  await redis.set('account:1001', 2000);
  await redis.set('account:1002', 1000);
  
  // 执行 Lua 脚本
  const result = await redis.eval(
    transferScript, 
    2, // 键的数量
    'account:1001', 'account:1002', // 键列表
    500 // 参数列表
  );
  
  if (result === 1) {
    console.log('转账成功');
    const balance1 = await redis.get('account:1001');
    const balance2 = await redis.get('account:1002');
    console.log(`账户1余额: ${balance1}, 账户2余额: ${balance2}`);
  } else {
    console.log('转账失败，余额不足');
  }
  
  // 使用脚本缓存
  const scriptSha = await redis.script('LOAD', transferScript);
  console.log('脚本 SHA:', scriptSha);
  
  // 使用 SHA 执行脚本
  const result2 = await redis.evalsha(
    scriptSha,
    2,
    'account:1001', 'account:1002',
    300
  );
  
  console.log('使用 SHA 执行结果:', result2);
}
```

### 4.4 持久化配置

```javascript
async function persistenceExample(redis) {
  // 检查当前持久化配置
  const rdbEnabled = await redis.config('GET', 'save');
  const aofEnabled = await redis.config('GET', 'appendonly');
  
  console.log('RDB 配置:', rdbEnabled);
  console.log('AOF 配置:', aofEnabled);
  
  // 手动触发 RDB 持久化
  await redis.save(); // 同步保存
  // 或使用异步保存
  // await redis.bgsave();
  
  console.log('RDB 持久化已触发');
  
  // 检查 RDB 保存状态
  const saveInfo = await redis.info('persistence');
  console.log('持久化信息:', saveInfo);
  
  // 注意：在实际应用中，持久化配置通常在 redis.conf 文件中设置，而不是通过命令动态修改
  // 动态修改配置可能在 Redis 重启后丢失
}
```

## 5. Redis 与 Node.js 的最佳实践

### 5.1 连接池管理

```javascript
const Redis = require('ioredis');

class RedisPool {
  constructor(options = {}, poolSize = 10) {
    this.options = options;
    this.poolSize = poolSize;
    this.pool = [];
    this.waitingQueue = [];
    this.isInitialized = false;
  }
  
  async initialize() {
    if (this.isInitialized) return;
    
    // 创建连接池
    for (let i = 0; i < this.poolSize; i++) {
      const client = new Redis(this.options);
      
      client.on('error', (err) => {
        console.error(`Redis 连接 ${i} 错误:`, err);
        // 从连接池中移除有错误的连接
        const index = this.pool.findIndex(c => c.client === client);
        if (index !== -1) {
          this.pool.splice(index, 1);
          // 创建新连接替换
          this._createNewConnection();
        }
      });
      
      this.pool.push({
        client,
        available: true
      });
    }
    
    this.isInitialized = true;
    console.log(`Redis 连接池初始化完成，大小: ${this.poolSize}`);
  }
  
  async _createNewConnection() {
    const client = new Redis(this.options);
    
    client.on('error', (err) => {
      console.error('Redis 新连接错误:', err);
    });
    
    this.pool.push({
      client,
      available: true
    });
    
    // 如果有等待的请求，立即分配
    if (this.waitingQueue.length > 0) {
      const resolve = this.waitingQueue.shift();
      this.pool[this.pool.length - 1].available = false;
      resolve(this.pool[this.pool.length - 1].client);
    }
  }
  
  async getConnection() {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    // 查找可用连接
    const connection = this.pool.find(conn => conn.available);
    
    if (connection) {
      connection.available = false;
      return connection.client;
    }
    
    // 如果没有可用连接，加入等待队列
    return new Promise((resolve) => {
      this.waitingQueue.push(resolve);
    });
  }
  
  releaseConnection(client) {
    const connection = this.pool.find(conn => conn.client === client);
    
    if (connection) {
      connection.available = true;
      
      // 如果有等待的请求，分配连接
      if (this.waitingQueue.length > 0) {
        const resolve = this.waitingQueue.shift();
        connection.available = false;
        resolve(connection.client);
      }
    }
  }
  
  async closeAll() {
    for (const conn of this.pool) {
      await conn.client.quit();
    }
    this.pool = [];
    this.waitingQueue = [];
    this.isInitialized = false;
    console.log('所有 Redis 连接已关闭');
  }
}

// 使用连接池
async function useRedisPool() {
  const pool = new RedisPool({
    host: 'localhost',
    port: 6379
  }, 5);
  
  await pool.initialize();
  
  // 模拟并发请求
  async function makeRequest(id) {
    const client = await pool.getConnection();
    try {
      await client.set(`key:${id}`, `value:${id}`);
      const value = await client.get(`key:${id}`);
      console.log(`请求 ${id} 获取值: ${value}`);
    } catch (error) {
      console.error(`请求 ${id} 错误:`, error);
    } finally {
      pool.releaseConnection(client);
    }
  }
  
  // 并发执行多个请求
  const promises = [];
  for (let i = 0; i < 20; i++) {
    promises.push(makeRequest(i));
  }
  
  await Promise.all(promises);
  console.log('所有请求完成');
  
  // 应用结束时关闭连接池
  process.on('SIGINT', () => {
    pool.closeAll();
    process.exit();
  });
}
```

### 5.2 缓存策略

```javascript
// 带过期时间的缓存封装
class RedisCache {
  constructor(redisClient, defaultTTL = 3600) {
    this.redis = redisClient;
    this.defaultTTL = defaultTTL; // 默认过期时间（秒）
  }
  
  // 设置缓存
  async set(key, value, ttl = this.defaultTTL) {
    try {
      const serializedValue = typeof value === 'object' ? JSON.stringify(value) : value;
      await this.redis.set(key, serializedValue, 'EX', ttl);
      return true;
    } catch (error) {
      console.error('设置缓存失败:', error);
      return false;
    }
  }
  
  // 获取缓存
  async get(key, parseJson = true) {
    try {
      const value = await this.redis.get(key);
      if (value === null) return null;
      
      return parseJson ? JSON.parse(value) : value;
    } catch (error) {
      console.error('获取缓存失败:', error);
      return null;
    }
  }
  
  // 删除缓存
  async delete(key) {
    try {
      await this.redis.del(key);
      return true;
    } catch (error) {
      console.error('删除缓存失败:', error);
      return false;
    }
  }
  
  // 缓存包装器 - 自动处理缓存逻辑
  async wrap(key, fetchFunction, options = {}) {
    const { ttl = this.defaultTTL, forceRefresh = false } = options;
    
    // 如果不强制刷新，尝试从缓存获取
    if (!forceRefresh) {
      const cached = await this.get(key);
      if (cached !== null) {
        console.log(`缓存命中: ${key}`);
        return cached;
      }
    }
    
    console.log(`缓存未命中或强制刷新: ${key}`);
    
    // 从数据源获取数据
    const data = await fetchFunction();
    
    // 保存到缓存
    await this.set(key, data, ttl);
    
    return data;
  }
  
  // 清除匹配模式的缓存
  async clearPattern(pattern) {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(keys);
        console.log(`已清除 ${keys.length} 个缓存键`);
      }
      return keys.length;
    } catch (error) {
      console.error('清除缓存失败:', error);
      return 0;
    }
  }
}

// 使用缓存封装
async function cacheExample() {
  const redis = new Redis();
  const cache = new RedisCache(redis, 60); // 默认 60 秒过期
  
  // 模拟从数据库获取数据
  async function fetchFromDatabase(userId) {
    console.log(`从数据库获取用户 ${userId} 的数据`);
    // 模拟数据库查询延迟
    await new Promise(resolve => setTimeout(resolve, 100));
    return {
      id: userId,
      name: `用户${userId}`,
      email: `user${userId}@example.com`,
      timestamp: new Date().toISOString()
    };
  }
  
  // 第一次调用 - 缓存未命中
  const user1 = await cache.wrap('user:1', () => fetchFromDatabase(1));
  console.log('第一次获取用户数据:', user1);
  
  // 再次调用 - 缓存命中
  const user1Cached = await cache.wrap('user:1', () => fetchFromDatabase(1));
  console.log('从缓存获取用户数据:', user1Cached);
  
  // 强制刷新
  const user1Refreshed = await cache.wrap('user:1', () => fetchFromDatabase(1), {
    forceRefresh: true
  });
  console.log('强制刷新后的数据:', user1Refreshed);
  
  // 清除特定缓存
  await cache.delete('user:1');
  
  // 清除匹配模式的缓存
  await cache.set('user:2', { id: 2, name: '用户2' });
  await cache.set('user:3', { id: 3, name: '用户3' });
  
  const clearedCount = await cache.clearPattern('user:*');
  console.log(`清除了 ${clearedCount} 个用户缓存`);
}
```

### 5.3 分布式锁

```javascript
class RedisLock {
  constructor(redisClient, defaultExpiry = 10000) {
    this.redis = redisClient;
    this.defaultExpiry = defaultExpiry; // 默认锁过期时间（毫秒）
    this.locks = new Map(); // 存储持有锁的标识符
  }
  
  // 获取锁
  async acquire(key, expiry = this.defaultExpiry, retryCount = 3, retryDelay = 100) {
    const lockKey = `lock:${key}`;
    const lockId = this._generateLockId();
    const expiryInSeconds = Math.ceil(expiry / 1000);
    
    for (let attempt = 0; attempt < retryCount; attempt++) {
      try {
        // 使用 SETNX 命令设置锁
        const result = await this.redis.set(lockKey, lockId, 'NX', 'EX', expiryInSeconds);
        
        if (result === 'OK') {
          // 获取锁成功，记录锁ID
          this.locks.set(lockKey, lockId);
          console.log(`成功获取锁: ${lockKey}`);
          return true;
        }
        
        // 未获取到锁，等待重试
        if (attempt < retryCount - 1) {
          console.log(`未获取到锁，等待重试... (${attempt + 1}/${retryCount})`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      } catch (error) {
        console.error(`获取锁出错: ${error.message}`);
        if (attempt < retryCount - 1) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
    }
    
    console.log(`获取锁失败: ${lockKey}`);
    return false;
  }
  
  // 释放锁
  async release(key) {
    const lockKey = `lock:${key}`;
    const lockId = this.locks.get(lockKey);
    
    if (!lockId) {
      console.log(`未持有锁: ${lockKey}`);
      return false;
    }
    
    try {
      // 使用 Lua 脚本确保原子性释放锁（只释放自己的锁）
      const script = `
        if redis.call('get', KEYS[1]) == ARGV[1] then
          return redis.call('del', KEYS[1])
        else
          return 0
        end
      `;
      
      const result = await this.redis.eval(script, 1, lockKey, lockId);
      
      if (result === 1) {
        this.locks.delete(lockKey);
        console.log(`成功释放锁: ${lockKey}`);
        return true;
      } else {
        console.log(`释放锁失败，锁可能已过期或被其他进程持有: ${lockKey}`);
        this.locks.delete(lockKey); // 清理记录
        return false;
      }
    } catch (error) {
      console.error(`释放锁出错: ${error.message}`);
      this.locks.delete(lockKey); // 清理记录
      return false;
    }
  }
  
  // 自动续期的锁
  async acquireWithAutoRenewal(key, expiry = this.defaultExpiry, callback) {
    if (!await this.acquire(key, expiry)) {
      throw new Error(`无法获取锁: ${key}`);
    }
    
    const lockKey = `lock:${key}`;
    const renewalInterval = Math.floor(expiry * 0.7); // 在锁过期前 30% 的时间进行续期
    let renewalTimer;
    
    try {
      // 设置自动续期
      renewalTimer = setInterval(async () => {
        const lockId = this.locks.get(lockKey);
        if (lockId) {
          try {
            // 续期脚本
            const renewalScript = `
              if redis.call('get', KEYS[1]) == ARGV[1] then
                return redis.call('pexpire', KEYS[1], ARGV[2])
              else
                return 0
              end
            `;
            
            await this.redis.eval(renewalScript, 1, lockKey, lockId, expiry);
            console.log(`锁已续期: ${lockKey}`);
          } catch (error) {
            console.error(`锁续期失败: ${error.message}`);
            // 续期失败时取消定时器
            clearInterval(renewalTimer);
          }
        }
      }, renewalInterval);
      
      // 执行回调函数
      return await callback();
    } finally {
      // 清除自动续期定时器
      if (renewalTimer) {
        clearInterval(renewalTimer);
      }
      
      // 释放锁
      await this.release(key);
    }
  }
  
  // 生成锁标识符
  _generateLockId() {
    return `${process.pid}:${Date.now()}:${Math.random().toString(36).substring(2, 15)}`;
  }
}

// 使用分布式锁
async function distributedLockExample() {
  const redis = new Redis();
  const lockManager = new RedisLock(redis, 5000); // 锁默认5秒过期
  
  // 模拟共享资源
  let counter = 0;
  
  // 模拟并发访问
  async function criticalSection() {
    // 获取锁
    const lockAcquired = await lockManager.acquire('resource:counter');
    
    if (lockAcquired) {
      try {
        // 模拟处理时间
        console.log(`进程 ${process.pid} 进入临界区`);
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // 访问共享资源
        counter++;
        console.log(`计数器更新为: ${counter}`);
        
      } finally {
        // 释放锁
        await lockManager.release('resource:counter');
      }
    } else {
      console.log(`进程 ${process.pid} 无法获取锁`);
    }
  }
  
  // 使用自动续期的锁
  async function criticalSectionWithAutoRenewal() {
    try {
      await lockManager.acquireWithAutoRenewal('resource:counter', 5000, async () => {
        console.log(`进程 ${process.pid} 进入自动续期的临界区`);
        // 模拟长时间操作
        await new Promise(resolve => setTimeout(resolve, 8000));
        
        counter++;
        console.log(`长时间操作后计数器更新为: ${counter}`);
      });
    } catch (error) {
      console.error('自动续期锁操作失败:', error);
    }
  }
  
  // 并发执行多个操作
  const promises = [];
  for (let i = 0; i < 10; i++) {
    promises.push(criticalSection());
  }
  
  await Promise.all(promises);
  console.log(`所有操作完成，最终计数器值: ${counter}`);
  
  // 测试自动续期功能
  await criticalSectionWithAutoRenewal();
}
```

## 6. 性能优化

### 6.1 连接和命令优化

```javascript
async function performanceOptimization(redis) {
  // 1. 使用管道（Pipeline）批量执行命令
  console.time('Pipeline');
  const pipeline = redis.pipeline();
  
  for (let i = 0; i < 1000; i++) {
    pipeline.set(`pipeline:key:${i}`, `value:${i}`);
    pipeline.get(`pipeline:key:${i}`);
  }
  
  await pipeline.exec();
  console.timeEnd('Pipeline');
  
  // 2. 使用批量命令
  console.time('MSET');
  const bulkSet = {};
  for (let i = 0; i < 1000; i++) {
    bulkSet[`bulk:key:${i}`] = `bulk:value:${i}`;
  }
  await redis.mset(bulkSet);
  console.timeEnd('MSET');
  
  // 3. 使用二进制数据格式减少传输大小
  // 例如使用 Protocol Buffers 或 MessagePack
  
  // 4. 合理设置过期时间
  // 对不同类型的数据设置不同的过期时间
  await redis.set('hot:data', 'value', 'EX', 60); // 热数据 1 分钟过期
  await redis.set('cold:data', 'value', 'EX', 3600); // 冷数据 1 小时过期
  
  // 5. 避免大键
  // 大键会导致性能问题，特别是在内存使用和网络传输方面
  // 对于大型数据集，考虑分片存储
}
```

### 6.2 内存优化

```javascript
async function memoryOptimization(redis) {
  // 1. 获取内存使用统计
  const memoryInfo = await redis.info('memory');
  console.log('内存使用信息:', memoryInfo);
  
  // 2. 使用适当的数据结构
  // 例如，使用哈希表替代字符串存储对象数据
  
  // 不推荐的方式：多个字符串键
  await redis.set('user:1:name', '张三');
  await redis.set('user:1:email', 'zhangsan@example.com');
  await redis.set('user:1:age', '25');
  
  // 推荐的方式：单个哈希表
  await redis.hset('user:2', {
    name: '李四',
    email: 'lisi@example.com',
    age: '25'
  });
  
  // 3. 压缩数据
  // 对于大文本数据，可以在存入Redis之前进行压缩
  
  // 4. 监控键空间
  const keyspaceInfo = await redis.info('keyspace');
  console.log('键空间信息:', keyspaceInfo);
  
  // 5. 使用 REDIS 6.0+ 的客户端缓存
  // 可以减少网络往返时间
  
  // 6. 使用内存淘汰策略
  // 配置文件中设置：maxmemory-policy allkeys-lru
  // 或通过命令设置
  // await redis.config('SET', 'maxmemory-policy', 'allkeys-lru');
}
```

### 6.3 监控和故障排查

```javascript
async function monitoringAndDebugging(redis) {
  // 1. 监控命令执行
  // 在一个连接中执行 MONITOR
  // 在生产环境中谨慎使用，因为会影响性能
  
  // 2. 获取命令统计信息
  const commandStats = await redis.info('commandstats');
  console.log('命令统计信息:', commandStats);
  
  // 3. 检查慢查询日志
  const slowlog = await redis.slowlog('get', 10);
  console.log('慢查询日志:', slowlog);
  
  // 4. 客户端列表
  const clients = await redis.client('list');
  console.log('客户端连接列表:', clients);
  
  // 5. 服务器统计
  const serverInfo = await redis.info('server');
  console.log('服务器信息:', serverInfo);
  
  // 6. 实时内存使用趋势
  async function monitorMemoryUsage(interval = 5000) {
    console.log('开始监控内存使用...');
    
    setInterval(async () => {
      try {
        const info = await redis.info('memory');
        const usedMemory = /used_memory_human:(.*)/.exec(info)[1];
        console.log(`当前内存使用: ${usedMemory}`);
      } catch (error) {
        console.error('监控内存使用失败:', error);
      }
    }, interval);
  }
  
  // 启动监控
  // monitorMemoryUsage();
}
```

## 7. 安全最佳实践

### 7.1 密码认证和访问控制

```javascript
// 安全的 Redis 连接配置
function secureRedisConnection() {
  const Redis = require('ioredis');
  
  // 从环境变量获取敏感信息
  const redisClient = new Redis({
    port: process.env.REDIS_PORT || 6379,
    host: process.env.REDIS_HOST || 'localhost',
    password: process.env.REDIS_PASSWORD,
    db: 0,
    // TLS 配置（如果支持）
    tls: process.env.REDIS_USE_TLS === 'true' ? {
      rejectUnauthorized: true,
      ca: process.env.REDIS_CA_CERT ? [process.env.REDIS_CA_CERT] : []
    } : undefined
  });
  
  return redisClient;
}

// 配置防火墙规则示例（在服务器上执行）
// 例如，在 Linux 上使用 iptables 只允许特定 IP 访问 Redis 端口
// iptables -A INPUT -p tcp -s 192.168.1.100 --dport 6379 -j ACCEPT
// iptables -A INPUT -p tcp --dport 6379 -j DROP
```

### 7.2 数据加密

```javascript
const crypto = require('crypto');

// 敏感数据加密/解密
class DataEncryptor {
  constructor(secretKey) {
    this.secretKey = secretKey;
    this.algorithm = 'aes-256-cbc';
    this.ivLength = 16;
  }
  
  // 加密数据
  encrypt(text) {
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.secretKey, 'hex'), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }
  
  // 解密数据
  decrypt(text) {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(this.secretKey, 'hex'), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
}

// 加密敏感数据后存入 Redis
async function secureDataStorage(redis) {
  // 从环境变量获取密钥
  const secretKey = process.env.ENCRYPTION_KEY;
  if (!secretKey || secretKey.length !== 64) { // AES-256 需要 64 字符的十六进制密钥
    throw new Error('无效的加密密钥');
  }
  
  const encryptor = new DataEncryptor(secretKey);
  
  // 加密并存储敏感数据
  const sensitiveData = {
    creditCard: '4111-1111-1111-1111',
    expiryDate: '12/25',
    cvv: '123'
  };
  
  const encryptedData = encryptor.encrypt(JSON.stringify(sensitiveData));
  await redis.set('user:1:payment', encryptedData);
  
  // 读取并解密数据
  const storedEncryptedData = await redis.get('user:1:payment');
  const decryptedData = JSON.parse(encryptor.decrypt(storedEncryptedData));
  
  console.log('解密后的数据:', decryptedData);
}
```

### 7.3 防止 Redis 命令注入

```javascript
// 安全地处理用户输入的 Redis 命令示例
function secureRedisCommands(redis) {
  // 不安全的做法 - 直接拼接用户输入
  function unsafeCommand(userInput) {
    // 不要这样做！用户可以注入恶意命令
    // const command = `SET user:${userInput} value`;
    // redis.eval(command); // 危险！
  }
  
  // 安全的做法 - 使用参数化命令
  async function secureCommand(userInput) {
    // 验证和清理用户输入
    const safeUserId = String(userInput).replace(/[^a-zA-Z0-9_-]/g, '');
    
    // 使用参数化命令
    await redis.set(`user:${safeUserId}:status`, 'active');
    
    // 或者使用 Redis 客户端提供的方法
    await redis.hset('users', safeUserId, JSON.stringify({ status: 'active' }));
  }
  
  // 限制可执行的命令
  // 在 Redis 配置中使用 rename-command 或 disable-command 限制危险命令
  // 例如在 redis.conf 中：
  // rename-command FLUSHALL ""
  // rename-command DEBUG ""
}
```

## 8. 常见问题与解决方案

### 8.1 连接超时问题

**问题**：Redis 连接超时或频繁断开

**解决方案**：

```javascript
const Redis = require('ioredis');

function handleConnectionIssues() {
  const redis = new Redis({
    port: 6379,
    host: 'localhost',
    // 连接超时设置
    connectTimeout: 10000,
    // 重连策略
    retryStrategy: (times) => {
      // 最大重试次数
      if (times > 10) {
        console.error('达到最大重连次数');
        return null;
      }
      // 指数退避
      const delay = Math.min(times * 1000 + Math.random() * 1000, 10000);
      console.log(`将在 ${delay}ms 后进行第 ${times + 1} 次重连`);
      return delay;
    },
    // 保持连接活跃
    keepAlive: 60000, // 60秒发送一次 PING
    // 最大重连尝试次数
    maxRetriesPerRequest: 3,
    // 启用重连错误日志
    enableReadyCheck: true,
    enableOfflineQueue: true
  });
  
  // 监听各种事件
  redis.on('error', (err) => {
    console.error('Redis 连接错误:', err);
  });
  
  redis.on('reconnecting', (info) => {
    console.log('Redis 正在重连:', info);
  });
  
  redis.on('end', () => {
    console.log('Redis 连接已关闭');
    // 在这里可以添加额外的错误处理或告警逻辑
  });
  
  // 实现健康检查
  async function healthCheck() {
    try {
      await redis.ping();
      return true;
    } catch (error) {
      console.error('Redis 健康检查失败:', error);
      return false;
    }
  }
  
  // 定期健康检查
  setInterval(healthCheck, 60000);
  
  return redis;
}
```

### 8.2 内存溢出问题

**问题**：Redis 使用的内存超过了可用内存或系统限制

**解决方案**：

```javascript
async function handleMemoryIssues(redis) {
  // 1. 检查当前内存使用情况
  const memoryInfo = await redis.info('memory');
  console.log('内存信息:', memoryInfo);
  
  // 2. 设置内存限制和淘汰策略
  // 在 redis.conf 中设置：
  // maxmemory 2gb
  // maxmemory-policy allkeys-lru
  
  // 或通过命令动态设置（重启后会丢失）
  // await redis.config('SET', 'maxmemory', '2gb');
  // await redis.config('SET', 'maxmemory-policy', 'allkeys-lru');
  
  // 3. 查找和删除大键
  async function findLargeKeys() {
    try {
      // 获取前 10 个最大的键
      // 注意：在大型数据库上这可能会阻塞 Redis
      const scanStream = redis.scanStream({
        match: '*',
        count: 100
      });
      
      const keys = [];
      scanStream.on('data', (resultKeys) => {
        for (const key of resultKeys) {
          keys.push(key);
        }
      });
      
      await new Promise(resolve => scanStream.on('end', resolve));
      
      // 获取每个键的大小
      const keySizes = [];
      for (const key of keys) {
        try {
          const type = await redis.type(key);
          let size;
          
          switch (type) {
            case 'string':
              size = await redis.strlen(key);
              break;
            case 'list':
              size = await redis.llen(key);
              break;
            case 'hash':
              size = await redis.hlen(key);
              break;
            case 'set':
              size = await redis.scard(key);
              break;
            case 'zset':
              size = await redis.zcard(key);
              break;
            default:
              size = 0;
          }
          
          keySizes.push({ key, type, size });
        } catch (e) {
          console.error(`检查键 ${key} 时出错:`, e);
        }
      }
      
      // 按大小排序并输出
      keySizes.sort((a, b) => b.size - a.size);
      console.log('最大的 10 个键:');
      keySizes.slice(0, 10).forEach(k => {
        console.log(`键: ${k.key}, 类型: ${k.type}, 大小: ${k.size}`);
      });
      
    } catch (error) {
      console.error('查找大键时出错:', error);
    }
  }
  
  // 4. 实现缓存清理策略
  async function cleanUpCache() {
    try {
      // 清理所有过期的临时数据
      await redis.keys('temp:*').then(keys => {
        if (keys.length > 0) {
          return redis.del(keys);
        }
        return 0;
      });
      
      // 清理超过特定时间的缓存
      const olderThan = Date.now() - 7 * 24 * 60 * 60 * 1000; // 7天前
      await redis.keys('cache:*').then(async keys => {
        for (const key of keys) {
          try {
            // 假设缓存键中包含时间戳或使用单独的元数据存储
            // 实际实现可能需要根据具体情况调整
            const timestamp = key.match(/cache:.*:(\d+)/);
            if (timestamp && parseInt(timestamp[1]) < olderThan) {
              await redis.del(key);
            }
          } catch (e) {
            console.error(`删除键 ${key} 时出错:`, e);
          }
        }
      });
    } catch (error) {
      console.error('清理缓存时出错:', error);
    }
  }
  
  return {
    findLargeKeys,
    cleanUpCache
  };
}
```

### 8.3 命令执行错误

**问题**：执行特定命令时出现错误

**解决方案**：

```javascript
// 统一错误处理包装器
class RedisErrorHandler {
  constructor(redisClient) {
    this.redis = redisClient;
  }
  
  // 包装 Redis 命令并提供统一错误处理
  async executeCommand(command, ...args) {
    try {
      const result = await this.redis[command](...args);
      return { success: true, data: result };
    } catch (error) {
      console.error(`执行命令 ${command} 时出错:`, error);
      
      // 根据错误类型进行处理
      switch (error.code) {
        case 'ECONNREFUSED':
          // 连接被拒绝，可能需要重连或告警
          console.error('Redis 连接被拒绝，请检查 Redis 服务是否运行');
          break;
          
        case 'NR_CLOSED':
          // 连接已关闭
          console.error('Redis 连接已关闭');
          break;
          
        case 'WRONGPASS':
          // 密码错误
          console.error('Redis 密码错误');
          break;
          
        case 'ERR_DB_INDEX':
          // 数据库索引错误
          console.error('Redis 数据库索引无效');
          break;
          
        case 'ERR_NOPERM':
          // 权限错误
          console.error('没有执行命令的权限');
          break;
          
        default:
          console.error(`未分类的 Redis 错误: ${error.message}`);
      }
      
      return { success: false, error: error.message, code: error.code };
    }
  }
  
  // 重试机制包装器
  async executeWithRetry(command, args, maxRetries = 3, retryDelay = 1000) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const result = await this.executeCommand(command, ...args);
      
      if (result.success) {
        return result;
      }
      
      // 如果是连接错误，可以重试
      if (['ECONNREFUSED', 'NR_CLOSED'].includes(result.code) && attempt < maxRetries - 1) {
        console.log(`命令 ${command} 执行失败，${retryDelay}ms 后重试... (${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        retryDelay *= 2; // 指数退避
      } else {
        // 其他错误或达到最大重试次数，不再重试
        break;
      }
    }
    
    return { success: false, error: '达到最大重试次数' };
  }
}

// 使用错误处理器
async function useErrorHandler() {
  const redis = new Redis();
  const errorHandler = new RedisErrorHandler(redis);
  
  // 执行命令并处理错误
  const result = await errorHandler.executeWithRetry('get', ['non_existent_key']);
  
  if (result.success) {
    console.log('命令执行成功，结果:', result.data);
  } else {
    console.log('命令执行失败:', result.error);
  }
  
  // 安全地获取可能不存在的键
  async function getWithFallback(key, fallback = null) {
    const result = await errorHandler.executeCommand('get', [key]);
    return result.success ? result.data : fallback;
  }
  
  const value = await getWithFallback('user:settings', { theme: 'default' });
  console.log('获取的值或默认值:', value);
}
```

## 9. 参考资源

- [Redis 官方文档](https://redis.io/documentation)
- [Node Redis 客户端文档](https://github.com/redis/node-redis)
- [ioredis 文档](https://github.com/luin/ioredis)
- [Redis 命令参考](https://redis.io/commands)
- [Redis 安全指南](https://redis.io/topics/security)
- [Redis 持久化](https://redis.io/topics/persistence)
- [Redis 集群教程](https://redis.io/topics/cluster-tutorial)