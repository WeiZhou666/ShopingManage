<template>
  <div class="logistics-company-container">
    <div class="company-header">
      <div class="header-left">
        <el-button v-permission="'logistics:add'" type="primary" v-debounce:500="handleAdd">
          <el-icon>
            <Plus />
          </el-icon>
          新增物流公司
        </el-button>
      </div>
      <el-form :inline="true" class="search-form">
        <el-form-item label="公司名称">
          <el-input v-model="searchName" placeholder="请输入物流公司名称" clearable @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchStatus" placeholder="请选择状态" clearable style="width: 120px">
            <el-option label="全部" value="" />
            <el-option label="启用" :value="1" />
            <el-option label="停用" :value="0" />
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
        <el-table-column prop="name" label="物流公司名称" width="180" />
        <el-table-column prop="code" label="物流代码" width="120" />
        <el-table-column prop="website" label="官网" width="200">
          <template #default="{ row }">
            <a :href="row.website" target="_blank" class="link">{{ row.website }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="150" />
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="{ row }">
            <el-button v-permission="'logistics:edit'" link type="primary" size="small" @click="handleEdit(row)">
              <el-icon>
                <Edit />
              </el-icon>
              编辑
            </el-button>
            <el-button v-if="row.status === 1" v-permission="'logistics:status'" link type="primary" size="small"
              v-throttle:500="() => handleToggleStatus(row)">
              <el-icon>
                <Lock />
              </el-icon>
              停用
            </el-button>
            <el-button v-else v-permission="'logistics:status'" link type="success" size="small"
              v-throttle:500="() => handleToggleStatus(row)">
              <el-icon>
                <Unlock />
              </el-icon>
              启用
            </el-button>
            <el-button v-permission="'logistics:delete'" link type="danger" size="small"
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

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑物流公司' : '新增物流公司'" width="450px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="物流公司名称" prop="name" :rules="[{ required: true, message: '请输入物流公司名称' }]">
          <el-input v-model="form.name" placeholder="如：顺丰速运" />
        </el-form-item>
        <el-form-item label="物流代码" prop="code" :rules="[{ required: true, message: '请输入物流代码' }]">
          <el-input v-model="form.code" placeholder="如：SF" />
        </el-form-item>
        <el-form-item label="官网地址">
          <el-input v-model="form.website" placeholder="如：https://www.sf-express.com" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
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
import { Plus, Delete, Search, Refresh, Edit, Lock, Unlock } from '@element-plus/icons-vue'
import api from '@/api/api'

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
  code: '',
  website: '',
  status: 1
})

const getCompanyList = async () => {
  loading.value = true
  try {
    const params = { pageNum: pageNum.value, pageSize: pageSize.value }
    if (searchName.value) params.name = searchName.value
    if (searchStatus.value !== '') params.status = searchStatus.value
    const res = await api.getLogisticsCompanyList(params)
    if (res && res.data) {
      tableData.value = res.data.list || []
      total.value = res.data.total || 0
    } else {
      tableData.value = []
      total.value = 0
    }
  } catch (error) {
    ElMessage.error('获取物流公司列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pageNum.value = 1
  getCompanyList()
}

const handleReset = () => {
  searchName.value = ''
  searchStatus.value = ''
  pageNum.value = 1
  getCompanyList()
}

const handleAdd = () => {
  isEdit.value = false
  form.id = ''
  form.name = ''
  form.code = ''
  form.website = ''
  form.status = 1
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  form.id = row.id
  form.name = row.name
  form.code = row.code
  form.website = row.website
  form.status = row.status
  dialogVisible.value = true
}

const handleSave = async () => {
  if (!form.name || !form.code) {
    ElMessage.error('请填写必填项')
    return
  }
  try {
    if (isEdit.value) {
      await api.updateLogisticsCompany(form)
      ElMessage.success('修改成功')
    } else {
      await api.addLogisticsCompany(form)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    getCompanyList()
  } catch (error) {
    ElMessage.error(isEdit.value ? '修改失败' : '新增失败')
  }
}

const handleToggleStatus = async (row) => {
  const newStatus = row.status === 1 ? 0 : 1
  const actionText = newStatus === 0 ? '停用' : '启用'
  try {
    await ElMessageBox.confirm(`确定要${actionText}该物流公司吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }),
      await api.updateLogisticsCompanyStatus(row.id, newStatus)
    row.status = newStatus
    ElMessage.success(`${actionText}成功`)
  } catch {
    ElMessage.error(`${actionText}失败`)
  }
  //   await api.updateLogisticsCompanyStatus(row.id, newStatus)
  //   ElMessage.success(`${actionText}成功`)
  //   getCompanyList()
  // } catch (error) {
  //   if (error !== 'cancel') {
  //     ElMessage.error(`${actionText}失败`)
  //   }
  // }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要删除物流公司 ${row.name} 吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await api.deleteLogisticsCompany(row.id)
    const index = tableData.value.findIndex(item => item.id === row.id)
    if (index !== -1) {
      tableData.value.splice(index, 1)
    }
    total.value--
    if (total.value === 0) {
      pageNum.value--
      getCompanyList()
    }


    ElMessage.success('删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleSizeChange = (val) => {
  pageSize.value = val
  pageNum.value = 1
  getCompanyList()
}

const handleCurrentChange = (val) => {
  pageNum.value = val
  getCompanyList()
}

onMounted(() => {
  getCompanyList()
})
</script>

<style scoped lang="less">
.logistics-company-container {
  padding: 20px;
  background: #fff;
  min-height: calc(100vh - 140px);
}

.company-header {
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

.link {
  color: #409EFF;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}
</style>