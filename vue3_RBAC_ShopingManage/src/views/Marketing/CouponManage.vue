<template>
  <div class="coupon-manage-container">
    <div class="coupon-header">
      <div class="header-left">
        <el-button v-permission="'marketing:add'" type="primary" v-debounce:500="handleAdd">
          <el-icon>
            <Plus />
          </el-icon>
          新增优惠券
        </el-button>
      </div>
      <el-form :inline="true" class="search-form">
        <el-form-item label="优惠券名称">
          <el-input v-model="searchName" placeholder="请输入优惠券名称" clearable @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="searchType" placeholder="请选择类型" clearable style="width: 120px">
            <el-option label="全部" value="" />
            <el-option label="满减券" value="full_reduction" />
            <el-option label="折扣券" value="discount" />
          </el-select>
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
        <el-table-column prop="name" label="优惠券名称" width="180" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 'full_reduction' ? 'primary' : 'success'">
              {{ row.type === 'full_reduction' ? '满减券' : '折扣券' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="threshold" label="使用门槛" width="120">
          <template #default="{ row }">
            满{{ row.threshold }}元可用
          </template>
        </el-table-column>
        <el-table-column prop="discount" label="优惠内容" width="150">
          <template #default="{ row }">
            <template v-if="row.type === 'full_reduction'">
              减{{ row.discount }}元
            </template>
            <template v-else>
              打{{ (row.discount * 10).toFixed(1) }}折
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="totalQuantity" label="发放总量" width="100" />
        <el-table-column prop="receivedQuantity" label="已领取" width="100" />
        <el-table-column prop="usedQuantity" label="已使用" width="100" />
        <el-table-column prop="validPeriod" label="有效期" width="200" />
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

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑优惠券' : '新增优惠券'" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="优惠券名称" prop="name" :rules="[{ required: true, message: '请输入优惠券名称' }]">
          <el-input v-model="form.name" placeholder="如：新人满100减20" />
        </el-form-item>
        <el-form-item label="优惠券类型">
          <el-radio-group v-model="form.type" @change="handleTypeChange">
            <el-radio label="full_reduction">满减券</el-radio>
            <el-radio label="discount">折扣券</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="使用门槛">
          <el-input v-model.number="form.threshold" placeholder="满X元可用" style="width: 200px" />
          <span style="margin-left: 10px">元</span>
        </el-form-item>
        <el-form-item :label="form.type === 'full_reduction' ? '优惠金额' : '折扣比例'">
          <el-input v-model.number="form.discount" :placeholder="form.type === 'full_reduction' ? '减X元' : '如：0.8 表示8折'"
            style="width: 200px" />
          <span style="margin-left: 10px">{{ form.type === 'full_reduction' ? '元' : '' }}</span>
        </el-form-item>
        <el-form-item label="发放总量">
          <el-input v-model.number="form.totalQuantity" placeholder="本次活动发放多少张" style="width: 200px" />
          <span style="margin-left: 10px">张</span>
        </el-form-item>
        <el-form-item label="有效期">
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
import { getCouponList, updateCoupon, addCoupon, deleteCoupon } from '@/api/api'

const tableData = ref([])
const loading = ref(false)
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)

const searchName = ref('')
const searchType = ref('')
const searchStatus = ref('')

const dialogVisible = ref(false)
const isEdit = ref(false)
const form = reactive({
  id: '',
  name: '',
  type: 'full_reduction',
  threshold: 0,
  discount: 0,
  totalQuantity: 0,
  dateRange: []
})

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

const handleTypeChange = () => {
  form.discount = 0
}

const loadCouponList = async () => {
  loading.value = true
  try {
    const params = { pageNum: pageNum.value, pageSize: pageSize.value }
    if (searchName.value) params.name = searchName.value
    if (searchType.value) params.type = searchType.value
    if (searchStatus.value) params.status = searchStatus.value
    const res = await getCouponList(params)
    if (res && res.data) {
      tableData.value = res.data.list || []
      total.value = res.data.total || 0
    } else {
      tableData.value = []
      total.value = 0
    }
  } catch (error) {
    ElMessage.error('获取优惠券列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pageNum.value = 1
  loadCouponList()
}

const handleReset = () => {
  searchName.value = ''
  searchType.value = ''
  searchStatus.value = ''
  pageNum.value = 1
  loadCouponList()
}

const handleAdd = () => {
  isEdit.value = false
  form.id = ''
  form.name = ''
  form.type = 'full_reduction'
  form.threshold = 0
  form.discount = 0
  form.totalQuantity = 0
  form.dateRange = []
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  form.id = row.id
  form.name = row.name
  form.type = row.type
  form.threshold = row.threshold
  form.discount = row.discount
  form.totalQuantity = row.totalQuantity
  const dates = row.validPeriod.split(' ~ ')
  form.dateRange = dates.map(d => new Date(d))
  dialogVisible.value = true
}

const handleSave = async () => {
  if (!form.name) {
    ElMessage.error('请输入优惠券名称')
    return
  }
  if (form.threshold <= 0) {
    ElMessage.error('请设置有效使用门槛')
    return
  }
  if (form.type === 'full_reduction' && form.discount <= 0) {
    ElMessage.error('请设置优惠金额')
    return
  }
  if (form.type === 'discount' && (form.discount <= 0 || form.discount >= 1)) {
    ElMessage.error('折扣比例必须在0-1之间')
    return
  }
  if (form.totalQuantity <= 0) {
    ElMessage.error('请设置发放总量')
    return
  }
  if (!form.dateRange || form.dateRange.length !== 2) {
    ElMessage.error('请设置有效期')
    return
  }

  const saveData = {
    ...form,
    startDate: form.dateRange[0].toISOString().split('T')[0],
    endDate: form.dateRange[1].toISOString().split('T')[0]
  }

  try {
    if (isEdit.value) {
      await updateCoupon(saveData)
      ElMessage.success('修改成功')
    } else {
      await addCoupon(saveData)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    loadCouponList()
  } catch (error) {
    ElMessage.error(isEdit.value ? '修改失败' : '新增失败')
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要删除优惠券 ${row.name} 吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteCoupon(row.id)
    ElMessage.success('删除成功')
    loadCouponList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleSizeChange = (val) => {
  pageSize.value = val
  pageNum.value = 1
  loadCouponList()
}

const handleCurrentChange = (val) => {
  pageNum.value = val
  loadCouponList()
}

onMounted(() => {
  loadCouponList()
})
</script>

<style scoped lang="less">
.coupon-manage-container {
  padding: 20px;
  background: #fff;
  min-height: calc(100vh - 140px);
}

.coupon-header {
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
</style>