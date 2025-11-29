# Electron 主进程和渲染进程

本目录包含Electron主进程和渲染进程的详细示例和说明，帮助您深入理解两者的区别、职责和工作方式。

## 主进程与渲染进程的区别

| 特性 | 主进程 | 渲染进程 |
|------|--------|----------|
| 入口点 | `main.js` | 通过`BrowserWindow`加载的HTML页面 |
| 数量 | 只有一个 | 每个窗口一个 |
| 功能 | 创建窗口、管理应用生命周期、访问系统功能 | 渲染Web内容、处理用户交互 |
| Node.js访问 | 默认完全支持 | 需要配置启用 |
| Electron API | 可访问所有API | 只能访问一部分API |

## 主进程示例

### 1. 基本主进程设置

`main.js` 是Electron应用的入口点，负责创建窗口和管理应用生命周期：

```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

// 保持对窗口对象的全局引用，防止JavaScript垃圾回收
let mainWindow;

function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // 允许渲染进程使用Node.js
      nodeIntegration: true,
      // 禁用上下文隔离
      contextIsolation: false
    }
  });

  // 加载应用的index.html
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    })
  );

  // 打开开发者工具
  mainWindow.webContents.openDevTools();

  // 当窗口关闭时触发的事件
  mainWindow.on('closed', () => {
    // 取消引用窗口对象，通常当有多个窗口时，会存储在数组中
    mainWindow = null;
  });
}

// Electron完成初始化并准备创建浏览器窗口时会触发
app.on('ready', createWindow);

// 关闭所有窗口时退出应用
app.on('window-all-closed', () => {
  // 在macOS上，应用通常会保持活动状态，直到用户明确按Cmd + Q退出
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // 在macOS上，点击dock图标且没有其他窗口打开时，通常会重新创建一个窗口
  if (mainWindow === null) {
    createWindow();
  }
});
```

### 2. 多窗口应用

创建多个窗口的主进程示例：

```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');

// 存储所有窗口的引用
let windows = [];

function createMainWindow() {
  // 创建主窗口
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: '主窗口',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile('index.html');
  windows.push(mainWindow);

  // 窗口关闭时从数组中移除
  mainWindow.on('closed', () => {
    windows = windows.filter(win => win !== mainWindow);
  });
  
  return mainWindow;
}

function createAboutWindow() {
  // 创建关于窗口
  const aboutWindow = new BrowserWindow({
    width: 400,
    height: 300,
    title: '关于',
    parent: windows[0], // 设置父窗口
    modal: true, // 模态窗口
    show: false, // 创建时不显示
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  aboutWindow.loadFile('about.html');
  windows.push(aboutWindow);

  // 窗口关闭时从数组中移除
  aboutWindow.on('closed', () => {
    windows = windows.filter(win => win !== aboutWindow);
  });
  
  return aboutWindow;
}

// 当Electron完成初始化时创建主窗口
app.whenReady().then(() => {
  createMainWindow();

  // 监听应用激活事件（macOS）
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

// 监听所有窗口关闭事件
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
```

## 渲染进程示例

### 1. 基本渲染进程

`index.html` 是典型的渲染进程入口点：

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Hello World!</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 20px;
    }
    h1 {
      color: #333;
    }
  </style>
</head>
<body>
  <h1>Hello Electron!</h1>
  <p>这是在渲染进程中运行的内容</p>
  <button id="aboutBtn">关于</button>
  <div id="info"></div>

  <script>
    // 渲染进程代码
    const { ipcRenderer } = require('electron');
    
    // 获取系统信息
    document.getElementById('info').innerText = `当前环境: ${process.platform}`;
    
    // 按钮点击事件
    document.getElementById('aboutBtn').addEventListener('click', () => {
      // 向主进程发送消息打开关于窗口
      ipcRenderer.send('open-about-window');
    });
  </script>
</body>
</html>
```

### 2. 使用预加载脚本

现代Electron应用推荐使用预加载脚本，而不是直接启用Node.js集成：

**preload.js**
```javascript
const { contextBridge, ipcRenderer } = require('electron');

// 使用contextBridge安全地暴露API给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 发送消息到主进程
  sendMessage: (message) => ipcRenderer.send('message-from-renderer', message),
  // 接收主进程消息
  onResponse: (callback) => ipcRenderer.on('response-from-main', (event, ...args) => callback(...args)),
  // 打开关于窗口
  openAboutWindow: () => ipcRenderer.send('open-about-window')
});
```

**更新main.js的webPreferences部分**
```javascript
webPreferences: {
  // 禁用Node.js集成
  nodeIntegration: false,
  // 启用上下文隔离
  contextIsolation: true,
  // 设置预加载脚本
  preload: path.join(__dirname, 'preload.js')
}
```

**更新渲染进程HTML**
```html
<script>
  // 现在使用暴露的API而不是直接require
  document.getElementById('aboutBtn').addEventListener('click', () => {
    window.electronAPI.openAboutWindow();
  });
  
  // 发送消息示例
  window.electronAPI.sendMessage('Hello from renderer');
  
  // 监听响应
  window.electronAPI.onResponse((data) => {
    console.log('Received from main:', data);
  });
</script>
```

## 安全最佳实践

### 1. 使用预加载脚本而非直接启用Node.js

```javascript
// 不推荐
const mainWindow = new BrowserWindow({
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false
  }
});

// 推荐
const mainWindow = new BrowserWindow({
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    preload: path.join(__dirname, 'preload.js')
  }
});
```

### 2. 定义内容安全策略（CSP）

在HTML文件头部添加CSP：

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'">
```

### 3. 验证所有IPC消息

在主进程中验证收到的消息：

```javascript
ipcMain.on('message-from-renderer', (event, data) => {
  // 验证数据
  if (typeof data !== 'string') {
    console.error('Invalid data type');
    return;
  }
  
  // 处理消息
  console.log('Valid message received:', data);
});
```

## 常见问题与解决方案

### 1. 渲染进程无法访问Node.js模块

**问题**：`require is not defined` 错误

**解决方案**：
- 使用预加载脚本和contextBridge
- 或在特定情况下启用nodeIntegration（不推荐用于生产环境）

### 2. 进程间通信失效

**问题**：消息未被正确发送或接收

**解决方案**：
- 检查事件名称是否匹配
- 确保正确使用了ipcMain和ipcRenderer
- 验证是否在contextBridge中正确暴露了API

### 3. 应用窗口空白

**问题**：窗口打开但内容不显示

**解决方案**：
- 检查HTML文件路径是否正确
- 查看控制台错误（`Ctrl+Shift+I`）
- 确认没有阻塞渲染的JavaScript错误

## 高级示例

### 渲染进程中使用Vue.js

以下是在Electron中集成Vue.js的示例：

**preload.js**
```javascript
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // 暴露需要的API
  systemInfo: () => {
    return {
      platform: process.platform,
      version: process.version
    };
  },
  // 双向通信
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args)
});
```

**Vue组件示例**
```vue
<template>
  <div>
    <h1>Electron + Vue</h1>
    <p>平台: {{ platform }}</p>
    <button @click="getAppInfo">获取应用信息</button>
    <div v-if="appInfo">应用版本: {{ appInfo.version }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      platform: '',
      appInfo: null
    };
  },
  mounted() {
    // 使用预加载脚本中暴露的API
    this.platform = window.electronAPI.systemInfo().platform;
  },
  methods: {
    async getAppInfo() {
      try {
        this.appInfo = await window.electronAPI.invoke('get-app-info');
      } catch (error) {
        console.error('获取应用信息失败:', error);
      }
    }
  }
};
</script>
```

**主进程中处理invoke请求**
```javascript
const { app, ipcMain } = require('electron');

// 处理渲染进程的invoke请求
ipcMain.handle('get-app-info', () => {
  return {
    name: app.name,
    version: app.getVersion(),
    electronVersion: process.versions.electron
  };
});
```

## 学习资源

- [Electron 进程模型文档](https://www.electronjs.org/docs/tutorial/process-model)
- [安全最佳实践](https://www.electronjs.org/docs/tutorial/security)
- [IPC 通信文档](https://www.electronjs.org/docs/api/ipc-main)

## 下一步

了解完主进程和渲染进程后，建议继续学习：

1. [进程间通信](./../ipc-communication/)
2. [窗口管理](./../window-management/)

---

希望这些示例和说明能帮助您深入理解Electron的主进程和渲染进程。继续探索其他目录以获取更多高级功能和最佳实践。

Happy Coding! 🚀