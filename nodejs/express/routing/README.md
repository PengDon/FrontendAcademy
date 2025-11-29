# Express.js 路由

## 1. 路由基础概念

路由是指如何定义应用程序的端点（URI）并响应客户端请求的方式。在 Express.js 中，路由是应用程序的核心部分，用于处理不同的 HTTP 请求，并将其映射到相应的处理函数。

### 1.1 路由的组成

Express 中的路由由三个部分组成：

1. **HTTP 方法**：如 GET、POST、PUT、DELETE 等
2. **路径模式**：URL 的路径部分，如 `/users`、`/products/:id`
3. **处理函数**：当路由匹配时执行的函数

基本路由语法：

```javascript
app.METHOD(PATH, HANDLER);
```

其中：
- `app` 是 Express 实例
- `METHOD` 是 HTTP 请求方法（如 GET、POST）
- `PATH` 是服务器上的路径
- `HANDLER` 是当路由匹配时执行的函数

## 2. 基本路由

### 2.1 HTTP 方法路由

Express 支持所有 HTTP 方法，下面是最常用的几种：

```javascript
const express = require('express');
const app = express();

// GET 请求路由
app.get('/', (req, res) => {
  res.send('GET 请求成功');
});

// POST 请求路由
app.post('/', (req, res) => {
  res.send('POST 请求成功');
});

// PUT 请求路由
app.put('/resource/:id', (req, res) => {
  res.send(`更新资源 ${req.params.id}`);
});

// DELETE 请求路由
app.delete('/resource/:id', (req, res) => {
  res.send(`删除资源 ${req.params.id}`);
});

// PATCH 请求路由
app.patch('/resource/:id', (req, res) => {
  res.send(`部分更新资源 ${req.params.id}`);
});

// OPTIONS 请求路由
app.options('/resource', (req, res) => {
  res.send('允许的 HTTP 方法');
});

// HEAD 请求路由
app.head('/resource', (req, res) => {
  res.end(); // HEAD 只返回头信息，不返回响应体
});
```

### 2.2 处理所有 HTTP 方法

使用 `app.all()` 方法可以处理匹配路径的所有 HTTP 方法：

```javascript
app.all('/secret', (req, res, next) => {
  console.log('访问了秘密页面');
  next(); // 继续处理请求
});

app.all('/api/*', (req, res, next) => {
  console.log('API 请求');
  next(); // 传递给下一个处理程序
});
```

## 3. 路由路径

路由路径定义了请求 URL 的模式，可以是字符串、字符串模式或正则表达式。

### 3.1 字符串路径

最基本的路由路径是精确匹配的字符串：

```javascript
app.get('/about', (req, res) => {
  res.send('关于页面');
});

app.get('/users/profile', (req, res) => {
  res.send('用户资料');
});
```

### 3.2 字符串模式路径

Express 支持基于字符串模式的路由路径，使用一些特殊字符来实现更灵活的匹配：

```javascript
// 匹配 /acd 和 /abcd
app.get('/ab?cd', (req, res) => {
  res.send('ab?cd');
});

// 匹配 /abcd, /abbcd, /abbbcd 等
app.get('/ab+cd', (req, res) => {
  res.send('ab+cd');
});

// 匹配 /abcd, /abxcd, /abRANDOMcd, /ab123cd 等
app.get('/ab*cd', (req, res) => {
  res.send('ab*cd');
});

// 匹配 /abe 和 /abcde
app.get('/ab(cd)?e', (req, res) => {
  res.send('ab(cd)?e');
});
```

### 3.3 正则表达式路径

对于更复杂的匹配模式，可以使用正则表达式：

```javascript
// 匹配任何路径中包含 a 的请求
app.get(/a/, (req, res) => {
  res.send('/a/');
});

// 匹配 butterfly 和 dragonfly，不匹配 butterflyman, dragonfly man 等
app.get(/.*fly$/, (req, res) => {
  res.send('/.*fly$/');
});

// 匹配以数字开头的路径
app.get(/^\d+/, (req, res) => {
  res.send('以数字开头的路径');
});
```

## 4. 路由参数

路由参数用于捕获 URL 中的动态值，这些参数在路由处理程序中可以通过 `req.params` 对象访问。

### 4.1 基本路由参数

```javascript
app.get('/users/:userId/books/:bookId', (req, res) => {
  res.send(req.params);
});

// 对于 GET /users/34/books/8989 请求，响应将是：
// { "userId": "34", "bookId": "8989" }
```

### 4.2 路由参数命名规则

路由参数名必须由 "word characters" ([A-Za-z0-9_]) 组成。

### 4.3 正则表达式约束路由参数

可以使用正则表达式来约束路由参数的格式：

```javascript
// 只匹配 userId 是数字的情况
app.get('/user/:userId(\d+)', (req, res) => {
  res.send(`用户 ID: ${req.params.userId}`);
});

// 对于 GET /user/123 请求，将匹配并响应
// 对于 GET /user/abc 请求，将不会匹配
```

### 4.4 可选路由参数

使用 ? 可以将路由参数设置为可选：

```javascript
// userId 是可选的
app.get('/users/:userId?', (req, res) => {
  res.send(req.params.userId || '所有用户');
});

// 对于 GET /users/ 将响应 "所有用户"
// 对于 GET /users/123 将响应 "123"
```

## 5. 查询字符串参数

除了路由参数外，Express 还可以通过 `req.query` 对象访问查询字符串参数：

```javascript
app.get('/search', (req, res) => {
  res.send(req.query);
});

// 对于 GET /search?q=express&sort=desc 请求，响应将是：
// { "q": "express", "sort": "desc" }
```

## 6. 路由处理函数

### 6.1 单处理函数

最简单的形式是使用单个回调函数处理路由：

```javascript
app.get('/example/a', (req, res) => {
  res.send('单处理函数');
});
```

### 6.2 多个处理函数

可以为路由指定多个回调函数，它们会按顺序执行：

```javascript
app.get('/example/b', (req, res, next) => {
  console.log('第一个处理函数');
  next(); // 调用下一个处理函数
}, (req, res) => {
  res.send('第二个处理函数');
});
```

### 6.3 处理函数数组

可以使用处理函数数组来组织路由处理逻辑：

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

### 6.4 混合使用函数和数组

可以混合使用函数和函数数组：

```javascript
app.get('/example/d', [cb0, cb1], (req, res, next) => {
  console.log('处理函数 D');
  next();
}, (req, res) => {
  res.send('Hello from D!');
});
```

## 7. 响应方法

下表列出了 Express 响应对象（`res`）的方法，它们可以向客户端发送响应并终止请求-响应周期。

| 方法 | 描述 |
|------|------|
| res.download() | 提示下载文件 |
| res.end() | 结束响应过程 |
| res.json() | 发送 JSON 响应 |
| res.jsonp() | 发送支持 JSONP 的 JSON 响应 |
| res.redirect() | 重定向请求 |
| res.render() | 渲染视图模板 |
| res.send() | 发送各种类型的响应 |
| res.sendFile() | 发送文件 |
| res.sendStatus() | 设置响应状态码并以状态码文本作为响应体发送 |

### 7.1 常用响应方法示例

```javascript
// 发送文本响应
app.get('/text', (req, res) => {
  res.send('Hello World!');
});

// 发送 JSON 响应
app.get('/json', (req, res) => {
  res.json({ message: 'Hello World!' });
});

// 设置状态码
app.get('/status', (req, res) => {
  res.status(201).send('Created');
});

// 重定向
app.get('/redirect', (req, res) => {
  res.redirect('/');
});

// 下载文件
app.get('/download', (req, res) => {
  res.download('./public/file.txt');
});

// 发送文件
app.get('/file', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'image.jpg'));
});
```

## 8. 模块化路由

对于大型应用程序，最好将路由分散到不同的文件中，这样可以更好地组织代码并提高可维护性。

### 8.1 使用 Router

Express 提供了 `express.Router` 类，用于创建可挂载的模块化路由处理程序。

**routes/users.js**:

```javascript
const express = require('express');
const router = express.Router();

// 中间件特定于此路由
router.use((req, res, next) => {
  console.log('时间:', Date.now());
  next();
});

// 定义根路由
router.get('/', (req, res) => {
  res.send('用户主页');
});

// 定义 /users/:id 路由
router.get('/:id', (req, res) => {
  res.send(`用户 ${req.params.id}`);
});

// 定义 /users/:id/profile 路由
router.get('/:id/profile', (req, res) => {
  res.send(`用户 ${req.params.id} 的资料`);
});

module.exports = router;
```

**routes/products.js**:

```javascript
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('产品列表');
});

router.get('/:id', (req, res) => {
  res.send(`产品 ${req.params.id}`);
});

module.exports = router;
```

**app.js**:

```javascript
const express = require('express');
const app = express();
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');

// 将用户路由挂载到 /users 路径
app.use('/users', usersRouter);

// 将产品路由挂载到 /products 路径
app.use('/products', productsRouter);

app.listen(3000);
```

### 8.2 路由前缀

在挂载路由时，可以指定一个前缀，所有的路由路径都会相对于这个前缀：

```javascript
// 所有以 /api/v1 开头的请求都会路由到 apiRouter
app.use('/api/v1', apiRouter);

// 因此，apiRouter 中的 /users 路由实际上是 /api/v1/users
```

### 8.3 路由分组

对于更复杂的应用，可以将相关路由分组到子路由器中：

**routes/api/index.js**:

```javascript
const express = require('express');
const router = express.Router();
const usersRouter = require('./users');
const productsRouter = require('./products');

// 将子路由挂载到 api 路由
router.use('/users', usersRouter);
router.use('/products', productsRouter);

module.exports = router;
```

**app.js**:

```javascript
const apiRouter = require('./routes/api');
app.use('/api/v1', apiRouter);
```

## 9. 高级路由技术

### 9.1 路由中间件链

可以为特定路由定义多个中间件，形成一个处理链：

```javascript
const express = require('express');
const app = express();

// 身份验证中间件
const authenticate = (req, res, next) => {
  // 验证逻辑
  if (req.headers.authorization) {
    next();
  } else {
    res.status(401).send('未授权');
  }
};

// 日志中间件
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

// 为特定路由应用多个中间件
app.get('/protected', authenticate, logger, (req, res) => {
  res.send('受保护的资源');
});
```

### 9.2 动态路由

可以根据运行时条件动态定义路由：

```javascript
const express = require('express');
const app = express();

// 从配置或数据库加载路由
const routes = [
  { path: '/dynamic1', handler: (req, res) => res.send('动态路由 1') },
  { path: '/dynamic2', handler: (req, res) => res.send('动态路由 2') }
];

// 动态注册路由
routes.forEach(route => {
  app.get(route.path, route.handler);
});
```

### 9.3 路由优先级

当多个路由可以匹配同一个请求时，定义顺序决定了匹配优先级，Express 会使用第一个匹配的路由：

```javascript
// 这个路由会先匹配，因为它更具体
app.get('/users/new', (req, res) => {
  res.send('创建新用户');
});

// 这个路由更通用，会匹配 /users/123 等，但不会匹配 /users/new
app.get('/users/:id', (req, res) => {
  res.send(`用户 ${req.params.id}`);
});
```

## 10. RESTful API 路由设计

REST（Representational State Transfer）是一种软件架构风格，用于设计网络应用程序。在 Express 中，可以轻松实现 RESTful API 路由。

### 10.1 RESTful API 路由示例

```javascript
const express = require('express');
const app = express();

app.use(express.json());

// 模拟数据
let items = [
  { id: 1, name: '物品 1', description: '描述 1' },
  { id: 2, name: '物品 2', description: '描述 2' }
];

// 获取所有资源 - GET /api/items
app.get('/api/items', (req, res) => {
  res.json(items);
});

// 获取单个资源 - GET /api/items/:id
app.get('/api/items/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).send('资源不存在');
  res.json(item);
});

// 创建新资源 - POST /api/items
app.post('/api/items', (req, res) => {
  const newItem = {
    id: items.length + 1,
    name: req.body.name,
    description: req.body.description
  };
  items.push(newItem);
  res.status(201).json(newItem);
});

// 更新资源 - PUT /api/items/:id
app.put('/api/items/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).send('资源不存在');
  
  item.name = req.body.name;
  item.description = req.body.description;
  
  res.json(item);
});

// 部分更新资源 - PATCH /api/items/:id
app.patch('/api/items/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).send('资源不存在');
  
  // 只更新提供的字段
  Object.assign(item, req.body);
  
  res.json(item);
});

// 删除资源 - DELETE /api/items/:id
app.delete('/api/items/:id', (req, res) => {
  const index = items.findIndex(i => i.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).send('资源不存在');
  
  const deletedItem = items.splice(index, 1);
  res.json(deletedItem[0]);
});
```

### 10.2 嵌套路由示例

对于有父子关系的资源，可以使用嵌套路由：

```javascript
// 获取用户的所有评论 - GET /api/users/:userId/comments
app.get('/api/users/:userId/comments', (req, res) => {
  const userId = req.params.userId;
  // 实际应用中，这里会根据 userId 查询数据库
  res.json({ userId, comments: [] });
});

// 创建用户评论 - POST /api/users/:userId/comments
app.post('/api/users/:userId/comments', (req, res) => {
  const userId = req.params.userId;
  const commentData = req.body;
  // 实际应用中，这里会创建评论并保存到数据库
  res.status(201).json({ userId, ...commentData, id: '1' });
});

// 获取特定评论 - GET /api/users/:userId/comments/:commentId
app.get('/api/users/:userId/comments/:commentId', (req, res) => {
  const { userId, commentId } = req.params;
  // 实际应用中，这里会根据 userId 和 commentId 查询数据库
  res.json({ userId, commentId, content: '评论内容' });
});
```

## 11. 路由测试

对路由进行测试是确保 API 正常工作的重要部分。可以使用各种测试框架，如 Mocha、Jest 等，结合 Supertest 来测试 Express 路由。

### 11.1 使用 Jest 和 Supertest 测试路由

```javascript
// 安装依赖
// npm install --save-dev jest supertest

// tests/routes.test.js
const request = require('supertest');
const app = require('../app');

describe('路由测试', () => {
  test('GET / 应该返回 Hello World', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Hello World!');
  });

  test('GET /users/:id 应该返回正确的用户', async () => {
    const response = await request(app).get('/users/123');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('用户 123');
  });

  test('POST /api/items 应该创建新资源', async () => {
    const response = await request(app)
      .post('/api/items')
      .send({ name: '测试物品', description: '测试描述' })
      .set('Accept', 'application/json');
    
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('测试物品');
  });
});
```

## 12. 路由最佳实践

### 12.1 组织路由

- **模块化**：将路由分散到不同的文件中
- **版本化**：在 API URL 中包含版本号（如 `/api/v1/`）
- **一致性**：使用一致的命名约定（如使用复数形式表示资源）

### 12.2 性能考虑

- **路由顺序**：将更具体的路由放在更通用的路由之前
- **减少正则表达式**：尽量使用字符串路径，只在必要时使用正则表达式
- **中间件范围**：将中间件应用到最小必要的路径范围

### 12.3 安全性

- **输入验证**：验证所有用户输入
- **参数过滤**：避免直接使用 `req.params` 或 `req.query` 构建数据库查询
- **错误处理**：使用适当的错误处理中间件

### 12.4 文档

- **API 文档**：为 API 路由创建详细的文档（可以使用 Swagger 等工具）
- **注释**：为复杂的路由处理逻辑添加注释

## 13. 参考资源

- [Express 路由官方文档](https://expressjs.com/en/guide/routing.html)
- [RESTful API 设计指南](https://restfulapi.net/)
- [Supertest](https://github.com/visionmedia/supertest)
- [Jest](https://jestjs.io/)
- [Swagger 文档生成](https://swagger.io/)