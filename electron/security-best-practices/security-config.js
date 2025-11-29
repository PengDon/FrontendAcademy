// Electron安全配置和验证工具

/**
 * 内容安全策略(CSP)配置
 */
export const cspConfig = {
  // 开发环境CSP（稍微宽松以支持开发工具）
  development: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-eval'"], // 仅在开发环境中允许unsafe-eval
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "http://localhost:*"],
    connectSrc: ["'self'", "http://localhost:*"],
    fontSrc: ["'self'"],
    mediaSrc: ["'self'"],
    objectSrc: ["'none'"],
    frameSrc: ["'none'"],
    frameAncestors: ["'none'"],
    formAction: ["'self'"],
    baseUri: ["'self'"]
  },
  // 生产环境CSP（更加严格）
  production: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'"],
    imgSrc: ["'self'", "data:"],
    connectSrc: ["'self'"],
    fontSrc: ["'self'"],
    mediaSrc: ["'self'"],
    objectSrc: ["'none'"],
    frameSrc: ["'none'"],
    frameAncestors: ["'none'"],
    formAction: ["'self'"],
    baseUri: ["'self'"],
    upgradeInsecureRequests: []
  }
};

/**
 * 生成CSP策略字符串
 * @param {Object} cspObject - CSP配置对象
 * @returns {string} - CSP策略字符串
 */
export function generateCSPString(cspObject) {
  return Object.entries(cspObject)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');
}

/**
 * 获取基于环境的CSP策略
 * @param {boolean} isDev - 是否为开发环境
 * @returns {string} - CSP策略字符串
 */
export function getCSP(isDev = false) {
  const config = isDev ? cspConfig.development : cspConfig.production;
  return generateCSPString(config);
}

/**
 * 验证URL安全性
 * @param {string} url - 要验证的URL
 * @param {Array<string>} allowedDomains - 允许的域名列表
 * @returns {boolean} - URL是否安全
 */
export function isValidUrl(url, allowedDomains = []) {
  try {
    const urlObj = new URL(url);
    
    // 检查是否为允许的协议
    const allowedProtocols = ['https:', 'http:', 'file:'];
    if (!allowedProtocols.includes(urlObj.protocol)) {
      return false;
    }
    
    // 检查是否为允许的域名
    if (allowedDomains.length > 0) {
      return allowedDomains.includes(urlObj.hostname);
    }
    
    // 对于本地URL额外检查
    if (urlObj.hostname === 'localhost' || 
        urlObj.hostname === '127.0.0.1' || 
        urlObj.protocol === 'file:') {
      return true;
    }
    
    return false;
  } catch (error) {
    return false;
  }
}

/**
 * 验证文件路径安全性
 * @param {string} filePath - 要验证的文件路径
 * @param {string} baseDir - 允许的基础目录
 * @returns {boolean} - 文件路径是否安全
 */
export function isValidFilePath(filePath, baseDir) {
  const path = require('path');
  const normalizedPath = path.normalize(filePath);
  const normalizedBaseDir = path.normalize(baseDir);
  
  // 防止路径遍历攻击
  return normalizedPath.startsWith(normalizedBaseDir) && 
         !normalizedPath.includes('..') &&
         path.isAbsolute(normalizedPath);
}

/**
 * 获取安全的webPreferences配置
 * @param {Object} customPreferences - 自定义webPreferences
 * @returns {Object} - 安全的webPreferences配置
 */
export function getSecureWebPreferences(customPreferences = {}) {
  return {
    // 基础安全配置
    nodeIntegration: false,
    contextIsolation: true,
    enableRemoteModule: false,
    sandbox: true,
    webSecurity: true,
    // 禁用不安全的功能
    javascript: true,  // 通常保持启用，但列在这里以便明确控制
    allowRunningInsecureContent: false,
    plugins: false,
    experimentalFeatures: false,
    // 自定义配置可以覆盖默认值（谨慎使用）
    ...customPreferences
  };
}

/**
 * 清理用户输入，防止XSS攻击
 * @param {string} input - 用户输入
 * @returns {string} - 清理后的输入
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return input;
  }
  
  // 基本的HTML实体编码
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * 验证IPC消息，确保其符合预期格式
 * @param {*} message - 收到的IPC消息
 * @param {Object} schema - 预期的消息格式
 * @returns {boolean} - 消息是否有效
 */
export function validateIPCMessage(message, schema) {
  if (typeof message !== 'object' || message === null) {
    return false;
  }
  
  // 检查所有必需的字段
  for (const [key, type] of Object.entries(schema)) {
    if (!(key in message)) {
      return false;
    }
    
    if (typeof message[key] !== type) {
      return false;
    }
  }
  
  return true;
}

/**
 * 安全的事件处理器包装器，捕获错误并防止安全问题
 * @param {Function} handler - 原始事件处理器
 * @returns {Function} - 安全的事件处理器
 */
export function safeEventHandler(handler) {
  return function(...args) {
    try {
      return handler.apply(this, args);
    } catch (error) {
      console.error('安全事件处理器错误:', error);
      // 可以添加日志记录或其他错误处理逻辑
      return false;
    }
  };
}

/**
 * 获取安全的命令行开关配置
 * @param {boolean} isDev - 是否为开发环境
 * @returns {Array<Array<string>>} - 命令行开关配置
 */
export function getSecureCommandLineSwitches(isDev = false) {
  const switches = [
    ['no-experiments'],             // 禁用实验性功能
    ['disable-features', 'OutOfBlinkCors'], // 禁用某些不安全的功能
    ['disable-site-isolation-trials'],      // 启用站点隔离
    ['enable-features', 'IsolateOrigins,site-per-process'] // 增强隔离
  ];
  
  // 开发环境可能需要的额外配置
  if (!isDev) {
    switches.push(['disable-http-cache']); // 生产环境可能需要禁用缓存
  }
  
  return switches;
}

/**
 * 应用安全命令行开关
 * @param {Object} app - Electron应用实例
 * @param {boolean} isDev - 是否为开发环境
 */
export function applySecureCommandLineSwitches(app, isDev = false) {
  const switches = getSecureCommandLineSwitches(isDev);
  
  switches.forEach(([switchName, switchValue]) => {
    if (switchValue) {
      app.commandLine.appendSwitch(switchName, switchValue);
    } else {
      app.commandLine.appendSwitch(switchName);
    }
  });
}

/**
 * 执行安全检查
 * @param {Object} options - 检查选项
 * @returns {Object} - 检查结果
 */
export function runSecurityChecks(options = {}) {
  const { app, mainWindow } = options;
  const results = {
    passed: [],
    failed: [],
    warnings: []
  };
  
  // 检查Electron版本
  const electronVersion = process.versions.electron;
  const versionParts = electronVersion.split('.').map(Number);
  
  if (versionParts[0] < 12) {
    results.failed.push(`Electron版本 (${electronVersion}) 过旧，请更新到最新版本`);
  }
  
  // 检查app设置
  if (app && !app.isReady()) {
    results.warnings.push('应用尚未准备就绪，某些检查可能不准确');
  }
  
  // 检查mainWindow配置
  if (mainWindow && mainWindow.webContents) {
    const webPrefs = mainWindow.webContents.getWebPreferences();
    
    if (webPrefs.nodeIntegration) {
      results.failed.push('nodeIntegration已启用，存在安全风险');
    } else {
      results.passed.push('nodeIntegration已正确禁用');
    }
    
    if (!webPrefs.contextIsolation) {
      results.failed.push('contextIsolation未启用，存在安全风险');
    } else {
      results.passed.push('contextIsolation已正确启用');
    }
    
    if (webPrefs.enableRemoteModule) {
      results.failed.push('enableRemoteModule已启用，存在安全风险');
    } else {
      results.passed.push('enableRemoteModule已正确禁用');
    }
  }
  
  return results;
}

module.exports = {
  cspConfig,
  generateCSPString,
  getCSP,
  isValidUrl,
  isValidFilePath,
  getSecureWebPreferences,
  sanitizeInput,
  validateIPCMessage,
  safeEventHandler,
  getSecureCommandLineSwitches,
  applySecureCommandLineSwitches,
  runSecurityChecks
};