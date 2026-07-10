<template>
  <div class="shipment-record-container">
    <div class="record-header">
      <el-form :inline="true" class="search-form">
        <el-form-item label="订单号">
          <el-input v-model="searchOrderNo" placeholder="请输入订单号" clearable @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item label="物流公司">
          <el-select v-model="searchCompany" placeholder="请选择物流公司" clearable style="width: 150px">
            <el-option label="全部" value="" />
            <el-option v-for="item in companyOptions" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="发货时间">
          <el-date-picker v-model="searchDateRange" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期" style="width: 250px" />
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

    <div class="table">
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="shipmentTime" label="发货时间" width="150" />
        <el-table-column prop="orderNo" label="订单编号" width="180" />
        <el-table-column prop="receiverName" label="收货人" width="100" />
        <el-table-column prop="companyName" label="物流公司" width="120" />
        <el-table-column prop="trackingNo" label="快递单号" width="180">
          <template #default="{ row }">
            <a :href="getTrackingUrl(row.companyCode, row.trackingNo)" target="_blank" class="tracking-link">
              {{ row.trackingNo }}
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="operator" label="操作人" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
          :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import api from '@/api/api'

const tableData = ref([])
const loading = ref(false)
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)

const searchOrderNo = ref('')
const searchCompany = ref('')
const searchDateRange = ref([])

const companyOptions = ref([
  { code: 'SF', name: '顺丰速运' },
  { code: 'ZTO', name: '中通快递' },
  { code: 'YTO', name: '圆通速递' },
  { code: 'YD', name: '韵达快递' },
  { code: 'JT', name: '极兔速递' },
  { code: 'DB', name: '德邦快递' },
  { code: 'EMS', name: 'EMS' },
  { code: 'OTHER', name: '其他' }
])

const getStatusType = (status) => {
  const types = {
    '已发货': 'success',
    '运输中': 'primary',
    '已签收': 'info',
    '异常': 'danger'
  }
  return types[status] || 'info'
}

const getStatusText = (status) => {
  return status || '未知'
}

const getTrackingUrl = (companyCode, trackingNo) => {
  const urls = {
    'SF': `https://www.sf-express.com/cn/sc/dynamic_function/waybill/#/search/${trackingNo}`,
    'ZTO': `https://www.zto.com/express/order.html?orderNo=${trackingNo}`,
    'YTO': `https://www.yto.net.cn/express/index/index.html?orderNo=${trackingNo}`,
    'YD': `https://www.yunda.com.cn/query?no=${trackingNo}`,
    'JT': `https://www.jtexpress.com.cn/query?orderNo=${trackingNo}`,
    'DB': `https://www.deppon.com/query?orderNo=${trackingNo}`,
    'EMS': `https://www.11183.com.cn/mailtracking/youzhengchaxun.html?mailNo=${trackingNo}`
  }
  return urls[companyCode] || `https://www.kuaidi100.com/?nu=${trackingNo}`
}

const formatDate = (date) => {
  if (!date) return null
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const getShipmentRecord = async () => {
  loading.value = true
  try {
    const params = { pageNum: pageNum.value, pageSize: pageSize.value }
    if (searchOrderNo.value) params.orderNo = searchOrderNo.value
    if (searchCompany.value) params.companyCode = searchCompany.value
    if (searchDateRange.value[0]) params.startDate = formatDate(searchDateRange.value[0])
    if (searchDateRange.value[1]) params.endDate = formatDate(searchDateRange.value[1])
    const res = await api.getShipmentRecordList(params)
    if (res && res.data) {
      tableData.value = res.data.list || []
      total.value = res.data.total || 0
    } else {
      tableData.value = []
      total.value = 0
    }
  } catch (error) {
    ElMessage.error('获取发货记录失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pageNum.value = 1
  getShipmentRecord()
}

const handleReset = () => {
  searchOrderNo.value = ''
  searchCompany.value = ''
  searchDateRange.value = []
  pageNum.value = 1
  getShipmentRecord()
}

const handleSizeChange = (val) => {
  pageSize.value = val
  pageNum.value = 1
  getShipmentRecord()
}

const handleCurrentChange = (val) => {
  pageNum.value = val
  getShipmentRecord()
}

onMounted(() => {
  getShipmentRecord()
})
</script>

<style scoped lang="less">
.shipment-record-container {
  padding: 20px;
  background: #fff;
  min-height: calc(100vh - 140px);
}

.record-header {
  margin-bottom: 20px;
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

.tracking-link {
  color: #409EFF;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}
</style>