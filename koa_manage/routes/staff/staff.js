import Router from 'koa-router'
import {
  getStaffList,
  getStaffDetail,
  addStaff,
  updateStaff,
  deleteStaff,
  batchDeleteStaff,
  resetStaffPassword,
  toggleStaffStatus
} from '../../controller/staff/staff.js'
const router = new Router()

// 员工路由
// 定义路由前缀为 /staff
router.prefix('/staff')

router.get('/getStaffList', getStaffList)
router.get('/getStaffDetail', getStaffDetail)
router.post('/addStaff', addStaff)
router.put('/updateStaff', updateStaff)
router.post('/deleteStaff', deleteStaff)
router.post('/batchDeleteStaff', batchDeleteStaff)
router.post('/resetStaffPassword', resetStaffPassword)
router.post('/toggleStaffStatus', toggleStaffStatus)




export default router