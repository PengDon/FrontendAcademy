# Neo4j 与 Node.js 集成

## 1. Neo4j 基础概念

Neo4j是一个高性能的开源图数据库，专为存储和查询高度关联的数据而设计。它采用图数据模型，通过节点（Nodes）和关系（Relationships）来表示和存储数据，相比传统关系型数据库，在处理复杂关系查询时具有显著优势。

### 1.1 Neo4j 的主要特性

- **原生图存储**：专为图数据优化的存储引擎，高效存储和检索节点和关系
- **强大的图查询语言**：使用 Cypher 查询语言，专为图数据设计的声明式查询语言
- **高性能**：在查询复杂关系数据时性能卓越，特别适合处理深层次关联查询
- **ACID 事务支持**：确保数据的原子性、一致性、隔离性和持久性
- **灵活的数据模型**：无需预定义严格的模式，可以根据需求动态添加属性和关系
- **可扩展性**：支持横向扩展，可处理超大规模图数据
- **丰富的图算法**：内置多种图算法，如路径查找、社区检测、中心性分析等

### 1.2 Neo4j 的应用场景

- **社交网络**：用户关系、好友推荐、影响力分析
- **知识图谱**：语义搜索、信息关联、知识推理
- **欺诈检测**：识别异常交易模式和关系网络
- **推荐系统**：基于用户行为和关系的个性化推荐
- **网络和 IT 运营**：基础设施拓扑、依赖关系分析
- **医疗健康**：患者关系、疾病关联、药物相互作用
- **金融服务**：风险评估、供应链分析、合规性检查

## 2. Node.js 中使用 Neo4j

### 2.1 安装依赖

```bash
npm install neo4j-driver
```

### 2.2 基本连接配置

```javascript
const neo4j = require('neo4j-driver');

// 创建驱动实例
const driver = neo4j.driver(
  'neo4j://localhost:7687', // Neo4j 连接 URI
  neo4j.auth.basic('neo4j', 'password'), // 身份验证信息
  {
    maxConnectionPoolSize: 100, // 最大连接池大小
    encrypted: false, // 是否加密连接（生产环境建议设置为 true）
    trust: 'TRUST_SYSTEM_CA_SIGNED_CERTIFICATES', // 信任策略
    logging: {
      level: 'info', // 日志级别
      logger: (level, message) => console.log(`${level}: ${message}`) // 自定义日志处理
    }
  }
);

// 验证连接
async function verifyConnection() {
  let session;
  try {
    session = driver.session();
    // 执行简单查询以验证连接
    const result = await session.run('RETURN 1 as num');
    console.log('Neo4j 连接成功:', result.records[0].get('num').toNumber());
    return true;
  } catch (error) {
    console.error('Neo4j 连接失败:', error);
    return false;
  } finally {
    if (session) {
      await session.close();
    }
  }
}

// 关闭驱动连接
async function closeConnection() {
  try {
    await driver.close();
    console.log('Neo4j 驱动已关闭');
  } catch (error) {
    console.error('关闭 Neo4j 驱动时出错:', error);
  }
}

// 执行示例
async function runExample() {
  const isConnected = await verifyConnection();
  if (isConnected) {
    console.log('Neo4j 客户端已准备就绪');
    // 执行查询或其他操作
  } else {
    console.error('无法连接到 Neo4j，终止执行');
  }
  
  // 在应用程序结束时关闭连接
  // await closeConnection();
}

runExample().catch(console.error);
```

## 3. 核心数据操作（CRUD）

### 3.1 创建节点（CREATE）

```javascript
async function createNodes() {
  let session;
  try {
    session = driver.session();
    
    // 创建单个节点
    await session.run(
      'CREATE (p:Person {name: $name, age: $age, email: $email}) RETURN p',
      { name: '张三', age: 30, email: 'zhangsan@example.com' }
    );
    console.log('创建了一个人员节点');
    
    // 创建多个节点
    const people = [
      { name: '李四', age: 28, email: 'lisi@example.com' },
      { name: '王五', age: 35, email: 'wangwu@example.com' },
      { name: '赵六', age: 40, email: 'zhaoliu@example.com' }
    ];
    
    for (const person of people) {
      await session.run(
        'CREATE (p:Person {name: $name, age: $age, email: $email}) RETURN p',
        person
      );
    }
    console.log('创建了多个人员节点');
    
    // 创建不同类型的节点
    await session.run(
      'CREATE (c:Company {name: $name, industry: $industry, founded: $founded}) RETURN c',
      { name: '科技公司', industry: '软件', founded: 2010 }
    );
    console.log('创建了一个公司节点');
    
  } catch (error) {
    console.error('创建节点失败:', error);
  } finally {
    if (session) {
      await session.close();
    }
  }
}
```

### 3.2 查询节点（MATCH）

```javascript
async function queryNodes() {
  let session;
  try {
    session = driver.session();
    
    // 查找所有人员节点
    const result1 = await session.run('MATCH (p:Person) RETURN p LIMIT 10');
    console.log('找到的人员节点数:', result1.records.length);
    result1.records.forEach(record => {
      const person = record.get('p').properties;
      console.log(`姓名: ${person.name}, 年龄: ${person.age}`);
    });
    
    // 根据属性条件查找
    const result2 = await session.run(
      'MATCH (p:Person) WHERE p.age > $age RETURN p',
      { age: 30 }
    );
    console.log('年龄大于30的人员数:', result2.records.length);
    
    // 按属性排序
    const result3 = await session.run(
      'MATCH (p:Person) RETURN p ORDER BY p.age DESC LIMIT 5'
    );
    console.log('按年龄降序排列的前5名人员:');
    result3.records.forEach(record => {
      const person = record.get('p').properties;
      console.log(`姓名: ${person.name}, 年龄: ${person.age}`);
    });
    
    // 投影特定属性
    const result4 = await session.run(
      'MATCH (p:Person) RETURN p.name, p.email LIMIT 3'
    );
    console.log('人员的姓名和邮箱:');
    result4.records.forEach(record => {
      console.log(`姓名: ${record.get('p.name')}, 邮箱: ${record.get('p.email')}`);
    });
    
  } catch (error) {
    console.error('查询节点失败:', error);
  } finally {
    if (session) {
      await session.close();
    }
  }
}
```

### 3.3 更新节点（SET/REMOVE）

```javascript
async function updateNodes() {
  let session;
  try {
    session = driver.session();
    
    // 更新节点属性
    await session.run(
      'MATCH (p:Person {name: $name}) SET p.age = $newAge, p.updated_at = datetime() RETURN p',
      { name: '张三', newAge: 31 }
    );
    console.log('更新了张三的年龄');
    
    // 添加新属性
    await session.run(
      'MATCH (p:Person) SET p.last_login = datetime()'
    );
    console.log('为所有人员添加了最后登录时间');
    
    // 移除属性
    await session.run(
      'MATCH (p:Person {name: $name}) REMOVE p.email RETURN p',
      { name: '李四' }
    );
    console.log('移除了李四的邮箱属性');
    
    // 增加多个标签
    await session.run(
      'MATCH (p:Person {name: $name}) SET p:Employee:Manager RETURN p',
      { name: '王五' }
    );
    console.log('为王五添加了Employee和Manager标签');
    
  } catch (error) {
    console.error('更新节点失败:', error);
  } finally {
    if (session) {
      await session.close();
    }
  }
}
```

### 3.4 删除节点（DELETE）

```javascript
async function deleteNodes() {
  let session;
  try {
    session = driver.session();
    
    // 删除单个节点（确保没有关系连接）
    await session.run(
      'MATCH (p:Person {name: $name}) DELETE p',
      { name: '赵六' }
    );
    console.log('删除了赵六的节点');
    
    // 删除所有特定类型的节点及其关系
    const result = await session.run(
      'MATCH (p:Person)-[r]-() DELETE r, p RETURN count(p) as deletedCount'
    );
    const deletedCount = result.records[0].get('deletedCount').toNumber();
    console.log(`删除了 ${deletedCount} 个人员节点及其所有关系`);
    
    // 删除所有节点和关系
    // await session.run('MATCH (n) DETACH DELETE n');
    // console.log('删除了图中的所有节点和关系');
    
  } catch (error) {
    console.error('删除节点失败:', error);
    if (error.code === 'Neo.ClientError.Schema.ConstraintViolation') {
      console.log('提示: 可能是因为该节点有入站或出站关系，使用 DETACH DELETE 可以同时删除节点和关系');
    }
  } finally {
    if (session) {
      await session.close();
    }
  }
}
```

## 4. 关系操作

### 4.1 创建关系（CREATE）

```javascript
async function createRelationships() {
  let session;
  try {
    session = driver.session();
    
    // 创建人员与公司之间的关系
    await session.run(
      `MATCH (p:Person {name: $personName}), (c:Company {name: $companyName})
       CREATE (p)-[:WORKS_FOR {position: $position, since: $since}]->(c)
       RETURN p.name, c.name, type(p->c) as relationship`,
      { 
        personName: '张三', 
        companyName: '科技公司',
        position: '软件工程师',
        since: 2020
      }
    );
    console.log('创建了张三与科技公司之间的 WORKS_FOR 关系');
    
    // 创建人员之间的关系
    await session.run(
      `MATCH (p1:Person {name: $person1Name}), (p2:Person {name: $person2Name})
       CREATE (p1)-[:KNOWS {since: $since, strength: $strength}]->(p2)
       CREATE (p2)-[:KNOWS {since: $since, strength: $strength}]->(p1)
       RETURN p1.name, p2.name`,
      { 
        person1Name: '张三', 
        person2Name: '李四',
        since: 2018,
        strength: 5
      }
    );
    console.log('创建了张三和李四之间的双向 KNOWS 关系');
    
    // 创建多条关系
    const relationships = [
      { from: '李四', to: '王五', type: 'FOLLOWS', since: 2019 },
      { from: '王五', to: '张三', type: 'MENTOR', since: 2020 },
      { from: '张三', to: '赵六', type: 'FRIEND', since: 2015 }
    ];
    
    for (const rel of relationships) {
      await session.run(
        `MATCH (p1:Person {name: $from}), (p2:Person {name: $to})
         CREATE (p1)-[r:${rel.type} {since: $since}]->(p2)
         RETURN p1.name, type(r), p2.name`,
        { from: rel.from, to: rel.to, since: rel.since }
      );
    }
    console.log('创建了多条人员之间的关系');
    
  } catch (error) {
    console.error('创建关系失败:', error);
  } finally {
    if (session) {
      await session.close();
    }
  }
}
```

### 4.2 查询关系

```javascript
async function queryRelationships() {
  let session;
  try {
    session = driver.session();
    
    // 查询张三的所有关系
    const result1 = await session.run(
      `MATCH (p:Person {name: $name})-[r]-(n)
       RETURN p.name as from, type(r) as rel_type, properties(r) as rel_props, labels(n) as to_labels, n.name as to_name`,
      { name: '张三' }
    );
    
    console.log('张三的所有关系:');
    result1.records.forEach(record => {
      console.log(`${record.get('from')} -[${record.get('rel_type')} ${JSON.stringify(record.get('rel_props'))}]-> ${record.get('to_name')} (${record.get('to_labels').join(', ')})`);
    });
    
    // 查询特定类型的关系
    const result2 = await session.run(
      `MATCH (p:Person)-[r:WORKS_FOR]->(c:Company)
       RETURN p.name as employee, r.position as position, c.name as company`,
      {}
    );
    
    console.log('所有在公司工作的人员:');
    result2.records.forEach(record => {
      console.log(`${record.get('employee')} 在 ${record.get('company')} 担任 ${record.get('position')}`);
    });
    
    // 查询带条件的关系
    const result3 = await session.run(
      `MATCH (p1:Person)-[r:KNOWS]->(p2:Person)
       WHERE r.since > $year
       RETURN p1.name, p2.name, r.since`,
      { year: 2017 }
    );
    
    console.log('2017年后认识的人:');
    result3.records.forEach(record => {
      console.log(`${record.get('p1.name')} 在 ${record.get('r.since')} 年认识了 ${record.get('p2.name')}`);
    });
    
  } catch (error) {
    console.error('查询关系失败:', error);
  } finally {
    if (session) {
      await session.close();
    }
  }
}
```

### 4.3 更新关系

```javascript
async function updateRelationships() {
  let session;
  try {
    session = driver.session();
    
    // 更新关系属性
    await session.run(
      `MATCH (p:Person {name: $employeeName})-[r:WORKS_FOR]->(c:Company {name: $companyName})
       SET r.position = $newPosition, r.salary = $salary, r.updated_at = datetime()
       RETURN r`,
      { 
        employeeName: '张三', 
        companyName: '科技公司',
        newPosition: '高级软件工程师',
        salary: 15000
      }
    );
    console.log('更新了张三的工作关系信息');
    
    // 添加关系属性
    await session.run(
      `MATCH (p1:Person)-[r:KNOWS]->(p2:Person)
       SET r.frequency = $frequency
       RETURN count(r) as updatedRelationships`,
      { frequency: 'monthly' }
    );
    console.log('为所有 KNOWS 关系添加了频率属性');
    
    // 修改关系类型（通过创建新关系并删除旧关系）
    await session.run(
      `MATCH (p1:Person {name: $person1Name})-[r:KNOWS]->(p2:Person {name: $person2Name})
       CREATE (p1)-[:BEST_FRIEND {since: r.since, note: '升级为好友'}]->(p2)
       DELETE r
       RETURN p1.name, p2.name`,
      { person1Name: '张三', person2Name: '李四' }
    );
    console.log('将张三和李四的关系从 KNOWS 升级为 BEST_FRIEND');
    
  } catch (error) {
    console.error('更新关系失败:', error);
  } finally {
    if (session) {
      await session.close();
    }
  }
}
```

### 4.4 删除关系

```javascript
async function deleteRelationships() {
  let session;
  try {
    session = driver.session();
    
    // 删除特定关系
    await session.run(
      `MATCH (p1:Person {name: $person1Name})-[r:BEST_FRIEND]->(p2:Person {name: $person2Name})
       DELETE r
       RETURN '关系已删除' as message`,
      { person1Name: '张三', person2Name: '李四' }
    );
    console.log('删除了张三和李四之间的 BEST_FRIEND 关系');
    
    // 删除所有特定类型的关系
    const result = await session.run(
      `MATCH ()-[r:WORKS_FOR]->()
       DELETE r
       RETURN count(r) as deletedCount`
    );
    const deletedCount = result.records[0].get('deletedCount').toNumber();
    console.log(`删除了 ${deletedCount} 个 WORKS_FOR 关系`);
    
    // 删除节点的所有出站关系
    await session.run(
      `MATCH (p:Person {name: $name})-[r]->()
       DELETE r
       RETURN count(r) as deletedCount`,
      { name: '王五' }
    );
    console.log('删除了王五的所有出站关系');
    
  } catch (error) {
    console.error('删除关系失败:', error);
  } finally {
    if (session) {
      await session.close();
    }
  }
}
```

## 5. 高级查询技巧

### 5.1 路径查询

```javascript
async function pathQueries() {
  let session;
  try {
    session = driver.session();
    
    // 查询简单路径（无重复节点）
    const result1 = await session.run(
      `MATCH path = (p1:Person {name: $startName})-[*1..3]-(p2:Person {name: $endName})
       WHERE all(node in nodes(path) WHERE 1=1) // 可选条件
       RETURN path, length(path) as pathLength
       ORDER BY pathLength
       LIMIT 5`,
      { startName: '张三', endName: '王五' }
    );
    
    console.log('找到的路径数量:', result1.records.length);
    result1.records.forEach((record, index) => {
      const path = record.get('path');
      const length = record.get('pathLength').toNumber();
      console.log(`路径 ${index + 1} (长度: ${length}):`);
      
      // 简化的路径输出
      const pathDescription = path.segments.map(segment => {
        const start = segment.start.properties.name;
        const end = segment.end.properties.name;
        const relType = segment.relationship.type;
        return `${start} -[${relType}]-> ${end}`;
      }).join(' ');
      console.log(pathDescription);
    });
    
    // 查询最短路径
    const result2 = await session.run(
      `MATCH path = shortestPath((p1:Person {name: $startName})-[*]-(p2:Person {name: $endName}))
       RETURN path, length(path) as distance`,
      { startName: '张三', endName: '赵六' }
    );
    
    if (result2.records.length > 0) {
      const path = result2.records[0].get('path');
      const distance = result2.records[0].get('distance').toNumber();
      console.log(`最短路径长度: ${distance}`);
      // 简化输出路径
    }
    
    // 查询所有最短路径
    const result3 = await session.run(
      `MATCH path = allShortestPaths((p1:Person {name: $startName})-[*]-(p2:Person {name: $endName}))
       RETURN path, length(path) as distance`,
      { startName: '张三', endName: '王五' }
    );
    
    console.log(`所有最短路径数量: ${result3.records.length}`);
    
  } catch (error) {
    console.error('路径查询失败:', error);
  } finally {
    if (session) {
      await session.close();
    }
  }
}
```

### 5.2 聚合查询

```javascript
async function aggregationQueries() {
  let session;
  try {
    session = driver.session();
    
    // 基本聚合函数
    const result1 = await session.run(
      `MATCH (p:Person)
       RETURN 
         count(p) as totalPeople,
         avg(p.age) as avgAge,
         min(p.age) as minAge,
         max(p.age) as maxAge`
    );
    
    const stats = result1.records[0];
    console.log('人员统计信息:');
    console.log(`总数: ${stats.get('totalPeople').toNumber()}`);
    console.log(`平均年龄: ${stats.get('avgAge').toNumber()}`);
    console.log(`最小年龄: ${stats.get('minAge').toNumber()}`);
    console.log(`最大年龄: ${stats.get('maxAge').toNumber()}`);
    
    // 分组聚合
    const result2 = await session.run(
      `MATCH (p:Person)-[:WORKS_FOR]->(c:Company)
       RETURN c.name as company, count(p) as employeeCount, avg(p.age) as avgAge
       ORDER BY employeeCount DESC`
    );
    
    console.log('各公司员工统计:');
    result2.records.forEach(record => {
      console.log(`${record.get('company')}: ${record.get('employeeCount').toNumber()} 名员工, 平均年龄 ${record.get('avgAge').toNumber()}`);
    });
    
    // 集合操作
    const result3 = await session.run(
      `MATCH (p:Person)
       RETURN collect(p.name) as allNames, collect(distinct p.age) as uniqueAges`
    );
    
    const collections = result3.records[0];
    console.log('所有人员姓名:', collections.get('allNames'));
    console.log('所有唯一年龄:', collections.get('uniqueAges'));
    
  } catch (error) {
    console.error('聚合查询失败:', error);
  } finally {
    if (session) {
      await session.close();
    }
  }
}
```

### 5.3 使用索引和约束

```javascript
async function indexesAndConstraints() {
  let session;
  try {
    session = driver.session();
    
    // 创建节点属性索引
    await session.run(
      'CREATE INDEX ON :Person(name)'
    );
    console.log('为Person节点的name属性创建了索引');
    
    // 创建复合索引
    await session.run(
      'CREATE INDEX ON :Person(age, email)'
    );
    console.log('为Person节点的age和email属性创建了复合索引');
    
    // 创建唯一约束
    await session.run(
      'CREATE CONSTRAINT ON (p:Person) ASSERT p.email IS UNIQUE'
    );
    console.log('为Person节点的email属性创建了唯一约束');
    
    // 创建节点键约束（同时在多个属性上创建唯一约束）
    await session.run(
      'CREATE CONSTRAINT ON (c:Company) ASSERT (c.name, c.industry) IS NODE KEY'
    );
    console.log('为Company节点的name和industry属性组合创建了节点键约束');
    
    // 列出所有索引和约束
    const result = await session.run(
      'CALL db.schema.visualization()'
    );
    console.log('数据库模式可视化结果:', result.records[0].toObject());
    
    // 删除索引
    // await session.run('DROP INDEX ON :Person(name)');
    
    // 删除约束
    // await session.run('DROP CONSTRAINT ON (p:Person) ASSERT p.email IS UNIQUE');
    
  } catch (error) {
    console.error('创建索引或约束失败:', error);
  } finally {
    if (session) {
      await session.close();
    }
  }
}
```

### 5.4 子查询和UNION操作

```javascript
async function subqueriesAndUnion() {
  let session;
  try {
    session = driver.session();
    
    // 使用WITH进行链式查询
    const result1 = await session.run(
      `MATCH (p:Person)
       WITH p, size((p)-[:KNOWS]->()) as friendsCount
       WHERE friendsCount > 2
       RETURN p.name as popularPerson, friendsCount
       ORDER BY friendsCount DESC`
    );
    
    console.log('朋友数量超过2的人员:');
    result1.records.forEach(record => {
      console.log(`${record.get('popularPerson')}: ${record.get('friendsCount').toNumber()} 个朋友`);
    });
    
    // 使用UNION合并结果
    const result2 = await session.run(
      `MATCH (p:Person {name: '张三'})-[r]->(n)
       RETURN type(r) as relationshipType, n.name as connectedNode
       UNION
       MATCH (p:Person {name: '李四'})-[r]->(n)
       RETURN type(r) as relationshipType, n.name as connectedNode`
    );
    
    console.log('张三和李四的所有关系:');
    result2.records.forEach(record => {
      console.log(`${record.get('relationshipType')} -> ${record.get('connectedNode')}`);
    });
    
    // 使用UNION ALL保留重复项
    const result3 = await session.run(
      `MATCH (p:Person {name: '张三'})-[r]->(n)
       RETURN type(r) as relationshipType, n.name as connectedNode
       UNION ALL
       MATCH (n)<-[r]-(p:Person {name: '李四'})
       RETURN type(r) as relationshipType, n.name as connectedNode`
    );
    
    console.log('张三的出站关系和李四的入站关系（可能包含重复）:');
    result3.records.forEach(record => {
      console.log(`${record.get('relationshipType')} -> ${record.get('connectedNode')}`);
    });
    
  } catch (error) {
    console.error('执行子查询或UNION操作失败:', error);
  } finally {
    if (session) {
      await session.close();
    }
  }
}
```

## 6. 图算法应用

### 6.1 路径查找算法

```javascript
async function pathFindingAlgorithms() {
  let session;
  try {
    session = driver.session();
    
    // 查找两个节点之间的所有简单路径
    const result1 = await session.run(
      `MATCH path = (start:Person {name: $startName})-[*1..4]-(end:Person {name: $endName})
       WHERE all(node in nodes(path) WHERE single(n in nodes(path) WHERE n = node))
       RETURN path, length(path) as pathLength
       ORDER BY pathLength`,
      { startName: '张三', endName: '赵六' }
    );
    
    console.log(`找到 ${result1.records.length} 条路径`);
    
    // 使用Dijkstra算法查找最短路径（带权重）
    const result2 = await session.run(
      `MATCH (start:Person {name: $startName}), (end:Person {name: $endName})
       CALL gds.shortestPath.dijkstra.stream('myGraph', {
         sourceNode: id(start),
         targetNode: id(end),
         relationshipWeightProperty: 'weight'
       })
       YIELD path, totalCost
       RETURN path, totalCost`,
      { startName: '张三', endName: '王五' }
    );
    
    if (result2.records.length > 0) {
      const record = result2.records[0];
      console.log(`最短路径成本: ${record.get('totalCost')}`);
    }
    
  } catch (error) {
    console.error('路径查找算法失败:', error);
  } finally {
    if (session) {
      await session.close();
    }
  }
}
```

### 6.2 中心性算法

```javascript
async function centralityAlgorithms() {
  let session;
  try {
    session = driver.session();
    
    // 首先创建图投影
    await session.run(
      `CALL gds.graph.project(
        'myGraph',
        'Person',
        {KNOWS: {properties: 'strength'}},
        {nodeProperties: 'age'}
      )`
    );
    console.log('图投影创建成功');
    
    // 度中心性 - 计算每个节点的关系数量
    const result1 = await session.run(
      `CALL gds.degree.stream('myGraph')
       YIELD nodeId, score
       RETURN gds.util.asNode(nodeId).name as person, score as connectionCount
       ORDER BY score DESC`
    );
    
    console.log('度中心性（连接数）排名:');
    result1.records.forEach(record => {
      console.log(`${record.get('person')}: ${record.get('score').toNumber()} 个连接`);
    });
    
    // 页面排名 - 识别重要节点
    const result2 = await session.run(
      `CALL gds.pageRank.stream('myGraph')
       YIELD nodeId, score
       RETURN gds.util.asNode(nodeId).name as person, score as pageRank
       ORDER BY score DESC`
    );
    
    console.log('页面排名（影响力）:');
    result2.records.forEach(record => {
      console.log(`${record.get('person')}: 得分 ${record.get('score')}`);
    });
    
    // 关闭图投影
    await session.run('CALL gds.graph.drop("myGraph")');
    console.log('图投影已删除');
    
  } catch (error) {
    console.error('中心性算法失败:', error);
  } finally {
    if (session) {
      await session.close();
    }
  }
}
```

### 6.3 社区检测算法

```javascript
async function communityDetectionAlgorithms() {
  let session;
  try {
    session = driver.session();
    
    // 创建图投影
    await session.run(
      `CALL gds.graph.project(
        'communityGraph',
        'Person',
        ['KNOWS', 'FRIEND', 'WORKS_FOR']
      )`
    );
    
    // Louvain 社区检测算法
    const result1 = await session.run(
      `CALL gds.louvain.stream('communityGraph')
       YIELD nodeId, communityId
       RETURN communityId, collect(gds.util.asNode(nodeId).name) as communityMembers
       ORDER BY communityId`
    );
    
    console.log('Louvain 社区检测结果:');
    result1.records.forEach(record => {
      console.log(`社区 ${record.get('communityId').toNumber()}: ${record.get('communityMembers')}`);
    });
    
    // 弱连通分量算法
    const result2 = await session.run(
      `CALL gds.wcc.stream('communityGraph')
       YIELD nodeId, componentId
       RETURN componentId, collect(gds.util.asNode(nodeId).name) as componentMembers
       ORDER BY componentId`
    );
    
    console.log('弱连通分量结果:');
    result2.records.forEach(record => {
      console.log(`分量 ${record.get('componentId').toNumber()}: ${record.get('componentMembers')}`);
    });
    
    // 删除图投影
    await session.run('CALL gds.graph.drop("communityGraph")');
    
  } catch (error) {
    console.error('社区检测算法失败:', error);
  } finally {
    if (session) {
      await session.close();
    }
  }
}
```

## 7. 性能优化

### 7.1 查询性能优化

```javascript
async function optimizeQueries() {
  let session;
  try {
    session = driver.session();
    
    // 1. 使用 EXPLAIN 分析查询计划
    const explainResult = await session.run(
      `EXPLAIN MATCH (p:Person)
       WHERE p.age > $age
       RETURN p.name, p.email`,
      { age: 30 }
    );
    
    console.log('查询计划:');
    console.log(explainResult.summary.queryPlan);
    
    // 2. 使用 PROFILE 分析查询执行情况
    const profileResult = await session.run(
      `PROFILE MATCH (p:Person)-[:KNOWS]->(friend:Person)
       RETURN p.name, count(friend) as friendCount
       ORDER BY friendCount DESC`,
      {}
    );
    
    console.log('查询执行统计:');
    console.log(profileResult.summary.profile);
    
    // 3. 确保使用索引
    const indexedQuery = await session.run(
      `EXPLAIN MATCH (p:Person {name: $name})
       RETURN p`,
      { name: '张三' }
    );
    
    console.log('索引使用情况:');
    console.log(indexedQuery.summary.queryPlan);
    
  } catch (error) {
    console.error('优化查询失败:', error);
  } finally {
    if (session) {
      await session.close();
    }
  }
}

// 查询优化最佳实践
function queryBestPractices() {
  console.log('查询优化最佳实践:');
  console.log('1. 总是为常用查询的属性创建索引');
  console.log('2. 限制结果集大小，使用 LIMIT 子句');
  console.log('3. 避免深度未知的路径查询 (如 [*])');
  console.log('4. 使用参数化查询防止注入攻击并提高性能');
  console.log('5. 避免在大型图上使用 ALL 或 ANY 谓词');
  console.log('6. 适当使用图算法而非 Cypher 手动实现');
  console.log('7. 监控查询性能，使用 EXPLAIN 和 PROFILE');
  console.log('8. 避免返回整个图或大量节点');
  console.log('9. 使用合适的事务隔离级别');
  console.log('10. 定期检查和优化图结构');
}
```

### 7.2 索引优化

```javascript
async function optimizeIndexes() {
  let session;
  try {
    session = driver.session();
    
    // 列出所有索引
    const indexesResult = await session.run(
      'SHOW INDEXES'
    );
    
    console.log('当前索引:');
    indexesResult.records.forEach(record => {
      console.log(`${record.get('name')}: ${record.get('labelsOrTypes')}(${record.get('properties')})`);
    });
    
    // 检查索引使用情况
    // 注意: 这需要企业版功能或监控工具
    
    // 根据查询模式创建合适的索引
    console.log('建议根据实际查询模式创建索引:');
    console.log('- 为常用过滤条件的属性创建索引');
    console.log('- 为 ORDER BY 子句中的属性创建索引');
    console.log('- 考虑复合索引以匹配多属性查询模式');
    console.log('- 避免为高基数属性创建过多索引');
    
  } catch (error) {
    console.error('优化索引失败:', error);
  } finally {
    if (session) {
      await session.close();
    }
  }
}
```

### 7.3 连接池和会话管理

```javascript
// 优化的连接池配置
function optimizedDriverConfiguration() {
  const optimizedDriver = neo4j.driver(
    'neo4j://localhost:7687',
    neo4j.auth.basic('neo4j', 'password'),
    {
      // 连接池配置
      maxConnectionPoolSize: 100,           // 最大连接池大小
      connectionAcquisitionTimeout: 60000,  // 获取连接的超时时间（毫秒）
      maxConnectionLifetime: 3600000,       // 连接的最大生命周期（毫秒）
      connectionTimeout: 30000,             // 建立新连接的超时时间（毫秒）
      
      // 会话配置
      fetchSize: 1000,                      // 批处理获取的记录数
      
      // 连接设置
      encrypted: false,                     // 生产环境应设置为 true
      trust: 'TRUST_SYSTEM_CA_SIGNED_CERTIFICATES',
      
      // 日志配置
      logging: {
        level: 'warning',                   // 只记录警告和错误
        logger: (level, message) => {
          // 生产环境中使用专业日志工具
          if (level === 'error' || level === 'warning') {
            console[level](`Neo4j Driver: ${message}`);
          }
        }
      },
      
      // 重试策略
      maxTransactionRetryTime: 30000,       // 事务最大重试时间
    }
  );
  
  return optimizedDriver;
}

// 会话管理最佳实践
class Neo4jSessionManager {
  constructor(driver) {
    this.driver = driver;
  }
  
  // 执行读操作
  async readTransaction(transactionWork) {
    const session = this.driver.session({
      defaultAccessMode: neo4j.session.READ,
      database: 'neo4j' // 指定数据库
    });
    
    try {
      return await session.readTransaction(tx => transactionWork(tx));
    } catch (error) {
      console.error('读事务执行失败:', error);
      throw error;
    } finally {
      await session.close();
    }
  }
  
  // 执行写操作
  async writeTransaction(transactionWork) {
    const session = this.driver.session({
      defaultAccessMode: neo4j.session.WRITE,
      database: 'neo4j'
    });
    
    try {
      return await session.writeTransaction(tx => transactionWork(tx));
    } catch (error) {
      console.error('写事务执行失败:', error);
      throw error;
    } finally {
      await session.close();
    }
  }
  
  // 执行单个查询（非事务）
  async executeQuery(query, params = {}, mode = neo4j.session.READ) {
    const session = this.driver.session({
      defaultAccessMode: mode,
      database: 'neo4j'
    });
    
    try {
      return await session.run(query, params);
    } catch (error) {
      console.error('查询执行失败:', error);
      throw error;
    } finally {
      await session.close();
    }
  }
  
  // 关闭所有资源
  async close() {
    await this.driver.close();
  }
}

// 使用示例
async function sessionManagerExample() {
  const driver = optimizedDriverConfiguration();
  const sessionManager = new Neo4jSessionManager(driver);
  
  try {
    // 使用读事务
    const users = await sessionManager.readTransaction(async tx => {
      const result = await tx.run('MATCH (p:Person) RETURN p.name LIMIT 5');
      return result.records.map(record => record.get('p.name'));
    });
    console.log('读取的用户:', users);
    
    // 使用写事务
    await sessionManager.writeTransaction(async tx => {
      await tx.run(
        'CREATE (p:Person {name: $name, created_at: datetime()})',
        { name: '新用户' }
      );
    });
    console.log('创建新用户成功');
    
  } finally {
    await sessionManager.close();
  }
}
```

## 8. 监控与错误处理

### 8.1 监控查询性能

```javascript
async function monitorPerformance() {
  let session;
  try {
    session = driver.session();
    
    // 获取查询统计信息
    const result = await session.run(
      `CALL dbms.listQueries()`
    );
    
    console.log('当前运行的查询:');
    result.records.forEach(record => {
      console.log(`查询ID: ${record.get('queryId')}`);
      console.log(`查询: ${record.get('query')}`);
      console.log(`状态: ${record.get('status')}`);
      console.log(`持续时间: ${record.get('elapsedTime')}ms`);
      console.log('---');
    });
    
    // 检查数据库状态
    const dbStats = await session.run(
      `CALL dbms.queryJmx('org.neo4j:instance=kernel#0,name=StorefileSizes')`
    );
    
    console.log('数据库存储大小:');
    dbStats.records.forEach(record => {
      const attributes = record.get('attributes');
      attributes.forEach(attr => {
        if (attr.name.includes('Size')) {
          console.log(`${attr.name}: ${(attr.value / (1024 * 1024)).toFixed(2)} MB`);
        }
      });
    });
    
  } catch (error) {
    console.error('性能监控失败:', error);
  } finally {
    if (session) {
      await session.close();
    }
  }
}
```

### 8.2 错误处理与重试策略

```javascript
// 统一错误处理
class Neo4jErrorHandler {
  static handleError(error) {
    // 分类处理不同类型的错误
    if (error.code === 'Neo.ClientError.Database.DatabaseNotFound') {
      console.error('数据库不存在:', error.message);
      return { retryable: false, action: 'create_database' };
    } else if (error.code === 'Neo.ClientError.Schema.ConstraintViolation') {
      console.error('违反唯一约束:', error.message);
      return { retryable: false, action: 'check_duplicate' };
    } else if (error.code === 'Neo.TransientError.Transaction.TransactionRetriableError') {
      console.error('事务重试错误:', error.message);
      return { retryable: true, action: 'retry' };
    } else if (error.code === 'Neo.TransientError.Database.DatabaseUnavailable') {
      console.error('数据库暂时不可用:', error.message);
      return { retryable: true, action: 'wait_and_retry' };
    } else if (error.code === 'Neo.ClientError.Statement.SyntaxError') {
      console.error('Cypher 语法错误:', error.message);
      return { retryable: false, action: 'fix_query' };
    } else {
      console.error('未分类的 Neo4j 错误:', error);
      // 判断是否是网络或连接错误
      const isConnectionError = error.message.includes('Connection refused') || 
                               error.message.includes('timed out');
      return { retryable: isConnectionError, action: 'check_connection' };
    }
  }
}

// 重试机制实现
async function executeWithRetry(query, params, options = {}, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await driver.session().run(query, params, options);
    } catch (error) {
      lastError = error;
      const errorInfo = Neo4jErrorHandler.handleError(error);
      
      if (errorInfo.retryable) {
        // 指数退避策略
        const backoffTime = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
        console.log(`查询失败，${attempt + 1}/${maxRetries}次重试，等待 ${backoffTime.toFixed(0)}ms...`);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
      } else {
        // 不可重试的错误，直接抛出
        throw error;
      }
    }
  }
  
  // 超过最大重试次数，抛出最后一个错误
  throw lastError;
}

// 事务重试示例
async function transactionWithRetry() {
  let session;
  const maxRetries = 3;
  let attempt = 0;
  
  while (attempt < maxRetries) {
    session = driver.session({
      defaultAccessMode: neo4j.session.WRITE
    });
    
    try {
      await session.writeTransaction(async tx => {
        // 执行一系列写操作
        await tx.run(
          'MATCH (p:Person {name: $name}) SET p.updated_at = datetime()',
          { name: '张三' }
        );
        await tx.run(
          'MATCH (p:Person {name: $name}) CREATE (p)-[:UPDATED]->(:Event {time: datetime()})',
          { name: '张三' }
        );
      });
      
      console.log('事务执行成功');
      break; // 成功完成，退出循环
    } catch (error) {
      attempt++;
      const errorInfo = Neo4jErrorHandler.handleError(error);
      
      if (errorInfo.retryable && attempt < maxRetries) {
        console.log(`事务失败，${attempt}/${maxRetries}次重试...`);
        // 指数退避
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      } else {
        console.error('事务执行失败且无法重试:', error);
        throw error;
      }
    } finally {
      await session.close();
    }
  }
}
```

## 9. 安全最佳实践

### 9.1 认证和授权

```javascript
// 安全连接配置
function secureConnection() {
  const driver = neo4j.driver(
    'neo4j+s://your-neo4j-instance.databases.neo4j.io', // 使用加密连接 URL
    neo4j.auth.basic(
      process.env.NEO4J_USERNAME,  // 从环境变量读取凭据
      process.env.NEO4J_PASSWORD
    ),
    {
      encrypted: true,
      trust: 'TRUST_SYSTEM_CA_SIGNED_CERTIFICATES',
      // 使用更安全的 TLS 选项
      tls: {
        versions: ['TLSv1.3', 'TLSv1.2']
      }
    }
  );
  
  return driver;
}

// 角色和权限管理
async function manageSecurity() {
  let session;
  try {
    session = driver.session();
    
    // 创建用户并分配角色（需要管理员权限）
    await session.run(
      'CREATE USER app_user SET PASSWORD $password CHANGE NOT REQUIRED',
      { password: process.env.APP_USER_PASSWORD }
    );
    
    // 分配读写角色
    await session.run(
      'GRANT ROLE reader TO app_user'
    );
    
    // 为特定数据库分配权限
    await session.run(
      'GRANT MATCH {*} ON GRAPH neo4j NODES Person TO app_user'
    );
    
    // 撤销权限
    // await session.run('REVOKE MATCH {*} ON GRAPH neo4j NODES Person FROM app_user');
    
    // 列出用户角色
    const result = await session.run(
      'SHOW ROLES FOR app_user'
    );
    
    console.log('用户角色:', result.records);
    
  } catch (error) {
    console.error('安全管理操作失败:', error);
  } finally {
    if (session) {
      await session.close();
    }
  }
}
```

### 9.2 数据加密和注入防护

```javascript
// 敏感数据加密
const crypto = require('crypto');

class DataEncryptor {
  constructor(secretKey, algorithm = 'aes-256-cbc') {
    this.secretKey = crypto.scryptSync(secretKey, 'salt', 32); // 32 bytes for AES-256
    this.algorithm = algorithm;
    this.ivLength = 16; // AES block size
  }
  
  encrypt(text) {
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipheriv(this.algorithm, this.secretKey, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }
  
  decrypt(text) {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(this.algorithm, this.secretKey, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
}

// 防SQL注入示例
async function preventInjection() {
  let session;
  try {
    session = driver.session();
    
    // 安全的参数化查询
    const unsafeInput = 'user\' OR 1=1 //'; // 模拟恶意输入
    
    // 不安全的方式（不要这样做）
    // const unsafeQuery = `MATCH (p:Person {name: '${unsafeInput}'}) RETURN p`;
    
    // 安全的参数化查询方式
    const safeQuery = 'MATCH (p:Person {name: $name}) RETURN p';
    
    // 创建加密器
    const encryptor = new DataEncryptor(process.env.ENCRYPTION_KEY);
    
    // 存储敏感数据
    const sensitiveData = encryptor.encrypt('信用卡号: 1234-5678-9012-3456');
    
    // 安全存储
    await session.run(
      'CREATE (s:SecureData {encrypted: $data, created_at: datetime()})',
      { data: sensitiveData }
    );
    
    // 安全读取并解密
    const result = await session.run(
      'MATCH (s:SecureData) RETURN s.encrypted as data'
    );
    
    if (result.records.length > 0) {
      const encryptedData = result.records[0].get('data');
      const decryptedData = encryptor.decrypt(encryptedData);
      console.log('解密后的数据:', decryptedData);
    }
    
  } catch (error) {
    console.error('安全操作失败:', error);
  } finally {
    if (session) {
      await session.close();
    }
  }
}
```

## 10. 常见问题与解决方案

### 10.1 连接问题

**问题**：无法连接到 Neo4j 服务器

**解决方案**：

```javascript
function troubleshootConnection() {
  console.log('连接问题排查步骤:');
  
  // 1. 检查连接字符串和凭据
  console.log('- 验证连接 URI 格式是否正确');
  console.log('- 确认用户名和密码是否正确');
  console.log('- 检查端口是否开放（默认 7687）');
  
  // 2. 检查网络连接
  console.log('- 验证服务器是否可访问（ping 测试）');
  console.log('- 检查防火墙设置是否允许连接');
  console.log('- 验证 TLS/SSL 配置是否正确');
  
  // 3. 服务器状态检查
  console.log('- 确认 Neo4j 服务是否正在运行');
  console.log('- 检查服务器日志文件中的错误');
  console.log('- 验证服务器是否配置为接受远程连接');
  
  // 4. 驱动配置检查
  const testDriver = neo4j.driver(
    'neo4j://localhost:7687',
    neo4j.auth.basic('neo4j', 'password'),
    {
      encrypted: false, // 测试时暂时禁用加密
      logging: {
        level: 'debug',
        logger: (level, message) => console.log(`${level}: ${message}`)
      },
      connectionTimeout: 5000 // 缩短超时时间以便快速反馈
    }
  );
  
  // 5. 测试连接函数
  async function testConnection() {
    try {
      const serverInfo = await testDriver.getServerInfo();
      console.log('连接成功! 服务器信息:', serverInfo);
      return true;
    } catch (error) {
      console.error('连接测试失败:', error);
      
      // 分析错误信息
      if (error.message.includes('Connection refused')) {
        console.log('可能的原因: Neo4j 服务未运行或端口不正确');
      } else if (error.message.includes('authentication')) {
        console.log('可能的原因: 用户名或密码错误');
      } else if (error.message.includes('SSL')) {
        console.log('可能的原因: TLS/SSL 配置问题');
      }
      
      return false;
    } finally {
      await testDriver.close();
    }
  }
  
  return { testConnection };
}
```

### 10.2 性能问题

**问题**：查询执行缓慢

**解决方案**：

```javascript
function troubleshootPerformance() {
  console.log('性能问题排查:');
  
  console.log('1. 查询优化:');
  console.log('- 使用 EXPLAIN 和 PROFILE 分析查询计划');
  console.log('- 检查是否使用了适当的索引');
  console.log('- 避免使用无限制的路径查询');
  console.log('- 限制结果集大小');
  
  console.log('\n2. 索引优化:');
  console.log('- 为频繁查询的属性创建索引');
  console.log('- 避免创建过多不必要的索引');
  console.log('- 定期重建索引以提高性能');
  
  console.log('\n3. 硬件资源:');
  console.log('- 检查服务器 CPU 和内存使用情况');
  console.log('- 验证磁盘 I/O 性能');
  console.log('- 考虑增加服务器资源或使用企业版');
  
  console.log('\n4. 配置优化:');
  console.log('- 调整 JVM 堆内存设置');
  console.log('- 优化页面缓存大小');
  console.log('- 调整连接池配置');
  
  // 检查长运行查询
  async function checkLongRunningQueries() {
    let session;
    try {
      session = driver.session();
      
      const result = await session.run(
        `CALL dbms.listQueries()
         YIELD queryId, query, elapsedTime, state
         WHERE elapsedTime > 10000
         RETURN queryId, query, elapsedTime, state
         ORDER BY elapsedTime DESC`
      );
      
      if (result.records.length > 0) {
        console.log('长时间运行的查询:');
        result.records.forEach(record => {
          console.log(`查询ID: ${record.get('queryId')}`);
          console.log(`查询: ${record.get('query')}`);
          console.log(`运行时间: ${record.get('elapsedTime')}ms`);
          console.log(`状态: ${record.get('state')}`);
          console.log('---');
        });
      } else {
        console.log('没有发现长时间运行的查询');
      }
      
    } catch (error) {
      console.error('检查长查询失败:', error);
    } finally {
      if (session) {
        await session.close();
      }
    }
  }
  
  return { checkLongRunningQueries };
}
```

### 10.3 内存管理

**问题**：内存使用率过高或内存泄漏

**解决方案**：

```javascript
function memoryManagementTips() {
  console.log('Neo4j 内存管理建议:');
  
  console.log('1. 驱动程序内存管理:');
  console.log('- 总是正确关闭会话和事务');
  console.log('- 使用连接池限制最大连接数');
  console.log('- 避免在内存中存储大量查询结果');
  console.log('- 使用流式处理处理大型结果集');
  
  console.log('\n2. 查询内存优化:');
  console.log('- 避免返回整个图或大量节点');
  console.log('- 使用 LIMIT 和 SKIP 分页处理结果');
  console.log('- 减少路径查询的深度');
  console.log('- 使用投影只返回需要的属性');
  
  console.log('\n3. Node.js 内存管理:');
  console.log('- 使用适当的 Node.js 内存限制 (--max-old-space-size)');
  console.log('- 监控内存使用情况');
  console.log('- 使用异步操作避免阻塞主线程');
  console.log('- 定期执行垃圾回收（如果启用）');
  
  // 流式处理大型结果集示例
  async function streamLargeResults() {
    let session;
    try {
      session = driver.session({
        fetchSize: 1000 // 每次获取的记录数
      });
      
      const result = await session.run(
        'MATCH (n) RETURN n LIMIT 10000',
        {},
        { resultTransformer: neo4j.stream() }
      );
      
      let count = 0;
      
      result.subscribe({
        onNext: (record) => {
          // 处理单条记录
          const node = record.get('n');
          // 处理逻辑...
          count++;
          
          // 定期释放内存
          if (count % 5000 === 0) {
            console.log(`已处理 ${count} 条记录`);
            // 在 Node.js 中，强制垃圾回收需要 --expose-gc 标志
            // global.gc && global.gc();
          }
        },
        onCompleted: () => {
          console.log(`流式处理完成，共 ${count} 条记录`);
          session.close();
        },
        onError: (error) => {
          console.error('流式处理错误:', error);
          session.close();
        }
      });
      
    } catch (error) {
      console.error('流式处理失败:', error);
      if (session) {
        await session.close();
      }
    }
  }
  
  return { streamLargeResults };
}
```

## 11. 参考资源

- [Neo4j 官方文档](https://neo4j.com/docs/)
- [Neo4j JavaScript 驱动文档](https://neo4j.com/docs/javascript-manual/current/)
- [Cypher 查询语言参考](https://neo4j.com/docs/cypher-manual/current/)
- [Neo4j 图算法库](https://neo4j.com/docs/graph-data-science/current/)
- [Neo4j GitHub](https://github.com/neo4j)
- [Neo4j AuraDB](https://neo4j.com/cloud/aura-graph-database/)
- [Neo4j 开发者博客](https://neo4j.com/blog/)
- [Neo4j 社区](https://community.neo4j.com/)