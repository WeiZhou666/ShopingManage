<template>
  <div class="order-detail">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <el-button @click="goBack">
          <el-icon>
            <ArrowLeft />
          </el-icon>
          返回列表
        </el-button>
      </div>
    </div>

    <!-- 未查询：只展示查询 -->
    <div v-if="!searched" class="query-page">
      <el-card shadow="hover" class="query-card">
        <div class="query-area">
          <el-input v-model="searchOrderNo" placeholder="请输入订单号" style="width: 260px" @keyup.enter="handleQuery" />
          <el-button type="primary" v-throttle:300="handleQuery">查询</el-button>
        </div>
      </el-card>
    </div>

    <!-- 查无结果 -->
    <div v-else-if="searched && !hasOrderNo" class="query-page">
      <el-card shadow="hover" class="query-card">
        <div class="query-area">
          <el-input v-model="searchOrderNo" placeholder="请输入订单号" style="width: 260px" @keyup.enter="handleQuery" />
          <el-button type="primary" v-throttle:300="handleQuery">查询</el-button>
        </div>
      </el-card>
      <el-empty description="未找到该订单" />
    </div>

    <!-- 查询成功：订单详情 -->
    <template v-else-if="hasOrderNo">
      <!-- 订单状态 -->
      <el-card shadow="hover" class="info-card">
        <template #header>
          <div class="card-header"><span>订单状态</span></div>
        </template>
        <div class="status-section">
          <el-tag :type="getStatusType(orderData.status)" size="large" class="current-status">
            {{ orderData.status_text }}
          </el-tag>

          <div class="status-timeline">
            <div class="tl-steps">
              <div v-for="(step, idx) in statusSteps" :key="idx" class="tl-step"
                :class="{ active: step.active, passed: step.passed }">
                <div class="tl-dot">
                  <el-icon v-if="step.passed">
                    <Check />
                  </el-icon>
                  <span v-else>{{ idx + 1 }}</span>
                </div>
                <div class="tl-label">{{ step.label }}</div>
                <div class="tl-time">{{ step.time || '' }}</div>
              </div>
              <div v-for="idx in statusSteps.length - 1" :key="'a' + idx" class="tl-arrow"
                :class="{ active: statusSteps[idx].active || statusSteps[idx].passed }">
                <el-icon>
                  <ArrowRight />
                </el-icon>
              </div>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 基本信息 + 收货人 -->
      <el-row :gutter="20" class="info-row">
        <el-col :span="12">
          <el-card shadow="hover" class="info-card">
            <template #header>
              <div class="card-header"><span>订单基本信息</span></div>
            </template>
            <el-descriptions :column="1" border>
              <el-descriptions-item label="订单编号">{{ orderData.order_no }}</el-descriptions-item>
              <el-descriptions-item label="下单时间">{{ orderData.create_time }}</el-descriptions-item>
              <el-descriptions-item label="支付方式">{{ orderData.payment_method }}</el-descriptions-item>
              <el-descriptions-item label="订单状态">
                <el-tag :type="getStatusType(orderData.status)" size="small">{{ orderData.status_text }}</el-tag>
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="hover" class="info-card">
            <template #header>
              <div class="card-header"><span>收货人信息</span></div>
            </template>
            <el-descriptions v-if="orderData.recipient" :column="1" border>
              <el-descriptions-item label="收货人">{{ orderData.recipient.name }}</el-descriptions-item>
              <el-descriptions-item label="手机号">{{ maskPhone(orderData.recipient.phone) }}</el-descriptions-item>
              <el-descriptions-item label="地址">{{ orderData.recipient.address }}</el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
      </el-row>

      <!-- 商品信息 -->
      <el-card shadow="hover" class="info-card">
        <template #header>
          <div class="card-header"><span>商品信息</span></div>
        </template>
        <el-table :data="orderData.products" style="width: 100%">
          <el-table-column prop="name" label="商品名称" />
          <el-table-column prop="spec" label="规格" width="120" />
          <el-table-column label="单价" width="120">
            <template #default="{ row }">¥{{ row.price.toLocaleString() }}</template>
          </el-table-column>
          <el-table-column prop="count" label="数量" width="80" />
          <el-table-column label="金额小计" width="140">
            <template #default="{ row }">¥{{ row.subtotal.toLocaleString() }}</template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 价格明细 -->
      <el-card shadow="hover" class="info-card">
        <template #header>
          <div class="card-header"><span>价格明细</span></div>
        </template>
        <div class="price-detail">
          <div class="price-row">
            <span class="price-label">商品总价：</span>
            <span class="price-value">¥{{ orderData.amount.toLocaleString() }}</span>
          </div>
          <div class="price-row">
            <span class="price-label">运费：</span>
            <span class="price-value">{{ orderData.freight > 0 ? '+ ¥' + orderData.freight : '+ ¥0' }}</span>
          </div>
          <div class="price-row" v-if="orderData.coupon > 0">
            <span class="price-label">优惠券：</span>
            <span class="price-value coupon">- ¥{{ orderData.coupon }}</span>
          </div>
          <el-divider />
          <div class="price-row total">
            <span class="price-label">实付金额：</span>
            <span class="price-total">¥{{ orderData.paid_amount.toLocaleString() }}</span>
            <el-tag v-if="orderData.paid" type="success" size="small" class="paid-tag">已支付</el-tag>
          </div>
        </div>
      </el-card>

      <!-- 物流信息 -->
      <el-card v-if="orderData.status >= 1" shadow="hover" class="info-card">
        <template #header>
          <div class="card-header"><span>物流信息</span></div>
        </template>
        <div v-if="orderData.logistics" class="logistics-info">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="物流公司">{{ orderData.logistics.company }}</el-descriptions-item>
            <el-descriptions-item label="快递单号">{{ orderData.logistics.tracking_no }}</el-descriptions-item>
          </el-descriptions>
        </div>
        <div v-else class="logistics-form">
          <el-form :inline="true">
            <el-form-item label="物流公司">
              <el-select v-model="logisticsForm.company" placeholder="请选择物流公司" style="width: 160px">
                <el-option v-for="c in logisticsOptions" :key="c" :label="c" :value="c" />
              </el-select>
            </el-form-item>
            <el-form-item label="快递单号">
              <el-input v-model="logisticsForm.trackingNo" placeholder="请输入快递单号" style="width: 200px" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" v-debounce:500="confirmDelivery">确认发货</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>

      <!-- 操作日志 -->
      <el-card shadow="hover" class="info-card">
        <template #header>
          <div class="card-header"><span>操作日志</span></div>
        </template>
        <el-timeline>
          <el-timeline-item v-for="(log, idx) in orderData.logs" :key="idx" :timestamp="log.time" placement="top">
            <el-card shadow="hover">
              <p><strong>{{ log.operator }}</strong> {{ log.action }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-card>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, ArrowRight, Check } from '@element-plus/icons-vue'
import api from '@/api/api'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const hasOrderNo = ref(false)
const searched = ref(false)
const searchOrderNo = ref('')

const orderData = reactive({
  id: '',
  order_no: '',
  status: -1,
  status_text: '',
  create_time: '',
  pay_time: '',
  delivery_time: '',
  complete_time: '',
  payment_method: '',
  amount: 0,
  freight: 0,
  coupon: 0,
  paid_amount: 0,
  recipient: null,
  products: [],
  logistics: null,
  logs: []
})

const logisticsOptions = ['顺丰速运', '中通快递', '圆通速递', '韵达快递', '京东物流']
const logisticsForm = reactive({ company: '顺丰速运', trackingNo: '' })

const statusTypeMap = { 0: 'warning', 1: 'primary', 2: 'info', 3: 'success', 4: 'danger' }
const getStatusType = (s) => statusTypeMap[s] || 'info'
const maskPhone = (phone) => phone ? phone.slice(0, 3) + '****' + phone.slice(7) : ''

const statusSteps = computed(() => {
  if (orderData.status === 4) {
    return [
      { label: '提交订单', time: orderData.create_time, active: false, passed: true },
      { label: '已付款', time: orderData.pay_time, active: false, passed: true },
      { label: '已退款', time: orderData.logs[orderData.logs.length - 1]?.time || '', active: true, passed: false }
    ]
  }
  const steps = [
    { label: '提交订单', time: orderData.create_time, active: false, passed: false },
    { label: '已付款', time: orderData.pay_time, active: false, passed: false },
    { label: '待发货', time: orderData.delivery_time, active: false, passed: false },
    { label: '已发货', time: orderData.delivery_time, active: false, passed: false },
    { label: '已完成', time: orderData.complete_time, active: false, passed: false }
  ]
  // status 0→passed: step0; active: step1 (待付款状态下)
  // status 1→passed: step0,step1; active: step2
  const activeIndex = orderData.status + 1
  steps.forEach((s, i) => {
    if (i <= orderData.status) s.passed = true
    if (i === activeIndex) s.active = true
  })
  return steps
})

const loadDetail = async (orderNo) => {
  loading.value = true
  searched.value = true
  try {
    const res = await api.getOrderDetail(orderNo)
    if (res && res.data) {
      Object.assign(orderData, res.data)
      hasOrderNo.value = true
    } else {
      Object.assign(orderData, { id: '', order_no: '', status: -1 })
      hasOrderNo.value = false
    }
  } catch {
    ElMessage.error('获取订单详情失败')
    hasOrderNo.value = false
  } finally {
    loading.value = false
  }
}

const handleQuery = () => {
  if (!searchOrderNo.value.trim()) {
    ElMessage.warning('请输入订单号')
    return
  }
  router.replace(`/order/orderdetail/${searchOrderNo.value.trim()}`)
  loadDetail(searchOrderNo.value.trim())
}

const confirmDelivery = async () => {
  if (!logisticsForm.trackingNo) {
    ElMessage.warning('请输入快递单号')
    return
  }
  try {
    await ElMessageBox.confirm('确认发货？', '提示', {
      confirmButtonText: '确定', cancelButtonText: '取消', type: 'info'
    })
    await api.deliveryOrder(orderData.id)
    ElMessage.success('发货成功')
    loadDetail(orderData.order_no)
  } catch (e) {
    if (e !== 'cancel') ElMessage.error('发货失败')
  }
}

const goBack = () => router.push('/order/orderlist')

onMounted(() => {
  const orderNo = route.params.id
  if (orderNo) {
    searchOrderNo.value = orderNo
    loadDetail(orderNo)
    return
  }
  const stateData = history.state?.orderData
  if (stateData?.orderNo) {
    searchOrderNo.value = stateData.order_no
    loadDetail(stateData.order_no)
  }
})
</script>

<style scoped lang="less">
.order-detail {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 140px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.query-page {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.query-card {
  border: none;
  border-radius: 8px;
  width: 100%;
  max-width: 480px;

  :deep(.el-card__body) {
    padding: 24px 20px;
  }
}

.query-area {
  display: flex;
  align-items: center;
  gap: 12px;
}

.info-card {
  margin-bottom: 20px;
  border: none;
  border-radius: 8px;

  :deep(.el-card__header) {
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f0;
  }

  :deep(.el-card__body) {
    padding: 20px;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
    font-weight: 600;
    color: #303133;
    font-size: 16px;
  }
}

.status-section {
  .current-status {
    margin-bottom: 24px;
  }
}

.status-timeline {
  overflow-x: auto;
}

.tl-steps {
  display: flex;
  align-items: flex-start;
  gap: 0;
  min-width: 700px;
}

.tl-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  min-width: 80px;

  .tl-dot {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #e4e7ed;
    color: #909399;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    z-index: 1;
  }

  .tl-label {
    margin-top: 8px;
    font-size: 13px;
    color: #909399;
    white-space: nowrap;
  }

  .tl-time {
    margin-top: 4px;
    font-size: 11px;
    color: #c0c4cc;
    white-space: nowrap;
  }

  &.passed .tl-dot {
    background: #67c23a;
    color: #fff;
  }

  &.active .tl-dot {
    background: #409eff;
    color: #fff;
  }

  &.passed .tl-label,
  &.active .tl-label {
    color: #303133;
    font-weight: 500;
  }

  &.passed .tl-time,
  &.active .tl-time {
    color: #909399;
  }
}

.tl-arrow {
  display: flex;
  align-items: center;
  padding: 0 4px;
  margin-top: 6px;
  color: #dcdfe6;
  font-size: 18px;

  &.active {
    color: #409eff;
  }
}

.price-detail {
  max-width: 400px;
}

.price-row {
  display: flex;
  align-items: center;
  padding: 6px 0;

  .price-label {
    color: #606266;
    min-width: 80px;
  }

  .price-value {
    color: #303133;
    font-weight: 500;

    &.coupon {
      color: #67c23a;
    }
  }

  &.total {
    .price-label {
      font-weight: 600;
    }

    .price-total {
      font-size: 20px;
      font-weight: 700;
      color: #f56c6c;
    }

    .paid-tag {
      margin-left: 12px;
    }
  }
}

.logistics-form {
  padding: 8px 0;
}

:deep(.el-descriptions__label) {
  background-color: #fafafa;
  font-weight: 600;
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

:deep(.el-timeline-item__content) {
  .el-card {
    margin-bottom: 0;
  }

  p {
    margin: 0;
    line-height: 1.6;
  }
}
</style>
