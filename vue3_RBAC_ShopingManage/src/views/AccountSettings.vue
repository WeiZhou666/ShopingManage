<template>
  <div class="account-settings-container">
    <el-tabs v-model="activeTab" class="settings-tabs">
      <el-tab-pane label="基本设置" name="basic">
        <el-card>
          <el-form ref="basicFormRef" :model="basicForm" :rules="basicRules" label-width="100px" class="settings-form">
            <el-form-item label="登录账号">
              <el-input :model-value="userStore.userInfo?.username" disabled />
            </el-form-item>
            <el-form-item label="员工工号">
              <el-input :model-value="staffInfo?.employeeNo" disabled />
            </el-form-item>
            <el-form-item label="角色">
              <el-input :model-value="roleName" disabled />
            </el-form-item>
            <el-form-item label="姓名" prop="name">
              <el-input v-model="basicForm.name" placeholder="请输入姓名" maxlength="20" />
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="basicForm.phone" placeholder="请输入手机号" maxlength="11" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="basicForm.email" placeholder="请输入邮箱" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="basicLoading" v-debounce:500="handleSaveBasic">保存修改</el-button>
              <el-button @click="handleResetBasic">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="修改密码" name="password">
        <el-card>
          <el-form ref="passwordFormRef" :model="passwordForm" :rules="passwordRules" label-width="120px"
            class="settings-form">
            <el-alert title="密码要求" type="info" :closable="false" show-icon class="password-tip">
              <template #default>
                <ul class="password-requirements">
                  <li>密码长度为 6-20 个字符</li>
                  <li>建议包含字母、数字和特殊字符</li>
                  <li>修改密码后需要重新登录</li>
                </ul>
              </template>
            </el-alert>
            <el-form-item label="当前密码" prop="oldPassword">
              <el-input v-model="passwordForm.oldPassword" type="password" placeholder="请输入当前密码" show-password />
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input v-model="passwordForm.newPassword" type="password" placeholder="请输入新密码" show-password />
            </el-form-item>
            <el-form-item label="确认新密码" prop="confirmPassword">
              <el-input v-model="passwordForm.confirmPassword" type="password" placeholder="请再次输入新密码" show-password />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="passwordLoading" v-debounce:500="handleSavePassword">确认修改</el-button>
              <el-button @click="handleResetPassword">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="登录记录" name="loginLog">
        <el-card>
          <el-table :data="loginLogs" style="width: 100%">
            <el-table-column prop="time" label="登录时间" width="200" />
            <el-table-column prop="location" label="登录地点" width="150" />
            <el-table-column prop="ip" label="IP地址" width="160" />
            <el-table-column prop="device" label="设备" min-width="150" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === '成功' ? 'success' : 'danger'" size="small">
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { updatePassword } from '@/api/api'
import { staffList, roleMap } from '@/api/mockData/staff'

const userStore = useUserStore()

const activeTab = ref('basic')

const staffInfo = computed(() => {
  return staffList.find(s => s.account === userStore.userInfo?.username) || null
})

const roleName = computed(() => {
  const role = userStore.userInfo?.role
  return roleMap[role]?.name || '未知角色'
})

const basicFormRef = ref(null)
const basicLoading = ref(false)
const basicForm = reactive({
  name: '',
  phone: '',
  email: ''
})

const basicRules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度为 2-20 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
}

const initBasicForm = () => {
  basicForm.name = userStore.userInfo?.name || ''
  basicForm.phone = staffInfo.value?.phone || ''
  basicForm.email = userStore.userInfo?.email || ''
}

const handleResetBasic = () => {
  initBasicForm()
}

const handleSaveBasic = async () => {
  if (!basicFormRef.value) return
  try {
    await basicFormRef.value.validate()
  } catch {
    return
  }
  basicLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    userStore.setUserInfo({
      ...userStore.userInfo,
      name: basicForm.name,
      email: basicForm.email
    })
    ElMessage.success('资料更新成功')
  } catch {
    ElMessage.error('更新失败')
  } finally {
    basicLoading.value = false
  }
}

const passwordFormRef = ref(null)
const passwordLoading = ref(false)
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== passwordForm.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为 6-20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

const handleResetPassword = () => {
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
}

const handleSavePassword = async () => {
  if (!passwordFormRef.value) return
  try {
    await passwordFormRef.value.validate()
  } catch {
    return
  }
  passwordLoading.value = true
  try {
    await updatePassword({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword
    })
    ElMessage.success('密码修改成功，请重新登录')
    userStore.logout()
    window.location.href = '/login'
  } catch {
    ElMessage.error('密码修改失败')
  } finally {
    passwordLoading.value = false
  }
}

const loginLogs = ref([])

const generateLoginLogs = () => {
  const now = new Date()
  const devices = ['Chrome 120 / Windows 10', 'Chrome 120 / macOS', 'Safari 17 / iPhone 15', 'Edge 120 / Windows 11']
  const locations = ['南昌', '北京', '上海', '深圳']
  const logs = []
  for (let i = 0; i < 8; i++) {
    const time = new Date(now.getTime() - i * 86400000 * Math.random() * 3)
    logs.push({
      time: `${time.getFullYear()}-${String(time.getMonth() + 1).padStart(2, '0')}-${String(time.getDate()).padStart(2, '0')} ${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}:${String(time.getSeconds()).padStart(2, '0')}`,
      location: locations[i % locations.length],
      ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      device: devices[i % devices.length],
      status: i === 5 ? '失败' : '成功'
    })
  }
  loginLogs.value = logs
}

onMounted(() => {
  initBasicForm()
  generateLoginLogs()
})
</script>

<style scoped lang="less">
.account-settings-container {
  padding: 20px;
}

.settings-tabs {
  :deep(.el-tabs__header) {
    background: #fff;
    padding: 0 20px;
    border-radius: 4px;
    margin-bottom: 20px;
  }
}

.settings-form {
  max-width: 550px;
  padding: 20px 0;
}

.password-tip {
  margin-bottom: 20px;

  .password-requirements {
    margin: 4px 0 0;
    padding-left: 16px;

    li {
      font-size: 13px;
      color: #6b7280;
      line-height: 1.8;
    }
  }
}
</style>
