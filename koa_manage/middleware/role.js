// 角色级权限校验中间件
// 用法：router.post('/addStaff', requireRole('super_admin'), addStaff)
// 说明：依赖 auth 中间件已将用户信息挂到 ctx.state.user
//       未登录或 token 无效由 auth 中间件拦截，这里只校验角色

// 允许访问的角色列表为空时，表示所有已登录用户均可访问
const requireRole = (...allowedRoles) => {
  return async (ctx, next) => {
    // auth 中间件已将解码后的 token 挂到 ctx.state.user
    const userRole = ctx.state.user?.role

    // 未获取到角色信息（理论上 auth 中间件已拦截，这里做防御性判断）
    if (!userRole) {
      ctx.status = 401
      ctx.body = { code: 401, msg: '未获取到用户信息，请重新登录', data: null }
      return
    }

    // 超级管理员拥有所有权限，直接放行
    if (userRole === 'super_admin') {
      await next()
      return
    }

    // 检查当前角色是否在允许列表中
    if (!allowedRoles.includes(userRole)) {
      ctx.status = 403
      ctx.body = { code: 403, msg: '无权限执行此操作', data: null }
      return
    }

    await next()
  }
}

export default requireRole
