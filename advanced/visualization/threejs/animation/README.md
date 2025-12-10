# Three.js 动画

本目录包含 Three.js 中的动画相关知识，介绍如何创建和控制 3D 场景中的动画效果。

## 内容概述

- **基础动画**：使用requestAnimationFrame实现的基础动画
- **属性动画**：位置、旋转、缩放等属性的动画
- **关键帧动画**：使用KeyframeTrack和AnimationClip实现的复杂动画
- **骨骼动画**：用于人物和角色的骨骼动画
- **动画控制器**：使用AnimationMixer和AnimationAction控制动画
- **物理动画**：结合物理引擎的动画
- **性能优化**：动画性能优化技巧

## 学习重点

1. 掌握基础动画的实现方法
2. 理解关键帧动画的原理
3. 学会使用动画控制器
4. 了解骨骼动画的基本概念

## 示例代码

```javascript
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

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

// 1. 基础动画示例

// 创建一个旋转的立方体
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const rotatingBox = new THREE.Mesh(boxGeometry, boxMaterial);
rotatingBox.position.set(-2, 1, 0);
scene.add(rotatingBox);

// 创建一个上下移动的球体
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const bouncingSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
bouncingSphere.position.set(0, 1, 0);
scene.add(bouncingSphere);

// 2. 关键帧动画示例

const torusGeometry = new THREE.TorusGeometry(1, 0.3, 32, 100);
const torusMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
const animatedTorus = new THREE.Mesh(torusGeometry, torusMaterial);
animatedTorus.position.set(2, 1, 0);
scene.add(animatedTorus);

// 创建关键帧
const positionKF = new THREE.KeyframeTrack(
  'movingTorus.position',
  [0, 1, 2, 3, 4], // 时间点
  [2, 1, 0,  // 起始位置
   4, 1, 0,  // 第1秒位置
   4, 3, 0,  // 第2秒位置
   2, 3, 0,  // 第3秒位置
   2, 1, 0]  // 第4秒位置（回到起始位置）
);

const rotationKF = new THREE.KeyframeTrack(
  'movingTorus.rotation',
  [0, 1, 2, 3, 4],
  [0, 0, 0,           // 起始旋转
   Math.PI, 0, 0,     // 第1秒旋转
   Math.PI, Math.PI, 0, // 第2秒旋转
   Math.PI, Math.PI, Math.PI, // 第3秒旋转
   0, 0, 0]           // 第4秒旋转（回到起始位置）
);

// 创建动画剪辑
const animationClip = new THREE.AnimationClip('movingTorusAnimation', 4, [positionKF, rotationKF]);

// 创建动画混合器
const mixer = new THREE.AnimationMixer(animatedTorus);

// 创建动画动作
const animationAction = mixer.clipAction(animationClip);
animationAction.loop = THREE.LoopRepeat;
animationAction.repetitions = Infinity;
animationAction.play();

// 3. GLTF 模型动画示例（需要外部模型）

const gltfLoader = new GLTFLoader();
let modelMixer;

// 加载包含动画的GLTF模型
gltfLoader.load(
  'models/animated_model.glb',
  (gltf) => {
    const model = gltf.scene;
    model.position.set(0, 1, -3);
    model.scale.set(0.5, 0.5, 0.5);
    scene.add(model);

    // 创建模型的动画混合器
    modelMixer = new THREE.AnimationMixer(model);

    // 播放所有动画
    gltf.animations.forEach((clip) => {
      const action = modelMixer.clipAction(clip);
      action.loop = THREE.LoopRepeat;
      action.play();
    });
  },
  undefined,
  (error) => {
    console.error('Error loading GLTF model:', error);
  }
);

// 地面
const groundGeometry = new THREE.PlaneGeometry(20, 20);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = 0;
scene.add(ground);

// 时间跟踪
let clock = new THREE.Clock();

// 窗口大小调整
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 动画循环
function animate() {
  requestAnimationFrame(animate);
  
  // 基础动画
  rotatingBox.rotation.x += 0.01;
  rotatingBox.rotation.y += 0.01;
  
  // 上下移动动画
  const time = Date.now() * 0.001;
  bouncingSphere.position.y = 1 + Math.sin(time * 2) * 0.5;
  
  // 更新关键帧动画
  const deltaTime = clock.getDelta();
  
  if (mixer) {
    mixer.update(deltaTime);
  }
  
  if (modelMixer) {
    modelMixer.update(deltaTime);
  }
  
  controls.update();
  renderer.render(scene, camera);
}

animate();
```
