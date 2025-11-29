# CSS 动画

## 介绍

CSS动画是前端开发中实现页面动态效果的重要技术，它可以在不使用JavaScript的情况下创建流畅的视觉效果和交互体验。CSS动画包括过渡（transitions）、关键帧动画（keyframes）以及各种动画属性。

## 动画类型

### 1. 过渡动画 (Transitions)

过渡动画允许我们定义元素从一种样式状态转变为另一种样式状态的过程。

#### 基本语法

```css
.element {
  transition: property duration timing-function delay;
}
```

#### 属性说明

- `property`: 要过渡的CSS属性名称（如 `color`, `width`, `transform` 等）
- `duration`: 过渡持续时间（如 `0.3s`, `500ms`）
- `timing-function`: 过渡的时间曲线（如 `ease`, `linear`, `ease-in`, `ease-out`, `ease-in-out`）
- `delay`: 过渡开始前的延迟时间

#### 示例

```css
.button {
  background-color: #3498db;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: #2980b9;
}
```

### 2. 关键帧动画 (Keyframes)

关键帧动画允许我们创建更复杂的动画序列，可以在多个关键帧之间定义不同的状态。

#### 基本语法

```css
@keyframes animation-name {
  from { /* 起始状态 */ }
  to { /* 结束状态 */ }
}

/* 或者使用百分比 */
@keyframes animation-name {
  0% { /* 起始状态 */ }
  50% { /* 中间状态 */ }
  100% { /* 结束状态 */ }
}

.element {
  animation: name duration timing-function delay iteration-count direction fill-mode;
}
```

#### 属性说明

- `name`: 关键帧动画的名称
- `duration`: 动画持续时间
- `timing-function`: 动画的时间曲线
- `delay`: 动画开始前的延迟
- `iteration-count`: 动画重复次数（如 `1`, `3`, `infinite`）
- `direction`: 动画播放方向（如 `normal`, `reverse`, `alternate`, `alternate-reverse`）
- `fill-mode`: 动画执行前后的状态（如 `none`, `forwards`, `backwards`, `both`）

#### 示例

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.element {
  animation: fadeIn 1s ease-in;
}

.bouncing-ball {
  animation: bounce 1s ease-in-out infinite;
}
```

## 常用动画属性

### Transform

Transform属性用于元素的旋转、缩放、移动和倾斜。

- `translate(x, y)`: 移动元素
- `rotate(angle)`: 旋转元素
- `scale(x, y)`: 缩放元素
- `skew(x-angle, y-angle)`: 倾斜元素
- `matrix()`: 复合变换

### Opacity

控制元素的透明度，从0（完全透明）到1（完全不透明）。

### Filter

提供各种图形效果，如模糊、亮度、对比度等。

## 性能优化

### 使用GPU加速

使用 `transform` 和 `opacity` 属性进行动画可以利用GPU加速，避免重排和重绘。

```css
/* 推荐的高性能动画属性 */
.element {
  transform: translate3d(0, 0, 0); /* 启用GPU加速 */
  transition: transform 0.3s ease;
}
```

### 减少重排和重绘

- 避免在动画期间修改布局属性（如 width, height, margin, padding）
- 使用 `will-change` 属性提前告知浏览器元素将要发生变化

```css
.element {
  will-change: transform, opacity;
}
```

## 高级技术

### 动画组合

可以同时应用多个动画，并控制它们的播放顺序和时间。

```css
.element {
  animation: fadeIn 1s ease-in,
             slideUp 1s ease-out,
             bounce 2s ease-in-out infinite 1s;
}
```

### 使用CSS变量控制动画

利用CSS变量可以动态控制动画参数。

```css
:root {
  --animation-duration: 1s;
  --animation-delay: 0s;
}

.element {
  animation: fadeIn var(--animation-duration) ease-in var(--animation-delay);
}
```

## 常见问题

### 1. 如何创建平滑的动画效果？

- 选择合适的缓动函数（easing functions）
- 控制动画持续时间，避免过快或过慢
- 使用GPU加速的属性进行动画
- 确保动画帧率稳定（60fps）

### 2. 如何处理动画在移动设备上的性能问题？

- 减少同时运行的动画数量
- 避免使用复杂的 `box-shadow` 和 `border-radius`
- 使用 `requestAnimationFrame` 进行JavaScript控制的动画
- 考虑使用 `prefers-reduced-motion` 媒体查询

### 3. CSS动画和JavaScript动画有什么区别？

- CSS动画：性能更好（尤其是简单动画），代码简洁，适合预设的动画效果
- JavaScript动画：灵活性更高，可交互性更强，适合复杂的动画逻辑和用户交互

### 4. 如何创建响应式动画？

- 使用CSS媒体查询调整不同屏幕尺寸下的动画参数
- 结合CSS变量动态修改动画属性
- 考虑在移动设备上简化或禁用某些复杂动画