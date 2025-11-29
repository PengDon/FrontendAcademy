# Electron 打包和发布指南

本目录包含Electron应用的打包、发布和自动更新的完整示例，帮助开发者了解如何将Electron应用部署到Windows、macOS和Linux等不同平台。

## 目录结构

```
electron/packaging-publishing/
├── README.md                # 本文档
├── electron-builder-config.js # Electron Builder配置示例
├── electron-packager-example.js # Electron Packager示例
├── package.json             # 项目配置示例
├── app-update.yml           # 自动更新配置
└── scripts/                 # 构建脚本
    ├── build-all.js         # 构建所有平台
    ├── build-windows.js     # 构建Windows版本
    ├── build-mac.js         # 构建macOS版本
    └── build-linux.js       # 构建Linux版本
```

## 打包工具对比

| 工具 | 优势 | 劣势 | 适用场景 |
|------|------|------|----------|
| **electron-builder** | 功能全面，支持自动更新，丰富的平台支持 | 配置较复杂 | 生产环境应用 |
| **electron-packager** | 简单易用，配置灵活 | 不内置自动更新，需要额外工具 | 快速打包测试 |
| **electron-forge** | 脚手架功能，全生命周期管理 | 定制性不如electron-builder | 新项目初始化 |
| **webpack-electron-builder** | 与webpack集成，优化打包 | 配置复杂度高 | 复杂应用优化 |

## Electron Builder配置示例

### 1. 基本配置

```javascript
// electron-builder-config.js
module.exports = {
  // 应用基本信息
  appId: 'com.example.electron-app',
  productName: 'Electron示例应用',
  version: '1.0.0',
  
  // 构建输出目录
  directories: {
    output: 'dist',
    buildResources: 'build',
  },
  
  // 打包文件配置
  files: [
    'dist/**/*',
    'node_modules/**/*',
    'main.js',
    'preload.js'
  ],
  
  // 清理输出目录
  clean: true,
  
  // Windows特定配置
  win: {
    target: ['nsis', 'portable'],
    icon: 'build/icon.ico',
    artifactName: '${productName}-Setup-${version}-${platform}-${arch}.${ext}',
    // 数字签名配置
    signAndEditExecutable: true,
    signDlls: true,
  },
  
  // macOS特定配置
  mac: {
    target: ['dmg', 'zip'],
    icon: 'build/icon.icns',
    artifactName: '${productName}-${version}-${platform}-${arch}.${ext}',
    // 应用签名配置
    hardenedRuntime: true,
    entitlements: 'build/entitlements.mac.plist',
    entitlementsInherit: 'build/entitlements.mac.plist',
  },
  
  // Linux特定配置
  linux: {
    target: ['AppImage', 'deb', 'rpm'],
    icon: 'build/icons/',
    artifactName: '${productName}-${version}-${platform}-${arch}.${ext}',
    category: 'Utility',
  },
  
  // NSIS安装程序配置（Windows）
  nsis: {
    oneClick: false,
    allowElevation: true,
    allowToChangeInstallationDirectory: true,
    installerIcon: 'build/icon.ico',
    uninstallerIcon: 'build/uninstall.ico',
    installerHeaderIcon: 'build/icon.ico',
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: 'Electron示例应用',
    include: 'build/installer.nsh', // 自定义安装脚本
  },
  
  // AppImage配置（Linux）
  appImage: {
    systemIntegration: 'ask',
  },
  
  // DEB包配置（Linux）
  deb: {
    depends: ['gconf2', 'gconf-service', 'libnotify4', 'libappindicator1', 'libxtst6', 'libnss3'],
    homepage: 'https://example.com',
    maintainer: 'Developer <developer@example.com>',
  },
  
  // 自动更新配置
  publish: [
    {
      provider: 'github',
      owner: 'username',
      repo: 'electron-app',
      releaseType: 'release',
      token: process.env.GITHUB_TOKEN, // 从环境变量获取
    },
  ],
  
  // 发布配置
  releaseInfo: {
    releaseNotes: '应用发布说明',
    releaseName: '版本 1.0.0',
    releaseDate: new Date(),
  },
};
```

## 主要打包工具使用方法

### 使用 electron-builder

1. 安装依赖

```bash
# npm
npm install electron-builder --save-dev

# yarn
yarn add electron-builder --dev
```

2. 在package.json中添加脚本

```json
"scripts": {
  "build": "electron-builder",
  "build:win": "electron-builder --win --x64",
  "build:mac": "electron-builder --mac --x64",
  "build:linux": "electron-builder --linux",
  "build:all": "electron-builder -mwl"
}
```

3. 运行打包命令

```bash
# 打包Windows版本
npm run build:win

# 打包macOS版本
npm run build:mac

# 打包Linux版本
npm run build:linux

# 打包所有平台版本
npm run build:all
```

### 使用 electron-packager

1. 安装依赖

```bash
# npm
npm install electron-packager --save-dev

# yarn
yarn add electron-packager --dev
```

2. 在package.json中添加脚本

```json
"scripts": {
  "package": "electron-packager .",
  "package:win": "electron-packager . --platform=win32 --arch=x64",
  "package:mac": "electron-packager . --platform=darwin --arch=x64",
  "package:linux": "electron-packager . --platform=linux --arch=x64"
}
```

3. 运行打包命令

```bash
# 打包Windows版本
npm run package:win

# 打包macOS版本
npm run package:mac

# 打包Linux版本
npm run package:linux
```

## 跨平台构建注意事项

### Windows

- **数字签名**：为了在Windows上获得良好的用户体验，建议对应用程序进行数字签名
- **UAC提升**：根据需要配置安装程序的UAC权限
- **Windows Defender**：可能会误报Electron应用，需要考虑提交应用到Microsoft SmartScreen排除列表

### macOS

- **代码签名**：需要Apple开发者账号和证书
- **公证**：macOS 10.14.5+要求应用经过公证才能正常运行
- **沙盒**：考虑使用App Sandbox提高应用安全性

### Linux

- **依赖项**：确保在deb/rpm包中正确声明系统依赖
- **AppImage**：提供无需安装即可运行的版本
- **权限**：设置正确的文件权限和应用图标

## 自动更新实现

### 1. 配置更新源

创建`app-update.yml`文件：

```yaml
# app-update.yml
provider: github
owner: username
repo: electron-app
updaterCacheDirName: electron-app-updater
```

### 2. 在主进程中实现更新检查

```javascript
// 在主进程中添加自动更新逻辑
const { autoUpdater } = require('electron-updater');

// 配置日志记录
autoUpdater.logger = require('electron-log');
autoUpdater.logger.transports.file.level = 'info';

// 检查更新
function checkForUpdates() {
  console.log('检查应用更新...');
  
  // 在开发环境中禁用自动更新
  if (process.env.NODE_ENV === 'development') {
    console.log('开发环境，跳过自动更新');
    return;
  }
  
  // 检查更新
  autoUpdater.checkForUpdates();
}

// 更新事件处理
autoUpdater.on('checking-for-update', () => {
  console.log('正在检查更新...');
});

autoUpdater.on('update-available', (info) => {
  console.log('发现新版本:', info.version);
  // 通知用户有新版本可用
  mainWindow.webContents.send('update-available', info);
});

autoUpdater.on('update-not-available', (info) => {
  console.log('当前已是最新版本');
});

autoUpdater.on('error', (err) => {
  console.error('自动更新失败:', err);
});

autoUpdater.on('download-progress', (progressObj) => {
  // 通知用户下载进度
  mainWindow.webContents.send('update-progress', progressObj);
});

autoUpdater.on('update-downloaded', (info) => {
  console.log('更新已下载完成，准备安装');
  // 通知用户更新已准备就绪，可以重启应用
  mainWindow.webContents.send('update-downloaded', info);
});

// 安装更新
function installUpdateAndRestart() {
  console.log('安装更新并重启应用');
  autoUpdater.quitAndInstall();
}

// 导出更新相关函数
module.exports = {
  checkForUpdates,
  installUpdateAndRestart
};
```

### 3. 在渲染进程中处理更新通知

```javascript
// 在渲染进程中监听更新事件
const { ipcRenderer } = require('electron');

// 监听更新可用
ipcRenderer.on('update-available', (event, info) => {
  console.log('发现新版本:', info.version);
  
  // 显示更新提示
  const shouldUpdate = confirm(`发现新版本 ${info.version}，是否下载更新？`);
  if (shouldUpdate) {
    // 可以在这里显示下载进度条
  }
});

// 监听更新进度
ipcRenderer.on('update-progress', (event, progressObj) => {
  const progressPercent = Math.round(progressObj.percent);
  console.log(`下载进度: ${progressPercent}%`);
  
  // 更新UI进度条
  updateProgressBar(progressPercent);
});

// 监听更新已下载
ipcRenderer.on('update-downloaded', (event, info) => {
  console.log('更新已下载完成');
  
  // 显示安装提示
  const shouldInstall = confirm(`更新已准备就绪，是否现在安装并重启应用？`);
  if (shouldInstall) {
    // 发送消息给主进程安装更新
    ipcRenderer.send('install-update');
  }
});
```

## CI/CD集成示例

### GitHub Actions工作流示例

```yaml
# .github/workflows/build.yml
name: Build and Release

on:
  push:
    tags: [ 'v*.*.*' ]

jobs:
  build:
    runs-on: ${{ matrix.os }}
    
    strategy:
      matrix:
        os: [windows-latest, macos-latest, ubuntu-latest]
    
    steps:
      - name: 检出代码
        uses: actions/checkout@v3
      
      - name: 设置Node.js环境
        uses: actions/setup-node@v3
        with:
          node-version: 16
          cache: 'npm'
      
      - name: 安装依赖
        run: npm ci
      
      - name: 构建应用
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          if [ "$RUNNER_OS" == "Windows" ]; then
            npm run build:win
          elif [ "$RUNNER_OS" == "macOS" ]; then
            npm run build:mac
          elif [ "$RUNNER_OS" == "Linux" ]; then
            npm run build:linux
          fi
      
      - name: 上传构建产物
        uses: actions/upload-artifact@v3
        with:
          name: ${{ matrix.os }}-build
          path: dist/
  
  release:
    needs: build
    runs-on: ubuntu-latest
    
    steps:
      - name: 检出代码
        uses: actions/checkout@v3
      
      - name: 下载所有构建产物
        uses: actions/download-artifact@v3
        with:
          path: dist/
      
      - name: 创建GitHub Release
        uses: softprops/action-gh-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          files: dist/**/*
          body: |
            应用发布说明
            - 修复了一些问题
            - 添加了新功能
            - 提升了性能
```

## 代码签名

### Windows代码签名

1. **获取代码签名证书**：可以从DigiCert、GlobalSign等证书颁发机构购买

2. **配置签名工具**：在electron-builder配置中添加：

```javascript
win: {
  signAndEditExecutable: true,
  signDlls: true,
},

// 在package.json中添加证书配置
build: {
  win: {
    certificateSubjectName: "Your Company Name",
    certificateSha1: "证书哈希",
    certificateFile: process.env.WINDOWS_CERTIFICATE_FILE,
    certificatePassword: process.env.WINDOWS_CERTIFICATE_PASSWORD
  }
}
```

### macOS代码签名和公证

1. **准备证书**：在Apple开发者账户中创建开发和分发证书

2. **配置签名**：

```javascript
mac: {
  hardenedRuntime: true,
  entitlements: 'build/entitlements.mac.plist',
  entitlementsInherit: 'build/entitlements.mac.plist',
  gatekeeperAssess: false,
  sign: 'Developer ID Application: Your Company (TEAM_ID)',
}
```

3. **公证配置**：

```javascript
mac: {
  notarize: {
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_ID_PASSWORD,
    teamId: process.env.APPLE_TEAM_ID
  }
}
```

## 发布渠道策略

### 1. 官方网站下载

- 提供所有平台的安装包
- 维护版本历史和变更日志
- 设置Google Analytics等工具跟踪下载量

### 2. 应用商店发布

- **Microsoft Store**：需要Windows开发账户，应用必须通过认证
- **macOS App Store**：需要Apple开发者账户，应用必须通过审核
- **Linux应用商店**：如Snap Store、Flathub等

### 3. 自动更新服务器

- **GitHub Releases**：适合开源项目
- **私有服务器**：使用electron-builder的generic提供程序
- **自定义CDN**：更灵活的分发方式

## 性能优化

### 打包大小优化

1. **减少依赖**：移除不必要的npm包
2. **使用webpack/babel优化**：代码分割、tree-shaking
3. **启用压缩**：使用electron-builder的压缩选项

### 启动性能优化

1. **减少主进程代码**：只在主进程中保留必要功能
2. **延迟加载**：非核心功能延迟到应用启动后加载
3. **优化渲染进程**：避免不必要的重渲染

## 最佳实践

1. **版本控制**：遵循语义化版本控制(SemVer)
2. **构建自动化**：使用CI/CD自动构建和测试
3. **签名和公证**：所有生产版本必须经过签名
4. **错误报告**：集成Sentry等错误监控服务
5. **用户反馈**：添加用户反馈机制
6. **隐私政策**：明确说明数据收集和使用方式
7. **许可证**：选择合适的开源许可证或商业许可证

## 常见问题解答

### 1. 如何解决Windows Defender误报问题？

- 对应用进行代码签名
- 提交应用到Microsoft SmartScreen排除列表
- 在应用发布说明中提供验证指南

### 2. 如何处理macOS公证失败？

- 确保正确配置了entitlements文件
- 检查应用是否符合Apple的安全要求
- 确认证书和开发者账户状态正常

### 3. 如何减小Electron应用体积？

- 使用asar打包并禁用unpack选项
- 移除未使用的依赖
- 压缩资源文件
- 使用electron-builder的压缩选项

### 4. 如何实现无感知更新？

- 使用electron-updater的静默更新功能
- 在应用空闲时检查和下载更新
- 下次启动时自动安装更新

## 相关资源

- [Electron Builder官方文档](https://www.electron.build/)
- [Electron Packager官方文档](https://github.com/electron/electron-packager)
- [Electron Forge官方文档](https://www.electronforge.io/)
- [Microsoft Store发布指南](https://docs.microsoft.com/en-us/windows/uwp/publish/publish-your-app)
- [App Store Connect指南](https://developer.apple.com/app-store-connect/)
- [Electron自动更新教程](https://www.electronjs.org/docs/tutorial/updates)

## 总结

本指南提供了Electron应用打包、发布和自动更新的完整流程和最佳实践。通过合理配置打包工具、实现自动更新机制、使用CI/CD流程以及遵循各平台的发布要求，开发者可以为用户提供专业、可靠的Electron应用体验。