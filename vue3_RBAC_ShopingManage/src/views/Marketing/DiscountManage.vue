<template>
  <div class="discount-manage-container">
    <div class="discount-header">
      <div class="header-left">
        <el-button v-permission="'marketing:add'" type="primary" v-debounce:500="handleAdd">
          <el-icon>
            <Plus />
          </el-icon>
          新增折扣活动
        </el-button>
      </div>
      <el-form :inline="true" class="search-form">
        <el-form-item label="商品名称">
          <el-input v-model="searchName" placeholder="请输入商品名称" clearable @keyup.enter="handleSearch" />
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
        <el-table-column prop="productName" label="商品名称" width="200" />
        <el-table-column prop="originalPrice" label="原价" width="100">
          <template #default="{ row }">
            ¥{{ row.originalPrice.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="discountPrice" label="折扣价" width="100">
          <template #default="{ row }">
            <span class="discount-price">¥{{ row.discountPrice.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="discountRate" label="折扣比例" width="100">
          <template #default="{ row }">
            <el-tag type="success">{{ (row.discountRate * 10).toFixed(1) }}折</el-tag>
          </template>
        </el-table-column>
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

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑折扣活动' : '新增折扣活动'" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="商品名称">
          <el-select v-model="form.productId" placeholder="请选择商品">
            <el-option v-for="item in productOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="原价">
          <el-input v-model.number="form.originalPrice" placeholder="商品日常售价" style="width: 200px" />
          <span style="margin-left: 10px">元</span>
        </el-form-item>
        <el-form-item label="折扣价">
          <el-input v-model.number="form.discountPrice" placeholder="活动期间的售价" style="width: 200px" />
          <span style="margin-left: 10px">元</span>
        </el-form-item>
        <el-form-item label="折扣比例">
          <el-slider v-model="form.discountRate" :min="0.1" :max="0.9" :step="0.05"
            :format-tooltip="(val) => `${(val * 10).toFixed(1)}折`" />
          <span style="margin-left: 10px">{{ (form.discountRate * 10).toFixed(1) }}折</span>
        </el-form-item>
        <el-form-item label="活动时间">
          <el-date-picker v-model="form.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期" style="width: 300px" />
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
import { getDiscountList, updateDiscount, addDiscount, deleteDiscount } from '@/api/api'

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
  productId: '',
  originalPrice: 0,
  discountPrice: 0,
  discountRate: 0.8,
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
  { id: 8, name: '索尼WH-1000XM5' },
  { id: 9, name: '联想拯救者Y9000P' },
  { id: 10, name: '华硕ROG冰刃7' }
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

const loadDiscountList = async () => {
  loading.value = true
  try {
    const params = { pageNum: pageNum.value, pageSize: pageSize.value }
    if (searchName.value) params.name = searchName.value
    if (searchStatus.value) params.status = searchStatus.value
    const res = await getDiscountList(params)
    if (res && res.data) {
      tableData.value = res.data.list || []
      total.value = res.data.total || 0
    } else {
      tableData.value = []
      total.value = 0
    }
  } catch (error) {
    ElMessage.error('获取折扣活动列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pageNum.value = 1
  loadDiscountList()
}

const handleReset = () => {
  searchName.value = ''
  searchStatus.value = ''
  pageNum.value = 1
  loadDiscountList()
}

const handleAdd = () => {
  isEdit.value = false
  form.id = ''
  form.productId = ''
  form.originalPrice = 0
  form.discountPrice = 0
  form.discountRate = 0.8
  form.dateRange = []
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  form.id = row.id
  form.productId = row.productId
  form.originalPrice = row.originalPrice
  form.discountPrice = row.discountPrice
  form.discountRate = row.discountRate
  const dates = row.activePeriod.split(' ~ ')
  form.dateRange = dates.map(d => new Date(d))
  dialogVisible.value = true
}

const handleSave = async () => {
  if (!form.productId) {
    ElMessage.error('请选择参与商品')
    return
  }
  if (form.originalPrice <= 0) {
    ElMessage.error('请设置商品原价')
    return
  }
  if (form.discountPrice <= 0 || form.discountPrice >= form.originalPrice) {
    ElMessage.error('折扣价必须小于原价')
    return
  }
  if (!form.dateRange || form.dateRange.length !== 2) {
    ElMessage.error('请设置活动时间')
    return
  }

  const saveData = {
    ...form,
    discountRate: form.discountPrice / form.originalPrice,
    startDate: form.dateRange[0].toISOString().split('T')[0],
    endDate: form.dateRange[1].toISOString().split('T')[0]
  }

  try {
    if (isEdit.value) {
      await updateDiscount(saveData)
      ElMessage.success('修改成功')
    } else {
      await addDiscount(saveData)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    loadDiscountList()
  } catch (error) {
    ElMessage.error(isEdit.value ? '修改失败' : '新增失败')
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要删除折扣活动 ${row.productName} 吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteDiscount(row.id)
    ElMessage.success('删除成功')
    loadDiscountList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleSizeChange = (val) => {
  pageSize.value = val
  pageNum.value = 1
  loadDiscountList()
}

const handleCurrentChange = (val) => {
  pageNum.value = val
  loadDiscountList()
}

onMounted(() => {
  loadDiscountList()
})
</script>

<style scoped lang="less">
.discount-manage-container {
  padding: 20px;
  background: #fff;
  min-height: calc(100vh - 140px);
}

.discount-header {
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

.discount-price {
  color: #f56c6c;
  font-weight: bold;
  font-size: 14px;
}
</style>