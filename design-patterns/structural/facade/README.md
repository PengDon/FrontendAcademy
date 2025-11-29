# 外观模式 (Facade Pattern)

## 什么是外观模式

外观模式是一种结构型设计模式，它提供了一个统一的接口，用来访问子系统中的一群接口。外观模式定义了一个高层接口，使得子系统更容易使用。

外观模式的主要目的是为复杂的子系统提供一个简单易用的接口，降低客户端与子系统之间的耦合度，并隐藏子系统内部的复杂性。

## 外观模式的核心组件

1. **外观 (Facade)**：提供一个统一的接口，用来访问子系统中的一群接口
2. **子系统类 (Subsystem Classes)**：实现子系统的功能，处理外观对象指派的任务
3. **客户端 (Client)**：使用外观对象来简化对子系统的访问

## 外观模式的实现

### 基本实现

```javascript
// 子系统类A
class SubsystemA {
  operationA1() {
    return '子系统A: 操作1';
  }

  operationA2() {
    return '子系统A: 操作2';
  }
}

// 子系统类B
class SubsystemB {
  operationB1() {
    return '子系统B: 操作1';
  }

  operationB2() {
    return '子系统B: 操作2';
  }
}

// 子系统类C
class SubsystemC {
  operationC1() {
    return '子系统C: 操作1';
  }

  operationC2() {
    return '子系统C: 操作2';
  }
}

// 外观类
class Facade {
  constructor() {
    this.subsystemA = new SubsystemA();
    this.subsystemB = new SubsystemB();
    this.subsystemC = new SubsystemC();
  }

  // 简化的接口，组合多个子系统操作
  simpleOperation() {
    const result = [];
    result.push(this.subsystemA.operationA1());
    result.push(this.subsystemB.operationB1());
    result.push(this.subsystemC.operationC1());
    return result.join('\n');
  }

  // 另一个简化的接口，组合不同的子系统操作
  anotherSimpleOperation() {
    const result = [];
    result.push(this.subsystemA.operationA2());
    result.push(this.subsystemB.operationB2());
    result.push(this.subsystemC.operationC2());
    return result.join('\n');
  }

  // 允许客户端直接访问子系统的复杂操作
  complexOperation() {
    const result = [];
    result.push(this.subsystemA.operationA1());
    result.push(this.subsystemB.operationB2());
    result.push(this.subsystemC.operationC1());
    result.push(this.subsystemA.operationA2());
    return result.join('\n');
  }
}

// 客户端代码
function clientCode() {
  // 没有使用外观模式的客户端代码会很复杂
  console.log('客户端: 不使用外观直接访问子系统:');
  const subsystemA = new SubsystemA();
  const subsystemB = new SubsystemB();
  const subsystemC = new SubsystemC();
  
  let result = [];
  result.push(subsystemA.operationA1());
  result.push(subsystemB.operationB1());
  result.push(subsystemC.operationC1());
  console.log(result.join('\n'));
  
  // 使用外观模式的客户端代码会更简洁
  console.log('\n客户端: 使用外观访问子系统:');
  const facade = new Facade();
  console.log(facade.simpleOperation());
  console.log('\n客户端: 使用外观的另一个操作:');
  console.log(facade.anotherSimpleOperation());
  console.log('\n客户端: 使用外观的复杂操作:');
  console.log(facade.complexOperation());
}

// 使用示例
clientCode();
```

### 实际应用场景：电子商务平台订单处理系统

下面是一个电子商务平台订单处理系统的外观模式实现，它简化了订单处理流程，包括库存检查、支付处理、物流安排等多个子系统的协调工作。

```javascript
// 子系统1: 库存管理
class InventorySystem {
  constructor() {
    // 模拟库存数据
    this.inventory = {
      'product1': 100,
      'product2': 50,
      'product3': 20
    };
  }

  // 检查库存
  checkAvailability(productId, quantity) {
    const available = this.inventory[productId] || 0;
    console.log(`检查产品 ${productId} 的库存，当前库存: ${available}，请求数量: ${quantity}`);
    return available >= quantity;
  }

  // 减少库存
  reduceStock(productId, quantity) {
    if (this.checkAvailability(productId, quantity)) {
      this.inventory[productId] -= quantity;
      console.log(`产品 ${productId} 的库存已减少 ${quantity}，剩余: ${this.inventory[productId]}`);
      return true;
    }
    return false;
  }

  // 获取产品信息
  getProductInfo(productId) {
    // 模拟产品信息
    const products = {
      'product1': { name: '智能手表', price: 1999 },
      'product2': { name: '无线耳机', price: 999 },
      'product3': { name: '平板电脑', price: 3999 }
    };
    return products[productId] || null;
  }
}

// 子系统2: 支付处理
class PaymentSystem {
  // 处理支付
  processPayment(orderId, amount, paymentMethod) {
    console.log(`处理订单 ${orderId} 的支付，金额: ¥${amount}，支付方式: ${paymentMethod}`);
    // 模拟支付处理
    return {
      success: true,
      transactionId: `trans_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString()
    };
  }

  // 验证支付方式
  validatePaymentMethod(paymentMethod, customerInfo) {
    console.log(`验证支付方式: ${paymentMethod}，客户信息: ${JSON.stringify(customerInfo)}`);
    // 模拟验证
    return paymentMethod === 'credit_card' || paymentMethod === 'alipay' || paymentMethod === 'wechat';
  }

  // 退款处理
  processRefund(orderId, transactionId, amount) {
    console.log(`处理订单 ${orderId} 的退款，交易ID: ${transactionId}，退款金额: ¥${amount}`);
    // 模拟退款处理
    return {
      success: true,
      refundId: `refund_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString()
    };
  }
}

// 子系统3: 物流配送
class ShippingSystem {
  // 安排配送
  scheduleDelivery(orderId, customerAddress, items) {
    console.log(`为订单 ${orderId} 安排配送，地址: ${customerAddress}`);
    // 模拟配送安排
    return {
      success: true,
      trackingNumber: `track_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      estimatedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7天后
      items: items
    };
  }

  // 更新配送状态
  updateDeliveryStatus(trackingNumber, status) {
    console.log(`更新运单 ${trackingNumber} 的状态为: ${status}`);
    return true;
  }

  // 获取配送选项
  getShippingOptions(destination, weight) {
    // 模拟配送选项
    const options = [];
    
    if (weight <= 1) {
      options.push({ type: 'standard', cost: 10, days: 3 });
      options.push({ type: 'express', cost: 20, days: 1 });
    } else if (weight <= 5) {
      options.push({ type: 'standard', cost: 15, days: 3 });
      options.push({ type: 'express', cost: 30, days: 1 });
    } else {
      options.push({ type: 'standard', cost: 25, days: 5 });
      options.push({ type: 'express', cost: 50, days: 2 });
    }
    
    return options;
  }
}

// 子系统4: 订单管理
class OrderSystem {
  constructor() {
    this.orders = {};
    this.orderIdCounter = 1000;
  }

  // 创建订单
  createOrder(customerInfo, items) {
    const orderId = `order_${++this.orderIdCounter}`;
    const orderDate = new Date().toISOString();
    
    this.orders[orderId] = {
      id: orderId,
      customer: customerInfo,
      items: items,
      status: 'pending',
      orderDate: orderDate,
      paymentInfo: null,
      shippingInfo: null
    };
    
    console.log(`创建订单 ${orderId}`);
    return this.orders[orderId];
  }

  // 更新订单状态
  updateOrderStatus(orderId, status) {
    if (this.orders[orderId]) {
      this.orders[orderId].status = status;
      console.log(`订单 ${orderId} 的状态更新为: ${status}`);
      return true;
    }
    return false;
  }

  // 获取订单
  getOrder(orderId) {
    return this.orders[orderId] || null;
  }

  // 取消订单
  cancelOrder(orderId) {
    if (this.orders[orderId]) {
      this.orders[orderId].status = 'cancelled';
      console.log(`订单 ${orderId} 已取消`);
      return true;
    }
    return false;
  }
}

// 外观类: 订单处理外观
class OrderProcessingFacade {
  constructor() {
    this.inventorySystem = new InventorySystem();
    this.paymentSystem = new PaymentSystem();
    this.shippingSystem = new ShippingSystem();
    this.orderSystem = new OrderSystem();
  }

  // 处理订单的简化接口
  processOrder(customerInfo, orderItems, paymentMethod) {
    try {
      console.log('开始处理订单...');
      
      // 1. 验证所有产品的库存
      for (const item of orderItems) {
        if (!this.inventorySystem.checkAvailability(item.productId, item.quantity)) {
          throw new Error(`产品 ${item.productId} 库存不足`);
        }
      }
      
      // 2. 验证支付方式
      if (!this.paymentSystem.validatePaymentMethod(paymentMethod, customerInfo)) {
        throw new Error('不支持的支付方式');
      }
      
      // 3. 创建订单
      const order = this.orderSystem.createOrder(customerInfo, orderItems);
      
      // 4. 计算订单总额
      let totalAmount = 0;
      for (const item of orderItems) {
        const productInfo = this.inventorySystem.getProductInfo(item.productId);
        if (productInfo) {
          totalAmount += productInfo.price * item.quantity;
        }
      }
      
      // 5. 处理支付
      const paymentResult = this.paymentSystem.processPayment(order.id, totalAmount, paymentMethod);
      if (!paymentResult.success) {
        throw new Error('支付处理失败');
      }
      
      // 6. 更新订单支付信息
      order.paymentInfo = {
        amount: totalAmount,
        method: paymentMethod,
        transactionId: paymentResult.transactionId,
        paymentDate: paymentResult.timestamp
      };
      
      // 7. 减少库存
      for (const item of orderItems) {
        this.inventorySystem.reduceStock(item.productId, item.quantity);
      }
      
      // 8. 安排配送
      const shippingResult = this.shippingSystem.scheduleDelivery(
        order.id,
        customerInfo.address,
        orderItems
      );
      
      // 9. 更新订单配送信息
      order.shippingInfo = {
        trackingNumber: shippingResult.trackingNumber,
        estimatedDeliveryDate: shippingResult.estimatedDeliveryDate
      };
      
      // 10. 更新订单状态
      this.orderSystem.updateOrderStatus(order.id, 'confirmed');
      
      console.log('订单处理成功！');
      return {
        success: true,
        orderId: order.id,
        totalAmount: totalAmount,
        trackingNumber: shippingResult.trackingNumber,
        estimatedDeliveryDate: shippingResult.estimatedDeliveryDate
      };
    } catch (error) {
      console.error('订单处理失败:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 取消订单的简化接口
  cancelOrder(orderId, reason) {
    try {
      console.log(`开始取消订单 ${orderId}，原因: ${reason}`);
      
      // 获取订单信息
      const order = this.orderSystem.getOrder(orderId);
      if (!order) {
        throw new Error('订单不存在');
      }
      
      // 检查订单状态
      if (order.status === 'shipped' || order.status === 'delivered') {
        throw new Error('订单已发货或已送达，无法取消');
      }
      
      // 处理退款
      if (order.paymentInfo) {
        const refundResult = this.paymentSystem.processRefund(
          orderId,
          order.paymentInfo.transactionId,
          order.paymentInfo.amount
        );
        
        if (!refundResult.success) {
          throw new Error('退款处理失败');
        }
      }
      
      // 恢复库存
      for (const item of order.items) {
        // 这里简化处理，实际上应该有恢复库存的方法
        console.log(`恢复产品 ${item.productId} 的库存，数量: ${item.quantity}`);
      }
      
      // 更新订单状态
      this.orderSystem.cancelOrder(orderId);
      
      console.log(`订单 ${orderId} 取消成功！`);
      return {
        success: true,
        orderId: orderId
      };
    } catch (error) {
      console.error('取消订单失败:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 查询订单状态的简化接口
  trackOrder(orderId) {
    const order = this.orderSystem.getOrder(orderId);
    if (!order) {
      return {
        success: false,
        error: '订单不存在'
      };
    }
    
    return {
      success: true,
      orderId: order.id,
      status: order.status,
      orderDate: order.orderDate,
      shippingInfo: order.shippingInfo,
      items: order.items
    };
  }
}

// 客户端代码
function clientCode() {
  // 创建订单处理外观
  const orderFacade = new OrderProcessingFacade();
  
  // 客户信息
  const customerInfo = {
    id: 'cust_123',
    name: '张三',
    email: 'zhangsan@example.com',
    phone: '13800138000',
    address: '北京市海淀区中关村南大街5号'
  };
  
  // 订单项
  const orderItems = [
    { productId: 'product1', quantity: 1 },
    { productId: 'product2', quantity: 2 }
  ];
  
  // 处理订单
  console.log('--- 处理订单 ---');
  const orderResult = orderFacade.processOrder(customerInfo, orderItems, 'credit_card');
  console.log('订单处理结果:', JSON.stringify(orderResult, null, 2));
  
  if (orderResult.success) {
    // 查询订单状态
    console.log('\n--- 查询订单状态 ---');
    const trackingResult = orderFacade.trackOrder(orderResult.orderId);
    console.log('订单状态:', JSON.stringify(trackingResult, null, 2));
    
    // 取消订单示例
    console.log('\n--- 取消订单示例 ---');
    // 这里不实际取消，只是展示接口调用
    // const cancelResult = orderFacade.cancelOrder(orderResult.orderId, '客户改变主意');
    // console.log('取消结果:', JSON.stringify(cancelResult, null, 2));
  }
}

// 使用示例
clientCode();
```

## 外观模式的应用场景

1. **复杂子系统**：当系统包含多个复杂的子系统，且客户端不需要知道子系统内部细节时
2. **降低耦合**：当需要降低客户端与子系统之间的耦合度时
3. **分层架构**：在分层架构中，为每层提供一个外观接口，简化层间通信
4. **遗留系统集成**：当需要集成遗留系统，且希望隐藏其复杂性时
5. **API设计**：为库或框架提供一个简单易用的公共API

## 外观模式的优点

1. **简化客户端使用**：隐藏子系统的复杂性，提供一个简单统一的接口
2. **降低耦合度**：减少客户端与子系统之间的直接依赖
3. **提高可维护性**：子系统内部的变化不会影响客户端，只需要调整外观类
4. **符合迪米特法则**：客户端只与外观类交互，不需要了解子系统内部组件
5. **灵活扩展**：可以根据需求添加新的外观类，而不修改已有子系统

## 外观模式的缺点

1. **不符合开闭原则**：如果子系统接口发生变化，可能需要修改外观类
2. **增加额外层**：引入外观类增加了系统的层次，可能会影响性能
3. **可能过度简化**：过于简化的外观接口可能无法满足客户端的所有需求
4. **子系统直接使用**：客户端可能绕过外观类直接使用子系统，导致系统耦合度增加

## 外观模式与其他模式的区别

### 外观模式 vs 适配器模式

- **外观模式**：提供一个简化的接口，隐藏子系统的复杂性
- **适配器模式**：将一个接口转换成客户端期望的另一个接口

### 外观模式 vs 单例模式

- **外观模式**：关注简化接口，可能需要创建多个实例
- **单例模式**：确保类只有一个实例，并提供一个全局访问点

### 外观模式 vs 代理模式

- **外观模式**：提供简化接口，不控制对原对象的访问
- **代理模式**：控制对原对象的访问，提供与原对象相同的接口

## 实际应用案例

### 1. 前端AJAX请求外观

```javascript
// 子系统1: XMLHttpRequest封装
class XhrRequest {
  constructor() {
    this.xhr = new XMLHttpRequest();
  }

  send(url, method, headers, data) {
    return new Promise((resolve, reject) => {
      this.xhr.open(method, url, true);
      
      // 设置请求头
      if (headers) {
        Object.keys(headers).forEach(key => {
          this.xhr.setRequestHeader(key, headers[key]);
        });
      }
      
      // 设置默认Content-Type
      if (method !== 'GET' && method !== 'HEAD' && !headers?.['Content-Type']) {
        this.xhr.setRequestHeader('Content-Type', 'application/json');
      }
      
      // 处理响应
      this.xhr.onload = () => {
        if (this.xhr.status >= 200 && this.xhr.status < 300) {
          try {
            const response = JSON.parse(this.xhr.responseText);
            resolve(response);
          } catch (error) {
            resolve(this.xhr.responseText);
          }
        } else {
          reject(new Error(`请求失败: ${this.xhr.statusText}`));
        }
      };
      
      // 处理错误
      this.xhr.onerror = () => {
        reject(new Error('网络错误'));
      };
      
      // 发送数据
      const body = data ? (headers?.['Content-Type'] === 'application/json' ? JSON.stringify(data) : data) : null;
      this.xhr.send(body);
    });
  }
}

// 子系统2: Fetch API封装
class FetchRequest {
  constructor() {
    this.abortController = new AbortController();
  }

  send(url, method, headers, data) {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      signal: this.abortController.signal
    };
    
    if (method !== 'GET' && method !== 'HEAD' && data) {
      options.body = options.headers['Content-Type'] === 'application/json' ? JSON.stringify(data) : data;
    }
    
    return fetch(url, options)
      .then(response => {
        if (!response.ok) {
          throw new Error(`请求失败: ${response.statusText}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return response.json();
        }
        return response.text();
      });
  }

  abort() {
    this.abortController.abort();
  }
}

// 子系统3: 请求缓存
class RequestCache {
  constructor() {
    this.cache = new Map();
    this.defaultTtl = 5 * 60 * 1000; // 默认缓存5分钟
  }

  getCacheKey(url, method, params) {
    return `${url}_${method}_${JSON.stringify(params || {})}`;
  }

  get(key) {
    const cachedItem = this.cache.get(key);
    if (cachedItem) {
      const { data, timestamp, ttl } = cachedItem;
      // 检查缓存是否过期
      if (Date.now() - timestamp < ttl) {
        return data;
      } else {
        // 删除过期缓存
        this.cache.delete(key);
      }
    }
    return null;
  }

  set(key, data, ttl = this.defaultTtl) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  clear() {
    this.cache.clear();
  }

  delete(key) {
    this.cache.delete(key);
  }
}

// 子系统4: 请求拦截器
class RequestInterceptor {
  constructor() {
    this.requestInterceptors = [];
    this.responseInterceptors = [];
  }

  addRequestInterceptor(interceptor) {
    this.requestInterceptors.push(interceptor);
    return this;
  }

  addResponseInterceptor(interceptor) {
    this.responseInterceptors.push(interceptor);
    return this;
  }

  async applyRequestInterceptors(config) {
    let interceptedConfig = { ...config };
    
    for (const interceptor of this.requestInterceptors) {
      interceptedConfig = await interceptor(interceptedConfig) || interceptedConfig;
    }
    
    return interceptedConfig;
  }

  async applyResponseInterceptors(response) {
    let interceptedResponse = { ...response };
    
    for (const interceptor of this.responseInterceptors) {
      interceptedResponse = await interceptor(interceptedResponse) || interceptedResponse;
    }
    
    return interceptedResponse;
  }
}

// 外观类: API服务外观
class ApiService {
  constructor(baseUrl = '') {
    this.baseUrl = baseUrl;
    this.requestClient = window.fetch ? new FetchRequest() : new XhrRequest();
    this.cache = new RequestCache();
    this.interceptor = new RequestInterceptor();
    this.defaultHeaders = {
      'X-Requested-With': 'XMLHttpRequest'
    };
  }

  // 配置基础URL
  setBaseUrl(baseUrl) {
    this.baseUrl = baseUrl;
    return this;
  }

  // 设置默认请求头
  setDefaultHeaders(headers) {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
    return this;
  }

  // 添加请求拦截器
  addRequestInterceptor(interceptor) {
    this.interceptor.addRequestInterceptor(interceptor);
    return this;
  }

  // 添加响应拦截器
  addResponseInterceptor(interceptor) {
    this.interceptor.addResponseInterceptor(interceptor);
    return this;
  }

  // 构建URL
  buildUrl(endpoint, params) {
    let url = `${this.baseUrl}${endpoint}`;
    
    if (params && Object.keys(params).length) {
      const queryString = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
      url += `?${queryString}`;
    }
    
    return url;
  }

  // 发送请求
  async request(endpoint, options = {}) {
    try {
      // 合并配置
      const config = {
        method: 'GET',
        headers: {},
        params: {},
        data: null,
        cache: false,
        cacheTime: 5 * 60 * 1000, // 5分钟
        ...options
      };
      
      // 应用请求拦截器
      const interceptedConfig = await this.interceptor.applyRequestInterceptors(config);
      const { method, headers, params, data, cache, cacheTime } = interceptedConfig;
      
      // 构建完整URL
      const url = this.buildUrl(endpoint, params);
      
      // 检查缓存
      if (cache && method === 'GET') {
        const cacheKey = this.cache.getCacheKey(url, method, params);
        const cachedData = this.cache.get(cacheKey);
        
        if (cachedData) {
          console.log(`从缓存获取请求: ${url}`);
          return await this.interceptor.applyResponseInterceptors(cachedData);
        }
      }
      
      // 合并请求头
      const mergedHeaders = { ...this.defaultHeaders, ...headers };
      
      // 发送请求
      const response = await this.requestClient.send(url, method, mergedHeaders, data);
      
      // 缓存响应
      if (cache && method === 'GET') {
        const cacheKey = this.cache.getCacheKey(url, method, params);
        this.cache.set(cacheKey, response, cacheTime);
      }
      
      // 应用响应拦截器
      const interceptedResponse = await this.interceptor.applyResponseInterceptors(response);
      return interceptedResponse;
    } catch (error) {
      console.error('请求错误:', error);
      throw error;
    }
  }

  // GET请求
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  // POST请求
  post(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', data });
  }

  // PUT请求
  put(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', data });
  }

  // DELETE请求
  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  // PATCH请求
  patch(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: 'PATCH', data });
  }

  // 清除缓存
  clearCache() {
    this.cache.clear();
    return this;
  }

  // 中止请求
  abort() {
    if (this.requestClient.abort) {
      this.requestClient.abort();
    }
    return this;
  }
}

// 客户端代码
function clientCode() {
  // 创建API服务外观
  const api = new ApiService('https://api.example.com');
  
  // 配置默认请求头
  api.setDefaultHeaders({
    'Authorization': 'Bearer token123',
    'Accept': 'application/json'
  });
  
  // 添加请求拦截器
  api.addRequestInterceptor(config => {
    console.log('请求拦截器:', config);
    // 可以在这里添加认证信息等
    return config;
  });
  
  // 添加响应拦截器
  api.addResponseInterceptor(response => {
    console.log('响应拦截器:', response);
    // 可以在这里统一处理响应数据
    return response;
  });
  
  // 发送GET请求（带缓存）
  async function fetchUsers() {
    try {
      const users = await api.get('/users', {
        params: { page: 1, limit: 10 },
        cache: true,
        cacheTime: 60000 // 1分钟
      });
      console.log('获取用户列表:', users);
      return users;
    } catch (error) {
      console.error('获取用户失败:', error);
    }
  }
  
  // 发送POST请求
  async function createUser(userData) {
    try {
      const newUser = await api.post('/users', userData);
      console.log('创建用户成功:', newUser);
      return newUser;
    } catch (error) {
      console.error('创建用户失败:', error);
    }
  }
  
  // 发送PUT请求
  async function updateUser(userId, userData) {
    try {
      const updatedUser = await api.put(`/users/${userId}`, userData);
      console.log('更新用户成功:', updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('更新用户失败:', error);
    }
  }
  
  // 发送DELETE请求
  async function deleteUser(userId) {
    try {
      const result = await api.delete(`/users/${userId}`);
      console.log('删除用户成功:', result);
      return result;
    } catch (error) {
      console.error('删除用户失败:', error);
    }
  }
  
  // 使用示例
  console.log('--- API服务示例 ---');
  fetchUsers();
  
  // 模拟创建用户
  // createUser({ name: '张三', email: 'zhangsan@example.com' });
  
  // 模拟更新用户
  // updateUser(1, { name: '李四', email: 'lisi@example.com' });
  
  // 模拟删除用户
  // deleteUser(1);
}

// 使用示例
clientCode();
```

### 2. 前端表单验证外观

```javascript
// 子系统1: 基础验证规则
class ValidationRules {
  // 验证必填
  static required(value) {
    return value !== undefined && value !== null && value !== '';
  }

  // 验证最小长度
  static minLength(value, min) {
    return typeof value === 'string' && value.length >= min;
  }

  // 验证最大长度
  static maxLength(value, max) {
    return typeof value === 'string' && value.length <= max;
  }

  // 验证邮箱
  static email(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return typeof value === 'string' && emailRegex.test(value);
  }

  // 验证手机号（中国）
  static phone(value) {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return typeof value === 'string' && phoneRegex.test(value);
  }

  // 验证数字
  static number(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  // 验证整数
  static integer(value) {
    return Number.isInteger(Number(value));
  }

  // 验证日期
  static date(value) {
    return !isNaN(Date.parse(value));
  }

  // 验证URL
  static url(value) {
    try {
      new URL(value);
      return true;
    } catch (error) {
      return false;
    }
  }

  // 验证正则表达式
  static pattern(value, regex) {
    return typeof value === 'string' && regex.test(value);
  }

  // 验证两个值是否相等
  static equal(value, compareValue) {
    return value === compareValue;
  }

  // 自定义验证函数
  static custom(value, validatorFn) {
    return validatorFn(value);
  }
}

// 子系统2: 表单字段验证器
class FieldValidator {
  constructor(fieldName, value, rules) {
    this.fieldName = fieldName;
    this.value = value;
    this.rules = rules;
    this.errors = [];
  }

  // 验证字段
  validate() {
    this.errors = [];
    
    for (const rule in this.rules) {
      const ruleValue = this.rules[rule];
      let isValid = true;
      
      switch (rule) {
        case 'required':
          isValid = ValidationRules.required(this.value);
          if (!isValid) {
            this.errors.push(ruleValue || `${this.fieldName} 是必填项`);
          }
          break;
        
        case 'minLength':
          isValid = ValidationRules.minLength(this.value, ruleValue.value);
          if (!isValid) {
            this.errors.push(ruleValue.message || `${this.fieldName} 长度不能少于 ${ruleValue.value} 个字符`);
          }
          break;
        
        case 'maxLength':
          isValid = ValidationRules.maxLength(this.value, ruleValue.value);
          if (!isValid) {
            this.errors.push(ruleValue.message || `${this.fieldName} 长度不能超过 ${ruleValue.value} 个字符`);
          }
          break;
        
        case 'email':
          isValid = ValidationRules.email(this.value);
          if (!isValid) {
            this.errors.push(ruleValue || `${this.fieldName} 不是有效的邮箱地址`);
          }
          break;
        
        case 'phone':
          isValid = ValidationRules.phone(this.value);
          if (!isValid) {
            this.errors.push(ruleValue || `${this.fieldName} 不是有效的手机号`);
          }
          break;
        
        case 'number':
          isValid = ValidationRules.number(this.value);
          if (!isValid) {
            this.errors.push(ruleValue || `${this.fieldName} 必须是数字`);
          }
          break;
        
        case 'integer':
          isValid = ValidationRules.integer(this.value);
          if (!isValid) {
            this.errors.push(ruleValue || `${this.fieldName} 必须是整数`);
          }
          break;
        
        case 'date':
          isValid = ValidationRules.date(this.value);
          if (!isValid) {
            this.errors.push(ruleValue || `${this.fieldName} 不是有效的日期`);
          }
          break;
        
        case 'url':
          isValid = ValidationRules.url(this.value);
          if (!isValid) {
            this.errors.push(ruleValue || `${this.fieldName} 不是有效的URL`);
          }
          break;
        
        case 'pattern':
          isValid = ValidationRules.pattern(this.value, ruleValue.value);
          if (!isValid) {
            this.errors.push(ruleValue.message || `${this.fieldName} 格式不正确`);
          }
          break;
        
        case 'equal':
          isValid = ValidationRules.equal(this.value, ruleValue.value);
          if (!isValid) {
            this.errors.push(ruleValue.message || `${this.fieldName} 不匹配`);
          }
          break;
        
        case 'custom':
          isValid = ValidationRules.custom(this.value, ruleValue.validator);
          if (!isValid) {
            this.errors.push(ruleValue.message || `${this.fieldName} 验证失败`);
          }
          break;
        
        default:
          console.warn(`未知的验证规则: ${rule}`);
      }
    }
    
    return this.errors.length === 0;
  }

  // 获取错误信息
  getErrors() {
    return this.errors;
  }

  // 获取第一个错误信息
  getFirstError() {
    return this.errors[0] || '';
  }

  // 更新字段值
  updateValue(value) {
    this.value = value;
    return this;
  }

  // 更新验证规则
  updateRules(rules) {
    this.rules = { ...this.rules, ...rules };
    return this;
  }
}

// 子系统3: 表单验证器
class FormValidator {
  constructor() {
    this.fields = new Map();
    this.formErrors = {};
    this.isValid = true;
  }

  // 添加字段
  addField(fieldName, value, rules) {
    this.fields.set(fieldName, new FieldValidator(fieldName, value, rules));
    return this;
  }

  // 批量添加字段
  addFields(fields) {
    for (const fieldName in fields) {
      const { value, rules } = fields[fieldName];
      this.addField(fieldName, value, rules);
    }
    return this;
  }

  // 更新字段值
  updateFieldValue(fieldName, value) {
    const field = this.fields.get(fieldName);
    if (field) {
      field.updateValue(value);
    }
    return this;
  }

  // 批量更新字段值
  updateFieldValues(values) {
    for (const fieldName in values) {
      this.updateFieldValue(fieldName, values[fieldName]);
    }
    return this;
  }

  // 验证单个字段
  validateField(fieldName) {
    const field = this.fields.get(fieldName);
    if (!field) {
      return false;
    }
    
    const isValid = field.validate();
    const errors = field.getErrors();
    
    if (errors.length > 0) {
      this.formErrors[fieldName] = errors;
      this.isValid = false;
    } else {
      delete this.formErrors[fieldName];
      // 重新检查整个表单是否有效
      this.isValid = this.checkFormValidity();
    }
    
    return isValid;
  }

  // 验证所有字段
  validateAll() {
    this.formErrors = {};
    this.isValid = true;
    
    for (const [fieldName, field] of this.fields.entries()) {
      const isValid = field.validate();
      
      if (!isValid) {
        this.formErrors[fieldName] = field.getErrors();
        this.isValid = false;
      }
    }
    
    return this.isValid;
  }

  // 验证表单部分字段
  validateSome(fieldNames) {
    let isValid = true;
    
    for (const fieldName of fieldNames) {
      const fieldIsValid = this.validateField(fieldName);
      if (!fieldIsValid) {
        isValid = false;
      }
    }
    
    return isValid;
  }

  // 检查表单是否有效
  checkFormValidity() {
    for (const [fieldName, field] of this.fields.entries()) {
      if (!field.validate()) {
        return false;
      }
    }
    return true;
  }

  // 获取所有错误
  getAllErrors() {
    return { ...this.formErrors };
  }

  // 获取字段错误
  getFieldErrors(fieldName) {
    return this.formErrors[fieldName] || [];
  }

  // 获取字段的第一个错误
  getFieldFirstError(fieldName) {
    const errors = this.getFieldErrors(fieldName);
    return errors[0] || '';
  }

  // 清除所有错误
  clearErrors() {
    this.formErrors = {};
    this.isValid = true;
    return this;
  }

  // 清除特定字段的错误
  clearFieldErrors(fieldName) {
    delete this.formErrors[fieldName];
    this.isValid = this.checkFormValidity();
    return this;
  }

  // 获取表单状态
  getFormState() {
    return {
      isValid: this.isValid,
      errors: this.getAllErrors()
    };
  }
}

// 外观类: 表单验证外观
class FormValidationFacade {
  constructor() {
    this.validator = new FormValidator();
    this.defaultMessages = {
      required: '{field} 不能为空',
      minLength: '{field} 长度不能少于 {value} 个字符',
      maxLength: '{field} 长度不能超过 {value} 个字符',
      email: '{field} 格式不正确',
      phone: '{field} 格式不正确',
      number: '{field} 必须是数字',
      integer: '{field} 必须是整数',
      date: '{field} 必须是有效的日期',
      url: '{field} 必须是有效的URL',
      pattern: '{field} 格式不正确',
      equal: '{field} 不匹配',
      custom: '{field} 验证失败'
    };
  }

  // 设置默认错误消息
  setDefaultMessages(messages) {
    this.defaultMessages = { ...this.defaultMessages, ...messages };
    return this;
  }

  // 初始化表单验证
  init(fields, customMessages = {}) {
    // 合并自定义错误消息
    const messages = { ...this.defaultMessages, ...customMessages };
    
    // 格式化字段规则，添加错误消息
    const formattedFields = {};
    
    for (const fieldName in fields) {
      const { value, rules } = fields[fieldName];
      const formattedRules = {};
      
      for (const rule in rules) {
        const ruleValue = rules[rule];
        
        if (rule === 'required' || rule === 'email' || rule === 'phone' || 
            rule === 'number' || rule === 'integer' || rule === 'date' || 
            rule === 'url') {
          // 简单规则
          formattedRules[rule] = typeof ruleValue === 'string' 
            ? ruleValue 
            : this.formatMessage(messages[rule], { field: this.getFieldLabel(fieldName), value: ruleValue });
        } else if (rule === 'minLength' || rule === 'maxLength' || 
                  rule === 'pattern' || rule === 'equal') {
          // 需要参数的规则
          if (typeof ruleValue === 'object') {
            formattedRules[rule] = {
              value: ruleValue.value,
              message: ruleValue.message || this.formatMessage(messages[rule], { 
                field: this.getFieldLabel(fieldName), 
                value: ruleValue.value 
              })
            };
          } else {
            formattedRules[rule] = {
              value: ruleValue,
              message: this.formatMessage(messages[rule], { 
                field: this.getFieldLabel(fieldName), 
                value: ruleValue 
              })
            };
          }
        } else if (rule === 'custom') {
          // 自定义验证规则
          formattedRules[rule] = {
            validator: ruleValue.validator,
            message: ruleValue.message || this.formatMessage(messages[rule], { field: this.getFieldLabel(fieldName) })
          };
        }
      }
      
      formattedFields[fieldName] = {
        value,
        rules: formattedRules
      };
    }
    
    // 添加字段到验证器
    this.validator.addFields(formattedFields);
    return this;
  }

  // 更新表单数据
  updateData(data) {
    this.validator.updateFieldValues(data);
    return this;
  }

  // 验证整个表单
  validate() {
    return this.validator.validateAll();
  }

  // 验证单个字段
  validateField(fieldName) {
    return this.validator.validateField(fieldName);
  }

  // 获取所有错误信息
  getErrors() {
    return this.validator.getAllErrors();
  }

  // 获取特定字段的错误信息
  getFieldError(fieldName) {
    return this.validator.getFieldFirstError(fieldName);
  }

  // 获取表单状态
  getState() {
    return this.validator.getFormState();
  }

  // 清除错误
  clearErrors() {
    this.validator.clearErrors();
    return this;
  }

  // 辅助方法：获取字段显示名称
  getFieldLabel(fieldName) {
    // 将字段名转换为更友好的显示名称
    return fieldName.split(/(?=[A-Z])/).join(' ').replace(/^./, str => str.toUpperCase());
  }

  // 辅助方法：格式化错误消息
  formatMessage(message, params) {
    let formattedMessage = message;
    
    for (const param in params) {
      formattedMessage = formattedMessage.replace(new RegExp(`\\{${param}\\}`, 'g'), params[param]);
    }
    
    return formattedMessage;
  }

  // 辅助方法：验证并返回结果
  validateAndGetResult() {
    const isValid = this.validate();
    const errors = this.getErrors();
    
    return {
      isValid,
      errors,
      hasErrors: Object.keys(errors).length > 0
    };
  }
}

// 客户端代码
function clientCode() {
  // 创建表单验证外观
  const validator = new FormValidationFacade();
  
  // 初始化表单验证规则
  validator.init({
    username: {
      value: '',
      rules: {
        required: true,
        minLength: 3,
        maxLength: 20
      }
    },
    email: {
      value: '',
      rules: {
        required: true,
        email: true
      }
    },
    password: {
      value: '',
      rules: {
        required: true,
        minLength: 8,
        pattern: {
          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, 
          message: '密码必须包含大小写字母和数字'
        }
      }
    },
    confirmPassword: {
      value: '',
      rules: {
        required: true,
        equal: { 
          value: () => validator.validator.fields.get('password')?.value,
          message: '两次输入的密码不一致'
        }
      }
    },
    phone: {
      value: '',
      rules: {
        required: true,
        phone: true
      }
    },
    age: {
      value: '',
      rules: {
        required: true,
        number: true,
        custom: {
          validator: value => value >= 18 && value <= 120,
          message: '年龄必须在18到120之间'
        }
      }
    }
  }, {
    // 自定义错误消息
    required: '请输入{field}',
    email: '请输入有效的邮箱地址'
  });
  
  // 模拟表单提交
  function submitForm(formData) {
    // 更新验证器中的数据
    validator.updateData(formData);
    
    // 验证表单
    const result = validator.validateAndGetResult();
    
    console.log('表单验证结果:', result);
    
    if (result.isValid) {
      console.log('表单验证通过，可以提交');
      // 这里可以添加提交表单的代码
    } else {
      console.log('表单验证失败，请检查错误信息');
      console.log('错误详情:', result.errors);
    }
    
    return result;
  }
  
  // 模拟实时验证字段
  function validateFieldOnInput(fieldName, value) {
    validator.updateData({ [fieldName]: value });
    const isValid = validator.validateField(fieldName);
    const error = validator.getFieldError(fieldName);
    
    console.log(`字段 ${fieldName} 验证:`, { value, isValid, error });
    return { isValid, error };
  }
  
  // 测试表单验证
  console.log('--- 表单验证示例 ---');
  
  // 测试空表单提交
  console.log('\n测试空表单:');
  submitForm({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    age: ''
  });
  
  // 测试部分字段实时验证
  console.log('\n测试字段实时验证:');
  validateFieldOnInput('username', 'j'); // 太短
  validateFieldOnInput('username', 'john_doe'); // 有效
  validateFieldOnInput('email', 'invalid-email'); // 无效邮箱
  validateFieldOnInput('email', 'john.doe@example.com'); // 有效邮箱
  validateFieldOnInput('password', 'weak'); // 太弱
  validateFieldOnInput('password', 'StrongPass123'); // 有效
  
  // 测试表单提交（有部分错误）
  console.log('\n测试有部分错误的表单:');
  submitForm({
    username: 'john_doe',
    email: 'john.doe@example.com',
    password: 'StrongPass123',
    confirmPassword: 'wrongpassword', // 密码不匹配
    phone: '13800138000',
    age: '17' // 年龄太小
  });
  
  // 测试完整有效表单
  console.log('\n测试有效表单:');
  submitForm({
    username: 'john_doe',
    email: 'john.doe@example.com',
    password: 'StrongPass123',
    confirmPassword: 'StrongPass123',
    phone: '13800138000',
    age: '30'
  });
}

// 使用示例
clientCode();
```

## 外观模式在前端框架中的应用

### React Context API 外观

```jsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 子系统1: 用户状态管理
class UserState {
  constructor() {
    this.state = {
      user: null,
      isAuthenticated: false,
      loading: true
    };
    this.listeners = [];
  }

  // 更新用户状态
  updateUser(userData) {
    this.state = {
      ...this.state,
      user: userData,
      isAuthenticated: !!userData,
      loading: false
    };
    this.notifyListeners();
  }

  // 设置加载状态
  setLoading(loading) {
    this.state.loading = loading;
    this.notifyListeners();
  }

  // 登录
  async login(username, password) {
    try {
      this.setLoading(true);
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟成功响应
      const userData = {
        id: 1,
        username,
        email: `${username}@example.com`,
        role: 'user'
      };
      
      this.updateUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      this.setLoading(false);
      return { success: false, error: error.message };
    }
  }

  // 登出
  logout() {
    this.updateUser(null);
    localStorage.removeItem('user');
  }

  // 初始化用户（从localStorage恢复）
  async initialize() {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        this.updateUser(userData);
      } else {
        this.updateUser(null);
      }
    } catch (error) {
      console.error('初始化用户失败:', error);
      this.updateUser(null);
    }
  }

  // 订阅状态变化
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // 通知所有监听器
  notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }

  // 获取当前状态
  getState() {
    return { ...this.state };
  }
}

// 子系统2: 产品数据管理
class ProductState {
  constructor() {
    this.state = {
      products: [],
      featuredProducts: [],
      loading: false,
      error: null
    };
    this.listeners = [];
  }

  // 设置产品数据
  setProducts(products) {
    this.state.products = products;
    this.notifyListeners();
  }

  // 设置精选产品
  setFeaturedProducts(products) {
    this.state.featuredProducts = products;
    this.notifyListeners();
  }

  // 设置加载状态
  setLoading(loading) {
    this.state.loading = loading;
    this.notifyListeners();
  }

  // 设置错误
  setError(error) {
    this.state.error = error;
    this.notifyListeners();
  }

  // 加载所有产品
  async loadProducts() {
    try {
      this.setLoading(true);
      this.setError(null);
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 模拟产品数据
      const products = [
        { id: 1, name: '智能手表', price: 1999, category: '电子设备', featured: true },
        { id: 2, name: '无线耳机', price: 999, category: '电子设备', featured: true },
        { id: 3, name: '平板电脑', price: 3999, category: '电子设备', featured: true },
        { id: 4, name: '蓝牙音箱', price: 599, category: '电子设备', featured: false },
        { id: 5, name: '移动电源', price: 199, category: '电子配件', featured: false },
        { id: 6, name: '智能灯泡', price: 99, category: '智能家居', featured: true }
      ];
      
      this.setProducts(products);
      
      // 设置精选产品
      const featured = products.filter(p => p.featured);
      this.setFeaturedProducts(featured);
      
      return { success: true, data: products };
    } catch (error) {
      this.setError(error.message);
      return { success: false, error: error.message };
    } finally {
      this.setLoading(false);
    }
  }

  // 根据ID获取产品
  getProductById(id) {
    return this.state.products.find(product => product.id === id) || null;
  }

  // 根据分类获取产品
  getProductsByCategory(category) {
    return this.state.products.filter(product => product.category === category);
  }

  // 订阅状态变化
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // 通知所有监听器
  notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }

  // 获取当前状态
  getState() {
    return { ...this.state };
  }
}

// 子系统3: 购物车管理
class CartState {
  constructor() {
    this.state = {
      items: [],
      total: 0,
      itemCount: 0
    };
    this.listeners = [];
    this.initialize();
  }

  // 初始化购物车（从localStorage恢复）
  initialize() {
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const cartData = JSON.parse(storedCart);
        this.state = { ...cartData };
        this.notifyListeners();
      }
    } catch (error) {
      console.error('初始化购物车失败:', error);
    }
  }

  // 保存购物车到localStorage
  saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(this.state));
  }

  // 更新总计
  updateTotals() {
    const itemCount = this.state.items.reduce((count, item) => count + item.quantity, 0);
    const total = this.state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    this.state = {
      ...this.state,
      itemCount,
      total
    };
    
    this.saveToStorage();
    this.notifyListeners();
  }

  // 添加商品到购物车
  addItem(product, quantity = 1) {
    // 检查商品是否已在购物车中
    const existingItemIndex = this.state.items.findIndex(item => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      // 如果商品已存在，增加数量
      const updatedItems = [...this.state.items];
      updatedItems[existingItemIndex].quantity += quantity;
      this.state.items = updatedItems;
    } else {
      // 如果商品不存在，添加新商品
      const newItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image || '',
        quantity
      };
      this.state.items = [...this.state.items, newItem];
    }
    
    this.updateTotals();
    return { success: true, itemCount: this.state.itemCount };
  }

  // 更新购物车中商品数量
  updateItemQuantity(productId, quantity) {
    if (quantity <= 0) {
      return this.removeItem(productId);
    }
    
    const updatedItems = this.state.items.map(item => {
      if (item.id === productId) {
        return { ...item, quantity };
      }
      return item;
    });
    
    this.state.items = updatedItems;
    this.updateTotals();
    return { success: true, itemCount: this.state.itemCount };
  }

  // 从购物车移除商品
  removeItem(productId) {
    this.state.items = this.state.items.filter(item => item.id !== productId);
    this.updateTotals();
    return { success: true, itemCount: this.state.itemCount };
  }

  // 清空购物车
  clearCart() {
    this.state = {
      items: [],
      total: 0,
      itemCount: 0
    };
    
    this.saveToStorage();
    this.notifyListeners();
    return { success: true };
  }

  // 获取购物车项目数量
  getItemCount() {
    return this.state.itemCount;
  }

  // 获取购物车总金额
  getTotal() {
    return this.state.total;
  }

  // 订阅状态变化
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // 通知所有监听器
  notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }

  // 获取当前状态
  getState() {
    return { ...this.state };
  }
}

// 创建状态实例
const userState = new UserState();
const productState = new ProductState();
const cartState = new CartState();

// 创建Context
const AppContext = createContext();

// 外观组件: AppProvider
function AppProvider({ children }) {
  const [appState, setAppState] = useState({
    user: userState.getState(),
    products: productState.getState(),
    cart: cartState.getState()
  });

  // 初始化应用状态
  useEffect(() => {
    userState.initialize();
    productState.loadProducts();
  }, []);

  // 订阅子系统状态变化
  useEffect(() => {
    const unsubscribeUser = userState.subscribe(userData => {
      setAppState(prev => ({ ...prev, user: userData }));
    });

    const unsubscribeProducts = productState.subscribe(productsData => {
      setAppState(prev => ({ ...prev, products: productsData }));
    });

    const unsubscribeCart = cartState.subscribe(cartData => {
      setAppState(prev => ({ ...prev, cart: cartData }));
    });

    // 清理订阅
    return () => {
      unsubscribeUser();
      unsubscribeProducts();
      unsubscribeCart();
    };
  }, []);

  // 提供给组件使用的方法
  const contextValue = {
    // 用户相关方法
    user: appState.user,
    login: userState.login.bind(userState),
    logout: userState.logout.bind(userState),
    
    // 产品相关方法
    products: appState.products,
    loadProducts: productState.loadProducts.bind(productState),
    getProductById: productState.getProductById.bind(productState),
    getProductsByCategory: productState.getProductsByCategory.bind(productState),
    
    // 购物车相关方法
    cart: appState.cart,
    addToCart: cartState.addItem.bind(cartState),
    updateCartItem: cartState.updateItemQuantity.bind(cartState),
    removeFromCart: cartState.removeItem.bind(cartState),
    clearCart: cartState.clearCart.bind(cartState)
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// 自定义Hook，简化Context使用
function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// 使用示例组件
function LoginForm() {
  const { login, user } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await login(username, password);
    if (!result.success) {
      setError(result.error || '登录失败');
    }
  };

  if (user.isAuthenticated) {
    return <div>已登录为: {user.user?.username}</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>登录</h2>
      {error && <div className="error">{error}</div>}
      <div>
        <label>用户名:</label>
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
      </div>
      <div>
        <label>密码:</label>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
      </div>
      <button type="submit" disabled={user.loading}>
        {user.loading ? '登录中...' : '登录'}
      </button>
    </form>
  );
}

function ProductList() {
  const { products, addToCart } = useApp();

  if (products.loading) {
    return <div>加载中...</div>;
  }

  if (products.error) {
    return <div>错误: {products.error}</div>;
  }

  return (
    <div className="product-list">
      <h2>产品列表</h2>
      <div className="products">
        {products.products.map(product => (
          <div key={product.id} className="product">
            <h3>{product.name}</h3>
            <p>价格: ¥{product.price}</p>
            <p>分类: {product.category}</p>
            {product.featured && <span className="featured">精选</span>}
            <button onClick={() => addToCart(product)}>添加到购物车</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Cart() {
  const { cart, updateCartItem, removeFromCart, clearCart } = useApp();

  if (cart.itemCount === 0) {
    return <div>购物车是空的</div>;
  }

  return (
    <div className="cart">
      <h2>购物车 ({cart.itemCount})</h2>
      <ul>
        {cart.items.map(item => (
          <li key={item.id}>
            <div>
              <span>{item.name}</span>
              <span>¥{item.price}</span>
            </div>
            <div>
              <button onClick={() => updateCartItem(item.id, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateCartItem(item.id, item.quantity + 1)}>+</button>
              <button onClick={() => removeFromCart(item.id)}>删除</button>
            </div>
          </li>
        ))}
      </ul>
      <div className="total">
        <strong>总计: ¥{cart.total}</strong>
      </div>
      <button onClick={clearCart}>清空购物车</button>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <div className="app">
        <header>
          <h1>电子商务应用</h1>
          <LoginForm />
        </header>
        <main>
          <ProductList />
          <Cart />
        </main>
      </div>
    </AppProvider>
  );
}

// 客户端代码 - 展示外观模式如何简化状态管理
function clientCode() {
  console.log('--- React应用中的外观模式示例 ---');
  console.log('AppProvider作为外观，简化了对用户、产品和购物车子系统的访问');
  console.log('useApp Hook进一步简化了组件对状态和方法的使用');
  
  // 在实际React应用中，我们会使用ReactDOM.render来渲染App组件
  // 这里只是展示代码结构
}

// 使用示例
clientCode();
```

## 常见问题与解答

### 1. 外观模式与适配器模式有什么区别？

**外观模式**提供了一个简化的接口，用来访问复杂子系统中的多个接口，其目的是降低使用复杂性。而**适配器模式**是将一个接口转换成客户端期望的另一个接口，其目的是解决接口不兼容的问题。

外观模式不改变子系统的接口，只是提供了一个更简单的入口；而适配器模式会改变接口以匹配客户端的期望。

### 2. 外观模式会影响系统性能吗？

外观模式会引入一个额外的抽象层，理论上可能会有轻微的性能开销。但在大多数情况下，这种开销是微不足道的，而且外观模式通过减少重复代码和优化子系统调用，实际上可能会提高整体性能和可维护性。

### 3. 什么时候应该使用外观模式？

当你有一个复杂的子系统，并且希望为客户端提供一个简单易用的接口时，应该考虑使用外观模式。特别是当：

- 你需要隐藏子系统的复杂性
- 你希望减少客户端与子系统之间的直接依赖
- 你需要为子系统提供一个统一的入口点
- 你希望简化客户端代码

### 4. 外观模式可能会违反开闭原则吗？

如果子系统的接口发生变化，可能需要修改外观类，这可能会违反开闭原则。为了减少这种风险，应该：

- 设计稳定的子系统接口
- 在外观类中使用依赖注入
- 考虑使用组合而不是继承
- 设计外观类时考虑未来的可扩展性

### 5. 外观模式和单例模式可以一起使用吗？

是的，外观模式和单例模式可以很好地结合使用。通常，外观类只需要一个实例，所以可以将其实现为单例。这样可以确保系统中只有一个外观对象，简化管理并节省资源。

### 6. 如何避免外观类变得过于复杂？

为了避免外观类变得过于复杂，可以：

- 遵循单一职责原则，每个外观类只负责一个功能领域
- 使用多个外观类来划分不同的功能模块
- 不要在外观类中实现业务逻辑，只负责协调子系统
- 当外观类变得太大时，考虑将其拆分为多个更小的外观类

### 7. 外观模式适合所有类型的应用吗？

外观模式特别适合复杂的企业级应用、库和框架，但对于小型简单的应用可能不是必需的。在决定是否使用外观模式时，应该权衡其带来的好处（简化接口、降低耦合）与可能的缺点（额外的抽象层）。

## 总结

外观模式是一种非常实用的结构型设计模式，它通过提供一个统一的接口来简化复杂子系统的使用。外观模式的主要优势在于降低了系统的复杂度，提高了代码的可维护性，并减少了客户端与子系统之间的耦合。

在实际开发中，外观模式被广泛应用于：

1. **库和框架的公共API**：为内部复杂的功能提供简单易用的接口
2. **企业级应用架构**：在分层架构中为每层提供统一的入口点
3. **遗留系统集成**：隐藏遗留系统的复杂性，提供现代接口
4. **微服务架构**：为多个微服务提供一个聚合的API网关

通过合理使用外观模式，我们可以创建更加模块化、可维护和用户友好的软件系统。