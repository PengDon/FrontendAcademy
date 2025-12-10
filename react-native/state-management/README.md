# React Native 状态管理

本目录包含React Native的状态管理相关知识，介绍常用的状态管理方案。

## 内容概述

- **React Context API**: React内置的状态管理方案
- **Redux**: 传统的状态管理库
- **Redux Toolkit**: Redux的官方工具集，简化Redux使用
- **MobX**: 基于响应式编程的状态管理库
- **Zustand**: 轻量级状态管理库
- **Recoil**: Facebook推出的状态管理库

## 学习重点

1. 理解状态管理的核心概念
2. 掌握至少一种状态管理库的使用
3. 了解不同状态管理方案的优缺点
4. 学会在实际项目中选择合适的状态管理方案

## 示例代码

```javascript
// Redux Toolkit示例
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CounterState {
  value: number;
}

const initialState: CounterState = {
  value: 0,
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```
