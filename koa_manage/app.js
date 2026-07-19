import Koa from 'koa'
import views from 'koa-views'// 引入视图中间件
import json from 'koa-json'// 引入 JSON 中间件
import onerror from 'koa-onerror'// 引入错误处理中间件
import bodyparser from 'koa-bodyparser'// 引入请求体解析中间件
import serve from 'koa-static'// 引入静态文件中间件
// import pool from './db/index.js'// 引入数据库连接池
import logger from './util/log4js.js'// 引入日志模块
import index from './routes/index.js'// 引入首页路由
import user from './routes/user/user.js'// 引入用户路由
import userAddress from './routes/user/userAddress.js'// 引入收货地址路由
import operationLog from './routes/user/operationLog.js'// 引入操作日志路由
import staff from './routes/staff/staff.js'// 引入员工路由
import { fileURLToPath } from 'url'// 引入文件路径模块
import { dirname, join } from 'path'// 引入路径模块
import sequelize from './config/db.js'// 引入数据库模块
const __filename = fileURLToPath(import.meta.url)// 获取当前模块的文件路径
const __dirname = dirname(__filename)// 获取当前模块的目录路径

const app = new Koa()
const port = 3000// 端口号





// middlewares
// 请求体解析中间件，用于解析请求体中的 JSON、表单数据、文本等, 并将结果转换为 Koa 上下文的 ctx.request.body 属性
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
// JSON 中间件，用于将响应体转换为 JSON 格式
app.use(json())
// 静态文件中间件，用于处理静态文件请求
app.use(serve(__dirname + '/public'))
// 视图中间件，用于渲染模板
app.use(views(__dirname + '/views', {
  extension: 'pug'
}))



// logger日志
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  logger.info(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// 路由中间件，用于处理路由请求
app.use(index.routes(), index.allowedMethods())
app.use(user.routes(), user.allowedMethods())
app.use(userAddress.routes(), userAddress.allowedMethods())
app.use(operationLog.routes(), operationLog.allowedMethods())
app.use(staff.routes(), staff.allowedMethods())

app.listen(port, () => {
  console.log(`🚀 Koa 服务已启动：http://localhost:${port}`)
})

export default app