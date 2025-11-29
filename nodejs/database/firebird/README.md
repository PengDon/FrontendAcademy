# Firebird 数据库与 Node.js 集成指南

## 1. Firebird 简介

Firebird 是一个开源的关系型数据库管理系统(RDBMS)，它源自 Borland 的 InterBase 6.0，具有高度兼容性和稳定性。

### 1.1 主要特点

- **开源与自由**: 完全开源，基于 IDPL (InterBase Public License) 许可
- **跨平台**: 支持 Windows, Linux, macOS, 各种 UNIX 变体
- **轻量级**: 核心引擎占用资源少，适合嵌入式应用和小型服务器
- **企业级特性**: 支持事务、存储过程、触发器、视图、外键约束等
- **高并发性能**: 采用多版本并发控制 (MVCC)，减少锁争用
- **可靠的事务处理**: 支持 ACID 事务属性
- **完整的 SQL 支持**: 符合 SQL-92/SQL-99 标准
- **嵌入式模式**: 可以作为嵌入式数据库使用，无需独立服务器

### 1.2 与其他数据库的比较

| 特性 | Firebird | PostgreSQL | MySQL | SQLite |
|------|----------|------------|-------|--------|
| 开源许可 | IDPL | PostgreSQL | GPL | Public Domain |
| 性能 | 优秀的读写性能 | 强大的复杂查询性能 | 良好的整体性能 | 轻量级但功能有限 |
| 资源消耗 | 低 | 中等至高 | 中低 | 极低 |
| 扩展性 | 支持分布式数据库 | 强大的扩展性 | 良好的扩展性 | 有限的扩展性 |
| 数据完整性 | 强 | 非常强 | 中强 | 基本支持 |
| 适用场景 | 中小型应用、嵌入式 | 大型应用、数据仓库 | Web应用、中小型系统 | 嵌入式应用、移动应用 |

## 2. Node.js 与 Firebird 集成

### 2.1 安装驱动

Firebird 有几个 Node.js 驱动可供选择。最常用的是 `node-firebird` 和 `node-firebird-driver-native`。

```bash
# 安装 node-firebird 驱动
npm install node-firebird

# 或者安装 native 驱动
npm install node-firebird-driver-native
```

### 2.2 基本连接

#### 使用 node-firebird

```javascript
// firebird-connection.js
const Firebird = require('node-firebird');

// 连接配置
const options = {
  host: 'localhost',
  port: 3050,
  database: 'C:\\data\\testdb.fdb', // Windows 路径格式
  // database: '/data/testdb.fdb', // Linux/macOS 路径格式
  user: 'SYSDBA',
  password: 'masterkey',
  lowercase_keys: false, // 设置为 true 可将列名转换为小写
  role: null, // 可选，Firebird 角色
  pageSize: 4096 // 可选，数据库页面大小
};

// 创建连接池
const pool = Firebird.pool(5, options); // 最大连接数为 5

// 从连接池获取连接
function getConnection(callback) {
  pool.get((err, db) => {
    if (err) {
      return callback(err);
    }
    callback(null, db);
  });
}

// 查询示例
function queryExample() {
  getConnection((err, db) => {
    if (err) {
      console.error('连接错误:', err);
      return;
    }

    // 执行查询
    db.query('SELECT * FROM users', (err, result) => {
      // 完成后释放连接回池中
      db.detach();

      if (err) {
        console.error('查询错误:', err);
        return;
      }

      console.log('查询结果:', result);
    });
  });
}

// 事务示例
function transactionExample() {
  getConnection((err, db) => {
    if (err) {
      console.error('连接错误:', err);
      return;
    }

    // 开始事务
    db.transaction(Firebird.ISOLATION_READ_COMMITTED, (err, transaction) => {
      if (err) {
        console.error('事务开始错误:', err);
        db.detach();
        return;
      }

      // 执行事务内的操作
      transaction.query(
        "INSERT INTO users (name, email) VALUES(?, ?)",
        ['John Doe', 'john@example.com'],
        (err) => {
          if (err) {
            // 出错时回滚
            transaction.rollback(() => {
              console.error('事务回滚:', err);
              db.detach();
            });
            return;
          }

          // 提交事务
          transaction.commit((err) => {
            if (err) {
              console.error('事务提交错误:', err);
            } else {
              console.log('事务提交成功');
            }
            db.detach();
          });
        }
      );
    });
  });
}

// 使用示例
// queryExample();
// transactionExample();

module.exports = {
  getConnection,
  pool
};
```

#### 使用 node-firebird-driver-native

```javascript
// firebird-native-connection.js
const { getDefaultLibraryFileName, createConnection } = require('node-firebird-driver-native');

// 配置 Firebird 客户端库路径
const lib = getDefaultLibraryFileName(); // 自动检测系统上的 Firebird 库

// 连接配置
const options = {
  host: 'localhost',
  port: 3050,
  database: 'C:\\data\\testdb.fdb', // Windows 路径格式
  // database: '/data/testdb.fdb', // Linux/macOS 路径格式
  user: 'SYSDBA',
  password: 'masterkey',
  role: null, // 可选
  charset: 'UTF8' // 可选，连接字符集
};

// 异步连接示例
async function connectToDatabase() {
  try {
    // 创建连接
    const connection = await createConnection(options);
    
    // 连接到数据库
    await connection.connect();
    console.log('连接成功');
    
    return connection;
  } catch (err) {
    console.error('连接错误:', err);
    throw err;
  }
}

// 查询示例
async function queryExample() {
  let connection = null;
  
  try {
    connection = await connectToDatabase();
    
    // 创建语句
    const statement = await connection.prepare('SELECT * FROM users');
    
    try {
      // 执行查询
      const resultSet = await statement.executeQuery();
      
      try {
        // 处理结果
        const rows = [];
        while (await resultSet.fetch()) {
          rows.push(resultSet.getCurrentValues());
        }
        
        console.log('查询结果:', rows);
        return rows;
      } finally {
        // 关闭结果集
        await resultSet.close();
      }
    } finally {
      // 关闭语句
      await statement.close();
    }
  } catch (err) {
    console.error('查询错误:', err);
    throw err;
  } finally {
    // 关闭连接
    if (connection) {
      await connection.disconnect();
    }
  }
}

// 事务示例
async function transactionExample() {
  let connection = null;
  
  try {
    connection = await connectToDatabase();
    
    // 开始事务
    const transaction = await connection.startTransaction();
    
    try {
      // 在事务中执行操作
      const statement = await transaction.prepare(
        'INSERT INTO users (name, email) VALUES(?, ?)'
      );
      
      try {
        await statement.execute(['John Doe', 'john@example.com']);
        await statement.execute(['Jane Smith', 'jane@example.com']);
        
        // 提交事务
        await transaction.commit();
        console.log('事务提交成功');
      } finally {
        await statement.close();
      }
    } catch (err) {
      // 出错时回滚事务
      await transaction.rollback();
      console.error('事务回滚:', err);
      throw err;
    }
  } finally {
    // 关闭连接
    if (connection) {
      await connection.disconnect();
    }
  }
}

// 使用示例
// queryExample().catch(console.error);
// transactionExample().catch(console.error);

module.exports = {
  connectToDatabase,
  queryExample,
  transactionExample
};
```

### 2.3 连接池管理

在生产环境中，建议使用连接池来管理数据库连接，以提高性能和资源利用率。

```javascript
// firebird-pool.js
const Firebird = require('node-firebird');

// 连接池配置
const poolConfig = {
  min: 2, // 最小连接数
  max: 10, // 最大连接数
  timeout: 30000, // 连接超时时间（毫秒）
  acquireTimeoutMillis: 30000 // 获取连接超时时间
};

// 数据库连接配置
const dbOptions = {
  host: 'localhost',
  port: 3050,
  database: 'C:\\data\\testdb.fdb',
  user: 'SYSDBA',
  password: 'masterkey',
  lowercase_keys: true,
  role: null,
  pageSize: 4096
};

// 创建自定义连接池管理器
class FirebirdPoolManager {
  constructor(options, poolOptions) {
    this.options = options;
    this.poolOptions = poolOptions;
    this.pool = Firebird.pool(poolOptions.max, options);
    this.activeConnections = 0;
    this.waitQueue = [];
    
    // 定期清理空闲连接
    this.cleanupInterval = setInterval(() => this.cleanupIdleConnections(), 60000);
  }

  // 获取连接
  getConnection() {
    return new Promise((resolve, reject) => {
      // 检查连接是否已达到最大限制
      if (this.activeConnections >= this.poolOptions.max) {
        // 如果设置了等待队列，将请求加入队列
        if (this.poolOptions.waitQueue !== false) {
          const timeoutId = setTimeout(() => {
            // 从队列中移除该请求
            this.waitQueue = this.waitQueue.filter(item => item.resolve !== resolve);
            reject(new Error('Connection request timed out'));
          }, this.poolOptions.acquireTimeoutMillis || 30000);
          
          this.waitQueue.push({ resolve, reject, timeoutId });
          return;
        } else {
          reject(new Error('Connection pool exhausted'));
          return;
        }
      }

      this.pool.get((err, db) => {
        if (err) {
          return reject(err);
        }

        this.activeConnections++;
        
        // 包装原始的 detach 方法，以便跟踪连接数量
        const originalDetach = db.detach;
        db.detach = () => {
          originalDetach.call(db);
          this.activeConnections--;
          this.processWaitQueue();
        };

        resolve(db);
      });
    });
  }

  // 处理等待队列中的请求
  processWaitQueue() {
    if (this.waitQueue.length === 0) return;
    
    const nextRequest = this.waitQueue.shift();
    clearTimeout(nextRequest.timeoutId);
    
    // 立即尝试获取新连接
    this.getConnection().then(nextRequest.resolve).catch(nextRequest.reject);
  }

  // 清理空闲连接
  cleanupIdleConnections() {
    // node-firebird 的 pool 本身已经有清理机制
    // 这里可以添加额外的监控或日志记录
    console.log(`当前活动连接数: ${this.activeConnections}`);
  }

  // 关闭连接池
  destroy() {
    clearInterval(this.cleanupInterval);
    
    // 关闭所有队列中的请求
    this.waitQueue.forEach(request => {
      clearTimeout(request.timeoutId);
      request.reject(new Error('Connection pool destroyed'));
    });
    this.waitQueue = [];

    // 销毁连接池
    if (this.pool && typeof this.pool.destroy === 'function') {
      this.pool.destroy();
    }
    
    console.log('连接池已关闭');
  }
}

// 创建全局连接池实例
const poolManager = new FirebirdPoolManager(dbOptions, poolConfig);

// 使用示例
async function exampleWithPool() {
  try {
    // 从池中获取连接
    const db = await poolManager.getConnection();
    
    try {
      // 执行查询
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM users', (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result);
        });
      });
    } finally {
      // 释放连接回池中
      db.detach();
    }
  } catch (err) {
    console.error('使用连接池时出错:', err);
    throw err;
  }
}

// 应用关闭时清理
process.on('SIGINT', () => {
  poolManager.destroy();
  process.exit(0);
});

module.exports = {
  poolManager,
  exampleWithPool
};
```

## 3. 核心数据操作

### 3.1 创建数据库

在 Firebird 中，可以使用命令行工具或通过代码创建数据库。

```javascript
// create-database.js
const Firebird = require('node-firebird');

// 创建新数据库
function createDatabase() {
  return new Promise((resolve, reject) => {
    // 数据库路径必须使用双反斜杠（Windows）或正斜杠（Linux/macOS）
    const dbPath = 'C:\\data\\newdb.fdb'; // Windows 路径
    // const dbPath = '/data/newdb.fdb'; // Linux/macOS 路径
    
    // 创建数据库的参数
    const options = {
      host: 'localhost',
      port: 3050,
      database: dbPath,
      user: 'SYSDBA',
      password: 'masterkey',
      pageSize: 8192, // 页面大小 (4096, 8192, 16384)
      charset: 'UTF8' // 字符集
    };

    Firebird.create(options, (err, database) => {
      if (err) {
        return reject(err);
      }

      console.log(`数据库 ${dbPath} 已成功创建`);
      
      // 关闭数据库连接
      database.detach();
      resolve(dbPath);
    });
  });
}

// 初始化数据库结构
async function initializeDatabase() {
  const { getConnection } = require('./firebird-connection');
  
  return new Promise((resolve, reject) => {
    getConnection((err, db) => {
      if (err) {
        return reject(err);
      }

      // 创建表和初始化数据的SQL语句
      const sqlStatements = [
        // 创建用户表
        `CREATE TABLE users (
          id INTEGER PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) NOT NULL UNIQUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          active BOOLEAN DEFAULT TRUE
        )`,
        
        // 创建产品表
        `CREATE TABLE products (
          id INTEGER PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          description BLOB SUB_TYPE TEXT,
          price DECIMAL(10, 2) NOT NULL,
          stock INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        
        // 创建订单表
        `CREATE TABLE orders (
          id INTEGER PRIMARY KEY,
          user_id INTEGER NOT NULL,
          order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          total_amount DECIMAL(10, 2) NOT NULL,
          status VARCHAR(20) DEFAULT 'PENDING',
          FOREIGN KEY (user_id) REFERENCES users(id)
        )`,
        
        // 创建订单详情表
        `CREATE TABLE order_details (
          id INTEGER PRIMARY KEY,
          order_id INTEGER NOT NULL,
          product_id INTEGER NOT NULL,
          quantity INTEGER NOT NULL,
          price DECIMAL(10, 2) NOT NULL,
          FOREIGN KEY (order_id) REFERENCES orders(id),
          FOREIGN KEY (product_id) REFERENCES products(id)
        )`,
        
        // 创建生成器（用于自动递增ID）
        `CREATE GENERATOR gen_user_id`,
        `CREATE GENERATOR gen_product_id`,
        `CREATE GENERATOR gen_order_id`,
        `CREATE GENERATOR gen_order_detail_id`,
        
        // 创建触发器（用于自动递增ID）
        `SET TERM ^ ;
        CREATE TRIGGER trg_users_bi FOR users
        ACTIVE BEFORE INSERT POSITION 0
        AS
        BEGIN
          NEW.id = GEN_ID(gen_user_id, 1);
        END^`,
        
        `CREATE TRIGGER trg_products_bi FOR products
        ACTIVE BEFORE INSERT POSITION 0
        AS
        BEGIN
          NEW.id = GEN_ID(gen_product_id, 1);
        END^`,
        
        `CREATE TRIGGER trg_orders_bi FOR orders
        ACTIVE BEFORE INSERT POSITION 0
        AS
        BEGIN
          NEW.id = GEN_ID(gen_order_id, 1);
        END^`,
        
        `CREATE TRIGGER trg_order_details_bi FOR order_details
        ACTIVE BEFORE INSERT POSITION 0
        AS
        BEGIN
          NEW.id = GEN_ID(gen_order_detail_id, 1);
        END^`,
        
        `SET TERM ; ^`
      ];

      // 依次执行SQL语句
      let currentStatement = 0;
      
      function executeNext() {
        if (currentStatement >= sqlStatements.length) {
          db.detach();
          console.log('数据库初始化完成');
          return resolve();
        }

        const sql = sqlStatements[currentStatement];
        console.log(`执行SQL: ${sql.substring(0, 50)}...`);
        
        db.query(sql, (err) => {
          if (err) {
            console.error(`SQL执行错误: ${err.message}`);
            db.detach();
            return reject(err);
          }

          currentStatement++;
          executeNext();
        });
      }

      executeNext();
    });
  });
}

// 使用示例
async function setupNewDatabase() {
  try {
    // 创建数据库
    await createDatabase();
    
    // 初始化数据库结构
    await initializeDatabase();
    
    console.log('数据库创建和初始化成功');
  } catch (error) {
    console.error('数据库设置失败:', error);
    throw error;
  }
}

// setupNewDatabase().catch(console.error);

module.exports = {
  createDatabase,
  initializeDatabase,
  setupNewDatabase
};
```

### 3.2 插入数据

```javascript
// insert-data.js
const { getConnection } = require('./firebird-connection');

// 插入单条数据
function insertUser(user) {
  return new Promise((resolve, reject) => {
    getConnection((err, db) => {
      if (err) {
        return reject(err);
      }

      db.transaction(Firebird.ISOLATION_READ_COMMITTED, (err, transaction) => {
        if (err) {
          db.detach();
          return reject(err);
        }

        // 使用参数化查询防止SQL注入
        transaction.query(
          `INSERT INTO users (name, email, active) VALUES(?, ?, ?)`,
          [user.name, user.email, user.active !== false],
          (err, result) => {
            if (err) {
              transaction.rollback(() => {
                db.detach();
                reject(err);
              });
              return;
            }

            transaction.commit((err) => {
              db.detach();
              if (err) {
                return reject(err);
              }

              // 获取插入的ID（Firebird需要单独查询生成器）
              db.query('SELECT GEN_ID(gen_user_id, 0) AS last_id FROM RDB$DATABASE', (err, result) => {
                if (err) {
                  return reject(err);
                }
                resolve({ id: result[0].LAST_ID, ...user });
              });
            });
          }
        );
      });
    });
  });
}

// 批量插入数据
function insertMultipleUsers(users) {
  return new Promise((resolve, reject) => {
    getConnection((err, db) => {
      if (err) {
        return reject(err);
      }

      db.transaction(Firebird.ISOLATION_READ_COMMITTED, (err, transaction) => {
        if (err) {
          db.detach();
          return reject(err);
        }

        // 使用EXECUTE BLOCK进行批量插入
        const values = users.map(user => 
          `('${user.name}', '${user.email}', ${user.active !== false ? '1' : '0'})`
        ).join(', ');

        const sql = `
          EXECUTE BLOCK AS
          BEGIN
            FOR SELECT * FROM (VALUES ${values}) AS data(name, email, active)
            DO
              INSERT INTO users (name, email, active) VALUES(:data.name, :data.email, :data.active);
          END
        `;

        transaction.query(sql, (err) => {
          if (err) {
            transaction.rollback(() => {
              db.detach();
              reject(err);
            });
            return;
          }

          transaction.commit((err) => {
            db.detach();
            if (err) {
              return reject(err);
            }
            resolve(users);
          });
        });
      });
    });
  });
}

// 使用示例
async function exampleInsertData() {
  try {
    // 插入单条数据
    const newUser = await insertUser({
      name: '张三',
      email: 'zhangsan@example.com',
      active: true
    });
    console.log('插入的用户:', newUser);

    // 批量插入
    const batchUsers = await insertMultipleUsers([
      { name: '李四', email: 'lisi@example.com' },
      { name: '王五', email: 'wangwu@example.com' }
    ]);
    console.log('批量插入的用户:', batchUsers);
  } catch (error) {
    console.error('插入数据失败:', error);
  }
}

// exampleInsertData().catch(console.error);

module.exports = {
  insertUser,
  insertMultipleUsers
};
```

### 3.3 查询数据

```javascript
// query-data.js
const { getConnection } = require('./firebird-connection');

// 基本查询
function findAllUsers() {
  return new Promise((resolve, reject) => {
    getConnection((err, db) => {
      if (err) {
        return reject(err);
      }

      db.query('SELECT * FROM users', (err, result) => {
        db.detach();
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  });
}

// 条件查询
function findUsersByCondition(conditions) {
  return new Promise((resolve, reject) => {
    getConnection((err, db) => {
      if (err) {
        return reject(err);
      }

      let whereClause = '';
      const params = [];
      
      // 构建WHERE条件
      if (conditions) {
        const clauses = [];
        
        if (conditions.name) {
          clauses.push('name LIKE ?');
          params.push(`%${conditions.name}%`);
        }
        
        if (conditions.email) {
          clauses.push('email = ?');
          params.push(conditions.email);
        }
        
        if (conditions.active !== undefined) {
          clauses.push('active = ?');
          params.push(conditions.active);
        }
        
        if (conditions.minCreatedDate) {
          clauses.push('created_at >= ?');
          params.push(conditions.minCreatedDate);
        }
        
        if (clauses.length > 0) {
          whereClause = 'WHERE ' + clauses.join(' AND ');
        }
      }

      const sql = `SELECT * FROM users ${whereClause} ORDER BY created_at DESC`;
      
      db.query(sql, params, (err, result) => {
        db.detach();
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  });
}

// 分页查询
function findUsersWithPagination(page = 1, pageSize = 10, conditions = {}) {
  return new Promise((resolve, reject) => {
    getConnection((err, db) => {
      if (err) {
        return reject(err);
      }

      const offset = (page - 1) * pageSize;
      
      let whereClause = '';
      const params = [];
      
      // 构建WHERE条件（与条件查询相同）
      if (conditions) {
        const clauses = [];
        
        if (conditions.name) {
          clauses.push('name LIKE ?');
          params.push(`%${conditions.name}%`);
        }
        
        if (conditions.email) {
          clauses.push('email = ?');
          params.push(conditions.email);
        }
        
        if (conditions.active !== undefined) {
          clauses.push('active = ?');
          params.push(conditions.active);
        }
        
        if (clauses.length > 0) {
          whereClause = 'WHERE ' + clauses.join(' AND ');
        }
      }
      
      // 深拷贝参数数组，用于第二个查询
      const paramsCount = [...params];
      
      // 查询总数
      const countSql = `SELECT COUNT(*) AS total FROM users ${whereClause}`;
      
      db.query(countSql, paramsCount, (err, countResult) => {
        if (err) {
          db.detach();
          return reject(err);
        }
        
        const total = countResult[0].TOTAL || 0;
        
        // 查询分页数据
        const paginatedSql = `
          SELECT * FROM users 
          ${whereClause} 
          ORDER BY created_at DESC 
          ROWS ${pageSize} TO ${pageSize} OFFSET ${offset}
        `;
        
        // 添加分页参数
        params.push(pageSize, offset);
        
        db.query(paginatedSql, params, (err, dataResult) => {
          db.detach();
          
          if (err) {
            return reject(err);
          }
          
          resolve({
            data: dataResult,
            pagination: {
              page,
              pageSize,
              total,
              pages: Math.ceil(total / pageSize)
            }
          });
        });
      });
    });
  });
}

// 连接查询
function findOrdersWithDetails() {
  return new Promise((resolve, reject) => {
    getConnection((err, db) => {
      if (err) {
        return reject(err);
      }

      const sql = `
        SELECT 
          o.id AS order_id,
          o.order_date,
          o.total_amount,
          o.status,
          u.id AS user_id,
          u.name AS user_name,
          u.email AS user_email,
          p.id AS product_id,
          p.name AS product_name,
          p.price AS product_price,
          od.quantity,
          od.price AS order_price
        FROM orders o
        JOIN users u ON o.user_id = u.id
        JOIN order_details od ON o.id = od.order_id
        JOIN products p ON od.product_id = p.id
        ORDER BY o.order_date DESC
      `;

      db.query(sql, (err, result) => {
        db.detach();
        
        if (err) {
          return reject(err);
        }
        
        // 格式化结果，按订单分组
        const ordersMap = new Map();
        
        result.forEach(row => {
          if (!ordersMap.has(row.ORDER_ID)) {
            ordersMap.set(row.ORDER_ID, {
              id: row.ORDER_ID,
              order_date: row.ORDER_DATE,
              total_amount: row.TOTAL_AMOUNT,
              status: row.STATUS,
              user: {
                id: row.USER_ID,
                name: row.USER_NAME,
                email: row.USER_EMAIL
              },
              items: []
            });
          }
          
          const order = ordersMap.get(row.ORDER_ID);
          order.items.push({
            product_id: row.PRODUCT_ID,
            product_name: row.PRODUCT_NAME,
            product_price: row.PRODUCT_PRICE,
            quantity: row.QUANTITY,
            price: row.ORDER_PRICE
          });
        });
        
        resolve(Array.from(ordersMap.values()));
      });
    });
  });
}

// 使用示例
async function exampleQueries() {
  try {
    // 查询所有用户
    const allUsers = await findAllUsers();
    console.log('所有用户:', allUsers.length);
    
    // 条件查询
    const activeUsers = await findUsersByCondition({ active: true });
    console.log('活跃用户:', activeUsers.length);
    
    // 分页查询
    const paginatedUsers = await findUsersWithPagination(1, 5, { active: true });
    console.log('分页结果:', paginatedUsers.data.length);
    console.log('总页数:', paginatedUsers.pagination.pages);
    
    // 连接查询
    const orders = await findOrdersWithDetails();
    console.log('订单数量:', orders.length);
  } catch (error) {
    console.error('查询失败:', error);
  }
}

// exampleQueries().catch(console.error);

module.exports = {
  findAllUsers,
  findUsersByCondition,
  findUsersWithPagination,
  findOrdersWithDetails
};
```

### 3.4 更新数据

```javascript
// update-data.js
const { getConnection } = require('./firebird-connection');

// 更新单条记录
function updateUser(id, updates) {
  return new Promise((resolve, reject) => {
    getConnection((err, db) => {
      if (err) {
        return reject(err);
      }

      // 构建更新语句
      const fields = [];
      const params = [];
      
      if (updates.name !== undefined) {
        fields.push('name = ?');
        params.push(updates.name);
      }
      
      if (updates.email !== undefined) {
        fields.push('email = ?');
        params.push(updates.email);
      }
      
      if (updates.active !== undefined) {
        fields.push('active = ?');
        params.push(updates.active);
      }
      
      // 添加WHERE条件的参数
      params.push(id);
      
      if (fields.length === 0) {
        db.detach();
        return resolve({ message: '没有要更新的字段' });
      }

      const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
      
      db.transaction(Firebird.ISOLATION_READ_COMMITTED, (err, transaction) => {
        if (err) {
          db.detach();
          return reject(err);
        }

        transaction.query(sql, params, (err, result) => {
          if (err) {
            transaction.rollback(() => {
              db.detach();
              reject(err);
            });
            return;
          }

          transaction.commit((err) => {
            db.detach();
            
            if (err) {
              return reject(err);
            }
            
            // 查询更新后的数据
            db.query('SELECT * FROM users WHERE id = ?', [id], (err, result) => {
              if (err) {
                return reject(err);
              }
              
              if (result.length === 0) {
                return resolve({ message: '用户不存在' });
              }
              
              resolve(result[0]);
            });
          });
        });
      });
    });
  });
}

// 批量更新
function updateMultipleUsers(ids, updates) {
  return new Promise((resolve, reject) => {
    getConnection((err, db) => {
      if (err) {
        return reject(err);
      }

      // 构建更新语句
      const fields = [];
      const params = [];
      
      if (updates.name !== undefined) {
        fields.push('name = ?');
        params.push(updates.name);
      }
      
      if (updates.email !== undefined) {
        fields.push('email = ?');
        params.push(updates.email);
      }
      
      if (updates.active !== undefined) {
        fields.push('active = ?');
        params.push(updates.active);
      }
      
      if (fields.length === 0) {
        db.detach();
        return resolve({ message: '没有要更新的字段' });
      }

      // 构建ID列表字符串
      const idList = ids.map(() => '?').join(', ');
      params.push(...ids);
      
      const sql = `UPDATE users SET ${fields.join(', ')} WHERE id IN (${idList})`;
      
      db.transaction(Firebird.ISOLATION_READ_COMMITTED, (err, transaction) => {
        if (err) {
          db.detach();
          return reject(err);
        }

        transaction.query(sql, params, (err, result) => {
          if (err) {
            transaction.rollback(() => {
              db.detach();
              reject(err);
            });
            return;
          }

          transaction.commit((err) => {
            db.detach();
            
            if (err) {
              return reject(err);
            }
            
            resolve({ updatedCount: ids.length });
          });
        });
      });
    });
  });
}

// 使用示例
async function exampleUpdates() {
  try {
    // 更新单条记录
    const updatedUser = await updateUser(1, {
      name: '张三 (已更新)',
      active: false
    });
    console.log('更新后的用户:', updatedUser);

    // 批量更新
    const batchUpdateResult = await updateMultipleUsers([2, 3], {
      active: false
    });
    console.log('批量更新结果:', batchUpdateResult);
  } catch (error) {
    console.error('更新失败:', error);
  }
}

// exampleUpdates().catch(console.error);

module.exports = {
  updateUser,
  updateMultipleUsers
};
```

### 3.5 删除数据

```javascript
// delete-data.js
const { getConnection } = require('./firebird-connection');

// 删除单条记录
function deleteUser(id) {
  return new Promise((resolve, reject) => {
    getConnection((err, db) => {
      if (err) {
        return reject(err);
      }

      db.transaction(Firebird.ISOLATION_READ_COMMITTED, (err, transaction) => {
        if (err) {
          db.detach();
          return reject(err);
        }

        // 首先检查记录是否存在
        transaction.query('SELECT id FROM users WHERE id = ?', [id], (err, result) => {
          if (err) {
            transaction.rollback(() => {
              db.detach();
              reject(err);
            });
            return;
          }

          if (result.length === 0) {
            transaction.rollback(() => {
              db.detach();
              resolve({ message: '用户不存在' });
            });
            return;
          }

          // 执行删除操作
          transaction.query('DELETE FROM users WHERE id = ?', [id], (err) => {
            if (err) {
              transaction.rollback(() => {
                db.detach();
                reject(err);
              });
              return;
            }

            transaction.commit((err) => {
              db.detach();
              
              if (err) {
                return reject(err);
              }
              
              resolve({ message: '用户删除成功' });
            });
          });
        });
      });
    });
  });
}

// 批量删除
function deleteMultipleUsers(ids) {
  return new Promise((resolve, reject) => {
    getConnection((err, db) => {
      if (err) {
        return reject(err);
      }

      // 构建ID列表字符串
      const idList = ids.map(() => '?').join(', ');
      
      db.transaction(Firebird.ISOLATION_READ_COMMITTED, (err, transaction) => {
        if (err) {
          db.detach();
          return reject(err);
        }

        transaction.query(
          `DELETE FROM users WHERE id IN (${idList})`, 
          ids, 
          (err, result) => {
            if (err) {
              transaction.rollback(() => {
                db.detach();
                reject(err);
              });
              return;
            }

            transaction.commit((err) => {
              db.detach();
              
              if (err) {
                return reject(err);
              }
              
              resolve({ deletedCount: ids.length });
            });
          }
        );
      });
    });
  });
}

// 软删除（更新状态而不是实际删除）
function softDeleteUser(id) {
  return new Promise((resolve, reject) => {
    getConnection((err, db) => {
      if (err) {
        return reject(err);
      }

      db.transaction(Firebird.ISOLATION_READ_COMMITTED, (err, transaction) => {
        if (err) {
          db.detach();
          return reject(err);
        }

        transaction.query(
          'UPDATE users SET active = 0, deleted_at = CURRENT_TIMESTAMP WHERE id = ?',
          [id],
          (err, result) => {
            if (err) {
              transaction.rollback(() => {
                db.detach();
                reject(err);
              });
              return;
            }

            transaction.commit((err) => {
              db.detach();
              
              if (err) {
                return reject(err);
              }
              
              resolve({ message: '用户已软删除' });
            });
          }
        );
      });
    });
  });
}

// 使用示例
async function exampleDeletes() {
  try {
    // 软删除
    await softDeleteUser(4);
    console.log('用户已软删除');

    // 删除单条记录
    const deleteResult = await deleteUser(5);
    console.log('删除结果:', deleteResult);

    // 批量删除
    const batchDeleteResult = await deleteMultipleUsers([6, 7, 8]);
    console.log('批量删除结果:', batchDeleteResult);
  } catch (error) {
    console.error('删除失败:', error);
  }
}

// exampleDeletes().catch(console.error);

module.exports = {
  deleteUser,
  deleteMultipleUsers,
  softDeleteUser
};
```

## 4. 高级功能

### 4.1 存储过程和触发器

Firebird 支持存储过程和触发器，可以在数据库端实现复杂的业务逻辑。

```javascript
// stored-procedures.js
const { getConnection } = require('./firebird-connection');

// 创建存储过程
async function createStoredProcedures() {
  return new Promise((resolve, reject) => {
    getConnection((err, db) => {
      if (err) {
        return reject(err);
      }

      // 创建存储过程的SQL语句
      const sqlStatements = [
        // 存储过程：获取用户信息
        `SET TERM ^ ;
        CREATE OR ALTER PROCEDURE GET_USER (p_user_id INTEGER)
        RETURNS (id INTEGER, name VARCHAR(100), email VARCHAR(100), active BOOLEAN)
        AS
        BEGIN
          SELECT u.id, u.name, u.email, u.active
          FROM users u
          WHERE u.id = :p_user_id
          INTO :id, :name, :email, :active;
        END^`,
        
        // 存储过程：创建订单
        `CREATE OR ALTER PROCEDURE CREATE_ORDER (p_user_id INTEGER)
        RETURNS (order_id INTEGER, order_date TIMESTAMP)
        AS
        BEGIN
          // 生成订单ID
          order_id = GEN_ID(gen_order_id, 1);
          order_date = CURRENT_TIMESTAMP;
          
          // 插入订单记录
          INSERT INTO orders (id, user_id, order_date, total_amount, status)
          VALUES (:order_id, :p_user_id, :order_date, 0, 'PENDING');
        END^`,
        
        // 存储过程：添加订单项
        `CREATE OR ALTER PROCEDURE ADD_ORDER_ITEM (
          p_order_id INTEGER,
          p_product_id INTEGER,
          p_quantity INTEGER
        )
        RETURNS (
          order_detail_id INTEGER,
          price DECIMAL(10, 2),
          total_price DECIMAL(10, 2)
        )
        AS
          DECLARE VARIABLE product_price DECIMAL(10, 2);
          DECLARE VARIABLE product_stock INTEGER;
        BEGIN
          // 获取产品价格和库存
          SELECT p.price, p.stock
          FROM products p
          WHERE p.id = :p_product_id
          INTO :product_price, :product_stock;
          
          // 检查库存
          IF (product_stock < :p_quantity) THEN
            EXCEPTION 'InsufficientStock' '库存不足';
          
          // 生成订单项ID
          order_detail_id = GEN_ID(gen_order_detail_id, 1);
          price = :product_price;
          total_price = :product_price * :p_quantity;
          
          // 插入订单项
          INSERT INTO order_details (id, order_id, product_id, quantity, price)
          VALUES (:order_detail_id, :p_order_id, :p_product_id, :p_quantity, :price);
          
          // 更新产品库存
          UPDATE products
          SET stock = stock - :p_quantity
          WHERE id = :p_product_id;
          
          // 更新订单总金额
          UPDATE orders
          SET total_amount = total_amount + :total_price
          WHERE id = :p_order_id;
        END^`,
        
        // 存储过程：完成订单
        `CREATE OR ALTER PROCEDURE COMPLETE_ORDER (p_order_id INTEGER)
        RETURNS (success BOOLEAN, message VARCHAR(200))
        AS
        BEGIN
          // 检查订单状态
          IF (NOT EXISTS (SELECT 1 FROM orders WHERE id = :p_order_id AND status = 'PENDING')) THEN
          BEGIN
            success = FALSE;
            message = '订单不存在或状态不正确';
            EXIT;
          END
          
          // 更新订单状态
          UPDATE orders
          SET status = 'COMPLETED'
          WHERE id = :p_order_id;
          
          success = TRUE;
          message = '订单已完成';
        END^`,
        
        // 创建触发器：在删除用户前检查关联的订单
        `CREATE OR ALTER TRIGGER TRG_CHECK_USER_DELETE FOR users
        ACTIVE BEFORE DELETE POSITION 0
        AS
          DECLARE VARIABLE has_orders INTEGER;
        BEGIN
          // 检查用户是否有订单
          SELECT COUNT(*) FROM orders WHERE user_id = OLD.id
          INTO :has_orders;
          
          // 如果有订单，阻止删除
          IF (:has_orders > 0) THEN
            EXCEPTION 'CannotDeleteUser' '用户有订单记录，不能删除';
        END^`,
        
        // 创建触发器：记录用户修改历史
        `CREATE OR ALTER TRIGGER TRG_LOG_USER_CHANGES FOR users
        ACTIVE AFTER UPDATE OR DELETE POSITION 0
        AS
        BEGIN
          // 检查日志表是否存在，如果不存在则创建
          IF (NOT EXISTS (
            SELECT 1 FROM RDB$RELATIONS WHERE RDB$RELATION_NAME = 'USER_CHANGES_LOG'
          )) THEN
          BEGIN
            EXECUTE STATEMENT 'CREATE TABLE USER_CHANGES_LOG (
              id INTEGER PRIMARY KEY,
              user_id INTEGER,
              change_type VARCHAR(10),
              changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              old_data BLOB SUB_TYPE TEXT
            )';
            
            EXECUTE STATEMENT 'CREATE GENERATOR gen_user_changes_log_id';
            
            EXECUTE STATEMENT 'SET TERM ^ ;
            CREATE TRIGGER trg_user_changes_log_bi FOR USER_CHANGES_LOG
            ACTIVE BEFORE INSERT POSITION 0
            AS
            BEGIN
              NEW.id = GEN_ID(gen_user_changes_log_id, 1);
            END^ SET TERM ; ^';
          END
          
          // 插入变更记录
          INSERT INTO USER_CHANGES_LOG (user_id, change_type, old_data)
          VALUES (
            OLD.id,
            CASE WHEN UPDATING THEN 'UPDATE' ELSE 'DELETE' END,
            JSON_OBJECT(
              'id' VALUE OLD.id,
              'name' VALUE OLD.name,
              'email' VALUE OLD.email,
              'active' VALUE OLD.active
            )
          );
        END^`,
        
        `SET TERM ; ^`
      ];

      // 依次执行SQL语句
      let currentStatement = 0;
      
      function executeNext() {
        if (currentStatement >= sqlStatements.length) {
          db.detach();
          console.log('存储过程和触发器创建完成');
          return resolve();
        }

        const sql = sqlStatements[currentStatement];
        console.log(`执行SQL: ${sql.substring(0, 50)}...`);
        
        db.query(sql, (err) => {
          if (err) {
            console.error(`SQL执行错误: ${err.message}`);
            db.detach();
            return reject(err);
          }

          currentStatement++;
          executeNext();
        });
      }

      executeNext();
    });
  });
}

// 调用存储过程：获取用户信息
function callGetUserProcedure(userId) {
  return new Promise((resolve, reject) => {
    getConnection((err, db) => {
      if (err) {
        return reject(err);
      }

      // 调用存储过程
      db.query('EXECUTE PROCEDURE GET_USER ?', [userId], (err, result) => {
        db.detach();
        
        if (err) {
          return reject(err);
        }
        
        resolve(result[0] || null);
      });
    });
  });
}

// 调用存储过程：创建订单和添加订单项
async function createOrderWithItems(userId, items) {
  const { getConnection } = require('./firebird-connection');
  
  return new Promise((resolve, reject) => {
    getConnection((err, db) => {
      if (err) {
        return reject(err);
      }

      // 开始事务
      db.transaction(Firebird.ISOLATION_READ_COMMITTED, (err, transaction) => {
        if (err) {
          db.detach();
          return reject(err);
        }

        let orderId = null;
        let orderDate = null;

        // 第一步：创建订单
        transaction.query(
          'EXECUTE PROCEDURE CREATE_ORDER ? RETURNING_VALUES order_id, order_date', 
          [userId],
          (err, result) => {
            if (err) {
              transaction.rollback(() => {
                db.detach();
                reject(err);
              });
              return;
            }

            // 获取返回的订单ID和日期
            orderId = result[0].ORDER_ID;
            orderDate = result[0].ORDER_DATE;

            // 第二步：添加订单项
            let currentItem = 0;
            const orderItems = [];

            function addNextItem() {
              if (currentItem >= items.length) {
                // 所有订单项添加完成，提交事务
                transaction.commit((err) => {
                  db.detach();
                  
                  if (err) {
                    return reject(err);
                  }
                  
                  resolve({
                    order_id: orderId,
                    order_date: orderDate,
                    items: orderItems
                  });
                });
                return;
              }

              const item = items[currentItem];
              
              // 调用添加订单项的存储过程
              transaction.query(
                'EXECUTE PROCEDURE ADD_ORDER_ITEM ?, ?, ? RETURNING_VALUES order_detail_id, price, total_price',
                [orderId, item.product_id, item.quantity],
                (err, result) => {
                  if (err) {
                    transaction.rollback(() => {
                      db.detach();
                      reject(err);
                    });
                    return;
                  }

                  // 保存订单项信息
                  orderItems.push({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price: result[0].PRICE,
                    total_price: result[0].TOTAL_PRICE,
                    order_detail_id: result[0].ORDER_DETAIL_ID
                  });

                  currentItem++;
                  addNextItem();
                }
              );
            }

            addNextItem();
          }
        );
      });
    });
  });
}

// 使用示例
async function exampleStoredProcedures() {
  try {
    // 创建存储过程和触发器
    await createStoredProcedures();
    
    // 调用存储过程获取用户信息
    const user = await callGetUserProcedure(1);
    console.log('用户信息:', user);
    
    // 创建订单和添加订单项
    const order = await createOrderWithItems(1, [
      { product_id: 1, quantity: 2 },
      { product_id: 2, quantity: 1 }
    ]);
    console.log('创建的订单:', order);
  } catch (error) {
    console.error('操作失败:', error);
  }
}

// exampleStoredProcedures().catch(console.error);

module.exports = {
  createStoredProcedures,
  callGetUserProcedure,
  createOrderWithItems
};
```

### 4.2 BLOB 数据处理

Firebird 支持 BLOB（二进制大对象）数据类型，用于存储大型文本或二进制数据。

```javascript
// blob-handling.js
const { getConnection } = require('./firebird-connection');
const fs = require('fs');
const path = require('path');

// 插入文本 BLOB
function insertTextBlob(title, content) {
  return new Promise((resolve, reject) => {
    getConnection((err, db) => {
      if (err) {
        return reject(err);
      }

      db.transaction(Firebird.ISOLATION_READ_COMMITTED, (err, transaction) => {
        if (err) {
          db.detach();
          return reject(err);
        }

        // 创建一个临时表用于演示
        transaction.query(
          `CREATE TABLE IF NOT EXISTS documents (
            id INTEGER PRIMARY KEY,
            title VARCHAR(200) NOT NULL,
            content BLOB SUB_TYPE TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )`,
          (err) => {
            if (err) {
              transaction.rollback(() => {
                db.detach();
                reject(err);
              });
              return;
            }

            // 确保生成器存在
            transaction.query(
              `CREATE GENERATOR IF NOT EXISTS gen_document_id`,
              (err) => {
                if (err) {
                  transaction.rollback(() => {
                    db.detach();
                    reject(err);
                  });
                  return;
                }

                // 插入带有 BLOB 字段的记录
                transaction.query(
                  `INSERT INTO documents (id, title, content)
                   VALUES (GEN_ID(gen_document_id, 1), ?, ?)`,
                  [title, content],
                  (err, result) => {
                    if (err) {
                      transaction.rollback(() => {
                        db.detach();
                        reject(err);
                      });
                      return;
                    }

                    // 获取插入的 ID
                    transaction.query(
                      'SELECT GEN_ID(gen_document_id, 0) AS last_id FROM RDB$DATABASE',
                      (err, result) => {
                        if (err) {
                          transaction.rollback(() => {
                            db.detach();
                            reject(err);
                          });
                          return;
                        }

                        const documentId = result[0].LAST_ID;

                        transaction.commit((err) => {
                          db.detach();
                          
                          if (err) {
                            return reject(err);
                          }
                          
                          resolve({ id: documentId, title });
                        });
                      }
                    );
                  }
                );
              }
            );
          }
        );
      });
    });
  });
}

// 读取文本 BLOB
function readTextBlob(documentId) {
  return new Promise((resolve, reject) => {
    getConnection((err, db) => {
      if (err) {
        return reject(err);
      }

      // 使用特殊的 fetchInfo 选项确保正确读取 BLOB
      db.query(
        'SELECT id, title, content FROM documents WHERE id = ?',
        [documentId],
        {
          fetchInfo: {
            CONTENT: { type: 2 } // 2 = blob, 确保 BLOB 被正确处理
          }
        },
        (err, result) => {
          db.detach();
          
          if (err) {
            return reject(err);
          }
          
          if (result.length === 0) {
            return resolve(null);
          }
          
          resolve(result[0]);
        }
      );
    });
  });
}

// 插入二进制 BLOB（如图片）
function insertBinaryBlob(fileName, filePath) {
  return new Promise((resolve, reject) => {
    getConnection((err, db) => {
      if (err) {
        return reject(err);
      }

      db.transaction(Firebird.ISOLATION_READ_COMMITTED, (err, transaction) => {
        if (err) {
          db.detach();
          return reject(err);
        }

        // 创建一个临时表用于演示
        transaction.query(
          `CREATE TABLE IF NOT EXISTS files (
            id INTEGER PRIMARY KEY,
            file_name VARCHAR(200) NOT NULL,
            file_data BLOB SUB_TYPE BINARY,
            file_size INTEGER,
            mime_type VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )`,
          (err) => {
            if (err) {
              transaction.rollback(() => {
                db.detach();
                reject(err);
              });
              return;
            }

            // 确保生成器存在
            transaction.query(
              `CREATE GENERATOR IF NOT EXISTS gen_file_id`,
              (err) => {
                if (err) {
                  transaction.rollback(() => {
                    db.detach();
                    reject(err);
                  });
                  return;
                }

                try {
                  // 读取文件内容
                  const fileContent = fs.readFileSync(filePath);
                  const fileSize = fs.statSync(filePath).size;
                  
                  // 猜测 MIME 类型
                  let mimeType = 'application/octet-stream';
                  const extension = path.extname(fileName).toLowerCase();
                  if (extension === '.jpg' || extension === '.jpeg') {
                    mimeType = 'image/jpeg';
                  } else if (extension === '.png') {
                    mimeType = 'image/png';
                  } else if (extension === '.pdf') {
                    mimeType = 'application/pdf';
                  }

                  // 插入二进制 BLOB
                  transaction.query(
                    `INSERT INTO files (id, file_name, file_data, file_size, mime_type)
                     VALUES (GEN_ID(gen_file_id, 1), ?, ?, ?, ?)`,
                    [fileName, fileContent, fileSize, mimeType],
                    (err, result) => {
                      if (err) {
                        transaction.rollback(() => {
                          db.detach();
                          reject(err);
                        });
                        return;
                      }

                      // 获取插入的 ID
                      transaction.query(
                        'SELECT GEN_ID(gen_file_id, 0) AS last_id FROM RDB$DATABASE',
                        (err, result) => {
                          if (err) {
                            transaction.rollback(() => {
                              db.detach();
                              reject(err);
                            });
                            return;
                          }

                          const fileId = result[0].LAST_ID;

                          transaction.commit((err) => {
                            db.detach();
                            
                            if (err) {
                              return reject(err);
                            }
                            
                            resolve({ id: fileId, file_name: fileName, file_size });
                          });
                        }
                      );
                    }
                  );
                } catch (fileError) {
                  transaction.rollback(() => {
                    db.detach();
                    reject(fileError);
                  });
                }
              }
            );
          }
        );
      });
    });
  });
}

// 读取二进制 BLOB 并保存到文件
function saveBinaryBlobToFile(fileId, outputPath) {
  return new Promise((resolve, reject) => {
    getConnection((err, db) => {
      if (err) {
        return reject(err);
      }

      // 查询文件信息和内容
      db.query(
        'SELECT id, file_name, file_data, mime_type FROM files WHERE id = ?',
        [fileId],
        {
          fetchInfo: {
            FILE_DATA: { type: 2 } // 确保 BLOB 被正确处理
          }
        },
        (err, result) => {
          db.detach();
          
          if (err) {
            return reject(err);
          }
          
          if (result.length === 0) {
            return reject(new Error('文件不存在'));
          }
          
          const fileInfo = result[0];
          
          try {
            // 确保输出目录存在
            const dirPath = path.dirname(outputPath);
            if (!fs.existsSync(dirPath)) {
              fs.mkdirSync(dirPath, { recursive: true });
            }
            
            // 写入文件
            fs.writeFileSync(outputPath, fileInfo.FILE_DATA);
            
            resolve({
              id: fileInfo.ID,
              file_name: fileInfo.FILE_NAME,
              mime_type: fileInfo.MIME_TYPE,
              saved_path: outputPath
            });
          } catch (fileError) {
            reject(fileError);
          }
        }
      );
    });
  });
}

// 使用示例
async function exampleBlobHandling() {
  try {
    // 插入文本 BLOB
    const document = await insertTextBlob(
      '示例文档',
      '这是一个包含大量文本内容的BLOB示例。\n可以包含多行文本、特殊字符等。\n支持UTF-8编码。'
    );
    console.log('插入的文档:', document);
    
    // 读取文本 BLOB
    const readDocument = await readTextBlob(document.id);
    console.log('读取的文档内容:', readDocument.content);
    
    // 注意：插入二进制 BLOB 需要有实际的文件路径
    /*
    const file = await insertBinaryBlob(
      'example.jpg',
      '/path/to/example.jpg'
    );
    console.log('插入的文件:', file);
    
    // 读取二进制 BLOB 并保存到文件
    const savedFile = await saveBinaryBlobToFile(
      file.id,
      '/path/to/output/example_saved.jpg'
    );
    console.log('保存的文件:', savedFile);
    */
  } catch (error) {
    console.error('BLOB处理失败:', error);
  }
}

// exampleBlobHandling().catch(console.error);

module.exports = {
  insertTextBlob,
  readTextBlob,
  insertBinaryBlob,
  saveBinaryBlobToFile
};
```

### 4.3 事务管理

Firebird 提供了强大的事务支持，包括不同的事务隔离级别。

```javascript
// transaction-management.js
const { getConnection } = require('./firebird-connection');
const Firebird = require('node-firebird');

// 事务隔离级别常量
const ISOLATION_LEVELS = {
  READ_UNCOMMITTED: Firebird.ISOLATION_READ_UNCOMMITTED,
  READ_COMMITTED: Firebird.ISOLATION_READ_COMMITTED,
  REPEATABLE_READ: Firebird.ISOLATION_REPEATABLE_READ,
  SERIALIZABLE: Firebird.ISOLATION_SERIALIZABLE
};

// 执行带隔离级别的事务
function executeTransaction(isolationLevel, operations) {
  return new Promise((resolve, reject) => {
    getConnection((err, db) => {
      if (err) {
        return reject(err);
      }

      // 开始事务
      db.transaction(isolationLevel, (err, transaction) => {
        if (err) {
          db.detach();
          return reject(err);
        }

        // 执行操作
        Promise.resolve(operations(transaction))
          .then(result => {
            // 提交事务
            transaction.commit((err) => {
              db.detach();
              
              if (err) {
                return reject(err);
              }
              
              resolve(result);
            });
          })
          .catch(error => {
            // 回滚事务
            transaction.rollback(() => {
              db.detach();
              reject(error);
            });
          });
      });
    });
  });
}

// 示例：使用READ COMMITTED隔离级别
async function exampleReadCommitted() {
  try {
    const result = await executeTransaction(
      ISOLATION_LEVELS.READ_COMMITTED,
      async (transaction) => {
        // 执行第一个查询
        const users = await new Promise((resolve, reject) => {
          transaction.query('SELECT * FROM users WHERE active = 1', (err, result) => {
            if (err) return reject(err);
            resolve(result);
          });
        });
        
        // 执行更新
        await new Promise((resolve, reject) => {
          transaction.query(
            'UPDATE users SET active = 0 WHERE id = ?',
            [users[0]?.id || 1],
            (err) => {
              if (err) return reject(err);
              resolve();
            }
          );
        });
        
        return { message: '事务成功执行', affectedUsers: users.length };
      }
    );
    
    console.log('READ COMMITTED 事务结果:', result);
  } catch (error) {
    console.error('事务失败:', error);
  }
}

// 示例：嵌套事务（通过保存点实现）
async function exampleNestedTransactions() {
  try {
    const result = await executeTransaction(
      ISOLATION_LEVELS.SERIALIZ