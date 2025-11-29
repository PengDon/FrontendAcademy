# NestJS 基础

## 1. NestJS 简介

NestJS 是一个用于构建高效、可扩展的 Node.js 服务器端应用程序的框架。它使用渐进式 JavaScript，内置并完全支持 TypeScript，同时结合了 OOP（面向对象编程）、FP（函数式编程）和 FRP（函数式响应式编程）的元素。

NestJS 受到 Angular 的启发，提供了一个分层架构，可以帮助开发者编写模块化、可维护和可测试的代码。

### 1.1 主要特性

- **模块化架构**：使用模块组织代码，便于维护和扩展
- **依赖注入**：内置依赖注入系统，简化组件间通信
- **TypeScript 支持**：完整支持 TypeScript，提供更好的类型安全性和开发体验
- **装饰器语法**：使用装饰器简化配置和路由定义
- **中间件支持**：与 Express/Fastify 兼容的中间件系统
- **拦截器、守卫和过滤器**：强大的横切关注点处理机制
- **WebSocket 支持**：内置 WebSocket 模块
- **测试支持**：易于测试的架构设计

## 2. 安装与设置

### 2.1 环境要求

- Node.js (>= 10.13.0, v13 除外)
- npm 或 yarn

### 2.2 安装 Nest CLI

Nest CLI 是一个命令行工具，可以帮助你快速创建和管理 NestJS 项目。

```bash
# 使用 npm 安装
npm install -g @nestjs/cli

# 或者使用 yarn
# yarn global add @nestjs/cli
```

### 2.3 创建新项目

```bash
# 创建新项目
nest new project-name

# 根据提示选择包管理器（npm、yarn 或 pnpm）
```

### 2.4 项目结构

创建新项目后，NestJS 会生成一个基本的项目结构：

```
src/
  ├── app.controller.spec.ts  # 控制器测试
  ├── app.controller.ts       # 基本控制器示例
  ├── app.module.ts           # 应用程序的根模块
  ├── app.service.ts          # 基本服务示例
  └── main.ts                 # 应用程序入口文件
```

## 3. 主入口文件

`main.ts` 是 NestJS 应用程序的入口点，负责引导应用程序。

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // 创建 Nest 应用程序实例
  const app = await NestFactory.create(AppModule);
  
  // 可以在这里配置全局中间件、管道、拦截器等
  // app.use(express.json());
  // app.useGlobalPipes(new ValidationPipe());
  
  // 启动服务器，监听在 3000 端口
  await app.listen(3000);
  console.log(`应用程序运行在: ${await app.getUrl()}`);
}

bootstrap();
```

### 3.1 配置选项

创建应用程序时可以指定一些选项：

```typescript
const app = await NestFactory.create(AppModule, {
  cors: true, // 启用 CORS
  logger: ['error', 'warn', 'debug'], // 配置日志级别
  bufferLogs: true, // 缓冲日志
});
```

### 3.2 选择底层 HTTP 平台

默认情况下，NestJS 使用 Express 作为底层 HTTP 平台，但也可以使用 Fastify 来获得更高的性能：

```typescript
// 使用 Express
const app = await NestFactory.create(AppModule);

// 使用 Fastify
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  await app.listen(3000);
}
bootstrap();
```

## 4. 模块

模块是 NestJS 应用程序的基本构建块。每个应用程序至少有一个模块，即根模块（AppModule）。

### 4.1 基本模块结构

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule], // 导入其他模块
  controllers: [AppController], // 控制器
  providers: [AppService], // 服务和其他提供者
  exports: [], // 导出的提供者
})
export class AppModule {}
```

### 4.2 功能模块

创建一个功能模块，例如用户模块：

```typescript
// users.module.ts
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // 如果其他模块需要使用这个服务
})
export class UsersModule {}
```

### 4.3 全局模块

可以使用 `@Global()` 装饰器创建全局模块，这样就不需要在每个模块中导入它：

```typescript
import { Global, Module } from '@nestjs/common';
import { ConfigService } from './config.service';

@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
```

### 4.4 动态模块

动态模块允许我们在导入模块时配置它：

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
    }),
  ],
})
export class AppModule {}
```

## 5. 控制器

控制器负责处理传入的请求并返回响应。在 NestJS 中，控制器是使用 `@Controller()` 装饰器定义的类。

### 5.1 基本控制器

```typescript
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
// @Controller('users') // 可以指定路由前缀
export class AppController {
  // 依赖注入服务
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  
  @Get('users')
  getUsers(): string[] {
    return this.appService.getUsers();
  }
}
```

### 5.2 路由

NestJS 支持各种 HTTP 方法，如 GET、POST、PUT、DELETE 等：

```typescript
import { Controller, Get, Post, Put, Delete, Patch } from '@nestjs/common';

@Controller('items')
export class ItemsController {
  @Get() // GET /items
  findAll() {}

  @Post() // POST /items
  create() {}

  @Get(':id') // GET /items/:id
  findOne() {}

  @Put(':id') // PUT /items/:id
  update() {}

  @Patch(':id') // PATCH /items/:id
  updatePartial() {}

  @Delete(':id') // DELETE /items/:id
  remove() {}
}
```

### 5.3 请求对象

可以访问 Express/Fastify 请求对象：

```typescript
import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express'; // 或从 'fastify' 导入

@Controller('cats')
export class CatsController {
  @Get()
  findAll(@Req() request: Request): string {
    return 'This action returns all cats';
  }
}
```

### 5.4 请求装饰器

NestJS 提供了一组装饰器，用于提取请求的不同部分：

| 装饰器 | 描述 |
|--------|------|
| @Request(), @Req() | 请求对象 |
| @Response(), @Res() | 响应对象 |
| @Next() | next 函数 |
| @Session() | session 对象 |
| @Param(param?: string) | 路由参数 |
| @Body(param?: string) | 请求体 |
| @Query(param?: string) | 查询参数 |
| @Headers(name?: string) | 请求头 |
| @Ip() | 客户端 IP |
| @HostParam() | 主机名 |

使用示例：

```typescript
import { Controller, Get, Post, Body, Param, Query, Headers } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';

@Controller('cats')
export class CatsController {
  @Post()
  create(@Body() createCatDto: CreateCatDto) {
    return 'This action adds a new cat';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} cat`;
  }

  @Get()
  findAll(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Headers('Authorization') authorization: string
  ) {
    return `This action returns all cats (limit: ${limit}, offset: ${offset})`;
  }
}
```

## 6. 提供者

提供者是 NestJS 中可以注入依赖关系的对象。提供者可以是服务、仓库、工厂、拦截器等。

### 6.1 服务

服务是最常见的提供者类型，用于封装业务逻辑：

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  
  getUsers(): string[] {
    return ['John', 'Jane', 'Bob'];
  }
}
```

### 6.2 依赖注入

NestJS 使用依赖注入模式，使得组件之间松耦合：

```typescript
import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}
  
  findAll() {
    return this.userRepository.findAll();
  }
}
```

### 6.3 自定义提供者

除了使用 `@Injectable()` 装饰器，还可以定义自定义提供者：

```typescript
@Module({
  providers: [
    // 类提供者（简写）
    UserService,
    
    // 类提供者（完整）
    {
      provide: UserService,
      useClass: UserService,
    },
    
    // 值提供者
    {
      provide: 'CONFIG_OPTIONS',
      useValue: {
        apiKey: process.env.API_KEY,
        apiUrl: process.env.API_URL,
      },
    },
    
    // 工厂提供者
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: (config) => {
        return createConnection(config);
      },
      inject: ['CONFIG_OPTIONS'],
    },
    
    // 别名提供者
    {
      provide: 'ALIAS_FOR_USER_SERVICE',
      useExisting: UserService,
    },
  ],
})
export class AppModule {}
```

在服务中使用自定义提供者：

```typescript
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class ApiService {
  constructor(
    @Inject('CONFIG_OPTIONS') private configOptions: any,
    @Inject('DATABASE_CONNECTION') private dbConnection: any,
  ) {}
}
```

## 7. 中间件

中间件是在请求处理管道中的函数，它们可以访问请求对象、响应对象和应用程序请求-响应周期中的下一个中间件函数。

### 7.1 创建中间件

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');
    next();
  }
}
```

也可以使用函数式中间件：

```typescript
export function logger(req, res, next) {
  console.log(`Request...`);
  next();
};
```

### 7.2 应用中间件

在模块中应用中间件：

```typescript
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './logger.middleware';
import { CatsController } from './cats/cats.controller';

@Module({
  imports: [],
  controllers: [CatsController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 应用到特定控制器
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(CatsController);
    
    // 应用到特定路径
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('cats');
    
    // 应用到特定路径和方法
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({
        path: 'cats',
        method: RequestMethod.GET,
      });
    
    // 排除某些路由
    consumer
      .apply(LoggerMiddleware)
      .exclude(
        { path: 'cats', method: RequestMethod.GET },
        { path: 'cats', method: RequestMethod.POST },
        'cats/(.*)',
      )
      .forRoutes(CatsController);
  }
}
```

### 7.3 全局中间件

要注册全局中间件，使用 `use()` 方法：

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from './common/middleware/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(logger); // 全局中间件
  await app.listen(3000);
}
bootstrap();
```

## 8. 异常过滤器

异常过滤器允许你捕获应用程序中未处理的异常，并以统一的方式响应错误。

### 8.1 创建异常过滤器

```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}
```

### 8.2 使用异常过滤器

#### 8.2.1 在控制器方法中使用

```typescript
@Post()
@UseFilters(new HttpExceptionFilter())
async create(@Body() createCatDto: CreateCatDto) {
  throw new ForbiddenException();
}
```

#### 8.2.2 在控制器中使用

```typescript
@UseFilters(HttpExceptionFilter)
@Controller('cats')
export class CatsController {}
```

#### 8.2.3 全局使用

```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
```

## 9. 管道

管道用于数据转换和验证。在 NestJS 中，管道有两种类型：转换管道和验证管道。

### 9.1 创建管道

```typescript
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  transform(value: any, metadata: ArgumentMetadata) {
    // 转换或验证逻辑
    return value;
  }
}
```

### 9.2 使用内置验证管道

NestJS 内置了 `ValidationPipe`，它使用 `class-validator` 和 `class-transformer` 库：

```typescript
// main.ts
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // 移除没有装饰器的属性
    forbidNonWhitelisted: true, // 对于非白名单属性抛出错误
    transform: true, // 自动转换类型
  }));
  await app.listen(3000);
}
bootstrap();
```

### 9.3 使用管道进行验证

```typescript
// dto/create-cat.dto.ts
import { IsString, IsInt } from 'class-validator';

export class CreateCatDto {
  @IsString()
  name: string;

  @IsInt()
  age: number;

  @IsString()
  breed: string;
}
```

## 10. 守卫

守卫是一个使用 `@Injectable()` 装饰器的类，它实现了 `CanActivate` 接口。守卫用于根据某些条件（如权限、角色、ACL 等）来决定请求是否可以继续进行。

### 10.1 创建守卫

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}
```

### 10.2 使用守卫

#### 10.2.1 在控制器方法中使用

```typescript
@Post()
@UseGuards(AuthGuard)
async create(@Body() createCatDto: CreateCatDto) {
  return this.catsService.create(createCatDto);
}
```

#### 10.2.2 在控制器中使用

```typescript
@UseGuards(AuthGuard)
@Controller('cats')
export class CatsController {}
```

#### 10.2.3 全局使用

```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalGuards(new AuthGuard());
  await app.listen(3000);
}
bootstrap();
```

## 11. 拦截器

拦截器是一个使用 `@Injectable()` 装饰器的类，它实现了 `NestInterceptor` 接口。拦截器可以在方法执行前后添加额外的逻辑，转换请求/响应数据，或处理异常。

### 11.1 创建拦截器

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() => console.log(`After... ${Date.now() - now}ms`)),
      );
  }
}
```

### 11.2 使用拦截器

#### 11.2.1 在控制器方法中使用

```typescript
@UseInterceptors(LoggingInterceptor)
@Get()
async findAll() {
  return this.catsService.findAll();
}
```

#### 11.2.2 在控制器中使用

```typescript
@UseInterceptors(LoggingInterceptor)
@Controller('cats')
export class CatsController {}
```

#### 11.2.3 全局使用

```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new LoggingInterceptor());
  await app.listen(3000);
}
bootstrap();
```

## 12. 装饰器

### 12.1 自定义装饰器

可以创建自定义装饰器来提取常用的请求数据：

```typescript
// decorators/get-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```

使用自定义装饰器：

```typescript
@Get('profile')
getProfile(@GetUser() user: User) {
  return user;
}
```

## 13. CLI 命令

Nest CLI 提供了许多命令来简化开发过程：

```bash
# 生成控制器
nest generate controller users

# 生成服务
nest generate service users

# 生成模块
nest generate module users

# 生成中间件
nest generate middleware logger

# 生成装饰器
nest generate decorator user-role

# 生成过滤器
nest generate filter http-exception

# 生成管道
nest generate pipe validation

# 生成守卫
nest generate guard auth

# 生成拦截器
nest generate interceptor logging

# 生成 DTO
nest generate class users/dto/create-user.dto --no-spec

# 启动开发服务器
nest start --watch

# 构建项目
nest build

# 运行测试
nest test
```

## 14. 测试

NestJS 提供了对测试的良好支持：

### 14.1 单元测试

```typescript
// app.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return "Hello World!"', () => {
    expect(service.getHello()).toBe('Hello World!');
  });
});
```

### 14.2 端到端测试

```typescript
// cats.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CatsModule } from './../src/cats.module';

describe('CatsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CatsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/cats')
      .expect(200)
      .expect('This action returns all cats');
  });
});
```

## 15. 参考资源

- [NestJS 官方文档](https://docs.nestjs.com/)
- [NestJS GitHub 仓库](https://github.com/nestjs/nest)
- [NestJS 中文文档](https://docs.nestjs.cn/)
- [class-validator 文档](https://github.com/typestack/class-validator)