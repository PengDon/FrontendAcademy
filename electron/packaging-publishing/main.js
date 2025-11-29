// Electron应用主进程
// 此文件包含应用入口点、窗口创建、自动更新功能和应用生命周期管理

const { app, BrowserWindow, ipcMain, dialog, Menu, autoUpdater, Notification } = require('electron');
const path = require('path');
const log = require('electron-log');
const { isDev, isMac, isWindows, isLinux } = require('./utils');

// 配置日志
log.transports.file.level = 'info';
log.transports.console.level = isDev ? 'debug' : 'info';
log.info('应用启动中...');

// 全局窗口引用
let mainWindow = null;

// 防止应用多实例运行
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  log.warn('检测到应用已在运行，退出当前实例');
  app.quit();
} else {
  // 处理第二个实例
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    log.info('检测到第二个应用实例');
    // 如果窗口已经存在，聚焦到窗口
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

// 自动更新配置
function setupAutoUpdater() {
  if (isDev) {
    log.info('开发环境下禁用自动更新');
    return;
  }

  // 设置自动更新服务器URL
  const updateServerUrl = process.env.UPDATE_SERVER_URL || 'https://example.com/updates';
  const feedURL = `${updateServerUrl}/${process.platform}/${app.getVersion()}`;
  
  // 配置electron-updater
  autoUpdater.setFeedURL({
    url: feedURL,
    serverType: 'custom'
  });
  
  // 设置日志
  autoUpdater.logger = log;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.checkForUpdatesAndNotify();
  
  // 监听自动更新事件
  autoUpdater.on('update-available', (info) => {
    log.info(`发现新版本: ${info.version}`);
    
    // 显示通知
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: '更新可用',
      message: `发现新版本 ${info.version}`,
      detail: '是否立即下载并安装更新？',
      buttons: ['稍后提醒', '立即更新'],
      defaultId: 1
    }).then((result) => {
      if (result.response === 1) {
        log.info('用户选择立即更新');
        autoUpdater.downloadUpdate();
      } else {
        log.info('用户选择稍后更新');
      }
    });
  });
  
  autoUpdater.on('update-not-available', () => {
    log.info('当前已是最新版本');
    if (isDev) {
      dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: '版本信息',
        message: '当前已是最新版本',
        buttons: ['确定']
      });
    }
  });
  
  autoUpdater.on('error', (error) => {
    log.error(`更新检查失败: ${error.message}`, error);
    
    // 只有在显式请求检查更新时才显示错误
    if (error.explicitRequest) {
      dialog.showMessageBox(mainWindow, {
        type: 'error',
        title: '更新错误',
        message: '检查更新失败',
        detail: error.message,
        buttons: ['确定']
      });
    }
  });
  
  autoUpdater.on('download-progress', (progressObj) => {
    const progress = Math.round(progressObj.percent);
    log.info(`下载进度: ${progress}%`);
    
    // 发送进度信息到渲染进程
    mainWindow.webContents.send('update-progress', progress);
  });
  
  autoUpdater.on('update-downloaded', (info) => {
    log.info('更新已下载完成');
    
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: '更新准备就绪',
      message: `更新 ${info.version} 已下载完成`,
      detail: '应用需要重启以安装更新。是否立即重启？',
      buttons: ['稍后', '立即重启'],
      defaultId: 1,
      cancelId: 0
    }).then((result) => {
      if (result.response === 1) {
        log.info('用户选择立即重启以安装更新');
        setImmediate(() => autoUpdater.quitAndInstall());
      }
    });
  });
}

// 创建主窗口
function createMainWindow() {
  log.info('创建主窗口');
  
  // 窗口配置
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 600,
    minHeight: 400,
    title: 'Electron打包示例',
    titleBarStyle: isMac ? 'hiddenInset' : 'default',
    trafficLightPosition: { x: 10, y: 10 },
    frame: !isMac, // 在Mac上使用自定义窗口框架
    backgroundColor: '#ffffff',
    icon: path.join(__dirname, 'build/icons/icon.png'),
    show: false, // 先隐藏窗口，等内容加载完成再显示
    webPreferences: {
      // 安全配置
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: !isDev, // 开发环境下禁用沙箱
      disableBlinkFeatures: 'Auxclick',
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),
      
      // 性能配置
      hardwareAcceleration: true,
      webSecurity: !isDev,
      
      // 其他配置
      spellcheck: true,
      defaultEncoding: 'utf-8',
      
      // 会话配置
      partition: 'persist:electron-example'
    }
  });
  
  // 加载应用
  const indexPath = path.join(__dirname, 'index.html');
  mainWindow.loadFile(indexPath)
    .then(() => {
      log.info('成功加载应用页面');
      
      // 内容加载完成后显示窗口
      mainWindow.once('ready-to-show', () => {
        log.info('窗口准备就绪，显示窗口');
        mainWindow.show();
        
        // 开发环境下打开开发者工具
        if (isDev) {
          mainWindow.webContents.openDevTools({
            mode: 'detach'
          });
        }
      });
    })
    .catch((error) => {
      log.error(`加载应用页面失败: ${error.message}`, error);
      
      // 显示错误对话框
      dialog.showMessageBoxSync({
        type: 'error',
        title: '加载错误',
        message: '无法加载应用',
        detail: error.message,
        buttons: ['退出']
      });
      
      app.quit();
    });
  
  // 设置窗口事件监听
  mainWindow.on('closed', () => {
    log.info('主窗口已关闭');
    mainWindow = null;
  });
  
  mainWindow.on('unresponsive', () => {
    log.warn('窗口无响应');
    dialog.showMessageBox(mainWindow, {
      type: 'warning',
      title: '窗口无响应',
      message: '应用窗口无响应',
      detail: '是否强制关闭应用？',
      buttons: ['等待', '强制关闭'],
      defaultId: 0,
      cancelId: 0
    }).then((result) => {
      if (result.response === 1) {
        mainWindow.forceClose();
      }
    });
  });
  
  // 设置窗口崩溃处理
  mainWindow.webContents.on('crashed', (event, killed) => {
    log.error(`渲染进程崩溃: ${killed ? '被杀' : '崩溃'}`);
    dialog.showMessageBox(mainWindow, {
      type: 'error',
      title: '渲染进程崩溃',
      message: '应用界面崩溃',
      detail: '是否重新加载应用？',
      buttons: ['退出', '重新加载'],
      defaultId: 1,
      cancelId: 0
    }).then((result) => {
      if (result.response === 1) {
        mainWindow.reload();
      } else {
        app.quit();
      }
    });
  });
  
  // 设置页面加载状态监听
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    log.error(`页面加载失败: ${errorDescription} (错误代码: ${errorCode})`);
  });
  
  // 窗口焦点变化监听
  mainWindow.on('focus', () => {
    mainWindow.webContents.send('window-focused');
  });
  
  // 设置页面标题更新
  mainWindow.on('page-title-updated', (event, title) => {
    log.info(`页面标题更新为: ${title}`);
  });
  
  return mainWindow;
}

// 创建应用菜单
function createAppMenu() {
  const template = [
    {
      label: '文件',
      submenu: [
        {
          label: '新建',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('new-file');
          }
        },
        {
          label: '打开',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            mainWindow.webContents.send('open-file');
          }
        },
        {
          label: '保存',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            mainWindow.webContents.send('save-file');
          }
        },
        { type: 'separator' },
        {
          label: '退出',
          accelerator: 'CmdOrCtrl+Q',
          click: () => app.quit()
        }
      ]
    },
    {
      label: '编辑',
      submenu: [
        { label: '撤销', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
        { label: '重做', accelerator: 'CmdOrCtrl+Y', selector: 'redo:' },
        { type: 'separator' },
        { label: '剪切', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
        { label: '复制', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
        { label: '粘贴', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
        { label: '全选', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' }
      ]
    },
    {
      label: '视图',
      submenu: [
        {
          label: '重新加载',
          accelerator: 'CmdOrCtrl+R',
          click: () => mainWindow.reload()
        },
        { type: 'separator' },
        {
          label: '全屏',
          accelerator: 'F11',
          click: () => mainWindow.setFullScreen(!mainWindow.isFullScreen())
        },
        { type: 'separator' },
        {
          label: '开发者工具',
          accelerator: 'CmdOrCtrl+Shift+I',
          click: () => mainWindow.webContents.toggleDevTools(),
          visible: isDev
        }
      ]
    },
    {
      label: '帮助',
      submenu: [
        {
          label: '关于',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              title: '关于',
              message: 'Electron打包示例',
              detail: `版本: ${app.getVersion()}\nElectron版本: ${process.versions.electron}\n\n一个展示Electron应用打包和发布功能的示例应用。`,
              buttons: ['确定'],
              icon: path.join(__dirname, 'build/icons/icon.png')
            });
          }
        },
        {
          label: '检查更新',
          click: () => {
            if (isDev) {
              dialog.showMessageBox(mainWindow, {
                type: 'info',
                title: '开发模式',
                message: '开发模式下禁用自动更新',
                buttons: ['确定']
              });
            } else {
              log.info('用户手动检查更新');
              autoUpdater.checkForUpdates();
              
              // 显示检查中通知
              new Notification({
                title: '检查更新',
                body: '正在检查新版本...'
              }).show();
            }
          }
        },
        {
          label: '查看日志',
          click: () => {
            log.info('查看日志');
            mainWindow.webContents.send('view-logs');
          }
        }
      ]
    }
  ];

  // 为Mac系统调整菜单
  if (isMac) {
    template.unshift({
      label: app.name,
      submenu: [
        {
          label: '关于 ' + app.name,
          click: () => {
            dialog.showMessageBox(mainWindow, {
              title: '关于',
              message: app.name,
              detail: `版本: ${app.getVersion()}\nElectron版本: ${process.versions.electron}`,
              buttons: ['确定']
            });
          }
        },
        { type: 'separator' },
        { label: '服务', submenu: [] },
        { type: 'separator' },
        { label: '隐藏 ' + app.name, accelerator: 'Command+H', selector: 'hide:' },
        { label: '隐藏其他', accelerator: 'Command+Alt+H', selector: 'hideOtherApplications:' },
        { label: '显示全部', selector: 'unhideAllApplications:' },
        { type: 'separator' },
        { label: '退出', accelerator: 'Command+Q', click: () => app.quit() }
      ]
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// 设置IPC通信
function setupIpcListeners() {
  log.info('设置IPC通信监听器');
  
  // 检查更新
  ipcMain.on('check-for-updates', () => {
    log.info('IPC: 检查更新');
    if (isDev) {
      mainWindow.webContents.send('update-not-available');
    } else {
      autoUpdater.checkForUpdates();
    }
  });
  
  // 显示通知
  ipcMain.on('show-notification', (event, title, body) => {
    log.info(`IPC: 显示通知 - ${title}`);
    new Notification({
      title: title,
      body: body
    }).show();
  });
  
  // 打开外部链接
  ipcMain.on('open-external-link', (event, url) => {
    log.info(`IPC: 打开外部链接 - ${url}`);
    const { shell } = require('electron');
    shell.openExternal(url).catch((error) => {
      log.error(`打开外部链接失败: ${error.message}`);
    });
  });
  
  // 获取应用信息
  ipcMain.on('get-app-info', (event) => {
    log.info('IPC: 获取应用信息');
    event.returnValue = {
      name: app.name,
      version: app.getVersion(),
      electronVersion: process.versions.electron,
      platform: process.platform,
      arch: process.arch,
      isDev: isDev
    };
  });
  
  // 打开对话框
  ipcMain.handle('open-dialog', async (event, dialogType, options) => {
    log.info(`IPC: 打开对话框 - ${dialogType}`);
    try {
      if (dialogType === 'openFile') {
        const result = await dialog.showOpenDialog(mainWindow, options);
        return result;
      } else if (dialogType === 'saveFile') {
        const result = await dialog.showSaveDialog(mainWindow, options);
        return result;
      } else if (dialogType === 'messageBox') {
        const result = await dialog.showMessageBox(mainWindow, options);
        return result;
      }
      throw new Error(`未知的对话框类型: ${dialogType}`);
    } catch (error) {
      log.error(`打开对话框失败: ${error.message}`);
      throw error;
    }
  });
  
  // 窗口控制
  ipcMain.on('window-control', (event, action) => {
    log.info(`IPC: 窗口控制 - ${action}`);
    switch (action) {
      case 'minimize':
        mainWindow.minimize();
        break;
      case 'maximize':
        if (mainWindow.isMaximized()) {
          mainWindow.unmaximize();
        } else {
          mainWindow.maximize();
        }
        break;
      case 'close':
        mainWindow.close();
        break;
      case 'fullscreen':
        mainWindow.setFullScreen(!mainWindow.isFullScreen());
        break;
    }
  });
  
  // 发送日志
  ipcMain.handle('get-logs', async () => {
    log.info('IPC: 获取日志');
    try {
      // 在实际应用中，可以从log.transports.file获取日志内容
      return log.transports.file.getFile().content;
    } catch (error) {
      log.error(`获取日志失败: ${error.message}`);
      return '';
    }
  });
}

// 应用生命周期管理
function setupAppLifecycle() {
  log.info('设置应用生命周期管理');
  
  // 准备就绪时创建窗口
  app.on('ready', () => {
    log.info('应用已就绪');
    
    // 创建主窗口
    createMainWindow();
    
    // 创建应用菜单
    createAppMenu();
    
    // 设置IPC通信
    setupIpcListeners();
    
    // 设置自动更新
    setupAutoUpdater();
    
    // 打印应用信息
    log.info(`应用启动完成 - 版本: ${app.getVersion()}`);
    log.info(`Electron版本: ${process.versions.electron}`);
    log.info(`平台: ${process.platform} (${process.arch})`);
  });
  
  // 所有窗口关闭时退出应用（除了Mac）
  app.on('window-all-closed', () => {
    log.info('所有窗口已关闭');
    if (!isMac) {
      app.quit();
    }
  });
  
  // 在Mac上点击dock图标时重建窗口
  app.on('activate', () => {
    log.info('应用被激活');
    if (mainWindow === null) {
      createMainWindow();
    } else {
      mainWindow.focus();
    }
  });
  
  // 应用即将退出
  app.on('will-quit', (event) => {
    log.info('应用即将退出');
    // 可以在这里保存应用状态
  });
  
  // 应用退出
  app.on('quit', (event, exitCode) => {
    log.info(`应用已退出 - 退出代码: ${exitCode}`);
  });
  
  // 处理未捕获的异常
  process.on('uncaughtException', (error) => {
    log.error(`未捕获的异常: ${error.message}`, error);
    
    // 保存错误日志
    log.error('应用崩溃报告:', {
      message: error.message,
      stack: error.stack,
      date: new Date().toISOString(),
      version: app.getVersion()
    });
    
    // 显示错误对话框
    if (mainWindow) {
      dialog.showMessageBox(mainWindow, {
        type: 'error',
        title: '应用崩溃',
        message: '应用发生未预期的错误',
        detail: error.message,
        buttons: ['退出', '忽略']
      }).then((result) => {
        if (result.response === 0) {
          app.quit();
        }
      });
    } else {
      // 如果窗口不存在，直接退出
      setTimeout(() => {
        process.exit(1);
      }, 1000);
    }
  });
  
  // 处理未处理的Promise拒绝
  process.on('unhandledRejection', (reason, promise) => {
    log.error(`未处理的Promise拒绝: ${reason}`, reason);
  });
}

// 启动应用
setupAppLifecycle();

// 导出函数（用于测试）
if (isDev) {
  module.exports = {
    createMainWindow,
    setupAutoUpdater,
    setupIpcListeners
  };
}