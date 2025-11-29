# React Router 详解

## 什么是 React Router?

React Router 是 React 的一个强大的路由库，它可以让你在 React 应用中实现页面之间的导航和路由控制。React Router 保持 UI 与 URL 同步，使得用户可以使用浏览器的前进、后退按钮进行导航，以及收藏页面等。

## 安装

### 安装 React Router

```bash
# 使用 npm
npm install react-router-dom

# 使用 yarn
yarn add react-router-dom
```

## 基本用法

### 1. 创建路由配置

首先，我们需要创建一个 Router 组件，并配置路由。

```jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} /> {/* 404 页面 */}
      </Routes>
    </Router>
  );
}

export default App;
```

### 2. 创建导航链接

使用 `Link` 或 `NavLink` 组件创建导航链接。

```jsx
import React from 'react';
import { Link, NavLink } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <ul>
        {/* 基本链接 */}
        <li>
          <Link to="/">Home</Link>
        </li>
        
        {/* 带样式的导航链接 */}
        <li>
          <NavLink 
            to="/about" 
            className={({ isActive }) => (isActive ? 'active' : 'inactive')}
          >
            About
          </NavLink>
        </li>
        
        {/* 带样式的导航链接（使用 style） */}
        <li>
          <NavLink 
            to="/contact" 
            style={({ isActive }) => ({
              color: isActive ? '#007bff' : '#333',
              textDecoration: isActive ? 'underline' : 'none'
            })}
          >
            Contact
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
```

## 动态路由

### 路由参数

```jsx
// 路由配置
<Route path="/users/:userId" element={<User />} />

// 在组件中获取参数
import { useParams } from 'react-router-dom';

function User() {
  // 获取路由参数
  const { userId } = useParams();
  
  return <div>User ID: {userId}</div>;
}
```

### 可选参数

```jsx
// 路由配置 - 使 userId 参数可选
<Route path="/users/:userId?" element={<Users />} />
```

## 嵌套路由

嵌套路由允许我们在一个组件内部渲染另一个路由。

```jsx
import React from 'react';
import { Outlet } from 'react-router-dom';

// 父路由组件
function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <nav>
        <ul>
          <li><Link to="profile">Profile</Link></li>
          <li><Link to="settings">Settings</Link></li>
        </ul>
      </nav>
      {/* Outlet 将渲染匹配的子路由 */}
      <Outlet />
    </div>
  );
}

// 子路由组件
function Profile() {
  return <div>Profile page</div>;
}

function Settings() {
  return <div>Settings page</div>;
}

// 路由配置
<Route path="/dashboard" element={<Dashboard />}>
  <Route index element={<div>Welcome to Dashboard</div>} />
  <Route path="profile" element={<Profile />} />
  <Route path="settings" element={<Settings />} />
</Route>
```

## 编程式导航

除了使用 `Link` 和 `NavLink` 进行声明式导航外，我们还可以使用 `useNavigate` hook 进行编程式导航。

```jsx
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();
  
  const handleLogin = () => {
    // 登录逻辑
    // ...
    
    // 登录成功后导航到首页
    navigate('/');
    
    // 或者导航到指定路径，并替换当前历史记录项
    navigate('/dashboard', { replace: true });
    
    // 或者使用相对路径导航
    navigate('../settings');
    
    // 或者返回上一页
    navigate(-1);
    
    // 或者前进一页
    navigate(1);
  };
  
  return (
    <form onSubmit={handleLogin}>
      {/* 表单内容 */}
    </form>
  );
}
```

## 路由状态

可以在导航时传递状态，这些状态不会显示在 URL 中。

```jsx
// 发送状态
import { Link, useNavigate } from 'react-router-dom';

function ProductList() {
  const navigate = useNavigate();
  
  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`, {
      state: { fromDashboard: true, data: { id: productId, name: 'Product Name' } }
    });
  };
  
  return (
    <div>
      {/* 使用 Link 传递状态 */}
      <Link 
        to="/products/123" 
        state={{ fromDashboard: true }}
      >
        View Product
      </Link>
      
      {/* 使用 navigate 传递状态 */}
      <button onClick={() => handleProductClick(123)}>View Product</button>
    </div>
  );
}

// 接收状态
import { useLocation } from 'react-router-dom';

function ProductDetail() {
  const location = useLocation();
  const { fromDashboard, data } = location.state || {};
  
  return (
    <div>
      <h1>Product Detail</h1>
      {fromDashboard && <p>From Dashboard: {fromDashboard}</p>}
      {data && <p>Product Name: {data.name}</p>}
    </div>
  );
}
```

## 路由守卫

React Router v6 没有直接的路由守卫概念，但我们可以通过创建自定义路由组件来实现类似功能。

### 权限验证

```jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';

// 权限验证组件
function PrivateRoute() {
  const isAuthenticated = useAuth(); // 假设这是一个检查用户是否已认证的函数
  const location = useLocation();
  
  // 如果未认证，重定向到登录页面，并带上当前位置作为重定向参数
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // 如果已认证，渲染子路由
  return <Outlet />;
}

// 使用权限验证路由
<Route element={<PrivateRoute />}>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/profile" element={<Profile />} />
</Route>

// 登录成功后重定向回原页面
function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  
  const handleLogin = () => {
    // 登录逻辑
    // ...
    
    // 登录成功后，重定向回原来的位置
    navigate(from, { replace: true });
  };
  
  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        {/* 表单内容 */}
      </form>
    </div>
  );
}
```

## 路由元数据

可以为路由添加元数据，用于路由配置或渲染条件。

```jsx
// 带元数据的路由配置
<Route 
  path="/admin" 
  element={<Admin />}
  loader={adminLoader}
  handle={{
    // 路由元数据
    breadcrumb: 'Admin',
    requiresAuth: true,
    role: 'admin'
  }}
/>

// 在组件中访问路由元数据
import { useMatches } from 'react-router-dom';

function Breadcrumbs() {
  const matches = useMatches();
  
  return (
    <nav aria-label="Breadcrumb">
      <ol>
        {matches
          .filter((match) => match.handle?.breadcrumb)
          .map((match, index, array) => (
            <li key={match.id}>
              <Link to={match.pathname}>
                {match.handle.breadcrumb}
              </Link>
              {index < array.length - 1 && ' / '}
            </li>
          ))
        }
      </ol>
    </nav>
  );
}
```

## 延迟加载和代码分割

React Router 支持通过动态导入实现代码分割，减少初始加载时间。

```jsx
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 使用 lazy 动态导入组件
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
```

## 位置和历史

### useLocation

`useLocation` hook 返回当前的位置对象。

```jsx
import { useLocation } from 'react-router-dom';

function LocationDisplay() {
  const location = useLocation();
  
  return (
    <div>
      <p>Current Path: {location.pathname}</p>
      <p>Search Parameters: {location.search}</p>
      <p>Hash: {location.hash}</p>
    </div>
  );
}
```

### useSearchParams

`useSearchParams` hook 用于读取和修改 URL 的查询字符串参数。

```jsx
import { useSearchParams } from 'react-router-dom';

function SearchParamsDemo() {
  // 获取查询参数
  const [searchParams, setSearchParams] = useSearchParams();
  const name = searchParams.get('name');
  const age = searchParams.get('age');
  
  // 设置查询参数
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...Object.fromEntries(prev),
      [name]: value
    }));
  };
  
  return (
    <div>
      <h1>Search Params Demo</h1>
      <p>Name: {name || 'Not set'}</p>
      <p>Age: {age || 'Not set'}</p>
      
      <div>
        <label>
          Name:
          <input 
            type="text" 
            name="name" 
            value={name || ''} 
            onChange={handleChange} 
          />
        </label>
      </div>
      
      <div>
        <label>
          Age:
          <input 
            type="number" 
            name="age" 
            value={age || ''} 
            onChange={handleChange} 
          />
        </label>
      </div>
    </div>
  );
}
```

### useNavigate vs useHistory

在 React Router v5 中，我们使用 `useHistory` hook 进行编程式导航。在 v6 中，它被 `useNavigate` 取代。

```jsx
// React Router v5
import { useHistory } from 'react-router-dom';

function Demo() {
  const history = useHistory();
  
  const handleClick = () => {
    history.push('/path');
    history.replace('/path');
    history.goBack();
    history.goForward();
  };
}

// React Router v6
import { useNavigate } from 'react-router-dom';

function Demo() {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/path');
    navigate('/path', { replace: true });
    navigate(-1);
    navigate(1);
  };
}
```

## 数据加载

React Router v6 引入了数据加载功能，可以在路由渲染之前加载数据。

```jsx
// 定义加载器函数
const productLoader = async ({ params }) => {
  const res = await fetch(`/api/products/${params.productId}`);
  if (!res.ok) {
    throw new Error('Failed to fetch product');
  }
  return res.json();
};

// 在路由中使用加载器
<Route 
  path="/products/:productId" 
  element={<ProductDetail />} 
  loader={productLoader}
/>

// 在组件中访问加载的数据
import { useLoaderData } from 'react-router-dom';

function ProductDetail() {
  const product = useLoaderData();
  
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
    </div>
  );
}

// 错误处理
function ErrorBoundary() {
  const error = useRouteError();
  
  return (
    <div>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>{error.message}</p>
    </div>
  );
}

// 在路由中使用错误边界
<Route 
  path="/products/:productId" 
  element={<ProductDetail />} 
  loader={productLoader}
  errorElement={<ErrorBoundary />}
/>
```

## 常见问题与答案

### 1. React Router v5 和 v6 的主要区别是什么？
**答案：** 
- 路由配置变化：v6 使用 `Routes` 和 `Route` 组件替代了 v5 的 `Switch` 和 `Route`
- 嵌套路由改进：v6 通过 `Outlet` 组件更好地支持嵌套路由
- 重定向变化：使用 `Navigate` 组件替代了 v5 的 `Redirect`
- 导航 API 变化：`useNavigate` 替代了 `useHistory`
- 参数获取变化：`useParams` 现在返回一个只读的对象
- 新增了数据加载功能：通过 `loader` 和 `useLoaderData` 实现

### 2. 如何在 React Router 中实现认证和授权？
**答案：** 
可以通过创建一个自定义的路由组件来实现认证和授权逻辑，例如：
- 创建一个 `RequireAuth` 组件，检查用户是否已认证
- 如果用户已认证，渲染子路由（使用 `Outlet`）
- 如果用户未认证，重定向到登录页面
- 对于授权，可以在路由中添加角色检查逻辑

### 3. 如何处理 404 页面？
**答案：** 
在路由配置的最后，添加一个匹配所有路径的路由，并渲染 404 组件：
```jsx
<Route path="*" element={<NotFound />} />
```

### 4. 如何在 React Router 中实现面包屑导航？
**答案：** 
可以使用 `useMatches` hook 获取匹配的路由信息，然后根据路由元数据构建面包屑导航。

### 5. 如何处理路由参数变化而不重新渲染组件？
**答案：** 
可以在组件中使用 `useEffect` 监听 `useParams` 的变化，并根据变化更新状态或执行副作用。

```jsx
import { useParams, useEffect } from 'react-router-dom';

function UserProfile() {
  const { userId } = useParams();
  
  useEffect(() => {
    // 当 userId 变化时，加载用户数据
    loadUserData(userId);
  }, [userId]);
  
  return <div>User Profile</div>;
}
```

### 6. 如何在 React Router 中实现路由转换动画？
**答案：** 
可以使用 CSS transitions 或 React 动画库（如 React Transition Group 或 Framer Motion）结合 React Router 的 `useLocation` hook 来实现路由转换动画。

### 7. 如何在 React Router 中实现延迟加载？
**答案：** 
可以使用 React 的 `lazy` 和 `Suspense` 结合 React Router 来实现延迟加载，减少初始加载时间。

### 8. 如何在路由变化时滚动到顶部？
**答案：** 
可以创建一个滚动到顶部的组件，并将其放置在路由组件中，或者在路由变化时执行滚动操作：

```jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    // 滚动到顶部
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

// 在应用的根组件中使用
function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* 路由配置 */}
      </Routes>
    </Router>
  );
}
```

### 9. 如何在 React Router 中使用 HashRouter？
**答案：** 
当你需要在没有服务器配置的静态网站上使用 React Router 时，可以使用 `HashRouter` 替代 `BrowserRouter`。

```jsx
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        {/* 路由配置 */}
      </Routes>
    </Router>
  );
}
```

### 10. 如何在 React Router 中处理 URL 搜索参数？
**答案：** 
可以使用 `useSearchParams` hook 来读取和修改 URL 的查询字符串参数。