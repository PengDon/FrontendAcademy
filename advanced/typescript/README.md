# TypeScript 高级特性与最佳实践

## TypeScript 概述

TypeScript 是 JavaScript 的超集，它添加了静态类型系统和对 ES6+ 特性的支持。TypeScript 通过类型检查在开发阶段捕获潜在错误，提高代码质量和开发效率。

## 核心特性

### 1. 类型系统

#### 基本类型

```typescript
// 数字类型
let num: number = 42;
let hex: number = 0xf00d;
let binary: number = 0b1010;

// 字符串类型
let str: string = "Hello, TypeScript";
let template: string = `The number is ${num}`;

// 布尔类型
let isActive: boolean = true;

// 空值类型
function logMessage(): void {
  console.log("This function returns nothing");
}

// Null 和 Undefined
let nullValue: null = null;
let undefinedValue: undefined = undefined;

// Symbol 类型
let sym1: symbol = Symbol("symbol");
let sym2: symbol = Symbol("symbol");
console.log(sym1 === sym2); // false
```

#### 复合类型

```typescript
// 数组类型
let numbers: number[] = [1, 2, 3];
let strings: Array<string> = ["a", "b", "c"];

// 元组类型
let tuple: [string, number] = ["hello", 42];
tuple[0].substring(1); // 合法
// tuple[1].substring(1); // 非法，number 类型没有 substring 方法

// 枚举类型
enum Direction {
  Up = 1,
  Down,
  Left,
  Right
}
let dir: Direction = Direction.Up;

// 任意类型
let anyValue: any = 42;
anyValue = "string";
anyValue = false;

// 未知类型
let unknownValue: unknown = 42;
// unknownValue.toFixed(); // 非法，需要类型断言
if (typeof unknownValue === "number") {
  unknownValue.toFixed(); // 合法，类型守卫后
}

// 联合类型
let union: string | number = "string";
union = 42;

// 交叉类型
interface A { a: number }
interface B { b: string }
let intersection: A & B = { a: 42, b: "hello" };

// 字面量类型
let literal: "success" | "error" = "success";
let numericLiteral: 1 | 2 | 3 = 2;
```

#### 类型断言

```typescript
// 尖括号语法
let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length;

// as 语法（在 JSX 中只能使用这种方式）
let someValue: any = "this is a string";
let strLength: number = (someValue as string).length;
```

### 2. 接口 (Interfaces)

```typescript
// 基本接口
interface Person {
  name: string;
  age: number;
  optionalProp?: string; // 可选属性
  readonly readOnlyProp: number; // 只读属性
}

let person: Person = {
  name: "John",
  age: 30,
  readOnlyProp: 100
};

// 函数接口
interface SearchFunc {
  (source: string, subString: string): boolean;
}

let mySearch: SearchFunc = function(src: string, sub: string): boolean {
  return src.search(sub) !== -1;
};

// 可索引的类型
interface StringArray {
  [index: number]: string;
}

let myArray: StringArray = ["Bob", "Fred"];

// 类类型
interface ClockInterface {
  currentTime: Date;
  setTime(d: Date): void;
}

class Clock implements ClockInterface {
  currentTime: Date = new Date();
  setTime(d: Date) {
    this.currentTime = d;
  }
  constructor(h: number, m: number) {}
}

// 扩展接口
interface Shape {
  color: string;
}

interface Square extends Shape {
  sideLength: number;
}

let square: Square = {
  color: "blue",
  sideLength: 10
};

// 混合类型
interface Counter {
  (start: number): string;
  interval: number;
  reset(): void;
}

function getCounter(): Counter {
  let counter = <Counter>function(start: number) { return String(start); };
  counter.interval = 123;
  counter.reset = function() { counter.interval = 0; };
  return counter;
}
```

### 3. 类 (Classes)

```typescript
// 基本类定义
class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
  greet() {
    return `Hello, ${this.greeting}`;
  }
}

let greeter = new Greeter("world");

// 继承
class Animal {
  name: string;
  constructor(theName: string) {
    this.name = theName;
  }
  move(distanceInMeters: number = 0) {
    console.log(`${this.name} moved ${distanceInMeters}m.`);
  }
}

class Snake extends Animal {
  constructor(name: string) {
    super(name);
  }
  move(distanceInMeters = 5) {
    console.log("Slithering...");
    super.move(distanceInMeters);
  }
}

// 公共、私有与受保护的修饰符
class Employee {
  public name: string; // 默认为 public
  private salary: number; // 私有属性，只能在类内部访问
  protected department: string; // 受保护属性，可在类和子类中访问
  
  constructor(name: string, salary: number, department: string) {
    this.name = name;
    this.salary = salary;
    this.department = department;
  }
}

// 只读属性
class Octopus {
  readonly name: string;
  constructor(theName: string) {
    this.name = theName;
  }
}

// getter 和 setter
class Employee {
  private _fullName: string;

  get fullName(): string {
    return this._fullName;
  }

  set fullName(newName: string) {
    if (newName && newName.length > 5) {
      this._fullName = newName;
    }
  }
}

// 静态属性
class Grid {
  static origin = { x: 0, y: 0 };
  calculateDistanceFromOrigin(point: { x: number; y: number }) {
    let xDist = point.x - Grid.origin.x;
    let yDist = point.y - Grid.origin.y;
    return Math.sqrt(xDist * xDist + yDist * yDist) / this.scale;
  }
  constructor(public scale: number) {}
}

// 抽象类
abstract class Department {
  constructor(public name: string) {}
  
  printName(): void {
    console.log("Department name: " + this.name);
  }
  
  abstract printMeeting(): void; // 抽象方法，子类必须实现
}

class AccountingDepartment extends Department {
  constructor() {
    super("Accounting and Auditing");
  }
  
  printMeeting(): void {
    console.log("The Accounting Department meets each Monday at 10am.");
  }
}
```

### 4. 函数 (Functions)

```typescript
// 函数声明
function add(x: number, y: number): number {
  return x + y;
}

// 函数表达式
let myAdd = function(x: number, y: number): number {
  return x + y;
};

// 箭头函数
let arrowAdd = (x: number, y: number): number => x + y;

// 可选参数和默认参数
function buildName(firstName: string, lastName?: string): string {
  if (lastName) {
    return firstName + " " + lastName;
  } else {
    return firstName;
  }
}

function buildNameWithDefault(firstName: string, lastName: string = "Smith"): string {
  return firstName + " " + lastName;
}

// 剩余参数
function buildNameWithRest(firstName: string, ...restOfName: string[]): string {
  return firstName + " " + restOfName.join(" ");
}

// 函数重载
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string {
  if (typeof x === "number") {
    return Number(x.toString().split('').reverse().join(''));
  } else {
    return x.split('').reverse().join('');
  }
}
```

### 5. 泛型 (Generics)

```typescript
// 泛型函数
function identity<T>(arg: T): T {
  return arg;
}

let output1 = identity<string>("myString");
let output2 = identity(42); // 类型推断为 number

// 泛型接口
interface GenericIdentityFn<T> {
  (arg: T): T;
}

function identity<T>(arg: T): T {
  return arg;
}

let myIdentity: GenericIdentityFn<number> = identity;

// 泛型类
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };

// 泛型约束
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length); // 现在我们知道它有一个 .length 属性，所以不会报错
  return arg;
}

// 泛型参数默认类型
type A<T = string> = T;
const a1: A = "string"; // 默认为 string 类型
const a2: A<number> = 42;

// 在泛型里使用类类型
function createInstance<T extends new () => any>(c: T): InstanceType<T> {
  return new c();
}
```

### 6. 高级类型

```typescript
// 交叉类型
interface A { a: number }
interface B { b: string }
let intersection: A & B = { a: 42, b: "hello" };

// 联合类型
let union: string | number = "string";
unions = 42;

// 类型守卫
function isNumber(x: any): x is number {
  return typeof x === "number";
}

function padLeft(value: string, padding: string | number) {
  if (isNumber(padding)) {
    return Array(padding + 1).join(" ") + value;
  }
  if (typeof padding === "string") {
    return padding + value;
  }
  throw new Error(`Expected string or number, got '${padding}'.`);
}

// 可为空类型
let nullable: string | null | undefined;

// 字符串字面量类型
let literal: "success" | "error" = "success";

// 映射类型
interface Readonly<T> {
  readonly [P in keyof T]: T[P];
}

interface Partial<T> {
  [P in keyof T]?: T[P];
}

interface Required<T> {
  [P in keyof T]-?: T[P];
}

// 条件类型
T extends U ? X : Y;

type TypeName<T> = 
  T extends string ? "string" :
  T extends number ? "number" :
  T extends boolean ? "boolean" :
  T extends undefined ? "undefined" :
  T extends Function ? "function" :
  "object";

// 工具类型
// Record<K,T>
type PageInfo = Record<'title' | 'description', string>;

// Pick<T,K>
interface Todo { title: string; description: string; completed: boolean }
type TodoPreview = Pick<Todo, "title" | "completed">;

// Omit<T,K>
type TodoInfo = Omit<Todo, "completed">;

// Exclude<T,U>
type T0 = Exclude<"a" | "b" | "c", "a">; // "b" | "c"

// Extract<T,U>
type T1 = Extract<"a" | "b" | "c", "a" | "f">; // "a"

// NonNullable<T>
type T2 = NonNullable<string | number | undefined | null>; // string | number

// ReturnType<T>
type T3 = ReturnType<() => string>; // string

// Parameters<T>
type T4 = Parameters<(a: string, b: number) => void>; // [a: string, b: number]
```

## TypeScript 最佳实践

### 1. 项目配置 (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "es2020",              // 编译目标 ES 版本
    "module": "esnext",             // 模块系统
    "lib": ["es2020", "dom"],      // 包含的库
    "strict": true,                 // 启用所有严格类型检查选项
    "esModuleInterop": true,        // 启用 ES 模块与 CommonJS 的互操作性
    "skipLibCheck": true,           // 跳过声明文件的类型检查
    "forceConsistentCasingInFileNames": true, // 强制文件名大小写一致
    "moduleResolution": "node",     // 模块解析策略
    "resolveJsonModule": true,      // 允许导入 JSON 文件
    "isolatedModules": true,        // 每个文件作为单独模块处理
    "noEmit": true,                 // 不生成输出文件（用于开发服务器）
    "jsx": "react-jsx",            // JSX 转换模式
    "baseUrl": ".",                // 解析非相对模块名的基础目录
    "paths": {                      // 模块路径映射
      "@/*": ["src/*"]
    },
    "noImplicitAny": true,          // 禁止隐式 any 类型
    "strictNullChecks": true,       // 启用严格的 null 检查
    "strictFunctionTypes": true,    // 启用严格的函数类型检查
    "strictBindCallApply": true,    // 启用严格的 bind/call/apply 检查
    "strictPropertyInitialization": true, // 启用严格的属性初始化检查
    "noImplicitThis": true,         // 禁止隐式 this 类型
    "useUnknownInCatchVariables": true, // 在 catch 变量中使用 unknown 类型
    "alwaysStrict": true,           // 在严格模式下解析并发出 "use strict"
    "noUnusedLocals": true,         // 报告未使用的局部变量
    "noUnusedParameters": true,     // 报告未使用的参数
    "exactOptionalPropertyTypes": true, // 精确的可选属性类型
    "noImplicitReturns": true,      // 每个代码路径都必须返回值
    "noFallthroughCasesInSwitch": true, // 禁止 switch 语句中的穿透
    "noUncheckedSideEffectImports": true // 检查副作用导入
  },
  "include": ["src/**/*", "tests/**/*"], // 包含的文件
  "exclude": ["node_modules", "dist"]     // 排除的文件
}
```

### 2. 代码组织

```typescript
// 定义类型
export interface User {
  id: number;
  name: string;
  email: string;
}

// 使用类型
function getUserDetails(user: User): string {
  return `${user.name} (${user.email})`;
}
```

### 3. 类型声明文件

#### 创建声明文件

```typescript
// my-module.d.ts
declare module 'my-module' {
  export function someFunction(param: string): void;
  export interface SomeInterface {
    prop: number;
  }
}
```

#### 扩展现有类型

```typescript
// 扩展全局类型
interface Window {
  myGlobal: string;
}

// 扩展第三方库类型
declare module 'react' {
  interface HTMLAttributes<T> {
    'data-testid'?: string;
  }
}
```

### 4. 错误处理

```typescript
// 使用 try-catch 和 unknown 类型
try {
  // 可能抛出错误的代码
} catch (error: unknown) {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(String(error));
  }
}

// 创建自定义错误类
class ValidationError extends Error {
  constructor(public field: string, message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

try {
  throw new ValidationError('email', 'Invalid email format');
} catch (error) {
  if (error instanceof ValidationError) {
    console.error(`Field ${error.field}: ${error.message}`);
  }
}
```

### 5. 性能优化

```typescript
// 使用联合类型而非 any
// 不好的做法
function process(value: any) {
  // 代码...
}

// 好的做法
function process(value: string | number | boolean) {
  // 代码...
}

// 使用类型守卫而不是类型断言
// 不好的做法
function handleValue(value: unknown) {
  (value as string).toUpperCase(); // 不安全
}

// 好的做法
function handleValue(value: unknown) {
  if (typeof value === 'string') {
    value.toUpperCase(); // 安全
  }
}

// 避免深层嵌套的泛型和交叉类型
// 不好的做法
function complexFunction<T extends Record<string, U>, U extends { id: string }>(obj: T): Array<U & { index: number }> {
  // 复杂的泛型逻辑
  return [];
}

// 好的做法 - 拆分和简化
type ValidItem = { id: string };
type IndexedItem<T extends ValidItem> = T & { index: number };

function complexFunction<T extends Record<string, ValidItem>>(obj: T): IndexedItem<ValidItem>[] {
  // 更简单的实现
  return [];
}

// 使用 Record 代替索引签名
// 不好的做法
interface Dictionary {
  [key: string]: string;
}

// 好的做法
type Dictionary = Record<string, string>;

// 使用映射类型批量定义属性
interface User {
  id: string;
  name: string;
  email: string;
}

// 创建只读版本
type ReadonlyUser = { readonly [P in keyof User]: User[P] };

// 创建可选版本
type PartialUser = { [P in keyof User]?: User[P] };
```

## 与现代框架集成

### 与 React 集成

```tsx
// 函数组件类型定义
import React, { useState, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  step?: number;
  onCountChange?: (count: number) => void;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  step = 1,
  onCountChange,
  children
}) => {
  const [count, setCount] = useState<number>(initialCount);

  useEffect(() => {
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  const increment = () => {
    setCount(prev => prev + step);
  };

  const decrement = () => {
    setCount(prev => prev - step);
  };

  return (
    <div className="counter">
      <button onClick={decrement}>-</button>
      <span>{count}</span>
      <button onClick={increment}>+</button>
      {children}
    </div>
  );
};

export default Counter;
```

### 与 Vue 集成

```vue
<template>
  <div class="counter">
    <button @click="decrement">-</button>
    <span>{{ count }}</span>
    <button @click="increment">+</button>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
  initialCount?: number;
  step?: number;
}

interface Emits {
  (e: 'countChange', count: number): void;
}

const props = withDefaults(defineProps<Props>(), {
  initialCount: 0,
  step: 1
});

const emit = defineEmits<Emits>();
const count = ref<number>(props.initialCount);

const increment = () => {
  count.value += props.step;
};

const decrement = () => {
  count.value -= props.step;
};

watch(count, (newValue) => {
  emit('countChange', newValue);
});
</script>
```

## 常见问题与答案

### 1. 如何处理第三方库没有类型定义的情况？
**答案：** 
- 安装社区维护的类型定义（如果有）：`npm install --save-dev @types/library-name`
- 创建自定义声明文件：在项目中创建 `.d.ts` 文件声明模块
- 使用类型断言（临时解决方案）：`(library as any).method()`
- 为库贡献类型定义到 DefinitelyTyped 项目

### 2. any 类型的使用场景和风险？
**答案：** 
- **使用场景**：
  - 处理动态内容（如从 API 获取的未知数据结构）
  - 集成无类型的第三方库
  - 快速原型开发
- **风险**：
  - 失去类型检查的安全性
  - 可能导致运行时错误
  - 代码可读性和可维护性下降
- **替代方案**：使用 `unknown` 类型并配合类型守卫，或者定义更具体的联合类型

### 3. 如何避免类型断言？
**答案：** 
- 使用类型守卫函数确认类型
- 利用条件类型和映射类型
- 定义更精确的接口和类型
- 使用类型保护（如 `instanceof`, `typeof`, `in` 操作符）
- 合理使用泛型

### 4. 何时使用联合类型 vs 交叉类型？
**答案：** 
- **联合类型 (`|`)**：表示值可以是几种类型中的一种（"或"关系）
  ```typescript
  type Status = "success" | "error" | "loading";
  ```
- **交叉类型 (`&`)**：表示值同时拥有多种类型的特性（"且"关系）
  ```typescript
  type ButtonProps = BaseProps & {
    variant: "primary" | "secondary";
    onClick: () => void;
  };
  ```

### 5. 如何优化 TypeScript 的编译性能？
**答案：** 
- 合理配置 `tsconfig.json`，特别是 `include` 和 `exclude`
- 使用 `skipLibCheck: true` 跳过声明文件检查
- 避免过多的泛型嵌套和复杂的条件类型
- 减少大型类型定义和递归类型
- 使用 `isolatedModules: true` 提高增量编译性能
- 对于大型项目，考虑使用 TypeScript 项目引用（Project References）

### 6. 如何在 TypeScript 中实现类的多重继承？
**答案：** TypeScript 不直接支持多重继承，但可以通过以下方式模拟：
- 使用接口和实现多个接口
- 使用混入（Mixins）模式
  ```typescript
  function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
      Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
        derivedCtor.prototype[name] = baseCtor.prototype[name];
      });
    });
  }
  ```
- 使用组合优于继承的设计原则

### 7. 如何处理 React 组件的事件处理函数类型？
**答案：** 使用 React 提供的事件类型：
```typescript
import React from 'react';

function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
  // event 拥有正确的类型和方法
  event.preventDefault();
  console.log(event.currentTarget.value);
}

// 在组件中使用
<button onClick={handleClick}>Click me</button>
```

### 8. 如何定义异步函数的返回类型？
**答案：** 使用 `Promise<T>` 类型：
```typescript
async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}
```

### 9. 如何为函数的 `this` 参数指定类型？
**答案：** 使用 `this` 参数作为函数的第一个参数：
```typescript
function greet(this: { name: string }) {
  console.log(`Hello, ${this.name}`);
}

const obj = { name: "John", greet };
obj.greet(); // 正确

// greet(); // 错误，this 为 undefined
```

### 10. 如何在 TypeScript 中处理 null 和 undefined？
**答案：** 
- 启用 `strictNullChecks: true` 进行严格的 null 检查
- 使用联合类型：`string | null | undefined`
- 使用可选链操作符：`object?.property?.method?.()`
- 使用空值合并操作符：`value ?? defaultValue`
- 使用类型守卫：`if (value !== null && value !== undefined)`
- 使用非空断言操作符（谨慎使用）：`value!.length`