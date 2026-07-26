import order from '../../model/order/order.js'
import { Op } from 'sequelize'
import logger from '../../util/log4js.js'

// 订单状态映射
const statusMap = {
  0: '待付款',
  1: '待发货',
  2: '已发货',
  3: '已完成',
  4: '已退款'
}

// 订单列表分页 + 筛选
// 支持参数：pageNum, pageSize, status(0-4), orderNo, startDate, endDate
// 返回结构：{ code, msg, data: { list, total, pageNum, pageSize } }
const getOrderList = async (ctx, next) => {
  try {
    const { pageNum, pageSize, status, orderNo, startDate, endDate } = ctx.query

    const page = parseInt(pageNum, 10) || 1
    const size = parseInt(pageSize, 10) || 10
    const where = {}
    const conditionArr = []

    // 订单状态筛选: 0-待付款 1-待发货 2-已发货 3-已完成 4-已退款
    if (status !== undefined && status !== '') {
      conditionArr.push({ status: Number(status) })
    }

    // 订单号模糊匹配
    if (orderNo) {
      conditionArr.push({ order_no: { [Op.like]: `%${orderNo}%` } })
    }

    // 下单时间范围筛选
    if (startDate) {
      conditionArr.push({ create_time: { [Op.gte]: startDate } })
    }
    if (endDate) {
      conditionArr.push({ create_time: { [Op.lte]: `${endDate} 23:59:59` } })
    }

    if (conditionArr.length) {
      where[Op.and] = conditionArr
    }

    const { rows, count } = await order.findAndCountAll({
      where,
      limit: size,
      offset: (page - 1) * size,
      order: [['create_time', 'DESC']]
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

// 获取订单详情
// 参数：orderNo
// 返回订单基本信息 + 收货人信息 + 商品信息 + 物流信息 + 操作日志
const getOrderDetail = async (ctx, next) => {
  try {
    const { orderNo } = ctx.query
    if (!orderNo) {
      ctx.body = { code: 400, msg: 'orderNo不能为空', data: null }
      return
    }

    const orderRecord = await order.findOne({ where: { order_no: orderNo } })
    if (!orderRecord) {
      ctx.body = { code: 404, msg: '未找到该订单', data: null }
      return
    }

    const o = orderRecord.toJSON()
    // 组装操作日志，根据订单状态和时间节点生成
    const logs = []
    logs.push({ time: o.create_time, operator: o.user_name, action: '提交订单' })
    if (o.status >= 1 && o.pay_time) {
      logs.push({ time: o.pay_time, operator: o.user_name, action: `支付成功  ¥${Number(o.paid_amount).toLocaleString()}` })
    }
    if (o.status >= 2 && o.delivery_time) {
      logs.push({ time: o.delivery_time, operator: '系统', action: `已发货，物流公司：${o.logistics_company || ''}，运单号：${o.tracking_no || ''}` })
    }
    if (o.status >= 3 && o.complete_time) {
      logs.push({ time: o.complete_time, operator: '系统', action: '订单已完成' })
    }
    if (o.status === 4) {
      logs.push({ time: o.complete_time, operator: '客服', action: '关闭订单并退款' })
    }

    ctx.body = {
      code: 200,
      msg: '查询成功',
      data: {
        ...o,
        status_text: statusMap[o.status] || '',
        recipient: {
          name: o.recipient_name || '',
          phone: o.recipient_phone || '',
          address: o.recipient_address || ''
        },
        products: [{
          name: o.product_name,
          price: Number(o.amount) / Number(o.product_count),
          count: o.product_count,
          subtotal: Number(o.amount)
        }],
        logistics: o.status >= 2 && o.logistics_company ? {
          company: o.logistics_company,
          tracking_no: o.tracking_no
        } : null,
        logs
      }
    }
  } catch (err) {
    logger.error('查询订单详情错误:', err)
    ctx.body = {
      code: 500,
      msg: '查询失败: ' + err.message,
      data: null
    }
  }
}

// 订单发货
// 仅待发货(status=1)订单可发货，发货后状态变为已发货(status=2)
const deliveryOrder = async (ctx, next) => {
  try {
    const { id } = ctx.request.body
    if (!id) {
      ctx.body = { code: 400, msg: 'id不能为空', data: null }
      return
    }
    const orderRecord = await order.findByPk(Number(id))
    if (!orderRecord) {
      ctx.body = { code: 404, msg: '订单不存在', data: null }
      return
    }
    if (orderRecord.status !== 1) {
      ctx.body = { code: 400, msg: '当前订单状态不可发货', data: null }
      return
    }
    orderRecord.status = 2
    orderRecord.delivery_time = new Date()
    await orderRecord.save()
    ctx.body = {
      code: 200,
      msg: '发货成功',
      data: null
    }
  } catch (err) {
    logger.error('订单发货错误:', err)
    ctx.body = {
      code: 500,
      msg: '发货失败: ' + err.message,
      data: null
    }
  }
}

// 关闭订单
// 仅待付款(status=0)订单可关闭，关闭后状态变为已退款(status=4)
const closeOrder = async (ctx, next) => {
  try {
    const { id } = ctx.request.body
    if (!id) {
      ctx.body = { code: 400, msg: 'id不能为空', data: null }
      return
    }
    const orderRecord = await order.findByPk(Number(id))
    if (!orderRecord) {
      ctx.body = { code: 404, msg: '订单不存在', data: null }
      return
    }
    if (orderRecord.status !== 0) {
      ctx.body = { code: 400, msg: '当前订单状态不可关闭', data: null }
      return
    }
    orderRecord.status = 4
    orderRecord.complete_time = new Date()
    await orderRecord.save()
    ctx.body = {
      code: 200,
      msg: '订单已关闭',
      data: null
    }
  } catch (err) {
    logger.error('关闭订单错误:', err)
    ctx.body = {
      code: 500,
      msg: '关闭失败: ' + err.message,
      data: null
    }
  }
}

export {
  getOrderList,
  getOrderDetail,
  deliveryOrder,
  closeOrder
}
