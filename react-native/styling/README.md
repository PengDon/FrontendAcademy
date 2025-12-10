# React Native 样式系统

本目录包含React Native的样式系统相关知识，介绍如何在React Native中实现UI样式。

## 内容概述

- **StyleSheet API**: React Native的样式表API
- **Flexbox布局**: Flexbox布局在React Native中的应用
- **响应式设计**: 适配不同屏幕尺寸
- **主题管理**: 实现应用主题切换
- **第三方样式库**: 如Styled Components、Tailwind CSS等

## 学习重点

1. 掌握StyleSheet API的使用
2. 熟练使用Flexbox布局
3. 学会实现响应式设计
4. 了解主题管理的实现方式

## 示例代码

```javascript
// 样式示例
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const StyledComponent = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>卡片标题</Text>
        <Text style={styles.content}>这是卡片内容，展示了React Native的样式系统。</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: width * 0.9,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  content: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
  },
});

export default StyledComponent;
```
