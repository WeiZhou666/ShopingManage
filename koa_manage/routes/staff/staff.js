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
const router = new Router()

// 员工路由
// 定义路由前缀为 /staff
router.prefix('/staff')

// 登录接口（不需要认证，已在 auth 中间件白名单中放行）
router.post('/login', login)
// 获取当前登录用户信息
router.get('/getUserInfo', getUserInfo)
// 修改密码
router.post('/updatePassword', updatePassword)
// 修改个人资料
router.post('/updateProfile', updateProfile)

router.get('/getStaffList', getStaffList)
router.get('/getStaffDetail', getStaffDetail)
router.post('/addStaff', addStaff)
router.put('/updateStaff', updateStaff)
router.post('/deleteStaff', deleteStaff)
router.post('/batchDeleteStaff', batchDeleteStaff)
router.post('/resetStaffPassword', resetStaffPassword)
router.post('/toggleStaffStatus', toggleStaffStatus)
router.get('/getRoleList', getRoleList)




export default router