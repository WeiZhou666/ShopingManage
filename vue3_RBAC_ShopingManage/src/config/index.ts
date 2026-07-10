// 1. 定义环境类型（约束只能是这三种）
const env = (import.meta.env.mode || 'production') as 'development' | 'test' | 'production'

//定义配置接口
interface EnvConfig {
  baseURL: string
  mockApi: string
  mock: boolean
  env: string
}

// 环境配置表
const Envconfig: Record<string, EnvConfig> = {
  development: {
    baseURL: '/api',
    mockApi: '',
    mock: true,
    env: 'development'
  },
  test: {
    baseURL: '/test/api',
    mockApi: '',
    mock: true,
    env: 'test'
  },
  production: {
    baseURL: '/api',
    mockApi: '',
    mock: true,
    env: 'production'
  }
}

// 2. 导出环境配置（安全兜底）
export default Envconfig[env] ?? Envconfig.production