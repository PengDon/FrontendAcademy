# Electron 窗口管理示例

本目录提供了Electron窗口管理相关的示例代码和详细说明，帮助开发者掌握Electron应用中窗口的创建、控制和优化技巧。

## 目录内容

- `README.md`: 窗口管理概览和示例说明
- `basic-window.js`: 基础窗口创建和控制示例
- `window-events.js`: 窗口事件处理示例
- `window-states.js`: 窗口状态管理示例
- `multi-window.js`: 多窗口应用示例
- `window-features.js`: 窗口高级特性示例
- `window-optimization.js`: 窗口性能优化示例
- `preload.js`: 窗口预加载脚本
- `index.html`: 主窗口界面
- `secondary.html`: 辅助窗口界面

## 窗口管理概述

Electron的窗口管理是构建桌面应用的核心功能，主要通过`BrowserWindow`模块实现。一个完整的窗口管理系统应包括以下几个方面：

### 1. 窗口生命周期管理

- 窗口创建与初始化
- 窗口显示与隐藏
- 窗口聚焦与失焦
- 窗口关闭与销毁

### 2. 窗口配置与样式

- 窗口尺寸与位置设置
- 窗口外观定制（无边框、透明等）
- 窗口图标与标题设置
- 窗口模式（最大化、全屏等）

### 3. 窗口事件处理

- 窗口大小变化事件
- 窗口位置变化事件
- 窗口聚焦状态变化事件
- 窗口关闭事件

### 4. 多窗口管理

- 主窗口与辅助窗口通信
- 窗口层级管理
- 窗口关系维护
- 窗口组管理

### 5. 窗口状态持久化

- 窗口尺寸与位置保存
- 窗口状态恢复
- 用户偏好设置

### 6. 窗口性能优化

- 窗口渲染优化
- 内存管理
- 资源占用控制

## 核心API说明

### BrowserWindow 类

`BrowserWindow`是Electron中创建和控制浏览器窗口的主要类。

#### 主要参数

```javascript
const { BrowserWindow } = require('electron')

const win = new BrowserWindow({
  width: 800,             // 窗口宽度
  height: 600,            // 窗口高度
  x: 0,                   // 窗口左上角x坐标
  y: 0,                   // 窗口左上角y坐标
  center: true,           // 窗口是否居中显示
  minWidth: 400,          // 窗口最小宽度
  minHeight: 300,         // 窗口最小高度
  maxWidth: 1600,         // 窗口最大宽度
  maxHeight: 1200,        // 窗口最大高度
  frame: true,            // 是否显示窗口边框和标题栏
  transparent: false,     // 窗口是否透明
  resizable: true,        // 窗口是否可调整大小
  movable: true,          // 窗口是否可移动
  minimizable: true,      // 窗口是否可最小化
  maximizable: true,      // 窗口是否可最大化
  closable: true,         // 窗口是否可关闭
  alwaysOnTop: false,     // 窗口是否总在最顶层
  fullscreen: false,      // 窗口是否全屏
  fullscreenable: true,   // 窗口是否可进入全屏状态
  title: 'Electron App',  // 窗口标题
  icon: 'path/to/icon.png', // 窗口图标
  backgroundColor: '#ffffff', // 窗口背景颜色
  hasShadow: true,        // 窗口是否有阴影
  titleBarStyle: 'default', // 标题栏样式（默认、隐藏、自定义）
  webPreferences: {       // WebPreferences配置
    preload: path.join(__dirname, 'preload.js'),
    nodeIntegration: false,
    contextIsolation: true,
    enableRemoteModule: false,
    devTools: true
  }
})
```

#### 常用方法

```javascript
// 加载URL或本地文件
win.loadURL('https://www.electronjs.org')
win.loadFile('index.html')

// 窗口显示控制
win.show()               // 显示窗口
win.hide()               // 隐藏窗口
win.focus()              // 聚焦窗口
win.blur()               // 失焦窗口

// 窗口尺寸控制
win.setSize(width, height) // 设置窗口尺寸
win.getSize()              // 获取窗口尺寸
win.resizeBy(deltaWidth, deltaHeight) // 调整窗口尺寸

// 窗口位置控制
win.setPosition(x, y)    // 设置窗口位置
win.getPosition()        // 获取窗口位置
win.moveBy(deltaX, deltaY) // 移动窗口位置

// 窗口状态控制
win.minimize()           // 最小化窗口
win.restore()            // 恢复窗口
win.maximize()           // 最大化窗口
win.setFullScreen(true)  // 设置全屏模式
win.isFullScreen()       // 检查是否全屏
win.setAlwaysOnTop(true) // 设置窗口总在最顶层

// 窗口关闭
win.close()              // 关闭窗口
win.destroy()            // 销毁窗口

// 窗口事件监听
win.on('closed', () => {
  // 窗口关闭后的清理工作
})

// 内容控制
win.webContents.loadURL('https://www.electronjs.org')
win.webContents.reload()
win.webContents.openDevTools()
```

## 窗口事件

BrowserWindow实例触发多种事件，可用于响应窗口状态变化：

```javascript
win.on('close', (event) => {
  // 窗口关闭前
  console.log('窗口即将关闭')
  // 可以阻止窗口关闭: event.preventDefault()
})

win.on('closed', () => {
  // 窗口已关闭
  console.log('窗口已关闭')
  // 清理窗口引用
  win = null
})

win.on('focus', () => {
  // 窗口获得焦点
  console.log('窗口获得焦点')
})

win.on('blur', () => {
  // 窗口失去焦点
  console.log('窗口失去焦点')
})

win.on('show', () => {
  // 窗口显示
  console.log('窗口已显示')
})

win.on('hide', () => {
  // 窗口隐藏
  console.log('窗口已隐藏')
})

win.on('maximize', () => {
  // 窗口最大化
  console.log('窗口已最大化')
})

win.on('unmaximize', () => {
  // 窗口取消最大化
  console.log('窗口已取消最大化')
})

win.on('minimize', () => {
  // 窗口最小化
  console.log('窗口已最小化')
})

win.on('restore', () => {
  // 窗口恢复
  console.log('窗口已恢复')
})

win.on('resize', () => {
  // 窗口大小变化
  console.log('窗口大小已变化')
  console.log('新尺寸:', win.getSize())
})

win.on('move', () => {
  // 窗口位置变化
  console.log('窗口位置已变化')
  console.log('新位置:', win.getPosition())
})

win.on('enter-full-screen', () => {
  // 进入全屏模式
  console.log('进入全屏模式')
})

win.on('leave-full-screen', () => {
  // 离开全屏模式
  console.log('离开全屏模式')
})
```

## 窗口状态持久化

使用`electron-store`或其他存储方案保存窗口状态：

```javascript
const Store = require('electron-store')
const store = new Store()

// 创建窗口时恢复上次的状态
function createWindow() {
  const bounds = store.get('windowBounds')
  
  const win = new BrowserWindow({
    width: bounds?.width || 800,
    height: bounds?.height || 600,
    x: bounds?.x,
    y: bounds?.y,
    // 其他配置...
  })
  
  // 保存窗口状态
  win.on('resize', saveWindowState)
  win.on('move', saveWindowState)
  
  function saveWindowState() {
    store.set('windowBounds', win.getBounds())
  }
}
```

## 多窗口应用最佳实践

1. **窗口引用管理**：使用Map或数组存储所有窗口引用
2. **窗口通信**：使用IPC进行窗口间通信
3. **窗口层级**：合理设置窗口层级，避免界面混乱
4. **窗口关闭策略**：定义明确的窗口关闭顺序和条件
5. **窗口复用**：避免重复创建相同类型的窗口

## 安全考虑

1. **禁用nodeIntegration**：在渲染进程中默认禁用Node.js集成
2. **启用contextIsolation**：隔离渲染进程上下文
3. **使用preload脚本**：通过contextBridge安全暴露API
4. **限制导航**：控制窗口可以加载的URL
5. **内容安全策略(CSP)**：设置适当的CSP头

## 性能优化

1. **延迟加载**：避免一次性创建所有窗口
2. **合理设置窗口属性**：如`hasShadow`、`transparent`等会影响性能
3. **减少DOM操作**：优化渲染进程中的DOM操作
4. **使用Web Workers**：将耗时操作移至Web Workers
5. **监控内存使用**：定期检查窗口内存占用

## 运行示例

进入window-management目录，执行以下命令运行示例：

```bash
# 安装依赖（如果需要）
npm install

# 运行基本窗口示例
node basic-window.js

# 运行多窗口示例
node multi-window.js

# 运行窗口状态管理示例
node window-states.js
```

## 学习资源

- [Electron BrowserWindow 文档](https://www.electronjs.org/docs/api/browser-window)
- [Electron 窗口管理教程](https://www.electronjs.org/docs/tutorial/windows)
- [Electron 最佳实践](https://www.electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes)

## 平台特定注意事项

### Windows
- 某些窗口样式可能需要管理员权限
- 任务栏集成需要特殊配置

### macOS
- 菜单栏和Dock集成有特定API
- 全屏模式行为与Windows/Linux不同

### Linux
- 不同桌面环境下窗口表现可能有差异
- 一些特性可能需要特定依赖