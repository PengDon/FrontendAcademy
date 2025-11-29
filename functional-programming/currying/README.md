# 函数柯里化 (Currying)

## 什么是函数柯里化

函数柯里化是一种将接受多个参数的函数转换为一系列使用一个参数的函数的技术。它是函数式编程中的重要概念，由逻辑学家 Haskell Curry 提出，因此得名。

柯里化的基本思想是：将一个形如 `f(a, b, c)` 的函数，转换为可以通过 `f(a)(b)(c)` 这样的链式调用方式调用的形式。每次调用返回一个新函数，该函数接受下一个参数，直到所有参数都被收集完毕，然后执行原始函数的逻辑并返回结果。

## 核心概念

1. **单参数函数链**：将多参数函数分解为一系列单参数函数
2. **闭包**：利用闭包保存中间状态（已传入的参数）
3. **部分应用**：允许提前绑定部分参数，创建专用函数
4. **函数组合**：更容易与其他函数式编程概念如函数组合结合使用

## 基本实现

### JavaScript实现

#### 1. 手动柯里化

```javascript
// 手动柯里化一个三参数函数
function curryAdd(a) {
  return function(b) {
    return function(c) {
      return a + b + c;
    };
  };
}

// 使用柯里化函数
const result1 = curryAdd(1)(2)(3); // 6

// 也可以部分应用
const add5 = curryAdd(5);
const add5And10 = add5(10);
const result2 = add5And10(15); // 30

console.log(result1); // 6
console.log(result2); // 30
```

#### 2. 通用柯里化函数

```javascript
// 创建一个通用的柯里化函数
function curry(fn) {
  // 获取原始函数的参数数量
  const arity = fn.length;
  
  // 内部柯里化函数，使用闭包保存已收集的参数
  function curried(...args) {
    // 如果收集的参数数量达到原始函数的参数数量，执行原始函数
    if (args.length >= arity) {
      return fn.apply(this, args);
    }
    
    // 否则，返回一个新函数，继续收集参数
    return function(...moreArgs) {
      // 递归调用，合并已收集的参数和新参数
      return curried.apply(this, [...args, ...moreArgs]);
    };
  }
  
  return curried;
}

// 测试通用柯里化函数
function add(a, b, c) {
  return a + b + c;
}

function multiply(a, b, c, d) {
  return a * b * c * d;
}

const curriedAdd = curry(add);
const curriedMultiply = curry(multiply);

// 测试不同的调用方式
console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6
console.log(curriedAdd(1)(2, 3)); // 6
console.log(curriedAdd(1, 2, 3)); // 6

console.log(curriedMultiply(2)(3)(4)(5)); // 120
console.log(curriedMultiply(2, 3)(4, 5)); // 120
```

#### 3. 无限柯里化

```javascript
// 实现无限柯里化 - 直到调用时不传参数才执行计算
function infiniteCurry(operation, initialValue) {
  let accumulator = initialValue;
  
  function curried(nextValue) {
    // 如果没有提供参数，返回当前计算结果
    if (nextValue === undefined) {
      return accumulator;
    }
    
    // 否则，更新累加器并返回函数本身
    accumulator = operation(accumulator, nextValue);
    return curried;
  }
  
  return curried;
}

// 测试无限柯里化
const sum = infiniteCurry((a, b) => a + b, 0);
const product = infiniteCurry((a, b) => a * b, 1);

console.log(sum(1)(2)(3)(4)(5)()); // 15
console.log(product(2)(3)(4)(5)()); // 120

// 也可以这样使用
const addTen = sum(10);
console.log(addTen(20)(30)()); // 60
```

### TypeScript实现

```typescript
// TypeScript实现通用柯里化函数
function curry<T extends any[], R>(fn: (...args: T) => R): CurriedFn<T, R> {
  // 定义递归的柯里化类型
  type CurriedFn<T extends any[], R> = T extends [infer A, ...infer B]
    ? (arg: A) => CurriedFn<B, R>
    : R;
  
  // 获取原始函数的参数数量
  const arity = fn.length;
  
  // 内部柯里化函数实现
  function curried(...args: any[]): any {
    if (args.length >= arity) {
      return fn(...args);
    }
    
    return function(...moreArgs: any[]): any {
      return curried(...args, ...moreArgs);
    };
  }
  
  return curried as CurriedFn<T, R>;
}

// 测试TypeScript柯里化函数
function add(a: number, b: number, c: number): number {
  return a + b + c;
}

function greet(name: string, greeting: string): string {
  return `${greeting}, ${name}!`;
}

const curriedAdd = curry(add);
const curriedGreet = curry(greet);

// TypeScript会提供类型提示
const result1 = curriedAdd(1)(2)(3); // 6
const helloJohn = curriedGreet('John')('Hello'); // "Hello, John!"

// 泛型柯里化示例
interface User {
  id: number;
  name: string;
  age: number;
}

function createUser(id: number, name: string, age: number): User {
  return { id, name, age };
}

const curriedCreateUser = curry(createUser);
const createAdminUser = curriedCreateUser(1); // 预设ID为1的管理员
const admin = createAdminUser('Admin')(30); // { id: 1, name: 'Admin', age: 30 }
```

## 柯里化的变体

### 1. 参数收集柯里化

```javascript
// 参数收集柯里化 - 允许一次传递多个参数，直到达到原始函数的参数数量
function collectCurry(fn) {
  const arity = fn.length;
  
  return function curried(...args) {
    // 如果参数数量足够，执行原始函数
    if (args.length >= arity) {
      return fn(...args);
    }
    
    // 否则返回新函数，继续收集参数
    return function(...moreArgs) {
      // 递归调用，合并参数
      return curried(...args, ...moreArgs);
    };
  };
}

// 测试参数收集柯里化
function concat(a, b, c, d) {
  return a + b + c + d;
}

const curriedConcat = collectCurry(concat);

console.log(curriedConcat('a')('b')('c')('d')); // 'abcd'
console.log(curriedConcat('a', 'b')('c', 'd')); // 'abcd'
console.log(curriedConcat('a')('b', 'c', 'd')); // 'abcd'
```

### 2. 占位符柯里化

```javascript
// 支持占位符的柯里化函数
function curryWithPlaceholder(fn, placeholder = '_') {
  const arity = fn.length;
  
  // 收集参数并处理占位符
  function collectArgs(collected, args) {
    let result = [...collected];
    
    // 处理新的参数
    for (let i = 0; i < args.length; i++) {
      if (args[i] !== placeholder) {
        // 查找第一个占位符的位置
        const placeholderIndex = result.findIndex(arg => arg === placeholder);
        if (placeholderIndex !== -1) {
          // 替换占位符
          result[placeholderIndex] = args[i];
        } else {
          // 添加到末尾
          result.push(args[i]);
        }
      } else {
        // 添加占位符
        result.push(args[i]);
      }
    }
    
    return result;
  }
  
  function curried(...args) {
    // 收集参数，处理占位符
    const collectedArgs = collectArgs([], args);
    
    // 检查是否有足够的非占位符参数
    const validArgs = collectedArgs.filter(arg => arg !== placeholder);
    
    // 如果参数数量足够，执行原始函数
    if (validArgs.length >= arity) {
      // 移除占位符，仅使用有效参数
      return fn(...collectedArgs.filter(arg => arg !== placeholder).slice(0, arity));
    }
    
    // 否则返回新函数
    return function(...moreArgs) {
      return curried(...collectArgs(collectedArgs, moreArgs));
    };
  }
  
  return curried;
}

// 测试占位符柯里化
function format(name, age, city) {
  return `${name} is ${age} years old and lives in ${city}.`;
}

const curriedFormat = curryWithPlaceholder(format);

// 正常柯里化调用
console.log(curriedFormat('John')(30)('New York')); // 'John is 30 years old and lives in New York.'

// 使用占位符跳过后续参数
const greetJohn = curriedFormat('John')('_')('Boston');
console.log(greetJohn(25)); // 'John is 25 years old and lives in Boston.'

// 先指定中间参数
const personInParis = curriedFormat('_')(28)('Paris');
console.log(personInParis('Alice')); // 'Alice is 28 years old and lives in Paris.'
```

### 3. 函数式库中的柯里化

```javascript
// 模拟Ramda.js的柯里化实现
const R = {
  curry: function(fn) {
    return function curried(...args) {
      if (args.length >= fn.length) {
        return fn.apply(this, args);
      }
      return function(...moreArgs) {
        return curried.apply(this, [...args, ...moreArgs]);
      };
    };
  },
  
  // 自动柯里化，不限制参数顺序
  curryN: function(n, fn) {
    return function curried(...args) {
      if (args.length >= n) {
        return fn.apply(this, args);
      }
      return function(...moreArgs) {
        return curried.apply(this, [...args, ...moreArgs]);
      };
    };
  }
};

// 使用模拟的Ramda柯里化
const add = R.curry(function(a, b, c) {
  return a + b + c;
});

console.log(add(1)(2)(3)); // 6
console.log(add(1, 2)(3)); // 6
console.log(add(1)(2, 3)); // 6

// 使用curryN指定参数数量
const sum = R.curryN(3, function() {
  return Array.from(arguments).reduce((acc, val) => acc + val, 0);
});

console.log(sum(1)(2)(3)); // 6
```

## 应用场景

### 1. 部分应用函数

柯里化允许我们提前绑定部分参数，创建专用函数：

```javascript
// 部分应用示例
function sendNotification(type, userId, message) {
  console.log(`[${type}] To user ${userId}: ${message}`);
}

const curriedSendNotification = curry(sendNotification);

// 创建专用通知函数
const sendEmail = curriedSendNotification('EMAIL');
const sendSms = curriedSendNotification('SMS');
const sendPush = curriedSendNotification('PUSH');

// 进一步部分应用用户ID
const notifyUser123 = sendEmail(123);

// 使用专用函数
notifyUser123('Your account has been verified');
// 输出: [EMAIL] To user 123: Your account has been verified

sendSms(456, 'Your verification code is 123456');
// 输出: [SMS] To user 456: Your verification code is 123456
```

### 2. 函数组合

柯里化与函数组合结合使用，可以创建更灵活的数据流：

```javascript
// 函数组合与柯里化结合
function compose(...fns) {
  return fns.reduce((f, g) => (...args) => f(g(...args)));
}

// 柯里化的工具函数
const map = curry(function(fn, arr) {
  return arr.map(fn);
});

const filter = curry(function(predicate, arr) {
  return arr.filter(predicate);
});

const reduce = curry(function(fn, initialValue, arr) {
  return arr.reduce(fn, initialValue);
});

// 创建数据处理管道
const processData = compose(
  map(x => x * 2),
  filter(x => x % 2 === 0),
  map(x => x + 1)
);

const result = processData([1, 2, 3, 4, 5]);
console.log(result); // [4, 6, 10]
// 处理过程: [1,2,3,4,5] -> [2,3,4,5,6] -> [2,4,6] -> [4,8,12]

// 计算总和
const sum = reduce((acc, x) => acc + x, 0);
const total = sum([1, 2, 3, 4, 5]);
console.log(total); // 15
```

### 3. 配置与重用

柯里化可用于创建可配置的函数工厂：

```javascript
// 函数工厂示例
function createValidator(regex, errorMessage) {
  return function(value) {
    const isValid = regex.test(value);
    return {
      isValid,
      error: isValid ? null : errorMessage
    };
  };
}

// 创建各种验证器
const validateEmail = createValidator(
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  'Invalid email format'
);

const validatePassword = createValidator(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  'Password must be at least 8 characters and include uppercase, lowercase and number'
);

const validateUsername = createValidator(
  /^[a-zA-Z0-9_]{3,16}$/,
  'Username must be 3-16 characters and contain only letters, numbers or underscores'
);

// 使用验证器
console.log(validateEmail('user@example.com'));
// { isValid: true, error: null }

console.log(validateEmail('invalid-email'));
// { isValid: false, error: 'Invalid email format' }

console.log(validatePassword('Password123'));
// { isValid: true, error: null }
```

### 4. 事件处理

在前端开发中，柯里化可用于创建更灵活的事件处理函数：

```javascript
// 柯里化在事件处理中的应用
function createEventHandler(action, data) {
  return function(event) {
    console.log(`Action: ${action}`);
    console.log(`Data:`, data);
    console.log(`Event:`, event.type);
    // 实际应用中可以执行API调用、状态更新等
  };
}

// 创建各种事件处理器
const handleSave = createEventHandler('SAVE', { modified: true });
const handleDelete = createEventHandler('DELETE', { confirm: false });
const handleUpdate = createEventHandler('UPDATE', { partial: true });

// 模拟事件触发
console.log('--- Testing save handler ---');
handleSave({ type: 'click' });

console.log('\n--- Testing delete handler ---');
handleDelete({ type: 'click' });

// 在真实DOM环境中，会这样使用：
// document.getElementById('saveBtn').addEventListener('click', handleSave);
// document.getElementById('deleteBtn').addEventListener('click', handleDelete);
```

### 5. API请求构建

柯里化可用于构建灵活的API请求函数：

```javascript
// API请求构建示例
function createApiClient(baseUrl) {
  return function(endpoint) {
    return function(method) {
      return function(data = null) {
        const url = `${baseUrl}${endpoint}`;
        console.log(`Making ${method} request to ${url}`);
        
        if (data) {
          console.log('Request data:', data);
        }
        
        // 实际应用中会执行fetch或axios请求
        // 这里只是模拟返回
        return Promise.resolve({
          success: true,
          message: 'Request completed',
          url,
          method,
          data
        });
      };
    };
  };
}

// 创建API客户端
const api = createApiClient('https://api.example.com');

// 创建端点特定的函数
const usersApi = api('/users');
const productsApi = api('/products');

// 创建方法特定的函数
const getUsers = usersApi('GET');
const createUser = usersApi('POST');
const updateProduct = productsApi('PUT');

// 使用API函数
console.log('--- Fetching users ---');
getUsers().then(response => console.log(response));

console.log('\n--- Creating user ---');
createUser({
  name: 'John Doe',
  email: 'john@example.com'
}).then(response => console.log(response));
```

## 柯里化的优缺点

### 优点

1. **函数复用**：可以通过部分应用创建专用函数，提高代码复用性
2. **函数组合**：更容易与函数组合结合使用，创建数据流处理管道
3. **灵活性**：提供了更灵活的函数调用方式，可以根据需要提供参数
4. **闭包应用**：是闭包概念的典型应用，有助于理解函数式编程
5. **参数预设**：可以预设一些参数，减少重复代码
6. **代码简洁**：合理使用可以使代码更加简洁、声明式

### 缺点

1. **性能开销**：每次柯里化调用都会创建新函数，可能带来性能开销
2. **可读性问题**：过度使用柯里化可能导致代码难以理解和调试
3. **学习曲线**：对于不熟悉函数式编程的开发者来说，柯里化可能难以理解
4. **内存使用**：闭包会保持对外部变量的引用，可能导致内存使用增加
5. **调试困难**：链式调用的柯里化函数在调试时可能难以跟踪状态

## 与其他函数式编程概念的关系

### 柯里化 vs 部分应用

- **柯里化**：将多参数函数转换为一系列单参数函数的技术
- **部分应用**：固定函数的部分参数，返回一个接受剩余参数的新函数

柯里化可以实现部分应用，但部分应用不一定需要完整的柯里化。柯里化关注的是将函数分解为单参数函数链，而部分应用关注的是固定某些参数。

```javascript
// 部分应用示例（非柯里化方式）
function partialApply(fn, ...fixedArgs) {
  return function(...remainingArgs) {
    return fn(...fixedArgs, ...remainingArgs);
  };
}

function add(a, b, c) {
  return a + b + c;
}

// 部分应用 - 固定前两个参数
const add5And10 = partialApply(add, 5, 10);
console.log(add5And10(15)); // 30

// 柯里化
const curriedAdd = curry(add);
const alsoAdd5And10 = curriedAdd(5)(10);
console.log(alsoAdd5And10(15)); // 30
```

### 柯里化 vs 函数组合

柯里化和函数组合是函数式编程中相辅相成的概念：

- 柯里化让函数更容易被组合，因为它将多参数函数转换为单参数函数
- 函数组合可以将多个柯里化函数连接起来，形成数据处理管道

```javascript
// 柯里化与函数组合结合
const compose = (...fns) => x => fns.reduceRight((acc, fn) => fn(acc), x);

// 柯里化的工具函数
const multiply = curry((a, b) => a * b);
const add = curry((a, b) => a + b);
const subtract = curry((a, b) => a - b);

// 创建复合函数 - 计算 (x + 10) * 2 - 5
const processNumber = compose(
  subtract(5),
  multiply(2),
  add(10)
);

console.log(processNumber(5)); // ((5 + 10) * 2) - 5 = 25
console.log(processNumber(10)); // ((10 + 10) * 2) - 5 = 35
```

### 柯里化 vs 高阶函数

- **高阶函数**：接受函数作为参数或返回函数的函数
- **柯里化**：是高阶函数的一种特殊应用，它返回一系列接受单个参数的函数

所有柯里化函数都是高阶函数，但不是所有高阶函数都是柯里化的。

## 实际应用案例

### 1. 表单验证系统

```javascript
// 柯里化实现的表单验证系统
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function(...moreArgs) {
      return curried.apply(this, [...args, ...moreArgs]);
    };
  };
}

// 基础验证函数
const isRequired = value => value !== undefined && value !== null && value !== '';
const isMinLength = curry((min, value) => String(value).length >= min);
const isMaxLength = curry((max, value) => String(value).length <= max);
const matchesPattern = curry((pattern, value) => pattern.test(value));
const isEmail = matchesPattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
const isNumber = value => !isNaN(Number(value)) && isFinite(value);
const isGreaterThan = curry((min, value) => Number(value) > min);
const isLessThan = curry((max, value) => Number(value) < max);

// 组合验证规则
function validateWithRules(value, ...validators) {
  const errors = [];
  
  for (const [validator, errorMessage] of validators) {
    if (!validator(value)) {
      errors.push(errorMessage);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

const validateWithRulesCurried = curry(validateWithRules);

// 创建字段验证器
const validateUsername = validateWithRulesCurried(
  null,
  [isRequired, 'Username is required'],
  [isMinLength(3), 'Username must be at least 3 characters'],
  [isMaxLength(20), 'Username must be at most 20 characters'],
  [matchesPattern(/^[a-zA-Z0-9_]+$/), 'Username can only contain letters, numbers, and underscores']
);

const validateEmailField = validateWithRulesCurried(
  null,
  [isRequired, 'Email is required'],
  [isEmail, 'Invalid email format']
);

const validatePassword = validateWithRulesCurried(
  null,
  [isRequired, 'Password is required'],
  [isMinLength(8), 'Password must be at least 8 characters'],
  [matchesPattern(/[A-Z]/), 'Password must contain at least one uppercase letter'],
  [matchesPattern(/[a-z]/), 'Password must contain at least one lowercase letter'],
  [matchesPattern(/[0-9]/), 'Password must contain at least one number']
);

// 测试验证器
console.log('--- Username Validation ---');
console.log(validateUsername('john')); // { isValid: true, errors: [] }
console.log(validateUsername('j')); // { isValid: false, errors: ['Username must be at least 3 characters'] }

console.log('\n--- Email Validation ---');
console.log(validateEmailField('john@example.com')); // { isValid: true, errors: [] }
console.log(validateEmailField('invalid-email')); // { isValid: false, errors: ['Invalid email format'] }

console.log('\n--- Password Validation ---');
console.log(validatePassword('Password123')); // { isValid: true, errors: [] }
console.log(validatePassword('password')); // { isValid: false, errors: ['Password must contain at least one number', 'Password must contain at least one uppercase letter'] }
```

### 2. 响应式数据转换

```javascript
// 响应式数据转换管道
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function(...moreArgs) {
      return curried.apply(this, [...args, ...moreArgs]);
    };
  };
}

// 数据转换函数
const map = curry((fn, data) => Array.isArray(data) ? data.map(fn) : data);
const filter = curry((predicate, data) => Array.isArray(data) ? data.filter(predicate) : data);
const reduce = curry((fn, initialValue, data) => Array.isArray(data) ? data.reduce(fn, initialValue) : initialValue);
const pluck = curry((key, data) => map(item => item[key], data));
const groupBy = curry((key, data) => {
  return reduce((acc, item) => {
    const group = item[key];
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(item);
    return acc;
  }, {}, data);
});

// 创建数据处理管道
function pipe(...fns) {
  return function(data) {
    return fns.reduce((acc, fn) => fn(acc), data);
  };
}

// 示例数据
const users = [
  { id: 1, name: 'John', age: 25, department: 'HR', salary: 50000 },
  { id: 2, name: 'Alice', age: 30, department: 'Engineering', salary: 80000 },
  { id: 3, name: 'Bob', age: 35, department: 'Engineering', salary: 90000 },
  { id: 4, name: 'Eve', age: 28, department: 'Marketing', salary: 60000 },
  { id: 5, name: 'Charlie', age: 40, department: 'Engineering', salary: 100000 },
  { id: 6, name: 'David', age: 22, department: 'HR', salary: 45000 }
];

// 创建数据处理函数
const getEngineeringDepartment = filter(user => user.department === 'Engineering');
const getHighEarners = filter(user => user.salary > 70000);
const getNames = pluck('name');
const groupByDepartment = groupBy('department');
const getAverageSalary = reduce((acc, user, index, array) => {
  acc += user.salary;
  return index === array.length - 1 ? acc / array.length : acc;
}, 0);

// 组合数据处理函数
const getEngineeringNames = pipe(
  getEngineeringDepartment,
  getNames
);

const getHighEarningEngineers = pipe(
  getEngineeringDepartment,
  getHighEarners,
  map(user => ({ ...user, bonus: user.salary * 0.1 }))
);

const getAverageSalaryByDepartment = pipe(
  groupByDepartment,
  map(employees => ({
    department: employees[0].department,
    averageSalary: getAverageSalary(employees),
    count: employees.length
  }))
);

// 使用数据处理函数
console.log('--- Engineering Department Names ---');
console.log(getEngineeringNames(users)); // ['Alice', 'Bob', 'Charlie']

console.log('\n--- High Earning Engineers with Bonus ---');
console.log(getHighEarningEngineers(users));
// [
//   { id: 2, name: 'Alice', age: 30, department: 'Engineering', salary: 80000, bonus: 8000 },
//   { id: 3, name: 'Bob', age: 35, department: 'Engineering', salary: 90000, bonus: 9000 },
//   { id: 5, name: 'Charlie', age: 40, department: 'Engineering', salary: 100000, bonus: 10000 }
// ]

console.log('\n--- Average Salary by Department ---');
console.log(getAverageSalaryByDepartment(users));
// [
//   { department: 'HR', averageSalary: 47500, count: 2 },
//   { department: 'Engineering', averageSalary: 90000, count: 3 },
//   { department: 'Marketing', averageSalary: 60000, count: 1 }
// ]
```

### 3. 条件格式化器

```javascript
// 柯里化实现的条件格式化器
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function(...moreArgs) {
      return curried.apply(this, [...args, ...moreArgs]);
    };
  };
}

// 格式化函数
const formatCurrency = curry((currency, value) => {
  const symbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥'
  };
  
  const symbol = symbols[currency] || currency;
  return `${symbol}${Number(value).toFixed(2)}`;
});

const formatDate = curry((format, date) => {
  const d = new Date(date);
  
  if (format === 'YYYY-MM-DD') {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  } else if (format === 'DD/MM/YYYY') {
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  } else if (format === 'MMM D, YYYY') {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  }
  
  return d.toString();
});

const formatNumber = curry((options, value) => {
  const {
    decimals = 2,
    thousandsSeparator = ',',
    decimalSeparator = '.'
  } = options;
  
  const num = Number(value);
  if (isNaN(num)) return value;
  
  const parts = num.toFixed(decimals).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
  
  return parts.join(decimalSeparator);
});

const conditionalFormat = curry((condition, trueFormat, falseFormat, value) => {
  return condition(value) ? trueFormat(value) : falseFormat(value);
});

// 创建特定的格式化器
const formatUSD = formatCurrency('USD');
const formatEUR = formatCurrency('EUR');
const formatISODate = formatDate('YYYY-MM-DD');
const formatShortDate = formatDate('DD/MM/YYYY');
const formatLargeNumber = formatNumber({ decimals: 0, thousandsSeparator: ',' });
const formatPercentage = formatNumber({ decimals: 2, suffix: '%' });

// 创建条件格式化器
const formatPrice = conditionalFormat(
  price => price > 1000,
  formatLargeNumber,
  value => value.toFixed(2)
);

const formatImportantDate = conditionalFormat(
  date => new Date(date) > new Date(),
  date => `${formatISODate(date)} (Future)`,
  date => `${formatISODate(date)} (Past)`
);

// 测试格式化器
console.log('--- Currency Formatting ---');
console.log(formatUSD(1234.56)); // $1234.56
console.log(formatEUR(1234.56)); // €1234.56

console.log('\n--- Date Formatting ---');
console.log(formatISODate('2023-05-15')); // 2023-05-15
console.log(formatShortDate('2023-05-15')); // 15/05/2023

console.log('\n--- Number Formatting ---');
console.log(formatLargeNumber(1234567.89)); // 1,234,568

console.log('\n--- Conditional Formatting ---');
console.log(formatPrice(500)); // 500.00
console.log(formatPrice(1500)); // 1,500

console.log(formatImportantDate('2023-12-25')); // 2023-12-25 (Past)
console.log(formatImportantDate('2100-01-01')); // 2100-01-01 (Future)
```

## 输入输出示例

#### 输入输出示例 1: 基本柯里化

```javascript
// 基本柯里化示例
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return function(...moreArgs) {
      return curried(...args, ...moreArgs);
    };
  };
}

// 原始函数
function fullName(firstName, lastName) {
  return `${firstName} ${lastName}`;
}

// 柯里化后的函数
const curriedFullName = curry(fullName);

// 调用方式1: 全部参数一次传递
console.log(curriedFullName('John', 'Doe'));

// 调用方式2: 分别传递参数
console.log(curriedFullName('Jane')('Smith'));

// 创建部分应用函数
const greetJohn = curriedFullName('John');
console.log(greetJohn('Johnson'));
console.log(greetJohn('Williams'));
```

输出：
```
John Doe
Jane Smith
John Johnson
John Williams
```

#### 输入输出示例 2: 多参数函数柯里化

```javascript
// 多参数函数柯里化
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return function(...moreArgs) {
      return curried(...args, ...moreArgs);
    };
  };
}

// 三参数函数
function volume(length, width, height) {
  return length * width * height;
}

// 柯里化
const curriedVolume = curry(volume);

// 各种调用方式
console.log(curriedVolume(2)(3)(4)); // 24
console.log(curriedVolume(2, 3)(4)); // 24
console.log(curriedVolume(2)(3, 4)); // 24

// 创建预配置函数
const cubeCalculator = curriedVolume(5)(5); // 预设长宽为5
console.log(cubeCalculator(10)); // 250 (5 × 5 × 10)
console.log(cubeCalculator(20)); // 500 (5 × 5 × 20)
```

输出：
```
24
24
24
250
500
```

#### 输入输出示例 3: 柯里化与函数组合

```javascript
// 柯里化与函数组合
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return function(...moreArgs) {
      return curried(...args, ...moreArgs);
    };
  };
}

// 函数组合
function compose(...fns) {
  return function(x) {
    return fns.reduceRight((acc, fn) => fn(acc), x);
  };
}

// 柯里化的工具函数
const add = curry((a, b) => a + b);
const multiply = curry((a, b) => a * b);
const subtract = curry((a, b) => a - b);
const divide = curry((a, b) => a / b);

// 创建计算管道
// 计算: ((x + 10) * 2 - 5) / 3
const calculate = compose(
  divide(3),
  subtract(5),
  multiply(2),
  add(10)
);

console.log(calculate(5)); // ((5 + 10) * 2 - 5) / 3 = 8.333...
console.log(calculate(10)); // ((10 + 10) * 2 - 5) / 3 = 11.666...
console.log(calculate(0)); // ((0 + 10) * 2 - 5) / 3 = 5
```

输出：
```
8.333333333333334
11.666666666666666
5
```

## 常见问题与解答

### 1. 柯里化与普通函数有什么区别？

**解答**：柯里化函数与普通函数的主要区别在于：
- **调用方式**：柯里化函数可以接受一系列单参数调用，而普通函数通常一次接受所有参数
- **闭包使用**：柯里化函数利用闭包保存中间状态（已传入的参数）
- **部分应用**：柯里化函数天生支持部分应用，而普通函数需要额外处理
- **灵活性**：柯里化提供了更灵活的函数调用方式和组合方式

### 2. 如何判断是否应该使用柯里化？

**解答**：以下场景适合使用柯里化：
- 需要频繁使用具有相同前缀参数的函数调用
- 需要创建可重用的函数组件
- 函数式编程风格，特别是与函数组合结合使用
- 需要提高代码可读性和声明式表达

避免在以下情况使用柯里化：
- 性能敏感的场景（柯里化会创建额外的函数对象）
- 团队不熟悉函数式编程概念
- 简单的一次性函数

### 3. JavaScript原生支持柯里化吗？

**解答**：JavaScript没有原生支持柯里化，但可以手动实现柯里化函数。一些现代JavaScript库如Ramda.js、Lodash/fp和Sanctuary提供了内置的柯里化功能。此外，ES6+的箭头函数和展开运算符使柯里化的实现变得更加简洁。

### 4. 柯里化会影响性能吗？

**解答**：是的，柯里化可能会对性能产生一定影响：
- 每次柯里化调用都会创建新的函数对象，增加内存使用
- 函数调用链会增加调用栈的深度
- 闭包会保持对外部变量的引用，可能导致内存使用增加

在大多数应用场景中，这种性能影响通常是微不足道的，但在性能敏感的应用中应该谨慎使用。

### 5. 如何实现带占位符的柯里化？

**解答**：带占位符的柯里化允许跳过某些参数，在后续调用中再提供。实现方式通常是：
1. 定义一个占位符符号（如`_`）
2. 在收集参数时，检测占位符并保留位置
3. 后续调用时，用新参数替换占位符位置

这种方式提供了更灵活的参数传递方式，特别适合需要重新排序参数的场景。

### 6. 柯里化在React/Vue等前端框架中有什么应用？

**解答**：柯里化在前端框架中有多种应用：
- **事件处理**：创建绑定了特定数据的事件处理函数
- **高阶组件**：柯里化的高阶组件可以接受配置参数
- **API调用**：创建预配置的API调用函数
- **样式管理**：创建动态样式生成函数
- **表单处理**：创建字段特定的验证函数

例如，在React中：
```jsx
// 柯里化的事件处理函数
const handleDelete = (id) => (event) => {
  event.preventDefault();
  deleteItem(id);
};

// 在组件中使用
<button onClick={handleDelete(1)}>Delete Item 1</button>
<button onClick={handleDelete(2)}>Delete Item 2</button>
```

### 7. 如何调试柯里化函数？

**解答**：调试柯里化函数可能比普通函数更复杂，可以尝试以下方法：
- 在柯里化函数内部添加日志，跟踪参数收集过程
- 使用函数式编程调试工具如Ramda的`trace`
- 利用现代浏览器的开发者工具，设置断点跟踪函数调用链
- 将复杂的柯里化调用分解为更小的步骤进行调试
- 编写单元测试，验证柯里化函数在各种场景下的行为