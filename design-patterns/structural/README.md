# 结构型设计模式完全指南

## 前言

结构型设计模式关注于如何将类和对象组合成更大的结构，以实现新的功能或解决特定的设计问题。这些模式帮助我们设计灵活且可重用的代码结构，使系统更加易于维护和扩展。

本指南将详细介绍JavaScript中常用的结构型设计模式，包括：

1. 适配器模式 (Adapter)
2. 桥接模式 (Bridge)
3. 组合模式 (Composite)
4. 装饰器模式 (Decorator)
5. 外观模式 (Facade)
6. 享元模式 (Flyweight)
7. 代理模式 (Proxy)
8. 过滤器模式 (Filter)
9. 管道模式 (Pipeline)
## 7. 代理模式 (Proxy)

### 7.1 意图

为另一个对象提供一个代理或占位符，以控制对这个对象的访问。

### 7.2 结构

代理模式包含以下角色：

- **抽象主题 (Subject)**：声明真实主题和代理的共同接口
- **真实主题 (RealSubject)**：实际执行业务逻辑的对象
- **代理 (Proxy)**：控制对真实主题的访问，并可能在访问前后执行一些额外操作

### 7.3 实现示例

```javascript
// 抽象主题：定义接口
class Subject {
  request() {
    throw new Error('子类必须实现request方法');
  }
}

// 真实主题：实际执行业务逻辑
class RealSubject extends Subject {
  request() {
    console.log('RealSubject: 处理请求');
    // 实际业务逻辑
    return '真实数据';
  }
}

// 代理：控制对真实主题的访问
class ProxySubject extends Subject {
  constructor(realSubject) {
    super();
    this.realSubject = realSubject || new RealSubject();
  }
  
  request() {
    // 在访问真实主题前执行一些操作
    if (this.checkAccess()) {
      console.log('Proxy: 准备访问真实主题');
      const result = this.realSubject.request();
      // 在访问真实主题后执行一些操作
      this.logAccess();
      return result;
    }
    return '访问被拒绝';
  }
  
  checkAccess() {
    console.log('Proxy: 检查访问权限');
    // 实际权限检查逻辑
    return true;
  }
  
  logAccess() {
    console.log('Proxy: 记录访问日志');
  }
}

// 客户端代码
function clientCode(subject) {
  console.log(clientCode.name);
  console.log(subject.request());
}

// 使用示例
console.log('不使用代理:');
clientCode(new RealSubject());

console.log('\n使用代理:');
clientCode(new ProxySubject(new RealSubject()));
```

### 7.4 代理模式的类型

#### 7.4.1 远程代理

代表位于不同地址空间的对象，常用于分布式系统。

```javascript
// 远程代理示例
class RemoteServiceProxy {
  constructor(url) {
    this.url = url;
  }
  
  async fetchData() {
    try {
      // 在实际场景中，这里会发送HTTP请求到远程服务器
      console.log(`发送请求到远程服务器: ${this.url}`);
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { data: '远程数据', status: 'success' };
    } catch (error) {
      console.error('远程请求失败:', error);
      throw error;
    }
  }
}

// 使用示例
const remoteProxy = new RemoteServiceProxy('https://api.example.com/data');
remoteProxy.fetchData()
  .then(data => console.log('获取到远程数据:', data))
  .catch(err => console.error('错误:', err));
```

#### 7.4.2 虚拟代理

根据需要创建开销很大的对象，实现延迟初始化。

```javascript
// 虚拟代理示例 - 图片懒加载
class ImageProxy {
  constructor(imageUrl) {
    this.imageUrl = imageUrl;
    this.realImage = null;
  }
  
  display() {
    if (this.realImage === null) {
      console.log('虚拟代理: 延迟加载图片');
      // 模拟图片加载过程
      this.realImage = new RealImage(this.imageUrl);
    }
    return this.realImage.display();
  }
}

class RealImage {
  constructor(imageUrl) {
    this.imageUrl = imageUrl;
    this.loadImage();
  }
  
  loadImage() {
    console.log(`加载图片: ${this.imageUrl}`);
    // 实际图片加载逻辑
  }
  
  display() {
    return `显示图片: ${this.imageUrl}`;
  }
}

// 使用示例
const imageProxy = new ImageProxy('https://example.com/large-image.jpg');
// 首次调用会触发图片加载
console.log(imageProxy.display());
// 再次调用不会重新加载图片
console.log(imageProxy.display());
```

#### 7.4.3 保护代理

控制对对象的访问权限。

```javascript
// 保护代理示例 - 用户权限控制
class UserService {
  constructor() {
    this.users = [];
  }
  
  addUser(user) {
    this.users.push(user);
    return `用户 ${user.name} 已添加`;
  }
  
  removeUser(userId) {
    const index = this.users.findIndex(user => user.id === userId);
    if (index !== -1) {
      const removedUser = this.users.splice(index, 1);
      return `用户 ${removedUser[0].name} 已移除`;
    }
    return '用户不存在';
  }
}

class UserServiceProxy {
  constructor(userService) {
    this.userService = userService || new UserService();
  }
  
  addUser(user, currentUser) {
    // 检查权限
    if (this.hasPermission(currentUser, 'ADD_USER')) {
      return this.userService.addUser(user);
    }
    return '权限不足，无法添加用户';
  }
  
  removeUser(userId, currentUser) {
    // 检查权限
    if (this.hasPermission(currentUser, 'REMOVE_USER')) {
      return this.userService.removeUser(userId);
    }
    return '权限不足，无法移除用户';
  }
  
  hasPermission(user, permission) {
    return user && user.roles && user.roles.includes(permission);
  }
}

// 使用示例
const userServiceProxy = new UserServiceProxy();

// 无权限用户
const regularUser = { id: 1, name: '普通用户', roles: ['VIEW_USER'] };
console.log(userServiceProxy.addUser({ id: 2, name: '新用户' }, regularUser));

// 有权限用户
const adminUser = { id: 3, name: '管理员', roles: ['VIEW_USER', 'ADD_USER', 'REMOVE_USER'] };
console.log(userServiceProxy.addUser({ id: 2, name: '新用户' }, adminUser));
console.log(userServiceProxy.removeUser(2, adminUser));
```

### 7.5 应用场景

代理模式在以下场景中特别有用：

1. **远程服务访问**：当需要访问远程服务器上的对象时，代理可以处理网络通信的细节
2. **延迟初始化**：当对象创建成本很高时，可以使用虚拟代理延迟创建
3. **访问控制**：使用保护代理来控制对对象的访问权限
4. **缓存结果**：使用代理缓存方法调用的结果，提高性能
5. **日志记录**：代理可以记录对目标对象的访问，便于调试和监控

### 7.6 优缺点

**优点：**

- 可以在不修改原始对象代码的情况下，增加额外的功能
- 实现了访问控制，保护了目标对象
- 支持延迟加载，提高了性能
- 分离了访问对象的责任和实际业务逻辑

**缺点：**

- 增加了系统的复杂性，需要创建额外的代理对象
- 可能会导致请求处理的延迟增加
- 在实现代理模式时，需要确保代理与原始对象的接口一致

### 7.7 代理模式变体

#### 7.7.1 缓存代理

缓存方法调用的结果，避免重复计算。

```javascript
// 缓存代理示例
class MathService {
  calculateExpensiveOperation(x, y) {
    console.log(`执行耗时操作: ${x}, ${y}`);
    // 模拟耗时计算
    return x * y;
  }
}

class CachedMathServiceProxy {
  constructor(mathService) {
    this.mathService = mathService || new MathService();
    this.cache = new Map();
  }
  
  calculateExpensiveOperation(x, y) {
    const key = `${x}_${y}`;
    
    // 检查缓存
    if (this.cache.has(key)) {
      console.log(`从缓存获取结果: ${key}`);
      return this.cache.get(key);
    }
    
    // 计算并缓存结果
    const result = this.mathService.calculateExpensiveOperation(x, y);
    this.cache.set(key, result);
    return result;
  }
}

// 使用示例
const cachedProxy = new CachedMathServiceProxy();
console.log(cachedProxy.calculateExpensiveOperation(10, 20)); // 执行计算
console.log(cachedProxy.calculateExpensiveOperation(10, 20)); // 从缓存获取
```

#### 7.7.2 智能引用代理

在访问对象时执行额外的操作，如引用计数。

```javascript
// 智能引用代理示例
class Resource {
  constructor(name) {
    this.name = name;
    console.log(`资源 ${name} 已创建`);
  }
  
  use() {
    console.log(`使用资源 ${this.name}`);
  }
  
  destroy() {
    console.log(`销毁资源 ${this.name}`);
  }
}

class SmartResourceProxy {
  constructor(name) {
    this.name = name;
    this.resource = null;
    this.refCount = 0;
  }
  
  acquire() {
    if (this.refCount === 0) {
      this.resource = new Resource(this.name);
    }
    this.refCount++;
    console.log(`资源 ${this.name} 引用计数: ${this.refCount}`);
    return this;
  }
  
  use() {
    if (this.refCount > 0) {
      this.resource.use();
    } else {
      console.log('无法使用未获取的资源');
    }
  }
  
  release() {
    if (this.refCount > 0) {
      this.refCount--;
      console.log(`资源 ${this.name} 引用计数: ${this.refCount}`);
      
      if (this.refCount === 0) {
        this.resource.destroy();
        this.resource = null;
      }
    }
  }
}

// 使用示例
const resourceProxy = new SmartResourceProxy('数据库连接');

// 模拟多个组件使用同一资源
const component1 = resourceProxy.acquire();
component1.use();

const component2 = resourceProxy.acquire();
component2.use();

component1.release();
component2.release(); // 此时引用计数为0，资源被销毁
```

## 8. 过滤器模式 (Filter)

### 8.1 意图

使用不同的标准来过滤一组对象，通过逻辑运算以解耦的方式把它们连接起来。

### 8.2 结构

过滤器模式包含以下角色：

- **过滤器接口 (Filter)**：定义过滤方法
- **具体过滤器 (ConcreteFilter)**：实现具体的过滤逻辑
- **目标集合 (TargetCollection)**：被过滤的对象集合

### 8.3 实现示例

```javascript
// 用户类
class User {
  constructor(name, age, role, department) {
    this.name = name;
    this.age = age;
    this.role = role;
    this.department = department;
  }
}

// 过滤器接口
class Filter {
  filter(users) {
    throw new Error('子类必须实现filter方法');
  }
}

// 按年龄过滤
class AgeFilter extends Filter {
  constructor(minAge, maxAge) {
    super();
    this.minAge = minAge;
    this.maxAge = maxAge;
  }
  
  filter(users) {
    return users.filter(user => 
      user.age >= this.minAge && user.age <= this.maxAge
    );
  }
}

// 按角色过滤
class RoleFilter extends Filter {
  constructor(role) {
    super();
    this.role = role;
  }
  
  filter(users) {
    return users.filter(user => user.role === this.role);
  }
}

// 按部门过滤
class DepartmentFilter extends Filter {
  constructor(department) {
    super();
    this.department = department;
  }
  
  filter(users) {
    return users.filter(user => user.department === this.department);
  }
}

// AND组合过滤器
class AndFilter extends Filter {
  constructor(filter1, filter2) {
    super();
    this.filter1 = filter1;
    this.filter2 = filter2;
  }
  
  filter(users) {
    const firstFiltered = this.filter1.filter(users);
    return this.filter2.filter(firstFiltered);
  }
}

// OR组合过滤器
class OrFilter extends Filter {
  constructor(filter1, filter2) {
    super();
    this.filter1 = filter1;
    this.filter2 = filter2;
  }
  
  filter(users) {
    const filtered1 = this.filter1.filter(users);
    const filtered2 = this.filter2.filter(users);
    
    // 合并两个结果集，去重
    const combined = [...filtered1, ...filtered2];
    const unique = combined.filter((user, index, self) =>
      index === self.findIndex(u => u.name === user.name)
    );
    
    return unique;
  }
}

// 使用示例
const users = [
  new User('张三', 25, '开发者', '研发部'),
  new User('李四', 32, '设计师', '设计部'),
  new User('王五', 28, '开发者', '研发部'),
  new User('赵六', 35, '经理', '研发部'),
  new User('钱七', 29, '设计师', '设计部')
];

// 创建过滤器
const ageFilter = new AgeFilter(25, 30);
const roleFilter = new RoleFilter('开发者');
const deptFilter = new DepartmentFilter('研发部');

// 单个过滤器使用
console.log('年龄在25-30之间的用户:');
const youngUsers = ageFilter.filter(users);
youngUsers.forEach(user => console.log(`- ${user.name}, ${user.age}岁`));

// 组合过滤器使用 - AND
console.log('\n研发部的开发者:');
const devInRND = new AndFilter(roleFilter, deptFilter);
devInRND.filter(users).forEach(user => 
  console.log(`- ${user.name}, ${user.role}, ${user.department}`)
);

// 组合过滤器使用 - OR
console.log('\n开发者或年龄在25-30之间的用户:');
const devOrYoung = new OrFilter(roleFilter, ageFilter);
devOrYoung.filter(users).forEach(user => 
  console.log(`- ${user.name}, ${user.role}, ${user.age}岁`)
);
```

### 8.4 应用场景

过滤器模式在以下场景中特别有用：

1. **数据查询**：根据多个条件过滤和搜索数据
2. **UI筛选功能**：实现表格、列表的筛选功能
3. **动态查询构建**：根据用户输入动态构建查询条件
4. **数据预处理**：在数据处理前进行过滤

### 8.5 优缺点

**优点：**

- 可以组合多个简单过滤器构建复杂的过滤条件
- 过滤器之间是解耦的，可以单独开发和测试
- 符合开闭原则，可以轻松添加新的过滤条件
- 提高代码复用性

**缺点：**

- 对于复杂的过滤条件，可能需要创建大量的过滤器类
- 在数据量大的情况下，可能会影响性能

## 9. 管道模式 (Pipeline)

### 9.1 意图

将复杂的处理流程分解为一系列独立的步骤，每个步骤负责特定的处理逻辑，数据从管道的一端流入，经过各个处理步骤后从另一端流出。

### 9.2 结构

管道模式包含以下角色：

- **管道 (Pipeline)**：整个处理流程的容器
- **处理器 (Processor)**：管道中的各个处理步骤
- **上下文 (Context)**：在处理器之间传递的数据

### 9.3 实现示例

```javascript
// 管道接口
class Pipeline {
  constructor() {
    this.processors = [];
  }
  
  // 添加处理器
  addProcessor(processor) {
    this.processors.push(processor);
    return this; // 支持链式调用
  }
  
  // 执行管道
  execute(context) {
    let result = context;
    
    for (const processor of this.processors) {
      result = processor.process(result);
      if (result === null || result === undefined) {
        break; // 可以通过返回null来中断管道
      }
    }
    
    return result;
  }
}

// 处理器接口
class Processor {
  process(context) {
    throw new Error('子类必须实现process方法');
  }
}

// 具体处理器 - 验证数据
class ValidationProcessor extends Processor {
  process(context) {
    console.log('执行数据验证');
    
    if (!context || !context.data) {
      console.error('数据格式错误');
      return null;
    }
    
    return context;
  }
}

// 具体处理器 - 转换数据
class TransformationProcessor extends Processor {
  process(context) {
    console.log('执行数据转换');
    
    // 示例转换：将文本转换为大写
    if (typeof context.data === 'string') {
      context.transformedData = context.data.toUpperCase();
    }
    
    return context;
  }
}

// 具体处理器 - 处理数据
class BusinessProcessor extends Processor {
  process(context) {
    console.log('执行业务逻辑');
    
    // 示例业务逻辑：添加处理时间戳
    context.processedAt = new Date().toISOString();
    context.result = `${context.transformedData} (处理时间: ${context.processedAt})`;
    
    return context;
  }
}

// 具体处理器 - 日志记录
class LoggingProcessor extends Processor {
  process(context) {
    console.log('记录日志');
    console.log('处理结果:', context.result);
    return context;
  }
}

// 使用示例
const pipeline = new Pipeline();

// 添加处理器
pipeline
  .addProcessor(new ValidationProcessor())
  .addProcessor(new TransformationProcessor())
  .addProcessor(new BusinessProcessor())
  .addProcessor(new LoggingProcessor());

// 执行管道
const context = { data: 'hello world' };
const result = pipeline.execute(context);
console.log('\n最终结果:', result.result);

// 错误情况测试
console.log('\n测试错误情况:');
pipeline.execute({}); // 数据验证失败
```

### 9.4 函数式实现

在JavaScript中，我们可以使用函数式编程的方式更简洁地实现管道模式：

```javascript
// 函数式管道实现
const pipe = (...functions) => {
  return (input) => {
    return functions.reduce((value, func) => func(value), input);
  };
};

// 处理器函数
const validate = (context) => {
  console.log('执行数据验证');
  return context && context.data ? context : null;
};

const transform = (context) => {
  console.log('执行数据转换');
  if (context && typeof context.data === 'string') {
    context.transformedData = context.data.toUpperCase();
  }
  return context;
};

const businessLogic = (context) => {
  console.log('执行业务逻辑');
  if (context) {
    context.processedAt = new Date().toISOString();
    context.result = `${context.transformedData} (处理时间: ${context.processedAt})`;
  }
  return context;
};

const log = (context) => {
  console.log('记录日志');
  if (context) {
    console.log('处理结果:', context.result);
  }
  return context;
};

// 创建管道
const dataPipeline = pipe(validate, transform, businessLogic, log);

// 执行管道
const context = { data: 'hello functional pipeline' };
const result = dataPipeline(context);
console.log('\n最终结果:', result.result);
```

### 9.5 应用场景

管道模式在以下场景中特别有用：

1. **数据处理流程**：如ETL（提取、转换、加载）操作
2. **请求处理**：Web应用中的中间件链
3. **工作流引擎**：实现复杂的业务流程
4. **数据转换**：处理和转换各种格式的数据
5. **图像处理**：应用一系列滤镜或效果

### 9.6 优缺点

**优点：**

- 将复杂流程分解为可管理的步骤
- 每个处理器职责单一，易于维护和测试
- 处理器可以重用和组合
- 支持链式调用，代码简洁易读

**缺点：**

- 对于简单的处理流程，可能会增加不必要的复杂性
- 调试可能会比较困难，因为数据在多个处理器之间传递

## 10. 依赖注入模式 (Dependency Injection)

### 10.1 意图

依赖注入是一种设计模式，它允许我们将一个对象所依赖的其他对象（称为依赖项）的创建和管理与该对象本身分离。这样可以使代码更加模块化、可测试和可维护。

### 10.2 结构

依赖注入模式包含以下角色：

- **依赖项 (Dependency)**：被注入的对象
- **依赖项注入器 (Injector)**：负责创建和注入依赖项
- **客户端 (Client)**：使用依赖项的对象

### 10.3 实现示例

```javascript
// 依赖项 - 日志服务
class LoggerService {
  log(message) {
    console.log(`[LOG] ${message}`);
  }
  
  error(message) {
    console.error(`[ERROR] ${message}`);
  }
}

// 依赖项 - 数据服务
class DataService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }
  
  async fetchData(endpoint) {
    console.log(`从 ${this.baseUrl}/${endpoint} 获取数据`);
    // 模拟API调用
    return { success: true, data: '模拟数据' };
  }
}

// 客户端 - 用户服务，依赖日志和数据服务
class UserService {
  constructor(logger, dataService) {
    this.logger = logger;
    this.dataService = dataService;
  }
  
  async getUser(id) {
    this.logger.log(`获取用户信息: ${id}`);
    try {
      const result = await this.dataService.fetchData(`users/${id}`);
      this.logger.log(`成功获取用户 ${id} 的信息`);
      return result;
    } catch (error) {
      this.logger.error(`获取用户 ${id} 信息失败: ${error.message}`);
      throw error;
    }
  }
}

// 简单的依赖注入容器
class Container {
  constructor() {
    this.services = new Map();
  }
  
  // 注册服务
  register(name, factory) {
    this.services.set(name, factory);
  }
  
  // 获取服务
  get(name) {
    if (!this.services.has(name)) {
      throw new Error(`服务 ${name} 未注册`);
    }
    
    return this.services.get(name)(this);
  }
}

// 使用示例
const container = new Container();

// 注册服务
container.register('logger', () => new LoggerService());
container.register('dataService', () => new DataService('https://api.example.com'));
container.register('userService', (c) => new UserService(c.get('logger'), c.get('dataService')));

// 获取并使用服务
const userService = container.get('userService');
userService.getUser(1)
  .then(data => console.log('用户数据:', data))
  .catch(err => console.error('错误:', err));
```

### 10.4 依赖注入的类型

#### 10.4.1 构造函数注入

通过构造函数参数注入依赖项，这是最常见的依赖注入方式。

```javascript
class Service {
  constructor(dependency1, dependency2) {
    this.dependency1 = dependency1;
    this.dependency2 = dependency2;
  }
}
```

#### 10.4.2 属性注入

通过设置对象属性注入依赖项。

```javascript
class Service {
  setDependency(dependency) {
    this.dependency = dependency;
  }
}
```

#### 10.4.3 接口注入

通过实现特定接口注入依赖项。

```javascript
// 在JavaScript中可以通过约定实现
class DependencyAware {
  injectDependency(dependency) {
    throw new Error('子类必须实现injectDependency方法');
  }
}

class Service extends DependencyAware {
  injectDependency(dependency) {
    this.dependency = dependency;
  }
}
```

### 10.5 应用场景

依赖注入模式在以下场景中特别有用：

1. **测试驱动开发**：便于替换依赖项为模拟对象
2. **模块化应用**：减少组件之间的耦合
3. **大型应用**：便于管理复杂的依赖关系
4. **配置驱动的应用**：根据配置动态注入不同的实现

### 10.6 优缺点

**优点：**

- 降低了组件之间的耦合度
- 提高了代码的可测试性
- 使代码更加模块化和可维护
- 支持依赖项的集中管理和配置

**缺点：**

- 对于小型应用，可能会增加不必要的复杂性
- 依赖关系变得不那么明确，需要通过依赖注入容器或配置来理解
- 可能会导致运行时错误，而不是编译时错误（在JavaScript中尤为明显）

## 总结

结构型设计模式是软件设计中非常重要的一部分，它们关注于如何将类和对象组合成更大的结构。本指南介绍了10种常用的结构型设计模式：

1. **适配器模式**：将不兼容的接口转换为兼容的接口
2. **桥接模式**：将抽象与实现分离，使它们可以独立变化
3. **组合模式**：将对象组合成树形结构以表示部分-整体的层次结构
4. **装饰器模式**：动态地给一个对象添加额外的职责
5. **外观模式**：为子系统中的一组接口提供一个统一的接口
6. **享元模式**：通过共享来有效支持大量细粒度对象
7. **代理模式**：为另一个对象提供代理或占位符，以控制对这个对象的访问
8. **过滤器模式**：使用不同的标准来过滤一组对象
9. **管道模式**：将复杂的处理流程分解为一系列独立的步骤
10. **依赖注入模式**：将对象所依赖的其他对象的创建和管理与该对象本身分离

每种设计模式都有其特定的应用场景和优缺点。在实际开发中，我们需要根据具体的业务需求和技术环境选择合适的设计模式。

设计模式的选择应该基于问题域和系统的实际需求，而不是简单地追求使用某种模式。同时，我们也应该注意到设计模式可能带来的复杂性，避免过度设计。

通过合理使用结构型设计模式，我们可以构建更加灵活、可维护和可扩展的软件系统。
7. 代理模式 (Proxy)
8. 过滤器模式 (Filter)
9. 管道模式 (Pipeline)
10. 依赖注入模式 (Dependency Injection)

每种模式都将包含详细的JavaScript实现示例和实际应用场景。

## 1. 适配器模式 (Adapter)

### 1.1 意图

将一个类的接口转换成客户端所期望的另一个接口，使得原本不兼容的类可以一起工作。

### 1.2 结构

适配器模式包含以下角色：

- **目标接口 (Target)**：客户端所期望的接口
- **适配器 (Adapter)**：将源接口转换为目标接口的类
- **被适配者 (Adaptee)**：需要被适配的接口

### 1.3 实现示例

```javascript
// 被适配者：旧系统的接口
class LegacyCalculator {
  add(a, b) {
    console.log(`LegacyCalculator: 计算 ${a} + ${b}`);
    return a + b;
  }
  
  subtract(a, b) {
    console.log(`LegacyCalculator: 计算 ${a} - ${b}`);
    return a - b;
  }
}

// 目标接口：新系统期望的接口
class ModernCalculator {
  performOperation(operation, a, b) {
    switch (operation) {
      case 'add':
        return this.add(a, b);
      case 'subtract':
        return this.subtract(a, b);
      default:
        throw new Error(`不支持的操作: ${operation}`);
    }
  }
  
  add(a, b) {
    console.log(`ModernCalculator: 执行加法操作 ${a} + ${b}`);
    return a + b;
  }
  
  subtract(a, b) {
    console.log(`ModernCalculator: 执行减法操作 ${a} - ${b}`);
    return a - b;
  }
}

// 适配器：将旧系统适配到新系统
class CalculatorAdapter extends ModernCalculator {
  constructor(legacyCalculator) {
    super();
    this.legacyCalculator = legacyCalculator;
  }
  
  add(a, b) {
    return this.legacyCalculator.add(a, b);
  }
  
  subtract(a, b) {
    return this.legacyCalculator.subtract(a, b);
  }
}

// 客户端代码：使用适配器
function adapterPatternDemo() {
  console.log("适配器模式演示");
  
  // 创建旧系统的计算器
  const legacyCalc = new LegacyCalculator();
  console.log("直接使用LegacyCalculator:");
  console.log(`10 + 5 = ${legacyCalc.add(10, 5)}`);
  console.log(`10 - 5 = ${legacyCalc.subtract(10, 5)}`);
  
  // 创建新系统的计算器
  const modernCalc = new ModernCalculator();
  console.log("\n直接使用ModernCalculator:");
  console.log(`10 + 5 = ${modernCalc.performOperation('add', 10, 5)}`);
  console.log(`10 - 5 = ${modernCalc.performOperation('subtract', 10, 5)}`);
  
  // 使用适配器将旧系统适配到新系统
  const adaptedCalc = new CalculatorAdapter(legacyCalc);
  console.log("\n使用适配器后的Calculator:");
  console.log(`10 + 5 = ${adaptedCalc.performOperation('add', 10, 5)}`);
  console.log(`10 - 5 = ${adaptedCalc.performOperation('subtract', 10, 5)}`);
}

// 实际应用场景：不同支付系统的适配
class PayPalPayment {
  pay(amount) {
    console.log(`PayPal支付: $${amount}`);
    return { success: true, transactionId: `PP${Math.random().toString(36).substring(2, 10)}` };
  }
}

class StripePayment {
  processPayment(amount, currency = 'USD') {
    console.log(`Stripe支付: ${currency} ${amount}`);
    return { success: true, chargeId: `STR${Math.random().toString(36).substring(2, 10)}` };
  }
}

class BitcoinPayment {
  sendPayment(btcAmount) {
    console.log(`比特币支付: ${btcAmount} BTC`);
    return { success: true, txHash: `0x${Math.random().toString(16).substring(2, 34)}` };
  }
}

// 统一支付接口
class PaymentAdapter {
  constructor(paymentProcessor) {
    this.paymentProcessor = paymentProcessor;
  }
  
  makePayment(amount, currency = 'USD', options = {}) {
    // 根据不同的支付处理器进行适配
    if (this.paymentProcessor instanceof PayPalPayment) {
      return this.paymentProcessor.pay(amount);
    } else if (this.paymentProcessor instanceof StripePayment) {
      return this.paymentProcessor.processPayment(amount, currency);
    } else if (this.paymentProcessor instanceof BitcoinPayment) {
      // 假设1 BTC = $40000进行转换
      const btcRate = options.btcRate || 40000;
      const btcAmount = amount / btcRate;
      return this.paymentProcessor.sendPayment(btcAmount.toFixed(8));
    } else {
      throw new Error('不支持的支付处理器');
    }
  }
}

// 支付处理服务
class PaymentService {
  constructor() {
    this.adapters = new Map();
  }
  
  registerPaymentMethod(name, paymentProcessor) {
    this.adapters.set(name, new PaymentAdapter(paymentProcessor));
    return this;
  }
  
  pay(method, amount, options = {}) {
    const adapter = this.adapters.get(method);
    if (!adapter) {
      throw new Error(`不支持的支付方式: ${method}`);
    }
    
    return adapter.makePayment(amount, options.currency, options);
  }
}

// 测试支付系统适配器
function paymentAdapterDemo() {
  console.log("\n\n支付系统适配器演示");
  
  // 创建各种支付处理器
  const paypal = new PayPalPayment();
  const stripe = new StripePayment();
  const bitcoin = new BitcoinPayment();
  
  // 创建支付服务并注册支付方式
  const paymentService = new PaymentService();
  paymentService
    .registerPaymentMethod('paypal', paypal)
    .registerPaymentMethod('stripe', stripe)
    .registerPaymentMethod('bitcoin', bitcoin);
  
  // 使用统一接口进行支付
  console.log("\n使用PayPal支付:");
  console.log(paymentService.pay('paypal', 100));
  
  console.log("\n使用Stripe支付:");
  console.log(paymentService.pay('stripe', 200, { currency: 'EUR' }));
  
  console.log("\n使用比特币支付:");
  console.log(paymentService.pay('bitcoin', 500, { btcRate: 35000 }));
  
  // 尝试使用不支持的支付方式
  try {
    paymentService.pay('alipay', 100);
  } catch (error) {
    console.log(`\n错误: ${error.message}`);
  }
}

// 执行演示
adapterPatternDemo();
paymentAdapterDemo();

## 2. 桥接模式 (Bridge)

### 2.1 意图

将抽象部分与实现部分分离，使它们可以独立地变化。桥接模式通过组合而非继承来实现这种分离。

### 2.2 结构

桥接模式包含以下角色：

- **抽象部分 (Abstraction)**：定义抽象接口并保存一个对实现部分的引用
- **扩展抽象部分 (RefinedAbstraction)**：扩展抽象部分的接口
- **实现部分 (Implementor)**：定义实现接口
- **具体实现部分 (ConcreteImplementor)**：实现实现部分的接口

### 2.3 实现示例

```javascript
// 实现部分接口
class MessageSender {
  send(message) {
    throw new Error('子类必须实现send方法');
  }
}

// 具体实现部分：电子邮件发送
class EmailSender extends MessageSender {
  send(message) {
    console.log(`通过电子邮件发送: "${message}"`);
    return { success: true, method: 'email' };
  }
}

// 具体实现部分：短信发送
class SMSSender extends MessageSender {
  send(message) {
    console.log(`通过短信发送: "${message}"`);
    return { success: true, method: 'sms' };
  }
}

// 具体实现部分：推送通知发送
class PushNotificationSender extends MessageSender {
  send(message) {
    console.log(`通过推送通知发送: "${message}"`);
    return { success: true, method: 'push' };
  }
}

// 抽象部分
class Message {
  constructor(sender) {
    this.sender = sender;
    this.content = '';
  }
  
  setContent(content) {
    this.content = content;
    return this;
  }
  
  send() {
    return this.sender.send(this.content);
  }
}

// 扩展抽象部分：普通消息
class TextMessage extends Message {
  constructor(sender) {
    super(sender);
  }
  
  send() {
    console.log('发送文本消息:');
    return super.send();
  }
}

// 扩展抽象部分：紧急消息
class EmergencyMessage extends Message {
  constructor(sender) {
    super(sender);
    this.priority = 'high';
  }
  
  setContent(content) {
    // 为紧急消息添加前缀
    this.content = `[紧急] ${content}`;
    return this;
  }
  
  send() {
    console.log('发送紧急消息:');
    // 可以添加额外的紧急处理逻辑
    console.log('记录到紧急日志...');
    return super.send();
  }
}

// 扩展抽象部分：定时消息
class ScheduledMessage extends Message {
  constructor(sender) {
    super(sender);
    this.scheduleTime = null;
  }
  
  setScheduleTime(time) {
    this.scheduleTime = time;
    return this;
  }
  
  send() {
    const scheduledInfo = this.scheduleTime ? `(计划时间: ${this.scheduleTime})` : '';
    console.log(`发送定时消息 ${scheduledInfo}:`);
    return super.send();
  }
}

// 客户端代码：使用桥接模式
function bridgePatternDemo() {
  console.log("\n\n桥接模式演示");
  
  // 创建不同的发送器
  const emailSender = new EmailSender();
  const smsSender = new SMSSender();
  const pushSender = new PushNotificationSender();
  
  // 创建不同类型的消息并设置发送方式
  const textEmail = new TextMessage(emailSender);
  const emergencySMS = new EmergencyMessage(smsSender);
  const scheduledPush = new ScheduledMessage(pushSender);
  
  // 发送消息
  console.log("\n1. 发送普通文本邮件:");
  textEmail.setContent("这是一条普通的邮件消息").send();
  
  console.log("\n2. 发送紧急短信:");
  emergencySMS.setContent("系统出现异常，请立即处理").send();
  
  console.log("\n3. 发送定时推送通知:");
  scheduledPush
    .setContent("您的会议将在10分钟后开始")
    .setScheduleTime("2023-10-20 15:30")
    .send();
  
  // 可以动态切换发送方式
  console.log("\n4. 动态切换发送方式:");
  textEmail.sender = pushSender; // 将邮件消息切换为推送方式
  textEmail.setContent("这条消息现在通过推送发送").send();
  
  // 可以组合不同的抽象和实现
  console.log("\n5. 组合不同的抽象和实现:");
  const emergencyEmail = new EmergencyMessage(emailSender);
  emergencyEmail.setContent("数据库连接失败！").send();
}

// 实际应用场景：UI组件主题切换

// 实现部分：主题接口
class Theme {
  getBackground() {
    throw new Error('子类必须实现getBackground方法');
  }
  
  getTextColor() {
    throw new Error('子类必须实现getTextColor方法');
  }
  
  getBorderStyle() {
    throw new Error('子类必须实现getBorderStyle方法');
  }
}

// 具体实现：亮色主题
class LightTheme extends Theme {
  getBackground() {
    return '#ffffff';
  }
  
  getTextColor() {
    return '#000000';
  }
  
  getBorderStyle() {
    return '1px solid #e0e0e0';
  }
}

// 具体实现：暗色主题
class DarkTheme extends Theme {
  getBackground() {
    return '#1a1a1a';
  }
  
  getTextColor() {
    return '#ffffff';
  }
  
  getBorderStyle() {
    return '1px solid #444444';
  }
}

// 具体实现：彩色主题
class ColorfulTheme extends Theme {
  getBackground() {
    return '#f0f8ff';
  }
  
  getTextColor() {
    return '#333333';
  }
  
  getBorderStyle() {
    return '2px solid #ff6b6b';
  }
}

// 抽象部分：UI组件
class UIComponent {
  constructor(theme) {
    this.theme = theme;
  }
  
  setTheme(theme) {
    this.theme = theme;
    return this;
  }
  
  render() {
    throw new Error('子类必须实现render方法');
  }
}

// 扩展抽象部分：按钮
class Button extends UIComponent {
  constructor(theme, label = 'Button') {
    super(theme);
    this.label = label;
  }
  
  setLabel(label) {
    this.label = label;
    return this;
  }
  
  render() {
    console.log(`渲染按钮:`);
    console.log(`- 标签: ${this.label}`);
    console.log(`- 背景色: ${this.theme.getBackground()}`);
    console.log(`- 文字颜色: ${this.theme.getTextColor()}`);
    console.log(`- 边框样式: ${this.theme.getBorderStyle()}`);
    return this;
  }
}

// 扩展抽象部分：卡片
class Card extends UIComponent {
  constructor(theme, title = 'Card', content = '') {
    super(theme);
    this.title = title;
    this.content = content;
  }
  
  setTitle(title) {
    this.title = title;
    return this;
  }
  
  setContent(content) {
    this.content = content;
    return this;
  }
  
  render() {
    console.log(`渲染卡片:`);
    console.log(`- 标题: ${this.title}`);
    console.log(`- 内容: ${this.content}`);
    console.log(`- 背景色: ${this.theme.getBackground()}`);
    console.log(`- 文字颜色: ${this.theme.getTextColor()}`);
    console.log(`- 边框样式: ${this.theme.getBorderStyle()}`);
    return this;
  }
}

// 扩展抽象部分：面板
class Panel extends UIComponent {
  constructor(theme, title = 'Panel') {
    super(theme);
    this.title = title;
    this.components = [];
  }
  
  setTitle(title) {
    this.title = title;
    return this;
  }
  
  addComponent(component) {
    this.components.push(component);
    // 确保子组件使用相同的主题
    component.setTheme(this.theme);
    return this;
  }
  
  render() {
    console.log(`渲染面板:`);
    console.log(`- 标题: ${this.title}`);
    console.log(`- 背景色: ${this.theme.getBackground()}`);
    console.log(`- 文字颜色: ${this.theme.getTextColor()}`);
    console.log(`- 边框样式: ${this.theme.getBorderStyle()}`);
    
    console.log(`- 子组件 (${this.components.length}个):`);
    this.components.forEach((component, index) => {
      console.log(`  子组件 ${index + 1}:`);
      component.render();
    });
    
    return this;
  }
}

// 测试UI组件主题切换
function themeBridgeDemo() {
  console.log("\n\nUI组件主题切换演示");
  
  // 创建不同的主题
  const lightTheme = new LightTheme();
  const darkTheme = new DarkTheme();
  const colorfulTheme = new ColorfulTheme();
  
  // 创建UI组件
  console.log("\n1. 创建按钮组件:");
  const button = new Button(lightTheme, "点击我");
  button.render();
  
  console.log("\n2. 创建卡片组件:");
  const card = new Card(lightTheme)
    .setTitle("产品信息")
    .setContent("这是一个产品的详细描述信息");
  card.render();
  
  console.log("\n3. 创建面板组件并添加子组件:");
  const panel = new Panel(lightTheme, "控制面板");
  panel
    .addComponent(new Button(lightTheme, "保存"))
    .addComponent(new Button(lightTheme, "取消"))
    .addComponent(new Card(lightTheme, "状态", "系统运行正常"))
    .render();
  
  // 动态切换主题
  console.log("\n4. 切换到暗色主题:");
  button.setTheme(darkTheme).render();
  
  console.log("\n5. 切换面板及其所有子组件到彩色主题:");
  panel.setTheme(colorfulTheme).render();
  
  // 验证主题一致性
  console.log("\n6. 验证所有组件主题一致性:");
  console.log(`面板主题背景色: ${panel.theme.getBackground()}`);
  console.log(`面板中第一个按钮主题背景色: ${panel.components[0].theme.getBackground()}`);
  console.log(`主题是否相同: ${panel.theme === panel.components[0].theme}`);
}

// 执行演示
bridgePatternDemo();
themeBridgeDemo();

## 3. 组合模式 (Composite)

### 3.1 意图

将对象组合成树形结构以表示"部分-整体"的层次结构。组合模式使得客户端可以统一地处理单个对象和对象的组合。

### 3.2 结构

组合模式包含以下角色：

- **组件 (Component)**：定义组合中所有对象共有的接口
- **叶节点 (Leaf)**：组合中的叶节点对象，没有子节点
- **复合节点 (Composite)**：组合中的分支节点对象，可以包含子节点

### 3.3 实现示例

```javascript
// 组件接口
class FileSystemComponent {
  constructor(name) {
    this.name = name;
    this.parent = null;
  }
  
  getName() {
    return this.name;
  }
  
  getParent() {
    return this.parent;
  }
  
  setParent(parent) {
    this.parent = parent;
    return this;
  }
  
  getPath() {
    if (this.parent === null) {
      return this.name;
    }
    return `${this.parent.getPath()}/${this.name}`;
  }
  
  add(component) {
    throw new Error('子类必须实现add方法');
  }
  
  remove(component) {
    throw new Error('子类必须实现remove方法');
  }
  
  getChild(index) {
    throw new Error('子类必须实现getChild方法');
  }
  
  getSize() {
    throw new Error('子类必须实现getSize方法');
  }
  
  display(indent = 0) {
    throw new Error('子类必须实现display方法');
  }
}

// 叶节点：文件
class File extends FileSystemComponent {
  constructor(name, size) {
    super(name);
    this.size = size;
  }
  
  // 文件不能添加子组件
  add(component) {
    console.log(`无法向文件 ${this.name} 添加子组件`);
    return this;
  }
  
  remove(component) {
    console.log(`无法从文件 ${this.name} 移除子组件`);
    return this;
  }
  
  getChild(index) {
    console.log(`文件 ${this.name} 没有子组件`);
    return null;
  }
  
  getSize() {
    return this.size;
  }
  
  setSize(size) {
    this.size = size;
    return this;
  }
  
  display(indent = 0) {
    const spaces = ' '.repeat(indent);
    console.log(`${spaces}- ${this.name} (${this.size}KB)`);
    return this;
  }
}

// 复合节点：文件夹
class Directory extends FileSystemComponent {
  constructor(name) {
    super(name);
    this.children = [];
  }
  
  add(component) {
    component.setParent(this);
    this.children.push(component);
    return this;
  }
  
  remove(component) {
    const index = this.children.indexOf(component);
    if (index !== -1) {
      this.children[index].setParent(null);
      this.children.splice(index, 1);
      console.log(`已从 ${this.name} 移除 ${component.name}`);
    } else {
      console.log(`${this.name} 中未找到 ${component.name}`);
    }
    return this;
  }
  
  removeByName(name) {
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i].getName() === name) {
        this.children[i].setParent(null);
        this.children.splice(i, 1);
        console.log(`已从 ${this.name} 移除 ${name}`);
        return true;
      }
    }
    console.log(`${this.name} 中未找到 ${name}`);
    return false;
  }
  
  getChild(index) {
    if (index >= 0 && index < this.children.length) {
      return this.children[index];
    }
    return null;
  }
  
  getChildByName(name) {
    for (const child of this.children) {
      if (child.getName() === name) {
        return child;
      }
    }
    return null;
  }
  
  getChildren() {
    return [...this.children];
  }
  
  getSize() {
    return this.children.reduce((total, child) => total + child.getSize(), 0);
  }
  
  getFileCount() {
    return this.children.reduce((count, child) => {
      if (child instanceof File) {
        return count + 1;
      } else if (child instanceof Directory) {
        return count + child.getFileCount();
      }
      return count;
    }, 0);
  }
  
  getDirectoryCount() {
    return this.children.reduce((count, child) => {
      if (child instanceof Directory) {
        return count + 1 + child.getDirectoryCount();
      }
      return count;
    }, 0);
  }
  
  display(indent = 0) {
    const spaces = ' '.repeat(indent);
    console.log(`${spaces}+ ${this.name} (${this.getSize()}KB)`);
    
    this.children.forEach(child => {
      child.display(indent + 2);
    });
    
    return this;
  }
  
  // 递归查找文件
  findFile(name) {
    for (const child of this.children) {
      if (child instanceof File && child.getName() === name) {
        return child;
      } else if (child instanceof Directory) {
        const found = child.findFile(name);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }
  
  // 获取所有文件路径
  getAllFilePaths() {
    const paths = [];
    
    const collectPaths = (component) => {
      if (component instanceof File) {
        paths.push(component.getPath());
      } else if (component instanceof Directory) {
        component.getChildren().forEach(child => collectPaths(child));
      }
    };
    
    collectPaths(this);
    return paths;
  }
}

// 客户端代码：使用组合模式
function compositePatternDemo() {
  console.log("\n\n组合模式演示 - 文件系统");
  
  // 创建根目录
  const root = new Directory("/");
  
  // 创建子目录
  const documents = new Directory("documents");
  const images = new Directory("images");
  const projects = new Directory("projects");
  
  // 创建文件
  const resume = new File("resume.pdf", 512);
  const coverLetter = new File("cover-letter.docx", 256);
  const profilePic = new File("profile.jpg", 1024);
  const banner = new File("banner.png", 2048);
  
  // 构建项目子目录
  const project1 = new Directory("project-1");
  const project2 = new Directory("project-2");
  
  // 添加项目文件
  project1.add(new File("index.html", 100));
  project1.add(new File("styles.css", 200));
  project1.add(new File("app.js", 500));
  
  project2.add(new File("README.md", 50));
  project2.add(new File("main.js", 350));
  
  // 构建文件系统结构
  root.add(documents);
  root.add(images);
  root.add(projects);
  
  documents.add(resume);
  documents.add(coverLetter);
  
  images.add(profilePic);
  images.add(banner);
  
  projects.add(project1);
  projects.add(project2);
  
  // 显示文件系统结构
  console.log("\n1. 完整文件系统结构:");
  root.display();
  
  // 获取大小信息
  console.log("\n2. 文件系统信息:");
  console.log(`总大小: ${root.getSize()}KB`);
  console.log(`文件数量: ${root.getFileCount()}`);
  console.log(`目录数量: ${root.getDirectoryCount()}`);
  
  // 获取特定路径
  console.log("\n3. 文件路径:");
  console.log(`resume.pdf 路径: ${resume.getPath()}`);
  console.log(`project-1 路径: ${project1.getPath()}`);
  
  // 查找文件
  console.log("\n4. 查找文件:");
  const foundFile = root.findFile("README.md");
  if (foundFile) {
    console.log(`找到文件: ${foundFile.getName()}，路径: ${foundFile.getPath()}`);
  }
  
  const notFoundFile = root.findFile("not-exist.txt");
  if (!notFoundFile) {
    console.log("未找到文件: not-exist.txt");
  }
  
  // 获取所有文件路径
  console.log("\n5. 所有文件路径:");
  const allPaths = root.getAllFilePaths();
  allPaths.forEach(path => console.log(path));
  
  // 移除文件和目录
  console.log("\n6. 移除文件:");
  documents.removeByName("cover-letter.docx");
  documents.display();
  
  console.log("\n7. 移除目录:");
  projects.remove(project2);
  projects.display();
  
  // 尝试向文件添加子组件
  console.log("\n8. 尝试向文件添加子组件:");
  resume.add(new File("attachment.txt", 10));
}

// 实际应用场景：UI组件树

// 组件接口
class UIComponentNode {
  constructor(id) {
    this.id = id;
    this.children = [];
    this.parent = null;
    this.styles = {};
    this.attributes = {};
  }
  
  getId() {
    return this.id;
  }
  
  setStyle(key, value) {
    this.styles[key] = value;
    return this;
  }
  
  setAttribute(key, value) {
    this.attributes[key] = value;
    return this;
  }
  
  add(child) {
    throw new Error('子类必须实现add方法');
  }
  
  remove(child) {
    throw new Error('子类必须实现remove方法');
  }
  
  render() {
    throw new Error('子类必须实现render方法');
  }
  
  findById(id) {
    throw new Error('子类必须实现findById方法');
  }
}

// 叶节点：基础UI元素
class UIElement extends UIComponentNode {
  constructor(id, type = 'div') {
    super(id);
    this.type = type;
    this.content = '';
  }
  
  setContent(content) {
    this.content = content;
    return this;
  }
  
  add(child) {
    console.log(`无法向 ${this.type} 元素 ${this.id} 添加子元素`);
    return this;
  }
  
  remove(child) {
    console.log(`无法从 ${this.type} 元素 ${this.id} 移除子元素`);
    return this;
  }
  
  render(indent = 0) {
    const spaces = ' '.repeat(indent);
    const stylesStr = Object.keys(this.styles).length > 0 
      ? ` style="${Object.entries(this.styles).map(([k, v]) => `${k}: ${v}`).join('; ')}"`
      : '';
    
    const attrsStr = Object.keys(this.attributes).length > 0
      ? ` ${Object.entries(this.attributes).map(([k, v]) => `${k}="${v}"`).join(' ')}`
      : '';
    
    if (this.content) {
      console.log(`${spaces}<${this.type} id="${this.id}"${stylesStr}${attrsStr}>${this.content}</${this.type}>`);
    } else {
      console.log(`${spaces}<${this.type} id="${this.id}"${stylesStr}${attrsStr} />`);
    }
    
    return this;
  }
  
  findById(id) {
    return this.id === id ? this : null;
  }
}

// 复合节点：容器元素
class UIContainer extends UIComponentNode {
  constructor(id, type = 'div') {
    super(id);
    this.type = type;
  }
  
  add(child) {
    if (child instanceof UIComponentNode) {
      child.parent = this;
      this.children.push(child);
    }
    return this;
  }
  
  remove(child) {
    const index = this.children.indexOf(child);
    if (index !== -1) {
      this.children[index].parent = null;
      this.children.splice(index, 1);
      return true;
    }
    return false;
  }
  
  removeById(id) {
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i].id === id) {
        this.children[i].parent = null;
        this.children.splice(i, 1);
        return true;
      }
    }
    return false;
  }
  
  getChild(index) {
    return this.children[index] || null;
  }
  
  getChildren() {
    return [...this.children];
  }
  
  render(indent = 0) {
    const spaces = ' '.repeat(indent);
    const stylesStr = Object.keys(this.styles).length > 0 
      ? ` style="${Object.entries(this.styles).map(([k, v]) => `${k}: ${v}`).join('; ')}"`
      : '';
    
    const attrsStr = Object.keys(this.attributes).length > 0
      ? ` ${Object.entries(this.attributes).map(([k, v]) => `${k}="${v}"`).join(' ')}`
      : '';
    
    console.log(`${spaces}<${this.type} id="${this.id}"${stylesStr}${attrsStr}>`);
    
    this.children.forEach(child => {
      child.render(indent + 2);
    });
    
    console.log(`${spaces}</${this.type}>`);
    
    return this;
  }
  
  findById(id) {
    if (this.id === id) {
      return this;
    }
    
    for (const child of this.children) {
      const found = child.findById(id);
      if (found) {
        return found;
      }
    }
    
    return null;
  }
  
  applyStyleToAll(styles) {
    // 应用样式到自身
    Object.entries(styles).forEach(([key, value]) => {
      this.styles[key] = value;
    });
    
    // 递归应用样式到所有子元素
    this.children.forEach(child => {
      if (child instanceof UIContainer) {
        child.applyStyleToAll(styles);
      } else {
        Object.entries(styles).forEach(([key, value]) => {
          child.styles[key] = value;
        });
      }
    });
    
    return this;
  }
}

// 特殊复合节点：表单
class UIForm extends UIContainer {
  constructor(id) {
    super(id, 'form');
    this.method = 'GET';
    this.action = '';
  }
  
  setMethod(method) {
    this.method = method;
    return this;
  }
  
  setAction(action) {
    this.action = action;
    return this;
  }
  
  render(indent = 0) {
    const spaces = ' '.repeat(indent);
    const stylesStr = Object.keys(this.styles).length > 0 
      ? ` style="${Object.entries(this.styles).map(([k, v]) => `${k}: ${v}`).join('; ')}"`
      : '';
    
    console.log(`${spaces}<form id="${this.id}" method="${this.method}" action="${this.action}"${stylesStr}>`);
    
    this.children.forEach(child => {
      child.render(indent + 2);
    });
    
    console.log(`${spaces}</form>`);
    
    return this;
  }
}

// 测试UI组件树
function uiComponentTreeDemo() {
  console.log("\n\n组合模式演示 - UI组件树");
  
  // 创建页面容器
  const page = new UIContainer('page', 'body')
    .setStyle('font-family', 'Arial, sans-serif')
    .setStyle('margin', '0')
    .setStyle('padding', '0');
  
  // 创建头部
  const header = new UIContainer('header')
    .setStyle('background-color', '#333')
    .setStyle('color', 'white')
    .setStyle('padding', '20px');
  
  header.add(
    new UIElement('logo', 'h1')
      .setContent('My Website')
      .setStyle('margin', '0')
  );
  
  // 创建导航菜单
  const nav = new UIContainer('nav')
    .setStyle('background-color', '#444')
    .setStyle('padding', '10px');
  
  nav.add(new UIElement('nav-home', 'a').setAttribute('href', '#').setContent('首页'));
  nav.add(new UIElement('nav-about', 'a').setAttribute('href', '#').setContent('关于我们'));
  nav.add(new UIElement('nav-contact', 'a').setAttribute('href', '#').setContent('联系我们'));
  
  // 创建主内容区域
  const main = new UIContainer('main')
    .setStyle('padding', '20px');
  
  // 创建侧边栏
  const sidebar = new UIContainer('sidebar')
    .setStyle('float', 'left')
    .setStyle('width', '25%')
    .setStyle('padding', '15px')
    .setStyle('background-color', '#f1f1f1');
  
  sidebar.add(new UIElement('sidebar-title', 'h3').setContent('侧边栏'));
  sidebar.add(new UIElement('sidebar-item-1', 'p').setContent('侧边栏项目 1'));
  sidebar.add(new UIElement('sidebar-item-2', 'p').setContent('侧边栏项目 2'));
  
  // 创建内容区域
  const content = new UIContainer('content')
    .setStyle('float', 'left')
    .setStyle('width', '75%')
    .setStyle('padding', '15px');
  
  content.add(new UIElement('content-title', 'h2').setContent('欢迎来到我的网站'));
  content.add(new UIElement('content-paragraph', 'p').setContent('这是网站的主要内容区域。'));
  
  // 创建表单
  const form = new UIForm('contact-form')
    .setMethod('POST')
    .setAction('/submit')
    .setStyle('margin-top', '20px')
    .setStyle('padding', '15px')
    .setStyle('border', '1px solid #ddd');
  
  form.add(new UIElement('form-title', 'h3').setContent('联系我们'));
  form.add(new UIElement('name-label', 'label').setAttribute('for', 'name').setContent('姓名:'));
  form.add(new UIElement('name-input', 'input').setAttribute('type', 'text').setAttribute('id', 'name'));
  form.add(new UIElement('email-label', 'label').setAttribute('for', 'email').setContent('邮箱:'));
  form.add(new UIElement('email-input', 'input').setAttribute('type', 'email').setAttribute('id', 'email'));
  form.add(new UIElement('submit-button', 'button').setAttribute('type', 'submit').setContent('提交'));
  
  content.add(form);
  
  // 创建页脚
  const footer = new UIContainer('footer')
    .setStyle('background-color', '#333')
    .setStyle('color', 'white')
    .setStyle('padding', '15px')
    .setStyle('text-align', 'center')
    .setStyle('clear', 'both');
  
  footer.add(new UIElement('footer-text', 'p').setContent('© 2023 My Website. All rights reserved.'));
  
  // 构建页面结构
  main.add(sidebar);
  main.add(content);
  
  page.add(header);
  page.add(nav);
  page.add(main);
  page.add(footer);
  
  // 渲染页面
  console.log("\n1. 完整UI组件树渲染:");
  page.render();
  
  // 查找元素
  console.log("\n2. 查找元素:");
  const foundElement = page.findById('contact-form');
  if (foundElement) {
    console.log(`找到元素: ${foundElement.id} (${foundElement.type})`);
  }
  
  // 修改样式
  console.log("\n3. 修改表单样式:");
  foundElement.setStyle('background-color', '#f9f9f9');
  foundElement.setStyle('border-radius', '5px');
  foundElement.render(2);
  
  // 应用样式到所有元素
  console.log("\n4. 应用样式到所有表单元素:");
  form.applyStyleToAll({
    'font-size': '14px',
    'margin-bottom': '10px'
  });
  form.render(2);
  
  // 移除元素
  console.log("\n5. 从表单移除元素:");
  form.removeById('form-title');
  form.render(2);
}

// 执行演示
compositePatternDemo();
uiComponentTreeDemo();

## 4. 装饰器模式 (Decorator)

### 4.1 意图

动态地给一个对象添加一些额外的职责。装饰器模式相比生成子类更为灵活。

### 4.2 结构

装饰器模式包含以下角色：

- **组件 (Component)**：定义对象的接口，可以给这些对象动态地添加职责
- **具体组件 (ConcreteComponent)**：定义具体的对象，装饰器可以给它添加一些职责
- **装饰器 (Decorator)**：持有一个组件对象的引用，并定义一个与组件接口一致的接口
- **具体装饰器 (ConcreteDecorator)**：向组件添加新的职责

### 4.3 实现示例

```javascript
// 组件接口
class Coffee {
  getDescription() {
    throw new Error('子类必须实现getDescription方法');
  }
  
  getCost() {
    throw new Error('子类必须实现getCost方法');
  }
}

// 具体组件：简单咖啡
class SimpleCoffee extends Coffee {
  getDescription() {
    return '简单咖啡';
  }
  
  getCost() {
    return 10;
  }
}

// 装饰器抽象类
class CoffeeDecorator extends Coffee {
  constructor(coffee) {
    super();
    this.coffee = coffee;
  }
  
  getDescription() {
    return this.coffee.getDescription();
  }
  
  getCost() {
    return this.coffee.getCost();
  }
}

// 具体装饰器：牛奶
class MilkDecorator extends CoffeeDecorator {
  getDescription() {
    return `${super.getDescription()}, 加牛奶`;
  }
  
  getCost() {
    return super.getCost() + 2;
  }
}

// 具体装饰器：糖
class SugarDecorator extends CoffeeDecorator {
  getDescription() {
    return `${super.getDescription()}, 加糖`;
  }
  
  getCost() {
    return super.getCost() + 1;
  }
}

// 具体装饰器：巧克力
class ChocolateDecorator extends CoffeeDecorator {
  getDescription() {
    return `${super.getDescription()}, 加巧克力`;
  }
  
  getCost() {
    return super.getCost() + 3;
  }
}

// 具体装饰器：奶油
class CreamDecorator extends CoffeeDecorator {
  getDescription() {
    return `${super.getDescription()}, 加奶油`;
  }
  
  getCost() {
    return super.getCost() + 4;
  }
}

// 具体装饰器：肉桂
class CinnamonDecorator extends CoffeeDecorator {
  getDescription() {
    return `${super.getDescription()}, 加肉桂`;
  }
  
  getCost() {
    return super.getCost() + 1.5;
  }
}

// 客户端代码：使用装饰器模式
function decoratorPatternDemo() {
  console.log("\n\n装饰器模式演示 - 咖啡订单");
  
  // 创建一个简单咖啡
  let coffee = new SimpleCoffee();
  console.log(`1. ${coffee.getDescription()}: ¥${coffee.getCost()}`);
  
  // 添加牛奶
  coffee = new MilkDecorator(coffee);
  console.log(`2. ${coffee.getDescription()}: ¥${coffee.getCost()}`);
  
  // 添加糖
  coffee = new SugarDecorator(coffee);
  console.log(`3. ${coffee.getDescription()}: ¥${coffee.getCost()}`);
  
  // 创建一个新的咖啡并添加多种配料
  let fancyCoffee = new ChocolateDecorator(
    new CreamDecorator(
      new MilkDecorator(
        new SimpleCoffee()
      )
    )
  );
  console.log(`4. ${fancyCoffee.getDescription()}: ¥${fancyCoffee.getCost()}`);
  
  // 创建一个特殊口味的咖啡
  let specialCoffee = new CinnamonDecorator(
    new ChocolateDecorator(
      new SugarDecorator(
        new SimpleCoffee()
      )
    )
  );
  console.log(`5. ${specialCoffee.getDescription()}: ¥${specialCoffee.getCost()}`);
  
  // 展示所有可能的组合（部分示例）
  console.log("\n6. 更多咖啡组合:");
  
  const milkCoffee = new MilkDecorator(new SimpleCoffee());
  console.log(`   ${milkCoffee.getDescription()}: ¥${milkCoffee.getCost()}`);
  
  const chocolateMilkCoffee = new ChocolateDecorator(milkCoffee);
  console.log(`   ${chocolateMilkCoffee.getDescription()}: ¥${chocolateMilkCoffee.getCost()}`);
  
  const sugarChocolateCoffee = new SugarDecorator(
    new ChocolateDecorator(new SimpleCoffee())
  );
  console.log(`   ${sugarChocolateCoffee.getDescription()}: ¥${sugarChocolateCoffee.getCost()}`);
}

// 实际应用场景：表单验证装饰器

// 组件接口
class FormField {
  constructor(name) {
    this.name = name;
    this.value = '';
    this.errors = [];
  }
  
  setValue(value) {
    this.value = value;
    return this;
  }
  
  validate() {
    this.errors = [];
    return this.isValid();
  }
  
  isValid() {
    return this.errors.length === 0;
  }
  
  getErrors() {
    return [...this.errors];
  }
  
  getName() {
    return this.name;
  }
  
  getValue() {
    return this.value;
  }
}

// 具体组件：基本表单字段
class BaseFormField extends FormField {
  validate() {
    super.validate();
    // 基础字段不需要特殊验证
    return this.isValid();
  }
}

// 装饰器抽象类
class FormFieldValidator extends FormField {
  constructor(field) {
    super(field.getName());
    this.field = field;
    this.value = field.getValue();
  }
  
  setValue(value) {
    this.field.setValue(value);
    this.value = value;
    return this;
  }
  
  validate() {
    // 首先让被装饰的字段进行验证
    this.field.validate();
    
    // 收集被装饰字段的错误
    this.errors = this.field.getErrors();
    
    // 添加当前装饰器的验证逻辑
    this.validateField();
    
    return this.isValid();
  }
  
  validateField() {
    // 子类实现具体验证逻辑
  }
}

// 具体装饰器：必填验证
class RequiredValidator extends FormFieldValidator {
  validateField() {
    if (!this.value || this.value.trim() === '') {
      this.errors.push(`${this.name} 是必填字段`);
    }
  }
}

// 具体装饰器：最小长度验证
class MinLengthValidator extends FormFieldValidator {
  constructor(field, minLength) {
    super(field);
    this.minLength = minLength;
  }
  
  validateField() {
    if (this.value && this.value.length < this.minLength) {
      this.errors.push(`${this.name} 长度不能少于 ${this.minLength} 个字符`);
    }
  }
}

// 具体装饰器：最大长度验证
class MaxLengthValidator extends FormFieldValidator {
  constructor(field, maxLength) {
    super(field);
    this.maxLength = maxLength;
  }
  
  validateField() {
    if (this.value && this.value.length > this.maxLength) {
      this.errors.push(`${this.name} 长度不能超过 ${this.maxLength} 个字符`);
    }
  }
}

// 具体装饰器：邮箱验证
class EmailValidator extends FormFieldValidator {
  validateField() {
    if (this.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.value)) {
        this.errors.push(`${this.name} 不是有效的邮箱地址`);
      }
    }
  }
}

// 具体装饰器：数字验证
class NumberValidator extends FormFieldValidator {
  validateField() {
    if (this.value && isNaN(Number(this.value))) {
      this.errors.push(`${this.name} 必须是数字`);
    }
  }
}

// 具体装饰器：自定义正则验证
class PatternValidator extends FormFieldValidator {
  constructor(field, pattern, errorMessage) {
    super(field);
    this.pattern = pattern;
    this.errorMessage = errorMessage;
  }
  
  validateField() {
    if (this.value && !this.pattern.test(this.value)) {
      this.errors.push(this.errorMessage);
    }
  }
}

// 表单类来管理多个字段
class Form {
  constructor() {
    this.fields = {};
  }
  
  addField(field) {
    this.fields[field.getName()] = field;
    return this;
  }
  
  getField(name) {
    return this.fields[name];
  }
  
  setValue(name, value) {
    if (this.fields[name]) {
      this.fields[name].setValue(value);
    }
    return this;
  }
  
  validate() {
    let isValid = true;
    
    Object.values(this.fields).forEach(field => {
      if (!field.validate()) {
        isValid = false;
      }
    });
    
    return isValid;
  }
  
  getErrors() {
    const errors = {};
    
    Object.entries(this.fields).forEach(([name, field]) => {
      const fieldErrors = field.getErrors();
      if (fieldErrors.length > 0) {
        errors[name] = fieldErrors;
      }
    });
    
    return errors;
  }
  
  getData() {
    const data = {};
    
    Object.entries(this.fields).forEach(([name, field]) => {
      data[name] = field.getValue();
    });
    
    return data;
  }
}

// 测试表单验证装饰器
function formValidationDemo() {
  console.log("\n\n装饰器模式演示 - 表单验证");
  
  // 创建表单
  const userForm = new Form();
  
  // 添加带验证器的字段
  userForm
    .addField(new RequiredValidator(
      new MinLengthValidator(
        new MaxLengthValidator(
          new BaseFormField('username'),
          20
        ),
        3
      )
    ))
    .addField(new RequiredValidator(
      new EmailValidator(
        new BaseFormField('email')
      )
    ))
    .addField(new RequiredValidator(
      new MinLengthValidator(
        new PatternValidator(
          new BaseFormField('password'),
          /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
          '密码必须至少包含8个字符，且包含字母和数字'
        ),
        8
      )
    ))
    .addField(new NumberValidator(
      new BaseFormField('age')
    ));
  
  // 测试1：空表单
  console.log("\n1. 测试空表单:");
  userForm.validate();
  console.log("错误信息:", userForm.getErrors());
  
  // 测试2：无效输入
  console.log("\n2. 测试无效输入:");
  userForm
    .setValue('username', 'ab')
    .setValue('email', 'invalid-email')
    .setValue('password', '12345')
    .setValue('age', 'twenty');
  
  userForm.validate();
  console.log("错误信息:", userForm.getErrors());
  
  // 测试3：部分有效输入
  console.log("\n3. 测试部分有效输入:");
  userForm
    .setValue('username', 'john_doe')
    .setValue('email', 'john.doe@example.com')
    .setValue('password', 'weak');
  
  userForm.validate();
  console.log("错误信息:", userForm.getErrors());
  
  // 测试4：有效输入
  console.log("\n4. 测试有效输入:");
  userForm
    .setValue('username', 'john_doe')
    .setValue('email', 'john.doe@example.com')
    .setValue('password', 'Password123')
    .setValue('age', '30');
  
  const isValid = userForm.validate();
  console.log("表单是否有效:", isValid);
  if (isValid) {
    console.log("表单数据:", userForm.getData());
  } else {
    console.log("错误信息:", userForm.getErrors());
  }
  
  // 测试5：动态添加更多验证
  console.log("\n5. 动态添加更多验证:");
  const usernameField = userForm.getField('username');
  // 给用户名添加自定义验证：不能包含特殊字符
  const enhancedUsernameField = new PatternValidator(
    usernameField,
    /^[a-zA-Z0-9_]+$/,
    '用户名只能包含字母、数字和下划线'
  );
  userForm.addField(enhancedUsernameField);
  
  // 测试带特殊字符的用户名
  userForm.setValue('username', 'john.doe');
  userForm.validate();
  console.log("错误信息:", userForm.getErrors());
  
  // 修正用户名
  userForm.setValue('username', 'john_doe');
  console.log("表单是否有效:", userForm.validate());
}

// 执行演示
decoratorPatternDemo();
formValidationDemo();

## 5. 外观模式 (Facade)

### 5.1 意图

为子系统中的一组接口提供一个一致的界面，外观模式定义了一个高层接口，这个接口使得这一子系统更加容易使用。

### 5.2 结构

外观模式包含以下角色：

- **外观 (Facade)**：提供一个统一的接口，用来访问子系统中的一群接口
- **子系统 (Subsystem)**：实现子系统的功能，处理外观对象指派的任务，对子系统来说，外观对象仅仅是另一个客户端

### 5.3 实现示例

```javascript
// 子系统1：音频系统
class AudioSystem {
  constructor() {
    this.volume = 50;
    this.isMuted = false;
    console.log('音频系统初始化...');
  }
  
  powerOn() {
    console.log('音频系统已开启');
  }
  
  powerOff() {
    console.log('音频系统已关闭');
  }
  
  setVolume(level) {
    this.volume = Math.max(0, Math.min(100, level));
    console.log(`音量设置为 ${this.volume}%`);
  }
  
  mute() {
    this.isMuted = true;
    console.log('音频已静音');
  }
  
  unmute() {
    this.isMuted = false;
    console.log('音频已取消静音');
  }
}

// 子系统2：视频系统
class VideoSystem {
  constructor() {
    this.brightness = 70;
    this.contrast = 50;
    console.log('视频系统初始化...');
  }
  
  powerOn() {
    console.log('视频系统已开启');
  }
  
  powerOff() {
    console.log('视频系统已关闭');
  }
  
  setBrightness(level) {
    this.brightness = Math.max(0, Math.min(100, level));
    console.log(`亮度设置为 ${this.brightness}%`);
  }
  
  setContrast(level) {
    this.contrast = Math.max(0, Math.min(100, level));
    console.log(`对比度设置为 ${this.contrast}%`);
  }
}

// 子系统3：灯光系统
class LightingSystem {
  constructor() {
    this.lightLevel = 100; // 默认最亮
    console.log('灯光系统初始化...');
  }
  
  dimLights(level) {
    this.lightLevel = Math.max(0, Math.min(100, level));
    console.log(`灯光调暗至 ${this.lightLevel}%`);
  }
  
  turnOnLights() {
    this.lightLevel = 100;
    console.log('灯光已开启');
  }
}

// 子系统4：投影系统
class ProjectorSystem {
  constructor() {
    this.isOn = false;
    console.log('投影系统初始化...');
  }
  
  powerOn() {
    this.isOn = true;
    console.log('投影仪已开启');
  }
  
  powerOff() {
    this.isOn = false;
    console.log('投影仪已关闭');
  }
  
  selectInput(source) {
    if (!this.isOn) {
      console.log('投影仪未开启，无法选择输入源');
      return;
    }
    console.log(`输入源已切换至 ${source}`);
  }
  
  setResolution(resolution) {
    if (!this.isOn) {
      console.log('投影仪未开启，无法设置分辨率');
      return;
    }
    console.log(`分辨率已设置为 ${resolution}`);
  }
}

// 外观类：家庭影院外观
class HomeTheaterFacade {
  constructor() {
    this.audioSystem = new AudioSystem();
    this.videoSystem = new VideoSystem();
    this.lightingSystem = new LightingSystem();
    this.projectorSystem = new ProjectorSystem();
    console.log('家庭影院系统已初始化');
  }
  
  // 一键观看电影模式
  watchMovie() {
    console.log('\n准备观看电影...');
    
    // 按顺序开启各个子系统
    this.audioSystem.powerOn();
    this.videoSystem.powerOn();
    this.projectorSystem.powerOn();
    
    // 设置适当的参数
    this.audioSystem.setVolume(70);
    this.audioSystem.unmute();
    this.videoSystem.setBrightness(80);
    this.videoSystem.setContrast(60);
    this.projectorSystem.selectInput('蓝光播放器');
    this.projectorSystem.setResolution('4K');
    
    // 调暗灯光以获得更好的观影体验
    this.lightingSystem.dimLights(20);
    
    console.log('电影模式已准备就绪！');
  }
  
  // 一键游戏模式
  playGame() {
    console.log('\n准备游戏...');
    
    // 按顺序开启各个子系统
    this.audioSystem.powerOn();
    this.videoSystem.powerOn();
    this.projectorSystem.powerOn();
    
    // 设置适合游戏的参数
    this.audioSystem.setVolume(80);
    this.audioSystem.unmute();
    this.videoSystem.setBrightness(90);
    this.videoSystem.setContrast(75);
    this.projectorSystem.selectInput('游戏机');
    this.projectorSystem.setResolution('1080p'); // 游戏可能需要更高的帧率
    
    // 游戏时光线可以亮一些
    this.lightingSystem.dimLights(50);
    
    console.log('游戏模式已准备就绪！');
  }
  
  // 一键看电视模式
  watchTV() {
    console.log('\n准备看电视...');
    
    // 只开启必要的子系统
    this.audioSystem.powerOn();
    this.videoSystem.powerOn();
    
    // 设置适合看电视的参数
    this.audioSystem.setVolume(60);
    this.audioSystem.unmute();
    this.videoSystem.setBrightness(70);
    this.videoSystem.setContrast(50);
    
    // 看电视时光线可以正常
    this.lightingSystem.turnOnLights();
    
    console.log('电视模式已准备就绪！');
  }
  
  // 一键关闭所有系统
  endExperience() {
    console.log('\n正在关闭所有系统...');
    
    // 按顺序关闭各个子系统
    this.projectorSystem.powerOff();
    this.videoSystem.powerOff();
    this.audioSystem.powerOff();
    
    // 开启灯光
    this.lightingSystem.turnOnLights();
    
    console.log('所有系统已关闭！');
  }
  
  // 提供对子系统的直接访问，以便高级用户进行自定义设置
  getAudioSystem() {
    return this.audioSystem;
  }
  
  getVideoSystem() {
    return this.videoSystem;
  }
  
  getLightingSystem() {
    return this.lightingSystem;
  }
  
  getProjectorSystem() {
    return this.projectorSystem;
  }
}

// 客户端代码：使用外观模式
function facadePatternDemo() {
  console.log("\n\n外观模式演示 - 家庭影院系统");
  
  // 创建家庭影院外观
  const homeTheater = new HomeTheaterFacade();
  
  // 使用外观提供的高级功能
  homeTheater.watchMovie();
  
  // 观看一段时间后结束
  setTimeout(() => {
    homeTheater.endExperience();
    
    // 之后想玩游戏
    setTimeout(() => {
      homeTheater.playGame();
      
      // 游戏后想看电视
      setTimeout(() => {
        homeTheater.endExperience();
        
        setTimeout(() => {
          homeTheater.watchTV();
          
          // 最终关闭所有系统
          setTimeout(() => {
            homeTheater.endExperience();
          }, 3000);
        }, 3000);
      }, 3000);
    }, 3000);
  }, 3000);
}

// 实际应用场景：API外观模式

// 子系统1：用户API
class UserAPI {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }
  
  async fetchUser(id) {
    console.log(`[UserAPI] 正在获取用户 ${id} 的数据`);
    // 模拟API调用
    return {
      id,
      name: `用户 ${id}`,
      email: `user${id}@example.com`,
      createdAt: new Date().toISOString()
    };
  }
  
  async updateUser(id, data) {
    console.log(`[UserAPI] 正在更新用户 ${id} 的数据`, data);
    // 模拟API调用
    return { id, ...data, updatedAt: new Date().toISOString() };
  }
}

// 子系统2：产品API
class ProductAPI {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }
  
  async fetchProducts(category) {
    console.log(`[ProductAPI] 正在获取 ${category || '所有'} 类别的产品`);
    // 模拟API调用
    return [
      { id: 1, name: '产品1', price: 99.99, category: category || '电子' },
      { id: 2, name: '产品2', price: 199.99, category: category || '电子' }
    ];
  }
  
  async fetchProduct(id) {
    console.log(`[ProductAPI] 正在获取产品 ${id} 的详情`);
    // 模拟API调用
    return {
      id,
      name: `产品 ${id}`,
      price: 99.99 + id * 10,
      description: `这是产品 ${id} 的详细描述`,
      images: [`/images/product${id}_1.jpg`, `/images/product${id}_2.jpg`]
    };
  }
}

// 子系统3：订单API
class OrderAPI {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }
  
  async createOrder(userId, products) {
    console.log(`[OrderAPI] 正在为用户 ${userId} 创建订单`, products);
    // 模拟API调用
    const orderId = Math.floor(Math.random() * 10000);
    return {
      id: orderId,
      userId,
      products,
      total: products.reduce((sum, p) => sum + p.price * p.quantity, 0),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
  }
  
  async fetchUserOrders(userId) {
    console.log(`[OrderAPI] 正在获取用户 ${userId} 的订单`);
    // 模拟API调用
    return [
      {
        id: 1,
        userId,
        total: 299.97,
        status: 'completed',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        userId,
        total: 149.99,
        status: 'pending',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  }
}

// 子系统4：购物车API
class CartAPI {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }
  
  async getCart(userId) {
    console.log(`[CartAPI] 正在获取用户 ${userId} 的购物车`);
    // 模拟API调用
    return {
      userId,
      items: [
        { productId: 1, quantity: 2, price: 99.99 },
        { productId: 2, quantity: 1, price: 199.99 }
      ],
      updatedAt: new Date().toISOString()
    };
  }
  
  async addToCart(userId, productId, quantity = 1) {
    console.log(`[CartAPI] 正在为用户 ${userId} 添加产品 ${productId} 到购物车，数量：${quantity}`);
    // 模拟API调用
    return { success: true };
  }
}

// 外观类：电子商务API外观
class ECommerceAPIFacade {
  constructor(config = {}) {
    const baseURL = config.baseURL || 'https://api.example.com';
    
    this.userAPI = new UserAPI(`${baseURL}/users`);
    this.productAPI = new ProductAPI(`${baseURL}/products`);
    this.orderAPI = new OrderAPI(`${baseURL}/orders`);
    this.cartAPI = new CartAPI(`${baseURL}/cart`);
    
    console.log('电子商务API外观已初始化');
  }
  
  // 高级功能1：用户购买产品流程
  async purchaseProduct(userId, productId, quantity = 1) {
    try {
      console.log(`\n开始购买流程：用户 ${userId} 购买产品 ${productId}，数量：${quantity}`);
      
      // 1. 获取产品信息
      const product = await this.productAPI.fetchProduct(productId);
      
      // 2. 添加到购物车
      await this.cartAPI.addToCart(userId, productId, quantity);
      
      // 3. 创建订单
      const order = await this.orderAPI.createOrder(userId, [
        { ...product, quantity }
      ]);
      
      console.log('购买流程完成！订单ID:', order.id);
      return order;
    } catch (error) {
      console.error('购买流程失败:', error);
      throw error;
    }
  }
  
  // 高级功能2：获取用户仪表板数据
  async getUserDashboardData(userId) {
    try {
      console.log(`\n获取用户仪表板数据：用户 ${userId}`);
      
      // 并行获取用户数据
      const [user, orders, cart] = await Promise.all([
        this.userAPI.fetchUser(userId),
        this.orderAPI.fetchUserOrders(userId),
        this.cartAPI.getCart(userId)
      ]);
      
      // 计算购物车总金额
      const cartTotal = cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity, 
        0
      );
      
      // 组合仪表板数据
      const dashboardData = {
        user,
        orders: {
          recent: orders.slice(0, 3),
          totalCount: orders.length
        },
        cart: {
          items: cart.items,
          total: cartTotal,
          itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0)
        },
        recommendations: await this.productAPI.fetchProducts('推荐')
      };
      
      console.log('获取用户仪表板数据完成');
      return dashboardData;
    } catch (error) {
      console.error('获取仪表板数据失败:', error);
      throw error;
    }
  }
  
  // 高级功能3：快速结账流程
  async quickCheckout(userId) {
    try {
      console.log(`\n开始快速结账流程：用户 ${userId}`);
      
      // 1. 获取购物车数据
      const cart = await this.cartAPI.getCart(userId);
      
      // 2. 获取每个产品的详细信息
      const productDetails = await Promise.all(
        cart.items.map(item => this.productAPI.fetchProduct(item.productId))
      );
      
      // 3. 创建订单（合并产品详情和数量）
      const productsWithQuantity = productDetails.map(product => {
        const cartItem = cart.items.find(item => item.productId === product.id);
        return { ...product, quantity: cartItem.quantity };
      });
      
      const order = await this.orderAPI.createOrder(userId, productsWithQuantity);
      
      console.log('快速结账流程完成！订单ID:', order.id);
      return order;
    } catch (error) {
      console.error('快速结账流程失败:', error);
      throw error;
    }
  }
  
  // 提供对子系统的直接访问
  getUserAPI() {
    return this.userAPI;
  }
  
  getProductAPI() {
    return this.productAPI;
  }
  
  getOrderAPI() {
    return this.orderAPI;
  }
  
  getCartAPI() {
    return this.cartAPI;
  }
}

// 客户端代码：使用API外观
async function apiFacadeDemo() {
  console.log("\n\n外观模式演示 - 电子商务API");
  
  // 创建API外观
  const ecommerceAPI = new ECommerceAPIFacade();
  
  // 1. 购买产品
  const order = await ecommerceAPI.purchaseProduct(123, 1, 2);
  console.log('购买订单:', order);
  
  // 2. 获取用户仪表板数据
  const dashboardData = await ecommerceAPI.getUserDashboardData(123);
  console.log('仪表板数据摘要:');
  console.log('- 用户名:', dashboardData.user.name);
  console.log('- 订单总数:', dashboardData.orders.totalCount);
  console.log('- 购物车商品数:', dashboardData.cart.itemCount);
  console.log('- 购物车总金额:', dashboardData.cart.total);
  
  // 3. 快速结账
  const checkoutOrder = await ecommerceAPI.quickCheckout(123);
  console.log('快速结账订单:', checkoutOrder);
  
  // 4. 直接使用子系统（高级用法）
  console.log('\n使用底层API获取特定产品信息:');
  const productAPI = ecommerceAPI.getProductAPI();
  const specificProduct = await productAPI.fetchProduct(2);
  console.log('特定产品:', specificProduct);
}

// 执行演示
facadePatternDemo();
// 异步演示
setTimeout(() => {
  apiFacadeDemo().catch(console.error);
}, 15000);

## 6. 享元模式 (Flyweight)

### 6.1 意图

运用共享技术有效地支持大量细粒度对象。享元模式通过共享多个对象所共有的相同状态，来节省内存。

### 6.2 结构

享元模式包含以下角色：

- **享元工厂 (Flyweight Factory)**：创建并管理享元对象，确保合理共享享元对象
- **抽象享元 (Flyweight)**：为享元对象定义接口，通过这个接口可以接受并作用于外部状态
- **具体享元 (Concrete Flyweight)**：实现抽象享元接口，同时存储内部状态
- **非共享具体享元 (Unshared Concrete Flyweight)**：不需要共享的享元实现
- **客户端 (Client)**：维护对享元对象的引用，并在使用享元对象时提供必要的外部状态

### 6.3 实现示例

```javascript
// 享元接口
class Shape {
  constructor(color) {
    this.color = color; // 内部状态：可以共享
  }
  
  // 外部状态通过参数传递，不存储在对象内部
  draw(x, y, width, height) {
    throw new Error('子类必须实现draw方法');
  }
}

// 具体享元：圆形
class Circle extends Shape {
  draw(x, y, width, height) {
    console.log(`绘制圆形: 颜色=${this.color}, 位置=(${x},${y}), 尺寸=${width}x${height}`);
  }
}

// 具体享元：矩形
class Rectangle extends Shape {
  draw(x, y, width, height) {
    console.log(`绘制矩形: 颜色=${this.color}, 位置=(${x},${y}), 尺寸=${width}x${height}`);
  }
}

// 具体享元：三角形
class Triangle extends Shape {
  draw(x, y, width, height) {
    console.log(`绘制三角形: 颜色=${this.color}, 位置=(${x},${y}), 尺寸=${width}x${height}`);
  }
}

// 享元工厂：形状工厂
class ShapeFactory {
  constructor() {
    this.shapes = {}; // 存储共享的形状对象
    this.createdCount = 0; // 统计创建的对象数量
  }
  
  // 获取形状对象，如果已存在则复用，否则创建新对象
  getShape(type, color) {
    const key = `${type}_${color}`;
    
    if (!this.shapes[key]) {
      // 创建新的形状对象
      switch (type) {
        case 'circle':
          this.shapes[key] = new Circle(color);
          break;
        case 'rectangle':
          this.shapes[key] = new Rectangle(color);
          break;
        case 'triangle':
          this.shapes[key] = new Triangle(color);
          break;
        default:
          throw new Error(`未知的形状类型: ${type}`);
      }
      this.createdCount++;
      console.log(`创建新的${type}对象，颜色: ${color}, 当前对象总数: ${this.createdCount}`);
    }
    
    return this.shapes[key];
  }
  
  // 获取缓存的形状对象数量
  getCacheSize() {
    return Object.keys(this.shapes).length;
  }
}

// 图形客户端：用于绘制图形
class GraphicClient {
  constructor() {
    this.shapeFactory = new ShapeFactory();
    this.shapesToDraw = []; // 存储需要绘制的图形及其外部状态
  }
  
  // 添加要绘制的图形
  addShape(type, color, x, y, width, height) {
    // 从工厂获取形状对象（可能是复用的）
    const shape = this.shapeFactory.getShape(type, color);
    
    // 存储形状对象和外部状态
    this.shapesToDraw.push({
      shape,
      x,
      y,
      width,
      height
    });
  }
  
  // 绘制所有图形
  drawAll() {
    console.log(`\n开始绘制所有图形（共${this.shapesToDraw.length}个）...`);
    console.log(`共享对象数量: ${this.shapeFactory.getCacheSize()}`);
    
    this.shapesToDraw.forEach(({ shape, x, y, width, height }, index) => {
      console.log(`绘制图形 ${index + 1}:`);
      shape.draw(x, y, width, height);
    });
  }
  
  // 重置画布
  clear() {
    this.shapesToDraw = [];
    console.log('画布已清空');
  }
}

// 测试基本的享元模式
function flyweightPatternDemo() {
  console.log("\n\n享元模式演示 - 图形渲染系统");
  
  // 创建图形客户端
  const graphicClient = new GraphicClient();
  
  // 添加各种图形
  graphicClient.addShape('circle', 'red', 10, 10, 50, 50);
  graphicClient.addShape('circle', 'blue', 100, 100, 30, 30);
  graphicClient.addShape('circle', 'red', 200, 200, 40, 40); // 复用红色圆形
  graphicClient.addShape('rectangle', 'green', 50, 50, 100, 70);
  graphicClient.addShape('rectangle', 'blue', 150, 150, 80, 80);
  graphicClient.addShape('triangle', 'yellow', 250, 50, 60, 60);
  graphicClient.addShape('triangle', 'green', 300, 150, 90, 90);
  graphicClient.addShape('circle', 'yellow', 350, 250, 45, 45);
  graphicClient.addShape('rectangle', 'red', 400, 100, 70, 100);
  graphicClient.addShape('triangle', 'blue', 100, 250, 85, 85);
  graphicClient.addShape('circle', 'red', 500, 50, 35, 35); // 复用红色圆形
  graphicClient.addShape('rectangle', 'green', 450, 200, 90, 60); // 复用绿色矩形
  graphicClient.addShape('triangle', 'yellow', 350, 300, 70, 70); // 复用黄色三角形
  
  // 绘制所有图形
  graphicClient.drawAll();
  
  // 演示内存节省
  const totalShapes = graphicClient.shapesToDraw.length;
  const uniqueObjects = graphicClient.shapeFactory.getCacheSize();
  
  console.log(`\n享元模式内存优化总结:`);
  console.log(`- 总图形数量: ${totalShapes}`);
  console.log(`- 实际创建的对象数量: ${uniqueObjects}`);
  console.log(`- 节省的对象数量: ${totalShapes - uniqueObjects}`);
  console.log(`- 内存节省率: ${Math.round((1 - uniqueObjects / totalShapes) * 100)}%`);
}

// 实际应用场景：文本编辑器字符渲染

// 字符享元接口
class CharacterFlyweight {
  constructor(char) {
    this.char = char; // 内部状态：字符本身
  }
  
  // 渲染字符，外部状态通过参数传递
  render(fontFamily, fontSize, color, x, y) {
    console.log(`渲染字符 '${this.char}': 字体=${fontFamily}, 大小=${fontSize}, 颜色=${color}, 位置=(${x},${y})`);
  }
}

// 字符工厂
class CharacterFactory {
  constructor() {
    this.characters = {};
    this.createdCount = 0;
  }
  
  getCharacter(char) {
    // 字符作为键
    char = char.toLowerCase(); // 不区分大小写，进一步节省内存
    
    if (!this.characters[char]) {
      this.characters[char] = new CharacterFlyweight(char);
      this.createdCount++;
      console.log(`创建新字符对象: '${char}', 当前对象总数: ${this.createdCount}`);
    }
    
    return this.characters[char];
  }
  
  getCacheSize() {
    return Object.keys(this.characters).length;
  }
}

// 文本格式类（外部状态）
class TextStyle {
  constructor(fontFamily = 'Arial', fontSize = 12, color = 'black') {
    this.fontFamily = fontFamily;
    this.fontSize = fontSize;
    this.color = color;
  }
}

// 文本编辑器
class TextEditor {
  constructor() {
    this.characterFactory = new CharacterFactory();
    this.textElements = []; // 存储文本元素及其位置和样式
    this.cursorX = 0;
    this.cursorY = 0;
    this.currentStyle = new TextStyle();
  }
  
  // 设置当前文本样式
  setStyle(fontFamily, fontSize, color) {
    this.currentStyle = new TextStyle(fontFamily, fontSize, color);
    console.log(`文本样式已设置: ${fontFamily}, ${fontSize}px, ${color}`);
  }
  
  // 插入文本
  insertText(text) {
    console.log(`\n插入文本: "${text}"`);
    
    const charWidth = this.currentStyle.fontSize * 0.6; // 估算字符宽度
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      
      if (char === '\n') {
        // 换行处理
        this.cursorY += this.currentStyle.fontSize * 1.5; // 行高
        this.cursorX = 0;
      } else {
        // 获取字符享元对象
        const charFlyweight = this.characterFactory.getCharacter(char);
        
        // 存储字符和其外部状态
        this.textElements.push({
          character: charFlyweight,
          style: { ...this.currentStyle }, // 复制样式对象
          x: this.cursorX,
          y: this.cursorY
        });
        
        // 更新光标位置
        this.cursorX += charWidth;
      }
    }
  }
  
  // 渲染所有文本
  render() {
    console.log(`\n渲染所有文本（共${this.textElements.length}个字符）...`);
    console.log(`共享字符对象数量: ${this.characterFactory.getCacheSize()}`);
    
    // 按位置排序以便正确渲染
    const sortedElements = [...this.textElements].sort((a, b) => {
      if (a.y !== b.y) return a.y - b.y;
      return a.x - b.x;
    });
    
    sortedElements.forEach((element) => {
      const { character, style, x, y } = element;
      character.render(style.fontFamily, style.fontSize, style.color, x, y);
    });
  }
  
  // 计算内存节省
  calculateMemorySavings() {
    const totalChars = this.textElements.length;
    const uniqueChars = this.characterFactory.getCacheSize();
    
    console.log(`\n文本编辑器内存优化总结:`);
    console.log(`- 总字符数量: ${totalChars}`);
    console.log(`- 实际创建的字符对象数量: ${uniqueChars}`);
    console.log(`- 节省的对象数量: ${totalChars - uniqueChars}`);
    console.log(`- 内存节省率: ${Math.round((1 - uniqueChars / totalChars) * 100)}%`);
  }
}

// 测试文本编辑器
function textEditorDemo() {
  console.log("\n\n享元模式演示 - 文本编辑器");
  
  // 创建文本编辑器
  const editor = new TextEditor();
  
  // 设置默认样式并插入文本
  editor.setStyle('Arial', 12, 'black');
  editor.insertText('Hello, ');
  
  // 更改样式
  editor.setStyle('Times New Roman', 14, 'blue');
  editor.insertText('world!');
  
  // 换行
  editor.insertText('\nThis is a ');
  
  // 更改样式
  editor.setStyle('Courier New', 16, 'red');
  editor.insertText('demonstration');
  
  editor.setStyle('Arial', 12, 'black');
  editor.insertText(' of the ');
  
  editor.setStyle('Verdana', 14, 'green');
  editor.insertText('Flyweight Pattern');
  
  editor.setStyle('Arial', 12, 'black');
  editor.insertText(' in text editing applications.');
  
  // 添加更多文本以展示共享效果
  editor.insertText('\nThe flyweight pattern helps reduce memory usage by sharing common objects.');
  editor.insertText('\nIn this example, characters are shared based on their value regardless of styling.');
  
  // 渲染文本
  editor.render();
  
  // 计算内存节省
  editor.calculateMemorySavings();
}

// 实际应用场景：游戏中的粒子系统

// 粒子类型枚举
const ParticleType = {
  FIRE: 'fire',
  SMOKE: 'smoke',
  WATER: 'water',
  SPARKLE: 'sparkle',
  EXPLOSION: 'explosion'
};

// 粒子享元
class ParticleFlyweight {
  constructor(type) {
    this.type = type;
    // 根据类型设置内部状态（共享属性）
    switch (type) {
      case ParticleType.FIRE:
        this.lifetime = 1000; // 生命周期（毫秒）
        this.decayRate = 0.02; // 衰减率
        this.animationSpeed = 15; // 动画速度
        this.image = 'fire.png';
        break;
      case ParticleType.SMOKE:
        this.lifetime = 2000;
        this.decayRate = 0.01;
        this.animationSpeed = 10;
        this.image = 'smoke.png';
        break;
      case ParticleType.WATER:
        this.lifetime = 1500;
        this.decayRate = 0.015;
        this.animationSpeed = 20;
        this.image = 'water.png';
        break;
      case ParticleType.SPARKLE:
        this.lifetime = 800;
        this.decayRate = 0.03;
        this.animationSpeed = 25;
        this.image = 'sparkle.png';
        break;
      case ParticleType.EXPLOSION:
        this.lifetime = 1200;
        this.decayRate = 0.025;
        this.animationSpeed = 30;
        this.image = 'explosion.png';
        break;
      default:
        throw new Error(`未知的粒子类型: ${type}`);
    }
  }
  
  // 更新粒子状态
  update(particle, deltaTime) {
    // 根据粒子类型的特性更新粒子
    particle.lifeRemaining -= deltaTime * this.decayRate;
    particle.size = Math.max(0, particle.size * (1 - this.decayRate * 0.5));
    particle.opacity = Math.max(0, particle.lifeRemaining);
    
    // 更新位置
    particle.x += particle.vx * deltaTime * 0.01;
    particle.y += particle.vy * deltaTime * 0.01;
    
    // 应用重力或其他力
    if (this.type !== ParticleType.SMOKE) {
      particle.vy += 0.2; // 重力效果
    } else {
      particle.vy -= 0.05; // 烟雾上升
    }
    
    // 阻尼效果
    particle.vx *= 0.98;
    particle.vy *= 0.98;
  }
  
  // 渲染粒子
  render(particle) {
    console.log(`渲染粒子: 类型=${this.type}, 位置=(${particle.x.toFixed(1)},${particle.y.toFixed(1)}), 
                 大小=${particle.size.toFixed(1)}, 透明度=${particle.opacity.toFixed(2)}, 
                 速度=(${particle.vx.toFixed(1)},${particle.vy.toFixed(1)})`);
  }
}

// 粒子工厂
class ParticleFactory {
  constructor() {
    this.particleTypes = {};
  }
  
  getParticleType(type) {
    if (!this.particleTypes[type]) {
      this.particleTypes[type] = new ParticleFlyweight(type);
      console.log(`创建新粒子类型: ${type}`);
    }
    return this.particleTypes[type];
  }
  
  getCacheSize() {
    return Object.keys(this.particleTypes).length;
  }
}

// 粒子系统
class ParticleSystem {
  constructor() {
    this.particleFactory = new ParticleFactory();
    this.particles = []; // 存储所有活动的粒子
  }
  
  // 发射单个粒子
  emitParticle(type, x, y, vx = 0, vy = 0, size = 1.0) {
    const particleType = this.particleFactory.getParticleType(type);
    
    // 创建粒子对象，只存储外部状态
    const particle = {
      x,
      y,
      vx,
      vy,
      size,
      lifeRemaining: 1.0, // 归一化的生命值 (0-1)
      opacity: 1.0,
      type: particleType // 引用共享的粒子类型
    };
    
    this.particles.push(particle);
  }
  
  // 发射粒子效果
  emitEffect(type, x, y, count = 50) {
    console.log(`\n发射${type}粒子效果: 位置=(${x},${y}), 数量=${count}`);
    
    for (let i = 0; i < count; i++) {
      // 计算随机速度和大小
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const size = 0.5 + Math.random() * 1.5;
      
      this.emitParticle(type, x, y, vx, vy, size);
    }
  }
  
  // 更新所有粒子
  update(deltaTime) {
    // 更新每个粒子
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      
      // 使用共享的粒子类型来更新粒子
      particle.type.update(particle, deltaTime);
      
      // 移除已死亡的粒子
      if (particle.lifeRemaining <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }
  
  // 渲染所有粒子
  render() {
    console.log(`\n渲染所有粒子（当前活动粒子数: ${this.particles.length}）...`);
    console.log(`共享粒子类型数量: ${this.particleFactory.getCacheSize()}`);
    
    // 渲染前10个粒子作为示例（避免输出过多）
    const particlesToShow = Math.min(10, this.particles.length);
    for (let i = 0; i < particlesToShow; i++) {
      const particle = this.particles[i];
      particle.type.render(particle);
    }
    
    if (this.particles.length > 10) {
      console.log(`... 还有 ${this.particles.length - 10} 个粒子未显示`);
    }
  }
  
  // 获取当前活动粒子数
  getParticleCount() {
    return this.particles.length;
  }
}

// 模拟游戏循环
function gameSimulation() {
  console.log("\n\n享元模式演示 - 游戏粒子系统");
  
  // 创建粒子系统
  const particleSystem = new ParticleSystem();
  
  // 模拟游戏循环
  const simulationSteps = 5;
  const deltaTime = 16; // 约60fps
  
  // 发射一些不同类型的粒子效果
  particleSystem.emitEffect(ParticleType.FIRE, 100, 200, 100);
  particleSystem.emitEffect(ParticleType.SMOKE, 120, 180, 80);
  particleSystem.emitEffect(ParticleType.EXPLOSION, 200, 200, 150);
  
  // 渲染初始状态
  particleSystem.render();
  
  // 模拟几个游戏帧
  for (let step = 1; step <= simulationSteps; step++) {
    console.log(`\n--- 游戏帧 ${step} ---`);
    
    // 更新粒子
    particleSystem.update(deltaTime);
    
    // 在每帧发射一些新粒子
    if (step % 2 === 0) {
      particleSystem.emitEffect(ParticleType.SPARKLE, 150, 220, 30);
    }
    
    if (step % 3 === 0) {
      particleSystem.emitEffect(ParticleType.WATER, 250, 200, 60);
    }
    
    // 渲染粒子
    particleSystem.render();
  }
  
  // 最终统计
  console.log(`\n粒子系统模拟总结:`);
  console.log(`- 共享粒子类型数量: ${particleSystem.particleFactory.getCacheSize()}`);
  console.log(`- 最终活动粒子数量: ${particleSystem.getParticleCount()}`);
  console.log(`\n享元模式使我们能够在游戏中高效地管理数千个粒子，而不会消耗过多内存。`);
  console.log(`所有相同类型的粒子共享其内部状态（如生命周期、衰减率等），每个粒子只存储其唯一的外部状态（如位置、速度等）。`);
}

// 执行演示
flyweightPatternDemo();
textEditorDemo();
gameSimulation();