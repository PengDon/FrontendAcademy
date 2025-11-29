# 观察者模式（Observer Pattern）

## 基本概念

观察者模式是一种行为型设计模式，定义了一种一对多的依赖关系，让多个观察者对象同时监听某一个主题对象，当主题对象状态发生变化时，所有依赖于它的观察者都会得到通知并自动更新。

## 实现方式

```javascript
// 主题/被观察者
class Subject {
    constructor() {
        this.observers = [];
        this.state = null;
    }
    
    // 添加观察者
    addObserver(observer) {
        if (!this.observers.includes(observer)) {
            this.observers.push(observer);
        }
    }
    
    // 移除观察者
    removeObserver(observer) {
        const index = this.observers.indexOf(observer);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    }
    
    // 通知所有观察者
    notify() {
        for (const observer of this.observers) {
            observer.update(this.state);
        }
    }
    
    // 设置状态
    setState(state) {
        this.state = state;
        this.notify();
    }
}

// 观察者
class Observer {
    constructor(name) {
        this.name = name;
    }
    
    // 更新方法
    update(state) {
        console.log(`${this.name} received update: ${state}`);
    }
}

// 使用
const subject = new Subject();

const observer1 = new Observer('Observer 1');
const observer2 = new Observer('Observer 2');

subject.addObserver(observer1);
subject.addObserver(observer2);

subject.setState('Hello World');
// 输出:
// Observer 1 received update: Hello World
// Observer 2 received update: Hello World

subject.removeObserver(observer1);

subject.setState('Goodbye');
// 输出:
// Observer 2 received update: Goodbye
```

## 使用场景

1. **事件处理系统**：如DOM事件监听
2. **发布-订阅模式**：如消息队列、事件总线
3. **GUI组件交互**：如表单验证、UI更新
4. **状态管理**：如Vue的响应式系统、Redux的订阅机制
5. **数据绑定**：如MVVM框架中的数据双向绑定

## 实际应用案例

### 1. 事件总线实现

```javascript
class EventBus {
    constructor() {
        this.events = {};
    }
    
    // 订阅事件
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }
    
    // 取消订阅
    off(event, callback) {
        if (this.events[event]) {
            if (callback) {
                this.events[event] = this.events[event].filter(cb => cb !== callback);
            } else {
                delete this.events[event];
            }
        }
    }
    
    // 触发事件
    emit(event, ...args) {
        if (this.events[event]) {
            for (const callback of this.events[event]) {
                callback(...args);
            }
        }
    }
    
    // 只订阅一次
    once(event, callback) {
        const onceCallback = (...args) => {
            callback(...args);
            this.off(event, onceCallback);
        };
        this.on(event, onceCallback);
    }
}

// 使用
const eventBus = new EventBus();

const handler1 = (data) => console.log('Handler 1:', data);
const handler2 = (data) => console.log('Handler 2:', data);

eventBus.on('message', handler1);
eventBus.on('message', handler2);

eventBus.emit('message', 'Hello');
// 输出:
// Handler 1: Hello
// Handler 2: Hello

eventBus.off('message', handler1);

eventBus.emit('message', 'World');
// 输出:
// Handler 2: World
```

### 2. 响应式数据绑定简单实现

```javascript
class ReactiveData {
    constructor(value) {
        this._value = value;
        this.observers = [];
    }
    
    get value() {
        return this._value;
    }
    
    set value(newValue) {
        if (this._value !== newValue) {
            this._value = newValue;
            this.notify();
        }
    }
    
    subscribe(observer) {
        if (!this.observers.includes(observer)) {
            this.observers.push(observer);
        }
    }
    
    notify() {
        for (const observer of this.observers) {
            observer(this._value);
        }
    }
}

// 使用
const data = new ReactiveData(10);

data.subscribe((value) => {
    console.log(`Data changed to: ${value}`);
});

data.value = 20; // 输出: Data changed to: 20
data.value = 30; // 输出: Data changed to: 30
```

## 优缺点分析

### 优点

1. **松耦合**：主题和观察者之间通过接口通信，不直接依赖
2. **扩展性好**：可以轻松添加新的观察者，无需修改现有代码
3. **符合开闭原则**：对扩展开放，对修改关闭
4. **支持广播通信**：主题可以同时通知多个观察者

### 缺点

1. **过度通知**：如果观察者过多，可能导致性能问题
2. **循环依赖**：可能导致循环引用和内存泄漏
3. **通知顺序不确定**：观察者的通知顺序可能会影响系统行为

## 常见问题与答案

### 1. 观察者模式和发布-订阅模式有什么区别？
**答案：**
- 观察者模式：主题和观察者直接交互，是一种紧耦合的一对多关系
- 发布-订阅模式：通过事件总线/消息队列作为中介，发布者和订阅者完全解耦

### 2. 如何避免观察者模式中的内存泄漏？
**答案：**
- 当不再需要观察者时，及时调用removeObserver移除
- 使用弱引用（如WeakMap）存储观察者
- 在组件销毁时取消订阅

### 3. 观察者模式在前端框架中的应用？
**答案：**
- Vue的响应式系统（Observer模式）
- React的Context API和自定义事件
- Redux的store.subscribe机制
- Angular的EventEmitter

### 4. 如何优化大量观察者的性能？
**答案：**
- 使用批量更新策略
- 实现优先级队列，控制通知顺序
- 使用防抖/节流技术减少不必要的通知
- 考虑使用虚拟DOM技术（如React、Vue）