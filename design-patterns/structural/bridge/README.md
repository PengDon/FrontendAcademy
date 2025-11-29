# 桥接模式 (Bridge Pattern)

## 什么是桥接模式

桥接模式是一种结构型设计模式，它将抽象部分与其实现部分分离，使它们都可以独立地变化。这种模式通过组合而非继承来实现功能扩展，避免了类爆炸的问题。

桥接模式特别适用于那些在两个或多个维度上变化的类，例如同时需要支持多种平台和多种功能的软件系统。

## 桥接模式的核心组件

1. **抽象部分 (Abstraction)**：定义抽象类的接口，包含一个对实现部分的引用
2. **扩展抽象部分 (RefinedAbstraction)**：抽象部分的子类，扩展抽象部分的接口
3. **实现部分 (Implementor)**：定义实现类的接口，提供基本操作
4. **具体实现部分 (ConcreteImplementor)**：实现部分的子类，实现实现部分的接口

## 桥接模式的实现

### 基本实现

```javascript
// 实现部分 - 定义实现接口
class Implementor {
  operationImpl() {
    throw new Error('子类必须实现 operationImpl 方法');
  }
}

// 具体实现部分A
class ConcreteImplementorA extends Implementor {
  operationImpl() {
    return '实现A的具体操作';
  }
}

// 具体实现部分B
class ConcreteImplementorB extends Implementor {
  operationImpl() {
    return '实现B的具体操作';
  }
}

// 抽象部分 - 定义抽象类的接口
class Abstraction {
  constructor(implementor) {
    this.implementor = implementor;
  }

  operation() {
    return `抽象: 基于 ${this.implementor.operationImpl()}`;
  }
}

// 扩展抽象部分
class RefinedAbstraction extends Abstraction {
  operation() {
    return `扩展抽象: 扩展 ${super.operation()}`;
  }

  additionalOperation() {
    return `附加操作: 与 ${this.implementor.operationImpl()} 组合`;
  }
}

// 客户端代码
function clientCode(abstraction) {
  console.log(abstraction.operation());
  
  // 如果是扩展抽象部分，调用附加操作
  if (abstraction instanceof RefinedAbstraction) {
    console.log(abstraction.additionalOperation());
  }
}

// 创建实现部分
const implementorA = new ConcreteImplementorA();
const implementorB = new ConcreteImplementorB();

// 创建抽象部分并关联实现部分
console.log('客户端: 使用基本抽象与实现A:');
const abstraction1 = new Abstraction(implementorA);
clientCode(abstraction1);

console.log('\n客户端: 使用扩展抽象与实现B:');
const abstraction2 = new RefinedAbstraction(implementorB);
clientCode(abstraction2);

console.log('\n客户端: 使用扩展抽象与实现A:');
const abstraction3 = new RefinedAbstraction(implementorA);
clientCode(abstraction3);
```

### 实际应用场景：图形绘制系统

下面是一个图形绘制系统的桥接模式实现，它可以在不同平台上绘制不同形状的图形。

```javascript
// 实现部分 - 平台接口
class DrawingAPI {
  drawCircle(x, y, radius) {}
  drawRectangle(x, y, width, height) {}
}

// 具体实现部分 - Windows平台
class WindowsAPI extends DrawingAPI {
  drawCircle(x, y, radius) {
    return `Windows API: 绘制圆(${x}, ${y})，半径 ${radius}`;
  }

  drawRectangle(x, y, width, height) {
    return `Windows API: 绘制矩形(${x}, ${y})，宽 ${width}，高 ${height}`;
  }
}

// 具体实现部分 - Mac平台
class MacOSAPI extends DrawingAPI {
  drawCircle(x, y, radius) {
    return `MacOS API: 绘制圆(${x}, ${y})，半径 ${radius}`;
  }

  drawRectangle(x, y, width, height) {
    return `MacOS API: 绘制矩形(${x}, ${y})，宽 ${width}，高 ${height}`;
  }
}

// 具体实现部分 - Linux平台
class LinuxAPI extends DrawingAPI {
  drawCircle(x, y, radius) {
    return `Linux API: 绘制圆(${x}, ${y})，半径 ${radius}`;
  }

  drawRectangle(x, y, width, height) {
    return `Linux API: 绘制矩形(${x}, ${y})，宽 ${width}，高 ${height}`;
  }
}

// 抽象部分 - 形状
class Shape {
  constructor(drawingAPI) {
    this.drawingAPI = drawingAPI;
  }

  draw() {}
  resizeByPercentage(percent) {}
}

// 扩展抽象部分 - 圆形
class Circle extends Shape {
  constructor(x, y, radius, drawingAPI) {
    super(drawingAPI);
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  draw() {
    return this.drawingAPI.drawCircle(this.x, this.y, this.radius);
  }

  resizeByPercentage(percent) {
    this.radius *= (1 + percent / 100);
  }

  getDescription() {
    return `圆形(${this.x}, ${this.y})，半径 ${this.radius}`;
  }
}

// 扩展抽象部分 - 矩形
class Rectangle extends Shape {
  constructor(x, y, width, height, drawingAPI) {
    super(drawingAPI);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw() {
    return this.drawingAPI.drawRectangle(this.x, this.y, this.width, this.height);
  }

  resizeByPercentage(percent) {
    this.width *= (1 + percent / 100);
    this.height *= (1 + percent / 100);
  }

  getDescription() {
    return `矩形(${this.x}, ${this.y})，宽 ${this.width}，高 ${this.height}`;
  }
}

// 客户端代码
function clientCode(shape) {
  console.log('描述:', shape.getDescription());
  console.log('绘制:', shape.draw());
  
  // 调整大小
  shape.resizeByPercentage(10);
  console.log('调整大小后描述:', shape.getDescription());
  console.log('调整大小后绘制:', shape.draw());
}

// 创建不同平台的API实现
const windowsAPI = new WindowsAPI();
const macOSAPI = new MacOSAPI();
const linuxAPI = new LinuxAPI();

// 创建形状并关联不同的平台实现
console.log('在Windows平台上绘制圆形:');
const windowsCircle = new Circle(100, 100, 50, windowsAPI);
clientCode(windowsCircle);

console.log('\n在MacOS平台上绘制矩形:');
const macRectangle = new Rectangle(50, 50, 200, 100, macOSAPI);
clientCode(macRectangle);

console.log('\n在Linux平台上绘制圆形:');
const linuxCircle = new Circle(200, 200, 75, linuxAPI);
clientCode(linuxCircle);

// 可以动态切换实现部分
console.log('\n将Linux圆形切换到Windows平台:');
linuxCircle.drawingAPI = windowsAPI;
console.log('切换平台后绘制:', linuxCircle.draw());
```

## 桥接模式的应用场景

1. **多维度变化**：当一个类在两个或多个维度上都可以独立变化时
2. **避免类爆炸**：当使用继承会导致类数量急剧增加时
3. **平台独立性**：当需要开发跨平台应用程序时
4. **动态切换实现**：当需要在运行时动态切换实现方式时
5. **组件化设计**：当系统需要高度组件化，且组件之间需要灵活组合时

## 桥接模式的优点

1. **分离关注点**：将抽象和实现分离，使它们可以独立变化
2. **避免类爆炸**：使用组合代替继承，避免了因多维度变化导致的类数量激增
3. **提高灵活性**：可以在运行时动态切换实现
4. **符合开闭原则**：可以扩展抽象部分和实现部分而不修改已有代码
5. **单一职责原则**：每个类只负责自己的职责，抽象类负责抽象部分，实现类负责实现部分

## 桥接模式的缺点

1. **增加复杂性**：引入了额外的类和对象，增加了系统的理解和设计难度
2. **需要正确识别维度**：需要正确识别系统中的抽象和实现两个维度
3. **不适合简单系统**：对于简单的系统，使用桥接模式可能会过度设计

## 桥接模式与其他模式的区别

### 桥接模式 vs 适配器模式

- **桥接模式**：在设计初期就将抽象和实现分离，使它们可以独立变化
- **适配器模式**：在已有系统中处理不兼容的接口

### 桥接模式 vs 装饰器模式

- **桥接模式**：关注将抽象和实现分离，支持多维度变化
- **装饰器模式**：关注动态地为对象添加责任，不改变接口

### 桥接模式 vs 策略模式

- **桥接模式**：结构型模式，关注类的结构和组合
- **策略模式**：行为型模式，关注算法的封装和切换

## 实际应用案例

### 1. 消息发送系统

```javascript
// 实现部分 - 消息发送接口
class MessageSender {
  send(message) {
    throw new Error('子类必须实现 send 方法');
  }
}

// 具体实现部分 - 电子邮件发送器
class EmailSender extends MessageSender {
  send(message) {
    console.log(`通过电子邮件发送: ${message}`);
    return true;
  }
}

// 具体实现部分 - SMS发送器
class SMSSender extends MessageSender {
  send(message) {
    console.log(`通过SMS发送: ${message}`);
    return true;
  }
}

// 具体实现部分 - 推送通知发送器
class PushNotificationSender extends MessageSender {
  send(message) {
    console.log(`通过推送通知发送: ${message}`);
    return true;
  }
}

// 抽象部分 - 消息
class Message {
  constructor(sender) {
    this.sender = sender;
    this.content = '';
    this.recipient = '';
  }

  setContent(content) {
    this.content = content;
    return this;
  }

  setRecipient(recipient) {
    this.recipient = recipient;
    return this;
  }

  send() {
    throw new Error('子类必须实现 send 方法');
  }
}

// 扩展抽象部分 - 普通消息
class TextMessage extends Message {
  send() {
    console.log(`发送文本消息给 ${this.recipient}`);
    return this.sender.send(`[文本] 给 ${this.recipient}: ${this.content}`);
  }

  formatContent() {
    return this.content;
  }
}

// 扩展抽象部分 - 富文本消息
class RichTextMessage extends Message {
  constructor(sender) {
    super(sender);
    this.formattingOptions = {};
  }

  setFormatting(options) {
    this.formattingOptions = { ...this.formattingOptions, ...options };
    return this;
  }

  send() {
    console.log(`发送富文本消息给 ${this.recipient}`);
    const formattedContent = this.formatContent();
    return this.sender.send(`[富文本] 给 ${this.recipient}: ${formattedContent}`);
  }

  formatContent() {
    let formatted = this.content;
    
    if (this.formattingOptions.bold) {
      formatted = `**${formatted}**`;
    }
    
    if (this.formattingOptions.italic) {
      formatted = `*${formatted}*`;
    }
    
    if (this.formattingOptions.color) {
      formatted = `<span style="color:${this.formattingOptions.color}">${formatted}</span>`;
    }
    
    return formatted;
  }
}

// 扩展抽象部分 - 多媒体消息
class MultimediaMessage extends Message {
  constructor(sender) {
    super(sender);
    this.attachments = [];
  }

  addAttachment(attachment) {
    this.attachments.push(attachment);
    return this;
  }

  send() {
    console.log(`发送多媒体消息给 ${this.recipient}`);
    const messageWithAttachments = `${this.content} [附件: ${this.attachments.join(', ')}]`;
    return this.sender.send(`[多媒体] 给 ${this.recipient}: ${messageWithAttachments}`);
  }
}

// 客户端代码
function clientCode() {
  // 创建发送器
  const emailSender = new EmailSender();
  const smsSender = new SMSSender();
  const pushSender = new PushNotificationSender();

  // 创建并发送文本消息
  console.log('--- 发送文本消息 ---');
  const textMessage = new TextMessage(emailSender);
  textMessage.setContent('你好，这是一条简单的文本消息。')
             .setRecipient('user@example.com')
             .send();

  // 创建并发送富文本消息
  console.log('\n--- 发送富文本消息 ---');
  const richMessage = new RichTextMessage(smsSender);
  richMessage.setContent('重要通知')
             .setRecipient('+1234567890')
             .setFormatting({ bold: true, color: 'red' })
             .send();

  // 创建并发送多媒体消息
  console.log('\n--- 发送多媒体消息 ---');
  const multimediaMessage = new MultimediaMessage(pushSender);
  multimediaMessage.setContent('请查看附件')
                   .setRecipient('user123')
                   .addAttachment('image.jpg')
                   .addAttachment('document.pdf')
                   .send();

  // 动态切换发送器
  console.log('\n--- 动态切换发送器 ---');
  multimediaMessage.sender = emailSender;
  multimediaMessage.send();
}

// 使用示例
clientCode();
```

### 2. 远程控制系统

```javascript
// 实现部分 - 设备接口
class Device {
  turnOn() {}
  turnOff() {}
  setChannel(channel) {}
  setVolume(volume) {}
  getStatus() {}
}

// 具体实现部分 - 电视
class TV extends Device {
  constructor() {
    super();
    this.isOn = false;
    this.currentChannel = 1;
    this.volume = 50;
  }

  turnOn() {
    this.isOn = true;
    console.log('电视已打开');
  }

  turnOff() {
    this.isOn = false;
    console.log('电视已关闭');
  }

  setChannel(channel) {
    if (this.isOn) {
      this.currentChannel = channel;
      console.log(`电视频道已切换到 ${channel}`);
    } else {
      console.log('请先打开电视');
    }
  }

  setVolume(volume) {
    if (this.isOn) {
      this.volume = Math.max(0, Math.min(100, volume));
      console.log(`电视音量已设置为 ${this.volume}`);
    } else {
      console.log('请先打开电视');
    }
  }

  getStatus() {
    return {
      type: 'TV',
      isOn: this.isOn,
      channel: this.currentChannel,
      volume: this.volume
    };
  }
}

// 具体实现部分 - 音响
class Speaker extends Device {
  constructor() {
    super();
    this.isOn = false;
    this.volume = 30;
    this.inputSource = 'bluetooth';
  }

  turnOn() {
    this.isOn = true;
    console.log('音响已打开');
  }

  turnOff() {
    this.isOn = false;
    console.log('音响已关闭');
  }

  setChannel(source) {
    // 对于音响，channel实际上是输入源
    if (this.isOn) {
      this.inputSource = source;
      console.log(`音响输入源已切换到 ${source}`);
    } else {
      console.log('请先打开音响');
    }
  }

  setVolume(volume) {
    if (this.isOn) {
      this.volume = Math.max(0, Math.min(100, volume));
      console.log(`音响音量已设置为 ${this.volume}`);
    } else {
      console.log('请先打开音响');
    }
  }

  getStatus() {
    return {
      type: 'Speaker',
      isOn: this.isOn,
      inputSource: this.inputSource,
      volume: this.volume
    };
  }
}

// 具体实现部分 - 投影仪
class Projector extends Device {
  constructor() {
    super();
    this.isOn = false;
    this.inputSource = 'hdmi';
    this.brightness = 70;
  }

  turnOn() {
    this.isOn = true;
    console.log('投影仪已打开');
  }

  turnOff() {
    this.isOn = false;
    console.log('投影仪已关闭');
  }

  setChannel(source) {
    // 对于投影仪，channel实际上是输入源
    if (this.isOn) {
      this.inputSource = source;
      console.log(`投影仪输入源已切换到 ${source}`);
    } else {
      console.log('请先打开投影仪');
    }
  }

  setVolume(brightness) {
    // 对于投影仪，volume实际上是亮度
    if (this.isOn) {
      this.brightness = Math.max(0, Math.min(100, brightness));
      console.log(`投影仪亮度已设置为 ${this.brightness}`);
    } else {
      console.log('请先打开投影仪');
    }
  }

  getStatus() {
    return {
      type: 'Projector',
      isOn: this.isOn,
      inputSource: this.inputSource,
      brightness: this.brightness
    };
  }
}

// 抽象部分 - 遥控器
class Remote {
  constructor(device) {
    this.device = device;
  }

  power() {
    if (this.device.getStatus().isOn) {
      this.device.turnOff();
    } else {
      this.device.turnOn();
    }
  }

  volumeUp() {
    const currentStatus = this.device.getStatus();
    const currentVolume = currentStatus.volume || currentStatus.brightness || 50;
    this.device.setVolume(currentVolume + 10);
  }

  volumeDown() {
    const currentStatus = this.device.getStatus();
    const currentVolume = currentStatus.volume || currentStatus.brightness || 50;
    this.device.setVolume(currentVolume - 10);
  }

  channelUp() {
    const currentStatus = this.device.getStatus();
    if (currentStatus.channel !== undefined) {
      this.device.setChannel(currentStatus.channel + 1);
    }
  }

  channelDown() {
    const currentStatus = this.device.getStatus();
    if (currentStatus.channel !== undefined) {
      this.device.setChannel(currentStatus.channel - 1);
    }
  }
}

// 扩展抽象部分 - 基础遥控器
class BasicRemote extends Remote {
  constructor(device) {
    super(device);
  }

  // 基础遥控器只有基本功能，继承自Remote
}

// 扩展抽象部分 - 高级遥控器
class AdvancedRemote extends Remote {
  constructor(device) {
    super(device);
  }

  mute() {
    console.log('静音');
    this.device.setVolume(0);
  }

  setInputSource(source) {
    console.log(`设置输入源为 ${source}`);
    this.device.setChannel(source); // 复用setChannel方法来设置输入源
  }

  togglePower() {
    this.power();
  }

  getDeviceStatus() {
    return this.device.getStatus();
  }
}

// 客户端代码
function clientCode() {
  // 创建设备
  const tv = new TV();
  const speaker = new Speaker();
  const projector = new Projector();

  // 创建遥控器
  const basicRemote = new BasicRemote(tv);
  const advancedRemote = new AdvancedRemote(speaker);
  const projectorRemote = new AdvancedRemote(projector);

  // 测试基本遥控器控制电视
  console.log('--- 基本遥控器控制电视 ---');
  basicRemote.power(); // 打开电视
  basicRemote.channelUp(); // 切换到频道2
  basicRemote.volumeUp(); // 增加音量
  console.log('电视状态:', tv.getStatus());
  basicRemote.power(); // 关闭电视

  // 测试高级遥控器控制音响
  console.log('\n--- 高级遥控器控制音响 ---');
  advancedRemote.power(); // 打开音响
  advancedRemote.setInputSource('aux'); // 设置输入源为AUX
  advancedRemote.volumeUp(); // 增加音量
  console.log('音响状态:', advancedRemote.getDeviceStatus());
  advancedRemote.mute(); // 静音
  console.log('静音后音响状态:', advancedRemote.getDeviceStatus());
  advancedRemote.togglePower(); // 关闭音响

  // 测试高级遥控器控制投影仪
  console.log('\n--- 高级遥控器控制投影仪 ---');
  projectorRemote.power(); // 打开投影仪
  projectorRemote.setInputSource('vga'); // 设置输入源为VGA
  projectorRemote.volumeUp(); // 增加亮度
  console.log('投影仪状态:', projectorRemote.getDeviceStatus());
  projectorRemote.power(); // 关闭投影仪

  // 动态切换设备
  console.log('\n--- 动态切换遥控器控制的设备 ---');
  advancedRemote.device = tv;
  advancedRemote.power(); // 打开电视
  console.log('电视状态:', advancedRemote.getDeviceStatus());
}

// 使用示例
clientCode();
```

## 桥接模式在前端框架中的应用

### React 组件中的桥接模式

```jsx
// 实现部分 - 渲染引擎接口
class RenderEngine {
  renderButton(props) {}
  renderCard(props) {}
}

// 具体实现部分 - Material UI 渲染引擎
class MaterialUIRenderEngine extends RenderEngine {
  renderButton(props) {
    return (
      <button className="mui-button" style={{ 
        backgroundColor: props.primary ? '#1976d2' : '#e0e0e0',
        color: props.primary ? 'white' : 'black',
        padding: '10px 16px',
        borderRadius: '4px',
        border: 'none',
        cursor: 'pointer'
      }} onClick={props.onClick}>
        {props.children}
      </button>
    );
  }

  renderCard(props) {
    return (
      <div className="mui-card" style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '16px',
        margin: '8px'
      }}>
        {props.title && <h3 style={{ margin: '0 0 16px 0' }}>{props.title}</h3>}
        {props.children}
        {props.actions && (
          <div style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            {props.actions}
          </div>
        )}
      </div>
    );
  }
}

// 具体实现部分 - Bootstrap 渲染引擎
class BootstrapRenderEngine extends RenderEngine {
  renderButton(props) {
    const variant = props.primary ? 'btn-primary' : 'btn-secondary';
    const size = props.size ? `btn-${props.size}` : '';
    
    return (
      <button className={`btn ${variant} ${size}`} onClick={props.onClick}>
        {props.children}
      </button>
    );
  }

  renderCard(props) {
    return (
      <div className="card" style={{ width: '18rem' }}>
        {props.title && (
          <div className="card-header">
            <h3 className="card-title">{props.title}</h3>
          </div>
        )}
        <div className="card-body">
          {props.children}
        </div>
        {props.actions && (
          <div className="card-footer">
            {props.actions}
          </div>
        )}
      </div>
    );
  }
}

// 抽象部分 - UI组件工厂
class UIComponentFactory {
  constructor(renderEngine) {
    this.renderEngine = renderEngine;
  }

  createButton(props) {
    throw new Error('子类必须实现 createButton 方法');
  }

  createCard(props) {
    throw new Error('子类必须实现 createCard 方法');
  }
}

// 扩展抽象部分 - 基础组件工厂
class BasicComponentFactory extends UIComponentFactory {
  constructor(renderEngine) {
    super(renderEngine);
  }

  createButton(props) {
    return this.renderEngine.renderButton(props);
  }

  createCard(props) {
    return this.renderEngine.renderCard(props);
  }
}

// 扩展抽象部分 - 高级组件工厂
class AdvancedComponentFactory extends UIComponentFactory {
  constructor(renderEngine) {
    super(renderEngine);
  }

  createButton(props) {
    // 添加高级功能，如点击波纹效果
    const enhancedProps = {
      ...props,
      onClick: (e) => {
        // 添加波纹效果逻辑
        console.log('添加波纹效果');
        if (props.onClick) {
          props.onClick(e);
        }
      }
    };
    return this.renderEngine.renderButton(enhancedProps);
  }

  createCard(props) {
    // 添加高级功能，如悬停效果
    const cardProps = {
      ...props,
      style: {
        ...props.style,
        transition: 'transform 0.3s ease'
      }
    };
    return this.renderEngine.renderCard(cardProps);
  }

  createFormField(props) {
    // 添加表单字段组件
    return (
      <div className="form-group">
        {props.label && <label htmlFor={props.id}>{props.label}</label>}
        <input
          type={props.type || 'text'}
          id={props.id}
          className="form-control"
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
        />
        {props.error && <div className="error-message">{props.error}</div>}
      </div>
    );
  }
}

// React应用组件
function App() {
  // 创建渲染引擎
  const materialUIRenderer = new MaterialUIRenderEngine();
  const bootstrapRenderer = new BootstrapRenderEngine();

  // 创建组件工厂
  const basicFactory = new BasicComponentFactory(materialUIRenderer);
  const advancedFactory = new AdvancedComponentFactory(bootstrapRenderer);

  // 创建按钮
  const materialButton = basicFactory.createButton({
    primary: true,
    onClick: () => console.log('Material UI 按钮点击')
  }, 'Material UI 按钮');

  const bootstrapButton = advancedFactory.createButton({
    primary: false,
    size: 'lg',
    onClick: () => console.log('Bootstrap 按钮点击')
  }, 'Bootstrap 按钮');

  // 创建卡片
  const materialCard = basicFactory.createCard({
    title: 'Material UI 卡片',
    actions: [
      basicFactory.createButton({ onClick: () => console.log('操作1') }, '操作1'),
      basicFactory.createButton({ primary: true, onClick: () => console.log('操作2') }, '操作2')
    ]
  }, <p>这是 Material UI 风格的卡片内容</p>);

  const bootstrapCard = advancedFactory.createCard({
    title: 'Bootstrap 卡片',
    actions: [
      advancedFactory.createButton({ onClick: () => console.log('确认') }, '确认'),
      advancedFactory.createButton({ onClick: () => console.log('取消') }, '取消')
    ]
  }, <p>这是 Bootstrap 风格的卡片内容</p>);

  // 动态切换渲染引擎
  const [rendererType, setRendererType] = React.useState('material');
  const toggleRenderer = () => {
    setRendererType(rendererType === 'material' ? 'bootstrap' : 'material');
  };

  return (
    <div className="app">
      <h1>桥接模式在React中的应用</h1>
      
      <div className="controls">
        <button onClick={toggleRenderer}>
          切换到 {rendererType === 'material' ? 'Bootstrap' : 'Material UI'} 风格
        </button>
      </div>
      
      <div className="components-container">
        <h2>按钮组件</h2>
        <div className="buttons">
          {rendererType === 'material' ? materialButton : bootstrapButton}
        </div>
        
        <h2>卡片组件</h2>
        <div className="cards">
          {rendererType === 'material' ? materialCard : bootstrapCard}
        </div>
      </div>
    </div>
  );
}
```

## 常见问题与解答

### Q: 桥接模式与继承相比有什么优势？
A: 桥接模式通过组合而不是继承来实现功能扩展，可以避免因多维度变化导致的类爆炸问题，并且支持在运行时动态切换实现。

### Q: 如何识别桥接模式中的抽象和实现两个维度？
A: 抽象维度通常是业务逻辑或高层接口，实现维度通常是底层实现细节或平台相关代码。

### Q: 桥接模式在JavaScript中的实现有什么特点？
A: 在JavaScript中，可以使用对象组合而不是类继承来实现桥接模式，更加灵活和简洁。

### Q: 桥接模式适用于哪些规模的项目？
A: 桥接模式特别适用于中大型项目，尤其是那些需要处理多维度变化的复杂系统。对于小型项目，可能会过度设计。

### Q: 如何在前端框架中应用桥接模式？
A: 在前端框架中，可以使用桥接模式来实现主题切换、平台适配、渲染引擎切换等功能，使UI组件可以在不同环境和风格之间灵活切换。