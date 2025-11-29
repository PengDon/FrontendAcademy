# Flutter 核心概念

本目录包含 Flutter 开发中的核心概念示例代码和详细说明。理解这些基础概念对于掌握 Flutter 开发至关重要。

## 1. Widget 系统

Flutter 采用声明式 UI 构建方式，所有的 UI 元素都是由 Widget 组成的。Widget 是 Flutter 应用的基本构建块。

### 1.1 Widget 的类型

Flutter 中的 Widget 主要分为两种类型：

#### StatelessWidget

无状态组件，一旦创建就不能再更改。适用于纯展示性的 UI，其显示内容完全由构造函数传入的参数决定。

```dart
import 'package:flutter/material.dart';

class MyStatelessWidget extends StatelessWidget {
  final String title;
  final int count;
  final VoidCallback onPressed;

  const MyStatelessWidget({
    Key? key,
    required this.title,
    this.count = 0,
    required this.onPressed,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(title, style: const TextStyle(fontSize: 24)),
        Text('Count: $count'),
        ElevatedButton(
          onPressed: onPressed,
          child: const Text('Press Me'),
        ),
      ],
    );
  }
}
```

#### StatefulWidget

有状态组件，可以动态改变内容。适用于需要响应用户交互或其他事件的 UI。StatefulWidget 由两部分组成：Widget 本身和其关联的 State 对象。

```dart
import 'package:flutter/material.dart';

class CounterApp extends StatefulWidget {
  const CounterApp({Key? key}) : super(key: key);

  @override
  State<CounterApp> createState() => _CounterAppState();
}

class _CounterAppState extends State<CounterApp> {
  int _count = 0;

  void _increment() {
    setState(() {
      _count++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text('Count: $_count', style: const TextStyle(fontSize: 24)),
        ElevatedButton(
          onPressed: _increment,
          child: const Text('Increment'),
        ),
      ],
    );
  }

  @override
  void initState() {
    super.initState();
    // 初始化逻辑，只执行一次
    print('Counter initialized');
  }

  @override
  void didUpdateWidget(covariant CounterApp oldWidget) {
    super.didUpdateWidget(oldWidget);
    // 当父组件重建导致本组件更新时调用
    print('Widget updated');
  }

  @override
  void dispose() {
    // 清理资源，组件销毁时调用
    print('Counter disposed');
    super.dispose();
  }
}
```

### 1.2 Widget 生命周期

#### StatelessWidget 生命周期

- **构造函数**：创建组件实例时调用
- **build**：构建 UI 时调用，可能会被多次调用

#### StatefulWidget 生命周期

1. **createState**：创建 State 对象
2. **initState**：State 初始化，只调用一次
3. **didChangeDependencies**：依赖关系变化时调用
4. **build**：构建 UI，可能会被多次调用
5. **didUpdateWidget**：组件配置更新时调用
6. **setState**：更新状态，触发重新构建
7. **deactivate**：组件从树中移除，但可能会被重新插入
8. **dispose**：组件永久移除，清理资源

### 1.3 不可变性

Flutter 中的 Widget 是不可变的，一旦创建就不能更改其属性。这设计有以下优点：

- 提高性能：不可变对象更容易优化
- 简化状态管理：状态变化通过创建新的 Widget 实例来实现
- 有利于热重载：可以快速替换 Widget 树中的节点

## 2. BuildContext

BuildContext 是 Flutter 中一个非常重要的概念，它代表 Widget 在 Widget 树中的位置。

### 2.1 BuildContext 的作用

- **访问主题数据**：通过 `Theme.of(context)` 获取主题
- **导航操作**：通过 `Navigator.of(context)` 进行页面导航
- **获取父级 Widget**：通过 `findAncestorWidgetOfExactType()` 等方法查找祖先 Widget
- **本地化支持**：通过 `Localizations.of(context)` 获取本地化资源

### 2.2 BuildContext 的使用示例

```dart
import 'package:flutter/material.dart';

class ContextExample extends StatelessWidget {
  const ContextExample({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // 获取主题数据
    final theme = Theme.of(context);
    
    // 获取媒体查询数据（屏幕尺寸等）
    final mediaQuery = MediaQuery.of(context);
    final screenWidth = mediaQuery.size.width;
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Context Example'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Screen Width: $screenWidth',
              style: theme.textTheme.headline6,
            ),
            ElevatedButton(
              onPressed: () {
                // 使用 context 进行导航
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Hello from Context!')),
                );
              },
              child: const Text('Show Message'),
            ),
          ],
        ),
      ),
    );
  }
}
```

## 3. 状态管理基础

状态管理是 Flutter 开发中的核心挑战之一。Flutter 提供了多种状态管理方案，从简单的 `setState` 到复杂的状态管理库。

### 3.1 本地状态管理

使用 `setState` 管理组件内部状态，适用于简单的状态变化。

```dart
import 'package:flutter/material.dart';

class LocalStateExample extends StatefulWidget {
  const LocalStateExample({Key? key}) : super(key: key);

  @override
  State<LocalStateExample> createState() => _LocalStateExampleState();
}

class _LocalStateExampleState extends State<LocalStateExample> {
  String _name = '';
  bool _isSubscribed = false;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        children: [
          TextField(
            decoration: const InputDecoration(labelText: 'Enter your name'),
            onChanged: (value) {
              setState(() {
                _name = value;
              });
            },
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              const Text('Subscribe to newsletter'),
              Switch(
                value: _isSubscribed,
                onChanged: (value) {
                  setState(() {
                    _isSubscribed = value;
                  });
                },
              ),
            ],
          ),
          const SizedBox(height: 24),
          Text(
            _name.isNotEmpty ? 'Hello, $_name!' : 'Please enter your name',
            style: const TextStyle(fontSize: 18),
          ),
          Text(
            _isSubscribed ? 'You are subscribed!' : 'Not subscribed',
            style: const TextStyle(fontSize: 16),
          ),
        ],
      ),
    );
  }
}
```

## 4. 布局系统

Flutter 提供了强大的布局系统，通过组合不同的布局 Widget，可以创建复杂的界面。

### 4.1 核心布局 Widget

#### 容器类布局

- **Container**：带样式的矩形容器
- **Padding**：添加内边距
- **Margin**：添加外边距（通过 Container 的 margin 属性）
- **Center**：居中对齐子组件

#### 行和列

- **Row**：水平排列子组件
- **Column**：垂直排列子组件

#### 弹性布局

- **Expanded**：扩展子组件以填充可用空间
- **Flexible**：灵活分配空间

#### 叠层布局

- **Stack**：堆叠子组件
- **Positioned**：在 Stack 中精确定位子组件

### 4.2 布局示例

```dart
import 'package:flutter/material.dart';

class LayoutExample extends StatelessWidget {
  const LayoutExample({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Layout Example'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // 行布局示例
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Item 1'),
                const Text('Item 2'),
                const Text('Item 3'),
              ],
            ),
            const SizedBox(height: 16),
            
            // 弹性布局示例
            Row(
              children: [
                Expanded(
                  flex: 2,
                  child: Container(
                    color: Colors.red,
                    height: 50,
                    alignment: Alignment.center,
                    child: const Text('Flex 2'),
                  ),
                ),
                Expanded(
                  flex: 3,
                  child: Container(
                    color: Colors.blue,
                    height: 50,
                    alignment: Alignment.center,
                    child: const Text('Flex 3'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            
            // 叠层布局示例
            Stack(
              alignment: Alignment.center,
              children: [
                Container(
                  width: 200,
                  height: 200,
                  color: Colors.yellow,
                ),
                Positioned(
                  top: 20,
                  right: 20,
                  child: Container(
                    width: 100,
                    height: 100,
                    color: Colors.green,
                  ),
                ),
                const Text('Stack Example', style: TextStyle(fontSize: 24)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
```

## 5. InheritedWidget

InheritedWidget 是 Flutter 中一种特殊的 Widget，用于在 Widget 树中有效地向下传递数据。

### 5.1 InheritedWidget 的基本用法

```dart
import 'package:flutter/material.dart';

// 创建一个 InheritedWidget
class ThemeProvider extends InheritedWidget {
  final Color primaryColor;
  final Color secondaryColor;
  final bool isDarkMode;

  const ThemeProvider({
    Key? key,
    required Widget child,
    required this.primaryColor,
    required this.secondaryColor,
    required this.isDarkMode,
  }) : super(key: key, child: child);

  // 提供一个静态方法来获取最近的 ThemeProvider
  static ThemeProvider of(BuildContext context) {
    final ThemeProvider? result = context.dependOnInheritedWidgetOfExactType<ThemeProvider>();
    assert(result != null, 'No ThemeProvider found in context');
    return result!;
  }

  @override
  bool updateShouldNotify(ThemeProvider oldWidget) {
    return primaryColor != oldWidget.primaryColor ||
           secondaryColor != oldWidget.secondaryColor ||
           isDarkMode != oldWidget.isDarkMode;
  }
}

// 使用示例
class ThemeConsumer extends StatelessWidget {
  const ThemeConsumer({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // 获取主题数据
    final themeData = ThemeProvider.of(context);

    return Container(
      color: themeData.isDarkMode ? Colors.black : Colors.white,
      child: Text(
        'Themed Text',
        style: TextStyle(
          color: themeData.primaryColor,
          fontSize: 24,
        ),
      ),
    );
  }
}
```

## 6. Key

Key 是 Flutter 中用于标识 Widget 的对象，对于状态管理和性能优化非常重要。

### 6.1 Key 的类型

- **ValueKey**：使用值作为键
- **ObjectKey**：使用对象引用作为键
- **UniqueKey**：每次构建时生成唯一的键
- **GlobalKey**：在整个应用中唯一的键，可以用来访问 Widget 的状态

### 6.2 Key 的使用场景

- **列表项重排序**：使用 Key 确保正确的状态关联
- **访问子组件状态**：使用 GlobalKey 获取子组件的状态
- **优化重建**：通过 Key 帮助 Flutter 识别 Widget 是否需要重建

### 6.3 Key 使用示例

```dart
import 'package:flutter/material.dart';

class KeyExample extends StatefulWidget {
  const KeyExample({Key? key}) : super(key: key);

  @override
  State<KeyExample> createState() => _KeyExampleState();
}

class _KeyExampleState extends State<KeyExample> {
  List<Widget> _items = [
    const ColoredBoxItem(color: Colors.red, key: ValueKey('red')),
    const ColoredBoxItem(color: Colors.blue, key: ValueKey('blue')),
  ];

  void _swapItems() {
    setState(() {
      _items = [_items[1], _items[0]];
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Key Example')),
      body: Column(
        children: [
          Row(children: _items),
          ElevatedButton(
            onPressed: _swapItems,
            child: const Text('Swap Items'),
          ),
        ],
      ),
    );
  }
}

class ColoredBoxItem extends StatefulWidget {
  final Color color;

  const ColoredBoxItem({Key? key, required this.color}) : super(key: key);

  @override
  State<ColoredBoxItem> createState() => _ColoredBoxItemState();
}

class _ColoredBoxItemState extends State<ColoredBoxItem> {
  int _count = 0;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GestureDetector(
        onTap: () {
          setState(() {
            _count++;
          });
        },
        child: Container(
          height: 100,
          color: widget.color,
          alignment: Alignment.center,
          child: Text(
            '$_count',
            style: const TextStyle(fontSize: 24, color: Colors.white),
          ),
        ),
      ),
    );
  }
}
```

## 7. 响应式编程模型

Flutter 采用响应式编程模型，UI 随状态变化而自动更新。

### 7.1 响应式编程的核心思想

- **声明式 UI**：描述 UI 应该是什么样子，而不是如何更新它
- **状态驱动**：UI 完全由状态决定
- **自动更新**：状态变化时，相关 UI 自动重建

### 7.2 Stream 和 Future

Flutter 中广泛使用 Stream 和 Future 进行异步编程：

```dart
import 'package:flutter/material.dart';
import 'dart:async';

class StreamExample extends StatefulWidget {
  const StreamExample({Key? key}) : super(key: key);

  @override
  State<StreamExample> createState() => _StreamExampleState();
}

class _StreamExampleState extends State<StreamExample> {
  late StreamController<int> _streamController;
  late Stream<int> _stream;
  int _count = 0;

  @override
  void initState() {
    super.initState();
    // 创建 StreamController
    _streamController = StreamController<int>();
    // 获取 Stream
    _stream = _streamController.stream;
    
    // 定期发送数据
    Timer.periodic(const Duration(seconds: 1), (timer) {
      _streamController.sink.add(_count++);
    });
  }

  @override
  void dispose() {
    // 关闭 StreamController
    _streamController.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Stream Example')),
      body: Center(
        child: StreamBuilder<int>(
          stream: _stream,
          initialData: 0,
          builder: (context, snapshot) {
            if (snapshot.hasError) {
              return Text('Error: ${snapshot.error}');
            }
            return Text(
              'Count: ${snapshot.data}',
              style: const TextStyle(fontSize: 24),
            );
          },
        ),
      ),
    );
  }
}
```

## 总结

以上是 Flutter 开发中最核心的几个概念。理解这些概念对于构建 Flutter 应用至关重要。在实际开发中，这些概念会相互配合，共同构建出复杂而强大的应用界面和功能。

通过本目录中的示例代码，你可以更深入地理解这些概念的实际应用。建议先熟悉 Widget 系统和布局系统，然后再逐步学习状态管理和异步编程等更高级的概念。