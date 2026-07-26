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

const router = new Router()

// 营销路由
// 定义路由前缀为 /marketing
router.prefix('/marketing')

// 优惠券
router.get('/getCouponList', getCouponList)
router.post('/addCoupon', addCoupon)
router.put('/updateCoupon', updateCoupon)
router.delete('/deleteCoupon', deleteCoupon)

// 秒杀活动
router.get('/getSeckillList', getSeckillList)
router.post('/addSeckill', addSeckill)
router.put('/updateSeckill', updateSeckill)
router.delete('/deleteSeckill', deleteSeckill)

// 限时折扣
router.get('/getDiscountList', getDiscountList)
router.post('/addDiscount', addDiscount)
router.put('/updateDiscount', updateDiscount)
router.delete('/deleteDiscount', deleteDiscount)

export default router
