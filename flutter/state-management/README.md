# Flutter 状态管理

本目录包含 Flutter 中各种状态管理方案的示例代码和详细说明。状态管理是 Flutter 应用开发中的核心挑战之一，选择合适的状态管理方案对于构建可维护、可扩展的应用至关重要。

## 1. 状态管理概述

### 1.1 状态的类型

在 Flutter 中，状态可以分为以下几类：

- **临时状态（Ephemeral State）**：仅在单个 Widget 内使用的状态，如表单输入、动画状态等
- **应用状态（App State）**：需要在多个 Widget 之间共享的状态，如用户登录信息、购物车数据等

### 1.2 状态管理方案对比

| 方案 | 适用场景 | 复杂度 | 学习曲线 |
|------|----------|--------|----------|
| setState | 简单组件内部状态 | 低 | 极低 |
| InheritedWidget | 跨组件共享简单状态 | 中 | 中 |
| Provider | 中小型应用的全局状态 | 中 | 中低 |
| Bloc | 复杂应用的可预测状态 | 高 | 高 |
| GetX | 快速开发的全能解决方案 | 低 | 低 |
| Riverpod | 更现代的 Provider 替代品 | 中 | 中 |
| MobX | 基于响应式编程的状态管理 | 中 | 中高 |

## 2. 基础状态管理

### 2.1 使用 setState

最简单的状态管理方式，适用于单一 Widget 内部的状态管理。

```dart
import 'package:flutter/material.dart';

class CounterWithSetState extends StatefulWidget {
  const CounterWithSetState({Key? key}) : super(key: key);

  @override
  State<CounterWithSetState> createState() => _CounterWithSetStateState();
}

class _CounterWithSetStateState extends State<CounterWithSetState> {
  int _count = 0;

  void _increment() {
    setState(() {
      _count++;
    });
  }

  void _decrement() {
    setState(() {
      _count--;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text('Count: $_count', style: const TextStyle(fontSize: 24)),
        const SizedBox(height: 16),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(
              onPressed: _decrement,
              child: const Text('-'),
            ),
            const SizedBox(width: 16),
            ElevatedButton(
              onPressed: _increment,
              child: const Text('+'),
            ),
          ],
        ),
      ],
    );
  }
}
```

### 2.2 父传子状态管理

通过构造函数传递状态和回调函数。

```dart
import 'package:flutter/material.dart';

// 父组件
class ParentWidget extends StatefulWidget {
  const ParentWidget({Key? key}) : super(key: key);

  @override
  State<ParentWidget> createState() => _ParentWidgetState();
}

class _ParentWidgetState extends State<ParentWidget> {
  String _message = 'Hello from parent';
  bool _isFavorite = false;

  void _updateMessage(String newMessage) {
    setState(() {
      _message = newMessage;
    });
  }

  void _toggleFavorite() {
    setState(() {
      _isFavorite = !_isFavorite;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text('Parent Message: $_message'),
        ChildWidget(
          message: _message,
          isFavorite: _isFavorite,
          onMessageChanged: _updateMessage,
          onFavoriteToggled: _toggleFavorite,
        ),
      ],
    );
  }
}

// 子组件
class ChildWidget extends StatelessWidget {
  final String message;
  final bool isFavorite;
  final ValueChanged<String> onMessageChanged;
  final VoidCallback onFavoriteToggled;

  const ChildWidget({
    Key? key,
    required this.message,
    required this.isFavorite,
    required this.onMessageChanged,
    required this.onFavoriteToggled,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Text('Child received: $message'),
            const SizedBox(height: 8),
            IconButton(
              icon: Icon(
                isFavorite ? Icons.favorite : Icons.favorite_border,
                color: isFavorite ? Colors.red : null,
              ),
              onPressed: onFavoriteToggled,
            ),
            TextField(
              onChanged: onMessageChanged,
              decoration: const InputDecoration(labelText: 'Update message'),
            ),
          ],
        ),
      ),
    );
  }
}
```

## 3. Provider 状态管理

Provider 是 Flutter 官方推荐的状态管理方案，基于 InheritedWidget 构建，使用简单且功能强大。

### 3.1 Provider 基础使用

首先需要在 `pubspec.yaml` 中添加依赖：

```yaml
dependencies:
  flutter:
    sdk: flutter
  provider: ^6.0.0
```

#### 基本计数器示例

```dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

// 计数器模型
class CounterModel extends ChangeNotifier {
  int _count = 0;

  int get count => _count;

  void increment() {
    _count++;
    notifyListeners(); // 通知监听器状态已改变
  }

  void decrement() {
    _count--;
    notifyListeners();
  }
}

// 提供者组件
class CounterProviderExample extends StatelessWidget {
  const CounterProviderExample({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => CounterModel(),
      child: const CounterPage(),
    );
  }
}

// 计数器页面
class CounterPage extends StatelessWidget {
  const CounterPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Provider Counter')),
      body: const Center(child: CounterDisplay()),
      floatingActionButton: const CounterButtons(),
    );
  }
}

// 显示计数器
class CounterDisplay extends StatelessWidget {
  const CounterDisplay({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // 方式1：使用 Consumer
    return Consumer<CounterModel>(
      builder: (context, counter, child) {
        return Text(
          'Count: ${counter.count}',
          style: const TextStyle(fontSize: 24),
        );
      },
    );

    // 方式2：使用 Provider.of（需要监听变化）
    // final counter = Provider.of<CounterModel>(context);
    // return Text('Count: ${counter.count}', style: const TextStyle(fontSize: 24));
  }
}

// 计数器按钮
class CounterButtons extends StatelessWidget {
  const CounterButtons({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // 方式1：使用 Consumer
    return Consumer<CounterModel>(
      builder: (context, counter, child) {
        return Row(
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            FloatingActionButton(
              onPressed: counter.decrement,
              child: const Icon(Icons.remove),
            ),
            const SizedBox(width: 16),
            FloatingActionButton(
              onPressed: counter.increment,
              child: const Icon(Icons.add),
            ),
          ],
        );
      },
    );

    // 方式2：使用 Provider.of（不需要监听变化，使用 listen: false）
    // final counter = Provider.of<CounterModel>(context, listen: false);
    // return Row(...);
  }
}
```

### 3.2 多 Provider 管理

```dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

// 用户模型
class UserModel extends ChangeNotifier {
  String _name = 'Guest';
  String _email = '';

  String get name => _name;
  String get email => _email;

  void updateUser(String name, String email) {
    _name = name;
    _email = email;
    notifyListeners();
  }
}

// 购物车模型
class CartModel extends ChangeNotifier {
  List<String> _items = [];

  List<String> get items => _items;
  int get itemCount => _items.length;

  void addItem(String item) {
    _items.add(item);
    notifyListeners();
  }

  void removeItem(String item) {
    _items.remove(item);
    notifyListeners();
  }
}

// 多 Provider 示例
class MultiProviderExample extends StatelessWidget {
  const MultiProviderExample({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (context) => UserModel()),
        ChangeNotifierProvider(create: (context) => CartModel()),
      ],
      child: const MultiProviderPage(),
    );
  }
}

class MultiProviderPage extends StatelessWidget {
  const MultiProviderPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Multi Provider Example')),
      body: Column(
        children: const [
          UserInfoSection(),
          CartSection(),
        ],
      ),
    );
  }
}

class UserInfoSection extends StatelessWidget {
  const UserInfoSection({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.all(16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Consumer<UserModel>(
              builder: (context, user, child) {
                return Column(
                  children: [
                    Text('Name: ${user.name}', style: const TextStyle(fontSize: 18)),
                    Text('Email: ${user.email}', style: const TextStyle(fontSize: 18)),
                  ],
                );
              },
            ),
            const SizedBox(height: 16),
            UserUpdateForm(),
          ],
        ),
      ),
    );
  }
}

class UserUpdateForm extends StatelessWidget {
  UserUpdateForm({Key? key}) : super(key: key);
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        TextField(
          controller: _nameController,
          decoration: const InputDecoration(labelText: 'Name'),
        ),
        TextField(
          controller: _emailController,
          decoration: const InputDecoration(labelText: 'Email'),
        ),
        const SizedBox(height: 8),
        ElevatedButton(
          onPressed: () {
            final userModel = Provider.of<UserModel>(context, listen: false);
            userModel.updateUser(_nameController.text, _emailController.text);
          },
          child: const Text('Update Profile'),
        ),
      ],
    );
  }
}

class CartSection extends StatelessWidget {
  const CartSection({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Card(
        margin: const EdgeInsets.all(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Shopping Cart', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  Consumer<CartModel>(
                    builder: (context, cart, child) {
                      return Text('Items: ${cart.itemCount}');
                    },
                  ),
                ],
              ),
              const SizedBox(height: 16),
              CartItemAdder(),
              const SizedBox(height: 16),
              Expanded(child: CartItemList()),
            ],
          ),
        ),
      ),
    );
  }
}

class CartItemAdder extends StatelessWidget {
  CartItemAdder({Key? key}) : super(key: key);
  final _itemController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: TextField(
            controller: _itemController,
            decoration: const InputDecoration(labelText: 'Add Item'),
          ),
        ),
        ElevatedButton(
          onPressed: () {
            if (_itemController.text.isNotEmpty) {
              final cartModel = Provider.of<CartModel>(context, listen: false);
              cartModel.addItem(_itemController.text);
              _itemController.clear();
            }
          },
          child: const Text('Add'),
        ),
      ],
    );
  }
}

class CartItemList extends StatelessWidget {
  const CartItemList({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Consumer<CartModel>(
      builder: (context, cart, child) {
        if (cart.items.isEmpty) {
          return const Center(child: Text('Cart is empty'));
        }
        return ListView.builder(
          itemCount: cart.items.length,
          itemBuilder: (context, index) {
            final item = cart.items[index];
            return ListTile(
              title: Text(item),
              trailing: IconButton(
                icon: const Icon(Icons.remove_circle),
                onPressed: () {
                  cart.removeItem(item);
                },
              ),
            );
          },
        );
      },
    );
  }
}
```

### 3.3 Selector 优化渲染

使用 Selector 可以避免不必要的重建，提高性能。

```dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

// 产品模型
class Product {
  final String id;
  final String name;
  final double price;
  bool isFavorite;

  Product({
    required this.id,
    required this.name,
    required this.price,
    this.isFavorite = false,
  });

  void toggleFavorite() {
    isFavorite = !isFavorite;
  }
}

// 产品列表模型
class ProductListModel extends ChangeNotifier {
  List<Product> _products = [
    Product(id: '1', name: 'Product 1', price: 10.0),
    Product(id: '2', name: 'Product 2', price: 20.0),
    Product(id: '3', name: 'Product 3', price: 30.0),
  ];

  List<Product> get products => _products;

  void toggleFavorite(String id) {
    final product = _products.firstWhere((p) => p.id == id);
    product.toggleFavorite();
    notifyListeners();
  }

  int get favoriteCount => _products.where((p) => p.isFavorite).length;
}

// Selector 优化示例
class SelectorOptimizationExample extends StatelessWidget {
  const SelectorOptimizationExample({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => ProductListModel(),
      child: const ProductPage(),
    );
  }
}

class ProductPage extends StatelessWidget {
  const ProductPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Products'),
        actions: const [FavoriteCountBadge()],
      ),
      body: const ProductList(),
    );
  }
}

// 使用 Selector 只监听收藏数量变化
class FavoriteCountBadge extends StatelessWidget {
  const FavoriteCountBadge({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Selector<ProductListModel, int>(
      selector: (context, model) => model.favoriteCount,
      builder: (context, favoriteCount, child) {
        print('Favorite count badge rebuilt');
        return Badge(
          label: Text(favoriteCount.toString()),
          child: const Icon(Icons.favorite),
        );
      },
    );
  }
}

// 使用 Selector 优化列表项渲染
class ProductList extends StatelessWidget {
  const ProductList({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Consumer<ProductListModel>(
      builder: (context, model, child) {
        return ListView.builder(
          itemCount: model.products.length,
          itemBuilder: (context, index) {
            final product = model.products[index];
            return ProductItem(product: product);
          },
        );
      },
    );
  }
}

class ProductItem extends StatelessWidget {
  final Product product;

  const ProductItem({Key? key, required this.product}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // 使用 Selector 只在特定产品状态变化时重建
    return Selector<ProductListModel, bool>(
      selector: (context, model) {
        // 只获取当前产品的收藏状态
        return model.products.firstWhere((p) => p.id == product.id).isFavorite;
      },
      builder: (context, isFavorite, child) {
        print('Product item ${product.id} rebuilt');
        return ListTile(
          title: Text(product.name),
          subtitle: Text('\$${product.price}'),
          trailing: IconButton(
            icon: Icon(
              isFavorite ? Icons.favorite : Icons.favorite_border,
              color: isFavorite ? Colors.red : null,
            ),
            onPressed: () {
              Provider.of<ProductListModel>(context, listen: false)
                  .toggleFavorite(product.id);
            },
          ),
        );
      },
    );
  }
}
```

## 4. Bloc 状态管理

Bloc (Business Logic Component) 是一种基于流的状态管理方案，将业务逻辑与 UI 分离，使应用状态变化可预测。

### 4.1 Bloc 基础使用

首先需要在 `pubspec.yaml` 中添加依赖：

```yaml
dependencies:
  flutter:
    sdk: flutter
  flutter_bloc: ^8.0.0
  equatable: ^2.0.0
```

#### 计数器示例

```dart
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';

// 事件类
abstract class CounterEvent extends Equatable {
  const CounterEvent();

  @override
  List<Object> get props => [];
}

class IncrementEvent extends CounterEvent {}

class DecrementEvent extends CounterEvent {}

// 状态类
class CounterState extends Equatable {
  final int count;

  const CounterState(this.count);

  @override
  List<Object> get props => [count];

  @override
  String toString() => 'CounterState(count: $count)';
}

// Bloc 类
class CounterBloc extends Bloc<CounterEvent, CounterState> {
  CounterBloc() : super(const CounterState(0)) {
    on<IncrementEvent>((event, emit) {
      emit(CounterState(state.count + 1));
    });
    on<DecrementEvent>((event, emit) {
      emit(CounterState(state.count - 1));
    });
  }
}

// Bloc 提供者
class CounterBlocExample extends StatelessWidget {
  const CounterBlocExample({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => CounterBloc(),
      child: const CounterPage(),
    );
  }
}

// 计数器页面
class CounterPage extends StatelessWidget {
  const CounterPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Bloc Counter')),
      body: const Center(child: CounterDisplay()),
      floatingActionButton: const CounterButtons(),
    );
  }
}

// 显示计数器
class CounterDisplay extends StatelessWidget {
  const CounterDisplay({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<CounterBloc, CounterState>(
      builder: (context, state) {
        return Text(
          'Count: ${state.count}',
          style: const TextStyle(fontSize: 24),
        );
      },
    );
  }
}

// 计数器按钮
class CounterButtons extends StatelessWidget {
  const CounterButtons({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.end,
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        FloatingActionButton(
          onPressed: () {
            context.read<CounterBloc>().add(IncrementEvent());
          },
          child: const Icon(Icons.add),
        ),
        const SizedBox(height: 8),
        FloatingActionButton(
          onPressed: () {
            context.read<CounterBloc>().add(DecrementEvent());
          },
          child: const Icon(Icons.remove),
        ),
      ],
    );
  }
}
```

### 4.2 复杂 Bloc 示例

```dart
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';

// 产品模型
class Product {
  final String id;
  final String name;
  final double price;

  const Product({required this.id, required this.name, required this.price});
}

// 购物车项目
class CartItem extends Equatable {
  final Product product;
  final int quantity;

  const CartItem({required this.product, required this.quantity});

  double get totalPrice => product.price * quantity;

  CartItem copyWith({int? quantity}) {
    return CartItem(
      product: product,
      quantity: quantity ?? this.quantity,
    );
  }

  @override
  List<Object> get props => [product.id, quantity];
}

// 事件类
abstract class CartEvent extends Equatable {
  const CartEvent();

  @override
  List<Object> get props => [];
}

class AddToCartEvent extends CartEvent {
  final Product product;

  const AddToCartEvent(this.product);

  @override
  List<Object> get props => [product];
}

class RemoveFromCartEvent extends CartEvent {
  final String productId;

  const RemoveFromCartEvent(this.productId);

  @override
  List<Object> get props => [productId];
}

class UpdateQuantityEvent extends CartEvent {
  final String productId;
  final int quantity;

  const UpdateQuantityEvent(this.productId, this.quantity);

  @override
  List<Object> get props => [productId, quantity];
}

class ClearCartEvent extends CartEvent {}

// 状态类
class CartState extends Equatable {
  final List<CartItem> items;
  final bool isLoading;
  final String? error;

  const CartState({
    this.items = const [],
    this.isLoading = false,
    this.error,
  });

  double get totalAmount {
    return items.fold(0.0, (sum, item) => sum + item.totalPrice);
  }

  int get itemCount {
    return items.fold(0, (sum, item) => sum + item.quantity);
  }

  CartState copyWith({
    List<CartItem>? items,
    bool? isLoading,
    String? error,
  }) {
    return CartState(
      items: items ?? this.items,
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
    );
  }

  @override
  List<Object?> get props => [items, isLoading, error];
}

// Bloc 类
class CartBloc extends Bloc<CartEvent, CartState> {
  CartBloc() : super(const CartState()) {
    on<AddToCartEvent>((event, emit) {
      final currentItems = List<CartItem>.from(state.items);
      final existingItemIndex = currentItems.indexWhere(
        (item) => item.product.id == event.product.id,
      );

      if (existingItemIndex >= 0) {
        // 产品已存在，增加数量
        currentItems[existingItemIndex] = CartItem(
          product: event.product,
          quantity: currentItems[existingItemIndex].quantity + 1,
        );
      } else {
        // 新产品，添加到购物车
        currentItems.add(CartItem(product: event.product, quantity: 1));
      }

      emit(state.copyWith(items: currentItems));
    });

    on<RemoveFromCartEvent>((event, emit) {
      final updatedItems = state.items
          .where((item) => item.product.id != event.productId)
          .toList();
      emit(state.copyWith(items: updatedItems));
    });

    on<UpdateQuantityEvent>((event, emit) {
      if (event.quantity <= 0) {
        // 如果数量小于等于0，移除商品
        add(RemoveFromCartEvent(event.productId));
        return;
      }

      final updatedItems = state.items
          .map((item) => item.product.id == event.productId
              ? item.copyWith(quantity: event.quantity)
              : item)
          .toList();
      emit(state.copyWith(items: updatedItems));
    });

    on<ClearCartEvent>((event, emit) {
      emit(state.copyWith(items: []));
    });
  }
}

// 产品列表 Bloc
class ProductListBloc extends Bloc<CartEvent, List<Product>> {
  ProductListBloc() : super([]) {
    // 初始化产品列表
    add(const CartEvent());
  }

  @override
  Stream<List<Product>> mapEventToState(CartEvent event) async* {
    yield [
      const Product(id: '1', name: 'Product 1', price: 10.0),
      const Product(id: '2', name: 'Product 2', price: 20.0),
      const Product(id: '3', name: 'Product 3', price: 30.0),
      const Product(id: '4', name: 'Product 4', price: 40.0),
      const Product(id: '5', name: 'Product 5', price: 50.0),
    ];
  }
}

// 多 Bloc 示例
class CartBlocExample extends StatelessWidget {
  const CartBlocExample({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (context) => CartBloc()),
        BlocProvider(create: (context) => ProductListBloc()),
      ],
      child: const ShoppingApp(),
    );
  }
}

class ShoppingApp extends StatelessWidget {
  const ShoppingApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Shopping App'),
        actions: [
          BlocBuilder<CartBloc, CartState>(
            builder: (context, state) {
              return Badge(
                label: Text(state.itemCount.toString()),
                child: IconButton(
                  icon: const Icon(Icons.shopping_cart),
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const CartScreen(),
                      ),
                    );
                  },
                ),
              );
            },
          ),
        ],
      ),
      body: const ProductListScreen(),
    );
  }
}

class ProductListScreen extends StatelessWidget {
  const ProductListScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ProductListBloc, List<Product>>(
      builder: (context, products) {
        return ListView.builder(
          itemCount: products.length,
          itemBuilder: (context, index) {
            final product = products[index];
            return Card(
              margin: const EdgeInsets.all(8),
              child: ListTile(
                title: Text(product.name),
                subtitle: Text('\$${product.price}'),
                trailing: ElevatedButton(
                  onPressed: () {
                    context.read<CartBloc>().add(AddToCartEvent(product));
                  },
                  child: const Text('Add to Cart'),
                ),
              ),
            );
          },
        );
      },
    );
  }
}

class CartScreen extends StatelessWidget {
  const CartScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Shopping Cart'),
        actions: [
          BlocBuilder<CartBloc, CartState>(
            builder: (context, state) {
              if (state.items.isEmpty) return const SizedBox();
              return TextButton(
                onPressed: () {
                  context.read<CartBloc>().add(ClearCartEvent());
                },
                child: const Text('Clear', style: TextStyle(color: Colors.white)),
              );
            },
          ),
        ],
      ),
      body: BlocBuilder<CartBloc, CartState>(
        builder: (context, state) {
          if (state.items.isEmpty) {
            return const Center(child: Text('Cart is empty'));
          }

          return Column(
            children: [
              Expanded(
                child: ListView.builder(
                  itemCount: state.items.length,
                  itemBuilder: (context, index) {
                    final item = state.items[index];
                    return ListTile(
                      title: Text(item.product.name),
                      subtitle: Text('\$${item.product.price} x ${item.quantity}'),
                      trailing: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          IconButton(
                            icon: const Icon(Icons.remove),
                            onPressed: () {
                              context.read<CartBloc>().add(UpdateQuantityEvent(
                                    item.product.id,
                                    item.quantity - 1,
                                  ));
                            },
                          ),
                          Text(item.quantity.toString()),
                          IconButton(
                            icon: const Icon(Icons.add),
                            onPressed: () {
                              context.read<CartBloc>().add(UpdateQuantityEvent(
                                    item.product.id,
                                    item.quantity + 1,
                                  ));
                            },
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),
              Card(
                margin: const EdgeInsets.all(16),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Total:', style: TextStyle(fontSize: 18)),
                      Text('\$${state.totalAmount.toStringAsFixed(2)}',
                          style: const TextStyle(
                              fontSize: 20, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
```

## 5. GetX 状态管理

GetX 是一个轻量级、功能丰富的状态管理框架，提供了依赖注入、路由管理、状态管理等功能。

### 5.1 GetX 基础使用

首先需要在 `pubspec.yaml` 中添加依赖：

```yaml
dependencies:
  flutter:
    sdk: flutter
  get: ^4.6.0
```

#### 计数器示例

```dart
import 'package:flutter/material.dart';
import 'package:get/get.dart';

// 控制器类
class CounterController extends GetxController {
  var count = 0.obs; // 使用 .obs 使变量成为可观察的

  void increment() {
    count++;
  }

  void decrement() {
    count--;
  }

  // 生命周期方法
  @override
  void onInit() {
    super.onInit();
    print('CounterController initialized');
  }

  @override
  void onClose() {
    super.onClose();
    print('CounterController closed');
  }
}

// GetX 示例页面
class GetXCounterExample extends StatelessWidget {
  GetXCounterExample({Key? key}) : super(key: key);

  // 创建控制器（方式1：在 Widget 中创建）
  final CounterController _controller = Get.put(CounterController());

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('GetX Counter')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // 方式1：使用 Obx 监听变化
            Obx(() {
              return Text(
                'Count: ${_controller.count}',
                style: const TextStyle(fontSize: 24),
              );
            }),
            const SizedBox(height: 16),
            // 方式2：使用 GetBuilder（性能更好，手动控制更新）
            GetBuilder<CounterController>(
              builder: (controller) {
                return Text(
                  'Count with GetBuilder: ${controller.count}',
                  style: const TextStyle(fontSize: 20),
                );
              },
            ),
          ],
        ),
      ),
      floatingActionButton: Column(
        mainAxisAlignment: MainAxisAlignment.end,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          FloatingActionButton(
            onPressed: _controller.increment,
            child: const Icon(Icons.add),
          ),
          const SizedBox(height: 8),
          FloatingActionButton(
            onPressed: _controller.decrement,
            child: const Icon(Icons.remove),
          ),
        ],
      ),
    );
  }
}
```

### 5.2 GetX 高级用法

```dart
import 'package:flutter/material.dart';
import 'package:get/get.dart';

// 用户模型
class User extends GetxController {
  var name = 'Guest'.obs;
  var email = ''.obs;
  var isLoggedIn = false.obs;

  void login(String username, String userEmail) {
    name.value = username;
    email.value = userEmail;
    isLoggedIn.value = true;
  }

  void logout() {
    name.value = 'Guest';
    email.value = '';
    isLoggedIn.value = false;
  }
}

// 购物车项目模型
class CartItem {
  final String id;
  final String name;
  final double price;
  RxInt quantity;

  CartItem({
    required this.id,
    required this.name,
    required this.price,
    required this.quantity,
  });

  double get totalPrice => price * quantity.value;
}

// 购物车控制器
class CartController extends GetxController {
  var items = <CartItem>[].obs;

  void addItem(String id, String name, double price) {
    final existingItemIndex = items.indexWhere((item) => item.id == id);
    if (existingItemIndex >= 0) {
      items[existingItemIndex].quantity++;
    } else {
      items.add(CartItem(id: id, name: name, price: price, quantity: 1.obs));
    }
  }

  void removeItem(String id) {
    items.removeWhere((item) => item.id == id);
  }

  void updateQuantity(String id, int quantity) {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    final item = items.firstWhereOrNull((item) => item.id == id);
    if (item != null) {
      item.quantity.value = quantity;
    }
  }

  void clearCart() {
    items.clear();
  }

  double get totalAmount {
    return items.fold(0.0, (sum, item) => sum + item.totalPrice);
  }

  int get itemCount {
    return items.fold(0, (sum, item) => sum + item.quantity.value);
  }
}

// 全局注入控制器
class GetXDependencyExample extends StatelessWidget {
  GetXDependencyExample({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // 全局注入控制器（在应用入口处调用一次即可）
    Get.put(User());
    Get.put(CartController());

    return Scaffold(
      appBar: AppBar(
        title: const Text('GetX Dependency Management'),
        actions: [
          // 购物车图标带数量
          GetBuilder<CartController>(
            builder: (controller) {
              return controller.itemCount > 0
                  ? Badge(
                      label: Text(controller.itemCount.toString()),
                      child: IconButton(
                        icon: const Icon(Icons.shopping_cart),
                        onPressed: () => Get.to(() => const CartScreen()),
                      ),
                    )
                  : IconButton(
                      icon: const Icon(Icons.shopping_cart),
                      onPressed: () => Get.to(() => const CartScreen()),
                    );
            },
          ),
        ],
      ),
      body: const Column(
        children: [
          UserSection(),
          Expanded(child: ProductSection()),
        ],
      ),
    );
  }
}

// 用户部分
class UserSection extends StatelessWidget {
  const UserSection({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.all(16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // 使用 GetX 监听用户状态
            GetX<User>(
              builder: (user) {
                return user.isLoggedIn.value
                    ? Column(
                        children: [
                          Text('Welcome, ${user.name}',
                              style: const TextStyle(fontSize: 18)),
                          Text('Email: ${user.email}'),
                          ElevatedButton(
                            onPressed: user.logout,
                            child: const Text('Logout'),
                          ),
                        ],
                      )
                    : LoginForm();
              },
            ),
          ],
        ),
      ),
    );
  }
}

// 登录表单
class LoginForm extends StatelessWidget {
  LoginForm({Key? key}) : super(key: key);
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final userController = Get.find<User>();

    return Column(
      children: [
        TextField(
          controller: _nameController,
          decoration: const InputDecoration(labelText: 'Name'),
        ),
        TextField(
          controller: _emailController,
          decoration: const InputDecoration(labelText: 'Email'),
        ),
        ElevatedButton(
          onPressed: () {
            if (_nameController.text.isNotEmpty &&
                _emailController.text.isNotEmpty) {
              userController.login(_nameController.text, _emailController.text);
            }
          },
          child: const Text('Login'),
        ),
      ],
    );
  }
}

// 产品部分
class ProductSection extends StatelessWidget {
  const ProductSection({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final cartController = Get.find<CartController>();
    final products = [
      {'id': '1', 'name': 'Product 1', 'price': 10.0},
      {'id': '2', 'name': 'Product 2', 'price': 20.0},
      {'id': '3', 'name': 'Product 3', 'price': 30.0},
      {'id': '4', 'name': 'Product 4', 'price': 40.0},
    ];

    return ListView.builder(
      itemCount: products.length,
      itemBuilder: (context, index) {
        final product = products[index];
        return Card(
          margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: ListTile(
            title: Text(product['name']!),
            subtitle: Text('\$${product['price']}'),
            trailing: ElevatedButton(
              onPressed: () {
                cartController.addItem(
                  product['id']!,
                  product['name']!,
                  product['price']!,
                );
                // 显示提示消息
                Get.snackbar(
                  'Success',
                  'Added to cart',
                  snackPosition: SnackPosition.BOTTOM,
                  duration: const Duration(seconds: 2),
                );
              },
              child: const Text('Add to Cart'),
            ),
          ),
        );
      },
    );
  }
}

// 购物车页面
class CartScreen extends StatelessWidget {
  const CartScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final cartController = Get.find<CartController>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Cart'),
        actions: [
          Obx(() {
            return cartController.items.isNotEmpty
                ? TextButton(
                    onPressed: cartController.clearCart,
                    child: const Text('Clear', style: TextStyle(color: Colors.white)),
                  )
                : const SizedBox();
          }),
        ],
      ),
      body: Obx(() {
        if (cartController.items.isEmpty) {
          return const Center(child: Text('Cart is empty'));
        }

        return Column(
          children: [
            Expanded(
              child: ListView.builder(
                itemCount: cartController.items.length,
                itemBuilder: (context, index) {
                  final item = cartController.items[index];
                  return ListTile(
                    title: Text(item.name),
                    subtitle: Text('\$${item.price} x ${item.quantity}'),
                    trailing: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        IconButton(
                          icon: const Icon(Icons.remove),
                          onPressed: () {
                            cartController.updateQuantity(
                                item.id, item.quantity.value - 1);
                          },
                        ),
                        Obx(() => Text(item.quantity.value.toString())),
                        IconButton(
                          icon: const Icon(Icons.add),
                          onPressed: () {
                            cartController.updateQuantity(
                                item.id, item.quantity.value + 1);
                          },
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
            Card(
              margin: const EdgeInsets.all(16),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Total:', style: TextStyle(fontSize: 18)),
                    Obx(() {
                      return Text(
                          '\$${cartController.totalAmount.toStringAsFixed(2)}',
                          style: const TextStyle(
                              fontSize: 20, fontWeight: FontWeight.bold));
                    }),
                  ],
                ),
              ),
            ),
          ],
        );
      }),
    );
  }
}
```

## 6. Riverpod 状态管理

Riverpod 是 Provider 的作者开发的新一代状态管理库，解决了 Provider 的一些限制，提供了更好的类型安全和更灵活的 API。

### 6.1 Riverpod 基础使用

首先需要在 `pubspec.yaml` 中添加依赖：

```yaml
dependencies:
  flutter:
    sdk: flutter
  flutter_riverpod: ^2.0.0
  riverpod: ^2.0.0
```

#### 计数器示例

```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

// 定义一个简单的 Provider（用于提供常量值）
final greetingProvider = Provider((ref) => 'Hello, Riverpod!');

// 定义一个 StateProvider（用于简单的状态管理）
final counterProvider = StateProvider<int>((ref) => 0);

// Riverpod 示例页面
class RiverpodCounterExample extends StatelessWidget {
  const RiverpodCounterExample({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ProviderScope(
      child: Scaffold(
        appBar: AppBar(title: const Text('Riverpod Counter')),
        body: const Center(child: CounterDisplay()),
        floatingActionButton: const CounterButtons(),
      ),
    );
  }
}

// 显示计数器
class CounterDisplay extends ConsumerWidget {
  const CounterDisplay({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // 读取计数器状态
    final count = ref.watch(counterProvider);
    final greeting = ref.watch(greetingProvider);

    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(greeting, style: const TextStyle(fontSize: 18)),
        const SizedBox(height: 16),
        Text('Count: $count', style: const TextStyle(fontSize: 24)),
      ],
    );
  }
}

// 计数器按钮
class CounterButtons extends ConsumerWidget {
  const CounterButtons({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.end,
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        FloatingActionButton(
          onPressed: () {
            // 更新计数器状态
            ref.read(counterProvider.notifier).state++;
          },
          child: const Icon(Icons.add),
        ),
        const SizedBox(height: 8),
        FloatingActionButton(
          onPressed: () {
            // 更新计数器状态
            ref.read(counterProvider.notifier).state--;
          },
          child: const Icon(Icons.remove),
        ),
      ],
    );
  }
}
```

### 6.2 Riverpod 高级用法

```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

// 产品模型
class Product {
  final String id;
  final String name;
  final double price;

  const Product({required this.id, required this.name, required this.price});
}

// 产品服务（模拟API）
class ProductService {
  Future<List<Product>> fetchProducts() async {
    // 模拟网络延迟
    await Future.delayed(const Duration(seconds: 1));
    return [
      const Product(id: '1', name: 'Product 1', price: 10.0),
      const Product(id: '2', name: 'Product 2', price: 20.0),
      const Product(id: '3', name: 'Product 3', price: 30.0),
    ];
  }
}

// 提供产品服务的 Provider
final productServiceProvider = Provider((ref) => ProductService());

// 使用 FutureProvider 获取产品列表
final productsProvider = FutureProvider<List<Product>>((ref) async {
  final service = ref.watch(productServiceProvider);
  return service.fetchProducts();
});

// 购物车项目
class CartItem {
  final Product product;
  int quantity;

  CartItem({required this.product, required this.quantity});

  double get totalPrice => product.price * quantity;
}

// 购物车状态
class CartState {
  final List<CartItem> items;

  const CartState(this.items);

  double get totalAmount => items.fold(0.0, (sum, item) => sum + item.totalPrice);
  int get itemCount => items.fold(0, (sum, item) => sum + item.quantity);
}

// 购物车状态管理的 Notifier
class CartNotifier extends Notifier<CartState> {
  @override
  CartState build() {
    return const CartState([]);
  }

  void addItem(Product product) {
    final currentItems = [...state.items];
    final existingIndex = currentItems.indexWhere((item) => item.product.id == product.id);

    if (existingIndex >= 0) {
      currentItems[existingIndex] = CartItem(
        product: product,
        quantity: currentItems[existingIndex].quantity + 1,
      );
    } else {
      currentItems.add(CartItem(product: product, quantity: 1));
    }

    state = CartState(currentItems);
  }

  void removeItem(String productId) {
    final newItems = state.items.where((item) => item.product.id != productId).toList();
    state = CartState(newItems);
  }

  void updateQuantity(String productId, int quantity) {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    final newItems = state.items.map((item) {
      if (item.product.id == productId) {
        return CartItem(product: item.product, quantity: quantity);
      }
      return item;
    }).toList();

    state = CartState(newItems);
  }

  void clearCart() {
    state = const CartState([]);
  }
}

// 购物车 Provider
final cartProvider = NotifierProvider<CartNotifier, CartState>(CartNotifier.new);

// Riverpod 高级示例
class RiverpodAdvancedExample extends StatelessWidget {
  const RiverpodAdvancedExample({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ProviderScope(
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Riverpod Advanced'),
          actions: [
            Consumer(
              builder: (context, ref, child) {
                final itemCount = ref.watch(cartProvider.select((state) => state.itemCount));
                return itemCount > 0
                    ? Badge(
                        label: Text(itemCount.toString()),
                        child: IconButton(
                          icon: const Icon(Icons.shopping_cart),
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => const CartScreen(),
                              ),
                            );
                          },
                        ),
                      )
                    : IconButton(
                        icon: const Icon(Icons.shopping_cart),
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const CartScreen(),
                            ),
                          );
                        },
                      );
              },
            ),
          ],
        ),
        body: const ProductListScreen(),
      ),
    );
  }
}

// 产品列表页面
class ProductListScreen extends ConsumerWidget {
  const ProductListScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // 监听产品列表数据
    final productsAsync = ref.watch(productsProvider);

    return productsAsync.when(
      data: (products) {
        return ListView.builder(
          itemCount: products.length,
          itemBuilder: (context, index) {
            final product = products[index];
            return Card(
              margin: const EdgeInsets.all(8),
              child: ListTile(
                title: Text(product.name),
                subtitle: Text('\$${product.price}'),
                trailing: ElevatedButton(
                  onPressed: () {
                    ref.read(cartProvider.notifier).addItem(product);
                  },
                  child: const Text('Add to Cart'),
                ),
              ),
            );
          },
        );
      },
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (error, stack) => Center(child: Text('Error: $error')),
    );
  }
}

// 购物车页面
class CartScreen extends ConsumerWidget {
  const CartScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final cart = ref.watch(cartProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Cart'),
        actions: [
          if (cart.items.isNotEmpty)
            TextButton(
              onPressed: () {
                ref.read(cartProvider.notifier).clearCart();
              },
              child: const Text('Clear', style: TextStyle(color: Colors.white)),
            ),
        ],
      ),
      body: cart.items.isEmpty
          ? const Center(child: Text('Cart is empty'))
          : Column(
              children: [
                Expanded(
                  child: ListView.builder(
                    itemCount: cart.items.length,
                    itemBuilder: (context, index) {
                      final item = cart.items[index];
                      return ListTile(
                        title: Text(item.product.name),
                        subtitle: Text('\$${item.product.price} x ${item.quantity}'),
                        trailing: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            IconButton(
                              icon: const Icon(Icons.remove),
                              onPressed: () {
                                ref
                                    .read(cartProvider.notifier)
                                    .updateQuantity(item.product.id, item.quantity - 1);
                              },
                            ),
                            Text(item.quantity.toString()),
                            IconButton(
                              icon: const Icon(Icons.add),
                              onPressed: () {
                                ref
                                    .read(cartProvider.notifier)
                                    .updateQuantity(item.product.id, item.quantity + 1);
                              },
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ),
                Card(
                  margin: const EdgeInsets.all(16),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Total:', style: TextStyle(fontSize: 18)),
                        Text('\$${cart.totalAmount.toStringAsFixed(2)}',
                            style: const TextStyle(
                                fontSize: 20, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ),
                ),
              ],
            ),
    );
  }
}
```

## 7. 状态管理最佳实践

### 7.1 选择合适的状态管理方案

- **简单状态**：使用 `setState`
- **中小型应用**：使用 Provider 或 GetX
- **大型复杂应用**：使用 Bloc 或 Riverpod
- **响应式编程爱好者**：使用 MobX

### 7.2 状态管理原则

1. **状态最小化**：只管理必要的状态
2. **状态提升**：将状态放在需要访问它的组件的共同祖先中
3. **单向数据流**：数据从顶层流向底层，事件从底层流向顶层
4. **关注点分离**：业务逻辑与 UI 分离
5. **避免过度设计**：根据项目规模选择合适的方案，不要过度复杂化

### 7.3 性能优化技巧

- **避免重建**：使用 Selector、consumer 等优化重建范围
- **惰性加载**：使用懒加载 Provider
- **缓存数据**：缓存频繁使用的数据
- **避免不必要的通知**：只在必要时通知状态变化

## 总结

Flutter 提供了多种状态管理方案，每种方案都有其优缺点和适用场景。选择合适的状态管理方案对于构建可维护、可扩展的应用至关重要。

- **setState**：简单易用，适用于单一组件内部状态
- **Provider**：官方推荐，基于 InheritedWidget，使用简单功能强大
- **Bloc**：基于流，可预测性强，适用于复杂应用
- **GetX**：轻量级、功能全面，开发效率高
- **Riverpod**：Provider 的升级版，更好的类型安全
- **MobX**：基于响应式编程，简洁高效

在实际开发中，应根据项目规模、团队熟悉度和具体需求选择合适的状态管理方案，并且遵循状态管理的最佳实践，以构建高质量的 Flutter 应用。