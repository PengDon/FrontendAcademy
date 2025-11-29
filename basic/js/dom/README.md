# DOM 操作

## 介绍

DOM（Document Object Model，文档对象模型）是HTML和XML文档的编程接口，它将文档表示为节点树，使JavaScript能够访问和操作网页的结构、样式和内容。DOM操作是前端开发中的核心技能，用于创建交互式网页应用。

## DOM 树结构

DOM将HTML文档表示为一个由节点组成的树形结构：

- **Document节点**：整个文档的根节点
- **Element节点**：HTML元素，如`<div>`, `<p>`, `<span>`等
- **Text节点**：元素中的文本内容
- **Attribute节点**：元素的属性
- **Comment节点**：HTML注释

## 选择元素

### 基础选择器

```javascript
// 通过ID选择元素
const element = document.getElementById('myId');

// 通过类名选择元素（返回NodeList）
const elements = document.getElementsByClassName('myClass');

// 通过标签名选择元素（返回HTMLCollection）
const divs = document.getElementsByTagName('div');

// 通过name属性选择元素（返回NodeList）
const inputs = document.getElementsByName('username');
```

### CSS选择器

```javascript
// 选择第一个匹配的元素
const element = document.querySelector('.myClass');
const firstLi = document.querySelector('ul li:first-child');

// 选择所有匹配的元素（返回NodeList）
const elements = document.querySelectorAll('.myClass');
const allLis = document.querySelectorAll('ul li');

// 选择特定容器内的元素
const navLinks = document.querySelector('nav').querySelectorAll('a');
```

## 修改元素内容

### 文本内容

```javascript
// 获取和设置文本内容
const element = document.getElementById('myElement');
console.log(element.textContent); // 获取文本内容

// 设置文本内容（会转义HTML）
element.textContent = '新的文本内容 <strong>不会被解析为HTML</strong>';

// 获取和设置HTML内容
console.log(element.innerHTML); // 获取HTML内容

// 设置HTML内容（会解析HTML）
element.innerHTML = '新的HTML内容 <strong>会被解析为HTML</strong>';

// 安全地设置HTML（避免XSS攻击）
const safeContent = encodeHTML(userInput);
element.innerHTML = safeContent;
```

## 修改元素属性

```javascript
const image = document.getElementById('myImage');

// 获取属性
const src = image.getAttribute('src');

// 设置属性
image.setAttribute('src', 'new-image.jpg');

// 检查属性是否存在
const hasAlt = image.hasAttribute('alt');

// 删除属性
image.removeAttribute('alt');

// 直接操作属性
image.src = 'new-image.jpg';
image.alt = '新的替代文本';

// 布尔属性
const checkbox = document.getElementById('myCheckbox');
checkbox.checked = true;
checkbox.disabled = false;
```

## 修改元素样式

### 行内样式

```javascript
const element = document.getElementById('myElement');

// 设置单个样式属性
element.style.color = 'red';
element.style.fontSize = '16px';
element.style.backgroundColor = '#f0f0f0';

// 使用CSS属性名（驼峰命名）
element.style.borderRadius = '5px';
element.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';

// 获取计算后的样式
const computedStyle = window.getComputedStyle(element);
const color = computedStyle.color;
const width = computedStyle.width;
```

### CSS类操作

```javascript
const element = document.getElementById('myElement');

// 添加类
element.classList.add('active');
element.classList.add('primary', 'large'); // 添加多个类

// 移除类
element.classList.remove('inactive');
element.classList.remove('secondary', 'small'); // 移除多个类

// 切换类（存在则移除，不存在则添加）
element.classList.toggle('active');

// 检查类是否存在
const isActive = element.classList.contains('active');

// 替换类
element.classList.replace('oldClass', 'newClass');
```

## 创建和删除元素

### 创建元素

```javascript
// 创建新元素
const newDiv = document.createElement('div');
const newParagraph = document.createElement('p');

// 设置元素属性和内容
newParagraph.textContent = '这是一个新段落';
newParagraph.classList.add('highlight');

// 将创建的元素添加到DOM
const container = document.getElementById('container');
container.appendChild(newParagraph);

// 在指定位置插入元素
const referenceElement = document.querySelector('.existing-element');
container.insertBefore(newDiv, referenceElement);

// 使用DocumentFragment（提高性能）
const fragment = document.createDocumentFragment();
for (let i = 0; i < 10; i++) {
  const item = document.createElement('li');
  item.textContent = `项目 ${i + 1}`;
  fragment.appendChild(item);
}
document.querySelector('ul').appendChild(fragment);
```

### 删除元素

```javascript
const element = document.getElementById('elementToRemove');

// 方法1：通过父元素删除
const parent = element.parentNode;
parent.removeChild(element);

// 方法2：直接删除（现代浏览器支持）
element.remove();

// 清空元素内容
element.innerHTML = ''; // 简单但可能有安全问题

// 更安全的方式清空内容
while (element.firstChild) {
  element.removeChild(element.firstChild);
}
```

## 事件处理

### 添加和移除事件监听器

```javascript
const button = document.getElementById('myButton');

// 添加事件监听器
function handleClick() {
  console.log('按钮被点击了！');
}

button.addEventListener('click', handleClick);

// 添加带选项的事件监听器
button.addEventListener('click', handleClick, {
  capture: false,       // 是否在捕获阶段触发
  once: true,           // 是否只触发一次
  passive: false        // 是否不能阻止默认行为
});

// 移除事件监听器
button.removeEventListener('click', handleClick);

// 常见事件类型
const eventTypes = [
  'click', 'dblclick',     // 鼠标点击事件
  'mouseover', 'mouseout', // 鼠标悬停事件
  'mousedown', 'mouseup',  // 鼠标按下/释放事件
  'keydown', 'keyup', 'keypress', // 键盘事件
  'submit', 'change', 'input',    // 表单事件
  'load', 'resize', 'scroll'      // 窗口事件
];
```

### 事件对象

```javascript
element.addEventListener('click', function(event) {
  // 阻止默认行为
  event.preventDefault();
  
  // 阻止事件冒泡
  event.stopPropagation();
  
  // 阻止所有事件传播（包括捕获阶段）
  event.stopImmediatePropagation();
  
  // 获取目标元素
  const target = event.target;
  
  // 获取当前元素（绑定事件的元素）
  const currentTarget = event.currentTarget;
  
  // 鼠标位置
  const x = event.clientX; // 相对于视口的X坐标
  const y = event.clientY; // 相对于视口的Y坐标
  
  // 键盘事件属性
  // const key = event.key;
  // const keyCode = event.keyCode;
  
  // 是否按下修饰键
  // const ctrlKey = event.ctrlKey;
  // const shiftKey = event.shiftKey;
  // const altKey = event.altKey;
});
```

## 事件委托

事件委托是一种优化技术，利用事件冒泡将事件监听器添加到父元素，而不是为每个子元素添加监听器。

```javascript
// 传统方式：为每个子元素添加事件监听器
const items = document.querySelectorAll('ul li');
items.forEach(item => {
  item.addEventListener('click', function() {
    console.log('项目被点击:', this.textContent);
  });
});

// 事件委托方式：在父元素上添加一个监听器
const ul = document.querySelector('ul');
ul.addEventListener('click', function(event) {
  // 检查点击的是否是li元素
  if (event.target.tagName === 'LI') {
    console.log('项目被点击:', event.target.textContent);
  }
});
```

## 遍历DOM

### 节点关系

```javascript
const element = document.getElementById('myElement');

// 父节点
element.parentNode; // 获取直接父节点
element.parentElement; // 获取直接父元素节点

// 子节点
element.childNodes; // 获取所有子节点（包括文本和注释）
element.children; // 获取所有子元素节点

// 第一个和最后一个子节点
element.firstChild;
element.lastChild;
element.firstElementChild;
element.lastElementChild;

// 兄弟节点
element.previousSibling; // 前一个节点
element.nextSibling; // 后一个节点
element.previousElementSibling; // 前一个元素节点
element.nextElementSibling; // 后一个元素节点

// 所有子孙节点（使用querySelectorAll）
const allDescendants = element.querySelectorAll('*');
```

## 异步DOM操作

### requestAnimationFrame

```javascript
// 优化动画性能
function animate() {
  // 执行DOM更新
  
  // 请求下一帧
  requestAnimationFrame(animate);
}

// 开始动画
requestAnimationFrame(animate);

// 取消动画
const animationId = requestAnimationFrame(animate);
cancelAnimationFrame(animationId);
```

### MutationObserver

用于监听DOM的变化。

```javascript
const targetNode = document.getElementById('myElement');

// 创建观察者实例
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    console.log('发生变化:', mutation.type);
    
    if (mutation.type === 'childList') {
      console.log('子节点变化');
    } else if (mutation.type === 'attributes') {
      console.log('属性变化:', mutation.attributeName);
    } else if (mutation.type === 'characterData') {
      console.log('文本内容变化');
    }
  });
});

// 配置观察选项
const config = {
  attributes: true,      // 观察属性变化
  childList: true,       // 观察子节点变化
  subtree: true,         // 观察所有子孙节点
  characterData: true,   // 观察文本内容变化
  attributeOldValue: true, // 记录属性旧值
  characterDataOldValue: true // 记录文本旧值
};

// 开始观察
bserver.observe(targetNode, config);

// 停止观察
bserver.disconnect();
```

## 性能优化

### 批量DOM操作

```javascript
// 方法1：使用DocumentFragment
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  const div = document.createElement('div');
  div.textContent = `项目 ${i}`;
  fragment.appendChild(div);
}
document.body.appendChild(fragment);

// 方法2：暂时分离元素
const container = document.getElementById('container');
const parent = container.parentNode;

// 从DOM中分离
parent.removeChild(container);

// 进行批量操作
for (let i = 0; i < 1000; i++) {
  const div = document.createElement('div');
  div.textContent = `项目 ${i}`;
  container.appendChild(div);
}

// 重新添加到DOM
parent.appendChild(container);

// 方法3：使用display: none
const element = document.getElementById('element');
element.style.display = 'none';

// 进行批量操作
element.innerHTML = '';
for (let i = 0; i < 1000; i++) {
  element.innerHTML += `<div>项目 ${i}</div>`;
}

// 重新显示
element.style.display = '';
```

### 使用高效的选择器

```javascript
// 优先使用getElementById（最快）
document.getElementById('id');

// 其次是getElementsByTagName/getElementsByClassName
document.getElementsByTagName('div');
document.getElementsByClassName('class');

// 尽量具体，避免全局查询
const container = document.getElementById('container');
container.querySelectorAll('.item'); // 比全局querySelectorAll更快

// 避免复杂的CSS选择器
const simple = document.querySelectorAll('.class'); // 比复杂选择器快
const complex = document.querySelectorAll('div.class > span'); // 较慢
```

## 常见问题

### 1. 如何等待DOM完全加载？

```javascript
// 方法1：使用DOMContentLoaded事件
document.addEventListener('DOMContentLoaded', function() {
  // DOM已经完全加载
  const elements = document.querySelectorAll('.item');
});

// 方法2：使用window.onload（等待所有资源加载完成）
window.addEventListener('load', function() {
  // 所有资源（图片、样式等）都已加载完成
});

// 方法3：将脚本放在body底部
// 在HTML的</body>标签前放置脚本
```

### 2. 如何处理异步DOM操作？

```javascript
// 使用requestAnimationFrame确保在下一帧进行DOM更新
function updateDOM() {
  requestAnimationFrame(() => {
    // 执行DOM更新
  });
}

// 使用setTimeout延迟DOM操作
setTimeout(() => {
  // 执行DOM更新
}, 0);
```

### 3. 如何避免内存泄漏？

```javascript
// 移除事件监听器
function cleanup() {
  element.removeEventListener('click', handleClick);
}

// 清除引用
function clearReferences() {
  myElement = null;
  myArray = [];
  myObject = {};
}

// 使用WeakMap/WeakSet存储DOM引用
const elementData = new WeakMap();
elementData.set(element, {data: 'value'});
```

### 4. 如何处理跨浏览器兼容性问题？

```javascript
// 特性检测
if ('querySelector' in document) {
  // 支持现代API
  const element = document.querySelector('.class');
} else {
  // 降级方案
  const elements = document.getElementsByTagName('*');
  let target;
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].className.indexOf('class') !== -1) {
      target = elements[i];
      break;
    }
  }
}

// 使用特性前缀
const requestAnimationFrame = window.requestAnimationFrame || 
                           window.mozRequestAnimationFrame || 
                           window.webkitRequestAnimationFrame || 
                           function(callback) {
                             return window.setTimeout(callback, 1000 / 60);
                           };
```