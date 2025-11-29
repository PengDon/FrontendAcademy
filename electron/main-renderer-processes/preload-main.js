// preload-main.js - 主窗口的预加载脚本
const { contextBridge, ipcRenderer } = require('electron')

// 安全地向主窗口的渲染进程暴露 API
contextBridge.exposeInMainWorld('mainWindowAPI', {
  // 创建次要窗口
  createSecondaryWindow: () => ipcRenderer.invoke('create-secondary-window'),
  
  // 获取系统信息
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  
  // 向主进程发送消息
  sendMessage: (content, broadcast = false) => {
    ipcRenderer.send('message-from-renderer', { content, broadcast })
  },
  
  // 执行耗时任务
  performHeavyTask: (iterations) => ipcRenderer.invoke('perform-heavy-task', iterations),
  
  // 监听来自主进程的消息
  onMessageFromMain: (callback) => {
    // 定义消息处理函数
    const messageHandler = (event, message) => {
      callback(message)
    }
    
    // 添加事件监听器
    ipcRenderer.on('message-from-main', messageHandler)
    
    // 返回清理函数
    return () => {
      ipcRenderer.removeListener('message-from-main', messageHandler)
    }
  },
  
  // 监听窗口大小变化
  onWindowResized: (callback) => {
    const resizeHandler = (event, dimensions) => {
      callback(dimensions)
    }
    
    ipcRenderer.on('window-resized', resizeHandler)
    
    return () => {
      ipcRenderer.removeListener('window-resized', resizeHandler)
    }
  },
  
  // 关闭窗口
  closeWindow: (windowName) => ipcRenderer.invoke('close-window', windowName)
})

// 预加载脚本中的初始化日志
console.log('主窗口预加载脚本已加载')
console.log(`Electron 版本: ${process.versions.electron}`)

// 注意：不要在此处执行任何直接操作DOM的代码，因为DOM可能尚未准备就绪
// 所有与DOM相关的操作应该在渲染进程的 DOMContentLoaded 事件中执行