# Rollup 构建工具详解

## 基本介绍

**Rollup** 是一个 JavaScript 模块打包器，专注于 JavaScript 库的构建。它能够将小块代码编译成大块复杂的代码，如 library 或应用程序。Rollup 对 ES6 模块提供了原生支持，并能高效地进行 Tree Shaking。

### 核心特性
- **高效的 Tree Shaking**：移除未使用的代码
- **ES 模块优先**：原生支持 ES6 模块语法
- **简洁的配置**：API 设计简洁明了
- **多种输出格式**：支持 CommonJS、UMD、ESM 等多种模块格式
- **插件生态**：通过插件扩展功能

### 与 Webpack 的区别
- **用途**：Rollup 更适合构建库，Webpack 更适合构建应用
- **Tree Shaking**：Rollup 的 Tree Shaking 更加高效
- **配置**：Rollup 配置更简洁，Webpack 配置更复杂但功能更全面
- **输出**：Rollup 支持更多模块格式，Webpack 主要输出 bundle

### 安装
```bash
# 局部安装
npm install --save-dev rollup

# 全局安装
npm install -g rollup
```

## 基础配置

### 最小配置 (rollup.config.js)
```javascript
export default {
  input: 'src/main.js', // 入口文件
  output: {
    file: 'bundle.js', // 输出文件
    format: 'cjs' // 输出格式
  }
};
```

### 多格式输出
```javascript
export default {
  input: 'src/main.js',
  output: [
    { file: 'dist/bundle.cjs.js', format: 'cjs' },
    { file: 'dist/bundle.esm.js', format: 'es' },
    { file: 'dist/bundle.umd.js', format: 'umd', name: 'MyLibrary' }
  ]
};
```

## 插件配置

### 常用插件
```bash
# 安装常用插件
npm install --save-dev @rollup/plugin-node-resolve @rollup/plugin-commonjs @rollup/plugin-babel @rollup/plugin-terser
```

### 插件配置示例
```javascript
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'umd',
    name: 'MyLibrary'
  },
  plugins: [
    resolve(), // 解析第三方依赖
    commonjs(), // 转换 CommonJS 模块
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**'
    }),
    terser() // 压缩代码
  ]
};
```

## 输出格式详解

### ES (ES 模块)
```javascript
output: {
  file: 'dist/bundle.es.js',
  format: 'es'
}
```
- **用途**：用于支持 ES 模块的现代浏览器
- **特点**：保留 ES 模块语法，支持 Tree Shaking

### CommonJS (CJS)
```javascript
output: {
  file: 'dist/bundle.cjs.js',
  format: 'cjs'
}
```
- **用途**：用于 Node.js 环境
- **特点**：使用 require() 和 module.exports

### UMD (通用模块定义)
```javascript
output: {
  file: 'dist/bundle.umd.js',
  format: 'umd',
  name: 'MyLibrary' // 全局变量名
}
```
- **用途**：可在浏览器、AMD 和 CommonJS 环境中使用
- **特点**：最通用的格式，支持多种环境

### IIFE (立即调用函数表达式)
```javascript
output: {
  file: 'dist/bundle.js',
  format: 'iife',
  name: 'MyLibrary'
}
```
- **用途**：直接在浏览器中通过 script 标签使用
- **特点**：创建一个闭包环境

## 高级配置

### 代码分割
```javascript
export default {
  input: {
    main: 'src/main.js',
    utils: 'src/utils.js'
  },
  output: {
    dir: 'dist',
    format: 'es'
  }
};
```

### 外部依赖
```javascript
export default {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'umd',
    name: 'MyLibrary',
    globals: {
      lodash: '_'
    }
  },
  external: ['lodash'] // 外部依赖不打包
};
```

### 动态导入
```javascript
// 在代码中使用动态导入
const module = await import('./dynamic-module.js');
```

```javascript
// rollup 配置
export default {
  input: 'src/main.js',
  output: {
    dir: 'dist',
    format: 'es'
  }
};
```

## 样式处理

### CSS 处理
```bash
npm install --save-dev rollup-plugin-postcss
```

```javascript
import postcss from 'rollup-plugin-postcss';

export default {
  // ...
  plugins: [
    postcss({
      extensions: ['.css'],
      extract: 'dist/bundle.css'
    })
  ]
};
```

## 开发环境配置

### 开发服务器
```bash
npm install --save-dev rollup-plugin-serve rollup-plugin-livereload
```

```javascript
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

export default {
  // ...
  plugins: [
    // ...
    serve({
      open: true,
      contentBase: ['dist', 'public'],
      port: 3000
    }),
    livereload('dist')
  ]
};
```

## 面试重点

### 1. Tree Shaking 原理
- **静态分析**：Rollup 静态分析 ES 模块的导入导出，确定哪些代码被使用
- **无用代码消除**：移除未被引用的导出和相关代码
- **死代码消除**：移除永远不会执行的代码
- **工作条件**：使用 ES6 模块语法，避免副作用

### 2. Rollup vs Webpack vs Vite
- **Rollup**：专注于库构建，Tree Shaking 高效，配置简单
- **Webpack**：全功能打包器，适合复杂应用，支持各种资源
- **Vite**：开发服务器使用原生 ES 模块，生产构建使用 Rollup

### 3. 打包库的最佳实践
- **多格式输出**：同时支持 ESM、CJS、UMD 格式
- **外部依赖处理**：使用 external 配置避免重复打包
- **源码映射**：生成 sourcemap 便于调试
- **压缩优化**：生产环境使用 terser 压缩

### 4. 性能优化策略
- **代码分割**：将大库拆分为多个小模块
- **按需加载**：使用动态导入实现按需加载
- **缓存策略**：合理使用缓存减少构建时间

### 5. 常见问题
- **CommonJS 模块转换**：需要使用 @rollup/plugin-commonjs
- **Node.js API 使用**：可能需要 polyfill 或额外配置
- **浏览器兼容性**：使用 Babel 转换 ES6+ 语法

## 完整配置示例

```javascript
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import json from '@rollup/plugin-json';
import filesize from 'rollup-plugin-filesize';
import { visualizer } from 'rollup-plugin-visualizer';
import pkg from './package.json';

// 外部依赖
const external = Object.keys(pkg.dependencies || {});

// Babel 配置
const babelOptions = {
  babelHelpers: 'bundled',
  presets: ['@babel/preset-env'],
  exclude: 'node_modules/**'
};

// 基础配置
const baseConfig = {
  input: 'src/index.js',
  external,
  plugins: [
    resolve(),
    commonjs(),
    json(),
    babel(babelOptions),
    postcss({
      extract: true,
      minimize: true
    }),
    filesize()
  ]
};

// 开发配置
const devConfig = {
  ...baseConfig,
  output: [
    {
      file: 'dist/index.esm.js',
      format: 'es',
      sourcemap: true
    }
  ]
};

// 生产配置
const prodConfig = {
  ...baseConfig,
  output: [
    {
      file: 'dist/index.esm.js',
      format: 'es'
    },
    {
      file: 'dist/index.cjs.js',
      format: 'cjs'
    },
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'MyLibrary',
      globals: {
        // 外部依赖的全局变量映射
      }
    }
  ],
  plugins: [
    ...baseConfig.plugins,
    terser(),
    visualizer({
      filename: 'stats.html',
      open: false
    })
  ]
};

// 根据环境导出相应配置
export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig;
```

## 构建命令

在 package.json 中添加构建脚本：

```json
{
  "scripts": {
    "build": "rollup -c",
    "dev": "rollup -c -w",
    "build:prod": "NODE_ENV=production rollup -c"
  }
}
```