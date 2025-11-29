# Node.js Web 框架详解

## Web 框架概述

Node.js Web 框架是用于构建 Web 应用和 API 的工具集，它们提供了路由、中间件、请求处理、响应生成等功能，大大简化了服务器端应用的开发流程。选择合适的 Web 框架对项目的开发效率和可维护性至关重要。

## Express.js

Express 是 Node.js 生态系统中最流行的 Web 框架，它提供了简洁而灵活的 API，使构建 Web 应用和 API 变得简单。

### 安装与基本使用

```javascript
// 安装 Express
// npm install express

const express = require('express');
const app = express();
const PORT = 3000;

// 基本路由
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
```

### 路由

路由决定了应用如何响应客户端对特定端点的请求。

```javascript
// 基本路由方法
app.get('/', (req, res) => {
  res.send('GET 请求');
});

app.post('/', (req, res) => {
  res.send('POST 请求');
});

app.put('/', (req, res) => {
  res.send('PUT 请求');
});

app.delete('/', (req, res) => {
  res.send('DELETE 请求');
});

// 路径参数
app.get('/users/:userId', (req, res) => {
  res.send(`用户 ID: ${req.params.userId}`);
});

// 多个路径参数
app.get('/users/:userId/posts/:postId', (req, res) => {
  res.send(`用户 ID: ${req.params.userId}, 文章 ID: ${req.params.postId}`);
});

// 可选参数（使用正则表达式）
app.get('/users/:userId?', (req, res) => {
  if (req.params.userId) {
    res.send(`用户 ID: ${req.params.userId}`);
  } else {
    res.send('所有用户');
  }
});

// 查询参数
app.get('/search', (req, res) => {
  const query = req.query;
  res.json({
    message: '搜索结果',
    query
  });
});

// 链式路由
app.route('/book')
  .get((req, res) => res.send('获取所有书籍'))
  .post((req, res) => res.send('添加新书籍'))
  .put((req, res) => res.send('更新所有书籍'));
```

### 路由模块化

对于大型应用，将路由组织成模块是一种良好的实践。

```javascript
// routes/users.js
const express = require('express');
const router = express.Router();

// 中间件，仅应用于此路由器
router.use((req, res, next) => {
  console.log('Time:', Date.now());
  next();
});

// 定义路由
router.get('/', (req, res) => {
  res.send('获取所有用户');
});

router.post('/', (req, res) => {
  res.send('创建新用户');
});

router.get('/:id', (req, res) => {
  res.send(`获取用户 ${req.params.id}`);
});

module.exports = router;

// 在主应用中使用
const usersRouter = require('./routes/users');
app.use('/users', usersRouter);
```

### 中间件

中间件函数可以访问请求对象 (req)、响应对象 (res) 以及应用程序的请求-响应周期中的下一个中间件函数。

#### 应用级中间件

```javascript
// 没有挂载路径的中间件，应用的每个请求都会执行
app.use((req, res, next) => {
  console.log('Time:', Date.now());
  next();
});

// 挂载到 /user/:id 路径的中间件
app.use('/user/:id', (req, res, next) => {
  console.log('Request Type:', req.method);
  next();
});

// 多个中间件函数
app.use('/user/:id', (req, res, next) => {
  console.log('Middleware 1');
  next();
}, (req, res, next) => {
  console.log('Middleware 2');
  next();
});

// 中间件栈
const middleware1 = (req, res, next) => {
  console.log('Middleware 1');
  next();
};

const middleware2 = (req, res, next) => {
  console.log('Middleware 2');
  next();
};

app.use([middleware1, middleware2]);
```

#### 路由级中间件

路由级中间件与应用级中间件的工作方式相同，只不过它绑定到 `express.Router()` 实例。

```javascript
const router = express.Router();

router.use((req, res, next) => {
  console.log('Time:', Date.now());
  next();
});

router.get('/', (req, res) => {
  res.send('路由器主页');
});

app.use('/router', router);
```

#### 错误处理中间件

错误处理中间件始终接受四个参数：(err, req, res, next)。

```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// 异步错误处理
app.get('/async-error', async (req, res, next) => {
  try {
    // 异步操作
    await someAsyncFunction();
  } catch (err) {
    next(err); // 传递给错误处理中间件
  }
});
```

#### 内置中间件

```javascript
// express.static 提供静态文件
app.use(express.static('public'));

// 解析 JSON 数据
app.use(express.json());

// 解析 URL 编码的表单数据
app.use(express.urlencoded({ extended: true }));
```

#### 第三方中间件

```javascript
// 安装：npm install cors helmet morgan cookie-parser

const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

// 使用第三方中间件
app.use(cors()); // 处理跨域请求
app.use(helmet()); // 安全相关的 HTTP 头
app.use(morgan('dev')); // HTTP 请求日志
app.use(cookieParser()); // 解析 Cookie
```

### 请求和响应对象

#### 请求对象 (req)

```javascript
// 请求属性
app.get('/request-info', (req, res) => {
  const requestInfo = {
    url: req.url,
    method: req.method,
    headers: req.headers,
    query: req.query,
    params: req.params,
    cookies: req.cookies,
    body: req.body,
    ip: req.ip,
    protocol: req.protocol,
    path: req.path,
    hostname: req.hostname,
    secure: req.secure,
    xhr: req.xhr // 是否是 AJAX 请求
  };
  res.json(requestInfo);
});
```

#### 响应对象 (res)

```javascript
// 响应方法
app.get('/response-methods', (req, res) => {
  // 发送文本响应
  res.send('Hello World');
  
  // 发送 JSON 响应
  res.json({ message: 'Hello World' });
  
  // 发送文件
  res.sendFile(__dirname + '/index.html');
  
  // 发送状态码
  res.status(201).send('Created');
  
  // 设置响应头
  res.set('Content-Type', 'text/plain');
  
  // 重定向
  res.redirect('/');
  
  // 设置 Cookie
  res.cookie('name', 'value', { maxAge: 900000, httpOnly: true });
  
  // 清除 Cookie
  res.clearCookie('name');
  
  // 渲染视图模板
  res.render('index', { title: 'Express' });
});
```

### 模板引擎

Express 支持各种模板引擎，如 Pug、EJS、Handlebars 等。

```javascript
// 设置 EJS 模板引擎
app.set('view engine', 'ejs');
app.set('views', './views'); // 设置视图目录

// 创建视图文件 views/index.ejs
/*
<!DOCTYPE html>
<html>
<head>
  <title><%= title %></title>
</head>
<body>
  <h1><%= message %></h1>
</body>
</html>
*/

// 渲染视图
app.get('/', (req, res) => {
  res.render('index', { title: 'Express', message: 'Hello World!' });
});
```

### 认证与授权

使用 JSON Web Tokens (JWT) 进行认证。

```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// 模拟用户数据库
const users = [];

// 注册路由
app.post('/register', async (req, res) => {
  try {
    // 哈希密码
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
    // 创建新用户
    const user = {
      id: Date.now().toString(),
      username: req.body.username,
      password: hashedPassword
    };
    
    users.push(user);
    res.status(201).send('用户注册成功');
  } catch (err) {
    res.status(500).send('服务器错误');
  }
});

// 登录路由
app.post('/login', async (req, res) => {
  // 查找用户
  const user = users.find(u => u.username === req.body.username);
  if (!user) return res.status(400).send('用户名或密码错误');
  
  try {
    // 验证密码
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('用户名或密码错误');
    
    // 创建令牌
    const token = jwt.sign({ id: user.id }, 'your_secret_key', { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).send('服务器错误');
  }
});

// 认证中间件
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).send('访问被拒绝');
  
  try {
    const verified = jwt.verify(token, 'your_secret_key');
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('无效的令牌');
  }
}

// 受保护的路由
app.get('/protected', authenticateToken, (req, res) => {
  res.send('这是受保护的资源');
});
```

## Koa.js

Koa 是由 Express 原班人马打造的新一代 Web 框架，它更加简洁、轻量，使用了 ES6 的 `async/await` 语法来处理异步操作，消除了回调地狱。

### 安装与基本使用

```javascript
// 安装 Koa
// npm install koa

const Koa = require('koa');
const app = new Koa();
const PORT = 3000;

// 中间件
app.use(async (ctx) => {
  ctx.body = 'Hello World!';
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
```

### 中间件

Koa 的中间件以洋葱模型执行，每个中间件都有两个阶段：请求阶段（洋葱左侧进入）和响应阶段（洋葱右侧退出）。

```javascript
// 中间件洋葱模型示例
app.use(async (ctx, next) => {
  console.log('1');
  await next();
  console.log('1结束');
});

app.use(async (ctx, next) => {
  console.log('2');
  await next();
  console.log('2结束');
});

app.use(async (ctx) => {
  console.log('3');
  ctx.body = 'Hello World!';
  console.log('3结束');
});

// 输出顺序:
// 1
// 2
// 3
// 3结束
// 2结束
// 1结束
```

### 路由

Koa 本身不包含路由功能，通常使用 `@koa/router` 模块。

```javascript
// 安装：npm install @koa/router

const Router = require('@koa/router');
const router = new Router();

// 定义路由
router.get('/', (ctx) => {
  ctx.body = '主页';
});

router.get('/users/:id', (ctx) => {
  ctx.body = `用户 ID: ${ctx.params.id}`;
});

router.post('/users', (ctx) => {
  ctx.body = '创建用户';
});

// 应用路由
app.use(router.routes());
app.use(router.allowedMethods()); // 处理不支持的 HTTP 方法
```

### 请求与响应

```javascript
// 请求处理
app.use(async (ctx) => {
  // 请求属性
  const { method, url, header, query, params, ip } = ctx;
  
  // 获取请求体（需要 bodyParser 中间件）
  const body = ctx.request.body;
  
  // 响应方法
  ctx.status = 200;
  ctx.set('Content-Type', 'application/json');
  ctx.body = { message: 'Hello World' };
  
  // 重定向
  // ctx.redirect('/new-url');
  
  // 设置 Cookie
  // ctx.cookies.set('name', 'value', { httpOnly: true });
  
  // 获取 Cookie
  // const name = ctx.cookies.get('name');
});

// 解析请求体
const bodyParser = require('koa-bodyparser');
app.use(bodyParser());
```

### 错误处理

```javascript
// 错误处理中间件
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = { message: err.message || '服务器错误' };
    console.error(err);
  }
});

// 404 处理
app.use(async (ctx) => {
  ctx.status = 404;
  ctx.body = { message: '页面不存在' };
});
```

## NestJS

NestJS 是一个功能丰富的框架，受到 Angular 的启发，提供了模块化、依赖注入、装饰器等特性，适合构建企业级应用。

### 安装与基本使用

```javascript
// 安装 NestJS CLI
// npm install -g @nestjs/cli

// 创建新应用
// nest new my-app

// 基本控制器示例 (cats.controller.ts)
import { Controller, Get } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(): string {
    return '获取所有猫';
  }
}

// 基本模块示例 (app.module.ts)
import { Module } from '@nestjs/common';
import { CatsController } from './cats/cats.controller';

@Module({
  controllers: [CatsController],
})
export class AppModule {}n
// 主应用入口 (main.ts)
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

### 控制器

控制器负责处理传入的请求并返回响应。

```typescript
import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  findAll(@Query() query): string {
    return `查询参数: ${JSON.stringify(query)}`;
  }
  
  @Get(':id')
  findOne(@Param('id') id): string {
    return `用户 ID: ${id}`;
  }
  
  @Post()
  create(@Body() createUserDto): string {
    return `创建用户: ${JSON.stringify(createUserDto)}`;
  }
  
  @Put(':id')
  update(@Param('id') id, @Body() updateUserDto): string {
    return `更新用户 ${id}: ${JSON.stringify(updateUserDto)}`;
  }
  
  @Delete(':id')
  remove(@Param('id') id): string {
    return `删除用户 ${id}`;
  }
}
```

### 提供者（Providers）

提供者是 NestJS 的基本概念，可被注入到控制器中。

```typescript
// 服务提供者 (users.service.ts)
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly users = [];
  
  findAll() {
    return this.users;
  }
  
  findOne(id: string) {
    return this.users.find(user => user.id === id);
  }
  
  create(user) {
    this.users.push(user);
    return user;
  }
  
  update(id: string, user) {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...user };
      return this.users[index];
    }
    return null;
  }
  
  remove(id: string) {
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
      return this.users.splice(index, 1);
    }
    return null;
  }
}

// 在控制器中使用服务
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  
  // 其他方法...
}
```

### 模块

模块是 NestJS 应用的基本组织单位，用于组织代码结构。

```typescript
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService] // 导出服务，使其可在其他模块中使用
})
export class UsersModule {}

// 主模块 (app.module.ts)
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule],
})
export class AppModule {}
```

### 中间件

```typescript
// 自定义中间件 (logger.middleware.ts)
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`Request... ${req.method} ${req.url}`);
    next();
  }
}

// 应用中间件 (app.module.ts)
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './logger.middleware';

@Module({})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('users'); // 只应用于 users 路由
  }
}
```

### 拦截器

拦截器可以在请求处理前后执行操作。

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');
    const now = Date.now();
    
    return next
      .handle()
      .pipe(
        tap(() => console.log(`After... ${Date.now() - now}ms`)),
      );
  }
}

// 全局应用拦截器 (main.ts)
import { APP_INTERCEPTOR } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new LoggingInterceptor());
  await app.listen(3000);
}
```

## Fastify

Fastify 是一个高度专注于以最少开销和强大的插件架构提供最佳开发体验的 Web 框架，性能极其出色。

### 安装与基本使用

```javascript
// 安装 Fastify
// npm install fastify

const fastify = require('fastify')({ logger: true });
const PORT = 3000;

// 定义路由
fastify.get('/', async (request, reply) => {
  return { hello: 'world' };
});

// 启动服务器
const start = async () => {
  try {
    await fastify.listen({ port: PORT });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
```

### 路由

```javascript
// 基本路由
fastify.get('/route', async (request, reply) => {
  return { message: 'GET 路由' };
});

fastify.post('/route', async (request, reply) => {
  return { message: 'POST 路由' };
});

fastify.put('/route', async (request, reply) => {
  return { message: 'PUT 路由' };
});

fastify.delete('/route', async (request, reply) => {
  return { message: 'DELETE 路由' };
});

// 参数路由
fastify.get('/users/:id', async (request, reply) => {
  return { userId: request.params.id };
});

// 查询参数
fastify.get('/search', async (request, reply) => {
  return { query: request.query };
});

// 请求体
fastify.post('/data', async (request, reply) => {
  return { data: request.body };
});
```

### 钩子函数

Fastify 提供了丰富的生命周期钩子。

```javascript
// 请求钩子
fastify.addHook('onRequest', async (request, reply) => {
  console.log('请求开始');
});

fastify.addHook('preParsing', async (request, reply) => {
  console.log('解析请求前');
});

fastify.addHook('preValidation', async (request, reply) => {
  console.log('验证请求前');
});

fastify.addHook('preHandler', async (request, reply) => {
  console.log('处理请求前');
});

fastify.addHook('preSerialization', async (request, reply, payload) => {
  console.log('序列化响应前');
  return payload; // 可以修改返回的数据
});

fastify.addHook('onSend', async (request, reply, payload) => {
  console.log('发送响应前');
  return payload; // 可以修改响应内容
});

fastify.addHook('onResponse', async (request, reply) => {
  console.log('响应完成');
});
```

### 模式验证

Fastify 支持使用 JSON Schema 验证请求和响应。

```javascript
const schema = {
  body: {
    type: 'object',
    required: ['name', 'age'],
    properties: {
      name: { type: 'string' },
      age: { type: 'integer', minimum: 18 }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        age: { type: 'integer' }
      }
    }
  }
};

fastify.post('/user', { schema }, async (request, reply) => {
  const { name, age } = request.body;
  return { id: '1', name, age };
});
```

## 框架对比

| 特性 | Express | Koa | NestJS | Fastify |
|------|---------|-----|--------|---------|
| 设计理念 | 灵活、中间件驱动 | 简洁、轻量、异步优先 | 企业级、模块化、TypeScript | 高性能、低开销、插件架构 |
| 上手难度 | 低 | 中 | 高 | 中 |
| 性能 | 一般 | 良好 | 良好 | 优秀 |
| 内置功能 | 丰富 | 最小化 | 丰富 | 中等 |
| TypeScript 支持 | 良好 | 良好 | 原生 | 良好 |
| 社区活跃度 | 极高 | 高 | 高 | 高 |
| 适用场景 | 中小型应用、API | 需要精确控制的应用 | 企业级应用、微服务 | 高性能 API、实时应用 |

## 常见问题与答案

### 1. 选择合适的 Web 框架需要考虑哪些因素？
**答案：** 
- **项目规模**：小型项目可以使用 Express 或 Koa，大型企业项目可以考虑 NestJS
- **性能要求**：对性能要求极高的应用可以选择 Fastify
- **开发团队熟悉度**：选择团队已经熟悉的框架可以提高开发效率
- **生态系统**：考虑框架的插件、中间件和社区支持
- **学习曲线**：根据团队的学习能力和时间选择合适的框架
- **维护状态**：选择活跃维护的框架，确保安全性和功能更新

### 2. 如何提高 Express 应用的性能？
**答案：** 
- **使用压缩中间件**：如 `compression` 中间件减少响应大小
- **使用缓存**：缓存静态资源和频繁请求的数据
- **优化数据库查询**：使用索引、连接池等
- **使用 `express.static` 的最佳实践**：设置缓存控制头，考虑使用 CDN
- **限制请求体大小**：使用 `express.json({ limit: '1mb' })` 防止大文件攻击
- **避免阻塞操作**：将 CPU 密集型任务移到后台进程
- **使用集群模式**：利用 Node.js 的 `cluster` 模块充分利用多核 CPU
- **使用合适的日志级别**：生产环境避免使用 `morgan('dev')`，改用更轻量的格式

### 3. 中间件和钩子函数有什么区别？
**答案：** 
- **中间件**：主要在 Express 和 Koa 中使用，用于处理 HTTP 请求和响应，通常在路由处理之前或之后执行
- **钩子函数**：在 NestJS 和 Fastify 中使用，提供更细粒度的控制点，覆盖应用程序的整个生命周期
- **执行顺序**：中间件在 Express 中按注册顺序执行，在 Koa 中按洋葱模型执行；钩子函数在定义的生命周期阶段执行
- **使用场景**：中间件更适合横切关注点如日志记录、认证等；钩子函数可以在更具体的时间点执行操作，如序列化前、响应发送后等

### 4. 如何处理异步错误？
**答案：** 
- **Express**：使用 try-catch 包装异步代码，或使用中间件自动捕获 Promise 拒绝
  ```javascript
  // 自动捕获 Promise 拒绝的中间件
  function asyncErrorHandler(fn) {
    return function(req, res, next) {
      fn(req, res, next).catch(next);
    };
  }
  
  app.get('/async', asyncErrorHandler(async (req, res) => {
    // 异步操作
  }));
  ```
- **Koa**：try-catch 包装异步代码，或使用全局错误处理中间件
- **NestJS**：使用异常过滤器处理异常
  ```typescript
  // 全局异常过滤器
  import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
  
  @Catch(HttpException)
  export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const status = exception.getStatus();
      
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: ctx.getRequest().url,
      });
    }
  }
  ```
- **Fastify**：使用错误处理钩子
  ```javascript
  fastify.setErrorHandler(function (error, request, reply) {
    reply.status(500).send({ error: error.message });
  });
  ```

### 5. 如何实现 API 文档？
**答案：** 
- **Swagger/OpenAPI**：
  - Express/Koa：使用 `swagger-jsdoc` 和 `swagger-ui-express`
  - NestJS：内置支持，使用 `@nestjs/swagger`
  - Fastify：使用 `fastify-swagger`
- **示例 (Express)**：
  ```javascript
  const swaggerJsDoc = require('swagger-jsdoc');
  const swaggerUi = require('swagger-ui-express');
  
  const swaggerOptions = {
    swaggerDefinition: {
      info: {
        title: 'API 文档',
        version: '1.0.0'
      }
    },
    apis: ['./routes/*.js']
  };
  
  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  ```

### 6. 如何处理 CORS（跨域资源共享）？
**答案：** 
- **Express/Koa**：使用 `cors` 中间件
  ```javascript
  // Express
  const cors = require('cors');
  app.use(cors()); // 允许所有来源
  
  // 或配置特定来源
  app.use(cors({
    origin: 'https://example.com',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  ```
- **NestJS**：使用 `@nestjs/common` 中的 `CorsModule`
  ```typescript
  // main.ts
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
      origin: 'https://example.com',
      methods: ['GET', 'POST']
    });
    await app.listen(3000);
  }
  ```
- **Fastify**：使用 `fastify-cors` 插件
  ```javascript
  const cors = require('@fastify/cors');
  fastify.register(cors, {
    origin: 'https://example.com'
  });
  ```

### 7. 如何实现认证？
**答案：** 
- **JWT (JSON Web Tokens)**：
  - 登录时生成令牌
  - 保护路由，要求提供有效的令牌
  - 使用中间件验证令牌
- **会话认证**：
  - 使用 `express-session` 或类似库
  - 登录时创建会话
  - 后续请求通过会话 ID 识别用户
- **OAuth/OAuth2**：用于第三方登录，如 Google、GitHub 等
- **实现示例 (JWT with Express)**：
  ```javascript
  // 生成令牌
  const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: '1h' });
  
  // 验证令牌的中间件
  function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).send('未授权');
    
    jwt.verify(token, 'secret', (err, user) => {
      if (err) return res.status(403).send('无效的令牌');
      req.user = user;
      next();
    });
  }
  
  // 保护路由
  app.get('/protected', authenticateToken, (req, res) => {
    res.send('受保护的内容');
  });
  ```

### 8. 如何进行请求验证？
**答案：** 
- **使用验证库**：
  - Express：`express-validator`
  - Koa：`koa-validator`
  - NestJS：`class-validator`
  - Fastify：内置 JSON Schema 验证
- **Express 验证示例**：
  ```javascript
  const { body, validationResult } = require('express-validator');
  
  app.post('/user', 
    // 验证规则
    body('name').isLength({ min: 3 }).trim().escape(),
    body('email').isEmail().normalizeEmail(),
    body('age').isNumeric().isInt({ min: 18 }),
    
    (req, res) => {
      // 检查验证结果
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      // 处理有效数据
      res.send('用户创建成功');
    }
  );
  ```
- **Fastify 验证示例**：
  ```javascript
  fastify.post('/user', {
    schema: {
      body: {
        type: 'object',
        required: ['name', 'email'],
        properties: {
          name: { type: 'string', minLength: 3 },
          email: { type: 'string', format: 'email' },
          age: { type: 'integer', minimum: 18 }
        }
      }
    }
  }, async (request, reply) => {
    // 请求体已验证
    return { success: true };
  });
  ```

### 9. 如何实现文件上传？
**答案：** 
- **Express**：使用 `multer` 中间件
  ```javascript
  const multer = require('multer');
  
  // 配置存储
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
  });
  
  const upload = multer({ storage: storage });
  
  // 单文件上传
  app.post('/upload/single', upload.single('file'), (req, res) => {
    res.send({ file: req.file });
  });
  
  // 多文件上传
  app.post('/upload/multiple', upload.array('files', 10), (req, res) => {
    res.send({ files: req.files });
  });
  ```
- **NestJS**：使用 `@nestjs/platform-express` 中的 `FileInterceptor`
  ```typescript
  import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  
  @Controller('upload')
  export class UploadController {
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file) {
      console.log(file);
      return { file };
    }
  }
  ```
- **Fastify**：使用 `fastify-multipart` 插件
  ```javascript
  const fastify = require('fastify')({ logger: true });
  const fs = require('fs');
  
  fastify.register(require('@fastify/multipart'));
  
  fastify.post('/upload', async function (req, reply) {
    const data = await req.file();
    
    // 保存文件
    const writeStream = fs.createWriteStream(`./uploads/${data.filename}`);
    await pipeline(data.file, writeStream);
    
    return { success: true };
  });
  ```

### 10. 如何实现 WebSocket 实时通信？
**答案：** 
- **Socket.io**：
  ```javascript
  // Express + Socket.io
  const express = require('express');
  const http = require('http');
  const { Server } = require('socket.io');
  
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server);
  
  io.on('connection', (socket) => {
    console.log('用户已连接');
    
    // 监听消息事件
    socket.on('chat message', (msg) => {
      console.log('消息:', msg);
      // 广播消息给所有客户端
      io.emit('chat message', msg);
    });
    
    // 断开连接
    socket.on('disconnect', () => {
      console.log('用户已断开连接');
    });
  });
  
  server.listen(3000, () => {
    console.log('监听端口 3000');
  });
  ```
- **NestJS**：使用 `@nestjs/websockets`
  ```typescript
  import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  
  @WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  
  handleConnection(client: Socket) {
    console.log('客户端连接:', client.id);
  }
  
  handleDisconnect(client: Socket) {
    console.log('客户端断开:', client.id);
  }
  
  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: string): void {
    this.server.emit('message', payload);
  }
}
```
- **Fastify**：使用 `fastify-socket.io`
  ```javascript
  const fastify = require('fastify')({ logger: true });
  
  fastify.register(require('fastify-socket.io'));
  
  fastify.ready().then(() => {
    fastify.io.on('connection', (socket) => {
      console.log('客户端连接');
      
      socket.on('message', (data) => {
        console.log('收到消息:', data);
        fastify.io.emit('message', data);
      });
    });
  });
  
  fastify.listen({ port: 3000 });
  ```