# 单例模式（Singleton Pattern）

## 基本概念

单例模式是一种创建型设计模式，确保一个类只有一个实例，并提供一个全局访问点。

## 实现方式

### 1. 基本实现

```javascript
class Singleton {
    constructor() {
        if (Singleton.instance) {
            return Singleton.instance;
        }
        
        // 初始化代码
        this.data = 'Singleton instance data';
        Singleton.instance = this;
    }
    
    getData() {
        return this.data;
    }
    
    setData(newData) {
        this.data = newData;
    }
}

// 使用
const instance1 = new Singleton();
const instance2 = new Singleton();
console.log(instance1 === instance2); // true
```

### 2. 闭包实现

```javascript
const Singleton = (function() {
    let instance;
    
    function createInstance() {
        const object = { data: 'Singleton data' };
        return object;
    }
    
    return {
        getInstance: function() {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

// 使用
const instance1 = Singleton.getInstance();
const instance2 = Singleton.getInstance();
console.log(instance1 === instance2); // true
```

### 3. ES6 模块方式

```javascript
// singleton.js
class Singleton {
    constructor() {
        this.data = 'Singleton data';
    }
    
    getData() {
        return this.data;
    }
}

export default new Singleton();

// 使用
import singleton from './singleton';
// singleton始终指向同一个实例
```

## 使用场景

1. **全局配置对象**：如应用的主题、语言设置等
2. **数据库连接池**：避免创建过多连接
3. **日志记录器**：确保所有日志输出到同一位置
4. **缓存管理器**：统一管理缓存数据
5. **浏览器中的window对象**：全局唯一的对象

## 优缺点分析

### 优点

1. **内存优化**：避免创建重复对象，节省内存
2. **全局访问**：提供统一的访问点，方便使用
3. **控制资源**：集中管理资源的创建和销毁

### 缺点

1. **违背单一职责原则**：单例类既负责创建自己的实例，又负责业务逻辑
2. **难以测试**：依赖全局状态，可能影响测试的独立性
3. **可能导致代码耦合**：过度使用可能导致模块间强耦合
4. **不适合分布式系统**：在分布式环境中难以保证单例

## 常见问题与答案

### 1. 如何实现线程安全的单例模式？
**答案：** 在JavaScript中不存在真正的线程安全问题，但在其他语言中可以使用双重检查锁定或静态初始化块等方式确保线程安全。

### 2. 单例模式和全局变量有什么区别？
**答案：**
- 单例模式是受控的全局访问，全局变量是不受控的
- 单例模式可以延迟初始化，全局变量在定义时就初始化
- 单例模式可以有私有属性和方法，全局变量所有属性都是公开的

### 3. 如何避免单例模式的缺点？
**答案：**
- 尽量减少使用单例
- 将业务逻辑和单例创建分离
- 考虑使用依赖注入替代单例
- 对于测试，可以使用工厂模式或模拟对象

### 4. 单例模式在前端框架中的应用？
**答案：**
- Vue的Vuex/Pinia存储状态管理
- React的Context API（在某些使用方式下）
- Angular的服务（默认是单例的）