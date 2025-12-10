# React Native 核心概念

本目录包含React Native的核心概念和基础知识，是学习React Native的入门部分。

## 内容概述

- **JSX与组件**: React Native使用JSX语法和组件化开发模式
- **Props与State**: 组件间通信和内部状态管理
- **生命周期**: 组件的生命周期方法和钩子
- **样式系统**: React Native的样式实现方式
- **布局系统**: Flexbox布局在React Native中的应用
- **平台特定代码**: 如何处理iOS和Android平台差异

## 学习重点

1. 理解组件化开发思想
2. 掌握Props和State的使用
3. 熟悉React Native的样式和布局系统
4. 了解平台差异处理方法

## 示例代码

```javascript
// 简单组件示例
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HelloWorld = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello, React Native!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default HelloWorld;
```
