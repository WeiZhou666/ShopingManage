<template>
  <div class="home">
    <!-- 顶部信息栏 -->
    <el-card shadow="hover" class="welcome-card">
      <div class="welcome-content">
        <div class="welcome-left">
          <span class="welcome-icon">👋</span>
          <span class="welcome-text">{{ userStore.userInfo?.name || 'admin' }}，欢迎回来！</span>
        </div>
        <div class="welcome-right">
          <span class="login-info">上次登录：{{ userStore.userInfo?.lastLoginTime || '-' }}</span>

        </div>
      </div>
    </el-card>

    <!-- 统计卡片-flex布局 -->
    <el-row :gutter="20" class="count-cards">
      <el-col v-for="item in countData" :key="item.name" class="count-col">
        <el-card shadow="hover" class="count-card">
          <div class="count-inner">
            <div class="count-icon" :style="{ backgroundColor: item.color }">
              <component :is="item.icon" />
            </div>
            <div class="count-detail">
              <p class="count-label">{{ item.name }}</p>
              <p class="count-value">{{ item.value }}</p>
              <p class="count-trend" :class="item.trend > 0 ? 'up' : 'down'">
                <span class="trend-icon">{{ item.trend > 0 ? '↑' : '↓' }}</span>
                {{ Math.abs(item.trend) }}%
              </p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 折线图图表区域 -->
    <el-row class="charts-row">
      <el-col>
        <el-card shadow="hover" class="chart-card">
          <div ref="lineChartRef" style="height: 300px;"></div>
        </el-card>
      </el-col>
    </el-row>
    <!-- top5柱状图，访问数据饼图图表区域 -->
    <el-row class="charts-row" :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover" class="chart-card">
          <div ref="barChartRef" style="height: 300px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover" class="chart-card">
          <div ref="pieChartRef" style="height: 300px;"></div>
        </el-card>
      </el-col>

    </el-row>


  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';
import { Money, ShoppingCart, Box, Clock, ChatDotRound } from '@element-plus/icons-vue';
import { useUserStore } from '@/stores/user';
import api from '@/api/api';

const userStore = useUserStore();

const tableData = ref([]);
const countData = ref([]);
const lineChartRef = ref(null);
const barChartRef = ref(null);
const pieChartRef = ref(null);

let lineChart = null;
let barChart = null;
let pieChart = null;



const getCountData = async () => {
  const data = await api.getCountData();
  const iconMap = { ShoppingCart, Money, Box, Clock, ChatDotRound };
  countData.value = data.data.countData.map(item => ({
    ...item,
    icon: iconMap[item.icon] || ShoppingCart
  }));
};


//折线图图表初始化 
const initLineChart = async () => {
  const res = await api.getChartData();
  const chartData = res.data.chartData;
  lineChart = echarts.init(lineChartRef.value);

  const option = {
    title: { text: '销售趋势', left: 'center', top: 10 },
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '15%', containLabel: true },
    xAxis: { type: 'category', boundaryGap: false, data: chartData.xData },
    yAxis: { type: 'value' },
    series: [{
      name: '销售额',
      type: 'line',
      data: chartData.seriesData,
      smooth: true,
      itemStyle: { color: '#409eff' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
            { offset: 1, color: 'rgba(64, 158, 255, 0.05)' }
          ]
        }
      }
    }]
  };
  lineChart.setOption(option);
};

//top5柱状图图表初始化 
const initBarChart = async () => {
  const res = await api.getBarChartData();
  const chartData = res.data.barChartData;
  barChart = echarts.init(barChartRef.value);

  const option = {
    title: { text: '品类销售 Top 5', left: 'center', top: 10 },
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '15%', containLabel: true },
    xAxis: { type: 'value' },
    yAxis: {
      type: 'category',
      data: chartData.xData,
      axisLabel: { interval: 0 }
    },
    series: [{
      name: '销量',
      type: 'bar',
      data: chartData.seriesData,
      itemStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 1, y2: 0,
          colorStops: [
            { offset: 0, color: '#95d475' },
            { offset: 1, color: '#67c23a' }
          ]
        }
      },
      barWidth: '50%'
    }]
  };
  barChart.setOption(option);
};

//访问数据饼图图表初始化 
const initPieChart = async () => {
  const res = await api.getPieChartData();
  const chartData = res.data.pieChartData;
  pieChart = echarts.init(pieChartRef.value);

  const option = {
    title: { text: '访问来源', left: 'center', top: 10 },
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: {
      orient: 'horizontal',
      bottom: 10,
      left: 'center'
    },
    series: [{
      name: '访问来源',
      type: 'pie',
      radius: ['40%', '60%'],
      center: ['50%', '45%'],
      data: chartData,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };
  pieChart.setOption(option);
};

//图表缩放自适应
const handleResize = () => {
  lineChart?.resize();
  barChart?.resize();
  pieChart?.resize();
};

//图表初始化
onMounted(() => {
  getCountData();
  initLineChart();
  initBarChart();
  initPieChart();
  window.addEventListener('resize', handleResize);
});

//图表销毁
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  lineChart?.dispose();
  barChart?.dispose();
  pieChart?.dispose();
});
</script>

<style scoped lang="less">
.home {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.welcome-card {
  margin-bottom: 20px;
  border: none;
  border-radius: 8px;

  :deep(.el-card__body) {
    padding: 16px 20px;
  }
}

.welcome-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.welcome-icon {
  font-size: 24px;
}

.welcome-text {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.welcome-right {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #909399;
  font-size: 14px;
}

.divider {
  color: #dcdfe6;
}

.count-cards {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: nowrap;
  gap: 16px;
}

.count-col {
  flex: 1;
  min-width: 0;
}

.count-card {
  border: none;
  border-radius: 8px;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }

  :deep(.el-card__body) {
    padding: 20px;
  }
}

.count-inner {
  display: flex;
  align-items: center;
  gap: 16px;
}

.count-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 24px;
}

.count-detail {
  flex: 1;
}

.count-label {
  margin: 0;
  font-size: 14px;
  color: #909399;
  line-height: 1.4;
}

.count-value {
  margin: 4px 0;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  line-height: 1.4;
}

.count-trend {
  margin: 0;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;

  &.up {
    color: #67c23a;
  }

  &.down {
    color: #f56c6c;
  }
}

.trend-icon {
  margin-right: 2px;
}

.charts-row {
  margin-bottom: 20px;
}

.chart-card {
  border: none;
  border-radius: 8px;

  :deep(.el-card__body) {
    padding: 0;
  }
}

.bottom-row {
  margin-bottom: 20px;
}

.user-card {
  border: none;
  border-radius: 8px;
  height: 100%;

  :deep(.el-card__body) {
    padding: 0;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;

  span {
    font-weight: 600;
    color: #303133;
  }
}

:deep(.el-table) {
  font-size: 14px;

  th {
    background-color: #fafafa;
    color: #606266;
    font-weight: 600;
  }

  td {
    padding: 12px 16px;
  }
}

@media (max-width: 1200px) {
  .count-cards .el-col {
    width: 50%;
    margin-bottom: 16px;
  }

  .charts-row .el-col {
    width: 100%;
    margin-bottom: 16px;
  }

  .bottom-row .el-col {
    width: 100%;
    margin-bottom: 16px;
  }
}
</style>
