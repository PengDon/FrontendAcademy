// dialog-example.js - Electron对话框示例代码

const { dialog, BrowserWindow } = require('electron')
const fs = require('fs').promises
const path = require('path')

/**
 * 显示打开文件对话框
 * @param {BrowserWindow} window - 父窗口
 * @param {Object} options - 对话框选项
 * @returns {Promise<string[]>} 选择的文件路径数组
 */
async function showOpenDialog(window, options = {}) {
  // 默认选项
  const defaultOptions = {
    title: '打开文件',
    defaultPath: process.env.HOME || process.env.USERPROFILE,
    buttonLabel: '打开',
    filters: [
      { name: '所有文件', extensions: ['*'] },
      { name: '文本文件', extensions: ['txt', 'md', 'js', 'json', 'html', 'css'] },
      { name: '图像文件', extensions: ['png', 'jpg', 'jpeg', 'gif', 'svg'] }
    ],
    properties: ['openFile', 'multiSelections'] // 允许多选
  }
  
  // 合并选项
  const dialogOptions = { ...defaultOptions, ...options }
  
  try {
    // 显示对话框
    const result = await dialog.showOpenDialog(window, dialogOptions)
    
    // 检查用户是否取消了操作
    if (result.canceled) {
      console.log('用户取消了文件选择')
      return []
    }
    
    // 返回选择的文件路径
    return result.filePaths
  } catch (error) {
    console.error('打开文件对话框出错:', error)
    throw error
  }
}

/**
 * 显示保存文件对话框
 * @param {BrowserWindow} window - 父窗口
 * @param {Object} options - 对话框选项
 * @returns {Promise<string|null>} 选择的保存路径，如果用户取消则返回null
 */
async function showSaveDialog(window, options = {}) {
  // 默认选项
  const defaultOptions = {
    title: '保存文件',
    defaultPath: path.join(
      process.env.HOME || process.env.USERPROFILE,
      'untitled.txt'
    ),
    buttonLabel: '保存',
    filters: [
      { name: '所有文件', extensions: ['*'] },
      { name: '文本文件', extensions: ['txt', 'md'] },
      { name: 'JSON文件', extensions: ['json'] }
    ],
    showsTagField: false
  }
  
  // 合并选项
  const dialogOptions = { ...defaultOptions, ...options }
  
  try {
    // 显示对话框
    const result = await dialog.showSaveDialog(window, dialogOptions)
    
    // 检查用户是否取消了操作
    if (result.canceled) {
      console.log('用户取消了保存操作')
      return null
    }
    
    // 返回选择的保存路径
    return result.filePath
  } catch (error) {
    console.error('保存文件对话框出错:', error)
    throw error
  }
}

/**
 * 显示消息对话框
 * @param {BrowserWindow} window - 父窗口
 * @param {Object} options - 对话框选项
 * @returns {Promise<Electron.MessageBoxReturnValue>} 对话框返回值
 */
async function showMessageBox(window, options = {}) {
  // 默认选项
  const defaultOptions = {
    title: '消息',
    message: '这是一条消息',
    detail: '',
    type: 'info', // 'none', 'info', 'error', 'question', 'warning'
    buttons: ['确定'],
    defaultId: 0,
    cancelId: -1
  }
  
  // 合并选项
  const dialogOptions = { ...defaultOptions, ...options }
  
  try {
    // 显示对话框
    return await dialog.showMessageBox(window, dialogOptions)
  } catch (error) {
    console.error('消息对话框出错:', error)
    throw error
  }
}

/**
 * 显示确认对话框
 * @param {BrowserWindow} window - 父窗口
 * @param {string} message - 确认消息
 * @param {string} detail - 详细描述
 * @returns {Promise<boolean>} 用户是否确认
 */
async function showConfirmDialog(window, message, detail = '') {
  const result = await showMessageBox(window, {
    title: '确认',
    message,
    detail,
    type: 'question',
    buttons: ['取消', '确认'],
    defaultId: 1,
    cancelId: 0
  })
  
  // 如果用户点击了'确认'按钮（索引为1）
  return result.response === 1
}

/**
 * 显示错误对话框
 * @param {BrowserWindow} window - 父窗口
 * @param {string} message - 错误消息
 * @param {string} detail - 详细错误信息
 */
async function showErrorDialog(window, message, detail = '') {
  await showMessageBox(window, {
    title: '错误',
    message,
    detail,
    type: 'error',
    buttons: ['确定']
  })
}

/**
 * 显示警告对话框
 * @param {BrowserWindow} window - 父窗口
 * @param {string} message - 警告消息
 * @param {string} detail - 详细警告信息
 */
async function showWarningDialog(window, message, detail = '') {
  await showMessageBox(window, {
    title: '警告',
    message,
    detail,
    type: 'warning',
    buttons: ['确定']
  })
}

/**
 * 显示信息对话框
 * @param {BrowserWindow} window - 父窗口
 * @param {string} message - 信息消息
 * @param {string} detail - 详细信息
 */
async function showInfoDialog(window, message, detail = '') {
  await showMessageBox(window, {
    title: '信息',
    message,
    detail,
    type: 'info',
    buttons: ['确定']
  })
}

/**
 * 带文件操作的对话框示例 - 打开并读取文件
 * @param {BrowserWindow} window - 父窗口
 * @returns {Promise<Object|null>} 文件内容和路径信息，如果用户取消则返回null
 */
async function openAndReadFile(window) {
  try {
    // 显示打开文件对话框
    const filePaths = await showOpenDialog(window, {
      properties: ['openFile'], // 只允许选择单个文件
      filters: [
        { name: '文本文件', extensions: ['txt', 'md', 'js', 'json', 'html', 'css'] },
        { name: '所有文件', extensions: ['*'] }
      ]
    })
    
    // 如果用户取消或未选择文件
    if (filePaths.length === 0) {
      return null
    }
    
    const filePath = filePaths[0]
    
    // 读取文件内容
    const content = await fs.readFile(filePath, 'utf8')
    
    return {
      filePath,
      fileName: path.basename(filePath),
      directory: path.dirname(filePath),
      content
    }
  } catch (error) {
    console.error('打开并读取文件出错:', error)
    await showErrorDialog(window, '无法打开文件', error.message)
    return null
  }
}

/**
 * 带文件操作的对话框示例 - 写入文件
 * @param {BrowserWindow} window - 父窗口
 * @param {string} content - 要写入的内容
 * @param {string} defaultFileName - 默认文件名
 * @returns {Promise<boolean>} 是否成功保存
 */
async function saveFileWithDialog(window, content, defaultFileName = 'untitled.txt') {
  try {
    // 显示保存文件对话框
    const filePath = await showSaveDialog(window, {
      defaultPath: path.join(
        process.env.HOME || process.env.USERPROFILE,
        defaultFileName
      )
    })
    
    // 如果用户取消
    if (!filePath) {
      return false
    }
    
    // 检查文件是否已存在
    try {
      await fs.access(filePath)
      // 文件已存在，询问是否覆盖
      const shouldOverwrite = await showConfirmDialog(
        window,
        '文件已存在',
        `确定要覆盖 "${path.basename(filePath)}" 吗？`
      )
      
      if (!shouldOverwrite) {
        return false
      }
    } catch (error) {
      // 文件不存在，继续保存
    }
    
    // 写入文件
    await fs.writeFile(filePath, content, 'utf8')
    
    // 显示成功消息
    await showInfoDialog(window, '保存成功', `文件已保存到: ${filePath}`)
    
    return true
  } catch (error) {
    console.error('保存文件出错:', error)
    await showErrorDialog(window, '保存失败', error.message)
    return false
  }
}

/**
 * 自定义按钮的消息对话框
 * @param {BrowserWindow} window - 父窗口
 * @param {string} message - 消息内容
 * @param {string[]} buttons - 按钮文本数组
 * @returns {Promise<number>} 用户点击的按钮索引
 */
async function showCustomButtonDialog(window, message, buttons) {
  const result = await showMessageBox(window, {
    title: '自定义选择',
    message,
    type: 'none',
    buttons,
    defaultId: 0
  })
  
  return result.response
}

// 导出函数
module.exports = {
  showOpenDialog,
  showSaveDialog,
  showMessageBox,
  showConfirmDialog,
  showErrorDialog,
  showWarningDialog,
  showInfoDialog,
  openAndReadFile,
  saveFileWithDialog,
  showCustomButtonDialog
}