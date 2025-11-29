// basic-window.js - Electron基础窗口创建和控制示例

const { app, BrowserWindow } = require('electron')
const path = require('path')

// 保存窗口引用
let mainWindow = null

/**
 * 创建基础窗口
 * 演示基本的窗口创建、配置和生命周期管理
 */
function createBasicWindow() {
  // 配置窗口参数
  const windowOptions = {
    width: 800,              // 窗口宽度
    height: 600,             // 窗口高度
    center: true,            // 窗口是否居中显示
    minWidth: 400,           // 窗口最小宽度
    minHeight: 300,          // 窗口最小高度
    resizable: true,         // 窗口是否可调整大小
    title: 'Electron 基础窗口示例', // 窗口标题
    backgroundColor: '#ffffff', // 窗口背景颜色
    // 配置网页首选项
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,    // 禁用Node.js集成
      contextIsolation: true,    // 启用上下文隔离
      enableRemoteModule: false, // 禁用remote模块
      devTools: true             // 启用开发者工具
    }
  }

  // 创建浏览器窗口
  mainWindow = new BrowserWindow(windowOptions)

  // 加载本地HTML文件
  mainWindow.loadFile(path.join(__dirname, 'index.html'))

  // 打开开发者工具
  // mainWindow.webContents.openDevTools()

  // 注册窗口事件监听
  setupWindowEvents()

  console.log('基础窗口已创建')
}

/**
 * 设置窗口事件监听
 */
function setupWindowEvents() {
  if (!mainWindow) return

  // 窗口关闭事件
  mainWindow.on('closed', () => {
    console.log('窗口已关闭')
    // 清理窗口引用，避免内存泄漏
    mainWindow = null
  })

  // 窗口关闭前事件
  mainWindow.on('close', (event) => {
    console.log('窗口即将关闭')
    // 可以通过调用 event.preventDefault() 来阻止窗口关闭
    // event.preventDefault()
  })

  // 窗口获得焦点事件
  mainWindow.on('focus', () => {
    console.log('窗口获得焦点')
  })

  // 窗口失去焦点事件
  mainWindow.on('blur', () => {
    console.log('窗口失去焦点')
  })

  // 窗口显示事件
  mainWindow.on('show', () => {
    console.log('窗口已显示')
  })

  // 窗口隐藏事件
  mainWindow.on('hide', () => {
    console.log('窗口已隐藏')
  })
}

/**
 * 演示窗口控制方法
 * 这些方法可以在应用程序的其他部分调用
 */
function demonstrateWindowControls() {
  if (!mainWindow) {
    console.error('窗口未创建')
    return
  }

  // 演示延迟执行一些窗口控制操作
  setTimeout(() => {
    // 获取窗口当前尺寸和位置
    const size = mainWindow.getSize()
    const position = mainWindow.getPosition()
    console.log('当前窗口尺寸:', size)
    console.log('当前窗口位置:', position)
  }, 1000)

  setTimeout(() => {
    // 最小化窗口
    console.log('最小化窗口')
    mainWindow.minimize()
  }, 2000)

  setTimeout(() => {
    // 恢复窗口
    console.log('恢复窗口')
    mainWindow.restore()
  }, 3000)

  setTimeout(() => {
    // 调整窗口尺寸
    console.log('调整窗口尺寸')
    mainWindow.setSize(900, 700)
  }, 4000)

  setTimeout(() => {
    // 移动窗口位置（相对于当前位置）
    console.log('移动窗口位置')
    mainWindow.moveBy(50, 50)
  }, 5000)

  setTimeout(() => {
    // 最大化窗口
    console.log('最大化窗口')
    mainWindow.maximize()
  }, 6000)

  setTimeout(() => {
    // 再次恢复窗口
    console.log('再次恢复窗口')
    mainWindow.restore()
  }, 7000)
}

/**
 * 设置应用程序生命周期事件
 */
function setupAppLifecycle() {
  // 当Electron完成初始化时
  app.whenReady().then(() => {
    console.log('应用程序已就绪')
    createBasicWindow()
    demonstrateWindowControls()

    // macOS特定行为：点击dock图标时重新创建窗口
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createBasicWindow()
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

// 捕获未处理的异常
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error)
})

/**
 * 扩展知识：窗口配置最佳实践
 * 
 * 1. 安全性考虑：
 *    - 始终禁用nodeIntegration
 *    - 始终启用contextIsolation
 *    - 仅通过preload脚本暴露必要的API
 *    - 设置适当的contentSecurityPolicy
 * 
 * 2. 性能优化：
 *    - 避免使用transparent属性（会显著影响性能）
 *    - 合理设置窗口大小和最小/最大限制
 *    - 按需创建窗口，避免同时创建大量窗口
 *    - 关闭不需要的窗口以释放资源
 * 
 * 3. 用户体验：
 *    - 保存和恢复窗口状态（大小、位置）
 *    - 提供清晰的窗口管理界面
 *    - 合理的默认窗口大小和位置
 *    - 避免频繁创建和销毁窗口
 */