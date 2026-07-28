<template>
  <div class="profile-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="profile-card">
          <div class="profile-avatar-section">
            <div class="avatar-wrapper">
              <img :src="avatarUrl" alt="头像" class="avatar-img" />
            </div>
            <h2 class="user-name">{{ userStore.userInfo?.name || '未设置' }}</h2>
            <el-tag :type="roleTagType" size="large" class="role-tag">
              {{ roleName }}
            </el-tag>
            <p class="user-account">@{{ userStore.userInfo?.username || '-' }}</p>
          </div>
          <el-divider />
          <div class="profile-info-list">
            <div class="info-item">
              <el-icon>
                <Phone />
              </el-icon>
              <span class="info-label">手机号</span>
              <span class="info-value">{{ userStore.userInfo?.phone || '-' }}</span>
            </div>
            <div class="info-item">
              <el-icon>
                <Message />
              </el-icon>
              <span class="info-label">邮箱</span>
              <span class="info-value">{{ userStore.userInfo?.email || '-' }}</span>
            </div>
            <div class="info-item">
              <el-icon>
                <Clock />
              </el-icon>
              <span class="info-label">最后登录</span>
              <span class="info-value">{{ userStore.userInfo?.lastLoginTime || '-' }}</span>
            </div>
            <div class="info-item">
              <el-icon>
                <Location />
              </el-icon>
              <span class="info-label">登录地点</span>
              <span class="info-value">{{ userStore.userInfo?.loginLocation || '-' }}</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="16">
        <el-card class="detail-card">
          <template #header>
            <div class="card-header">
              <span>个人信息</span>
              <el-button type="primary" @click="handleEdit">
                <el-icon>
                  <Edit />
                </el-icon>
                编辑资料
              </el-button>
            </div>
          </template>

          <el-descriptions :column="2" border>
            <el-descriptions-item label="员工工号">{{ userStore.userInfo?.employeeNo || '-' }}</el-descriptions-item>
            <el-descriptions-item label="姓名">{{ userStore.userInfo?.name || '-' }}</el-descriptions-item>
            <el-descriptions-item label="登录账号">{{ userStore.userInfo?.username || '-' }}</el-descriptions-item>
            <el-descriptions-item label="手机号">{{ userStore.userInfo?.phone || '-' }}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{ userStore.userInfo?.email || '-' }}</el-descriptions-item>
            <el-descriptions-item label="角色">
              <el-tag :type="roleTagType" size="small">{{ roleName }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="账号状态">
              <el-tag :type="userStore.userInfo?.status === '1' ? 'success' : 'danger'" size="small">
                {{ userStore.userInfo?.status === '1' ? '正常' : '已禁用' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="入职时间">{{ userStore.userInfo?.createTime || '-' }}</el-descriptions-item>
            <el-descriptions-item label="最后登录">{{ userStore.userInfo?.lastLoginTime || '-' }}</el-descriptions-item>
            <el-descriptions-item label="登录地点">{{ userStore.userInfo?.loginLocation || '-' }}</el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card class="password-card" style="margin-top: 20px;">
          <template #header>
            <div class="card-header">
              <span>安全设置</span>
            </div>
          </template>
          <div class="security-list">
            <div class="security-item">
              <div class="security-info">
                <h4>登录密码</h4>
                <p>定期更换密码有助于保护账号安全</p>
              </div>
              <el-button type="primary" link @click="handleChangePassword">修改密码</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="editDialogVisible" title="编辑个人资料" width="500px">
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="80px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入姓名" maxlength="20" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="editForm.phone" placeholder="请输入手机号" maxlength="11" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" placeholder="请输入邮箱" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="editLoading" v-debounce:500="handleSaveProfile">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="passwordDialogVisible" title="修改密码" width="500px">
      <el-form ref="passwordFormRef" :model="passwordForm" :rules="passwordRules" label-width="100px">
        <el-form-item label="当前密码" prop="oldPassword">
          <el-input v-model="passwordForm.oldPassword" type="password" placeholder="请输入当前密码" show-password />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" type="password" placeholder="请输入新密码" show-password />
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input v-model="passwordForm.confirmPassword" type="password" placeholder="请再次输入新密码" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="passwordDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="passwordLoading" v-debounce:500="handleSavePassword">确认修改</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Phone, Message, Clock, Location, Edit } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { updateProfile } from '@/api/api'
import { roleMap } from '@/api/mockData/staff'

const userStore = useUserStore()

const roleName = computed(() => {
  const role = userStore.userInfo?.role
  return roleMap[role]?.name || '未知角色'
})

const roleTagType = computed(() => {
  const role = userStore.userInfo?.role
  return roleMap[role]?.type || 'info'
})

const avatarUrl = new URL('../assets/images/user.png', import.meta.url).href

const editDialogVisible = ref(false)
const editLoading = ref(false)
const editFormRef = ref(null)
const editForm = reactive({
  name: '',
  phone: '',
  email: ''
})

const editRules = {
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

const handleEdit = () => {
  editForm.name = userStore.userInfo?.name || ''
  editForm.phone = userStore.userInfo?.phone || ''
  editForm.email = userStore.userInfo?.email || ''
  editDialogVisible.value = true
}

const handleSaveProfile = async () => {
  if (!editFormRef.value) return
  try {
    await editFormRef.value.validate()
  } catch {
    return
  }
  editLoading.value = true
  try {
    const res = await updateProfile({
      name: editForm.name,
      phone: editForm.phone,
      email: editForm.email
    })
    userStore.setUserInfo(res.data)
    ElMessage.success('资料更新成功')
    editDialogVisible.value = false
  } catch {
    ElMessage.error('更新失败')
  } finally {
    editLoading.value = false
  }
}

const passwordDialogVisible = ref(false)
const passwordLoading = ref(false)
const passwordFormRef = ref(null)
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

const handleChangePassword = () => {
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  passwordDialogVisible.value = true
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
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success('密码修改成功，请重新登录')
    passwordDialogVisible.value = false
    userStore.logout()
    window.location.href = '/login'
  } catch {
    ElMessage.error('密码修改失败')
  } finally {
    passwordLoading.value = false
  }
}
</script>

<style scoped lang="less">
.profile-container {
  padding: 20px;
}

.profile-card {
  .profile-avatar-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0;

    .avatar-wrapper {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      overflow: hidden;
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;

      .avatar-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .user-name {
      margin: 0 0 8px;
      font-size: 20px;
      font-weight: 600;
      color: #1f2937;
    }

    .role-tag {
      margin-bottom: 8px;
    }

    .user-account {
      margin: 0;
      color: #9ca3af;
      font-size: 14px;
    }
  }

  .profile-info-list {
    .info-item {
      display: flex;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f3f4f6;

      &:last-child {
        border-bottom: none;
      }

      .el-icon {
        color: #6b7280;
        margin-right: 10px;
        font-size: 16px;
      }

      .info-label {
        color: #6b7280;
        font-size: 14px;
        width: 70px;
        flex-shrink: 0;
      }

      .info-value {
        color: #1f2937;
        font-size: 14px;
        margin-left: auto;
      }
    }
  }
}

.detail-card,
.password-card {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
  }
}

.security-list {
  .security-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 0;
    border-bottom: 1px solid #f3f4f6;

    &:last-child {
      border-bottom: none;
    }

    .security-info {
      h4 {
        margin: 0 0 4px;
        font-size: 15px;
        color: #1f2937;
      }

      p {
        margin: 0;
        font-size: 13px;
        color: #9ca3af;
      }
    }
  }
}
</style>
