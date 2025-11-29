# HTML 基础知识点

## 核心概念

### 文档结构
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>页面标题</title>
</head>
<body>
    <!-- 页面内容 -->
</body>
</html>
```

### 常见标签分类

**文档结构标签：**
- `<!DOCTYPE html>`: 声明文档类型
- `<html>`: 根元素
- `<head>`: 页面元数据
- `<body>`: 页面内容

**文本标签：**
- `<h1>-<h6>`: 标题标签
- `<p>`: 段落
- `<span>`: 行内文本
- `<strong>`: 强调（粗体）
- `<em>`: 强调（斜体）
- `<br>`: 换行
- `<hr>`: 水平线

**链接和列表：**
- `<a>`: 超链接
- `<ul>`: 无序列表
- `<ol>`: 有序列表
- `<li>`: 列表项

## 常见问题与答案

### 1. 什么是语义化HTML？
**答案：** 语义化HTML是使用恰当的HTML标签来描述内容的结构和含义，而不仅仅是为了样式。这样做有利于搜索引擎优化、无障碍访问和代码维护。例如，使用`<header>`、`<nav>`、`<main>`、`<footer>`等标签而不是大量的`<div>`。

### 2. DOCTYPE有什么作用？
**答案：** DOCTYPE声明告诉浏览器使用哪种HTML版本的规范来解析页面。如果省略，浏览器可能会进入怪异模式（quirks mode），导致页面渲染不一致。

### 3. meta标签viewport有什么作用？
**答案：** `viewport`元标签用于控制移动设备上的页面显示。`width=device-width`设置页面宽度为设备宽度，`initial-scale=1.0`设置初始缩放比例为1，这对于响应式设计至关重要。

### 4. 什么是HTML5的新特性？
**答案：** HTML5引入了许多新特性，包括：
- 语义化标签：`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`等
- 表单增强：新的输入类型（email, tel, date等）和属性
- Canvas绘图
- 本地存储（localStorage, sessionStorage）
- Web API：地理位置、拖放、媒体播放等

### 5. 如何处理HTML中的特殊字符？
**答案：** 使用HTML实体来表示特殊字符。例如：
- `&lt;`: <
- `&gt;`: >
- `&amp;`: &
- `&quot;`: "
- `&copy;`: ©

## 最佳实践

1. **始终使用语义化标签**：选择最能描述内容含义的标签
2. **正确嵌套元素**：确保标签正确嵌套，不交叉
3. **使用合适的标题层级**：从`<h1>`到`<h6>`依次使用，不跳跃层级
4. **添加alt属性到图片**：提高可访问性和SEO
5. **使用相对路径**：对于站内资源，优先使用相对路径
6. **为表单元素添加label**：提高可访问性和用户体验
7. **保持代码整洁**：使用一致的缩进和注释