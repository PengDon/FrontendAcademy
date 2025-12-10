# React Native 网络请求

本目录包含React Native的网络请求相关知识，介绍如何在React Native应用中进行API调用和数据处理。

## 内容概述

- **Fetch API**: React Native内置的网络请求API
- **Axios**: 流行的第三方网络请求库
- **API封装**: 如何封装网络请求以提高代码复用性
- **数据处理**: 如何处理API返回的数据
- **错误处理**: 网络错误和服务器错误的处理
- **缓存策略**: 如何缓存网络请求结果

## 学习重点

1. 掌握Fetch API和Axios的使用
2. 学会封装网络请求
3. 掌握错误处理和数据处理的技巧
4. 了解缓存策略的应用

## 示例代码

```javascript
// Axios实例封装示例
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// 创建Axios实例
const apiClient: AxiosInstance = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 在发送请求之前做些什么，例如添加token
    const token = 'your-auth-token';
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // 处理请求错误
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 对响应数据做点什么
    return response.data;
  },
  (error) => {
    // 处理响应错误
    if (error.response) {
      // 服务器返回错误状态码
      console.error('Response error:', error.response.data);
    } else if (error.request) {
      // 请求已发出但没有收到响应
      console.error('Request error:', error.request);
    } else {
      // 请求配置错误
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// 导出API函数
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) => apiClient.get<T>(url, config),
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => apiClient.post<T>(url, data, config),
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => apiClient.put<T>(url, data, config),
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => apiClient.delete<T>(url, config),
};

export default apiClient;
```
