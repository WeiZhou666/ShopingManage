import user from '../model/user.js'
import { Op } from 'sequelize'
import logger from '../util/log4js.js'

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
        { registerTime: { [Op.gte]: startDate } }
      )
      if (endDate) conditionArr.push(
        { registerTime: { [Op.lte]: `${endDate} 23:59:59` } }
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

const create = async (ctx, next) => {
  const params = ctx.request.body
  try {
    await user.create(params)
    ctx.body = {
      code: 200,
      msg: '创建成功',
      data: params
    }
  } catch (error) {
    logger.error('数据库创建错误:', error)
    ctx.body = {
      code: 500,
      msg: '创建失败: ' + error.message,
      data: null
    }
  }
}

export {
  getUserList,
  create
}
