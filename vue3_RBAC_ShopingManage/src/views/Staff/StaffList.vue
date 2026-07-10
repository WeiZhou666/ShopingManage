<template>
  <div class="staff-container">
    <!-- 顶部操作 -->
    <div class="staff-header">
      <div class="header-left">
        <el-button v-permission="'staff:manage'" type="primary" v-debounce:500="handleAdd">
          <el-icon>
            <Plus />
          </el-icon>
          新增员工
        </el-button>
        <el-button v-permission="'staff:manage'" type="danger" :disabled="selectedIds.length === 0"
          v-debounce:500="handleBatchDelete">
          <el-icon>
            <Delete />
          </el-icon>
          批量删除
        </el-button>
      </div>
      <el-form :inline="true" @submit.prevent="handleSearch" class="search-form">
        <el-form-item label="姓名/账号">
          <el-input v-model="searchKeyword" placeholder="输入姓名或账号搜索" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="searchRole" placeholder="请选择角色" clearable style="width: 140px">
            <el-option label="全部" value="" />
            <el-option label="超级管理员" value="super_admin" />
            <el-option label="运营人员" value="operator" />
            <el-option label="订单专员" value="order_staff" />
            <el-option label="财务人员" value="finance" />
            <el-option label="普通客服" value="customer_service" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchStatus" placeholder="请选择状态" clearable style="width: 100px">
            <el-option label="全部" value="" />
            <el-option label="正常" value="1" />
            <el-option label="已禁用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit" v-throttle:300="handleSearch">
            <el-icon>
              <Search />
            </el-icon>
            搜索
          </el-button>

        </el-form-item>
      </el-form>
    </div>

    <!-- 员工列表 -->
    <div class="table">
      <el-table :data="tableData" style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="employeeNo" label="员工工号" width="120" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="account" label="账号" width="120" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="role" label="角色" width="120">
          <template #default="{ row }">
            <el-tag :type="getRoleTagType(row.role)" size="small">
              {{ getRoleName(row.role) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="row.status === '1' ? 'success' : 'danger'" size="small">
              {{ row.status === '1' ? '正常' : '已禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastLogin" label="最后登录" width="180" />
        <el-table-column fixed="right" label="操作" width="240">
          <template #default="{ row }">
            <el-button v-permission="'staff:manage'" link type="primary" size="small" @click="handleEdit(row)">
              <el-icon>
                <Edit />
              </el-icon>
              编辑
            </el-button>
            <el-button v-permission="'staff:manage'" link type="warning" size="small"
              v-debounce:500="() => handleResetPassword(row)">
              <el-icon>
                <Key />
              </el-icon>
              重置密码
            </el-button>
            <el-button v-if="row.status === '1'" v-permission="'staff:manage'" link type="danger" size="small"
              v-throttle:500="() => handleToggleStatus(row)">
              <el-icon>
                <Lock />
              </el-icon>
              禁用
            </el-button>
            <el-button v-else v-permission="'staff:manage'" link type="success" size="small"
              v-throttle:500="() => handleToggleStatus(row)">
              <el-icon>
                <Unlock />
              </el-icon>
              启用
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
          :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handlePageSizeChange"
          @current-change="handleCurrentPageChange" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, Search, Edit, Key, Lock, Unlock } from '@element-plus/icons-vue'
import { staffList, roleMap } from '@/api/mockData/staff'

const router = useRouter()

const tableData = ref([])
const loading = ref(false)
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const selectedIds = ref([])

const searchKeyword = ref('')
const searchRole = ref('')
const searchStatus = ref('')


const getRoleName = (role) => {
  return roleMap[role]?.name || role
}

const getRoleTagType = (role) => {
  return roleMap[role]?.type || 'info'
}

// 获取员工列表
const fetchList = () => {
  loading.value = true
  setTimeout(() => {
    let result = [...staffList]

    // 关键词筛选
    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase()
      result = result.filter(item =>
        item.name.toLowerCase().includes(keyword) ||
        item.account.toLowerCase().includes(keyword)
      )
    }

    // 角色筛选
    if (searchRole.value) {
      result = result.filter(item => item.role === searchRole.value)
    }

    // 状态筛选
    if (searchStatus.value) {
      result = result.filter(item => item.status === searchStatus.value)
    }

    total.value = result.length

    // 分页
    const start = (pageNum.value - 1) * pageSize.value
    const end = start + pageSize.value
    tableData.value = result.slice(start, end)

    loading.value = false
  }, 300)
}

// 搜索
const handleSearch = () => {
  pageNum.value = 1
  fetchList()
}



// 选择变化
const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map(item => item.id)
}

// 添加员工
const handleAdd = () => {
  router.push('/staff/staffDetail')
}

// 编辑员工
const handleEdit = (row) => {
  router.push({
    path: `/staff/staffDetail/${row.id}`,
    query: { staffData: JSON.stringify(row) }
  })
}

// 重置密码
const handleResetPassword = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要重置员工"${row.name}"的密码吗？重置后密码将恢复为初始密码 123456。`,
      '重置密码',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    ElMessage.success(`员工"${row.name}"的密码已重置为 123456`)
  } catch {
    // 用户取消
  }
}

// 切换状态
const handleToggleStatus = async (row) => {
  const newStatus = row.status === '1' ? '0' : '1'
  const actionText = newStatus === '1' ? '解禁' : '禁用'
  const statusText = newStatus === '1' ? '正常' : '已禁用'

  try {
    await ElMessageBox.confirm(
      `确定要${actionText}员工"${row.name}"吗？${actionText}后该账号将${newStatus === '1' ? '可以' : '无法'}登录。`,
      `${actionText}员工`,
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    // 模拟API调用
    row.status = newStatus
    ElMessage.success(`员工"${row.name}"已${actionText}，当前状态：${statusText}`)
  } catch {
    // 用户取消
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedIds.value.length} 名员工吗？删除后不可恢复。`,
      '批量删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    ElMessage.success(`已删除 ${selectedIds.value.length} 名员工`)
    fetchList()
  } catch {
    // 用户取消
  }
}

// 分页大小改变
const handlePageSizeChange = () => {
  fetchList()
}

// 页码改变
const handleCurrentPageChange = () => {
  fetchList()
}

onMounted(() => {
  fetchList()
})
</script>

<style scoped>
.staff-container {
  padding: 20px;
}

.staff-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.header-left {
  display: flex;
  gap: 10px;
}

.search-form {
  margin-top: 0;
}

.table {
  background: #fff;
  border-radius: 4px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  padding: 20px 0;
}
</style>
