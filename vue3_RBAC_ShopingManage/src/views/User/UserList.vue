<template>
  <div class="user-container">
    <!-- 用户顶部操作 -->
    <div class="user-header">
      <div class="header-left">
        <el-button v-permission="'user:disable'" type="primary" v-debounce:500="handleAdd">
          <el-icon>
            <Plus />
          </el-icon>
          新增用户
        </el-button>

        <el-button v-permission="'user:delete'" type="danger" :disabled="selectedIds.length === 0"
          v-debounce:500="handleBatchDelete">
          <el-icon>
            <Delete />
          </el-icon>
          批量删除
        </el-button>
      </div>
      <el-form :inline="true" class="search-form">
        <el-form-item label="用户ID/昵称/手机号">
          <el-input v-model="searchKeyword" placeholder="请输入ID或昵称或手机号" clearable @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item label="用户标签">
          <el-select v-model="searchTags" placeholder="请选择标签" clearable style="width: 120px">
            <el-option label="全部" value="" />
            <el-option label="优质客户" :value="1" />
            <el-option label="普通客户" :value="2" />
            <el-option label="恶意用户" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchStatus" placeholder="请选择状态" clearable style="width: 100px">
            <el-option label="全部" value="" />
            <el-option label="正常" :value="1" />
            <el-option label="已禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="注册时间">
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
          <el-button type="primary" @click="handleReset">
            <el-icon>
              <Refresh />
            </el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 用户列表 -->
    <div class="table">
      <el-table :data="tableData" style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="用户ID" width="100" />
        <el-table-column prop="nickname" label="用户昵称" width="120" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="registerTime" label="注册时间" width="160" />
        <el-table-column prop="lastLoginTime" label="最后登录" width="160" />
        <el-table-column prop="totalConsumption" label="累计消费" width="120">
          <template #default="{ row }">
            {{ row.totalConsumption.toFixed(2) }} 元
          </template>
        </el-table-column>
        <el-table-column prop="orderCount" label="订单数" width="80" />
        <el-table-column prop="tags" label="用户标签" width="120">
          <template #default="{ row }">
            <el-tag :type="getTagType(row.tags)" size="small">
              {{ getTagName(row.tags) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '正常' : '已禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="260">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)">
              <el-icon>
                <View />
              </el-icon>
              查看详情
            </el-button>
            <el-button v-permission="'user:editTag'" link type="primary" size="small" @click="handleEditTags(row)">
              <el-icon>
                <Edit />
              </el-icon>
              编辑标签
            </el-button>
            <el-button v-if="row.status === 1" v-permission="'user:disable'" link type="danger" size="small"
              v-throttle:500="() => handleToggleStatus(row)">
              <el-icon>
                <Lock />
              </el-icon>
              禁用
            </el-button>
            <el-button v-else v-permission="'user:disable'" link type="success" size="small"
              v-throttle:500="() => handleToggleStatus(row)">
              <el-icon>
                <Unlock />
              </el-icon>
              启用
            </el-button>

            <el-button v-permission="'user:delete'" link type="danger" size="small"
              v-debounce:500="() => handleDelete(row)">
              <el-icon>
                <Delete />
              </el-icon>
              删除
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

    <!-- 编辑标签对话框 -->
    <el-dialog v-model="tagDialogVisible" title="编辑用户标签" width="400px">
      <el-form :model="editTagsForm" label-width="80px">
        <el-form-item label="用户标签">
          <el-radio-group v-model="editTagsForm.tags">
            <el-radio :value="1">优质客户</el-radio>
            <el-radio :value="2">普通客户</el-radio>
            <el-radio :value="3">恶意用户</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <!-- 对话框底部按钮 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="tagDialogVisible = false">取消</el-button>
          <el-button type="primary" v-debounce:500="handleSaveTags">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 新增用户对话框 -->
    <el-dialog v-model="addDialogVisible" title="新增用户" width="480px" @close="handleAddDialogClose">
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="100px">
        <el-form-item label="用户昵称" prop="nickname">
          <el-input v-model="addForm.nickname" placeholder="请输入用户昵称" maxlength="20" show-word-limit clearable />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="addForm.phone" placeholder="请输入手机号" maxlength="11" clearable />
        </el-form-item>
        <el-form-item label="用户标签" prop="tags">
          <el-radio-group v-model="addForm.tags">
            <el-radio :value="1">优质客户</el-radio>
            <el-radio :value="2">普通客户</el-radio>
            <el-radio :value="3">恶意用户</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="addForm.status">
            <el-radio :value="1">正常</el-radio>
            <el-radio :value="0">已禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="累计消费">
          <el-input-number v-model="addForm.totalConsumption" :min="0" :precision="2" :step="100" />
        </el-form-item>
        <el-form-item label="订单数">
          <el-input-number v-model="addForm.orderCount" :min="0" :step="1" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="addSubmitLoading" v-debounce:500="handleSaveAdd">确定新增</el-button>
        </span>
      </template>
    </el-dialog>
  </div>

</template>

<script setup>
import { ref, reactive, onMounted, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, Search, Refresh, View, Edit, Lock, Unlock } from '@element-plus/icons-vue'
import {
  getUserList,
  addUser,
  deleteUser,
  batchDeleteUsers,
  updateUserStatus,
  updateUserTags
} from '@/api/api'

const router = useRouter()
const route = useRoute()

const tableData = ref([])
const loading = ref(false)
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const selectedIds = ref([])

// 搜索条件
const searchKeyword = ref('')
const searchTags = ref('')
const searchStatus = ref('')
const searchDateRange = ref([])

// 编辑标签对话框
const tagDialogVisible = ref(false)
const editTagsForm = reactive({
  userId: '',
  tags: 2
})

// 新增用户对话框
const addDialogVisible = ref(false)
const addFormRef = ref()
const addSubmitLoading = ref(false)
// 新增用户表单默认数据，totalConsumption/orderCount/registerTime 由后端生成
const initialAddForm = () => ({
  nickname: '',
  phone: '',
  tags: 2,
  status: 1,
  totalConsumption: 0,
  orderCount: 0
})
const addForm = reactive(initialAddForm())

// 新增用户表单校验规则
const addFormRules = {
  nickname: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    { min: 1, max: 20, message: '昵称长度在 1-20 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ],
  tags: [
    { required: true, message: '请选择标签', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

// 用户标签映射 (tags 字段为互斥单选: 1=优质客户 2=普通客户 3=恶意用户)
const tagMap = {
  1: { name: '优质客户', type: 'success' },
  2: { name: '普通客户', type: 'info' },
  3: { name: '恶意用户', type: 'danger' }
}
const getTagName = (tags) => tagMap[tags]?.name || '未知'
const getTagType = (tags) => tagMap[tags]?.type || 'info'

// 更新URL参数（不刷新页面）
const updateUrlParams = () => {
  const query = {}
  if (pageNum.value !== 1) query.pageNum = pageNum.value
  if (pageSize.value !== 10) query.pageSize = pageSize.value
  if (searchKeyword.value) query.keyword = searchKeyword.value
  if (searchTags.value) query.tag = searchTags.value
  if (searchStatus.value) query.status = searchStatus.value
  if (searchDateRange.value[0]) query.startDate = formatDate(searchDateRange.value[0])
  if (searchDateRange.value[1]) query.endDate = formatDate(searchDateRange.value[1])
  router.push({ query })
}

// 格式化日期为 YYYY-MM-DD
const formatDate = (date) => {
  if (!date) return null
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// 获取用户列表
const loadUserList = async () => {
  loading.value = true
  try {
    const params = {
      pageNum: pageNum.value,
      pageSize: pageSize.value,
    }
    // 搜索条件,把参数到params中
    if (searchKeyword.value) params.keyword = searchKeyword.value
    if (searchTags.value) params.tags = searchTags.value
    if (searchStatus.value !== '') params.status = searchStatus.value
    if (searchDateRange.value[0]) params.startDate = formatDate(searchDateRange.value[0])
    if (searchDateRange.value[1]) params.endDate = formatDate(searchDateRange.value[1])
    const res = await getUserList(params)
    if (res && res.data) {
      tableData.value = res.data.list || []
      total.value = res.data.total || 0
    } else {
      tableData.value = []
      total.value = 0
    }
    // 强制触发响应式更新
    tableData.value = [...tableData.value]
  } catch (error) {
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pageNum.value = 1
  updateUrlParams()
  loadUserList()
}

// 重置
const handleReset = () => {
  searchKeyword.value = ''
  searchTags.value = ''
  searchStatus.value = ''
  searchDateRange.value = []
  pageNum.value = 1
  updateUrlParams()
  loadUserList()
}

// 多选
const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map(item => item.id)
}

// 新增用户 - 打开弹窗并重置表单
const handleAdd = () => {
  // 重置表单数据（避免上次填写残留）
  Object.assign(addForm, initialAddForm())
  // 清除校验状态（等弹窗渲染后再调用）
  nextTick(() => {
    addFormRef.value?.clearValidate()
  })
  addDialogVisible.value = true
}

// 新增用户 - 弹窗关闭时清理
const handleAddDialogClose = () => {
  addFormRef.value?.resetFields()
  Object.assign(addForm, initialAddForm())
  addSubmitLoading.value = false
}

// 新增用户 - 提交
const handleSaveAdd = async () => {
  if (!addFormRef.value) return
  try {
    await addFormRef.value.validate()
  } catch {
    // 校验未通过
    return
  }

  addSubmitLoading.value = true
  try {
    const res = await addUser({
      nickname: addForm.nickname,
      phone: addForm.phone,
      tags: addForm.tags,
      status: addForm.status,
      totalConsumption: addForm.totalConsumption,
      orderCount: addForm.orderCount
    })
    if (res && res.code === 200) {
      ElMessage.success(res.msg || '新增成功')
      addDialogVisible.value = false
      // 重新拉取列表（保持当前分页/筛选条件）
      loadUserList()
    } else {
      ElMessage.error(res?.msg || '新增失败')
    }
  } catch (error) {
    ElMessage.error('新增失败')
  } finally {
    addSubmitLoading.value = false
  }
}



// 查看用户详情
const handleView = (row) => {
  router.push({
    path: `/user/userdetail/${row.id}`,
    state: { userData: row }
  })
}

// 编辑标签
const handleEditTags = (row) => {
  editTagsForm.userId = row.id
  editTagsForm.tags = row.tags
  tagDialogVisible.value = true
}

// 保存标签
const handleSaveTags = async () => {
  try {
    await updateUserTags(editTagsForm.userId, editTagsForm.tags)
    // 同时禁用该用户 - 本地直接更新并触发响应式更新
    const idx = tableData.value.findIndex(u => u.id == editTagsForm.userId)
    if (idx > -1) {
      tableData.value[idx].status = 0
      // 强制触发响应式更新
      tableData.value = [...tableData.value]
    }
    ElMessage.success('标签更新成功，用户已禁用')
    tagDialogVisible.value = false
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 切换状态（禁用/启用）
const handleToggleStatus = async (row) => {
  const newStatus = row.status === 1 ? 0 : 1
  const actionText = newStatus === 1 ? '启用' : '禁用'

  try {
    await ElMessageBox.confirm(`确定要${actionText}该用户吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await updateUserStatus(row.id, newStatus)
    ElMessage.success(`${actionText}成功`)
    loadUserList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(`${actionText}失败`)
    }
  }
}

// 删除用户
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要删除用户 ${row.nickname} 吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteUser(row.id)
    ElMessage.success('删除成功')
    loadUserList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 个用户吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await batchDeleteUsers(selectedIds.value)
    ElMessage.success('批量删除成功')
    loadUserList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
    }
  }
}

// 分页大小改变
const handleSizeChange = (val) => {
  pageSize.value = val
  pageNum.value = 1
  updateUrlParams()
  loadUserList()
}

// 页码改变
const handleCurrentChange = (val) => {
  pageNum.value = val
  updateUrlParams()
  loadUserList()
}

// 从URL参数初始化搜索条件
const initParamsFromUrl = () => {
  const q = route.query
  const newPageNum = parseInt(q.pageNum) || 1
  const newPageSize = parseInt(q.pageSize) || 10
  const newPhone = q.keyword || ''
  const newTag = q.tags || ''
  const newStatus = q.status || ''

  // 只有当值真正变化时才更新，避免不必要的响应式触发
  if (pageNum.value !== newPageNum) pageNum.value = newPageNum
  if (pageSize.value !== newPageSize) pageSize.value = newPageSize
  if (searchKeyword.value !== newPhone) searchKeyword.value = newPhone
  if (searchTags.value !== newTag) searchTags.value = newTag
  if (searchStatus.value !== newStatus) searchStatus.value = newStatus

  // 处理日期范围，确保响应式更新
  const newStartDate = q.startDate ? new Date(q.startDate) : null
  const newEndDate = q.endDate ? new Date(q.endDate) : null

  if (searchDateRange.value[0]?.getTime() !== newStartDate?.getTime() ||
    searchDateRange.value[1]?.getTime() !== newEndDate?.getTime()) {
    searchDateRange.value = [newStartDate, newEndDate]
  }
}

// 监听URL变化（外部触发，如浏览器前进后退）
watch(() => route.fullPath, (newPath, oldPath) => {
  if (newPath !== oldPath) {
    console.log('[UserList] URL变化:', { newPath, oldPath })
    // 使用 nextTick 确保路由完全更新
    nextTick(() => {
      initParamsFromUrl()
      loadUserList()
    })
  }
})

onMounted(() => {
  initParamsFromUrl()
  loadUserList()
})
</script>

<style scoped lang="less">
.user-container {
  padding: 20px;
  background: #fff;
  min-height: calc(100vh - 140px);
}

.user-header {
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

.tag-margin {
  margin-right: 8px;
}
</style>
