# SQLite 与 Node.js 集成

## 1. SQLite 基础概念

SQLite 是一个轻量级的嵌入式关系型数据库管理系统，它的设计目标是嵌入式，而且目前已经在很多嵌入式产品中使用，它占用资源非常的低，在嵌入式设备中，可能只需要几百K的内存就够了。SQLite 的主要特点是：

- **无服务器架构**：SQLite 不需要单独的服务器进程或系统，数据库是一个文件
- **零配置**：不需要安装或管理
- **跨平台**：支持 Windows、Linux、Mac OS 等多种操作系统
- **轻量级**：整个数据库引擎库非常小，适合资源受限的环境
- **自包含**：数据库作为单个文件存储，便于备份和传输
- **事务支持**：完全支持 ACID 事务

### 1.1 SQLite 的应用场景

- 移动应用程序（Android、iOS）
- 桌面应用程序的本地数据存储
- 小型 Web 应用程序的开发和测试环境
- 嵌入式系统和 IoT 设备
- 临时数据存储和缓存
- 数据传输和交换格式

## 2. Node.js 中使用 SQLite

### 2.1 安装依赖

```bash
# 基本的 SQLite3 驱动
npm install sqlite3

# 或者使用更好的 Promise 支持的 sqlite
npm install sqlite sqlite3

# 或者使用 ORM 如 Sequelize
npm install sequelize sqlite3

# 或者使用 Prisma（现代 ORM）
npm install prisma --save-dev
```

### 2.2 使用 sqlite3 驱动（回调风格）

```javascript
const sqlite3 = require('sqlite3').verbose();

// 打开数据库连接（如果文件不存在则自动创建）
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('打开数据库出错:', err.message);
  }
  console.log('成功连接到 SQLite 数据库');
});

// 创建表
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  age INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`, (err) => {
  if (err) {
    console.error('创建表出错:', err.message);
  }
  console.log('表创建成功');
});

// 插入数据
db.run('INSERT INTO users (name, email, age) VALUES (?, ?, ?)', ['张三', 'zhangsan@example.com', 25], function(err) {
  if (err) {
    return console.error('插入数据出错:', err.message);
  }
  console.log(`数据插入成功，ID: ${this.lastID}`);
});

// 查询数据
db.all('SELECT * FROM users', [], (err, rows) => {
  if (err) {
    throw err;
  }
  rows.forEach((row) => {
    console.log(row.id + ' - ' + row.name + ' - ' + row.email + ' - ' + row.age);
  });
});

// 关闭数据库连接
function closeDB() {
  db.close((err) => {
    if (err) {
      console.error('关闭数据库出错:', err.message);
    }
    console.log('数据库连接已关闭');
  });
}

// 在应用程序结束时关闭连接
process.on('SIGINT', () => {
  closeDB();
  process.exit();
});
```

### 2.3 使用 sqlite 包（Promise 风格）

```javascript
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

async function setupDatabase() {
  // 打开数据库连接
  const db = await open({
    filename: './database.db',
    driver: sqlite3.Database
  });
  
  // 创建表
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      age INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT,
      user_id INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
  
  return db;
}

async function example() {
  const db = await setupDatabase();
  
  try {
    // 插入用户
    const userId = await db.run(
      'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
      ['李四', 'lisi@example.com', 30]
    );
    console.log(`插入的用户ID: ${userId.lastID}`);
    
    // 查询所有用户
    const users = await db.all('SELECT * FROM users');
    console.log('所有用户:', users);
    
    // 根据ID查询用户
    const user = await db.get('SELECT * FROM users WHERE id = ?', [userId.lastID]);
    console.log('查询的用户:', user);
    
    // 更新用户
    await db.run(
      'UPDATE users SET age = ? WHERE id = ?',
      [31, userId.lastID]
    );
    console.log('用户更新成功');
    
    // 删除用户
    await db.run('DELETE FROM users WHERE id = ?', [userId.lastID]);
    console.log('用户删除成功');
    
  } catch (error) {
    console.error('数据库操作出错:', error);
  } finally {
    // 关闭数据库连接
    await db.close();
    console.log('数据库连接已关闭');
  }
}

example().catch(console.error);
```

### 2.4 使用 Sequelize ORM

```javascript
const { Sequelize, DataTypes } = require('sequelize');

// 创建 Sequelize 实例
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.db', // SQLite 数据库文件路径
  logging: false // 可选：禁用日志记录
});

// 定义用户模型
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
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
  }
}, {
  timestamps: true, // 自动添加 createdAt 和 updatedAt 字段
  tableName: 'users'
});

// 定义文章模型
const Post = sequelize.define('Post', {
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
    type: DataTypes.TEXT
  }
}, {
  timestamps: true,
  tableName: 'posts'
});

// 设置关联
User.hasMany(Post, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});

Post.belongsTo(User, {
  foreignKey: 'userId'
});

async function initSequelize() {
  try {
    // 测试连接
    await sequelize.authenticate();
    console.log('Sequelize 连接成功');
    
    // 同步模型到数据库
    await sequelize.sync({ alter: true });
    console.log('模型同步成功');
    
    return { sequelize, User, Post };
  } catch (error) {
    console.error('初始化 Sequelize 失败:', error);
    throw error;
  }
}

async function sequelizeExample() {
  const { User, Post } = await initSequelize();
  
  try {
    // 创建用户
    const user = await User.create({
      name: '王五',
      email: 'wangwu@example.com',
      age: 28
    });
    console.log('创建的用户:', user.toJSON());
    
    // 创建文章
    const post = await Post.create({
      title: 'SQLite 教程',
      content: '这是一篇关于 SQLite 的教程',
      userId: user.id
    });
    console.log('创建的文章:', post.toJSON());
    
    // 查询用户及其文章
    const userWithPosts = await User.findByPk(user.id, {
      include: Post
    });
    console.log('用户及其文章:', JSON.stringify(userWithPosts, null, 2));
    
    // 查询所有用户
    const allUsers = await User.findAll();
    console.log('所有用户数量:', allUsers.length);
    
    // 更新用户
    await user.update({
      age: 29
    });
    console.log('更新后的用户年龄:', user.age);
    
  } catch (error) {
    console.error('Sequelize 操作出错:', error);
  } finally {
    // 关闭连接
    await sequelize.close();
    console.log('Sequelize 连接已关闭');
  }
}

sequelizeExample().catch(console.error);
```

## 3. SQLite 高级功能

### 3.1 事务处理

SQLite 支持事务，可以确保多个操作的原子性：

```javascript
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

async function transactionExample() {
  const db = await open({
    filename: './database.db',
    driver: sqlite3.Database
  });
  
  try {
    // 开始事务
    await db.run('BEGIN TRANSACTION');
    
    // 执行多个操作
    await db.run('INSERT INTO accounts (name, balance) VALUES (?, ?)', ['账户A', 1000]);
    await db.run('INSERT INTO accounts (name, balance) VALUES (?, ?)', ['账户B', 500]);
    
    // 模拟转账操作
    await db.run('UPDATE accounts SET balance = balance - ? WHERE name = ?', [200, '账户A']);
    await db.run('UPDATE accounts SET balance = balance + ? WHERE name = ?', [200, '账户B']);
    
    // 提交事务
    await db.run('COMMIT');
    console.log('事务提交成功');
    
  } catch (error) {
    // 回滚事务
    await db.run('ROLLBACK');
    console.error('事务失败，已回滚:', error);
  } finally {
    await db.close();
  }
}

// 使用 Sequelize 的事务
async function sequelizeTransactionExample() {
  const { sequelize, User } = await initSequelize();
  
  try {
    // 开始事务
    const result = await sequelize.transaction(async (t) => {
      // 在事务中创建用户
      const user1 = await User.create({
        name: '事务用户1',
        email: 'transaction1@example.com',
        age: 25
      }, { transaction: t });
      
      const user2 = await User.create({
        name: '事务用户2',
        email: 'transaction2@example.com',
        age: 30
      }, { transaction: t });
      
      // 如果有错误会自动回滚
      // 如果一切正常，会自动提交
      return { user1, user2 };
    });
    
    console.log('事务成功，创建了两个用户');
    
  } catch (error) {
    console.error('事务失败，已回滚:', error);
  } finally {
    await sequelize.close();
  }
}
```

### 3.2 索引优化

虽然 SQLite 是轻量级的，但适当的索引仍然可以提高查询性能：

```javascript
// 创建索引
async function createIndexes(db) {
  await db.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_name ON users(name);
    CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
  `);
  console.log('索引创建成功');
}

// 查看索引信息
async function listIndexes(db) {
  const indexes = await db.all(
    "SELECT name, tbl_name, sql FROM sqlite_master WHERE type='index'"
  );
  console.log('数据库索引:', indexes);
}
```

### 3.3 视图

SQLite 支持视图，可以创建复杂查询的虚拟表：

```javascript
// 创建视图
async function createViews(db) {
  await db.exec(`
    CREATE VIEW IF NOT EXISTS user_post_counts AS
    SELECT u.id, u.name, u.email, COUNT(p.id) as post_count
    FROM users u
    LEFT JOIN posts p ON u.id = p.user_id
    GROUP BY u.id;
  `);
  console.log('视图创建成功');
}

// 使用视图
async function useView(db) {
  const result = await db.all('SELECT * FROM user_post_counts');
  console.log('用户发帖统计:', result);
}
```

### 3.4 触发器

SQLite 支持触发器，可以在特定事件发生时自动执行操作：

```javascript
// 创建触发器
async function createTriggers(db) {
  await db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_user_timestamp 
    AFTER UPDATE ON users
    BEGIN
      UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;
    
    CREATE TRIGGER IF NOT EXISTS delete_related_posts
    BEFORE DELETE ON users
    BEGIN
      DELETE FROM posts WHERE user_id = OLD.id;
    END;
  `);
  console.log('触发器创建成功');
}

// 列出所有触发器
async function listTriggers(db) {
  const triggers = await db.all(
    "SELECT name, tbl_name, sql FROM sqlite_master WHERE type='trigger'"
  );
  console.log('数据库触发器:', triggers);
}
```

## 4. SQLite 与 Node.js 的最佳实践

### 4.1 连接池管理

对于高流量应用，使用连接池可以提高性能：

```javascript
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

class SQLitePool {
  constructor(dbPath, poolSize = 5) {
    this.dbPath = dbPath;
    this.poolSize = poolSize;
    this.pool = [];
    this.waitingQueue = [];
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;
    
    // 创建连接池
    for (let i = 0; i < this.poolSize; i++) {
      const db = await open({
        filename: this.dbPath,
        driver: sqlite3.Database
      });
      this.pool.push({
        db,
        available: true
      });
    }
    
    this.isInitialized = true;
    console.log(`SQLite 连接池初始化完成，大小: ${this.poolSize}`);
  }

  async getConnection() {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    // 查找可用连接
    const connection = this.pool.find(conn => conn.available);
    
    if (connection) {
      connection.available = false;
      return connection.db;
    }
    
    // 如果没有可用连接，加入等待队列
    return new Promise((resolve) => {
      this.waitingQueue.push(resolve);
    });
  }

  releaseConnection(db) {
    const connection = this.pool.find(conn => conn.db === db);
    
    if (connection) {
      connection.available = true;
      
      // 如果有等待的请求，分配连接
      if (this.waitingQueue.length > 0) {
        const resolve = this.waitingQueue.shift();
        connection.available = false;
        resolve(connection.db);
      }
    }
  }

  async closeAll() {
    for (const conn of this.pool) {
      await conn.db.close();
    }
    this.pool = [];
    this.waitingQueue = [];
    this.isInitialized = false;
    console.log('所有 SQLite 连接已关闭');
  }
}

// 使用连接池
async function usePool() {
  const pool = new SQLitePool('./database.db', 3);
  await pool.initialize();
  
  // 获取连接并执行查询
  async function runQuery() {
    const db = await pool.getConnection();
    try {
      const result = await db.all('SELECT * FROM users');
      return result;
    } finally {
      pool.releaseConnection(db);
    }
  }
  
  // 并行执行多个查询
  const results = await Promise.all([runQuery(), runQuery(), runQuery()]);
  console.log('并行查询结果数量:', results.map(r => r.length));
  
  // 应用结束时关闭连接池
  process.on('SIGINT', () => {
    pool.closeAll();
    process.exit();
  });
}
```

### 4.2 查询优化

```javascript
// 优化查询示例
async function optimizedQueries(db) {
  // 1. 只选择需要的列
  const result1 = await db.all('SELECT id, name FROM users');
  
  // 2. 使用索引列进行过滤
  const result2 = await db.all('SELECT * FROM users WHERE email = ?', ['user@example.com']);
  
  // 3. 使用 LIMIT 限制结果数量
  const result3 = await db.all('SELECT * FROM users LIMIT 10');
  
  // 4. 使用参数化查询防止 SQL 注入
  const searchTerm = '张';
  const result4 = await db.all(
    'SELECT * FROM users WHERE name LIKE ?', 
    [`%${searchTerm}%`]
  );
  
  // 5. 使用 EXPLAIN 分析查询性能
  const explainResult = await db.all('EXPLAIN QUERY PLAN SELECT * FROM users WHERE email = ?', ['user@example.com']);
  console.log('查询计划:', explainResult);
}
```

### 4.3 错误处理

```javascript
// 统一的错误处理
async function safeOperation(db, operation) {
  try {
    return await operation(db);
  } catch (error) {
    // 根据错误类型进行处理
    if (error.code === 'SQLITE_CONSTRAINT') {
      console.error('约束错误（可能是唯一键冲突）:', error.message);
      throw new Error('数据已存在');
    } else if (error.code === 'SQLITE_ERROR') {
      console.error('SQL 错误:', error.message);
      throw new Error('数据库操作失败');
    } else {
      console.error('未知错误:', error);
      throw error;
    }
  }
}

// 使用统一错误处理
async function useSafeOperation() {
  const db = await open({
    filename: './database.db',
    driver: sqlite3.Database
  });
  
  try {
    const result = await safeOperation(db, async (db) => {
      // 可能会抛出错误的操作
      return await db.run('INSERT INTO users (name, email) VALUES (?, ?)', ['张三', 'zhangsan@example.com']);
    });
    console.log('操作成功');
  } catch (error) {
    console.log('捕获到错误:', error.message);
  } finally {
    await db.close();
  }
}
```

### 4.4 数据迁移

对于应用程序升级，需要管理数据库架构变更：

```javascript
// 简单的数据迁移系统
class MigrationManager {
  constructor(db) {
    this.db = db;
  }

  async initialize() {
    // 创建迁移表
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE UNIQUE INDEX IF NOT EXISTS idx_migrations_name ON migrations(name);
    `);
    console.log('迁移表初始化完成');
  }

  async isMigrationApplied(name) {
    const result = await this.db.get(
      'SELECT COUNT(*) as count FROM migrations WHERE name = ?',
      [name]
    );
    return result.count > 0;
  }

  async applyMigration(name, sql) {
    if (await this.isMigrationApplied(name)) {
      console.log(`迁移 '${name}' 已经应用，跳过`);
      return false;
    }

    try {
      // 开始事务
      await this.db.run('BEGIN TRANSACTION');
      
      // 执行迁移 SQL
      await this.db.exec(sql);
      
      // 记录迁移
      await this.db.run(
        'INSERT INTO migrations (name) VALUES (?)',
        [name]
      );
      
      // 提交事务
      await this.db.run('COMMIT');
      
      console.log(`迁移 '${name}' 应用成功`);
      return true;
    } catch (error) {
      // 回滚事务
      await this.db.run('ROLLBACK');
      console.error(`迁移 '${name}' 应用失败:`, error);
      throw error;
    }
  }
}

// 使用迁移管理器
async function runMigrations() {
  const db = await open({
    filename: './database.db',
    driver: sqlite3.Database
  });
  
  const migrationManager = new MigrationManager(db);
  await migrationManager.initialize();
  
  // 定义迁移
  const migrations = [
    {
      name: '20230101_create_users_table',
      sql: `
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `
    },
    {
      name: '20230102_add_age_to_users',
      sql: `
        ALTER TABLE users ADD COLUMN age INTEGER;
      `
    },
    {
      name: '20230103_create_posts_table',
      sql: `
        CREATE TABLE IF NOT EXISTS posts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          content TEXT,
          user_id INTEGER,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
      `
    }
  ];
  
  // 应用所有迁移
  for (const migration of migrations) {
    await migrationManager.applyMigration(migration.name, migration.sql);
  }
  
  await db.close();
}
```

## 5. SQLite 安全最佳实践

### 5.1 参数化查询防止 SQL 注入

```javascript
// 安全的参数化查询
async function safeQuery(db, username) {
  // 安全：使用参数
  const user = await db.get(
    'SELECT * FROM users WHERE username = ?',
    [username]
  );
  
  // 不安全：字符串拼接（避免）
  // const unsafeQuery = `SELECT * FROM users WHERE username = '${username}'`;
  // 这会允许 SQL 注入攻击，例如：username = "' OR 1=1 --"
  
  return user;
}

// 使用 ORM 时的安全操作
async function safeOrmOperation(User, email) {
  // Sequelize 会自动处理参数化
  const user = await User.findOne({
    where: { email }
  });
  
  return user;
}
```

### 5.2 加密敏感数据

SQLite 数据库文件没有内置加密，需要对敏感数据进行加密：

```javascript
const crypto = require('crypto');

// 加密配置
const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = process.env.ENCRYPTION_KEY || 'your-secret-key'; // 生产环境应使用环境变量
const IV_LENGTH = 16;

// 加密函数
function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY, 'hex'), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// 解密函数
function decrypt(text) {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(SECRET_KEY, 'hex'), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// 加密敏感数据示例
async function storeSensitiveData(db, userId, creditCard) {
  const encryptedCard = encrypt(creditCard);
  
  await db.run(
    'UPDATE users SET payment_info = ? WHERE id = ?',
    [encryptedCard, userId]
  );
}

// 解密敏感数据示例
async function getSensitiveData(db, userId) {
  const user = await db.get('SELECT payment_info FROM users WHERE id = ?', [userId]);
  if (user && user.payment_info) {
    return decrypt(user.payment_info);
  }
  return null;
}
```

### 5.3 文件权限和备份

```javascript
// 使用 Node.js 监控和设置文件权限
const fs = require('fs').promises;
const path = require('path');

async function secureDatabaseFile(dbPath) {
  try {
    // 检查文件是否存在
    const stats = await fs.stat(dbPath);
    
    // 在 Unix 系统上设置权限（仅所有者可读写）
    if (process.platform !== 'win32') {
      await fs.chmod(dbPath, 0o600);
      console.log(`设置了数据库文件 ${dbPath} 的权限为 600`);
    }
    
    // 自动备份
    await backupDatabase(dbPath);
  } catch (error) {
    console.error('设置数据库文件安全权限失败:', error);
  }
}

async function backupDatabase(dbPath) {
  const backupDir = path.join(path.dirname(dbPath), 'backups');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(backupDir, `database-backup-${timestamp}.db`);
  
  try {
    // 确保备份目录存在
    await fs.mkdir(backupDir, { recursive: true });
    
    // 复制数据库文件
    await fs.copyFile(dbPath, backupPath);
    console.log(`数据库已备份到 ${backupPath}`);
    
    // 清理旧备份（保留最近 5 个）
    await cleanupOldBackups(backupDir, 5);
  } catch (error) {
    console.error('数据库备份失败:', error);
  }
}

async function cleanupOldBackups(backupDir, keepCount) {
  try {
    const files = await fs.readdir(backupDir);
    const backupFiles = files
      .filter(file => file.startsWith('database-backup-') && file.endsWith('.db'))
      .map(file => ({
        name: file,
        path: path.join(backupDir, file),
        stats: fs.statSync(path.join(backupDir, file))
      }))
      .sort((a, b) => b.stats.mtimeMs - a.stats.mtimeMs);
    
    // 删除超出保留数量的旧备份
    for (let i = keepCount; i < backupFiles.length; i++) {
      await fs.unlink(backupFiles[i].path);
      console.log(`已删除旧备份: ${backupFiles[i].name}`);
    }
  } catch (error) {
    console.error('清理旧备份失败:', error);
  }
}
```

## 6. 常见问题与解决方案

### 6.1 数据库锁定问题

**问题**：SQLite 数据库锁定错误（SQLITE_BUSY 或 SQLITE_LOCKED）

**解决方案**：

```javascript
// 处理数据库锁定问题
async function handleDatabaseLocking() {
  const db = await open({
    filename: './database.db',
    driver: sqlite3.Database,
    // 设置超时和重试
    busyTimeout: 3000 // 3 秒超时
  });
  
  // 重试机制
  async function withRetry(operation, maxRetries = 3) {
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        if (error.code === 'SQLITE_BUSY' || error.code === 'SQLITE_LOCKED') {
          console.log(`数据库锁定，${i + 1}秒后重试...`);
          lastError = error;
          // 指数退避
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        } else {
          throw error;
        }
      }
    }
    
    throw new Error(`多次重试后仍无法获取数据库锁: ${lastError.message}`);
  }
  
  // 使用重试机制执行操作
  const result = await withRetry(async () => {
    return await db.run('UPDATE users SET name = ? WHERE id = ?', ['新名称', 1]);
  });
  
  await db.close();
}
```

### 6.2 性能问题

**问题**：SQLite 数据库随着数据增长性能下降

**解决方案**：

```javascript
// 性能优化示例
async function optimizeDatabasePerformance(db) {
  // 1. 运行 VACUUM 命令重建数据库文件
  await db.run('VACUUM');
  console.log('数据库已执行 VACUUM 命令，优化空间使用');
  
  // 2. 分析表以更新统计信息
  await db.run('ANALYZE');
  console.log('数据库已执行 ANALYZE 命令，更新统计信息');
  
  // 3. 检查索引使用情况
  const queryPlans = await db.all(`
    EXPLAIN QUERY PLAN SELECT * FROM users WHERE email = 'example@example.com'
  `);
  console.log('查询计划:', queryPlans);
  
  // 4. 优化大型查询
  const largeResult = await db.all(
    'SELECT id, name FROM users LIMIT 100',
    { maxRows: 100 } // 限制结果集大小
  );
  
  // 5. 使用事务批量操作
  await db.run('BEGIN TRANSACTION');
  try {
    // 批量插入或更新操作
    // ...
    await db.run('COMMIT');
  } catch (error) {
    await db.run('ROLLBACK');
    throw error;
  }
}
```

### 6.3 内存使用问题

**问题**：处理大型结果集时内存占用过高

**解决方案**：

```javascript
// 流式处理大型结果集
function streamLargeResults(db, query, params = []) {
  return new Promise((resolve, reject) => {
    const results = [];
    const batchSize = 1000;
    let currentIndex = 0;
    
    function processBatch() {
      db.all(
        `${query} LIMIT ? OFFSET ?`,
        [...params, batchSize, currentIndex],
        (error, rows) => {
          if (error) {
            return reject(error);
          }
          
          if (rows.length === 0) {
            // 没有更多数据
            return resolve(results);
          }
          
          // 处理当前批次
          rows.forEach(row => {
            // 处理每行数据
            results.push(row);
            
            // 可以在这里进行流式处理，如写入文件等
            // 而不是将所有数据保存在内存中
          });
          
          // 移动到下一批
          currentIndex += batchSize;
          console.log(`已处理 ${currentIndex} 行数据`);
          
          // 继续处理下一批
          setImmediate(processBatch);
        }
      );
    }
    
    // 开始处理
    processBatch();
  });
}

// 使用流式处理
async function processLargeDataset() {
  const db = new sqlite3.Database('./large_database.db');
  
  try {
    console.log('开始处理大型数据集...');
    const startTime = Date.now();
    
    await streamLargeResults(db, 'SELECT * FROM large_table');
    
    const endTime = Date.now();
    console.log(`处理完成，耗时 ${(endTime - startTime) / 1000} 秒`);
  } catch (error) {
    console.error('处理大型数据集出错:', error);
  } finally {
    db.close();
  }
}
```

## 7. 部署与扩展

### 7.1 使用环境变量配置

```javascript
// 使用环境变量配置 SQLite
const path = require('path');
require('dotenv').config();

const dbPath = process.env.SQLITE_DB_PATH || path.join(__dirname, 'database.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('无法打开数据库:', err.message);
    process.exit(1);
  }
  console.log(`成功连接到 SQLite 数据库: ${dbPath}`);
});
```

### 7.2 监控数据库大小和性能

```javascript
// 数据库监控工具
const fs = require('fs').promises;

class DatabaseMonitor {
  constructor(dbPath) {
    this.dbPath = dbPath;
    this.monitoringInterval = null;
  }
  
  async getDatabaseInfo() {
    try {
      // 获取数据库文件大小
      const stats = await fs.stat(this.dbPath);
      const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
      
      // 获取表信息
      const db = await open({
        filename: this.dbPath,
        driver: sqlite3.Database
      });
      
      const tables = await db.all(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
      );
      
      // 获取每个表的行数
      const tableStats = [];
      for (const table of tables) {
        const countResult = await db.get(`SELECT COUNT(*) as count FROM ${table.name}`);
        tableStats.push({
          name: table.name,
          rowCount: countResult.count
        });
      }
      
      await db.close();
      
      return {
        fileSize: `${fileSizeInMB} MB`,
        tables: tableStats,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('获取数据库信息失败:', error);
      return null;
    }
  }
  
  startMonitoring(intervalMs = 60000) { // 默认每分钟
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    
    this.monitoringInterval = setInterval(async () => {
      const info = await this.getDatabaseInfo();
      console.log('数据库监控信息:', info);
      
      // 可以将监控信息发送到日志系统或监控服务
    }, intervalMs);
    
    console.log(`数据库监控已启动，间隔 ${intervalMs / 1000} 秒`);
  }
  
  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log('数据库监控已停止');
    }
  }
}

// 使用监控工具
function setupMonitoring() {
  const monitor = new DatabaseMonitor('./database.db');
  monitor.startMonitoring();
  
  // 应用结束时停止监控
  process.on('SIGINT', () => {
    monitor.stopMonitoring();
    process.exit();
  });
}
```

## 8. 参考资源

- [SQLite 官方文档](https://www.sqlite.org/docs.html)
- [SQLite Node.js 驱动文档](https://github.com/mapbox/node-sqlite3)
- [SQLite 教程](https://www.sqlitetutorial.net/)
- [SQLite 性能优化](https://www.sqlite.org/optoverview.html)
- [SQLite 安全指南](https://www.sqlite.org/security.html)
- [Sequelize SQLite 文档](https://sequelize.org/master/manual/dialects.html#sqlite)