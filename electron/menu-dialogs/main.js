// main.js - 菜单和对话框示例应用的主进程代码

const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

// 导入菜单和对话框示例模块
const {
  createMainMenu,
  createContextMenu,
  createAdvancedMenu,
  updateMenuItem,
  setupDynamicMenu
} = require('./menu-example')

const {
  showOpenDialog,
  showSaveDialog,
  showMessageBox,
  showConfirmDialog,
  showErrorDialog,
  showWarningDialog,
  showInfoDialog,
  openAndReadFile,
  saveFileWithDialog,
  showCustomButtonDialog
} = require('./dialog-example')

// 存储窗口引用
let mainWindow = null

/**
 * 创建主窗口
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'Electron 菜单和对话框示例',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  // 加载HTML文件
  mainWindow.loadFile(path.join(__dirname, 'index.html'))

  // 创建并设置主菜单
  const menu = createMainMenu(mainWindow)
  
  // 设置动态菜单
  setupDynamicMenu(mainWindow)

  // 窗口关闭事件
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

/**
 * 设置IPC监听器
 */
function setupIPCListeners() {
  // 菜单相关IPC处理
  ipcMain.on('show-context-menu', () => {
    const contextMenu = createContextMenu()
    contextMenu.popup({ window: mainWindow })
  })

  ipcMain.on('show-advanced-menu', () => {
    const advancedMenu = createAdvancedMenu()
    advancedMenu.popup({ window: mainWindow })
  })

  ipcMain.on('update-menu-item', (event, { menuId, updates }) => {
    updateMenuItem(menuId, updates)
  })

  // 对话框相关IPC处理
  ipcMain.handle('show-open-dialog', (event, options) => {
    return showOpenDialog(mainWindow, options)
  })

  ipcMain.handle('show-save-dialog', (event, options) => {
    return showSaveDialog(mainWindow, options)
  })

  ipcMain.handle('show-message-box', (event, options) => {
    return showMessageBox(mainWindow, options)
  })

  ipcMain.handle('show-confirm-dialog', (event, { message, detail }) => {
    return showConfirmDialog(mainWindow, message, detail)
  })

  ipcMain.handle('show-error-dialog', (event, { message, detail }) => {
    return showErrorDialog(mainWindow, message, detail)
  })

  ipcMain.handle('show-warning-dialog', (event, { message, detail }) => {
    return showWarningDialog(mainWindow, message, detail)
  })

  ipcMain.handle('show-info-dialog', (event, { message, detail }) => {
    return showInfoDialog(mainWindow, message, detail)
  })

  ipcMain.handle('open-and-read-file', () => {
    return openAndReadFile(mainWindow)
  })

  ipcMain.handle('save-file-with-dialog', (event, { content, defaultFileName }) => {
    return saveFileWithDialog(mainWindow, content, defaultFileName)
  })

  ipcMain.handle('show-custom-button-dialog', (event, { message, buttons }) => {
    return showCustomButtonDialog(mainWindow, message, buttons)
  })
}

/**
 * 应用程序生命周期管理
 */
function setupAppLifecycle() {
  // 当Electron完成初始化时
  app.whenReady().then(() => {
    createWindow()
    setupIPCListeners()

    // macOS特定行为：点击dock图标时重新创建窗口
    app.on('activate', function () {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
      }
    })
  })

  // Windows和Linux：关闭所有窗口时退出应用
  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  // 应用程序启动事件
  app.on('will-finish-launching', () => {
    console.log('应用程序即将完成启动')
  })

  app.on('ready', () => {
    console.log('应用程序已就绪')
  })

  app.on('before-quit', () => {
    console.log('应用程序即将退出')
  })

  app.on('quit', (event, exitCode) => {
    console.log(`应用程序已退出，退出代码: ${exitCode}`)
  })
}

// 启动应用程序
setupAppLifecycle()

// 错误处理
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error)
  // 在生产环境中，您可能希望将错误记录到文件而不是显示给用户
})

// 进程间通信错误处理
ipcMain.on('error', (event, error) => {
  console.error('IPC错误:', error)
})

// 应用程序命令行参数
const args = process.argv.slice(2)
console.log('应用程序命令行参数:', args)