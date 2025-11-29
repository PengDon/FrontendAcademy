# HTML 标签

## 介绍

HTML标签是构建网页的基本单位，它们定义了网页的结构和内容。HTML5引入了许多新的语义化标签，使得网页结构更加清晰和有意义。本章节将介绍常用的HTML标签及其用法。

## 基础标签

### 文档结构标签

#### `<DOCTYPE html>`

声明文档类型，确保浏览器以标准模式渲染页面。

```html
<!DOCTYPE html>
```

#### `<html>`

HTML文档的根元素。

```html
<html lang="zh-CN">
  <!-- 文档内容 -->
</html>
```

#### `<head>`

包含文档的元数据，如标题、样式、脚本链接等。

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>页面标题</title>
  <link rel="stylesheet" href="styles.css">
</head>
```

#### `<body>`

包含文档的可见内容。

```html
<body>
  <!-- 页面内容 -->
</body>
```

### 文本内容标签

#### `<h1>` 至 `<h6>`

标题标签，级别从1到6，`<h1>`是最高级别。

```html
<h1>主标题</h1>
<h2>二级标题</h2>
<h3>三级标题</h3>
<!-- 依此类推 -->
```

#### `<p>`

段落标签。

```html
<p>这是一个段落文本。</p>
```

#### `<br>`

换行标签。

```html
<p>这是第一行<br>这是第二行</p>
```

#### `<hr>`

水平分割线。

```html
<p>上面的内容</p>
<hr>
<p>下面的内容</p>
```

#### `<strong>` 和 `<b>`

`<strong>`表示重要文本（语义化），`<b>`表示粗体文本（样式化）。

```html
<p>这是<strong>重要的</strong>内容。</p>
<p>这是<b>粗体</b>文本。</p>
```

#### `<em>` 和 `<i>`

`<em>`表示强调文本（语义化），`<i>`表示斜体文本（样式化）。

```html
<p>这是<em>强调</em>的内容。</p>
<p>这是<i>斜体</i>文本。</p>
```

#### `<small>`

表示小号文本。

```html
<p>主内容<small>补充说明</small></p>
```

#### `<mark>`

标记文本。

```html
<p>这是<mark>需要标记</mark>的文本。</p>
```

#### `<del>` 和 `<ins>`

`<del>`表示删除的文本，`<ins>`表示插入的文本。

```html
<p>原内容是<del>旧文本</del><ins>新文本</ins></p>
```

#### `<sup>` 和 `<sub>`

上标和下标。

```html
<p>H<sub>2</sub>O 是水的化学式</p>
<p>X<sup>2</sup> 表示X的平方</p>
```

### 列表标签

#### `<ul>` 和 `<li>`

无序列表。

```html
<ul>
  <li>项目1</li>
  <li>项目2</li>
  <li>项目3</li>
</ul>
```

#### `<ol>` 和 `<li>`

有序列表。

```html
<ol>
  <li>第一步</li>
  <li>第二步</li>
  <li>第三步</li>
</ol>

<!-- 使用type属性指定编号类型 -->
<ol type="A">
  <li>选项A</li>
  <li>选项B</li>
</ol>
```

#### `<dl>`, `<dt>`, `<dd>`

描述列表。

```html
<dl>
  <dt>HTML</dt>
  <dd>超文本标记语言</dd>
  <dt>CSS</dt>
  <dd>层叠样式表</dd>
</dl>
```

### 链接标签

#### `<a>`

锚点链接。

```html
<!-- 外部链接 -->
<a href="https://www.example.com" target="_blank" rel="noopener">外部网站</a>

<!-- 内部链接 -->
<a href="about.html">关于我们</a>

<!-- 锚点链接 -->
<a href="#section1">跳转到章节1</a>
...
<section id="section1">章节1内容</section>

<!-- 邮件链接 -->
<a href="mailto:contact@example.com">联系我们</a>

<!-- 电话链接 -->
<a href="tel:+861234567890">拨打电话</a>
```

### 图像标签

#### `<img>`

插入图像。

```html
<img src="image.jpg" alt="描述文本" width="300" height="200">
```

#### `<figure>` 和 `<figcaption>`

图像及说明。

```html
<figure>
  <img src="cat.jpg" alt="一只猫">
  <figcaption>图1：一只可爱的猫</figcaption>
</figure>
```

### 多媒体标签

#### `<audio>`

音频播放器。

```html
<audio controls>
  <source src="music.mp3" type="audio/mpeg">
  您的浏览器不支持音频元素。
</audio>
```

#### `<video>`

视频播放器。

```html
<video controls width="400" height="300">
  <source src="movie.mp4" type="video/mp4">
  您的浏览器不支持视频元素。
</video>
```

#### `<iframe>`

内嵌框架。

```html
<iframe src="https://www.example.com" width="500" height="300" title="示例页面"></iframe>
```

## 表单标签

### 基础表单

#### `<form>`

表单容器。

```html
<form action="/submit" method="post">
  <!-- 表单控件 -->
</form>
```

#### `<label>`

表单标签。

```html
<label for="username">用户名：</label>
<input type="text" id="username" name="username">
```

#### `<input>`

输入字段，根据type属性有多种类型。

```html
<!-- 文本输入 -->
<input type="text" name="name" placeholder="请输入姓名">

<!-- 密码输入 -->
<input type="password" name="password">

<!-- 邮箱输入 -->
<input type="email" name="email" required>

<!-- 数字输入 -->
<input type="number" name="age" min="18" max="120">

<!-- 日期输入 -->
<input type="date" name="birthdate">

<!-- 复选框 -->
<input type="checkbox" id="agree" name="agree" checked>
<label for="agree">同意条款</label>

<!-- 单选按钮 -->
<input type="radio" id="male" name="gender" value="male">
<label for="male">男</label>
<input type="radio" id="female" name="gender" value="female">
<label for="female">女</label>

<!-- 文件上传 -->
<input type="file" name="avatar" accept="image/*">

<!-- 隐藏字段 -->
<input type="hidden" name="token" value="abc123">

<!-- 提交按钮 -->
<input type="submit" value="提交">

<!-- 重置按钮 -->
<input type="reset" value="重置">
```

#### `<textarea>`

多行文本输入。

```html
<textarea name="message" rows="4" cols="50" placeholder="请输入留言..."></textarea>
```

#### `<select>` 和 `<option>`

下拉选择框。

```html
<select name="country">
  <option value="cn">中国</option>
  <option value="us">美国</option>
  <option value="jp">日本</option>
</select>

<!-- 多选下拉框 -->
<select name="hobbies[]" multiple>
  <option value="reading">阅读</option>
  <option value="sports">运动</option>
  <option value="music">音乐</option>
</select>

<!-- 分组选项 -->
<select name="fruit">
  <optgroup label="温带水果">
    <option value="apple">苹果</option>
    <option value="pear">梨</option>
  </optgroup>
  <optgroup label="热带水果">
    <option value="banana">香蕉</option>
    <option value="pineapple">菠萝</option>
  </optgroup>
</select>
```

#### `<button>`

按钮元素。

```html
<!-- 提交按钮 -->
<button type="submit">提交</button>

<!-- 重置按钮 -->
<button type="reset">重置</button>

<!-- 普通按钮 -->
<button type="button">点击我</button>
```

## HTML5 语义化标签

### 文档结构标签

#### `<header>`

页面或区域头部。

```html
<header>
  <h1>网站标题</h1>
  <nav>
    <!-- 导航链接 -->
  </nav>
</header>
```

#### `<nav>`

导航链接区域。

```html
<nav>
  <ul>
    <li><a href="#">首页</a></li>
    <li><a href="#">产品</a></li>
    <li><a href="#">服务</a></li>
  </ul>
</nav>
```

#### `<main>`

主要内容区域。

```html
<main>
  <article>
    <!-- 文章内容 -->
  </article>
</main>
```

#### `<article>`

独立内容块。

```html
<article>
  <h2>文章标题</h2>
  <p>文章内容...</p>
</article>
```

#### `<section>`

文档中的一个部分。

```html
<section>
  <h2>章节标题</h2>
  <p>章节内容...</p>
</section>
```

#### `<aside>`

侧边栏内容。

```html
<aside>
  <h3>相关链接</h3>
  <ul>
    <li><a href="#">相关文章1</a></li>
    <li><a href="#">相关文章2</a></li>
  </ul>
</aside>
```

#### `<footer>`

页面或区域底部。

```html
<footer>
  <p>&copy; 2023 网站名称. 保留所有权利.</p>
</footer>
```

### 文本语义标签

#### `<time>`

表示日期或时间。

```html
<time datetime="2023-10-01">2023年10月1日</time>
```

#### `<mark>`

标记文本。

```html
<p>需要<mark>重点关注</mark>的部分。</p>
```

#### `<details>` 和 `<summary>`

可折叠的详情部分。

```html
<details>
  <summary>点击查看详情</summary>
  <p>这里是详细信息。</p>
</details>
```

#### `<progress>`

进度条。

```html
<progress value="70" max="100"></progress>
```

#### `<meter>`

度量条（用于已知范围的标量测量）。

```html
<meter value="70" min="0" max="100" low="30" high="80" optimum="100"></meter>
```

## 最佳实践

### 1. 始终使用语义化标签

选择最适合内容的标签，而不是仅基于视觉样式。

### 2. 使用正确的嵌套结构

确保标签按照正确的层次结构嵌套。

### 3. 提供适当的替代文本

为图像和其他媒体元素提供描述性的替代文本。

### 4. 使用合适的表单控件

为不同类型的数据选择合适的输入控件。

### 5. 添加必要的属性

使用HTML5的属性增强元素的功能和可访问性。

## 常见问题

### 1. 如何选择正确的HTML标签？

- 考虑内容的含义和用途
- 参考HTML规范了解标签的语义
- 优先使用语义化标签
- 考虑可访问性要求

### 2. 如何处理HTML标签的浏览器兼容性问题？

- 使用HTML5 Shiv/Shim为旧浏览器提供HTML5标签支持
- 为关键功能提供降级方案
- 使用特征检测而非浏览器检测
- 考虑使用现代浏览器的polyfill

### 3. HTML标签的自闭合和非自闭合有什么区别？

- 自闭合标签（如`<img>`, `<br>`, `<input>`）不需要结束标签
- 非自闭合标签（如`<div>`, `<p>`, `<span>`）需要开始和结束标签
- 在XHTML中，所有元素都需要关闭，自闭合标签使用`<tag />`语法
- 在HTML5中，自闭合标签可以省略斜杠

### 4. 如何优化HTML标签的SEO？

- 使用正确的标题层次结构
- 为图像添加描述性的alt属性
- 使用语义化标签
- 确保标签结构清晰、层次分明
- 优化页面加载速度，减少不必要的标签