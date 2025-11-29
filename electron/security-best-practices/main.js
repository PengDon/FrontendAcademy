// Electron安全最佳实践 - 主进程

const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const { 
  getSecureWebPreferences, 
  applySecureCommandLineSwitches,
  isValidUrl,
  isValidFilePath,
  validateIPCMessage,
  runSecurityChecks 
} = require('./security-config');

// 全局引用，防止窗口被垃圾回收
let mainWindow;

// 开发环境检查
const isDev = process.env.NODE_ENV === 'development' || process.argv.includes('--dev');

// 应用安全命令行开关
applySecureCommandLineSwitches(app, isDev);

// 禁用硬件加速（在某些情况下可以提高安全性）
app.disableHardwareAcceleration();

// 防止应用作为子窗口被打开
app.requestSingleInstanceLock();

// 当第二个实例启动时退出
app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

// 创建主窗口
function createMainWindow() {
  // 获取安全的webPreferences配置
  const webPreferences = getSecureWebPreferences({
    preload: path.join(__dirname, 'preload.js'),
    // 注意：在生产环境中，这些值应该都是false
    // 这里为了演示可能会有一些例外，但请在实际应用中遵循最佳实践
  });

  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    title: 'Electron安全最佳实践',
    webPreferences: webPreferences,
    // 禁用自动隐藏菜单栏
    autoHideMenuBar: false,
    // 禁用DevTools（生产环境）
    showDevTools: isDev,
    // 使用安全的默认值
    backgroundColor: '#ffffff',
    // 禁用一些可能不安全的功能
    experimentalFeatures: false
  });

  // 加载本地HTML文件（避免远程内容的安全风险）
  mainWindow.loadFile('index.html');

  // 监听证书错误
  mainWindow.webContents.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    console.warn(`证书错误: ${error} 对于URL: ${url}`);
    // 在生产环境中，应该始终拒绝无效证书
    event.preventDefault();
    callback(false); // 拒绝无效证书
  });

  // 阻止导航到不安全的URL
  mainWindow.webContents.on('will-navigate', (event, url) => {
    const allowedDomains = ['localhost', '127.0.0.1'];
    try {
      const urlObj = new URL(url);
      if (!allowedDomains.includes(urlObj.hostname) && urlObj.protocol !== 'file:') {
        event.preventDefault();
        console.warn(`阻止导航到未授权的URL: ${url}`);
        // 可以选择使用shell打开外部链接
        shell.openExternal(url);
      }
    } catch (error) {
      event.preventDefault();
      console.error('无效的URL:', url);
    }
  });

  // 处理新窗口事件
  mainWindow.webContents.setWindowOpenHandler((details) => {
    const url = details.url;
    
    // 验证URL
    if (isValidUrl(url)) {
      // 对于外部URL，使用shell打开
      if (!url.startsWith('file://') && 
          !url.startsWith('http://localhost') && 
          !url.startsWith('http://127.0.0.1')) {
        shell.openExternal(url);
        return { action: 'deny' };
      }
      
      // 对于内部URL，可以允许打开
      return { 
        action: 'allow',
        overrideBrowserWindowOptions: {
          webPreferences: getSecureWebPreferences()
        }
      };
    }
    
    // 拒绝不安全的URL
    return { action: 'deny' };
  });

  // 监听内容加载完成事件
  mainWindow.webContents.on('did-finish-load', () => {
    // 执行安全检查
    const securityResults = runSecurityChecks({ app, mainWindow });
    
    // 发送安全检查结果到渲染进程
    mainWindow.webContents.send('app:security-check-results', securityResults);
    
    // 在控制台打印安全检查结果
    console.log('安全检查结果:', securityResults);
  });

  // 窗口关闭时清理
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC事件处理 - 应用信息
ipcMain.handle('app:get-info', () => {
  return {
    name: app.name,
    version: app.getVersion(),
    electronVersion: process.versions.electron,
    platform: process.platform,
    isDev: isDev
    // 注意：不要返回敏感信息
  };
});

// IPC事件处理 - 显示对话框
ipcMain.handle('app:show-dialog', async (event, { type, options }) => {
  // 验证参数
  if (!type || typeof options !== 'object') {
    return { success: false, error: '无效的对话框参数' };
  }
  
  try {
    let result;
    
    switch (type) {
      case 'openFile':
        result = await dialog.showOpenDialog(mainWindow, {
          properties: ['openFile'],
          ...options
        });
        break;
      case 'saveFile':
        result = await dialog.showSaveDialog(mainWindow, options);
        break;
      case 'message':
        result = await dialog.showMessageBox(mainWindow, options);
        break;
      default:
        return { success: false, error: '不支持的对话框类型' };
    }
    
    return { success: true, result: result };
  } catch (error) {
    console.error('对话框错误:', error);
    return { success: false, error: error.message };
  }
});

// IPC事件处理 - 保存文件
ipcMain.handle('app:save-file', async (event, { content, options }) => {
  try {
    // 首先显示保存对话框
    const dialogResult = await dialog.showSaveDialog(mainWindow, options);
    
    if (dialogResult.canceled || !dialogResult.filePath) {
      return { success: false, canceled: true };
    }
    
    const filePath = dialogResult.filePath;
    
    // 验证文件路径安全性
    // 在实际应用中，应该限制文件保存的目录
    // const allowedDir = app.getPath('documents');
    // if (!isValidFilePath(filePath, allowedDir)) {
    //   return { success: false, error: '不允许保存到指定位置' };
    // }
    
    // 写入文件
    await fs.writeFile(filePath, content, 'utf8');
    return { success: true, filePath: filePath };
  } catch (error) {
    console.error('保存文件错误:', error);
    return { success: false, error: error.message };
  }
});

// IPC事件处理 - 读取文件
ipcMain.handle('app:read-file', async (event, { path: filePath }) => {
  try {
    // 验证文件路径安全性
    // 在实际应用中，应该限制文件读取的目录
    // const allowedDir = app.getPath('documents');
    // if (!isValidFilePath(filePath, allowedDir)) {
    //   return { success: false, error: '不允许读取指定文件' };
    // }
    
    // 检查文件是否存在
    try {
      await fs.access(filePath);
    } catch {
      return { success: false, error: '文件不存在' };
    }
    
    // 读取文件内容
    const content = await fs.readFile(filePath, 'utf8');
    return { success: true, content: content };
  } catch (error) {
    console.error('读取文件错误:', error);
    return { success: false, error: error.message };
  }
});

// 应用准备就绪时创建窗口
app.whenReady().then(() => {
  createMainWindow();
  
  // 在macOS上，点击dock图标重新创建窗口
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

// 窗口关闭事件
app.on('window-all-closed', () => {
  // 在macOS上，应用通常保持活动状态，直到用户使用Cmd+Q显式退出
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 错误处理
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
  // 可以记录错误并选择是否重启应用
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的Promise拒绝:', reason);
});

// 安全最佳实践总结
/**
 * 1. 主进程配置:
 *    - 禁用nodeIntegration
 *    - 启用contextIsolation
 *    - 禁用enableRemoteModule
 *    - 配置预加载脚本
 * 
 * 2. 网络安全:
 *    - 验证所有URL
 *    - 阻止不安全的导航
 *    - 正确处理证书错误
 *    - 限制新窗口创建
 * 
 * 3. 文件系统安全:
 *    - 验证文件路径
 *    - 限制文件访问权限
 *    - 安全处理文件操作
 * 
 * 4. IPC通信安全:
 *    - 验证所有IPC消息
 *    - 实现最小权限原则
 *    - 避免敏感数据传输
 * 
 * 5. 应用生命周期安全:
 *    - 防止多实例运行
 *    - 适当的错误处理
 *    - 安全的应用退出
 */

// 导出模块（如果需要在其他地方使用）
module.exports = { app, mainWindow };