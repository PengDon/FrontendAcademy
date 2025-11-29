# JavaScript 异步编程模式

## 介绍

JavaScript 是单线程的编程语言，而异步编程是处理耗时操作（如网络请求、文件操作、定时器等）的关键技术。通过异步编程，JavaScript 可以在不阻塞主线程的情况下执行这些操作，从而保持应用的响应性。

## 回调函数（Callbacks）

回调函数是最基本的异步编程模式，它是一个在异步操作完成后执行的函数。

### 基本用法

```javascript
// 模拟异步操作
function fetchData(callback) {
  setTimeout(() => {
    const data = { id: 1, name: '示例数据' };
    callback(null, data); // 第一个参数通常用于错误
  }, 1000);
}

// 使用回调函数
fetchData((error, data) => {
  if (error) {
    console.error('获取数据失败:', error);
    return;
  }
  console.log('获取数据成功:', data);
});
```

### 回调地狱（Callback Hell）

当多个异步操作需要顺序执行时，可能会导致嵌套层级过深的代码，称为"回调地狱"。

```javascript
// 回调地狱示例
fetchUser(userId, (error, user) => {
  if (error) {
    return console.error('获取用户失败:', error);
  }
  fetchUserPosts(user.id, (error, posts) => {
    if (error) {
      return console.error('获取帖子失败:', error);
    }
    fetchComments(posts[0].id, (error, comments) => {
      if (error) {
        return console.error('获取评论失败:', error);
      }
      // 处理数据
    });
  });
});
```

### 避免回调地狱的方法

1. 将回调函数提取为命名函数
2. 使用 Promise
3. 使用 async/await

## Promise

Promise 是 ES6 引入的异步编程解决方案，它代表一个异步操作的最终完成（或失败）及其结果值。

### 基本用法

```javascript
// 创建 Promise
const fetchData = new Promise((resolve, reject) => {
  setTimeout(() => {
    const success = true;
    if (success) {
      resolve({ id: 1, name: '示例数据' }); // 成功时调用 resolve
    } else {
      reject(new Error('获取数据失败')); // 失败时调用 reject
    }
  }, 1000);
});

// 使用 Promise
fetchData
  .then(data => {
    console.log('获取数据成功:', data);
    return processData(data); // 可以返回另一个 Promise 进行链式调用
  })
  .then(processedData => {
    console.log('数据处理成功:', processedData);
  })
  .catch(error => {
    console.error('发生错误:', error);
  })
  .finally(() => {
    console.log('无论成功失败都会执行');
  });
```

### Promise 静态方法

```javascript
// Promise.resolve - 创建一个已解决的 Promise
Promise.resolve('成功的数据').then(value => console.log(value));

// Promise.reject - 创建一个已拒绝的 Promise
Promise.reject(new Error('拒绝的原因')).catch(error => console.error(error));

// Promise.all - 等待所有 Promise 完成，返回一个包含所有结果的数组
const promise1 = Promise.resolve(1);
const promise2 = Promise.resolve(2);
const promise3 = Promise.resolve(3);

Promise.all([promise1, promise2, promise3])
  .then(values => console.log(values)) // [1, 2, 3]
  .catch(error => console.error(error)); // 任一 Promise 失败即失败

// Promise.race - 等待第一个完成的 Promise
Promise.race([promise1, promise2, promise3])
  .then(value => console.log(value)); // 1

// Promise.allSettled - 等待所有 Promise 完成，返回每个 Promise 的结果
Promise.allSettled([promise1, Promise.reject('错误'), promise2])
  .then(results => console.log(results)); // [{status: 'fulfilled', value: 1}, {status: 'rejected', reason: '错误'}, {status: 'fulfilled', value: 2}]

// Promise.any - 等待第一个成功的 Promise
Promise.any([Promise.reject('错误1'), promise2, promise3])
  .then(value => console.log(value)); // 2
```

## Async/Await

Async/Await 是 ES2017 引入的语法糖，它基于 Promise，使异步代码看起来更像同步代码，提高了可读性和可维护性。

### 基本用法

```javascript
// 定义异步函数
async function fetchData() {
  try {
    // await 等待 Promise 完成
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    console.log('获取数据成功:', data);
    return data;
  } catch (error) {
    console.error('发生错误:', error);
    throw error; // 可以重新抛出错误
  } finally {
    console.log('无论成功失败都会执行');
  }
}

// 调用异步函数
fetchData()
  .then(result => console.log('处理结果:', result))
  .catch(error => console.error('捕获错误:', error));
```

### 并行执行

```javascript
async function fetchMultipleData() {
  // 并行执行多个异步操作
  const [users, posts, comments] = await Promise.all([
    fetch('https://api.example.com/users').then(res => res.json()),
    fetch('https://api.example.com/posts').then(res => res.json()),
    fetch('https://api.example.com/comments').then(res => res.json())
  ]);
  
  console.log('所有数据获取完成:', { users, posts, comments });
}
```

## 生成器（Generators）和协程

生成器函数是 ES6 引入的一种特殊函数，它可以在执行过程中暂停和恢复，适用于实现自定义迭代器和异步控制流。

### 基本用法

```javascript
// 定义生成器函数
function* myGenerator() {
  yield 1;
  yield 2;
  yield 3;
  return 4;
}

// 创建生成器对象
const gen = myGenerator();

// 迭代生成器
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: 4, done: true }
console.log(gen.next()); // { value: undefined, done: true }
```

### 使用生成器处理异步操作

```javascript
function fetchUser() {
  return new Promise(resolve => {
    setTimeout(() => resolve({ id: 1, name: '用户' }), 1000);
  });
}

function fetchPosts(userId) {
  return new Promise(resolve => {
    setTimeout(() => resolve([{ id: 1, title: '帖子1' }]), 1000);
  });
}

// 使用生成器和 Thunk 函数处理异步
function* fetchData() {
  const user = yield fetchUser();
  const posts = yield fetchPosts(user.id);
  console.log('数据获取完成:', { user, posts });
}

// 执行生成器
function runGenerator(generator) {
  const iterator = generator();
  
  function handle(iteratorResult) {
    if (iteratorResult.done) return;
    
    const promise = iteratorResult.value;
    promise.then(value => {
      handle(iterator.next(value));
    }).catch(error => {
      iterator.throw(error);
    });
  }
  
  handle(iterator.next());
}

// 运行
runGenerator(fetchData);
```

## 异步编程的错误处理

### 回调函数中的错误处理

```javascript
function asyncOperation(callback) {
  try {
    // 执行异步操作
    setTimeout(() => {
      throw new Error('异步操作错误');
      callback(null, '成功数据');
    }, 1000);
  } catch (error) {
    // 注意：这里捕获不到异步操作中的错误
    callback(error);
  }
}

// 正确的错误处理方式
function asyncOperationFixed(callback) {
  setTimeout(() => {
    try {
      // 执行可能出错的操作
      throw new Error('异步操作错误');
      callback(null, '成功数据');
    } catch (error) {
      callback(error);
    }
  }, 1000);
}
```

### Promise 中的错误处理

```javascript
fetchData()
  .then(data => {
    // 这里抛出的错误会被下一个 catch 捕获
    if (!data) throw new Error('数据为空');
    return processData(data);
  })
  .then(result => {
    console.log('处理成功:', result);
  })
  .catch(error => {
    // 捕获所有 Promise 链中的错误
    console.error('发生错误:', error);
  });
```

### Async/Await 中的错误处理

```javascript
async function processAsyncData() {
  try {
    const data = await fetchData();
    // 这里抛出的错误会被 catch 块捕获
    if (!data) throw new Error('数据为空');
    const result = await processData(data);
    console.log('处理成功:', result);
  } catch (error) {
    // 捕获所有异步操作和同步代码中的错误
    console.error('发生错误:', error);
  }
}
```

## 实际应用模式

### 模式 1：顺序执行异步操作

```javascript
// 使用 Promise 链式调用
fetchUser()
  .then(user => fetchPosts(user.id))
  .then(posts => fetchComments(posts[0].id))
  .then(comments => console.log(comments))
  .catch(error => console.error(error));

// 使用 Async/Await
async function getComments() {
  try {
    const user = await fetchUser();
    const posts = await fetchPosts(user.id);
    const comments = await fetchComments(posts[0].id);
    console.log(comments);
  } catch (error) {
    console.error(error);
  }
}
```

### 模式 2：并行执行异步操作

```javascript
// 使用 Promise.all
Promise.all([fetchUser(), fetchPosts(), fetchComments()])
  .then(([user, posts, comments]) => {
    console.log('所有数据获取完成');
  })
  .catch(error => console.error(error));

// 使用 Async/Await
async function getAllData() {
  try {
    const [user, posts, comments] = await Promise.all([
      fetchUser(),
      fetchPosts(),
      fetchComments()
    ]);
    console.log('所有数据获取完成');
  } catch (error) {
    console.error(error);
  }
}
```

### 模式 3：处理失败但继续执行

```javascript
// 使用 Promise.allSettled
async function getAllDataWithFallback() {
  const results = await Promise.allSettled([
    fetchUser(),
    fetchPosts(),
    fetchCommentsThatMightFail()
  ]);
  
  // 处理成功的结果
  const user = results[0].status === 'fulfilled' ? results[0].value : null;
  const posts = results[1].status === 'fulfilled' ? results[1].value : [];
  const comments = results[2].status === 'fulfilled' ? results[2].value : [];
  
  console.log('部分数据可能已获取:', { user, posts, comments });
}
```

### 模式 4：限制并发请求数

```javascript
async function fetchWithConcurrencyLimit(urls, limit = 5) {
  const results = [];
  const inProgress = [];
  
  async function fetchUrl(url) {
    const response = await fetch(url);
    return response.json();
  }
  
  for (const url of urls) {
    // 创建请求
    const request = fetchUrl(url);
    results.push(request);
    
    // 记录进行中的请求
    const requestPromise = request.then(() => {
      // 从进行中的请求中移除
      const index = inProgress.indexOf(requestPromise);
      if (index > -1) {
        inProgress.splice(index, 1);
      }
    });
    inProgress.push(requestPromise);
    
    // 如果达到并发限制，等待任一请求完成
    if (inProgress.length >= limit) {
      await Promise.race(inProgress);
    }
  }
  
  // 等待所有请求完成
  return Promise.all(results);
}
```

## 常见问题

### 1. 如何避免 Promise 链中的错误被吞没？

**问题**：Promise 链中的错误如果没有正确处理，可能会被吞没。

**解决方案**：
- 始终在 Promise 链的末尾添加 `.catch()` 处理程序
- 对于单独的 Promise，使用 `.catch()` 处理错误

```javascript
// 错误做法
const promise = fetchData();

// 正确做法
fetchData()
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

### 2. 如何处理多个异步操作中的错误？

**问题**：使用 `Promise.all()` 时，任一 Promise 失败都会导致整个操作失败。

**解决方案**：
- 如果需要允许部分失败，使用 `Promise.allSettled()`
- 如果只关心第一个成功的结果，使用 `Promise.any()`
- 为每个 Promise 添加单独的错误处理

```javascript
const promises = urls.map(url => 
  fetch(url)
    .then(res => res.json())
    .catch(error => ({ error, url })) // 为单个 Promise 添加错误处理
);

Promise.all(promises).then(results => {
  const successes = results.filter(r => !r.error);
  const failures = results.filter(r => r.error);
  console.log('成功:', successes);
  console.log('失败:', failures);
});
```

### 3. 为什么在 setTimeout 中使用 await 不工作？

**问题**：在非异步函数的回调中使用 `await` 会导致语法错误。

**解决方案**：
- 确保在 `async` 函数内部使用 `await`
- 将回调函数改为异步函数

```javascript
// 错误做法
setTimeout(() => {
  const result = await fetchData(); // 语法错误
}, 1000);

// 正确做法
setTimeout(async () => {
  const result = await fetchData();
  console.log(result);
}, 1000);
```

### 4. 如何避免 async 函数返回的 Promise 被忽略？

**问题**：未处理 async 函数返回的 Promise 可能导致未捕获的错误。

**解决方案**：
- 始终处理 async 函数返回的 Promise
- 使用 try/catch 在函数内部捕获错误
- 对于不关心结果的异步操作，添加 catch 处理

```javascript
// 错误做法
asyncFunction(); // 返回的 Promise 被忽略

// 正确做法
asyncFunction().catch(error => console.error(error));

// 或者在函数内部处理
async function asyncFunctionWithInternalErrorHandling() {
  try {
    // 异步操作
  } catch (error) {
    console.error(error);
  }
}
```

### 5. 如何处理长时间运行的异步操作？

**问题**：长时间运行的异步操作可能导致界面卡顿或超时。

**解决方案**：
- 实现取消机制
- 添加超时控制
- 将大型任务拆分为多个小任务

```javascript
// 添加超时控制
function withTimeout(promise, timeout) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error('操作超时')), timeout);
    })
  ]);
}

// 使用
withTimeout(fetchData(), 5000)
  .then(data => console.log(data))
  .catch(error => console.error(error));
```