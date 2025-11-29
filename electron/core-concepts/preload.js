// preload.js - 预加载脚本

// 从 Electron 模块中导入 contextBridge 和 ipcRenderer
const { contextBridge, ipcRenderer } = require('electron')

// 使用 contextBridge 安全地暴露 API 到渲染进程
// 这是最佳安全实践，可以防止不安全的直接访问 Node.js API
contextBridge.exposeInMainWorld('electronAPI', {
  // 示例：获取应用信息
  getAppInfo: () => ipcRenderer.invoke('get-app-info'),
  
  // 示例：显示通知
  showNotification: (title, body) => {
    ipcRenderer.send('show-notification', { title, body })
  },
  
  // 示例：注册事件监听器
  onWindowResize: (callback) => {
    ipcRenderer.on('window-resize', (event, dimensions) => {
      callback(dimensions)
    })
    
    // 返回清理函数
    return () => ipcRenderer.removeAllListeners('window-resize')
  }
})

// 安全注意事项：
// 1. 只暴露必要的 API
// 2. 避免将整个 ipcRenderer 实例暴露给渲染进程
// 3. 验证和清理所有传入和传出的数据
// 4. 不要在预加载脚本中执行不安全的操作

// 预加载脚本中可以访问 Node.js API
// 但不应该直接暴露这些 API 给渲染进程
const fs = require('fs')
const path = require('path')

// 示例：在预加载脚本中执行一些初始化操作
function initializeApp() {
  console.log('预加载脚本执行中...')
  console.log(`当前应用路径: ${process.execPath}`)
  console.log(`Electron 版本: ${process.versions.electron}`)
}

// 执行初始化
initializeApp()