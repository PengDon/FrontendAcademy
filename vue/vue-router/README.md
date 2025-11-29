# Vue Router 详解

## 基本使用

### 安装与配置

```bash
# 通过 npm 安装
npm install vue-router@4 # Vue 3 版本
# 或 npm install vue-router@3 # Vue 2 版本
```

```javascript
// 创建路由实例 - Vue 3
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

// 在应用中使用
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')

// 创建路由实例 - Vue 2
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
```

### 路由视图与链接

```vue
<!-- App.vue -->
<template>
  <div id="app">
    <nav>
      <router-link to="/">首页</router-link>
      <router-link to="/about">关于</router-link>
    </nav>
    <router-view />
  </div>
</template>
```

## 路由配置详解

### 动态路由匹配

```javascript
const routes = [
  // 动态路径参数，以冒号开头
  { path: '/user/:id', component: User },
  // 多个路径参数
  { path: '/user/:id/post/:postId', component: UserPost },
  // 可选参数 (Vue Router 4)
  { path: '/user/:id?', component: User },
  // 带正则表达式的参数 (Vue Router 4)
  { path: '/user/:id(\d+)', component: User },
  // 多个匹配模式 (Vue Router 4)
  { path: '/users', component: Users, alias: '/people' },
  // 嵌套路由
  {
    path: '/user/:id',
    component: User,
    children: [
      // 当 /user/:id 匹配成功，UserProfile 将被渲染在 User 的 <router-view> 中
      { path: 'profile', component: UserProfile },
      // 当 /user/:id/posts 匹配成功，UserPosts 将被渲染在 User 的 <router-view> 中
      { path: 'posts', component: UserPosts }
    ]
  }
]
```

### 编程式导航

```javascript
// 字符串路径
router.push('/users/eduardo')

// 命名的路由，并加上参数，让路由建立 url
router.push({ name: 'user', params: { username: 'eduardo' } })

// 带查询参数，结果是 /register?plan=private
router.push({ path: '/register', query: { plan: 'private' } })

// 带 hash，结果是 /about#team
router.push({ path: '/about', hash: '#team' })

// 返回上一页
router.back()

// 前进一页
router.forward()

// 前进或后退指定步数
router.go(1) // 前进一页
router.go(-1) // 后退一页
```

### 命名视图

```javascript
const routes = [
  {
    path: '/',
    // 命名视图组件
    components: {
      default: Home,
      a: HomeSidebar,
      b: HomeFooter
    }
  },
  {
    path: '/user/:id',
    components: {
      default: User,
      a: UserProfile,
      b: UserPosts
    }
  }
]
```

```vue
<template>
  <div id="app">
    <router-view />
    <router-view name="a" class="left" />
    <router-view name="b" class="right" />
  </div>
</template>
```

## 路由守卫

### 全局守卫

```javascript
// 全局前置守卫
router.beforeEach((to, from, next) => {
  // to: 即将要进入的目标路由对象
  // from: 当前导航正要离开的路由
  // next: 函数，决定接下来的导航行为
  
  // 检查用户是否已登录
  if (to.path !== '/login' && !isAuthenticated) {
    next('/login')
  } else {
    next() // 正常放行
  }
})

// 全局解析守卫
router.beforeResolve((to, from, next) => {
  // 在所有组件内守卫和异步路由组件被解析之后调用
  next()
})

// 全局后置钩子
router.afterEach((to, from) => {
  // 导航完成后调用，不接收 next 函数
  // 常用于修改页面标题、添加页面访问记录等
  document.title = to.meta.title || '默认标题'
})
```

### 路由独享守卫

```javascript
const routes = [
  {
    path: '/user/:id',
    component: User,
    beforeEnter: (to, from, next) => {
      // 可以访问 this 组件实例
      // 只在访问该路由时触发
      next()
    }
  }
]
```

### 组件内守卫

```javascript
export default {
  // 路由进入组件之前
  beforeRouteEnter(to, from, next) {
    // 不能访问 this，组件实例还没被创建
    // 但可以通过回调函数访问组件实例
    next(vm => {
      // vm 就是组件实例
      console.log(vm.data)
    })
  },
  
  // 路由更新时 (动态参数改变)
  beforeRouteUpdate(to, from, next) {
    // 可以访问 this
    this.id = to.params.id
    next()
  },
  
  // 路由离开组件时
  beforeRouteLeave(to, from, next) {
    // 可以访问 this
    // 用于确认对话框
    if (this.hasUnsavedChanges) {
      const confirmLeave = window.confirm('您有未保存的更改，确定要离开吗？')
      if (confirmLeave) {
        next()
      } else {
        next(false) // 取消导航
      }
    } else {
      next()
    }
  }
}
```

## 路由元信息

```javascript
const routes = [
  {
    path: '/admin',
    component: Admin,
    meta: {
      requiresAuth: true,
      roles: ['admin', 'editor'],
      title: '管理面板'
    }
  },
  {
    path: '/public',
    component: Public,
    meta: {
      requiresAuth: false,
      title: '公共页面'
    }
  }
]

// 在全局守卫中使用元信息
router.beforeEach((to, from, next) => {
  // 检查页面标题
  document.title = to.meta.title || '默认标题'
  
  // 检查权限
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.roles && to.meta.roles.indexOf(currentUser.role) === -1) {
    next('/unauthorized')
  } else {
    next()
  }
})
```

## 动态导入与懒加载

```javascript
const routes = [
  // 常规导入
  { path: '/about', component: About },
  
  // 动态导入 (懒加载)
  {
    path: '/user/:id',
    // 路由级代码拆分
    // 这会生成一个独立的块 (User.[hash].js)
    // 当访问该路由时才会加载
    component: () => import('../views/User.vue')
  },
  
  // 分组懒加载 - 将多个路由组件打包到同一个 chunk 中
  {
    path: '/grouped1',
    component: () => import(/* webpackChunkName: "group-example" */ '../views/Group1.vue')
  },
  {
    path: '/grouped2',
    component: () => import(/* webpackChunkName: "group-example" */ '../views/Group2.vue')
  }
]
```

## 导航故障处理

```javascript
// 捕获导航错误
router.push('/admin').catch(err => {
  // 导航被取消
  if (err.name === 'NavigationDuplicated') {
    console.log('重复导航，已被忽略')
  } else if (err.name === 'NavigationAborted') {
    console.log('导航被中止')
  } else {
    console.error('导航错误:', err)
  }
})
```

## 滚动行为

```javascript
const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    // savedPosition 只有在通过浏览器前进/后退按钮导航时才可用
    if (savedPosition) {
      return savedPosition
    } else {
      // 默认滚动到顶部
      return { top: 0 }
    }
  },
  routes
})

// 更复杂的滚动行为
const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    // 如果有 hash，则滚动到 hash 位置
    if (to.hash) {
      return {
        selector: to.hash,
        // 滚动到元素的顶部偏移 100px
        offset: { top: 100, left: 0 }
      }
    } else if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
  routes
})
```

## 常见问题与答案

### 1. 如何在组件中获取路由参数？
**答案：**
```javascript
// Vue 3 Composition API
import { useRoute } from 'vue-router'

export default {
  setup() {
    const route = useRoute()
    // 访问路由参数
    console.log(route.params.id)
    console.log(route.query.sort)
    
    return { route }
  }
}

// Vue 2 Options API
export default {
  computed: {
    id() {
      return this.$route.params.id
    },
    sortQuery() {
      return this.$route.query.sort
    }
  }
}
```

### 2. 如何实现嵌套路由？
**答案：** 嵌套路由通过在父路由配置中添加 `children` 数组来实现。父组件需要包含 `<router-view>` 来渲染子路由组件。

```javascript
const routes = [
  {
    path: '/user/:id',
    component: User,
    children: [
      { path: '', component: UserHome }, // 默认子路由
      { path: 'profile', component: UserProfile },
      { path: 'posts', component: UserPosts }
    ]
  }
]
```

### 3. 如何处理 404 页面？
**答案：** 使用通配符 `*` 来捕获所有未匹配的路由，并将其重定向到 404 页面。

```javascript
const routes = [
  // 其他路由
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
]
```

### 4. Vue Router 中有哪些导航模式？
**答案：** Vue Router 支持两种导航模式：
- `history` 模式：使用 HTML5 History API，URL 更加美观，但需要服务器配置
- `hash` 模式：使用 URL hash，兼容性更好，但 URL 中会有 `#` 符号

### 5. 如何解决 history 模式下的部署问题？
**答案：** 服务器需要配置，将所有请求转发到 index.html，这样 Vue Router 才能正确处理路由。

```nginx
server {
  listen 80;
  server_name example.com;
  root /path/to/dist;
  
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

### 6. 如何动态添加路由？
**答案：** 使用 `router.addRoute()` 方法动态添加路由。

```javascript
// 添加单个路由
router.addRoute({
  path: '/dynamic',
  component: DynamicComponent
})

// 添加子路由
router.addRoute('parentRouteName', {
  path: 'child',
  component: ChildComponent
})
```

### 7. 如何实现路由的权限控制？
**答案：** 可以通过全局前置守卫结合路由元信息实现权限控制。

```javascript
router.beforeEach((to, from, next) => {
  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    // 检查用户是否已登录
    if (isAuthenticated()) {
      // 检查用户角色
      if (to.meta.roles && !to.meta.roles.includes(currentUser.role)) {
        next('/unauthorized')
      } else {
        next()
      }
    } else {
      next('/login')
    }
  } else {
    next()
  }
})
```

### 8. 如何监听路由变化？
**答案：**

```javascript
// Vue 3 Composition API
import { useRouter, watch } from 'vue'

export default {
  setup() {
    const router = useRouter()
    
    // 监听当前路由变化
    watch(() => router.currentRoute.value, (newRoute, oldRoute) => {
      console.log('路由变化:', newRoute.path)
    }, { deep: true })
  }
}

// Vue 2 Options API
export default {
  watch: {
    '$route'(to, from) {
      console.log('路由变化:', to.path)
    }
  }
}
```