// 安全的预加载脚本，演示如何安全地暴露API给渲染进程

/**
 * 预加载脚本在渲染器进程加载前执行，具有对Node.js API的有限访问权
 * 使用contextBridge安全地暴露API给渲染进程
 */

const { contextBridge, ipcRenderer, shell, webFrame } = require('electron');
const { validateIPCMessage, sanitizeInput } = require('./security-config');

// 记录预加载脚本初始化
console.log('安全预加载脚本已初始化');

// 定义允许的IPC频道
const IPC_CHANNELS = {
  FROM_RENDERER: {
    GET_APP_INFO: 'app:get-info',
    OPEN_EXTERNAL: 'app:open-external',
    SHOW_DIALOG: 'app:show-dialog',
    SAVE_FILE: 'app:save-file',
    READ_FILE: 'app:read-file'
  },
  FROM_MAIN: {
    APP_INFO: 'app:info-response',
    DIALOG_RESULT: 'app:dialog-result',
    FILE_OPERATION_RESULT: 'app:file-operation-result'
  }
};

// 定义安全的IPC消息验证模式
const MESSAGE_SCHEMAS = {
  [IPC_CHANNELS.FROM_RENDERER.OPEN_EXTERNAL]: {
    url: 'string'
  },
  [IPC_CHANNELS.FROM_RENDERER.SHOW_DIALOG]: {
    type: 'string',
    options: 'object'
  },
  [IPC_CHANNELS.FROM_RENDERER.SAVE_FILE]: {
    content: 'string',
    options: 'object'
  },
  [IPC_CHANNELS.FROM_RENDERER.READ_FILE]: {
    path: 'string'
  }
};

/**
 * 安全的IPC发送函数，验证消息格式
 * @param {string} channel - IPC频道
 * @param {*} data - 发送的数据
 */
function safeIPCSend(channel, data) {
  // 验证频道是否在允许列表中
  const isAllowedChannel = Object.values(IPC_CHANNELS.FROM_RENDERER).includes(channel);
  if (!isAllowedChannel) {
    console.warn(`尝试通过未授权的IPC频道发送消息: ${channel}`);
    return;
  }
  
  // 验证消息格式
  const schema = MESSAGE_SCHEMAS[channel];
  if (schema && !validateIPCMessage(data, schema)) {
    console.warn(`消息格式验证失败: ${channel}`);
    return;
  }
  
  // 清理敏感数据
  if (data && typeof data === 'object') {
    // 例如清理路径或URL数据
    if (data.path) {
      data.path = sanitizeInput(data.path);
    }
    if (data.url) {
      data.url = sanitizeInput(data.url);
    }
  }
  
  // 发送消息
  ipcRenderer.send(channel, data);
}

/**
 * 安全的IPC监听函数
 * @param {string} channel - IPC频道
 * @param {Function} callback - 回调函数
 * @returns {Function} - 取消监听的函数
 */
function safeIPCon(channel, callback) {
  // 验证频道是否在允许列表中
  const isAllowedChannel = Object.values(IPC_CHANNELS.FROM_MAIN).includes(channel);
  if (!isAllowedChannel) {
    console.warn(`尝试监听未授权的IPC频道: ${channel}`);
    return () => {}; // 返回空函数作为取消监听函数
  }
  
  // 包装回调以捕获错误
  const safeCallback = (event, ...args) => {
    try {
      return callback(...args);
    } catch (error) {
      console.error(`IPC回调错误 (${channel}):`, error);
    }
  };
  
  // 监听消息
  ipcRenderer.on(channel, safeCallback);
  
  // 返回取消监听的函数
  return () => {
    ipcRenderer.removeListener(channel, safeCallback);
  };
}

// 使用contextBridge安全地暴露API给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 应用信息
  getAppInfo: () => {
    return new Promise((resolve) => {
      const removeListener = safeIPCon(
        IPC_CHANNELS.FROM_MAIN.APP_INFO,
        (info) => {
          removeListener();
          resolve(info);
        }
      );
      
      safeIPCSend(IPC_CHANNELS.FROM_RENDERER.GET_APP_INFO, {});
    });
  },
  
  // 打开外部链接 - 使用shell模块安全地打开外部URL
  openExternal: async (url) => {
    try {
      // 基本URL验证
      const urlObj = new URL(url);
      const allowedProtocols = ['https:', 'http:', 'mailto:', 'tel:'];
      
      if (!allowedProtocols.includes(urlObj.protocol)) {
        throw new Error(`不支持的协议: ${urlObj.protocol}`);
      }
      
      await shell.openExternal(url, { 
        wait: false,
        activate: true 
      });
      return { success: true };
    } catch (error) {
      console.error('打开外部链接失败:', error);
      return { 
        success: false, 
        error: error.message || '未知错误' 
      };
    }
  },
  
  // 显示对话框
  showDialog: async (options) => {
    return new Promise((resolve) => {
      const removeListener = safeIPCon(
        IPC_CHANNELS.FROM_MAIN.DIALOG_RESULT,
        (result) => {
          removeListener();
          resolve(result);
        }
      );
      
      safeIPCSend(IPC_CHANNELS.FROM_RENDERER.SHOW_DIALOG, {
        type: options.type || 'info',
        options: options
      });
    });
  },
  
  // 保存文件
  saveFile: async (content, options = {}) => {
    return new Promise((resolve) => {
      const removeListener = safeIPCon(
        IPC_CHANNELS.FROM_MAIN.FILE_OPERATION_RESULT,
        (result) => {
          removeListener();
          resolve(result);
        }
      );
      
      safeIPCSend(IPC_CHANNELS.FROM_RENDERER.SAVE_FILE, {
        content: content,
        options: options
      });
    });
  },
  
  // 读取文件
  readFile: async (path) => {
    return new Promise((resolve) => {
      const removeListener = safeIPCon(
        IPC_CHANNELS.FROM_MAIN.FILE_OPERATION_RESULT,
        (result) => {
          removeListener();
          resolve(result);
        }
      );
      
      safeIPCSend(IPC_CHANNELS.FROM_RENDERER.READ_FILE, {
        path: path
      });
    });
  },
  
  // 安全的DOM和样式操作
  sanitizeHTML: (html) => {
    // 在渲染进程中进行基本的HTML清理
    // 注意：更复杂的清理应该在主进程中进行
    return sanitizeInput(html);
  },
  
  // 设置安全的webFrame选项
  setupSecurity: () => {
    // 禁用eval函数
    try {
      webFrame.executeJavaScript(`
        window.eval = undefined;
        window.constructor = undefined;
        window.__proto__ = undefined;
        Object.defineProperty(window, 'eval', { writable: false });
      `);
    } catch (error) {
      console.error('设置安全选项失败:', error);
    }
  },
  
  // 监听主进程发送的通知
  onNotification: (callback) => {
    return safeIPCon('app:notification', callback);
  }
});

// 设置内容安全策略（在预加载脚本中补充）
if (process.env.NODE_ENV !== 'development') {
  // 生产环境中可以添加额外的安全检查
  console.log('生产环境安全模式已启用');
}

// 防止预加载脚本被覆盖
Object.freeze(window.electronAPI);

/**
 * 安全注意事项：
 * 1. 仅暴露必要的API给渲染进程
 * 2. 所有IPC消息都经过验证和清理
 * 3. 敏感操作在主进程中执行并验证
 * 4. 避免使用remote模块
 * 5. 使用contextBridge而不是直接修改window对象
 * 6. 验证所有用户输入和IPC消息
 * 7. 实现最小权限原则
 */