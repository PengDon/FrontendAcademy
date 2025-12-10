# Three.js 模型

本目录包含 Three.js 中的模型加载和处理相关知识，介绍如何加载、处理和使用各种3D模型格式。

## 内容概述

- **模型格式**：GLTF/GLB、FBX、OBJ、Collada等
- **加载器**：GLTFLoader、FBXLoader、OBJLoader等
- **模型处理**：缩放、旋转、平移、合并
- **动画处理**：骨骼动画、变形动画
- **材质处理**：替换材质、修改材质属性
- **纹理处理**：提取和处理模型纹理
- **优化技术**：LOD、实例化渲染

## 学习重点

1. 掌握常用模型格式的加载
2. 理解GLTF格式的优势
3. 学会处理模型的动画
4. 了解模型优化技术

## 示例代码

```javascript
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { TextureLoader } from 'three';

// 创建场景
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);

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
directionalLight.castShadow = true;
scene.add(directionalLight);

// 地面
const groundGeometry = new THREE.PlaneGeometry(20, 20);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// 1. GLTF模型加载（推荐使用的格式）

const gltfLoader = new GLTFLoader();

// 加载GLTF模型
gltfLoader.load(
  'models/model.gltf',
  (gltf) => {
    const model = gltf.scene;
    
    // 模型处理
    model.scale.set(1, 1, 1); // 设置缩放
    model.position.set(-5, 0, 0); // 设置位置
    model.rotation.y = Math.PI / 2; // 设置旋转
    
    // 启用阴影
    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        
        // 修改材质
        if (child.material) {
          // 示例：修改材质颜色
          // child.material.color.set(0xff0000);
          
          // 示例：启用透明度
          // child.material.transparent = true;
          // child.material.opacity = 0.8;
        }
      }
    });
    
    scene.add(model);
    
    // 处理动画
    if (gltf.animations && gltf.animations.length > 0) {
      const mixer = new THREE.AnimationMixer(model);
      
      // 播放所有动画
      gltf.animations.forEach((clip) => {
        const action = mixer.clipAction(clip);
        action.loop = THREE.LoopRepeat;
        action.play();
      });
      
      // 将混合器添加到全局以便在动画循环中更新
      window.modelMixers = window.modelMixers || [];
      window.modelMixers.push(mixer);
    }
    
    console.log('GLTF模型加载成功:', gltf);
  },
  (progress) => {
    // 加载进度
    console.log('GLTF加载进度:', (progress.loaded / progress.total * 100) + '%');
  },
  (error) => {
    // 加载错误
    console.error('GLTF模型加载错误:', error);
  }
);

// 2. FBX模型加载

const fbxLoader = new FBXLoader();

fbxLoader.load(
  'models/model.fbx',
  (object) => {
    // FBX模型处理
    object.scale.set(0.01, 0.01, 0.01); // FBX模型通常比较大，需要缩小
    object.position.set(0, 0, 0);
    
    object.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    
    scene.add(object);
    
    // 处理FBX动画
    if (object.animations && object.animations.length > 0) {
      const mixer = new THREE.AnimationMixer(object);
      const action = mixer.clipAction(object.animations[0]);
      action.loop = THREE.LoopRepeat;
      action.play();
      
      window.modelMixers = window.modelMixers || [];
      window.modelMixers.push(mixer);
    }
    
    console.log('FBX模型加载成功:', object);
  },
  (progress) => {
    console.log('FBX加载进度:', (progress.loaded / progress.total * 100) + '%');
  },
  (error) => {
    console.error('FBX模型加载错误:', error);
  }
);

// 3. OBJ模型加载（不包含材质和动画）

const objLoader = new OBJLoader();
const textureLoader = new TextureLoader();

objLoader.load(
  'models/model.obj',
  (object) => {
    // OBJ模型处理
    object.position.set(5, 0, 0);
    object.scale.set(1, 1, 1);
    
    // OBJ模型默认没有材质，需要手动添加
    const texture = textureLoader.load('models/texture.jpg');
    const material = new THREE.MeshStandardMaterial({ map: texture });
    
    object.traverse((child) => {
      if (child.isMesh) {
        child.material = material;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    
    scene.add(object);
    
    console.log('OBJ模型加载成功:', object);
  },
  (progress) => {
    console.log('OBJ加载进度:', (progress.loaded / progress.total * 100) + '%');
  },
  (error) => {
    console.error('OBJ模型加载错误:', error);
  }
);

// 窗口大小调整
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 时间跟踪
const clock = new THREE.Clock();

// 动画循环
function animate() {
  requestAnimationFrame(animate);
  
  // 更新控制器
  controls.update();
  
  // 更新所有动画混合器
  if (window.modelMixers) {
    const deltaTime = clock.getDelta();
    window.modelMixers.forEach(mixer => {
      mixer.update(deltaTime);
    });
  }
  
  renderer.render(scene, camera);
}

animate();
```
