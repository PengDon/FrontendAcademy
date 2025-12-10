# JavaScript 安全 (Security)

在Web开发中，JavaScript安全是一个至关重要的话题。由于JavaScript在客户端执行，它面临着独特的安全挑战。本章节将介绍JavaScript安全的基本概念、常见漏洞以及防护措施。

## 1. 基本概念

### 1.1 安全原则

- **最小权限原则**：代码应该只拥有完成其任务所需的最小权限
- **输入验证**：永远不要信任用户输入
- **输出编码**：确保所有输出到浏览器的内容都经过适当编码
- **安全默认设置**：默认配置应该是最安全的

### 1.2 同源策略 (Same-Origin Policy)

同源策略是浏览器的核心安全机制，它限制了来自不同源的文档或脚本如何与当前文档交互。

```javascript
// 同源的定义：协议、域名和端口都相同
// 例如：
// https://example.com:443/page1.html 和 https://example.com:443/page2.html 是同源
// https://example.com:443/page1.html 和 https://sub.example.com:443/page1.html 不是同源
```

### 1.3 跨域资源共享 (CORS)

CORS 是一种机制，允许在受控条件下从另一个域请求资源。

```javascript
// 服务器响应头示例
// Access-Control-Allow-Origin: https://example.com
// Access-Control-Allow-Methods: GET, POST, PUT, DELETE
```

## 2. 常见安全漏洞

### 2.1 跨站脚本攻击 (XSS)

XSS 是最常见的JavaScript安全漏洞，攻击者通过注入恶意脚本到网页中。

#### 类型
- **存储型 XSS**：恶意脚本被存储在服务器上
- **反射型 XSS**：恶意脚本包含在URL中
- **DOM型 XSS**：恶意脚本修改页面的DOM结构

```javascript
// 不安全的代码：直接将用户输入插入到DOM中
const userInput = getParameterByName('name');
document.getElementById('greeting').innerHTML = 'Hello, ' + userInput;

// 安全的代码：使用textContent或适当编码
const userInput = getParameterByName('name');
document.getElementById('greeting').textContent = 'Hello, ' + userInput;
```

### 2.2 跨站请求伪造 (CSRF)

CSRF 攻击利用用户已登录的身份执行非预期的操作。

```html
<!-- 恶意网站上的CSRF攻击示例 -->
<form action="https://bank.com/transfer" method="POST">
  <input type="hidden" name="amount" value="1000">
  <input type="hidden" name="to" value="attacker-account">
</form>
<script>
document.forms[0].submit();
</script>
```

### 2.3 点击劫持 (Clickjacking)

点击劫持是一种视觉欺骗攻击，攻击者通过覆盖透明或半透明的层来诱使用户点击他们不打算点击的内容。

### 2.4 安全漏洞：不安全的直接对象引用

当应用程序暴露内部对象引用（如文件路径、数据库主键）时，攻击者可以操作这些引用来访问未授权的数据。

```javascript
// 不安全的代码：直接使用URL参数作为文件路径
const file = req.params.file;
res.sendFile(`/files/${file}`);

// 安全的代码：使用映射表
const fileMap = {
  'report1': 'files/report1.pdf',
  'report2': 'files/report2.pdf'
};
const file = req.params.file;
if (fileMap[file]) {
  res.sendFile(fileMap[file]);
} else {
  res.sendStatus(404);
}
```

### 2.5 安全漏洞：敏感数据暴露

不当的加密或缺乏加密可能导致敏感数据泄露。

```javascript
// 不安全的代码：明文存储密码
const user = {
  username: 'john',
  password: 'password123' // 不安全！
};

// 安全的代码：使用哈希和盐
const bcrypt = require('bcrypt');
const saltRounds = 10;
const plainTextPassword = 'password123';

bcrypt.hash(plainTextPassword, saltRounds, function(err, hash) {
  const user = {
    username: 'john',
    password: hash // 安全！
  };
});
```

## 3. 安全防护措施

### 3.1 输入验证和净化

- 使用白名单而非黑名单验证输入
- 对所有用户输入进行适当的净化

```javascript
// 使用DOMPurify净化HTML输入
const clean = DOMPurify.sanitize(dirtyHTML);

// 使用正则表达式验证电子邮件
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
```

### 3.2 输出编码

- HTML编码：将特殊字符转换为HTML实体
- JavaScript编码：确保在JavaScript上下文中安全
- URL编码：确保在URL上下文中安全

```javascript
// HTML编码示例
function htmlEncode(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// URL编码示例
const encoded = encodeURIComponent('https://example.com/?name=test&value=123');
```

### 3.3 内容安全策略 (CSP)

CSP是一种安全层，用于检测和缓解XSS等攻击。

```html
<!-- 内容安全策略示例 -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' https://trusted-cdn.com;
  style-src 'self' https://trusted-cdn.com;
  img-src 'self' https://trusted-images.com data:;
">
```

### 3.4 CSRF防护

- 使用CSRF令牌
- 验证Origin/Referer头
- 实现SameSite cookie属性

```javascript
// Express.js中使用CSRF令牌的示例
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

app.get('/form', csrfProtection, function(req, res) {
  res.render('form', { csrfToken: req.csrfToken() });
});

app.post('/process', csrfProtection, function(req, res) {
  res.send('数据已处理');
});
```

### 3.5 安全Cookie设置

- `HttpOnly`：防止JavaScript访问Cookie
- `Secure`：仅通过HTTPS传输Cookie
- `SameSite`：限制跨站请求中的Cookie发送

```javascript
// 安全Cookie设置示例
res.cookie('sessionId', sessionId, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 3600000 // 1小时
});
```

## 4. 客户端安全最佳实践

### 4.1 避免内联脚本

```html
<!-- 不安全：内联脚本 -->
<script>
alert('Hello World');
</script>

<!-- 安全：外部脚本 -->
<script src="script.js"></script>
```

### 4.2 使用安全的API

- 避免使用`eval()`、`Function()`构造函数等危险函数
- 谨慎使用`innerHTML`，优先使用`textContent`或`createElement()`

```javascript
// 不安全的代码
const userInput = 'alert("XSS攻击")';
eval(userInput); // 危险！

// 安全的代码
const userInput = 'Hello World';
console.log(userInput); // 安全
```

### 4.3 安全处理敏感数据

- 不要在客户端存储敏感数据
- 敏感数据传输必须使用HTTPS
- 避免在URL中传递敏感信息

### 4.4 定期更新依赖

使用工具如`npm audit`或`yarn audit`检查依赖中的安全漏洞。

```bash
# 检查npm依赖中的安全漏洞
npm audit

# 自动修复可修复的漏洞
npm audit fix
```

## 5. 安全工具和资源

### 5.1 安全扫描工具

- **OWASP ZAP**：用于查找Web应用程序中的安全漏洞
- **Snyk**：持续监控依赖中的安全漏洞
- **ESLint**：通过插件可以检测安全问题

### 5.2 安全框架和库

- **DOMPurify**：HTML净化库，防止XSS攻击
- **helmet**：Express.js安全中间件集合
- **bcrypt**：密码哈希库

### 5.3 安全资源

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)

## 6. 学习重点

1. 理解同源策略和CORS的工作原理
2. 掌握XSS和CSRF攻击的防护措施
3. 学会正确使用内容安全策略(CSP)
4. 了解安全Cookie设置的重要性
5. 掌握输入验证和输出编码的最佳实践
6. 熟悉常见的安全漏洞及其防护方法

## 7. 练习

### 7.1 基础练习

1. 创建一个简单的表单，实现输入验证和输出编码
2. 实现一个CSRF防护机制
3. 配置内容安全策略(CSP)

### 7.2 进阶练习

1. 分析一个存在XSS漏洞的代码，并修复它
2. 实现安全的密码存储和验证机制
3. 创建一个安全的API，实现CORS和CSRF防护

## 8. 参考资料

- [OWASP JavaScript Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JavaScript_Security_Cheat_Sheet.html)
- [MDN Web Security Guide](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Google Web Fundamentals - Security](https://developers.google.com/web/fundamentals/security)
- [JavaScript Security: Essential Practices](https://blog.appsecmonkey.com/javascript-security-essential-practices)