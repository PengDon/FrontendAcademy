<!--
 * @Description: 
 * @Author: don
 * @Date: 2025-12-09 16:17:58
 * @Version: 1.0.0
 * @LastEditors: don
 * @LastEditTime: 2025-12-09 16:50:58
-->
# Three.js 基础

本目录包含 Three.js 的基础知识，是学习 Three.js 的入门部分。

## 内容概述

- **场景 (Scene)**：3D 对象的容器
- **相机 (Camera)**：透视相机和正交相机
- **渲染器 (Renderer)**：将场景渲染到页面
- **基础几何体**：简单的 3D 形状
- **基础材质**：物体的外观
- **光源**：照亮场景

## 学习重点

1. 理解 Three.js 的核心组件
2. 掌握场景、相机和渲染器的基本配置
3. 学会创建简单的 3D 对象
4. 了解基本的光照概念

## 示例代码

```javascript
// 基本 Three.js 应用结构
import * as THREE from 'three';

// 创建场景
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// 创建相机
const camera = new THREE.PerspectiveCamera(
  75, // 视野角度
  window.innerWidth / window.innerHeight, // 宽高比
  0.1, // 近平面
  1000 // 远平面
);
camera.position.z = 5;

// 创建渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 创建几何体和材质
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);

// 将立方体添加到场景
scene.add(cube);

// 动画函数
function animate() {
  requestAnimationFrame(animate);
  
  // 旋转立方体
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  
  // 渲染场景
  renderer.render(scene, camera);
}

// 开始动画
animate();

// 响应式调整
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
```
