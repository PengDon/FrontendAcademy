# Node.js 数据库与 ORM

## 数据库概述

在Node.js应用中，数据库是存储和检索数据的关键组件。根据应用需求，可以选择关系型数据库（如MySQL、PostgreSQL）、NoSQL数据库（如MongoDB、Redis）或其他类型的数据库。本文将介绍在Node.js中使用各种数据库和ORM（对象关系映射）工具的方法。

## MySQL

MySQL是最流行的关系型数据库之一，广泛应用于各种Web应用。

### 安装与基本使用

```javascript
// 安装 mysql2
// npm install mysql2

const mysql = require('mysql2');

// 创建连接池（推荐）
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'test_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 获取数据库连接
pool.getConnection((err, connection) => {
  if (err) {
    console.error('获取连接失败:', err);
    return;
  }
  
  // 执行查询
  connection.query('SELECT * FROM users', (err, results, fields) => {
    // 使用完毕后释放连接
    connection.release();
    
    if (err) {
      console.error('查询失败:', err);
      return;
    }
    
    console.log('查询结果:', results);
  });
});

// 直接使用池执行查询（内部自动处理连接的获取和释放）
pool.query('SELECT * FROM users', (err, results, fields) => {
  if (err) {
    console.error('查询失败:', err);
    return;
  }
  console.log('查询结果:', results);
});

// 使用 Promise API
const promisePool = pool.promise();

async function queryUsers() {
  try {
    const [rows, fields] = await promisePool.query('SELECT * FROM users');
    console.log('查询结果:', rows);
    return rows;
  } catch (err) {
    console.error('查询失败:', err);
  }
}

queryUsers();
```

### CRUD 操作

```javascript
// 插入数据
async function createUser(userData) {
  const { name, email, age } = userData;
  const sql = 'INSERT INTO users (name, email, age) VALUES (?, ?, ?)';
  
  try {
    const [result] = await promisePool.query(sql, [name, email, age]);
    console.log('插入成功，ID:', result.insertId);
    return result.insertId;
  } catch (err) {
    console.error('插入失败:', err);
  }
}

// 查询数据
async function getUsers(filters = {}) {
  let sql = 'SELECT * FROM users';
  const params = [];
  
  if (Object.keys(filters).length > 0) {
    sql += ' WHERE';
    const conditions = [];
    
    if (filters.id) {
      conditions.push('id = ?');
      params.push(filters.id);
    }
    if (filters.name) {
      conditions.push('name LIKE ?');
      params.push(`%${filters.name}%`);
    }
    if (filters.minAge) {
      conditions.push('age >= ?');
      params.push(filters.minAge);
    }
    
    sql += ' ' + conditions.join(' AND');
  }
  
  try {
    const [rows] = await promisePool.query(sql, params);
    return rows;
  } catch (err) {
    console.error('查询失败:', err);
  }
}

// 更新数据
async function updateUser(id, userData) {
  const fields = [];
  const values = [];
  
  Object.entries(userData).forEach(([key, value]) => {
    fields.push(`${key} = ?`);
    values.push(value);
  });
  
  values.push(id);
  const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
  
  try {
    const [result] = await promisePool.query(sql, values);
    console.log('更新成功，影响行数:', result.affectedRows);
    return result.affectedRows;
  } catch (err) {
    console.error('更新失败:', err);
  }
}

// 删除数据
async function deleteUser(id) {
  const sql = 'DELETE FROM users WHERE id = ?';
  
  try {
    const [result] = await promisePool.query(sql, [id]);
    console.log('删除成功，影响行数:', result.affectedRows);
    return result.affectedRows;
  } catch (err) {
    console.error('删除失败:', err);
  }
}
```

## PostgreSQL

PostgreSQL是一个功能强大的开源关系型数据库，支持高级特性如JSON支持、全文搜索和复杂查询。

### 安装与基本使用

```javascript
// 安装 pg
// npm install pg

const { Client } = require('pg');

// 创建客户端
const client = new Client({
  host: 'localhost',
  user: 'postgres',
  password: 'password',
  database: 'test_db',
  port: 5432
});

// 连接数据库
async function connectDB() {
  try {
    await client.connect();
    console.log('成功连接到PostgreSQL');
  } catch (err) {
    console.error('连接失败:', err);
  }
}

// 执行查询
async function queryDB() {
  try {
    const result = await client.query('SELECT * FROM users');
    console.log('查询结果:', result.rows);
    return result.rows;
  } catch (err) {
    console.error('查询失败:', err);
  }
}

// 关闭连接
async function disconnectDB() {
  try {
    await client.end();
    console.log('成功关闭连接');
  } catch (err) {
    console.error('关闭连接失败:', err);
  }
}

// 使用连接池（推荐）
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'password',
  database: 'test_db',
  port: 5432,
  max: 20, // 最大连接数
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

// 使用连接池执行查询
async function poolQuery() {
  try {
    const result = await pool.query('SELECT * FROM users');
    console.log('查询结果:', result.rows);
    return result.rows;
  } catch (err) {
    console.error('查询失败:', err);
  }
}
```

### CRUD 操作

```javascript
// 插入数据
async function createUserPostgres(userData) {
  const { name, email, age } = userData;
  const query = {
    text: 'INSERT INTO users(name, email, age) VALUES($1, $2, $3) RETURNING *',
    values: [name, email, age]
  };
  
  try {
    const result = await pool.query(query);
    console.log('插入成功:', result.rows[0]);
    return result.rows[0];
  } catch (err) {
    console.error('插入失败:', err);
  }
}

// 查询数据
async function getUsersPostgres(filters = {}) {
  let text = 'SELECT * FROM users';
  const values = [];
  let conditions = [];
  let paramCount = 1;
  
  if (filters.id) {
    conditions.push(`id = $${paramCount++}`);
    values.push(filters.id);
  }
  if (filters.name) {
    conditions.push(`name ILIKE $${paramCount++}`);
    values.push(`%${filters.name}%`);
  }
  if (filters.minAge) {
    conditions.push(`age >= $${paramCount++}`);
    values.push(filters.minAge);
  }
  
  if (conditions.length > 0) {
    text += ' WHERE ' + conditions.join(' AND ');
  }
  
  const query = { text, values };
  
  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (err) {
    console.error('查询失败:', err);
  }
}

// 更新数据
async function updateUserPostgres(id, userData) {
  let text = 'UPDATE users SET';
  const values = [];
  let setClauses = [];
  let paramCount = 1;
  
  Object.entries(userData).forEach(([key, value]) => {
    setClauses.push(`${key} = $${paramCount++}`);
    values.push(value);
  });
  
  values.push(id);
  text += ' ' + setClauses.join(', ') + ` WHERE id = $${paramCount} RETURNING *`;
  
  const query = { text, values };
  
  try {
    const result = await pool.query(query);
    console.log('更新成功:', result.rows[0]);
    return result.rows[0];
  } catch (err) {
    console.error('更新失败:', err);
  }
}

// 删除数据
async function deleteUserPostgres(id) {
  const query = {
    text: 'DELETE FROM users WHERE id = $1 RETURNING *',
    values: [id]
  };
  
  try {
    const result = await pool.query(query);
    console.log('删除成功:', result.rows[0]);
    return result.rows[0];
  } catch (err) {
    console.error('删除失败:', err);
  }
}
```

## MongoDB

MongoDB是一个流行的NoSQL文档数据库，它以JSON格式存储数据，适合处理大量非结构化数据。

### 安装与基本使用

```javascript
// 安装 mongodb
// npm install mongodb

const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const dbName = 'test_db';

// 连接数据库
async function connectMongoDB() {
  try {
    await client.connect();
    console.log('成功连接到MongoDB');
    return client.db(dbName);
  } catch (err) {
    console.error('连接失败:', err);
  }
}

// 获取集合
async function getCollection(collectionName) {
  const db = await connectMongoDB();
  return db.collection(collectionName);
}

// 关闭连接
async function disconnectMongoDB() {
  try {
    await client.close();
    console.log('成功关闭连接');
  } catch (err) {
    console.error('关闭连接失败:', err);
  }
}
```

### CRUD 操作

```javascript
// 插入数据
async function createDocument(collectionName, document) {
  try {
    const collection = await getCollection(collectionName);
    const result = await collection.insertOne(document);
    console.log('插入成功，ID:', result.insertedId);
    return result.insertedId;
  } catch (err) {
    console.error('插入失败:', err);
  }
}

// 插入多个文档
async function createDocuments(collectionName, documents) {
  try {
    const collection = await getCollection(collectionName);
    const result = await collection.insertMany(documents);
    console.log('插入成功，插入数量:', result.insertedCount);
    return result.insertedIds;
  } catch (err) {
    console.error('插入失败:', err);
  }
}

// 查询文档
async function findDocuments(collectionName, query = {}, options = {}) {
  try {
    const collection = await getCollection(collectionName);
    const cursor = collection.find(query, options);
    const documents = await cursor.toArray();
    return documents;
  } catch (err) {
    console.error('查询失败:', err);
  }
}

// 查询单个文档
async function findOneDocument(collectionName, query = {}) {
  try {
    const collection = await getCollection(collectionName);
    const document = await collection.findOne(query);
    return document;
  } catch (err) {
    console.error('查询失败:', err);
  }
}

// 更新文档
async function updateDocument(collectionName, filter, update, options = {}) {
  try {
    const collection = await getCollection(collectionName);
    const result = await collection.updateOne(filter, update, options);
    console.log('更新成功，匹配数量:', result.matchedCount, '修改数量:', result.modifiedCount);
    return result;
  } catch (err) {
    console.error('更新失败:', err);
  }
}

// 更新多个文档
async function updateDocuments(collectionName, filter, update, options = {}) {
  try {
    const collection = await getCollection(collectionName);
    const result = await collection.updateMany(filter, update, options);
    console.log('更新成功，匹配数量:', result.matchedCount, '修改数量:', result.modifiedCount);
    return result;
  } catch (err) {
    console.error('更新失败:', err);
  }
}

// 删除文档
async function deleteDocument(collectionName, filter) {
  try {
    const collection = await getCollection(collectionName);
    const result = await collection.deleteOne(filter);
    console.log('删除成功，删除数量:', result.deletedCount);
    return result;
  } catch (err) {
    console.error('删除失败:', err);
  }
}

// 删除多个文档
async function deleteDocuments(collectionName, filter) {
  try {
    const collection = await getCollection(collectionName);
    const result = await collection.deleteMany(filter);
    console.log('删除成功，删除数量:', result.deletedCount);
    return result;
  } catch (err) {
    console.error('删除失败:', err);
  }
}

// 使用示例
async function usageExample() {
  // 创建用户
  const userId = await createDocument('users', {
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
    createdAt: new Date()
  });
  
  // 查询用户
  const users = await findDocuments('users', { age: { $gte: 25 } });
  
  // 更新用户
  await updateDocument('users',
    { _id: userId },
    { $set: { age: 31, updatedAt: new Date() } },
    { upsert: false }
  );
  
  // 删除用户
  await deleteDocument('users', { _id: userId });
  
  // 关闭连接
  await disconnectMongoDB();
}
```

## Redis

Redis是一个开源的内存数据结构存储，可用作数据库、缓存和消息代理。

### 安装与基本使用

```javascript
// 安装 redis
// npm install redis

const redis = require('redis');

// 创建客户端
const client = redis.createClient({
  url: 'redis://localhost:6379'
});

// 连接错误处理
client.on('error', (err) => console.log('Redis客户端错误:', err));

// 连接成功处理
client.on('connect', () => console.log('Redis客户端已连接'));

client.on('ready', () => console.log('Redis客户端已准备好'));

client.on('end', () => console.log('Redis客户端连接已关闭'));

// 连接Redis
async function connectRedis() {
  try {
    await client.connect();
    console.log('成功连接到Redis');
  } catch (err) {
    console.error('连接失败:', err);
  }
}

// 关闭连接
async function disconnectRedis() {
  try {
    await client.quit();
    console.log('成功关闭连接');
  } catch (err) {
    console.error('关闭连接失败:', err);
  }
}
```

### 基本操作

```javascript
// 字符串操作
async function stringOperations() {
  try {
    // 设置键值对
    await client.set('mykey', 'Hello Redis');
    
    // 获取值
    const value = await client.get('mykey');
    console.log('获取值:', value);
    
    // 设置带过期时间的键值对
    await client.setEx('tempkey', 60, 'This will expire in 60 seconds');
    
    // 设置多个键值对
    await client.mSet('key1', 'value1', 'key2', 'value2', 'key3', 'value3');
    
    // 获取多个值
    const values = await client.mGet(['key1', 'key2', 'key3']);
    console.log('获取多个值:', values);
    
    // 递增
    await client.set('counter', 0);
    await client.incr('counter'); // 1
    await client.incr('counter'); // 2
    
    // 递增指定值
    await client.incrBy('counter', 10); // 12
    
    // 递减
    await client.decr('counter'); // 11
    
    // 递减指定值
    await client.decrBy('counter', 5); // 6
    
    // 删除键
    await client.del('mykey');
    
    // 检查键是否存在
    const exists = await client.exists('mykey');
    console.log('键是否存在:', exists === 1);
    
    // 获取键的剩余过期时间
    const ttl = await client.ttl('tempkey');
    console.log('剩余过期时间:', ttl);
  } catch (err) {
    console.error('字符串操作失败:', err);
  }
}

// 哈希表操作
async function hashOperations() {
  try {
    // 设置哈希表字段
    await client.hSet('user:1', {
      name: 'John Doe',
      email: 'john@example.com',
      age: 30
    });
    
    // 获取哈希表字段
    const name = await client.hGet('user:1', 'name');
    console.log('用户名称:', name);
    
    // 获取哈希表所有字段和值
    const user = await client.hGetAll('user:1');
    console.log('用户信息:', user);
    
    // 获取哈希表所有字段名
    const fields = await client.hKeys('user:1');
    console.log('字段名:', fields);
    
    // 获取哈希表所有值
    const values = await client.hVals('user:1');
    console.log('字段值:', values);
    
    // 检查字段是否存在
    const exists = await client.hExists('user:1', 'name');
    console.log('字段是否存在:', exists === 1);
    
    // 删除哈希表字段
    await client.hDel('user:1', 'age');
    
    // 增加哈希表数字字段的值
    await client.hSet('user:1', 'visits', 0);
    await client.hIncrBy('user:1', 'visits', 1);
  } catch (err) {
    console.error('哈希表操作失败:', err);
  }
}

// 列表操作
async function listOperations() {
  try {
    // 向列表左侧添加元素
    await client.lPush('mylist', 'item1', 'item2', 'item3');
    
    // 向列表右侧添加元素
    await client.rPush('mylist', 'item4', 'item5');
    
    // 获取列表长度
    const length = await client.lLen('mylist');
    console.log('列表长度:', length);
    
    // 获取列表所有元素
    const list = await client.lRange('mylist', 0, -1);
    console.log('列表元素:', list);
    
    // 从列表左侧弹出元素
    const leftPop = await client.lPop('mylist');
    console.log('左侧弹出:', leftPop);
    
    // 从列表右侧弹出元素
    const rightPop = await client.rPop('mylist');
    console.log('右侧弹出:', rightPop);
    
    // 通过索引获取元素
    const element = await client.lIndex('mylist', 1);
    console.log('索引为1的元素:', element);
  } catch (err) {
    console.error('列表操作失败:', err);
  }
}

// 集合操作
async function setOperations() {
  try {
    // 添加元素到集合
    await client.sAdd('myset', 'member1', 'member2', 'member3');
    
    // 获取集合所有成员
    const members = await client.sMembers('myset');
    console.log('集合成员:', members);
    
    // 检查成员是否存在
    const exists = await client.sIsMember('myset', 'member1');
    console.log('成员是否存在:', exists === 1);
    
    // 获取集合大小
    const size = await client.sCard('myset');
    console.log('集合大小:', size);
    
    // 从集合中移除成员
    await client.sRem('myset', 'member1');
    
    // 随机获取成员
    const randomMember = await client.sRandMember('myset');
    console.log('随机成员:', randomMember);
    
    // 随机移除并返回成员
    const popMember = await client.sPop('myset');
    console.log('随机移除成员:', popMember);
  } catch (err) {
    console.error('集合操作失败:', err);
  }
}

// 有序集合操作
async function sortedSetOperations() {
  try {
    // 添加成员到有序集合
    await client.zAdd('mysortedset', 
      { score: 90, value: 'Alice' },
      { score: 85, value: 'Bob' },
      { score: 95, value: 'Charlie' }
    );
    
    // 获取有序集合成员数量
    const size = await client.zCard('mysortedset');
    console.log('有序集合大小:', size);
    
    // 按分数升序获取成员
    const membersAsc = await client.zRange('mysortedset', 0, -1);
    console.log('升序成员:', membersAsc);
    
    // 按分数降序获取成员
    const membersDesc = await client.zRevRange('mysortedset', 0, -1);
    console.log('降序成员:', membersDesc);
    
    // 获取成员分数
    const score = await client.zScore('mysortedset', 'Alice');
    console.log('Alice的分数:', score);
    
    // 获取分数范围内的成员
    const rangeByScore = await client.zRangeByScore('mysortedset', 80, 90);
    console.log('80-90分的成员:', rangeByScore);
    
    // 增加成员分数
    await client.zIncrBy('mysortedset', 5, 'Bob');
  } catch (err) {
    console.error('有序集合操作失败:', err);
  }
}
```

## Sequelize (ORM)

Sequelize是一个基于Promise的Node.js ORM，支持PostgreSQL、MySQL、SQLite和Microsoft SQL Server等数据库。

### 安装与基本配置

```javascript
// 安装 Sequelize 和数据库驱动
// npm install sequelize mysql2

const { Sequelize, DataTypes, Model } = require('sequelize');

// 创建Sequelize实例
const sequelize = new Sequelize('test_db', 'root', 'password', {
  host: 'localhost',
  dialect: 'mysql',
  logging: console.log, // 日志记录
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// 测试连接
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功');
  } catch (err) {
    console.error('数据库连接失败:', err);
  }
}

// 定义模型
class User extends Model {}

User.init({
  // 模型属性
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING
    // allowNull 默认为 true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  age: {
    type: DataTypes.INTEGER,
    validate: {
      min: 18
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  }
}, {
  // 模型选项
  sequelize, // 我们需要传递连接实例
  modelName: 'User', // 我们需要选择模型名称
  tableName: 'users', // 指定表名
  timestamps: true // 自动管理 createdAt 和 updatedAt 字段
});

// 创建表（如果不存在）
async function createTables() {
  try {
    await sequelize.sync(); // 默认会创建所有模型对应的表
    // 或者使用 force: true 强制重建表（会删除原有表）
    // await sequelize.sync({ force: true });
    console.log('表已创建/同步');
  } catch (err) {
    console.error('创建表失败:', err);
  }
}
```

### CRUD 操作

```javascript
// 创建用户
async function createUserSequelize(userData) {
  try {
    const user = await User.create(userData);
    console.log('用户创建成功:', user.toJSON());
    return user;
  } catch (err) {
    console.error('用户创建失败:', err);
  }
}

// 批量创建用户
async function bulkCreateUsersSequelize(usersData) {
  try {
    const users = await User.bulkCreate(usersData);
    console.log(`成功创建 ${users.length} 个用户`);
    return users;
  } catch (err) {
    console.error('批量创建用户失败:', err);
  }
}

// 查询用户
async function findUsersSequelize(options = {}) {
  try {
    const users = await User.findAll(options);
    console.log(`找到 ${users.length} 个用户`);
    return users;
  } catch (err) {
    console.error('查询用户失败:', err);
  }
}

// 查询单个用户
async function findOneUserSequelize(options = {}) {
  try {
    const user = await User.findOne(options);
    if (user) {
      console.log('找到用户:', user.toJSON());
    } else {
      console.log('未找到用户');
    }
    return user;
  } catch (err) {
    console.error('查询用户失败:', err);
  }
}

// 根据主键查询用户
async function findUserByIdSequelize(id) {
  try {
    const user = await User.findByPk(id);
    if (user) {
      console.log('找到用户:', user.toJSON());
    } else {
      console.log('未找到用户');
    }
    return user;
  } catch (err) {
    console.error('查询用户失败:', err);
  }
}

// 更新用户
async function updateUserSequelize(id, updateData) {
  try {
    // 方法1：先查询再更新
    const user = await User.findByPk(id);
    if (user) {
      const updatedUser = await user.update(updateData);
      console.log('用户更新成功:', updatedUser.toJSON());
      return updatedUser;
    }
    
    // 方法2：直接更新
    const [affectedCount] = await User.update(updateData, {
      where: { id: id }
    });
    console.log(`更新了 ${affectedCount} 条记录`);
    return affectedCount;
  } catch (err) {
    console.error('用户更新失败:', err);
  }
}

// 删除用户
async function deleteUserSequelize(id) {
  try {
    // 方法1：先查询再删除
    const user = await User.findByPk(id);
    if (user) {
      await user.destroy();
      console.log('用户删除成功');
      return true;
    }
    
    // 方法2：直接删除
    const affectedCount = await User.destroy({
      where: { id: id }
    });
    console.log(`删除了 ${affectedCount} 条记录`);
    return affectedCount > 0;
  } catch (err) {
    console.error('用户删除失败:', err);
  }
}

// 使用示例
async function sequelizeExample() {
  // 创建用户
  const user = await createUserSequelize({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    age: 30
  });
  
  // 查询所有用户
  const allUsers = await findUsersSequelize();
  
  // 带条件查询
  const youngUsers = await findUsersSequelize({
    where: {
      age: { [Sequelize.Op.lte]: 35 }
    },
    attributes: ['firstName', 'lastName', 'email'], // 只选择特定字段
    order: [['age', 'DESC']], // 排序
    limit: 10, // 限制返回数量
    offset: 0 // 偏移量（分页）
  });
  
  // 更新用户
  await updateUserSequelize(user.id, {
    lastName: 'Smith',
    age: 31
  });
  
  // 删除用户
  await deleteUserSequelize(user.id);
}
```

### 模型关联

Sequelize支持多种关联类型，如一对一、一对多和多对多。

```javascript
// 定义关联
// 例如，一个用户可以有多个文章

class Article extends Model {}

Article.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users', // 注意这里使用的是表名
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'Article',
  tableName: 'articles'
});

// 定义关联
User.hasMany(Article, { foreignKey: 'userId' });
Article.belongsTo(User, { foreignKey: 'userId' });

// 使用关联
async function useAssociations() {
  // 创建用户和文章
  const user = await User.create({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com'
  });
  
  // 方法1：通过用户创建文章
  await user.createArticle({
    title: 'First Article',
    content: 'This is my first article.'
  });
  
  // 方法2：直接创建文章并指定用户ID
  await Article.create({
    title: 'Second Article',
    content: 'This is my second article.',
    userId: user.id
  });
  
  // 查询用户及其所有文章
  const userWithArticles = await User.findByPk(user.id, {
    include: [Article]
  });
  console.log('用户文章:', userWithArticles.toJSON());
  
  // 查询文章及其关联的用户
  const articleWithUser = await Article.findOne({
    where: { title: 'First Article' },
    include: [User]
  });
  console.log('文章作者:', articleWithUser.toJSON());
  
  // 多对多关联示例（需要中间表）
  // 例如，用户和标签的多对多关系
  
  class Tag extends Model {}
  
  Tag.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Tag',
    tableName: 'tags'
  });
  
  // 创建中间表
  const UserTag = sequelize.define('UserTag', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }
  }, {
    tableName: 'user_tags'
  });
  
  // 定义多对多关联
  User.belongsToMany(Tag, { through: UserTag });
  Tag.belongsToMany(User, { through: UserTag });
  
  // 创建标签
  const tag1 = await Tag.create({ name: 'JavaScript' });
  const tag2 = await Tag.create({ name: 'Node.js' });
  
  // 将标签添加到用户
  await user.addTags([tag1, tag2]);
  
  // 查询用户及其标签
  const userWithTags = await User.findByPk(user.id, {
    include: [Tag]
  });
  console.log('用户标签:', userWithTags.toJSON());
  
  // 查询标签及其用户
  const tagWithUsers = await Tag.findByPk(tag1.id, {
    include: [User]
  });
  console.log('标签用户:', tagWithUsers.toJSON());
}
```

## Mongoose (MongoDB ORM)

Mongoose是MongoDB的对象建模工具，提供了Schema验证、中间件、查询构建等功能。

### 安装与基本配置

```javascript
// 安装 mongoose
// npm install mongoose

const mongoose = require('mongoose');

// 连接MongoDB
async function connectMongoose() {
  try {
    await mongoose.connect('mongodb://localhost:27017/test_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Mongoose连接成功');
  } catch (err) {
    console.error('Mongoose连接失败:', err);
  }
}

// 定义Schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} 不是有效的邮箱地址!`
    }
  },
  age: {
    type: Number,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 定义中间件
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// 添加方法
userSchema.methods.getFullName = function() {
  return `${this.firstName} ${this.lastName}`;
};

// 添加静态方法
userSchema.statics.findByEmail = async function(email) {
  return this.findOne({ email });
};

// 编译模型
const UserModel = mongoose.model('User', userSchema);
```

### CRUD 操作

```javascript
// 创建用户
async function createUserMongoose(userData) {
  try {
    const user = new UserModel(userData);
    const savedUser = await user.save();
    console.log('用户创建成功:', savedUser);
    return savedUser;
  } catch (err) {
    console.error('用户创建失败:', err);
  }
}

// 批量创建用户
async function bulkCreateUsersMongoose(usersData) {
  try {
    const users = await UserModel.insertMany(usersData);
    console.log(`成功创建 ${users.length} 个用户`);
    return users;
  } catch (err) {
    console.error('批量创建用户失败:', err);
  }
}

// 查询用户
async function findUsersMongoose(query = {}, projection = {}, options = {}) {
  try {
    const users = await UserModel.find(query, projection, options);
    console.log(`找到 ${users.length} 个用户`);
    return users;
  } catch (err) {
    console.error('查询用户失败:', err);
  }
}

// 查询单个用户
async function findOneUserMongoose(query = {}) {
  try {
    const user = await UserModel.findOne(query);
    if (user) {
      console.log('找到用户:', user);
    } else {
      console.log('未找到用户');
    }
    return user;
  } catch (err) {
    console.error('查询用户失败:', err);
  }
}

// 根据ID查询用户
async function findUserByIdMongoose(id) {
  try {
    const user = await UserModel.findById(id);
    if (user) {
      console.log('找到用户:', user);
    } else {
      console.log('未找到用户');
    }
    return user;
  } catch (err) {
    console.error('查询用户失败:', err);
  }
}

// 使用静态方法查询
async function findByEmail(email) {
  try {
    const user = await UserModel.findByEmail(email);
    return user;
  } catch (err) {
    console.error('查询失败:', err);
  }
}

// 更新用户
async function updateUserMongoose(id, updateData, options = { new: true }) {
  try {
    // 方法1：使用findByIdAndUpdate
    const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, options);
    console.log('用户更新成功:', updatedUser);
    return updatedUser;
    
    // 方法2：先查询再保存
    // const user = await UserModel.findById(id);
    // if (user) {
    //   Object.assign(user, updateData);
    //   const savedUser = await user.save();
    //   console.log('用户更新成功:', savedUser);
    //   return savedUser;
    // }
  } catch (err) {
    console.error('用户更新失败:', err);
  }
}

// 批量更新用户
async function updateManyUsersMongoose(query, updateData, options = {}) {
  try {
    const result = await UserModel.updateMany(query, updateData, options);
    console.log(`更新了 ${result.nModified} 条记录`);
    return result;
  } catch (err) {
    console.error('批量更新失败:', err);
  }
}

// 删除用户
async function deleteUserMongoose(id) {
  try {
    // 方法1：使用findByIdAndDelete
    const deletedUser = await UserModel.findByIdAndDelete(id);
    console.log('用户删除成功:', deletedUser);
    return deletedUser;
    
    // 方法2：先查询再删除
    // const user = await UserModel.findById(id);
    // if (user) {
    //   await user.deleteOne();
    //   console.log('用户删除成功');
    //   return user;
    // }
  } catch (err) {
    console.error('用户删除失败:', err);
  }
}

// 批量删除用户
async function deleteManyUsersMongoose(query) {
  try {
    const result = await UserModel.deleteMany(query);
    console.log(`删除了 ${result.deletedCount} 条记录`);
    return result;
  } catch (err) {
    console.error('批量删除失败:', err);
  }
}

// 使用示例
async function mongooseExample() {
  // 创建用户
  const user = await createUserMongoose({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    age: 30
  });
  
  // 使用实例方法
  console.log('用户全名:', user.getFullName());
  
  // 复杂查询
  const query = {
    age: { $gte: 18 },
    firstName: { $regex: /^J/i }
  };
  
  const projection = { firstName: 1, email: 1, _id: 0 };
  
  const options = {
    sort: { age: 1 },
    limit: 10,
    skip: 0
  };
  
  const users = await findUsersMongoose(query, projection, options);
  
  // 更新用户
  await updateUserMongoose(user._id, {
    lastName: 'Smith',
    age: 31
  });
  
  // 删除用户
  await deleteUserMongoose(user._id);
}
```

### Schema 关联

Mongoose支持通过引用和嵌入文档实现关联。

```javascript
// 引用式关联

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ArticleModel = mongoose.model('Article', articleSchema);

// 使用引用式关联
async function useReferenceAssociation() {
  // 创建用户和文章
  const user = await createUserMongoose({
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com'
  });
  
  const article = await ArticleModel.create({
    title: 'MongoDB Guide',
    content: 'This is a guide about MongoDB.',
    author: user._id
  });
  
  // 填充作者信息
  const articleWithAuthor = await ArticleModel.findById(article._id)
    .populate('author', 'firstName lastName email')
    .exec();
  
  console.log('文章及其作者:', articleWithAuthor);
}

// 嵌入式关联

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [commentSchema], // 嵌入评论数组
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const PostModel = mongoose.model('Post', postSchema);

// 使用嵌入式关联
async function useEmbeddedAssociation() {
  // 创建用户
  const user = await createUserMongoose({
    firstName: 'Bob',
    lastName: 'Smith',
    email: 'bob@example.com'
  });
  
  // 创建带评论的文章
  const post = new PostModel({
    title: 'Mongoose Tutorial',
    content: 'This is a tutorial about Mongoose.',
    author: user._id,
    comments: [
      {
        content: 'Great article!',
        author: user._id
      },
      {
        content: 'Very helpful.',
        author: user._id
      }
    ]
  });
  
  await post.save();
  console.log('带评论的文章:', post);
  
  // 添加新评论
  post.comments.push({
    content: 'Thanks for sharing!',
    author: user._id
  });
  
  await post.save();
  console.log('添加评论后的文章:', post);
}
```

## 常见问题与答案

### 1. 选择数据库类型时应考虑哪些因素？
**答案：** 
- **数据结构**：结构化数据适合关系型数据库，非结构化或半结构化数据适合NoSQL
- **查询复杂度**：复杂查询和事务处理适合关系型数据库
- **扩展性需求**：水平扩展需求高的应用可能更适合NoSQL数据库
- **性能需求**：需要快速读写的场景可以考虑Redis等内存数据库
- **团队熟悉度**：选择团队已经熟悉的技术栈可以提高开发效率
- **成本预算**：考虑许可成本、硬件要求和维护成本

### 2. ORM的优缺点是什么？
**答案：** 
**优点：**
- **开发效率**：简化数据操作代码，减少样板代码
- **类型安全**：提供数据类型检查和验证
- **数据库无关性**：可以更容易地切换底层数据库系统
- **维护性**：使数据模型更易于理解和维护
- **关系映射**：简化表之间关系的处理

**缺点：**
- **性能开销**：ORM会带来一定的性能开销
- **学习成本**：需要学习特定ORM的API和概念
- **复杂查询限制**：复杂查询可能难以通过ORM优雅地表达
- **额外依赖**：增加了项目的依赖和复杂度

### 3. 如何防止SQL注入攻击？
**答案：** 
- **使用参数化查询**：始终使用参数化查询而不是字符串拼接
  ```javascript
  // 安全的参数化查询
  connection.query('SELECT * FROM users WHERE id = ?', [userId]);
  
  // 不安全的字符串拼接（避免）
  // connection.query('SELECT * FROM users WHERE id = ' + userId);
  ```
- **使用ORM**：大多数ORM自动处理参数化
- **输入验证和过滤**：验证和清理所有用户输入
- **最小权限原则**：数据库用户只分配必要的最小权限
- **使用存储过程**：对于复杂查询，使用存储过程可能更安全

### 4. 数据库连接池的作用是什么？
**答案：** 
- **性能优化**：减少创建和销毁数据库连接的开销
- **连接管理**：有效管理数据库连接资源
- **并发控制**：控制并发连接数，防止数据库过载
- **提高可用性**：在连接失败时自动重试和恢复
- **配置示例**：
  ```javascript
  // MySQL连接池配置
  const pool = mysql.createPool({
    connectionLimit: 10, // 最大连接数
    queueLimit: 0, // 排队连接数（0表示无限制）
    waitForConnections: true, // 连接用尽时是否等待
    acquireTimeout: 30000 // 获取连接的超时时间
  });
  ```

### 5. 如何优化数据库查询性能？
**答案：** 
- **索引优化**：在查询频繁的列上创建适当的索引
- **查询优化**：使用EXPLAIN分析查询执行计划，优化SQL语句
- **数据分区**：对大型表进行分区以提高查询性能
- **预编译语句**：使用预编译语句减少解析开销
- **缓存查询结果**：缓存频繁执行的查询结果
- **分页查询**：使用LIMIT和OFFSET进行分页，避免一次性返回大量数据
- **避免N+1查询问题**：使用JOIN或ORM的预加载功能避免多次查询

### 6. 如何处理数据库事务？
**答案：** 
- **MySQL事务**：
  ```javascript
  async function performTransaction() {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      await connection.query('UPDATE accounts SET balance = balance - 100 WHERE id = 1');
      await connection.query('UPDATE accounts SET balance = balance + 100 WHERE id = 2');
      await connection.commit();
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }
  ```
- **Sequelize事务**：
  ```javascript
  async function performSequelizeTransaction() {
    const transaction = await sequelize.transaction();
    try {
      await User.update({ balance: 900 }, { where: { id: 1 }, transaction });
      await User.update({ balance: 1100 }, { where: { id: 2 }, transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
  ```
- **MongoDB事务**（需要复制集或分片集群）：
  ```javascript
  async function performMongoTransaction() {
    const session = client.startSession();
    try {
      await session.withTransaction(async () => {
        const usersCollection = db.collection('users');
        await usersCollection.updateOne(
          { _id: 1 },
          { $inc: { balance: -100 } },
          { session }
        );
        await usersCollection.updateOne(
          { _id: 2 },
          { $inc: { balance: 100 } },
          { session }
        );
      });
    } finally {
      await session.endSession();
    }
  }
  ```

### 7. 如何实现数据库迁移？
**答案：** 
- **Sequelize迁移**：
  1. 安装迁移工具：`npm install -g sequelize-cli`
  2. 初始化：`sequelize init`
  3. 创建迁移：`sequelize migration:generate --name create-users`
  4. 编辑迁移文件，定义表结构
  5. 运行迁移：`sequelize db:migrate`
  6. 回滚迁移：`sequelize db:migrate:undo`

- **Knex.js迁移**：
  1. 安装：`npm install knex`
  2. 初始化：`knex init`
  3. 创建迁移：`knex migrate:make create_users`
  4. 运行迁移：`knex migrate:latest`
  5. 回滚迁移：`knex migrate:rollback`

- **MongoDB迁移**（如使用migrate-mongo）：
  1. 安装：`npm install -g migrate-mongo`
  2. 初始化：`migrate-mongo init`
  3. 创建迁移：`migrate-mongo create create-users`
  4. 运行迁移：`migrate-mongo up`
  5. 回滚迁移：`migrate-mongo down`

### 8. 什么是连接泄漏？如何防止？
**答案：** 
- **连接泄漏**：数据库连接未正确关闭或释放，导致连接资源被耗尽
- **防止方法**：
  - 始终在使用完毕后释放连接（使用finally块确保）
  - 使用连接池管理连接生命周期
  - 为连接设置超时限制
  - 监控连接使用情况，及时发现泄漏
  - 使用连接池的事件监听器监控连接获取和释放
  ```javascript
  // 监控连接池事件
  pool.on('acquire', function (connection) {
    console.log('Connection %d acquired', connection.threadId);
  });
  
  pool.on('release', function (connection) {
    console.log('Connection %d released', connection.threadId);
  });
  ```

### 9. 如何实现数据库读写分离？
**答案：** 
- **MySQL主从复制**：
  1. 配置MySQL主从复制
  2. 在应用中区分读写操作，写操作发送到主库，读操作分发到从库
  3. 可以使用中间件如ProxySQL或应用层实现
  
- **代码实现示例**：
  ```javascript
  // 创建主库和从库连接池
  const masterPool = mysql.createPool(masterConfig);
  const slavePool = mysql.createPool(slaveConfig);
  
  // 封装读写操作
  const db = {
    // 写操作使用主库
    write: (sql, params) => {
      return masterPool.promise().query(sql, params);
    },
    // 读操作使用从库
    read: (sql, params) => {
      return slavePool.promise().query(sql, params);
    }
  };
  
  // 使用示例
  async function example() {
    // 写操作
    await db.write('INSERT INTO users (name) VALUES (?)', ['John']);
    // 读操作
    const [users] = await db.read('SELECT * FROM users');
  }
  ```

### 10. 如何备份和恢复数据库？
**答案：** 
- **MySQL备份**：
  ```bash
  # 备份整个数据库
  mysqldump -u username -p database_name > backup.sql
  
  # 恢复数据库
  mysql -u username -p database_name < backup.sql
  ```

- **PostgreSQL备份**：
  ```bash
  # 备份数据库
  pg_dump -U username database_name > backup.sql
  
  # 恢复数据库
  psql -U username database_name < backup.sql
  ```

- **MongoDB备份**：
  ```bash
  # 备份数据库
  mongodump --db database_name --out /backup/directory
  
  # 恢复数据库
  mongorestore --db database_name /backup/directory/database_name
  ```

- **自动化备份策略**：
  - 使用cron作业定期执行备份脚本
  - 实现增量备份减少存储空间使用
  - 加密备份文件确保数据安全
  - 将备份文件存储在异地或云存储
  - 定期测试备份恢复流程，确保备份有效性