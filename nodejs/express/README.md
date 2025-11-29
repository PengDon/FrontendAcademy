# Express.js 完全指南

## 介绍

Express.js是一个轻量级、灵活的Node.js Web应用框架，为构建Web和移动应用提供了简洁而强大的功能。作为最流行的Node.js框架之一，Express.js提供了路由、中间件、模板引擎等核心功能，同时保持了简单性和最小化设计哲学。本指南将详细介绍Express.js的核心概念、API使用和最佳实践，帮助您构建高效、可维护的Web应用。

## 目录

1. [Express.js简介](#expressjs简介)
2. [安装与基本设置](#安装与基本设置)
3. [路由系统](#路由系统)
   - [基本路由](#基本路由)
   - [路由参数](#路由参数)
   - [路由处理程序](#路由处理程序)
   - [路由模块化](#路由模块化)
4. [中间件](#中间件)
   - [应用级中间件](#应用级中间件)
   - [路由级中间件](#路由级中间件)
   - [错误处理中间件](#错误处理中间件)
   - [内置中间件](#内置中间件)
   - [第三方中间件](#第三方中间件)
5. [请求与响应](#请求与响应)
6. [模板引擎](#模板引擎)
7. [静态文件](#静态文件)
8. [表单处理](#表单处理)
9. [认证与授权](#认证与授权)
10. [API开发](#api开发)
11. [错误处理](#错误处理)
12. [性能优化](#性能优化)
13. [测试Express应用](#测试Express应用)
14. [部署Express应用](#部署Express应用)
15. [最佳实践](#最佳实践)
16. [总结](#总结)

## Express.js简介

Express.js是一个基于Node.js平台的Web应用框架，由TJ Holowaychuk创建，后来由IBM和StrongLoop维护。它提供了丰富的HTTP实用工具和中间件，使开发者能够快速构建Web应用和API。

### 核心特性

- **轻量级**：Express.js本身非常小，只提供了构建Web应用所需的核心功能。
- **路由系统**：强大的URL路由功能，可以轻松定义和处理不同的HTTP请求。
- **中间件架构**：灵活的中间件系统，允许请求处理逻辑的模块化和重用。
- **模板引擎支持**：内置对多种模板引擎的支持，如Pug、EJS和Handlebars。
- **静态文件服务**：简单的静态文件服务功能。
- **社区支持**：作为最流行的Node.js框架，拥有庞大的社区和丰富的生态系统。

## 安装与基本设置

### 安装Express.js

```bash
# 创建一个新的npm项目
mkdir my-express-app
cd my-express-app
npm init -y

# 安装Express
npm install express
```

### 创建基本的Express应用

创建一个名为`app.js`的文件，并添加以下代码：

```javascript
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// 基本路由
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
```

### 运行Express应用

```bash
node app.js
```

## 路由系统

路由是指确定应用如何响应客户端对特定端点的请求的机制，包括URI（或路径）和特定的HTTP请求方法（GET、POST等）。

### 基本路由

Express.js提供了一种简洁的方式来定义路由：

```javascript
// GET请求
app.get('/', (req, res) => {
  res.send('GET请求处理');
});

// POST请求
app.post('/', (req, res) => {
  res.send('POST请求处理');
});

// PUT请求
app.put('/', (req, res) => {
  res.send('PUT请求处理');
});

// DELETE请求
app.delete('/', (req, res) => {
  res.send('DELETE请求处理');
});

// 处理所有HTTP方法
app.all('/api/*', (req, res, next) => {
  console.log('API请求被处理');
  next(); // 传递给下一个处理程序
});
```

### 路由参数

路由参数是URL中命名的段，用于捕获URL中在其位置指定的值。捕获的值填充到`req.params`对象中：

```javascript
app.get('/users/:userId/books/:bookId', (req, res) => {
  res.send(req.params);
  // 例如，GET /users/34/books/8989 会返回 { "userId": "34", "bookId": "8989" }
});
```

可以使用正则表达式来限制路由参数的匹配：

```javascript
// 只有当userId是数字时才会匹配
app.get('/user/:userId(\\d+)', (req, res) => {
  res.send(req.params);
});
```

### 路由处理程序

可以为路由提供多个回调函数，它们的行为类似于中间件。唯一的区别是这些回调函数可以调用`next('route')`来绕过剩余的路由回调：

```javascript
app.get('/example/b', (req, res, next) => {
  console.log('响应将由下一个路由处理');
  next('route');
}, (req, res) => {
  res.send('这个响应不会被发送');
});

// 这个路由将处理请求
app.get('/example/b', (req, res) => {
  res.send('Hello from B');
});
```

可以使用数组组织路由处理程序：

```javascript
const cb0 = (req, res, next) => {
  console.log('CB0');
  next();
};

const cb1 = (req, res, next) => {
  console.log('CB1');
  next();
};

const cb2 = (req, res) => {
  res.send('Hello from C!');
};

app.get('/example/c', [cb0, cb1, cb2]);
```

### 路由模块化

为了更好地组织代码，建议将路由模块化。可以使用Express的`Router`对象来创建模块化的路由处理程序：

```javascript
// routes/users.js
const express = require('express');
const router = express.Router();

// 用户相关路由
router.get('/', (req, res) => {
  res.send('获取所有用户');
});

router.get('/:id', (req, res) => {
  res.send(`获取用户 ${req.params.id}`);
});

router.post('/', (req, res) => {
  res.send('创建新用户');
});

router.put('/:id', (req, res) => {
  res.send(`更新用户 ${req.params.id}`);
});

router.delete('/:id', (req, res) => {
  res.send(`删除用户 ${req.params.id}`);
});

module.exports = router;
```

然后在主应用中使用这个路由模块：

```javascript
// app.js
const express = require('express');
const app = express();
const usersRouter = require('./routes/users');

// 使用用户路由
app.use('/users', usersRouter);

app.listen(3000);
```

## 中间件

中间件函数是可以访问请求对象(`req`)、响应对象(`res`)和应用程序请求-响应周期中的下一个中间件函数的函数。下一个中间件函数通常由名为`next`的变量表示。

### 应用级中间件

应用级中间件绑定到Express应用实例，使用`app.use()`和`app.METHOD()`函数：

```javascript
// 没有挂载路径的中间件，每个请求都会执行
app.use((req, res, next) => {
  console.log('时间:', Date.now());
  next();
});

// 挂载路径的中间件，对以'/user/:id'开头的请求执行
app.use('/user/:id', (req, res, next) => {
  console.log('请求URL:', req.originalUrl);
  next();
}, (req, res, next) => {
  console.log('请求方法:', req.method);
  next();
});
```

### 路由级中间件

路由级中间件与应用级中间件类似，但是它们绑定到`express.Router()`实例：

```javascript
const router = express.Router();

// 没有挂载路径的中间件，每个路由请求都会执行
router.use((req, res, next) => {
  console.log('时间:', Date.now());
  next();
});

// 路由和处理程序
router.get('/', (req, res) => {
  res.send('主页');
});

// 将路由添加到应用
app.use('/', router);
```

### 错误处理中间件

错误处理中间件函数有四个参数：`(err, req, res, next)`。

```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('服务器错误!');
});
```

### 内置中间件

Express 4.x版本中，除了`express.static`外，其他中间件都被移除并放在单独的模块中。

```javascript
// 提供静态文件服务
app.use(express.static('public'));
app.use(express.static('uploads'));
app.use(express.static('files', { maxAge: '1d' })); // 设置缓存控制头
```

### 第三方中间件

Express有一个丰富的第三方中间件生态系统。安装所需的Node.js模块，然后在应用级别或路由级别加载它：

```javascript
// 安装: npm install cookie-parser
const cookieParser = require('cookie-parser');

// 加载cookie解析中间件
app.use(cookieParser());

// 安装: npm install body-parser
const bodyParser = require('body-parser');

// 解析JSON请求体
app.use(bodyParser.json());

// 解析URL编码的请求体
app.use(bodyParser.urlencoded({ extended: false }));
```

## 请求与响应

### 请求对象（req）

`req`对象表示HTTP请求，包含请求查询字符串、参数、主体、HTTP头信息等属性。

```javascript
app.get('/user/:id', (req, res) => {
  // 查询字符串参数
  console.log(req.query);
  
  // 路由参数
  console.log(req.params);
  
  // 请求头
  console.log(req.headers);
  
  // HTTP方法
  console.log(req.method);
  
  // 请求URL
  console.log(req.url);
  console.log(req.originalUrl);
  
  // 协议
  console.log(req.protocol);
  
  // 主机名
  console.log(req.hostname);
  
  // IP地址
  console.log(req.ip);
});
```

### 响应对象（res）

`res`对象表示HTTP响应，是Express应用程序在收到HTTP请求后发送给客户端的HTTP响应。

```javascript
app.get('/response-example', (req, res) => {
  // 发送文本响应
  res.send('Hello World');
  
  // 发送JSON响应
  res.json({ message: 'Hello World' });
  
  // 发送文件
  res.sendFile(__dirname + '/public/index.html');
  
  // 重定向
  res.redirect('/about');
  res.redirect(301, '/about'); // 指定状态码
  
  // 设置状态码
  res.status(404).send('未找到');
  
  // 设置响应头
  res.set('Content-Type', 'text/html');
  
  // 链式调用
  res.status(201).send('Created');
  
  // 设置cookie
  res.cookie('name', 'value', { maxAge: 900000 });
  
  // 清除cookie
  res.clearCookie('name');
  
  // 结束响应过程
  res.end();
});
```

## 模板引擎

Express支持多种模板引擎，允许动态生成HTML。

### 使用Pug模板引擎

```javascript
const express = require('express');
const app = express();

// 设置模板引擎
app.set('view engine', 'pug');
app.set('views', './views'); // 模板文件目录

// 路由处理
app.get('/', (req, res) => {
  res.render('index', { title: '首页', message: 'Hello Express!' });
});

app.listen(3000);
```

创建一个`views/index.pug`文件：

```pug
doctype html
html
  head
    title= title
  body
    h1= message
    p 欢迎使用Pug模板引擎
```

### 使用EJS模板引擎

```javascript
const express = require('express');
const app = express();

// 设置模板引擎
app.set('view engine', 'ejs');

// 路由处理
app.get('/', (req, res) => {
  const data = {
    title: '首页',
    message: 'Hello Express!',
    users: ['John', 'Jane', 'Bob']
  };
  res.render('index', data);
});

app.listen(3000);
```

创建一个`views/index.ejs`文件：

```html
<!DOCTYPE html>
<html>
<head>
  <title><%= title %></title>
</head>
<body>
  <h1><%= message %></h1>
  <p>欢迎使用EJS模板引擎</p>
  <ul>
    <% users.forEach(function(user) { %>
      <li><%= user %></li>
    <% }); %>
  </ul>
</body>
</html>
```

## 静态文件

Express提供了内置的中间件`express.static`来提供静态文件，如HTML文件、图像、CSS、JavaScript等。

```javascript
const express = require('express');
const app = express();
const path = require('path');

// 将public目录设置为静态文件目录
app.use(express.static('public'));

// 可以设置多个静态文件目录
app.use(express.static('public'));
app.use(express.static('uploads'));

// 可以指定挂载路径
app.use('/static', express.static('public'));

// 使用绝对路径更安全
app.use('/static', express.static(path.join(__dirname, 'public')));

// 设置缓存控制
app.use('/static', express.static(path.join(__dirname, 'public'), {
  maxAge: '1d', // 缓存1天
  etag: true, // 启用ETag
  lastModified: true // 使用文件的最后修改时间
}));

app.listen(3000);
```

## 表单处理

处理表单提交是Web应用常见的需求。Express需要中间件来解析表单数据。

### 解析URL编码的表单数据

```javascript
const express = require('express');
const app = express();

// 解析URL编码的请求体
app.use(express.urlencoded({ extended: false }));

app.post('/form', (req, res) => {
  console.log(req.body); // 包含表单数据
  res.send('表单提交成功');
});

app.listen(3000);
```

### 解析JSON请求体

```javascript
const express = require('express');
const app = express();

// 解析JSON请求体
app.use(express.json());

app.post('/api/data', (req, res) => {
  console.log(req.body); // 包含JSON数据
  res.json({ status: 'success', data: req.body });
});

app.listen(3000);
```

### 文件上传

使用`multer`中间件处理文件上传：

```javascript
const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

// 配置存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // 上传文件目录
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // 重命名文件
  }
});

// 创建上传中间件
const upload = multer({ storage: storage });

// 单文件上传
app.post('/upload/single', upload.single('file'), (req, res) => {
  console.log(req.file); // 包含上传的文件信息
  res.send('文件上传成功');
});

// 多文件上传
app.post('/upload/multiple', upload.array('files', 5), (req, res) => {
  console.log(req.files); // 包含所有上传的文件信息
  res.send('多文件上传成功');
});

app.listen(3000);
```

## 认证与授权

### 使用Passport.js进行认证

Passport.js是Express的认证中间件，支持多种认证策略。

```javascript
const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const app = express();

// 配置会话中间件
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}));

// 初始化Passport
app.use(passport.initialize());
app.use(passport.session());

// 解析请求体
app.use(express.urlencoded({ extended: false }));

// 配置本地策略
passport.use(new LocalStrategy(
  (username, password, done) => {
    // 实际应用中，这里会从数据库查询用户
    if (username === 'admin' && password === 'password') {
      return done(null, { id: 1, username: 'admin' });
    } else {
      return done(null, false, { message: '用户名或密码不正确' });
    }
  }
));

// 序列化和反序列化用户
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // 实际应用中，这里会从数据库查询用户
  done(null, { id: 1, username: 'admin' });
});

// 登录路由
app.post('/login',
  passport.authenticate('local', { 
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  })
);

// 检查认证的中间件
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// 需要认证的路由
app.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.send(`欢迎, ${req.user.username}!`);
});

// 登出路由
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.listen(3000);
```

### JWT认证

使用JSON Web Token (JWT)进行无状态认证：

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();

// 解析JSON请求体
app.use(express.json());

// 密钥
const JWT_SECRET = 'your-secret-key';

// 模拟用户数据
const users = [
  // 密码: password123
  { id: 1, username: 'admin', password: '$2b$10$4wFw3LJmQp8jPqQzKd7H5e/8JkRjW2a4f9PqKjH9f8a7d5s2b1v9' }
];

// 生成JWT的中间件
const generateToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
};

// 验证JWT的中间件
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: '未提供认证令牌' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: '无效的认证令牌' });
  }
};

// 注册路由
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 检查用户是否已存在
    if (users.find(user => user.username === username)) {
      return res.status(400).json({ message: '用户名已存在' });
    }
    
    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 创建新用户
    const newUser = { id: users.length + 1, username, password: hashedPassword };
    users.push(newUser);
    
    // 生成JWT
    const token = generateToken(newUser);
    
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 登录路由
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 查找用户
    const user = users.find(user => user.username === username);
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: '用户名或密码不正确' });
    }
    
    // 生成JWT
    const token = generateToken(user);
    
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 需要认证的路由
app.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: '这是受保护的资源', user: req.user });
});

app.listen(3000);
```

## API开发

### 构建RESTful API

RESTful API是一种设计风格，遵循HTTP协议的原则。

```javascript
const express = require('express');
const app = express();
const cors = require('cors');

// 中间件
app.use(cors());
app.use(express.json());

// 模拟数据库
let products = [
  { id: 1, name: '产品1', price: 100 },
  { id: 2, name: '产品2', price: 200 },
  { id: 3, name: '产品3', price: 300 }
];

// 获取所有产品
app.get('/api/products', (req, res) => {
  res.json(products);
});

// 获取单个产品
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  
  if (!product) {
    return res.status(404).json({ message: '产品不存在' });
  }
  
  res.json(product);
});

// 创建新产品
app.post('/api/products', (req, res) => {
  const { name, price } = req.body;
  
  if (!name || !price) {
    return res.status(400).json({ message: '请提供产品名称和价格' });
  }
  
  const newProduct = {
    id: products.length + 1,
    name,
    price
  };
  
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// 更新产品
app.put('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  
  if (!product) {
    return res.status(404).json({ message: '产品不存在' });
  }
  
  const { name, price } = req.body;
  
  if (name !== undefined) product.name = name;
  if (price !== undefined) product.price = price;
  
  res.json(product);
});

// 删除产品
app.delete('/api/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ message: '产品不存在' });
  }
  
  products.splice(index, 1);
  res.json({ message: '产品已删除' });
});

app.listen(3000);
```

## 错误处理

有效的错误处理对于构建健壮的Express应用至关重要。

### 全局错误处理中间件

```javascript
const express = require('express');
const app = express();

// 路由
app.get('/', (req, res) => {
  throw new Error('发生了一个错误');
});

// 404处理
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: '请求的资源不存在'
  });
});

// 全局错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // 根据错误类型设置不同的状态码
  const statusCode = err.statusCode || 500;
  
  // 生产环境不暴露详细错误信息
  const isProduction = process.env.NODE_ENV === 'production';
  const errorMessage = isProduction ? '服务器发生错误' : err.message;
  
  res.status(statusCode).json({
    status: 'error',
    message: errorMessage,
    // 开发环境下提供详细信息
    ...(isProduction ? {} : { stack: err.stack })
  });
});

app.listen(3000);
```

### 自定义错误类

创建自定义错误类可以更方便地处理不同类型的错误：

```javascript
// errors.js
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
    this.isOperational = true; // 标记为可操作错误
    
    // 捕获堆栈跟踪
    Error.captureStackTrace(this, this.constructor);
  }
}

// 创建不同类型的错误
class BadRequestError extends ApiError {
  constructor(message = '请求参数错误') {
    super(400, message);
  }
}

class UnauthorizedError extends ApiError {
  constructor(message = '未授权') {
    super(401, message);
  }
}

class ForbiddenError extends ApiError {
  constructor(message = '禁止访问') {
    super(403, message);
  }
}

class NotFoundError extends ApiError {
  constructor(message = '资源不存在') {
    super(404, message);
  }
}

class InternalServerError extends ApiError {
  constructor(message = '服务器内部错误') {
    super(500, message);
  }
}

module.exports = {
  ApiError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  InternalServerError
};
```

在应用中使用：

```javascript
const express = require('express');
const { NotFoundError, BadRequestError } = require('./errors');
const app = express();

// 路由
app.get('/products/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      throw new BadRequestError('无效的产品ID');
    }
    
    // 模拟查找产品
    if (parseInt(id) > 100) {
      throw new NotFoundError(`产品 ${id} 不存在`);
    }
    
    res.json({ id, name: `产品 ${id}`, price: 100 });
  } catch (error) {
    next(error); // 传递给错误处理中间件
  }
});

// 异步路由中的错误处理
app.get('/async', async (req, res, next) => {
  try {
    // 模拟异步操作
    await new Promise(resolve => setTimeout(resolve, 100));
    throw new Error('异步操作出错');
  } catch (error) {
    next(error);
  }
});

// 使用express-async-errors简化错误处理
// 安装: npm install express-async-errors
// 只需在应用开始处引入即可
require('express-async-errors');

// 现在可以这样写异步路由，错误会自动传递给错误处理中间件
app.get('/async-simplified', async (req, res) => {
  // 模拟异步操作
  await new Promise(resolve => setTimeout(resolve, 100));
  throw new Error('异步操作出错');
});

// 错误处理中间件
app.use((err, req, res, next) => {
  if (err.isOperational) {
    // 处理已知的操作错误
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }
  
  // 处理未知错误
  console.error('未捕获错误:', err);
  res.status(500).json({
    status: 'error',
    message: '服务器内部错误'
  });
});

app.listen(3000);
```

## 性能优化

### 使用中间件压缩响应

```javascript
const express = require('express');
const compression = require('compression');
const app = express();

// 使用压缩中间件
app.use(compression());

app.get('/large-response', (req, res) => {
  // 返回大型响应
  const largeData = Array(100000).fill({ name: 'Item', value: Math.random() });
  res.json(largeData);
});

app.listen(3000);
```

### 使用缓存控制

```javascript
const express = require('express');
const app = express();
const path = require('path');

// 为静态文件设置缓存控制
app.use('/static', express.static(path.join(__dirname, 'public'), {
  maxAge: '1d',
  etag: true,
  lastModified: true
}));

// 为API响应设置缓存控制
app.get('/api/data', (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=3600'); // 缓存1小时
  res.json({ data: '这是缓存的响应' });
});

app.listen(3000);
```

### 使用路由级缓存

```javascript
const express = require('express');
const NodeCache = require('node-cache');
const app = express();

// 创建缓存实例
const cache = new NodeCache({ stdTTL: 3600 }); // 默认过期时间1小时

// 缓存中间件
const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    const key = `__express__${req.originalUrl}`;
    const cachedBody = cache.get(key);
    
    if (cachedBody) {
      res.send(JSON.parse(cachedBody));
      return;
    }
    
    // 重写send方法以缓存响应
    const sendResponse = res.send;
    res.send = (body) => {
      cache.set(key, body, duration);
      sendResponse.call(res, body);
    };
    
    next();
  };
};

// 应用缓存中间件
app.get('/api/data', cacheMiddleware(3600), (req, res) => {
  // 模拟耗时操作
  setTimeout(() => {
    res.json({ data: '这是缓存的数据', timestamp: new Date() });
  }, 1000);
});

app.listen(3000);
```

## 测试Express应用

使用Jest和Supertest测试Express应用：

```javascript
// app.js
const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello World' });
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: '缺少必要字段' });
  }
  res.status(201).json({ id: 1, name, email });
});

// 导出app以便在测试中使用
module.exports = app;
```

```javascript
// server.js - 启动服务器
const app = require('./app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
```

测试文件：

```javascript
// app.test.js
const request = require('supertest');
const app = require('./app');

describe('Express应用测试', () => {
  it('GET / 应该返回Hello World消息', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Hello World' });
  });

  it('POST /api/users 应该创建新用户', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'John Doe', email: 'john@example.com' });
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('John Doe');
    expect(res.body.email).toBe('john@example.com');
  });

  it('POST /api/users 应该在缺少必要字段时返回错误', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'John Doe' });
    
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
```

安装测试依赖：

```bash
npm install --save-dev jest supertest
```

## 部署Express应用

### 使用PM2进行生产部署

PM2是一个进程管理器，可以帮助管理和保持应用在线。

```bash
# 安装PM2
npm install -g pm2

# 启动应用
pm start -- --port 8080

# 或者使用PM2启动
pm start
```

### 环境变量配置

在生产环境中，通常使用环境变量来配置应用：

```javascript
// config.js
module.exports = {
  port: process.env.PORT || 3000,
  database: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'testdb'
  },
  jwtSecret: process.env.JWT_SECRET || 'default-secret',
  environment: process.env.NODE_ENV || 'development'
};
```

使用dotenv管理环境变量：

```javascript
// 安装: npm install dotenv
// 在应用的入口文件顶部加载
require('dotenv').config();

// 然后可以使用process.env访问环境变量
const port = process.env.PORT || 3000;
```

## 最佳实践

### 代码组织

```
/my-express-app
  /bin
    www.js         # 服务器启动脚本
  /config          # 配置文件
    index.js       # 主配置
    database.js    # 数据库配置
  /controllers     # 控制器
    userController.js
    productController.js
  /middleware      # 自定义中间件
    auth.js        # 认证中间件
    error.js       # 错误处理中间件
  /models          # 数据模型
    userModel.js
    productModel.js
  /routes          # 路由
    userRoutes.js
    productRoutes.js
    index.js       # 路由索引
  /services        # 业务逻辑
    userService.js
    productService.js
  /utils           # 工具函数
    response.js    # 响应格式化
    validation.js  # 数据验证
  /views           # 模板文件
    index.ejs
    about.ejs
  /public          # 静态文件
    /css
    /js
    /images
  app.js           # Express应用配置
  package.json
  README.md
```

### 安全性最佳实践

1. **使用helmet保护HTTP头**：

```javascript
const helmet = require('helmet');
app.use(helmet());
```

2. **限制请求体大小**：

```javascript
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));
```

3. **使用cors中间件**：

```javascript
const cors = require('cors');

// 配置CORS
const corsOptions = {
  origin: 'https://example.com',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

4. **输入验证**：

```javascript
const { body, validationResult } = require('express-validator');

app.post('/user', [
  // 验证规则
  body('username').isLength({ min: 3 }).withMessage('用户名至少需要3个字符'),
  body('email').isEmail().withMessage('请提供有效的电子邮件')
], (req, res) => {
  // 检查验证结果
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  // 处理有效的请求
  res.send('验证通过!');
});
```

### 日志记录

使用winston进行日志记录：

```javascript
const winston = require('winston');
const expressWinston = require('express-winston');

// 创建应用日志记录器
const appLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    // 将错误日志写入文件
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // 将所有日志写入文件
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// 开发环境下，将日志输出到控制台
if (process.env.NODE_ENV !== 'production') {
  appLogger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// 请求日志中间件
app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}}',
  expressFormat: true,
  colorize: false,
  ignoreRoute: function (req, res) { return false; }
}));

// 错误日志中间件
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  )
}));
```

## 总结

Express.js是一个强大而灵活的Node.js Web应用框架，提供了构建Web应用和API所需的核心功能。通过本文的学习，您应该掌握了Express.js的基本概念、路由系统、中间件、请求和响应处理、认证授权、错误处理、性能优化以及部署和最佳实践等方面的知识。

在实际项目中，合理组织代码结构、使用适当的中间件、实现良好的错误处理和日志记录，以及遵循安全最佳实践，将帮助您构建高效、可靠和安全的Express应用。