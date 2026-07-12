interface UserParams {
  pageNum?: number
  pageSize?: number
  phone?: string
  tag?: string
  status?: string | number
  startDate?: string
  endDate?: string
}

interface UserData {
  id: string
  nickname: string
  phone: string
  registerTime: string
  totalConsumption: number
  orderCount: number
  tags: string[]
  status: number
  lastLoginTime?: string
}

export default {
  // 获取用户列表
  getUserList: (params?: UserParams) => {
    // 解构params, 并设置默认值
    const {
      pageNum = 1,
      pageSize = 10,
      phone = '',
      tag = '',
      status = '',
      startDate = '',
      endDate = '' } = params || {}

    // 固定用户数据（按需求文档格式）
    const allUsers: UserData[] = [
      { id: '1', nickname: '张三', phone: '13800138001', registerTime: '2024-01-15', totalConsumption: 12580.50, orderCount: 23, tags: ['优质客户'], status: 1 },
      { id: '2', nickname: '李四', phone: '13800138002', registerTime: '2024-01-18', totalConsumption: 3580.00, orderCount: 8, tags: ['普通客户'], status: 1 },
      { id: '3', nickname: '王五', phone: '13800138003', registerTime: '2024-02-01', totalConsumption: 28960.00, orderCount: 45, tags: ['优质客户', 'VIP客户'], status: 1 },
      { id: '4', nickname: '赵六', phone: '13800138004', registerTime: '2024-02-10', totalConsumption: 1200.00, orderCount: 3, tags: ['恶意用户'], status: 0 },
      { id: '5', nickname: '钱七', phone: '13800138005', registerTime: '2024-02-15', totalConsumption: 8920.00, orderCount: 15, tags: ['普通客户'], status: 1 },
      { id: '6', nickname: '孙八', phone: '13800138006', registerTime: '2024-02-20', totalConsumption: 45680.00, orderCount: 68, tags: ['优质客户'], status: 1 },
      { id: '7', nickname: '周九', phone: '13800138007', registerTime: '2024-03-01', totalConsumption: 6750.00, orderCount: 12, tags: ['普通客户'], status: 1 },
      { id: '8', nickname: '吴十', phone: '13800138008', registerTime: '2024-03-05', totalConsumption: 450.00, orderCount: 2, tags: ['恶意用户'], status: 0 },
      { id: '9', nickname: '郑十一', phone: '13800138009', registerTime: '2024-03-10', totalConsumption: 15680.00, orderCount: 28, tags: ['优质客户'], status: 1 },
      { id: '10', nickname: '王十二', phone: '13800138010', registerTime: '2024-03-15', totalConsumption: 9870.00, orderCount: 18, tags: ['普通客户'], status: 1 },
      { id: '11', nickname: '冯十三', phone: '13800138011', registerTime: '2024-03-18', totalConsumption: 23400.00, orderCount: 35, tags: ['优质客户'], status: 1 },
      { id: '12', nickname: '陈十四', phone: '13800138012', registerTime: '2024-03-20', totalConsumption: 1500.00, orderCount: 4, tags: ['普通客户', '恶意用户'], status: 1 },
      { id: '13', nickname: '褚十五', phone: '13800138013', registerTime: '2024-03-22', totalConsumption: 890.00, orderCount: 2, tags: ['恶意用户'], status: 0 },
      { id: '14', nickname: '卫十六', phone: '13800138014', registerTime: '2024-03-25', totalConsumption: 18920.00, orderCount: 32, tags: ['优质客户'], status: 1 },
      { id: '15', nickname: '蒋十七', phone: '13800138015', registerTime: '2024-03-28', totalConsumption: 7650.00, orderCount: 14, tags: ['普通客户'], status: 1 },
      { id: '16', nickname: '沈十八', phone: '13800138016', registerTime: '2024-04-01', totalConsumption: 32100.00, orderCount: 48, tags: ['优质客户', 'VIP客户'], status: 1 },
      { id: '17', nickname: '韩十九', phone: '13800138017', registerTime: '2024-04-03', totalConsumption: 4500.00, orderCount: 9, tags: ['普通客户'], status: 1 },
      { id: '18', nickname: '杨二十', phone: '13800138018', registerTime: '2024-04-05', totalConsumption: 1200.00, orderCount: 3, tags: ['恶意用户'], status: 0 },
      { id: '19', nickname: '朱廿一', phone: '13800138019', registerTime: '2024-04-08', totalConsumption: 21580.00, orderCount: 36, tags: ['优质客户'], status: 1 },
      { id: '20', nickname: '秦廿二', phone: '13800138020', registerTime: '2024-04-10', totalConsumption: 5680.00, orderCount: 11, tags: ['普通客户'], status: 1 }
    ]

    // 复制一份用户数组，用于后续筛选操作（不修改原始数据，浅拷贝）
    let filteredUsers = [...allUsers];

    // 按手机号筛选（精确匹配）,filter方法返回一个新的数组,不修改原始数组
    if (phone) {
      filteredUsers = filteredUsers.filter(user => user.phone === phone)
    }

    // 按标签筛选
    if (tag) {
      filteredUsers = filteredUsers.filter(user => user.tags.includes(tag))
    }

    // 按状态筛选
    if (status !== '' && status !== undefined) {
      filteredUsers = filteredUsers.filter(user => user.status === parseInt(status as string))
    }

    // 按注册时间范围筛选
    if (startDate) {
      filteredUsers = filteredUsers.filter(user => user.registerTime >= startDate)
    }
    if (endDate) {
      filteredUsers = filteredUsers.filter(user => user.registerTime <= endDate)
    }

    // 分页
    const start = ((pageNum as number) - 1) * (pageSize as number)
    const end = start + (pageSize as number)
    const list = filteredUsers.slice(start, end)

    return {
      code: 200,
      msg: 'success',
      data: {
        list,
        total: filteredUsers.length,
        pageNum: parseInt(pageNum as unknown as string),
        pageSize: parseInt(pageSize as unknown as string)
      }
    }
  },

  // 获取单个用户详情
  getUserDetail: (id: string) => {
    const users: Record<string, UserData & {
      lastLoginTime: string,
      avgOrderAmount: number,
      addresses: Array<{ id: number, name: string, phone: string, address: string, isDefault: boolean }>,
      recentOrders: Array<{ orderId: string, product: string, amount: string, status: string, time: string }>,
      operationLogs: Array<{ time: string, operator: string, action: string }>
    }> = {
      '1': {
        id: '1', nickname: '张三', phone: '13800138001', registerTime: '2024-01-15', totalConsumption: 12580.50, orderCount: 23, tags: ['优质客户'], status: 1, lastLoginTime: '2024-04-20 14:25:30', avgOrderAmount: 546.98,
        addresses: [
          { id: 1, name: '张三', phone: '13800138001', address: '广东省深圳市南山区科苑路88号', isDefault: true },
          { id: 2, name: '张三', phone: '13800138002', address: '北京市朝阳区建国路88号', isDefault: false }
        ],
        recentOrders: [
          { orderId: '202604200001', product: 'iPhone 15 Pro x1', amount: '7999.00', status: '已完成', time: '04-20 14:00' },
          { orderId: '202604150002', product: 'AirPods Pro x1', amount: '1899.00', status: '已完成', time: '04-15 10:30' },
          { orderId: '202604100003', product: 'MacBook Air x1', amount: '8999.00', status: '已完成', time: '04-10 16:45' }
        ],
        operationLogs: [
          { time: '2024-04-20 14:00:00', operator: '系统', action: '用户登录' },
          { time: '2024-04-15 10:00:00', operator: '客服小王', action: '修改用户标签：普通客户 → 优质客户' },
          { time: '2024-01-15 09:00:00', operator: '系统', action: '新用户注册' }
        ]
      },
      '2': {
        id: '2', nickname: '李四', phone: '13800138002', registerTime: '2024-01-18', totalConsumption: 3580.00, orderCount: 8, tags: ['普通客户'], status: 1, lastLoginTime: '2024-04-19 16:40:00', avgOrderAmount: 447.50,
        addresses: [
          { id: 1, name: '李四', phone: '13800138002', address: '上海市浦东新区张江路123号', isDefault: true }
        ],
        recentOrders: [
          { orderId: '202604190001', product: '小米手环8 x1', amount: '299.00', status: '已完成', time: '04-19 16:00' },
          { orderId: '202604100002', product: '华为平板 x1', amount: '2299.00', status: '已完成', time: '04-10 11:20' }
        ],
        operationLogs: [
          { time: '2024-04-19 16:00:00', operator: '系统', action: '用户登录' },
          { time: '2024-01-18 09:00:00', operator: '系统', action: '新用户注册' }
        ]
      },
      '3': {
        id: '3', nickname: '王五', phone: '13800138003', registerTime: '2024-02-01', totalConsumption: 28960.00, orderCount: 45, tags: ['优质客户', 'VIP客户'], status: 1, lastLoginTime: '2024-04-21 09:10:00', avgOrderAmount: 643.56,
        addresses: [
          { id: 1, name: '王五', phone: '13800138003', address: '浙江省杭州市西湖区文三路88号', isDefault: true },
          { id: 2, name: '王五', phone: '13800138004', address: '广东省广州市天河区天河路100号', isDefault: false },
          { id: 3, name: '王五', phone: '13800138005', address: '江苏省南京市鼓楼区中山路66号', isDefault: false }
        ],
        recentOrders: [
          { orderId: '202604210001', product: '戴森吸尘器 x1', amount: '4999.00', status: '已完成', time: '04-21 09:00' },
          { orderId: '202604180002', product: 'iPad Pro x1', amount: '7999.00', status: '已完成', time: '04-18 14:30' },
          { orderId: '202604150003', product: 'Apple Watch x1', amount: '3299.00', status: '已完成', time: '04-15 10:00' }
        ],
        operationLogs: [
          { time: '2024-04-21 09:00:00', operator: '系统', action: '用户登录' },
          { time: '2024-02-01 09:00:00', operator: '系统', action: '新用户注册' }
        ]
      },
      '4': {
        id: '4', nickname: '赵六', phone: '13800138004', registerTime: '2024-02-10', totalConsumption: 1200.00, orderCount: 3, tags: ['恶意用户'], status: 0, lastLoginTime: '2024-03-15 17:30:00', avgOrderAmount: 400.00,
        addresses: [
          { id: 1, name: '赵六', phone: '13800138004', address: '四川省成都市武侯区天府大道88号', isDefault: true }
        ],
        recentOrders: [
          { orderId: '202403150001', product: '三星手机 x1', amount: '599.00', status: '已退款', time: '03-15 17:00' }
        ],
        operationLogs: [
          { time: '2024-03-15 17:00:00', operator: '客服小李', action: '标记为恶意用户' },
          { time: '2024-03-15 17:30:00', operator: '系统', action: '禁用账号' }
        ]
      },
      '5': {
        id: '5', nickname: '钱七', phone: '13800138005', registerTime: '2024-02-15', totalConsumption: 8920.00, orderCount: 15, tags: ['普通客户'], status: 1, lastLoginTime: '2024-04-18 10:55:00', avgOrderAmount: 594.67,
        addresses: [
          { id: 1, name: '钱七', phone: '13800138005', address: '湖北省武汉市洪山区珞喻路78号', isDefault: true },
          { id: 2, name: '钱七', phone: '13800138006', address: '湖南省长沙市岳麓区麓山南路66号', isDefault: false }
        ],
        recentOrders: [
          { orderId: '202604180001', product: '联想笔记本 x1', amount: '4999.00', status: '已完成', time: '04-18 10:00' },
          { orderId: '202604120002', product: '罗技鼠标 x1', amount: '299.00', status: '已完成', time: '04-12 15:30' }
        ],
        operationLogs: [
          { time: '2024-04-18 10:00:00', operator: '系统', action: '用户登录' },
          { time: '2024-02-15 09:00:00', operator: '系统', action: '新用户注册' }
        ]
      },
      '6': {
        id: '6', nickname: '孙八', phone: '13800138006', registerTime: '2024-02-20', totalConsumption: 45680.00, orderCount: 68, tags: ['优质客户'], status: 1, lastLoginTime: '2024-04-22 08:20:00', avgOrderAmount: 671.76,
        addresses: [
          { id: 1, name: '孙八', phone: '13800138006', address: '福建省福州市鼓楼区五一路120号', isDefault: true },
          { id: 2, name: '孙八', phone: '13800138007', address: '山东省青岛市市南区香港中路88号', isDefault: false }
        ],
        recentOrders: [
          { orderId: '202604220001', product: '索尼相机 x1', amount: '12999.00', status: '已完成', time: '04-22 08:00' },
          { orderId: '202604200002', product: '劳力士手表 x1', amount: '89999.00', status: '已完成', time: '04-20 14:00' }
        ],
        operationLogs: [
          { time: '2024-04-22 08:00:00', operator: '系统', action: '用户登录' },
          { time: '2024-02-20 09:00:00', operator: '系统', action: '新用户注册' }
        ]
      },
      '7': {
        id: '7', nickname: '周九', phone: '13800138007', registerTime: '2024-03-01', totalConsumption: 6750.00, orderCount: 12, tags: ['普通客户'], status: 1, lastLoginTime: '2024-04-23 11:00:00', avgOrderAmount: 562.50,
        addresses: [
          { id: 1, name: '周九', phone: '13800138007', address: '河南省郑州市金水区花园路88号', isDefault: true }
        ],
        recentOrders: [
          { orderId: '202604230001', product: '格力空调 x1', amount: '3299.00', status: '已完成', time: '04-23 10:30' },
          { orderId: '202604150002', product: '美的冰箱 x1', amount: '2599.00', status: '已完成', time: '04-15 14:00' }
        ],
        operationLogs: [
          { time: '2024-04-23 10:00:00', operator: '系统', action: '用户登录' },
          { time: '2024-03-01 09:00:00', operator: '系统', action: '新用户注册' }
        ]
      },
      '8': {
        id: '8', nickname: '吴十', phone: '13800138008', registerTime: '2024-03-05', totalConsumption: 450.00, orderCount: 2, tags: ['恶意用户'], status: 0, lastLoginTime: '2024-03-20 15:45:00', avgOrderAmount: 225.00,
        addresses: [
          { id: 1, name: '吴十', phone: '13800138008', address: '辽宁省沈阳市和平区三好街88号', isDefault: true }
        ],
        recentOrders: [
          { orderId: '202403200001', product: '小米手机 x1', amount: '1999.00', status: '已退款', time: '03-20 15:00' }
        ],
        operationLogs: [
          { time: '2024-03-20 15:00:00', operator: '客服小王', action: '标记为恶意用户' },
          { time: '2024-03-20 15:45:00', operator: '系统', action: '禁用账号' }
        ]
      },
      '9': {
        id: '9', nickname: '郑十一', phone: '13800138009', registerTime: '2024-03-10', totalConsumption: 15680.00, orderCount: 28, tags: ['优质客户'], status: 1, lastLoginTime: '2024-04-17 14:20:00', avgOrderAmount: 560.00,
        addresses: [
          { id: 1, name: '郑十一', phone: '13800138009', address: '陕西省西安市雁塔区科技路88号', isDefault: true },
          { id: 2, name: '郑十一', phone: '13800138010', address: '四川省成都市高新区天府大道120号', isDefault: false }
        ],
        recentOrders: [
          { orderId: '202604170001', product: '华为笔记本 x1', amount: '5999.00', status: '已完成', time: '04-17 14:00' },
          { orderId: '202604100002', product: '小米电视 x1', amount: '2999.00', status: '已完成', time: '04-10 11:30' }
        ],
        operationLogs: [
          { time: '2024-04-17 14:00:00', operator: '系统', action: '用户登录' },
          { time: '2024-03-10 09:00:00', operator: '系统', action: '新用户注册' }
        ]
      },
      '10': {
        id: '10', nickname: '王十二', phone: '13800138010', registerTime: '2024-03-15', totalConsumption: 9870.00, orderCount: 18, tags: ['普通客户'], status: 1, lastLoginTime: '2024-04-21 16:30:00', avgOrderAmount: 548.33,
        addresses: [
          { id: 1, name: '王十二', phone: '13800138010', address: '江苏省南京市玄武区中山路100号', isDefault: true }
        ],
        recentOrders: [
          { orderId: '202604210001', product: 'iPhone 14 x1', amount: '5999.00', status: '已完成', time: '04-21 16:00' },
          { orderId: '202604150002', product: 'AirPods x1', amount: '1299.00', status: '已完成', time: '04-15 09:30' }
        ],
        operationLogs: [
          { time: '2024-04-21 16:00:00', operator: '系统', action: '用户登录' },
          { time: '2024-03-15 09:00:00', operator: '系统', action: '新用户注册' }
        ]
      },
      '11': {
        id: '11', nickname: '冯十三', phone: '13800138011', registerTime: '2024-03-18', totalConsumption: 23400.00, orderCount: 35, tags: ['优质客户'], status: 1, lastLoginTime: '2024-04-19 09:15:00', avgOrderAmount: 668.57,
        addresses: [
          { id: 1, name: '冯十三', phone: '13800138011', address: '天津市南开区卫津路88号', isDefault: true },
          { id: 2, name: '冯十三', phone: '13800138012', address: '重庆市渝北区新南路100号', isDefault: false }
        ],
        recentOrders: [
          { orderId: '202604190001', product: '戴森吹风机 x1', amount: '2999.00', status: '已完成', time: '04-19 09:00' },
          { orderId: '202604150002', product: 'iPad Air x1', amount: '4599.00', status: '已完成', time: '04-15 14:30' }
        ],
        operationLogs: [
          { time: '2024-04-19 09:00:00', operator: '系统', action: '用户登录' },
          { time: '2024-03-18 09:00:00', operator: '系统', action: '新用户注册' }
        ]
      },
      '12': {
        id: '12', nickname: '陈十四', phone: '13800138012', registerTime: '2024-03-20', totalConsumption: 1500.00, orderCount: 4, tags: ['普通客户', '恶意用户'], status: 1, lastLoginTime: '2024-04-22 13:40:00', avgOrderAmount: 375.00,
        addresses: [
          { id: 1, name: '陈十四', phone: '13800138012', address: '广东省佛山市禅城区祖庙路88号', isDefault: true }
        ],
        recentOrders: [
          { orderId: '202604220001', product: 'OPPO手机 x1', amount: '2999.00', status: '已完成', time: '04-22 13:00' }
        ],
        operationLogs: [
          { time: '2024-04-22 13:00:00', operator: '系统', action: '用户登录' },
          { time: '2024-03-20 09:00:00', operator: '系统', action: '新用户注册' }
        ]
      },
      '13': {
        id: '13', nickname: '褚十五', phone: '13800138013', registerTime: '2024-03-22', totalConsumption: 890.00, orderCount: 2, tags: ['恶意用户'], status: 0, lastLoginTime: '2024-03-28 10:30:00', avgOrderAmount: 445.00,
        addresses: [
          { id: 1, name: '褚十五', phone: '13800138013', address: '山东省济南市历下区泉城路88号', isDefault: true }
        ],
        recentOrders: [
          { orderId: '202403280001', product: 'vivo手机 x1', amount: '1999.00', status: '已退款', time: '03-28 10:00' }
        ],
        operationLogs: [
          { time: '2024-03-28 10:00:00', operator: '客服小李', action: '标记为恶意用户' },
          { time: '2024-03-28 10:30:00', operator: '系统', action: '禁用账号' }
        ]
      },
      '14': {
        id: '14', nickname: '卫十六', phone: '13800138014', registerTime: '2024-03-25', totalConsumption: 18920.00, orderCount: 32, tags: ['优质客户'], status: 1, lastLoginTime: '2024-04-20 11:25:00', avgOrderAmount: 591.25,
        addresses: [
          { id: 1, name: '卫十六', phone: '13800138014', address: '浙江省宁波市鄞州区天童路88号', isDefault: true },
          { id: 2, name: '卫十六', phone: '13800138015', address: '江苏省苏州市姑苏区观前街100号', isDefault: false }
        ],
        recentOrders: [
          { orderId: '202604200001', product: '海尔冰箱 x1', amount: '4599.00', status: '已完成', time: '04-20 11:00' },
          { orderId: '202604150002', product: '西门子洗衣机 x1', amount: '3899.00', status: '已完成', time: '04-15 15:30' }
        ],
        operationLogs: [
          { time: '2024-04-20 11:00:00', operator: '系统', action: '用户登录' },
          { time: '2024-03-25 09:00:00', operator: '系统', action: '新用户注册' }
        ]
      },
      '15': {
        id: '15', nickname: '蒋十七', phone: '13800138015', registerTime: '2024-03-28', totalConsumption: 7650.00, orderCount: 14, tags: ['普通客户'], status: 1, lastLoginTime: '2024-04-18 15:50:00', avgOrderAmount: 546.43,
        addresses: [
          { id: 1, name: '蒋十七', phone: '13800138015', address: '湖北省武汉市江汉区解放大道88号', isDefault: true }
        ],
        recentOrders: [
          { orderId: '202604180001', product: '小天鹅烘干机 x1', amount: '3299.00', status: '已完成', time: '04-18 15:00' },
          { orderId: '202604100002', product: '苏泊尔电饭煲 x1', amount: '599.00', status: '已完成', time: '04-10 10:30' }
        ],
        operationLogs: [
          { time: '2024-04-18 15:00:00', operator: '系统', action: '用户登录' },
          { time: '2024-03-28 09:00:00', operator: '系统', action: '新用户注册' }
        ]
      },
      '16': {
        id: '16', nickname: '沈十八', phone: '13800138016', registerTime: '2024-04-01', totalConsumption: 32100.00, orderCount: 48, tags: ['优质客户', 'VIP客户'], status: 1, lastLoginTime: '2024-04-23 09:45:00', avgOrderAmount: 668.75,
        addresses: [
          { id: 1, name: '沈十八', phone: '13800138016', address: '广东省深圳市福田区福华路88号', isDefault: true },
          { id: 2, name: '沈十八', phone: '13800138017', address: '北京市海淀区中关村大街100号', isDefault: false },
          { id: 3, name: '沈十八', phone: '13800138018', address: '上海市静安区南京西路88号', isDefault: false }
        ],
        recentOrders: [
          { orderId: '202604230001', product: '保时捷911车模 x1', amount: '8999.00', status: '已完成', time: '04-23 09:00' },
          { orderId: '202604200002', product: '茅台酒 x2', amount: '5999.00', status: '已完成', time: '04-20 16:00' }
        ],
        operationLogs: [
          { time: '2024-04-23 09:00:00', operator: '系统', action: '用户登录' },
          { time: '2024-04-01 09:00:00', operator: '系统', action: '新用户注册' }
        ]
      },
      '17': {
        id: '17', nickname: '韩十九', phone: '13800138017', registerTime: '2024-04-03', totalConsumption: 4500.00, orderCount: 9, tags: ['普通客户'], status: 1, lastLoginTime: '2024-04-21 17:10:00', avgOrderAmount: 500.00,
        addresses: [
          { id: 1, name: '韩十九', phone: '13800138017', address: '四川省成都市锦江区春熙路88号', isDefault: true },
          { id: 2, name: '韩十九', phone: '13800138019', address: '重庆市渝中区解放碑100号', isDefault: false }
        ],
        recentOrders: [
          { orderId: '202604210001', product: '九阳豆浆机 x1', amount: '399.00', status: '已完成', time: '04-21 17:00' },
          { orderId: '202604150002', product: '飞利浦剃须刀 x1', amount: '699.00', status: '已完成', time: '04-15 11:00' }
        ],
        operationLogs: [
          { time: '2024-04-21 17:00:00', operator: '系统', action: '用户登录' },
          { time: '2024-04-03 09:00:00', operator: '系统', action: '新用户注册' }
        ]
      },
      '18': {
        id: '18', nickname: '杨二十', phone: '13800138018', registerTime: '2024-04-05', totalConsumption: 1200.00, orderCount: 3, tags: ['恶意用户'], status: 0, lastLoginTime: '2024-04-10 14:20:00', avgOrderAmount: 400.00,
        addresses: [
          { id: 1, name: '杨二十', phone: '13800138018', address: '浙江省温州市鹿城区人民路88号', isDefault: true }
        ],
        recentOrders: [
          { orderId: '202404100001', product: '红米手机 x1', amount: '999.00', status: '已退款', time: '04-10 14:00' }
        ],
        operationLogs: [
          { time: '2024-04-10 14:00:00', operator: '客服小王', action: '标记为恶意用户' },
          { time: '2024-04-10 14:20:00', operator: '系统', action: '禁用账号' }
        ]
      },
      '19': {
        id: '19', nickname: '朱廿一', phone: '13800138019', registerTime: '2024-04-08', totalConsumption: 21580.00, orderCount: 36, tags: ['优质客户'], status: 1, lastLoginTime: '2024-04-22 10:05:00', avgOrderAmount: 599.44,
        addresses: [
          { id: 1, name: '朱廿一', phone: '13800138019', address: '江苏省南京市建邺区江东中路88号', isDefault: true },
          { id: 2, name: '朱廿一', phone: '13800138020', address: '广东省广州市越秀区中山五路100号', isDefault: false }
        ],
        recentOrders: [
          { orderId: '202604220001', product: '联想拯救者笔记本 x1', amount: '7999.00', status: '已完成', time: '04-22 10:00' },
          { orderId: '202604180002', product: '罗技键盘 x1', amount: '899.00', status: '已完成', time: '04-18 14:30' }
        ],
        operationLogs: [
          { time: '2024-04-22 10:00:00', operator: '系统', action: '用户登录' },
          { time: '2024-04-08 09:00:00', operator: '系统', action: '新用户注册' }
        ]
      },
      '20': {
        id: '20', nickname: '秦廿二', phone: '13800138020', registerTime: '2024-04-10', totalConsumption: 5680.00, orderCount: 11, tags: ['普通客户'], status: 1, lastLoginTime: '2024-04-23 08:30:00', avgOrderAmount: 516.36,
        addresses: [
          { id: 1, name: '秦廿二', phone: '13800138020', address: '河南省郑州市二七区大学路88号', isDefault: true },
          { id: 2, name: '秦廿二', phone: '13800138021', address: '山东省济南市市中区共青团路100号', isDefault: false }
        ],
        recentOrders: [
          { orderId: '202604230001', product: '小米扫地机器人 x1', amount: '1699.00', status: '已完成', time: '04-23 08:00' },
          { orderId: '202604150002', product: '华为路由器 x1', amount: '399.00', status: '已完成', time: '04-15 16:00' }
        ],
        operationLogs: [
          { time: '2024-04-23 08:00:00', operator: '系统', action: '用户登录' },
          { time: '2024-04-10 09:00:00', operator: '系统', action: '新用户注册' }
        ]
      }
    }

    const u = users[id]
    if (!u) return { code: 200, msg: 'success', data: null }
    // 将内部 camelCase 字段转换为 snake_case，tags 数组转数字，与数据库 schema 对齐
    const { registerTime, lastLoginTime, totalConsumption, orderCount, avgOrderAmount, ...rest } = u
    const tagMap: Record<string, number> = { '优质客户': 1, '普通客户': 2, '恶意用户': 3 }
    return {
      code: 200,
      msg: 'success',
      data: {
        ...rest,
        register_time: registerTime,
        last_login_time: lastLoginTime,
        total_consumption: totalConsumption,
        order_count: orderCount,
        tags: tagMap[u.tags[0]] || 2
      }
    }
  },

  // 添加用户
  addUser: (data: any) => {
    return {
      code: 200,
      msg: '添加成功',
      data: {
        id: Date.now().toString(),
        ...data,
        registerTime: new Date().toISOString().split('T')[0]
      }
    }
  },

  // 更新用户
  updateUser: (data: any) => {
    return {
      code: 200,
      msg: '更新成功',
      data
    }
  },

  // 删除用户
  deleteUser: (id: string) => {

    return {
      code: 200,
      msg: '删除成功',
      data: null
    }
  },

  // 批量删除用户
  batchDeleteUsers: (ids: string[]) => {
    return {
      code: 200,
      msg: '批量删除成功',
      data: null
    }
  },

  // 修改用户状态
  updateUserStatus: (id: string, status: number) => {

    return {
      code: 200,
      msg: status === 1 ? '已启用' : '已禁用',
      data: { id, status }
    }
  },

  // 更新用户标签
  updateUserTags: (id: string, tags: string[]) => {
    return {
      code: 200,
      msg: '标签更新成功',
      data: { id, tags }
    }
  },

  // 获取角色列表
  getRoleList: () => {
    return {
      code: 200,
      msg: 'success',
      data: [
        { id: 1, name: '管理员', code: 'admin', description: '拥有所有权限' },
        { id: 2, name: '普通用户', code: 'user', description: '基础访问权限' },
        { id: 3, name: 'VIP用户', code: 'vip', description: '高级功能权限' },
        { id: 4, name: '编辑', code: 'editor', description: '内容编辑权限' }
      ]
    }
  },

  // 获取部门列表
  getDepartmentList: () => {
    return {
      code: 200,
      msg: 'success',
      data: [
        { id: 1, name: '技术部', code: 'tech' },
        { id: 2, name: '市场部', code: 'market' },
        { id: 3, name: '运营部', code: 'operation' },
        { id: 4, name: '财务部', code: 'finance' },
        { id: 5, name: '人事部', code: 'hr' }
      ]
    }
  }
}