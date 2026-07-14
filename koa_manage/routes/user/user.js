import Router from 'koa-router'
import {
  getUserList,
  getUserDetail,
  addUser,
  deleteUser,
  batchDeleteUsers,
  updateUserStatus,
  updateUserTags

} from '../../controller/user/user.js'

const router = new Router()

// 用户路由
// 定义路由前缀为 /user
router.prefix('/user')

router.get('/getUserList', getUserList)
router.get('/getUserDetail', getUserDetail)
router.post('/addUser', addUser)
router.delete('/deleteUser', deleteUser)
router.post('/batchDeleteUsers', batchDeleteUsers)
router.put('/updateUserStatus', updateUserStatus)
router.put('/updateUserTags', updateUserTags)





export default router
