# JavaScript 事件处理

## 介绍

JavaScript 事件处理是前端开发的核心概念之一，它使网页能够响应用户交互和浏览器行为。事件是浏览器或用户触发的行为，如点击按钮、滚动页面、键盘输入等。通过事件处理，开发者可以创建交互式和响应式的网页应用。

## 事件流

事件流描述了从页面接收事件的顺序。现代浏览器采用W3C规范的事件流，包括三个阶段：

1. **捕获阶段**：事件从文档根节点向下传播到目标元素
2. **目标阶段**：事件到达目标元素本身
3. **冒泡阶段**：事件从目标元素向上传播回文档根节点

![事件流示意图]

## 添加和移除事件监听器

### 基本语法

```javascript
// 添加事件监听器
element.addEventListener(eventType, eventHandler, options);

// 移除事件监听器
element.removeEventListener(eventType, eventHandler, options);
```

### 示例

```javascript
const button = document.getElementById('myButton');

// 定义事件处理函数
function handleClick(event) {
  console.log('按钮被点击了！', event);
}

// 添加事件监听器
button.addEventListener('click', handleClick);

// 移除事件监听器
button.removeEventListener('click', handleClick);
```

### 注意事项

- 要移除事件监听器，必须使用相同的事件处理函数引用，匿名函数无法被移除
- 事件监听器的选项参数可以控制事件的行为

## 事件监听器选项

```javascript
element.addEventListener('click', handleClick, {
  capture: false,  // 是否在捕获阶段触发，默认为false（冒泡阶段）
  once: false,     // 是否只触发一次，触发后自动移除监听器
  passive: false   // 是否不能阻止默认行为，提高性能（特别是滚动事件）
});
```

## 事件对象

事件处理函数接收一个事件对象作为参数，该对象包含有关事件的详细信息和控制事件行为的方法：

```javascript
element.addEventListener('click', function(event) {
  // 事件类型
  console.log(event.type); // 'click'
  
  // 目标元素
  console.log(event.target); // 事件触发的元素
  
  // 当前元素
  console.log(event.currentTarget); // 绑定监听器的元素
  
  // 阻止默认行为
  event.preventDefault();
  
  // 阻止事件冒泡
  event.stopPropagation();
  
  // 阻止所有后续监听器
  event.stopImmediatePropagation();
  
  // 事件阶段（0: 捕获, 1: 目标, 2: 冒泡）
  console.log(event.eventPhase);
});
```

## 常见事件类型

### 鼠标事件

```javascript
// 点击事件
element.addEventListener('click', handleClick); // 单击
element.addEventListener('dblclick', handleDoubleClick); // 双击

// 鼠标移动事件
element.addEventListener('mousemove', handleMouseMove);
element.addEventListener('mouseover', handleMouseOver);
element.addEventListener('mouseout', handleMouseOut);
element.addEventListener('mouseenter', handleMouseEnter); // 不冒泡
element.addEventListener('mouseleave', handleMouseLeave); // 不冒泡

// 鼠标按键事件
element.addEventListener('mousedown', handleMouseDown);
element.addEventListener('mouseup', handleMouseUp);
```

### 键盘事件

```javascript
element.addEventListener('keydown', handleKeyDown); // 按下按键
element.addEventListener('keyup', handleKeyUp); // 释放按键
element.addEventListener('keypress', handleKeyPress); // 字符键（不推荐使用）

function handleKeyDown(event) {
  // 按键代码
  console.log(event.key); // 'a', 'Enter', 'Escape' 等
  console.log(event.keyCode); // 按键的数值代码（已弃用）
  
  // 修饰键状态
  if (event.ctrlKey && event.key === 's') {
    console.log('Ctrl+S 被按下');
    event.preventDefault(); // 阻止默认保存行为
  }
  
  // 常用修饰键
  console.log(event.altKey);
  console.log(event.shiftKey);
  console.log(event.metaKey); // Command (Mac) 或 Windows 键
}
```

### 表单事件

```javascript
const form = document.getElementById('myForm');

// 表单提交
form.addEventListener('submit', function(event) {
  event.preventDefault(); // 阻止表单默认提交
  console.log('表单被提交');
});

// 输入事件
const input = document.getElementById('myInput');
input.addEventListener('input', handleInput); // 输入时实时触发
input.addEventListener('change', handleChange); // 失去焦点且值改变时触发
input.addEventListener('focus', handleFocus); // 获取焦点
input.addEventListener('blur', handleBlur); // 失去焦点

// 选择事件
const select = document.getElementById('mySelect');
select.addEventListener('change', handleSelectChange);
```

### 触摸事件

```javascript
element.addEventListener('touchstart', handleTouchStart); // 触摸开始
element.addEventListener('touchmove', handleTouchMove); // 触摸移动
element.addEventListener('touchend', handleTouchEnd); // 触摸结束
element.addEventListener('touchcancel', handleTouchCancel); // 触摸取消

function handleTouchStart(event) {
  // 获取触摸点
  const touch = event.touches[0];
  console.log('触摸位置:', touch.clientX, touch.clientY);
  
  // 多点触摸
  if (event.touches.length > 1) {
    console.log('多点触摸');
  }
}
```

### 窗口事件

```javascript
// 加载事件
window.addEventListener('load', handleLoad); // 所有资源加载完成
document.addEventListener('DOMContentLoaded', handleDomContentLoaded); // DOM解析完成

// 尺寸变化
window.addEventListener('resize', handleResize);

// 滚动
window.addEventListener('scroll', handleScroll, { passive: true });

// 焦点变化
window.addEventListener('focus', handleWindowFocus);
window.addEventListener('blur', handleWindowBlur);
```

## 事件委托

事件委托是一种优化技术，利用事件冒泡将事件监听器添加到父元素而不是为每个子元素添加监听器。

### 优点

- **减少内存使用**：只需要一个事件监听器
- **动态元素支持**：新添加的子元素自动继承事件处理
- **提高性能**：减少事件监听器数量

### 示例

```javascript
// HTML结构
// <ul id="todoList">
//   <li>任务1</li>
//   <li>任务2</li>
//   <li>任务3</li>
// </ul>

const todoList = document.getElementById('todoList');

// 为父元素添加一个事件监听器
todoList.addEventListener('click', function(event) {
  // 检查点击的是否是li元素
  if (event.target.tagName === 'LI') {
    console.log('任务被点击:', event.target.textContent);
    event.target.classList.toggle('completed');
  }
});

// 动态添加新任务
function addTask(text) {
  const li = document.createElement('li');
  li.textContent = text;
  todoList.appendChild(li);
  // 不需要为新li添加事件监听器，因为父元素的事件监听器会处理它
}
```

## 自定义事件

除了使用浏览器提供的事件外，还可以创建和分发自定义事件。

### 创建和触发自定义事件

```javascript
// 创建基本自定义事件
const myEvent = new Event('my-custom-event', {
  bubbles: true,       // 是否冒泡
  cancelable: true     // 是否可取消
});

// 创建带数据的自定义事件
const myEventWithData = new CustomEvent('my-custom-event', {
  bubbles: true,
  cancelable: true,
  detail: {            // 自定义数据
    message: 'Hello',
    timestamp: Date.now()
  }
});

// 触发事件
element.dispatchEvent(myEvent);
element.dispatchEvent(myEventWithData);

// 监听自定义事件
element.addEventListener('my-custom-event', function(event) {
  console.log('自定义事件被触发');
  console.log('自定义数据:', event.detail);
});
```

## 事件处理中的this上下文

在事件处理函数中，`this` 通常指向绑定事件的元素：

```javascript
element.addEventListener('click', function() {
  console.log(this === element); // true
});

// 但在箭头函数中，this不绑定到元素
element.addEventListener('click', () => {
  console.log(this === element); // false
  console.log(this); // 通常是window或外部作用域的this
});
```

## 防抖和节流

为了优化频繁触发的事件（如滚动、调整大小等），可以使用防抖和节流技术。

### 防抖（Debounce）

延迟执行，直到事件停止触发一段时间后才执行。

```javascript
function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// 使用示例
window.addEventListener('resize', debounce(function() {
  console.log('窗口大小已调整');
}, 250));
```

### 节流（Throttle）

限制函数在一定时间内最多执行一次。

```javascript
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const context = this;
    const args = arguments;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// 使用示例
window.addEventListener('scroll', throttle(function() {
  console.log('页面滚动中...');
}, 250));
```

## 性能优化

### 移除不需要的事件监听器

```javascript
function cleanup() {
  element.removeEventListener('click', handleClick);
}

// 当组件卸载或不再需要时调用
```

### 使用passive选项

对于滚动等触摸相关事件，使用`passive: true`可以提高性能。

```javascript
window.addEventListener('scroll', handleScroll, { passive: true });
window.addEventListener('touchmove', handleTouchMove, { passive: true });
```

### 使用事件委托

如前所述，事件委托可以显著减少事件监听器的数量。

### 避免在事件处理器中执行耗时操作

将耗时操作放在Web Worker或使用异步处理。

```javascript
element.addEventListener('click', function() {
  // 在事件处理器中仅启动异步操作
  startLongRunningTask();
});

async function startLongRunningTask() {
  // 耗时操作...
}
```

## 常见问题

### 1. 为什么事件监听器没有被移除？

**问题**：尝试移除事件监听器但不起作用。

**解决方案**：
- 确保使用相同的事件处理函数引用
- 确保事件类型完全匹配
- 确保选项参数（如capture）与添加时一致

```javascript
// 正确做法
function handler() { /* ... */ }
element.addEventListener('click', handler);
element.removeEventListener('click', handler);

// 错误做法（匿名函数无法被移除）
element.addEventListener('click', function() { /* ... */ });
element.removeEventListener('click', function() { /* ... */ }); // 不起作用
```

### 2. 如何处理触摸和鼠标事件的冲突？

**问题**：在移动设备上，触摸事件和鼠标事件可能都会触发，导致重复操作。

**解决方案**：
- 使用触摸事件优先的策略
- 阻止触摸事件的默认行为以避免触发鼠标事件

```javascript
element.addEventListener('touchstart', function(event) {
  // 处理触摸事件
  event.preventDefault(); // 阻止默认行为
});

// 或者使用特性检测
if ('ontouchstart' in window) {
  // 移动设备：使用触摸事件
  element.addEventListener('touchstart', handleTouchStart);
} else {
  // 桌面设备：使用鼠标事件
  element.addEventListener('mousedown', handleMouseDown);
}
```

### 3. 为什么使用stopPropagation后事件委托仍然工作？

**问题**：在子元素上使用`event.stopPropagation()`后，父元素的事件委托仍然能捕获到事件。

**解决方案**：
- 检查是否在正确的阶段调用了`stopPropagation()`
- 确认事件委托的设置是否正确

```javascript
// 在捕获阶段绑定的事件委托不会被冒泡阶段的stopPropagation阻止
parent.addEventListener('click', handleClick, { capture: true });

child.addEventListener('click', function(event) {
  event.stopPropagation(); // 只阻止冒泡阶段，不影响捕获阶段
});
```

### 4. 如何处理跨浏览器兼容性问题？

**问题**：在旧浏览器中事件处理可能不工作。

**解决方案**：
- 使用特性检测
- 添加事件监听器的兼容写法

```javascript
// 兼容IE9及更早版本
function addEvent(element, eventType, handler) {
  if (element.addEventListener) {
    // 现代浏览器
    element.addEventListener(eventType, handler, false);
  } else if (element.attachEvent) {
    // IE旧版本
    element.attachEvent('on' + eventType, function() {
      handler.call(element); // 修复this指向
    });
  } else {
    // 非常旧的浏览器
    element['on' + eventType] = handler;
  }
}

function removeEvent(element, eventType, handler) {
  if (element.removeEventListener) {
    element.removeEventListener(eventType, handler, false);
  } else if (element.detachEvent) {
    element.detachEvent('on' + eventType, handler);
  } else {
    element['on' + eventType] = null;
  }
}
```

### 5. 为什么使用箭头函数作为事件处理器会导致this指向问题？

**问题**：在箭头函数中，this不指向事件触发的元素。

**解决方案**：
- 使用普通函数而不是箭头函数作为事件处理器
- 如果坚持使用箭头函数，可以通过`event.currentTarget`获取当前元素

```javascript
// 方法1：使用普通函数
element.addEventListener('click', function() {
  console.log(this); // 指向element
});

// 方法2：使用箭头函数和event.currentTarget
element.addEventListener('click', (event) => {
  console.log(event.currentTarget); // 指向element
});
```