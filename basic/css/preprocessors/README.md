# CSS 预处理器

## 介绍

CSS预处理器是一种专门的编程语言，它扩展了CSS的语法，提供了变量、嵌套、混合等高级特性，然后编译成标准的CSS文件。使用CSS预处理器可以使CSS代码更易于维护、更具可扩展性。

## 主要预处理器

### 1. Sass/SCSS

Sass (Syntactically Awesome Style Sheets) 是最流行的CSS预处理器之一，有两种语法格式：缩进语法（Sass）和SCSS语法（Sassy CSS）。

#### 安装

```bash
# 使用npm安装
npm install -g sass

# 使用yarn安装
yarn global add sass
```

#### 编译

```bash
# 将SCSS文件编译为CSS文件
sass input.scss output.css

# 监听文件变化并自动编译
sass --watch input.scss:output.css

# 编译整个目录
sass --watch src/scss:dist/css
```

#### 主要特性

##### 变量

```scss
// SCSS语法
$primary-color: #3498db;
$font-stack: Helvetica, sans-serif;

body {
  font: 100% $font-stack;
  color: $primary-color;
}
```

##### 嵌套

```scss
nav {
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  
  li {
    display: inline-block;
  }
  
  a {
    display: block;
    padding: 6px 12px;
    text-decoration: none;
    
    &:hover {
      background-color: #f0f0f0;
    }
  }
}
```

##### 混合（Mixins）

```scss
@mixin border-radius($radius) {
  -webkit-border-radius: $radius;
  -moz-border-radius: $radius;
  -ms-border-radius: $radius;
  border-radius: $radius;
}

.button {
  @include border-radius(4px);
}
```

##### 扩展（Extend）

```scss
.message {
  padding: 10px;
  border: 1px solid #ccc;
}

.success {
  @extend .message;
  border-color: green;
  color: green;
}
```

##### 导入（Import）

```scss
// _variables.scss
$primary-color: #3498db;

// main.scss
@import 'variables';

body {
  color: $primary-color;
}
```

##### 运算

```scss
.container {
  width: 100%;
}

.article {
  width: 600px / 960px * 100%;
}
```

### 2. Less

Less (Leaner Style Sheets) 是另一种流行的CSS预处理器，语法与CSS非常相似，学习曲线较平缓。

#### 安装

```bash
# 使用npm安装
npm install -g less

# 使用yarn安装
yarn global add less
```

#### 编译

```bash
# 将Less文件编译为CSS文件
lessc input.less output.css

# 编译为压缩的CSS
lessc --compress input.less output.css
```

#### 主要特性

##### 变量

```less
@primary-color: #3498db;
@font-stack: Helvetica, sans-serif;

body {
  font: 100% @font-stack;
  color: @primary-color;
}
```

##### 嵌套

```less
nav {
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  
  li {
    display: inline-block;
  }
  
  a {
    display: block;
    padding: 6px 12px;
    text-decoration: none;
    
    &:hover {
      background-color: #f0f0f0;
    }
  }
}
```

##### 混合（Mixins）

```less
.border-radius(@radius: 5px) {
  -webkit-border-radius: @radius;
  -moz-border-radius: @radius;
  border-radius: @radius;
}

.button {
  .border-radius(4px);
}
```

##### 导入（Import）

```less
// variables.less
@primary-color: #3498db;

// main.less
@import 'variables.less';

body {
  color: @primary-color;
}
```

##### 函数

```less
@base-color: #3498db;
@light-color: lighten(@base-color, 20%);
@dark-color: darken(@base-color, 20%);

.light-bg {
  background-color: @light-color;
}

.dark-bg {
  background-color: @dark-color;
}
```

### 3. Stylus

Stylus 是一种更灵活的预处理器，它甚至允许省略花括号、分号和冒号。

#### 安装

```bash
# 使用npm安装
npm install -g stylus

# 使用yarn安装
yarn global add stylus
```

#### 编译

```bash
# 将Stylus文件编译为CSS文件
stylus input.styl -o output.css

# 监听文件变化并自动编译
stylus -w input.styl -o output.css
```

#### 主要特性

##### 灵活的语法

```stylus
// 标准语法
body {
  color: #333;
}

// 省略花括号和分号
body
  color #333

// 省略冒号
body
  color #333
```

##### 变量

```stylus
primary-color = #3498db
font-stack = Helvetica, sans-serif

body {
  font: 100% font-stack
  color: primary-color
}
```

##### 嵌套

```stylus
nav
  ul
    margin: 0
    padding: 0
    list-style: none
  
  li
    display: inline-block
  
  a
    display: block
    padding: 6px 12px
    text-decoration: none
    
    &:hover
      background-color: #f0f0f0
```

##### 混合（Mixins）

```stylus
border-radius(radius)
  -webkit-border-radius: radius
  -moz-border-radius: radius
  border-radius: radius

.button
  border-radius(4px)
```

## 工作流集成

### Webpack 集成

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(scss|sass)$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  }
}
```

### Vite 集成

```javascript
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/styles/variables.scss";`
      }
    }
  }
})
```

## 最佳实践

### 1. 变量命名规范

- 使用有意义的名称
- 采用一致的命名约定（如kebab-case或camelCase）
- 为颜色、字体、间距等创建统一的变量

### 2. 文件组织

- 将样式拆分为多个功能模块
- 使用`_partial.scss`（以下划线开头）表示部分文件
- 创建一个主文件导入所有部分文件

### 3. 避免过度嵌套

- 保持嵌套层级不超过3层
- 避免创建过于复杂的选择器

### 4. 合理使用混合和扩展

- 使用混合（Mixins）处理带参数的样式
- 使用扩展（Extend）处理共享样式
- 注意生成的CSS文件大小

## 常见问题

### 1. 如何选择合适的CSS预处理器？

- **Sass/SCSS**：功能最全面，社区最活跃，适合大型项目
- **Less**：语法接近CSS，易于学习，适合初学者
- **Stylus**：语法最灵活，自由度高，适合喜欢简洁语法的开发者

### 2. CSS预处理器的缺点是什么？

- 需要编译步骤
- 增加了项目的复杂性
- 可能导致过度工程化
- 学习曲线

### 3. 如何处理浏览器兼容性？

结合CSS预处理器和Autoprefixer使用：

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['autoprefixer']
              }
            }
          },
          'sass-loader'
        ]
      }
    ]
  }
}
```

### 4. 原生CSS已支持变量，为什么还需要预处理器？

虽然CSS变量（CSS Custom Properties）已经得到广泛支持，但预处理器仍然提供了许多原生CSS不具备的功能，如嵌套、混合、扩展、导入等，使得CSS代码更易于组织和维护。