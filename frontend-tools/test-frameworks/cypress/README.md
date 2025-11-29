# Cypress 测试框架详解

## 基本介绍

**Cypress** 是一个功能强大的端到端（E2E）JavaScript 测试框架，专为现代 Web 应用设计。它提供了一套完整的测试解决方案，包括测试运行器、断言库、调试工具和时间旅行功能。

### 核心特性
- **实时重载**：测试文件修改时自动重新运行
- **时间旅行**：查看测试运行的每一步
- **调试能力**：直接在开发工具中调试测试
- **自动等待**：智能等待元素出现，无需手动添加等待
- **网络请求控制**：拦截、修改和模拟网络请求
- **组件测试**：支持单独测试 React、Vue 等组件
- **可视化测试**：截图和视频录制
- **跨浏览器支持**：支持 Chrome、Firefox、Edge 等

### 与其他 E2E 测试框架的区别
- **架构**：Cypress 直接在浏览器中运行，不使用 Selenium/WebDriver
- **实时反馈**：提供实时测试执行视图和调试信息
- **等待机制**：智能等待，减少测试不稳定因素
- **调试体验**：更好的开发人员体验和调试工具
- **学习曲线**：相比 Selenium 更容易上手

### 安装
```bash
# 安装 Cypress
npm install --save-dev cypress

# 初始化 Cypress（会创建示例测试文件和配置）
npx cypress open
```

## 目录结构

```
my-project/
├── cypress/
│   ├── e2e/                # 端到端测试文件
│   │   ├── example.cy.js
│   │   └── ...
│   ├── fixtures/           # 测试数据
│   │   ├── example.json
│   │   └── ...
│   ├── support/            # 支持文件
│   │   ├── commands.js     # 自定义命令
│   │   └── e2e.js          # 测试前置代码
│   └── screenshots/        # 自动截图（测试失败时）
│   └── videos/             # 测试视频
├── cypress.config.js       # Cypress 配置文件
├── package.json
└── ...
```

## 基础配置

### 配置文件 (cypress.config.js)
```javascript
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      // 实现自定义事件监听器
    },
  },
  viewportWidth: 1280,
  viewportHeight: 720,
  video: true,
  screenshotOnRunFailure: true,
});
```

## 基本测试用例

### 第一个测试
```javascript
// cypress/e2e/sample.cy.js
describe('My First Test', () => {
  it('should visit the page', () => {
    cy.visit('/'); // 使用 baseUrl + '/'
    cy.contains('Welcome to My App');
  });
});
```

### 元素交互测试
```javascript
describe('Login Flow', () => {
  it('should login successfully', () => {
    cy.visit('/login');
    
    // 输入用户名和密码
    cy.get('#username').type('testuser');
    cy.get('#password').type('password123');
    
    // 点击登录按钮
    cy.get('button[type="submit"]').click();
    
    // 验证登录成功
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome, Test User');
  });
});
```

## 核心 API

### 选择器
```javascript
// 通过 ID 选择
cy.get('#element-id');

// 通过类名选择
cy.get('.class-name');

// 通过属性选择
cy.get('[data-testid="unique-id"]');

// 通过标签名选择
cy.get('button');

// 组合选择器
cy.get('div.content > p');

// 包含文本的元素
cy.contains('Login');
```

### 元素交互
```javascript
// 输入文本
cy.get('input').type('hello world');

// 清除输入
cy.get('input').clear();

// 点击
cy.get('button').click();

// 双击
cy.get('button').dblclick();

// 右键点击
cy.get('button').rightclick();

// 悬停
cy.get('div').trigger('mouseover');

// 选择下拉框选项
cy.get('select').select('Option 1');

// 检查复选框
cy.get('input[type="checkbox"]').check();

// 取消检查
cy.get('input[type="checkbox"]').uncheck();
```

### 断言
```javascript
// 可见性
cy.get('div').should('be.visible');

// 存在性
cy.get('div').should('exist');

// 文本内容
cy.get('h1').should('have.text', 'Welcome');

// 包含文本
cy.get('p').should('contain', 'Hello');

// 属性值
cy.get('img').should('have.attr', 'src', '/logo.png');

// CSS 类
cy.get('div').should('have.class', 'active');

// 长度
cy.get('li').should('have.length', 3);

// URL
cy.url().should('include', '/dashboard');

// 状态
cy.get('input').should('be.disabled');
cy.get('input').should('be.checked');
```

### 网络请求
```javascript
// 拦截 GET 请求
cy.intercept('GET', '/api/users').as('getUsers');

// 执行可能触发请求的操作
cy.get('button.load-users').click();

// 等待请求完成
cy.wait('@getUsers').then((interception) => {
  // 访问请求和响应
  expect(interception.response.statusCode).to.equal(200);
  expect(interception.response.body).to.have.length(3);
});

// 模拟响应
cy.intercept('GET', '/api/users', {
  statusCode: 200,
  body: [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' }
  ]
}).as('getUsers');
```

### 导航
```javascript
// 访问 URL
cy.visit('/home');

// 返回
cy.go('back');

// 前进
cy.go('forward');

// 刷新
cy.reload();
```

### 窗口和存储
```javascript
// 访问 localStorage
cy.window().its('localStorage').invoke('getItem', 'token').should('exist');

// 设置 localStorage
cy.window().its('localStorage').invoke('setItem', 'token', 'test-token');

// 访问 URL 参数
cy.url().should('include', '?param=value');
```

## 自定义命令

在 `cypress/support/commands.js` 中定义自定义命令：

```javascript
// 登录命令
Cypress.Commands.add('login', (username, password) => {
  cy.visit('/login');
  cy.get('#username').type(username);
  cy.get('#password').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/dashboard');
});

// 获取登录后的用户信息
Cypress.Commands.add('getUserInfo', () => {
  return cy.window().its('app.user');
});
```

在测试中使用自定义命令：

```javascript
describe('Dashboard', () => {
  beforeEach(() => {
    cy.login('admin', 'admin123');
  });
  
  it('should display user info', () => {
    cy.getUserInfo().should('have.property', 'name', 'Admin');
  });
});
```

## 测试组织

### 测试套件和钩子
```javascript
describe('Authentication', () => {
  // 在每个测试前运行
  beforeEach(() => {
    cy.visit('/login');
  });
  
  it('should login with valid credentials', () => {
    // 测试代码
  });
  
  it('should show error with invalid credentials', () => {
    // 测试代码
  });
});
```

### 数据驱动测试
```javascript
const testData = [
  { username: 'user1', password: 'pass1', shouldSucceed: true },
  { username: 'invalid', password: 'invalid', shouldSucceed: false }
];

describe('Login Tests', () => {
  testData.forEach(data => {
    it(`should ${data.shouldSucceed ? 'succeed' : 'fail'} with ${data.username}`, () => {
      cy.visit('/login');
      cy.get('#username').type(data.username);
      cy.get('#password').type(data.password);
      cy.get('button[type="submit"]').click();
      
      if (data.shouldSucceed) {
        cy.url().should('include', '/dashboard');
      } else {
        cy.contains('Invalid credentials');
      }
    });
  });
});
```

## 面试重点

### 1. Cypress 的架构
- **Node.js 进程**：处理配置、文件监视、报告生成
- **浏览器进程**：执行测试代码，与应用交互
- **自动化代理**：连接 Node.js 和浏览器，提供双向通信
- **实时重载**：监听文件变化，自动重新运行测试

### 2. Cypress vs Selenium
- **架构区别**：
  - Cypress：直接在浏览器中运行，与应用共享执行环境
  - Selenium：通过 WebDriver 协议远程控制浏览器
- **优势**：
  - 更快的测试执行
  - 更好的调试体验
  - 智能等待，减少不稳定因素
  - 更好的时间旅行和可视化能力
- **劣势**：
  - 有限的跨浏览器支持
  - 只能在一个标签页中测试
  - 难以测试多浏览器交互

### 3. 最佳实践
- **使用 data-testid 属性**：便于选择元素，不依赖 CSS 类或 DOM 结构
- **避免硬编码等待**：使用 Cypress 的内置等待机制
- **组织测试**：合理使用 describe 和 it 分组
- **使用自定义命令**：封装重复的测试步骤
- **网络请求控制**：使用 cy.intercept 模拟和验证 API 请求
- **环境分离**：为不同环境配置不同的 baseUrl

### 4. 常见问题及解决方案
- **测试不稳定**：使用 data-testid，避免使用不稳定的选择器
- **跨域问题**：设置正确的 origins 和 chromeWebSecurity 配置
- **资源加载慢**：增加默认命令超时时间，或使用 cy.intercept 模拟响应
- **CI 环境问题**：使用无头模式，配置正确的视频和截图设置

### 5. 性能优化
- **并行执行**：使用 Cypress Dashboard 或 CI 工具进行并行测试
- **选择性测试**：使用 --spec 参数只运行特定测试
- **减少网络依赖**：使用 cy.intercept 模拟网络请求
- **优化选择器**：使用更具体、更快的选择器

## 高级配置示例

```javascript
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    responseTimeout: 15000,
    pageLoadTimeout: 60000,
    watchForFileChanges: true,
    experimentalSessionAndOrigin: true,
    
    setupNodeEvents(on, config) {
      // 自定义报告
      on('after:run', (results) => {
        console.log('Tests completed:', results.totalPassed, 'passed,', results.totalFailed, 'failed');
      });
      
      // 自定义命令行参数
      const file = config.env.configFile || 'development';
      require('dotenv').config({ path: `.env.${file}` });
      
      // 环境变量
      config.env = {
        ...config.env,
        apiUrl: process.env.API_URL,
        testUser: process.env.TEST_USER,
        testPassword: process.env.TEST_PASSWORD
      };
      
      return config;
    },
    
    // 测试文件匹配模式
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    
    // 支持的浏览器
    browsers: ['chrome', 'edge'],
    
    // 实验性特性
    experimentalWebKitSupport: true,
  },
  
  // 视口设置
  viewportWidth: 1920,
  viewportHeight: 1080,
  
  // 视频和截图
  video: true,
  videoCompression: 32,
  videoUploadOnPasses: false,
  screenshotOnRunFailure: true,
  screenshotsFolder: 'cypress/screenshots',
  videosFolder: 'cypress/videos',
  
  // 组件测试
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
  },
});
```

## 命令行工具

```bash
# 打开 Cypress 测试运行器
npx cypress open

# 运行所有测试（无头模式）
npx cypress run

# 运行特定测试文件
npx cypress run --spec "cypress/e2e/login.cy.js"

# 指定浏览器
npx cypress run --browser chrome
npx cypress run --browser firefox

# 记录到 Dashboard
npx cypress run --record --key your-record-key

# 并行运行
npx cypress run --parallel --record --key your-record-key

# 使用环境变量
npx cypress run --env configFile=production
```

## 调试技巧

### 使用 .debug()
```javascript
cy.get('button').debug().click();
```

### 使用 .pause()
```javascript
cy.get('form').pause();
```

### 查看命令日志
使用 Cypress 测试运行器的 Command Log 查看每个命令的详细信息。

### 开发者工具
在测试运行时，使用浏览器的开发者工具检查 DOM、网络请求和控制台日志。

### 时间旅行
点击 Cypress 测试运行器中的任何命令，可以看到该时刻的应用状态。