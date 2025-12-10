# WebGL 光照

本目录包含 WebGL 光照效果的相关知识和示例代码，帮助你理解如何在 WebGL 中实现光照效果。

## 内容概述

- **光照基础**：光照的基本概念和类型
- **Phong 光照模型**：环境光、漫反射光、镜面反射光
- **材质属性**：物体的材质属性设置
- **光源类型**：点光源、方向光、聚光灯
- **多光源场景**：多个光源的组合使用

## 学习重点

1. 理解 Phong 光照模型的原理
2. 掌握不同类型光源的实现方法
3. 学习材质属性的设置和作用
4. 理解光照计算中的法线向量

## 示例代码

### 1. 基础 Phong 光照模型

```javascript
// 顶点着色器（带光照）
const vertexShaderSource = `
  attribute vec4 a_position;
  attribute vec3 a_normal;
  
  uniform mat4 u_modelMatrix;
  uniform mat4 u_viewMatrix;
  uniform mat4 u_projectionMatrix;
  uniform mat3 u_normalMatrix;
  
  // 光源属性
  uniform vec3 u_lightPosition;
  uniform vec3 u_lightColor;
  
  // 材质属性
  uniform vec3 u_ambientColor;
  uniform vec3 u_diffuseColor;
  uniform vec3 u_specularColor;
  uniform float u_shininess;
  
  varying vec4 v_color;
  
  void main() {
    // 计算顶点位置
    vec4 worldPosition = u_modelMatrix * a_position;
    vec4 viewPosition = u_viewMatrix * worldPosition;
    gl_Position = u_projectionMatrix * viewPosition;
    
    // 计算法线（转换到视图空间）
    vec3 normal = normalize(u_normalMatrix * a_normal);
    
    // 计算光源方向（在视图空间）
    vec4 viewLightPosition = u_viewMatrix * vec4(u_lightPosition, 1.0);
    vec3 lightDirection = normalize(viewLightPosition.xyz - viewPosition.xyz);
    
    // 计算观察方向
    vec3 viewDirection = normalize(-viewPosition.xyz);
    
    // 计算反射方向
    vec3 reflectDirection = reflect(-lightDirection, normal);
    
    // 环境光
    vec3 ambient = u_ambientColor * u_lightColor;
    
    // 漫反射光
    float diff = max(dot(normal, lightDirection), 0.0);
    vec3 diffuse = u_diffuseColor * u_lightColor * diff;
    
    // 镜面反射光
    float spec = pow(max(dot(viewDirection, reflectDirection), 0.0), u_shininess);
    vec3 specular = u_specularColor * u_lightColor * spec;
    
    // 最终颜色
    vec3 totalColor = ambient + diffuse + specular;
    v_color = vec4(totalColor, 1.0);
  }
`;

// 片元着色器
const fragmentShaderSource = `
  precision mediump float;
  
  varying vec4 v_color;
  
  void main() {
    gl_FragColor = v_color;
  }
`;
```

### 2. 设置光照和材质属性

```javascript
// 设置光照和材质
function setupLighting(gl, program) {
  // 光源属性
  const lightPosition = [10.0, 10.0, 10.0];
  const lightColor = [1.0, 1.0, 1.0]; // 白光
  
  // 材质属性
  const ambientColor = [0.2, 0.2, 0.2];
  const diffuseColor = [0.8, 0.8, 0.8];
  const specularColor = [1.0, 1.0, 1.0];
  const shininess = 32.0;
  
  // 传递光源属性给着色器
  const lightPositionLocation = gl.getUniformLocation(program, 'u_lightPosition');
  gl.uniform3fv(lightPositionLocation, lightPosition);
  
  const lightColorLocation = gl.getUniformLocation(program, 'u_lightColor');
  gl.uniform3fv(lightColorLocation, lightColor);
  
  // 传递材质属性给着色器
  const ambientColorLocation = gl.getUniformLocation(program, 'u_ambientColor');
  gl.uniform3fv(ambientColorLocation, ambientColor);
  
  const diffuseColorLocation = gl.getUniformLocation(program, 'u_diffuseColor');
  gl.uniform3fv(diffuseColorLocation, diffuseColor);
  
  const specularColorLocation = gl.getUniformLocation(program, 'u_specularColor');
  gl.uniform3fv(specularColorLocation, specularColor);
  
  const shininessLocation = gl.getUniformLocation(program, 'u_shininess');
  gl.uniform1f(shininessLocation, shininess);
}

// 计算法线矩阵
function calculateNormalMatrix(modelMatrix) {
  // 创建模型矩阵的逆矩阵
  const inverseMatrix = invertMatrix(modelMatrix);
  
  // 创建逆矩阵的转置矩阵
  const transposeMatrix = transposeMatrix(inverseMatrix);
  
  // 提取左上3x3部分
  const normalMatrix = [
    transposeMatrix[0], transposeMatrix[1], transposeMatrix[2],
    transposeMatrix[4], transposeMatrix[5], transposeMatrix[6],
    transposeMatrix[8], transposeMatrix[9], transposeMatrix[10]
  ];
  
  return normalMatrix;
}
```

### 3. 点光源实现

```javascript
// 点光源片元着色器
const fragmentShaderSource = `
  precision mediump float;
  
  varying vec3 v_normal;
  varying vec3 v_viewPosition;
  varying vec3 v_worldPosition;
  
  // 点光源属性
  uniform vec3 u_lightPosition;
  uniform vec3 u_lightColor;
  uniform float u_lightIntensity;
  uniform float u_lightAttenuation;
  
  // 材质属性
  uniform vec3 u_ambientColor;
  uniform vec3 u_diffuseColor;
  uniform vec3 u_specularColor;
  uniform float u_shininess;
  
  void main() {
    // 计算法线
    vec3 normal = normalize(v_normal);
    
    // 计算光源方向
    vec3 lightDirection = u_lightPosition - v_worldPosition;
    float lightDistance = length(lightDirection);
    lightDirection = normalize(lightDirection);
    
    // 计算观察方向
    vec3 viewDirection = normalize(-v_viewPosition);
    
    // 计算反射方向
    vec3 reflectDirection = reflect(-lightDirection, normal);
    
    // 计算衰减
    float attenuation = 1.0 / (1.0 + u_lightAttenuation * lightDistance * lightDistance);
    
    // 环境光
    vec3 ambient = u_ambientColor * u_lightColor;
    
    // 漫反射光
    float diff = max(dot(normal, lightDirection), 0.0);
    vec3 diffuse = u_diffuseColor * u_lightColor * diff * u_lightIntensity;
    
    // 镜面反射光
    float spec = pow(max(dot(viewDirection, reflectDirection), 0.0), u_shininess);
    vec3 specular = u_specularColor * u_lightColor * spec * u_lightIntensity;
    
    // 应用衰减
    ambient *= attenuation;
    diffuse *= attenuation;
    specular *= attenuation;
    
    // 最终颜色
    vec3 totalColor = ambient + diffuse + specular;
    gl_FragColor = vec4(totalColor, 1.0);
  }
`;
```

### 4. 多光源场景

```javascript
// 多光源片元着色器
const fragmentShaderSource = `
  precision mediump float;
  
  varying vec3 v_normal;
  varying vec3 v_viewPosition;
  varying vec3 v_worldPosition;
  
  // 环境光
  uniform vec3 u_ambientColor;
  
  // 材质属性
  uniform vec3 u_diffuseColor;
  uniform vec3 u_specularColor;
  uniform float u_shininess;
  
  // 方向光属性
  struct DirectionalLight {
    vec3 direction;
    vec3 color;
    float intensity;
  };
  
  uniform DirectionalLight u_directionalLights[2];
  
  // 点光源属性
  struct PointLight {
    vec3 position;
    vec3 color;
    float intensity;
    float attenuation;
  };
  
  uniform PointLight u_pointLights[2];
  
  void main() {
    // 计算法线
    vec3 normal = normalize(v_normal);
    
    // 计算观察方向
    vec3 viewDirection = normalize(-v_viewPosition);
    
    // 初始颜色（环境光）
    vec3 totalColor = u_ambientColor;
    
    // 处理方向光
    for (int i = 0; i < 2; i++) {
      DirectionalLight light = u_directionalLights[i];
      
      // 计算光线方向
      vec3 lightDirection = normalize(-light.direction);
      
      // 漫反射
      float diff = max(dot(normal, lightDirection), 0.0);
      vec3 diffuse = u_diffuseColor * light.color * diff * light.intensity;
      
      // 镜面反射
      vec3 reflectDirection = reflect(-lightDirection, normal);
      float spec = pow(max(dot(viewDirection, reflectDirection), 0.0), u_shininess);
      vec3 specular = u_specularColor * light.color * spec * light.intensity;
      
      totalColor += diffuse + specular;
    }
    
    // 处理点光源
    for (int i = 0; i < 2; i++) {
      PointLight light = u_pointLights[i];
      
      // 计算光线方向和距离
      vec3 lightDirection = light.position - v_worldPosition;
      float lightDistance = length(lightDirection);
      lightDirection = normalize(lightDirection);
      
      // 计算衰减
      float attenuation = 1.0 / (1.0 + light.attenuation * lightDistance * lightDistance);
      
      // 漫反射
      float diff = max(dot(normal, lightDirection), 0.0);
      vec3 diffuse = u_diffuseColor * light.color * diff * light.intensity * attenuation;
      
      // 镜面反射
      vec3 reflectDirection = reflect(-lightDirection, normal);
      float spec = pow(max(dot(viewDirection, reflectDirection), 0.0), u_shininess);
      vec3 specular = u_specularColor * light.color * spec * light.intensity * attenuation;
      
      totalColor += diffuse + specular;
    }
    
    gl_FragColor = vec4(totalColor, 1.0);
  }
`;
```

## 光照类型

### 环境光（Ambient Light）

环境光是一种均匀照亮所有物体的光，没有方向和位置，用于模拟间接光照。

### 漫反射光（Diffuse Light）

漫反射光是从光源照射到物体表面并向各个方向散射的光，其强度取决于光线与表面法线的夹角。

### 镜面反射光（Specular Light）

镜面反射光是从物体表面反射的高光，其强度取决于观察者的位置和反射光线的方向。

### 光源类型

1. **方向光（Directional Light）**：无限远的光源，光线平行（如太阳光）
2. **点光源（Point Light）**：从一个点向各个方向发射光线（如灯泡）
3. **聚光灯（Spot Light）**：从一个点向特定方向发射锥形光线（如手电筒）

## 材质属性

- **环境色（Ambient Color）**：物体对环境光的反射率
- **漫反射色（Diffuse Color）**：物体对漫反射光的反射率
- **镜面反射色（Specular Color）**：物体对镜面反射光的反射率
- **光泽度（Shininess）**：控制镜面高光的锐利程度

## 法线矩阵

法线矩阵用于将法线从模型空间转换到视图空间，它是模型视图矩阵的逆矩阵的转置矩阵的左上3x3部分。

## 学习资源

- [WebGL Fundamentals - Lighting](https://webglfundamentals.org/webgl/lessons/webgl-3d-lighting.html)
- [Learn WebGL - Lighting](http://learnwebgl.brown37.net/09_lighting/lighting_models.html)
- [WebGL Programming Guide - Chapter 7](https://sites.google.com/site/webglbook/chapter-7)
