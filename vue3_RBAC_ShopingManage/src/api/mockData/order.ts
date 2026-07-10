interface OrderParams {
  pageNum?: number
  pageSize?: number
  status?: string | number
  orderNo?: string
  startDate?: string
  endDate?: string
}

interface OrderData {
  id: string
  orderNo: string
  userName: string
  userPhone: string
  productName: string
  productCount: number
  amount: number
  status: number // 0-待付款 1-待发货 2-已发货 3-已完成 4-已退款
  createTime: string
}

// 订单状态映射
const statusMap: Record<number, string> = {
  0: '待付款',
  1: '待发货',
  2: '已发货',
  3: '已完成',
  4: '已退款'
}

// 生成模拟订单
const generateOrders = (): OrderData[] => {
  const products = [
    'iPhone 15 Pro', '小米手机14', '华为Mate 60', '连衣裙', 'AirPods Pro',
    'MacBook Air', 'iPad Pro', '戴森吸尘器', 'SK-II套装', 'Apple Watch',
    '联想笔记本', '三星手机', '格力空调', '索尼相机', '海尔冰箱',
    '劳力士手表', '小米电视', '华为平板', '罗技鼠标', '飞利浦剃须刀'
  ]
  const names = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十', '郑十一', '王十二']
  const phones = [
    '13800138001', '13800138002', '13800138003', '13800138004', '13800138005',
    '13800138006', '13800138007', '13800138008', '13800138009', '13800138010']

  const orders: OrderData[] = []
  for (let i = 0; i < 50; i++) {
    const date = new Date(2025, 4, 1)
    date.setDate(date.getDate() + Math.floor(i * 0.6))
    const status = i % 13 === 0 ? 4 : i % 7 === 0 ? 0 : i % 9 === 0 ? 2 : i % 11 === 0 ? 3 : 1
    orders.push({
      id: String(i + 1),
      orderNo: `2025${String(5).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${String(i + 1).padStart(4, '0')}`,
      userName: names[i % names.length],
      userPhone: phones[i % phones.length],
      productName: products[i % products.length],
      productCount: (i % 5) + 1,
      amount: [5999, 1999, 299, 8999, 4999, 7999, 1299, 3299, 999, 199][i % 10] * ((i % 5) + 1),
      status,
      createTime: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(8 + (i % 12)).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}:00`
    })
  }
  return orders
}

const allOrders = generateOrders()

export default {
  getOrderList: (params?: OrderParams) => {
    const { pageNum = 1, pageSize = 10, status = '', orderNo = '', startDate = '', endDate = '' } = params || {}

    let filtered = allOrders

    if (status !== '' && status !== undefined) {
      filtered = filtered.filter(o => o.status === parseInt(status as string))
    }

    if (orderNo) {
      filtered = filtered.filter(o => o.orderNo.includes(orderNo))
    }

    if (startDate) {
      filtered = filtered.filter(o => o.createTime >= startDate)
    }
    if (endDate) {
      filtered = filtered.filter(o => o.createTime <= endDate + ' 23:59:59')
    }

    const start = (pageNum - 1) * pageSize
    const end = start + pageSize
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

  // 更新订单状态：发货
  deliveryOrder: (id: string) => {
    const order = allOrders.find(o => o.id === id)
    if (order && order.status === 1) {
      order.status = 2
    }
    return { code: 200, msg: '发货成功', data: null }
  },

  // 关闭订单
  closeOrder: (id: string) => {
    const order = allOrders.find(o => o.id === id)
    if (order && order.status === 0) {
      order.status = 4
    }
    return { code: 200, msg: '订单已关闭', data: null }
  },

  // 获取订单详情
  getOrderDetail: (orderNo: string) => {
    const order = allOrders.find(o => o.orderNo === orderNo)
    if (!order) {
      return { code: 404, msg: '未找到该订单', data: null }
    }

    const payments = ['微信支付', '支付宝', '银行卡']
    const logisticsCompanies = ['顺丰速运', '中通快递', '圆通速递', '韵达快递', '京东物流']

    // 根据状态生成时间线
    const hasPayTime = order.status >= 1
    const hasDeliveryTime = order.status >= 2
    const hasCompleteTime = order.status >= 3

    const createDate = new Date(order.createTime)
    const payDate = new Date(createDate.getTime() + 5 * 60000)
    const deliveryDate = new Date(createDate.getTime() + 3600000)
    const completeDate = new Date(createDate.getTime() + 86400000)

    const detail = {
      id: order.id,
      orderNo: order.orderNo,
      status: order.status,
      statusText: statusMap[order.status],
      createTime: order.createTime,
      payTime: hasPayTime ? `${payDate.getFullYear()}-${String(payDate.getMonth() + 1).padStart(2, '0')}-${String(payDate.getDate()).padStart(2, '0')} ${String(payDate.getHours()).padStart(2, '0')}:${String(payDate.getMinutes()).padStart(2, '0')}:00` : '',
      deliveryTime: hasDeliveryTime ? `${deliveryDate.getFullYear()}-${String(deliveryDate.getMonth() + 1).padStart(2, '0')}-${String(deliveryDate.getDate()).padStart(2, '0')} ${String(deliveryDate.getHours()).padStart(2, '0')}:${String(deliveryDate.getMinutes()).padStart(2, '0')}:00` : '',
      completeTime: hasCompleteTime ? `${completeDate.getFullYear()}-${String(completeDate.getMonth() + 1).padStart(2, '0')}-${String(completeDate.getDate()).padStart(2, '0')} ${String(completeDate.getHours()).padStart(2, '0')}:${String(completeDate.getMinutes()).padStart(2, '0')}:00` : '',
      paymentMethod: payments[parseInt(order.id) % 3],
      totalAmount: order.amount,
      freight: order.amount > 99 ? 0 : 10,
      coupon: order.amount > 5000 ? 200 : 0,
      paidAmount: order.amount > 5000 ? order.amount - 200 : order.amount,
      paid: order.status >= 1,
      recipient: {
        name: order.userName,
        phone: order.userPhone,
        address: ['广东省深圳市南山区科苑路88号', '北京市朝阳区建国路88号', '上海市浦东新区张江路123号', '浙江省杭州市西湖区文三路88号'][parseInt(order.id) % 4]
      },
      products: [
        {
          name: order.productName,
          spec: ['256G 蓝色', '128G 黑色', 'M 码', '标准版', '套装'][parseInt(order.id) % 5],
          price: Math.round(order.amount / order.productCount * 100) / 100,
          count: order.productCount,
          subtotal: order.amount
        }
      ],
      logistics: order.status >= 2 ? {
        company: logisticsCompanies[parseInt(order.id) % 5],
        trackingNo: `SF${Date.now().toString(36).toUpperCase()}${parseInt(order.id)}`
      } : null,
      logs: []
    }

    // 操作日志
    detail.logs.push({
      time: order.createTime,
      operator: order.userName,
      action: '提交订单'
    })
    if (order.status >= 1) {
      detail.logs.push({
        time: detail.payTime,
        operator: order.userName,
        action: `支付成功  ¥${detail.paidAmount.toLocaleString()}`
      })
    }
    if (order.status >= 2) {
      detail.logs.push({
        time: detail.deliveryTime,
        operator: '系统',
        action: `已发货，物流公司：${detail.logistics?.company}，运单号：${detail.logistics?.trackingNo}`
      })
    }
    if (order.status >= 3) {
      detail.logs.push({
        time: detail.completeTime,
        operator: '系统',
        action: '订单已完成'
      })
    }
    if (order.status === 4) {
      detail.logs.push({
        time: new Date(createDate.getTime() + 86400000 * 2).toISOString().replace('T', ' ').substring(0, 19),
        operator: '客服',
        action: '关闭订单并退款'
      })
    }

    return { code: 200, msg: 'success', data: detail }
  }
}
