# Electron 核心概念

本目录包含Electron的核心概念和基础知识，帮助您理解Electron应用的架构和工作原理。

## 什么是 Electron

Electron 是一个使用 JavaScript、HTML 和 CSS 构建跨平台桌面应用的框架。它允许开发者使用 Web 技术创建可以在 Windows、macOS 和 Linux 上运行的桌面应用程序。

Electron 的主要特点：

- **跨平台**：一套代码可以运行在多个操作系统上
- **基于 Web 技术**：使用熟悉的 HTML、CSS 和 JavaScript 开发
- **访问原生功能**：通过内置模块访问操作系统功能
- **强大的社区支持**：GitHub、Slack、Microsoft Teams 等知名应用都使用 Electron 构建

## Electron 架构

Electron 应用由两个主要进程组成：

### 1. 主进程（Main Process）

- **入口点**：通过 `main.js` 文件启动
- **负责**：创建和管理浏览器窗口、菜单栏、应用生命周期等
- **特性**：可以使用所有 Electron API
- **示例**：
```javascript
const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
```

### 2. 渲染进程（Renderer Process）

- **创建方式**：主进程通过 `BrowserWindow` 创建
- **负责**：显示 Web 内容，每个窗口运行在独立的渲染进程中
- **特性**：默认情况下无法访问 Node.js API，需要通过配置启用
- **示例**：
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Hello Electron!</title>
</head>
<body>
  <h1>Hello Electron!</h1>
  <p>Welcome to your Electron application.</p>
  <script>
    // 渲染进程代码
    const electron = require('electron');
    console.log('Electron version:', electron.remote.app.getVersion());
  </script>
</body>
</html>
```

## 进程间通信（IPC）

主进程和渲染进程之间需要通过 IPC 进行通信：

### 主进程接收消息示例：
```javascript
const { ipcMain } = require('electron');

ipcMain.on('message-from-renderer', (event, arg) => {
  console.log(arg); // 打印渲染进程发送的消息
  event.reply('message-from-main', 'Message received!'); // 回复渲染进程
});
```

### 渲染进程发送消息示例：
```javascript
const { ipcRenderer } = require('electron');

// 发送消息到主进程
ipcRenderer.send('message-from-renderer', 'Hello from renderer!');

// 接收主进程回复
ipcRenderer.on('message-from-main', (event, arg) => {
  console.log(arg); // 打印主进程回复的消息
});
```

## 核心模块

Electron 提供了多个核心模块，用于实现各种功能：

### 1. app

- 控制应用生命周期
- 处理应用事件（启动、退出、激活等）
- 访问应用配置和路径

### 2. BrowserWindow

- 创建和管理浏览器窗口
- 控制窗口尺寸、位置、样式等
- 加载和显示 Web 内容

### 3. ipcMain / ipcRenderer

- 实现主进程和渲染进程间的通信
- 支持同步和异步消息传递

### 4. Menu

- 创建应用菜单和上下文菜单
- 定义菜单操作和快捷键

### 5. dialog

- 显示原生对话框（打开文件、保存文件、消息提示等）

### 6. webContents

- 控制浏览器窗口的 Web 页面
- 执行 JavaScript、修改 DOM、捕获屏幕截图等

### 7. shell

- 打开外部链接、文件和文件夹
- 执行命令行操作

## 应用生命周期

Electron 应用的典型生命周期：

1. **应用初始化**：`app` 模块发出 `ready` 事件
2. **创建窗口**：在 `ready` 事件处理程序中创建 `BrowserWindow`
3. **加载页面**：使用 `win.loadFile()` 或 `win.loadURL()` 加载内容
4. **窗口管理**：处理窗口事件（关闭、最小化、最大化等）
5. **应用退出**：处理 `window-all-closed` 事件和其他退出逻辑

## 安全考虑

在开发 Electron 应用时，需要注意以下安全问题：

- **禁用 Node.js 集成**：对于加载外部内容的渲染进程，应禁用 Node.js 集成
- **启用内容安全策略（CSP）**：限制脚本来源和执行方式
- **验证所有用户输入**：防止注入攻击
- **使用 contextIsolation**：将渲染器的上下文与预加载脚本隔离
- **避免使用 `allowRunningInsecureContent`**：不要允许不安全的内容在 HTTPS 页面上运行

## 快速开始

创建一个简单的 Electron 应用：

1. **初始化项目**：
```bash
mkdir my-electron-app && cd my-electron-app
npm init -y
npm install --save-dev electron
```

2. **创建文件结构**：
```
my-electron-app/
├── package.json
├── main.js
└── index.html
```

3. **更新 package.json**：
```json
{
  "name": "my-electron-app",
  "version": "1.0.0",
  "description": "My Electron application",
  "main": "main.js",
  "scripts": {
    "start": "electron ."
  },
  "devDependencies": {
    "electron": "^25.0.0"
  }
}
```

4. **创建 main.js**：
```javascript
const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');
  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
```

5. **创建 index.html**：
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Hello World!</title>
</head>
<body>
  <h1>Hello World!</h1>
  <p>Welcome to your Electron application.</p>
</body>
</html>
```

6. **运行应用**：
```bash
npm start
```

## 学习资源

- [Electron 官方文档](https://www.electronjs.org/docs)
- [Electron API 参考](https://www.electronjs.org/docs/api)
- [Electron GitHub 仓库](https://github.com/electron/electron)
- [Electron 示例应用](https://github.com/electron/electron-api-demos)

## 下一步

了解完核心概念后，建议继续学习：

1. [主进程和渲染进程](./../main-renderer-processes/)
2. [进程间通信](./../ipc-communication/)
3. [窗口管理](./../window-management/)

---

希望这份指南能帮助您理解Electron的核心概念和架构。继续探索其他目录以获取更详细的示例和最佳实践。

Happy Coding! 🚀