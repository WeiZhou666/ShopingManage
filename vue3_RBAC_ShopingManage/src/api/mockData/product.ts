interface ProductParams {
  pageNum?: number
  pageSize?: number
  keyword?: string
  category?: string
  status?: string | number
}

interface ProductData {
  id: number
  name: string
  category: string
  price: number
  originalPrice: number
  stock: number
  status: number
  createTime: string
  description: string
}

export default {
  // 获取商品列表
  getProductList: (params?: ProductParams) => {
    const {
      pageNum = 1,
      pageSize = 10,
      keyword = '',
      category = '',
      status = ''
    } = params || {}

    const allProducts: ProductData[] = [
      { id: 1001, name: 'iPhone 15 Pro Max 256GB 原色钛金属', category: '数码', price: 8999, originalPrice: 9999, stock: 156, status: 1, createTime: '2025-05-10', description: 'Apple 旗舰手机，A17 Pro 芯片' },
      { id: 1002, name: '华为 Mate 60 Pro 512GB 雅丹黑', category: '数码', price: 6999, originalPrice: 7999, stock: 89, status: 1, createTime: '2025-05-09', description: '华为旗舰手机，卫星通话' },
      { id: 1003, name: '小米 14 Ultra 256GB 白色', category: '数码', price: 5999, originalPrice: 6499, stock: 0, status: 0, createTime: '2025-05-08', description: '小米旗舰，徕卡光学' },
      { id: 1004, name: 'MacBook Pro 14英寸 M3 Pro 芯片 512GB', category: '数码', price: 12999, originalPrice: 14999, stock: 45, status: 1, createTime: '2025-05-12', description: 'Apple 笔记本电脑' },
      { id: 1005, name: '联想 ThinkPad X1 Carbon 2025款 1TB', category: '数码', price: 9999, originalPrice: 10999, stock: 32, status: 1, createTime: '2025-05-07', description: '商务轻薄本' },
      { id: 1006, name: 'iPad Air M2 芯片 256GB 星光色', category: '数码', price: 4799, originalPrice: 5499, stock: 120, status: 1, createTime: '2025-05-11', description: 'Apple 平板电脑' },
      { id: 1007, name: 'AirPods Pro 第二代 USB-C', category: '数码', price: 1799, originalPrice: 1899, stock: 200, status: 1, createTime: '2025-05-06', description: '主动降噪耳机' },
      { id: 1008, name: '小米手环 9 Pro 曜石黑', category: '数码', price: 399, originalPrice: 449, stock: 480, status: 1, createTime: '2025-05-13', description: '智能手环，血氧监测' },
      { id: 1009, name: '春季新款法式碎花连衣裙 均码', category: '服饰', price: 299, originalPrice: 499, stock: 65, status: 1, createTime: '2025-05-01', description: '轻薄雪纺面料，显瘦A字版型' },
      { id: 1010, name: '男士商务休闲纯棉衬衫 修身款 白色 L码', category: '服饰', price: 199, originalPrice: 359, stock: 88, status: 1, createTime: '2025-05-02', description: '100%纯棉，免烫处理' },
      { id: 1011, name: '儿童纯棉卡通卫衣 3-12岁可选 蓝色', category: '服饰', price: 89, originalPrice: 159, stock: 0, status: 0, createTime: '2025-04-28', description: '舒适透气，萌趣印花' },
      { id: 1012, name: '夏季冰丝防晒衣 UPF50+ 男女同款 均码', category: '服饰', price: 129, originalPrice: 199, stock: 150, status: 1, createTime: '2025-05-10', description: '冰丝面料，轻薄透气' },
      { id: 1013, name: '高腰阔腿牛仔裤 复古蓝 女士 S-2XL', category: '服饰', price: 259, originalPrice: 399, stock: 72, status: 1, createTime: '2025-05-08', description: '弹力牛仔面料，显瘦显高' },
      { id: 1014, name: 'SK-II 神仙水 230ml 经典版', category: '美妆', price: 1290, originalPrice: 1790, stock: 43, status: 1, createTime: '2025-05-05', description: 'PITERA 精华露，保湿修护' },
      { id: 1015, name: '兰蔻小黑瓶精华液 50ml', category: '美妆', price: 980, originalPrice: 1280, stock: 56, status: 1, createTime: '2025-05-04', description: '肌底精华，强韧屏障' },
      { id: 1016, name: 'MAC 子弹头唇膏 Chili 铁锈红 3g', category: '美妆', price: 159, originalPrice: 199, stock: 0, status: 0, createTime: '2025-04-20', description: '经典色号，哑光质地' },
      { id: 1017, name: '完美日记 十二色动物眼影盘 赤狐盘', category: '美妆', price: 109, originalPrice: 149, stock: 200, status: 1, createTime: '2025-05-12', description: '国货眼影，显色持久' },
      { id: 1018, name: '花西子 空气蜜粉 控油定妆 01自然色', category: '美妆', price: 169, originalPrice: 219, stock: 134, status: 1, createTime: '2025-05-11', description: '微米级粉质，隐形毛孔' },
      { id: 1019, name: '澳洲谷饲原切西冷牛排 200g×5片', category: '食品', price: 129, originalPrice: 189, stock: 92, status: 1, createTime: '2025-05-13', description: '谷饲200天，鲜嫩多汁' },
      { id: 1020, name: '良品铺子坚果大礼盒 10袋装 1500g', category: '食品', price: 89, originalPrice: 139, stock: 300, status: 1, createTime: '2025-05-09', description: '6种坚果搭配，年货送礼' },
      { id: 1021, name: '三只松鼠纯肉肠 原味 500g×2包', category: '食品', price: 49, originalPrice: 69, stock: 180, status: 1, createTime: '2025-05-14', description: '纯肉制作，无添加淀粉' },
      { id: 1022, name: '佳沛新西兰金奇异果 12粒礼盒装', category: '食品', price: 79, originalPrice: 99, stock: 0, status: 0, createTime: '2025-04-30', description: '进口奇异果，香甜多汁' },
      { id: 1023, name: '农夫山泉 NFC果汁 100%橙汁 300ml×12瓶', category: '食品', price: 59, originalPrice: 79, stock: 250, status: 1, createTime: '2025-05-10', description: '非浓缩还原，鲜果压榨' },
      { id: 1024, name: '三星 Galaxy Watch 7 蓝牙版 44mm', category: '数码', price: 1999, originalPrice: 2299, stock: 67, status: 1, createTime: '2025-05-08', description: '智能手表，健康追踪' },
      { id: 1025, name: '戴森 V15 Detect 无线吸尘器', category: '数码', price: 4990, originalPrice: 5990, stock: 23, status: 1, createTime: '2025-05-03', description: '激光探测微尘，强劲吸力' },
      { id: 1026, name: '秋冬加厚羊绒大衣 女士中长款 驼色', category: '服饰', price: 699, originalPrice: 1299, stock: 38, status: 1, createTime: '2025-04-15', description: '100%山羊绒，双面呢' },
      { id: 1027, name: '雅诗兰黛DW持妆粉底液 30ml 1W1', category: '美妆', price: 380, originalPrice: 480, stock: 110, status: 1, createTime: '2025-05-06', description: '油皮亲妈，24小时持妆' },
      { id: 1028, name: '百草味手撕鱿鱼条 麻辣味 200g', category: '食品', price: 29, originalPrice: 39, stock: 420, status: 1, createTime: '2025-05-12', description: '即食海鲜零食' }
    ]

    // 筛选
    let filtered = allProducts

    // 按关键词搜索：同时匹配商品名称（模糊）和商品ID（精确）
    if (keyword) {
      const numId = parseInt(keyword)
      if (!isNaN(numId)) {
        // 输入的是数字，同时按名称模糊和ID精确匹配
        filtered = filtered.filter(p => p.name.includes(keyword) || p.id === numId)
      } else {
        filtered = filtered.filter(p => p.name.includes(keyword))
      }
    }

    // 按分类筛选
    if (category) {
      filtered = filtered.filter(p => p.category === category)
    }

    // 按状态筛选
    if (status !== '' && status !== undefined) {
      filtered = filtered.filter(p => p.status === parseInt(status as string))
    }

    
    // 分页
    const start = ((pageNum as number) - 1) * (pageSize as number)
    const end = start + (pageSize as number)
    const list = filtered.slice(start, end)

    return {
      code: 200,
      msg: 'success',
      data: {
        list,
        total: filtered.length,
        pageNum: parseInt(pageNum as unknown as string),
        pageSize: parseInt(pageSize as unknown as string)
      }
    }
  },

  // 获取商品编辑数据（含 SKU 规格）
  getProductEdit: (id: number) => {
    const allProducts: Record<string, any> = {
      '1001': {
        id: 1001, name: 'iPhone 15 Pro Max 256GB 原色钛金属', category: '数码', price: 8999, originalPrice: 9999, stock: 156, status: 1, description: 'Apple 旗舰手机，A17 Pro 芯片',
        skus: [
          { spec: '256GB / 原色钛金属', stock: 50, price: 8999 },
          { spec: '256GB / 蓝色钛金属', stock: 56, price: 8999 },
          { spec: '512GB / 原色钛金属', stock: 30, price: 9999 },
          { spec: '512GB / 蓝色钛金属', stock: 20, price: 9999 }
        ]
      },
      '1002': {
        id: 1002, name: '华为 Mate 60 Pro 512GB 雅丹黑', category: '数码', price: 6999, originalPrice: 7999, stock: 89, status: 1, description: '华为旗舰手机，卫星通话',
        skus: [
          { spec: '512GB / 雅丹黑', stock: 40, price: 6999 },
          { spec: '512GB / 白沙银', stock: 49, price: 6999 }
        ]
      },
      '1009': {
        id: 1009, name: '春季新款法式碎花连衣裙 均码', category: '服饰', price: 299, originalPrice: 499, stock: 65, status: 1, description: '轻薄雪纺面料，显瘦A字版型',
        skus: [
          { spec: '蓝色碎花 / 均码', stock: 25, price: 299 },
          { spec: '粉色碎花 / 均码', stock: 20, price: 299 },
          { spec: '黄色碎花 / 均码', stock: 20, price: 299 }
        ]
      },
      '1014': {
        id: 1014, name: 'SK-II 神仙水 230ml 经典版', category: '美妆', price: 1290, originalPrice: 1790, stock: 43, status: 1, description: 'PITERA 精华露，保湿修护',
        skus: [
          { spec: '230ml / 经典版', stock: 43, price: 1290 }
        ]
      },
      '1019': {
        id: 1019, name: '澳洲谷饲原切西冷牛排 200g×5片', category: '食品', price: 129, originalPrice: 189, stock: 92, status: 1, description: '谷饲200天，鲜嫩多汁',
        skus: [
          { spec: '200g×5片', stock: 92, price: 129 }
        ]
      }
    }

    const product = allProducts[id]
    if (!product) {
      // 如果不在预定义列表中，从 getProductList 的数据中构造一个基本结构
      return {
        code: 200,
        msg: 'success',
        data: {
          id,
          name: '',
          category: '',
          price: undefined,
          originalPrice: undefined,
          stock: undefined,
          status: 1,
          description: '',
          skus: []
        }
      }
    }

    return {
      code: 200,
      msg: 'success',
      data: product
    }
  },

  // 新增商品
  addProduct: (data: any) => {
    return {
      code: 200,
      msg: '添加成功',
      data: {
        id: Math.floor(Math.random() * 9000) + 2000,
        ...data,
        createTime: new Date().toISOString().split('T')[0],
        status: 1
      }
    }
  },

  // 编辑商品
  updateProduct: (data: any) => {
    return {
      code: 200,
      msg: '更新成功',
      data
    }
  },

  // 删除商品
  deleteProduct: (id: number) => {
    return {
      code: 200,
      msg: '删除成功',
      data: null
    }
  },

  // 批量删除商品
  batchDeleteProducts: (ids: number[]) => {
    return {
      code: 200,
      msg: '批量删除成功',
      data: null
    }
  },

  // 上下架切换
  updateProductStatus: (id: number, status: number) => {
    return {
      code: 200,
      msg: status === 1 ? '已上架' : '已下架',
      data: { id, status }
    }
  }
}
