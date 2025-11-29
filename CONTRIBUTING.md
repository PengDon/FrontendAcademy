# 贡献指南

欢迎参与 FrontendAcademy 项目的开发和维护！本指南将帮助您了解如何为项目做出贡献。

## 行为准则

为了营造一个友好、包容的社区环境，请遵守以下行为准则：

- 使用友善和包容性的语言
- 尊重不同的观点和经验
- 优雅地接受建设性批评
- 专注于对社区最有利的事情
- 对其他社区成员表示同理心

## 如何贡献

### 1. 报告问题（Issues）

如果您发现了错误或有新功能的建议，请在 GitHub 上创建一个新的 Issue。在创建 Issue 时，请提供以下信息：

- 清晰的标题和描述
- 复现问题的步骤（如果是 bug）
- 预期行为与实际行为的对比
- 相关截图或日志
- 使用的环境信息（操作系统、浏览器版本等）
- 可能的解决方案或建议

### 2. 提交代码（Pull Requests）

如果您想直接贡献代码，请按照以下步骤操作：

#### 2.1 Fork 仓库

首先，点击 GitHub 上的 "Fork" 按钮，将仓库复制到您自己的账号下。

#### 2.2 克隆仓库

```bash
git clone https://github.com/YOUR_USERNAME/FrontendAcademy.git
cd FrontendAcademy
```

#### 2.3 创建分支

为您的功能或修复创建一个新的分支：

```bash
git checkout -b feature/amazing-feature  # 对于新功能
git checkout -b fix/bug-fix              # 对于 bug 修复
```

#### 2.4 进行修改

在您的分支上进行代码修改，确保遵循项目的编码规范。

#### 2.5 添加测试

如果您的修改涉及功能变更，请添加相应的测试用例以确保代码质量。

#### 2.6 提交更改

提交您的更改时，请使用清晰、描述性的提交信息，遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```bash
git add .
git commit -m "feat: 添加新功能描述"  # 功能
git commit -m "fix: 修复问题描述"    # 修复
git commit -m "docs: 更新文档描述"    # 文档
git commit -m "style: 样式更改描述"   # 样式
git commit -m "refactor: 重构代码描述" # 重构
git commit -m "test: 添加测试描述"    # 测试
git commit -m "chore: 杂项更改描述"   # 杂项
```

#### 2.7 推送到远程

将您的分支推送到您的 Fork 仓库：

```bash
git push origin feature/amazing-feature
```

#### 2.8 创建 Pull Request

在 GitHub 上，从您的分支创建一个新的 Pull Request 到主仓库的 main 分支。请提供以下信息：

- 清晰的标题和描述
- 关联相关的 Issue（如果有）
- 说明您的修改解决了什么问题
- 解释实现细节和决策理由
- 如有必要，提供截图或演示

### 3. 文档贡献

文档对于项目的成功至关重要。您可以通过以下方式贡献文档：

- 修正现有文档中的错误或拼写问题
- 补充缺失的文档内容
- 改进文档的结构和可读性
- 添加代码示例和使用说明

## 编码规范

为了保持代码的一致性和可维护性，请遵循以下编码规范：

### JavaScript/TypeScript

- 使用 2 个空格进行缩进
- 使用单引号定义字符串
- 行尾不添加分号
- 使用 ES6+ 语法
- 优先使用 const 和 let，避免使用 var
- 使用 arrow function 和模板字符串
- 对于对象和数组，使用简洁的解构赋值

### HTML

- 使用语义化标签
- 保持标签小写
- 为图片添加 alt 属性
- 为表单元素添加 label
- 使用合适的缩进

### CSS

- 使用 BEM 命名规范（Block__Element--Modifier）
- 优先使用 flexbox 和 grid 布局
- 使用变量管理颜色和字体大小
- 为选择器添加注释说明用途
- 避免使用 !important

## 审核流程

当您提交 Pull Request 后，项目维护者将进行审核。审核可能涉及以下步骤：

1. 代码风格和质量检查
2. 功能和逻辑审查
3. 测试用例验证
4. 讨论和反馈

请及时回应审核意见，必要时进行修改。一旦您的 Pull Request 获得批准，它将被合并到主分支中。

## 开发设置

如果您需要在本地开发环境中运行项目，请按照以下步骤操作：

### 安装依赖

```bash
# 根据项目需求安装相应依赖
npm install
# 或
yarn install
```

### 运行测试

```bash
# 运行测试套件
npm test
# 或
yarn test
```

### 代码检查

```bash
# 使用 ESLint 检查代码
npm run lint
# 或
yarn lint
```

## 项目资源

- [项目文档](https://github.com/YOUR_USERNAME/FrontendAcademy)
- [相关 Issues](https://github.com/YOUR_USERNAME/FrontendAcademy/issues)
- [Wiki](https://github.com/YOUR_USERNAME/FrontendAcademy/wiki)（如果有）

## 联系方式

如果您有任何问题或需要帮助，可以通过以下方式联系我们：

- GitHub Issues
- 项目讨论区（如果有）

感谢您对 FrontendAcademy 项目的贡献！