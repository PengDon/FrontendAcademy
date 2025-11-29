# Electron 安全最佳实践

本目录包含Electron应用程序的安全最佳实践示例代码和详细文档，帮助开发者构建安全可靠的Electron应用。

## 目录内容

- **README.md**: Electron安全最佳实践概述和指南
- **main.js**: 主进程安全配置示例
- **preload.js**: 安全的预加载脚本实现
- **renderer.js**: 渲染进程安全使用示例
- **security-config.js**: 安全配置和验证工具
- **index.html**: 安全的渲染进程界面示例

## Electron安全核心概念

### 1. 上下文隔离 (Context Isolation)

上下文隔离确保渲染器进程无法直接访问Node.js API，即使启用了`nodeIntegration`。

**配置方式：**
```javascript
const win = new BrowserWindow({
  webPreferences: {
    contextIsolation: true,
    // 其他配置...
  }
});
```

### 2. 预加载脚本 (Preload Scripts)

预加载脚本在渲染器进程加载前执行，但具有对Node.js API的有限访问权。

**安全实践：**
- 只暴露必要的功能给渲染进程
- 使用`contextBridge`安全地暴露API
- 避免在预加载脚本中使用`remote`模块

### 3. 内容安全策略 (CSP)

内容安全策略帮助防止跨站脚本(XSS)、数据注入等攻击。

**推荐的CSP配置：**
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; media-src 'self'; object-src 'none'; frame-src 'none'; frame-ancestors 'none'; form-action 'self'; base-uri 'self'; report-uri /csp-violation-report; upgrade-insecure-requests;">
```

### 4. nodeIntegration 和 enableRemoteModule

默认情况下，应禁用`nodeIntegration`和`enableRemoteModule`以减少安全风险。

**安全配置：**
```javascript
const win = new BrowserWindow({
  webPreferences: {
    nodeIntegration: false,
    enableRemoteModule: false,
    // 其他配置...
  }
});
```

### 5. sandbox模式

Sandbox模式限制了渲染器进程的权限，提供额外的安全层。

**启用方式：**
```javascript
const win = new BrowserWindow({
  webPreferences: {
    sandbox: true,
    // 其他配置...
  }
});
```

### 6. 禁用危险的功能

**禁用实验性功能：**
```javascript
app.commandLine.appendSwitch('no-experiments');
```

**禁用远程内容的JavaScript：**
```javascript
win.webContents.on('will-navigate', (event) => {
  // 阻止导航
});
```

### 7. 进程间通信 (IPC) 安全

**安全的IPC模式：**
- 主进程验证所有渲染进程消息
- 渲染进程使用`contextBridge`暴露的API
- 避免敏感数据通过IPC直接传递

### 8. 安全的外部内容加载

**加载外部URL的安全实践：**
- 使用`shell`模块打开外部链接
- 验证URL的安全性
- 实现安全的URL过滤

## 常见安全威胁和防护

### 1. 恶意代码执行

**防护措施：**
- 启用上下文隔离和禁用nodeIntegration
- 实施严格的CSP
- 对所有输入进行验证和净化

### 2. 信息泄露

**防护措施：**
- 避免在渲染进程中暴露敏感信息
- 安全存储用户数据
- 实现适当的访问控制

### 3. 不安全的API使用

**防护措施：**
- 仅使用推荐的API和模式
- 避免使用已弃用的API
- 定期更新Electron版本

### 4. 跨站脚本攻击 (XSS)

**防护措施：**
- 实施内容安全策略
- 对所有用户输入进行验证和转义
- 使用安全的HTML渲染库

### 5. 不安全的网络请求

**防护措施：**
- 使用HTTPS而非HTTP
- 验证证书有效性
- 实现适当的错误处理

## 安全检查清单

### 应用启动前
- [ ] 禁用nodeIntegration
- [ ] 启用上下文隔离
- [ ] 禁用enableRemoteModule
- [ ] 配置适当的内容安全策略
- [ ] 审核预加载脚本的安全性

### 应用运行时
- [ ] 验证所有IPC消息
- [ ] 限制文件系统访问权限
- [ ] 监控和记录安全事件
- [ ] 实现适当的错误处理，避免信息泄露

### 发布前
- [ ] 使用最新版本的Electron
- [ ] 运行安全扫描工具
- [ ] 检查第三方依赖的安全漏洞
- [ ] 实施代码签名

## 资源链接

- [Electron官方安全文档](https://www.electronjs.org/docs/tutorial/security)
- [Electron安全检查表](https://www.electronjs.org/docs/tutorial/security#checklist-security-recommendations)
- [OWASP桌面应用安全验证标准](https://owasp.org/www-project-desktop-app-security-verification-standard/)
- [Node.js安全最佳实践](https://nodejs.org/en/docs/guides/security/)

## 最佳实践总结

1. **默认安全配置**：始终从最安全的配置开始，仅在必要时放宽权限
2. **最小权限原则**：每个组件只拥有完成其任务所需的最小权限
3. **输入验证**：验证所有外部输入，防止注入攻击
4. **安全的通信**：使用安全的IPC模式，避免直接暴露Node.js API
5. **定期更新**：保持Electron和依赖项的最新版本
6. **安全审计**：定期进行安全审计和漏洞扫描

遵循这些安全最佳实践，您可以显著提高Electron应用程序的安全性，保护用户数据和系统安全。