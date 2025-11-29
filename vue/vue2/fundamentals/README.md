# Vue 2 基础入门

## Vue 简介

Vue (发音为 /vjuː/，类似 **view**) 是一款用于构建用户界面的 JavaScript 框架。它基于标准 HTML、CSS 和 JavaScript 构建，并提供了一套声明式的、组件化的编程模型，帮助你高效地开发用户界面，无论是简单还是复杂的界面。

## 安装与环境配置

### CDN 引入

```html
<!-- 开发环境版本，包含了有帮助的命令行警告 -->
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>

<!-- 生产环境版本，优化了尺寸和速度 -->
<script src="https://cdn.jsdelivr.net/npm/vue"></script>
```

### NPM 安装

```bash
# 安装 Vue 2
npm install vue@2
```

### 项目初始化

使用 Vue CLI 创建项目：

```bash
# 全局安装 Vue CLI
npm install -g @vue/cli

# 创建新项目
vue create my-project

# 或者使用可视化界面
vue ui
```

## 创建 Vue 实例

每个 Vue 应用都是通过用 `Vue` 函数创建一个新的 **Vue 实例** 开始的：

```javascript
var vm = new Vue({
  // 选项
})
```

### 基本选项

#### el

挂载点，指定 Vue 实例管理的 DOM 元素：

```javascript
new Vue({
  el: '#app' // 可以是 CSS 选择器或 DOM 元素
})
```

#### data

Vue 实例的数据对象，响应式数据源：

```javascript
new Vue({
  data: {
    message: 'Hello Vue!',
    count: 0,
    items: [1, 2, 3]
  }
})
```

#### methods

定义 Vue 实例的方法：

```javascript
new Vue({
  data: {
    count: 0
  },
  methods: {
    increment() {
      this.count++
    },
    greet(name) {
      return `Hello, ${name}!`
    }
  }
})
```

#### computed

计算属性，基于其他属性计算而来，会被缓存：

```javascript
new Vue({
  data: {
    message: 'Hello'
  },
  computed: {
    // 计算属性的 getter
    reversedMessage() {
      return this.message.split('').reverse().join('')
    }
  }
})
```

#### watch

侦听器，观察和响应 Vue 实例上的数据变化：

```javascript
new Vue({
  data: {
    question: '',
    answer: 'I cannot give you an answer until you ask a question!'
  },
  watch: {
    // 每当 question 发生变化时，这个函数就会执行
    question(newQuestion, oldQuestion) {
      this.answer = 'Waiting for you to stop typing...'
      this.debouncedGetAnswer()
    }
  },
  methods: {
    debouncedGetAnswer: _.debounce(function () {
      if (this.question.indexOf('?') > -1) {
        this.answer = 'Thinking...'
        // 模拟 API 调用
      }
    }, 500)
  }
})
```

## 模板语法

### 文本插值

```html
<div id="app">
  <p>{{ message }}</p>
</div>
```

### 原始 HTML

```html
<div v-html="rawHtml"></div>
```

### 表达式

```html
<div>
  {{ number + 1 }}
  {{ ok ? 'YES' : 'NO' }}
  {{ message.split('').reverse().join('') }}
</div>
```

### 指令

```html
<p v-if="seen">现在你看到我了</p>
<button v-on:click="toggleSeen">切换显示</button>
```

### 缩写

- `v-bind:` 可以缩写为 `:`
- `v-on:` 可以缩写为 `@`

```html
<a :href="url">链接</a>
<button @click="handleClick">点击我</button>
```

## 生命周期钩子

Vue 实例有一个完整的生命周期，从开始创建、初始化数据、编译模板、挂载 DOM、渲染、更新到卸载，在这个过程中会自动运行一些叫做**生命周期钩子**的函数，这给了用户在不同阶段添加自己的代码的机会。

```javascript
new Vue({
  data: {
    message: 'Hello Vue!'
  },
  beforeCreate() {
    // 实例刚刚被创建，组件属性计算之前
    console.log('beforeCreate: ', this.message) // undefined
  },
  created() {
    // 实例已经创建完成，属性已绑定，但DOM还未生成
    console.log('created: ', this.message) // 'Hello Vue!'
  },
  beforeMount() {
    // 模板编译/挂载之前
    console.log('beforeMount: ', this.$el) // undefined
  },
  mounted() {
    // 模板编译/挂载之后
    console.log('mounted: ', this.$el) // DOM 元素
  },
  beforeUpdate() {
    // 数据更新前
    console.log('beforeUpdate: ', this.message)
  },
  updated() {
    // 数据更新后，DOM已更新
    console.log('updated: ', this.message)
  },
  beforeDestroy() {
    // 实例销毁前
    console.log('beforeDestroy')
  },
  destroyed() {
    // 实例销毁后
    console.log('destroyed')
  }
})
```

## 数据绑定

### 单向绑定

```html
<!-- 从数据到视图 -->
<div>{{ message }}</div>
<div :title="message"></div>
```

### 双向绑定

```html
<!-- 使用 v-model 实现双向绑定 -->
<input v-model="message">
<p>消息是: {{ message }}</p>
```

## 数组操作方法

Vue 包装了数组的一些方法，使它们也触发视图更新：

- **变异方法**（会改变原始数组）：
  - `push()`
  - `pop()`
  - `shift()`
  - `unshift()`
  - `splice()`
  - `sort()`
  - `reverse()`

- **非变异方法**（不会改变原始数组，而是返回一个新数组）：
  - `filter()`
  - `concat()`
  - `slice()`

```javascript
// 示例：使用变异方法
vm.items.push({ message: 'B' })

// 示例：使用非变异方法
vm.items = vm.items.filter(function (item) {
  return item.message.match(/A/)
})
```

## 组件基础

### 全局组件注册

```javascript
Vue.component('todo-item', {
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})
```

### 使用组件

```html
<div id="app">
  <ol>
    <todo-item v-for="item in groceryList" v-bind:todo="item" v-bind:key="item.id"></todo-item>
  </ol>
</div>

<script>
new Vue({
  el: '#app',
  data: {
    groceryList: [
      { id: 0, text: '蔬菜' },
      { id: 1, text: '奶酪' },
      { id: 2, text: '其他人类食物' }
    ]
  }
})
</script>
```

## 最佳实践

1. **数据驱动**
   - 让数据驱动视图，避免直接操作DOM
   - 使用计算属性而不是在模板中进行复杂计算

2. **组件化开发**
   - 将UI拆分为可重用的组件
   - 遵循单一职责原则

3. **性能优化**
   - 使用 `v-for` 时总是提供 `key` 属性
   - 使用 `keep-alive` 缓存组件
   - 避免在模板中使用过于复杂的表达式

4. **代码组织**
   - 使用单文件组件（.vue 文件）
   - 合理组织组件结构

## 参考资源

- [Vue 2 官方文档](https://cn.vuejs.org/v2/guide/)
- [Vue 2 API 参考](https://cn.vuejs.org/v2/api/)
- [Vue 风格指南](https://cn.vuejs.org/v2/style-guide/)