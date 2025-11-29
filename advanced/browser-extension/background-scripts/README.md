# 后台脚本 (Background Scripts)

## 基本介绍

后台脚本是浏览器插件的核心组件之一，它在插件安装后持续运行（在 Manifest V3 中为按需激活），负责处理插件的主要逻辑、管理状态、响应用户交互和页面事件等。

## Manifest V2 vs V3 中的后台脚本

### Manifest V2

在 Manifest V2 中，后台脚本可以是持久运行的页面或脚本：

```json
// V2 后台页面
"background": {
  "page": "background.html"
}

// 或 V2 后台脚本
"background": {
  "scripts": ["background.js"],
  "persistent": true // 持久运行
}
```

### Manifest V3

在 Manifest V3 中，后台脚本改为使用 Service Worker：

```json
// V3 后台 Service Worker
"background": {
  "service_worker": "background.js"
}
```

## Service Worker 特性与限制

### 主要特性

- **事件驱动**: 仅在需要时激活，处理事件后自动休眠
- **非持久化**: 不会一直占用内存
- **支持现代 Web API**: fetch, cache, Notification 等
- **与扩展其他部分通信**: 通过消息传递机制

### 重要限制

- **无 DOM 访问权限**: 不能直接操作 DOM
- **不能使用同步 XHR**: 必须使用 fetch 或异步请求
- **不能使用某些旧 API**: 如 localStorage, document, window
- **生命周期限制**: 闲置一段时间后会被终止
- **无 alert/confirm**: 不能使用浏览器的弹窗函数

## 生命周期

### Service Worker 生命周期

1. **注册**: 浏览器加载扩展时注册 Service Worker
2. **安装 (Install)**: 首次安装或更新时触发
3. **激活 (Activate)**: 安装完成后触发，可以清理旧版本数据
4. **空闲 (Idle)**: 无事件处理时休眠
5. **终止 (Terminate)**: 闲置一段时间后被浏览器终止
6. **重新激活 (Reactivate)**: 有新事件时重新激活

### 生命周期事件处理

```javascript
// 安装事件
self.addEventListener('install', (event) => {
  // 执行安装逻辑，如缓存资源
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/index.html',
        '/styles.css'
      ]);
    })
  );
});

// 激活事件
self.addEventListener('activate', (event) => {
  // 执行清理逻辑
  event.waitUntil(
    clients.claim() // 立即控制已打开的客户端
  );
});
```

## 主要功能

### 1. 消息监听与处理

```javascript
// 监听来自内容脚本或弹出页面的消息
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'getData':
      // 处理数据请求
      break;
    case 'updateSettings':
      // 更新设置
      break;
  }
});

// 使用 Chrome API 的消息机制
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // 处理消息并响应
  sendResponse({ result: 'success' });
});
```

### 2. 事件监听

```javascript
// 监听标签页创建事件
chrome.tabs.onCreated.addListener((tab) => {
  console.log('新标签页创建:', tab.id);
});

// 监听书签更改事件
chrome.bookmarks.onChanged.addListener((id, changeInfo) => {
  console.log('书签更改:', id, changeInfo);
});
```

### 3. 后台任务调度

```javascript
// 使用 alarms API 调度后台任务
chrome.alarms.create('periodicTask', {
  delayInMinutes: 1,
  periodInMinutes: 60
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'periodicTask') {
    // 执行定期任务
  }
});
```

## 数据存储

由于 Service Worker 的非持久特性，需要使用持久化存储：

### chrome.storage API

```javascript
// 保存数据
chrome.storage.local.set({ key: 'value' }, () => {
  console.log('数据已保存');
});

// 读取数据
chrome.storage.local.get(['key'], (result) => {
  console.log('读取的数据:', result.key);
});
```

### IndexedDB

对于更复杂的数据结构：

```javascript
// 打开数据库连接
const request = indexedDB.open('ExtensionDB', 1);

request.onupgradeneeded = (event) => {
  const db = event.target.result;
  db.createObjectStore('items', { keyPath: 'id' });
};

request.onsuccess = (event) => {
  const db = event.target.result;
  // 使用数据库
};
```

## 性能优化

### 1. 避免长时间运行

- 处理完事件后尽快释放资源
- 避免阻塞主线程的操作
- 使用异步操作处理耗时任务

### 2. 高效的消息传递

- 使用结构化克隆算法传递数据
- 避免传递大型对象
- 批量处理消息

### 3. 避免频繁激活

- 使用 alarms API 代替轮询
- 合理使用缓存减少网络请求
- 优化事件监听逻辑

## 调试技巧

### Chrome DevTools 调试

1. 访问 chrome://extensions/
2. 启用开发者模式
3. 点击扩展的 "背景页" 或 "Service Worker"
4. 在弹出的 DevTools 中进行调试

### 日志记录

```javascript
// 记录日志到控制台
console.log('后台脚本正在运行');
console.error('发生错误:', error);

// 发送错误通知
chrome.notifications.create({
  type: 'basic',
  iconUrl: 'images/icon128.png',
  title: '错误',
  message: '操作失败，请重试'
});
```

## 最佳实践

- **保持轻量**: 只包含必要的逻辑
- **响应式设计**: 采用事件驱动而非轮询
- **优雅降级**: 处理 Service Worker 被终止的情况
- **数据持久化**: 使用 chrome.storage 或 IndexedDB
- **错误处理**: 完善的错误捕获和日志记录
- **资源管理**: 及时清理不需要的资源

## 常见问题

1. **Service Worker 经常被终止**
   - 优化代码，减少内存占用
   - 使用 alarms API 代替定时器
   - 确保事件处理函数高效

2. **消息传递失败**
   - 检查 Service Worker 是否已激活
   - 确认消息格式正确
   - 实现错误处理和重试机制

3. **无法访问某些 API**
   - 检查是否在 manifest.json 中声明了相应权限
   - 确认 API 是否支持在 Service Worker 中使用

## 参考资源

- [Chrome 扩展 Service Worker](https://developer.chrome.com/docs/extensions/mv3/service_workers/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)