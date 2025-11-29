# HTML/CSS 面试题

## HTML 基础

### 1. 什么是语义化HTML？为什么它很重要？

**答案：**
语义化HTML是指使用恰当的HTML标签来描述内容的含义，而不仅仅是为了样式。

**重要性：**
- **SEO友好**：搜索引擎可以更好地理解页面内容，提高排名
- **可访问性**：屏幕阅读器可以正确解析内容结构
- **代码可读性**：开发人员更容易理解和维护
- **设备兼容性**：不同设备可以更好地渲染内容

**示例：**
```html
<!-- 语义化结构 -->
<header>
  <nav>导航内容</nav>
</header>
<main>
  <article>
    <h1>文章标题</h1>
    <p>文章内容</p>
  </article>
</main>
<footer>页脚内容</footer>
```

### 2. HTML5新增了哪些语义化标签？

**答案：**
- `<header>`: 页面或区域的头部
- `<nav>`: 导航链接区域
- `<main>`: 页面主要内容
- `<article>`: 独立的内容单元
- `<section>`: 内容区块
- `<aside>`: 侧边栏或相关内容
- `<footer>`: 页面或区域的底部
- `<figure>`: 图片或图表
- `<figcaption>`: 图片说明
- `<time>`: 日期或时间
- `<mark>`: 高亮文本

### 3. DOCTYPE的作用是什么？HTML5的DOCTYPE有什么特点？

**答案：**
DOCTYPE(Document Type Declaration)用于声明文档类型和DTD规范，告诉浏览器使用哪种HTML版本渲染页面。

**HTML5 DOCTYPE特点：**
- 简化的语法：`<!DOCTYPE html>`
- 不区分大小写
- 不需要引用DTD文件
- 适用于所有现代浏览器

### 4. 请解释HTML中的meta标签及其常见用法

**答案：**
meta标签用于提供关于HTML文档的元数据，不会显示在页面上，但对搜索引擎和浏览器很重要。

**常见用法：**
```html
<!-- 设置文档字符编码 -->
<meta charset="UTF-8">

<!-- 设置视口，用于响应式设计 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- 页面描述，用于SEO -->
<meta name="description" content="页面描述">

<!-- 关键词，用于SEO -->
<meta name="keywords" content="关键词1,关键词2">

<!-- 作者信息 -->
<meta name="author" content="作者名称">

<!-- 禁止缓存 -->
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">

<!-- 自动刷新 -->
<meta http-equiv="refresh" content="30;url=https://example.com">
```

## CSS 基础

### 5. 请解释CSS的盒模型

**答案：**
CSS盒模型是CSS布局的基础，描述了元素如何显示及其尺寸计算方式。

**组成部分：**
- **内容(content)**：元素实际内容的区域
- **内边距(padding)**：内容与边框之间的空间
- **边框(border)**：围绕内容和内边距的边界
- **外边距(margin)**：元素与其他元素之间的空间

**标准盒模型与IE盒模型的区别：**
- **标准盒模型**：`width/height` 仅包含内容区域
- **IE盒模型**：`width/height` 包含内容、内边距和边框

**通过box-sizing切换：**
```css
/* 标准盒模型（默认） */
box-sizing: content-box;

/* IE盒模型 */
box-sizing: border-box;
```

### 6. CSS选择器有哪些？优先级如何计算？

**答案：**

**选择器类型：**
1. **基础选择器**
   - 元素选择器：`div`
   - ID选择器：`#id`
   - 类选择器：`.class`
   - 通用选择器：`*`
   - 属性选择器：`[attribute]`

2. **组合选择器**
   - 后代选择器：`div p`
   - 子选择器：`div > p`
   - 相邻兄弟选择器：`div + p`
   - 通用兄弟选择器：`div ~ p`

3. **伪类选择器**
   - `:hover`, `:active`, `:focus`
   - `:first-child`, `:last-child`, `:nth-child()`
   - `:link`, `:visited`

4. **伪元素选择器**
   - `::before`, `::after`
   - `::first-line`, `::first-letter`

**优先级计算规则：**
1. 内联样式（1000）
2. ID选择器（100）
3. 类选择器、属性选择器、伪类（10）
4. 元素选择器、伪元素（1）

**优先级相同时，后面的规则覆盖前面的规则**。

### 7. 请解释CSS中的flex布局

**答案：**
Flex布局（Flexible Box Layout）是一种一维布局模型，用于更高效地分配容器空间。

**容器属性：**
```css
.container {
  /* 启用flex布局 */
  display: flex;
  
  /* 主轴方向 */
  flex-direction: row | row-reverse | column | column-reverse;
  
  /* 换行方式 */
  flex-wrap: nowrap | wrap | wrap-reverse;
  
  /* 主轴对齐方式 */
  justify-content: flex-start | flex-end | center | space-between | space-around | space-evenly;
  
  /* 交叉轴对齐方式 */
  align-items: stretch | flex-start | flex-end | center | baseline;
  
  /* 多行对齐方式 */
  align-content: stretch | flex-start | flex-end | center | space-between | space-around;
}
```

**项目属性：**
```css
.item {
  /* 项目的放大比例 */
  flex-grow: 0; /* 默认值 */
  
  /* 项目的缩小比例 */
  flex-shrink: 1; /* 默认值 */
  
  /* 项目的基准大小 */
  flex-basis: auto; /* 默认值 */
  
  /* 简写：flex-grow flex-shrink flex-basis */
  flex: 0 1 auto;
  
  /* 单个项目的对齐方式 */
  align-self: auto | flex-start | flex-end | center | baseline | stretch;
  
  /* 项目的排列顺序 */
  order: 0; /* 默认值 */
}
```

### 8. 请解释CSS中的grid布局

**答案：**
Grid布局是一种二维布局系统，可以同时处理行和列，更适合复杂的页面布局。

**容器属性：**
```css
.container {
  /* 启用grid布局 */
  display: grid;
  
  /* 定义网格列 */
  grid-template-columns: 100px 1fr 2fr;
  
  /* 定义网格行 */
  grid-template-rows: 50px 100px;
  
  /* 网格间隙 */
  grid-gap: 10px; /* 简写，等同于 grid-row-gap 和 grid-column-gap */
  
  /* 网格区域定义 */
  grid-template-areas: 
    "header header header"
    "sidebar main main"
    "footer footer footer";
  
  /* 网格自动填充 */
  grid-auto-rows: 100px;
  grid-auto-columns: 100px;
}
```

**项目属性：**
```css
.item {
  /* 起始行/结束行 - 起始列/结束列 */
  grid-area: 1 / 1 / 3 / 3;
  
  /* 或者使用命名区域 */
  grid-area: header;
  
  /* 单独设置位置 */
  grid-row-start: 1;
  grid-row-end: 3;
  grid-column-start: 1;
  grid-column-end: 3;
}
```

### 9. 请解释CSS中的BFC（块级格式化上下文）

**答案：**
BFC是一个独立的渲染区域，规定了内部元素如何布局，并且与外部元素互不影响。

**创建BFC的条件：**
- 根元素（`<html>`）
- 浮动元素（float不为none）
- 绝对定位元素（position为absolute或fixed）
- display为inline-block、table-cell、table-caption、flex等
- overflow不为visible

**BFC的特性：**
- 内部的Box会在垂直方向，一个接一个地放置
- Box垂直方向的距离由margin决定，属于同一个BFC的两个相邻Box的margin会发生重叠
- 每个元素的margin box的左边，与包含块border box的左边相接触
- BFC的区域不会与float box重叠
- BFC是一个隔离的独立容器，容器里面的子元素不会影响到外面的元素
- 计算BFC的高度时，浮动元素也参与计算

**应用场景：**
- 清除浮动
- 防止margin重叠
- 阻止元素被浮动元素覆盖
- 多列布局自适应

### 10. 如何实现响应式设计？

**答案：**
响应式设计使网页能够适应不同设备的屏幕尺寸。

**主要方法：**

1. **媒体查询（Media Queries）**
```css
/* 断点设置 */
@media (max-width: 768px) {
  /* 平板样式 */
  .container {
    width: 100%;
  }
}

@media (max-width: 480px) {
  /* 手机样式 */
  .nav {
    flex-direction: column;
  }
}
```

2. **视口设置**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

3. **相对单位**
   - 使用rem、em、%、vw、vh等相对单位
   - 避免使用固定像素值

4. **弹性布局**
   - 使用flex和grid布局
   - 使元素能够自动调整大小

5. **响应式图片**
```html
<picture>
  <source media="(max-width: 768px)" srcset="small.jpg">
  <source media="(min-width: 769px)" srcset="large.jpg">
  <img src="fallback.jpg" alt="描述">
</picture>
```

### 11. CSS预处理器（Sass/Less）的优点有哪些？

**答案：**

**主要优点：**
- **变量支持**：定义和复用颜色、尺寸等
- **嵌套语法**：更清晰的选择器层级关系
- **混合器（Mixins）**：复用样式块
- **继承（Extend）**：样式继承减少重复
- **函数支持**：计算、颜色处理等
- **模块化**：拆分样式文件，易于维护
- **条件语句**：根据条件应用不同样式
- **循环结构**：处理重复样式

**Sass示例：**
```scss
// 变量
$primary-color: #3498db;

// 混合器
@mixin button-styles($bg-color: $primary-color) {
  background-color: $bg-color;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  
  &:hover {
    opacity: 0.9;
  }
}

// 使用
.button {
  @include button-styles;
}

.secondary-button {
  @include button-styles(#2ecc71);
}
```

### 12. 请解释CSS中的动画和过渡

**答案：**

**过渡（Transitions）：**
过渡用于在一定时间内平滑地改变CSS属性的值。

```css
element {
  /* 要过渡的属性 */
  transition-property: width, height, background-color;
  
  /* 过渡持续时间 */
  transition-duration: 0.3s;
  
  /* 过渡时间函数 */
  transition-timing-function: ease-in-out;
  
  /* 过渡延迟 */
  transition-delay: 0.1s;
  
  /* 简写 */
  transition: width 0.3s ease-in-out 0.1s;
}
```

**动画（Animations）：**
动画可以实现更复杂的效果，需要定义关键帧。

```css
/* 定义关键帧 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 或者使用百分比 */
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
}

/* 使用动画 */
element {
  /* 动画名称 */
  animation-name: fadeIn;
  
  /* 动画持续时间 */
  animation-duration: 1s;
  
  /* 动画时间函数 */
  animation-timing-function: ease;
  
  /* 动画延迟 */
  animation-delay: 0s;
  
  /* 动画播放次数 */
  animation-iteration-count: 1;
  
  /* 动画方向 */
  animation-direction: normal;
  
  /* 动画填充模式 */
  animation-fill-mode: forwards;
  
  /* 简写 */
  animation: fadeIn 1s ease 0s 1 normal forwards;
}
```

## 高级CSS

### 13. 请解释CSS中的层叠上下文（Stacking Context）

**答案：**
层叠上下文是HTML元素的三维概念，决定了元素在z轴方向上的显示顺序。

**创建层叠上下文的条件：**
- 根元素（`<html>`）
- position为absolute或relative且z-index不为auto
- position为fixed或sticky
- flex或grid容器的子元素，且z-index不为auto
- opacity小于1的元素
- transform不为none的元素
- mix-blend-mode不为normal的元素
- filter不为none的元素
- perspective不为none的元素
- isolation: isolate的元素

**层叠顺序（从下到上）：**
1. 背景和边框（根元素）
2. 负z-index的层叠上下文
3. 块级盒模型
4. 浮动盒模型
5. 内联盒模型
6. z-index为auto的定位元素
7. z-index为正的层叠上下文

### 14. 如何实现CSS中的三角形和其他形状？

**答案：**

**三角形：**
```css
.triangle {
  width: 0;
  height: 0;
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
  border-bottom: 100px solid #3498db;
}
```

**圆形：**
```css
.circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #3498db;
}
```

**椭圆：**
```css
.ellipse {
  width: 200px;
  height: 100px;
  border-radius: 50%;
  background-color: #3498db;
}
```

**菱形：**
```css
.diamond {
  width: 100px;
  height: 100px;
  transform: rotate(45deg);
  background-color: #3498db;
}
```

**五角星（使用clip-path）：**
```css
.star {
  width: 100px;
  height: 100px;
  background-color: #f1c40f;
  clip-path: polygon(
    50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%
  );
}
```

### 15. 请解释CSS Modules的原理和使用方法

**答案：**
CSS Modules是一种CSS模块化方案，可以避免全局命名冲突。

**原理：**
- 自动为CSS类名生成唯一的哈希值
- 将CSS类名与组件绑定，实现局部作用域
- 支持组合、继承等高级特性

**使用方法（在Vue中）：**
```vue
<template>
  <div :class="styles.container">
    <h1 :class="styles.title">标题</h1>
  </div>
</template>

<script setup>
import styles from './component.module.css'
</script>

<style module>
.container {
  padding: 20px;
  background-color: #f5f5f5;
}

.title {
  color: #3498db;
  font-size: 24px;
}
</style>
```

**编译后：**
```html
<div class="component_container_123abc">
  <h1 class="component_title_456def">标题</h1>
</div>

<style>
.component_container_123abc {
  padding: 20px;
  background-color: #f5f5f5;
}

.component_title_456def {
  color: #3498db;
  font-size: 24px;
}
</style>
```

## 实践应用题

### 16. 如何实现一个水平居中的布局？

**答案：**

**方法1：使用flex布局**
```css
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.child {
  /* 子元素会水平垂直居中 */
}
```

**方法2：使用grid布局**
```css
.parent {
  display: grid;
  place-items: center;
  height: 100vh;
}

.child {
  /* 子元素会水平垂直居中 */
}
```

**方法3：使用定位**
```css
.parent {
  position: relative;
  height: 100vh;
}

.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

**方法4：使用margin**
```css
.child {
  width: 300px;
  margin: 0 auto;
  /* 仅水平居中，需要设置固定宽度 */
}
```

### 17. 如何实现CSS中的多列等高布局？

**答案：**

**方法1：使用flex布局**
```css
.container {
  display: flex;
}

.column {
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;
  margin: 0 10px;
}
```

**方法2：使用grid布局**
```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
}

.column {
  padding: 20px;
  background-color: #f5f5f5;
}
```

**方法3：使用table布局**
```css
.container {
  display: table;
  width: 100%;
  border-collapse: separate;
  border-spacing: 20px;
}

.row {
  display: table-row;
}

.column {
  display: table-cell;
  padding: 20px;
  background-color: #f5f5f5;
}
```

**方法4：使用padding和margin技巧（老方法）**
```css
.container {
  overflow: hidden;
}

.column {
  float: left;
  width: 30%;
  padding-bottom: 9999px;
  margin-bottom: -9999px;
  background-color: #f5f5f5;
  margin: 0 1.66%;
  padding: 20px;
}
```

### 18. 如何实现无限滚动的加载效果？

**答案：**

**CSS部分：**
```css
/* 加载动画 */
.loading {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 内容容器 */
.content {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

/* 加载提示区域 */
.loading-container {
  text-align: center;
  padding: 20px;
}
```

**HTML部分：**
```html
<div class="content" id="content">
  <!-- 内容将通过JavaScript动态加载 -->
</div>
<div class="loading-container" id="loadingContainer">
  <div class="loading"></div>
  <p>加载中...</p>
</div>
```

**JavaScript部分（配合CSS实现）：**
```javascript
const content = document.getElementById('content');
const loadingContainer = document.getElementById('loadingContainer');
let page = 1;
let loading = false;

// 模拟加载数据
function loadMoreData() {
  if (loading) return;
  
  loading = true;
  loadingContainer.style.display = 'block';
  
  // 模拟网络请求
  setTimeout(() => {
    for (let i = 0; i < 10; i++) {
      const item = document.createElement('div');
      item.className = 'item';
      item.textContent = `项目 ${(page - 1) * 10 + i + 1}`;
      item.style.padding = '20px';
      item.style.margin = '10px 0';
      item.style.backgroundColor = '#f9f9f9';
      item.style.borderRadius = '4px';
      content.appendChild(item);
    }
    
    page++;
    loading = false;
    loadingContainer.style.display = 'none';
  }, 1500);
}

// 监听滚动事件
window.addEventListener('scroll', () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
  const clientHeight = document.documentElement.clientHeight || window.innerHeight;
  
  // 当滚动到距离底部100px时加载更多
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    loadMoreData();
  }
});

// 初始加载
loadMoreData();
```
