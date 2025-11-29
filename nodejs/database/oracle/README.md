# Oracle 与 Node.js 集成

## 1. Oracle 数据库基础

Oracle Database是全球领先的企业级关系型数据库管理系统，以其高性能、高可用性、安全性和可扩展性而闻名。Oracle提供了丰富的企业级功能，支持复杂的数据管理需求。

### 1.1 Oracle 数据库的主要特性

- **高性能**：通过多版本并发控制(MVCC)、高级索引技术和并行处理提供卓越性能
- **高可用性**：提供Real Application Clusters (RAC)、Data Guard和自动故障恢复功能
- **可扩展性**：支持从小型部署到企业级数据中心的无缝扩展
- **安全性**：提供细粒度访问控制、透明数据加密(TDE)和审计功能
- **多模型支持**：除关系数据外，还支持JSON、XML、空间数据和图数据
- **分析能力**：内置强大的数据分析和数据仓库功能
- **高级存储技术**：支持自动存储管理(ASM)和分区表技术

### 1.2 Oracle 的应用场景

- **企业资源规划(ERP)系统**：如SAP、Oracle E-Business Suite
- **客户关系管理(CRM)系统**：大型CRM平台的后端数据库
- **金融服务**：银行交易系统、风险管理和合规性应用
- **电信**：计费系统、客户数据管理和网络配置
- **数据仓库**：企业级数据分析和商业智能平台
- **电子商务平台**：高流量在线交易系统
- **医疗保健**：患者记录管理和医疗数据分析系统

## 2. Node.js 中使用 Oracle

### 2.1 安装依赖

```bash
# 安装 Node.js Oracle 数据库驱动
npm install oracledb
```

### 2.2 环境配置

在使用`oracledb`之前，需要确保系统已安装Oracle客户端库。有两种主要方式：

1. **安装完整的 Oracle 客户端**：适用于生产环境
2. **安装 Oracle 即时客户端**：轻量级选择，适用于大多数场景

**Windows 环境配置步骤**：
1. 下载并解压 Oracle Instant Client（推荐19.10或更高版本）
2. 设置PATH环境变量指向解压目录
3. 设置TNS_ADMIN环境变量（可选，用于tnsnames.ora文件）

### 2.3 基本连接配置

```javascript
const oracledb = require('oracledb');

// 配置项
const config = {
  user: process.env.ORACLE_USER || 'hr',
  password: process.env.ORACLE_PASSWORD || 'welcome',
  connectString: process.env.ORACLE_CONNECTION_STRING || 'localhost:1521/orclpdb1',
  // 连接池配置
  poolMax: 10,
  poolMin: 2,
  poolTimeout: 60
};

// 初始化连接池
async function initPool() {
  try {
    await oracledb.createPool(config);
    console.log('Oracle 连接池已创建');
    return true;
  } catch (error) {
    console.error('创建 Oracle 连接池失败:', error);
    return false;
  }
}

// 从连接池获取连接
async function getConnection() {
  try {
    return await oracledb.getConnection();
  } catch (error) {
    console.error('获取 Oracle 连接失败:', error);
    throw error;
  }
}

// 关闭连接池
async function closePool() {
  try {
    await oracledb.getPool().close(30); // 30秒超时
    console.log('Oracle 连接池已关闭');
  } catch (error) {
    console.error('关闭 Oracle 连接池失败:', error);
  }
}

// 验证连接
async function testConnection() {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute('SELECT SYSDATE FROM DUAL');
    console.log('连接成功，当前 Oracle 时间:', result.rows[0][0]);
    return true;
  } catch (error) {
    console.error('Oracle 连接测试失败:', error);
    return false;
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log('连接已关闭');
      } catch (err) {
        console.error('关闭连接失败:', err);
      }
    }
  }
}

// 运行示例
async function runExample() {
  const poolCreated = await initPool();
  if (poolCreated) {
    await testConnection();
    // 应用结束时关闭连接池
    // await closePool();
  }
}

// runExample().catch(console.error);
```

## 3. 核心数据操作（CRUD）

### 3.1 创建表

```javascript
async function createTables() {
  let connection;
  try {
    connection = await getConnection();
    
    // 创建部门表
    await connection.execute(`
      CREATE TABLE departments (
        department_id NUMBER(4) PRIMARY KEY,
        department_name VARCHAR2(30) NOT NULL,
        manager_id NUMBER(6),
        location_id NUMBER(4)
      )
    `);
    console.log('创建 departments 表成功');
    
    // 创建员工表
    await connection.execute(`
      CREATE TABLE employees (
        employee_id NUMBER(6) PRIMARY KEY,
        first_name VARCHAR2(20),
        last_name VARCHAR2(25) NOT NULL,
        email VARCHAR2(100) NOT NULL UNIQUE,
        phone_number VARCHAR2(20),
        hire_date DATE DEFAULT SYSDATE,
        job_id VARCHAR2(10) NOT NULL,
        salary NUMBER(8,2),
        commission_pct NUMBER(2,2),
        manager_id NUMBER(6),
        department_id NUMBER(4),
        FOREIGN KEY (department_id) REFERENCES departments(department_id)
      )
    `);
    console.log('创建 employees 表成功');
    
    // 创建索引
    await connection.execute(`
      CREATE INDEX emp_department_ix ON employees(department_id)
    `);
    console.log('创建索引成功');
    
  } catch (error) {
    console.error('创建表失败:', error);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}
```

### 3.2 插入数据（INSERT）

```javascript
async function insertData() {
  let connection;
  try {
    connection = await getConnection();
    
    // 插入部门数据
    const departmentSQL = `
      INSERT INTO departments (department_id, department_name, manager_id, location_id)
      VALUES (:department_id, :department_name, :manager_id, :location_id)
    `;
    
    await connection.execute(departmentSQL, {
      department_id: 60,
      department_name: 'IT',
      manager_id: null,
      location_id: 1400
    });
    
    await connection.execute(departmentSQL, {
      department_id: 70,
      department_name: 'Marketing',
      manager_id: null,
      location_id: 1700
    });
    
    // 插入员工数据（使用批处理）
    const employeeSQL = `
      INSERT INTO employees (employee_id, first_name, last_name, email, job_id, salary, department_id)
      VALUES (:employee_id, :first_name, :last_name, :email, :job_id, :salary, :department_id)
    `;
    
    const employees = [
      { employee_id: 1001, first_name: '张三', last_name: '张', email: 'zhangsan@example.com', job_id: 'IT_PROG', salary: 8000, department_id: 60 },
      { employee_id: 1002, first_name: '李四', last_name: '李', email: 'lisi@example.com', job_id: 'IT_PROG', salary: 7500, department_id: 60 },
      { employee_id: 1003, first_name: '王五', last_name: '王', email: 'wangwu@example.com', job_id: 'MK_REP', salary: 6500, department_id: 70 }
    ];
    
    // 开始事务
    await connection.execute('BEGIN');
    
    for (const emp of employees) {
      await connection.execute(employeeSQL, emp);
    }
    
    // 提交事务
    await connection.execute('COMMIT');
    console.log('成功插入员工数据');
    
    // 更新部门经理
    await connection.execute(`
      UPDATE departments
      SET manager_id = :manager_id
      WHERE department_id = :department_id
    `, { manager_id: 1001, department_id: 60 });
    
    console.log('部门经理信息已更新');
    
  } catch (error) {
    // 如果出错，回滚事务
    if (connection) {
      await connection.execute('ROLLBACK');
    }
    console.error('插入数据失败:', error);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}
```

### 3.3 查询数据（SELECT）

```javascript
async function queryData() {
  let connection;
  try {
    connection = await getConnection();
    
    // 基本查询
    const result1 = await connection.execute(
      `SELECT employee_id, first_name, last_name, email, salary
       FROM employees
       WHERE department_id = :dept_id
       ORDER BY last_name`,
      { dept_id: 60 }
    );
    
    console.log('IT部门员工:');
    result1.rows.forEach(row => {
      console.log(`ID: ${row[0]}, 姓名: ${row[1]} ${row[2]}, 邮箱: ${row[3]}, 薪资: ${row[4]}`);
    });
    
    // 使用游标获取大型结果集
    const result2 = await connection.execute(
      `SELECT e.employee_id, e.last_name, e.salary, d.department_name
       FROM employees e
       JOIN departments d ON e.department_id = d.department_id
       WHERE e.salary > :min_salary`,
      { min_salary: 7000 },
      { resultSet: true, prefetchRows: 100 } // 启用结果集和预取
    );
    
    const rs = result2.resultSet;
    let row;
    console.log('\n高薪员工列表:');
    
    while ((row = await rs.getRow())) {
      console.log(`ID: ${row[0]}, 姓名: ${row[1]}, 薪资: ${row[2]}, 部门: ${row[3]}`);
    }
    
    // 关闭结果集
    await rs.close();
    
    // 聚合查询
    const result3 = await connection.execute(
      `SELECT d.department_name, COUNT(*) as employee_count, AVG(e.salary) as avg_salary
       FROM employees e
       JOIN departments d ON e.department_id = d.department_id
       GROUP BY d.department_name
       ORDER BY employee_count DESC`
    );
    
    console.log('\n各部门统计:');
    result3.rows.forEach(row => {
      console.log(`部门: ${row[0]}, 人数: ${row[1]}, 平均薪资: ${row[2].toFixed(2)}`);
    });
    
  } catch (error) {
    console.error('查询数据失败:', error);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}
```

### 3.4 更新数据（UPDATE）

```javascript
async function updateData() {
  let connection;
  try {
    connection = await getConnection();
    
    // 基本更新
    const result1 = await connection.execute(
      `UPDATE employees
       SET salary = salary * 1.1
       WHERE department_id = :dept_id
       RETURNING employee_id, first_name, last_name, salary INTO :id, :first_name, :last_name, :new_salary`,
      {
        dept_id: 60,
        id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
        first_name: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
        last_name: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
        new_salary: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
      }
    );
    
    console.log(`更新的员工数量: ${result1.rowsAffected}`);
    if (result1.outBinds) {
      console.log(`更新示例: ${result1.outBinds.first_name} ${result1.outBinds.last_name}, 新薪资: ${result1.outBinds.new_salary}`);
    }
    
    // 条件更新与事务
    await connection.execute('BEGIN');
    
    // 增加特定员工的薪资
    await connection.execute(
      `UPDATE employees
       SET salary = salary + :increment,
           last_name = :new_last_name
       WHERE employee_id = :emp_id`,
      { increment: 500, new_last_name: '张伟', emp_id: 1001 }
    );
    
    // 更新关联数据
    await connection.execute(
      `UPDATE departments
       SET department_name = :new_name
       WHERE department_id = :dept_id`,
      { new_name: '信息技术部', dept_id: 60 }
    );
    
    // 提交事务
    await connection.execute('COMMIT');
    console.log('事务已提交');
    
  } catch (error) {
    // 发生错误时回滚
    if (connection) {
      await connection.execute('ROLLBACK');
      console.log('事务已回滚');
    }
    console.error('更新数据失败:', error);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}
```

### 3.5 删除数据（DELETE）

```javascript
async function deleteData() {
  let connection;
  try {
    connection = await getConnection();
    
    // 删除特定记录
    const result1 = await connection.execute(
      `DELETE FROM employees
       WHERE employee_id = :emp_id`,
      { emp_id: 1003 }
    );
    
    console.log(`删除的记录数: ${result1.rowsAffected}`);
    
    // 使用事务删除多个表中的相关数据
    await connection.execute('BEGIN');
    
    // 首先删除员工记录
    await connection.execute(
      `DELETE FROM employees
       WHERE department_id = :dept_id`,
      { dept_id: 70 }
    );
    
    // 然后删除部门记录
    await connection.execute(
      `DELETE FROM departments
       WHERE department_id = :dept_id`,
      { dept_id: 70 }
    );
    
    // 提交事务
    await connection.execute('COMMIT');
    console.log('部门70及其员工已成功删除');
    
    // 带条件的批量删除
    const result2 = await connection.execute(
      `DELETE FROM employees
       WHERE hire_date < :cutoff_date`,
      { cutoff_date: new Date('2022-01-01') }
    );
    
    console.log(`删除的旧员工记录数: ${result2.rowsAffected}`);
    
  } catch (error) {
    // 发生错误时回滚
    if (connection) {
      await connection.execute('ROLLBACK');
      console.log('事务已回滚');
    }
    console.error('删除数据失败:', error);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}
```

## 4. 高级 Oracle 功能

### 4.1 使用 PL/SQL 块

```javascript
async function usePLSQL() {
  let connection;
  try {
    connection = await getConnection();
    
    // 执行简单的 PL/SQL 块
    const result1 = await connection.execute(`
      DECLARE
        v_employee_count NUMBER;
        v_avg_salary NUMBER;
      BEGIN
        SELECT COUNT(*), AVG(salary)
        INTO v_employee_count, v_avg_salary
        FROM employees;
        
        :employee_count := v_employee_count;
        :avg_salary := v_avg_salary;
      END;
    `, {
      employee_count: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
      avg_salary: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
    });
    
    console.log(`总员工数: ${result1.outBinds.employee_count}`);
    console.log(`平均薪资: ${result1.outBinds.avg_salary.toFixed(2)}`);
    
    // 使用 PL/SQL 过程
    await connection.execute(`
      CREATE OR REPLACE PROCEDURE get_department_stats(
        p_dept_id IN NUMBER,
        p_count OUT NUMBER,
        p_min_salary OUT NUMBER,
        p_max_salary OUT NUMBER
      ) AS
      BEGIN
        SELECT COUNT(*), MIN(salary), MAX(salary)
        INTO p_count, p_min_salary, p_max_salary
        FROM employees
        WHERE department_id = p_dept_id;
      END get_department_stats;
    `);
    console.log('PL/SQL 过程已创建');
    
    // 调用存储过程
    const result2 = await connection.execute(
      `BEGIN
         get_department_stats(:dept_id, :count, :min_sal, :max_sal);
       END;`,
      {
        dept_id: 60,
        count: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
        min_sal: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
        max_sal: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
      }
    );
    
    console.log('部门 60 统计:');
    console.log(`员工数: ${result2.outBinds.count}`);
    console.log(`最低薪资: ${result2.outBinds.min_sal}`);
    console.log(`最高薪资: ${result2.outBinds.max_sal}`);
    
  } catch (error) {
    console.error('执行 PL/SQL 失败:', error);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}
```

### 4.2 处理 LOB 数据（BLOB 和 CLOB）

```javascript
async function handleLOBs() {
  let connection;
  try {
    connection = await getConnection();
    
    // 创建包含 LOB 列的表
    await connection.execute(`
      CREATE TABLE documents (
        doc_id NUMBER PRIMARY KEY,
        doc_name VARCHAR2(100),
        doc_text CLOB,
        doc_image BLOB,
        created_date DATE DEFAULT SYSDATE
      )
    `);
    console.log('Documents 表已创建');
    
    // 插入 CLOB 数据
    const longText = '这是一个很长的文本内容...'.repeat(100); // 创建一个长文本
    
    const result1 = await connection.execute(
      `INSERT INTO documents (doc_id, doc_name, doc_text)
       VALUES (:doc_id, :doc_name, :doc_text)`,
      {
        doc_id: 1,
        doc_name: '长文本文档.txt',
        doc_text: { val: longText, type: oracledb.CLOB }
      }
    );
    
    console.log(`已插入 CLOB 数据，受影响行数: ${result1.rowsAffected}`);
    
    // 插入 BLOB 数据（模拟二进制数据）
    const binaryData = Buffer.from('这是模拟的二进制数据，实际应用中可能是图片、PDF等', 'utf8');
    
    const result2 = await connection.execute(
      `INSERT INTO documents (doc_id, doc_name, doc_image)
       VALUES (:doc_id, :doc_name, :doc_image)`,
      {
        doc_id: 2,
        doc_name: '二进制文件.bin',
        doc_image: { val: binaryData, type: oracledb.BLOB }
      }
    );
    
    console.log(`已插入 BLOB 数据，受影响行数: ${result2.rowsAffected}`);
    
    // 读取 CLOB 数据
    const clobResult = await connection.execute(
      `SELECT doc_text FROM documents WHERE doc_id = :doc_id`,
      { doc_id: 1 },
      { fetchInfo: { "DOC_TEXT": { type: oracledb.STRING } } } // 将 CLOB 转换为字符串
    );
    
    if (clobResult.rows.length > 0) {
      const text = clobResult.rows[0][0];
      console.log(`读取的 CLOB 内容长度: ${text.length} 字符`);
      console.log(`内容预览: ${text.substring(0, 100)}...`);
    }
    
    // 读取 BLOB 数据
    const blobResult = await connection.execute(
      `SELECT doc_image FROM documents WHERE doc_id = :doc_id`,
      { doc_id: 2 },
      { fetchInfo: { "DOC_IMAGE": { type: oracledb.BUFFER } } } // 将 BLOB 转换为 Buffer
    );
    
    if (blobResult.rows.length > 0) {
      const buffer = blobResult.rows[0][0];
      console.log(`读取的 BLOB 数据大小: ${buffer.length} 字节`);
      // 在实际应用中，这里可能会将二进制数据保存到文件或发送给客户端
    }
    
  } catch (error) {
    console.error('处理 LOB 数据失败:', error);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}
```

### 4.3 使用高级数据类型

```javascript
async function useAdvancedDataTypes() {
  let connection;
  try {
    connection = await getConnection();
    
    // 创建包含高级数据类型的表
    await connection.execute(`
      CREATE TABLE advanced_data (
        id NUMBER PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        data_json CLOB,
        coordinates SDO_GEOMETRY
      )
    `);
    console.log('高级数据类型表已创建');
    
    // 插入 JSON 数据（存储为 CLOB）
    const jsonData = JSON.stringify({
      name: '测试产品',
      price: 999.99,
      categories: ['电子产品', '配件'],
      available: true,
      specs: {
        weight: 0.5,
        dimensions: {
          length: 10,
          width: 5,
          height: 2
        }
      }
    });
    
    await connection.execute(
      `INSERT INTO advanced_data (id, data_json)
       VALUES (:id, :data_json)`,
      { id: 1, data_json: jsonData }
    );
    console.log('JSON 数据已插入');
    
    // 使用 Oracle 的 JSON 函数查询（如果是 Oracle 12c+）
    try {
      const jsonQueryResult = await connection.execute(
        `SELECT JSON_VALUE(data_json, '$.name') as product_name,
                JSON_VALUE(data_json, '$.price') as product_price,
                JSON_QUERY(data_json, '$.categories[*]') as categories
         FROM advanced_data
         WHERE id = :id`,
        { id: 1 }
      );
      
      if (jsonQueryResult.rows.length > 0) {
        const row = jsonQueryResult.rows[0];
        console.log(`产品名称: ${row[0]}`);
        console.log(`产品价格: ${row[1]}`);
        console.log(`产品类别: ${row[2]}`);
      }
    } catch (e) {
      console.log('JSON 函数查询可能需要 Oracle 12c 或更高版本:', e.message);
    }
    
    // 处理 TIMESTAMP 类型
    const timestampResult = await connection.execute(
      `INSERT INTO advanced_data (id) VALUES (:id) RETURNING created_at INTO :created_at`,
      {
        id: 2,
        created_at: { type: oracledb.TIMESTAMP, dir: oracledb.BIND_OUT }
      }
    );
    
    console.log('记录创建时间:', timestampResult.outBinds.created_at);
    
    // 处理 INTERVAL 类型
    const intervalResult = await connection.execute(
      `SELECT (CURRENT_TIMESTAMP - (SELECT created_at FROM advanced_data WHERE id = :id)) as time_diff
       FROM DUAL`,
      { id: 1 }
    );
    
    if (intervalResult.rows.length > 0) {
      console.log('记录存在时间间隔:', intervalResult.rows[0][0]);
    }
    
  } catch (error) {
    console.error('使用高级数据类型失败:', error);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}
```

## 5. 连接池和事务管理

### 5.1 高级连接池配置

```javascript
// 优化的连接池配置
function configureOptimizedPool() {
  // 从环境变量或配置文件读取配置
  const poolConfig = {
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: process.env.ORACLE_CONNECTION_STRING,
    
    // 连接池大小设置
    poolMax: 20,                    // 最大连接数
    poolMin: 2,                     // 最小空闲连接数
    poolTimeout: 60,                // 连接空闲超时时间（秒）
    poolPingInterval: 60,           // 连接健康检查间隔（秒）
    poolAlias: 'oraclePool',        // 连接池别名
    
    // 连接属性
    stmtCacheSize: 30,              // 语句缓存大小
    enableStatistics: true,         // 启用连接池统计
    
    // 其他高级设置
    queueRequests: true,            // 启用请求队列
    queueTimeout: 60000,            // 请求队列超时（毫秒）
    
    // 网络设置
    connectionTimeout: 15000,       // 建立连接超时时间（毫秒）
  };
  
  console.log('连接池配置已创建，最大连接数:', poolConfig.poolMax);
  
  return poolConfig;
}

// 连接池监控和管理
class OraclePoolManager {
  constructor() {
    this.isInitialized = false;
  }
  
  async initialize() {
    if (!this.isInitialized) {
      const poolConfig = configureOptimizedPool();
      await oracledb.createPool(poolConfig);
      this.isInitialized = true;
      console.log('Oracle 连接池已初始化');
    }
    return this;
  }
  
  async getConnection() {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return await oracledb.getConnection('oraclePool');
  }
  
  async close() {
    if (this.isInitialized) {
      await oracledb.getPool('oraclePool').close(10); // 10秒超时
      this.isInitialized = false;
      console.log('Oracle 连接池已关闭');
    }
  }
  
  async getPoolStats() {
    if (this.isInitialized) {
      const pool = oracledb.getPool('oraclePool');
      const stats = pool.getStatistics();
      return {
        poolAlias: stats.poolAlias,
        totalConnections: stats.connectionsInUse + stats.connectionsOpen - stats.connectionsInUse,
        connectionsInUse: stats.connectionsInUse,
        connectionsOpen: stats.connectionsOpen,
        requestsQueued: stats.requestsQueued,
        maxConnections: pool.poolMax
      };
    }
    return null;
  }
  
  // 执行定期健康检查
  async healthCheck() {
    let connection;
    try {
      connection = await this.getConnection();
      await connection.execute('SELECT 1 FROM DUAL');
      console.log('Oracle 连接池健康检查: 正常');
      return { status: 'healthy' };
    } catch (error) {
      console.error('Oracle 连接池健康检查失败:', error);
      return { status: 'unhealthy', error: error.message };
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }
}

// 使用示例
async function poolManagerExample() {
  const poolManager = new OraclePoolManager();
  
  try {
    // 初始化连接池
    await poolManager.initialize();
    
    // 获取连接并使用
    const connection = await poolManager.getConnection();
    try {
      const result = await connection.execute('SELECT SYSDATE FROM DUAL');
      console.log('使用连接池连接成功:', result.rows[0][0]);
    } finally {
      await connection.close();
    }
    
    // 显示连接池状态
    const stats = await poolManager.getPoolStats();
    console.log('连接池状态:', stats);
    
    // 执行健康检查
    await poolManager.healthCheck();
    
  } catch (error) {
    console.error('连接池管理示例失败:', error);
  } finally {
    // 应用程序结束时关闭连接池
    // await poolManager.close();
  }
}
```

### 5.2 事务管理最佳实践

```javascript
// 事务管理类
class OracleTransactionManager {
  constructor(connection) {
    this.connection = connection;
    this.isTransactionActive = false;
  }
  
  async beginTransaction() {
    if (!this.isTransactionActive) {
      await this.connection.execute('BEGIN');
      this.isTransactionActive = true;
      console.log('事务已开始');
    }
    return this;
  }
  
  async commit() {
    if (this.isTransactionActive) {
      await this.connection.execute('COMMIT');
      this.isTransactionActive = false;
      console.log('事务已提交');
    }
    return this;
  }
  
  async rollback() {
    if (this.isTransactionActive) {
      await this.connection.execute('ROLLBACK');
      this.isTransactionActive = false;
      console.log('事务已回滚');
    }
    return this;
  }
  
  // 执行事务操作的便捷方法
  async executeInTransaction(asyncFunction) {
    let result;
    
    try {
      await this.beginTransaction();
      result = await asyncFunction(this.connection);
      await this.commit();
      return result;
    } catch (error) {
      await this.rollback();
      console.error('事务执行失败:', error);
      throw error; // 重新抛出异常以便上层处理
    }
  }
  
  // 带保存点的事务
  async savepoint(name) {
    if (this.isTransactionActive) {
      await this.connection.execute(`SAVEPOINT ${name}`);
      console.log(`已创建保存点: ${name}`);
    }
    return this;
  }
  
  async rollbackToSavepoint(name) {
    if (this.isTransactionActive) {
      await this.connection.execute(`ROLLBACK TO ${name}`);
      console.log(`已回滚到保存点: ${name}`);
    }
    return this;
  }
}

// 事务使用示例
async function transactionExample() {
  let connection;
  
  try {
    // 获取连接
    connection = await getConnection();
    
    // 创建事务管理器
    const tx = new OracleTransactionManager(connection);
    
    // 简单事务示例
    await tx.beginTransaction();
    
    try {
      // 执行多个操作
      await connection.execute(
        `INSERT INTO departments (department_id, department_name)
         VALUES (:id, :name)`,
        { id: 80, name: '研究部门' }
      );
      
      await connection.execute(
        `INSERT INTO employees (employee_id, last_name, email, job_id, department_id)
         VALUES (:id, :last_name, :email, :job_id, :dept_id)`,
        { id: 1004, last_name: '赵', email: 'zhao@example.com', job_id: 'SA_REP', dept_id: 80 }
      );
      
      // 提交事务
      await tx.commit();
      console.log('员工和部门创建成功');
      
    } catch (error) {
      // 出错时回滚
      await tx.rollback();
      console.error('事务失败:', error);
    }
    
    // 使用保存点的示例
    await tx.beginTransaction();
    
    try {
      // 插入第一个记录
      await connection.execute(
        `INSERT INTO employees (employee_id, last_name, email, job_id, department_id)
         VALUES (:id, :last_name, :email, :job_id, :dept_id)`,
        { id: 1005, last_name: '钱', email: 'qian@example.com', job_id: 'IT_PROG', dept_id: 60 }
      );
      
      // 创建保存点
      await tx.savepoint('afterFirstInsert');
      
      // 插入第二个记录（可能会失败）
      await connection.execute(
        `INSERT INTO employees (employee_id, last_name, email, job_id, department_id)
         VALUES (:id, :last_name, :email, :job_id, :dept_id)`,
        { id: 1005, last_name: '孙', email: 'sun@example.com', job_id: 'MK_MAN', dept_id: 80 } // 重复ID，会失败
      );
      
      // 提交事务
      await tx.commit();
      
    } catch (error) {
      console.log('第二个插入失败，回滚到保存点');
      // 回滚到保存点（保留第一个插入）
      await tx.rollbackToSavepoint('afterFirstInsert');
      // 提交剩余的更改
      await tx.commit();
      console.log('第一个员工已成功创建');
    }
    
    // 使用便捷方法执行事务
    const result = await tx.executeInTransaction(async (conn) => {
      // 增加员工薪资
      const updateResult = await conn.execute(
        `UPDATE employees
         SET salary = salary * 1.05
         WHERE department_id = :dept_id
         RETURNING COUNT(*) INTO :updated_count`,
        {
          dept_id: 60,
          updated_count: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
        }
      );
      
      return {
        updatedCount: updateResult.outBinds.updated_count
      };
    });
    
    console.log(`使用事务便捷方法更新了 ${result.updatedCount} 名员工的薪资`);
    
  } catch (error) {
    console.error('事务示例失败:', error);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}
```

## 6. 性能优化

### 6.1 查询优化

```javascript
async function optimizeQueries() {
  let connection;
  try {
    connection = await getConnection();
    
    // 1. 使用绑定变量（防止 SQL 注入并提高性能）
    const result1 = await connection.execute(
      `SELECT * FROM employees WHERE department_id = :dept_id`,
      { dept_id: 60 }
    );
    console.log(`使用绑定变量查询到 ${result1.rows.length} 条记录`);
    
    // 2. 使用结果集和预取优化大数据量查询
    const result2 = await connection.execute(
      `SELECT * FROM employees ORDER BY employee_id`,
      {},
      { resultSet: true, prefetchRows: 500, fetchArraySize: 100 }
    );
    
    const rs = result2.resultSet;
    let count = 0;
    let batch = 1;
    
    while (true) {
      const rows = await rs.getRows(100); // 一次获取 100 行
      if (rows.length === 0) break;
      
      count += rows.length;
      console.log(`批量 ${batch++} 处理了 ${rows.length} 行`);
      // 处理行数据...
    }
    
    await rs.close();
    console.log(`总计处理 ${count} 行`);
    
    // 3. 使用 EXPLAIN PLAN 分析查询性能
    await connection.execute(`
      EXPLAIN PLAN FOR
      SELECT e.employee_id, e.last_name, e.salary, d.department_name
      FROM employees e
      JOIN departments d ON e.department_id = d.department_id
      WHERE e.salary > 7000
      ORDER BY e.last_name
    `);
    
    const planResult = await connection.execute(`
      SELECT plan_table_output
      FROM TABLE(DBMS_XPLAN.DISPLAY())
    `);
    
    console.log('\n执行计划:');
    planResult.rows.forEach(row => {
      console.log(row[0]);
    });
    
    // 4. 优化器提示
    const hintedQuery = await connection.execute(
      `SELECT /*+ INDEX(employees emp_department_ix) */
       * FROM employees
       WHERE department_id = :dept_id`,
      { dept_id: 60 }
    );
    
    console.log(`使用优化器提示查询到 ${hintedQuery.rows.length} 条记录`);
    
  } catch (error) {
    console.error('查询优化示例失败:', error);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

// 查询优化最佳实践
function queryOptimizationBestPractices() {
  console.log('Oracle 查询优化最佳实践:');
  console.log('1. 始终使用绑定变量，避免字符串拼接 SQL');
  console.log('2. 为经常查询的列创建合适的索引');
  console.log('3. 只查询需要的列，避免 SELECT *');
  console.log('4. 使用 WHERE 子句限制结果集大小');
  console.log('5. 对于大数据集，使用游标和分页');
  console.log('6. 避免在 WHERE 子句中对列进行函数操作');
  console.log('7. 使用连接（JOIN）代替子查询，当可能时');
  console.log('8. 定期分析表以更新统计信息');
  console.log('9. 使用合适的排序和分组策略');
  console.log('10. 监控长时间运行的查询并进行优化');
}
```

### 6.2 索引优化

```javascript
async function optimizeIndexes() {
  let connection;
  try {
    connection = await getConnection();
    
    // 1. 检查现有索引
    const indexResult = await connection.execute(`
      SELECT index_name, table_name, column_name
      FROM user_ind_columns
      WHERE table_name IN ('EMPLOYEES', 'DEPARTMENTS')
      ORDER BY table_name, index_name, column_position
    `);
    
    console.log('\n现有索引:');
    indexResult.rows.forEach(row => {
      console.log(`${row[1]}.${row[2]} - ${row[0]}`);
    });
    
    // 2. 创建合适的索引
    // 单列索引
    await connection.execute(`
      CREATE INDEX emp_email_idx ON employees(email)
    `);
    console.log('创建了员工邮箱索引');
    
    // 复合索引
    await connection.execute(`
      CREATE INDEX emp_dept_sal_idx ON employees(department_id, salary)
    `);
    console.log('创建了部门和薪资的复合索引');
    
    // 函数索引
    await connection.execute(`
      CREATE INDEX emp_last_name_upper_idx ON employees(UPPER(last_name))
    `);
    console.log('创建了姓氏大写形式的函数索引');
    
    // 3. 分析表以更新统计信息
    await connection.execute(`
      ANALYZE TABLE employees COMPUTE STATISTICS
    `);
    await connection.execute(`
      ANALYZE TABLE departments COMPUTE STATISTICS
    `);
    console.log('已更新表统计信息');
    
    // 4. 验证索引使用情况（需要 Oracle Enterprise Edition 或 AWR）
    try {
      const usageResult = await connection.execute(`
        SELECT index_name, table_name, used
        FROM v$object_usage
        WHERE table_name IN ('EMPLOYEES', 'DEPARTMENTS')
      `);
      
      console.log('\n索引使用情况:');
      usageResult.rows.forEach(row => {
        console.log(`${row[0]} (表: ${row[1]}) - 使用: ${row[2]}`);
      });
    } catch (e) {
      console.log('索引使用统计查询可能需要特定权限:', e.message);
    }
    
    // 5. 删除不必要的索引
    // await connection.execute('DROP INDEX unnecessary_index');
    
  } catch (error) {
    console.error('索引优化失败:', error);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

// 索引设计最佳实践
function indexDesignBestPractices() {
  console.log('\nOracle 索引设计最佳实践:');
  console.log('1. 为经常用于查询条件的列创建索引');
  console.log('2. 为 ORDER BY 和 GROUP BY 子句中的列创建索引');
  console.log('3. 对于唯一值较少的列，考虑使用位图索引');
  console.log('4. 复合索引应将选择性高的列放在前面');
  console.log('5. 避免过度索引，这会减慢 DML 操作');
  console.log('6. 对于频繁更新的列，谨慎创建索引');
  console.log('7. 对于长字符串列，考虑使用前缀索引');
  console.log('8. 定期检查和维护索引');
  console.log('9. 使用索引监控功能来识别未使用的索引');
  console.log('10. 考虑分区索引来提高大数据量表的性能');
}
```

### 6.3 批量操作优化

```javascript
async function optimizeBatchOperations() {
  let connection;
  try {
    connection = await getConnection();
    
    // 1. 使用数组绑定进行批量插入
    const employees = [];
    for (let i = 2000; i < 2100; i++) {
      employees.push({
        employee_id: i,
        first_name: `批量${i}`,
        last_name: `员工${i}`,
        email: `emp${i}@example.com`,
        job_id: 'ST_CLERK',
        salary: 3000 + (i % 1000),
        department_id: 60
      });
    }
    
    // 准备批量绑定参数
    const bindVars = {
      employee_id: employees.map(emp => emp.employee_id),
      first_name: employees.map(emp => emp.first_name),
      last_name: employees.map(emp => emp.last_name),
      email: employees.map(emp => emp.email),
      job_id: employees.map(emp => emp.job_id),
      salary: employees.map(emp => emp.salary),
      department_id: employees.map(emp => emp.department_id)
    };
    
    console.log(`准备插入 ${employees.length} 条记录`);
    const startTime = Date.now();
    
    // 执行批量插入
    const result = await connection.executeMany(
      `INSERT INTO employees (employee_id, first_name, last_name, email, job_id, salary, department_id)
       VALUES (:employee_id, :first_name, :last_name, :email, :job_id, :salary, :department_id)`,
      bindVars
    );
    
    const endTime = Date.now();
    console.log(`批量插入完成，影响行数: ${result.rowsAffected}, 耗时: ${endTime - startTime}ms`);
    
    // 2. 使用 FORALL 批量操作（通过 PL/SQL）
    await connection.execute(`
      CREATE OR REPLACE PROCEDURE bulk_update_salary(
        p_dept_id IN NUMBER,
        p_percentage IN NUMBER
      ) AS
      BEGIN
        UPDATE employees
        SET salary = salary * (1 + p_percentage/100)
        WHERE department_id = p_dept_id;
      END bulk_update_salary;
    `);
    
    const plsqlStartTime = Date.now();
    
    await connection.execute(
      `BEGIN
         bulk_update_salary(:dept_id, :percentage);
       END;`,
      { dept_id: 60, percentage: 5 }
    );
    
    const plsqlEndTime = Date.now();
    console.log(`PL/SQL 批量更新耗时: ${plsqlEndTime - plsqlStartTime}ms`);
    
    // 3. 批量获取优化
    const largeResult = await connection.execute(
      `SELECT * FROM employees WHERE department_id = :dept_id`,
      { dept_id: 60 },
      { resultSet: true, prefetchRows: 500 }
    );
    
    const rs = largeResult.resultSet;
    const batchFetchStartTime = Date.now();
    let batchCount = 0;
    let totalRows = 0;
    
    // 批量获取数据
    while (true) {
      const rows = await rs.getRows(100); // 一次获取 100 行
      if (rows.length === 0) break;
      
      batchCount++;
      totalRows += rows.length;
      // 处理批次...
    }
    
    const batchFetchEndTime = Date.now();
    console.log(`批量获取完成，共 ${batchCount} 批次，${totalRows} 行，耗时: ${batchFetchEndTime - batchFetchStartTime}ms`);
    
    await rs.close();
    
  } catch (error) {
    console.error('批量操作优化失败:', error);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}
```

## 7. 监控与错误处理

### 7.1 监控 Oracle 实例

```javascript
async function monitorOracle() {
  let connection;
  try {
    connection = await getConnection();
    
    // 1. 查询数据库版本信息
    const versionResult = await connection.execute(`
      SELECT 
        BANNER_FULL as version
      FROM 
        v$version
    `);
    
    console.log('Oracle 数据库版本:');
    versionResult.rows.forEach(row => {
      console.log(row[0]);
    });
    
    // 2. 查询实例状态
    const instanceResult = await connection.execute(`
      SELECT
        instance_name, 
        status,
        database_status,
        active_state
      FROM
        v$instance
    `);
    
    console.log('\n实例状态:');
    const instanceInfo = instanceResult.rows[0];
    console.log(`实例名称: ${instanceInfo[0]}`);
    console.log(`状态: ${instanceInfo[1]}`);
    console.log(`数据库状态: ${instanceInfo[2]}`);
    console.log(`活动状态: ${instanceInfo[3]}`);
    
    // 3. 监控表空间
    const tablespaceResult = await connection.execute(`
      SELECT
        tablespace_name,
        ROUND(bytes/1024/1024, 2) as total_mb,
        ROUND(free_bytes/1024/1024, 2) as free_mb,
        ROUND((1 - free_bytes/bytes) * 100, 2) as used_percent
      FROM (
        SELECT
          tablespace_name,
          SUM(bytes) as bytes,
          SUM(DECODE(autoextensible, 'YES', maxbytes, bytes)) - SUM(used_bytes) as free_bytes
        FROM (
          SELECT
            tablespace_name,
            bytes,
            maxbytes,
            autoextensible,
            0 as used_bytes
          FROM
            dba_data_files
          UNION ALL
          SELECT
            tablespace_name,
            0 as bytes,
            0 as maxbytes,
            'NO' as autoextensible,
            bytes as used_bytes
          FROM
            dba_free_space
        )
        GROUP BY
          tablespace_name
      )
      ORDER BY
        used_percent DESC
    `);
    
    console.log('\n表空间使用情况:');
    tablespaceResult.rows.forEach(row => {
      console.log(`${row[0]}: 已使用 ${row[3]}%, 总空间 ${row[1]} MB, 可用空间 ${row[2]} MB`);
    });
    
    // 4. 监控长时间运行的查询
    try {
      const longRunningResult = await connection.execute(`
        SELECT
          s.sid,
          s.serial#,
          s.username,
          s.osuser,
          s.machine,
          s.program,
          TO_CHAR(s.logon_time, 'YYYY-MM-DD HH24:MI:SS') as logon_time,
          ROUND((sysdate - s.sql_exec_start) * 24 * 60, 2) as minutes_running,
          q.sql_text
        FROM
          v$session s
          LEFT JOIN v$sql q ON s.sql_id = q.sql_id
        WHERE
          s.status = 'ACTIVE'
          AND s.sql_exec_start IS NOT NULL
          AND (sysdate - s.sql_exec_start) * 24 * 60 > 1 -- 运行超过1分钟的查询
        ORDER BY
          minutes_running DESC
      `);
      
      console.log('\n长时间运行的查询:');
      if (longRunningResult.rows.length > 0) {
        longRunningResult.rows.forEach(row => {
          console.log(`会话: ${row[0]}, 用户: ${row[2]}, 运行时间: ${row[7]} 分钟`);
          console.log(`SQL: ${row[8]}`);
          console.log('---');
        });
      } else {
        console.log('没有发现长时间运行的查询');
      }
    } catch (e) {
      console.log('长时间运行查询监控可能需要特定权限:', e.message);
    }
    
  } catch (error) {
    console.error('监控 Oracle 失败:', error);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}
```

### 7.2 错误处理与日志记录

```javascript
// 统一错误处理类
class OracleErrorHandler {
  // 分类 Oracle 错误
  static categorizeError(error) {
    const errorInfo = {
      code: error.errorNum || 'UNKNOWN',
      message: error.message,
      severity: 'UNKNOWN',
      action: 'UNKNOWN',
      retryable: false
    };
    
    // ORA-错误代码分类
    switch (error.errorNum) {
      // 连接错误
      case 12154: // TNS:could not resolve the connect identifier specified
      case 12541: // TNS:no listener
      case 12543: // TNS:destination host unreachable
      case 12545: // TNS:name lookup failed
        errorInfo.severity = 'CRITICAL';
        errorInfo.action = 'CHECK_CONNECTION';
        errorInfo.retryable = true;
        break;
        
      // 认证错误
      case 1017: // invalid username/password; logon denied
      case 1045: // username/password invalid; logon denied
        errorInfo.severity = 'CRITICAL';
        errorInfo.action = 'CHECK_CREDENTIALS';
        break;
        
      // 权限错误
      case 1031: // insufficient privileges
      case 1044: // insufficient privileges
        errorInfo.severity = 'ERROR';
        errorInfo.action = 'CHECK_PRIVILEGES';
        break;
        
      // 数据错误
      case 1: // unique constraint violated
      case 1400: // cannot insert NULL into
      case 12899: // value too large for column
        errorInfo.severity = 'ERROR';
        errorInfo.action = 'VALIDATE_DATA';
        break;
        
      // 死锁错误
      case 60: // deadlock detected
        errorInfo.severity = 'WARNING';
        errorInfo.action = 'RETRY_OPERATION';
        errorInfo.retryable = true;
        break;
        
      // 资源错误
      case 12850: // unable to extend cluster index
      case 1652: // unable to extend temp segment
      case 1653: // unable to extend table
      case 1654: // unable to extend index
        errorInfo.severity = 'ERROR';
        errorInfo.action = 'CHECK_RESOURCES';
        break;
        
      // 超时错误
      case 12170: // TNS:connect timeout occurred
      case 28000: // the account is locked
        errorInfo.severity = 'ERROR';
        errorInfo.action = 'CHECK_TIMEOUT';
        errorInfo.retryable = true;
        break;
        
      default:
        errorInfo.severity = 'UNKNOWN';
        errorInfo.action = 'GENERAL_ERROR';
        // 判断是否是临时错误，可能需要重试
        if (error.message && 
            (error.message.includes('temporary failure') || 
             error.message.includes('connection lost') || 
             error.message.includes('retry'))) {
          errorInfo.retryable = true;
        }
    }
    
    return errorInfo;
  }
  
  // 生成错误日志
  static generateErrorLog(error, context = {}) {
    const errorInfo = this.categorizeError(error);
    
    return {
      timestamp: new Date().toISOString(),
      errorCode: errorInfo.code,
      errorMessage: errorInfo.message,
      severity: errorInfo.severity,
      suggestedAction: errorInfo.action,
      retryable: errorInfo.retryable,
      context: context,
      stack: error.stack
    };
  }
  
  // 处理错误的推荐操作
  static async handleError(error, context = {}) {
    const errorLog = this.generateErrorLog(error, context);
    
    // 记录错误（实际应用中可以使用专业日志系统）
    console.error('Oracle 错误:', errorLog);
    
    // 根据错误类型执行不同的操作
    if (errorLog.retryable) {
      console.log('建议重试操作');
      return { shouldRetry: true, maxRetries: 3, backoffTime: 1000 };
    }
    
    return { shouldRetry: false };
  }
}

// 错误处理示例
async function errorHandlingExample() {
  let connection;
  
  try {
    connection = await getConnection();
    
    // 故意触发唯一约束错误
    try {
      await connection.execute(
        `INSERT INTO employees (employee_id, last_name, email, job_id, department_id)
         VALUES (:id, :last_name, :email, :job_id, :dept_id)`,
        { id: 1001, last_name: '重复ID', email: 'duplicate@example.com', job_id: 'ST_CLERK', dept_id: 60 }
      );
    } catch (error) {
      console.log('捕获到预期的错误，开始处理...');
      
      const errorContext = {
        operation: 'INSERT',
        table: 'EMPLOYEES',
        parameters: { id: 1001, department_id: 60 }
      };
      
      const result = await OracleErrorHandler.handleError(error, errorContext);
      
      if (result.shouldRetry) {
        console.log(`将重试 ${result.maxRetries} 次，间隔 ${result.backoffTime}ms`);
      } else {
        console.log('错误不可重试，需要修复数据问题');
        // 执行修复操作...
        // 例如：生成新的唯一ID并重新插入
      }
    }
    
    // 重试机制示例
    await executeWithRetry(async () => {
      // 这里可以是可能会临时失败的操作
      console.log('执行可能需要重试的操作');
      return await connection.execute('SELECT SYSDATE FROM DUAL');
    }, 3, 1000);
    
  } catch (error) {
    console.error('错误处理示例本身失败:', error);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

// 带重试的执行函数
async function executeWithRetry(asyncFunction, maxRetries = 3, backoffTime = 1000) {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log(`尝试 ${attempt + 1}/${maxRetries}`);
      return await asyncFunction();
    } catch (error) {
      lastError = error;
      
      const result = await OracleErrorHandler.handleError(error, {
        attempt: attempt + 1,
        maxRetries: maxRetries,
        operation: 'RETRY_OPERATION'
      });
      
      if (!result.shouldRetry || attempt === maxRetries - 1) {
        console.log('达到最大重试次数或错误不可重试');
        throw error;
      }
      
      // 指数退避策略
      const waitTime = backoffTime * Math.pow(2, attempt) + Math.random() * 1000;
      console.log(`等待 ${waitTime.toFixed(0)}ms 后重试`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  throw lastError;
}
```

## 8. 安全最佳实践

### 8.1 安全连接配置

```javascript
// 安全连接配置
function secureConnectionConfig() {
  const secureConfig = {
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: process.env.ORACLE_CONNECTION_STRING,
    
    // SSL/TLS 加密连接
    walletLocation: process.env.ORACLE_WALLET_LOCATION, // Oracle Wallet 位置
    walletPassword: process.env.ORACLE_WALLET_PASSWORD,
    
    // 网络安全设置
    externalAuth: false, // 禁用外部认证（除非需要）
    
    // 安全参数
    events: false, // 禁用事件监听器（除非需要）
    outFormat: oracledb.OUT_FORMAT_OBJECT,
    
    // 连接池安全
    poolAlias: 'securePool',
    poolMax: 10,
    poolMin: 2,
    poolTimeout: 60
  };
  
  console.log('已创建安全连接配置');
  return secureConfig;
}

// 使用 Oracle Wallet 的安全连接
async function connectWithWallet() {
  try {
    // 确保 wallet 配置正确
    const walletConfig = {
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD, // 如果需要密码
      connectString: process.env.ORACLE_CONNECTION_STRING,
      walletLocation: {
        dir: process.env.ORACLE_WALLET_LOCATION
      },
      walletPassword: process.env.ORACLE_WALLET_PASSWORD
    };
    
    // 创建连接池
    await oracledb.createPool(walletConfig);
    console.log('使用 Oracle Wallet 的连接池已创建');
    
    // 获取连接
    const connection = await oracledb.getConnection('securePool');
    
    // 验证连接
    const result = await connection.execute('SELECT SYSDATE FROM DUAL');
    console.log('使用 Wallet 的安全连接成功:', result.rows[0][0]);
    
    await connection.close();
    
  } catch (error) {
    console.error('使用 Oracle Wallet 连接失败:', error);
    console.log('请确保 Oracle Wallet 正确配置，且环境变量已设置');
  }
}
```

### 8.2 访问控制和权限管理

```javascript
async function manageSecurity() {
  let connection;
  try {
    connection = await getConnection();
    
    // 1. 列出当前用户角色和权限
    const rolesResult = await connection.execute(`
      SELECT granted_role
      FROM user_role_privs
      ORDER BY granted_role
    `);
    
    console.log('当前用户角色:');
    rolesResult.rows.forEach(row => {
      console.log(`- ${row[0]}`);
    });
    
    // 2. 创建应用用户（需要 DBA 权限）
    try {
      // 创建只读用户
      await connection.execute(`
        CREATE USER app_readonly IDENTIFIED BY "SecurePassword123!"
        DEFAULT TABLESPACE users
        QUOTA 10M ON users
      `);
      
      // 授予只读权限
      await connection.execute(`
        GRANT CONNECT, SELECT ANY TABLE TO app_readonly
      `);
      
      // 创建应用用户
      await connection.execute(`
        CREATE USER app_user IDENTIFIED BY "SecurePassword123!"
        DEFAULT TABLESPACE users
        QUOTA 100M ON users
      `);
      
      // 授予必要权限
      await connection.execute(`
        GRANT CONNECT, RESOURCE TO app_user
      `);
      
      // 授予特定表的权限
      await connection.execute(`
        GRANT SELECT, INSERT, UPDATE, DELETE ON employees TO app_user
      `);
      
      await connection.execute(`
        GRANT SELECT ON departments TO app_user
      `);
      
      console.log('应用用户已创建并授权');
      
    } catch (e) {
      console.log('创建用户可能需要 DBA 权限:', e.message);
    }
    
    // 3. 实现行级安全性示例
    try {
      // 创建行级安全策略（需要 DBA 权限）
      await connection.execute(`
        CREATE OR REPLACE FUNCTION security_predicate(p_schema VARCHAR2, p_object VARCHAR2)
        RETURN VARCHAR2 AS
        BEGIN
          RETURN 'department_id = SYS_CONTEXT(''USERENV'', ''CLIENT_INFO'')';
        END security_predicate;
      `);
      
      await connection.execute(`
        BEGIN
          DBMS_RLS.ADD_POLICY(
            object_schema => USER,
            object_name => 'employees',
            policy_name => 'emp_dept_policy',
            policy_function => 'security_predicate',
            statement_types => 'SELECT, INSERT, UPDATE, DELETE'
          );
        END;
      `);
      
      console.log('行级安全策略已创建');
      
    } catch (e) {
      console.log('创建行级安全策略可能需要特定权限:', e.message);
    }
    
    // 4. 数据加密示例
    try {
      // 检查 TDE 是否已启用
      const tdeResult = await connection.execute(`
        SELECT value
        FROM v$parameter
        WHERE name = 'encrypt_new_tables'
      `);
      
      console.log('透明数据加密状态:', tdeResult.rows[0][0] || '未启用');
      
    } catch (e) {
      console.log('检查加密状态可能需要特定权限:', e.message);
    }
    
  } catch (error) {
    console.error('安全管理示例失败:', error);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

// 安全最佳实践建议
function oracleSecurityBestPractices() {
  console.log('\nOracle 安全最佳实践:');
  console.log('1. 使用强密码策略，定期更换数据库账户密码');
  console.log('2. 实施最小权限原则，只授予应用程序所需的最低权限');
  console.log('3. 使用 Oracle Wallet 存储凭据和加密密钥');
  console.log('4. 启用 SSL/TLS 加密数据库连接');
  console.log('5. 使用透明数据加密(TDE)保护存储的数据');
  console.log('6. 实施行级安全性(RLS)限制数据访问');
  console.log('7. 定期审计数据库活动，监控异常行为');
  console.log('8. 使用绑定变量防止 SQL 注入攻击');
  console.log('9. 限制网络访问，只允许必要的主机连接到数据库');
  console.log('10. 定期更新 Oracle 数据库到最新补丁版本');
}
```

### 8.3 参数化查询防止 SQL 注入

```javascript
async function preventSQLInjection() {
  let connection;
  try {
    connection = await getConnection();
    
    // 1. 使用绑定变量进行安全查询
    const safeSearch = async (searchTerm) => {
      const result = await connection.execute(
        `SELECT employee_id, last_name, email
         FROM employees
         WHERE last_name LIKE :search_term`,
        { search_term: `%${searchTerm}%` }
      );
      return result.rows;
    };
    
    // 测试安全查询
    const results = await safeSearch('张');
    console.log(`安全查询结果: ${results.length} 条记录`);
    
    // 2. 演示 SQL 注入防护 - 即使输入包含恶意代码
    const maliciousInput = "' OR '1'='1";
    const protectedResults = await safeSearch(maliciousInput);
    console.log(`使用恶意输入的查询结果: ${protectedResults.length} 条记录`);
    
    // 3. 安全的动态查询构建
    const buildDynamicQuery = async (filters) => {
      let whereClause = [];
      let bindParams = {};
      
      if (filters.departmentId) {
        whereClause.push('department_id = :dept_id');
        bindParams.dept_id = filters.departmentId;
      }
      
      if (filters.minSalary) {
        whereClause.push('salary >= :min_sal');
        bindParams.min_sal = filters.minSalary;
      }
      
      if (filters.nameSearch) {
        whereClause.push('(last_name LIKE :name_term OR first_name LIKE :name_term)');
        bindParams.name_term = `%${filters.nameSearch}%`;
      }
      
      let query = 'SELECT * FROM employees';
      if (whereClause.length > 0) {
        query += ' WHERE ' + whereClause.join(' AND ');
      }
      
      console.log('构建的安全动态查询:', query);
      console.log('绑定参数:', bindParams);
      
      return await connection.execute(query, bindParams);
    };
    
    // 测试动态查询
    const dynamicResults = await buildDynamicQuery({
      departmentId: 60,
      minSalary: 5000,
      nameSearch: '张'
    });
    
    console.log(`动态查询结果: ${dynamicResults.rows.length} 条记录`);
    
  } catch (error) {
    console.error('SQL 注入防护示例失败:', error);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}
```

## 9. 使用 TypeORM 操作 Oracle

TypeORM 是一个功能强大的 ORM 库，支持多种数据库，包括 Oracle。它提供了面向对象的方式来操作数据库。

### 9.1 安装依赖

```bash
# 安装 TypeORM 和 Oracle 驱动
npm install typeorm oracledb reflect-metadata

# 安装类型定义（TypeScript）
npm install --save-dev @types/node
```

### 9.2 基本配置

```typescript
// ormconfig.ts
import { DataSource } from 'typeorm';
import { Employee } from './entities/Employee';
import { Department } from './entities/Department';

export const AppDataSource = new DataSource({
  type: 'oracle',
  host: process.env.ORACLE_HOST || 'localhost',
  port: parseInt(process.env.ORACLE_PORT || '1521'),
  username: process.env.ORACLE_USER || 'hr',
  password: process.env.ORACLE_PASSWORD || 'welcome',
  sid: process.env.ORACLE_SID || 'ORCLCDB',
  serviceName: process.env.ORACLE_SERVICE_NAME || 'ORCLPDB1',
  entities: [
    Employee,
    Department
    // 其他实体类
  ],
  synchronize: false, // 在生产环境中设置为 false
  logging: true,
  poolSize: 10,
  connectTimeout: 15000,
});
```

### 9.3 实体定义

```typescript
// entities/Department.ts
import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Employee } from './Employee';

@Entity({ name: 'DEPARTMENTS' })
export class Department {
  @PrimaryColumn({ name: 'DEPARTMENT_ID' })
  departmentId: number;

  @Column({ name: 'DEPARTMENT_NAME', nullable: false })
  departmentName: string;

  @Column({ name: 'MANAGER_ID', nullable: true })
  managerId?: number;

  @Column({ name: 'LOCATION_ID', nullable: true })
  locationId?: number;

  @OneToMany(() => Employee, employee => employee.department)
  employees: Employee[];
}

// entities/Employee.ts
import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Department } from './Department';

@Entity({ name: 'EMPLOYEES' })
export class Employee {
  @PrimaryColumn({ name: 'EMPLOYEE_ID' })
  employeeId: number;

  @Column({ name: 'FIRST_NAME', nullable: true })
  firstName?: string;

  @Column({ name: 'LAST_NAME', nullable: false })
  lastName: string;

  @Column({ name: 'EMAIL', nullable: false })
  email: string;

  @Column({ name: 'PHONE_NUMBER', nullable: true })
  phoneNumber?: string;

  @Column({ name: 'HIRE_DATE', nullable: false, type: 'date' })
  hireDate: Date;

  @Column({ name: 'JOB_ID', nullable: false })
  jobId: string;

  @Column({ name: 'SALARY', nullable: true, type: 'number' })
  salary?: number;

  @Column({ name: 'COMMISSION_PCT', nullable: true, type: 'number' })
  commissionPct?: number;

  @Column({ name: 'MANAGER_ID', nullable: true })
  managerId?: number;

  @Column({ name: 'DEPARTMENT_ID', nullable: true })
  departmentId?: number;

  @ManyToOne(() => Department, department => department.employees)
  @JoinColumn({ name: 'DEPARTMENT_ID' })
  department?: Department;
}
```

### 9.4 使用 TypeORM 进行 CRUD 操作

```typescript
// typeorm-crud.ts
import 'reflect-metadata';
import { AppDataSource } from './ormconfig';
import { Employee } from './entities/Employee';
import { Department } from './entities/Department';

// 初始化数据库连接
async function initialize() {
  try {
    await AppDataSource.initialize();
    console.log('TypeORM 连接已初始化');
  } catch (error) {
    console.error('TypeORM 初始化失败:', error);
    throw error;
  }
}

// 关闭数据库连接
async function close() {
  await AppDataSource.destroy();
  console.log('TypeORM 连接已关闭');
}

// 创建记录
async function createRecords() {
  const departmentRepository = AppDataSource.getRepository(Department);
  const employeeRepository = AppDataSource.getRepository(Employee);

  // 开启事务
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // 创建部门
    const department = new Department();
    department.departmentId = 90;
    department.departmentName = 'TypeORM 测试部门';
    department.locationId = 1700;

    const savedDepartment = await queryRunner.manager.save(department);
    console.log('部门已创建:', savedDepartment);

    // 创建员工
    const employee = new Employee();
    employee.employeeId = 3000;
    employee.firstName = 'TypeORM';
    employee.lastName = '用户';
    employee.email = 'typeorm@example.com';
    employee.jobId = 'IT_PROG';
    employee.hireDate = new Date();
    employee.salary = 9000;
    employee.departmentId = savedDepartment.departmentId;

    const savedEmployee = await queryRunner.manager.save(employee);
    console.log('员工已创建:', savedEmployee);

    // 提交事务
    await queryRunner.commitTransaction();
    console.log('事务已提交');

  } catch (error) {
    // 回滚事务
    await queryRunner.rollbackTransaction();
    console.error('创建记录失败，事务已回滚:', error);
    throw error;
  } finally {
    // 释放查询执行器
    await queryRunner.release();
  }
}

// 查询记录
async function queryRecords() {
  const employeeRepository = AppDataSource.getRepository(Employee);
  const departmentRepository = AppDataSource.getRepository(Department);

  // 基本查询
  console.log('\n查询所有部门:');
  const departments = await departmentRepository.find();
  console.log(`找到 ${departments.length} 个部门`);

  // 带条件查询
  console.log('\n查询 IT_PROG 职位的员工:');
  const itEmployees = await employeeRepository.findBy({ jobId: 'IT_PROG' });
  console.log(`找到 ${itEmployees.length} 名 IT 员工`);

  // 带关系的查询
  console.log('\n查询员工及其部门信息:');
  const employeesWithDepartments = await employeeRepository.find({
    relations: ['department'],
    take: 5,
  });

  employeesWithDepartments.forEach(emp => {
    console.log(
      `${emp.firstName} ${emp.lastName} - 部门: ${emp.department?.departmentName || '无部门'}`
    );
  });

  // 复杂查询
  console.log('\n复杂查询示例:');
  const queryBuilder = employeeRepository.createQueryBuilder('employee');
  const highSalaryEmployees = await queryBuilder
    .select(['employee.employeeId', 'employee.firstName', 'employee.lastName', 'employee.salary'])
    .where('employee.salary > :minSalary', { minSalary: 7000 })
    .leftJoinAndSelect('employee.department', 'department')
    .orderBy('employee.salary', 'DESC')
    .limit(10)
    .getMany();

  console.log(`高薪员工 (${highSalaryEmployees.length} 名):`);
  highSalaryEmployees.forEach(emp => {
    console.log(`${emp.firstName} ${emp.lastName}: ${emp.salary} - ${emp.department?.departmentName}`);
  });
}

// 更新记录
async function updateRecords() {
  const employeeRepository = AppDataSource.getRepository(Employee);
  
  // 更新单个记录
  const employee = await employeeRepository.findOneBy({ employeeId: 3000 });
  if (employee) {
    employee.salary = 9500;
    await employeeRepository.save(employee);
    console.log('员工记录已更新');
  }
  
  // 批量更新
  const result = await employeeRepository.update(
    { jobId: 'IT_PROG' },
    { salary: () => 'salary * 1.05' } // 使用 SQL 表达式增加 5% 薪资
  );
  
  console.log(`批量更新了 ${result.affected} 条记录`);
}

// 删除记录
async function deleteRecords() {
  const employeeRepository = AppDataSource.getRepository(Employee);
  const departmentRepository = AppDataSource.getRepository(Department);
  
  // 删除单个记录
  const result = await employeeRepository.delete({ employeeId: 3000 });
  console.log(`删除了 ${result.affected} 条员工记录`);
  
  // 删除部门（需要先删除关联的员工或设置外键约束为 CASCADE）
  try {
    const deptResult = await departmentRepository.delete({ departmentId: 90 });
    console.log(`删除了 ${deptResult.affected} 个部门`);
  } catch (error) {
    console.error('删除部门失败，可能存在外键约束:', error.message);
  }
}

// 运行 TypeORM 示例
async function runTypeORMExample() {
  try {
    await initialize();
    await createRecords();
    await queryRecords();
    await updateRecords();
    await deleteRecords();
  } catch (error) {
    console.error('TypeORM 示例运行失败:', error);
  } finally {
    await close();
  }
}

// 运行示例
// runTypeORMExample().catch(console.error);
```

## 10. 常见问题和解决方案

### 10.1 连接问题

**问题**: Oracle 连接超时或拒绝连接
**解决方案**:
- 确认 Oracle 数据库服务正在运行
- 验证连接字符串、用户名和密码是否正确
- 检查网络连接和防火墙设置
- 验证 Oracle 监听程序是否正在运行 (`lsnrctl status`)
- 确认 Oracle 服务名或 SID 是否正确

```javascript
// 诊断连接问题的代码
async function diagnoseConnectionIssues() {
  try {
    const configVariants = [
      {
        user: process.env.ORACLE_USER,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_CONNECTION_STRING
      },
      {
        user: process.env.ORACLE_USER,
        password: process.env.ORACLE_PASSWORD,
        connectString: `${process.env.ORACLE_HOST}:${process.env.ORACLE_PORT}/${process.env.ORACLE_SERVICE_NAME}`
      },
      {
        user: process.env.ORACLE_USER,
        password: process.env.ORACLE_PASSWORD,
        connectString: `${process.env.ORACLE_HOST}:${process.env.ORACLE_PORT}:${process.env.ORACLE_SID}`
      }
    ];
    
    console.log('尝试不同的连接配置...');
    
    for (let i = 0; i < configVariants.length; i++) {
      try {
        console.log(`\n尝试配置 ${i + 1}:`);
        const connection = await oracledb.getConnection(configVariants[i]);
        const result = await connection.execute('SELECT 1 FROM DUAL');
        console.log('✅ 连接成功');
        await connection.close();
        return `配置 ${i + 1} 成功`;
      } catch (error) {
        console.log(`❌ 连接失败: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('诊断连接问题失败:', error);
  }
}
```

### 10.2 性能问题

**问题**: 查询执行缓慢
**解决方案**:
- 使用 `EXPLAIN PLAN` 分析查询执行计划
- 为频繁查询的列创建适当的索引
- 避免在 WHERE 子句中对列使用函数
- 使用绑定变量而不是字符串拼接
- 对于大型结果集，使用游标和分页
- 优化表结构，考虑分区表

**问题**: 连接池耗尽
**解决方案**:
- 增加连接池的最大连接数 (`poolMax`)
- 确保正确关闭连接，避免连接泄漏
- 实现连接超时和连接池监控
- 考虑使用连接池排队机制

```javascript
// 监控连接池状态
async function monitorPoolHealth() {
  try {
    const pool = oracledb.getPool();
    const stats = pool.getStatistics();
    
    console.log('连接池统计信息:');
    console.log(`- 连接池名称: ${stats.poolAlias}`);
    console.log(`- 总连接数: ${stats.connectionsOpen}`);
    console.log(`- 使用中连接数: ${stats.connectionsInUse}`);
    console.log(`- 空闲连接数: ${stats.connectionsOpen - stats.connectionsInUse}`);
    console.log(`- 请求队列长度: ${stats.requestsQueued}`);
    console.log(`- 最大连接数: ${pool.poolMax}`);
    
    // 检查是否接近连接池限制
    const usagePercentage = (stats.connectionsInUse / pool.poolMax) * 100;
    if (usagePercentage > 80) {
      console.log(`⚠️  警告: 连接池使用率为 ${usagePercentage.toFixed(1)}%，接近最大限制`);
    }
    
  } catch (error) {
    console.error('监控连接池失败:', error);
  }
}
```

### 10.3 安全问题

**问题**: SQL 注入风险
**解决方案**:
- 始终使用绑定变量而不是字符串拼接
- 实施参数验证和清理
- 使用 ORM 框架提供的安全查询机制
- 限制数据库用户的权限

**问题**: 凭据管理
**解决方案**:
- 不要在代码中硬编码数据库凭据
- 使用环境变量或安全的配置管理系统
- 考虑使用 Oracle Wallet 存储敏感信息
- 定期轮换凭据

### 10.4 内存管理

**问题**: 处理大型结果集时内存不足
**解决方案**:
- 使用流式查询 (`resultSet: true`)
- 批量处理数据，避免一次性加载全部数据
- 优化查询，只选择必要的列
- 增加 Node.js 内存限制 (`--max-old-space-size`)

### 10.5 LOB 数据处理

**问题**: 处理大型 LOB 数据时性能问题
**解决方案**:
- 使用流式 API 处理大型 LOB
- 对于 CLOB，使用 `fetchInfo` 将数据直接转换为字符串
- 对于 BLOB，使用 `fetchInfo` 将数据直接转换为 Buffer
- 考虑分块处理非常大的 LOB 数据

```javascript
// 高效处理大型 LOB 数据
async function handleLargeLOBs() {
  let connection;
  try {
    connection = await getConnection();
    
    // 配置 LOB 获取
    const options = {
      fetchInfo: {
        'LARGE_CLOB': { type: oracledb.STRING },  // 对于中型 CLOB
        'LARGE_BLOB': { type: oracledb.BUFFER }  // 对于中型 BLOB
      }
    };
    
    // 查询示例
    const result = await connection.execute(
      `SELECT id, large_clob, large_blob
       FROM documents
       WHERE id = :id`,
      { id: 1 },
      options
    );
    
    if (result.rows && result.rows.length > 0) {
      const row = result.rows[0];
      const clobData = row[1]; // 已经是字符串类型
      const blobData = row[2]; // 已经是 Buffer 类型
      
      console.log(`CLOB 长度: ${clobData.length} 字符`);
      console.log(`BLOB 长度: ${blobData.length} 字节`);
    }
    
  } catch (error) {
    console.error('处理大型 LOB 失败:', error);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}
```

## 11. 部署和维护

### 11.1 应用部署最佳实践

```javascript
// 生产环境连接池配置
function productionPoolConfig() {
  return {
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: process.env.ORACLE_CONNECTION_STRING,
    
    // 生产环境连接池优化
    poolMax: 20,                  // 根据应用需求调整
    poolMin: 5,                   // 保持足够的空闲连接
    poolTimeout: 300,             // 更长的超时时间（秒）
    poolPingInterval: 60,         // 定期检查连接健康状态
    poolAlias: 'productionPool',  // 连接池别名
    
    // 性能优化
    stmtCacheSize: 100,           // 更大的语句缓存
    
    // 安全设置
    enableStatistics: false,      // 生产环境关闭统计
    
    // 错误处理
    queueRequests: true,          // 当连接池满时排队请求
    queueTimeout: 30000           // 请求排队超时（毫秒）
  };
}

// 优雅关闭处理
function setupGracefulShutdown() {
  // 监听终止信号
  process.on('SIGTERM', async () => {
    console.log('接收到 SIGTERM 信号，正在关闭应用...');
    
    try {
      // 关闭 Oracle 连接池
      const pool = oracledb.getPool('productionPool');
      if (pool) {
        await pool.close(30); // 30秒超时
        console.log('Oracle 连接池已关闭');
      }
      
      console.log('应用已优雅关闭');
      process.exit(0);
      
    } catch (error) {
      console.error('优雅关闭过程中发生错误:', error);
      process.exit(1);
    }
  });
  
  // 监听中断信号
  process.on('SIGINT', async () => {
    console.log('接收到 SIGINT 信号，正在关闭应用...');
    // 与 SIGTERM 处理相同
    // ...
  });
  
  console.log('已设置优雅关闭处理');
}
```

### 11.2 监控和告警系统

```javascript
// 简单的监控系统
class OracleMonitoringSystem {
  constructor() {
    this.isMonitoring = false;
    this.monitorInterval = null;
  }
  
  startMonitoring(options = {}) {
    if (this.isMonitoring) {
      console.log('监控已经在运行');
      return;
    }
    
    const interval = options.interval || 60000; // 默认 1 分钟
    
    this.monitorInterval = setInterval(async () => {
      await this.checkDatabaseHealth();
      await this.checkPerformanceMetrics();
      await this.checkConnectionPoolStatus();
    }, interval);
    
    this.isMonitoring = true;
    console.log(`Oracle 数据库监控已启动，间隔: ${interval}ms`);
  }
  
  stopMonitoring() {
    if (!this.isMonitoring) {
      console.log('监控未运行');
      return;
    }
    
    clearInterval(this.monitorInterval);
    this.monitorInterval = null;
    this.isMonitoring = false;
    console.log('Oracle 数据库监控已停止');
  }
  
  async checkDatabaseHealth() {
    let connection;
    try {
      connection = await getConnection();
      await connection.execute('SELECT 1 FROM DUAL');
      console.log('✅ 数据库健康检查: 正常');
      return { status: 'healthy' };
    } catch (error) {
      console.error('❌ 数据库健康检查失败:', error);
      // 发送告警...
      return { status: 'unhealthy', error: error.message };
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }
  
  async checkPerformanceMetrics() {
    // 实际应用中可能需要查询 Oracle 的性能视图
    // 例如 v$sysstat, v$mystat, v$waitstat 等
    console.log('检查性能指标...');
    // ...
  }
  
  async checkConnectionPoolStatus() {
    try {
      const pool = oracledb.getPool();
      const stats = pool.getStatistics();
      
      const usagePercentage = (stats.connectionsInUse / pool.poolMax) * 100;
      
      if (usagePercentage > 90) {
        console.warn(`⚠️  警告: 连接池使用率过高 (${usagePercentage.toFixed(1)}%)`);
        // 发送告警...
      }
      
      if (stats.requestsQueued > 5) {
        console.warn(`⚠️  警告: 连接池请求队列过长 (${stats.requestsQueued} 个请求)`);
        // 发送告警...
      }
      
      return {
        usagePercentage,
        requestsQueued: stats.requestsQueued
      };
    } catch (error) {
      console.error('检查连接池状态失败:', error);
      return null;
    }
  }
}
```

### 11.3 备份和恢复策略

**Oracle 备份最佳实践**:
- 实施定期的全量备份和增量备份
- 测试备份恢复流程，确保备份有效
- 考虑使用 Oracle Recovery Manager (RMAN)
- 为关键表实施额外的逻辑备份（如导出到 CSV）
- 监控备份作业状态和存储空间

```javascript
// 数据库导出示例（逻辑备份）
async function exportDatabaseData() {
  const fs = require('fs').promises;
  const path = require('path');
  
  let connection;
  try {
    connection = await getConnection();
    
    // 创建导出目录
    const exportDir = path.join(__dirname, 'exports');
    await fs.mkdir(exportDir, { recursive: true });
    
    // 导出部门数据
    const deptResult = await connection.execute(
      `SELECT department_id, department_name, manager_id, location_id
       FROM departments`
    );
    
    // 转换为 CSV
    const deptCSV = ['department_id,department_name,manager_id,location_id'];
    deptResult.rows.forEach(row => {
      deptCSV.push(row.map(col => col === null ? '' : `"${String(col)}"`).join(','));
    });
    
    // 写入文件
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const deptFile = path.join(exportDir, `departments_${timestamp}.csv`);
    await fs.writeFile(deptFile, deptCSV.join('\n'));
    
    console.log(`已导出部门数据到 ${deptFile}`);
    
    // 同样导出其他关键表...
    
  } catch (error) {
    console.error('导出数据库数据失败:', error);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}
```

## 12. 总结

Oracle 是一个功能强大的企业级关系型数据库，通过 Node.js 与 Oracle 的集成，我们可以构建高性能、可扩展的企业应用程序。在本文档中，我们介绍了 Oracle 数据库的基础知识、Node.js 中使用 Oracle 的方法、核心数据操作、高级功能、性能优化、安全最佳实践以及常见问题解决方案。

### 主要要点总结

1. **连接管理**:
   - 使用连接池管理数据库连接，提高性能和可扩展性
   - 实现连接监控和健康检查，确保应用稳定性

2. **数据操作**:
   - 使用参数化查询进行安全的 CRUD 操作
   - 利用 PL/SQL 块和存储过程提高复杂操作的性能
   - 正确处理事务，确保数据一致性

3. **性能优化**:
   - 设计合理的索引结构
   - 优化查询语句和执行计划
   - 使用批量操作处理大量数据
   - 监控和调优连接池性能

4. **安全措施**:
   - 使用绑定变量防止 SQL 注入
   - 实施最小权限原则
   - 使用加密保护敏感数据
   - 安全管理数据库凭据

5. **最佳实践**:
   - 使用 TypeORM 等 ORM 框架简化数据库操作
   - 实现优雅关闭和错误处理
   - 建立完善的监控和告警机制
   - 制定数据备份和恢复策略

通过遵循这些最佳实践和利用本文档提供的示例代码，您可以在 Node.js 应用程序中高效、安全地集成和使用 Oracle 数据库。

### 后续学习资源

- [Oracle Database 官方文档](https://docs.oracle.com/en/database/oracle/oracle-database/19/index.html)
- [node-oracledb GitHub 仓库和文档](https://oracle.github.io/node-oracledb/)
- [TypeORM 官方文档](https://typeorm.io/)
- [Oracle 性能优化指南](https://docs.oracle.com/en/database/oracle/oracle-database/19/tgdba/index.html)
- [Oracle 安全最佳实践](https://www.oracle.com/a/ocom/docs/database/18c-security-best-practices-guide.pdf)