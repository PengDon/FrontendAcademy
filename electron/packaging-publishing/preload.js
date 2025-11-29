// Electron预加载脚本
// 此文件用于安全地暴露IPC通信和原生功能给渲染进程

const { contextBridge, ipcRenderer, shell } = require('electron');
const fs = require('fs');
const path = require('path');

// 定义IPC通信API
const ipcAPI = {
  // 事件监听
  on: (channel, callback) => {
    // 白名单检查，只允许安全的通信通道
    const validChannels = [
      'update-available',
      'update-not-available',
      'update-error', 
      'update-progress',
      'window-focused',
      'app-version-updated'
    ];
    
    if (validChannels.includes(channel)) {
      // 确保回调是函数类型
      if (typeof callback === 'function') {
        const subscription = (event, ...args) => callback(...args);
        ipcRenderer.on(channel, subscription);
        
        // 返回取消订阅的函数
        return () => ipcRenderer.removeListener(channel, subscription);
      }
      console.warn(`IPC回调必须是函数类型，接收到: ${typeof callback}`);
    } else {
      console.warn(`尝试监听未授权的IPC通道: ${channel}`);
    }
    
    // 返回空的取消订阅函数作为后备
    return () => {};
  },
  
  // 一次性事件监听
  once: (channel, callback) => {
    const validChannels = [
      'update-available',
      'update-not-available',
      'update-error',
      'update-progress',
      'window-focused'
    ];
    
    if (validChannels.includes(channel) && typeof callback === 'function') {
      ipcRenderer.once(channel, (event, ...args) => callback(...args));
      return () => ipcRenderer.removeAllListeners(channel);
    }
    return () => {};
  },
  
  // 发送同步消息
  sendSync: (channel, ...args) => {
    const validChannels = [
      'get-app-info'
    ];
    
    if (validChannels.includes(channel)) {
      return ipcRenderer.sendSync(channel, ...args);
    }
    console.warn(`尝试发送同步消息到未授权的IPC通道: ${channel}`);
    return null;
  },
  
  // 发送异步消息
  send: (channel, ...args) => {
    const validChannels = [
      'check-for-updates',
      'show-notification',
      'open-external-link',
      'window-control',
      'new-file',
      'open-file',
      'save-file',
      'view-logs'
    ];
    
    if (validChannels.includes(channel)) {
      return ipcRenderer.send(channel, ...args);
    }
    console.warn(`尝试发送消息到未授权的IPC通道: ${channel}`);
  },
  
  // 发送消息并等待回应
  invoke: async (channel, ...args) => {
    const validChannels = [
      'open-dialog',
      'get-logs'
    ];
    
    if (validChannels.includes(channel)) {
      try {
        return await ipcRenderer.invoke(channel, ...args);
      } catch (error) {
        console.error(`IPC调用失败 (${channel}):`, error);
        throw error;
      }
    }
    console.warn(`尝试调用未授权的IPC通道: ${channel}`);
    throw new Error(`未授权的IPC通道: ${channel}`);
  }
};

// 对话框API
const dialogAPI = {
  // 打开文件对话框
  showOpenDialog: async (options = {}) => {
    try {
      return await ipcRenderer.invoke('open-dialog', 'openFile', {
        title: options.title || '打开文件',
        defaultPath: options.defaultPath,
        buttonLabel: options.buttonLabel,
        filters: options.filters || [],
        properties: options.properties || ['openFile'],
        message: options.message,
        securityScopedBookmarks: options.securityScopedBookmarks || false
      });
    } catch (error) {
      console.error('打开文件对话框失败:', error);
      throw error;
    }
  },
  
  // 保存文件对话框
  showSaveDialog: async (options = {}) => {
    try {
      return await ipcRenderer.invoke('open-dialog', 'saveFile', {
        title: options.title || '保存文件',
        defaultPath: options.defaultPath,
        buttonLabel: options.buttonLabel,
        filters: options.filters || [],
        nameFieldLabel: options.nameFieldLabel,
        showsTagField: options.showsTagField !== undefined ? options.showsTagField : true
      });
    } catch (error) {
      console.error('保存文件对话框失败:', error);
      throw error;
    }
  },
  
  // 消息对话框
  showMessageBox: async (options = {}) => {
    try {
      return await ipcRenderer.invoke('open-dialog', 'messageBox', {
        title: options.title || '',
        message: options.message || '',
        detail: options.detail,
        buttons: options.buttons || ['确定'],
        defaultId: options.defaultId || 0,
        cancelId: options.cancelId,
        type: options.type || 'info',
        icon: options.icon,
        normalizeAccessKeys: options.normalizeAccessKeys !== undefined ? options.normalizeAccessKeys : true
      });
    } catch (error) {
      console.error('显示消息对话框失败:', error);
      throw error;
    }
  }
};

// 窗口控制API
const windowAPI = {
  // 窗口控制操作
  control: (action) => {
    const validActions = ['minimize', 'maximize', 'close', 'fullscreen'];
    if (validActions.includes(action)) {
      ipcRenderer.send('window-control', action);
    } else {
      console.warn(`无效的窗口控制操作: ${action}`);
    }
  },
  
  // 获取窗口状态
  getState: () => {
    // 通过同步IPC获取窗口状态
    const appInfo = ipcRenderer.sendSync('get-app-info');
    return {
      isDev: appInfo.isDev
    };
  }
};

// 自动更新API
const updateAPI = {
  // 检查更新
  checkForUpdates: () => {
    ipcRenderer.send('check-for-updates');
  },
  
  // 监听更新事件
  onUpdateAvailable: (callback) => {
    return ipcAPI.on('update-available', callback);
  },
  
  onUpdateNotAvailable: (callback) => {
    return ipcAPI.on('update-not-available', callback);
  },
  
  onUpdateError: (callback) => {
    return ipcAPI.on('update-error', callback);
  },
  
  onUpdateProgress: (callback) => {
    return ipcAPI.on('update-progress', callback);
  }
};

// 应用信息API
const appAPI = {
  // 获取应用信息
  getInfo: () => {
    return ipcRenderer.sendSync('get-app-info');
  },
  
  // 显示通知
  showNotification: (title, body) => {
    if (typeof title === 'string' && typeof body === 'string') {
      ipcRenderer.send('show-notification', title, body);
      return true;
    }
    console.warn('通知参数必须是字符串');
    return false;
  },
  
  // 打开外部链接
  openExternalLink: (url) => {
    try {
      // 验证URL格式
      const urlObj = new URL(url);
      if (['http:', 'https:'].includes(urlObj.protocol)) {
        ipcRenderer.send('open-external-link', url);
        return true;
      }
      console.warn('只允许打开HTTP/HTTPS链接');
      return false;
    } catch (error) {
      console.error('无效的URL:', error);
      return false;
    }
  },
  
  // 获取日志
  getLogs: async () => {
    try {
      return await ipcRenderer.invoke('get-logs');
    } catch (error) {
      console.error('获取日志失败:', error);
      return '';
    }
  },
  
  // 文件操作（仅用于示例，实际应用应在主进程处理文件操作）
  fileOperations: {
    // 获取应用数据目录
    getAppDataPath: () => {
      // 注意：实际应用中，敏感路径信息不应直接暴露给渲染进程
      // 这里仅用于演示
      return ipcRenderer.sendSync('get-app-info').appDataPath;
    }
  }
};

// 文件操作API（有限的安全文件操作）
const fileSystemAPI = {
  // 读取文件（仅允许在特定目录内）
  readFile: async (filePath) => {
    // 注意：在实际应用中，文件操作应严格限制在安全目录内
    // 这里仅作为演示，实际实现应在主进程中处理
    console.warn('文件操作API仅供演示，生产环境应在主进程处理文件操作');
    return null;
  },
  
  // 写文件（仅允许在特定目录内）
  writeFile: async (filePath, content) => {
    // 注意：在实际应用中，文件操作应严格限制在安全目录内
    console.warn('文件操作API仅供演示，生产环境应在主进程处理文件操作');
    return false;
  }
};

// 安全地暴露API给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // IPC通信基础API
  ipc: ipcAPI,
  
  // 对话框相关API
  dialog: dialogAPI,
  
  // 窗口控制API
  window: windowAPI,
  
  // 自动更新API
  update: updateAPI,
  
  // 应用信息API
  app: appAPI,
  
  // 文件系统API（有限）
  fs: fileSystemAPI,
  
  // 打开外部链接
  openExternal: (url) => {
    try {
      const urlObj = new URL(url);
      if (['http:', 'https:', 'mailto:', 'tel:'].includes(urlObj.protocol)) {
        return shell.openExternal(url).then(() => true).catch(() => false);
      }
      console.warn(`不支持的URL协议: ${urlObj.protocol}`);
      return Promise.resolve(false);
    } catch (error) {
      console.error('无效的URL:', error);
      return Promise.resolve(false);
    }
  }
});

// 定义全局类型（用于TypeScript）
contextBridge.exposeInMainWorld('__TYPES__', {
  isElectron: true,
  version: '1.0.0'
});

// 日志初始化信息
console.log('Electron预加载脚本已加载');

// 安全上下文检测
if (!process.contextIsolated) {
  console.error('警告: 上下文隔离未启用，这可能导致安全风险');
}

// 防止原型污染的安全检查
if (Object.prototype.__proto__ !== null) {
  console.warn('检测到潜在的原型污染风险');
}

// 初始化完成通知
if (typeof window !== 'undefined') {
  // 通知渲染进程预加载完成
  window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM已加载，预加载API可用');
    
    // 创建自定义事件通知预加载完成
    const preloadDoneEvent = new CustomEvent('electron-preload-done', {
      detail: {
        version: '1.0.0',
        timestamp: Date.now()
      }
    });
    window.dispatchEvent(preloadDoneEvent);
  });
}

// 安全注意事项：
// 1. 永远不要通过contextBridge暴露Node.js模块直接给渲染进程
// 2. 所有IPC通道必须在白名单中明确列出
// 3. 验证所有输入参数的类型和格式
// 4. 限制文件系统访问范围
// 5. 避免在渲染进程中执行敏感操作
// 6. 使用同步IPC时要谨慎，可能导致性能问题
// 7. 始终监听和处理错误情况
// 8. 为API提供清晰的文档和使用说明
// 9. 定期审查预加载脚本中的安全问题
// 10. 考虑使用Content-Security-Policy限制渲染进程的功能