# Vuex 状态管理

## Vuex 简介

Vuex 是一个专为 Vue.js 应用程序开发的**状态管理模式**。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。

## 什么情况下应该使用 Vuex？

Vuex 可以帮助我们管理共享状态，并附带了更多的概念和框架。这需要对短期和长期效益进行权衡。

如果您不打算开发大型单页应用，使用 Vuex 可能是繁琐冗余的。确实是如此——如果您的应用够简单，您最好不要使用 Vuex。一个简单的 [store 模式](https://cn.vuejs.org/v2/guide/state-management.html#%E7%AE%80%E5%8D%95%E7%9A%84%E5%BA%93%E6%A8%A1%E5%BC%8F) 就足够您所需了。但是，如果您需要构建一个中大型单页应用，您很可能会考虑如何更好地在组件外部管理状态，Vuex 将会成为自然而然的选择。

## 安装 Vuex

### NPM 安装

```bash
# Vue 2.x 对应的 Vuex 版本是 3.x
npm install vuex@3 --save
```

### CDN 引入

```html
<script src="https://unpkg.com/vuex@3/dist/vuex.js"></script>
```

## Vuex 核心概念

### State

State 是 Vuex 的单一状态树，存储着应用的所有状态。

```javascript
// 创建一个新的 store 实例
const store = new Vuex.Store({
  state: {
    count: 0,
    todos: [
      { id: 1, text: '学习 Vue', done: true },
      { id: 2, text: '学习 Vuex', done: false }
    ]
  }
})
```

在 Vue 组件中访问 State：

```javascript
// 方式一：在计算属性中直接使用
computed: {
  count() {
    return this.$store.state.count
  }
}

// 方式二：使用 mapState 辅助函数
import { mapState } from 'vuex'

export default {
  // ...
  computed: mapState({
    // 箭头函数可使代码更简练
    count: state => state.count,
    
    // 传字符串参数 'count' 等同于 `state => state.count`
    countAlias: 'count',
    
    // 为了能够使用 `this` 获取局部状态，必须使用常规函数
    countPlusLocalState(state) {
      return state.count + this.localCount
    }
  })
}
```

### Getters

Getters 用于从 store 中的 state 派生出一些状态。

```javascript
const store = new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: '学习 Vue', done: true },
      { id: 2, text: '学习 Vuex', done: false }
    ]
  },
  getters: {
    // 获取已完成的待办事项
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    },
    // 根据 ID 获取待办事项
    getTodoById: (state) => (id) => {
      return state.todos.find(todo => todo.id === id)
    }
  }
})
```

在 Vue 组件中访问 Getters：

```javascript
// 方式一：直接使用
computed: {
  doneTodosCount() {
    return this.$store.getters.doneTodos
  }
}

// 方式二：使用 mapGetters 辅助函数
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
    // 使用对象展开运算符将 getters 混入 computed 对象中
    ...mapGetters([
      'doneTodos',
      'getTodoById' // 注意：这种方式无法传递参数
    ]),
    // 也可以使用对象形式，为 getters 取别名
    ...mapGetters({
      completedTodos: 'doneTodos'
    })
  }
}
```

### Mutations

Mutations 是唯一可以修改状态的地方，必须是同步函数。

```javascript
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment(state) {
      // 变更状态
      state.count++
    },
    incrementBy(state, payload) {
      state.count += payload.amount
    }
  }
})
```

提交 Mutation：

```javascript
// 方式一：直接提交
store.commit('increment')

// 提交载荷
store.commit('incrementBy', { amount: 10 })

// 或者使用对象风格的提交方式
store.commit({
  type: 'incrementBy',
  amount: 10
})

// 方式二：在组件中使用 this.$store.commit
methods: {
  handleIncrement() {
    this.$store.commit('increment')
  }
}

// 方式三：使用 mapMutations 辅助函数
import { mapMutations } from 'vuex'

export default {
  // ...
  methods: {
    ...mapMutations([
      'increment', // 将 `this.increment()` 映射为 `this.$store.commit('increment')`
      'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.commit('incrementBy', amount)`
    ]),
    ...mapMutations({
      add: 'increment' // 将 `this.add()` 映射为 `this.$store.commit('increment')`
    })
  }
}
```

### Actions

Actions 类似于 Mutations，但是可以包含异步操作。

```javascript
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment(state) {
      state.count++
    }
  },
  actions: {
    increment(context) {
      context.commit('increment')
    },
    // 解构 context
    incrementAsync({ commit }) {
      return new Promise((resolve) => {
        setTimeout(() => {
          commit('increment')
          resolve()
        }, 1000)
      })
    },
    // 处理异步操作并提交多个 mutation
    fetchTodos({ commit }) {
      return api.getTodos().then((todos) => {
        commit('setTodos', todos)
        return todos
      })
    }
  }
})
```

分发 Action：

```javascript
// 方式一：直接分发
store.dispatch('increment')

// 分发带载荷的 Action
store.dispatch('incrementAsync', { amount: 10 })

// 以对象形式分发
store.dispatch({
  type: 'incrementAsync',
  amount: 10
})

// 方式二：在组件中使用 this.$store.dispatch
methods: {
  handleIncrementAsync() {
    this.$store.dispatch('incrementAsync')
  }
}

// 方式三：使用 mapActions 辅助函数
import { mapActions } from 'vuex'

export default {
  // ...
  methods: {
    ...mapActions([
      'increment', // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`
      'incrementAsync' // 将 `this.incrementAsync()` 映射为 `this.$store.dispatch('incrementAsync')`
    ]),
    ...mapActions({
      add: 'increment' // 将 `this.add()` 映射为 `this.$store.dispatch('increment')`
    })
  }
}
```

### Modules

Modules 允许我们将 store 分割成模块，每个模块都有自己的 state、mutation、action 和 getter。

```javascript
// 模块 A
const moduleA = {
  state: {
    count: 0
  },
  mutations: {
    increment(state) {
      state.count++
    }
  },
  actions: {
    incrementIfOddOnRootSum({ state, commit, rootState }) {
      if ((state.count + rootState.count) % 2 === 1) {
        commit('increment')
      }
    }
  },
  getters: {
    doubleCount(state) {
      return state.count * 2
    }
  }
}

// 模块 B
const moduleB = {
  namespaced: true, // 开启命名空间
  state: {
    count: 0
  },
  mutations: {
    increment(state) {
      state.count++
    }
  },
  actions: {
    incrementIfOddOnRootSum({ state, commit, rootState }) {
      if ((state.count + rootState.count) % 2 === 1) {
        commit('increment')
      }
    }
  },
  getters: {
    doubleCount(state, getters, rootState, rootGetters) {
      return state.count * 2 + rootState.count
    }
  }
}

// 创建 store
const store = new Vuex.Store({
  state: {
    count: 10
  },
  modules: {
    a: moduleA,
    b: moduleB
  }
})
```

使用模块：

```javascript
// 访问模块状态
store.state.a.count // -> 0
store.state.b.count // -> 0

// 访问命名空间模块的 getter
store.getters['b/doubleCount'] // -> 0

// 提交命名空间模块的 mutation
store.commit('b/increment')

// 分发命名空间模块的 action
store.dispatch('b/incrementIfOddOnRootSum')

// 在组件中使用辅助函数访问命名空间模块
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  computed: {
    // 模块 A 的状态（非命名空间）
    ...mapState({
      aCount: state => state.a.count
    }),
    // 模块 B 的状态（命名空间）
    ...mapState('b', {
      bCount: state => state.count
    }),
    // 模块 B 的 getter（命名空间）
    ...mapGetters('b', ['doubleCount'])
  },
  methods: {
    // 模块 B 的 mutation（命名空间）
    ...mapMutations('b', ['increment']),
    // 模块 B 的 action（命名空间）
    ...mapActions('b', ['incrementIfOddOnRootSum'])
  }
}
```

## 项目结构

推荐的 Vuex 项目结构：

```
├── store/
│   ├── index.js          # 导出 store 的主文件
│   ├── actions.js        # 根级别的 action
│   ├── mutations.js      # 根级别的 mutation
│   ├── getters.js        # 根级别的 getter
│   └── modules/
│       ├── cart.js       # 购物车模块
│       └── products.js   # 产品模块
```

index.js 示例：

```javascript
import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'
import cart from './modules/cart'
import products from './modules/products'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0
  },
  actions,
  mutations,
  getters,
  modules: {
    cart,
    products
  }
})
```

## 最佳实践

1. **状态设计原则**
   - 单一数据源：整个应用的状态应该集中在一个 store 中
   - 状态是只读的：唯一改变状态的方法是提交 mutation
   - 使用 mutations 进行同步操作，actions 进行异步操作

2. **模块化**
   - 对于大型应用，使用 modules 分割状态
   - 合理使用命名空间，避免命名冲突

3. **性能优化**
   - 使用 Vuex 的辅助函数，简化代码
   - 避免在 getter 中进行复杂计算
   - 对于大型列表，考虑使用虚拟滚动

4. **调试与工具**
   - 使用 Vue DevTools 进行状态调试
   - 添加严格模式，在开发环境下帮助发现问题

## 调试工具

Vuex 集成了官方的 [Vue DevTools](https://github.com/vuejs/vue-devtools)，提供了高级的调试功能：

- 时间旅行调试
- 状态快照
- 导出/导入状态
- 实时编辑状态

## 参考资源

- [Vuex 官方文档](https://vuex.vuejs.org/zh/)
- [Vue.js 状态管理](https://cn.vuejs.org/v2/guide/state-management.html)