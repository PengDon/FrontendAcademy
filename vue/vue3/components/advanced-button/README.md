# AdvancedButton 组件

## 组件介绍

AdvancedButton 是基于 Vue 3 组合式 API 开发的高级按钮组件，提供了比基础按钮更丰富的功能和交互选项，适用于复杂场景下的按钮需求。

## 目录结构

```
advanced-button/
  __test__/       # 测试文件目录
  src/            # 组件源码目录
    index.vue     # 组件实现
  styles/         # 样式文件目录
    index.less    # 组件样式
  index.ts        # 组件入口文件
  README.md       # 组件文档（当前文件）
```

## 功能特性

- 基于 Vue 3 组合式 API 开发
- 支持多种按钮类型（primary、secondary、outline、ghost、dashed、link）
- 支持多种尺寸（small、medium、large）
- 支持图标按钮和图标位置定制
- 支持加载状态和自定义加载图标
- 支持禁用状态和自定义禁用样式
- 支持圆角和圆形样式
- 支持块级和内联块级显示
- 支持渐变背景色
- 支持自定义动画效果
- 支持鼠标悬停和点击的微交互
- 完整的 TypeScript 类型支持

## 安装方法

### 局部引入

```vue
<template>
  <div>
    <AdvancedButton type="primary">主要按钮</AdvancedButton>
  </div>
</template>

<script setup lang="ts">
import { AdvancedButton } from './components/advanced-button'
</script>
```

### 全局注册

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { AdvancedButton } from './components/advanced-button'

const app = createApp(App)
app.use(AdvancedButton)
app.mount('#app')
```

## 使用示例

### 基础用法

```vue
<template>
  <div class="button-demo">
    <AdvancedButton>默认按钮</AdvancedButton>
    <AdvancedButton type="primary">主要按钮</AdvancedButton>
    <AdvancedButton type="secondary">次要按钮</AdvancedButton>
    <AdvancedButton type="outline">描边按钮</AdvancedButton>
    <AdvancedButton type="ghost">幽灵按钮</AdvancedButton>
    <AdvancedButton type="dashed">虚线按钮</AdvancedButton>
    <AdvancedButton type="link">链接按钮</AdvancedButton>
  </div>
</template>
```

### 尺寸

```vue
<template>
  <div class="button-size-demo">
    <AdvancedButton size="small">小按钮</AdvancedButton>
    <AdvancedButton>中按钮</AdvancedButton>
    <AdvancedButton size="large">大按钮</AdvancedButton>
  </div>
</template>
```

### 禁用状态

```vue
<template>
  <div class="button-disabled-demo">
    <AdvancedButton disabled>禁用按钮</AdvancedButton>
    <AdvancedButton type="primary" disabled>禁用主要按钮</AdvancedButton>
    <AdvancedButton type="link" disabled>禁用链接按钮</AdvancedButton>
  </div>
</template>
```

### 加载状态

```vue
<template>
  <div class="button-loading-demo">
    <AdvancedButton loading>加载中</AdvancedButton>
    <AdvancedButton type="primary" loading>
      <template #loadingIcon>
        <!-- 自定义加载图标 -->
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <!-- 自定义加载动画 -->
        </svg>
      </template>
      加载中
    </AdvancedButton>
  </div>
</template>
```

### 图标按钮

```vue
<template>
  <div class="button-icon-demo">
    <AdvancedButton icon="search">搜索</AdvancedButton>
    <AdvancedButton icon="download" iconPosition="right">下载</AdvancedButton>
    <AdvancedButton type="primary" icon="plus">新增</AdvancedButton>
    <AdvancedButton icon="delete" circle></AdvancedButton>
  </div>
</template>
```

### 渐变按钮

```vue
<template>
  <div class="button-gradient-demo">
    <AdvancedButton 
      type="primary" 
      :gradient="{ from: '#1890ff', to: '#722ed1' }"
    >
      渐变按钮
    </AdvancedButton>
    <AdvancedButton 
      type="primary" 
      :gradient="{ from: '#52c41a', to: '#1890ff' }" 
      round
    >
      圆角渐变
    </AdvancedButton>
  </div>
</template>
```

### 自定义样式

```vue
<template>
  <div class="button-custom-demo">
    <AdvancedButton 
      :customStyle="{ 
        padding: '0 24px',
        fontSize: '16px',
        fontWeight: 'bold'
      }"
    >
      自定义样式
    </AdvancedButton>
    <AdvancedButton 
      type="primary"
      customClass="my-custom-button"
    >
      自定义类名
    </AdvancedButton>
  </div>
</template>

<style scoped>
:deep(.my-custom-button) {
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
  transition: all 0.3s ease;
}

:deep(.my-custom-button:hover) {
  box-shadow: 0 6px 16px rgba(24, 144, 255, 0.4);
  transform: translateY(-2px);
}
</style>
```

### 组合使用

```vue
<template>
  <div class="button-combination-demo">
    <AdvancedButton type="primary" size="large" round icon="plus">
      新增项目
    </AdvancedButton>
    <AdvancedButton type="outline" size="small" icon="edit">
      编辑
    </AdvancedButton>
    <AdvancedButton type="error" size="small" icon="delete">
      删除
    </AdvancedButton>
  </div>
</template>
```

## Props 说明

| Prop | 类型 | 默认值 | 可选值 | 说明 |
|-----|------|--------|--------|------|
| type | String | 'default' | 'default', 'primary', 'secondary', 'outline', 'ghost', 'dashed', 'link' | 按钮类型 |
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
| gradient | Object | - | { from: String, to: String } | 渐变背景色配置 |
| customStyle | Object | {} | CSSProperties | 自定义内联样式 |
| customClass | String | '' | - | 自定义类名 |
| animation | Boolean | true | true, false | 是否启用动画效果 |
| hoverEffect | Boolean | true | true, false | 是否启用悬停效果 |
| activeEffect | Boolean | true | true, false | 是否启用点击效果 |

## Events 说明

| Event | 参数 | 说明 |
|-------|------|------|
| click | event: MouseEvent | 点击按钮时触发 |
| mouseenter | event: MouseEvent | 鼠标进入按钮时触发 |
| mouseleave | event: MouseEvent | 鼠标离开按钮时触发 |
| focus | event: FocusEvent | 按钮获取焦点时触发 |
| blur | event: FocusEvent | 按钮失去焦点时触发 |

## Slots 说明

| Slot | 说明 |
|------|------|
| default | 按钮内容 |
| icon | 自定义图标内容 |
| loadingIcon | 自定义加载图标内容 |

## 组合式函数

### useButtonState

```typescript
import { ref, computed } from 'vue'

export function useButtonState(props) {
  const isFocused = ref(false)
  
  // 计算按钮的最终状态
  const buttonState = computed(() => {
    if (props.disabled) return 'disabled'
    if (props.loading) return 'loading'
    if (isFocused.value) return 'focused'
    return 'normal'
  })
  
  // 处理焦点事件
  const handleFocus = (event) => {
    isFocused.value = true
    props.onFocus?.(event)
  }
  
  const handleBlur = (event) => {
    isFocused.value = false
    props.onBlur?.(event)
  }
  
  return {
    buttonState,
    handleFocus,
    handleBlur
  }
}
```

### useButtonStyles

```typescript
import { computed } from 'vue'

export function useButtonStyles(props) {
  // 计算按钮样式
  const buttonStyles = computed(() => {
    const styles = {}
    
    // 处理渐变
    if (props.gradient && !props.disabled) {
      styles.background = `linear-gradient(135deg, ${props.gradient.from}, ${props.gradient.to})`
    }
    
    // 合并自定义样式
    return { ...styles, ...props.customStyle }
  })
  
  // 计算类名
  const buttonClasses = computed(() => {
    return {
      'advanced-button': true,
      [`advanced-button--${props.type}`]: true,
      [`advanced-button--${props.size}`]: true,
      'advanced-button--disabled': props.disabled,
      'advanced-button--loading': props.loading,
      'advanced-button--round': props.round,
      'advanced-button--circle': props.circle,
      'advanced-button--block': props.block,
      'advanced-button--gradient': !!props.gradient && !props.disabled,
      'advanced-button--with-icon': !!props.icon,
      [props.customClass]: !!props.customClass
    }
  })
  
  return {
    buttonStyles,
    buttonClasses
  }
}
```

## 样式变量

```css
:root {
  /* 主色 */
  --advanced-button-primary-color: #1890ff;
  --advanced-button-primary-hover-color: #40a9ff;
  --advanced-button-primary-active-color: #096dd9;
  
  /* 次要色 */
  --advanced-button-secondary-color: #f0f0f0;
  --advanced-button-secondary-hover-color: #fafafa;
  --advanced-button-secondary-active-color: #e6e6e6;
  
  /* 尺寸变量 */
  --advanced-button-height-small: 28px;
  --advanced-button-height-medium: 36px;
  --advanced-button-height-large: 44px;
  
  /* 边距变量 */
  --advanced-button-padding-small: 0 12px;
  --advanced-button-padding-medium: 0 16px;
  --advanced-button-padding-large: 0 24px;
  
  /* 圆角变量 */
  --advanced-button-border-radius: 6px;
  --advanced-button-border-radius-large: 8px;
  --advanced-button-border-radius-circle: 50%;
  
  /* 字体变量 */
  --advanced-button-font-size-small: 14px;
  --advanced-button-font-size-medium: 16px;
  --advanced-button-font-size-large: 18px;
  
  /* 过渡变量 */
  --advanced-button-transition-duration: 0.2s;
  --advanced-button-transition-timing: cubic-bezier(0.645, 0.045, 0.355, 1);
}
```

## TypeScript 类型定义

```typescript
// 按钮类型
export type ButtonType = 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'dashed' | 'link'

// 按钮尺寸
export type ButtonSize = 'small' | 'medium' | 'large'

// 图标位置
export type IconPosition = 'left' | 'right'

// 渐变配置
export interface GradientConfig {
  from: string
  to: string
}

// 按钮属性
export interface ButtonProps {
  type?: ButtonType
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  round?: boolean
  circle?: boolean
  icon?: string
  iconPosition?: IconPosition
  nativeType?: 'button' | 'submit' | 'reset'
  block?: boolean
  autofocus?: boolean
  gradient?: GradientConfig
  customStyle?: Record<string, string | number>
  customClass?: string
  animation?: boolean
  hoverEffect?: boolean
  activeEffect?: boolean
}

// 按钮事件
export interface ButtonEmits {
  (e: 'click', event: MouseEvent): void
  (e: 'mouseenter', event: MouseEvent): void
  (e: 'mouseleave', event: MouseEvent): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}
```

## 无障碍支持

- 符合 WCAG 2.1 AA 级标准
- 支持键盘导航（Tab、Enter、Space）
- 包含完整的 ARIA 属性
- 提供适当的焦点指示器
- 支持屏幕阅读器

## 浏览器兼容性

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- IE 11 (需要额外配置)

## 性能优化

1. **按需加载**：支持组件的按需导入
2. **样式隔离**：使用 CSS Modules 或 Scoped CSS 确保样式隔离
3. **避免不必要的渲染**：使用 computed 和 memo 优化性能
4. **图标优化**：支持图标按需加载和懒加载
5. **动画优化**：使用 transform 和 opacity 进行动画，避免重排

## 最佳实践

1. **类型选择**：根据操作的重要性选择合适的按钮类型
2. **尺寸统一**：在同一功能区域使用统一尺寸的按钮
3. **图标搭配**：重要操作可添加图标增强识别度
4. **加载状态**：异步操作必须显示加载状态
5. **错误处理**：提供清晰的错误反馈
6. **可访问性**：确保按钮可通过键盘操作

## 注意事项

1. 避免在同一页面使用过多不同类型的按钮，保持视觉一致性
2. 按钮文本应简洁明了，一般不超过 12 个字符
3. 对于重要操作，建议使用 primary 类型突出显示
4. 渐变按钮应谨慎使用，避免过度设计
5. 自定义样式时应考虑与整体设计系统的协调性

## 相关链接

- [Vue 3 组件开发规范](../README.md)
- [组合式 API 使用指南](../../../composition-api/README.md)
- [主题系统](../../../theme/README.md)
- [图标库](../../../icons/README.md)