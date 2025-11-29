// basic-electron-app.js - Electron 核心概念示例应用
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

// 保持对窗口对象的全局引用，避免被垃圾回收
let mainWindow = null

// 创建窗口函数
function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // 预加载脚本
      preload: path.join(__dirname, 'preload.js'),
      // 安全设置
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  // 加载 HTML 文件
  mainWindow.loadFile(path.join(__dirname, 'index.html'))

  // 打开开发者工具
  // mainWindow.webContents.openDevTools()

  // 窗口关闭事件处理
  mainWindow.on('closed', () => {
    // 在 Windows 上，通常不需要显式关闭窗口，窗口对象会自动销毁
    // 在 macOS 上，我们通常不会完全退出应用程序
    mainWindow = null
  })
}

// 当 Electron 完成初始化并准备好创建浏览器窗口时调用
app.whenReady().then(() => {
  createWindow()

  // 在 macOS 上，当点击 dock 图标并且没有其他窗口打开时，通常会重新创建一个窗口
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 关闭所有窗口时退出应用程序，但在 macOS 上除外
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// 主进程 IPC 事件处理
ipcMain.handle('get-app-info', () => {
  return {
    name: app.getName(),
    version: app.getVersion(),
    electronVersion: process.versions.electron
  }
})

// 应用生命周期事件
app.on('will-finish-launching', () => {
  console.log('应用即将完成启动')
})

app.on('ready', () => {
  console.log('应用已准备就绪')
})

app.on('browser-window-created', () => {
  console.log('浏览器窗口已创建')
})

app.on('quit', (event, exitCode) => {
  console.log(`应用即将退出，退出代码：${exitCode}`)
})