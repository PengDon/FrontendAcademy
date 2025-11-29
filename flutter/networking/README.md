# Flutter 网络请求

本目录包含 Flutter 中网络请求相关的示例代码和详细说明。网络请求是移动应用开发中的核心功能之一，Flutter 提供了多种方式来处理 HTTP 请求、WebSocket 通信和其他网络操作。

## 1. 网络请求概述

Flutter 中进行网络请求的主要方法包括：

1. 使用原生的 `dart:io` 库中的 `HttpClient`
2. 使用 `http` 包（推荐）
3. 使用 `dio` 包（功能更强大）
4. 使用其他第三方库如 `retrofit`、`chopper` 等

在实际项目中，通常推荐使用 `http` 包或 `dio` 包，它们提供了更简洁的 API 和更丰富的功能。

## 2. 使用 http 包进行基本网络请求

### 2.1 添加依赖

首先，在 `pubspec.yaml` 文件中添加 http 包的依赖：

```yaml
dependencies:
  flutter:
    sdk: flutter
  http: ^0.13.5
```

然后运行 `flutter pub get` 安装依赖。

### 2.2 发送 GET 请求

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

class HttpExample {
  // 发送 GET 请求
  Future<Map<String, dynamic>> fetchPost() async {
    final response = await http.get(Uri.parse('https://jsonplaceholder.typicode.com/posts/1'));

    if (response.statusCode == 200) {
      // 请求成功，解析 JSON 数据
      return jsonDecode(response.body);
    } else {
      // 请求失败，抛出异常
      throw Exception('Failed to load post');
    }
  }
}
```

### 2.3 发送 POST 请求

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

class HttpExample {
  // 发送 POST 请求
  Future<Map<String, dynamic>> createPost(String title, String body) async {
    final response = await http.post(
      Uri.parse('https://jsonplaceholder.typicode.com/posts'),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{
        'title': title,
        'body': body,
        'userId': '1',
      }),
    );

    if (response.statusCode == 201) {
      // 请求成功，解析 JSON 数据
      return jsonDecode(response.body);
    } else {
      // 请求失败，抛出异常
      throw Exception('Failed to create post');
    }
  }
}
```

### 2.4 发送 PUT 请求

```dart
import 'dart:json';
import 'package:http/http.dart' as http;

class HttpExample {
  // 发送 PUT 请求
  Future<Map<String, dynamic>> updatePost(int id, String title, String body) async {
    final response = await http.put(
      Uri.parse('https://jsonplaceholder.typicode.com/posts/$id'),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{
        'title': title,
        'body': body,
        'userId': '1',
      }),
    );

    if (response.statusCode == 200) {
      // 请求成功，解析 JSON 数据
      return jsonDecode(response.body);
    } else {
      // 请求失败，抛出异常
      throw Exception('Failed to update post');
    }
  }
}
```

### 2.5 发送 DELETE 请求

```dart
import 'package:http/http.dart' as http;

class HttpExample {
  // 发送 DELETE 请求
  Future<void> deletePost(int id) async {
    final response = await http.delete(Uri.parse('https://jsonplaceholder.typicode.com/posts/$id'));

    if (response.statusCode != 200) {
      // 请求失败，抛出异常
      throw Exception('Failed to delete post');
    }
  }
}
```

### 2.6 处理查询参数

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

class HttpExample {
  // 带查询参数的 GET 请求
  Future<List<dynamic>> fetchPostsWithQueryParams({int? userId, int? limit}) async {
    final uri = Uri.https(
      'jsonplaceholder.typicode.com',
      '/posts',
      {
        if (userId != null) 'userId': userId.toString(),
        if (limit != null) '_limit': limit.toString(),
      },
    );

    final response = await http.get(uri);

    if (response.statusCode == 200) {
      // 请求成功，解析 JSON 数据
      return jsonDecode(response.body);
    } else {
      // 请求失败，抛出异常
      throw Exception('Failed to load posts');
    }
  }
}
```

## 3. 使用 dio 包进行网络请求

### 3.1 添加依赖

在 `pubspec.yaml` 文件中添加 dio 包的依赖：

```yaml
dependencies:
  flutter:
    sdk: flutter
  dio: ^4.0.6
```

然后运行 `flutter pub get` 安装依赖。

### 3.2 基本的 dio 请求

```dart
import 'dart:convert';
import 'package:dio/dio.dart';

class DioExample {
  final Dio _dio = Dio();

  // 发送 GET 请求
  Future<Map<String, dynamic>> fetchPost() async {
    try {
      Response response = await _dio.get('https://jsonplaceholder.typicode.com/posts/1');
      return response.data;
    } catch (e) {
      throw Exception('Failed to load post: $e');
    }
  }

  // 发送 POST 请求
  Future<Map<String, dynamic>> createPost(String title, String body) async {
    try {
      Response response = await _dio.post(
        'https://jsonplaceholder.typicode.com/posts',
        data: {
          'title': title,
          'body': body,
          'userId': '1',
        },
      );
      return response.data;
    } catch (e) {
      throw Exception('Failed to create post: $e');
    }
  }

  // 发送 PUT 请求
  Future<Map<String, dynamic>> updatePost(int id, String title, String body) async {
    try {
      Response response = await _dio.put(
        'https://jsonplaceholder.typicode.com/posts/$id',
        data: {
          'title': title,
          'body': body,
          'userId': '1',
        },
      );
      return response.data;
    } catch (e) {
      throw Exception('Failed to update post: $e');
    }
  }

  // 发送 DELETE 请求
  Future<void> deletePost(int id) async {
    try {
      await _dio.delete('https://jsonplaceholder.typicode.com/posts/$id');
    } catch (e) {
      throw Exception('Failed to delete post: $e');
    }
  }

  // 带查询参数的请求
  Future<List<dynamic>> fetchPostsWithQueryParams({int? userId, int? limit}) async {
    try {
      Response response = await _dio.get(
        'https://jsonplaceholder.typicode.com/posts',
        queryParameters: {
          if (userId != null) 'userId': userId,
          if (limit != null) '_limit': limit,
        },
      );
      return response.data;
    } catch (e) {
      throw Exception('Failed to load posts: $e');
    }
  }
}
```

### 3.3 dio 拦截器

dio 拦截器允许在请求发送前或响应接收后执行特定的逻辑。

```dart
import 'package:dio/dio.dart';

class DioInterceptorsExample {
  final Dio _dio = Dio();

  DioInterceptorsExample() {
    // 添加拦截器
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          // 请求发送前处理
          print('Request to ${options.uri}');
          print('Headers: ${options.headers}');
          print('Data: ${options.data}');
          
          // 添加认证令牌
          options.headers['Authorization'] = 'Bearer your_token_here';
          
          return handler.next(options); // 继续处理请求
        },
        onResponse: (response, handler) {
          // 响应接收后处理
          print('Response status: ${response.statusCode}');
          print('Response data: ${response.data}');
          
          return handler.next(response); // 继续处理响应
        },
        onError: (DioError e, handler) {
          // 错误处理
          print('Error: ${e.message}');
          print('Response status: ${e.response?.statusCode}');
          print('Response data: ${e.response?.data}');
          
          // 处理特定错误
          if (e.response?.statusCode == 401) {
            // 处理未授权错误
            print('Unauthorized access. Redirect to login.');
          }
          
          // 可以决定是否继续抛出错误或返回自定义响应
          return handler.next(e); // 继续抛出错误
        },
      ),
    );
  }

  // 使用配置好拦截器的 dio 实例发送请求
  Future<dynamic> fetchWithInterceptors(String url) async {
    try {
      Response response = await _dio.get(url);
      return response.data;
    } catch (e) {
      print('Request failed: $e');
      rethrow;
    }
  }
}
```

### 3.4 dio 请求取消

dio 支持取消正在进行的请求，这在用户离开页面或组件被销毁时非常有用。

```dart
import 'package:dio/dio.dart';

class CancelableRequestsExample {
  final Dio _dio = Dio();
  CancelToken? _cancelToken;

  // 发送可取消的请求
  Future<dynamic> fetchWithCancelOption(String url) async {
    // 创建新的取消令牌
    _cancelToken = CancelToken();
    
    try {
      Response response = await _dio.get(
        url,
        cancelToken: _cancelToken,
      );
      return response.data;
    } catch (e) {
      if (CancelToken.isCancel(e)) {
        print('Request canceled: ${e.message}');
      } else {
        print('Request failed: $e');
      }
      rethrow;
    }
  }

  // 取消请求
  void cancelRequests() {
    if (_cancelToken != null && !_cancelToken!.isCancelled) {
      _cancelToken!.cancel('Request canceled by user');
      _cancelToken = null;
    }
  }
}
```

## 4. 处理异步操作

Flutter 中的网络请求是异步的，通常使用 Future 和 async/await 来处理异步操作。

### 4.1 Future 和 async/await 基础

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

class AsyncExample {
  // 使用 async/await 发送请求
  Future<dynamic> fetchData() async {
    try {
      // 异步获取响应
      final response = await http.get(
        Uri.parse('https://jsonplaceholder.typicode.com/posts/1'),
      );
      
      // 检查状态码
      if (response.statusCode == 200) {
        // 解析 JSON
        return jsonDecode(response.body);
      } else {
        throw Exception('HTTP request failed with status: ${response.statusCode}');
      }
    } catch (e) {
      print('Error: $e');
      rethrow;
    }
  }

  // 串行执行多个请求
  Future<Map<String, dynamic>> fetchMultipleResources() async {
    try {
      // 串行执行两个请求
      final postResponse = await http.get(
        Uri.parse('https://jsonplaceholder.typicode.com/posts/1'),
      );
      
      final commentResponse = await http.get(
        Uri.parse('https://jsonplaceholder.typicode.com/comments/1'),
      );
      
      // 合并结果
      return {
        'post': jsonDecode(postResponse.body),
        'comment': jsonDecode(commentResponse.body),
      };
    } catch (e) {
      print('Error: $e');
      rethrow;
    }
  }

  // 并行执行多个请求
  Future<Map<String, dynamic>> fetchMultipleResourcesInParallel() async {
    try {
      // 同时启动两个请求
      final postFuture = http.get(
        Uri.parse('https://jsonplaceholder.typicode.com/posts/1'),
      );
      
      final commentFuture = http.get(
        Uri.parse('https://jsonplaceholder.typicode.com/comments/1'),
      );
      
      // 等待所有请求完成
      final responses = await Future.wait([postFuture, commentFuture]);
      
      // 合并结果
      return {
        'post': jsonDecode(responses[0].body),
        'comment': jsonDecode(responses[1].body),
      };
    } catch (e) {
      print('Error: $e');
      rethrow;
    }
  }
}
```

### 4.2 在 Widget 中处理异步操作

```dart
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:json';

class NetworkDataWidget extends StatefulWidget {
  const NetworkDataWidget({Key? key}) : super(key: key);

  @override
  State<NetworkDataWidget> createState() => _NetworkDataWidgetState();
}

class _NetworkDataWidgetState extends State<NetworkDataWidget> {
  Future<Map<String, dynamic>>? _futureData;
  bool _isLoading = false;
  String _errorMessage = '';

  @override
  void initState() {
    super.initState();
    // 组件初始化时加载数据
    _fetchData();
  }

  Future<void> _fetchData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = '';
    });

    try {
      final response = await http.get(
        Uri.parse('https://jsonplaceholder.typicode.com/posts/1'),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          _futureData = Future.value(data);
          _isLoading = false;
        });
      } else {
        throw Exception('Failed to load data');
      }
    } catch (e) {
      setState(() {
        _errorMessage = e.toString();
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Network Data Example'),
      ),
      body: Center(
        child: _isLoading
            ? const CircularProgressIndicator()
            : _errorMessage.isNotEmpty
                ? Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(_errorMessage),
                      ElevatedButton(
                        onPressed: _fetchData,
                        child: const Text('Retry'),
                      ),
                    ],
                  )
                : FutureBuilder<Map<String, dynamic>>(
                    future: _futureData,
                    builder: (context, snapshot) {
                      if (snapshot.hasData) {
                        return Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text('ID: ${snapshot.data!['id']}'),
                            Text('Title: ${snapshot.data!['title']}'),
                            Text('Body: ${snapshot.data!['body']}'),
                            ElevatedButton(
                              onPressed: _fetchData,
                              child: const Text('Refresh'),
                            ),
                          ],
                        );
                      } else {
                        return const Text('No data available');
                      }
                    },
                  ),
      ),
    );
  }
}
```

## 5. 错误处理和重试机制

### 5.1 基本错误处理

```dart
import 'dart:io';
import 'package:dio/dio.dart';

class ErrorHandlingExample {
  final Dio _dio = Dio();

  Future<dynamic> fetchDataWithErrorHandling(String url) async {
    try {
      final response = await _dio.get(url);
      return response.data;
    } on DioError catch (e) {
      // 处理 dio 特定错误
      if (e.type == DioErrorType.response) {
        // 服务器返回错误状态码
        switch (e.response?.statusCode) {
          case 400:
            throw Exception('Bad request. Please check your input.');
          case 401:
            throw Exception('Authentication required. Please login.');
          case 403:
            throw Exception('Access denied. You don\'t have permission.');
          case 404:
            throw Exception('Resource not found.');
          case 500:
            throw Exception('Server error. Please try again later.');
          default:
            throw Exception('Server error with status code: ${e.response?.statusCode}');
        }
      } else if (e.type == DioErrorType.connectTimeout || 
                e.type == DioErrorType.receiveTimeout) {
        // 超时错误
        throw Exception('Connection timeout. Please check your network.');
      } else if (e.type == DioErrorType.other) {
        // 网络连接错误
        if (e.error is SocketException) {
          throw Exception('No internet connection. Please check your network.');
        }
        throw Exception('Network error: ${e.message}');
      }
      // 其他错误
      throw Exception('Failed to fetch data: ${e.message}');
    } catch (e) {
      // 捕获所有其他异常
      print('Unexpected error: $e');
      rethrow;
    }
  }
}
```

### 5.2 重试机制

```dart
import 'dart:io';
import 'package:dio/dio.dart';

class RetryMechanismExample {
  final Dio _dio = Dio();
  final int _maxRetries = 3;
  final Duration _retryDelay = const Duration(seconds: 1);

  Future<dynamic> fetchDataWithRetry(String url) async {
    int retries = 0;
    late dynamic lastError;

    while (retries < _maxRetries) {
      try {
        final response = await _dio.get(url);
        return response.data;
      } on DioError catch (e) {
        lastError = e;
        retries++;
        
        // 只对特定错误进行重试
        if (e.type == DioErrorType.connectTimeout || 
            e.type == DioErrorType.receiveTimeout ||
            (e.error is SocketException) ||
            (e.response?.statusCode != null && 
             (e.response!.statusCode! >= 500 || e.response!.statusCode! == 429))) {
          
          print('Retrying request... Attempt $retries of $_maxRetries');
          
          // 指数退避策略
          final delay = _retryDelay * (retries * retries);
          await Future.delayed(delay);
          
          continue;
        }
        
        // 对于不应该重试的错误，直接抛出
        throw e;
      }
    }
    
    // 达到最大重试次数
    throw Exception('Failed after $_maxRetries attempts. Last error: $lastError');
  }
}
```

### 5.3 dio 重试拦截器

使用 dio 的拦截器实现重试机制。

```dart
import 'package:dio/dio.dart';

class RetryInterceptor extends Interceptor {
  final int maxRetries;
  final Duration retryDelay;
  final List<int> retryableStatusCodes;

  RetryInterceptor({
    this.maxRetries = 3,
    this.retryDelay = const Duration(seconds: 1),
    this.retryableStatusCodes = const [429, 500, 502, 503, 504],
  });

  @override
  void onError(DioError err, ErrorInterceptorHandler handler) async {
    // 如果请求已被取消或已达到最大重试次数，则不重试
    if (err.type == DioErrorType.cancel || err.requestOptions.extra.containsKey('retries')) {
      return handler.next(err);
    }

    // 初始化重试计数
    err.requestOptions.extra['retries'] = 0;
    return _retry(err, handler);
  }

  Future<void> _retry(DioError err, ErrorInterceptorHandler handler) async {
    final int retries = err.requestOptions.extra['retries'] as int;

    // 检查是否应该重试
    bool shouldRetry = false;
    
    // 检查错误类型
    if (err.type == DioErrorType.connectTimeout ||
        err.type == DioErrorType.receiveTimeout ||
        err.type == DioErrorType.sendTimeout) {
      shouldRetry = true;
    } else if (err.type == DioErrorType.response) {
      // 检查状态码是否可重试
      shouldRetry = retryableStatusCodes.contains(err.response?.statusCode);
    }

    if (!shouldRetry || retries >= maxRetries) {
      return handler.next(err);
    }

    // 增加重试计数
    err.requestOptions.extra['retries'] = retries + 1;
    print('Retrying request... Attempt ${retries + 1} of $maxRetries');

    // 延迟后重试
    final delay = retryDelay * (retries + 1); // 指数退避
    await Future.delayed(delay);

    // 重新发送请求
    try {
      final response = await err.requestOptions.createHttpClient().fetch(err.requestOptions);
      handler.resolve(response);
    } catch (e) {
      // 递归重试
      _retry(err, handler);
    }
  }
}

// 使用示例
class DioWithRetry {
  final Dio _dio = Dio();

  DioWithRetry() {
    _dio.interceptors.add(RetryInterceptor(
      maxRetries: 3,
      retryDelay: const Duration(seconds: 1),
    ));
  }

  Future<dynamic> fetchData(String url) async {
    try {
      final response = await _dio.get(url);
      return response.data;
    } catch (e) {
      print('Failed after retries: $e');
      rethrow;
    }
  }
}
```

## 6. 文件上传和下载

### 6.1 文件上传

```dart
import 'dart:io';
import 'package:dio/dio.dart';

class FileUploadExample {
  final Dio _dio = Dio();

  // 上传单个文件
  Future<Map<String, dynamic>> uploadFile(File file, String url) async {
    try {
      final FormData formData = FormData.fromMap({
        'file': await MultipartFile.fromFile(
          file.path,
          filename: file.path.split('/').last,
        ),
        'description': 'File upload example',
      });

      final response = await _dio.post(
        url,
        data: formData,
        onSendProgress: (int sent, int total) {
          final progress = (sent / total * 100).toStringAsFixed(0);
          print('Upload progress: $progress%');
        },
      );

      return response.data;
    } catch (e) {
      print('File upload failed: $e');
      rethrow;
    }
  }

  // 上传多个文件
  Future<Map<String, dynamic>> uploadMultipleFiles(
      List<File> files, String url) async {
    try {
      final List<MultipartFile> multipartFiles = await Future.wait(
        files.map((file) async => await MultipartFile.fromFile(
              file.path,
              filename: file.path.split('/').last,
            )),
      );

      final FormData formData = FormData.fromMap({
        'files': multipartFiles,
        'description': 'Multiple files upload example',
      });

      final response = await _dio.post(
        url,
        data: formData,
        onSendProgress: (int sent, int total) {
          final progress = (sent / total * 100).toStringAsFixed(0);
          print('Upload progress: $progress%');
        },
      );

      return response.data;
    } catch (e) {
      print('Multiple files upload failed: $e');
      rethrow;
    }
  }
}
```

### 6.2 文件下载

```dart
import 'dart:io';
import 'package:dio/dio.dart';

class FileDownloadExample {
  final Dio _dio = Dio();

  // 下载文件
  Future<void> downloadFile(
      String url, String savePath, Function(int, int) onProgress) async {
    try {
      await _dio.download(
        url,
        savePath,
        onReceiveProgress: onProgress,
        deleteOnError: true, // 下载失败时删除已下载的文件
      );
    } catch (e) {
      print('File download failed: $e');
      rethrow;
    }
  }

  // 带断点续传的文件下载
  Future<void> downloadFileWithResume(
      String url, String savePath, Function(int, int) onProgress) async {
    try {
      // 检查文件是否已部分下载
      final File file = File(savePath);
      int downloadedBytes = 0;

      if (await file.exists()) {
        downloadedBytes = await file.length();
        print('Resuming download from $downloadedBytes bytes');
      }

      // 设置请求头以支持断点续传
      final Response response = await _dio.get(
        url,
        options: Options(
          headers: {HttpHeaders.rangeHeader: 'bytes=$downloadedBytes-'},
          responseType: ResponseType.bytes,
          followRedirects: false,
        ),
        onReceiveProgress: onProgress,
      );

      // 处理响应
      if (response.statusCode == 200 || response.statusCode == 206) {
        // 创建文件或追加到现有文件
        final RandomAccessFile raf = await file.open(mode: FileMode.append);
        await raf.writeFrom(response.data);
        await raf.close();
      } else {
        throw Exception('Download failed with status code: ${response.statusCode}');
      }
    } catch (e) {
      print('Resumable download failed: $e');
      rethrow;
    }
  }
}
```

## 7. WebSocket 通信

### 7.1 基本 WebSocket 连接

```dart
import 'dart:async';
import 'dart:convert';
import 'dart:io';

class WebSocketExample {
  WebSocket? _socket;
  StreamSubscription? _subscription;
  final StreamController<dynamic> _messageController = StreamController<dynamic>.broadcast();

  // 获取消息流
  Stream<dynamic> get messageStream => _messageController.stream;

  // 连接到 WebSocket 服务器
  Future<void> connect(String url) async {
    try {
      _socket = await WebSocket.connect(url);
      print('WebSocket connected');

      // 监听 WebSocket 消息
      _subscription = _socket!.listen(
        (data) {
          // 将接收到的消息添加到流中
          if (data is String) {
            try {
              _messageController.add(jsonDecode(data));
            } catch (e) {
              // 如果不是 JSON 格式，则直接添加原始字符串
              _messageController.add(data);
            }
          } else {
            _messageController.add(data);
          }
        },
        onError: (error) {
          print('WebSocket error: $error');
          _messageController.addError(error);
          // 尝试重连
          _reconnect(url);
        },
        onDone: () {
          print('WebSocket connection closed');
          // 尝试重连
          _reconnect(url);
        },
      );
    } catch (e) {
      print('Failed to connect to WebSocket: $e');
      _messageController.addError(e);
      // 尝试重连
      _reconnect(url);
    }
  }

  // 发送消息
  void send(dynamic message) {
    if (_socket != null && _socket!.readyState == WebSocket.open) {
      if (message is Map || message is List) {
        _socket!.add(jsonEncode(message));
      } else {
        _socket!.add(message);
      }
    } else {
      print('WebSocket is not connected');
    }
  }

  // 关闭连接
  void disconnect() {
    _subscription?.cancel();
    _socket?.close();
    _socket = null;
    print('WebSocket disconnected');
  }

  // 重连机制
  Future<void> _reconnect(String url) async {
    // 等待一段时间后尝试重连
    await Future.delayed(const Duration(seconds: 5));
    print('Attempting to reconnect...');
    await connect(url);
  }

  // 清理资源
  void dispose() {
    _subscription?.cancel();
    _socket?.close();
    _messageController.close();
  }
}
```

### 7.2 在 Widget 中使用 WebSocket

```dart
import 'package:flutter/material.dart';

class WebSocketWidget extends StatefulWidget {
  final String url;

  const WebSocketWidget({Key? key, required this.url}) : super(key: key);

  @override
  State<WebSocketWidget> createState() => _WebSocketWidgetState();
}

class _WebSocketWidgetState extends State<WebSocketWidget> {
  final WebSocketExample _webSocket = WebSocketExample();
  List<String> _messages = [];
  final TextEditingController _textController = TextEditingController();

  @override
  void initState() {
    super.initState();
    
    // 连接 WebSocket
    _webSocket.connect(widget.url);
    
    // 监听消息
    _webSocket.messageStream.listen((data) {
      setState(() {
        _messages.add(data.toString());
      });
    }, onError: (error) {
      setState(() {
        _messages.add('Error: $error');
      });
    });
  }

  void _sendMessage() {
    if (_textController.text.isNotEmpty) {
      _webSocket.send(_textController.text);
      _textController.clear();
    }
  }

  @override
  void dispose() {
    _webSocket.disconnect();
    _textController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('WebSocket Example'),
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                return ListTile(
                  title: Text(_messages[index]),
                );
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _textController,
                    decoration: const InputDecoration(
                      hintText: 'Enter message...',
                    ),
                    onSubmitted: (_) => _sendMessage(),
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.send),
                  onPressed: _sendMessage,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
```

## 8. 网络请求状态管理

### 8.1 简单状态管理

```dart
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

// 定义请求状态
enum RequestStatus {
  initial,
  loading,
  success,
  error,
}

// 请求状态模型
class RequestState<T> {
  final RequestStatus status;
  final T? data;
  final String? error;

  const RequestState.initial()
      : status = RequestStatus.initial,
        data = null,
        error = null;

  const RequestState.loading()
      : status = RequestStatus.loading,
        data = null,
        error = null;

  const RequestState.success(this.data)
      : status = RequestStatus.success,
        error = null;

  const RequestState.error(this.error)
      : status = RequestStatus.error,
        data = null;

  bool get isInitial => status == RequestStatus.initial;
  bool get isLoading => status == RequestStatus.loading;
  bool get isSuccess => status == RequestStatus.success;
  bool get isError => status == RequestStatus.error;
}

// 使用状态管理的组件
class NetworkRequestWidget extends StatefulWidget {
  const NetworkRequestWidget({Key? key}) : super(key: key);

  @override
  State<NetworkRequestWidget> createState() => _NetworkRequestWidgetState();
}

class _NetworkRequestWidgetState extends State<NetworkRequestWidget> {
  RequestState<Map<String, dynamic>> _state = const RequestState.initial();

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  Future<void> _fetchData() async {
    setState(() {
      _state = const RequestState.loading();
    });

    try {
      final response = await http.get(
        Uri.parse('https://jsonplaceholder.typicode.com/posts/1'),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          _state = RequestState.success(data);
        });
      } else {
        setState(() {
          _state = RequestState.error('Failed to load data');
        });
      }
    } catch (e) {
      setState(() {
        _state = RequestState.error(e.toString());
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Network Request State Management'),
      ),
      body: Center(
        child: _state.isLoading
            ? const CircularProgressIndicator()
            : _state.isError
                ? Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(_state.error!),
                      ElevatedButton(
                        onPressed: _fetchData,
                        child: const Text('Retry'),
                      ),
                    ],
                  )
                : _state.isSuccess
                    ? Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text('ID: ${_state.data!['id']}'),
                          Text('Title: ${_state.data!['title']}'),
                          Text('Body: ${_state.data!['body']}'),
                          ElevatedButton(
                            onPressed: _fetchData,
                            child: const Text('Refresh'),
                          ),
                        ],
                      )
                    : const Text('Press the button to load data'),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _fetchData,
        tooltip: 'Fetch Data',
        child: const Icon(Icons.refresh),
      ),
    );
  }
}
```

## 9. 高级网络请求模式

### 9.1 Repository 模式

将数据获取逻辑封装在 Repository 中，提供统一的数据访问接口。

```dart
import 'dart:convert';
import 'package:dio/dio.dart';

// 数据模型
class Post {
  final int id;
  final String title;
  final String body;
  final int userId;

  Post({
    required this.id,
    required this.title,
    required this.body,
    required this.userId,
  });

  // 从 JSON 创建 Post 对象
  factory Post.fromJson(Map<String, dynamic> json) {
    return Post(
      id: json['id'] as int,
      title: json['title'] as String,
      body: json['body'] as String,
      userId: json['userId'] as int,
    );
  }

  // 转换为 JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'body': body,
      'userId': userId,
    };
  }
}

// 数据源接口
abstract class PostDataSource {
  Future<List<Post>> getPosts({int? limit});
  Future<Post> getPostById(int id);
  Future<Post> createPost(Post post);
  Future<Post> updatePost(int id, Post post);
  Future<void> deletePost(int id);
}

// 远程数据源实现
class RemotePostDataSource implements PostDataSource {
  final Dio _dio;

  RemotePostDataSource(this._dio);

  @override
  Future<List<Post>> getPosts({int? limit}) async {
    final response = await _dio.get(
      '/posts',
      queryParameters: limit != null ? {'_limit': limit} : null,
    );

    final List<dynamic> jsonList = response.data;
    return jsonList.map((json) => Post.fromJson(json as Map<String, dynamic>)).toList();
  }

  @override
  Future<Post> getPostById(int id) async {
    final response = await _dio.get('/posts/$id');
    return Post.fromJson(response.data as Map<String, dynamic>);
  }

  @override
  Future<Post> createPost(Post post) async {
    final response = await _dio.post(
      '/posts',
      data: post.toJson(),
    );
    return Post.fromJson(response.data as Map<String, dynamic>);
  }

  @override
  Future<Post> updatePost(int id, Post post) async {
    final response = await _dio.put(
      '/posts/$id',
      data: post.toJson(),
    );
    return Post.fromJson(response.data as Map<String, dynamic>);
  }

  @override
  Future<void> deletePost(int id) async {
    await _dio.delete('/posts/$id');
  }
}

// Repository 实现
class PostRepository {
  final PostDataSource _dataSource;

  PostRepository(this._dataSource);

  Future<List<Post>> getPosts({int? limit}) async {
    try {
      return await _dataSource.getPosts(limit: limit);
    } catch (e) {
      print('Error getting posts: $e');
      rethrow;
    }
  }

  Future<Post> getPostById(int id) async {
    try {
      return await _dataSource.getPostById(id);
    } catch (e) {
      print('Error getting post by id: $e');
      rethrow;
    }
  }

  Future<Post> createPost(Post post) async {
    try {
      return await _dataSource.createPost(post);
    } catch (e) {
      print('Error creating post: $e');
      rethrow;
    }
  }

  Future<Post> updatePost(int id, Post post) async {
    try {
      return await _dataSource.updatePost(id, post);
    } catch (e) {
      print('Error updating post: $e');
      rethrow;
    }
  }

  Future<void> deletePost(int id) async {
    try {
      await _dataSource.deletePost(id);
    } catch (e) {
      print('Error deleting post: $e');
      rethrow;
    }
  }
}

// 服务层 - 处理业务逻辑
class PostService {
  final PostRepository _repository;

  PostService(this._repository);

  Future<List<Post>> fetchPosts({int limit = 10}) async {
    final posts = await _repository.getPosts(limit: limit);
    // 可以在这里添加业务逻辑，如过滤、排序等
    return posts;
  }

  Future<Post> fetchPostById(int id) async {
    return await _repository.getPostById(id);
  }

  Future<Post> createNewPost(String title, String body) async {
    // 验证输入
    if (title.isEmpty || body.isEmpty) {
      throw Exception('Title and body cannot be empty');
    }
    
    // 创建新帖子
    final newPost = Post(
      id: 0, // 将由服务器分配
      title: title,
      body: body,
      userId: 1, // 假设当前用户ID为1
    );
    
    return await _repository.createPost(newPost);
  }

  Future<void> deleteUserPost(int id) async {
    // 可以添加权限检查等逻辑
    await _repository.deletePost(id);
  }
}
```

### 9.2 缓存策略

实现网络请求缓存，减少不必要的网络请求。

```dart
import 'dart:io';
import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:path_provider/path_provider.dart';

class CacheInterceptor extends Interceptor {
  // 缓存目录路径
  String? _cacheDirPath;
  
  // 默认缓存时间（毫秒）
  final Duration maxAge;
  
  CacheInterceptor({this.maxAge = const Duration(minutes: 10)});
  
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) async {
    // 只对 GET 请求应用缓存
    if (options.method == 'GET') {
      final cachePath = await _getCachePath(options.uri.toString());
      final file = File(cachePath);
      
      if (await file.exists()) {
        final cacheData = await _readCacheFile(file);
        
        // 检查缓存是否过期
        if (cacheData != null && !_isExpired(cacheData.timestamp)) {
          print('Using cached response for ${options.uri}');
          // 直接返回缓存的响应
          return handler.resolve(Response(
            statusCode: 200,
            data: cacheData.data,
            requestOptions: options,
          ));
        } else {
          // 缓存已过期，删除缓存文件
          await file.delete();
        }
      }
    }
    
    return handler.next(options);
  }
  
  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) async {
    // 只缓存成功的 GET 请求
    if (response.requestOptions.method == 'GET' && response.statusCode == 200) {
      try {
        final cachePath = await _getCachePath(response.requestOptions.uri.toString());
        await _writeCacheFile(cachePath, response.data);
      } catch (e) {
        print('Failed to cache response: $e');
      }
    }
    
    return handler.next(response);
  }
  
  // 获取缓存目录
  Future<String> _getCacheDir() async {
    if (_cacheDirPath == null) {
      final directory = await getTemporaryDirectory();
      _cacheDirPath = '${directory.path}/dio_cache';
      
      // 创建缓存目录
      final cacheDir = Directory(_cacheDirPath!);
      if (!await cacheDir.exists()) {
        await cacheDir.create(recursive: true);
      }
    }
    
    return _cacheDirPath!;
  }
  
  // 生成缓存文件路径
  Future<String> _getCachePath(String url) async {
    final cacheDir = await _getCacheDir();
    // 使用URL的哈希值作为文件名
    final filename = url.replaceAll(RegExp(r'\W+'), '_');
    return '$cacheDir/$filename.json';
  }
  
  // 缓存数据模型
  class CacheData {
    final dynamic data;
    final int timestamp;
    
    CacheData(this.data, this.timestamp);
    
    Map<String, dynamic> toJson() => {
      'data': data,
      'timestamp': timestamp,
    };
    
    factory CacheData.fromJson(Map<String, dynamic> json) {
      return CacheData(
        json['data'],
        json['timestamp'] as int,
      );
    }
  }
  
  // 写入缓存文件
  Future<void> _writeCacheFile(String path, dynamic data) async {
    final cacheData = CacheData(
      data,
      DateTime.now().millisecondsSinceEpoch,
    );
    
    final file = File(path);
    await file.writeAsString(jsonEncode(cacheData.toJson()));
  }
  
  // 读取缓存文件
  Future<CacheData?> _readCacheFile(File file) async {
    try {
      final content = await file.readAsString();
      final json = jsonDecode(content);
      return CacheData.fromJson(json as Map<String, dynamic>);
    } catch (e) {
      print('Failed to read cache file: $e');
      return null;
    }
  }
  
  // 检查缓存是否过期
  bool _isExpired(int timestamp) {
    final now = DateTime.now().millisecondsSinceEpoch;
    return (now - timestamp) > maxAge.inMilliseconds;
  }
  
  // 清除所有缓存
  Future<void> clearCache() async {
    final cacheDir = await _getCacheDir();
    final dir = Directory(cacheDir);
    if (await dir.exists()) {
      await dir.delete(recursive: true);
      _cacheDirPath = null; // 重置缓存目录路径
    }
  }
  
  // 清除特定URL的缓存
  Future<void> clearCacheForUrl(String url) async {
    final cachePath = await _getCachePath(url);
    final file = File(cachePath);
    if (await file.exists()) {
      await file.delete();
    }
  }
}

// 使用缓存拦截器
class DioWithCache {
  final Dio _dio = Dio();
  late final CacheInterceptor _cacheInterceptor;
  
  DioWithCache({Duration cacheDuration = const Duration(minutes: 10)}) {
    _cacheInterceptor = CacheInterceptor(maxAge: cacheDuration);
    _dio.interceptors.add(_cacheInterceptor);
  }
  
  Future<dynamic> get(String url) async {
    final response = await _dio.get(url);
    return response.data;
  }
  
  // 清除所有缓存
  Future<void> clearCache() async {
    await _cacheInterceptor.clearCache();
  }
  
  // 清除特定URL的缓存
  Future<void> clearCacheForUrl(String url) async {
    await _cacheInterceptor.clearCacheForUrl(url);
  }
}
```

## 10. 网络请求最佳实践

### 10.1 性能优化

1. **减少不必要的请求**
   - 实现请求合并和去重
   - 使用缓存避免重复请求

```dart
import 'dart:async';
import 'package:dio/dio.dart';

class DebouncedRequestManager {
  final Map<String, Completer> _pendingRequests = {};
  final Dio _dio = Dio();

  // 发送去重的请求
  Future<dynamic> fetchWithDebouncing(String url) async {
    // 检查是否已有相同URL的请求在进行中
    if (_pendingRequests.containsKey(url)) {
      print('Duplicate request detected. Using existing request for $url');
      return _pendingRequests[url]!.future;
    }

    // 创建一个新的Completer
    final completer = Completer<dynamic>();
    _pendingRequests[url] = completer;

    try {
      final response = await _dio.get(url);
      completer.complete(response.data);
      return response.data;
    } catch (e) {
      completer.completeError(e);
      rethrow;
    } finally {
      // 请求完成后从映射中移除
      _pendingRequests.remove(url);
    }
  }
}
```

2. **优化请求大小**
   - 只请求需要的数据字段
   - 使用压缩减少传输大小

```dart
import 'package:dio/dio.dart';

class OptimizedNetworkRequest {
  final Dio _dio = Dio();

  OptimizedNetworkRequest() {
    // 启用请求和响应压缩
    _dio.options.headers = {
      'Accept-Encoding': 'gzip, deflate',
    };
  }

  // 只请求需要的字段
  Future<dynamic> fetchOptimizedUserProfile(int userId) async {
    final response = await _dio.get(
      '/users/$userId',
      queryParameters: {
        '_fields': 'id,name,email,avatar', // 只请求需要的字段
      },
    );
    return response.data;
  }

  // 批量请求数据
  Future<Map<String, dynamic>> batchFetchData(List<int> ids) async {
    // 将多个ID合并为一个请求
    final response = await _dio.get(
      '/items/batch',
      queryParameters: {
        'ids': ids.join(','), // 以逗号分隔的ID列表
      },
    );
    return response.data;
  }
}
```

### 10.2 安全性考虑

1. **HTTPS 使用**
   - 确保所有请求都使用 HTTPS
   - 验证服务器证书

```dart
import 'dart:io';
import 'package:dio/dio.dart';

class SecureNetworkRequest {
  late final Dio _dio;

  SecureNetworkRequest() {
    // 创建具有安全配置的 dio 实例
    _dio = Dio();

    // 配置安全连接
    (_dio.httpClientAdapter as DefaultHttpClientAdapter).onHttpClientCreate = 
        (HttpClient client) {
      // 禁用不安全的连接
      client.badCertificateCallback = 
          (X509Certificate cert, String host, int port) {
        // 在生产环境中，永远不要返回 true。这只是为了演示。
        // 在生产环境中，您应该验证证书的有效性。
        print('Warning: Certificate validation disabled!');
        return true;
      };
      return client;
    };

    // 设置合理的超时
    _dio.options.connectTimeout = const Duration(seconds: 30);
    _dio.options.receiveTimeout = const Duration(seconds: 30);
  }

  // 发送安全请求
  Future<dynamic> secureGet(String url) async {
    try {
      // 确保 URL 使用 HTTPS
      if (!url.startsWith('https://')) {
        throw Exception('URL must use HTTPS protocol');
      }

      final response = await _dio.get(url);
      return response.data;
    } catch (e) {
      print('Secure request failed: $e');
      rethrow;
    }
  }
}
```

2. **认证和授权**
   - 安全地处理令牌和凭证

```dart
import 'package:dio/dio.dart';

class AuthInterceptor extends Interceptor {
  final String _authToken;

  AuthInterceptor(this._authToken);

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    // 添加认证令牌到请求头
    options.headers['Authorization'] = 'Bearer $_authToken';
    return handler.next(options);
  }

  @override
  void onError(DioError err, ErrorInterceptorHandler handler) {
    // 处理认证错误
    if (err.response?.statusCode == 401) {
      print('Authentication failed. Token might be expired.');
      // 这里可以触发令牌刷新逻辑
      // 例如：notifyListeners(AuthEvent.tokenExpired);
    }
    return handler.next(err);
  }
}

class SecureAuthManager {
  String? _authToken;
  final Dio _dio = Dio();

  // 登录并存储令牌
  Future<bool> login(String username, String password) async {
    try {
      final response = await _dio.post(
        '/auth/login',
        data: {
          'username': username,
          'password': password,
        },
      );

      if (response.statusCode == 200 && response.data['token'] != null) {
        _authToken = response.data['token'];
        
        // 配置带有认证的 dio 实例
        _setupAuthenticatedDio();
        return true;
      }
      return false;
    } catch (e) {
      print('Login failed: $e');
      return false;
    }
  }

  // 配置带有认证的 dio 实例
  void _setupAuthenticatedDio() {
    if (_authToken != null) {
      // 移除现有的认证拦截器（如果有）
      _dio.interceptors.removeWhere(
        (interceptor) => interceptor is AuthInterceptor,
      );

      // 添加新的认证拦截器
      _dio.interceptors.add(AuthInterceptor(_authToken!));
    }
  }

  // 登出并清除令牌
  void logout() {
    _authToken = null;
    // 移除认证拦截器
    _dio.interceptors.removeWhere(
      (interceptor) => interceptor is AuthInterceptor,
    );
  }

  // 发送认证请求
  Future<dynamic> authenticatedRequest(String url) async {
    if (_authToken == null) {
      throw Exception('Not authenticated');
    }

    try {
      final response = await _dio.get(url);
      return response.data;
    } catch (e) {
      print('Authenticated request failed: $e');
      rethrow;
    }
  }
}
```

### 10.3 可测试性

1. **依赖注入**
   - 使网络服务可注入，便于测试

```dart
// 抽象网络服务接口
abstract class NetworkService {
  Future<dynamic> get(String url);
  Future<dynamic> post(String url, {dynamic data});
  Future<dynamic> put(String url, {dynamic data});
  Future<dynamic> delete(String url);
}

// 实现网络服务
class NetworkServiceImpl implements NetworkService {
  final Dio _dio;

  NetworkServiceImpl(this._dio);

  @override
  Future<dynamic> get(String url) async {
    final response = await _dio.get(url);
    return response.data;
  }

  @override
  Future<dynamic> post(String url, {dynamic data}) async {
    final response = await _dio.post(url, data: data);
    return response.data;
  }

  @override
  Future<dynamic> put(String url, {dynamic data}) async {
    final response = await _dio.put(url, data: data);
    return response.data;
  }

  @override
  Future<dynamic> delete(String url) async {
    final response = await _dio.delete(url);
    return response.data;
  }
}

// 在服务类中使用依赖注入
class UserService {
  final NetworkService _networkService;

  UserService(this._networkService);

  Future<dynamic> fetchUserProfile(int userId) async {
    return await _networkService.get('/users/$userId');
  }

  Future<dynamic> updateUserProfile(int userId, Map<String, dynamic> data) async {
    return await _networkService.put('/users/$userId', data: data);
  }
}

// 测试实现
class MockNetworkService implements NetworkService {
  @override
  Future<dynamic> get(String url) async {
    // 返回模拟数据
    if (url.contains('/users/')) {
      final userId = url.split('/').last;
      return {
        'id': int.parse(userId),
        'name': 'Test User',
        'email': 'test@example.com',
      };
    }
    return null;
  }

  @override
  Future<dynamic> post(String url, {dynamic data}) async {
    // 返回模拟响应
    return {...data, 'id': 1, 'createdAt': DateTime.now().toIso8601String()};
  }

  @override
  Future<dynamic> put(String url, {dynamic data}) async {
    // 返回模拟响应
    return {...data, 'updatedAt': DateTime.now().toIso8601String()};
  }

  @override
  Future<dynamic> delete(String url) async {
    // 返回模拟响应
    return {'success': true};
  }
}
```

### 10.4 国际化和本地化

```dart
import 'package:flutter/material.dart';
import 'package:dio/dio.dart';

class LocalizedNetworkService {
  final Dio _dio;
  final String _locale;

  LocalizedNetworkService(this._dio, this._locale) {
    // 设置默认的 Accept-Language 头
    _dio.options.headers['Accept-Language'] = _locale;
  }

  // 更新语言设置
  void updateLocale(String locale) {
    _dio.options.headers['Accept-Language'] = locale;
  }

  // 发送本地化请求
  Future<dynamic> getLocalizedData(String url) async {
    try {
      final response = await _dio.get(url);
      return response.data;
    } catch (e) {
      print('Localized request failed: $e');
      rethrow;
    }
  }
}

// 在应用中使用
class MyApp extends StatefulWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  late LocalizedNetworkService _networkService;
  String _currentLocale = 'en-US';

  @override
  void initState() {
    super.initState();
    _networkService = LocalizedNetworkService(Dio(), _currentLocale);
  }

  void _changeLanguage(String locale) {
    setState(() {
      _currentLocale = locale;
      _networkService.updateLocale(locale);
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Localized Network Example',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: Scaffold(
        appBar: AppBar(title: const Text('Localized Network')),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text('Current Language: $_currentLocale'),
              ElevatedButton(
                onPressed: () => _changeLanguage('en-US'),
                child: const Text('English'),
              ),
              ElevatedButton(
                onPressed: () => _changeLanguage('zh-CN'),
                child: const Text('中文'),
              ),
              ElevatedButton(
                onPressed: () => _changeLanguage('es-ES'),
                child: const Text('Español'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

## 11. 总结

Flutter 提供了多种方式来处理网络请求，从基本的 `http` 包到功能强大的 `dio` 包。在实际开发中，应根据项目需求选择合适的网络请求库和模式。

主要网络请求技术包括：

- **基本请求**：GET、POST、PUT、DELETE 等 HTTP 方法
- **错误处理**：处理网络错误、超时和服务器错误
- **重试机制**：在失败时自动重试请求
- **拦截器**：统一处理请求/响应、认证、日志等
- **文件上传下载**：处理文件传输和进度监控
- **WebSocket**：实时双向通信
- **缓存策略**：减少网络请求，提高性能
- **安全实践**：HTTPS、认证授权、数据验证等

遵循最佳实践，如使用 Repository 模式、依赖注入、适当的缓存策略和错误处理，可以构建出健壮、高效的网络层，为应用提供良好的用户体验。