# 前端工具性能优化指南

## 构建工具性能优化

### Webpack 性能优化

#### 1. 开发环境优化

**提升开发服务器速度**
```javascript
// webpack.dev.js
module.exports = {
  // ...
  devServer: {
    compress: true,
    hot: true,
    liveReload: false,
    client: {
      overlay: false,
      progress: false
    }
  },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
  }
}
```

**优化 resolve 配置**
```javascript
// webpack.config.js
module.exports = {
  // ...
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'components': path.resolve(__dirname, 'src/components')
    },
    modules: [path.resolve(__dirname, 'node_modules')]
  }
}
```

#### 2. 生产环境优化

**代码分割配置**
```javascript
// webpack.prod.js
module.exports = {
  // ...
  optimization: {
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 5,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            return `npm.${packageName.replace('@', '')}`;
          },
          priority: -10
        },
        common: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    },
    runtimeChunk: 'single'
  }
}
```

**资源优化配置**
```javascript
// webpack.prod.js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024 // 小于8kb的图片转为base64
          }
        }
      }
    ]
  }
}
```

**使用持久化缓存**
```javascript
// webpack.prod.js
module.exports = {
  // ...
  cache: {
    type: 'filesystem',
    version: '1.0.0',
    buildDependencies: {
      config: [__filename]
    }
  }
}
```

#### 3. 高级优化技巧

**使用 DllPlugin 预构建依赖**
```javascript
// webpack.dll.js
const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: {
    vendor: ['react', 'react-dom', 'lodash']
  },
  output: {
    filename: '[name].dll.js',
    path: path.resolve(__dirname, 'dll'),
    library: '[name]_[hash]'
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]_[hash]',
      path: path.resolve(__dirname, 'dll/[name]-manifest.json')
    })
  ]
}
```

**并行构建**
```javascript
// webpack.config.js
const os = require('os');
const threads = os.cpus().length - 1;

module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.(js|mjs|cjs)$/,
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
              cacheDirectory: true
            }
          }
        ]
      }
    ]
  }
}
```

### Vite 性能优化

#### 1. 开发环境优化

**优化依赖预构建**
```javascript
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['some-heavy-lib'],
    esbuildOptions: {
      target: 'es2020'
    }
  },
  server: {
    hmr: {
      overlay: false
    }
  }
});
```

**配置文件系统缓存**
```javascript
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  cacheDir: './node_modules/.vite-cache',
  server: {
    fs: {
      strict: true
    }
  }
});
```

#### 2. 生产环境优化

**构建优化配置**
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import { splitVendorChunkPlugin } from 'vite';

export default defineConfig({
  plugins: [splitVendorChunkPlugin()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['lodash', 'date-fns']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
```

**资源优化**
```javascript
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    assetsInlineLimit: 4096,
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true
  }
});
```

#### 3. 高级优化技巧

**使用 CDN 加速**
```javascript
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          'react': 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
});
```

**延迟加载非关键模块**
```javascript
// 代码中使用动态导入
const HeavyComponent = () => import('./HeavyComponent.vue');
```

### Rollup 性能优化

#### 1. 基础优化

**优化构建配置**
```javascript
// rollup.config.js
export default {
  // ...
  output: {
    // ...
    manualChunks: {
      vendor: ['lodash']
    }
  },
  cache: true,
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false
  }
}
```

**使用插件加速**
```javascript
// rollup.config.js
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import babel from '@rollup/plugin-babel';

export default {
  // ...
  plugins: [
    nodeResolve({
      preferBuiltins: false,
      modulesOnly: true
    }),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**'
    }),
    terser({
      compress: {
        passes: 2
      },
      mangle: {
        toplevel: true
      }
    })
  ]
}
```

## 测试框架性能优化

### Jest 性能优化

#### 1. 配置优化

**缓存优化**
```javascript
// jest.config.js
module.exports = {
  // ...
  cacheDirectory: '<rootDir>/.jest-cache',
  maxWorkers: '50%',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.js',
    '!src/serviceWorker.js'
  ]
};
```

**模块映射和别名**
```javascript
// jest.config.js
module.exports = {
  // ...
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  moduleDirectories: ['node_modules', '<rootDir>/src']
};
```

#### 2. 执行策略优化

**使用 watch 模式**
```bash
jest --watch
```

**选择性测试**
```bash
jest --testPathPattern=component
```

**使用 --bail 选项**
```bash
jest --bail=5
```

#### 3. 代码优化

**优化 Mock 策略**
```javascript
// 集中管理 Mock
jest.mock('../api', () => ({
  fetchData: jest.fn(() => Promise.resolve({ data: 'mocked' }))
}));

// 测试后清理
afterEach(() => {
  jest.clearAllMocks();
});
```

**避免重复设置**
```javascript
// 适当使用 beforeAll/afterAll
beforeAll(() => {
  // 一次性设置
});

afterAll(() => {
  // 一次性清理
});
```

### Vitest 性能优化

#### 1. 配置优化

**并行测试配置**
```javascript
// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // ...
  test: {
    // ...
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        maxThreads: 4
      }
    },
    isolate: true,
    deps: {
      inline: ['vitest-canvas-mock']
    }
  }
});
```

**缓存和优化配置**
```javascript
// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // ...
  test: {
    // ...
    cache: {
      dir: './node_modules/.vitest'
    },
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache']
  }
});
```

#### 2. 执行策略优化

**过滤测试执行**
```bash
vitest run --testNamePattern="should work"
```

**使用 watch 模式**
```bash
vitest
```

#### 3. 代码优化

**智能 Mock**
```javascript
// 使用 vi.mock 而不是 jest.mock
import { vi } from 'vitest';

vi.mock('../api', () => ({
  fetchData: vi.fn().mockResolvedValue({ data: 'mocked' })
}));
```

**使用快照优化**
```javascript
// 避免大快照
it('should render correctly', () => {
  const { container } = render(<Component />);
  expect(container.querySelector('.content')).toMatchSnapshot();
});
```

### Cypress 性能优化

#### 1. 配置优化

**并行测试配置**
```javascript
// cypress.config.js
const { defineConfig } = require('cypress');

export default defineConfig({
  // ...
  e2e: {
    // ...
    parallel: true,
    numTestsKeptInMemory: 5,
    defaultCommandTimeout: 4000,
    pageLoadTimeout: 30000
  },
  video: false,
  screenshotOnRunFailure: true
});
```

**减少资源消耗**
```javascript
// cypress.config.js
const { defineConfig } = require('cypress');

export default defineConfig({
  // ...
  e2e: {
    // ...
    experimentalMemoryManagement: true
  },
  viewportWidth: 1280,
  viewportHeight: 720,
  chromeWebSecurity: false
});
```

#### 2. 执行策略优化

**分组测试**
```javascript
// 使用 describe 分组
context('User Authentication', () => {
  describe('Login', () => {
    it('should login successfully', () => {
      // ...
    });
  });
});
```

**使用 spec 文件隔离**
```bash
cypress run --spec "cypress/e2e/login.cy.js"
```

#### 3. 代码优化

**避免重复访问**
```javascript
// 使用 as 保存引用
cy.get('.login-form').as('loginForm');
cy.get('@loginForm').find('input[name="username"]').type('user');
cy.get('@loginForm').find('input[name="password"]').type('pass');
```

**使用 fixtures**
```javascript
// cypress/fixtures/users.json
{
  "validUser": { "username": "user", "password": "pass" }
}

// 测试中使用
cy.fixture('users').then((users) => {
  cy.get('input[name="username"]').type(users.validUser.username);
});
```

## 通用性能优化最佳实践

### 1. 开发环境优化

**使用正确的源映射**
```javascript
// 开发环境使用 eval-cheap-module-source-map
// 生产环境使用 source-map 或关闭
module.exports = {
  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'eval-cheap-module-source-map'
}
```

**使用增量构建**
```javascript
// webpack.config.js
module.exports = {
  // ...
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
    ignored: /node_modules/,
    followSymlinks: true
  }
}
```

### 2. 生产环境优化

**代码压缩策略**
```javascript
// webpack.prod.js
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  // ...
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true
          }
        }
      }),
      new CssMinimizerPlugin({
        parallel: true
      })
    ]
  }
}
```

**预加载和预缓存**
```javascript
// webpack.config.js
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  // ...
  plugins: [
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/api\./,
          handler: 'NetworkFirst'
        }
      ]
    })
  ]
}
```

### 3. CI/CD 中的性能优化

**缓存依赖**
```yaml
# GitHub Actions 示例
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 16
          cache: 'npm'
      - run: npm ci
      - run: npm run build
```

**并行测试执行**
```yaml
# GitHub Actions 示例
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        shard: [1, 2, 3, 4]
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm test -- --shard=${{ matrix.shard }}/4
```

### 4. 性能监控和分析

**使用构建分析工具**
```bash
# Webpack Bundle Analyzer
npm install --save-dev webpack-bundle-analyzer

# 在 webpack 配置中添加
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
}
```

**测试覆盖率报告**
```bash
# Jest 覆盖率
jest --coverage

# Vitest 覆盖率
vitest run --coverage
```

### 5. 常见性能问题及解决方案

**问题：构建时间过长**
- **解决方法**：使用缓存、并行构建、优化loader配置

**问题：测试执行缓慢**
- **解决方法**：使用并行测试、减少不必要的断言、优化mock策略

**问题：bundle体积过大**
- **解决方法**：代码分割、Tree Shaking、动态导入、外部化依赖

**问题：开发服务器启动慢**
- **解决方法**：优化依赖预构建、使用更快的开发服务器、减少不必要的插件

## 性能优化检查清单

### 构建流程检查清单
- [ ] 是否启用了持久化缓存？
- [ ] 是否使用了并行构建？
- [ ] 是否优化了第三方依赖处理？
- [ ] 是否配置了合理的代码分割策略？
- [ ] 是否使用了适当的压缩工具？
- [ ] 是否分析了构建输出大小？
- [ ] 是否优化了资源处理（图片、字体等）？

### 测试流程检查清单
- [ ] 是否配置了并行测试？
- [ ] 是否优化了测试运行策略？
- [ ] 是否避免了重复的测试设置？
- [ ] 是否使用了智能的mock策略？
- [ ] 是否优化了断言和快照？
- [ ] 是否减少了不必要的浏览器实例？
- [ ] 是否分析了测试执行时间？

### 持续集成检查清单
- [ ] 是否缓存了依赖？
- [ ] 是否并行运行了构建和测试？
- [ ] 是否设置了合理的超时时间？
- [ ] 是否监控了构建性能趋势？
- [ ] 是否自动化了性能报告？