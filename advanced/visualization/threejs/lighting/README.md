# Three.js 光照

本目录包含 Three.js 中的光照相关知识，介绍如何使用不同类型的光源来照亮 3D 场景。

## 内容概述

- **环境光**：均匀照亮场景的基础光源
- **平行光**：模拟太阳光的方向性光源
- **点光源**：向各个方向发光的点光源
- **聚光灯**：类似手电筒的锥形光源
- **半球光**：模拟天空和地面反射的光源
- **面积光**：柔和的大面积光源
- **光源属性**：颜色、强度、阴影等
- **光照与材质的关系**

## 学习重点

1. 理解不同光源的特性和适用场景
2. 掌握光源属性的配置
3. 了解如何实现阴影效果
4. 学会组合使用多种光源

## 示例代码

```javascript
import * as THREE from 'three';

// 创建场景
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

// 创建渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 启用阴影
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 柔和阴影

// 1. 环境光（基础照明）
const ambientLight = new THREE.AmbientLight(0x404040, 0.5); // 颜色, 强度
scene.add(ambientLight);

// 2. 平行光（模拟太阳光）
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
directionalLight.position.set(5, 10, 7.5);
directionalLight.castShadow = true; // 投射阴影

// 配置阴影
 directionalLight.shadow.mapSize.width = 2048;
 directionalLight.shadow.mapSize.height = 2048;
 directionalLight.shadow.camera.near = 0.5;
 directionalLight.shadow.camera.far = 50;
 directionalLight.shadow.camera.left = -10;
 directionalLight.shadow.camera.right = 10;
 directionalLight.shadow.camera.top = 10;
 directionalLight.shadow.camera.bottom = -10;

scene.add(directionalLight);

// 3. 点光源（类似灯泡）
const pointLight = new THREE.PointLight(0xff0000, 1.0, 100);
pointLight.position.set(0, 5, 0);
pointLight.castShadow = true;

// 配置点光源阴影
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;

scene.add(pointLight);

// 4. 聚光灯（类似手电筒）
const spotLight = new THREE.SpotLight(0xffff00, 1.0);
spotLight.position.set(0, 10, 0);
spotLight.angle = Math.PI / 6; // 聚光角（弧度）
spotLight.penumbra = 0.1; // 半影衰减（0-1）
spotLight.decay = 2; // 衰减率
spotLight.distance = 20; // 最大距离
spotLight.target.position.set(0, 0, 0);
spotLight.castShadow = true;

// 配置聚光灯阴影
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 20;
spotLight.shadow.camera.fov = 30;

scene.add(spotLight);
scene.add(spotLight.target);

// 5. 半球光（模拟环境光）
const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.5);
// 第一个参数：天空颜色
// 第二个参数：地面颜色
// 第三个参数：强度
scene.add(hemisphereLight);

// 6. 面积光（柔和大面积光源）
const areaLight = new THREE.RectAreaLight(0xffffff, 10, 2, 2);
areaLight.position.set(0, 5, 0);
areaLight.rotation.x = -Math.PI / 2;
scene.add(areaLight);

// 创建物体

// 地面
const groundGeometry = new THREE.PlaneGeometry(20, 20);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = 0;
ground.receiveShadow = true;
scene.add(ground);

// 立方体
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(-2, 0.5, 0);
box.castShadow = true;
box.receiveShadow = true;
scene.add(box);

// 球体
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(0, 0.5, 0);
sphere.castShadow = true;
sphere.receiveShadow = true;
scene.add(sphere);

// 圆柱体
const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
const cylinderMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
cylinder.position.set(2, 0.5, 0);
cylinder.castShadow = true;
cylinder.receiveShadow = true;
scene.add(cylinder);

// 动画
function animate() {
  requestAnimationFrame(animate);
  
  // 旋转物体
  box.rotation.y += 0.01;
  sphere.rotation.y += 0.01;
  cylinder.rotation.y += 0.01;
  
  renderer.render(scene, camera);
}

animate();
```
