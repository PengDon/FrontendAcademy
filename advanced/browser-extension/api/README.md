# 浏览器插件 API 参考

## 基本介绍

浏览器插件API是扩展浏览器功能的核心，提供了访问浏览器内部功能的接口。不同浏览器（Chrome、Firefox、Edge等）的API有很多相似之处，但也存在差异。本文档主要基于Chrome扩展API，并标注跨浏览器兼容性。

## API分类

### 1. 基础API

#### chrome.runtime

提供扩展运行时的功能和信息。

- **获取扩展信息**
  - `chrome.runtime.getManifest()`: 获取manifest.json的内容
  - `chrome.runtime.getURL(path)`: 获取扩展资源的完整URL
  - `chrome.runtime.getID()`: 获取扩展的唯一ID

- **消息传递**
  - `chrome.runtime.sendMessage(message, callback)`: 向扩展的其他部分发送消息
  - `chrome.runtime.onMessage`: 监听来自其他部分的消息
  - `chrome.runtime.connect()`: 建立长连接进行消息传递

- **运行时操作**
  - `chrome.runtime.reload()`: 重新加载扩展
  - `chrome.runtime.openOptionsPage()`: 打开扩展的选项页面
  - `chrome.runtime.setUninstallURL(url)`: 设置扩展卸载时打开的URL

#### chrome.storage

提供扩展数据的存储功能，分为同步和本地存储。

- **存储类型**
  - `chrome.storage.sync`: 跨设备同步的存储（有大小限制）
  - `chrome.storage.local`: 本地存储（容量更大）
  - `chrome.storage.managed`: 企业策略管理的存储（只读）

- **主要方法**
  - `get(keys, callback)`: 获取存储的数据
  - `set(items, callback)`: 设置存储的数据
  - `remove(keys, callback)`: 删除存储的数据
  - `clear(callback)`: 清除所有存储数据
  - `onChanged`: 监听存储数据的变化

### 2. 标签页和窗口API

#### chrome.tabs

管理浏览器标签页。

- **标签页操作**
  - `chrome.tabs.query(queryInfo, callback)`: 查询标签页
  - `chrome.tabs.create(createProperties, callback)`: 创建新标签页
  - `chrome.tabs.update(tabId, updateProperties, callback)`: 更新标签页
  - `chrome.tabs.remove(tabIds, callback)`: 关闭标签页
  - `chrome.tabs.reload(tabId, reloadProperties, callback)`: 重新加载标签页

- **事件监听**
  - `chrome.tabs.onCreated`: 监听新标签页创建
  - `chrome.tabs.onUpdated`: 监听标签页更新
  - `chrome.tabs.onRemoved`: 监听标签页关闭
  - `chrome.tabs.onActivated`: 监听标签页激活

#### chrome.windows

管理浏览器窗口。

- **窗口操作**
  - `chrome.windows.get(windowId, getInfo, callback)`: 获取窗口信息
  - `chrome.windows.create(createData, callback)`: 创建新窗口
  - `chrome.windows.update(windowId, updateInfo, callback)`: 更新窗口
  - `chrome.windows.remove(windowId, callback)`: 关闭窗口

- **事件监听**
  - `chrome.windows.onCreated`: 监听新窗口创建
  - `chrome.windows.onRemoved`: 监听窗口关闭
  - `chrome.windows.onFocusChanged`: 监听窗口焦点变化

### 3. 内容操作API

#### chrome.scripting (Manifest V3)

用于动态注入脚本和样式到网页中。

- **脚本注入**
  - `chrome.scripting.executeScript(injection, callback)`: 执行脚本
  - `chrome.scripting.insertCSS(injection, callback)`: 插入CSS
  - `chrome.scripting.removeCSS(injection, callback)`: 移除CSS

- **参数说明**
  - `target`: 指定注入目标（tabId、allFrames等）
  - `files`: 要注入的文件路径
  - `function`: 要执行的内联函数
  - `args`: 传递给函数的参数

*注：在Manifest V2中使用`chrome.tabs.executeScript`*

#### chrome.declarativeContent (Manifest V2)

声明式内容API，用于根据页面内容改变扩展的行为。

- **条件规则**
  - `chrome.declarativeContent.onPageChanged`: 监听页面变化
  - `chrome.declarativeContent.ShowPageAction()`: 显示页面操作按钮

*注：在Manifest V3中功能有所变化*

### 4. 网络请求API

#### chrome.declarativeNetRequest (Manifest V3)

声明式网络请求API，用于拦截和修改网络请求。

- **规则管理**
  - `chrome.declarativeNetRequest.updateDynamicRules(rules, callback)`: 更新动态规则
  - `chrome.declarativeNetRequest.updateSessionRules(rules, callback)`: 更新会话规则
  - `chrome.declarativeNetRequest.getDynamicRules(callback)`: 获取动态规则

- **规则类型**
  - `block`: 阻止请求
  - `redirect`: 重定向请求
  - `modifyHeaders`: 修改请求头

*注：替代Manifest V2中的`chrome.webRequest`*

#### chrome.webRequest (Manifest V2)

用于观察和修改网络请求。

- **请求拦截**
  - `chrome.webRequest.onBeforeRequest`: 请求发送前
  - `chrome.webRequest.onBeforeSendHeaders`: 发送请求头前
  - `chrome.webRequest.onHeadersReceived`: 收到响应头后

- **拦截操作**
  - `blocking`: 阻塞请求
  - `requestHeaders`: 访问请求头
  - `responseHeaders`: 访问响应头

### 5. 用户界面API

#### chrome.action (Manifest V3)

管理扩展的工具栏按钮。

- **按钮操作**
  - `chrome.action.setIcon(details)`: 设置图标
  - `chrome.action.setTitle(details)`: 设置标题
  - `chrome.action.setPopup(details)`: 设置弹出页面
  - `chrome.action.setBadgeText(details)`: 设置徽章文本
  - `chrome.action.setBadgeBackgroundColor(details)`: 设置徽章背景色

- **事件监听**
  - `chrome.action.onClicked`: 监听按钮点击

*注：替代Manifest V2中的`chrome.browserAction`和`chrome.pageAction`*

#### chrome.notifications

创建和管理桌面通知。

- **通知操作**
  - `chrome.notifications.create(notificationId, options, callback)`: 创建通知
  - `chrome.notifications.update(notificationId, options, callback)`: 更新通知
  - `chrome.notifications.clear(notificationId, callback)`: 清除通知

- **通知类型**
  - `basic`: 基本通知
  - `image`: 带图像的通知
  - `list`: 列表通知
  - `progress`: 进度条通知

#### chrome.contextMenus

创建和管理上下文菜单。

- **菜单操作**
  - `chrome.contextMenus.create(createProperties, callback)`: 创建菜单项
  - `chrome.contextMenus.update(id, updateProperties, callback)`: 更新菜单项
  - `chrome.contextMenus.remove(id, callback)`: 删除菜单项
  - `chrome.contextMenus.removeAll(callback)`: 删除所有菜单项

- **事件监听**
  - `chrome.contextMenus.onClicked`: 监听菜单项点击

### 6. 高级API

#### chrome.identity

管理用户身份和身份验证。

- **身份验证**
  - `chrome.identity.getAuthToken(details, callback)`: 获取OAuth令牌
  - `chrome.identity.launchWebAuthFlow(details, callback)`: 启动Web认证流程
  - `chrome.identity.getProfileUserInfo(callback)`: 获取用户配置文件信息

#### chrome.storage.local / chrome.storage.sync

如前所述，用于数据持久化。

#### chrome.tts

文本转语音功能。

- **语音合成**
  - `chrome.tts.speak(utterance, options, callback)`: 朗读文本
  - `chrome.tts.stop()`: 停止朗读
  - `chrome.tts.pause()`: 暂停朗读
  - `chrome.tts.resume()`: 恢复朗读

#### chrome.bookmarks

管理书签。

- **书签操作**
  - `chrome.bookmarks.get(id, callback)`: 获取书签
  - `chrome.bookmarks.create(bookmark, callback)`: 创建书签
  - `chrome.bookmarks.update(id, changes, callback)`: 更新书签
  - `chrome.bookmarks.remove(id, callback)`: 删除书签

- **事件监听**
  - `chrome.bookmarks.onCreated`: 监听书签创建
  - `chrome.bookmarks.onRemoved`: 监听书签删除
  - `chrome.bookmarks.onChanged`: 监听书签更改

### 7. 开发者工具API

#### chrome.devtools

扩展开发者工具的功能。

- **面板创建**
  - `chrome.devtools.panels.create(title, iconPath, pagePath, callback)`: 创建面板
  - `chrome.devtools.panels.elements`: 元素面板
  - `chrome.devtools.panels.sources`: 源代码面板

- **检查器**
  - `chrome.devtools.inspectedWindow`: 当前检查的窗口
  - `chrome.devtools.inspectedWindow.eval(expression, options, callback)`: 执行代码

## 跨浏览器兼容性

### 主要浏览器差异

#### Chrome vs Firefox

- **API前缀**
  - Chrome: `chrome.*`
  - Firefox: 同时支持 `browser.*` (标准Promise风格) 和 `chrome.*` (回调风格)

- **API支持情况**
  - 大多数核心API相似
  - Firefox在某些API上有额外功能
  - Chrome在某些新API上领先

#### Edge (基于Chromium)

- 与Chrome API高度兼容
- 有少量Microsoft特定API

### 兼容性最佳实践

1. **使用WebExtension API标准**
   - 遵循Mozilla WebExtensions规范
   - 使用browser.runtime.getURL()而非chrome.runtime.getURL()

2. **错误处理**
   - 始终检查API是否存在
   - 使用try-catch处理可能的错误

3. **Promise支持**
   - 考虑使用Promise包装回调API
   - 或使用WebExtension polyfill

4. **特性检测**
   - 在使用前检查API特性是否可用
   - 提供替代方案或优雅降级

## API使用注意事项

### 权限要求

大多数API需要在manifest.json中声明相应权限。

### 异步特性

大多数浏览器API是异步的，使用回调函数或Promise。

### 错误处理

始终处理API调用可能发生的错误。

### 性能考虑

- 避免频繁调用API
- 批量处理操作
- 适当缓存结果

## 参考资源

- [Chrome扩展API参考](https://developer.chrome.com/docs/extensions/reference/)
- [Firefox WebExtensions API参考](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API)
- [WebExtension API兼容性表格](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Browser_support_for_JavaScript_APIs)