# Three.js 交互

本目录包含 Three.js 中的交互相关知识，介绍如何实现 3D 场景中的用户交互功能。

## 内容概述

- **鼠标交互**：射线检测、点击事件、拖拽操作
- **触摸交互**：触摸事件处理、手势识别
- **键盘控制**：键盘事件处理
- **控制器**：OrbitControls、TrackballControls等
- **射线投射**：Raycaster的使用
- **交互反馈**：高亮显示、动画反馈
- **性能优化**：大量物体的交互优化

## 学习重点

1. 掌握Raycaster的使用方法
2. 理解鼠标事件与3D空间的映射
3. 学会实现点击、拖拽等交互
4. 了解各种控制器的应用场景

## 示例代码

```javascript
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// 创建场景
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 3, 8);

// 创建渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 创建控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// 添加光源
const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// 1. 射线投射器（用于检测物体）
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// 2. 创建可交互的物体
const objects = [];

// 创建随机位置的立方体
for (let i = 0; i < 20; i++) {
  const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const material = new THREE.MeshStandardMaterial({
    color: Math.random() * 0xffffff,
    transparent: true,
    opacity: 0.8
  });
  const cube = new THREE.Mesh(geometry, material);
  
  // 随机位置
  cube.position.x = (Math.random() - 0.5) * 10;
  cube.position.y = (Math.random() - 0.5) * 6;
  cube.position.z = (Math.random() - 0.5) * 10;
  
  // 随机旋转
  cube.rotation.x = Math.random() * Math.PI;
  cube.rotation.y = Math.random() * Math.PI;
  cube.rotation.z = Math.random() * Math.PI;
  
  objects.push(cube);
  scene.add(cube);
}

// 3. 创建一个平面用于交互
const planeGeometry = new THREE.PlaneGeometry(20, 20);
const planeMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

// 4. 鼠标事件处理
let selectedObject = null;
let isDragging = false;
let dragPlaneIntersect = null;

// 鼠标移动事件
window.addEventListener('mousemove', (event) => {
  // 计算鼠标在标准化设备坐标中的位置
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
  // 更新射线
  raycaster.setFromCamera(mouse, camera);
  
  if (isDragging && selectedObject) {
    // 拖拽物体
    const intersects = raycaster.intersectObject(plane);
    if (intersects.length > 0) {
      selectedObject.position.copy(intersects[0].point);
    }
  } else {
    // 高亮效果
    const intersects = raycaster.intersectObjects(objects);
    
    // 重置所有物体的颜色和大小
    objects.forEach(obj => {
      obj.material.color.set(obj.userData.originalColor);
      obj.scale.set(1, 1, 1);
    });
    
    // 高亮相交的物体
    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object;
      intersectedObject.material.color.set(0xffffff);
      intersectedObject.scale.set(1.2, 1.2, 1.2);
      
      // 改变鼠标样式
      document.body.style.cursor = 'pointer';
    } else {
      // 恢复鼠标样式
      document.body.style.cursor = 'default';
    }
  }
});

// 鼠标点击事件
window.addEventListener('mousedown', (event) => {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(objects);
  
  if (intersects.length > 0) {
    selectedObject = intersects[0].object;
    isDragging = true;
    
    // 记录拖拽平面的交点
    const planeIntersects = raycaster.intersectObject(plane);
    if (planeIntersects.length > 0) {
      dragPlaneIntersect = planeIntersects[0].point;
    }
  }
});

// 鼠标释放事件
window.addEventListener('mouseup', () => {
  isDragging = false;
  selectedObject = null;
});

// 5. 键盘事件处理
window.addEventListener('keydown', (event) => {
  const speed = 0.1;
  
  switch (event.key) {
    case 'ArrowUp':
      camera.position.y += speed;
      break;
    case 'ArrowDown':
      camera.position.y -= speed;
      break;
    case 'ArrowLeft':
      camera.position.x -= speed;
      break;
    case 'ArrowRight':
      camera.position.x += speed;
      break;
    case 'w':
    case 'W':
      camera.position.z -= speed;
      break;
    case 's':
    case 'S':
      camera.position.z += speed;
      break;
    case 'r':
    case 'R':
      // 重置相机位置
      camera.position.set(0, 3, 8);
      break;
  }
});

// 6. 保存原始颜色
objects.forEach(obj => {
  obj.userData.originalColor = obj.material.color.clone();
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
  
  // 旋转所有物体
  objects.forEach(obj => {
    if (obj !== selectedObject) {
      obj.rotation.x += 0.01;
      obj.rotation.y += 0.01;
    }
  });
  
  controls.update();
  renderer.render(scene, camera);
}

animate();
```
