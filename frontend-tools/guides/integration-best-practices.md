# 前端工具集成与配置最佳实践

## 构建工具与框架集成

### Vite 与主流框架集成

#### Vue 项目集成

**基础配置**
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'assets': path.resolve(__dirname, 'src/assets')
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        additionalData: '@import "@/styles/variables.less";'
      }
    }
  }
});
```

**TypeScript 配置**
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

#### React 项目集成

**基础配置**
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'components': path.resolve(__dirname, 'src/components')
    }
  },
  esbuild: {
    jsxInject: "import React from 'react'"
  }
});
```

**CSS Modules 配置**
```javascript
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
      generateScopedName: '[name]__[local]--[hash:base64:5]'
    }
  }
});
```

### Webpack 与主流框架集成

#### Vue 项目集成

**基础配置**
```javascript
// webpack.config.js
const { VueLoaderPlugin } = require('vue-loader');
const path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ],
  resolve: {
    extensions: ['.vue', '.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
};
```

#### React 项目集成

**基础配置**
```javascript
// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
};
```

**Babel 配置**
```javascript
// babel.config.js
module.exports = {
  presets: [
    '@babel/preset-env',
    ['@babel/preset-react', { runtime: 'automatic' }]
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', {
      regenerator: true
    }]
  ]
};
```

### Rollup 与库项目集成

**基础库配置**
```javascript
// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.cjs.js',
        format: 'cjs',
        sourcemap: true
      },
      {
        file: 'dist/index.esm.js',
        format: 'esm',
        sourcemap: true
      },
      {
        file: 'dist/index.umd.js',
        format: 'umd',
        name: 'MyLibrary',
        sourcemap: true
      }
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript(),
      babel({
        exclude: 'node_modules/**',
        babelHelpers: 'bundled'
      }),
      terser()
    ],
    external: ['react', 'react-dom']
  },
  {
    input: 'dist/esm/types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()]
  }
];
```

## 测试框架与项目集成

### Vitest 与 Vite 项目集成

**基础配置**
```javascript
// vitest.config.js
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{js,ts,vue,jsx,tsx}']
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
});
```

**Vue 测试设置**
```typescript
// tests/setup.ts
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/vue';
import '@testing-library/jest-dom/vitest';

afterEach(() => {
  cleanup();
});
```

**React 测试设置**
```typescript
// tests/setup.ts
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

afterEach(() => {
  cleanup();
});
```

### Jest 与项目集成

**基础配置**
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  modulePaths: ['<rootDir>/src'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['@babel/preset-env'] }],
    '^.+\\.vue$': '@vue/vue3-jest'
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'html', 'json'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx,vue}',
    '!src/main.js',
    '!src/App.js'
  ]
};
```

**Vue 3 测试设置**
```javascript
// tests/setup.js
import { config } from '@vue/test-utils';
import { vi } from 'vitest';

// 全局配置
config.global.mocks = {
  $t: (key) => key
};

// 全局模拟
vi.mock('axios', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: {} })
  }
}));
```

### Cypress 与项目集成

**基础配置**
```javascript
// cypress.config.js
const { defineConfig } = require('cypress');

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    fixturesFolder: 'cypress/fixtures',
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    video: false,
    screenshotOnRunFailure: true,
    chromeWebSecurity: false,
    setupNodeEvents(on, config) {
      // 自定义事件处理
    }
  },
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite'
    },
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}'
  }
});
```

**E2E 支持文件**
```javascript
// cypress/support/e2e.js
import './commands';

Cypress.on('uncaught:exception', (err, runnable) => {
  // 忽略某些非关键错误
  return false;
});

// 全局 beforeEach
beforeEach(() => {
  // 通用设置
});
```

**自定义命令**
```javascript
// cypress/support/commands.js
Cypress.Commands.add('login', (username, password) => {
  cy.visit('/login');
  cy.get('input[name="username"]').type(username);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add('getDataCy', (selector) => {
  return cy.get(`[data-cy="${selector}"]`);
});
```

## 开发工具链集成

### ESLint 与 Prettier 集成

**基础配置**
```javascript
// eslint.config.js
import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import pluginVue from 'eslint-plugin-vue';
import pluginPrettier from 'eslint-plugin-prettier';

export default [
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx,vue}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      prettier: pluginPrettier
    },
    rules: {
      'prettier/prettier': 'error',
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn'
    }
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended
];
```

**Prettier 配置**
```javascript
// prettier.config.js
module.exports = {
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 120,
  tabWidth: 2,
  arrowParens: 'always',
  bracketSpacing: true,
  proseWrap: 'never',
  endOfLine: 'lf'
};
```

### TypeScript 配置集成

**Vue 项目 TypeScript 配置**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**React 项目 TypeScript 配置**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"]
}
```

### Git Hooks 集成 (Husky)

**安装与配置**
```bash
# 安装 Husky
npm install husky --save-dev

# 初始化 Husky
husky install

# 添加钩子
husky add .husky/pre-commit "npx lint-staged"
husky add .husky/pre-push "npm test"
```

**lint-staged 配置**
```javascript
// package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.vue": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{css,less,scss,sass}": [
      "prettier --write"
    ]
  }
}
```

## 环境配置管理

### 环境变量配置

**Vite 环境变量**
```javascript
// .env.development
VITE_API_BASE_URL=http://localhost:3001/api
VITE_APP_ENV=development

// .env.production
VITE_API_BASE_URL=https://api.example.com
VITE_APP_ENV=production
```

**Webpack 环境变量**
```javascript
// webpack.config.js
const webpack = require('webpack');
const dotenv = require('dotenv');
const env = dotenv.config().parsed;

const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

module.exports = {
  // ...
  plugins: [
    new webpack.DefinePlugin(envKeys)
  ]
};
```

### 多环境配置方案

**Vite 多环境配置**
```javascript
// vite.config.js
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  
  return {
    // ...
    define: {
      'process.env': { ...env }
    },
    server: {
      port: parseInt(env.VITE_PORT || '3000'),
      proxy: {
        '/api': {
          target: env.VITE_API_PROXY,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  };
});
```

**Webpack 多环境配置**
```javascript
// webpack.common.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  module: {
    rules: [
      // 通用规则
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ]
};

// webpack.dev.js
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    contentBase: './dist',
    hot: true
  }
});

// webpack.prod.js
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    })
  ],
  optimization: {
    // 生产环境优化
  }
});
```

## CI/CD 集成配置

### GitHub Actions 配置

**Node.js 项目基本配置**
```yaml
# .github/workflows/node.js.yml
name: Node.js CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [16.x, 18.x]

    steps:
    - uses: actions/checkout@v3
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    - run: npm ci
    - run: npm run lint
    - run: npm test
    - run: npm run build
```

**测试覆盖率报告**
```yaml
# .github/workflows/coverage.yml
name: Coverage

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  coverage:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 16
          cache: 'npm'
      - run: npm ci
      - run: npm test -- --coverage
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/coverage-final.json
          flags: unittests
          name: codecov-umbrella
```

### GitLab CI 配置

**基本配置**
```yaml
# .gitlab-ci.yml
stages:
  - lint
  - test
  - build
  - deploy

variables:
  NODE_ENV: "production"

lint:
  stage: lint
  image: node:16-alpine
  script:
    - npm ci
    - npm run lint
  artifacts:
    expire_in: 1 day

unit-test:
  stage: test
  image: node:16-alpine
  script:
    - npm ci
    - npm test
  artifacts:
    reports:
      junit: junit.xml
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

build:
  stage: build
  image: node:16-alpine
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
  only:
    - main
    - develop

deploy-staging:
  stage: deploy
  image: bitnami/git:latest
  script:
    - echo "Deploying to staging..."
  environment:
    name: staging
  only:
    - develop

deploy-production:
  stage: deploy
  image: bitnami/git:latest
  script:
    - echo "Deploying to production..."
  environment:
    name: production
  only:
    - main
  when: manual
```

## 工具配置最佳实践

### 配置文件组织

**推荐的配置文件结构**
```
project-root/
├── config/
│   ├── webpack/         # Webpack 配置
│   │   ├── common.js
│   │   ├── development.js
│   │   └── production.js
│   ├── vitest/          # Vitest 配置
│   │   └── setup.ts
│   └── cypress/         # Cypress 配置
│       └── support/
├── .eslintrc.js         # ESLint 配置
├── .prettierrc.js       # Prettier 配置
├── tsconfig.json        # TypeScript 配置
├── vite.config.js       # Vite 配置
└── cypress.config.js    # Cypress 配置
```

### 共享配置策略

**创建配置包**
```javascript
// @company/config
module.exports = {
  eslint: {
    base: () => ({
      // 基础 ESLint 配置
    }),
    vue: () => ({
      // Vue 特定配置
    }),
    react: () => ({
      // React 特定配置
    })
  },
  prettier: {
    // Prettier 配置
  },
  typescript: {
    base: () => ({
      // 基础 TS 配置
    }),
    vue: () => ({
      // Vue 特定配置
    })
  }
};
```

**使用共享配置**
```javascript
// eslint.config.js
const { eslint } = require('@company/config');

export default [
  ...eslint.base(),
  ...eslint.vue()
];
```

### 版本控制与依赖管理

**package.json 最佳实践**
```json
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "Project description",
  "main": "dist/index.js",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix --ignore-path .gitignore",
    "format": "prettier --write .",
    "prepare": "husky install"
  },
  "dependencies": {
    "vue": "^3.3.4"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.2.3",
    "eslint": "^8.45.0",
    "husky": "^8.0.3",
    "lint-staged": "^13.2.3",
    "prettier": "^3.0.0",
    "typescript": "^5.0.2",
    "vite": "^4.4.5",
    "vitest": "^0.33.0"
  },
  "lint-staged": {
    "*.{vue,js,ts,jsx,tsx}": ["eslint --fix", "prettier --write"]
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
```

## 常见集成问题解决方案

### 路径别名一致性问题

**问题**：不同工具之间路径别名配置不一致

**解决方案**：

1. **统一配置源**
```javascript
// config/aliases.js
const path = require('path');

module.exports = {
  '@': path.resolve(__dirname, '../src'),
  'components': path.resolve(__dirname, '../src/components'),
  'assets': path.resolve(__dirname, '../src/assets')
};
```

2. **在各工具中使用**
```javascript
// vite.config.js
const aliases = require('./config/aliases');

export default defineConfig({
  resolve: {
    alias: aliases
  }
});

// jest.config.js
const aliases = require('./config/aliases');
const jestAliases = {};

Object.keys(aliases).forEach(key => {
  jestAliases[`^${key}/(.*)$`] = `${aliases[key]}/$1`;
  jestAliases[`^${key}$`] = aliases[key];
});

module.exports = {
  moduleNameMapper: jestAliases
};
```

### 构建与测试环境不一致问题

**问题**：构建环境和测试环境配置不同导致行为不一致

**解决方案**：

1. **共享环境配置**
```javascript
// config/env.js
const dotenv = require('dotenv');
const path = require('path');

function loadEnv(mode = 'development') {
  const envPath = path.resolve(process.cwd(), `.env.${mode}`);
  const result = dotenv.config({ path: envPath });
  
  if (result.error) {
    console.warn(`Warning: .env.${mode} not found, using default environment`);
  }
  
  return process.env;
}

module.exports = { loadEnv };
```

2. **在测试中使用相同配置**
```javascript
// vitest.config.js
import { defineConfig } from 'vitest/config';
import { loadEnv } from './config/env';

const env = loadEnv('test');

export default defineConfig({
  test: {
    // ...
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    define: {
      'import.meta.env': env
    }
  }
});
```

### 性能优化与构建速度问题

**问题**：随着项目增大，构建速度变慢

**解决方案**：

1. **使用增量构建**
```javascript
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    hmr: {
      protocol: 'ws',
      host: 'localhost'
    }
  },
  build: {
    incremental: true
  },
  cacheDir: './node_modules/.vite'
});
```

2. **并行处理和缓存**
```javascript
// webpack.config.js
const os = require('os');
const threads = os.cpus().length - 1;

module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: threads
            }
          },
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              cacheCompression: false
            }
          }
        ]
      }
    ]
  }
};
```

## 集成检查清单

### 构建工具检查清单
- [ ] 框架插件配置正确
- [ ] 路径别名一致配置
- [ ] 环境变量正确加载
- [ ] 资源处理配置合理
- [ ] 开发和生产环境配置分离
- [ ] 构建优化选项已启用

### 测试框架检查清单
- [ ] 测试环境配置正确
- [ ] 与构建工具集成良好
- [ ] 路径解析与主项目一致
- [ ] Mock 服务配置完善
- [ ] 覆盖率报告正确生成
- [ ] CI/CD 集成测试已配置

### 开发工具链检查清单
- [ ] ESLint 与 Prettier 集成正常
- [ ] TypeScript 配置与项目匹配
- [ ] Git Hooks 正确触发
- [ ] 代码格式化工具工作正常
- [ ] IDE 集成配置完备

### 环境配置检查清单
- [ ] 多环境配置文件已创建
- [ ] 敏感信息未提交到版本控制
- [ ] 环境变量命名规范统一
- [ ] 开发/测试/生产环境隔离
- [ ] 配置变更流程明确