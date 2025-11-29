# 享元模式 (Flyweight Pattern)

## 什么是享元模式

享元模式是一种结构型设计模式，它通过共享细粒度对象来减少内存使用和提高性能。享元模式的核心思想是将对象的状态分为内部状态（intrinsic）和外部状态（extrinsic）：

- **内部状态**：对象共享的部分，不会随环境变化而变化，存储在享元对象内部
- **外部状态**：对象非共享的部分，会随环境变化而变化，由客户端维护并在使用时传入

通过分离这两种状态，享元模式可以复用相同的对象实例来表示多个不同的逻辑对象，从而显著减少内存消耗。

## 享元模式的核心组件

1. **享元接口 (Flyweight)**：定义享元对象的接口，通过该接口可以接受外部状态
2. **具体享元 (ConcreteFlyweight)**：实现享元接口，存储内部状态，并且可以接受外部状态
3. **享元工厂 (FlyweightFactory)**：创建和管理享元对象，确保享元对象被正确共享
4. **客户端 (Client)**：维护对享元对象的引用，并在使用享元对象时提供外部状态

## 享元模式的实现

### 基本实现

```javascript
// 享元接口
class Flyweight {
  // 接受外部状态的操作
  operation(extrinsicState) {
    throw new Error('此方法必须由子类实现');
  }
}

// 具体享元类
class ConcreteFlyweight extends Flyweight {
  constructor(intrinsicState) {
    super();
    // 内部状态，可共享
    this.intrinsicState = intrinsicState;
    console.log(`创建享元对象，内部状态: ${intrinsicState}`);
  }

  // 实现接口方法，接受外部状态
  operation(extrinsicState) {
    console.log(`享元对象操作 - 内部状态: ${this.intrinsicState}, 外部状态: ${extrinsicState}`);
    return `内部状态: ${this.intrinsicState}, 外部状态: ${extrinsicState}`;
  }
}

// 享元工厂类
class FlyweightFactory {
  constructor() {
    // 存储已创建的享元对象
    this.flyweights = {};
  }

  // 获取享元对象，如果不存在则创建
  getFlyweight(intrinsicState) {
    // 如果享元对象不存在，创建并存储
    if (!this.flyweights[intrinsicState]) {
      this.flyweights[intrinsicState] = new ConcreteFlyweight(intrinsicState);
    }
    // 返回已存在的享元对象
    return this.flyweights[intrinsicState];
  }

  // 获取享元对象的数量
  getFlyweightCount() {
    return Object.keys(this.flyweights).length;
  }
}

// 客户端代码
function clientCode() {
  console.log('--- 享元模式基本实现示例 ---');
  
  // 创建享元工厂
  const factory = new FlyweightFactory();
  
  // 获取并使用享元对象
  const flyweight1 = factory.getFlyweight('共享状态1');
  flyweight1.operation('外部状态A');
  
  // 再次获取相同内部状态的享元对象，应该返回之前创建的对象
  const flyweight2 = factory.getFlyweight('共享状态1');
  flyweight2.operation('外部状态B');
  
  // 获取不同内部状态的享元对象，会创建新对象
  const flyweight3 = factory.getFlyweight('共享状态2');
  flyweight3.operation('外部状态C');
  
  // 验证对象是否被共享
  console.log('\n验证享元对象共享:');
  console.log(`flyweight1 === flyweight2: ${flyweight1 === flyweight2}`); // 应该为true
  console.log(`flyweight1 === flyweight3: ${flyweight1 === flyweight3}`); // 应该为false
  
  // 显示创建的享元对象数量
  console.log(`\n创建的享元对象数量: ${factory.getFlyweightCount()}`); // 应该为2
}

// 使用示例
clientCode();
```

### 实际应用场景：文本编辑器字符渲染

下面是一个文本编辑器字符渲染的例子，使用享元模式来优化大量字符的内存使用：

```javascript
// 字符享元接口
class CharacterFlyweight {
  display(fontSize, fontStyle, color) {
    throw new Error('此方法必须由子类实现');
  }
}

// 具体字符享元类
class ConcreteCharacterFlyweight extends CharacterFlyweight {
  constructor(char) {
    super();
    // 内部状态：字符本身
    this.character = char;
    console.log(`创建字符享元: '${char}'`);
  }

  // 接受外部状态：字体大小、样式、颜色
  display(fontSize, fontStyle, color) {
    console.log(`显示字符: '${this.character}' [字体大小: ${fontSize}px, 样式: ${fontStyle}, 颜色: ${color}]`);
    return {
      character: this.character,
      fontSize,
      fontStyle,
      color
    };
  }
}

// 字符享元工厂
class CharacterFlyweightFactory {
  constructor() {
    // 存储字符享元对象
    this.characters = {};
  }

  // 获取字符享元对象
  getCharacter(char) {
    // 如果字符不存在，创建并存储
    if (!this.characters[char]) {
      this.characters[char] = new ConcreteCharacterFlyweight(char);
    }
    // 返回已存在的字符享元
    return this.characters[char];
  }

  // 获取字符享元对象数量
  getCharacterCount() {
    return Object.keys(this.characters).length;
  }

  // 显示所有创建的字符
  displayAllCharacters() {
    console.log('\n已创建的字符享元:');
    for (const char in this.characters) {
      console.log(`- '${char}'`);
    }
  }
}

// 文本编辑器类
class TextEditor {
  constructor() {
    // 使用享元工厂
    this.factory = new CharacterFlyweightFactory();
    // 存储文档内容 (字符和其外部状态)
    this.document = [];
  }

  // 添加字符到文档
  addCharacter(char, position, fontSize = 12, fontStyle = 'normal', color = 'black') {
    // 获取字符享元对象
    const characterFlyweight = this.factory.getCharacter(char);
    
    // 存储字符及其外部状态
    this.document.push({
      character: characterFlyweight,
      position,
      fontSize,
      fontStyle,
      color
    });
    
    console.log(`添加字符 '${char}' 到位置 ${position}`);
  }

  // 批量添加文本
  addText(text, startPosition, fontSize = 12, fontStyle = 'normal', color = 'black') {
    for (let i = 0; i < text.length; i++) {
      this.addCharacter(
        text[i],
        startPosition + i,
        fontSize,
        fontStyle,
        color
      );
    }
  }

  // 渲染文档
  render() {
    console.log('\n渲染文档:');
    // 按位置排序并渲染
    const sortedDocument = [...this.document].sort((a, b) => a.position - b.position);
    
    let renderedText = '';
    const renderDetails = [];
    
    for (const item of sortedDocument) {
      const { character, fontSize, fontStyle, color } = item;
      renderedText += character.character;
      renderDetails.push(character.display(fontSize, fontStyle, color));
    }
    
    console.log(`渲染结果: "${renderedText}"`);
    console.log(`文档字符数: ${this.document.length}`);
    console.log(`创建的字符享元数: ${this.factory.getCharacterCount()}`);
    
    return { text: renderedText, details: renderDetails };
  }

  // 获取文档信息
  getDocumentInfo() {
    return {
      totalCharacters: this.document.length,
      uniqueCharacters: this.factory.getCharacterCount(),
      memorySavings: this.calculateMemorySavings()
    };
  }

  // 计算内存节省情况（模拟）
  calculateMemorySavings() {
    const totalChars = this.document.length;
    const uniqueChars = this.factory.getCharacterCount();
    const savedChars = totalChars - uniqueChars;
    const savingsPercentage = totalChars > 0 ? Math.round((savedChars / totalChars) * 100) : 0;
    
    return {
      savedCharacters: savedChars,
      savingsPercentage: savingsPercentage + '%'
    };
  }
}

// 客户端代码
function clientCode() {
  console.log('--- 文本编辑器中的享元模式示例 ---');
  
  // 创建文本编辑器
  const editor = new TextEditor();
  
  // 添加文本内容
  console.log('添加文档内容...');
  editor.addText('Hello, ', 0, 12, 'normal', 'black');
  editor.addText('World!', 7, 14, 'bold', 'blue');
  editor.addText(' This is a demonstration of the Flyweight Pattern.', 13, 12, 'normal', 'black');
  editor.addText(' Hello again!', 68, 12, 'italic', 'green');
  
  // 渲染文档
  const renderResult = editor.render();
  
  // 显示文档信息
  console.log('\n文档信息:');
  const info = editor.getDocumentInfo();
  console.log(`总字符数: ${info.totalCharacters}`);
  console.log(`唯一字符数: ${info.uniqueCharacters}`);
  console.log(`节省字符数: ${info.memorySavings.savedCharacters} (${info.memorySavings.savingsPercentage})`);
  
  // 显示创建的所有字符享元
  editor.factory.displayAllCharacters();
}

// 使用示例
clientCode();
```

## 享元模式的应用场景

1. **大量相似对象**：当系统中有大量相似对象时，使用享元模式可以显著减少内存使用
2. **内存敏感环境**：在内存有限的环境中（如移动设备），享元模式特别有用
3. **对象大部分状态可共享**：当对象的大部分状态可以共享时，享元模式效果最佳
4. **图形应用**：图形编辑器、游戏开发中的精灵、粒子系统等
5. **文本处理**：文档编辑器中的字符、排版系统等
6. **数据库连接池**：通过共享连接对象减少连接创建的开销

## 享元模式的优点

1. **内存节省**：通过共享相同的对象实例，显著减少内存使用
2. **性能提升**：减少对象创建和销毁的开销，提高系统性能
3. **可扩展性**：可以在不增加内存使用的情况下支持更多对象
4. **对象池实现**：享元模式是对象池模式的一种特殊实现
5. **适合大量相似对象**：特别适合处理大量相似对象的场景

## 享元模式的缺点

1. **复杂性增加**：将对象状态分为内部状态和外部状态增加了系统的复杂性
2. **可能影响性能**：维护外部状态可能需要额外的计算和存储
3. **线程安全问题**：如果多个线程同时访问共享的享元对象，可能会导致并发问题
4. **设计复杂度**：正确识别内部状态和外部状态需要仔细的设计
5. **调试困难**：由于对象共享，调试时可能难以跟踪对象的状态变化

## 享元模式与其他模式的区别

### 享元模式 vs 单例模式

- **享元模式**：允许多个相似对象共享内部状态，但每个对象可以有不同的外部状态
- **单例模式**：确保类只有一个实例，整个系统共享这一个实例

### 享元模式 vs 原型模式

- **享元模式**：通过共享内部状态来减少对象创建，关注的是内存优化
- **原型模式**：通过复制现有对象来创建新对象，关注的是对象创建的简便性

### 享元模式 vs 工厂模式

- **享元模式**：关注对象的共享和复用，减少内存使用
- **工厂模式**：关注对象的创建过程，封装创建逻辑

## 实际应用案例

### 1. 游戏开发中的精灵系统

```javascript
// 精灵享元接口
class SpriteFlyweight {
  render(position, rotation, scale) {
    throw new Error('此方法必须由子类实现');
  }
}

// 具体精灵享元类
class ConcreteSpriteFlyweight extends SpriteFlyweight {
  constructor(imageId, imageData) {
    super();
    // 内部状态：图像数据
    this.imageId = imageId;
    this.imageData = imageData;
    console.log(`创建精灵享元: ${imageId}`);
  }

  // 接受外部状态：位置、旋转、缩放
  render(position, rotation = 0, scale = { x: 1, y: 1 }) {
    console.log(`渲染精灵 '${this.imageId}' - 位置: (${position.x}, ${position.y}), 旋转: ${rotation}°, 缩放: (${scale.x}, ${scale.y})`);
    return {
      imageId: this.imageId,
      position,
      rotation,
      scale
    };
  }
}

// 精灵享元工厂
class SpriteFlyweightFactory {
  constructor() {
    this.sprites = {};
  }

  // 获取精灵享元对象
  getSprite(imageId, imageData) {
    if (!this.sprites[imageId]) {
      this.sprites[imageId] = new ConcreteSpriteFlyweight(imageId, imageData);
    }
    return this.sprites[imageId];
  }

  // 获取精灵享元数量
  getSpriteCount() {
    return Object.keys(this.sprites).length;
  }

  // 预加载精灵
  preloadSprites(spriteDefinitions) {
    for (const [imageId, imageData] of Object.entries(spriteDefinitions)) {
      this.getSprite(imageId, imageData);
    }
    console.log(`预加载了 ${this.getSpriteCount()} 个精灵`);
  }
}

// 游戏场景类
class GameScene {
  constructor() {
    this.spriteFactory = new SpriteFlyweightFactory();
    this.sceneObjects = [];
  }

  // 添加精灵对象到场景
  addSpriteObject(imageId, position, rotation = 0, scale = { x: 1, y: 1 }) {
    // 假设imageData是从资源管理器获取的
    const imageData = `[图像数据: ${imageId}]`;
    const spriteFlyweight = this.spriteFactory.getSprite(imageId, imageData);
    
    this.sceneObjects.push({
      sprite: spriteFlyweight,
      position,
      rotation,
      scale
    });
    
    console.log(`添加精灵对象 '${imageId}' 到场景`);
  }

  // 批量添加精灵对象
  addSpriteBatch(imageId, positions, rotation = 0, scale = { x: 1, y: 1 }) {
    for (const position of positions) {
      this.addSpriteObject(imageId, position, rotation, scale);
    }
  }

  // 渲染场景
  render() {
    console.log('\n渲染游戏场景:');
    console.log(`场景中对象数量: ${this.sceneObjects.length}`);
    console.log(`使用的精灵享元数量: ${this.spriteFactory.getSpriteCount()}`);
    
    const renderResults = [];
    for (const obj of this.sceneObjects) {
      const result = obj.sprite.render(obj.position, obj.rotation, obj.scale);
      renderResults.push(result);
    }
    
    return renderResults;
  }

  // 获取场景信息
  getSceneInfo() {
    return {
      totalObjects: this.sceneObjects.length,
      uniqueSprites: this.spriteFactory.getSpriteCount(),
      memorySavings: this.calculateMemorySavings()
    };
  }

  // 计算内存节省情况（模拟）
  calculateMemorySavings() {
    const totalObjects = this.sceneObjects.length;
    const uniqueSprites = this.spriteFactory.getSpriteCount();
    const savedObjects = totalObjects - uniqueSprites;
    const savingsPercentage = totalObjects > 0 ? Math.round((savedObjects / totalObjects) * 100) : 0;
    
    return {
      savedObjects,
      savingsPercentage: savingsPercentage + '%'
    };
  }
}

// 客户端代码
function clientCode() {
  console.log('--- 游戏精灵系统中的享元模式示例 ---');
  
  // 创建游戏场景
  const scene = new GameScene();
  
  // 模拟大量精灵对象
  console.log('添加游戏对象...');
  
  // 添加100个树精灵（不同位置）
  const treePositions = [];
  for (let i = 0; i < 100; i++) {
    treePositions.push({ x: Math.random() * 1000, y: Math.random() * 1000 });
  }
  scene.addSpriteBatch('tree', treePositions);
  
  // 添加50个岩石精灵
  const rockPositions = [];
  for (let i = 0; i < 50; i++) {
    rockPositions.push({ x: Math.random() * 1000, y: Math.random() * 1000 });
  }
  scene.addSpriteBatch('rock', rockPositions, Math.random() * 360, { x: 0.8 + Math.random() * 0.4, y: 0.8 + Math.random() * 0.4 });
  
  // 添加20个草精灵
  const grassPositions = [];
  for (let i = 0; i < 20; i++) {
    grassPositions.push({ x: Math.random() * 1000, y: Math.random() * 1000 });
  }
  scene.addSpriteBatch('grass', grassPositions, Math.random() * 360);
  
  // 添加几个不同的角色精灵
  scene.addSpriteObject('player', { x: 500, y: 500 }, 0, { x: 1.5, y: 1.5 });
  scene.addSpriteObject('enemy', { x: 300, y: 400 }, 45, { x: 1.2, y: 1.2 });
  scene.addSpriteObject('enemy', { x: 700, y: 600 }, 180, { x: 1.2, y: 1.2 });
  
  // 渲染场景
  scene.render();
  
  // 显示场景信息
  console.log('\n场景信息:');
  const info = scene.getSceneInfo();
  console.log(`场景对象总数: ${info.totalObjects}`);
  console.log(`唯一精灵数量: ${info.uniqueSprites}`);
  console.log(`节省对象数: ${info.memorySavings.savedObjects} (${info.memorySavings.savingsPercentage})`);
  console.log('\n通过享元模式，我们只创建了5个精灵对象（tree, rock, grass, player, enemy），但却渲染了173个场景对象！');
}

// 使用示例
clientCode();
```

### 2. 在线地图应用中的瓦片系统

```javascript
// 地图瓦片享元接口
class TileFlyweight {
  render(zoomLevel, position) {
    throw new Error('此方法必须由子类实现');
  }
}

// 具体地图瓦片享元类
class ConcreteTileFlyweight extends TileFlyweight {
  constructor(tileId, tileData) {
    super();
    // 内部状态：瓦片数据
    this.tileId = tileId;
    this.tileData = tileData;
    console.log(`加载瓦片: ${tileId}`);
  }

  // 接受外部状态：缩放级别、位置
  render(zoomLevel, position) {
    console.log(`渲染瓦片 '${this.tileId}' - 缩放级别: ${zoomLevel}, 位置: (${position.x}, ${position.y})`);
    return {
      tileId: this.tileId,
      zoomLevel,
      position,
      data: this.tileData
    };
  }

  // 获取瓦片数据大小（模拟）
  getDataSize() {
    // 模拟瓦片数据大小
    return this.tileData.length * 0.5; // 假设每个字符0.5字节
  }
}

// 瓦片享元工厂
class TileFlyweightFactory {
  constructor() {
    this.tiles = {};
    this.maxCacheSize = 100; // 最大缓存瓦片数量
    this.lastUsed = {}; // 记录瓦片最后使用时间
    this.cacheHits = 0; // 缓存命中计数
    this.cacheMisses = 0; // 缓存未命中计数
  }

  // 获取瓦片ID
  getTileId(zoomLevel, x, y) {
    return `tile_${zoomLevel}_${x}_${y}`;
  }

  // 获取瓦片享元对象
  getTile(zoomLevel, x, y) {
    const tileId = this.getTileId(zoomLevel, x, y);
    
    // 更新使用时间
    const now = Date.now();
    
    if (this.tiles[tileId]) {
      // 缓存命中
      this.cacheHits++;
      this.lastUsed[tileId] = now;
      return this.tiles[tileId];
    }
    
    // 缓存未命中，创建新瓦片
    this.cacheMisses++;
    
    // 如果缓存已满，移除最久未使用的瓦片
    if (Object.keys(this.tiles).length >= this.maxCacheSize) {
      this.evictOldestTile();
    }
    
    // 模拟加载瓦片数据
    const tileData = `瓦片数据[${zoomLevel},${x},${y}]`;
    this.tiles[tileId] = new ConcreteTileFlyweight(tileId, tileData);
    this.lastUsed[tileId] = now;
    
    return this.tiles[tileId];
  }

  // 移除最久未使用的瓦片
  evictOldestTile() {
    let oldestTileId = null;
    let oldestTime = Infinity;
    
    for (const tileId in this.lastUsed) {
      if (this.lastUsed[tileId] < oldestTime) {
        oldestTime = this.lastUsed[tileId];
        oldestTileId = tileId;
      }
    }
    
    if (oldestTileId) {
      console.log(`从缓存中移除最久未使用的瓦片: ${oldestTileId}`);
      delete this.tiles[oldestTileId];
      delete this.lastUsed[oldestTileId];
    }
  }

  // 预加载瓦片
  preloadTiles(zoomLevel, centerX, centerY, radius) {
    console.log(`预加载瓦片 - 缩放级别: ${zoomLevel}, 中心: (${centerX}, ${centerY}), 半径: ${radius}`);
    
    for (let x = centerX - radius; x <= centerX + radius; x++) {
      for (let y = centerY - radius; y <= centerY + radius; y++) {
        this.getTile(zoomLevel, x, y);
      }
    }
  }

  // 获取缓存统计信息
  getCacheStats() {
    const totalAccesses = this.cacheHits + this.cacheMisses;
    const hitRate = totalAccesses > 0 ? Math.round((this.cacheHits / totalAccesses) * 100) : 0;
    
    // 计算缓存使用的内存（模拟）
    let totalMemoryUsage = 0;
    for (const tileId in this.tiles) {
      totalMemoryUsage += this.tiles[tileId].getDataSize();
    }
    
    return {
      cachedTiles: Object.keys(this.tiles).length,
      maxCacheSize: this.maxCacheSize,
      cacheHits: this.cacheHits,
      cacheMisses: this.cacheMisses,
      hitRate: hitRate + '%',
      memoryUsage: totalMemoryUsage.toFixed(2) + ' KB'
    };
  }

  // 清除缓存
  clearCache() {
    this.tiles = {};
    this.lastUsed = {};
    console.log('瓦片缓存已清除');
  }
}

// 地图渲染器类
class MapRenderer {
  constructor() {
    this.tileFactory = new TileFlyweightFactory();
    this.viewportWidth = 800;
    this.viewportHeight = 600;
    this.tileSize = 256; // 瓦片大小（像素）
    this.visibleTiles = [];
  }

  // 设置视口大小
  setViewportSize(width, height) {
    this.viewportWidth = width;
    this.viewportHeight = height;
  }

  // 计算可见瓦片范围
  calculateVisibleTiles(zoomLevel, centerX, centerY) {
    // 计算可见瓦片数量
    const tilesX = Math.ceil(this.viewportWidth / this.tileSize) + 1;
    const tilesY = Math.ceil(this.viewportHeight / this.tileSize) + 1;
    
    // 计算中心瓦片坐标
    const centerTileX = Math.floor(centerX / this.tileSize);
    const centerTileY = Math.floor(centerY / this.tileSize);
    
    // 计算可见瓦片范围
    const startX = centerTileX - Math.floor(tilesX / 2);
    const endX = centerTileX + Math.ceil(tilesX / 2);
    const startY = centerTileY - Math.floor(tilesY / 2);
    const endY = centerTileY + Math.ceil(tilesY / 2);
    
    return { startX, endX, startY, endY };
  }

  // 渲染地图
  renderMap(zoomLevel, centerX, centerY) {
    console.log(`\n渲染地图 - 缩放级别: ${zoomLevel}, 中心位置: (${centerX}, ${centerY})`);
    
    // 计算可见瓦片范围
    const { startX, endX, startY, endY } = this.calculateVisibleTiles(zoomLevel, centerX, centerY);
    
    console.log(`可见瓦片范围: X(${startX}~${endX}), Y(${startY}~${endY})`);
    
    // 清空可见瓦片列表
    this.visibleTiles = [];
    
    // 渲染每个可见瓦片
    for (let x = startX; x <= endX; x++) {
      for (let y = startY; y <= endY; y++) {
        // 计算瓦片在屏幕上的位置
        const screenX = (x * this.tileSize) - centerX + (this.viewportWidth / 2);
        const screenY = (y * this.tileSize) - centerY + (this.viewportHeight / 2);
        
        // 获取并渲染瓦片
        const tile = this.tileFactory.getTile(zoomLevel, x, y);
        const renderResult = tile.render(zoomLevel, { x: screenX, y: screenY });
        this.visibleTiles.push(renderResult);
      }
    }
    
    // 显示渲染统计信息
    console.log(`渲染的瓦片数量: ${this.visibleTiles.length}`);
    const stats = this.tileFactory.getCacheStats();
    console.log(`缓存瓦片数量: ${stats.cachedTiles}/${stats.maxCacheSize}`);
    console.log(`缓存命中率: ${stats.hitRate}`);
    
    return this.visibleTiles;
  }

  // 模拟地图平移
  pan(deltaX, deltaY, currentZoom, currentX, currentY) {
    const newX = currentX + deltaX;
    const newY = currentY + deltaY;
    console.log(`\n平移地图 - 偏移: (${deltaX}, ${deltaY})`);
    return this.renderMap(currentZoom, newX, newY);
  }

  // 模拟地图缩放
  zoom(zoomIn, currentZoom, currentX, currentY) {
    const newZoom = zoomIn ? currentZoom + 1 : Math.max(0, currentZoom - 1);
    console.log(`\n缩放地图 - 新缩放级别: ${newZoom}`);
    return this.renderMap(newZoom, currentX, currentY);
  }

  // 获取渲染统计信息
  getRenderStats() {
    return {
      visibleTiles: this.visibleTiles.length,
      cacheStats: this.tileFactory.getCacheStats()
    };
  }
}

// 客户端代码
function clientCode() {
  console.log('--- 在线地图瓦片系统中的享元模式示例 ---');
  
  // 创建地图渲染器
  const mapRenderer = new MapRenderer();
  
  // 设置视口大小
  mapRenderer.setViewportSize(1200, 800);
  
  // 初始渲染（缩放级别10，中心位置在城市中心）
  const initialZoom = 10;
  const initialX = 5000;
  const initialY = 3000;
  
  console.log('初始地图渲染:');
  mapRenderer.renderMap(initialZoom, initialX, initialY);
  
  // 模拟用户平移地图
  console.log('\n用户平移地图:');
  mapRenderer.pan(100, -150, initialZoom, initialX, initialY);
  
  // 模拟用户继续平移地图
  mapRenderer.pan(200, 50, initialZoom, initialX + 100, initialY - 150);
  
  // 模拟用户缩放地图
  console.log('\n用户放大地图:');
  mapRenderer.zoom(true, initialZoom, initialX + 300, initialY - 100);
  
  // 显示最终统计信息
  console.log('\n最终渲染统计信息:');
  const stats = mapRenderer.getRenderStats();
  console.log(`当前可见瓦片: ${stats.visibleTiles}`);
  console.log(`缓存统计: ${JSON.stringify(stats.cacheStats, null, 2)}`);
  
  console.log('\n通过享元模式，我们只在内存中保留必要的瓦片数据，重复使用相同的瓦片对象，大大减少了内存使用！');
}

// 使用示例
clientCode();
```

### 3. 图表数据可视化中的数据点渲染

```javascript
// 数据点享元接口
class DataPointFlyweight {
  render(context, x, y, size, color, shape) {
    throw new Error('此方法必须由子类实现');
  }
}

// 圆形数据点享元类
class CircleDataPointFlyweight extends DataPointFlyweight {
  constructor() {
    super();
    console.log('创建圆形数据点享元');
  }

  // 渲染圆形数据点
  render(context, x, y, size, color, shape) {
    // 在实际Canvas中，这里会调用context.arc等方法
    console.log(`渲染圆形 - 位置: (${x}, ${y}), 大小: ${size}, 颜色: ${color}`);
    return {
      type: 'circle',
      x,
      y,
      size,
      color
    };
  }
}

// 方形数据点享元类
class SquareDataPointFlyweight extends DataPointFlyweight {
  constructor() {
    super();
    console.log('创建方形数据点享元');
  }

  // 渲染方形数据点
  render(context, x, y, size, color, shape) {
    // 在实际Canvas中，这里会调用context.rect等方法
    console.log(`渲染方形 - 位置: (${x}, ${y}), 大小: ${size}, 颜色: ${color}`);
    return {
      type: 'square',
      x,
      y,
      size,
      color
    };
  }
}

// 三角形数据点享元类
class TriangleDataPointFlyweight extends DataPointFlyweight {
  constructor() {
    super();
    console.log('创建三角形数据点享元');
  }

  // 渲染三角形数据点
  render(context, x, y, size, color, shape) {
    // 在实际Canvas中，这里会调用context.beginPath等方法绘制三角形
    console.log(`渲染三角形 - 位置: (${x}, ${y}), 大小: ${size}, 颜色: ${color}`);
    return {
      type: 'triangle',
      x,
      y,
      size,
      color
    };
  }
}

// 数据点享元工厂
class DataPointFlyweightFactory {
  constructor() {
    this.flyweights = {};
  }

  // 获取数据点享元对象
  getDataPoint(shape) {
    if (!this.flyweights[shape]) {
      switch (shape) {
        case 'circle':
          this.flyweights[shape] = new CircleDataPointFlyweight();
          break;
        case 'square':
          this.flyweights[shape] = new SquareDataPointFlyweight();
          break;
        case 'triangle':
          this.flyweights[shape] = new TriangleDataPointFlyweight();
          break;
        default:
          this.flyweights[shape] = new CircleDataPointFlyweight();
      }
    }
    return this.flyweights[shape];
  }
}

export default {
  name: 'FlyweightChart',
  props: {
    title: {
      type: String,
      default: '数据可视化图表'
    },
    width: {
      type: Number,
      default: 800
    },
    height: {
      type: Number,
      default: 600
    }
  },
  data() {
    return {
      dataSeries: [],
      dataPointFactory: new DataPointFlyweightFactory()
    };
  },
  mounted() {
    // 初始化图表
    this.initializeChart();
  },
  methods: {
    initializeChart() {
      // 添加示例数据系列
      this.addDataSeries('数据系列A', this.generateSampleData(1000, this.width, this.height), {
        color: '#3498db',
        shape: 'circle',
        size: 3,
        visible: true
      });
      
      this.addDataSeries('数据系列B', this.generateSampleData(800, this.width, this.height), {
        color: '#e74c3c',
        shape: 'square',
        size: 4,
        visible: true
      });
      
      // 渲染图表
      this.redrawChart();
    },
    
    addDataSeries(name, data, options = {}) {
      const defaults = {
        color: '#000000',
        shape: 'circle',
        size: 5,
        visible: true
      };
      
      const series = {
        name,
        data,
        options: { ...defaults, ...options }
      };
      
      this.dataSeries.push(series);
      console.log(`添加数据系列: ${name} (${data.length}个数据点)`);
      
      return series;
    },
    
    generateSampleData(count, xRange, yRange) {
      const data = [];
      for (let i = 0; i < count; i++) {
        data.push({
          x: Math.random() * xRange,
          y: Math.random() * yRange
        });
      }
      return data;
    },
    
    redrawChart() {
      const canvas = this.$refs.chartCanvas;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, this.width, this.height);
      
      // 渲染每个可见的数据系列
      for (const series of this.dataSeries) {
        if (!series.options.visible) continue;
        
        const dataPoint = this.dataPointFactory.getDataPoint(series.options.shape);
        
        for (const point of series.data) {
          dataPoint.render(
            ctx,
            point.x,
            point.y,
            series.options.size,
            series.options.color
          );
        }
      }
      
      console.log(`渲染完成 - 数据点总数: ${this.getTotalDataPoints()}`);
    },
    
    getTotalDataPoints() {
      return this.dataSeries.reduce((sum, series) => {
        return sum + (series.options.visible ? series.data.length : 0);
      }, 0);
    }
  }
}
</script>

<style scoped>
.chart-container {
  font-family: Arial, sans-serif;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

h2 {
  margin-top: 0;
  color: #333;
}

canvas {
  border: 1px solid #ccc;
  background-color: white;
  display: block;
  margin: 20px 0;
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.legend-marker {
  display: inline-block;
}
</style>
```

## 享元模式在React中的应用

以下是React中使用享元模式优化大型列表渲染的示例：

```jsx
// FlyweightListItem.jsx - 列表项享元组件
import React from 'react';

// 享元工厂 - 管理共享的列表项渲染逻辑
class ListItemFlyweightFactory {
  constructor() {
    // 缓存不同类型的渲染器
    this.renderers = {};
  }

  // 获取对应类型的列表项渲染器
  getRenderer(itemType) {
    if (!this.renderers[itemType]) {
      // 根据类型创建不同的渲染策略
      switch (itemType) {
        case 'text':
          this.renderers[itemType] = this.renderTextItem;
          break;
        case 'image':
          this.renderers[itemType] = this.renderImageItem;
          break;
        case 'link':
          this.renderers[itemType] = this.renderLinkItem;
          break;
        default:
          this.renderers[itemType] = this.renderTextItem;
      }
    }
    return this.renderers[itemType];
  }

  // 文本项渲染方法
  renderTextItem(item, index) {
    return (
      <div className="list-item text-item">
        <span className="item-index">{index + 1}.</span>
        <span className="item-content">{item.content}</span>
        {item.highlight && <span className="highlight">[高亮]</span>}
      </div>
    );
  }

  // 图像项渲染方法
  renderImageItem(item, index) {
    return (
      <div className="list-item image-item">
        <span className="item-index">{index + 1}.</span>
        <img 
          src={item.imageUrl} 
          alt={item.alt || 'List item image'}
          className="item-image"
          loading="lazy"
        />
        {item.caption && <div className="image-caption">{item.caption}</div>}
      </div>
    );
  }

  // 链接项渲染方法
  renderLinkItem(item, index) {
    return (
      <div className="list-item link-item">
        <span className="item-index">{index + 1}.</span>
        <a 
          href={item.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className={`item-link ${item.external ? 'external' : ''}`}
        >
          {item.title}
        </a>
        {item.description && <div className="link-description">{item.description}</div>}
      </div>
    );
  }

  // 获取渲染器数量
  getRendererCount() {
    return Object.keys(this.renderers).length;
  }
}

// 创建全局享元工厂实例
const flyweightFactory = new ListItemFlyweightFactory();

// 列表项组件 - 使用享元模式
const FlyweightListItem = ({ item, index, style }) => {
  // 根据项目类型获取对应的渲染器
  const renderer = flyweightFactory.getRenderer(item.type);
  
  // 使用渲染器渲染列表项
  return (
    <div 
      className={`flyweight-list-item ${item.selected ? 'selected' : ''}`}
      style={style}
    >
      {renderer(item, index)}
    </div>
  );
};

// 虚拟化列表组件
const VirtualizedList = ({ items, height = 400, itemHeight = 50, overscanCount = 5 }) => {
  const [scrollTop, setScrollTop] = React.useState(0);
  
  // 计算可见项的范围
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscanCount);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + height) / itemHeight) + overscanCount
  );
  
  // 提取可见项
  const visibleItems = items.slice(startIndex, endIndex + 1);
  
  // 计算列表容器的总高度
  const totalHeight = items.length * itemHeight;
  
  // 计算可见项的偏移
  const offsetY = startIndex * itemHeight;
  
  // 处理滚动事件
  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };

  return (
    <div className="virtualized-list-container" style={{ height, overflow: 'auto' }} onScroll={handleScroll}>
      <div className="virtualized-list-wrapper" style={{ height: totalHeight }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <FlyweightListItem
              key={`${item.id || index}-${startIndex + index}`}
              item={item}
              index={startIndex + index}
              style={{ height: itemHeight }}
            />
          ))}
        </div>
      </div>
      
      <div className="list-info">
        <div>总项目数: {items.length}</div>
        <div>可见项目数: {visibleItems.length}</div>
        <div>渲染器类型: {flyweightFactory.getRendererCount()}</div>
      </div>
    </div>
  );
};

// 应用示例组件
const FlyweightPatternExample = () => {
  // 生成大量数据
  const generateLargeDataset = (count) => {
    const items = [];
    const types = ['text', 'image', 'link'];
    
    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      
      switch (type) {
        case 'text':
          items.push({
            id: `item-${i}`,
            type,
            content: `文本项目 ${i + 1}: 这是一个示例文本内容。`,
            highlight: Math.random() > 0.7,
            selected: false
          });
          break;
          
        case 'image':
          items.push({
            id: `item-${i}`,
            type,
            imageUrl: `https://picsum.photos/seed/${i}/200/150`,
            alt: `示例图片 ${i + 1}`,
            caption: Math.random() > 0.5 ? `图片说明 ${i + 1}` : null,
            selected: false
          });
          break;
          
        case 'link':
          items.push({
            id: `item-${i}`,
            type,
            url: `https://example.com/page${i + 1}`,
            title: `链接标题 ${i + 1}`,
            description: Math.random() > 0.5 ? `链接描述内容 ${i + 1}` : null,
            external: true,
            selected: false
          });
          break;
      }
    }
    
    return items;
  };
  
  // 生成10000个列表项
  const items = React.useMemo(() => generateLargeDataset(10000), []);

  return (
    <div className="flyweight-pattern-example">
      <h1>享元模式在React大型列表中的应用</h1>
      <p>使用享元模式和虚拟滚动优化大量列表项的渲染性能</p>
      
      <VirtualizedList 
        items={items} 
        height={600} 
        itemHeight={80} 
        overscanCount={3}
      />
      
      <div className="performance-stats">
        <h3>性能优化统计</h3>
        <ul>
          <li>通过享元模式，我们只创建了3个渲染器实例，但渲染了10000个列表项</li>
          <li>通过虚拟滚动，我们只渲染了屏幕可见范围内的项目，而不是全部10000个</li>
          <li>内存使用显著减少，即使对于大量数据，也能保持流畅的滚动体验</li>
        </ul>
      </div>
    </div>
  );
};

export default FlyweightPatternExample;
```

## 享元模式的常见问题与解答

### 1. 享元模式与对象池模式有什么区别？

**享元模式**关注于通过共享对象的内部状态来减少内存使用，主要用于优化大量相似对象的存储。

**对象池模式**关注于对象的重用，通过预创建和管理对象集合，避免频繁创建和销毁对象的开销，主要用于优化对象的创建性能。

两者都涉及对象共享，但享元模式侧重于内存优化，而对象池模式侧重于性能优化。在某些场景下，两者可以结合使用。

### 2. 如何确定哪些状态应该作为内部状态，哪些作为外部状态？

内部状态应该满足以下条件：
- 可以被多个对象共享
- 不会随环境变化而变化
- 存储在享元对象内部

外部状态应该满足以下条件：
- 不能被共享
- 会随环境变化而变化
- 由客户端维护，在使用时传入

一般来说，内部状态是对象的不变部分，而外部状态是对象的可变部分。

### 3. 享元模式在JavaScript中的应用场景有哪些？

JavaScript中享元模式的常见应用场景包括：

- **大型DOM操作**：当需要创建大量相似DOM元素时，可以使用享元模式共享DOM结构
- **图形渲染**：游戏开发中的精灵、粒子系统、Canvas绘图等
- **文本处理**：文档编辑器中的字符渲染
- **列表渲染优化**：虚拟滚动列表中的项渲染
- **资源池管理**：如连接池、线程池等
- **对象工厂**：通过缓存已创建的对象实例来减少对象创建

### 4. 享元模式可能带来哪些性能问题？

虽然享元模式可以减少内存使用，但在某些情况下可能带来性能问题：

- **查找开销**：在享元工厂中查找已存在的对象可能带来一定的性能开销
- **状态管理复杂**：管理内部状态和外部状态可能增加代码复杂度和维护成本
- **线程安全问题**：在多线程环境下，共享对象可能需要额外的同步机制
- **缓存失效**：如果缓存的享元对象过多，可能导致缓存失效或内存压力

在使用享元模式时，需要权衡内存使用和性能开销。

### 5. 如何实现一个高效的享元工厂？

要实现高效的享元工厂，可以考虑以下几点：

- **使用合适的数据结构**：如Map、Set等高效数据结构来存储享元对象
- **实现缓存淘汰策略**：如LRU、LFU等策略，在缓存满时淘汰不常用的对象
- **优化查找算法**：使用哈希表等O(1)时间复杂度的数据结构
- **预加载常用对象**：根据使用模式预加载可能用到的享元对象
- **监控和调优**：添加缓存命中率等监控指标，根据实际情况进行调优

### 6. 享元模式在现代前端框架中的应用？

现代前端框架中，享元模式的思想被广泛应用：

- **React的虚拟DOM**：通过复用和更新DOM节点，而不是重新创建，提高渲染性能
- **Vue的组件复用**：相同的组件定义会被复用，而不是为每个实例创建新的定义
- **Angular的变更检测优化**：通过策略模式和享元思想优化大量组件的变更检测
- **图形库（如Three.js）**：使用几何缓冲、纹理共享等技术减少内存使用
- **UI组件库**：共享组件模板和样式定义，减少重复代码

## 总结

享元模式是一种强大的结构型设计模式，通过共享相似对象的内部状态来显著减少内存使用。它特别适用于需要创建大量相似对象的场景，如游戏开发、图形渲染、文本处理等。

在实现享元模式时，关键是正确识别和分离内部状态和外部状态。内部状态是可以共享的，而外部状态是不能共享的，需要由客户端维护。

虽然享元模式可以带来显著的内存优化，但也增加了系统的复杂性。在使用享元模式时，需要权衡内存使用和设计复杂度，根据实际需求做出选择。

在JavaScript和现代前端开发中，享元模式的思想被广泛应用于虚拟DOM、组件系统、图形渲染等领域，是优化大型应用性能和内存使用的重要工具。
    if (!this.flyweights[shape]) {
      switch (shape) {
        case 'circle':
          this.flyweights[shape] = new CircleDataPointFlyweight();
          break;
        case 'square':
          this.flyweights[shape] = new SquareDataPointFlyweight();
          break;
        case 'triangle':
          this.flyweights[shape] = new TriangleDataPointFlyweight();
          break;
        default:
          // 默认使用圆形
          this.flyweights[shape] = new CircleDataPointFlyweight();
      }
    }
    return this.flyweights[shape];
  }

  // 获取享元对象数量
  getFlyweightCount() {
    return Object.keys(this.flyweights).length;
  }

  // 获取所有可用的形状
  getAvailableShapes() {
    return Object.keys(this.flyweights);
  }
}

// 图表渲染器类
class ChartRenderer {
  constructor() {
    this.dataPointFactory = new DataPointFlyweightFactory();
    this.dataSeries = [];
    this.width = 800;
    this.height = 600;
  }

  // 设置图表大小
  setSize(width, height) {
    this.width = width;
    this.height = height;
  }

  // 添加数据系列
  addDataSeries(name, data, options = {}) {
    const defaults = {
      color: '#000000',
      shape: 'circle',
      size: 5,
      visible: true
    };
    
    const series = {
      name,
      data,
      options: { ...defaults, ...options }
    };
    
    this.dataSeries.push(series);
    console.log(`添加数据系列: ${name} (${data.length}个数据点)`);
    
    return series;
  }

  // 渲染图表
  render() {
    console.log(`\n渲染图表 - 大小: ${this.width}x${this.height}`);
    console.log(`数据系列数量: ${this.dataSeries.length}`);
    
    // 模拟Canvas上下文
    const context = { type: 'canvas-context' };
    
    let totalDataPoints = 0;
    const renderResults = [];
    
    // 渲染每个数据系列
    for (const series of this.dataSeries) {
      if (!series.options.visible) continue;
      
      console.log(`\n渲染数据系列: ${series.name}`);
      console.log(`样式: ${series.options.shape}, ${series.options.color}, 大小: ${series.options.size}`);
      
      // 获取对应形状的数据点享元对象
      const dataPointFlyweight = this.dataPointFactory.getDataPoint(series.options.shape);
      
      // 渲染系列中的每个数据点
      for (const point of series.data) {
        // 假设point已经是屏幕坐标
        const result = dataPointFlyweight.render(
          context,
          point.x,
          point.y,
          series.options.size,
          series.options.color,
          series.options.shape
        );
        renderResults.push(result);
        totalDataPoints++;
      }
    }
    
    // 显示渲染统计信息
    console.log('\n渲染统计信息:');
    console.log(`渲染的数据点总数: ${totalDataPoints}`);
    console.log(`使用的数据点享元对象数: ${this.dataPointFactory.getFlyweightCount()}`);
    console.log(`可用的形状: ${this.dataPointFactory.getAvailableShapes().join(', ')}`);
    
    return renderResults;
  }

  // 生成模拟数据
  generateSampleData(count, xRange, yRange, offsetX = 0, offsetY = 0) {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        x: offsetX + Math.random() * xRange,
        y: offsetY + Math.random() * yRange
      });
    }
    return data;
  }

  // 获取图表信息
  getChartInfo() {
    const totalPoints = this.dataSeries.reduce((sum, series) => {
      return sum + (series.options.visible ? series.data.length : 0);
    }, 0);
    
    return {
      width: this.width,
      height: this.height,
      seriesCount: this.dataSeries.length,
      visibleSeries: this.dataSeries.filter(s => s.options.visible).length,
      totalDataPoints: totalPoints,
      flyweightCount: this.dataPointFactory.getFlyweightCount(),
      memorySavings: this.calculateMemorySavings(totalPoints)
    };
  }

  // 计算内存节省情况（模拟）
  calculateMemorySavings(totalPoints) {
    const flyweightCount = this.dataPointFactory.getFlyweightCount();
    // 假设每个数据点对象占用100字节，享元对象占用500字节
    const withoutFlyweight = totalPoints * 100;
    const withFlyweight = flyweightCount * 500 + totalPoints * 20; // 20字节用于存储外部状态引用
    const savedBytes = withoutFlyweight - withFlyweight;
    const savingsPercentage = Math.round((savedBytes / withoutFlyweight) * 100);
    
    return {
      savedBytes,
      savingsPercentage: savingsPercentage + '%',
      withoutFlyweight: `${(withoutFlyweight / 1024).toFixed(2)} KB`,
      withFlyweight: `${(withFlyweight / 1024).toFixed(2)} KB`
    };
  }
}

// 客户端代码
function clientCode() {
  console.log('--- 图表数据可视化中的享元模式示例 ---');
  
  // 创建图表渲染器
  const chart = new ChartRenderer();
  chart.setSize(1200, 800);
  
  // 生成并添加多个数据系列
  console.log('添加数据系列...');
  
  // 添加10,000个圆形数据点
  const circleData = chart.generateSampleData(10000, 1200, 800);
  chart.addDataSeries('散点数据A', circleData, {
    color: '#3498db',
    shape: 'circle',
    size: 3
  });
  
  // 添加5,000个方形数据点
  const squareData = chart.generateSampleData(5000, 1200, 800);
  chart.addDataSeries('散点数据B', squareData, {
    color: '#e74c3c',
    shape: 'square',
    size: 4
  });
  
  // 添加8,000个三角形数据点
  const triangleData = chart.generateSampleData(8000, 1200, 800);
  chart.addDataSeries('散点数据C', triangleData, {
    color: '#2ecc71',
    shape: 'triangle',
    size: 5
  });
  
  // 再添加一个圆形数据系列（验证对象共享）
  const anotherCircleData = chart.generateSampleData(7000, 1200, 800);
  chart.addDataSeries('散点数据D', anotherCircleData, {
    color: '#f39c12',
    shape: 'circle',
    size: 2
  });
  
  // 渲染图表
  chart.render();
  
  // 显示图表信息
  console.log('\n图表信息:');
  const info = chart.getChartInfo();
  console.log(`图表大小: ${info.width}x${info.height}`);
  console.log(`数据系列: ${info.seriesCount} (可见: ${info.visibleSeries})`);
  console.log(`数据点总数: ${info.totalDataPoints}`);
  console.log(`享元对象数量: ${info.flyweightCount}`);
  console.log('\n内存使用比较:');
  console.log(`不使用享元模式: ${info.memorySavings.withoutFlyweight}`);
  console.log(`使用享元模式: ${info.memorySavings.withFlyweight}`);
  console.log(`节省内存: ${info.memorySavings.savedBytes} 字节 (${info.memorySavings.savingsPercentage})`);
  
  console.log('\n通过享元模式，我们只创建了3个数据点对象（圆形、方形、三角形），但却渲染了30,000个数据点！');
}

// 使用示例
clientCode();
```

## 享元模式在前端框架中的应用

### Vue.js中的组件复用

Vue.js的组件系统在某种程度上利用了享元模式的思想，特别是在虚拟DOM渲染和组件复用方面：

```vue
<template>
  <div class="chart-container">
    <h2>{{ title }}</h2>
    <canvas ref="chartCanvas" :width="width" :height="height"></canvas>
    <div class="legend">
      <div 
        v-for="series in dataSeries" 
        :key="series.name"
        class="legend-item"
        :style="{ display: series.options.visible ? 'flex' : 'none' }"
      >
        <div 
          class="legend-marker"
          :style="{
            backgroundColor: series.options.color,
            width: series.options.size + 'px',
            height: series.options.size + 'px',
            borderRadius: series.options.shape === 'circle' ? '50%' : 
                          series.options.shape === 'triangle' ? '0' : '0'
          }"
        ></div>
        <span>{{ series.name }}</span>
        <input 
          type="checkbox" 
          v-model="series.options.visible"
          @change="redrawChart"
        >
      </div>
    </div>
  </div>
</template>

<script>
// 数据点享元类定义（类似于前面的实现）
class DataPointFlyweight {
  render(context, x, y, size, color, shape) {
    throw new Error('此方法必须由子类实现');
  }
}

class CircleDataPointFlyweight extends DataPointFlyweight {
  render(context, x, y, size, color) {
    context.beginPath();
    context.arc(x, y, size, 0, 2 * Math.PI);
    context.fillStyle = color;
    context.fill();
  }
}

class SquareDataPointFlyweight extends DataPointFlyweight {
  render(context, x, y, size, color) {
    context.fillStyle = color;
    context.fillRect(x - size / 2, y - size / 2, size, size);
  }
}

class TriangleDataPointFlyweight extends DataPointFlyweight {
  render(context, x, y, size, color) {
    context.beginPath();
    context.moveTo(x, y - size);
    context.lineTo(x - size, y + size);
    context.lineTo(x + size, y + size);
    context.closePath();
    context.fillStyle = color;
    context.fill();
  }
}

// 享元工厂
class DataPointFlyweightFactory {
  constructor() {
    this.flyweights = {};
  }

  getDataPoint(shape) {