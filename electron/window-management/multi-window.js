// multi-window.js - Electron多窗口管理示例

const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

// 窗口引用管理
const windows = {
  main: null,
  secondaries: new Map() // 存储辅助窗口
}

// 窗口ID计数器
let windowIdCounter = 1

/**
 * 创建主窗口
 */
function createMainWindow() {
  // 配置主窗口参数
  const mainWindowOptions = {
    width: 900,
    height: 700,
    center: true,
    title: 'Electron 多窗口管理示例 - 主窗口',
    backgroundColor: '#ffffff',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false
    }
  }

  // 创建主窗口
  windows.main = new BrowserWindow(mainWindowOptions)

  // 加载主窗口HTML文件
  windows.main.loadFile(path.join(__dirname, 'index.html'))

  // 设置主窗口事件
  setupMainWindowEvents()

  console.log('主窗口已创建')
}

/**
 * 创建辅助窗口
 * @param {Object} options - 窗口选项
 * @returns {BrowserWindow} 创建的窗口实例
 */
function createSecondaryWindow(options = {}) {
  const windowId = `window-${windowIdCounter++}`
  
  // 基本窗口配置
  const defaultOptions = {
    width: 600,
    height: 400,
    center: false,
    title: `辅助窗口 ${windowIdCounter - 1}`,
    backgroundColor: '#f0f0f0',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false
    },
    parent: windows.main, // 设置主窗口为父窗口
    modal: options.modal || false, // 是否为模态窗口
    show: false // 创建后先不显示
  }

  // 合并选项
  const windowOptions = { ...defaultOptions, ...options }

  // 创建辅助窗口
  const secondaryWindow = new BrowserWindow(windowOptions)

  // 如果指定了URL，则加载URL，否则加载默认的secondary.html
  if (options.url) {
    secondaryWindow.loadURL(options.url)
  } else {
    secondaryWindow.loadFile(path.join(__dirname, 'secondary.html'))
  }

  // 设置窗口ID属性
  secondaryWindow.windowId = windowId

  // 存储窗口引用
  windows.secondaries.set(windowId, secondaryWindow)

  // 设置辅助窗口事件
  setupSecondaryWindowEvents(secondaryWindow)

  // 延迟显示窗口，避免显示闪烁
  setTimeout(() => {
    secondaryWindow.show()
  }, 100)

  // 通知所有窗口有新窗口创建
  notifyWindowsAboutChange()

  console.log(`辅助窗口 ${windowId} 已创建`)
  return secondaryWindow
}

/**
 * 设置主窗口事件
 */
function setupMainWindowEvents() {
  if (!windows.main) return

  // 主窗口关闭事件
  windows.main.on('closed', () => {
    console.log('主窗口已关闭')
    // 清理所有辅助窗口
    closeAllSecondaryWindows()
    // 清理主窗口引用
    windows.main = null
  })

  // 主窗口焦点变化事件
  windows.main.on('focus', () => {
    console.log('主窗口获得焦点')
    // 通知渲染进程窗口状态变化
    windows.main.webContents.send('window-state-changed', {
      focused: true,
      windowCount: getWindowCount()
    })
  })

  windows.main.on('blur', () => {
    console.log('主窗口失去焦点')
  })
}

/**
 * 设置辅助窗口事件
 * @param {BrowserWindow} window - 辅助窗口实例
 */
function setupSecondaryWindowEvents(window) {
  // 辅助窗口关闭事件
  window.on('closed', () => {
    const windowId = window.windowId
    console.log(`辅助窗口 ${windowId} 已关闭`)
    // 从Map中删除窗口引用
    windows.secondaries.delete(windowId)
    // 通知所有窗口窗口数量变化
    notifyWindowsAboutChange()
  })

  // 辅助窗口焦点变化事件
  window.on('focus', () => {
    console.log(`辅助窗口 ${window.windowId} 获得焦点`)
  })
}

/**
 * 关闭所有辅助窗口
 */
function closeAllSecondaryWindows() {
  console.log('关闭所有辅助窗口')
  windows.secondaries.forEach((window) => {
    window.close()
  })
  windows.secondaries.clear()
}

/**
 * 获取当前所有窗口数量
 * @returns {number} 窗口总数
 */
function getWindowCount() {
  let count = 0
  if (windows.main) count++
  count += windows.secondaries.size
  return count
}

/**
 * 通知所有窗口关于窗口数量变化
 */
function notifyWindowsAboutChange() {
  // 通知主窗口
  if (windows.main && !windows.main.isDestroyed()) {
    windows.main.webContents.send('window-state-changed', {
      windowCount: getWindowCount(),
      secondaryWindows: Array.from(windows.secondaries.keys())
    })
  }

  // 通知所有辅助窗口
  windows.secondaries.forEach((window) => {
    if (!window.isDestroyed()) {
      window.webContents.send('window-state-changed', {
        windowCount: getWindowCount(),
        windowId: window.windowId,
        secondaryWindows: Array.from(windows.secondaries.keys())
      })
    }
  })
}

/**
 * 设置IPC事件处理器
 */
function setupIPCHandlers() {
  // 创建新窗口
  ipcMain.on('create-new-window', (event, options) => {
    console.log('接收到创建新窗口请求', options)
    createSecondaryWindow(options)
  })

  // 关闭所有窗口
  ipcMain.on('close-all-windows', () => {
    console.log('接收到关闭所有窗口请求')
    closeAllSecondaryWindows()
  })

  // 获取子窗口列表
  ipcMain.handle('get-child-windows', () => {
    return Array.from(windows.secondaries.keys())
  })

  // 窗口控制命令
  ipcMain.on('window-control', (event, action) => {
    const window = getWindowFromEvent(event)
    if (!window) return

    console.log(`窗口控制: ${action}`)
    switch (action) {
      case 'minimize':
        window.minimize()
        break
      case 'maximize':
        window.maximize()
        break
      case 'restore':
        window.restore()
        break
      case 'close':
        window.close()
        break
      case 'focus':
        window.focus()
        break
      case 'center':
        window.center()
        break
    }
  })

  // 调整窗口大小
  ipcMain.on('resize-window', (event, { width, height }) => {
    const window = getWindowFromEvent(event)
    if (window && width && height) {
      window.setSize(width, height)
    }
  })

  // 移动窗口
  ipcMain.on('move-window', (event, { x, y }) => {
    const window = getWindowFromEvent(event)
    if (window && x !== undefined && y !== undefined) {
      window.setPosition(x, y)
    }
  })

  // 获取窗口边界
  ipcMain.handle('get-window-bounds', (event) => {
    const window = getWindowFromEvent(event)
    if (window) {
      return window.getBounds()
    }
    return null
  })

  // 获取窗口状态
  ipcMain.handle('get-window-state', (event) => {
    const window = getWindowFromEvent(event)
    if (window) {
      return {
        focused: window.isFocused(),
        maximized: window.isMaximized(),
        minimized: window.isMinimized(),
        fullscreen: window.isFullScreen(),
        alwaysOnTop: window.isAlwaysOnTop(),
        bounds: window.getBounds(),
        windowCount: getWindowCount()
      }
    }
    return null
  })

  // 设置窗口总在最顶层
  ipcMain.on('set-always-on-top', (event, alwaysOnTop) => {
    const window = getWindowFromEvent(event)
    if (window) {
      window.setAlwaysOnTop(alwaysOnTop)
    }
  })

  // 设置全屏模式
  ipcMain.on('set-full-screen', (event, fullScreen) => {
    const window = getWindowFromEvent(event)
    if (window) {
      window.setFullScreen(fullScreen)
    }
  })

  // 窗口内容控制
  ipcMain.on('reload-window', (event) => {
    const window = getWindowFromEvent(event)
    if (window) {
      window.reload()
    }
  })

  ipcMain.on('navigate-back', (event) => {
    const window = getWindowFromEvent(event)
    if (window && window.webContents.canGoBack()) {
      window.webContents.goBack()
    }
  })

  ipcMain.on('navigate-forward', (event) => {
    const window = getWindowFromEvent(event)
    if (window && window.webContents.canGoForward()) {
      window.webContents.goForward()
    }
  })

  ipcMain.on('load-url', (event, url) => {
    const window = getWindowFromEvent(event)
    if (window && url) {
      window.loadURL(url)
    }
  })

  // 开发者工具控制
  ipcMain.on('toggle-dev-tools', (event) => {
    const window = getWindowFromEvent(event)
    if (window) {
      window.webContents.toggleDevTools()
    }
  })
}

/**
 * 从IPC事件中获取对应的窗口实例
 * @param {Event} event - IPC事件对象
 * @returns {BrowserWindow|null} 对应的窗口实例或null
 */
function getWindowFromEvent(event) {
  // 从事件的sender获取webContents，然后获取所属窗口
  const webContents = event.sender
  const window = BrowserWindow.fromWebContents(webContents)
  return window || null
}

/**
 * 设置应用程序生命周期事件
 */
function setupAppLifecycle() {
  // 当Electron完成初始化时
  app.whenReady().then(() => {
    console.log('应用程序已就绪')
    createMainWindow()
    setupIPCHandlers()

    // macOS特定行为：点击dock图标时重新创建窗口
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow()
      }
    })
  })

  // Windows和Linux：关闭所有窗口时退出应用
  app.on('window-all-closed', () => {
    console.log('所有窗口已关闭')
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  // 应用程序退出事件
  app.on('quit', (event, exitCode) => {
    console.log(`应用程序已退出，退出代码: ${exitCode}`)
  })
}

// 启动应用程序
setupAppLifecycle()

/**
 * 多窗口管理最佳实践：
 * 
 * 1. 窗口引用管理：
 *    - 使用专门的数据结构存储所有窗口引用
 *    - 为每个窗口分配唯一ID
 *    - 及时清理已关闭窗口的引用
 * 
 * 2. 窗口通信：
 *    - 主进程作为中央消息枢纽
 *    - 使用IPC在窗口间传递消息
 *    - 避免窗口间直接依赖
 * 
 * 3. 窗口层级关系：
 *    - 使用parent-child关系建立窗口层次
 *    - 合理使用modal属性
 *    - 管理窗口的z-index
 * 
 * 4. 窗口关闭策略：
 *    - 定义明确的窗口关闭顺序
 *    - 主窗口关闭时清理所有子窗口
 *    - 提供确认机制避免误操作
 * 
 * 5. 性能优化：
 *    - 延迟创建非必要窗口
 *    - 重用已存在的窗口
 *    - 限制同时打开的窗口数量
 */