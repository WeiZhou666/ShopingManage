<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h2>后台数据管理系统</h2>
        <p>欢迎登录</p>
      </div>

      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="User" size="large" />
        </el-form-item>

        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" prefix-icon="Lock" size="large"
            show-password @keyup.enter="handleLogin" />
        </el-form-item>

        <el-form-item>
          <el-checkbox v-model="loginForm.remember">记住密码</el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="large" class="login-btn" :loading="loading" v-debounce:500="handleLogin">
            登录
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-tips">
        <p>提示：账号 admin / operator1 / order1 等，密码 123456</p>
      </div>
    </div>

    <!-- 首次登录强制修改密码弹窗 -->
    <el-dialog v-model="showChangePassword" title="首次登录请修改密码" width="420px" :close-on-click-modal="false"
      :close-on-press-escape="false" :show-close="false" align-center>
      <el-alert title="为了账号安全，首次登录必须修改密码后才能使用系统。" type="warning" :closable="false" show-icon
        style="margin-bottom: 20px" />
      <el-form ref="pwdFormRef" :model="pwdForm" :rules="pwdRules" label-width="100px">
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="pwdForm.newPassword" type="password" placeholder="请输入新密码" show-password />
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input v-model="pwdForm.confirmPassword" type="password" placeholder="请再次输入新密码" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" :loading="pwdLoading" v-debounce:500="handleChangePassword">确认修改</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user.js'
import { updatePassword } from '@/api/api'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const loginFormRef = ref(null)
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: '',
  remember: false
})

const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 3, max: 20, message: '密码长度在 3 到 20 个字符', trigger: 'blur' }
  ]
}

// 首次登录强制改密码
const showChangePassword = ref(false)
const pwdLoading = ref(false)
const pwdFormRef = ref(null)
const pwdForm = reactive({
  newPassword: '',
  confirmPassword: ''
})

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== pwdForm.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const pwdRules = {
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为 6-20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

const handleChangePassword = async () => {
  if (!pwdFormRef.value) return
  try {
    await pwdFormRef.value.validate()
  } catch {
    return
  }
  pwdLoading.value = true
  try {
    await updatePassword({
      oldPassword: loginForm.password,
      newPassword: pwdForm.newPassword
    })
    ElMessage.success('密码修改成功，即将进入系统')
    showChangePassword.value = false
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } catch {
    ElMessage.error('密码修改失败')
  } finally {
    pwdLoading.value = false
  }
}

const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true
    try {
      const res = await userStore.login(loginForm)
      if (res.success) {
        // 首次登录：弹窗强制改密码，不跳转
        if (res.first_login === 1) {
          showChangePassword.value = true
        } else {
          ElMessage.success('登录成功')
          const redirect = route.query.redirect || '/'
          router.push(redirect)
        }
      } else {
        ElMessage.error(res.message)
      }
    } catch (error) {
      ElMessage.error('登录失败，请重试')
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped lang="less">
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;

  .login-box {
    width: 380px;
    padding: 50px 40px 40px;
    background: #ffffff;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
    border: 1px solid #ebeef5;

    .login-header {
      text-align: center;
      margin-bottom: 35px;

      h2 {
        margin: 0;
        font-size: 22px;
        color: #1d1d1d;
        font-weight: 500;
        letter-spacing: 2px;
      }

      p {
        margin: 12px 0 0;
        color: #8c8c8c;
        font-size: 13px;
      }
    }

    .login-form {
      :deep(.el-input__wrapper) {
        padding: 4px 15px;
        box-shadow: 0 0 0 1px #dcdfe6 inset;
        border-radius: 2px;

        &:hover {
          box-shadow: 0 0 0 1px #c0c4cc inset;
        }

        &.is-focus {
          box-shadow: 0 0 0 1px #409eff inset;
        }
      }

      .login-btn {
        width: 100%;
        height: 40px;
        font-size: 14px;
        border-radius: 2px;
        letter-spacing: 3px;
      }
    }

    .login-tips {
      text-align: center;
      margin-top: 25px;

      p {
        color: #bfbfbf;
        font-size: 12px;
      }
    }
  }
}
</style>
