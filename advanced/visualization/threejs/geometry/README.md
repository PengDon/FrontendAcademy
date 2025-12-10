# Three.js 几何体

本目录包含 Three.js 中的几何体相关知识，介绍如何创建和使用不同类型的 3D 几何体。

## 内容概述

- **内置几何体**：Three.js 提供的预定义几何体
- **自定义几何体**：手动创建几何体
- **BufferGeometry**：高性能几何体
- **几何体操作**：变形、合并、分割等
- **参数化几何体**：使用参数创建复杂形状

## 学习重点

1. 掌握常用内置几何体的使用
2. 了解 BufferGeometry 的优势
3. 学会创建自定义几何体
4. 掌握几何体的基本操作

## 示例代码

```javascript
import * as THREE from 'three';

// 1. 内置几何体示例

// 立方体
const boxGeometry = new THREE.BoxGeometry(1, 1, 1); // 宽度, 高度, 深度

// 球体
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32); // 半径, 水平分段数, 垂直分段数

// 圆柱体
const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32); // 顶部半径, 底部半径, 高度, 分段数

// 圆环
const torusGeometry = new THREE.TorusGeometry(1, 0.3, 16, 100); // 半径, 管半径, 径向分段数, 管状分段数

// 平面
const planeGeometry = new THREE.PlaneGeometry(5, 5); // 宽度, 高度

// 2. BufferGeometry 示例（高性能）

const bufferGeometry = new THREE.BufferGeometry();

// 创建顶点数据
const vertices = new Float32Array([
  -1.0, -1.0, 0.0, // 顶点 0
   1.0, -1.0, 0.0, // 顶点 1
   1.0,  1.0, 0.0, // 顶点 2
  -1.0,  1.0, 0.0  // 顶点 3
]);

// 设置顶点属性
bufferGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

// 创建索引
const indices = new Uint16Array([
  0, 1, 2,
  2, 3, 0
]);

bufferGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

// 3. 自定义几何体示例

const customGeometry = new THREE.BufferGeometry();
const customVertices = [];

// 创建一个简单的波浪形状
const width = 5;
const height = 5;
const segments = 50;

for (let x = 0; x <= segments; x++) {
  for (let y = 0; y <= segments; y++) {
    const u = x / segments;
    const v = y / segments;
    
    const xPos = (u - 0.5) * width;
    const yPos = (v - 0.5) * height;
    const zPos = Math.sin(u * Math.PI * 4) * Math.cos(v * Math.PI * 4) * 0.5;
    
    customVertices.push(xPos, yPos, zPos);
  }
}

customGeometry.setAttribute('position', new THREE.Float32BufferAttribute(customVertices, 3));

// 计算法向量（用于光照）
customGeometry.computeVertexNormals();
```
