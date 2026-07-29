import Router from 'koa-router'
import {
  getStaffList,
  getStaffDetail,
  addStaff,
  updateStaff,
  deleteStaff,
  batchDeleteStaff,
  resetStaffPassword,
  toggleStaffStatus,
  getRoleList,
  login,
  getUserInfo,
  updatePassword,
  updateProfile
} from '../../controller/staff/staff.js'
import requireRole from '../../middleware/role.js'

const router = new Router()

// 员工路由
// 定义路由前缀为 /staff
router.prefix('/staff')

// 登录接口（不需要认证，已在 auth 中间件白名单中放行）
router.post('/login', login)
// 获取当前登录用户信息（登录即可，无需角色校验）
router.get('/getUserInfo', getUserInfo)
// 修改密码（登录即可，无需角色校验）
router.post('/updatePassword', updatePassword)
// 修改个人资料（登录即可，无需角色校验）
router.post('/updateProfile', updateProfile)

// 以下接口仅超级管理员可操作（super_admin 由中间件自动放行，无需显式写出）
router.get('/getStaffList', requireRole(), getStaffList)
router.get('/getStaffDetail', requireRole(), getStaffDetail)
router.post('/addStaff', requireRole(), addStaff)
router.put('/updateStaff', requireRole(), updateStaff)
router.post('/deleteStaff', requireRole(), deleteStaff)
router.post('/batchDeleteStaff', requireRole(), batchDeleteStaff)
router.post('/resetStaffPassword', requireRole(), resetStaffPassword)
router.post('/toggleStaffStatus', requireRole(), toggleStaffStatus)
router.get('/getRoleList', requireRole(), getRoleList)




export default router