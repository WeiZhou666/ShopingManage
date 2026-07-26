import sequelize from '../../config/db.js'
import { Sequelize } from 'sequelize'

// 优惠券模型
// type: full_reduction-满减 discount-折扣
// status: pending-未开始 active-进行中 ended-已结束
const coupon = sequelize.define('coupon', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING(50),
    allowNull: false
  },
  type: {
    type: Sequelize.STRING(20),
    allowNull: false
  },
  threshold: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    get() {
      const val = this.getDataValue('threshold')
      return val === null ? 0 : Number(val)
    }
  },
  discount: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    get() {
      const val = this.getDataValue('discount')
      return val === null ? 0 : Number(val)
    }
  },
  total_quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'total_quantity'
  },
  received_quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'received_quantity'
  },
  used_quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'used_quantity'
  },
  valid_period: {
    type: Sequelize.STRING(100),
    allowNull: false,
    field: 'valid_period'
  },
  status: {
    type: Sequelize.STRING(20),
    allowNull: false,
    defaultValue: 'pending'
  }
}, {
  tableName: 'coupons',
  freezeTableName: true,
  timestamps: false,
  indexes: [
    // name：优惠券名称模糊搜索
    { fields: ['name'] },
    // type：类型筛选
    { fields: ['type'] },
    // status：状态筛选
    { fields: ['status'] }
  ]
})

export default coupon
