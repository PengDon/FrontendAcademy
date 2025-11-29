# CSS 布局

## 介绍

CSS布局是网页设计的基础，它决定了页面中元素的排列方式和空间分配。从早期的表格布局到现在的Flexbox和Grid，CSS布局技术不断发展，提供了更灵活、更强大的布局解决方案。

## 布局模式

### 1. 传统布局技术

#### 流动布局 (Flow Layout)

默认的HTML文档布局，元素按照它们在HTML中出现的顺序自上而下流动。

```css
/* 默认的流动布局 */
div {
  display: block; /* 默认值 */
}

span {
  display: inline; /* 默认值 */
}
```

#### 浮动布局 (Float Layout)

早期用于文字环绕图片，后来被用于创建多列布局。

```css
.left-column {
  float: left;
  width: 30%;
}

.right-column {
  float: right;
  width: 70%;
}

.clearfix::after {
  content: "";
  display: table;
  clear: both;
}
```

#### 定位布局 (Positioned Layout)

通过position属性控制元素的精确位置。

```css
.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}

.absolute-element {
  position: absolute;
  top: 50px;
  right: 20px;
}

.relative-container {
  position: relative;
}

.sticky-element {
  position: sticky;
  top: 20px;
}
```

### 2. 现代布局技术

#### Flexbox (弹性盒布局)

一维布局模型，适合行或列的布局。

```css
.container {
  display: flex;
  /* 主轴方向 */
  flex-direction: row; /* row | row-reverse | column | column-reverse */
  /* 主轴对齐 */
  justify-content: center; /* flex-start | flex-end | center | space-between | space-around | space-evenly */
  /* 交叉轴对齐 */
  align-items: center; /* stretch | flex-start | flex-end | center | baseline */
  /* 多行时的对齐 */
  align-content: center; /* stretch | flex-start | flex-end | center | space-between | space-around */
  /* 是否换行 */
  flex-wrap: wrap; /* nowrap | wrap | wrap-reverse */
}

.item {
  /* 项目的伸缩因子 */
  flex: 1; /* 相当于 flex: 1 1 auto */
  /* 或分别设置 */
  flex-grow: 1; /* 放大比例 */
  flex-shrink: 1; /* 缩小比例 */
  flex-basis: auto; /* 基准大小 */
  /* 单个项目的对齐 */
  align-self: auto; /* auto | stretch | flex-start | flex-end | center | baseline */
}
```

#### Grid (网格布局)

二维布局模型，适合复杂的网格布局。

```css
.container {
  display: grid;
  /* 定义列 */
  grid-template-columns: 1fr 2fr 1fr;
  /* 定义行 */
  grid-template-rows: auto 1fr auto;
  /* 简写 */
  grid-template: auto 1fr auto / 1fr 2fr 1fr;
  /* 定义网格区域 */
  grid-template-areas: 
    "header header header"
    "sidebar main main"
    "footer footer footer";
  /* 网格间距 */
  gap: 20px; /* 同时设置行和列间距 */
  /* 或分别设置 */
  row-gap: 20px;
  column-gap: 10px;
  /* 内容对齐 */
  justify-items: center; /* stretch | start | end | center */
  align-items: center; /* stretch | start | end | center */
  /* 区域对齐 */
  justify-content: center; /* start | end | center | stretch | space-around | space-between | space-evenly */
  align-content: center; /* start | end | center | stretch | space-around | space-between | space-evenly */
}

.header {
  grid-area: header;
}

.sidebar {
  grid-area: sidebar;
}

.main {
  grid-area: main;
  /* 也可以直接指定位置 */
  grid-column: 2 / 4;
  grid-row: 2 / 3;
}

.footer {
  grid-area: footer;
}
```

## 响应式布局

### 媒体查询 (Media Queries)

根据不同屏幕尺寸应用不同的样式。

```css
/* 移动设备优先 */
.container {
  width: 100%;
}

/* 平板设备 */
@media (min-width: 768px) {
  .container {
    width: 750px;
    margin: 0 auto;
  }
}

/* 桌面设备 */
@media (min-width: 992px) {
  .container {
    width: 970px;
  }
}

/* 大屏幕设备 */
@media (min-width: 1200px) {
  .container {
    width: 1170px;
  }
}
```

### 视口单位

使用视口相关单位进行布局。

```css
.element {
  width: 100vw; /* 视口宽度的100% */
  height: 100vh; /* 视口高度的100% */
  padding: 5vmin; /* 视口最小尺寸的5% */
}
```

## 布局最佳实践

### 1. 使用CSS Reset或Normalize.css

减少浏览器默认样式的差异。

### 2. 采用移动优先设计

从移动设备开始，然后逐步增强到更大的屏幕。

### 3. 语义化HTML结构

使用合适的HTML标签构建有意义的文档结构。

### 4. 结合Flexbox和Grid

Flexbox适合一维布局，Grid适合二维布局，两者结合可以创建复杂而灵活的布局。

### 5. 使用CSS变量

使用CSS变量管理布局参数，便于统一修改。

```css
:root {
  --container-width: 1200px;
  --grid-gap: 20px;
  --header-height: 80px;
}

.container {
  max-width: var(--container-width);
  margin: 0 auto;
}
```

## 常见布局模式

### 1. 圣杯布局 (Holy Grail)

```css
body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
  display: flex;
}

header, footer {
  height: 60px;
}

.sidebar {
  flex: 0 0 200px;
}

.content {
  flex: 1;
}
```

### 2. 卡片布局

```css
.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
```

### 3. 居中布局

```css
/* 水平垂直居中 - Flexbox */
.center-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

/* 水平垂直居中 - Grid */
.center-container {
  display: grid;
  place-items: center;
  height: 100vh;
}
```

## 常见问题

### 1. Flexbox和Grid的区别是什么？

- Flexbox是一维布局系统，适合处理行或列的布局
- Grid是二维布局系统，可以同时处理行和列的布局
- Flexbox适合组件级别的布局，Grid适合页面级别的布局

### 2. 如何解决布局中的间距问题？

- 使用CSS的gap属性（对于Flexbox和Grid）
- 利用padding和margin的级联性
- 考虑使用CSS Grid的auto-fit和auto-fill功能

### 3. 如何处理长文本导致的布局破坏？

```css
/* 防止文本溢出 */
.element {
  word-break: break-word;
  overflow-wrap: break-word;
  /* 单行文本截断 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  /* 多行文本截断 */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

### 4. 如何优化布局性能？

- 避免使用表格布局
- 减少重排（Layout Thrashing）
- 使用CSS transforms和opacity进行动画，避免触发布局重新计算
- 考虑使用CSS Containment API限制布局影响范围