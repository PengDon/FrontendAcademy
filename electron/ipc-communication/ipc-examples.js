// ipc-examples.js - IPC通信模式示例代码

// 这个文件包含了各种IPC通信模式的示例实现
// 在实际应用中，你需要根据具体需求选择合适的通信模式

// ============================
// 主进程代码示例 (main.js)
// ============================
/*
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  mainWindow.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
  setupIPCListeners()
})

// 设置IPC监听器
function setupIPCListeners() {
  // 1. 异步通信模式 (invoke/handle)
  ipcMain.handle('async-get-data', async (event, arg) => {
    try {
      // 模拟异步操作，如API调用或文件读取
      await new Promise(resolve => setTimeout(resolve, 1000))
      return {
        success: true,
        data: `处理后的数据: ${arg}`,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  })

  // 2. 同步通信模式 (send/sendSync)
  ipcMain.on('sync-get-app-version', (event) => {
    // 注意：同步调用会阻塞主线程，应尽量避免使用
    event.returnValue = app.getVersion()
  })

  // 3. 单向通信模式 (send/on)
  ipcMain.on('log-message', (event, message) => {
    console.log(`[渲染进程日志] ${message}`)
    // 可以选择回复，但不是必须的
  })

  // 4. 主进程到渲染进程通信 (send)
  // 这里我们设置一个定时器，定期向渲染进程发送数据
  let counter = 0
  setInterval(() => {
    const windows = BrowserWindow.getAllWindows()
    windows.forEach(window => {
      if (window.webContents) {
        window.webContents.send('main-process-update', {
          counter: counter++,
          timestamp: new Date().toISOString()
        })
      }
    })
  }, 3000)

  // 5. 请求-响应模式封装示例
  ipcMain.handle('api-request', async (event, { endpoint, params }) => {
    // 模拟API请求处理
    console.log(`处理API请求: ${endpoint}`, params)
    
    // 根据不同的endpoint执行不同的操作
    switch (endpoint) {
      case 'get-user-info':
        return { user: { id: 1, name: '测试用户' }, permissions: ['read', 'write'] }
      case 'save-settings':
        return { success: true, message: '设置已保存' }
      default:
        throw new Error(`未知的API端点: ${endpoint}`)
    }
  })

  // 6. 错误处理示例
  ipcMain.handle('operation-with-error', async (event, shouldFail) => {
    if (shouldFail) {
      // 抛出错误，会被渲染进程的catch捕获
      throw new Error('操作故意失败')
    }
    return { success: true, result: '操作成功完成' }
  })

  // 7. 大数据传输示例
  ipcMain.handle('process-large-data', async (event, data) => {
    console.log(`开始处理大数据: ${data.length} 条记录`)
    
    // 模拟处理大数据集
    const processed = data.map((item, index) => ({
      id: index,
      original: item,
      processed: item.toUpperCase(),
      timestamp: Date.now()
    }))
    
    console.log('大数据处理完成')
    return { count: processed.length, data: processed }
  })
}
*/

// ============================
// 预加载脚本示例 (preload.js)
// ============================
/*
const { contextBridge, ipcRenderer } = require('electron')

// 使用contextBridge安全地暴露API
contextBridge.exposeInMainWorld('electronAPI', {
  // 1. 异步通信 - 使用invoke
  asyncOperation: (data) => ipcRenderer.invoke('async-get-data', data),
  
  // 2. 同步通信 - 注意：同步调用会阻塞渲染进程
  syncOperation: () => ipcRenderer.sendSync('sync-get-app-version'),
  
  // 3. 单向通信
  logToMain: (message) => ipcRenderer.send('log-message', message),
  
  // 4. 注册事件监听器
  onMainProcessUpdate: (callback) => {
    // 定义事件处理函数
    const handleUpdate = (event, data) => {
      callback(data)
    }
    
    // 添加监听器
    ipcRenderer.on('main-process-update', handleUpdate)
    
    // 返回清理函数
    return () => {
      ipcRenderer.removeListener('main-process-update', handleUpdate)
    }
  },
  
  // 5. 请求-响应模式封装
  apiRequest: (endpoint, params = {}) => {
    return ipcRenderer.invoke('api-request', { endpoint, params })
  },
  
  // 6. 错误处理演示
  operationWithError: (shouldFail) => {
    return ipcRenderer.invoke('operation-with-error', shouldFail)
  },
  
  // 7. 大数据传输
  processLargeData: (data) => {
    return ipcRenderer.invoke('process-large-data', data)
  }
})
*/

// ============================
// 渲染进程代码示例 (renderer.js)
// ============================
/*
// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', () => {
  // 检查预加载API是否可用
  if (!window.electronAPI) {
    console.error('Electron API未可用')
    return
  }
  
  const { electronAPI } = window
  
  // 示例1: 异步通信
  async function demonstrateAsyncCommunication() {
    console.log('开始异步通信示例...')
    try {
      const result = await electronAPI.asyncOperation('测试数据')
      console.log('异步操作结果:', result)
    } catch (error) {
      console.error('异步操作失败:', error)
    }
  }
  
  // 示例2: 同步通信
  function demonstrateSyncCommunication() {
    console.log('开始同步通信示例...')
    try {
      // 注意：这会阻塞渲染进程直到收到响应
      const version = electronAPI.syncOperation()
      console.log('同步操作结果:', version)
    } catch (error) {
      console.error('同步操作失败:', error)
    }
  }
  
  // 示例3: 单向通信
  function demonstrateOneWayCommunication() {
    electronAPI.logToMain('这是一条从渲染进程发送到主进程的日志消息')
  }
  
  // 示例4: 监听主进程事件
  function demonstrateMainProcessEvents() {
    console.log('开始监听主进程事件...')
    
    // 注册监听器并获取清理函数
    const cleanup = electronAPI.onMainProcessUpdate((data) => {
      console.log('收到主进程更新:', data)
    })
    
    // 在组件卸载时清理监听器
    // 这里为了演示，我们在10秒后清理监听器
    setTimeout(() => {
      console.log('停止监听主进程事件')
      cleanup()
    }, 10000)
  }
  
  // 示例5: 请求-响应模式封装
  async function demonstrateRequestResponsePattern() {
    console.log('开始请求-响应模式示例...')
    
    try {
      // 调用不同的API端点
      const userInfo = await electronAPI.apiRequest('get-user-info')
      console.log('用户信息:', userInfo)
      
      const settingsResult = await electronAPI.apiRequest('save-settings', { 
        theme: 'dark', 
        notifications: true 
      })
      console.log('保存设置结果:', settingsResult)
    } catch (error) {
      console.error('API请求失败:', error)
    }
  }
  
  // 示例6: 错误处理
  async function demonstrateErrorHandling() {
    console.log('开始错误处理示例...')
    
    // 成功的操作
    try {
      const successResult = await electronAPI.operationWithError(false)
      console.log('成功操作结果:', successResult)
    } catch (error) {
      console.error('不应该到达这里:', error)
    }
    
    // 失败的操作
    try {
      await electronAPI.operationWithError(true)
    } catch (error) {
      console.error('正确捕获的错误:', error)
    }
  }
  
  // 示例7: 大数据传输
  async function demonstrateLargeDataTransfer() {
    console.log('开始大数据传输示例...')
    
    // 创建一个大数据集 (10,000个字符串)
    const largeDataSet = Array.from({ length: 10000 }, (_, i) => `item-${i}`)
    
    try {
      console.time('大数据传输')
      const result = await electronAPI.processLargeData(largeDataSet)
      console.timeEnd('大数据传输')
      console.log('大数据处理结果:', `处理了 ${result.count} 条记录`)
    } catch (error) {
      console.error('大数据处理失败:', error)
    }
  }
  
  // 示例8: IPC通信最佳实践 - 批量处理
  async function demonstrateBatchProcessing() {
    console.log('开始批量处理示例...')
    
    // 模拟多个需要处理的任务
    const tasks = [1, 2, 3, 4, 5]
    
    // 使用Promise.all并行处理
    try {
      const promises = tasks.map(taskId => 
        electronAPI.asyncOperation(`任务-${taskId}`)
      )
      
      const results = await Promise.all(promises)
      console.log('批量处理结果:', results)
    } catch (error) {
      console.error('批量处理失败:', error)
    }
  }
  
  // 运行所有示例
  function runAllExamples() {
    demonstrateAsyncCommunication()
    demonstrateSyncCommunication()
    demonstrateOneWayCommunication()
    demonstrateMainProcessEvents()
    demonstrateRequestResponsePattern()
    demonstrateErrorHandling()
    demonstrateLargeDataTransfer()
    demonstrateBatchProcessing()
  }
  
  // 启动所有示例
  runAllExamples()
})
*/

// ============================
// IPC通信最佳实践总结
// ============================
/*
1. 优先使用异步通信 (invoke/handle) 避免阻塞进程
2. 仅在必要时使用同步通信 (sendSync)
3. 使用contextBridge安全地暴露API
4. 始终清理不再需要的事件监听器
5. 实现适当的错误处理机制
6. 对于大数据传输，考虑分批处理或使用其他策略
7. 避免在IPC通道上传输敏感信息
8. 为复杂操作设计良好的请求-响应模式
9. 使用TypeScript类型定义来确保通信数据的类型安全
10. 考虑使用中间件模式来处理常见的横切关注点
*/