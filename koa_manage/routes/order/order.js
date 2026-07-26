import Router from 'koa-router'
import {
  getOrderList,
  getOrderDetail,
  deliveryOrder,
  closeOrder
} from '../../controller/order/order.js'

const router = new Router()

// 订单路由
// 定义路由前缀为 /order
router.prefix('/order')

router.get('/getOrderList', getOrderList)
router.get('/getOrderDetail', getOrderDetail)
router.put('/deliveryOrder', deliveryOrder)
router.put('/closeOrder', closeOrder)

export default router
