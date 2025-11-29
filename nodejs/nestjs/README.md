# NestJS 完全指南

## 介绍

NestJS是一个渐进式的Node.js框架，用于构建高效、可靠和可扩展的服务器端应用程序。它利用TypeScript的强大功能，结合了面向对象编程、函数式编程和函数式响应式编程的元素，为Node.js后端开发提供了完整的架构解决方案。本指南将详细介绍NestJS的核心概念、API设计、最佳实践和高级特性，帮助开发者快速掌握并应用这一强大框架。

## 目录

1. [NestJS简介](#NestJS简介)
2. [环境搭建](#环境搭建)
3. [核心概念](#核心概念)
   - [模块(Module)](#模块Module)
   - [控制器(Controller)](#控制器Controller)
   - [提供者(Provider)](#提供者Provider)
   - [服务(Service)](#服务Service)
   - [中间件(Middleware)](#中间件Middleware)
   - [守卫(Guard)](#守卫Guard)
   - [拦截器(Interceptor)](#拦截器Interceptor)
   - [管道(Pipe)](#管道Pipe)
   - [异常过滤器(Exception Filter)](#异常过滤器Exception-Filter)
4. [依赖注入系统](#依赖注入系统)
5. [配置管理](#配置管理)
6. [数据库集成](#数据库集成)
7. [认证与授权](#认证与授权)
8. [测试](#测试)
9. [微服务](#微服务)
10. [部署](#部署)
11. [最佳实践](#最佳实践)
12. [常见问题](#常见问题)

## NestJS简介

NestJS是一个基于Node.js的框架，它受到Angular的启发，提供了模块化的架构模式，使开发者能够轻松构建可维护的大型应用程序。NestJS提供了一系列开箱即用的功能，包括依赖注入、模块化设计、中间件支持等，同时保持了与Express或Fastify等底层HTTP服务器的兼容性。

### NestJS的主要特点

1. **TypeScript支持**：完全支持TypeScript，提供类型安全和更好的开发体验。
2. **模块化架构**：采用模块化设计，便于代码组织和维护。
3. **依赖注入**：强大的依赖注入系统，促进代码解耦和可测试性。
4. **丰富的装饰器**：使用装饰器简化代码，提高可读性。
5. **中间件支持**：兼容Express/Fastify中间件生态系统。
6. **微服务支持**：内置对微服务架构的支持。
7. **全面的文档**：详细的官方文档和活跃的社区支持。
8. **测试友好**：易于进行单元测试和集成测试。

## 环境搭建

### 安装Node.js和npm

NestJS需要Node.js环境，建议安装最新的LTS版本。

```bash
# 检查Node.js版本
node -v

# 检查npm版本
npm -v
```

### 安装NestJS CLI

NestJS提供了命令行工具，用于快速创建和管理NestJS项目。

```bash
npm install -g @nestjs/cli
```

### 创建新项目

使用NestJS CLI创建一个新的项目：

```bash
# 创建新项目
nest new project-name

# 选择包管理器（npm, yarn, pnpm）
# 等待依赖安装完成
```

### 项目结构

一个标准的NestJS项目结构如下：

```
src/
├── app.controller.spec.ts  # 控制器测试文件
├── app.controller.ts       # 根控制器
├── app.module.ts           # 根模块
├── app.service.ts          # 根服务
└── main.ts                 # 应用入口文件
```

## 核心概念

### 模块(Module)

模块是NestJS应用程序的基本组织单元，用于将相关功能分组。每个NestJS应用至少有一个根模块（AppModule）。

#### 创建模块

```typescript
// src/modules/user/user.module.ts
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // 导出服务以便其他模块使用
})
export class UserModule {} // 导出用户模块
```

#### 使用模块

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [UserModule], // 导入用户模块
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {} // 导出应用模块
```

### 控制器(Controller)

控制器负责处理传入的HTTP请求和返回响应。控制器使用装饰器定义路由、HTTP方法和请求参数。

#### 创建控制器

```typescript
// src/modules/user/user.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, User } from './user.dto';

@Controller('users') // 定义基础路由
@Controller('api/v1/users') // 可以定义更复杂的路由前缀

export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get() // GET /users
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10): Promise<User[]> {
    return this.userService.findAll(page, limit);
  }

  @Get(':id') // GET /users/:id
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Post() // POST /users
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Put(':id') // PUT /users/:id
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id') // DELETE /users/:id
  remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(id);
  }
}
```

#### 路由参数验证

```typescript
import { Controller, Get, Param } from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common';

@Controller('users')
export class UserController {
  // 使用ParseIntPipe验证id必须为整数
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return { message: `查找用户ID: ${id}` };
  }
}
```

### 提供者(Provider)

提供者是NestJS中可以被注入的对象，是NestJS依赖注入系统的核心。提供者可以是服务、仓库、工厂函数、拦截器、守卫等。

#### 基本提供者

```typescript
// src/providers/database.providers.ts
import { Connection } from 'mongoose';
import { UserSchema } from './schemas/user.schema';

export const databaseProviders = [
  {
    provide: 'USER_MODEL', // 提供者令牌
    useFactory: (connection: Connection) => connection.model('User', UserSchema),
    inject: ['DATABASE_CONNECTION'], // 依赖注入
  },
];
```

#### 异步提供者

```typescript
// src/providers/database.providers.ts
import mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (configService: ConfigService): Promise<typeof mongoose> => {
      const uri = configService.get<string>('MONGODB_URI');
      return mongoose.connect(uri);
    },
    inject: [ConfigService],
  },
];
```

### 服务(Service)

服务是一种特殊类型的提供者，通常用于实现业务逻辑。服务使用`@Injectable()`装饰器标记，并通过依赖注入系统注入到控制器中。

#### 创建服务

```typescript
// src/modules/user/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, User } from './user.dto';

@Injectable() // 标记为可注入服务
export class UserService {
  // 模拟数据库
  private users: User[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  ];

  async findAll(page: number = 1, limit: number = 10): Promise<User[]> {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return this.users.slice(startIndex, endIndex);
  }

  async findOne(id: string): Promise<User> {
    const user = this.users.find(user => user.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser: User = {
      id: String(Date.now()), // 简单生成ID
      ...createUserDto,
    };
    this.users.push(newUser);
    return newUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    this.users[index] = { ...this.users[index], ...updateUserDto };
    return this.users[index];
  }

  async remove(id: string): Promise<void> {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    this.users.splice(index, 1);
  }
}
```

### 中间件(Middleware)

中间件是在路由处理程序执行前后调用的函数。中间件可以访问请求和响应对象，以及应用程序的请求-响应周期中的下一个中间件函数。

#### 创建函数式中间件

```typescript
// src/middleware/logger.middleware.ts
export function LoggerMiddleware(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // 调用下一个中间件
}
```

#### 创建类中间件

```typescript
// src/middleware/logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next(); // 调用下一个中间件
  }
}
```

#### 应用中间件

```typescript
// src/app.module.ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [UserModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware) // 应用中间件
      .forRoutes('users'); // 对特定路由应用
      // .forRoutes(UserController); // 也可以针对控制器
      // .forRoutes({ path: 'users', method: RequestMethod.GET }); // 也可以限制HTTP方法
  }
}
```

### 守卫(Guard)

守卫负责授权逻辑，决定请求是否应该被路由处理程序处理。守卫在中间件之后，拦截器和管道之前执行。

#### 创建认证守卫

```typescript
// src/guards/auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('未提供认证令牌');
    }
    
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'YOUR_SECRET_KEY', // 实际应用中应从配置中获取
      });
      request.user = payload; // 将用户信息附加到请求对象
    } catch (error) {
      throw new UnauthorizedException('无效的认证令牌');
    }
    
    return true; // 允许访问
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
```

#### 使用守卫

```typescript
// src/modules/user/user.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../guards/auth.guard';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(AuthGuard) // 对整个控制器应用守卫
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // 也可以对单个路由应用守卫
  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
}
```

### 拦截器(Interceptor)

拦截器可以在请求处理前后执行代码，转换请求/响应数据，处理异常等。

#### 创建日志拦截器

```typescript
// src/interceptors/logger.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;

    console.log(`[${new Date().toISOString()}] ${method} ${url} 请求开始`);

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;
        console.log(`[${new Date().toISOString()}] ${method} ${url} 响应完成 - 状态码: ${statusCode}, 耗时: ${Date.now() - now}ms`);
      }),
    );
  }
}
```

#### 使用拦截器

```typescript
// src/modules/user/user.controller.ts
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { LoggerInterceptor } from '../../interceptors/logger.interceptor';
import { UserService } from './user.service';

@Controller('users')
@UseInterceptors(LoggerInterceptor) // 对整个控制器应用拦截器
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }
}
```

#### 全局使用拦截器

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerInterceptor } from './interceptors/logger.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 全局应用拦截器
  app.useGlobalInterceptors(new LoggerInterceptor());
  
  await app.listen(3000);
}
bootstrap();
```

### 管道(Pipe)

管道负责数据转换和验证。NestJS内置了几种管道，如ValidationPipe、ParseIntPipe等。

#### 创建自定义验证管道

```typescript
// src/pipes/validation.pipe.ts
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    // 如果没有元数据，或者不是类，直接返回值
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    
    // 将普通对象转换为类实例
    const object = plainToInstance(metatype, value);
    
    // 验证类实例
    const errors = await validate(object);
    
    if (errors.length > 0) {
      // 格式化错误消息
      const formattedErrors = errors.map(error => {
        return Object.values(error.constraints).join(', ');
      }).join('; ');
      
      throw new BadRequestException(formattedErrors);
    }
    
    return value;
  }
  
  // 判断是否需要验证
  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
```

#### 创建数据传输对象(DTO)

```typescript
// src/modules/user/user.dto.ts
import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

// 用户数据传输对象
export class User {
  id: string;
  name: string;
  email: string;
}

// 创建用户的数据传输对象
export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: '用户名不能为空' })
  name: string;
  
  @IsEmail({}, { message: '必须提供有效的邮箱地址' })
  email: string;
}

// 更新用户的数据传输对象
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: '用户名不能为空' })
  name?: string;
  
  @IsOptional()
  @IsEmail({}, { message: '必须提供有效的邮箱地址' })
  email?: string;
}
```

#### 使用管道

```typescript
// src/modules/user/user.controller.ts
import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { ValidationPipe } from '../../pipes/validation.pipe';
import { CreateUserDto } from './user.dto';
import { UserService } from './user.service';

@Controller('users')
@UsePipes(new ValidationPipe()) // 对整个控制器应用管道
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  // 也可以对单个路由应用管道
  // @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
```

#### 全局使用管道

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 全局应用管道
  app.useGlobalPipes(new ValidationPipe());
  
  await app.listen(3000);
}
bootstrap();
```

### 异常过滤器(Exception Filter)

异常过滤器用于捕获异常并自定义响应格式。NestJS提供了全局异常过滤器，但也可以创建自定义异常过滤器。

#### 创建自定义异常过滤器

```typescript
// src/filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse();
    
    // 构建统一的错误响应格式
    const responseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error: typeof errorResponse === 'string' ? errorResponse : 
        (errorResponse as any).message || exception.message,
      // 可以添加更多自定义字段
      details: typeof errorResponse === 'object' ? (errorResponse as any).error || null : null,
    };
    
    response.status(status).json(responseBody);
  }
}

// 捕获所有异常的过滤器
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    // 默认状态码为500
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    
    // 构建错误响应
    const responseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error: exception instanceof HttpException
        ? exception.message
        : 'Internal Server Error',
    };
    
    // 记录异常
    console.error('全局异常捕获:', exception);
    
    response.status(status).json(responseBody);
  }
}
```

#### 使用异常过滤器

```typescript
// src/modules/user/user.controller.ts
import { Controller, Get, Param, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../filters/http-exception.filter';
import { UserService } from './user.service';

@Controller('users')
@UseFilters(HttpExceptionFilter) // 对整个控制器应用过滤器
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  // 也可以对单个路由应用过滤器
  // @UseFilters(HttpExceptionFilter)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
}
```

#### 全局使用异常过滤器

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 全局应用异常过滤器
  app.useGlobalFilters(new AllExceptionsFilter());
  
  await app.listen(3000);
}
bootstrap();
```

## 依赖注入系统

NestJS的依赖注入系统是框架的核心特性之一，它允许开发者轻松管理组件之间的依赖关系，提高代码的可测试性和可维护性。

### 基本依赖注入

```typescript
// src/modules/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  // 构造函数注入
  constructor(private readonly userRepository: UserRepository) {}
  
  async findAll() {
    return this.userRepository.findAll();
  }
  
  // 其他方法...
}
```

### 自定义提供者

```typescript
// src/app.module.ts
import { Module, ValueProvider, FactoryProvider, ClassProvider } from '@nestjs/common';

// 值提供者
const configProvider: ValueProvider = {
  provide: 'CONFIG',
  useValue: {
    apiKey: 'YOUR_API_KEY',
    databaseUrl: 'mongodb://localhost:27017/nest',
  },
};

// 工厂提供者
const loggerProvider: FactoryProvider = {
  provide: 'LOGGER',
  useFactory: () => {
    return {
      log: (message) => console.log(`[LOG] ${message}`),
      error: (message) => console.error(`[ERROR] ${message}`),
    };
  },
};

// 类提供者
const databaseProvider: ClassProvider = {
  provide: 'DATABASE',
  useClass: DatabaseService,
};

@Module({
  providers: [configProvider, loggerProvider, databaseProvider],
})
export class AppModule {}
```

### 注入自定义提供者

```typescript
// src/modules/user/user.service.ts
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @Inject('CONFIG') private readonly config: any,
    @Inject('LOGGER') private readonly logger: any,
    @Inject('DATABASE') private readonly database: any,
  ) {}
  
  async findAll() {
    this.logger.log('Finding all users');
    // 使用配置
    console.log('API Key:', this.config.apiKey);
    // 使用数据库
    return this.database.collection('users').find().toArray();
  }
}
```

### 作用域

NestJS的提供者可以有三种作用域：

1. **DEFAULT**：单例模式，整个应用共享一个实例。
2. **REQUEST**：每个请求创建一个新实例。
3. **TRANSIENT**：每次注入时创建一个新实例。

```typescript
// src/modules/user/user.service.ts
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST }) // 请求作用域
export class UserService {
  private requestId: string;
  
  constructor() {
    this.requestId = Math.random().toString(36).substring(2, 15);
    console.log(`创建UserService实例，请求ID: ${this.requestId}`);
  }
  
  getRequestId() {
    return this.requestId;
  }
}
```

## 配置管理

NestJS提供了`@nestjs/config`模块，用于管理应用程序的配置。

### 安装配置模块

```bash
npm install --save @nestjs/config
```

### 基本配置

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 全局可用
      envFilePath: ['.env', '.env.development', '.env.production'], // 环境变量文件
      ignoreEnvFile: process.env.NODE_ENV === 'production', // 在生产环境中忽略.env文件
      expandVariables: true, // 允许变量扩展
    }),
  ],
})
export class AppModule {}
```

### 使用配置服务

```typescript
// src/modules/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(private readonly configService: ConfigService) {}
  
  getDatabaseUrl() {
    // 获取配置值
    return this.configService.get<string>('DATABASE_URL');
  }
  
  getApiKey() {
    // 使用默认值
    return this.configService.get<string>('API_KEY', 'default-api-key');
  }
  
  // 获取嵌套配置
  getJwtSecret() {
    return this.configService.get<string>('JWT.SECRET');
  }
}
```

### 验证配置

```typescript
// src/config/schema.ts
import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION: Joi.string().default('1h'),
});
```

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      validationOptions: {
        abortEarly: true, // 一旦验证失败立即停止
      },
    }),
  ],
})
export class AppModule {}
```

## 数据库集成

NestJS可以与各种数据库集成，包括关系型数据库和NoSQL数据库。下面以MongoDB和PostgreSQL为例。

### MongoDB集成

#### 安装依赖

```bash
npm install --save mongoose @nestjs/mongoose
```

#### 配置模块

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

#### 创建模型

```typescript
// src/modules/user/user.schema.ts
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema() // Schema装饰器
@Schema({ timestamps: true }) // 添加时间戳
export class User extends Document {
  @Prop({ required: true }) // 属性装饰器
  name: string;

  @Prop({ required: true, unique: true }) // 唯一索引
  email: string;

  @Prop({ default: false }) // 默认值
  isActive: boolean;
}

// 创建模式
export const UserSchema = SchemaFactory.createForClass(User);

// 添加索引
UserSchema.index({ email: 1 });
```

#### 使用模型

```typescript
// src/modules/user/user.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
```

```typescript
// src/modules/user/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { CreateUserDto, UpdateUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
```

### PostgreSQL集成

#### 安装依赖

```bash
npm install --save @nestjs/typeorm typeorm pg
```

#### 配置模块

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './modules/user/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User], // 实体列表
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE', false), // 生产环境应设为false
        logging: configService.get<string>('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

#### 创建实体

```typescript
// src/modules/user/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity() // 实体装饰器
export class User {
  @PrimaryGeneratedColumn('uuid') // 主键
  id: string;

  @Column({ nullable: false }) // 列
  name: string;

  @Column({ unique: true, nullable: false }) // 唯一约束
  email: string;

  @Column({ default: false }) // 默认值
  isActive: boolean;

  @CreateDateColumn() // 创建时间
  createdAt: Date;

  @UpdateDateColumn() // 更新时间
  updatedAt: Date;
}
```

#### 使用实体

```typescript
// src/modules/user/user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // 注册实体
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
```

```typescript
// src/modules/user/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
```

## 认证与授权

NestJS提供了多种方式实现认证和授权，下面介绍使用JWT进行认证的方法。

### 安装依赖

```bash
npm install --save @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
```

### 配置JWT模块

```typescript
// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from '../modules/user/user.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION', '1h'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

### 创建JWT策略

```typescript
// src/auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../modules/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    // 验证token中的用户信息
    const user = await this.userService.findOne(payload.sub);
    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }
    return user; // 返回的对象会被添加到请求对象中
  }
}
```

### 创建认证服务

```typescript
// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../modules/user/user.service';
import { LoginDto } from './dto/login.dto';

export interface JwtPayload {
  sub: string; // 用户ID
  username: string;
  // 可以添加更多字段
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      // 不返回密码
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('邮箱或密码不正确');
    }

    // 创建JWT载荷
    const payload: JwtPayload = {
      sub: user.id,
      username: user.name,
    };

    // 生成token
    return {
      access_token: this.jwtService.sign(payload),
      expires_in: 3600, // 过期时间（秒）
      token_type: 'Bearer',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async register(createUserDto): Promise<any> {
    // 检查邮箱是否已存在
    const existingUser = await this.userService.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new UnauthorizedException('该邮箱已被注册');
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // 创建用户
    const user = await this.userService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    // 不返回密码
    const { password, ...result } = user;
    return result;
  }
}
```

### 创建认证控制器

```typescript
// src/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(AuthGuard('jwt')) // 使用JWT守卫
  @Get('profile')
  async getProfile(@Request() req) {
    return req.user; // 从请求中获取用户信息
  }
}
```

### 使用角色守卫

```typescript
// src/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super-admin',
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 获取路由上的角色
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    // 如果没有指定角色，允许访问
    if (!requiredRoles) {
      return true;
    }

    // 获取用户角色
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // 检查用户是否拥有所需角色
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
```

```typescript
// src/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { Role } from '../guards/roles.guard';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
```

```typescript
// src/modules/user/user.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../decorators/roles.decorator';
import { RolesGuard } from '../../guards/roles.guard';
import { Role } from '../../guards/roles.guard';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard) // 使用认证和角色守卫
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(Role.ADMIN) // 只允许管理员访问
  findAll() {
    return this.userService.findAll();
  }
}
```

## 测试

NestJS内置了测试支持，提供了模块化的测试工具，使测试变得简单而高效。

### 单元测试

#### 测试服务

```typescript
// src/modules/user/user.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './user.schema';

const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com' };

const mockUserModel = {
  find: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue([mockUser]),
  }),
  findById: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(mockUser),
  }),
  create: jest.fn().mockImplementation((user) => ({ ...user, save: jest.fn().mockResolvedValue(user) })),
  findByIdAndUpdate: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(mockUser),
  }),
  findByIdAndDelete: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(mockUser),
  }),
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockUser]);
      expect(mockUserModel.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual(mockUser);
      expect(mockUserModel.findById).toHaveBeenCalledWith('1');
    });
  });

  // 其他方法的测试...
});
```

#### 测试控制器

```typescript
// src/modules/user/user.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';

const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com' };

const mockUserService = {
  findAll: jest.fn().mockResolvedValue([mockUser]),
  findOne: jest.fn().mockResolvedValue(mockUser),
  create: jest.fn().mockImplementation((dto) => ({ ...dto, id: '1' })),
  update: jest.fn().mockImplementation((id, dto) => ({ ...mockUser, ...dto, id })),
  remove: jest.fn().mockResolvedValue(undefined),
};

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockUser]);
      expect(mockUserService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const result = await controller.findOne('1');
      expect(result).toEqual(mockUser);
      expect(mockUserService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Jane Smith',
        email: 'jane@example.com',
      };
      const result = await controller.create(createUserDto);
      expect(result).toEqual({ ...createUserDto, id: '1' });
      expect(mockUserService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  // 其他方法的测试...
});
```

### 集成测试

```typescript
// test/app.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  // API端点测试
  describe('Users API', () => {
    it('should create a new user', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'Test User',
          email: 'test@example.com',
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body.name).toBe('Test User');
          expect(response.body.email).toBe('test@example.com');
        });
    });

    it('should get all users', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBeTruthy();
        });
    });

    // 其他端点的测试...
  });
});
```

## 微服务

NestJS提供了对微服务架构的内置支持，可以轻松创建各种类型的微服务，如TCP、Redis、MQTT等。

### 创建微服务

```typescript
// src/main.ts - 微服务入口
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  // 创建TCP微服务
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 8877,
    },
  });

  await app.listen();
  console.log('微服务已启动');
}

bootstrap();
```

### 微服务控制器

```typescript
// src/modules/user/user.controller.ts
import { Controller, Get, MessagePattern, Payload } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 微服务消息处理
  @MessagePattern('getAllUsers') // 消息模式
  async getAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @MessagePattern('getUserById')
  async getUserById(@Payload() data: { id: string }): Promise<User> {
    return this.userService.findOne(data.id);
  }

  @MessagePattern('createUser')
  async createUser(@Payload() userData: any): Promise<User> {
    return this.userService.create(userData);
  }
}
```

### 微服务客户端

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE', // 客户端名称
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 8877,
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

```typescript
// src/app.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { User } from './modules/user/user.dto';

@Injectable()
export class AppService {
  constructor(@Inject('USER_SERVICE') private readonly client: ClientProxy) {}

  getUsers(): Observable<User[]> {
    return this.client.send('getAllUsers', {});
  }

  getUserById(id: string): Observable<User> {
    return this.client.send('getUserById', { id });
  }

  createUser(userData): Observable<User> {
    return this.client.send('createUser', userData);
  }
}
```

### 消息队列集成

#### Redis微服务

```typescript
// src/main.ts - Redis微服务
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.REDIS,
    options: {
      url: 'redis://localhost:6379',
    },
  });

  await app.listen();
  console.log('Redis微服务已启动');
}

bootstrap();
```

#### RabbitMQ微服务

```typescript
// src/main.ts - RabbitMQ微服务
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'user_queue',
      queueOptions: {
        durable: false,
      },
    },
  });

  await app.listen();
  console.log('RabbitMQ微服务已启动');
}

bootstrap();
```

## 部署

### 构建生产版本

```bash
# 构建生产版本
npm run build

# 启动生产应用
npm run start:prod
```

### Docker容器化

#### Dockerfile

```dockerfile
# 使用Node.js官方镜像作为构建环境
FROM node:16-alpine AS builder

# 创建工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 使用Node.js官方镜像作为运行环境
FROM node:16-alpine

# 创建工作目录
WORKDIR /app

# 复制构建产物
COPY --from=builder /app/dist ./dist

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装生产依赖
RUN npm ci --only=production

# 暴露端口
EXPOSE 3000

# 设置环境变量
ENV NODE_ENV=production

# 启动应用
CMD ["node", "dist/main"]
```

#### docker-compose.yml

```yaml
version: '3'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/nest
    depends_on:
      - mongo

  mongo:
    image: mongo:4.4
    volumes:
      - mongo-data:/data/db
    ports:
      - "27017:27017"

volumes:
  mongo-data:
```

### Kubernetes部署

#### deployment.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nestjs-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nestjs-app
  template:
    metadata:
      labels:
        app: nestjs-app
    spec:
      containers:
      - name: nestjs-app
        image: your-registry/nestjs-app:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: MONGODB_URI
          value: "mongodb://mongo:27017/nest"
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 10
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 15
          periodSeconds: 20
```

#### service.yaml

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nestjs-app
spec:
  selector:
    app: nestjs-app
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
```

## 最佳实践

### 项目结构

遵循NestJS推荐的项目结构，保持代码组织清晰：

```
src/
├── app.module.ts           # 根模块
├── main.ts                 # 应用入口
├── modules/                # 业务模块
│   ├── user/               # 用户模块
│   │   ├── dto/            # 数据传输对象
│   │   ├── entities/       # 实体
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   └── user.module.ts
│   └── auth/               # 认证模块
├── common/                 # 共享组件
│   ├── guards/             # 守卫
│   ├── filters/            # 过滤器
│   ├── pipes/              # 管道
│   ├── interceptors/       # 拦截器
│   ├── decorators/         # 装饰器
│   └── utils/              # 工具函数
├── config/                 # 配置文件
└── database/               # 数据库相关
    ├── migrations/         # 迁移文件
    └── seeds/              # 种子数据
```

### 命名约定

1. **类命名**：使用PascalCase，例如`UserService`、`AuthController`
2. **方法命名**：使用camelCase，例如`findAll()`、`createUser()`
3. **变量命名**：使用camelCase，例如`userRepository`、`configService`
4. **文件命名**：使用kebab-case，例如`user.service.ts`、`auth.module.ts`
5. **模块命名**：使用kebab-case，例如`user`、`auth`

### 错误处理

1. **统一异常处理**：实现全局异常过滤器，统一处理所有异常
2. **自定义异常类**：创建应用特定的异常类，便于区分不同类型的错误
3. **详细错误信息**：提供有用的错误消息，但避免泄露敏感信息
4. **日志记录**：记录所有异常，便于调试和监控

```typescript
// src/common/exceptions/http.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class ResourceNotFoundException extends HttpException {
  constructor(resource: string, id: string | number) {
    super(`${resource} with ID ${id} not found`, HttpStatus.NOT_FOUND);
  }
}

export class ValidationException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message?: string) {
    super(message || 'Unauthorized', HttpStatus.UNAUTHORIZED);
  }
}
```

### 安全性

1. **输入验证**：使用管道验证所有用户输入
2. **参数清理**：防止SQL注入和XSS攻击
3. **认证与授权**：实现适当的认证和授权机制
4. **HTTPS**：在生产环境中使用HTTPS
5. **敏感数据保护**：加密存储敏感数据，如密码、个人信息等
6. **CORS配置**：正确配置CORS策略
7. **安全HTTP头**：使用helmet库设置安全HTTP头

### 性能优化

1. **懒加载模块**：对于大型应用，使用动态模块加载
2. **数据库索引**：为常用查询字段添加索引
3. **缓存**：使用缓存减少数据库查询
4. **连接池**：使用数据库连接池管理数据库连接
5. **异步操作**：使用异步操作提高并发性能
6. **请求限流**：防止过多请求导致服务过载
7. **CDN**：使用CDN分发静态资源
8. **代码分割**：减少初始加载时间

### 日志记录

1. **结构化日志**：使用结构化日志格式，便于分析
2. **多级别日志**：区分debug、info、warn、error等日志级别
3. **上下文信息**：记录请求ID、用户ID等上下文信息
4. **日志轮转**：设置日志文件大小限制，定期轮转
5. **日志聚合**：使用ELK等工具聚合和分析日志

```typescript
// src/common/logger/logger.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class LoggerService extends Logger {
  log(message: any, context?: string) {
    super.log(message, context);
  }

  error(message: any, trace?: string, context?: string) {
    super.error(message, trace, context);
  }

  warn(message: any, context?: string) {
    super.warn(message, context);
  }

  debug(message: any, context?: string) {
    super.debug(message, context);
  }

  verbose(message: any, context?: string) {
    super.verbose(message, context);
  }

  // 带请求上下文的日志
  logRequest(message: any, request: Request, context?: string) {
    const requestId = request.headers['x-request-id'] || Math.random().toString(36).substring(2, 15);
    const userId = request.user?.id || 'anonymous';
    
    super.log(
      `${message} | Request ID: ${requestId} | User ID: ${userId} | ${request.method} ${request.url}`,
      context
    );
  }
}
```

### 文档

1. **API文档**：使用Swagger自动生成API文档
2. **代码注释**：为所有公共API和复杂逻辑添加注释
3. **架构文档**：记录系统架构、模块划分和交互关系
4. **开发指南**：提供本地开发、测试和部署指南
5. **贡献指南**：定义代码风格、提交规范和PR流程

```typescript
// src/main.ts - 集成Swagger
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 配置Swagger
  const config = new DocumentBuilder()
    .setTitle('API文档')
    .setDescription('系统API接口文档')
    .setVersion('1.0')
    .addTag('api')
    .addBearerAuth() // 添加JWT认证
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
}
bootstrap();
```

```typescript
// src/modules/user/user.controller.ts - Swagger注释
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('用户管理') // API标签
@ApiBearerAuth() // 需要认证
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '获取所有用户', description: '获取系统中的所有用户列表，支持分页' })
  @ApiResponse({ status: 200, description: '成功获取用户列表' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiQuery({ name: 'page', description: '页码', required: false, default: 1 })
  @ApiQuery({ name: 'limit', description: '每页数量', required: false, default: 10 })
  @Get()
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.userService.findAll(page, limit);
  }

  @ApiOperation({ summary: '获取单个用户', description: '根据用户ID获取用户信息' })
  @ApiResponse({ status: 200, description: '成功获取用户信息' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  @ApiParam({ name: 'id', description: '用户ID', required: true })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  // 其他方法的Swagger注释...
}
```

## 常见问题

### 1. 如何处理全局异常？

使用NestJS的异常过滤器可以统一处理所有异常：

```typescript
// src/filters/all-exceptions.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    
    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: exception instanceof HttpException ? exception.message : 'Internal Server Error',
      });
  }
}
```

然后在`main.ts`中全局应用该过滤器：

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(3000);
}
bootstrap();
```

### 2. 如何处理数据库事务？

#### MongoDB事务

```typescript
// src/modules/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  async createUserWithHistory(userData) {
    // 开始事务
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      // 创建用户
      const user = new this.userModel(userData);
      await user.save({ session });

      // 创建历史记录
      await this.connection.collection('user_history').insertOne(
        { userId: user._id, action: 'create', timestamp: new Date() },
        { session }
      );

      // 提交事务
      await session.commitTransaction();
      return user;
    } catch (error) {
      // 回滚事务
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
```

#### TypeORM事务

```typescript
// src/modules/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserHistory } from '../history/user-history.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserHistory) private userHistoryRepository: Repository<UserHistory>,
  ) {}

  async createUserWithHistory(userData) {
    // 使用事务管理器
    return this.userRepository.manager.transaction(async (manager) => {
      // 创建用户
      const user = manager.create(User, userData);
      await manager.save(user);

      // 创建历史记录
      const history = manager.create(UserHistory, {
        userId: user.id,
        action: 'create',
        timestamp: new Date(),
      });
      await manager.save(history);

      return user;
    });
  }
}
```

### 3. 如何实现定时任务？

使用`@nestjs/schedule`模块实现定时任务：

```bash
npm install --save @nestjs/schedule
```

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
})
export class AppModule {}
```

```typescript
// src/tasks/tasks.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  // 每分钟执行一次
  @Cron('* * * * *')
  handleCron() {
    this.logger.debug('执行定时任务 - 每分钟');
  }

  // 每5秒执行一次
  @Interval(5000)
  handleInterval() {
    this.logger.debug('执行定时任务 - 每5秒');
  }

  // 应用启动后10秒执行一次
  @Timeout(10000)
  handleTimeout() {
    this.logger.debug('执行定时任务 - 应用启动后10秒');
  }

  // 自定义Cron表达式 - 每天凌晨1点执行
  @Cron('0 1 * * *')
  async handleDailyTask() {
    this.logger.debug('执行每日任务');
    // 执行任务逻辑
  }
}
```

### 4. 如何实现文件上传？

#### 基本文件上传

```typescript
// src/modules/upload/upload.controller.ts
import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          callback(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
      },
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(new Error('只允许上传图片文件!'), false);
        }
        callback(null, true);
      },
    }),
  )
  uploadFile(@UploadedFile() file) {
    return {
      filename: file.filename,
      path: `/uploads/${file.filename}`,
      size: file.size,
    };
  }
}
```

#### 多文件上传

```typescript
// src/modules/upload/upload.controller.ts
import { Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  @Post('multiple')
  @UseInterceptors(
    FilesInterceptor('files', 10, { // 最多上传10个文件
      // 配置与单个文件上传相同
    }),
  )
  uploadMultipleFiles(@UploadedFiles() files) {
    return files.map(file => ({
      filename: file.filename,
      path: `/uploads/${file.filename}`,
      size: file.size,
    }));
  }
}
```

### 5. 如何配置CORS？

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 基本CORS配置
  app.enableCors();
  
  // 自定义CORS配置
  app.enableCors({
    origin: ['http://localhost:3000', 'https://example.com'], // 允许的源
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 允许的方法
    allowedHeaders: ['Origin', 'Content-Type', 'Accept', 'Authorization'], // 允许的头
    credentials: true, // 允许携带凭证
    preflightContinue: false, // 不继续处理预检请求
    optionsSuccessStatus: 204, // 预检请求成功状态码
  });
  
  await app.listen(3000);
}
bootstrap();
```

### 6. 如何实现国际化？

使用`class-transformer`和`@nestjs/i18n`模块实现国际化：

```bash
npm install --save @nestjs/i18n
```

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { I18nModule } from '@nestjs/i18n';
import * as path from 'path';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
    }),
  ],
})
export class AppModule {}
```

创建语言文件：

```json
// src/i18n/en/translation.json
{
  "greeting": "Hello",
  "welcome": "Welcome to our application",
  "error": {
    "not_found": "Resource not found",
    "unauthorized": "Unauthorized access"
  }
}
```

```json
// src/i18n/zh/translation.json
{
  "greeting": "你好",
  "welcome": "欢迎使用我们的应用",
  "error": {
    "not_found": "资源未找到",
    "unauthorized": "未授权访问"
  }
}
```

使用翻译服务：

```typescript
// src/modules/user/user.controller.ts
import { Controller, Get, Inject } from '@nestjs/common';
import { I18nService } from '@nestjs/i18n';

@Controller('users')
export class UserController {
  constructor(private readonly i18n: I18nService) {}

  @Get('greeting')
  async getGreeting(@I18n() i18n) {
    return {
      greeting: await i18n.translate('translation.greeting'),
      welcome: await i18n.translate('translation.welcome'),
    };
  }

  @Get('error')
  async getError(@I18n() i18n) {
    return {
      message: await i18n.translate('translation.error.not_found', {
        args: { resource: 'User' },
      }),
    };
  }
}
```

### 7. 如何进行API版本控制？

#### URI路径版本控制

```typescript
// src/modules/v1/user/user.controller.ts
@Controller('v1/users')
export class UserV1Controller {
  // V1版本的API实现
}

// src/modules/v2/user/user.controller.ts
@Controller('v2/users')
export class UserV2Controller {
  // V2版本的API实现
}

// src/app.module.ts
import { Module } from '@nestjs/common';
import { UserV1Controller } from './modules/v1/user/user.controller';
import { UserV2Controller } from './modules/v2/user/user.controller';

@Module({
  controllers: [UserV1Controller, UserV2Controller],
})
export class AppModule {}
```

#### 自定义装饰器版本控制

```typescript
// src/common/decorators/api-version.decorator.ts
import { applyDecorators, Controller } from '@nestjs/common';

export function ApiVersion(version: string) {
  return applyDecorators(Controller(`v${version}`));
}

// src/common/decorators/controller-version.decorator.ts
import { applyDecorators, Controller } from '@nestjs/common';

export function VersionedController(basePath: string, versions: string[]) {
  return applyDecorators(Controller(versions.map(v => `v${v}/${basePath}`)));
}
```

```typescript
// src/modules/user/user.controller.ts
import { ApiVersion, VersionedController } from '../../common/decorators/api-version.decorator';

@ApiVersion('1') // 单个版本
@Controller('users')
export class UserV1Controller {
  // V1版本实现
}

@VersionedController('users', ['2', '3']) // 多个版本
@Controller('users')
export class UserV2V3Controller {
  // V2和V3版本实现
}
```

### 8. 如何处理WebSocket连接？

使用`@nestjs/websockets`模块实现WebSocket：

```bash
npm install --save @nestjs/websockets @nestjs/platform-socket.io
```

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [ChatModule],
})
export class AppModule {}
```

```typescript
// src/modules/chat/chat.module.ts
import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';

@Module({
  providers: [ChatGateway],
})
export class ChatModule {}
```

```typescript
// src/modules/chat/chat.gateway.ts
import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private clients: Socket[] = [];

  // 连接处理
  handleConnection(client: Socket) {
    this.clients.push(client);
    console.log(`客户端连接: ${client.id}`);
  }

  // 断开连接处理
  handleDisconnect(client: Socket) {
    this.clients = this.clients.filter(c => c.id !== client.id);
    console.log(`客户端断开连接: ${client.id}`);
  }

  // 订阅消息
  @SubscribeMessage('sendMessage')
  handleMessage(@MessageBody() data: { message: string; sender: string }, @ConnectedSocket() client: Socket) {
    console.log(`收到消息: ${data.message} 从 ${data.sender}`);
    
    // 广播消息给所有客户端
    this.clients.forEach(c => {
      c.emit('newMessage', {
        message: data.message,
        sender: data.sender,
        timestamp: new Date(),
      });
    });
    
    // 返回确认消息给发送者
    return { success: true, message: '消息已发送' };
  }
}
```

## 总结

NestJS是一个功能强大的Node.js框架，提供了完整的开发体验和架构支持。通过本指南，您应该已经掌握了NestJS的核心概念、API设计模式和最佳实践。在实际项目中，您可以根据需求灵活运用这些知识，构建高效、可维护的后端服务。

NestJS的生态系统不断发展，新的模块和工具不断涌现。为了保持技术先进性，建议定期查看官方文档和社区动态，学习新特性和最佳实践。祝您使用NestJS开发顺利！