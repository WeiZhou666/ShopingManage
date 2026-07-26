import Router from 'koa-router'
import {
  getCompanyList,
  addCompany,
  updateCompany,
  updateCompanyStatus,
  deleteCompany,
  getShipmentRecordList
} from '../../controller/logistics/logistics.js'

const router = new Router()

// 物流路由
// 定义路由前缀为 /logistics
router.prefix('/logistics')

router.get('/getCompanyList', getCompanyList)
router.post('/addCompany', addCompany)
router.put('/updateCompany', updateCompany)
router.put('/updateCompanyStatus', updateCompanyStatus)
router.delete('/deleteCompany', deleteCompany)
router.get('/getShipmentRecordList', getShipmentRecordList)

export default router
