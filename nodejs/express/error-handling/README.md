# Express.js 错误处理

## 1. 错误处理基础

在 Express.js 中，错误处理是构建健壮 Web 应用程序的关键部分。错误可以发生在多个层面：路由处理程序、中间件、异步操作等。有效的错误处理策略可以帮助你优雅地处理这些错误，并为用户提供有意义的反馈。

### 1.1 错误处理的重要性

- **用户体验**：适当的错误处理可以向用户展示友好的错误信息，而不是技术性的堆栈跟踪
- **调试效率**：结构化的错误处理可以帮助开发者更容易地定位和修复问题
- **应用稳定性**：良好的错误处理可以防止应用程序崩溃
- **安全性**：避免向客户端暴露敏感的错误信息
- **监控能力**：集中式的错误处理可以帮助收集和分析错误数据

### 1.2 Express 中的错误类型

- **同步错误**：直接抛出的错误，例如 `throw new Error('错误信息')`
- **异步错误**：在异步操作中发生的错误，需要通过回调、Promise 的拒绝或 async/await 的 try/catch 来捕获
- **404 错误**：请求的资源不存在
- **验证错误**：用户输入不符合验证规则
- **服务器错误**：服务器内部发生的意外错误
- **外部服务错误**：与外部服务交互时发生的错误

## 2. 基本错误处理中间件

### 2.1 错误处理中间件的定义

错误处理中间件是一个接受四个参数的中间件函数：`err`, `req`, `res`, `next`。

```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('服务器内部错误');
});
```

### 2.2 错误处理中间件的放置位置

错误处理中间件必须在所有其他路由和中间件之后定义，否则它可能无法捕获到所有错误。

```javascript
const express = require('express');
const app = express();

// 应用级中间件
app.use(express.json());

// 路由
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// 404 处理
app.use((req, res, next) => {
  next(new Error('未找到请求的资源'));
});

// 错误处理中间件（必须放在最后）
app.use((err, req, res, next) => {
  res.status(500).send('发生错误: ' + err.message);
});

app.listen(3000);
```

## 3. 同步错误处理

### 3.1 自动捕获

Express 会自动捕获路由处理程序或中间件中抛出的同步错误，并将它们传递给错误处理中间件。

```javascript
app.get('/sync-error', (req, res) => {
  throw new Error('这是一个同步错误');
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});
```

### 3.2 使用 try/catch

在复杂的同步操作中，可以使用 try/catch 来显式捕获错误，并将它们传递给 `next(err)`。

```javascript
app.get('/sync-try-catch', (req, res, next) => {
  try {
    // 一些可能抛出错误的操作
    const result = complexOperation();
    res.json(result);
  } catch (err) {
    next(err); // 将错误传递给错误处理中间件
  }
});
```

## 4. 异步错误处理

### 4.1 回调函数中的错误处理

在基于回调的异步操作中，需要手动将错误传递给 `next()`。

```javascript
const fs = require('fs');

app.get('/async-callback', (req, res, next) => {
  fs.readFile('nonexistent-file.txt', 'utf8', (err, data) => {
    if (err) {
      return next(err); // 手动传递错误
    }
    res.send(data);
  });
});
```

### 4.2 Promise 中的错误处理

对于返回 Promise 的异步操作，可以使用 `.catch()` 或 Promise 链式调用的错误处理。

```javascript
app.get('/async-promise', (req, res, next) => {
  readFilePromise('nonexistent-file.txt')
    .then(data => res.send(data))
    .catch(err => next(err)); // 将 Promise 拒绝的错误传递给中间件
});

// 模拟返回 Promise 的函数
function readFilePromise(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
}
```

### 4.3 Async/Await 中的错误处理

使用 async/await 时，可以使用 try/catch 块来捕获异步操作中的错误。

```javascript
app.get('/async-await', async (req, res, next) => {
  try {
    const data = await readFilePromise('nonexistent-file.txt');
    res.send(data);
  } catch (err) {
    next(err); // 传递捕获到的错误
  }
});
```

### 4.4 全局 Async 错误处理器

可以创建一个包装器函数来自动处理 async 路由处理程序中的错误，这样就不需要在每个路由中都编写 try/catch 块。

```javascript
// 错误处理包装器
function asyncHandler(cb) {
  return (req, res, next) => {
    Promise.resolve(cb(req, res, next)).catch(next);
  };
}

// 使用包装器
app.get('/async-wrapper', asyncHandler(async (req, res) => {
  const data = await readFilePromise('nonexistent-file.txt');
  res.send(data);
}));
```

## 5. 自定义错误类

创建自定义错误类可以帮助区分不同类型的错误，并提供更多的上下文信息。

### 5.1 基本自定义错误类

```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// 使用自定义错误
app.get('/custom-error', (req, res, next) => {
  const error = new AppError('资源不存在', 404);
  next(error);
});

// 错误处理中间件
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
});
```

### 5.2 特定类型的自定义错误

可以为不同类型的错误创建更具体的子类：

```javascript
class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

class NotFoundError extends AppError {
  constructor(message = '资源不存在') {
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

// 使用特定错误类型
app.get('/specific-error', (req, res, next) => {
  next(new NotFoundError('用户不存在'));
});
```

## 6. 错误处理最佳实践

### 6.1 环境感知的错误响应

根据环境提供不同详细程度的错误信息：

```javascript
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  
  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else if (process.env.NODE_ENV === 'production') {
    // 对于生产环境，不向客户端暴露敏感信息
    if (err.isOperational) {
      // 可操作的错误（我们创建的自定义错误）
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    } else {
      // 意外错误
      console.error('ERROR 💥', err);
      res.status(500).json({
        status: 'error',
        message: '服务器内部错误，请稍后再试'
      });
    }
  }
});
```

### 6.2 404 错误处理

创建一个中间件来捕获所有未匹配的路由请求：

```javascript
// 放在所有路由之后
app.all('*', (req, res, next) => {
  next(new NotFoundError(`无法找到 ${req.originalUrl} 在这个服务器上`));
});
```

### 6.3 数据库错误处理

为数据库错误创建专门的处理逻辑：

```javascript
const handleCastErrorDB = (err) => {
  const message = `无效的 ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/\"([^\"]*)\"/)[1];
  const message = `重复字段值: ${value}. 请使用不同的值`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `验证失败: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// 在错误处理中间件中使用
app.use((err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  
  if (error.name === 'CastError') error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
  
  // 其余错误处理逻辑...
});
```

### 6.4 集成日志系统

使用专业的日志库如 Winston 或 Bunyan 记录错误：

```javascript
const winston = require('winston');

// 创建日志记录器
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    // 错误日志文件
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // 所有日志文件
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// 错误处理中间件
app.use((err, req, res, next) => {
  // 记录错误
  logger.error(err.message, {
    error: err,
    stack: err.stack,
    request: {
      method: req.method,
      url: req.originalUrl,
      headers: req.headers,
      body: req.body
    }
  });
  
  // 其余错误处理逻辑...
});
```

### 6.5 错误监控集成

可以将错误处理与监控服务集成，如 Sentry：

```javascript
const Sentry = require('@sentry/node');
const express = require('express');
const app = express();

// 初始化 Sentry
Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
});

// Sentry 中间件
app.use(Sentry.Handlers.requestHandler());

// 路由和其他中间件

// Sentry 错误处理中间件
app.use(Sentry.Handlers.errorHandler());

// 自定义错误处理中间件
app.use((err, req, res, next) => {
  // 自定义错误处理逻辑
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message
  });
});
```

## 7. 完整的错误处理实现

下面是一个综合了上述所有概念的完整错误处理实现：

### 7.1 创建错误类模块

`utils/errors.js`:

```javascript
// 基本应用错误类
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// 特定错误类型
class BadRequestError extends AppError {
  constructor(message = '请求参数错误') {
    super(message, 400);
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

class NotFoundError extends AppError {
  constructor(message = '资源不存在') {
    super(message, 404);
  }
}

class InternalServerError extends AppError {
  constructor(message = '服务器内部错误') {
    super(message, 500);
  }
}

module.exports = {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  InternalServerError
};
```

### 7.2 创建错误处理器模块

`utils/errorHandler.js`:

```javascript
const { AppError } = require('./errors');
const winston = require('winston');

// 配置日志记录器
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// 数据库错误处理器
const handleCastErrorDB = (err) => {
  const message = `无效的 ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/\"([^\"]*)\"/)[1];
  const message = `重复字段值: ${value}. 请使用不同的值`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `验证失败: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// 错误处理中间件
const errorHandler = (err, req, res, next) => {
  // 记录错误
  logger.error(err.message, {
    error: err,
    stack: err.stack,
    request: {
      method: req.method,
      url: req.originalUrl,
      headers: req.headers,
      body: req.body
    }
  });

  let error = { ...err };
  error.message = err.message;

  // 数据库错误处理
  if (error.name === 'CastError') error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === 'ValidationError') error = handleValidationErrorDB(error);

  // 根据环境提供不同的响应
  if (process.env.NODE_ENV === 'development') {
    return res.status(error.statusCode || 500).json({
      status: error.status || 'error',
      error: error,
      message: error.message,
      stack: error.stack
    });
  }

  // 生产环境
  if (error.isOperational) {
    return res.status(error.statusCode || 500).json({
      status: error.status || 'error',
      message: error.message
    });
  }

  // 未预期的错误
  return res.status(500).json({
    status: 'error',
    message: '服务器内部错误，请稍后再试'
  });
};

module.exports = errorHandler;
```

### 7.3 创建 Async 错误处理包装器

`utils/asyncHandler.js`:

```javascript
const asyncHandler = fn => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = asyncHandler;
```

### 7.4 在主应用中使用

`app.js`:

```javascript
const express = require('express');
const dotenv = require('dotenv');
const errorHandler = require('./utils/errorHandler');
const { NotFoundError } = require('./utils/errors');
const asyncHandler = require('./utils/asyncHandler');
const fs = require('fs').promises;

// 加载环境变量
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(express.json());

// 示例路由
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// 同步错误示例
app.get('/sync-error', (req, res) => {
  throw new Error('这是一个同步错误');
});

// Async/await 错误示例
app.get('/async-error', asyncHandler(async (req, res) => {
  const data = await fs.readFile('nonexistent-file.txt', 'utf8');
  res.send(data);
}));

// 自定义错误示例
app.get('/not-found', (req, res, next) => {
  next(new NotFoundError('自定义 404 错误'));
});

// 404 处理
app.all('*', (req, res, next) => {
  next(new NotFoundError(`无法找到 ${req.originalUrl} 在这个服务器上`));
});

// 错误处理中间件
app.use(errorHandler);

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});
```

## 8. 验证错误处理

### 8.1 与 express-validator 集成

```javascript
const { body, validationResult } = require('express-validator');
const { BadRequestError } = require('./utils/errors');

app.post('/register', [
  body('username').isLength({ min: 3 }).withMessage('用户名至少3个字符'),
  body('email').isEmail().withMessage('必须是有效的电子邮件'),
  body('password').isLength({ min: 6 }).withMessage('密码至少6个字符')
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg).join(', ');
    return next(new BadRequestError(errorMessages));
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
```

## 9. 参考资源

- [Express 错误处理官方文档](https://expressjs.com/en/guide/error-handling.html)
- [Winston 日志库](https://github.com/winstonjs/winston)
- [Sentry 错误监控](https://sentry.io/for/node/)
- [Express Validator](https://express-validator.github.io/docs/)
- [Node.js Error 类](https://nodejs.org/api/errors.html)