<template>
  <div class="user-detail">
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
      <div class="header-right">
        <el-button type="danger" v-throttle:500="toggleUserStatus" :disabled="!hasUserData">
          {{ userData.status === 1 ? '禁用用户' : '启用用户' }}
        </el-button>
      </div>
    </div>

    <!-- 未查询：只展示查询 -->
    <div v-if="!searched" class="query-page">
      <el-card shadow="hover" class="query-card">
        <div class="query-area">
          <el-input v-model="searchId" placeholder="请输入用户ID" style="width: 260px" @keyup.enter="handleSearch" />
          <el-button type="primary" v-throttle:300="handleSearch">查询</el-button>
        </div>
      </el-card>
    </div>

    <!-- 查无结果 -->
    <div v-else-if="searched && !hasUserData" class="query-page">
      <el-card shadow="hover" class="query-card">
        <div class="query-area">
          <el-input v-model="searchId" placeholder="请输入用户ID" style="width: 260px" @keyup.enter="handleSearch" />
          <el-button type="primary" v-throttle:300="handleSearch">查询</el-button>
        </div>
      </el-card>
      <el-empty description="未找到该用户" />
    </div>

    <!-- 查询成功：用户详情 -->
    <template v-else-if="hasUserData">
      <!-- 基本信息 -->
      <el-card shadow="hover" class="info-card">
        <template #header>
          <div class="card-header"><span>基本信息</span></div>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="用户ID">{{ userData.id }}</el-descriptions-item>
          <el-descriptions-item label="用户昵称">{{ userData.nickname }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ userData.phone }}</el-descriptions-item>
          <el-descriptions-item label="注册时间">{{ userData.registerTime }}</el-descriptions-item>
          <el-descriptions-item label="最后登录">{{ userData.lastLoginTime }}</el-descriptions-item>
          <el-descriptions-item label="账号状态">
            <el-tag :type="userData.status === 1 ? 'success' : 'danger'">
              {{ userData.status === 1 ? '正常' : '已禁用' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="用户标签" :span="2">
            <div class="tags-wrapper">
              <el-tag v-for="tag in userData.tags" :key="tag" :type="getTagType(tag)" effect="dark">
                {{ tag }}
              </el-tag>
              <el-button size="small" text @click="editTags">修改标签</el-button>
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 消费统计 & 用户标签 -->
      <el-row :gutter="20" class="stats-row">
        <el-col :span="12">
          <el-card shadow="hover" class="info-card">
            <template #header>
              <div class="card-header"><span>消费统计</span></div>
            </template>
            <div class="stats-grid">
              <div class="stat-item">
                <p class="stat-label">累计消费金额</p>
                <p class="stat-value">¥{{ userData.totalConsumption.toFixed(2) }}</p>
              </div>
              <div class="stat-item">
                <p class="stat-label">订单总数</p>
                <p class="stat-value">{{ userData.orderCount }} 单</p>
              </div>
              <div class="stat-item">
                <p class="stat-label">平均客单价</p>
                <p class="stat-value">¥{{ userData.avgOrderAmount.toFixed(2) }}</p>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="hover" class="info-card">
            <template #header>
              <div class="card-header"><span>用户标签说明</span></div>
            </template>
            <div class="tag-list">
              <div class="tag-item">
                <el-tag type="warning" effect="dark">⭐</el-tag>
                <span class="tag-name">优质客户</span>
                <span class="tag-desc">累计消费满1000元或订单数≥10单</span>
              </div>
              <div class="tag-item">
                <el-tag type="info" effect="dark">灰色</el-tag>
                <span class="tag-name">普通客户</span>
                <span class="tag-desc">默认标签</span>
              </div>
              <div class="tag-item">
                <el-tag type="danger" effect="dark">🔴</el-tag>
                <span class="tag-name">恶意用户</span>
                <span class="tag-desc">被禁用或被标记</span>
              </div>
            </div>
            <div class="tag-action">
              <el-button size="small" type="primary" @click="editTags">修改标签</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 收货地址 -->
      <el-card shadow="hover" class="info-card">
        <template #header>
          <div class="card-header"><span>收货地址</span></div>
        </template>
        <el-table :data="userData.addresses" style="width: 100%">
          <el-table-column label="默认" width="80">
            <template #default="{ row }">
              <el-tag v-if="row.isDefault" type="success" size="small">默认</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="收货人" width="120" />
          <el-table-column prop="phone" label="手机号" width="150" />
          <el-table-column prop="address" label="收货地址" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button size="small" text @click="setDefault(row)">设为默认</el-button>
              <el-button size="small" text @click="editAddress(row)">编辑</el-button>
              <el-button size="small" text type="danger" v-debounce:500="() => deleteAddress(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 最近订单记录 -->
      <el-card shadow="hover" class="info-card">
        <template #header>
          <div class="card-header">
            <span>最近订单记录</span>
            <el-button size="small" text type="primary">查看全部</el-button>
          </div>
        </template>
        <el-table :data="userData.recentOrders" style="width: 100%">
          <el-table-column prop="orderId" label="订单编号" width="150" />
          <el-table-column prop="product" label="商品" />
          <el-table-column prop="amount" label="金额" width="100">
            <template #default="{ row }">¥{{ row.amount }}</template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getOrderStatusType(row.status)" size="small">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="time" label="时间" width="160" />
        </el-table>
      </el-card>

      <!-- 操作日志 -->
      <el-card shadow="hover" class="info-card">
        <template #header>
          <div class="card-header"><span>操作日志</span></div>
        </template>
        <el-timeline>
          <el-timeline-item v-for="(log, index) in userData.operationLogs" :key="index" :timestamp="log.time"
            placement="top">
            <el-card shadow="hover">
              <p><strong>{{ log.operator }}</strong> {{ log.action }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-card>
    </template>

    <!-- 修改标签弹窗 -->
    <el-dialog v-model="tagDialogVisible" title="修改用户标签" width="400px">
      <el-form :model="tagForm" label-width="80px">
        <el-form-item label="用户标签">
          <el-checkbox-group v-model="tagForm.selectedTags">
            <el-checkbox label="优质客户" />
            <el-checkbox label="普通客户" />
            <el-checkbox label="恶意用户" />
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="tagDialogVisible = false">取消</el-button>
          <el-button type="primary" v-debounce:500="saveTags">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '@/api/api'

const router = useRouter()
const route = useRoute()

const searchId = ref('')
const loading = ref(false)
const searched = ref(false)
const hasUserData = ref(false)

const userData = reactive({
  id: '',
  nickname: '',
  phone: '',
  registerTime: '',
  lastLoginTime: '',
  totalConsumption: 0,
  orderCount: 0,
  avgOrderAmount: 0,
  status: 1,
  tags: [],
  addresses: [],
  recentOrders: [],
  operationLogs: []
})

// 标签相关
const tagDialogVisible = ref(false)
const tagForm = reactive({ selectedTags: [] })

const getTagType = (tag) => {
  const types = { '优质客户': 'success', '普通客户': 'info', '恶意用户': 'danger' }
  return types[tag] || 'info'
}

const getOrderStatusType = (status) => {
  const map = { '待付款': 'warning', '待发货': 'primary', '已发货': 'info', '已完成': 'success', '已退款': 'info' }
  return map[status] || 'info'
}

const loadUserDetail = async (id) => {
  loading.value = true
  searched.value = true
  try {
    const res = await api.getUserDetail(id)
    if (res && res.data) {
      Object.assign(userData, res.data)
      hasUserData.value = true
    } else {
      Object.assign(userData, { id: '', nickname: '', tags: [], addresses: [], recentOrders: [], operationLogs: [] })
      hasUserData.value = false
    }
  } catch {
    ElMessage.error('获取用户详情失败')
    hasUserData.value = false
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  if (!searchId.value.trim()) {
    ElMessage.warning('请输入用户ID')
    return
  }
  router.replace(`/user/userdetail/${searchId.value.trim()}`)
  loadUserDetail(searchId.value.trim())
}

const goBack = () => router.push('/user/userlist')

const toggleUserStatus = () => {
  const action = userData.status === 1 ? '禁用' : '启用'
  ElMessageBox.confirm(`确定要${action}该用户吗？`, '提示', {
    confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
  }).then(() => {
    userData.status = userData.status === 1 ? 0 : 1
    ElMessage.success(`${action}成功`)
  }).catch(() => { })
}

const editTags = () => {
  tagForm.selectedTags = [...userData.tags]
  tagDialogVisible.value = true
}

const saveTags = () => {
  userData.tags = [...tagForm.selectedTags]
  tagDialogVisible.value = false
  ElMessage.success('标签修改成功')
}

const setDefault = (row) => {
  userData.addresses.forEach(item => { item.isDefault = item.id === row.id })
  ElMessage.success('已设为默认地址')
}

const editAddress = () => { ElMessage.info('编辑地址功能') }

const deleteAddress = (row) => {
  ElMessageBox.confirm('确定要删除该地址吗？', '提示', {
    confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
  }).then(() => {
    const index = userData.addresses.findIndex(item => item.id === row.id)
    if (index > -1) userData.addresses.splice(index, 1)
    ElMessage.success('删除成功')
  }).catch(() => { })
}

onMounted(() => {
  const userId = route.params.id
  if (userId) {
    searchId.value = userId
    loadUserDetail(userId)
    return
  }
  const stateData = history.state?.userData
  if (stateData?.id) {
    searchId.value = stateData.id
    loadUserDetail(stateData.id)
  }
})
</script>

<style scoped lang="less">
.user-detail {
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
    padding: 16px 20px;
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

.stats-row {
  margin-bottom: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #909399;
}

.stat-value {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.tag-list {
  margin-bottom: 16px;
}

.tag-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;

  .tag-name {
    font-weight: 500;
    color: #303133;
    min-width: 80px;
  }

  .tag-desc {
    color: #909399;
    font-size: 13px;
  }
}

.tag-action {
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.tags-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
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
