import staff from '../../model/staff/staff.js'
import roles from '../../model/staff/roles.js'

import { Op } from 'sequelize'
import logger from '../../util/log4js.js'
import bcrypt from 'bcryptjs'
import { generateToken } from '../../util/jwt.js'

// 格式化时间为 YYYY-MM-DD HH:mm:ss
const formatTime = (date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  const s = String(date.getSeconds()).padStart(2, '0')
  return `${y}-${m}-${d} ${h}:${min}:${s}`
}

// 角色编码与 Element Plus 标签类型的映射
const roleTypeMap = {
  super_admin: 'danger',
  operator: 'primary',
  order_staff: 'success',
  finance: 'warning',
  customer_service: 'info'
}

// 获取角色列表
// 返回 roles 表数据，并补充 value(=code) / label(=name) / type(标签类型) 字段供前端使用
const getRoleList = async (ctx, next) => {
  try {
    const list = await roles.findAll({ order: [['id', 'ASC']] })
    const data = list.map(r => ({
      id: r.id,
      code: r.code,
      name: r.name,
      value: r.code,
      label: r.name,
      type: roleTypeMap[r.code] || 'info'
    }))
    ctx.body = {
      code: 200,
      msg: '查询成功',
      data
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

// 员工列表分页 + 筛选
// 支持参数：pageNum, pageSize, keyword(匹配 工号/姓名/手机号), tags(1超级管理员/2运营管理员/3订单管理员/4财务/5客服), status(1正常/0禁用), startDate, endDate
// 返回结构：{ code, msg, data: { list, total, pageNum, pageSize } }
const getStaffList = async (ctx, next) => {
  try {
    const { pageNum, pageSize, keyword, role_id, status } = ctx.query

    // 分页参数转换为整数
    const page = parseInt(pageNum, 10) || 1
    const size = parseInt(pageSize, 10) || 10
    const where = {}
    const conditionArr = []

    // 关键字模糊匹配 工号 / 姓名 / 手机号 (OR 关系)
    if (keyword) {
      const kw = `%${keyword}%`
      conditionArr.push({
        [Op.or]: [
          { employee_no: { [Op.like]: kw } },
          { name: { [Op.like]: kw } },
          { phone: { [Op.like]: kw } }
        ]
      })
    }

    // role_id 是互斥单选数字: 1=超级管理员 2=运营 3=订单 4=财务 5=客服
    if (role_id !== undefined && role_id !== '') {
      conditionArr.push({ role_id: Number(role_id) })
    }


    // 状态筛选: 1正常/0禁用
    if (status !== undefined && status !== '') {
      conditionArr.push({ status: Number(status) })
    }


    // 合并所有条件
    if (conditionArr.length) {
      where[Op.and] = conditionArr
    }

    // 分页查询（不查 password 字段）
    const { rows, count } = await staff.findAndCountAll({
      where,
      limit: size,
      offset: (page - 1) * size,
      order: [['create_time', 'DESC']],
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
//增加员工
const addStaff = async (ctx, next) => {
  try {

    const { name, phone, password, role_id, status, account } = ctx.request.body

    // 自动生成 employee_no：查询当前最大 id，+1 后补零
    const maxRecord = await staff.findOne({ order: [['id', 'DESC']] })
    const newId = maxRecord ? maxRecord.id + 1 : 1
    const employee_no = `EMP${String(newId).padStart(3, '0')}`

    // 检查账号和手机号是否已存在
    const existAccount = await staff.findOne({ where: { account } })
    if (existAccount) {
      ctx.body = { code: 400, msg: '账号已存在', data: null }
      return
    }
    const existPhone = await staff.findOne({ where: { phone } })
    if (existPhone) {
      ctx.body = { code: 400, msg: '手机号已存在', data: null }
      return
    }

    const newStaff = await staff.create({
      employee_no,
      name,
      account,
      phone,
      password: bcrypt.hashSync(password || '123456', bcrypt.genSaltSync(10)),
      role_id: Number(role_id),
      status: status || '1'
    })
    ctx.body = {
      code: 200,
      msg: '增加成功',
      data: newStaff
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
//删除员工
const deleteStaff = async (ctx, next) => {
  try {
    //query.id 是字符串，需要转换为数字类型
    const { id } = ctx.query
    await staff.destroy({
      where: {
        id: Number(id)
      }
    })

  }
  catch (err) {
    logger.error('数据库删除错误:', err)
    ctx.body = {
      code: 500,
      msg: '删除失败: ' + err.message,
      data: null
    }
  }
}
//批量删除员工
//ids 是数字数组，由前端传入选中的员工id列表
const batchDeleteStaff = async (ctx, next) => {
  try {
    const { ids } = ctx.request.body
    if (!ids || ids.length === 0) {
      ctx.body = { code: 400, msg: 'ids不能为空', data: null }
      return
    }
    await staff.destroy({
      where: {
        id: {
          [Op.in]: ids
        }
      }
    })
    ctx.body = {
      code: 200,
      msg: '批量删除成功',
      data: { ids }
    }
  }
  catch (err) {
    logger.error('数据库批量删除错误:', err)
    ctx.body = {
      code: 500,
      msg: '批量删除失败: ' + err.message,
      data: null
    }
  }
}
//查看员工详情
const getStaffDetail = async (ctx, next) => {
  try {
    const { id } = ctx.query
    const staffRecord = await staff.findByPk(Number(id))
    if (staffRecord) {
      ctx.body = {
        code: 200,
        msg: '查询成功',
        data: staffRecord
      }
    } else {
      ctx.body = {
        code: 404,
        msg: '员工不存在',
        data: null
      }
    }
  }
  catch (err) {
    logger.error('数据库查询错误:', err)
    ctx.body = {
      code: 500,
      msg: '查询失败: ' + err.message,
      data: null
    }
  }
}
//重置员工密码
const resetStaffPassword = async (ctx, next) => {
  try {
    const { id } = ctx.request.body
    const staffRecord = await staff.findByPk(Number(id))
    if (staffRecord) {
      staffRecord.password = bcrypt.hashSync('123456', bcrypt.genSaltSync(10))
      staffRecord.first_login = 1
      await staffRecord.save()
      ctx.body = {
        code: 200,
        msg: '重置成功',
        data: staffRecord
      }
    } else {
      ctx.body = {
        code: 404,
        msg: '员工不存在',
        data: null
      }
    }
  } catch (err) {
    logger.error('数据库重置密码错误:', err)
    ctx.body = {
      code: 500,
      msg: '重置密码失败: ' + err.message,
      data: null
    }
  }
}
//切换员工状态
const toggleStaffStatus = async (ctx, next) => {
  try {
    const { id, status } = ctx.request.body
    const staffRecord = await staff.findByPk(Number(id))
    if (staffRecord) {
      staffRecord.status = Number(status)
      await staffRecord.save()
      ctx.body = {
        code: 200,
        msg: '切换成功',
        data: staffRecord
      }
    } else {
      ctx.body = {
        code: 404,
        msg: '员工不存在',
        data: null
      }
    }
  } catch (err) {
    logger.error('数据库切换状态错误:', err)
    ctx.body = {
      code: 500,
      msg: '切换状态失败: ' + err.message,
      data: null
    }
  }
}








//编辑员工
const updateStaff = async (ctx, next) => {
  try {
    const { id, name, phone, password, role_id, status, account } = ctx.request.body
    const staffRecord = await staff.findByPk(Number(id))
    if (!staffRecord) {
      ctx.body = { code: 404, msg: '员工不存在', data: null }
      return
    }
    if (name) staffRecord.name = name
    if (phone) staffRecord.phone = phone
    if (password) staffRecord.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    if (role_id !== undefined) staffRecord.role_id = Number(role_id)
    if (status !== undefined) staffRecord.status = status
    await staffRecord.save()
    ctx.body = {
      code: 200,
      msg: '编辑成功',
      data: staffRecord
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

// 登录
// 接收 { username, password }，校验通过后签发 JWT，返回 { token, userInfo }
const login = async (ctx, next) => {
  try {
    const { username, password } = ctx.request.body

    // 第一步：按账号查找员工
    const staffRecord = await staff.findOne({ where: { account: username } })
    if (!staffRecord) {
      ctx.body = { code: 400, msg: '账号不存在', data: null }
      return
    }

    // 第二步：校验密码（bcrypt 比对）
    const isMatch = bcrypt.compareSync(password, staffRecord.password)
    if (!isMatch) {
      ctx.body = { code: 400, msg: '密码错误', data: null }
      return
    }

    // 第三步：检查账号状态
    if (staffRecord.status !== '1') {
      ctx.body = { code: 400, msg: '该账号已被禁用，请联系管理员', data: null }
      return
    }

    // 第四步：查询角色编码
    const roleRecord = await roles.findByPk(staffRecord.role_id)
    const roleCode = roleRecord ? roleRecord.code : ''

    // 第五步：更新最后登录时间
    const now = new Date()
    await staffRecord.update({ last_login: now })

    // 第六步：构建用户信息
    const userInfo = {
      id: staffRecord.id,
      username: staffRecord.account,
      name: staffRecord.name,
      avatar: '',
      role: roleCode,
      email: staffRecord.email || staffRecord.account + '@example.com',
      phone: staffRecord.phone,
      employeeNo: staffRecord.employee_no,
      status: staffRecord.status,
      createTime: staffRecord.create_time ? formatTime(new Date(staffRecord.create_time)) : '',
      lastLoginTime: formatTime(now),
      loginLocation: '南昌'
    }

    // 第七步：签发 JWT token
    const token = generateToken({
      id: staffRecord.id,
      account: staffRecord.account,
      role: roleCode
    })

    ctx.body = {
      code: 200,
      msg: '登录成功',
      data: { token, userInfo, first_login: staffRecord.first_login }
    }
  } catch (err) {
    logger.error('登录错误:', err)
    ctx.body = { code: 500, msg: '登录失败: ' + err.message, data: null }
  }
}

// 获取当前登录用户信息
// 从 ctx.state.user（中间件解析的 token）读取用户 id，查询最新信息
const getUserInfo = async (ctx, next) => {
  try {
    const { id } = ctx.state.user
    const staffRecord = await staff.findByPk(id, { attributes: { exclude: ['password'] } })
    if (!staffRecord) {
      ctx.body = { code: 404, msg: '用户不存在', data: null }
      return
    }

    const roleRecord = await roles.findByPk(staffRecord.role_id)
    const roleCode = roleRecord ? roleRecord.code : ''

    const userInfo = {
      id: staffRecord.id,
      username: staffRecord.account,
      name: staffRecord.name,
      avatar: '',
      role: roleCode,
      email: staffRecord.email || staffRecord.account + '@example.com',
      phone: staffRecord.phone,
      employeeNo: staffRecord.employee_no,
      status: staffRecord.status,
      createTime: staffRecord.create_time ? formatTime(new Date(staffRecord.create_time)) : '',
      lastLoginTime: staffRecord.last_login ? formatTime(new Date(staffRecord.last_login)) : '',
      loginLocation: '南昌'
    }

    ctx.body = {
      code: 200,
      msg: '查询成功',
      data: userInfo
    }
  } catch (err) {
    logger.error('获取用户信息错误:', err)
    ctx.body = { code: 500, msg: '获取用户信息失败: ' + err.message, data: null }
  }
}

// 修改密码
// 接收 { oldPassword, newPassword }，校验旧密码后更新新密码（bcrypt 加密）
const updatePassword = async (ctx, next) => {
  try {
    const { id } = ctx.state.user
    const { oldPassword, newPassword } = ctx.request.body

    const staffRecord = await staff.findByPk(id)
    if (!staffRecord) {
      ctx.body = { code: 404, msg: '用户不存在', data: null }
      return
    }

    // 校验旧密码
    const isMatch = bcrypt.compareSync(oldPassword, staffRecord.password)
    if (!isMatch) {
      ctx.body = { code: 400, msg: '旧密码错误', data: null }
      return
    }

    // 更新新密码（bcrypt 加密）
    const salt = bcrypt.genSaltSync(10)
    staffRecord.password = bcrypt.hashSync(newPassword, salt)
    staffRecord.first_login = 0
    await staffRecord.save()

    ctx.body = { code: 200, msg: '密码修改成功', data: null }
  } catch (err) {
    logger.error('修改密码错误:', err)
    ctx.body = { code: 500, msg: '密码修改失败: ' + err.message, data: null }
  }
}

// 修改个人资料
// 接收 { name, phone, email }，更新当前登录用户的基本信息
const updateProfile = async (ctx, next) => {
  try {
    const { id } = ctx.state.user
    const { name, phone, email } = ctx.request.body

    const staffRecord = await staff.findByPk(id)
    if (!staffRecord) {
      ctx.body = { code: 404, msg: '用户不存在', data: null }
      return
    }

    staffRecord.name = name
    staffRecord.phone = phone
    staffRecord.email = email
    await staffRecord.save()

    // 返回更新后的用户信息（不含密码）
    const roleRecord = await roles.findByPk(staffRecord.role_id)
    const roleCode = roleRecord ? roleRecord.code : ''
    const userInfo = {
      id: staffRecord.id,
      username: staffRecord.account,
      name: staffRecord.name,
      avatar: '',
      role: roleCode,
      email: staffRecord.email || staffRecord.account + '@example.com',
      phone: staffRecord.phone,
      employeeNo: staffRecord.employee_no,
      status: staffRecord.status,
      createTime: staffRecord.create_time ? formatTime(new Date(staffRecord.create_time)) : '',
      lastLoginTime: staffRecord.last_login ? formatTime(new Date(staffRecord.last_login)) : '',
      loginLocation: '南昌'
    }

    ctx.body = { code: 200, msg: '资料更新成功', data: userInfo }
  } catch (err) {
    logger.error('修改个人资料错误:', err)
    ctx.body = { code: 500, msg: '资料更新失败: ' + err.message, data: null }
  }
}

export {
  getStaffList,
  getStaffDetail,
  addStaff,
  updateStaff,
  deleteStaff,
  batchDeleteStaff,
  toggleStaffStatus,
  resetStaffPassword,
  getRoleList,
  login,
  getUserInfo,
  updatePassword,
  updateProfile,
  // staffList
}
