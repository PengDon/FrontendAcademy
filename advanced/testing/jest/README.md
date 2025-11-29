# Jest 单元测试基础知识

## Jest 简介

Jest 是一个由 Facebook 开发的 JavaScript 测试框架，专注于简洁性和易用性。它提供了一套完整的测试解决方案，包括测试运行器、断言库、mock 功能和覆盖率报告，适用于 React、Vue、Node.js 等各种 JavaScript 项目。

### Jest 的核心优势

- **零配置**：开箱即用，大部分项目无需复杂配置
- **快速执行**：并行化测试运行，智能测试文件监控
- **内置 Mock**：简单而强大的模拟功能
- **代码覆盖率**：内置覆盖率报告工具
- **快照测试**：捕获组件输出并检测变化
- **交互式模式**：提供监视模式，实时代码变更反馈
- **丰富的断言**：内置全面的断言库

### Jest 适用场景

- **单元测试**：测试单独的函数、方法或组件
- **集成测试**：测试多个单元的协同工作
- **快照测试**：UI 组件的快速验证
- **Node.js 应用测试**：服务端代码测试
- **前端框架测试**：React、Vue、Angular 等组件测试

## 环境搭建

### 安装 Jest

```bash
# 使用 npm 安装
npm install --save-dev jest

# 或者使用 yarn 安装
yarn add --dev jest
```

### 基本配置

在 `package.json` 中添加测试脚本：

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

对于更复杂的配置，可以创建 `jest.config.js` 文件：

```javascript
module.exports = {
  // 测试环境
  testEnvironment: 'node',
  
  // 匹配测试文件的模式
  testMatch: ['**/__tests__/**/*.(js|jsx|ts|tsx)', '**/*.(test|spec).(js|jsx|ts|tsx)'],
  
  // 模块文件扩展名
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  
  // 覆盖率配置
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
  coverageDirectory: 'coverage',
  
  // 监视模式配置
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ]
};
```

## Jest 基础语法

### 编写第一个测试

创建一个简单的函数文件 `src/math.js`：

```javascript
function sum(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

module.exports = { sum, subtract };
```

创建对应的测试文件 `src/__tests__/math.test.js`：

```javascript
const { sum, subtract } = require('../math');

describe('Math Operations', () => {
  // 测试分组
  describe('sum', () => {
    // 单个测试用例
    it('should add two numbers correctly', () => {
      // 断言
      expect(sum(1, 2)).toBe(3);
      expect(sum(-1, -1)).toBe(-2);
      expect(sum(-1, 1)).toBe(0);
    });
    
    it('should handle decimal numbers', () => {
      expect(sum(0.1, 0.2)).toBeCloseTo(0.3, 5); // 使用toBeCloseTo处理浮点数
    });
  });
  
  describe('subtract', () => {
    it('should subtract two numbers correctly', () => {
      expect(subtract(5, 3)).toBe(2);
      expect(subtract(-5, 3)).toBe(-8);
      expect(subtract(5, -3)).toBe(8);
    });
  });
});
```

运行测试：

```bash
npm test
```

## Jest 断言方法

Jest 提供了丰富的断言方法，以下是一些常用的：

### 基本断言

```javascript
// 精确相等
expect(value).toBe(expected);

// 深度相等（对象或数组）
expect(value).toEqual(expected);

// 真值
expect(value).toBeTruthy();
expect(value).toBeFalsy();

// 空值
expect(value).toBeNull();
expect(value).toBeUndefined();
expect(value).toBeDefined();

// 数值比较
expect(value).toBeGreaterThan(expected);
expect(value).toBeGreaterThanOrEqual(expected);
expect(value).toBeLessThan(expected);
expect(value).toBeLessThanOrEqual(expected);

expect(value).toBeCloseTo(expected, numDigits); // 浮点数比较

// 字符串
expect(string).toMatch(regexpOrString);

// 数组
expect(array).toContain(item);
expect(array).toEqual(expect.arrayContaining([item1, item2]));

// 对象属性
expect(object).toHaveProperty(keyPath, value);
expect(object).toEqual(expect.objectContaining({ prop: value }));

// 异常
expect(() => fn()).toThrow();
expect(() => fn()).toThrow(Error);
expect(() => fn()).toThrow('error message');
expect(() => fn()).toThrow(/regex/);

// 不执行
expect(fn).not.toHaveBeenCalled();
expect(fn).toHaveBeenCalledTimes(1);
expect(fn).toHaveBeenCalledWith(arg1, arg2);
expect(fn).toHaveBeenLastCalledWith(arg1, arg2);
```

## Jest 生命周期

Jest 提供了生命周期钩子函数，可以在测试运行前后执行代码：

```javascript
describe('Lifecycle Example', () => {
  // 在所有测试之前执行一次
  beforeAll(() => {
    console.log('Before all tests');
    // 设置测试环境
  });
  
  // 在所有测试之后执行一次
  afterAll(() => {
    console.log('After all tests');
    // 清理测试环境
  });
  
  // 在每个测试之前执行
  beforeEach(() => {
    console.log('Before each test');
    // 准备测试数据
  });
  
  // 在每个测试之后执行
  afterEach(() => {
    console.log('After each test');
    // 清理测试数据
  });
  
  it('test 1', () => {
    expect(1).toBe(1);
  });
  
  it('test 2', () => {
    expect(2).toBe(2);
  });
});
```

## Mock 功能

### 模拟函数

```javascript
test('should mock a function', () => {
  // 创建一个模拟函数
  const mockFn = jest.fn();
  
  // 调用模拟函数
  mockFn('arg1', 'arg2');
  mockFn(3);
  
  // 验证函数调用
  expect(mockFn).toHaveBeenCalledTimes(2);
  expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
  expect(mockFn).toHaveBeenLastCalledWith(3);
});

// 模拟函数返回值
test('should mock return value', () => {
  const mockFn = jest.fn()
    .mockReturnValueOnce(10)  // 第一次调用返回10
    .mockReturnValueOnce(20)  // 第二次调用返回20
    .mockReturnValue(30);     // 后续调用返回30
  
  expect(mockFn()).toBe(10);
  expect(mockFn()).toBe(20);
  expect(mockFn()).toBe(30);
  expect(mockFn()).toBe(30);
});

// 模拟异步函数
test('should mock async function', async () => {
  const mockAsyncFn = jest.fn().mockResolvedValue('success');
  // 或者模拟失败: mockRejectedValue(new Error('error'))
  
  const result = await mockAsyncFn();
  expect(result).toBe('success');
});
```

### 模拟模块

```javascript
// 模拟整个模块
jest.mock('./api', () => ({
  fetchUser: jest.fn().mockResolvedValue({ id: 1, name: 'Test User' }),
  updateUser: jest.fn().mockResolvedValue({ success: true })
}));

const { fetchUser, updateUser } = require('./api');

test('should mock api module', async () => {
  const user = await fetchUser(1);
  expect(user).toEqual({ id: 1, name: 'Test User' });
  expect(fetchUser).toHaveBeenCalledWith(1);
});

// 部分模拟（保留模块的原始实现，只模拟部分函数）
jest.mock('./utils', () => {
  const originalModule = jest.requireActual('./utils');
  return {
    ...originalModule,
    // 只模拟这一个函数
    formatDate: jest.fn().mockReturnValue('2023-01-01')
  };
});
```

### 模拟定时器

```javascript
test('should mock setTimeout', () => {
  // 模拟定时器
  jest.useFakeTimers();
  
  const callback = jest.fn();
  
  // 执行包含定时器的代码
  setTimeout(callback, 1000);
  
  // 快进时间
  jest.advanceTimersByTime(1000);
  
  // 验证回调被调用
  expect(callback).toHaveBeenCalledTimes(1);
});

// 清理模拟的定时器
afterEach(() => {
  jest.useRealTimers();
});
```

## 快照测试

快照测试用于捕获组件的输出并检测未来的变化：

### 基本快照测试

```javascript
function generateGreeting(name) {
  return `Hello, ${name}!`;
}

test('greeting snapshot', () => {
  // 创建快照
  expect(generateGreeting('World')).toMatchSnapshot();
});
```

### React 组件快照测试

安装必要的依赖：

```bash
npm install --save-dev @testing-library/react
```

测试组件：

```javascript
import React from 'react';
import { render } from '@testing-library/react';
import Button from '../components/Button';

test('Button component snapshot', () => {
  const { asFragment } = render(<Button label="Click me" />);
  
  // 创建组件快照
  expect(asFragment()).toMatchSnapshot();
});
```

## 异步测试

### Promise 测试

```javascript
// 方法1：直接返回Promise
test('should resolve promise', () => {
  return fetchData().then(data => {
    expect(data).toBe('data');
  });
});

// 方法2：使用 async/await
test('should resolve promise with async/await', async () => {
  const data = await fetchData();
  expect(data).toBe('data');
});

// 方法3：使用 .resolves/.rejects
test('should resolve promise with resolves', () => {
  return expect(fetchData()).resolves.toBe('data');
});

test('should reject promise with rejects', () => {
  return expect(failRequest()).rejects.toThrow('Error');
});
```

## 配置与高级功能

### 覆盖率报告

运行测试时添加 `--coverage` 参数：

```bash
npm test -- --coverage
```

Jest 会生成详细的覆盖率报告，包括：
- 语句覆盖率 (Statement Coverage)
- 分支覆盖率 (Branch Coverage)
- 函数覆盖率 (Function Coverage)
- 行覆盖率 (Line Coverage)

可以在 `jest.config.js` 中配置覆盖率阈值：

```javascript
module.exports = {
  // ...
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  }
};
```

### 测试环境配置

为不同的测试环境创建不同的配置文件：

- `jest.config.js` - 基础配置
- `jest.config.node.js` - Node.js 环境配置
- `jest.config.dom.js` - 浏览器环境配置

使用 `--config` 参数指定配置文件：

```bash
npm test -- --config jest.config.node.js
```

### 扩展 Jest

使用 Jest 插件扩展功能：

```bash
# 安装常用插件
npm install --save-dev jest-watch-typeahead jest-watch-select-projects
```

在配置中添加：

```javascript
module.exports = {
  // ...
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
    'jest-watch-select-projects'
  ]
};
```

## 前端框架集成

### React 测试

使用 React Testing Library：

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

测试 React 组件：

```javascript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // 扩展断言
import Counter from '../components/Counter';

describe('Counter Component', () => {
  test('should render counter with initial value', () => {
    render(<Counter />);
    
    // 查找元素
    const countElement = screen.getByText(/count:/i);
    expect(countElement).toBeInTheDocument();
    expect(countElement).toHaveTextContent('Count: 0');
  });
  
  test('should increment counter when button is clicked', () => {
    render(<Counter />);
    
    // 查找并点击按钮
    const incrementButton = screen.getByRole('button', { name: /increment/i });
    fireEvent.click(incrementButton);
    
    // 验证更新
    expect(screen.getByText(/count:/i)).toHaveTextContent('Count: 1');
  });
});
```

### Vue 测试

使用 Vue Test Utils：

```bash
npm install --save-dev @vue/test-utils @vue/vue3-jest
```

测试 Vue 组件：

```javascript
import { mount } from '@vue/test-utils';
import Counter from '../components/Counter.vue';

describe('Counter Component', () => {
  test('should render counter with initial value', () => {
    const wrapper = mount(Counter);
    
    // 查找元素
    expect(wrapper.text()).toContain('Count: 0');
  });
  
  test('should increment counter when button is clicked', async () => {
    const wrapper = mount(Counter);
    
    // 查找并点击按钮
    const incrementButton = wrapper.find('button');
    await incrementButton.trigger('click');
    
    // 验证更新
    expect(wrapper.text()).toContain('Count: 1');
  });
});
```

## Jest 最佳实践

### 测试组织

- **文件命名**：使用 `*.test.js` 或 `*.spec.js` 命名测试文件
- **目录结构**：将测试文件与源代码放在一起，使用 `__tests__` 目录或与源代码同名但添加 `.test` 后缀
- **测试分组**：使用 `describe` 组织相关测试
- **测试命名**：使用清晰、描述性的测试名称（例如："should do something when condition is met"）

### 编写有效测试

- **单一职责**：每个测试只测试一个概念
- **隔离测试**：避免测试之间的依赖
- **使用 setup/teardown**：使用 `beforeEach` 和 `afterEach` 管理测试状态
- **避免测试实现细节**：测试应该关注行为而不是实现
- **使用描述性的断言**：使测试失败时更容易理解问题

### 性能优化

- **避免不必要的 mock**：只 mock 外部依赖
- **使用监视模式**：在开发过程中使用 `--watch` 模式
- **分组慢测试**：将慢测试分组，单独运行
- **使用缓存**：利用 Jest 的缓存机制加速测试

## 常见问题与解决方案

### 1. 测试超时

**问题**：异步测试经常超时。

**解决方案**：
- 增加超时时间：

```javascript
test('slow test', async () => {
  // 增加这个测试的超时时间
}, 10000); // 10秒
```

- 或在配置中设置默认超时：

```javascript
module.exports = {
  testTimeout: 10000
};
```

### 2. Mock 清理

**问题**：Mock 状态在测试之间泄漏。

**解决方案**：在每个测试后清理 mock：

```javascript
afterEach(() => {
  jest.clearAllMocks(); // 重置所有 mock 的调用历史
  jest.resetAllMocks(); // 重置所有 mock 的实现
  jest.restoreAllMocks(); // 恢复原始实现（当使用了 spyOn）
});
```

### 3. ESM 支持

**问题**：在 ESM 项目中使用 Jest。

**解决方案**：

在 `package.json` 中设置：

```json
{
  "type": "module"
}
```

在 `jest.config.js` 中配置：

```javascript
export default {
  // 使用 ESM 配置
  transform: {}, // 禁用默认的转换
  extensionsToTreatAsEsm: ['.js', '.jsx', '.ts', '.tsx']
};
```

### 4. TypeScript 集成

**问题**：在 TypeScript 项目中使用 Jest。

**解决方案**：

安装必要的依赖：

```bash
npm install --save-dev typescript ts-jest @types/jest
```

配置 `jest.config.js`：

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx']
};
```

## 总结

Jest 是一个功能强大且易于使用的 JavaScript 测试框架，它提供了一套完整的工具来帮助你编写高质量的测试。通过本文档介绍的基础知识，你可以开始为你的项目添加单元测试，提高代码质量和可维护性。

记住，好的测试应该是可靠、快速和描述性的。通过遵循最佳实践，你可以构建出一个健壮的测试套件，这将在项目的长期发展中带来巨大的价值。

随着你对 Jest 的熟悉，你可以探索更多高级功能，如自定义匹配器、测试报告配置和持续集成集成，进一步提升你的测试工作流程。

---

希望这份 Jest 单元测试基础知识文档能够帮助你开始你的测试之旅。通过持续的学习和实践，你将能够构建出可靠、高效的测试套件，确保你的应用程序的质量和稳定性。