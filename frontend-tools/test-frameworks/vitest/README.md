# Vitest 测试框架详解

## 基本介绍

**Vitest** 是一个由 Vite 提供支持的极速单元测试框架，专为现代前端项目设计。它与 Vite 共享相同的配置、转换器和解析器，提供更快的测试执行速度和更好的开发体验。

### 核心特性
- **极速执行**：利用 Vite 的速度优势，测试执行非常快
- **ESM 优先**：原生支持 ES 模块
- **TypeScript 优先**：内置 TypeScript 支持
- **Vite 集成**：与 Vite 配置无缝集成
- **智能监听模式**：与 Vite 开发服务器共享文件监听
- **快照测试**：支持组件和值的快照测试
- **Mock 系统**：现代化的 mock API
- **丰富的断言**：支持 Chai 风格的断言
- **工作线程**：多线程并行执行测试

### 与 Jest 的主要区别
- **速度**：Vitest 通常比 Jest 快 10-100 倍
- **ESM 支持**：原生支持 ES 模块，无需额外配置
- **配置**：与 Vite 共享配置，减少重复配置
- **UI**：提供交互式测试 UI
- **HMR**：测试文件修改时自动运行受影响的测试

### 安装
```bash
# 安装 Vitest
npm install --save-dev vitest

# 如果使用 Vue
npm install --save-dev @vue/test-utils

# 如果需要 DOM 环境
npm install --save-dev jsdom
```

## 基础配置

### Vite 配置集成 (vite.config.js)
```javascript
/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  // Vite 配置
  test: {
    // Vitest 配置
    environment: 'jsdom',
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html']
    }
  }
})
```

### 单独配置 (vitest.config.js)
```javascript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // 测试环境
    environment: 'jsdom',
    
    // 测试文件匹配模式
    include: ['**/__tests__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    
    // 排除目录
    exclude: ['node_modules', 'dist'],
    
    // 覆盖率配置
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*'],
      exclude: ['src/main.ts', '**/*.d.ts']
    },
    
    // 测试超时时间
    testTimeout: 5000,
    
    // 全局变量
    globals: true,
    
    // 设置文件
    setupFiles: ['./tests/setup.js']
  }
})
```

## 基本测试用例

### 基本断言测试
```javascript
// sum.js
export function sum(a, b) {
  return a + b;
}

// sum.test.js
import { expect, test } from 'vitest';
import { sum } from './sum';

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
import { expect, test } from 'vitest';
import { fetchData } from './fetchData';

test('the data is peanut butter', () => {
  return fetchData().then(data => {
    expect(data).toBe('peanut butter');
  });
});
```

#### Async/Await
```javascript
import { expect, test } from 'vitest';

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
import { expect, test } from 'vitest';
import { throwError } from './throwError';

test('should throw an error', () => {
  expect(() => throwError()).toThrow();
  expect(() => throwError()).toThrow('Something went wrong');
});
```

## Mock 功能

### Mock 函数
```javascript
import { expect, test, vi } from 'vitest';

test('mock function example', () => {
  const mockCallback = vi.fn(x => 42 + x);
  [0, 1].forEach(mockCallback);
  
  expect(mockCallback).toHaveBeenCalledTimes(2);
  expect(mockCallback).toHaveBeenNthCalledWith(1, 0);
  expect(mockCallback).toHave ReturnedWith(42);
});
```

### Mock 模块
```javascript
import { expect, test, vi } from 'vitest';
import axios from 'axios';
import { fetchUser } from './api';

// 模拟整个 axios 模块
vi.mock('axios', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: { userId: 1, id: 1, title: 'Test' } })
  }
}));

test('fetches user data', async () => {
  const data = await fetchUser(1);
  expect(axios.get).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users/1');
  expect(data.userId).toBe(1);
});
```

### 监视函数
```javascript
import { expect, test, vi } from 'vitest';

test('spy on function', () => {
  const obj = { 
    method: () => 42 
  };
  const spy = vi.spyOn(obj, 'method');
  
  obj.method();
  
  expect(spy).toHaveBeenCalled();
  
  // 恢复原始函数
  spy.mockRestore();
});
```

## 快照测试

```javascript
import { expect, test } from 'vitest';

test('snapshot test', () => {
  const result = { 
    name: 'test', 
    value: 42,
    nested: { prop: 'value' }
  };
  
  expect(result).toMatchSnapshot();
});
```

## 生命周期钩子

```javascript
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from 'vitest';

describe('test suite', () => {
  beforeAll(() => {
    console.log('Before all tests');
  });
  
  beforeEach(() => {
    console.log('Before each test');
  });
  
  afterEach(() => {
    console.log('After each test');
  });
  
  afterAll(() => {
    console.log('After all tests');
  });
  
  test('test 1', () => {
    expect(1).toBe(1);
  });
});
```

## 环境变量

### 测试环境变量
```javascript
// 在测试中使用环境变量
test('use environment variables', () => {
  // 访问 import.meta.env
  expect(import.meta.env.TEST).toBe('true');
});
```

## 常见断言方法

Vitest 支持多种断言风格，默认提供类似 Jest 和 Chai 的断言：

- **相等性判断**
  - `toBe(value)` - 严格相等
  - `toEqual(value)` - 深度相等
  - `toBeTruthy()`, `toBeFalsy()`
  - `toBeNull()`, `toBeUndefined()`

- **数字比较**
  - `toBeGreaterThan(number)`
  - `toBeLessThan(number)`
  - `toBeCloseTo(number, precision)`

- **字符串**
  - `toContain(string)`
  - `toMatch(regexp)`

- **数组**
  - `toContain(item)`
  - `toHaveLength(number)`

- **异常**
  - `toThrow(error?)`

## 面试重点

### 1. Vitest 的性能优势
- **ESM 原生支持**：避免了模块转换开销
- **Vite 集成**：共享构建管道和缓存
- **工作线程**：多线程并行执行测试
- **智能监听**：只运行受影响的测试文件
- **esbuild 优化**：使用 Go 编写的 esbuild 加速文件处理

### 2. Vitest vs Jest
- **速度**：Vitest 利用 Vite 的极速构建，测试运行更快
- **配置**：与 Vite 共享配置，减少重复工作
- **ESM 支持**：原生支持 ES 模块，无需额外配置
- **API 兼容性**：API 设计与 Jest 相似，便于迁移
- **生态系统**：Jest 生态更成熟，但 Vitest 发展迅速

### 3. 与 Vite 的集成优势
- **配置共享**：使用相同的配置文件和插件
- **转换器共享**：使用相同的文件转换器
- **开发体验一致**：测试和开发环境行为一致
- **更快的开发周期**：测试启动和执行速度更快

### 4. Mock 系统特性
- **vi 对象**：统一的 mock API 入口
- **自动模拟**：自动模拟模块依赖
- **即时模块替换**：支持运行时替换模块
- **原生 ESM 支持**：更好地支持 ES 模块的 mock

### 5. 最佳实践
- 使用 `vi.mock()` 替代 Jest 的 `jest.mock()`
- 利用与 Vite 的配置共享减少重复
- 使用 TypeScript 获取更好的类型支持
- 启用工作线程加速测试执行
- 使用交互式 UI 提升开发体验

## 高级配置示例

```javascript
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components')
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.ts',
    include: [
      '**/__tests__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      '**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
    ],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**'
    ],
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.{js,ts,jsx,tsx}'],
      exclude: [
        'src/main.ts',
        'src/router/index.ts',
        '**/*.d.ts',
        '**/__tests__/**'
      ],
      all: true,
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    },
    testTimeout: 10000,
    hookTimeout: 10000,
    pool: 'vmThreads',
    poolOptions: {
      vmThreads: {
        isolate: false
      }
    },
    watch: true,
    watchExclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**'
    ],
    reporters: ['default', 'html'],
    outputFile: {
      html: './coverage/index.html'
    }
  }
})
```

## 命令行工具

```bash
# 运行所有测试
npx vitest

# 运行特定测试文件
npx vitest run sum.test.js

# 运行包含特定名称的测试
npx vitest run -t "sum"

# 生成覆盖率报告
npx vitest run --coverage

# 监视模式
npx vitest

# 无头模式（CI/CD 中使用）

npx vitest run

# 使用 UI
npx vitest --ui
```

## 调试测试

### VS Code 调试配置 (.vscode/launch.json)
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Vitest Tests",
      "autoAttachChildProcesses": true,
      "program": "${workspaceRoot}/node_modules/vitest/vitest.mjs",
      "args": [
        "run",
        "--inspect-brk"
      ],
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**", "**/node_modules/**"]
    }
  ]
}
```