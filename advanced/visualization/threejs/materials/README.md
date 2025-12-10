# Three.js 材质

本目录包含 Three.js 中的材质相关知识，介绍如何创建和使用不同类型的材质来定义 3D 对象的外观。

## 内容概述

- **基础材质**：MeshBasicMaterial、MeshNormalMaterial
- **光照材质**：MeshLambertMaterial、MeshPhongMaterial
- **PBR 材质**：MeshStandardMaterial、MeshPhysicalMaterial
- **特殊材质**：LineBasicMaterial、PointsMaterial
- **自定义材质**：ShaderMaterial、RawShaderMaterial
- **材质属性**：颜色、透明度、纹理映射等

## 学习重点

1. 理解不同材质的适用场景
2. 掌握材质属性的配置
3. 了解 PBR 材质的优势
4. 学会创建自定义着色器材质

## 示例代码

```javascript
import * as THREE from 'three';

// 1. 基础材质

// 基础网格材质（不受光照影响）
const basicMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ff00,           // 颜色
  wireframe: false,          // 是否显示线框
  transparent: false,        // 是否透明
  opacity: 1.0,              // 不透明度
  side: THREE.FrontSide      // 渲染哪一面（FrontSide, BackSide, DoubleSide）
});

// 法线材质（显示法向量颜色）
const normalMaterial = new THREE.MeshNormalMaterial();

// 2. 光照材质

// 漫反射材质（对光源有反应）
const lambertMaterial = new THREE.MeshLambertMaterial({
  color: 0xff0000,
  emissive: 0x000000,        // 自发光颜色
  transparent: true,
  opacity: 0.8
});

// 高光材质（有高光效果）
const phongMaterial = new THREE.MeshPhongMaterial({
  color: 0x0000ff,
  specular: 0xffffff,        // 高光颜色
  shininess: 100,            // 高光亮度
  emissive: 0x000000
});

// 3. PBR 材质（基于物理的渲染）

// 标准材质
const standardMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.5,            // 粗糙度（0-1）
  metalness: 0.5,            // 金属度（0-1）
  emissive: 0x000000,
  transparent: true,
  opacity: 1.0
});

// 物理材质（更高级的 PBR）
const physicalMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  roughness: 0.5,
  metalness: 0.5,
  transmission: 0.0,         // 透射率（0-1）
  clearcoat: 0.0,            // 清漆层厚度
  clearcoatRoughness: 0.0,   // 清漆层粗糙度
  ior: 1.5                   // 折射率
});

// 4. 特殊材质

// 线材质
const lineMaterial = new THREE.LineBasicMaterial({
  color: 0xff0000,
  linewidth: 1
});

// 点材质
const pointsMaterial = new THREE.PointsMaterial({
  color: 0x00ff00,
  size: 0.1,
  sizeAttenuation: true      // 是否随距离缩放
});

// 5. 自定义着色器材质

const vertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  
  void main() {
    gl_FragColor = vec4(vUv.x, vUv.y, 0.0, 1.0);
  }
`;

const shaderMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {},
  transparent: true
});
```
