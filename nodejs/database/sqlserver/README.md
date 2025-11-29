# Node.js 与 Microsoft SQL Server (MSSQL) 交互指南

## 1. SQL Server 基础概念

Microsoft SQL Server 是微软开发的关系型数据库管理系统 (RDBMS)，专为企业级应用设计，提供了强大的数据管理、商业智能和分析功能。

### 1.1 SQL Server 的主要特点

- **关系型数据库**：基于表结构存储数据，支持事务、约束和关系完整性
- **高性能**：优化的查询引擎，支持并行处理和内存中操作
- **高可用性**：提供 Always On 可用性组、故障转移集群等功能
- **安全可靠**：内置加密、访问控制和审计功能
- **商业智能**：集成分析服务、报告服务和集成服务
- **跨平台支持**：从 SQL Server 2017 开始支持 Windows、Linux 和容器环境
- **JSON 支持**：现代应用开发中对 JSON 数据的原生支持

### 1.2 核心概念

- **数据库 (Database)**：相关数据的集合，包含表、视图、存储过程等对象
- **表 (Table)**：数据的基本存储单位，由行和列组成
- **行 (Row)**：表中的一条记录，包含一个实体的完整信息
- **列 (Column)**：表中的一个字段，定义特定类型的数据
- **主键 (Primary Key)**：唯一标识表中每条记录的列或列组合
- **外键 (Foreign Key)**：建立表与表之间关系的约束
- **索引 (Index)**：提高查询性能的数据结构
- **存储过程 (Stored Procedure)**：预编译的 SQL 代码块，可以重复执行
- **触发器 (Trigger)**：响应数据修改事件自动执行的特殊存储过程
- **视图 (View)**：基于一个或多个表的查询结果集的可视化表

### 1.3 SQL Server 与其他数据库的对比

| 特性 | SQL Server | MySQL | PostgreSQL | Oracle |
|------|------------|-------|------------|--------|
| 开发公司 | 微软 | Oracle | PostgreSQL 全球开发组 | Oracle |
| 授权模式 | 商业软件 | 开源 (GPL) | 开源 (PostgreSQL 许可证) | 商业软件 |
| 主要优势 | 与 Windows 生态集成，管理工具丰富 | 易于配置和使用，性能良好 | 功能强大，扩展性好 | 企业级稳定性，功能全面 |
| 适用场景 | 企业应用，.NET 开发，数据仓库 | Web 应用，小型项目 | 复杂应用，数据分析 | 大型企业应用，关键业务 |
| 跨平台 | 支持 (2017+) | 支持 | 支持 | 支持 |

## 2. Node.js 中连接 SQL Server

在 Node.js 中连接和操作 SQL Server，主要使用 `mssql` 包，它是一个功能丰富的 TDS (Tabular Data Stream) 客户端，支持连接池、事务和参数化查询等功能。

### 2.1 安装依赖

```bash
# 安装 mssql 包
npm install mssql

# 如果需要 TypeScript 类型支持
npm install --save-dev @types/mssql
```

### 2.2 基本连接配置

```javascript
// mssql-connection.js
const sql = require('mssql');

// 连接配置
const config = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'YourStrongPassword123',
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'master',
  options: {
    encrypt: true, // 使用 Azure SQL 时需要启用
    trustServerCertificate: true, // 开发环境可以设置为 true
  },
  port: parseInt(process.env.DB_PORT || '1433'),
};

// 创建连接池
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('已连接到 SQL Server 数据库');
    return pool;
  })
  .catch(err => {
    console.error('连接到 SQL Server 数据库失败:', err);
    // 可以在这里添加重试逻辑或其他错误处理
    throw err;
  });

module.exports = {
  sql,
  poolPromise,
};
```

### 2.3 基本连接示例

```javascript
// mssql-basic.js
const { sql, poolPromise } = require('./mssql-connection');

// 执行查询函数
async function executeQuery() {
  try {
    // 获取连接池
    const pool = await poolPromise;
    
    // 执行简单查询
    const result = await pool.request().query('SELECT @@VERSION AS sql_version');
    
    console.log('SQL Server 版本:', result.recordset[0].sql_version);
    
    return result.recordset;
  } catch (error) {
    console.error('查询执行失败:', error);
    throw error;
  }
}

// 运行示例
// executeQuery().catch(console.error);
```

### 2.4 Azure SQL 连接配置

如果使用 Azure SQL Database 或 Azure SQL Managed Instance，连接配置略有不同：

```javascript
// azure-sql-config.js
const sql = require('mssql');

// Azure SQL 连接配置
const azureConfig = {
  user: process.env.AZURE_DB_USER,
  password: process.env.AZURE_DB_PASSWORD,
  server: `${process.env.AZURE_DB_SERVER}.database.windows.net`,
  database: process.env.AZURE_DB_NAME,
  options: {
    encrypt: true, // Azure SQL 必须启用加密
    trustServerCertificate: false, // Azure SQL 应设置为 false
    connectionTimeout: 30000,
  },
};

module.exports = azureConfig;
```

## 3. 核心数据操作

### 3.1 创建表

```javascript
// create-tables.js
const { sql, poolPromise } = require('./mssql-connection');

async function createTables() {
  try {
    const pool = await poolPromise;
    
    // 创建部门表
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Departments' AND xtype='U')
      CREATE TABLE Departments (
        DepartmentID INT PRIMARY KEY IDENTITY(1,1),
        DepartmentName NVARCHAR(50) NOT NULL,
        ManagerID INT NULL,
        LocationID INT NULL,
        CreatedAt DATETIME DEFAULT GETDATE()
      );
    `);
    
    // 创建员工表
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Employees' AND xtype='U')
      CREATE TABLE Employees (
        EmployeeID INT PRIMARY KEY IDENTITY(1,1),
        FirstName NVARCHAR(50) NOT NULL,
        LastName NVARCHAR(50) NOT NULL,
        Email NVARCHAR(100) NOT NULL UNIQUE,
        PhoneNumber NVARCHAR(20) NULL,
        HireDate DATETIME NOT NULL DEFAULT GETDATE(),
        JobID NVARCHAR(10) NOT NULL,
        Salary DECIMAL(10, 2) NULL,
        CommissionPct DECIMAL(4, 2) NULL,
        ManagerID INT NULL,
        DepartmentID INT NULL,
        CreatedAt DATETIME DEFAULT GETDATE(),
        CONSTRAINT FK_Employee_Department FOREIGN KEY (DepartmentID) 
          REFERENCES Departments(DepartmentID),
        CONSTRAINT FK_Employee_Manager FOREIGN KEY (ManagerID) 
          REFERENCES Employees(EmployeeID)
      );
    `);
    
    console.log('表创建成功');
  } catch (error) {
    console.error('创建表失败:', error);
    throw error;
  }
}
```

### 3.2 插入数据

```javascript
// insert-data.js
const { sql, poolPromise } = require('./mssql-connection');

async function insertDepartments() {
  try {
    const pool = await poolPromise;
    
    // 使用参数化查询插入部门
    await pool.request()
      .input('DepartmentName', sql.NVarChar(50), '研发部')
      .input('LocationID', sql.Int, 1700)
      .query(`
        INSERT INTO Departments (DepartmentName, LocationID)
        VALUES (@DepartmentName, @LocationID);
      `);
    
    await pool.request()
      .input('DepartmentName', sql.NVarChar(50), '市场部')
      .input('LocationID', sql.Int, 1800)
      .query(`
        INSERT INTO Departments (DepartmentName, LocationID)
        VALUES (@DepartmentName, @LocationID);
      `);
    
    await pool.request()
      .input('DepartmentName', sql.NVarChar(50), '人力资源部')
      .input('LocationID', sql.Int, 1900)
      .query(`
        INSERT INTO Departments (DepartmentName, LocationID)
        VALUES (@DepartmentName, @LocationID);
      `);
    
    console.log('部门数据插入成功');
  } catch (error) {
    console.error('插入部门数据失败:', error);
    throw error;
  }
}

async function insertEmployees() {
  try {
    const pool = await poolPromise;
    
    // 插入第一个员工（经理）
    const managerResult = await pool.request()
      .input('FirstName', sql.NVarChar(50), '张三')
      .input('LastName', sql.NVarChar(50), '经理')
      .input('Email', sql.NVarChar(100), 'zhang.manager@example.com')
      .input('PhoneNumber', sql.NVarChar(20), '13800138000')
      .input('JobID', sql.NVarChar(10), 'AD_PRES')
      .input('Salary', sql.Decimal(10, 2), 25000.00)
      .input('DepartmentID', sql.Int, 1)
      .query(`
        INSERT INTO Employees (FirstName, LastName, Email, PhoneNumber, JobID, Salary, DepartmentID)
        OUTPUT INSERTED.EmployeeID
        VALUES (@FirstName, @LastName, @Email, @PhoneNumber, @JobID, @Salary, @DepartmentID);
      `);
    
    const managerId = managerResult.recordset[0].EmployeeID;
    
    // 插入普通员工并关联经理
    await pool.request()
      .input('FirstName', sql.NVarChar(50), '李四')
      .input('LastName', sql.NVarChar(50), '开发')
      .input('Email', sql.NVarChar(100), 'li.dev@example.com')
      .input('JobID', sql.NVarChar(10), 'IT_PROG')
      .input('Salary', sql.Decimal(10, 2), 12000.00)
      .input('ManagerID', sql.Int, managerId)
      .input('DepartmentID', sql.Int, 1)
      .query(`
        INSERT INTO Employees (FirstName, LastName, Email, JobID, Salary, ManagerID, DepartmentID)
        VALUES (@FirstName, @LastName, @Email, @JobID, @Salary, @ManagerID, @DepartmentID);
      `);
    
    await pool.request()
      .input('FirstName', sql.NVarChar(50), '王五')
      .input('LastName', sql.NVarChar(50), '市场')
      .input('Email', sql.NVarChar(100), 'wang.marketing@example.com')
      .input('JobID', sql.NVarChar(10), 'MK_REP')
      .input('Salary', sql.Decimal(10, 2), 10000.00)
      .input('CommissionPct', sql.Decimal(4, 2), 0.1)
      .input('ManagerID', sql.Int, managerId)
      .input('DepartmentID', sql.Int, 2)
      .query(`
        INSERT INTO Employees (FirstName, LastName, Email, JobID, Salary, CommissionPct, ManagerID, DepartmentID)
        VALUES (@FirstName, @LastName, @Email, @JobID, @Salary, @CommissionPct, @ManagerID, @DepartmentID);
      `);
    
    console.log('员工数据插入成功');
  } catch (error) {
    console.error('插入员工数据失败:', error);
    throw error;
  }
}
```

### 3.3 查询数据

```javascript
// query-data.js
const { sql, poolPromise } = require('./mssql-connection');

// 基本查询示例
async function basicQueries() {
  try {
    const pool = await poolPromise;
    
    // 查询所有部门
    console.log('\n所有部门:');
    const departments = await pool.request().query('SELECT * FROM Departments');
    console.table(departments.recordset);
    
    // 条件查询员工
    console.log('\n研发部员工:');
    const devEmployees = await pool.request()
      .input('DepartmentName', sql.NVarChar(50), '研发部')
      .query(`
        SELECT e.EmployeeID, e.FirstName, e.LastName, e.Email, e.JobID, e.Salary
        FROM Employees e
        JOIN Departments d ON e.DepartmentID = d.DepartmentID
        WHERE d.DepartmentName = @DepartmentName
      `);
    console.table(devEmployees.recordset);
    
    // 排序查询
    console.log('\n薪资最高的5名员工:');
    const topSalaries = await pool.request().query(`
      SELECT TOP 5 EmployeeID, FirstName, LastName, Salary
      FROM Employees
      ORDER BY Salary DESC
    `);
    console.table(topSalaries.recordset);
    
    // 聚合查询
    console.log('\n部门平均薪资:');
    const avgSalaries = await pool.request().query(`
      SELECT d.DepartmentName, COUNT(e.EmployeeID) AS EmployeeCount,
             AVG(e.Salary) AS AverageSalary, SUM(e.Salary) AS TotalSalary
      FROM Departments d
      LEFT JOIN Employees e ON d.DepartmentID = e.DepartmentID
      GROUP BY d.DepartmentName
      ORDER BY AverageSalary DESC
    `);
    console.table(avgSalaries.recordset);
    
  } catch (error) {
    console.error('查询失败:', error);
    throw error;
  }
}

// 高级查询示例
async function advancedQueries() {
  try {
    const pool = await poolPromise;
    
    // 子查询示例
    console.log('\n薪资高于部门平均薪资的员工:');
    const aboveAverage = await pool.request().query(`
      SELECT e.FirstName, e.LastName, e.Salary, d.DepartmentName
      FROM Employees e
      JOIN Departments d ON e.DepartmentID = d.DepartmentID
      WHERE e.Salary > (
        SELECT AVG(Salary) 
        FROM Employees 
        WHERE DepartmentID = e.DepartmentID
      )
    `);
    console.table(aboveAverage.recordset);
    
    // 窗口函数示例
    console.log('\n各部门薪资排名:');
    const salaryRanking = await pool.request().query(`
      SELECT 
        e.FirstName, e.LastName, e.Salary, d.DepartmentName,
        RANK() OVER (PARTITION BY e.DepartmentID ORDER BY e.Salary DESC) AS SalaryRank,
        DENSE_RANK() OVER (PARTITION BY e.DepartmentID ORDER BY e.Salary DESC) AS DenseSalaryRank,
        NTILE(3) OVER (PARTITION BY e.DepartmentID ORDER BY e.Salary DESC) AS SalaryTier
      FROM Employees e
      JOIN Departments d ON e.DepartmentID = d.DepartmentID
    `);
    console.table(salaryRanking.recordset);
    
    // PIVOT 示例（行转列）
    console.log('\n部门员工数量统计（PIVOT）:');
    const pivotExample = await pool.request().query(`
      SELECT *
      FROM (
        SELECT DepartmentName, COUNT(*) AS EmployeeCount
        FROM Employees e
        JOIN Departments d ON e.DepartmentID = d.DepartmentID
        GROUP BY DepartmentName
      ) AS SourceTable
      PIVOT (
        SUM(EmployeeCount)
        FOR DepartmentName IN ([研发部], [市场部], [人力资源部])
      ) AS PivotTable
    `);
    console.table(pivotExample.recordset);
    
  } catch (error) {
    console.error('高级查询失败:', error);
    throw error;
  }
}
```

### 3.4 更新数据

```javascript
// update-data.js
const { sql, poolPromise } = require('./mssql-connection');

async function updateData() {
  try {
    const pool = await poolPromise;
    
    // 单条记录更新
    const singleUpdate = await pool.request()
      .input('Salary', sql.Decimal(10, 2), 13000.00)
      .input('EmployeeID', sql.Int, 2)
      .query(`
        UPDATE Employees
        SET Salary = @Salary, 
            UpdatedAt = GETDATE()
        WHERE EmployeeID = @EmployeeID;
        SELECT @@ROWCOUNT AS UpdatedCount;
      `);
    
    console.log(`单条更新影响的行数: ${singleUpdate.recordset[0].UpdatedCount}`);
    
    // 批量更新
    const bulkUpdate = await pool.request()
      .input('MinSalary', sql.Decimal(10, 2), 10000.00)
      .query(`
        UPDATE Employees
        SET Salary = Salary * 1.1,  -- 统一加薪10%
            UpdatedAt = GETDATE()
        WHERE Salary >= @MinSalary;
        SELECT @@ROWCOUNT AS UpdatedCount;
      `);
    
    console.log(`批量更新影响的行数: ${bulkUpdate.recordset[0].UpdatedCount}`);
    
    // 有条件的更新（基于其他表）
    const conditionalUpdate = await pool.request()
      .input('DepartmentName', sql.NVarChar(50), '研发部')
      .query(`
        UPDATE e
        SET e.Salary = e.Salary * 1.15  -- 研发部额外加薪5%
        FROM Employees e
        JOIN Departments d ON e.DepartmentID = d.DepartmentID
        WHERE d.DepartmentName = @DepartmentName;
        SELECT @@ROWCOUNT AS UpdatedCount;
      `);
    
    console.log(`条件更新影响的行数: ${conditionalUpdate.recordset[0].UpdatedCount}`);
    
  } catch (error) {
    console.error('更新数据失败:', error);
    throw error;
  }
}
```

### 3.5 删除数据

```javascript
// delete-data.js
const { sql, poolPromise } = require('./mssql-connection');

async function deleteData() {
  try {
    const pool = await poolPromise;
    
    // 单条记录删除
    const singleDelete = await pool.request()
      .input('EmployeeID', sql.Int, 3)
      .query(`
        DELETE FROM Employees
        WHERE EmployeeID = @EmployeeID;
        SELECT @@ROWCOUNT AS DeletedCount;
      `);
    
    console.log(`单条删除影响的行数: ${singleDelete.recordset[0].DeletedCount}`);
    
    // 条件删除
    const conditionalDelete = await pool.request()
      .input('MaxSalary', sql.Decimal(10, 2), 5000.00)
      .query(`
        DELETE FROM Employees
        WHERE Salary <= @MaxSalary;
        SELECT @@ROWCOUNT AS DeletedCount;
      `);
    
    console.log(`条件删除影响的行数: ${conditionalDelete.recordset[0].DeletedCount}`);
    
    // 清空表（谨慎使用）
    // const truncateTable = await pool.request().query('TRUNCATE TABLE Employees;');
    // console.log('表已清空');
    
  } catch (error) {
    console.error('删除数据失败:', error);
    throw error;
  }
}
```

## 4. 事务处理

在 SQL Server 中，事务确保一系列数据库操作要么全部成功执行，要么全部回滚，从而保证数据一致性。

### 4.1 基本事务示例

```javascript
// transactions.js
const { sql, poolPromise } = require('./mssql-connection');

async function transferDepartment() {
  const transaction = new sql.Transaction();
  
  try {
    const pool = await poolPromise;
    
    // 开始事务
    await transaction.begin(pool);
    
    // 创建请求对象
    const request = new sql.Request(transaction);
    
    // 步骤1: 更新员工部门
    await request
      .input('EmployeeID', sql.Int, 2)
      .input('NewDepartmentID', sql.Int, 2)
      .query(`
        UPDATE Employees
        SET DepartmentID = @NewDepartmentID
        WHERE EmployeeID = @EmployeeID;
      `);
    
    // 步骤2: 更新原部门经理ID（如果需要）
    await request
      .input('DepartmentID', sql.Int, 1)
      .query(`
        UPDATE Departments
        SET ManagerID = NULL
        WHERE DepartmentID = @DepartmentID;
      `);
    
    // 步骤3: 更新新部门经理ID
    await request
      .input('DepartmentID', sql.Int, 2)
      .input('ManagerID', sql.Int, 2)
      .query(`
        UPDATE Departments
        SET ManagerID = @ManagerID
        WHERE DepartmentID = @DepartmentID;
      `);
    
    // 提交事务
    await transaction.commit();
    console.log('事务已成功提交');
    
  } catch (error) {
    // 发生错误时回滚事务
    await transaction.rollback();
    console.error('事务已回滚:', error);
    throw error;
  }
}
```

### 4.2 事务隔离级别

SQL Server 支持多种事务隔离级别，可以根据业务需求选择合适的隔离级别：

```javascript
// transaction-isolation-levels.js
const { sql, poolPromise } = require('./mssql-connection');

async function transactionWithIsolationLevel() {
  // 创建事务并设置隔离级别
  const transaction = new sql.Transaction({
    isolationLevel: sql.ISOLATION_LEVEL.SERIALIZABLE
  });
  
  try {
    const pool = await poolPromise;
    await transaction.begin(pool);
    
    const request = new sql.Request(transaction);
    
    // 执行事务操作
    // ...
    
    await transaction.commit();
    console.log('高隔离级别事务已提交');
    
  } catch (error) {
    await transaction.rollback();
    console.error('事务已回滚:', error);
    throw error;
  }
}

// SQL Server 支持的隔离级别:
// sql.ISOLATION_LEVEL.READ_UNCOMMITTED - 读取未提交的数据（脏读）
// sql.ISOLATION_LEVEL.READ_COMMITTED - 读取已提交的数据（默认级别）
// sql.ISOLATION_LEVEL.REPEATABLE_READ - 可重复读
// sql.ISOLATION_LEVEL.SNAPSHOT - 快照隔离
// sql.ISOLATION_LEVEL.SERIALIZABLE - 可序列化（最高隔离级别）
```

### 4.3 保存点示例

SQL Server 支持事务保存点，可以回滚到特定的保存点而不是整个事务：

```javascript
// transaction-savepoints.js
const { sql, poolPromise } = require('./mssql-connection');

async function transactionWithSavepoints() {
  const transaction = new sql.Transaction();
  
  try {
    const pool = await poolPromise;
    await transaction.begin(pool);
    
    const request = new sql.Request(transaction);
    
    // 执行一些操作
    await request.query(`
      INSERT INTO Departments (DepartmentName)
      VALUES ('临时部门');
    `);
    
    // 创建保存点
    await request.query('SAVE TRANSACTION AfterDepartmentCreation');
    
    try {
      // 尝试执行可能失败的操作
      await request.query(`
        -- 假设这是一个可能失败的操作
        INSERT INTO Employees (FirstName, LastName, Email, JobID) 
        VALUES ('测试', '员工', 'duplicate@example.com', 'IT_PROG');
      `);
    } catch (insertError) {
      // 回滚到保存点而不是整个事务
      console.log('插入失败，回滚到保存点:', insertError.message);
      await request.query('ROLLBACK TRANSACTION AfterDepartmentCreation');
      
      // 继续事务，执行替代操作
      await request.query(`
        INSERT INTO Employees (FirstName, LastName, Email, JobID) 
        VALUES ('测试', '员工', 'unique@example.com', 'IT_PROG');
      `);
    }
    
    // 提交整个事务
    await transaction.commit();
    console.log('使用保存点的事务已成功提交');
    
  } catch (error) {
    await transaction.rollback();
    console.error('整个事务已回滚:', error);
    throw error;
  }
}
```

## 5. 高级功能

### 5.1 存储过程

SQL Server 存储过程是预编译的 SQL 代码块，可以接收参数并返回结果。存储过程可以提高性能、简化代码维护并加强安全性。

```javascript
// stored-procedures.js
const { sql, poolPromise } = require('./mssql-connection');

// 创建存储过程
async function createStoredProcedures() {
  try {
    const pool = await poolPromise;
    
    // 创建获取部门员工的存储过程
    await pool.request().query(`
      CREATE OR ALTER PROCEDURE GetDepartmentEmployees
        @DepartmentName NVARCHAR(50)
      AS
      BEGIN
        SELECT e.EmployeeID, e.FirstName, e.LastName, e.Email, e.JobID, e.Salary
        FROM Employees e
        JOIN Departments d ON e.DepartmentID = d.DepartmentID
        WHERE d.DepartmentName = @DepartmentName
        ORDER BY e.LastName;
      END;
    `);
    
    // 创建更新员工薪资的存储过程
    await pool.request().query(`
      CREATE OR ALTER PROCEDURE UpdateEmployeeSalary
        @EmployeeID INT,
        @NewSalary DECIMAL(10, 2),
        @UpdatedBy NVARCHAR(50)
      AS
      BEGIN
        BEGIN TRY
          BEGIN TRANSACTION;
          
          -- 更新薪资
          UPDATE Employees
          SET Salary = @NewSalary,
              UpdatedAt = GETDATE()
          WHERE EmployeeID = @EmployeeID;
          
          -- 记录薪资变更历史（假设存在该表）
          INSERT INTO SalaryHistory (EmployeeID, OldSalary, NewSalary, ChangedBy, ChangedAt)
          SELECT @EmployeeID, Salary, @NewSalary, @UpdatedBy, GETDATE()
          FROM Employees
          WHERE EmployeeID = @EmployeeID;
          
          COMMIT TRANSACTION;
          
          -- 返回更新后的员工信息
          SELECT EmployeeID, FirstName, LastName, Salary
          FROM Employees
          WHERE EmployeeID = @EmployeeID;
          
        END TRY
        BEGIN CATCH
          ROLLBACK TRANSACTION;
          
          -- 返回错误信息
          SELECT 
            ERROR_NUMBER() AS ErrorNumber,
            ERROR_MESSAGE() AS ErrorMessage;
        END CATCH;
      END;
    `);
    
    console.log('存储过程创建成功');
  } catch (error) {
    console.error('创建存储过程失败:', error);
    throw error;
  }
}

// 调用存储过程
async function callStoredProcedures() {
  try {
    const pool = await poolPromise;
    
    // 调用获取部门员工的存储过程
    console.log('\n调用 GetDepartmentEmployees:');
    const departmentEmployees = await pool.request()
      .input('DepartmentName', sql.NVarChar(50), '研发部')
      .execute('GetDepartmentEmployees');
    
    console.table(departmentEmployees.recordset);
    
    // 调用更新薪资的存储过程
    console.log('\n调用 UpdateEmployeeSalary:');
    const salaryUpdate = await pool.request()
      .input('EmployeeID', sql.Int, 2)
      .input('NewSalary', sql.Decimal(10, 2), 15000.00)
      .input('UpdatedBy', sql.NVarChar(50), '系统管理员')
      .execute('UpdateEmployeeSalary');
    
    console.table(salaryUpdate.recordset);
    
  } catch (error) {
    console.error('调用存储过程失败:', error);
    throw error;
  }
}
```

### 5.2 触发器

SQL Server 触发器是一种特殊类型的存储过程，当特定的数据修改事件发生时自动执行。

```javascript
// triggers.js
const { sql, poolPromise } = require('./mssql-connection');

// 创建触发器
async function createTriggers() {
  try {
    const pool = await poolPromise;
    
    // 先创建历史记录表
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='EmployeeAudit' AND xtype='U')
      CREATE TABLE EmployeeAudit (
        AuditID INT PRIMARY KEY IDENTITY(1,1),
        EmployeeID INT,
        ActionType NVARCHAR(10), -- INSERT, UPDATE, DELETE
        OldData NVARCHAR(MAX),
        NewData NVARCHAR(MAX),
        ModifiedBy NVARCHAR(128),
        ModifiedAt DATETIME DEFAULT GETDATE()
      );
    `);
    
    // 创建员工表更新触发器
    await pool.request().query(`
      CREATE OR ALTER TRIGGER trg_Employee_AfterUpdate
      ON Employees
      AFTER UPDATE
      AS
      BEGIN
        SET NOCOUNT ON;
        
        INSERT INTO EmployeeAudit (EmployeeID, ActionType, OldData, NewData, ModifiedBy)
        SELECT 
          i.EmployeeID,
          'UPDATE',
          (
            SELECT * FROM deleted d WHERE d.EmployeeID = i.EmployeeID FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
          ),
          (
            SELECT * FROM inserted i WHERE i.EmployeeID = i.EmployeeID FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
          ),
          SYSTEM_USER
        FROM inserted i;
      END;
    `);
    
    // 创建员工表删除触发器
    await pool.request().query(`
      CREATE OR ALTER TRIGGER trg_Employee_AfterDelete
      ON Employees
      AFTER DELETE
      AS
      BEGIN
        SET NOCOUNT ON;
        
        INSERT INTO EmployeeAudit (EmployeeID, ActionType, OldData, ModifiedBy)
        SELECT 
          d.EmployeeID,
          'DELETE',
          (SELECT * FROM deleted WHERE EmployeeID = d.EmployeeID FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
          SYSTEM_USER
        FROM deleted d;
      END;
    `);
    
    console.log('触发器创建成功');
  } catch (error) {
    console.error('创建触发器失败:', error);
    throw error;
  }
}

// 测试触发器
async function testTriggers() {
  try {
    const pool = await poolPromise;
    
    // 执行更新操作以触发更新触发器
    await pool.request()
      .input('EmployeeID', sql.Int, 2)
      .input('PhoneNumber', sql.NVarChar(20), '13900139000')
      .query(`
        UPDATE Employees
        SET PhoneNumber = @PhoneNumber
        WHERE EmployeeID = @EmployeeID;
      `);
    
    // 检查审计记录
    console.log('\n审计记录:');
    const auditRecords = await pool.request().query(`
      SELECT AuditID, EmployeeID, ActionType, ModifiedAt, ModifiedBy
      FROM EmployeeAudit
      ORDER BY ModifiedAt DESC;
    `);
    
    console.table(auditRecords.recordset);
    
  } catch (error) {
    console.error('测试触发器失败:', error);
    throw error;
  }
}
```

### 5.3 JSON 支持

SQL Server 2016 及更高版本提供了丰富的 JSON 支持，可以存储、查询和修改 JSON 数据。

```javascript
// json-support.js
const { sql, poolPromise } = require('./mssql-connection');

// 创建包含 JSON 列的表
async function createJsonTable() {
  try {
    const pool = await poolPromise;
    
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='JsonDocuments' AND xtype='U')
      CREATE TABLE JsonDocuments (
        ID INT PRIMARY KEY IDENTITY(1,1),
        DocumentType NVARCHAR(50),
        JsonData NVARCHAR(MAX),
        CreatedAt DATETIME DEFAULT GETDATE(),
        INDEX IX_JsonData JSON (JsonData)
      );
    `);
    
    console.log('JSON 表创建成功');
  } catch (error) {
    console.error('创建 JSON 表失败:', error);
    throw error;
  }
}

// 使用 JSON 功能
async function useJsonFeatures() {
  try {
    const pool = await poolPromise;
    
    // 插入 JSON 数据
    const employeeJson = JSON.stringify({
      firstName: 'JSON',
      lastName: '测试',
      position: '高级开发工程师',
      skills: ['JavaScript', 'Node.js', 'SQL Server'],
      contact: {
        email: 'json.test@example.com',
        phone: '13700137000'
      },
      projects: [
        { name: '项目A', role: '开发负责人' },
        { name: '项目B', role: '技术顾问' }
      ]
    });
    
    await pool.request()
      .input('DocumentType', sql.NVarChar(50), 'EmployeeProfile')
      .input('JsonData', sql.NVarChar(sql.MAX), employeeJson)
      .query(`
        INSERT INTO JsonDocuments (DocumentType, JsonData)
        VALUES (@DocumentType, @JsonData);
      `);
    
    // 查询 JSON 数据
    console.log('\n查询 JSON 数据:');
    const jsonQuery = await pool.request().query(`
      SELECT 
        ID,
        DocumentType,
        JSON_VALUE(JsonData, '$.firstName') AS FirstName,
        JSON_VALUE(JsonData, '$.lastName') AS LastName,
        JSON_VALUE(JsonData, '$.contact.email') AS Email,
        JSON_QUERY(JsonData, '$.skills') AS Skills,
        JSON_QUERY(JsonData, '$.projects') AS Projects,
        CreatedAt
      FROM JsonDocuments
      WHERE DocumentType = 'EmployeeProfile';
    `);
    
    console.table(jsonQuery.recordset);
    
    // 使用 JSON_MODIFY 更新 JSON 数据
    await pool.request()
      .input('DocumentId', sql.Int, 1)
      .input('NewEmail', sql.NVarChar(100), 'updated.email@example.com')
      .query(`
        UPDATE JsonDocuments
        SET JsonData = JSON_MODIFY(JsonData, '$.contact.email', @NewEmail)
        WHERE ID = @DocumentId;
      `);
    
    // 使用 OPENJSON 解析 JSON 数据
    console.log('\n使用 OPENJSON 解析 JSON 数组:');
    const openJsonQuery = await pool.request().query(`
      SELECT d.ID, j.[key] AS ProjectIndex, j.value AS Project
      FROM JsonDocuments d
      CROSS APPLY OPENJSON(d.JsonData, '$.projects') j
      WHERE d.DocumentType = 'EmployeeProfile';
    `);
    
    openJsonQuery.recordset.forEach(row => {
      console.log(`文档ID: ${row.ID}, 项目索引: ${row.ProjectIndex}`);
      console.log('项目详情:', JSON.parse(row.Project));
    });
    
  } catch (error) {
    console.error('使用 JSON 功能失败:', error);
    throw error;
  }
}
```

### 5.4 XML 支持

SQL Server 提供了原生的 XML 数据类型和相关函数，用于存储和操作 XML 数据。

```javascript
// xml-support.js
const { sql, poolPromise } = require('./mssql-connection');

// 创建包含 XML 列的表
async function createXmlTable() {
  try {
    const pool = await poolPromise;
    
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='XmlDocuments' AND xtype='U')
      CREATE TABLE XmlDocuments (
        ID INT PRIMARY KEY IDENTITY(1,1),
        DocumentType NVARCHAR(50),
        XmlData XML,
        CreatedAt DATETIME DEFAULT GETDATE()
      );
    `);
    
    console.log('XML 表创建成功');
  } catch (error) {
    console.error('创建 XML 表失败:', error);
    throw error;
  }
}

// 使用 XML 功能
async function useXmlFeatures() {
  try {
    const pool = await poolPromise;
    
    // 准备 XML 数据
    const employeeXml = `
      <Employee>
        <FirstName>XML</FirstName>
        <LastName>测试</LastName>
        <Position>数据分析师</Position>
        <Skills>
          <Skill>SQL</Skill>
          <Skill>XML</Skill>
          <Skill>数据分析</Skill>
        </Skills>
        <Contact>
          <Email>xml.test@example.com</Email>
          <Phone>13600136000</Phone>
        </Contact>
      </Employee>
    `;
    
    // 插入 XML 数据
    await pool.request()
      .input('DocumentType', sql.NVarChar(50), 'EmployeeProfile')
      .input('XmlData', sql.Xml, employeeXml)
      .query(`
        INSERT INTO XmlDocuments (DocumentType, XmlData)
        VALUES (@DocumentType, @XmlData);
      `);
    
    // 使用 XQuery 查询 XML 数据
    console.log('\n使用 XQuery 查询 XML 数据:');
    const xmlQuery = await pool.request().query(`
      SELECT
        ID,
        DocumentType,
        XmlData.value('(/Employee/FirstName)[1]', 'NVARCHAR(50)') AS FirstName,
        XmlData.value('(/Employee/LastName)[1]', 'NVARCHAR(50)') AS LastName,
        XmlData.value('(/Employee/Contact/Email)[1]', 'NVARCHAR(100)') AS Email,
        XmlData.query('/Employee/Skills') AS SkillsXml,
        CreatedAt
      FROM XmlDocuments
      WHERE DocumentType = 'EmployeeProfile';
    `);
    
    console.table(xmlQuery.recordset);
    
    // 使用 nodes() 方法解析 XML 节点
    console.log('\n使用 nodes() 解析 XML 节点:');
    const nodesQuery = await pool.request().query(`
      SELECT
        d.ID,
        s.skill.value('.', 'NVARCHAR(50)') AS Skill
      FROM XmlDocuments d
      CROSS APPLY d.XmlData.nodes('/Employee/Skills/Skill') s(skill)
      WHERE d.DocumentType = 'EmployeeProfile';
    `);
    
    console.table(nodesQuery.recordset);
    
  } catch (error) {
    console.error('使用 XML 功能失败:', error);
    throw error;
  }
}
```

## 6. 性能优化

### 6.1 索引优化

```javascript
// indexes.js
const { sql, poolPromise } = require('./mssql-connection');

// 创建和管理索引
async function manageIndexes() {
  try {
    const pool = await poolPromise;
    
    // 创建非聚集索引
    await pool.request().query(`
      IF NOT EXISTS (
        SELECT * FROM sys.indexes 
        WHERE name='IX_Employees_LastName'
        AND object_id = OBJECT_ID('Employees')
      )
      CREATE NONCLUSTERED INDEX IX_Employees_LastName
      ON Employees(LastName);
    `);
    
    // 创建复合索引
    await pool.request().query(`
      IF NOT EXISTS (
        SELECT * FROM sys.indexes 
        WHERE name='IX_Employees_DepartmentID_Salary'
        AND object_id = OBJECT_ID('Employees')
      )
      CREATE NONCLUSTERED INDEX IX_Employees_DepartmentID_Salary
      ON Employees(DepartmentID, Salary DESC);
    `);
    
    // 创建包含列的索引
    await pool.request().query(`
      IF NOT EXISTS (
        SELECT * FROM sys.indexes 
        WHERE name='IX_Employees_Email_Include'
        AND object_id = OBJECT_ID('Employees')
      )
      CREATE NONCLUSTERED INDEX IX_Employees_Email_Include
      ON Employees(Email)
      INCLUDE (FirstName, LastName);
    `);
    
    // 检查索引使用情况
    console.log('\n索引使用统计:');
    const indexStats = await pool.request().query(`
      SELECT 
        OBJECT_NAME(i.object_id) AS TableName,
        i.name AS IndexName,
        s.user_seeks,
        s.user_scans,
        s.user_lookups,
        s.user_updates,
        s.last_user_seek,
        s.last_user_scan,
        s.last_user_lookup,
        s.last_user_update
      FROM sys.indexes i
      JOIN sys.dm_db_index_usage_stats s ON i.object_id = s.object_id AND i.index_id = s.index_id
      WHERE OBJECT_NAME(i.object_id) IN ('Employees', 'Departments');
    `);
    
    console.table(indexStats.recordset);
    
  } catch (error) {
    console.error('管理索引失败:', error);
    throw error;
  }
}
```

### 6.2 查询优化

```javascript
// query-optimization.js
const { sql, poolPromise } = require('./mssql-connection');

// 执行查询并分析执行计划
async function analyzeQueryPlans() {
  try {
    const pool = await poolPromise;
    
    // 使用 SET SHOWPLAN_XML 查看查询执行计划（但不会实际执行查询）
    // 注意：这个示例需要在 SSMS 中运行才能看到图形化执行计划
    // 此处我们使用实际执行计划进行分析
    
    // 执行查询并获取执行统计
    await pool.request().query('SET STATISTICS IO ON;');
    
    console.log('\n执行未优化的查询:');
    const unoptimizedResult = await pool.request().query(`
      SELECT e.EmployeeID, e.FirstName, e.LastName, e.Salary,
             d.DepartmentName
      FROM Employees e, Departments d
      WHERE e.DepartmentID = d.DepartmentID
      AND e.Salary > 10000
      AND LOWER(e.LastName) LIKE '张%'
    `);
    
    console.log(`结果行数: ${unoptimizedResult.recordset.length}`);
    
    console.log('\n执行优化后的查询:');
    const optimizedResult = await pool.request()
      .input('LastNamePrefix', sql.NVarChar(50), '张%')
      .query(`
        SELECT e.EmployeeID, e.FirstName, e.LastName, e.Salary,
               d.DepartmentName
        FROM Employees e
        INNER JOIN Departments d ON e.DepartmentID = d.DepartmentID
        WHERE e.Salary > 10000
        AND e.LastName LIKE @LastNamePrefix
      `);
    
    console.log(`结果行数: ${optimizedResult.recordset.length}`);
    
    // 重置统计信息
    await pool.request().query('SET STATISTICS IO OFF;');
    
  } catch (error) {
    console.error('分析查询计划失败:', error);
    throw error;
  }
}

// 优化查询的最佳实践
async function queryBestPractices() {
  try {
    const pool = await poolPromise;
    
    // 1. 选择必要的列而不是使用 SELECT *
    console.log('\n1. 选择特定列:');
    const specificColumns = await pool.request().query(`
      SELECT FirstName, LastName, Email
      FROM Employees
      WHERE DepartmentID = 1;
    `);
    
    // 2. 使用 EXISTS 而不是 IN 进行子查询
    console.log('\n2. 使用 EXISTS 替代 IN:');
    const existsQuery = await pool.request().query(`
      SELECT DepartmentID, DepartmentName
      FROM Departments d
      WHERE EXISTS (
        SELECT 1
        FROM Employees e
        WHERE e.DepartmentID = d.DepartmentID
      );
    `);
    
    // 3. 使用适当的连接类型
    console.log('\n3. 使用 LEFT JOIN 查询包含空值的情况:');
    const leftJoinQuery = await pool.request().query(`
      SELECT d.DepartmentID, d.DepartmentName, COUNT(e.EmployeeID) AS EmployeeCount
      FROM Departments d
      LEFT JOIN Employees e ON d.DepartmentID = e.DepartmentID
      GROUP BY d.DepartmentID, d.DepartmentName;
    `);
    
    // 4. 避免在 WHERE 子句中使用函数（会导致索引失效）
    console.log('\n4. 避免在 WHERE 子句中使用函数:');
    const withoutFunctionQuery = await pool.request()
      .input('HireYear', sql.Int, 2023)
      .query(`
        SELECT EmployeeID, FirstName, LastName, HireDate
        FROM Employees
        WHERE YEAR(HireDate) = @HireYear;  -- 这种方式会导致索引失效
      `);
    
    // 更好的方式
    const betterQuery = await pool.request()
      .input('StartDate', sql.DateTime, '2023-01-01')
      .input('EndDate', sql.DateTime, '2023-12-31')
      .query(`
        SELECT EmployeeID, FirstName, LastName, HireDate
        FROM Employees
        WHERE HireDate BETWEEN @StartDate AND @EndDate;  -- 这种方式可以使用索引
      `);
    
    console.log('查询最佳实践示例执行完成');
    
  } catch (error) {
    console.error('执行查询最佳实践失败:', error);
    throw error;
  }
}
```

### 6.3 连接池优化

```javascript
// connection-pool-optimization.js
const sql = require('mssql');

// 优化的连接池配置
const optimizedPoolConfig = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'YourStrongPassword123',
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'master',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  port: parseInt(process.env.DB_PORT || '1433'),
  
  // 连接池优化参数
  pool: {
    max: 20,          // 最大连接数
    min: 5,           // 最小连接数
    idleTimeoutMillis: 30000, // 空闲连接超时时间（毫秒）
    acquireTimeoutMillis: 10000, // 获取连接超时时间
    createTimeoutMillis: 10000, // 创建连接超时时间
    destroyTimeoutMillis: 5000, // 销毁连接超时时间
    maxUses: 7500,    // 每个连接最大使用次数
    reapIntervalMillis: 1000,   // 连接回收间隔
  },
};

// 初始化优化的连接池
const optimizedPoolPromise = new sql.ConnectionPool(optimizedPoolConfig)
  .connect()
  .then(pool => {
    console.log('已连接到优化配置的 SQL Server 连接池');
    return pool;
  })
  .catch(err => {
    console.error('连接到优化配置的连接池失败:', err);
    throw err;
  });

// 监控连接池状态
async function monitorPool() {
  try {
    const pool = await optimizedPoolPromise;
    
    // 获取连接池统计信息
    console.log('\n连接池统计信息:');
    console.log(`连接池状态: ${pool.connected ? '已连接' : '未连接'}`);
    
    // 注意：mssql 包的连接池不像 oracledb 那样提供详细的统计信息
    // 但可以通过其他方式监控和管理连接池
    
    // 模拟连接池压力测试
    console.log('\n执行连接池压力测试...');
    await performPoolStressTest(pool);
    
  } catch (error) {
    console.error('监控连接池失败:', error);
    throw error;
  }
}

// 连接池压力测试
async function performPoolStressTest(pool) {
  const concurrentQueries = 25;  // 并发查询数（超过连接池最大连接数）
  const promises = [];
  
  for (let i = 0; i < concurrentQueries; i++) {
    promises.push(
      pool.request()
        .input('QueryId', sql.Int, i)
        .query(`
          SELECT 
            @QueryId AS QueryId,
            GETDATE() AS ExecutionTime,
            COUNT(*) AS EmployeeCount
          FROM Employees
          WAITFOR DELAY '00:00:01';  -- 模拟查询延迟
        `)
        .then(result => {
          if (i % 5 === 0) {  // 只输出部分结果以避免过多日志
            console.log(`查询 ${i} 完成，执行时间: ${result.recordset[0].ExecutionTime}`);
          }
          return result;
        })
        .catch(err => {
          console.error(`查询 ${i} 失败:`, err);
          return null;
        })
    );
  }
  
  const results = await Promise.all(promises);
  console.log(`\n压力测试完成: 成功 ${results.filter(r => r !== null).length}/${concurrentQueries}`);
}

module.exports = {
  optimizedPoolPromise,
  monitorPool,
};
```

## 7. 安全最佳实践

### 7.1 参数化查询防止 SQL 注入

```javascript
// sql-injection-prevention.js
const { sql, poolPromise } = require('./mssql-connection');

// 演示 SQL 注入防护
async function demonstrateSqlInjectionProtection() {
  try {
    const pool = await poolPromise;
    
    // 不安全的查询示例（不要在实际代码中使用）
    function unsafeQuery(userInput) {
      // 这是不安全的，因为直接将用户输入拼接到 SQL 语句中
      const query = `SELECT * FROM Employees WHERE LastName LIKE '%${userInput}%'`;
      console.log('不安全的查询:', query);
      // 执行此查询将允许 SQL 注入攻击
      return pool.request().query(query);
    }
    
    // 安全的参数化查询
    function safeQuery(userInput) {
      // 使用参数化查询是安全的，用户输入不会被解释为 SQL 代码
      return pool.request()
        .input('LastName', sql.NVarChar(50), `%${userInput}%`)
        .query('SELECT EmployeeID, FirstName, LastName, Email FROM Employees WHERE LastName LIKE @LastName');
    }
    
    // 模拟恶意输入
    const maliciousInput = "' OR '1'='1";
    
    console.log('\n测试场景:');
    console.log(`用户输入: ${maliciousInput}`);
    
    console.log('\n安全查询结果:');
    const safeResults = await safeQuery(maliciousInput);
    console.log(`安全查询返回 ${safeResults.recordset.length} 条记录`);
    console.table(safeResults.recordset);
    
    // 警告：以下代码仅用于演示，不要在生产环境中使用
    /*
    console.log('\n不安全查询结果:');
    try {
      const unsafeResults = await unsafeQuery(maliciousInput);
      console.log(`不安全查询返回 ${unsafeResults.recordset.length} 条记录`);
      // 注意：如果表中有数据，这里会返回所有记录，因为 WHERE 条件始终为真
    } catch (error) {
      console.error('不安全查询可能出错:', error);
    }
    */
    
    // 动态构建安全查询
    console.log('\n动态构建安全查询:');
    await buildDynamicSafeQuery({
      departmentId: 1,
      minSalary: 10000,
      nameSearch: '张'
    });
    
  } catch (error) {
    console.error('演示 SQL 注入防护失败:', error);
    throw error;
  }
}

// 动态构建安全查询
async function buildDynamicSafeQuery(filters) {
  const pool = await poolPromise;
  const request = pool.request();
  const conditions = [];
  
  // 根据过滤条件动态添加 WHERE 子句
  if (filters.departmentId) {
    conditions.push('DepartmentID = @DepartmentId');
    request.input('DepartmentId', sql.Int, filters.departmentId);
  }
  
  if (filters.minSalary !== undefined && filters.minSalary !== null) {
    conditions.push('Salary >= @MinSalary');
    request.input('MinSalary', sql.Decimal(10, 2), filters.minSalary);
  }
  
  if (filters.nameSearch) {
    conditions.push('(LastName LIKE @NameSearch OR FirstName LIKE @NameSearch)');
    request.input('NameSearch', sql.NVarChar(50), `%${filters.nameSearch}%`);
  }
  
  // 构建最终查询
  let query = 'SELECT * FROM Employees';
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  
  console.log('构建的安全查询:', query);
  
  // 执行查询
  const result = await request.query(query);
  console.log(`动态查询返回 ${result.recordset.length} 条记录`);
  console.table(result.recordset);
  
  return result.recordset;
}
```

### 7.2 数据加密

SQL Server 提供了多种加密方式来保护敏感数据：

```javascript
// data-encryption.js
const { sql, poolPromise } = require('./mssql-connection');

// 设置透明数据加密 (TDE) 和列级加密
async function setupEncryption() {
  try {
    const pool = await poolPromise;
    
    // 注意：以下操作通常需要数据库管理员权限
    
    // 1. 查看数据库是否已启用透明数据加密 (TDE)
    const tdeStatus = await pool.request().query(`
      SELECT 
        DB_NAME(database_id) AS DatabaseName,
        CASE WHEN encryption_state = 1 THEN '未加密' 
             WHEN encryption_state = 2 THEN '正在加密' 
             WHEN encryption_state = 3 THEN '已加密' 
             WHEN encryption_state = 4 THEN '正在解密' 
             WHEN encryption_state = 5 THEN '密钥更改中' 
        END AS EncryptionStatus,
        percent_complete
      FROM sys.dm_database_encryption_keys
    `);
    
    console.log('\n透明数据加密 (TDE) 状态:');
    console.table(tdeStatus.recordset);
    
    // 2. 创建主密钥（如果不存在）
    await pool.request().query(`
      USE master;
      IF NOT EXISTS (SELECT * FROM sys.symmetric_keys WHERE name = '##MS_DatabaseMasterKey##')
      BEGIN
        CREATE MASTER KEY ENCRYPTION BY PASSWORD = 'YourComplexPassword123!@#';
        PRINT '创建了数据库主密钥';
      END;
    `);
    
    // 3. 创建证书用于列级加密
    await pool.request().query(`
      USE ${process.env.DB_NAME || 'master'};
      IF NOT EXISTS (SELECT * FROM sys.certificates WHERE name = 'EmployeeDataCertificate')
      BEGIN
        CREATE CERTIFICATE EmployeeDataCertificate
        WITH SUBJECT = 'Employee sensitive data encryption';
        PRINT '创建了员工数据加密证书';
      END;
    `);
    
    // 4. 创建对称密钥用于数据加密
    await pool.request().query(`
      USE ${process.env.DB_NAME || 'master'};
      IF NOT EXISTS (SELECT * FROM sys.symmetric_keys WHERE name = 'EmployeeDataSymmetricKey')
      BEGIN
        CREATE SYMMETRIC KEY EmployeeDataSymmetricKey
        WITH ALGORITHM = AES_256
        ENCRYPTION BY CERTIFICATE EmployeeDataCertificate;
        PRINT '创建了员工数据对称密钥';
      END;
    `);
    
    console.log('\n加密设置完成');
    
  } catch (error) {
    console.error('设置加密失败:', error);
    console.log('注意：某些加密操作可能需要特定权限');
  }
}

// 使用加密存储敏感数据
async function useDataEncryption() {
  try {
    const pool = await poolPromise;
    
    // 1. 确保表中有加密列
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.columns 
                     WHERE name = 'EncryptedSSN' 
                     AND object_id = OBJECT_ID('Employees'))
      BEGIN
        ALTER TABLE Employees
        ADD EncryptedSSN VARBINARY(256);
        PRINT '已添加加密 SSN 列';
      END;
    `);
    
    // 2. 打开对称密钥
    await pool.request().query(`
      OPEN SYMMETRIC KEY EmployeeDataSymmetricKey
      DECRYPTION BY CERTIFICATE EmployeeDataCertificate;
    `);
    
    // 3. 加密并存储敏感数据
    await pool.request()
      .input('EmployeeID', sql.Int, 2)
      .input('SSN', sql.NVarChar(20), '123-45-6789')
      .query(`
        UPDATE Employees
        SET EncryptedSSN = EncryptByKey(Key_GUID('EmployeeDataSymmetricKey'), @SSN)
        WHERE EmployeeID = @EmployeeID;
      `);
    
    // 4. 解密并读取敏感数据
    console.log('\n读取解密的敏感数据:');
    const decryptedData = await pool.request().query(`
      SELECT 
        EmployeeID,
        FirstName,
        LastName,
        CONVERT(NVARCHAR, DecryptByKey(EncryptedSSN)) AS DecryptedSSN
      FROM Employees
      WHERE EncryptedSSN IS NOT NULL;
    `);
    
    console.table(decryptedData.recordset);
    
    // 5. 关闭对称密钥
    await pool.request().query('CLOSE SYMMETRIC KEY EmployeeDataSymmetricKey;');
    
    console.log('\n数据加密/解密操作完成');
    
  } catch (error) {
    console.error('使用数据加密失败:', error);
  }
}
```

### 7.3 用户权限管理

```javascript
// user-permissions.js
const { sql, poolPromise } = require('./mssql-connection');

// 用户权限管理示例
async function manageUserPermissions() {
  try {
    const pool = await poolPromise;
    
    // 注意：以下操作通常需要系统管理员或安全管理员权限
    
    // 1. 创建数据库用户
    await pool.request().query(`
      USE ${process.env.DB_NAME || 'master'};
      IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = 'app_user')
      BEGIN
        CREATE USER app_user WITH PASSWORD = 'AppUserPassword123!';
        PRINT '创建了应用程序用户';
      END;
    `);
    
    // 2. 创建数据库角色
    await pool.request().query(`
      USE ${process.env.DB_NAME || 'master'};
      IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = 'app_readonly_role')
      BEGIN
        CREATE ROLE app_readonly_role;
        PRINT '创建了只读角色';
      END;
      
      IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = 'app_datawriter_role')
      BEGIN
        CREATE ROLE app_datawriter_role;
        PRINT '创建了数据写入角色';
      END;
    `);
    
    // 3. 分配权限给角色
    await pool.request().query(`
      USE ${process.env.DB_NAME || 'master'};
      
      -- 为只读角色分配 SELECT 权限
      GRANT SELECT ON Employees TO app_readonly_role;
      GRANT SELECT ON Departments TO app_readonly_role;
      
      -- 为数据写入角色分配 CRUD 权限
      GRANT SELECT, INSERT, UPDATE, DELETE ON Employees TO app_datawriter_role;
      GRANT SELECT ON Departments TO app_datawriter_role;
      
      PRINT '已分配权限给角色';
    `);
    
    // 4. 将用户添加到角色
    await pool.request().query(`
      USE ${process.env.DB_NAME || 'master'};
      
      -- 将用户添加到数据写入角色
      ALTER ROLE app_datawriter_role ADD MEMBER app_user;
      
      PRINT '已将用户添加到角色';
    `);
    
    // 5. 检查用户权限
    console.log('\n检查用户权限:');
    const userPermissions = await pool.request().query(`
      USE ${process.env.DB_NAME || 'master'};
      SELECT 
        dp.name AS PrincipalName,
        dp.type_desc AS PrincipalType,
        o.name AS ObjectName,
        p.permission_name,
        p.state_desc
      FROM sys.database_permissions p
      JOIN sys.database_principals dp ON p.grantee_principal_id = dp.principal_id
      JOIN sys.objects o ON p.major_id = o.object_id
      WHERE dp.name IN ('app_user', 'app_readonly_role', 'app_datawriter_role');
    `);
    
    console.table(userPermissions.recordset);
    
    console.log('\n用户权限管理操作完成');
    
  } catch (error) {
    console.error('管理用户权限失败:', error);
    console.log('注意：某些权限管理操作可能需要特定权限');
  }
}

// 权限管理最佳实践
function permissionBestPractices() {
  console.log('\nSQL Server 权限管理最佳实践:');
  console.log('1. 实施最小权限原则：只授予用户完成工作所需的最小权限');
  console.log('2. 使用角色进行权限管理：通过角色分配权限，而不是直接授予用户');
  console.log('3. 定期审核权限：定期检查用户权限，撤销不必要的权限');
  console.log('4. 分离职责：将不同功能的权限分配给不同的角色');
  console.log('5. 保护数据库系统对象：限制对系统表和视图的访问');
  console.log('6. 使用应用程序角色：为应用程序创建专用角色，而不是使用共享账号');
  console.log('7. 加密敏感数据：对敏感数据使用列级加密或透明数据加密');
  console.log('8. 启用审计：跟踪数据库访问和权限变更');
  console.log('9. 使用 Windows 身份验证：尽可能使用 Windows 集成身份验证');
  console.log('10. 定期更新密码：实施强密码策略并定期更换');
}
```

## 8. 使用 TypeORM 操作 SQL Server

TypeORM 是一个功能强大的 ORM 库，支持多种数据库，包括 SQL Server。它提供了面向对象的方式来操作数据库。

### 8.1 安装依赖

```bash
# 安装 TypeORM 和 SQL Server 驱动
npm install typeorm mssql reflect-metadata

# 安装类型定义（TypeScript）
npm install --save-dev @types/node
```

### 8.2 基本配置

```typescript
// ormconfig.ts
import { DataSource } from 'typeorm';
import { Employee } from './entities/Employee';
import { Department } from './entities/Department';

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: process.env.DB_SERVER || 'localhost',
  port: parseInt(process.env.DB_PORT || '1433'),
  username: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'YourStrongPassword123',
  database: process.env.DB_NAME || 'master',
  synchronize: false, // 生产环境应设为 false
  logging: true,
  entities: [Employee, Department],
  migrations: [],
  subscribers: [],
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
});

// entities/Department.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Employee } from './Employee';

@Entity()
export class Department {
  @PrimaryGeneratedColumn()
  departmentId: number;

  @Column({ length: 50, nullable: false })
  departmentName: string;

  @Column({ nullable: true })
  managerId: number;

  @Column({ nullable: true })
  locationId: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Employee, (employee) => employee.department)
  employees: Employee[];
}

// entities/Employee.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Department } from './Department';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  employeeId: number;

  @Column({ length: 50, nullable: false })
  firstName: string;

  @Column({ length: 50, nullable: false })
  lastName: string;

  @Column({ length: 100, nullable: false, unique: true })
  email: string;

  @Column({ length: 20, nullable: true })
  phoneNumber: string;

  @CreateDateColumn()
  hireDate: Date;

  @Column({ length: 10, nullable: false })
  jobId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  salary: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  commissionPct: number;

  @Column({ nullable: true })
  managerId: number;

  @Column({ nullable: true })
  departmentId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Department, (department) => department.employees)
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'managerId' })
  manager: Employee;
}

// typeorm-operations.ts
import { AppDataSource } from './ormconfig';
import { Employee } from './entities/Employee';
import { Department } from './entities/Department';

async function initializeDatabase() {
  try {
    // 连接数据库
    await AppDataSource.initialize();
    console.log('TypeORM 连接成功');
  } catch (error) {
    console.error('TypeORM 连接失败:', error);
    throw error;
  }
}

async function performCrudOperations() {
  try {
    const employeeRepository = AppDataSource.getRepository(Employee);
    const departmentRepository = AppDataSource.getRepository(Department);

    // 创建部门
    const newDepartment = new Department();
    newDepartment.departmentName = '技术部';
    newDepartment.locationId = 2000;
    const savedDepartment = await departmentRepository.save(newDepartment);
    console.log('创建的部门:', savedDepartment);

    // 创建员工
    const newEmployee = new Employee();
    newEmployee.firstName = 'TypeORM';
    newEmployee.lastName = '测试';
    newEmployee.email = 'typeorm.test@example.com';
    newEmployee.jobId = 'IT_PROG';
    newEmployee.salary = 15000;
    newEmployee.departmentId = savedDepartment.departmentId;
    const savedEmployee = await employeeRepository.save(newEmployee);
    console.log('创建的员工:', savedEmployee);

    // 查询员工
    const allEmployees = await employeeRepository.find({
      relations: ['department'],
    });
    console.log('所有员工:', allEmployees);

    // 条件查询
    const technicalEmployees = await employeeRepository.find({
      where: { departmentId: savedDepartment.departmentId },
      relations: ['department'],
    });
    console.log('技术部员工:', technicalEmployees);

    // 更新员工
    savedEmployee.salary = 16000;
    await employeeRepository.save(savedEmployee);
    console.log('更新后的员工薪资:', savedEmployee.salary);

    // 删除员工
    await employeeRepository.delete(savedEmployee.employeeId);
    console.log('员工已删除');

    // 使用查询构建器
    const highSalaryEmployees = await employeeRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.department', 'department')
      .where('employee.salary > :salary', { salary: 10000 })
      .orderBy('employee.salary', 'DESC')
      .getMany();
    console.log('高薪资员工:', highSalaryEmployees);

  } catch (error) {
    console.error('执行 CRUD 操作失败:', error);
    throw error;
  }
}

// 运行示例
// initializeDatabase()
//   .then(performCrudOperations)
//   .catch(console.error);

// typeorm-transactions.ts
import { AppDataSource } from './ormconfig';
import { Employee } from './entities/Employee';
import { Department } from './entities/Department';

async function performTransaction() {
  const queryRunner = AppDataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const employeeRepository = queryRunner.manager.getRepository(Employee);
    const departmentRepository = queryRunner.manager.getRepository(Department);

    // 在事务中执行操作
    const department = new Department();
    department.departmentName = '财务部';
    await queryRunner.manager.save(department);

    const employee = new Employee();
    employee.firstName = '张三';
    employee.lastName = '财务';
    employee.email = 'finance@example.com';
    employee.jobId = 'AC_ACCOUNT';
    employee.salary = 12000;
    employee.departmentId = department.departmentId;
    await queryRunner.manager.save(employee);

    // 提交事务
    await queryRunner.commitTransaction();
    console.log('事务提交成功');

  } catch (error) {
    // 发生错误时回滚事务
    await queryRunner.rollbackTransaction();
    console.error('事务回滚:', error);
    throw error;
  } finally {
    // 释放查询执行器
    await queryRunner.release();
  }
}

## 9. 常见问题解决方案

### 9.1 连接问题

```javascript
// connection-issues.js
const sql = require('mssql');

// 连接重试机制
async function connectWithRetry(config, maxRetries = 5, delay = 2000) {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      console.log(`尝试连接 (${retries + 1}/${maxRetries})...`);
      const pool = await new sql.ConnectionPool(config).connect();
      console.log('连接成功!');
      return pool;
    } catch (error) {
      console.error(`连接失败: ${error.message}`);
      retries++;
      
      if (retries >= maxRetries) {
        throw new Error(`达到最大重试次数 (${maxRetries})，无法连接到 SQL Server`);
      }
      
      // 指数退避策略
      const waitTime = delay * Math.pow(2, retries - 1);
      console.log(`等待 ${waitTime}ms 后重试...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}

// 常见连接问题排查
function troubleshootConnectionIssues() {
  console.log('\nSQL Server 连接问题排查指南:');
  console.log('1. 验证服务器名称和端口是否正确');
  console.log('2. 确认 SQL Server 服务正在运行');
  console.log('3. 检查防火墙设置是否允许 1433 端口连接');
  console.log('4. 验证 SQL Server 是否配置为允许远程连接');
  console.log('5. 确认 SQL Server 身份验证模式设置（混合模式）');
  console.log('6. 检查用户名和密码是否正确');
  console.log('7. 对于 Azure SQL，确保已添加客户端 IP 到防火墙规则');
  console.log('8. 验证是否启用了 TLS/SSL 并正确配置了加密选项');
  console.log('9. 检查连接字符串中的选项是否正确设置');
  console.log('10. 查看 SQL Server 错误日志获取详细错误信息');
}
```

### 9.2 性能问题

```javascript
// performance-issues.js

// 性能问题排查与优化
function troubleshootPerformanceIssues() {
  console.log('\nSQL Server 性能问题排查指南:');
  console.log('1. 使用 SQL Server Profiler 或 Extended Events 捕获慢查询');
  console.log('2. 检查查询执行计划，寻找缺失的索引');
  console.log('3. 分析索引使用情况，移除未使用的索引');
  console.log('4. 确保统计信息是最新的，定期更新统计信息');
  console.log('5. 优化查询，避免在 WHERE 子句中使用函数');
  console.log('6. 检查锁争用情况，优化事务隔离级别');
  console.log('7. 考虑表分区以提高大型表的查询性能');
  console.log('8. 优化连接池设置，确保有足够的连接处理负载');
  console.log('9. 监控服务器资源使用情况（CPU、内存、磁盘 I/O）');
  console.log('10. 考虑使用 SQL Server 查询存储来监控和分析查询性能');
}

// Node.js 应用性能优化
function optimizeNodejsPerformance() {
  console.log('\nNode.js 应用程序中优化 SQL Server 性能的技巧:');
  console.log('1. 使用连接池并正确配置其参数');
  console.log('2. 实现查询缓存以减少重复查询');
  console.log('3. 使用参数化查询以提高执行计划缓存命中率');
  console.log('4. 批量处理操作而不是单个操作');
  console.log('5. 使用流式查询处理大型结果集');
  console.log('6. 实现查询超时机制避免长时间运行的查询');
  console.log('7. 监控连接泄漏并确保及时释放连接');
  console.log('8. 使用异步/await 模式避免阻塞主线程');
  console.log('9. 定期分析和优化数据库操作代码');
  console.log('10. 考虑使用读写分离或分片来分散负载');
}
```

### 9.3 安全问题

```javascript
// security-issues.js

// 安全最佳实践检查
function securityBestPracticesChecklist() {
  console.log('\nSQL Server 安全最佳实践清单:');
  console.log('✓ 使用 Windows 身份验证而不是 SQL Server 身份验证');
  console.log('✓ 实施强密码策略并定期轮换凭据');
  console.log('✓ 遵循最小权限原则分配用户权限');
  console.log('✓ 加密敏感数据（使用透明数据加密或列级加密）');
  console.log('✓ 启用审计以跟踪数据库活动');
  console.log('✓ 定期安装安全补丁和更新');
  console.log('✓ 限制数据库服务器的网络访问');
  console.log('✓ 使用防火墙保护 SQL Server 实例');
  console.log('✓ 禁用不必要的功能和服务');
  console.log('✓ 定期备份数据并测试恢复流程');
  console.log('✓ 实施连接加密以保护传输中的数据');
  console.log('✓ 定期进行安全审计和渗透测试');
}

// Node.js 应用中的安全考虑
function nodejsSecurityConsiderations() {
  console.log('\nNode.js 应用程序中的 SQL Server 安全考虑:');
  console.log('1. 始终使用参数化查询防止 SQL 注入');
  console.log('2. 不要在代码中硬编码数据库凭据');
  console.log('3. 使用环境变量或安全的配置管理系统存储敏感信息');
  console.log('4. 实施适当的错误处理，避免泄露敏感信息');
  console.log('5. 使用连接池并确保正确关闭连接');
  console.log('6. 验证和清理所有用户输入');
  console.log('7. 实施适当的访问控制和认证机制');
  console.log('8. 加密存储在客户端的数据');
  console.log('9. 使用 HTTPS 保护客户端和服务器之间的通信');
  console.log('10. 定期更新依赖包以修补安全漏洞');
}
```

### 9.4 内存管理

```javascript
// memory-management.js

// SQL Server 内存管理建议
function sqlServerMemoryManagement() {
  console.log('\nSQL Server 内存管理建议:');
  console.log('1. 为 SQL Server 分配适当的最大服务器内存');
  console.log('2. 监控 SQL Server 的内存使用情况');
  console.log('3. 配置最小服务器内存以确保 SQL Server 获得稳定的内存分配');
  console.log('4. 避免在同一服务器上运行其他内存密集型应用');
  console.log('5. 考虑启用锁定内存页选项以防止操作系统将 SQL Server 内存换出到磁盘');
  console.log('6. 监控并解决内存压力问题');
  console.log('7. 适当配置缓冲池以优化查询性能');
  console.log('8. 考虑使用内存中 OLTP 功能处理高频交易');
  console.log('9. 定期重启长时间运行的实例以释放碎片化内存');
  console.log('10. 使用 SQL Server 的内存优化建议');
}

// Node.js 应用内存优化
function nodejsMemoryOptimization() {
  console.log('\nNode.js 应用程序内存优化技巧:');
  console.log('1. 使用合适的连接池大小，避免创建过多连接');
  console.log('2. 处理大型结果集时使用流式查询');
  console.log('3. 实施分页机制限制返回的记录数量');
  console.log('4. 避免在内存中缓存大量数据');
  console.log('5. 使用适当的数据类型和序列化方法');
  console.log('6. 监控应用程序的内存使用情况');
  console.log('7. 考虑使用集群模式充分利用多核处理器');
  console.log('8. 实施适当的垃圾回收策略');
  console.log('9. 避免内存泄漏，确保及时释放资源');
  console.log('10. 使用内存分析工具识别和解决内存问题');
}
```

## 10. 部署与维护

### 10.1 应用部署最佳实践

```javascript
// deployment-best-practices.js

// Node.js 应用与 SQL Server 部署建议
function deploymentBestPractices() {
  console.log('\nNode.js 应用与 SQL Server 部署最佳实践:');
  console.log('1. 使用环境变量存储数据库连接信息');
  console.log('2. 在开发、测试和生产环境中使用不同的数据库实例');
  console.log('3. 实施自动化部署流程（CI/CD）');
  console.log('4. 使用数据库迁移工具管理模式变更');
  console.log('5. 在部署前备份数据库');
  console.log('6. 实施蓝绿部署或金丝雀发布策略');
  console.log('7. 监控部署后的应用程序性能');
  console.log('8. 准备回滚计划以应对部署失败');
  console.log('9. 记录所有部署操作和变更');
  console.log('10. 对生产代码进行全面测试');
}

// 数据库部署安全检查
function databaseDeploymentSecurityChecks() {
  console.log('\n数据库部署安全检查:');
  console.log('✓ 验证所有数据库用户具有适当的权限');
  console.log('✓ 确认敏感数据已加密');
  console.log('✓ 验证所有输入都经过适当的验证和净化');
  console.log('✓ 确保所有查询都使用参数化查询');
  console.log('✓ 检查是否有默认密码或弱密码');
  console.log('✓ 验证数据库连接是否使用加密');
  console.log('✓ 确认已禁用不必要的数据库功能');
  console.log('✓ 验证备份和恢复流程是否正常工作');
  console.log('✓ 检查是否启用了审计和日志记录');
  console.log('✓ 确认数据库服务器有适当的防火墙保护');
}
```

### 10.2 监控与告警

```javascript
// monitoring-and-alerting.js

// SQL Server 监控关键指标
function sqlServerMonitoringMetrics() {
  console.log('\nSQL Server 监控关键指标:');
  console.log('1. 性能指标:');
  console.log('   - 平均查询执行时间');
  console.log('   - 每秒事务数');
  console.log('   - CPU 使用率');
  console.log('   - 内存使用率');
  console.log('   - 磁盘 I/O 活动');
  console.log('   - 等待统计信息');
  console.log('2. 可用性指标:');
  console.log('   - 数据库在线状态');
  console.log('   - 连接数');
  console.log('   - 错误日志中的严重错误');
  console.log('3. 资源使用指标:');
  console.log('   - 锁争用');
  console.log('   - 死锁频率');
  console.log('   - 缓冲区缓存命中率');
  console.log('   - 索引使用情况');
}

// 设置基本的监控查询
async function setupMonitoringQueries() {
  // 示例：用于监控 SQL Server 性能的查询
  const monitoringQueries = {
    // 当前活动会话
    activeSessions: `
      SELECT 
        s.session_id, s.login_name, s.status, s.host_name,
        s.program_name, s.cpu_time, s.logical_reads,
        s.reads, s.writes, s.total_elapsed_time,
        t.text AS sql_text
      FROM sys.dm_exec_sessions s
      JOIN sys.dm_exec_connections c ON s.session_id = c.session_id
      CROSS APPLY sys.dm_exec_sql_text(c.most_recent_sql_handle) t
      WHERE s.session_id > 50 -- 排除系统会话
      ORDER BY s.total_elapsed_time DESC;
    `,
    
    // 慢查询监控
    slowQueries: `
      SELECT TOP 20
        qs.total_elapsed_time/qs.execution_count AS avg_time_ms,
        SUBSTRING(qt.text, (qs.statement_start_offset/2)+1,
          ((CASE qs.statement_end_offset
              WHEN -1 THEN DATALENGTH(qt.text)
              ELSE qs.statement_end_offset
           END - qs.statement_start_offset)/2)+1) AS query_text,
        qs.execution_count, qs.total_logical_reads,
        qs.last_execution_time
      FROM sys.dm_exec_query_stats qs
      CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) qt
      ORDER BY avg_time_ms DESC;
    `,
    
    // 锁和阻塞
    locksAndBlocking: `
      SELECT
        t1.resource_type, t1.resource_database_id,
        t1.resource_associated_entity_id, t1.request_mode,
        t1.request_session_id, t2.blocking_session_id,
        t1.request_status
      FROM sys.dm_tran_locks as t1
      INNER JOIN sys.dm_os_waiting_tasks as t2
        ON t1.lock_owner_address = t2.resource_address;
    `
  };
  
  return monitoringQueries;
}

// 集成监控工具建议
function monitoringToolsIntegration() {
  console.log('\nSQL Server 和 Node.js 应用监控工具推荐:');
  console.log('1. SQL Server 专用工具:');
  console.log('   - SQL Server Management Studio (SSMS)');
  console.log('   - SQL Server Data Tools (SSDT)');
  console.log('   - SQL Server Agent 用于自动化任务');
  console.log('   - SQL Server Profiler/Extended Events 用于性能分析');
  console.log('2. 应用程序监控工具:');
  console.log('   - Azure Monitor (适用于 Azure SQL)');
  console.log('   - New Relic');
  console.log('   - Datadog');
  console.log('   - Prometheus + Grafana');
  console.log('   - ELK Stack (Elasticsearch, Logstash, Kibana)');
  console.log('3. Node.js 应用监控:');
  console.log('   - PM2 进程管理器');
  console.log('   - Node.js 内置调试工具');
  console.log('   - StrongLoop Process Manager');
  console.log('   - AppDynamics');
}
```

### 10.3 备份与恢复策略

```javascript
// backup-restore-strategy.js

// 备份策略建议
function backupStrategyRecommendations() {
  console.log('\nSQL Server 备份策略建议:');
  console.log('1. 备份类型:');
  console.log('   - 完整备份: 每周一次或根据数据量调整');
  console.log('   - 差异备份: 每天一次');
  console.log('   - 事务日志备份: 每小时一次或更频繁');
  console.log('   - 文件/文件组备份: 针对大型数据库');
  console.log('2. 备份位置:');
  console.log('   - 将备份存储在与数据库不同的物理驱动器上');
  console.log('   - 考虑异地备份存储以防止灾难');
  console.log('   - 使用备份加密保护敏感数据');
  console.log('3. 备份维护:');
  console.log('   - 定期测试备份恢复过程');
  console.log('   - 实施备份轮换策略');
  console.log('   - 监控备份大小和持续时间');
  console.log('   - 自动化备份任务');
  console.log('4. 灾难恢复计划:');
  console.log('   - 制定详细的恢复时间目标 (RTO) 和恢复点目标 (RPO)');
  console.log('   - 记录完整的恢复步骤');
  console.log('   - 定期演练恢复过程');
  console.log('   - 考虑高可用性解决方案 (Always On, 故障转移集群等)');
}

// 示例备份脚本
const backupScript = `
-- 完整数据库备份示例
BACKUP DATABASE [YourDatabaseName]
TO DISK = N'C:\\SQLBackups\\YourDatabaseName_Full_\${new Date().toISOString().split('T')[0]}.bak'
WITH NOFORMAT, NOINIT, 
     NAME = N'YourDatabaseName-Full Database Backup',
     SKIP, NOREWIND, NOUNLOAD,
     COMPRESSION,
     STATS = 10;
GO

-- 差异备份示例
BACKUP DATABASE [YourDatabaseName]
TO DISK = N'C:\\SQLBackups\\YourDatabaseName_Diff_\${new Date().toISOString().split('T')[0]}_${new Date().getHours()}.bak'
WITH DIFFERENTIAL, NOFORMAT, NOINIT, 
     NAME = N'YourDatabaseName-Differential Database Backup',
     SKIP, NOREWIND, NOUNLOAD,
     COMPRESSION,
     STATS = 10;
GO

-- 事务日志备份示例
BACKUP LOG [YourDatabaseName]
TO DISK = N'C:\\SQLBackups\\YourDatabaseName_Log_\${new Date().toISOString().split('T')[0]}_${new Date().getHours()}${new Date().getMinutes()}.trn'
WITH NOFORMAT, NOINIT, 
     NAME = N'YourDatabaseName-Transaction Log Backup',
     SKIP, NOREWIND, NOUNLOAD,
     COMPRESSION,
     STATS = 10;
GO
`;

// 恢复脚本示例
const restoreScript = `
-- 完整恢复示例（简单恢复模式）
USE [master]
GO
ALTER DATABASE [YourDatabaseName] SET SINGLE_USER WITH ROLLBACK IMMEDIATE
GO
RESTORE DATABASE [YourDatabaseName]
FROM DISK = N'C:\\SQLBackups\\YourDatabaseName_Full_20231201.bak'
WITH FILE = 1,
     MOVE N'YourDatabaseName_Data' TO N'C:\\SQLData\\YourDatabaseName.mdf',
     MOVE N'YourDatabaseName_Log' TO N'C:\\SQLLogs\\YourDatabaseName.ldf',
     NOUNLOAD, STATS = 5
GO
ALTER DATABASE [YourDatabaseName] SET MULTI_USER
GO

-- 完整恢复示例（完整恢复模式，带差异和日志）
USE [master]
GO
ALTER DATABASE [YourDatabaseName] SET SINGLE_USER WITH ROLLBACK IMMEDIATE
GO
-- 1. 恢复完整备份
RESTORE DATABASE [YourDatabaseName]
FROM DISK = N'C:\\SQLBackups\\YourDatabaseName_Full_20231201.bak'
WITH NORECOVERY, FILE = 1,
     MOVE N'YourDatabaseName_Data' TO N'C:\\SQLData\\YourDatabaseName.mdf',
     MOVE N'YourDatabaseName_Log' TO N'C:\\SQLLogs\\YourDatabaseName.ldf'
GO
-- 2. 恢复最新差异备份
RESTORE DATABASE [YourDatabaseName]
FROM DISK = N'C:\\SQLBackups\\YourDatabaseName_Diff_20231201_18.bak'
WITH NORECOVERY
GO
-- 3. 恢复事务日志备份（按顺序）
RESTORE LOG [YourDatabaseName]
FROM DISK = N'C:\\SQLBackups\\YourDatabaseName_Log_20231201_1830.trn'
WITH NORECOVERY
GO
RESTORE LOG [YourDatabaseName]
FROM DISK = N'C:\\SQLBackups\\YourDatabaseName_Log_20231201_1900.trn'
WITH NORECOVERY
GO
-- 4. 恢复最后一个事务日志备份（使用 RECOVERY 选项）
RESTORE LOG [YourDatabaseName]
FROM DISK = N'C:\\SQLBackups\\YourDatabaseName_Log_20231201_1930.trn'
WITH RECOVERY
GO
ALTER DATABASE [YourDatabaseName] SET MULTI_USER
GO
`;
```

## 11. 总结

在本指南中，我们介绍了如何在 Node.js 应用程序中与 Microsoft SQL Server (MSSQL) 进行交互。以下是关键要点总结：

### 核心功能与特性

- **SQL Server 优势**：微软开发的企业级关系型数据库，提供高性能、高可用性和丰富的企业级功能
- **Node.js 连接方式**：主要使用 `mssql` 包，支持连接池、参数化查询和事务处理
- **数据操作**：支持标准的 CRUD 操作，以及高级查询功能如窗口函数、PIVOT 和 JSON/XML 处理
- **高级功能**：存储过程、触发器、事务处理、加密和安全机制等企业级特性
- **ORM 集成**：可以通过 TypeORM 等 ORM 框架简化数据库操作

### 最佳实践

- **安全性**：始终使用参数化查询防止 SQL 注入，实施最小权限原则，加密敏感数据
- **性能优化**：创建适当的索引，优化查询，配置连接池，监控和分析性能指标
- **错误处理**：实施连接重试机制，适当的错误日志记录，准备灾难恢复计划
- **部署与维护**：使用环境变量管理配置，实施 CI/CD 流程，建立备份和恢复策略，设置监控和告警

### 适用场景

Microsoft SQL Server 特别适合以下场景：

- **企业级应用**：需要高可用性、安全性和可扩展性的关键业务应用
- **Windows 生态系统**：与 Microsoft 产品和服务集成的环境
- **数据仓库**：用于数据分析和商业智能的大型数据存储
- **复杂数据模型**：需要处理复杂关系和事务的应用
- **混合云部署**：通过 Azure SQL Database 支持云原生或混合部署

通过遵循本指南中的最佳实践和示例，您可以构建安全、高效、可靠的 Node.js 应用程序，充分利用 SQL Server 的强大功能，为企业级应用提供坚实的数据基础。

随着 SQL Server 的持续发展和 Node.js 生态系统的不断成熟，两者的集成将变得更加无缝和强大，为现代应用开发提供更多可能性。