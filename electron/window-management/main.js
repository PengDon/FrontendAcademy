const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const path = require('path');
const fs = require('fs');

// 导入窗口管理相关模块
const basicWindowModule = require('./basic-window');
const multiWindowModule = require('./multi-window');

// 存储窗口引用，防止被垃圾回收
let mainWindow = null;
let secondaryWindows = new Map();

// 窗口配置
const windowSettings = {
  main: {
    title: 'Electron 窗口管理示例',
    width: 1000,
    height: 800,
    minWidth: 600,
    minHeight: 400,
  },
  secondary: {
    width: 600,
    height: 400,
  },
  modal: {
    width: 500,
    height: 300,
  },
  large: {
    width: 1000,
    height: 700,
  },
  small: {
    width: 400,
    height: 300,
  }
};

// 窗口状态持久化相关配置
const WINDOW_STATE_FILE = path.join(app.getPath('userData'), 'window-state.json');

// 保存窗口状态
function saveWindowState(window) {
  if (!window) return;
  
  try {
    const bounds = window.getBounds();
    const isMaximized = window.isMaximized();
    
    const state = {
      bounds,
      isMaximized,
      timestamp: new Date().toISOString()
    };
    
    fs.writeFileSync(WINDOW_STATE_FILE, JSON.stringify(state));
    console.log('窗口状态已保存:', state);
  } catch (error) {
    console.error('保存窗口状态失败:', error);
  }
}

// 加载窗口状态
function loadWindowState() {
  try {
    if (!fs.existsSync(WINDOW_STATE_FILE)) return null;
    
    const data = fs.readFileSync(WINDOW_STATE_FILE, 'utf8');
    const state = JSON.parse(data);
    
    // 检查状态是否有效（例如：显示器配置可能已更改）
    if (state && state.bounds) {
      return state;
    }
    
    return null;
  } catch (error) {
    console.error('加载窗口状态失败:', error);
    return null;
  }
}

// 创建主窗口
function createMainWindow() {
  // 尝试加载上次的窗口状态
  const savedState = loadWindowState();
  
  // 合并保存的状态和默认配置
  const windowConfig = {
    ...windowSettings.main,
    ...(savedState?.bounds || {}),
    show: false, // 先不显示，等窗口准备好了再显示
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false, // 禁用Node.js集成，增强安全性
      contextIsolation: true, // 启用上下文隔离，增强安全性
      sandbox: true, // 启用沙盒，增强安全性
      enableRemoteModule: false, // 禁用remote模块，使用ipcMain替代
    },
    backgroundColor: '#f5f5f5', // 设置背景色，改善启动体验
    icon: path.join(__dirname, 'assets', 'icon.png'), // 如果有图标，可以设置
  };
  
  // 创建窗口实例
  mainWindow = new BrowserWindow(windowConfig);
  
  // 窗口准备好后显示
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // 如果保存的状态是最大化，则恢复最大化状态
    if (savedState?.isMaximized) {
      mainWindow.maximize();
    }
    
    console.log('主窗口已显示');
  });
  
  // 加载主页面
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  
  // 设置窗口事件处理
  setupMainWindowEvents();
  
  return mainWindow;
}

// 设置主窗口事件处理
function setupMainWindowEvents() {
  if (!mainWindow) return;
  
  // 窗口关闭前保存状态
  mainWindow.on('close', () => {
    saveWindowState(mainWindow);
    console.log('主窗口即将关闭');
  });
  
  // 窗口关闭时清理资源
  mainWindow.on('closed', () => {
    console.log('主窗口已关闭');
    mainWindow = null;
    // 当主窗口关闭时，关闭所有辅助窗口
    closeAllSecondaryWindows();
  });
  
  // 窗口焦点变化事件
  mainWindow.on('focus-changed', (event, isFocused) => {
    console.log('主窗口焦点变化:', isFocused ? '获得焦点' : '失去焦点');
    // 通知所有渲染进程焦点变化
    broadcastWindowState();
  });
  
  // 窗口最大化变化事件
  mainWindow.on('maximize', () => {
    console.log('主窗口已最大化');
    broadcastWindowState();
  });
  
  mainWindow.on('unmaximize', () => {
    console.log('主窗口已恢复');
    broadcastWindowState();
  });
  
  // 窗口全屏变化事件
  mainWindow.on('enter-full-screen', () => {
    console.log('主窗口进入全屏模式');
    broadcastWindowState();
  });
  
  mainWindow.on('leave-full-screen', () => {
    console.log('主窗口退出全屏模式');
    broadcastWindowState();
  });
  
  // 窗口尺寸变化事件
  mainWindow.on('resized', () => {
    console.log('主窗口尺寸已调整');
    // 定期保存窗口状态，但避免过于频繁
    saveWindowState(mainWindow);
  });
  
  // 窗口位置变化事件
  mainWindow.on('moved', () => {
    console.log('主窗口位置已调整');
    // 定期保存窗口状态，但避免过于频繁
    saveWindowState(mainWindow);
  });
}

// 创建辅助窗口
function createSecondaryWindow(options = {}) {
  // 合并默认配置和用户选项
  const windowConfig = {
    ...windowSettings.secondary,
    ...options,
    parent: options.modal ? mainWindow : null, // 如果是模态窗口，设置父窗口
    modal: options.modal || false,
    show: false, // 先不显示，等窗口准备好了再显示
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  };
  
  // 创建辅助窗口实例
  const secondaryWindow = new BrowserWindow(windowConfig);
  
  // 生成唯一ID
  const windowId = secondaryWindow.id;
  
  // 将窗口引用存储在Map中
  secondaryWindows.set(windowId, secondaryWindow);
  
  // 窗口准备好后显示
  secondaryWindow.once('ready-to-show', () => {
    secondaryWindow.show();
    console.log(`辅助窗口 ${windowId} 已显示`);
    broadcastWindowState(); // 广播窗口状态变化
  });
  
  // 设置窗口事件处理
  setupSecondaryWindowEvents(secondaryWindow, windowId);
  
  // 加载页面 - 这里可以根据需要加载不同页面
  if (options.url) {
    secondaryWindow.loadURL(options.url);
  } else {
    // 如果没有提供URL，使用主页面但修改标题以区分
    secondaryWindow.loadFile(path.join(__dirname, 'index.html'));
  }
  
  return secondaryWindow;
}

// 设置辅助窗口事件处理
function setupSecondaryWindowEvents(window, windowId) {
  // 窗口关闭时清理引用
  window.on('closed', () => {
    console.log(`辅助窗口 ${windowId} 已关闭`);
    secondaryWindows.delete(windowId);
    broadcastWindowState(); // 广播窗口状态变化
  });
  
  // 窗口焦点变化事件
  window.on('focus-changed', (event, isFocused) => {
    console.log(`辅助窗口 ${windowId} 焦点变化:`, isFocused ? '获得焦点' : '失去焦点');
    broadcastWindowState();
  });
}

// 关闭所有辅助窗口
function closeAllSecondaryWindows() {
  console.log('关闭所有辅助窗口');
  secondaryWindows.forEach((window, id) => {
    if (window && !window.isDestroyed()) {
      window.close();
    }
  });
  secondaryWindows.clear();
  broadcastWindowState(); // 广播窗口状态变化
}

// 广播窗口状态到所有渲染进程
function broadcastWindowState() {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  
  // 构建窗口状态信息
  const windowState = {
    mainWindow: {
      focused: mainWindow.isFocused(),
      maximized: mainWindow.isMaximized(),
      fullscreen: mainWindow.isFullScreen(),
      visible: mainWindow.isVisible(),
    },
    secondaryWindows: Array.from(secondaryWindows.keys()),
    windowCount: 1 + secondaryWindows.size, // 主窗口 + 辅助窗口数量
  };
  
  // 发送到主窗口
  mainWindow.webContents.send('window-state-updated', windowState);
  
  // 发送到所有辅助窗口
  secondaryWindows.forEach((window) => {
    if (window && !window.isDestroyed()) {
      window.webContents.send('window-state-updated', windowState);
    }
  });
  
  console.log('窗口状态已广播:', windowState);
}

// 注册全局快捷键
function registerGlobalShortcuts() {
  // 注册Ctrl+Shift+I快捷键打开开发者工具
  const devToolsShortcut = globalShortcut.register('CommandOrControl+Shift+I', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.openDevTools();
    }
  });
  
  if (!devToolsShortcut) {
    console.warn('无法注册开发者工具快捷键');
  }
  
  console.log('全局快捷键已注册');
}

// 注销全局快捷键
function unregisterGlobalShortcuts() {
  globalShortcut.unregisterAll();
  console.log('全局快捷键已注销');
}

// 设置IPC通信处理
function setupIPCCommunication() {
  // 获取窗口状态
  ipcMain.handle('get-window-state', (event) => {
    if (!mainWindow || mainWindow.isDestroyed()) return null;
    
    return {
      focused: mainWindow.isFocused(),
      maximized: mainWindow.isMaximized(),
      fullscreen: mainWindow.isFullScreen(),
      visible: mainWindow.isVisible(),
      secondaryWindows: Array.from(secondaryWindows.keys()),
      windowCount: 1 + secondaryWindows.size,
    };
  });
  
  // 获取窗口边界
  ipcMain.handle('get-window-bounds', (event) => {
    if (!mainWindow || mainWindow.isDestroyed()) return null;
    return mainWindow.getBounds();
  });
  
  // 最小化窗口
  ipcMain.handle('minimize-window', (event) => {
    if (!mainWindow || mainWindow.isDestroyed()) return false;
    mainWindow.minimize();
    return true;
  });
  
  // 最大化窗口
  ipcMain.handle('maximize-window', (event) => {
    if (!mainWindow || mainWindow.isDestroyed()) return false;
    mainWindow.maximize();
    return true;
  });
  
  // 恢复窗口
  ipcMain.handle('restore-window', (event) => {
    if (!mainWindow || mainWindow.isDestroyed()) return false;
    mainWindow.restore();
    return true;
  });
  
  // 居中窗口
  ipcMain.handle('center-window', (event) => {
    if (!mainWindow || mainWindow.isDestroyed()) return false;
    mainWindow.center();
    return true;
  });
  
  // 关闭窗口
  ipcMain.handle('close-window', (event) => {
    if (!mainWindow || mainWindow.isDestroyed()) return false;
    mainWindow.close();
    return true;
  });
  
  // 切换开发者工具
  ipcMain.handle('toggle-dev-tools', (event) => {
    if (!mainWindow || mainWindow.isDestroyed()) return false;
    if (mainWindow.webContents.isDevToolsOpened()) {
      mainWindow.webContents.closeDevTools();
    } else {
      mainWindow.webContents.openDevTools();
    }
    return true;
  });
  
  // 设置窗口总在最顶层
  ipcMain.handle('set-window-always-on-top', (event, alwaysOnTop) => {
    if (!mainWindow || mainWindow.isDestroyed()) return false;
    mainWindow.setAlwaysOnTop(alwaysOnTop);
    return true;
  });
  
  // 设置全屏模式
  ipcMain.handle('set-full-screen', (event, fullscreen) => {
    if (!mainWindow || mainWindow.isDestroyed()) return false;
    mainWindow.setFullScreen(fullscreen);
    return true;
  });
  
  // 闪烁窗口
  ipcMain.handle('flash-frame', (event, flash) => {
    if (!mainWindow || mainWindow.isDestroyed()) return false;
    mainWindow.flashFrame(flash);
    return true;
  });
  
  // 调整窗口尺寸
  ipcMain.handle('resize-window', (event, width, height) => {
    if (!mainWindow || mainWindow.isDestroyed()) return false;
    if (width > 0 && height > 0) {
      mainWindow.setSize(width, height);
      return true;
    }
    return false;
  });
  
  // 移动窗口位置
  ipcMain.handle('move-window', (event, x, y) => {
    if (!mainWindow || mainWindow.isDestroyed()) return false;
    mainWindow.setPosition(x, y);
    return true;
  });
  
  // 创建新窗口
  ipcMain.handle('create-new-window', (event, options) => {
    try {
      const newWindow = createSecondaryWindow(options);
      return newWindow.id;
    } catch (error) {
      console.error('创建新窗口失败:', error);
      return null;
    }
  });
  
  // 关闭所有辅助窗口
  ipcMain.handle('close-all-windows', (event) => {
    try {
      closeAllSecondaryWindows();
      return true;
    } catch (error) {
      console.error('关闭所有窗口失败:', error);
      return false;
    }
  });
  
  // 导航相关
  ipcMain.handle('navigate-back', (event) => {
    if (!mainWindow || mainWindow.isDestroyed()) return false;
    mainWindow.webContents.goBack();
    return true;
  });
  
  ipcMain.handle('navigate-forward', (event) => {
    if (!mainWindow || mainWindow.isDestroyed()) return false;
    mainWindow.webContents.goForward();
    return true;
  });
  
  ipcMain.handle('reload-window', (event) => {
    if (!mainWindow || mainWindow.isDestroyed()) return false;
    mainWindow.webContents.reload();
    return true;
  });
  
  ipcMain.handle('load-url', (event, url) => {
    if (!mainWindow || mainWindow.isDestroyed()) return false;
    
    // 安全检查：确保URL使用安全协议
    const parsedUrl = new URL(url);
    if (['http:', 'https:', 'file:', 'data:'].includes(parsedUrl.protocol)) {
      mainWindow.loadURL(url);
      return true;
    }
    
    console.warn('阻止加载不安全的URL:', url);
    return false;
  });
  
  console.log('IPC通信处理已设置');
}

// 应用生命周期事件处理
function setupAppLifecycleEvents() {
  // 当应用准备就绪时创建窗口
  app.whenReady().then(() => {
    console.log('应用已准备就绪');
    
    // 创建主窗口
    createMainWindow();
    
    // 设置IPC通信
    setupIPCCommunication();
    
    // 注册全局快捷键
    registerGlobalShortcuts();
    
    // 在macOS上，当点击dock图标时重新创建窗口
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
      }
    });
  });
  
  // 在所有窗口关闭时退出应用（除了macOS）
  app.on('window-all-closed', () => {
    console.log('所有窗口已关闭');
    
    // 注销全局快捷键
    unregisterGlobalShortcuts();
    
    // 在macOS上，应用和菜单栏通常保持活动状态
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
  
  // 应用即将退出时的清理工作
  app.on('will-quit', () => {
    console.log('应用即将退出');
    
    // 确保注销所有全局快捷键
    unregisterGlobalShortcuts();
    
    // 确保保存窗口状态
    if (mainWindow && !mainWindow.isDestroyed()) {
      saveWindowState(mainWindow);
    }
  });
  
  console.log('应用生命周期事件已设置');
}

// 错误处理和日志
function setupErrorHandling() {
  // 捕获未处理的异常
  process.on('uncaughtException', (error) => {
    console.error('未捕获的异常:', error);
    // 可以在这里添加错误报告逻辑
  });
  
  // 捕获未处理的Promise拒绝
  process.on('unhandledRejection', (reason, promise) => {
    console.error('未处理的Promise拒绝:', reason);
    // 可以在这里添加错误报告逻辑
  });
  
  console.log('错误处理已设置');
}

// 主函数：启动应用
function main() {
  console.log('Electron 窗口管理示例应用启动中...');
  
  // 设置错误处理
  setupErrorHandling();
  
  // 设置应用生命周期事件
  setupAppLifecycleEvents();
}

// 启动应用
main();

// 导出模块供其他文件使用
module.exports = {
  createMainWindow,
  createSecondaryWindow,
  closeAllSecondaryWindows,
  broadcastWindowState
};