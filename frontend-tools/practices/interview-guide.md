# 前端工具面试重点知识总结

## 构建工具面试重点

### Webpack 核心概念与面试题

#### 基础概念

**1. Webpack 是什么？它的主要作用是什么？**
- **答案**：Webpack 是一个现代 JavaScript 应用程序的静态模块打包器。当 Webpack 处理应用程序时，它会递归地构建一个依赖关系图，然后将所有模块打包成一个或多个 bundle。
- **作用**：模块打包、代码转换、代码分割、资源优化、开发服务器、热模块替换等。

**2. Webpack 的核心概念有哪些？**
- **答案**：
  - Entry（入口）：指定 Webpack 开始构建的入口文件
  - Output（输出）：配置打包后的文件输出位置和命名规则
  - Loader（加载器）：用于处理非 JavaScript 文件，如 CSS、图片等
  - Plugin（插件）：执行更广泛的任务，如代码压缩、资源管理等
  - Mode（模式）：development、production 或 none，影响内置优化
  - Dependency Graph（依赖图）：模块间依赖关系的映射

#### 进阶概念

**3. Loader 和 Plugin 的区别是什么？**
- **答案**：
  - Loader：专注于转换特定类型的模块，是文件加载器，运行在打包之前
  - Plugin：扩展 Webpack 的功能，可以在整个构建过程中执行各种任务，如打包优化、资源管理等
  - 本质区别：Loader 处理文件转换，Plugin 处理构建流程

**4. 什么是 Tree Shaking？Webpack 如何实现 Tree Shaking？**
- **答案**：Tree Shaking 是一种优化技术，用于移除 JavaScript 中未使用的代码。
- **实现方式**：
  - 依赖 ES6 模块系统（静态分析）
  - 在 production 模式下自动启用
  - 通过 package.json 的 "sideEffects" 字段标记无副作用的模块
  - 使用 TerserPlugin 在压缩阶段移除死代码

**5. 代码分割的方式有哪些？各有什么优缺点？**
- **答案**：
  - **Entry Points**：配置多个入口点
    - 优点：简单直接
    - 缺点：重复模块会被打包多次
  - **SplitChunksPlugin**：自动分割公共代码
    - 优点：自动优化，避免重复
    - 缺点：配置较复杂
  - **动态导入**：使用 import() 语法
    - 优点：按需加载，提升首屏加载速度
    - 缺点：需要处理加载状态和错误

**6. Webpack 性能优化的方法有哪些？**
- **答案**：
  - **开发环境优化**：
    - 使用 eval-cheap-module-source-map 作为 devtool
    - 配置 cache 提升构建速度
    - 优化 resolve 配置减少模块查找时间
  - **生产环境优化**：
    - 代码分割和动态导入
    - 压缩代码和资源
    - 提取公共依赖
    - 按需加载第三方库
  - **构建速度优化**：
    - 使用 DllPlugin 预构建依赖
    - 配置 thread-loader 并行处理
    - 优化 Loader 配置，使用 include/exclude
    - 使用持久化缓存

#### 高级问题

**7. Webpack 的构建流程是怎样的？**
- **答案**：
  1. **初始化**：解析配置参数，创建 Compiler 对象
  2. **编译**：
     - 入口处理：从 entry 开始递归分析依赖
     - 模块处理：使用 loader 转换每个模块
     - 依赖解析：构建完整的依赖图
  3. **输出**：
     - 应用插件
     - 生成 chunk
     - 写入文件系统

**8. 如何实现 Webpack 的多页面应用打包？**
- **答案**：
  - 配置多个 entry 入口
  - 使用 HtmlWebpackPlugin 为每个页面生成 HTML
  - 配置 optimization.splitChunks 提取公共代码

```javascript
module.exports = {
  entry: {
    home: './src/home.js',
    about: './src/about.js'
  },
  plugins: [
    new HtmlWebpackPlugin({ filename: 'home.html', chunks: ['home'] }),
    new HtmlWebpackPlugin({ filename: 'about.html', chunks: ['about'] })
  ]
};
```

### Vite 核心概念与面试题

#### 基础概念

**1. Vite 是什么？它的主要特点是什么？**
- **答案**：Vite 是一个现代化的前端构建工具，由 Vue.js 的作者尤雨溪开发。
- **主要特点**：
  - 极速的开发服务器启动
  - 即时的热模块替换（HMR）
  - 优化的构建输出
  - 基于 ES 模块的开发服务器
  - 丰富的插件生态

**2. Vite 与 Webpack 的主要区别是什么？**
- **答案**：
  - **开发服务器实现**：
    - Vite：使用原生 ES 模块，无需打包，启动极速
    - Webpack：需要打包所有模块，启动较慢
  - **构建优化**：
    - Vite：开发和构建使用不同的策略，构建使用 Rollup
    - Webpack：使用同一套架构，配置复杂
  - **热更新**：
    - Vite：精确更新，速度更快
    - Webpack：全量重建，相对较慢
  - **配置简化**：
    - Vite：配置简洁，开箱即用
    - Webpack：配置复杂，需要详细定制

**3. Vite 的依赖预构建是什么？有什么作用？**
- **答案**：依赖预构建是 Vite 在开发环境中自动执行的一个步骤，用于：
  - 将 CommonJS 或 UMD 格式的依赖转换为 ESM 格式
  - 合并内部模块较多的依赖，减少 HTTP 请求
  - 缓存构建结果，提高后续启动速度
- **触发时机**：首次启动时，或依赖发生变化时

#### 进阶概念

**4. Vite 的 HMR 实现原理是什么？**
- **答案**：
  - 使用原生 ES 模块 import.meta.hot API
  - 服务器端维护模块依赖图
  - 文件变化时，只更新受影响的模块
  - 通过 WebSocket 通信推送更新事件
  - 客户端接收更新并执行模块替换

**5. Vite 中的环境变量是如何工作的？**
- **答案**：
  - 使用 .env 文件定义环境变量
  - 变量名必须以 VITE_ 前缀开头
  - 通过 import.meta.env 访问环境变量
  - 支持多环境配置：.env、.env.local、.env.[mode]、.env.[mode].local
  - 环境变量在构建时被静态替换

**6. Vite 的构建优化策略有哪些？**
- **答案**：
  - **CSS 代码分割**：自动提取组件内的 CSS
  - **异步 chunk 加载优化**：预加载提示
  - **模块合并**：减少 HTTP 请求
  - **动态导入 polyfill**：自动添加
  - **Tree Shaking**：基于 Rollup 的高效 Tree Shaking

#### 高级问题

**7. 如何在大型项目中优化 Vite 的性能？**
- **答案**：
  - 配置 optimizeDeps.include 和 exclude 优化依赖预构建
  - 使用 splitVendorChunkPlugin 分割 vendor chunk
  - 合理配置 manualChunks 自定义 chunk 分割
  - 使用 CDN 加载大型第三方库
  - 优化资源内联策略
  - 配置合理的缓存策略

**8. Vite 的插件系统是如何工作的？**
- **答案**：
  - 基于 Rollup 插件 API 扩展
  - 提供 Vite 特有的钩子（如 config、configureServer 等）
  - 插件执行顺序有明确规定（resolve > load > transform）
  - 支持插件预设（preset）简化配置
  - 可以通过插件修改构建行为和开发服务器

### Rollup 核心概念与面试题

#### 基础概念

**1. Rollup 是什么？它的主要特点是什么？**
- **答案**：Rollup 是一个 JavaScript 模块打包器，专注于生成更小、更高效的代码。
- **主要特点**：
  - 高效的 Tree Shaking
  - 支持多种输出格式（ES、CommonJS、UMD、AMD 等）
  - 简洁的 API 和配置
  - 适合构建库和框架
  - 原生支持 ES 模块

**2. Rollup 与 Webpack 的使用场景有什么不同？**
- **答案**：
  - **Rollup 适合**：
    - 构建 JavaScript 库/框架
    - 输出多种模块格式
    - 需要极致的代码体积优化
    - 简单的应用打包
  - **Webpack 适合**：
    - 复杂的 Web 应用
    - 需要丰富的 loader 和 plugin 生态
    - 处理各种资源（图片、CSS 等）
    - 大型项目的代码分割和动态导入

**3. Rollup 的输出格式有哪些？各有什么用途？**
- **答案**：
  - **es/esm**：ES 模块格式，支持 Tree Shaking
  - **cjs**：CommonJS 格式，用于 Node.js 环境
  - **umd**：通用模块定义，同时支持浏览器和 Node.js
  - **amd**：异步模块定义，用于浏览器
  - **iife**：立即调用函数表达式，用于浏览器全局变量

#### 进阶概念

**4. Rollup 的 Tree Shaking 原理是什么？与 Webpack 有什么不同？**
- **答案**：
  - **原理**：基于 ES 模块的静态分析，识别未使用的导出
  - **Rollup 特点**：
    - 更激进的 Tree Shaking
    - 能够移除更多未使用的代码
    - 输出更干净的代码
  - **与 Webpack 区别**：
    - Rollup 原生支持更彻底的 Tree Shaking
    - Webpack 需要额外配置和优化
    - Rollup 更适合库打包，Webpack 更适合应用打包

**5. Rollup 如何处理外部依赖？**
- **答案**：
  - 使用 external 配置排除依赖
  - 可以通过数组、正则表达式或函数指定
  - 对于 UMD/IIFE 格式，可以通过 globals 配置全局变量名

```javascript
export default {
  external: ['react', 'react-dom'],
  output: {
    format: 'umd',
    name: 'MyLibrary',
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM'
    }
  }
}
```

**6. Rollup 如何实现代码分割？**
- **答案**：
  - 使用动态导入（import()）
  - 配置 manualChunks 自定义分割策略
  - 结合 @rollup/plugin-multi-entry 处理多入口

```javascript
export default {
  output: {
    manualChunks: {
      vendor: ['lodash'],
      utils: ['date-fns']
    }
  }
}
```

#### 高级问题

**7. 如何使用 Rollup 构建支持多种模块格式的库？**
- **答案**：
  - 配置多输出格式
  - 使用插件处理类型声明
  - 设置合适的 package.json 字段

```javascript
export default [
  {
    input: 'src/index.js',
    output: [
      { file: 'dist/index.cjs.js', format: 'cjs' },
      { file: 'dist/index.esm.js', format: 'esm' },
      { file: 'dist/index.umd.js', format: 'umd', name: 'MyLibrary' }
    ]
  },
  {
    input: 'dist/esm/types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()]
  }
]
```

**8. Rollup 构建库时的最佳实践有哪些？**
- **答案**：
  - 配置 sideEffects 优化 Tree Shaking
  - 生成类型声明文件
  - 正确设置 package.json 的 main、module、exports 字段
  - 使用 babel 确保兼容性
  - 配置适当的 sourcemap
  - 添加适当的压缩和优化

## 测试框架面试重点

### Jest 核心概念与面试题

#### 基础概念

**1. Jest 是什么？它的主要特点是什么？**
- **答案**：Jest 是 Facebook 开发的 JavaScript 测试框架，专注于简洁明快。
- **主要特点**：
  - 零配置，开箱即用
  - 内置断言库
  - Mock 功能强大
  - 快照测试
  - 并行测试执行
  - 丰富的覆盖率报告
  - 支持多种框架

**2. Jest 的测试文件命名规则是什么？**
- **答案**：
  - `*.test.js` 或 `*.spec.js`
  - 放在 `__tests__` 目录下的文件
  - 可以通过配置修改命名规则

**3. Jest 中的常用断言方法有哪些？**
- **答案**：
  - `expect(value).toBe(expected)`：严格相等
  - `expect(value).toEqual(expected)`：深度相等
  - `expect(value).toBeTruthy()/toBeFalsy()`：真值/假值
  - `expect(value).toBeDefined()/toBeUndefined()`：已定义/未定义
  - `expect(value).toHaveLength(length)`：长度检查
  - `expect(fn).toHaveBeenCalled()`：函数调用检查
  - `expect(fn).toThrow()`：异常检查

#### 进阶概念

**4. Jest 的 Mock 系统是如何工作的？**
- **答案**：
  - 使用 `jest.mock()` 模拟模块
  - 使用 `jest.fn()` 创建模拟函数
  - 使用 `jest.spyOn()` 监视函数调用
  - 支持模拟返回值、实现和抛出异常
  - 提供调用次数和参数的验证

**5. Jest 的快照测试是什么？有什么优缺点？**
- **答案**：
  - 快照测试是一种将组件的当前输出与存储的快照进行比较的测试方法
  - **优点**：
    - 易于编写和维护
    - 可以捕获意外的 UI 变化
    - 适合测试复杂对象和组件
  - **缺点**：
    - 可能导致测试过于脆弱
    - 需要手动更新过时的快照
    - 不能替代功能测试

**6. Jest 的生命周期钩子有哪些？各自的用途是什么？**
- **答案**：
  - `beforeAll(fn)`：所有测试之前执行一次
  - `afterAll(fn)`：所有测试之后执行一次
  - `beforeEach(fn)`：每个测试之前执行
  - `afterEach(fn)`：每个测试之后执行
  - 用途：设置测试环境、准备测试数据、清理测试状态

#### 高级问题

**7. Jest 如何处理异步测试？**
- **答案**：
  - **回调方式**：使用 done 参数
  - **Promise 方式**：返回 Promise，Jest 会等待其完成
  - **async/await**：直接使用 async/await 语法
  - **.resolves/.rejects**：断言 Promise 的解析结果

**8. Jest 的配置优化方法有哪些？**
- **答案**：
  - 配置缓存目录提升速度
  - 设置适当的 moduleNameMapper 处理路径别名
  - 优化 collectCoverageFrom 减少覆盖率分析范围
  - 使用 maxWorkers 控制并行进程数
  - 配置 testMatch/testPathIgnorePatterns 过滤测试文件

### Vitest 核心概念与面试题

#### 基础概念

**1. Vitest 是什么？它的主要特点是什么？**
- **答案**：Vitest 是一个由 Vite 提供支持的极速单元测试框架。
- **主要特点**：
  - 与 Vite 配置共享，零配置启动
  - 极速的测试执行速度
  - 智能的文件监听
  - 丰富的 UI 界面
  - 兼容 Jest API
  - 原生 ESM 支持
  - 多线程测试执行

**2. Vitest 与 Jest 的主要区别是什么？**
- **答案**：
  - **性能**：Vitest 基于 Vite，启动和执行速度更快
  - **配置**：Vitest 与 Vite 共享配置，更加简洁
  - **ESM 支持**：Vitest 原生支持 ESM，无需额外配置
  - **UI 界面**：Vitest 提供丰富的交互式 UI
  - **生态**：Jest 生态更成熟，但 Vitest 兼容 Jest API
  - **类型支持**：Vitest 对 TypeScript 支持更好

**3. Vitest 的核心 API 有哪些？**
- **答案**：
  - **测试函数**：`describe`, `it/test`, `expect`
  - **Mock API**：`vi.mock`, `vi.fn`, `vi.spyOn`, `vi.hoisted`
  - **生命周期**：`beforeEach`, `afterEach`, `beforeAll`, `afterAll`
  - **工具函数**：`vi.resetAllMocks`, `vi.clearAllMocks`, `vi.stubGlobal`
  - **断言 API**：与 Jest 兼容的 `expect` 匹配器

#### 进阶概念

**4. Vitest 的 Environment 配置是什么？有什么作用？**
- **答案**：
  - Environment 定义测试运行的环境
  - 内置环境：`node`, `jsdom`, `happy-dom`
  - 可以自定义环境
  - 作用：模拟不同的运行环境，如浏览器 DOM、Node.js 等

**5. Vitest 的 Mock 系统有哪些特点？**
- **答案**：
  - 兼容 Jest 的 Mock API
  - 提供 `vi.hoisted` 用于解决提升问题
  - 支持 `vi.mock` 的自动模拟功能
  - 提供更细粒度的控制选项
  - 更好的 TypeScript 支持

**6. Vitest 的覆盖率报告是如何配置的？**
- **答案**：
  - 使用 V8 或 Istanbul 作为覆盖率提供者
  - 支持多种报告格式：text、json、html、lcov
  - 可以配置覆盖率阈值
  - 支持按文件、行、分支、函数统计

#### 高级问题

**7. 如何在 Vitest 中进行组件测试？**
- **答案**：
  - 结合框架特定的测试工具（如 Vue Test Utils、React Testing Library）
  - 配置适当的测试环境（通常是 jsdom）
  - 使用 render 函数渲染组件
  - 使用断言验证组件行为和状态
  - 模拟用户交互

**8. Vitest 的性能优化策略有哪些？**
- **答案**：
  - 配置适当的 `pool` 选项（threads 或 worker）
  - 使用 `include`/`exclude` 过滤测试文件
  - 配置 `testNamePattern` 只运行特定测试
  - 优化 Mock 策略，减少不必要的模拟
  - 使用 `isolate` 控制测试隔离级别
  - 合理使用 `setupFiles` 和 `teardownFiles`

### Cypress 核心概念与面试题

#### 基础概念

**1. Cypress 是什么？它的主要特点是什么？**
- **答案**：Cypress 是一个专为现代 Web 应用设计的端到端测试框架。
- **主要特点**：
  - 实时重载
  - 自动等待（无需手动添加等待时间）
  - 强大的调试能力
  - 时间旅行（查看每个命令的执行状态）
  - 网络请求控制
  - 组件测试支持
  - 视觉测试能力

**2. Cypress 与传统端到端测试工具（如 Selenium）的主要区别是什么？**
- **答案**：
  - **架构**：Cypress 直接在浏览器中运行，Selenium 使用 WebDriver 协议
  - **调试**：Cypress 提供更好的调试体验，包括时间旅行和实时预览
  - **等待机制**：Cypress 自动等待，Selenium 需要手动添加等待
  - **速度**：Cypress 通常更快，因为在浏览器中直接运行
  - **局限性**：Cypress 只支持现代浏览器，不支持多标签页
  - **网络控制**：Cypress 可以轻松拦截和修改网络请求

**3. Cypress 的测试文件结构是怎样的？**
- **答案**：
  - `cypress/e2e/`：端到端测试文件
  - `cypress/support/`：辅助函数和命令
  - `cypress/fixtures/`：测试数据
  - `cypress/plugins/`：插件配置（Cypress 10+ 已迁移到 cypress.config.js）
  - `cypress.config.js`：主要配置文件

#### 进阶概念

**4. Cypress 的命令执行顺序是怎样的？**
- **答案**：
  - Cypress 使用命令队列，所有命令都在队列中按顺序执行
  - 命令是异步的，但编写时可以使用同步风格
  - 使用 `.then()` 处理命令返回的结果
  - 支持链式调用，但每个命令都添加到队列中

**5. Cypress 如何处理网络请求？**
- **答案**：
  - 使用 `cy.intercept()` 拦截网络请求
  - 可以模拟响应、延迟请求、修改请求/响应
  - 支持路由别名和请求等待
  - 可以验证请求是否发送以及发送的参数

**6. Cypress 的自定义命令如何创建和使用？**
- **答案**：
  - 在 `cypress/support/commands.js` 中使用 `Cypress.Commands.add()` 创建
  - 可以接受参数和回调函数
  - 使用时直接通过 `cy.命令名()` 调用
  - 适合封装重复的测试步骤，如登录流程

#### 高级问题

**7. Cypress 的组件测试是什么？与端到端测试有什么区别？**
- **答案**：
  - 组件测试专注于单个组件的功能和行为
  - **区别**：
    - 范围：组件测试只测试单个组件，E2E 测试测试完整流程
    - 速度：组件测试更快
    - 隔离性：组件测试更隔离，可以模拟依赖
    - 环境：组件测试在模拟环境中运行，E2E 测试在真实浏览器中
  - 配置：需要在 cypress.config.js 中配置 component 部分

**8. Cypress 的最佳实践有哪些？**
- **答案**：
  - 使用数据属性（data-cy）作为选择器，避免依赖 CSS 类名和 ID
  - 合理组织测试，使用 `describe` 和 `context` 分组
  - 利用 fixtures 管理测试数据
  - 创建自定义命令封装重复操作
  - 避免使用硬编码的等待时间
  - 合理使用 beforeEach/afterEach 设置测试环境
  - 使用 Cypress Testing Library 提高测试的可访问性
  - 配置 CI/CD 集成自动化测试

## 前端工具链整合面试题

### 综合问题

**1. 如何设计一个完整的前端工具链？需要考虑哪些因素？**
- **答案**：
  - **考虑因素**：
    - 项目规模和复杂度
    - 团队技术栈和熟悉度
    - 开发效率和构建性能
    - 可维护性和扩展性
    - CI/CD 集成需求
    - 代码质量要求
  - **核心工具**：
    - 构建工具：Webpack/Vite/Rollup
    - 测试框架：Jest/Vitest/Cypress
    - 代码检查：ESLint/Prettier
    - 类型检查：TypeScript
    - Git Hooks：Husky/lint-staged
    - 文档工具：Storybook

**2. 在大型项目中，如何优化构建和测试速度？**
- **答案**：
  - **构建速度优化**：
    - 使用缓存（持久化缓存、文件系统缓存）
    - 并行构建（多线程、多进程）
    - 优化依赖管理（DllPlugin、依赖预构建）
    - 按需加载和代码分割
    - 合理配置 loader 和 plugin
  - **测试速度优化**：
    - 并行测试执行
    - 优化测试用例结构
    - 减少不必要的断言和模拟
    - 使用选择性测试执行
    - 优化测试环境配置

**3. 如何保证前端工具链的稳定性和一致性？**
- **答案**：
  - 使用版本锁定（package-lock.json/yarn.lock）
  - 创建共享配置包
  - 自动化环境设置脚本
  - 完善的文档和使用指南
  - 定期更新和维护工具链
  - 使用容器化确保环境一致性
  - CI/CD 中的自动化验证

### 实战问题

**4. 如何从 Webpack 迁移到 Vite？需要注意哪些问题？**
- **答案**：
  - **迁移步骤**：
    1. 创建 Vite 配置文件
    2. 替换 Webpack 特定的 loader 和 plugin
    3. 调整路径别名配置
    4. 处理环境变量差异
    5. 测试构建结果
  - **注意事项**：
    - ESM 兼容性问题
    - 某些 Webpack 插件可能没有直接替代品
    - 路径解析规则的细微差别
    - 开发服务器配置的差异
    - 性能基准测试对比

**5. 如何设计一个可扩展的组件库构建系统？**
- **答案**：
  - 使用 Rollup 构建多种模块格式（ESM、CJS、UMD）
  - 配置 TypeScript 生成类型声明
  - 使用 Storybook 进行文档和开发
  - 配置 ESLint 和 Prettier 保证代码质量
  - 使用 Jest/Vitest 进行单元测试
  - 使用 Cypress 进行组件测试
  - 配置 CI/CD 自动化构建、测试和发布
  - 设计合理的主题系统和样式隔离方案

**6. 如何为一个大型项目配置自动化测试策略？**
- **答案**：
  - **测试分层**：
    - 单元测试：覆盖核心逻辑和工具函数
    - 集成测试：测试组件间交互
    - 端到端测试：测试关键用户流程
  - **工具选择**：
    - 单元测试：Jest/Vitest
    - 组件测试：框架特定测试库 + Jest/Vitest
    - 端到端测试：Cypress
  - **测试覆盖率**：
    - 设定合理的覆盖率目标
    - 优先测试核心业务逻辑
    - 持续监控覆盖率变化
  - **CI/CD 集成**：
    - 自动化运行测试
    - 生成覆盖率报告
    - 失败时阻止合并