# MongoDB 基础

## 1. MongoDB 简介

MongoDB 是一个开源的 NoSQL 文档数据库，它使用 JSON 格式的文档存储数据。MongoDB 是一个面向文档的数据库管理系统，设计用于处理大量数据和高流量的 Web 应用程序。

### 1.1 MongoDB 的特点

- **文档数据模型**：使用 BSON（二进制 JSON）格式存储数据，支持嵌套文档和数组
- **无模式**：集合（collection）中的文档可以有不同的结构
- **可扩展性**：支持水平扩展，可以轻松添加更多服务器
- **高性能**：内存映射文件，支持索引和聚合
- **高可用性**：支持副本集（replica set），确保数据的冗余和可用性
- **丰富的查询 API**：支持复杂查询、聚合和文本搜索

### 1.2 MongoDB 与关系型数据库对比

| 关系型数据库 | MongoDB |
|------------|--------|
| 数据库（Database） | 数据库（Database） |
| 表（Table） | 集合（Collection） |
| 行（Row） | 文档（Document） |
| 列（Column） | 字段（Field） |
| 主键（Primary Key） | _id 字段 |
| 表连接（Join） | 聚合管道、引用或嵌套文档 |
| 事务（Transaction） | 支持多文档事务（4.0+） |

## 2. 核心概念

### 2.1 文档（Document）

文档是 MongoDB 中数据的基本单位，类似于关系型数据库中的行。文档是键值对的有序集合，使用 BSON 格式存储。

```json
{
  "_id": ObjectId("507f191e810c19729de860ea"),
  "name": "张三",
  "age": 30,
  "email": "zhangsan@example.com",
  "address": {
    "city": "北京",
    "street": "长安街",
    "zip": "100000"
  },
  "hobbies": ["阅读", "旅行", "摄影"]
}
```

### 2.2 集合（Collection）

集合是文档的组，类似于关系型数据库中的表。集合是无模式的，这意味着集合中的文档可以有不同的结构。

### 2.3 数据库（Database）

数据库是集合的物理容器。每个 MongoDB 服务器可以有多个数据库。

### 2.4 索引（Index）

索引支持在 MongoDB 中高效地执行查询。没有索引，MongoDB 必须扫描集合中的每个文档以选择匹配查询语句的文档。

### 2.5 副本集（Replica Set）

副本集是一组维护相同数据集的 MongoDB 服务器，提供冗余和高可用性。

### 2.6 分片（Sharding）

分片是将数据水平分布在多个服务器上的方法，用于处理大量数据和高吞吐量操作。

## 3. Node.js 中使用 MongoDB

### 3.1 安装 MongoDB Node.js 驱动

```bash
npm install mongodb
```

### 3.2 基本连接和操作

```javascript
const { MongoClient } = require('mongodb');

// 连接字符串
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function main() {
  try {
    // 连接到 MongoDB
    await client.connect();
    console.log('已连接到 MongoDB');

    // 选择数据库
    const db = client.db('myapp');
    
    // 选择集合
    const collection = db.collection('users');

    // 插入文档
    const insertResult = await collection.insertOne({
      name: '张三',
      age: 30,
      email: 'zhangsan@example.com',
      createdAt: new Date()
    });
    console.log('插入的文档 ID:', insertResult.insertedId);

    // 查找文档
    const findResult = await collection.findOne({ name: '张三' });
    console.log('找到的文档:', findResult);

    // 更新文档
    const updateResult = await collection.updateOne(
      { name: '张三' },
      { $set: { age: 31 } }
    );
    console.log('更新的文档数:', updateResult.modifiedCount);

    // 删除文档
    const deleteResult = await collection.deleteOne({ name: '张三' });
    console.log('删除的文档数:', deleteResult.deletedCount);

    // 查找所有文档
    const allUsers = await collection.find({}).toArray();
    console.log('所有用户:', allUsers);
  } catch (e) {
    console.error('发生错误:', e);
  } finally {
    // 关闭连接
    await client.close();
    console.log('已关闭 MongoDB 连接');
  }
}

main().catch(console.error);
```

### 3.3 使用 Mongoose ODM

Mongoose 是 MongoDB 的对象数据建模（ODM）库，提供了更高级别的抽象。

#### 安装 Mongoose

```bash
npm install mongoose
```

#### 基本使用

```javascript
const mongoose = require('mongoose');

// 连接到 MongoDB
mongoose.connect('mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// 定义模式
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, min: 0 },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

// 创建模型
const User = mongoose.model('User', userSchema);

async function main() {
  try {
    // 创建用户
    const user = new User({
      name: '李四',
      age: 28,
      email: 'lisi@example.com'
    });
    await user.save();
    console.log('已保存用户:', user);

    // 查找用户
    const foundUser = await User.findOne({ name: '李四' });
    console.log('找到的用户:', foundUser);

    // 更新用户
    await User.updateOne({ name: '李四' }, { $set: { age: 29 } });
    console.log('用户已更新');

    // 删除用户
    await User.deleteOne({ name: '李四' });
    console.log('用户已删除');

    // 查找所有用户
    const allUsers = await User.find({});
    console.log('所有用户:', allUsers);
  } catch (e) {
    console.error('发生错误:', e);
  } finally {
    // 关闭连接
    await mongoose.connection.close();
    console.log('已关闭 MongoDB 连接');
  }
}

main().catch(console.error);
```

## 4. 数据操作

### 4.1 插入操作

#### 插入单个文档

```javascript
// MongoDB 驱动
const result = await collection.insertOne({ name: '王五', age: 32 });

// Mongoose
const user = new User({ name: '王五', age: 32 });
await user.save();
// 或
const user = await User.create({ name: '王五', age: 32 });
```

#### 插入多个文档

```javascript
// MongoDB 驱动
const result = await collection.insertMany([
  { name: '赵六', age: 25 },
  { name: '钱七', age: 27 }
]);

// Mongoose
const users = await User.insertMany([
  { name: '赵六', age: 25 },
  { name: '钱七', age: 27 }
]);
```

### 4.2 查询操作

#### 基本查询

```javascript
// MongoDB 驱动 - 查找单个文档
const user = await collection.findOne({ age: { $gt: 26 } });

// MongoDB 驱动 - 查找多个文档
const users = await collection.find({ age: { $gt: 26 } }).toArray();

// Mongoose - 查找单个文档
const user = await User.findOne({ age: { $gt: 26 } });

// Mongoose - 查找多个文档
const users = await User.find({ age: { $gt: 26 } });
```

#### 高级查询操作

```javascript
// 排序
const users = await collection.find({}).sort({ age: -1 }).toArray();

// 限制
const users = await collection.find({}).limit(10).toArray();

// 跳过
const users = await collection.find({}).skip(5).limit(10).toArray();

// 投影（只返回特定字段）
const users = await collection.find({}, { projection: { name: 1, age: 1 } }).toArray();
```

### 4.3 更新操作

```javascript
// 更新单个文档
const result = await collection.updateOne(
  { name: '张三' },
  { $set: { age: 35 }, $inc: { visitCount: 1 } }
);

// 更新多个文档
const result = await collection.updateMany(
  { age: { $lt: 30 } },
  { $set: { category: 'young' } }
);

// 替换整个文档
const result = await collection.replaceOne(
  { _id: ObjectId('5f8d0d55b547644234b39701') },
  { name: '新名字', age: 30 }
);
```

### 4.4 删除操作

```javascript
// 删除单个文档
const result = await collection.deleteOne({ name: '张三' });

// 删除多个文档
const result = await collection.deleteMany({ age: { $lt: 20 } });
```

## 5. 索引和性能优化

### 5.1 创建索引

```javascript
// 创建单字段索引
await collection.createIndex({ name: 1 });

// 创建复合索引
await collection.createIndex({ name: 1, age: -1 });

// 创建唯一索引
await collection.createIndex({ email: 1 }, { unique: true });

// Mongoose 中定义索引
const userSchema = new mongoose.Schema({
  email: { type: String, index: { unique: true } }
});

// 或显式创建
userSchema.index({ name: 1, age: -1 });
```

### 5.2 查询优化

- 使用索引加速查询
- 避免在大型集合上使用 `find()` 而不带过滤器
- 使用投影减少传输的数据量
- 使用 `limit()` 限制返回的文档数量
- 分析查询性能，使用 `explain()` 查看查询执行计划

```javascript
// 查看查询执行计划
const explainResult = await collection.find({ name: '张三' }).explain('executionStats');
console.log(explainResult);
```

## 6. 聚合管道

聚合管道是 MongoDB 中用于数据聚合的框架，支持复杂的数据转换和分析。

```javascript
// 基本聚合操作
const result = await collection.aggregate([
  { $match: { age: { $gt: 25 } } },  // 过滤
  { $group: { _id: '$city', avgAge: { $avg: '$age' } } },  // 分组并计算平均值
  { $sort: { avgAge: -1 } },  // 排序
  { $limit: 10 }  // 限制结果数量
]).toArray();

console.log(result);
```

常见的聚合操作符：

- `$match`: 过滤文档
- `$group`: 分组文档
- `$sort`: 排序文档
- `$limit`: 限制返回的文档数量
- `$skip`: 跳过指定数量的文档
- `$project`: 重塑文档结构
- `$lookup`: 执行左外连接
- `$unwind`: 展开数组
- `$addFields`: 添加新字段

## 7. 数据建模最佳实践

### 7.1 嵌入式文档 vs 引用

MongoDB 提供了两种主要的数据建模方法：

- **嵌入式文档**：将相关数据存储在单个文档中
- **引用**：在文档中存储对其他文档的引用

**选择嵌入式文档的情况：**
- 数据之间有强关联性
- 数据经常一起查询
- 数据增长相对有限

**选择引用的情况：**
- 数据之间有关联，但更新不频繁
- 数据增长可能很大
- 需要避免文档过大

### 7.2 规范化 vs 非规范化

- **规范化**：将数据分散在多个集合中，减少数据冗余
- **非规范化**：将相关数据存储在一起，提高查询性能

MongoDB 通常倾向于非规范化设计，以提高读取性能，但需要根据具体应用场景做出选择。

## 8. 安全最佳实践

### 8.1 认证和授权

- 启用访问控制
- 创建具有适当权限的用户
- 使用 TLS/SSL 加密连接

### 8.2 数据安全

- 加密敏感数据
- 实施数据备份策略
- 定期审计和监控

### 8.3 查询安全

- 验证和清理用户输入
- 使用参数化查询
- 限制查询的复杂度和执行时间

## 9. 部署和维护

### 9.1 副本集部署

副本集提供数据冗余和高可用性：

```bash
# 启动主节点
mongod --replSet rs0 --port 27017 --dbpath /data/db1

# 启动从节点
mongod --replSet rs0 --port 27018 --dbpath /data/db2

# 启动仲裁节点
mongod --replSet rs0 --port 27019 --dbpath /data/db3
```

### 9.2 分片集群部署

分片集群用于水平扩展：
- 配置服务器：存储集群元数据
- 分片服务器：存储实际数据
- 查询路由器：处理客户端请求

### 9.3 监控和性能调优

- 使用 MongoDB Atlas 监控（云服务）
- 使用 MongoDB Compass 分析性能
- 监控慢查询日志
- 调整连接池大小
- 优化内存使用

## 10. 参考资源

- [MongoDB 官方文档](https://docs.mongodb.com/)
- [MongoDB Node.js 驱动文档](https://mongodb.github.io/node-mongodb-native/)
- [Mongoose 文档](https://mongoosejs.com/)
- [MongoDB University](https://university.mongodb.com/)