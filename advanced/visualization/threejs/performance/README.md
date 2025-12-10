# Three.js 性能优化

本目录包含 Three.js 中的性能优化相关知识，介绍如何优化 3D 场景的渲染性能。

## 内容概述

- **渲染优化**：减少绘制调用、使用实例化渲染
- **几何体优化**：合并几何体、减少顶点数
- **材质优化**：减少材质数量、使用PBR材质
- **纹理优化**：压缩纹理、使用适当的尺寸
- **光照优化**：减少光源数量、使用光照贴图
- **阴影优化**：降低阴影贴图分辨率、减少阴影投射物
- **LOD技术**：细节层次技术
- **视锥体剔除**：只渲染可见物体
- **内存优化**：管理资源、避免内存泄漏
- **动画优化**：使用requestAnimationFrame、减少动画对象

## 学习重点

1. 掌握常用的性能优化技术
2. 理解绘制调用的概念
3. 学会使用实例化渲染
4. 了解LOD技术的应用

## 示例代码

```javascript
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// 创建场景
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 10, 20);

// 创建渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 限制像素比以提高性能
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
document.body.appendChild(renderer.domElement);

// 创建控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// 添加光源（优化：使用最少的光源）
const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
directionalLight.position.set(5, 10, 7.5);
directionalLight.castShadow = true;

// 阴影优化
 directionalLight.shadow.mapSize.width = 1024; // 降低阴影贴图分辨率
 directionalLight.shadow.mapSize.height = 1024;
 directionalLight.shadow.camera.near = 0.5;
 directionalLight.shadow.camera.far = 50;
 directionalLight.shadow.camera.left = -20;
 directionalLight.shadow.camera.right = 20;
 directionalLight.shadow.camera.top = 20;
 directionalLight.shadow.camera.bottom = -20;

scene.add(directionalLight);

// 地面
const groundGeometry = new THREE.PlaneGeometry(50, 50);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// 1. 实例化渲染（优化：大量相同物体）

const boxGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

// 创建实例化网格
const instanceCount = 1000; // 1000个实例
const instancedMesh = new THREE.InstancedMesh(boxGeometry, boxMaterial, instanceCount);

// 为每个实例设置位置
const dummy = new THREE.Object3D();

for (let i = 0; i < instanceCount; i++) {
  dummy.position.set(
    (Math.random() - 0.5) * 40,
    0.25,
    (Math.random() - 0.5) * 40
  );
  
  dummy.rotation.set(
    Math.random() * Math.PI,
    Math.random() * Math.PI,
    Math.random() * Math.PI
  );
  
  dummy.updateMatrix();
  instancedMesh.setMatrixAt(i, dummy.matrix);
}

instancedMesh.castShadow = true;
instancedMesh.receiveShadow = true;
scene.add(instancedMesh);

// 2. 几何体合并（优化：静态物体）

const mergedGeometry = new THREE.BufferGeometry();
const mergedMaterials = [];
const positions = [];
const normals = [];
const uvs = [];
const indices = [];

// 创建一些静态物体
const staticObjects = [];

for (let i = 0; i < 50; i++) {
  const geometry = new THREE.SphereGeometry(0.5, 16, 16); // 降低分段数以减少顶点
  const material = new THREE.MeshStandardMaterial({ 
    color: new THREE.Color(Math.random(), Math.random(), Math.random())
  });
  
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(
    (Math.random() - 0.5) * 40,
    1,
    (Math.random() - 0.5) * 40
  );
  
  // 更新矩阵
  mesh.updateMatrix();
  
  // 合并几何体（简化版，实际项目中应使用BufferGeometryUtils.mergeBufferGeometries）
  geometry.applyMatrix4(mesh.matrix);
  
  // 将几何体数据添加到合并数组中
  const positionArray = geometry.attributes.position.array;
  const normalArray = geometry.attributes.normal.array;
  const uvArray = geometry.attributes.uv ? geometry.attributes.uv.array : null;
  const indexArray = geometry.index ? geometry.index.array : null;
  
  const offset = positions.length / 3;
  
  for (let j = 0; j < positionArray.length; j += 3) {
    positions.push(positionArray[j], positionArray[j + 1], positionArray[j + 2]);
    normals.push(normalArray[j], normalArray[j + 1], normalArray[j + 2]);
    
    if (uvArray) {
      uvs.push(uvArray[j / 3 * 2], uvArray[j / 3 * 2 + 1]);
    }
  }
  
  if (indexArray) {
    for (let j = 0; j < indexArray.length; j++) {
      indices.push(indexArray[j] + offset);
    }
  }
  
  staticObjects.push(mesh);
}

// 创建合并后的几何体
mergedGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
mergedGeometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));

if (uvs.length > 0) {
  mergedGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
}

if (indices.length > 0) {
  mergedGeometry.setIndex(indices);
}

// 创建合并后的网格
const mergedMesh = new THREE.Mesh(mergedGeometry, new THREE.MeshStandardMaterial({ color: 0xff0000 }));
mergedMesh.castShadow = true;
mergedMesh.receiveShadow = true;
scene.add(mergedMesh);

// 3. LOD（细节层次）技术

const sphereLOD = new THREE.LOD();

// 创建不同细节层次的几何体
const highDetailGeometry = new THREE.SphereGeometry(2, 64, 64);
const mediumDetailGeometry = new THREE.SphereGeometry(2, 32, 32);
const lowDetailGeometry = new THREE.SphereGeometry(2, 16, 16);

const material = new THREE.MeshStandardMaterial({ color: 0x0000ff });

// 创建不同细节的网格
const highDetailMesh = new THREE.Mesh(highDetailGeometry, material);
const mediumDetailMesh = new THREE.Mesh(mediumDetailGeometry, material);
const lowDetailMesh = new THREE.Mesh(lowDetailGeometry, material);

// 添加到LOD对象并设置距离阈值
sphereLOD.addLevel(highDetailMesh, 0);      // 距离0-10时显示高细节
sphereLOD.addLevel(mediumDetailMesh, 10);   // 距离10-20时显示中细节
sphereLOD.addLevel(lowDetailMesh, 20);      // 距离20以上时显示低细节

sphereLOD.position.set(0, 2, 0);
sphereLOD.castShadow = true;
sphereLOD.receiveShadow = true;
scene.add(sphereLOD);

// 4. 纹理优化示例

// 使用适当尺寸的纹理（优化：避免使用过大的纹理）
const textureLoader = new THREE.TextureLoader();

// 预加载并压缩纹理（实际项目中应使用压缩纹理格式如basis）
const texture = textureLoader.load('textures/optimized-texture.jpg', (loadedTexture) => {
  loadedTexture.generateMipmaps = true;
  loadedTexture.minFilter = THREE.LinearMipmapLinearFilter;
  loadedTexture.magFilter = THREE.LinearFilter;
  loadedTexture.wrapS = THREE.RepeatWrapping;
  loadedTexture.wrapT = THREE.RepeatWrapping;
});

const texturedBoxGeometry = new THREE.BoxGeometry(5, 5, 5);
const texturedBoxMaterial = new THREE.MeshStandardMaterial({ map: texture });
const texturedBox = new THREE.Mesh(texturedBoxGeometry, texturedBoxMaterial);
texturedBox.position.set(0, 2.5, 0);
texturedBox.castShadow = true;
texturedBox.receiveShadow = true;
scene.add(texturedBox);

// 窗口大小调整
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 性能监控
const stats = new Stats();
document.body.appendChild(stats.dom);

// 动画循环
function animate() {
  requestAnimationFrame(animate);
  
  // 更新控制器
  controls.update();
  
  // 更新LOD（必须在动画循环中调用）
  sphereLOD.update(camera);
  
  // 更新实例化网格（如果需要动画）
  const time = Date.now() * 0.001;
  const dummy = new THREE.Object3D();
  
  for (let i = 0; i < instanceCount; i++) {
    dummy.position.set(
      (Math.random() - 0.5) * 40,
      0.25 + Math.sin(time + i * 0.1) * 0.5,
      (Math.random() - 0.5) * 40
    );
    
    dummy.rotation.set(
      time + i * 0.1,
      time + i * 0.2,
      time + i * 0.3
    );
    
    dummy.updateMatrix();
    instancedMesh.setMatrixAt(i, dummy.matrix);
  }
  
  instancedMesh.instanceMatrix.needsUpdate = true;
  
  // 渲染场景
  renderer.render(scene, camera);
  
  // 更新性能统计
  stats.update();
}

// 启动动画
animate();
```
