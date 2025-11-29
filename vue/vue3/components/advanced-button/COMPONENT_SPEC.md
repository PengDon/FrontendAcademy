# 组件开发规范说明

## 标准目录结构

根据公司组件库开发规范，Vue 3 组件目录应该包含以下结构：

```
packages/components/
  component-name/
    __test__/       # 测试文件
      component.spec.ts
    src/            # 组件源码
      index.vue
    styles/         # 样式文件
      index.less
    index.ts        # 组件入口文件
    README.md       # 组件文档（已创建）
```

## 缺失的目录和文件

当前 `advanced-button` 组件目录缺少以下必要内容：

1. **__test__/ 目录**
   - 用于存放组件的单元测试文件
   - 建议使用 Vitest 进行测试
   - 测试覆盖率应 ≥ 90%
   - 测试用例应覆盖：组件渲染、Props传递、事件触发、插槽内容

2. **src/ 目录**
   - 存放组件的源代码文件
   - 主要文件：`index.vue`（组件实现）
   - 遵循 Vue 3 组合式 API 开发规范

3. **styles/ 目录**
   - 存放组件的样式文件
   - 主要文件：`index.less`
   - 支持主题定制和变量覆盖

4. **index.ts 入口文件**
   - 组件的导出入口
   - 提供 Vue 3 插件安装方法
   - 支持按需导入和 TypeScript 类型导出

## Vue 3 组件模板示例（组合式 API）

```vue
<template>
  <div class="advanced-button">
    <!-- 组件内容 -->
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props 定义
interface Props {
  type?: 'default' | 'primary' | 'secondary'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  size: 'medium',
  disabled: false
})

// Emits 定义
const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

// 组合式逻辑
const buttonClasses = computed(() => ({
  'advanced-button': true,
  [`advanced-button--${props.type}`]: true,
  [`advanced-button--${props.size}`]: true,
  'advanced-button--disabled': props.disabled
}))
</script>

<style lang="less" scoped>
.advanced-button {
  // 样式定义
}
</style>
```

## 组件入口模板示例（Vue 3）

```typescript
import { App } from 'vue'
import AdvancedButton from './src/index.vue'
import './styles/index.less'

export const AdvancedButtonPlugin = {
  install(app: App) {
    app.component('AdvancedButton', AdvancedButton)
  }
}

export { AdvancedButton }
export default AdvancedButton
```

## 组合式函数示例

```typescript
// src/composables/useButtonState.ts
import { ref, computed } from 'vue'

export function useButtonState(disabled: boolean, loading: boolean) {
  const isHovered = ref(false)
  const isPressed = ref(false)
  
  const buttonState = computed(() => {
    if (disabled || loading) return 'disabled'
    if (isPressed.value) return 'pressed'
    if (isHovered.value) return 'hovered'
    return 'normal'
  })
  
  const handleMouseEnter = () => {
    if (!disabled) isHovered.value = true
  }
  
  const handleMouseLeave = () => {
    isHovered.value = false
    isPressed.value = false
  }
  
  const handleMouseDown = () => {
    if (!disabled) isPressed.value = true
  }
  
  const handleMouseUp = () => {
    isPressed.value = false
  }
  
  return {
    buttonState,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseDown,
    handleMouseUp
  }
}
```

## TypeScript 类型定义示例

```typescript
// src/types/index.ts
export type ButtonType = 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'dashed' | 'link'
export type ButtonSize = 'small' | 'medium' | 'large'

export interface ButtonProps {
  type?: ButtonType
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  // 更多属性...
}

export interface ButtonEmits {
  (e: 'click', event: MouseEvent): void
  // 更多事件...
}
```

## 验证步骤

组件开发完成后，需要执行以下验证步骤：

1. 代码风格检查 (ESLint)
2. TypeScript 类型检查
3. 单元测试通过
4. 文档完整性检查
5. 视觉回归测试
6. 可访问性测试
7. 性能测试（大型列表渲染等场景）

## 注意事项

- 使用 TypeScript 确保类型安全，避免 any 类型
- 利用 Vue 3 组合式 API 提高代码复用性
- 使用 CSS 变量支持主题定制和动态样式
- 确保组件具有良好的可访问性（ARIA 属性等）
- 优化性能，避免不必要的渲染
- 提供完整的文档和使用示例

## 参考资料

- [Vue 3 官方文档](https://v3.vuejs.org/)
- [Vue 3 组合式 API 指南](https://v3.vuejs.org/guide/composition-api-introduction.html)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [组件库最佳实践指南](../README.md)