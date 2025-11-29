# PostgreSQL 与 Node.js 集成

## 1. PostgreSQL 基础概念

PostgreSQL 是一个功能强大的开源关系型数据库管理系统（RDBMS），以其可靠性、功能强大和高性能而闻名。它支持复杂查询、事务、外键约束、视图、存储过程和触发器等关系型数据库特性。

### 1.1 PostgreSQL 的主要特性

- **ACID 兼容**：完全支持事务的原子性、一致性、隔离性和持久性
- **丰富的数据类型**：支持数值型、字符串型、日期/时间型、布尔型、数组、JSON等多种数据类型
- **高级索引**：支持B-tree、哈希、GiST、SP-GiST、GIN和BRIN等多种索引类型
- **全文搜索**：内置强大的全文搜索功能
- **扩展性**：支持自定义数据类型、函数、操作符和索引
- **并发控制**：采用多版本并发控制（MVCC）
- **安全机制**：支持行级安全性、SSL连接和细粒度的访问控制

## 2. PostgreSQL 与 Node.js 集成

### 2.1 安装依赖

```bash
# 使用 node-postgres (pg) 驱动
npm install pg

# 或者使用 Sequelize ORM
npm install sequelize pg pg-hstore

# 或者使用 TypeORM
npm install typeorm reflect-metadata pg
```

### 2.2 使用原生 pg 驱动

#### 2.2.1 基本连接

```javascript
const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'mydb',
  password: 'mypassword',
  port: 5432,
});

async function connect() {
  try {
    await client.connect();
    console.log('成功连接到 PostgreSQL 数据库');
  } catch (error) {
    console.error('连接数据库失败:', error);
  }
}

connect();
```

#### 2.2.2 执行查询

```javascript
async function queryExample() {
  try {
    // 执行查询
    const res = await client.query('SELECT * FROM users WHERE age > $1', [18]);
    console.log('查询结果:', res.rows);
  } catch (error) {
    console.error('查询失败:', error);
  } finally {
    // 关闭连接
    await client.end();
  }
}
```

#### 2.2.3 使用连接池

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'mydb',
  password: 'mypassword',
  port: 5432,
  max: 20, // 最大连接数
  idleTimeoutMillis: 30000, // 空闲连接超时时间
  connectionTimeoutMillis: 2000, // 连接超时时间
});

// 查询函数
async function getUsers() {
  try {
    const res = await pool.query('SELECT * FROM users');
    return res.rows;
  } catch (error) {
    console.error('查询用户失败:', error);
    throw error;
  }
}

// 添加用户
async function addUser(name, email, age) {
  try {
    const res = await pool.query(
      'INSERT INTO users(name, email, age) VALUES($1, $2, $3) RETURNING *',
      [name, email, age]
    );
    return res.rows[0];
  } catch (error) {
    console.error('添加用户失败:', error);
    throw error;
  }
}

// 应用结束时关闭连接池
process.on('SIGINT', () => {
  pool.end();
  console.log('连接池已关闭');
  process.exit();
});
```

## 3. 使用 Sequelize ORM

### 3.1 配置 Sequelize

```javascript
const { Sequelize, DataTypes } = require('sequelize');

// 创建 Sequelize 实例
const sequelize = new Sequelize('mydb', 'postgres', 'mypassword', {
  host: 'localhost',
  dialect: 'postgres',
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// 测试连接
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Sequelize 连接成功');
  } catch (error) {
    console.error('Sequelize 连接失败:', error);
  }
}

testConnection();
```

### 3.2 定义模型

```javascript
// 定义用户模型
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 50]
    }
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
      min: 0,
      max: 150
    }
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'users',
  timestamps: true
});

// 同步模型到数据库
async function syncModels() {
  try {
    // 创建表（如果不存在）
    await User.sync({ alter: true });
    console.log('模型同步成功');
  } catch (error) {
    console.error('模型同步失败:', error);
  }
}

syncModels();
```

### 3.3 使用模型进行 CRUD 操作

```javascript
// 创建用户
async function createUser(userData) {
  try {
    const user = await User.create(userData);
    console.log('创建的用户:', user.toJSON());
    return user;
  } catch (error) {
    console.error('创建用户失败:', error);
    throw error;
  }
}

// 查询所有用户
async function findAllUsers() {
  try {
    const users = await User.findAll();
    return users.map(user => user.toJSON());
  } catch (error) {
    console.error('查询用户失败:', error);
    throw error;
  }
}

// 根据 ID 查询用户
async function findUserById(id) {
  try {
    const user = await User.findByPk(id);
    return user ? user.toJSON() : null;
  } catch (error) {
    console.error('查询用户失败:', error);
    throw error;
  }
}

// 更新用户
async function updateUser(id, updates) {
  try {
    const [rowsUpdated] = await User.update(updates, {
      where: { id }
    });
    if (rowsUpdated === 0) {
      throw new Error('用户不存在');
    }
    return await findUserById(id);
  } catch (error) {
    console.error('更新用户失败:', error);
    throw error;
  }
}

// 删除用户
async function deleteUser(id) {
  try {
    const rowsDeleted = await User.destroy({
      where: { id }
    });
    if (rowsDeleted === 0) {
      throw new Error('用户不存在');
    }
    return true;
  } catch (error) {
    console.error('删除用户失败:', error);
    throw error;
  }
}
```

## 4. 使用 TypeORM

### 4.1 配置 TypeORM

```javascript
// ormconfig.js
module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'mypassword',
  database: 'mydb',
  entities: ['dist/entities/*.js'],
  synchronize: true,
  logging: false,
};

// 或者使用 TypeScript
// ormconfig.ts
import { DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'mypassword',
  database: 'mydb',
  entities: ['dist/entities/*.js'],
  synchronize: true,
  logging: false,
};
```

### 4.2 定义实体

```typescript
// user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false
  })
  name: string;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false
  })
  email: string;

  @Column({
    type: 'integer',
    nullable: true,
    check: 'age >= 0 AND age <= 150'
  })
  age: number;

  @Column({
    type: 'boolean',
    default: true
  })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 4.3 初始化数据库连接

```typescript
// database.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { dataSourceOptions } from './ormconfig';

const AppDataSource = new DataSource({
  ...dataSourceOptions,
  entities: [User],
});

AppDataSource.initialize()
  .then(() => {
    console.log('数据库连接初始化成功');
  })
  .catch((err) => {
    console.error('数据库连接初始化失败:', err);
  });

export { AppDataSource };
```

### 4.4 使用仓库进行 CRUD 操作

```typescript
// user.service.ts
import { AppDataSource } from '../database';
import { User } from '../entities/user.entity';

const userRepository = AppDataSource.getRepository(User);

// 创建用户
async function createUser(userData: Partial<User>): Promise<User> {
  try {
    const user = userRepository.create(userData);
    return await userRepository.save(user);
  } catch (error) {
    console.error('创建用户失败:', error);
    throw error;
  }
}

// 查询所有用户
async function findAllUsers(): Promise<User[]> {
  try {
    return await userRepository.find();
  } catch (error) {
    console.error('查询用户失败:', error);
    throw error;
  }
}

// 根据 ID 查询用户
async function findUserById(id: string): Promise<User | null> {
  try {
    return await userRepository.findOneBy({ id });
  } catch (error) {
    console.error('查询用户失败:', error);
    throw error;
  }
}

// 更新用户
async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  try {
    await userRepository.update(id, updates);
    return await findUserById(id);
  } catch (error) {
    console.error('更新用户失败:', error);
    throw error;
  }
}

// 删除用户
async function deleteUser(id: string): Promise<boolean> {
  try {
    const result = await userRepository.delete(id);
    return result.affected === 1;
  } catch (error) {
    console.error('删除用户失败:', error);
    throw error;
  }
}
```

## 5. PostgreSQL 高级特性

### 5.1 数组类型

PostgreSQL 支持数组类型，在 Node.js 中可以直接使用 JavaScript 数组：

```javascript
// 使用原生驱动
async function insertWithArray() {
  const res = await pool.query(
    'INSERT INTO products(name, tags) VALUES($1, $2) RETURNING *',
    ['笔记本电脑', ['电子', '办公', '便携']]
  );
  console.log('插入的产品:', res.rows[0]);
}

// 使用 Sequelize
const Product = sequelize.define('Product', {
  name: DataTypes.STRING,
  tags: DataTypes.ARRAY(DataTypes.STRING)
});

async function createProductWithTags() {
  const product = await Product.create({
    name: '智能手机',
    tags: ['电子', '通讯', '便携']
  });
  console.log('创建的产品:', product.toJSON());
}
```

### 5.2 JSON 数据类型

PostgreSQL 支持 JSON 和 JSONB 数据类型：

```javascript
// 使用原生驱动
async function insertWithJSON() {
  const userData = {
    profile: {
      firstName: '张三',
      lastName: '李四',
      address: {
        city: '北京',
        district: '朝阳区'
      }
    },
    preferences: { theme: 'dark', notifications: true }
  };

  const res = await pool.query(
    'INSERT INTO users_with_json(name, data) VALUES($1, $2) RETURNING *',
    ['张三', userData]
  );
  console.log('插入的用户:', res.rows[0]);
}

// 使用 Sequelize
const UserWithJSON = sequelize.define('UserWithJSON', {
  name: DataTypes.STRING,
  data: DataTypes.JSONB
});
```

### 5.3 全文搜索

PostgreSQL 内置全文搜索功能：

```javascript
// 创建全文搜索索引
async function createFullTextIndex() {
  await pool.query(
    'CREATE INDEX IF NOT EXISTS products_search_idx ON products USING gin(to_tsvector(\'english\', name || \' \' || description))'
  );
}

// 执行全文搜索
async function searchProducts(query) {
  const res = await pool.query(
    `SELECT * FROM products 
     WHERE to_tsvector('english', name || ' ' || description) @@ plainto_tsquery('english', $1) 
     ORDER BY ts_rank(to_tsvector('english', name || ' ' || description), plainto_tsquery('english', $1)) DESC`,
    [query]
  );
  return res.rows;
}
```

### 5.4 事务

使用事务确保多个操作的原子性：

```javascript
// 使用原生驱动的事务
async function transferFunds(fromAccountId, toAccountId, amount) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // 1. 检查余额
    const balanceResult = await client.query(
      'SELECT balance FROM accounts WHERE id = $1',
      [fromAccountId]
    );
    
    if (balanceResult.rows.length === 0) {
      throw new Error('源账户不存在');
    }
    
    const balance = balanceResult.rows[0].balance;
    if (balance < amount) {
      throw new Error('余额不足');
    }
    
    // 2. 减少源账户余额
    await client.query(
      'UPDATE accounts SET balance = balance - $1 WHERE id = $2',
      [amount, fromAccountId]
    );
    
    // 3. 增加目标账户余额
    await client.query(
      'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
      [amount, toAccountId]
    );
    
    // 4. 记录转账
    await client.query(
      'INSERT INTO transactions(from_account_id, to_account_id, amount) VALUES($1, $2, $3)',
      [fromAccountId, toAccountId, amount]
    );
    
    // 提交事务
    await client.query('COMMIT');
    console.log('转账成功');
    return true;
  } catch (error) {
    // 回滚事务
    await client.query('ROLLBACK');
    console.error('转账失败:', error);
    throw error;
  } finally {
    client.release();
  }
}

// 使用 Sequelize 的事务
async function transferFundsSequelize(fromAccountId, toAccountId, amount) {
  const transaction = await sequelize.transaction();
  
  try {
    // 检查余额
    const fromAccount = await Account.findByPk(fromAccountId, { transaction });
    if (!fromAccount) {
      throw new Error('源账户不存在');
    }
    
    if (fromAccount.balance < amount) {
      throw new Error('余额不足');
    }
    
    // 减少源账户余额
    await Account.update(
      { balance: sequelize.literal(`balance - ${amount}`) },
      { where: { id: fromAccountId }, transaction }
    );
    
    // 增加目标账户余额
    await Account.update(
      { balance: sequelize.literal(`balance + ${amount}`) },
      { where: { id: toAccountId }, transaction }
    );
    
    // 记录转账
    await Transaction.create(
      { fromAccountId, toAccountId, amount },
      { transaction }
    );
    
    // 提交事务
    await transaction.commit();
    console.log('转账成功');
    return true;
  } catch (error) {
    // 回滚事务
    await transaction.rollback();
    console.error('转账失败:', error);
    throw error;
  }
}
```

## 6. 性能优化

### 6.1 索引优化

```sql
-- 创建常用索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_age ON users(age);
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- 创建复合索引
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);

-- 创建部分索引
CREATE INDEX idx_active_users ON users(id) WHERE active = true;

-- 创建唯一索引
CREATE UNIQUE INDEX idx_unique_email ON users(email);
```

### 6.2 查询优化

```javascript
// 优化查询示例
async function optimizedQuery() {
  // 选择需要的列，而不是 SELECT *
  const res = await pool.query(
    'SELECT id, name, email FROM users WHERE age > $1 LIMIT $2 OFFSET $3',
    [18, 10, 0]
  );
  
  return res.rows;
}

// 使用连接池时的查询超时设置
async function queryWithTimeout() {
  const res = await pool.query(
    'SELECT * FROM large_table WHERE created_at > $1',
    [new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)],
    { timeout: 5000 } // 5 秒超时
  );
  
  return res.rows;
}
```

### 6.3 使用连接池优化

```javascript
// 优化的连接池配置
const optimizedPool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'mydb',
  password: 'mypassword',
  port: 5432,
  max: 20, // 根据应用需求和服务器资源调整
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  // 添加错误处理
  error(err, client) {
    console.error('连接错误:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      client.destroy();
    }
  }
});

// 监控连接池
setInterval(() => {
  const poolStatus = optimizedPool.status();
  console.log(`连接池状态: 活跃连接 ${poolStatus.active}, 空闲连接 ${poolStatus.idle}`);
}, 60000);
```

## 7. 安全最佳实践

### 7.1 参数化查询

始终使用参数化查询，避免 SQL 注入：

```javascript
// 安全的参数化查询
async function findUserByName(name) {
  const res = await pool.query(
    'SELECT * FROM users WHERE name = $1',
    [name] // 使用参数数组
  );
  return res.rows;
}

// 不安全的字符串拼接（避免）
async function unsafeFindUser(name) {
  // 不要这样做！可能导致 SQL 注入
  const query = `SELECT * FROM users WHERE name = '${name}'`;
  const res = await pool.query(query);
  return res.rows;
}
```

### 7.2 连接安全

```javascript
const secureClient = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'mydb',
  password: process.env.DB_PASSWORD, // 从环境变量获取密码
  port: 5432,
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync('/path/to/server-certificate.pem')
  }
});
```

### 7.3 最小权限原则

为应用程序创建专用数据库用户，并仅授予必要的权限：

```sql
-- 创建应用程序专用用户
CREATE USER app_user WITH PASSWORD 'secure_password';

-- 仅授予必要的权限
GRANT CONNECT ON DATABASE mydb TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE users TO app_user;
GRANT SELECT, INSERT ON TABLE orders TO app_user;
GRANT USAGE ON SEQUENCE users_id_seq TO app_user;
```

## 8. 常见问题与解决方案

### 8.1 连接问题

**问题**：无法连接到 PostgreSQL 数据库

**解决方案**：
- 检查 PostgreSQL 服务是否正在运行
- 验证主机地址和端口号
- 确认用户名和密码正确
- 检查防火墙设置是否允许连接
- 验证 pg_hba.conf 文件中的认证设置

### 8.2 性能问题

**问题**：查询执行缓慢

**解决方案**：
- 添加适当的索引
- 优化查询语句
- 使用 EXPLAIN 分析查询计划
- 考虑分区表（对于大型表）
- 增加 PostgreSQL 服务器的资源（内存、CPU）

### 8.3 内存泄漏

**问题**：Node.js 应用内存使用不断增长

**解决方案**：
- 确保正确关闭数据库连接
- 使用连接池而不是单个连接
- 定期监控连接池状态
- 使用内存分析工具查找泄漏源

### 8.4 事务死锁

**问题**：事务陷入死锁

**解决方案**：
- 保持事务简短
- 按一致的顺序访问表
- 设置适当的锁超时
- 使用行级锁而不是表级锁
- 监控并分析死锁日志

## 9. 部署与维护

### 9.1 使用环境变量管理配置

```javascript
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
```

### 9.2 日志记录

```javascript
// 添加查询日志
pool.on('query', (query) => {
  console.log(`执行查询: ${query.text}`);
});

// 添加错误日志
pool.on('error', (err, client) => {
  console.error('未处理的数据库错误:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.error('数据库连接已关闭');
  }
});
```

### 9.3 健康检查

```javascript
// 健康检查端点
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    res.status(200).json({ status: 'healthy' });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', error: error.message });
  }
});
```

## 10. 参考资源

- [PostgreSQL 官方文档](https://www.postgresql.org/docs/)
- [node-postgres 官方文档](https://node-postgres.com/)
- [Sequelize 官方文档](https://sequelize.org/master/)
- [TypeORM 官方文档](https://typeorm.io/)
- [PostgreSQL 性能优化指南](https://wiki.postgresql.org/wiki/Performance_Optimization)
- [PostgreSQL 安全最佳实践](https://wiki.postgresql.org/wiki/Securing_%22root%22_accounts)