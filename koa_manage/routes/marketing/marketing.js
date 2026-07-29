import Router from 'koa-router'
import {
  getCouponList,
  addCoupon,
  updateCoupon,
  deleteCoupon,
  getSeckillList,
  addSeckill,
  updateSeckill,
  deleteSeckill,
  getDiscountList,
  addDiscount,
  updateDiscount,
  deleteDiscount
} from '../../controller/marketing/marketing.js'
import requireRole from '../../middleware/role.js'

const router = new Router()

// 营销路由
// 定义路由前缀为 /marketing
router.prefix('/marketing')

// 所有营销接口：仅运营管理员可操作（super_admin 自动放行）

// 优惠券
router.get('/getCouponList', requireRole('operator'), getCouponList)
router.post('/addCoupon', requireRole('operator'), addCoupon)
router.put('/updateCoupon', requireRole('operator'), updateCoupon)
router.delete('/deleteCoupon', requireRole('operator'), deleteCoupon)

// 秒杀活动
router.get('/getSeckillList', requireRole('operator'), getSeckillList)
router.post('/addSeckill', requireRole('operator'), addSeckill)
router.put('/updateSeckill', requireRole('operator'), updateSeckill)
router.delete('/deleteSeckill', requireRole('operator'), deleteSeckill)

// 限时折扣
router.get('/getDiscountList', requireRole('operator'), getDiscountList)
router.post('/addDiscount', requireRole('operator'), addDiscount)
router.put('/updateDiscount', requireRole('operator'), updateDiscount)
router.delete('/deleteDiscount', requireRole('operator'), deleteDiscount)

export default router
