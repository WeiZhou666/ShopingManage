import operationLog from '../../model/user/operationLog.js'
import logger from '../../util/log4js.js'

// 获取某用户的操作日志（分页）
// 参数：userId, pageNum, pageSize
const getOperationLogList = async (ctx) => {
  try {
    const { userId, pageNum, pageSize } = ctx.query
    if (!userId) {
      ctx.body = { code: 400, msg: 'userId不能为空', data: null }
      return
    }

    const page = parseInt(pageNum, 10) || 1
    const size = parseInt(pageSize, 10) || 10

    const { rows, count } = await operationLog.findAndCountAll({
      where: { user_id: userId },
      limit: size,
      offset: (page - 1) * size,
      order: [['created_at', 'DESC']]
    })

    ctx.body = {
      code: 200,
      msg: '查询成功',
      data: {
        list: rows,
        total: count,
        pageNum: page,
        pageSize: size
      }
    }
  } catch (err) {
    logger.error('查询操作日志失败:', err)
    ctx.body = {
      code: 500,
      msg: '查询失败: ' + err.message,
      data: null
    }
  }
}

// 新增操作日志
// 前端传 { user_id, operator, action }
const addOperationLog = async (ctx) => {
  try {
    const { user_id, operator, action } = ctx.request.body
    if (!user_id || !operator || !action) {
      ctx.body = { code: 400, msg: '缺少必填字段', data: null }
      return
    }

    const data = await operationLog.create({ user_id, operator, action })
    ctx.body = {
      code: 200,
      msg: '新增成功',
      data: { id: data.id }
    }
  } catch (err) {
    logger.error('新增操作日志失败:', err)
    ctx.body = {
      code: 500,
      msg: '新增失败: ' + err.message,
      data: null
    }
  }
}

export {
  getOperationLogList,
  addOperationLog
}
