// preload-secondary.js - 次要窗口的预加载脚本
const { contextBridge, ipcRenderer } = require('electron')

// 安全地向次要窗口的渲染进程暴露 API
contextBridge.exposeInMainWorld('secondaryWindowAPI', {
  // 获取系统信息
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  
  // 向主进程发送消息
  sendMessage: (content) => {
    ipcRenderer.send('message-from-renderer', { content, broadcast: false })
  },
  
  // 监听来自主进程的广播消息
  onBroadcastMessage: (callback) => {
    const broadcastHandler = (event, message) => {
      callback(message)
    }
    
    ipcRenderer.on('broadcast-message', broadcastHandler)
    
    return () => {
      ipcRenderer.removeListener('broadcast-message', broadcastHandler)
    }
  },
  
  // 监听来自主进程的直接消息
  onMessageFromMain: (callback) => {
    const messageHandler = (event, message) => {
      callback(message)
    }
    
    ipcRenderer.on('message-from-main', messageHandler)
    
    return () => {
      ipcRenderer.removeListener('message-from-main', messageHandler)
    }
  },
  
  // 关闭当前窗口
  closeWindow: () => ipcRenderer.invoke('close-window', 'secondary')
})

// 预加载脚本中的初始化日志
console.log('次要窗口预加载脚本已加载')
console.log(`Electron 版本: ${process.versions.electron}`)

// 注意：不要在此处执行任何直接操作DOM的代码，因为DOM可能尚未准备就绪
// 所有与DOM相关的操作应该在渲染进程的 DOMContentLoaded 事件中执行