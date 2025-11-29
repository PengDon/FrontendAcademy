# NestJS 模块

## 1. 模块基础概念

模块是 NestJS 应用程序的基本构建块，它是一组相关功能的集合，将控制器、提供者和其他模块组织在一起。每个 NestJS 应用程序至少有一个根模块（通常是 `AppModule`），它是应用程序的入口点。

### 1.1 模块的作用

- **代码组织**：将相关的控制器、服务等组织在一起
- **依赖管理**：控制提供者的作用域和可见性
- **功能封装**：将功能封装为可重用的单元
- **路由分组**：可以与路由前缀结合使用，实现路由分组

## 2. 基本模块结构

一个基本的模块包含以下部分：

```typescript
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from '../database/database.module';
import { LoggerService } from '../common/services/logger.service';

@Module({
  // 导入其他模块
  imports: [DatabaseModule],
  
  // 声明该模块中的控制器
  controllers: [UsersController],
  
  // 声明该模块中的提供者（服务、仓库等）
  providers: [UsersService, LoggerService],
  
  // 导出提供者，使它们在导入此模块的其他模块中可用
  exports: [UsersService],
})
export class UsersModule {}
```

### 2.1 根模块示例

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [UsersModule, ProductsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

## 3. 创建模块

### 3.1 使用 Nest CLI 创建模块

```bash
# 生成模块
nest generate module users

# 生成功能模块（同时创建控制器、服务和模块）
nest generate resource users
```

### 3.2 手动创建模块

创建一个模块文件，并使用 `@Module()` 装饰器装饰它：

```typescript
// products.module.ts
import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
```

## 4. 模块类型

### 4.1 功能模块

功能模块是最常见的模块类型，用于组织特定业务功能的相关组件：

```typescript
@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
```

### 4.2 共享模块

默认情况下，模块是单例的，可以通过 `exports` 属性共享其提供者：

```typescript
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
```

任何导入 `ConfigModule` 的模块都可以访问 `ConfigService`：

```typescript
@Module({
  imports: [ConfigModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

### 4.3 全局模块

使用 `@Global()` 装饰器可以使模块成为全局模块，这样就不需要在每个使用它的模块中导入：

```typescript
import { Global, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';

@Global()
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
```

> 注意：全局模块通常用于提供基础功能，如日志记录、配置等，避免在每个模块中重复导入。

### 4.4 动态模块

动态模块允许我们在导入模块时进行配置，使模块更加灵活：

```typescript
import { Module, DynamicModule } from '@nestjs/common';
import { DatabaseService } from './database.service';

export class DatabaseModule {
  static register(options: any): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: 'DATABASE_OPTIONS',
          useValue: options,
        },
        DatabaseService,
      ],
      exports: [DatabaseService],
    };
  }
}
```

使用动态模块：

```typescript
@Module({
  imports: [
    DatabaseModule.register({
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'secret',
      database: 'myapp',
    }),
  ],
})
export class AppModule {}
```

### 4.5 异步动态模块

有些配置可能需要异步加载（例如，从环境变量或配置文件中）：

```typescript
import { Module, DynamicModule, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { DatabaseService } from './database.service';

export class DatabaseModule {
  static registerAsync(options: {
    useFactory: (...args: any[]) => Promise<any> | any;
    inject?: any[];
  }): DynamicModule {
    return {
      module: DatabaseModule,
      imports: options.imports,
      providers: [
        {
          provide: 'DATABASE_OPTIONS',
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        DatabaseService,
      ],
      exports: [DatabaseService],
    };
  }
}
```

使用异步动态模块：

```typescript
@Module({
  imports: [
    ConfigModule,
    DatabaseModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

## 5. 模块元数据

`@Module()` 装饰器接受一个元数据对象，其中包含以下属性：

- **imports**：导入其他模块，使它们的导出对当前模块可用
- **controllers**：该模块中定义的控制器
- **providers**：该模块中定义的提供者，将由 Nest 注入器实例化
- **exports**：导出的提供者，使它们在导入此模块的其他模块中可用

## 6. 模块作用域

NestJS 中的模块作用域决定了提供者的可见性和生命周期：

### 6.1 单例作用域

默认情况下，所有模块和提供者都是单例的，这意味着在整个应用程序生命周期中，只会创建一次实例：

```typescript
@Module({
  providers: [
    {
      provide: 'SINGLETON_SERVICE',
      useClass: SingletonService,
      // 默认是单例
    },
  ],
})
export class AppModule {}
```

### 6.2 请求作用域

使用请求作用域，可以为每个传入的请求创建一个新的提供者实例：

```typescript
import { Scope, Injectable } from '@nestjs/common';

@Injectable({
  scope: Scope.REQUEST,
})
export class RequestScopedService {
  constructor() {
    console.log(`创建了一个新的 RequestScopedService 实例`);
  }
}
```

### 6.3 瞬态作用域

使用瞬态作用域，每次注入时都会创建一个新的提供者实例：

```typescript
import { Scope, Injectable } from '@nestjs/common';

@Injectable({
  scope: Scope.TRANSIENT,
})
export class TransientScopedService {
  constructor() {
    console.log(`创建了一个新的 TransientScopedService 实例`);
  }
}
```

## 7. 模块间通信

### 7.1 通过导出和导入通信

最常见的模块间通信方式是通过导入/导出机制：

```typescript
// auth.module.ts
@Module({
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}

// users.module.ts
@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

在 `UsersService` 中使用 `AuthService`：

```typescript
@Injectable()
export class UsersService {
  constructor(private authService: AuthService) {}
  
  async createUser(userData) {
    // 使用 AuthService 进行身份验证或授权
    const hashedPassword = await this.authService.hashPassword(userData.password);
    // ...
  }
}
```

### 7.2 使用全局配置

对于需要在多个模块间共享的配置，可以使用全局模块或配置服务：

```typescript
// config.module.ts
@Global()
@Module({
  providers: [
    {
      provide: 'APP_CONFIG',
      useValue: {
        apiKey: process.env.API_KEY,
        apiUrl: process.env.API_URL,
      },
    },
  ],
  exports: ['APP_CONFIG'],
})
export class ConfigModule {}
```

### 7.3 使用事件总线

对于松耦合的模块间通信，可以使用 NestJS 的事件系统：

```typescript
// 1. 创建事件类
class UserCreatedEvent {
  constructor(public readonly userId: string) {}
}

// 2. 在一个模块中触发事件
@Injectable()
export class UsersService {
  constructor(private eventEmitter: EventEmitter2) {}
  
  async createUser(userData) {
    // 创建用户...
    this.eventEmitter.emit('user.created', new UserCreatedEvent(userId));
  }
}

// 3. 在另一个模块中监听事件
@Injectable()
export class NotificationService {
  @OnEvent('user.created')
  handleUserCreatedEvent(event: UserCreatedEvent) {
    // 发送通知...
  }
}
```

## 8. 模块组织最佳实践

### 8.1 按功能组织模块

将相关功能组织在一个模块中，例如用户管理、产品管理等：

```
src/
  ├── users/
  │   ├── users.controller.ts
  │   ├── users.service.ts
  │   ├── users.module.ts
  │   └── dto/
  ├── products/
  │   ├── products.controller.ts
  │   ├── products.service.ts
  │   ├── products.module.ts
  │   └── dto/
  └── app.module.ts
```

### 8.2 分层架构

将应用程序组织为多层，每一层都有自己的模块：

```
src/
  ├── presentation/
  │   ├── controllers/
  │   └── presentation.module.ts
  ├── application/
  │   ├── services/
  │   └── application.module.ts
  ├── domain/
  │   ├── entities/
  │   ├── repositories/
  │   └── domain.module.ts
  ├── infrastructure/
  │   ├── database/
  │   ├── external-api/
  │   └── infrastructure.module.ts
  └── app.module.ts
```

### 8.3 模块命名约定

- 使用描述性名称，如 `UsersModule`、`ProductsModule`
- 文件名通常与模块名相同，如 `users.module.ts`
- 对于共享模块，可以添加 `Shared` 前缀，如 `SharedLoggerModule`

### 8.4 模块粒度

- **不要太大**：一个模块不应包含太多不相关的功能
- **不要太小**：避免创建过多的微小模块，这会增加复杂性
- **保持内聚**：确保模块中的组件紧密相关

## 9. 循环依赖处理

NestJS 提供了几种处理循环依赖的方法：

### 9.1 使用前向引用

```typescript
import { Module, forwardRef } from '@nestjs/common';

@Module({
  imports: [forwardRef(() => UsersModule)],
})
export class AuthModule {}

@Module({
  imports: [forwardRef(() => AuthModule)],
})
export class UsersModule {}
```

### 9.2 使用模块引用

```typescript
import { Injectable, ModuleRef } from '@nestjs/common';

@Injectable()
export class UsersService {
  private authService: AuthService;
  
  constructor(private moduleRef: ModuleRef) {}
  
  // 在需要时获取服务
  async someMethod() {
    this.authService = this.authService || this.moduleRef.get(AuthService, { strict: false });
    return this.authService.doSomething();
  }
}
```

## 10. 测试模块

### 10.1 单元测试模块

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from './users.module';
import { UsersService } from './users.service';

describe('UsersModule', () => {
  let module: TestingModule;
  let usersService: UsersService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [UsersModule],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide UsersService', () => {
    expect(usersService).toBeDefined();
  });
});
```

### 10.2 模拟模块依赖

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from './users.module';
import { DatabaseModule } from '../database/database.module';
import { UsersService } from './users.service';

describe('UsersModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        // 模拟 DatabaseModule
        { 
          module: class MockDatabaseModule {},
          providers: [
            { 
              provide: 'DATABASE_CONNECTION', 
              useValue: {} 
            }
          ],
        },
      ],
      controllers: [],
      providers: [UsersService],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });
});
```

## 11. 模块装饰器与元数据

### 11.1 自定义模块装饰器

可以创建自定义模块装饰器来简化常见的模块配置：

```typescript
import { SetMetadata, Module } from '@nestjs/common';

export function FeatureModule(options = {}) {
  const metadata = { ...options };
  return function (constructor) {
    SetMetadata('feature', metadata)(constructor);
    return Module({
      ...options,
    })(constructor);
  };
}
```

使用自定义装饰器：

```typescript
@FeatureModule({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

## 12. 高级模块技术

### 12.1 动态加载模块

在运行时动态加载模块：

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 动态加载模块
  const featureModules = getFeatureModules();
  for (const module of featureModules) {
    await app.register(module);
  }
  
  await app.listen(3000);
}
bootstrap();
```

### 12.2 模块生命周期

模块可以实现一些生命周期钩子：

```typescript
import { Module, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

@Module({})
export class DatabaseModule implements OnModuleInit, OnModuleDestroy {
  onModuleInit() {
    console.log('DatabaseModule 已初始化');
    // 连接到数据库
  }
  
  onModuleDestroy() {
    console.log('DatabaseModule 即将销毁');
    // 断开数据库连接
  }
}
```

### 12.3 全局前缀与模块

为控制器设置全局前缀：

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1'); // 设置全局前缀
  await app.listen(3000);
}
bootstrap();
```

## 13. 模块与微服务

在微服务架构中，模块可以帮助组织微服务的功能：

```typescript
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PAYMENT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3001,
        },
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
```

## 14. 模块化 NestJS 应用程序示例

### 14.1 完整的模块化应用示例

```
src/
  ├── app.module.ts                    # 根模块
  ├── main.ts                          # 应用入口
  ├── users/                           # 用户模块
  │   ├── users.module.ts
  │   ├── users.controller.ts
  │   ├── users.service.ts
  │   ├── dto/
  │   └── entities/
  ├── products/                        # 产品模块
  │   ├── products.module.ts
  │   ├── products.controller.ts
  │   ├── products.service.ts
  │   ├── dto/
  │   └── entities/
  ├── shared/                          # 共享模块
  │   ├── database/
  │   │   ├── database.module.ts
  │   │   └── database.service.ts
  │   ├── auth/
  │   │   ├── auth.module.ts
  │   │   ├── auth.service.ts
  │   │   └── guards/
  │   └── config/
  │       ├── config.module.ts
  │       └── config.service.ts
  └── api/                             # API 模块（聚合路由）
      ├── api.module.ts
      ├── v1/
      │   ├── v1.module.ts
      │   └── routes/
      └── v2/
          ├── v2.module.ts
          └── routes/
```

## 15. 参考资源

- [NestJS 模块官方文档](https://docs.nestjs.com/modules)
- [NestJS 动态模块官方文档](https://docs.nestjs.com/modules/dynamic-modules)
- [NestJS 依赖注入官方文档](https://docs.nestjs.com/providers)
- [NestJS 作用域官方文档](https://docs.nestjs.com/fundamentals/injection-scopes)