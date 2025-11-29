# NestJS 服务

## 1. 服务基础概念

在 NestJS 中，服务（Services）是实现业务逻辑的核心组件，它们通常被注入到控制器（Controllers）中使用。服务是用 `@Injectable()` 装饰器标记的类，遵循依赖注入模式，可以被其他组件消费。

### 1.1 服务的作用

- **业务逻辑封装**：将业务逻辑从控制器中分离出来，使控制器保持轻量
- **代码复用**：可以在多个控制器或其他服务中重用业务逻辑
- **可测试性**：更容易编写单元测试，因为逻辑被封装在独立的类中
- **依赖管理**：通过依赖注入系统管理服务之间的依赖关系

## 2. 创建基础服务

### 2.1 使用 Nest CLI 创建服务

```bash
# 生成服务
nest generate service users
# 或者简写
nest g s users
```

### 2.2 手动创建服务

创建一个服务文件，并使用 `@Injectable()` 装饰器装饰它：

```typescript
// users.service.ts
import { Injectable } from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  create(user: User) {
    this.users.push(user);
    return user;
  }

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User {
    return this.users.find(user => user.id === id);
  }

  update(id: string, updatedUser: User) {
    const index = this.users.findIndex(user => user.id === id);
    if (index >= 0) {
      this.users[index] = { ...this.users[index], ...updatedUser };
      return this.users[index];
    }
    return null;
  }

  remove(id: string): boolean {
    const index = this.users.findIndex(user => user.id === id);
    if (index >= 0) {
      this.users.splice(index, 1);
      return true;
    }
    return false;
  }
}
```

## 3. 在控制器中使用服务

服务可以通过构造函数注入到控制器中：

```typescript
// users.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() user: User) {
    return this.usersService.create(user);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() user: User) {
    return this.usersService.update(id, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
```

## 4. 服务注入和依赖管理

### 4.1 构造函数注入

NestJS 使用构造函数注入作为默认的依赖注入方式：

```typescript
@Injectable()
export class UsersService {
  constructor(
    private authService: AuthService,
    private databaseService: DatabaseService,
    private loggerService: LoggerService,
  ) {}
  
  // 使用注入的服务
  async registerUser(userData) {
    this.loggerService.log('Registering new user');
    const hashedPassword = await this.authService.hashPassword(userData.password);
    return await this.databaseService.saveUser({
      ...userData,
      password: hashedPassword,
    });
  }
}
```

### 4.2 字段注入（不推荐）

虽然 NestJS 支持字段注入，但构造函数注入是推荐的方式，因为它使依赖更加明确，且更容易测试：

```typescript
@Injectable()
export class UsersService {
  @Inject(AuthService)
  private authService: AuthService;
  
  // 不推荐使用这种方式
}
```

### 4.3 自定义提供者令牌

可以使用自定义令牌来注入服务：

```typescript
// 1. 定义令牌
const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

// 2. 在模块中配置自定义提供者
@Module({
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useValue: getDatabaseConnection(),
    },
    UsersService,
  ],
})
export class AppModule {}

// 3. 在服务中注入自定义提供者
@Injectable()
export class UsersService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private dbConnection,
  ) {}
}
```

## 5. 服务作用域

NestJS 提供了三种服务作用域：

### 5.1 单例作用域（默认）

单例作用域是 NestJS 的默认作用域，意味着在应用程序的整个生命周期中，只会创建一个服务实例：

```typescript
@Injectable() // 默认是单例
// 或者显式指定
@Injectable({ scope: Scope.DEFAULT })
export class UsersService {
  private counter = 0;
  
  incrementCounter() {
    return ++this.counter;
  }
}
```

### 5.2 请求作用域

使用请求作用域，每次 HTTP 请求都会创建一个新的服务实例：

```typescript
import { Injectable, Scope, Request } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class RequestScopedService {
  constructor(@Request() private request) {
    console.log(`创建了一个新的请求作用域服务实例，请求路径: ${request.path}`);
  }
  
  getRequestInfo() {
    return {
      path: this.request.path,
      method: this.request.method,
      // 其他请求信息
    };
  }
}
```

### 5.3 瞬态作用域

使用瞬态作用域，每次注入时都会创建一个新的服务实例：

```typescript
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class TransientScopedService {
  private instanceId = Math.random().toString(36).substr(2, 9);
  
  getInstanceId() {
    return this.instanceId;
  }
}
```

## 6. 服务生命周期钩子

NestJS 提供了一系列生命周期钩子，可以在服务的不同生命周期阶段执行特定的代码：

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';

@Injectable()
export class DatabaseService implements 
  OnModuleInit, 
  OnApplicationBootstrap,
  OnModuleDestroy,
  OnApplicationShutdown {
  
  // 模块初始化时调用
  async onModuleInit() {
    console.log('模块初始化时连接数据库');
    // await this.connectToDatabase();
  }
  
  // 应用程序启动后调用
  async onApplicationBootstrap() {
    console.log('应用程序启动后初始化数据库连接池');
    // await this.initializeConnectionPool();
  }
  
  // 模块销毁时调用
  async onModuleDestroy() {
    console.log('模块销毁时关闭数据库连接');
    // await this.closeDatabaseConnection();
  }
  
  // 应用程序关闭时调用
  async onApplicationShutdown(signal?: string) {
    console.log(`应用程序关闭(${signal})时清理数据库资源`);
    // await this.cleanupResources();
  }
}
```

## 7. 异步提供者

对于需要异步初始化的服务，可以使用异步提供者：

```typescript
@Module({
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async () => {
        const connection = await createConnection();
        return connection;
      },
    },
    UsersService,
  ],
})
export class AppModule {}
```

在服务中使用异步提供者：

```typescript
@Injectable()
export class UsersService {
  constructor(
    @Inject('DATABASE_CONNECTION')
    private dbConnection,
  ) {}
  
  async findAll() {
    return await this.dbConnection.collection('users').find().toArray();
  }
}
```

## 8. 工厂提供者

工厂提供者允许更复杂的服务创建逻辑：

```typescript
@Module({
  providers: [
    ConfigService,
    {
      provide: 'API_SERVICE',
      useFactory: (configService: ConfigService) => {
        const apiUrl = configService.get('API_URL');
        const apiKey = configService.get('API_KEY');
        return new ApiService(apiUrl, apiKey);
      },
      inject: [ConfigService],
    },
    UsersService,
  ],
})
export class AppModule {}
```

## 9. 服务继承与组合

### 9.1 服务继承

可以创建基础服务类，并在其他服务中继承它：

```typescript
// base.service.ts
@Injectable()
export class BaseService<T> {
  protected repository: Repository<T>;
  
  constructor(repository: Repository<T>) {
    this.repository = repository;
  }
  
  async findAll(): Promise<T[]> {
    return await this.repository.find();
  }
  
  async findOne(id: string): Promise<T> {
    return await this.repository.findOne(id);
  }
  
  async create(data: Partial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }
  
  async update(id: string, data: Partial<T>): Promise<T> {
    await this.repository.update(id, data);
    return await this.repository.findOne(id);
  }
  
  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}

// users.service.ts
@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private authService: AuthService,
  ) {
    super(usersRepository);
  }
  
  // 添加特定于用户的方法
  async registerUser(userData: CreateUserDto): Promise<User> {
    // 密码哈希处理
    userData.password = await this.authService.hashPassword(userData.password);
    
    // 使用父类的 create 方法
    return await this.create(userData);
  }
}
```

### 9.2 服务组合

可以将多个服务组合在一起，形成更复杂的功能：

```typescript
@Injectable()
export class OrderService {
  constructor(
    private userService: UserService,
    private productService: ProductService,
    private paymentService: PaymentService,
    private notificationService: NotificationService,
  ) {}
  
  async createOrder(userId: string, orderItems: OrderItemDto[]) {
    // 1. 验证用户
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    // 2. 验证产品和计算总价
    let totalPrice = 0;
    const products = [];
    
    for (const item of orderItems) {
      const product = await this.productService.findById(item.productId);
      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found`);
      }
      
      if (product.stock < item.quantity) {
        throw new BadRequestException(`Insufficient stock for ${product.name}`);
      }
      
      totalPrice += product.price * item.quantity;
      products.push(product);
    }
    
    // 3. 处理支付
    const paymentResult = await this.paymentService.processPayment({
      userId,
      amount: totalPrice,
      description: `Order for ${orderItems.length} items`,
    });
    
    // 4. 创建订单
    const order = {
      userId,
      items: orderItems,
      totalPrice,
      status: 'completed',
      paymentId: paymentResult.id,
      createdAt: new Date(),
    };
    
    // 5. 更新产品库存
    await this.productService.updateStock(orderItems);
    
    // 6. 发送通知
    await this.notificationService.sendOrderConfirmation(user.email, order);
    
    return order;
  }
}
```

## 10. 事务管理

对于需要确保多个操作原子性的场景，可以使用事务：

```typescript
@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}
  
  async createOrderWithTransaction(orderData: CreateOrderDto) {
    // 使用事务
    return await this.orderRepository.manager.transaction(async entityManager => {
      // 1. 创建订单
      const order = entityManager.create(Order, orderData);
      await entityManager.save(order);
      
      // 2. 更新产品库存
      for (const item of orderData.items) {
        const product = await entityManager.findOne(Product, item.productId);
        if (!product) {
          throw new NotFoundException(`Product ${item.productId} not found`);
        }
        
        if (product.stock < item.quantity) {
          throw new BadRequestException(`Insufficient stock for ${product.name}`);
        }
        
        product.stock -= item.quantity;
        await entityManager.save(product);
      }
      
      return order;
    });
  }
}
```

## 11. 错误处理

### 11.1 自定义错误类

创建自定义错误类，提供更具体的错误信息：

```typescript
export class ServiceError extends Error {
  constructor(
    public message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: any,
  ) {
    super(message);
    this.name = 'ServiceError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

@Injectable()
export class UsersService {
  async findOne(id: string) {
    const user = this.users.find(user => user.id === id);
    if (!user) {
      throw new ServiceError('User not found', 'USER_NOT_FOUND', 404, { userId: id });
    }
    return user;
  }
}
```

### 11.2 在控制器中捕获服务错误

```typescript
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.usersService.findOne(id);
    } catch (error) {
      if (error instanceof ServiceError) {
        throw new HttpException(
          { message: error.message, code: error.code, details: error.details },
          error.statusCode,
        );
      }
      throw new InternalServerErrorException('Internal server error');
    }
  }
}
```

## 12. 缓存策略

为了提高性能，可以在服务中实现缓存策略：

```typescript
@Injectable()
export class CachingService {
  private cache = new Map<string, { value: any, expiry: number }>();
  
  get(key: string): any {
    const item = this.cache.get(key);
    if (!item) return null;
    
    // 检查是否过期
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }
  
  set(key: string, value: any, ttl: number = 3600000): void {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { value, expiry });
  }
  
  delete(key: string): void {
    this.cache.delete(key);
  }
}

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private cachingService: CachingService,
  ) {}
  
  async findAll() {
    // 尝试从缓存获取
    const cacheKey = 'products:all';
    const cachedProducts = this.cachingService.get(cacheKey);
    
    if (cachedProducts) {
      return cachedProducts;
    }
    
    // 从数据库获取
    const products = await this.productRepository.find();
    
    // 设置缓存，有效期5分钟
    this.cachingService.set(cacheKey, products, 5 * 60 * 1000);
    
    return products;
  }
  
  async findOne(id: string) {
    // 尝试从缓存获取
    const cacheKey = `product:${id}`;
    const cachedProduct = this.cachingService.get(cacheKey);
    
    if (cachedProduct) {
      return cachedProduct;
    }
    
    // 从数据库获取
    const product = await this.productRepository.findOne(id);
    
    if (product) {
      // 设置缓存，有效期10分钟
      this.cachingService.set(cacheKey, product, 10 * 60 * 1000);
    }
    
    return product;
  }
}
```

## 13. 服务测试

### 13.1 单元测试服务

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userData = { name: 'Test User', email: 'test@example.com' };
      const savedUser = { id: '1', ...userData };
      
      jest.spyOn(repository, 'create').mockReturnValue(userData as User);
      jest.spyOn(repository, 'save').mockResolvedValue(savedUser as User);
      
      const result = await service.create(userData);
      
      expect(result).toEqual(savedUser);
      expect(repository.create).toHaveBeenCalledWith(userData);
      expect(repository.save).toHaveBeenCalledWith(userData);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [{ id: '1', name: 'Test User 1' }, { id: '2', name: 'Test User 2' }];
      
      jest.spyOn(repository, 'find').mockResolvedValue(users as User[]);
      
      const result = await service.findAll();
      
      expect(result).toEqual(users);
      expect(repository.find).toHaveBeenCalled();
    });
  });
});
```

### 13.2 模拟依赖服务

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { PaymentService } from '../payment/payment.service';
import { NotificationService } from '../notification/notification.service';

describe('OrderService', () => {
  let service: OrderService;
  let mockPaymentService: jest.Mocked<PaymentService>;
  let mockNotificationService: jest.Mocked<NotificationService>;

  beforeEach(async () => {
    mockPaymentService = {
      processPayment: jest.fn(),
    } as any;

    mockNotificationService = {
      sendOrderConfirmation: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: PaymentService,
          useValue: mockPaymentService,
        },
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should create an order and process payment', async () => {
    const orderData = {
      userId: '1',
      items: [{ productId: '1', quantity: 2 }],
    };

    const paymentResult = { id: 'pay_123', status: 'success' };
    mockPaymentService.processPayment.mockResolvedValue(paymentResult);
    mockNotificationService.sendOrderConfirmation.mockResolvedValue(true);

    const result = await service.createOrder(orderData.userId, orderData.items);

    expect(result).toBeDefined();
    expect(mockPaymentService.processPayment).toHaveBeenCalled();
    expect(mockNotificationService.sendOrderConfirmation).toHaveBeenCalled();
  });
});
```

## 14. 服务最佳实践

### 14.1 单一职责原则

每个服务应该有明确的单一职责，避免服务过于庞大：

```typescript
// 好的做法：专注于用户管理的服务
@Injectable()
export class UserService {
  // 只包含用户相关的逻辑
}

// 好的做法：专注于认证的服务
@Injectable()
export class AuthService {
  // 只包含认证相关的逻辑
}

// 不好的做法：混合了多个职责的服务
@Injectable()
export class UserManagementService {
  // 混合了用户管理、认证、通知等多种逻辑
}
```

### 14.2 可测试性设计

设计服务时考虑可测试性，避免紧耦合：

```typescript
// 良好设计的服务，使用依赖注入
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private emailService: EmailService,
  ) {}
  
  // 方法逻辑清晰，依赖明确
}

// 难以测试的服务，使用硬编码依赖
@Injectable()
export class UserService {
  private userRepository = new UserRepository(); // 硬编码依赖
  private emailService = new EmailService(); // 硬编码依赖
  
  // 难以替换依赖进行测试
}
```

### 14.3 异步操作处理

使用 async/await 进行异步操作，避免回调地狱：

```typescript
// 好的做法：使用 async/await
@Injectable()
export class UserService {
  async createUser(userData) {
    try {
      const user = await this.repository.save(userData);
      await this.emailService.sendWelcomeEmail(user.email);
      return user;
    } catch (error) {
      this.logger.error('Failed to create user', error);
      throw new ServiceError('Failed to create user', 'USER_CREATION_FAILED');
    }
  }
}

// 不好的做法：使用回调
@Injectable()
export class UserService {
  createUser(userData, callback) {
    this.repository.save(userData, (error, user) => {
      if (error) {
        return callback(error);
      }
      this.emailService.sendWelcomeEmail(user.email, (error) => {
        if (error) {
          return callback(error);
        }
        callback(null, user);
      });
    });
  }
}
```

### 14.4 日志记录

在服务中添加适当的日志记录，便于调试和监控：

```typescript
@Injectable()
export class OrderService {
  constructor(
    private readonly logger: Logger,
    private readonly paymentService: PaymentService,
  ) {}
  
  async createOrder(orderData) {
    this.logger.log(`Creating order for user ${orderData.userId}`);
    
    try {
      // 订单创建逻辑
      
      this.logger.log(`Order ${orderData.id} created successfully`);
      return orderData;
    } catch (error) {
      this.logger.error(`Failed to create order`, error.stack);
      throw error;
    }
  }
}
```

## 15. 参考资源

- [NestJS 提供者官方文档](https://docs.nestjs.com/providers)
- [NestJS 依赖注入官方文档](https://docs.nestjs.com/fundamentals/custom-providers)
- [NestJS 作用域官方文档](https://docs.nestjs.com/fundamentals/injection-scopes)
- [NestJS 异步提供者官方文档](https://docs.nestjs.com/fundamentals/async-providers)