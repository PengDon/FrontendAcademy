# Elasticsearch 与 Node.js 集成指南

## 1. Elasticsearch 简介

### 1.1 基本概念

Elasticsearch 是一个开源的分布式搜索和分析引擎，基于 Lucene 构建。它提供了一个分布式多用户能力的全文搜索引擎，具有 RESTful Web 接口，能够快速存储、搜索和分析大量数据。

### 1.2 主要特点

- **分布式架构**：支持水平扩展，可以轻松扩展到数百台服务器
- **全文搜索**：基于 Lucene 的强大搜索功能，支持复杂查询
- **实时分析**：近实时数据索引和搜索能力
- **高可用性**：自动复制和故障转移
- **多文档类型支持**：支持结构化和非结构化数据
- **RESTful API**：使用 HTTP 请求进行操作
- **文档存储**：以 JSON 格式存储数据

### 1.3 应用场景

- **日志和事件数据分析**
- **全文检索**
- **安全分析**
- **业务分析**
- **实时应用监控**
- **推荐系统**
- **电子商务搜索**

## 2. 安装与配置

### 2.1 安装 Elasticsearch

Elasticsearch 可以通过多种方式安装，最简单的方法是从官网下载二进制文件。

#### 2.1.1 直接下载安装

```bash
# 下载 Elasticsearch
wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.17.0-linux-x86_64.tar.gz

# 解压
 tar -xzf elasticsearch-7.17.0-linux-x86_64.tar.gz

# 进入目录
 cd elasticsearch-7.17.0/

# 启动 Elasticsearch
 ./bin/elasticsearch
```

#### 2.1.2 使用 Docker 安装

```bash
docker run -d --name elasticsearch -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" elasticsearch:7.17.0
```

### 2.2 基本配置

Elasticsearch 的主要配置文件位于 `config/elasticsearch.yml`。以下是一些基本配置：

```yaml
# 集群名称
cluster.name: my-application

# 节点名称
node.name: node-1

# 数据路径
path.data: /path/to/data

# 日志路径
path.logs: /path/to/logs

# 网络设置
network.host: 0.0.0.0
http.port: 9200

# 初始主节点设置（集群模式）
discovery.seed_hosts: ["host1", "host2"]
cluster.initial_master_nodes: ["node-1", "node-2"]
```

### 2.3 验证安装

安装完成后，可以通过发送 HTTP 请求来验证 Elasticsearch 是否正常运行：

```bash
curl -X GET "localhost:9200/"
```

成功响应应该包含有关集群的基本信息：

```json
{
  "name" : "node-1",
  "cluster_name" : "my-application",
  "cluster_uuid" : "nMvXbXUqQjG7CwZv7v3dHg",
  "version" : {
    "number" : "7.17.0",
    "build_flavor" : "default",
    "build_type" : "tar",
    "build_hash" : "bee86328705acaa9a6daede7140defd4d9ec56bd",
    "build_date" : "2022-01-28T08:36:04.875279988Z",
    "build_snapshot" : false,
    "lucene_version" : "8.11.1",
    "minimum_wire_compatibility_version" : "6.8.0",
    "minimum_index_compatibility_version" : "6.0.0-beta1"
  },
  "tagline" : "You Know, for Search"
}
```

## 3. Node.js 集成

### 3.1 安装官方客户端

Elasticsearch 官方提供了 Node.js 客户端，使用 npm 安装：

```bash
npm install @elastic/elasticsearch
```

### 3.2 创建客户端连接

```javascript
// client.js
const { Client } = require('@elastic/elasticsearch');

// 创建客户端连接
const client = new Client({
  node: 'http://localhost:9200',
  auth: {
    username: 'elastic', // 默认用户名，生产环境应修改
    password: 'changeme' // 默认密码，生产环境必须修改
  },
  // 可选：配置 TLS/SSL
  ssl: {
    rejectUnauthorized: true
  },
  // 可选：配置连接池
  maxRetries: 3,
  requestTimeout: 30000,
  sniffOnStart: true,
});

// 验证连接
async function testConnection() {
  try {
    const response = await client.info();
    console.log('Connected to Elasticsearch:', response.meta.body.name);
    return true;
  } catch (error) {
    console.error('Error connecting to Elasticsearch:', error.meta.body.error);
    return false;
  }
}

module.exports = { client, testConnection };
```

### 3.3 异步连接管理

```javascript
// connection-manager.js
const { Client } = require('@elastic/elasticsearch');

class ElasticsearchConnectionManager {
  constructor() {
    this.client = null;
    this.isConnecting = false;
    this.retryCount = 0;
    this.maxRetries = 5;
    this.retryDelay = 2000; // 初始重试延迟 2 秒
  }

  async getClient() {
    if (this.client && this.client.connectionPool.connections.length > 0) {
      return this.client;
    }

    if (this.isConnecting) {
      // 如果已经有连接请求正在进行，等待它完成
      while (this.isConnecting) {
        await new Promise(resolve => setTimeout(resolve, 100));
        if (this.client && this.client.connectionPool.connections.length > 0) {
          return this.client;
        }
      }
    }

    this.isConnecting = true;
    try {
      this.client = await this.createConnection();
      return this.client;
    } finally {
      this.isConnecting = false;
    }
  }

  async createConnection() {
    try {
      const client = new Client({
        node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
        auth: {
          username: process.env.ELASTICSEARCH_USERNAME || 'elastic',
          password: process.env.ELASTICSEARCH_PASSWORD || 'changeme'
        },
        ssl: {
          rejectUnauthorized: process.env.NODE_ENV === 'production'
        },
        maxRetries: 3,
        requestTimeout: 30000,
        sniffOnStart: true,
      });

      // 验证连接
      await client.info();
      console.log('Successfully connected to Elasticsearch');
      this.retryCount = 0; // 重置重试计数
      return client;
    } catch (error) {
      this.retryCount++;
      console.error(`Connection attempt ${this.retryCount} failed:`, error.meta?.body?.error || error.message);
      
      if (this.retryCount >= this.maxRetries) {
        throw new Error(`Failed to connect to Elasticsearch after ${this.maxRetries} attempts`);
      }
      
      // 指数退避策略
      const waitTime = this.retryDelay * Math.pow(2, this.retryCount - 1);
      console.log(`Retrying in ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      
      return this.createConnection();
    }
  }

  async close() {
    if (this.client) {
      await this.client.close();
      this.client = null;
      console.log('Elasticsearch connection closed');
    }
  }
}

module.exports = new ElasticsearchConnectionManager();
```

## 4. 核心操作

### 4.1 索引操作

#### 4.1.1 创建索引

```javascript
// create-index.js
const { client } = require('./client');

async function createIndex(indexName) {
  try {
    const result = await client.indices.create({
      index: indexName,
      body: {
        settings: {
          number_of_shards: 1,  // 分片数，生产环境可增加
          number_of_replicas: 0 // 副本数，生产环境建议设置为 1 或更多
        },
        mappings: {
          properties: {
            title: {
              type: 'text',
              analyzer: 'standard'
            },
            content: {
              type: 'text',
              analyzer: 'standard'
            },
            author: {
              type: 'keyword'  // 不分析，用于精确匹配
            },
            tags: {
              type: 'keyword'
            },
            publishDate: {
              type: 'date'
            },
            views: {
              type: 'integer'
            }
          }
        }
      }
    });
    console.log(`Index ${indexName} created successfully`);
    return result;
  } catch (error) {
    console.error(`Error creating index:`, error.meta.body.error);
    throw error;
  }
}

// 使用示例
// createIndex('blog_posts');
```

#### 4.1.2 删除索引

```javascript
// delete-index.js
const { client } = require('./client');

async function deleteIndex(indexName) {
  try {
    const result = await client.indices.delete({
      index: indexName
    });
    console.log(`Index ${indexName} deleted successfully`);
    return result;
  } catch (error) {
    console.error(`Error deleting index:`, error.meta.body.error);
    throw error;
  }
}

// 使用示例
// deleteIndex('blog_posts');
```

#### 4.1.3 检查索引是否存在

```javascript
// check-index.js
const { client } = require('./client');

async function checkIndexExists(indexName) {
  try {
    const exists = await client.indices.exists({
      index: indexName
    });
    console.log(`Index ${indexName} exists:`, exists.body);
    return exists.body;
  } catch (error) {
    console.error(`Error checking index:`, error.meta.body.error);
    throw error;
  }
}

// 使用示例
// checkIndexExists('blog_posts');
```

### 4.2 文档操作

#### 4.2.1 创建文档

```javascript
// create-document.js
const { client } = require('./client');

async function createDocument(indexName, document, id = null) {
  try {
    const params = {
      index: indexName,
      body: document
    };
    
    // 如果提供了ID，则使用它
    if (id) {
      params.id = id;
    }
    
    const result = await client.index(params);
    console.log(`Document created with ID: ${result.body._id}`);
    return result;
  } catch (error) {
    console.error(`Error creating document:`, error.meta.body.error);
    throw error;
  }
}

// 使用示例
// const blogPost = {
//   title: 'Getting Started with Elasticsearch',
//   content: 'Elasticsearch is a distributed, RESTful search and analytics engine...',
//   author: 'John Doe',
//   tags: ['elasticsearch', 'search', 'nodejs'],
//   publishDate: new Date(),
//   views: 100
// };
// createDocument('blog_posts', blogPost);
```

#### 4.2.2 获取文档

```javascript
// get-document.js
const { client } = require('./client');

async function getDocument(indexName, id) {
  try {
    const result = await client.get({
      index: indexName,
      id: id
    });
    console.log(`Retrieved document:`, result.body._source);
    return result.body._source;
  } catch (error) {
    if (error.meta.statusCode === 404) {
      console.log(`Document with ID ${id} not found`);
      return null;
    }
    console.error(`Error retrieving document:`, error.meta.body.error);
    throw error;
  }
}

// 使用示例
// getDocument('blog_posts', '1');
```

#### 4.2.3 更新文档

```javascript
// update-document.js
const { client } = require('./client');

async function updateDocument(indexName, id, updateData) {
  try {
    const result = await client.update({
      index: indexName,
      id: id,
      body: {
        doc: updateData
      }
    });
    console.log(`Document ${id} updated successfully`);
    return result;
  } catch (error) {
    console.error(`Error updating document:`, error.meta.body.error);
    throw error;
  }
}

// 使用示例
// updateDocument('blog_posts', '1', { views: 150, tags: ['elasticsearch', 'search', 'nodejs', 'tutorial'] });
```

#### 4.2.4 删除文档

```javascript
// delete-document.js
const { client } = require('./client');

async function deleteDocument(indexName, id) {
  try {
    const result = await client.delete({
      index: indexName,
      id: id
    });
    console.log(`Document ${id} deleted successfully`);
    return result;
  } catch (error) {
    console.error(`Error deleting document:`, error.meta.body.error);
    throw error;
  }
}

// 使用示例
// deleteDocument('blog_posts', '1');
```

### 4.3 批量操作

```javascript
// bulk-operations.js
const { client } = require('./client');

async function bulkIndex(indexName, documents) {
  try {
    // 准备批量操作的请求体
    const body = documents.flatMap(doc => [
      { index: { _index: indexName } },
      doc
    ]);

    const result = await client.bulk({
      refresh: true, // 立即刷新以使文档可搜索
      body: body
    });

    if (result.body.errors) {
      const errors = result.body.items.filter(item => item.index.error);
      console.error('Bulk index errors:', errors);
      throw new Error('Some documents failed to index');
    }

    console.log(`Successfully indexed ${result.body.items.length} documents`);
    return result;
  } catch (error) {
    console.error(`Error in bulk operation:`, error.meta.body.error);
    throw error;
  }
}

// 使用示例
// const blogPosts = [
//   {
//     title: 'Elasticsearch Tutorial',
//     content: 'Introduction to Elasticsearch concepts...',
//     author: 'Jane Smith',
//     tags: ['elasticsearch', 'tutorial'],
//     publishDate: new Date(),
//     views: 50
//   },
//   {
//     title: 'Node.js Integration with Elasticsearch',
//     content: 'How to use Elasticsearch with Node.js applications...',
//     author: 'John Doe',
//     tags: ['nodejs', 'elasticsearch', 'integration'],
//     publishDate: new Date(),
//     views: 75
//   }
// ];
// bulkIndex('blog_posts', blogPosts);
```

## 5. 搜索操作

### 5.1 基本搜索

```javascript
// basic-search.js
const { client } = require('./client');

async function basicSearch(indexName, query) {
  try {
    const result = await client.search({
      index: indexName,
      q: query // 简单的查询字符串语法
    });
    
    console.log(`Found ${result.body.hits.total.value} documents`);
    console.log('Top hits:', result.body.hits.hits.map(hit => hit._source));
    
    return result.body.hits.hits;
  } catch (error) {
    console.error(`Error in search:`, error.meta.body.error);
    throw error;
  }
}

// 使用示例
// basicSearch('blog_posts', 'elasticsearch tutorial');
```

### 5.2 全文搜索

```javascript
// full-text-search.js
const { client } = require('./client');

async function fullTextSearch(indexName, searchText, fields = []) {
  try {
    const query = {
      bool: {
        must: [
          {
            multi_match: {
              query: searchText,
              fields: fields.length > 0 ? fields : ['title^3', 'content', 'tags'], // ^3 表示提升标题的权重
              type: 'best_fields',
              operator: 'and'
            }
          }
        ]
      }
    };

    const result = await client.search({
      index: indexName,
      body: {
        query: query,
        highlight: {
          fields: {
            title: {},
            content: {}
          }
        },
        size: 10
      }
    });

    console.log(`Found ${result.body.hits.total.value} documents matching: ${searchText}`);
    
    // 处理高亮结果
    const hitsWithHighlights = result.body.hits.hits.map(hit => ({
      ...hit,
      highlights: hit.highlight || {}
    }));
    
    return hitsWithHighlights;
  } catch (error) {
    console.error(`Error in full text search:`, error.meta.body.error);
    throw error;
  }
}

// 使用示例
// fullTextSearch('blog_posts', 'elasticsearch nodejs', ['title', 'content']);
```

### 5.3 过滤搜索

```javascript
// filtered-search.js
const { client } = require('./client');

async function filteredSearch(indexName, filters, searchText = '') {
  try {
    const query = {
      bool: {
        filter: []
      }
    };

    // 添加文本搜索条件（如果有）
    if (searchText) {
      query.bool.must = [
        {
          multi_match: {
            query: searchText,
            fields: ['title', 'content']
          }
        }
      ];
    }

    // 添加过滤器
    if (filters.author) {
      query.bool.filter.push({
        term: { author: filters.author }
      });
    }

    if (filters.minViews) {
      query.bool.filter.push({
        range: {
          views: { gte: filters.minViews }
        }
      });
    }

    if (filters.startDate) {
      query.bool.filter.push({
        range: {
          publishDate: { gte: filters.startDate }
        }
      });
    }

    if (filters.endDate) {
      query.bool.filter.push({
        range: {
          publishDate: { lte: filters.endDate }
        }
      });
    }

    if (filters.tags && filters.tags.length > 0) {
      query.bool.filter.push({
        terms: { tags: filters.tags }
      });
    }

    const result = await client.search({
      index: indexName,
      body: {
        query: query,
        sort: filters.sortBy ? [{ [filters.sortBy]: filters.sortOrder || 'desc' }] : undefined,
        size: filters.size || 10,
        from: filters.from || 0
      }
    });

    return {
      total: result.body.hits.total.value,
      documents: result.body.hits.hits.map(hit => hit._source),
      took: result.body.took
    };
  } catch (error) {
    console.error(`Error in filtered search:`, error.meta.body.error);
    throw error;
  }
}

// 使用示例
// filteredSearch('blog_posts', {
//   author: 'John Doe',
//   minViews: 50,
//   tags: ['elasticsearch', 'nodejs'],
//   sortBy: 'publishDate',
//   sortOrder: 'desc',
//   size: 5
// }, 'tutorial');
```

### 5.4 聚合搜索

```javascript
// aggregation-search.js
const { client } = require('./client');

async function aggregationSearch(indexName) {
  try {
    const result = await client.search({
      index: indexName,
      body: {
        size: 0, // 不返回文档，只返回聚合结果
        aggregations: {
          // 按作者分组计数
          authors_count: {
            terms: {
              field: 'author.keyword',
              size: 10
            }
          },
          // 按标签分组计数
          tags_count: {
            terms: {
              field: 'tags.keyword',
              size: 20
            }
          },
          // 计算平均浏览量
          avg_views: {
            avg: {
              field: 'views'
            }
          },
          // 浏览量统计
          views_stats: {
            stats: {
              field: 'views'
            }
          },
          // 按日期范围聚合
          posts_over_time: {
            date_histogram: {
              field: 'publishDate',
              calendar_interval: 'month'
            }
          }
        }
      }
    });

    const aggregations = result.body.aggregations;
    
    console.log('Authors count:', aggregations.authors_count.buckets);
    console.log('Tags count:', aggregations.tags_count.buckets);
    console.log('Average views:', aggregations.avg_views.value);
    console.log('Views stats:', aggregations.views_stats);
    console.log('Posts over time:', aggregations.posts_over_time.buckets);
    
    return aggregations;
  } catch (error) {
    console.error(`Error in aggregation search:`, error.meta.body.error);
    throw error;
  }
}

// 使用示例
// aggregationSearch('blog_posts');
```

## 6. 高级功能

### 6.1 文档分析器

```javascript
// analyzers.js
const { client } = require('./client');

async function testAnalyzer(text, analyzer = 'standard') {
  try {
    const result = await client.indices.analyze({
      body: {
        analyzer: analyzer,
        text: text
      }
    });
    
    const tokens = result.body.tokens.map(token => ({
      token: token.token,
      start_offset: token.start_offset,
      end_offset: token.end_offset,
      type: token.type,
      position: token.position
    }));
    
    console.log(`Analyzer "${analyzer}" produced tokens:`, tokens);
    return tokens;
  } catch (error) {
    console.error(`Error testing analyzer:`, error.meta.body.error);
    throw error;
  }
}

// 使用示例
// testAnalyzer('Elasticsearch is awesome!', 'standard');
// testAnalyzer('The quick brown fox jumps over the lazy dog', 'english');

async function createCustomAnalyzerIndex(indexName) {
  try {
    const result = await client.indices.create({
      index: indexName,
      body: {
        settings: {
          analysis: {
            analyzer: {
              custom_analyzer: {
                type: 'custom',
                tokenizer: 'standard',
                filter: ['lowercase', 'asciifolding', 'my_stemmer']
              }
            },
            filter: {
              my_stemmer: {
                type: 'stemmer',
                name: 'english'
              }
            }
          }
        },
        mappings: {
          properties: {
            title: {
              type: 'text',
              analyzer: 'custom_analyzer'
            },
            content: {
              type: 'text',
              analyzer: 'custom_analyzer'
            }
          }
        }
      }
    });
    
    console.log(`Index with custom analyzer created: ${indexName}`);
    return result;
  } catch (error) {
    console.error(`Error creating index with custom analyzer:`, error.meta.body.error);
    throw error;
  }
}

// 使用示例
// createCustomAnalyzerIndex('documents_with_custom_analyzer');
```

### 6.2 高级查询

```javascript
// advanced-queries.js
const { client } = require('./client');

async function advancedQuery(indexName) {
  try {
    const result = await client.search({
      index: indexName,
      body: {
        query: {
          bool: {
            must: [
              {
                match: {
                  content: 'elasticsearch'
                }
              }
            ],
            should: [
              {
                match: {
                  title: {
                    query: 'tutorial',
                    boost: 3
                  }
                }
              },
              {
                multi_match: {
                  query: 'advanced',
                  fields: ['title', 'content'],
                  boost: 2
                }
              }
            ],
            filter: [
              {
                range: {
                  publishDate: {
                    gte: '2022-01-01'
                  }
                }
              },
              {
                range: {
                  views: {
                    gte: 50
                  }
                }
              }
            ],
            must_not: [
              {
                term: {
                  tags: 'deprecated'
                }
              }
            ],
            minimum_should_match: 1 // 至少有一个should条件满足
          }
        },
        sort: [
          { views: { order: 'desc' } },
          { publishDate: { order: 'desc' } }
        ],
        size: 10,
        highlight: {
          pre_tags: ['<mark>'],
          post_tags: ['</mark>'],
          fields: {
            title: {},
            content: {
              fragment_size: 200,
              number_of_fragments: 3
            }
          }
        },
        suggest: {
          text: 'elastik search', // 拼写错误的查询
          term_suggestion: {
            term: {
              field: 'content'
            }
          },
          phrase_suggestion: {
            phrase: {
              field: 'content',
              confidence: 0.8
            }
          }
        }
      }
    });

    return {
      hits: result.body.hits.hits,
      suggestions: result.body.suggest
    };
  } catch (error) {
    console.error(`Error in advanced query:`, error.meta.body.error);
    throw error;
  }
}

// 使用示例
// advancedQuery('blog_posts');
```

### 6.3 高亮和自动完成

```javascript
// highlighting-autocomplete.js
const { client } = require('./client');

// 创建支持自动完成的索引
async function createAutocompleteIndex(indexName) {
  try {
    const result = await client.indices.create({
      index: indexName,
      body: {
        settings: {
          analysis: {
            analyzer: {
              autocomplete_analyzer: {
                tokenizer: 'autocomplete_tokenizer',
                filter: ['lowercase', 'asciifolding']
              },
              autocomplete_search_analyzer: {
                tokenizer: 'lowercase',
                filter: ['asciifolding']
              }
            },
            tokenizer: {
              autocomplete_tokenizer: {
                type: 'edge_ngram',
                min_gram: 2,
                max_gram: 10,
                token_chars: ['letter', 'digit']
              }
            }
          }
        },
        mappings: {
          properties: {
            title: {
              type: 'text',
              analyzer: 'autocomplete_analyzer',
              search_analyzer: 'autocomplete_search_analyzer'
            },
            content: {
              type: 'text'
            },
            suggestions: {
              type: 'completion',
              analyzer: 'standard',
              search_analyzer: 'standard',
              max_input_length: 50
            }
          }
        }
      }
    });
    
    console.log(`Autocomplete index created: ${indexName}`);
    return result;
  } catch (error) {
    console.error(`Error creating autocomplete index:`, error.meta.body.error);
    throw error;
  }
}

// 添加文档到自动完成索引
async function addAutocompleteDocument(indexName, document) {
  try {
    // 构建自动完成建议
    const suggestions = {
      input: [
        document.title,
        ...document.title.split(/\s+/).filter(word => word.length > 2)
      ],
      output: document.title,
      weight: document.weight || 1
    };

    const documentWithSuggestions = {
      ...document,
      suggestions: suggestions
    };

    const result = await client.index({
      index: indexName,
      body: documentWithSuggestions
    });
    
    console.log(`Document added to autocomplete index with ID: ${result.body._id}`);
    return result;
  } catch (error) {
    console.error(`Error adding document to autocomplete index:`, error.meta.body.error);
    throw error;
  }
}

// 执行自动完成查询
async function autocompleteQuery(indexName, query) {
  try {
    const result = await client.search({
      index: indexName,
      body: {
        suggest: {
          autocomplete_suggestion: {
            prefix: query,
            completion: {
              field: 'suggestions',
              skip_duplicates: true,
              size: 10
            }
          }
        }
      }
    });

    const suggestions = result.body.suggest.autocomplete_suggestion[0].options.map(option => option.text);
    console.log(`Autocomplete suggestions for "${query}":`, suggestions);
    return suggestions;
  } catch (error) {
    console.error(`Error in autocomplete query:`, error.meta.body.error);
    throw error;
  }
}

// 使用示例
// createAutocompleteIndex('autocomplete_index');
// addAutocompleteDocument('autocomplete_index', {
//   title: 'Elasticsearch Fundamentals',
//   content: 'Learn the basics of Elasticsearch',
//   weight: 10
// });
// autocompleteQuery('autocomplete_index', 'elas');
```

## 7. 性能优化

### 7.1 索引优化

```javascript
// index-optimization.js
const { client } = require('./client');

// 索引优化配置
async function optimizeIndexSettings(indexName) {
  try {
    const result = await client.indices.putSettings({
      index: indexName,
      body: {
        settings: {
          "index.number_of_replicas": 1,
          "index.refresh_interval": "30s", // 减少刷新频率以提高索引速度
          "index.translog.durability": "async", // 异步写入事务日志以提高写入性能
          "index.mapping.total_fields.limit": 2000, // 增加字段限制
          "index.max_result_window": 50000, // 增加分页窗口大小
          "index.queries.cache.size": "10%", // 查询缓存大小
          "index.fielddata.cache.size": "20%", // 字段数据缓存大小
          "index.memory.index_buffer_size": "30%" // 索引缓冲区大小
        }
      }
    });
    
    console.log(`Index ${indexName} settings optimized`);
    return result;
  } catch (error) {
    console.error(`Error optimizing index settings:`, error.meta.body.error);
    throw error;
  }
}

// 强制合并索引（类似于数据库压缩）
async function forceMergeIndex(indexName) {
  try {
    const result = await client.indices.forcemerge({
      index: indexName,
      max_num_segments: 1, // 合并为单个段
      flush: true // 强制刷新
    });
    
    console.log(`Index ${indexName} force merged`);
    return result;
  } catch (error) {
    console.error(`Error force merging index:`, error.meta.body.error);
    throw error;
  }
}

// 重建索引（用于优化或更改映射）
async function reindex(sourceIndex, targetIndex) {
  try {
    // 先确保目标索引存在
    const targetExists = await client.indices.exists({ index: targetIndex });
    
    if (!targetExists.body) {
      throw new Error(`Target index ${targetIndex} does not exist`);
    }
    
    const result = await client.reindex({
      body: {
        source: { index: sourceIndex },
        dest: { index: targetIndex }
      },
      wait_for_completion: false // 异步执行
    });
    
    console.log(`Reindex task started with ID: ${result.body.task}`);
    return result.body.task;
  } catch (error) {
    console.error(`Error starting reindex:`, error.meta.body.error);
    throw error;
  }
}

// 使用示例
// optimizeIndexSettings('blog_posts');
// forceMergeIndex('blog_posts');
// reindex('blog_posts', 'blog_posts_new');
```

### 7.2 查询优化

```javascript
// query-optimization.js

// 查询优化最佳实践
function queryOptimizationTips() {
  console.log('\nElasticsearch 查询优化最佳实践:');
  console.log('1. 使用过滤器而非查询（filter vs query）');
  console.log('   - 过滤器不计算相关性分数，结果可缓存');
  console.log('   - 查询计算相关性分数，通常更消耗资源');
  console.log('\n2. 避免使用脚本');
  console.log('   - 脚本通常较慢，尽量使用内置功能');
  console.log('   - 如需使用脚本，考虑使用 Painless 脚本并缓存结果');
  console.log('\n3. 控制返回字段');
  console.log('   - 使用 _source 过滤或 stored_fields 仅返回需要的字段');
  console.log('   - 避免加载和传输不必要的数据');
  console.log('\n4. 分页优化');
  console.log('   - 对深度分页使用 search_after 而非 from/size');
  console.log('   - 避免返回大量结果（设置合理的 size）');
  console.log('\n5. 使用合适的查询类型');
  console.log('   - 精确匹配使用 term/terms 查询');
  console.log('   - 全文搜索使用 match/multi_match');
  console.log('   - 范围查询使用 range');
  console.log('\n6. 优化聚合');
  console.log('   - 使用 approximate aggregations（如 cardinality）代替精确计数');
  console.log('   - 限制桶的数量（size 参数）');
  console.log('\n7. 缓存优化');
  console.log('   - 启用查询缓存和过滤器缓存');
  console.log('   - 对频繁使用的查询使用预计算的聚合');
}

// 优化的分页查询示例（使用 search_after）
async function optimizedPagination(client, indexName, sortField, pageSize, searchAfter = null) {
  try {
    const query = {
      bool: {
        filter: [
          // 添加你的过滤条件
        ]
      }
    };

    const result = await client.search({
      index: indexName,
      body: {
        query: query,
        sort: [
          { [sortField]: { order: 'desc' } },
          { _id: { order: 'desc' } } // 确保排序唯一性
        ],
        size: pageSize,
        search_after: searchAfter,
        track_total_hits: true // 计算总命中数
      }
    });

    const hits = result.body.hits.hits;
    const lastHit = hits.length > 0 ? hits[hits.length - 1] : null;
    const nextSearchAfter = lastHit ? lastHit.sort : null;
    
    return {
      documents: hits.map(hit => hit._source),
      totalHits: result.body.hits.total.value,
      hasMore: hits.length === pageSize,
      nextSearchAfter: nextSearchAfter
    };
  } catch (error) {
    console.error(`Error in optimized pagination:`, error.meta.body.error);
    throw error;
  }
}

// 使用示例
// queryOptimizationTips();
// optimizedPagination(client, 'blog_posts', 'publishDate', 10);
```

### 7.3 资源管理

```javascript
// resource-management.js
const { client } = require('./client');

// 监控集群健康
async function monitorClusterHealth() {
  try {
    const health = await client.cluster.health();
    console.log('Cluster health:', health.body);
    return health.body;
  } catch (error) {
    console.error(`Error monitoring cluster health:`, error.meta.body.error);
    throw error;
  }
}

// 监控节点统计
async function monitorNodeStats() {
  try {
    const stats = await client.nodes.stats();
    
    // 提取关键信息
    const nodeInfo = {};
    Object.values(stats.body.nodes).forEach(node => {
      nodeInfo[node.name] = {
        cpu: node.process.cpu.percent,
        memoryPercent: node.jvm.mem.heap_used_percent,
        memoryUsedMB: Math.round(node.jvm.mem.heap_used_in_bytes / (1024 * 1024)),
        memoryMaxMB: Math.round(node.jvm.mem.heap_max_in_bytes / (1024 * 1024)),
        threadCount: node.jvm.threads.count,
        openFileDescriptors: node.process.open_file_descriptors,
        indicesCount: node.indices.docs.count,
        indicesSizeMB: Math.round(node.indices.store.size_in_bytes / (1024 * 1024))
      };
    });
    
    console.log('Node stats:', nodeInfo);
    return nodeInfo;
  } catch (error) {
    console.error(`Error monitoring node stats:`, error.meta.body.error);
    throw error;
  }
}

// 设置资源限制和断路器
async function configureResourceLimits() {
  try {
    const result = await client.cluster.putSettings({
      persistent: {
        // JVM 堆内存使用限制
        "indices.breaker.total.limit": "70%",
        // 请求断路器限制
        "indices.breaker.request.limit": "40%",
        // 字段数据断路器限制
        "indices.breaker.fielddata.limit": "30%",
        // 索引断路器限制
        "indices.breaker.inflight_requests.limit": "20%",
        // 集群级别的线程池设置
        "thread_pool.search.size": 20,
        "thread_pool.search.queue_size": 1000,
        "thread_pool.write.size": 30,
        "thread_pool.write.queue_size": 500,
        // 批量请求处理
        "indices.memory.index_buffer_size": "30%"
      }
    });
    
    console.log('Resource limits configured:', result.body);
    return result.body;
  } catch (error) {
    console.error(`Error configuring resource limits:`, error.meta.body.error);
    throw error;
  }
}

// 使用示例
// monitorClusterHealth();
// monitorNodeStats();
// configureResourceLimits();
```

## 8. 安全最佳实践

### 8.1 认证与授权

```javascript
// security-auth.js
const { Client } = require('@elastic/elasticsearch');

// 创建带身份验证的客户端
function createAuthenticatedClient() {
  const client = new Client({
    node: 'https://elasticsearch.example.com:9200',
    auth: {
      username: process.env.ELASTICSEARCH_USERNAME,
      password: process.env.ELASTICSEARCH_PASSWORD
    },
    ssl: {
      rejectUnauthorized: true,
      ca: process.env.ELASTICSEARCH_CA_CERT ? [process.env.ELASTICSEARCH_CA_CERT] : undefined
    }
  });
  
  return client;
}

// 角色和用户管理（需要超级用户权限）
async function manageUsersAndRoles(client) {
  try {
    // 创建角色
    await client.security.putRole({
      name: 'blog_writer',
      body: {
        cluster: ['monitor'],
        indices: [
          {
            names: ['blog_posts'],
            privileges: ['create_index', 'write', 'read']
          }
        ],
        applications: []
      }
    });
    console.log('Role "blog_writer" created');

    // 创建用户
    await client.security.putUser({
      username: 'writer1',
      body: {
        password: 'SecurePassword123!', // 生产环境应该通过安全的方式提供
        roles: ['blog_writer'],
        full_name: 'Blog Writer',
        email: 'writer@example.com',
        metadata: {
          department: 'content'
        },
        enabled: true
      }
    });
    console.log('User "writer1" created with role "blog_writer"');

    // 获取用户信息
    const userInfo = await client.security.getUser({ username: 'writer1' });
    console.log('User info:', userInfo.body);

    return true;
  } catch (error) {
    console.error(`Error managing users and roles:`, error.meta.body.error);
    throw error;
  }
}

// 使用API密钥认证
async function createAndUseApiKey(client) {
  try {
    // 创建API密钥
    const apiKeyResponse = await client.security.createApiKey({
      body: {
        name: 'blog_application_key',
        role_descriptors: {
          api_writer_role: {
            cluster: ['monitor'],
            indices: [
              {
                names: ['blog_posts'],
                privileges: ['read', 'write']
              }
            ]
          }
        },
        expiration: '7d' // 7天有效期
      }
    });

    const { id, name, api_key, expiration } = apiKeyResponse.body;
    console.log(`API Key created: ${name}, expires: ${new Date(expiration).toISOString()}`);
    
    // 使用API密钥创建新客户端
    const apiKeyClient = new Client({
      node: 'https://elasticsearch.example.com:9200',
      auth: {
        apiKey: {
          id: id,
          api_key: api_key
        }
      },
      ssl: {
        rejectUnauthorized: true
      }
    });
    
    return { apiKeyClient, apiKeyResponse: { id, name, api_key, expiration } };
  } catch (error) {
    console.error(`Error creating API key:`, error.meta.body.error);
    throw error;
  }
}

// 使用示例
// const secureClient = createAuthenticatedClient();
// manageUsersAndRoles(secureClient);
// createAndUseApiKey(secureClient);
```

### 8.2 加密传输

```javascript
// security-encryption.js
const { Client } = require('@elastic/elasticsearch');
const fs = require('fs');

// 配置SSL/TLS连接
function createSecureClient() {
  // 读取证书文件
  const caCert = fs.readFileSync('/path/to/ca.crt', 'utf8');
  const clientCert = fs.readFileSync('/path/to/client.crt', 'utf8');
  const clientKey = fs.readFileSync('/path/to/client.key', 'utf8');

  const client = new Client({
    node: 'https://elasticsearch.example.com:9200',
    auth: {
      username: process.env.ELASTICSEARCH_USERNAME,
      password: process.env.ELASTICSEARCH_PASSWORD
    },
    ssl: {
      rejectUnauthorized: true, // 验证服务器证书
      ca: [caCert], // CA证书用于验证服务器
      cert: clientCert, // 客户端证书
      key: clientKey // 客户端密钥
    }
  });

  return client;
}

// 配置数据加密（需要在Elasticsearch配置中启用）
async function configureDataEncryption(client) {
  try {
    // 创建加密的索引模板
    await client.indices.putTemplate({
      name: 'encrypted_template',
      body: {
        index_patterns: ['secure-*'],
        settings: {
          index: {
            number_of_shards: 1,
            number_of_replicas: 1
          }
        },
        mappings: {
          dynamic_templates: [
            {
              strings: {
                match_mapping_type: 'string',
                mapping: {
                  type: 'text',
                  fields: {
                    keyword: {
                      type: 'keyword',
                      ignore_above: 256,
                      normalizer: 'lowercase' // 使用小写规范化器
                    }
                  }
                }
              }
            }
          ],
          properties: {
            // 敏感数据字段可以在应用层加密后再存储
            sensitive_data: {
              type: 'binary' // 存储加密的二进制数据
            }
          }
        }
      }
    });

    console.log('Encryption template created');
    return true;
  } catch (error) {
    console.error(`Error configuring data encryption:`, error.meta.body.error);
    throw error;
  }
}

// 应用层敏感数据加密示例
function encryptSensitiveData(data, encryptionKey) {
  // 注意：这只是一个简化的示例，实际应用中应使用更强健的加密库
  // 推荐使用如 node-forge, crypto-js 或 Node.js 的 crypto 模块进行加密
  console.log('Encrypting sensitive data before storage');
  // 实际加密逻辑将在这里实现
  return `encrypted_${data}`; // 仅作为示例
}

// 使用示例
// const secureClient = createSecureClient();
// configureDataEncryption(secureClient);
// const encryptedData = encryptSensitiveData('sensitive information', 'encryption_key');
```

### 8.3 审计与监控

```javascript
// security-audit.js
const { client } = require('./client');

// 配置审计日志
async function configureAuditLogging() {
  try {
    const result = await client.cluster.putSettings({
      persistent: {
        // 启用审计日志
        "xpack.security.audit.enabled": true,
        // 设置审计日志输出位置
        "xpack.security.audit.logfile.events.include": ["access_granted", "access_denied", "authentication_failed", "connection_denied"],
        "xpack.security.audit.logfile.events.exclude": ["grant_api_key", "invalidated_api_key"],
        // 配置索引审计
        "xpack.security.audit.index.events.include": ["access_granted", "access_denied", "authentication_failed"],
        "xpack.security.audit.index.settings.index.number_of_shards": 1,
        "xpack.security.audit.index.settings.index.number_of_replicas": 0
      }
    });

    console.log('Audit logging configured:', result.body);
    return result.body;
  } catch (error) {
    console.error(`Error configuring audit logging:`, error.meta.body.error);
    throw error;
  }
}

// 搜索审计日志
async function searchAuditLogs(client) {
  try {
    const result = await client.search({
      index: '.security-auditlog-*',
      body: {
        query: {
          bool: {
            must: [
              {
                range: {
                  '@timestamp': {
                    gte: 'now-24h'
                  }
                }
              },
              {
                terms: {
                  event.action: ['access_denied', 'authentication_failed']
                }
              }
            ]
          }
        },
        sort: [{ '@timestamp': { order: 'desc' } }],
        size: 10
      }
    });

    const suspiciousEvents = result.body.hits.hits.map(hit => ({
      timestamp: hit._source['@timestamp'],
      action: hit._source.event.action,
      user: hit._source.user.name || 'unknown',
      source: hit._source.source.ip || 'unknown',
      indices: hit._source.event.dataset || 'unknown'
    }));

    console.log('Suspicious audit events:', suspiciousEvents);
    return suspiciousEvents;
  } catch (error) {
    console.error(`Error searching audit logs:`, error.meta.body.error);
    throw error;
  }
}

// 安全事件监控
function setupSecurityMonitoring() {
  console.log('\nElasticsearch Security Monitoring Best Practices:');
  console.log('1. 监控失败的身份验证尝试');
  console.log('2. 监控访问被拒绝的事件');
  console.log('3. 监控敏感索引的访问');
  console.log('4. 设置异常活动警报');
  console.log('5. 定期审查用户权限和角色');
  console.log('6. 监控配置更改');
  console.log('7. 使用外部监控系统（如 ELK Stack 监控 Elasticsearch）');
  console.log('8. 实施自动化响应机制');
}

// 使用示例
// configureAuditLogging();
// searchAuditLogs(client);
// setupSecurityMonitoring();
```

## 9. 常见问题解决方案

### 9.1 连接问题

```javascript
// connection-issues.js
const { Client } = require('@elastic/elasticsearch');

// 诊断连接问题
async function diagnoseConnectionIssues(config) {
  try {
    console.log('Testing Elasticsearch connection...');
    console.log(`Endpoint: ${config.node}`);
    
    // 创建一个临时客户端用于诊断
    const diagnosticClient = new Client({
      ...config,
      // 减少超时时间以便更快地诊断问题
      requestTimeout: 5000
    });

    // 尝试获取集群信息
    const info = await diagnosticClient.info();
    console.log('✓ Connection successful!');
    console.log(`Cluster name: ${info.body.cluster_name}`);
    console.log(`Elasticsearch version: ${info.body.version.number}`);
    
    return { success: true, info: info.body };
  } catch (error) {
    console.error('✗ Connection failed!');
    
    // 分析错误类型
    if (error.meta.code === 'ECONNREFUSED') {
      console.error('Reason: Connection refused - Elasticsearch is not running or network is blocked');
      console.error('Possible solutions:');
      console.error('  1. Verify Elasticsearch is running on the specified host:port');
      console.error('  2. Check firewall settings');
      console.error('  3. Ensure network connectivity between your application and Elasticsearch');
    } else if (error.meta.statusCode === 401) {
      console.error('Reason: Unauthorized - Authentication failed');
      console.error('Possible solutions:');
      console.error('  1. Check username and password');
      console.error('  2. Verify API key if using API key authentication');
      console.error('  3. Ensure user has correct permissions');
    } else if (error.meta.statusCode === 403) {
      console.error('Reason: Forbidden - Authorization failed');
      console.error('Possible solutions:');
      console.error('  1. Check user roles and permissions');
      console.error('  2. Ensure user has access to the requested resources');
    } else if (error.meta.code === 'ETIMEDOUT') {
      console.error('Reason: Timeout - Request timed out');
      console.error('Possible solutions:');
      console.error('  1. Check Elasticsearch server load');
      console.error('  2. Increase request timeout');
      console.error('  3. Check network latency');
    } else {
      console.error(`Reason: ${error.meta.body?.error?.reason || error.message}`);
    }
    
    return { success: false, error: error };
  }
}

// 连接重试策略
function createRetryStrategyClient(options = {}) {
  const defaultOptions = {
    node: 'http://localhost:9200',
    maxRetries: 5,
    initialDelay: 1000,
    maxDelay: 30000,
    ...options
  };

  let retryCount = 0;
  let lastRetryDelay = defaultOptions.initialDelay;

  const client = new Client({
    ...defaultOptions,
    requestTimeout: 60000, // 增加超时时间
    // 自定义重试逻辑
    generateRequestId: () => `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
  });

  // 包装客户端方法以添加重试逻辑
  async function withRetry(method, params) {
    try {
      return await client[method](params);
    } catch (error) {
      // 判断是否应该重试
      const shouldRetry = (
        error.meta.code === 'ECONNREFUSED' ||
        error.meta.code === 'ETIMEDOUT' ||
        error.meta.statusCode >= 500
      );

      if (shouldRetry && retryCount < defaultOptions.maxRetries) {
        retryCount++;
        
        // 指数退避策略
        const delay = Math.min(
          defaultOptions.initialDelay * Math.pow(2, retryCount - 1),
          defaultOptions.maxDelay
        );
        lastRetryDelay = delay;

        console.log(`Request failed, retrying (${retryCount}/${defaultOptions.maxRetries}) in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // 重试请求
        return withRetry(method, params);
      } else {
        // 重置重试计数
        retryCount = 0;
        throw error;
      }
    }
  }

  // 导出带重试逻辑的方法
  return {
    search: (params) => withRetry('search', params),
    index: (params) => withRetry('index', params),
    get: (params) => withRetry('get', params),
    update: (params) => withRetry('update', params),
    delete: (params) => withRetry('delete', params),
    bulk: (params) => withRetry('bulk', params),
    indices: {
      create: (params) => withRetry('indices.create', params),
      delete: (params) => withRetry('indices.delete', params),
      exists: (params) => withRetry('indices.exists', params),
      putSettings: (params) => withRetry('indices.putSettings', params),
    },
    // 原始客户端方法
    _client: client
  };
}

// 使用示例
// diagnoseConnectionIssues({
//   node: 'http://localhost:9200',
//   auth: {
//     username: 'elastic',
//     password: 'changeme'
//   }
// });

// const retryClient = createRetryStrategyClient();
```

### 9.2 性能问题

```javascript
// performance-issues.js

// 性能问题诊断
function diagnosePerformanceIssues() {
  console.log('\nElasticsearch 性能问题诊断指南:');
  console.log('1. 检查集群健康状态');
  console.log('2. 分析慢查询');
  console.log('3. 检查索引大小和分片数');
  console.log('4. 监控节点资源使用情况');
  console.log('5. 检查垃圾回收日志');
  console.log('6. 分析线程池状态');
  console.log('7. 查看查询执行计划');
}

// 慢查询日志分析
async function analyzeSlowQueries(client) {
  try {
    // 配置慢查询日志（需要集群管理权限）
    await client.cluster.putSettings({
      persistent: {
        "index.search.slowlog.threshold.query.warn": "1s",
        "index.search.slowlog.threshold.fetch.warn": "500ms",
        "index.indexing.slowlog.threshold.index.warn": "1s"
      }
    });
    
    // 搜索慢查询日志（假设慢查询已被索引）
    const result = await client.search({
      index: 'logs-*', // 调整为您的日志索引模式
      body: {
        query: {
          bool: {
            must: [
              {
                range: {
                  '@timestamp': {
                    gte: 'now-1h'
                  }
                }
              },
              {
                match: {
                  message: 'slowlog'
                }
              }
            ]
          }
        },
        sort: [{ '@timestamp': { order: 'desc' } }],
        size: 10
      }
    });
    
    console.log(`Found ${result.body.hits.total.value} slow queries in the last hour`);
    return result.body.hits.hits;
  } catch (error) {
    console.error(`Error analyzing slow queries:`, error.meta.body.error);
    throw error;
  }
}

// 索引优化建议
function getIndexOptimizationRecommendations() {
  return [
    {
      issue: "索引过多分片",
      description: "每个分片都有一定的开销，创建过多的分片会增加集群负担",
      recommendation: "控制索引分片数量，每个分片大小建议在 10GB-50GB 之间"
    },
    {
      issue: "索引字段过多",
      description: "字段过多会增加索引大小并影响查询性能",
      recommendation: "限制字段数量，使用嵌套对象或映射动态关闭不需要的字段"
    },
    {
      issue: "无过滤缓存命中",
      description: "过滤查询结果未被有效缓存",
      recommendation: "使用过滤器上下文而非查询上下文进行精确匹配和范围过滤"
    },
    {
      issue: "深度分页",
      description: "大偏移量分页查询性能差",
      recommendation: "使用 search_after 替代 from/size 进行深度分页"
    },
    {
      issue: "频繁索引刷新",
      description: "默认刷新间隔（1秒）会影响写入性能",
      recommendation: "对于批量导入，临时增加刷新间隔或设置为 -1 禁用刷新"
    }
  ];
}

// 使用示例
// diagnosePerformanceIssues();
// analyzeSlowQueries(client);
// console.log('Index optimization recommendations:', getIndexOptimizationRecommendations());
```

### 9.3 集群扩展问题

```javascript
// scaling-issues.js
const { client } = require('./client');

// 集群扩展建议
function getClusterScalingRecommendations() {
  return {
    horizontalScaling: [
      "添加更多数据节点以增加存储容量和查询性能",
      "添加专用主节点以提高集群稳定性",
      "添加协调节点以处理查询路由和结果合并",
      "确保合理的分片分配策略"
    ],
    verticalScaling: [
      "增加节点的 CPU 核心数以提高处理能力",
      "增加节点内存以缓存更多数据和提高查询性能",
      "使用 SSD 存储以提高 I/O 性能",
      "合理配置 JVM 堆内存（通常为系统内存的 50%，但不超过 32GB）"
    ],
    shardManagement: [
      "控制每个索引的分片数量",
      "使用索引生命周期管理 (ILM) 管理旧数据",
      "实施数据分层存储（热、温、冷数据）",
      "定期进行索引合并和优化"
    ],
    configuration: [
      "优化线程池设置以匹配工作负载",
      "调整断路器以防止内存溢出",
      "配置适当的缓存大小",
      "使用压缩减少磁盘使用"
    ]
  };
}

// 分析集群分片分配
async function analyzeShardAllocation() {
  try {
    const result = await client.cat.shards({
      format: 'json',
      bytes: 'mb'
    });

    // 分析分片分配情况
    const shardStats = {
      totalShards: 0,
      totalReplicas: 0,
      unassignedShards: 0,
      shardsByNode: {},
      shardsByIndex: {},
      largeShards: [] // 大于 50GB 的分片
    };

    result.body.forEach(shard => {
      shardStats.totalShards++;
      if (shard.prirep === 'r') shardStats.totalReplicas++;
      if (shard.state === 'UNASSIGNED') shardStats.unassignedShards++;
      
      // 按节点统计
      if (!shardStats.shardsByNode[shard.node]) {
        shardStats.shardsByNode[shard.node] = 0;
      }
      shardStats.shardsByNode[shard.node]++;
      
      // 按索引统计
      if (!shardStats.shardsByIndex[shard.index]) {
        shardStats.shardsByIndex[shard.index] = { primary: 0, replica: 0, size: 0 };
      }
      if (shard.prirep === 'p') shardStats.shardsByIndex[shard.index].primary++;
      else shardStats.shardsByIndex[shard.index].replica++;
      
      // 累加大小（假设单位是 MB）
      shardStats.shardsByIndex[shard.index].size += parseInt(shard.store);
      
      // 记录大分片
      if (parseInt(shard.store) > 50 * 1024) { // 50GB
        shardStats.largeShards.push({
          index: shard.index,
          shard: shard.shard,
          size: shard.store + 'mb',
          node: shard.node
        });
      }
    });

    console.log('Shard allocation analysis:');
    console.log(`Total shards: ${shardStats.totalShards}`);
    console.log(`Total replicas: ${shardStats.totalReplicas}`);
    console.log(`Unassigned shards: ${shardStats.unassignedShards}`);
    console.log('Shards by node:', shardStats.shardsByNode);
    console.log('Shards by index:', shardStats.shardsByIndex);
    
    if (shardStats.largeShards.length > 0) {
      console.log('WARNING: Large shards detected:', shardStats.largeShards);
    }
    
    return shardStats;
  } catch (error) {
    console.error(`Error analyzing shard allocation:`, error.meta.body.error);
    throw error;
  }
}

// 使用示例
// console.log('Cluster scaling recommendations:', getClusterScalingRecommendations());
// analyzeShardAllocation();
```

## 10. 部署与维护

### 10.1 生产环境部署

```javascript
// production-deployment.js

// 生产环境配置示例
const productionConfig = {
  // 集群配置
  cluster: {
    name: 'production-cluster',
    // 至少 3 个专用主节点以确保高可用性
    masterNodes: 3,
    // 根据数据量和查询负载确定数据节点数量
    dataNodes: 5,
    // 对于高查询负载，考虑添加专用协调节点
    coordinatingNodes: 2
  },
  
  // 节点配置
  node: {
    // 数据节点
    dataNode: {
      // 推荐至少 32GB RAM，最多分配 31GB 给 JVM 堆
      memory: '64gb',
      // SSD 存储提供更好的 I/O 性能
      storage: 'ssd',
      // 至少 8 核 CPU
      cpuCores: 16
    },
    // 主节点
    masterNode: {
      // 主节点不需要太多内存，8-16GB 足够
      memory: '16gb',
      // 稳定的存储即可
      storage: 'hdd',
      // 4-8 核 CPU
      cpuCores: 8
    }
  },
  
  // Elasticsearch 配置
  elasticsearch: {
    // 禁用自动创建索引，防止意外创建
    actionAutoCreateIndex: false,
    // 配置堆内存大小
    heapSize: '31g',
    // 禁用交换空间，提高性能和稳定性
    bootstrapMemoryLock: true,
    // 网络设置
    network: {
      host: '0.0.0.0',
      port: 9200
    },
    // 安全设置
    security: {
      enabled: true,
      tls: {
        enabled: true,
        verificationMode: 'full'
      }
    },
    // 索引设置
    indices: {
      fielddataCacheSize: '30%',
      queryCacheSize: '10%',
      breakerTotalLimit: '70%'
    }
  }
};

// Docker Compose 生产部署示例（简化版）
const dockerComposeConfig = `
version: '3.8'

services:
  # 专用主节点
  es-master-1:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.17.0
    container_name: es-master-1
    environment:
      - node.name=es-master-1
      - cluster.name=production-cluster
      - discovery.seed_hosts=es-master-1,es-master-2,es-master-3
      - cluster.initial_master_nodes=es-master-1,es-master-2,es-master-3
      - node.master=true
      - node.data=false
      - node.ingest=false
      - bootstrap.memory_lock=true
      - "ES_JAVA_OPTS=-Xms8g -Xmx8g"
      - xpack.security.enabled=true
      - xpack.security.transport.ssl.enabled=true
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - es-master-1-data:/usr/share/elasticsearch/data
      - es-master-1-logs:/usr/share/elasticsearch/logs
    ports:
      - 9201:9200
    networks:
      - elastic

  # 数据节点示例
  es-data-1:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.17.0
    container_name: es-data-1
    environment:
      - node.name=es-data-1
      - cluster.name=production-cluster
      - discovery.seed_hosts=es-master-1,es-master-2,es-master-3
      - node.master=false
      - node.data=true
      - node.ingest=false
      - bootstrap.memory_lock=true
      - "ES_JAVA_OPTS=-Xms31g -Xmx31g"
      - xpack.security.enabled=true
      - xpack.security.transport.ssl.enabled=true
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - es-data-1-data:/usr/share/elasticsearch/data
      - es-data-1-logs:/usr/share/elasticsearch/logs
    networks:
      - elastic
    depends_on:
      - es-master-1

# 定义网络和卷
networks:
  elastic:
    driver: bridge

volumes:
  # 主节点卷
  es-master-1-data:
  es-master-1-logs:
  # 数据节点卷
  es-data-1-data:
  es-data-1-logs:
`;

// Kubernetes 部署注意事项
function kubernetesDeploymentTips() {
  console.log('\nElasticsearch Kubernetes 部署最佳实践:');
  console.log('1. 使用 StatefulSets 部署数据节点，确保稳定的网络标识和持久存储');
  console.log('2. 为不同类型的节点（主节点、数据节点、协调节点）创建单独的 StatefulSets 或 Deployments');
  console.log('3. 配置适当的资源请求和限制（CPU、内存）');
  console.log('4. 使用 Pod 反亲和性确保数据节点分布在不同的物理节点上');
  console.log('5. 为持久化存储使用 StorageClass 和适当的存储提供者');
  console.log('6. 使用 Service 暴露 Elasticsearch 服务');
  console.log('7. 考虑使用 ECK (Elastic Cloud on Kubernetes) 简化部署和管理');
  console.log('8. 配置适当的健康检查和就绪探针');
  console.log('9. 使用 ConfigMaps 管理配置文件');
  console.log('10. 使用 Secrets 管理敏感信息（如密码、证书）');
}

// 使用示例
// console.log('Production deployment configuration:', productionConfig);
// console.log('Docker Compose example:', dockerComposeConfig);
// kubernetesDeploymentTips();

### 10.2 备份与恢复

```javascript
// backup-restore.js
const { client } = require('./client');

// 配置 S3 仓库（用于备份）
async function configureS3Repository(repositoryName, bucketName, basePath) {
  try {
    const result = await client.snapshot.createRepository({
      repository: repositoryName,
      body: {
        type: 's3',
        settings: {
          bucket: bucketName,
          base_path: basePath,
          region: 'us-east-1',
          // 可以使用 IAM 角色或访问密钥
          // access_key: process.env.AWS_ACCESS_KEY_ID,
          // secret_key: process.env.AWS_SECRET_ACCESS_KEY
        }
      }
    });
    
    console.log(`S3 repository ${repositoryName} configured successfully`);
    return result;
  } catch (error) {
    console.error(`Error configuring S3 repository:`, error.meta.body.error);
    throw error;
  }
}

// 创建快照
async function createSnapshot(repositoryName, snapshotName, indices = []) {
  try {
    const params = {
      repository: repositoryName,
      snapshot: snapshotName,
      wait_for_completion: false // 异步创建快照
    };
    
    // 如果指定了索引，则只备份这些索引
    if (indices.length > 0) {
      params.body = {
        indices: indices.join(','),
        include_global_state: false // 不包含全局集群状态
      };
    }
    
    const result = await client.snapshot.create(params);
    console.log(`Snapshot creation started: ${snapshotName} in repository ${repositoryName}`);
    return result.body.task;
  } catch (error) {
    console.error(`Error creating snapshot:`, error.meta.body.error);
    throw error;
  }
}

// 监控快照状态
async function monitorSnapshotStatus(repositoryName, snapshotName) {
  try {
    const result = await client.snapshot.status({
      repository: repositoryName,
      snapshot: snapshotName
    });
    
    const snapshots = result.body.snapshots;
    if (snapshots.length === 0) {
      console.log(`Snapshot ${snapshotName} not found`);
      return null;
    }
    
    const snapshot = snapshots[0];
    console.log(`Snapshot status: ${snapshot.state}`);
    
    if (snapshot.state === 'IN_PROGRESS') {
      console.log(`Progress: ${snapshot.shards_stats.successful}/${snapshot.shards_stats.total} shards`);
    }
    
    return snapshot;
  } catch (error) {
    console.error(`Error monitoring snapshot status:`, error.meta.body.error);
    throw error;
  }
}

// 恢复快照
async function restoreSnapshot(repositoryName, snapshotName, renamePattern = null, renameReplacement = null) {
  try {
    const params = {
      repository: repositoryName,
      snapshot: snapshotName,
      wait_for_completion: false // 异步恢复
    };
    
    // 如果提供了重命名模式，可以在恢复时重命名索引
    if (renamePattern && renameReplacement) {
      params.body = {
        rename_pattern: renamePattern,
        rename_replacement: renameReplacement,
        include_global_state: false
      };
    }
    
    const result = await client.snapshot.restore(params);
    console.log(`Snapshot restore started: ${snapshotName} from repository ${repositoryName}`);
    return result.body.task;
  } catch (error) {
    console.error(`Error restoring snapshot:`, error.meta.body.error);
    throw error;
  }
}

// 删除快照
async function deleteSnapshot(repositoryName, snapshotName) {
  try {
    const result = await client.snapshot.delete({
      repository: repositoryName,
      snapshot: snapshotName
    });
    
    console.log(`Snapshot ${snapshotName} deleted from repository ${repositoryName}`);
    return result;
  } catch (error) {
    console.error(`Error deleting snapshot:`, error.meta.body.error);
    throw error;
  }
}

// 自动备份脚本示例
async function scheduleBackup(repositoryName, indices) {
  // 生成包含日期的快照名称
  const date = new Date();
  const snapshotName = `backup-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  
  try {
    // 检查仓库是否存在
    const repositoryExists = await client.snapshot.getRepository({
      repository: repositoryName
    });
    
    if (!repositoryExists.body[repositoryName]) {
      throw new Error(`Repository ${repositoryName} does not exist`);
    }
    
    // 创建快照
    const taskId = await createSnapshot(repositoryName, snapshotName, indices);
    
    console.log(`Scheduled backup task ID: ${taskId}`);
    console.log(`Backup will be stored as ${snapshotName} in ${repositoryName}`);
    
    // 在生产环境中，可以设置一个定时器来监控备份状态
    return taskId;
  } catch (error) {
    console.error(`Error scheduling backup:`, error);
    throw error;
  }
}

// 使用示例
// configureS3Repository('s3_backup', 'my-elasticsearch-backups', 'prod-cluster');
// createSnapshot('s3_backup', 'full_backup_20230601', ['blog_posts', 'user_profiles']);
// restoreSnapshot('s3_backup', 'full_backup_20230601', '(.+)', '$1_restored');
// scheduleBackup('s3_backup', ['blog_posts', 'user_profiles']);
```

### 10.3 监控与告警

```javascript
// monitoring-alerts.js
const { client } = require('./client');

// 配置基本监控检查
async function setupBasicMonitoringChecks() {
  console.log('Setting up Elasticsearch monitoring checks...');
  
  // 在生产环境中，可以集成到现有的监控系统（如 Prometheus + Grafana）
  // 这里仅提供关键指标的检查示例
  
  try {
    // 1. 检查集群健康
    const health = await client.cluster.health({
      level: 'indices'
    });
    
    // 2. 检查节点状态
    const nodes = await client.nodes.stats();
    
    // 3. 检查索引统计
    const indices = await client.cat.indices({
      format: 'json',
      bytes: 'mb'
    });
    
    return {
      cluster: health.body,
      nodes: nodes.body,
      indices: indices.body
    };
  } catch (error) {
    console.error('Error in monitoring checks:', error);
    throw error;
  }
}

// 检查关键告警指标
async function checkAlertingMetrics() {
  try {
    const alerts = [];
    
    // 1. 检查集群健康状态
    const health = await client.cluster.health();
    if (health.body.status !== 'green') {
      alerts.push({
        severity: 'high',
        message: `Cluster health is ${health.body.status}`,
        details: health.body
      });
    }
    
    // 2. 检查未分配的分片
    if (health.body.unassigned_shards > 0) {
      alerts.push({
        severity: 'high',
        message: `There are ${health.body.unassigned_shards} unassigned shards`,
        details: {
          unassigned_shards: health.body.unassigned_shards,
          active_shards: health.body.active_shards
        }
      });
    }
    
    // 3. 检查节点状态
    const nodesStats = await client.nodes.stats();
    const nodesInfo = await client.nodes.info();
    
    // 检查每个节点的资源使用情况
    Object.keys(nodesStats.body.nodes).forEach(nodeId => {
      const node = nodesStats.body.nodes[nodeId];
      const nodeInfo = nodesInfo.body.nodes[nodeId];
      const nodeName = nodeInfo.name;
      
      // CPU 使用率告警
      if (node.process.cpu.percent > 80) {
        alerts.push({
          severity: 'medium',
          message: `Node ${nodeName} CPU usage is high: ${node.process.cpu.percent}%`,
          details: {
            node: nodeName,
            cpu_percent: node.process.cpu.percent
          }
        });
      }
      
      // JVM 堆内存使用告警
      if (node.jvm.mem.heap_used_percent > 75) {
        alerts.push({
          severity: 'medium',
          message: `Node ${nodeName} JVM heap usage is high: ${node.jvm.mem.heap_used_percent}%`,
          details: {
            node: nodeName,
            heap_percent: node.jvm.mem.heap_used_percent,
            heap_used_mb: Math.round(node.jvm.mem.heap_used_in_bytes / (1024 * 1024)),
            heap_max_mb: Math.round(node.jvm.mem.heap_max_in_bytes / (1024 * 1024))
          }
        });
      }
      
      // 打开文件描述符告警
      if (node.process.open_file_descriptors > 0.8 * node.process.max_file_descriptors) {
        alerts.push({
          severity: 'medium',
          message: `Node ${nodeName} file descriptors usage is high`,
          details: {
            node: nodeName,
            open_file_descriptors: node.process.open_file_descriptors,
            max_file_descriptors: node.process.max_file_descriptors
          }
        });
      }
    });
    
    // 4. 检查索引状态
    const indices = await client.cat.indices({
      format: 'json'
    });
    
    indices.body.forEach(index => {
      // 检查索引状态
      if (index.status !== 'green') {
        alerts.push({
          severity: 'medium',
          message: `Index ${index.index} status is ${index.status}`,
          details: index
        });
      }
    });
    
    // 5. 检查慢查询
    // 这里可以查询慢查询日志索引
    
    console.log(`Found ${alerts.length} alerts`);
    return alerts;
  } catch (error) {
    console.error('Error checking alerting metrics:', error);
    throw error;
  }
}

// 推荐的监控工具和配置
function recommendedMonitoringTools() {
  return {
    elasticsearchNative: [
      "Elasticsearch Monitoring API",
      "Elasticsearch X-Pack Monitoring",
      "Kibana Monitoring Dashboard"
    ],
    thirdPartyTools: [
      "Prometheus + Grafana",
      "Datadog",
      "New Relic",
      "Dynatrace",
      "Zabbix"
    ],
    keyMetrics: [
      "集群健康状态（绿/黄/红）",
      "节点资源使用情况（CPU、内存、磁盘 I/O）",
      "JVM 堆内存使用情况",
      "线程池状态",
      "分片分配状态",
      "查询性能（延迟、吞吐量）",
      "索引性能（索引速率、合并时间）",
      "网络流量"
    ],
    alertingThresholds: [
      "集群状态非绿色 > 5 分钟",
      "JVM 堆内存使用率 > 85%",
      "CPU 使用率 > 90% > 10 分钟",
      "未分配分片 > 0 > 5 分钟",
      "节点离线 > 3 分钟",
      "慢查询数量突然增加"
    ]
  };
}

// 使用示例
// setupBasicMonitoringChecks();
// checkAlertingMetrics();
// console.log('Recommended monitoring tools:', recommendedMonitoringTools());
```

### 10.4 索引生命周期管理

```javascript
// index-lifecycle.js
const { client } = require('./client');

// 创建索引生命周期策略
async function createILMPolicy(policyName, phases) {
  try {
    const result = await client.ilm.putLifecycle({
      policy: policyName,
      body: {
        policy: phases
      }
    });
    
    console.log(`ILM policy ${policyName} created successfully`);
    return result;
  } catch (error) {
    console.error(`Error creating ILM policy:`, error.meta.body.error);
    throw error;
  }
}

// 应用索引生命周期策略到索引模板
async function applyILMToIndexTemplate(templateName, policyName, indexPatterns) {
  try {
    const result = await client.indices.putTemplate({
      name: templateName,
      body: {
        index_patterns: indexPatterns,
        settings: {
          number_of_shards: 1,
          number_of_replicas: 1,
          index.lifecycle.name: policyName,
          // 可选：设置滚动别名
          // index.lifecycle.rollover_alias: 'logs-write'
        }
      }
    });
    
    console.log(`ILM policy ${policyName} applied to template ${templateName}`);
    return result;
  } catch (error) {
    console.error(`Error applying ILM to index template:`, error.meta.body.error);
    throw error;
  }
}

// 示例：创建日志索引的生命周期策略
async function setupLogsILMPolicy() {
  // 定义生命周期策略
  const policy = {
    phases: {
      // 热阶段：索引正在被积极写入和查询
      hot: {
        actions: {
          // 滚动策略：当索引达到 50GB 或 30 天时滚动
          rollover: {
            max_size: '50gb',
            max_age: '30d'
          },
          // 设置优先级，热数据优先级最高
          set_priority: {
            priority: 100
          }
        }
      },
      // 温阶段：索引不再写入，但仍被查询
      warm: {
        // 索引在热阶段保留 45 天后移至温阶段
        min_age: '45d',
        actions: {
          // 降采样：优化存储
          shrink: {
            number_of_shards: 1
          },
          // 将索引移至特定节点
          allocate: {
            include: {
              data: 'warm'
            }
          },
          // 降低优先级
          set_priority: {
            priority: 50
          }
        }
      },
      // 冷阶段：索引很少被查询
      cold: {
        // 索引在温阶段保留 90 天后移至冷阶段
        min_age: '135d',
        actions: {
          // 归档：进一步优化存储
          freeze: {},
          // 将索引移至特定节点
          allocate: {
            include: {
              data: 'cold'
            }
          },
          // 进一步降低优先级
          set_priority: {
            priority: 10
          }
        }
      },
      // 删除阶段：索引不再需要
      delete: {
        // 索引在冷阶段保留 180 天后删除
        min_age: '315d',
        actions: {
          delete: {}
        }
      }
    }
  };

  try {
    // 创建策略
    await createILMPolicy('logs-lifecycle-policy', policy);
    
    // 应用到索引模板
    await applyILMToIndexTemplate('logs-template', 'logs-lifecycle-policy', ['logs-*']);
    
    console.log('Logs ILM policy setup complete');
    return true;
  } catch (error) {
    console.error('Error setting up logs ILM policy:', error);
    throw error;
  }
}

// 使用示例
// setupLogsILMPolicy();
```

## 11. 总结

Elasticsearch 是一个功能强大的分布式搜索和分析引擎，通过与 Node.js 的集成，可以构建各种复杂的搜索和分析应用。本指南提供了 Elasticsearch 基础知识、Node.js 集成方法、核心操作、高级功能、性能优化、安全最佳实践以及部署维护的详细说明。

### 关键要点

1. **基础集成**：使用官方的 `@elastic/elasticsearch` 客户端连接 Elasticsearch，支持基本的 CRUD 操作和复杂查询。

2. **高级功能**：掌握全文搜索、过滤查询、聚合分析、自动完成等高级功能，满足各种搜索需求。

3. **性能优化**：通过索引优化、查询优化和资源管理，提升 Elasticsearch 的性能。

4. **安全最佳实践**：实施认证授权、加密传输和审计监控，确保 Elasticsearch 的安全性。

5. **部署维护**：建立完善的备份恢复机制、监控告警系统和索引生命周期管理，保障系统的稳定性和可用性。

### 下一步学习建议

- 深入学习 Elasticsearch 的搜索相关性调优
- 探索 Elasticsearch 与 Kibana、Logstash 等工具的集成（ELK Stack）
- 学习 Elasticsearch 的分布式架构原理和故障处理
- 研究特定领域的应用场景，如日志分析、安全监控、业务分析等

通过本指南的学习，您应该能够在 Node.js 应用中有效地集成和使用 Elasticsearch，构建高性能的搜索和分析功能。

---

*本文档提供了 Elasticsearch 与 Node.js 集成的全面指南，涵盖从基本到高级的各个方面。在实际项目中，请根据具体需求和环境调整配置和最佳实践。*