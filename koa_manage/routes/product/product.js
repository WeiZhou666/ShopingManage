import Router from 'koa-router'
import {
  getProductList,
  getProductDetail,
  getProductEdit,
  addProduct,
  updateProduct,
  deleteProduct,
  batchDeleteProducts,
  updateProductStatus
} from '../../controller/product/product.js'
import requireRole from '../../middleware/role.js'

const router = new Router()

// 商品路由
// 定义路由前缀为 /product
router.prefix('/product')

// 所有商品接口：仅运营管理员可操作（super_admin 自动放行）
router.get('/getProductList', requireRole('operator'), getProductList)
router.get('/getProductDetail', requireRole('operator'), getProductDetail)
router.get('/getProductEdit', requireRole('operator'), getProductEdit)
router.post('/addProduct', requireRole('operator'), addProduct)
router.put('/updateProduct', requireRole('operator'), updateProduct)
router.delete('/deleteProduct', requireRole('operator'), deleteProduct)
router.post('/batchDeleteProducts', requireRole('operator'), batchDeleteProducts)
router.put('/updateProductStatus', requireRole('operator'), updateProductStatus)

export default router
