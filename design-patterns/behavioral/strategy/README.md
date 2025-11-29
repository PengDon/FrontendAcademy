# 策略模式 (Strategy Pattern)

## 什么是策略模式

策略模式是一种行为设计模式，它定义了算法家族，分别封装起来，让它们之间可以互相替换。策略模式让算法的变化独立于使用算法的客户。

## 策略模式的核心组件

1. **Strategy（策略接口）**：定义所有支持的算法的公共接口
2. **ConcreteStrategy（具体策略）**：实现策略接口的具体算法
3. **Context（上下文）**：使用策略的类，持有一个策略对象的引用

## 策略模式的UML图

```
Context → Strategy → ConcreteStrategyA
      → ConcreteStrategyB
      → ConcreteStrategyC
```

## 策略模式的实现示例

### 基本实现

```javascript
// Strategy接口
class PaymentStrategy {
  pay(amount) {}
}

// ConcreteStrategy
class CreditCardPayment extends PaymentStrategy {
  constructor(cardNumber, cvv, expiryDate) {
    super();
    this.cardNumber = cardNumber;
    this.cvv = cvv;
    this.expiryDate = expiryDate;
  }

  pay(amount) {
    console.log(`使用信用卡支付 ${amount} 元`);
    console.log(`卡号: ${this.maskCardNumber()}`);
    return true;
  }

  maskCardNumber() {
    return '*'.repeat(this.cardNumber.length - 4) + 
           this.cardNumber.slice(-4);
  }
}

class PayPalPayment extends PaymentStrategy {
  constructor(email) {
    super();
    this.email = email;
  }

  pay(amount) {
    console.log(`使用PayPal支付 ${amount} 元`);
    console.log(`账户: ${this.email}`);
    return true;
  }
}

class AlipayPayment extends PaymentStrategy {
  constructor(userId) {
    super();
    this.userId = userId;
  }

  pay(amount) {
    console.log(`使用支付宝支付 ${amount} 元`);
    console.log(`用户ID: ${this.userId}`);
    return true;
  }
}

// Context
class ShoppingCart {
  constructor() {
    this.items = [];
    this.paymentStrategy = null;
  }

  addItem(item) {
    this.items.push(item);
    return this;
  }

  removeItem(itemName) {
    this.items = this.items.filter(item => item.name !== itemName);
    return this;
  }

  setPaymentStrategy(strategy) {
    this.paymentStrategy = strategy;
  }

  calculateTotal() {
    return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  checkout() {
    const total = this.calculateTotal();
    if (!this.paymentStrategy) {
      throw new Error('请选择支付方式');
    }
    return this.paymentStrategy.pay(total);
  }

  getItems() {
    return [...this.items];
  }
}

// 使用示例
const cart = new ShoppingCart();

// 添加商品
cart.addItem({ name: '手机', price: 5000, quantity: 1 });
cart.addItem({ name: '耳机', price: 300, quantity: 2 });

// 设置支付策略
const creditCardStrategy = new CreditCardPayment('1234567890123456', '123', '12/25');
cart.setPaymentStrategy(creditCardStrategy);

// 结账
cart.checkout(); // 输出: 使用信用卡支付 5600 元
                // 卡号: ************3456

// 切换支付策略
const payPalStrategy = new PayPalPayment('user@example.com');
cart.setPaymentStrategy(payPalStrategy);
cart.checkout(); // 输出: 使用PayPal支付 5600 元
                // 账户: user@example.com
```

### 函数式实现

在JavaScript中，可以使用函数来简化策略模式的实现：

```javascript
// 策略函数
const creditCardPayment = (cardNumber, cvv, expiryDate) => (amount) => {
  console.log(`使用信用卡支付 ${amount} 元`);
  console.log(`卡号: ${'*'.repeat(cardNumber.length - 4) + cardNumber.slice(-4)}`);
  return true;
};

const payPalPayment = (email) => (amount) => {
  console.log(`使用PayPal支付 ${amount} 元`);
  console.log(`账户: ${email}`);
  return true;
};

// Context
class ShoppingCart {
  constructor() {
    this.items = [];
    this.paymentStrategy = null;
  }

  // 方法实现与前面类似...
}

// 使用
const cart = new ShoppingCart();
cart.setPaymentStrategy(creditCardPayment('1234567890123456', '123', '12/25'));
```

## 策略模式的应用场景

1. **算法族选择**：当一个问题有多种解决方案，需要在运行时选择时
2. **业务规则变化**：当业务规则可能频繁变化时
3. **避免多重条件语句**：替代复杂的if-else或switch-case结构
4. **排序算法选择**：根据不同数据特性选择不同的排序算法
5. **表单验证规则**：根据不同表单字段应用不同的验证规则

## 策略模式的优点

1. **开闭原则**：可以添加新的策略而不修改现有代码
2. **消除条件语句**：减少复杂的if-else或switch-case结构
3. **提高可维护性**：每个策略独立封装，便于测试和维护
4. **算法复用**：策略可以在不同场景中复用
5. **运行时切换**：可以在运行时动态切换算法

## 策略模式的缺点

1. **客户端必须了解所有策略**：客户端需要知道有哪些策略可用
2. **策略数量可能过多**：当策略数量很多时，会导致类爆炸
3. **增加了对象数量**：每个策略都是一个独立的类或对象

## 策略模式与其他模式的区别

### 策略模式 vs 状态模式

- **策略模式**：算法之间是平等的，可以相互替换，客户端负责选择使用哪个策略
- **状态模式**：状态之间有转换关系，状态的转换由状态对象自身控制

### 策略模式 vs 工厂模式

- **策略模式**：关注算法的封装和切换
- **工厂模式**：关注对象的创建

### 策略模式 vs 模板方法模式

- **策略模式**：完全封装算法，算法之间可以完全不同
- **模板方法模式**：定义算法骨架，允许子类重写特定步骤

## 实际应用案例

### 表单验证策略

```javascript
// 验证策略
const validationStrategies = {
  required: (value) => {
    return value !== undefined && value !== null && value.trim() !== '';
  },
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },
  minLength: (value, min) => {
    return value.length >= min;
  },
  maxLength: (value, max) => {
    return value.length <= max;
  },
  number: (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }
};

// 表单验证器
class FormValidator {
  constructor(strategies) {
    this.strategies = strategies;
    this.validations = {};
  }

  addField(fieldName, validations) {
    this.validations[fieldName] = validations;
  }

  validate(formData) {
    const errors = {};
    
    for (const fieldName in this.validations) {
      const fieldValidations = this.validations[fieldName];
      const value = formData[fieldName];
      
      for (const [strategyName, params] of Object.entries(fieldValidations)) {
        const strategy = this.strategies[strategyName];
        if (!strategy) continue;
        
        let isValid;
        if (Array.isArray(params)) {
          isValid = strategy(value, ...params);
        } else if (params !== undefined) {
          isValid = strategy(value, params);
        } else {
          isValid = strategy(value);
        }
        
        if (!isValid) {
          if (!errors[fieldName]) {
            errors[fieldName] = [];
          }
          errors[fieldName].push(`Field failed ${strategyName} validation`);
        }
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}

// 使用示例
const validator = new FormValidator(validationStrategies);

validator.addField('username', {
  required: true,
  minLength: 3,
  maxLength: 20
});

validator.addField('email', {
  required: true,
  email: true
});

const formData = {
  username: 'user',
  email: 'invalid-email'
};

const result = validator.validate(formData);
console.log(result);
```

### 排序策略

```javascript
// 排序策略
class SortStrategy {
  sort(data) {}
}

class QuickSort extends SortStrategy {
  sort(data) {
    console.log('使用快速排序');
    // 快速排序实现
    return [...data].sort((a, b) => a - b);
  }
}

class MergeSort extends SortStrategy {
  sort(data) {
    console.log('使用归并排序');
    // 归并排序实现
    return [...data].sort((a, b) => a - b);
  }
}

class BubbleSort extends SortStrategy {
  sort(data) {
    console.log('使用冒泡排序');
    // 冒泡排序实现
    const result = [...data];
    for (let i = 0; i < result.length - 1; i++) {
      for (let j = 0; j < result.length - i - 1; j++) {
        if (result[j] > result[j + 1]) {
          [result[j], result[j + 1]] = [result[j + 1], result[j]];
        }
      }
    }
    return result;
  }
}

// Context
class Sorter {
  constructor() {
    this.strategy = null;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  sort(data) {
    if (!this.strategy) {
      throw new Error('请设置排序策略');
    }
    return this.strategy.sort(data);
  }
}

// 使用示例
const sorter = new Sorter();
const data = [5, 2, 9, 1, 5, 6];

// 根据数据特性选择不同的排序策略
if (data.length > 1000) {
  sorter.setStrategy(new QuickSort()); // 大数据集使用快速排序
} else if (data.length < 10) {
  sorter.setStrategy(new BubbleSort()); // 小数据集使用冒泡排序
} else {
  sorter.setStrategy(new MergeSort()); // 中等数据集使用归并排序
}

const sortedData = sorter.sort(data);
console.log(sortedData);
```

## 策略模式在前端框架中的应用

### React中的策略模式

```jsx
// 不同类型的按钮组件
const PrimaryButton = ({ onClick, children }) => (
  <button 
    onClick={onClick} 
    style={{ 
      backgroundColor: '#007bff', 
      color: 'white',
      padding: '8px 16px',
      border: 'none',
      borderRadius: '4px'
    }}
  >
    {children}
  </button>
);

const SecondaryButton = ({ onClick, children }) => (
  <button 
    onClick={onClick} 
    style={{ 
      backgroundColor: 'transparent', 
      color: '#007bff',
      padding: '8px 16px',
      border: '1px solid #007bff',
      borderRadius: '4px'
    }}
  >
    {children}
  </button>
);

const DangerButton = ({ onClick, children }) => (
  <button 
    onClick={onClick} 
    style={{ 
      backgroundColor: '#dc3545', 
      color: 'white',
      padding: '8px 16px',
      border: 'none',
      borderRadius: '4px'
    }}
  >
    {children}
  </button>
);

// 按钮策略映射
const buttonStrategies = {
  primary: PrimaryButton,
  secondary: SecondaryButton,
  danger: DangerButton
};

// 按钮工厂组件
const Button = ({ type = 'primary', onClick, children }) => {
  const ButtonComponent = buttonStrategies[type] || buttonStrategies.primary;
  return <ButtonComponent onClick={onClick}>{children}</ButtonComponent>;
};

// 使用示例
<Button type="primary" onClick={() => console.log('Clicked')}>提交</Button>
<Button type="secondary" onClick={() => console.log('Clicked')}>取消</Button>
<Button type="danger" onClick={() => console.log('Clicked')}>删除</Button>
```

## 常见问题与解答

### Q: 如何决定是否使用策略模式？
A: 当你的代码中出现大量条件语句来选择不同的算法，或者算法可能在未来扩展时，可以考虑使用策略模式。

### Q: 策略模式如何支持依赖注入？
A: 可以通过构造函数或setter方法将策略对象注入到上下文对象中，实现松耦合。

### Q: 如何管理多个相关的策略？
A: 可以使用简单工厂或注册表模式来管理和创建策略对象。

### Q: 策略模式在JavaScript中有什么特殊实现方式？
A: 在JavaScript中，可以使用函数作为策略，或者使用对象字面量来定义策略，更加简洁灵活。

### Q: 策略模式如何与闭包结合使用？
A: 可以使用闭包来捕获策略的配置参数，返回一个可直接调用的策略函数。