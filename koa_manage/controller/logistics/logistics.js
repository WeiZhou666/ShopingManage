import logisticsCompany from '../../model/logistics/logisticsCompany.js'
import shipmentRecord from '../../model/logistics/shipmentRecord.js'
import { Op } from 'sequelize'
import logger from '../../util/log4js.js'

// 物流公司列表分页 + 筛选
// 支持参数：pageNum, pageSize, name(物流公司名称), status(1启用/0停用)
// 返回结构：{ code, msg, data: { list, total, pageNum, pageSize } }
const getCompanyList = async (ctx, next) => {
  try {
    const { pageNum, pageSize, name, status } = ctx.query

    const page = parseInt(pageNum, 10) || 1
    const size = parseInt(pageSize, 10) || 10
    const where = {}
    const conditionArr = []

    // 物流公司名称模糊匹配
    if (name) {
      conditionArr.push({ name: { [Op.like]: `%${name}%` } })
    }

    // 启用/停用状态筛选: 1启用/0停用
    if (status !== undefined && status !== '') {
      conditionArr.push({ status: Number(status) })
    }

    if (conditionArr.length) {
      where[Op.and] = conditionArr
    }

    const { rows, count } = await logisticsCompany.findAndCountAll({
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

// 新增物流公司
const addCompany = async (ctx, next) => {
  try {
    const { name, code, website, status } = ctx.request.body

    // 物流公司编码唯一校验
    const existCode = await logisticsCompany.findOne({ where: { code } })
    if (existCode) {
      ctx.body = { code: 400, msg: '物流公司编码已存在', data: null }
      return
    }

    const newCompany = await logisticsCompany.create({
      name,
      code,
      website: website || '',
      status: status !== undefined ? Number(status) : 1
    })
    ctx.body = {
      code: 200,
      msg: '增加成功',
      data: newCompany
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

// 编辑物流公司
const updateCompany = async (ctx, next) => {
  try {
    const { id, name, code, website, status } = ctx.request.body

    const companyRecord = await logisticsCompany.findByPk(Number(id))
    if (!companyRecord) {
      ctx.body = { code: 404, msg: '物流公司不存在', data: null }
      return
    }

    if (name !== undefined) companyRecord.name = name
    if (code !== undefined) companyRecord.code = code
    if (website !== undefined) companyRecord.website = website
    if (status !== undefined) companyRecord.status = Number(status)
    await companyRecord.save()

    ctx.body = {
      code: 200,
      msg: '编辑成功',
      data: companyRecord
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

// 切换物流公司状态
const updateCompanyStatus = async (ctx, next) => {
  try {
    const { id, status } = ctx.request.body
    if (id === undefined || status === undefined) {
      ctx.body = { code: 400, msg: 'id或status不能为空', data: null }
      return
    }
    await logisticsCompany.update({ status: Number(status) }, { where: { id: Number(id) } })
    ctx.body = {
      code: 200,
      msg: Number(status) === 1 ? '已启用' : '已停用',
      data: { id, status: Number(status) }
    }
  } catch (err) {
    logger.error('数据库更新状态错误:', err)
    ctx.body = {
      code: 500,
      msg: '更新失败: ' + err.message,
      data: null
    }
  }
}

// 删除物流公司
const deleteCompany = async (ctx, next) => {
  try {
    const { id } = ctx.query
    if (!id) {
      ctx.body = { code: 400, msg: 'id不能为空', data: null }
      return
    }
    await logisticsCompany.destroy({ where: { id: Number(id) } })
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

// 发货记录列表分页 + 筛选
// 支持参数：pageNum, pageSize, orderNo, companyCode, startDate, endDate
// 返回结构：{ code, msg, data: { list, total, pageNum, pageSize } }
const getShipmentRecordList = async (ctx, next) => {
  try {
    const { pageNum, pageSize, orderNo, companyCode, startDate, endDate } = ctx.query

    const page = parseInt(pageNum, 10) || 1
    const size = parseInt(pageSize, 10) || 10
    const where = {}
    const conditionArr = []

    // 订单号模糊匹配
    if (orderNo) {
      conditionArr.push({ order_no: { [Op.like]: `%${orderNo}%` } })
    }

    // 物流公司编码精确匹配
    if (companyCode) {
      conditionArr.push({ company_code: companyCode })
    }

    // 发货时间范围筛选
    if (startDate) {
      conditionArr.push({ shipment_time: { [Op.gte]: startDate } })
    }
    if (endDate) {
      conditionArr.push({ shipment_time: { [Op.lte]: `${endDate} 23:59:59` } })
    }

    if (conditionArr.length) {
      where[Op.and] = conditionArr
    }

    const { rows, count } = await shipmentRecord.findAndCountAll({
      where,
      limit: size,
      offset: (page - 1) * size,
      order: [['shipment_time', 'DESC']]
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

export {
  getCompanyList,
  addCompany,
  updateCompany,
  updateCompanyStatus,
  deleteCompany,
  getShipmentRecordList
}
