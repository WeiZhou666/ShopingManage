import sequelize from '../../config/db.js'
import { Sequelize } from 'sequelize'

// 订单模型
// status: 0-待付款 1-待发货 2-已发货 3-已完成 4-已退款
const order = sequelize.define('order', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  order_no: {
    type: Sequelize.STRING(30),
    allowNull: false,
    unique: true,
    field: 'order_no'
  },
  user_name: {
    type: Sequelize.STRING(20),
    allowNull: false,
    field: 'user_name'
  },
  user_phone: {
    type: Sequelize.STRING(11),
    allowNull: false,
    field: 'user_phone'
  },
  product_name: {
    type: Sequelize.STRING(100),
    allowNull: false,
    field: 'product_name'
  },
  product_count: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1,
    field: 'product_count'
  },
  amount: {
    type: Sequelize.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'amount',
    get() {
      const val = this.getDataValue('amount')
      return val === null ? 0 : Number(val)
    }
  },
  status: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'status'
  },
  create_time: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
    field: 'create_time'
  },
  // 订单详情相关字段
  pay_time: {
    type: Sequelize.DATE,
    allowNull: true,
    field: 'pay_time'
  },
  delivery_time: {
    type: Sequelize.DATE,
    allowNull: true,
    field: 'delivery_time'
  },
  complete_time: {
    type: Sequelize.DATE,
    allowNull: true,
    field: 'complete_time'
  },
  payment_method: {
    type: Sequelize.STRING(20),
    allowNull: true,
    field: 'payment_method'
  },
  freight: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'freight',
    get() {
      const val = this.getDataValue('freight')
      return val === null ? 0 : Number(val)
    }
  },
  coupon: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'coupon',
    get() {
      const val = this.getDataValue('coupon')
      return val === null ? 0 : Number(val)
    }
  },
  paid_amount: {
    type: Sequelize.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'paid_amount',
    get() {
      const val = this.getDataValue('paid_amount')
      return val === null ? 0 : Number(val)
    }
  },
  recipient_name: {
    type: Sequelize.STRING(20),
    allowNull: true,
    field: 'recipient_name'
  },
  recipient_phone: {
    type: Sequelize.STRING(11),
    allowNull: true,
    field: 'recipient_phone'
  },
  recipient_address: {
    type: Sequelize.STRING(200),
    allowNull: true,
    field: 'recipient_address'
  },
  logistics_company: {
    type: Sequelize.STRING(50),
    allowNull: true,
    field: 'logistics_company'
  },
  tracking_no: {
    type: Sequelize.STRING(50),
    allowNull: true,
    field: 'tracking_no'
  }
}, {
  tableName: 'orders',
  freezeTableName: true,
  timestamps: false,
  indexes: [
    // order_no：唯一索引，同时用于订单号模糊搜索
    { unique: true, fields: ['order_no'] },
    // status：订单状态筛选
    { fields: ['status'] },
    // create_time：日期范围筛选 + 列表默认按下单时间倒序
    { fields: ['create_time'] }
  ]
})

export default order
