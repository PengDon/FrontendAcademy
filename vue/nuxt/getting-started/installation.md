# Nuxt.js 安装和环境配置

## 系统要求

在开始使用 Nuxt.js 之前，请确保您的开发环境满足以下要求：

- **Node.js**: 版本 16.10 或更高
- **npm**: 版本 6.0 或更高（通常随 Node.js 一起安装）
- **文本编辑器**: 推荐使用 VS Code
- **终端**: 任何现代终端程序

## 创建新项目

### 使用 create-nuxt-app（适用于 Nuxt 2 和 Nuxt 3）

```bash
npx create-nuxt-app <project-name>
```

按照提示选择配置选项：

1. 项目名称
2. 项目描述
3. 作者信息
4. 选择编程语言（JavaScript/TypeScript）
5. 选择包管理器（npm/yarn/pnpm）
6. 选择 UI 框架
7. 选择服务端框架
8. 选择 Nuxt.js 模块
9. 选择 linting 工具
10. 选择测试框架
11. 选择渲染模式（Universal/SPA）
12. 选择部署目标

### 使用 nuxi（推荐用于 Nuxt 3 和 Nuxt 4）

```bash
npx nuxi@latest init <project-name>
```

这将创建一个最小的 Nuxt 项目结构。

### 使用模板

可以从 GitHub 上的模板创建项目：

```bash
# 克隆模板仓库
git clone https://github.com/nuxt/starter.git <project-name>
cd <project-name>
npm install
```

## 手动安装

如果您想从头开始创建项目，可以手动安装：

```bash
# 创建项目目录
mkdir my-nuxt-app
cd my-nuxt-app

# 初始化 package.json
npm init -y

# 安装 Nuxt.js
npm install nuxt@latest

# 创建基本文件结构
mkdir app app/pages app/components app/layouts
touch app/app.vue nuxt.config.ts
```

创建 `app/app.vue`:

```vue
<template>
  <div>
    <NuxtPage />
  </div>
</template>
```

创建 `app/pages/index.vue`:

```vue
<template>
  <div>
    <h1>欢迎使用 Nuxt.js!</h1>
  </div>
</template>
```

创建 `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  // Nuxt 配置项
})
```

更新 `package.json`:

```json
{
  "private": true,
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "generate": "nuxt generate",
    "preview": "nuxt preview"
  },
  "devDependencies": {
    "nuxt": "^3.0.0"
  }
}
```

## 开发环境配置

### VS Code 配置

推荐安装以下 VS Code 扩展：

1. **Volar** - Vue 官方语言支持
2. **ESLint** - JavaScript/TypeScript linting
3. **Prettier** - 代码格式化
4. **Auto Import** - 自动导入组件和组合式函数

创建 `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[vue]": {
    "editor.defaultFormatter": "Vue.volar"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### TypeScript 配置

创建 `tsconfig.json`:

```json
{
  "extends": "./.nuxt/tsconfig.json"
}
```

### ESLint 配置

创建 `.eslintrc.js`:

```javascript
module.exports = {
  extends: [
    '@nuxtjs/eslint-config-typescript'
  ]
}
```

安装依赖：

```bash
npm install -D @nuxtjs/eslint-config-typescript eslint
```

## 环境变量配置

创建 `.env` 文件：

```env
NUXT_API_URL=https://api.example.com
NUXT_APP_TITLE=My Nuxt App
```

在 `nuxt.config.ts` 中使用：

```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    // 仅服务端可用
    apiSecret: process.env.API_SECRET,
    
    // 客户端和服务端都可用
    public: {
      apiBase: process.env.NUXT_API_BASE || '/api'
    }
  }
})
```

## 项目启动

### 开发模式

```bash
npm run dev
```

默认情况下，应用将在 `http://localhost:3000` 上运行。

### 生产构建

```bash
# 构建用于 SSR 的应用
npm run build

# 预览构建的应用
npm run preview
```

### 静态生成

```bash
# 生成静态站点
npm run generate

# 预览静态站点
npm run preview
```

## 常见问题解决

### 1. Node.js 版本问题

如果遇到 Node.js 版本不兼容的问题：

```bash
# 使用 nvm 管理 Node.js 版本
nvm install 18
nvm use 18
```

### 2. 权限问题

在 Linux/Mac 上，可能需要修复 npm 权限：

```bash
sudo chown -R $(whoami) ~/.npm
```

### 3. 端口占用

如果 3000 端口已被占用，可以在 `.env` 中指定其他端口：

```env
NUXT_PORT=4000
```

或者在命令行中指定：

```bash
npm run dev -- -p 4000
```

通过完成这些步骤，您就可以成功安装和配置 Nuxt.js 开发环境，并开始构建您的应用了。