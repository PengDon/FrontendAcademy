# 命令模式 (Command Pattern)

## 什么是命令模式

命令模式是一种行为设计模式，它将请求封装为一个对象，从而使用户能够用不同的请求参数化对象、将请求排队、记录请求日志，以及支持可撤销操作。

## 命令模式的核心组件

1. **Command（命令接口）**：声明执行操作的接口
2. **ConcreteCommand（具体命令）**：实现Command接口，定义接收者和动作之间的绑定关系
3. **Receiver（接收者）**：知道如何执行与请求相关的操作
4. **Invoker（调用者）**：要求命令执行请求
5. **Client（客户端）**：创建具体命令对象并设置其接收者

## 命令模式的UML图

```
Client → Command → ConcreteCommand → Receiver
       ↓
    Invoker
```

## 命令模式的实现示例

### 基本实现

```javascript
// Command接口
class Command {
  execute() {}
  undo() {}
}

// ConcreteCommand
class LightOnCommand extends Command {
  constructor(light) {
    super();
    this.light = light;
  }

  execute() {
    this.light.on();
  }

  undo() {
    this.light.off();
  }
}

class LightOffCommand extends Command {
  constructor(light) {
    super();
    this.light = light;
  }

  execute() {
    this.light.off();
  }

  undo() {
    this.light.on();
  }
}

// Receiver
class Light {
  constructor(room) {
    this.room = room;
  }

  on() {
    console.log(`${this.room} 的灯亮了`);
  }

  off() {
    console.log(`${this.room} 的灯关了`);
  }
}

// Invoker
class RemoteControl {
  constructor() {
    this.command = null;
    this.history = [];
  }

  setCommand(command) {
    this.command = command;
  }

  pressButton() {
    if (this.command) {
      this.command.execute();
      this.history.push(this.command);
    }
  }

  pressUndo() {
    if (this.history.length > 0) {
      const command = this.history.pop();
      command.undo();
    }
  }
}

// Client
const livingRoomLight = new Light('客厅');
const lightOnCommand = new LightOnCommand(livingRoomLight);
const lightOffCommand = new LightOffCommand(livingRoomLight);

const remote = new RemoteControl();
remote.setCommand(lightOnCommand);
remote.pressButton(); // 输出: 客厅 的灯亮了

remote.setCommand(lightOffCommand);
remote.pressButton(); // 输出: 客厅 的灯关了

remote.pressUndo(); // 输出: 客厅 的灯亮了
```

### 宏命令

命令模式可以组合多个命令，形成宏命令：

```javascript
class MacroCommand extends Command {
  constructor(commands) {
    super();
    this.commands = commands;
  }

  execute() {
    for (const command of this.commands) {
      command.execute();
    }
  }

  undo() {
    // 倒序撤销
    for (let i = this.commands.length - 1; i >= 0; i--) {
      this.commands[i].undo();
    }
  }
}

// 使用宏命令
const macro = new MacroCommand([lightOnCommand, lightOffCommand]);
const macroRemote = new RemoteControl();
macroRemote.setCommand(macro);
macroRemote.pressButton(); // 执行所有命令
```

### 带参数的命令

```javascript
class VolumeCommand extends Command {
  constructor(stereo, volume) {
    super();
    this.stereo = stereo;
    this.volume = volume;
    this.prevVolume = 0;
  }

  execute() {
    this.prevVolume = this.stereo.getVolume();
    this.stereo.setVolume(this.volume);
  }

  undo() {
    this.stereo.setVolume(this.prevVolume);
  }
}

class Stereo {
  constructor() {
    this.volume = 0;
  }

  getVolume() {
    return this.volume;
  }

  setVolume(volume) {
    this.volume = volume;
    console.log(`音响音量设置为 ${this.volume}`);
  }
}
```

## 命令模式的应用场景

1. **事务操作**：支持撤销和重做功能
2. **队列请求**：将请求存储在队列中，按顺序执行
3. **日志记录**：记录请求日志，支持故障恢复
4. **GUI按钮和菜单**：将用户交互转换为命令对象
5. **线程池和任务调度**：将任务封装为命令对象进行调度

## 命令模式的优点

1. **解耦发送者和接收者**：发送者不需要知道接收者的具体实现
2. **支持撤销和重做**：可以轻松实现操作的撤销和重做
3. **支持复合命令**：可以组合多个命令形成复杂的操作
4. **支持队列和日志**：便于实现请求的排队、记录和回放
5. **扩展性好**：可以轻松添加新的命令，不需要修改现有代码

## 命令模式的缺点

1. **增加了系统的复杂性**：引入了额外的命令对象
2. **可能导致过多的具体命令类**：每个操作都需要创建一个新的具体命令类

## 命令模式与其他模式的结合

### 命令模式与备忘录模式

结合使用可以实现更复杂的撤销/重做功能，备忘录模式保存对象状态，命令模式封装操作。

### 命令模式与观察者模式

命令执行后可以通知观察者，实现系统各部分的协调工作。

### 命令模式与组合模式

可以创建复合命令，将多个命令组合成一个更大的命令。

## 实际应用案例

### 文本编辑器的撤销/重做功能

```javascript
class TextEditor {
  constructor() {
    this.text = '';
  }

  insert(text) {
    this.text += text;
    console.log(`文本已更新: ${this.text}`);
  }

  delete(count) {
    const oldText = this.text;
    this.text = this.text.slice(0, -count);
    console.log(`删除了 ${count} 个字符: ${this.text}`);
    return oldText;
  }

  setText(text) {
    this.text = text;
    console.log(`文本已设置: ${this.text}`);
  }

  getText() {
    return this.text;
  }
}

class InsertCommand extends Command {
  constructor(editor, text) {
    super();
    this.editor = editor;
    this.text = text;
  }

  execute() {
    this.editor.insert(this.text);
  }

  undo() {
    this.editor.delete(this.text.length);
  }
}

class DeleteCommand extends Command {
  constructor(editor, count) {
    super();
    this.editor = editor;
    this.count = count;
    this.prevText = '';
  }

  execute() {
    this.prevText = this.editor.getText();
    this.editor.delete(this.count);
  }

  undo() {
    this.editor.setText(this.prevText);
  }
}
```

### 多线程任务调度

```javascript
class ThreadPool {
  constructor(size) {
    this.queue = [];
    this.workers = size;
    this.activeWorkers = 0;
    this.processQueue();
  }

  addTask(command) {
    this.queue.push(command);
    this.processQueue();
  }

  processQueue() {
    while (this.activeWorkers < this.workers && this.queue.length > 0) {
      const command = this.queue.shift();
      this.activeWorkers++;
      
      setTimeout(() => {
        command.execute();
        this.activeWorkers--;
        this.processQueue();
      }, 0);
    }
  }
}
```

## 命令模式的现代JavaScript实现

使用函数式编程思想简化命令模式：

```javascript
// 函数式命令模式
function createCommand(execute, undo) {
  return {
    execute,
    undo
  };
}

// 创建命令
const lightOnCommand = createCommand(
  () => livingRoomLight.on(),
  () => livingRoomLight.off()
);

const lightOffCommand = createCommand(
  () => livingRoomLight.off(),
  () => livingRoomLight.on()
);

// 使用命令
lightOnCommand.execute();
lightOnCommand.undo();
```

## 常见问题与解答

### Q: 命令模式与策略模式有什么区别？
A: 命令模式封装请求，支持撤销/重做和队列执行；策略模式封装算法，允许客户端在运行时选择算法。

### Q: 如何实现多次撤销操作？
A: 使用历史记录栈保存执行过的命令，每次撤销时从栈中弹出并执行undo操作。

### Q: 命令模式在前端框架中有哪些应用？
A: 在React/Vue中，状态管理库（如Redux/Vuex）的action概念类似于命令模式，将状态变更封装为可追踪的操作。

### Q: 命令模式如何支持日志记录？
A: 可以在命令的execute方法中添加日志记录代码，或者在调用者中拦截命令执行，记录命令的类型、参数等信息。

### Q: 命令模式与事件驱动编程有什么关系？
A: 命令模式可以看作是事件驱动编程的一种具体实现，命令对象封装了事件的处理逻辑。