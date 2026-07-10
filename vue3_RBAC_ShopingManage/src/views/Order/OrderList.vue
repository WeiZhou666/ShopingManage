<template>
  <div class="order-container">
    <!-- 快捷筛选 -->
    <div class="quick-filter">
      <el-radio-group v-model="quickStatus" @change="handleQuickFilter">
        <el-radio-button value="">全部</el-radio-button>
        <el-radio-button value="0">待付款</el-radio-button>
        <el-radio-button value="1">待发货</el-radio-button>
        <el-radio-button value="2">已发货</el-radio-button>
        <el-radio-button value="3">已完成</el-radio-button>
        <el-radio-button value="4">已退款</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 高级搜索 -->
    <div class="search-section">
      <el-form :inline="true" class="search-form">
        <el-form-item label="时间">
          <el-date-picker v-model="searchDateRange" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期" style="width: 260px" />
        </el-form-item>
        <el-form-item label="订单号">
          <el-input v-model="searchOrderNo" placeholder="请输入订单号" clearable @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-throttle:300="handleSearch">
            <el-icon>
              <Search />
            </el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon>
              <Refresh />
            </el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 订单列表 -->
    <div class="table">
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="orderNo" label="订单编号" width="160" />
        <el-table-column label="用户信息" width="150">
          <template #default="{ row }">
            <div class="user-info">
              <span>{{ row.userName }}</span>
              <span class="user-phone">{{ maskPhone(row.userPhone) }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="商品信息" width="180">
          <template #default="{ row }">
            <div class="product-info">
              <span>{{ row.productName }}</span>
              <span class="product-count">x{{ row.productCount }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="订单金额" width="110">
          <template #default="{ row }">¥{{ row.amount.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="createTime" label="下单时间" width="170" />
        <el-table-column prop="status" label="订单状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="160">
          <template #default="{ row }">
            <el-button v-if="row.status === 1" v-permission="'order:delivery'" link type="primary" size="small"
              v-debounce:500="() => handleDelivery(row)">
              <el-icon>
                <Van />
              </el-icon>
              发货
            </el-button>
            <el-button v-if="row.status === 0" v-permission="'order:close'" link type="warning" size="small"
              v-debounce:500="() => handleClose(row)">
              <el-icon>
                <CircleClose />
              </el-icon>
              关闭
            </el-button>
            <el-button link type="primary" size="small" @click="handleView(row)">
              <el-icon>
                <View />
              </el-icon>
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
          :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, View, Van, CircleClose } from '@element-plus/icons-vue'
import { getOrderList, deliveryOrder, closeOrder } from '@/api/api'

const router = useRouter()
const route = useRoute()

const tableData = ref([])
const loading = ref(false)
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 搜索条件
const searchOrderNo = ref('')
const searchDateRange = ref([])
const quickStatus = ref('')

// 状态映射
const statusMap = { 0: '待付款', 1: '待发货', 2: '已发货', 3: '已完成', 4: '已退款' }
const statusTypeMap = { 0: 'warning', 1: 'primary', 2: 'info', 3: 'success', 4: 'danger' }

const getStatusText = (status) => statusMap[status] || '未知'
const getStatusType = (status) => statusTypeMap[status] || 'info'
const maskPhone = (phone) => phone ? phone.slice(0, 3) + '****' + phone.slice(7) : ''

// 更新URL参数
const updateUrlParams = () => {
  const query = {}
  if (pageNum.value !== 1) query.pageNum = pageNum.value
  if (pageSize.value !== 10) query.pageSize = pageSize.value
  if (quickStatus.value !== '') query.status = quickStatus.value
  if (searchOrderNo.value) query.orderNo = searchOrderNo.value
  if (searchDateRange.value[0]) query.startDate = formatDate(searchDateRange.value[0])
  if (searchDateRange.value[1]) query.endDate = formatDate(searchDateRange.value[1])
  router.push({ query })
}

const formatDate = (date) => {
  if (!date) return null
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// 获取订单列表
const loadOrderList = async () => {
  loading.value = true
  try {
    const params = { pageNum: pageNum.value, pageSize: pageSize.value }
    if (quickStatus.value !== '') params.status = quickStatus.value
    if (searchOrderNo.value) params.orderNo = searchOrderNo.value
    if (searchDateRange.value[0]) params.startDate = formatDate(searchDateRange.value[0])
    if (searchDateRange.value[1]) params.endDate = formatDate(searchDateRange.value[1])
    const res = await getOrderList(params)
    if (res && res.data) {
      tableData.value = res.data.list || []
      total.value = res.data.total || 0
    } else {
      tableData.value = []
      total.value = 0
    }
    tableData.value = [...tableData.value]
  } catch (error) {
    ElMessage.error('获取订单列表失败')
  } finally {
    loading.value = false
  }
}

// 快捷筛选
const handleQuickFilter = (val) => {
  quickStatus.value = val
  pageNum.value = 1
  updateUrlParams()
  loadOrderList()
}

// 搜索
const handleSearch = () => {
  pageNum.value = 1
  updateUrlParams()
  loadOrderList()
}

// 重置
const handleReset = () => {
  quickStatus.value = ''
  searchOrderNo.value = ''
  searchDateRange.value = []
  pageNum.value = 1
  updateUrlParams()
  loadOrderList()
}

// 查看详情
const handleView = (row) => {
  router.push({
    path: `/order/orderdetail/${row.orderNo}`,
    state: { orderData: row }
  })
}

// 发货
const handleDelivery = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要为订单 ${row.orderNo} 发货吗？`, '确认发货', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    })
    await deliveryOrder(row.id)
    ElMessage.success('发货成功')
    loadOrderList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('发货失败')
    }
  }
}

// 关闭订单
const handleClose = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要关闭订单 ${row.orderNo} 吗？`, '确认关闭', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await closeOrder(row.id)
    ElMessage.success('订单已关闭')
    loadOrderList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('关闭失败')
    }
  }
}

// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  pageNum.value = 1
  updateUrlParams()
  loadOrderList()
}

const handleCurrentChange = (val) => {
  pageNum.value = val
  updateUrlParams()
  loadOrderList()
}

// URL初始化
const initParamsFromUrl = () => {
  const q = route.query
  const newPageNum = parseInt(q.pageNum) || 1
  const newPageSize = parseInt(q.pageSize) || 10
  const newStatus = q.status || ''
  const newOrderNo = q.orderNo || ''

  if (pageNum.value !== newPageNum) pageNum.value = newPageNum
  if (pageSize.value !== newPageSize) pageSize.value = newPageSize
  if (quickStatus.value !== newStatus) quickStatus.value = newStatus
  if (searchOrderNo.value !== newOrderNo) searchOrderNo.value = newOrderNo

  const newStartDate = q.startDate ? new Date(q.startDate) : null
  const newEndDate = q.endDate ? new Date(q.endDate) : null
  if (searchDateRange.value[0]?.getTime() !== newStartDate?.getTime() ||
    searchDateRange.value[1]?.getTime() !== newEndDate?.getTime()) {
    searchDateRange.value = [newStartDate, newEndDate]
  }
}

watch(() => route.fullPath, (newPath, oldPath) => {
  if (newPath !== oldPath) {
    setTimeout(() => {
      initParamsFromUrl()
      loadOrderList()
    }, 50)
  }
})

onMounted(() => {
  initParamsFromUrl()
  loadOrderList()
})
</script>

<style scoped lang="less">
.order-container {
  padding: 20px;
  background: #fff;
  min-height: calc(100vh - 140px);
}

.quick-filter {
  margin-bottom: 20px;
}

.search-section {
  margin-bottom: 20px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.search-form {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.table {
  background: #fff;
  border-radius: 8px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.user-info,
.product-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-phone {
  font-size: 12px;
  color: #909399;
}

.product-count {
  font-size: 12px;
  color: #909399;
}
</style>
