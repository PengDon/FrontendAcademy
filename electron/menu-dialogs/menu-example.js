// menu-example.js - Electron菜单示例代码

const { Menu, MenuItem, BrowserWindow, app, shell } = require('electron')

// 全局菜单引用，以便后续可以修改
let mainMenu = null
let contextMenu = null

/**
 * 创建应用程序主菜单
 * @param {BrowserWindow} mainWindow - 主窗口引用
 * @returns {Menu} 创建的主菜单
 */
function createMainMenu(mainWindow) {
  // 定义菜单项模板
  const template = [
    {
      label: '文件',
      submenu: [
        {
          label: '新建',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            // 处理新建操作
            mainWindow.webContents.send('menu-action', { action: 'new-file' })
          }
        },
        {
          label: '打开',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            // 处理打开操作
            mainWindow.webContents.send('menu-action', { action: 'open-file' })
          }
        },
        {
          label: '保存',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            // 处理保存操作
            mainWindow.webContents.send('menu-action', { action: 'save-file' })
          }
        },
        {
          type: 'separator' // 分隔线
        },
        {
          label: '退出',
          accelerator: 'CmdOrCtrl+Q',
          role: process.platform === 'darwin' ? 'close' : 'quit' // 根据平台使用不同的角色
        }
      ]
    },
    {
      label: '编辑',
      submenu: [
        {
          role: 'undo' // 使用预定义的角色
        },
        {
          role: 'redo'
        },
        {
          type: 'separator'
        },
        {
          role: 'cut'
        },
        {
          role: 'copy'
        },
        {
          role: 'paste'
        },
        {
          role: 'delete'
        },
        {
          type: 'separator'
        },
        {
          role: 'selectAll'
        }
      ]
    },
    {
      label: '视图',
      submenu: [
        {
          label: '重新加载',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            mainWindow.reload()
          }
        },
        {
          label: '切换全屏',
          accelerator: process.platform === 'darwin' ? 'Ctrl+Command+F' : 'F11',
          click: () => {
            mainWindow.setFullScreen(!mainWindow.isFullScreen())
          }
        },
        {
          label: '开发者工具',
          accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
          click: () => {
            mainWindow.webContents.toggleDevTools()
          }
        }
      ]
    },
    {
      label: '窗口',
      submenu: [
        {
          label: '最小化',
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize'
        },
        {
          label: '关闭',
          accelerator: 'CmdOrCtrl+W',
          role: 'close'
        },
        {
          type: 'separator'
        },
        {
          label: '新建窗口',
          click: () => {
            // 创建新窗口的逻辑
            mainWindow.webContents.send('menu-action', { action: 'new-window' })
          }
        }
      ]
    },
    {
      label: '帮助',
      submenu: [
        {
          label: '关于',
          click: () => {
            mainWindow.webContents.send('menu-action', { action: 'show-about' })
          }
        },
        {
          label: 'Electron文档',
          click: () => {
            // 打开外部链接
            shell.openExternal('https://www.electronjs.org/docs')
          }
        }
      ]
    }
  ]

  // 处理macOS特定的菜单
  if (process.platform === 'darwin') {
    // 在macOS上，第一个菜单应该是应用名称
    template.unshift({
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    })
  }

  // 创建菜单
  mainMenu = Menu.buildFromTemplate(template)
  
  // 设置为应用程序菜单
  Menu.setApplicationMenu(mainMenu)
  
  return mainMenu
}

/**
 * 创建上下文菜单
 * @returns {Menu} 创建的上下文菜单
 */
function createContextMenu() {
  // 创建上下文菜单
  contextMenu = new Menu()
  
  // 添加菜单项
  contextMenu.append(new MenuItem({
    label: '复制',
    role: 'copy'
  }))
  
  contextMenu.append(new MenuItem({
    label: '粘贴',
    role: 'paste'
  }))
  
  contextMenu.append(new MenuItem({
    type: 'separator'
  }))
  
  contextMenu.append(new MenuItem({
    label: '检查元素',
    accelerator: 'CmdOrCtrl+Shift+C',
    click: (item, focusedWindow) => {
      if (focusedWindow) {
        focusedWindow.webContents.toggleDevTools({ mode: 'detach' })
      }
    }
  }))
  
  return contextMenu
}

/**
 * 创建具有复选框和单选按钮的菜单
 * @returns {Menu} 创建的菜单
 */
function createAdvancedMenu() {
  // 创建一个包含复选框和单选按钮的菜单
  const advancedMenu = new Menu()
  
  // 添加复选框菜单项
  const showToolbarItem = new MenuItem({
    label: '显示工具栏',
    type: 'checkbox',
    checked: true,
    click: (item) => {
      console.log('显示工具栏:', item.checked)
      // 这里可以发送消息到渲染进程更新UI
    }
  })
  
  advancedMenu.append(showToolbarItem)
  
  // 添加单选按钮组
  advancedMenu.append(new MenuItem({ type: 'separator' }))
  
  const themeItems = [
    new MenuItem({
      label: '浅色主题',
      type: 'radio',
      checked: false,
      click: (item) => {
        console.log('选择主题:', item.label)
        // 这里可以发送消息到渲染进程更新主题
      }
    }),
    new MenuItem({
      label: '深色主题',
      type: 'radio',
      checked: true,
      click: (item) => {
        console.log('选择主题:', item.label)
        // 这里可以发送消息到渲染进程更新主题
      }
    }),
    new MenuItem({
      label: '跟随系统',
      type: 'radio',
      checked: false,
      click: (item) => {
        console.log('选择主题:', item.label)
        // 这里可以发送消息到渲染进程更新主题
      }
    })
  ]
  
  themeItems.forEach(item => advancedMenu.append(item))
  
  return advancedMenu
}

/**
 * 动态更新菜单
 * @param {string} menuId - 菜单ID
 * @param {Object} updates - 要更新的属性
 */
function updateMenuItem(menuId, updates) {
  if (!mainMenu) return
  
  // 递归查找并更新菜单项
  function findAndUpdate(menuItems) {
    for (const item of menuItems) {
      if (item.id === menuId) {
        Object.assign(item, updates)
        return true
      }
      
      if (item.submenu) {
        if (findAndUpdate(item.submenu.items)) {
          return true
        }
      }
    }
    return false
  }
  
  const found = findAndUpdate(mainMenu.items)
  if (found) {
    // 如果是应用程序菜单，需要重新设置
    Menu.setApplicationMenu(mainMenu)
  }
}

/**
 * 动态启用/禁用菜单项
 * @param {BrowserWindow} window - 窗口引用
 */
function setupDynamicMenu(window) {
  // 监听窗口焦点变化，根据焦点状态启用/禁用菜单项
  window.on('focus', () => {
    // 启用菜单项
    updateMenuItem('save-file', { enabled: true })
  })
  
  window.on('blur', () => {
    // 禁用菜单项
    updateMenuItem('save-file', { enabled: false })
  })
}

// 导出函数
module.exports = {
  createMainMenu,
  createContextMenu,
  createAdvancedMenu,
  updateMenuItem,
  setupDynamicMenu
}