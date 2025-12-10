# React Native 导航系统

本目录包含React Native的导航系统相关知识，主要介绍React Navigation库的使用。

## 内容概述

- **React Navigation**: 导航库的安装和基本配置
- **Stack Navigator**: 堆栈导航，实现页面间的推入和弹出
- **Tab Navigator**: 标签导航，实现底部或顶部标签切换
- **Drawer Navigator**: 抽屉导航，实现侧边栏菜单
- **Nested Navigation**: 嵌套导航，组合多种导航方式
- **Deep Linking**: 深度链接，从外部应用跳转到应用内部页面

## 学习重点

1. 掌握React Navigation的基本配置
2. 学会使用Stack、Tab、Drawer等导航器
3. 掌握导航参数传递
4. 了解嵌套导航的使用场景

## 示例代码

```javascript
// Stack Navigator示例
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';

export type RootStackParamList = {
  Home: undefined;
  Details: { itemId: number; otherParam?: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: '首页' }}
        />
        <Stack.Screen 
          name="Details" 
          component={DetailsScreen} 
          options={({ route }) => ({ 
            title: `详情页 ${route.params.itemId}` 
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
```
