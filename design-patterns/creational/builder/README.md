# 建造者模式 (Builder Pattern)

## 什么是建造者模式

建造者模式是一种创建型设计模式，它允许你通过一系列步骤来构建复杂对象，而无需关心这些对象的具体内部表示。建造者模式将一个复杂对象的构建与它的表示分离，使得同样的构建过程可以创建不同的表示。

## 建造者模式的核心组件

1. **Builder（建造者接口）**：定义创建产品各个部分的抽象方法
2. **ConcreteBuilder（具体建造者）**：实现Builder接口，定义具体的构建步骤
3. **Product（产品）**：被构建的复杂对象
4. **Director（指导者）**：负责按照特定顺序调用Builder的方法，不关心具体产品的实现

## 建造者模式的UML图

```
Director → Builder → ConcreteBuilder → Product
```

## 建造者模式的实现示例

### 基本实现

```javascript
// Product（产品）
class Computer {
  constructor() {
    this.cpu = null;
    this.memory = null;
    this.storage = null;
    this.gpu = null;
    this.operatingSystem = null;
  }

  setCPU(cpu) {
    this.cpu = cpu;
    return this;
  }

  setMemory(memory) {
    this.memory = memory;
    return this;
  }

  setStorage(storage) {
    this.storage = storage;
    return this;
  }

  setGPU(gpu) {
    this.gpu = gpu;
    return this;
  }

  setOperatingSystem(os) {
    this.operatingSystem = os;
    return this;
  }

  toString() {
    return `Computer配置:\n` +
           `- CPU: ${this.cpu}\n` +
           `- 内存: ${this.memory}\n` +
           `- 存储: ${this.storage}\n` +
           `- GPU: ${this.gpu || '无独立显卡'}\n` +
           `- 操作系统: ${this.operatingSystem}`;
  }
}

// Builder（建造者接口）
class ComputerBuilder {
  constructor() {
    this.reset();
  }

  reset() {
    this.computer = new Computer();
    return this;
  }

  setCPU(cpu) {
    this.computer.setCPU(cpu);
    return this;
  }

  setMemory(memory) {
    this.computer.setMemory(memory);
    return this;
  }

  setStorage(storage) {
    this.computer.setStorage(storage);
    return this;
  }

  setGPU(gpu) {
    this.computer.setGPU(gpu);
    return this;
  }

  setOperatingSystem(os) {
    this.computer.setOperatingSystem(os);
    return this;
  }

  build() {
    const result = this.computer;
    this.reset(); // 重置以便构建下一个对象
    return result;
  }
}

// ConcreteBuilder（具体建造者）
class GamingComputerBuilder extends ComputerBuilder {
  constructor() {
    super();
  }

  buildGamingComputer() {
    return this
      .setCPU('Intel Core i9-12900K')
      .setMemory('32GB DDR5 5200MHz')
      .setStorage('2TB NVMe SSD')
      .setGPU('NVIDIA RTX 4090')
      .setOperatingSystem('Windows 11 Pro')
      .build();
  }
}

class OfficeComputerBuilder extends ComputerBuilder {
  constructor() {
    super();
  }

  buildOfficeComputer() {
    return this
      .setCPU('Intel Core i5-12600')
      .setMemory('16GB DDR4 3200MHz')
      .setStorage('512GB SSD')
      .setOperatingSystem('Windows 11 Home')
      .build();
  }
}

// Director（指导者）
class ComputerDirector {
  constructor(builder) {
    this.builder = builder;
  }

  setBuilder(builder) {
    this.builder = builder;
  }

  buildBasicComputer() {
    return this.builder
      .setCPU('Intel Core i3')
      .setMemory('8GB DDR4')
      .setStorage('256GB SSD')
      .setOperatingSystem('Linux')
      .build();
  }

  buildHighEndComputer() {
    return this.builder
      .setCPU('AMD Ryzen 9 5950X')
      .setMemory('64GB DDR4 3600MHz')
      .setStorage('4TB NVMe SSD')
      .setGPU('NVIDIA RTX 4080')
      .setOperatingSystem('Windows 11 Pro')
      .build();
  }
}

// 使用示例
// 直接使用建造者
const builder = new ComputerBuilder();
const customComputer = builder
  .setCPU('Intel Core i7-12700K')
  .setMemory('16GB DDR5 4800MHz')
  .setStorage('1TB NVMe SSD')
  .setGPU('NVIDIA RTX 4070')
  .setOperatingSystem('Windows 11')
  .build();

console.log(customComputer.toString());

// 使用具体建造者
const gamingBuilder = new GamingComputerBuilder();
const gamingComputer = gamingBuilder.buildGamingComputer();
console.log(gamingComputer.toString());

const officeBuilder = new OfficeComputerBuilder();
const officeComputer = officeBuilder.buildOfficeComputer();
console.log(officeComputer.toString());

// 使用指导者
const director = new ComputerDirector(builder);
const basicComputer = director.buildBasicComputer();
console.log(basicComputer.toString());

const highEndComputer = director.buildHighEndComputer();
console.log(highEndComputer.toString());
```

### 函数式实现（流式接口）

在JavaScript中，可以使用函数式编程和链式调用简化建造者模式：

```javascript
// 函数式建造者模式
function createComputer() {
  const computer = {
    cpu: null,
    memory: null,
    storage: null,
    gpu: null,
    os: null,
    
    // 设置属性并返回this以支持链式调用
    withCPU(cpu) {
      this.cpu = cpu;
      return this;
    },
    
    withMemory(memory) {
      this.memory = memory;
      return this;
    },
    
    withStorage(storage) {
      this.storage = storage;
      return this;
    },
    
    withGPU(gpu) {
      this.gpu = gpu;
      return this;
    },
    
    withOS(os) {
      this.os = os;
      return this;
    },
    
    // 构建并返回最终对象
    build() {
      return {
        cpu: this.cpu,
        memory: this.memory,
        storage: this.storage,
        gpu: this.gpu,
        os: this.os,
        describe() {
          return `Computer with ${this.cpu}, ${this.memory}, ${this.storage}${this.gpu ? `, ${this.gpu}` : ''} running ${this.os}`;
        }
      };
    }
  };
  
  return computer;
}

// 使用示例
const computer = createComputer()
  .withCPU('Intel Core i7')
  .withMemory('16GB RAM')
  .withStorage('512GB SSD')
  .withOS('Windows 10')
  .build();

console.log(computer.describe());
```

## 建造者模式的应用场景

1. **复杂对象创建**：当对象有多个部分需要按特定顺序构建时
2. **可变配置**：当对象有多种可选配置，且构建过程复杂时
3. **分步构建**：当对象需要分步创建，并且可能需要在构建过程中进行验证时
4. **生成器模式**：当需要生成不同表示的产品时
5. **构建流程固定**：当构建流程相对固定，但具体组件可以变化时

## 建造者模式的优点

1. **分离复杂对象的构建和表示**：客户端不需要知道产品的内部结构
2. **控制构建过程**：可以精确控制对象的构建过程
3. **可复用性**：同样的构建过程可以创建不同的表示
4. **易于扩展**：可以添加新的建造者来创建新的产品变体
5. **参数验证**：在构建过程中可以进行参数验证

## 建造者模式的缺点

1. **增加了代码复杂度**：需要创建多个类
2. **构建过程固定**：不适合构建过程变化很大的场景
3. **客户端必须了解产品组成**：客户端需要知道产品由哪些部分组成

## 建造者模式与其他模式的区别

### 建造者模式 vs 工厂模式

- **建造者模式**：关注对象的构建过程，适用于复杂对象的分步创建
- **工厂模式**：关注对象的创建结果，适用于简单对象的直接创建

### 建造者模式 vs 抽象工厂模式

- **建造者模式**：构建一个复杂对象，关注构建过程
- **抽象工厂模式**：创建一系列相关对象，关注产品族的创建

## 实际应用案例

### 配置对象构建

```javascript
// 配置对象建造者
class ConfigBuilder {
  constructor() {
    this.config = {
      timeout: 30000,
      retryCount: 3,
      cacheEnabled: false,
      loggingLevel: 'info',
      endpoints: {},
      headers: {}
    };
  }

  withTimeout(timeout) {
    this.config.timeout = timeout;
    return this;
  }

  withRetryCount(count) {
    this.config.retryCount = count;
    return this;
  }

  enableCache() {
    this.config.cacheEnabled = true;
    return this;
  }

  disableCache() {
    this.config.cacheEnabled = false;
    return this;
  }

  withLoggingLevel(level) {
    const validLevels = ['error', 'warn', 'info', 'debug', 'trace'];
    if (validLevels.includes(level)) {
      this.config.loggingLevel = level;
    }
    return this;
  }

  withEndpoint(name, url) {
    this.config.endpoints[name] = url;
    return this;
  }

  withHeader(name, value) {
    this.config.headers[name] = value;
    return this;
  }

  build() {
    // 验证配置
    if (!Object.keys(this.config.endpoints).length) {
      throw new Error('至少需要配置一个endpoint');
    }
    
    return { ...this.config }; // 返回配置的副本
  }
}

// 使用示例
const apiConfig = new ConfigBuilder()
  .withTimeout(50000)
  .withRetryCount(5)
  .enableCache()
  .withLoggingLevel('debug')
  .withEndpoint('users', 'https://api.example.com/users')
  .withEndpoint('products', 'https://api.example.com/products')
  .withHeader('Authorization', 'Bearer token123')
  .build();

console.log(apiConfig);
```

### HTML元素构建器

```javascript
// HTML元素建造者
class ElementBuilder {
  constructor(tagName) {
    this.element = {
      tagName,
      attributes: {},
      classes: [],
      children: [],
      textContent: ''
    };
  }

  withAttribute(name, value) {
    this.element.attributes[name] = value;
    return this;
  }

  withClass(className) {
    this.element.classes.push(className);
    return this;
  }

  withClasses(classes) {
    this.element.classes.push(...classes);
    return this;
  }

  withText(text) {
    this.element.textContent = text;
    return this;
  }

  appendChild(child) {
    this.element.children.push(child);
    return this;
  }

  build() {
    const element = document.createElement(this.element.tagName);
    
    // 设置属性
    for (const [name, value] of Object.entries(this.element.attributes)) {
      element.setAttribute(name, value);
    }
    
    // 设置类名
    if (this.element.classes.length) {
      element.className = this.element.classes.join(' ');
    }
    
    // 设置文本内容
    if (this.element.textContent) {
      element.textContent = this.element.textContent;
    }
    
    // 添加子元素
    for (const child of this.element.children) {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    }
    
    return element;
  }

  // 静态辅助方法
  static create(tagName) {
    return new ElementBuilder(tagName);
  }
}

// 使用示例
const button = ElementBuilder.create('button')
  .withClass('btn')
  .withClass('btn-primary')
  .withAttribute('type', 'submit')
  .withAttribute('disabled', 'false')
  .withText('点击提交')
  .build();

const form = ElementBuilder.create('form')
  .withAttribute('action', '/submit')
  .withAttribute('method', 'post')
  .withClass('user-form')
  .appendChild(
    ElementBuilder.create('input')
      .withAttribute('type', 'text')
      .withAttribute('name', 'username')
      .withAttribute('placeholder', '请输入用户名')
      .build()
  )
  .appendChild(button)
  .build();

document.body.appendChild(form);
```

## 建造者模式在前端框架中的应用

### React组件构建器

```jsx
// React组件构建器
function createCardBuilder() {
  const cardData = {
    title: '',
    content: '',
    actions: [],
    variant: 'default',
    className: ''
  };

  return {
    withTitle(title) {
      cardData.title = title;
      return this;
    },
    
    withContent(content) {
      cardData.content = content;
      return this;
    },
    
    withAction(label, onClick, variant = 'primary') {
      cardData.actions.push({ label, onClick, variant });
      return this;
    },
    
    withVariant(variant) {
      cardData.variant = variant;
      return this;
    },
    
    withClassName(className) {
      cardData.className = className;
      return this;
    },
    
    build() {
      return (
        <div className={`card card-${cardData.variant} ${cardData.className}`}>
          {cardData.title && <div className="card-title">{cardData.title}</div>}
          <div className="card-content">{cardData.content}</div>
          {cardData.actions.length > 0 && (
            <div className="card-actions">
              {cardData.actions.map((action, index) => (
                <button 
                  key={index} 
                  className={`btn btn-${action.variant}`}
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
  };
}

// 使用示例
const infoCard = createCardBuilder()
  .withTitle('信息提示')
  .withContent('这是一条重要的信息')
  .withVariant('info')
  .withAction('确认', () => console.log('Confirmed'))
  .withAction('取消', () => console.log('Cancelled'), 'secondary')
  .build();

// 在组件中使用
function MyComponent() {
  return (
    <div>
      {infoCard}
    </div>
  );
}
```

## 常见问题与解答

### Q: 何时应该使用建造者模式？
A: 当你需要构建一个复杂对象，该对象有多个组件需要按特定顺序设置，或者当你想要创建对象的不同变体而不增加类的数量时。

### Q: 建造者模式如何支持链式调用？
A: 通过在每个构建方法中返回this（建造者实例），允许客户端代码链式调用多个构建方法。

### Q: 建造者模式与流畅接口有什么关系？
A: 流畅接口是一种API设计风格，建造者模式常使用流畅接口来提供链式调用，使客户端代码更加简洁易读。

### Q: 如何处理建造者模式中的必填字段？
A: 可以在build()方法中添加验证逻辑，确保所有必填字段都已设置。也可以通过构造函数要求必填参数。

### Q: 建造者模式在JavaScript中是否还有其他名称？
A: 在JavaScript中，建造者模式有时也被称为"流式接口"、"方法链"或"配置器模式"。