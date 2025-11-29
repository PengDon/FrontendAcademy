# Cypress 自动化测试基础知识

## Cypress 简介

Cypress 是一个现代化的前端自动化测试工具，专为测试 Web 应用程序而设计。它提供了一套完整的端到端测试解决方案，具有实时重载、时间旅行调试、自动等待等特性，使测试编写和调试变得更加简单高效。

### Cypress 的核心优势

- **实时重载**：保存测试文件后自动重新运行测试
- **时间旅行**：可以查看每个测试步骤的状态和详细信息
- **自动等待**：无需手动添加等待和超时
- **调试能力**：直接在开发者工具中调试测试
- **一致的结果**：在不同浏览器中提供一致的测试结果
- **丰富的断言库**：内置强大的断言功能
- **可视化测试**：实时查看测试执行过程

### Cypress 适用场景

- **端到端测试**：测试用户完整的操作流程
- **集成测试**：测试多个组件或模块的交互
- **单元测试**：测试单独的函数或组件
- **API 测试**：测试后端接口

## 环境搭建

### 安装 Cypress

```bash
# 使用 npm 安装
npm install cypress --save-dev

# 或者使用 yarn 安装
yarn add cypress --dev
```

### 首次运行 Cypress

```bash
# 打开 Cypress Test Runner
npx cypress open

# 或者使用 npm 脚本
# 在 package.json 中添加:
# "scripts": { "cypress:open": "cypress open" }
# 然后运行:
npm run cypress:open
```

首次运行 Cypress 时，它会自动创建以下文件和目录：

- `cypress/`：包含测试文件、配置和工具
  - `fixtures/`：用于存放测试数据
  - `integration/`：存放测试文件
  - `plugins/`：Cypress 插件
  - `support/`：自定义命令和全局配置
- `cypress.json`：Cypress 配置文件

## Cypress 基础语法

### 编写第一个测试

在 `cypress/integration` 目录下创建一个测试文件，例如 `example.spec.js`：

```javascript
describe('My First Test', () => {
  it('Visits the Kitchen Sink', () => {
    // 访问页面
    cy.visit('https://example.cypress.io')
    
    // 查找元素并验证
    cy.contains('type').click()
    
    // 验证 URL 已更新
    cy.url().should('include', '/commands/actions')
    
    // 查找输入框并输入文本
    cy.get('.action-email')
      .type('fake@email.com')
      .should('have.value', 'fake@email.com')
  })
})
```

### 基本命令

#### 访问页面

```javascript
cy.visit('https://example.com')
// 或者使用相对路径（相对于 baseUrl）
cy.visit('/login')
```

#### 查找元素

```javascript
// 通过选择器查找
cy.get('.class-name')
cy.get('#id')
cy.get('[data-test="element"]')

// 通过文本查找
cy.contains('Submit')
cy.contains('div', 'Welcome')

// 查找子元素
cy.get('form').find('input')

// 过滤元素
cy.get('li').filter('.active')

// 查找特定索引的元素
cy.get('li').eq(0) // 第一个元素
```

#### 交互操作

```javascript
// 点击
cy.get('button').click()
cy.get('a').click({ multiple: true }) // 点击多个元素

// 输入文本\cy.get('input').type('Hello World')
cy.get('input').clear() // 清空输入框

// 选择
cy.get('select').select('option1')

// 勾选/取消勾选\cy.get('checkbox').check()
cy.get('checkbox').uncheck()

// 拖拽
cy.get('.draggable').drag('.droppable')

// 触发事件
cy.get('input').trigger('change')
```

#### 断言

```javascript
// 元素存在性\cy.get('.element').should('exist')
cy.get('.element').should('not.exist')

// 元素可见性\cy.get('.element').should('be.visible')
cy.get('.element').should('not.be.visible')

// 元素内容\cy.get('.element').should('have.text', 'Hello')
cy.get('.element').should('contain', 'Hello')

// 属性\cy.get('a').should('have.attr', 'href', 'https://example.com')

// CSS\cy.get('.element').should('have.css', 'color', 'rgb(0, 0, 0)')

// 输入值
cy.get('input').should('have.value', 'test')

// 长度
cy.get('li').should('have.length', 3)

// 链式断言
cy.get('.element')
  .should('be.visible')
  .and('have.text', 'Hello')
```

## 高级功能

### 测试数据管理

#### 使用 Fixtures

在 `cypress/fixtures` 目录下创建 `users.json`：

```json
{
  "valid_user": {
    "username": "testuser",
    "password": "password123"
  },
  "invalid_user": {
    "username": "invalid",
    "password": "wrong"
  }
}
```

在测试中使用：

```javascript
describe('Login Test', () => {
  beforeEach(() => {
    cy.visit('/login')
  })
  
  it('should login with valid credentials', () => {
    // 加载测试数据
    cy.fixture('users').then((users) => {
      cy.get('#username').type(users.valid_user.username)
      cy.get('#password').type(users.valid_user.password)
      cy.get('#login-button').click()
      cy.url().should('include', '/dashboard')
    })
  })
})
```

### 自定义命令

在 `cypress/support/commands.js` 中定义自定义命令：

```javascript
// 登录命令
Cypress.Commands.add('login', (username, password) => {
  cy.visit('/login')
  cy.get('#username').type(username)
  cy.get('#password').type(password)
  cy.get('#login-button').click()
})

// 获取特定类型的元素
Cypress.Commands.add('getByTestId', (testId) => {
  return cy.get(`[data-test="${testId}"]`)
})
```

在测试中使用：

```javascript
describe('Dashboard Test', () => {
  beforeEach(() => {
    // 使用自定义登录命令
    cy.login('testuser', 'password123')
  })
  
  it('should display dashboard', () => {
    // 使用自定义选择器命令
    cy.getByTestId('dashboard-title').should('have.text', 'Dashboard')
  })
})
```

### API 测试

```javascript
describe('API Tests', () => {
  it('should get all users', () => {
    cy.request('GET', '/api/users').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('users')
      expect(response.body.users).to.be.an('array')
    })
  })
  
  it('should create a new user', () => {
    cy.request({
      method: 'POST',
      url: '/api/users',
      body: {
        name: 'John Doe',
        email: 'john@example.com'
      },
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      expect(response.status).to.eq(201)
      expect(response.body).to.have.property('id')
      expect(response.body.name).to.eq('John Doe')
    })
  })
})
```

### 网络请求拦截

```javascript
describe('Network Interception', () => {
  it('should intercept and stub a network request', () => {
    // 拦截 GET 请求
    cy.intercept('GET', '/api/users', {
      statusCode: 200,
      body: {
        users: [
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' }
        ]
      }
    }).as('getUsers')
    
    // 访问页面
    cy.visit('/users')
    
    // 等待拦截的请求完成
    cy.wait('@getUsers')
    
    // 验证页面显示了模拟的数据
    cy.get('.user-item').should('have.length', 2)
    cy.contains('Alice')
    cy.contains('Bob')
  })
})
```

### 环境变量

在 `cypress.json` 中配置环境变量：

```json
{
  "baseUrl": "http://localhost:3000",
  "env": {
    "apiUrl": "http://localhost:3001/api",
    "testUser": "test@example.com"
  }
}
```

在测试中使用：

```javascript
cy.log(Cypress.env('apiUrl')) // 输出: http://localhost:3001/api
cy.log(Cypress.env('testUser')) // 输出: test@example.com
```

也可以通过命令行传递环境变量：

```bash
CYPRESS_TEST_ENV=staging npx cypress run
```

### 测试报告

#### 安装 mochawesome 报告插件

```bash
npm install --save-dev mochawesome mochawesome-merge mochawesome-report-generator
```

#### 配置报告

在 `cypress.json` 中添加：

```json
{
  "reporter": "mochawesome",
  "reporterOptions": {
    "reportDir": "cypress/reports",
    "overwrite": false,
    "html": true,
    "json": true
  }
}
```

#### 生成合并报告

创建合并报告的脚本 `cypress/generate-report.js`：

```javascript
const { merge } = require('mochawesome-merge')
const generator = require('mochawesome-report-generator')

async function generateReport() {
  const report = await merge({
    reportDir: 'cypress/reports',
    files: ['cypress/reports/mochawesome*.json']
  })
  
  await generator.create(report, {
    reportDir: 'cypress/reports',
    inlineAssets: true
  })
}

generateReport()
```

在 `package.json` 中添加脚本：

```json
{
  "scripts": {
    "cypress:run": "cypress run",
    "generate-report": "node cypress/generate-report.js",
    "test": "npm run cypress:run && npm run generate-report"
  }
}
```

## Cypress 最佳实践

### 选择器策略

- **优先使用 `data-test` 属性**：避免基于样式和内容的选择器
- **避免使用动态生成的 ID**：它们可能会在应用更新时变化
- **保持选择器的稳定性**：确保选择器不会频繁变化

```html
<!-- 推荐 -->
<button data-test="submit-button">Submit</button>

<script>
// 在测试中使用
cy.get('[data-test="submit-button"]').click()
</script>
```

### 测试组织

- **按功能模块组织测试文件**：`auth.spec.js`、`dashboard.spec.js` 等
- **使用 `beforeEach` 和 `afterEach`**：设置和清理测试环境
- **使用 `context` 分组相关测试**：提高可读性

```javascript
describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/login')
  })
  
  context('Login Form', () => {
    it('should display login form', () => {
      cy.get('[data-test="login-form"]').should('be.visible')
    })
    
    it('should validate required fields', () => {
      cy.get('[data-test="login-button"]').click()
      cy.contains('Username is required')
      cy.contains('Password is required')
    })
  })
  
  context('Login Process', () => {
    it('should login with valid credentials', () => {
      cy.get('[data-test="username-input"]').type('testuser')
      cy.get('[data-test="password-input"]').type('password123')
      cy.get('[data-test="login-button"]').click()
      cy.url().should('include', '/dashboard')
    })
  })
})
```

### 避免常见问题

- **不要使用 `.then()` 嵌套过多**：会使代码难以阅读和维护
- **不要使用同步代码**：Cypress 是异步的，使用链式命令
- **不要手动添加等待**：使用 Cypress 的自动等待功能
- **不要访问页面外的 URL**：使用 `cy.request` 替代

```javascript
// 不推荐
cy.get('.element').then($el => {
  cy.wrap($el).click().then(() => {
    cy.get('.another-element').then($anotherEl => {
      // 嵌套过深
    })
  })
})

// 推荐
cy.get('.element').click()
cy.get('.another-element').should('be.visible')
```

### 性能优化

- **避免在单个测试中测试过多**：保持测试的专注性
- **使用 `cy.session()` 缓存状态**：避免重复登录
- **并行运行测试**：加速测试执行

```javascript
// 配置并行运行（在 package.json 中）
{
  "scripts": {
    "cypress:run:parallel": "cypress run --parallel --record --key your-record-key"
  }
}
```

## Cypress VS 其他测试工具

### Cypress vs Selenium

- **架构差异**：Cypress 直接在浏览器中运行，而不是通过 WebDriver
- **调试体验**：Cypress 提供更好的调试工具和时间旅行功能
- **并行性**：Selenium 更容易在多浏览器中并行运行
- **学习曲线**：Cypress 的 API 更简单直观

### Cypress vs Playwright

- **浏览器支持**：Playwright 支持更多浏览器（包括 Safari）
- **移动测试**：Playwright 提供更好的移动设备模拟
- **多标签支持**：Playwright 更好地支持多标签测试
- **社区支持**：Cypress 社区更大，生态系统更成熟

## 常见问题与解决方案

### 1. 跨域问题

**问题**：Cypress 运行时遇到跨域错误。

**解决方案**：

在 `cypress.json` 中添加：

```json
{
  "chromeWebSecurity": false
}
```

### 2. 测试超时

**问题**：测试经常超时失败。

**解决方案**：

- 增加全局超时时间：

```json
{
  "defaultCommandTimeout": 10000,
  "pageLoadTimeout": 60000,
  "requestTimeout": 15000
}
```

- 对于特定命令设置超时：

```javascript
cy.get('.slow-element', { timeout: 15000 })
```

### 3. CI/CD 集成

**问题**：在 CI 环境中运行 Cypress 测试。

**解决方案**：

在 GitHub Actions 中配置：

```yaml
name: Cypress Tests

on: [push, pull_request]

jobs:
  cypress-run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm ci
      - name: Cypress run
        uses: cypress-io/github-action@v2
```

在 CircleCI 中配置：

```yaml
version: 2.1
jobs:
  cypress-run:
    docker:
      - image: cypress/base:14.16.0
    steps:
      - checkout
      - restore_cache:
          keys:
            - v1-deps-{{ .Branch }}-{{ checksum "package-lock.json" }}
            - v1-deps-{{ .Branch }}
            - v1-deps
      - run: npm ci
      - save_cache:
          key: v1-deps-{{ .Branch }}-{{ checksum "package-lock.json" }}
          paths:
            - ~/.npm
            - ~/.cache
      - run: npm run test
```

## 总结

Cypress 是一个强大而灵活的前端自动化测试工具，它改变了我们编写和运行端到端测试的方式。通过本文档介绍的基础知识，你可以开始使用 Cypress 为你的 Web 应用程序编写高质量的测试。

记住，良好的测试实践和组织对于维护一个可扩展的测试套件至关重要。随着你对 Cypress 的熟悉，你可以探索更多高级功能，如自定义插件、CI/CD 集成和性能优化，从而进一步提升你的测试工作流程。

---

希望这份 Cypress 自动化测试基础知识文档能够帮助你开始你的测试之旅。通过持续的学习和实践，你将能够构建出可靠、高效的自动化测试套件，确保你的应用程序的质量和稳定性。