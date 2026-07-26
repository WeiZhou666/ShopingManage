import product from '../../model/product/product.js'
import productSku from '../../model/product/productSku.js'
import sequelize from '../../config/db.js'
import { Op } from 'sequelize'
import logger from '../../util/log4js.js'

// 商品列表分页 + 筛选
// 支持参数：pageNum, pageSize, keyword(匹配 商品名称/商品ID), category, status(1上架/0下架)
// 返回结构：{ code, msg, data: { list, total, pageNum, pageSize } }
const getProductList = async (ctx, next) => {
  try {
    const { pageNum, pageSize, keyword, category, status } = ctx.query

    const page = parseInt(pageNum, 10) || 1
    const size = parseInt(pageSize, 10) || 10
    const where = {}
    const conditionArr = []

    // 关键字模糊匹配 商品名称 或 精确匹配 商品ID
    if (keyword) {
      const numId = Number(keyword)
      const kw = `%${keyword}%`
      if (!isNaN(numId)) {
        // 输入的是数字，同时按名称模糊和ID精确匹配
        conditionArr.push({
          [Op.or]: [
            { name: { [Op.like]: kw } },
            { id: numId }
          ]
        })
      } else {
        conditionArr.push({ name: { [Op.like]: kw } })
      }
    }

    // 分类筛选
    if (category) {
      conditionArr.push({ category })
    }

    // 上下架状态筛选: 1上架/0下架
    if (status !== undefined && status !== '') {
      conditionArr.push({ status: Number(status) })
    }

    if (conditionArr.length) {
      where[Op.and] = conditionArr
    }

    const { rows, count } = await product.findAndCountAll({
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

// 获取商品详情（基本信息）
// 参数：id
const getProductDetail = async (ctx, next) => {
  try {
    const { id } = ctx.query
    if (!id) {
      ctx.body = { code: 400, msg: 'id不能为空', data: null }
      return
    }
    const productRecord = await product.findByPk(Number(id))
    if (productRecord) {
      ctx.body = {
        code: 200,
        msg: '查询成功',
        data: productRecord
      }
    } else {
      ctx.body = {
        code: 404,
        msg: '商品不存在',
        data: null
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

// 获取商品编辑数据（含 SKU 规格）
// 参数：id
const getProductEdit = async (ctx, next) => {
  try {
    const { id } = ctx.query
    if (!id) {
      ctx.body = { code: 400, msg: 'id不能为空', data: null }
      return
    }

    const productRecord = await product.findByPk(Number(id))
    if (!productRecord) {
      ctx.body = { code: 404, msg: '商品不存在', data: null }
      return
    }

    // 并行查询 SKU 列表
    const skus = await productSku.findAll({
      where: { product_id: Number(id) },
      order: [['id', 'ASC']]
    })

    ctx.body = {
      code: 200,
      msg: '查询成功',
      data: {
        ...productRecord.toJSON(),
        skus
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

// 新增商品（事务内同时创建商品和 SKU）
const addProduct = async (ctx, next) => {
  try {
    const { name, category, price, original_price, stock, status, description, skus } = ctx.request.body

    const result = await sequelize.transaction(async (t) => {
      const newProduct = await product.create({
        name,
        category,
        price: Number(price) || 0,
        original_price: Number(original_price) || 0,
        stock: Number(stock) || 0,
        status: status !== undefined ? Number(status) : 1,
        description: description || ''
      }, { transaction: t })

      // 如果传了 SKU 列表，批量创建
      if (skus && skus.length) {
        const skuData = skus.map(s => ({
          product_id: newProduct.id,
          spec: s.spec,
          stock: Number(s.stock) || 0,
          price: Number(s.price) || 0
        }))
        await productSku.bulkCreate(skuData, { transaction: t })
      }

      return newProduct
    })

    ctx.body = {
      code: 200,
      msg: '增加成功',
      data: result
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

// 编辑商品（事务内更新商品和 SKU）
const updateProduct = async (ctx, next) => {
  try {
    const { id, name, category, price, original_price, stock, status, description, skus } = ctx.request.body

    const productRecord = await product.findByPk(Number(id))
    if (!productRecord) {
      ctx.body = { code: 404, msg: '商品不存在', data: null }
      return
    }

    await sequelize.transaction(async (t) => {
      if (name !== undefined) productRecord.name = name
      if (category !== undefined) productRecord.category = category
      if (price !== undefined) productRecord.price = Number(price)
      if (original_price !== undefined) productRecord.original_price = Number(original_price)
      if (stock !== undefined) productRecord.stock = Number(stock)
      if (status !== undefined) productRecord.status = Number(status)
      if (description !== undefined) productRecord.description = description
      await productRecord.save({ transaction: t })

      // 如果传了 SKU 列表，先删旧后增新
      if (skus && skus.length) {
        await productSku.destroy({ where: { product_id: Number(id) }, transaction: t })
        const skuData = skus.map(s => ({
          product_id: Number(id),
          spec: s.spec,
          stock: Number(s.stock) || 0,
          price: Number(s.price) || 0
        }))
        await productSku.bulkCreate(skuData, { transaction: t })
      }
    })

    ctx.body = {
      code: 200,
      msg: '编辑成功',
      data: productRecord
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

// 删除商品（同时删除关联 SKU）
const deleteProduct = async (ctx, next) => {
  try {
    const { id } = ctx.query
    if (!id) {
      ctx.body = { code: 400, msg: 'id不能为空', data: null }
      return
    }
    await sequelize.transaction(async (t) => {
      await productSku.destroy({ where: { product_id: Number(id) }, transaction: t })
      await product.destroy({ where: { id: Number(id) }, transaction: t })
    })
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

// 批量删除商品
// ids 是数字数组，由前端传入选中的商品id列表
const batchDeleteProducts = async (ctx, next) => {
  try {
    const { ids } = ctx.request.body
    if (!ids || ids.length === 0) {
      ctx.body = { code: 400, msg: 'ids不能为空', data: null }
      return
    }
    await sequelize.transaction(async (t) => {
      await productSku.destroy({ where: { product_id: { [Op.in]: ids } }, transaction: t })
      await product.destroy({ where: { id: { [Op.in]: ids } }, transaction: t })
    })
    ctx.body = {
      code: 200,
      msg: '批量删除成功',
      data: { ids }
    }
  } catch (err) {
    logger.error('数据库批量删除错误:', err)
    ctx.body = {
      code: 500,
      msg: '批量删除失败: ' + err.message,
      data: null
    }
  }
}

// 上下架切换
const updateProductStatus = async (ctx, next) => {
  try {
    const { id, status } = ctx.request.body
    if (id === undefined || status === undefined) {
      ctx.body = { code: 400, msg: 'id或status不能为空', data: null }
      return
    }
    await product.update({ status: Number(status) }, { where: { id: Number(id) } })
    ctx.body = {
      code: 200,
      msg: Number(status) === 1 ? '已上架' : '已下架',
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

export {
  getProductList,
  getProductDetail,
  getProductEdit,
  addProduct,
  updateProduct,
  deleteProduct,
  batchDeleteProducts,
  updateProductStatus
}
