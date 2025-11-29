# Node.js API 设计与实现

## API 设计概述

API（应用程序编程接口）是现代应用程序架构的关键组成部分，它定义了不同系统之间的通信方式。在Node.js后端开发中，我们通常会实现RESTful API或GraphQL API来提供数据服务。本文将介绍如何在Node.js中设计和实现高质量的API。

## RESTful API 设计原则

REST（表述性状态传递）是一种软件架构风格，它使用HTTP协议进行通信。RESTful API设计遵循以下原则：

1. **资源导向**：将所有功能视为资源，使用URL表示资源
2. **使用标准HTTP方法**：GET、POST、PUT、DELETE等表示操作
3. **无状态**：每个请求都包含完整的必要信息
4. **一致的接口**：使用标准的HTTP状态码和格式
5. **资源表述**：使用JSON或XML等格式表示资源状态

## Express.js 实现 RESTful API

Express.js是Node.js最流行的Web框架之一，它提供了强大而灵活的功能，可以快速实现RESTful API。

### 基础设置

```javascript
// 安装依赖
// npm install express body-parser cors helmet

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(helmet()); // 安全相关的HTTP头
app.use(cors()); // 启用CORS
app.use(bodyParser.json()); // 解析JSON请求体
app.use(bodyParser.urlencoded({ extended: true })); // 解析URL编码的请求体

// 基础路由
app.get('/', (req, res) => {
  res.json({ message: 'API服务正常运行！' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
```

### 路由组织

为了更好地组织API，我们可以使用Express的Router来模块化路由：

```javascript
// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// 公共路由
router.post('/register', userController.register);
router.post('/login', userController.login);

// 需要认证的路由
router.use(authMiddleware.protect);
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

module.exports = router;

// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;

// app.js - 整合路由
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

// API路由
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
```

### 控制器实现

控制器处理业务逻辑并返回响应：

```javascript
// controllers/userController.js
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

// @desc    注册新用户
// @route   POST /api/v1/users/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  
  // 检查用户是否已存在
  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new ErrorResponse('该邮箱已被注册', 400));
  }
  
  // 创建新用户
  const user = await User.create({
    name,
    email,
    password // 密码应该在模型中被哈希处理
  });
  
  // 生成令牌
  const token = user.getSignedJwtToken();
  
  res.status(201).json({
    success: true,
    token,
    data: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
});

// @desc    用户登录
// @route   POST /api/v1/users/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  
  // 验证请求数据
  if (!email || !password) {
    return next(new ErrorResponse('请提供邮箱和密码', 400));
  }
  
  // 查找用户并验证密码
  const user = await User.findOne({ email }).select('+password');
  
  if (!user || !(await user.matchPassword(password))) {
    return next(new ErrorResponse('邮箱或密码错误', 401));
  }
  
  // 生成令牌
  const token = user.getSignedJwtToken();
  
  res.status(200).json({
    success: true,
    token
  });
});

// @desc    获取当前用户资料
// @route   GET /api/v1/users/profile
// @access  Private
exports.getProfile = asyncHandler(async (req, res, next) => {
  // req.user 是在authMiddleware中设置的
  const user = await User.findById(req.user.id);
  
  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    更新用户资料
// @route   PUT /api/v1/users/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const updateData = {
    name: req.body.name,
    email: req.body.email
  };
  
  // 如果提供了新密码，则更新密码
  if (req.body.password) {
    updateData.password = req.body.password;
  }
  
  const user = await User.findByIdAndUpdate(req.user.id, updateData, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: user
  });
});
```

### 模型设计

使用Mongoose设计数据模型：

```javascript
// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '请提供用户名'],
    trim: true,
    maxLength: [50, '用户名不能超过50个字符']
  },
  email: {
    type: String,
    required: [true, '请提供邮箱地址'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
      '请提供有效的邮箱地址'
    ]
  },
  password: {
    type: String,
    required: [true, '请提供密码'],
    minLength: [6, '密码长度至少6个字符'],
    select: false // 查询时默认不返回密码
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 密码哈希中间件
UserSchema.pre('save', async function(next) {
  // 只有在密码被修改或创建新用户时才哈希密码
  if (!this.isModified('password')) {
    return next();
  }
  
  // 哈希密码
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 密码匹配方法
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 生成JWT令牌方法
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

module.exports = mongoose.model('User', UserSchema);
```

### 中间件实现

创建身份验证中间件：

```javascript
// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../utils/asyncHandler');

// 保护路由的中间件
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  
  // 检查Authorization头
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // 提取token
    token = req.headers.authorization.split(' ')[1];
  }
  
  // 如果没有token
  if (!token) {
    return next(new ErrorResponse('未授权访问', 401));
  }
  
  try {
    // 验证token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 从token中提取用户ID并设置到请求对象
    req.user = await User.findById(decoded.id);
    
    if (!req.user) {
      return next(new ErrorResponse('用户不存在', 404));
    }
    
    next();
  } catch (error) {
    return next(new ErrorResponse('无效的令牌', 401));
  }
});

// 角色权限检查中间件
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `用户角色 ${req.user.role} 无权执行此操作`,
          403
        )
      );
    }
    next();
  };
};
```

### 错误处理

实现统一的错误处理中间件：

```javascript
// utils/ErrorResponse.js
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = ErrorResponse;

// utils/asyncHandler.js
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;

// middleware/errorMiddleware.js
const ErrorResponse = require('../utils/ErrorResponse');

const errorHandler = (err, req, res, next) => {
  // 记录错误日志
  console.error(err.stack);
  
  // 创建错误副本，以便我们可以修改它
  let error = { ...err };
  error.message = err.message;
  
  // MongoDB ObjectId错误
  if (err.name === 'CastError') {
    const message = `未找到ID为 ${err.value} 的资源`;
    error = new ErrorResponse(message, 404);
  }
  
  // MongoDB 重复键错误
  if (err.code === 11000) {
    const message = '重复的字段值，请使用其他值';
    error = new ErrorResponse(message, 400);
  }
  
  // MongoDB 验证错误
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message.join(', '), 400);
  }
  
  // JWT 验证错误
  if (err.name === 'JsonWebTokenError') {
    const message = '无效的令牌';
    error = new ErrorResponse(message, 401);
  }
  
  // JWT 过期错误
  if (err.name === 'TokenExpiredError') {
    const message = '令牌已过期';
    error = new ErrorResponse(message, 401);
  }
  
  // 发送错误响应
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || '服务器内部错误'
  });
};

module.exports = errorHandler;

// 在app.js中使用错误处理中间件
const errorHandler = require('./middleware/errorMiddleware');

// 放在所有路由之后
app.use(errorHandler);
```

## GraphQL API 实现

GraphQL是一种查询语言，也是一个运行时，它允许客户端精确地指定需要的数据。以下是使用Apollo Server实现GraphQL API的方法。

### 基础设置

```javascript
// 安装依赖
// npm install apollo-server-express express mongoose

const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const mongoose = require('mongoose');

// 连接数据库
mongoose.connect('mongodb://localhost:27017/graphql-demo', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// 定义数据模型
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
});

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const User = mongoose.model('User', UserSchema);
const Post = mongoose.model('Post', PostSchema);

// 定义GraphQL类型
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    posts: [Post!]!
    post(id: ID!): Post
  }

  type Mutation {
    createUser(name: String!, email: String!): User!
    createPost(title: String!, content: String!, authorId: ID!): Post!
    updateUser(id: ID!, name: String, email: String): User!
    updatePost(id: ID!, title: String, content: String): Post!
    deleteUser(id: ID!): Boolean!
    deletePost(id: ID!): Boolean!
  }
`;

// 定义解析器
const resolvers = {
  Query: {
    users: async () => await User.find().populate('posts'),
    user: async (_, { id }) => await User.findById(id).populate('posts'),
    posts: async () => await Post.find().populate('author'),
    post: async (_, { id }) => await Post.findById(id).populate('author')
  },
  Mutation: {
    createUser: async (_, { name, email }) => {
      const user = new User({ name, email });
      await user.save();
      return user;
    },
    createPost: async (_, { title, content, authorId }) => {
      const user = await User.findById(authorId);
      if (!user) throw new Error('用户不存在');
      
      const post = new Post({ title, content, author: authorId });
      await post.save();
      
      user.posts.push(post._id);
      await user.save();
      
      return post.populate('author');
    },
    updateUser: async (_, { id, name, email }) => {
      const user = await User.findByIdAndUpdate(
        id,
        { $set: { name, email } },
        { new: true }
      );
      if (!user) throw new Error('用户不存在');
      return user.populate('posts');
    },
    updatePost: async (_, { id, title, content }) => {
      const post = await Post.findByIdAndUpdate(
        id,
        { $set: { title, content } },
        { new: true }
      );
      if (!post) throw new Error('文章不存在');
      return post.populate('author');
    },
    deleteUser: async (_, { id }) => {
      const user = await User.findByIdAndDelete(id);
      if (!user) throw new Error('用户不存在');
      
      // 删除该用户的所有文章
      await Post.deleteMany({ author: id });
      
      return true;
    },
    deletePost: async (_, { id }) => {
      const post = await Post.findByIdAndDelete(id);
      if (!post) throw new Error('文章不存在');
      
      // 从用户的posts数组中移除
      await User.findByIdAndUpdate(post.author, {
        $pull: { posts: id }
      });
      
      return true;
    }
  },
  // 嵌套解析器
  User: {
    posts: async (parent) => {
      return await Post.find({ author: parent._id });
    }
  },
  Post: {
    author: async (parent) => {
      return await User.findById(parent.author);
    }
  }
};

async function startServer() {
  const app = express();
  
  // 创建Apollo服务器
  const server = new ApolloServer({
    typeDefs,
    resolvers
  });
  
  await server.start();
  
  // 将Apollo服务器应用到Express
  server.applyMiddleware({ app });
  
  // 启动Express服务器
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();
```

### 身份验证与授权

```javascript
// 添加JWT身份验证到GraphQL
const { ApolloServer, gql, AuthenticationError } = require('apollo-server-express');
const jwt = require('jsonwebtoken');

// 修改Apollo服务器配置
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // 从请求头获取token
    const token = req.headers.authorization || '';
    
    // 如果没有token，返回空上下文
    if (!token) return {};
    
    try {
      // 验证token
      const user = jwt.verify(token.replace('Bearer ', ''), 'your-secret-key');
      return { user };
    } catch (error) {
      // token无效
      throw new AuthenticationError('无效的身份验证');
    }
  }
});

// 在解析器中使用身份验证
const resolvers = {
  // ... 其他解析器
  Mutation: {
    createPost: async (_, { title, content }, { user }) => {
      // 检查用户是否已验证
      if (!user) throw new AuthenticationError('需要登录');
      
      // 创建文章
      const post = new Post({
        title,
        content,
        author: user.id
      });
      
      await post.save();
      return post;
    },
    // ... 其他需要身份验证的解析器
  }
};
```

### GraphQL 与 RESTful API 结合

在某些情况下，你可能希望同时提供RESTful API和GraphQL API。以下是如何实现的示例：

```javascript
// app.js
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const mongoose = require('mongoose');

// 连接数据库
mongoose.connect('mongodb://localhost:27017/combined-api', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// 定义数据模型
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String }
});

const Product = mongoose.model('Product', ProductSchema);

// RESTful API 路由
const app = express();
app.use(express.json());

// RESTful 路由
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: '产品不存在' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GraphQL 类型定义
const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    price: Float!
    description: String
  }

  type Query {
    products: [Product!]!
    product(id: ID!): Product
  }

  type Mutation {
    createProduct(name: String!, price: Float!, description: String): Product!
    updateProduct(id: ID!, name: String, price: Float, description: String): Product!
    deleteProduct(id: ID!): Boolean!
  }
`;

// GraphQL 解析器
const resolvers = {
  Query: {
    products: async () => await Product.find(),
    product: async (_, { id }) => await Product.findById(id)
  },
  Mutation: {
    createProduct: async (_, { name, price, description }) => {
      const product = new Product({ name, price, description });
      await product.save();
      return product;
    },
    updateProduct: async (_, { id, name, price, description }) => {
      const product = await Product.findByIdAndUpdate(
        id,
        { $set: { name, price, description } },
        { new: true }
      );
      return product;
    },
    deleteProduct: async (_, { id }) => {
      await Product.findByIdAndDelete(id);
      return true;
    }
  }
};

// 设置Apollo服务器
async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers
  });
  
  await server.start();
  server.applyMiddleware({ app });
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`RESTful API 运行在 http://localhost:${PORT}/api`);
    console.log(`GraphQL API 运行在 http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();
```

## 高级API设计实践

### 版本控制

API版本控制允许在不破坏现有客户端的情况下引入更改：

```javascript
// 路径版本控制 (推荐)
// app.js
app.use('/api/v1/products', productRoutesV1);
app.use('/api/v2/products', productRoutesV2);

// 头部版本控制
function versionMiddleware(req, res, next) {
  const version = req.headers['api-version'] || 'v1';
  req.apiVersion = version;
  next();
}

app.use(versionMiddleware);
app.use('/api/products', (req, res, next) => {
  if (req.apiVersion === 'v1') {
    return productRoutesV1(req, res, next);
  } else if (req.apiVersion === 'v2') {
    return productRoutesV2(req, res, next);
  }
  res.status(400).json({ error: '不支持的API版本' });
});
```

### 数据验证

使用Joi或express-validator进行请求数据验证：

```javascript
// 安装依赖
// npm install joi

const Joi = require('joi');

// 验证模式
const productSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  price: Joi.number().min(0).required(),
  description: Joi.string().max(1000),
  category: Joi.string().required(),
  tags: Joi.array().items(Joi.string())
});

// 验证中间件
function validateProduct(req, res, next) {
  const { error, value } = productSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }
  
  // 替换请求体为验证后的数据
  req.body = value;
  next();
}

// 在路由中使用
router.post('/products', validateProduct, productController.createProduct);
```

### 速率限制

使用express-rate-limit保护API免受暴力攻击：

```javascript
// 安装依赖
// npm install express-rate-limit

const rateLimit = require('express-rate-limit');

// 全局速率限制
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 每IP限制请求数
  message: '此IP的请求过于频繁，请15分钟后再试',
  standardHeaders: true,
  legacyHeaders: false
});

// 应用到所有API路由
app.use('/api/', apiLimiter);

// 更严格的登录限制
const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1小时
  max: 5, // 每IP限制请求数
  message: '登录尝试次数过多，请1小时后再试',
  standardHeaders: true,
  legacyHeaders: false
});

// 应用到登录路由
app.use('/api/v1/auth/login', loginLimiter);
```

### 请求日志记录

使用morgan记录HTTP请求：

```javascript
// 安装依赖
// npm install morgan winston

const morgan = require('morgan');
const winston = require('winston');

// 配置Winston日志器
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// 在开发环境中输出到控制台
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// 创建自定义morgan格式
morgan.token('body', function(req, res) {
  return JSON.stringify(req.body);
});

// 使用morgan和Winston
app.use(morgan(
  ':method :url :status :response-time ms - :res[content-length] :body',
  { 
    stream: {
      write: message => logger.info(message.trim())
    }
  }
));
```

### API文档生成

使用Swagger自动生成API文档：

```javascript
// 安装依赖
// npm install swagger-jsdoc swagger-ui-express

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger 配置
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API文档',
      version: '1.0.0',
      description: 'RESTful API文档示例',
      contact: {
        name: '开发者',
        email: 'developer@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/*.js'] // 指定包含Swagger注释的文件
};

// 初始化Swagger文档
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// 使用Swagger UI中间件
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 在路由文件中添加Swagger注释
/**
 * @swagger
 * /products: 
 *  get:
 *    summary: 获取所有产品
 *    tags: [Products]
 *    responses:
 *      200:
 *        description: 成功获取产品列表
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Product'
 *      500:
 *        description: 服务器错误
 */
router.get('/products', productController.getAllProducts);

/**
 * @swagger
 * /products: 
 *  post:
 *    summary: 创建新产品
 *    tags: [Products]
 *    security: 
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ProductCreate'
 *    responses:
 *      201:
 *        description: 成功创建产品
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 *      400:
 *        description: 请求数据无效
 *      401:
 *        description: 未授权
 */
router.post('/products', authMiddleware.protect, productController.createProduct);
```

## 常见问题与答案

### 1. RESTful API 和 GraphQL API 有什么区别？
**答案：**
- **数据获取方式**：RESTful API 每个端点返回固定数据结构；GraphQL 允许客户端精确指定需要的数据
- **请求次数**：RESTful API 可能需要多次请求获取关联数据；GraphQL 一次请求可获取所有需要的数据
- **版本控制**：RESTful API 通常需要创建新端点（如 /v1/, /v2/）；GraphQL 通过添加新字段即可演进
- **状态码**：RESTful API 使用 HTTP 状态码表示操作结果；GraphQL 通常返回 200，在响应体中包含错误信息
- **学习曲线**：RESTful API 概念简单易于理解；GraphQL 有更陡峭的学习曲线

### 2. 如何设计好的API命名规范？
**答案：**
- **使用名词表示资源**：`/users`、`/products`
- **使用复数形式**：`/users` 而不是 `/user`
- **使用HTTP方法表示操作**：GET(读取)、POST(创建)、PUT(更新)、DELETE(删除)
- **使用嵌套路径表示关系**：`/users/{id}/orders` 表示用户的订单
- **使用查询参数进行过滤和分页**：`/products?category=electronics&page=1&limit=10`
- **保持一致性**：在整个API中使用相同的命名约定和格式

### 3. 如何实现API的安全认证？
**答案：**
- **JWT认证**：使用JSON Web Token进行无状态认证
- **OAuth 2.0**：用于第三方应用授权
- **API密钥**：简单的API访问控制
- **基本认证**：用户名密码认证（通常只用于内部API）
- **HTTPS**：加密传输数据
- **刷新令牌**：延长会话生命周期，减少重新登录次数

### 4. 如何处理API中的并发请求？
**答案：**
- **乐观锁**：使用版本号或时间戳检测冲突
  ```javascript
  // 更新前检查版本号
  const product = await Product.findById(id);
  if (product.version !== req.body.version) {
    return res.status(409).json({ error: '数据已被修改，请刷新后重试' });
  }
  
  // 更新时增加版本号
  product.set(req.body);
  product.version += 1;
  await product.save();
  ```
- **悲观锁**：在事务中锁定资源
- **使用数据库事务**：保证操作的原子性
- **队列处理**：对于高并发的写操作，使用队列顺序处理

### 5. 如何优化API性能？
**答案：**
- **缓存策略**：使用Redis缓存频繁访问的数据
- **数据库优化**：合理的索引、查询优化、读写分离
- **分页查询**：限制返回数据量
- **数据压缩**：使用gzip压缩响应
- **使用HTTP缓存**：设置适当的Cache-Control头
- **数据库连接池**：复用数据库连接
- **异步处理**：对于耗时操作，使用消息队列异步处理

### 6. 如何处理API的错误？
**答案：**
- **统一错误格式**：所有错误返回一致的结构
  ```javascript
  {
    "success": false,
    "error": "错误消息",
    "code": "ERROR_CODE"
  }
  ```
- **适当的HTTP状态码**：使用标准的HTTP状态码表示不同错误
- **详细但安全的错误信息**：提供足够的上下文，但避免泄露敏感信息
- **日志记录**：记录所有错误以便调试和监控
- **友好的错误处理中间件**：集中处理所有错误

### 7. 如何实现API的国际化？
**答案：**
- **使用i18n库**：如i18n-js、node-polyglot等
- **基于Accept-Language头**：根据客户端语言首选项返回对应语言的响应
- **支持语言参数**：允许客户端通过参数覆盖语言设置
- **错误消息国际化**：所有错误消息支持多语言
- **日期和数字格式化**：根据语言环境格式化日期和数字

### 8. 如何实现API的限流和防滥用？
**答案：**
- **基于IP的限流**：限制每个IP的请求频率
- **基于用户的限流**：对已认证用户设置合理的请求限制
- **API密钥限流**：对不同级别的API密钥设置不同的限制
- **熔断机制**：当API负载过高时，临时拒绝部分请求
- **异常检测**：监控异常请求模式，自动识别和阻止恶意行为
- **渐进式响应延迟**：对频繁请求增加响应延迟

### 9. 如何设计良好的API错误响应？
**答案：**
- **包含错误代码**：提供机器可读的错误代码
- **详细的错误描述**：清晰解释错误原因
- **可能的解决方案**：提供解决问题的建议
- **请求ID**：包含请求ID以便追踪和调试
- **分类错误**：区分客户端错误和服务器错误
- **保持一致性**：在整个API中使用统一的错误格式

### 10. 如何测试API的正确性和性能？
**答案：**
- **单元测试**：测试各个组件的功能
- **集成测试**：测试多个组件之间的协作
- **端到端测试**：模拟真实用户场景测试API
- **负载测试**：使用工具如JMeter、k6测试API在高负载下的性能
- **契约测试**：确保API符合规定的接口规范
- **监控工具**：使用APM工具如New Relic、Datadog监控API性能
- **文档测试**：验证API是否符合文档描述