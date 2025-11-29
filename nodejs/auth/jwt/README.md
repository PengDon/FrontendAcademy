# JWT (JSON Web Token) 认证

## 1. JWT 简介

JWT (JSON Web Token) 是一种开放标准 (RFC 7519)，用于在网络应用环境间安全地传递声明。它是一种基于 JSON 的轻量级令牌，用于在客户端和服务器之间安全地传输信息。

JWT 由三部分组成，用点号 (.) 分隔：

1. **Header（头部）** - 包含令牌类型和使用的签名算法
2. **Payload（载荷）** - 包含声明（claims），即存储的信息
3. **Signature（签名）** - 用于验证令牌的完整性和真实性

典型的 JWT 格式如下：
```
xxxxx.yyyyy.zzzzz
```

## 2. JWT 的工作原理

1. 客户端发送认证凭证（如用户名和密码）到服务器
2. 服务器验证凭证，如果有效，生成 JWT 并返回给客户端
3. 客户端存储 JWT（通常在 localStorage 或 cookie 中）
4. 客户端在后续请求中携带 JWT（通常在 Authorization 头部）
5. 服务器验证 JWT，如果有效，则处理请求

## 3. JWT 的优势

- **无状态** - 服务器不需要存储会话信息，便于水平扩展
- **跨域** - 可以在不同域之间传递
- **自包含** - 包含所有必要的信息，减少数据库查询
- **标准化** - 遵循 RFC 7519 标准
- **可扩展** - 可以根据需要添加自定义声明

## 4. JWT 结构详解

### 4.1 Header

Header 通常包含两个部分：令牌类型（typ）和使用的签名算法（alg）。

```json
{
  "typ": "JWT",
  "alg": "HS256"
}
```

然后将这个 JSON 对象进行 Base64URL 编码，形成第一部分。

### 4.2 Payload

Payload 包含声明（claims），分为三类：

- **注册声明（Registered Claims）** - 预定义的声明，如 iss（签发者）、exp（过期时间）、sub（主题）等
- **公共声明（Public Claims）** - 可以自定义的声明，但应避免冲突
- **私有声明（Private Claims）** - 用于特定目的的自定义声明

```json
{
  "sub": "1234567890",
  "name": "张三",
  "iat": 1516239022,
  "exp": 1516242622
}
```

然后将这个 JSON 对象进行 Base64URL 编码，形成第二部分。

### 4.3 Signature

Signature 用于验证消息是否被更改。签名过程如下：

1. 对 Header 和 Payload 进行 Base64URL 编码
2. 使用点号连接这两部分：`encodedHeader.encodedPayload`
3. 使用 Header 中指定的算法和密钥对连接后的字符串进行签名

例如，使用 HMAC SHA256 算法：
```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

然后将签名进行 Base64URL 编码，形成第三部分。

## 5. Node.js 中实现 JWT 认证

### 5.1 安装依赖

```bash
npm install jsonwebtoken bcrypt express
```

### 5.2 基本实现

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// 中间件
app.use(bodyParser.json());

// 模拟用户数据库
const users = [
  {
    id: 1,
    username: 'admin',
    // 密码: admin123
    passwordHash: '$2b$10$4I3i5p5J8o7u8y9i0o1p2q3r4s5t6u7v8w9x0y1z2',
    role: 'admin'
  }
];

// JWT 密钥
const JWT_SECRET = 'your-secret-key';
const JWT_EXPIRES_IN = '1h';

// 身份验证中间件
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: '未提供授权令牌' });
  }

  // 从 Authorization 头部提取令牌
  // 格式: Bearer <token>
  const token = authHeader.split(' ')[1];

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: '无效或过期的令牌' });
    }

    req.user = user;
    next();
  });
};

// 登录路由
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  // 查找用户
  const user = users.find(u => u.username === username);

  if (!user) {
    return res.status(401).json({ message: '用户名或密码错误' });
  }

  // 验证密码
  const passwordMatch = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatch) {
    return res.status(401).json({ message: '用户名或密码错误' });
  }

  // 生成 JWT
  const token = jwt.sign(
    { userId: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  res.json({ token });
});

// 受保护的路由
app.get('/api/profile', authenticateJWT, (req, res) => {
  res.json({
    message: '这是受保护的个人资料页面',
    user: req.user
  });
});

// 管理员路由（基于角色的访问控制）
app.get('/api/admin', authenticateJWT, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: '权限不足，需要管理员权限' });
  }

  res.json({ message: '这是管理员页面' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
```

## 6. 高级功能

### 6.1 刷新令牌

实现刷新令牌机制，延长用户会话：

```javascript
// 存储刷新令牌（实际应用中应存储在数据库中）
const refreshTokens = [];

// 登录路由（返回访问令牌和刷新令牌）
app.post('/api/login', async (req, res) => {
  // ... 前面的代码 ...

  // 生成访问令牌
  const accessToken = jwt.sign(
    { userId: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '15m' } // 访问令牌短期有效
  );

  // 生成刷新令牌
  const refreshToken = jwt.sign(
    { userId: user.id },
    'refresh-token-secret',
    { expiresIn: '7d' } // 刷新令牌长期有效
  );

  // 存储刷新令牌
  refreshTokens.push(refreshToken);

  res.json({ accessToken, refreshToken });
});

// 刷新令牌路由
app.post('/api/refresh-token', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken || !refreshTokens.includes(refreshToken)) {
    return res.status(401).json({ message: '无效的刷新令牌' });
  }

  jwt.verify(refreshToken, 'refresh-token-secret', (err, user) => {
    if (err) {
      return res.status(403).json({ message: '刷新令牌已过期' });
    }

    // 生成新的访问令牌
    const newAccessToken = jwt.sign(
      { userId: user.userId, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken: newAccessToken });
  });
});

// 登出路由
app.post('/api/logout', (req, res) => {
  const { refreshToken } = req.body;
  const index = refreshTokens.indexOf(refreshToken);
  
  if (index !== -1) {
    refreshTokens.splice(index, 1);
  }
  
  res.json({ message: '登出成功' });
});
```

### 6.2 令牌撤销

实现令牌撤销机制，允许管理员撤销特定用户的令牌：

```javascript
// 存储已撤销的令牌（实际应用中应使用 Redis 等高性能存储）
const revokedTokens = new Set();

// 更新身份验证中间件，检查令牌是否被撤销
const authenticateJWT = (req, res, next) => {
  // ... 前面的代码 ...

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: '无效或过期的令牌' });
    }

    // 检查令牌是否被撤销
    if (revokedTokens.has(token)) {
      return res.status(403).json({ message: '令牌已被撤销' });
    }

    req.user = user;
    next();
  });
};

// 撤销令牌路由（管理员使用）
app.post('/api/revoke-token', authenticateJWT, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: '权限不足' });
  }

  const { token } = req.body;
  revokedTokens.add(token);

  res.json({ message: '令牌已撤销' });
});
```

## 7. 安全最佳实践

### 7.1 密钥管理

- 使用强密钥（至少 256 位）
- 定期轮换密钥
- 存储在环境变量或专用密钥管理服务中
- 为访问令牌和刷新令牌使用不同的密钥

### 7.2 令牌设置

- 设置合理的过期时间（访问令牌短期，刷新令牌长期）
- 在载荷中避免存储敏感信息
- 包含签发者（iss）、主题（sub）和过期时间（exp）声明

### 7.3 传输安全

- 使用 HTTPS 传输所有请求
- 在 Authorization 头部使用 Bearer 方案传递令牌
- 考虑使用 HttpOnly Cookie 存储令牌，防止 XSS 攻击

### 7.4 其他安全措施

- 实现速率限制，防止暴力攻击
- 对敏感操作要求重新认证
- 监控异常登录活动
- 实现令牌黑名单机制

## 8. JWT 与 Session 对比

| 特性 | JWT | Session |
|------|-----|---------|
| 状态存储 | 客户端 | 服务器端 |
| 扩展性 | 良好（无状态） | 较差（需要共享会话存储） |
| 安全性 | 依赖密钥管理和传输安全 | 依赖 cookie 安全设置 |
| 跨域 | 支持 | 有限制 |
| 令牌撤销 | 较复杂 | 简单（直接删除会话） |
| 性能 | 较好（减少数据库查询） | 可能需要额外查询 |

## 9. 常见问题与解决方案

### 9.1 令牌过期问题

**问题**：用户在令牌过期后需要重新登录。
**解决方案**：实现刷新令牌机制，在访问令牌过期前自动刷新。

### 9.2 令牌被窃取

**问题**：如果令牌被窃取，攻击者可以冒充用户。
**解决方案**：
- 设置较短的过期时间
- 实现令牌黑名单
- 使用 IP 或设备指纹进行额外验证

### 9.3 性能问题

**问题**：随着声明增加，令牌大小增加，影响传输效率。
**解决方案**：
- 只存储必要的信息
- 避免在载荷中存储敏感数据
- 考虑使用压缩

## 10. 参考资源

- [JWT 官方网站](https://jwt.io/)
- [RFC 7519](https://tools.ietf.org/html/rfc7519)
- [jsonwebtoken 库文档](https://github.com/auth0/node-jsonwebtoken)
- [bcrypt 库文档](https://github.com/kelektiv/node.bcrypt.js)