<template>
  <div class="product-edit">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <el-button @click="$router.back()">
          <el-icon>
            <ArrowLeft />
          </el-icon>
          返回列表
        </el-button>
      </div>
      <div class="header-right">
        <el-button type="primary" :loading="saving" v-debounce:500="handleSave">
          <el-icon>
            <Check />
          </el-icon>
          保存
        </el-button>
        <el-button @click="$router.back()">返回</el-button>
      </div>
    </div>

    <div v-loading="loading">
      <!-- 基本信息 -->
      <el-card shadow="hover" class="info-card">
        <template #header>
          <div class="card-header"><span>基本信息</span></div>
        </template>
        <el-form ref="baseFormRef" :model="form" :rules="baseRules" label-width="100px">
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入商品名称，60字以内" maxlength="60" style="width: 400px" />
          </el-form-item>
          <el-form-item label="商品分类" prop="category">
            <el-select v-model="form.category" placeholder="请选择分类" style="width: 200px">
              <el-option label="服饰" value="服饰" />
              <el-option label="数码" value="数码" />
              <el-option label="美妆" value="美妆" />
              <el-option label="食品" value="食品" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 商品规格 -->
      <el-card shadow="hover" class="info-card">
        <template #header>
          <div class="card-header">
            <span>商品规格</span>
            <el-button type="primary" size="small" v-debounce:500="addSku">
              <el-icon>
                <Plus />
              </el-icon>
              添加规格
            </el-button>
          </div>
        </template>
        <el-table :data="form.skus" border>
          <el-table-column prop="spec" label="规格名称">
            <template #default="{ row }">
              <el-input v-model="row.spec" placeholder="如：红色 / M" size="small" />
            </template>
          </el-table-column>
          <el-table-column prop="stock" label="库存" width="120">
            <template #default="{ row }">
              <el-input-number v-model="row.stock" :min="0" size="small" controls-position="right"
                style="width: 100px" />
            </template>
          </el-table-column>
          <el-table-column prop="price" label="价格" width="140">
            <template #default="{ row }">
              <el-input-number v-model="row.price" :min="0" :step="0.01" size="small" controls-position="right"
                style="width: 100px" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template #default="{ $index }">
              <el-button link type="danger" size="small" v-debounce:500="() => removeSku($index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-empty v-if="form.skus.length === 0" description="暂无规格，点击「添加规格」按钮添加" :image-size="60" />
      </el-card>

      <!-- 价格库存 -->
      <el-card shadow="hover" class="info-card">
        <template #header>
          <div class="card-header"><span>价格库存</span></div>
        </template>
        <el-form :model="form" label-width="100px">
          <el-form-item label="销售价" required>
            <el-input-number v-model="form.price" :min="0" :step="0.01" controls-position="right"
              style="width: 180px" />
            <span class="unit-text">元</span>
          </el-form-item>
          <el-form-item label="划线价">
            <el-input-number v-model="form.originalPrice" :min="0" :step="0.01" controls-position="right"
              style="width: 180px" />
            <span class="unit-text">元</span>
            <span class="hint-text">（选填，不填则不显示划线价）</span>
          </el-form-item>
          <el-form-item label="库存数量" required>
            <el-input-number v-model="form.stock" :min="0" controls-position="right" style="width: 180px" />
          </el-form-item>
          <el-form-item label="上架状态">
            <el-radio-group v-model="form.status">
              <el-radio :value="1">上架</el-radio>
              <el-radio :value="0">下架</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 商品详情 -->
      <el-card shadow="hover" class="info-card">
        <template #header>
          <div class="card-header"><span>商品详情</span></div>
        </template>
        <el-input v-model="form.description" type="textarea" :rows="8" placeholder="请输入商品描述" />
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Check, Plus } from '@element-plus/icons-vue'
import api from '@/api/api'

const router = useRouter()
const route = useRoute()

const isEdit = ref(false)
const saving = ref(false)
const loading = ref(false)
const baseFormRef = ref()

const form = reactive({
  name: '',
  category: '',
  price: undefined,
  originalPrice: undefined,
  stock: undefined,
  status: 1,
  description: '',
  skus: []
})

const baseRules = {
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择商品分类', trigger: 'change' }]
}

const addSku = () => {
  form.skus.push({ spec: '', stock: 0, price: 0 })
}

const removeSku = (index) => {
  form.skus.splice(index, 1)
}

const fillForm = (data) => {
  form.name = data.name || ''
  form.category = data.category || ''
  form.price = data.price
  form.originalPrice = data.originalPrice
  form.stock = data.stock
  form.status = data.status !== undefined ? data.status : 1
  form.description = data.description || ''
  form.skus = data.skus ? [...data.skus] : []
}

const handleSave = async () => {
  const valid = await baseFormRef.value.validate().catch(() => false)
  if (!valid) return

  saving.value = true
  try {
    const data = { ...form }
    if (isEdit.value) {
      await api.updateProduct(data)
      ElMessage.success('更新成功')
    } else {
      await api.addProduct(data)
      ElMessage.success('添加成功')
    }
    router.back()
  } catch {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

const loadProduct = async (id) => {
  loading.value = true
  try {
    const res = await api.getProductEdit(Number(id))
    if (res && res.data) {
      fillForm(res.data)
    }
  } catch {
    ElMessage.error('获取商品信息失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const id = route.params.id || route.path.split('/').pop()
  if (id && id !== 'productedit') {
    isEdit.value = true
    loadProduct(id)
  }
  if (history.state && history.state.productData) {
    fillForm(history.state.productData)
    isEdit.value = true
  }
})
</script>

<style scoped lang="less">
.product-edit {
  padding: 20px;
  background: #fff;
  min-height: calc(100vh - 140px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .header-left,
  .header-right {
    display: flex;
    gap: 10px;
  }
}

.info-card {
  margin-bottom: 16px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
      font-weight: 600;
      font-size: 15px;
    }
  }
}

.unit-text {
  margin-left: 8px;
  color: #909399;
}

.hint-text {
  margin-left: 8px;
  color: #909399;
  font-size: 12px;
}
</style>
