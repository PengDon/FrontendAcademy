# Three.js 示例项目

本目录包含 Three.js 的示例项目和应用案例，帮助你学习如何将 Three.js 应用到实际项目中。

## 内容概述

- **基础应用**：简单的 Three.js 入门示例
- **交互应用**：带有用户交互的 3D 场景
- **数据可视化**：使用 Three.js 进行数据可视化
- **游戏开发**：基于 Three.js 的简单游戏
- **WebXR 应用**：VR/AR 应用示例
- **实用工具**：Three.js 实用工具和辅助函数

## 学习重点

1. 学习如何组织 Three.js 项目结构
2. 掌握 Three.js 的实际应用场景
3. 理解如何结合其他库使用 Three.js
4. 学习完整项目的开发流程

## 示例项目结构

```
examples/
├── basic-app/            # 基础 Three.js 应用
├── interactive-scene/    # 交互式 3D 场景
├── data-visualization/   # 数据可视化示例
├── game-development/     # 游戏开发示例
├── webxr-app/            # WebXR 应用示例
└── utils/                # 实用工具和辅助函数
```

## 基础应用示例

```javascript
// 这是一个基本的 Three.js 应用示例
// 包含场景、相机、渲染器和基本几何体

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// 创建场景
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);

// 创建相机
const camera = new THREE.PerspectiveCamera(
  75, 
  window.innerWidth / window.innerHeight, 
  0.1, 
  1000
);
camera.position.set(5, 5, 5);

// 创建渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// 创建控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// 添加光源
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// 添加几何体
const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshStandardMaterial({ 
  color: 0x4a4e69,
  metalness: 0.3,
  roughness: 0.4
});

const cube = new THREE.Mesh(geometry, material);
cube.position.set(0, 1, 0);
scene.add(cube);

// 添加地面
const groundGeometry = new THREE.PlaneGeometry(20, 20);
const groundMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x2a2d43,
  roughness: 0.8
});

const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// 窗口大小调整
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 动画循环
function animate() {
  requestAnimationFrame(animate);
  
  // 更新控制器
  controls.update();
  
  // 旋转立方体
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  
  // 渲染场景
  renderer.render(scene, camera);
}

// 启动动画
animate();
```

## 交互式场景示例

```javascript
// 这是一个带有用户交互的 Three.js 场景示例
// 用户可以点击和拖拽场景中的物体

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Raycaster } from 'three';

// 创建场景
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);

// 创建相机
const camera = new THREE.PerspectiveCamera(
  75, 
  window.innerWidth / window.innerHeight, 
  0.1, 
  1000
);
camera.position.set(10, 10, 10);

// 创建渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// 创建控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// 添加光源
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// 添加多个几何体
const objects = [];
const colors = [0xe76f51, 0x2a9d8f, 0xe9c46a, 0xf4a261, 0x264653];

for (let i = 0; i < 10; i++) {
  const geometry = new THREE.SphereGeometry(0.5, 32, 32);
  const material = new THREE.MeshStandardMaterial({ 
    color: colors[i % colors.length],
    metalness: 0.3,
    roughness: 0.4
  });
  
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(
    (Math.random() - 0.5) * 10,
    0.5,
    (Math.random() - 0.5) * 10
  );
  
  scene.add(sphere);
  objects.push(sphere);
}

// 添加地面
const groundGeometry = new THREE.PlaneGeometry(20, 20);
const groundMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x2a2d43,
  roughness: 0.8
});

const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// 射线投射器
const raycaster = new Raycaster();
const mouse = new THREE.Vector2();
let selectedObject = null;

// 鼠标移动事件
window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
  // 如果有选中的物体，更新其位置
  if (selectedObject) {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(ground);
    
    if (intersects.length > 0) {
      selectedObject.position.copy(intersects[0].point);
      selectedObject.position.y = 0.5;
    }
  }
});

// 鼠标点击事件
window.addEventListener('click', () => {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(objects);
  
  if (intersects.length > 0) {
    // 如果点击了物体，选中它
    if (selectedObject) {
      selectedObject.material.emissive.set(0x000000);
    }
    
    selectedObject = intersects[0].object;
    selectedObject.material.emissive.set(0x333333);
  } else {
    // 如果点击了空白区域，取消选中
    if (selectedObject) {
      selectedObject.material.emissive.set(0x000000);
      selectedObject = null;
    }
  }
});

// 窗口大小调整
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 动画循环
function animate() {
  requestAnimationFrame(animate);
  
  // 更新控制器
  controls.update();
  
  // 渲染场景
  renderer.render(scene, camera);
}

// 启动动画
animate();
```

## 数据可视化示例

```javascript
// 这是一个使用 Three.js 进行数据可视化的示例
// 使用柱状图展示数据

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// 创建场景
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);

// 创建相机
const camera = new THREE.PerspectiveCamera(
  75, 
  window.innerWidth / window.innerHeight, 
  0.1, 
  1000
);
camera.position.set(15, 15, 15);

// 创建渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// 创建控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// 添加光源
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// 模拟数据
const data = [
  { label: 'A', value: 10 },
  { label: 'B', value: 20 },
  { label: 'C', value: 15 },
  { label: 'D', value: 25 },
  { label: 'E', value: 18 },
  { label: 'F', value: 30 },
  { label: 'G', value: 22 },
  { label: 'H', value: 16 },
  { label: 'I', value: 28 },
  { label: 'J', value: 20 }
];

// 创建柱状图
const barWidth = 0.8;
const barSpacing = 0.2;
const group = new THREE.Group();

// 为每个数据点创建一个柱子
for (let i = 0; i < data.length; i++) {
  const value = data[i].value;
  const geometry = new THREE.BoxGeometry(barWidth, value, barWidth);
  const material = new THREE.MeshStandardMaterial({ 
    color: new THREE.Color(
      0.5 + Math.random() * 0.5,
      0.2 + Math.random() * 0.3,
      0.7 + Math.random() * 0.3
    ),
    metalness: 0.3,
    roughness: 0.4
  });
  
  const bar = new THREE.Mesh(geometry, material);
  bar.position.set(
    (i - data.length / 2) * (barWidth + barSpacing) + (barWidth + barSpacing) / 2,
    value / 2,
    0
  );
  
  group.add(bar);
}

scene.add(group);

// 添加地面
const groundGeometry = new THREE.PlaneGeometry(30, 30);
const groundMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x2a2d43,
  roughness: 0.8
});

const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.1;
scene.add(ground);

// 窗口大小调整
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 动画循环
function animate() {
  requestAnimationFrame(animate);
  
  // 更新控制器
  controls.update();
  
  // 旋转整个柱状图组
  group.rotation.y += 0.005;
  
  // 渲染场景
  renderer.render(scene, camera);
}

// 启动动画
animate();
```

## 运行示例

1. 确保已安装 Node.js 和 npm
2. 在示例目录中运行 `npm install` 安装依赖
3. 运行 `npm run dev` 启动开发服务器
4. 在浏览器中打开 `http://localhost:3000` 查看示例

## 推荐资源

- [Three.js 官方示例](https://threejs.org/examples/)
- [Three.js 文档](https://threejs.org/docs/)
- [Three.js 教程](https://threejs.org/manual/)
- [Three.js 社区](https://discourse.threejs.org/)
