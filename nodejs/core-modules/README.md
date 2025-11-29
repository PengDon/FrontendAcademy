# Node.js 核心模块详解

## Node.js 概述

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时环境，使开发者能够在服务器端使用 JavaScript 进行编程。Node.js 采用事件驱动、非阻塞 I/O 模型，使其轻量且高效，特别适合构建数据密集型的实时应用。

## 核心模块介绍

### 1. fs - 文件系统模块

`fs` 模块提供了文件读写、目录操作等功能，支持同步和异步操作。

#### 异步文件操作

```javascript
const fs = require('fs');

// 读取文件
fs.readFile('example.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('读取文件失败:', err);
    return;
  }
  console.log('文件内容:', data);
});

// 写入文件
const content = '这是新写入的内容';
fs.writeFile('output.txt', content, (err) => {
  if (err) {
    console.error('写入文件失败:', err);
    return;
  }
  console.log('文件写入成功');
});

// 追加内容
fs.appendFile('output.txt', '\n追加的内容', (err) => {
  if (err) {
    console.error('追加内容失败:', err);
    return;
  }
  console.log('内容追加成功');
});

// 创建目录
fs.mkdir('new-directory', (err) => {
  if (err) {
    console.error('创建目录失败:', err);
    return;
  }
  console.log('目录创建成功');
});

// 读取目录
fs.readdir('./', (err, files) => {
  if (err) {
    console.error('读取目录失败:', err);
    return;
  }
  console.log('目录内容:', files);
});
```

#### 同步文件操作

```javascript
const fs = require('fs');

// 同步读取文件
try {
  const data = fs.readFileSync('example.txt', 'utf8');
  console.log('文件内容:', data);
} catch (err) {
  console.error('读取文件失败:', err);
}

// 同步写入文件
try {
  fs.writeFileSync('output.txt', '这是同步写入的内容');
  console.log('文件写入成功');
} catch (err) {
  console.error('写入文件失败:', err);
}

// 同步追加内容
try {
  fs.appendFileSync('output.txt', '\n同步追加的内容');
  console.log('内容追加成功');
} catch (err) {
  console.error('追加内容失败:', err);
}

// 同步创建目录
try {
  fs.mkdirSync('new-directory');
  console.log('目录创建成功');
} catch (err) {
  console.error('创建目录失败:', err);
}
```

#### 使用 Promise API

```javascript
const fs = require('fs').promises;

async function fileOperations() {
  try {
    // 读取文件
    const data = await fs.readFile('example.txt', 'utf8');
    console.log('文件内容:', data);
    
    // 写入文件
    await fs.writeFile('output.txt', '使用Promise写入');
    console.log('文件写入成功');
    
    // 创建目录
    await fs.mkdir('promise-directory', { recursive: true });
    console.log('目录创建成功');
  } catch (err) {
    console.error('操作失败:', err);
  }
}

fileOperations();
```

### 2. path - 路径模块

`path` 模块提供了处理文件路径的工具函数。

```javascript
const path = require('path');

// 路径合并
const joinedPath = path.join('/目录1', '目录2', 'file.txt');
console.log('合并后的路径:', joinedPath); // 输出: /目录1/目录2/file.txt

// 获取绝对路径
const absolutePath = path.resolve('./file.txt');
console.log('绝对路径:', absolutePath);

// 获取路径的目录名
const dirName = path.dirname('/目录1/目录2/file.txt');
console.log('目录名:', dirName); // 输出: /目录1/目录2

// 获取文件名
const baseName = path.basename('/目录1/目录2/file.txt');
console.log('文件名:', baseName); // 输出: file.txt

const baseNameWithoutExt = path.basename('/目录1/目录2/file.txt', '.txt');
console.log('不带扩展名的文件名:', baseNameWithoutExt); // 输出: file

// 获取文件扩展名
const extName = path.extname('/目录1/目录2/file.txt');
console.log('扩展名:', extName); // 输出: .txt

// 解析路径
const parsedPath = path.parse('/目录1/目录2/file.txt');
console.log('解析后的路径对象:', parsedPath);
/*
输出:
{
  root: '/',
  dir: '/目录1/目录2',
  base: 'file.txt',
  ext: '.txt',
  name: 'file'
}
*/

// 格式化路径对象为字符串
const formattedPath = path.format(parsedPath);
console.log('格式化后的路径:', formattedPath); // 输出: /目录1/目录2/file.txt

// 检查是否为绝对路径
console.log('是否为绝对路径:', path.isAbsolute('/目录1/file.txt')); // true
console.log('是否为绝对路径:', path.isAbsolute('目录1/file.txt')); // false

// 获取规范化的路径
console.log('规范化的路径:', path.normalize('/目录1/../目录2/file.txt')); // /目录2/file.txt
```

### 3. http - HTTP 模块

`http` 模块允许创建 HTTP 服务器和客户端。

#### 创建 HTTP 服务器

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  // 设置响应头
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  
  // 根据不同的URL路径返回不同内容
  if (req.url === '/') {
    res.end('Hello, World!');
  } else if (req.url === '/about') {
    res.end('About Page');
  } else {
    res.writeHead(404);
    res.end('Page Not Found');
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
```

#### 发送 HTTP 请求

```javascript
const http = require('http');

const options = {
  hostname: 'jsonplaceholder.typicode.com',
  path: '/posts/1',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  
  // 接收响应数据
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  // 响应完成
  res.on('end', () => {
    console.log('响应数据:', JSON.parse(data));
  });
});

// 处理错误
req.on('error', (error) => {
  console.error('请求错误:', error);
});

// 结束请求
req.end();
```

#### 使用 HTTPS

```javascript
const https = require('https');

// 创建HTTPS服务器需要SSL证书和密钥
// const server = https.createServer({
//   key: fs.readFileSync('key.pem'),
//   cert: fs.readFileSync('cert.pem')
// }, (req, res) => {
//   res.writeHead(200);
//   res.end('HTTPS Server');
// });

// 发送HTTPS请求
https.get('https://jsonplaceholder.typicode.com/posts/1', (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('HTTPS响应:', JSON.parse(data));
  });
}).on('error', (error) => {
  console.error('HTTPS请求错误:', error);
});
```

### 4. url - URL 模块

`url` 模块提供了 URL 解析和格式化的功能。

```javascript
const url = require('url');

// 解析URL
const parsedUrl = url.parse('https://user:pass@example.com:8080/path?query=string#hash');
console.log('解析后的URL对象:', parsedUrl);
/*
输出:
{
  protocol: 'https:',
  slashes: true,
  auth: 'user:pass',
  host: 'example.com:8080',
  port: '8080',
  hostname: 'example.com',
  hash: '#hash',
  search: '?query=string',
  query: 'query=string',
  pathname: '/path',
  path: '/path?query=string',
  href: 'https://user:pass@example.com:8080/path?query=string#hash'
}
*/

// 使用新的 URL API (更推荐)
const myUrl = new URL('https://example.com/path?query=string#hash');
console.log('URL主机名:', myUrl.hostname); // example.com
console.log('URL路径:', myUrl.pathname); // /path
console.log('URL查询:', myUrl.search); // ?query=string
console.log('URL查询参数:', myUrl.searchParams.get('query')); // string

// 添加查询参数
myUrl.searchParams.append('page', '1');
console.log('添加参数后的URL:', myUrl.toString()); // https://example.com/path?query=string&page=1#hash

// 格式化URL对象
const urlObject = {
  protocol: 'https:',
  hostname: 'example.com',
  pathname: '/api/users',
  query: { id: '123' }
};

// Node.js 10+推荐使用URL构造函数
const constructedUrl = new URL(`/api/users?id=${urlObject.query.id}`, `https://${urlObject.hostname}`);
console.log('构造的URL:', constructedUrl.toString());
```

### 5. querystring - 查询字符串模块

`querystring` 模块提供了解析和格式化 URL 查询字符串的功能。

```javascript
const querystring = require('querystring');

// 解析查询字符串
const parsed = querystring.parse('name=John&age=30&city=New%20York');
console.log('解析结果:', parsed);
// 输出: { name: 'John', age: '30', city: 'New York' }

// 格式化对象为查询字符串
const obj = { name: 'John', age: 30, city: 'New York' };
const formatted = querystring.stringify(obj);
console.log('格式化结果:', formatted);
// 输出: name=John&age=30&city=New%20York

// 使用自定义分隔符和赋值符
const customFormatted = querystring.stringify(obj, ';', ':');
console.log('自定义格式化结果:', customFormatted);
// 输出: name:John;age:30;city:New%20York

// 编码和解码
const encoded = querystring.escape('Hello World!');
console.log('编码结果:', encoded); // Hello%20World%21

const decoded = querystring.unescape(encoded);
console.log('解码结果:', decoded); // Hello World!
```

### 6. os - 操作系统模块

`os` 模块提供了与操作系统相关的实用方法和属性。

```javascript
const os = require('os');

// 获取操作系统信息
console.log('操作系统类型:', os.type()); // Linux、Windows_NT等
console.log('操作系统平台:', os.platform()); // linux、win32等
console.log('操作系统架构:', os.arch()); // x64、arm等
console.log('操作系统版本:', os.release()); // 内核版本号

// 获取CPU信息
console.log('CPU信息:', os.cpus());

// 获取内存信息
console.log('总内存(字节):', os.totalmem());
console.log('空闲内存(字节):', os.freemem());

// 获取主机名
console.log('主机名:', os.hostname());

// 获取网络接口信息
console.log('网络接口:', os.networkInterfaces());

// 获取临时目录
console.log('临时目录:', os.tmpdir());

// 获取用户信息
console.log('用户信息:', os.userInfo());

// 获取系统正常运行时间
console.log('系统运行时间(秒):', os.uptime());
```

### 7. process - 进程模块

`process` 模块提供了与当前 Node.js 进程交互的接口。

```javascript
const process = require('process');

// 获取命令行参数
console.log('命令行参数:', process.argv);

// 获取环境变量
console.log('NODE_ENV:', process.env.NODE_ENV);

// 设置环境变量
process.env.MY_VARIABLE = 'my-value';

// 获取当前工作目录
console.log('当前工作目录:', process.cwd());

// 更改工作目录
// process.chdir('../');

// 获取进程ID
console.log('进程ID:', process.pid);
console.log('父进程ID:', process.ppid);

// 获取Node.js版本
console.log('Node.js版本:', process.version);

// 获取运行环境信息
console.log('运行环境:', process.platform, process.arch);

// 进程退出
// process.exit(0); // 成功退出
// process.exit(1); // 错误退出

// 捕获进程信号
process.on('SIGINT', () => {
  console.log('收到SIGINT信号，正在退出...');
  process.exit(0);
});

// 处理未捕获的异常
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
  process.exit(1);
});

// 处理未处理的Promise拒绝
process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的Promise拒绝:', reason);
});

// 获取CPU使用情况
const cpuUsage = process.cpuUsage();
console.log('CPU使用情况:', cpuUsage);

// 内存使用情况
const memoryUsage = process.memoryUsage();
console.log('内存使用情况:', memoryUsage);
```

### 8. events - 事件模块

`events` 模块提供了事件触发和事件监听器功能，是 Node.js 异步事件驱动架构的核心。

```javascript
const EventEmitter = require('events');

// 创建自定义事件发射器类
class MyEmitter extends EventEmitter {}

// 创建实例
const myEmitter = new MyEmitter();

// 添加事件监听器
myEmitter.on('event', (arg1, arg2) => {
  console.log('事件触发了!', arg1, arg2);
});

// 一次性事件监听器
myEmitter.once('oneTimeEvent', () => {
  console.log('这个监听器只会触发一次');
});

// 触发事件
myEmitter.emit('event', '参数1', '参数2');
myEmitter.emit('oneTimeEvent');
myEmitter.emit('oneTimeEvent'); // 这次不会触发监听器

// 错误处理
myEmitter.on('error', (err) => {
  console.error('捕获到错误:', err.message);
});

// 触发错误事件
myEmitter.emit('error', new Error('测试错误事件'));

// 获取事件监听器数量
console.log('event事件的监听器数量:', myEmitter.listenerCount('event'));

// 获取所有监听器
const listeners = myEmitter.listeners('event');
console.log('所有监听器:', listeners);

// 移除特定监听器
function listener() {
  console.log('这个监听器将被移除');
}

myEmitter.on('removeEvent', listener);
myEmitter.emit('removeEvent');
myEmitter.removeListener('removeEvent', listener);
myEmitter.emit('removeEvent'); // 不会触发监听器

// 移除所有监听器
myEmitter.removeAllListeners('event');
console.log('移除所有监听器后数量:', myEmitter.listenerCount('event'));
```

### 9. stream - 流模块

`stream` 模块提供了处理流数据的功能，Node.js 中有四种基本流类型：Readable（可读流）、Writable（可写流）、Duplex（双工流）和 Transform（转换流）。

#### 可读流

```javascript
const fs = require('fs');

// 创建可读流
const readableStream = fs.createReadStream('large-file.txt', {
  encoding: 'utf8',
  highWaterMark: 1024 // 缓冲区大小，默认64KB
});

// 监听数据事件
readableStream.on('data', (chunk) => {
  console.log(`读取到 ${chunk.length} 字节的数据`);
  console.log(chunk);
});

// 监听结束事件
readableStream.on('end', () => {
  console.log('数据读取完成');
});

// 监听错误事件
readableStream.on('error', (err) => {
  console.error('读取错误:', err);
});

// 暂停和恢复流
readableStream.on('data', (chunk) => {
  console.log('暂停流...');
  readableStream.pause();
  
  // 2秒后恢复流
  setTimeout(() => {
    console.log('恢复流...');
    readableStream.resume();
  }, 2000);
});
```

#### 可写流

```javascript
const fs = require('fs');

// 创建可写流
const writableStream = fs.createWriteStream('output.txt');

// 写入数据
writableStream.write('这是第一行数据\n', 'utf8', () => {
  console.log('第一行写入完成');
});

writableStream.write('这是第二行数据\n', 'utf8', () => {
  console.log('第二行写入完成');
});

// 结束写入
writableStream.end('这是最后一行数据\n', () => {
  console.log('所有数据写入完成');
  console.log(`总共写入 ${writableStream.bytesWritten} 字节`);
});

// 监听错误事件
writableStream.on('error', (err) => {
  console.error('写入错误:', err);
});

// 监听完成事件
writableStream.on('finish', () => {
  console.log('写入完成事件触发');
});
```

#### 管道流

```javascript
const fs = require('fs');

// 创建可读流和可写流
const readableStream = fs.createReadStream('input.txt');
const writableStream = fs.createWriteStream('output-piped.txt');

// 使用管道连接流
readableStream.pipe(writableStream);

// 监听完成事件
writableStream.on('finish', () => {
  console.log('管道操作完成');
});

// 链式管道
// readableStream.pipe(transformStream).pipe(writableStream);
```

#### 转换流

```javascript
const { Transform } = require('stream');

// 创建自定义转换流
const upperCaseTransform = new Transform({
  transform(chunk, encoding, callback) {
    // 将数据转换为大写
    const transformed = chunk.toString().toUpperCase();
    callback(null, transformed);
  }
});

// 使用转换流
process.stdin.pipe(upperCaseTransform).pipe(process.stdout);
console.log('输入文本将被转换为大写:');
```

### 10. buffer - 缓冲区模块

`Buffer` 类用于处理二进制数据，可以在 TCP 流、文件操作、图片处理等场景中使用。

```javascript
// 创建Buffer
// 方法1: 从字符串创建
const buf1 = Buffer.from('Hello, World!', 'utf8');
console.log('Buffer1:', buf1);
console.log('Buffer1内容:', buf1.toString());

// 方法2: 从数组创建
const buf2 = Buffer.from([0x48, 0x65, 0x6c, 0x6c, 0x6f]);
console.log('Buffer2内容:', buf2.toString());

// 方法3: 创建指定大小的Buffer
const buf3 = Buffer.alloc(10);
console.log('空Buffer3:', buf3);

// 填充Buffer
buf3.fill(0x42); // 填充字符'B'
console.log('填充后的Buffer3:', buf3.toString());

// 写入Buffer
const buf4 = Buffer.alloc(256);
const len = buf4.write('Hello, Node.js');
console.log(`写入了 ${len} 个字节`);
console.log('Buffer4内容:', buf4.toString('utf8', 0, len));

// 读取Buffer中的数据
for (let i = 0; i < 26; i++) {
  buf4[i] = i + 97; // ASCII 97 = 'a'
}
console.log('Buffer4中的字母:', buf4.toString('utf8', 0, 26));

// 合并Buffer
const buf5 = Buffer.from('Hello');
const buf6 = Buffer.from(' World!');
const buf7 = Buffer.concat([buf5, buf6]);
console.log('合并后的Buffer:', buf7.toString());

// 比较Buffer
const buf8 = Buffer.from('ABC');
const buf9 = Buffer.from('ABD');
console.log('Buffer比较结果:', buf8.compare(buf9)); // -1, buf8在buf9前面

// 复制Buffer
const buf10 = Buffer.from('Hello');
const buf11 = Buffer.alloc(5);
buf10.copy(buf11);
console.log('复制的Buffer:', buf11.toString());

// 切片Buffer
const buf12 = Buffer.from('Hello, World!');
const buf13 = buf12.slice(7, 12);
console.log('Buffer切片:', buf13.toString()); // World

// 注意: 切片与原Buffer共享内存
```

## Node.js 模块系统

### CommonJS 模块系统

Node.js 默认使用 CommonJS 模块系统，通过 `require()` 和 `module.exports` 进行模块导入导出。

```javascript
// 导出模块 (math.js)
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

// 方式1: 导出对象
module.exports = {
  add,
  subtract
};

// 方式2: 直接导出函数
// module.exports = add;

// 方式3: 导出单个属性
// exports.add = add;
// exports.subtract = subtract;

// 导入模块 (app.js)
const math = require('./math');
console.log(math.add(5, 3)); // 8
console.log(math.subtract(5, 3)); // 2

// 或者使用解构赋值
const { add, subtract } = require('./math');
console.log(add(5, 3)); // 8
```

### ES 模块

Node.js 也支持 ES 模块（ES6+），通过 `import` 和 `export` 语句进行模块导入导出。

```javascript
// 启用ES模块: 
// 1. 使用.mjs扩展名
// 或 
// 2. 在package.json中设置 "type": "module"

// 导出模块 (math.js)
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

// 或者默认导出
export default {
  add,
  subtract
};

// 导入模块 (app.js)
import { add, subtract } from './math.js';
console.log(add(5, 3)); // 8

// 或者导入默认导出
import math from './math.js';
console.log(math.add(5, 3)); // 8
```

## 异步编程

### 回调函数

回调函数是 Node.js 中最基本的异步编程模式。

```javascript
const fs = require('fs');

// 回调函数模式
function readFileCallback(filename, callback) {
  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) {
      return callback(err);
    }
    callback(null, data);
  });
}

readFileCallback('example.txt', (err, data) => {
  if (err) {
    console.error('读取文件失败:', err);
    return;
  }
  console.log('文件内容:', data);
});
```

### Promise

Promise 提供了一种更优雅的方式来处理异步操作。

```javascript
const fs = require('fs').promises;

// 使用Promise
function readFilePromise(filename) {
  return fs.readFile(filename, 'utf8');
}

readFilePromise('example.txt')
  .then(data => {
    console.log('文件内容:', data);
    return processData(data);
  })
  .then(result => {
    console.log('处理结果:', result);
  })
  .catch(err => {
    console.error('操作失败:', err);
  });

function processData(data) {
  // 模拟数据处理
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(data.toUpperCase());
    }, 1000);
  });
}
```

### Async/Await

Async/Await 是基于 Promise 的语法糖，使异步代码看起来更像同步代码。

```javascript
const fs = require('fs').promises;

// 使用async/await
async function readAndProcessFile(filename) {
  try {
    const data = await fs.readFile(filename, 'utf8');
    console.log('文件内容:', data);
    
    const result = await processData(data);
    console.log('处理结果:', result);
    
    return result;
  } catch (err) {
    console.error('操作失败:', err);
    throw err;
  }
}

readAndProcessFile('example.txt')
  .then(result => {
    console.log('最终结果:', result);
  })
  .catch(err => {
    console.error('捕获到错误:', err);
  });
```

## 常见问题与答案

### 1. Node.js 中的同步和异步操作有什么区别？
**答案：** 
- **同步操作**：阻塞线程，直到操作完成才继续执行后续代码。例如 `fs.readFileSync()`。
- **异步操作**：不阻塞线程，操作在后台进行，完成后通过回调函数通知。例如 `fs.readFile()`。
- **使用场景**：
  - 同步操作适用于初始化、配置加载等一次性操作
  - 异步操作适用于I/O密集型任务，如文件读写、网络请求等
  - 在服务器应用中，应优先使用异步操作以保持高并发性能

### 2. 如何处理 Node.js 中的错误？
**答案：** 
- **回调模式**：通过错误优先回调（Error-First Callback）处理错误
  ```javascript
  fs.readFile('file.txt', (err, data) => {
    if (err) {
      console.error('错误:', err);
      return;
    }
    // 处理数据
  });
  ```
- **Promise模式**：使用 `.catch()` 捕获错误
  ```javascript
  somePromise()
    .then(data => { /* 处理数据 */ })
    .catch(err => { console.error('错误:', err); });
  ```
- **Async/Await模式**：使用 try-catch 捕获错误
  ```javascript
  async function() {
    try {
      const data = await somePromise();
      // 处理数据
    } catch (err) {
      console.error('错误:', err);
    }
  }
  ```
- **全局错误处理**：监听 `process` 对象的 `uncaughtException` 和 `unhandledRejection` 事件

### 3. 什么是事件循环（Event Loop）？
**答案：** 
- 事件循环是 Node.js 处理非阻塞 I/O 操作的核心机制
- 它允许 Node.js 执行非阻塞 I/O 操作，即使 JavaScript 是单线程的
- 事件循环的主要阶段：
  1. Timers: 执行 setTimeout 和 setInterval 的回调
  2. Pending Callbacks: 执行 I/O 回调
  3. Idle, Prepare: 内部使用
  4. Poll: 获取新的 I/O 事件
  5. Check: 执行 setImmediate 的回调
  6. Close Callbacks: 执行关闭事件的回调
- 事件循环使 Node.js 能够处理大量并发连接，而不会为每个连接创建新的线程

### 4. 如何优化 Node.js 应用的性能？
**答案：** 
- **使用异步操作**：避免使用阻塞式同步操作
- **代码模块化**：合理组织代码，提高可维护性和可重用性
- **使用缓存**：缓存频繁访问的数据，减少重复计算和 I/O 操作
- **数据库优化**：使用索引、连接池，避免 N+1 查询问题
- **负载均衡**：使用集群模式（cluster 模块）充分利用多核 CPU
- **监控与分析**：使用工具监控应用性能，找出瓶颈
- **优化依赖**：定期更新依赖，移除未使用的依赖
- **使用流处理**：对于大文件和数据流，使用流（Stream）处理

### 5. 如何在 Node.js 中实现文件上传？
**答案：** 
- 对于简单的文件上传，可以使用 `express` 配合 `multer` 中间件
- 对于大文件，可以考虑使用流式处理或分片上传
- 实现步骤：
  1. 安装必要的依赖：`npm install express multer`
  2. 配置 multer 中间件，设置上传目录和文件大小限制
  3. 创建处理文件上传的路由
  4. 在前端创建带有 `enctype="multipart/form-data"` 的表单
  5. 添加文件验证、错误处理和安全措施

### 6. 什么是中间件，如何创建自定义中间件？
**答案：** 
- 中间件是处理 HTTP 请求的函数，可以访问请求对象、响应对象和下一个中间件函数
- 中间件可以执行以下任务：
  - 执行任何代码
  - 修改请求和响应对象
  - 结束请求-响应周期
  - 调用下一个中间件
- 创建自定义中间件示例：
  ```javascript
  const express = require('express');
  const app = express();
  
  // 自定义日志中间件
  const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
  };
  
  // 应用中间件
  app.use(logger);
  
  app.get('/', (req, res) => {
    res.send('Hello World!');
  });
  ```

### 7. 如何实现 Node.js 应用的身份验证？
**答案：** 
- **会话认证**：使用 `express-session` 或 `cookie-session`
- **Token认证**：使用 JWT (JSON Web Tokens)
- JWT 实现步骤：
  1. 安装必要的依赖：`npm install jsonwebtoken bcrypt`
  2. 创建用户注册和登录路由
  3. 登录成功后生成 JWT 令牌
  4. 创建验证令牌的中间件
  5. 保护需要认证的路由
- 安全考虑：
  - 使用强密钥签名 JWT
  - 设置合理的过期时间
  - 考虑令牌刷新机制
  - 实现安全的密码存储（使用 bcrypt 哈希）

### 8. 如何处理 Node.js 应用中的跨域请求？
**答案：** 
- 使用 `cors` 中间件允许跨域资源共享
- 基本实现：
  ```javascript
  const express = require('express');
  const cors = require('cors');
  const app = express();
  
  // 允许所有跨域请求
  app.use(cors());
  
  // 或配置特定的来源
  app.use(cors({
    origin: 'https://example.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));
  ```
- 对于生产环境，应限制允许的来源，而不是使用通配符

### 9. 如何实现 Node.js 应用的日志记录？
**答案：** 
- **简单日志**：使用 `console.log` 和 `console.error`（仅适用于开发环境）
- **结构化日志**：使用 `winston`、`bunyan` 等日志库
- Winston 实现示例：
  ```javascript
  const winston = require('winston');
  
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' })
    ]
  });
  
  // 开发环境添加控制台输出
  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple()
    }));
  }
  
  logger.info('应用启动');
  logger.error('发生错误', { error: err.message });
  ```
- 考虑日志轮转、集中式日志管理和日志分析工具

### 10. Node.js 适合哪些类型的应用？
**答案：** 
- **API服务**：高性能的 RESTful API 和 GraphQL API
- **实时应用**：聊天应用、协作工具、实时数据仪表盘（使用 Socket.io）
- **微服务架构**：轻量级的微服务，易于水平扩展
- **全栈 JavaScript**：前后端使用同一种语言，提高开发效率
- **I/O密集型应用**：需要处理大量并发连接的应用
- **数据流处理**：实时数据流、ETL 进程、日志处理
- **不适合**：CPU密集型任务（除非使用子进程或 worker threads）