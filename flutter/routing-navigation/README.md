# Flutter 路由与导航

本目录包含 Flutter 中路由与导航相关的示例代码和详细说明。路由和导航是构建多页面应用的基础，Flutter 提供了强大且灵活的导航系统，支持各种导航场景。

## 1. 路由与导航概述

### 1.1 什么是路由和导航

在 Flutter 中，路由（Route）通常指的是应用中的一个页面或屏幕，而导航（Navigation）则是在这些路由之间进行切换的过程。

Flutter 使用一个堆栈（Stack）来管理路由，新的路由会被推入（push）到堆栈顶部，而返回到上一个路由则是将当前路由弹出（pop）堆栈。

### 1.2 Flutter 中的导航方式

Flutter 提供了两种主要的导航方式：

1. **基本导航**：使用 `Navigator` 类的 `push` 和 `pop` 方法直接导航到新的路由
2. **命名路由**：使用预定义的路由名称进行导航，通过路由表管理

## 2. 基本导航

### 2.1 基本的页面跳转

使用 `Navigator.push` 和 `Navigator.pop` 方法进行简单的页面导航。

```dart
import 'package:flutter/material.dart';

// 第一个页面
class FirstScreen extends StatelessWidget {
  const FirstScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('First Screen')),
      body: Center(
        child: ElevatedButton(
          child: const Text('Go to Second Screen'),
          onPressed: () {
            // 跳转到第二个页面
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const SecondScreen()),
            );
          },
        ),
      ),
    );
  }
}

// 第二个页面
class SecondScreen extends StatelessWidget {
  const SecondScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Second Screen')),
      body: Center(
        child: ElevatedButton(
          child: const Text('Go back'),
          onPressed: () {
            // 返回上一个页面
            Navigator.pop(context);
          },
        ),
      ),
    );
  }
}
```

### 2.2 带返回值的导航

从第二个页面返回到第一个页面时，可以传递一个返回值。

```dart
import 'package:flutter/material.dart';

// 第一个页面
class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String result = 'No result yet';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Home Screen')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(result),
            ElevatedButton(
              child: const Text('Pick an option'),
              onPressed: () async {
                // 等待返回结果
                final String? selection = await Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const SelectionScreen(),
                  ),
                );

                // 更新结果
                setState(() {
                  result = selection ?? 'No selection';
                });
              },
            ),
          ],
        ),
      ),
    );
  }
}

// 选择页面
class SelectionScreen extends StatelessWidget {
  const SelectionScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Select an Option')),
      body: Column(
        children: [
          ListTile(
            title: const Text('Option 1'),
            onTap: () {
              // 返回值 "Option 1"
              Navigator.pop(context, 'Option 1 selected!');
            },
          ),
          ListTile(
            title: const Text('Option 2'),
            onTap: () {
              // 返回值 "Option 2"
              Navigator.pop(context, 'Option 2 selected!');
            },
          ),
          ElevatedButton(
            child: const Text('Cancel'),
            onPressed: () {
              // 不返回任何值
              Navigator.pop(context);
            },
          ),
        ],
      ),
    );
  }
}
```

## 3. 命名路由

### 3.1 定义路由表

在应用程序的根组件中定义命名路由表。

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Named Routes Demo',
      theme: ThemeData(primarySwatch: Colors.blue),
      // 定义命名路由表
      routes: {
        '/': (context) => const HomeScreen(),
        '/second': (context) => const SecondScreen(),
        '/settings': (context) => const SettingsScreen(),
      },
    );
  }
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Home')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(
              child: const Text('Go to Second Screen'),
              onPressed: () {
                // 使用命名路由导航
                Navigator.pushNamed(context, '/second');
              },
            ),
            ElevatedButton(
              child: const Text('Go to Settings'),
              onPressed: () {
                Navigator.pushNamed(context, '/settings');
              },
            ),
          ],
        ),
      ),
    );
  }
}

class SecondScreen extends StatelessWidget {
  const SecondScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Second Screen')),
      body: Center(
        child: ElevatedButton(
          child: const Text('Go back'),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
      ),
    );
  }
}

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Settings')),
      body: Center(
        child: ElevatedButton(
          child: const Text('Go back'),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
      ),
    );
  }
}
```

### 3.2 带参数的命名路由

使用 `Navigator.pushNamed` 传递参数到命名路由。

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Named Routes with Parameters',
      theme: ThemeData(primarySwatch: Colors.blue),
      routes: {
        '/': (context) => const HomeScreen(),
        // 路由表中不包含需要参数的路由，使用 onGenerateRoute 处理
      },
      // 使用 onGenerateRoute 处理带参数的路由
      onGenerateRoute: (settings) {
        if (settings.name == '/detail') {
          // 安全地获取参数
          final args = settings.arguments;
          if (args is Map<String, dynamic>) {
            return MaterialPageRoute(
              builder: (context) => DetailScreen(
                id: args['id'] as int,
                title: args['title'] as String,
              ),
            );
          }
        }
        // 如果路由不存在，返回错误页面
        return MaterialPageRoute(
          builder: (context) => const ErrorScreen(),
        );
      },
    );
  }
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Home')),
      body: ListView.builder(
        itemCount: 10,
        itemBuilder: (context, index) {
          final id = index + 1;
          return ListTile(
            title: Text('Item $id'),
            onTap: () {
              // 传递参数到详情页
              Navigator.pushNamed(
                context,
                '/detail',
                arguments: {'id': id, 'title': 'Item $id Details'},
              );
            },
          );
        },
      ),
    );
  }
}

class DetailScreen extends StatelessWidget {
  final int id;
  final String title;

  const DetailScreen({Key? key, required this.id, required this.title}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('ID: $id', style: const TextStyle(fontSize: 24)),
            const SizedBox(height: 16),
            ElevatedButton(
              child: const Text('Go back'),
              onPressed: () {
                Navigator.pop(context);
              },
            ),
          ],
        ),
      ),
    );
  }
}

class ErrorScreen extends StatelessWidget {
  const ErrorScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Error')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('Page not found!', style: TextStyle(fontSize: 24)),
            ElevatedButton(
              child: const Text('Go to Home'),
              onPressed: () {
                Navigator.pushNamed(context, '/');
              },
            ),
          ],
        ),
      ),
    );
  }
}
```

## 4. 路由转场动画

### 4.1 自定义页面过渡

使用 `PageRouteBuilder` 自定义页面之间的过渡动画。

```dart
import 'package:flutter/material.dart';

class TransitionDemo extends StatelessWidget {
  const TransitionDemo({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Transition Demo')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(
              child: const Text('Fade Transition'),
              onPressed: () {
                Navigator.push(
                  context,
                  PageRouteBuilder(
                    pageBuilder: (context, animation, secondaryAnimation) =>
                        const SecondScreen(title: 'Fade Transition'),
                    transitionsBuilder: (context, animation, secondaryAnimation, child) {
                      return FadeTransition(
                        opacity: animation,
                        child: child,
                      );
                    },
                    transitionDuration: const Duration(milliseconds: 500),
                  ),
                );
              },
            ),
            ElevatedButton(
              child: const Text('Slide Transition'),
              onPressed: () {
                Navigator.push(
                  context,
                  PageRouteBuilder(
                    pageBuilder: (context, animation, secondaryAnimation) =>
                        const SecondScreen(title: 'Slide Transition'),
                    transitionsBuilder: (context, animation, secondaryAnimation, child) {
                      const begin = Offset(1.0, 0.0);
                      const end = Offset.zero;
                      const curve = Curves.ease;
                      
                      final tween = Tween(begin: begin, end: end).chain(CurveTween(curve: curve));
                      
                      return SlideTransition(
                        position: animation.drive(tween),
                        child: child,
                      );
                    },
                    transitionDuration: const Duration(milliseconds: 300),
                  ),
                );
              },
            ),
            ElevatedButton(
              child: const Text('Scale Transition'),
              onPressed: () {
                Navigator.push(
                  context,
                  PageRouteBuilder(
                    pageBuilder: (context, animation, secondaryAnimation) =>
                        const SecondScreen(title: 'Scale Transition'),
                    transitionsBuilder: (context, animation, secondaryAnimation, child) {
                      const begin = 0.0;
                      const end = 1.0;
                      const curve = Curves.easeOutCubic;
                      
                      final tween = Tween(begin: begin, end: end).chain(CurveTween(curve: curve));
                      
                      return ScaleTransition(
                        scale: animation.drive(tween),
                        child: child,
                      );
                    },
                    transitionDuration: const Duration(milliseconds: 500),
                  ),
                );
              },
            ),
            ElevatedButton(
              child: const Text('Rotation Transition'),
              onPressed: () {
                Navigator.push(
                  context,
                  PageRouteBuilder(
                    pageBuilder: (context, animation, secondaryAnimation) =>
                        const SecondScreen(title: 'Rotation Transition'),
                    transitionsBuilder: (context, animation, secondaryAnimation, child) {
                      const begin = 0.0;
                      const end = 1.0;
                      const curve = Curves.easeInOut;
                      
                      final tween = Tween(begin: begin, end: end).chain(CurveTween(curve: curve));
                      
                      return RotationTransition(
                        turns: animation.drive(tween),
                        child: ScaleTransition(
                          scale: animation.drive(tween),
                          child: child,
                        ),
                      );
                    },
                    transitionDuration: const Duration(milliseconds: 700),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}

class SecondScreen extends StatelessWidget {
  final String title;

  const SecondScreen({Key? key, required this.title}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: Center(
        child: ElevatedButton(
          child: const Text('Go back'),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
      ),
    );
  }
}
```

### 4.2 预定义的转场动画

Flutter 提供了一些预定义的转场动画，可以直接使用。

```dart
import 'package:flutter/material.dart';

class PredefinedTransitionsDemo extends StatelessWidget {
  const PredefinedTransitionsDemo({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Predefined Transitions')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(
              child: const Text('Material Page Route'),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const DetailScreen(title: 'Material Transition'),
                  ),
                );
              },
            ),
            ElevatedButton(
              child: const Text('Cupertino Page Route'),
              onPressed: () {
                Navigator.push(
                  context,
                  CupertinoPageRoute(
                    builder: (context) => const DetailScreen(title: 'Cupertino Transition'),
                  ),
                );
              },
            ),
            ElevatedButton(
              child: const Text('Page Route with Theme'),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const DetailScreen(title: 'Custom Theme'),
                    settings: const RouteSettings(name: '/custom-theme'),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}

class DetailScreen extends StatelessWidget {
  final String title;

  const DetailScreen({Key? key, required this.title}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Theme(
      data: Theme.of(context).copyWith(
        primaryColor: Colors.purple,
        colorScheme: Theme.of(context).colorScheme.copyWith(
              primary: Colors.purple,
            ),
      ),
      child: Scaffold(
        appBar: AppBar(title: Text(title)),
        body: Center(
          child: ElevatedButton(
            child: const Text('Go back'),
            onPressed: () {
              Navigator.pop(context);
            },
          ),
        ),
      ),
    );
  }
}
```

## 5. 嵌套导航

### 5.1 嵌套导航器

在应用中嵌套多个导航器，实现复杂的导航结构。

```dart
import 'package:flutter/material.dart';

class NestedNavigationDemo extends StatelessWidget {
  const NestedNavigationDemo({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Nested Navigation Demo',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: const MainScreen(),
    );
  }
}

class MainScreen extends StatefulWidget {
  const MainScreen({Key? key}) : super(key: key);

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _selectedIndex = 0;
  
  // 为每个标签页维护一个导航器的键
  final List<GlobalKey<NavigatorState>> _navigatorKeys = [
    GlobalKey<NavigatorState>(),
    GlobalKey<NavigatorState>(),
    GlobalKey<NavigatorState>(),
  ];

  void _onItemTapped(int index) {
    if (index == _selectedIndex) {
      // 如果点击的是当前标签页，弹出该标签页的所有路由，返回到根路由
      _navigatorKeys[index].currentState?.popUntil((route) => route.isFirst);
    } else {
      setState(() {
        _selectedIndex = index;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _selectedIndex,
        children: [
          // 每个标签页都有自己的导航器
          Navigator(
            key: _navigatorKeys[0],
            onGenerateRoute: (settings) {
              return MaterialPageRoute(
                builder: (context) => const HomeTab(),
              );
            },
          ),
          Navigator(
            key: _navigatorKeys[1],
            onGenerateRoute: (settings) {
              return MaterialPageRoute(
                builder: (context) => const SearchTab(),
              );
            },
          ),
          Navigator(
            key: _navigatorKeys[2],
            onGenerateRoute: (settings) {
              return MaterialPageRoute(
                builder: (context) => const ProfileTab(),
              );
            },
          ),
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.search),
            label: 'Search',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
      ),
    );
  }
}

class HomeTab extends StatelessWidget {
  const HomeTab({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Home')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('Home Tab Content', style: TextStyle(fontSize: 24)),
            ElevatedButton(
              child: const Text('Go to Home Detail'),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const HomeDetailScreen()),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}

class HomeDetailScreen extends StatelessWidget {
  const HomeDetailScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Home Detail')),
      body: Center(
        child: ElevatedButton(
          child: const Text('Go back'),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
      ),
    );
  }
}

class SearchTab extends StatelessWidget {
  const SearchTab({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Search')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('Search Tab Content', style: TextStyle(fontSize: 24)),
            ElevatedButton(
              child: const Text('Go to Search Result'),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const SearchResultScreen()),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}

class SearchResultScreen extends StatelessWidget {
  const SearchResultScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Search Results')),
      body: Center(
        child: ElevatedButton(
          child: const Text('Go back'),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
      ),
    );
  }
}

class ProfileTab extends StatelessWidget {
  const ProfileTab({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('Profile Tab Content', style: TextStyle(fontSize: 24)),
            ElevatedButton(
              child: const Text('Go to Settings'),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const SettingsScreen()),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Settings')),
      body: Center(
        child: ElevatedButton(
          child: const Text('Go back'),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
      ),
    );
  }
}
```

### 5.2 带状态恢复的嵌套导航

在嵌套导航中保存和恢复状态。

```dart
import 'package:flutter/material.dart';

class StatefulNestedNavigation extends StatefulWidget {
  const StatefulNestedNavigation({Key? key}) : super(key: key);

  @override
  State<StatefulNestedNavigation> createState() => _StatefulNestedNavigationState();
}

class _StatefulNestedNavigationState extends State<StatefulNestedNavigation> with RestorationMixin {
  final RestorableInt _selectedIndex = RestorableInt(0);
  final List<GlobalKey<NavigatorState>> _navigatorKeys = [
    GlobalKey<NavigatorState>(),
    GlobalKey<NavigatorState>(),
  ];

  @override
  String get restorationId => 'main_screen';

  @override
  void restoreState(RestorationBucket? oldBucket, bool initialRestore) {
    registerForRestoration(_selectedIndex, 'selected_tab_index');
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex.value = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _selectedIndex.value,
        children: [
          Navigator(
            key: _navigatorKeys[0],
            onGenerateRoute: (settings) {
              return MaterialPageRoute(
                builder: (context) => const ItemsTab(),
              );
            },
          ),
          Navigator(
            key: _navigatorKeys[1],
            onGenerateRoute: (settings) {
              return MaterialPageRoute(
                builder: (context) => const FavoritesTab(),
              );
            },
          ),
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.list),
            label: 'Items',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.favorite),
            label: 'Favorites',
          ),
        ],
        currentIndex: _selectedIndex.value,
        onTap: _onItemTapped,
      ),
    );
  }

  @override
  void dispose() {
    _selectedIndex.dispose();
    super.dispose();
  }
}

class ItemsTab extends StatefulWidget {
  const ItemsTab({Key? key}) : super(key: key);

  @override
  State<ItemsTab> createState() => _ItemsTabState();
}

class _ItemsTabState extends State<ItemsTab> with RestorationMixin {
  final RestorableInt _counter = RestorableInt(0);

  @override
  String get restorationId => 'items_tab';

  @override
  void restoreState(RestorationBucket? oldBucket, bool initialRestore) {
    registerForRestoration(_counter, 'counter');
  }

  void _incrementCounter() {
    setState(() {
      _counter.value++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Items')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('Counter: ${_counter.value}', style: const TextStyle(fontSize: 24)),
            ElevatedButton(
              child: const Text('Increment'),
              onPressed: _incrementCounter,
            ),
            ElevatedButton(
              child: const Text('Item Details'),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const ItemDetailsScreen()),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    _counter.dispose();
    super.dispose();
  }
}

class ItemDetailsScreen extends StatelessWidget {
  const ItemDetailsScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Item Details')),
      body: Center(
        child: ElevatedButton(
          child: const Text('Go back'),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
      ),
    );
  }
}

class FavoritesTab extends StatelessWidget {
  const FavoritesTab({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Favorites')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('Favorites Tab Content', style: TextStyle(fontSize: 24)),
            ElevatedButton(
              child: const Text('Add to Favorites'),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const AddToFavoritesScreen()),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}

class AddToFavoritesScreen extends StatelessWidget {
  const AddToFavoritesScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Add to Favorites')),
      body: Center(
        child: ElevatedButton(
          child: const Text('Go back'),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
      ),
    );
  }
}
```

## 6. 高级导航技术

### 6.1 使用 WillPopScope 控制返回行为

自定义返回按钮和返回手势的行为。

```dart
import 'package:flutter/material.dart';

class WillPopScopeDemo extends StatelessWidget {
  const WillPopScopeDemo({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('WillPopScope Demo')),
      body: Center(
        child: ElevatedButton(
          child: const Text('Open Protected Screen'),
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const ProtectedScreen()),
            );
          },
        ),
      ),
    );
  }
}

class ProtectedScreen extends StatelessWidget {
  const ProtectedScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        // 显示确认对话框
        final bool? result = await showDialog<bool>(
          context: context,
          builder: (context) {
            return AlertDialog(
              title: const Text('Confirm Exit'),
              content: const Text('Are you sure you want to exit this screen?'),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(context, false),
                  child: const Text('Cancel'),
                ),
                TextButton(
                  onPressed: () => Navigator.pop(context, true),
                  child: const Text('Exit'),
                ),
              ],
            );
          },
        );
        return result ?? false;
      },
      child: Scaffold(
        appBar: AppBar(title: const Text('Protected Screen')),
        body: const Center(
          child: Text(
            'This screen requires confirmation to exit.',
            style: TextStyle(fontSize: 18),
            textAlign: TextAlign.center,
          ),
        ),
      ),
    );
  }
}
```

### 6.2 导航到指定路由

使用 `Navigator.pushReplacement`, `Navigator.popUntil`, `Navigator.pushAndRemoveUntil` 等方法进行更复杂的导航操作。

```dart
import 'package:flutter/material.dart';

class AdvancedNavigationDemo extends StatelessWidget {
  const AdvancedNavigationDemo({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Advanced Navigation')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(
              child: const Text('Push Replacement'),
              onPressed: () {
                // 替换当前路由，用户无法返回到此页面
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (context) => const ReplacementScreen()),
                );
              },
            ),
            ElevatedButton(
              child: const Text('Push and Remove Until'),
              onPressed: () {
                // 推新路由并清除所有之前的路由直到指定路由
                Navigator.pushAndRemoveUntil(
                  context,
                  MaterialPageRoute(builder: (context) => const HomeScreen()),
                  (Route<dynamic> route) => false, // 清除所有路由
                );
              },
            ),
            ElevatedButton(
              child: const Text('Pop Until'),
              onPressed: () {
                // 弹出多个路由直到指定路由
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const MultiLevelScreen()),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}

class ReplacementScreen extends StatelessWidget {
  const ReplacementScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Replacement Screen')),
      body: const Center(
        child: Text(
          'You can\'t go back to the previous screen!',
          style: TextStyle(fontSize: 18),
        ),
      ),
    );
  }
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Home Screen')),
      body: const Center(
        child: Text(
          'You are on the home screen!',
          style: TextStyle(fontSize: 18),
        ),
      ),
    );
  }
}

class MultiLevelScreen extends StatelessWidget {
  const MultiLevelScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Level 1')),
      body: Center(
        child: ElevatedButton(
          child: const Text('Go to Level 2'),
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const Level2Screen()),
            );
          },
        ),
      ),
    );
  }
}

class Level2Screen extends StatelessWidget {
  const Level2Screen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Level 2')),
      body: Center(
        child: ElevatedButton(
          child: const Text('Go back to First Screen'),
          onPressed: () {
            // 弹出所有路由直到第一个路由
            Navigator.popUntil(
              context,
              (route) => route.isFirst,
            );
          },
        ),
      ),
    );
  }
}
```

### 6.3 带英雄动画的导航

使用 Hero 动画在页面之间平滑过渡共享元素。

```dart
import 'package:flutter/material.dart';

class HeroAnimationDemo extends StatelessWidget {
  const HeroAnimationDemo({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Hero Animation')),
      body: GridView.builder(
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          crossAxisSpacing: 10,
          mainAxisSpacing: 10,
        ),
        itemCount: 6,
        itemBuilder: (context, index) {
          return GestureDetector(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => DetailScreen(
                    imageIndex: index,
                  ),
                ),
              );
            },
            child: Card(
              elevation: 4,
              child: GridTile(
                child: Hero(
                  tag: 'image_$index',
                  child: Image.network(
                    'https://picsum.photos/400/300?random=$index',
                    fit: BoxFit.cover,
                  ),
                ),
                footer: GridTileBar(
                  backgroundColor: Colors.black54,
                  title: Text('Image ${index + 1}'),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

class DetailScreen extends StatelessWidget {
  final int imageIndex;

  const DetailScreen({Key? key, required this.imageIndex}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: GestureDetector(
        onTap: () {
          Navigator.pop(context);
        },
        child: Center(
          child: Hero(
            tag: 'image_$imageIndex',
            child: Image.network(
              'https://picsum.photos/800/600?random=$imageIndex',
              fit: BoxFit.contain,
            ),
          ),
        ),
      ),
    );
  }
}
```

## 7. 路由和导航最佳实践

### 7.1 路由管理建议

1. **组织路由结构**
   - 为大型应用创建专门的路由文件
   - 使用枚举或常量定义路由名称

```dart
// routes.dart
import 'package:flutter/material.dart';
import 'screens/home_screen.dart';
import 'screens/detail_screen.dart';
import 'screens/settings_screen.dart';

class AppRoutes {
  static const String home = '/';
  static const String detail = '/detail';
  static const String settings = '/settings';

  static Map<String, WidgetBuilder> get routes => {
        home: (context) => const HomeScreen(),
        detail: (context) => const DetailScreen(),
        settings: (context) => const SettingsScreen(),
      };

  static Route<dynamic> generateRoute(RouteSettings settings) {
    // 处理带参数的路由
    switch (settings.name) {
      case detail:
        final args = settings.arguments as Map<String, dynamic>?;
        return MaterialPageRoute(
          builder: (context) => DetailScreen(
            id: args?['id'] ?? 0,
            title: args?['title'] ?? 'Detail',
          ),
        );
      default:
        // 未匹配的路由返回错误页面
        return MaterialPageRoute(
          builder: (context) => Scaffold(
            appBar: AppBar(title: const Text('Error')),
            body: const Center(child: Text('Page not found')),
          ),
        );
    }
  }
}
```

2. **统一的导航服务**
   - 创建导航服务类封装导航逻辑

```dart
// navigation_service.dart
import 'package:flutter/material.dart';

class NavigationService {
  static final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

  static Future<dynamic> navigateTo(String routeName, {dynamic arguments}) {
    return navigatorKey.currentState!
        .pushNamed(routeName, arguments: arguments);
  }

  static void goBack({dynamic result}) {
    navigatorKey.currentState!.pop(result);
  }

  static Future<dynamic> replaceWith(String routeName, {dynamic arguments}) {
    return navigatorKey.currentState!
        .pushReplacementNamed(routeName, arguments: arguments);
  }

  static Future<dynamic> pushNamedAndRemoveUntil(
    String routeName,
    bool Function(Route<dynamic>) predicate,
    {dynamic arguments}
  ) {
    return navigatorKey.currentState!.pushNamedAndRemoveUntil(
        routeName, predicate, arguments: arguments);
  }
}

// 在 MaterialApp 中使用
MaterialApp(
  navigatorKey: NavigationService.navigatorKey,
  // ...
);
```

### 7.2 性能优化

1. **避免重建路由**
   - 使用 IndexedStack 保持标签页状态
   - 使用 AutomaticKeepAliveClientMixin 保持状态

```dart
class PersistentTab extends StatefulWidget {
  const PersistentTab({Key? key}) : super(key: key);

  @override
  State<PersistentTab> createState() => _PersistentTabState();
}

class _PersistentTabState extends State<PersistentTab> 
    with AutomaticKeepAliveClientMixin<PersistentTab> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  @override
  bool get wantKeepAlive => true;

  @override
  Widget build(BuildContext context) {
    super.build(context); // 必须调用 super.build
    return Scaffold(
      appBar: AppBar(title: const Text('Persistent Tab')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('Counter: $_counter', style: const TextStyle(fontSize: 24)),
            ElevatedButton(
              onPressed: _incrementCounter,
              child: const Text('Increment'),
            ),
          ],
        ),
      ),
    );
  }
}
```

2. **懒加载路由**
   - 使用懒加载减少初始启动时间

```dart
// 懒加载路由
final routes = {
  '/': (context) => const HomeScreen(),
  '/heavy-screen': (context) {
    // 只在需要时导入重组件
    return FutureBuilder(
      future: _loadHeavyScreen(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.done) {
          return snapshot.data as Widget;
        }
        return const Center(child: CircularProgressIndicator());
      },
    );
  },
};

Future<Widget> _loadHeavyScreen() async {
  // 模拟延迟加载
  await Future.delayed(const Duration(milliseconds: 100));
  // 在这里导入重组件
  // 这会导致该文件只在需要时才会被加载
  return const HeavyScreen();
}
```

### 7.3 可访问性考虑

1. **语义化导航**
   - 使用语义化标签增强可访问性

```dart
class AccessibleNavigation extends StatelessWidget {
  const AccessibleNavigation({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Accessible Navigation')),
      body: Center(
        child: Semantics(
          label: 'Navigate to next screen',
          hint: 'Double tap to open details',
          button: true,
          child: ElevatedButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const DetailScreen()),
              );
            },
            child: const Text('Go to Details'),
          ),
        ),
      ),
    );
  }
}
```

2. **焦点管理**
   - 导航后管理焦点

```dart
class FocusManagement extends StatelessWidget {
  const FocusManagement({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Focus Management')),
      body: Center(
        child: ElevatedButton(
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const ScreenWithFocus()),
            );
          },
          child: const Text('Go to Screen with Focus'),
        ),
      ),
    );
  }
}

class ScreenWithFocus extends StatefulWidget {
  const ScreenWithFocus({Key? key}) : super(key: key);

  @override
  State<ScreenWithFocus> createState() => _ScreenWithFocusState();
}

class _ScreenWithFocusState extends State<ScreenWithFocus> {
  final FocusNode _focusNode = FocusNode();

  @override
  void initState() {
    super.initState();
    // 延迟请求焦点，确保屏幕已加载完成
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _focusNode.requestFocus();
    });
  }

  @override
  void dispose() {
    _focusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Screen with Focus')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              decoration: const InputDecoration(labelText: 'First Name'),
              focusNode: _focusNode,
            ),
            TextField(
              decoration: const InputDecoration(labelText: 'Last Name'),
            ),
          ],
        ),
      ),
    );
  }
}
```

## 8. 总结

Flutter 的路由和导航系统提供了灵活而强大的方式来管理应用中的页面切换。通过掌握不同的导航技术，可以构建出用户体验良好的多页面应用。

主要导航技术包括：

- **基本导航**：使用 `Navigator.push` 和 `Navigator.pop` 进行简单的页面跳转
- **命名路由**：使用路由名称进行导航，便于大型应用管理
- **路由参数**：在页面之间传递数据
- **路由转场动画**：自定义页面切换效果
- **嵌套导航**：在应用中管理多个导航堆栈
- **高级导航**：控制返回行为、替换路由等复杂操作

在实际开发中，应根据应用的规模和需求选择合适的导航方式，并遵循最佳实践，以确保代码的可维护性和良好的用户体验。