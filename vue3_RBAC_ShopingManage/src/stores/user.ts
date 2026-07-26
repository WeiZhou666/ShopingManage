import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as loginApi, getUserInfo as getUserInfoApi } from '@/api/api'

export interface UserInfo {
  id: number
  username: string
  name: string
  avatar: string
  role: string
  email: string
  lastLoginTime: string
  loginLocation: string
}

export interface LoginData {
  username: string
  password: string
}

export interface LoginResult {
  success: boolean
  message: string
  data: UserInfo | null
  first_login?: number
}

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(localStorage.getItem('token') || '')
  const userInfo = ref<UserInfo | null>(JSON.parse(localStorage.getItem('userInfo') || 'null'))

  const setUserInfo = (info: UserInfo) => {
    userInfo.value = info
    localStorage.setItem('userInfo', JSON.stringify(info))
  }

  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  // 登录：调用后端 /staff/login 接口
  const login = async (loginData: LoginData): Promise<LoginResult> => {
    try {
      const res = await loginApi({ username: loginData.username, password: loginData.password })
      setToken(res.data.token)
      setUserInfo(res.data.userInfo)
      return { success: true, message: res.msg, data: res.data.userInfo, first_login: res.data.first_login }
    } catch (err: any) {
      return { success: false, message: err.msg || '登录失败', data: null }
    }
  }

  // 获取当前登录用户信息：用于页面刷新后恢复会话
  const fetchUserInfo = async () => {
    if (!token.value) return
    try {
      const res = await getUserInfoApi()
      setUserInfo(res.data)
    } catch (err) {
      // token 无效，清除登录状态
      logout()
    }
  }

  // 退出登录
  const logout = () => {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }

  // 检查是否登录
  const isLoggedIn = () => {
    return !!token.value
  }

  return {
    token,
    userInfo,
    setUserInfo,
    setToken,
    login,
    fetchUserInfo,
    logout,
    isLoggedIn
  }
})
