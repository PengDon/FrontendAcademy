# Flutter 组件示例

本目录包含 Flutter 中常用 UI 组件的示例代码和详细说明。Flutter 提供了丰富的内置组件，可以快速构建美观、功能强大的应用界面。

## 1. 基础组件

### 1.1 文本组件 (Text)

`Text` 组件用于显示文本内容，支持多种样式设置。

```dart
import 'package:flutter/material.dart';

class TextExample extends StatelessWidget {
  const TextExample({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // 基本文本
        const Text('Hello Flutter'),
        
        // 带样式的文本
        Text(
          'Styled Text',
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: Colors.blue,
          ),
        ),
        
        // 多行文本
        const Text(
          'This is a multi-line text that will wrap automatically when it reaches the end of the container width. Flutter makes it easy to handle text formatting and layout.',
          maxLines: 3,
          overflow: TextOverflow.ellipsis,
        ),
        
        // 富文本
        RichText(
          text: TextSpan(
            text: 'Rich ',
            style: DefaultTextStyle.of(context).style,
            children: const <TextSpan>[
              TextSpan(
                text: 'and ',
                style: TextStyle(fontStyle: FontStyle.italic),
              ),
              TextSpan(
                text: 'Colorful',
                style: TextStyle(fontWeight: FontWeight.bold, color: Colors.red),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
```

### 1.2 按钮组件 (Buttons)

Flutter 提供了多种按钮组件，适用于不同的使用场景。

```dart
import 'package:flutter/material.dart';

class ButtonsExample extends StatelessWidget {
  const ButtonsExample({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // ElevatedButton
        ElevatedButton(
          onPressed: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('ElevatedButton pressed')),
            );
          },
          child: const Text('Elevated Button'),
        ),
        const SizedBox(height: 8),
        
        // TextButton
        TextButton(
          onPressed: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('TextButton pressed')),
            );
          },
          child: const Text('Text Button'),
        ),
        const SizedBox(height: 8),
        
        // OutlinedButton
        OutlinedButton(
          onPressed: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('OutlinedButton pressed')),
            );
          },
          child: const Text('Outlined Button'),
        ),
        const SizedBox(height: 8),
        
        // IconButton
        IconButton(
          onPressed: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('IconButton pressed')),
            );
          },
          icon: const Icon(Icons.favorite),
          color: Colors.red,
        ),
        const SizedBox(height: 8),
        
        // 自定义按钮
        ElevatedButton.icon(
          onPressed: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Custom Button pressed')),
            );
          },
          icon: const Icon(Icons.send),
          label: const Text('Send'),
          style: ElevatedButton.styleFrom(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
            backgroundColor: Colors.purple,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
        ),
      ],
    );
  }
}
```

### 1.3 输入组件 (Input)

Flutter 提供了多种输入组件，用于用户交互。

```dart
import 'package:flutter/material.dart';

class InputsExample extends StatefulWidget {
  const InputsExample({Key? key}) : super(key: key);

  @override
  State<InputsExample> createState() => _InputsExampleState();
}

class _InputsExampleState extends State<InputsExample> {
  final TextEditingController _textController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool _obscureText = true;

  @override
  void dispose() {
    _textController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // 普通文本输入
        TextField(
          controller: _textController,
          decoration: const InputDecoration(
            labelText: 'Enter your name',
            hintText: 'John Doe',
            border: OutlineInputBorder(),
            prefixIcon: Icon(Icons.person),
          ),
          onChanged: (value) {
            print('Text changed: $value');
          },
        ),
        const SizedBox(height: 16),
        
        // 密码输入
        TextField(
          controller: _passwordController,
          obscureText: _obscureText,
          decoration: InputDecoration(
            labelText: 'Password',
            border: const OutlineInputBorder(),
            prefixIcon: const Icon(Icons.lock),
            suffixIcon: IconButton(
              icon: Icon(
                _obscureText ? Icons.visibility : Icons.visibility_off,
              ),
              onPressed: () {
                setState(() {
                  _obscureText = !_obscureText;
                });
              },
            ),
          ),
        ),
        const SizedBox(height: 16),
        
        // 多行文本输入
        TextField(
          maxLines: 4,
          decoration: const InputDecoration(
            labelText: 'Description',
            hintText: 'Enter a detailed description',
            border: OutlineInputBorder(),
          ),
        ),
        const SizedBox(height: 16),
        
        // 数字输入
        TextField(
          keyboardType: TextInputType.number,
          decoration: const InputDecoration(
            labelText: 'Age',
            border: OutlineInputBorder(),
          ),
        ),
        const SizedBox(height: 24),
        
        // 提交按钮
        ElevatedButton(
          onPressed: () {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text('Hello, ${_textController.text}!'),
              ),
            );
          },
          child: const Text('Submit'),
        ),
      ],
    );
  }
}
```

## 2. 布局组件

### 2.1 容器组件 (Container)

`Container` 是一个多功能的容器组件，可以设置边框、背景、内边距等属性。

```dart
import 'package:flutter/material.dart';

class ContainerExample extends StatelessWidget {
  const ContainerExample({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // 基本容器
        Container(
          width: 200,
          height: 100,
          color: Colors.blue,
        ),
        const SizedBox(height: 16),
        
        // 带样式的容器
        Container(
          width: 200,
          height: 100,
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.red,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: Colors.black,
              width: 2,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.grey.withOpacity(0.5),
                spreadRadius: 5,
                blurRadius: 7,
                offset: const Offset(0, 3),
              ),
            ],
          ),
          child: const Text(
            'Styled Container',
            style: TextStyle(color: Colors.white),
          ),
        ),
        const SizedBox(height: 16),
        
        // 渐变背景容器
        Container(
          width: 200,
          height: 100,
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [Colors.purple, Colors.blue],
            ),
          ),
          alignment: Alignment.center,
          child: const Text(
            'Gradient',
            style: TextStyle(color: Colors.white, fontSize: 18),
          ),
        ),
      ],
    );
  }
}
```

### 2.2 列表组件 (Lists)

Flutter 提供了多种列表组件，用于显示数据列表。

```dart
import 'package:flutter/material.dart';

class ListsExample extends StatelessWidget {
  const ListsExample({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // 示例数据
    final List<String> items = List.generate(50, (index) => 'Item $index');
    
    return Column(
      children: [
        // 水平列表
        SizedBox(
          height: 100,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: 10,
            itemBuilder: (context, index) {
              return Container(
                width: 100,
                margin: const EdgeInsets.symmetric(horizontal: 4),
                color: Colors.blue,
                alignment: Alignment.center,
                child: Text('Item $index'),
              );
            },
          ),
        ),
        const SizedBox(height: 16),
        
        // 垂直列表
        Expanded(
          child: ListView.builder(
            itemCount: items.length,
            itemBuilder: (context, index) {
              return ListTile(
                leading: CircleAvatar(
                  child: Text('${index + 1}'),
                ),
                title: Text(items[index]),
                subtitle: Text('Subtitle for ${items[index]}'),
                trailing: const Icon(Icons.arrow_forward),
                onTap: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Tapped ${items[index]}')),
                  );
                },
              );
            },
          ),
        ),
      ],
    );
  }
}
```

### 2.3 网格布局 (GridView)

`GridView` 用于创建网格布局，适用于展示图片库、产品列表等场景。

```dart
import 'package:flutter/material.dart';

class GridViewExample extends StatelessWidget {
  const GridViewExample({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // 使用 GridView.builder
        Expanded(
          child: GridView.builder(
            padding: const EdgeInsets.all(8),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 3,
              crossAxisSpacing: 8,
              mainAxisSpacing: 8,
              childAspectRatio: 1.0,
            ),
            itemCount: 20,
            itemBuilder: (context, index) {
              return Card(
                elevation: 4,
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.image,
                        size: 48,
                        color: Colors.blue.shade700,
                      ),
                      Text('Image $index'),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}
```

## 3. 复杂组件

### 3.1 对话框 (Dialog)

Flutter 提供了多种对话框组件，用于显示重要信息或请求用户确认。

```dart
import 'package:flutter/material.dart';

class DialogsExample extends StatelessWidget {
  const DialogsExample({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        // 简单对话框
        ElevatedButton(
          onPressed: () {
            showDialog(
              context: context,
              builder: (context) {
                return AlertDialog(
                  title: const Text('Alert Dialog'),
                  content: const Text('This is a simple alert dialog.'),
                  actions: [
                    TextButton(
                      onPressed: () => Navigator.pop(context),
                      child: const Text('Cancel'),
                    ),
                    TextButton(
                      onPressed: () {
                        Navigator.pop(context);
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Confirmed')),
                        );
                      },
                      child: const Text('Confirm'),
                    ),
                  ],
                );
              },
            );
          },
          child: const Text('Show Alert Dialog'),
        ),
        const SizedBox(height: 16),
        
        // 底部操作表
        ElevatedButton(
          onPressed: () {
            showModalBottomSheet(
              context: context,
              builder: (context) {
                return Container(
                  padding: const EdgeInsets.all(16),
                  height: 200,
                  child: Column(
                    children: [
                      const Text('Bottom Sheet Options'),
                      ListTile(
                        leading: const Icon(Icons.share),
                        title: const Text('Share'),
                        onTap: () {
                          Navigator.pop(context);
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Share option selected')),
                          );
                        },
                      ),
                      ListTile(
                        leading: const Icon(Icons.delete),
                        title: const Text('Delete'),
                        onTap: () {
                          Navigator.pop(context);
                          showDialog(
                            context: context,
                            builder: (context) {
                              return AlertDialog(
                                title: const Text('Confirm Delete'),
                                content: const Text('Are you sure you want to delete this item?'),
                                actions: [
                                  TextButton(
                                    onPressed: () => Navigator.pop(context),
                                    child: const Text('Cancel'),
                                  ),
                                  TextButton(
                                    onPressed: () {
                                      Navigator.pop(context);
                                      ScaffoldMessenger.of(context).showSnackBar(
                                        const SnackBar(content: Text('Item deleted')),
                                      );
                                    },
                                    child: const Text('Delete'),
                                    style: TextButton.styleFrom(
                                      foregroundColor: Colors.red,
                                    ),
                                  ),
                                ],
                              );
                            },
                          );
                        },
                      ),
                    ],
                  ),
                );
              },
            );
          },
          child: const Text('Show Bottom Sheet'),
        ),
      ],
    );
  }
}
```

### 3.2 表单 (Form)

`Form` 组件用于管理多个表单字段，并提供验证、保存等功能。

```dart
import 'package:flutter/material.dart';

class FormExample extends StatefulWidget {
  const FormExample({Key? key}) : super(key: key);

  @override
  State<FormExample> createState() => _FormExampleState();
}

class _FormExampleState extends State<FormExample> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _ageController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _ageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        children: [
          // 姓名字段
          TextFormField(
            controller: _nameController,
            decoration: const InputDecoration(
              labelText: 'Name',
              border: OutlineInputBorder(),
            ),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter your name';
              }
              return null;
            },
          ),
          const SizedBox(height: 16),
          
          // 邮箱字段
          TextFormField(
            controller: _emailController,
            keyboardType: TextInputType.emailAddress,
            decoration: const InputDecoration(
              labelText: 'Email',
              border: OutlineInputBorder(),
            ),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter your email';
              }
              // 简单的邮箱格式验证
              final emailRegex = RegExp(r'^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$');
              if (!emailRegex.hasMatch(value)) {
                return 'Please enter a valid email';
              }
              return null;
            },
          ),
          const SizedBox(height: 16),
          
          // 年龄字段
          TextFormField(
            controller: _ageController,
            keyboardType: TextInputType.number,
            decoration: const InputDecoration(
              labelText: 'Age',
              border: OutlineInputBorder(),
            ),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter your age';
              }
              final age = int.tryParse(value);
              if (age == null || age < 1 || age > 120) {
                return 'Please enter a valid age';
              }
              return null;
            },
          ),
          const SizedBox(height: 24),
          
          // 提交按钮
          ElevatedButton(
            onPressed: () {
              if (_formKey.currentState!.validate()) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Form submitted successfully!')),
                );
                // 这里可以处理表单提交逻辑
                print('Name: ${_nameController.text}');
                print('Email: ${_emailController.text}');
                print('Age: ${_ageController.text}');
              }
            },
            child: const Text('Submit'),
          ),
        ],
      ),
    );
  }
}
```

### 3.3 卡片组件 (Card)

`Card` 组件用于创建带有阴影和圆角的卡片式界面。

```dart
import 'package:flutter/material.dart';

class CardsExample extends StatelessWidget {
  const CardsExample({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        children: [
          // 简单卡片
          Card(
            elevation: 4,
            margin: const EdgeInsets.all(16),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: const [
                  Text(
                    'Simple Card',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 8),
                  Text('This is a simple card with some content.'),
                ],
              ),
            ),
          ),
          
          // 带图片的卡片
          Card(
            elevation: 4,
            margin: const EdgeInsets.all(16),
            child: Column(
              children: [
                // 卡片图片
                Container(
                  height: 200,
                  decoration: const BoxDecoration(
                    image: DecorationImage(
                      image: AssetImage('assets/images/flutter_logo.png'),
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
                // 卡片内容
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: const [
                      Text(
                        'Flutter Logo',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      SizedBox(height: 8),
                      Text('This card contains an image and some descriptive text.'),
                    ],
                  ),
                ),
                // 卡片按钮
                ButtonBar(
                  children: [
                    TextButton(
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Like button pressed')),
                        );
                      },
                      child: const Text('Like'),
                    ),
                    TextButton(
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Share button pressed')),
                        );
                      },
                      child: const Text('Share'),
                    ),
                  ],
                ),
              ],
            ),
          ),
          
          // 自定义阴影和形状的卡片
          Card(
            elevation: 8,
            margin: const EdgeInsets.all(16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
            ),
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                children: const [
                  Icon(
                    Icons.star,
                    size: 48,
                    color: Colors.amber,
                  ),
                  SizedBox(height: 16),
                  Text(
                    'Premium Content',
                    style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 8),
                  Text('This card has a custom shape and enhanced shadow.'),
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

## 4. 自定义组件

Flutter 允许开发者创建自定义组件，可以复用和扩展现有组件。

### 4.1 自定义按钮组件

```dart
import 'package:flutter/material.dart';

class CustomButton extends StatelessWidget {
  final String label;
  final VoidCallback onPressed;
  final Color? backgroundColor;
  final Color? textColor;
  final double? borderRadius;
  final double? padding;
  final bool? isLoading;

  const CustomButton({
    Key? key,
    required this.label,
    required this.onPressed,
    this.backgroundColor,
    this.textColor,
    this.borderRadius,
    this.padding,
    this.isLoading = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: isLoading! ? null : onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: backgroundColor ?? Colors.blue,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(borderRadius ?? 8),
        ),
        padding: EdgeInsets.all(padding ?? 12),
      ),
      child: isLoading! 
        ? const CircularProgressIndicator(color: Colors.white)
        : Text(
            label,
            style: TextStyle(
              color: textColor ?? Colors.white,
              fontSize: 16,
            ),
          ),
    );
  }
}

// 使用自定义按钮
class CustomButtonExample extends StatefulWidget {
  const CustomButtonExample({Key? key}) : super(key: key);

  @override
  State<CustomButtonExample> createState() => _CustomButtonExampleState();
}

class _CustomButtonExampleState extends State<CustomButtonExample> {
  bool _isLoading = false;

  void _simulateLoading() {
    setState(() {
      _isLoading = true;
    });
    
    // 模拟网络请求
    Future.delayed(const Duration(seconds: 2), () {
      setState(() {
        _isLoading = false;
      });
      
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Operation completed')),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        CustomButton(
          label: 'Primary Button',
          onPressed: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Primary button pressed')),
            );
          },
        ),
        const SizedBox(height: 16),
        
        CustomButton(
          label: 'Success Button',
          onPressed: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Success button pressed')),
            );
          },
          backgroundColor: Colors.green,
        ),
        const SizedBox(height: 16),
        
        CustomButton(
          label: 'Danger Button',
          onPressed: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Danger button pressed')),
            );
          },
          backgroundColor: Colors.red,
          borderRadius: 20,
          padding: 16,
        ),
        const SizedBox(height: 16),
        
        CustomButton(
          label: 'Load Data',
          onPressed: _simulateLoading,
          isLoading: _isLoading,
          backgroundColor: Colors.purple,
        ),
      ],
    );
  }
}
```

### 4.2 自定义列表项组件

```dart
import 'package:flutter/material.dart';

class CustomListItem extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final Color iconColor;
  final VoidCallback onTap;

  const CustomListItem({
    Key? key,
    required this.title,
    required this.subtitle,
    required this.icon,
    this.iconColor = Colors.blue,
    required this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: iconColor.withOpacity(0.2),
          child: Icon(icon, color: iconColor),
        ),
        title: Text(
          title,
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Text(subtitle),
        trailing: const Icon(Icons.arrow_forward_ios, size: 16),
        onTap: onTap,
      ),
    );
  }
}

// 使用自定义列表项
class CustomListItemExample extends StatelessWidget {
  const CustomListItemExample({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final List<Map<String, dynamic>> items = [
      {
        'title': 'Account Settings',
        'subtitle': 'Manage your profile and preferences',
        'icon': Icons.person,
        'color': Colors.blue,
      },
      {
        'title': 'Notifications',
        'subtitle': 'Manage your notification preferences',
        'icon': Icons.notifications,
        'color': Colors.amber,
      },
      {
        'title': 'Privacy & Security',
        'subtitle': 'Manage your privacy settings',
        'icon': Icons.security,
        'color': Colors.red,
      },
      {
        'title': 'Help & Support',
        'subtitle': 'Get help with your account',
        'icon': Icons.help,
        'color': Colors.green,
      },
    ];

    return ListView.builder(
      itemCount: items.length,
      itemBuilder: (context, index) {
        final item = items[index];
        return CustomListItem(
          title: item['title'],
          subtitle: item['subtitle'],
          icon: item['icon'],
          iconColor: item['color'],
          onTap: () {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('${item['title']} pressed')),
            );
          },
        );
      },
    );
  }
}
```

## 总结

Flutter 提供了丰富的内置组件，从基础的文本和按钮到复杂的表单和列表，应有尽有。通过组合这些组件，开发者可以快速构建出美观、功能强大的用户界面。

本目录中的示例代码展示了 Flutter 中最常用的一些组件及其用法。在实际开发中，你可能需要根据具体需求对这些组件进行定制和扩展，Flutter 的组件系统设计使得这一点非常容易实现。

通过实践这些示例，并结合 Flutter 的布局系统和状态管理，你可以构建出复杂而健壮的 Flutter 应用。