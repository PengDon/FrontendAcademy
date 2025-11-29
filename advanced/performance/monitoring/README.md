# 前端性能监控基础知识

## 性能监控简介

前端性能监控是指对 Web 应用的性能指标进行收集、分析和可视化的过程。通过性能监控，我们可以了解用户的真实体验，发现性能瓶颈，持续优化应用性能，提升用户满意度。

### 核心价值

- **实时了解应用性能**：掌握应用在不同环境、不同设备上的实际性能表现
- **及时发现性能问题**：快速定位和解决性能瓶颈
- **量化优化效果**：通过数据验证性能优化的有效性
- **提升用户体验**：基于数据驱动的决策，持续优化用户体验
- **业务指标关联**：分析性能与业务指标（如转化率、留存率）之间的关系

### 监控类型

- **技术性能监控**：加载时间、渲染时间、资源大小等技术指标
- **用户体验监控**：首次内容绘制、可交互时间、最大内容绘制等用户体验指标
- **业务性能监控**：API 响应时间、用户操作响应时间等业务相关指标
- **错误监控**：JavaScript 错误、资源加载错误、API 错误等

## 关键性能指标 (KPIs)

### 1. 核心 Web 指标 (Core Web Vitals)

核心 Web 指标是 Google 定义的衡量用户体验的关键指标，包括：

- **LCP (Largest Contentful Paint)**：最大内容绘制，测量页面主要内容加载完成的时间
  - 良好：≤ 2.5 秒
  - 需要改进：2.5 - 4 秒
  - 较差：> 4 秒

- **FID (First Input Delay)**：首次输入延迟，测量用户首次与页面交互到浏览器响应的时间
  - 良好：≤ 100 毫秒
  - 需要改进：100 - 300 毫秒
  - 较差：> 300 毫秒

- **CLS (Cumulative Layout Shift)**：累积布局偏移，测量页面元素意外移动的程度
  - 良好：≤ 0.1
  - 需要改进：0.1 - 0.25
  - 较差：> 0.25

### 2. 其他重要指标

- **TTFB (Time to First Byte)**：首字节时间，从请求发出到接收到第一个字节的时间
  - 良好：≤ 200 毫秒

- **FCP (First Contentful Paint)**：首次内容绘制，浏览器首次绘制内容的时间
  - 良好：≤ 1.8 秒

- **TTI (Time to Interactive)**：可交互时间，页面完全可交互的时间
  - 良好：≤ 3.8 秒

- **TBT (Total Blocking Time)**：总阻塞时间，主线程被阻塞的总时间
  - 良好：≤ 200 毫秒

- **FMP (First Meaningful Paint)**：首次有效绘制，页面主要内容开始出现的时间

- **资源加载时间**：各种资源（JavaScript、CSS、图片等）的加载时间

## 性能监控实现方案

### 1. 使用 Web Performance API

#### Navigation Timing API

```javascript
// 获取页面加载性能指标
function getNavigationTiming() {
  const timing = performance.getEntriesByType('navigation')[0];
  
  return {
    // 时间戳
    navigationStart: timing.navigationStart,
    unloadEventStart: timing.unloadEventStart,
    unloadEventEnd: timing.unloadEventEnd,
    redirectStart: timing.redirectStart,
    redirectEnd: timing.redirectEnd,
    fetchStart: timing.fetchStart,
    domainLookupStart: timing.domainLookupStart,
    domainLookupEnd: timing.domainLookupEnd,
    connectStart: timing.connectStart,
    connectEnd: timing.connectEnd,
    secureConnectionStart: timing.secureConnectionStart,
    requestStart: timing.requestStart,
    responseStart: timing.responseStart,
    responseEnd: timing.responseEnd,
    domLoading: timing.domLoading,
    domInteractive: timing.domInteractive,
    domContentLoadedEventStart: timing.domContentLoadedEventStart,
    domContentLoadedEventEnd: timing.domContentLoadedEventEnd,
    domComplete: timing.domComplete,
    loadEventStart: timing.loadEventStart,
    loadEventEnd: timing.loadEventEnd,
    
    // 计算的指标
    ttfb: timing.responseStart - timing.requestStart,
    domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
    loadTime: timing.loadEventEnd - timing.navigationStart,
  };
}
```

#### Resource Timing API

```javascript
// 获取资源加载性能指标
function getResourceTiming() {
  const resources = performance.getEntriesByType('resource');
  
  return resources.map(resource => ({
    name: resource.name,
    initiatorType: resource.initiatorType,
    duration: resource.duration,
    transferSize: resource.transferSize,
    encodedBodySize: resource.encodedBodySize,
    decodedBodySize: resource.decodedBodySize,
    fetchStart: resource.fetchStart,
    responseStart: resource.responseStart,
    responseEnd: resource.responseEnd,
  }));
}
```

#### User Timing API

```javascript
// 手动标记性能点
performance.mark('start-important-task');

// 执行重要任务
performImportantTask();

performance.mark('end-important-task');
performance.measure('important-task-duration', 'start-important-task', 'end-important-task');

// 获取测量结果
const measures = performance.getEntriesByName('important-task-duration');
console.log('任务执行时间:', measures[0].duration);
```

#### Paint Timing API

```javascript
// 获取绘制时间指标
function getPaintTiming() {
  const paints = performance.getEntriesByType('paint');
  
  return paints.reduce((result, paint) => {
    result[paint.name] = paint.startTime;
    return result;
  }, {});
}

// 示例输出
// { 'first-paint': 1200, 'first-contentful-paint': 1500 }
```

#### Layout Instability API

```javascript
// 监控布局偏移
let clsValue = 0;
let clsEntries = [];

new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    // 只计算不涉及用户输入的布局偏移
    if (!entry.hadRecentInput) {
      clsValue += entry.value;
      clsEntries.push(entry);
    }
  }
  
  console.log('当前CLS:', clsValue);
}).observe({type: 'layout-shift', buffered: true});
```

#### Long Tasks API

```javascript
// 监控长任务
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    console.log('长任务:', entry);
    console.log('长任务持续时间:', entry.duration);
    console.log('长任务开始时间:', entry.startTime);
  }
}).observe({type: 'longtask', buffered: true});
```

### 2. 错误监控

#### JavaScript 错误监控

```javascript
// 捕获全局错误
window.addEventListener('error', (event) => {
  console.error('JavaScript错误:', {
    message: event.message,
    source: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error,
  });
  
  // 发送错误报告到服务器
  sendErrorReport({
    type: 'js-error',
    message: event.message,
    source: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    stack: event.error ? event.error.stack : null,
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: Date.now(),
  });
});

// 捕获未处理的Promise错误
window.addEventListener('unhandledrejection', (event) => {
  console.error('Promise错误:', event.reason);
  
  // 发送错误报告到服务器
  sendErrorReport({
    type: 'promise-error',
    reason: event.reason,
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: Date.now(),
  });
});
```

#### 资源加载错误监控

```javascript
// 监控资源加载错误
window.addEventListener('error', (event) => {
  // 过滤出资源加载错误
  if (event.target && (event.target.src || event.target.href)) {
    console.error('资源加载错误:', {
      type: event.target.tagName.toLowerCase(),
      url: event.target.src || event.target.href,
    });
    
    // 发送错误报告到服务器
    sendErrorReport({
      type: 'resource-error',
      resourceType: event.target.tagName.toLowerCase(),
      resourceUrl: event.target.src || event.target.href,
      url: window.location.href,
      timestamp: Date.now(),
    });
  }
}, true);
```

### 3. 用户行为监控

```javascript
// 监控页面停留时间
let pageStartTime = Date.now();

window.addEventListener('beforeunload', () => {
  const stayTime = Date.now() - pageStartTime;
  console.log('页面停留时间:', stayTime);
  
  // 发送页面停留时间数据
  sendAnalytics({
    type: 'page-stay-time',
    duration: stayTime,
    url: window.location.href,
  });
});

// 监控用户点击行为
function trackUserClicks() {
  document.addEventListener('click', (event) => {
    // 避免重复跟踪
    if (event.target.hasAttribute('data-tracked')) return;
    
    // 获取元素信息
    const elementInfo = {
      tagName: event.target.tagName.toLowerCase(),
      className: event.target.className,
      id: event.target.id,
      text: event.target.textContent.trim().substring(0, 50),
      x: event.clientX,
      y: event.clientY,
      url: window.location.href,
      timestamp: Date.now(),
    };
    
    console.log('用户点击:', elementInfo);
    sendAnalytics({
      type: 'user-click',
      ...elementInfo,
    });
    
    // 标记为已跟踪
    event.target.setAttribute('data-tracked', 'true');
  }, true);
}
```

## 开源性能监控工具

### 1. Lighthouse

Lighthouse 是 Google 开发的开源工具，用于评估网页的性能、可访问性、最佳实践等。

**使用方法**：

```bash
# 安装 Lighthouse CLI
npm install -g lighthouse

# 运行 Lighthouse
lighthouse https://example.com --output json --output-path ./report.json
```

**Node.js API**：

```javascript
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

async function runLighthouse(url) {
  const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
  const options = {logLevel: 'info', output: 'json', onlyCategories: ['performance'], port: chrome.port};
  const runnerResult = await lighthouse(url, options);
  
  // 性能指标
  const performanceScore = runnerResult.lhr.categories.performance.score * 100;
  const metrics = runnerResult.lhr.audits;
  
  console.log('性能得分:', performanceScore);
  console.log('LCP:', metrics['largest-contentful-paint'].displayValue);
  console.log('FID:', metrics['max-potential-fid'].displayValue);
  console.log('CLS:', metrics['cumulative-layout-shift'].displayValue);
  
  await chrome.kill();
}
```

### 2. web-vitals

web-vitals 是 Google 官方提供的库，用于测量核心 Web 指标。

**安装**：

```bash
npm install web-vitals
```

**使用方法**：

```javascript
import {getLCP, getFID, getCLS} from 'web-vitals';

// 测量 LCP
getLCP(metric => {
  console.log('LCP:', metric.value);
  // 发送到分析服务
  sendToAnalytics({
    name: metric.name,
    value: metric.value,
    id: metric.id,
  });
});

// 测量 FID
getFID(metric => {
  console.log('FID:', metric.value);
  // 发送到分析服务
});

// 测量 CLS
getCLS(metric => {
  console.log('CLS:', metric.value);
  // 发送到分析服务
});
```

### 3. Sentry

Sentry 是一个开源的错误监控平台，提供了全面的错误跟踪和性能监控功能。

**安装**：

```bash
npm install @sentry/browser @sentry/tracing
```

**使用方法**：

```javascript
import * as Sentry from '@sentry/browser';
import {BrowserTracing} from '@sentry/tracing';

// 初始化 Sentry
Sentry.init({
  dsn: 'your-sentry-dsn',
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
});

// 捕获错误
try {
  // 可能抛出错误的代码
} catch (error) {
  Sentry.captureException(error);
}

// 记录性能
const transaction = Sentry.startTransaction({ name: '用户登录' });
try {
  // 执行登录操作
} finally {
  transaction.finish();
}
```

### 4. New Relic Browser

New Relic Browser 是一个全栈可观测性平台，提供了详细的前端性能监控功能。

**使用方法**：

在 HTML 头部添加 New Relic 的监控脚本：

```html
<script type="text/javascript">
  window.NREUM||(NREUM={});
  NREUM.init={privacy:{cookies_enabled:true}};
  (function(){var nr=window.NREUM;if(nr.inst&&nr.inst.reload)nr.inst.reload();else{var d=document;if(d.querySelector)if(!nr.TAG)if(NREUM.init={privacy:{cookies_enabled:true}},!nr.inst){var e=function(){var t=document.createElement("script");t.src="https://js-agent.newrelic.com/nr-spa.min.js";t.async=1;var e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(t,e)};window.addEventListener?window.addEventListener("load",e,!1):window.attachEvent("onload",e)}}})();
</script>
```

### 5. LogRocket

LogRocket 是一个会话回放和错误监控工具，可以记录用户会话并重现问题。

**安装**：

```bash
npm install logrocket
```

**使用方法**：

```javascript
import LogRocket from 'logrocket';

// 初始化 LogRocket
LogRocket.init('your-app-id');

// 记录用户信息
LogRocket.identify('user-id', {
  name: 'User Name',
  email: 'user@example.com',
});

// 记录自定义事件
LogRocket.track('user-action', {
  category: 'navigation',
  action: 'click-button',
  label: 'Submit',
});
```

## 自定义性能监控系统

### 1. 数据收集层

```javascript
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.init();
  }

  init() {
    // 监听页面加载完成事件
    window.addEventListener('load', this.collectNavigationMetrics.bind(this));
    
    // 监听 DOMContentLoaded 事件
    document.addEventListener('DOMContentLoaded', this.collectDomMetrics.bind(this));
    
    // 监听核心 Web 指标
    this.observeCoreWebVitals();
    
    // 监听错误
    this.setupErrorMonitoring();
  }

  collectNavigationMetrics() {
    const timing = performance.getEntriesByType('navigation')[0];
    if (timing) {
      this.metrics.navigation = {
        ttfb: timing.responseStart - timing.requestStart,
        domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
        loadTime: timing.loadEventEnd - timing.navigationStart,
      };
      this.sendMetrics('navigation', this.metrics.navigation);
    }
  }

  collectDomMetrics() {
    this.metrics.dom = {
      domInteractive: performance.now(),
      resourceCount: performance.getEntriesByType('resource').length,
    };
    this.sendMetrics('dom', this.metrics.dom);
  }

  observeCoreWebVitals() {
    // 观察 LCP
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.lcp = lastEntry.startTime;
      this.sendMetrics('lcp', { value: this.metrics.lcp });
    }).observe({type: 'largest-contentful-paint', buffered: true});

    // 观察 FID
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const firstInput = entries[0];
      this.metrics.fid = firstInput.processingStart - firstInput.startTime;
      this.sendMetrics('fid', { value: this.metrics.fid });
    }).observe({type: 'first-input', buffered: true});

    // 观察 CLS
    let clsValue = 0;
    let clsEntries = [];
    
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          clsEntries.push(entry);
        }
      }
      this.metrics.cls = clsValue;
      this.sendMetrics('cls', { value: this.metrics.cls });
    }).observe({type: 'layout-shift', buffered: true});
  }

  setupErrorMonitoring() {
    // JavaScript 错误
    window.addEventListener('error', (event) => {
      this.sendError({
        type: 'js-error',
        message: event.message,
        source: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error ? event.error.stack : null,
      });
    });

    // Promise 错误
    window.addEventListener('unhandledrejection', (event) => {
      this.sendError({
        type: 'promise-error',
        reason: event.reason,
      });
    });
  }

  sendMetrics(type, data) {
    console.log(`发送${type}指标:`, data);
    // 发送到服务器
    navigator.sendBeacon('/api/performance', JSON.stringify({
      type,
      data,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
    }));
  }

  sendError(error) {
    console.error('发送错误报告:', error);
    // 发送到服务器
    navigator.sendBeacon('/api/error', JSON.stringify({
      ...error,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
    }));
  }
}

// 初始化监控
new PerformanceMonitor();
```

### 2. 数据上报策略

```javascript
class MetricsReporter {
  constructor() {
    this.queue = [];
    this.threshold = 10; // 批量发送阈值
    this.interval = 5000; // 定时发送间隔（毫秒）
    this.init();
  }

  init() {
    // 定时发送
    setInterval(this.flush.bind(this), this.interval);
    
    // 页面卸载时发送
    window.addEventListener('beforeunload', this.flush.bind(this));
  }

  add(metric) {
    this.queue.push(metric);
    
    // 达到阈值时发送
    if (this.queue.length >= this.threshold) {
      this.flush();
    }
  }

  async flush() {
    if (this.queue.length === 0) return;
    
    const dataToSend = [...this.queue];
    this.queue = [];
    
    try {
      // 使用 navigator.sendBeacon（优先）
      if (navigator.sendBeacon) {
        const success = navigator.sendBeacon('/api/metrics', JSON.stringify(dataToSend));
        if (!success) {
          // 如果失败，使用 fetch 兜底
          await this.fetchMetrics(dataToSend);
        }
      } else {
        // 不支持 sendBeacon，使用 fetch
        await this.fetchMetrics(dataToSend);
      }
    } catch (error) {
      console.error('发送指标失败:', error);
      // 重试逻辑
      this.retry(dataToSend);
    }
  }

  async fetchMetrics(data) {
    await fetch('/api/metrics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      // 保持连接活跃，即使页面即将卸载
      keepalive: true,
    });
  }

  retry(data) {
    // 将数据放回队列
    this.queue = [...data, ...this.queue];
  }
}

// 使用示例
const reporter = new MetricsReporter();
reporter.add({type: 'lcp', value: 2500});
reporter.add({type: 'fid', value: 50});
reporter.add({type: 'cls', value: 0.05});
```

### 3. 数据存储与分析

后端数据存储和分析系统可以使用：

- **时序数据库**：InfluxDB、Prometheus 等，适合存储性能指标
- **日志系统**：ELK Stack (Elasticsearch, Logstash, Kibana)，适合日志和错误分析
- **数据可视化**：Grafana、Kibana 等，用于创建性能监控仪表盘

## 性能监控最佳实践

### 1. 监控策略

- **采样监控**：对部分用户进行监控，避免对所有用户产生性能影响
- **分层监控**：区分关键页面和非关键页面，对关键页面进行更详细的监控
- **实时监控**：及时发现和解决性能问题
- **历史趋势**：分析性能指标的历史趋势，识别长期性能变化

### 2. 数据收集优化

- **减少监控代码体积**：监控脚本应尽可能小，减少对主应用的影响
- **延迟加载**：在页面核心功能加载完成后再加载监控脚本
- **批量上报**：减少网络请求数量
- **使用 sendBeacon**：优先使用 sendBeacon API 进行低优先级数据上报
- **避免阻塞主线程**：监控代码不应阻塞页面渲染和用户交互

### 3. 数据分析与可视化

- **建立性能仪表盘**：创建直观的性能指标可视化仪表盘
- **设置性能警报**：当性能指标超过阈值时触发警报
- **用户分群分析**：按设备类型、浏览器、网络环境等维度分析性能
- **性能与业务关联**：分析性能指标与业务指标（如转化率）的关系

### 4. 持续优化

- **性能预算**：为关键性能指标设置预算
- **回归测试**：在代码变更后验证性能是否退化
- **A/B 测试**：通过 A/B 测试验证性能优化的效果
- **定期报告**：生成定期性能报告，跟踪优化进展

## 常见问题与解决方案

### 1. 监控脚本影响主应用性能

**问题**：监控脚本本身可能影响应用的性能。

**解决方案**：
- 使用 Web Workers 进行数据处理
- 延迟加载监控脚本
- 限制监控代码的执行频率

```javascript
// 延迟加载监控脚本
function loadPerformanceMonitor() {
  if (window.performance && window.performance.now) {
    setTimeout(() => {
      const script = document.createElement('script');
      script.src = '/path/to/monitor.js';
      script.async = true;
      document.head.appendChild(script);
    }, 3000); // 延迟3秒加载
  }
}
```

### 2. 数据上报失败

**问题**：在弱网环境下，数据上报可能失败。

**解决方案**：
- 使用队列机制缓存数据
- 实现重试逻辑
- 使用离线存储

```javascript
// 使用 IndexedDB 缓存数据
async function cacheMetrics(metrics) {
  const db = await openDatabase();
  const tx = db.transaction('metrics', 'readwrite');
  const store = tx.objectStore('metrics');
  
  for (const metric of metrics) {
    await store.add(metric);
  }
  
  await tx.complete;
}

// 尝试发送缓存的数据
async function sendCachedMetrics() {
  const db = await openDatabase();
  const tx = db.transaction('metrics', 'readwrite');
  const store = tx.objectStore('metrics');
  const metrics = await store.getAll();
  
  if (metrics.length > 0) {
    try {
      await sendMetricsToServer(metrics);
      // 发送成功后清除缓存
      await store.clear();
    } catch (error) {
      console.error('发送缓存数据失败:', error);
    }
  }
}
```

### 3. 数据量过大

**问题**：大量的性能数据可能导致存储和分析困难。

**解决方案**：
- 实施采样策略
- 聚合数据
- 设置数据保留策略

```javascript
// 采样策略 - 只对部分用户进行监控
function shouldMonitor() {
  // 对 20% 的用户进行监控
  return Math.random() < 0.2;
}

if (shouldMonitor()) {
  // 初始化监控
  initPerformanceMonitoring();
}
```

## 总结

前端性能监控是构建高性能 Web 应用的重要环节。通过合理使用现代浏览器提供的性能 API 和专业的监控工具，我们可以全面了解应用的性能状况，及时发现和解决性能问题，持续提升用户体验。

在实施性能监控时，我们应该遵循最佳实践，平衡监控的全面性和对应用性能的影响，建立完善的数据收集、上报、存储和分析流程，为性能优化提供有力的数据支持。

随着 Web 技术的不断发展，性能监控技术也在持续演进。我们需要不断学习和探索新的监控方法和工具，为用户提供更快、更流畅的 Web 体验。

---

希望这份前端性能监控基础知识文档能够帮助你建立完善的性能监控体系，提升应用性能，打造更好的用户体验。通过持续的性能监控和优化，你将能够构建出高性能、高可用的现代 Web 应用。