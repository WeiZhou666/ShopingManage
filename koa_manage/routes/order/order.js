import Router from 'koa-router'
import {
  getOrderList,
  getOrderDetail,
  deliveryOrder,
  closeOrder
} from '../../controller/order/order.js'
import requireRole from '../../middleware/role.js'

const router = new Router()

// 订单路由
// 定义路由前缀为 /order
router.prefix('/order')

// 列表/详情：所有角色可查看（登录即可）
router.get('/getOrderList', getOrderList)
router.get('/getOrderDetail', getOrderDetail)

// 发货/关闭：仅订单管理员可操作（super_admin 自动放行）
router.put('/deliveryOrder', requireRole('order_staff'), deliveryOrder)
router.put('/closeOrder', requireRole('order_staff'), closeOrder)

export default router
