import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { ElMessage } from 'element-plus'
import config from '@/config'
import router from '@/router'

const NETWORK_ERROR = '网络异常，请检查网络连接'
const TIMEOUT_ERROR = '请求超时，请稍后重试'
// 自定义请求选项接口
interface RequestOptions extends AxiosRequestConfig {
  mock?: boolean
}
// 创建 axios 实例
const service = axios.create({
  timeout: 10000,
  baseURL: config.baseURL,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  }
})

// 添加请求拦截器
service.interceptors.request.use(
  config => {
    // 检查是否有token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// 添加响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data
    if (res.code === 200) {
      return res
    }
    //错误提醒
    ElMessage.error(res.msg || NETWORK_ERROR)
    return Promise.reject(res)

  },
  (error: AxiosError) => {
    // http状态码错误处理
    let errMsg = NETWORK_ERROR
    if (error.response) {
      const status = error.response.status
      switch (status) {
        case 401:
          errMsg = '登录已失效，请重新登录'
          localStorage.removeItem('token')
          router.push({ path: '/login', query: { redirect: router.currentRoute.value.path } })
          break
        case 403:
          errMsg = '无权限访问'
          break
        case 404:
          errMsg = '请求接口不存在'
          break
        case 500:
          errMsg = '服务器内部错误'
          break
        default:
          errMsg = `请求错误 ${status}`
      }
    } else if (error.message.includes('timeout')) {
      errMsg = TIMEOUT_ERROR
    }
    ElMessage.error(errMsg)
    return Promise.reject(error)
  }
)

// 封装请求函数
function request(options: RequestOptions) {
  // 默认方法为get
  options.method = (options.method || 'get').toLowerCase()
  // 关于get请求参数调整, 把data参数转换为params参数
  if (options.method === 'get' && options.data) {
    options.params = options.data
    delete options.data
  }

  // api.ts 中 url 已统一带 /api 前缀，统一用空 baseURL，由 vite 代理的 /api 规则转发到后端。
  // 若真实请求再设 baseURL='/api'，会与 url 前缀重复拼成 /api/api/... 导致后端 404。
  options.baseURL = ''


  return service(options)
}



export default request