# Express.js 基础

## 1. Express.js 简介

Express.js 是一个轻量级的、灵活的 Node.js Web 应用程序框架，为构建 Web 和移动应用程序提供了一组强大的功能。它是目前最流行的 Node.js Web 框架，被广泛用于构建 API、Web 应用和单页应用程序。

### 1.1 Express.js 的特点

- **轻量级且灵活**：Express 是一个简约的框架，提供了构建 Web 应用程序所需的基本功能，但不会强制执行特定的结构
- **中间件架构**：通过中间件可以轻松扩展功能
- **路由系统**：强大且灵活的路由系统，支持参数和正则表达式
- **HTTP 实用工具**：简化了 HTTP 请求和响应的处理
- **模板引擎**：支持多种模板引擎（如 Pug、EJS、Handlebars）
- **静态文件服务**：内置静态文件服务功能
- **活跃的社区**：有大量的第三方中间件和插件可用

## 2. 安装 Express.js

### 2.1 创建新项目

```bash
mkdir express-app
cd express-app
npm init -y
```

### 2.2 安装 Express

```bash
npm install express
```

### 2.3 安装开发依赖（可选）

```bash
npm install --save-dev nodemon
```

### 2.4 配置 package.json

```json
{
  "name": "express-app",
  "version": "1.0.0",
  "description": "Express.js 基础应用",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
```

## 3. 基本应用结构

### 3.1 创建基本的 Express 应用

创建 `index.js` 文件：

```javascript
const express = require('express');
const app = express();
const port = 3000;

// 基本路由
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});
```

### 3.2 运行应用

```bash
# 生产环境
npm start

# 开发环境
npm run dev
```

## 4. 路由基础

### 4.1 HTTP 方法

Express 支持所有 HTTP 方法：GET、POST、PUT、DELETE 等。

```javascript
// GET 方法
app.get('/', (req, res) => {
  res.send('GET 请求成功');
});

// POST 方法
app.post('/', (req, res) => {
  res.send('POST 请求成功');
});

// PUT 方法
app.put('/items/:id', (req, res) => {
  res.send(`更新项目 ${req.params.id}`);
});

// DELETE 方法
app.delete('/items/:id', (req, res) => {
  res.send(`删除项目 ${req.params.id}`);
});

// 处理所有方法
app.all('/api', (req, res) => {
  res.send(`接收到 ${req.method} 请求`);
});
```

### 4.2 路由参数

```javascript
// 基本路由参数
app.get('/users/:userId/books/:bookId', (req, res) => {
  res.json({
    userId: req.params.userId,
    bookId: req.params.bookId
  });
});

// 正则表达式路由
app.get('/ab+c', (req, res) => {
  res.send('ab+c');
});

app.get('/a(bc)?d', (req, res) => {
  res.send('a(bc)?d');
});
```

### 4.3 查询字符串

```javascript
app.get('/search', (req, res) => {
  res.json({
    query: req.query
  });
});
// 访问: http://localhost:3000/search?q=express&category=framework
// 返回: { "query": { "q": "express", "category": "framework" } }
```

## 5. 请求和响应对象

### 5.1 请求对象 (req)

```javascript
app.get('/request-info', (req, res) => {
  const requestInfo = {
    method: req.method,           // HTTP 方法
    url: req.url,                 // 请求 URL
    path: req.path,               // 请求路径
    query: req.query,             // 查询参数
    params: req.params,           // 路由参数
    headers: req.headers,         // 请求头
    ip: req.ip,                   // 客户端 IP
    protocol: req.protocol,       // 协议
    hostname: req.hostname,       // 主机名
    secure: req.secure            // 是否为 HTTPS
  };
  
  res.json(requestInfo);
});
```

### 5.2 响应对象 (res)

```javascript
app.get('/response-methods', (req, res) => {
  // 发送文本响应
  // res.send('Hello World');
  
  // 发送 JSON 响应
  // res.json({ message: 'Hello World' });
  
  // 发送状态码和消息
  // res.status(201).send('Created');
  
  // 重定向
  // res.redirect('/');
  
  // 设置响应头
  res.set('Content-Type', 'text/plain');
  res.send('响应头已设置');
});
```

## 6. 中间件

### 6.1 中间件的概念

中间件函数是可以访问请求对象 (req)、响应对象 (res) 和应用程序请求-响应周期中的下一个中间件函数的函数。中间件函数可以执行以下任务：

- 执行任何代码
- 修改请求和响应对象
- 结束请求-响应周期
- 调用堆栈中的下一个中间件函数

### 6.2 应用级中间件

```javascript
// 基本中间件
app.use((req, res, next) => {
  console.log('时间:', Date.now());
  next(); // 调用下一个中间件
});

// 带有挂载路径的中间件
app.use('/user/:id', (req, res, next) => {
  console.log('请求类型:', req.method);
  next();
});

// 多个回调函数中间件
app.use((req, res, next) => {
  console.log('第一个中间件');
  next();
}, (req, res, next) => {
  console.log('第二个中间件');
  next();
});
```

### 6.3 路由级中间件

路由级中间件的工作方式与应用级中间件相同，但它绑定到 `express.Router()` 的实例上。

```javascript
const router = express.Router();

// 路由级中间件
router.use((req, res, next) => {
  console.log('路由时间:', Date.now());
  next();
});

// 定义路由
router.get('/', (req, res) => {
  res.send('路由主页');
});

// 挂载路由
app.use('/api', router);
```

### 6.4 错误处理中间件

错误处理中间件始终接受四个参数：err, req, res, next。

```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('发生错误!');
});
```

### 6.5 内置中间件

Express 4.x 提供了一些内置中间件：

```javascript
// 解析 JSON 请求体
app.use(express.json());

// 解析 URL 编码的请求体
app.use(express.urlencoded({ extended: true }));

// 提供静态文件
app.use(express.static('public'));
```

### 6.6 第三方中间件

```javascript
// 安装第三方中间件
// npm install morgan

const morgan = require('morgan');

// 使用日志中间件
app.use(morgan('dev'));
```

## 7. 静态文件服务

Express 可以使用 `express.static` 中间件轻松地提供静态文件，如 HTML、CSS、JavaScript 和图像文件。

### 7.1 基本使用

```javascript
// 提供 public 目录下的静态文件
app.use(express.static('public'));

// 现在可以访问: 
// http://localhost:3000/images/kitten.jpg
// http://localhost:3000/css/style.css
// http://localhost:3000/js/app.js
```

### 7.2 使用虚拟路径前缀

```javascript
// 使用虚拟路径前缀
app.use('/static', express.static('public'));

// 现在可以访问: 
// http://localhost:3000/static/images/kitten.jpg
// http://localhost:3000/static/css/style.css
// http://localhost:3000/static/js/app.js
```

### 7.3 提供多个静态文件目录

```javascript
// 提供多个静态文件目录
app.use(express.static('public'));
app.use(express.static('files'));
```

## 8. 模板引擎

Express 支持多种模板引擎，如 Pug、EJS、Handlebars 等，用于动态生成 HTML。

### 8.1 安装和配置 Pug

```bash
npm install pug
```

```javascript
// 设置模板引擎
app.set('view engine', 'pug');

// 设置模板目录（可选，默认为 views）
app.set('views', './views');

// 创建路由渲染模板
app.get('/', (req, res) => {
  res.render('index', { title: '主页', message: 'Hello World!' });
});
```

### 8.2 创建 Pug 模板

在 `views` 目录中创建 `index.pug`：

```pug
doctype html
html
  head
    title= title
  body
    h1= message
    p 欢迎使用 Express 和 Pug
```

### 8.3 使用 EJS 模板引擎

```bash
npm install ejs
```

```javascript
// 设置 EJS 模板引擎
app.set('view engine', 'ejs');

// 创建路由渲染 EJS 模板
app.get('/ejs', (req, res) => {
  res.render('ejs-index', { title: 'EJS 模板', message: 'Hello EJS!' });
});
```

在 `views` 目录中创建 `ejs-index.ejs`：

```html
<!DOCTYPE html>
<html>
<head>
  <title><%= title %></title>
</head>
<body>
  <h1><%= message %></h1>
  <p>欢迎使用 Express 和 EJS</p>
</body>
</html>
```

## 9. Express 应用程序最佳实践

### 9.1 模块化路由

创建 `routes/users.js`：

```javascript
const express = require('express');
const router = express.Router();

// 用户路由
router.get('/', (req, res) => {
  res.send('获取所有用户');
});

router.get('/:id', (req, res) => {
  res.send(`获取用户 ${req.params.id}`);
});

router.post('/', (req, res) => {
  res.send('创建新用户');
});

module.exports = router;
```

在主应用程序中使用：

```javascript
const usersRouter = require('./routes/users');
app.use('/users', usersRouter);
```

### 9.2 环境变量

使用 `dotenv` 包管理环境变量：

```bash
npm install dotenv
```

创建 `.env` 文件：

```
PORT=3000
NODE_ENV=development
```

在应用程序中使用：

```javascript
require('dotenv').config();

const port = process.env.PORT || 3000;
const nodeEnv = process.env.NODE_ENV;

app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port} (${nodeEnv})`);
});
```

### 9.3 错误处理

```javascript
// 404 处理中间件
app.use((req, res, next) => {
  res.status(404).send('未找到页面');
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});
```

## 10. 实用示例

### 10.1 构建 RESTful API

```javascript
const express = require('express');
const app = express();

app.use(express.json());

// 模拟数据
let items = [
  { id: 1, name: '物品 1', description: '描述 1' },
  { id: 2, name: '物品 2', description: '描述 2' }
];

// 获取所有物品
app.get('/api/items', (req, res) => {
  res.json(items);
});

// 获取单个物品
app.get('/api/items/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).send('物品未找到');
  res.json(item);
});

// 创建物品
app.post('/api/items', (req, res) => {
  const newItem = {
    id: items.length + 1,
    name: req.body.name,
    description: req.body.description
  };
  items.push(newItem);
  res.status(201).json(newItem);
});

// 更新物品
app.put('/api/items/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).send('物品未找到');
  
  item.name = req.body.name;
  item.description = req.body.description;
  
  res.json(item);
});

// 删除物品
app.delete('/api/items/:id', (req, res) => {
  const itemIndex = items.findIndex(i => i.id === parseInt(req.params.id));
  if (itemIndex === -1) return res.status(404).send('物品未找到');
  
  const deletedItem = items.splice(itemIndex, 1);
  res.json(deletedItem[0]);
});

app.listen(3000, () => {
  console.log('服务器运行在 http://localhost:3000');
});
```

### 10.2 文件上传

使用 `multer` 处理文件上传：

```bash
npm install multer
```

```javascript
const express = require('express');
const multer = require('multer');
const app = express();

// 配置文件存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// 确保 uploads 目录存在
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// 文件上传路由
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({
    message: '文件上传成功',
    file: req.file
  });
});

// 多文件上传
app.post('/upload-multiple', upload.array('files', 5), (req, res) => {
  res.json({
    message: '文件上传成功',
    files: req.files
  });
});

app.listen(3000, () => {
  console.log('服务器运行在 http://localhost:3000');
});
```

### 10.3 表单验证

使用 `express-validator` 进行表单验证：

```bash
npm install express-validator
```

```javascript
const express = require('express');
const { body, validationResult } = require('express-validator');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 用户注册路由
app.post('/register', [
  // 验证规则
  body('username').isLength({ min: 3 }).withMessage('用户名至少3个字符'),
  body('email').isEmail().withMessage('必须是有效的电子邮件'),
  body('password').isLength({ min: 6 }).withMessage('密码至少6个字符')
], (req, res) => {
  // 检查验证结果
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  // 处理有效的注册数据
  res.json({
    message: '注册成功',
    user: {
      username: req.body.username,
      email: req.body.email
    }
  });
});

app.listen(3000, () => {
  console.log('服务器运行在 http://localhost:3000');
});
```

## 11. 参考资源

- [Express.js 官方文档](https://expressjs.com/)
- [Express 中间件](https://expressjs.com/en/guide/using-middleware.html)
- [Express 路由](https://expressjs.com/en/guide/routing.html)
- [Express 错误处理](https://expressjs.com/en/guide/error-handling.html)
- [Multer 文件上传](https://github.com/expressjs/multer)
- [Express Validator](https://express-validator.github.io/docs/)