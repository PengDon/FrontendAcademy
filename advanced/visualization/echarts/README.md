# ECharts 学习指南

## 什么是 ECharts？

ECharts 是一个由百度开发的基于 JavaScript 的开源可视化库，提供了丰富的交互式图表和数据可视化解决方案。它支持多种图表类型，具有良好的兼容性和强大的定制能力。

## 快速开始

### 1. 安装

#### 通过 npm 安装

```bash
npm install echarts --save
```

#### 通过 CDN 引入

```html
<script src="https://cdn.jsdelivr.net/npm/echarts@5.4.0/dist/echarts.min.js"></script>
```

### 2. 基本使用

```html
<div id="chart-container" style="width: 600px; height: 400px;"></div>

<script>
  // 初始化图表实例
  const chartDom = document.getElementById('chart-container');
  const myChart = echarts.init(chartDom);
  
  // 配置选项
  const option = {
    title: {
      text: 'ECharts 入门示例'
    },
    tooltip: {},
    legend: {
      data: ['销量']
    },
    xAxis: {
      data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
    },
    yAxis: {},
    series: [{
      name: '销量',
      type: 'bar',
      data: [5, 20, 36, 10, 10, 20]
    }]
  };
  
  // 设置配置项
  myChart.setOption(option);
  
  // 响应式调整
  window.addEventListener('resize', function() {
    myChart.resize();
  });
</script>
```

## 核心概念

### 1. 图表实例

```javascript
// 创建图表实例
const myChart = echarts.init(domElement);

// 销毁图表实例
myChart.dispose();

// 重置图表大小
myChart.resize();

// 清除图表
myChart.clear();
```

### 2. 配置项 (Option)

ECharts 通过配置项控制图表的各个方面，主要包括：

- **title**: 标题组件
- **tooltip**: 提示框组件
- **legend**: 图例组件
- **grid**: 网格组件，用于定义直角坐标系的布局和大小
- **xAxis/yAxis**: 坐标轴组件
- **series**: 系列列表，定义图表的类型和数据
- **color**: 调色板
- **backgroundColor**: 背景色
- **animation**: 动画配置

### 3. 数据系列 (Series)

每个系列决定了图表的类型和数据：

```javascript
series: [
  {
    name: '数据名称',
    type: 'bar', // 图表类型
    data: [10, 20, 30, 40], // 数据
    // 其他配置项
  }
]
```

## 图表类型

### 1. 柱状图 (Bar)

```javascript
series: [{
  type: 'bar',
  data: [5, 20, 36, 10, 10, 20],
  itemStyle: {
    color: '#5470c6'
  }
}]
```

### 2. 折线图 (Line)

```javascript
series: [{
  type: 'line',
  data: [5, 20, 36, 10, 10, 20],
  smooth: true, // 平滑曲线
  areaStyle: {} // 填充区域
}]
```

### 3. 饼图 (Pie)

```javascript
series: [{
  type: 'pie',
  radius: '50%',
  data: [
    { value: 335, name: '直接访问' },
    { value: 310, name: '邮件营销' },
    { value: 234, name: '联盟广告' }
  ],
  emphasis: {
    itemStyle: {
      shadowBlur: 10,
      shadowOffsetX: 0,
      shadowColor: 'rgba(0, 0, 0, 0.5)'
    }
  }
}]
```

### 4. 散点图 (Scatter)

```javascript
series: [{
  type: 'scatter',
  data: [[10.0, 8.04], [8.0, 6.95], [13.0, 7.58]],
  symbolSize: 8
}]
```

### 5. 雷达图 (Radar)

```javascript
option = {
  radar: {
    indicator: [
      { name: '销售', max: 6500 },
      { name: '管理', max: 16000 },
      { name: '技术', max: 30000 }
    ]
  },
  series: [{
    type: 'radar',
    data: [{
      value: [4200, 3000, 20000],
      name: '预算分配'
    }]
  }]
}
```

### 6. 热力图 (Heatmap)

```javascript
series: [{
  type: 'heatmap',
  data: [[0, 0, 5], [0, 1, 10], [1, 0, 15]],
  label: {
    show: true
  }
}]
```

### 7. 树图 (Tree)

```javascript
series: [{
  type: 'tree',
  data: [{ name: '父节点', children: [{ name: '子节点1' }, { name: '子节点2' }] }],
  top: '1%',
  left: '7%',
  bottom: '1%',
  right: '20%'
}]
```

### 8. 地图 (Map)

```javascript
// 首先需要注册地图数据
$.getJSON('china.json', function(geoJson) {
  echarts.registerMap('china', geoJson);
  
  const option = {
    series: [{
      type: 'map',
      map: 'china',
      data: [
        { name: '北京', value: 100 },
        { name: '上海', value: 200 }
      ]
    }]
  };
  
  myChart.setOption(option);
});
```

### 9. 桑基图 (Sankey)

```javascript
option = {
  series: [{
    type: 'sankey',
    data: [
      { name: '节点1' },
      { name: '节点2' },
      { name: '节点3' }
    ],
    links: [
      { source: '节点1', target: '节点2', value: 5 },
      { source: '节点1', target: '节点3', value: 3 }
    ]
  }]
}
```

### 10. 关系图 (Graph)

```javascript
option = {
  series: [{
    type: 'graph',
    layout: 'force',
    data: [
      { name: '节点1', symbolSize: 50 },
      { name: '节点2', symbolSize: 30 }
    ],
    links: [
      { source: '节点1', target: '节点2' }
    ],
    roam: true
  }]
}
```

## 交互功能

### 1. 事件处理

```javascript
// 监听点击事件
myChart.on('click', function(params) {
  console.log(params.name, params.value);
});

// 监听鼠标悬停事件
myChart.on('mouseover', function(params) {
  console.log('鼠标悬停在:', params.name);
});

// 监听图例点击事件
myChart.on('legendselectchanged', function(params) {
  console.log('图例选择状态:', params.selected);
});
```

### 2. 数据筛选与视图控制

```javascript
// 设置图例选中状态
myChart.dispatchAction({
  type: 'legendSelect',
  name: '系列名称'
});

// 高亮数据项
myChart.dispatchAction({
  type: 'highlight',
  seriesIndex: 0,
  dataIndex: 1
});

// 显示提示框
myChart.dispatchAction({
  type: 'showTip',
  seriesIndex: 0,
  dataIndex: 0
});
```

### 3. 缩放与漫游

```javascript
// 启用缩放和平移
option = {
  tooltip: {},
  xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed'] },
  yAxis: { type: 'value' },
  series: [{ data: [120, 200, 150], type: 'line' }],
  dataZoom: [
    {
      type: 'inside', // 内置缩放组件
      start: 0,
      end: 100
    },
    {
      type: 'slider', // 滑块缩放组件
      start: 0,
      end: 100
    }
  ]
};
```

## 样式定制

### 1. 颜色配置

```javascript
option = {
  color: ['#5470c6', '#91cc75', '#fac858', '#ee6666'],
  // 其他配置...
};
```

### 2. 全局字体样式

```javascript
option = {
  textStyle: {
    fontFamily: 'Arial, sans-serif',
    fontSize: 14,
    color: '#333'
  },
  // 其他配置...
};
```

### 3. 自定义样式

```javascript
option = {
  series: [{
    type: 'bar',
    data: [10, 20, 30, 40],
    itemStyle: {
      color: function(params) {
        // 根据数据值返回不同颜色
        const colorList = ['#5470c6', '#91cc75', '#fac858', '#ee6666'];
        return colorList[params.dataIndex];
      },
      borderRadius: [5, 5, 0, 0],
      shadowBlur: 10,
      shadowColor: 'rgba(0, 0, 0, 0.2)'
    },
    emphasis: {
      itemStyle: {
        color: '#73c0de'
      }
    }
  }]
};
```

## 组件集成

### 1. Vue 集成

```javascript
// Vue 组件示例
import * as echarts from 'echarts';

export default {
  data() {
    return {
      chart: null
    };
  },
  mounted() {
    this.initChart();
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
    if (this.chart) {
      this.chart.dispose();
    }
  },
  methods: {
    initChart() {
      const chartDom = this.$refs.chart;
      this.chart = echarts.init(chartDom);
      const option = {
        // 配置项
      };
      this.chart.setOption(option);
    },
    handleResize() {
      if (this.chart) {
        this.chart.resize();
      }
    }
  }
};
```

### 2. React 集成

```jsx
// React 组件示例
import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

function EChartsComponent({ option }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // 初始化图表
    if (chartRef.current && !chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    // 设置配置项
    if (chartInstance.current) {
      chartInstance.current.setOption(option, true);
    }

    // 处理窗口大小变化
    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener('resize', handleResize);

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, [option]);

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
}
```

## 性能优化

### 1. 数据量优化

```javascript
// 数据量大时，使用数据压缩或降采样
// 示例：对大数据进行降采样
function downsample(data, targetLength) {
  if (data.length <= targetLength) return data;
  const step = Math.ceil(data.length / targetLength);
  return data.filter((_, index) => index % step === 0);
}

const sampledData = downsample(largeData, 1000);
```

### 2. 懒加载和按需渲染

```javascript
// 仅在组件可见时初始化图表
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !chartInitialized) {
        initChart();
        chartInitialized = true;
        observer.disconnect();
      }
    });
  },
  { threshold: 0.1 }
);

observer.observe(chartDom);
```

### 3. 使用 canvas 渲染器

```javascript
// 明确指定渲染器为 canvas（默认值）
const myChart = echarts.init(domElement, null, {
  renderer: 'canvas'
});
```

### 4. 禁用不必要的动画

```javascript
option = {
  animation: false, // 全局禁用动画
  series: [{
    type: 'line',
    animation: false, // 单个系列禁用动画
    data: [10, 20, 30]
  }]
};
```

### 5. 使用大数据量优化配置

```javascript
option = {
  // 大数据量下的优化配置
  series: [{
    type: 'line',
    data: largeData,
    large: true, // 启用大数据量优化
    largeThreshold: 2000, // 大数据量的阈值
    sampling: 'lttb' // 数据采样策略
  }]
};
```

## 高级功能

### 1. 自定义主题

```javascript
// 创建自定义主题
const theme = {
  color: ['#5470c6', '#91cc75'],
  backgroundColor: '#f5f5f5',
  textStyle: {},
  title: {
    textStyle: { color: '#333' }
  },
  // 其他配置...
};

// 注册主题
echarts.registerTheme('myTheme', theme);

// 使用主题
const myChart = echarts.init(domElement, 'myTheme');
```

### 2. 自定义工具函数

```javascript
// 注册自定义工具
myChart.extendComponentModel({
  type: 'myComponent',
  defaultOption: {
    // 默认配置
  }
});
```

### 3. 导出图表

```javascript
// 导出为图片
const imgUrl = myChart.getDataURL({
  type: 'png',
  pixelRatio: 2, // 分辨率
  backgroundColor: '#fff'
});

// 下载图片
const link = document.createElement('a');
link.href = imgUrl;
link.download = 'chart.png';
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
```

### 4. 地图使用

```javascript
// 加载并注册地图
$.getJSON('world.json', function(geoJson) {
  echarts.registerMap('world', geoJson);
  
  // 使用地图
  const option = {
    series: [{
      type: 'map',
      map: 'world',
      roam: true,
      label: {
        show: true
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 16
        }
      }
    }]
  };
  
  myChart.setOption(option);
});
```

## 常见问题解答

**Q: 如何处理大数据量渲染？**
A: 可以使用数据降采样、启用 large 模式、减少不必要的动画和交互、使用 canvas 渲染器等方法。

**Q: 图表在移动设备上显示不完整怎么办？**
A: 确保设置了正确的容器大小，使用响应式布局，监听窗口大小变化并调用 resize() 方法。

**Q: 如何实现图表的数据实时更新？**
A: 使用 setOption 方法增量更新数据，配合定时器或 WebSocket 实现实时数据更新。

**Q: 如何自定义提示框内容？**
A: 使用 tooltip 的 formatter 函数自定义提示内容。

**Q: 如何设置图表的响应式布局？**
A: 监听窗口大小变化，调用 resize() 方法，容器使用百分比宽度。

## 资源推荐

- [ECharts 官方文档](https://echarts.apache.org/zh/index.html)
- [ECharts 示例集](https://echarts.apache.org/examples/zh/index.html)
- [ECharts GitHub 仓库](https://github.com/apache/echarts)
- [ECharts 教程](https://echarts.apache.org/zh/tutorial.html)

## 最佳实践

1. **按需引入**：只引入需要的模块，减小包体积
2. **响应式设计**：确保在不同设备上正确显示
3. **合理设置容器大小**：避免图表渲染异常
4. **及时销毁实例**：组件卸载时销毁图表实例
5. **避免频繁渲染**：使用防抖或节流控制更新频率
6. **数据优化**：预处理和优化数据，减少计算负担
7. **合理配置动画**：根据需要开启或关闭动画
8. **提供合理的默认值**：确保图表在无数据时也能正常显示