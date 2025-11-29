# Electron 进程间通信 (IPC)

本目录包含Electron中进程间通信的详细示例和说明，帮助您理解主进程和渲染进程之间如何进行数据交换和功能调用。

## IPC 通信概述

进程间通信(IPC, Inter-Process Communication)是Electron应用中的核心概念，它允许主进程和渲染进程之间相互发送消息和调用方法。Electron提供了多种IPC通信方式，以适应不同的通信需求。

## 主要的 IPC 模块

Electron提供了两个主要的IPC模块：

1. **ipcMain**：在主进程中使用，用于接收渲染进程发送的消息
2. **ipcRenderer**：在渲染进程中使用，用于向主进程发送消息和接收主进程的回复

## IPC 通信方式

### 1. 异步通信

异步通信是最常用的通信方式，不会阻塞主线程。

#### 渲染进程 -> 主进程

**渲染进程代码**：
```javascript
const { ipcRenderer } = require('electron');

// 发送消息到主进程
ipcRenderer.send('message-from-renderer', 'Hello from renderer!');

// 接收主进程的回复
ipcRenderer.on('reply-from-main', (event, arg) => {
  console.log('Received from main:', arg); // 输出: Received from main: Message received!
});
```

**主进程代码**：
```javascript
const { ipcMain } = require('electron');

// 监听渲染进程的消息
ipcMain.on('message-from-renderer', (event, arg) => {
  console.log('Received from renderer:', arg); // 输出: Received from renderer: Hello from renderer!
  
  // 回复渲染进程
  event.reply('reply-from-main', 'Message received!');
});
```

### 2. 同步通信

同步通信会阻塞渲染进程，直到收到主进程的回复。应谨慎使用，因为它可能导致UI卡顿。

**渲染进程代码**：
```javascript
const { ipcRenderer } = require('electron');

// 发送同步消息到主进程
const result = ipcRenderer.sendSync('sync-message', 'Hello synchronously!');
console.log('Sync response:', result); // 输出: Sync response: Sync message received!
```

**主进程代码**：
```javascript
const { ipcMain } = require('electron');

// 监听同步消息
ipcMain.on('sync-message', (event, arg) => {
  console.log('Received sync message:', arg); // 输出: Received sync message: Hello synchronously!
  
  // 设置返回值
  event.returnValue = 'Sync message received!';
});
```

### 3. 双向通信 (invoke/handle)

Electron 7.0+ 引入了更现代的基于 Promise 的双向通信方式，使用 `invoke` 和 `handle` 方法。

**渲染进程代码**：
```javascript
const { ipcRenderer } = require('electron');

async function getData() {
  try {
    // 发送请求并等待响应
    const result = await ipcRenderer.invoke('get-data', { id: 123 });
    console.log('Data received:', result);
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
}

// 调用函数
getData();
```

**主进程代码**：
```javascript
const { ipcMain } = require('electron');

// 处理来自渲染进程的invoke请求
ipcMain.handle('get-data', async (event, args) => {
  console.log('Request received:', args); // 输出: Request received: { id: 123 }
  
  // 模拟异步操作
  return new Promise((resolve, reject) => {
    // 模拟API调用或其他异步操作
    setTimeout(() => {
      // 返回数据
      resolve({
        id: args.id,
        name: 'Example Data',
        timestamp: new Date().toISOString()
      });
      
      // 如果出错，使用reject
      // reject(new Error('Operation failed'));
    }, 500);
  });
});
```

### 4. 从主进程到渲染进程

主进程也可以主动向渲染进程发送消息。

**主进程代码**：
```javascript
const { BrowserWindow } = require('electron');

// 假设已经创建了一个窗口实例
let mainWindow;

function sendToRenderer() {
  // 向特定窗口发送消息
  mainWindow.webContents.send('message-from-main', {
    action: 'update-status',
    status: 'completed',
    timestamp: new Date().toISOString()
  });
}
```

**渲染进程代码**：
```javascript
const { ipcRenderer } = require('electron');

// 监听主进程的消息
ipcRenderer.on('message-from-main', (event, arg) => {
  console.log('Message from main:', arg);
  
  // 根据消息类型执行不同操作
  if (arg.action === 'update-status') {
    updateStatusUI(arg.status, arg.timestamp);
  }
});

function updateStatusUI(status, timestamp) {
  // 更新UI
  document.getElementById('status').textContent = status;
  document.getElementById('timestamp').textContent = timestamp;
}
```

## 安全的 IPC 通信 (使用预加载脚本)

在现代Electron应用中，推荐使用预加载脚本和contextBridge来安全地暴露IPC功能给渲染进程。

### 预加载脚本示例

**preload.js**：
```javascript
const { contextBridge, ipcRenderer } = require('electron');

// 使用contextBridge安全地暴露API给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 发送消息到主进程
  sendMessage: (channel, data) => {
    // 验证频道名称，只允许预定义的频道
    const validChannels = ['toMain', 'save-data', 'load-data'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  
  // 监听来自主进程的消息
  onMessage: (channel, callback) => {
    const validChannels = ['fromMain', 'data-loaded', 'operation-complete'];
    if (validChannels.includes(channel)) {
      // 防止内存泄漏，返回取消监听的函数
      const subscription = (event, ...args) => callback(...args);
      ipcRenderer.on(channel, subscription);
      
      return () => ipcRenderer.removeListener(channel, subscription);
    }
  },
  
  // 使用invoke/handle API进行双向通信
  invoke: async (channel, data) => {
    const validChannels = ['get-app-info', 'perform-operation'];
    if (validChannels.includes(channel)) {
      return await ipcRenderer.invoke(channel, data);
    }
    throw new Error(`Invalid channel: ${channel}`);
  }
});
```

### 在主进程中配置预加载脚本

```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // 禁用Node.js集成
      nodeIntegration: false,
      // 启用上下文隔离
      contextIsolation: true,
      // 设置预加载脚本
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);
```

### 在渲染进程中使用暴露的API

```javascript
// 渲染进程中使用暴露的API

// 发送消息
window.electronAPI.sendMessage('save-data', { key: 'value' });

// 监听消息
const unsubscribe = window.electronAPI.onMessage('data-loaded', (data) => {
  console.log('Data received:', data);
  updateUI(data);
});

// 当组件卸载时取消订阅，防止内存泄漏
function cleanup() {
  unsubscribe();
}

// 使用invoke API
async function getAppInfo() {
  try {
    const info = await window.electronAPI.invoke('get-app-info');
    console.log('App info:', info);
    return info;
  } catch (error) {
    console.error('Error fetching app info:', error);
  }
}
```

## 高级 IPC 模式

### 1. 单向数据流

类似于React的单向数据流，确保应用状态变化可预测：

```javascript
// 主进程
ipcMain.on('action', (event, action) => {
  // 处理action
  switch(action.type) {
    case 'UPDATE_USER':
      // 更新用户数据
      updateUserData(action.payload);
      // 广播新状态给所有渲染进程
      broadcastState();
      break;
    // 其他action类型
  }
});

function broadcastState() {
  const allWindows = BrowserWindow.getAllWindows();
  allWindows.forEach(win => {
    win.webContents.send('state-update', currentState);
  });
}

// 渲染进程
ipcRenderer.on('state-update', (event, newState) => {
  // 更新本地状态
  setState(newState);
  // 重新渲染UI
  render();
});

// 触发action
function dispatch(action) {
  ipcRenderer.send('action', action);
}
```

### 2. 请求-响应模式封装

封装请求-响应模式，使其更易于使用：

**预加载脚本扩展**：
```javascript
contextBridge.exposeInMainWorld('electronAPI', {
  // ... 其他API
  
  // 封装请求-响应
  request: (endpoint, params = {}) => {
    return new Promise((resolve, reject) => {
      const requestId = Math.random().toString(36).substring(2, 15);
      
      // 监听特定请求的响应
      const listener = (event, response) => {
        if (response.requestId === requestId) {
          ipcRenderer.removeListener(`response:${endpoint}`, listener);
          
          if (response.success) {
            resolve(response.data);
          } else {
            reject(new Error(response.error || 'Request failed'));
          }
        }
      };
      
      ipcRenderer.on(`response:${endpoint}`, listener);
      
      // 发送请求
      ipcRenderer.send(`request:${endpoint}`, {
        requestId,
        ...params
      });
      
      // 设置超时
      setTimeout(() => {
        ipcRenderer.removeListener(`response:${endpoint}`, listener);
        reject(new Error('Request timeout'));
      }, 10000); // 10秒超时
    });
  }
});
```

**主进程处理**：
```javascript
// 统一请求处理函数
function handleRequest(endpoint, handler) {
  ipcMain.on(`request:${endpoint}`, async (event, request) => {
    try {
      const result = await handler(request);
      event.reply(`response:${endpoint}`, {
        requestId: request.requestId,
        success: true,
        data: result
      });
    } catch (error) {
      event.reply(`response:${endpoint}`, {
        requestId: request.requestId,
        success: false,
        error: error.message
      });
    }
  });
}

// 注册请求处理
handleRequest('get-user-data', async (request) => {
  // 获取用户数据的逻辑
  const userData = await fetchUserData(request.userId);
  return userData;
});

handleRequest('save-settings', async (request) => {
  // 保存设置的逻辑
  await saveUserSettings(request.settings);
  return { success: true };
});
```

**渲染进程使用**：
```javascript
async function loadUserData(userId) {
  try {
    const userData = await window.electronAPI.request('get-user-data', { userId });
    console.log('User data loaded:', userData);
    return userData;
  } catch (error) {
    console.error('Failed to load user data:', error);
    showErrorMessage(error.message);
  }
}
```

## IPC 通信最佳实践

1. **使用验证和类型检查**：总是验证收到的消息格式和内容
2. **限制IPC频道**：只暴露必要的IPC功能，避免过度暴露
3. **优先使用异步通信**：避免使用同步通信导致UI卡顿
4. **使用contextBridge**：在预加载脚本中使用contextBridge安全地暴露API
5. **实现超时机制**：为异步请求设置合理的超时时间
6. **错误处理**：在所有IPC通信中实现适当的错误处理
7. **内存管理**：确保移除不再需要的事件监听器，防止内存泄漏
8. **性能考虑**：避免频繁发送大量数据，考虑批量处理

## 常见问题与解决方案

### 1. 消息未被接收

**问题**：发送的消息未被接收或处理

**解决方案**：
- 检查频道名称是否完全匹配
- 确认监听器是否在消息发送前已注册
- 验证窗口是否已创建且webContents可用
- 检查是否有语法或逻辑错误导致处理失败

### 2. 内存泄漏

**问题**：频繁创建和销毁渲染进程导致内存泄漏

**解决方案**：
- 总是在组件卸载或窗口关闭时移除事件监听器
- 使用removeListener()或removeAllListeners()移除监听器
- 在预加载脚本中提供取消订阅的机制

### 3. 安全警告

**问题**：Electron显示IPC安全警告

**解决方案**：
- 启用contextIsolation和禁用nodeIntegration
- 使用预加载脚本和contextBridge
- 限制可访问的IPC频道
- 添加输入验证

## 学习资源

- [Electron IPC 文档](https://www.electronjs.org/docs/api/ipc-main)
- [安全通信最佳实践](https://www.electronjs.org/docs/tutorial/security#3-enable-context-isolation-for-remote-content)
- [IPC 教程](https://www.electronjs.org/docs/tutorial/ipc)

## 下一步

了解完IPC通信后，建议继续学习：

1. [窗口管理](./../window-management/)
2. [菜单和对话框](./../menus-dialogs/)

---

希望这些示例和说明能帮助您理解和实现Electron中的进程间通信。继续探索其他目录以获取更多高级功能和最佳实践。

Happy Coding! 🚀