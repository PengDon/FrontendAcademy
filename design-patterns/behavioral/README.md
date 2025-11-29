# 行为型设计模式完全指南

本文档详细介绍行为型设计模式，包括其定义、分类、应用场景以及JavaScript实现示例。行为型设计模式关注对象之间的通信和职责分配，是软件设计中不可或缺的一部分。

## 目录

- [行为型设计模式完全指南](#行为型设计模式完全指南)
  - [目录](#目录)
  - [1. 行为型设计模式概述](#1-行为型设计模式概述)
    - [1.1 什么是行为型设计模式](#11-什么是行为型设计模式)
    - [1.2 行为型设计模式的重要性](#12-行为型设计模式的重要性)
    - [1.3 行为型设计模式的分类](#13-行为型设计模式的分类)
    - [1.4 选择合适的行为型设计模式](#14-选择合适的行为型设计模式)
  - [2. 责任链模式 (Chain of Responsibility)](#2-责任链模式-chain-of-responsibility)
    - [2.1 意图](#21-意图)
    - [2.2 结构](#22-结构)
    - [2.3 实现示例](#23-实现示例)
    - [2.4 应用场景](#24-应用场景)
    - [2.5 优缺点](#25-优缺点)
    - [2.6 变体](#26-变体)
  - [3. 命令模式 (Command)](#3-命令模式-command)
    - [3.1 意图](#31-意图)
    - [3.2 结构](#32-结构)
    - [3.3 实现示例](#33-实现示例)
    - [3.4 应用场景](#34-应用场景)
    - [3.5 优缺点](#35-优缺点)
    - [3.6 变体](#36-变体)
  - [4. 解释器模式 (Interpreter)](#4-解释器模式-interpreter)
    - [4.1 意图](#41-意图)
    - [4.2 结构](#42-结构)
    - [4.3 实现示例](#43-实现示例)
    - [4.4 应用场景](#44-应用场景)
    - [4.5 优缺点](#45-优缺点)
    - [4.6 变体](#46-变体)
  - [5. 迭代器模式 (Iterator)](#5-迭代器模式-iterator)
    - [5.1 意图](#51-意图)
    - [5.2 结构](#52-结构)
    - [5.3 实现示例](#53-实现示例)
    - [5.4 应用场景](#54-应用场景)
    - [5.5 优缺点](#55-优缺点)
    - [5.6 变体](#56-变体)
  - [6. 中介者模式 (Mediator)](#6-中介者模式-mediator)
    - [6.1 意图](#61-意图)
    - [6.2 结构](#62-结构)
    - [6.3 实现示例](#63-实现示例)
    - [6.4 应用场景](#64-应用场景)
    - [6.5 优缺点](#65-优缺点)
    - [6.6 变体](#66-变体)
  - [7. 备忘录模式 (Memento)](#7-备忘录模式-memento)
    - [7.1 意图](#71-意图)
    - [7.2 结构](#72-结构)
    - [7.3 实现示例](#73-实现示例)
    - [7.4 应用场景](#74-应用场景)
    - [7.5 优缺点](#75-优缺点)
    - [7.6 变体](#76-变体)
  - [8. 观察者模式 (Observer)](#8-观察者模式-observer)
    - [8.1 意图](#81-意图)
    - [8.2 结构](#82-结构)
    - [8.3 实现示例](#83-实现示例)
    - [8.4 应用场景](#84-应用场景)
    - [8.5 优缺点](#85-优缺点)
    - [8.6 变体](#86-变体)
  - [9. 状态模式 (State)](#9-状态模式-state)
    - [9.1 意图](#91-意图)
    - [9.2 结构](#92-结构)
    - [9.3 实现示例](#93-实现示例)
    - [9.4 应用场景](#94-应用场景)
    - [9.5 优缺点](#95-优缺点)
    - [9.6 变体](#96-变体)
  - [10. 策略模式 (Strategy)](#10-策略模式-strategy)
    - [10.1 意图](#101-意图)
    - [10.2 结构](#102-结构)
    - [10.3 实现示例](#103-实现示例)
    - [10.4 应用场景](#104-应用场景)
    - [10.5 优缺点](#105-优缺点)
    - [10.6 变体](#106-变体)
  - [11. 模板方法模式 (Template Method)](#11-模板方法模式-template-method)
    - [11.1 意图](#111-意图)
    - [11.2 结构](#112-结构)
    - [11.3 实现示例](#113-实现示例)
    - [11.4 应用场景](#114-应用场景)
    - [11.5 优缺点](#115-优缺点)
    - [11.6 变体](#116-变体)
  - [12. 访问者模式 (Visitor)](#12-访问者模式-visitor)
    - [12.1 意图](#121-意图)
    - [12.2 结构](#122-结构)
    - [12.3 实现示例](#123-实现示例)
    - [12.4 应用场景](#124-应用场景)
    - [12.5 优缺点](#125-优缺点)
    - [12.6 变体](#126-变体)
  - [13. 空对象模式 (Null Object)](#13-空对象模式-null-object)
    - [13.1 意图](#131-意图)
    - [13.2 结构](#132-结构)
    - [13.3 实现示例](#133-实现示例)
    - [13.4 应用场景](#134-应用场景)
    - [13.5 优缺点](#135-优缺点)
  - [14. 行为型模式的组合使用](#14-行为型模式的组合使用)
    - [14.1 责任链 + 命令模式](#141-责任链--命令模式)
    - [14.2 观察者 + 策略模式](#142-观察者--策略模式)
    - [14.3 状态 + 工厂模式](#143-状态--工厂模式)
    - [14.4 命令 + 备忘录模式](#144-命令--备忘录模式)
  - [15. 行为型设计模式的最佳实践](#15-行为型设计模式的最佳实践)
    - [15.1 单一职责原则](#151-单一职责原则)
    - [15.2 依赖倒置原则](#152-依赖倒置原则)
    - [15.3 接口隔离原则](#153-接口隔离原则)
    - [15.4 代码组织](#154-代码组织)
    - [15.5 测试策略](#155-测试策略)
    - [15.6 性能考量](#156-性能考量)
  - [16. 常见问题与解答](#16-常见问题与解答)
    - [16.1 如何选择合适的行为型模式](#161-如何选择合适的行为型模式)
    - [16.2 行为型模式与其他模式的区别](#162-行为型模式与其他模式的区别)
    - [16.3 JavaScript中实现设计模式的特殊考虑](#163-javascript中实现设计模式的特殊考虑)
    - [16.4 设计模式的过度使用](#164-设计模式的过度使用)
  - [17. 总结](#17-总结)

## 1. 行为型设计模式概述

### 1.1 什么是行为型设计模式

行为型设计模式（Behavioral Design Patterns）是设计模式的一种分类，主要关注对象之间的通信方式和责任分配。这类模式处理对象之间如何交互以及如何分配职责，帮助我们设计出松耦合、可复用的软件系统。

行为型设计模式不仅描述对象或类的模式，还描述它们之间的通信模式。通过这些模式，我们可以更灵活地控制对象之间的交互，实现对象行为的可扩展性和可维护性。

### 1.2 行为型设计模式的重要性

行为型设计模式在软件设计中具有以下重要性：

- **促进对象间的松耦合**：减少对象之间的直接依赖，提高代码的可维护性
- **提高代码复用性**：将常见的行为模式抽象出来，便于在不同场景中复用
- **增强系统灵活性**：允许在不修改现有代码的情况下扩展或修改系统行为
- **标准化对象交互**：提供被广泛接受的对象交互方式，便于团队协作和代码理解
- **简化复杂逻辑**：将复杂的行为分解为可管理的部分，使代码更易于理解和维护

### 1.3 行为型设计模式的分类

行为型设计模式通常分为以下几类：

**类行为型模式**：
- 模板方法模式 (Template Method)
- 解释器模式 (Interpreter)

**对象行为型模式**：
- 责任链模式 (Chain of Responsibility)
- 命令模式 (Command)
- 迭代器模式 (Iterator)
- 中介者模式 (Mediator)
- 备忘录模式 (Memento)
- 观察者模式 (Observer)
- 状态模式 (State)
- 策略模式 (Strategy)
- 访问者模式 (Visitor)
- 空对象模式 (Null Object)

### 1.4 选择合适的行为型设计模式

选择行为型设计模式时，应考虑以下因素：

1. **对象间交互的复杂度**：如果对象间交互复杂，考虑使用中介者模式
2. **算法的可替换性**：如果需要在运行时选择算法，考虑使用策略模式
3. **对象状态的管理**：如果对象状态变化影响行为，考虑使用状态模式
4. **请求的处理方式**：如果请求需要多个对象处理，考虑使用责任链模式
5. **对象间的依赖关系**：如果对象间存在一对多依赖，考虑使用观察者模式
6. **操作的参数化**：如果需要将操作参数化，考虑使用命令模式

## 2. 责任链模式 (Chain of Responsibility)

### 2.1 意图

责任链模式允许多个对象处理一个请求，而客户端不需要知道具体由哪个对象处理。请求沿着一条链传递，直到有一个对象能处理它为止。

### 2.2 结构

责任链模式包含以下角色：

- **抽象处理器 (Handler)**：定义处理请求的接口，包含一个指向下一个处理器的引用
- **具体处理器 (ConcreteHandler)**：实现处理请求的方法，如果不能处理则传递给下一个处理器
- **客户端 (Client)**：创建请求并将其提交到链上的第一个处理器

### 2.3 实现示例

```javascript
// 抽象处理器
class Handler {
  constructor() {
    this.nextHandler = null;
  }

  setNext(handler) {
    this.nextHandler = handler;
    // 返回handler以便链式调用
    return handler;
  }

  handle(request) {
    if (this.nextHandler) {
      return this.nextHandler.handle(request);
    }
    return null;
  }
}

// 具体处理器 - 处理低优先级请求
class LowPriorityHandler extends Handler {
  handle(request) {
    if (request.priority === 'low') {
      return `LowPriorityHandler: 处理请求 ${request.content}`;
    }
    return super.handle(request);
  }
}

// 具体处理器 - 处理中优先级请求
class MediumPriorityHandler extends Handler {
  handle(request) {
    if (request.priority === 'medium') {
      return `MediumPriorityHandler: 处理请求 ${request.content}`;
    }
    return super.handle(request);
  }
}

// 具体处理器 - 处理高优先级请求
class HighPriorityHandler extends Handler {
  handle(request) {
    if (request.priority === 'high') {
      return `HighPriorityHandler: 处理请求 ${request.content}`;
    }
    return super.handle(request);
  }
}

// 客户端代码
function clientCode() {
  // 创建处理器实例
  const lowHandler = new LowPriorityHandler();
  const mediumHandler = new MediumPriorityHandler();
  const highHandler = new HighPriorityHandler();

  // 设置处理链
  lowHandler.setNext(mediumHandler).setNext(highHandler);

  // 创建不同优先级的请求
  const requests = [
    { priority: 'high', content: '系统崩溃' },
    { priority: 'medium', content: '性能警告' },
    { priority: 'low', content: '日志记录' },
    { priority: 'urgent', content: '未知优先级' }
  ];

  // 处理请求
  for (const request of requests) {
    console.log(`\n请求: ${request.content} (优先级: ${request.priority})`);
    const result = lowHandler.handle(request);
    if (result) {
      console.log(result);
    } else {
      console.log('没有处理器能处理此请求');
    }
  }
}

// 运行客户端代码
clientCode();
```

### 2.4 应用场景

责任链模式适用于以下场景：

- 有多个对象可以处理一个请求，具体由哪个对象处理在运行时确定
- 希望将请求的发送者和接收者解耦
- 可以动态组合处理请求的对象
- 处理请求的对象集合应该可以被动态修改

### 2.5 优缺点

**优点：**
- 降低耦合度：请求的发送者和接收者解耦
- 灵活性：可以动态地改变链的顺序和内容
- 扩展性：新增处理器不需要修改现有代码，符合开闭原则

**缺点：**
- 请求可能最终不被处理
- 性能开销：请求需要遍历链上的所有处理器
- 调试困难：如果链太长，可能难以跟踪请求的处理过程

### 2.6 变体

责任链模式有几种常见变体：

- **纯责任链**：每个处理器要么完全处理请求，要么完全不处理
- **不纯责任链**：处理器可以处理请求的一部分，然后传递给下一个处理器
- **循环责任链**：链的最后一个处理器指回第一个处理器，形成循环
- **带条件的责任链**：根据条件决定是否将请求传递给下一个处理器

## 3. 命令模式 (Command)

### 3.1 意图

命令模式将请求封装为一个对象，从而使用户可以用不同的请求参数化对象，并支持可撤销的操作。

### 3.2 结构

命令模式包含以下角色：

- **命令 (Command)**：声明执行操作的接口
- **具体命令 (ConcreteCommand)**：将一个接收者对象绑定于一个动作，调用接收者相应的操作
- **接收者 (Receiver)**：知道如何执行与命令相关的操作
- **调用者 (Invoker)**：要求命令执行请求
- **客户端 (Client)**：创建具体命令对象并设置其接收者

### 3.3 实现示例

```javascript
// 命令接口
class Command {
  execute() {}
  undo() {}
}

// 接收者 - 文本编辑器
class TextEditor {
  constructor() {
    this.text = '';
  }

  append(text) {
    this.text += text;
    console.log(`编辑器内容: ${this.text}`);
    return this.text;
  }

  deleteLast(count = 1) {
    const previousText = this.text;
    this.text = this.text.slice(0, -count);
    console.log(`编辑器内容: ${this.text}`);
    return previousText;
  }

  getText() {
    return this.text;
  }
}

// 具体命令 - 添加文本
class AppendTextCommand extends Command {
  constructor(editor, text) {
    super();
    this.editor = editor;
    this.text = text;
  }

  execute() {
    this.editor.append(this.text);
  }

  undo() {
    this.editor.deleteLast(this.text.length);
  }
}

// 具体命令 - 删除文本
class DeleteTextCommand extends Command {
  constructor(editor, count) {
    super();
    this.editor = editor;
    this.count = count;
    this.previousText = '';
  }

  execute() {
    this.previousText = this.editor.getText();
    this.editor.deleteLast(this.count);
  }

  undo() {
    // 恢复为之前的文本
    this.editor.text = this.previousText;
    console.log(`编辑器内容: ${this.editor.text}`);
  }
}

// 调用者 - 文本编辑器控制
class EditorInvoker {
  constructor() {
    this.history = [];
    this.redoStack = [];
  }

  executeCommand(command) {
    command.execute();
    this.history.push(command);
    // 清空重做栈
    this.redoStack = [];
  }

  undo() {
    if (this.history.length === 0) {
      console.log('没有可撤销的操作');
      return;
    }

    const command = this.history.pop();
    command.undo();
    this.redoStack.push(command);
  }

  redo() {
    if (this.redoStack.length === 0) {
      console.log('没有可重做的操作');
      return;
    }

    const command = this.redoStack.pop();
    command.execute();
    this.history.push(command);
  }
}

// 客户端代码
function clientCode() {
  // 创建接收者
  const editor = new TextEditor();
  
  // 创建调用者
  const invoker = new EditorInvoker();
  
  // 执行命令
  console.log('执行添加文本命令: "Hello"');
  invoker.executeCommand(new AppendTextCommand(editor, 'Hello'));
  
  console.log('\n执行添加文本命令: " World"');
  invoker.executeCommand(new AppendTextCommand(editor, ' World'));
  
  console.log('\n执行删除文本命令: 5个字符');
  invoker.executeCommand(new DeleteTextCommand(editor, 5));
  
  console.log('\n撤销最后一个操作');
  invoker.undo();
  
  console.log('\n撤销最后一个操作');
  invoker.undo();
  
  console.log('\n重做操作');
  invoker.redo();
  
  console.log('\n执行添加文本命令: "!"');
  invoker.executeCommand(new AppendTextCommand(editor, '!'));
}

// 运行客户端代码
clientCode();
```

### 3.4 应用场景

命令模式适用于以下场景：

- 需要将请求参数化，使用不同的请求参数化对象
- 需要将请求的发送者和接收者解耦
- 需要支持可撤销操作
- 需要支持事务操作
- 需要将请求排队或记录请求日志

### 3.5 优缺点

**优点：**
- 低耦合：请求的发送者和接收者完全解耦
- 可扩展性：可以轻松添加新命令，无需修改现有代码
- 支持撤销/重做操作
- 支持请求排队和日志记录

**缺点：**
- 可能导致类的数量激增，每个命令都需要一个单独的类
- 某些简单命令实现可能显得冗余

### 3.6 变体

命令模式的常见变体：

- **宏命令**：多个命令组合成一个复杂命令
- **智能命令**：命令对象直接实现业务逻辑，无需单独的接收者
- **命令队列**：将命令存储在队列中，按顺序执行
- **持久化命令**：将命令序列化到存储介质，可以在系统重启后重新执行

## 4. 解释器模式 (Interpreter)

### 4.1 意图

解释器模式定义语言的语法，并解释该语言中的表达式。它适用于简单的语言解释或表达式求值。

### 4.2 结构

解释器模式包含以下角色：

- **抽象表达式 (AbstractExpression)**：声明解释操作的接口
- **终结表达式 (TerminalExpression)**：实现与语法中终结符相关的解释操作
- **非终结表达式 (NonterminalExpression)**：实现与语法中非终结符相关的解释操作
- **上下文 (Context)**：包含解释器之外的一些全局信息
- **客户端 (Client)**：构建表示该语言中特定句子的抽象语法树，调用解释操作

### 4.3 实现示例

```javascript
// 抽象表达式
class Expression {
  interpret(context) {}
}

// 终结表达式 - 数字
class NumberExpression extends Expression {
  constructor(value) {
    super();
    this.value = value;
  }

  interpret(context) {
    return this.value;
  }
}

// 非终结表达式 - 加法
class AddExpression extends Expression {
  constructor(leftExpression, rightExpression) {
    super();
    this.leftExpression = leftExpression;
    this.rightExpression = rightExpression;
  }

  interpret(context) {
    return this.leftExpression.interpret(context) + this.rightExpression.interpret(context);
  }
}

// 非终结表达式 - 减法
class SubtractExpression extends Expression {
  constructor(leftExpression, rightExpression) {
    super();
    this.leftExpression = leftExpression;
    this.rightExpression = rightExpression;
  }

  interpret(context) {
    return this.leftExpression.interpret(context) - this.rightExpression.interpret(context);
  }
}

// 非终结表达式 - 乘法
class MultiplyExpression extends Expression {
  constructor(leftExpression, rightExpression) {
    super();
    this.leftExpression = leftExpression;
    this.rightExpression = rightExpression;
  }

  interpret(context) {
    return this.leftExpression.interpret(context) * this.rightExpression.interpret(context);
  }
}

// 非终结表达式 - 除法
class DivideExpression extends Expression {
  constructor(leftExpression, rightExpression) {
    super();
    this.leftExpression = leftExpression;
    this.rightExpression = rightExpression;
  }

  interpret(context) {
    const divisor = this.rightExpression.interpret(context);
    if (divisor === 0) {
      throw new Error('除数不能为零');
    }
    return this.leftExpression.interpret(context) / divisor;
  }
}

// 上下文
class Context {
  constructor() {
    this.variables = {};
  }

  setVariable(name, value) {
    this.variables[name] = value;
  }

  getVariable(name) {
    return this.variables[name];
  }
}

// 客户端代码 - 简单计算器
function clientCode() {
  // 创建上下文
  const context = new Context();
  
  // 构建表达式: (5 + 3) * 2 - 4
  const expression = new SubtractExpression(
    new MultiplyExpression(
      new AddExpression(
        new NumberExpression(5),
        new NumberExpression(3)
      ),
      new NumberExpression(2)
    ),
    new NumberExpression(4)
  );
  
  // 解释表达式
  const result = expression.interpret(context);
  console.log('(5 + 3) * 2 - 4 =', result);
  
  // 更复杂的表达式: ((5 + 3) * 2 - 4) / 2
  const complexExpression = new DivideExpression(
    expression,
    new NumberExpression(2)
  );
  
  // 解释复杂表达式
  const complexResult = complexExpression.interpret(context);
  console.log('((5 + 3) * 2 - 4) / 2 =', complexResult);
}

// 运行客户端代码
clientCode();
```

### 4.4 应用场景

解释器模式适用于以下场景：

- 需要解释一种简单语言的语法
- 需要处理领域特定语言（DSL）
- 需要构建简单的语法解析器
- 需要执行配置文件中的规则或表达式

### 4.5 优缺点

**优点：**
- 容易改变和扩展语法
- 可以将语法规则表示为对象树
- 便于实现简单的语言

**缺点：**
- 不适用于复杂语法，会导致类爆炸
- 语法复杂时效率可能较低
- 维护困难，特别是当语法变得复杂时

### 4.6 变体

解释器模式的变体：

- **语法树解释器**：使用树结构表示语法
- **状态机解释器**：使用状态机解析语法
- **递归下降解释器**：使用递归下降解析技术
- **表驱动解释器**：使用表驱动的方式实现解释器

## 5. 迭代器模式 (Iterator)

### 5.1 意图

迭代器模式提供一种方法顺序访问一个聚合对象中的各个元素，而又不暴露其内部表示。

### 5.2 结构

迭代器模式包含以下角色：

- **迭代器 (Iterator)**：定义访问和遍历元素的接口
- **具体迭代器 (ConcreteIterator)**：实现迭代器接口，跟踪遍历的当前位置
- **聚合 (Aggregate)**：定义创建相应迭代器对象的接口
- **具体聚合 (ConcreteAggregate)**：实现创建相应迭代器的接口，返回一个合适的具体迭代器

### 5.3 实现示例

```javascript
// 迭代器接口
class Iterator {
  hasNext() {}
  next() {}
}

// 具体迭代器 - 数组迭代器
class ArrayIterator extends Iterator {
  constructor(array) {
    super();
    this.array = array;
    this.index = 0;
  }

  hasNext() {
    return this.index < this.array.length;
  }

  next() {
    if (this.hasNext()) {
      return this.array[this.index++];
    }
    return null;
  }
}

// 具体迭代器 - 倒序迭代器
class ReverseArrayIterator extends Iterator {
  constructor(array) {
    super();
    this.array = array;
    this.index = array.length - 1;
  }

  hasNext() {
    return this.index >= 0;
  }

  next() {
    if (this.hasNext()) {
      return this.array[this.index--];
    }
    return null;
  }
}

// 聚合接口
class Aggregate {
  createIterator() {}
}

// 具体聚合 - 自定义集合
class CustomCollection extends Aggregate {
  constructor() {
    super();
    this.items = [];
  }

  add(item) {
    this.items.push(item);
  }

  remove(item) {
    const index = this.items.indexOf(item);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }

  createIterator() {
    return new ArrayIterator(this.items);
  }

  createReverseIterator() {
    return new ReverseArrayIterator(this.items);
  }
}

// 客户端代码
function clientCode() {
  // 创建自定义集合
  const collection = new CustomCollection();
  
  // 添加元素
  collection.add('Item 1');
  collection.add('Item 2');
  collection.add('Item 3');
  collection.add('Item 4');
  collection.add('Item 5');
  
  // 使用正序迭代器
  console.log('使用正序迭代器:');
  const iterator = collection.createIterator();
  while (iterator.hasNext()) {
    console.log(iterator.next());
  }
  
  // 使用倒序迭代器
  console.log('\n使用倒序迭代器:');
  const reverseIterator = collection.createReverseIterator();
  while (reverseIterator.hasNext()) {
    console.log(reverseIterator.next());
  }
  
  // 使用JavaScript内置的迭代器
  console.log('\n使用JavaScript内置的forEach:');
  const array = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];
  array.forEach(item => console.log(item));
  
  // 使用JavaScript的for...of循环（需要集合实现Symbol.iterator）
  console.log('\n使用for...of循环:');
  for (const item of array) {
    console.log(item);
  }
}

// 为自定义集合添加Symbol.iterator支持
CustomCollection.prototype[Symbol.iterator] = function() {
  return this.createIterator();
};

// 运行客户端代码
clientCode();
```

### 5.4 应用场景

迭代器模式适用于以下场景：

- 需要顺序访问一个聚合对象的元素，而不暴露其内部表示
- 需要为一个聚合对象提供多种遍历方式
- 需要遍历不同的聚合结构，但希望使用统一的接口
- 需要在遍历过程中对聚合对象进行操作，而不关心其具体实现

### 5.5 优缺点

**优点：**
- 迭代器分离了集合的遍历逻辑，符合单一职责原则
- 可以为不同的集合提供统一的遍历接口
- 可以在不修改集合的情况下添加新的迭代器

**缺点：**
- 对于简单的集合，使用迭代器可能增加不必要的复杂性
- 在JavaScript中，内置的数组方法和迭代协议已经提供了类似功能

### 5.6 变体

迭代器模式的变体：

- **内部迭代器**：由迭代器控制整个遍历过程
- **外部迭代器**：由客户端控制遍历过程
- **懒加载迭代器**：按需计算下一个元素
- **无限迭代器**：可以无限生成元素的迭代器

## 6. 中介者模式 (Mediator)

### 6.1 意图

中介者模式定义一个对象，封装一组对象之间的交互，使这些对象之间不需要显式地相互引用，从而降低它们之间的耦合度。

### 6.2 结构

中介者模式包含以下角色：

- **中介者 (Mediator)**：定义对象间交互的接口
- **具体中介者 (ConcreteMediator)**：实现中介者接口，协调各同事对象之间的交互
- **同事类 (Colleague)**：定义与其他同事类交互的接口
- **具体同事类 (ConcreteColleague)**：实现同事类接口，通过中介者与其他同事类交互

### 6.3 实现示例

```javascript
// 中介者接口
class Mediator {
  notify(sender, event) {}
}

// 具体中介者 - 聊天室中介者
class ChatRoomMediator extends Mediator {
  constructor() {
    super();
    this.users = {};
  }

  register(user) {
    this.users[user.name] = user;
    user.mediator = this;
  }

  notify(sender, event) {
    if (event.type === 'message') {
      // 广播消息给所有用户，除了发送者
      for (const key in this.users) {
        if (key !== sender.name) {
          this.users[key].receive(sender.name, event.message);
        }
      }
    } else if (event.type === 'private_message') {
      // 发送私人消息
      if (this.users[event.recipient]) {
        this.users[event.recipient].receivePrivate(sender.name, event.message);
      } else {
        console.log(`用户 ${event.recipient} 不存在`);
      }
    }
  }
}

// 同事类
class User {
  constructor(name) {
    this.name = name;
    this.mediator = null;
  }

  send(message) {
    console.log(`${this.name} 发送: ${message}`);
    this.mediator.notify(this, { type: 'message', message });
  }

  sendPrivate(recipient, message) {
    console.log(`${this.name} 发送给 ${recipient}: ${message}`);
    this.mediator.notify(this, { type: 'private_message', recipient, message });
  }

  receive(sender, message) {
    console.log(`${this.name} 收到来自 ${sender} 的消息: ${message}`);
  }

  receivePrivate(sender, message) {
    console.log(`${this.name} 收到来自 ${sender} 的私人消息: ${message}`);
  }
}

// 客户端代码
function clientCode() {
  // 创建中介者
  const chatRoom = new ChatRoomMediator();
  
  // 创建用户
  const user1 = new User('Alice');
  const user2 = new User('Bob');
  const user3 = new User('Charlie');
  
  // 注册用户到中介者
  chatRoom.register(user1);
  chatRoom.register(user2);
  chatRoom.register(user3);
  
  // 用户发送消息
  console.log('--- 发送公共消息 ---');
  user1.send('大家好!');
  
  console.log('\n--- 发送私人消息 ---');
  user2.sendPrivate('Alice', '你好Alice!');
  user3.sendPrivate('Bob', '嘿Bob，最近怎么样?');
  
  console.log('\n--- 发送给不存在的用户 ---');
  user1.sendPrivate('Dave', '你在吗?');
}

// 运行客户端代码
clientCode();
```

### 6.4 应用场景

中介者模式适用于以下场景：

- 一组对象之间的交互非常复杂，导致它们之间的依赖关系混乱且难以理解
- 一个对象引用其他许多对象并直接与它们通信，导致难以复用该对象
- 希望通过集中化管理对象间的交互，来降低系统的耦合度

### 6.5 优缺点

**优点：**
- 减少对象之间的直接依赖，降低耦合度
- 将对象间的交互集中管理，便于维护和扩展
- 可以更容易地实现对象间的通信规则

**缺点：**
- 中介者可能变得过于复杂，成为"上帝对象"
- 系统复杂性转移到中介者，可能导致中介者类变得难以维护

### 6.6 变体

中介者模式的变体：

- **事件总线**：使用发布-订阅模式实现的中介者
- **聊天室**：典型的中介者应用，如聊天应用中的消息转发
- **MVC模式中的控制器**：可以看作是视图和模型之间的中介者
- **前端框架中的状态管理**：如Redux，可以看作是组件间通信的中介者

## 7. 备忘录模式 (Memento)

### 7.1 意图

备忘录模式在不破坏封装的前提下，捕获一个对象的内部状态，并在该对象之外保存这个状态，以便在需要时恢复对象到原先的状态。

### 7.2 结构

备忘录模式包含以下角色：

- **发起人 (Originator)**：创建并存储状态，创建备忘录对象
- **备忘录 (Memento)**：存储发起人对象的内部状态，防止发起人以外的对象访问备忘录
- **管理者 (Caretaker)**：保存备忘录，但不能操作或检查备忘录的内容

### 7.3 实现示例

```javascript
// 备忘录类
class Memento {
  constructor(state) {
    // 私有状态，只能通过getter访问
    this._state = JSON.parse(JSON.stringify(state)); // 深拷贝避免引用问题
  }

  getState() {
    return JSON.parse(JSON.stringify(this._state)); // 返回深拷贝，避免外部修改
  }
}

// 发起人 - 编辑器
class Editor {
  constructor() {
    this.content = '';
    this.selection = null;
    this.cursorPosition = { x: 0, y: 0 };
  }

  setContent(content) {
    this.content = content;
  }

  setSelection(selection) {
    this.selection = selection;
  }

  setCursorPosition(x, y) {
    this.cursorPosition = { x, y };
  }

  // 创建备忘录，保存当前状态
  save() {
    return new Memento({
      content: this.content,
      selection: this.selection,
      cursorPosition: this.cursorPosition
    });
  }

  // 从备忘录恢复状态
  restore(memento) {
    const state = memento.getState();
    this.content = state.content;
    this.selection = state.selection;
    this.cursorPosition = state.cursorPosition;
    
    console.log('编辑器已恢复到之前的状态');
    this.logState();
  }

  logState() {
    console.log(`内容: ${this.content}`);
    console.log(`选择: ${JSON.stringify(this.selection)}`);
    console.log(`光标位置: (${this.cursorPosition.x}, ${this.cursorPosition.y})`);
  }
}

// 管理者 - 历史记录管理
class History {
  constructor() {
    this.mementos = [];
  }

  push(memento) {
    this.mementos.push(memento);
  }

  pop() {
    if (this.mementos.length === 0) {
      return null;
    }
    return this.mementos.pop();
  }

  getStateCount() {
    return this.mementos.length;
  }
}

// 客户端代码
function clientCode() {
  // 创建编辑器和历史记录
  const editor = new Editor();
  const history = new History();
  
  // 初始状态
  console.log('--- 初始状态 ---');
  editor.setContent('Hello');
  editor.setCursorPosition(5, 0);
  editor.logState();
  
  // 保存状态
  history.push(editor.save());
  
  // 修改状态
  console.log('\n--- 修改内容 ---');
  editor.setContent('Hello World');
  editor.setSelection({ start: 6, end: 11 });
  editor.setCursorPosition(11, 0);
  editor.logState();
  
  // 保存状态
  history.push(editor.save());
  
  // 再次修改
  console.log('\n--- 再次修改 ---');
  editor.setContent('Hello Web');
  editor.setCursorPosition(9, 0);
  editor.logState();
  
  // 恢复到前一个状态
  console.log('\n--- 恢复到前一个状态 ---');
  const memento1 = history.pop();
  editor.restore(memento1);
  
  // 恢复到最初状态
  console.log('\n--- 恢复到最初状态 ---');
  const memento2 = history.pop();
  editor.restore(memento2);
}

// 运行客户端代码
clientCode();
```

### 7.4 应用场景

备忘录模式适用于以下场景：

- 需要保存和恢复对象状态的场景，如撤销/重做操作
- 需要避免暴露对象的实现细节，同时允许恢复到先前状态
- 需要在不破坏封装的前提下捕获对象的内部状态

### 7.5 优缺点

**优点：**
- 提供了状态恢复机制，允许撤销操作
- 封装了状态存储和恢复的逻辑，符合单一职责原则
- 保持了对象的封装性，状态的存储和恢复不影响对象的内部实现

**缺点：**
- 如果对象状态很大，可能导致内存占用过高
- 每次保存状态都需要创建新的备忘录对象，可能影响性能

### 7.6 变体

备忘录模式的变体：

- **快照备忘录**：保存对象的完整快照
- **差异备忘录**：只保存状态的变化部分
- **增量备忘录**：记录操作而不是状态，通过重放操作来恢复状态
- **外部化备忘录**：将备忘录存储在外部媒介，如文件系统或数据库

## 8. 观察者模式 (Observer)

### 8.1 意图

观察者模式定义一种一对多的依赖关系，当一个对象的状态发生变化时，所有依赖于它的对象都会得到通知并自动更新。

### 8.2 结构

观察者模式包含以下角色：

- **主题 (Subject)**：维护一组观察者，提供注册和删除观察者的接口
- **观察者 (Observer)**：定义更新接口，当主题状态变化时被调用
- **具体主题 (ConcreteSubject)**：实现主题接口，当状态变化时通知所有观察者
- **具体观察者 (ConcreteObserver)**：实现观察者接口，保存对主题的引用，实现更新操作

### 8.3 实现示例

```javascript
// 观察者接口
class Observer {
  update(subject, data) {}
}

// 主题接口
class Subject {
  constructor() {
    this.observers = [];
  }

  addObserver(observer) {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  removeObserver(observer) {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  notify(data) {
    for (const observer of this.observers) {
      observer.update(this, data);
    }
  }
}

// 具体主题 - 新闻发布者
class NewsPublisher extends Subject {
  constructor() {
    super();
    this.latestNews = null;
  }

  publishNews(news) {
    console.log(`发布新闻: ${news}`);
    this.latestNews = news;
    this.notify({ news });
  }

  getLatestNews() {
    return this.latestNews;
  }
}

// 具体观察者 - 手机订阅者
class PhoneSubscriber extends Observer {
  constructor(name) {
    super();
    this.name = name;
  }

  update(subject, data) {
    console.log(`${this.name} (手机) 收到新闻: ${data.news}`);
  }
}

// 具体观察者 - 邮件订阅者
class EmailSubscriber extends Observer {
  constructor(name) {
    super();
    this.name = name;
  }

  update(subject, data) {
    console.log(`${this.name} (邮件) 收到新闻: ${data.news}`);
  }
}

// 客户端代码
function clientCode() {
  // 创建主题
  const newsPublisher = new NewsPublisher();
  
  // 创建观察者
  const phoneSubscriber1 = new PhoneSubscriber('Alice');
  const phoneSubscriber2 = new PhoneSubscriber('Bob');
  const emailSubscriber = new EmailSubscriber('Charlie');
  
  // 注册观察者
  newsPublisher.addObserver(phoneSubscriber1);
  newsPublisher.addObserver(phoneSubscriber2);
  newsPublisher.addObserver(emailSubscriber);
  
  // 发布新闻
  console.log('--- 第一次发布新闻 ---');
  newsPublisher.publishNews('今天天气很好!');
  
  // 移除一个观察者
  console.log('\n--- 移除Bob的手机订阅 ---');
  newsPublisher.removeObserver(phoneSubscriber2);
  
  // 再次发布新闻
  console.log('\n--- 第二次发布新闻 ---');
  newsPublisher.publishNews('有新的技术文章发布!');
}

// 运行客户端代码
clientCode();
```

### 8.4 应用场景

观察者模式适用于以下场景：

- 当一个对象的改变需要同时改变其他对象时
- 当一个对象必须通知其他对象，而又不希望这些对象与自己紧密耦合时
- 实现事件处理系统
- 实现GUI组件之间的通信
- 实现发布-订阅系统

### 8.5 优缺点

**优点：**
- 实现了对象之间的松耦合
- 支持广播通信，一个对象的改变可以通知多个观察者
- 符合开闭原则，新增观察者不需要修改主题代码

**缺点：**
- 如果观察者数量过多，可能导致通知效率低下
- 如果存在循环依赖，可能导致系统崩溃
- 观察者无法知道主题是如何变化的，只能知道变化的结果

### 8.6 变体

观察者模式的变体：

- **发布-订阅模式**：通过事件总线或中介者实现更松耦合的通信
- **事件委托**：使用事件委托机制处理事件
- **数据流模式**：如Flux和Redux，单向数据流的状态管理
- **响应式编程**：如RxJS，基于事件流的异步编程范式

## 9. 状态模式 (State)

### 9.1 意图

状态模式允许对象在内部状态改变时改变其行为。对象看起来好像修改了它的类。

### 9.2 结构

状态模式包含以下角色：

- **上下文 (Context)**：维护一个指向当前状态对象的引用，委托状态对象处理请求
- **状态 (State)**：定义接口，封装与上下文的一个特定状态相关的行为
- **具体状态 (ConcreteState)**：实现状态接口，定义特定状态的行为

### 9.3 实现示例

```javascript
// 状态接口
class State {
  handle(context) {}
  getName() {}
}

// 具体状态 - 待付款
class PendingPaymentState extends State {
  handle(context) {
    console.log('订单待付款状态');
    // 处理待付款状态的逻辑
    return this.getName();
  }

  getName() {
    return 'pending_payment';
  }
}

// 具体状态 - 已付款
class PaidState extends State {
  handle(context) {
    console.log('订单已付款，准备发货');
    // 处理已付款状态的逻辑
    context.setState(new ShippingState());
    return context.getCurrentState().getName();
  }

  getName() {
    return 'paid';
  }
}

// 具体状态 - 配送中
class ShippingState extends State {
  handle(context) {
    console.log('订单正在配送中');
    // 处理配送中状态的逻辑
    context.setState(new DeliveredState());
    return context.getCurrentState().getName();
  }

  getName() {
    return 'shipping';
  }
}

// 具体状态 - 已送达
class DeliveredState extends State {
  handle(context) {
    console.log('订单已送达，交易完成');
    // 处理已送达状态的逻辑
    return this.getName();
  }

  getName() {
    return 'delivered';
  }
}

// 上下文 - 订单
class Order {
  constructor() {
    // 初始状态为待付款
    this.state = new PendingPaymentState();
  }

  setState(state) {
    this.state = state;
    console.log(`订单状态变更为: ${state.getName()}`);
  }

  getCurrentState() {
    return this.state;
  }

  process() {
    return this.state.handle(this);
  }
}

// 客户端代码
function clientCode() {
  // 创建订单
  const order = new Order();
  
  console.log('--- 订单创建 ---');
  console.log(`当前状态: ${order.getCurrentState().getName()}`);
  
  console.log('\n--- 处理订单 (付款) ---');
  const state1 = order.process();
  console.log(`处理后状态: ${state1}`);
  
  console.log('\n--- 处理订单 (发货) ---');
  const state2 = order.process();
  console.log(`处理后状态: ${state2}`);
  
  console.log('\n--- 处理订单 (送达) ---');
  const state3 = order.process();
  console.log(`处理后状态: ${state3}`);
  
  // 尝试在已完成状态下再次处理
  console.log('\n--- 尝试在已完成状态下再次处理 ---');
  const state4 = order.process();
  console.log(`处理后状态: ${state4}`);
}

// 运行客户端代码
clientCode();
```

### 9.4 应用场景

状态模式适用于以下场景：

- 对象的行为依赖于其状态，并且在运行时可能会改变
- 包含大量条件语句来处理不同状态的对象
- 状态转换逻辑复杂，需要集中管理
- 希望避免使用过多的条件判断语句

### 9.5 优缺点

**优点：**
- 将不同状态的行为封装到独立的类中，符合单一职责原则
- 避免使用大量条件语句，代码更清晰
- 状态转换逻辑集中管理，易于维护和扩展
- 支持运行时动态切换状态

**缺点：**
- 可能导致类数量增加，每个状态都需要一个单独的类
- 如果状态过多，可能会增加系统的复杂性

### 9.6 变体

状态模式的变体：

- **简单状态机**：使用枚举或常量表示状态
- **表格驱动状态机**：使用表格定义状态转换
- **层次状态机**：状态之间存在继承关系
- **并发状态机**：同时维护多个状态机

## 10. 策略模式 (Strategy)

### 10.1 意图

策略模式定义一系列算法，把它们封装起来，并且使它们可以互相替换。策略模式让算法的变化独立于使用算法的客户。

### 10.2 结构

策略模式包含以下角色：

- **策略 (Strategy)**：定义所有支持算法的公共接口
- **具体策略 (ConcreteStrategy)**：实现策略接口，提供具体的算法实现
- **上下文 (Context)**：持有一个策略对象的引用，使用这个策略对象执行具体的算法

### 10.3 实现示例

```javascript
// 策略接口
class PaymentStrategy {
  pay(amount) {}
}

// 具体策略 - 信用卡支付
class CreditCardPayment extends PaymentStrategy {
  constructor(cardNumber, cvv, expirationDate) {
    super();
    this.cardNumber = cardNumber;
    this.cvv = cvv;
    this.expirationDate = expirationDate;
  }

  pay(amount) {
    console.log(`使用信用卡支付 $${amount}`);
    console.log(`卡号: ${this.maskCardNumber(this.cardNumber)}`);
    console.log(`到期日: ${this.expirationDate}`);
    return true;
  }

  maskCardNumber(cardNumber) {
    const lastFourDigits = cardNumber.slice(-4);
    return `****-****-****-${lastFourDigits}`;
  }
}

// 具体策略 - PayPal支付
class PayPalPayment extends PaymentStrategy {
  constructor(email) {
    super();
    this.email = email;
  }

  pay(amount) {
    console.log(`使用PayPal支付 $${amount}`);
    console.log(`邮箱: ${this.email}`);
    return true;
  }
}

// 具体策略 - 比特币支付
class BitcoinPayment extends PaymentStrategy {
  constructor(walletAddress) {
    super();
    this.walletAddress = walletAddress;
  }

  pay(amount) {
    console.log(`使用比特币支付 $${amount}`);
    console.log(`钱包地址: ${this.maskWalletAddress(this.walletAddress)}`);
    return true;
  }

  maskWalletAddress(address) {
    const firstSix = address.slice(0, 6);
    const lastFour = address.slice(-4);
    return `${firstSix}...${lastFour}`;
  }
}

// 上下文 - 订单支付
class Order {
  constructor() {
    this.items = [];
    this.paymentStrategy = null;
  }

  addItem(item, price) {
    this.items.push({ item, price });
    return this;
  }

  setPaymentStrategy(strategy) {
    this.paymentStrategy = strategy;
  }

  calculateTotal() {
    return this.items.reduce((total, { price }) => total + price, 0);
  }

  processOrder() {
    if (!this.paymentStrategy) {
      console.log('请选择支付方式');
      return false;
    }

    const total = this.calculateTotal();
    console.log(`订单总额: $${total}`);
    return this.paymentStrategy.pay(total);
  }
}

// 客户端代码
function clientCode() {
  // 创建订单
  const order = new Order();
  
  // 添加商品
  order.addItem('iPhone', 999.99)
       .addItem('保护壳', 29.99)
       .addItem('耳机', 129.99);
  
  console.log('--- 信用卡支付 ---');
  order.setPaymentStrategy(new CreditCardPayment('1234567890123456', '123', '12/25'));
  order.processOrder();
  
  console.log('\n--- PayPal支付 ---');
  order.setPaymentStrategy(new PayPalPayment('user@example.com'));
  order.processOrder();
  
  console.log('\n--- 比特币支付 ---');
  order.setPaymentStrategy(new BitcoinPayment('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'));
  order.processOrder();
}

// 运行客户端代码
clientCode();
```

### 10.4 应用场景

策略模式适用于以下场景：

- 有多个算法可以完成同一个任务，但需要在运行时动态选择
- 一个类定义了多种行为，这些行为在类中以多个条件语句的形式出现
- 需要避免使用难以维护的条件语句
- 需要封装算法的变化

### 10.5 优缺点

**优点：**
- 提供了一种管理算法族的方法
- 支持算法的切换，而不需要修改客户端代码
- 避免使用多重条件判断语句
- 符合单一职责原则和开闭原则

**缺点：**
- 客户端必须了解所有策略类的存在，以便选择合适的策略
- 可能导致策略类的数量增加
- 客户端需要负责创建和选择适当的策略对象

### 10.6 变体

策略模式的变体：

- **简单工厂+策略模式**：使用工厂模式创建策略对象
- **组合策略**：将多个策略组合使用
- **缓存策略**：缓存策略对象以提高性能
- **参数化策略**：通过参数配置策略行为

## 11. 模板方法模式 (Template Method)

### 11.1 意图

模板方法模式定义了一个算法的骨架，将一些步骤延迟到子类中。模板方法让子类可以在不改变算法结构的情况下重新定义算法的某些特定步骤。

### 11.2 结构

模板方法模式包含以下角色：

- **抽象类 (AbstractClass)**：定义算法的骨架，包含模板方法和抽象操作
- **具体类 (ConcreteClass)**：实现抽象类中定义的抽象操作，完成算法中的特定步骤

### 11.3 实现示例

```javascript
// 抽象类 - 冲泡饮料
class Beverage {
  // 模板方法，定义算法骨架
  prepareRecipe() {
    this.boilWater();
    this.brew();
    this.pourInCup();
    if (this.customerWantsCondiments()) {
      this.addCondiments();
    }
    console.log('饮料准备好了!\n');
  }

  // 具体方法，由父类实现
  boilWater() {
    console.log('煮沸水');
  }

  pourInCup() {
    console.log('倒入杯子');
  }

  // 抽象方法，由子类实现
  brew() {}
  addCondiments() {}

  // 钩子方法，子类可以覆盖也可以不覆盖
  customerWantsCondiments() {
    return true;
  }
}

// 具体类 - 咖啡
class Coffee extends Beverage {
  brew() {
    console.log('用沸水冲泡咖啡');
  }

  addCondiments() {
    console.log('添加糖和牛奶');
  }

  // 覆盖钩子方法
  customerWantsCondiments() {
    return confirm('您想在咖啡中加入糖和牛奶吗？');
  }
}

// 具体类 - 茶
class Tea extends Beverage {
  brew() {
    console.log('用沸水浸泡茶包');
  }

  addCondiments() {
    console.log('添加柠檬');
  }

  // 覆盖钩子方法
  customerWantsCondiments() {
    return confirm('您想在茶中加入柠檬吗？');
  }
}

// 具体类 - 绿茶（不添加调料）
class GreenTea extends Beverage {
  brew() {
    console.log('用温水浸泡绿茶叶');
  }

  addCondiments() {
    // 绿茶通常不加调料
  }

  // 覆盖钩子方法
  customerWantsCondiments() {
    return false;
  }
}

// 模拟confirm函数
function confirm(message) {
  console.log(message);
  // 为了演示，这里随机返回true或false
  return Math.random() > 0.5;
}

// 客户端代码
function clientCode() {
  console.log('--- 准备咖啡 ---');
  const coffee = new Coffee();
  coffee.prepareRecipe();
  
  console.log('--- 准备茶 ---');
  const tea = new Tea();
  tea.prepareRecipe();
  
  console.log('--- 准备绿茶 ---');
  const greenTea = new GreenTea();
  greenTea.prepareRecipe();
}

// 运行客户端代码
clientCode();
```

### 11.4 应用场景

模板方法模式适用于以下场景：

- 算法的结构确定，但算法中的某些步骤可以在子类中定制
- 多个子类共享公共的行为，但有特定的差异
- 需要控制子类的扩展，只允许在特定点进行扩展
- 希望避免代码重复，将公共代码放在父类中

### 11.5 优缺点

**优点：**
- 定义了算法的骨架，控制算法的主流程
- 将公共代码提取到父类，减少代码重复
- 通过钩子方法允许子类决定是否执行某些步骤
- 符合开闭原则，便于扩展

**缺点：**
- 可能导致类的数量增加
- 如果父类中的模板方法修改，可能影响所有子类
- 子类必须实现抽象方法，增加了使用复杂度

### 11.6 变体

模板方法模式的变体：

- **带钩子的模板方法**：使用钩子方法控制算法流程
- **工厂方法作为模板方法**：在模板方法中调用工厂方法创建对象
- **模板方法与策略模式组合**：将算法的部分步骤替换为策略
- **模板方法与观察者模式组合**：在特定步骤通知观察者

## 12. 访问者模式 (Visitor)

### 12.1 意图

访问者模式表示一个作用于某对象结构中的各元素的操作。它允许在不改变各元素的类的前提下定义作用于这些元素的新操作。

### 12.2 结构

访问者模式包含以下角色：

- **访问者 (Visitor)**：声明一个访问操作的接口，针对每个具体元素类都有一个对应的访问操作
- **具体访问者 (ConcreteVisitor)**：实现访问者接口，定义对每个元素类的具体访问操作
- **元素 (Element)**：定义一个接受访问者的方法
- **具体元素 (ConcreteElement)**：实现元素接口，接受访问者
- **对象结构 (ObjectStructure)**：持有元素集合，并提供遍历元素的方法

### 12.3 实现示例

```javascript
// 访问者接口
class Visitor {
  visitConcreteElementA(element) {}
  visitConcreteElementB(element) {}
}

// 元素接口
class Element {
  accept(visitor) {}
}

// 具体元素 - 元素A
class ConcreteElementA extends Element {
  accept(visitor) {
    return visitor.visitConcreteElementA(this);
  }

  operationA() {
    return 'Element A operation';
  }
}

// 具体元素 - 元素B
class ConcreteElementB extends Element {
  accept(visitor) {
    return visitor.visitConcreteElementB(this);
  }

  operationB() {
    return 'Element B operation';
  }
}

// 具体访问者 - 访问者1
class ConcreteVisitor1 extends Visitor {
  visitConcreteElementA(element) {
    console.log(`访问者1 访问 ${element.constructor.name}`);
    return `访问者1: ${element.operationA()}`;
  }

  visitConcreteElementB(element) {
    console.log(`访问者1 访问 ${element.constructor.name}`);
    return `访问者1: ${element.operationB()}`;
  }
}

// 具体访问者 - 访问者2
class ConcreteVisitor2 extends Visitor {
  visitConcreteElementA(element) {
    console.log(`访问者2 访问 ${element.constructor.name}`);
    return `访问者2: ${element.operationA()}`;
  }

  visitConcreteElementB(element) {
    console.log(`访问者2 访问 ${element.constructor.name}`);
    return `访问者2: ${element.operationB()}`;
  }
}

// 对象结构
class ObjectStructure {
  constructor() {
    this.elements = [];
  }

  add(element) {
    this.elements.push(element);
  }

  remove(element) {
    const index = this.elements.indexOf(element);
    if (index !== -1) {
      this.elements.splice(index, 1);
    }
  }

  accept(visitor) {
    const results = [];
    for (const element of this.elements) {
      results.push(element.accept(visitor));
    }
    return results;
  }
}

// 客户端代码
function clientCode() {
  // 创建对象结构
  const structure = new ObjectStructure();
  
  // 添加元素
  structure.add(new ConcreteElementA());
  structure.add(new ConcreteElementB());
  structure.add(new ConcreteElementA());
  
  // 创建访问者
  const visitor1 = new ConcreteVisitor1();
  const visitor2 = new ConcreteVisitor2();
  
  console.log('--- 访问者1 访问所有元素 ---');
  const results1 = structure.accept(visitor1);
  console.log('结果:', results1);
  
  console.log('\n--- 访问者2 访问所有元素 ---');
  const results2 = structure.accept(visitor2);
  console.log('结果:', results2);
}

// 运行客户端代码
clientCode();
```

### 12.4 应用场景

访问者模式适用于以下场景：

- 对象结构相对稳定，但经常需要定义新的操作
- 需要对一个对象结构中的多个不同类型的对象执行操作，而不希望这些操作污染这些对象的类
- 有很多不同的并且不相关的操作需要在对象结构上执行

### 12.5 优缺点

**优点：**
- 增加新的操作很容易，只需添加新的访问者类
- 操作的相关代码集中在一个访问者类中，而不是分散在各个元素类中
- 可以访问不同类型的元素，不需要类型转换

**缺点：**
- 如果对象结构经常变化，访问者模式会变得难以维护
- 违反了依赖倒置原则，访问者依赖于具体元素，而不是抽象元素
- 可能破坏元素的封装性

### 12.6 变体

访问者模式的变体：

- **双分派访问者**：使用双重分派机制实现多态
- **累积访问者**：在访问过程中累积结果
- **内联访问者**：使用匿名函数或闭包实现访问者
- **静态类型访问者**：在静态类型语言中使用泛型实现类型安全的访问者

## 13. 空对象模式 (Null Object)

### 13.1 意图

空对象模式提供一个默认实现，当需要一个对象但实际上不存在时，可以使用空对象替代null，从而避免空引用异常。

### 13.2 结构

空对象模式包含以下角色：

- **抽象对象 (AbstractObject)**：定义接口或抽象类
- **具体对象 (ConcreteObject)**：实现抽象对象的接口
- **空对象 (NullObject)**：提供一个默认的、无操作的实现

### 13.3 实现示例

```javascript
// 抽象对象 - 用户接口
class AbstractUser {
  getName() {}
  getEmail() {}
  isNull() {}
  sendNotification(message) {}
}

// 具体对象 - 真实用户
class RealUser extends AbstractUser {
  constructor(name, email) {
    super();
    this.name = name;
    this.email = email;
  }

  getName() {
    return this.name;
  }

  getEmail() {
    return this.email;
  }

  isNull() {
    return false;
  }

  sendNotification(message) {
    console.log(`向 ${this.name} (${this.email}) 发送通知: ${message}`);
    return true;
  }
}

// 空对象 - 空用户
class NullUser extends AbstractUser {
  getName() {
    return 'Guest';
  }

  getEmail() {
    return 'guest@example.com';
  }

  isNull() {
    return true;
  }

  sendNotification(message) {
    console.log(`尝试向匿名用户发送通知，操作被忽略: ${message}`);
    return false;
  }
}

// 用户工厂
class UserFactory {
  static getUser(name, email) {
    if (name && email) {
      return new RealUser(name, email);
    }
    return new NullUser();
  }
}

// 通知服务
class NotificationService {
  sendWelcomeMessage(user) {
    // 不需要检查user是否为null
    user.sendNotification('欢迎使用我们的服务！');
    console.log(`用户 ${user.getName()} 收到了欢迎消息`);
  }
}

// 客户端代码
function clientCode() {
  const notificationService = new NotificationService();
  
  // 创建真实用户
  const john = UserFactory.getUser('John Doe', 'john@example.com');
  const jane = UserFactory.getUser('Jane Smith', 'jane@example.com');
  
  // 创建空用户
  const anonymous = UserFactory.getUser(null, null);
  const invalidEmail = UserFactory.getUser('Invalid User', null);
  
  console.log('--- 发送欢迎消息给真实用户 ---');
  notificationService.sendWelcomeMessage(john);
  notificationService.sendWelcomeMessage(jane);
  
  console.log('\n--- 发送欢迎消息给空用户 ---');
  notificationService.sendWelcomeMessage(anonymous);
  notificationService.sendWelcomeMessage(invalidEmail);
  
  console.log('\n--- 检查用户类型 ---');
  [john, jane, anonymous, invalidEmail].forEach(user => {
    console.log(`${user.getName()}: ${user.isNull() ? '空用户' : '真实用户'}`);
  });
}

// 运行客户端代码
clientCode();
```

### 13.4 应用场景

空对象模式适用于以下场景：

- 需要处理可能为null的对象引用，但不希望频繁地进行null检查
- 希望提供一个默认行为，当对象不存在时使用
- 在集合中需要表示"不存在"的概念
- 希望避免NullPointerException或类似的错误

### 13.5 优缺点

**优点：**
- 避免了null检查，简化了代码
- 提供了默认行为，增强了系统的健壮性
- 符合里氏替换原则，可以无缝地替换真实对象
- 消除了客户端代码中的条件判断

**缺点：**
- 可能会掩盖真正的错误情况
- 增加了系统中的类的数量
- 如果过度使用，可能导致逻辑不清晰

### 13.6 变体

空对象模式的变体：

- **单例空对象**：使用单例模式实现空对象
- **复合空对象**：组合多个空对象
- **装饰空对象**：在空对象上添加装饰器
- **参数化空对象**：通过参数配置空对象的行为

## 14. 行为型设计模式总结

### 14.1 主要模式对比

| 模式名称 | 主要目的 | 核心组件 | 适用场景 |
|---------|---------|---------|--------|
| 责任链模式 | 避免请求发送者与接收者的耦合 | Handler, ConcreteHandler | 有多个对象可以处理同一请求 |
| 命令模式 | 将请求封装为对象 | Command, Receiver, Invoker | 需要参数化对象、支持撤销/重做 |
| 解释器模式 | 定义语言的语法表示 | Expression, Context | 解释特定语言的语法 |
| 迭代器模式 | 提供遍历集合的方法 | Iterator, Aggregate | 访问集合元素而不暴露内部结构 |
| 中介者模式 | 减少对象间的直接通信 | Mediator, Colleague | 对象间交互复杂的场景 |
| 备忘录模式 | 捕获和恢复对象状态 | Memento, Originator, Caretaker | 需要支持撤销操作 |
| 观察者模式 | 发布-订阅通信机制 | Subject, Observer | 一个对象状态变化影响多个对象 |
| 状态模式 | 允许对象在内部状态改变时改变行为 | State, Context | 行为随状态变化而变化 |
| 策略模式 | 定义一系列可互换的算法 | Strategy, Context | 需要在运行时选择算法 |
| 模板方法模式 | 定义算法骨架 | AbstractClass, ConcreteClass | 算法结构固定但步骤可定制 |
| 访问者模式 | 分离数据结构与操作 | Visitor, Element | 对象结构稳定但操作多变 |
| 空对象模式 | 提供默认实现替代null | AbstractObject, NullObject | 需要避免null引用检查 |

### 14.2 设计模式选择指南

选择适合的行为型设计模式时，可以考虑以下因素：

- **通信方式**：需要对象间松耦合通信时，考虑观察者模式或中介者模式
- **算法变化**：算法需要在运行时切换时，考虑策略模式
- **结构与行为分离**：需要分离数据结构和操作时，考虑访问者模式
- **状态管理**：对象行为随状态变化时，考虑状态模式或备忘录模式
- **请求处理**：处理请求时需要解耦发送者和接收者，考虑责任链模式或命令模式
- **算法定制**：算法骨架固定但步骤可定制，考虑模板方法模式

### 14.3 最佳实践

使用行为型设计模式的最佳实践：

1. **适度使用**：不要为了使用模式而使用模式，只有在确实需要时才应用
2. **理解意图**：深入理解每种模式的意图和适用场景
3. **组合使用**：根据需求组合使用多种设计模式
4. **关注可维护性**：确保使用模式后代码仍然易于理解和维护
5. **代码质量**：无论是否使用模式，都要保持代码的高质量
6. **性能考虑**：某些模式（如观察者模式）可能在大规模应用时影响性能，需要注意优化
7. **命名规范**：为类和方法使用有意义的名称，遵循命名规范
8. **文档说明**：为设计决策和模式使用编写清晰的文档

### 14.4 未来趋势

随着软件开发的发展，行为型设计模式也在不断演进：

- **函数式编程影响**：函数式编程范式对传统设计模式产生了深刻影响，如命令模式可通过高阶函数简化
- **响应式编程**：观察者模式与响应式编程范式结合，产生了RxJS等强大的响应式库
- **异步编程**：异步编程模型催生了新的行为模式，如Promise链、async/await等
- **微服务架构**：在微服务架构中，行为型模式如观察者模式、中介者模式有了新的应用场景
- **AI辅助设计**：人工智能技术开始辅助设计模式的选择和实现

行为型设计模式是软件设计中非常重要的一部分，掌握这些模式可以帮助我们设计更加灵活、可维护的软件系统。通过合理运用这些模式，我们可以应对复杂多变的业务需求，提高代码质量和开发效率。