# React Native 组件开发

本目录包含React Native的组件开发相关知识，包括基础组件、自定义组件和组件最佳实践。

## 内容概述

- **基础组件**: View、Text、Image、TextInput等原生组件
- **列表组件**: FlatList、SectionList的使用和优化
- **表单组件**: 表单处理和验证
- **自定义组件**: 如何创建可复用的自定义组件
- **组件模式**: HOC、Render Props等组件设计模式

## 学习重点

1. 掌握基础组件的使用方法
2. 学会高效使用列表组件
3. 掌握表单处理技巧
4. 学会创建可复用的自定义组件

## 示例代码

```javascript
// 自定义按钮组件示例
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

const CustomButton = ({ title, onPress, style, textStyle, disabled = false }: ButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, disabled && styles.disabledText, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    backgroundColor: '#CCCCCC',
  },
  disabledText: {
    color: '#666666',
  },
});

export default CustomButton;
```
