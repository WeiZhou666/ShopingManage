export default {

  getTableData: () => {
    return {
      code: 200,
      msg: 'success',
      data: {
        list: [
          { id: 1, name: '张三', date: '2024-01-01', status: 1 },
          { id: 2, name: '李四', date: '2024-01-02', status: 2 }
        ]
      }
    }
  },
  getCountData: () => {
    return {
      code: 200,
      msg: 'success',
      data: {
        countData: [
          { name: '今日订单数', value: '128', icon: 'ShoppingCart', color: '#409eff', trend: 12 },
          { name: '今日成交金额', value: '45,680', icon: 'Money', color: '#67c23a', trend: 8 },
          { name: '待发货', value: '32', icon: 'Box', color: '#e6a23c', trend: -5 },
          { name: '待付款', value: '15', icon: 'Clock', color: '#f56c6c', trend: 3 },
          { name: '售后中', value: '8', icon: 'ChatDotRound', color: '#909399', trend: -2 }
        ]
      }
    }
  },
  getChartData: () => {
    return {
      code: 200,
      msg: 'success',
      data: {
        chartData: {
          xData: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          seriesData: [120, 200, 150, 280, 210, 350, 290, 380, 320, 450, 380, 520]
        }
      }
    }
  },
  // 柱状图数据
  getBarChartData: () => {
    return {
      code: 200,
      msg: 'success',
      data: {
        barChartData: {
          xData: ['电子产品', '服装', '食品', '家居', '美妆', '运动'],
          seriesData: [320, 280, 150, 220, 180, 260]
        }
      }
    }
  },
  // 饼图数据
  getPieChartData: () => {
    return {
      code: 200,
      msg: 'success',
      data: {
        pieChartData: [
          { name: '直接访问', value: 335 },
          { name: '搜索引擎', value: 310 },
          { name: '邮件营销', value: 234 },
          { name: '联盟广告', value: 135 },
          { name: '视频广告', value: 148 }
        ]
      }
    }
  },
  // 用户详情数据
  getUserDetail: (id: string | number) => {
    const mockData: Record<string, any> = {
      10001: {
        nickname: '小明',
        phone: '138****001',
        registerTime: '2025-05-01',
        lastLoginTime: '2025-05-12 10:30:45',
        totalConsumption: 5999.00,
        orderCount: 5,
        avgOrderAmount: 1199.00,
        status: 1,
        tags: ['优质客户'],
        addresses: [
          { id: 1, name: '张三', phone: '138****001', address: '广东省深圳市南山区科苑路88号', isDefault: true },
          { id: 2, name: '李四', phone: '139****002', address: '北京市朝阳区建国路88号', isDefault: false }
        ],
        recentOrders: [
          { orderId: '202605120001', product: 'iPhone 15 Pro x1', amount: '7799.00', status: '已完成', time: '05-12 10:00' },
          { orderId: '202605080002', product: '连衣裙 x2', amount: '598.00', status: '已完成', time: '05-08 15:30' },
          { orderId: '202605050001', product: '小米手机 x1', amount: '1999.00', status: '已退款', time: '05-05 09:20' }
        ],
        operationLogs: [
          { time: '2025-05-12 10:00:00', operator: '客服小王', action: '修改用户标签：普通客户 → 优质客户' },
          { time: '2025-05-01 09:00:00', operator: '系统', action: '新用户注册' }
        ]
      }
    }
    const data = mockData[id]
    return {
      code: data ? 200 : 404,
      msg: data ? 'success' : '用户不存在',
      data: data || null
    }
  }
}