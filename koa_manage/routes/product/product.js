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

const router = new Router()

// 商品路由
// 定义路由前缀为 /product
router.prefix('/product')

router.get('/getProductList', getProductList)
router.get('/getProductDetail', getProductDetail)
router.get('/getProductEdit', getProductEdit)
router.post('/addProduct', addProduct)
router.put('/updateProduct', updateProduct)
router.delete('/deleteProduct', deleteProduct)
router.post('/batchDeleteProducts', batchDeleteProducts)
router.put('/updateProductStatus', updateProductStatus)

export default router
