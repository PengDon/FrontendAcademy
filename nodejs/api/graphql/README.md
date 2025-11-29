# GraphQL 基础

## 1. 什么是 GraphQL

GraphQL 是 Facebook 开发的一种查询语言，用于 API，同时也是一个满足你数据查询的运行时。GraphQL 对你的 API 中的数据提供了一套易于理解的完整描述，使得客户端能够准确地获得它需要的数据，而且没有任何冗余，也让 API 更容易随着时间推移而演进，还能用于构建强大的开发者工具。

## 2. GraphQL 核心概念

### 2.1 Schema

Schema 是 GraphQL API 的骨架，定义了 API 中可用的数据类型和操作。

```graphql
# 定义用户类型
type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
}

# 定义帖子类型
type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
  published: Boolean!
}

# 定义查询类型
type Query {
  users: [User!]!
  user(id: ID!): User
  posts: [Post!]!
  post(id: ID!): Post
}

# 定义变更类型
type Mutation {
  createUser(name: String!, email: String!): User!
  updateUser(id: ID!, name: String, email: String): User
  deleteUser(id: ID!): Boolean
  createPost(title: String!, content: String!, authorId: ID!): Post!
}
```

### 2.2 查询（Query）

查询用于从服务器获取数据，类似于 REST 中的 GET 请求，但更加灵活。

```graphql
query {
  user(id: "1") {
    id
    name
    email
    posts {
      id
      title
    }
  }
}
```

### 2.3 变更（Mutation）

变更用于修改服务器上的数据，类似于 REST 中的 POST、PUT、DELETE 请求。

```graphql
mutation {
  createUser(name: "张三", email: "zhangsan@example.com") {
    id
    name
    email
  }
}
```

### 2.4 订阅（Subscription）

订阅用于建立长连接，当服务器上的数据发生变化时，服务器会推送更新到客户端。

```graphql
type Subscription {
  postAdded: Post!
}
```

## 3. Node.js 中实现 GraphQL

### 3.1 使用 Apollo Server

Apollo Server 是一个功能强大的 GraphQL 服务器实现，可以与任何 Node.js HTTP 服务器集成。

#### 安装依赖

```bash
npm install apollo-server graphql
```

#### 基本实现

```javascript
const { ApolloServer, gql } = require('apollo-server');

// 模拟数据
const users = [
  { id: '1', name: '张三', email: 'zhangsan@example.com' },
  { id: '2', name: '李四', email: 'lisi@example.com' },
];

// 定义 Schema
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    createUser(name: String!, email: String!): User!
  }
`;

// 定义解析器
const resolvers = {
  Query: {
    users: () => users,
    user: (parent, args) => users.find(user => user.id === args.id),
  },
  Mutation: {
    createUser: (parent, args) => {
      const newUser = {
        id: String(users.length + 1),
        name: args.name,
        email: args.email,
      };
      users.push(newUser);
      return newUser;
    },
  },
};

// 创建服务器实例
const server = new ApolloServer({ typeDefs, resolvers });

// 启动服务器
server.listen().then(({ url }) => {
  console.log(`🚀 服务器运行在 ${url}`);
});
```

### 3.2 与 Express 集成

#### 安装依赖

```bash
npm install apollo-server-express express graphql
```

#### 实现代码

```javascript
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

// 定义 Schema 和解析器
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};

async function startServer() {
  const app = express();
  const server = new ApolloServer({ typeDefs, resolvers });
  
  await server.start();
  server.applyMiddleware({ app });
  
  app.listen({ port: 4000 }, () =>
    console.log(`🚀 服务器运行在 http://localhost:4000${server.graphqlPath}`)
  );
}

startServer();
```

## 4. 高级特性

### 4.1 片段（Fragments）

片段允许你定义可重用的字段集合。

```graphql
fragment UserInfo on User {
  id
  name
  email
}

query {
  user(id: "1") {
    ...UserInfo
    posts {
      id
      title
    }
  }
}
```

### 4.2 变量

变量允许你动态传递值到查询中。

```graphql
query GetUser($userId: ID!) {
  user(id: $userId) {
    id
    name
    email
  }
}
```

查询变量：

```json
{
  "userId": "1"
}
```

### 4.3 指令（Directives）

指令允许你动态地修改查询的结构和行为。

```graphql
query GetUser($showPosts: Boolean!) {
  user(id: "1") {
    id
    name
    email
    posts @include(if: $showPosts) {
      id
      title
    }
  }
}
```

### 4.4 接口和联合类型

接口定义了一组字段，对象类型可以实现这些字段。联合类型表示一个值可能是几种类型之一。

```graphql
interface SearchResult {
  id: ID!
  title: String!
}

type Book implements SearchResult {
  id: ID!
  title: String!
  author: String!
}

type Movie implements SearchResult {
  id: ID!
  title: String!
  director: String!
}

type Query {
  search(text: String!): [SearchResult!]!
}
```

## 5. 最佳实践

### 5.1 Schema 设计

- 保持 Schema 简洁明了
- 使用有意义的类型和字段名称
- 为每个类型和字段添加描述
- 使用非空类型（!）确保数据的完整性

### 5.2 性能优化

- 使用数据加载器（DataLoader）解决 N+1 查询问题
- 实现缓存策略
- 监控查询复杂度和深度
- 使用分页处理大型数据集

### 5.3 安全性

- 实现查询复杂度限制
- 对敏感操作进行认证和授权
- 验证输入数据
- 防止查询深度攻击

## 6. 与 RESTful API 比较

| 特性 | GraphQL | RESTful API |
|------|---------|-------------|
| 数据获取 | 一次请求获取所需数据 | 多次请求获取不同资源 |
| 版本控制 | 不需要版本号，Schema 演进 | 通常使用 URL 路径版本（v1/v2） |
| 错误处理 | 部分数据可能成功，部分失败 | 要么全部成功，要么全部失败 |
| 文档 | 内置于 Schema | 需要单独的文档工具（如 Swagger） |
| 缓存 | 较复杂，需要实现自定义缓存 | 浏览器自动缓存 GET 请求 |

## 7. 参考资源

- [GraphQL 官方文档](https://graphql.org/learn/)
- [Apollo Server 文档](https://www.apollographql.com/docs/apollo-server/)
- [GraphQL.js 文档](https://graphql.org/graphql-js/)