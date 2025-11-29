# Three.js 学习指南

## 什么是 Three.js？

Three.js 是一个轻量级的 JavaScript 3D 库，它封装了 WebGL 的复杂性，使开发者能够更简单地在浏览器中创建和显示 3D 内容。

## 核心概念

### 1. 场景 (Scene)

场景是所有 3D 对象的容器，类似于一个 3D 空间。

```javascript
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff); // 设置背景色
```

### 2. 相机 (Camera)

相机决定了我们如何看待场景，就像人的眼睛或摄像机的视角。

#### 透视相机 (Perspective Camera)

最常用的相机类型，模拟人眼的视角。

```javascript
const camera = new THREE.PerspectiveCamera(
  75, // 视野角度 (FOV)
  window.innerWidth / window.innerHeight, // 宽高比
  0.1, // 近平面
  1000 // 远平面
);
camera.position.z = 5;
```

#### 正交相机 (Orthographic Camera)

用于 2D 或等距 3D 场景，不产生透视效果。

```javascript
const camera = new THREE.OrthographicCamera(
  window.innerWidth / -2, // 左
  window.innerWidth / 2, // 右
  window.innerHeight / 2, // 上
  window.innerHeight / -2, // 下
  0.1, // 近平面
  1000 // 远平面
);
```

### 3. 渲染器 (Renderer)

负责将场景和相机结合，渲染成最终的图像。

```javascript
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 渲染函数
function animate() {
  requestAnimationFrame(animate);
  // 可以在这里添加动画逻辑
  renderer.render(scene, camera);
}
animate();
```

### 4. 几何体 (Geometry)

定义 3D 对象的形状和结构。

```javascript
// 立方体
const geometry = new THREE.BoxGeometry(1, 1, 1);

// 球体
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

// 圆柱体
const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);

// 平面
const planeGeometry = new THREE.PlaneGeometry(5, 5);
```

### 5. 材质 (Material)

定义对象的外观，如颜色、纹理等。

```javascript
// 基础网格材质
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

// 漫反射材质（需要光源）
const meshMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });

// 高光材质
const phongMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff, shininess: 100 });

// 标准材质（PBR - 基于物理的渲染）
const standardMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x00ffff, 
  roughness: 0.5, 
  metalness: 0.5 
});
```

### 6. 网格 (Mesh)

将几何体和材质结合，创建完整的 3D 对象。

```javascript
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
```

## 光源 (Light)

光源对于大多数材质（如 MeshLambertMaterial, MeshPhongMaterial）是必需的。

```javascript
// 环境光 - 均匀照亮场景
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// 平行光 - 模拟太阳光
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// 点光源 - 向各个方向发光
const pointLight = new THREE.PointLight(0xff0000, 1, 100);
pointLight.position.set(0, 0, 5);
scene.add(pointLight);

// 聚光灯
const spotLight = new THREE.SpotLight(0xffff00, 1);
spotLight.position.set(0, 10, 0);
scene.add(spotLight);
```

## 纹理 (Texture)

```javascript
// 加载纹理
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('path/to/texture.jpg');

// 应用纹理到材质
const texturedMaterial = new THREE.MeshBasicMaterial({ map: texture });
```

## 动画和交互

### 基本动画

```javascript
function animate() {
  requestAnimationFrame(animate);
  
  // 旋转立方体
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  
  renderer.render(scene, camera);
}
animate();
```

### 响应式调整

```javascript
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
```

### 鼠标交互

结合 OrbitControls 实现相机控制：

```javascript
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // 添加阻尼效果
controls.dampingFactor = 0.05;

function animate() {
  requestAnimationFrame(animate);
  controls.update(); // 更新控制器
  renderer.render(scene, camera);
}
animate();
```

## 进阶特性

### 阴影

```javascript
// 启用阴影
renderer.shadowMap.enabled = true;

// 让光源投射阴影
directionalLight.castShadow = true;

// 让物体投射和接收阴影
cube.castShadow = true;
plane.receiveShadow = true;
```

### 后期处理

使用 EffectComposer 添加后期处理效果：

```javascript
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const glitchPass = new GlitchPass();
composer.addPass(glitchPass);

function animate() {
  requestAnimationFrame(animate);
  composer.render(); // 使用composer渲染
}
```

### 加载 3D 模型

```javascript
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
loader.load('model.glb', (gltf) => {
  const model = gltf.scene;
  scene.add(model);
}, undefined, (error) => {
  console.error('加载模型出错:', error);
});
```

## 性能优化

1. **减少几何体数量**：合并相似几何体
2. **LOD (Level of Detail)**：根据距离使用不同精度的模型
3. **实例化渲染**：对于重复对象使用 InstancedMesh
4. **纹理压缩**：使用压缩纹理格式如 Basis Universal
5. **延迟加载**：只加载视锥体可见的对象
6. **减少阴影分辨率**：调整 shadow.mapSize

## 资源推荐

- [Three.js 官方文档](https://threejs.org/docs/)
- [Three.js 示例](https://threejs.org/examples/)
- [Three.js Journey](https://threejs-journey.com/) - 优质课程
- [Three.js 中文社区](http://www.webgl3d.cn/)

## 常见问题解答

**Q: 性能优化有哪些关键点？**
A: 主要包括减少几何体数量、使用 LOD、实例化渲染、纹理压缩、延迟加载等。

**Q: 如何实现物体交互？**
A: 使用 Raycaster 射线投射器来检测鼠标与物体的交点。

**Q: 如何加载复杂的 3D 模型？**
A: 使用 GLTFLoader、OBJLoader 等加载器，注意优化模型大小。

**Q: 如何实现高质量的光照效果？**
A: 使用 HDRI 环境贴图、PBR 材质和实时光照。

**Q: 如何实现粒子效果？**
A: 使用 Points 或 InstancedMesh 创建大量粒子。

## 最佳实践

1. **模块化开发**：将场景、相机、渲染器等分离
2. **使用 TypeScript**：提供类型安全
3. **响应式设计**：适配不同屏幕尺寸
4. **性能监控**：使用 Stats.js 监控帧率
5. **渐进增强**：为不支持 WebGL 的浏览器提供降级方案
6. **代码注释**：详细说明复杂的 3D 概念和算法