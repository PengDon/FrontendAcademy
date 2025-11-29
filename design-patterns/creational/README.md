# 创建型设计模式完全指南

## 目录

- [1. 介绍](#1-介绍)
  - [1.1 什么是创建型设计模式](#11-什么是创建型设计模式)
  - [1.2 创建型设计模式的分类](#12-创建型设计模式的分类)
  - [1.3 创建型设计模式的优势](#13-创建型设计模式的优势)
- [2. 工厂方法模式 (Factory Method)](#2-工厂方法模式-factory-method)
  - [2.1 意图](#21-意图)
  - [2.2 结构](#22-结构)
  - [2.3 实现示例](#23-实现示例)
  - [2.4 应用场景](#24-应用场景)
  - [2.5 优缺点](#25-优缺点)
  - [2.6 变体](#26-变体)
- [3. 抽象工厂模式 (Abstract Factory)](#3-抽象工厂模式-abstract-factory)
  - [3.1 意图](#31-意图)
  - [3.2 结构](#32-结构)
  - [3.3 实现示例](#33-实现示例)
  - [3.4 应用场景](#34-应用场景)
  - [3.5 优缺点](#35-优缺点)
  - [3.6 变体](#36-变体)
- [4. 单例模式 (Singleton)](#4-单例模式-singleton)
  - [4.1 意图](#41-意图)
  - [4.2 结构](#42-结构)
  - [4.3 实现示例](#43-实现示例)
  - [4.4 应用场景](#44-应用场景)
  - [4.5 优缺点](#45-优缺点)
  - [4.6 变体](#46-变体)
- [5. 建造者模式 (Builder)](#5-建造者模式-builder)
  - [5.1 意图](#51-意图)
  - [5.2 结构](#52-结构)
  - [5.3 实现示例](#53-实现示例)
  - [5.4 应用场景](#54-应用场景)
  - [5.5 优缺点](#55-优缺点)
  - [5.6 变体](#56-变体)
- [6. 原型模式 (Prototype)](#6-原型模式-prototype)
  - [6.1 意图](#61-意图)
  - [6.2 结构](#62-结构)
  - [6.3 实现示例](#63-实现示例)
  - [6.4 应用场景](#64-应用场景)
  - [6.5 优缺点](#65-优缺点)
  - [6.6 变体](#66-变体)
- [7. 对象池模式 (Object Pool)](#7-对象池模式-object-pool)
  - [7.1 意图](#71-意图)
  - [7.2 结构](#72-结构)
  - [7.3 实现示例](#73-实现示例)
  - [7.4 应用场景](#74-应用场景)
  - [7.5 优缺点](#75-优缺点)
  - [7.6 变体](#76-变体)
- [8. 多例模式 (Multiton)](#8-多例模式-multiton)
  - [8.1 意图](#81-意图)
  - [8.2 结构](#82-结构)
  - [8.3 实现示例](#83-实现示例)
  - [8.4 应用场景](#84-应用场景)
  - [8.5 优缺点](#85-优缺点)
  - [8.6 变体](#86-变体)
- [9. 创建型设计模式总结](#9-创建型设计模式总结)
  - [9.1 主要模式对比](#91-主要模式对比)
  - [9.2 设计模式选择指南](#92-设计模式选择指南)
  - [9.3 最佳实践](#93-最佳实践)
  - [9.4 未来趋势](#94-未来趋势)

## 1. 介绍

### 1.1 什么是创建型设计模式

创建型设计模式是一类处理对象创建的设计模式，它提供了创建对象的机制，能够在创建对象的同时隐藏创建逻辑，而不是通过使用new操作符直接实例化对象。这使得程序在判断针对某个给定实例需要创建哪些对象时更加灵活。

### 1.2 创建型设计模式的分类

常见的创建型设计模式包括：

- **工厂方法模式 (Factory Method)**：定义一个用于创建对象的接口，让子类决定实例化哪一个类
- **抽象工厂模式 (Abstract Factory)**：提供一个创建一系列相关或相互依赖对象的接口，而无需指定它们的具体类
- **单例模式 (Singleton)**：确保一个类只有一个实例，并提供一个全局访问点
- **建造者模式 (Builder)**：将复杂对象的构建与表示分离，使得同样的构建过程可以创建不同的表示
- **原型模式 (Prototype)**：用原型实例指定创建对象的种类，并且通过拷贝这些原型创建新的对象
- **对象池模式 (Object Pool)**：预先创建一组对象并在需要时重用它们
- **多例模式 (Multiton)**：确保一个类有有限数量的实例，并提供一个全局访问点

### 1.3 创建型设计模式的优势

创建型设计模式提供了以下优势：

- **封装复杂性**：隐藏对象创建的复杂细节
- **解耦创建与使用**：将对象的创建和使用分离，降低系统的耦合度
- **提高灵活性**：允许系统在不修改现有代码的情况下引入新的对象类型
- **优化资源利用**：通过对象池等机制优化对象创建和销毁的性能
- **确保一致性**：保证对象创建的一致性和正确性

## 2. 工厂方法模式 (Factory Method)

### 2.1 意图

定义一个用于创建对象的接口，让子类决定实例化哪一个类。工厂方法使一个类的实例化延迟到其子类。

### 2.2 结构

工厂方法模式包含以下角色：

- **产品 (Product)**：定义工厂方法所创建的对象的接口
- **具体产品 (ConcreteProduct)**：实现产品接口的具体类
- **创建者 (Creator)**：声明工厂方法，该方法返回一个产品类型的对象
- **具体创建者 (ConcreteCreator)**：实现工厂方法，返回具体产品的实例

### 2.3 实现示例

```javascript
// 产品接口
class Product {
  operation() {
    throw new Error('子类必须实现operation方法');
  }
}

// 具体产品A
class ConcreteProductA extends Product {
  operation() {
    return { type: 'A', message: '这是产品A的操作' };
  }
}

// 具体产品B
class ConcreteProductB extends Product {
  operation() {
    return { type: 'B', message: '这是产品B的操作' };
  }
}

// 创建者
class Creator {
  // 工厂方法，返回一个产品对象
  factoryMethod() {
    throw new Error('子类必须实现factoryMethod方法');
  }

  // 业务逻辑，使用工厂方法创建的产品
  someOperation() {
    // 调用工厂方法创建产品
    const product = this.factoryMethod();
    // 使用产品
    return `Creator: ${product.operation().message}`;
  }
}

// 具体创建者A
class ConcreteCreatorA extends Creator {
  factoryMethod() {
    return new ConcreteProductA();
  }
}

// 具体创建者B
class ConcreteCreatorB extends Creator {
  factoryMethod() {
    return new ConcreteProductB();
  }
}

// 客户端代码
function clientCode(creator) {
  console.log(`客户端: 不关心创建者的具体类型，只使用其方法`);
  console.log(creator.someOperation());
}

// 运行客户端代码
console.log('使用具体创建者A:');
clientCode(new ConcreteCreatorA());

console.log('\n使用具体创建者B:');
clientCode(new ConcreteCreatorB());

// 扩展系统，添加新产品
class ConcreteProductC extends Product {
  operation() {
    return { type: 'C', message: '这是产品C的操作' };
  }
}

class ConcreteCreatorC extends Creator {
  factoryMethod() {
    return new ConcreteProductC();
  }
}

console.log('\n使用具体创建者C (扩展):');
clientCode(new ConcreteCreatorC());
```

### 2.4 应用场景

工厂方法模式适用于以下场景：

- 当一个类不知道它所必须创建的对象的类的时候
- 当一个类希望由它的子类来指定它所创建的对象的时候
- 当类将创建对象的职责委托给多个帮助子类中的某一个，并且你希望将哪一个帮助子类是代理者这一信息局部化的时候

### 2.5 优缺点

**优点：**
- 解耦了产品的创建和使用
- 提供了一种符合开闭原则的方式来扩展系统
- 更容易进行单元测试，因为可以模拟工厂方法
- 封装了对象创建的细节

**缺点：**
- 系统中可能会有大量的具体工厂类
- 客户端必须知道所有的具体工厂类才能选择合适的一个
- 增加了系统的复杂度

### 2.6 变体

工厂方法模式的变体：

- **简单工厂**：一个工厂类创建所有类型的产品
- **静态工厂方法**：使用静态方法而不是实例方法
- **参数化工厂方法**：通过参数决定创建哪种类型的产品
- **延迟初始化工厂**：只有在需要时才创建产品

## 3. 抽象工厂模式 (Abstract Factory)

### 3.1 意图

提供一个创建一系列相关或相互依赖对象的接口，而无需指定它们的具体类。

### 3.2 结构

抽象工厂模式包含以下角色：

- **抽象工厂 (AbstractFactory)**：声明创建一系列抽象产品的接口
- **具体工厂 (ConcreteFactory)**：实现抽象工厂的接口，创建具体产品
- **抽象产品 (AbstractProduct)**：为产品族中的产品声明接口
- **具体产品 (ConcreteProduct)**：实现抽象产品接口，由具体工厂创建

### 3.3 实现示例

```javascript
// 抽象产品A
class AbstractProductA {
  operation() {
    throw new Error('子类必须实现operation方法');
  }
}

// 具体产品A1
class ConcreteProductA1 extends AbstractProductA {
  operation() {
    return { type: 'A1', message: '这是产品A1的操作' };
  }
}

// 具体产品A2
class ConcreteProductA2 extends AbstractProductA {
  operation() {
    return { type: 'A2', message: '这是产品A2的操作' };
  }
}

// 抽象产品B
class AbstractProductB {
  operation() {
    throw new Error('子类必须实现operation方法');
  }

  // 与AbstractProductA协作的方法
  collaborateWith(productA) {
    const result = productA.operation();
    return `B与${result.type}协作: ${result.message}`;
  }
}

// 具体产品B1
class ConcreteProductB1 extends AbstractProductB {
  operation() {
    return { type: 'B1', message: '这是产品B1的操作' };
  }
}

// 具体产品B2
class ConcreteProductB2 extends AbstractProductB {
  operation() {
    return { type: 'B2', message: '这是产品B2的操作' };
  }
}

// 抽象工厂
class AbstractFactory {
  createProductA() {
    throw new Error('子类必须实现createProductA方法');
  }

  createProductB() {
    throw new Error('子类必须实现createProductB方法');
  }
}

// 具体工厂1
class ConcreteFactory1 extends AbstractFactory {
  createProductA() {
    return new ConcreteProductA1();
  }

  createProductB() {
    return new ConcreteProductB1();
  }
}

// 具体工厂2
class ConcreteFactory2 extends AbstractFactory {
  createProductA() {
    return new ConcreteProductA2();
  }

  createProductB() {
    return new ConcreteProductB2();
  }
}

// 客户端代码
function clientCode(factory) {
  const productA = factory.createProductA();
  const productB = factory.createProductB();

  console.log(`客户端: 使用产品A: ${productA.operation().message}`);
  console.log(`客户端: 使用产品B: ${productB.operation().message}`);
  console.log(`客户端: 产品A和产品B协作: ${productB.collaborateWith(productA)}`);
}

// 运行客户端代码
console.log('使用具体工厂1:');
clientCode(new ConcreteFactory1());

console.log('\n使用具体工厂2:');
clientCode(new ConcreteFactory2());

// 实际应用场景示例：UI组件库
console.log('\nUI组件库示例:');

// 为不同操作系统创建UI组件
class Button {
  render() {}
}

class Checkbox {
  render() {}
}

class WindowsButton extends Button {
  render() {
    return '渲染Windows按钮';
  }
}

class MacOSButton extends Button {
  render() {
    return '渲染MacOS按钮';
  }
}

class WindowsCheckbox extends Checkbox {
  render() {
    return '渲染Windows复选框';
  }
}

class MacOSCheckbox extends Checkbox {
  render() {
    return '渲染MacOS复选框';
  }
}

class UIFactory {
  createButton() {}
  createCheckbox() {}
}

class WindowsUIFactory extends UIFactory {
  createButton() {
    return new WindowsButton();
  }

  createCheckbox() {
    return new WindowsCheckbox();
  }
}

class MacOSUIFactory extends UIFactory {
  createButton() {
    return new MacOSButton();
  }

  createCheckbox() {
    return new MacOSCheckbox();
  }
}

// 应用程序类
class Application {
  constructor(factory) {
    this.factory = factory;
    this.button = null;
    this.checkbox = null;
  }

  createUI() {
    this.button = this.factory.createButton();
    this.checkbox = this.factory.createCheckbox();
  }

  renderUI() {
    console.log(this.button.render());
    console.log(this.checkbox.render());
  }
}

// 创建Windows应用
const windowsApp = new Application(new WindowsUIFactory());
windowsApp.createUI();
console.log('Windows应用UI:');
windowsApp.renderUI();

// 创建MacOS应用
const macosApp = new Application(new MacOSUIFactory());
macosApp.createUI();
console.log('\nMacOS应用UI:');
macosApp.renderUI();
```

### 3.4 应用场景

抽象工厂模式适用于以下场景：

- 系统需要独立于它的产品的创建、组合和表示时
- 系统需要由多个产品系列中的一个来配置时
- 当你要强调一系列相关的产品对象的设计以便进行联合使用时
- 当你提供一个产品类库，而只想暴露它们的接口而不是实现时

### 3.5 优缺点

**优点：**
- 确保产品的一致性
- 隔离具体类
- 支持产品族的交换
- 遵循开闭原则

**缺点：**
- 难以扩展新的产品种类
- 增加了系统的复杂性
- 客户端必须了解所有的产品族

### 3.6 变体

抽象工厂模式的变体：

- **参数化抽象工厂**：通过参数决定创建哪种产品族
- **延迟初始化抽象工厂**：只有在需要时才创建产品
- **单例抽象工厂**：将工厂本身实现为单例模式
- **工厂方法组合**：在抽象工厂中使用工厂方法

## 4. 单例模式 (Singleton)

### 4.1 意图

确保一个类只有一个实例，并提供一个全局访问点。

### 4.2 结构

单例模式包含以下角色：

- **单例类 (Singleton)**：定义一个静态方法，允许客户端访问其唯一实例，通常包含一个私有构造函数

### 4.3 实现示例

```javascript
// 基本单例实现
class Singleton {
  // 私有静态属性
  static #instance = null;
  // 私有构造函数
  constructor() {
    if (Singleton.#instance) {
      throw new Error('单例类不能重复实例化！');
    }
    // 初始化实例状态
    this.timestamp = new Date().toISOString();
    console.log(`单例实例已创建，时间戳: ${this.timestamp}`);
  }

  // 静态获取实例方法
  static getInstance() {
    if (!Singleton.#instance) {
      Singleton.#instance = new Singleton();
    }
    return Singleton.#instance;
  }

  // 实例方法
  doSomething() {
    return `单例执行操作，实例创建于: ${this.timestamp}`;
  }
}

// 客户端代码
function testBasicSingleton() {
  console.log('测试基本单例实现:');
  const instance1 = Singleton.getInstance();
  const instance2 = Singleton.getInstance();
  
  console.log('instance1 === instance2:', instance1 === instance2);
  console.log('instance1操作:', instance1.doSomething());
  console.log('instance2操作:', instance2.doSomething());
  
  try {
    // 尝试直接实例化
    const instance3 = new Singleton();
  } catch (error) {
    console.log('错误捕获:', error.message);
  }
}

// 立即执行函数表达式(IIFE)实现单例
const SingletonIIFE = (function() {
  let instance = null;
  
  // 私有构造函数
  function SingletonClass() {
    this.timestamp = new Date().toISOString();
    console.log(`IIFE单例实例已创建，时间戳: ${this.timestamp}`);
  }
  
  // 原型方法
  SingletonClass.prototype.doSomething = function() {
    return `IIFE单例执行操作，实例创建于: ${this.timestamp}`;
  };
  
  // 返回工厂函数
  return {
    getInstance: function() {
      if (!instance) {
        instance = new SingletonClass();
      }
      return instance;
    }
  };
})();

// 测试IIFE单例
function testIIFESingleton() {
  console.log('\n测试IIFE单例实现:');
  const instance1 = SingletonIIFE.getInstance();
  const instance2 = SingletonIIFE.getInstance();
  
  console.log('instance1 === instance2:', instance1 === instance2);
  console.log('instance1操作:', instance1.doSomething());
}

// 懒加载单例
class LazySingleton {
  static #instance = null;
  
  constructor() {
    this.data = [];
  }
  
  static getInstance() {
    // 只有在第一次调用时才创建实例
    if (!LazySingleton.#instance) {
      LazySingleton.#instance = new LazySingleton();
    }
    return LazySingleton.#instance;
  }
  
  addData(item) {
    this.data.push(item);
    return this;
  }
  
  getData() {
    return this.data;
  }
}

// 测试懒加载单例
function testLazySingleton() {
  console.log('\n测试懒加载单例:');
  // 第一次调用时创建实例
  const instance1 = LazySingleton.getInstance();
  instance1.addData('数据项1');
  
  // 第二次调用时返回相同实例
  const instance2 = LazySingleton.getInstance();
  instance2.addData('数据项2');
  
  console.log('instance1数据:', instance1.getData());
  console.log('instance2数据:', instance2.getData());
  console.log('数据相同:', instance1.getData() === instance2.getData());
}

// 线程安全单例(在JavaScript中主要考虑异步场景)
class ThreadSafeSingleton {
  static #instance = null;
  static #lock = false;
  
  constructor() {
    this.timestamp = new Date().toISOString();
  }
  
  static async getInstance() {
    // 双重检查锁定模式
    if (!ThreadSafeSingleton.#instance) {
      if (!ThreadSafeSingleton.#lock) {
        ThreadSafeSingleton.#lock = true;
        
        // 模拟异步操作
        await new Promise(resolve => setTimeout(resolve, 100));
        
        ThreadSafeSingleton.#instance = new ThreadSafeSingleton();
        ThreadSafeSingleton.#lock = false;
      } else {
        // 等待锁释放
        while (ThreadSafeSingleton.#lock) {
          await new Promise(resolve => setTimeout(resolve, 10));
        }
        return ThreadSafeSingleton.getInstance();
      }
    }
    return ThreadSafeSingleton.#instance;
  }
}

// 测试线程安全单例
async function testThreadSafeSingleton() {
  console.log('\n测试线程安全单例:');
  
  // 同时创建多个实例
  const promise1 = ThreadSafeSingleton.getInstance();
  const promise2 = ThreadSafeSingleton.getInstance();
  
  const instance1 = await promise1;
  const instance2 = await promise2;
  
  console.log('异步实例相同:', instance1 === instance2);
  console.log('实例1时间戳:', instance1.timestamp);
  console.log('实例2时间戳:', instance2.timestamp);
}

// 执行所有测试
testBasicSingleton();
testIIFESingleton();
testLazySingleton();
testThreadSafeSingleton();

// 单例模式的实际应用：日志器
class Logger {
  static #instance = null;
  
  constructor() {
    this.logs = [];
  }
  
  static getInstance() {
    if (!Logger.#instance) {
      Logger.#instance = new Logger();
    }
    return Logger.#instance;
  }
  
  log(message) {
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp}: ${message}`;
    this.logs.push(logEntry);
    console.log(logEntry);
    return this;
  }
  
  error(message) {
    return this.log(`[ERROR] ${message}`);
  }
  
  info(message) {
    return this.log(`[INFO] ${message}`);
  }
  
  getLogs() {
    return this.logs;
  }
  
  clearLogs() {
    this.logs = [];
    return this;
  }
}

// 使用日志器
console.log('\n使用单例日志器:');
const logger1 = Logger.getInstance();
logger1.info('应用启动');
logger1.error('发生错误');

const logger2 = Logger.getInstance();
logger2.info('用户登录');

console.log('\n所有日志:');
logger1.getLogs().forEach(log => console.log(log));
```

### 4.4 应用场景

单例模式适用于以下场景：

- 当类只能有一个实例而且客户可以从一个众所周知的访问点访问它时
- 当这个唯一实例应该是通过子类化可扩展的，并且客户应该无需更改代码就能使用一个扩展的实例时

常见的应用场景包括：
- 日志记录器
- 配置管理器
- 数据库连接池
- 缓存
- 线程池
- 打印机、显卡等设备的驱动程序

### 4.5 优缺点

**优点：**
- 确保只有一个实例存在，节省系统资源
- 提供一个全局访问点
- 允许在实例化时进行延迟初始化
- 可以在单例类中实现复杂的初始化逻辑

**缺点：**
- 违反了单一职责原则，既负责创建实例，又负责业务逻辑
- 可能隐藏依赖关系，使代码难以测试
- 在多线程环境中需要特别注意线程安全问题
- 单例的状态如果是可变的，可能导致全局状态管理问题

### 4.6 变体

单例模式的变体：

- **懒汉式单例**：第一次请求时才创建实例
- **饿汉式单例**：在类加载时就创建实例
- **双重检查锁定单例**：在多线程环境中提高性能
- **登记式单例**：维护一个实例注册表
- **枚举单例**：使用枚举类型实现单例（在JavaScript中不适用）

## 5. 建造者模式 (Builder)

### 5.1 意图

将一个复杂对象的构建与它的表示分离，使得同样的构建过程可以创建不同的表示。

### 5.2 结构

建造者模式包含以下角色：

- **产品 (Product)**：表示被构建的复杂对象
- **抽象建造者 (Builder)**：定义创建产品各个部分的抽象方法
- **具体建造者 (ConcreteBuilder)**：实现抽象建造者的方法，创建产品的各个部分
- **指挥者 (Director)**：负责按特定顺序调用建造者的方法来构建产品

### 5.3 实现示例

```javascript
// 产品：电脑
class Computer {
  constructor() {
    this.cpu = null;
    this.ram = null;
    this.storage = null;
    this.gpu = null;
    this.os = null;
  }

  displaySpecs() {
    console.log(`电脑配置:\nCPU: ${this.cpu}\n内存: ${this.ram}\n存储: ${this.storage}\n显卡: ${this.gpu || '无独立显卡'}\n操作系统: ${this.os}`);
    return this;
  }
}

// 抽象建造者
class ComputerBuilder {
  constructor() {
    this.reset();
  }

  reset() {
    this.computer = new Computer();
    return this;
  }

  setCPU(cpu) {
    this.computer.cpu = cpu;
    return this;
  }

  setRAM(ram) {
    this.computer.ram = ram;
    return this;
  }

  setStorage(storage) {
    this.computer.storage = storage;
    return this;
  }

  setGPU(gpu) {
    this.computer.gpu = gpu;
    return this;
  }

  setOS(os) {
    this.computer.os = os;
    return this;
  }

  getResult() {
    const result = this.computer;
    this.reset();
    return result;
  }
}

// 具体建造者：游戏电脑建造者
class GamingComputerBuilder extends ComputerBuilder {
  constructor() {
    super();
  }

  buildBasicGamingComputer() {
    return this.setCPU('Intel Core i5')
              .setRAM('16GB')
              .setStorage('512GB SSD')
              .setGPU('NVIDIA GTX 1660')
              .setOS('Windows 11');
  }

  buildHighEndGamingComputer() {
    return this.setCPU('Intel Core i9')
              .setRAM('32GB')
              .setStorage('2TB SSD')
              .setGPU('NVIDIA RTX 4090')
              .setOS('Windows 11');
  }
}

// 具体建造者：办公电脑建造者
class OfficeComputerBuilder extends ComputerBuilder {
  constructor() {
    super();
  }

  buildEntryLevelOfficeComputer() {
    return this.setCPU('Intel Core i3')
              .setRAM('8GB')
              .setStorage('256GB SSD')
              // 办公电脑不需要独立显卡
              .setOS('Windows 10');
  }

  buildProfessionalOfficeComputer() {
    return this.setCPU('Intel Core i7')
              .setRAM('16GB')
              .setStorage('1TB SSD')
              .setOS('Windows 11 Pro');
  }
}

// 指挥者
class ComputerDirector {
  constructor(builder) {
    this.builder = builder;
  }

  changeBuilder(builder) {
    this.builder = builder;
    return this;
  }

  buildBasicGamingComputer() {
    return this.builder.buildBasicGamingComputer().getResult();
  }

  buildHighEndGamingComputer() {
    return this.builder.buildHighEndGamingComputer().getResult();
  }

  buildEntryLevelOfficeComputer() {
    return this.builder.buildEntryLevelOfficeComputer().getResult();
  }

  buildProfessionalOfficeComputer() {
    return this.builder.buildProfessionalOfficeComputer().getResult();
  }
}

// 客户端代码 - 使用指挥者
function clientCodeWithDirector() {
  console.log('使用指挥者构建电脑:');
  
  // 创建游戏电脑建造者
  const gamingBuilder = new GamingComputerBuilder();
  const director = new ComputerDirector(gamingBuilder);
  
  console.log('\n1. 构建基础游戏电脑:');
  const basicGamingComputer = director.buildBasicGamingComputer();
  basicGamingComputer.displaySpecs();
  
  console.log('\n2. 构建高端游戏电脑:');
  const highEndGamingComputer = director.buildHighEndGamingComputer();
  highEndGamingComputer.displaySpecs();
  
  // 切换到办公电脑建造者
  const officeBuilder = new OfficeComputerBuilder();
  director.changeBuilder(officeBuilder);
  
  console.log('\n3. 构建入门级办公电脑:');
  const entryLevelOfficeComputer = director.buildEntryLevelOfficeComputer();
  entryLevelOfficeComputer.displaySpecs();
  
  console.log('\n4. 构建专业级办公电脑:');
  const professionalOfficeComputer = director.buildProfessionalOfficeComputer();
  professionalOfficeComputer.displaySpecs();
}

// 客户端代码 - 直接使用建造者(链式调用)
function clientCodeWithoutDirector() {
  console.log('\n\n直接使用建造者链式调用构建自定义电脑:');
  
  const builder = new ComputerBuilder();
  
  console.log('\n1. 构建开发者电脑:');
  const developerComputer = builder
    .setCPU('AMD Ryzen 7')
    .setRAM('64GB')
    .setStorage('1TB SSD + 2TB HDD')
    .setGPU('NVIDIA Quadro P2200')
    .setOS('Ubuntu 22.04')
    .getResult();
  
  developerComputer.displaySpecs();
  
  console.log('\n2. 构建家用多媒体电脑:');
  const mediaComputer = builder
    .setCPU('Intel Core i5')
    .setRAM('16GB')
    .setStorage('2TB HDD')
    .setGPU('Intel Iris Xe')
    .setOS('Windows 11 Home')
    .getResult();
  
  mediaComputer.displaySpecs();
}

// 执行客户端代码
clientCodeWithDirector();
clientCodeWithoutDirector();

// 实际应用场景：HTML表单构建器
class FormBuilder {
  constructor() {
    this.reset();
  }

  reset() {
    this.form = {
      action: '',
      method: 'POST',
      fields: [],
      buttons: []
    };
    return this;
  }

  setAction(action) {
    this.form.action = action;
    return this;
  }

  setMethod(method) {
    this.form.method = method;
    return this;
  }

  addTextField(name, label, placeholder = '') {
    this.form.fields.push({
      type: 'text',
      name,
      label,
      placeholder
    });
    return this;
  }

  addEmailField(name, label, placeholder = '') {
    this.form.fields.push({
      type: 'email',
      name,
      label,
      placeholder
    });
    return this;
  }

  addPasswordField(name, label, placeholder = '') {
    this.form.fields.push({
      type: 'password',
      name,
      label,
      placeholder
    });
    return this;
  }

  addTextArea(name, label, rows = 4, placeholder = '') {
    this.form.fields.push({
      type: 'textarea',
      name,
      label,
      rows,
      placeholder
    });
    return this;
  }

  addSelectField(name, label, options) {
    this.form.fields.push({
      type: 'select',
      name,
      label,
      options
    });
    return this;
  }

  addSubmitButton(value) {
    this.form.buttons.push({
      type: 'submit',
      value
    });
    return this;
  }

  addResetButton(value) {
    this.form.buttons.push({
      type: 'reset',
      value
    });
    return this;
  }

  getFormHTML() {
    let html = `<form action="${this.form.action}" method="${this.form.method}">\n`;
    
    // 添加字段
    this.form.fields.forEach(field => {
      html += `  <div class="form-group">\n`;
      html += `    <label for="${field.name}">${field.label}</label>\n`;
      
      switch(field.type) {
        case 'textarea':
          html += `    <textarea id="${field.name}" name="${field.name}" rows="${field.rows}" placeholder="${field.placeholder}"></textarea>\n`;
          break;
        case 'select':
          html += `    <select id="${field.name}" name="${field.name}">\n`;
          field.options.forEach(option => {
            html += `      <option value="${option.value}">${option.text}</option>\n`;
          });
          html += `    </select>\n`;
          break;
        default:
          html += `    <input type="${field.type}" id="${field.name}" name="${field.name}" placeholder="${field.placeholder}">\n`;
      }
      
      html += `  </div>\n`;
    });
    
    // 添加按钮
    this.form.buttons.forEach(button => {
      html += `  <button type="${button.type}">${button.value}</button>\n`;
    });
    
    html += `</form>`;
    
    return html;
  }
}

// 使用表单构建器
console.log('\n\n使用建造者模式构建表单:');
const formBuilder = new FormBuilder();
const loginForm = formBuilder
  .setAction('/login')
  .setMethod('POST')
  .addEmailField('email', '电子邮箱', '请输入您的邮箱地址')
  .addPasswordField('password', '密码', '请输入您的密码')
  .addSubmitButton('登录')
  .addResetButton('重置')
  .getFormHTML();

console.log(loginForm);
```

### 5.4 应用场景

建造者模式适用于以下场景：

- 当创建复杂对象的算法应该独立于该对象的组成部分以及它们的装配方式时
- 当构造过程必须允许被构造的对象有不同的表示时
- 当对象的创建涉及多个步骤，并且这些步骤需要按照特定顺序执行时
- 当需要构建的对象具有多个可选组件，且构建过程较为复杂时

常见的应用场景包括：
- 构建复杂的UI组件
- 构建配置对象
- 构建文档或报表
- 构建API请求
- 构建数据库查询

### 5.5 优缺点

**优点：**
- 分离复杂对象的构建和表示
- 允许使用相同的构建过程创建不同的表示
- 提供了对构建步骤的精确控制
- 隐藏了产品的内部结构
- 容易扩展新的产品变体

**缺点：**
- 增加了系统的复杂度，需要创建多个新类
- 当产品种类很多时，可能会导致建造者类爆炸
- 构建过程的更改可能会影响所有的建造者

### 5.6 变体

建造者模式的变体：

- **流畅接口**：使用链式调用使API更加简洁
- **静态工厂方法**：在产品类中提供静态工厂方法创建建造者
- **参数对象模式**：使用一个参数对象传递多个参数
- **分步构建**：将构建过程分为多个步骤

## 6. 原型模式 (Prototype)

### 6.1 意图

用原型实例指定创建对象的种类，并且通过拷贝这些原型创建新的对象。

### 6.2 结构

原型模式包含以下角色：

- **原型 (Prototype)**：声明一个克隆自身的接口
- **具体原型 (ConcretePrototype)**：实现克隆自身的方法
- **客户端 (Client)**：使用原型对象创建新的对象

### 6.3 实现示例

```javascript
// 原型接口
class Prototype {
  clone() {
    throw new Error('子类必须实现clone方法');
  }
}

// 具体原型：用户类
class User extends Prototype {
  constructor(name, email, role = 'user') {
    super();
    this.name = name;
    this.email = email;
    this.role = role;
    this.createdAt = new Date().toISOString();
    this.settings = {
      notifications: true,
      theme: 'light',
      language: 'en'
    };
  }

  // 深拷贝实现
  clone() {
    // 创建新对象并复制基本属性
    const clone = new User(this.name, this.email, this.role);
    // 深拷贝嵌套对象
    clone.settings = JSON.parse(JSON.stringify(this.settings));
    // 复制创建时间
    clone.createdAt = this.createdAt;
    return clone;
  }

  // 修改设置的方法
  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    return this;
  }

  // 显示用户信息
  displayInfo() {
    return {
      name: this.name,
      email: this.email,
      role: this.role,
      createdAt: this.createdAt,
      settings: this.settings
    };
  }
}

// JavaScript原生实现（使用Object.create）
class UserPrototype {
  constructor(prototype) {
    this.prototype = prototype;
  }

  create() {
    // 使用Object.create创建原型的浅拷贝
    return Object.create(this.prototype);
  }
}

// 客户端代码 - 使用自定义clone方法
function testCustomClone() {
  console.log('测试自定义clone方法:');
  
  // 创建原型
  const adminPrototype = new User('Admin', 'admin@example.com', 'admin');
  adminPrototype.updateSettings({ theme: 'dark', language: 'zh' });
  
  console.log('原型用户:');
  console.log(adminPrototype.displayInfo());
  
  // 克隆原型创建新用户
  const admin1 = adminPrototype.clone();
  admin1.name = '管理员1';
  admin1.email = 'admin1@example.com';
  
  const admin2 = adminPrototype.clone();
  admin2.name = '管理员2';
  admin2.email = 'admin2@example.com';
  admin2.updateSettings({ notifications: false });
  
  console.log('\n克隆的管理员1:');
  console.log(admin1.displayInfo());
  
  console.log('\n克隆的管理员2（修改了设置）:');
  console.log(admin2.displayInfo());
  
  console.log('\n验证原型和克隆的独立性:');
  console.log('原型设置 === 管理员1设置:', adminPrototype.settings === admin1.settings);
  console.log('原型设置 === 管理员2设置:', adminPrototype.settings === admin2.settings);
}

// 客户端代码 - 使用Object.create
function testObjectCreate() {
  console.log('\n测试Object.create实现原型模式:');
  
  // 定义原型对象
  const userPrototype = {
    name: 'Guest',
    role: 'user',
    settings: {
      notifications: true,
      theme: 'light'
    },
    sayHello: function() {
      return `Hello, I'm ${this.name}, a ${this.role}`;
    },
    updateSettings: function(newSettings) {
      this.settings = { ...this.settings, ...newSettings };
    }
  };
  
  // 创建原型管理器
  const userPrototypeManager = new UserPrototype(userPrototype);
  
  // 创建新对象
  const user1 = userPrototypeManager.create();
  user1.name = '用户1';
  user1.email = 'user1@example.com';
  
  const user2 = userPrototypeManager.create();
  user2.name = '用户2';
  user2.email = 'user2@example.com';
  user2.role = 'editor';
  user2.updateSettings({ theme: 'dark' });
  
  console.log('用户1:', user1);
  console.log('用户1问候:', user1.sayHello());
  
  console.log('\n用户2:', user2);
  console.log('用户2问候:', user2.sayHello());
  
  console.log('\n验证原型链:');
  console.log('用户1是基于原型创建的:', Object.getPrototypeOf(user1) === userPrototype);
  console.log('用户2是基于原型创建的:', Object.getPrototypeOf(user2) === userPrototype);
  
  // 注意Object.create是浅拷贝，修改嵌套对象会影响原型
  console.log('原型设置修改前:', userPrototype.settings);
  user1.settings.theme = 'blue'; // 这会修改原型中的settings
  console.log('用户1修改设置后原型设置:', userPrototype.settings);
}

// 原型管理器 - 注册和获取多个原型
class PrototypeRegistry {
  constructor() {
    this.prototypeMap = new Map();
  }

  // 注册原型
  registerPrototype(key, prototype) {
    this.prototypeMap.set(key, prototype);
    return this;
  }

  // 获取原型
  getPrototype(key) {
    const prototype = this.prototypeMap.get(key);
    if (!prototype) {
      throw new Error(`未找到键为 '${key}' 的原型`);
    }
    return prototype.clone(); // 返回原型的克隆
  }

  // 列出所有可用原型键
  listPrototypes() {
    return Array.from(this.prototypeMap.keys());
  }
}

// 测试原型管理器
function testPrototypeRegistry() {
  console.log('\n测试原型管理器:');
  
  // 创建原型
  const basicUser = new User('Basic User', 'basic@example.com');
  const premiumUser = new User('Premium User', 'premium@example.com', 'premium');
  premiumUser.updateSettings({ theme: 'dark', notifications: true });
  
  const adminUser = new User('Admin User', 'admin@example.com', 'admin');
  adminUser.updateSettings({ theme: 'system', notifications: true, advancedControls: true });
  
  // 创建并配置原型管理器
  const registry = new PrototypeRegistry();
  registry.registerPrototype('basic', basicUser)
          .registerPrototype('premium', premiumUser)
          .registerPrototype('admin', adminUser);
  
  console.log('可用原型:', registry.listPrototypes());
  
  // 使用原型创建实例
  const newBasic = registry.getPrototype('basic');
  newBasic.name = '张三';
  newBasic.email = 'zhangsan@example.com';
  
  const newPremium = registry.getPrototype('premium');
  newPremium.name = '李四';
  newPremium.email = 'lisi@example.com';
  
  const newAdmin = registry.getPrototype('admin');
  newAdmin.name = '王五';
  newAdmin.email = 'wangwu@example.com';
  
  console.log('\n新创建的基本用户:');
  console.log(newBasic.displayInfo());
  
  console.log('\n新创建的高级用户:');
  console.log(newPremium.displayInfo());
  
  console.log('\n新创建的管理员用户:');
  console.log(newAdmin.displayInfo());
}

// 执行所有测试
testCustomClone();
testObjectCreate();
testPrototypeRegistry();

// 实际应用场景：文档模板系统
class DocumentTemplate extends Prototype {
  constructor(title = 'Untitled', content = '', style = {}, metadata = {}) {
    super();
    this.title = title;
    this.content = content;
    this.style = { ...style };
    this.metadata = { ...metadata };
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  clone() {
    const clone = new DocumentTemplate(
      this.title,
      this.content,
      { ...this.style },
      { ...this.metadata }
    );
    clone.createdAt = new Date().toISOString(); // 新文档有新的创建时间
    clone.updatedAt = new Date().toISOString();
    return clone;
  }

  updateContent(newContent) {
    this.content = newContent;
    this.updatedAt = new Date().toISOString();
    return this;
  }

  updateTitle(newTitle) {
    this.title = newTitle;
    this.updatedAt = new Date().toISOString();
    return this;
  }

  updateStyle(newStyle) {
    this.style = { ...this.style, ...newStyle };
    this.updatedAt = new Date().toISOString();
    return this;
  }

  updateMetadata(newMetadata) {
    this.metadata = { ...this.metadata, ...newMetadata };
    this.updatedAt = new Date().toISOString();
    return this;
  }
}

// 使用文档模板系统
console.log('\n\n使用原型模式实现文档模板系统:');

// 创建文档模板
const reportTemplate = new DocumentTemplate(
  '月度报告模板',
  '# 报告标题\n\n## 1. 摘要\n\n## 2. 详细内容\n\n## 3. 结论\n\n## 4. 建议\n',
  { fontSize: 12, fontFamily: 'Arial', lineSpacing: 1.5 },
  { category: 'report', author: 'System', version: '1.0' }
);

const letterTemplate = new DocumentTemplate(
  '正式信函模板',
  '尊敬的[收件人],\n\n正文内容...\n\n此致\n敬礼\n\n[发件人]\n[日期]\n',
  { fontSize: 11, fontFamily: 'Times New Roman', lineSpacing: 1.15 },
  { category: 'letter', author: 'System', version: '1.0' }
);

// 使用模板创建文档
const julyReport = reportTemplate.clone();
julyReport.updateTitle('2023年7月销售报告')
         .updateContent('# 2023年7月销售报告\n\n## 1. 摘要\n本月销售额达100万元，同比增长15%。\n\n## 2. 详细内容\n- 产品A销售额: 50万元\n- 产品B销售额: 30万元\n- 产品C销售额: 20万元\n\n## 3. 结论\n整体销售情况良好，产品A表现突出。\n\n## 4. 建议\n加大产品B的市场推广力度。\n')
         .updateMetadata({ author: '销售部', department: 'Sales' });

const welcomeLetter = letterTemplate.clone();
welcomeLetter.updateTitle('欢迎加入我们')
             .updateContent('尊敬的新员工,\n\n欢迎加入我们的团队！\n\n您的入职日期为：2023年8月1日\n您的直属主管：张三\n\n如有任何疑问，请随时联系人力资源部。\n\n此致\n敬礼\n\n人力资源部\n2023年7月25日\n')
             .updateMetadata({ recipient: 'New Employee', template: 'welcome' });

console.log('七月销售报告:');
console.log('标题:', julyReport.title);
console.log('创建时间:', julyReport.createdAt);
console.log('更新时间:', julyReport.updatedAt);
console.log('内容预览:', julyReport.content.substring(0, 50) + '...');
console.log('样式:', julyReport.style);
console.log('元数据:', julyReport.metadata);

console.log('\n欢迎信函:');
console.log('标题:', welcomeLetter.title);
console.log('创建时间:', welcomeLetter.createdAt);
console.log('内容预览:', welcomeLetter.content.substring(0, 50) + '...');
console.log('样式:', welcomeLetter.style);
console.log('元数据:', welcomeLetter.metadata);
```

### 6.4 应用场景

原型模式适用于以下场景：

- 当一个系统应该独立于它的产品创建、组合和表示时
- 当要实例化的类是在运行时指定的，例如通过动态加载
- 为了避免创建一个与产品类层次平行的工厂类层次时
- 当一个类的实例只能有几个不同状态组合中的一种时。建立相应数目的原型并克隆它们可能比每次用合适的状态手动实例化该类更方便

常见的应用场景包括：
- 对象的初始化开销较大
- 需要避免创建与产品类层次相同的工厂类层次
- 动态加载类库中的类
- 创建相似对象，只需要少量属性不同

### 6.5 优缺点

**优点：**
- 避免了创建和初始化新对象的开销
- 简化了对象创建的代码
- 允许在运行时添加或删除产品类
- 提供了一种灵活的对象创建机制

**缺点：**
- 克隆复杂对象（特别是具有循环引用的对象）可能很困难
- 深拷贝和浅拷贝的处理可能会导致问题
- 需要为每个可克隆类实现克隆方法

### 6.6 变体

原型模式的变体：

- **简单原型**：只提供基本的克隆功能
- **原型管理器**：维护一组原型，根据需要克隆
- **注册表原型**：使用注册表存储和检索原型
- **动态原型**：允许在运行时修改原型

## 7. 对象池模式 (Object Pool)

### 7.1 意图

预先创建一组对象并在需要时重用它们，而不是频繁地创建和销毁对象，以提高性能和资源利用率。

### 7.2 结构

对象池模式包含以下角色：

- **对象池 (ObjectPool)**：管理对象池，负责对象的创建、获取和归还
- **池对象 (PoolObject)**：从池中获取和归还的对象，通常需要实现重置状态的方法

### 7.3 实现示例

```javascript
// 池对象接口
class PoolObject {
  reset() {
    throw new Error('子类必须实现reset方法');
  }
}

// 具体池对象：数据库连接
class DatabaseConnection extends PoolObject {
  constructor(connectionString) {
    super();
    this.connectionString = connectionString || 'default-connection';
    this.isOpen = true;
    this.lastUsed = new Date();
    this.queriesExecuted = 0;
    console.log(`创建数据库连接: ${this.connectionString}`);
  }

  // 执行查询
  executeQuery(query) {
    if (!this.isOpen) {
      throw new Error('连接已关闭，无法执行查询');
    }
    this.lastUsed = new Date();
    this.queriesExecuted++;
    return `查询结果: "${query}" - 来自连接 ${this.connectionString}`;
  }

  // 关闭连接
  close() {
    this.isOpen = false;
    console.log(`关闭数据库连接: ${this.connectionString}`);
  }

  // 重置连接状态
  reset() {
    console.log(`重置数据库连接: ${this.connectionString}`);
    this.lastUsed = new Date();
    this.queriesExecuted = 0;
    return this;
  }
}

// 对象池类
class ObjectPool {
  constructor(objectType, minSize = 3, maxSize = 10, createParams = {}) {
    this.objectType = objectType;
    this.minSize = minSize;
    this.maxSize = maxSize;
    this.createParams = createParams;
    this.availableObjects = [];
    this.inUseObjects = new Set();
    this.totalCreated = 0;
    
    // 初始化池中对象
    this.initializePool();
  }

  // 初始化对象池
  initializePool() {
    console.log(`初始化对象池，最小容量: ${this.minSize}`);
    for (let i = 0; i < this.minSize; i++) {
      const obj = this.createObject();
      this.availableObjects.push(obj);
    }
  }

  // 创建新对象
  createObject() {
    if (this.totalCreated >= this.maxSize) {
      throw new Error('已达到最大对象数量限制');
    }
    const obj = new this.objectType(this.createParams);
    this.totalCreated++;
    return obj;
  }

  // 从池中获取对象
  acquire() {
    let obj;
    
    // 尝试从可用对象中获取
    if (this.availableObjects.length > 0) {
      obj = this.availableObjects.pop();
    } else {
      // 如果没有可用对象且未达到最大数量限制，创建新对象
      if (this.totalCreated < this.maxSize) {
        obj = this.createObject();
      } else {
        // 如果已达到最大数量限制，则等待（实际应用中可能需要使用更复杂的等待策略）
        console.log('对象池已满，等待对象释放...');
        // 简单实现：等待1秒后重试
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(this.acquire());
          }, 1000);
        });
      }
    }
    
    // 将对象添加到使用中集合
    this.inUseObjects.add(obj);
    return obj;
  }

  // 将对象归还到池中
  release(obj) {
    if (!this.inUseObjects.has(obj)) {
      console.warn('尝试释放未从池中获取的对象');
      return false;
    }
    
    // 重置对象状态
    obj.reset();
    
    // 从使用中集合移除，添加到可用对象中
    this.inUseObjects.delete(obj);
    this.availableObjects.push(obj);
    
    // 清理多余对象（保持池中对象数量不超过最小值）
    this.shrinkPool();
    
    return true;
  }

  // 缩小对象池大小到最小值
  shrinkPool() {
    while (this.availableObjects.length > this.minSize) {
      const obj = this.availableObjects.pop();
      if (typeof obj.close === 'function') {
        obj.close();
      }
      this.totalCreated--;
    }
  }

  // 获取池统计信息
  getStats() {
    return {
      totalCreated: this.totalCreated,
      available: this.availableObjects.length,
      inUse: this.inUseObjects.size,
      minSize: this.minSize,
      maxSize: this.maxSize
    };
  }

  // 关闭所有对象并清空池
  closeAll() {
    console.log('关闭对象池，释放所有资源');
    
    // 关闭可用对象
    while (this.availableObjects.length > 0) {
      const obj = this.availableObjects.pop();
      if (typeof obj.close === 'function') {
        obj.close();
      }
    }
    
    // 关闭使用中的对象
    for (const obj of this.inUseObjects) {
      if (typeof obj.close === 'function') {
        obj.close();
      }
    }
    
    // 重置池状态
    this.inUseObjects.clear();
    this.totalCreated = 0;
  }
}

// 客户端代码
async function testObjectPool() {
  console.log('测试对象池模式:');
  
  // 创建数据库连接池
  const connectionPool = new ObjectPool(DatabaseConnection, 2, 5, 'mysql://localhost:3306/test');
  console.log('初始池统计:', connectionPool.getStats());
  
  // 获取连接并使用
  console.log('\n获取并使用连接:');
  const conn1 = await connectionPool.acquire();
  console.log(conn1.executeQuery('SELECT * FROM users'));
  
  const conn2 = await connectionPool.acquire();
  console.log(conn2.executeQuery('SELECT * FROM products'));
  
  // 此时应该已创建了最小数量的连接
  console.log('\n获取两个连接后池统计:', connectionPool.getStats());
  
  // 归还一个连接
  console.log('\n归还一个连接:');
  connectionPool.release(conn1);
  console.log('归还后池统计:', connectionPool.getStats());
  
  // 获取更多连接，超过最小数量
  console.log('\n获取更多连接:');
  const conn3 = await connectionPool.acquire(); // 应该复用归还的连接
  console.log(conn3.executeQuery('SELECT * FROM orders'));
  
  const conn4 = await connectionPool.acquire(); // 创建新连接
  console.log(conn4.executeQuery('SELECT * FROM customers'));
  
  const conn5 = await connectionPool.acquire(); // 创建新连接
  console.log(conn5.executeQuery('SELECT * FROM payments'));
  
  console.log('\n获取多个连接后池统计:', connectionPool.getStats());
  
  // 尝试获取超过最大数量的连接
  console.log('\n尝试获取超过最大数量的连接:');
  try {
    const conn6 = await connectionPool.acquire();
    console.log('获取了第六个连接:', conn6);
  } catch (error) {
    console.log('错误:', error.message);
  }
  
  // 归还所有连接
  console.log('\n归还所有连接:');
  connectionPool.release(conn2);
  connectionPool.release(conn3);
  connectionPool.release(conn4);
  connectionPool.release(conn5);
  
  // 池会缩小到最小大小
  console.log('\n归还所有连接后池统计:', connectionPool.getStats());
  
  // 关闭对象池
  console.log('\n关闭对象池:');
  connectionPool.closeAll();
  console.log('关闭后池统计:', connectionPool.getStats());
}

// 实际应用场景：游戏中的子弹对象池
class Bullet extends PoolObject {
  constructor() {
    super();
    this.x = 0;
    this.y = 0;
    this.speed = 0;
    this.direction = 0;
    this.active = false;
    console.log('创建子弹对象');
  }

  // 初始化子弹
  init(x, y, speed, direction) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.direction = direction;
    this.active = true;
    return this;
  }

  // 更新子弹位置
  update(deltaTime) {
    if (!this.active) return;
    
    const radians = (this.direction * Math.PI) / 180;
    this.x += Math.cos(radians) * this.speed * deltaTime;
    this.y += Math.sin(radians) * this.speed * deltaTime;
  }

  // 渲染子弹
  render() {
    if (!this.active) return;
    console.log(`渲染子弹: 位置(${this.x.toFixed(2)}, ${this.y.toFixed(2)})`);
  }

  // 禁用子弹
  disable() {
    this.active = false;
  }

  // 重置子弹状态
  reset() {
    console.log('重置子弹状态');
    this.x = 0;
    this.y = 0;
    this.speed = 0;
    this.direction = 0;
    this.active = false;
    return this;
  }
}

// 测试游戏子弹池
function testBulletPool() {
  console.log('\n\n测试游戏子弹对象池:');
  
  // 创建子弹池
  const bulletPool = new ObjectPool(Bullet, 5, 20);
  console.log('子弹池初始状态:', bulletPool.getStats());
  
  // 获取并初始化子弹
  console.log('\n发射子弹:');
  const bullets = [];
  
  for (let i = 0; i < 8; i++) {
    const bullet = bulletPool.acquire();
    bullet.init(
      Math.random() * 800,
      Math.random() * 600,
      100 + Math.random() * 200,
      Math.random() * 360
    );
    bullets.push(bullet);
  }
  
  console.log('发射子弹后池状态:', bulletPool.getStats());
  
  // 更新并渲染子弹
  console.log('\n更新并渲染子弹:');
  const deltaTime = 0.016; // 约60FPS
  
  bullets.forEach((bullet, index) => {
    bullet.update(deltaTime);
    bullet.update(deltaTime); // 更新两次模拟移动
    bullet.render();
    
    // 随机禁用一些子弹（模拟击中目标或出界）
    if (Math.random() > 0.5) {
      bullet.disable();
      console.log(`子弹${index}被禁用`);
    }
  });
  
  // 归还禁用的子弹
  console.log('\n归还禁用的子弹:');
  bullets.forEach(bullet => {
    if (!bullet.active) {
      bulletPool.release(bullet);
    }
  });
  
  console.log('归还后池状态:', bulletPool.getStats());
  
  // 模拟游戏继续进行，获取更多子弹
  console.log('\n游戏继续，发射更多子弹:');
  const newBullets = [];
  
  for (let i = 0; i < 5; i++) {
    const bullet = bulletPool.acquire();
    bullet.init(
      400,
      300,
      150,
      i * 45 // 不同角度
    );
    newBullets.push(bullet);
    bullet.render();
  }
  
  console.log('再次发射后池状态:', bulletPool.getStats());
  
  // 游戏结束，关闭对象池
  console.log('\n游戏结束，关闭子弹池:');
  bulletPool.closeAll();
  console.log('关闭后池状态:', bulletPool.getStats());
}

// 执行测试
testObjectPool();
testBulletPool();
```

### 7.4 应用场景

对象池模式适用于以下场景：

- 创建和销毁对象的开销很大
- 对象的使用具有间歇性，需要频繁创建和销毁
- 系统中有大量短暂存活的对象
- 资源有限，需要复用对象

常见的应用场景包括：
- 数据库连接池
- 线程池
- 游戏中的粒子系统
- HTTP连接池
- 图形渲染中的对象池

### 7.5 优缺点

**优点：**
- 减少了创建和销毁对象的开销
- 提高了系统性能
- 避免了内存碎片
- 更好地控制资源使用

**缺点：**
- 对象池的管理增加了系统的复杂度
- 如果池中的对象没有正确重置，可能会导致状态污染
- 池大小的设置需要根据实际情况进行调整
- 在低对象创建开销的场景中，可能不会带来明显的性能提升

### 7.6 变体

对象池模式的变体：

- **固定大小对象池**：池的大小在初始化后不可变
- **弹性对象池**：池的大小可以根据需要动态调整
- **软引用对象池**：使用软引用存储对象，允许在内存不足时被垃圾回收
- **有界对象池**：限制池的最大大小

## 8. 多例模式 (Multiton)

### 8.1 意图

确保一个类有有限数量的实例，并提供一个全局访问点来获取这些实例。

### 8.2 结构

多例模式包含以下角色：

- **多例类 (Multiton)**：管理多个实例，根据键来返回相应的实例

### 8.3 实现示例

```javascript
// 多例模式实现
class Multiton {
  // 私有静态属性存储实例
  static #instances = new Map();
  // 私有实例键
  #key;
  // 私有数据属性
  #data;
  
  // 私有构造函数
  constructor(key) {
    if (Multiton.#instances.has(key)) {
      return Multiton.#instances.get(key);
    }
    this.#key = key;
    this.#data = {};
    // 存储实例
    Multiton.#instances.set(key, this);
    console.log(`创建多例实例: ${key}`);
  }
  
  // 静态获取实例方法
  static getInstance(key) {
    if (!key) {
      throw new Error('必须提供有效的键');
    }
    
    if (!Multiton.#instances.has(key)) {
      // 如果实例不存在，则创建
      new Multiton(key);
    }
    
    return Multiton.#instances.get(key);
  }
  
  // 获取键
  getKey() {
    return this.#key;
  }
  
  // 设置数据
  setData(key, value) {
    this.#data[key] = value;
    return this;
  }
  
  // 获取数据
  getData(key) {
    return this.#data[key];
  }
  
  // 获取所有数据
  getAllData() {
    return { ...this.#data };
  }
  
  // 清除指定键的数据
  clearData(key) {
    if (key) {
      delete this.#data[key];
    } else {
      this.#data = {};
    }
    return this;
  }
  
  // 静态方法：获取所有实例的键
  static getAllKeys() {
    return Array.from(Multiton.#instances.keys());
  }
  
  // 静态方法：获取实例数量
  static getInstanceCount() {
    return Multiton.#instances.size;
  }
  
  // 静态方法：删除特定实例
  static removeInstance(key) {
    return Multiton.#instances.delete(key);
  }
  
  // 静态方法：清除所有实例
  static clearAllInstances() {
    const count = Multiton.#instances.size;
    Multiton.#instances.clear();
    return count;
  }
}

// 客户端代码
function testBasicMultiton() {
  console.log('测试基本多例模式:');
  
  // 获取实例A
  const instanceA = Multiton.getInstance('A');
  instanceA.setData('name', '实例A').setData('value', 100);
  
  // 再次获取实例A（应该返回相同实例）
  const anotherInstanceA = Multiton.getInstance('A');
  console.log('实例A和另一个实例A是否相同:', instanceA === anotherInstanceA);
  console.log('实例A数据:', instanceA.getAllData());
  
  // 获取实例B
  const instanceB = Multiton.getInstance('B');
  instanceB.setData('name', '实例B').setData('value', 200);
  
  // 获取实例C
  const instanceC = Multiton.getInstance('C');
  instanceC.setData('name', '实例C').setData('value', 300);
  
  console.log('\n所有多例实例键:', Multiton.getAllKeys());
  console.log('实例数量:', Multiton.getInstanceCount());
  console.log('实例B数据:', instanceB.getAllData());
  console.log('实例C数据:', instanceC.getAllData());
  
  // 删除特定实例
  console.log('\n删除实例B:');
  Multiton.removeInstance('B');
  console.log('删除后实例数量:', Multiton.getInstanceCount());
  console.log('删除后所有键:', Multiton.getAllKeys());
  
  // 再次获取已删除的实例B（应该创建新实例）
  console.log('\n重新获取实例B:');
  const newInstanceB = Multiton.getInstance('B');
  newInstanceB.setData('name', '新实例B').setData('value', 250);
  console.log('实例数量:', Multiton.getInstanceCount());
  console.log('新实例B数据:', newInstanceB.getAllData());
  
  // 清除所有实例
  console.log('\n清除所有实例:');
  const clearedCount = Multiton.clearAllInstances();
  console.log(`已清除 ${clearedCount} 个实例`);
  console.log('清除后实例数量:', Multiton.getInstanceCount());
}

// 实际应用场景：数据库连接管理器
class DatabaseConnectionManager {
  // 私有静态属性存储不同数据库的连接
  static #connections = new Map();
  
  // 私有构造函数
  constructor(dbType) {
    if (DatabaseConnectionManager.#connections.has(dbType)) {
      return DatabaseConnectionManager.#connections.get(dbType);
    }
    
    this.dbType = dbType;
    this.connectionPool = [];
    this.status = 'disconnected';
    
    console.log(`创建${dbType}数据库连接管理器`);
    DatabaseConnectionManager.#connections.set(dbType, this);
  }
  
  // 静态获取数据库连接管理器实例
  static getConnectionManager(dbType) {
    if (!dbType) {
      throw new Error('必须指定数据库类型');
    }
    
    if (!DatabaseConnectionManager.#connections.has(dbType)) {
      new DatabaseConnectionManager(dbType);
    }
    
    return DatabaseConnectionManager.#connections.get(dbType);
  }
  
  // 连接到数据库
  connect(config = {}) {
    console.log(`连接到${this.dbType}数据库，配置:`, config);
    this.status = 'connected';
    // 在实际应用中，这里会创建连接池
    this.connectionPool = [`${this.dbType}-conn-1`, `${this.dbType}-conn-2`];
    return this;
  }
  
  // 断开连接
  disconnect() {
    console.log(`断开${this.dbType}数据库连接`);
    this.status = 'disconnected';
    this.connectionPool = [];
    return this;
  }
  
  // 执行查询
  executeQuery(query) {
    if (this.status !== 'connected') {
      throw new Error(`${this.dbType}数据库未连接`);
    }
    console.log(`${this.dbType}执行查询:`, query);
    // 返回模拟结果
    return { type: this.dbType, query, result: '模拟查询结果' };
  }
  
  // 获取状态
  getStatus() {
    return this.status;
  }
  
  // 获取连接池信息
  getPoolInfo() {
    return {
      dbType: this.dbType,
      status: this.status,
      connectionCount: this.connectionPool.length,
      connections: this.connectionPool
    };
  }
}

// 测试数据库连接管理器
function testDatabaseConnectionManager() {
  console.log('\n\n测试数据库连接管理器:');
  
  // 获取MySQL连接管理器
  const mysqlManager = DatabaseConnectionManager.getConnectionManager('MySQL');
  mysqlManager.connect({ host: 'localhost', port: 3306, user: 'root' });
  
  // 获取PostgreSQL连接管理器
  const pgManager = DatabaseConnectionManager.getConnectionManager('PostgreSQL');
  pgManager.connect({ host: 'localhost', port: 5432, user: 'postgres' });
  
  // 执行查询
  console.log('\n执行数据库查询:');
  console.log(mysqlManager.executeQuery('SELECT * FROM users'));
  console.log(pgManager.executeQuery('SELECT * FROM products'));
  
  // 获取连接池信息
  console.log('\nMySQL连接池信息:', mysqlManager.getPoolInfo());
  console.log('PostgreSQL连接池信息:', pgManager.getPoolInfo());
  
  // 断开MySQL连接
  console.log('\n断开MySQL连接:');
  mysqlManager.disconnect();
  console.log('MySQL状态:', mysqlManager.getStatus());
  
  // 尝试在断开连接后执行查询
  try {
    mysqlManager.executeQuery('SELECT * FROM orders');
  } catch (error) {
    console.log('错误:', error.message);
  }
  
  // 再次连接MySQL
  console.log('\n重新连接MySQL:');
  mysqlManager.connect({ host: 'localhost', port: 3306 });
  console.log('MySQL状态:', mysqlManager.getStatus());
}

// 测试多语言翻译管理器
class TranslationManager {
  // 私有静态属性存储不同语言的翻译器
  static #translators = new Map();
  
  // 私有构造函数
  constructor(language) {
    if (TranslationManager.#translators.has(language)) {
      return TranslationManager.#translators.get(language);
    }
    
    this.language = language;
    this.translations = {};
    
    console.log(`创建${language}翻译管理器`);
    TranslationManager.#translators.set(language, this);
  }
  
  // 静态获取翻译管理器实例
  static getTranslator(language) {
    if (!language) {
      language = 'en'; // 默认英语
    }
    
    if (!TranslationManager.#translators.has(language)) {
      new TranslationManager(language);
    }
    
    return TranslationManager.#translators.get(language);
  }
  
  // 加载翻译
  loadTranslations(translations) {
    this.translations = { ...this.translations, ...translations };
    return this;
  }
  
  // 翻译文本
  translate(key, variables = {}) {
    let translation = this.translations[key] || key; // 如果没有翻译，返回键本身
    
    // 替换变量
    Object.keys(variables).forEach(varName => {
      translation = translation.replace(`{{${varName}}}`, variables[varName]);
    });
    
    return translation;
  }
  
  // 获取所有翻译键
  getTranslationKeys() {
    return Object.keys(this.translations);
  }
  
  // 检查是否有特定键的翻译
  hasTranslation(key) {
    return Object.prototype.hasOwnProperty.call(this.translations, key);
  }
}

// 测试翻译管理器
function testTranslationManager() {
  console.log('\n\n测试翻译管理器:');
  
  // 获取英语翻译器
  const enTranslator = TranslationManager.getTranslator('en');
  enTranslator.loadTranslations({
    'greeting': 'Hello, {{name}}!',
    'welcome': 'Welcome to our website!',
    'goodbye': 'Goodbye!',
    'thanks': 'Thank you!'
  });
  
  // 获取中文翻译器
  const zhTranslator = TranslationManager.getTranslator('zh');
  zhTranslator.loadTranslations({
    'greeting': '你好，{{name}}！',
    'welcome': '欢迎访问我们的网站！',
    'goodbye': '再见！',
    'thanks': '谢谢！'
  });
  
  // 获取西班牙语翻译器
  const esTranslator = TranslationManager.getTranslator('es');
  esTranslator.loadTranslations({
    'greeting': '¡Hola, {{name}}!',
    'welcome': '¡Bienvenido a nuestro sitio web!',
    'goodbye': '¡Adiós!'
    // 注意：西班牙语翻译器没有"thanks"的翻译
  });
  
  // 进行翻译
  console.log('\n英语翻译:');
  console.log(enTranslator.translate('greeting', { name: 'John' }));
  console.log(enTranslator.translate('welcome'));
  
  console.log('\n中文翻译:');
  console.log(zhTranslator.translate('greeting', { name: '张三' }));
  console.log(zhTranslator.translate('thanks'));
  
  console.log('\n西班牙语翻译:');
  console.log(esTranslator.translate('greeting', { name: 'Juan' }));
  console.log(esTranslator.translate('goodbye'));
  console.log('翻译不存在的键:', esTranslator.translate('thanks'));
  
  // 检查翻译是否存在
  console.log('\n西班牙语中是否有thanks的翻译:', esTranslator.hasTranslation('thanks'));
  console.log('英语中所有翻译键:', enTranslator.getTranslationKeys());
}

// 执行所有测试
testBasicMultiton();
testDatabaseConnectionManager();
testTranslationManager();

# 创建型设计模式总结

## 1. 创建型设计模式比较

| 设计模式 | 主要目的 | 优势 | 劣势 | 适用场景 |
|---------|---------|------|------|----------|
| 工厂方法 | 封装对象创建逻辑，提供接口 | 解耦，易于扩展 | 增加代码复杂度 | 产品种类固定但实现可变 |
| 抽象工厂 | 创建相关或依赖对象家族 | 确保产品一致性 | 难以扩展新产品族 | 需要创建一系列相关产品 |
| 单例模式 | 确保类只有一个实例 | 全局访问，控制实例化 | 违反单一职责原则 | 日志记录、配置管理等 |
| 建造者模式 | 分步创建复杂对象 | 控制构建过程，产品一致性 | 代码量较大 | 复杂对象的创建 |
| 原型模式 | 通过复制创建对象 | 避免构造函数限制 | 需要处理深拷贝问题 | 对象初始化开销大的场景 |
| 对象池模式 | 复用对象减少创建开销 | 性能优化，资源管理 | 增加复杂性 | 频繁创建销毁对象的场景 |
| 多例模式 | 限制类有有限数量实例 | 实例管理，资源控制 | 增加复杂度 | 数据库连接池、缓存等 |

## 2. 设计模式选择指南

### 根据需求选择合适的创建型模式

- **对象创建复杂且需要分步构建**：选择 **建造者模式**
- **对象创建逻辑需要封装和解耦**：选择 **工厂方法模式**
- **需要创建相关产品族**：选择 **抽象工厂模式**
- **需要确保全局唯一实例**：选择 **单例模式**
- **对象创建成本高需要复用**：选择 **原型模式** 或 **对象池模式**
- **需要控制有限数量的实例**：选择 **多例模式**

### 性能考虑

- 对于频繁创建销毁的对象，**对象池模式** 可以显著提高性能
- 对于初始化开销大的对象，**原型模式** 和 **单例模式** 可能更适合
- **工厂方法** 和 **抽象工厂** 在增加灵活性的同时会带来一定的性能开销

### 可维护性考虑

- **工厂方法** 和 **抽象工厂** 提高了代码的可维护性和扩展性
- **单例模式** 如果使用不当可能导致测试困难
- **建造者模式** 使复杂对象的创建更清晰，但会增加代码量

## 3. 创建型设计模式最佳实践

### 工厂相关模式

- **针对接口编程，不针对实现编程**：工厂方法应返回抽象产品类型
- **考虑使用组合而非继承**：可以在工厂中组合不同的创建策略
- **封装变化**：将产品创建的变化封装在工厂中，客户端代码保持稳定

### 单例模式

- **使用闭包或私有静态字段**：确保实例的私有性
- **考虑线程安全**：在多线程环境中使用适当的同步机制
- **避免过度使用**：不要将所有全局状态都放在单例中

### 建造者模式

- **使用流畅接口**：通过链式调用来提高API的易用性
- **验证构建过程**：在最终构建前验证必要参数
- **考虑使用Builder内部类**：将Builder作为产品类的静态内部类

### 原型模式

- **注意深拷贝和浅拷贝**：根据需求选择合适的复制方式
- **实现clone方法**：提供统一的复制接口
- **考虑循环引用问题**：在处理复杂对象结构时特别注意

### 对象池模式

- **设置合理的池大小**：根据实际需求调整池的容量
- **实现对象生命周期管理**：包括初始化、分配、回收和清理
- **考虑线程安全**：在并发环境中需要适当的同步机制

### 多例模式

- **使用有意义的键**：确保键能够清晰地标识不同的实例
- **实现资源限制**：可以设置最大实例数量的限制
- **提供实例管理方法**：如获取、删除、清理等操作

## 4. JavaScript中的特殊考虑

### 构造函数和类

- JavaScript中使用构造函数和ES6类来实现创建型模式
- 利用原型链特性可以更高效地实现原型模式

### 闭包的使用

- 闭包是实现私有变量和方法的强大工具
- 可以用于实现单例模式和工厂模式中的私有逻辑

### 函数式编程思想

- 函数作为一等公民，可以将创建逻辑封装在函数中
- 高阶函数可以用于实现更灵活的工厂模式

## 5. 创建型设计模式的未来趋势

### 依赖注入容器

- 现代框架中的依赖注入容器可以看作是高级工厂模式的应用
- 自动管理对象的创建、生命周期和依赖关系

### 工厂方法与函数式编程的结合

- 使用函数式编程中的函数组合、柯里化等技术增强工厂方法
- 使创建逻辑更灵活、更可组合

### 元编程

- 使用反射、装饰器等元编程技术来增强创建型模式
- 在运行时动态地修改或扩展对象的创建行为

### 领域驱动设计中的应用

- 在领域驱动设计中，创建型模式与领域模型紧密结合
- 实现复杂领域对象的创建和初始化

通过合理地运用这些创建型设计模式，我们可以构建出更加灵活、可维护和高效的JavaScript应用程序。每种模式都有其特定的适用场景和优势，选择合适的模式可以帮助我们解决各种复杂的对象创建问题。