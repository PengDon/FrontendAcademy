# 渐进式Web应用（PWA）开发指南

## 介绍

渐进式Web应用（Progressive Web App, PWA）是一种结合了Web和原生应用优点的现代Web应用程序。PWA利用最新的Web技术，提供类似原生应用的用户体验，同时保持Web的便捷性和可访问性。本文档将详细介绍PWA的核心概念、实现方法和最佳实践。

## 核心特征

### 1. 渐进增强

PWA能够在任何浏览器中正常工作，并在支持的浏览器中提供增强功能，确保基本功能在所有环境中可用。

### 2. 响应式设计

PWA能够适配各种屏幕尺寸，从移动设备到桌面设备。

### 3. 离线可用

通过Service Worker和缓存策略，PWA能够在离线或网络不稳定的情况下提供基本功能。

### 4. 可安装

用户可以将PWA添加到主屏幕，无需通过应用商店。

### 5. 推送通知

PWA支持推送通知功能，即使应用未在浏览器中打开。

### 6. 后台同步

PWA能够在网络恢复时进行后台数据同步。

### 7. 应用外壳（App Shell）

PWA使用App Shell架构，将UI框架与内容分离，实现快速加载和一致的用户体验。

## PWA核心技术

### 1. Service Worker

Service Worker是一个运行在浏览器后台的JavaScript线程，独立于Web页面，具有拦截和修改导航、资源请求的能力，以及管理缓存的功能。

#### 基本注册

```javascript
// 检查浏览器是否支持Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('ServiceWorker 注册成功，作用域为:', registration.scope);
      })
      .catch((error) => {
        console.error('ServiceWorker 注册失败:', error);
      });
  });
}
```

#### Service Worker生命周期

Service Worker有以下生命周期阶段：

1. **安装（Install）**：首次注册时触发，可以缓存核心资源
2. **激活（Activate）**：安装完成后触发，可以清理旧缓存
3. **闲置（Idle）**：激活后在后台等待
4. **获取/等待（Fetch/Waiting）**：拦截网络请求
5. **终止（Terminate）**：系统回收资源时终止

#### Service Worker基础实现

```javascript
// service-worker.js
const CACHE_NAME = 'my-pwa-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/scripts/main.js',
  '/images/logo.png',
  '/offline.html'
];

// 安装事件 - 预缓存关键资源
self.addEventListener('install', (event) => {
  console.log('[Service Worker] 安装中');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] 缓存静态资源');
        return cache.addAll(STATIC_ASSETS);
      })
  );
  // 立即激活，无需等待旧SW终止
  self.skipWaiting();
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] 激活中');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
              console.log('[Service Worker] 删除旧缓存:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // 立即接管所有客户端
        return self.clients.claim();
      })
  );
});

// Fetch事件 - 实现缓存策略
self.addEventListener('fetch', (event) => {
  console.log('[Service Worker] 拦截请求:', event.request.url);
  
  // 为API请求使用网络优先策略
  if (event.request.url.includes('/api/')) {
    return networkFirst(event);
  }
  
  // 为静态资源使用缓存优先策略
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 如果找到缓存，则返回缓存的响应
        if (response) {
          console.log('[Service Worker] 从缓存返回:', event.request.url);
          return response;
        }
        
        // 否则从网络获取
        console.log('[Service Worker] 从网络获取:', event.request.url);
        return fetch(event.request)
          .then((response) => {
            // 检查响应是否有效
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // 克隆响应，一份用于缓存，一份用于返回
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                console.log('[Service Worker] 缓存新资源:', event.request.url);
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // 如果是HTML请求且网络失败，返回离线页面
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/offline.html');
            }
          });
      })
  );
});

// 网络优先策略 - 用于API等需要最新数据的请求
function networkFirst(event) {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 缓存最新的响应
        const responseToCache = response.clone();
        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseToCache);
          });
        return response;
      })
      .catch(() => {
        // 网络失败时，尝试从缓存获取
        return caches.match(event.request);
      })
  );
}
```

### 2. Web App Manifest

Web App Manifest是一个JSON文件，提供了PWA的元数据，如应用名称、图标、主题颜色等，使应用能够被添加到主屏幕。

#### 基本结构

```json
{
  "name": "我的渐进式Web应用",
  "short_name": "我的PWA",
  "description": "一个示例渐进式Web应用",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#4a90e2",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "orientation": "portrait",
  "categories": ["utilities", "productivity"],
  "lang": "zh-CN",
  "dir": "ltr",
  "shortcuts": [
    {
      "name": "新建笔记",
      "short_name": "新建",
      "description": "创建一篇新笔记",
      "url": "/new?utm_source=homescreen",
      "icons": [{ "src": "/icons/new-note.png", "sizes": "192x192" }]
    },
    {
      "name": "我的收藏",
      "short_name": "收藏",
      "description": "查看我的收藏",
      "url": "/favorites?utm_source=homescreen",
      "icons": [{ "src": "/icons/favorites.png", "sizes": "192x192" }]
    }
  ]
}
```

#### 在HTML中引入

```html
<!-- 在index.html的<head>中引入 -->
<link rel="manifest" href="/manifest.json">

<!-- iOS支持 -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="我的PWA">
<link rel="apple-touch-icon" href="/icons/icon-180x180.png">

<!-- Android主题色 -->
<meta name="theme-color" content="#4a90e2">
```

### 3. 推送通知

PWA支持推送通知功能，即使应用未在浏览器中打开也能接收通知。

#### 获取推送权限

```javascript
// 请求推送通知权限
async function requestNotificationPermission() {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('通知权限已授予');
      return true;
    } else {
      console.log('通知权限被拒绝');
      return false;
    }
  }
  return false;
}
```

#### 订阅推送服务

```javascript
// 订阅推送服务
async function subscribeToPushService() {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    const registration = await navigator.serviceWorker.ready;
    
    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U'
        )
      });
      
      console.log('推送订阅成功:', subscription);
      // 将订阅信息发送到服务器
      await sendSubscriptionToServer(subscription);
      
      return subscription;
    } catch (error) {
      console.error('推送订阅失败:', error);
      return null;
    }
  }
  return null;
}

// Base64转换工具函数
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// 将订阅信息发送到服务器
async function sendSubscriptionToServer(subscription) {
  try {
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(subscription)
    });
    
    if (!response.ok) {
      throw new Error('发送订阅信息失败');
    }
    
    console.log('订阅信息已发送到服务器');
  } catch (error) {
    console.error('发送订阅信息时出错:', error);
  }
}
```

#### 在Service Worker中处理推送事件

```javascript
// 在service-worker.js中添加推送事件处理
self.addEventListener('push', (event) => {
  if (!event.data) {
    console.log('[Service Worker] 接收到空的推送消息');
    return;
  }
  
  try {
    const data = event.data.json();
    console.log('[Service Worker] 接收到推送消息:', data);
    
    const options = {
      body: data.body || '您有一条新消息',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      image: data.image,
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/'
      },
      actions: data.actions || [
        {
          action: 'view',
          title: '查看详情'
        },
        {
          action: 'close',
          title: '关闭',
          destructive: true
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || '推送通知', options)
    );
  } catch (error) {
    console.error('[Service Worker] 解析推送数据时出错:', error);
    // 处理非JSON格式的推送
    const options = {
      body: event.data.text(),
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png'
    };
    
    event.waitUntil(
      self.registration.showNotification('推送通知', options)
    );
  }
});

// 处理通知点击事件
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] 通知被点击:', event.notification.data);
  
  // 关闭通知
  event.notification.close();
  
  // 根据通知中的URL打开页面
  const urlToOpen = event.notification.data.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      // 检查是否已经有打开的窗口
      for (const client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // 如果没有打开的窗口，则打开新窗口
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
```

### 4. 后台同步

后台同步允许PWA在网络可用时执行操作，即使应用未在浏览器中打开。

#### 注册后台同步

```javascript
// 注册后台同步
async function registerBackgroundSync() {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('myFirstSync');
      console.log('后台同步已注册');
      return true;
    } catch (error) {
      console.error('后台同步注册失败:', error);
      // 回退方案：使用localStorage和定期检查
      fallbackSync();
      return false;
    }
  } else {
    // 不支持后台同步的浏览器使用回退方案
    fallbackSync();
    return false;
  }
}

// 回退同步方案
function fallbackSync() {
  console.log('使用回退同步方案');
  localStorage.setItem('syncRequired', 'true');
  
  // 监听在线状态变化
  window.addEventListener('online', performSyncIfNeeded);
}

// 检查并执行同步
async function performSyncIfNeeded() {
  if (localStorage.getItem('syncRequired') === 'true') {
    await syncData();
    localStorage.setItem('syncRequired', 'false');
  }
}

// 同步数据
async function syncData() {
  try {
    // 获取待同步的数据
    const pendingData = getPendingSyncData();
    
    if (pendingData.length === 0) return;
    
    // 发送数据到服务器
    const response = await fetch('/api/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pendingData)
    });
    
    if (!response.ok) {
      throw new Error('同步失败');
    }
    
    console.log('数据同步成功');
    // 清除已同步的数据
    clearPendingSyncData();
  } catch (error) {
    console.error('同步数据时出错:', error);
    // 标记同步需要重试
    localStorage.setItem('syncRequired', 'true');
  }
}
```

#### 在Service Worker中处理同步事件

```javascript
// 在service-worker.js中添加同步事件处理
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] 接收到同步事件:', event.tag);
  
  if (event.tag === 'myFirstSync' || event.tag === 'syncData') {
    event.waitUntil(syncData());
  }
});

// 在Service Worker中实现数据同步
async function syncData() {
  try {
    // 从IndexedDB获取待同步的数据
    const pendingData = await getPendingSyncDataFromIDB();
    
    if (pendingData.length === 0) {
      console.log('[Service Worker] 没有待同步的数据');
      return;
    }
    
    // 发送数据到服务器
    const response = await fetch('/api/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pendingData)
    });
    
    if (!response.ok) {
      throw new Error('同步失败');
    }
    
    console.log('[Service Worker] 数据同步成功');
    // 清除已同步的数据
    await clearPendingSyncDataFromIDB(pendingData);
    
    // 发送同步成功的广播消息
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({ type: 'SYNC_COMPLETED' });
    });
  } catch (error) {
    console.error('[Service Worker] 同步数据时出错:', error);
    throw error; // 抛出错误以便触发重试
  }
}

// 简单的IndexedDB操作示例
async function getPendingSyncDataFromIDB() {
  // 实际应用中实现IndexedDB查询
  return [];
}

async function clearPendingSyncDataFromIDB(completedItems) {
  // 实际应用中实现IndexedDB删除
}
```

### 5. App Shell架构

App Shell是PWA的核心架构模式，将UI框架与内容分离，实现快速加载和一致的用户体验。

#### App Shell示例结构

```html
<!-- index.html - App Shell结构 -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>我的PWA应用</title>
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#4a90e2">
  <link rel="stylesheet" href="/styles/app-shell.css">
</head>
<body>
  <!-- App Shell - 这部分被缓存 -->
  <header class="app-header">
    <div class="logo">我的PWA</div>
    <nav class="main-nav">
      <a href="/" class="nav-item">首页</a>
      <a href="/features" class="nav-item">功能</a>
      <a href="/about" class="nav-item">关于</a>
    </nav>
    <button class="menu-toggle">☰</button>
  </header>
  
  <!-- 内容区域 - 动态加载 -->
  <main id="app-content" class="app-content">
    <!-- 内容将在这里动态加载 -->
    <div class="loading">加载中...</div>
  </main>
  
  <!-- 页脚 -->
  <footer class="app-footer">
    <p>&copy; 2023 我的PWA应用</p>
  </footer>
  
  <!-- App Shell脚本 -->
  <script src="/scripts/app-shell.js"></script>
</body>
</html>
```

```javascript
// app-shell.js - App Shell核心逻辑
class AppShell {
  constructor() {
    this.contentElement = document.getElementById('app-content');
    this.menuToggle = document.querySelector('.menu-toggle');
    this.nav = document.querySelector('.main-nav');
    
    this.init();
  }
  
  init() {
    // 初始化事件监听器
    this.setupEventListeners();
    
    // 加载页面内容
    this.loadPageContent(window.location.pathname);
    
    // 监听导航事件（用于单页应用导航）
    this.setupNavigation();
  }
  
  setupEventListeners() {
    // 菜单切换
    this.menuToggle.addEventListener('click', () => {
      this.nav.classList.toggle('active');
    });
    
    // 监听在线/离线状态
    window.addEventListener('online', () => {
      this.updateOnlineStatus(true);
    });
    
    window.addEventListener('offline', () => {
      this.updateOnlineStatus(false);
    });
    
    // 初始检查在线状态
    this.updateOnlineStatus(navigator.onLine);
  }
  
  setupNavigation() {
    // 拦截导航链接点击
    document.querySelectorAll('a[href^="/"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // 不拦截外部链接和带有特殊属性的链接
        if (link.getAttribute('target') === '_blank' || 
            link.hasAttribute('download') || 
            e.metaKey || e.ctrlKey) {
          return;
        }
        
        e.preventDefault();
        
        // 更新URL
        window.history.pushState({}, '', href);
        
        // 加载页面内容
        this.loadPageContent(href);
      });
    });
    
    // 监听浏览器前进/后退
    window.addEventListener('popstate', () => {
      this.loadPageContent(window.location.pathname);
    });
  }
  
  async loadPageContent(path) {
    // 显示加载状态
    this.contentElement.innerHTML = '<div class="loading">加载中...</div>';
    
    try {
      // 获取页面内容
      const response = await fetch(path + '.html');
      
      if (!response.ok) {
        throw new Error('页面不存在');
      }
      
      const content = await response.text();
      this.contentElement.innerHTML = content;
      
      // 页面切换动画
      this.contentElement.classList.add('fade-in');
      setTimeout(() => {
        this.contentElement.classList.remove('fade-in');
      }, 300);
      
      // 执行页面特定的脚本
      this.executePageScripts(path);
    } catch (error) {
      console.error('加载页面时出错:', error);
      this.contentElement.innerHTML = `
        <div class="error">
          <h2>页面加载失败</h2>
          <p>无法加载页面内容。请检查您的网络连接或稍后再试。</p>
          <button onclick="window.location.reload()" class="retry-button">重试</button>
        </div>
      `;
    }
  }
  
  executePageScripts(path) {
    // 在这里可以加载和执行特定页面的脚本
    switch (path) {
      case '/features':
        this.loadScript('/scripts/features.js');
        break;
      case '/about':
        this.loadScript('/scripts/about.js');
        break;
      default:
        this.loadScript('/scripts/home.js');
    }
  }
  
  loadScript(src) {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      console.log(`脚本 ${src} 已加载`);
    };
    document.body.appendChild(script);
  }
  
  updateOnlineStatus(isOnline) {
    if (isOnline) {
      document.body.classList.remove('offline');
      document.body.classList.add('online');
    } else {
      document.body.classList.remove('online');
      document.body.classList.add('offline');
    }
  }
}

// 初始化App Shell
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // 注册Service Worker后初始化App Shell
    navigator.serviceWorker.register('/service-worker.js')
      .then(() => {
        new AppShell();
      })
      .catch(error => {
        console.error('Service Worker注册失败:', error);
        // 即使Service Worker失败也初始化App Shell
        new AppShell();
      });
  });
} else {
  // 不支持Service Worker的浏览器也初始化App Shell
  window.addEventListener('DOMContentLoaded', () => {
    new AppShell();
  });
}
```

## 离线功能实现

### 1. 缓存策略

根据不同类型的资源采用不同的缓存策略：

1. **缓存优先**：先查找缓存，缓存未命中时再从网络获取
2. **网络优先**：先从网络获取，网络失败时使用缓存
3. **仅网络**：只从网络获取，不缓存
4. **仅缓存**：只使用缓存，不访问网络
5. **缓存并更新**：返回缓存内容，同时更新缓存

#### 混合缓存策略实现

```javascript
// 在service-worker.js中实现混合缓存策略
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // API请求使用网络优先策略
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(event.request));
    return;
  }
  
  // 静态资源使用缓存优先策略
  if (isStaticAsset(event.request)) {
    event.respondWith(cacheFirst(event.request));
    return;
  }
  
  // HTML页面使用缓存并更新策略
  if (event.request.headers.get('accept').includes('text/html')) {
    event.respondWith(cacheThenUpdate(event.request));
    return;
  }
  
  // 默认使用缓存优先
  event.respondWith(cacheFirst(event.request));
});

// 判断是否为静态资源
function isStaticAsset(request) {
  const url = new URL(request.url);
  const staticExtensions = [
    '.js', '.css', '.json', '.ico', '.png', 
    '.jpg', '.jpeg', '.gif', '.webp', '.svg',
    '.woff', '.woff2', '.ttf', '.otf', '.eot'
  ];
  
  return staticExtensions.some(ext => url.pathname.endsWith(ext));
}

// 缓存优先策略
async function cacheFirst(request) {
  // 首先检查缓存
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // 缓存未命中，尝试从网络获取
  try {
    const networkResponse = await fetch(request);
    
    // 检查响应是否有效
    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
      return networkResponse;
    }
    
    // 缓存新响应
    const responseToCache = networkResponse.clone();
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, responseToCache);
    
    return networkResponse;
  } catch (error) {
    // 对于HTML请求，返回离线页面
    if (request.headers.get('accept').includes('text/html')) {
      return caches.match('/offline.html');
    }
    
    // 对于API请求，可以返回空数据或缓存的最后响应
    if (request.url.includes('/api/')) {
      return new Response(JSON.stringify({ error: '离线模式' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    throw error;
  }
}

// 网络优先策略
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    // 缓存最新响应
    const responseToCache = networkResponse.clone();
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, responseToCache);
    
    return networkResponse;
  } catch (error) {
    // 网络失败时，尝试从缓存获取
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // 对于HTML请求，返回离线页面
    if (request.headers.get('accept').includes('text/html')) {
      return caches.match('/offline.html');
    }
    
    // 返回错误响应
    return new Response(JSON.stringify({ error: '网络连接失败' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 408 // Request Timeout
    });
  }
}

// 缓存并更新策略
async function cacheThenUpdate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // 并行发起网络请求更新缓存
  const networkPromise = fetch(request)
    .then(networkResponse => {
      if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => {
      // 网络请求失败，返回缓存的响应（如果有）
      return cachedResponse;
    });
  
  // 返回缓存的响应，如果没有则等待网络请求
  return cachedResponse || networkPromise;
}
```

### 2. 离线页面

为用户提供友好的离线体验。

```html
<!-- offline.html -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>网络连接已断开 - 我的PWA</title>
  <link rel="stylesheet" href="/styles/offline.css">
</head>
<body>
  <div class="offline-container">
    <div class="offline-icon">📶</div>
    <h1>网络连接已断开</h1>
    <p>您当前处于离线状态。请检查您的网络连接并重试。</p>
    <div class="cached-content">
      <h2>您可以访问以下已缓存的内容：</h2>
      <ul id="cached-pages">
        <!-- 这里将由JavaScript动态填充已缓存的页面 -->
        <li><a href="/">首页</a></li>
        <li><a href="/features">功能</a></li>
        <li><a href="/about">关于</a></li>
      </ul>
    </div>
    <button id="retry-button" class="retry-button">重试连接</button>
  </div>
  
  <script>
    // 重试按钮逻辑
    document.getElementById('retry-button').addEventListener('click', () => {
      if (navigator.onLine) {
        window.location.reload();
      } else {
        alert('仍然处于离线状态，请检查您的网络连接。');
      }
    });
    
    // 监听在线状态变化
    window.addEventListener('online', () => {
      window.location.reload();
    });
    
    // 动态加载已缓存的页面列表（可选）
    if ('serviceWorker' in navigator && 'caches' in window) {
      navigator.serviceWorker.ready.then((registration) => {
        caches.keys().then((cacheNames) => {
          // 获取最新的缓存
          const latestCacheName = cacheNames.sort().pop();
          if (latestCacheName) {
            caches.open(latestCacheName).then((cache) => {
              cache.keys().then((requests) => {
                const pageList = document.getElementById('cached-pages');
                // 清空当前列表
                pageList.innerHTML = '';
                
                // 添加HTML页面链接
                requests.forEach((request) => {
                  if (request.url.includes('.html') || request.url.endsWith('/')) {
                    const url = new URL(request.url);
                    const path = url.pathname;
                    const listItem = document.createElement('li');
                    const link = document.createElement('a');
                    link.href = path;
                    link.textContent = path === '/' ? '首页' : path.substring(1);
                    listItem.appendChild(link);
                    pageList.appendChild(listItem);
                  }
                });
              });
            });
          }
        });
      });
    }
  </script>
</body>
</html>
```

## PWA实现流程

### 1. 设置项目基础结构

创建基本的项目结构：

```
/my-pwa/
  /public/
    /icons/            # 应用图标
      icon-72x72.png
      icon-96x96.png
      icon-128x128.png
      icon-144x144.png
      icon-152x152.png
      icon-192x192.png
      icon-384x384.png
      icon-512x512.png
    /styles/           # CSS样式
      app-shell.css
      main.css
      offline.css
    /scripts/          # JavaScript文件
      app-shell.js
      main.js
    index.html         # 主页
    offline.html       # 离线页面
    manifest.json      # Web App Manifest
    service-worker.js  # Service Worker
  /src/
    # 应用源码
  package.json
  README.md
```

### 2. 创建Web App Manifest

按照前面的示例创建`manifest.json`文件，并放在根目录下。

### 3. 实现Service Worker

创建`service-worker.js`文件，实现缓存策略、推送通知处理等功能。

### 4. 优化应用性能

- 压缩和合并资源
- 实现资源预加载
- 优化图片和其他媒体资源
- 使用响应式设计适配不同设备

### 5. 添加离线功能

- 实现缓存策略
- 创建离线页面
- 添加离线状态指示器

### 6. 实现推送通知（可选）

- 设置推送服务器
- 实现客户端订阅逻辑
- 在Service Worker中处理推送事件

### 7. 添加后台同步（可选）

- 实现数据暂存逻辑
- 在Service Worker中处理同步事件

### 8. 测试和调试

使用Chrome DevTools的Application面板进行PWA测试和调试。

## 工具与库推荐

### 1. 开发工具

- **Workbox**：Google开发的PWA工具库，简化Service Worker开发
  ```javascript
  // 使用Workbox注册Service Worker
  import { Workbox } from 'workbox-window';
  
  if ('serviceWorker' in navigator) {
    const wb = new Workbox('/sw.js');
    
    wb.register()
      .then(registration => {
        console.log('Service worker registered:', registration);
      })
      .catch(error => {
        console.error('Service worker registration failed:', error);
      });
  }
  ```
  
- **Lighthouse**：用于评估PWA质量的工具
- **PWA Builder**：在线工具，帮助生成PWA资源

### 2. 框架集成

#### Vue PWA

使用`@vue/cli-plugin-pwa`插件：

```bash
# 安装插件
vue add pwa
```

#### React PWA

使用`create-react-app`创建支持PWA的应用：

```bash
npx create-react-app my-pwa-app --template cra-template-pwa
```

### 3. 后端服务

- **Firebase Cloud Messaging**：用于推送通知服务
- **Google Cloud Functions**：用于实现后端逻辑
- **Node.js** + **Express**：自建推送服务器

## 常见问题与解决方案

### 1. Service Worker注册失败

**问题**：在某些浏览器或环境中，Service Worker无法注册。

**解决方案**：
- 确保网站使用HTTPS协议（本地开发可以使用localhost）
- 检查Service Worker文件路径是否正确
- 清除浏览器缓存和已注册的Service Worker
- 检查控制台错误信息并针对性修复

### 2. 缓存更新问题

**问题**：更新后的应用没有正确加载新版本的资源。

**解决方案**：
- 更新Service Worker文件名或缓存名称
- 在Service Worker的activate事件中清理旧缓存
- 实现skipWaiting和clients.claim()以确保立即激活
- 使用版本化的URL或内容哈希进行缓存破坏

### 3. 推送通知不生效

**问题**：用户已授权，但无法收到推送通知。

**解决方案**：
- 检查推送服务器配置是否正确
- 验证订阅信息是否正确发送到服务器
- 确保Service Worker中正确处理push事件
- 检查网络连接和浏览器支持情况

### 4. 离线功能不稳定

**问题**：离线时应用功能不稳定或部分功能不可用。

**解决方案**：
- 优化缓存策略，确保关键资源被正确缓存
- 实现适当的错误处理和回退机制
- 测试不同网络条件下的应用表现
- 为用户提供明确的离线状态指示

### 5. 浏览器兼容性问题

**问题**：在某些浏览器中PWA功能不可用。

**解决方案**：
- 实现渐进增强，确保基本功能在所有浏览器中可用
- 使用特性检测而不是浏览器检测
- 为不支持的功能提供优雅的降级方案
- 参考[Can I use](https://caniuse.com/)检查特性兼容性

## 最佳实践

### 1. 性能优化

- **关键渲染路径**：优化首屏加载时间，优先加载关键CSS
- **图片优化**：使用适当的格式、大小和懒加载
- **资源压缩**：压缩JavaScript、CSS和HTML
- **预缓存策略**：精心设计缓存策略，避免缓存过大

### 2. 用户体验

- **离线体验**：提供清晰的离线状态指示和功能
- **安装提示**：在适当的时机提示用户安装应用
- **推送通知**：合理使用推送通知，避免过度打扰用户
- **响应式设计**：确保在各种设备上提供良好体验

### 3. 安全性

- **HTTPS**：始终使用HTTPS协议
- **内容安全策略**：实现严格的CSP防止XSS攻击
- **敏感数据**：不要在客户端缓存敏感数据
- **权限请求**：在适当的时机请求权限，提供明确说明

### 4. 开发流程

- **自动化测试**：编写单元测试和集成测试
- **CI/CD**：建立持续集成和部署流程
- **监控**：实施应用监控，收集性能和错误数据
- **用户反馈**：收集用户反馈，持续改进

## 总结

渐进式Web应用（PWA）结合了Web和原生应用的优点，通过现代Web技术提供类似原生的用户体验。实现PWA需要理解和应用Service Worker、Web App Manifest、推送通知、后台同步等核心技术，同时关注性能优化、离线功能和用户体验。通过遵循最佳实践和持续优化，可以创建高性能、可靠、功能丰富的PWA应用，为用户提供出色的使用体验。