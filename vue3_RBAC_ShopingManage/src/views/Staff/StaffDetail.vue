<template>
  <div class="staff-edit-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ isEdit ? '员工管理 > 编辑员工' : '员工管理 > 新增员工' }}</span>
          <div class="header-actions">
            <el-button type="primary" :loading="submitting" v-debounce:500="handleSubmit">
              保存
            </el-button>
            <el-button @click="goBack">返回</el-button>
          </div>
        </div>
      </template>

      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" class="staff-form">
        <div class="form-section">
          <h3 class="section-title">基本信息</h3>

          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="请输入员工姓名" maxlength="20" class="full-width" />
          </el-form-item>

          <el-form-item label="账号" prop="account">
            <el-input v-model="form.account" placeholder="请输入登录账号（英文+数字，唯一）" :disabled="isEdit" maxlength="20"
              class="full-width" />
          </el-form-item>

          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入手机号码" maxlength="11" class="full-width" />
          </el-form-item>

          <el-form-item label="初始密码" prop="password">
            <el-input v-model="form.password" :placeholder="isEdit ? '不修改请留空' : '请输入初始密码（默认123456）'" show-password
              maxlength="20" class="full-width" />
          </el-form-item>

          <el-form-item label="角色" prop="role">
            <el-radio-group v-model="form.role" class="role-radio-group">
              <el-radio label="super_admin">超级管理员</el-radio>
              <el-radio label="operator">运营人员</el-radio>
              <el-radio label="order_staff">订单专员</el-radio>
              <el-radio label="finance">财务人员</el-radio>
              <el-radio label="customer_service">普通客服</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item>
            <el-alert title="注意" type="warning" description="新增员工首次登录后必须强制修改密码" :closable="false" show-icon />
          </el-form-item>
        </div>

        <el-form-item class="form-actions">
          <el-button type="primary" :loading="submitting" v-debounce:500="handleSubmit">
            {{ isEdit ? '保存修改' : '创建员工' }}
          </el-button>
          <el-button @click="goBack">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { addStaff, updateStaff } from '@/api/api'

// 角色 name → id 映射（与后端 role_id 对应）
const roleNameToId = {
  super_admin: 1,
  operator: 2,
  order_staff: 3,
  finance: 4,
  customer_service: 5
}
// 角色 id → name 映射
const roleIdToName = {
  1: 'super_admin',
  2: 'operator',
  3: 'order_staff',
  4: 'finance',
  5: 'customer_service'
}

const router = useRouter()
const route = useRoute()

const formRef = ref(null)
const submitting = ref(false)

const isEdit = computed(() => !!route.params.id)

const form = reactive({
  name: '',
  account: '',
  phone: '',
  password: '',
  role: ''
})

const rules = {
  name: [
    { required: true, message: '请输入员工姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度为 2-20 个字符', trigger: 'blur' }
  ],
  account: [
    { required: true, message: '请输入登录账号', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9]+$/, message: '账号只能包含英文和数字', trigger: 'blur' },
    { min: 4, max: 20, message: '账号长度为 4-20 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  password: [
    { required: !isEdit.value, message: '请输入初始密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为 6-20 个字符', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择员工角色', trigger: 'change' }
  ]
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
  } catch {
    ElMessage.error('请完善表单信息')
    return
  }

  submitting.value = true

  try {
    const requestData = {
      name: form.name,
      account: form.account,
      phone: form.phone,
      role_id: roleNameToId[form.role] || 5,
      status: '1'
    }

    if (isEdit.value) {
      const editData = { id: route.params.id, ...requestData }
      if (form.password) editData.password = form.password
      const res = await updateStaff(editData)
      if (res && res.code === 200) {
        ElMessage.success('员工信息已保存')
        router.push('/staff/stafflist')
      } else {
        ElMessage.error(res?.msg || '保存失败')
      }
    } else {
      requestData.password = form.password || '123456'
      const res = await addStaff(requestData)
      if (res && res.code === 200) {
        ElMessage.success('员工创建成功，初始密码为 123456')
        router.push('/staff/stafflist')
      } else {
        ElMessage.error(res?.msg || '创建失败')
      }
    }
  } catch {
    ElMessage.error('操作失败，请重试')
  } finally {
    submitting.value = false
  }
}

const goBack = () => {
  router.push('/staff/stafflist')
}

onMounted(() => {
  if (isEdit.value) {
    const staffData = route.query.staffData
    if (staffData) {
      try {
        const data = JSON.parse(staffData)
        form.name = data.name
        form.account = data.account
        form.phone = data.phone
        // role_id 数字 → 角色名称字符串
        form.role = roleIdToName[data.role_id] || data.role_id
      } catch {
        // 解析失败
      }
    }
  }
})
</script>

<style scoped>
.staff-edit-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.staff-form {
  max-width: 600px;
  margin: 0 auto;
}

.form-section {
  padding: 20px;
  background: #fafafa;
  border-radius: 4px;
  margin-bottom: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e8e8e8;
}

.full-width {
  width: 100%;
}

.role-radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.role-radio-group .el-radio {
  margin-right: 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 20px;
}
</style>
