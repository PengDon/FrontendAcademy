# Node.js API 开发指南

本文档提供了使用 Node.js 构建高性能、可扩展 API 的全面指南，包含从基础概念到高级主题的详细内容。

## 目录

- [API 基础概念](#api-基础概念)
- [环境设置](#环境设置)
- [基础 API 结构](#基础-api-结构)
- [路由设计](#路由设计)
- [中间件](#中间件)
- [请求处理](#请求处理)
- [响应格式化](#响应格式化)
- [数据验证](#数据验证)
- [错误处理](#错误处理)
- [数据库集成](#数据库集成)
- [认证与授权](#认证与授权)
- [API 文档](#api-文档)
- [API 版本控制](#api-版本控制)
- [性能优化](#性能优化)
- [测试](#测试)
- [部署](#部署)
- [最佳实践](#最佳实践)
- [常见问题](#常见问题)

## API 基础概念

### 什么是 API？

API（Application Programming Interface）是定义软件组件之间如何交互的规则集。在 Web 开发中，API 通常是一组端点（endpoints），允许客户端应用程序与服务器交互。

### REST API

REST（Representational State Transfer）是一种架构风格，用于设计网络应用程序。REST API 使用 HTTP 方法（GET、POST、PUT、DELETE 等）来操作资源。

### 核心原则

- **无状态**：每个请求都包含足够的信息供服务器理解和处理
- **资源导向**：通过 URI 标识资源
- **统一接口**：使用标准 HTTP 方法和状态码
- **可缓存**：响应应明确指示是否可缓存
- **分层系统**：客户端不直接与服务器交互

## 环境设置

### 安装 Node.js 和 npm

确保已安装 Node.js 和 npm：

```bash
# 检查 Node.js 版本
node -v

# 检查 npm 版本
npm -v
```

### 创建新项目

```bash
# 创建项目目录
mkdir node-api
cd node-api

# 初始化项目
npm init -y

# 安装必要的依赖
npm install express body-parser cors helmet dotenv
```

## 基础 API 结构

### 项目结构

推荐的项目结构：

```
node-api/
├── config/           # 配置文件
├── controllers/      # 控制器
├── middleware/       # 中间件
├── models/           # 数据模型
├── routes/           # 路由定义
├── services/         # 业务逻辑
├── utils/            # 工具函数
├── validators/       # 请求验证器
├── index.js          # 入口文件
├── package.json      # 项目配置
└── .env              # 环境变量
```

### 基本 Express 应用

```javascript
// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(helmet()); // 添加安全头部
app.use(cors()); // 允许跨域请求
app.use(bodyParser.json()); // 解析 JSON 请求体
app.use(bodyParser.urlencoded({ extended: true })); // 解析 URL 编码请求体

// 路由
app.get('/', (req, res) => {
  res.json({ message: 'API 服务已启动' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
```

## 路由设计

### 基础路由定义

使用 Express Router 组织路由：

```javascript
// routes/api.js
const express = require('express');
const router = express.Router();

// 获取所有资源
router.get('/resources', (req, res) => {
  res.json({ message: '获取所有资源' });
});

// 获取单个资源
router.get('/resources/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `获取资源 ${id}` });
});

// 创建新资源
router.post('/resources', (req, res) => {
  res.status(201).json({ message: '创建新资源' });
});

// 更新资源
router.put('/resources/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `更新资源 ${id}` });
});

// 删除资源
router.delete('/resources/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `删除资源 ${id}` });
});

module.exports = router;

// 在 index.js 中注册路由
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);
```

### RESTful 路由最佳实践

1. **使用名词而非动词**
   - 好：`/users`, `/products`
   - 不好：`/getUsers`, `/createProduct`

2. **使用 HTTP 方法表示操作**
   - GET：获取资源
   - POST：创建资源
   - PUT：替换资源
   - PATCH：部分更新资源
   - DELETE：删除资源

3. **嵌套资源表示关系**
   - `/users/:userId/orders`：获取用户的所有订单
   - `/users/:userId/orders/:orderId`：获取用户的特定订单

## 中间件

### 创建自定义中间件

```javascript
// middleware/logger.js
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.url}`);
  next(); // 调用 next() 继续处理请求
};

module.exports = logger;

// 在 index.js 中使用中间件
app.use(logger);
```

### 错误处理中间件

```javascript
// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  // 设置默认错误状态码
  const statusCode = err.statusCode || 500;
  
  // 安全响应（不暴露敏感错误信息）
  const response = {
    error: {
      message: statusCode === 500 ? '服务器内部错误' : err.message,
      // 在开发环境中包含更多信息
      ...(process.env.NODE_ENV === 'development' && { details: err.stack })
    }
  };
  
  res.status(statusCode).json(response);
};

module.exports = errorHandler;

// 在 index.js 中使用（放在所有路由之后）
app.use(errorHandler);
```

### 认证中间件

```javascript
// middleware/auth.js
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  
  // 检查是否提供了令牌
  if (!token) {
    return res.status(401).json({ message: '未提供认证令牌，访问被拒绝' });
  }
  
  try {
    // 验证令牌
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: '无效的令牌' });
  }
};

module.exports = auth;

// 在路由中使用
router.get('/protected', auth, (req, res) => {
  res.json({ message: '这是受保护的资源' });
});
```

## 请求处理

### 获取请求数据

```javascript
router.post('/process', (req, res) => {
  // 从请求体获取数据
  const bodyData = req.body;
  
  // 从 URL 参数获取数据
  const paramData = req.params;
  
  // 从查询字符串获取数据
  const queryData = req.query;
  
  // 从请求头获取数据
  const headerData = req.headers['content-type'];
  
  res.json({
    bodyData,
    paramData,
    queryData,
    headerData
  });
});
```

### 文件上传处理

使用 multer 处理文件上传：

```javascript
const multer = require('multer');

// 配置存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// 创建上传中间件
const upload = multer({ storage });

// 单文件上传
router.post('/upload/single', upload.single('file'), (req, res) => {
  res.json({
    message: '文件上传成功',
    file: req.file
  });
});

// 多文件上传
router.post('/upload/multiple', upload.array('files', 10), (req, res) => {
  res.json({
    message: '文件上传成功',
    files: req.files
  });
});
```

## 响应格式化

### 统一响应格式

创建一个响应格式化工具：

```javascript
// utils/responseFormatter.js
const responseFormatter = {
  success(res, data, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      data
    });
  },
  
  error(res, message, statusCode = 400) {
    return res.status(statusCode).json({
      success: false,
      error: message
    });
  },
  
  paginate(res, items, total, page, limit) {
    const totalPages = Math.ceil(total / limit);
    
    return res.json({
      success: true,
      data: items,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  }
};

module.exports = responseFormatter;

// 使用示例
router.get('/products', (req, res) => {
  const products = [/* 产品列表 */];
  const total = 100;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  
  responseFormatter.paginate(res, products, total, page, limit);
});
```

## 数据验证

### 使用 Joi 进行验证

```javascript
const Joi = require('joi');

// 定义验证模式
const userSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(18).optional()
});

// 验证中间件
const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }
  
  next();
};

// 在路由中使用
router.post('/users', validateUser, (req, res) => {
  // 创建用户
  res.json({ success: true, data: req.body });
});
```

### 使用 express-validator

```javascript
const { body, validationResult } = require('express-validator');

// 验证规则
const userValidationRules = [
  body('name').isLength({ min: 3 }).withMessage('名称至少需要3个字符'),
  body('email').isEmail().withMessage('请提供有效的电子邮件地址'),
  body('password').isLength({ min: 6 }).withMessage('密码至少需要6个字符')
];

// 验证中间件
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  
  next();
};

// 在路由中使用
router.post('/register', userValidationRules, validate, (req, res) => {
  // 处理注册
  res.json({ success: true });
});
```

## 错误处理

### 自定义错误类

```javascript
// errors/customErrors.js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends AppError {
  constructor(message = '请求无效') {
    super(message, 400);
  }
}

class NotFoundError extends AppError {
  constructor(message = '资源未找到') {
    super(message, 404);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = '未授权访问') {
    super(message, 401);
  }
}

class ForbiddenError extends AppError {
  constructor(message = '禁止访问') {
    super(message, 403);
  }
}

module.exports = {
  AppError,
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError
};

// 使用示例
router.get('/users/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    // 假设找不到用户
    if (id === '999') {
      throw new NotFoundError('用户不存在');
    }
    res.json({ user: { id, name: '示例用户' } });
  } catch (err) {
    next(err); // 传递给错误处理中间件
  }
});
```

### 异步错误处理

```javascript
// middleware/asyncHandler.js
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;

// 使用示例
const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/User');

router.get('/users/:id', asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return next(new NotFoundError(`找不到 ID 为 ${req.params.id} 的用户`));
  }
  
  res.json({ success: true, data: user });
}));
```

## 数据库集成

### MongoDB 集成

使用 Mongoose 连接 MongoDB：

```javascript
// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB 连接成功: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB 连接失败: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

// 在 index.js 中调用
const connectDB = require('./config/db');
connectDB();
```

### 创建模型

```javascript
// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '请提供名称'],
    trim: true,
    maxlength: [50, '名称不能超过50个字符']
  },
  email: {
    type: String,
    required: [true, '请提供电子邮件'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      '请提供有效的电子邮件地址'
    ]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
```

### CRUD 操作

```javascript
// controllers/userController.js
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const { NotFoundError } = require('../errors/customErrors');

exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.json({ success: true, count: users.length, data: users });
});

exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return next(new NotFoundError(`找不到 ID 为 ${req.params.id} 的用户`));
  }
  
  res.json({ success: true, data: user });
});

exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({ success: true, data: user });
});

exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  if (!user) {
    return next(new NotFoundError(`找不到 ID 为 ${req.params.id} 的用户`));
  }
  
  res.json({ success: true, data: user });
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  
  if (!user) {
    return next(new NotFoundError(`找不到 ID 为 ${req.params.id} 的用户`));
  }
  
  res.json({ success: true, data: {} });
});
```

## 认证与授权

### JWT 认证

```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const { UnauthorizedError } = require('../errors/customErrors');

// 生成令牌
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// 注册
module.exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  
  // 创建用户
  const user = await User.create({
    name,
    email,
    password: await bcrypt.hash(password, 10)
  });
  
  // 生成令牌
  const token = generateToken(user._id);
  
  res.status(201).json({
    success: true,
    token,
    data: { id: user._id, name: user.name, email: user.email }
  });
});

// 登录
module.exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  
  // 验证电子邮件和密码
  if (!email || !password) {
    return next(new BadRequestError('请提供电子邮件和密码'));
  }
  
  // 查找用户
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    return next(new UnauthorizedError('无效的凭证'));
  }
  
  // 验证密码
  const isMatch = await bcrypt.compare(password, user.password);
  
  if (!isMatch) {
    return next(new UnauthorizedError('无效的凭证'));
  }
  
  // 生成令牌
  const token = generateToken(user._id);
  
  res.json({
    success: true,
    token,
    data: { id: user._id, name: user.name, email: user.email }
  });
});
```

### 角色基础访问控制 (RBAC)

```javascript
// middleware/role.js
const { ForbiddenError } = require('../errors/customErrors');

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError('您没有权限访问此资源'));
    }
    next();
  };
};

module.exports = authorize;

// 使用示例
router.get('/admin/users', auth, authorize('admin'), (req, res) => {
  res.json({ message: '管理员访问的资源' });
});
```

## API 文档

### Swagger 文档

使用 Swagger UI Express 生成 API 文档：

```javascript
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger 配置
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API 文档',
      version: '1.0.0',
      description: 'API 详细文档',
    },
    servers: [
      {
        url: 'http://localhost:3000/api'
      }
    ]
  },
  apis: ['./routes/*.js']
};

// 生成 Swagger 规范
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// 注册 Swagger 路由
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
```

### 在路由中添加 Swagger 注释

```javascript
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: 获取所有用户
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: 成功获取用户列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 */
router.get('/users', auth, userController.getUsers);
```

## API 版本控制

### URL 路径版本控制

```javascript
// routes/v1/users.js
const express = require('express');
const router = express.Router();
const userController = require('../../controllers/v1/userController');

router.get('/', userController.getUsers);
router.get('/:id', userController.getUser);

module.exports = router;

// routes/v2/users.js
const express = require('express');
const router = express.Router();
const userController = require('../../controllers/v2/userController');

router.get('/', userController.getUsersV2); // 新版本的控制器
router.get('/:id', userController.getUserV2);

module.exports = router;

// 在 index.js 中注册版本路由
app.use('/api/v1/users', v1UserRoutes);
app.use('/api/v2/users', v2UserRoutes);
```

### 头部版本控制

```javascript
// middleware/version.js
const versionMiddleware = (req, res, next) => {
  // 从请求头获取版本
  const version = req.headers['api-version'] || '1';
  
  // 将版本存储在请求对象中
  req.apiVersion = version;
  
  next();
};

module.exports = versionMiddleware;

// 在控制器中根据版本处理
router.get('/users', versionMiddleware, (req, res) => {
  if (req.apiVersion === '2') {
    // 版本 2 的逻辑
    return res.json({ version: 'v2', data: {} });
  }
  
  // 默认版本 1 的逻辑
  res.json({ version: 'v1', data: {} });
});
```

## 性能优化

### 速率限制

防止 API 滥用和 DoS 攻击：

```javascript
const rateLimit = require('express-rate-limit');

// 全局限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 100, // 每个 IP 限制的请求数
  message: '请求频率过高，请稍后再试'
});

app.use(limiter);

// 特定路由的限制
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: 'API 请求频率过高，请稍后再试'
});

app.use('/api/', apiLimiter);

// 登录路由的限制
const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 小时
  max: 5, // 5 次尝试
  message: '登录尝试次数过多，请稍后再试'
});

app.use('/api/auth/login', loginLimiter);
```

### 缓存

使用 Redis 进行缓存：

```javascript
const redis = require('redis');
const { promisify } = require('util');

// 创建 Redis 客户端
const client = redis.createClient(process.env.REDIS_URL);

// 转换为 Promise
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

// 缓存中间件
const cacheMiddleware = async (req, res, next) => {
  const key = `cache:${req.originalUrl}`;
  
  try {
    const cachedData = await getAsync(key);
    
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }
    
    // 重写 res.json 方法来缓存响应
    const originalJson = res.json;
    res.json = function(data) {
      // 缓存成功的响应，有效期 5 分钟
      if (res.statusCode === 200) {
        setAsync(key, JSON.stringify(data), 'EX', 300);
      }
      return originalJson.call(this, data);
    };
    
    next();
  } catch (error) {
    console.error('缓存错误:', error);
    next();
  }
};

// 在路由中使用
router.get('/products', cacheMiddleware, productController.getProducts);
```

### 压缩

使用 gzip 压缩响应：

```javascript
const compression = require('compression');

// 添加压缩中间件
app.use(compression());
```

## 测试

### 单元测试

使用 Jest 进行单元测试：

```javascript
// tests/unit/userController.test.js
const { getUsers } = require('../../controllers/userController');
const User = require('../../models/User');

// 模拟 User 模型
jest.mock('../../models/User');

describe('User Controller', () => {
  describe('getUsers', () => {
    it('应该获取所有用户并返回成功响应', async () => {
      // 模拟数据
      const mockUsers = [{ name: 'John Doe', email: 'john@example.com' }];
      User.find.mockResolvedValue(mockUsers);
      
      // 模拟请求和响应对象
      const req = {};
      const res = {
        json: jest.fn()
      };
      const next = jest.fn();
      
      // 执行控制器
      await getUsers(req, res, next);
      
      // 验证结果
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: mockUsers.length,
        data: mockUsers
      });
    });
  });
});
```

### 集成测试

使用 Supertest 进行集成测试：

```javascript
// tests/integration/user.test.js
const request = require('supertest');
const app = require('../../index');
const User = require('../../models/User');

// 清除测试数据库
beforeEach(async () => {
  await User.deleteMany({});
});

describe('User API', () => {
  describe('GET /api/users', () => {
    it('应该返回所有用户', async () => {
      // 创建测试用户
      await User.create({ name: 'John Doe', email: 'john@example.com' });
      
      // 发送请求
      const res = await request(app)
        .get('/api/users')
        .expect(200);
      
      // 验证结果
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(1);
    });
  });
  
  describe('POST /api/users', () => {
    it('应该创建新用户', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({
          name: 'Jane Smith',
          email: 'jane@example.com'
        })
        .expect(201);
      
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Jane Smith');
    });
  });
});
```

## 部署

### 使用 PM2 进行生产部署

```bash
# 全局安装 PM2
npm install -g pm2

# 启动应用
pm run build
pm start

# 或直接使用 PM2 启动
pm install -g pm2
pm run build
pm prune --production
pm install pm2 -g
pm start

# 启动命令示例
pm start
```

### Docker 部署

创建 Dockerfile：

```dockerfile
FROM node:16-alpine

WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install --production

# 复制源代码
COPY . .

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["node", "index.js"]
```

创建 docker-compose.yml：

```yaml
version: '3'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - MONGO_URI=mongodb://mongo:27017/node-api
    depends_on:
      - mongo
  
  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

## 最佳实践

1. **使用环境变量**：使用 dotenv 存储敏感配置
2. **安全头部**：使用 helmet 添加安全相关的 HTTP 头
3. **输入验证**：总是验证和清理用户输入
4. **错误处理**：实现统一的错误处理机制
5. **代码组织**：遵循 MVC 或类似的架构模式
6. **日志记录**：记录关键操作和错误
7. **单元测试**：编写全面的测试用例
8. **文档**：维护最新的 API 文档
9. **版本控制**：使用语义化版本控制
10. **速率限制**：实施 API 请求限制

## 常见问题

### CORS 错误

**问题**：跨域请求被拒绝。

**解决方案**：

```javascript
const cors = require('cors');

// 允许所有跨域请求
app.use(cors());

// 或配置特定的源
const corsOptions = {
  origin: ['https://example.com', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
```

### 内存泄漏

**问题**：应用随着时间的推移使用越来越多的内存。

**解决方案**：

1. 使用 Node.js 内置的 `--expose-gc` 选项启用手动垃圾回收
2. 检查是否有未关闭的数据库连接
3. 避免在全局作用域中存储大量数据
4. 使用工具如 Clinic.js 分析内存使用情况

### 性能问题

**问题**：API 响应缓慢。

**解决方案**：

1. 实施缓存策略
2. 优化数据库查询，添加适当的索引
3. 限制响应中的数据量（分页、字段选择）
4. 使用压缩减少传输数据大小
5. 并行处理独立操作

---

## 总结

构建 Node.js API 需要考虑多个方面，包括安全性、性能、可扩展性和可维护性。通过遵循本文档中的最佳实践和使用现代工具，可以创建高质量的 API 服务。不断学习和适应新技术也是确保 API 长期成功的关键。

---

## 参考资源

- [Express.js 文档](https://expressjs.com/)
- [Node.js 文档](https://nodejs.org/en/docs/)
- [MongoDB 文档](https://docs.mongodb.com/)
- [REST API 设计最佳实践](https://restfulapi.net/)
- [JWT 文档](https://jwt.io/introduction/)
- [OWASP 安全指南](https://owasp.org/www-project-api-security/)