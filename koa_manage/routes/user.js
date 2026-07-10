import Router from 'koa-router'
import { getUserList, create } from '../controller/user.js'

const router = new Router()

// 用户路由
// 定义路由前缀为 /user
router.prefix('/user')

router.get('/getUserList', getUserList)
router.post('/create', create)


export default router