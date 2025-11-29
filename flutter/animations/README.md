# Flutter 动画

本目录包含 Flutter 中动画相关的示例代码和详细说明。Flutter 提供了丰富的动画 API，可以创建流畅、美观的用户界面交互效果。

## 1. 动画概述

Flutter 动画系统分为两大类：

1. **补间动画（Tween Animation）**：在给定的开始值和结束值之间进行插值计算
2. **物理动画（Physics-based Animation）**：基于物理定律（如重力、弹性）的动画效果

Flutter 提供了多种动画实现方式，从简单到复杂：
- **AnimatedContainer**：最简单的隐式动画
- **AnimatedWidget**：基础动画组件
- **AnimatedBuilder**：性能优化的动画构建器
- **TweenAnimationBuilder**：简化的补间动画构建器
- **CustomPainter + Animation**：自定义绘制动画
- **Hero Animation**：页面跳转时的共享元素动画
- **Staggered Animation**：交错动画效果

## 2. 基本动画组件

### 2.1 AnimatedContainer

`AnimatedContainer` 是实现简单动画最直接的方式，只需改变其属性值，它会自动在指定的时间内平滑过渡。

```dart
import 'package:flutter/material.dart';

class AnimatedContainerExample extends StatefulWidget {
  const AnimatedContainerExample({Key? key}) : super(key: key);

  @override
  State<AnimatedContainerExample> createState() => _AnimatedContainerExampleState();
}

class _AnimatedContainerExampleState extends State<AnimatedContainerExample> {
  // 控制动画的状态变量
  double _width = 100;
  double _height = 100;
  Color _color = Colors.blue;
  BorderRadiusGeometry _borderRadius = BorderRadius.circular(8);

  // 触发动画
  void _animate() {
    setState(() {
      final random = Random();
      
      // 随机改变属性值
      _width = random.nextDouble() * 300;
      _height = random.nextDouble() * 300;
      _color = Color.fromRGBO(
        random.nextInt(256),
        random.nextInt(256),
        random.nextInt(256),
        1,
      );
      _borderRadius = BorderRadius.circular(random.nextDouble() * 50);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('AnimatedContainer Example'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // 动画容器
            AnimatedContainer(
              // 动画持续时间
              duration: const Duration(seconds: 1),
              // 曲线类型
              curve: Curves.fastOutSlowIn,
              // 可动画的属性
              width: _width,
              height: _height,
              decoration: BoxDecoration(
                color: _color,
                borderRadius: _borderRadius,
              ),
            ),
            const SizedBox(height: 50),
            ElevatedButton(
              onPressed: _animate,
              child: const Text('Animate!'),
            ),
          ],
        ),
      ),
    );
  }
}
```

### 2.2 AnimatedOpacity

`AnimatedOpacity` 用于实现淡入淡出效果。

```dart
import 'package:flutter/material.dart';

class AnimatedOpacityExample extends StatefulWidget {
  const AnimatedOpacityExample({Key? key}) : super(key: key);

  @override
  State<AnimatedOpacityExample> createState() => _AnimatedOpacityExampleState();
}

class _AnimatedOpacityExampleState extends State<AnimatedOpacityExample> {
  // 初始透明度
  double _opacity = 1.0;

  void _toggleOpacity() {
    setState(() {
      // 切换透明度
      _opacity = _opacity == 1.0 ? 0.0 : 1.0;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('AnimatedOpacity Example'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // 动画透明度
            AnimatedOpacity(
              // 动画持续时间
              duration: const Duration(seconds: 1),
              // 目标透明度
              opacity: _opacity,
              // 曲线类型
              curve: Curves.easeInOut,
              // 要显示的子部件
              child: Container(
                width: 200,
                height: 200,
                color: Colors.blue,
                child: const Center(
                  child: Text(
                    'Animated Text',
                    style: TextStyle(color: Colors.white, fontSize: 24),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 50),
            ElevatedButton(
              onPressed: _toggleOpacity,
              child: const Text('Toggle Visibility'),
            ),
          ],
        ),
      ),
    );
  }
}
```

### 2.3 TweenAnimationBuilder

`TweenAnimationBuilder` 是一个通用的动画构建器，用于在两个值之间创建补间动画。

```dart
import 'package:flutter/material.dart';

class TweenAnimationBuilderExample extends StatelessWidget {
  const TweenAnimationBuilderExample({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('TweenAnimationBuilder Example'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // 大小动画
            TweenAnimationBuilder<double>(
              // 开始值和结束值
              tween: Tween<double>(begin: 50, end: 200),
              // 动画持续时间
              duration: const Duration(seconds: 2),
              // 动画曲线
              curve: Curves.bounceOut,
              // 构建器
              builder: (context, value, child) {
                return Container(
                  width: value,
                  height: value,
                  color: Colors.red,
                  child: child,
                );
              },
              // 子部件（性能优化，不会重建）
              child: const Center(
                child: Text(
                  'Growing',
                  style: TextStyle(color: Colors.white),
                ),
              ),
            ),
            const SizedBox(height: 50),
            // 旋转动画
            TweenAnimationBuilder<double>(
              tween: Tween<double>(begin: 0, end: 2 * 3.14159),
              duration: const Duration(seconds: 3),
              curve: Curves.linear,
              builder: (context, value, child) {
                return Transform.rotate(
                  angle: value,
                  child: child,
                );
              },
              child: Container(
                width: 100,
                height: 100,
                color: Colors.green,
                child: const Center(
                  child: Text('Spinning'),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
```

## 3. 显式动画

### 3.1 AnimationController 和 AnimatedWidget

显式动画提供了更多控制，需要手动管理动画的状态。

```dart
import 'package:flutter/material.dart';

// 自定义的动画部件
class AnimatedLogo extends AnimatedWidget {
  const AnimatedLogo({Key? key, required Animation<double> animation}) 
      : super(key: key, listenable: animation);

  @override
  Widget build(BuildContext context) {
    // 从 listenable 获取动画
    final animation = listenable as Animation<double>;
    
    return Center(
      child: Transform.scale(
        scale: animation.value,
        child: const FlutterLogo(size: 100),
      ),
    );
  }
}

class AnimationControllerExample extends StatefulWidget {
  const AnimationControllerExample({Key? key}) : super(key: key);

  @override
  State<AnimationControllerExample> createState() => _AnimationControllerExampleState();
}

class _AnimationControllerExampleState extends State<AnimationControllerExample>
    with SingleTickerProviderStateMixin {
  // 动画控制器
  late AnimationController _controller;
  // 动画
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    
    // 创建动画控制器
    _controller = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    );
    
    // 创建动画，使用 Tween 定义范围
    _animation = Tween<double>(begin: 0, end: 2).animate(_controller)
      // 添加状态监听器
      ..addStatusListener((status) {
        // 当动画完成时反向播放
        if (status == AnimationStatus.completed) {
          _controller.reverse();
        } else if (status == AnimationStatus.dismissed) {
          _controller.forward();
        }
      });
    
    // 开始动画
    _controller.forward();
  }

  @override
  void dispose() {
    // 释放动画控制器
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('AnimationController Example'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // 使用自定义动画部件
            AnimatedLogo(animation: _animation),
            const SizedBox(height: 50),
            ElevatedButton(
              onPressed: () {
                if (_controller.isAnimating) {
                  _controller.stop();
                } else {
                  _controller.forward();
                }
              },
              child: Text(_controller.isAnimating ? 'Stop' : 'Start'),
            ),
          ],
        ),
      ),
    );
  }
}
```

### 3.2 AnimatedBuilder

`AnimatedBuilder` 是一种更灵活的方式，可以避免重复构建子部件。

```dart
import 'package:flutter/material.dart';

class AnimatedBuilderExample extends StatefulWidget {
  const AnimatedBuilderExample({Key? key}) : super(key: key);

  @override
  State<AnimatedBuilderExample> createState() => _AnimatedBuilderExampleState();
}

class _AnimatedBuilderExampleState extends State<AnimatedBuilderExample>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _rotateAnimation;

  @override
  void initState() {
    super.initState();
    
    _controller = AnimationController(
      duration: const Duration(seconds: 3),
      vsync: this,
    );
    
    // 创建缩放动画
    _scaleAnimation = Tween<double>(begin: 0.5, end: 1.5).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Curves.easeInOut,
      ),
    );
    
    // 创建旋转动画
    _rotateAnimation = Tween<double>(begin: 0, end: 2 * 3.14159).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Curves.linear,
      ),
    );
    
    // 循环动画
    _controller.repeat(reverse: true);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('AnimatedBuilder Example'),
      ),
      body: Center(
        // 使用 AnimatedBuilder
        child: AnimatedBuilder(
          // 动画列表
          animation: Listenable.merge([_scaleAnimation, _rotateAnimation]),
          // 构建器
          builder: (context, child) {
            return Transform.scale(
              scale: _scaleAnimation.value,
              child: Transform.rotate(
                angle: _rotateAnimation.value,
                child: child, // 这个子部件不会在每次动画更新时重建
              ),
            );
          },
          // 不会重建的子部件
          child: Container(
            width: 100,
            height: 100,
            color: Colors.purple,
            child: const Center(
              child: Text(
                'Complex Animation',
                style: TextStyle(color: Colors.white),
                textAlign: TextAlign.center,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
```

## 4. 物理动画

物理动画模拟现实世界的物理行为，如弹簧、重力等。

### 4.1 弹簧动画 (Spring Simulation)

```dart
import 'package:flutter/material.dart';
import 'package:flutter/physics.dart';

class SpringAnimationExample extends StatefulWidget {
  const SpringAnimationExample({Key? key}) : super(key: key);

  @override
  State<SpringAnimationExample> createState() => _SpringAnimationExampleState();
}

class _SpringAnimationExampleState extends State<SpringAnimationExample>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<Offset> _animation;

  @override
  void initState() {
    super.initState();
    
    _controller = AnimationController(
      vsync: this,
    );
    
    // 创建弹簧动画
    _runAnimation();
  }

  void _runAnimation() {
    // 物理模拟 - 弹簧效果
    final simulation = SpringSimulation(
      SpringDescription(
        mass: 1,
        stiffness: 100,
        damping: 15, // 阻尼，控制弹性
      ),
      0, // 开始位置
      1, // 结束位置
      0, // 初始速度
    );
    
    _animation = Tween<Offset>(
      begin: const Offset(-1, 0), // 从左侧进入
      end: const Offset(0, 0),    // 到中间位置
    ).animate(_controller);
    
    // 将控制器驱动到结束状态，使用弹簧物理模拟
    _controller.animateWith(simulation);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Spring Animation Example'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SlideTransition(
              position: _animation,
              child: Container(
                width: 150,
                height: 150,
                color: Colors.orange,
                child: const Center(
                  child: Text(
                    'Spring',
                    style: TextStyle(color: Colors.white, fontSize: 24),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 50),
            ElevatedButton(
              onPressed: () {
                // 重置并重新运行动画
                _controller.reset();
                _runAnimation();
              },
              child: const Text('Run Again'),
            ),
          ],
        ),
      ),
    );
  }
}
```

### 4.2 拖动动画 (Draggable with Physics)

```dart
import 'package:flutter/material.dart';
import 'package:flutter/physics.dart';

class DraggablePhysicsExample extends StatefulWidget {
  const DraggablePhysicsExample({Key? key}) : super(key: key);

  @override
  State<DraggablePhysicsExample> createState() => _DraggablePhysicsExampleState();
}

class _DraggablePhysicsExampleState extends State<DraggablePhysicsExample>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<Offset> _animation;
  
  // 当前位置
  Offset _position = Offset.zero;
  // 是否正在拖动
  bool _isDragging = false;
  // 动画容器的大小
  final double _size = 100;

  @override
  void initState() {
    super.initState();
    
    _controller = AnimationController(
      vsync: this,
    );
    
    _animation = _controller.drive(
      Tween<Offset>(
        begin: Offset.zero,
        end: Offset.zero,
      ),
    );
    
    // 监听动画更新位置
    _animation.addListener(() {
      setState(() {
        _position = _animation.value;
      });
    });
  }

  // 处理拖动开始
  void _onDragStart(DragStartDetails details) {
    _isDragging = true;
    _controller.stop();
    setState(() {
      _position += details.localPosition;
    });
  }

  // 处理拖动更新
  void _onDragUpdate(DragUpdateDetails details) {
    setState(() {
      _position += details.delta;
    });
  }

  // 处理拖动结束，应用物理动画
  void _onDragEnd(DragEndDetails details) {
    _isDragging = false;
    
    // 获取屏幕尺寸
    final screenSize = MediaQuery.of(context).size;
    
    // 计算边界约束
    final double leftBound = -_size / 2;
    final double rightBound = screenSize.width - _size / 2;
    final double topBound = -_size / 2;
    final double bottomBound = screenSize.height - _size / 2;
    
    // 创建物理模拟，使用边界
    final simulation = ClampedSimulation(
      SpringSimulation(
        SpringDescription(
          mass: 1,
          stiffness: 100,
          damping: 15,
        ),
        _position.dx,
        (rightBound + leftBound) / 2, // 屏幕中央 x
        details.velocity.pixelsPerSecond.dx,
      ),
      leftBound,
      rightBound,
    );
    
    // 创建 y 轴的物理模拟
    final simulationY = ClampedSimulation(
      SpringSimulation(
        SpringDescription(
          mass: 1,
          stiffness: 100,
          damping: 15,
        ),
        _position.dy,
        (bottomBound + topBound) / 2, // 屏幕中央 y
        details.velocity.pixelsPerSecond.dy,
      ),
      topBound,
      bottomBound,
    );
    
    // 运行 x 动画
    _controller.animateWith(simulation).whenCompleteOrCancel(() {
      // x 动画完成后运行 y 动画
      _controller.animateWith(simulationY);
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Draggable Physics Example'),
      ),
      body: Stack(
        children: [
          // 拖动的容器
          Positioned(
            left: _position.dx,
            top: _position.dy,
            child: GestureDetector(
              onPanStart: _onDragStart,
              onPanUpdate: _onDragUpdate,
              onPanEnd: _onDragEnd,
              child: Container(
                width: _size,
                height: _size,
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.pink,
                ),
                child: const Center(
                  child: Text(
                    'Drag me!',
                    style: TextStyle(color: Colors.white),
                    textAlign: TextAlign.center,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
```

## 5. 高级动画技术

### 5.1 Hero 动画

Hero 动画用于页面之间共享元素的过渡效果。

```dart
// 第一页 - 起始页面
import 'package:flutter/material.dart';
import 'hero_detail_screen.dart'; // 导入第二页

class HeroAnimationExample extends StatelessWidget {
  const HeroAnimationExample({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Hero Animation Example'),
      ),
      body: Center(
        child: GestureDetector(
          onTap: () {
            // 导航到详情页
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => const HeroDetailScreen(),
              ),
            );
          },
          child: Hero(
            // 必须在两个页面中使用相同的标签
            tag: 'hero-image',
            // 可选的飞行路径
            flightShuttleBuilder: (flightContext, animation, flightDirection, fromHeroContext, toHeroContext) {
              return ScaleTransition(
                scale: animation.drive(
                  Tween<double>(begin: 0.5, end: 1.0).chain(
                    CurveTween(curve: flightDirection == HeroFlightDirection.push ? Curves.easeOut : Curves.easeIn),
                  ),
                ),
                child: toHeroContext.widget,
              );
            },
            // 起始状态的图像
            child: Image.asset(
              'assets/flutter_logo.png',
              width: 100,
              height: 100,
            ),
          ),
        ),
      ),
    );
  }
}
```

```dart
// 第二页 - 详情页面
import 'package:flutter/material.dart';

class HeroDetailScreen extends StatelessWidget {
  const HeroDetailScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Detail Screen'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // 相同标签的 Hero 组件
            Hero(
              tag: 'hero-image',
              // 详情页中的大图
              child: Image.asset(
                'assets/flutter_logo.png',
                width: 300,
                height: 300,
              ),
            ),
            const SizedBox(height: 20),
            const Text(
              'Flutter Logo',
              style: TextStyle(fontSize: 24),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
              },
              child: const Text('Go Back'),
            ),
          ],
        ),
      ),
    );
  }
}
```

### 5.2 交错动画 (Staggered Animation)

交错动画是指一系列按照顺序执行的动画，可以创建复杂的动画序列。

```dart
import 'package:flutter/material.dart';

class StaggeredAnimationExample extends StatefulWidget {
  const StaggeredAnimationExample({Key? key}) : super(key: key);

  @override
  State<StaggeredAnimationExample> createState() => _StaggeredAnimationExampleState();
}

class _StaggeredAnimationExampleState extends State<StaggeredAnimationExample>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _fadeInAnimation;
  late Animation<double> _scaleAnimation;
  late Animation<Offset> _slideAnimation;
  late Animation<double> _rotateAnimation;

  @override
  void initState() {
    super.initState();
    
    _controller = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    );
    
    // 创建延迟的动画序列
    _fadeInAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.0, 0.5, curve: Curves.easeIn),
      ),
    );
    
    _scaleAnimation = Tween<double>(begin: 0.5, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.3, 0.7, curve: Curves.easeOut),
      ),
    );
    
    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, 50),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.2, 0.6, curve: Curves.decelerate),
      ),
    );
    
    _rotateAnimation = Tween<double>(begin: -0.5, end: 0.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.4, 0.8, curve: Curves.easeInOut),
      ),
    );
    
    // 开始动画
    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Staggered Animation Example'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            AnimatedBuilder(
              animation: _controller,
              builder: (context, child) {
                return FadeTransition(
                  opacity: _fadeInAnimation,
                  child: ScaleTransition(
                    scale: _scaleAnimation,
                    child: SlideTransition(
                      position: _slideAnimation,
                      child: Transform.rotate(
                        angle: _rotateAnimation.value,
                        child: child,
                      ),
                    ),
                  ),
                );
              },
              child: Container(
                width: 200,
                height: 200,
                color: Colors.teal,
                child: const Center(
                  child: Text(
                    'Staggered Animation',
                    style: TextStyle(color: Colors.white, fontSize: 20),
                    textAlign: TextAlign.center,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 50),
            ElevatedButton(
              onPressed: () {
                _controller.reset();
                _controller.forward();
              },
              child: const Text('Run Again'),
            ),
          ],
        ),
      ),
    );
  }
}
```

### 5.3 自定义绘制动画

使用 `CustomPaint` 和 `Animation` 创建复杂的自定义动画。

```dart
import 'package:flutter/material.dart';

// 自定义画笔
class AnimatedCirclePainter extends CustomPainter {
  final Animation<double> animation;

  AnimatedCirclePainter({required this.animation}) : super(repaint: animation);

  @override
  void paint(Canvas canvas, Size size) {
    // 计算圆的参数
    final center = Offset(size.width / 2, size.height / 2);
    final radius = (size.shortestSide / 2) * animation.value;
    
    // 创建画笔
    final paint = Paint()
      ..color = Colors.blue
      ..style = PaintingStyle.stroke
      ..strokeWidth = 4.0;
    
    // 绘制圆
    canvas.drawCircle(center, radius, paint);
    
    // 绘制旋转的指示器
    final angle = animation.value * 2 * 3.14159;
    final indicatorLength = radius * 0.8;
    final indicatorStart = center;
    final indicatorEnd = Offset(
      center.dx + indicatorLength * cos(angle),
      center.dy + indicatorLength * sin(angle),
    );
    
    final indicatorPaint = Paint()
      ..color = Colors.red
      ..style = PaintingStyle.stroke
      ..strokeWidth = 6.0
      ..strokeCap = StrokeCap.round;
    
    canvas.drawLine(indicatorStart, indicatorEnd, indicatorPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    return true;
  }
}

class CustomPaintAnimationExample extends StatefulWidget {
  const CustomPaintAnimationExample({Key? key}) : super(key: key);

  @override
  State<CustomPaintAnimationExample> createState() => _CustomPaintAnimationExampleState();
}

class _CustomPaintAnimationExampleState extends State<CustomPaintAnimationExample>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    
    _controller = AnimationController(
      duration: const Duration(seconds: 3),
      vsync: this,
    );
    
    _animation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Curves.easeInOut,
      ),
    );
    
    // 循环播放动画
    _controller.repeat(reverse: true);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Custom Paint Animation'),
      ),
      body: Center(
        child: CustomPaint(
          size: const Size(300, 300),
          painter: AnimatedCirclePainter(animation: _animation),
        ),
      ),
    );
  }
}
```

## 6. 动画性能优化

### 6.1 性能优化技巧

1. **使用 AnimatedBuilder 而非 AnimatedWidget**
   - AnimatedBuilder 可以避免不必要的重建，特别是当动画包含复杂子部件时

2. **将不随动画变化的部分放在 child 参数中**
   - 这样这些部分不会在每次动画帧中重建

3. **使用 RepaintBoundary 隔离频繁重绘的部件**
   - 可以防止整个渲染树重建

4. **使用 const 构造器**
   - 对于不变的部件，使用 const 构造器避免重建

5. **避免在动画循环中进行昂贵的计算**
   - 将计算结果缓存起来

6. **使用 TickerProviderStateMixin 的 vsync**
   - 确保在屏幕外时动画不会消耗资源

7. **及时释放动画控制器**
   - 在 dispose 方法中调用 controller.dispose()

### 6.2 性能监控

```dart
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';

class PerformanceMonitoringExample extends StatefulWidget {
  const PerformanceMonitoringExample({Key? key}) : super(key: key);

  @override
  State<PerformanceMonitoringExample> createState() => _PerformanceMonitoringExampleState();
}

class _PerformanceMonitoringExampleState extends State<PerformanceMonitoringExample>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  bool _showPerformanceOverlay = false;

  @override
  void initState() {
    super.initState();
    
    _controller = AnimationController(
      duration: const Duration(seconds: 1),
      vsync: this,
    );
    
    // 循环动画
    _controller.repeat(reverse: true);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Performance Monitoring'),
      ),
      body: Column(
        children: [
          // 性能监控切换
          SwitchListTile(
            title: const Text('Show Performance Overlay'),
            value: _showPerformanceOverlay,
            onChanged: (value) {
              setState(() {
                _showPerformanceOverlay = value;
                // 设置全局性能覆盖层
                debugPaintLayerBordersEnabled = value;
              });
            },
          ),
          
          Expanded(
            child: Center(
              child: AnimatedBuilder(
                animation: _controller,
                builder: (context, child) {
                  return Transform.rotate(
                    angle: _controller.value * 2 * 3.14159,
                    child: child,
                  );
                },
                child: Container(
                  width: 200,
                  height: 200,
                  color: Colors.blue,
                  child: const Center(
                    child: Text(
                      'Rotating',
                      style: TextStyle(color: Colors.white),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
      // 条件显示性能覆盖层
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // 切换性能覆盖层
          setState(() {
            _showPerformanceOverlay = !_showPerformanceOverlay;
          });
        },
        child: const Icon(Icons.speed),
      ),
    );
  }
}
```

## 7. 动画库推荐

除了 Flutter 内置的动画 API，还有一些流行的第三方动画库可以简化动画开发：

1. **Flutter Animate**
   - 提供链式 API，简化动画创建
   - 支持组合多个动画效果

2. **Lottie**
   - 用于加载和显示 Adobe After Effects 动画
   - 可以创建非常复杂的动画效果

3. **Flare Flutter**
   - 用于高性能矢量动画
   - 支持交互式动画

4. **Simple Animations**
   - 简化动画实现的库
   - 提供动画组合和序列功能

5. **Rive**
   - Flare 的升级版
   - 支持更复杂的交互式动画

## 8. 动画最佳实践

### 8.1 设计原则

1. **适度使用动画**
   - 动画应该增强用户体验，而不是分散注意力
   - 避免过度使用动画，可能导致用户疲劳

2. **保持一致性**
   - 在整个应用中保持一致的动画风格
   - 统一动画持续时间、曲线和效果

3. **响应性和性能**
   - 确保动画在不同设备上表现良好
   - 在低端设备上可能需要减少动画效果

4. **可访问性**
   - 提供选项让用户可以减少或禁用动画
   - 考虑为有视觉或认知障碍的用户设计

### 8.2 实用建议

1. **动画持续时间**
   - 快速动画：100-200ms（例如：按钮点击反馈）
   - 标准动画：200-300ms（例如：页面转换）
   - 慢动画：300-500ms（例如：复杂的加载动画）

2. **动画曲线选择**
   - `Curves.easeInOut`：通用的平滑曲线
   - `Curves.fastOutSlowIn`：适合大多数过渡
   - `Curves.bounceOut`：适合弹性效果
   - `Curves.elasticOut`：适合更有弹性的效果

3. **组合动画**
   - 将多个简单动画组合成复杂动画
   - 使用交错动画创建更自然的效果

4. **测试和优化**
   - 在真实设备上测试动画性能
   - 使用性能工具找出瓶颈
   - 根据设备性能动态调整动画复杂度

## 9. 总结

Flutter 提供了强大而灵活的动画系统，从简单的属性动画到复杂的自定义动画，都能轻松实现。正确使用这些动画 API 可以创建出流畅、美观且用户友好的应用界面。

在实际开发中，应该根据具体需求选择合适的动画实现方式，并注意性能优化和用户体验。通过不断练习和尝试，可以掌握 Flutter 动画的精髓，创造出令人惊艳的用户界面。