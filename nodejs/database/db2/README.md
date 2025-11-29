# IBM DB2 与 Node.js 集成指南

## 1. IBM DB2 简介

IBM DB2 是 IBM 公司开发的企业级关系型数据库管理系统(RDBMS)，提供了强大的数据管理、事务处理和分析功能。DB2 适用于各种规模的企业应用，从简单的单用户系统到复杂的多用户环境和数据仓库。

### 1.1 主要特点

- **企业级可靠性**：提供高可用性、灾难恢复和数据完整性保障
- **强大的性能**：针对大型数据集和复杂查询进行了优化
- **安全机制**：提供全面的安全特性，包括行级访问控制和审计功能
- **多平台支持**：支持多种操作系统，包括 AIX、Linux、Windows 和 z/OS
- **扩展性**：支持垂直扩展（增加资源）和水平扩展（分区表和数据分片）
- **分析能力**：内置 OLAP、数据挖掘和文本分析功能
- **混合工作负载优化**：同时支持 OLTP 和 OLAP 工作负载
- **云原生支持**：提供 DB2 on Cloud 和 Cloud Pak for Data 解决方案
- **兼容性**：符合 SQL 标准，支持各种编程语言和接口

### 1.2 与其他数据库的比较

| 特性 | IBM DB2 | Oracle | SQL Server | PostgreSQL |
|------|---------|--------|------------|------------|
| 开源 | 否（商业软件） | 否（商业软件） | 否（商业软件） | 是 |
| 性能 | 优秀的大型数据库性能 | 强大的整体性能 | 良好的 Windows 平台性能 | 良好的性能和可扩展性 |
| 资源消耗 | 中高 | 高 | 中高 | 中等 |
| 扩展性 | 优秀的水平和垂直扩展 | 强大的扩展性 | 良好的扩展性 | 良好的扩展性 |
| 数据分析 | 内置高级分析功能 | 强大的分析能力 | 集成分析服务 | 良好的分析扩展 |
| 适用场景 | 企业级应用、数据仓库、大型系统 | 企业级应用、大型数据库、云服务 | 企业级应用、Windows 生态系统 | 中小型应用、云服务、灵活部署 |

## 2. Node.js 与 IBM DB2 集成

### 2.1 安装驱动

IBM 官方提供了 Node.js 的 DB2 驱动，可以通过 npm 安装。

```bash
# 安装 IBM DB2 驱动
npm install ibm_db

# 如需使用 Promise 风格 API，可以安装 bluebird
npm install bluebird
```

### 2.2 基本连接

```javascript
// db2-connection.js
const ibmdb = require('ibm_db');

// 连接配置
const connStr = "DATABASE=SAMPLE;HOSTNAME=localhost;UID=db2inst1;PWD=password;PORT=50000;PROTOCOL=TCPIP";

// 基本连接示例（回调方式）
function basicConnectionExample() {
  ibmdb.open(connStr, (err, conn) => {
    if (err) {
      console.error('连接数据库失败:', err);
      return;
    }

    console.log('成功连接到 DB2 数据库');

    // 执行查询
    conn.query('SELECT * FROM SYSCAT.TABLES FETCH FIRST 10 ROWS ONLY', (err, data) => {
      if (err) {
        console.error('查询失败:', err);
      } else {
        console.log('查询结果:', data);
      }

      // 关闭连接
      conn.close(() => {
        console.log('数据库连接已关闭');
      });
    });
  });
}

// 使用 Promise API
const Promise = require('bluebird');
const ibmdbPromise = Promise.promisifyAll(ibmdb);

async function promiseConnectionExample() {
  try {
    // 打开连接
    const conn = await ibmdbPromise.openAsync(connStr);
    console.log('成功连接到 DB2 数据库');

    // 执行查询
    const data = await conn.queryAsync('SELECT * FROM SYSCAT.TABLES FETCH FIRST 10 ROWS ONLY');
    console.log('查询结果:', data);

    // 关闭连接
    await conn.closeAsync();
    console.log('数据库连接已关闭');
  } catch (err) {
    console.error('操作失败:', err);
  }
}

// 创建连接池
const pool = new ibmdb.Pool();

async function poolConnectionExample() {
  let conn;
  try {
    // 从连接池获取连接
    conn = await ibmdbPromise.openAsync(connStr);
    console.log('从连接池获取连接成功');

    // 执行查询
    const data = await conn.queryAsync('SELECT * FROM SYSCAT.TABLES FETCH FIRST 10 ROWS ONLY');
    console.log('查询结果:', data);
  } catch (err) {
    console.error('操作失败:', err);
  } finally {
    // 释放连接回池中
    if (conn) {
      conn.closeSync();
      console.log('连接已释放回池中');
    }
  }
}

// 使用示例
// basicConnectionExample();
// promiseConnectionExample().catch(console.error);
// poolConnectionExample().catch(console.error);

module.exports = {
  connStr,
  ibmdb,
  ibmdbPromise,
  pool
};
```

### 2.3 连接池管理

在生产环境中，使用连接池可以显著提高性能和资源利用率。

```javascript
// db2-pool.js
const ibmdb = require('ibm_db');
const Promise = require('bluebird');

// 连接配置
const connStr = "DATABASE=SAMPLE;HOSTNAME=localhost;UID=db2inst1;PWD=password;PORT=50000;PROTOCOL=TCPIP";

// 自定义连接池管理器
class DB2PoolManager {
  constructor(options = {}) {
    this.connStr = options.connStr || connStr;
    this.maxPoolSize = options.maxPoolSize || 10;
    this.minPoolSize = options.minPoolSize || 2;
    this.timeout = options.timeout || 30000; // 连接超时时间（毫秒）
    
    // 创建连接池
    this.pool = new ibmdb.Pool();
    
    // 连接池统计信息
    this.activeConnections = 0;
    this.idleConnections = 0;
    this.waitQueue = [];
    
    // 初始化最小连接数
    this.initializeConnections();
    
    // 定期检查空闲连接
    this.monitorInterval = setInterval(() => this.monitorConnections(), 60000);
  }

  // 初始化连接池中的最小连接数
  async initializeConnections() {
    try {
      for (let i = 0; i < this.minPoolSize; i++) {
        const conn = await this.createConnection();
        if (conn) {
          await conn.closeSync(); // 关闭连接，让它回到池中
          this.idleConnections++;
        }
      }
      console.log(`初始化了 ${this.minPoolSize} 个数据库连接`);
    } catch (err) {
      console.error('初始化连接池失败:', err);
    }
  }

  // 创建新连接
  createConnection() {
    return new Promise((resolve, reject) => {
      ibmdb.open(this.connStr, (err, conn) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(conn);
      });
    });
  }

  // 从连接池获取连接
  getConnection() {
    return new Promise((resolve, reject) => {
      // 检查是否超过最大连接数
      if (this.activeConnections >= this.maxPoolSize) {
        // 将请求放入等待队列
        const timeoutId = setTimeout(() => {
          // 超时处理
          this.waitQueue = this.waitQueue.filter(item => item.resolve !== resolve);
          reject(new Error('获取数据库连接超时'));
        }, this.timeout);
        
        this.waitQueue.push({ resolve, reject, timeoutId });
        return;
      }

      // 获取连接
      ibmdb.open(this.connStr, (err, conn) => {
        if (err) {
          reject(err);
          return;
        }

        // 更新连接计数
        this.activeConnections++;
        if (this.idleConnections > 0) {
          this.idleConnections--;
        }

        // 保存原始的 close 方法
        const originalClose = conn.close;
        
        // 重写 close 方法以跟踪连接状态
        conn.close = (callback) => {
          originalClose.call(conn, (err) => {
            if (!err) {
              this.activeConnections--;
              this.idleConnections++;
              
              // 处理等待队列中的请求
              this.processWaitQueue();
            }
            
            if (callback) callback(err);
          });
        };

        // 重写 closeSync 方法
        const originalCloseSync = conn.closeSync;
        conn.closeSync = () => {
          originalCloseSync.call(conn);
          this.activeConnections--;
          this.idleConnections++;
          
          // 处理等待队列中的请求
          this.processWaitQueue();
        };

        resolve(conn);
      });
    });
  }

  // 处理等待队列中的请求
  processWaitQueue() {
    if (this.waitQueue.length === 0) return;
    
    const nextRequest = this.waitQueue.shift();
    clearTimeout(nextRequest.timeoutId);
    
    // 尝试获取连接
    this.getConnection()
      .then(nextRequest.resolve)
      .catch(nextRequest.reject);
  }

  // 监控连接池状态
  monitorConnections() {
    console.log(`连接池状态: 活跃=${this.activeConnections}, 空闲=${this.idleConnections}, 等待=${this.waitQueue.length}`);
    
    // 可以在这里实现额外的监控逻辑
  }

  // 关闭所有连接
  closeAll() {
    clearInterval(this.monitorInterval);
    
    // 拒绝所有等待中的请求
    this.waitQueue.forEach(request => {
      clearTimeout(request.timeoutId);
      request.reject(new Error('连接池正在关闭'));
    });
    this.waitQueue = [];

    // 关闭连接池
    if (this.pool && typeof this.pool.close === 'function') {
      this.pool.close();
    }
    
    console.log('连接池已关闭');
  }
}

// 创建全局连接池实例
const poolManager = new DB2PoolManager({
  maxPoolSize: 15,
  minPoolSize: 5,
  timeout: 60000
});

// 使用示例
async function exampleWithPool() {
  let conn;
  try {
    // 从池中获取连接
    conn = await poolManager.getConnection();
    
    // 执行查询
    const result = await new Promise((resolve, reject) => {
      conn.query('SELECT * FROM SYSCAT.TABLES FETCH FIRST 5 ROWS ONLY', (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
    
    console.log('查询结果:', result);
    return result;
  } catch (err) {
    console.error('使用连接池时出错:', err);
    throw err;
  } finally {
    // 释放连接回池中
    if (conn) {
      conn.closeSync();
    }
  }
}

// 应用关闭时清理
process.on('SIGINT', () => {
  poolManager.closeAll();
  process.exit(0);
});

module.exports = {
  poolManager,
  exampleWithPool
};
```

## 3. 核心数据操作

### 3.1 创建数据库

在 DB2 中，通常使用命令行工具或 IBM Data Studio 来创建数据库。以下是通过 Node.js 执行系统命令来创建数据库的示例。

```javascript
// create-database.js
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const { ibmdbPromise, connStr } = require('./db2-connection');

// 使用 db2 命令行工具创建数据库
async function createDatabase(dbName, options = {}) {
  const { 
    adminUser = 'db2inst1', 
    adminPassword = 'password',
    codeSet = 'UTF-8',
    territory = 'US'
  } = options;

  try {
    // 设置 DB2 环境变量（Windows 环境）
    let command;
    if (process.platform === 'win32') {
      command = `set DB2INSTANCE=${adminUser} && db2 create database ${dbName} using codeset ${codeSet} territory ${territory}`;
    } else {
      // Linux/Unix 环境
      command = `sudo -u ${adminUser} db2 create database ${dbName} using codeset ${codeSet} territory ${territory}`;
    }

    console.log(`执行命令: ${command}`);
    const { stdout, stderr } = await execPromise(command);
    
    console.log('数据库创建输出:', stdout);
    if (stderr) {
      console.error('警告:', stderr);
    }
    
    console.log(`数据库 ${dbName} 创建成功`);
    return { success: true, dbName };
  } catch (error) {
    console.error('创建数据库失败:', error.message);
    return { success: false, error: error.message };
  }
}

// 初始化数据库结构
async function initializeDatabase() {
  try {
    // 打开连接
    const conn = await ibmdbPromise.openAsync(connStr);
    
    try {
      // 创建表和初始化数据的SQL语句
      const sqlStatements = [
        // 创建用户表
        `CREATE TABLE users (
          id INT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) NOT NULL UNIQUE,
          created_at TIMESTAMP DEFAULT CURRENT TIMESTAMP,
          active SMALLINT DEFAULT 1
        )`,
        
        // 创建产品表
        `CREATE TABLE products (
          id INT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          description CLOB,
          price DECIMAL(10, 2) NOT NULL,
          stock INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT TIMESTAMP
        )`,
        
        // 创建订单表
        `CREATE TABLE orders (
          id INT PRIMARY KEY,
          user_id INT NOT NULL,
          order_date TIMESTAMP DEFAULT CURRENT TIMESTAMP,
          total_amount DECIMAL(10, 2) NOT NULL,
          status VARCHAR(20) DEFAULT 'PENDING',
          FOREIGN KEY (user_id) REFERENCES users(id)
        )`,
        
        // 创建订单详情表
        `CREATE TABLE order_details (
          id INT PRIMARY KEY,
          order_id INT NOT NULL,
          product_id INT NOT NULL,
          quantity INT NOT NULL,
          price DECIMAL(10, 2) NOT NULL,
          FOREIGN KEY (order_id) REFERENCES orders(id),
          FOREIGN KEY (product_id) REFERENCES products(id)
        )`,
        
        // 创建序列（用于自动递增ID）
        `CREATE SEQUENCE seq_user_id START WITH 1 INCREMENT BY 1`,
        `CREATE SEQUENCE seq_product_id START WITH 1 INCREMENT BY 1`,
        `CREATE SEQUENCE seq_order_id START WITH 1 INCREMENT BY 1`,
        `CREATE SEQUENCE seq_order_detail_id START WITH 1 INCREMENT BY 1`,
        
        // 创建触发器（用于自动递增ID）
        `CREATE TRIGGER trg_users_bi
        NO CASCADE BEFORE INSERT ON users
        REFERENCING NEW AS new_row
        FOR EACH ROW MODE DB2SQL
        BEGIN ATOMIC
          SET new_row.id = NEXTVAL FOR seq_user_id;
        END`,
        
        `CREATE TRIGGER trg_products_bi
        NO CASCADE BEFORE INSERT ON products
        REFERENCING NEW AS new_row
        FOR EACH ROW MODE DB2SQL
        BEGIN ATOMIC
          SET new_row.id = NEXTVAL FOR seq_product_id;
        END`,
        
        `CREATE TRIGGER trg_orders_bi
        NO CASCADE BEFORE INSERT ON orders
        REFERENCING NEW AS new_row
        FOR EACH ROW MODE DB2SQL
        BEGIN ATOMIC
          SET new_row.id = NEXTVAL FOR seq_order_id;
        END`,
        
        `CREATE TRIGGER trg_order_details_bi
        NO CASCADE BEFORE INSERT ON order_details
        REFERENCING NEW AS new_row
        FOR EACH ROW MODE DB2SQL
        BEGIN ATOMIC
          SET new_row.id = NEXTVAL FOR seq_order_detail_id;
        END`
      ];

      // 依次执行SQL语句
      for (const sql of sqlStatements) {
        console.log(`执行SQL: ${sql.substring(0, 50)}...`);
        await conn.queryAsync(sql);
      }
      
      console.log('数据库初始化完成');
      return { success: true };
    } finally {
      // 关闭连接
      await conn.closeAsync();
    }
  } catch (error) {
    console.error('初始化数据库失败:', error.message);
    return { success: false, error: error.message };
  }
}

// 使用示例
async function setupNewDatabase() {
  try {
    // 创建数据库（注意：此操作通常需要管理员权限）
    // const createResult = await createDatabase('MYAPPDB');
    // if (!createResult.success) {
    //   throw new Error(createResult.error);
    // }
    
    // 初始化数据库结构
    const initResult = await initializeDatabase();
    if (!initResult.success) {
      throw new Error(initResult.error);
    }
    
    console.log('数据库设置成功');
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
const { poolManager } = require('./db2-pool');

// 插入单条数据
async function insertUser(user) {
  let conn;
  try {
    conn = await poolManager.getConnection();
    
    // 使用参数化查询防止SQL注入
    const sql = `
      INSERT INTO users (name, email, active)
      VALUES (?, ?, ?)
    `;
    
    // 执行插入
    await conn.queryAsync(sql, [user.name, user.email, user.active !== false ? 1 : 0]);
    
    // 获取插入的ID（使用序列的当前值）
    const idResult = await conn.queryAsync('VALUES (CURRVAL FOR seq_user_id)');
    const userId = idResult[0][0];
    
    return { id: userId, ...user };
  } catch (error) {
    console.error('插入用户失败:', error.message);
    throw error;
  } finally {
    if (conn) {
      conn.closeSync();
    }
  }
}

// 批量插入数据
async function insertMultipleUsers(users) {
  let conn;
  try {
    conn = await poolManager.getConnection();
    
    // 使用批处理插入
    const sql = `
      INSERT INTO users (name, email, active)
      VALUES (?, ?, ?)
    `;
    
    // 开始事务
    await conn.queryAsync('BEGIN WORK');
    
    try {
      // 依次执行插入
      for (const user of users) {
        await conn.queryAsync(sql, [user.name, user.email, user.active !== false ? 1 : 0]);
      }
      
      // 提交事务
      await conn.queryAsync('COMMIT WORK');
      
      return { success: true, insertedCount: users.length };
    } catch (error) {
      // 回滚事务
      await conn.queryAsync('ROLLBACK WORK');
      throw error;
    }
  } catch (error) {
    console.error('批量插入用户失败:', error.message);
    throw error;
  } finally {
    if (conn) {
      conn.closeSync();
    }
  }
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
    const batchResult = await insertMultipleUsers([
      { name: '李四', email: 'lisi@example.com', active: true },
      { name: '王五', email: 'wangwu@example.com', active: true }
    ]);
    console.log('批量插入结果:', batchResult);
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
const { poolManager } = require('./db2-pool');

// 基本查询
async function findAllUsers() {
  let conn;
  try {
    conn = await poolManager.getConnection();
    const result = await conn.queryAsync('SELECT * FROM users');
    return result;
  } catch (error) {
    console.error('查询用户失败:', error.message);
    throw error;
  } finally {
    if (conn) {
      conn.closeSync();
    }
  }
}

// 条件查询
async function findUsersByCondition(conditions) {
  let conn;
  try {
    conn = await poolManager.getConnection();
    
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
        params.push(conditions.active ? 1 : 0);
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
    const result = await conn.queryAsync(sql, params);
    return result;
  } catch (error) {
    console.error('条件查询用户失败:', error.message);
    throw error;
  } finally {
    if (conn) {
      conn.closeSync();
    }
  }
}

// 分页查询
async function findUsersWithPagination(page = 1, pageSize = 10, conditions = {}) {
  let conn;
  try {
    conn = await poolManager.getConnection();
    
    const offset = (page - 1) * pageSize;
    
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
        params.push(conditions.active ? 1 : 0);
      }
      
      if (clauses.length > 0) {
        whereClause = 'WHERE ' + clauses.join(' AND ');
      }
    }
    
    // 深拷贝参数数组，用于第二个查询
    const countParams = [...params];
    
    // 查询总数
    const countSql = `SELECT COUNT(*) AS total FROM users ${whereClause}`;
    const countResult = await conn.queryAsync(countSql, countParams);
    const total = countResult[0].TOTAL;
    
    // 查询分页数据
    const paginatedSql = `
      SELECT * FROM users 
      ${whereClause} 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `;
    
    // 添加分页参数
    params.push(pageSize, offset);
    
    const dataResult = await conn.queryAsync(paginatedSql, params);
    
    return {
      data: dataResult,
      pagination: {
        page,
        pageSize,
        total,
        pages: Math.ceil(total / pageSize)
      }
    };
  } catch (error) {
    console.error('分页查询用户失败:', error.message);
    throw error;
  } finally {
    if (conn) {
      conn.closeSync();
    }
  }
}

// 连接查询
async function findOrdersWithDetails() {
  let conn;
  try {
    conn = await poolManager.getConnection();
    
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

    const result = await conn.queryAsync(sql);
    
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
    
    return Array.from(ordersMap.values());
  } catch (error) {
    console.error('查询订单详情失败:', error.message);
    throw error;
  } finally {
    if (conn) {
      conn.closeSync();
    }
  }
}

// 使用示例
async function exampleQueries() {
  try {
    // 查询所有用户
    const allUsers = await findAllUsers();
    console.log('所有用户数量:', allUsers.length);
    
    // 条件查询
    const activeUsers = await findUsersByCondition({ active: true });
    console.log('活跃用户数量:', activeUsers.length);
    
    // 分页查询
    const paginatedUsers = await findUsersWithPagination(1, 5, { active: true });
    console.log('分页结果数量:', paginatedUsers.data.length);
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
const { poolManager } = require('./db2-pool');

// 更新单条记录
async function updateUser(id, updates) {
  let conn;
  try {
    conn = await poolManager.getConnection();
    
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
      params.push(updates.active ? 1 : 0);
    }
    
    if (fields.length === 0) {
      return { message: '没有要更新的字段' };
    }

    // 添加WHERE条件的参数
    params.push(id);
    
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    
    // 开始事务
    await conn.queryAsync('BEGIN WORK');
    
    try {
      // 执行更新
      await conn.queryAsync(sql, params);
      
      // 提交事务
      await conn.queryAsync('COMMIT WORK');
      
      // 查询更新后的数据
      const result = await conn.queryAsync('SELECT * FROM users WHERE id = ?', [id]);
      
      if (result.length === 0) {
        return { message: '用户不存在' };
      }
      
      return result[0];
    } catch (error) {
      // 回滚事务
      await conn.queryAsync('ROLLBACK WORK');
      throw error;
    }
  } catch (error) {
    console.error('更新用户失败:', error.message);
    throw error;
  } finally {
    if (conn) {
      conn.closeSync();
    }
  }
}

// 批量更新
async function updateMultipleUsers(ids, updates) {
  let conn;
  try {
    conn = await poolManager.getConnection();
    
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
      params.push(updates.active ? 1 : 0);
    }
    
    if (fields.length === 0) {
      return { message: '没有要更新的字段' };
    }

    // 构建ID列表字符串和参数
    const idPlaceholders = ids.map(() => '?').join(', ');
    const sqlParams = [...params, ...ids];
    
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id IN (${idPlaceholders})`;
    
    // 开始事务
    await conn.queryAsync('BEGIN WORK');
    
    try {
      // 执行更新
      await conn.queryAsync(sql, sqlParams);
      
      // 提交事务
      await conn.queryAsync('COMMIT WORK');
      
      return { updatedCount: ids.length };
    } catch (error) {
      // 回滚事务
      await conn.queryAsync('ROLLBACK WORK');
      throw error;
    }
  } catch (error) {
    console.error('批量更新用户失败:', error.message);
    throw error;
  } finally {
    if (conn) {
      conn.closeSync();
    }
  }
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
const { poolManager } = require('./db2-pool');

// 删除单条记录
async function deleteUser(id) {
  let conn;
  try {
    conn = await poolManager.getConnection();
    
    // 开始事务
    await conn.queryAsync('BEGIN WORK');
    
    try {
      // 首先检查记录是否存在
      const result = await conn.queryAsync('SELECT id FROM users WHERE id = ?', [id]);
      
      if (result.length === 0) {
        await conn.queryAsync('COMMIT WORK');
        return { message: '用户不存在' };
      }

      // 执行删除操作
      await conn.queryAsync('DELETE FROM users WHERE id = ?', [id]);
      
      // 提交事务
      await conn.queryAsync('COMMIT WORK');
      
      return { message: '用户删除成功' };
    } catch (error) {
      // 回滚事务
      await conn.queryAsync('ROLLBACK WORK');
      throw error;
    }
  } catch (error) {
    console.error('删除用户失败:', error.message);
    throw error;
  } finally {
    if (conn) {
      conn.closeSync();
    }
  }
}

// 批量删除
async function deleteMultipleUsers(ids) {
  let conn;
  try {
    conn = await poolManager.getConnection();
    
    // 构建ID列表字符串
    const idPlaceholders = ids.map(() => '?').join(', ');
    
    // 开始事务
    await conn.queryAsync('BEGIN WORK');
    
    try {
      // 执行删除操作
      await conn.queryAsync(
        `DELETE FROM users WHERE id IN (${idPlaceholders})`,
        ids
      );
      
      // 提交事务
      await conn.queryAsync('COMMIT WORK');
      
      return { deletedCount: ids.length };
    } catch (error) {
      // 回滚事务
      await conn.queryAsync('ROLLBACK WORK');
      throw error;
    }
  } catch (error) {
    console.error('批量删除用户失败:', error.message);
    throw error;
  } finally {
    if (conn) {
      conn.closeSync();
    }
  }
}

// 软删除（更新状态而不是实际删除）
async function softDeleteUser(id) {
  let conn;
  try {
    conn = await poolManager.getConnection();
    
    // 开始事务
    await conn.queryAsync('BEGIN WORK');
    
    try {
      // 检查用户是否存在
      const result = await conn.queryAsync('SELECT id FROM users WHERE id = ?', [id]);
      
      if (result.length === 0) {
        await conn.queryAsync('COMMIT WORK');
        return { message: '用户不存在' };
      }

      // 执行软删除（更新状态）
      await conn.queryAsync(
        'UPDATE users SET active = 0 WHERE id = ?',
        [id]
      );
      
      // 提交事务
      await conn.queryAsync('COMMIT WORK');
      
      return { message: '用户已软删除' };
    } catch (error) {
      // 回滚事务
      await conn.queryAsync('ROLLBACK WORK');
      throw error;
    }
  } catch (error) {
    console.error('软删除用户失败:', error.message);
    throw error;
  } finally {
    if (conn) {
      conn.closeSync();
    }
  }
}

// 使用示例
async function exampleDeletes() {
  try {
    // 软删除
    const softDeleteResult = await softDeleteUser(4);
    console.log('软删除结果:', softDeleteResult);

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

### 4.1 存储过程和函数

DB2 支持存储过程和用户定义函数，可以在数据库端实现复杂的业务逻辑。

```javascript
// stored-procedures.js
const { poolManager } = require('./db2-pool');

// 创建存储过程
async function createStoredProcedures() {
  let conn;
  try {
    conn = await poolManager.getConnection();
    
    // 创建存储过程的SQL语句
    const sqlStatements = [
      // 存储过程：获取用户信息
      `CREATE OR REPLACE PROCEDURE get_user(
        IN p_user_id INT,
        OUT o_id INT,
        OUT o_name VARCHAR(100),
        OUT o_email VARCHAR(100),
        OUT o_active SMALLINT
      )
      LANGUAGE SQL
      BEGIN
        SELECT id, name, email, active
        INTO o_id, o_name, o_email, o_active
        FROM users
        WHERE id = p_user_id;
      END`,
      
      // 存储过程：创建订单
      `CREATE OR REPLACE PROCEDURE create_order(
        IN p_user_id INT,
        OUT o_order_id INT,
        OUT o_order_date TIMESTAMP
      )
      LANGUAGE SQL
      BEGIN
        -- 生成订单ID
        SET o_order_id = NEXTVAL FOR seq_order_id;
        SET o_order_date = CURRENT TIMESTAMP;
        
        -- 插入订单记录
        INSERT INTO orders (id, user_id, order_date, total_amount, status)
        VALUES (o_order_id, p_user_id, o_order_date, 0, 'PENDING');
      END`,
      
      // 存储过程：添加订单项
      `CREATE OR REPLACE PROCEDURE add_order_item(
        IN p_order_id INT,
        IN p_product_id INT,
        IN p_quantity INT,
        OUT o_order_detail_id INT,
        OUT o_price DECIMAL(10, 2),
        OUT o_total_price DECIMAL(10, 2)
      )
      LANGUAGE SQL
      BEGIN
        DECLARE product_price DECIMAL(10, 2);
        DECLARE product_stock INT;
        
        -- 获取产品价格和库存
        SELECT p.price, p.stock
        INTO product_price, product_stock
        FROM products p
        WHERE p.id = p_product_id;
        
        -- 检查库存
        IF (product_stock < p_quantity) THEN
          SIGNAL SQLSTATE '70001'
          SET MESSAGE_TEXT = '库存不足';
        END IF;
        
        -- 生成订单项ID
        SET o_order_detail_id = NEXTVAL FOR seq_order_detail_id;
        SET o_price = product_price;
        SET o_total_price = product_price * p_quantity;
        
        -- 插入订单项
        INSERT INTO order_details (id, order_id, product_id, quantity, price)
        VALUES (o_order_detail_id, p_order_id, p_product_id, p_quantity, o_price);
        
        -- 更新产品库存
        UPDATE products
        SET stock = stock - p_quantity
        WHERE id = p_product_id;
        
        -- 更新订单总金额
        UPDATE orders
        SET total_amount = total_amount + o_total_price
        WHERE id = p_order_id;
      END`,
      
      // 存储过程：完成订单
      `CREATE OR REPLACE PROCEDURE complete_order(
        IN p_order_id INT,
        OUT o_success SMALLINT,
        OUT o_message VARCHAR(200)
      )
      LANGUAGE SQL
      BEGIN
        -- 检查订单状态
        IF (NOT EXISTS (SELECT 1 FROM orders WHERE id = p_order_id AND status = 'PENDING')) THEN
          SET o_success = 0;
          SET o_message = '订单不存在或状态不正确';
          RETURN;
        END IF;
        
        -- 更新订单状态
        UPDATE orders
        SET status = 'COMPLETED'
        WHERE id = p_order_id;
        
        SET o_success = 1;
        SET o_message = '订单已完成';
      END`,
      
      // 创建用户定义函数：计算订单总额
      `CREATE OR REPLACE FUNCTION calculate_order_total(
        p_order_id INT
      )
      RETURNS DECIMAL(10, 2)
      LANGUAGE SQL
      DETERMINISTIC
      CONTAINS SQL
      READS SQL DATA
      BEGIN
        DECLARE total_amount DECIMAL(10, 2);
        
        SELECT SUM(price * quantity)
        INTO total_amount
        FROM order_details
        WHERE order_id = p_order_id;
        
        RETURN COALESCE(total_amount, 0);
      END`
    ];

    // 依次执行SQL语句
    for (const sql of sqlStatements) {
      console.log(`执行SQL: ${sql.substring(0, 50)}...`);
      await conn.queryAsync(sql);
    }
    
    console.log('存储过程和函数创建完成');
    return { success: true };
  } catch (error) {
    console.error('创建存储过程失败:', error.message);
    throw error;
  } finally {
    if (conn) {
      conn.closeSync();
    }
  }
}

// 调用存储过程：获取用户信息
async function callGetUserProcedure(userId) {
  let conn;
  try {
    conn = await poolManager.getConnection();
    
    // 调用存储过程
    const result = await conn.queryAsync(`
      CALL get_user(?, ?, ?, ?, ?)
    `, [userId, null, null, null, null]);
    
    // 解析输出参数
    const outParams = result.outputParameters;
    return {
      id: outParams[0],
      name: outParams[1],
      email: outParams[2],
      active: outParams[3] === 1
    };
  } catch (error) {
    console.error('调用存储过程失败:', error.message);
    throw error;
  } finally {
    if (conn) {
      conn.closeSync();
    }
  }
}

// 调用存储过程：创建订单和添加订单项
async function createOrderWithItems(userId, items) {
  let conn;
  try {
    conn = await poolManager.getConnection();
    
    // 开始事务
    await conn.queryAsync('BEGIN WORK');
    
    try {
      // 第一步：创建订单
      const orderResult = await conn.queryAsync(`
        CALL create_order(?, ?, ?)
      `, [userId, null, null]);
      
      // 获取返回的订单ID和日期
      const orderOutParams = orderResult.outputParameters;
      const orderId = orderOutParams[0];
      const orderDate = orderOutParams[1];

      // 第二步：添加订单项
      const orderItems = [];
      
      for (const item of items) {
        const itemResult = await conn.queryAsync(`
          CALL add_order_item(?, ?, ?, ?, ?, ?)
        `, [orderId, item.product_id, item.quantity, null, null, null]);
        
        const itemOutParams = itemResult.outputParameters;
        orderItems.push({
          product_id: item.product_id,
          quantity: item.quantity,
          price: itemOutParams[1],
          total_price: itemOutParams[2],
          order_detail_id: itemOutParams[0]
        });
      }
      
      // 提交事务
      await conn.queryAsync('COMMIT WORK');
      
      return {
        order_id: orderId,
        order_date: orderDate,
        items: orderItems
      };
    } catch (error) {
      // 回滚事务
      await conn.queryAsync('ROLLBACK WORK');
      throw error;
    }
  } catch (error) {
    console.error('创建订单失败:', error.message);
    throw error;
  } finally {
    if (conn) {
      conn.closeSync();
    }
  }
}

// 使用示例
async function exampleStoredProcedures() {
  try {
    // 创建存储过程和函数
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

### 4.2 LOB 数据处理

DB2 支持 LOB（Large Object）数据类型，用于存储大型文本或二进制数据。