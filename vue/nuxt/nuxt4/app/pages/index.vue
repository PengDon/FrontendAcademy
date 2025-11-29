<template>
  <div class="home-page">
    <h1>Welcome to Nuxt 4!</h1>
    <p>This is a sample page showcasing Nuxt 4 features.</p>
    
    <div class="features">
      <h2>Key Features</h2>
      <ul>
        <li>Enhanced Nitro Engine</li>
        <li>Smart Type System</li>
        <li>Reactive Data Layer</li>
        <li>Modular Architecture</li>
        <li>New Composable API</li>
      </ul>
    </div>
    
    <div class="counter">
      <h3>Counter Example</h3>
      <p>Count: {{ count }}</p>
      <button @click="increment">Increment</button>
      <button @click="decrement">Decrement</button>
    </div>
    
    <div class="api-data">
      <h3>API Data</h3>
      <button @click="fetchData">Fetch Data</button>
      <div v-if="loading">Loading...</div>
      <div v-else-if="apiData">
        <pre>{{ apiData }}</pre>
      </div>
      <div v-else-if="error">Error: {{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Nuxt 4 的新特性：智能类型导入
// 使用 ref 和 computed 响应式数据
const count = ref(0)

// 使用新的 watchEffect 优化
watchEffect(() => {
  console.log(`Count updated: ${count.value}`)
})

// 方法定义
function increment() {
  count.value++
}

function decrement() {
  count.value--
}

// API 数据获取示例
const apiData = ref(null)
const loading = ref(false)
const error = ref(null)

async function fetchData() {
  loading.value = true
  error.value = null
  
  try {
    // 使用 Nuxt 4 增强的 fetch API
    const response = await fetch('/api/hello')
    const data = await response.json()
    apiData.value = data
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.home-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.features {
  margin: 2rem 0;
  padding: 1rem;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.counter {
  margin: 2rem 0;
  padding: 1rem;
  background-color: #e0f7fa;
  border-radius: 8px;
}

.api-data {
  margin: 2rem 0;
  padding: 1rem;
  background-color: #e8f5e9;
  border-radius: 8px;
}

button {
  margin: 0 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #1565c0;
}
</style>
