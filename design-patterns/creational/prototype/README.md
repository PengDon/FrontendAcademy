# 原型模式 (Prototype Pattern)

## 什么是原型模式

原型模式是一种创建型设计模式，它允许通过复制现有对象来创建新对象，而不是通过实例化新的类。这种模式特别适用于创建复杂对象或初始化成本高的对象。

在JavaScript中，原型模式是语言本身的核心特性之一，通过原型继承机制实现对象之间的共享属性和方法。

## 原型模式的核心组件

1. **原型接口 (Prototype Interface)**：声明克隆自身的方法
2. **具体原型 (Concrete Prototype)**：实现克隆方法
3. **客户端 (Client)**：通过克隆原型创建新对象

## 原型模式的实现

### 基本实现

```javascript
// 原型接口
class Prototype {
  clone() {}
}

// 具体原型
class ConcretePrototype extends Prototype {
  constructor(name) {
    super();
    this.name = name;
    this.id = Math.random().toString(36).substr(2, 9);
  }

  clone() {
    const clone = new ConcretePrototype(this.name);
    // 复制其他属性
    Object.assign(clone, this);
    return clone;
  }
}

// 客户端代码
function clientCode() {
  const prototype = new ConcretePrototype('原始对象');
  console.log('原型对象:', prototype);

  // 通过克隆创建新对象
  const clone = prototype.clone();
  console.log('克隆对象:', clone);
  console.log('原型和克隆是同一个对象吗?', prototype === clone); // false
}

clientCode();
```

### JavaScript 中的原型模式

JavaScript 原生支持原型继承，我们可以利用 `Object.create()` 方法来实现原型模式。

```javascript
// 使用 Object.create 实现原型模式
const prototype = {
  name: '原型对象',
  greet() {
    console.log(`Hello, I am ${this.name}`);
  },
  clone() {
    // 使用 Object.create 创建基于当前对象的新对象
    const clone = Object.create(this);
    // 可以在这里修改克隆对象的属性
    clone.name = `${this.name} (克隆)`;
    return clone;
  }
};

// 创建克隆
const clone1 = prototype.clone();
const clone2 = prototype.clone();

// 测试
console.log('原型对象:', prototype);
console.log('克隆对象1:', clone1);
console.log('克隆对象2:', clone2);

prototype.greet(); // Hello, I am 原型对象
clone1.greet();    // Hello, I am 原型对象 (克隆)
clone2.greet();    // Hello, I am 原型对象 (克隆)

// 修改克隆对象的属性不会影响原型
clone1.name = '='

// 使用 Object.assign 实现深克隆
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  // 处理日期对象
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  // 处理数组
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }
  
  // 处理普通对象
  const clone = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key]);
    }
  }
  return clone;
}

// 测试深克隆
const complexPrototype = {
  name: '复杂原型',
  data: [1, 2, 3],
  nested: {
    value: '嵌套值',
    items: ['a', 'b', 'c']
  }
};

const deepCloned = deepClone(complexPrototype);

// 修改克隆对象不会影响原型
deepCloned.data.push(4);
deepCloned.nested.value = '修改后的嵌套值';

default: '修改后的名称';

console.log('原型对象数据:', complexPrototype.data); // [1, 2, 3]
console.log('原型对象嵌套值:', complexPrototype.nested.value); // '嵌套值'

console.log('克隆对象数据:', deepCloned.data); // [1, 2, 3, 4]
console.log('克隆对象嵌套值:', deepCloned.nested.value); // '修改后的嵌套值'
```

### 使用 ES6 的扩展运算符进行浅克隆

```javascript
// 使用扩展运算符进行对象浅克隆
const original = {
  name: 'John',
  age: 30,
  hobbies: ['reading', 'coding']
};

// 创建浅克隆
const shallowClone = { ...original };

// 修改克隆对象
shallowClone.name = 'Jane';
shallowClone.hobbies.push('swimming');

// 查看结果
console.log('原始对象:', original);
// 输出: { name: 'John', age: 30, hobbies: ['reading', 'coding', 'swimming'] }
console.log('克隆对象:', shallowClone);
// 输出: { name: 'Jane', age: 30, hobbies: ['reading', 'coding', 'swimming'] }

// 注意：修改克隆对象的引用类型属性会影响原始对象
// 这是因为浅克隆只复制了引用，而不是创建新的引用对象
```

## 原型注册表

原型注册表（Prototype Registry）是原型模式的一种常见扩展，它维护一个可用原型的集合，客户端可以通过标识符查找和克隆原型。

```javascript
class PrototypeRegistry {
  constructor() {
    this.prototypeMap = new Map();
  }

  register(key, prototype) {
    this.prototypeMap.set(key, prototype);
  }

  unregister(key) {
    this.prototypeMap.delete(key);
  }

  getPrototype(key) {
    const prototype = this.prototypeMap.get(key);
    if (!prototype) {
      throw new Error(`找不到键为 ${key} 的原型`);
    }
    return prototype.clone();
  }
}

// 具体原型类
class Shape {
  constructor() {
    this.type = null;
  }

  clone() {
    throw new Error('子类必须实现 clone 方法');
  }
}

class Rectangle extends Shape {
  constructor() {
    super();
    this.type = 'Rectangle';
    this.width = 0;
    this.height = 0;
  }

  clone() {
    const clone = new Rectangle();
    clone.width = this.width;
    clone.height = this.height;
    return clone;
  }

  setDimensions(width, height) {
    this.width = width;
    this.height = height;
    return this;
  }

  display() {
    return `Rectangle(width=${this.width}, height=${this.height})`;
  }
}

class Circle extends Shape {
  constructor() {
    super();
    this.type = 'Circle';
    this.radius = 0;
  }

  clone() {
    const clone = new Circle();
    clone.radius = this.radius;
    return clone;
  }

  setRadius(radius) {
    this.radius = radius;
    return this;
  }

  display() {
    return `Circle(radius=${this.radius})`;
  }
}

class Triangle extends Shape {
  constructor() {
    super();
    this.type = 'Triangle';
    this.base = 0;
    this.height = 0;
  }

  clone() {
    const clone = new Triangle();
    clone.base = this.base;
    clone.height = this.height;
    return clone;
  }

  setDimensions(base, height) {
    this.base = base;
    this.height = height;
    return this;
  }

  display() {
    return `Triangle(base=${this.base}, height=${this.height})`;
  }
}

// 使用示例
const registry = new PrototypeRegistry();

// 注册原型
registry.register('smallRectangle', new Rectangle().setDimensions(10, 5));
registry.register('largeRectangle', new Rectangle().setDimensions(100, 50));
registry.register('smallCircle', new Circle().setRadius(5));
registry.register('largeCircle', new Circle().setRadius(25));
registry.register('triangle', new Triangle().setDimensions(10, 15));

// 克隆原型创建新对象
const smallRectangle = registry.getPrototype('smallRectangle');
const largeRectangle = registry.getPrototype('largeRectangle');
const smallCircle = registry.getPrototype('smallCircle');
const largeCircle = registry.getPrototype('largeCircle');
const triangle = registry.getPrototype('triangle');

// 显示结果
console.log('Small Rectangle:', smallRectangle.display());
console.log('Large Rectangle:', largeRectangle.display());
console.log('Small Circle:', smallCircle.display());
console.log('Large Circle:', largeCircle.display());
console.log('Triangle:', triangle.display());
```

## 原型模式的应用场景

1. **对象初始化成本高**：当创建新对象需要消耗大量资源（如数据库查询、网络请求）时
2. **需要保持对象状态**：当需要创建具有相似状态的多个对象时
3. **动态配置对象**：当对象的配置复杂且需要在运行时动态创建时
4. **避免子类爆炸**：当通过继承创建对象会导致子类过多时
5. **创建对象变体**：当需要创建现有对象的变体时

## 原型模式的优点

1. **减少子类创建**：避免为了创建不同的对象配置而创建大量子类
2. **提高性能**：克隆对象通常比实例化新对象更高效
3. **简化对象创建**：隐藏复杂对象创建的细节
4. **动态添加或移除原型**：可以在运行时修改原型注册表
5. **保护原始对象**：通过克隆创建新对象，不会影响原始对象

## 原型模式的缺点

1. **克隆复杂对象**：克隆包含循环引用的复杂对象可能很困难
2. **克隆不可变对象**：某些语言中，克隆不可变对象可能会导致问题
3. **深克隆成本**：实现深克隆可能很复杂且性能开销大
4. **维护成本**：如果原型类发生变化，可能需要更新所有克隆逻辑

## 原型模式与其他模式的区别

### 原型模式 vs 工厂方法模式

- **原型模式**：通过复制现有对象创建新对象
- **工厂方法模式**：通过调用工厂方法创建新对象

### 原型模式 vs 建造者模式

- **原型模式**：关注对象的复制，不关心创建过程
- **建造者模式**：关注复杂对象的分步构建过程

### 原型模式 vs 单例模式

- **原型模式**：创建多个对象实例
- **单例模式**：确保只创建一个对象实例

## 实际应用案例

### 1. 游戏开发中的对象复制

```javascript
// 游戏对象原型
class GameObject {
  constructor(type, health, speed, damage) {
    this.type = type;
    this.health = health;
    this.speed = speed;
    this.damage = damage;
    this.position = { x: 0, y: 0 };
    this.id = Math.random().toString(36).substr(2, 9);
  }

  clone() {
    const clone = new GameObject(this.type, this.health, this.speed, this.damage);
    clone.position = { ...this.position };
    return clone;
  }

  move(x, y) {
    this.position.x = x;
    this.position.y = y;
    console.log(`${this.type} (ID: ${this.id}) 移动到位置 (${x}, ${y})`);
  }

  attack(target) {
    console.log(`${this.type} (ID: ${this.id}) 攻击 ${target.type}，造成 ${this.damage} 点伤害`);
    target.health -= this.damage;
  }
}

// 游戏对象工厂
class GameObjectFactory {
  constructor() {
    this.prototypeMap = new Map();
    this.initPrototypes();
  }

  initPrototypes() {
    // 注册各种游戏对象原型
    this.prototypeMap.set('grunt', new GameObject('小兵', 50, 1, 5));
    this.prototypeMap.set('tank', new GameObject('坦克', 150, 0.5, 15));
    this.prototypeMap.set('archer', new GameObject('弓箭手', 30, 1.5, 10));
    this.prototypeMap.set('wizard', new GameObject('法师', 40, 1, 20));
  }

  createGameObject(type, x = 0, y = 0) {
    const prototype = this.prototypeMap.get(type);
    if (!prototype) {
      throw new Error(`未知的游戏对象类型: ${type}`);
    }
    
    const gameObject = prototype.clone();
    gameObject.position = { x, y };
    return gameObject;
  }
}

// 使用示例
const factory = new GameObjectFactory();

// 创建多个小兵
const grunt1 = factory.createGameObject('grunt', 10, 10);
const grunt2 = factory.createGameObject('grunt', 20, 20);

// 创建坦克
const tank = factory.createGameObject('tank', 50, 50);

// 创建法师
const wizard = factory.createGameObject('wizard', 100, 100);

// 移动和攻击
grunt1.move(15, 15);
grunt2.move(25, 25);
tank.move(55, 55);
wizard.move(105, 105);

grunt1.attack(tank);
wizard.attack(tank);

grunt2.attack(wizard);

// 检查状态
console.log('坦克当前生命值:', tank.health);
console.log('法师当前生命值:', wizard.health);
```

### 2. 文档模板系统

```javascript
// 文档原型
class DocumentTemplate {
  constructor(title, author, content = '', format = 'plain') {
    this.title = title;
    this.author = author;
    this.content = content;
    this.format = format;
    this.createdAt = new Date();
    this.lastModifiedAt = new Date();
  }

  clone() {
    const clone = new DocumentTemplate(this.title, this.author, this.content, this.format);
    clone.createdAt = new Date(); // 新文档应该有新的创建时间
    clone.lastModifiedAt = new Date();
    return clone;
  }

  updateContent(content) {
    this.content = content;
    this.lastModifiedAt = new Date();
  }

  updateTitle(title) {
    this.title = title;
    this.lastModifiedAt = new Date();
  }

  formatDocument() {
    switch (this.format) {
      case 'plain':
        return `Title: ${this.title}\nAuthor: ${this.author}\n\n${this.content}`;
      case 'html':
        return `<html>\n<head>\n<title>${this.title}</title>\n</head>\n<body>\n<h1>${this.title}</h1>\n<p><em>by ${this.author}</em></p>\n<div>${this.content}</div>\n</body>\n</html>`;
      case 'markdown':
        return `# ${this.title}\n\n*by ${this.author}*\n\n${this.content}`;
      default:
        return this.content;
    }
  }
}

// 文档模板库
class DocumentTemplateLibrary {
  constructor() {
    this.templateMap = new Map();
    this.initTemplates();
  }

  initTemplates() {
    // 初始化常用文档模板
    this.templateMap.set('letter', new DocumentTemplate(
      'Letter Template',
      'Your Name',
      'Dear [Recipient],\n\nI am writing to [purpose of letter].\n\nSincerely,\n[Your Name]',
      'plain'
    ));

    this.templateMap.set('report', new DocumentTemplate(
      'Report Template',
      'Author',
      '# Executive Summary\n[Brief summary here]\n\n## Introduction\n[Introduction here]\n\n## Methodology\n[Methodology here]\n\n## Results\n[Results here]\n\n## Conclusion\n[Conclusion here]',
      'markdown'
    ));

    this.templateMap.set('resume', new DocumentTemplate(
      'Resume Template',
      'Your Name',
      '# Professional Summary\n[Brief professional summary]\n\n## Education\n[Education details]\n\n## Work Experience\n[Work experience details]\n\n## Skills\n[Skills list]',
      'markdown'
    ));

    this.templateMap.set('email', new DocumentTemplate(
      'Email Template',
      'Your Email',
      'Subject: [Subject]\n\nDear [Recipient],\n\n[Email content]\n\nBest regards,\n[Your Name]',
      'plain'
    ));
  }

  createDocumentFromTemplate(templateName) {
    const template = this.templateMap.get(templateName);
    if (!template) {
      throw new Error(`未知的模板: ${templateName}`);
    }
    return template.clone();
  }

  registerTemplate(name, template) {
    this.templateMap.set(name, template);
  }

  listAvailableTemplates() {
    return Array.from(this.templateMap.keys());
  }
}

// 使用示例
const library = new DocumentTemplateLibrary();

// 查看可用模板
console.log('可用模板:', library.listAvailableTemplates());

// 从模板创建新文档
const letterDoc = library.createDocumentFromTemplate('letter');
letterDoc.updateTitle('Meeting Invitation');
letterDoc.updateContent('Dear John,\n\nI would like to invite you to our team meeting next Monday at 10:00 AM.\n\nSincerely,\nAlice');

const reportDoc = library.createDocumentFromTemplate('report');
reportDoc.updateTitle('Q3 Sales Report');
reportDoc.updateContent('# Executive Summary\nThis report summarizes our sales performance for Q3.\n\n## Introduction\nQ3 was a challenging quarter but we managed to meet our targets.\n\n## Methodology\nData was collected from all regional offices and consolidated.\n\n## Results\nTotal sales reached $1.2M, which is 5% above target.\n\n## Conclusion\nOur new marketing strategy is showing positive results.');

// 格式化并显示文档
console.log('\n--- Letter Document ---');
console.log(letterDoc.formatDocument());

console.log('\n--- Report Document ---');
console.log(reportDoc.formatDocument());

// 创建自定义模板并注册
const invoiceTemplate = new DocumentTemplate(
  'Invoice Template',
  'Your Company',
  'Invoice #: [Number]\nDate: [Date]\n\nBill To:\n[Customer Name]\n[Customer Address]\n\nDescription\tQuantity\tPrice\tAmount\n-------------------------------------------\n[Item 1]\t[Qty 1]\t\t[Price 1]\t[Amount 1]\n[Item 2]\t[Qty 2]\t\t[Price 2]\t[Amount 2]\n\nTotal:\t\t\t\t[Total Amount]',
  'plain'
);

library.registerTemplate('invoice', invoiceTemplate);

// 使用自定义模板
const invoiceDoc = library.createDocumentFromTemplate('invoice');
invoiceDoc.updateTitle('Invoice #12345');
invoiceDoc.updateContent('Invoice #: 12345\nDate: 2023-10-15\n\nBill To:\nABC Corporation\n123 Business St\nNew York, NY 10001\n\nDescription\tQuantity\tPrice\tAmount\n-------------------------------------------\nService A\t2\t\t$500\t$1000\nService B\t1\t\t$800\t$800\n\nTotal:\t\t\t\t$1800');

console.log('\n--- Invoice Document ---');
console.log(invoiceDoc.formatDocument());
```

## 原型模式在前端框架中的应用

### React 中的原型模式

```jsx
// React组件原型
const componentPrototypes = {
  // 基本按钮组件原型
  button: {
    variant: 'default',
    size: 'medium',
    disabled: false,
    onClick: () => {},
    children: 'Button',
    clone(props = {}) {
      return {
        ...this,
        ...props
      };
    }
  },
  
  // 卡片组件原型
  card: {
    title: '',
    subtitle: '',
    content: '',
    actions: [],
    clone(props = {}) {
      return {
        ...this,
        ...props,
        // 确保actions数组是深拷贝
        actions: props.actions ? [...props.actions] : [...this.actions]
      };
    }
  },
  
  // 表单字段组件原型
  formField: {
    type: 'text',
    label: '',
    placeholder: '',
    value: '',
    required: false,
    disabled: false,
    onChange: () => {},
    clone(props = {}) {
      return {
        ...this,
        ...props
      };
    }
  }
};

// 组件工厂
const ComponentFactory = {
  createComponent(type, props = {}) {
    const prototype = componentPrototypes[type];
    if (!prototype) {
      throw new Error(`未知的组件类型: ${type}`);
    }
    return prototype.clone(props);
  }
};

// React组件渲染函数
function renderButton(props) {
  return (
    <button
      className={`btn btn-${props.variant} btn-${props.size}`}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}

function renderCard(props) {
  return (
    <div className="card">
      {(props.title || props.subtitle) && (
        <div className="card-header">
          {props.title && <h3 className="card-title">{props.title}</h3>}
          {props.subtitle && <p className="card-subtitle">{props.subtitle}</p>}
        </div>
      )}
      <div className="card-body">
        {props.content}
      </div>
      {props.actions.length > 0 && (
        <div className="card-footer">
          {props.actions.map((action, index) => (
            <button
              key={index}
              className={`btn btn-${action.variant || 'default'}`}
              onClick={action.onClick}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function renderFormField(props) {
  return (
    <div className="form-group">
      {props.label && (
        <label htmlFor={props.id || props.name}>
          {props.label}
          {props.required && <span className="required">*</span>}
        </label>
      )}
      <input
        type={props.type}
        id={props.id || props.name}
        name={props.name}
        placeholder={props.placeholder}
        value={props.value}
        required={props.required}
        disabled={props.disabled}
        onChange={props.onChange}
        className="form-control"
      />
    </div>
  );
}

// 使用示例
function UserProfile() {
  // 创建按钮组件
  const primaryButton = ComponentFactory.createComponent('button', {
    variant: 'primary',
    children: '保存更改',
    onClick: () => console.log('保存更改')
  });

  const secondaryButton = ComponentFactory.createComponent('button', {
    variant: 'secondary',
    children: '取消',
    onClick: () => console.log('取消')
  });

  // 创建卡片组件
  const userCard = ComponentFactory.createComponent('card', {
    title: '用户信息',
    subtitle: '基本资料',
    actions: [
      { label: '编辑', variant: 'primary', onClick: () => console.log('编辑') },
      { label: '删除', variant: 'danger', onClick: () => console.log('删除') },
      { label: '取消', variant: 'secondary', onClick: () => console.log('取消') }
    ]
  });

  // 创建表单字段组件
  const usernameField = ComponentFactory.createComponent('formField', {
    label: '用户名',
    name: 'username',
    value: 'testuser',
    required: true
  });

  const emailField = ComponentFactory.createComponent('formField', {
    type: 'email',
    label: '邮箱',
    name: 'email',
    value: 'user@example.com',
    required: true
  });

  return (
    <div className="user-profile">
      {renderCard(userCard)}
      
      <form>
        {renderFormField(usernameField)}
        {renderFormField(emailField)}
        <div className="form-actions">
          {renderButton(primaryButton)}
          {renderButton(secondaryButton)}
        </div>
      </form>
    </div>
  );
}
```

## 常见问题与解答

### Q: 如何处理原型模式中的循环引用？
A: 实现深克隆时需要使用映射表来记录已经克隆过的对象，避免无限递归。

```javascript
function deepClone(obj, map = new Map()) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  // 处理日期对象
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  // 处理正则表达式
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }
  
  // 检查是否已经克隆过这个对象
  if (map.has(obj)) {
    return map.get(obj);
  }
  
  // 创建新对象或数组
  const clone = Array.isArray(obj) ? [] : {};
  
  // 记录到映射表中
  map.set(obj, clone);
  
  // 复制所有属性
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clone[key] = deepClone(obj[key], map);
    }
  }
  
  return clone;
}
```

### Q: 原型模式和原型继承有什么区别？
A: 原型模式是一种设计模式，关注对象的复制创建；原型继承是JavaScript的语言特性，关注对象之间的属性和方法共享。

### Q: 什么情况下不适合使用原型模式？
A: 当对象非常简单或者创建成本很低时，直接实例化可能更简单直接。

### Q: 原型模式如何支持版本控制？
A: 可以维护不同版本的原型，通过版本标识在原型注册表中查找和克隆相应版本的对象。

### Q: 如何在JavaScript中实现浅克隆和深克隆？
A: 浅克隆可以使用Object.assign()或扩展运算符；深克隆可以使用JSON.parse(JSON.stringify())（简单场景）或自定义深克隆函数（复杂场景）。