# 语义化 HTML

## 介绍

语义化HTML是指使用正确的HTML元素来表示内容的含义，而不仅仅是为了实现特定的视觉效果。使用语义化HTML可以提高代码的可读性、可访问性和SEO效果，同时也便于屏幕阅读器等辅助技术理解网页内容。

## 为什么要使用语义化HTML？

1. **可访问性**：帮助屏幕阅读器和其他辅助技术正确解析网页内容
2. **SEO优化**：搜索引擎更容易理解网页结构和内容主题
3. **代码可读性**：开发者更容易理解和维护代码
4. **设备兼容性**：在不同设备上都能正确显示内容结构
5. **未来兼容性**：即使CSS失效，内容结构仍然清晰

## 主要语义化元素

### 1. 文档结构元素

#### `<header>`

表示页面或区域的头部，通常包含标题、导航、LOGO等。

```html
<header>
  <h1>网站标题</h1>
  <nav>
    <ul>
      <li><a href="#">首页</a></li>
      <li><a href="#">关于我们</a></li>
      <li><a href="#">联系我们</a></li>
    </ul>
  </nav>
</header>
```

#### `<nav>`

表示导航链接的容器，包含指向其他页面或当前页面不同部分的链接。

```html
<nav aria-label="主导航">
  <ul>
    <li><a href="/">首页</a></li>
    <li><a href="/products">产品</a></li>
    <li><a href="/services">服务</a></li>
    <li><a href="/contact">联系我们</a></li>
  </ul>
</nav>
```

#### `<main>`

表示页面的主要内容区域，一个页面应该只有一个`<main>`元素。

```html
<main>
  <article>
    <h2>主要文章标题</h2>
    <p>文章内容...</p>
  </article>
</main>
```

#### `<article>`

表示可以独立分发或重用的内容块，如博客文章、新闻报道、评论等。

```html
<article>
  <header>
    <h2>文章标题</h2>
    <p>发布日期：2023年10月1日</p>
  </header>
  <p>文章内容...</p>
  <footer>
    <p>作者：张三</p>
  </footer>
</article>
```

#### `<section>`

表示文档中的一个独立部分，通常有自己的标题。

```html
<section>
  <h2>产品特性</h2>
  <ul>
    <li>特性一</li>
    <li>特性二</li>
    <li>特性三</li>
  </ul>
</section>
```

#### `<aside>`

表示与主内容相关但非核心的内容，如侧边栏、引用、广告等。

```html
<aside>
  <h3>相关文章</h3>
  <ul>
    <li><a href="#">相关文章1</a></li>
    <li><a href="#">相关文章2</a></li>
  </ul>
</aside>
```

#### `<footer>`

表示页面或区域的底部，通常包含版权信息、联系方式、链接等。

```html
<footer>
  <p>&copy; 2023 我的网站. 保留所有权利.</p>
  <nav>
    <ul>
      <li><a href="/privacy">隐私政策</a></li>
      <li><a href="/terms">使用条款</a></li>
    </ul>
  </nav>
</footer>
```

### 2. 文本内容元素

#### `<h1>` - `<h6>`

表示标题，`<h1>`级别最高，`<h6>`级别最低，用于创建文档的层次结构。

```html
<h1>网站标题</h1>
<section>
  <h2>主要章节</h2>
  <section>
    <h3>子章节</h3>
    <p>内容...</p>
  </section>
</section>
```

#### `<p>`

表示段落文本。

#### `<blockquote>`

表示长引用，通常会有缩进或其他视觉效果。

```html
<blockquote cite="https://example.com/source">
  <p>这是一段引用的内容，来自某个外部来源。</p>
  <footer>— 引用来源</footer>
</blockquote>
```

#### `<figure>` 和 `<figcaption>`

用于表示独立的内容（如图像、图表、代码块等）及其说明。

```html
<figure>
  <img src="image.jpg" alt="描述性文本">
  <figcaption>图片的说明文字</figcaption>
</figure>
```

#### `<time>`

表示日期和时间，可以使用`datetime`属性提供机器可读的时间。

```html
<time datetime="2023-10-01">2023年10月1日</time>
<time datetime="2023-10-01T14:30">2023年10月1日 14:30</time>
```

### 3. 列表元素

#### `<ul>`, `<ol>`, `<li>`

- `<ul>`: 无序列表，项目前通常有圆点或方块标记
- `<ol>`: 有序列表，项目前有数字或字母标记
- `<li>`: 列表项

```html
<ul>
  <li>无序列表项1</li>
  <li>无序列表项2</li>
</ul>

<ol>
  <li>有序列表项1</li>
  <li>有序列表项2</li>
</ol>
```

#### `<dl>`, `<dt>`, `<dd>`

描述列表，用于键值对的表示。

```html
<dl>
  <dt>HTML</dt>
  <dd>超文本标记语言，用于创建网页结构</dd>
  <dt>CSS</dt>
  <dd>层叠样式表，用于设置网页样式</dd>
</dl>
```

### 4. 表单元素

#### `<form>`

表示用户输入的表单。

```html
<form action="/submit" method="post">
  <!-- 表单控件 -->
</form>
```

#### `<label>`

为表单控件提供标签，提高可访问性。

```html
<!-- 显式关联 -->
<label for="username">用户名：</label>
<input type="text" id="username" name="username">

<!-- 隐式关联 -->
<label>
  密码：
  <input type="password" name="password">
</label>
```

#### `<fieldset>` 和 `<legend>`

`<fieldset>`用于对表单控件进行分组，`<legend>`为分组提供标题。

```html
<fieldset>
  <legend>个人信息</legend>
  <div>
    <label for="name">姓名：</label>
    <input type="text" id="name" name="name">
  </div>
  <div>
    <label for="email">邮箱：</label>
    <input type="email" id="email" name="email">
  </div>
</fieldset>
```

## 语义化HTML最佳实践

### 1. 使用正确的标题层次结构

- 每个页面应该只有一个`<h1>`元素
- 标题应该按顺序使用，不要跳过级别（如从`<h1>`直接到`<h3>`）
- 标题应该准确描述其下方内容

### 2. 使用适当的ARIA属性

虽然语义化HTML已经提供了很多含义，但在复杂交互场景下，可能需要额外的ARIA属性来增强可访问性。

```html
<div role="tablist">
  <button role="tab" aria-selected="true">标签1</button>
  <button role="tab" aria-selected="false">标签2</button>
</div>
```

### 3. 避免过度使用div

不要用`<div>`作为通用容器，应该优先使用有语义的元素。

### 4. 为图像提供替代文本

始终为`<img>`元素添加`alt`属性，提供图像的描述性文本。

```html
<img src="logo.png" alt="公司标志">
```

### 5. 使用正确的表单控件类型

使用适合数据类型的输入控件，如`email`、`tel`、`number`等。

```html
<input type="email" name="email" required>
<input type="tel" name="phone" required>
<input type="number" name="age" min="18" max="120">
```

## 常见问题

### 1. `<section>` 和 `<div>` 的区别是什么？

- `<section>`是语义元素，表示文档中的一个独立部分
- `<div>`是非语义元素，仅用于样式或脚本目的
- 通常，`<section>`应该包含一个标题元素

### 2. `<article>` 和 `<section>` 的区别是什么？

- `<article>`表示可以独立分发或重用的内容
- `<section>`表示文档中的一个通用部分
- 一个`<article>`可以包含多个`<section>`，反之亦然

### 3. 如何测试语义化HTML的可访问性？

- 使用浏览器的开发者工具检查元素结构
- 使用屏幕阅读器（如NVDA、VoiceOver、JAWS）测试页面导航
- 使用自动化工具（如WAVE、Axe）进行可访问性检查
- 手动检查代码，确保使用了适当的语义元素

### 4. 语义化HTML对SEO有什么影响？

- 搜索引擎更容易理解页面的结构和内容主题
- 正确使用标题元素有助于搜索引擎确定页面的层次结构和重点内容
- 语义化HTML可以提高页面在相关搜索结果中的排名
- 适合移动设备的语义化结构有利于移动搜索优化