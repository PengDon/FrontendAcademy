# 代理模式 (Proxy Pattern)

## 什么是代理模式

代理模式是一种结构型设计模式，它允许通过引入一个代理对象来控制对另一个对象的访问。代理模式在客户端和目标对象之间增加了一个中间层，从而可以在不改变目标对象的情况下，增强或控制对目标对象的访问。

代理模式的核心思想是：不直接访问实际对象，而是通过代理对象间接地访问它。代理对象可以在访问实际对象前后执行一些额外的逻辑，比如权限检查、缓存、日志记录等。

## 代理模式的核心组件

1. **主题接口 (Subject)**：定义代理类和真实主题类的共同接口，使得客户端可以无差别地使用代理对象和真实对象
2. **真实主题 (RealSubject)**：实现主题接口，是代理类所代理的实际对象
3. **代理 (Proxy)**：实现主题接口，持有对真实主题对象的引用，在访问真实对象前后可以执行额外的操作

## 代理模式的类型

### 1. 远程代理 (Remote Proxy)

远程代理为一个位于不同地址空间的对象提供一个本地代理。这在分布式系统中特别有用，可以隐藏对象位于远程服务器的事实。

### 2. 虚拟代理 (Virtual Proxy)

虚拟代理根据需要创建开销较大的对象。只有在真正需要使用对象时才创建它，这可以提高应用程序的性能。

### 3. 保护代理 (Protection Proxy)

保护代理控制对原始对象的访问，检查调用者是否有足够的权限来访问真实对象。

### 4. 缓存代理 (Cache Proxy)

缓存代理保存对真实对象方法调用的结果，并在后续调用时返回缓存的结果，避免重复计算或操作。

### 5. 智能引用代理 (Smart Reference Proxy)

智能引用代理在访问对象时执行一些额外的操作，如引用计数、垃圾回收等。

## 代理模式的实现

### 基本实现

```javascript
// 主题接口
class Subject {
  request() {
    throw new Error('此方法必须由子类实现');
  }
}

// 真实主题类
class RealSubject extends Subject {
  request() {
    console.log('RealSubject 处理请求');
    return 'RealSubject 响应';
  }
}

// 代理类
class Proxy extends Subject {
  constructor(realSubject) {
    super();
    this.realSubject = realSubject;
  }

  request() {
    // 在访问真实对象前执行额外操作
    this.beforeRequest();
    
    // 调用真实对象的方法
    const result = this.realSubject.request();
    
    // 在访问真实对象后执行额外操作
    this.afterRequest();
    
    return result;
  }

  beforeRequest() {
    console.log('代理：在请求前执行额外操作');
    // 可以在这里添加权限检查、日志记录等
  }

  afterRequest() {
    console.log('代理：在请求后执行额外操作');
    // 可以在这里添加缓存、资源清理等
  }
}

// 客户端代码
function clientCode() {
  console.log('--- 代理模式基本实现示例 ---');
  
  // 创建真实对象
  const realSubject = new RealSubject();
  
  // 直接使用真实对象
  console.log('\n直接调用真实对象:');
  realSubject.request();
  
  // 使用代理对象
  console.log('\n通过代理调用:');
  const proxy = new Proxy(realSubject);
  proxy.request();
}

// 使用示例
clientCode();
```

### 保护代理实现

```javascript
// 主题接口
class Subject {
  operation() {
    throw new Error('此方法必须由子类实现');
  }
}

// 真实主题类
class RealSubject extends Subject {
  operation() {
    console.log('RealSubject: 执行敏感操作');
    return '敏感操作执行成功';
  }
}

// 保护代理类
class ProtectionProxy extends Subject {
  constructor(realSubject) {
    super();
    this.realSubject = realSubject;
    this.userRoles = new Map(); // 用户角色映射
  }

  // 设置用户角色
  setUserRole(userId, role) {
    this.userRoles.set(userId, role);
    console.log(`用户 ${userId} 的角色设置为 ${role}`);
  }

  // 检查权限
  hasPermission(userId, requiredRole) {
    const userRole = this.userRoles.get(userId);
    console.log(`检查用户 ${userId} (角色: ${userRole}) 是否有 ${requiredRole} 权限`);
    return userRole === requiredRole;
  }

  // 代理操作，带权限检查
  operation(userId) {
    // 要求管理员权限
    const requiredRole = 'admin';
    
    if (!this.hasPermission(userId, requiredRole)) {
      console.log(`访问被拒绝：用户 ${userId} 没有足够的权限`);
      return '访问被拒绝';
    }
    
    // 有足够权限，调用真实对象的方法
    console.log(`权限验证通过，允许用户 ${userId} 访问`);
    return this.realSubject.operation();
  }
}

// 客户端代码
function clientCode() {
  console.log('--- 保护代理实现示例 ---');
  
  // 创建真实对象和代理
  const realSubject = new RealSubject();
  const proxy = new ProtectionProxy(realSubject);
  
  // 设置用户角色
  proxy.setUserRole('user1', 'admin');
  proxy.setUserRole('user2', 'guest');
  
  console.log('\n用户1 (管理员) 尝试访问:');
  proxy.operation('user1');
  
  console.log('\n用户2 (访客) 尝试访问:');
  proxy.operation('user2');
  
  console.log('\n未知用户尝试访问:');
  proxy.operation('unknown');
}

// 使用示例
clientCode();
```

### 虚拟代理实现

```javascript
// 图像接口
class Image {
  display() {
    throw new Error('此方法必须由子类实现');
  }
}

// 真实图像类（重量级对象）
class RealImage extends Image {
  constructor(filename) {
    super();
    this.filename = filename;
    this.loadFromDisk(); // 加载图像是一个昂贵的操作
  }

  loadFromDisk() {
    console.log(`加载图像: ${this.filename} (模拟耗时操作...)`);
    // 模拟耗时的图像加载操作
    // 在实际应用中，这里可能是从服务器或磁盘加载大型图像文件
    this.loaded = true;
  }

  display() {
    if (this.loaded) {
      console.log(`显示图像: ${this.filename}`);
      return `图像 ${this.filename} 显示成功`;
    } else {
      console.log(`错误: 图像 ${this.filename} 未加载`);
      return '图像加载失败';
    }
  }
}

// 虚拟代理类
class VirtualImageProxy extends Image {
  constructor(filename) {
    super();
    this.filename = filename;
    this.realImage = null; // 延迟初始化真实图像
  }

  display() {
    // 只有在真正需要显示图像时才创建真实图像对象
    if (!this.realImage) {
      console.log(`需要显示图像 ${this.filename}，开始加载...`);
      this.realImage = new RealImage(this.filename);
    }
    
    // 委托给真实图像对象处理
    return this.realImage.display();
  }

  // 预加载方法（可选）
  preload() {
    if (!this.realImage) {
      console.log(`预加载图像 ${this.filename}`);
      this.realImage = new RealImage(this.filename);
    } else {
      console.log(`图像 ${this.filename} 已经加载`);
    }
  }

  // 检查是否已加载
  isLoaded() {
    return this.realImage !== null;
  }
}

// 客户端代码
function clientCode() {
  console.log('--- 虚拟代理实现示例 ---');
  
  console.log('创建虚拟图像代理:');
  const imageProxy1 = new VirtualImageProxy('photo1.jpg');
  const imageProxy2 = new VirtualImageProxy('photo2.jpg');
  
  console.log('\n初始状态:');
  console.log(`图像1已加载: ${imageProxy1.isLoaded()}`);
  console.log(`图像2已加载: ${imageProxy2.isLoaded()}`);
  
  console.log('\n显示图像1:');
  imageProxy1.display();
  
  console.log('\n再次显示图像1 (应该使用已加载的实例):');
  imageProxy1.display();
  
  console.log('\n预加载图像2:');
  imageProxy2.preload();
  
  console.log('\n最终状态:');
  console.log(`图像1已加载: ${imageProxy1.isLoaded()}`);
  console.log(`图像2已加载: ${imageProxy2.isLoaded()}`);
}

// 使用示例
clientCode();
```

### 缓存代理实现

```javascript
// 计算接口
class Calculator {
  calculate(expression) {
    throw new Error('此方法必须由子类实现');
  }
}

// 真实计算器类
class RealCalculator extends Calculator {
  calculate(expression) {
    console.log(`计算表达式: ${expression}`);
    // 模拟耗时的计算过程
    this.simulateHeavyComputation();
    
    // 简单的表达式求值（仅支持加法和乘法）
    try {
      // 注意：在实际应用中，应该使用更安全的表达式求值方法
      // 这里仅为演示目的
      const result = new Function(`return ${expression}`)();
      console.log(`计算结果: ${result}`);
      return result;
    } catch (error) {
      console.error(`计算错误: ${error.message}`);
      return NaN;
    }
  }

  simulateHeavyComputation() {
    // 模拟耗时操作
    console.log('执行耗时计算...');
    // 在实际应用中，这里可能是复杂的数学计算
  }
}

// 缓存代理类
class CachedCalculatorProxy extends Calculator {
  constructor(calculator) {
    super();
    this.calculator = calculator;
    this.cache = new Map(); // 使用Map存储计算结果缓存
  }

  calculate(expression) {
    // 检查缓存中是否已存在相同表达式的计算结果
    if (this.cache.has(expression)) {
      const cachedResult = this.cache.get(expression);
      console.log(`从缓存返回表达式 ${expression} 的结果: ${cachedResult}`);
      return cachedResult;
    }
    
    // 缓存未命中，执行实际计算
    console.log(`缓存未命中，计算表达式 ${expression}`);
    const result = this.calculator.calculate(expression);
    
    // 存储计算结果到缓存
    this.cache.set(expression, result);
    console.log(`将表达式 ${expression} 的结果缓存`);
    
    return result;
  }

  // 清除缓存
  clearCache() {
    const cacheSize = this.cache.size;
    this.cache.clear();
    console.log(`缓存已清除，共删除 ${cacheSize} 条记录`);
  }

  // 获取缓存大小
  getCacheSize() {
    return this.cache.size;
  }

  // 显示缓存内容
  displayCache() {
    console.log('\n当前缓存内容:');
    if (this.cache.size === 0) {
      console.log('缓存为空');
      return;
    }
    
    for (const [expression, result] of this.cache.entries()) {
      console.log(`${expression} = ${result}`);
    }
  }
}

// 客户端代码
function clientCode() {
  console.log('--- 缓存代理实现示例 ---');
  
  // 创建真实计算器和缓存代理
  const realCalculator = new RealCalculator();
  const calculatorProxy = new CachedCalculatorProxy(realCalculator);
  
  console.log('\n首次计算表达式 "2 + 3 * 4":');
  const result1 = calculatorProxy.calculate('2 + 3 * 4');
  
  console.log('\n再次计算相同表达式 "2 + 3 * 4":');
  const result2 = calculatorProxy.calculate('2 + 3 * 4');
  
  console.log('\n计算新表达式 "5 * (6 + 7)":');
  const result3 = calculatorProxy.calculate('5 * (6 + 7)');
  
  console.log('\n计算另一个表达式 "10 / 2 + 3":');
  const result4 = calculatorProxy.calculate('10 / 2 + 3');
  
  console.log('\n缓存信息:');
  console.log(`缓存项数量: ${calculatorProxy.getCacheSize()}`);
  calculatorProxy.displayCache();
  
  console.log('\n清除缓存:');
  calculatorProxy.clearCache();
  
  console.log('\n缓存清除后:');
  console.log(`缓存项数量: ${calculatorProxy.getCacheSize()}`);
  calculatorProxy.displayCache();
  
  console.log('\n再次计算表达式 "2 + 3 * 4" (缓存已清除):');
  const result5 = calculatorProxy.calculate('2 + 3 * 4');
}

// 使用示例
clientCode();
```

## 代理模式的应用场景

1. **权限控制**：在访问敏感资源前进行权限检查
2. **延迟加载**：当对象创建开销较大时，延迟创建直到真正需要
3. **性能优化**：缓存方法调用结果，避免重复计算
4. **日志记录**：记录对对象的访问操作
5. **远程访问**：通过代理访问远程服务器上的对象
6. **监控和统计**：收集对象使用情况的统计信息
7. **事务管理**：在方法调用前后添加事务处理
8. **网络代理**：处理网络请求的代理，如HTTP代理

## 代理模式的优点

1. **职责分离**：代理对象可以承担额外的职责，使真实对象专注于核心功能
2. **保护真实对象**：可以控制对真实对象的访问，提供额外的安全层
3. **延迟初始化**：可以实现延迟加载，提高系统性能
4. **增强功能**：在不修改真实对象的情况下，动态地添加新功能
5. **透明性**：客户端可以无差别地使用代理对象和真实对象

## 代理模式的缺点

1. **增加复杂性**：引入代理会增加系统的复杂性和额外的类
2. **性能开销**：代理的额外操作可能会导致一定的性能开销
3. **延迟**：代理可能会导致请求处理的延迟，特别是在远程代理中
4. **可能造成设计过度**：对于简单的应用，使用代理可能显得过于复杂

## 代理模式与装饰器模式的区别

**代理模式**和**装饰器模式**在结构上非常相似，都是通过一个包装类来扩展另一个类的功能。然而，它们的目的和使用场景有所不同：

- **代理模式**：主要用于控制对对象的访问，通常在访问对象前执行一些预处理操作（如权限检查、延迟初始化等）
- **装饰器模式**：主要用于动态地向对象添加新的功能，强调功能的组合和扩展

简单来说，代理模式注重的是**访问控制**，而装饰器模式注重的是**功能扩展**。

## 实际应用案例

### 1. REST API 代理

```javascript
// API 接口
class ApiService {
  async fetchData(endpoint, params = {}) {
    throw new Error('此方法必须由子类实现');
  }
}

// 真实 API 服务
class RealApiService extends ApiService {
  constructor(baseUrl) {
    super();
    this.baseUrl = baseUrl;
  }

  async fetchData(endpoint, params = {}) {
    const url = `${this.baseUrl}/${endpoint}`;
    console.log(`发起API请求: ${url}`);
    console.log('参数:', params);
    
    try {
      // 在实际应用中，这里会使用 fetch 或 axios 等进行真实的网络请求
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 模拟返回数据
      const mockData = {
        endpoint,
        params,
        timestamp: new Date().toISOString(),
        data: { id: 1, name: '示例数据', value: Math.random() * 100 }
      };
      
      console.log('API响应成功');
      return mockData;
    } catch (error) {
      console.error('API请求失败:', error.message);
      throw error;
    }
  }
}

// API 代理服务
class ApiProxy extends ApiService {
  constructor(apiService) {
    super();
    this.apiService = apiService;
    this.cache = new Map(); // 响应缓存
    this.rateLimits = new Map(); // 速率限制记录
    this.cacheTime = 30000; // 缓存有效期（毫秒）
    this.requestInterval = 1000; // 请求间隔限制（毫秒）
  }

  // 构建缓存键
  getCacheKey(endpoint, params) {
    return `${endpoint}_${JSON.stringify(params)}`;
  }

  // 检查缓存
  hasValidCache(endpoint, params) {
    const key = this.getCacheKey(endpoint, params);
    if (!this.cache.has(key)) return false;
    
    const cacheItem = this.cache.get(key);
    const isExpired = Date.now() - cacheItem.timestamp > this.cacheTime;
    
    if (isExpired) {
      console.log(`缓存已过期: ${key}`);
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  // 获取缓存数据
  getCachedData(endpoint, params) {
    const key = this.getCacheKey(endpoint, params);
    const cacheItem = this.cache.get(key);
    console.log(`从缓存返回: ${key}`);
    return cacheItem.data;
  }

  // 设置缓存数据
  setCachedData(endpoint, params, data) {
    const key = this.getCacheKey(endpoint, params);
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    console.log(`缓存数据: ${key}`);
  }

  // 检查速率限制
  checkRateLimit(endpoint) {
    if (!this.rateLimits.has(endpoint)) {
      this.rateLimits.set(endpoint, Date.now());
      return true;
    }
    
    const lastRequestTime = this.rateLimits.get(endpoint);
    const timeSinceLastRequest = Date.now() - lastRequestTime;
    
    if (timeSinceLastRequest < this.requestInterval) {
      console.log(`速率限制: ${endpoint}, 需要等待 ${this.requestInterval - timeSinceLastRequest}ms`);
      return false;
    }
    
    // 更新最后请求时间
    this.rateLimits.set(endpoint, Date.now());
    return true;
  }

  // 处理请求重试
  async withRetry(fn, maxRetries = 3) {
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        console.log(`请求失败，重试 ${i + 1}/${maxRetries}`);
        // 指数退避策略
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
      }
    }
    
    throw lastError;
  }

  // 代理 fetchData 方法
  async fetchData(endpoint, params = {}) {
    console.log(`\n代理处理请求: ${endpoint}`);
    
    // 1. 检查速率限制
    if (!this.checkRateLimit(endpoint)) {
      throw new Error('请求过于频繁，请稍后再试');
    }
    
    // 2. 检查缓存
    if (this.hasValidCache(endpoint, params)) {
      return this.getCachedData(endpoint, params);
    }
    
    // 3. 添加请求头和参数处理
    const processedParams = this.processParams(params);
    
    // 4. 执行请求，带重试机制
    const result = await this.withRetry(async () => {
      return await this.apiService.fetchData(endpoint, processedParams);
    });
    
    // 5. 缓存结果
    this.setCachedData(endpoint, params, result);
    
    // 6. 记录请求日志
    this.logRequest(endpoint, params, result);
    
    return result;
  }

  // 处理请求参数
  processParams(params) {
    // 在实际应用中，这里可能会进行参数验证、格式化等操作
    return { ...params, timestamp: Date.now() };
  }

  // 记录请求日志
  logRequest(endpoint, params, result) {
    console.log(`请求日志: ${endpoint}`);
    // 在实际应用中，这里可能会将日志发送到日志服务
  }

  // 清除特定缓存
  clearCache(endpoint) {
    for (const key of this.cache.keys()) {
      if (key.startsWith(endpoint)) {
        this.cache.delete(key);
        console.log(`清除缓存: ${key}`);
      }
    }
  }

  // 清除所有缓存
  clearAllCache() {
    const cacheSize = this.cache.size;
    this.cache.clear();
    console.log(`清除所有缓存，共 ${cacheSize} 项`);
  }
}

// 客户端代码
async function clientCode() {
  console.log('--- API代理实现示例 ---');
  
  // 创建真实API服务和代理
  const realApiService = new RealApiService('https://api.example.com');
  const apiProxy = new ApiProxy(realApiService);
  
  try {
    // 首次请求，应该没有缓存
    console.log('\n首次请求 users 接口:');
    const result1 = await apiProxy.fetchData('users', { page: 1, limit: 10 });
    console.log('结果:', JSON.stringify(result1.data));
    
    // 再次请求相同接口，应该使用缓存
    console.log('\n再次请求相同接口:');
    const result2 = await apiProxy.fetchData('users', { page: 1, limit: 10 });
    console.log('结果:', JSON.stringify(result2.data));
    
    // 请求不同参数
    console.log('\n请求不同参数:');
    const result3 = await apiProxy.fetchData('users', { page: 2, limit: 10 });
    console.log('结果:', JSON.stringify(result3.data));
    
    // 测试速率限制
    console.log('\n测试速率限制:');
    try {
      // 这里故意不等待，应该触发速率限制
      await apiProxy.fetchData('users', { page: 1, limit: 10 });
    } catch (error) {
      console.log('捕获到速率限制错误:', error.message);
    }
    
    // 等待足够长的时间后再请求
    console.log('\n等待后再次请求:');
    await new Promise(resolve => setTimeout(resolve, 1500));
    const result4 = await apiProxy.fetchData('posts', { category: 'tech' });
    console.log('结果:', JSON.stringify(result4.data));
    
    // 清除缓存
    console.log('\n清除 users 相关缓存:');
    apiProxy.clearCache('users');
    
    // 清除缓存后再次请求
    console.log('\n清除缓存后再次请求 users 接口:');
    const result5 = await apiProxy.fetchData('users', { page: 1, limit: 10 });
    console.log('结果:', JSON.stringify(result5.data));
    
  } catch (error) {
    console.error('客户端错误:', error.message);
  }
}

// 使用示例
clientCode();
```

### 2. 图片加载代理

```javascript
// 图片接口
class ImageLoader {
  loadImage(url) {
    throw new Error('此方法必须由子类实现');
  }

  displayImage(element) {
    throw new Error('此方法必须由子类实现');
  }
}

// 真实图片加载器
class RealImageLoader extends ImageLoader {
  constructor() {
    super();
    this.image = null;
  }

  loadImage(url) {
    return new Promise((resolve, reject) => {
      console.log(`开始加载图片: ${url}`);
      
      this.image = new Image();
      
      // 设置加载成功和失败的回调
      this.image.onload = () => {
        console.log(`图片加载成功: ${url}`);
        resolve(this.image);
      };
      
      this.image.onerror = (error) => {
        console.error(`图片加载失败: ${url}`, error);
        reject(new Error(`无法加载图片: ${url}`));
      };
      
      // 开始加载
      this.image.src = url;
    });
  }

  displayImage(element) {
    if (!this.image) {
      console.error('没有加载的图片可供显示');
      return false;
    }
    
    if (element instanceof HTMLElement) {
      // 清空容器
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
      
      // 添加图片元素
      element.appendChild(this.image.cloneNode(true));
      console.log('图片已显示');
      return true;
    } else {
      console.error('无效的显示元素');
      return false;
    }
  }
}

// 图片代理加载器
class ImageProxyLoader extends ImageLoader {
  constructor(realLoader) {
    super();
    this.realLoader = realLoader;
    this.cache = new Map(); // 图片缓存
    this.placeholderUrl = 'https://via.placeholder.com/300x200?text=Loading...';
    this.errorUrl = 'https://via.placeholder.com/300x200?text=Error';
    this.loadingImages = new Set(); // 正在加载的图片URL集合
    this.listeners = new Map(); // 加载事件监听器
  }

  // 加载图片，带缓存和占位符
  async loadImage(url) {
    console.log(`代理处理图片加载: ${url}`);
    
    // 1. 检查缓存
    if (this.cache.has(url)) {
      console.log(`从缓存加载图片: ${url}`);
      return this.cache.get(url);
    }
    
    // 2. 检查是否正在加载
    if (this.loadingImages.has(url)) {
      console.log(`图片正在加载中: ${url}`);
      return this.waitForImageLoading(url);
    }
    
    try {
      // 3. 标记为正在加载
      this.loadingImages.add(url);
      
      // 4. 加载真实图片
      const image = await this.realLoader.loadImage(url);
      
      // 5. 缓存结果
      this.cache.set(url, image);
      
      // 6. 通知等待的回调
      this.notifyImageLoaded(url, image);
      
      return image;
    } catch (error) {
      console.error(`图片加载失败，使用错误占位图: ${url}`);
      // 加载失败时使用错误占位图
      const errorImage = await this.realLoader.loadImage(this.errorUrl);
      
      // 缓存错误占位图
      this.cache.set(url, errorImage);
      
      // 通知等待的回调
      this.notifyImageLoaded(url, errorImage, true);
      
      return errorImage;
    } finally {
      // 7. 无论成功失败，都从正在加载集合中移除
      this.loadingImages.delete(url);
    }
  }

  // 等待图片加载完成
  waitForImageLoading(url) {
    return new Promise((resolve) => {
      if (!this.listeners.has(url)) {
        this.listeners.set(url, []);
      }
      this.listeners.get(url).push(resolve);
    });
  }

  // 通知图片加载完成
  notifyImageLoaded(url, image, isError = false) {
    if (!this.listeners.has(url)) return;
    
    const callbacks = this.listeners.get(url);
    for (const callback of callbacks) {
      callback(image);
    }
    
    // 清理回调
    this.listeners.delete(url);
  }

  // 显示图片，带加载占位符
  async displayImage(element, url, showPlaceholder = true) {
    console.log(`代理显示图片: ${url}`);
    
    // 如果要显示占位符且图片不在缓存中
    if (showPlaceholder && !this.cache.has(url)) {
      // 先显示加载占位符
      await this.realLoader.loadImage(this.placeholderUrl);
      this.realLoader.displayImage(element);
    }
    
    try {
      // 加载并显示真实图片
      await this.loadImage(url);
      return this.realLoader.displayImage(element);
    } catch (error) {
      console.error('显示图片失败:', error.message);
      return false;
    }
  }

  // 预加载图片
  async preloadImages(urls) {
    console.log(`预加载 ${urls.length} 张图片`);
    const promises = urls.map(url => this.loadImage(url));
    return Promise.all(promises);
  }

  // 清除缓存
  clearCache(url) {
    if (url) {
      this.cache.delete(url);
      console.log(`清除图片缓存: ${url}`);
    } else {
      const cacheSize = this.cache.size;
      this.cache.clear();
      console.log(`清除所有图片缓存，共 ${cacheSize} 张`);
    }
  }

  // 获取缓存统计信息
  getCacheInfo() {
    return {
      cachedImages: this.cache.size,
      loadingImages: this.loadingImages.size,
      waitingCallbacks: this.listeners.size
    };
  }
}

// 客户端代码 - 模拟浏览器环境
function simulateClientCode() {
  console.log('--- 图片加载代理实现示例 ---');
  
  // 模拟浏览器环境中的Image对象
  global.Image = class Image {
    constructor() {
      this.src = '';
      this.onload = null;
      this.onerror = null;
      this.loaded = false;
    }

    set src(url) {
      this._src = url;
      // 模拟图片加载
      setTimeout(() => {
        // 模拟90%的图片加载成功
        const shouldSucceed = Math.random() > 0.1 || url.includes('placeholder');
        
        if (shouldSucceed) {
          this.loaded = true;
          if (this.onload) this.onload();
        } else {
          if (this.onerror) this.onerror(new Error('模拟加载失败'));
        }
      }, 500 + Math.random() * 1000); // 随机延迟
    }

    get src() {
      return this._src;
    }

    cloneNode() {
      const img = new Image();
      img.src = this._src;
      img.loaded = this.loaded;
      return img;
    }
  };

  // 模拟DOM元素
  class MockElement {
    constructor() {
      this.children = [];
    }

    appendChild(child) {
      this.children.push(child);
    }

    removeChild(child) {
      const index = this.children.indexOf(child);
      if (index !== -1) {
        this.children.splice(index, 1);
      }
    }

    get firstChild() {
      return this.children[0] || null;
    }
  }

  // 创建图片加载器和代理
  const realLoader = new RealImageLoader();
  const proxyLoader = new ImageProxyLoader(realLoader);
  
  // 模拟显示图片
  async function testImageLoading() {
    // 创建模拟元素
    const container1 = new MockElement();
    const container2 = new MockElement();
    const container3 = new MockElement();
    
    console.log('\n测试1: 首次加载图片');
    await proxyLoader.displayImage(container1, 'https://example.com/image1.jpg');
    console.log('缓存信息:', proxyLoader.getCacheInfo());
    
    console.log('\n测试2: 再次加载相同图片（应该使用缓存）');
    await proxyLoader.displayImage(container2, 'https://example.com/image1.jpg');
    console.log('缓存信息:', proxyLoader.getCacheInfo());
    
    console.log('\n测试3: 加载新图片');
    await proxyLoader.displayImage(container3, 'https://example.com/image2.jpg');
    console.log('缓存信息:', proxyLoader.getCacheInfo());
    
    console.log('\n测试4: 预加载多张图片');
    await proxyLoader.preloadImages([
      'https://example.com/image3.jpg',
      'https://example.com/image4.jpg',
      'https://example.com/image5.jpg'
    ]);
    console.log('预加载后缓存信息:', proxyLoader.getCacheInfo());
    
    console.log('\n测试5: 清除特定图片缓存');
    proxyLoader.clearCache('https://example.com/image1.jpg');
    console.log('清除后缓存信息:', proxyLoader.getCacheInfo());
    
    console.log('\n测试6: 清除所有缓存');
    proxyLoader.clearCache();
    console.log('全部清除后缓存信息:', proxyLoader.getCacheInfo());
  }
  
  testImageLoading().catch(error => {
    console.error('测试失败:', error.message);
  });
}

// 使用示例
simulateClientCode();
```

## 代理模式在前端框架中的应用

### Vue.js 中的代理应用

Vue.js 3 使用代理（Proxy）来实现响应式系统，这是代理模式的一个典型应用：

```javascript
// Vue 3 响应式系统简化实现

// 存储响应式对象的依赖关系
const targetMap = new WeakMap();
let activeEffect = null;

// 依赖收集
function track(target, key) {
  if (!activeEffect) return;
  
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  
  dep.add(activeEffect);
  console.log(`为 ${key} 收集依赖`);
}

// 触发依赖
function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  
  const dep = depsMap.get(key);
  if (!dep) return;
  
  console.log(`触发 ${key} 的依赖更新`);
  dep.forEach(effect => effect());
}

// 创建响应式对象（代理模式的核心）
function reactive(target) {
  return new Proxy(target, {
    // 拦截属性访问
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver);
      console.log(`访问属性: ${key}`);
      // 收集依赖
      track(target, key);
      return result;
    },
    
    // 拦截属性设置
    set(target, key, value, receiver) {
      const oldValue = target[key];
      console.log(`设置属性: ${key} = ${value}`);
      const result = Reflect.set(target, key, value, receiver);
      
      // 只有在值变化时才触发更新
      if (oldValue !== value) {
        trigger(target, key);
      }
      
      return result;
    },
    
    // 拦截属性删除
    deleteProperty(target, key) {
      console.log(`删除属性: ${key}`);
      const hadKey = key in target;
      const result = Reflect.deleteProperty(target, key);
      
      // 只有在成功删除时才触发更新
      if (hadKey) {
        trigger(target, key);
      }
      
      return result;
    }
  });
}

// 创建副作用函数
function effect(fn) {
  const effectFn = () => {
    activeEffect = effectFn;
    try {
      return fn();
    } finally {
      activeEffect = null;
    }
  };
  
  // 立即执行一次副作用函数
  effectFn();
  return effectFn;
}

// 客户端代码
function clientCode() {
  console.log('--- Vue.js 响应式系统代理实现示例 ---');
  
  // 创建响应式状态
  const state = reactive({
    count: 0,
    message: 'Hello'
  });
  
  // 创建依赖于状态的副作用
  console.log('\n创建副作用函数:');
  effect(() => {
    console.log(`副作用执行: count = ${state.count}, message = ${state.message}`);
  });
  
  // 修改状态，应该触发副作用
  console.log('\n修改状态:');
  state.count++;
  
  // 修改另一个属性
  state.message = 'Hello Vue';
  
  // 删除属性
  console.log('\n删除属性:');
  delete state.count;
  
  // 添加新属性
  console.log('\n添加新属性:');
  state.newProperty = 'New Value';
}

// 使用示例
clientCode();
```

### React 中的代理应用

React 中的高阶组件（HOC）可以看作是代理模式的一种应用，它包装原始组件并增强其功能：

```jsx
// withLogger.js - 日志记录高阶组件
import React from 'react';

// 日志记录高阶组件（代理模式）
function withLogger(WrappedComponent) {
  return class LoggerHOC extends React.Component {
    // 组件挂载前
    componentWillMount() {
      console.log(`${WrappedComponent.name} - 将要挂载`);
    }
    
    // 组件挂载后
    componentDidMount() {
      console.log(`${WrappedComponent.name} - 已挂载`);
      // 这里可以添加性能监控、数据收集等
    }
    
    // 组件接收新属性前
    componentWillReceiveProps(nextProps) {
      console.log(`${WrappedComponent.name} - 将接收新属性`);
      console.log('旧属性:', this.props);
      console.log('新属性:', nextProps);
    }
    
    // 组件卸载前
    componentWillUnmount() {
      console.log(`${WrappedComponent.name} - 将要卸载`);
      // 这里可以清理资源、取消订阅等
    }
    
    // 渲染包装的组件
    render() {
      console.log(`${WrappedComponent.name} - 渲染`);
      
      // 透传所有属性给包装的组件
      return <WrappedComponent {...this.props} />;
    }
  };
}

// withAuthentication.js - 认证高阶组件
function withAuthentication(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    // 模拟认证状态
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [user, setUser] = React.useState(null);
    
    React.useEffect(() => {
      // 模拟检查认证状态
      checkAuthStatus();
    }, []);
    
    const checkAuthStatus = () => {
      // 在实际应用中，这里会检查localStorage、cookie或调用API
      console.log('检查认证状态...');
      
      // 模拟已登录状态（实际应用中根据真实情况设置）
      const mockAuthenticated = true;
      const mockUser = { id: 1, name: '测试用户', role: 'user' };
      
      setIsAuthenticated(mockAuthenticated);
      if (mockAuthenticated) {
        setUser(mockUser);
      }
    };
    
    const login = (username, password) => {
      // 模拟登录过程
      console.log(`用户 ${username} 尝试登录`);
      // 假设登录成功
      setIsAuthenticated(true);
      setUser({ id: 1, name: username, role: 'user' });
      return Promise.resolve({ success: true });
    };
    
    const logout = () => {
      console.log('用户注销');
      setIsAuthenticated(false);
      setUser(null);
    };
    
    // 提供额外的属性给包装的组件
    const authProps = {
      isAuthenticated,
      user,
      login,
      logout
    };
    
    // 透传所有属性，包括认证相关的属性
    return <WrappedComponent {...props} {...authProps} />;
  };
}

// 原始组件
class UserProfile extends React.Component {
  handleLogout = () => {
    if (this.props.logout) {
      this.props.logout();
    }
  };
  
  render() {
    const { user, isAuthenticated } = this.props;
    
    if (!isAuthenticated) {
      return <div>请登录后查看个人资料</div>;
    }
    
    return (
      <div className="user-profile">
        <h2>个人资料</h2>
        {user && (
          <div>
            <p>用户名: {user.name}</p>
            <p>用户ID: {user.id}</p>
            <p>角色: {user.role}</p>
            <button onClick={this.handleLogout}>注销</button>
          </div>
        )}
      </div>
    );
  }
}

// 使用高阶组件包装原始组件
const EnhancedUserProfile = withLogger(withAuthentication(UserProfile));

// 应用示例
function App() {
  return (
    <div className="app">
      <h1>React 高阶组件（代理模式）示例</h1>
      <EnhancedUserProfile />
    </div>
  );
}

export default App;
```

## 代理模式的常见问题与解答

### 1. 代理模式和适配器模式有什么区别？

**代理模式**和**适配器模式**都是结构型设计模式，但它们的目的不同：

- **代理模式**：控制对另一个对象的访问，通常用于添加额外的功能或限制访问
- **适配器模式**：将一个类的接口转换成客户端期望的另一个接口，使得原本接口不兼容的类可以一起工作

代理模式不改变接口，而适配器模式会改变接口以实现兼容性。

### 2. 如何决定何时使用代理模式？

当你需要以下功能时，可以考虑使用代理模式：

- 在不修改原始对象的情况下增加额外的功能
- 控制对原始对象的访问权限
- 实现延迟加载或缓存
- 简化复杂对象的使用
- 提供远程对象的本地代理

### 3. 代理模式在JavaScript中的实现注意事项？

在JavaScript中实现代理模式时，需要注意以下几点：

- 利用JavaScript的闭包和高阶函数特性可以简化代理的实现
- 使用ES6的Proxy对象可以更方便地实现代理模式，特别是对于对象属性的拦截
- 注意不要过度使用代理，以免增加代码复杂性和性能开销
- 在处理异步操作时，需要特别注意Promise的使用和错误处理
- 对于DOM操作，要避免在代理中进行过多的DOM操作，以免影响性能

### 4. 代理模式与外观模式的区别？

**代理模式**和**外观模式**都是结构型设计模式，但它们的目的不同：

- **代理模式**：为单个对象提供代理，控制对该对象的访问
- **外观模式**：为复杂子系统提供一个简单的接口，隐藏子系统的复杂性

代理模式通常只代理一个对象，而外观模式通常封装多个对象以提供简化的接口。

### 5. 如何实现线程安全的代理？

在多线程环境下实现线程安全的代理，可以考虑以下几点：

- 使用锁或同步机制保护共享资源
- 采用线程安全的数据结构存储缓存和状态
- 避免在代理方法中执行耗时的操作，以减少锁的持有时间
- 考虑使用读写锁分离读写操作，提高并发性能
- 在JavaScript中，由于单线程特性，通常不需要特别考虑线程安全问题，但在处理异步操作时需要注意Promise的使用

### 6. 代理模式在性能优化中的应用？

代理模式在性能优化中的常见应用包括：

- **延迟加载**：推迟创建昂贵对象，直到真正需要时
- **缓存**：缓存方法调用结果，避免重复计算
- **资源池**：复用已创建的对象，减少创建和销毁的开销
- **批处理**：合并多个操作，减少网络请求或数据库访问
- **节流和防抖**：控制函数的调用频率，避免过多的重复调用

## 总结

代理模式是一种强大的结构型设计模式，通过引入一个代理对象来控制对另一个对象的访问。代理模式可以在不修改原始对象的情况下，增加额外的功能、控制访问权限、实现延迟加载、提供缓存等。

代理模式的主要优势在于职责分离和功能增强，它允许我们在不修改原始代码的情况下，动态地添加新功能。在现代前端开发中，代理模式被广泛应用于权限控制、性能优化、日志记录、API请求处理等场景。

在JavaScript中，特别是ES6引入的Proxy对象，使得代理模式的实现变得更加简单和强大。结合闭包、高阶函数等JavaScript特性，可以实现各种灵活的代理模式应用。

选择使用代理模式时，需要权衡其带来的好处和增加的复杂性，确保它确实能解决实际问题而不是过度设计。

## 输入输出示例

### 示例1: 基本代理模式

**输入:** 创建代理对象并调用方法
```javascript
// 创建真实对象
const realSubject = new RealSubject();

// 创建代理对象
const proxy = new Proxy(realSubject);

// 通过代理调用方法
proxy.request();
```

**输出:**
```
代理：在请求前执行额外操作
RealSubject 处理请求
代理：在请求后执行额外操作
```

### 示例2: 缓存代理

**输入:** 计算相同表达式两次
```javascript
// 创建计算器代理
const calculatorProxy = new CachedCalculatorProxy(new RealCalculator());

// 首次计算
calculatorProxy.calculate('2 + 3 * 4');

// 再次计算相同表达式
calculatorProxy.calculate('2 + 3 * 4');
```

**输出:**
```
缓存未命中，计算表达式 2 + 3 * 4
计算表达式: 2 + 3 * 4
执行耗时计算...
计算结果: 14
将表达式 2 + 3 * 4 的结果缓存
从缓存返回表达式 2 + 3 * 4 的结果: 14
```

### 示例3: 虚拟代理（延迟加载）

**输入:** 创建虚拟图像代理并显示
```javascript
// 创建虚拟图像代理
const imageProxy = new VirtualImageProxy('large-image.jpg');

// 初始状态检查
console.log(imageProxy.isLoaded());

// 显示图像（触发加载）
imageProxy.display();

// 再次检查状态
console.log(imageProxy.isLoaded());
```

**输出:**
```
false
需要显示图像 large-image.jpg，开始加载...
加载图像: large-image.jpg (模拟耗时操作...)
显示图像: large-image.jpg
True
```