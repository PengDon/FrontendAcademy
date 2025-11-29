# 内容脚本 (Content Scripts)

## 基本介绍

内容脚本是浏览器插件的重要组件，它能够直接注入到网页中运行，从而访问和操作网页的DOM。内容脚本在一个隔离的环境中运行，可以读取和修改页面内容，但与网页自身的脚本和其他扩展的内容脚本有所隔离。

## 配置方式

在 manifest.json 中配置内容脚本：

```json
"content_scripts": [
  {
    "matches": ["https://*.example.com/*"],
    "js": ["content.js"],
    "css": ["styles.css"],
    "run_at": "document_idle",
    "all_frames": false,
    "match_about_blank": false
  }
]
```

## 配置选项详解

### matches

定义脚本应注入到哪些网页中，使用URL匹配模式：

- `*`: 匹配任意字符序列（不包括URL分隔符）
- `http://*/*`: 匹配所有HTTP页面
- `https://*.example.com/*`: 匹配所有example.com域名及其子域名的HTTPS页面
- `<all_urls>`: 匹配所有URL（需要在host_permissions中声明）

### js

要注入的JavaScript文件数组，按声明顺序执行。

### css

要注入的CSS文件数组，样式将应用于匹配的页面。

### run_at

控制脚本注入的时机：

- `document_start`: 在DOM构建开始时注入，但在任何脚本运行之前
- `document_end`: 在DOM构建完成后注入，但可能在页面加载所有资源之前
- `document_idle`: 在页面加载完成后注入（默认值），通常是最佳选择

### all_frames

是否将脚本注入到页面中的所有框架中：

- `true`: 注入到所有框架
- `false`: 只注入到顶层框架（默认值）

### match_about_blank

是否将脚本注入到about:blank页面中：

- `true`: 如果about:blank页面由匹配的网站创建，则注入脚本
- `false`: 不注入到about:blank页面（默认值）

## 执行环境特性

### 隔离环境

内容脚本在一个特殊的环境中运行，称为"孤立世界"（Isolated World）：

- **独立的变量作用域**: 不会与页面脚本的变量冲突
- **独立的DOM访问**: 可以修改DOM，但页面脚本无法直接访问内容脚本创建的JavaScript对象
- **共享DOM**: 内容脚本和页面脚本都可以读取和修改同一个DOM

### 可访问的API

内容脚本可以直接使用的API：

- **标准Web API**: 如DOM操作、fetch、localStorage等
- **部分Chrome API**: 如chrome.runtime、chrome.i18n、chrome.storage等

内容脚本**不能**直接使用的API：

- chrome.tabs
- chrome.bookmarks
- chrome.history
- 等大多数需要特殊权限的API

## 通信机制

### 与后台脚本通信

```javascript
// 内容脚本发送消息
chrome.runtime.sendMessage({
  type: 'GET_DATA',
  payload: { pageUrl: window.location.href }
}, (response) => {
  if (response) {
    console.log('收到后台响应:', response);
  }
});

// 内容脚本监听消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'UPDATE_CONTENT') {
    // 更新页面内容
    sendResponse({ success: true });
  }
});
```

### 与页面脚本通信

由于安全隔离，内容脚本和页面脚本需要通过DOM事件进行通信：

```javascript
// 内容脚本向页面脚本发送消息
function sendMessageToPage(data) {
  const event = new CustomEvent('content-script-message', {
    detail: data
  });
  window.dispatchEvent(event);
}

// 内容脚本监听页面脚本消息
window.addEventListener('page-script-message', (event) => {
  const data = event.detail;
  console.log('收到页面脚本消息:', data);
});
```

## 注入方式

### 1. 声明式注入（Manifest配置）

通过manifest.json配置自动注入，最常用的方式。

### 2. 程序化注入

在后台脚本中使用chrome.scripting API（Manifest V3）或chrome.tabs.executeScript（Manifest V2）动态注入：

```javascript
// Manifest V3 中使用 chrome.scripting
chrome.scripting.executeScript({
  target: { tabId: tabId },
  files: ['content.js']
});

// 或注入内联代码
chrome.scripting.executeScript({
  target: { tabId: tabId },
  function: () => {
    document.body.style.backgroundColor = 'red';
  }
});
```

## 安全考虑

### 内容安全

- **避免内联脚本**: 尽可能使用外部JS文件
- **避免内联事件处理器**: 使用addEventListener代替
- **谨慎处理用户输入**: 防止XSS攻击
- **使用安全的DOM操作**: 如textContent代替innerHTML

### 数据安全

- **避免在DOM中存储敏感数据**: 可能被页面脚本读取
- **使用消息传递**: 通过chrome.runtime.sendMessage安全传输数据
- **验证消息来源**: 检查sender信息确保消息来自可信源

## 性能优化

### 1. 延迟加载

- 使用`run_at: "document_idle"`减少对页面加载的影响
- 考虑使用程序化注入，仅在需要时加载脚本

### 2. 高效DOM操作

- 批量处理DOM更改
- 使用DocumentFragment减少重排
- 避免频繁查询DOM，缓存结果

### 3. 减少通信开销

- 批量发送消息
- 避免发送大型对象
- 使用chrome.storage.sync代替频繁的消息传递

## 调试技巧

### Chrome DevTools调试

1. 打开目标网页
2. 按F12打开DevTools
3. 在控制台中，从下拉菜单选择扩展的内容脚本上下文

### 日志记录

```javascript
// 基本日志
console.log('内容脚本已加载');

// 发送调试消息到后台
function debug(message) {
  chrome.runtime.sendMessage({
    type: 'DEBUG',
    message: message
  });
}
```

## 常见问题

1. **无法访问页面变量**
   - 原因：内容脚本在孤立世界中运行
   - 解决方案：使用DOM事件通信或注入页面脚本

2. **无法使用某些Chrome API**
   - 原因：内容脚本只能访问部分Chrome API
   - 解决方案：通过消息传递委托给后台脚本

3. **注入时机不当**
   - 原因：DOM未完全加载就尝试操作
   - 解决方案：使用正确的run_at值或等待DOMContentLoaded事件

4. **性能问题**
   - 原因：频繁操作DOM或发送消息
   - 解决方案：优化DOM操作，批量处理消息

## 最佳实践

- **最小权限原则**: 只注入到必要的页面
- **模块化设计**: 将功能拆分为小的逻辑单元
- **错误处理**: 捕获并报告错误
- **版本兼容性**: 考虑不同浏览器和版本的差异
- **资源清理**: 在不需要时移除事件监听器

## 参考资源

- [Chrome 扩展内容脚本](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)
- [Firefox 扩展内容脚本](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts)