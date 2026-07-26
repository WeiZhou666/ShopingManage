import order from '../../model/order/order.js'
import product from '../../model/product/product.js'
import sequelize from '../../config/db.js'
import { Op } from 'sequelize'
import logger from '../../util/log4js.js'

// 首页表格数据（最近 5 笔订单）
const getTableData = async (ctx, next) => {
  try {
    const list = await order.findAll({
      limit: 5,
      order: [['create_time', 'DESC']],
      attributes: ['id', ['order_no', 'name'], ['create_time', 'date'], 'status']
    })
    ctx.body = {
      code: 200,
      msg: '查询成功',
      data: { list }
    }
  } catch (err) {
    logger.error('首页表格数据查询错误:', err)
    ctx.body = {
      code: 500,
      msg: '查询失败: ' + err.message,
      data: null
    }
  }
}

// 首页统计卡片数据
// 今日订单数 / 今日成交金额 / 待发货 / 待付款 / 售后中
const getCountData = async (ctx, next) => {
  try {
    // 今日起止时间
    const today = new Date()
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)

    // 并行查询各项统计
    const [todayOrderCount, todayAmount, pendingShipment, pendingPayment, afterSale] = await Promise.all([
      // 今日订单数
      order.count({ where: { create_time: { [Op.between]: [todayStart, todayEnd] } } }),
      // 今日成交金额
      order.sum('amount', { where: { create_time: { [Op.between]: [todayStart, todayEnd] } } }),
      // 待发货
      order.count({ where: { status: 1 } }),
      // 待付款
      order.count({ where: { status: 0 } }),
      // 售后中（已退款）
      order.count({ where: { status: 4 } })
    ])

    ctx.body = {
      code: 200,
      msg: '查询成功',
      data: {
        countData: [
          { name: '今日订单数', value: String(todayOrderCount || 0), icon: 'ShoppingCart', color: '#409eff', trend: 0 },
          { name: '今日成交金额', value: Number(todayAmount || 0).toLocaleString(), icon: 'Money', color: '#67c23a', trend: 0 },
          { name: '待发货', value: String(pendingShipment || 0), icon: 'Box', color: '#e6a23c', trend: 0 },
          { name: '待付款', value: String(pendingPayment || 0), icon: 'Clock', color: '#f56c6c', trend: 0 },
          { name: '售后中', value: String(afterSale || 0), icon: 'ChatDotRound', color: '#909399', trend: 0 }
        ]
      }
    }
  } catch (err) {
    logger.error('首页统计卡片查询错误:', err)
    ctx.body = {
      code: 500,
      msg: '查询失败: ' + err.message,
      data: null
    }
  }
}

// 首页折线图数据（近 12 个月每月订单数）
const getChartData = async (ctx, next) => {
  try {
    // 生成近 12 个月的标签
    const now = new Date()
    const xData = []
    const monthMap = {}
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      xData.push(`${d.getMonth() + 1}月`)
      monthMap[key] = 0
    }

    // 按月分组统计订单数
    const rows = await order.findAll({
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('create_time'), '%Y-%m'), 'month'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['month'],
      raw: true
    })

    // 填充查询结果到对应月份
    rows.forEach(row => {
      if (monthMap[row.month] !== undefined) {
        monthMap[row.month] = Number(row.count)
      }
    })

    const seriesData = Object.values(monthMap)

    ctx.body = {
      code: 200,
      msg: '查询成功',
      data: {
        chartData: { xData, seriesData }
      }
    }
  } catch (err) {
    logger.error('首页折线图查询错误:', err)
    ctx.body = {
      code: 500,
      msg: '查询失败: ' + err.message,
      data: null
    }
  }
}

// 首页柱状图数据（各商品分类的商品数量）
const getBarChartData = async (ctx, next) => {
  try {
    const rows = await product.findAll({
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['category'],
      raw: true
    })

    const xData = rows.map(r => r.category)
    const seriesData = rows.map(r => Number(r.count))

    ctx.body = {
      code: 200,
      msg: '查询成功',
      data: {
        barChartData: { xData, seriesData }
      }
    }
  } catch (err) {
    logger.error('首页柱状图查询错误:', err)
    ctx.body = {
      code: 500,
      msg: '查询失败: ' + err.message,
      data: null
    }
  }
}

// 首页饼图数据（流量来源，无对应数据表，返回静态数据）
const getPieChartData = async (ctx, next) => {
  ctx.body = {
    code: 200,
    msg: '查询成功',
    data: {
      pieChartData: [
        { name: '直接访问', value: 335 },
        { name: '搜索引擎', value: 310 },
        { name: '邮件营销', value: 234 },
        { name: '联盟广告', value: 135 },
        { name: '视频广告', value: 148 }
      ]
    }
  }
}

export {
  getTableData,
  getCountData,
  getChartData,
  getBarChartData,
  getPieChartData
}
