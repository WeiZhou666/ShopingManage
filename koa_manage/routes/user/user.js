import Router from 'koa-router'
import {
  getUserList,
  getUserDetail,
  addUser,
  deleteUser,
  batchDeleteUsers,
  updateUserStatus,
  updateUserTags,
  updateUser,
  getRoleList,
  getDepartmentList
} from '../../controller/user/user.js'
import requireRole from '../../middleware/role.js'

const router = new Router()

// 用户路由
// 定义路由前缀为 /user
router.prefix('/user')

// 列表/详情：运营、订单、客服均可查看（super_admin 自动放行）
router.get('/getUserList', requireRole('operator', 'order_staff', 'customer_service'), getUserList)
router.get('/getUserDetail', requireRole('operator', 'order_staff', 'customer_service'), getUserDetail)

// 新增/编辑/删除/禁用：仅超级管理员
router.post('/addUser', requireRole(), addUser)
router.put('/updateUser', requireRole(), updateUser)
router.delete('/deleteUser', requireRole(), deleteUser)
router.post('/batchDeleteUsers', requireRole(), batchDeleteUsers)
router.put('/updateUserStatus', requireRole(), updateUserStatus)

// 修改标签：运营也可操作
router.put('/updateUserTags', requireRole('operator'), updateUserTags)

// 字典数据：登录即可访问
router.get('/getRoleList', getRoleList)
router.get('/getDepartmentList', getDepartmentList)




export default router
