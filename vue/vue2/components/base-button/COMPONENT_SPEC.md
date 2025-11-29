# 组件开发规范说明

## 标准目录结构

根据公司组件库开发规范，组件目录应该包含以下结构：

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

当前 `base-button` 组件目录缺少以下必要内容：

1. **__test__/ 目录**
   - 用于存放组件的单元测试文件
   - 建议使用 Vitest 进行测试
   - 测试覆盖率应 ≥ 90%
   - 测试用例应覆盖：组件渲染、Props传递、事件触发、插槽内容

2. **src/ 目录**
   - 存放组件的源代码文件
   - 主要文件：`index.vue`（组件实现）
   - 遵循 Vue 组件模板规范

3. **styles/ 目录**
   - 存放组件的样式文件
   - 主要文件：`index.less`
   - 支持主题定制和变量覆盖

4. **index.ts 入口文件**
   - 组件的导出入口
   - 提供 Vue 插件安装方法
   - 支持按需导入

## Vue 组件模板示例

```vue
<template>
  <div class="base-button">
    <!-- 组件内容 -->
  </div>
</template>

<script>
export default {
  name: 'BaseButton',
  props: {
    // Props定义
  },
  methods: {
    // 方法定义
  }
}
</script>

<style lang="less" scoped>
.base-button {
  // 样式定义
}
</style>
```

## 组件入口模板示例

```typescript
import BaseButton from './src/index.vue'
import './styles/index.less'

BaseButton.install = function(Vue) {
  Vue.component(BaseButton.name, BaseButton)
}

export default BaseButton
export { BaseButton }
```

## 验证步骤

组件开发完成后，需要执行以下验证步骤：

1. 代码风格检查 (ESLint)
2. 单元测试通过
3. 文档完整性检查
4. 视觉回归测试
5. 可访问性测试

## 注意事项

- 所有文件名应使用小写和连字符命名法
- 组件名称应遵循 PascalCase 命名规范
- 样式文件应使用 CSS 变量支持主题定制
- 确保组件具有良好的可访问性和浏览器兼容性
- 遵循单一职责原则，保持组件功能内聚

## 参考资料

- [Vue 2 官方文档](https://v2.vuejs.org/)
- [组件库最佳实践指南](../README.md)
- [可访问性设计规范](../../../accessibility/README.md)