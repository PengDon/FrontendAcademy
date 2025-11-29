# NestJS 控制器

## 1. 控制器基础

控制器是 NestJS 应用程序的核心组件之一，负责处理传入的 HTTP 请求并返回响应。控制器通过装饰器来定义路由和处理逻辑，使 API 路由的定义变得简洁明了。

### 1.1 控制器的作用

- 处理 HTTP 请求（GET、POST、PUT、DELETE 等）
- 路由定义和请求分发
- 请求参数的提取和验证
- 返回适当的 HTTP 响应
- 与服务层交互获取业务逻辑结果

## 2. 创建控制器

在 NestJS 中，有两种主要方式创建控制器：

### 2.1 使用 Nest CLI 创建

```bash
# 生成带测试文件的控制器
nest generate controller users

# 生成不带测试文件的控制器
nest generate controller users --no-spec
```

### 2.2 手动创建控制器

创建一个控制器类，使用 `@Controller()` 装饰器进行装饰：

```typescript
import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  findAll(): string {
    return '返回所有用户';
  }
}
```

## 3. 基本路由

### 3.1 路由前缀

`@Controller()` 装饰器接受一个可选的前缀字符串，该前缀将应用于控制器中的所有路由：

```typescript
@Controller('api/v1/users')
export class UsersController {
  @Get() // 实际路由为 GET /api/v1/users
  findAll(): string {
    return '返回所有用户';
  }
  
  @Post() // 实际路由为 POST /api/v1/users
  create(): string {
    return '创建新用户';
  }
}
```

### 3.2 HTTP 方法装饰器

NestJS 提供了一组装饰器用于定义不同的 HTTP 方法：

```typescript
import { Controller, Get, Post, Put, Delete, Patch, Options, Head } from '@nestjs/common';

@Controller('items')
export class ItemsController {
  @Get() // GET /items
  findAll() {}

  @Post() // POST /items
  create() {}

  @Put(':id') // PUT /items/:id
  update() {}

  @Patch(':id') // PATCH /items/:id
  updatePartial() {}

  @Delete(':id') // DELETE /items/:id
  remove() {}

  @Options() // OPTIONS /items
  options() {}

  @Head() // HEAD /items
  head() {}
}
```

## 4. 请求对象处理

### 4.1 访问请求对象

可以使用 `@Request()` 或 `@Req()` 装饰器访问底层 HTTP 请求对象：

```typescript
import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(@Req() request: Request): string {
    console.log(request.headers);
    console.log(request.query);
    return '返回所有猫';
  }
}
```

### 4.2 请求参数装饰器

NestJS 提供了多个装饰器来提取请求的不同部分：

```typescript
import { Controller, Get, Post, Body, Param, Query, Headers, Ip, HostParam } from '@nestjs/common';

@Controller('products')
export class ProductsController {
  // 获取请求体
  @Post()
  create(@Body() productData: any) {
    return { created: true, data: productData };
  }

  // 获取特定请求体属性
  @Post('validate')
  validate(@Body('name') name: string) {
    return { validated: true, name };
  }

  // 获取路由参数
  @Get(':id')
  findOne(@Param('id') id: string) {
    return `产品 ID: ${id}`;
  }

  // 获取所有路由参数
  @Get(':category/:id')
  findByCategory(@Param() params: any) {
    return `分类: ${params.category}, 产品 ID: ${params.id}`;
  }

  // 获取查询参数
  @Get()
  findAll(
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0
  ) {
    return `限制: ${limit}, 偏移: ${offset}`;
  }

  // 获取请求头
  @Get('headers')
  getHeaders(@Headers() headers: any) {
    return headers;
  }

  // 获取特定请求头
  @Get('auth')
  getAuthHeader(@Headers('authorization') auth: string) {
    return { auth };
  }

  // 获取客户端 IP
  @Get('client-ip')
  getClientIp(@Ip() ip: string) {
    return { ip };
  }

  // 获取主机参数（用于虚拟主机路由）
  @Get()
  getHost(@HostParam('version') version: string) {
    return { version };
  }
}
```

### 4.3 响应对象处理

虽然 NestJS 会自动处理响应，但有时需要直接访问响应对象：

```typescript
import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Controller('responses')
export class ResponsesController {
  @Get()
  customResponse(@Res() response: Response) {
    response
      .status(HttpStatus.OK)
      .set('Cache-Control', 'none')
      .json({
        message: '自定义响应',
        status: 'success'
      });
  }
}
```

> 注意：使用 `@Res()` 装饰器时，你将失去 NestJS 响应处理的自动化特性。如果你想保持自动化处理，同时仍然能够使用响应对象，可以使用 `@Res({ passthrough: true })`。

## 5. 路由参数与请求数据验证

### 5.1 DTO (数据传输对象) 模式

使用 DTO 来定义 API 请求和响应的数据结构，并进行验证：

```typescript
// dto/create-user.dto.ts
import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  bio?: string;
}
```

在控制器中使用 DTO：

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return { created: true, user: createUserDto };
  }
}
```

### 5.2 启用请求验证

在应用程序中启用全局验证管道：

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 启用请求验证
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // 移除没有装饰器的属性
    forbidNonWhitelisted: true, // 对于非白名单属性抛出错误
    transform: true, // 自动转换类型
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));
  
  await app.listen(3000);
}
bootstrap();
```

## 6. 控制器与依赖注入

控制器通常依赖于服务来处理业务逻辑。NestJS 使用依赖注入模式来管理这种依赖关系：

```typescript
import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

export class UsersController {
  // 依赖注入 UsersService
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
```

## 7. 路由重定向

可以在控制器中实现路由重定向：

```typescript
import { Controller, Get, Redirect } from '@nestjs/common';

@Controller('redirects')
export class RedirectsController {
  @Get('docs')
  @Redirect('https://docs.nestjs.com', 302)
  getDocs() {
    // 可以根据条件动态更改重定向
  }

  @Get('google')
  @Redirect('https://google.com', 301) // 永久重定向
  redirectToGoogle() {}

  @Get('conditional')
  @Redirect('https://default.com', 302)
  redirectConditional(@Query('version') version: string) {
    if (version === '5') {
      return { url: 'https://v5-docs.nestjs.com' };
    }
  }
}
```

## 8. 嵌套路由

NestJS 支持嵌套路由，通过在控制器中定义子路径来实现：

```typescript
import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get() // GET /users
  findAllUsers() {}

  @Get(':id') // GET /users/:id
  findUser(@Param('id') id: string) {}

  @Get(':id/posts') // GET /users/:id/posts
  findUserPosts(@Param('id') userId: string) {}
}
```

更好的做法是使用模块和子控制器来组织嵌套路由：

```typescript
// users/users.controller.ts
@Controller('users')
export class UsersController {}

// users/posts/posts.controller.ts
@Controller('users/:userId/posts')
export class UserPostsController {}
```

## 9. 异步控制器方法

NestJS 支持异步控制器方法，可以使用 `async/await` 语法：

```typescript
import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return { success: true, data: user };
  }

  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return {
      total: users.length,
      data: users
    };
  }
}
```

控制器方法也可以返回 Observable：

```typescript
import { Controller, Get } from '@nestjs/common';
import { Observable, of } from 'rxjs';

@Controller('observables')
export class ObservablesController {
  @Get()
  findAll(): Observable<any[]> {
    return of([1, 2, 3, 4, 5]);
  }
}
```

## 10. 控制器与 HTTP 状态码

### 10.1 默认状态码

NestJS 默认的状态码：
- GET 请求：200
- POST 请求：201
- PUT 请求：200
- DELETE 请求：200

### 10.2 自定义状态码

可以使用 `@HttpCode()` 装饰器来设置自定义状态码：

```typescript
import { Controller, Get, HttpCode } from '@nestjs/common';

@Controller('status')
export class StatusController {
  @Get('ok')
  @HttpCode(200)
  getOk() {
    return { status: 'OK' };
  }

  @Get('no-content')
  @HttpCode(204)
  getNoContent() {
    // 204 响应不应该有响应体
  }

  @Get('created')
  @HttpCode(201)
  getCreated() {
    return { created: true };
  }

  @Get('error')
  @HttpCode(400)
  getError() {
    return { error: 'Bad Request' };
  }
}
```

## 11. 控制器与响应头

可以使用 `@Header()` 装饰器来设置响应头：

```typescript
import { Controller, Get, Header } from '@nestjs/common';

@Controller('headers')
export class HeadersController {
  @Get()
  @Header('Cache-Control', 'none')
  @Header('X-Custom-Header', 'custom-value')
  findAll() {
    return { data: [1, 2, 3] };
  }

  @Get('pdf')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename=document.pdf')
  getPdf() {
    // 返回 PDF 数据流
  }
}
```

## 12. 文件上传

### 12.1 单文件上传

```typescript
import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('upload')
export class UploadController {
  @Post('single')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/single',
        filename: (req, file, cb) => {
          // 生成唯一文件名
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadSingleFile(@UploadedFile() file: Express.Multer.File) {
    return {
      originalname: file.originalname,
      filename: file.filename,
      path: file.path,
    };
  }
}
```

### 12.2 多文件上传

```typescript
import { Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('upload')
export class UploadController {
  @Post('multiple')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads/multiple',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadMultipleFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    return files.map(file => ({
      originalname: file.originalname,
      filename: file.filename,
      path: file.path,
    }));
  }
}
```

## 13. 控制器测试

### 13.1 单元测试

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(['user1', 'user2']),
            findOne: jest.fn().mockImplementation((id) => Promise.resolve({ id, name: `User ${id}` })),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all users', async () => {
    expect(await controller.findAll()).toEqual(['user1', 'user2']);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a single user', async () => {
    const result = await controller.findOne('1');
    expect(result).toEqual({ id: '1', name: 'User 1' });
    expect(service.findOne).toHaveBeenCalledWith('1');
  });
});
```

### 13.2 集成测试

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(['user1', 'user2']),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect(['user1', 'user2']);
  });
});
```

## 14. 控制器最佳实践

### 14.1 职责分离

- 控制器应该只负责处理 HTTP 请求和响应
- 业务逻辑应该委托给服务层
- 验证逻辑应该在 DTO 和管道中处理

### 14.2 代码组织

- 为每个资源创建单独的控制器
- 使用 DTO 来定义请求和响应的数据结构
- 为复杂的控制器使用路由分组

### 14.3 错误处理

- 使用统一的错误处理机制
- 返回适当的 HTTP 状态码
- 提供有用的错误信息

### 14.4 性能考虑

- 避免在控制器中进行复杂的计算
- 考虑使用缓存来提高性能
- 优化响应大小

## 15. 高级路由技巧

### 15.1 路由通配符

```typescript
import { Controller, Get, Request } from '@nestjs/common';

@Controller('wildcards')
export class WildcardsController {
  @Get('ab*cd')
  findAll(@Request() req) {
    return { path: req.path };
  }
}
```

### 15.2 虚拟主机路由

```typescript
import { Controller, Get, HostParam } from '@nestjs/common';

@Controller({
  path: 'users',
  host: ':version.api.example.com',
})
export class UsersController {
  @Get()
  index(@HostParam('version') version: string) {
    return `当前版本: ${version}`;
  }
}
```

## 16. 参考资源

- [NestJS 控制器官方文档](https://docs.nestjs.com/controllers)
- [Express 请求对象](https://expressjs.com/zh-cn/api.html#req)
- [Express 响应对象](https://expressjs.com/zh-cn/api.html#res)
- [class-validator](https://github.com/typestack/class-validator)