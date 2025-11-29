// Electron Builder 配置文件
// 这个文件提供了Electron应用打包的详细配置，支持Windows、macOS和Linux平台

const path = require('path');
const { Platform } = require('electron-builder');

// 基本配置
const baseConfig = {
  // 应用标识
  appId: 'com.example.electron-app',
  productName: 'Electron示例应用',
  
  // 构建输出目录
  directories: {
    output: path.resolve(__dirname, 'dist'),
    buildResources: path.resolve(__dirname, 'build'),
  },
  
  // 打包文件配置
  files: [
    'main.js',
    'preload.js',
    'src/**/*',
    'public/**/*',
    'node_modules/**/*',
    { from: 'resources', to: 'resources' }
  ],
  
  // 额外资源配置
  extraResources: [
    {
      from: 'resources/',
      to: 'resources/',
      filter: ['**/*']
    },
    'license.txt'
  ],
  
  // 清理和优化
  clean: true,
  npmRebuild: true,
  asar: true,
  asarUnpack: [
    // 需要在运行时访问的Node.js原生模块
    'node_modules/native-module/**/*',
    // 其他需要解压的文件
    'resources/**/*'
  ],
  
  // 压缩选项
  compress: 'maximum',
  
  // 文件命名模板
  artifactName: '${productName}-${version}-${platform}-${arch}.${ext}',
};

// Windows平台特定配置
const windowsConfig = {
  win: {
    // 构建目标
    target: [
      {
        target: 'nsis',
        arch: ['x64', 'ia32', 'arm64']
      },
      {
        target: 'portable',
        arch: ['x64', 'ia32', 'arm64']
      },
      'zip',
      '7z'
    ],
    
    // 图标和资源
    icon: path.resolve(__dirname, 'build/icons/icon.ico'),
    publisherName: '示例公司',
    
    // 数字签名配置
    signAndEditExecutable: true,
    signDlls: true,
    
    // 文件关联
    fileAssociations: [
      {
        ext: 'example',
        name: '示例文件',
        description: 'Electron示例应用文件',
        icon: path.resolve(__dirname, 'build/icons/file.ico')
      }
    ],
    
    // Windows特定元数据
    legalTrademarks: '示例公司',
    
    // 自定义NSIS脚本
    extraFiles: [
      {
        from: path.resolve(__dirname, 'build/win/'),
        to: '.',
        filter: ['**/*']
      }
    ]
  },
  
  // NSIS安装程序配置
  nsis: {
    // 安装选项
    oneClick: false, // 允许自定义安装
    allowElevation: true,
    allowToChangeInstallationDirectory: true,
    
    // 图标
    installerIcon: path.resolve(__dirname, 'build/icons/icon.ico'),
    uninstallerIcon: path.resolve(__dirname, 'build/icons/uninstall.ico'),
    installerHeaderIcon: path.resolve(__dirname, 'build/icons/icon.ico'),
    
    // 快捷方式
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: 'Electron示例应用',
    
    // 自定义脚本
    include: path.resolve(__dirname, 'build/installer.nsh'),
    script: path.resolve(__dirname, 'build/installer.nsh'),
    
    // 其他选项
    deleteAppDataOnUninstall: false,
    runAfterFinish: true,
    perMachine: false, // 每用户安装
    unicode: true,
    language: 'SimpChinese', // 简体中文
    
    // 多语言支持
    multiLanguageInstaller: true,
    installerLanguages: ['zh-CN', 'en-US']
  },
  
  // 便携版配置
  portable: {
    unicode: true,
    artifactName: '${productName}-Portable-${version}-${platform}-${arch}.${ext}'
  }
};

// macOS平台特定配置
const macOsConfig = {
  mac: {
    // 构建目标
    target: [
      {
        target: 'dmg',
        arch: ['x64', 'arm64']
      },
      {
        target: 'pkg',
        arch: ['x64', 'arm64']
      },
      'zip',
      'mas' // Mac App Store版本
    ],
    
    // 图标和资源
    icon: path.resolve(__dirname, 'build/icons/icon.icns'),
    
    // 应用分类
    category: 'public.app-category.utilities',
    
    // 强化运行时（macOS要求）
    hardenedRuntime: true,
    entitlements: path.resolve(__dirname, 'build/entitlements.mac.plist'),
    entitlementsInherit: path.resolve(__dirname, 'build/entitlements.mac.plist'),
    
    // 公证配置
    notarize: {
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_ID_PASSWORD,
      teamId: process.env.APPLE_TEAM_ID
    },
    
    // 深色模式支持
    darkModeSupport: 'true',
    
    // 权限申请说明
    extendInfo: {
      NSCameraUsageDescription: '此应用需要访问您的摄像头以提供视频功能',
      NSMicrophoneUsageDescription: '此应用需要访问您的麦克风以提供音频功能',
      NSPhotoLibraryUsageDescription: '此应用需要访问您的照片库以保存或选择图片',
      NSUserNotificationUsageDescription: '此应用需要发送通知以提醒您重要事件'
    },
    
    // 应用版本配置
    bundleVersion: process.env.BUILD_NUMBER || '1',
    minimumSystemVersion: '10.15.0' // 最低支持macOS Catalina
  },
  
  // DMG安装包配置
  dmg: {
    // 内容配置
    contents: [
      {
        x: 130,
        y: 220
      },
      {
        x: 410,
        y: 220,
        type: 'link',
        path: '/Applications'
      }
    ],
    
    // 背景图片
    background: path.resolve(__dirname, 'build/dmg-background.png'),
    
    // 图标大小
    iconSize: 100,
    
    // 窗口大小
    window: {
      width: 540,
      height: 380
    },
    
    // 其他选项
    format: 'ULFO', // 支持APFS格式的DMG
    sign: true
  },
  
  // PKG安装包配置
  pkg: {
    allowAnywhere: true,
    allowCurrentUserHome: true,
    allowRootDirectory: true,
    identifier: 'com.example.electron-app.pkg',
    sign: process.env.APPLE_INSTALLER_CERT_ID
  },
  
  // Mac App Store配置
  mas: {
    type: 'distribution',
    provisioningProfile: path.resolve(__dirname, 'build/embedded.provisionprofile'),
    entitlements: path.resolve(__dirname, 'build/entitlements.mas.plist'),
    entitlementsInherit: path.resolve(__dirname, 'build/entitlements.mas.inherit.plist'),
    hardenedRuntime: true,
    hardenedRuntimeBundleId: 'com.example.electron-app'
  }
};

// Linux平台特定配置
const linuxConfig = {
  linux: {
    // 构建目标
    target: [
      'AppImage',
      'deb',
      'rpm',
      'pacman',
      'snap',
      'tar.gz',
      'tar.xz'
    ],
    
    // 图标
    icon: path.resolve(__dirname, 'build/icons/'),
    
    // 应用信息
    category: 'Utility',
    synopsis: 'Electron示例应用',
    description: 'Electron应用打包和发布示例',
    vendor: '示例公司',
    
    // 桌面快捷方式
    desktop: {
      Name: 'Electron示例应用',
      Comment: 'Electron应用打包和发布示例',
      Categories: 'Utility;Development;',
      StartupNotify: 'true',
      StartupWMClass: 'electron-example'
    },
    
    // 可执行文件名
    executableName: 'electron-example',
    
    // 维护者信息
    maintainer: '开发者 <developer@example.com>',
    
    // 系统依赖
    depends: [
      'gconf2',
      'gconf-service',
      'libnotify4',
      'libappindicator1',
      'libxtst6',
      'libnss3',
      'libxss1',
      'libasound2'
    ],
    
    // 额外文件
    extraFiles: [
      {
        from: path.resolve(__dirname, 'build/linux/'),
        to: '.',
        filter: ['**/*']
      }
    ]
  },
  
  // AppImage配置
  appImage: {
    systemIntegration: 'ask',
    category: 'Utility',
    desktopIntegration: true,
    exec: 'electron-example',
    icon: path.resolve(__dirname, 'build/icons/256x256.png')
  },
  
  // DEB包配置
  deb: {
    depends: [
      'gconf2',
      'gconf-service',
      'libnotify4',
      'libappindicator1',
      'libxtst6',
      'libnss3'
    ],
    homepage: 'https://example.com',
    maintainer: '开发者 <developer@example.com>',
    section: 'utils',
    priority: 'optional',
    compression: 'xz'
  },
  
  // RPM包配置
  rpm: {
    depends: [
      'gconf2',
      'gconf-service',
      'libnotify',
      'libappindicator',
      'libXtst',
      'nss'
    ],
    summary: 'Electron示例应用',
    description: 'Electron应用打包和发布示例',
    vendor: '示例公司',
    license: 'MIT'
  },
  
  // Snap包配置
  snap: {
    summary: 'Electron示例应用',
    description: 'Electron应用打包和发布示例',
    grade: 'stable',
    confinement: 'strict',
    publish: process.env.SNAP_PUBLISH_TOKEN ? 'edge' : undefined,
    plugs: [
      'default',
      'camera',
      'microphone',
      'home',
      'network',
      'network-bind',
      'desktop',
      'desktop-legacy',
      'x11',
      'unity7',
      'browser-support'
    ],
    apps: {
      'electron-example': {
        command: 'electron-example'
      }
    }
  },
  
  // Pacman包配置
  pacman: {
    depends: [
      'gconf',
      'libnotify',
      'libappindicator-gtk2',
      'libxtst',
      'nss',
      'alsa-lib'
    ],
    homepage: 'https://example.com',
    maintainer: '开发者 <developer@example.com>',
    license: 'MIT'
  }
};

// 自动更新配置
const updateConfig = {
  publish: [
    // GitHub发布配置
    {
      provider: 'github',
      owner: process.env.GITHUB_OWNER || 'username',
      repo: process.env.GITHUB_REPO || 'electron-app',
      releaseType: 'release',
      vPrefixedTagName: true,
      private: process.env.GITHUB_PRIVATE === 'true',
      token: process.env.GITHUB_TOKEN
    },
    
    // 通用服务器发布配置
    {
      provider: 'generic',
      url: process.env.UPDATE_SERVER_URL || 'https://example.com/downloads/',
      channel: process.env.UPDATE_CHANNEL || 'latest',
      useMultipleRangeRequest: true
    }
  ],
  
  // 发布信息
  releaseInfo: {
    releaseNotes: process.env.RELEASE_NOTES || '\n- 修复了一些问题\n- 添加了新功能\n- 提升了性能',
    releaseName: process.env.RELEASE_NAME || '版本 1.0.0',
    releaseDate: process.env.RELEASE_DATE || new Date().toISOString()
  }
};

// 代码签名配置
const codeSigningConfig = {
  // Windows签名配置
  win: {
    certificateSubjectName: process.env.WINDOWS_CERT_SUBJECT_NAME,
    certificateSha1: process.env.WINDOWS_CERT_SHA1,
    certificateFile: process.env.WINDOWS_CERTIFICATE_FILE,
    certificatePassword: process.env.WINDOWS_CERTIFICATE_PASSWORD,
    signToolPath: process.env.SIGNTOOL_PATH,
    signDlls: true,
    signAndEditExecutable: true
  },
  
  // macOS签名配置
  mac: {
    identity: process.env.MAC_CERTIFICATE_IDENTITY,
    hardenedRuntime: true,
    entitlements: path.resolve(__dirname, 'build/entitlements.mac.plist'),
    entitlementsInherit: path.resolve(__dirname, 'build/entitlements.mac.plist'),
    notarize: process.env.APPLE_ID ? {
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_ID_PASSWORD,
      teamId: process.env.APPLE_TEAM_ID
    } : false
  },
  
  // 自定义签名钩子
  afterSign: path.resolve(__dirname, 'build/notarize.js')
};

// 开发环境特定配置
const devConfig = {
  // 开发环境下禁用自动更新
  publish: null,
  
  // 禁用签名
  win: {
    signAndEditExecutable: false,
    signDlls: false
  },
  mac: {
    hardenedRuntime: false,
    notarize: false
  },
  
  // 优化开发构建速度
  compression: 'store',
  asarUnpack: [
    '**/*'
  ]
};

// 根据环境变量和构建目标创建最终配置
function createConfig() {
  // 合并基础配置
  let config = { ...baseConfig };
  
  // 根据平台合并平台特定配置
  const targetPlatform = process.env.TARGET_PLATFORM;
  if (!targetPlatform || targetPlatform === 'win' || targetPlatform === 'all') {
    config = { ...config, ...windowsConfig };
  }
  if (!targetPlatform || targetPlatform === 'mac' || targetPlatform === 'all') {
    config = { ...config, ...macOsConfig };
  }
  if (!targetPlatform || targetPlatform === 'linux' || targetPlatform === 'all') {
    config = { ...config, ...linuxConfig };
  }
  
  // 如果是生产环境，添加自动更新和签名配置
  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction) {
    config = { ...config, ...updateConfig, ...codeSigningConfig };
  } else {
    // 开发环境下使用简化配置
    config = { ...config, ...devConfig };
  }
  
  // 允许通过环境变量覆盖特定配置
  if (process.env.APP_ID) config.appId = process.env.APP_ID;
  if (process.env.PRODUCT_NAME) config.productName = process.env.PRODUCT_NAME;
  if (process.env.VERSION) config.version = process.env.VERSION;
  
  // 打印配置信息（不包含敏感信息）
  console.log('构建配置:', {
    appId: config.appId,
    productName: config.productName,
    platforms: targetPlatform || 'all',
    production: isProduction
  });
  
  return config;
}

// 导出配置
module.exports = createConfig();

// 导出配置函数，允许程序化使用
module.exports.createConfig = createConfig;