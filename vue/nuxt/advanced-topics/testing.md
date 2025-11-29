# Nuxt.js 测试策略

## 目录

- [简介](#简介)
- [测试类型](#测试类型)
- [单元测试](#单元测试)
- [组件测试](#组件测试)
- [端到端测试](#端到端测试)
- [集成测试](#集成测试)
- [测试最佳实践](#测试最佳实践)

## 简介

测试是确保应用质量和可靠性的关键环节。Nuxt.js 支持多种测试方法，包括单元测试、组件测试、端到端测试和集成测试。通过合理的测试策略，我们可以及早发现问题，确保代码质量，并提高开发信心。

### 为什么需要测试？

1. **质量保证** - 确保代码按预期工作
2. **回归防护** - 防止新功能破坏现有功能
3. **文档作用** - 测试用例可以作为代码使用说明
4. **重构信心** - 有测试保障的代码更容易重构
5. **团队协作** - 统一的质量标准

## 测试类型

### 单元测试 (Unit Testing)

测试最小的代码单元（函数、方法），通常不涉及外部依赖。

### 组件测试 (Component Testing)

测试 Vue 组件的行为和渲染结果，可能涉及子组件和一些依赖。

### 集成测试 (Integration Testing)

测试多个模块或组件协同工作的正确性。

### 端到端测试 (End-to-End Testing)

模拟真实用户行为，测试整个应用的工作流程。

## 单元测试

Nuxt.js 支持使用 Vitest 和 Jest 进行单元测试。

### 配置 Vitest

安装依赖：

```bash
npm install -D vitest happy-dom @vitejs/plugin-vue
```

创建 `vitest.config.ts`：

```typescript
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    setupFiles: ['./tests/setup.ts']
  }
})
```

创建 `tests/setup.ts`：

```typescript
import { vi } from 'vitest'

// Mock Nuxt composables
vi.mock('#app', () => ({
  useRuntimeConfig: () => ({
    public: {
      apiUrl: 'http://localhost:3000'
    }
  })
}))
```

### 测试组合式函数

```typescript
// composables/useCounter.ts
export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  const increment = () => {
    count.value++
  }
  
  const decrement = () => {
    count.value--
  }
  
  const reset = () => {
    count.value = initialValue
  }
  
  return {
    count,
    increment,
    decrement,
    reset
  }
}
```

测试组合式函数：

```typescript
// composables/useCounter.test.ts
import { describe, it, expect } from 'vitest'
import { useCounter } from './useCounter'

describe('useCounter', () => {
  it('should initialize with the correct value', () => {
    const { count } = useCounter(5)
    expect(count.value).toBe(5)
  })
  
  it('should increment the counter', () => {
    const { count, increment } = useCounter()
    increment()
    expect(count.value).toBe(1)
  })
  
  it('should decrement the counter', () => {
    const { count, decrement } = useCounter(5)
    decrement()
    expect(count.value).toBe(4)
  })
  
  it('should reset the counter', () => {
    const { count, increment, reset } = useCounter(0)
    increment()
    increment()
    reset()
    expect(count.value).toBe(0)
  })
})
```

### 测试工具函数

```typescript
// utils/formatDate.ts
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('zh-CN')
}
```

测试工具函数：

```typescript
// utils/formatDate.test.ts
import { describe, it, expect } from 'vitest'
import { formatDate } from './formatDate'

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = '2023-01-01'
    expect(formatDate(date)).toBe('2023/1/1')
  })
  
  it('should handle Date objects', () => {
    const date = new Date('2023-01-01')
    expect(formatDate(date)).toBe('2023/1/1')
  })
})
```

## 组件测试

使用 [@testing-library/vue](https://testing-library.com/docs/vue-testing-library/intro/) 进行组件测试。

### 安装依赖

```bash
npm install -D @testing-library/vue @testing-library/jest-dom jsdom
```

### 测试简单组件

```vue
<!-- components/Button.vue -->
<template>
  <button 
    :class="['btn', `btn-${variant}`, { 'btn-disabled': disabled }]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  disabled: false
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<style scoped>
.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
```

测试组件：

```typescript
// components/Button.test.ts
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/vue'
import Button from './Button.vue'

describe('Button', () => {
  it('renders button with default slot content', () => {
    render(Button, {
      slots: {
        default: '点击我'
      }
    })
    
    expect(screen.getByRole('button')).toHaveTextContent('点击我')
  })
  
  it('applies correct variant class', () => {
    render(Button, {
      props: {
        variant: 'danger'
      },
      slots: {
        default: '删除'
      }
    })
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('btn-danger')
  })
  
  it('emits click event when clicked', async () => {
    const handleClick = vi.fn()
    
    render(Button, {
      slots: {
        default: '点击我'
      },
      attrs: {
        onClick: handleClick
      }
    })
    
    const button = screen.getByRole('button')
    await fireEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
  
  it('does not emit click event when disabled', async () => {
    const handleClick = vi.fn()
    
    render(Button, {
      props: {
        disabled: true
      },
      slots: {
        default: '禁用按钮'
      },
      attrs: {
        onClick: handleClick
      }
    })
    
    const button = screen.getByRole('button')
    await fireEvent.click(button)
    
    expect(handleClick).not.toHaveBeenCalled()
  })
})
```

### 测试带有异步逻辑的组件

```vue
<!-- components/UserProfile.vue -->
<template>
  <div v-if="pending">加载中...</div>
  <div v-else-if="error">错误: {{ error.message }}</div>
  <div v-else-if="user">
    <h2>{{ user.name }}</h2>
    <p>{{ user.email }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  userId: string
}>()

const { data: user, pending, error } = await useFetch(`/api/users/${props.userId}`)
</script>
```

测试带有异步逻辑的组件：

```typescript
// components/UserProfile.test.ts
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { flushPromises } from '@vue/test-utils'
import UserProfile from './UserProfile.vue'

// Mock useFetch
vi.mock('#app', () => ({
  useFetch: vi.fn()
}))

import { useFetch } from '#app'

describe('UserProfile', () => {
  it('displays loading state initially', async () => {
    (useFetch as any).mockResolvedValue({
      data: ref(null),
      pending: ref(true),
      error: ref(null)
    })
    
    render(UserProfile, {
      props: {
        userId: '123'
      }
    })
    
    expect(screen.getByText('加载中...')).toBeInTheDocument()
  })
  
  it('displays user data when loaded', async () => {
    const userData = {
      name: '张三',
      email: 'zhangsan@example.com'
    }
    
    (useFetch as any).mockResolvedValue({
      data: ref(userData),
      pending: ref(false),
      error: ref(null)
    })
    
    render(UserProfile, {
      props: {
        userId: '123'
      }
    })
    
    await flushPromises()
    
    expect(screen.getByText('张三')).toBeInTheDocument()
    expect(screen.getByText('zhangsan@example.com')).toBeInTheDocument()
  })
  
  it('displays error message when fetch fails', async () => {
    (useFetch as any).mockResolvedValue({
      data: ref(null),
      pending: ref(false),
      error: ref({ message: '用户不存在' })
    })
    
    render(UserProfile, {
      props: {
        userId: 'invalid'
      }
    })
    
    await flushPromises()
    
    expect(screen.getByText('错误: 用户不存在')).toBeInTheDocument()
  })
})
```

## 端到端测试

使用 Cypress 进行端到端测试。

### 安装和配置

```bash
npm install -D cypress @nuxt/test-utils-edge h3
```

创建 `cypress.config.ts`：

```typescript
import { defineConfig } from 'cypress'
import { setup } from '@nuxt/test-utils-edge'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      setup({
        dev: true,
        port: 3000
      })
    }
  }
})
```

### 编写端到端测试

```typescript
// cypress/e2e/home.cy.ts
describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })
  
  it('displays welcome message', () => {
    cy.contains('h1', '欢迎来到我的网站')
  })
  
  it('navigates to about page', () => {
    cy.get('[data-testid="about-link"]').click()
    cy.url().should('include', '/about')
    cy.contains('h1', '关于我们')
  })
  
  it('submits contact form', () => {
    cy.visit('/contact')
    
    cy.get('[data-testid="name-input"]').type('张三')
    cy.get('[data-testid="email-input"]').type('zhangsan@example.com')
    cy.get('[data-testid="message-textarea"]').type('这是一条测试消息')
    cy.get('[data-testid="submit-button"]').click()
    
    cy.contains('感谢您的留言！')
  })
})
```

### 测试用户流程

```typescript
// cypress/e2e/user-flow.cy.ts
describe('User Flow', () => {
  it('allows user to register, login, and logout', () => {
    // 注册
    cy.visit('/register')
    cy.get('[data-testid="username-input"]').type('testuser')
    cy.get('[data-testid="email-input"]').type('test@example.com')
    cy.get('[data-testid="password-input"]').type('password123')
    cy.get('[data-testid="register-button"]').click()
    
    cy.url().should('include', '/dashboard')
    cy.contains('欢迎, testuser!')
    
    // 登出
    cy.get('[data-testid="logout-button"]').click()
    cy.url().should('include', '/')
    cy.contains('登录')
    
    // 登录
    cy.visit('/login')
    cy.get('[data-testid="email-input"]').type('test@example.com')
    cy.get('[data-testid="password-input"]').type('password123')
    cy.get('[data-testid="login-button"]').click()
    
    cy.url().should('include', '/dashboard')
    cy.contains('欢迎, testuser!')
  })
})
```

## 集成测试

集成测试关注多个组件或模块协同工作的情况。

### 测试页面与组件的集成

```typescript
// pages/products/index.test.ts
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/vue'
import { createRouter, createMemoryHistory } from 'vue-router'
import ProductsPage from './index.vue'
import ProductList from '~/components/ProductList.vue'

// Mock useFetch
vi.mock('#app', () => ({
  useFetch: vi.fn()
}))

import { useFetch } from '#app'

describe('Products Page', () => {
  it('displays products list', async () => {
    const mockProducts = [
      { id: 1, name: '产品1', price: 100 },
      { id: 2, name: '产品2', price: 200 }
    ]
    
    (useFetch as any).mockResolvedValue({
      data: ref(mockProducts),
      pending: ref(false),
      error: ref(null)
    })
    
    // 创建路由器
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/products', component: ProductsPage }
      ]
    })
    
    render(ProductsPage, {
      global: {
        plugins: [router]
      }
    })
    
    await waitFor(() => {
      expect(screen.getByText('产品1')).toBeInTheDocument()
      expect(screen.getByText('¥100')).toBeInTheDocument()
      expect(screen.getByText('产品2')).toBeInTheDocument()
      expect(screen.getByText('¥200')).toBeInTheDocument()
    })
  })
})
```

## 测试最佳实践

### 1. 测试金字塔

遵循测试金字塔原则：
- 大量单元测试
- 适量集成测试
- 少量端到端测试

### 2. 测试命名规范

```typescript
// 好的测试命名
it('should return true for valid email', () => { ... })
it('displays error message when input is empty', () => { ... })

// 避免模糊的命名
it('works correctly', () => { ... })
it('test1', () => { ... })
```

### 3. 测试数据管理

```typescript
// 使用工厂函数创建测试数据
const createUser = (overrides = {}) => ({
  id: 1,
  name: '张三',
  email: 'zhangsan@example.com',
  ...overrides
})

const createProduct = (overrides = {}) => ({
  id: 1,
  name: '测试产品',
  price: 100,
  ...overrides
})

// 在测试中使用
it('calculates total price correctly', () => {
  const user = createUser()
  const products = [
    createProduct({ price: 100 }),
    createProduct({ price: 200 })
  ]
  
  const total = calculateTotal(products)
  expect(total).toBe(300)
})
```

### 4. 避免测试实现细节

```typescript
// 好的做法：测试行为而不是实现
it('displays user name after login', async () => {
  await login('user@example.com', 'password')
  expect(screen.getByText('欢迎, 用户!')).toBeInTheDocument()
})

// 避免：测试内部实现
it('calls authenticateUser with correct parameters', () => {
  // 这种测试容易因重构而失败
})
```

### 5. 使用测试覆盖率

```bash
# 运行测试并生成覆盖率报告
vitest --coverage
```

配置覆盖率：

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.test.ts'
      ]
    }
  }
})
```

通过建立完善的测试策略，我们可以确保 Nuxt.js 应用的质量和稳定性，为用户提供可靠的体验。