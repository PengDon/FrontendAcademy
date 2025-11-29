# OAuth 认证

## 1. OAuth 简介

OAuth (Open Authorization) 是一个开放标准，允许用户授权第三方应用访问他们在另一个服务上的资源，而无需将密码提供给第三方应用。OAuth 目前有两个主要版本：OAuth 1.0a 和 OAuth 2.0，其中 OAuth 2.0 是目前广泛使用的版本。

OAuth 2.0 定义了几种授权流程，适用于不同的应用场景，包括网页应用、移动应用和原生应用。

## 2. OAuth 2.0 核心概念

### 2.1 角色

- **资源所有者（Resource Owner）**：能够授予对受保护资源访问权限的实体，通常是用户
- **资源服务器（Resource Server）**：托管受保护资源的服务器，能够接受并响应使用访问令牌的请求
- **客户端（Client）**：代表资源所有者请求访问受保护资源的应用程序
- **授权服务器（Authorization Server）**：验证资源所有者身份并颁发访问令牌的服务器

### 2.2 授权类型

OAuth 2.0 定义了几种授权类型：

1. **授权码授权（Authorization Code Grant）**：最常用的流程，适用于有后端服务器的应用
2. **隐式授权（Implicit Grant）**：适用于纯前端应用，但已不推荐使用
3. **资源所有者密码凭据授权（Resource Owner Password Credentials Grant）**：适用于高度信任的应用
4. **客户端凭据授权（Client Credentials Grant）**：适用于服务器间的通信
5. **设备授权（Device Authorization Grant）**：适用于输入受限的设备

### 2.3 令牌

- **访问令牌（Access Token）**：用于访问受保护资源的令牌
- **刷新令牌（Refresh Token）**：用于获取新的访问令牌的令牌

## 3. OAuth 2.0 授权码流程

授权码流程是最安全和最常用的 OAuth 2.0 流程，适用于有后端服务器的应用。流程如下：

1. **用户发起授权请求**：用户点击客户端应用中的"使用第三方账号登录"按钮
2. **重定向到授权服务器**：客户端将用户重定向到授权服务器的授权端点，包含客户端 ID、重定向 URI、响应类型等参数
3. **用户登录并授权**：用户在授权服务器上登录并确认授权
4. **授权服务器重定向回客户端**：授权服务器将用户重定向回客户端，包含授权码
5. **客户端请求访问令牌**：客户端使用授权码向授权服务器的令牌端点请求访问令牌
6. **授权服务器颁发令牌**：授权服务器验证授权码，颁发访问令牌（可能还包括刷新令牌）
7. **客户端访问受保护资源**：客户端使用访问令牌向资源服务器请求受保护资源

## 4. Node.js 实现 OAuth 2.0

### 4.1 使用 Passport.js 实现 GitHub OAuth 登录

Passport.js 是 Node.js 中最流行的认证中间件，支持多种认证策略，包括 OAuth。

#### 安装依赖

```bash
npm install express passport passport-github2 express-session
```

#### 基本实现

```javascript
const express = require('express');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const session = require('express-session');

const app = express();
const PORT = 3000;

// 配置会话中间件
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

// 初始化 Passport
app.use(passport.initialize());
app.use(passport.session());

// 配置 GitHub 策略
passport.use(new GitHubStrategy({
    clientID: 'YOUR_GITHUB_CLIENT_ID',
    clientSecret: 'YOUR_GITHUB_CLIENT_SECRET',
    callbackURL: 'http://localhost:3000/auth/github/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    // 这里可以根据 profile 创建或查找用户
    console.log('Access Token:', accessToken);
    console.log('Profile:', profile);
    return done(null, profile);
  }
));

// 序列化用户
passport.serializeUser(function(user, done) {
  done(null, user);
});

// 反序列化用户
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// 路由
app.get('/', (req, res) => {
  res.send('<a href="/auth/github">使用 GitHub 登录</a>');
});

// 发起 OAuth 认证
app.get('/auth/github', passport.authenticate('github', {
  scope: ['user:email']
}));

// OAuth 回调
app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    // 认证成功，重定向到主页或用户页面
    res.redirect('/profile');
  }
);

// 受保护的个人资料页面
app.get('/profile', ensureAuthenticated, (req, res) => {
  res.send(`<h1>欢迎回来, ${req.user.username}!</h1><a href="/logout">登出</a>`);
});

// 登出
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// 确保用户已认证的中间件
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
```

### 4.2 创建自己的 OAuth 2.0 授权服务器

使用 `node-oauth2-server` 库创建自己的 OAuth 2.0 授权服务器。

#### 安装依赖

```bash
npm install express oauth2-server
```

#### 基本实现

```javascript
const express = require('express');
const OAuth2Server = require('oauth2-server');
const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;

const app = express();
const PORT = 3000;

// 模拟数据库
const clients = [
  {
    clientId: 'client1',
    clientSecret: 'client1secret',
    grants: ['authorization_code', 'refresh_token'],
    redirectUris: ['http://localhost:3001/callback']
  }
];

const users = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123'
  }
];

let authorizationCodes = [];
let accessTokens = [];
let refreshTokens = [];

// 创建 OAuth 2.0 服务器实例
const oauth = new OAuth2Server({
  model: {
    // 获取客户端
    getClient: async (clientId, clientSecret) => {
      const client = clients.find(c => c.clientId === clientId);
      if (!client || (clientSecret && client.clientSecret !== clientSecret)) {
        return null;
      }
      return client;
    },
    
    // 生成授权码
    saveAuthorizationCode: async (code, client, user) => {
      const authorizationCode = {
        ...code,
        clientId: client.clientId,
        userId: user.id
      };
      authorizationCodes.push(authorizationCode);
      return authorizationCode;
    },
    
    // 获取授权码
    getAuthorizationCode: async (code) => {
      const authorizationCode = authorizationCodes.find(c => c.authorizationCode === code);
      if (!authorizationCode) return null;
      return {
        ...authorizationCode,
        client: clients.find(c => c.clientId === authorizationCode.clientId),
        user: users.find(u => u.id === authorizationCode.userId)
      };
    },
    
    // 生成访问令牌
    saveToken: async (token, client, user) => {
      const accessToken = {
        ...token,
        clientId: client.clientId,
        userId: user.id
      };
      accessTokens.push(accessToken);
      if (token.refreshToken) {
        refreshTokens.push(accessToken);
      }
      return accessToken;
    },
    
    // 获取访问令牌
    getAccessToken: async (token) => {
      const accessToken = accessTokens.find(t => t.accessToken === token);
      if (!accessToken) return null;
      return accessToken;
    },
    
    // 验证用户
    getUser: async (username, password) => {
      const user = users.find(u => u.username === username && u.password === password);
      return user;
    },
    
    // 撤销授权码
    revokeAuthorizationCode: async (code) => {
      const index = authorizationCodes.findIndex(c => c.authorizationCode === code.authorizationCode);
      if (index !== -1) {
        authorizationCodes.splice(index, 1);
        return true;
      }
      return false;
    }
  },
  accessTokenLifetime: 3600, // 1 小时
  refreshTokenLifetime: 1209600, // 14 天
  authorizationCodeLifetime: 300 // 5 分钟
});

// 中间件
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 授权端点
app.get('/oauth/authorize', async (req, res) => {
  const request = new Request(req);
  const response = new Response(res);
  
  try {
    // 验证授权请求
    const authCodeResult = await oauth.authorize(request, response);
    
    // 这里通常会显示授权页面
    // 简化示例，直接重定向
    res.redirect(`${authCodeResult.redirectUri}?code=${authCodeResult.authorizationCode}`);
  } catch (error) {
    res.status(error.code || 500).json(error);
  }
});

// 令牌端点
app.post('/oauth/token', async (req, res) => {
  const request = new Request(req);
  const response = new Response(res);
  
  try {
    const token = await oauth.token(request, response);
    res.json(token);
  } catch (error) {
    res.status(error.code || 500).json(error);
  }
});

// 受保护的资源
app.get('/api/resource', async (req, res) => {
  const request = new Request(req);
  const response = new Response(res);
  
  try {
    await oauth.authenticate(request, response);
    res.json({ message: '访问受保护资源成功' });
  } catch (error) {
    res.status(error.code || 500).json(error);
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`OAuth 2.0 服务器运行在 http://localhost:${PORT}`);
});
```

## 5. 常见 OAuth 提供商集成

### 5.1 Google OAuth

```javascript
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: 'YOUR_GOOGLE_CLIENT_ID',
    clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    // 处理用户信息
    return done(null, profile);
  }
));

app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/profile');
  }
);
```

### 5.2 Facebook OAuth

```javascript
const FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: 'YOUR_FACEBOOK_APP_ID',
    clientSecret: 'YOUR_FACEBOOK_APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'emails']
  },
  function(accessToken, refreshToken, profile, done) {
    // 处理用户信息
    return done(null, profile);
  }
));

app.get('/auth/facebook', passport.authenticate('facebook', {
  scope: ['email']
}));

app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/profile');
  }
);
```

## 6. 安全最佳实践

### 6.1 授权服务器安全

- 使用 HTTPS 保护所有通信
- 验证重定向 URI，防止开放重定向攻击
- 实施 CSRF 保护
- 限制授权码的生命周期
- 验证客户端密钥

### 6.2 客户端安全

- 安全存储客户端密钥，不要在前端暴露
- 验证所有来自授权服务器的响应
- 安全存储访问令牌和刷新令牌
- 实现令牌轮换机制

### 6.3 资源服务器安全

- 严格验证访问令牌
- 实施适当的访问控制
- 验证令牌的过期时间
- 监控异常访问模式

## 7. OAuth 2.0 与 OpenID Connect

OpenID Connect (OIDC) 是建立在 OAuth 2.0 之上的身份认证协议。它添加了一个身份层，允许客户端验证用户的身份，并获取用户的基本配置文件信息。

主要区别：
- OAuth 2.0 是授权协议，而 OIDC 是身份认证协议
- OIDC 添加了 ID 令牌（JWT 格式）
- OIDC 定义了用户信息端点
- OIDC 提供了标准的范围值，如 `openid`、`profile`、`email` 等

## 8. 常见问题与解决方案

### 8.1 CSRF 攻击

**问题**：攻击者可能诱导用户在已登录的情况下访问恶意网站，执行未授权操作。
**解决方案**：
- 使用 state 参数
- 验证 state 参数的有效性
- 为每个请求生成唯一的 state 值

### 8.2 令牌泄露

**问题**：访问令牌可能被窃取，导致未授权访问。
**解决方案**：
- 使用 HTTPS
- 缩短访问令牌的生命周期
- 实施令牌轮换
- 监控异常访问

### 8.3 重定向 URI 操纵

**问题**：攻击者可能操纵重定向 URI，导致用户被重定向到恶意网站。
**解决方案**：
- 严格验证重定向 URI 是否在预注册列表中
- 不允许使用通配符重定向 URI
- 实施重定向 URI 白名单

## 9. 参考资源

- [OAuth 2.0 官方文档](https://oauth.net/2/)
- [OpenID Connect 官方文档](https://openid.net/connect/)
- [Passport.js 文档](http://www.passportjs.org/)
- [RFC 6749 (OAuth 2.0)](https://tools.ietf.org/html/rfc6749)
- [RFC 6750 (Bearer Token)](https://tools.ietf.org/html/rfc6750)