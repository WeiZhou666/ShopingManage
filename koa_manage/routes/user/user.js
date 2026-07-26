import Router from 'koa-router'
import {
  getUserList,
  getUserDetail,
  addUser,
  deleteUser,
  batchDeleteUsers,
  updateUserStatus,
  updateUserTags,
  updateUser,
  getRoleList,
  getDepartmentList
} from '../../controller/user/user.js'

const router = new Router()

// 用户路由
// 定义路由前缀为 /user
router.prefix('/user')

router.get('/getUserList', getUserList)
router.get('/getUserDetail', getUserDetail)
router.post('/addUser', addUser)
router.put('/updateUser', updateUser)
router.delete('/deleteUser', deleteUser)
router.post('/batchDeleteUsers', batchDeleteUsers)
router.put('/updateUserStatus', updateUserStatus)
router.put('/updateUserTags', updateUserTags)
router.get('/getRoleList', getRoleList)
router.get('/getDepartmentList', getDepartmentList)




export default router
