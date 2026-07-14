import Router from 'koa-router'
import {
  getAddressList,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} from '../../controller/user/userAddress.js'

const router = new Router()

router.prefix('/userAddress')

router.get('/getAddressList', getAddressList)
router.post('/addAddress', addAddress)
router.put('/updateAddress', updateAddress)
router.delete('/deleteAddress', deleteAddress)
router.put('/setDefaultAddress', setDefaultAddress)

export default router
