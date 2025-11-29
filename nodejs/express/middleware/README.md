# Express.js 中间件

## 1. 中间件基础概念

中间件是 Express.js 的核心概念之一，它允许开发者访问请求对象 (req)、响应对象 (res) 以及应用程序的请求-响应周期中的下一个中间件函数。中间件可以执行各种任务，如日志记录、身份验证、请求解析等，从而为应用程序提供了强大的扩展性。

### 1.1 中间件的定义

中间件函数是一个可以访问请求对象、响应对象和下一个中间件函数的函数。其基本结构如下：

```javascript
function middleware(req, res, next) {
  // 执行某些操作
  next(); // 调用下一个中间件
}
```

### 1.2 中间件的作用

中间件可以执行以下任务：

- 执行任何代码
- 修改请求和响应对象
- 结束请求-响应周期
- 调用堆栈中的下一个中间件函数

### 1.3 中间件的分类

Express.js 中的中间件可以分为以下几类：

1. **应用级中间件**：绑定到整个 Express 应用程序实例
2. **路由级中间件**：绑定到特定路由
3. **错误处理中间件**：专门用于处理错误
4. **内置中间件**：Express 内置的中间件功能
5. **第三方中间件**：由社区或第三方开发者提供的中间件

## 2. 应用级中间件

应用级中间件绑定到 Express 应用程序实例，使用 `app.use()` 和 `app.METHOD()` 函数来加载。

### 2.1 基本应用级中间件

```javascript
const express = require('express');
const app = express();

// 没有挂载路径的中间件，应用于所有请求
app.use((req, res, next) => {
  console.log('时间:', Date.now());
  next(); // 必须调用 next() 继续处理请求
});

// 路由处理程序
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000);
```

### 2.2 挂载路径的中间件

中间件可以挂载到特定的路径，只对该路径下的请求生效：

```javascript
// 此中间件只应用于 /user/:id 路径的请求
app.use('/user/:id', (req, res, next) => {
  console.log('请求URL:', req.originalUrl);
  next();
});

// 此中间件也应用于 /user/:id 路径的请求
app.use('/user/:id', (req, res, next) => {
  console.log('请求方法:', req.method);
  next();
});
```

### 2.3 中间件堆栈

多个中间件可以按照声明顺序组成一个处理堆栈：

```javascript
// 中间件堆栈示例
app.use('/user/:id', [
  (req, res, next) => {
    console.log('中间件 1');
    next();
  },
  (req, res, next) => {
    console.log('中间件 2');
    next();
  },
  (req, res) => {
    res.send('用户 ID: ' + req.params.id);
  }
]);
```

### 2.4 结束请求-响应周期

如果中间件处理完请求后不调用 `next()`，那么请求处理将停止，不会继续执行后续的中间件或路由处理程序：

```javascript
app.use('/block', (req, res) => {
  res.send('请求被阻止');
  // 没有调用 next()，请求处理在此结束
});

// 这个路由处理程序永远不会被执行
app.get('/block', (req, res) => {
  res.send('这不会被发送');
});
```

## 3. 路由级中间件

路由级中间件与应用级中间件工作方式相同，但它绑定到 `express.Router()` 的实例，而不是整个 Express 应用程序实例。这有助于更好地组织和模块化应用程序路由。

### 3.1 创建路由级中间件

```javascript
const express = require('express');
const app = express();
const router = express.Router();

// 路由级中间件，应用于该路由器的所有路由
router.use((req, res, next) => {
  console.log('时间:', Date.now());
  next();
});

// 路由级中间件，只应用于特定路径
router.use('/:id', (req, res, next) => {
  console.log('用户 ID:', req.params.id);
  if (req.params.id === '0') {
    res.status(400).send('无效的用户 ID');
  } else {
    next();
  }
});

// 定义路由
router.get('/', (req, res) => {
  res.send('路由主页');
});

router.get('/:id', (req, res) => {
  res.send('获取用户 ' + req.params.id);
});

// 将路由器挂载到应用程序
app.use('/users', router);

app.listen(3000);
```

### 3.2 模块化路由示例

在实际应用中，通常将路由分散到不同的文件中，以提高代码的可维护性：

**routes/users.js**:

```javascript
const express = require('express');
const router = express.Router();

// 用户路由中间件
router.use((req, res, next) => {
  console.log('用户路由中间件');
  next();
});

router.get('/', (req, res) => {
  res.send('所有用户');
});

router.get('/:id', (req, res) => {
  res.send('用户 ' + req.params.id);
});

module.exports = router;
```

**app.js**:

```javascript
const express = require('express');
const app = express();
const usersRouter = require('./routes/users');

app.use('/users', usersRouter);

app.listen(3000);
```

## 4. 错误处理中间件

错误处理中间件专门用于处理请求处理过程中发生的错误。它有四个参数：`err`, `req`, `res`, `next`。

### 4.1 基本错误处理中间件

```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('发生错误!');
});
```

### 4.2 错误处理中间件的位置

错误处理中间件必须在所有其他路由和中间件之后定义，否则它可能无法捕获到所有错误：

```javascript
const express = require('express');
const app = express();

// 应用级中间件
app.use(express.json());

// 路由
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/error', (req, res) => {
  throw new Error('测试错误');
});

// 错误处理中间件（必须放在最后）
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: err.message
  });
});

app.listen(3000);
```

### 4.3 抛出错误

在路由处理程序或中间件中，可以使用 `next(err)` 来传递错误给错误处理中间件：

```javascript
app.get('/check/:id', (req, res, next) => {
  if (req.params.id < 1) {
    const error = new Error('ID 必须大于 0');
    next(error);
  } else {
    res.send('ID 有效');
  }
});
```

## 5. 内置中间件

Express 4.x 提供了一些内置中间件功能，用于常见的任务。

### 5.1 express.json()

解析 JSON 请求体：

```javascript
app.use(express.json());

app.post('/data', (req, res) => {
  console.log(req.body); // 可以访问 JSON 数据
  res.send('接收 JSON 数据');
});
```

### 5.2 express.urlencoded()

解析 URL 编码的请求体（通常来自表单提交）：

```javascript
app.use(express.urlencoded({ extended: true }));

app.post('/form', (req, res) => {
  console.log(req.body); // 可以访问表单数据
  res.send('接收表单数据');
});
```

### 5.3 express.static()

提供静态文件服务，如 HTML、CSS、JavaScript 和图像文件：

```javascript
// 提供 public 目录下的静态文件
app.use(express.static('public'));

// 现在可以访问:
// http://localhost:3000/images/kitten.jpg
// http://localhost:3000/css/style.css
```

### 5.4 使用虚拟路径前缀

可以为静态文件提供一个虚拟路径前缀：

```javascript
app.use('/static', express.static('public'));

// 现在可以访问:
// http://localhost:3000/static/images/kitten.jpg
// http://localhost:3000/static/css/style.css
```

## 6. 第三方中间件

Express 生态系统有丰富的第三方中间件，可以扩展应用程序的功能。

### 6.1 常用第三方中间件

#### 6.1.1 Morgan - HTTP 请求日志

```bash
npm install morgan
```

```javascript
const morgan = require('morgan');

// 开发环境日志格式
app.use(morgan('dev'));

// 自定义日志格式
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
```

#### 6.1.2 Helmet - 安全中间件

```bash
npm install helmet
```

```javascript
const helmet = require('helmet');

// 应用各种安全相关的 HTTP 头
app.use(helmet());
```

#### 6.1.3 CORS - 跨域资源共享

```bash
npm install cors
```

```javascript
const cors = require('cors');

// 启用所有跨域请求
app.use(cors());

// 配置 CORS
const corsOptions = {
  origin: 'http://example.com',
  optionsSuccessStatus: 200
};

app.use('/api', cors(corsOptions), apiRouter);
```

#### 6.1.4 Multer - 文件上传

```bash
npm install multer
```

```javascript
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// 单文件上传
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ file: req.file });
});

// 多文件上传
app.post('/upload-multiple', upload.array('files', 10), (req, res) => {
  res.json({ files: req.files });
});
```

#### 6.1.5 Express-Validator - 请求验证

```bash
npm install express-validator
```

```javascript
const { body, validationResult } = require('express-validator');

app.post('/user', [
  // 验证规则
  body('username').isLength({ min: 3 }),
  body('email').isEmail()
], (req, res) => {
  // 检查验证结果
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  // 处理有效的数据
  res.json({ success: true });
});
```

#### 6.1.6 Passport - 身份验证

```bash
npm install passport passport-local express-session
```

```javascript
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;

// 配置会话
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}));

// 初始化 Passport
app.use(passport.initialize());
app.use(passport.session());

// 配置本地策略
passport.use(new LocalStrategy(
  (username, password, done) => {
    // 实际应用中，这里会查询数据库验证用户
    if (username === 'admin' && password === 'password') {
      return done(null, { id: 1, username: 'admin' });
    } else {
      return done(null, false, { message: '用户名或密码错误' });
    }
  }
));

// 序列化和反序列化用户
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // 实际应用中，这里会根据 ID 查询用户
  done(null, { id: 1, username: 'admin' });
});

// 受保护的路由
app.get('/profile', isAuthenticated, (req, res) => {
  res.send('用户资料页面');
});

// 身份验证中间件
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}
```

## 7. 中间件最佳实践

### 7.1 中间件的执行顺序

中间件的执行顺序非常重要，它们按照在代码中声明的顺序执行：

```javascript
// 1. 全局日志中间件
app.use(logger);

// 2. 请求解析中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. 会话和身份验证中间件
app.use(session(...));
app.use(passport.initialize());
app.use(passport.session());

// 4. 路由
app.use('/api', apiRoutes);

// 5. 404 处理
app.use(notFoundHandler);

// 6. 错误处理（最后）
app.use(errorHandler);
```

### 7.2 模块化中间件

将中间件功能模块化，以便在多个地方重用：

**middleware/auth.js**:

```javascript
module.exports = {
  isAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: '未授权' });
  },
  isAdmin: (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'admin') {
      return next();
    }
    res.status(403).json({ message: '禁止访问' });
  }
};
```

使用模块化中间件：

```javascript
const authMiddleware = require('./middleware/auth');

app.get('/admin', authMiddleware.isAuthenticated, authMiddleware.isAdmin, (req, res) => {
  res.send('管理员页面');
});
```

### 7.3 中间件链和组合

可以通过组合多个中间件来创建复杂的处理流程：

```javascript
// 定义多个中间件
const validateRequest = require('./middleware/validate');
const logRequest = require('./middleware/logger');
const authenticate = require('./middleware/auth');

// 创建一个中间件链
const secureApi = [logRequest, authenticate, validateRequest];

// 应用中间件链
app.get('/api/secure', secureApi, (req, res) => {
  res.json({ data: '安全数据' });
});
```

### 7.4 条件中间件

可以根据条件动态应用中间件：

```javascript
app.use((req, res, next) => {
  // 根据请求路径应用不同的中间件
  if (req.path.startsWith('/api')) {
    // API 请求的特定中间件
    apiMiddleware(req, res, next);
  } else {
    // 前端请求的特定中间件
    frontendMiddleware(req, res, next);
  }
});
```

### 7.5 异步中间件

处理异步操作的中间件需要确保在操作完成后调用 `next()`：

```javascript
// 异步中间件
app.use(async (req, res, next) => {
  try {
    const data = await someAsyncOperation();
    req.customData = data;
    next();
  } catch (error) {
    next(error);
  }
});

// 使用 async/await 包装器来简化异步中间件
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.get('/async', asyncHandler(async (req, res) => {
  const result = await someAsyncOperation();
  res.json(result);
}));
```

## 8. 自定义中间件开发

### 8.1 开发一个日志中间件

```javascript
function loggerMiddleware(req, res, next) {
  const start = Date.now();
  const { method, url } = req;
  
  // 监听响应完成事件
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = res;
    console.log(`${method} ${url} ${statusCode} ${duration}ms`);
  });
  
  next();
}

app.use(loggerMiddleware);
```

### 8.2 开发一个速率限制中间件

```javascript
function rateLimiterMiddleware(options = {}) {
  const { maxRequests = 10, windowMs = 60000 } = options;
  const requests = new Map();
  
  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    
    if (!requests.has(ip)) {
      requests.set(ip, []);
    }
    
    // 获取该 IP 的请求历史
    const timestamps = requests.get(ip);
    
    // 过滤出窗口期内的请求
    const recentTimestamps = timestamps.filter(time => now - time < windowMs);
    
    // 更新请求历史
    requests.set(ip, recentTimestamps);
    
    // 检查是否超过限制
    if (recentTimestamps.length >= maxRequests) {
      return res.status(429).json({
        message: '请求过于频繁，请稍后再试',
        retryAfter: Math.ceil((windowMs - (now - recentTimestamps[0])) / 1000)
      });
    }
    
    // 添加当前请求时间戳
    recentTimestamps.push(now);
    
    next();
  };
}

// 应用速率限制中间件
app.use('/api', rateLimiterMiddleware({
  maxRequests: 5,
  windowMs: 10000 // 10秒内最多5个请求
}));
```

### 8.3 开发一个请求修改中间件

```javascript
function requestModifierMiddleware(req, res, next) {
  // 修改请求对象
  req.customProperty = 'custom value';
  
  // 修改请求头
  req.headers['x-custom-header'] = 'modified';
  
  // 修改请求处理函数
  const originalSend = res.send;
  res.send = function(body) {
    // 在发送响应前修改响应体
    if (typeof body === 'object') {
      body.timestamp = new Date().toISOString();
      body = JSON.stringify(body);
    }
    
    // 调用原始的 send 方法
    return originalSend.call(this, body);
  };
  
  next();
}

app.use(requestModifierMiddleware);
```

## 9. 中间件性能考虑

### 9.1 优化建议

- **最小化中间件数量**：只使用必要的中间件
- **避免阻塞操作**：不要在中间件中执行阻塞操作
- **使用条件中间件**：只在需要时应用特定中间件
- **缓存计算结果**：对于复杂计算，缓存结果避免重复计算
- **及时调用 next()**：确保中间件正确调用 next()，避免请求挂起

### 9.2 常见性能陷阱

- 不必要的中间件在所有请求路径上运行
- 中间件中执行昂贵的数据库查询或外部 API 调用
- 没有正确处理异步操作，导致内存泄漏
- 过于复杂的中间件逻辑

## 10. 参考资源

- [Express 中间件官方文档](https://expressjs.com/en/guide/using-middleware.html)
- [Express 中间件列表](https://expressjs.com/en/resources/middleware.html)
- [Morgan](https://github.com/expressjs/morgan)
- [Helmet](https://helmetjs.github.io/)
- [CORS](https://github.com/expressjs/cors)
- [Multer](https://github.com/expressjs/multer)
- [Express Validator](https://express-validator.github.io/docs/)
- [Passport](http://www.passportjs.org/)