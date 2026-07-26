import Router from 'koa-router'
import {
  getTableData,
  getCountData,
  getChartData,
  getBarChartData,
  getPieChartData
} from '../../controller/home/home.js'

const router = new Router()

// 首页路由
// 定义路由前缀为 /home
router.prefix('/home')

router.get('/getTableData', getTableData)
router.get('/getCountData', getCountData)
router.get('/getChartData', getChartData)
router.get('/getBarChartData', getBarChartData)
router.get('/getPieChartData', getPieChartData)

export default router
