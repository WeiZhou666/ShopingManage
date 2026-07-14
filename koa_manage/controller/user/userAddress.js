import userAddress from '../../model/user/userAddress.js'
import sequelize from '../../config/db.js'
import { Op } from 'sequelize'
import logger from '../../util/log4js.js'

// 获取某用户的全部收货地址
// 参数：userId
const getAddressList = async (ctx) => {
  try {
    const { userId } = ctx.query
    if (!userId) {
      ctx.body = { code: 400, msg: 'userId不能为空', data: null }
      return
    }
    const list = await userAddress.findAll({
      where: { user_id: userId },
      order: [['is_default', 'DESC'], ['id', 'ASC']]
    })
    ctx.body = {
      code: 200,
      msg: '查询成功',
      data: { list }
    }
  } catch (err) {
    logger.error('查询收货地址失败:', err)
    ctx.body = {
      code: 500,
      msg: '查询失败: ' + err.message,
      data: null
    }
  }
}

// 新增收货地址
// 若 is_default=1，事务内先清除该用户其他默认地址
const addAddress = async (ctx) => {
  try {
    const { user_id, name, phone, address, is_default } = ctx.request.body
    if (!user_id || !name || !phone || !address) {
      ctx.body = { code: 400, msg: '缺少必填字段', data: null }
      return
    }

    const result = await sequelize.transaction(async (t) => {
      if (is_default === 1) {
        await userAddress.update(
          { is_default: 0 },
          { where: { user_id, is_default: 1 }, transaction: t }
        )
      }
      return await userAddress.create(
        { user_id, name, phone, address, is_default: is_default || 0 },
        { transaction: t }
      )
    })

    ctx.body = {
      code: 200,
      msg: '新增成功',
      data: { id: result.id }
    }
  } catch (err) {
    logger.error('新增收货地址失败:', err)
    ctx.body = {
      code: 500,
      msg: '新增失败: ' + err.message,
      data: null
    }
  }
}

// 更新收货地址
// 若将 is_default 设为 1，事务内先清除该用户其他默认地址
const updateAddress = async (ctx) => {
  try {
    const { id, name, phone, address, is_default } = ctx.request.body
    if (!id) {
      ctx.body = { code: 400, msg: 'id不能为空', data: null }
      return
    }

    await sequelize.transaction(async (t) => {
      const target = await userAddress.findByPk(id, { transaction: t })
      if (!target) throw new Error('地址不存在')

      if (is_default === 1) {
        await userAddress.update(
          { is_default: 0 },
          { where: { user_id: target.user_id, is_default: 1, id: { [Op.ne]: id } }, transaction: t }
        )
      }
      await target.update({ name, phone, address, is_default }, { transaction: t })
    })

    ctx.body = {
      code: 200,
      msg: '更新成功',
      data: { id }
    }
  } catch (err) {
    logger.error('更新收货地址失败:', err)
    ctx.body = {
      code: 500,
      msg: '更新失败: ' + err.message,
      data: null
    }
  }
}

// 删除收货地址
const deleteAddress = async (ctx) => {
  try {
    const { id } = ctx.query
    if (!id) {
      ctx.body = { code: 400, msg: 'id不能为空', data: null }
      return
    }
    await userAddress.destroy({ where: { id } })
    ctx.body = {
      code: 200,
      msg: '删除成功',
      data: { id }
    }
  } catch (err) {
    logger.error('删除收货地址失败:', err)
    ctx.body = {
      code: 500,
      msg: '删除失败: ' + err.message,
      data: null
    }
  }
}

// 设为默认地址
// 事务内先清除该用户其他默认地址，再将目标地址设为默认
const setDefaultAddress = async (ctx) => {
  try {
    const { id } = ctx.request.body
    if (!id) {
      ctx.body = { code: 400, msg: 'id不能为空', data: null }
      return
    }

    await sequelize.transaction(async (t) => {
      const target = await userAddress.findByPk(id, { transaction: t })
      if (!target) throw new Error('地址不存在')

      await userAddress.update(
        { is_default: 0 },
        { where: { user_id: target.user_id, is_default: 1, id: { [Op.ne]: id } }, transaction: t }
      )
      await target.update({ is_default: 1 }, { transaction: t })
    })

    ctx.body = {
      code: 200,
      msg: '设置默认地址成功',
      data: { id }
    }
  } catch (err) {
    logger.error('设置默认地址失败:', err)
    ctx.body = {
      code: 500,
      msg: '设置失败: ' + err.message,
      data: null
    }
  }
}

export {
  getAddressList,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
}
