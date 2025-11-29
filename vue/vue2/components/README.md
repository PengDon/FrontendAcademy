# Vue 2 组件开发

## 组件基础

在 Vue 2 中，组件是构建用户界面的基本单位。组件可以重复使用，并且可以嵌套组合，形成复杂的应用程序界面。

### 组件定义方式

#### 全局组件

```javascript
// 注册全局组件
Vue.component('my-component', {
  template: '<div>全局组件内容</div>',
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      this.count++
    }
  }
})
```

#### 局部组件

```javascript
// 定义局部组件
const ChildComponent = {
  template: '<div>局部组件内容</div>',
  data() {
    return {
      message: 'Hello from child'
    }
  }
}

// 在父组件中使用
new Vue({
  el: '#app',
  components: {
    'child-component': ChildComponent
  }
})
```

## 组件通信

### Props 传递

```javascript
// 子组件
const ChildComponent = {
  props: ['message', 'user'],
  template: '<div>{{ message }} - {{ user.name }}</div>'
}

// 父组件使用
// <child-component :message="hello" :user="currentUser"></child-component>
```

### 自定义事件

```javascript
// 子组件
const ChildComponent = {
  template: '<button @click="handleClick">点击我</button>',
  methods: {
    handleClick() {
      this.$emit('custom-event', { data: 'some data' })
    }
  }
}

// 父组件使用
// <child-component @custom-event="handleCustomEvent"></child-component>
// methods: {
//   handleCustomEvent(data) {
//     console.log(data)
//   }
// }
```

## 组件生命周期

Vue 2 组件有以下生命周期钩子：

1. **创建阶段**
   - beforeCreate
   - created
   - beforeMount
   - mounted

2. **更新阶段**
   - beforeUpdate
   - updated

3. **销毁阶段**
   - beforeDestroy
   - destroyed

```javascript
const MyComponent = {
  beforeCreate() {
    // 组件实例刚被创建，数据观测和事件配置之前
  },
  created() {
    // 实例创建完成，数据观测、属性和方法的运算，事件回调已配置，但尚未挂载到 DOM
  },
  beforeMount() {
    // 模板编译/挂载之前
  },
  mounted() {
    // 模板编译/挂载之后，可以访问 DOM 元素
  },
  beforeUpdate() {
    // 数据更新前
  },
  updated() {
    // 数据更新后，DOM 已更新
  },
  beforeDestroy() {
    // 实例销毁前
  },
  destroyed() {
    // 实例销毁后
  }
}
```

## 组件高级特性

### 插槽（Slots）

```javascript
// 子组件
const ChildComponent = {
  template: `
    <div>
      <h2>标题</h2>
      <slot>默认内容</slot>
    </div>
  `
}

// 父组件使用
// <child-component>
//   <p>插槽内容</p>
// </child-component>
```

### 动态组件

```javascript
// 父组件
new Vue({
  el: '#app',
  data: {
    currentComponent: 'component-a'
  },
  components: {
    'component-a': { template: '<div>组件 A</div>' },
    'component-b': { template: '<div>组件 B</div>' }
  }
})

// 模板中使用
// <component :is="currentComponent"></component>
```

## 最佳实践

1. **组件拆分**
   - 遵循单一职责原则，一个组件只做一件事
   - 组件大小适中，过大的组件考虑拆分为多个子组件

2. **性能优化**
   - 使用 `v-once` 和 `v-pre` 减少不必要的渲染
   - 使用 `keep-alive` 缓存组件实例
   - 合理使用计算属性和监听器

3. **代码组织**
   - 使用单文件组件（.vue 文件）
   - 组件命名规范统一
   - 合理使用 props 和 events 进行组件通信

4. **可测试性**
   - 组件设计尽量独立，便于单元测试
   - 避免在组件中直接操作全局状态

## 组件库开发规范

### 目录结构

```
components/
  component-name/
    __test__/       # 测试文件
      component.spec.js
    src/            # 组件源码
      index.vue
    styles/         # 样式文件
      index.scss
    index.js        # 组件入口文件
```

### 测试规范

1. 单元测试覆盖率 ≥ 90%
2. 测试文件放在 __test__ 目录下
3. 使用 Jest 或 Mocha 进行测试
4. 测试用例应覆盖：
   - 组件渲染
   - Props 传递
   - 事件触发
   - 插槽内容

## 参考资源

- [Vue 2 官方文档](https://cn.vuejs.org/v2/guide/)
- [Vue 组件设计模式](https://cn.vuejs.org/v2/style-guide/#%E7%BB%84%E4%BB%B6%E5%90%8D%E7%A7%B0-%E5%BF%85%E8%A6%81)
- [Vue 性能优化指南](https://cn.vuejs.org/v2/guide/components-edge-cases.html#%E7%BB%84%E4%BB%B6%E7%BC%93%E5%AD%98-%E5%8A%A8%E6%80%81%E7%BB%84%E4%BB%B6)