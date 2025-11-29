// preload.js - 窗口管理示例的预加载脚本

const { contextBridge, ipcRenderer } = require('electron')

// 使用contextBridge安全地暴露API给渲染进程
contextBridge.exposeInMainWorld('electronWindowAPI', {
  // 窗口基本控制方法
  minimizeWindow: () => ipcRenderer.send('window-control', 'minimize'),
  maximizeWindow: () => ipcRenderer.send('window-control', 'maximize'),
  restoreWindow: () => ipcRenderer.send('window-control', 'restore'),
  closeWindow: () => ipcRenderer.send('window-control', 'close'),
  focusWindow: () => ipcRenderer.send('window-control', 'focus'),
  
  // 窗口尺寸和位置控制
  resizeWindow: (width, height) => ipcRenderer.send('resize-window', { width, height }),
  moveWindow: (x, y) => ipcRenderer.send('move-window', { x, y }),
  centerWindow: () => ipcRenderer.send('window-control', 'center'),
  
  // 获取窗口信息
  getWindowBounds: () => ipcRenderer.invoke('get-window-bounds'),
  getWindowState: () => ipcRenderer.invoke('get-window-state'),
  
  // 窗口状态变更
  setWindowAlwaysOnTop: (alwaysOnTop) => ipcRenderer.send('set-always-on-top', alwaysOnTop),
  setFullScreen: (fullScreen) => ipcRenderer.send('set-full-screen', fullScreen),
  
  // 多窗口管理
  createNewWindow: (options) => ipcRenderer.send('create-new-window', options),
  closeAllWindows: () => ipcRenderer.send('close-all-windows'),
  
  // 窗口事件监听
  onWindowStateChange: (callback) => {
    const handler = (event, state) => callback(state)
    ipcRenderer.on('window-state-changed', handler)
    return () => ipcRenderer.removeListener('window-state-changed', handler)
  },
  
  // 窗口动画
  flashFrame: (flash) => ipcRenderer.send('flash-frame', flash),
  
  // 窗口关系
  getChildWindows: () => ipcRenderer.invoke('get-child-windows'),
  
  // 高级窗口操作
  takeWindowSnapshot: () => ipcRenderer.invoke('take-window-snapshot'),
  printWindow: (options) => ipcRenderer.invoke('print-window', options),
  
  // 窗口内容操作
  reloadWindow: () => ipcRenderer.send('reload-window'),
  navigateBack: () => ipcRenderer.send('navigate-back'),
  navigateForward: () => ipcRenderer.send('navigate-forward'),
  loadURL: (url) => ipcRenderer.send('load-url', url),
  
  // 开发者工具控制
  toggleDevTools: () => ipcRenderer.send('toggle-dev-tools')
})

// 预加载脚本中的初始化日志
console.log('窗口管理预加载脚本已加载')

/**
 * 安全注意事项：
 * 1. 我们只暴露了必要的API，而不是整个ipcRenderer实例
 * 2. 所有API调用都经过上下文桥接，确保渲染进程无法直接访问Node.js API
 * 3. 渲染进程无法修改或绕过这些API调用，增强了应用安全性
 * 4. 使用invoke/handle模式进行异步通信，避免阻塞渲染进程
 * 
 * 最佳实践：
 * - 为每个API功能创建明确的命名和用途
 * - 在主进程中验证传入的参数，确保安全性
 * - 使用try/catch捕获可能的错误
 * - 为渲染进程提供清晰的错误信息
 */

// 可以在这里添加一些初始化逻辑，但避免执行过多操作，保持预加载脚本轻量化

// 检测当前环境
const isDev = process.env.NODE_ENV === 'development'
if (isDev) {
  console.log('运行在开发环境中')
} else {
  console.log('运行在生产环境中')
}

// 可选：添加一些性能监控逻辑
const startTime = Date.now()
process.once('loaded', () => {
  const loadTime = Date.now() - startTime
  console.log(`预加载脚本加载耗时: ${loadTime}ms`)
})