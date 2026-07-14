import Router from 'koa-router'
import {
  getOperationLogList,
  addOperationLog
} from '../../controller/user/operationLog.js'

const router = new Router()

router.prefix('/operationLog')

router.get('/getOperationLogList', getOperationLogList)
router.post('/addOperationLog', addOperationLog)

export default router
