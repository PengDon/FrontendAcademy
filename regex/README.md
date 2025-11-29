# 正则表达式

## 📚 正则表达式简介

正则表达式（Regular Expression，简称 regex 或 regexp）是一种用于匹配字符串中字符组合的模式。它是一种强大的文本处理工具，广泛应用于各种编程语言、文本编辑器和命令行工具中。

### 核心特点

- **强大的匹配能力**：可以匹配复杂的字符串模式
- **跨语言兼容**：几乎所有编程语言都支持正则表达式
- **灵活的替换功能**：可以进行高级文本替换和修改
- **文本提取功能**：可以从文本中提取特定信息
- **验证功能**：常用于表单验证和数据验证
- **搜索优化**：可以实现高效的文本搜索

### 应用场景

- 电子邮件地址验证
- 手机号码验证
- URL 格式检查
- 文本数据清洗和格式化
- 代码中的字符串处理
- 日志文件分析
- 搜索引擎中的模式匹配
- 替换文本中的特定内容
- 提取文本中的关键信息

## 📊 学习路径

### 基础阶段
- 理解正则表达式的基本概念
- 掌握字符匹配、字符类和预定义字符类
- 学习量词的使用方法
- 实践简单的模式匹配

### 进阶阶段
- 深入理解分组和捕获
- 学习前瞻后顾断言
- 掌握正则表达式的替换功能
- 实践常见的文本验证场景

### 高级阶段
- 优化复杂正则表达式的性能
- 学习正则表达式引擎原理
- 掌握正则表达式的调试技巧
- 实践高级文本处理场景

## 基本语法

### 1. 字符匹配

#### 普通字符

普通字符（如字母、数字、空格等）在正则表达式中直接匹配自身。

```
hello  // 匹配字符串 "hello"
123    // 匹配字符串 "123"
```

#### 特殊字符

以下字符在正则表达式中有特殊含义，需要转义（使用反斜杠 `\`）才能匹配其字面意义：

```
^ $ . * + ? ( ) [ ] { } \ |
```

转义示例：
```
\.  // 匹配点号字符
s\*d  // 匹配字符串 "s*d"
```

### 2. 字符类

#### 方括号字符类

使用方括号 `[ ]` 定义字符类，匹配方括号内的任意一个字符。

```
[abc]  // 匹配字符 a、b 或 c
[0-9]  // 匹配任意数字字符
[a-z]  // 匹配任意小写字母
[A-Z]  // 匹配任意大写字母
[a-zA-Z]  // 匹配任意字母
[a-zA-Z0-9]  // 匹配任意字母或数字
```

#### 否定字符类

在方括号开头使用 `^` 表示否定字符类，匹配不在方括号内的任意字符。

```
[^abc]  // 匹配除了 a、b、c 以外的任意字符
[^0-9]  // 匹配非数字字符
```

#### 预定义字符类

| 字符 | 描述 |
|------|------|
| `.` | 匹配除换行符外的任意单个字符 |
| `\d` | 匹配任意数字字符，等价于 `[0-9]` |
| `\D` | 匹配任意非数字字符，等价于 `[^0-9]` |
| `\w` | 匹配任意字母、数字或下划线，等价于 `[a-zA-Z0-9_]` |
| `\W` | 匹配任意非字母、数字或下划线字符，等价于 `[^a-zA-Z0-9_]` |
| `\s` | 匹配任意空白字符（空格、制表符、换行符等） |
| `\S` | 匹配任意非空白字符 |
| `\b` | 匹配单词边界 |
| `\B` | 匹配非单词边界 |
| `\n` | 匹配换行符 |
| `\t` | 匹配制表符 |
| `\r` | 匹配回车符 |

### 3. 量词

量词用于指定前面的字符或组重复的次数。

| 量词 | 描述 |
|------|------|
| `*` | 匹配前面的字符或组 0 次或多次 |
| `+` | 匹配前面的字符或组 1 次或多次 |
| `?` | 匹配前面的字符或组 0 次或 1 次 |
| `{n}` | 匹配前面的字符或组恰好 n 次 |
| `{n,}` | 匹配前面的字符或组至少 n 次 |
| `{n,m}` | 匹配前面的字符或组至少 n 次，最多 m 次 |

#### 贪婪与非贪婪匹配

默认情况下，量词是贪婪的（尽可能匹配更多字符）。在量词后面添加 `?` 可以使其变为非贪婪的（尽可能匹配更少字符）。

```
// 贪婪匹配
a.*b  // 匹配从 a 开始到最后一个 b 的所有字符

// 非贪婪匹配
a.*?b  // 匹配从 a 开始到第一个 b 的字符
```

### 4. 锚点

锚点用于指定匹配的位置，而不匹配具体的字符。

| 锚点 | 描述 |
|------|------|
| `^` | 匹配字符串的开始位置 |
| `$` | 匹配字符串的结束位置 |
| `\b` | 匹配单词边界 |
| `\B` | 匹配非单词边界 |

```
^hello  // 匹配以 "hello" 开头的字符串
world$  // 匹配以 "world" 结尾的字符串
\bword\b  // 匹配独立的单词 "word"，不匹配 "sword" 或 "wording"
```

### 5. 分组和捕获

#### 捕获组

使用小括号 `( )` 创建捕获组，可以将匹配的部分提取出来。

```
(\d{4})-(\d{2})-(\d{2})  // 匹配日期格式 YYYY-MM-DD，并捕获年、月、日
```

#### 非捕获组

使用 `(?:)` 创建非捕获组，不会将匹配的部分单独捕获。

```
(?:Mr|Ms|Mrs)\.\s+(\w+)  // 匹配称呼（Mr./Ms./Mrs.）加上姓氏，但只捕获姓氏
```

#### 命名捕获组

使用 `(?<name>pattern)` 创建命名捕获组，可以通过名称引用捕获的内容。

```
(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})  // 使用命名捕获组匹配日期
```

#### 反向引用

使用 `\数字` 引用前面的捕获组。

```
(\w+)\s+\1  // 匹配重复的单词，如 "hello hello"
```

### 6. 断言

断言用于判断匹配的位置是否满足特定条件，但不消耗字符。

#### 前瞻断言

| 断言 | 描述 |
|------|------|
| `(?=pattern)` | 正向前瞻断言：匹配后面跟着指定模式的位置 |
| `(?!pattern)` | 负向前瞻断言：匹配后面不跟着指定模式的位置 |

```
\d+(?=元)  // 匹配后面跟着 "元" 的数字
\d{4}(?!\d)  // 匹配恰好 4 位的数字，后面不能有更多数字
```

#### 后顾断言

| 断言 | 描述 |
|------|------|
| `(?<=pattern)` | 正向后顾断言：匹配前面是指定模式的位置 |
| `(?<!pattern)` | 负向后顾断言：匹配前面不是指定模式的位置 |

```
(?<=￥)\d+  // 匹配前面是 "￥" 的数字
(?<!0)\d{2}  // 匹配两位数，但第一位不能是 0
```

### 7. 或操作符

使用 `|` 表示或操作。

```
cat|dog  // 匹配 "cat" 或 "dog"
(Mon|Tue|Wed|Thu|Fri|Sat|Sun)day  // 匹配星期几
```

## 在不同语言中的应用

### JavaScript 中的正则表达式

#### 创建正则表达式

```javascript
// 字面量语法
const regex1 = /\d+/g;

// 构造函数语法
const regex2 = new RegExp('\\d+', 'g');
```

#### 正则表达式方法

```javascript
// test() 方法：测试字符串是否匹配正则表达式
const regex = /\d+/;
console.log(regex.test('abc123')); // true

// exec() 方法：执行搜索并返回匹配结果
const result = regex.exec('abc123def456');
console.log(result); // ['123', index: 3, input: 'abc123def456', groups: undefined]

// 使用 g 标志进行全局匹配
const globalRegex = /\d+/g;
let match;
while ((match = globalRegex.exec('abc123def456')) !== null) {
  console.log(`Found ${match[0]} at index ${match.index}`);
}
```

#### 字符串方法

```javascript
// match() 方法：获取匹配的结果数组
const str = 'abc123def456';
console.log(str.match(/\d+/g)); // ['123', '456']

// search() 方法：返回第一个匹配项的索引
console.log(str.search(/\d+/)); // 3

// replace() 方法：替换匹配的内容
console.log(str.replace(/\d+/g, 'X')); // 'abcXdefX'

// 使用捕获组进行替换
console.log(str.replace(/(\d+)/g, '[$1]')); // 'abc[123]def[456]'

// 使用函数进行复杂替换
console.log(str.replace(/\d+/g, match => parseInt(match) * 2)); // 'abc246def912'

// split() 方法：使用正则表达式拆分字符串
console.log('a1b2c3'.split(/\d/)); // ['a', 'b', 'c', '']
```

#### 标志

| 标志 | 描述 |
|------|------|
| `g` | 全局匹配 |
| `i` | 忽略大小写 |
| `m` | 多行模式（^ 和 $ 匹配每行的开始和结束） |
| `s` | 让 . 匹配包括换行符在内的所有字符 |
| `u` | Unicode 模式 |
| `y` | 粘性匹配，从目标字符串的当前位置开始匹配 |

### Python 中的正则表达式

Python 使用 `re` 模块处理正则表达式。

```python
import re

# 匹配方法
pattern = r'\d+'
text = 'abc123def456'

# match() - 从字符串开头匹配
match = re.match(pattern, text)
print(match)  # None，因为数字不在开头

# search() - 查找第一个匹配项
match = re.search(pattern, text)
if match:
    print(match.group())  # '123'
    print(match.start())  # 3
    print(match.end())    # 6

# findall() - 查找所有匹配项
matches = re.findall(pattern, text)
print(matches)  # ['123', '456']

# finditer() - 返回匹配对象的迭代器
for match in re.finditer(pattern, text):
    print(match.group(), match.span())

# sub() - 替换匹配项
new_text = re.sub(pattern, 'X', text)
print(new_text)  # 'abcXdefX'

# split() - 拆分字符串
parts = re.split(r'\d+', text)
print(parts)  # ['abc', 'def', '']

# compile() - 编译正则表达式
regex = re.compile(r'\d+', re.IGNORECASE)
matches = regex.findall('Abc123Def456')
print(matches)  # ['123', '456']
```

### Java 中的正则表达式

Java 使用 `java.util.regex` 包处理正则表达式。

```java
import java.util.regex.*;

public class RegexExample {
    public static void main(String[] args) {
        String text = "abc123def456";
        String pattern = "\\d+";
        
        // 创建 Pattern 对象
        Pattern p = Pattern.compile(pattern);
        Matcher m = p.matcher(text);
        
        // 查找匹配项
        while (m.find()) {
            System.out.println("Found: " + m.group());
            System.out.println("Start index: " + m.start());
            System.out.println("End index: " + m.end());
        }
        
        // 替换
        String replaced = text.replaceAll(pattern, "X");
        System.out.println("Replaced: " + replaced);
        
        // 拆分
        String[] parts = text.split(pattern);
        for (String part : parts) {
            System.out.println("Part: " + part);
        }
        
        // 验证
        boolean isValid = Pattern.matches("\\d{6}", "123456");
        System.out.println("Is valid: " + isValid);
    }
}
```

### PHP 中的正则表达式

```php
$text = "abc123def456";
$pattern = '/\\d+/';

// preg_match() - 查找第一个匹配项
if (preg_match($pattern, $text, $matches, PREG_OFFSET_CAPTURE)) {
    echo "Found: " . $matches[0][0] . "\n";
    echo "Position: " . $matches[0][1] . "\n";
}

// preg_match_all() - 查找所有匹配项
preg_match_all($pattern, $text, $matches);
print_r($matches[0]);  // Array ( [0] => 123 [1] => 456 )

// preg_replace() - 替换
$replaced = preg_replace($pattern, "X", $text);
echo "Replaced: " . $replaced . "\n";  // abcXdefX

// preg_split() - 拆分
$parts = preg_split($pattern, $text);
print_r($parts);  // Array ( [0] => abc [1] => def [2] => )

// 使用修饰符
preg_match_all('/abc/i', "ABCdefABC", $matches);  // 忽略大小写
print_r($matches[0]);  // Array ( [0] => ABC [1] => ABC )
```

## 常见正则表达式示例

### 1. 验证电子邮箱

```
^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$
```

**分解说明**：
- `^` - 匹配字符串开始
- `[a-zA-Z0-9._%+-]+` - 匹配邮箱用户名部分
- `@` - 匹配 @ 符号
- `[a-zA-Z0-9.-]+` - 匹配域名部分
- `\.` - 匹配点号
- `[a-zA-Z]{2,}` - 匹配顶级域名（至少 2 个字符）
- `$` - 匹配字符串结束

### 2. 验证手机号码（中国大陆）

```
^1[3-9]\d{9}$
```

**分解说明**：
- `^` - 匹配字符串开始
- `1` - 匹配第一位数字 1
- `[3-9]` - 匹配第二位数字（3-9）
- `\d{9}` - 匹配后面的 9 位数字
- `$` - 匹配字符串结束

### 3. 验证 URL

```
^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$
```

**分解说明**：
- `^(https?:\/\/)?` - 匹配可选的协议（http:// 或 https://）
- `([\da-z.-]+)` - 匹配域名
- `\.` - 匹配点号
- `([a-z.]{2,6})` - 匹配顶级域名
- `([/\w .-]*)*\/?` - 匹配路径部分
- `$` - 匹配字符串结束

### 4. 验证 IPv4 地址

```
^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$
```

**分解说明**：
- `(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)` - 匹配 0-255 之间的数字
- `\.){3}` - 匹配三个数字后面跟着点号
- 最后再匹配一个 0-255 之间的数字

### 5. 验证日期格式（YYYY-MM-DD）

```
^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$
```

**分解说明**：
- `\d{4}` - 匹配年份（4 位数字）
- `(0[1-9]|1[0-2])` - 匹配月份（01-12）
- `(0[1-9]|[12]\d|3[01])` - 匹配日期（01-31）

### 6. 验证密码强度（至少 8 位，包含字母和数字）

```
^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$
```

**分解说明**：
- `(?=.*[A-Za-z])` - 确保包含至少一个字母
- `(?=.*\d)` - 确保包含至少一个数字
- `[A-Za-z\d@$!%*#?&]{8,}` - 匹配 8 位或更多字符（字母、数字、特殊字符）

### 7. 提取 HTML 标签

```
<([a-z][a-z0-9]*)[^>]*>(.*?)<\/\1>
```

**分解说明**：
- `<([a-z][a-z0-9]*)` - 匹配开始标签并捕获标签名
- `[^>]*>` - 匹配标签属性
- `(.*?)` - 非贪婪匹配标签内容
- `<\/\1>` - 匹配结束标签，使用反向引用确保标签名匹配

### 8. 匹配中文字符

```
[\u4e00-\u9fa5]+
```

### 9. 验证身份证号码（中国大陆）

```
^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[0-9Xx]$
```

### 10. 匹配文件扩展名

```
\.[a-zA-Z0-9]+$
```

## 正则表达式优化技巧

### 1. 尽量具体

使用具体的字符类而不是通配符 `.`，以提高性能。

```
// 不推荐
a.*b

// 推荐
a[^b]*b  // 如果已知中间没有 b 字符
a\w*b  // 如果只匹配单词字符
```

### 2. 使用非贪婪量词

在适当的情况下使用非贪婪量词，避免过度匹配。

```
// 贪婪匹配
<div>.*</div>

// 非贪婪匹配
<div>.*?</div>
```

### 3. 避免回溯

复杂的正则表达式可能导致回溯问题，影响性能。

```
// 可能导致大量回溯
a(b|c+)*d

// 优化版本
ab*d|ac+d
```

### 4. 使用锚点

使用 `^` 和 `$` 可以快速排除不匹配的字符串。

```
// 不使用锚点
hello

// 使用锚点（如果确定只匹配整个字符串）
^hello$
```

### 5. 预编译正则表达式

在需要重复使用的场景下，预编译正则表达式可以提高性能。

```javascript
// JavaScript
const regex = /\d+/g;

// Python
import re
pattern = re.compile(r'\d+')
```

## 正则表达式测试工具

### 在线工具

1. [RegExr](https://regexr.com/) - 可视化正则表达式测试工具
2. [Regex101](https://regex101.com/) - 支持多种语言的正则表达式测试
3. [Javascript RegExp Tester](https://www.regextester.com/) - JavaScript 正则表达式测试
4. [Debuggex](https://www.debuggex.com/) - 可视化正则表达式调试工具
5. [Regexper](https://regexper.com/) - 正则表达式可视化图表

### 编辑器内置工具

大多数现代代码编辑器（如 VS Code、Sublime Text、WebStorm）都内置了正则表达式搜索和替换功能。

## 正则表达式常见问题解答

### 1. 为什么我的正则表达式匹配结果不符合预期？

**解答**：
- 检查是否正确转义特殊字符
- 确认是否使用了正确的量词（贪婪 vs 非贪婪）
- 验证是否设置了正确的标志（如全局匹配 g、忽略大小写 i）
- 检查是否正确使用了锚点 `^` 和 `$`

### 2. 如何匹配多行文本？

**解答**：
- 在 JavaScript 中使用 `s` 标志让 `.` 匹配换行符
- 在多行模式下（使用 `m` 标志），`^` 和 `$` 会匹配每行的开始和结束

```javascript
// 匹配包含多行的文本块
const regex = /<div>.*?<\/div>/s;
```

### 3. 如何优化正则表达式性能？

**解答**：
- 减少回溯（避免嵌套量词）
- 使用具体的字符类而不是通配符
- 预编译正则表达式
- 限制匹配范围，尽早失败

### 4. 如何匹配 HTML 或 XML？

**解答**：虽然正则表达式可以处理简单的 HTML 匹配，但对于复杂的嵌套结构，推荐使用专门的解析器。对于简单情况，可以使用以下方法：

```
// 提取简单标签内容
/<(\w+)>(.*?)<\/\1>/g
```

### 5. 如何在正则表达式中使用 Unicode 字符？

**解答**：
- 在 JavaScript 中使用 `u` 标志启用 Unicode 模式
- 使用 `\u{code}` 语法匹配特定的 Unicode 字符
- 使用 Unicode 属性转义（ES2018+）：`\p{Script=Han}` 匹配汉字

```javascript
// 匹配中文汉字
const chineseRegex = /[\u4e00-\u9fa5]+/;

// 使用 Unicode 模式
const unicodeRegex = /\u{1F600}/u;  // 匹配笑脸表情 😀
```

## 正则表达式最佳实践

### 1. 编写可读的正则表达式

- 对于复杂的正则表达式，添加注释和说明
- 考虑使用命名捕获组提高可读性
- 将复杂的正则表达式拆分为多个简单的部分

### 2. 进行充分测试

- 测试各种边缘情况
- 测试无效输入
- 确保性能良好，不会导致回溯问题

### 3. 保持正则表达式简洁

- 只匹配必要的模式
- 避免过度复杂的正则表达式
- 对于非常复杂的文本处理，考虑结合其他文本处理方法

### 4. 考虑国际化

- 处理不同语言的字符
- 考虑不同地区的电话号码、日期格式等差异
- 使用 Unicode 属性支持多语言

### 5. 安全使用

- 避免使用可能导致 ReDoS（正则表达式拒绝服务）的模式
- 限制输入长度
- 对于用户输入的正则表达式进行验证和限制

## 进阶主题

### 1. 零宽断言应用

```javascript
// 匹配单词边界
const wordRegex = /\b\w+\b/g;

// 提取用户名（邮箱@前面的部分）
const usernameRegex = /(.+)(?=@)/;

// 确保密码包含至少一个大写字母
const passwordRegex = /^(?=.*[A-Z]).{8,}$/;
```

### 2. 正则表达式性能分析

```javascript
// 使用性能 API 测量正则表达式执行时间
const startTime = performance.now();
const result = /pattern/g.test(largeText);
const endTime = performance.now();
console.log(`Execution time: ${endTime - startTime}ms`);
```

### 3. 动态构建正则表达式

```javascript
// 从用户输入构建正则表达式
function createRegex(pattern, flags = '') {
  try {
    return new RegExp(pattern, flags);
  } catch (error) {
    console.error('Invalid regex pattern:', error);
    return null;
  }
}

// 使用示例
const userPattern = '\\d+';
const regex = createRegex(userPattern, 'g');
```

### 4. 正则表达式与函数式编程

```javascript
// 结合函数式方法使用正则表达式
const text = 'abc123def456ghi789';
const numbers = text
  .match(/\d+/g)
  .map(num => parseInt(num))
  .filter(num => num > 200)
  .reduce((sum, num) => sum + num, 0);

console.log(numbers); // 456 + 789 = 1245
```

## 学习资源

### 官方文档

- [MDN Web Docs - 正则表达式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions)
- [Python re 模块文档](https://docs.python.org/3/library/re.html)
- [Java 正则表达式教程](https://docs.oracle.com/javase/tutorial/essential/regex/)

### 进阶书籍

- 《精通正则表达式》（Jeffrey E.F. Friedl）
- 《正则表达式必知必会》（Ben Forta）
- 《正则表达式经典实例》（Jan Goyvaerts）

### 在线教程

- [正则表达式 30 分钟入门教程](https://deerchao.cn/tutorials/regex/regex.htm)
- [正则表达式基础教程](https://www.runoob.com/regexp/regexp-tutorial.html)
- [JavaScript 正则表达式完整教程](https://juejin.cn/post/6844903487155732494)

## 总结

正则表达式是一种强大的文本处理工具，掌握它可以大幅提高文本处理的效率。本指南涵盖了正则表达式的基本语法、常见应用场景以及在不同编程语言中的使用方法。通过不断实践和学习，你可以逐渐掌握正则表达式的精髓，解决各种复杂的文本处理问题。

记住，对于复杂的正则表达式，清晰的文档和充分的测试是必不可少的。在实际应用中，也要注意正则表达式的性能问题，避免使用可能导致性能瓶颈的复杂模式。

---

希望这份正则表达式基础知识文档能够帮助你理解和掌握正则表达式的使用。通过不断练习和应用，你将能够熟练地使用正则表达式解决各种文本处理挑战。