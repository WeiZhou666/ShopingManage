<template>
  <div class="category-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <span class="page-title">分类管理</span>
      </div>
      <div class="header-right">
        <el-button type="primary" v-debounce:500="openAddDialog(null)">
          <el-icon><Plus /></el-icon>
          新增分类
        </el-button>
      </div>
    </div>

    <div class="category-body">
      <!-- 分类树 -->
      <el-card shadow="hover" class="tree-card">
        <template #header>
          <div class="card-header"><span>分类列表</span></div>
        </template>
        <el-tree
          :data="treeData"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
          draggable
          :allow-drop="allowDrop"
          @node-drop="handleDrop"
        >
          <template #default="{ data }">
            <div class="tree-node">
              <span class="node-label">{{ data.name }}</span>
              <span class="node-actions">
                <el-button type="primary" link size="small" @click.stop="openAddDialog(data)">
                  <el-icon><Plus /></el-icon>
                  新增子分类
                </el-button>
                <el-button type="primary" link size="small" @click.stop="openEditDialog(data)">
                  <el-icon><Edit /></el-icon>
                  编辑
                </el-button>
                <el-popconfirm
                  :title="data.children && data.children.length ? '删除该分类将同时删除所有子分类，确定？' : '确定删除该分类？'"
                  @confirm="handleDelete(data)"
                >
                  <template #reference>
                    <el-button type="danger" link size="small" @click.stop>
                      <el-icon><Delete /></el-icon>
                      删除
                    </el-button>
                  </template>
                </el-popconfirm>
              </span>
            </div>
          </template>
        </el-tree>
      </el-card>

      <!-- 右侧提示 -->
      <el-card shadow="never" class="tips-card">
        <template #header>
          <div class="card-header"><span>提示</span></div>
        </template>
        <ul class="tips-list">
          <li>拖拽节点可调整分类顺序</li>
          <li>只能将分类拖拽到同级或父级</li>
          <li>一级分类最多支持 10 个</li>
          <li>每个父分类下最多支持 20 个子分类</li>
        </ul>
      </el-card>
    </div>

    <!-- 新增/编辑分类弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="420px">
      <el-form ref="dialogFormRef" :model="dialogForm" :rules="dialogRules" label-width="100px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="dialogForm.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="父级分类">
          <el-select v-model="dialogForm.parentId" placeholder="无父级（一级分类）" clearable style="width: 100%">
            <el-option
              v-for="node in topLevelNodes"
              :key="node.id"
              :label="node.name"
              :value="node.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" v-debounce:500="handleDialogConfirm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'

// 树形数据
const treeData = ref([
  { id: 1, name: '服饰', children: [
    { id: 11, name: '女装' },
    { id: 12, name: '男装' },
    { id: 13, name: '童装' }
  ]},
  { id: 2, name: '数码', children: [
    { id: 21, name: '手机' },
    { id: 22, name: '电脑' },
    { id: 23, name: '配件' }
  ]},
  { id: 3, name: '美妆', children: [
    { id: 31, name: '护肤' },
    { id: 32, name: '彩妆' }
  ]},
  { id: 4, name: '食品', children: [
    { id: 41, name: '生鲜' },
    { id: 42, name: '零食' }
  ]}
])

// 弹窗
const dialogVisible = ref(false)
const dialogFormRef = ref()
const isEditing = ref(false)
const editingNode = ref(null)

const dialogForm = reactive({ name: '', parentId: null })

const dialogRules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
}

const dialogTitle = computed(() => isEditing.value ? '编辑分类' : '新增分类')

// 一级分类列表（用于父级选择器）
const topLevelNodes = computed(() => treeData.value)

// 新增
const openAddDialog = (parentNode) => {
  isEditing.value = false
  editingNode.value = null
  dialogForm.name = ''
  dialogForm.parentId = parentNode ? parentNode.id : null
  dialogVisible.value = true
}

// 编辑
const openEditDialog = (node) => {
  isEditing.value = true
  editingNode.value = node
  dialogForm.name = node.name
  dialogForm.parentId = null
  dialogVisible.value = true
}

const handleDialogConfirm = async () => {
  const valid = await dialogFormRef.value.validate().catch(() => false)
  if (!valid) return

  if (isEditing.value) {
    // 编辑模式
    editingNode.value.name = dialogForm.name
    treeData.value = [...treeData.value]
    ElMessage.success('编辑成功')
  } else {
    // 新增模式
    const newNode = { id: Date.now(), name: dialogForm.name }
    if (dialogForm.parentId) {
      const parent = findNode(treeData.value, dialogForm.parentId)
      if (parent) {
        if (!parent.children) parent.children = []
        parent.children.push(newNode)
      }
    } else {
      treeData.value.push({ ...newNode, children: [] })
    }
    treeData.value = [...treeData.value]
    ElMessage.success('添加成功')
  }
  dialogVisible.value = false
}

// 递归查找节点
const findNode = (nodes, id) => {
  for (const node of nodes) {
    if (node.id === id) return node
    if (node.children) {
      const found = findNode(node.children, id)
      if (found) return found
    }
  }
  return null
}

// 删除节点
const handleDelete = (node) => {
  removeNode(treeData.value, node.id)
  treeData.value = [...treeData.value]
  ElMessage.success('删除成功')
}

const removeNode = (nodes, id) => {
  const idx = nodes.findIndex(n => n.id === id)
  if (idx > -1) {
    nodes.splice(idx, 1)
    return true
  }
  for (const n of nodes) {
    if (n.children && removeNode(n.children, id)) return true
  }
  return false
}

// 拖拽
const allowDrop = (draggingNode, dropNode, type) => {
  // type: 'prev' | 'inner' | 'next'
  // 不允许将一级分类拖入子分类
  if (type === 'inner' && !dropNode.data.children) return false
  return true
}

const handleDrop = (draggingNode, dropNode, dropType) => {
  // 触发响应式更新
  treeData.value = [...treeData.value]
  ElMessage.success('排序已更新')
}
</script>

<style scoped lang="less">
.category-container {
  padding: 20px;
  background: #fff;
  min-height: calc(100vh - 140px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .page-title {
    font-size: 18px;
    font-weight: 600;
  }

  .header-left,
  .header-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }
}

.category-body {
  display: flex;
  gap: 20px;
}

.tree-card {
  flex: 1;

  .card-header span {
    font-weight: 600;
    font-size: 15px;
  }
}

.tree-node {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  padding-right: 8px;
  font-size: 14px;

  .node-label {
    color: #303133;
  }

  .node-actions {
    display: flex;
    gap: 2px;
    opacity: 0;
    transition: opacity 0.2s;
  }

  &:hover .node-actions {
    opacity: 1;
  }
}

.tips-card {
  width: 200px;
  align-self: flex-start;

  .card-header span {
    font-weight: 600;
    font-size: 14px;
  }

  .tips-list {
    padding: 0;
    margin: 0;
    list-style: none;

    li {
      padding: 6px 0;
      font-size: 13px;
      color: #909399;

      &::before {
        content: '·';
        margin-right: 6px;
        font-weight: bold;
      }
    }
  }
}

:deep(.el-tree-node__content) {
  height: 40px;
}
</style>
