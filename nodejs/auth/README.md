# Node.js 身份认证与授权

本文档详细介绍在 Node.js 应用中实现身份认证和授权的各种方法、最佳实践和示例代码。身份认证和授权是构建安全 Web 应用的核心组成部分。

## 目录

- [认证与授权基础](#认证与授权基础)
- [常见认证方法](#常见认证方法)
- [密码管理](#密码管理)
- [JWT (JSON Web Tokens)](#jwt-json-web-tokens)
- [会话管理](#会话管理)
- [OAuth 2.0 与 OpenID Connect](#oauth-20-与-openid-connect)
- [多因素认证](#多因素认证)
- [API 密钥认证](#api-密钥认证)
- [权限控制](#权限控制)
- [安全最佳实践](#安全最佳实践)
- [集成第三方认证](#集成第三方认证)
- [常见问题与解决方案](#常见问题与解决方案)

## 认证与授权基础

### 认证 (Authentication)

认证是验证用户身份的过程，确认用户确实是其声称的身份。常见的认证方式包括：

- 用户名/密码认证
- 令牌认证 (如 JWT)
- 生物识别认证
- 多因素认证

### 授权 (Authorization)

授权是确定已认证用户可以访问哪些资源和执行哪些操作的过程。授权通常基于用户角色或权限级别。

### 认证流程

1. 用户提供凭证（如用户名/密码）
2. 服务器验证凭证
3. 服务器生成访问令牌或创建会话
4. 后续请求使用令牌或会话 ID 进行身份验证
5. 服务器验证令牌/会话并检查授权

## 常见认证方法

### 用户名/密码认证

最基本的认证方式，用户提供用户名和密码进行身份验证。

```javascript
const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
app.use(express.json());

// 模拟用户数据库
const users = [
  {
    id: 1,
    username: 'admin',
    // 实际应用中密码应加密存储，这里只是示例
    passwordHash: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', // "password"
    role: 'admin'
  }
];

// 登录端点
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  // 检查请求参数
  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码不能为空' });
  }
  
  // 查找用户
  const user = users.find(u => u.username === username);
  
  if (!user) {
    // 使用相同的错误信息，避免用户名枚举攻击
    return res.status(401).json({ error: '用户名或密码错误' });
  }
  
  try {
    // 验证密码
    const isValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isValid) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }
    
    // 生成令牌（在实际应用中，这里应该使用 JWT）
    const token = 'mock-jwt-token';
    
    res.json({ 
      success: true, 
      token,
      user: { id: user.id, username: user.username, role: user.role } 
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

### 会话认证

使用会话 ID 来维护用户登录状态。

```javascript
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const app = express();

// 配置会话中间件
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // 生产环境使用 HTTPS
    httpOnly: true, // 防止客户端 JavaScript 访问 cookie
    maxAge: 3600000 // 会话过期时间（1小时）
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 登录端点
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  // 验证用户...（与上面的示例类似）
  const user = users.find(u => u.username === username);
  const isValid = await bcrypt.compare(password, user.passwordHash);
  
  if (user && isValid) {
    // 将用户信息存储在会话中
    req.session.user = { id: user.id, username: user.username, role: user.role };
    res.json({ success: true });
  } else {
    res.status(401).json({ error: '用户名或密码错误' });
  }
});

// 会话认证中间件
function sessionAuthMiddleware(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ error: '未授权访问' });
  }
  next();
}

// 受保护的路由
app.get('/protected', sessionAuthMiddleware, (req, res) => {
  res.json({ success: true, user: req.session.user });
});

// 登出端点
app.post('/logout', sessionAuthMiddleware, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: '登出失败' });
    }
    res.clearCookie('connect.sid'); // 清除会话 cookie
    res.json({ success: true, message: '成功登出' });
  });
});
```

## 密码管理

### 密码哈希

永远不要以明文形式存储密码，应使用强哈希算法存储密码哈希值。

```javascript
const bcrypt = require('bcrypt');
const saltRounds = 10;

// 哈希密码
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

// 验证密码
async function verifyPassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

// 示例用法
async function registerUser(username, password) {
  const hashedPassword = await hashPassword(password);
  // 存储用户信息（用户名和哈希后的密码）
  console.log(`用户 ${username} 注册成功，密码哈希：${hashedPassword}`);
}

async function loginUser(username, password) {
  // 从数据库获取用户信息
  const user = { username: 'user1', passwordHash: '$2b$10$...' };
  
  // 验证密码
  const isValid = await verifyPassword(password, user.passwordHash);
  
  if (isValid) {
    console.log('登录成功');
  } else {
    console.log('密码错误');
  }
}
```

### 密码策略

实施强密码策略，包括：

- 最小长度要求（至少8-12个字符）
- 字符多样性（大小写字母、数字、特殊字符）
- 禁止常见密码
- 定期密码更新
- 密码历史记录，防止重用

```javascript
function validatePassword(password) {
  // 至少8个字符
  if (password.length < 8) {
    return { valid: false, message: '密码长度至少为8个字符' };
  }
  
  // 包含至少一个小写字母
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: '密码必须包含至少一个小写字母' };
  }
  
  // 包含至少一个大写字母
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: '密码必须包含至少一个大写字母' };
  }
  
  // 包含至少一个数字
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: '密码必须包含至少一个数字' };
  }
  
  // 包含至少一个特殊字符
  if (!/[^A-Za-z0-9]/.test(password)) {
    return { valid: false, message: '密码必须包含至少一个特殊字符' };
  }
  
  // 检查常见密码
  const commonPasswords = ['password', '123456', 'qwerty'];
  if (commonPasswords.includes(password.toLowerCase())) {
    return { valid: false, message: '密码过于简单，请使用更复杂的密码' };
  }
  
  return { valid: true };
}
```

## JWT (JSON Web Tokens)

JWT 是一种基于令牌的认证方法，适合无状态 API 设计。

### JWT 基础

```javascript
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

// 生成 JWT
auth.generateToken = (userId, role) => {
  const payload = { 
    id: userId, 
    role: role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1小时过期
  };
  
  return jwt.sign(payload, SECRET_KEY, { algorithm: 'HS256' });
};

// 验证 JWT
auth.verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('令牌已过期');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('无效的令牌');
    }
    throw error;
  }
};

// JWT 认证中间件
function jwtAuthMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: '缺少认证令牌' });
  }
  
  const tokenParts = authHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({ error: '无效的令牌格式' });
  }
  
  const token = tokenParts[1];
  
  try {
    const decoded = auth.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.message === '令牌已过期') {
      return res.status(401).json({ error: '令牌已过期，请重新登录' });
    }
    res.status(401).json({ error: '无效的认证令牌' });
  }
}

// 刷新令牌
app.post('/refresh-token', jwtAuthMiddleware, (req, res) => {
  try {
    const newToken = auth.generateToken(req.user.id, req.user.role);
    res.json({ token: newToken });
  } catch (error) {
    res.status(500).json({ error: '刷新令牌失败' });
  }
});
```

### JWT 最佳实践

1. **使用强密钥**：使用足够长且随机的密钥
2. **设置合理的过期时间**：短期访问令牌，搭配刷新令牌
3. **不要在令牌中存储敏感信息**：只存储必要的标识符
4. **使用 HTTPS**：防止令牌被窃取
5. **实现令牌撤销机制**：如维护黑名单或使用数据库验证

## 会话管理

### 使用 Redis 存储会话

对于分布式应用，使用 Redis 等共享存储来保存会话数据。

```javascript
const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const { createClient } = require('redis');

const app = express();

// 创建 Redis 客户端
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});
redisClient.connect().catch(console.error);

// 配置会话中间件
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 3600000 // 1小时
  }
}));
```

### 会话安全最佳实践

1. **使用安全的 cookie 设置**：secure, httpOnly, sameSite
2. **设置会话超时**：避免长期有效的会话
3. **限制会话固定攻击**：登录成功后重新生成会话 ID
4. **使用 CSRF 保护**：防止跨站请求伪造

```javascript
// 防止会话固定攻击
app.post('/login', async (req, res) => {
  // 验证用户...
  
  if (user && isValid) {
    // 重新生成会话 ID
    req.session.regenerate((err) => {
      if (err) {
        return res.status(500).json({ error: '登录失败' });
      }
      
      // 存储用户信息
      req.session.user = { id: user.id, username: user.username };
      res.json({ success: true });
    });
  }
});
```

## OAuth 2.0 与 OpenID Connect

### OAuth 2.0 基本流程

OAuth 2.0 是一个授权框架，允许第三方应用获取对用户资源的有限访问权限。

```javascript
const express = require('express');
const axios = require('axios');
const querystring = require('querystring');

const app = express();

// OAuth 配置
const oauthConfig = {
  clientId: process.env.OAUTH_CLIENT_ID,
  clientSecret: process.env.OAUTH_CLIENT_SECRET,
  authorizationEndpoint: 'https://example.com/oauth2/authorize',
  tokenEndpoint: 'https://example.com/oauth2/token',
  redirectUri: 'http://localhost:3000/auth/callback'
};

// 登录端点 - 重定向到授权服务器
app.get('/auth/login', (req, res) => {
  const params = {
    response_type: 'code',
    client_id: oauthConfig.clientId,
    redirect_uri: oauthConfig.redirectUri,
    scope: 'profile email',
    state: generateState() // 防止 CSRF 攻击
  };
  
  const authUrl = `${oauthConfig.authorizationEndpoint}?${querystring.stringify(params)}`;
  res.redirect(authUrl);
});

// 回调端点 - 处理授权码
app.get('/auth/callback', async (req, res) => {
  const { code, state } = req.query;
  
  // 验证 state 参数
  if (!state || !validateState(state)) {
    return res.status(403).send('无效的请求');
  }
  
  try {
    // 交换授权码获取访问令牌
    const tokenResponse = await axios.post(oauthConfig.tokenEndpoint, querystring.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: oauthConfig.redirectUri,
      client_id: oauthConfig.clientId,
      client_secret: oauthConfig.clientSecret
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    const { access_token, refresh_token } = tokenResponse.data;
    
    // 使用访问令牌获取用户信息
    const userInfoResponse = await axios.get('https://example.com/oauth2/userinfo', {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
    
    const userInfo = userInfoResponse.data;
    
    // 保存用户信息到会话或生成 JWT
    req.session.user = userInfo;
    
    res.redirect('/dashboard');
  } catch (error) {
    console.error('OAuth 回调错误:', error);
    res.status(500).send('登录失败');
  }
});

// 生成和验证 state 参数的辅助函数
function generateState() {
  // 生成随机字符串
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function validateState(state) {
  // 验证 state 参数（实际应用中应存储和验证 state）
  return true; // 简化示例
}
```

### 使用 Passport.js 集成 OAuth

Passport.js 是一个流行的认证中间件，支持多种认证策略。

```javascript
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();

// 配置会话
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// 初始化 Passport
app.use(passport.initialize());
app.use(passport.session());

// 配置 Google OAuth 策略
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  function(accessToken, refreshToken, profile, cb) {
    // 这里可以查找或创建用户
    // 简化示例，直接返回 profile
    return cb(null, profile);
  }
));

// 序列化和反序列化用户
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

// 认证路由
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // 成功认证后重定向到主页
    res.redirect('/');
  });

// 受保护的路由
app.get('/profile', ensureAuthenticated, function(req, res) {
  res.json(req.user);
});

// 登出
app.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

// 确保认证的中间件
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}
```

## 多因素认证

### 使用 speakeasy 实现 TOTP

TOTP (Time-based One-Time Password) 是一种基于时间的一次性密码算法，常用于双因素认证。

```javascript
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

// 生成密钥
function generateSecretKey() {
  return speakeasy.generateSecret({
    name: 'MyApp:user@example.com'
  });
}

// 生成 QR 码 URL（用于扫描到认证器应用）
async function generateQRCodeUrl(secret) {
  return await QRCode.toDataURL(secret.otpauth_url);
}

// 验证 TOTP 令牌
function verifyTOTPToken(secret, token) {
  return speakeasy.totp.verify({
    secret: secret.base32,
    encoding: 'base32',
    token: token,
    window: 1 // 允许前后 1 个时间窗口的误差
  });
}

// 示例用法
async function setupTwoFactorAuth() {
  // 生成密钥
  const secret = generateSecretKey();
  
  // 生成 QR 码
  const qrCodeUrl = await generateQRCodeUrl(secret);
  
  console.log('密钥:', secret.base32);
  console.log('QR 码 URL:', qrCodeUrl);
  
  // 将密钥保存到用户数据库
  // user.twoFactorSecret = secret.base32;
  
  return { secret, qrCodeUrl };
}

// 验证两因素认证令牌
function verifyTwoFactorToken(userSecret, token) {
  return verifyTOTPToken(userSecret, token);
}

// Express 路由示例
app.post('/setup-2fa', ensureAuthenticated, async (req, res) => {
  try {
    const { secret, qrCodeUrl } = await setupTwoFactorAuth();
    
    // 临时保存 secret 到会话（用于验证）
    req.session.twoFactorSecret = secret.base32;
    
    res.json({ qrCodeUrl, secret: secret.base32 });
  } catch (error) {
    res.status(500).json({ error: '设置两因素认证失败' });
  }
});

app.post('/verify-2fa', ensureAuthenticated, (req, res) => {
  const { token } = req.body;
  const secret = req.session.twoFactorSecret;
  
  if (!secret) {
    return res.status(400).json({ error: '未设置两因素认证' });
  }
  
  const isValid = verifyTOTPToken(secret, token);
  
  if (isValid) {
    // 验证成功，更新用户设置
    // User.findByIdAndUpdate(req.user.id, { twoFactorEnabled: true, twoFactorSecret: secret });
    delete req.session.twoFactorSecret; // 删除临时会话数据
    res.json({ success: true });
  } else {
    res.status(400).json({ error: '无效的认证令牌' });
  }
});

// 两因素认证登录流程
app.post('/login-2fa', (req, res) => {
  const { username, password, token } = req.body;
  
  // 1. 验证用户名和密码
  // 2. 检查用户是否启用了两因素认证
  // 3. 如果启用了，验证 TOTP 令牌
  // 4. 验证成功后登录用户
});
```

## API 密钥认证

对于 API 服务，使用 API 密钥是一种简单有效的认证方法。

```javascript
const crypto = require('crypto');
const express = require('express');
const app = express();

// 生成 API 密钥
function generateApiKey() {
  return crypto.randomBytes(32).toString('hex');
}

// API 密钥认证中间件
function apiKeyAuthMiddleware(req, res, next) {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;
  
  if (!apiKey) {
    return res.status(401).json({ error: '缺少 API 密钥' });
  }
  
  // 验证 API 密钥
  const isValid = validateApiKey(apiKey);
  
  if (!isValid) {
    return res.status(401).json({ error: '无效的 API 密钥' });
  }
  
  // 将 API 密钥对应的用户/应用信息附加到请求对象
  req.apiKeyInfo = getApiKeyInfo(apiKey);
  
  next();
}

// 模拟数据库操作
function validateApiKey(apiKey) {
  // 实际应用中应该查询数据库验证
  const validKeys = ['api-key-1', 'api-key-2']; // 示例密钥
  return validKeys.includes(apiKey);
}

function getApiKeyInfo(apiKey) {
  // 获取与 API 密钥关联的信息
  return { appId: 'app-1', permissions: ['read', 'write'] };
}

// 生成新 API 密钥的端点（通常需要管理员权限）
app.post('/api/keys', (req, res) => {
  const newKey = generateApiKey();
  
  // 将新密钥存储到数据库
  // storeApiKey(newKey, { appName: req.body.appName, permissions: req.body.permissions });
  
  res.json({ apiKey: newKey });
});

// 保护的 API 路由
app.get('/api/data', apiKeyAuthMiddleware, (req, res) => {
  res.json({ data: 'protected data', accessedBy: req.apiKeyInfo.appId });
});
```

## 权限控制

### 基于角色的访问控制 (RBAC)

RBAC 是一种常见的权限控制模型，基于用户角色分配权限。

```javascript
// 定义角色和权限
const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest'
};

const PERMISSIONS = {
  READ_USERS: 'read_users',
  WRITE_USERS: 'write_users',
  DELETE_USERS: 'delete_users',
  READ_DATA: 'read_data',
  WRITE_DATA: 'write_data'
};

// 角色权限映射
const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [PERMISSIONS.READ_USERS, PERMISSIONS.WRITE_USERS, PERMISSIONS.DELETE_USERS, PERMISSIONS.READ_DATA, PERMISSIONS.WRITE_DATA],
  [ROLES.USER]: [PERMISSIONS.READ_DATA, PERMISSIONS.WRITE_DATA],
  [ROLES.GUEST]: [PERMISSIONS.READ_DATA]
};

// 检查用户是否具有指定权限
function hasPermission(userRole, permission) {
  const userPermissions = ROLE_PERMISSIONS[userRole] || [];
  return userPermissions.includes(permission);
}

// 权限检查中间件
function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: '未授权访问' });
    }
    
    if (!hasPermission(req.user.role, permission)) {
      return res.status(403).json({ error: '没有足够的权限执行此操作' });
    }
    
    next();
  };
}

// 角色检查中间件
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: '未授权访问' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: '需要更高权限' });
    }
    
    next();
  };
}

// 路由示例
app.get('/api/users', 
  jwtAuthMiddleware, 
  requirePermission(PERMISSIONS.READ_USERS), 
  (req, res) => {
    // 获取用户列表
  }
);

app.post('/api/users', 
  jwtAuthMiddleware, 
  requirePermission(PERMISSIONS.WRITE_USERS), 
  (req, res) => {
    // 创建新用户
  }
);

app.delete('/api/users/:id', 
  jwtAuthMiddleware, 
  requireRole(ROLES.ADMIN), 
  (req, res) => {
    // 删除用户
  }
);
```

### 基于资源的权限控制

更细粒度的权限控制，基于特定资源的所有权或访问权限。

```javascript
// 检查用户是否有权限访问特定资源
async function canAccessResource(userId, resourceId, permission) {
  // 1. 检查资源是否存在
  const resource = await Resource.findById(resourceId);
  if (!resource) return false;
  
  // 2. 检查用户是否是资源所有者
  if (resource.ownerId.toString() === userId) {
    return true;
  }
  
  // 3. 检查用户是否有共享访问权限
  const access = await ResourceAccess.findOne({
    resourceId,
    userId,
    permission
  });
  
  return !!access;
}

// 资源权限检查中间件
function resourceAccessMiddleware(resourceType, permission) {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: '未授权访问' });
    }
    
    const resourceId = req.params.id;
    
    try {
      const canAccess = await canAccessResource(req.user.id, resourceId, permission);
      
      if (!canAccess) {
        return res.status(403).json({ error: '没有权限访问此资源' });
      }
      
      next();
    } catch (error) {
      res.status(500).json({ error: '权限检查失败' });
    }
  };
}

// 路由示例
app.get('/api/documents/:id', 
  jwtAuthMiddleware, 
  resourceAccessMiddleware('document', 'read'), 
  (req, res) => {
    // 获取文档
  }
);
```

## 安全最佳实践

### 1. 使用 HTTPS

始终使用 HTTPS 加密传输数据，防止中间人攻击。

```javascript
const https = require('https');
const fs = require('fs');
const express = require('express');

const app = express();

// 读取 SSL 证书
const options = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
};

// 创建 HTTPS 服务器
const server = https.createServer(options, app);

server.listen(443, () => {
  console.log('HTTPS 服务器运行在端口 443');
});
```

### 2. 输入验证

使用库如 Joi 或 express-validator 进行严格的输入验证。

```javascript
const { body, validationResult } = require('express-validator');

app.post('/register', [
  body('username').isLength({ min: 3 }).withMessage('用户名至少需要3个字符'),
  body('email').isEmail().withMessage('请提供有效的电子邮件地址'),
  body('password').isLength({ min: 8 }).withMessage('密码至少需要8个字符')
], (req, res) => {
  // 检查验证错误
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  // 处理注册逻辑
});
```

### 3. 速率限制

防止暴力攻击和 DoS 攻击，限制 API 请求频率。

```javascript
const rateLimit = require('express-rate-limit');

// 登录路由速率限制
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 5, // 每个 IP 最大 5 次请求
  message: '登录尝试次数过多，请稍后再试'
});

app.post('/login', loginLimiter, (req, res) => {
  // 登录逻辑
});

// API 速率限制
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: '请求频率过高，请稍后再试'
});

app.use('/api/', apiLimiter);
```

### 4. 防止常见的 Web 攻击

使用 helmet 中间件设置安全相关的 HTTP 头。

```javascript
const helmet = require('helmet');
const express = require('express');
const app = express();

// 使用 helmet 设置安全头部
app.use(helmet());

// 或单独配置
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", 'trusted-cdn.com']
  }
}));
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(helmet.referrerPolicy({ policy: 'same-origin' }));
```

### 5. 日志记录和监控

记录安全相关事件，定期审查日志，设置监控警报。

```javascript
const winston = require('winston');
const expressWinston = require('express-winston');

// 创建 logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'auth-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// 开发环境添加控制台输出
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

// 配置 Express 日志中间件
app.use(expressWinston.logger({
  winstonInstance: logger,
  meta: true,
  msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
  expressFormat: true,
  colorize: false,
}));

// 记录认证事件
function logAuthEvent(userId, eventType, success, details = {}) {
  logger.info({
    event: 'authentication',
    type: eventType, // 'login', 'logout', 'failed_login', 'password_change'
    userId,
    success,
    timestamp: new Date().toISOString(),
    ...details
  });
}

// 使用示例
app.post('/login', (req, res) => {
  // 登录逻辑
  if (loginSuccess) {
    logAuthEvent(userId, 'login', true);
    // 成功响应
  } else {
    logAuthEvent(null, 'failed_login', false, { username: req.body.username, reason: 'invalid_credentials' });
    // 失败响应
  }
});
```

## 集成第三方认证

### 集成 Google 登录

```javascript
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verifyGoogleToken(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    return ticket.getPayload();
  } catch (error) {
    console.error('Google token verification failed:', error);
    return null;
  }
}

app.post('/auth/google', async (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({ error: '缺少 Google 令牌' });
  }
  
  const payload = await verifyGoogleToken(token);
  
  if (!payload) {
    return res.status(401).json({ error: '无效的 Google 令牌' });
  }
  
  // 提取用户信息
  const { sub: googleId, email, name, picture } = payload;
  
  // 在数据库中查找或创建用户
  // const user = await findOrCreateUser(googleId, email, name, picture);
  
  // 生成 JWT
  // const jwtToken = generateToken(user.id, user.role);
  
  res.json({ success: true, token: jwtToken });
});
```

### 集成 Facebook 登录

```javascript
const axios = require('axios');

async function verifyFacebookToken(token) {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,picture`
    );
    return response.data;
  } catch (error) {
    console.error('Facebook token verification failed:', error);
    return null;
  }
}

app.post('/auth/facebook', async (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({ error: '缺少 Facebook 令牌' });
  }
  
  const userData = await verifyFacebookToken(token);
  
  if (!userData) {
    return res.status(401).json({ error: '无效的 Facebook 令牌' });
  }
  
  // 提取用户信息
  const { id: facebookId, email, name, picture } = userData;
  
  // 在数据库中查找或创建用户
  // const user = await findOrCreateUser(facebookId, email, name, picture?.data?.url);
  
  // 生成 JWT
  // const jwtToken = generateToken(user.id, user.role);
  
  res.json({ success: true, token: jwtToken });
});
```

## 常见问题与解决方案

### 1. 令牌过期和刷新

**问题**: JWT 令牌过期后如何处理？

**解决方案**: 实现刷新令牌机制。

```javascript
// 生成访问令牌和刷新令牌
function generateTokens(userId, role) {
  // 访问令牌（短期）
  const accessToken = jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  
  // 刷新令牌（长期）
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
}

// 刷新令牌端点
app.post('/refresh-token', (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(400).json({ error: '缺少刷新令牌' });
  }
  
  try {
    // 验证刷新令牌
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // 生成新的访问令牌
    const { accessToken } = generateTokens(decoded.id, decoded.role);
    
    res.json({ accessToken });
  } catch (error) {
    res.status(401).json({ error: '无效的刷新令牌' });
  }
});
```

### 2. 密码重置

**问题**: 用户忘记密码时如何重置？

**解决方案**: 实现密码重置流程。

```javascript
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// 生成密码重置令牌
function generateResetToken() {
  return crypto.randomBytes(20).toString('hex');
}

// 发送密码重置邮件
async function sendResetEmail(email, resetToken) {
  const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
  
  // 配置邮件传输器
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  
  // 邮件选项
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: '密码重置请求',
    html: `<p>您请求了密码重置，请点击以下链接：</p><a href="${resetUrl}">重置密码</a>`
  };
  
  // 发送邮件
  await transporter.sendMail(mailOptions);
}

// 请求密码重置端点
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  
  try {
    // 查找用户
    const user = await User.findOne({ email });
    
    if (!user) {
      // 为了安全，即使邮箱不存在也返回成功消息
      return res.json({ message: '如果邮箱存在，将发送密码重置邮件' });
    }
    
    // 生成重置令牌
    const resetToken = generateResetToken();
    
    // 设置令牌过期时间（1小时）
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    
    await user.save();
    
    // 发送重置邮件
    await sendResetEmail(email, resetToken);
    
    res.json({ message: '如果邮箱存在，将发送密码重置邮件' });
  } catch (error) {
    console.error('密码重置请求失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 重置密码端点
app.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  
  try {
    // 查找用户
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ error: '无效或过期的令牌' });
    }
    
    // 验证新密码
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.message });
    }
    
    // 哈希新密码
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 更新用户密码并清除重置令牌
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();
    
    res.json({ message: '密码已成功重置' });
  } catch (error) {
    console.error('重置密码失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});
```

### 3. 防止会话固定攻击

**问题**: 如何防止会话固定攻击？

**解决方案**: 登录成功后重新生成会话 ID。

```javascript
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  // 验证用户
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: '用户名或密码错误' });
  }
  
  // 防止会话固定攻击
  req.session.regenerate((err) => {
    if (err) {
      return res.status(500).json({ error: '登录失败' });
    }
    
    // 设置用户信息
    req.session.user = { id: user.id, username: user.username };
    
    res.json({ success: true });
  });
});
```

---

## 总结

实现安全的身份认证和授权系统是构建可靠 Web 应用的关键。通过结合多种认证方法、实施强密码策略、使用适当的令牌机制，并遵循安全最佳实践，可以有效保护用户数据和应用安全。同时，应定期更新和审查认证系统，以应对不断变化的安全威胁。

---

## 参考资源

- [OWASP 认证指南](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [JWT 最佳实践](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
- [OAuth 2.0 规范](https://tools.ietf.org/html/rfc6749)
- [Node.js 安全最佳实践](https://nodejs.org/en/docs/guides/security/)