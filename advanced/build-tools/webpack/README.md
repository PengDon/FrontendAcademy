# Webpack 基础知识

## Webpack 简介

Webpack 是一个现代 JavaScript 应用程序的静态模块打包器 (static module bundler)。当 Webpack 处理应用程序时，它会递归地构建一个依赖关系图 (dependency graph)，然后将应用程序所需的每个模块打包成一个或多个 bundle。

### 核心特点

- **模块打包**：支持各种模块系统 (ES modules, CommonJS, AMD)
- **代码分割**：将代码分割成更小的 chunks，实现按需加载
- **资源处理**：可以处理各种资源文件 (JavaScript, CSS, 图片, 字体等)
- **插件系统**：丰富的插件生态，几乎可以做任何定制化需求
- **开发工具**：热模块替换 (HMR)，源码映射等开发体验优化
- **生产优化**：代码压缩，tree shaking，代码分割等性能优化

### 适用场景

- 复杂的单页应用 (SPA)
- 需要处理多种资源类型的项目
- 大型企业级应用
- 需要精细控制构建过程的项目

## 快速入门

### 安装 Webpack

```bash
# 安装 webpack 和 webpack-cli
npm install --save-dev webpack webpack-cli
```

### 基本配置文件

创建 `webpack.config.js` 文件：

```javascript
// webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
```

### package.json 配置

```json
{
  "name": "webpack-demo",
  "version": "1.0.0",
  "scripts": {
    "build": "webpack",
    "watch": "webpack --watch",
    "dev": "webpack serve --mode development"
  },
  "devDependencies": {
    "webpack": "^5.88.0",
    "webpack-cli": "^5.1.0",
    "webpack-dev-server": "^4.15.0"
  }
}
```

### 运行构建

```bash
# 生产构建
npm run build

# 开发模式并监听变化
npm run watch

# 开发服务器
npm run dev
```

## 核心概念

### 1. 入口 (Entry)

入口指定 Webpack 应该使用哪个模块作为构建其内部依赖图的开始。

```javascript
// 单入口
module.exports = {
  entry: './src/index.js',
};

// 多入口
module.exports = {
  entry: {
    main: './src/index.js',
    vendor: './src/vendor.js',
  },
};
```

### 2. 输出 (Output)

输出告诉 Webpack 在哪里输出它所创建的 bundle，以及如何命名这些文件。

```javascript
module.exports = {
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/assets/',
    clean: true, // 清理 dist 目录
  },
};
```

### 3. 加载器 (Loaders)

加载器允许 Webpack 处理非 JavaScript 文件，将它们转换为有效模块。

#### 常用加载器

```bash
# CSS 处理
npm install --save-dev style-loader css-loader

# SCSS 处理
npm install --save-dev sass sass-loader

# 图片处理
npm install --save-dev file-loader url-loader asset modules (Webpack 5 内置)

# 转译 JavaScript
npm install --save-dev babel-loader @babel/core @babel/preset-env
```

#### 加载器配置

```javascript
module.exports = {
  module: {
    rules: [
      // CSS 处理
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      // SCSS 处理
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      // 图片处理 (Webpack 5)
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[hash][ext][query]',
        },
      },
      // Babel 转译
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
```

### 4. 插件 (Plugins)

插件可以执行范围更广的任务，从打包优化和压缩，到重新定义环境变量。

#### 常用插件

```bash
# HTML 模板
npm install --save-dev html-webpack-plugin

# 清理 dist 目录
npm install --save-dev clean-webpack-plugin

# 提取 CSS 到单独文件
npm install --save-dev mini-css-extract-plugin

# 压缩 CSS
npm install --save-dev css-minimizer-webpack-plugin
```

#### 插件配置

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      title: 'Webpack Demo',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
      },
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
    }),
  ],
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
    ],
  },
};
```

### 5. 模式 (Mode)

模式可以启用 Webpack 内置的优化。

```javascript
module.exports = {
  mode: 'development', // 'development' 或 'production'
};
```

## 开发工具

### 1. 开发服务器

```bash
npm install --save-dev webpack-dev-server
```

```javascript
module.exports = {
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 3000,
    hot: true,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
};
```

### 2. 源码映射 (Source Maps)

```javascript
module.exports = {
  devtool: 'source-map', // 'eval', 'eval-source-map', 'inline-source-map', 'source-map'
};
```

### 3. 热模块替换 (HMR)

```javascript
module.exports = {
  devServer: {
    hot: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
};
```

在代码中接受热更新：

```javascript
if (module.hot) {
  module.hot.accept('./module.js', function() {
    console.log('Module has been updated!');
    // 执行更新逻辑
  });
}
```

## 优化策略

### 1. 代码分割

#### 入口点分割

```javascript
module.exports = {
  entry: {
    main: './src/index.js',
    vendor: './src/vendor.js',
  },
};
```

#### 动态导入

```javascript
// 动态导入实现代码分割
function loadComponent() {
  return import('./HeavyComponent.js');
}
```

#### SplitChunksPlugin

```javascript
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        utilities: {
          test: /[\\/]src[\\/]utilities[\\/]/,
          name: 'utilities',
          chunks: 'all',
        },
      },
    },
  },
};
```

### 2. Tree Shaking

确保在 `package.json` 中设置了 `"sideEffects"`：

```json
{
  "name": "my-project",
  "sideEffects": false,
  // 或指定哪些文件有副作用
  "sideEffects": ["*.css", "./src/polyfills.js"]
}
```

### 3. 代码压缩

#### JavaScript 压缩

```javascript
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};
```

#### CSS 压缩

```javascript
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  optimization: {
    minimizer: [new CssMinimizerPlugin()],
  },
};
```

### 4. 持久化缓存

```javascript
module.exports = {
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },
};
```

## 高级配置示例

### 1. 多环境配置

创建三个配置文件：

**webpack.common.js**
```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
```

**webpack.dev.js**
```javascript
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    static: './dist',
    hot: true,
  },
});
```

**webpack.prod.js**
```javascript
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: 'all',
    },
  },
});
```

更新 package.json：
```json
{
  "scripts": {
    "build": "webpack --config webpack.prod.js",
    "dev": "webpack serve --config webpack.dev.js"
  }
}
```

### 2. 资源优化配置

```javascript
module.exports = {
  module: {
    rules: [
      // 图片处理
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: 'asset',
        generator: {
          filename: 'assets/[hash][ext][query]',
        },
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024, // 小于 8kb 的图片会被转为 base64
          },
        },
      },
      // 字体处理
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[hash][ext][query]',
        },
      },
      // SVG 处理
      {
        test: /\.svg$/,
        type: 'asset/inline',
      },
    ],
  },
};
```

## 与框架集成

### React 集成

```bash
npm install --save react react-dom
npm install --save-dev @babel/core @babel/preset-env @babel/preset-react babel-loader
```

**babel.config.js**
```javascript
module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
};
```

**webpack.config.js**
```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
```

### Vue 集成

```bash
npm install --save vue
npm install --save-dev vue-loader vue-template-compiler
```

**webpack.config.js**
```javascript
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
  ],
};
```

## 常见问题与解决方案

### 1. 模块解析错误

**问题**：无法解析模块路径。

**解决方案**：配置 resolve.alias 别名。

```javascript
module.exports = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.jsx', '.json', '.vue'],
  },
};
```

### 2. 性能警告

**问题**：警告 bundle 体积过大。

**解决方案**：
- 启用代码分割
- 优化依赖
- 配置性能限制

```javascript
module.exports = {
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
};
```

### 3. 热模块替换不工作

**解决方案**：
- 确保启用了 HMR
- 检查是否正确接受热更新
- 检查是否有错误阻止了 HMR

### 4. 构建速度慢

**解决方案**：
- 启用持久化缓存
- 排除不需要处理的目录
- 使用多进程/多线程构建

```javascript
const ThreadsPlugin = require('threads-plugin');

module.exports = {
  plugins: [
    new ThreadsPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        ],
      },
    ],
  },
};
```

## 性能监控

### 使用 webpack-bundle-analyzer

```bash
npm install --save-dev webpack-bundle-analyzer
```

```javascript
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin(),
  ],
};
```

## 最佳实践

1. **合理配置入口点**：避免过多的入口点，使用动态导入进行代码分割
2. **优化依赖**：只包含必要的依赖，移除未使用的依赖
3. **合理使用插件**：避免过度使用插件，它们会增加构建时间
4. **缓存优化**：利用浏览器缓存和构建缓存提高性能
5. **开发与生产环境分离**：使用不同的配置文件优化不同环境
6. **代码审查**：定期检查 bundle 大小，优化大型依赖
7. **自动化构建**：使用 CI/CD 流程自动构建和部署

## 学习资源

### 官方文档

- [Webpack 官方文档](https://webpack.js.org/concepts/)
- [Webpack GitHub 仓库](https://github.com/webpack/webpack)

### 教程与示例

- [Webpack 入门指南](https://webpack.js.org/guides/getting-started/)
- [Webpack 代码分割指南](https://webpack.js.org/guides/code-splitting/)
- [Webpack 性能优化指南](https://webpack.js.org/guides/build-performance/)

### 视频教程

- [Webpack 4 从入门到精通](https://www.bilibili.com/video/BV1e7411j7T5/)
- [Webpack 5 实战教程](https://www.bilibili.com/video/BV1P34y1a7qH/)

## 总结

Webpack 是一个功能强大的模块打包器，通过本指南的学习，你已经掌握了 Webpack 的基本配置和高级特性。在实际项目中，你应该根据项目需求选择合适的配置和优化策略，平衡开发体验和生产性能。

记住，Webpack 是一个工具，它的目标是帮助你更好地构建和优化应用程序。随着前端技术的发展，Webpack 也在不断更新和完善，定期关注官方文档和社区动态，可以帮助你更好地利用 Webpack 的最新特性。

---

希望这份 Webpack 基础知识文档能够帮助你快速上手 Webpack 并在项目中充分发挥其优势。通过持续学习和实践，你将能够更深入地理解 Webpack 的工作原理，构建出性能优秀的前端应用。