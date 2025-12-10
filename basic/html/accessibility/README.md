# HTML 可访问性

## 介绍

Web可访问性（也称为a11y）是指确保网站和应用程序对所有用户都可用，包括残障人士。HTML作为Web的基础，在实现可访问性方面扮演着至关重要的角色。一个可访问的网站不仅符合法律要求，还能扩大受众范围，提高整体用户体验。

## 可访问性的重要性

- **法律合规**：许多国家和地区都有Web可访问性的法律要求（如美国的ADA、欧盟的EN 301 549等）
- **扩大受众**：全球约有15%的人口患有某种形式的残疾，可访问性可以让这部分用户也能使用你的网站
- **更好的SEO**：搜索引擎更容易理解语义化的HTML结构
- **提升用户体验**：许多可访问性功能对所有用户都有益（如键盘导航、清晰的视觉层次）
- **未来-proof**：可访问性设计有助于适应不断变化的技术和用户需求

## 语义化HTML

### 使用正确的HTML元素

语义化HTML是可访问性的基础。使用适当的元素可以让辅助技术（如屏幕阅读器）理解页面结构和内容。

```html
<!-- 好的做法：使用语义化标签 -->
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

<main>
  <article>
    <h2>文章标题</h2>
    <p>文章内容...</p>
  </article>
</main>

<footer>
  <p>版权信息...</p>
</footer>

<!-- 不好的做法：过度使用div -->
<div class="header">
  <div class="title">网站标题</div>
  <div class="nav">
    <div class="nav-item"><a href="#">首页</a></div>
    <div class="nav-item"><a href="#">关于我们</a></div>
    <div class="nav-item"><a href="#">联系我们</a></div>
  </div>
</div>
```

### 标题层次结构

使用适当的标题层次结构（h1-h6）可以帮助用户理解页面的组织结构。

```html
<!-- 好的做法：正确的标题层次 -->
<h1>网站标题</h1>
<h2>主要章节</h2>
<h3>子章节</h3>
<h4>小节</h4>

<!-- 不好的做法：跳过标题级别 -->
<h1>网站标题</h1>
<h3>主要章节（跳过了h2）</h3>
<h5>子章节（跳过了h4）</h5>
```

## ARIA 属性

ARIA（Accessible Rich Internet Applications）是一组属性，可以用来增强HTML元素的可访问性。

### 基本ARIA属性

```html
<!-- ARIA角色 -->
<div role="banner">网站标题</div>
<div role="navigation">导航菜单</div>
<div role="main">主要内容</div>

<!-- ARIA状态和属性 -->
<button aria-pressed="false">切换</button>
<div aria-hidden="true">隐藏的内容</div>
<input aria-required="true" placeholder="必填字段">

<!-- ARIA标签和描述 -->
<button aria-label="关闭">×</button>
<input aria-describedby="password-hint">
<p id="password-hint">密码长度不能少于8个字符</p>
```

### 常用ARIA角色

| 角色 | 描述 |
|------|------|
| `banner` | 页面头部 |
| `navigation` | 导航菜单 |
| `main` | 主要内容 |
| `article` | 独立内容块 |
| `section` | 内容区域 |
| `aside` | 侧边栏内容 |
| `footer` | 页面底部 |
| `form` | 表单 |
| `search` | 搜索框 |
| `complementary` | 补充内容 |

### 常用ARIA状态和属性

| 状态/属性 | 描述 |
|-----------|------|
| `aria-hidden` | 控制元素是否对辅助技术可见 |
| `aria-visible` | 元素的可见性状态 |
| `aria-disabled` | 元素是否禁用 |
| `aria-pressed` | 按钮是否按下 |
| `aria-selected` | 元素是否被选中 |
| `aria-expanded` | 元素是否展开 |
| `aria-required` | 字段是否必填 |
| `aria-invalid` | 字段值是否无效 |
| `aria-label` | 元素的标签文本 |
| `aria-describedby` | 描述元素的ID |
| `aria-labelledby` | 标签元素的ID |

## 键盘导航

### 可聚焦元素

确保所有交互式元素都可以通过键盘访问（使用Tab键）。

```html
<!-- 可聚焦元素 -->
<a href="#">链接</a>
<button>按钮</button>
<input type="text">
<select>
  <option>选项</option>
</select>

<!-- 使用tabindex使不可聚焦元素可聚焦 -->
<div tabindex="0" role="button" onclick="doSomething()">可点击的div</div>

<!-- tabindex的值 -->
<!-- tabindex="0"：按自然顺序聚焦 -->
<!-- tabindex="-1"：不可通过Tab键聚焦，但可以通过JavaScript聚焦 -->
<!-- tabindex="n"：按n的顺序聚焦（不推荐使用） -->
```

### 键盘事件处理

确保所有交互都可以通过键盘完成，不仅仅是鼠标。

```html
<button onclick="toggleMenu()" onkeydown="handleKeydown(event)">菜单</button>

<script>
function handleKeydown(event) {
  // 处理Enter和Space键
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    toggleMenu();
  }
  
  // 处理箭头键
  if (event.key === 'ArrowUp') {
    event.preventDefault();
    // 向上移动
  }
  
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    // 向下移动
  }
}
</script>
```

### 焦点管理

确保焦点在页面上的移动是可预测的，特别是在模态框、对话框等组件中。

```html
<!-- 模态框示例 -->
<div id="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <h2 id="modal-title">模态框标题</h2>
  <p>模态框内容...</p>
  <button id="close-modal">关闭</button>
</div>

<script>
// 打开模态框时，将焦点设置到模态框内的第一个可聚焦元素
function openModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'block';
  modal.querySelector('button, input, textarea, select, [tabindex]:not([tabindex="-1"])').focus();
}

// 关闭模态框时，将焦点返回到打开模态框的按钮
function closeModal() {
  const modal = document.getElementById('modal');
  const openButton = document.getElementById('open-modal');
  modal.style.display = 'none';
  openButton.focus();
}
</script>
```

## 颜色和对比度

### 颜色对比度

确保文本和背景之间有足够的对比度，以便视力受损的用户能够阅读内容。

```css
/* 好的做法：高对比度 */
body {
  background-color: white;
  color: black;
}

/* 好的做法：符合WCAG标准的对比度 */
.button {
  background-color: #0066cc;
  color: white;
}

/* 不好的做法：低对比度 */
body {
  background-color: light gray;
  color: dark gray;
}
```

### 颜色使用指南

- 不要仅依靠颜色来传达信息
- 使用文本标签或符号作为颜色的补充
- 确保链接在不同状态下（默认、悬停、聚焦、访问过）有明显的视觉差异

```html
<!-- 好的做法：使用颜色和符号 -->
<div class="status success">
  <span class="status-icon">✓</span>
  <span class="status-text">成功</span>
</div>

<div class="status error">
  <span class="status-icon">×</span>
  <span class="status-text">错误</span>
</div>

<!-- 不好的做法：仅依靠颜色 -->
<div class="status green">成功</div>
<div class="status red">错误</div>
```

## 表单可访问性

### 标签关联

确保每个表单控件都有一个关联的标签。

```html
<!-- 好的做法：显式关联 -->
<label for="username">用户名：</label>
<input type="text" id="username" name="username">

<!-- 好的做法：隐式关联 -->
<label>
  密码：
  <input type="password" name="password">
</label>

<!-- 不好的做法：没有标签 -->
<input type="email" name="email" placeholder="邮箱">
```

### 表单提示和错误信息

提供清晰的表单提示和错误信息，帮助用户正确填写表单。

```html
<div class="form-group">
  <label for="email">邮箱：</label>
  <input type="email" id="email" name="email" aria-required="true" aria-describedby="email-hint email-error">
  <p id="email-hint" class="hint">请输入您的邮箱地址</p>
  <p id="email-error" class="error" style="display: none;">请输入有效的邮箱地址</p>
</div>
```

### 表单分组

使用`<fieldset>`和`<legend>`将相关的表单控件分组。

```html
<fieldset>
  <legend>性别</legend>
  <div>
    <input type="radio" id="male" name="gender" value="male">
    <label for="male">男</label>
  </div>
  <div>
    <input type="radio" id="female" name="gender" value="female">
    <label for="female">女</label>
  </div>
  <div>
    <input type="radio" id="other" name="gender" value="other">
    <label for="other">其他</label>
  </div>
</fieldset>
```

## 多媒体可访问性

### 图像可访问性

为所有图像提供替代文本（alt属性）。

```html
<!-- 好的做法：有意义的alt文本 -->
<img src="logo.png" alt="公司标志">
<img src="chart.png" alt="2023年销售增长图表">

<!-- 好的做法：装饰性图像使用空alt -->
<img src="decorative.png" alt="">

<!-- 不好的做法：缺少alt属性 -->
<img src="product.jpg">

<!-- 不好的做法：无意义的alt文本 -->
<img src="chart.png" alt="图像">
```

### 音频和视频可访问性

为音频和视频内容提供字幕、转录或音频描述。

```html
<!-- 视频带字幕 -->
<video controls>
  <source src="video.mp4" type="video/mp4">
  <track kind="subtitles" src="subtitles.vtt" srclang="zh" label="中文">
  您的浏览器不支持视频元素。
</video>

<!-- 音频带转录 -->
<audio controls>
  <source src="audio.mp3" type="audio/mpeg">
  您的浏览器不支持音频元素。
</audio>
<p>音频转录：这是一段音频的文字转录内容...</p>
```

### Canvas可访问性

为Canvas元素提供替代内容。

```html
<canvas id="chart" aria-label="销售图表" role="img"></canvas>
<p aria-hidden="true">销售图表显示2023年销售额增长了20%。</p>
```

## 可访问性测试

### 手动测试

- **键盘导航测试**：仅使用键盘浏览网站，确保所有功能都可以访问
- **屏幕阅读器测试**：使用屏幕阅读器（如NVDA、VoiceOver、JAWS）测试网站
- **颜色对比度测试**：检查文本和背景之间的对比度

### 自动化测试工具

- **WAVE**：Web可访问性评估工具（https://wave.webaim.org/）
- **Axe**：可访问性测试工具（https://www.deque.com/axe/）
- **Lighthouse**：Google开发的网页质量评估工具，包含可访问性测试
- **Color Contrast Analyzer**：颜色对比度分析工具（https://webaim.org/resources/contrastchecker/）

### 浏览器开发工具

现代浏览器都提供了可访问性检查工具：

- Chrome DevTools：Elements > Accessibility
- Firefox DevTools：Inspector > Accessibility
- Safari DevTools：Elements > Accessibility

## 常见可访问性问题

### 1. 缺少替代文本

```html
<!-- 问题：缺少alt属性 -->
<img src="logo.png">

<!-- 修复：添加有意义的alt文本 -->
<img src="logo.png" alt="公司标志">
```

### 2. 没有键盘导航支持

```html
<!-- 问题：仅使用鼠标事件 -->
<div onclick="doSomething()">点击我</div>

<!-- 修复：添加键盘支持 -->
<div onclick="doSomething()" onkeydown="handleKeydown(event)" tabindex="0" role="button">点击我</div>
```

### 3. 低对比度

```html
<!-- 问题：低对比度文本 -->
<div style="color: #666; background-color: #999;">难以阅读的文本</div>

<!-- 修复：高对比度文本 -->
<div style="color: #333; background-color: #fff;">易于阅读的文本</div>
```

### 4. 不完整的表单标签

```html
<!-- 问题：没有关联的标签 -->
<input type="text" name="username" placeholder="用户名">

<!-- 修复：添加关联标签 -->
<label for="username">用户名：</label>
<input type="text" id="username" name="username" placeholder="用户名">
```

### 5. 动态内容的可访问性

```html
<!-- 问题：动态内容更新没有通知辅助技术 -->
<div id="notification">新消息</div>

<!-- 修复：使用ARIA live区域 -->
<div id="notification" role="alert" aria-live="assertive">新消息</div>
```

## 可访问性最佳实践

### 1. 从设计阶段开始考虑可访问性

- 在设计阶段就考虑可访问性需求
- 与设计师和开发人员合作，确保可访问性融入整个开发过程
- 为可访问性设定明确的目标和标准

### 2. 使用语义化HTML

- 优先使用HTML5语义化标签
- 避免过度使用div和span
- 保持良好的文档结构

### 3. 确保键盘可访问性

- 所有交互元素都可以通过键盘访问
- 焦点顺序是可预测的
- 提供清晰的焦点指示器

### 4. 提供有意义的反馈

- 使用ARIA live区域通知动态内容更新
- 为表单验证提供清晰的错误信息
- 确保状态变化（如按钮按下、菜单展开）对辅助技术可见

### 5. 测试、测试、再测试

- 结合手动测试和自动化测试
- 使用多种辅助技术进行测试
- 让实际用户参与测试

## 法律和标准

### WCAG标准

WCAG（Web Content Accessibility Guidelines）是Web可访问性的国际标准，由W3C制定。WCAG 2.1包含四个核心原则：

1. **可感知**：信息和用户界面组件必须以用户可以感知的方式呈现
2. **可操作**：用户界面组件和导航必须是可操作的
3. **可理解**：信息和用户界面操作必须是可理解的
4. **健壮**：内容必须足够健壮，能被各种用户代理（包括辅助技术）可靠地解释

WCAG 2.1有三个一致性级别：

- **A**：最低级别，解决最严重的可访问性问题
- **AA**：中等级别，适用于大多数网站
- **AAA**：最高级别，提供最高级别的可访问性

### 相关法律和法规

- **美国**：ADA（Americans with Disabilities Act）
- **欧盟**：EN 301 549
- **中国**：《信息无障碍产品通用技术要求》
- **国际**：联合国《残疾人权利公约》

## 练习

1. 检查一个现有网页的可访问性问题，并提供修复建议
2. 创建一个包含表单的页面，确保它完全符合可访问性标准
3. 实现一个模态框，确保它具有良好的键盘导航和焦点管理
4. 为一个包含图像和视频的页面添加适当的可访问性支持
5. 使用自动化工具测试一个网页的可访问性，并解决发现的问题

## 参考资料

- [W3C Web可访问性倡议](https://www.w3.org/WAI/)
- [WCAG 2.1标准](https://www.w3.org/TR/WCAG21/)
- [MDN Web Docs - Web可访问性](https://developer.mozilla.org/zh-CN/docs/Web/Accessibility)
- [WebAIM - Web可访问性资源](https://webaim.org/)
- [ARIA实践指南](https://www.w3.org/TR/wai-aria-practices/)
- [颜色对比度检查器](https://webaim.org/resources/contrastchecker/)
- [WAVE可访问性评估工具](https://wave.webaim.org/)
