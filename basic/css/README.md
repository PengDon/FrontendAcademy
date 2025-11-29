# CSS 基础

## 📚 介绍

CSS (Cascading Style Sheets) 是一种样式表语言，用于描述HTML或XML文档的呈现方式。它控制网页元素的外观，包括布局、颜色、字体和动画等。

### 核心特点

- **层叠性**：样式可以从多个来源继承和叠加
- **灵活性**：支持响应式设计和各种布局技术
- **可维护性**：允许将样式与内容分离
- **丰富的视觉效果**：支持动画、过渡和高级选择器
- **跨平台兼容**：适用于各种设备和浏览器

## 📊 学习路径

### 基础阶段
- 理解CSS基本语法和选择器
- 掌握盒模型概念
- 学习基本布局属性
- 实践颜色、字体和文本样式

### 进阶阶段
- 深入理解CSS布局技术(Flexbox/Grid)
- 学习响应式设计原则
- 掌握CSS动画和过渡效果
- 实践常见UI组件样式设计

### 高级阶段
- 优化CSS性能
- 学习CSS架构方法(BEM/OOCSS)
- 掌握CSS预处理器(Sass/Less)
- 实践复杂布局和交互效果

## CSS 基本语法

```css
/* 选择器 { 属性: 值; } */
selector {
  property: value;
  another-property: another-value;
}

/* 示例 */
h1 {
  color: blue;
  font-size: 24px;
}
```

## CSS 引入方式

### 内联样式

```html
<p style="color: red; font-size: 16px;">这是一段内联样式文本。</p>
```

### 内部样式表

```html
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      color: #333;
    }
    
    h1 {
      color: blue;
    }
  </style>
</head>
```

### 外部样式表

```html
<!-- 在 HTML 中引入 -->
<head>
  <link rel="stylesheet" href="styles.css">
</head>

<!-- 在 CSS 文件中引入其他 CSS -->
@import url('variables.css');
@import url('typography.css');
```

## 选择器

### 基础选择器

```css
/* 元素选择器 */
p { color: blue; }

/* ID 选择器 */
#unique-element { background-color: yellow; }

/* 类选择器 */
.highlight { font-weight: bold; }

/* 通用选择器 */
* { margin: 0; padding: 0; }

/* 属性选择器 */
[href] { color: green; }
[href="https://example.com"] { color: red; }
[class^="btn-"] { padding: 10px; } /* 以 btn- 开头的类 */
[class$="-active"] { background-color: #ddd; } /* 以 -active 结尾的类 */
[class*="item"] { border: 1px solid #ccc; } /* 包含 item 的类 */
```

### 组合选择器

```css
/* 后代选择器 */
div p { color: purple; }

/* 子选择器 */
div > p { color: orange; }

/* 相邻兄弟选择器 */
h2 + p { margin-top: 10px; }

/* 通用兄弟选择器 */
h2 ~ p { margin-left: 20px; }

/* 分组选择器 */
h1, h2, h3 { color: teal; }
```

### 伪类选择器

```css
/* 链接伪类 */
a:link { color: blue; } /* 未访问的链接 */
a:visited { color: purple; } /* 已访问的链接 */
a:hover { color: red; } /* 鼠标悬停时 */
a:active { color: green; } /* 点击时 */

/* 用户界面伪类 */
input:focus { border-color: #00f; }
input:disabled { background-color: #f0f0f0; }
input:checked { box-shadow: 0 0 0 2px blue; }

/* 结构伪类 */
li:first-child { font-weight: bold; }
li:last-child { font-style: italic; }
li:nth-child(2) { color: red; }
li:nth-child(odd) { background-color: #f0f0f0; } /* 奇数项 */
li:nth-child(even) { background-color: #fff; } /* 偶数项 */
li:nth-child(3n) { color: green; } /* 每3项 */
li:nth-last-child(2) { text-decoration: underline; }

/* 否定伪类 */
:not(.highlight) { opacity: 0.7; }
```

### 伪元素选择器

```css
/* 文本相关伪元素 */
p::first-line { font-weight: bold; }
p::first-letter { font-size: 2em; }

/* 生成内容伪元素 */
element::before { content: "前缀"; }
element::after { content: "后缀"; }

/* 选择高亮伪元素 */
::selection { background-color: yellow; color: black; }
::-moz-selection { background-color: yellow; color: black; }

/* 占位符伪元素 */
input::placeholder { color: #999; }
```

## 盒模型

### 基本盒模型

```css
.element {
  /* 内容区域 */
  width: 300px;
  height: 200px;
  
  /* 内边距 */
  padding: 20px;
  padding-top: 10px;
  padding-right: 15px;
  padding-bottom: 10px;
  padding-left: 15px;
  /* 简写: padding: top right bottom left; */
  padding: 10px 15px 10px 15px;
  /* 简写: padding: vertical horizontal; */
  padding: 10px 15px;
  
  /* 边框 */
  border: 1px solid #000;
  border-width: 2px;
  border-style: dashed;
  border-color: #f00;
  /* 圆角 */
  border-radius: 5px;
  
  /* 外边距 */
  margin: 20px;
  margin-top: 10px;
  margin-right: 15px;
  margin-bottom: 10px;
  margin-left: 15px;
  /* 简写: margin: top right bottom left; */
  margin: 10px 15px 10px 15px;
  /* 简写: margin: vertical horizontal; */
  margin: 10px 15px;
}

/* 盒模型计算方式 */
.element {
  /* 标准盒模型: width/height 只包括内容区域 */
  box-sizing: content-box;
  
  /* 替代盒模型: width/height 包括内容区域、内边距和边框 */
  box-sizing: border-box;
}

/* 全局重置为替代盒模型 */
* {
  box-sizing: border-box;
}
```

## 字体和文本

```css
/* 字体设置 */
element {
  font-family: 'Arial', sans-serif;
  font-size: 16px;
  font-weight: normal; /* normal, bold, 100-900 */
  font-style: normal; /* normal, italic, oblique */
  font-variant: normal;
  line-height: 1.5; /* 行高 */
}

/* 文本设置 */
element {
  color: #333;
  text-align: left; /* left, right, center, justify */
  text-decoration: none; /* none, underline, overline, line-through */
  text-transform: none; /* none, uppercase, lowercase, capitalize */
  text-indent: 20px; /* 首行缩进 */
  letter-spacing: 1px; /* 字间距 */
  word-spacing: 2px; /* 词间距 */
  white-space: normal; /* normal, nowrap, pre, pre-wrap, pre-line */
  overflow-wrap: break-word; /* 长单词换行 */
}

/* 字体简写 */
element {
  font: italic bold 16px/1.5 'Arial', sans-serif;
  /* font-style font-weight font-size/line-height font-family */
}
```

## 颜色和背景

```css
/* 颜色值表示 */
element {
  /* 颜色名称 */
  color: red;
  
  /* 十六进制 */
  color: #ff0000;
  color: #f00; /* 简写 */
  
  /* RGB */
  color: rgb(255, 0, 0);
  
  /* RGBA (带透明度) */
  color: rgba(255, 0, 0, 0.5);
  
  /* HSL (色相, 饱和度, 亮度) */
  color: hsl(0, 100%, 50%);
  
  /* HSLA (带透明度) */
  color: hsla(0, 100%, 50%, 0.5);
}

/* 背景设置 */
element {
  background-color: #f0f0f0;
  background-image: url('image.jpg');
  background-repeat: no-repeat; /* repeat, repeat-x, repeat-y, no-repeat */
  background-position: center center; /* top, right, bottom, left, center */
  background-size: cover; /* auto, contain, cover, 100px 100px */
  background-attachment: scroll; /* scroll, fixed, local */
  background-origin: padding-box; /* padding-box, border-box, content-box */
  background-clip: padding-box; /* padding-box, border-box, content-box, text */
}

/* 背景简写 */
element {
  background: #f0f0f0 url('image.jpg') no-repeat center center/cover;
}

/* 渐变背景 */
.linear-gradient {
  background: linear-gradient(to right, red, blue);
  background: linear-gradient(45deg, red, blue);
  background: linear-gradient(to bottom right, red, yellow, blue);
}

.radial-gradient {
  background: radial-gradient(circle, red, blue);
  background: radial-gradient(circle at center, red 0%, blue 100%);
}

/* 多背景 */
.multiple-bg {
  background: 
    url('image1.png') top left no-repeat,
    url('image2.png') bottom right no-repeat,
    linear-gradient(to right, #f0f0f0, #ddd);
}
```

## 布局技术

### 标准流和基本定位

```css
/* 显示属性 */
element {
  display: block; /* block, inline, inline-block, none, flex, grid, etc. */
  visibility: visible; /* visible, hidden, collapse */
  opacity: 1; /* 0-1 */
}

/* 定位 */
.static {
  position: static; /* 默认值 */
}

.relative {
  position: relative; /* 相对自身正常位置 */
  top: 10px;
  left: 20px;
}

.absolute {
  position: absolute; /* 相对于最近的非 static 祖先元素 */
  top: 0;
  right: 0;
}

.fixed {
  position: fixed; /* 相对于浏览器窗口 */
  top: 0;
  left: 0;
}

.sticky {
  position: sticky; /* 基于用户滚动位置 */
  top: 50px;
}

/* z-index (层叠顺序) */
element {
  z-index: 10; /* 数值越大，层级越高 */
}
```

### 弹性布局 (Flexbox)

```css
/* 容器属性 */
.flex-container {
  display: flex;
  
  /* 主轴方向 */
  flex-direction: row; /* row, row-reverse, column, column-reverse */
  
  /* 主轴对齐 */
  justify-content: flex-start; /* flex-start, flex-end, center, space-between, space-around, space-evenly */
  
  /* 交叉轴对齐 */
  align-items: stretch; /* stretch, flex-start, flex-end, center, baseline */
  
  /* 多行容器的交叉轴对齐 */
  align-content: stretch; /* stretch, flex-start, flex-end, center, space-between, space-around */
  
  /* 是否换行 */
  flex-wrap: nowrap; /* nowrap, wrap, wrap-reverse */
}

/* 项目属性 */
.flex-item {
  /* 放大比例 */
  flex-grow: 0; /* 默认 0，不放大 */
  
  /* 缩小比例 */
  flex-shrink: 1; /* 默认 1，允许缩小 */
  
  /* 基础尺寸 */
  flex-basis: auto; /* 默认 auto，根据内容决定 */
  
  /* 简写 flex: grow shrink basis */
  flex: 0 1 auto; /* 默认值 */
  flex: 1; /* 等价于 1 1 0% */
  flex: auto; /* 等价于 1 1 auto */
  flex: none; /* 等价于 0 0 auto */
  
  /* 单个项目的交叉轴对齐 */
  align-self: auto; /* auto, stretch, flex-start, flex-end, center, baseline */
  
  /* 项目顺序 */
  order: 0; /* 默认 0，数值越小越靠前 */
}
```

### 网格布局 (Grid)

```css
/* 容器属性 */
.grid-container {
  display: grid;
  
  /* 定义网格列 */
  grid-template-columns: 1fr 1fr 1fr; /* 三列，每列等宽 */
  grid-template-columns: 200px 1fr; /* 第一列 200px，第二列占剩余空间 */
  grid-template-columns: repeat(3, 1fr); /* 重复 3 次 1fr */
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* 自动填充，最小宽度 200px */
  
  /* 定义网格行 */
  grid-template-rows: 100px 1fr; /* 第一行 100px，第二行占剩余空间 */
  grid-template-rows: repeat(2, 1fr); /* 两行，每行等宽 */
  
  /* 简写 grid-template */
  grid-template: 
    "header header header" 100px
    "sidebar content content" 1fr
    "footer footer footer" 50px
    / 200px 1fr 1fr;
  
  /* 网格间隙 */
  gap: 20px; /* 行列间隙都为 20px */
  row-gap: 10px; /* 行间隙 */
  column-gap: 20px; /* 列间隙 */
  
  /* 网格区域命名 */
  grid-template-areas: 
    "header header"
    "sidebar main"
    "footer footer";
  
  /* 内容对齐 */
  justify-content: stretch; /* 主轴对齐：stretch, start, end, center, space-between, space-around, space-evenly */
  align-content: stretch; /* 交叉轴对齐：stretch, start, end, center, space-between, space-around, space-evenly */
  
  /* 项目对齐 */
  justify-items: stretch; /* 单元格内容在主轴方向的对齐 */
  align-items: stretch; /* 单元格内容在交叉轴方向的对齐 */
}

/* 项目属性 */
.grid-item {
  /* 指定项目位置 */
  grid-column-start: 1;
  grid-column-end: 3; /* 跨越 1-3 列，即两列 */
  grid-row-start: 1;
  grid-row-end: 2;
  
  /* 简写 */
  grid-column: 1 / 3;
  grid-row: 1 / 2;
  
  /* 跨越的列数/行数 */
  grid-column: 1 / span 2; /* 从第 1 列开始，跨越 2 列 */
  grid-row: 1 / span 1; /* 从第 1 行开始，跨越 1 行 */
  
  /* 命名区域 */
  grid-area: header; /* 使用预定义的区域名 */
  
  /* 单个项目对齐 */
  justify-self: stretch; /* 覆盖容器的 justify-items */
  align-self: stretch; /* 覆盖容器的 align-items */
}
```

## 响应式设计

### 媒体查询

```css
/* 基本语法 */
@media media-type and (media-feature) {
  /* CSS 规则 */
}

/* 示例 */

/* 针对所有设备的横屏模式 */
@media (orientation: landscape) {
  .container {
    flex-direction: row;
  }
}

/* 针对所有设备的竖屏模式 */
@media (orientation: portrait) {
  .container {
    flex-direction: column;
  }
}

/* 最大宽度媒体查询（移动端优先） */
@media (max-width: 768px) {
  .sidebar {
    display: none;
  }
}

/* 最小宽度媒体查询（桌面端优先） */
@media (min-width: 768px) {
  .nav {
    display: flex;
  }
}

/* 组合媒体查询 */
@media (min-width: 768px) and (max-width: 1024px) {
  .container {
    width: 90%;
  }
}

/* 多设备查询 */
@media screen and (min-width: 768px), print and (min-width: 1024px) {
  /* CSS 规则 */
}

/* 设备像素比 */
@media (-webkit-device-pixel-ratio: 2), (resolution: 192dpi) {
  /* 高清屏幕样式 */
}
```

### 视口设置

```html
<!-- 在 HTML head 中设置 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### 相对单位

```css
.element {
  /* 相对单位 */
  width: 50%; /* 相对于父元素宽度的百分比 */
  font-size: 1rem; /* 相对于根元素的 font-size */
  font-size: 1.5em; /* 相对于父元素的 font-size */
  margin: 2vw; /* 相对于视口宽度的百分比 */
  padding: 2vh; /* 相对于视口高度的百分比 */
  width: 30vmin; /* 相对于视口宽高中较小的那个的百分比 */
  height: 50vmax; /* 相对于视口宽高中较大的那个的百分比 */
  line-height: 1.5ex; /* 相对于当前字体的 x-height */
  letter-spacing: 0.1ch; /* 相对于当前字体的 0 的宽度 */
}
```

## CSS 动画和过渡

### 过渡

```css
.transition-element {
  /* 过渡属性 */
  transition-property: all; /* 要过渡的属性，如 color, background-color, width 等 */
  transition-duration: 0.3s; /* 过渡持续时间 */
  transition-timing-function: ease; /* 过渡时间函数：ease, linear, ease-in, ease-out, ease-in-out, cubic-bezier() */
  transition-delay: 0s; /* 过渡延迟时间 */
  
  /* 简写 */
  transition: all 0.3s ease 0s;
  transition: background-color 0.3s ease, color 0.2s linear;
}

.transition-element:hover {
  background-color: #333;
  color: #fff;
}
```

### 动画

```css
/* 定义关键帧 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

/* 使用动画 */
.animation-element {
  animation-name: fadeIn; /* 关键帧名称 */
  animation-duration: 1s; /* 动画持续时间 */
  animation-timing-function: ease; /* 时间函数 */
  animation-delay: 0.5s; /* 延迟时间 */
  animation-iteration-count: 1; /* 播放次数：number, infinite */
  animation-direction: normal; /* 播放方向：normal, reverse, alternate, alternate-reverse */
  animation-fill-mode: both; /* 填充模式：none, forwards, backwards, both */
  animation-play-state: running; /* 播放状态：running, paused */
  
  /* 简写 */
  animation: fadeIn 1s ease 0.5s 1 normal both running;
  animation: pulse 2s ease infinite;
}
```

### 变换

```css
.transform-element {
  /* 平移 */
  transform: translate(10px, 20px);
  transform: translateX(10px);
  transform: translateY(20px);
  
  /* 缩放 */
  transform: scale(1.1);
  transform: scaleX(1.2);
  transform: scaleY(0.8);
  
  /* 旋转 */
  transform: rotate(45deg);
  
  /* 倾斜 */
  transform: skew(10deg, 5deg);
  transform: skewX(10deg);
  transform: skewY(5deg);
  
  /* 组合变换 */
  transform: translate(10px, 20px) rotate(45deg) scale(1.1);
  
  /* 3D 变换 */
  transform: perspective(1000px) rotateX(45deg);
  transform: rotate3d(1, 1, 1, 45deg);
  
  /* 变换原点 */
  transform-origin: center center; /* 默认值，也可以是百分比、长度值 */
}
```

## CSS 变量（自定义属性）

```css
/* 定义变量 */
:root {
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
  --font-size-base: 16px;
  --spacing-unit: 8px;
}

/* 使用变量 */
.element {
  color: var(--primary-color);
  background-color: var(--secondary-color);
  font-size: var(--font-size-base);
  padding: calc(var(--spacing-unit) * 2);
}

/* 变量覆盖 */
.special-element {
  --primary-color: #e74c3c;
  color: var(--primary-color); /* 这里会使用覆盖后的值 */
}

/* 变量默认值 */
.another-element {
  color: var(--non-existent-color, #95a5a6); /* 如果变量不存在，使用默认值 */
}
```

## 高级特性

### 函数

```css
/* 颜色函数 */
element {
  color: rgb(255, 0, 0);
  color: rgba(255, 0, 0, 0.5);
  color: hsl(0, 100%, 50%);
  color: hsla(0, 100%, 50%, 0.5);
  color: rgb(255 0 0 / 50%); /* 新语法，无需逗号 */
  color: hsl(0 100% 50% / 50%);
  
  /* 颜色调整函数 */
  color: color-mix(in srgb, blue 20%, red 80%);
  color: color-adjust(red, hue 90deg);
  color: opacity(red, 0.5);
}

/* 数学函数 */
element {
  width: calc(100% - 20px);
  height: calc(100vh - 50px);
  padding: calc(var(--spacing-unit) * 1.5);
  
  width: min(500px, 100%);
  height: max(200px, 50vh);
  
  font-size: clamp(16px, 3vw, 24px); /* 最小值，首选值，最大值 */
}

/* 图像函数 */
element {
  background-image: url('image.jpg');
  background-image: linear-gradient(to right, red, blue);
  background-image: radial-gradient(circle, red, blue);
  background-image: repeating-linear-gradient(45deg, red, red 10px, blue 10px, blue 20px);
}
```

### 选择器优先级

CSS 选择器优先级从高到低：

1. **内联样式** (`style="..."`) - 1000
2. **ID 选择器** (`#id`) - 100
3. **类选择器** (`.class`)、**属性选择器** (`[attr]`)、**伪类选择器** (`:hover`) - 10
4. **元素选择器** (`element`)、**伪元素选择器** (`::before`) - 1

优先级计算示例：
- `h1` - 1
- `.class` - 10
- `#id` - 100
- `div.class` - 1 + 10 = 11
- `.class1.class2` - 10 + 10 = 20
- `#id .class` - 100 + 10 = 110
- `style=""` - 1000

## 性能优化

1. **减少选择器复杂度**：使用更简单、更具体的选择器
2. **避免使用通用选择器**：`*` 性能较差
3. **避免使用昂贵的属性**：如 `box-shadow`、`transform`、`opacity` 等可能触发重绘或重排
4. **使用 CSS 动画代替 JavaScript 动画**：浏览器可以优化 CSS 动画
5. **使用适当的缓存策略**：为 CSS 文件设置合适的缓存头
6. **压缩 CSS**：减少文件大小
7. **使用关键 CSS**：将首屏关键 CSS 内联到 HTML 中
8. **延迟加载非关键 CSS**：使用 `media="print"` 和 JavaScript 切换

## CSS 方法论

### BEM (Block, Element, Modifier)

```css
/* Block */
.button {}

/* Element (Block__Element) */
.button__icon {}
.button__text {}

/* Modifier (Block--Modifier) */
.button--primary {}
.button--large {}

/* Element with Modifier (Block__Element--Modifier) */
.button__text--bold {}
```

### OOCSS (Object-Oriented CSS)

```css
/* 结构与样式分离 */
.media { display: flex; align-items: flex-start; }
.media__img { margin-right: 10px; }
.media__body { flex: 1; }

/* 可重用修饰符 */
.p-10 { padding: 10px; }
.m-20 { margin: 20px; }
.text-center { text-align: center; }
```

### SMACSS (Scalable and Modular Architecture for CSS)

```css
/* 基础样式 */
body { font-family: Arial, sans-serif; }
a { color: blue; }

/* 布局样式 */
.l-header { position: fixed; top: 0; }
.l-sidebar { float: left; width: 250px; }
.l-main { margin-left: 250px; }

/* 模块样式 */
.btn { padding: 10px 20px; }
.card { border: 1px solid #ccc; }

/* 状态样式 */
.is-active { color: red; }
.is-hidden { display: none; }

/* 主题样式 */
.t-dark { background-color: #333; color: #fff; }
```

## CSS 预处理

### 常见预处理语言

- **Sass/SCSS**: 最流行的 CSS 预处理语言
- **Less**: 语法接近原生 CSS
- **Stylus**: 更灵活，允许省略括号和分号

### SCSS 示例

```scss
/* 变量 */
$primary-color: #3498db;
$font-size-base: 16px;

/* 嵌套 */
.nav {
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    
    li {
      display: inline-block;
      
      a {
        color: $primary-color;
        text-decoration: none;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}

/* 混合 */
@mixin border-radius($radius: 5px) {
  -webkit-border-radius: $radius;
  -moz-border-radius: $radius;
  border-radius: $radius;
}

.button {
  @include border-radius(10px);
}

/* 继承 */
.message {
  padding: 10px;
  border: 1px solid #ccc;
}

.success {
  @extend .message;
  border-color: green;
  color: green;
}

/* 函数 */
@function px-to-rem($px) {
  @return $px / $font-size-base * 1rem;
}

.text {
  font-size: px-to-rem(18);
}
```

## 常见 CSS 问题及解决方案

### 清除浮动

```css
/* 方法1: 伪元素清除法 */
.clearfix::after {
  content: "";
  display: table;
  clear: both;
}

/* 方法2: overflow 清除法 */
.parent {
  overflow: auto; /* 或 hidden */
}
```

### 垂直居中

```css
/* Flexbox 方法 */
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Grid 方法 */
.parent {
  display: grid;
  place-items: center;
}

/* 绝对定位 + transform 方法 */
.parent {
  position: relative;
}

.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

### 防止文本溢出

```css
/* 单行文本截断 */
.single-line {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 多行文本截断 */
.multi-line {
  display: -webkit-box;
  -webkit-line-clamp: 3; /* 显示 3 行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

### 响应式图片

```css
/* 基础响应式图片 */
img {
  max-width: 100%;
  height: auto;
}

/* 使用 srcset 和 sizes 属性 */
/* HTML 中使用 */
/* <img srcset="small.jpg 400w, medium.jpg 800w, large.jpg 1200w" sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px" src="fallback.jpg" alt="响应式图片"> */
```

## 工具和资源

### 开发工具
- **Chrome DevTools**: 浏览器内置的开发者工具
- **Firefox Developer Tools**: Firefox 浏览器的开发者工具
- **VS Code**: 配合 CSS 插件使用
- **Sass/Less/Stylus 编译器**: 实时编译预处理器代码

### 学习资源
- **MDN Web Docs**: https://developer.mozilla.org/zh-CN/docs/Web/CSS
- **CSS-Tricks**: https://css-tricks.com/
- **W3Schools**: https://www.w3schools.com/css/

### 参考工具
- **Can I Use**: https://caniuse.com/ - 浏览器兼容性查询
- **CSS Reference**: https://cssreference.io/ - CSS 属性参考
- **CSS Grid Generator**: https://cssgrid-generator.netlify.app/ - 网格布局生成器
- **Flexbox Froggy**: https://flexboxfroggy.com/ - Flexbox 学习游戏
- **CSS Grid Garden**: https://cssgridgarden.com/ - Grid 学习游戏

---

以上是 CSS 基础知识的概览。CSS 是现代 Web 开发的重要组成部分，与 HTML 和 JavaScript 一起构成了前端开发的三大核心技术。随着 Web 标准的不断发展，CSS 也在持续更新和完善，建议定期关注最新的 CSS 特性和最佳实践。