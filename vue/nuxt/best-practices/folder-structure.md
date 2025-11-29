# Nuxt.js 目录结构最佳实践

## 目录

- [通用项目结构](#通用项目结构)
- [中小型项目结构](#中小型项目结构)
- [大型项目结构](#大型项目结构)
- [企业级项目结构](#企业级项目结构)
- [模块化组织](#模块化组织)
- [文件命名规范](#文件命名规范)
- [最佳实践总结](#最佳实践总结)

## 通用项目结构

一个标准的 Nuxt 3/4 项目应该遵循以下目录结构：

```
my-nuxt-app/
├── app/                    # 应用源码
│   ├── components/         # 可复用组件
│   ├── composables/        # 组合式函数
│   ├── layouts/            # 布局组件
│   ├── pages/              # 页面组件
│   ├── plugins/            # 插件
│   └── app.vue             # 根应用组件
├── assets/                 # 未编译的资源文件
│   ├── css/                # 样式文件
│   └── images/             # 图片资源
├── public/                 # 静态资源文件
├── server/                 # 服务端代码
│   ├── api/                # API 路由
│   └── middleware/         # 服务端中间件
├── composables/            # 全局组合式函数
├── components/             # 全局组件
├── layouts/                # 全局布局
├── pages/                  # 全局页面
├── utils/                  # 工具函数
├── types/                  # TypeScript 类型定义
├── modules/                # 自定义模块
├── nuxt.config.ts          # Nuxt 配置文件
└── package.json            # 项目依赖
```

## 中小型项目结构

对于中小型项目，可以采用扁平化的结构：

```
my-small-app/
├── app/
│   ├── components/
│   │   ├── Header.vue
│   │   ├── Footer.vue
│   │   ├── Button.vue
│   │   └── Card.vue
│   ├── composables/
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   └── useProducts.ts
│   ├── layouts/
│   │   ├── default.vue
│   │   └── admin.vue
│   ├── pages/
│   │   ├── index.vue
│   │   ├── about.vue
│   │   ├── products/
│   │   │   ├── index.vue
│   │   │   └── [id].vue
│   │   └── admin/
│   │       ├── index.vue
│   │       └── users.vue
│   ├── plugins/
│   │   └── axios.ts
│   └── app.vue
├── assets/
│   ├── css/
│   │   └── main.css
│   └── images/
│       ├── logo.png
│       └── banner.jpg
├── public/
│   ├── favicon.ico
│   └── robots.txt
├── server/
│   ├── api/
│   │   ├── products.get.ts
│   │   ├── products.post.ts
│   │   └── users.get.ts
│   └── middleware/
│       └── auth.ts
├── nuxt.config.ts
└── package.json
```

## 大型项目结构

对于大型项目，建议按功能模块划分：

```
my-large-app/
├── app/
│   ├── modules/            # 功能模块
│   │   ├── user/           # 用户模块
│   │   │   ├── components/
│   │   │   │   ├── UserProfile.vue
│   │   │   │   └── UserList.vue
│   │   │   ├── composables/
│   │   │   │   └── useUser.ts
│   │   │   ├── pages/
│   │   │   │   ├── profile.vue
│   │   │   │   └── settings.vue
│   │   │   └── types/
│   │   │       └── user.d.ts
│   │   ├── product/        # 产品模块
│   │   │   ├── components/
│   │   │   ├── composables/
│   │   │   ├── pages/
│   │   │   └── types/
│   │   └── order/          # 订单模块
│   │       ├── components/
│   │       ├── composables/
│   │       ├── pages/
│   │       └── types/
│   ├── components/
│   │   ├── global/
│   │   └── shared/
│   ├── composables/
│   │   ├── global/
│   │   └── shared/
│   ├── layouts/
│   ├── app.vue
├── assets/
├── public/
├── server/
│   ├── api/
│   │   ├── modules/
│   │   │   ├── user/
│   │   │   ├── product/
│   │   │   └── order/
│   │   └── shared/
│   └── middleware/
├── utils/
├── types/
├── modules/
├── nuxt.config.ts
└── package.json
```

## 企业级项目结构

对于企业级项目，可以采用更复杂的分层结构：

```
my-enterprise-app/
├── app/
│   ├── modules/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── user-management/
│   │   ├── product-catalog/
│   │   ├── order-processing/
│   │   ├── payment/
│   │   ├── analytics/
│   │   └── reporting/
│   ├── components/
│   │   ├── ui/             # UI 组件库
│   │   ├── layout/         # 布局组件
│   │   └── shared/         # 共享组件
│   ├── composables/
│   │   ├── api/            # API 相关组合式函数
│   │   ├── state/          # 状态管理组合式函数
│   │   └── utils/          # 工具组合式函数
│   ├── layouts/
│   ├── app.vue
├── assets/
│   ├── styles/
│   │   ├── base/           # 基础样式
│   │   ├── components/     # 组件样式
│   │   ├── layout/         # 布局样式
│   │   └── themes/         # 主题样式
│   └── images/
├── public/
├── server/
│   ├── api/
│   │   ├── v1/
│   │   ├── v2/
│   │   └── internal/
│   ├── middleware/
│   ├── routes/
│   └── utils/
├── utils/
├── types/
├── modules/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/
├── scripts/
├── nuxt.config.ts
└── package.json
```

## 模块化组织

### 按功能模块组织

```
modules/
├── user/
│   ├── components/
│   ├── composables/
│   ├── pages/
│   ├── types/
│   ├── utils/
│   └── index.ts
├── product/
└── order/
```

### 按技术层次组织

```
components/
├── atoms/          # 原子组件（按钮、输入框等）
├── molecules/      # 分子组件（表单、卡片等）
├── organisms/      # 组织组件（页眉、页脚等）
└── templates/      # 模板组件
```

## 文件命名规范

### 组件文件命名

```
// 好的命名
components/
├── Button.vue
├── UserProfile.vue
├── ProductCard.vue
└── NavigationMenu.vue

// 避免的命名
components/
├── button.vue
├── user-profile.vue
├── product_card.vue
└── navigation-menu.vue
```

### 页面文件命名

```
pages/
├── index.vue           # 首页
├── about.vue           # 关于页面
├── products/
│   ├── index.vue       # 产品列表
│   └── [id].vue        # 产品详情
└── users/
    └── [id]/
        └── index.vue   # 用户主页
```

### 组合式函数命名

```
composables/
├── useAuth.ts          # 认证相关
├── useCart.ts          # 购物车相关
├── useProducts.ts      # 产品相关
└── useBreakpoints.ts   # 断点相关
```

## 最佳实践总结

### 1. 保持一致性

在整个项目中保持命名和组织结构的一致性：

```bash
# 好的做法
components/
├── Button.vue
├── Card.vue
└── Modal.vue

composables/
├── useAuth.ts
├── useCart.ts
└── useProducts.ts

# 避免混合风格
components/
├── Button.vue
├── card.vue        # 不一致的命名
└── MyModal.vue     # 不一致的前缀
```

### 2. 合理分层

根据项目规模选择合适的分层方式：

- **小项目**: 扁平结构
- **中项目**: 按功能分组
- **大项目**: 模块化结构

### 3. 明确职责

每个目录应该有明确的职责：

```
# 好的职责分离
components/     # 可复用的UI组件
composables/    # 可复用的逻辑函数
layouts/        # 页面布局组件
pages/          # 路由页面组件
plugins/        # 应用插件
utils/          # 工具函数
types/          # 类型定义
```

### 4. 文档化结构

在项目README中说明目录结构：

```markdown
## 项目结构

```
my-nuxt-app/
├── app/            # 应用源码
├── assets/         # 静态资源
├── public/         # 公共文件
├── server/         # 服务端代码
└── ...
```

- `app/` - 包含所有应用相关的源代码
- `assets/` - 包含需要预处理的静态资源
- `public/` - 包含直接复制的静态文件
- `server/` - 包含服务端API和中间件
```

通过遵循这些目录结构最佳实践，可以创建出清晰、可维护和可扩展的 Nuxt.js 应用。