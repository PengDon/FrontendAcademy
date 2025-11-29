// main-process.js - 多进程示例的主进程代码
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const os = require('os')

// 存储所有窗口的引用
const windows = {}

// 创建主窗口
function createMainWindow() {
  windows.main = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'Electron 多进程示例 - 主窗口',
    webPreferences: {
      preload: path.join(__dirname, 'preload-main.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  // 加载主窗口的 HTML
  windows.main.loadFile(path.join(__dirname, 'index.html'))

  // 窗口事件处理
  windows.main.on('closed', () => {
    delete windows.main
  })

  // 窗口大小变化时通知渲染进程
  windows.main.on('resize', () => {
    const [width, height] = windows.main.getSize()
    if (windows.main.webContents) {
      windows.main.webContents.send('window-resized', { width, height })
    }
  })
}

// 创建第二个窗口
function createSecondaryWindow() {
  // 检查窗口是否已存在，如果存在则聚焦而不是创建新窗口
  if (windows.secondary) {
    windows.secondary.focus()
    return
  }

  windows.secondary = new BrowserWindow({
    width: 600,
    height: 400,
    title: 'Electron 多进程示例 - 次要窗口',
    parent: windows.main,
    webPreferences: {
      preload: path.join(__dirname, 'preload-secondary.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  // 加载次要窗口的 HTML
  windows.secondary.loadFile(path.join(__dirname, 'secondary.html'))

  // 窗口事件处理
  windows.secondary.on('closed', () => {
    delete windows.secondary
  })
}

// 当 Electron 完成初始化时
app.whenReady().then(() => {
  createMainWindow()

  // 处理 macOS 特定行为
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
  })
})

// 关闭所有窗口时退出应用（Windows 和 Linux）
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// 进程间通信处理

// 响应渲染进程请求创建新窗口
ipcMain.handle('create-secondary-window', () => {
  createSecondaryWindow()
  return true
})

// 获取系统信息
ipcMain.handle('get-system-info', () => {
  return {
    platform: process.platform,
    arch: process.arch,
    release: os.release(),
    totalMemory: os.totalmem(),
    freeMemory: os.freemem(),
    hostname: os.hostname(),
    cpus: os.cpus().length
  }
})

// 响应渲染进程的消息
ipcMain.on('message-from-renderer', (event, message) => {
  console.log('收到来自渲染进程的消息:', message)
  
  // 向渲染进程回复消息
  event.reply('message-from-main', {
    response: `已收到: ${message.content}`,
    timestamp: new Date().toISOString()
  })
  
  // 如果需要，也可以向所有窗口广播消息
  if (message.broadcast && windows.secondary) {
    windows.secondary.webContents.send('broadcast-message', message.content)
  }
})

// 处理渲染进程关闭窗口的请求
ipcMain.handle('close-window', (event, windowName) => {
  if (windows[windowName]) {
    windows[windowName].close()
    return true
  }
  return false
})

// 模拟一个耗时操作（演示不会阻塞主进程）
ipcMain.handle('perform-heavy-task', async (event, iterations) => {
  console.log(`开始执行耗时任务: ${iterations} 次迭代`)
  
  // 注意：在实际应用中，真正的耗时操作应该移至工作线程
  // 这里只是一个简单的模拟
  let result = 0
  for (let i = 0; i < iterations; i++) {
    result += Math.random() * i
  }
  
  console.log(`耗时任务完成，结果: ${result}`)
  return { result, iterations }
})

// 监听应用生命周期事件
app.on('ready', () => {
  console.log('应用就绪')
})

app.on('before-quit', () => {
  console.log('应用即将退出')
})

app.on('will-quit', () => {
  console.log('应用将退出')
})

app.on('quit', (event, exitCode) => {
  console.log(`应用已退出，退出代码: ${exitCode}`)
})