# Node.js 微服务架构

## 微服务架构概述

微服务架构是一种将应用程序构建为一系列松耦合服务的设计方法。每个服务运行在自己的进程中，通过轻量级机制（通常是HTTP API）进行通信。Node.js凭借其非阻塞I/O模型和事件驱动架构，非常适合构建高性能、可扩展的微服务。

## 微服务的核心特征

1. **服务组件化**：将应用分解为可独立部署的服务
2. **围绕业务能力组织**：按业务领域划分服务边界
3. **产品而非项目**：每个服务由独立团队负责全生命周期
4. **去中心化治理**：允许使用不同的技术栈和工具
5. **去中心化数据管理**：每个服务维护自己的数据存储
6. **基础设施自动化**：利用DevOps和CI/CD实践
7. **故障隔离**：单个服务故障不影响整个系统
8. **弹性设计**：系统能够承受部分服务不可用

## Node.js微服务基础架构

### 1. 服务发现

服务发现使服务能够找到并与其他服务通信，是微服务架构的关键组件。

#### 使用Consul实现服务发现

```javascript
// 安装依赖
// npm install consul

const Consul = require('consul');

// 创建Consul客户端
const consul = new Consul({
  host: 'localhost',
  port: 8500,
  promisify: true
});

// 注册服务
async function registerService() {
  try {
    await consul.agent.service.register({
      name: 'user-service',
      id: 'user-service-1',
      address: 'localhost',
      port: 3001,
      tags: ['user', 'nodejs'],
      check: {
        http: 'http://localhost:3001/health',
        interval: '10s',
        timeout: '5s'
      }
    });
    console.log('服务注册成功');
  } catch (error) {
    console.error('服务注册失败:', error);
  }
}

// 发现服务
async function discoverService(serviceName) {
  try {
    const result = await consul.agent.service.list();
    const services = Object.values(result)
      .filter(service => service.Service === serviceName);
    
    return services.map(service => ({
      address: service.Address,
      port: service.Port
    }));
  } catch (error) {
    console.error('服务发现失败:', error);
    return [];
  }
}

// 实现健康检查端点
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString()
  });
});
```

### 2. API网关

API网关作为客户端和微服务之间的中间层，提供路由、认证、限流等功能。

#### 使用Express实现简单API网关

```javascript
// 安装依赖
// npm install express http-proxy-middleware morgan helmet

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require('morgan');
const helmet = require('helmet');
const consul = require('./consul-client'); // 前面定义的Consul客户端

const app = express();
const PORT = process.env.PORT || 8080;

// 中间件
app.use(helmet());
app.use(morgan('dev'));

// 健康检查
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// 动态代理路由
async function setupProxyRoutes() {
  // 从服务发现获取服务列表
  const userServices = await consul.discoverService('user-service');
  const productServices = await consul.discoverService('product-service');
  
  if (userServices.length > 0) {
    app.use('/api/users', createProxyMiddleware({
      target: `http://${userServices[0].address}:${userServices[0].port}`,
      changeOrigin: true,
      pathRewrite: { '^/api/users': '/users' }
    }));
  }
  
  if (productServices.length > 0) {
    app.use('/api/products', createProxyMiddleware({
      target: `http://${productServices[0].address}:${productServices[0].port}`,
      changeOrigin: true,
      pathRewrite: { '^/api/products': '/products' }
    }));
  }
}

// 启动服务器
async function startServer() {
  await setupProxyRoutes();
  
  // 每30秒刷新一次服务发现
  setInterval(setupProxyRoutes, 30000);
  
  app.listen(PORT, () => {
    console.log(`API网关运行在 http://localhost:${PORT}`);
  });
}

startServer();
```

### 3. 消息队列

消息队列用于解耦服务，实现异步通信，提高系统弹性。

#### 使用RabbitMQ实现消息通信

```javascript
// 安装依赖
// npm install amqplib

const amqp = require('amqplib');

class MessageQueue {
  constructor() {
    this.connection = null;
    this.channel = null;
  }
  
  async connect(url = 'amqp://localhost') {
    try {
      this.connection = await amqp.connect(url);
      this.channel = await this.connection.createChannel();
      console.log('成功连接到RabbitMQ');
    } catch (error) {
      console.error('RabbitMQ连接失败:', error);
      throw error;
    }
  }
  
  async createQueue(queueName, options = { durable: true }) {
    if (!this.channel) {
      throw new Error('未连接到RabbitMQ');
    }
    
    await this.channel.assertQueue(queueName, options);
    console.log(`队列 ${queueName} 已创建`);
  }
  
  async sendMessage(queueName, message, options = { persistent: true }) {
    if (!this.channel) {
      throw new Error('未连接到RabbitMQ');
    }
    
    await this.channel.sendToQueue(
      queueName,
      Buffer.from(JSON.stringify(message)),
      options
    );
    console.log(`消息已发送到队列 ${queueName}`);
  }
  
  async consumeMessages(queueName, callback, options = {}) {
    if (!this.channel) {
      throw new Error('未连接到RabbitMQ');
    }
    
    await this.channel.consume(queueName, async (msg) => {
      if (msg) {
        try {
          const message = JSON.parse(msg.content.toString());
          await callback(message);
          this.channel.ack(msg);
        } catch (error) {
          console.error('消息处理错误:', error);
          this.channel.nack(msg, false, false);
        }
      }
    }, options);
    
    console.log(`开始消费队列 ${queueName} 的消息`);
  }
  
  async close() {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
    console.log('RabbitMQ连接已关闭');
  }
}

// 生产者示例
async function producerExample() {
  const mq = new MessageQueue();
  await mq.connect();
  await mq.createQueue('order_queue');
  
  // 发送订单消息
  await mq.sendMessage('order_queue', {
    orderId: 'ORD-12345',
    userId: 'USER-67890',
    amount: 199.99,
    items: [
      { productId: 'PROD-1', quantity: 2, price: 99.99 }
    ],
    timestamp: new Date().toISOString()
  });
  
  await mq.close();
}

// 消费者示例
async function consumerExample() {
  const mq = new MessageQueue();
  await mq.connect();
  await mq.createQueue('order_queue');
  
  // 消费订单消息
  await mq.consumeMessages('order_queue', async (order) => {
    console.log('处理订单:', order.orderId);
    // 在这里实现订单处理逻辑
    // 例如：更新库存、发送通知等
    await processOrder(order);
  });
}

async function processOrder(order) {
  // 订单处理逻辑
  console.log(`订单 ${order.orderId} 处理完成`);
}
```

### 4. 容器化与部署

Docker和Kubernetes是部署微服务的主流技术。

#### Dockerfile示例

```dockerfile
# 使用官方Node.js镜像作为基础
FROM node:16-alpine

# 设置工作目录
WORKDIR /usr/src/app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制应用代码
COPY . .

# 暴露服务端口
EXPOSE 3000

# 设置环境变量
ENV NODE_ENV=production

# 启动应用
CMD ["node", "server.js"]
```

#### Docker Compose配置

```yaml
version: '3.8'

services:
  # API网关服务
  api-gateway:
    build: ./api-gateway
    ports:
      - "8080:8080"
    environment:
      - CONSUL_HOST=consul
    depends_on:
      - consul
  
  # 用户服务
  user-service:
    build: ./user-service
    ports:
      - "3001:3001"
    environment:
      - CONSUL_HOST=consul
      - MONGO_URI=mongodb://mongo:27017/users
    depends_on:
      - consul
      - mongo
  
  # 产品服务
  product-service:
    build: ./product-service
    ports:
      - "3002:3002"
    environment:
      - CONSUL_HOST=consul
      - MONGO_URI=mongodb://mongo:27017/products
    depends_on:
      - consul
      - mongo
  
  # 订单服务
  order-service:
    build: ./order-service
    ports:
      - "3003:3003"
    environment:
      - CONSUL_HOST=consul
      - MONGO_URI=mongodb://mongo:27017/orders
      - RABBITMQ_URL=amqp://rabbitmq
    depends_on:
      - consul
      - mongo
      - rabbitmq
  
  # 通知服务
  notification-service:
    build: ./notification-service
    environment:
      - RABBITMQ_URL=amqp://rabbitmq
    depends_on:
      - rabbitmq
  
  # 服务发现
  consul:
    image: consul:latest
    ports:
      - "8500:8500"
    command: agent -server -bootstrap-expect=1 -ui -client=0.0.0.0
  
  # 消息队列
  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"
  
  # 数据库
  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

## 微服务设计模式

### 1. 服务拆分策略

#### 按业务能力拆分

```
- 用户服务 (User Service): 用户管理、身份验证
- 产品服务 (Product Service): 产品目录、库存管理
- 订单服务 (Order Service): 订单处理、支付集成
- 通知服务 (Notification Service): 电子邮件、短信、推送通知
- 购物车服务 (Cart Service): 购物车管理
```

#### 按领域驱动设计(DDD)拆分

```
- 用户领域 (User Domain)
- 产品领域 (Product Domain)
- 订单领域 (Order Domain)
- 支付领域 (Payment Domain)
- 物流领域 (Shipping Domain)
```

### 2. 通信模式

#### 同步通信

```javascript
// 使用axios进行HTTP请求
const axios = require('axios');

async function getUserDetails(userId) {
  try {
    const response = await axios.get(`http://user-service:3001/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('获取用户详情失败:', error);
    throw error;
  }
}

async function createOrder(orderData) {
  try {
    // 1. 验证用户
    const user = await getUserDetails(orderData.userId);
    if (!user) {
      throw new Error('用户不存在');
    }
    
    // 2. 验证产品库存
    for (const item of orderData.items) {
      const product = await axios.get(
        `http://product-service:3002/products/${item.productId}`
      );
      
      if (!product.data || product.data.stock < item.quantity) {
        throw new Error(`产品 ${item.productId} 库存不足`);
      }
    }
    
    // 3. 创建订单
    const order = await axios.post(
      'http://order-service:3003/orders',
      orderData
    );
    
    return order.data;
  } catch (error) {
    console.error('创建订单失败:', error);
    throw error;
  }
}
```

#### 异步通信

```javascript
// 发布-订阅模式
const mq = new MessageQueue();

async function publishEvent(eventType, eventData) {
  await mq.sendMessage('events', {
    type: eventType,
    data: eventData,
    timestamp: new Date().toISOString()
  });
}

// 在订单服务中发布订单创建事件
async function createOrder(orderData) {
  // 保存订单
  const order = await saveOrderToDatabase(orderData);
  
  // 发布订单创建事件
  await publishEvent('ORDER_CREATED', order);
  
  return order;
}

// 在库存服务中订阅订单创建事件
async function setupInventoryConsumer() {
  await mq.consumeMessages('events', async (event) => {
    if (event.type === 'ORDER_CREATED') {
      const order = event.data;
      
      // 更新库存
      for (const item of order.items) {
        await updateInventory(item.productId, -item.quantity);
      }
      
      // 发布库存更新事件
      await publishEvent('INVENTORY_UPDATED', {
        orderId: order.id,
        items: order.items
      });
    }
  });
}
```

### 3. 数据一致性模式

#### Saga模式

```javascript
// 使用补偿事务确保数据一致性
class OrderSaga {
  constructor(mq) {
    this.mq = mq;
    this.steps = [
      { action: 'CREATE_ORDER', compensatingAction: 'CANCEL_ORDER' },
      { action: 'UPDATE_INVENTORY', compensatingAction: 'RESTORE_INVENTORY' },
      { action: 'PROCESS_PAYMENT', compensatingAction: 'REFUND_PAYMENT' },
      { action: 'SHIPPING_PREPARE', compensatingAction: 'CANCEL_SHIPPING' }
    ];
  }
  
  async execute(orderData) {
    const sagaId = `saga-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const currentStep = 0;
    
    try {
      // 开始执行saga
      await this.mq.sendMessage('saga', {
        sagaId,
        orderData,
        currentStep,
        status: 'IN_PROGRESS'
      });
      
      // 发布第一个步骤的命令
      await this.mq.sendMessage('commands', {
        sagaId,
        orderData,
        command: this.steps[currentStep].action,
        stepIndex: currentStep
      });
      
      return { success: true, sagaId };
    } catch (error) {
      console.error('Saga启动失败:', error);
      return { success: false, error: error.message };
    }
  }
  
  async handleCommandResult(sagaId, stepIndex, success, result) {
    if (success) {
      // 步骤执行成功，继续下一步
      const nextStep = stepIndex + 1;
      
      if (nextStep < this.steps.length) {
        // 还有下一步
        await this.mq.sendMessage('commands', {
          sagaId,
          orderData: result.orderData,
          command: this.steps[nextStep].action,
          stepIndex: nextStep
        });
        
        // 更新saga状态
        await this.mq.sendMessage('saga', {
          sagaId,
          currentStep: nextStep,
          status: 'IN_PROGRESS'
        });
      } else {
        // 所有步骤完成
        await this.mq.sendMessage('saga', {
          sagaId,
          status: 'COMPLETED'
        });
      }
    } else {
      // 步骤执行失败，开始补偿
      await this.startCompensation(sagaId, stepIndex, result.orderData);
    }
  }
  
  async startCompensation(sagaId, failedStepIndex, orderData) {
    // 更新saga状态为补偿中
    await this.mq.sendMessage('saga', {
      sagaId,
      status: 'COMPENSATING'
    });
    
    // 按相反顺序执行补偿操作
    for (let i = failedStepIndex; i >= 0; i--) {
      await this.mq.sendMessage('commands', {
        sagaId,
        orderData,
        command: this.steps[i].compensatingAction,
        stepIndex: i,
        isCompensation: true
      });
    }
    
    // 补偿完成后更新状态
    await this.mq.sendMessage('saga', {
      sagaId,
      status: 'COMPENSATED'
    });
  }
}

// 使用示例
const mq = new MessageQueue();
const orderSaga = new OrderSaga(mq);

async function placeOrder(orderData) {
  const result = await orderSaga.execute(orderData);
  return result;
}
```

## 微服务监控与可观测性

### 1. 日志聚合

使用Winston和ELK栈进行日志管理：

```javascript
// 安装依赖
// npm install winston winston-elasticsearch

const winston = require('winston');
const { ElasticsearchTransport } = require('winston-elasticsearch');

// 创建日志器
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: {
    service: process.env.SERVICE_NAME || 'unknown-service',
    environment: process.env.NODE_ENV || 'development',
    instanceId: process.env.INSTANCE_ID || 'local'
  },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({
      filename: 'error.log',
      level: 'error'
    }),
    new winston.transports.File({
      filename: 'combined.log'
    })
  ]
});

// 仅在生产环境中配置Elasticsearch
if (process.env.NODE_ENV === 'production') {
  const esTransportOpts = {
    level: 'info',
    clientOpts: {
      node: process.env.ELASTICSEARCH_URL || 'http://elasticsearch:9200'
    }
  };
  
  const esTransport = new ElasticsearchTransport(esTransportOpts);
  logger.add(esTransport);
}

// 使用示例
logger.info('服务启动', { port: 3000 });
logger.error('数据库连接失败', { error: error.message });
logger.warn('配置未找到，使用默认值', { key: 'MAX_RETRIES', defaultValue: 3 });
```

### 2. 分布式追踪

使用OpenTelemetry实现分布式追踪：

```javascript
// 安装依赖
// npm install @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node @opentelemetry/exporter-trace-otlp-http

const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');

// 配置OpenTelemetry SDK
const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTLP_ENDPOINT || 'http://jaeger:4318/v1/traces'
  }),
  instrumentations: [getNodeAutoInstrumentations()],
  serviceName: process.env.SERVICE_NAME || 'nodejs-service',
  serviceVersion: process.env.SERVICE_VERSION || '1.0.0'
});

// 启动追踪
async function startTracing() {
  await sdk.start();
  console.log('OpenTelemetry 追踪已启动');
}

// 优雅关闭
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('OpenTelemetry 追踪已关闭'))
    .catch((error) => console.error('关闭OpenTelemetry时出错:', error))
    .finally(() => process.exit(0));
});

// 使用示例
const express = require('express');
const app = express();

app.get('/api/resource', async (req, res) => {
  try {
    // 手动创建子span
    const tracer = require('@opentelemetry/api').trace.getTracer('custom-tracer');
    const span = tracer.startSpan('business-logic-operation');
    
    // 执行业务逻辑
    const result = await performBusinessLogic();
    
    span.end();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 3. 健康检查和指标

使用Prometheus和Express健康检查中间件：

```javascript
// 安装依赖
// npm install prom-client express-healthcheck

const express = require('express');
const prometheus = require('prom-client');
const healthcheck = require('express-healthcheck');

const app = express();

// 设置Prometheus指标收集器
const register = new prometheus.Registry();
prometheus.collectDefaultMetrics({ register });

// 自定义计数器
const httpRequestDurationMicroseconds = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});
register.registerMetric(httpRequestDurationMicroseconds);

// 自定义计数器 - 服务调用计数
const serviceCallCounter = new prometheus.Counter({
  name: 'service_calls_total',
  help: 'Total number of service calls',
  labelNames: ['service', 'status']
});
register.registerMetric(serviceCallCounter);

// 中间件 - 记录请求持续时间
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    httpRequestDurationMicroseconds
      .labels(req.method, req.path, res.statusCode)
      .observe(duration / 1000);
  });
  next();
});

// 健康检查端点
app.use('/health', healthcheck({
  healthy: () => ({
    status: 'UP',
    version: process.env.npm_package_version,
    timestamp: new Date().toISOString(),
    services: {
      database: 'UP',
      messageQueue: 'UP'
    }
  })
}));

// Prometheus指标端点
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
```

## 微服务安全最佳实践

### 1. 认证和授权

```javascript
// 安装依赖
// npm install jsonwebtoken bcryptjs express-jwt

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { expressjwt: expressJwt } = require('express-jwt');

const app = express();
app.use(express.json());

// JWT配置
const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
const jwtExpiry = process.env.JWT_EXPIRY || '1h';

// 密码加密
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// 密码验证
async function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

// 生成JWT令牌
function generateToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    jwtSecret,
    { expiresIn: jwtExpiry }
  );
}

// JWT认证中间件
const authMiddleware = expressJwt({
  secret: jwtSecret,
  algorithms: ['HS256'],
  getToken: function fromHeaderOrQuerystring(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  }
});

// 角色授权中间件
function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.auth.role)) {
      return res.status(403).json({ message: '权限不足' });
    }
    next();
  };
}

// 登录路由
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 这里应该从数据库获取用户
    const user = { id: '1', username: 'admin', role: 'admin' };
    
    // 验证用户和密码
    if (!user || !(await verifyPassword(password, user.password))) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }
    
    // 生成令牌
    const token = generateToken(user);
    
    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 受保护的路由
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: '这是受保护的资源', user: req.auth });
});

// 管理员路由
app.get('/api/admin', authMiddleware, authorize('admin'), (req, res) => {
  res.json({ message: '这是管理员资源' });
});
```

### 2. API安全头部

```javascript
// 安装依赖
// npm install helmet rate-limit express-brute csurf

const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

const app = express();

// 设置安全头部
app.use(helmet());

// 配置Cookie安全
app.use(cookieParser());
app.use(cookieParser(process.env.COOKIE_SECRET || 'your-cookie-secret'));

// 启用CSRF保护（适用于有状态API）
app.use(csrf({ cookie: { httpOnly: true, secure: true, sameSite: 'strict' } }));

// CSRF令牌端点
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// 请求体限制
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// API速率限制
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 每个IP限制100个请求
  message: '请求过于频繁，请稍后再试',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false
});

// 应用速率限制到所有API路由
app.use('/api/', apiLimiter);

// 登录路由使用更严格的限制
const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1小时
  max: 5, // 每个IP限制5个请求
  message: '登录尝试次数过多，请1小时后再试',
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/auth/login', loginLimiter);
```

### 3. API网关安全增强

```javascript
// 安装依赖
// npm install express-jwt-jwks jwks-rsa

const express = require('express');
const { expressjwt: expressJwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const app = express();

// JWT验证配置
const checkJwt = expressJwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.AUTH0_JWKS_URI || 'https://your-auth0-domain.auth0.com/.well-known/jwks.json'
  }),
  audience: process.env.AUTH0_AUDIENCE || 'https://your-api.com',
  issuer: process.env.AUTH0_ISSUER || 'https://your-auth0-domain.auth0.com/',
  algorithms: ['RS256']
});

// 应用认证到所有API路由
app.use('/api/', checkJwt);

// 错误处理中间件
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: '未授权访问',
      message: err.message
    });
  }
  next(err);
});

// 服务路由
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// 自定义CORS中间件
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['*'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 预检请求缓存时间（秒）
};

app.use(cors(corsOptions));

// 预处理请求
app.options('*', cors(corsOptions));
```

## 常见问题与答案

### 1. 微服务架构与单体应用相比有哪些优势？
**答案：**
- **更好的可扩展性**：可以独立扩展各个服务，根据需求分配资源
- **技术栈灵活性**：不同服务可以使用最适合其功能的技术栈
- **更快的部署周期**：可以独立部署和更新单个服务
- **故障隔离**：一个服务的故障不会影响整个系统
- **团队自主性**：不同团队可以独立开发和维护自己的服务
- **更容易持续交付**：支持更频繁、更小的部署

### 2. 微服务架构的主要挑战有哪些？
**答案：**
- **分布式系统复杂性**：网络延迟、部分故障等问题
- **数据一致性**：跨服务事务和数据同步的挑战
- **服务发现**：服务实例动态变化需要有效的发现机制
- **监控难度**：需要跨服务跟踪和监控
- **测试复杂性**：端到端测试变得更加复杂
- **运维复杂性**：需要更多的DevOps技能和工具
- **安全挑战**：服务间通信和API安全
- **知识共享**：不同团队之间需要协调和共享知识

### 3. 如何选择合适的微服务粒度？
**答案：**
- **业务能力边界**：按照业务功能和领域自然划分服务
- **团队结构**：考虑Conway法则，服务边界与团队边界对齐
- **单一责任原则**：每个服务应该有明确的单一责任
- **数据自主性**：服务应该控制自己的数据存储
- **服务间通信成本**：避免过度细粒度导致的大量服务间通信
- **演进式设计**：从较大的服务开始，根据需要逐步拆分
- **性能要求**：考虑数据访问模式和性能需求
- **变更频率**：经常变更的功能应该考虑单独成服务

### 4. 微服务架构中的分布式事务如何处理？
**答案：**
- **Saga模式**：使用一系列本地事务和补偿事务实现分布式事务
- **事件驱动架构**：通过事件发布和订阅实现最终一致性
- **CQRS模式**：分离读写操作，使用事件源保持数据一致性
- **两阶段提交(2PC)**：适用于需要强一致性的场景，但会降低可用性
- **TCC(Try-Confirm-Cancel)**：预留资源、确认操作或取消操作的模式
- **最终一致性**：接受短期的数据不一致，通过补偿机制保证最终一致
- **幂等性设计**：确保操作可以安全地重试而不产生副作用
- **业务补偿**：通过业务流程设计实现错误恢复

### 5. 如何实现微服务的可靠通信？
**答案：**
- **断路器模式**：防止故障级联传播，快速失败并恢复
- **重试机制**：使用指数退避算法进行智能重试
- **超时控制**：为所有服务调用设置合理的超时时间
- **异步通信**：使用消息队列实现可靠的异步通信
- **消息持久化**：确保消息不会在故障时丢失
- **消息确认**：使用确认机制确保消息被处理
- **负载均衡**：在多个服务实例间分发请求
- **服务降级**：在故障情况下提供基本功能

### 6. 如何监控微服务架构？
**答案：**
- **日志聚合**：使用ELK栈、Graylog等集中管理日志
- **分布式追踪**：使用Jaeger、Zipkin等追踪请求流
- **指标收集**：使用Prometheus等收集系统和应用指标
- **健康检查**：实现详细的健康检查API
- **告警机制**：基于指标和日志设置告警
- **可视化仪表板**：使用Grafana等创建监控仪表板
- **异常检测**：实现自动异常检测和告警
- **业务指标监控**：监控关键业务指标和SLA
- **根因分析**：使用分布式追踪快速定位问题根源

### 7. 如何实现微服务的安全？
**答案：**
- **API网关安全**：集中处理认证、授权、限流等
- **服务间认证**：使用JWT、mTLS等实现服务间安全通信
- **密钥管理**：使用专门的密钥管理服务存储敏感信息
- **最小权限原则**：每个服务只授予必要的权限
- **安全扫描**：集成自动化安全扫描到CI/CD流程
- **容器安全**：使用最小基础镜像，实施容器安全最佳实践
- **网络安全**：使用服务网格或网络策略限制服务间通信
- **数据加密**：传输中和静态数据加密
- **安全审计**：记录和分析安全相关事件

### 8. 如何设计可扩展的微服务架构？
**答案：**
- **水平扩展**：设计无状态服务，支持水平扩展
- **服务拆分**：避免过大的服务，按业务能力拆分
- **数据库策略**：考虑分片、读写分离、NoSQL等策略
- **缓存策略**：合理使用多级缓存减轻数据库负载
- **异步处理**：使用消息队列处理高并发请求
- **弹性设计**：实现熔断、限流、降级等机制
- **资源隔离**：使用容器和命名空间隔离资源
- **自动扩展**：配置基于负载的自动扩展规则
- **数据分区**：根据访问模式设计数据分区策略

### 9. 如何在微服务架构中管理配置？
**答案：**
- **配置中心**：使用Spring Cloud Config、Consul等集中管理配置
- **环境分离**：为开发、测试、生产等环境维护不同配置
- **动态更新**：支持运行时配置更新而无需重启服务
- **版本控制**：对配置进行版本控制和变更追踪
- **配置加密**：敏感配置加密存储
- **配置验证**：配置变更前进行验证
- **配置审计**：记录配置变更历史
- **服务特定配置**：服务可以有自己的特定配置
- **默认配置**：提供合理的默认配置值

### 10. 如何实现微服务的灰度发布和金丝雀部署？
**答案：**
- **特性标志**：使用特性标志控制功能的启用/禁用
- **流量切换**：通过API网关控制流量分配
- **蓝绿部署**：维护两个环境，切换流量
- **金丝雀发布**：将少量流量引导到新版本
- **A/B测试**：同时运行多个版本并比较效果
- **自动回滚**：基于监控指标自动回滚失败的发布
- **渐进式发布**：逐步增加新版本的流量比例
- **影子模式**：将生产流量复制到新版本进行测试
- **流量镜像**：在不影响生产流量的情况下测试新版本