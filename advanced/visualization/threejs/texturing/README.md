# Three.js 纹理

本目录包含 Three.js 中的纹理相关知识，介绍如何使用纹理来增强 3D 对象的视觉效果。

## 内容概述

- **基础纹理**：颜色纹理、法线纹理、粗糙度纹理
- **纹理加载**：使用TextureLoader加载外部纹理
- **纹理映射**：UV映射、立方体贴图
- **纹理属性**：重复、偏移、旋转
- **高级纹理**：凹凸映射、置换映射、环境光遮蔽
- **纹理生成**：程序化生成纹理

## 学习重点

1. 掌握纹理的基本加载和使用
2. 理解不同类型纹理的作用
3. 学会配置纹理属性
4. 了解高级纹理技术

## 示例代码

```javascript
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// 创建控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// 添加光源
const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
directionalLight.position.set(5, 10, 7.5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// 创建纹理加载器
const textureLoader = new THREE.TextureLoader();

// 1. 加载基础纹理
const colorTexture = textureLoader.load('textures/color.jpg');
const normalTexture = textureLoader.load('textures/normal.jpg');
const roughnessTexture = textureLoader.load('textures/roughness.jpg');
const metalnessTexture = textureLoader.load('textures/metalness.jpg');
const aoTexture = textureLoader.load('textures/ao.jpg');

// 2. 配置纹理属性
colorTexture.wrapS = THREE.RepeatWrapping;
colorTexture.wrapT = THREE.RepeatWrapping;
colorTexture.repeat.set(2, 2); // 在 S 和 T 方向重复两次

colorTexture.offset.set(0.5, 0.5); // 偏移
colorTexture.rotation = Math.PI / 4; // 旋转
colorTexture.center.set(0.5, 0.5); // 旋转中心

colorTexture.minFilter = THREE.LinearMipmapLinearFilter; // 缩小过滤
colorTexture.magFilter = THREE.LinearFilter; // 放大过滤

// 3. 创建带纹理的材质
const texturedMaterial = new THREE.MeshStandardMaterial({
  map: colorTexture,          // 颜色纹理
  normalMap: normalTexture,   // 法线纹理
  roughnessMap: roughnessTexture, // 粗糙度纹理
  metalnessMap: metalnessTexture, // 金属度纹理
  aoMap: aoTexture,           // 环境光遮蔽纹理
  aoMapIntensity: 1.0         // 环境光遮蔽强度
});

// 4. 创建物体并应用纹理

// 地面
const groundGeometry = new THREE.PlaneGeometry(20, 20, 100, 100);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = 0;
ground.receiveShadow = true;
scene.add(ground);

// 带纹理的立方体
const boxGeometry = new THREE.BoxGeometry(2, 2, 2, 100, 100, 100);
const box = new THREE.Mesh(boxGeometry, texturedMaterial);
box.position.set(-3, 1, 0);
box.castShadow = true;
box.receiveShadow = true;
// 为环境光遮蔽纹理添加第二组UV
boxGeometry.setAttribute('uv2', new THREE.BufferAttribute(boxGeometry.attributes.uv.array, 2));
scene.add(box);

// 带纹理的球体
const sphereGeometry = new THREE.SphereGeometry(1, 100, 100);
const sphere = new THREE.Mesh(sphereGeometry, texturedMaterial);
sphere.position.set(3, 1, 0);
sphere.castShadow = true;
sphere.receiveShadow = true;
// 为环境光遮蔽纹理添加第二组UV
sphereGeometry.setAttribute('uv2', new THREE.BufferAttribute(sphereGeometry.attributes.uv.array, 2));
scene.add(sphere);

// 5. 立方体贴图示例（用于环境反射）
const cubeTextureLoader = new THREE.CubeTextureLoader();
const cubeTexture = cubeTextureLoader.load([
  'textures/skybox/right.jpg',
  'textures/skybox/left.jpg',
  'textures/skybox/top.jpg',
  'textures/skybox/bottom.jpg',
  'textures/skybox/front.jpg',
  'textures/skybox/back.jpg'
]);

// 使用立方体贴图作为环境贴图
scene.environment = cubeTexture;

// 6. 程序化生成纹理示例
const canvas = document.createElement('canvas');
canvas.width = 512;
canvas.height = 512;
const context = canvas.getContext('2d');

// 创建简单的棋盘格纹理
const size = 512;
const tileSize = 32;

for (let x = 0; x < size; x += tileSize) {
  for (let y = 0; y < size; y += tileSize) {
    context.fillStyle = ((x / tileSize) + (y / tileSize)) % 2 === 0 ? '#ffffff' : '#000000';
    context.fillRect(x, y, tileSize, tileSize);
  }
}

// 将Canvas转换为Three.js纹理
const proceduralTexture = new THREE.CanvasTexture(canvas);
proceduralTexture.needsUpdate = true;

// 创建使用程序化纹理的物体
const torusGeometry = new THREE.TorusGeometry(1, 0.3, 32, 100);
const torusMaterial = new THREE.MeshStandardMaterial({ map: proceduralTexture });
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.set(0, 1, -3);
torus.castShadow = true;
torus.receiveShadow = true;
scene.add(torus);

// 窗口大小调整
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 动画
function animate() {
  requestAnimationFrame(animate);
  
  // 旋转物体
  box.rotation.y += 0.01;
  sphere.rotation.y += 0.01;
  torus.rotation.y += 0.01;
  torus.rotation.x += 0.005;
  
  controls.update();
  renderer.render(scene, camera);
}

animate();
```
