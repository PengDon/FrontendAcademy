# JavaScript 错误处理

错误处理是编程中非常重要的一部分，它可以帮助我们在程序出错时提供有用的信息，并优雅地处理异常情况。在 JavaScript 中，我们可以使用多种方式来处理错误。

## 1. 错误的类型

JavaScript 中有多种内置的错误类型，它们都是 `Error` 对象的子类：

### 1.1 SyntaxError

语法错误，当 JavaScript 代码存在语法错误时抛出。

```javascript
// 示例：缺少闭合括号
console.log("Hello world;

// 示例：使用未声明的关键字
let let = 10;
```

### 1.2 ReferenceError

引用错误，当尝试访问未定义的变量或函数时抛出。

```javascript
// 示例：访问未声明的变量
console.log(undefinedVariable);

// 示例：调用未定义的函数
undefinedFunction();
```

### 1.3 TypeError

类型错误，当操作数的类型不符合预期时抛出。

```javascript
// 示例：尝试调用非函数的对象
let nonFunction = "Hello";
nonFunction();

// 示例：尝试访问 null 或 undefined 的属性
let obj = null;
console.log(obj.property);
```

### 1.4 RangeError

范围错误，当数值超出有效范围时抛出。

```javascript
// 示例：数组长度为负数
let array = new Array(-1);

// 示例：数值超出有效范围
console.log(Number.MAX_VALUE * 2); // Infinity
console.log(Number.MIN_VALUE / 2); // 0
```

### 1.5 URIError

URI 错误，当使用 `encodeURI()` 或 `decodeURI()` 等 URI 处理函数时参数无效时抛出。

```javascript
// 示例：无效的 URI
decodeURIComponent("%E0%A4%A"); // 无效的十六进制序列
```

### 1.6 EvalError

Eval 错误，当使用 `eval()` 函数时发生错误时抛出。在现代 JavaScript 中很少使用。

## 2. 错误处理机制

### 2.1 try...catch 语句

`try...catch` 语句用于捕获和处理错误：

```javascript
try {
  // 可能会抛出错误的代码
  let result = 10 / 0;
  console.log(result);
  
  // 尝试访问未定义的变量
  console.log(undefinedVariable);
} catch (error) {
  // 错误处理代码
  console.error("发生错误:", error.message);
  console.error("错误类型:", error.name);
  console.error("错误堆栈:", error.stack);
}
```

### 2.2 try...catch...finally 语句

`finally` 块中的代码无论是否发生错误都会执行：

```javascript
try {
  // 可能会抛出错误的代码
  let result = 10 / 0;
  console.log(result);
} catch (error) {
  // 错误处理代码
  console.error("发生错误:", error.message);
} finally {
  // 无论是否发生错误都会执行的代码
  console.log("操作完成");
}
```

### 2.3 嵌套的 try...catch 语句

可以在 `try` 块中嵌套另一个 `try...catch` 语句：

```javascript
try {
  console.log("外层 try 块");
  
  try {
    console.log("内层 try 块");
    throw new Error("内层错误");
  } catch (innerError) {
    console.error("捕获内层错误:", innerError.message);
    throw new Error("从内层抛出的错误");
  }
} catch (outerError) {
  console.error("捕获外层错误:", outerError.message);
} finally {
  console.log("外层 finally 块");
}
```

## 3. 抛出错误

我们可以使用 `throw` 语句手动抛出错误：

```javascript
// 抛出基本错误
throw new Error("发生了一个错误");

// 抛出特定类型的错误
throw new TypeError("参数类型错误");

// 抛出自定义错误信息
throw "自定义错误消息";

// 抛出对象
throw { 
  name: "CustomError", 
  message: "自定义错误",
  code: 404
};
```

## 4. 自定义错误类型

我们可以创建自定义的错误类型，继承自内置的 `Error` 对象：

```javascript
// 创建自定义错误类型
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
    this.timestamp = new Date();
  }
}

// 使用自定义错误类型
function validateUser(user) {
  if (!user.name) {
    throw new ValidationError("用户名不能为空", "name");
  }
  
  if (!user.email) {
    throw new ValidationError("邮箱不能为空", "email");
  }
  
  // 简单的邮箱格式验证
  if (!user.email.includes("@")) {
    throw new ValidationError("邮箱格式错误", "email");
  }
}

// 测试自定义错误
const user = { 
  name: "张三",
  email: "invalid-email" 
};

try {
  validateUser(user);
  console.log("用户验证通过");
} catch (error) {
  if (error instanceof ValidationError) {
    console.error(`${error.name}: ${error.message} (字段: ${error.field})`);
    console.error(`发生时间: ${error.timestamp}`);
  } else {
    console.error("发生未知错误:", error.message);
  }
}
```

## 5. 异步错误处理

### 5.1 回调函数中的错误处理

在回调函数中，通常使用第一个参数作为错误对象：

```javascript
function readFile(filename, callback) {
  // 模拟异步文件读取
  setTimeout(() => {
    try {
      // 模拟文件不存在的情况
      if (filename === "non-existent.txt") {
        throw new Error("文件不存在");
      }
      
      // 模拟读取到的文件内容
      const content = "文件内容";
      callback(null, content);
    } catch (error) {
      callback(error, null);
    }
  }, 1000);
}

// 使用回调函数
readFile("non-existent.txt", (error, content) => {
  if (error) {
    console.error("读取文件时发生错误:", error.message);
    return;
  }
  
  console.log("文件内容:", content);
});
```

### 5.2 Promise 中的错误处理

在 Promise 中，我们可以使用 `catch()` 方法来处理错误：

```javascript
function readFile(filename) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        if (filename === "non-existent.txt") {
          throw new Error("文件不存在");
        }
        
        const content = "文件内容";
        resolve(content);
      } catch (error) {
        reject(error);
      }
    }, 1000);
  });
}

// 使用 Promise
readFile("non-existent.txt")
  .then(content => {
    console.log("文件内容:", content);
  })
  .catch(error => {
    console.error("读取文件时发生错误:", error.message);
  })
  .finally(() => {
    console.log("操作完成");
  });
```

### 5.3 async/await 中的错误处理

在 `async/await` 中，我们可以使用 `try...catch` 来处理错误：

```javascript
function readFile(filename) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (filename === "non-existent.txt") {
        reject(new Error("文件不存在"));
      } else {
        resolve("文件内容");
      }
    }, 1000);
  });
}

// 使用 async/await
async function readFileAsync() {
  try {
    const content = await readFile("non-existent.txt");
    console.log("文件内容:", content);
  } catch (error) {
    console.error("读取文件时发生错误:", error.message);
  } finally {
    console.log("操作完成");
  }
}

readFileAsync();
```

## 6. 全局错误处理

### 6.1 window.onerror (浏览器环境)

在浏览器环境中，我们可以使用 `window.onerror` 事件来捕获全局错误：

```javascript
window.onerror = function(message, source, lineno, colno, error) {
  console.error("全局错误:", {
    message: message,
    source: source,
    lineno: lineno,
    colno: colno,
    error: error
  });
  
  // 返回 true 可以阻止浏览器显示默认错误信息
  return true;
};
```

### 6.2 process.on('uncaughtException') (Node.js 环境)

在 Node.js 环境中，我们可以使用 `process.on('uncaughtException')` 来捕获未处理的异常：

```javascript
process.on('uncaughtException', (error) => {
  console.error("未捕获的异常:", error);
  // 做一些清理工作
  process.exit(1); // 退出进程
});
```

### 6.3 process.on('unhandledRejection') (Node.js 环境)

在 Node.js 环境中，我们可以使用 `process.on('unhandledRejection')` 来捕获未处理的 Promise 拒绝：

```javascript
process.on('unhandledRejection', (reason, promise) => {
  console.error("未处理的 Promise 拒绝:", reason);
  console.error("Promise:", promise);
});
```

## 7. 错误处理的最佳实践

### 7.1 具体的错误信息

错误信息应该清晰、具体，包含足够的上下文信息，以便于调试：

```javascript
// 不好的错误信息
throw new Error("错误");

// 好的错误信息
throw new Error(`无法读取文件 ${filename}: 文件不存在`);
```

### 7.2 只捕获预期的错误

只捕获你知道如何处理的错误，不要捕获所有错误：

```javascript
// 不好的做法

try {
  // 可能会抛出多种错误的代码
  someFunction();
} catch (error) {
  // 处理所有错误，但可能掩盖真正的问题
  console.error("发生错误");
}

// 好的做法

try {
  // 可能会抛出多种错误的代码
  someFunction();
} catch (error) {
  if (error instanceof ValidationError) {
    // 处理验证错误
    handleValidationError(error);
  } else if (error instanceof NetworkError) {
    // 处理网络错误
    handleNetworkError(error);
  } else {
    // 重新抛出未知错误
    throw error;
  }
}
```

### 7.3 提供适当的回退机制

当发生错误时，提供适当的回退机制，以确保程序可以继续运行：

```javascript
function fetchData(url) {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP 错误! 状态: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error("获取数据失败:", error.message);
      // 返回默认数据作为回退
      return { data: [], message: "使用默认数据" };
    });
}
```

### 7.4 记录错误

在生产环境中，应该将错误记录到日志系统中，以便于分析和调试：

```javascript
function logError(error, context) {
  // 这里可以将错误发送到日志服务器
  console.error({
    timestamp: new Date().toISOString(),
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack
    },
    context: context
  });
}

try {
  // 可能会抛出错误的代码
  someFunction();
} catch (error) {
  logError(error, {
    userId: currentUser.id,
    action: "some-action",
    params: { /* 相关参数 */ }
  });
  
  // 向用户显示友好的错误信息
  showErrorMessage("操作失败，请稍后重试");
}
```

### 7.5 对用户友好的错误信息

向用户显示的错误信息应该友好、清晰，避免使用技术术语：

```javascript
// 不好的用户错误信息
showErrorMessage("Error: ReferenceError: undefinedVariable is not defined");

// 好的用户错误信息
showErrorMessage("操作失败，请刷新页面后重试");
```

## 8. 练习

1. 创建一个函数，接收一个数字参数，如果参数不是数字，抛出 TypeError 错误
2. 使用 try...catch 语句捕获并处理上一题中的错误
3. 创建一个自定义的 HTTPError 类，继承自 Error 类，并包含 statusCode 属性
4. 使用 async/await 和 try...catch 处理异步操作中的错误
5. 实现一个全局错误处理函数，记录错误信息并显示友好的用户提示

## 9. 参考资料

- [MDN Web Docs: Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- [MDN Web Docs: try...catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch)
- [JavaScript.info: Error handling](https://javascript.info/error-handling)
- [Node.js Docs: Error handling](https://nodejs.org/api/errors.html)
