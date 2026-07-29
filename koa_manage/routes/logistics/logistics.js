import Router from 'koa-router'
import {
  getCompanyList,
  addCompany,
  updateCompany,
  updateCompanyStatus,
  deleteCompany,
  getShipmentRecordList
} from '../../controller/logistics/logistics.js'
import requireRole from '../../middleware/role.js'

const router = new Router()

// 物流路由
// 定义路由前缀为 /logistics
router.prefix('/logistics')

// 所有物流接口：仅订单管理员可操作（super_admin 自动放行）
router.get('/getCompanyList', requireRole('order_staff'), getCompanyList)
router.post('/addCompany', requireRole('order_staff'), addCompany)
router.put('/updateCompany', requireRole('order_staff'), updateCompany)
router.put('/updateCompanyStatus', requireRole('order_staff'), updateCompanyStatus)
router.delete('/deleteCompany', requireRole('order_staff'), deleteCompany)
router.get('/getShipmentRecordList', requireRole('order_staff'), getShipmentRecordList)

export default router
