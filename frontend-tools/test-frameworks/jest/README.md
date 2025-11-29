# Jest 测试框架详解

## 基本介绍

**Jest** 是 Facebook 开发的 JavaScript 测试框架，专注于简单性和零配置。它集成了测试运行器、断言库、mock 系统和覆盖率工具，适用于单元测试、集成测试和快照测试。

### 核心特性
- **零配置**: 开箱即用，无需复杂配置
- **快照测试**: 轻松测试 React 组件等
- **Mock 系统**: 自动模拟依赖
- **代码覆盖率**: 内置覆盖率报告
- **并行执行**: 快速运行测试
- **强大的断言库**: 支持多种断言风格

### 安装
```bash
# 安装 Jest
npm install --save-dev jest

# 如果使用 Babel
npm install --save-dev @babel/core @babel/preset-env babel-jest

# 如果测试 React
npm install --save-dev react-test-renderer @testing-library/react
```

## 基础配置

### 最小配置 (package.json)
```json
{
  "scripts": {
    "test": "jest"
  }
}
```

### Jest 配置文件 (jest.config.js)
```javascript
module.exports = {
  // 根目录
  rootDir: '.',
  
  // 测试文件匹配模式
  testMatch: ['**/__tests__/**/*.(test|spec).(js|jsx|ts|tsx)'],
  
  // 模块文件扩展名
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  
  // 模块路径别名
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  
  // 覆盖率配置
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/index.js'],
  coverageDirectory: 'coverage',
  
  // 转换配置
  transform: {
    '^.+\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  
  // 模拟文件
  moduleNameMapping: {
    '\.(css|less|scss)$': 'identity-obj-proxy'
  }
};
```

## 基本测试用例

### 基本断言测试
```javascript
// sum.js
export function sum(a, b) {
  return a + b;
}

// sum.test.js
const { sum } = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

### 测试异步代码

#### Promise
```javascript
// fetchData.js
export function fetchData() {
  return Promise.resolve('peanut butter');
}

// fetchData.test.js
const { fetchData } = require('./fetchData');

test('the data is peanut butter', () => {
  return fetchData().then(data => {
    expect(data).toBe('peanut butter');
  });
});
```

#### Async/Await
```javascript
test('the data is peanut butter', async () => {
  const data = await fetchData();
  expect(data).toBe('peanut butter');
});
```

### 测试异常
```javascript
// throwError.js
export function throwError() {
  throw new Error('Something went wrong');
}

// throwError.test.js
const { throwError } = require('./throwError');

test('should throw an error', () => {
  expect(() => throwError()).toThrow();
  expect(() => throwError()).toThrow('Something went wrong');
});
```

## Mock 功能

### Mock 函数
```javascript
// userService.test.js
test('mock function example', () => {
  const mockCallback = jest.fn(x => 42 + x);
  [0, 1].forEach(mockCallback);
  
  // 检查函数调用次数
  expect(mockCallback.mock.calls).toHaveLength(2);
  
  // 检查第一次调用的参数
  expect(mockCallback.mock.calls[0][0]).toBe(0);
  
  // 检查返回值
  expect(mockCallback.mock.results[0].value).toBe(42);
});
```

### Mock 模块
```javascript
// __mocks__/axios.js
module.exports = {
  get: jest.fn(() => Promise.resolve({ data: { userId: 1, id: 1, title: 'Test' } }))
};

// api.test.js
jest.mock('axios');
const axios = require('axios');
const { fetchUser } = require('./api');

test('fetches user data', async () => {
  const data = await fetchUser(1);
  expect(axios.get).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users/1');
  expect(data.userId).toBe(1);
});
```

## 快照测试

### React 组件快照
```javascript
import React from 'react';
import renderer from 'react-test-renderer';
import Button from '../Button';

test('renders correctly', () => {
  const tree = renderer
    .create(<Button label="Click me" />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
```

## 生命周期钩子

```javascript
describe('test suite', () => {
  // 在所有测试前运行一次
  beforeAll(() => {
    console.log('Before all tests');
  });
  
  // 在每个测试前运行
  beforeEach(() => {
    console.log('Before each test');
  });
  
  // 在每个测试后运行
  afterEach(() => {
    console.log('After each test');
  });
  
  // 在所有测试后运行一次
  afterAll(() => {
    console.log('After all tests');
  });
  
  test('test 1', () => {
    expect(1).toBe(1);
  });
  
  test('test 2', () => {
    expect(2).toBe(2);
  });
});
```

## 常见断言方法

- **相等性判断**
  - `toBe(value)` - 严格相等（===）
  - `toEqual(value)` - 深度相等
  - `toBeNull()` - 等于 null
  - `toBeUndefined()` - 等于 undefined
  - `toBeTruthy()` - 为真
  - `toBeFalsy()` - 为假

- **数字比较**
  - `toBeGreaterThan(number)` - 大于
  - `toBeGreaterThanOrEqual(number)` - 大于等于
  - `toBeLessThan(number)` - 小于
  - `toBeLessThanOrEqual(number)` - 小于等于

- **字符串匹配**
  - `toMatch(regexpOrString)` - 匹配正则表达式或字符串

- **数组和对象**
  - `toContain(item)` - 包含特定项
  - `toHaveLength(number)` - 长度等于

- **异常**
  - `toThrow(error)` - 抛出异常

## 面试重点

### 1. Jest 的工作原理
- **测试发现**：根据配置模式查找测试文件
- **测试运行**：在 Node.js 环境中执行测试
- **模块转换**：通过 transform 配置转换文件
- **代码覆盖率**：使用 istanbul 收集覆盖率信息

### 2. Jest 与其他测试框架的区别
- **零配置**：Jest 开箱即用，而 Mocha/Chai 需要更多配置
- **集成度高**：Jest 集成了运行器、断言、mock 和覆盖率
- **快照测试**：Jest 的快照功能简化了 UI 组件测试
- **性能优化**：并行执行、智能缓存等提升性能

### 3. Mock 系统详解
- **手动 Mock**：在 `__mocks__` 目录创建模拟文件
- **自动 Mock**：使用 `jest.mock()` 自动模拟模块
- **Mock 函数**：`jest.fn()` 创建可追踪的函数
- **间谍函数**：`jest.spyOn()` 监控现有函数调用

### 4. 异步测试最佳实践
- 使用 `async/await` 简化异步测试
- 确保返回 Promise 以等待异步完成
- 使用 `resolves/rejects` 匹配器测试 Promise
- 使用 `done()` 回调处理回调函数

### 5. 性能优化技巧
- **使用测试分组**：合理使用 `describe` 组织测试
- **避免重复初始化**：使用 `beforeAll`/`beforeEach`
- **使用模拟数据**：减少外部依赖
- **并行执行**：启用 `--maxWorkers` 选项

## 高级配置示例

```javascript
module.exports = {
  // 测试环境
  testEnvironment: 'jsdom', // 浏览器环境
  
  // 覆盖率阈值
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // 转换忽略规则
  transformIgnorePatterns: [
    '/node_modules/(?!(axios|lodash-es)/)',
  ],
  
  // 测试超时时间
  testTimeout: 10000,
  
  // 监控模式配置
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  
  // 全局设置
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // 模块解析器
  resolver: '<rootDir>/resolver.js'
};
```

## 常见问题与解决方案

### 1. 模拟全局对象
```javascript
// 模拟 localStorage
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
};
```

### 2. 测试定时器
```javascript
// timer.js
export function delayedFunction(callback) {
  setTimeout(() => {
    callback();
  }, 1000);
}

// timer.test.js
const { delayedFunction } = require('./timer');

test('timer test', () => {
  jest.useFakeTimers();
  const callback = jest.fn();
  
  delayedFunction(callback);
  expect(callback).not.toHaveBeenCalled();
  
  jest.runAllTimers();
  expect(callback).toHaveBeenCalled();
});
```

### 3. 测试 DOM 操作
```javascript
// dom.test.js
document.body.innerHTML = '<div id="counter">0</div>';

test('updates counter', () => {
  const counter = document.getElementById('counter');
  counter.textContent = '1';
  expect(counter.textContent).toBe('1');
});
```

## 命令行工具

```bash
# 运行所有测试
npm test

# 运行特定测试文件
npm test sum.test.js

# 运行包含特定模式的测试
npm test -- -t "sum"

# 生成覆盖率报告
npm test -- --coverage

# 监控模式
npm test -- --watch

# 调试模式
node --inspect-brk node_modules/.bin/jest --runInBand
```