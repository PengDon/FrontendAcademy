// preload.js - 菜单和对话框示例的预加载脚本

const { contextBridge, ipcRenderer } = require('electron')

// 使用contextBridge安全地暴露API给渲染进程
contextBridge.exposeInMainWorld('electronMenuDialogAPI', {
  // 菜单相关API
  showContextMenu: () => ipcRenderer.send('show-context-menu'),
  showAdvancedMenu: () => ipcRenderer.send('show-advanced-menu'),
  updateMenuItem: (menuId, updates) => ipcRenderer.send('update-menu-item', { menuId, updates }),
  
  // 对话框相关API
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  showMessageBox: (options) => ipcRenderer.invoke('show-message-box', options),
  showConfirmDialog: (message, detail) => ipcRenderer.invoke('show-confirm-dialog', { message, detail }),
  showErrorDialog: (message, detail) => ipcRenderer.invoke('show-error-dialog', { message, detail }),
  showWarningDialog: (message, detail) => ipcRenderer.invoke('show-warning-dialog', { message, detail }),
  showInfoDialog: (message, detail) => ipcRenderer.invoke('show-info-dialog', { message, detail }),
  openAndReadFile: () => ipcRenderer.invoke('open-and-read-file'),
  saveFileWithDialog: (content, defaultFileName) => 
    ipcRenderer.invoke('save-file-with-dialog', { content, defaultFileName }),
  showCustomButtonDialog: (message, buttons) => 
    ipcRenderer.invoke('show-custom-button-dialog', { message, buttons }),
  
  // 菜单操作事件
  onMenuAction: (callback) => {
    const handler = (event, action) => callback(action)
    ipcRenderer.on('menu-action', handler)
    return () => ipcRenderer.removeListener('menu-action', handler)
  },
  
  // 自定义菜单项点击事件
  onCustomMenuItemClick: (callback) => {
    const handler = (event, data) => callback(data)
    ipcRenderer.on('custom-menu-item-click', handler)
    return () => ipcRenderer.removeListener('custom-menu-item-click', handler)
  }
})

// 预加载脚本中的初始化日志
console.log('菜单和对话框预加载脚本已加载')

// 安全注意事项：
// 1. 我们只暴露了必要的API，而不是整个ipcRenderer实例
// 2. 所有API调用都经过上下文桥接，确保渲染进程无法直接访问Node.js API
// 3. 渲染进程无法修改或绕过这些API调用，增强了应用安全性
// 4. 使用invoke/handle模式进行异步通信，避免阻塞渲染进程