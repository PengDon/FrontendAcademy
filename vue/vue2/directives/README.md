# Vue 2 指令系统

## 指令基础

Vue 指令是带有 `v-` 前缀的特殊属性，用于在DOM元素上应用响应式行为。指令的作用是当表达式的值改变时，将某些行为应用到DOM上。

## 内置指令

### 核心指令

#### v-model

用于在表单元素上创建双向数据绑定。

```vue
<template>
  <div>
    <input v-model="message" placeholder="请输入内容">
    <p>输入的内容: {{ message }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: ''
    }
  }
}
</script>
```

#### v-bind

用于动态绑定一个或多个特性，或一个组件 prop 到表达式。

```vue
<template>
  <div>
    <img v-bind:src="imageSrc" :alt="imageAlt">
    <button :class="{ active: isActive }">点击我</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imageSrc: 'path/to/image.jpg',
      imageAlt: '示例图片',
      isActive: true
    }
  }
}
</script>
```

#### v-on

用于监听DOM事件。

```vue
<template>
  <div>
    <button v-on:click="handleClick">点击我</button>
    <input @keyup.enter="handleEnter">
  </div>
</template>

<script>
export default {
  methods: {
    handleClick() {
      console.log('按钮被点击')
    },
    handleEnter() {
      console.log('回车键被按下')
    }
  }
}
</script>
```

#### v-if / v-else-if / v-else

用于条件性地渲染元素。

```vue
<template>
  <div>
    <p v-if="showMessage">显示的消息</p>
    <p v-else-if="showWarning">显示的警告</p>
    <p v-else>默认显示的内容</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showMessage: false,
      showWarning: true
    }
  }
}
</script>
```

#### v-for

用于基于源数据多次渲染元素或模板块。

```vue
<template>
  <div>
    <ul>
      <li v-for="(item, index) in items" :key="item.id">
        {{ index }} - {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { id: 1, name: '项目1' },
        { id: 2, name: '项目2' },
        { id: 3, name: '项目3' }
      ]
    }
  }
}
</script>
```

### 其他内置指令

- **v-show**: 条件渲染元素，通过切换CSS display属性实现
- **v-text**: 更新元素的textContent
- **v-html**: 更新元素的innerHTML
- **v-pre**: 跳过这个元素和它的子元素的编译过程
- **v-once**: 只渲染元素和组件一次
- **v-cloak**: 保持在元素上直到关联实例结束编译

## 自定义指令

Vue 允许注册自定义指令，用于封装对DOM元素的底层操作。

### 全局注册

```javascript
// 注册一个全局自定义指令 v-focus
Vue.directive('focus', {
  // 当被绑定的元素插入到DOM中时
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})
```

### 局部注册

```javascript
export default {
  directives: {
    focus: {
      inserted: function (el) {
        el.focus()
      }
    }
  }
}
```

### 使用自定义指令

```vue
<template>
  <input v-focus placeholder="自动聚焦的输入框">
</template>
```

## 指令钩子函数

自定义指令可以包含多个钩子函数：

1. **bind**: 只调用一次，指令第一次绑定到元素时调用
2. **inserted**: 被绑定元素插入父节点时调用
3. **update**: 所在组件的VNode更新时调用
4. **componentUpdated**: 指令所在组件的VNode及其子VNode全部更新后调用
5. **unbind**: 只调用一次，指令与元素解绑时调用

```javascript
Vue.directive('demo', {
  bind(el, binding, vnode) {
    // 指令第一次绑定到元素时
    console.log('bind', binding.value)
  },
  inserted(el, binding, vnode) {
    // 元素插入到DOM时
    console.log('inserted', binding.value)
  },
  update(el, binding, vnode, oldVnode) {
    // 组件更新时
    console.log('update', binding.value)
  },
  componentUpdated(el, binding, vnode, oldVnode) {
    // 组件更新完成后
    console.log('componentUpdated', binding.value)
  },
  unbind(el, binding, vnode) {
    // 指令解绑时
    console.log('unbind')
  }
})
```

## 指令修饰符

Vue 内置指令提供了一些修饰符，用于改变指令的行为。

### v-model 修饰符

- **.lazy**: 转变为在 change 事件再同步
- **.number**: 自动将输入值转为数值类型
- **.trim**: 自动过滤输入的首尾空白字符

```vue
<template>
  <div>
    <input v-model.lazy="message">
    <input v-model.number="age" type="number">
    <input v-model.trim="username">
  </div>
</template>
```

### v-on 修饰符

- **.stop**: 阻止事件冒泡
- **.prevent**: 阻止默认事件
- **.capture**: 使用事件捕获模式
- **.self**: 只有当事件在该元素本身触发时才触发回调
- **.once**: 只触发一次回调
- **.passive**: 告诉浏览器你不想阻止事件的默认行为

```vue
<template>
  <div>
    <button @click.stop="handleClick">阻止冒泡</button>
    <a href="#" @click.prevent="handleClick">阻止默认行为</a>
    <button @click.once="handleClick">只触发一次</button>
  </div>
</template>
```

## 指令参数

指令可以接受一个参数，在指令名称之后以冒号表示。

```javascript
Vue.directive('color', {
  bind(el, binding) {
    el.style.color = binding.value
  }
})
```

```vue
<template>
  <div>
    <p v-color="textColor">带颜色的文本</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      textColor: 'red'
    }
  }
}
</script>
```

## 动态参数

Vue 2.6.0+ 支持动态指令参数。

```vue
<template>
  <div>
    <a v-bind:[attributeName]="url">链接</a>
    <button v-on:[eventName]="handleClick">动态事件</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      attributeName: 'href',
      url: 'https://example.com',
      eventName: 'click'
    }
  },
  methods: {
    handleClick() {
      console.log('点击事件触发')
    }
  }
}
</script>
```

## 最佳实践

1. **何时使用自定义指令**
   - 当你需要对DOM进行底层操作时
   - 当你需要重用DOM操作逻辑时
   - 当普通组件不能满足需求时

2. **指令与组件的选择**
   - 优先使用组件，组件是Vue的主要抽象
   - 当你只需要简单的DOM操作时使用指令
   - 当你需要复杂的模板和逻辑时使用组件

3. **性能考虑**
   - 避免在指令钩子中进行大量计算
   - 合理使用指令修饰符提高代码可读性
   - 避免在指令中直接操作其他组件的状态

## 参考资源

- [Vue 2 指令文档](https://cn.vuejs.org/v2/api/#%E6%8C%87%E4%BB%A4)
- [Vue 自定义指令](https://cn.vuejs.org/v2/guide/custom-directive.html)