import coupon from '../../model/marketing/coupon.js'
import seckill from '../../model/marketing/seckill.js'
import discount from '../../model/marketing/discount.js'
import product from '../../model/product/product.js'
import { Op } from 'sequelize'
import logger from '../../util/log4js.js'

// ==================== 优惠券 ====================

// 优惠券列表分页 + 筛选
// 支持参数：pageNum, pageSize, name, type(full_reduction/discount), status(pending/active/ended)
// 返回结构：{ code, msg, data: { list, total, pageNum, pageSize } }
const getCouponList = async (ctx, next) => {
  try {
    const { pageNum, pageSize, name, type, status } = ctx.query

    const page = parseInt(pageNum, 10) || 1
    const size = parseInt(pageSize, 10) || 10
    const where = {}
    const conditionArr = []

    // 优惠券名称模糊匹配
    if (name) {
      conditionArr.push({ name: { [Op.like]: `%${name}%` } })
    }

    // 类型筛选: full_reduction-满减 discount-折扣
    if (type) {
      conditionArr.push({ type })
    }

    // 状态筛选: pending-未开始 active-进行中 ended-已结束
    if (status) {
      conditionArr.push({ status })
    }

    if (conditionArr.length) {
      where[Op.and] = conditionArr
    }

    const { rows, count } = await coupon.findAndCountAll({
      where,
      limit: size,
      offset: (page - 1) * size,
      order: [['id', 'DESC']]
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

// 新增优惠券
// 前端传 { name, type, threshold, discount, total_quantity, start_date, end_date }
// 后端拼接 valid_period，初始 received_quantity/used_quantity 为 0，status 为 pending
const addCoupon = async (ctx, next) => {
  try {
    const { name, type, threshold, discount, total_quantity, start_date, end_date } = ctx.request.body

    const newCoupon = await coupon.create({
      name,
      type,
      threshold: Number(threshold) || 0,
      discount: Number(discount) || 0,
      total_quantity: Number(total_quantity) || 0,
      received_quantity: 0,
      used_quantity: 0,
      valid_period: `${start_date} ~ ${end_date}`,
      status: 'pending'
    })
    ctx.body = {
      code: 200,
      msg: '增加成功',
      data: newCoupon
    }
  } catch (err) {
    logger.error('数据库增加错误:', err)
    ctx.body = {
      code: 500,
      msg: '增加失败: ' + err.message,
      data: null
    }
  }
}

// 编辑优惠券
const updateCoupon = async (ctx, next) => {
  try {
    const { id, name, type, threshold, discount, total_quantity, start_date, end_date, status } = ctx.request.body

    const couponRecord = await coupon.findByPk(Number(id))
    if (!couponRecord) {
      ctx.body = { code: 404, msg: '优惠券不存在', data: null }
      return
    }

    if (name !== undefined) couponRecord.name = name
    if (type !== undefined) couponRecord.type = type
    if (threshold !== undefined) couponRecord.threshold = Number(threshold)
    if (discount !== undefined) couponRecord.discount = Number(discount)
    if (total_quantity !== undefined) couponRecord.total_quantity = Number(total_quantity)
    if (start_date && end_date) couponRecord.valid_period = `${start_date} ~ ${end_date}`
    if (status !== undefined) couponRecord.status = status
    await couponRecord.save()

    ctx.body = {
      code: 200,
      msg: '编辑成功',
      data: couponRecord
    }
  } catch (err) {
    logger.error('数据库编辑错误:', err)
    ctx.body = {
      code: 500,
      msg: '编辑失败: ' + err.message,
      data: null
    }
  }
}

// 删除优惠券
const deleteCoupon = async (ctx, next) => {
  try {
    const { id } = ctx.query
    if (!id) {
      ctx.body = { code: 400, msg: 'id不能为空', data: null }
      return
    }
    await coupon.destroy({ where: { id: Number(id) } })
    ctx.body = {
      code: 200,
      msg: '删除成功',
      data: null
    }
  } catch (err) {
    logger.error('数据库删除错误:', err)
    ctx.body = {
      code: 500,
      msg: '删除失败: ' + err.message,
      data: null
    }
  }
}

// ==================== 秒杀活动 ====================

// 秒杀活动列表分页 + 筛选
// 支持参数：pageNum, pageSize, name, status(pending/active/ended)
const getSeckillList = async (ctx, next) => {
  try {
    const { pageNum, pageSize, name, status } = ctx.query

    const page = parseInt(pageNum, 10) || 1
    const size = parseInt(pageSize, 10) || 10
    const where = {}
    const conditionArr = []

    // 秒杀活动名称模糊匹配
    if (name) {
      conditionArr.push({ name: { [Op.like]: `%${name}%` } })
    }

    // 状态筛选: pending-未开始 active-进行中 ended-已结束
    if (status) {
      conditionArr.push({ status })
    }

    if (conditionArr.length) {
      where[Op.and] = conditionArr
    }

    const { rows, count } = await seckill.findAndCountAll({
      where,
      limit: size,
      offset: (page - 1) * size,
      order: [['id', 'DESC']]
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

// 新增秒杀活动
// 前端传 { name, product_id, original_price, seckill_price, seckill_stock, limit_quantity, start_time, end_time }
// 后端查询商品名称，拼接 active_period，初始 sold_quantity 为 0，status 为 pending
const addSeckill = async (ctx, next) => {
  try {
    const { name, product_id, original_price, seckill_price, seckill_stock, limit_quantity, start_time, end_time } = ctx.request.body

    // 查询关联商品名称
    const productRecord = await product.findByPk(Number(product_id))
    const productName = productRecord ? productRecord.name : '未知商品'

    const newSeckill = await seckill.create({
      name,
      product_id: Number(product_id),
      product_name: productName,
      original_price: Number(original_price) || 0,
      seckill_price: Number(seckill_price) || 0,
      seckill_stock: Number(seckill_stock) || 0,
      limit_quantity: Number(limit_quantity) || 1,
      sold_quantity: 0,
      active_period: `${start_time} ~ ${end_time}`,
      status: 'pending'
    })
    ctx.body = {
      code: 200,
      msg: '增加成功',
      data: newSeckill
    }
  } catch (err) {
    logger.error('数据库增加错误:', err)
    ctx.body = {
      code: 500,
      msg: '增加失败: ' + err.message,
      data: null
    }
  }
}

// 编辑秒杀活动
const updateSeckill = async (ctx, next) => {
  try {
    const { id, name, product_id, original_price, seckill_price, seckill_stock, limit_quantity, start_time, end_time, status } = ctx.request.body

    const seckillRecord = await seckill.findByPk(Number(id))
    if (!seckillRecord) {
      ctx.body = { code: 404, msg: '秒杀活动不存在', data: null }
      return
    }

    // 如果商品ID变更，重新查询商品名称
    if (product_id !== undefined) {
      seckillRecord.product_id = Number(product_id)
      const productRecord = await product.findByPk(Number(product_id))
      seckillRecord.product_name = productRecord ? productRecord.name : '未知商品'
    }
    if (name !== undefined) seckillRecord.name = name
    if (original_price !== undefined) seckillRecord.original_price = Number(original_price)
    if (seckill_price !== undefined) seckillRecord.seckill_price = Number(seckill_price)
    if (seckill_stock !== undefined) seckillRecord.seckill_stock = Number(seckill_stock)
    if (limit_quantity !== undefined) seckillRecord.limit_quantity = Number(limit_quantity)
    if (start_time && end_time) seckillRecord.active_period = `${start_time} ~ ${end_time}`
    if (status !== undefined) seckillRecord.status = status
    await seckillRecord.save()

    ctx.body = {
      code: 200,
      msg: '编辑成功',
      data: seckillRecord
    }
  } catch (err) {
    logger.error('数据库编辑错误:', err)
    ctx.body = {
      code: 500,
      msg: '编辑失败: ' + err.message,
      data: null
    }
  }
}

// 删除秒杀活动
const deleteSeckill = async (ctx, next) => {
  try {
    const { id } = ctx.query
    if (!id) {
      ctx.body = { code: 400, msg: 'id不能为空', data: null }
      return
    }
    await seckill.destroy({ where: { id: Number(id) } })
    ctx.body = {
      code: 200,
      msg: '删除成功',
      data: null
    }
  } catch (err) {
    logger.error('数据库删除错误:', err)
    ctx.body = {
      code: 500,
      msg: '删除失败: ' + err.message,
      data: null
    }
  }
}

// ==================== 限时折扣 ====================

// 限时折扣列表分页 + 筛选
// 支持参数：pageNum, pageSize, name(匹配商品名称), status(pending/active/ended)
const getDiscountList = async (ctx, next) => {
  try {
    const { pageNum, pageSize, name, status } = ctx.query

    const page = parseInt(pageNum, 10) || 1
    const size = parseInt(pageSize, 10) || 10
    const where = {}
    const conditionArr = []

    // 商品名称模糊匹配
    if (name) {
      conditionArr.push({ product_name: { [Op.like]: `%${name}%` } })
    }

    // 状态筛选: pending-未开始 active-进行中 ended-已结束
    if (status) {
      conditionArr.push({ status })
    }

    if (conditionArr.length) {
      where[Op.and] = conditionArr
    }

    const { rows, count } = await discount.findAndCountAll({
      where,
      limit: size,
      offset: (page - 1) * size,
      order: [['id', 'DESC']]
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

// 新增限时折扣
// 前端传 { product_id, original_price, discount_price, discount_rate, start_date, end_date }
// 后端查询商品名称，拼接 active_period，初始 status 为 pending
const addDiscount = async (ctx, next) => {
  try {
    const { product_id, original_price, discount_price, discount_rate, start_date, end_date } = ctx.request.body

    // 查询关联商品名称
    const productRecord = await product.findByPk(Number(product_id))
    const productName = productRecord ? productRecord.name : '未知商品'

    const newDiscount = await discount.create({
      product_id: Number(product_id),
      product_name: productName,
      original_price: Number(original_price) || 0,
      discount_price: Number(discount_price) || 0,
      discount_rate: Number(discount_rate) || 0,
      active_period: `${start_date} ~ ${end_date}`,
      status: 'pending'
    })
    ctx.body = {
      code: 200,
      msg: '增加成功',
      data: newDiscount
    }
  } catch (err) {
    logger.error('数据库增加错误:', err)
    ctx.body = {
      code: 500,
      msg: '增加失败: ' + err.message,
      data: null
    }
  }
}

// 编辑限时折扣
const updateDiscount = async (ctx, next) => {
  try {
    const { id, product_id, original_price, discount_price, discount_rate, start_date, end_date, status } = ctx.request.body

    const discountRecord = await discount.findByPk(Number(id))
    if (!discountRecord) {
      ctx.body = { code: 404, msg: '折扣活动不存在', data: null }
      return
    }

    // 如果商品ID变更，重新查询商品名称
    if (product_id !== undefined) {
      discountRecord.product_id = Number(product_id)
      const productRecord = await product.findByPk(Number(product_id))
      discountRecord.product_name = productRecord ? productRecord.name : '未知商品'
    }
    if (original_price !== undefined) discountRecord.original_price = Number(original_price)
    if (discount_price !== undefined) discountRecord.discount_price = Number(discount_price)
    if (discount_rate !== undefined) discountRecord.discount_rate = Number(discount_rate)
    if (start_date && end_date) discountRecord.active_period = `${start_date} ~ ${end_date}`
    if (status !== undefined) discountRecord.status = status
    await discountRecord.save()

    ctx.body = {
      code: 200,
      msg: '编辑成功',
      data: discountRecord
    }
  } catch (err) {
    logger.error('数据库编辑错误:', err)
    ctx.body = {
      code: 500,
      msg: '编辑失败: ' + err.message,
      data: null
    }
  }
}

// 删除限时折扣
const deleteDiscount = async (ctx, next) => {
  try {
    const { id } = ctx.query
    if (!id) {
      ctx.body = { code: 400, msg: 'id不能为空', data: null }
      return
    }
    await discount.destroy({ where: { id: Number(id) } })
    ctx.body = {
      code: 200,
      msg: '删除成功',
      data: null
    }
  } catch (err) {
    logger.error('数据库删除错误:', err)
    ctx.body = {
      code: 500,
      msg: '删除失败: ' + err.message,
      data: null
    }
  }
}

export {
  getCouponList,
  addCoupon,
  updateCoupon,
  deleteCoupon,
  getSeckillList,
  addSeckill,
  updateSeckill,
  deleteSeckill,
  getDiscountList,
  addDiscount,
  updateDiscount,
  deleteDiscount
}
