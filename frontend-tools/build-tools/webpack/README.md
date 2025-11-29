# Webpack 构建工具详解

## 基本介绍

**Webpack** 是一个强大的静态模块打包器，它将应用程序视为一个依赖图，并将所有依赖模块打包成一个或多个 bundle。

### 核心特性
- **模块打包**：处理 JavaScript、CSS、图片等各种资源文件
- **代码分割**：按需加载，减少初始加载时间
- **loader 机制**：转换各种非 JavaScript 文件
- **插件系统**：扩展核心功能
- **Tree Shaking**：移除未使用的代码

### 安装
```bash
# 局部安装
npm install --save-dev webpack webpack-cli

# 全局安装（不推荐）
npm install -g webpack webpack-cli
```

## 基础配置示例

### 最小配置 (webpack.config.js)
```javascript
const path = require('path');

module.exports = {
  mode: 'development', // 开发模式
  entry: './src/index.js', // 入口文件
  output: {
    path: path.resolve(__dirname, 'dist'), // 输出目录
    filename: 'bundle.js' // 输出文件名
  }
};
```

### 多入口配置
```javascript
module.exports = {
  entry: {
    main: './src/index.js',
    vendor: './src/vendor.js'
  },
  output: {
    filename: '[name].[hash].js'
  }
};
```

## Loader 配置

### CSS 处理
```javascript
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      }
    ]
  }
};
```

### JavaScript 转译 (Babel)
```javascript
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
```

### 资源文件处理
```javascript
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[hash][ext][query]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[hash][ext][query]'
        }
      }
    ]
  }
};
```

## 插件配置

### HtmlWebpackPlugin
```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // ...
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      title: 'Webpack App',
      inject: 'body'
    })
  ]
};
```

### MiniCssExtractPlugin
```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles/[name].[hash].css'
    })
  ]
};
```

## 代码分割

### 动态导入
```javascript
// 懒加载模块
const loadComponent = () => import('./MyComponent');

// webpack配置
module.exports = {
  // ...
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
};
```

## 开发环境配置

### 开发服务器
```javascript
module.exports = {
  // ...
  devServer: {
    static: {
      directory: path.join(__dirname, 'public')
    },
    compress: true,
    port: 9000,
    hot: true,
    open: true
  }
};
```

## 生产环境优化

```javascript
module.exports = {
  mode: 'production',
  // ...
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
};
```

## 面试重点

### 1. Webpack 工作原理
- **依赖图构建**：从入口文件开始，递归分析所有模块依赖
- **模块转换**：通过 loader 将各种文件转换为 JavaScript 模块
- **代码生成**：将转换后的模块打包成最终输出文件

### 2. Loader vs Plugin
- **Loader**：专注于转换特定类型的文件（如 CSS、JSX）
- **Plugin**：可在整个构建过程中执行各种任务（如资源生成、优化）

### 3. 性能优化策略
- **代码分割**：按需加载，减小初始 bundle 体积
- **Tree Shaking**：移除未使用的代码
- **缓存策略**：使用 hash/chunkhash/contenthash
- **多进程构建**：thread-loader, parallel-webpack
- **CDN 加速**：配置 output.publicPath

### 4. 常见问题
- **大型项目构建慢**：使用 DllPlugin、缓存、多进程
- **内存溢出**：增加 Node.js 内存限制，优化配置
- **Tree Shaking 不生效**：确保使用 ES6 模块语法，避免副作用

### 5. 与其他构建工具比较
- **Webpack vs Vite**：Webpack 全量构建，Vite 按需编译
- **Webpack vs Rollup**：Webpack 适合应用，Rollup 适合库

## 进阶配置示例

### 完整的生产环境配置
```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(png|jpg|gif)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[hash][ext][query]'
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true
      }
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].[contenthash].css'
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
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
};
```