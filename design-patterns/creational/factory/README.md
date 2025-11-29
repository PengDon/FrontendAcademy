# 工厂模式 (Factory Pattern)

## 什么是工厂模式

工厂模式是一种创建型设计模式，它提供了创建对象的最佳方式，将对象的实例化逻辑与使用代码分离。工厂模式可以分为三种主要类型：简单工厂模式、工厂方法模式和抽象工厂模式。

## 工厂模式的类型

### 1. 简单工厂模式 (Simple Factory)

简单工厂模式不是GoF 23种设计模式之一，但在实际开发中非常常用。它通过一个具体的工厂类来创建不同类型的产品。

#### 简单工厂模式的实现

```javascript
// 产品类
class Pizza {
  constructor() {
    this.name = 'Unknown Pizza';
    this.toppings = [];
    this.crust = 'regular';
    this.sauce = 'tomato';
  }

  prepare() {
    console.log(`准备 ${this.name}`);
    console.log('添加酱汁...');
    console.log('添加配料: ' + this.toppings.join(', '));
  }

  bake() {
    console.log('烘焙 25 分钟，温度 350°C');
  }

  cut() {
    console.log('将披萨切成对角片');
  }

  box() {
    console.log('将披萨装入官方披萨盒');
  }
}

class CheesePizza extends Pizza {
  constructor() {
    super();
    this.name = '奶酪披萨';
    this.toppings = ['马苏里拉奶酪', '帕尔马干酪'];
  }
}

class PepperoniPizza extends Pizza {
  constructor() {
    super();
    this.name = '意大利辣香肠披萨';
    this.toppings = ['马苏里拉奶酪', '意大利辣香肠', '黑胡椒'];
  }
}

class HawaiianPizza extends Pizza {
  constructor() {
    super();
    this.name = '夏威夷披萨';
    this.toppings = ['马苏里拉奶酪', '火腿', '菠萝'];
  }
}

class VeggiePizza extends Pizza {
  constructor() {
    super();
    this.name = '蔬菜披萨';
    this.toppings = ['马苏里拉奶酪', '蘑菇', '洋葱', '青椒', '橄榄'];
  }
}

// 简单工厂
class SimplePizzaFactory {
  createPizza(type) {
    let pizza = null;

    if (type === 'cheese') {
      pizza = new CheesePizza();
    } else if (type === 'pepperoni') {
      pizza = new PepperoniPizza();
    } else if (type === 'hawaiian') {
      pizza = new HawaiianPizza();
    } else if (type === 'veggie') {
      pizza = new VeggiePizza();
    } else {
      throw new Error(`未知的披萨类型: ${type}`);
    }

    return pizza;
  }
}

// 披萨店 - 使用简单工厂
class PizzaStore {
  constructor(factory) {
    this.factory = factory;
  }

  orderPizza(type) {
    // 使用工厂创建披萨，而不是直接实例化
    const pizza = this.factory.createPizza(type);

    // 披萨制作过程
    pizza.prepare();
    pizza.bake();
    pizza.cut();
    pizza.box();

    return pizza;
  }
}

// 使用示例
const factory = new SimplePizzaFactory();
const store = new PizzaStore(factory);

const cheesePizza = store.orderPizza('cheese');
console.log('---\n');

const pepperoniPizza = store.orderPizza('pepperoni');
console.log('---\n');

const hawaiianPizza = store.orderPizza('hawaiian');
```

### 2. 工厂方法模式 (Factory Method)

工厂方法模式定义了一个创建对象的接口，但由子类决定实例化的类。工厂方法让类的实例化延迟到子类中进行。

#### 工厂方法模式的实现

```javascript
// 产品接口
class Document {
  open() {}
  save() {}
  close() {}
}

// 具体产品
class WordDocument extends Document {
  open() {
    console.log('打开Word文档');
  }

  save() {
    console.log('保存Word文档');
  }

  close() {
    console.log('关闭Word文档');
  }
}

class ExcelDocument extends Document {
  open() {
    console.log('打开Excel文档');
  }

  save() {
    console.log('保存Excel文档');
  }

  close() {
    console.log('关闭Excel文档');
  }
}

class PdfDocument extends Document {
  open() {
    console.log('打开PDF文档');
  }

  save() {
    console.log('保存PDF文档');
  }

  close() {
    console.log('关闭PDF文档');
  }
}

// 抽象创建者
class Application {
  // 工厂方法 - 由子类实现
  createDocument() {}

  // 使用工厂方法创建和处理文档
  newDocument() {
    const document = this.createDocument();
    document.open();
    return document;
  }
}

// 具体创建者
class WordApplication extends Application {
  createDocument() {
    return new WordDocument();
  }
}

class ExcelApplication extends Application {
  createDocument() {
    return new ExcelDocument();
  }
}

class PdfApplication extends Application {
  createDocument() {
    return new PdfDocument();
  }
}

// 使用示例
const wordApp = new WordApplication();
const wordDoc = wordApp.newDocument(); // 输出: 打开Word文档
wordDoc.save(); // 输出: 保存Word文档

const excelApp = new ExcelApplication();
const excelDoc = excelApp.newDocument(); // 输出: 打开Excel文档

const pdfApp = new PdfApplication();
const pdfDoc = pdfApp.newDocument(); // 输出: 打开PDF文档
```

### 3. 抽象工厂模式 (Abstract Factory)

抽象工厂模式提供一个接口，用于创建相关或依赖对象的家族，而无需指定它们的具体类。

#### 抽象工厂模式的实现

```javascript
// 抽象产品族
class Button {
  render() {}
  onClick() {}
}

class Checkbox {
  render() {}
  toggle() {}
}

// 具体产品 - Windows风格
class WindowsButton extends Button {
  render() {
    console.log('渲染Windows风格按钮');
    return '<button class="windows-button">';
  }

  onClick(callback) {
    console.log('Windows按钮点击事件绑定');
  }
}

class WindowsCheckbox extends Checkbox {
  constructor() {
    super();
    this.checked = false;
  }

  render() {
    console.log('渲染Windows风格复选框');
    return `<input type="checkbox" class="windows-checkbox" ${this.checked ? 'checked' : ''}>`;
  }

  toggle() {
    this.checked = !this.checked;
    console.log(`Windows复选框状态变为: ${this.checked}`);
  }
}

// 具体产品 - MacOS风格
class MacOSButton extends Button {
  render() {
    console.log('渲染MacOS风格按钮');
    return '<button class="macos-button">';
  }

  onClick(callback) {
    console.log('MacOS按钮点击事件绑定');
  }
}

class MacOSCheckbox extends Checkbox {
  constructor() {
    super();
    this.checked = false;
  }

  render() {
    console.log('渲染MacOS风格复选框');
    return `<input type="checkbox" class="macos-checkbox" ${this.checked ? 'checked' : ''}>`;
  }

  toggle() {
    this.checked = !this.checked;
    console.log(`MacOS复选框状态变为: ${this.checked}`);
  }
}

// 抽象工厂
class GUIFactory {
  createButton() {}
  createCheckbox() {}
}

// 具体工厂
class WindowsFactory extends GUIFactory {
  createButton() {
    return new WindowsButton();
  }

  createCheckbox() {
    return new WindowsCheckbox();
  }
}

class MacOSFactory extends GUIFactory {
  createButton() {
    return new MacOSButton();
  }

  createCheckbox() {
    return new MacOSCheckbox();
  }
}

// 客户端代码
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

  paint() {
    this.button.render();
    this.checkbox.render();
  }
}

// 应用配置
function configureApplication() {
  const osType = getOSType(); // 假设这是一个获取操作系统类型的函数
  let factory;

  if (osType === 'windows') {
    factory = new WindowsFactory();
  } else if (osType === 'macos') {
    factory = new MacOSFactory();
  } else {
    throw new Error(`不支持的操作系统: ${osType}`);
  }

  return new Application(factory);
}

// 模拟获取操作系统类型
function getOSType() {
  // 模拟返回 'windows' 或 'macos'
  return Math.random() > 0.5 ? 'windows' : 'macos';
}

// 使用示例
const app = configureApplication();
app.createUI();
app.paint();
```

## 工厂模式的应用场景

1. **对象创建逻辑复杂**：当创建一个对象涉及复杂的初始化逻辑时
2. **依赖抽象而非具体**：当你想要基于接口编程，而不是基于具体类编程时
3. **产品族创建**：当需要创建一系列相关或相互依赖的产品时
4. **动态决定创建类型**：当需要根据运行时条件决定创建哪种类型的对象时
5. **解耦客户端与具体类**：当你希望客户端代码与具体产品类解耦时

## 工厂模式的优点

1. **封装复杂性**：隐藏对象创建的复杂性
2. **解耦客户端与实现**：客户端只依赖于抽象接口
3. **易于扩展**：可以轻松添加新的产品类型，无需修改客户端代码
4. **一致性**：确保相关产品族一起使用
5. **集中管理**：将对象创建逻辑集中在一个地方

## 工厂模式的缺点

1. **增加了代码复杂度**：需要创建额外的工厂类和接口
2. **违反开闭原则**：对于简单工厂，添加新产品需要修改工厂类
3. **增加了学习成本**：新开发者需要理解多个相关的类和接口
4. **抽象工厂的限制**：添加新的产品类型需要修改抽象工厂接口和所有具体工厂实现

## 工厂模式与其他模式的区别

### 工厂模式 vs 建造者模式

- **工厂模式**：关注对象的创建，不关心创建过程的细节
- **建造者模式**：关注复杂对象的分步构建过程

### 工厂方法 vs 单例模式

- **工厂方法**：创建多个不同的对象实例
- **单例模式**：确保只创建一个对象实例

## 实际应用案例

### 数据库连接工厂

```javascript
// 数据库连接接口
class DatabaseConnection {
  connect() {}
  disconnect() {}
  query(sql) {}
}

// MySQL连接
class MySQLConnection extends DatabaseConnection {
  constructor(config) {
    super();
    this.config = config;
  }

  connect() {
    console.log(`连接到MySQL数据库: ${this.config.host}:${this.config.port}`);
    // 实际连接逻辑
    return this;
  }

  disconnect() {
    console.log('断开MySQL数据库连接');
  }

  query(sql) {
    console.log(`执行MySQL查询: ${sql}`);
    // 实际查询逻辑
    return [{ id: 1, name: '示例数据' }];
  }
}

// PostgreSQL连接
class PostgreSQLConnection extends DatabaseConnection {
  constructor(config) {
    super();
    this.config = config;
  }

  connect() {
    console.log(`连接到PostgreSQL数据库: ${this.config.host}:${this.config.port}`);
    // 实际连接逻辑
    return this;
  }

  disconnect() {
    console.log('断开PostgreSQL数据库连接');
  }

  query(sql) {
    console.log(`执行PostgreSQL查询: ${sql}`);
    // 实际查询逻辑
    return [{ id: 1, name: '示例数据' }];
  }
}

// MongoDB连接
class MongoDBConnection extends DatabaseConnection {
  constructor(config) {
    super();
    this.config = config;
  }

  connect() {
    console.log(`连接到MongoDB数据库: ${this.config.host}:${this.config.port}`);
    // 实际连接逻辑
    return this;
  }

  disconnect() {
    console.log('断开MongoDB数据库连接');
  }

  query(query) {
    console.log(`执行MongoDB查询:`, query);
    // 实际查询逻辑
    return [{ _id: 1, name: '示例数据' }];
  }
}

// 数据库连接工厂
class DatabaseFactory {
  static createConnection(type, config) {
    switch (type.toLowerCase()) {
      case 'mysql':
        return new MySQLConnection(config);
      case 'postgresql':
      case 'postgres':
        return new PostgreSQLConnection(config);
      case 'mongodb':
        return new MongoDBConnection(config);
      default:
        throw new Error(`不支持的数据库类型: ${type}`);
    }
  }
}

// 使用示例
const mysqlConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'mydb'
};

const mysqlConnection = DatabaseFactory.createConnection('mysql', mysqlConfig);
mysqlConnection.connect();
const results = mysqlConnection.query('SELECT * FROM users');
console.log(results);
mysqlConnection.disconnect();

const postgresConfig = {
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'password',
  database: 'mydb'
};

const postgresConnection = DatabaseFactory.createConnection('postgresql', postgresConfig);
postgresConnection.connect();
```

### 日志记录器工厂

```javascript
// 日志记录器接口
class Logger {
  log(message) {}
  info(message) {}
  warn(message) {}
  error(message) {}
}

// 控制台日志记录器
class ConsoleLogger extends Logger {
  log(message) {
    console.log(`[LOG] ${message}`);
  }

  info(message) {
    console.info(`[INFO] ${message}`);
  }

  warn(message) {
    console.warn(`[WARN] ${message}`);
  }

  error(message) {
    console.error(`[ERROR] ${message}`);
  }
}

// 文件日志记录器
class FileLogger extends Logger {
  constructor(filePath) {
    super();
    this.filePath = filePath;
    console.log(`文件日志记录器初始化，日志将写入: ${filePath}`);
  }

  log(message) {
    this.writeToFile(`[LOG] ${message}`);
  }

  info(message) {
    this.writeToFile(`[INFO] ${message}`);
  }

  warn(message) {
    this.writeToFile(`[WARN] ${message}`);
  }

  error(message) {
    this.writeToFile(`[ERROR] ${message}`);
  }

  writeToFile(message) {
    // 实际写入文件的逻辑
    console.log(`写入文件 ${this.filePath}: ${message}`);
  }
}

// 数据库日志记录器
class DatabaseLogger extends Logger {
  constructor(connection) {
    super();
    this.connection = connection;
  }

  log(message) {
    this.saveToDatabase('LOG', message);
  }

  info(message) {
    this.saveToDatabase('INFO', message);
  }

  warn(message) {
    this.saveToDatabase('WARN', message);
  }

  error(message) {
    this.saveToDatabase('ERROR', message);
  }

  saveToDatabase(level, message) {
    // 实际保存到数据库的逻辑
    console.log(`保存到数据库: [${level}] ${message}`);
  }
}

// 日志记录器工厂
class LoggerFactory {
  static getLogger(type, options = {}) {
    switch (type.toLowerCase()) {
      case 'console':
        return new ConsoleLogger();
      case 'file':
        return new FileLogger(options.filePath || './app.log');
      case 'database':
        if (!options.connection) {
          throw new Error('数据库日志记录器需要提供数据库连接');
        }
        return new DatabaseLogger(options.connection);
      default:
        throw new Error(`不支持的日志记录器类型: ${type}`);
    }
  }
}

// 使用示例
const consoleLogger = LoggerFactory.getLogger('console');
consoleLogger.info('这是一条控制台信息日志');
consoleLogger.error('这是一条控制台错误日志');

const fileLogger = LoggerFactory.getLogger('file', { filePath: './app.log' });
fileLogger.info('这是一条文件信息日志');
fileLogger.warn('这是一条文件警告日志');

const mockDbConnection = { /* 模拟数据库连接 */ };
const dbLogger = LoggerFactory.getLogger('database', { connection: mockDbConnection });
dbLogger.info('这是一条数据库信息日志');
```

## 工厂模式在前端框架中的应用

### React组件工厂

```jsx
// UI组件工厂
const ComponentFactory = {
  // 创建按钮组件
  createButton(variant = 'default', size = 'medium', children = '') {
    const baseClasses = ['btn'];
    
    // 根据变体添加类
    baseClasses.push(`btn-${variant}`);
    
    // 根据大小添加类
    baseClasses.push(`btn-${size}`);
    
    return (
      <button className={baseClasses.join(' ')}>
        {children}
      </button>
    );
  },
  
  // 创建卡片组件
  createCard(title = '', content = '', actions = []) {
    return (
      <div className="card">
        {title && <div className="card-title">{title}</div>}
        <div className="card-content">{content}</div>
        {actions.length > 0 && (
          <div className="card-actions">
            {actions.map((action, index) => (
              <button key={index} className={`btn btn-${action.variant || 'default'}`} onClick={action.onClick}>
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  },
  
  // 创建表单字段组件
  createFormField(type = 'text', label = '', name = '', value = '', onChange = () => {}) {
    return (
      <div className="form-field">
        {label && <label htmlFor={name}>{label}</label>}
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="form-input"
        />
      </div>
    );
  }
};

// 使用示例
function UserProfile() {
  return (
    <div className="user-profile">
      {ComponentFactory.createCard(
        '用户信息',
        '这是用户个人信息页面',
        [
          { label: '编辑', variant: 'primary', onClick: () => console.log('编辑') },
          { label: '删除', variant: 'danger', onClick: () => console.log('删除') },
          { label: '取消', variant: 'secondary', onClick: () => console.log('取消') }
        ]
      )}
      
      <form>
        {ComponentFactory.createFormField('text', '用户名', 'username', 'testuser')}
        {ComponentFactory.createFormField('email', '邮箱', 'email', 'user@example.com')}
        {ComponentFactory.createButton('primary', 'large', '保存更改')}
      </form>
    </div>
  );
}
```

## 常见问题与解答

### Q: 如何决定使用哪种工厂模式？
A: 简单工厂适用于创建少量相关产品；工厂方法适用于当产品类型可能扩展时；抽象工厂适用于需要创建多个相关产品族时。

### Q: 工厂模式如何支持依赖注入？
A: 工厂可以作为依赖注入容器的一部分，负责创建和管理对象实例，并将它们注入到需要的组件中。

### Q: 工厂模式与构造函数有什么区别？
A: 构造函数直接创建单个类的实例，而工厂模式可以创建不同类型的对象，并封装复杂的创建逻辑。

### Q: 工厂模式如何实现延迟初始化？
A: 可以在工厂中实现单例或缓存机制，在首次请求时创建对象，并在后续请求中返回相同的实例。

### Q: 工厂模式在JavaScript中有什么特殊实现方式？
A: 在JavaScript中，可以使用函数作为工厂，或者使用对象字面量和闭包来实现工厂功能，更加灵活。