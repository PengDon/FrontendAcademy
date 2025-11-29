# Flutter 数据持久化

本目录包含 Flutter 中数据持久化相关的示例代码和详细说明。在移动应用开发中，数据持久化是一个重要的需求，它允许应用在关闭后仍然能够保存和恢复用户数据。

## 1. 数据持久化概述

Flutter 提供了多种数据持久化方案，每种方案都有其适用的场景：

1. **SharedPreferences**：适合存储简单的键值对数据
2. **SQLite**：适合存储结构化数据和复杂查询
3. **Hive**：高性能的 NoSQL 数据库，适合移动应用
4. **文件存储**：直接读写文件系统
5. **Firebase**：云数据库解决方案

## 2. SharedPreferences

SharedPreferences 是一个轻量级的键值存储，适合存储简单的数据如用户设置、应用配置等。

### 2.1 添加依赖

```yaml
dependencies:
  flutter:
    sdk: flutter
  shared_preferences: ^2.0.13
```

### 2.2 基本使用

```dart
import 'package:shared_preferences/shared_preferences.dart';

class SharedPreferencesExample {
  // 保存数据
  Future<void> saveData() async {
    // 获取 SharedPreferences 实例
    final prefs = await SharedPreferences.getInstance();
    
    // 保存不同类型的数据
    await prefs.setString('username', 'john_doe');
    await prefs.setInt('userId', 123);
    await prefs.setDouble('score', 98.5);
    await prefs.setBool('isLoggedIn', true);
    
    // 保存字符串列表
    await prefs.setStringList('favoriteColors', ['red', 'blue', 'green']);
    
    print('Data saved successfully');
  }
  
  // 读取数据
  Future<void> readData() async {
    // 获取 SharedPreferences 实例
    final prefs = await SharedPreferences.getInstance();
    
    // 读取数据（提供默认值）
    final username = prefs.getString('username') ?? 'Guest';
    final userId = prefs.getInt('userId') ?? 0;
    final score = prefs.getDouble('score') ?? 0.0;
    final isLoggedIn = prefs.getBool('isLoggedIn') ?? false;
    final favoriteColors = prefs.getStringList('favoriteColors') ?? [];
    
    print('Username: $username');
    print('User ID: $userId');
    print('Score: $score');
    print('Is Logged In: $isLoggedIn');
    print('Favorite Colors: $favoriteColors');
  }
  
  // 检查键是否存在
  Future<bool> checkIfKeyExists(String key) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.containsKey(key);
  }
  
  // 删除数据
  Future<void> removeData(String key) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(key);
    print('Removed data for key: $key');
  }
  
  // 清除所有数据
  Future<void> clearAllData() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    print('All data cleared');
  }
}
```

### 2.3 实际应用示例

```dart
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({Key? key}) : super(key: key);

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _darkMode = false;
  String _language = 'en';
  bool _notifications = true;
  
  @override
  void initState() {
    super.initState();
    _loadSettings();
  }
  
  // 从 SharedPreferences 加载设置
  Future<void> _loadSettings() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _darkMode = prefs.getBool('darkMode') ?? false;
      _language = prefs.getString('language') ?? 'en';
      _notifications = prefs.getBool('notifications') ?? true;
    });
  }
  
  // 保存设置到 SharedPreferences
  Future<void> _saveSettings() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('darkMode', _darkMode);
    await prefs.setString('language', _language);
    await prefs.setBool('notifications', _notifications);
    
    // 显示保存成功提示
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Settings saved')),
    );
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings'),
      ),
      body: ListView(
        children: [
          SwitchListTile(
            title: const Text('Dark Mode'),
            value: _darkMode,
            onChanged: (value) {
              setState(() {
                _darkMode = value;
              });
              _saveSettings();
            },
          ),
          ListTile(
            title: const Text('Language'),
            subtitle: Text(_language.toUpperCase()),
            onTap: () {
              // 打开语言选择器
              _showLanguageDialog();
            },
          ),
          SwitchListTile(
            title: const Text('Notifications'),
            value: _notifications,
            onChanged: (value) {
              setState(() {
                _notifications = value;
              });
              _saveSettings();
            },
          ),
        ],
      ),
    );
  }
  
  // 显示语言选择对话框
  void _showLanguageDialog() {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Select Language'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                title: const Text('English'),
                onTap: () {
                  setState(() {
                    _language = 'en';
                  });
                  _saveSettings();
                  Navigator.pop(context);
                },
              ),
              ListTile(
                title: const Text('Español'),
                onTap: () {
                  setState(() {
                    _language = 'es';
                  });
                  _saveSettings();
                  Navigator.pop(context);
                },
              ),
              ListTile(
                title: const Text('中文'),
                onTap: () {
                  setState(() {
                    _language = 'zh';
                  });
                  _saveSettings();
                  Navigator.pop(context);
                },
              ),
            ],
          ),
        );
      },
    );
  }
}
```

## 3. SQLite 数据库

SQLite 是一个功能强大的关系型数据库，适合存储复杂的结构化数据。

### 3.1 添加依赖

```yaml
dependencies:
  flutter:
    sdk: flutter
  sqflite: ^2.0.2
  path: ^1.8.0
```

### 3.2 基本使用

```dart
import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

class SQLiteExample {
  Database? _database;
  
  // 初始化数据库
  Future<void> initDatabase() async {
    // 获取数据库路径
    String databasePath = await getDatabasesPath();
    String path = join(databasePath, 'example_database.db');
    
    // 打开数据库，如果不存在则创建
    _database = await openDatabase(
      path,
      version: 1,
      onCreate: (db, version) {
        // 创建表
        return db.execute(
          'CREATE TABLE users(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, age INTEGER)',
        );
      },
    );
    
    print('Database initialized');
  }
  
  // 插入数据
  Future<void> insertUser(String name, String email, int age) async {
    if (_database == null) {
      await initDatabase();
    }
    
    await _database!.insert(
      'users',
      {'name': name, 'email': email, 'age': age},
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
    
    print('User inserted');
  }
  
  // 查询所有用户
  Future<List<Map<String, dynamic>>> getAllUsers() async {
    if (_database == null) {
      await initDatabase();
    }
    
    return await _database!.query('users');
  }
  
  // 根据ID查询用户
  Future<Map<String, dynamic>?> getUserById(int id) async {
    if (_database == null) {
      await initDatabase();
    }
    
    List<Map<String, dynamic>> results = await _database!.query(
      'users',
      where: 'id = ?',
      whereArgs: [id],
    );
    
    return results.isNotEmpty ? results.first : null;
  }
  
  // 更新用户
  Future<void> updateUser(int id, String name, String email, int age) async {
    if (_database == null) {
      await initDatabase();
    }
    
    await _database!.update(
      'users',
      {'name': name, 'email': email, 'age': age},
      where: 'id = ?',
      whereArgs: [id],
    );
    
    print('User updated');
  }
  
  // 删除用户
  Future<void> deleteUser(int id) async {
    if (_database == null) {
      await initDatabase();
    }
    
    await _database!.delete(
      'users',
      where: 'id = ?',
      whereArgs: [id],
    );
    
    print('User deleted');
  }
  
  // 高级查询
  Future<List<Map<String, dynamic>>> getUsersByAge(int minAge, int maxAge) async {
    if (_database == null) {
      await initDatabase();
    }
    
    return await _database!.rawQuery(
      'SELECT * FROM users WHERE age >= ? AND age <= ? ORDER BY age ASC',
      [minAge, maxAge],
    );
  }
  
  // 关闭数据库
  Future<void> closeDatabase() async {
    if (_database != null) {
      await _database!.close();
      _database = null;
      print('Database closed');
    }
  }
}
```

### 3.3 高级数据库操作

```dart
import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

class AdvancedSQLiteExample {
  Database? _database;
  static const String databaseName = 'advanced_example.db';
  static const int databaseVersion = 2; // 增加版本号以支持数据库迁移
  
  // 数据库表名
  static const String tableUsers = 'users';
  static const String tableProducts = 'products';
  static const String tableOrders = 'orders';
  static const String tableOrderItems = 'order_items';
  
  // 初始化数据库
  Future<void> initDatabase() async {
    String databasePath = await getDatabasesPath();
    String path = join(databasePath, databaseName);
    
    _database = await openDatabase(
      path,
      version: databaseVersion,
      onCreate: _onCreate,
      onUpgrade: _onUpgrade, // 添加数据库升级处理
    );
    
    print('Advanced database initialized');
  }
  
  // 创建数据库表
  Future<void> _onCreate(Database db, int version) async {
    // 创建用户表
    await db.execute('''
      CREATE TABLE $tableUsers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    ''');
    
    // 创建产品表
    await db.execute('''
      CREATE TABLE $tableProducts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        stock INTEGER DEFAULT 0
      )
    ''');
    
    // 创建订单表
    await db.execute('''
      CREATE TABLE $tableOrders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        total_amount REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES $tableUsers (id)
      )
    ''');
    
    // 创建订单项表
    await db.execute('''
      CREATE TABLE $tableOrderItems (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES $tableOrders (id),
        FOREIGN KEY (product_id) REFERENCES $tableProducts (id)
      )
    ''');
    
    print('Database tables created');
  }
  
  // 数据库升级处理
  Future<void> _onUpgrade(Database db, int oldVersion, int newVersion) async {
    if (oldVersion < 2) {
      // 从版本1升级到版本2
      // 添加新的列或表
      await db.execute('''
        ALTER TABLE $tableUsers 
        ADD COLUMN last_login TIMESTAMP
      ''');
      
      // 为产品表添加新的索引
      await db.execute('''
        CREATE INDEX idx_products_name 
        ON $tableProducts (name)
      ''');
      
      print('Database upgraded from version $oldVersion to $newVersion');
    }
  }
  
  // 事务处理
  Future<void> createOrderWithItems(int userId, List<Map<String, dynamic>> items) async {
    if (_database == null) {
      await initDatabase();
    }
    
    // 开始事务
    await _database!.transaction((txn) async {
      // 计算订单总金额
      double totalAmount = 0.0;
      for (var item in items) {
        totalAmount += (item['price'] as double) * (item['quantity'] as int);
      }
      
      // 创建订单
      int orderId = await txn.insert(
        tableOrders,
        {'user_id': userId, 'total_amount': totalAmount},
      );
      
      // 添加订单项
      for (var item in items) {
        await txn.insert(
          tableOrderItems,
          {
            'order_id': orderId,
            'product_id': item['product_id'],
            'quantity': item['quantity'],
            'price': item['price'],
          },
        );
        
        // 更新产品库存
        await txn.rawUpdate(
          'UPDATE $tableProducts SET stock = stock - ? WHERE id = ?',
          [item['quantity'], item['product_id']],
        );
      }
    });
    
    print('Order with items created successfully');
  }
  
  // 复杂查询 - 获取订单详情
  Future<List<Map<String, dynamic>>> getOrderDetails(int orderId) async {
    if (_database == null) {
      await initDatabase();
    }
    
    return await _database!.rawQuery('''
      SELECT 
        o.id as order_id,
        o.total_amount,
        o.status,
        o.created_at,
        u.username,
        p.id as product_id,
        p.name as product_name,
        oi.quantity,
        oi.price as item_price
      FROM $tableOrders o
      JOIN $tableUsers u ON o.user_id = u.id
      JOIN $tableOrderItems oi ON o.id = oi.order_id
      JOIN $tableProducts p ON oi.product_id = p.id
      WHERE o.id = ?
      ORDER BY oi.id
    ''', [orderId]);
  }
  
  // 批量插入
  Future<void> batchInsertProducts(List<Map<String, dynamic>> products) async {
    if (_database == null) {
      await initDatabase();
    }
    
    // 使用批处理提高性能
    final batch = _database!.batch();
    
    for (var product in products) {
      batch.insert(tableProducts, product);
    }
    
    // 执行批处理
    await batch.commit();
    
    print('Batch inserted ${products.length} products');
  }
  
  // 获取数据库信息
  Future<Map<String, dynamic>> getDatabaseInfo() async {
    if (_database == null) {
      await initDatabase();
    }
    
    final tables = await _database!.rawQuery(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'",
    );
    
    final info = {
      'database_name': databaseName,
      'database_version': databaseVersion,
      'tables': [],
    };
    
    for (var table in tables) {
      final tableName = table['name'] as String;
      final count = Sqflite.firstIntValue(await _database!.rawQuery(
        'SELECT COUNT(*) FROM $tableName',
      ));
      
      info['tables'].add({
        'name': tableName,
        'row_count': count,
      });
    }
    
    return info;
  }
  
  // 关闭数据库
  Future<void> closeDatabase() async {
    if (_database != null) {
      await _database!.close();
      _database = null;
      print('Advanced database closed');
    }
  }
}
```

## 4. Hive 数据库

Hive 是一个轻量级、高性能的 NoSQL 数据库，专为移动应用和 Flutter 设计。

### 4.1 添加依赖

```yaml
dependencies:
  flutter:
    sdk: flutter
  hive: ^2.2.3
  hive_flutter: ^1.1.0

# 开发依赖
dev_dependencies:
  hive_generator: ^1.1.3
  build_runner: ^2.1.11
```

### 4.2 基本使用

```dart
import 'package:hive/hive.dart';
import 'package:path_provider/path_provider.dart';

class HiveExample {
  // 初始化 Hive
  Future<void> initHive() async {
    // 获取应用文档目录
    final directory = await getApplicationDocumentsDirectory();
    // 初始化 Hive
    Hive.init(directory.path);
    
    print('Hive initialized');
  }
  
  // 打开和使用简单的盒子（box）
  Future<void> useSimpleBox() async {
    // 打开一个名为 'settings' 的盒子
    final settingsBox = await Hive.openBox('settings');
    
    // 存储数据
    settingsBox.put('username', 'flutter_user');
    settingsBox.put('darkMode', false);
    settingsBox.put('fontSize', 16.0);
    settingsBox.put('favoriteColors', ['red', 'blue']);
    
    // 读取数据
    final username = settingsBox.get('username', defaultValue: 'Guest');
    final darkMode = settingsBox.get('darkMode', defaultValue: false);
    final fontSize = settingsBox.get('fontSize', defaultValue: 14.0);
    final favoriteColors = settingsBox.get('favoriteColors', defaultValue: <String>[]);
    
    print('Username: $username');
    print('Dark Mode: $darkMode');
    print('Font Size: $fontSize');
    print('Favorite Colors: $favoriteColors');
    
    // 检查键是否存在
    final hasNotification = settingsBox.containsKey('notifications');
    print('Has notifications setting: $hasNotification');
    
    // 删除数据
    if (hasNotification) {
      settingsBox.delete('notifications');
    }
    
    // 列出所有键
    final keys = settingsBox.keys;
    print('All keys: $keys');
    
    // 关闭盒子
    await settingsBox.close();
  }
  
  // 使用 Hive 存储对象
  Future<void> storeObjects() async {
    // 打开一个名为 'users' 的盒子
    final usersBox = await Hive.openBox('users');
    
    // 存储用户对象（Map 格式）
    final user1 = {
      'id': 1,
      'name': 'John Doe',
      'email': 'john@example.com',
      'age': 30,
      'active': true,
      'lastLogin': DateTime.now().toIso8601String(),
    };
    
    final user2 = {
      'id': 2,
      'name': 'Jane Smith',
      'email': 'jane@example.com',
      'age': 25,
      'active': true,
      'lastLogin': DateTime.now().subtract(Duration(days: 2)).toIso8601String(),
    };
    
    // 存储用户
    await usersBox.put(user1['id'], user1);
    await usersBox.put(user2['id'], user2);
    
    // 获取单个用户
    final user = usersBox.get(1);
    print('User 1: $user');
    
    // 获取所有用户
    final allUsers = usersBox.values.toList();
    print('All users: $allUsers');
    
    // 关闭盒子
    await usersBox.close();
  }
  
  // 批量操作
  Future<void> batchOperations() async {
    final productsBox = await Hive.openBox('products');
    
    // 开始批处理
    final batch = productsBox.batch();
    
    // 添加多个操作
    batch.put(101, {'id': 101, 'name': 'Product A', 'price': 9.99});
    batch.put(102, {'id': 102, 'name': 'Product B', 'price': 19.99});
    batch.put(103, {'id': 103, 'name': 'Product C', 'price': 29.99});
    
    // 提交批处理
    await batch.commit();
    
    print('Batch operations completed');
    
    // 关闭盒子
    await productsBox.close();
  }
  
  // 清除盒子数据
  Future<void> clearBox() async {
    final tempBox = await Hive.openBox('temporary_data');
    
    // 添加一些测试数据
    tempBox.put('test1', 'value1');
    tempBox.put('test2', 'value2');
    
    // 清除所有数据
    await tempBox.clear();
    
    print('Box cleared, contains ${tempBox.length} items');
    
    // 关闭盒子
    await tempBox.close();
  }
  
  // 删除盒子
  Future<void> deleteBox() async {
    // 确保盒子已关闭
    if (Hive.isBoxOpen('temp_box')) {
      await Hive.box('temp_box').close();
    }
    
    // 删除盒子
    await Hive.deleteBoxFromDisk('temp_box');
    
    print('Box deleted from disk');
  }
}
```

### 4.3 使用 Hive 类型适配器

Hive 支持类型适配器，可以更方便地存储和检索 Dart 对象。

#### 4.3.1 定义模型类

创建一个名为 `person.dart` 的文件：

```dart
import 'package:hive/hive.dart';

part 'person.g.dart'; // 这将由 hive_generator 生成

@HiveType(typeId: 0)
class Person {
  @HiveField(0)
  final String name;
  
  @HiveField(1)
  final int age;
  
  @HiveField(2)
  final String email;
  
  @HiveField(3)
  final List<String> hobbies;
  
  @HiveField(4)
  final DateTime? birthday;
  
  @HiveField(5, defaultValue: false)
  final bool isActive;

  Person({
    required this.name,
    required this.age,
    required this.email,
    required this.hobbies,
    this.birthday,
    this.isActive = false,
  });

  @override
  String toString() {
    return 'Person(name: $name, age: $age, email: $email, hobbies: $hobbies, birthday: $birthday, isActive: $isActive)';
  }
}
```

#### 4.3.2 生成类型适配器

运行以下命令生成类型适配器：

```bash
flutter pub run build_runner build
```

#### 4.3.3 使用类型适配器

```dart
import 'package:hive/hive.dart';
import 'package:path_provider/path_provider.dart';
import 'person.dart'; // 导入我们的模型类

class HiveTypeAdapterExample {
  // 初始化 Hive 并注册适配器
  Future<void> initHiveWithAdapters() async {
    // 获取应用文档目录
    final directory = await getApplicationDocumentsDirectory();
    Hive.init(directory.path);
    
    // 注册类型适配器
    Hive.registerAdapter(PersonAdapter());
    
    print('Hive initialized with adapters');
  }
  
  // 使用类型化盒子
  Future<void> useTypedBox() async {
    // 打开一个类型化的盒子
    final peopleBox = await Hive.openBox<Person>('people');
    
    // 创建 Person 对象
    final person1 = Person(
      name: 'John Doe',
      age: 30,
      email: 'john@example.com',
      hobbies: ['reading', 'swimming', 'coding'],
      birthday: DateTime(1993, 5, 15),
      isActive: true,
    );
    
    final person2 = Person(
      name: 'Jane Smith',
      age: 25,
      email: 'jane@example.com',
      hobbies: ['painting', 'hiking'],
      birthday: DateTime(1998, 10, 22),
    );
    
    // 存储对象
    await peopleBox.put(1, person1);
    await peopleBox.put(2, person2);
    
    // 获取对象
    final retrievedPerson = peopleBox.get(1);
    print('Retrieved person: $retrievedPerson');
    
    // 对象类型是 Person，而不是 Map
    print('Type of retrieved object: ${retrievedPerson.runtimeType}');
    
    // 获取所有对象
    final allPeople = peopleBox.values.toList();
    print('All people count: ${allPeople.length}');
    allPeople.forEach((person) => print('- $person'));
    
    // 查询 - 查找活跃用户
    final activePeople = allPeople.where((person) => person.isActive).toList();
    print('Active people: $activePeople');
    
    // 更新对象
    if (retrievedPerson != null) {
      final updatedPerson = Person(
        name: retrievedPerson.name,
        age: retrievedPerson.age,
        email: 'john.doe@example.com', // 更新邮箱
        hobbies: retrievedPerson.hobbies..add('gaming'), // 添加新爱好
        birthday: retrievedPerson.birthday,
        isActive: retrievedPerson.isActive,
      );
      await peopleBox.put(1, updatedPerson);
      print('Updated person: ${peopleBox.get(1)}');
    }
    
    // 删除对象
    await peopleBox.delete(2);
    print('After deletion, people count: ${peopleBox.length}');
    
    // 关闭盒子
    await peopleBox.close();
  }
  
  // 使用盒子监听器
  Future<void> useBoxListener() async {
    final settingsBox = await Hive.openBox('settings');
    
    // 添加监听器
    final listener = settingsBox.listenable();
    
    // 订阅变化
    final subscription = listener.addListener(() {
      print('Settings box changed!');
      print('Dark mode: ${settingsBox.get('darkMode')}');
    });
    
    // 修改数据以触发监听器
    await Future.delayed(Duration(seconds: 1));
    await settingsBox.put('darkMode', true);
    
    await Future.delayed(Duration(seconds: 1));
    await settingsBox.put('fontSize', 18.0);
    
    // 取消订阅
    subscription.cancel();
    
    // 关闭盒子
    await settingsBox.close();
  }
}
```

## 5. 文件存储

直接使用 Flutter 的文件系统 API 进行数据存储。

### 5.1 基本文件操作

```dart
import 'dart:io';
import 'dart:convert';
import 'package:path_provider/path_provider.dart';

class FileStorageExample {
  // 获取应用目录
  Future<void> getApplicationDirectories() async {
    // 文档目录 - 对用户可见，备份时会包含
    final documentsDirectory = await getApplicationDocumentsDirectory();
    print('Documents directory: ${documentsDirectory.path}');
    
    // 临时目录 - 可能被系统清理
    final tempDirectory = await getTemporaryDirectory();
    print('Temporary directory: ${tempDirectory.path}');
    
    // 应用支持目录 - 对用户不可见
    final supportDirectory = await getApplicationSupportDirectory();
    print('Support directory: ${supportDirectory.path}');
    
    // 外部存储目录 (仅在 Android 上可用)
    if (Platform.isAndroid) {
      final externalDirectory = await getExternalStorageDirectory();
      if (externalDirectory != null) {
        print('External directory: ${externalDirectory.path}');
      }
    }
  }
  
  // 写入文本文件
  Future<void> writeTextFile() async {
    try {
      // 获取文档目录
      final directory = await getApplicationDocumentsDirectory();
      // 创建文件路径
      final filePath = '${directory.path}/notes.txt';
      // 创建文件
      final file = File(filePath);
      
      // 写入内容
      await file.writeAsString('Hello, Flutter!\nThis is a text file example.');
      print('Text file created at: $filePath');
    } catch (e) {
      print('Error writing text file: $e');
    }
  }
  
  // 读取文本文件
  Future<void> readTextFile() async {
    try {
      // 获取文档目录
      final directory = await getApplicationDocumentsDirectory();
      // 文件路径
      final filePath = '${directory.path}/notes.txt';
      // 创建文件对象
      final file = File(filePath);
      
      // 检查文件是否存在
      if (await file.exists()) {
        // 读取内容
        final contents = await file.readAsString();
        print('File contents:\n$contents');
      } else {
        print('File does not exist');
      }
    } catch (e) {
      print('Error reading text file: $e');
    }
  }
  
  // 追加内容到文件
  Future<void> appendToFile() async {
    try {
      // 获取文档目录
      final directory = await getApplicationDocumentsDirectory();
      // 文件路径
      final filePath = '${directory.path}/notes.txt';
      // 创建文件对象
      final file = File(filePath);
      
      // 追加内容
      await file.writeAsString('\nThis is appended content.', mode: FileMode.append);
      print('Content appended to file');
      
      // 读取更新后的内容
      final contents = await file.readAsString();
      print('Updated file contents:\n$contents');
    } catch (e) {
      print('Error appending to file: $e');
    }
  }
  
  // 写入和读取 JSON 文件
  Future<void> writeAndReadJsonFile() async {
    try {
      // 获取文档目录
      final directory = await getApplicationDocumentsDirectory();
      // JSON 文件路径
      final filePath = '${directory.path}/user_profile.json';
      // 创建文件对象
      final file = File(filePath);
      
      // 用户数据
      final userData = {
        'id': 1,
        'name': 'John Doe',
        'email': 'john@example.com',
        'age': 30,
        'address': {
          'street': '123 Main St',
          'city': 'Any City',
          'country': 'Any Country',
        },
        'hobbies': ['reading', 'swimming', 'coding'],
        'created_at': DateTime.now().toIso8601String(),
      };
      
      // 将数据转换为 JSON 字符串并写入文件
      await file.writeAsString(jsonEncode(userData));
      print('JSON file created at: $filePath');
      
      // 读取 JSON 文件
      final jsonString = await file.readAsString();
      // 解析 JSON 字符串
      final parsedData = jsonDecode(jsonString);
      print('Parsed JSON data:');
      print('Name: ${parsedData['name']}');
      print('Email: ${parsedData['email']}');
      print('City: ${parsedData['address']['city']}');
      print('Hobbies: ${parsedData['hobbies']}');
    } catch (e) {
      print('Error handling JSON file: $e');
    }
  }
  
  // 创建和列出目录
  Future<void> manageDirectories() async {
    try {
      // 获取文档目录
      final documentsDirectory = await getApplicationDocumentsDirectory();
      // 创建一个子目录
      final appDataDirectory = Directory('${documentsDirectory.path}/app_data');
      
      // 检查目录是否存在，如果不存在则创建
      if (!await appDataDirectory.exists()) {
        await appDataDirectory.create(recursive: true);
        print('Created directory: ${appDataDirectory.path}');
      }
      
      // 在子目录中创建文件
      final settingsFile = File('${appDataDirectory.path}/settings.json');
      await settingsFile.writeAsString(jsonEncode({'theme': 'light', 'notifications': true}));
      
      // 列出目录内容
      final directoryContents = appDataDirectory.listSync();
      print('Directory contents:');
      directoryContents.forEach((item) {
        print('- ${item.path} (${item is Directory ? 'Directory' : 'File'})');
      });
    } catch (e) {
      print('Error managing directories: $e');
    }
  }
  
  // 删除文件
  Future<void> deleteFile() async {
    try {
      // 获取文档目录
      final directory = await getApplicationDocumentsDirectory();
      // 文件路径
      final filePath = '${directory.path}/notes.txt';
      // 创建文件对象
      final file = File(filePath);
      
      // 检查文件是否存在
      if (await file.exists()) {
        // 删除文件
        await file.delete();
        print('File deleted: $filePath');
      } else {
        print('File does not exist: $filePath');
      }
    } catch (e) {
      print('Error deleting file: $e');
    }
  }
}
```

### 5.2 高级文件操作

```dart
import 'dart:io';
import 'dart:convert';
import 'package:path_provider/path_provider.dart';

class AdvancedFileOperations {
  // 文件备份
  Future<void> backupFile() async {
    try {
      // 获取文档目录
      final directory = await getApplicationDocumentsDirectory();
      final sourceFile = File('${directory.path}/user_profile.json');
      
      // 检查源文件是否存在
      if (await sourceFile.exists()) {
        // 创建备份目录
        final backupDir = Directory('${directory.path}/backups');
        if (!await backupDir.exists()) {
          await backupDir.create(recursive: true);
        }
        
        // 创建带时间戳的备份文件名
        final timestamp = DateTime.now().millisecondsSinceEpoch;
        final backupFile = File('${backupDir.path}/user_profile_$timestamp.json');
        
        // 复制文件
        await sourceFile.copy(backupFile.path);
        print('File backed up to: ${backupFile.path}');
      } else {
        print('Source file does not exist');
      }
    } catch (e) {
      print('Error backing up file: $e');
    }
  }
  
  // 文件加密（简单示例）
  Future<void> encryptAndDecryptFile() async {
    try {
      // 获取文档目录
      final directory = await getApplicationDocumentsDirectory();
      final dataFile = File('${directory.path}/sensitive_data.txt');
      final encryptedFile = File('${directory.path}/sensitive_data.enc');
      
      // 示例：简单的字符位移加密
      String encrypt(String text, int key) {
        return String.fromCharCodes(
          text.codeUnits.map((unit) => unit + key),
        );
      }
      
      String decrypt(String text, int key) {
        return String.fromCharCodes(
          text.codeUnits.map((unit) => unit - key),
        );
      }
      
      // 创建测试文件
      const originalData = 'This is sensitive information!';
      await dataFile.writeAsString(originalData);
      
      // 加密文件
      final data = await dataFile.readAsString();
      final encryptedData = encrypt(data, 3); // 简单的位移加密
      await encryptedFile.writeAsString(encryptedData);
      
      print('Original data: $originalData');
      print('Encrypted data: $encryptedData');
      
      // 解密文件
      final encryptedContent = await encryptedFile.readAsString();
      final decryptedContent = decrypt(encryptedContent, 3);
      print('Decrypted data: $decryptedContent');
      
      // 注意：实际应用中应使用专业的加密库，如 encrypt 或 pointycastle
    } catch (e) {
      print('Error with file encryption: $e');
    }
  }
  
  // 文件压缩（示例）
  Future<void> simulateCompression() async {
    try {
      // 获取文档目录
      final directory = await getApplicationDocumentsDirectory();
      final largeFile = File('${directory.path}/large_data.txt');
      final compressedFile = File('${directory.path}/large_data_compressed.txt');
      
      // 创建一个大文件进行演示
      final largeContent = 'x' * 1000000; // 1MB 的数据
      await largeFile.writeAsString(largeContent);
      
      // 获取文件大小
      final originalSize = (await largeFile.length()) / 1024; // KB
      print('Original file size: ${originalSize.toStringAsFixed(2)} KB');
      
      // 简单的压缩模拟（实际应用中应使用专业的压缩库）
      // 这里只是将重复内容用计数替代
      String simpleCompress(String data) {
        if (data.isEmpty) return '';
        
        StringBuffer result = StringBuffer();
        int count = 1;
        String currentChar = data[0];
        
        for (int i = 1; i < data.length; i++) {
          if (data[i] == currentChar) {
            count++;
          } else {
            result.write('$currentChar$count');
            currentChar = data[i];
            count = 1;
          }
        }
        
        result.write('$currentChar$count');
        return result.toString();
      }
      
      // 压缩文件
      final data = await largeFile.readAsString();
      final compressedData = simpleCompress(data);
      await compressedFile.writeAsString(compressedData);
      
      // 获取压缩后文件大小
      final compressedSize = (await compressedFile.length()) / 1024; // KB
      print('Compressed file size: ${compressedSize.toStringAsFixed(2)} KB');
      print('Compression ratio: ${(originalSize / compressedSize).toStringAsFixed(2)}x');
      
      // 注意：实际应用中应使用专业的压缩库，如 archive
    } catch (e) {
      print('Error with file compression: $e');
    }
  }
  
  // 监控文件变化
  Future<void> monitorFileChanges() async {
    try {
      // 获取文档目录
      final directory = await getApplicationDocumentsDirectory();
      final watchFile = File('${directory.path}/watch_me.txt');
      
      // 创建文件（如果不存在）
      if (!await watchFile.exists()) {
        await watchFile.writeAsString('Initial content');
      }
      
      print('Monitoring file: ${watchFile.path}');
      print('Make changes to this file to see notifications.');
      
      // 开始监控文件系统
      final fileStream = directory.watch(
        events: FileSystemEvent.modify,
        recursive: true,
      );
      
      // 监听变化
      final subscription = fileStream.listen((event) {
        if (event.path == watchFile.path) {
          print('File modified at: ${DateTime.now()}');
          _readFileContent(watchFile);
        }
      });
      
      // 模拟文件修改
      Future.delayed(Duration(seconds: 2), () async {
        await watchFile.writeAsString('Content modified at ${DateTime.now()}', mode: FileMode.append);
      });
      
      // 保持程序运行一段时间以观察变化
      await Future.delayed(Duration(seconds: 5));
      
      // 取消订阅
      subscription.cancel();
      print('Stopped monitoring file changes');
    } catch (e) {
      print('Error monitoring file changes: $e');
    }
  }
  
  // 读取文件内容的辅助方法
  Future<void> _readFileContent(File file) async {
    try {
      final content = await file.readAsString();
      print('File content: $content');
    } catch (e) {
      print('Error reading file content: $e');
    }
  }
  
  // 文件系统空间检查
  Future<void> checkFileSystemSpace() async {
    try {
      // 获取文档目录
      final directory = await getApplicationDocumentsDirectory();
      
      // 获取文件系统信息
      final stat = await directory.stat();
      print('Directory info:');
      print('- Path: ${directory.path}');
      print('- Size: ${stat.size} bytes');
      
      // 计算目录大小（递归）
      final dirSize = await _getDirectorySize(directory);
      print('Directory size: ${(dirSize / (1024 * 1024)).toStringAsFixed(2)} MB');
      
      // 列出大文件
      print('Large files ( > 100KB):');
      await _findLargeFiles(directory, 100 * 1024); // 100KB
    } catch (e) {
      print('Error checking file system space: $e');
    }
  }
  
  // 计算目录大小
  Future<int> _getDirectorySize(Directory directory) async {
    int totalSize = 0;
    
    try {
      final entities = directory.listSync(recursive: true);
      for (var entity in entities) {
        if (entity is File) {
          final stat = await entity.stat();
          totalSize += stat.size;
        }
      }
    } catch (e) {
      print('Error calculating directory size: $e');
    }
    
    return totalSize;
  }
  
  // 查找大文件
  Future<void> _findLargeFiles(Directory directory, int minSizeBytes) async {
    try {
      final entities = directory.listSync(recursive: true);
      for (var entity in entities) {
        if (entity is File) {
          final stat = await entity.stat();
          if (stat.size > minSizeBytes) {
            print('- ${entity.path}: ${(stat.size / 1024).toStringAsFixed(2)} KB');
          }
        }
      }
    } catch (e) {
      print('Error finding large files: $e');
    }
  }
}
```

## 6. 数据持久化最佳实践

### 6.1 选择合适的存储方案

| 存储方案 | 适用场景 | 优势 | 劣势 |
|---------|---------|------|------|
| SharedPreferences | 简单键值对、配置、设置 | 使用简单、轻量级 | 不适合大量数据、复杂结构 |
| SQLite | 结构化数据、复杂查询、关系数据 | 功能强大、支持 SQL 查询 | 配置复杂、性能开销较大 |
| Hive | 移动应用、性能要求高、自定义对象 | 高性能、支持自定义对象、API 简单 | 不支持复杂查询 |
| 文件存储 | 大文件、自定义格式、JSON/XML | 灵活、适合任何数据 | 需要自行管理、不支持查询 |
| 云存储 (Firebase) | 需要同步、多设备访问 | 跨设备同步、无需自行管理 | 依赖网络、可能产生费用 |

### 6.2 性能优化

1. **使用批处理**
   - 在批量操作数据时使用批处理，减少磁盘 I/O 次数
   - 例如：SQLite 和 Hive 都支持批处理操作

2. **数据缓存**
   - 缓存频繁访问的数据到内存中
   - 仅在数据变化时更新持久化存储

3. **索引优化**
   - 对 SQLite 表中的频繁查询字段建立索引
   - 但注意：过多的索引会减慢写入操作

4. **异步操作**
   - 所有持久化操作都应该在异步任务中执行
   - 避免阻塞 UI 线程

5. **数据压缩**
   - 对于大型数据，可以考虑在存储前进行压缩
   - 减少存储空间使用并提高 I/O 效率

### 6.3 安全性考虑

1. **加密敏感数据**
   - 对于敏感信息（如用户凭证、个人信息），应进行加密存储
   - 可以使用专门的加密库如 `encrypt` 或 `pointycastle`

2. **避免明文存储密码**
   - 不要在任何地方存储明文密码
   - 考虑使用令牌认证替代密码认证

3. **安全的密钥管理**
   - 使用安全的方式存储加密密钥
   - 可以考虑使用设备的安全硬件（如 KeyStore、Keychain）

4. **应用沙箱**
   - 利用移动平台的应用沙箱机制隔离数据
   - 避免存储敏感数据在外部存储上

### 6.4 错误处理和数据恢复

1. **错误捕获**
   - 对所有持久化操作进行错误捕获和处理
   - 提供适当的用户反馈

2. **数据备份**
   - 定期备份重要数据
   - 提供数据恢复机制

3. **事务处理**
   - 在进行多步操作时使用事务
   - 确保数据一致性，要么全部成功，要么全部失败

4. **版本迁移**
   - 设计数据库模式时考虑未来的扩展性
   - 实现数据库版本迁移机制

### 6.5 测试和调试

1. **单元测试**
   - 为数据访问层编写单元测试
   - 模拟存储操作以提高测试效率

2. **集成测试**
   - 测试数据持久化与业务逻辑的集成
   - 验证数据读写操作的正确性

3. **性能测试**
   - 测试在大数据量情况下的性能表现
   - 识别和解决潜在的性能瓶颈

4. **调试工具**
   - 使用数据库浏览器等工具查看和分析存储的数据
   - 记录详细的日志以便调试

## 7. 总结

Flutter 提供了多种数据持久化方案，每种方案都有其适用场景。选择合适的持久化方案取决于数据的类型、大小、结构复杂性以及访问模式等因素。

在实际应用中，可以考虑结合使用多种存储方案，例如：
- 使用 SharedPreferences 存储用户设置
- 使用 SQLite 或 Hive 存储应用的核心数据
- 使用文件存储保存大文件或自定义格式的数据

通过合理地选择和使用这些持久化方案，可以构建出高性能、可靠且用户友好的 Flutter 应用。