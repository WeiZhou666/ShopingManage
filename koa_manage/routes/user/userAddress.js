import Router from 'koa-router'
import {
  getAddressList,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} from '../../controller/user/userAddress.js'
import requireRole from '../../middleware/role.js'

const router = new Router()

router.prefix('/userAddress')

// 收货地址管理：与用户管理同权限（super_admin 自动放行）
router.get('/getAddressList', requireRole('operator', 'order_staff', 'customer_service'), getAddressList)
router.post('/addAddress', requireRole('operator', 'order_staff', 'customer_service'), addAddress)
router.put('/updateAddress', requireRole('operator', 'order_staff', 'customer_service'), updateAddress)
router.delete('/deleteAddress', requireRole('operator', 'order_staff', 'customer_service'), deleteAddress)
router.put('/setDefaultAddress', requireRole('operator', 'order_staff', 'customer_service'), setDefaultAddress)

export default router
