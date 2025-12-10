# HTML 基础

## 📚 介绍

HTML (HyperText Markup Language) 是构建网页的标准标记语言，它定义了网页的结构和内容。HTML使用标签来标识不同类型的内容元素，是Web开发的基础。

### 核心特点

- **标记语言**：使用标签定义内容结构
- **语义化**：提供有意义的标签描述内容类型
- **可扩展性**：支持自定义属性和元素
- **平台无关**：可在任何设备和浏览器上运行
- **与CSS/JS结合**：与样式和交互逻辑无缝协作

## 📁 目录结构

本HTML基础教程分为以下子目录，每个子目录都包含详细的学习内容和示例代码：

| 子目录 | 主要内容 |
| ------ | ------- |
| [forms](forms/README.md) | 表单基础结构、验证和最佳实践 |
| [accessibility](accessibility/README.md) | HTML可访问性、ARIA属性和键盘导航等内容 |
| [multimedia](multimedia/README.md) | HTML5音频、视频、Canvas和SVG等多媒体内容 |
| [responsive](responsive/README.md) | 响应式HTML设计、媒体查询和弹性布局等内容 |
| [best-practices](best-practices/README.md) | HTML开发最佳实践、代码结构和性能优化等内容 |
| [seo](seo/README.md) | HTML与SEO优化、元标签和语义化HTML等内容 |
| [html5-features](html5-features/README.md) | HTML5新特性和API |
| [tables](tables/README.md) | HTML表格设计和最佳实践 |

## 📊 学习路径

### 基础阶段
1. 理解HTML基本结构和语法
2. 掌握常用标签和属性
3. 学习HTML表格设计 ([tables](tables/README.md))
4. 实践简单网页布局

### 进阶阶段
1. 深入理解语义化HTML
2. 学习表单设计和验证 ([forms](forms/README.md))
3. 掌握HTML5新特性 ([html5-features](html5-features/README.md))
4. 学习无障碍访问标准 ([accessibility](accessibility/README.md))
5. 实践响应式网页结构 ([responsive](responsive/README.md))

### 高级阶段
1. 掌握HTML5 API ([html5-features](html5-features/README.md))
2. 学习多媒体内容开发 ([multimedia](multimedia/README.md))
3. 优化页面性能和SEO ([seo](seo/README.md))
4. 遵循HTML开发最佳实践 ([best-practices](best-practices/README.md))
5. 实践复杂页面结构设计

## HTML 基本结构

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>网页标题</title>
  <!-- CSS 样式引入 -->
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <!-- 页面内容 -->
  <h1>这是页面标题</h1>
  <p>这是一段文本内容。</p>
  
  <!-- JavaScript 脚本引入 -->
  <script src="script.js"></script>
</body>
</html>
```

## 文档类型声明

```html
<!DOCTYPE html> <!-- HTML5 文档类型 -->
```

## HTML 元素与标签

### 标题标签

```html
<h1>一级标题</h1>
<h2>二级标题</h2>
<h3>三级标题</h3>
<h4>四级标题</h4>
<h5>五级标题</h5>
<h6>六级标题</h6>
```

### 文本格式化

```html
<p>这是一个普通段落。</p>

<!-- 文本格式化标签 -->
<strong>加粗文本</strong>
<b>粗体文本</b>
<em>斜体文本</em>
<i>斜体文本</i>
<u>下划线文本</u>
<s>删除线文本</s>
<mark>高亮文本</mark>
<code>代码文本</code>
<pre>预格式化文本，保留空格和换行</pre>

<!-- 引用 -->
<blockquote cite="https://example.com">
  这是一个长引用。
</blockquote>

<q>这是一个短引用。</q>

<!-- 列表 -->
<ul>
  <li>无序列表项 1</li>
  <li>无序列表项 2</li>
  <li>无序列表项 3</li>
</ul>

<ol>
  <li>有序列表项 1</li>
  <li>有序列表项 2</li>
  <li>有序列表项 3</li>
</ol>

<dl>
  <dt>术语</dt>
  <dd>术语解释</dd>
</dl>
```

### 链接

```html
<!-- 基本链接 -->
<a href="https://example.com">访问示例网站</a>

<!-- 在新标签页打开 -->
<a href="https://example.com" target="_blank" rel="noopener noreferrer">新标签页打开</a>

<!-- 内部链接 -->
<a href="about.html">关于我们</a>

<!-- 锚点链接 -->
<a href="#section1">跳转到第一部分</a>

<h2 id="section1">第一部分内容</h2>

<!-- 下载链接 -->
<a href="document.pdf" download="my-document.pdf">下载文档</a>
```

### 图像

```html
<!-- 基本图像 -->
<img src="image.jpg" alt="描述性文本" width="500" height="300">

<!-- 响应式图像 -->
<img src="image.jpg" alt="描述性文本" style="max-width: 100%; height: auto;">

<!-- 图像映射 -->
<img src="map.jpg" usemap="#image-map" alt="地图">

<map name="image-map">
  <area shape="rect" coords="0,0,82,126" href="area1.html" alt="区域1">
  <area shape="circle" coords="90,58,3" href="area2.html" alt="区域2">
</map>

<!-- 图片集 -->
<picture>
  <source media="(max-width: 768px)" srcset="small.jpg">
  <source media="(max-width: 1200px)" srcset="medium.jpg">
  <img src="large.jpg" alt="响应式图片" style="max-width: 100%; height: auto;">
</picture>
```

### 表格

```html
<table border="1" cellpadding="5" cellspacing="0">
  <caption>示例表格</caption>
  <thead>
    <tr>
      <th>表头 1</th>
      <th>表头 2</th>
      <th>表头 3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>单元格 1</td>
      <td>单元格 2</td>
      <td>单元格 3</td>
    </tr>
    <tr>
      <td>单元格 4</td>
      <td>单元格 5</td>
      <td>单元格 6</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td colspan="3">表格底部内容</td>
    </tr>
  </tfoot>
</table>
```

### 表单

```html
<form action="/submit-form" method="post">
  <!-- 文本输入 -->
  <div>
    <label for="name">姓名:</label>
    <input type="text" id="name" name="name" required placeholder="请输入姓名">
  </div>
  
  <!-- 密码输入 -->
  <div>
    <label for="password">密码:</label>
    <input type="password" id="password" name="password" required>
  </div>
  
  <!-- 电子邮件 -->
  <div>
    <label for="email">邮箱:</label>
    <input type="email" id="email" name="email" required>
  </div>
  
  <!-- 数字输入 -->
  <div>
    <label for="age">年龄:</label>
    <input type="number" id="age" name="age" min="18" max="100">
  </div>
  
  <!-- 日期选择 -->
  <div>
    <label for="birthdate">出生日期:</label>
    <input type="date" id="birthdate" name="birthdate">
  </div>
  
  <!-- 单选按钮 -->
  <div>
    <label>性别:</label>
    <input type="radio" id="male" name="gender" value="male">
    <label for="male">男</label>
    <input type="radio" id="female" name="gender" value="female">
    <label for="female">女</label>
  </div>
  
  <!-- 复选框 -->
  <div>
    <label>爱好:</label>
    <input type="checkbox" id="reading" name="hobbies[]" value="reading">
    <label for="reading">阅读</label>
    <input type="checkbox" id="music" name="hobbies[]" value="music">
    <label for="music">音乐</label>
  </div>
  
  <!-- 下拉列表 -->
  <div>
    <label for="country">国家:</label>
    <select id="country" name="country">
      <option value="" disabled selected>请选择</option>
      <option value="cn">中国</option>
      <option value="us">美国</option>
      <option value="jp">日本</option>
    </select>
  </div>
  
  <!-- 文本域 -->
  <div>
    <label for="message">留言:</label>
    <textarea id="message" name="message" rows="4" cols="50" placeholder="请输入留言内容"></textarea>
  </div>
  
  <!-- 滑块 -->
  <div>
    <label for="volume">音量:</label>
    <input type="range" id="volume" name="volume" min="0" max="100" value="50">
  </div>
  
  <!-- 提交和重置按钮 -->
  <button type="submit">提交</button>
  <button type="reset">重置</button>
</form>
```

## 语义化 HTML5 标签

```html
<!-- 页面结构 -->
<header>
  <!-- 页眉 -->
  <nav>
    <!-- 导航 -->
  </nav>
</header>

<main>
  <!-- 主要内容 -->
  <section>
    <!-- 内容区块 -->
    <article>
      <!-- 文章内容 -->
    </article>
  </section>
  
  <aside>
    <!-- 侧边栏 -->
  </aside>
</main>

<footer>
  <!-- 页脚 -->
</footer>

<!-- 其他语义化标签 -->
<figure>
  <img src="image.jpg" alt="描述">
  <figcaption>图片描述</figcaption>
</figure>

<time datetime="2023-10-15">2023年10月15日</time>

<mark>高亮文本</mark>

<progress value="70" max="100"></progress>

<meter value="0.7" min="0" max="1" low="0.3" high="0.8" optimum="0.5"></meter>

<details>
  <summary>点击展开详情</summary>
  <p>这里是详细内容。</p>
</details>

<dialog open>
  <p>这是一个对话框。</p>
  <button>关闭</button>
</dialog>
```

## 多媒体元素

```html
<!-- 音频 -->
<audio controls>
  <source src="audio.mp3" type="audio/mpeg">
  <source src="audio.ogg" type="audio/ogg">
  您的浏览器不支持音频元素。
</audio>
audio.autoplay = false;
audio.loop = false;

<!-- 视频 -->
<video controls width="640" height="360">
  <source src="video.mp4" type="video/mp4">
  <source src="video.webm" type="video/webm">
  您的浏览器不支持视频元素。
</video>

<!-- iframe 嵌入 -->
<iframe src="https://example.com" width="600" height="400" frameborder="0" allowfullscreen></iframe>
```

## 元数据和头部信息

```html
<head>
  <!-- 字符集 -->
  <meta charset="UTF-8">
  
  <!-- 视口设置 (响应式设计) -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- 网页标题 -->
  <title>网页标题</title>
  
  <!-- 描述 -->
  <meta name="description" content="网页描述内容">
  
  <!-- 关键词 -->
  <meta name="keywords" content="关键词1,关键词2,关键词3">
  
  <!-- 作者 -->
  <meta name="author" content="作者名称">
  
  <!-- 刷新 -->
  <meta http-equiv="refresh" content="30"> <!-- 30秒后刷新 -->
  
  <!-- 搜索引擎索引 -->
  <meta name="robots" content="index,follow">
  
  <!-- 社交媒体元数据 (Open Graph) -->
  <meta property="og:title" content="社交媒体标题">
  <meta property="og:description" content="社交媒体描述">
  <meta property="og:image" content="image.jpg">
  <meta property="og:url" content="https://example.com">
  
  <!-- 引入样式 -->
  <link rel="stylesheet" href="styles.css">
  
  <!-- 内联样式 -->
  <style>
    body { font-family: Arial, sans-serif; }
  </style>
  
  <!-- 引入脚本 -->
  <script src="script.js"></script>
  
  <!-- 内联脚本 -->
  <script>
    console.log('Hello World!');
  </script>
</head>
```

## HTML 属性

### 全局属性

```html
<!-- class 和 id -->
<div class="container main-content" id="main">...</div>

<!-- title -->
<div title="提示内容">悬停时显示提示</div>

<!-- style -->
<div style="color: red; font-size: 16px;">内联样式</div>

<!-- lang -->
<div lang="en">English content</div>

<!-- dir -->
<div dir="rtl">从右到左显示</div>

<!-- accesskey -->
<a href="#" accesskey="h">帮助</a> <!-- Alt + H (Windows) 或 Ctrl + Alt + H (Mac) -->

<!-- tabindex -->
<input type="text" tabindex="1">
<button tabindex="2">提交</button>

<!-- hidden -->
<div hidden>隐藏内容</div>

<!-- data-* 自定义属性 -->
<div data-user-id="123" data-status="active">用户信息</div>
```

### 特定元素属性

```html
<!-- 表单元素属性 -->
<input required minlength="3" maxlength="20" pattern="[A-Za-z]+" autocomplete="on">

<!-- 链接属性 -->
<a href="#" rel="nofollow" download="filename">下载</a>

<!-- 图像属性 -->
<img loading="lazy" decoding="async" srcset="small.jpg 400w, medium.jpg 800w, large.jpg 1200w" sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px">
```

## HTML 实体

```html
&lt;     <!-- 小于号 < -->
&gt;     <!-- 大于号 > -->
&amp;    <!-- 和号 & -->
&quot;   <!-- 引号 " -->
&apos;   <!-- 撇号 ' -->
&copy;   <!-- 版权符号 © -->
&reg;    <!-- 注册商标 ® -->
&trade;  <!-- 商标符号 ™ -->
&cent;   <!-- 分 ¢ -->
&euro;   <!-- 欧元 € -->
&pound;  <!-- 英镑 £ -->
&yen;    <!-- 日元 ¥ -->
&micro;  <!-- 微符号 µ -->
&plusmn; <!-- 正负号 ± -->
&times;  <!-- 乘号 × -->
&divide; <!-- 除号 ÷ -->
&nbsp;   <!-- 非断行空格 -->
```

## 可访问性

### ARIA 属性

```html
<!-- ARIA 角色 -->
<div role="navigation">导航菜单</div>
<div role="button" tabindex="0" aria-pressed="false">可点击区域</div>

<!-- ARIA 状态和属性 -->
<div aria-hidden="true">隐藏的辅助内容</div>
<div aria-label="提示信息">带有隐藏标签的元素</div>
<div aria-labelledby="header1">通过 ID 引用的标签</div>
<div aria-describedby="desc1">带有描述的元素</div>

<!-- ARIA 关系 -->
<div role="tablist">
  <button role="tab" aria-selected="true" aria-controls="tabpanel1">标签 1</button>
  <button role="tab" aria-selected="false" aria-controls="tabpanel2">标签 2</button>
</div>
<div id="tabpanel1" role="tabpanel">面板内容 1</div>
<div id="tabpanel2" role="tabpanel" hidden>面板内容 2</div>
```

### 键盘导航

```html
<!-- 确保所有交互元素可通过键盘访问 -->
<button>可点击</button>
<a href="#">可访问链接</a>
<input type="text">

<!-- 自定义控件添加 tabindex -->
<div tabindex="0" role="button" onclick="doSomething()">自定义按钮</div>

<!-- 确保正确的焦点顺序 -->
<form>
  <input type="text" tabindex="1">
  <input type="password" tabindex="2">
  <button type="submit" tabindex="3">提交</button>
</form>
```

## HTML 注释

```html
<!-- 这是一个 HTML 注释 -->
<!-- 
  多行注释
  可以有多行内容
-->
```

## HTML5 新特性

### 语义化标签
- `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`
- `<figure>`, `<figcaption>`, `<time>`, `<mark>`, `<progress>`, `<meter>`
- `<details>`, `<summary>`, `<dialog>`

### 表单增强
- 新的输入类型: `email`, `tel`, `url`, `search`, `number`, `range`, `date`, `time`, `datetime-local`, `month`, `week`, `color`
- 新的属性: `required`, `placeholder`, `pattern`, `min`, `max`, `step`, `autofocus`, `multiple`, `form`

### 多媒体支持
- `<audio>`, `<video>`, `<source>`, `<track>`

### 拖放 API
```html
<div draggable="true" ondragstart="drag(event)">可拖动元素</div>
<div ondragover="allowDrop(event)" ondrop="drop(event)">放置目标</div>
```

### Canvas 和 SVG
```html
<!-- Canvas -->
<canvas id="myCanvas" width="200" height="100"></canvas>

<script>
  const canvas = document.getElementById('myCanvas');
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#FF0000';
  ctx.fillRect(0, 0, 150, 75);
</script>

<!-- SVG -->
<svg width="100" height="100">
  <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
</svg>
```

### Web 存储
- localStorage: 持久存储
- sessionStorage: 会话存储

### Web Workers
- 在后台线程中运行 JavaScript

### 地理位置
```html
<button onclick="getLocation()">获取位置</button>
<p id="demo"></p>

<script>
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    document.getElementById("demo").innerHTML = "浏览器不支持地理位置。";
  }
}

function showPosition(position) {
  document.getElementById("demo").innerHTML = "纬度: " + position.coords.latitude + 
  "<br>经度: " + position.coords.longitude;
}
</script>
```

## 最佳实践

### 结构与语义
1. **使用语义化标签**: 提高可访问性和 SEO
2. **保持清晰的层次结构**: 合理使用标题层级
3. **避免过度使用 div**: 使用适当的语义化标签

### 性能优化
1. **减少 HTTP 请求**: 合并 CSS 和 JavaScript 文件
2. **使用 CDN**: 加载公共库
3. **延迟加载图像**: 使用 `loading="lazy"` 属性
4. **压缩 HTML**: 移除多余的空格和注释

### SEO 优化
1. **使用有意义的标题和描述**: 设置合适的 `<title>` 和 `<meta name="description">`
2. **优化图像**: 添加 `alt` 属性
3. **使用结构化数据**: 添加 JSON-LD 或 Microdata

### 可访问性
1. **为所有图像添加 alt 属性**: 帮助屏幕阅读器用户
2. **确保表单元素有标签**: 使用 `<label>` 标签
3. **使用适当的颜色对比度**: 确保文本可读性
4. **支持键盘导航**: 确保所有交互元素可通过键盘访问

### 响应式设计
1. **使用 viewport meta 标签**: 确保在移动设备上正确显示
2. **使用媒体查询**: 适应不同屏幕尺寸
3. **使用相对单位**: 如 `rem`, `em`, `%` 等

## HTML 验证

始终验证您的 HTML 代码以确保其符合标准。您可以使用以下工具进行验证：

- [W3C HTML 验证器](https://validator.w3.org/)
- 浏览器开发工具中的 HTML 检查器

## 浏览器兼容性

在开发过程中，始终考虑主要浏览器的兼容性。可以使用以下资源了解各浏览器对特定功能的支持情况：

- [Can I Use](https://caniuse.com/)
- [MDN Web Docs](https://developer.mozilla.org/)

---

以上是 HTML 基础知识的概览。HTML 是 Web 开发的基础，与 CSS 和 JavaScript 一起构成了现代 Web 开发的三大核心技术。随着 Web 技术的不断发展，HTML 标准也在持续更新，建议定期关注最新的 HTML 规范。