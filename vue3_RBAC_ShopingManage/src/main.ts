import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from '@/App.vue'
import router from '@/router'
import { registerDirectives } from '@/directives'
import { useUserStore } from '@/stores/user'
import '@/assets/global.less'

// 导入 mock 服务
import './api/mock'
// 导入中文语言包
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
registerDirectives(app)
app.use(ElementPlus, { locale: zhCn })

// 页面刷新时恢复登录会话（有 token 则向后台换取最新用户信息）
const userStore = useUserStore()
userStore.fetchUserInfo()

app.mount('#app')