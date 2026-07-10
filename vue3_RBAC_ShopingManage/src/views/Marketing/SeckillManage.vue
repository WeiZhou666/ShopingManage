<template>
  <div class="seckill-manage-container">
    <div class="seckill-header">
      <div class="header-left">
        <el-button v-permission="'marketing:add'" type="primary" v-debounce:500="handleAdd">
          <el-icon>
            <Plus />
          </el-icon>
          新增秒杀活动
        </el-button>
      </div>
      <el-form :inline="true" class="search-form">
        <el-form-item label="活动名称">
          <el-input v-model="searchName" placeholder="请输入活动名称" clearable @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchStatus" placeholder="请选择状态" clearable style="width: 120px">
            <el-option label="全部" value="" />
            <el-option label="未开始" value="pending" />
            <el-option label="进行中" value="active" />
            <el-option label="已结束" value="ended" />
          </el-select>
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
        <el-table-column prop="name" label="活动名称" width="180" />
        <el-table-column prop="productName" label="参与商品" width="200" />
        <el-table-column prop="originalPrice" label="原价" width="100">
          <template #default="{ row }">
            ¥{{ row.originalPrice.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="seckillPrice" label="秒杀价" width="100">
          <template #default="{ row }">
            <span class="seckill-price">¥{{ row.seckillPrice.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="seckillStock" label="秒杀库存" width="100" />
        <el-table-column prop="limitQuantity" label="限购数量" width="100">
          <template #default="{ row }">
            每人限购{{ row.limitQuantity }}件
          </template>
        </el-table-column>
        <el-table-column prop="soldQuantity" label="已售数量" width="100" />
        <el-table-column prop="activePeriod" label="活动时间" width="200" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="{ row }">
            <el-button v-permission="'marketing:edit'" link type="primary" size="small" @click="handleEdit(row)">
              <el-icon>
                <Edit />
              </el-icon>
              编辑
            </el-button>
            <el-button v-permission="'marketing:delete'" link type="danger" size="small"
              v-debounce:500="() => handleDelete(row)">
              <el-icon>
                <Delete />
              </el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
          :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>
    </div>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑秒杀活动' : '新增秒杀活动'" width="550px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="活动名称" prop="name" :rules="[{ required: true, message: '请输入活动名称' }]">
          <el-input v-model="form.name" placeholder="如：618限时秒杀" />
        </el-form-item>
        <el-form-item label="参与商品">
          <el-select v-model="form.productId" placeholder="请选择商品">
            <el-option v-for="item in productOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="原价">
          <el-input v-model.number="form.originalPrice" placeholder="商品原价" style="width: 200px" />
          <span style="margin-left: 10px">元</span>
        </el-form-item>
        <el-form-item label="秒杀价">
          <el-input v-model.number="form.seckillPrice" placeholder="活动期间的价格" style="width: 200px" />
          <span style="margin-left: 10px">元</span>
        </el-form-item>
        <el-form-item label="秒杀库存">
          <el-input v-model.number="form.seckillStock" placeholder="本次秒杀活动的库存数量" style="width: 200px" />
          <span style="margin-left: 10px">件</span>
        </el-form-item>
        <el-form-item label="限购数量">
          <el-input v-model.number="form.limitQuantity" placeholder="每个用户最多购买几件" style="width: 200px" />
          <span style="margin-left: 10px">件/人</span>
        </el-form-item>
        <el-form-item label="活动时间">
          <el-date-picker v-model="form.dateRange" type="datetimerange" range-separator="至" start-placeholder="开始时间"
            end-placeholder="结束时间" style="width: 400px" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" v-debounce:500="handleSave">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, Search, Refresh, Edit } from '@element-plus/icons-vue'
import { getSeckillList, updateSeckill, addSeckill, deleteSeckill } from '@/api/api'

const tableData = ref([])
const loading = ref(false)
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)

const searchName = ref('')
const searchStatus = ref('')

const dialogVisible = ref(false)
const isEdit = ref(false)
const form = reactive({
  id: '',
  name: '',
  productId: '',
  originalPrice: 0,
  seckillPrice: 0,
  seckillStock: 0,
  limitQuantity: 1,
  dateRange: []
})

const productOptions = ref([
  { id: 1, name: 'iPhone 15 Pro 256G' },
  { id: 2, name: 'MacBook Air M3' },
  { id: 3, name: 'AirPods Pro 2' },
  { id: 4, name: 'iPad Pro 11寸' },
  { id: 5, name: '小米14 Ultra' },
  { id: 6, name: '华为Mate 60 Pro' },
  { id: 7, name: '戴森V15吸尘器' },
  { id: 8, name: '索尼WH-1000XM5' }
])

const getStatusType = (status) => {
  const types = {
    'pending': 'warning',
    'active': 'success',
    'ended': 'info'
  }
  return types[status] || 'info'
}

const getStatusText = (status) => {
  const texts = {
    'pending': '未开始',
    'active': '进行中',
    'ended': '已结束'
  }
  return texts[status] || '未知'
}

const loadSeckillList = async () => {
  loading.value = true
  try {
    const params = { pageNum: pageNum.value, pageSize: pageSize.value }
    if (searchName.value) params.name = searchName.value
    if (searchStatus.value) params.status = searchStatus.value
    const res = await getSeckillList(params)
    if (res && res.data) {
      tableData.value = res.data.list || []
      total.value = res.data.total || 0
    } else {
      tableData.value = []
      total.value = 0
    }
  } catch (error) {
    ElMessage.error('获取秒杀活动列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pageNum.value = 1
  loadSeckillList()
}

const handleReset = () => {
  searchName.value = ''
  searchStatus.value = ''
  pageNum.value = 1
  loadSeckillList()
}

const handleAdd = () => {
  isEdit.value = false
  form.id = ''
  form.name = ''
  form.productId = ''
  form.originalPrice = 0
  form.seckillPrice = 0
  form.seckillStock = 0
  form.limitQuantity = 1
  form.dateRange = []
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  form.id = row.id
  form.name = row.name
  form.productId = row.productId
  form.originalPrice = row.originalPrice
  form.seckillPrice = row.seckillPrice
  form.seckillStock = row.seckillStock
  form.limitQuantity = row.limitQuantity
  const dates = row.activePeriod.split(' ~ ')
  form.dateRange = dates.map(d => new Date(d.replace(/-/g, '/')))
  dialogVisible.value = true
}

const handleSave = async () => {
  if (!form.name) {
    ElMessage.error('请输入活动名称')
    return
  }
  if (!form.productId) {
    ElMessage.error('请选择参与商品')
    return
  }
  if (form.originalPrice <= 0) {
    ElMessage.error('请设置商品原价')
    return
  }
  if (form.seckillPrice <= 0 || form.seckillPrice >= form.originalPrice) {
    ElMessage.error('秒杀价必须小于原价')
    return
  }
  if (form.seckillStock <= 0) {
    ElMessage.error('请设置秒杀库存')
    return
  }
  if (form.limitQuantity <= 0) {
    ElMessage.error('请设置限购数量')
    return
  }
  if (!form.dateRange || form.dateRange.length !== 2) {
    ElMessage.error('请设置活动时间')
    return
  }

  const formatDateTime = (date) => {
    const d = new Date(date)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:00`
  }

  const saveData = {
    ...form,
    startTime: formatDateTime(form.dateRange[0]),
    endTime: formatDateTime(form.dateRange[1])
  }

  try {
    if (isEdit.value) {
      await updateSeckill(saveData)
      ElMessage.success('修改成功')
    } else {
      await addSeckill(saveData)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    loadSeckillList()
  } catch (error) {
    ElMessage.error(isEdit.value ? '修改失败' : '新增失败')
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要删除秒杀活动 ${row.name} 吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteSeckill(row.id)
    ElMessage.success('删除成功')
    loadSeckillList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleSizeChange = (val) => {
  pageSize.value = val
  pageNum.value = 1
  loadSeckillList()
}

const handleCurrentChange = (val) => {
  pageNum.value = val
  loadSeckillList()
}

onMounted(() => {
  loadSeckillList()
})
</script>

<style scoped lang="less">
.seckill-manage-container {
  padding: 20px;
  background: #fff;
  min-height: calc(100vh - 140px);
}

.seckill-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;

  .header-left {
    display: flex;
    gap: 10px;
  }
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

.seckill-price {
  color: #f56c6c;
  font-weight: bold;
  font-size: 14px;
}
</style>