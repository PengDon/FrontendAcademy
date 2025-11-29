// 通用工具函数
// 此文件包含环境检测、路径处理、字符串操作等通用辅助功能

const os = require('os');
const path = require('path');
const fs = require('fs');
const { app } = require('electron');

/**
 * 环境检测相关函数
 */

// 检测是否为开发环境
exports.isDev = process.env.NODE_ENV !== 'production' && 
                 process.env.NODE_ENV !== 'staging';

// 检测操作系统
exports.isMac = process.platform === 'darwin';
exports.isWindows = process.platform === 'win32';
exports.isLinux = process.platform === 'linux';

// 检测系统架构
exports.isX64 = process.arch === 'x64';
exports.isArm = process.arch === 'arm' || process.arch === 'arm64';
exports.isIa32 = process.arch === 'ia32';

// 检测是否支持特定功能
exports.supportsTouchEvents = () => {
  // 在主进程中，这个检测需要通过IPC从渲染进程获取
  return false;
};

exports.supportsDarkMode = () => {
  // 在主进程中，这个检测需要通过IPC从渲染进程获取
  return false;
};

/**
 * 路径处理相关函数
 */

// 获取应用数据目录
exports.getAppDataPath = () => {
  try {
    return app.getPath('userData');
  } catch (error) {
    console.error('获取应用数据路径失败:', error);
    return path.join(os.homedir(), '.electron-example');
  }
};

// 获取配置文件路径
exports.getConfigFilePath = () => {
  const appDataPath = exports.getAppDataPath();
  return path.join(appDataPath, 'config.json');
};

// 获取日志文件路径
exports.getLogFilePath = () => {
  const appDataPath = exports.getAppDataPath();
  return path.join(appDataPath, 'logs', 'app.log');
};

// 确保目录存在
exports.ensureDirectoryExists = (dirPath) => {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      return true;
    }
    return true;
  } catch (error) {
    console.error(`创建目录失败 ${dirPath}:`, error);
    return false;
  }
};

// 安全地连接路径（防止路径遍历攻击）
exports.safeJoin = (basePath, relativePath) => {
  const targetPath = path.resolve(basePath, relativePath);
  
  // 确保生成的路径仍然在基础路径内
  if (!targetPath.startsWith(basePath)) {
    throw new Error('路径遍历攻击检测到');
  }
  
  return targetPath;
};

/**
 * 文件操作相关函数
 */

// 安全地读取JSON文件
exports.readJsonFile = (filePath, defaultValue = null) => {
  try {
    if (!fs.existsSync(filePath)) {
      return defaultValue;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`读取JSON文件失败 ${filePath}:`, error);
    return defaultValue;
  }
};

// 安全地写入JSON文件
exports.writeJsonFile = (filePath, data, options = {}) => {
  try {
    // 确保目录存在
    const dirPath = path.dirname(filePath);
    exports.ensureDirectoryExists(dirPath);
    
    const jsonString = JSON.stringify(data, null, options.indent || 2);
    fs.writeFileSync(filePath, jsonString, 'utf8');
    return true;
  } catch (error) {
    console.error(`写入JSON文件失败 ${filePath}:`, error);
    return false;
  }
};

// 备份文件
exports.backupFile = (filePath, backupDir = null) => {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const backupPath = backupDir || path.dirname(filePath);
    const fileName = path.basename(filePath);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `${fileName}.${timestamp}.bak`;
    const backupFilePath = path.join(backupPath, backupFileName);
    
    // 确保备份目录存在
    exports.ensureDirectoryExists(backupPath);
    
    fs.copyFileSync(filePath, backupFilePath);
    return backupFilePath;
  } catch (error) {
    console.error(`备份文件失败 ${filePath}:`, error);
    return null;
  }
};

/**
 * 配置管理相关函数
 */

// 配置对象
let configCache = null;

// 加载配置
exports.loadConfig = (forceReload = false) => {
  if (configCache && !forceReload) {
    return configCache;
  }
  
  const configPath = exports.getConfigFilePath();
  const defaultConfig = {
    version: app.getVersion(),
    lastUpdated: new Date().toISOString(),
    windowState: {
      width: 800,
      height: 600,
      maximized: false,
      fullscreen: false
    },
    theme: 'light',
    language: 'zh-CN',
    autoUpdate: true,
    checkUpdatesOnStartup: true,
    updateChannel: 'stable',
    notifications: true,
    logging: {
      enabled: true,
      level: 'info'
    }
  };
  
  const loadedConfig = exports.readJsonFile(configPath, defaultConfig);
  configCache = { ...defaultConfig, ...loadedConfig };
  
  return configCache;
};

// 保存配置
exports.saveConfig = (newConfig) => {
  const configPath = exports.getConfigFilePath();
  const currentConfig = exports.loadConfig();
  
  // 合并新配置
  const updatedConfig = {
    ...currentConfig,
    ...newConfig,
    version: app.getVersion(),
    lastUpdated: new Date().toISOString()
  };
  
  // 写入文件
  const success = exports.writeJsonFile(configPath, updatedConfig);
  
  if (success) {
    configCache = updatedConfig;
  }
  
  return success;
};

// 获取特定配置项
exports.getConfig = (key, defaultValue = null) => {
  const config = exports.loadConfig();
  
  // 支持点符号路径（如 'logging.level'）
  if (key.includes('.')) {
    const keys = key.split('.');
    let value = config;
    
    for (const k of keys) {
      if (value === null || typeof value !== 'object') {
        return defaultValue;
      }
      value = value[k];
    }
    
    return value !== undefined ? value : defaultValue;
  }
  
  return config[key] !== undefined ? config[key] : defaultValue;
};

// 设置特定配置项
exports.setConfig = (key, value) => {
  const config = exports.loadConfig();
  
  // 支持点符号路径（如 'logging.level'）
  if (key.includes('.')) {
    const keys = key.split('.');
    let current = config;
    
    // 遍历到倒数第二个键
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!current[k] || typeof current[k] !== 'object') {
        current[k] = {};
      }
      current = current[k];
    }
    
    // 设置最后一个键的值
    current[keys[keys.length - 1]] = value;
  } else {
    config[key] = value;
  }
  
  return exports.saveConfig(config);
};

/**
 * 字符串处理相关函数
 */

// 格式化日期时间
exports.formatDateTime = (date = new Date()) => {
  const d = new Date(date);
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

// 格式化文件大小
exports.formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 截断文本
exports.truncateText = (text, maxLength, suffix = '...') => {
  if (!text || text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength - suffix.length) + suffix;
};

// 验证邮箱格式
exports.isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 验证URL格式
exports.isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * 系统信息相关函数
 */

// 获取系统信息
exports.getSystemInfo = () => {
  return {
    platform: process.platform,
    arch: process.arch,
    electronVersion: process.versions.electron,
    nodeVersion: process.versions.node,
    chromeVersion: process.versions.chrome,
    osType: os.type(),
    osRelease: os.release(),
    osArch: os.arch(),
    totalMemory: os.totalmem(),
    freeMemory: os.freemem(),
    cpuCount: os.cpus().length,
    userInfo: os.userInfo()
  };
};

// 获取应用信息
exports.getAppInfo = () => {
  return {
    name: app.name || 'Electron示例应用',
    version: app.getVersion(),
    electronVersion: process.versions.electron,
    appDataPath: exports.getAppDataPath(),
    isDev: exports.isDev,
    platform: process.platform,
    arch: process.arch
  };
};

/**
 * 错误处理相关函数
 */

// 格式化错误信息
exports.formatError = (error) => {
  if (!error) return '';
  
  if (typeof error === 'string') {
    return error;
  }
  
  return error.message || error.toString();
};

// 创建错误对象
exports.createError = (message, code = null, details = null) => {
  const error = new Error(message);
  if (code) {
    error.code = code;
  }
  if (details) {
    error.details = details;
  }
  return error;
};

// 重试函数
exports.retry = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) {
      throw error;
    }
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return exports.retry(fn, retries - 1, delay * 2);
  }
};

/**
 * 缓存相关函数
 */

const memoryCache = new Map();

// 设置内存缓存
exports.setCache = (key, value, ttl = 3600000) => { // 默认1小时
  const item = {
    value,
    expiry: Date.now() + ttl
  };
  memoryCache.set(key, item);
  return true;
};

// 获取内存缓存
exports.getCache = (key) => {
  const item = memoryCache.get(key);
  
  if (!item) {
    return null;
  }
  
  // 检查是否过期
  if (Date.now() > item.expiry) {
    memoryCache.delete(key);
    return null;
  }
  
  return item.value;
};

// 删除内存缓存
exports.deleteCache = (key) => {
  return memoryCache.delete(key);
};

// 清空内存缓存
exports.clearCache = () => {
  memoryCache.clear();
  return true;
};

/**
 * 性能监控相关函数
 */

// 性能计时
exports.performanceTimer = (name) => {
  const startTime = process.hrtime.bigint();
  
  return {
    end: () => {
      const endTime = process.hrtime.bigint();
      const duration = Number(endTime - startTime) / 1000000; // 转换为毫秒
      return {
        name,
        duration: duration.toFixed(2) + 'ms'
      };
    }
  };
};

// 节流函数
exports.throttle = (func, delay) => {
  let inThrottle;
  return function() {
    const context = this;
    const args = arguments;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, delay);
    }
  };
};

// 防抖函数
exports.debounce = (func, delay) => {
  let debounceTimer;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  };
};

// 初始化函数
exports.initialize = () => {
  // 确保必要的目录存在
  const appDataPath = exports.getAppDataPath();
  const logDir = path.join(appDataPath, 'logs');
  const cacheDir = path.join(appDataPath, 'cache');
  
  exports.ensureDirectoryExists(appDataPath);
  exports.ensureDirectoryExists(logDir);
  exports.ensureDirectoryExists(cacheDir);
  
  // 加载配置
  exports.loadConfig();
  
  console.log('工具函数初始化完成');
};

// 导出所有函数作为命名导出
module.exports = exports;

// 导出默认对象
module.exports.default = exports;