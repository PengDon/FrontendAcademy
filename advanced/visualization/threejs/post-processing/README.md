# Three.js 后期处理

本目录包含 Three.js 中的后期处理相关知识，介绍如何使用后期处理效果增强 3D 场景的视觉表现。

## 内容概述

- **后期处理基础**：EffectComposer、RenderPass等
- **常用效果**：Bloom、DepthOfField、SSAO等
- **自定义效果**：编写自定义着色器效果
- **效果组合**：多个后期处理效果的组合使用
- **性能考虑**：后期处理的性能优化

## 学习重点

1. 掌握EffectComposer的使用
2. 理解常用后期处理效果
3. 学会组合使用多个效果
4. 了解如何编写自定义效果

## 示例代码

```javascript
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { BloomEffect, BloomPass } from 'three/examples/jsm/postprocessing/BloomPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { SepiaShader } from 'three/examples/jsm/shaders/SepiaShader.js';

// 创建场景
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

// 创建渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
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

// 创建点光源用于产生bloom效果
const pointLight1 = new THREE.PointLight(0xff0000, 2, 10);
pointLight1.position.set(-2, 1, 0);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0x00ff00, 2, 10);
pointLight2.position.set(0, 1, 0);
scene.add(pointLight2);

const pointLight3 = new THREE.PointLight(0x0000ff, 2, 10);
pointLight3.position.set(2, 1, 0);
scene.add(pointLight3);

// 创建物体
const groundGeometry = new THREE.PlaneGeometry(20, 20);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// 创建多个立方体
for (let i = 0; i < 10; i++) {
  const boxGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const boxMaterial = new THREE.MeshStandardMaterial({ 
    color: new THREE.Color(Math.random(), Math.random(), Math.random()),
    emissive: new THREE.Color(Math.random() * 0.5, Math.random() * 0.5, Math.random() * 0.5)
  });
  const box = new THREE.Mesh(boxGeometry, boxMaterial);
  
  box.position.x = (Math.random() - 0.5) * 10;
  box.position.y = 0.25;
  box.position.z = (Math.random() - 0.5) * 10;
  
  box.rotation.x = Math.random() * Math.PI;
  box.rotation.y = Math.random() * Math.PI;
  
  box.castShadow = true;
  scene.add(box);
}

// 1. 创建后期处理合成器
const composer = new EffectComposer(renderer);

// 2. 添加渲染通道（必须）
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// 3. 添加FXAA抗锯齿效果
const fxaaPass = new ShaderPass(FXAAShader);
const pixelRatio = renderer.getPixelRatio();
fxaaPass.material.uniforms['resolution'].value.x = 1 / (window.innerWidth * pixelRatio);
fxaaPass.material.uniforms['resolution'].value.y = 1 / (window.innerHeight * pixelRatio);
composer.addPass(fxaaPass);

// 4. 添加UnrealBloom效果
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,   // 强度
  0.4,   // 半径
  0.85   // 阈值
);
composer.addPass(bloomPass);

// 5. 添加复古电影效果
const filmPass = new FilmPass(
  0.35,  // 噪声强度
  0.025, // 扫描线强度
  648,   // 扫描线数量
  false  // 是否灰度
);
composer.addPass(filmPass);

// 6. 添加复古褐色调效果
const sepiaPass = new ShaderPass(SepiaShader);
sepiaPass.enabled = false; // 默认不启用，可以通过UI控制
composer.addPass(sepiaPass);

// 窗口大小调整
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
  
  // 更新FXAA分辨率
  const pixelRatio = renderer.getPixelRatio();
  fxaaPass.material.uniforms['resolution'].value.x = 1 / (window.innerWidth * pixelRatio);
  fxaaPass.material.uniforms['resolution'].value.y = 1 / (window.innerHeight * pixelRatio);
  
  // 更新Bloom分辨率
  bloomPass.resolution.set(window.innerWidth, window.innerHeight);
});

// 添加UI控制面板
const createUI = () => {
  const gui = new dat.GUI();
  
  // Bloom控制
  const bloomFolder = gui.addFolder('Bloom');
  bloomFolder.add(bloomPass, 'strength', 0, 3).name('强度');
  bloomFolder.add(bloomPass, 'radius', 0, 1).name('半径');
  bloomFolder.add(bloomPass, 'threshold', 0, 1).name('阈值');
  bloomFolder.open();
  
  // Film控制
  const filmFolder = gui.addFolder('Film');
  filmFolder.add(filmPass.uniforms['nIntensity'], 'value', 0, 1).name('噪声强度');
  filmFolder.add(filmPass.uniforms['sIntensity'], 'value', 0, 1).name('扫描线强度');
  filmFolder.add(filmPass.uniforms['sCount'], 'value', 0, 2000).name('扫描线数量');
  filmFolder.open();
  
  // Sepia控制
  gui.add(sepiaPass, 'enabled').name('褐色调');
  
  return gui;
};

// 检查是否有dat.GUI库
if (typeof dat !== 'undefined') {
  createUI();
} else {
  console.log('dat.GUI not found. Please include it for UI controls.');
}

// 动画循环
function animate() {
  requestAnimationFrame(animate);
  
  controls.update();
  
  // 使用合成器渲染而不是直接使用渲染器
  composer.render();
}

animate();
```
