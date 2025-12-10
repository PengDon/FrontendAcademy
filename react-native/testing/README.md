# React Native 测试

本目录包含React Native的测试相关知识，介绍如何测试React Native应用。

## 内容概述

- **单元测试**: 测试组件和函数的单元功能
- **集成测试**: 测试组件之间的交互
- **端到端测试**: 测试整个应用流程
- **测试工具**: Jest、React Testing Library、Detox等
- **测试策略**: 如何制定测试计划

## 学习重点

1. 掌握单元测试的编写方法
2. 学会使用测试工具
3. 了解集成测试和端到端测试
4. 掌握测试策略的制定

## 示例代码

```javascript
// 单元测试示例
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomButton from '../components/CustomButton';

describe('CustomButton Component', () => {
  it('renders correctly with title', () => {
    const { getByText } = render(<CustomButton title="Test Button" onPress={() => {}} />);
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<CustomButton title="Test Button" onPress={onPressMock} />);
    
    fireEvent.press(getByText('Test Button'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('displays correctly when disabled', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <CustomButton title="Test Button" onPress={onPressMock} disabled />
    );
    
    const button = getByText('Test Button');
    fireEvent.press(button);
    expect(onPressMock).not.toHaveBeenCalled();
  });
});
```
