import { defineStore } from 'pinia'
import { ref } from 'vue'
import { staffList } from '@/api/mockData/staff'

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
}

const DEFAULT_PASSWORD = '123456'

const formatTime = (date: Date): string => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  const s = String(date.getSeconds()).padStart(2, '0')
  return `${y}-${m}-${d} ${h}:${min}:${s}`
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

  const login = (loginData: LoginData): Promise<LoginResult> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const { username, password } = loginData

        // 第一步：查找员工
        const staff = staffList.find(s => s.account === username)
        if (!staff) {
          resolve({ success: false, message: '账号不存在', data: null })
          return
        }

        // 第二步：校验密码
        if (password !== DEFAULT_PASSWORD) {
          resolve({ success: false, message: '密码错误', data: null })
          return
        }

        // 第三步：检查账号状态
        if (staff.status === '0') {
          resolve({ success: false, message: '该账号已被禁用，请联系管理员', data: null })
          return
        }

        // 第四步：构建用户信息
        const userInfo: UserInfo = {
          id: staff.id,
          username: staff.account,
          name: staff.name,
          avatar: '',
          role: staff.role,
          email: staff.account + '@example.com',
          lastLoginTime: formatTime(new Date()),
          loginLocation: '南昌'
        }

        // 第五步：保存登录状态
        setToken('token_' + Date.now())
        setUserInfo(userInfo)

        resolve({ success: true, message: '登录成功', data: userInfo })
      }, 500)
    })
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
    logout,
    isLoggedIn
  }
})