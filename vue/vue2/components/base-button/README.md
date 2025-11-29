# BaseButton 组件

## 组件介绍

BaseButton 是一个可复用的基础按钮组件，提供了丰富的样式和交互选项，用于统一应用中的按钮样式和行为。

## 目录结构

```
base-button/
  __test__/       # 测试文件目录
  src/            # 组件源码目录
    index.vue     # 组件实现
  styles/         # 样式文件目录
    index.less    # 组件样式
  index.ts        # 组件入口文件
  README.md       # 组件文档（当前文件）
```

## 功能特性

- 支持多种按钮类型（primary、secondary、success、warning、error）
- 支持多种按钮尺寸（small、medium、large）
- 支持图标按钮
- 支持禁用状态
- 支持加载状态
- 支持圆角样式
- 响应式设计

## 安装方法

### 局部引入

```vue
<template>
  <div>
    <BaseButton type="primary">主要按钮</BaseButton>
  </div>
</template>

<script>
import BaseButton from './components/base-button'

export default {
  components: {
    BaseButton
  }
}
</script>
```

### 全局注册

```javascript
// main.js
import Vue from 'vue'
import BaseButton from './components/base-button'

Vue.use(BaseButton)
```

## 使用示例

### 基础用法

```vue
<template>
  <div class="button-demo">
    <BaseButton>默认按钮</BaseButton>
    <BaseButton type="primary">主要按钮</BaseButton>
    <BaseButton type="success">成功按钮</BaseButton>
    <BaseButton type="warning">警告按钮</BaseButton>
    <BaseButton type="error">错误按钮</BaseButton>
  </div>
</template>
```

### 尺寸

```vue
<template>
  <div class="button-size-demo">
    <BaseButton size="small">小按钮</BaseButton>
    <BaseButton>中按钮</BaseButton>
    <BaseButton size="large">大按钮</BaseButton>
  </div>
</template>
```

### 禁用状态

```vue
<template>
  <div class="button-disabled-demo">
    <BaseButton disabled>禁用按钮</BaseButton>
    <BaseButton type="primary" disabled>禁用主要按钮</BaseButton>
  </div>
</template>
```

### 加载状态

```vue
<template>
  <div class="button-loading-demo">
    <BaseButton loading>加载中</BaseButton>
    <BaseButton type="primary" loading>加载中</BaseButton>
  </div>
</template>
```

### 图标按钮

```vue
<template>
  <div class="button-icon-demo">
    <BaseButton icon="search">搜索</BaseButton>
    <BaseButton icon="download" :icon-position="'right'">下载</BaseButton>
    <BaseButton type="primary" icon="plus">新增</BaseButton>
    <BaseButton icon="delete" circle></BaseButton>
  </div>
</template>
```

### 圆角按钮

```vue
<template>
  <div class="button-radius-demo">
    <BaseButton round>圆角按钮</BaseButton>
    <BaseButton type="primary" round>主要圆角按钮</BaseButton>
  </div>
</template>
```

## Props 说明

| Prop | 类型 | 默认值 | 可选值 | 说明 |
|-----|------|--------|--------|------|
| type | String | 'default' | 'default', 'primary', 'success', 'warning', 'error' | 按钮类型 |
| size | String | 'medium' | 'small', 'medium', 'large' | 按钮尺寸 |
| disabled | Boolean | false | true, false | 是否禁用 |
| loading | Boolean | false | true, false | 是否显示加载状态 |
| round | Boolean | false | true, false | 是否为圆角按钮 |
| circle | Boolean | false | true, false | 是否为圆形按钮 |
| icon | String | - | - | 图标名称 |
| iconPosition | String | 'left' | 'left', 'right' | 图标位置 |
| nativeType | String | 'button' | 'button', 'submit', 'reset' | 原生 button 类型 |
| block | Boolean | false | true, false | 是否为块级按钮 |
| autofocus | Boolean | false | true, false | 是否自动聚焦 |

## Events 说明

| Event | 参数 | 说明 |
|-------|------|------|
| click | event: MouseEvent | 点击按钮时触发 |
| mouseenter | event: MouseEvent | 鼠标进入按钮时触发 |
| mouseleave | event: MouseEvent | 鼠标离开按钮时触发 |

## Slots 说明

| Slot | 说明 |
|------|------|
| default | 按钮内容 |
| icon | 自定义图标内容 |

## 样式变量

以下是 BaseButton 组件使用的 CSS 变量，可通过覆盖这些变量来自定义样式：

```css
:root {
  /* 主色 */
  --base-button-primary-color: #1890ff;
  --base-button-primary-hover-color: #40a9ff;
  --base-button-primary-active-color: #096dd9;
  
  /* 成功色 */
  --base-button-success-color: #52c41a;
  --base-button-success-hover-color: #73d13d;
  --base-button-success-active-color: #389e0d;
  
  /* 警告色 */
  --base-button-warning-color: #faad14;
  --base-button-warning-hover-color: #ffc53d;
  --base-button-warning-active-color: #d48806;
  
  /* 错误色 */
  --base-button-error-color: #f5222d;
  --base-button-error-hover-color: #ff4d4f;
  --base-button-error-active-color: #cf1322;
  
  /* 文字颜色 */
  --base-button-text-color: rgba(0, 0, 0, 0.65);
  --base-button-text-hover-color: rgba(0, 0, 0, 0.85);
  --base-button-text-active-color: rgba(0, 0, 0, 0.95);
  
  /* 边框颜色 */
  --base-button-border-color: #d9d9d9;
  --base-button-border-hover-color: #40a9ff;
  --base-button-border-active-color: #1890ff;
  
  /* 尺寸 */
  --base-button-height-small: 24px;
  --base-button-height-medium: 32px;
  --base-button-height-large: 40px;
  
  /* 圆角 */
  --base-button-border-radius: 4px;
  --base-button-border-radius-circle: 50%;
}
```

## 无障碍支持

- 支持键盘操作（Tab、Enter、Space）
- 包含必要的 ARIA 属性
- 符合 WCAG 2.1 AA 级标准

## 浏览器兼容性

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- IE 11

## 最佳实践

1. **一致性**：在同一应用中保持按钮风格的一致性
2. **语义化**：根据按钮的功能选择合适的类型
3. **清晰性**：按钮文本应简洁明了，清晰表达操作意图
4. **反馈**：对于重要操作，提供操作成功或失败的反馈
5. **可访问性**：确保按钮可通过键盘操作，并提供足够的对比度

## 注意事项

1. 避免在同一页面使用过多不同类型的按钮，保持视觉一致性
2. 按钮文本应简洁，一般不超过 10 个字符
3. 加载状态按钮应禁用点击，防止重复提交
4. 图标按钮应提供适当的无障碍文本（aria-label）

## 相关链接

- [Vue 组件开发规范](../README.md)
- [基础样式变量](../../../theme/README.md)
- [图标库使用指南](../../../icons/README.md)