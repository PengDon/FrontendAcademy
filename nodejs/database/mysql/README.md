# MySQL 基础

## 1. MySQL 简介

MySQL 是一个开源的关系型数据库管理系统（RDBMS），由 Oracle 公司维护。它是最流行的关系型数据库之一，广泛应用于 Web 应用程序和服务器端数据存储。

### 1.1 MySQL 的特点

- **开源免费**：MySQL Community Edition 是免费开源的
- **关系型数据库**：基于关系模型，使用表存储数据
- **跨平台**：支持 Windows、Linux、macOS 等多种操作系统
- **高性能**：优化的存储引擎和查询优化器
- **可靠性**：支持事务、外键约束和数据完整性
- **可扩展性**：支持复制、分区和集群
- **丰富的功能**：支持存储过程、触发器、视图等

### 1.2 MySQL 存储引擎

MySQL 支持多种存储引擎，每种引擎有不同的特性和用途：

- **InnoDB**：默认存储引擎，支持事务、行级锁定和外键约束
- **MyISAM**：不支持事务，但读取性能较好，适用于只读场景
- **MEMORY**：将数据存储在内存中，适用于临时表和高速访问
- **CSV**：将数据存储为 CSV 文件，适用于数据交换
- **Archive**：用于存储大量归档数据，压缩率高

## 2. 核心概念

### 2.1 数据库（Database）

数据库是表的集合，是存储和管理数据的容器。

### 2.2 表（Table）

表是数据的矩阵，由行和列组成，用于存储特定类型的数据。

### 2.3 行（Row）

行是表中的一条记录，包含一组相关的数据。

### 2.4 列（Column）

列是表中的一个字段，定义了数据的类型和属性。

### 2.5 主键（Primary Key）

主键是唯一标识表中每行数据的列或列组合，确保行的唯一性。

### 2.6 外键（Foreign Key）

外键是表中的一个列，引用另一个表的主键，用于建立表之间的关系。

### 2.7 索引（Index）

索引是一种数据结构，用于加速数据库查询，类似于书籍的目录。

### 2.8 事务（Transaction）

事务是一组原子性的 SQL 操作，要么全部成功执行，要么全部回滚。

## 3. 基本 SQL 语句

### 3.1 数据库操作

```sql
-- 创建数据库
CREATE DATABASE mydb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE mydb;

-- 删除数据库
DROP DATABASE mydb;

-- 显示所有数据库
SHOW DATABASES;
```

### 3.2 表操作

```sql
-- 创建表
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  age INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 查看表结构
DESCRIBE users;

-- 修改表（添加列）
ALTER TABLE users ADD COLUMN phone VARCHAR(20);

-- 修改表（修改列）
ALTER TABLE users MODIFY COLUMN age INT NOT NULL DEFAULT 0;

-- 修改表（删除列）
ALTER TABLE users DROP COLUMN phone;

-- 删除表
DROP TABLE users;

-- 显示所有表
SHOW TABLES;
```

### 3.3 数据操作（CRUD）

```sql
-- 插入数据
INSERT INTO users (username, email, password, age) VALUES
('zhangsan', 'zhangsan@example.com', 'password123', 30),
('lisi', 'lisi@example.com', 'password456', 25);

-- 查询数据
SELECT * FROM users;
SELECT id, username, email FROM users WHERE age > 25;
SELECT * FROM users ORDER BY age DESC LIMIT 10;
SELECT COUNT(*) FROM users;

-- 更新数据
UPDATE users SET age = 31 WHERE username = 'zhangsan';
UPDATE users SET age = age + 1 WHERE age > 25;

-- 删除数据
DELETE FROM users WHERE id = 1;
DELETE FROM users WHERE age < 18;
```

### 3.4 高级查询

```sql
-- 分组和聚合
SELECT age, COUNT(*) as user_count FROM users GROUP BY age;
SELECT MAX(age), MIN(age), AVG(age) FROM users;

-- 连接查询
SELECT u.username, o.order_id, o.total_amount 
FROM users u
JOIN orders o ON u.id = o.user_id;

-- 子查询
SELECT username FROM users WHERE age > (SELECT AVG(age) FROM users);

-- 条件查询
SELECT * FROM users WHERE age BETWEEN 20 AND 30;
SELECT * FROM users WHERE username LIKE 'z%';
SELECT * FROM users WHERE age IN (25, 30, 35);
```

## 4. Node.js 中使用 MySQL

### 4.1 安装 MySQL 驱动

```bash
npm install mysql2
```

### 4.2 基本连接和操作

```javascript
const mysql = require('mysql2');

// 创建连接池
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'your-password',
  database: 'mydb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 获取 promise 版本的连接
const promisePool = pool.promise();

async function main() {
  try {
    // 插入数据
    const [insertResult] = await promisePool.query(
      'INSERT INTO users (username, email, password, age) VALUES (?, ?, ?, ?)',
      ['wangwu', 'wangwu@example.com', 'hashed-password', 28]
    );
    console.log('插入的用户 ID:', insertResult.insertId);

    // 查询数据
    const [users] = await promisePool.query('SELECT * FROM users WHERE age > ?', [25]);
    console.log('找到的用户:', users);

    // 更新数据
    const [updateResult] = await promisePool.query(
      'UPDATE users SET age = ? WHERE username = ?',
      [29, 'wangwu']
    );
    console.log('更新的行数:', updateResult.affectedRows);

    // 删除数据
    const [deleteResult] = await promisePool.query(
      'DELETE FROM users WHERE username = ?',
      ['wangwu']
    );
    console.log('删除的行数:', deleteResult.affectedRows);

  } catch (error) {
    console.error('发生错误:', error);
  }
}

main().catch(console.error);
```

### 4.3 使用 Sequelize ORM

Sequelize 是一个功能强大的 ORM（对象关系映射）库，提供了更高级别的抽象。

#### 安装 Sequelize

```bash
npm install sequelize mysql2
```

#### 基本使用

```javascript
const { Sequelize, DataTypes } = require('sequelize');

// 创建 Sequelize 实例
const sequelize = new Sequelize('mydb', 'root', 'your-password', {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// 定义模型
const User = sequelize.define('User', {
  // Model attributes are defined here
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  age: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  // Other model options go here
  timestamps: true,
  underscored: true
});

async function main() {
  try {
    // 自动创建表（如果不存在）
    await sequelize.sync();
    console.log('表已同步');

    // 创建用户
    const user = await User.create({
      username: 'zhaoliu',
      email: 'zhaoliu@example.com',
      password: 'hashed-password',
      age: 32
    });
    console.log('创建的用户:', user.toJSON());

    // 查询用户
    const foundUser = await User.findOne({
      where: { username: 'zhaoliu' }
    });
    console.log('找到的用户:', foundUser?.toJSON());

    // 更新用户
    await User.update({ age: 33 }, {
      where: { username: 'zhaoliu' }
    });
    console.log('用户已更新');

    // 删除用户
    await User.destroy({
      where: { username: 'zhaoliu' }
    });
    console.log('用户已删除');

    // 高级查询
    const users = await User.findAll({
      where: {
        age: {
          [Sequelize.Op.gt]: 25
        }
      },
      order: [['age', 'DESC']],
      limit: 10
    });
    console.log('查询结果:', users.map(user => user.toJSON()));

  } catch (error) {
    console.error('发生错误:', error);
  } finally {
    // 关闭连接
    await sequelize.close();
  }
}

main().catch(console.error);
```

## 5. 事务管理

### 5.1 使用原生 MySQL 驱动

```javascript
async function withTransaction() {
  const connection = await promisePool.getConnection();
  
  try {
    // 开始事务
    await connection.beginTransaction();
    
    // 执行多个 SQL 语句
    await connection.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      ['newuser', 'newuser@example.com', 'password']
    );
    
    await connection.query(
      'INSERT INTO orders (user_id, total_amount) VALUES (?, ?)',
      [1, 100.00]
    );
    
    // 提交事务
    await connection.commit();
    console.log('事务提交成功');
  } catch (error) {
    // 回滚事务
    await connection.rollback();
    console.error('事务回滚:', error);
  } finally {
    // 释放连接
    connection.release();
  }
}
```

### 5.2 使用 Sequelize

```javascript
async function sequelizeTransaction() {
  try {
    // 开始事务
    const result = await sequelize.transaction(async (t) => {
      // 在事务中创建用户
      const user = await User.create({
        username: 'transuser',
        email: 'trans@example.com',
        password: 'password'
      }, { transaction: t });
      
      // 在事务中创建订单
      const order = await Order.create({
        user_id: user.id,
        total_amount: 150.00
      }, { transaction: t });
      
      return { user, order };
    });
    
    console.log('事务成功:', result);
  } catch (error) {
    // 如果抛出错误，Sequelize 会自动回滚事务
    console.error('事务失败，自动回滚:', error);
  }
}
```

## 6. 性能优化

### 6.1 索引优化

```sql
-- 创建索引
CREATE INDEX idx_username ON users(username);

-- 创建复合索引
CREATE INDEX idx_age_created ON users(age, created_at);

-- 创建唯一索引
CREATE UNIQUE INDEX idx_email ON users(email);

-- 删除索引
DROP INDEX idx_username ON users;

-- 查看索引
SHOW INDEX FROM users;
```

### 6.2 查询优化

- 使用索引加速查询
- 避免在 WHERE 子句中对索引列使用函数
- 只查询需要的列，避免 SELECT *
- 使用 LIMIT 限制返回的行数
- 避免在大型表上使用 ORDER BY 和 GROUP BY 不使用索引的列
- 使用 EXPLAIN 分析查询执行计划

```sql
-- 分析查询执行计划
EXPLAIN SELECT * FROM users WHERE age > 25;
```

### 6.3 数据库结构优化

- 合理设计表结构，避免冗余字段
- 使用适当的数据类型，避免过度设计
- 对大表进行分区
- 定期优化表和重建索引

```sql
-- 优化表
OPTIMIZE TABLE users;

-- 重建索引
ALTER TABLE users ENGINE=InnoDB;
```

## 7. 安全最佳实践

### 7.1 用户权限管理

```sql
-- 创建用户
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'password';

-- 授予权限
GRANT SELECT, INSERT, UPDATE ON mydb.* TO 'app_user'@'localhost';

-- 撤销权限
REVOKE DELETE ON mydb.* FROM 'app_user'@'localhost';

-- 删除用户
DROP USER 'app_user'@'localhost';

-- 刷新权限
FLUSH PRIVILEGES;
```

### 7.2 数据安全

- 使用参数化查询防止 SQL 注入
- 对敏感数据进行加密存储
- 定期备份数据库
- 使用 SSL/TLS 加密连接
- 限制数据库用户的主机访问

### 7.3 防止 SQL 注入

```javascript
// 错误示例（不安全）
const query = `SELECT * FROM users WHERE username = '${username}'`;

// 正确示例（使用参数化查询）
const [users] = await promisePool.query(
  'SELECT * FROM users WHERE username = ?',
  [username]
);
```

## 8. 备份和恢复

### 8.1 使用 mysqldump 备份

```bash
# 备份整个数据库
mysqldump -u root -p mydb > mydb_backup.sql

# 备份特定表
mysqldump -u root -p mydb users orders > specific_tables_backup.sql

# 备份所有数据库
mysqldump -u root -p --all-databases > all_databases_backup.sql
```

### 8.2 恢复数据库

```bash
# 恢复数据库
mysql -u root -p mydb < mydb_backup.sql
```

### 8.3 自动备份脚本

```bash
#!/bin/bash

BACKUP_DIR="/backup/mysql"
DATE=$(date +%Y%m%d_%H%M%S)
MYSQL_USER="root"
MYSQL_PASS="your-password"
DB_NAME="mydb"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 执行备份
mysqldump -u $MYSQL_USER -p$MYSQL_PASS $DB_NAME > $BACKUP_DIR/${DB_NAME}_${DATE}.sql

# 压缩备份文件
gzip $BACKUP_DIR/${DB_NAME}_${DATE}.sql

# 删除 7 天前的备份
find $BACKUP_DIR -name "${DB_NAME}_*.sql.gz" -type f -mtime +7 -delete

echo "备份完成: $BACKUP_DIR/${DB_NAME}_${DATE}.sql.gz"
```

## 9. 高可用性和扩展性

### 9.1 主从复制

主从复制允许数据从一个 MySQL 服务器（主服务器）复制到一个或多个 MySQL 服务器（从服务器）。

**主服务器配置**:
```ini
# my.cnf
server-id = 1
log-bin = mysql-bin
binlog-format = ROW
```

**从服务器配置**:
```ini
# my.cnf
server-id = 2
relay-log = mysql-relay-bin
read-only = 1
```

**设置复制**:
```sql
-- 在主服务器上创建复制用户
CREATE USER 'repl_user'@'%' IDENTIFIED BY 'password';
GRANT REPLICATION SLAVE ON *.* TO 'repl_user'@'%';

-- 获取主服务器状态
SHOW MASTER STATUS;

-- 在从服务器上配置复制
CHANGE MASTER TO
  MASTER_HOST='master_ip',
  MASTER_USER='repl_user',
  MASTER_PASSWORD='password',
  MASTER_LOG_FILE='mysql-bin.000001',
  MASTER_LOG_POS=154;

-- 启动从服务器复制进程
START SLAVE;

-- 检查从服务器状态
SHOW SLAVE STATUS\G
```

### 9.2 读写分离

读写分离是一种常见的数据库架构模式，将读操作分发到从服务器，写操作发送到主服务器，以提高系统性能和可用性。

### 9.3 数据库集群

MySQL 提供了多种集群解决方案：
- MySQL NDB Cluster
- MySQL InnoDB Cluster
- ProxySQL + 多节点复制

## 10. 参考资源

- [MySQL 官方文档](https://dev.mysql.com/doc/)
- [MySQL 教程](https://www.mysql.com/why-mysql/white-papers/mysql-database-administration/)
- [Sequelize 文档](https://sequelize.org/master/)
- [MySQL 性能优化](https://dev.mysql.com/doc/refman/8.0/en/optimization.html)