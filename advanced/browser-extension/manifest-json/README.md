# Manifest.json 配置文件详解

## 基本介绍

manifest.json 是浏览器插件的核心配置文件，它定义了插件的基本信息、权限需求、资源文件和功能模块等。浏览器通过读取此文件来了解插件的所有信息并正确加载。

## 基本结构

```json
{
  "manifest_version": 3,
  "name": "插件名称",
  "version": "1.0.0",
  "description": "插件描述",
  "icons": {
    "16": "images/icon16.png",
    "48": "images/icon48.png",
    "128": "images/icon128.png"
  },
  "action": {},
  "permissions": [],
  "host_permissions": [],
  "background": {},
  "content_scripts": [],
  "options_page": "options.html"
}
```

## 核心字段详解

### 1. 基础信息字段

- **manifest_version**: 必需字段，指定清单文件格式版本
  - Chrome 扩展推荐使用版本 3
  - Firefox 同时支持版本 2 和 3
  - 版本 3 引入了更严格的安全限制和模块化架构

- **name**: 必需字段，插件名称
  - 最多 45 个字符
  - 显示在扩展商店和浏览器扩展管理页面

- **version**: 必需字段，插件版本号
  - 遵循语义化版本号规范 (Major.Minor.Patch)
  - 更新插件时必须增加版本号

- **description**: 可选字段，插件的简短描述
  - 最多 132 个字符
  - 用于扩展商店的列表展示

- **icons**: 可选字段，插件图标
  - 推荐提供 16x16, 48x48, 128x128 三种尺寸
  - 16x16 用于工具栏和扩展管理页面
  - 48x48 用于扩展管理页面
  - 128x128 用于安装确认页面和扩展商店

### 2. 界面相关字段

- **action**: 定义浏览器工具栏中的扩展图标行为
  - **default_icon**: 默认图标路径
  - **default_title**: 鼠标悬停时显示的标题
  - **default_popup**: 点击图标时显示的弹出页面
  - 在 Manifest V2 中，这个字段称为 **browser_action** 或 **page_action**

- **options_page**: 扩展设置页面
  - 用户可以通过扩展管理页面访问

- **options_ui**: 提供嵌入式设置界面
  - **page**: 设置页面路径
  - **open_in_tab**: 是否在新标签页中打开

- **devtools_page**: DevTools 页面
  - 用于扩展浏览器的开发者工具

### 3. 权限相关字段

- **permissions**: 扩展需要的 API 权限列表
  - 例如: "activeTab", "storage", "tabs"
  - 使用前需要在扩展商店中声明

- **host_permissions**: 扩展可以访问的网站列表
  - 例如: "https://*.example.com/"
  - 支持通配符

- **optional_permissions**: 可选权限
  - 可以在运行时请求，不强制要求用户在安装时授权

### 4. 脚本相关字段

- **background**: 后台脚本配置
  - **service_worker**: Manifest V3 中使用 Service Worker
  - **scripts**: Manifest V2 中使用脚本数组
  - **persistent**: 是否持久运行 (V2 特有)

- **content_scripts**: 内容脚本配置
  - **matches**: 匹配的网站 URL 模式
  - **js**: JavaScript 文件数组
  - **css**: CSS 文件数组
  - **run_at**: 脚本注入时机 ("document_start", "document_end", "document_idle")
  - **all_frames**: 是否注入到所有框架

- **web_accessible_resources**: 网页可以访问的扩展资源
  - 定义哪些资源可以被内容脚本或网页访问

### 5. 其他重要字段

- **content_security_policy**: 内容安全策略
  - 限制扩展内代码可以加载的资源和执行的操作
  - 增强安全性

- **incognito**: 隐身模式下的行为
  - "spanning": 共享普通模式的上下文
  - "split": 创建独立上下文
  - "not_allowed": 禁止在隐身模式使用

- **browser_specific_settings**: 特定浏览器的设置
  - 用于 Firefox 等浏览器的特定配置

## Manifest V2 vs V3 主要区别

### 架构变更

- **后台脚本**: 从持久化背景页面改为 Service Worker
- **权限系统**: 更细粒度的权限控制
- **网络请求**: 引入 declarativeNetRequest API 替代 webRequestBlocking
- **内容安全策略**: 更严格的默认限制

### 重要迁移要点

1. 将 background.scripts 替换为 background.service_worker
2. 移除 background.persistent 字段
3. 使用 host_permissions 替代 permissions 中的 URL 模式
4. 重构使用 webRequestBlocking 的代码为 declarativeNetRequest
5. 更新内容安全策略配置

## 最佳实践

- 仅请求必要的最小权限集
- 提供清晰的描述和图标
- 遵循语义化版本号规范
- 为不同浏览器版本提供兼容性支持
- 定期更新 manifest.json 以支持最新的浏览器特性

## 常见错误

- 缺少必需字段 (manifest_version, name, version)
- 版本号格式不正确
- 权限声明不完整或过于宽泛
- 资源路径错误
- Service Worker 中使用不支持的 API (如 alert, confirm)

## 参考资源

- [Chrome 扩展 Manifest 文件](https://developer.chrome.com/docs/extensions/mv3/manifest/)
- [Firefox 扩展 Manifest 文件](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json)