# 适配器模式（Adapter Pattern）

## 基本概念

适配器模式是一种结构型设计模式，它允许接口不兼容的对象能够相互合作。它将一个类的接口转换成客户端所期望的另一个接口。

## 实现方式

### 1. 类适配器（继承方式）

```javascript
// 被适配的类
class Adaptee {
    specificRequest() {
        return 'specific request';
    }
}

// 目标接口
class Target {
    request() {
        return 'standard request';
    }
}

// 适配器类（通过继承实现）
class Adapter extends Target {
    constructor() {
        super();
        this.adaptee = new Adaptee();
    }
    
    request() {
        const specificResult = this.adaptee.specificRequest();
        return `Adapter: ${specificResult} -> standard format`;
    }
}

// 使用
const adapter = new Adapter();
console.log(adapter.request()); // "Adapter: specific request -> standard format"
```

### 2. 对象适配器（组合方式）

```javascript
// 被适配的类
class Adaptee {
    specificRequest() {
        return 'specific request';
    }
}

// 目标接口
class Target {
    request() {
        return 'standard request';
    }
}

// 适配器类（通过组合实现）
class Adapter {
    constructor(adaptee) {
        this.adaptee = adaptee;
    }
    
    request() {
        const specificResult = this.adaptee.specificRequest();
        return `Adapter: ${specificResult} -> standard format`;
    }
}

// 使用
const adaptee = new Adaptee();
const adapter = new Adapter(adaptee);
console.log(adapter.request()); // "Adapter: specific request -> standard format"
```

## 使用场景

1. **集成第三方库**：当需要使用第三方库，但它的接口与现有系统不兼容时
2. **遗留系统改造**：保留旧系统功能，同时提供新的接口
3. **统一接口**：将多个不同接口的类转换为统一的接口
4. **前后端数据格式转换**：将后端返回的数据格式转换为前端需要的格式

## 实际应用案例

### 1. 数据格式适配器

```javascript
// 假设后端返回的数据格式
const backendData = {
    user_info: {
        full_name: 'John Doe',
        contact_details: {
            phone_number: '1234567890',
            email_address: 'john@example.com'
        }
    }
};

// 前端需要的数据格式适配器
class DataAdapter {
    constructor(backendData) {
        this.data = backendData;
    }
    
    getFrontendData() {
        return {
            name: this.data.user_info.full_name,
            phone: this.data.user_info.contact_details.phone_number,
            email: this.data.user_info.contact_details.email_address
        };
    }
}

// 使用
const adapter = new DataAdapter(backendData);
const frontendData = adapter.getFrontendData();
console.log(frontendData);
// { name: 'John Doe', phone: '1234567890', email: 'john@example.com' }
```

### 2. 不同API的适配器

```javascript
// 支付接口适配器示例
class PayPalAPI {
    pay(amount, currency) {
        return `PayPal payment of ${amount} ${currency}`;
    }
}

class StripeAPI {
    charge(amount, currency) {
        return `Stripe charge of ${amount} ${currency}`;
    }
}

// PayPal适配器
class PayPalAdapter {
    constructor(paypal) {
        this.paypal = paypal;
    }
    
    processPayment(data) {
        return this.paypal.pay(data.amount, data.currency);
    }
}

// Stripe适配器
class StripeAdapter {
    constructor(stripe) {
        this.stripe = stripe;
    }
    
    processPayment(data) {
        return this.stripe.charge(data.amount, data.currency);
    }
}

// 使用统一接口
function makePayment(adapter, paymentData) {
    return adapter.processPayment(paymentData);
}

// 测试
const paypal = new PayPalAdapter(new PayPalAPI());
const stripe = new StripeAdapter(new StripeAPI());

console.log(makePayment(paypal, { amount: 100, currency: 'USD' }));
console.log(makePayment(stripe, { amount: 200, currency: 'EUR' }));
```

## 优缺点分析

### 优点

1. **解耦性好**：将原有系统与适配的类解耦
2. **复用性高**：可以复用已有的类，不需要修改源代码
3. **扩展性好**：可以轻松添加新的适配器，支持新的接口
4. **符合开闭原则**：对扩展开放，对修改关闭

### 缺点

1. **增加了代码复杂度**：引入了额外的适配器类
2. **性能可能受到影响**：多了一层转换

## 常见问题与答案

### 1. 适配器模式和装饰器模式有什么区别？
**答案：**
- 适配器模式：改变接口以匹配客户端的期望
- 装饰器模式：不改变接口，但动态地添加功能

### 2. 适配器模式和外观模式有什么区别？
**答案：**
- 适配器模式：适配一个类的接口
- 外观模式：为一组复杂的类提供一个简单的接口

### 3. 何时应该使用适配器模式？
**答案：** 当你需要使用一个已有的类，但它的接口与你当前系统的需求不兼容时，使用适配器模式可以避免修改原有代码，实现接口的转换。

### 4. 适配器模式在前端框架中的应用？
**答案：**
- Vue的自定义指令可以看作是DOM操作的适配器
- 各种第三方UI库的适配层
- Redux中间件可以看作是API调用的适配器