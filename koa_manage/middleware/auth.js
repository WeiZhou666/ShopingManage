import { verifyToken } from '../util/jwt.js'
import logger from '../util/log4js.js'

// 不需要认证的白名单路径
const whiteList = ['/staff/login']

// JWT 认证中间件
// 全局挂载：所有请求默认需要认证，白名单中的路径除外
const auth = async (ctx, next) => {
  // 白名单直接放行
  if (whiteList.includes(ctx.path)) {
    await next()
    return
  }

  // 从请求头获取 token：Authorization: Bearer <token>
  const authHeader = ctx.header.authorization
  if (!authHeader) {
    ctx.status = 401
    ctx.body = { code: 401, msg: '未提供认证token', data: null }
    return
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader

  try {
    // 验证 token 并将解码后的用户信息挂到 ctx.state.user
    const decoded = verifyToken(token)
    ctx.state.user = decoded
    await next()
  } catch (err) {
    logger.warn('token验证失败:', err.message)
    ctx.status = 401
    ctx.body = { code: 401, msg: 'token无效或已过期，请重新登录', data: null }
  }
}

export default auth
