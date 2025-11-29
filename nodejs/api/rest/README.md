# RESTful API 基础

## 1. REST 简介

REST (Representational State Transfer) 是一种软件架构风格，用于设计网络应用程序。REST 架构的核心原则是将应用程序的功能抽象为资源，并通过标准的 HTTP 方法对这些资源进行操作。

RESTful API 是遵循 REST 原则设计的 API，具有以下特点：

- 资源导向：将应用程序的数据和功能抽象为资源
- 使用标准 HTTP 方法：GET、POST、PUT、DELETE 等
- 无状态：每个请求都包含了足够的信息，服务器不需要保存客户端的状态
- 统一接口：使用标准的接口操作资源
- 可缓存：服务器响应可以被缓存以提高性能

## 2. HTTP 方法与资源操作

RESTful API 使用 HTTP 方法来表示对资源的操作：

| HTTP 方法 | 操作 | 幂等性 | 安全性 | 描述 |
|-----------|------|--------|--------|------|
| GET | 获取资源 | ✅ | ✅ | 从服务器获取资源或资源列表 |
| POST | 创建资源 | ❌ | ❌ | 在服务器上创建新资源 |
| PUT | 更新资源 | ✅ | ❌ | 完全替换服务器上的现有资源 |
| PATCH | 部分更新资源 | ✅ | ❌ | 部分修改服务器上的现有资源 |
| DELETE | 删除资源 | ✅ | ❌ | 从服务器删除资源 |
| HEAD | 获取资源头部信息 | ✅ | ✅ | 获取资源的元数据，不返回主体 |
| OPTIONS | 获取资源支持的操作 | ✅ | ✅ | 获取资源支持的 HTTP 方法 |

## 3. RESTful API 设计原则

### 3.1 资源命名

- 使用名词表示资源，而不是动词
- 使用复数形式表示资源集合
- 使用嵌套路径表示资源之间的关系

**示例：**
- `/users` - 用户集合
- `/users/123` - 特定用户
- `/users/123/posts` - 特定用户的帖子集合
- `/users/123/posts/456` - 特定用户的特定帖子

### 3.2 状态码

使用标准的 HTTP 状态码来表示请求的结果：

- **2xx 成功**
  - 200 OK - 请求成功
  - 201 Created - 资源创建成功
  - 204 No Content - 请求成功，但没有内容返回

- **3xx 重定向**
  - 301 Moved Permanently - 资源已永久移动
  - 304 Not Modified - 资源未修改，可使用缓存

- **4xx 客户端错误**
  - 400 Bad Request - 请求参数错误
  - 401 Unauthorized - 未授权，需要身份验证
  - 403 Forbidden - 拒绝访问
  - 404 Not Found - 资源不存在
  - 405 Method Not Allowed - 不支持的 HTTP 方法

- **5xx 服务器错误**
  - 500 Internal Server Error - 服务器内部错误
  - 503 Service Unavailable - 服务器暂时不可用

### 3.3 请求和响应格式

- 使用 JSON 作为请求和响应的数据格式
- 请求头中应包含 `Content-Type: application/json`
- 响应应包含适当的状态码和描述信息

**示例响应格式：**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "张三",
    "email": "zhangsan@example.com"
  },
  "message": "操作成功"
}
```

**错误响应格式：**
```json
{
  "status": "error",
  "error": {
    "code": 400,
    "message": "请求参数错误"
  }
}
```

## 4. Node.js 实现 RESTful API

### 4.1 使用 Express 创建 RESTful API

#### 安装依赖

```bash
npm install express body-parser cors
```

#### 基本实现

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());

// 模拟数据
let users = [
  { id: 1, name: '张三', email: 'zhangsan@example.com' },
  { id: 2, name: '李四', email: 'lisi@example.com' },
  { id: 3, name: '王五', email: 'wangwu@example.com' }
];

// GET 获取所有用户
app.get('/api/users', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: users,
    message: '获取用户列表成功'
  });
});

// GET 获取单个用户
app.get('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(user => user.id === id);
  
  if (!user) {
    return res.status(404).json({
      status: 'error',
      error: {
        code: 404,
        message: '用户不存在'
      }
    });
  }
  
  res.status(200).json({
    status: 'success',
    data: user,
    message: '获取用户成功'
  });
});

// POST 创建用户
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({
      status: 'error',
      error: {
        code: 400,
        message: '姓名和邮箱不能为空'
      }
    });
  }
  
  const newUser = {
    id: users.length + 1,
    name,
    email
  };
  
  users.push(newUser);
  
  res.status(201).json({
    status: 'success',
    data: newUser,
    message: '创建用户成功'
  });
});

// PUT 更新用户
app.put('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;
  
  const userIndex = users.findIndex(user => user.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({
      status: 'error',
      error: {
        code: 404,
        message: '用户不存在'
      }
    });
  }
  
  users[userIndex] = {
    ...users[userIndex],
    name: name || users[userIndex].name,
    email: email || users[userIndex].email
  };
  
  res.status(200).json({
    status: 'success',
    data: users[userIndex],
    message: '更新用户成功'
  });
});

// DELETE 删除用户
app.delete('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(user => user.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({
      status: 'error',
      error: {
        code: 404,
        message: '用户不存在'
      }
    });
  }
  
  users.splice(userIndex, 1);
  
  res.status(204).send();
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
```

## 5. 高级特性

### 5.1 分页

对于大型数据集，实现分页是必要的：

```javascript
app.get('/api/users', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  const results = {};
  
  if (endIndex < users.length) {
    results.next = {
      page: page + 1,
      limit: limit
    };
  }
  
  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit
    };
  }
  
  results.data = users.slice(startIndex, endIndex);
  
  res.status(200).json({
    status: 'success',
    data: results,
    message: '获取用户列表成功'
  });
});
```

### 5.2 过滤和排序

实现数据过滤和排序功能：

```javascript
app.get('/api/users', (req, res) => {
  let filteredUsers = [...users];
  
  // 过滤
  if (req.query.name) {
    filteredUsers = filteredUsers.filter(user => 
      user.name.toLowerCase().includes(req.query.name.toLowerCase())
    );
  }
  
  // 排序
  if (req.query.sortBy) {
    const sortField = req.query.sortBy;
    const sortOrder = req.query.order === 'desc' ? -1 : 1;
    
    filteredUsers.sort((a, b) => {
      if (a[sortField] < b[sortField]) return -1 * sortOrder;
      if (a[sortField] > b[sortField]) return 1 * sortOrder;
      return 0;
    });
  }
  
  res.status(200).json({
    status: 'success',
    data: filteredUsers,
    message: '获取用户列表成功'
  });
});
```

### 5.3 身份验证

使用中间件实现基本身份验证：

```javascript
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({
      status: 'error',
      error: {
        code: 401,
        message: '未提供授权令牌'
      }
    });
  }
  
  // 简单的令牌验证（实际应用中应使用 JWT 等标准方案）
  const token = authHeader.split(' ')[1];
  if (token !== 'valid_token') {
    return res.status(403).json({
      status: 'error',
      error: {
        code: 403,
        message: '无效的授权令牌'
      }
    });
  }
  
  next();
};

// 应用身份验证中间件
app.get('/api/users', authenticate, (req, res) => {
  // 获取用户列表的逻辑
});
```

## 6. 最佳实践

### 6.1 版本控制

在 API URL 中包含版本号：

```
/api/v1/users
/api/v2/users
```

### 6.2 错误处理

实现全局错误处理中间件：

```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    error: {
      code: 500,
      message: '服务器内部错误'
    }
  });
});
```

### 6.3 日志记录

使用日志中间件记录 API 请求：

```javascript
const morgan = require('morgan');
app.use(morgan('combined'));
```

### 6.4 文档

使用 Swagger 为 API 创建文档：

```javascript
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '用户 API',
      version: '1.0.0',
      description: '用户管理 API 文档',
    },
  },
  apis: ['./app.js'], // 包含 API 注释的文件
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
```

## 7. 性能优化

- 使用缓存减少重复查询
- 实现数据压缩
- 使用数据库索引加速查询
- 实现数据验证，避免无效数据导致的错误
- 使用连接池管理数据库连接

## 8. 安全考虑

- 实现 CORS 策略
- 使用 HTTPS 加密传输
- 防止 SQL 注入
- 防止 XSS 攻击
- 实现速率限制，防止暴力攻击
- 敏感数据加密存储

## 9. 参考资源

- [RESTful API 设计指南](https://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api)
- [Express 文档](https://expressjs.com/)
- [HTTP 状态码](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status)
- [Swagger 文档](https://swagger.io/docs/)