interface LogisticsCompany {
  id: string
  name: string
  code: string
  website: string
  status: number
  createTime: string
}

interface ShipmentRecord {
  id: string
  orderNo: string
  receiverName: string
  companyCode: string
  companyName: string
  trackingNo: string
  shipmentTime: string
  operator: string
  status: string
}

export default {
  getLogisticsCompanyList: (params?: { pageNum?: number; pageSize?: number; name?: string; status?: string | number }) => {
    const { pageNum = 1, pageSize = 10, name = '', status = '' } = params || {}

    const companies: LogisticsCompany[] = [
      { id: '1', name: '顺丰速运', code: 'SF', website: 'https://www.sf-express.com', status: 1, createTime: '2024-01-01' },
      { id: '2', name: '中通快递', code: 'ZTO', website: 'https://www.zto.com', status: 1, createTime: '2024-01-02' },
      { id: '3', name: '圆通速递', code: 'YTO', website: 'https://www.yto.net.cn', status: 1, createTime: '2024-01-03' },
      { id: '4', name: '韵达快递', code: 'YD', website: 'https://www.yunda.com.cn', status: 1, createTime: '2024-01-04' },
      { id: '5', name: '极兔速递', code: 'JT', website: 'https://www.jtexpress.com.cn', status: 1, createTime: '2024-01-05' },
      { id: '6', name: '德邦快递', code: 'DB', website: 'https://www.deppon.com', status: 1, createTime: '2024-01-06' },
      { id: '7', name: 'EMS', code: 'EMS', website: 'https://www.11183.com.cn', status: 1, createTime: '2024-01-07' },
      { id: '8', name: '申通快递', code: 'STO', website: 'https://www.sto.cn', status: 0, createTime: '2024-01-08' },
      { id: '9', name: '天天快递', code: 'TT', website: 'https://www.ttkdex.com', status: 0, createTime: '2024-01-09' },
      { id: '10', name: '优速快递', code: 'UC', website: 'https://www.uc56.com', status: 1, createTime: '2024-01-10' }
    ]

    let filtered = companies
    if (name) {
      filtered = filtered.filter(c => c.name.includes(name))
    }
    if (status !== '' && status !== undefined) {
      filtered = filtered.filter(c => c.status === parseInt(status as string))
    }

    const start = ((pageNum as number) - 1) * (pageSize as number)
    const end = start + (pageSize as number)
    const list = filtered.slice(start, end)

    return {
      code: 200,
      msg: 'success',
      data: {
        list,
        total: filtered.length,
        pageNum,
        pageSize
      }
    }
  },

  addLogisticsCompany: (data: Omit<LogisticsCompany, 'id' | 'createTime'>) => {
    return {
      code: 200,
      msg: '新增成功',
      data: {
        id: Date.now().toString(),
        ...data,
        createTime: new Date().toISOString().split('T')[0]
      }
    }
  },

  updateLogisticsCompany: (data: LogisticsCompany) => {
    return {
      code: 200,
      msg: '更新成功',
      data
    }
  },

  updateLogisticsCompanyStatus: (id: string, status: number) => {
    return {
      code: 200,
      msg: status === 1 ? '已启用' : '已停用',
      data: { id, status }
    }
  },

  deleteLogisticsCompany: (id: string) => {
    return {
      code: 200,
      msg: '删除成功',
      data: null
    }
  },

  getShipmentRecordList: (params?: { pageNum?: number; pageSize?: number; orderNo?: string; companyCode?: string; startDate?: string; endDate?: string }) => {
    const { pageNum = 1, pageSize = 10, orderNo = '', companyCode = '', startDate = '', endDate = '' } = params || {}

    const records: ShipmentRecord[] = [
      { id: '1', orderNo: '202605120001', receiverName: '张三', companyCode: 'SF', companyName: '顺丰速运', trackingNo: 'SF1234567890', shipmentTime: '2026-05-12 10:30:00', operator: '订单专员小王', status: '已签收' },
      { id: '2', orderNo: '202605120002', receiverName: '李四', companyCode: 'ZTO', companyName: '中通快递', trackingNo: 'ZTO9876543210', shipmentTime: '2026-05-12 11:15:00', operator: '订单专员小王', status: '运输中' },
      { id: '3', orderNo: '202605120003', receiverName: '王五', companyCode: 'YD', companyName: '韵达快递', trackingNo: 'YD5678901234', shipmentTime: '2026-05-12 14:20:00', operator: '订单专员小李', status: '已发货' },
      { id: '4', orderNo: '202605120004', receiverName: '赵六', companyCode: 'YTO', companyName: '圆通速递', trackingNo: 'YTO1357924680', shipmentTime: '2026-05-12 15:00:00', operator: '订单专员小李', status: '运输中' },
      { id: '5', orderNo: '202605110001', receiverName: '钱七', companyCode: 'SF', companyName: '顺丰速运', trackingNo: 'SF2468013579', shipmentTime: '2026-05-11 09:30:00', operator: '订单专员小王', status: '已签收' },
      { id: '6', orderNo: '202605110002', receiverName: '孙八', companyCode: 'JT', companyName: '极兔速递', trackingNo: 'JT9753186420', shipmentTime: '2026-05-11 10:45:00', operator: '订单专员小王', status: '运输中' },
      { id: '7', orderNo: '202605110003', receiverName: '周九', companyCode: 'DB', companyName: '德邦快递', trackingNo: 'DB8642097531', shipmentTime: '2026-05-11 16:20:00', operator: '订单专员小李', status: '已发货' },
      { id: '8', orderNo: '202605100001', receiverName: '吴十', companyCode: 'SF', companyName: '顺丰速运', trackingNo: 'SF1122334455', shipmentTime: '2026-05-10 08:00:00', operator: '订单专员小王', status: '已签收' },
      { id: '9', orderNo: '202605100002', receiverName: '郑十一', companyCode: 'ZTO', companyName: '中通快递', trackingNo: 'ZTO6677889900', shipmentTime: '2026-05-10 13:30:00', operator: '订单专员小李', status: '已签收' },
      { id: '10', orderNo: '202605100003', receiverName: '王十二', companyCode: 'EMS', companyName: 'EMS', trackingNo: 'EMS123456789', shipmentTime: '2026-05-10 17:00:00', operator: '订单专员小王', status: '异常' },
      { id: '11', orderNo: '202605090001', receiverName: '冯十三', companyCode: 'YD', companyName: '韵达快递', trackingNo: 'YD9988776655', shipmentTime: '2026-05-09 10:15:00', operator: '订单专员小李', status: '已签收' },
      { id: '12', orderNo: '202605090002', receiverName: '陈十四', companyCode: 'YTO', companyName: '圆通速递', trackingNo: 'YTO5544332211', shipmentTime: '2026-05-09 14:45:00', operator: '订单专员小王', status: '已签收' }
    ]

    let filtered = records
    if (orderNo) {
      filtered = filtered.filter(r => r.orderNo.includes(orderNo))
    }
    if (companyCode) {
      filtered = filtered.filter(r => r.companyCode === companyCode)
    }
    if (startDate) {
      filtered = filtered.filter(r => r.shipmentTime >= startDate)
    }
    if (endDate) {
      filtered = filtered.filter(r => r.shipmentTime <= endDate + ' 23:59:59')
    }

    const start = ((pageNum as number) - 1) * (pageSize as number)
    const end = start + (pageSize as number)
    const list = filtered.slice(start, end)

    return {
      code: 200,
      msg: 'success',
      data: {
        list,
        total: filtered.length,
        pageNum,
        pageSize
      }
    }
  }
}
