<template>
  <div class="product-container">
    <!-- 顶部操作 -->
    <div class="product-header">
      <div class="header-left">
        <el-button v-permission="'product:add'" type="primary" v-debounce:500="handleAdd">
          <el-icon>
            <Plus />
          </el-icon>
          新增商品
        </el-button>
        <el-button v-permission="'product:delete'" type="danger" :disabled="selectedIds.length === 0"
          v-debounce:500="handleBatchDelete">
          <el-icon>
            <Delete />
          </el-icon>
          批量删除
        </el-button>
      </div>
      <el-form :inline="true" class="search-form">
        <el-form-item label="名称/ID">
          <el-input v-model="searchKeyword" placeholder="输入名称或ID均可搜索" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="searchCategory" placeholder="请选择分类" clearable style="width: 120px">
            <el-option label="全部" value="" />
            <el-option label="服饰" value="服饰" />
            <el-option label="数码" value="数码" />
            <el-option label="美妆" value="美妆" />
            <el-option label="食品" value="食品" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchStatus" placeholder="请选择状态" clearable style="width: 100px">
            <el-option label="全部" value="" />
            <el-option label="上架中" :value="1" />
            <el-option label="已下架" :value="0" />
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

    <!-- 商品列表 -->
    <div class="table">
      <el-table :data="tableData" style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="商品ID" width="100" />
        <el-table-column prop="name" label="商品名称" min-width="180" show-overflow-tooltip />
        <el-table-column prop="category" label="商品分类" width="100" />
        <el-table-column prop="price" label="销售价" width="100">
          <template #default="{ row }">¥{{ row.price }}</template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="80" />
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '上架中' : '已下架' }}

            </el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="240">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)">
              <el-icon>
                <View />
              </el-icon>
              查看
            </el-button>
            <el-button v-permission="'product:edit'" link type="primary" size="small" @click="handleEdit(row)">
              <el-icon>
                <Edit />
              </el-icon>
              编辑
            </el-button>
            <el-button v-if="row.status === 1" v-permission="'product:shelf'" link type="warning" size="small"
              v-throttle:500="() => handleToggleStatus(row)">
              <el-icon>
                <Bottom />
              </el-icon>
              下架
            </el-button>
            <el-button v-else v-permission="'product:shelf'" link type="success" size="small"
              v-throttle:500="() => handleToggleStatus(row)">
              <el-icon>
                <Top />
              </el-icon>
              上架
            </el-button>
            <el-popconfirm v-permission="'product:delete'" title="确定删除该商品？" @confirm="handleDelete(row)">
              <template #reference>
                <el-button link type="danger" size="small">
                  <el-icon>
                    <Delete />
                  </el-icon>
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
          :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handlePageSizeChange"
          @current-change="handleCurrentPagenNumChange" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, Search, Refresh, View, Edit, Top, Bottom } from '@element-plus/icons-vue'
import { getProductList, updateProductStatus, deleteProduct, batchDeleteProducts } from '@/api/api'

const router = useRouter()

const tableData = ref([])
const loading = ref(false)
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const selectedIds = ref([])

const searchKeyword = ref('')
const searchCategory = ref('')
const searchStatus = ref('')


//获取商品列表数据
const fetchList = async () => {
  loading.value = true
  try {
    const params = { pageNum: pageNum.value, pageSize: pageSize.value }
    if (searchKeyword.value) params.keyword = searchKeyword.value
    if (searchCategory.value) params.category = searchCategory.value
    if (searchStatus.value !== '') params.status = searchStatus.value

    const res = await getProductList(params)
    if (res.code === 200) {
      tableData.value = res.data.list || []
      total.value = res.data.total || 0
      console.log(res.data)
    }
  } catch (error) {
    ElMessage.error('获取商品列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索商品
const handleSearch = () => {
  pageNum.value = 1
  fetchList()
}

// 重置搜索条件
const handleReset = () => {
  searchKeyword.value = ''
  searchCategory.value = ''
  searchStatus.value = ''
  pageNum.value = 1
  fetchList()
}

// 选择商品
const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map(item => item.id)
}

// 添加商品跳转编辑页面
const handleAdd = () => {
  router.push('/product/productedit')
}

// 查看商品详情跳转编辑页面
const handleView = (row) => {
  router.push({
    path: `/product/productedit/${row.id}`,
    state: { productData: row }
  })
}

// 点击编辑商品跳转编辑页面
const handleEdit = (row) => {
  router.push({
    path: `/product/productedit/${row.id}`,
    state: { productData: row }
  })
}

// 点击上架/下架商品，乐观更新状态
const handleToggleStatus = async (row) => {
  const newStatus = row.status === 1 ? 0 : 1
  const actionText = newStatus === 1 ? '上架' : '下架'

  try {
    await ElMessageBox.confirm(`确定要${actionText}该商品吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
  } catch {
    return
  }

  try {
    await updateProductStatus(row.id, newStatus)
    row.status = newStatus
    ElMessage.success(`${actionText}成功`)
  } catch {
    ElMessage.error(`${actionText}失败`)
  }
}

// 点击删除商品，乐观删除状态
const handleDelete = async (row) => {
  const index = tableData.value.findIndex(item => item.id === row.id)
  if (index === -1) return

  const removedRow = tableData.value.splice(index, 1)[0]

  try {
    await deleteProduct(row.id)
    ElMessage.success('删除成功')
    // 清理选中的 ID
    const selectedIndex = selectedIds.value.findIndex(id => id === row.id)
    if (selectedIndex !== -1) selectedIds.value.splice(selectedIndex, 1)
    // 如果当前页数据为空且不是第一页，则回退一页并重新拉取
    if (tableData.value.length === 0 && pageNum.value > 1) {
      pageNum.value--
      await fetchList()
    }
  } catch (error) {
    tableData.value.splice(index, 0, removedRow)
    ElMessage.error('删除失败')
  }
}

// 点击批量删除商品，乐观删除状态
const handleBatchDelete = async () => {
  if (selectedIds.value.length === 0) return

  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 个商品吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const idsToDelete = [...selectedIds.value]
    // 立即从界面移除
    tableData.value = tableData.value.filter(item => !idsToDelete.includes(item.id))

    await batchDeleteProducts(idsToDelete)
    ElMessage.success('批量删除成功')
    selectedIds.value = []

    if (tableData.value.length === 0 && pageNum.value > 1) {
      pageNum.value--
      await fetchList()
    }
  } catch (error) {
    if (error !== 'cancel') {
      await fetchList()  // 删除失败，重新拉取数据恢复
      ElMessage.error('批量删除失败')
    } else {
      // 用户取消删除，也需要恢复数据（因为已经移除了）
      await fetchList()
    }
  }
}

// 分页事件处理-改变每页显示数量pageSize，刷新当前页数据
const handlePageSizeChange = (val) => {

  pageSize.value = val
  // 改变每页显示数量后，重置当前页码为第一页
  pageNum.value = 1
  // 刷新当前页数据
  fetchList()
}

// 分页事件处理-改变当前页码pageNum，刷新当前页数据
const handleCurrentPagenNumChange = (val) => {
  pageNum.value = val
  fetchList()
}

// 组件挂载时，获取商品列表
onMounted(() => {
  fetchList()
})
</script>

<style scoped lang="less">
.product-container {
  padding: 20px;
  background: #fff;
  min-height: calc(100vh - 140px);
}

.product-header {
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
