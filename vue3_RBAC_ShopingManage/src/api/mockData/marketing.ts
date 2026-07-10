interface Coupon {
  id: string
  name: string
  type: 'full_reduction' | 'discount'
  threshold: number
  discount: number
  totalQuantity: number
  receivedQuantity: number
  usedQuantity: number
  validPeriod: string
  status: 'pending' | 'active' | 'ended'
}

interface Seckill {
  id: string
  name: string
  productId: number
  productName: string
  originalPrice: number
  seckillPrice: number
  seckillStock: number
  limitQuantity: number
  soldQuantity: number
  activePeriod: string
  status: 'pending' | 'active' | 'ended'
}

interface Discount {
  id: string
  productId: number
  productName: string
  originalPrice: number
  discountPrice: number
  discountRate: number
  activePeriod: string
  status: 'pending' | 'active' | 'ended'
}

export default {
  getCouponList: (params?: { pageNum?: number; pageSize?: number; name?: string; type?: string; status?: string }) => {
    const { pageNum = 1, pageSize = 10, name = '', type = '', status = '' } = params || {}

    const coupons: Coupon[] = [
      { id: '1', name: '新人满100减20', type: 'full_reduction', threshold: 100, discount: 20, totalQuantity: 1000, receivedQuantity: 856, usedQuantity: 423, validPeriod: '2026-05-01 ~ 2026-06-30', status: 'active' },
      { id: '2', name: '会员8折优惠', type: 'discount', threshold: 50, discount: 0.8, totalQuantity: 500, receivedQuantity: 320, usedQuantity: 189, validPeriod: '2026-05-01 ~ 2026-05-31', status: 'active' },
      { id: '3', name: '满200减50', type: 'full_reduction', threshold: 200, discount: 50, totalQuantity: 800, receivedQuantity: 678, usedQuantity: 345, validPeriod: '2026-05-01 ~ 2026-05-31', status: 'ended' },
      { id: '4', name: '618狂欢满500减100', type: 'full_reduction', threshold: 500, discount: 100, totalQuantity: 2000, receivedQuantity: 156, usedQuantity: 0, validPeriod: '2026-06-01 ~ 2026-06-20', status: 'pending' },
      { id: '5', name: '夏季清仓7折', type: 'discount', threshold: 0, discount: 0.7, totalQuantity: 1000, receivedQuantity: 789, usedQuantity: 456, validPeriod: '2026-04-01 ~ 2026-04-30', status: 'ended' },
      { id: '6', name: '满300减80', type: 'full_reduction', threshold: 300, discount: 80, totalQuantity: 1500, receivedQuantity: 1234, usedQuantity: 678, validPeriod: '2026-05-01 ~ 2026-05-31', status: 'active' },
      { id: '7', name: '开学季9折', type: 'discount', threshold: 0, discount: 0.9, totalQuantity: 600, receivedQuantity: 445, usedQuantity: 234, validPeriod: '2026-05-15 ~ 2026-05-31', status: 'active' },
      { id: '8', name: 'VIP专属满1000减200', type: 'full_reduction', threshold: 1000, discount: 200, totalQuantity: 200, receivedQuantity: 156, usedQuantity: 78, validPeriod: '2026-05-01 ~ 2026-06-30', status: 'active' },
      { id: '9', name: '五一特惠满199减30', type: 'full_reduction', threshold: 199, discount: 30, totalQuantity: 1200, receivedQuantity: 1100, usedQuantity: 550, validPeriod: '2026-04-28 ~ 2026-05-05', status: 'ended' },
      { id: '10', name: '周年庆全场85折', type: 'discount', threshold: 0, discount: 0.85, totalQuantity: 3000, receivedQuantity: 2800, usedQuantity: 1400, validPeriod: '2026-05-20 ~ 2026-05-22', status: 'pending' }
    ]

    let filtered = coupons
    if (name) {
      filtered = filtered.filter(c => c.name.includes(name))
    }
    if (type) {
      filtered = filtered.filter(c => c.type === type)
    }
    if (status) {
      filtered = filtered.filter(c => c.status === status)
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

  addCoupon: (data: Omit<Coupon, 'id' | 'receivedQuantity' | 'usedQuantity' | 'status'> & { startDate: string; endDate: string }) => {
    return {
      code: 200,
      msg: '新增成功',
      data: {
        id: Date.now().toString(),
        ...data,
        validPeriod: `${data.startDate} ~ ${data.endDate}`,
        receivedQuantity: 0,
        usedQuantity: 0,
        status: 'pending'
      }
    }
  },

  updateCoupon: (data: Omit<Coupon, 'receivedQuantity' | 'usedQuantity'> & { startDate: string; endDate: string }) => {
    return {
      code: 200,
      msg: '更新成功',
      data: {
        ...data,
        validPeriod: `${data.startDate} ~ ${data.endDate}`
      }
    }
  },

  deleteCoupon: (id: string) => {
    return {
      code: 200,
      msg: '删除成功',
      data: null
    }
  },

  getSeckillList: (params?: { pageNum?: number; pageSize?: number; name?: string; status?: string }) => {
    const { pageNum = 1, pageSize = 10, name = '', status = '' } = params || {}

    const seckills: Seckill[] = [
      { id: '1', name: '618限时秒杀', productId: 1, productName: 'iPhone 15 Pro 256G', originalPrice: 7999, seckillPrice: 6999, seckillStock: 100, limitQuantity: 1, soldQuantity: 89, activePeriod: '2026-06-18 00:00:00 ~ 2026-06-18 23:59:59', status: 'pending' },
      { id: '2', name: '新品首发秒杀', productId: 5, productName: '小米14 Ultra', originalPrice: 5999, seckillPrice: 5499, seckillStock: 50, limitQuantity: 1, soldQuantity: 45, activePeriod: '2026-05-15 10:00:00 ~ 2026-05-15 12:00:00', status: 'ended' },
      { id: '3', name: '数码节秒杀', productId: 2, productName: 'MacBook Air M3', originalPrice: 8999, seckillPrice: 7999, seckillStock: 30, limitQuantity: 1, soldQuantity: 28, activePeriod: '2026-05-10 14:00:00 ~ 2026-05-10 18:00:00', status: 'ended' },
      { id: '4', name: '周末特惠秒杀', productId: 3, productName: 'AirPods Pro 2', originalPrice: 1899, seckillPrice: 1599, seckillStock: 200, limitQuantity: 2, soldQuantity: 167, activePeriod: '2026-05-18 10:00:00 ~ 2026-05-18 22:00:00', status: 'pending' },
      { id: '5', name: '会员专享秒杀', productId: 6, productName: '华为Mate 60 Pro', originalPrice: 6999, seckillPrice: 6499, seckillStock: 80, limitQuantity: 1, soldQuantity: 72, activePeriod: '2026-05-12 09:00:00 ~ 2026-05-12 11:00:00', status: 'ended' },
      { id: '6', name: '母亲节特惠', productId: 7, productName: '戴森V15吸尘器', originalPrice: 4999, seckillPrice: 4299, seckillStock: 60, limitQuantity: 1, soldQuantity: 55, activePeriod: '2026-05-11 00:00:00 ~ 2026-05-11 23:59:59', status: 'ended' },
      { id: '7', name: '夏日清凉秒杀', productId: 8, productName: '索尼WH-1000XM5', originalPrice: 2999, seckillPrice: 2499, seckillStock: 150, limitQuantity: 1, soldQuantity: 123, activePeriod: '2026-05-20 14:00:00 ~ 2026-05-20 20:00:00', status: 'pending' },
      { id: '8', name: '开门红秒杀', productId: 1, productName: 'iPhone 15 Pro 256G', originalPrice: 7999, seckillPrice: 7499, seckillStock: 120, limitQuantity: 1, soldQuantity: 108, activePeriod: '2026-05-01 00:00:00 ~ 2026-05-01 02:00:00', status: 'ended' }
    ]

    let filtered = seckills
    if (name) {
      filtered = filtered.filter(s => s.name.includes(name))
    }
    if (status) {
      filtered = filtered.filter(s => s.status === status)
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

  addSeckill: (data: Omit<Seckill, 'id' | 'soldQuantity' | 'productName' | 'status'> & { startTime: string; endTime: string }) => {
    const productNames: Record<number, string> = {
      1: 'iPhone 15 Pro 256G',
      2: 'MacBook Air M3',
      3: 'AirPods Pro 2',
      4: 'iPad Pro 11寸',
      5: '小米14 Ultra',
      6: '华为Mate 60 Pro',
      7: '戴森V15吸尘器',
      8: '索尼WH-1000XM5'
    }
    return {
      code: 200,
      msg: '新增成功',
      data: {
        id: Date.now().toString(),
        ...data,
        productName: productNames[data.productId] || '未知商品',
        activePeriod: `${data.startTime} ~ ${data.endTime}`,
        soldQuantity: 0,
        status: 'pending'
      }
    }
  },

  updateSeckill: (data: Omit<Seckill, 'soldQuantity' | 'productName'> & { startTime: string; endTime: string }) => {
    const productNames: Record<number, string> = {
      1: 'iPhone 15 Pro 256G',
      2: 'MacBook Air M3',
      3: 'AirPods Pro 2',
      4: 'iPad Pro 11寸',
      5: '小米14 Ultra',
      6: '华为Mate 60 Pro',
      7: '戴森V15吸尘器',
      8: '索尼WH-1000XM5'
    }
    return {
      code: 200,
      msg: '更新成功',
      data: {
        ...data,
        productName: productNames[data.productId] || '未知商品',
        activePeriod: `${data.startTime} ~ ${data.endTime}`
      }
    }
  },

  deleteSeckill: (id: string) => {
    return {
      code: 200,
      msg: '删除成功',
      data: null
    }
  },

  getDiscountList: (params?: { pageNum?: number; pageSize?: number; name?: string; status?: string }) => {
    const { pageNum = 1, pageSize = 10, name = '', status = '' } = params || {}

    const discounts: Discount[] = [
      { id: '1', productId: 1, productName: 'iPhone 15 Pro 256G', originalPrice: 7999, discountPrice: 7599, discountRate: 0.95, activePeriod: '2026-05-01 ~ 2026-05-31', status: 'active' },
      { id: '2', productId: 2, productName: 'MacBook Air M3', originalPrice: 8999, discountPrice: 8499, discountRate: 0.94, activePeriod: '2026-05-01 ~ 2026-05-31', status: 'active' },
      { id: '3', productId: 3, productName: 'AirPods Pro 2', originalPrice: 1899, discountPrice: 1699, discountRate: 0.89, activePeriod: '2026-04-01 ~ 2026-04-30', status: 'ended' },
      { id: '4', productId: 4, productName: 'iPad Pro 11寸', originalPrice: 6299, discountPrice: 5899, discountRate: 0.94, activePeriod: '2026-05-15 ~ 2026-05-31', status: 'active' },
      { id: '5', productId: 5, productName: '小米14 Ultra', originalPrice: 5999, discountPrice: 5499, discountRate: 0.92, activePeriod: '2026-05-01 ~ 2026-05-20', status: 'ended' },
      { id: '6', productId: 6, productName: '华为Mate 60 Pro', originalPrice: 6999, discountPrice: 6499, discountRate: 0.93, activePeriod: '2026-05-10 ~ 2026-05-31', status: 'active' },
      { id: '7', productId: 7, productName: '戴森V15吸尘器', originalPrice: 4999, discountPrice: 4499, discountRate: 0.9, activePeriod: '2026-05-20 ~ 2026-06-10', status: 'pending' },
      { id: '8', productId: 8, productName: '索尼WH-1000XM5', originalPrice: 2999, discountPrice: 2699, discountRate: 0.9, activePeriod: '2026-05-01 ~ 2026-05-31', status: 'active' },
      { id: '9', productId: 9, productName: '联想拯救者Y9000P', originalPrice: 9999, discountPrice: 9499, discountRate: 0.95, activePeriod: '2026-05-15 ~ 2026-05-31', status: 'active' },
      { id: '10', productId: 10, productName: '华硕ROG冰刃7', originalPrice: 24999, discountPrice: 22999, discountRate: 0.92, activePeriod: '2026-06-01 ~ 2026-06-30', status: 'pending' }
    ]

    let filtered = discounts
    if (name) {
      filtered = filtered.filter(d => d.productName.includes(name))
    }
    if (status) {
      filtered = filtered.filter(d => d.status === status)
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

  addDiscount: (data: Omit<Discount, 'id' | 'productName' | 'status'> & { startDate: string; endDate: string }) => {
    const productNames: Record<number, string> = {
      1: 'iPhone 15 Pro 256G',
      2: 'MacBook Air M3',
      3: 'AirPods Pro 2',
      4: 'iPad Pro 11寸',
      5: '小米14 Ultra',
      6: '华为Mate 60 Pro',
      7: '戴森V15吸尘器',
      8: '索尼WH-1000XM5',
      9: '联想拯救者Y9000P',
      10: '华硕ROG冰刃7'
    }
    return {
      code: 200,
      msg: '新增成功',
      data: {
        id: Date.now().toString(),
        ...data,
        productName: productNames[data.productId] || '未知商品',
        activePeriod: `${data.startDate} ~ ${data.endDate}`,
        status: 'pending'
      }
    }
  },

  updateDiscount: (data: Omit<Discount, 'productName'> & { startDate: string; endDate: string }) => {
    const productNames: Record<number, string> = {
      1: 'iPhone 15 Pro 256G',
      2: 'MacBook Air M3',
      3: 'AirPods Pro 2',
      4: 'iPad Pro 11寸',
      5: '小米14 Ultra',
      6: '华为Mate 60 Pro',
      7: '戴森V15吸尘器',
      8: '索尼WH-1000XM5',
      9: '联想拯救者Y9000P',
      10: '华硕ROG冰刃7'
    }
    return {
      code: 200,
      msg: '更新成功',
      data: {
        ...data,
        productName: productNames[data.productId] || '未知商品',
        activePeriod: `${data.startDate} ~ ${data.endDate}`
      }
    }
  },

  deleteDiscount: (id: string) => {
    return {
      code: 200,
      msg: '删除成功',
      data: null
    }
  }
}
