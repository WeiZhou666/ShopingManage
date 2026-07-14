import user from '../../model/user/user.js'
import userAddress from '../../model/user/userAddress.js'
import operationLog from '../../model/user/operationLog.js'
import { Op } from 'sequelize'
import logger from '../../util/log4js.js'

// 用户列表分页 + 筛选
// 支持参数：pageNum, pageSize, keyword(匹配 id/昵称/手机号), tags(1优质/2普通/3恶意), status(1正常/0禁用), startDate, endDate
// 返回结构：{ code, msg, data: { list, total, pageNum, pageSize } }
const getUserList = async (ctx, next) => {
  try {
    const { pageNum, pageSize, keyword, tags, status, startDate, endDate } = ctx.query

    // 分页参数转换为整数
    const page = parseInt(pageNum, 10) || 1
    const size = parseInt(pageSize, 10) || 10
    const where = {}
    const conditionArr = []

    // 关键字模糊匹配 id / 昵称 / 手机号 (OR 关系)
    if (keyword) {
      const kw = `%${keyword}%`
      conditionArr.push({
        [Op.or]: [
          { id: { [Op.like]: kw } },
          { nickname: { [Op.like]: kw } },
          { phone: { [Op.like]: kw } }
        ]
      })
    }

    // tags 是互斥单选数字: 1=优质客户 2=普通客户 3=恶意用户
    if (tags !== undefined && tags !== '') {
      conditionArr.push({ tags: Number(tags) })
    }

    // 状态筛选: 1正常/0禁用
    if (status !== undefined && status !== '') {
      conditionArr.push({ status: Number(status) })
    }

    // endDate 拼到当天 23:59:59，保证包含结束日全天
    if (startDate || endDate) {
      if (startDate) conditionArr.push(
        { register_time: { [Op.gte]: startDate } }
      )
      if (endDate) conditionArr.push(
        { register_time: { [Op.lte]: `${endDate} 23:59:59` } }
      )
    }

    // 合并所有条件
    if (conditionArr.length) {
      where[Op.and] = conditionArr
    }

    // 分页查询（不查 password 字段）
    const { rows, count } = await user.findAndCountAll({
      where,
      limit: size,
      offset: (page - 1) * size,
      order: [['register_time', 'DESC']],
      attributes: { exclude: ['password'] }
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
    logger.error('数据库查询错误:', err)
    ctx.body = {
      code: 500,
      msg: '查询失败: ' + err.message,
      data: null
    }
  }
}

// 新增用户
// 前端传 { nickname, phone, tags, status, total_consumption, order_count }
// password 后端生成默认值 123456 的 bcrypt 哈希
const addUser = async (ctx) => {
  try {
    const { nickname, phone, tags, status, total_consumption, order_count } = ctx.request.body

    // 手机号唯一校验
    const phoneExist = await user.findOne({ where: { phone } })
    if (phoneExist) {
      ctx.body = { code: 400, msg: '手机号已存在', data: null }
      return
    }

    // 默认密码 123456，bcrypt 加密
    const bcrypt = await import('bcryptjs')
    const password = bcrypt.hashSync('123456', 10)

    const data = await user.create({
      nickname: nickname || '',
      phone: phone || '',
      tags: tags || 2,
      status: status || 1,
      total_consumption: total_consumption || 0,
      order_count: order_count || 0,
      password
    })
    ctx.body = {
      code: 200,
      msg: '新增成功，默认密码: 123456',
      data: { id: data.id }
    }
  } catch (err) {
    logger.error('新增用户失败:', err)
    ctx.body = {
      code: 500,
      msg: '新增失败: ' + err.message,
      data: null
    }
  }
}

//删除用户
const deleteUser = async (ctx) => {
  try {
    const { id } = ctx.query
    if (!id) {
      ctx.body = { code: 400, msg: 'id不能为空', data: null }
      return
    }
    await user.destroy({ where: { id } })
    ctx.body = {
      code: 200,
      msg: '删除成功',
      data: { id }
    }
  } catch (err) {
    logger.error('删除用户失败:', err)
    ctx.body = {
      code: 500,
      msg: '删除失败: ' + err.message,
      data: null
    }
  }
}

//批量删除用户
const batchDeleteUsers = async (ctx) => {
  try {
    const { ids } = ctx.request.body
    if (!ids || ids.length === 0) {
      ctx.body = { code: 400, msg: 'ids不能为空', data: null }
      return
    }
    await user.destroy({ where: { id: { [Op.in]: ids } } })
    ctx.body = {
      code: 200,
      msg: '删除成功',
      data: {
        ids: ids.map(id => ({ id }))
      }
    }
  } catch (err) {
    logger.error('批量删除用户失败:', err)
    ctx.body = {
      code: 500,
      msg: '批量删除失败: ' + err.message,
      data: null
    }
  }
}
//更新用户状态
const updateUserStatus = async (ctx) => {
  try {
    const { id, status } = ctx.request.body
    if (id === undefined || id === null || status === undefined || status === null) {
      ctx.body = { code: 400, msg: 'id或status不能为空', data: null }
      return
    }
    await user.update({ status }, { where: { id: { [Op.eq]: id } } })
    ctx.body = {
      code: 200,
      msg: '更新成功',
      data: { id, status }
    }
  } catch (err) {
    logger.error('更新用户状态失败:', err)
    ctx.body = {
      code: 500,
      msg: '更新失败: ' + err.message,
      data: null
    }
  }
}
// 获取用户详情（聚合用户基本信息 + 收货地址 + 操作日志）
// 参数：id
const getUserDetail = async (ctx) => {
  try {
    const { id } = ctx.query
    if (!id) {
      ctx.body = { code: 400, msg: 'id不能为空', data: null }
      return
    }

    // 不查 password 字段
    const userInfo = await user.findByPk(id, {
      attributes: { exclude: ['password'] }
    })
    if (!userInfo) {
      ctx.body = { code: 404, msg: '未找到该用户', data: null }
      return
    }

    // 并行查询地址和日志
    const [addresses, logs] = await Promise.all([
      userAddress.findAll({
        where: { user_id: id },
        order: [['is_default', 'DESC'], ['id', 'ASC']]
      }),
      operationLog.findAll({
        where: { user_id: id },
        order: [['created_at', 'DESC']],
        limit: 50
      })
    ])

    // 日志字段名转换：created_at → time 兼容前端
    const operationLogs = logs.map(log => ({
      id: log.id,
      time: log.created_at,
      operator: log.operator,
      action: log.action
    }))

    ctx.body = {
      code: 200,
      msg: '查询成功',
      data: {
        ...userInfo.toJSON(),
        addresses,
        operationLogs
      }
    }
  } catch (err) {
    logger.error('查询用户详情失败:', err)
    ctx.body = {
      code: 500,
      msg: '查询失败: ' + err.message,
      data: null
    }
  }
}

//更新用户标签
const updateUserTags = async (ctx) => {
  try {
    const { id, tags } = ctx.request.body
    if (!id || !tags) {
      ctx.body = { code: 400, msg: 'id或tags不能为空', data: null }
      return
    }
    await user.update({ tags }, { where: { id: { [Op.eq]: id } } })
    ctx.body = {
      code: 200,
      msg: '更新成功',
      data: { id, tags }
    }
  } catch (err) {
    logger.error('更新用户标签失败:', err)
    ctx.body = {
      code: 500,
      msg: '更新失败: ' + err.message,
      data: null
    }
  }
}


export {
  getUserList,
  getUserDetail,
  addUser,
  // updateUser,
  deleteUser,
  batchDeleteUsers,
  updateUserStatus,
  updateUserTags,
}
